#!/usr/bin/env node
// Generate the local Germany geometry from the same production-safe catalog as Mongo.
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../../../../',import.meta.url);
if(process.argv[2]!=='DE')throw Error('Usage: export-local-country.mjs DE');
const rows=JSON.parse(await readFile(new URL('server/docker/conf/mongodb/myscoutee_db/countryPartitions.json',root),'utf8'));
const country=rows.find(c=>c.countryCode==='DE');
if(country?.geometry?.type!=='MultiPolygon')throw Error('Germany MultiPolygon is missing');
const points=country.geometry.coordinates.flat(2);
const minLatitude=Math.min(...points.map(p=>p[1])), maxLatitude=Math.max(...points.map(p=>p[1]));
const minLongitude=Math.min(...points.map(p=>p[0])), maxLongitude=Math.max(...points.map(p=>p[0]));
const value={partitionKey:country.partitionKey,countryCode:country.countryCode,countryName:country.countryName,
 bounds:{minLatitude,maxLatitude,minLongitude,maxLongitude},geometry:country.geometry};
const target=new URL('frontend/src/app/shared/core/local/source/repositories/country-de.generated.ts',root);
await writeFile(target,"// Generated from canonical countryPartitions.json (OpenStreetMap relation 51477).\n// Regenerate: node server/docker/scripts/country-partitions/export-local-country.mjs DE\nimport type { CountryPartition } from '../entity/country-partition.entity';\n\nexport const GERMANY_PARTITION: CountryPartition = "+JSON.stringify(value)+";\n");
console.log(fileURLToPath(target));
