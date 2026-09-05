#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SCENARIO_SCRIPT="${SCRIPT_DIR}/event-payment-ready.js"

usage() {
  cat <<'USAGE'
Usage:
  bash tools/smoke/event-payment-ready.sh prepare
  bash tools/smoke/event-payment-ready.sh status
  bash tools/smoke/event-payment-ready.sh replay
  bash tools/smoke/event-payment-ready.sh reset

Creates one local Event Explore smoke record whose basket is already confirmed,
so opening "Continue booking" starts at payment-method assignment.

The helper accepts only demo_db or e2e_db and never starts/restarts services.
Environment overrides:
  EVENT_PAYMENT_SMOKE_DB=demo_db
  EVENT_PAYMENT_SMOKE_USER_ID=af0436815ab38f4864dd1e24
  EVENT_PAYMENT_SMOKE_HOST_ID=0216b1ceb256d6f2c89073b8
  EVENT_PAYMENT_SMOKE_MONGO_CONTAINER=mongodb
  EVENT_PAYMENT_SMOKE_MONGO_USERNAME=guest
  EVENT_PAYMENT_SMOKE_MONGO_PASSWORD=guest
USAGE
}

fail() {
  printf 'event-payment-ready: %s\n' "$*" >&2
  exit 2
}

command_name="${1:-}"
case "${command_name}" in
  prepare|status|replay|reset) ;;
  -h|--help|help)
    usage
    exit 0
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac

target_db="${EVENT_PAYMENT_SMOKE_DB:-demo_db}"
mongo_container="${EVENT_PAYMENT_SMOKE_MONGO_CONTAINER:-mongodb}"
mongo_username="${EVENT_PAYMENT_SMOKE_MONGO_USERNAME:-${MONGO_APP_USERNAME:-guest}}"
mongo_password="${EVENT_PAYMENT_SMOKE_MONGO_PASSWORD:-${MONGO_APP_PASSWORD:-guest}}"
target_user_id="${EVENT_PAYMENT_SMOKE_USER_ID:-af0436815ab38f4864dd1e24}"
host_user_id="${EVENT_PAYMENT_SMOKE_HOST_ID:-0216b1ceb256d6f2c89073b8}"

case "${target_db}" in
  demo_db|e2e_db) ;;
  *) fail "EVENT_PAYMENT_SMOKE_DB must be exactly demo_db or e2e_db (got '${target_db}')." ;;
esac

[ -f "${SCENARIO_SCRIPT}" ] || fail "missing ${SCENARIO_SCRIPT}."
command -v docker >/dev/null 2>&1 || fail "docker is required to use the already-running MongoDB container."

container_running="$(docker inspect --format '{{.State.Running}}' "${mongo_container}" 2>/dev/null || true)"
[ "${container_running}" = "true" ] \
  || fail "Mongo container '${mongo_container}' is not already running. This helper will not start it."

docker exec -i \
  -e "SMOKE_COMMAND=${command_name}" \
  -e "SMOKE_DB=${target_db}" \
  -e "SMOKE_USER_ID=${target_user_id}" \
  -e "SMOKE_HOST_ID=${host_user_id}" \
  "${mongo_container}" \
  mongosh \
    --quiet \
    --username "${mongo_username}" \
    --password "${mongo_password}" \
    --authenticationDatabase "${target_db}" \
    "${target_db}" \
    --file /dev/stdin < "${SCENARIO_SCRIPT}"
