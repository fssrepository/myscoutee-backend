#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
COMMON_SCRIPT="${SCRIPT_DIR}/scenarios/common.js"

usage() {
  cat <<'USAGE'
Usage:
  bash manual-qa-checkpoints.sh stage base-stat
  bash manual-qa-checkpoints.sh status base-stat
  bash manual-qa-checkpoints.sh reset base-stat
  bash manual-qa-checkpoints.sh stage stat-010
  bash manual-qa-checkpoints.sh status stat-010
  bash manual-qa-checkpoints.sh reset stat-010
  bash manual-qa-checkpoints.sh stage graph-rating
  bash manual-qa-checkpoints.sh status graph-rating
  bash manual-qa-checkpoints.sh reset graph-rating
  bash manual-qa-checkpoints.sh stage stat-011
  bash manual-qa-checkpoints.sh status stat-011
  bash manual-qa-checkpoints.sh reset stat-011
  bash manual-qa-checkpoints.sh stage stat-020
  bash manual-qa-checkpoints.sh schedule stat-020 [delay-seconds]
  bash manual-qa-checkpoints.sh status stat-020
  bash manual-qa-checkpoints.sh reset stat-020
  bash manual-qa-checkpoints.sh stage stat-012
  bash manual-qa-checkpoints.sh hold stat-012
  bash manual-qa-checkpoints.sh status stat-012
  bash manual-qa-checkpoints.sh schedule stat-012 [delay-seconds]
  bash manual-qa-checkpoints.sh reset stat-012
  bash manual-qa-checkpoints.sh stage event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh next event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh status event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh reset event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh stage asset-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh next asset-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh status asset-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh reset asset-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh stage operator-domain OPERATOR-FIREBASE-001
  bash manual-qa-checkpoints.sh next operator-domain OPERATOR-FIREBASE-001
  bash manual-qa-checkpoints.sh status operator-domain OPERATOR-FIREBASE-001
  bash manual-qa-checkpoints.sh reset operator-domain OPERATOR-FIREBASE-001

The default schedule delay is 30 seconds; accepted values are 10..120.
Only demo_db and e2e_db are accepted. This tool never starts or restarts Mongo,
the backend, the frontend, or a scheduler. It only stages manual-QA data and
temporarily changes the persisted real scheduler timing.

Environment:
  MANUAL_QA_DB                 demo_db (default) or e2e_db
  MANUAL_QA_MONGO_MODE         auto (default), container, or local
  MANUAL_QA_MONGO_CONTAINER    mongodb by default
  MANUAL_QA_MONGO_USERNAME     guest by default
  MANUAL_QA_MONGO_PASSWORD     guest by default
  MANUAL_QA_MONGO_HOST         127.0.0.1 by default
  MANUAL_QA_MONGO_PORT         27017 by default
  MANUAL_QA_CREATOR_USER_ID    optional fixed event creator; use with invitee
  MANUAL_QA_INVITEE_USER_ID    optional fixed target user; use with creator
  MANUAL_QA_CHAT_TITLE          optional STAT-011 chat title
  MANUAL_QA_EVENT_ID            optional STAT-020 event source/document ID
  MANUAL_QA_CHECKPOINT_ID       set internally for checkpoint-runner commands
USAGE
}

fail() {
  printf 'manual-qa-checkpoints: %s\n' "$*" >&2
  exit 2
}

run_scenario() {
  local command="$1"
  local scenario="$2"
  local delay_seconds="${3:-30}"
  local checkpoint_id="${4:-}"
  local target_db="${MANUAL_QA_DB:-demo_db}"
  local mongo_mode="${MANUAL_QA_MONGO_MODE:-auto}"
  local mongo_container="${MANUAL_QA_MONGO_CONTAINER:-mongodb}"
  local mongo_username="${MANUAL_QA_MONGO_USERNAME:-${MONGO_APP_USERNAME:-guest}}"
  local mongo_password="${MANUAL_QA_MONGO_PASSWORD:-${MONGO_APP_PASSWORD:-guest}}"
  local mongo_host="${MANUAL_QA_MONGO_HOST:-127.0.0.1}"
  local mongo_port="${MANUAL_QA_MONGO_PORT:-27017}"
  local scenario_script=""

  case "${scenario}" in
    base-stat) scenario_script="${SCRIPT_DIR}/scenarios/base-stat.js" ;;
    stat-010) scenario_script="${SCRIPT_DIR}/scenarios/stat-010-rating.js" ;;
    graph-rating) scenario_script="${SCRIPT_DIR}/scenarios/graph-rating.js" ;;
    stat-011) scenario_script="${SCRIPT_DIR}/scenarios/stat-011-chat.js" ;;
    stat-020) scenario_script="${SCRIPT_DIR}/scenarios/stat-020-graph-timeline.js" ;;
    stat-012) scenario_script="${SCRIPT_DIR}/scenarios/stat-012-auto-inviter.js" ;;
    event-domain) scenario_script="${SCRIPT_DIR}/scenarios/event-domain-checkpoints.js" ;;
    asset-domain) scenario_script="${SCRIPT_DIR}/scenarios/asset-domain-checkpoints.js" ;;
    operator-domain) scenario_script="${SCRIPT_DIR}/scenarios/operator-domain-checkpoints.js" ;;
    *) fail "Unknown manual scenario '${scenario}'." ;;
  esac

  case "${target_db}" in
    demo_db|e2e_db) ;;
    *) fail "MANUAL_QA_DB must be exactly demo_db or e2e_db (got '${target_db}')." ;;
  esac
  case "${mongo_mode}" in
    auto|container|local) ;;
    *) fail "MANUAL_QA_MONGO_MODE must be auto, container, or local." ;;
  esac
  [ -f "${COMMON_SCRIPT}" ] || fail "Missing ${COMMON_SCRIPT}."
  [ -f "${scenario_script}" ] || fail "Missing ${scenario_script}."

  local container_running="false"
  if command -v docker >/dev/null 2>&1 \
      && docker inspect --format '{{.State.Running}}' "${mongo_container}" >/dev/null 2>&1; then
    container_running="$(docker inspect --format '{{.State.Running}}' "${mongo_container}")"
  fi

  if [ "${mongo_mode}" = "container" ] || { [ "${mongo_mode}" = "auto" ] && [ "${container_running}" = "true" ]; }; then
    [ "${container_running}" = "true" ] \
      || fail "Mongo container '${mongo_container}' is not already running. This tool will not start it."
    { sed -n '1,$p' "${COMMON_SCRIPT}"; sed -n '1,$p' "${scenario_script}"; } | docker exec -i \
      -e "MANUAL_QA_COMMAND=${command}" \
      -e "MANUAL_QA_SCENARIO=${scenario}" \
      -e "MANUAL_QA_DB=${target_db}" \
      -e "MANUAL_QA_DELAY_SECONDS=${delay_seconds}" \
      -e "MANUAL_QA_CREATOR_USER_ID=${MANUAL_QA_CREATOR_USER_ID:-}" \
      -e "MANUAL_QA_INVITEE_USER_ID=${MANUAL_QA_INVITEE_USER_ID:-}" \
      -e "MANUAL_QA_CHAT_TITLE=${MANUAL_QA_CHAT_TITLE:-}" \
      -e "MANUAL_QA_EVENT_ID=${MANUAL_QA_EVENT_ID:-}" \
      -e "MANUAL_QA_CHECKPOINT_ID=${checkpoint_id}" \
      "${mongo_container}" \
      mongosh \
        --quiet \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        "${target_db}" \
        --file /dev/stdin
    return
  fi

  command -v mongosh >/dev/null 2>&1 \
    || fail "No running '${mongo_container}' container and no local mongosh were found. Start neither through this tool."
  { sed -n '1,$p' "${COMMON_SCRIPT}"; sed -n '1,$p' "${scenario_script}"; } | \
    MANUAL_QA_COMMAND="${command}" \
    MANUAL_QA_SCENARIO="${scenario}" \
    MANUAL_QA_DB="${target_db}" \
    MANUAL_QA_DELAY_SECONDS="${delay_seconds}" \
    MANUAL_QA_CREATOR_USER_ID="${MANUAL_QA_CREATOR_USER_ID:-}" \
    MANUAL_QA_INVITEE_USER_ID="${MANUAL_QA_INVITEE_USER_ID:-}" \
    MANUAL_QA_CHAT_TITLE="${MANUAL_QA_CHAT_TITLE:-}" \
    MANUAL_QA_EVENT_ID="${MANUAL_QA_EVENT_ID:-}" \
    MANUAL_QA_CHECKPOINT_ID="${checkpoint_id}" \
    mongosh \
      --quiet \
      --host "${mongo_host}" \
      --port "${mongo_port}" \
      --username "${mongo_username}" \
      --password "${mongo_password}" \
      --authenticationDatabase "${target_db}" \
      "${target_db}" \
      --file /dev/stdin
}

[ "$#" -ge 2 ] || { usage >&2; exit 2; }
command="$1"
scenario="$2"

case "${scenario}:${command}" in
  base-stat:stage|base-stat:status|base-stat:reset|\
  stat-010:stage|stat-010:status|stat-010:reset|\
  graph-rating:stage|graph-rating:status|graph-rating:reset|\
  stat-011:stage|stat-011:status|stat-011:reset|\
  stat-020:stage|stat-020:status|stat-020:reset|\
  stat-012:stage|stat-012:hold|stat-012:status|stat-012:reset)
    [ "$#" -eq 2 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}"
    ;;
  stat-020:schedule|stat-012:schedule)
    [ "$#" -le 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" "${3:-30}"
    ;;
  event-domain:stage|event-domain:next|event-domain:status|event-domain:reset|\
  asset-domain:stage|asset-domain:next|asset-domain:status|asset-domain:reset|\
  operator-domain:stage|operator-domain:next|operator-domain:status|operator-domain:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac
