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
  bash manual-qa-checkpoints.sh stage event-schedulers EVENT-SCHEDULERS-001 random-groups
  bash manual-qa-checkpoints.sh stage event-schedulers EVENT-SCHEDULERS-001 counter-expiry
  bash manual-qa-checkpoints.sh stage event-schedulers EVENT-SCHEDULERS-001 basket-purge
  bash manual-qa-checkpoints.sh status event-schedulers EVENT-SCHEDULERS-001
  bash manual-qa-checkpoints.sh schedule event-schedulers EVENT-SCHEDULERS-001 [delay-seconds]
  bash manual-qa-checkpoints.sh reset event-schedulers EVENT-SCHEDULERS-001
  bash manual-qa-checkpoints.sh stage chat-domain CHAT-LIST-001
  bash manual-qa-checkpoints.sh status chat-domain CHAT-LIST-001
  bash manual-qa-checkpoints.sh reset chat-domain CHAT-LIST-001
  bash manual-qa-checkpoints.sh stage role-triad ROLE-TRIAD-CORE-001
  bash manual-qa-checkpoints.sh status role-triad ROLE-TRIAD-CORE-001
  bash manual-qa-checkpoints.sh rearm-feedback-resolution role-triad ROLE-TRIAD-CORE-001
  bash manual-qa-checkpoints.sh reset role-triad ROLE-TRIAD-CORE-001
  bash manual-qa-checkpoints.sh stage event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh restage event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh switch event-domain <current-checkpoint-id> <next-checkpoint-id>
  bash manual-qa-checkpoints.sh advance event-domain <current-checkpoint-id> <next-checkpoint-id>
  bash manual-qa-checkpoints.sh discard-stale event-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh add-feedback-participant event-domain EVENT-FEEDBACK-002
  bash manual-qa-checkpoints.sh capture-runtime-created event-domain EVENT-RUNTIME-001
  bash manual-qa-checkpoints.sh verify-runtime-slot-override event-domain EVENT-RUNTIME-001
  bash manual-qa-checkpoints.sh capture-runtime-post-create event-domain EVENT-RUNTIME-001
  bash manual-qa-checkpoints.sh restore-runtime-post-create event-domain EVENT-RUNTIME-001
  bash manual-qa-checkpoints.sh restage-runtime-post-create event-domain EVENT-RUNTIME-001
  bash manual-qa-checkpoints.sh prepare-runtime-transport event-domain EVENT-RUNTIME-001
  bash manual-qa-checkpoints.sh restage-runtime-member-clean event-domain EVENT-RUNTIME-001
  bash manual-qa-checkpoints.sh repair-runtime-transport-invite-scope event-domain EVENT-RUNTIME-001
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
  bash manual-qa-checkpoints.sh verify-tournament-member-removal event-domain TOURNAMENT-MEMBER-002
  bash manual-qa-checkpoints.sh verify-tournament-member-notification event-domain TOURNAMENT-MEMBER-003
  bash manual-qa-checkpoints.sh verify-tournament-dq event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh verify-tournament-reinstate event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh stage-tournament-dq-review event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh verify-tournament-dq-review-finalize event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh arm-tournament-dq-review event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh verify-tournament-dq-review-result event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh arm-tournament-dq-review-noop event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh verify-tournament-dq-review-noop event-domain TOURNAMENT-DQ-001
  bash manual-qa-checkpoints.sh verify-tournament-resource event-domain TOURNAMENT-RESOURCE-001
  bash manual-qa-checkpoints.sh verify-tournament-card-transition event-domain TOURNAMENT-CARD-001
  bash manual-qa-checkpoints.sh prepare-tournament-admission-invitation event-domain TOURNAMENT-ADMISSION-001
  bash manual-qa-checkpoints.sh prepare-tournament-admission-approval event-domain TOURNAMENT-ADMISSION-001
  bash manual-qa-checkpoints.sh verify-tournament-admission-rejection event-domain TOURNAMENT-ADMISSION-001
  bash manual-qa-checkpoints.sh verify-score-reopen event-domain TOURNAMENT-SCORE-REOPEN-001
  bash manual-qa-checkpoints.sh rearm-score-reopen event-domain TOURNAMENT-SCORE-REOPEN-001
  bash manual-qa-checkpoints.sh verify-score-correction event-domain TOURNAMENT-SCORE-REOPEN-001
  bash manual-qa-checkpoints.sh clean-score-reopen-reminders event-domain TOURNAMENT-SCORE-REOPEN-001
  bash manual-qa-checkpoints.sh arm-score-reopen-review event-domain TOURNAMENT-SCORE-REOPEN-001 [delay-seconds]
  bash manual-qa-checkpoints.sh verify-score-reopen-result event-domain TOURNAMENT-SCORE-REOPEN-001
  bash manual-qa-checkpoints.sh arm-score-reopen-noop event-domain TOURNAMENT-SCORE-REOPEN-001 [delay-seconds]
  bash manual-qa-checkpoints.sh verify-score-reopen-noop event-domain TOURNAMENT-SCORE-REOPEN-001
  bash manual-qa-checkpoints.sh prepare-score-reopen-late-guard event-domain TOURNAMENT-SCORE-REOPEN-002
  bash manual-qa-checkpoints.sh verify-score-reopen-late-guard event-domain TOURNAMENT-SCORE-REOPEN-002
  bash manual-qa-checkpoints.sh repair-tournament-admission-oracle event-domain TOURNAMENT-ADMISSION-001
  bash manual-qa-checkpoints.sh repair-tournament-admission-visibility event-domain TOURNAMENT-ADMISSION-001
  bash manual-qa-checkpoints.sh repair-tournament-admission-invitation-projection event-domain TOURNAMENT-ADMISSION-001
  bash manual-qa-checkpoints.sh repair-tournament-admission-root-projection event-domain TOURNAMENT-ADMISSION-001
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
  bash manual-qa-checkpoints.sh capture-lifecycle-created asset-domain ASSET-LIFE-001
  bash manual-qa-checkpoints.sh verify-lifecycle-edited asset-domain ASSET-LIFE-001
  bash manual-qa-checkpoints.sh verify-lifecycle-deleted asset-domain ASSET-LIFE-001
  bash manual-qa-checkpoints.sh verify-visibility-readonly asset-domain ASSET-VIS-001
  bash manual-qa-checkpoints.sh repair-visibility-fixture asset-domain ASSET-VIS-001
  bash manual-qa-checkpoints.sh verify-visibility-edited asset-domain ASSET-VIS-001
  bash manual-qa-checkpoints.sh verify-borrow-cancel asset-domain ASSET-BORROW-001
  bash manual-qa-checkpoints.sh verify-borrow-reject asset-domain ASSET-BORROW-001
  bash manual-qa-checkpoints.sh verify-borrow-accepted asset-domain ASSET-BORROW-001
  bash manual-qa-checkpoints.sh verify-borrow-terminal asset-domain ASSET-BORROW-001
  bash manual-qa-checkpoints.sh prepare-browser asset-domain ASSET-BORROW-001
  bash manual-qa-checkpoints.sh verify-asset-member-pending asset-domain ASSET-MEMBER-001
  bash manual-qa-checkpoints.sh verify-asset-member-terminal asset-domain ASSET-MEMBER-001
  bash manual-qa-checkpoints.sh refresh-retained-window asset-domain ASSET-MEMBER-001
  bash manual-qa-checkpoints.sh prepare-owner-leave-replay asset-domain ASSET-MEMBER-001
  bash manual-qa-checkpoints.sh rollback-owner-leave asset-domain ASSET-MEMBER-001
  bash manual-qa-checkpoints.sh reset asset-domain <checkpoint-id>
  bash manual-qa-checkpoints.sh stage asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh status asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh repair-normal-supplies-owner asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-normal-assignment asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-supply-contribution-delete asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh restore-normal-assignment-branch asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh repair-tournament-group-ids asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh stage-step-10-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh rollback-step-10-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-group-capacity-edit asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh stage-step-16-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh rollback-step-16-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-group-unassign asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh stage-step-22-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh rollback-step-22-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-group-reassign asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh stage-step-29-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh rollback-step-29-boundary asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-group-manager-removal asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh reset asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
  bash manual-qa-checkpoints.sh stage content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh status content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-drafts-saved content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-privacy-active content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh restage-step-32-boundary content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh rollback-step-32-boundary content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-privacy-fallback content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-article-trashed content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-article-restored content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh rollback-step-59-boundary content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh verify-article-republished content-admin CONTENT-ADMIN-LIFECYCLE-001
  bash manual-qa-checkpoints.sh reset content-admin CONTENT-ADMIN-LIFECYCLE-001
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
  bash manual-qa-checkpoints.sh stage payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh stage-decline payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh status payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh verify-decline payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh verify-stripe payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh verify-barion payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh verify-replace payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh verify-reconnect payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh verify-expired-cleanup payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh verify payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh reset payment-ui PAYMENT-METHODS-HISTORY-001
  bash manual-qa-checkpoints.sh stage event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh status event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh repair-control-fixtures event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh repair-slot-occurrences event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh capture-payment-ready event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-pending-event event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-cancelled event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-block-4 event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-paid event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-destination event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-controls event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh capture-block-7 event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-block-7 event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh clean-final-watchlist-side-effect event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-watchlist event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-block-6 event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-leave-rejoined event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh reset event-checkout EVENT-CHECKOUT-001
  bash manual-qa-checkpoints.sh stage asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh status asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh prepare-browser asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh capture-payment-ready asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh capture-revised-payment-ready asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-revised-payment-ready asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-paid-pending asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-request-destination asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh reset-service-chat-probe asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh repair-step-56-boundary asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh repair-unavailable-control asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-accepted asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh prepare-takeover asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-manager-left asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh repair-manager-left-required-policy asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-manager-left asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-takeover asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh stage-takeover-complete asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-takeover-complete asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh repair-refund-window asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-refund-requested asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-refunded asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh prepare-last-leave asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-last-leave asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh prepare-last-remove asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-last-remove asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify-cancelled asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-cancelled-control asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-payment-ready asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-paid-pending asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh rollback-accepted asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh verify asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh reset asset-checkout ASSET-CHECKOUT-001
  bash manual-qa-checkpoints.sh stage asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh status asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh verify-fixed asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh verify-variable asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh verify-audience asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh verify-active-payment asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh verify-no-policy-payment asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh verify-cutoff-payment asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh verify asset-pricing ASSET-PRICING-001
  bash manual-qa-checkpoints.sh reset asset-pricing ASSET-PRICING-001
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

payment_simulator_state() {
  local base_url="${MANUAL_QA_PAYMENT_SIMULATOR_URL:-http://127.0.0.1:18082}"
  local api_key="${MANUAL_QA_PAYMENT_SIMULATOR_API_KEY:-${PAYMENT_STRIPE_API_KEY:-sk_test_myscoutee}}"
  local response
  response="$(curl --fail --silent --show-error \
    -H "Authorization: Bearer ${api_key}" \
    "${base_url}/myscoutee/v1/configuration")" \
    || fail "The already-running payment simulator configuration is unavailable."
  python3 -c 'import json,sys; value=json.load(sys.stdin); print(value.get("provider", ""), str(bool(value.get("requires3ds"))).lower(), str(bool(value.get("connected"))).lower())' <<<"${response}"
}

replace_payment_simulator_card_fixtures() {
  local base_url="${MANUAL_QA_PAYMENT_SIMULATOR_URL:-http://127.0.0.1:18082}"
  local api_key="${MANUAL_QA_PAYMENT_SIMULATOR_API_KEY:-${PAYMENT_STRIPE_API_KEY:-sk_test_myscoutee}}"
  local target_db="${MANUAL_QA_DB:-demo_db}"
  local fixture_file="${SCRIPT_DIR}/../../conf/mongodb/${target_db}/savedPaymentMethods.json"
  local payload response expected actual
  [ -f "${fixture_file}" ] || fail "Missing payment-card fixture ${fixture_file}."
  payload="$(python3 -c '
import json,sys
cards=json.load(open(sys.argv[1], encoding="utf-8"))
fixtures=[]
for card in cards:
    token=str(card.get("providerPaymentMethodRef", "")).strip()
    if not token:
        raise SystemExit("saved payment-method fixture is missing providerPaymentMethodRef")
    fixtures.append({
        "provider": str(card.get("provider", "")).strip(),
        "provider_token": token,
        "brand": str(card.get("brand", "")).strip(),
        "last4": str(card.get("last4", "")).strip(),
        "expiry_month": card.get("expiryMonth"),
        "expiry_year": card.get("expiryYear"),
        "cardholder_name": str(card.get("cardholderName", "")).strip()
    })
print(json.dumps({"payment_methods": fixtures}, separators=(",", ":")))
' "${fixture_file}")"
  expected="$(python3 -c 'import json,sys; print(len(json.load(sys.stdin)["payment_methods"]))' <<<"${payload}")"
  response="$(curl --fail --silent --show-error -X PUT \
    -H "Authorization: Bearer ${api_key}" \
    -H 'Content-Type: application/json' \
    --data-binary "${payload}" \
    "${base_url}/myscoutee/v1/test-fixtures/payment-methods")" \
    || fail "Could not load the payment-card fixtures into the already-running payment simulator."
  actual="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("payment_methods", -1))' <<<"${response}")"
  [ "${actual}" = "${expected}" ] \
    || fail "Payment simulator loaded ${actual} payment-card fixtures; expected ${expected}."
}

replace_payment_simulator_checkout_card_fixtures() {
  local base_url="${MANUAL_QA_PAYMENT_SIMULATOR_URL:-http://127.0.0.1:18082}"
  local api_key="${MANUAL_QA_PAYMENT_SIMULATOR_API_KEY:-${PAYMENT_STRIPE_API_KEY:-sk_test_myscoutee}}"
  local target_db="${MANUAL_QA_DB:-demo_db}"
  local fixture_file="${SCRIPT_DIR}/../../conf/mongodb/${target_db}/savedPaymentMethods.json"
  local checkout_scope="${1:-event}"
  local payload response expected actual
  [ -f "${fixture_file}" ] || fail "Missing payment-card fixture ${fixture_file}."
  payload="$(python3 -c '
import json,sys
cards=json.load(open(sys.argv[1], encoding="utf-8"))
cards.extend([
  {"provider":"stripe","providerPaymentMethodRef":"pm_sim_checkout_nova_stripe_4242","brand":"Visa","last4":"4242","expiryMonth":12,"expiryYear":2029,"cardholderName":"NOVA SOCIAL"},
  {"provider":"stripe","providerPaymentMethodRef":"pm_sim_checkout_riley_stripe_4242","brand":"Visa","last4":"4242","expiryMonth":12,"expiryYear":2029,"cardholderName":"RILEY OUTSIDE"},
  {"provider":"barion","providerPaymentMethodRef":"pm_sim_checkout_nova_barion_4444","brand":"Mastercard","last4":"4444","expiryMonth":9,"expiryYear":2029,"cardholderName":"NOVA SOCIAL"},
  {"provider":"barion","providerPaymentMethodRef":"pm_sim_checkout_riley_barion_5555","brand":"Mastercard","last4":"5555","expiryMonth":9,"expiryYear":2029,"cardholderName":"RILEY OUTSIDE"},
  {"provider":"stripe","providerPaymentMethodRef":"pm_sim_checkout_nova_expired_0008","brand":"Visa","last4":"0008","expiryMonth":8,"expiryYear":2026,"cardholderName":"NOVA SOCIAL"}
])
if sys.argv[2] == "asset":
    cards.append({"provider":"barion","providerPaymentMethodRef":"pm_sim_asset_checkout_nova_barion_expired_0008","brand":"Mastercard","last4":"0008","expiryMonth":8,"expiryYear":2026,"cardholderName":"NOVA SOCIAL"})
fixtures=[]
for card in cards:
    token=str(card.get("providerPaymentMethodRef", "")).strip()
    if not token:
        raise SystemExit("saved payment-method fixture is missing providerPaymentMethodRef")
    fixtures.append({
        "provider": str(card.get("provider", "")).strip(),
        "provider_token": token,
        "brand": str(card.get("brand", "")).strip(),
        "last4": str(card.get("last4", "")).strip(),
        "expiry_month": card.get("expiryMonth"),
        "expiry_year": card.get("expiryYear"),
        "cardholder_name": str(card.get("cardholderName", "")).strip()
    })
print(json.dumps({"payment_methods": fixtures}, separators=(",", ":")))
' "${fixture_file}" "${checkout_scope}")"
  expected="$(python3 -c 'import json,sys; print(len(json.load(sys.stdin)["payment_methods"]))' <<<"${payload}")"
  response="$(curl --fail --silent --show-error -X PUT \
    -H "Authorization: Bearer ${api_key}" \
    -H 'Content-Type: application/json' \
    --data-binary "${payload}" \
    "${base_url}/myscoutee/v1/test-fixtures/payment-methods")" \
    || fail "Could not load the checkout payment-card fixtures into the already-running payment simulator."
  actual="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("payment_methods", -1))' <<<"${response}")"
  [ "${actual}" = "${expected}" ] \
    || fail "Payment simulator loaded ${actual} checkout card fixtures; expected ${expected}."
}

restore_payment_simulator_captured_barion_fixture() {
  local payment_id="$1"
  local base_url="${MANUAL_QA_PAYMENT_SIMULATOR_URL:-http://127.0.0.1:18082}"
  local api_key="${MANUAL_QA_PAYMENT_SIMULATOR_API_KEY:-${PAYMENT_STRIPE_API_KEY:-sk_test_myscoutee}}"
  local response status
  response="$(curl --fail --silent --show-error -X PUT \
    -H "Authorization: Bearer ${api_key}" \
    "${base_url}/myscoutee/v1/test-fixtures/barion-payments/${payment_id}/captured")" \
    || fail "Could not restore the captured Barion payment fixture."
  status="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("status", ""))' <<<"${response}")"
  [ "${status}" = "Succeeded" ] \
    || fail "Payment simulator did not restore the captured Barion payment fixture."
}

set_payment_simulator_provider() {
  local target_provider="$1"
  local provider_label="$2"
  local requires_3ds="${3:-false}"
  local base_url="${MANUAL_QA_PAYMENT_SIMULATOR_URL:-http://127.0.0.1:18082}"
  local api_key="${MANUAL_QA_PAYMENT_SIMULATOR_API_KEY:-${PAYMENT_STRIPE_API_KEY:-sk_test_myscoutee}}"
  local temp_dir access_response access_url session_url result provider configured_3ds
  temp_dir="$(mktemp -d)"
  access_response="$(curl --fail --silent --show-error -X POST \
    -H "Authorization: Bearer ${api_key}" \
    "${base_url}/myscoutee/v1/configuration-access")" \
    || { rm -r -- "${temp_dir}"; fail "Could not create a payment simulator configuration session."; }
  access_url="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("url", ""))' <<<"${access_response}")"
  [ -n "${access_url}" ] \
    || { rm -r -- "${temp_dir}"; fail "Payment simulator returned no configuration URL."; }
  session_url="$(python3 -c 'import sys,urllib.parse; value=urllib.parse.urlsplit(sys.argv[1]); print(urllib.parse.urlunsplit((value.scheme, value.netloc, "/configuration-session", "", "")))' "${access_url}")"
  [ -n "${session_url}" ] \
    || { rm -r -- "${temp_dir}"; fail "Payment simulator returned an invalid configuration URL."; }
  curl --fail --silent --show-error --location \
    --cookie-jar "${temp_dir}/cookies" \
    --output /dev/null \
    "${access_url}" \
    || { rm -r -- "${temp_dir}"; fail "Could not exchange the payment simulator configuration ticket."; }
  result="$(curl --fail --silent --show-error -X PUT \
    --cookie "${temp_dir}/cookies" \
    -H 'Content-Type: application/json' \
    --data "{\"provider\":\"${target_provider}\",\"requires3ds\":${requires_3ds}}" \
    "${session_url}")" \
    || { rm -r -- "${temp_dir}"; fail "Could not restore ${provider_label} in the payment simulator."; }
  rm -r -- "${temp_dir}"
  provider="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("provider", ""))' <<<"${result}")"
  configured_3ds="$(python3 -c 'import json,sys; print(str(bool(json.load(sys.stdin).get("requires3ds"))).lower())' <<<"${result}")"
  [ "${provider}" = "${target_provider}" ] || fail "Payment simulator did not restore ${provider_label}."
  [ "${configured_3ds}" = "${requires_3ds}" ] || fail "Payment simulator did not restore ${provider_label}'s 3DS state."
}

set_payment_simulator_cash_only() {
  set_payment_simulator_provider "none" "Cash only"
}

set_payment_simulator_stripe() {
  set_payment_simulator_provider "stripe" "Stripe with 3DS Off"
}

set_payment_simulator_barion() {
  set_payment_simulator_provider "barion" "Barion with 3DS Off"
}

set_payment_simulator_barion_3ds() {
  set_payment_simulator_provider "barion" "Barion with 3DS On" "true"
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
  local payment_provider=""
  local payment_requires_3ds="false"
  local payment_provider_connected="false"

  case "${scenario}" in
    base-stat) scenario_script="${SCRIPT_DIR}/scenarios/base-stat.js" ;;
    stat-010) scenario_script="${SCRIPT_DIR}/scenarios/stat-010-rating.js" ;;
    graph-rating) scenario_script="${SCRIPT_DIR}/scenarios/graph-rating.js" ;;
    graph-layout) scenario_script="${SCRIPT_DIR}/scenarios/graph-layout.js" ;;
    stat-011) scenario_script="${SCRIPT_DIR}/scenarios/stat-011-chat.js" ;;
    stat-020) scenario_script="${SCRIPT_DIR}/scenarios/stat-020-graph-timeline.js" ;;
    stat-012) scenario_script="${SCRIPT_DIR}/scenarios/stat-012-auto-inviter.js" ;;
    event-schedulers) scenario_script="${SCRIPT_DIR}/scenarios/event-schedulers.js" ;;
    role-triad) scenario_script="${SCRIPT_DIR}/scenarios/role-triad-checkpoints.js" ;;
    chat-domain)
      if [ "${checkpoint_id}" = "CHAT-GOVERNANCE-001" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/chat-governance-checkpoints.js"
      else
        scenario_script="${SCRIPT_DIR}/scenarios/chat-domain-checkpoints.js"
      fi
      ;;
    event-domain)
      if [ "${checkpoint_id}" = "TOURNAMENT-ADMISSION-001" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/tournament-admission-checkpoints.js"
      elif [ "${checkpoint_id}" = "TOURNAMENT-MEMBER-003" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/tournament-member-notification-checkpoints.js"
      elif [ "${checkpoint_id}" = "TOURNAMENT-DQ-001" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/tournament-dq-checkpoints.js"
      elif [ "${checkpoint_id}" = "TOURNAMENT-RESOURCE-001" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/tournament-resource-checkpoints.js"
      elif [ "${checkpoint_id}" = "TOURNAMENT-SCORE-REOPEN-001" ] || [ "${checkpoint_id}" = "TOURNAMENT-SCORE-REOPEN-002" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/tournament-score-reopen-checkpoints.js"
      else
        scenario_script="${SCRIPT_DIR}/scenarios/event-domain-checkpoints.js"
      fi
      ;;
    asset-domain)
      if [ "${checkpoint_id}" = "ASSET-MEMBER-001" ] || [ "${checkpoint_id}" = "ASSET-MEMBER-002" ]; then
        scenario_script="${SCRIPT_DIR}/scenarios/asset-member-lifecycle-checkpoints.js"
      else
        scenario_script="${SCRIPT_DIR}/scenarios/asset-domain-checkpoints.js"
      fi
      ;;
    asset-assignment) scenario_script="${SCRIPT_DIR}/scenarios/asset-assignment-lifecycle-checkpoints.js" ;;
    content-admin) scenario_script="${SCRIPT_DIR}/scenarios/content-admin-lifecycle-checkpoints.js" ;;
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
    payment-ui) scenario_script="${SCRIPT_DIR}/scenarios/payment-ui-checkpoints.js" ;;
    event-checkout) scenario_script="${SCRIPT_DIR}/scenarios/event-checkout-checkpoints.js" ;;
    asset-checkout) scenario_script="${SCRIPT_DIR}/scenarios/asset-checkout-checkpoints.js" ;;
    asset-pricing) scenario_script="${SCRIPT_DIR}/scenarios/asset-pricing-checkpoints.js" ;;
    *) fail "Unknown manual scenario '${scenario}'." ;;
  esac

  if [ "${scenario}" = "payment-ui" ] || [ "${scenario}" = "event-checkout" ] || [ "${scenario}" = "asset-checkout" ] || [ "${scenario}" = "asset-pricing" ]; then
    read -r payment_provider payment_requires_3ds payment_provider_connected < <(payment_simulator_state)
  fi

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
      -e "MANUAL_QA_PAYMENT_PROVIDER=${payment_provider}" \
      -e "MANUAL_QA_PAYMENT_REQUIRES_3DS=${payment_requires_3ds}" \
      -e "MANUAL_QA_PAYMENT_PROVIDER_CONNECTED=${payment_provider_connected}" \
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
    MANUAL_QA_PAYMENT_PROVIDER="${payment_provider}" \
    MANUAL_QA_PAYMENT_REQUIRES_3DS="${payment_requires_3ds}" \
    MANUAL_QA_PAYMENT_PROVIDER_CONNECTED="${payment_provider_connected}" \
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
  chat-domain:stage|chat-domain:status|chat-domain:reset|chat-domain:prepare-actions-read-race-retest|chat-domain:repair-content-share-sources)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "CHAT-LIST-001" ] || [ "$3" = "CHAT-FLOW-001" ] || [ "$3" = "CHAT-ACTIONS-001" ] || [ "$3" = "CHAT-CONTENT-001" ] || [ "$3" = "CHAT-GOVERNANCE-001" ] || fail "${command} is restricted to CHAT-LIST-001, CHAT-FLOW-001, CHAT-ACTIONS-001, CHAT-CONTENT-001 or CHAT-GOVERNANCE-001."
    if [ "${command}" = "prepare-actions-read-race-retest" ] && [ "$3" != "CHAT-ACTIONS-001" ]; then
      fail "${command} is restricted to CHAT-ACTIONS-001."
    fi
    if [ "${command}" = "repair-content-share-sources" ] && [ "$3" != "CHAT-CONTENT-001" ]; then
      fail "${command} is restricted to CHAT-CONTENT-001."
    fi
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  graph-layout:schedule|stat-020:schedule|stat-012:schedule)
    [ "$#" -le 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" "${3:-30}"
    ;;
  event-schedulers:stage)
    [ "$#" -eq 4 ] || { usage >&2; exit 2; }
    [ "$3" = "EVENT-SCHEDULERS-001" ] || fail "${command} is restricted to EVENT-SCHEDULERS-001."
    run_scenario "${command}" "${scenario}" 30 "$3" "$4"
    ;;
  event-schedulers:status|event-schedulers:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "EVENT-SCHEDULERS-001" ] || fail "${command} is restricted to EVENT-SCHEDULERS-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-schedulers:schedule)
    [ "$#" -ge 3 ] && [ "$#" -le 4 ] || { usage >&2; exit 2; }
    [ "$3" = "EVENT-SCHEDULERS-001" ] || fail "${command} is restricted to EVENT-SCHEDULERS-001."
    run_scenario "${command}" "${scenario}" "${4:-30}" "$3"
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
  event-domain:capture-runtime-created|event-domain:verify-runtime-slot-override|event-domain:capture-runtime-post-create|event-domain:restore-runtime-post-create|event-domain:restage-runtime-post-create|event-domain:restage-runtime-member-clean)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "EVENT-RUNTIME-001" ] || fail "${command} is restricted to EVENT-RUNTIME-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:verify-tournament-card-transition)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:prepare-tournament-admission-invitation|\
  event-domain:prepare-tournament-admission-approval|\
  event-domain:verify-tournament-admission-rejection|\
  event-domain:repair-tournament-admission-oracle|\
  event-domain:repair-tournament-admission-visibility|\
  event-domain:repair-tournament-admission-invitation-projection|\
  event-domain:repair-tournament-admission-root-projection)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-ADMISSION-001" ] || fail "${command} is restricted to TOURNAMENT-ADMISSION-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:verify-tournament-member-removal)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-MEMBER-002" ] || fail "${command} is restricted to TOURNAMENT-MEMBER-002."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:verify-tournament-member-notification)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-MEMBER-003" ] || fail "${command} is restricted to TOURNAMENT-MEMBER-003."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:verify-tournament-dq|\
  event-domain:verify-tournament-reinstate|\
  event-domain:stage-tournament-dq-review|\
  event-domain:verify-tournament-dq-review-finalize|\
  event-domain:arm-tournament-dq-review|\
  event-domain:verify-tournament-dq-review-result|\
  event-domain:arm-tournament-dq-review-noop|\
  event-domain:verify-tournament-dq-review-noop)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-DQ-001" ] || fail "${command} is restricted to TOURNAMENT-DQ-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:verify-tournament-resource)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-RESOURCE-001" ] || fail "${command} is restricted to TOURNAMENT-RESOURCE-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:rearm-score-reopen|\
  event-domain:verify-score-reopen|\
  event-domain:verify-score-correction|\
  event-domain:clean-score-reopen-reminders|\
  event-domain:verify-score-reopen-result|\
  event-domain:verify-score-reopen-noop)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-SCORE-REOPEN-001" ] || fail "${command} is restricted to TOURNAMENT-SCORE-REOPEN-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:arm-score-reopen-review|event-domain:arm-score-reopen-noop)
    [ "$#" -ge 3 ] && [ "$#" -le 4 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-SCORE-REOPEN-001" ] || fail "${command} is restricted to TOURNAMENT-SCORE-REOPEN-001."
    run_scenario "${command}" "${scenario}" "${4:-15}" "$3"
    ;;
  event-domain:prepare-score-reopen-late-guard|event-domain:verify-score-reopen-late-guard)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "TOURNAMENT-SCORE-REOPEN-002" ] || fail "${command} is restricted to TOURNAMENT-SCORE-REOPEN-002."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  event-domain:stage|event-domain:restage|event-domain:next|event-domain:status|event-domain:reset|event-domain:discard-stale|event-domain:add-feedback-participant|event-domain:prepare-runtime-transport|event-domain:repair-runtime-transport-invite-scope|event-domain:hold-auto-inviter|event-domain:prepare-auto-inviter|event-domain:capture-auto-inviter-baseline|event-domain:capture-lifecycle-action-baseline|event-domain:verify-lifecycle-trash|event-domain:capture-lifecycle-restore-baseline|event-domain:verify-lifecycle-restore|event-domain:capture-participant-lifecycle-baseline|event-domain:capture-participant-leave-state|event-domain:verify-participant-restore|event-domain:verify-participant-leave|event-domain:capture-bucket-read-baseline|event-domain:verify-bucket-readonly|event-domain:diagnose-bucket-read-changes|event-domain:capture-invitation-action-baseline|event-domain:verify-invitation-created|event-domain:diagnose-invitation-chat-counter|event-domain:prepare-periodic-auto-inviter|event-domain:prepare-invitation-acceptance-retest|event-domain:prepare-invitation-admin-approval-retest|event-domain:arm-ticket-expiry|event-domain:arm-tournament-review|event-domain:verify-tournament-review-noop|event-domain:prepare-tournament-finalize-notification-retest|event-domain:verify-tournament-finalize-notification|event-domain:verify-tournament-room-life-baseline|event-domain:repair-ticket-payment-fixture|event-domain:repair-tournament-room-presentation|event-domain:repair-tournament-room-notifications|event-domain:repair-lifecycle-counter-baseline|event-domain:repair-lifecycle-occupancy-baseline|event-domain:prepare-ticket-invite-candidate|event-domain:prepare-ticket-invitee-response-retest|event-domain:prepare-ticket-admin-approval-retest|event-domain:prepare-visibility-save-retest|event-domain:prepare-visibility-publish-window|event-domain:verify-ticket-poll-resume|event-domain:verify-ticket-isolation-unpublish|event-domain:verify-ticket-isolation-republish|event-domain:verify-ticket-attendance-first-scan|event-domain:verify-ticket-attendance-replay|\
  asset-domain:stage|asset-domain:next|asset-domain:status|asset-domain:prepare-browser|asset-domain:capture-lifecycle-created|asset-domain:verify-lifecycle-edited|asset-domain:verify-lifecycle-deleted|asset-domain:verify-visibility-readonly|asset-domain:repair-visibility-fixture|asset-domain:verify-visibility-edited|asset-domain:verify-borrow-cancel|asset-domain:verify-borrow-reject|asset-domain:verify-borrow-accepted|asset-domain:verify-borrow-terminal|asset-domain:verify-asset-member-pending|asset-domain:verify-asset-member-terminal|asset-domain:refresh-retained-window|asset-domain:prepare-owner-leave-replay|asset-domain:rollback-owner-leave|asset-domain:reset|\
  asset-assignment:stage|asset-assignment:status|asset-assignment:repair-normal-supplies-owner|asset-assignment:verify-normal-assignment|asset-assignment:verify-supply-contribution-delete|asset-assignment:restore-normal-assignment-branch|asset-assignment:repair-tournament-group-ids|asset-assignment:stage-step-10-boundary|asset-assignment:rollback-step-10-boundary|asset-assignment:verify-group-capacity-edit|asset-assignment:stage-step-16-boundary|asset-assignment:rollback-step-16-boundary|asset-assignment:verify-group-unassign|asset-assignment:stage-step-22-boundary|asset-assignment:rollback-step-22-boundary|asset-assignment:verify-group-reassign|asset-assignment:stage-step-29-boundary|asset-assignment:rollback-step-29-boundary|asset-assignment:verify-group-manager-removal|asset-assignment:reset|\
  content-admin:stage|content-admin:status|content-admin:verify-drafts-saved|content-admin:verify-privacy-active|content-admin:restage-step-32-boundary|content-admin:rollback-step-32-boundary|content-admin:verify-privacy-fallback|content-admin:verify-article-trashed|content-admin:verify-article-restored|content-admin:rollback-step-59-boundary|content-admin:verify-article-republished|content-admin:reset|\
  operator-domain:stage|operator-domain:next|operator-domain:status|operator-domain:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    if [ "${scenario}" = "asset-assignment" ] && [ "$3" != "ASSET-ASSIGNMENT-LIFECYCLE-001" ]; then
      fail "${command} is restricted to ASSET-ASSIGNMENT-LIFECYCLE-001."
    fi
    if [ "${scenario}" = "content-admin" ] && [ "$3" != "CONTENT-ADMIN-LIFECYCLE-001" ]; then
      fail "${command} is restricted to CONTENT-ADMIN-LIFECYCLE-001."
    fi
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  role-triad:stage|role-triad:status|role-triad:rearm-feedback-resolution|role-triad:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ROLE-TRIAD-CORE-001" ] || fail "${command} is restricted to ROLE-TRIAD-CORE-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  entry-domain:stage|entry-domain:status|entry-domain:cleanup-demo-control|entry-domain:verify|entry-domain:reset|\
  auth-session:stage|auth-session:status|auth-session:capture-reload|auth-session:arm-blocked-replay|auth-session:reset|\
  entry-consent:stage|entry-consent:status|entry-consent:activate-newer|entry-consent:repair-stage|entry-consent:verify|entry-consent:preview-v5|entry-consent:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  payment-ui:stage|payment-ui:stage-decline)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "PAYMENT-METHODS-HISTORY-001" ] || fail "${command} is restricted to PAYMENT-METHODS-HISTORY-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    if [ "${command}" = "stage" ]; then
      replace_payment_simulator_card_fixtures
      set_payment_simulator_cash_only
      run_scenario "status" "${scenario}" 30 "$3"
    fi
    ;;
  payment-ui:status|payment-ui:verify-decline|payment-ui:verify-stripe|payment-ui:verify-barion|payment-ui:verify-replace|payment-ui:verify-reconnect|payment-ui:verify-expired-cleanup|payment-ui:verify)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "PAYMENT-METHODS-HISTORY-001" ] || fail "${command} is restricted to PAYMENT-METHODS-HISTORY-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  payment-ui:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "PAYMENT-METHODS-HISTORY-001" ] || fail "${command} is restricted to PAYMENT-METHODS-HISTORY-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_card_fixtures
    set_payment_simulator_cash_only
    ;;
  event-checkout:stage)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "EVENT-CHECKOUT-001" ] || fail "${command} is restricted to EVENT-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_checkout_card_fixtures
    set_payment_simulator_cash_only
    run_scenario "status" "${scenario}" 30 "$3"
    ;;
  event-checkout:status|event-checkout:repair-card-artwork|event-checkout:repair-control-fixtures|event-checkout:repair-slot-occurrences|event-checkout:capture-payment-ready|event-checkout:verify-pending-event|event-checkout:rollback-payment-ready|event-checkout:verify-cancelled|event-checkout:rollback-block-4|event-checkout:verify-paid|event-checkout:verify-destination|event-checkout:verify-controls|event-checkout:capture-block-7|event-checkout:rollback-block-7|event-checkout:clean-final-watchlist-side-effect|event-checkout:verify-watchlist|event-checkout:rollback-block-6|event-checkout:verify-leave-rejoined|event-checkout:verify)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "EVENT-CHECKOUT-001" ] || fail "${command} is restricted to EVENT-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    if [ "${command}" = "rollback-block-4" ] || [ "${command}" = "rollback-block-6" ]; then
      replace_payment_simulator_checkout_card_fixtures
      set_payment_simulator_stripe
    elif [ "${command}" = "rollback-block-7" ]; then
      set_payment_simulator_cash_only
    fi
    ;;
  event-checkout:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "EVENT-CHECKOUT-001" ] || fail "${command} is restricted to EVENT-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_card_fixtures
    set_payment_simulator_cash_only
    ;;
  asset-checkout:stage)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_checkout_card_fixtures asset
    set_payment_simulator_barion
    run_scenario "status" "${scenario}" 30 "$3"
    ;;
  asset-checkout:status|asset-checkout:prepare-browser|asset-checkout:capture-payment-ready|asset-checkout:capture-revised-payment-ready|asset-checkout:verify-paid-pending|asset-checkout:verify-request-destination|asset-checkout:reset-service-chat-probe|asset-checkout:repair-step-56-boundary|asset-checkout:repair-unavailable-control|asset-checkout:verify-accepted|asset-checkout:prepare-takeover|asset-checkout:verify-manager-left|asset-checkout:repair-manager-left-required-policy|asset-checkout:verify-takeover|asset-checkout:stage-takeover-complete|asset-checkout:repair-refund-window|asset-checkout:verify-refund-requested|asset-checkout:verify-refunded|asset-checkout:prepare-last-leave|asset-checkout:verify-last-leave|asset-checkout:prepare-last-remove|asset-checkout:verify-last-remove|asset-checkout:verify-cancelled|asset-checkout:verify)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  asset-checkout:rollback-payment-ready)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_checkout_card_fixtures asset
    set_payment_simulator_barion
    ;;
  asset-checkout:rollback-manager-left)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    rollback_output="$(run_scenario "${command}" "${scenario}" 30 "$3")"
    printf '%s\n' "${rollback_output}"
    captured_payment_id="$(python3 -c 'import re,sys; values=re.findall(r"[\"'"'"']capturedBarionPaymentId[\"'"'"']\s*:\s*[\"'"'"']([^\"'"'"']+)", sys.stdin.read()); print(values[-1] if values else "")' <<<"${rollback_output}")"
    [ -n "${captured_payment_id}" ] || fail "Rollback returned no captured Barion payment ID."
    restore_payment_simulator_captured_barion_fixture "${captured_payment_id}"
    replace_payment_simulator_checkout_card_fixtures asset
    set_payment_simulator_barion_3ds
    ;;
  asset-checkout:rollback-takeover-complete)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    rollback_output="$(run_scenario "${command}" "${scenario}" 30 "$3")"
    printf '%s\n' "${rollback_output}"
    captured_payment_id="$(python3 -c 'import re,sys; values=re.findall(r"[\"'"'"']capturedBarionPaymentId[\"'"'"']\s*:\s*[\"'"'"']([^\"'"'"']+)", sys.stdin.read()); print(values[-1] if values else "")' <<<"${rollback_output}")"
    [ -n "${captured_payment_id}" ] || fail "Rollback returned no captured Riley Barion payment ID."
    restore_payment_simulator_captured_barion_fixture "${captured_payment_id}"
    replace_payment_simulator_checkout_card_fixtures asset
    set_payment_simulator_barion_3ds
    ;;
  asset-checkout:rollback-accepted)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    rollback_output="$(run_scenario "${command}" "${scenario}" 30 "$3")"
    printf '%s\n' "${rollback_output}"
    captured_payment_id="$(python3 -c 'import re,sys; values=re.findall(r"[\"'"'"']capturedBarionPaymentId[\"'"'"']\s*:\s*[\"'"'"']([^\"'"'"']+)", sys.stdin.read()); print(values[-1] if values else "")' <<<"${rollback_output}")"
    [ -n "${captured_payment_id}" ] || fail "Rollback returned no captured Nova Barion payment ID."
    restore_payment_simulator_captured_barion_fixture "${captured_payment_id}"
    replace_payment_simulator_checkout_card_fixtures asset
    set_payment_simulator_barion_3ds
    ;;
  asset-checkout:rollback-revised-payment-ready|asset-checkout:rollback-paid-pending|asset-checkout:rollback-cancelled-control)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_checkout_card_fixtures asset
    set_payment_simulator_barion_3ds
    ;;
  asset-checkout:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-CHECKOUT-001" ] || fail "${command} is restricted to ASSET-CHECKOUT-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_card_fixtures
    set_payment_simulator_cash_only
    ;;
  asset-pricing:stage)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-PRICING-001" ] || fail "${command} is restricted to ASSET-PRICING-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_checkout_card_fixtures asset
    set_payment_simulator_barion
    run_scenario "status" "${scenario}" 30 "$3"
    ;;
  asset-pricing:status|asset-pricing:verify-fixed|asset-pricing:verify-variable|asset-pricing:verify-audience|asset-pricing:verify-active-payment|asset-pricing:verify-no-policy-payment|asset-pricing:verify-cutoff-payment|asset-pricing:verify)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-PRICING-001" ] || fail "${command} is restricted to ASSET-PRICING-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    ;;
  asset-pricing:reset)
    [ "$#" -eq 3 ] || { usage >&2; exit 2; }
    [ "$3" = "ASSET-PRICING-001" ] || fail "${command} is restricted to ASSET-PRICING-001."
    run_scenario "${command}" "${scenario}" 30 "$3"
    replace_payment_simulator_card_fixtures
    set_payment_simulator_cash_only
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
