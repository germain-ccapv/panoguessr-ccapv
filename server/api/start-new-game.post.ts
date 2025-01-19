import franceGeoJSON from '@/assets/data/geo/france.json'

import { getRandomPointInPolygon } from '../utils/geo';
import { GeoBoundingBox, GeoPoint } from '~~/types/geo';

type PanoramaxAPIResponse = {
  features: {
    id: string;
    bbox: GeoBoundingBox;
  }[];
}

type NewGameResponse = {
  locationId: string;
}

async function queryPanoramaxAPI(point: GeoPoint): Promise<PanoramaxAPIResponse> {
  const response = await fetch('https://api.panoramax.xyz/api/search', {
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
  return await response.json();
}

export default defineEventHandler(async (): Promise<NewGameResponse> => {
  if (franceGeoJSON.geometry.type !== 'MultiPolygon' || !franceGeoJSON.geometry.coordinates) {
    throw new Error('Invalid GeoJSON data');
  }

  const randomPoint = getRandomPointInPolygon(franceGeoJSON.geometry.coordinates[0][0]);

  let panoramaxLocation: PanoramaxAPIResponse | null = null;
  do {
    panoramaxLocation = await queryPanoramaxAPI(randomPoint);
  } while (!panoramaxLocation);

  return { locationId: panoramaxLocation.features[0].id };
});
