#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

default_server_dir() {
  if [[ "${SCRIPT_DIR}" == /opt/myscoutee/packaging/scripts && -f /opt/myscoutee/server/docker-compose-prod.yml ]]; then
    printf '/opt/myscoutee/server'
    return
  fi

  local repo_root
  repo_root="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
  printf '%s/server' "${repo_root}"
}

SERVER_DIR="${MYSCOUTEE_SERVER_DIR:-$(default_server_dir)}"

default_env_file() {
  if [[ "${SERVER_DIR}" == /opt/myscoutee/server && -f /etc/myscoutee/myscoutee.env ]]; then
    printf '/etc/myscoutee/myscoutee.env'
    return
  fi

  printf '%s/.env' "${SERVER_DIR}"
}

default_secrets_file() {
  if [[ "${SERVER_DIR}" == /opt/myscoutee/server && -f /etc/myscoutee/myscoutee.secrets.env ]]; then
    printf '/etc/myscoutee/myscoutee.secrets.env'
    return
  fi

  printf '%s/.env.secrets' "${SERVER_DIR}"
}

ENV_FILE="${MYSCOUTEE_ENV_FILE:-$(default_env_file)}"
SECRETS_ENV_FILE="${MYSCOUTEE_SECRETS_ENV_FILE:-$(default_secrets_file)}"

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

config_value() {
  local key="$1"
  local current="${!key-}"

  if [[ -n "${current}" ]]; then
    printf '%s' "${current}"
    return 0
  fi

  read_env_file_value "${key}" "${ENV_FILE}"
}

secret_value() {
  local key="$1"
  local current="${!key-}"

  if [[ -n "${current}" ]]; then
    printf '%s' "${current}"
    return 0
  fi

  read_env_file_value "${key}" "${SECRETS_ENV_FILE}"
}

is_truthy() {
  local value="${1,,}"

  case "${value}" in
    1|true|yes|on|enabled)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

COMPOSE_FILES=(-f docker-compose-prod.yml)
REPLICA_SET_ENABLED="$(config_value MONGO_REPLICA_SET_ENABLED || true)"

if is_truthy "${REPLICA_SET_ENABLED}"; then
  if [[ ! -f "${SERVER_DIR}/docker-compose.replicaset.yml" ]]; then
    echo "Mongo replica set is enabled, but ${SERVER_DIR}/docker-compose.replicaset.yml is missing." >&2
    exit 1
  fi

  COMPOSE_FILES+=(-f docker-compose.replicaset.yml)
fi

run_compose() {
  (cd "${SERVER_DIR}" && docker compose "${COMPOSE_FILES[@]}" "$@")
}

ensure_replica_set() {
  local retries delay attempt root_user root_password js
  retries="$(config_value MONGO_REPLICA_SET_INIT_RETRIES || true)"
  delay="$(config_value MONGO_REPLICA_SET_INIT_DELAY_SECONDS || true)"
  retries="${retries:-60}"
  delay="${delay:-2}"
  root_user="$(secret_value MONGO_INITDB_ROOT_USERNAME || true)"
  root_password="$(secret_value MONGO_INITDB_ROOT_PASSWORD || true)"
  js='const name = process.env.MONGO_REPLICA_SET_NAME || "rs0";
const host = process.env.MONGO_REPLICA_SET_HOST || "mongodb:27017";
try {
  const status = rs.status();
  quit(status.ok === 1 ? 0 : 2);
} catch (error) {
  try {
    const result = rs.initiate({ _id: name, members: [{ _id: 0, host }] });
    quit(result.ok === 1 ? 0 : 3);
  } catch (initError) {
    print(initError.message);
    quit(4);
  }
}'

  for ((attempt = 1; attempt <= retries; attempt++)); do
    local command=(docker compose "${COMPOSE_FILES[@]}" exec -T mongodb mongosh --quiet)
    if [[ -n "${root_user}" && -n "${root_password}" ]]; then
      command+=(--username "${root_user}" --password "${root_password}" --authenticationDatabase admin)
    fi
    command+=(--eval "${js}")

    if (cd "${SERVER_DIR}" && "${command[@]}" >/dev/null 2>&1); then
      echo "Mongo replica set is ready."
      return 0
    fi

    sleep "${delay}"
  done

  echo "Mongo replica set did not become ready after $((retries * delay)) seconds." >&2
  return 1
}

if [[ "$#" -eq 0 ]]; then
  set -- up -d
fi

ensure_firebase_service_account() {
  local enabled service_account_path

  enabled="$(config_value FIREBASE_ENABLED || true)"
  enabled="${enabled:-true}"
  if ! is_truthy "${enabled}"; then
    return 0
  fi

  service_account_path="${SERVER_DIR}/projects/profile/secrets/firebase-service-account.json"
  if [[ -d "${service_account_path}" ]]; then
    echo "Firebase is enabled, but ${service_account_path} is a directory." >&2
    echo "Replace it with the Firebase Admin SDK service account JSON file." >&2
    exit 1
  fi
  if [[ ! -s "${service_account_path}" ]]; then
    echo "Firebase is enabled, but ${service_account_path} is missing or empty." >&2
    echo "Add the Firebase Admin SDK service account JSON, or set FIREBASE_ENABLED=false." >&2
    exit 1
  fi
}

case "${1:-}" in
  up|start|restart)
    ensure_firebase_service_account
    ;;
esac

run_compose "$@"

case "${1:-}" in
  up|start|restart)
    if is_truthy "${REPLICA_SET_ENABLED}"; then
      ensure_replica_set
    fi
    ;;
esac
