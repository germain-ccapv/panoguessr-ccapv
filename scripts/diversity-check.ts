/**
 * Mesure la diversité des photos Panoramax proposées sur le périmètre CCAPV.
 *
 * Compare l'ancienne méthode (1 résultat, bbox large) à la nouvelle.
 *
 * Usage :
 *   npx tsx scripts/diversity-check.ts            # API Panoramax réelle, 30 tirages
 *   npx tsx scripts/diversity-check.ts 60         # 60 tirages
 *   MOCK=1 npx tsx scripts/diversity-check.ts     # données simulées (test hors ligne)
 */
import searchAreas from '../app/assets/data/geo/search_area.json';
import {
  getAPIUrl,
  getPanoramaxPictureIDs,
  getRandomPoints,
  haversineDistance,
  isPointInPolygon
} from '../app/utils/panoramax';

const DRAWS = Number(process.argv[2] ?? 30);
const GAMES = Math.max(5, Math.round(DRAWS / 6));

type Pic = { id: string; lat: number; lng: number; collection: string };

const inside = (lat: number, lng: number) =>
  searchAreas.features.some((f: any) => isPointInPolygon({ lat, lng }, f));


/* ---------- Données simulées (MOCK=1) ---------- */

function installMock() {
  const seeds = getRandomPoints(12);
  const pics: Pic[] = [];
  let n = 0;
  const add = (collection: string, lat: number, lng: number) =>
    pics.push({ id: `${collection}-${n++}`, lat, lng, collection });

  // Grosse collection récente : une longue route (la plus fréquente dans l'API)
  for (let i = 0; i < 600; i++) add('A', seeds[0].lat + i * 0.0004, seeds[0].lng + i * 0.0003);
  // Collections moyennes réparties sur le territoire
  seeds.slice(1, 9).forEach((s, k) => {
    for (let i = 0; i < 40; i++) add(`B${k}`, s.lat + i * 0.0003, s.lng + i * 0.0002);
  });
  // Collection trop petite (doit être ignorée)
  for (let i = 0; i < 5; i++) add('TINY', seeds[9].lat + i * 0.0003, seeds[9].lng);
  // Photos juste hors du périmètre (bord est), très récentes
  for (let i = 0; i < 80; i++) add('OUT', 44.0 + i * 0.002, 6.97 + (i % 5) * 0.002);

  const order = ['OUT', 'A'];
  const rank = (c: string) => (order.includes(c) ? order.indexOf(c) : 2);

  globalThis.fetch = (async (url: any, init?: any) => {
    const u = String(url);
    const json = (body: any) => ({ ok: true, status: 200, json: async () => body }) as any;

    if (u.includes('/collections/')) {
      const id = u.split('/collections/')[1];
      return json({ 'stats:items': { count: pics.filter(p => p.collection === id).length } });
    }

    const body = JSON.parse(init.body);
    const [w, s, e, nn] = body.bbox;
    const found = pics
      .filter(p => p.lng >= w && p.lng <= e && p.lat >= s && p.lat <= nn)
      .sort((a, b) => rank(a.collection) - rank(b.collection))   // le plus "récent" d'abord
      .slice(0, body.limit)
      .map(p => ({
        id: p.id,
        collection: p.collection,
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
      }));

    return json({ features: found });
  }) as any;
}


/* ---------- Ancienne méthode (copie de l'ancien code) ---------- */

async function legacyPick(point: { lat: number; lng: number }): Promise<Pic | null> {
  const response = await fetch(getAPIUrl('/search'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit: 1,
      bbox: [point.lng - 0.1, point.lat - 0.1, point.lng + 0.1, point.lat + 0.1],
      filter: 'field_of_view=360'
    })
  });
  if (!response.ok) return null;
  const data: any = await response.json();
  const f = data?.features?.[0];
  if (!f?.geometry?.coordinates) return null;

  if (f.collection) {
    const c = await fetch(getAPIUrl(`/collections/${f.collection}`));
    if (!c.ok) return null;
    const cd: any = await c.json();
    if (!(cd?.['stats:items']?.count >= 10)) return null;
  }
  return { id: f.id, collection: f.collection ?? '', lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
}

async function legacyGame(amount: number): Promise<Pic[]> {
  const out: Pic[] = [];
  let guard = 0;
  while (out.length < amount && guard++ < 60) {
    const pic = await legacyPick(getRandomPoints(1)[0]);
    if (pic && !out.find(p => p.id === pic.id)) out.push(pic);
  }
  return out;
}


/* ---------- Mesures ---------- */

async function newGame(amount: number): Promise<Pic[]> {
  const pics = await getPanoramaxP/**
 * Mesure la diversité des photos Panoramax proposées sur le périmètre CCAPV.
 *
 * Compare l'ancienne méthode (1 résultat, bbox large) à la nouvelle.
 *
 * Usage :
 *   npx tsx scripts/diversity-check.ts            # API Panoramax réelle, 30 tirages
 *   npx tsx scripts/diversity-check.ts 60         # 60 tirages
 *   MOCK=1 npx tsx scripts/diversity-check.ts     # données simulées (test hors ligne)
 */
import searchAreas from '../app/assets/data/geo/search_area.json';
import {
  getAPIUrl,
  getPanoramaxPictureIDs,
  getRandomPoints,
  haversineDistance,
  isPointInPolygon
} from '../app/utils/panoramax';

const DRAWS = Number(process.argv[2] ?? 30);
const GAMES = Math.max(5, Math.round(DRAWS / 6));

type Pic = { id: string; lat: number; lng: number; collection: string };

const inside = (lat: number, lng: number) =>
  searchAreas.features.some((f: any) => isPointInPolygon({ lat, lng }, f));


/* ---------- Données simulées (MOCK=1) ---------- */

function installMock() {
  const seeds = getRandomPoints(12);
  const pics: Pic[] = [];
  let n = 0;
  const add = (collection: string, lat: number, lng: number) =>
    pics.push({ id: `${collection}-${n++}`, lat, lng, collection });

  // Grosse collection récente : une longue route (la plus fréquente dans l'API)
  for (let i = 0; i < 600; i++) add('A', seeds[0].lat + i * 0.0004, seeds[0].lng + i * 0.0003);
  // Collections moyennes réparties sur le territoire
  seeds.slice(1, 9).forEach((s, k) => {
    for (let i = 0; i < 40; i++) add(`B${k}`, s.lat + i * 0.0003, s.lng + i * 0.0002);
  });
  // Collection trop petite (doit être ignorée)
  for (let i = 0; i < 5; i++) add('TINY', seeds[9].lat + i * 0.0003, seeds[9].lng);
  // Photos juste hors du périmètre (bord est), très récentes
  for (let i = 0; i < 80; i++) add('OUT', 44.0 + i * 0.002, 6.97 + (i % 5) * 0.002);

  const order = ['OUT', 'A'];
  const rank = (c: string) => (order.includes(c) ? order.indexOf(c) : 2);

  globalThis.fetch = (async (url: any, init?: any) => {
    const u = String(url);
    const json = (body: any) => ({ ok: true, status: 200, json: async () => body }) as any;

    if (u.includes('/collections/')) {
      const id = u.split('/collections/')[1];
      return json({ 'stats:items': { count: pics.filter(p => p.collection === id).length } });
    }

    const body = JSON.parse(init.body);
    const [w, s, e, nn] = body.bbox;
    const found = pics
      .filter(p => p.lng >= w && p.lng <= e && p.lat >= s && p.lat <= nn)
      .sort((a, b) => rank(a.collection) - rank(b.collection))   // le plus "récent" d'abord
      .slice(0, body.limit)
      .map(p => ({
        id: p.id,
        collection: p.collection,
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
      }));

    return json({ features: found });
  }) as any;
}


/* ---------- Ancienne méthode (copie de l'ancien code) ---------- */

async function legacyPick(point: { lat: number; lng: number }): Promise<Pic | null> {
  const response = await fetch(getAPIUrl('/search'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit: 1,
      bbox: [point.lng - 0.1, point.lat - 0.1, point.lng + 0.1, point.lat + 0.1],
      filter: 'field_of_view=360'
    })
  });
  if (!response.ok) return null;
  const data: any = await response.json();
  const f = data?.features?.[0];
  if (!f?.geometry?.coordinates) return null;

  if (f.collection) {
    const c = await fetch(getAPIUrl(`/collections/${f.collection}`));
    if (!c.ok) return null;
    const cd: any = await c.json();
    if (!(cd?.['stats:items']?.count >= 10)) return null;
  }
  return { id: f.id, collection: f.collection ?? '', lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
}

async function legacyGame(amount: number): Promise<Pic[]> {
  const out: Pic[] = [];
  let guard = 0;
  while (out.length < amount && guard++ < 60) {
    const pic = await legacyPick(getRandomPoints(1)[0]);
    if (pic && !out.find(p => p.id === pic.id)) out.push(pic);
  }
  return out;
}


/* ---------- Mesures ---------- */

async function newGame(amount: number): Promise<Pic[]> {
  const pics = await getPanoramaxPictureIDs(amount);
  const byId = await Promise.all(pics.map(async p => {
    return { id: p.id, lat: p.position.lat, lng: p.position.lng, collection: '' } as Pic;
  }));
  return byId;
}

function stats(label: string, solo: Pic[], games: Pic[][]) {
  const distinct = new Set(solo.map(p => p.id)).size;
  const outside = solo.filter(p => !inside(p.lat, p.lng)).length;

  let dupWithin = 0, minDist = Infinity;
  for (const g of games) {
    dupWithin += g.length - new Set(g.map(p => p.id)).size;
    for (let i = 0; i < g.length; i++)
      for (let j = i + 1; j < g.length; j++)
        minDist = Math.min(minDist, haversineDistance(
          { lat: g[i].lat, lng: g[i].lng }, { lat: g[j].lat, lng: g[j].lng }));
  }

  console.log(`\n== ${label}`);
  console.log(`Parties solo (${solo.length} photos) : ${distinct} photos différentes (${Math.round(100 * distinct / solo.length)} %)`);
  console.log(`Photos hors périmètre CCAPV : ${outside} (${Math.round(100 * outside / solo.length)} %)`);
  console.log(`Parties de 5 (${games.length} parties) : doublons dans une partie = ${dupWithin}, distance mini entre 2 photos = ${Number.isFinite(minDist) ? Math.round(minDist) + ' m' : 'n/a'}`);
}

async function main() {
  if (process.env.MOCK) {
    installMock();
    console.log('MODE SIMULÉ (données fictives)');
  } else {
    console.log('API Panoramax réelle');
  }

  const legacySolo: Pic[] = [];
  for (let i = 0; i < DRAWS; i++) legacySolo.push(...(await legacyGame(1)));
  const legacyGames: Pic[][] = [];
  for (let i = 0; i < GAMES; i++) legacyGames.push(await legacyGame(5));
  stats('ANCIENNE méthode', legacySolo, legacyGames);

  const newSolo: Pic[] = [];
  for (let i = 0; i < DRAWS; i++) newSolo.push(...(await newGame(1)));
  const newGames: Pic[][] = [];
  for (let i = 0; i < GAMES; i++) newGames.push(await newGame(5));
  stats('NOUVELLE méthode', newSolo, newGames);
}

main().catch((e) => { console.error(e); process.exit(1); });ictureIDs(amount);
  const byId = await Promise.all(pics.map(async p => {
    return { id: p.id, lat: p.position.lat, lng: p.position.lng, collection: '' } as Pic;
  }));
  return byId;
}

function stats(label: string, solo: Pic[], games: Pic[][]) {
  const distinct = new Set(solo.map(p => p.id)).size;
  const outside = solo.filter(p => !inside(p.lat, p.lng)).length;

  let dupWithin = 0, minDist = Infinity;
  for (const g of games) {
    dupWithin += g.length - new Set(g.map(p => p.id)).size;
    for (let i = 0; i < g.length; i++)
      for (let j = i + 1; j < g.length; j++)
        minDist = Math.min(minDist, haversineDistance(
          { lat: g[i].lat, lng: g[i].lng }, { lat: g[j].lat, lng: g[j].lng }));
  }

  console.log(`\n== ${label}`);
  console.log(`Parties solo (${solo.length} photos) : ${distinct} photos différentes (${Math.round(100 * distinct / solo.length)} %)`);
  console.log(`Photos hors périmètre CCAPV : ${outside} (${Math.round(100 * outside / solo.length)} %)`);
  console.log(`Parties de 5 (${games.length} parties) : doublons dans une partie = ${dupWithin}, distance mini entre 2 photos = ${Number.isFinite(minDist) ? Math.round(minDist) + ' m' : 'n/a'}`);
}

async function main() {
  if (process.env.MOCK) {
    installMock();
    console.log('MODE SIMULÉ (données fictives)');
  } else {
    console.log('API Panoramax réelle');
  }

  const legacySolo: Pic[] = [];
  for (let i = 0; i < DRAWS; i++) legacySolo.push(...(await legacyGame(1)));
  const legacyGames: Pic[][] = [];
  for (let i = 0; i < GAMES; i++) legacyGames.push(await legacyGame(5));
  stats('ANCIENNE méthode', legacySolo, legacyGames);

  const newSolo: Pic[] = [];
  for (let i = 0; i < DRAWS; i++) newSolo.push(...(await newGame(1)));
  const newGames: Pic[][] = [];
  for (let i = 0; i < GAMES; i++) newGames.push(await newGame(5));
  stats('NOUVELLE méthode', newSolo, newGames);
}

main().catch((e) => { console.error(e); process.exit(1); });
