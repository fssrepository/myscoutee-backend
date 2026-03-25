#!/bin/bash
set -euo pipefail

IMPORT_ROOT="/docker-entrypoint-initdb.d/myscoutee_db"
COMMON_ARGS=(
  -h 127.0.0.1
  -d myscoutee_db
  -u guest
  -p guest
  --mode=upsert
  --upsertFields _id
  --jsonArray
  --type json
)

import_file() {
  local collection="$1"
  local file_name="$2"
  mongoimport "${COMMON_ARGS[@]}" --collection "$collection" --file "${IMPORT_ROOT}/${file_name}"
}

import_file groups chat_group.json
import_file profiles chat_profile.json
import_file users chat_user.json
import_file events chat.json
import_file messages chat_message.json
