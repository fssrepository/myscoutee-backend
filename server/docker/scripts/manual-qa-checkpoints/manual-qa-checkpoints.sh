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
  bash manual-qa-checkpoints.sh stage graph-layout
  bash manual-qa-checkpoints.sh schedule graph-layout [delay-seconds]
  bash manual-qa-checkpoints.sh status graph-layout
  bash manual-qa-checkpoints.sh reset graph-layout
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
  bash manual-qa-checkpoints.sh restage event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh switch event-domain <current-checkpoint-id> <next-checkpoint-id>
  bash manual-qa-checkpoints.sh advance event-domain <current-checkpoint-id> <next-checkpoint-id>
  bash manual-qa-checkpoints.sh discard-stale event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh add-feedback-participant event-domain EVENT-FEEDBACK-002
  bash manual-qa-checkpoints.sh prepare-invitation-acceptance-retest event-domain EVENT-INV-003
  bash manual-qa-checkpoints.sh prepare-invitation-admin-approval-retest event-domain EVENT-INV-004
  bash manual-qa-checkpoints.sh hold-auto-inviter event-domain EVENT-EDITOR-003
  bash manual-qa-checkpoints.sh prepare-auto-inviter event-domain EVENT-EDITOR-003
  bash manual-qa-checkpoints.sh capture-auto-inviter-baseline event-domain EVENT-EDITOR-003
  bash manual-qa-checkpoints.sh prepare-periodic-auto-inviter event-domain EVENT-EDITOR-003
  bash manual-qa-checkpoints.sh schedule-auto-inviter event-domain EVENT-EDITOR-003 [delay-seconds]
  bash manual-qa-checkpoints.sh arm-ticket-expiry event-domain EVENT-TICKET-006
  bash manual-qa-checkpoints.sh arm-tournament-review event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh verify-tournament-review-noop event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh prepare-tournament-finalize-notification-retest event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh verify-tournament-finalize-notification event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh prepare-tournament-notification-sequence-retest event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh verify-tournament-finalize-sequence event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh verify-tournament-advancement-sequence event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh verify-tournament-advancement-sequence-noop event-domain TOURNAMENT-003
  bash manual-qa-checkpoints.sh prepare-tournament-final-carry-forward event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh repair-tournament-final-start-window event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh prepare-tournament-final-start-recipient-retest event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh recover-tournament-final-start-recipient-retest-after-seed-reset event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh verify-tournament-final-start event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh prepare-tournament-final-completion-boundary event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh prepare-tournament-final-completion-retest event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh verify-tournament-final-completion event-domain TOURNAMENT-004
  bash manual-qa-checkpoints.sh verify-tournament-room-life-baseline event-domain TOURNAMENT-ROOM-LIFE-001
  bash manual-qa-checkpoints.sh verify-tournament-card-transition event-domain TOURNAMENT-CARD-001
  bash manual-qa-checkpoints.sh repair-ticket-payment-fixture event-domain EVENT-TICKET-007
  bash manual-qa-checkpoints.sh repair-tournament-room-presentation event-domain TOURNAMENT-002
  bash manual-qa-checkpoints.sh repair-tournament-room-notifications event-domain TOURNAMENT-002
  bash manual-qa-checkpoints.sh prepare-ticket-invite-candidate event-domain EVENT-TICKET-007
  bash manual-qa-checkpoints.sh prepare-ticket-invitee-response-retest event-domain EVENT-TICKET-007
  bash manual-qa-checkpoints.sh prepare-ticket-admin-approval-retest event-domain EVENT-TICKET-007
  bash manual-qa-checkpoints.sh prepare-visibility-save-retest event-domain EVENT-VISIBILITY-001
  bash manual-qa-checkpoints.sh prepare-visibility-publish-window event-domain EVENT-VISIBILITY-001
  bash manual-qa-checkpoints.sh verify-ticket-poll-resume event-domain EVENT-TICKET-POLL-001
  bash manual-qa-checkpoints.sh verify-ticket-isolation-unpublish event-domain EVENT-TICKET-008
  bash manual-qa-checkpoints.sh verify-ticket-isolation-republish event-domain EVENT-TICKET-008
  bash manual-qa-checkpoints.sh verify-ticket-attendance-first-scan event-domain EVENT-TICKET-011
  bash manual-qa-checkpoints.sh verify-ticket-attendance-replay event-domain EVENT-TICKET-011
  bash manual-qa-checkpoints.sh repair-lifecycle-counter-baseline event-domain EVENT-LIFE-002
  bash manual-qa-checkpoints.sh repair-lifecycle-occupancy-baseline event-domain EVENT-LIFE-002
  bash manual-qa-checkpoints.sh capture-lifecycle-action-baseline event-domain EVENT-LIFE-002
  bash manual-qa-checkpoints.sh verify-lifecycle-trash event-domain EVENT-LIFE-002
  bash manual-qa-checkpoints.sh capture-lifecycle-restore-baseline event-domain EVENT-LIFE-003
  bash manual-qa-checkpoints.sh verify-lifecycle-restore event-domain EVENT-LIFE-003
  bash manual-qa-checkpoints.sh capture-participant-lifecycle-baseline event-domain EVENT-LIFE-004
  bash manual-qa-checkpoints.sh capture-participant-leave-state event-domain EVENT-LIFE-004
  bash manual-qa-checkpoints.sh verify-participant-restore event-domain EVENT-LIFE-004
  bash manual-qa-checkpoints.sh verify-participant-leave event-domain EVENT-LIFE-004
  bash manual-qa-checkpoints.sh capture-bucket-read-baseline event-domain EVENT-LIFE-005
  bash manual-qa-checkpoints.sh verify-bucket-readonly event-domain EVENT-LIFE-005
  bash manual-qa-checkpoints.sh diagnose-bucket-read-changes event-domain EVENT-LIFE-005
  bash manual-qa-checkpoints.sh capture-invitation-action-baseline event-domain EVENT-INV-001
  bash manual-qa-checkpoints.sh verify-invitation-created event-domain EVENT-INV-001
  bash manual-qa-checkpoints.sh diagnose-invitation-chat-counter event-domain EVENT-INV-001
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
  bash manual-qa-checkpoints.sh stage entry-domain ENTRY-DEMO-REG-001
  bash manual-qa-checkpoints.sh status entry-domain ENTRY-DEMO-REG-001
  bash manual-qa-checkpoints.sh cleanup-demo-control entry-domain LANDING-ELIGIBILITY-001
  bash manual-qa-checkpoints.sh verify entry-domain ENTRY-DEMO-REG-001
  bash manual-qa-checkpoints.sh reset entry-domain ENTRY-DEMO-REG-001
  bash manual-qa-checkpoints.sh stage entry-consent ENTRY-CONSENT-001
  bash manual-qa-checkpoints.sh status entry-consent ENTRY-CONSENT-001
  bash manual-qa-checkpoints.sh verify entry-consent ENTRY-CONSENT-001
  bash manual-qa-checkpoints.sh reset entry-consent ENTRY-CONSENT-001
  bash manual-qa-checkpoints.sh stage entry-consent ENTRY-CONSENT-002
  bash manual-qa-checkpoints.sh status entry-consent ENTRY-CONSENT-002
  bash manual-qa-checkpoints.sh activate-newer entry-consent ENTRY-CONSENT-002
  bash manual-qa-checkpoints.sh verify entry-consent ENTRY-CONSENT-002
  bash manual-qa-checkpoints.sh preview-v5 entry-consent ENTRY-CONSENT-002
  bash manual-qa-checkpoints.sh reset entry-consent ENTRY-CONSENT-002
  bash manual-qa-checkpoints.sh stage entry-consent ENTRY-CONSENT-003
  bash manual-qa-checkpoints.sh status entry-consent ENTRY-CONSENT-003
  bash manual-qa-checkpoints.sh repair-stage entry-consent ENTRY-CONSENT-003
  bash manual-qa-checkpoints.sh verify entry-consent ENTRY-CONSENT-003
  bash manual-qa-checkpoints.sh reset entry-consent ENTRY-CONSENT-003
  bash manual-qa-checkpoints.sh stage auth-session AUTH-SESSION-001
  bash manual-qa-checkpoints.sh status auth-session AUTH-SESSION-001
  bash manual-qa-checkpoints.sh capture-reload auth-session AUTH-SESSION-001
  bash manual-qa-checkpoints.sh arm-blocked-replay auth-session AUTH-SESSION-001
  bash manual-qa-checkpoints.sh reset auth-session AUTH-SESSION-001

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
  MANUAL_QA_EVENT_IMAGE_URL     uploaded EVENT-FEEDBACK fixture image URL
  MANUAL_QA_CHECKPOINT_ID       set internally for checkpoint-runner commands
  MANUAL_QA_SOURCE_CHECKPOINT_ID set internally for event-domain advance
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
  local source_checkpoint_id="${5:-}"
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
    graph-layout) scenario_script="${SCRIPT_DIR}/scenarios/graph-layout.js" ;;
    stat-011) scenario_script="${SCRIPT_DIR}/scenarios/stat-011-chat.js" ;;
    stat-020) scenario_script="${SCRIPT_DIR}/scenarios/stat-020-graph-timeline.js" ;;
    stat-012) scenario_script="${SCRIPT_DIR}/scenarios/stat-012-auto-inviter.js" ;;
    event-domain) scenario_script="${SCRIPT_DIR}/scenarios/event-domain-checkpoints.js" ;;
    asset-domain) scenario_script="${SCRIPT_DIR}/scenarios/asset-domain-checkpoints.js" ;;
    operator-domain) scenario_script="${SCRIPT_DIR}/scenarios/operator-domain-checkpoints.js" ;;
    auth-session) scenario_script="${SCRIPT_DIR}/scenarios/auth-session-checkpoints.js" ;;
    entry-domain) scenario_script="${SCRIPT_DIR}/scenarios/entry-domain-checkpoints.js" ;;
    entry-consent)
      if [ "${checkpoint_id}" = "ENTRY-CONSENT-002" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/entry-consent-revision-checkpoints.js"
      elif [ "${checkpoint_id}" = "ENTRY-CONSENT-003" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/entry-consent-inheritance-checkpoints.js"
      else
        scenario_script="${SCRIPT_DIR}/scenarios/entry-consent-checkpoints.js"
      fi
      ;;
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
  local docker_inspect_error=""
  local docker_inspect_output=""
  if command -v docker >/dev/null 2>&1; then
    if docker_inspect_output="$(docker inspect --format '{{.State.Running}}' "${mongo_container}" 2>&1)"; then
      container_running="${docker_inspect_output}"
    else
      case "${docker_inspect_output}" in
        *"permission denied"*|*"Cannot connect to the Docker daemon"*|*"error during connect"*)
          docker_inspect_error="${docker_inspect_output}"
          ;;
      esac
    fi
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
      -e "MANUAL_QA_EVENT_IMAGE_URL=${MANUAL_QA_EVENT_IMAGE_URL:-}" \
      -e "MANUAL_QA_CHECKPOINT_ID=${checkpoint_id}" \
      -e "MANUAL_QA_SOURCE_CHECKPOINT_ID=${source_checkpoint_id}" \
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

  if [ -n "${docker_inspect_error}" ] && ! command -v mongosh >/dev/null 2>&1; then
    fail "Docker daemon access was denied while resolving the already-running '${mongo_container}' container. Re-run this same harness command with Docker access; do not start another MongoDB, server, watcher or Compose stack. Docker reported: ${docker_inspect_error}"
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
    MANUAL_QA_EVENT_IMAGE_URL="${MANUAL_QA_EVENT_IMAGE_URL:-}" \
    MANUAL_QA_CHECKPOINT_ID="${checkpoint_id}" \
    MANUAL_QA_SOURCE_CHECKPOINT_ID="${source_checkpoint_id}" \
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
  graph-layout:stage|graph-layout:status|graph-layout:reset|\
  stat-011:stage|stat-011:status|stat-011:reset|\
  stat-020:stage|stat-020:status|stat-020:reset|\
  stat-012:stage|stat-012:hold|stat-012:status|stat-012:reset)
    [ "$#" -eq 2 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}"
    ;;
  graph-layout:schedule|stat-020:schedule|stat-012:schedule)
    [ "$#" -le 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" "${3:-30}"
    ;;
  event-domain:prepare-tournament-notification-sequence-retest|\
  event-domain:verify-tournament-finalize-sequence|\
  event-domain:verify-tournament-advancement-sequence|\
  event-domain:verify-tournament-advancement-sequence-noop|\
  event-domain:prepare-tournament-final-carry-forward|\
  event-domain:repair-tournament-final-start-window|\
  event-domain:prepare-tournament-final-start-recipient-retest|\
  event-domain:recover-tournament-final-start-recipient-retest-after-seed-reset|\
  event-domain:verify-tournament-final-start|\
  event-domain:prepare-tournament-final-completion-boundary|\
  event-domain:prepare-tournament-final-completion-retest|\
  event-domain:verify-tournament-final-completion)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:verify-tournament-card-transition)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:stage|event-domain:restage|event-domain:next|event-domain:status|event-domain:reset|event-domain:discard-stale|event-domain:add-feedback-participant|event-domain:hold-auto-inviter|event-domain:prepare-auto-inviter|event-domain:capture-auto-inviter-baseline|event-domain:capture-lifecycle-action-baseline|event-domain:verify-lifecycle-trash|event-domain:capture-lifecycle-restore-baseline|event-domain:verify-lifecycle-restore|event-domain:capture-participant-lifecycle-baseline|event-domain:capture-participant-leave-state|event-domain:verify-participant-restore|event-domain:verify-participant-leave|event-domain:capture-bucket-read-baseline|event-domain:verify-bucket-readonly|event-domain:diagnose-bucket-read-changes|event-domain:capture-invitation-action-baseline|event-domain:verify-invitation-created|event-domain:diagnose-invitation-chat-counter|event-domain:prepare-periodic-auto-inviter|event-domain:prepare-invitation-acceptance-retest|event-domain:prepare-invitation-admin-approval-retest|event-domain:arm-ticket-expiry|event-domain:arm-tournament-review|event-domain:verify-tournament-review-noop|event-domain:prepare-tournament-finalize-notification-retest|event-domain:verify-tournament-finalize-notification|event-domain:verify-tournament-room-life-baseline|event-domain:repair-ticket-payment-fixture|event-domain:repair-tournament-room-presentation|event-domain:repair-tournament-room-notifications|event-domain:repair-lifecycle-counter-baseline|event-domain:repair-lifecycle-occupancy-baseline|event-domain:prepare-ticket-invite-candidate|event-domain:prepare-ticket-invitee-response-retest|event-domain:prepare-ticket-admin-approval-retest|event-domain:prepare-visibility-save-retest|event-domain:prepare-visibility-publish-window|event-domain:verify-ticket-poll-resume|event-domain:verify-ticket-isolation-unpublish|event-domain:verify-ticket-isolation-republish|event-domain:verify-ticket-attendance-first-scan|event-domain:verify-ticket-attendance-replay|\
  asset-domain:stage|asset-domain:next|asset-domain:status|asset-domain:reset|\
  operator-domain:stage|operator-domain:next|operator-domain:status|operator-domain:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  entry-domain:stage|entry-domain:status|entry-domain:cleanup-demo-control|entry-domain:verify|entry-domain:reset|\
  auth-session:stage|auth-session:status|auth-session:capture-reload|auth-session:arm-blocked-replay|auth-session:reset|\
  entry-consent:stage|entry-consent:status|entry-consent:activate-newer|entry-consent:repair-stage|entry-consent:verify|entry-consent:preview-v5|entry-consent:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:advance)
    [ "$#" -eq 4 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$4" "$3"
    ;;
  event-domain:switch)
    [ "$#" -eq 4 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$4" "$3"
    ;;
  event-domain:schedule-auto-inviter)
    [ "$#" -le 4 ] || { usage >&2; exit 2; }
    [ "$#" -ge 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" "${4:-30}" "$3"
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac
