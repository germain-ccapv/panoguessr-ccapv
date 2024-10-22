export type GeoPoint = {
  lat: number;
  lng: number;
};

export type GeoBoundingBox = {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export type GeoCoordinatesPolygon = number[][];