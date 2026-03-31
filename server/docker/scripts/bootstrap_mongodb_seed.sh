#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BOOTSTRAP_DB_NAME="${MONGO_BOOTSTRAP_DATABASE:-demo_db}"
DATA_DIR="${MONGO_BOOTSTRAP_DATA_DIR:-${SERVER_ROOT}/data/mongodb/demo-data-v8}"
SEED_DIR="${MONGO_BOOTSTRAP_SEED_DIR:-${SERVER_ROOT}/docker/conf/mongodb/${BOOTSTRAP_DB_NAME}}"
SEED_HASH_FILE="${SERVER_ROOT}/data/mongodb/.${BOOTSTRAP_DB_NAME}_seed_hash"
SEED_FILES=(
  "${SERVER_ROOT}/docker/conf/mongodb/db_init.js"
  "${SERVER_ROOT}/docker/conf/mongodb/mongo_import.sh"
)

while IFS= read -r seed_file; do
  SEED_FILES+=("${seed_file}")
done < <(find "${SEED_DIR}" -maxdepth 1 -type f -name '*.json' | sort)

mkdir -p "${DATA_DIR}" "$(dirname "${SEED_HASH_FILE}")"

if docker ps --format '{{.Names}}' | grep -qx 'mongodb'; then
  echo "mongodb container is running. Stop the compose stack before bootstrapping the ${BOOTSTRAP_DB_NAME} seed." >&2
  exit 1
fi

if [ ${#SEED_FILES[@]} -le 2 ]; then
  echo "No JSON seed files found in ${SEED_DIR}. Nothing to bootstrap." >&2
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
  echo "Mongo ${BOOTSTRAP_DB_NAME} seed unchanged (${seed_hash}). Keeping existing data in ${DATA_DIR}."
  exit 0
fi

clear_data_dir() {
  if find "${DATA_DIR}" -mindepth 1 -maxdepth 1 -exec rm -rf {} + 2>/dev/null; then
    return 0
  fi

  echo "Local cleanup could not remove ${DATA_DIR}; retrying through a temporary container."
  docker run --rm -v "${DATA_DIR}:/data" alpine sh -c 'rm -rf /data/* /data/.[!.]* /data/..?* 2>/dev/null || true'
}

if [ "${data_present}" -eq 1 ]; then
  echo "Refreshing Mongo data in ${DATA_DIR} for ${BOOTSTRAP_DB_NAME} seed ${seed_hash}."
  clear_data_dir
else
  echo "Mongo data directory is already empty. Recording ${BOOTSTRAP_DB_NAME} seed ${seed_hash}."
fi

printf '%s\n' "${seed_hash}" > "${SEED_HASH_FILE}"
echo "Next 'docker compose up' will initialize Mongo from ${SEED_DIR}."
