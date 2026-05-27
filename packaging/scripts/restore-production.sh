#!/usr/bin/env bash
set -euo pipefail

if [[ "${CONFIRM_RESTORE:-}" != "true" ]]; then
  echo "Restore is destructive. Re-run with CONFIRM_RESTORE=true." >&2
  exit 1
fi

BACKUP_ARCHIVE="${1:-}"
if [[ -z "${BACKUP_ARCHIVE}" || ! -f "${BACKUP_ARCHIVE}" ]]; then
  echo "Usage: CONFIRM_RESTORE=true $0 /path/to/myscoutee-backup.tar.gz" >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"

SERVER_DIR="${MYSCOUTEE_SERVER_DIR:-${REPO_ROOT}/server}"
DATABASE_NAME="${MONGO_DATABASE:-myscoutee_db}"
WORK_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

tar -C "${WORK_DIR}" -xzf "${BACKUP_ARCHIVE}"

if [[ "${RESTORE_CONFIG:-false}" == "true" && -d "${WORK_DIR}/config" ]]; then
  cp -a "${WORK_DIR}/config/." "${SERVER_DIR}/"
fi

if [[ -f "${WORK_DIR}/mongo/${DATABASE_NAME}.archive.gz" ]]; then
  if ! docker ps --format '{{.Names}}' | grep -qx mongodb; then
    echo "mongodb container is not running; start the production stack before restore." >&2
    exit 1
  fi
  docker exec -i mongodb sh -lc "mongorestore --username \"\${MONGO_APP_USERNAME:-guest}\" --password \"\${MONGO_APP_PASSWORD:-guest}\" --authenticationDatabase \"\${MONGO_APP_DATABASE:-${DATABASE_NAME}}\" --db \"\${MONGO_APP_DATABASE:-${DATABASE_NAME}}\" --drop --archive --gzip" < "${WORK_DIR}/mongo/${DATABASE_NAME}.archive.gz"
fi

if [[ "${RESTORE_MINIO:-false}" == "true" && -f "${WORK_DIR}/minio-data.tar.gz" ]]; then
  (cd "${SERVER_DIR}" && docker compose -f docker-compose-prod.yml stop minio)
  rm -rf "${SERVER_DIR}/data/minio"
  mkdir -p "${SERVER_DIR}/data"
  tar -C "${SERVER_DIR}/data" -xzf "${WORK_DIR}/minio-data.tar.gz"
  (cd "${SERVER_DIR}" && docker compose -f docker-compose-prod.yml up -d minio)
fi

echo "Restore complete."
