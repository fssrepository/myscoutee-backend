#!/usr/bin/env python3
"""Emit a real Mongo chain test for an existing local/remote QA container."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
sources={p.name:p.read_text() for p in (root/'migrations').glob('*.js')}
runner=(root/'scripts/run-data-migrations.js').read_text()
print('const sources='+json.dumps(sources)+';')
print('const runner='+json.dumps(runner)+';')
print('const helpSeeds='+json.dumps(json.loads((root.parent/'server/docker/conf/mongodb/myscoutee_db/helpCenterRevisions.json').read_text()))+';')
print(r'''
const fs=require('fs');
const root=fs.mkdtempSync('/tmp/qa-migration-chain-');
fs.mkdirSync(root+'/migrations');fs.mkdirSync(root+'/seeds');
fs.writeFileSync(root+'/runner.js',runner);
fs.writeFileSync(root+'/seeds/deploymentConfigurations.json',JSON.stringify([{_id:'deployment-configuration',payment:{exchangeRateUrl:'https://rates.example/daily'}}]));
fs.writeFileSync(root+'/seeds/helpCenterRevisions.json',JSON.stringify(helpSeeds));
process.env.MYSCOUTEE_MIGRATION_DIRECTORY=root+'/migrations';
process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY=root+'/seeds';
function run(database){
 for(const [name,source] of Object.entries(sources))fs.writeFileSync(root+'/migrations/'+name,source);
 db=database;load(root+'/runner.js');
}
function check(ok,msg){if(!ok)throw Error(msg);}
for(const schema of [3,4,5]){
 const d=db.getSiblingDB('qa_chain_'+new ObjectId().toHexString());
 try{
  d.deploymentConfigurations.insertOne({_id:'deployment-configuration',schemaVersion:schema,version:7,payment:{credentialEnvelope:'retain'},...(schema===5?{integration:{publicBaseUrl:'custom'}}:{})});
  run(d);check(d.schemaMigrations.countDocuments({})===Object.keys(sources).length,'missing migration receipts');
  check(d.deploymentConfigurations.findOne().schemaVersion===5,'schema not migrated');
  const before=EJSON.stringify(d.deploymentConfigurations.findOne());
  run(d);check(EJSON.stringify(d.deploymentConfigurations.findOne())===before,'repeat changed data');
  const id=Object.keys(sources).sort()[1];sources[id]+='\n// tampered';let rejected=false;
  try{run(d);}catch(e){rejected=true;}check(rejected,'applied migration modification accepted');sources[id]=sources[id].replace('\n// tampered','');
  print('PASS ordered migration chain from schema'+schema+': repeat and checksum guard');
 }finally{d.dropDatabase();}
}
const d=db.getSiblingDB('qa_chain_failure_'+new ObjectId().toHexString());
try{
 d.deploymentConfigurations.insertOne({_id:'deployment-configuration',schemaVersion:4,version:0,payment:{}});
 const id=Object.keys(sources).sort()[1],original=sources[id];sources[id]='throw Error("injected failure")';
 let failed=false;try{run(d);}catch(e){failed=true;}check(failed&&d.schemaMigrations.countDocuments({})===1,'failure did not stop chain');
 sources[id]=original;run(d);check(d.schemaMigrations.countDocuments({})===Object.keys(sources).length,'retry did not resume missing steps');
 print('PASS failed step not recorded; retry resumes and completes');
}finally{d.dropDatabase();fs.rmSync(root,{recursive:true});}
''')
