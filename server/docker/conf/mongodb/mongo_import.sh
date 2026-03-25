#! /bin/bash
set -euo pipefail

ls -1 /docker-entrypoint-initdb.d/myscoutee_db/*.json | while read -r jsonfile; do
  mongoimport \
    -h 127.0.0.1 \
    -d myscoutee_db \
    -u guest \
    -p guest \
    --mode=upsert \
    --upsertFields _id \
    --file "$jsonfile" \
    --jsonArray \
    --type json
 done
