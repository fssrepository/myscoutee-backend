#!/usr/bin/env node
// Export local partition metadata; geographic boundaries remain on the backend.
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../../../../',import.meta.url);
const code=(process.argv[2] ?? '').toUpperCase();
if(!/^[A-Z]{2}$/.test(code))throw Error('Usage: export-local-country.mjs COUNTRY_CODE');
const rows=JSON.parse(await readFile(new URL('server/docker/conf/mongodb/myscoutee_db/countryPartitions.json',root),'utf8'));
const country=rows.find(c=>c.countryCode===code);
if(!country)throw Error(code+' partition is missing');
const locations=JSON.parse(await readFile(new URL('myscoutee-frontend/src/app/shared/core/local/seed/data/demo-locations.json',root),'utf8'));
const city=Object.entries(locations.cities).find(([,point])=>point.partitionKey===country.partitionKey);
if(!city)throw Error(code+' demo sample location is missing');
const value={partitionKey:country.partitionKey,countryCode:country.countryCode,countryName:country.countryName,
 city:city[0],locationCoordinates:{latitude:city[1].latitude,longitude:city[1].longitude}};
const target=new URL(`myscoutee-frontend/src/app/shared/core/local/source/repositories/platform/country-${code.toLowerCase()}.generated.ts`,root);
const exportName=country.countryName.toUpperCase().replace(/[^A-Z0-9]+/g,'_')+'_PARTITION';
await writeFile(target,"// Generated from canonical countryPartitions.json (OpenStreetMap relation "+country.osmId+").\n// Regenerate: node server/docker/scripts/country-partitions/export-local-country.mjs "+code+"\nimport type { CountryPartition } from '../../entity/platform/country-partition.entity';\n\nexport const "+exportName+": CountryPartition = "+JSON.stringify(value)+";\n");
console.log(fileURLToPath(target));
