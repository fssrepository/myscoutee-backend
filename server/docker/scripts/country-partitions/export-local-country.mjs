#!/usr/bin/env node
// Generate local country geometry from the same production-safe catalog as Mongo.
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../../../../',import.meta.url);
const code=(process.argv[2] ?? '').toUpperCase();
if(!/^[A-Z]{2}$/.test(code))throw Error('Usage: export-local-country.mjs COUNTRY_CODE');
const rows=JSON.parse(await readFile(new URL('server/docker/conf/mongodb/myscoutee_db/countryPartitions.json',root),'utf8'));
const country=rows.find(c=>c.countryCode===code);
if(country?.geometry?.type!=='MultiPolygon')throw Error(code+' MultiPolygon is missing');
const points=country.geometry.coordinates.flat(2);
const minLatitude=Math.min(...points.map(p=>p[1])), maxLatitude=Math.max(...points.map(p=>p[1]));
const minLongitude=Math.min(...points.map(p=>p[0])), maxLongitude=Math.max(...points.map(p=>p[0]));
const value={partitionKey:country.partitionKey,countryCode:country.countryCode,countryName:country.countryName,
 bounds:{minLatitude,maxLatitude,minLongitude,maxLongitude},geometry:country.geometry};
const target=new URL(`frontend/src/app/shared/core/local/source/repositories/platform/country-${code.toLowerCase()}.generated.ts`,root);
const exportName=country.countryName.toUpperCase().replace(/[^A-Z0-9]+/g,'_')+'_PARTITION';
await writeFile(target,"// Generated from canonical countryPartitions.json (OpenStreetMap relation "+country.osmId+").\n// Regenerate: node server/docker/scripts/country-partitions/export-local-country.mjs "+code+"\nimport type { CountryPartition } from '../../entity/platform/country-partition.entity';\n\nexport const "+exportName+": CountryPartition = "+JSON.stringify(value)+";\n");
console.log(fileURLToPath(target));
