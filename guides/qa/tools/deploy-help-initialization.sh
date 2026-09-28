#!/usr/bin/env bash
# Run on the configured QA VM against its existing Mongo container.
# Exercise the installed importer only in a disposable, explicitly scoped DB.
set -euo pipefail
docker exec -i mongodb bash -s <<'CONTAINER'
set -euo pipefail
export QA_HELP_DB="qa_deploy_help_$(date +%s)_$$"
root_eval() {
  mongosh --quiet -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" \
    --authenticationDatabase admin admin --eval "$1"
}
cleanup() {
  root_eval 'const q=db.getSiblingDB(process.env.QA_HELP_DB); q.dropAllUsers(); q.dropDatabase();
    if(db.adminCommand({listDatabases:1,nameOnly:true}).databases.some(x=>x.name===process.env.QA_HELP_DB)) throw Error("Cleanup failed");
    print("PASS disposable help database cleanup");'
}
root_eval 'const name=process.env.QA_HELP_DB;
  if(!/^qa_deploy_help_[0-9]+_[0-9]+$/.test(name)) throw Error("Unsafe database");
  if(db.adminCommand({listDatabases:1,nameOnly:true}).databases.some(x=>x.name===name)) throw Error("Database exists");
  db.getSiblingDB(name).createUser({user:process.env.MONGO_INITDB_ROOT_USERNAME,pwd:process.env.MONGO_INITDB_ROOT_PASSWORD,roles:[{role:"dbOwner",db:name}]});' >/dev/null
trap cleanup EXIT
export MONGO_APP_DATABASE="$QA_HELP_DB"
export MONGO_IMPORT_USERNAME="$MONGO_INITDB_ROOT_USERNAME"
export MONGO_IMPORT_PASSWORD="$MONGO_INITDB_ROOT_PASSWORD"
export MONGO_IMPORT_ALLOWED_COLLECTIONS_BY_DB="$QA_HELP_DB:helpCenterRevisions"
export MONGO_IMPORT_SINGLE_FILE=/docker-entrypoint-initdb.d/myscoutee_db/helpCenterRevisions.json
bash /docker-entrypoint-initdb.d/mongo_import.sh
root_eval 'const q=db.getSiblingDB(process.env.QA_HELP_DB);
  const seeds=EJSON.parse(require("fs").readFileSync(process.env.MONGO_IMPORT_SINGLE_FILE,"utf8"));
  for(const lang of ["en","hu"]) {
    const expected=seeds.find(x=>x.documentType==="help"&&x.lang===lang&&x.version===3);
    const actual=q.helpCenterRevisions.findOne({_id:expected._id});
    for(const field of Object.keys(expected)) if(EJSON.stringify(actual[field])!==EJSON.stringify(expected[field])) throw Error("Seed mismatch "+lang+" "+field);
    if(q.helpCenterRevisions.countDocuments({documentType:"help",lang,active:true})!==1) throw Error("Active help ambiguous");
  }
  if(q.users.countDocuments({})!==0) throw Error("Unexpected users");
  print("PASS installed help importer: fresh HU/EN v3 matches canonical seed, no users");'
CONTAINER
