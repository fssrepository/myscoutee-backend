#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../../../..');
const options = parseOptions(process.argv.slice(2));
const input = JSON.parse(await readFile(options.input, 'utf8'));
const match = Array.isArray(input) ? input[0] : null;

if (!match || typeof match !== 'object') {
  fail('The Nominatim response must contain a selected country result.');
}
const responseCountryCode = `${match.address?.country_code ?? ''}`.trim().toUpperCase();
if (responseCountryCode !== options.countryCode) {
  fail(`Nominatim returned country code '${responseCountryCode}', expected '${options.countryCode}'.`);
}

const document = {
  _id: { $oid: options.objectId },
  partitionKey: options.partitionKey,
  countryCode: options.countryCode,
  countryName: options.countryName,
  displayName: `${match.display_name ?? options.countryName}`.trim(),
  source: 'openstreetmap',
  osmType: `${match.osm_type ?? ''}`.trim(),
  osmId: Number(match.osm_id),
  specificity: options.specificity,
  importedAtIso: options.importedAtIso,
  geometry: toMultiPolygon(match.geojson)
};

for (const relativePath of [
  'server/docker/conf/mongodb/myscoutee_db/countryPartitions.json',
  'server/docker/conf/mongodb/demo_db/countryPartitions.json',
  'server/docker/conf/mongodb/e2e_db/countryPartitions.json'
]) {
  const filePath = path.join(repositoryRoot, relativePath);
  const current = JSON.parse(await readFile(filePath, 'utf8'));
  if (!Array.isArray(current)) {
    fail(`${relativePath} must contain a JSON array.`);
  }
  const retained = current.filter(item =>
    `${item?.partitionKey ?? ''}`.trim() !== options.partitionKey
    && `${item?.countryCode ?? ''}`.trim().toUpperCase() !== options.countryCode
  );
  retained.push(document);
  retained.sort((left, right) =>
    `${left.partitionKey ?? ''}`.localeCompare(`${right.partitionKey ?? ''}`)
  );
  await writeFile(filePath, `${JSON.stringify(retained, null, 2)}\n`);
  process.stdout.write(`${relativePath}: ${options.partitionKey} synchronized.\n`);
}

function parseOptions(args) {
  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    values.set(args[index], args[index + 1]);
  }
  const result = {
    input: values.get('--input') ?? '',
    objectId: values.get('--object-id') ?? '',
    partitionKey: values.get('--partition-key') ?? '',
    countryCode: `${values.get('--country-code') ?? ''}`.trim().toUpperCase(),
    countryName: `${values.get('--country-name') ?? ''}`.trim(),
    importedAtIso: values.get('--imported-at') ?? '',
    specificity: Number(values.get('--specificity') ?? 100)
  };
  if (!result.input
      || !/^[0-9a-f]{24}$/.test(result.objectId)
      || !/^country:[a-z]{2}$/.test(result.partitionKey)
      || !/^[A-Z]{2}$/.test(result.countryCode)
      || !result.countryName
      || !Number.isInteger(result.specificity)
      || Number.isNaN(Date.parse(result.importedAtIso))) {
    fail('Usage: import-nominatim-country.mjs --input FILE --object-id 24HEX --partition-key country:xx --country-code XX --country-name NAME --imported-at ISO [--specificity 100]');
  }
  return result;
}

function toMultiPolygon(value) {
  if (value?.type === 'MultiPolygon' && Array.isArray(value.coordinates)) {
    return value;
  }
  if (value?.type === 'Polygon' && Array.isArray(value.coordinates)) {
    return { type: 'MultiPolygon', coordinates: [value.coordinates] };
  }
  fail(`Unsupported Nominatim geometry type '${value?.type ?? ''}'.`);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
