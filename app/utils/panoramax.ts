
import type { GeoPoint, Picture } from '~~/types/geo';

import { booleanIntersects } from '@turf/boolean-intersects';
import { randomPoint } from '@turf/random';
import { bbox } from '@turf/bbox';

import searchAreas from '@/assets/data/geo/search_area.json';


/**
 * Get the full URL for some Panoramax API route
 * @param route The route to query, like /search
 * @returns The full URL
 */
export function getAPIUrl(route: string = "") {
  return `https://api.panoramax.xyz/api${route}`;
}


/**
 * Search areas used to generate random points.
 *
 * The search_area.json file contains the CCAPV territory.
 */
const SEARCH_AREAS = searchAreas.features.map((feature) => ({
  feature,
  bbox: bbox(feature)
}));


/**
 * Check if a geographic point is inside a search area.
 */
export function isPointInPolygon(
  point: GeoPoint,
  polygon: any
): boolean {
  return booleanIntersects(
    polygon,
    {
      type: 'Point',
      coordinates: [point.lng, point.lat]
    }
  );
}


/**
 * Generate random points inside the CCAPV territory.
 *
 * Points are first generated inside the bounding box,
 * then filtered to keep only points actually inside
 * the search polygon.
 */
export function getRandomPoints(): GeoPoint[] {
  const points: GeoPoint[] = [];

  do {
    const area =
      SEARCH_AREAS[
        Math.floor(Math.random() * SEARCH_AREAS.length)
      ];

    const point = randomPoint(1, {
      bbox: area.bbox
    }).features[0];

    const geopoint: GeoPoint = {
      lng: point.geometry.coordinates[0],
      lat: point.geometry.coordinates[1]
    };

    if (isPointInPolygon(geopoint, area.feature)) {
      points.push(geopoint);
    }

  } while (points.length < 10);

  return points;
}


/**
 * Find one or many Panoramax pictures IDs.
 *
 * @param amount The number of wanted Panoramax pictures
 * @return Picture ID & position
 */
export async function getPanoramaxPictureIDs(
  amount: number = 1
): Promise<Picture[]> {

  const pictures: Picture[] = [];

  let randomPoints: GeoPoint[] = [];

  let trials = 0;

  do {

    // Generate random points inside the CCAPV territory
    if (randomPoints.length === 0) {
      randomPoints = getRandomPoints();
    }

    // Search Panoramax around each random point
    do {

      const point = randomPoints.pop();

      if (!point) {
        break;
      }

      const pic = await queryPanoramaxAPI(point);

      if (!pic) {
        trials++;
      }

      if (
        pic &&
        !pictures.find(p => p.id === pic.id)
      ) {
        pictures.push(pic);
      }

      if (trials >= 10) {
        throw new Error("Can't find any pictures");
      }

    } while (
      randomPoints.length > 0 &&
      pictures.length < amount
    );

  } while (pictures.length < amount);

  return pictures;
}


/**
 * Find a valid picture on the Panoramax API
 * around a given geographic point.
 *
 * @param point The coordinates to look around
 * @returns The picture ID and position, or null
 */
export async function queryPanoramaxAPI(
  point: GeoPoint
): Promise<Picture | null> {

  const response = await fetch(
    getAPIUrl('/search'),
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        limit: 1,

        bbox: [
          point.lng - 2,
          point.lat - 2,
          point.lng + 2,
          point.lat + 2
        ],

        filter: 'field_of_view=360'
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Panoramax API error: ${response.status}`
    );
  }

  const data = await response.json();

  if (
    !data ||
    !data.features ||
    data.features.length === 0
  ) {
    return null;
  }

  const feature = data.features[0];

  if (
    !feature ||
    !feature.geometry ||
    !feature.geometry.coordinates ||
    feature.geometry.coordinates.length < 2
  ) {
    return null;
  }

  const picture: Picture = {
    id: feature.id,

    position: {
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0]
    }
  };

  /*
   * Check that the picture belongs to a sufficiently
   * populated collection.
   */
  const nbSameCollection =
    data.features.filter(
      (f: any) =>
        f.collection === feature.collection
    ).length;

  if (nbSameCollection === 10) {
    return picture;
  }

  /*
   * Check collection statistics.
   */
  if (feature.collection) {

    const collectionResponse = await fetch(
      getAPIUrl(
        `/collections/${feature.collection}`
      )
    );

    if (collectionResponse.ok) {

      const collectionData =
        await collectionResponse.json();

      if (
        collectionData?.['stats:items']?.count >= 30
      ) {
        return picture;
      }
    }
  }

  return null;
}


/**
 * Get the geographic position of a Panoramax picture.
 *
 * This is kept as a client-side helper for cases where
 * only the picture ID is available.
 */
export async function getPicturePosition(
  pictureId: string
): Promise<GeoPoint> {

  const response = await fetch(
    getAPIUrl(`/search?ids=${pictureId}`),
    {
      method: 'GET',

      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch picture with ID ${pictureId}`
    );
  }

  const data = await response.json();

  if (
    !data ||
    !data.features ||
    !data.features.length
  ) {
    throw new Error(
      `No data found for picture ID ${pictureId}`
    );
  }

  const feature = data.features[0];

  if (
    !feature ||
    !feature.geometry ||
    !feature.geometry.coordinates ||
    feature.geometry.coordinates.length < 2
  ) {
    throw new Error(
      `Invalid data for picture ID ${pictureId}`
    );
  }

  const [lng, lat] =
    feature.geometry.coordinates;

  return {
    lat,
    lng
  };
}


/**
 * Calculate the distance between two geographic points
 * using the Haversine formula.
 *
 * @returns Distance in meters
 */
export function haversineDistance(
  point1: GeoPoint,
  point2: GeoPoint
): number {

  const toRadians = (degree: number) =>
    (degree * Math.PI) / 180;

  const R = 6371000;

  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);

  const deltaLat =
    lat2 - lat1;

  const deltaLng =
    toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(deltaLng / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}
```
