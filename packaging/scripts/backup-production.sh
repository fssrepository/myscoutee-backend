#!/usr/bin/env bash
set -euo pipefail
umask 077

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"

SERVER_DIR="${MYSCOUTEE_SERVER_DIR:-${REPO_ROOT}/server}"
if [[ -n "${MYSCOUTEE_BACKUP_DIR:-}" ]]; then
  BACKUP_DIR="${MYSCOUTEE_BACKUP_DIR}"
elif [[ "${SERVER_DIR}" == "/opt/myscoutee/server" ]]; then
  # Keep installed backups outside /opt/myscoutee: apt purge intentionally
  # removes that tree.
  BACKUP_DIR="/var/backups/myscoutee"
else
  BACKUP_DIR="${REPO_ROOT}/packaging/dist/backups"
fi
DATABASE_NAME="${MONGO_DATABASE:-myscoutee_db}"
TIMESTAMP="$(date '+%Y%m%d-%H%M%S')"
BACKUP_NAME="myscoutee-backup-${TIMESTAMP}"
WORK_DIR="$(mktemp -d)"

read_env_file_value() {
  local key="$1"
  local file="$2"
  local line value

  [[ -f "${file}" ]] || return 1
  line="$(sed -n "s/^[[:space:]]*${key}[[:space:]]*=[[:space:]]*//p" "${file}" | tail -n 1)"
  [[ -n "${line}" ]] || return 1

  value="${line%$'\r'}"
  if [[ "${value}" == \"*\" && "${value}" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "${value}" == \'*\' && "${value}" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi

  printf '%s' "${value}"
}

resolve_host_path() {
  local value="$1"

  case "${value}" in
    /*)
      printf '%s' "${value}"
      ;;
    *)
      printf '%s/%s' "${SERVER_DIR}" "${value#./}"
      ;;
  esac
}

default_registry_key_dir() {
  if [[ "${SERVER_DIR}" == "/opt/myscoutee/server" ]]; then
    printf '/etc/myscoutee/registry'
  else
    printf '%s/data/registry-keys' "${SERVER_DIR}"
  fi
}

default_registry_state_dir() {
  if [[ "${SERVER_DIR}" == "/opt/myscoutee/server" ]]; then
    printf '/var/lib/myscoutee/registry'
  else
    printf '%s/data/registry' "${SERVER_DIR}"
  fi
}

cleanup() {
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

ENV_FILE="${SERVER_DIR}/.env"
registry_key_dir_value="${REGISTRY_KEY_DIR_HOST:-$(read_env_file_value REGISTRY_KEY_DIR_HOST "${ENV_FILE}" || true)}"
registry_state_dir_value="${REGISTRY_STATE_DIR_HOST:-$(read_env_file_value REGISTRY_STATE_DIR_HOST "${ENV_FILE}" || true)}"
REGISTRY_KEY_DIR="${MYSCOUTEE_REGISTRY_KEY_DIR:-$(resolve_host_path "${registry_key_dir_value:-$(default_registry_key_dir)}")}"
REGISTRY_STATE_DIR="${MYSCOUTEE_REGISTRY_STATE_DIR:-$(resolve_host_path "${registry_state_dir_value:-$(default_registry_state_dir)}")}"

mkdir -p "${BACKUP_DIR}" "${WORK_DIR}/mongo" "${WORK_DIR}/config" "${WORK_DIR}/registry"

if docker ps --format '{{.Names}}' | grep -qx mongodb; then
  docker exec mongodb sh -lc "mongodump --username \"\${MONGO_APP_USERNAME:-guest}\" --password \"\${MONGO_APP_PASSWORD:-guest}\" --authenticationDatabase \"\${MONGO_APP_DATABASE:-${DATABASE_NAME}}\" --db \"\${MONGO_APP_DATABASE:-${DATABASE_NAME}}\" --archive --gzip" > "${WORK_DIR}/mongo/${DATABASE_NAME}.archive.gz"
else
  echo "Warning: mongodb container is not running; Mongo backup skipped." >&2
fi

for config_file in .env .env.secrets docker-compose-prod.yml; do
  if [[ -f "${SERVER_DIR}/${config_file}" ]]; then
    if [[ "${config_file}" == ".env.secrets" ]]; then
      install -m 0600 "${SERVER_DIR}/${config_file}" "${WORK_DIR}/config/${config_file}"
    else
      install -m 0644 "${SERVER_DIR}/${config_file}" "${WORK_DIR}/config/${config_file}"
    fi
  fi
done

if [[ -L "${REGISTRY_KEY_DIR}" \
  || -L "${REGISTRY_KEY_DIR}/deployment-private-key.pem" \
  || -L "${REGISTRY_KEY_DIR}/deployment-public-key.der" ]]; then
  echo "Deployment registry key backup paths must not be symbolic links." >&2
  exit 1
elif [[ -f "${REGISTRY_KEY_DIR}/deployment-private-key.pem" \
  && -f "${REGISTRY_KEY_DIR}/deployment-public-key.der" ]]; then
  mkdir -p "${WORK_DIR}/registry/keys"
  cp -a "${REGISTRY_KEY_DIR}/." "${WORK_DIR}/registry/keys/"
else
  echo "Warning: deployment registry keypair was not found under ${REGISTRY_KEY_DIR}; identity backup skipped." >&2
fi

if [[ -L "${REGISTRY_STATE_DIR}" ]]; then
  echo "Deployment registry state backup path must not be a symbolic link." >&2
  exit 1
elif [[ -d "${REGISTRY_STATE_DIR}" ]]; then
  if find "${REGISTRY_STATE_DIR}" -type l -print -quit | grep -q .; then
    echo "Deployment registry state backup path must not contain symbolic links." >&2
    exit 1
  fi
  mkdir -p "${WORK_DIR}/registry/state"
  cp -a "${REGISTRY_STATE_DIR}/." "${WORK_DIR}/registry/state/"
else
  echo "Warning: deployment registry state was not found under ${REGISTRY_STATE_DIR}; registry state backup skipped." >&2
fi

if [[ -d "${SERVER_DIR}/data/minio" ]]; then
  tar -C "${SERVER_DIR}/data" -czf "${WORK_DIR}/minio-data.tar.gz" minio
else
  echo "Warning: MinIO data directory not found; MinIO backup skipped." >&2
fi

tar -C "${WORK_DIR}" -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" .
chmod 0600 "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
sync -f "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
sync -f "${BACKUP_DIR}"

echo "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
