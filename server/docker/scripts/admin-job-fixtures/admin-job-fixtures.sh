#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SCENARIO_DIR="${SCRIPT_DIR}/scenarios"
COMMON_SCRIPT="${SCRIPT_DIR}/lib/common.js"

usage() {
  cat <<'USAGE'
Usage:
  bash admin-job-fixtures.sh list
  bash admin-job-fixtures.sh prepare <job> <variation>
  bash admin-job-fixtures.sh status <job>
  bash admin-job-fixtures.sh trigger <job>
  bash admin-job-fixtures.sh reset <job|all>

This tool accepts only demo_db or e2e_db. It never starts or restarts Mongo or the app.
Set ADMIN_FIXTURE_DB=e2e_db to target e2e_db; demo_db is the default.
USAGE
}

list_jobs() {
  cat <<'JOBS'
event-random-groups
  balanced        6 seeded demo users, 2 rooms of exactly 3
  anchored        same, with one accepted member locked in each room
  five-rooms      15 seeded demo users, 5 rooms of exactly 3
  twenty-rooms    60 generated users, 20 known-affinity rooms of exactly 3
  one-leftover    61 generated users, exact size 3, verifies which user is excluded
  partial-room    62 generated users, room size 2..3, one valid partial room
  quality-200     200 generated users, 40 known-affinity rooms of exactly 5
  quality-1000    1000 generated users, 200 known-affinity rooms of exactly 5
event-auto-inviter
  open-spots      published event with capacity for 2 graph-selected invitations
  full            published event with no open capacity (zero-change control)
event-tournament-review
  ended           active tournament stage whose end time is already past
  future          active first stage waiting for start review
event-counter-expiry
  event           one expired active event source
  ticket-only     one due ticket record that is not an active event
event-checkout-basket-purge
  mixed           one expired and one future checkout draft
  expired         two expired checkout drafts
notification-outbox
  due             due direct notification for a user with no device token
  future          pending notification whose retry time is still in the future
affinity-recompute
  isolated-user   due USER recompute task for an isolated fixture user
scheduled-messages
  inactive-user   due inactivity task that should inactivate its fixture user
  recent-user     due task that should reschedule because the user was active
account-purge
  isolated        expired deleted fixture user
  with-reference  same plus a userRates document that must be cascaded away
bell-rating-feedback
  rating          reopens one seeded pending rating and watches the target bell
  feedback        reopens one seeded feedback submission and watches its targets
JOBS
}

fail() {
  printf 'admin-job-fixtures: %s\n' "$*" >&2
  exit 2
}

is_known_job() {
  case "$1" in
    event-random-groups|event-auto-inviter|event-tournament-review|event-counter-expiry|event-checkout-basket-purge|notification-outbox|affinity-recompute|scheduled-messages|account-purge|bell-rating-feedback)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

run_scenario() {
  local command="$1"
  local job="$2"
  local variation="${3:-}"
  local scenario="${SCENARIO_DIR}/${job}.js"
  local target_db="${ADMIN_FIXTURE_DB:-demo_db}"
  local mongo_mode="${ADMIN_FIXTURE_MONGO_MODE:-auto}"
  local mongo_container="${ADMIN_FIXTURE_MONGO_CONTAINER:-mongodb}"
  local mongo_username="${ADMIN_FIXTURE_MONGO_USERNAME:-${MONGO_APP_USERNAME:-guest}}"
  local mongo_password="${ADMIN_FIXTURE_MONGO_PASSWORD:-${MONGO_APP_PASSWORD:-guest}}"
  local mongo_host="${ADMIN_FIXTURE_MONGO_HOST:-127.0.0.1}"
  local mongo_port="${ADMIN_FIXTURE_MONGO_PORT:-27017}"

  case "${target_db}" in
    demo_db|e2e_db) ;;
    *) fail "ADMIN_FIXTURE_DB must be exactly demo_db or e2e_db (got '${target_db}')." ;;
  esac
  case "${mongo_mode}" in
    auto|container|local) ;;
    *) fail "ADMIN_FIXTURE_MONGO_MODE must be auto, container, or local." ;;
  esac
  [ -f "${COMMON_SCRIPT}" ] || fail "Missing ${COMMON_SCRIPT}."
  [ -f "${scenario}" ] || fail "Missing scenario ${scenario}."

  local container_running="false"
  if command -v docker >/dev/null 2>&1 \
      && docker inspect --format '{{.State.Running}}' "${mongo_container}" >/dev/null 2>&1; then
    container_running="$(docker inspect --format '{{.State.Running}}' "${mongo_container}")"
  fi

  if [ "${mongo_mode}" = "container" ] || { [ "${mongo_mode}" = "auto" ] && [ "${container_running}" = "true" ]; }; then
    [ "${container_running}" = "true" ] \
      || fail "Mongo container '${mongo_container}' is not already running. The fixture tool will not start it."
    {
      sed -n '1,$p' "${COMMON_SCRIPT}"
      printf '\n'
      sed -n '1,$p' "${scenario}"
    } | docker exec -i \
      -e "FIXTURE_COMMAND=${command}" \
      -e "FIXTURE_JOB=${job}" \
      -e "FIXTURE_VARIATION=${variation}" \
      -e "FIXTURE_DB=${target_db}" \
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
  {
    sed -n '1,$p' "${COMMON_SCRIPT}"
    printf '\n'
    sed -n '1,$p' "${scenario}"
  } | FIXTURE_COMMAND="${command}" \
      FIXTURE_JOB="${job}" \
      FIXTURE_VARIATION="${variation}" \
      FIXTURE_DB="${target_db}" \
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

command_name="${1:-}"
case "${command_name}" in
  list)
    [ "$#" -eq 1 ] || fail "'list' takes no additional arguments."
    list_jobs
    ;;
  prepare)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    is_known_job "$2" || fail "Unknown job '$2'. Run 'list' for valid names."
    run_scenario prepare "$2" "$3"
    ;;
  status|trigger)
    [ "$#" -eq 2 ] || { usage >&2; exit 2; }
    is_known_job "$2" || fail "Unknown job '$2'. Run 'list' for valid names."
    run_scenario "${command_name}" "$2"
    ;;
  reset)
    [ "$#" -eq 2 ] || { usage >&2; exit 2; }
    if [ "$2" = "all" ]; then
      for job in \
        event-random-groups \
        event-auto-inviter \
        event-tournament-review \
        event-counter-expiry \
        event-checkout-basket-purge \
        notification-outbox \
        affinity-recompute \
        scheduled-messages \
        account-purge \
        bell-rating-feedback; do
        run_scenario reset "${job}"
      done
      exit 0
    fi
    is_known_job "$2" || fail "Unknown job '$2'. Run 'list' for valid names."
    run_scenario reset "$2"
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac
