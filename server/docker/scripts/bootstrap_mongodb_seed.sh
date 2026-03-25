#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
DATA_DIR="${SERVER_ROOT}/data/mongodb/data"
SEED_HASH_FILE="${SERVER_ROOT}/data/mongodb/.seed_hash"
SEED_FILES=(
  "${SERVER_ROOT}/docker/conf/mongodb/db_init.js"
  "${SERVER_ROOT}/docker/conf/mongodb/mongo_import.sh"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/users.json"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/userRates.json"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/userFilterPreferences.json"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/assets.json"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/activityMembers.json"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/activityResources.json"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/chats.json"
  "${SERVER_ROOT}/docker/conf/mongodb/myscoutee_db/events.json"
)

mkdir -p "${DATA_DIR}" "$(dirname "${SEED_HASH_FILE}")"

if docker ps --format '{{.Names}}' | grep -qx 'mongodb'; then
  echo "mongodb container is running. Stop the compose stack before bootstrapping the frontend demo seed." >&2
  exit 1
fi

seed_hash="$(sha256sum "${SEED_FILES[@]}" | sha256sum | awk '{print $1}')"
existing_hash=""
if [ -f "${SEED_HASH_FILE}" ]; then
  existing_hash="$(tr -d '[:space:]' < "${SEED_HASH_FILE}")"
fi

if find "${DATA_DIR}" -mindepth 1 -print -quit | grep -q .; then
  data_present=1
else
  data_present=0
fi

if [ "${existing_hash}" = "${seed_hash}" ] && [ "${data_present}" -eq 1 ]; then
  echo "Mongo frontend demo seed unchanged (${seed_hash}). Keeping existing data in ${DATA_DIR}."
  exit 0
fi

if [ "${data_present}" -eq 1 ]; then
  echo "Refreshing Mongo data in ${DATA_DIR} for frontend demo seed ${seed_hash}."
  find "${DATA_DIR}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
else
  echo "Mongo data directory is already empty. Recording frontend demo seed ${seed_hash}."
fi

printf '%s\n' "${seed_hash}" > "${SEED_HASH_FILE}"
echo "Next 'docker compose up' will initialize Mongo from server/docker/conf/mongodb/myscoutee_db."
