export type GeoPoint = [number, number];

export type GeoBoundingBox = {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export type GeoCoordinatesPolygon = number[][];