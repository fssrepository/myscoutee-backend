#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SCENARIO_SCRIPT="${SCRIPT_DIR}/payment-method-expiry.js"

usage() {
  cat <<'USAGE'
Usage:
  bash tools/smoke/payment-method-expiry.sh prepare
  bash tools/smoke/payment-method-expiry.sh status
  bash tools/smoke/payment-method-expiry.sh run
  bash tools/smoke/payment-method-expiry.sh reset

Stages one expired active card, arms the real payment-method-expiry schedule,
and verifies one card transition, outbox record and in-app notification. The
run command waits at most 95 seconds and always restores the exact fixture
scope before returning.
USAGE
}

fail() {
  printf 'payment-method-expiry: %s\n' "$*" >&2
  exit 2
}

command_name="${1:-}"
case "${command_name}" in
  prepare|status|run|reset) ;;
  -h|--help|help) usage; exit 0 ;;
  *) usage >&2; exit 2 ;;
esac

target_db="${PAYMENT_EXPIRY_SMOKE_DB:-demo_db}"
mongo_container="${PAYMENT_EXPIRY_SMOKE_MONGO_CONTAINER:-mongodb}"
mongo_username="${PAYMENT_EXPIRY_SMOKE_MONGO_USERNAME:-${MONGO_APP_USERNAME:-guest}}"
mongo_password="${PAYMENT_EXPIRY_SMOKE_MONGO_PASSWORD:-${MONGO_APP_PASSWORD:-guest}}"
target_user_id="${PAYMENT_EXPIRY_SMOKE_USER_ID:-af0436815ab38f4864dd1e24}"

case "${target_db}" in demo_db|e2e_db) ;; *) fail "database must be demo_db or e2e_db" ;; esac
[ -f "${SCENARIO_SCRIPT}" ] || fail "missing ${SCENARIO_SCRIPT}"
command -v docker >/dev/null 2>&1 || fail 'docker is required'
[ "$(docker inspect --format '{{.State.Running}}' "${mongo_container}" 2>/dev/null || true)" = 'true' ] \
  || fail "Mongo container '${mongo_container}' is not already running"

mongo_run() {
  local operation="$1"
  docker exec -i \
    -e "SMOKE_COMMAND=${operation}" \
    -e "SMOKE_DB=${target_db}" \
    -e "SMOKE_USER_ID=${target_user_id}" \
    "${mongo_container}" \
    mongosh --quiet \
      --username "${mongo_username}" \
      --password "${mongo_password}" \
      --authenticationDatabase "${target_db}" \
      "${target_db}" --file /dev/stdin < "${SCENARIO_SCRIPT}"
}

if [ "${command_name}" != 'run' ]; then
  mongo_run "${command_name}"
  exit 0
fi

mongo_run prepare
verified=false
cleanup() {
  mongo_run reset >/dev/null || true
}
trap cleanup EXIT
for _attempt in $(seq 1 19); do
  if mongo_run check >/dev/null 2>&1; then
    verified=true
    break
  fi
  sleep 5
done
if [ "${verified}" != 'true' ]; then
  mongo_run status
  fail 'real scheduler did not complete the expiry transition within 95 seconds'
fi
mongo_run status
mongo_run reset
trap - EXIT
