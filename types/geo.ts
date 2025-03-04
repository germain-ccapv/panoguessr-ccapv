export type GeoPoint = {
  lat: number;
  lng: number;
};

export type GeoCoordinatesPolygon = number[][];

export type GeoJSON = {
  type: string | "Feature",
  geometry: GeoCoordinatesPolygon,
  properties: object
}

export type Picture = {
  id: string,
  position: GeoPoint
}