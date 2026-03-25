#! /bin/bash
set -euo pipefail

db_name="${MONGO_APP_DATABASE:-${MONGO_INITDB_DATABASE:-demo_db}}"
seed_dir_name="${MONGO_SEED_DIRECTORY:-${db_name}}"
seed_dir="/docker-entrypoint-initdb.d/${seed_dir_name}"

if [ ! -d "${seed_dir}" ]; then
  echo "Seed directory ${seed_dir} does not exist, skipping mongoimport."
  exit 0
fi

find "${seed_dir}" -maxdepth 1 -type f -name '*.json' | sort | while read -r jsonfile; do
  mongoimport \
    -h 127.0.0.1 \
    -d "${db_name}" \
    -u guest \
    -p guest \
    --mode=upsert \
    --upsertFields _id \
    --file "$jsonfile" \
    --jsonArray \
    --type json
 done
