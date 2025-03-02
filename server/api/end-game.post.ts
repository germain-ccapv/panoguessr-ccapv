import { GeoPoint } from '~~/types/geo';
import { getAPIUrl } from '~/utils/panoramax';

type EndGameRequest = {
  originPicId: string;
  guessPosition: GeoPoint;
}

type EndGameResponse = {
  distance_meters: number;
  originPoint: GeoPoint;
}

export function haversineDistance(point1: GeoPoint, point2: GeoPoint): number {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const R = 6371000; // Earth's radius in meters
  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const deltaLat = lat2 - lat1;
  const deltaLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function getPicturePosition(pictureId: string): Promise<GeoPoint> {
  const response = await fetch(
    getAPIUrl(`/search?ids=${pictureId}`),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch picture with ID ${pictureId}`);
  }

  const data = await response.json();

  if (!data || !data.features || !data.features.length) {
    throw new Error(`No data found for picture ID ${pictureId}`);
  }

  const feature = data.features[0];

  if (
    !feature ||
    !feature.geometry ||
    !feature.geometry.coordinates ||
    feature.geometry.coordinates.length < 2
  ) {
    throw new Error(`Invalid data for picture ID ${pictureId}`);
  }

  const [lng, lat] = feature.geometry.coordinates;
  return { lat, lng };
}

export default defineEventHandler(async (event): Promise<EndGameResponse> => {
  const body = await readBody(event) as EndGameRequest;
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing request body',
    });
  }

  if (!body.originPicId || !body.guessPosition) {
    throw createError({
      statusCode: 400,
      statusMessage: 'originPicId and guessPosition are required',
    });
  }

  try {
    const originPoint = await getPicturePosition(body.originPicId);

    const distance = haversineDistance(originPoint, body.guessPosition);

    return { distance_meters: Math.round(distance), originPoint: originPoint };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get picture positions',
    })
  }
});
