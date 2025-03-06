import { GeoPoint, GeoJSON } from "~~/types/geo";
import { booleanIntersects } from "@turf/boolean-intersects";
import { randomPoint } from "@turf/random";
import { bbox } from "@turf/bbox";
import searchAreas from '@/assets/data/geo/search_area.json';

const SEARCH_AREAS = searchAreas.features.map(f => ({feature: f, bbox: bbox(f)}));

export function isPointInPolygon(point: GeoPoint, polygon: GeoJSON): boolean {
  return booleanIntersects(polygon, {type: "Point", coordinates: [point.lng, point.lat]});
}

export function getRandomPoints(): GeoPoint[] {
  let points: GeoPoint[] = [];

  do {
    // Select a search area
    const area = SEARCH_AREAS[Math.floor(Math.random() * SEARCH_AREAS.length)];

    // Find a random point in it
    const point = randomPoint(1, {bbox: area.bbox}).features[0];
    const geopoint = {lng: point.geometry.coordinates[0], lat: point.geometry.coordinates[1]};
    if(isPointInPolygon(geopoint, area.feature)) {
      points.push(geopoint);
    }
  } while (points.length < 10);

  return points;
}
