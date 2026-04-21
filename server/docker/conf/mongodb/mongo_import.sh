#! /bin/bash
set -euo pipefail

db_name="${MONGO_APP_DATABASE:-${MONGO_INITDB_DATABASE:-demo_db}}"
seed_dir_name="${MONGO_SEED_DIRECTORY:-${db_name}}"
seed_root="/docker-entrypoint-initdb.d"

import_seed_directory() {
  local target_db="$1"
  local target_seed_dir_name="$2"
  local seed_dir="${seed_root}/${target_seed_dir_name}"

  if [ ! -d "${seed_dir}" ]; then
    echo "Seed directory ${seed_dir} does not exist, skipping mongoimport."
    return 0
  fi

  find "${seed_dir}" -maxdepth 1 -type f -name '*.json' | sort | while read -r jsonfile; do
    # All seed files are JSON arrays of documents. If the file contains no object
    # start at all, it is just an empty array like "[]", which mongoimport rejects.
    if ! grep -q '{' "${jsonfile}"; then
      echo "Skipping empty JSON array seed ${jsonfile}"
      continue
    fi

    mongoimport \
      -h 127.0.0.1 \
      -d "${target_db}" \
      -u guest \
      -p guest \
      --mode=upsert \
      --upsertFields _id \
      --file "$jsonfile" \
      --jsonArray \
      --type json
  done
}

if [ "${MONGO_IMPORT_ALL_SEED_DATABASES:-false}" = "true" ]; then
  import_seed_directory "demo_db" "demo_db"
  import_seed_directory "myscoutee_db" "myscoutee_db"
  exit 0
fi

import_seed_directory "${db_name}" "${seed_dir_name}"
