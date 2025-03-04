import { getPanoramaxPictureIDs } from '~/utils/panoramax';

type NewGameResponse = {
  locationId: string;
}

export default defineEventHandler(async (): Promise<NewGameResponse> => {
  return { locationId: (await getPanoramaxPictureIDs())[0].id };
});
