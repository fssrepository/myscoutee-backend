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

import_file users users.json
import_file userRates userRates.json
import_file userFilterPreferences userFilterPreferences.json
import_file assets assets.json
import_file activityMembers activityMembers.json
import_file activityResources activityResources.json
import_file chats chats.json
import_file events events.json
