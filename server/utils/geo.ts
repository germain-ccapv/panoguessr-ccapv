import { GeoPoint, GeoJSON } from "~~/types/geo";
import { booleanIntersects } from "@turf/boolean-intersects";
import { randomPoint } from "@turf/random";
import { bbox } from "@turf/bbox";

export function isPointInPolygon(point: GeoPoint, polygon: GeoJSON): boolean {
  return booleanIntersects(polygon, {type: "Point", coordinates: [point.lng, point.lat]});
}

export function getRandomPointsInPolygon(polygon: GeoJSON): GeoPoint[] {
  let points: GeoPoint[] = [];
  const polygonbbox = bbox(polygon);

  do {
    // Get some points, filter out of search area
    points = randomPoint(20, {bbox: polygonbbox})
      .features
      .map(p => ({lng: p.geometry.coordinates[0], lat: p.geometry.coordinates[1]}))
      .filter(p => isPointInPolygon(p, polygon));
  } while (points.length < 10);

  return points;
}
