import { getRandomPoints } from '~~/server/utils/geo';
import type { GeoPoint, Picture } from '~~/types/geo';


/**
 * Get the full URL for some Panoramax API route
 * @param route The route to query, like /search
 * @returns The full URL
 */
export function getAPIUrl(route: string = "") {
	return `https://api.panoramax.xyz/api${route}`;
}


/**
 * Find one or many Panoramax pictures IDs
 * @param amount The number of wanted Panoramax IDs
 * @return Picture ID & position
 */
export async function getPanoramaxPictureIDs(amount: number = 1): Promise<Picture[]> {
  let pictures: Picture[] = [];
  let randomPoints: GeoPoint[] = [];
  let trials = 0;

  do {
    // Get random geo positions
    if(randomPoints.length === 0) {
      randomPoints = getRandomPoints();
    }

    // Call Panoramax API
    do {
      let pic = await queryPanoramaxAPI(randomPoints.pop());
      if(!pic) { trials++; }
      if(pic && !pictures.find(p => p.id === pic.id)) {
        pictures.push(pic);
      }

      if(trials == 10) { throw new Error("Can't find any pictures"); }

    } while(randomPoints.length > 0 && pictures.length < amount);
  } while(pictures.length < amount);

  return pictures;
}


/**
 * Find a valid picture ID on Panoramax API
 * @param point The coordinates to look around
 * @returns The picture ID, or null if no one found
 */
export async function queryPanoramaxAPI(point: GeoPoint): Promise<Picture | null> {
  const res1 = await fetch(getAPIUrl('/search'), {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    limit: 1,
    bbox:  [
      point.lng - 2,
      point.lat - 2,
      point.lng + 2,
      point.lat + 2
    ],
    filter: "field_of_view=360"
    })
  })
  const res1json = await res1.json();
  
  // Check if given image is not single in its collection, and we have enough around
  if(res1json.features.length > 0) {
    const res = {
      id: res1json.features[0].id,
      position: {
        lat: res1json.features[0].geometry.coordinates[1],
        lng: res1json.features[0].geometry.coordinates[0]
      }
    };
    const nbSameCollec = res1json.features.filter(f => f.collection == res1json.features[0].collection).length;
    if(nbSameCollec === 10) {
      return res;
    }
    else {
      // Look at first picture collection details
      const res2 = await(fetch(getAPIUrl(`/collections/${res1json.features[0].collection}`)));
      const res2json = await res2.json();
      if(res2json?.["stats:items"]?.["count"] >= 30) {
        return res;
      }
    }
  }
  
  return null;
}