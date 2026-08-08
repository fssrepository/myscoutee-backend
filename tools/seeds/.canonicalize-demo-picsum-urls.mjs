import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assetsPath = path.join(root, 'server/docker/conf/mongodb/demo_db/assets.json');
const eventsPath = path.join(root, 'server/docker/conf/mongodb/demo_db/events.json');
const frontendMapPath = path.join(
  root,
  'frontend/src/app/shared/core/local/seed/builders/demo-picsum-image-url.ts'
);

const publicLocalUserIds = [
  'u1', 'u2', 'u3', 'u4', 'u6', 'u7', 'u8', 'u10', 'u12', 'u13', 'u14', 'u15',
  'u16', 'u18', 'u19', 'u20', 'u22', 'u24', 'u25', 'u26', 'u27', 'u28', 'u30',
  'u31', 'u32', 'u34', 'u36', 'u37', 'u38', 'u39', 'u40', 'u42', 'u43', 'u44',
  'u46', 'u48'
];

const ownedAssetTemplates = [
  ['transport', 'transport', 'asset-transport-1'],
  ['transport', 'transport', 'asset-transport-2'],
  ['transport', 'transport', 'asset-transport-3'],
  ['transport', 'transport', 'asset-transport-4'],
  ['accommodation', 'property', 'asset-acc-1'],
  ['accommodation', 'property', 'asset-acc-2'],
  ['accommodation', 'property', 'asset-acc-3'],
  ['accommodation', 'property', 'asset-acc-4'],
  ['supplies', 'gear', 'asset-sup-1'],
  ['supplies', 'gear', 'asset-sup-2'],
  ['supplies', 'gear', 'asset-sup-3'],
  ['supplies', 'gear', 'asset-sup-4']
];

const baseAssetTemplates = [
  ...ownedAssetTemplates,
  ['supplies', 'gear', 'asset-sup-5'],
  ['supplies', 'gear', 'asset-sup-6'],
  ['supplies', 'gear', 'asset-sup-7'],
  ['supplies', 'gear', 'asset-sup-8']
];

const localEventImageUrls = [
  'https://picsum.photos/seed/demo-event-events%3Au1%3Ae1%3Aalpine-weekend-2.0/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au1%3Ae10%3Agolden-hour-meetup/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au1%3Ae11%3Across-month-community-relay/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au1%3Ae12%3Aspring-cohort-journey/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au1%3Ae7%3Acoffee-%2B-book-swap/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au1%3Ae9%3Abrunch-rotation/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au10%3Ae2%3Aurban-photo-marathon/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au12%3Ae8%3Alakeside-walk-lab/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au2%3Acheckout-paid-slots%3Acheckout-demo-%C2%B7-paid-multi-slot/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au2%3Ae13%3Aafterwork-tasting-circle/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au2%3Ae4%3Asunrise-run-%2B-brunch/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au2%3Awaitlist-full-policy%3Afull-house-supper-club/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Aactive-tournament-slots%3Atournament-demo-%C2%B7-active-slot-cup/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Aasset-join-demo-nagy-eszter%3Aasset-join-demo-%C2%B7-shuttle-seat/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Acheckout-free-slots%3Acheckout-demo-%C2%B7-free-multi-slot/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Acheckout-paid-policy%3Acheckout-demo-%C2%B7-paid-one-slot-policy/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Ae14%3Amoonlight-boardwalk-mixer/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Ae3%3Anight-food-league/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Ae5%3Acreative-studio-meetup/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Afeedback-showcase-nagy-eszter-social%3Afeedback-demo-%C2%B7-social-lab/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Afeedback-showcase-nagy-eszter-studio%3Afeedback-demo-%C2%B7-studio-recap/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au3%3Awaitlist-full-free%3Atiny-vinyl-listening-room/1200/700',
  'https://picsum.photos/seed/demo-event-events%3Au4%3Ae6%3Asunset-beach-volley/1200/700',
  'https://picsum.photos/seed/demo-event-hosting%3Au1%3Ah1%3Aweekly-padel-league/1200/700',
  'https://picsum.photos/seed/demo-event-hosting%3Au1%3Ah2%3Aspring-city-festival-crew/1200/700',
  'https://picsum.photos/seed/demo-event-hosting%3Au2%3Ah3%3Asunday-bike-social/1200/700',
  'https://picsum.photos/seed/demo-event-hosting%3Au3%3Ah4%3Acreative-nights-series/1200/700',
  'https://picsum.photos/seed/demo-event-invitations%3Au1%3Ai1%3Ajazz-rooftop-session/1200/700',
  'https://picsum.photos/seed/demo-event-invitations%3Au1%3Ai2%3Aopen-padel-pairs/1200/700',
  'https://picsum.photos/seed/demo-event-invitations%3Au1%3Ai3%3Achat%3A-last-minute-ski-transfer/1200/700',
  'https://picsum.photos/seed/demo-event-invitations%3Au2%3Ai4%3Afoodie-crawl-team/1200/700',
  'https://picsum.photos/seed/demo-event-invitations%3Au3%3Ai5%3Aurban-photo-sprint/1200/700'
];

function seedUrl(rawSeed) {
  return `https://picsum.photos/seed/${encodeURIComponent(rawSeed)}/1200/700`;
}

function imageIdFromUrl(url) {
  const match = `${url ?? ''}`.match(/\/id\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

async function resolveImageId(url) {
  const existingId = imageIdFromUrl(url);
  if (existingId !== null) {
    return existingId;
  }
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { Range: 'bytes=0-0' },
        signal: AbortSignal.timeout(30_000)
      });
      await response.arrayBuffer();
      const resolvedId = imageIdFromUrl(response.url);
      if (!response.ok || resolvedId === null) {
        throw new Error(`HTTP ${response.status}, final URL ${response.url}`);
      }
      return resolvedId;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Cannot resolve ${url}: ${lastError}`);
}

function canonicalUrl(imageId) {
  return `https://picsum.photos/id/${imageId}/1200/700`;
}

function encodedSeedFromUrl(url) {
  const match = new URL(url).pathname.match(/^\/seed\/(.+)\/1200\/700$/);
  if (!match) {
    throw new Error(`Not a Picsum seed URL: ${url}`);
  }
  return match[1];
}

function frontendMapSource(frontendIdByUrl) {
  const entries = [...frontendIdByUrl]
    .map(([url, imageId]) => [encodedSeedFromUrl(url), imageId])
    .sort(([left], [right]) => left.localeCompare(right));
  const lines = entries.map(([seed, imageId]) => `  '${seed}': ${imageId},`);
  return `// Generated from the resolved images behind the canonical frontend-local demo seeds.\n` +
    `// Keep URL identity honest: equal Picsum images must produce equal URLs.\n` +
    `const DEMO_PICSUM_IMAGE_ID_BY_ENCODED_SEED: Readonly<Record<string, number>> = {\n` +
    `${lines.join('\n')}\n` +
    `};\n\n` +
    `const DEMO_PICSUM_IMAGE_IDS = Array.from(\n` +
    `  new Set(Object.values(DEMO_PICSUM_IMAGE_ID_BY_ENCODED_SEED))\n` +
    `);\n\n` +
    `export function canonicalDemoPicsumImageUrl(seed: string): string {\n` +
    `  const encodedSeed = encodeURIComponent(seed.trim());\n` +
    `  const mappedImageId = DEMO_PICSUM_IMAGE_ID_BY_ENCODED_SEED[encodedSeed];\n` +
    `  const imageId = mappedImageId ?? DEMO_PICSUM_IMAGE_IDS[stableSeedIndex(encodedSeed)];\n` +
    `  return \`https://picsum.photos/id/\${imageId}/1200/700\`;\n` +
    `}\n\n` +
    `function stableSeedIndex(seed: string): number {\n` +
    `  let hash = 2166136261;\n` +
    `  for (let index = 0; index < seed.length; index += 1) {\n` +
    `    hash ^= seed.charCodeAt(index);\n` +
    `    hash = Math.imul(hash, 16777619);\n` +
    `  }\n` +
    `  return (hash >>> 0) % DEMO_PICSUM_IMAGE_IDS.length;\n` +
    `}\n`;
}

const assets = JSON.parse(await readFile(assetsPath, 'utf8'));
const events = JSON.parse(await readFile(eventsPath, 'utf8'));

const frontendUrls = new Set(localEventImageUrls);
for (const [type, flavor, cardId] of baseAssetTemplates) {
  frontendUrls.add(seedUrl(`${type}-${flavor}-${cardId}`));
}
for (const userId of publicLocalUserIds) {
  for (const [type, flavor, cardId] of ownedAssetTemplates) {
    frontendUrls.add(seedUrl(`${type}-${flavor}-${userId}-${cardId}`));
  }
}

const mongoUrls = new Set([
  ...assets.map(asset => asset.imageUrl).filter(url => `${url ?? ''}`.includes('picsum.photos/')),
  ...events.map(event => event.imageUrl).filter(url => `${url ?? ''}`.includes('picsum.photos/'))
]);
const allUrls = [...new Set([...mongoUrls, ...frontendUrls])].sort();
const idByUrl = new Map();
let cursor = 0;
let completed = 0;

async function worker() {
  while (cursor < allUrls.length) {
    const index = cursor;
    cursor += 1;
    const url = allUrls[index];
    idByUrl.set(url, await resolveImageId(url));
    completed += 1;
    if (completed % 25 === 0 || completed === allUrls.length) {
      console.log(`resolved ${completed}/${allUrls.length}`);
    }
  }
}

await Promise.all([worker(), worker()]);

for (const asset of assets) {
  const originalUrl = asset.imageUrl;
  const imageId = idByUrl.get(originalUrl);
  if (imageId === undefined) {
    continue;
  }
  asset.imageUrl = canonicalUrl(imageId);
  if (asset.sourceLink === originalUrl) {
    asset.sourceLink = asset.imageUrl;
  }
}
for (const event of events) {
  const imageId = idByUrl.get(event.imageUrl);
  if (imageId !== undefined) {
    event.imageUrl = canonicalUrl(imageId);
  }
}

const frontendIdByUrl = new Map(
  [...frontendUrls].map(url => [url, idByUrl.get(url)])
);
if ([...frontendIdByUrl.values()].some(imageId => imageId === undefined)) {
  throw new Error('Frontend mapping is incomplete.');
}

await writeFile(assetsPath, `${JSON.stringify(assets, null, 2)}\n`);
await writeFile(eventsPath, `${JSON.stringify(events, null, 2)}\n`);
await writeFile(frontendMapPath, frontendMapSource(frontendIdByUrl));

const mongoIds = new Set([...mongoUrls].map(url => idByUrl.get(url)));
const frontendIds = new Set([...frontendIdByUrl.values()]);
const combinedIds = new Set([...mongoIds, ...frontendIds]);
console.log(JSON.stringify({
  mongoSeedUrls: mongoUrls.size,
  frontendSeedUrls: frontendUrls.size,
  allSeedUrls: allUrls.length,
  mongoUniqueImages: mongoIds.size,
  frontendUniqueImages: frontendIds.size,
  combinedUniqueImages: combinedIds.size
}, null, 2));
