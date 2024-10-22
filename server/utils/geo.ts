import { GeoBoundingBox, GeoCoordinatesPolygon, GeoPoint } from "~~/types/geo";

export function getGeoJSONBoudingBox(polygon: GeoCoordinatesPolygon): GeoBoundingBox {
  const lngs = polygon.map(point => point[0]);
  const lats = polygon.map(point => point[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return { minLng, maxLng, minLat, maxLat }
}

export function getRandomPointInBoundingBox(bbox: GeoBoundingBox): GeoPoint {
  const lat = Math.random() * (bbox.maxLat - bbox.minLat) + bbox.minLat;
  const lng = Math.random() * (bbox.maxLng - bbox.minLng) + bbox.minLng;
  return {
    lat,
    lng,
  };
}

export function isPointInPolygon(point: GeoPoint, polygon: GeoCoordinatesPolygon): boolean {
  const x = point.lng;
  const y = point.lat;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    if ((yi > y) != (yj > y)) {
      const xIntersection = (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (x < xIntersection) {
        inside = !inside;
      }
    }
  }
  return inside;
}

export function getRandomPointInPolygon(polygon: GeoCoordinatesPolygon): GeoPoint {
  const bbox = getGeoJSONBoudingBox(polygon);

  let randomPoint: GeoPoint;
  do {
    randomPoint = getRandomPointInBoundingBox(bbox);
  } while (!isPointInPolygon(randomPoint, polygon));

  return randomPoint;
}