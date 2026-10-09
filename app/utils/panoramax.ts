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
 * Parameters of the picture selection.
 *
 * They are grouped here so the balance between diversity
 * and speed can be tuned without touching the algorithm.
 */

/** Search radii (in degrees, ~1 km = 0.01°) tried in order around a point. */
const SEARCH_RADII_DEG = [0.01, 0.03, 0.06];

/** Number of pictures requested to Panoramax around a point. */
const SEARCH_LIMIT = 100;

/** Minimum number of pictures a collection must hold to be used. */
const MIN_COLLECTION_ITEMS = 10;

/** Two pictures of the same game must be at least this far apart (meters). */
const MIN_DISTANCE_BETWEEN_PICTURES_M = 500;

/** Number of random points tried before giving up. */
const MAX_ATTEMPTS = 40;

/** Number of points queried in parallel. */
const PARALLEL_QUERIES = 4;

/** Number of last served pictures remembered to avoid repeating them. */
const RECENT_MEMORY = 300;


type Candidate = Picture & { collection?: string };

type PictureFilter = (picture: Candidate) => boolean;


/** Last served pictures (shared by all games running in the same process). */
const recentPictureIds: string[] = [];

/** Cache of the "is this collection big enough" answers. */
const collectionCache = new Map<string, boolean>();


function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}


function rememberPictures(pictures: Picture[]) {
  for (const picture of pictures) {
    recentPictureIds.push(picture.id);
  }

  while (recentPictureIds.length > RECENT_MEMORY) {
    recentPictureIds.shift();
  }
}


/**
 * Check if a geographic point is inside the CCAPV territory.
 */
function isInsideSearchArea(point: GeoPoint): boolean {
  return SEARCH_AREAS.some((area) => {
    const [west, south, east, north] = area.bbox;

    if (
      point.lng < west || point.lng > east ||
      point.lat < south || point.lat > north
    ) {
      return false;
    }

    return isPointInPolygon(point, area.feature);
  });
}


/**
 * Generate random points inside the CCAPV territory.
 *
 * Points are first generated inside the bounding box,
 * then filtered to keep only points actually inside
 * the search polygon.
 */
export function getRandomPoints(count: number = 10): GeoPoint[] {
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

  } while (points.length < count);

  return points;
}


/**
 * Find one or many Panoramax pictures IDs inside the CCAPV territory.
 *
 * To maximise the variety of the pictures:
 * - pictures are picked at random among many candidates
 *   (not always the first one returned by the API),
 * - collections are drawn evenly, so a huge collection
 *   does not drown the small ones,
 * - recently served pictures are not served again,
 * - pictures of the same game come from different collections
 *   and are at least MIN_DISTANCE_BETWEEN_PICTURES_M apart.
 *
 * @param amount The number of wanted Panoramax pictures
 * @return Picture ID & position
 */
export async function getPanoramaxPictureIDs(
  amount: number = 1
): Promise<Picture[]> {

  const pictures: Candidate[] = [];

  let attempts = 0;

  while (pictures.length < amount) {

    if (attempts >= MAX_ATTEMPTS) {
      throw new Error("Can't find enough pictures");
    }

    // First half of the attempts: strict diversity.
    // Then relax the "different collection" rule.
    const strict = attempts < MAX_ATTEMPTS / 2;

    const accept: PictureFilter = (candidate) => {
      if (recentPictureIds.includes(candidate.id)) {
        return false;
      }

      return pictures.every((chosen) => {
        if (chosen.id === candidate.id) {
          return false;
        }

        if (
          strict &&
          candidate.collection &&
          chosen.collection === candidate.collection
        ) {
          return false;
        }

        return haversineDistance(
          chosen.position,
          candidate.position
        ) >= MIN_DISTANCE_BETWEEN_PICTURES_M;
      });
    };

    const batchSize = Math.min(
      PARALLEL_QUERIES,
      amount - pictures.length
    );

    const points = getRandomPoints(batchSize);

    attempts += points.length;

    const results = await Promise.all(
      points.map((point) =>
        queryCandidate(point, accept).catch((error) => {
          console.error('Panoramax query failed:', error);
          return null;
        })
      )
    );

    // Parallel queries do not know about each other:
    // check again, one by one, before keeping a picture.
    for (const candidate of results) {
      if (
        candidate &&
        pictures.length < amount &&
        accept(candidate)
      ) {
        pictures.push(candidate);
      }
    }
  }

  rememberPictures(pictures);

  return pictures.map(({ id, position }) => ({ id, position }));
}


/**
 * Ask Panoramax for the 360° pictures around a point.
 */
async function searchAround(
  point: GeoPoint,
  radius: number,
  limit: number
): Promise<any[]> {

  const request = (requestedLimit: number) =>
    fetch(
      getAPIUrl('/search'),
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          limit: requestedLimit,

          bbox: [
            point.lng - radius,
            point.lat - radius,
            point.lng + radius,
            point.lat + radius
          ],

          filter: 'field_of_view=360'
        })
      }
    );

  let response = await request(limit);

  // Fallback if the API refuses a large limit.
  if (!response.ok && limit > 10) {
    response = await request(10);
  }

  if (!response.ok) {
    throw new Error(
      `Panoramax API error: ${response.status}`
    );
  }

  const data = await response.json();

  return Array.isArray(data?.features) ? data.features : [];
}


/**
 * Check that a collection holds enough pictures
 * (answers are cached to save API calls).
 */
async function isCollectionPopulated(
  collectionId: string
): Promise<boolean> {

  const cached = collectionCache.get(collectionId);

  if (cached !== undefined) {
    return cached;
  }

  const response = await fetch(
    getAPIUrl(`/collections/${collectionId}`)
  );

  if (!response.ok) {
    // Do not cache: the failure may be temporary.
    return false;
  }

  const collectionData = await response.json();

  const populated =
    collectionData?.['stats:items']?.count >= MIN_COLLECTION_ITEMS;

  collectionCache.set(collectionId, populated);

  return populated;
}


/**
 * Find a valid picture around a point.
 *
 * Candidates are grouped by collection; a collection is drawn
 * at random, then a picture of that collection is drawn at random.
 * The picture must be inside the CCAPV territory.
 */
async function queryCandidate(
  point: GeoPoint,
  accept: PictureFilter = () => true
): Promise<Candidate | null> {

  for (const radius of SEARCH_RADII_DEG) {

    const features = await searchAround(
      point,
      radius,
      SEARCH_LIMIT
    );

    if (features.length === 0) {
      continue;
    }

    const groups = new Map<string, any[]>();

    for (const feature of features) {
      const key = feature?.collection ?? '';

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)!.push(feature);
    }

    for (const [collection, collectionFeatures] of shuffle([...groups])) {

      if (
        collection &&
        !(await isCollectionPopulated(collection))
      ) {
        continue;
      }

      for (const feature of shuffle(collectionFeatures)) {

        const coordinates = feature?.geometry?.coordinates;

        if (!feature?.id || !coordinates || coordinates.length < 2) {
          continue;
        }

        const candidate: Candidate = {
          id: feature.id,
          collection: collection || undefined,
          position: {
            lat: coordinates[1],
            lng: coordinates[0]
          }
        };

        if (
          isInsideSearchArea(candidate.position) &&
          accept(candidate)
        ) {
          return candidate;
        }
      }
    }
  }

  return null;
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

  const candidate = await queryCandidate(point);

  return candidate
    ? { id: candidate.id, position: candidate.position }
    : null;
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
