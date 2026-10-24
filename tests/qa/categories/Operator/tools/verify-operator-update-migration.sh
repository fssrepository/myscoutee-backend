#!/usr/bin/env bash
# Exercise the candidate's actual v4 Mongo migration in an owned scratch DB.
# No application database, images, services or credentials are modified.
set -euo pipefail
source_script="${1:?Usage: verify-operator-update-migration.sh /path/to/candidate/mongo_import.sh}"
[[ -f "${source_script}" && ! -L "${source_script}" ]] || exit 2
work="$(mktemp -d)"
trap 'rm -rf -- "${work}"' EXIT
sed -n '/^migrate_deployment_configuration_v4() {$/,/^}$/p' "${source_script}" > "${work}/migration.sh"
[[ -s "${work}/migration.sh" ]] || { echo 'Candidate has no v4 migration.' >&2; exit 1; }
# Capture the JS emitted by the exact packaged shell function, using no DB call.
export MIGRATION_CAPTURE="${work}/migration.js"
(
  mongo_host=unused mongo_port=0 mongo_username=unused mongo_password=unused
  mongosh() { printf '%s' "${*: -1}" > "${MIGRATION_CAPTURE}"; }
  source "${work}/migration.sh"
  migrate_deployment_configuration_v4 unused
)
python3 - "${work}/migration.js" > "${work}/verify.js" <<'PY'
import json,sys,uuid
from pathlib import Path
migration=Path(sys.argv[1]).read_text()
print('const migration = '+json.dumps(migration)+';')
print('const fixtureName = '+json.dumps('qa_update_migration_'+uuid.uuid4().hex)+';')
PY
cat >> "${work}/verify.js" <<'JS'
const fixture = db.getSiblingDB(fixtureName);
if (fixture.getCollectionNames().length) throw Error('Fixture database already exists');
const assert = (condition, message) => { if (!condition) throw Error(message); };
const stringify = value => EJSON.stringify(value);
try {
  const control = {_id:'retained-user', name:'QA-owned control', image:'uploads/owned-control.webp'};
  fixture.users.insertOne(control);
  const cases = [
    {name:'untouched-v3', schema:3, edits:{}, theme:'VIOLET', version:13},
    {name:'operator-saved-v3', schema:3, edits:{revision:1}, theme:'AURORA', version:13},
    {name:'custom-brand-v3', schema:3, edits:{productName:'Custom'}, theme:'AURORA', version:13},
    {name:'untouched-v4', schema:4, edits:{}, theme:'VIOLET', version:13},
    {name:'operator-saved-v4', schema:4, edits:{revision:1}, theme:'AURORA', version:12}
  ];
  for (const test of cases) {
    fixture.deploymentConfigurations.deleteMany({});
    const before = {_id:'deployment-configuration',schemaVersion:test.schema,version:12,
      branding:{productName:'MyScoutee',logoCharacterIndex:0,homeLabel:'Your preferences come first',
        logoUrl:'assets/logo/heart.webp',themePreset:'AURORA',revision:0,...test.edits},
      privacy:{contact:'operator-owned-control'}, customControl:{enabled:true}};
    fixture.deploymentConfigurations.insertOne(before);
    new Function('db',migration)(fixture);
    const after=fixture.deploymentConfigurations.findOne({_id:before._id});
    const expected={...before,schemaVersion:4,version:test.version,
      branding:{...before.branding,themePreset:test.theme}};
    assert(stringify(after)===stringify(expected),test.name+': unexpected data change');
    new Function('db',migration)(fixture);
    assert(stringify(fixture.deploymentConfigurations.findOne({_id:before._id}))===stringify(after),
      test.name+': migration is not idempotent');
    assert(stringify(fixture.users.findOne({_id:control._id}))===stringify(control),
      test.name+': unrelated user control changed');
    print('PASS '+test.name+'; exact field preservation and repeat execution');
  }
} finally {
  fixture.dropDatabase();
}
print('PASS owned scratch database cleaned; application databases untouched');
JS
# Reuse the existing Mongo container. Credentials stay inside that container.
docker exec -i mongodb sh -c '
  exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" \
    --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin admin --file /dev/stdin
' < "${work}/verify.js"
