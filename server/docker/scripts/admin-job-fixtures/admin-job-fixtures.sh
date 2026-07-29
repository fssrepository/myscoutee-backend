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
  weighted        exact weighted ranking, pending exclusion, and repeated-run no-op
  waitlist-capacity  1 accepted + 1 reserved invite; only the 2 oldest of 4 waitlisted users advance
event-tournament-review
  ended           active tournament stage whose end time is already past
  future          active first stage waiting for start review
  advancement     6 synthetic users, exact Score winners advance into a 2-person final
event-counter-expiry
  event           one expired active event source
  ticket-only     one due ticket record that is not an active event
event-checkout-basket-purge
  mixed           one expired and one future checkout draft
  expired         two expired checkout drafts
notification-outbox
  due             due direct notification for a user with no device token
  future          pending notification whose retry time is still in the future
notification-read-path
  group-chat      real app enqueue plus exact unread/read bell, profile, and group-chat API checks
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
    event-random-groups|event-auto-inviter|event-tournament-review|event-counter-expiry|event-checkout-basket-purge|notification-outbox|notification-read-path|affinity-recompute|scheduled-messages|account-purge|bell-rating-feedback)
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

notification_read_api_root() {
  local api_root="${ADMIN_FIXTURE_API_BASE_URL:-http://localhost/api}"
  api_root="${api_root%/}"
  if [[ ! "${api_root}" =~ ^http://(localhost|127\.0\.0\.1)(:[0-9]{1,5})?(/api)?$ ]]; then
    fail "ADMIN_FIXTURE_API_BASE_URL must be an HTTP loopback API root, for example http://localhost/api."
  fi
  printf '%s' "${api_root}"
}

notification_read_api_headers() {
  if [ "${ADMIN_FIXTURE_DB:-demo_db}" = "demo_db" ]; then
    printf '%s\n' "X-App-Session-Kind: demo"
  fi
}

post_notification_read_message() {
  command -v curl >/dev/null 2>&1 \
    || fail "curl is required to call the already-running local app for notification-read-path."
  command -v jq >/dev/null 2>&1 \
    || fail "jq is required to validate the local app response for notification-read-path."

  local api_root
  api_root="$(notification_read_api_root)"
  local fixture_prefix="admin-job-fixture:v1:notification-read-path"
  local sender_id="${fixture_prefix}:sender"
  local chat_id="${fixture_prefix}:chat"
  local message_text="Admin fixture notification read path"
  local -a headers=()
  local session_header
  session_header="$(notification_read_api_headers)"
  if [ -n "${session_header}" ]; then
    headers+=(-H "${session_header}")
  fi

  local response
  if ! response="$(curl -sS --fail --max-time 15 \
      -X POST \
      "${headers[@]}" \
      -H "Content-Type: application/json" \
      --data "{\"text\":\"${message_text}\"}" \
      "${api_root}/activities/chats/${chat_id}/messages?userId=${sender_id}")"; then
    fail "the local app did not accept the fixture chat message; the snapshot was kept, so run reset notification-read-path."
  fi
  if ! jq -e \
      --arg sender "${sender_id}" \
      --arg text "${message_text}" \
      '(.id | type == "string" and length > 0)
        and .senderId == $sender
        and .text == $text' \
      >/dev/null <<<"${response}"; then
    printf '%s\n' "${response}" >&2
    fail "the local app returned an unexpected chat-message response; run reset notification-read-path."
  fi
  jq -n \
    --arg apiRoot "${api_root}" \
    --arg chatId "${chat_id}" \
    --arg senderUserId "${sender_id}" \
    --argjson message "${response}" \
    '{
      notificationReadPathApiAction: {
        apiRoot: $apiRoot,
        chatId: $chatId,
        senderUserId: $senderUserId,
        messageId: $message.id,
        sentAtIso: $message.sentAtIso
      }
    }'
}

verify_notification_read_api() {
  command -v curl >/dev/null 2>&1 \
    || fail "curl is required to query the already-running local app for notification-read-path."
  command -v jq >/dev/null 2>&1 \
    || fail "jq is required to validate the notification read-model response."

  local api_root
  api_root="$(notification_read_api_root)"
  local fixture_prefix="admin-job-fixture:v1:notification-read-path"
  local sender_id="${fixture_prefix}:sender"
  local recipient_id="${fixture_prefix}:recipient"
  local chat_id="${fixture_prefix}:chat"
  local event_id="${fixture_prefix}:event"
  local sub_event_id="${fixture_prefix}:sub-event"
  local group_id="${fixture_prefix}:group"
  local -a headers=()
  local session_header
  session_header="$(notification_read_api_headers)"
  if [ -n "${session_header}" ]; then
    headers+=(-H "${session_header}")
  fi

  local notifications
  local all_notifications
  local chats
  local profile
  if ! notifications="$(curl -sS --fail --max-time 15 \
      "${headers[@]}" \
      "${api_root}/notifications?bucket=new&limit=50&userId=${recipient_id}")"; then
    fail "notification poll failed against the already-running local app."
  fi
  if ! all_notifications="$(curl -sS --fail --max-time 15 \
      "${headers[@]}" \
      "${api_root}/notifications?bucket=all&limit=50&userId=${recipient_id}")"; then
    fail "all-notification poll failed against the already-running local app."
  fi
  if ! chats="$(curl -sS --fail --max-time 15 \
      "${headers[@]}" \
      "${api_root}/activities/chats?userId=${recipient_id}")"; then
    fail "chat read-model query failed against the already-running local app."
  fi
  if ! profile="$(curl -sS --fail --max-time 15 \
      "${headers[@]}" \
      "${api_root}/auth/me?userId=${recipient_id}")"; then
    fail "profile counter read-model query failed against the already-running local app."
  fi

  if ! jq -e \
      --arg recipient "${recipient_id}" \
      --arg sender "${sender_id}" \
      --arg chat "${chat_id}" \
      '([.records[] | select(
          .recipientUserId == $recipient
          and .senderUserId == $sender
          and .kind == "chat-message"
          and .category == "chat"
          and .sourceType == "chat"
          and .sourceId == $chat
          and .actionPath == ("/game?chatId=" + $chat)
          and .payload.chatId == $chat
          and .payload.senderId == $sender
          and (.payload.messageId | type == "string" and length > 0)
        )] | length == 1)
        and .total == 1
        and .muted == false' \
      >/dev/null <<<"${all_notifications}"; then
    printf '%s\n' "${all_notifications}" >&2
    fail "all-notification poll did not expose exactly one expected bell item."
  fi

  local read_at_iso
  local read_state
  local expected_unread_count
  read_at_iso="$(jq -r \
    --arg recipient "${recipient_id}" \
    --arg chat "${chat_id}" \
    '[.records[] | select(.recipientUserId == $recipient and .sourceType == "chat" and .sourceId == $chat) | .readAtIso]
      | first // ""' \
    <<<"${all_notifications}")"
  if [ -n "${read_at_iso}" ] && [ "${read_at_iso}" != "null" ]; then
    read_state="read"
    expected_unread_count=0
    if ! jq -e \
        --arg recipient "${recipient_id}" \
        --arg chat "${chat_id}" \
        '([.records[] | select(
            .recipientUserId == $recipient
            and .sourceType == "chat"
            and .sourceId == $chat
            and (.readAtIso | type == "string" and length > 0)
          )] | length == 0)
          and .total == 0
          and .unreadCount == 0
          and .muted == false' \
        >/dev/null <<<"${notifications}"; then
      printf '%s\n' "${notifications}" >&2
      fail "new-notification poll still exposed the fixture bell after it was marked read."
    fi
    if ! jq -e \
        --arg recipient "${recipient_id}" \
        --arg chat "${chat_id}" \
        '([.records[] | select(
            .recipientUserId == $recipient
            and .sourceType == "chat"
            and .sourceId == $chat
            and (.readAtIso | type == "string" and length > 0)
          )] | length == 1)
          and .unreadCount == 0' \
        >/dev/null <<<"${all_notifications}"; then
      printf '%s\n' "${all_notifications}" >&2
      fail "all-notification context did not expose the exact read row and unreadCount:0."
    fi
  else
    read_state="unread"
    expected_unread_count=1
    if ! jq -e \
        --arg recipient "${recipient_id}" \
        --arg sender "${sender_id}" \
        --arg chat "${chat_id}" \
        '([.records[] | select(
            .recipientUserId == $recipient
            and .senderUserId == $sender
            and .kind == "chat-message"
            and .category == "chat"
            and .sourceType == "chat"
            and .sourceId == $chat
            and .readAtIso == null
            and .actionPath == ("/game?chatId=" + $chat)
            and .payload.chatId == $chat
            and .payload.senderId == $sender
            and (.payload.messageId | type == "string" and length > 0)
          )] | length == 1)
          and .total == 1
          and .unreadCount == 1
          and .muted == false' \
        >/dev/null <<<"${notifications}"; then
      printf '%s\n' "${notifications}" >&2
      fail "new-notification poll did not expose exactly one expected unread bell item."
    fi
  fi

  if ! jq -e \
      --arg chat "${chat_id}" \
      --arg event "${event_id}" \
      --arg subEvent "${sub_event_id}" \
      --arg group "${group_id}" \
      '([.[] | select(
          .id == $chat
          and .unread == 1
          and .channelType == "groupSubEvent"
          and .eventId == $event
          and .subEventId == $subEvent
          and .groupId == $group
          and .navigationContext.eventId == $event
          and .navigationContext.subEvent.id == $subEvent
          and .navigationContext.group.id == $group
        )] | length == 1)' \
      >/dev/null <<<"${chats}"; then
    printf '%s\n' "${chats}" >&2
    fail "chat read model did not expose the expected event/sub-event/group context and unread flag."
  fi
  if ! jq -e \
      --argjson expectedUnreadCount "${expected_unread_count}" \
      '.activities.notifications == $expectedUnreadCount
        and .counterOverrides.notifications == $expectedUnreadCount
        and .activities.chats == 1
        and .counterOverrides.chats == 1
        and .activities.chat.all == 1
        and .activities.chat.group == 1
        and .counterOverrides.chat.all == 1
        and .counterOverrides.chat.group == 1' \
      >/dev/null <<<"${profile}"; then
    printf '%s\n' "${profile}" >&2
    fail "profile read model did not expose the expected notification/chat counters."
  fi

  jq -n \
      --arg apiRoot "${api_root}" \
      --arg recipientUserId "${recipient_id}" \
      --arg chatId "${chat_id}" \
      --arg readState "${read_state}" \
      --arg readAtIso "${read_at_iso}" \
      --argjson notifications "${notifications}" \
      --argjson allNotifications "${all_notifications}" \
      --argjson chats "${chats}" \
      --argjson profile "${profile}" \
      '{
      notificationReadPathApiStatus: {
        pass: true,
        apiRoot: $apiRoot,
        recipientUserId: $recipientUserId,
        readState: $readState,
        readAtIso: (if $readAtIso == "" or $readAtIso == "null" then null else $readAtIso end),
        notification: (
          $allNotifications.records
          | map(select(.sourceType == "chat" and .sourceId == $chatId))
          | first
          | {
              id,
              recipientUserId,
              senderUserId,
              kind,
              category,
              readAtIso,
              actionPath,
              sourceType,
              sourceId,
              payload
            }
        ),
        unreadCount: $allNotifications.unreadCount,
        newBucketTotal: $notifications.total,
        muted: $allNotifications.muted,
        profileCounters: {
          notifications: $profile.counterOverrides.notifications,
          chats: $profile.counterOverrides.chats,
          chat: $profile.counterOverrides.chat
        },
        chat: (
          $chats
          | map(select(.id == $chatId))
          | first
          | {
              id,
              unread,
              channelType,
              eventId,
              subEventId,
              groupId,
              navigationContext
            }
        )
      }
    }'
}

mark_notification_read_api() {
  command -v curl >/dev/null 2>&1 \
    || fail "curl is required to call the already-running local app for notification-read-path."
  command -v jq >/dev/null 2>&1 \
    || fail "jq is required to validate the notification read response."

  local api_root
  api_root="$(notification_read_api_root)"
  local fixture_prefix="admin-job-fixture:v1:notification-read-path"
  local sender_id="${fixture_prefix}:sender"
  local recipient_id="${fixture_prefix}:recipient"
  local chat_id="${fixture_prefix}:chat"
  local -a headers=()
  local session_header
  session_header="$(notification_read_api_headers)"
  if [ -n "${session_header}" ]; then
    headers+=(-H "${session_header}")
  fi

  local before
  if ! before="$(curl -sS --fail --max-time 15 \
      "${headers[@]}" \
      "${api_root}/notifications?bucket=all&limit=50&userId=${recipient_id}")"; then
    fail "could not load the prepared fixture notification before marking it read."
  fi
  local notification_id
  local previous_read_at_iso
  notification_id="$(jq -r \
    --arg recipient "${recipient_id}" \
    --arg chat "${chat_id}" \
    '[.records[] | select(.recipientUserId == $recipient and .sourceType == "chat" and .sourceId == $chat) | .id]
      | if length == 1 then first else "" end' \
    <<<"${before}")"
  previous_read_at_iso="$(jq -r \
    --arg recipient "${recipient_id}" \
    --arg chat "${chat_id}" \
    '[.records[] | select(.recipientUserId == $recipient and .sourceType == "chat" and .sourceId == $chat) | .readAtIso]
      | if length == 1 then (first // "") else "" end' \
    <<<"${before}")"
  [ -n "${notification_id}" ] \
    || fail "expected exactly one prepared fixture bell before calling the read endpoint."

  local response
  if ! response="$(curl -sS --fail --max-time 15 \
      -X POST \
      "${headers[@]}" \
      -H "Content-Type: application/json" \
      --data '{}' \
      "${api_root}/notifications/${notification_id}/read?userId=${recipient_id}")"; then
    fail "notification read endpoint rejected the isolated fixture bell."
  fi
  if ! jq -e \
      --arg id "${notification_id}" \
      --arg recipient "${recipient_id}" \
      --arg sender "${sender_id}" \
      --arg chat "${chat_id}" \
      '.notification.id == $id
        and .notification.recipientUserId == $recipient
        and .notification.senderUserId == $sender
        and .notification.kind == "chat-message"
        and .notification.category == "chat"
        and .notification.sourceType == "chat"
        and .notification.sourceId == $chat
        and .notification.actionPath == ("/game?chatId=" + $chat)
        and .notification.payload.chatId == $chat
        and .notification.payload.senderId == $sender
        and (.notification.payload.messageId | type == "string" and length > 0)
        and (.notification.readAtIso | type == "string" and length > 0)
        and .unreadCount == 0' \
      >/dev/null <<<"${response}"; then
    printf '%s\n' "${response}" >&2
    fail "notification read endpoint returned an unexpected notification or unread count."
  fi
  if [ -n "${previous_read_at_iso}" ] && [ "${previous_read_at_iso}" != "null" ]; then
    if ! jq -e \
        --arg previousReadAtIso "${previous_read_at_iso}" \
        '.notification.readAtIso == $previousReadAtIso' \
        >/dev/null <<<"${response}"; then
      printf '%s\n' "${response}" >&2
      fail "repeated notification read changed the existing readAtIso timestamp."
    fi
  fi

  local response_read_at_iso
  response_read_at_iso="$(jq -r '.notification.readAtIso' <<<"${response}")"
  local verification
  verification="$(verify_notification_read_api)"
  if ! jq -e \
      --arg id "${notification_id}" \
      --arg readAtIso "${response_read_at_iso}" \
      '.notificationReadPathApiStatus.readState == "read"
        and .notificationReadPathApiStatus.notification.id == $id
        and .notificationReadPathApiStatus.readAtIso == $readAtIso
        and .notificationReadPathApiStatus.notification.readAtIso == $readAtIso
        and .notificationReadPathApiStatus.unreadCount == 0
        and .notificationReadPathApiStatus.newBucketTotal == 0' \
      >/dev/null <<<"${verification}"; then
    printf '%s\n' "${verification}" >&2
    fail "notification read response did not match the subsequently persisted read-model state."
  fi

  jq -n \
    --arg apiRoot "${api_root}" \
    --arg notificationId "${notification_id}" \
    --arg previousReadAtIso "${previous_read_at_iso}" \
    --argjson response "${response}" \
    '{
      notificationReadApiAction: {
        pass: true,
        apiRoot: $apiRoot,
        notificationId: $notificationId,
        previousReadAtIso: (
          if $previousReadAtIso == "" or $previousReadAtIso == "null"
          then null
          else $previousReadAtIso
          end
        ),
        readAtIso: $response.notification.readAtIso,
        unreadCount: $response.unreadCount,
        idempotentRepeat: (
          $previousReadAtIso == ""
          or $previousReadAtIso == "null"
          or $response.notification.readAtIso == $previousReadAtIso
        )
      }
    }'
  printf '%s\n' "${verification}"
}

verify_bell_rating_feedback_api() {
  local scenario_status="$1"
  command -v curl >/dev/null 2>&1 \
    || fail "curl is required to validate the rating/feedback bell API projection."
  command -v jq >/dev/null 2>&1 \
    || fail "jq is required to validate the rating/feedback bell API projection."

  local api_root
  api_root="$(notification_read_api_root)"
  local -a headers=()
  local session_header
  session_header="$(notification_read_api_headers)"
  if [ -n "${session_header}" ]; then
    headers+=(-H "${session_header}")
  fi

  local variation
  local actor_id
  local target_count
  variation="$(jq -r '.variation // ""' <<<"${scenario_status}")"
  actor_id="$(jq -r '.current.actor.userId // ""' <<<"${scenario_status}")"
  target_count="$(jq -r '.current.projection | length' <<<"${scenario_status}")"
  [ -n "${actor_id}" ] || fail "rating/feedback status did not expose the fixture actor."
  [ "${target_count}" -gt 0 ] || fail "rating/feedback status did not expose any submitted target projection."

  local expected_kind
  local expected_source_type
  local expected_source_id
  if [ "${variation}" = "rating" ]; then
    expected_kind="user-rated"
    expected_source_type="user-rate"
    expected_source_id="$(jq -r \
      '.current.rate.id
        | if type == "object" and has("$oid") then .["$oid"]
          elif . == null then ""
          else tostring
          end' \
      <<<"${scenario_status}")"
  elif [ "${variation}" = "feedback" ]; then
    expected_kind="event-feedback-submitted"
    expected_source_type="event"
    expected_source_id="$(jq -r '.current.event.eventId // ""' <<<"${scenario_status}")"
  else
    fail "rating/feedback status exposed unsupported variation '${variation}'."
  fi
  [ -n "${expected_source_id}" ] || fail "rating/feedback status did not expose the expected source ID."

  local actor_notifications
  if ! actor_notifications="$(curl -sS --fail --max-time 15 \
      "${headers[@]}" \
      "${api_root}/notifications?bucket=new&limit=50&userId=${actor_id}")"; then
    fail "could not query the rating/feedback actor's bell projection."
  fi
  if ! jq -e \
      --arg actor "${actor_id}" \
      --arg kind "${expected_kind}" \
      --arg sourceType "${expected_source_type}" \
      --arg sourceId "${expected_source_id}" \
      '([.records[] | select(
          .recipientUserId == $actor
          and .kind == $kind
          and .sourceType == $sourceType
          and .sourceId == $sourceId
        )] | length == 0)' \
      >/dev/null <<<"${actor_notifications}"; then
    printf '%s\n' "${actor_notifications}" >&2
    fail "the actor API projection contains the rating/feedback notification intended for the other party."
  fi

  local api_results='[]'
  local index
  for ((index = 0; index < target_count; index += 1)); do
    local target_id
    local expected_unread_count
    local expected_bell
    local bell_id
    target_id="$(jq -r ".current.projection[${index}].userId // \"\"" <<<"${scenario_status}")"
    expected_unread_count="$(jq -r ".current.projection[${index}].unreadCount // -1" <<<"${scenario_status}")"
    expected_bell="$(jq -c \
      --arg target "${target_id}" \
      '.current.bells | map(select(.recipientUserId == $target)) | if length == 1 then first else null end' \
      <<<"${scenario_status}")"
    bell_id="$(jq -r '._id["$oid"]? // ._id // .id // ""' <<<"${expected_bell}")"
    [ -n "${target_id}" ] && [ "${expected_unread_count}" -ge 0 ] && [ -n "${bell_id}" ] \
      || fail "rating/feedback status did not expose one exact bell and projection for every target."

    local notifications
    local profile
    if ! notifications="$(curl -sS --fail --max-time 15 \
        "${headers[@]}" \
        "${api_root}/notifications?bucket=new&limit=50&userId=${target_id}")"; then
      fail "could not query target '${target_id}' notification projection."
    fi
    if ! profile="$(curl -sS --fail --max-time 15 \
        "${headers[@]}" \
        "${api_root}/auth/me?userId=${target_id}")"; then
      fail "could not query target '${target_id}' profile counter projection."
    fi
    if ! jq -e \
        --arg id "${bell_id}" \
        --arg target "${target_id}" \
        --arg actor "${actor_id}" \
        --arg kind "${expected_kind}" \
        --arg sourceType "${expected_source_type}" \
        --arg sourceId "${expected_source_id}" \
        --argjson expectedUnreadCount "${expected_unread_count}" \
        --argjson expectedBell "${expected_bell}" \
        '([.records[] | select(
            .id == $id
            and .recipientUserId == $target
            and .senderUserId == $actor
            and .kind == $kind
            and .category == $expectedBell.category
            and .title == $expectedBell.title
            and .message == $expectedBell.message
            and .createdAtIso == $expectedBell.createdDate
            and .sourceType == $sourceType
            and .sourceId == $sourceId
            and .actionPath == $expectedBell.actionPath
            and .readAtIso == null
            and .payload == $expectedBell.payload
          )] | length == 1)
          and .unreadCount == $expectedUnreadCount' \
        >/dev/null <<<"${notifications}"; then
      printf '%s\n' "${notifications}" >&2
      fail "target '${target_id}' API bell did not match the exact persisted rating/feedback notification."
    fi
    if ! jq -e \
        --argjson expectedUnreadCount "${expected_unread_count}" \
        '.activities.notifications == $expectedUnreadCount
          and .counterOverrides.notifications == $expectedUnreadCount' \
        >/dev/null <<<"${profile}"; then
      printf '%s\n' "${profile}" >&2
      fail "target '${target_id}' profile notification projection did not match the unread collection count."
    fi

    api_results="$(jq -c \
      --arg targetUserId "${target_id}" \
      --arg notificationId "${bell_id}" \
      --argjson unreadCount "${expected_unread_count}" \
      '. + [{
        targetUserId: $targetUserId,
        notificationId: $notificationId,
        unreadCount: $unreadCount,
        exactBellDto: true,
        profileProjectionMatches: true
      }]' \
      <<<"${api_results}")"
  done

  jq -n \
    --arg apiRoot "${api_root}" \
    --arg variation "${variation}" \
    --arg actorUserId "${actor_id}" \
    --arg kind "${expected_kind}" \
    --arg sourceType "${expected_source_type}" \
    --arg sourceId "${expected_source_id}" \
    --argjson targets "${api_results}" \
    '{
      bellRatingFeedbackApiStatus: {
        pass: true,
        apiRoot: $apiRoot,
        variation: $variation,
        actorUserId: $actorUserId,
        actorExcluded: true,
        kind: $kind,
        sourceType: $sourceType,
        sourceId: $sourceId,
        targets: $targets
      }
    }'
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
    if [ "$2" = "notification-read-path" ]; then
      post_notification_read_message
    fi
    ;;
  status|trigger)
    [ "$#" -eq 2 ] || { usage >&2; exit 2; }
    is_known_job "$2" || fail "Unknown job '$2'. Run 'list' for valid names."
    if [ "${command_name}" = "status" ] && [ "$2" = "notification-read-path" ]; then
      command -v jq >/dev/null 2>&1 \
        || fail "jq is required to inspect notification-read-path fixture status."
      scenario_status="$(run_scenario "${command_name}" "$2")"
      printf '%s\n' "${scenario_status}"
      if jq -e '.prepared == true' >/dev/null <<<"${scenario_status}"; then
        verify_notification_read_api
      fi
    elif [ "${command_name}" = "trigger" ] && [ "$2" = "notification-read-path" ]; then
      run_scenario "${command_name}" "$2"
      mark_notification_read_api
    elif [ "${command_name}" = "status" ] && [ "$2" = "bell-rating-feedback" ]; then
      command -v jq >/dev/null 2>&1 \
        || fail "jq is required to inspect bell-rating-feedback fixture status."
      scenario_status="$(run_scenario "${command_name}" "$2")"
      printf '%s\n' "${scenario_status}"
      if jq -e \
          '.prepared == true
            and (.current.notificationCheck | type == "string")
            and (.current.notificationCheck | startswith("PASS:"))' \
          >/dev/null <<<"${scenario_status}"; then
        verify_bell_rating_feedback_api "${scenario_status}"
      fi
    else
      run_scenario "${command_name}" "$2"
    fi
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
        notification-read-path \
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
