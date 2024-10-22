import type { Feature } from 'geojson';

import { promises as fs } from 'fs';
import path from 'path';

import { getRandomPointInPolygon } from '../utils/geo';
import { GeoBoundingBox, GeoPoint } from '~~/types/geo';


let franceGeoJSON: Feature | null = null;
type PanoramaxAPIResponse = {
  features: {
    id: string;
    bbox: GeoBoundingBox;
  }[];
}

async function loadGeoJSON(filePath: string): Promise<Feature> {
  const geojsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(geojsonData) as Feature;
}

async function queryPanoramaxAPI(point: GeoPoint): Promise<PanoramaxAPIResponse> {
  const response = await fetch('https://api.panoramax.xyz/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      limit: 1,
      place_position: `${point.lng},${point.lat}`,
      place_distance: '0-100000'
    })
  })
  return await response.json();
}

export default defineEventHandler(async () => {
  if (franceGeoJSON === null) {
    franceGeoJSON = await loadGeoJSON(path.join(process.cwd(), 'static', 'data', 'geo', 'france.geojson'));
  }

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
