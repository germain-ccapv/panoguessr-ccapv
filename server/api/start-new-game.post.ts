import franceGeoJSON from '@/assets/data/geo/france.json';

import { getAPIUrl } from '~/utils/panoramax';
import { getRandomPointInPolygon } from '../utils/geo';
import { GeoBoundingBox, GeoPoint } from '~~/types/geo';

type NewGameResponse = {
  locationId: string;
}

export async function queryPanoramaxAPI(point: GeoPoint): Promise<string | null> {
  const res1 = await fetch(getAPIUrl('/search'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      limit: 1,
      bbox:  [
        point.lng - 2,
        point.lat - 2,
        point.lng + 2,
        point.lat + 2
      ],
      filter: "field_of_view=360"
    })
  })
  const res1json = await res1.json();

  // Check if given image is not single in its collection, and we have enough around
  if(res1json.features.length > 0) {
    const nbSameCollec = res1json.features.filter(f => f.collection == res1json.features[0].collection).length;
    if(nbSameCollec === 10) {
      return res1json.features[0].id;
    }
    else {
      // Look at first picture collection details
      const res2 = await(fetch(getAPIUrl(`/collections/${res1json.features[0].collection}`)));
      const res2json = await res2.json();
      if(res2json?.["stats:items"]?.["count"] >= 30) {
        return res1json.features[0].id;
      }
    }
  }

  return null;
}

export default defineEventHandler(async (): Promise<NewGameResponse> => {
  if (franceGeoJSON.geometry.type !== 'MultiPolygon' || !franceGeoJSON.geometry.coordinates) {
    throw new Error('Invalid GeoJSON data');
  }

  const randomPoint = getRandomPointInPolygon(franceGeoJSON.geometry.coordinates[0][0]);

  let panoramaxLocation: string | null = null;
  do {
    panoramaxLocation = await queryPanoramaxAPI(randomPoint);
  } while (!panoramaxLocation);

  return { locationId: panoramaxLocation };
});
