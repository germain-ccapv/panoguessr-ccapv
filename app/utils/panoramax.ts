/**
 * Get the full URL for some Panoramax API route
 * @param route The route to query, like /search
 * @returns The full URL
 */
export function getAPIUrl(route: string = "") {
	return `https://api.panoramax.xyz/api${route}`;
}
