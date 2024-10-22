import type { Feature } from 'geojson';

import { promises as fs } from 'fs';
import path from 'path';

import { getRandomPointInPolygon } from '../utils/geo';


let franceGeoJSON: Feature | null = null;

async function loadGeoJSON(filePath: string): Promise<Feature> {
  const geojsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(geojsonData) as Feature;
}

export default defineEventHandler(async () => {
  if (franceGeoJSON === null) {
    franceGeoJSON = await loadGeoJSON(path.join(process.cwd(), 'static', 'data', 'geo', 'france.geojson'));
  }

  if (franceGeoJSON.geometry.type !== 'MultiPolygon' || !franceGeoJSON.geometry.coordinates) {
    throw new Error('Invalid GeoJSON data');
  }

  const randomPoint = getRandomPointInPolygon(franceGeoJSON.geometry.coordinates[0][0]);
  return { location: randomPoint };
});
