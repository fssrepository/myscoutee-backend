#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../..');
const seedRoot = path.join(repositoryRoot, 'server/docker/conf/mongodb');
const seedFiles = [
  path.join(seedRoot, 'demo_db/userRates.json'),
  path.join(seedRoot, 'e2e_db/userRates.json')
];

function hashText(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 104729;
  }
  return Math.abs(hash);
}

function rateIdentity(rate) {
  const objectId = rate?._id?.$oid ?? '';
  return rate?.syncKey
    ?? [
      objectId,
      rate?.ownerUserId,
      rate?.relatedUserId,
      rate?.secondaryRelatedUserId,
      rate?.createdDate
    ].join(':');
}

function seedDistanceMeters(rate) {
  const seed = hashText(`rate-distance:${rateIdentity(rate)}`);
  return ((2 + (seed % 33)) * 1000) + (seed % 1000);
}

for (const seedFile of seedFiles) {
  const rates = JSON.parse(await readFile(seedFile, 'utf8'));
  for (const rate of rates) {
    rate.distanceMetersExact = seedDistanceMeters(rate);
  }
  await writeFile(seedFile, `${JSON.stringify(rates, null, 2)}\n`);
  process.stdout.write(`${path.relative(repositoryRoot, seedFile)}: ${rates.length} rates updated\n`);
}
