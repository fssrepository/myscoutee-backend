#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"

SERVER_DIR="${MYSCOUTEE_SERVER_DIR:-${REPO_ROOT}/server}"
BACKUP_DIR="${MYSCOUTEE_BACKUP_DIR:-${REPO_ROOT}/packaging/dist/backups}"
DATABASE_NAME="${MONGO_DATABASE:-myscoutee_db}"
TIMESTAMP="$(date '+%Y%m%d-%H%M%S')"
BACKUP_NAME="myscoutee-backup-${TIMESTAMP}"
WORK_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

mkdir -p "${BACKUP_DIR}" "${WORK_DIR}/mongo" "${WORK_DIR}/config"

if docker ps --format '{{.Names}}' | grep -qx mongodb; then
  docker exec mongodb sh -lc "mongodump --username \"\${MONGO_APP_USERNAME:-guest}\" --password \"\${MONGO_APP_PASSWORD:-guest}\" --authenticationDatabase \"\${MONGO_APP_DATABASE:-${DATABASE_NAME}}\" --db \"\${MONGO_APP_DATABASE:-${DATABASE_NAME}}\" --archive --gzip" > "${WORK_DIR}/mongo/${DATABASE_NAME}.archive.gz"
else
  echo "Warning: mongodb container is not running; Mongo backup skipped." >&2
fi

for config_file in .env .env.secrets docker-compose-prod.yml; do
  if [[ -f "${SERVER_DIR}/${config_file}" ]]; then
    cp -a "${SERVER_DIR}/${config_file}" "${WORK_DIR}/config/${config_file}"
  fi
done

if [[ -d "${SERVER_DIR}/data/minio" ]]; then
  tar -C "${SERVER_DIR}/data" -czf "${WORK_DIR}/minio-data.tar.gz" minio
else
  echo "Warning: MinIO data directory not found; MinIO backup skipped." >&2
fi

tar -C "${WORK_DIR}" -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" .

echo "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
