#!/usr/bin/env bash

set -euo pipefail

API_BASE_URL="${QA_API_BASE_URL:-http://localhost/api}"
SESSION_MANIFEST="${QA_BROWSER_SESSION_MANIFEST:-/tmp/myscoutee-qa-browser-sessions/ASSET-VIS-001.json}"
EXPECTED_MODE="${1:-baseline}"
PREFIX="manual-qa-checkpoint:v1:asset-domain:asset:visibility:"
OWNER_USER_ID="650000000000000000000061"
FRIEND_USER_ID="178e8d0cbe164fa3fede5884"
UNRELATED_USER_ID="2d520f3c98b0440c1556f4af"
PUBLIC_ASSET_ID="${PREFIX}public"
FRIENDS_ASSET_ID="${PREFIX}friends"
INVITATION_ASSET_ID="${PREFIX}invitation"

command -v curl >/dev/null 2>&1 || { printf '%s\n' "curl is required." >&2; exit 2; }
command -v jq >/dev/null 2>&1 || { printf '%s\n' "jq is required." >&2; exit 2; }
[ "${EXPECTED_MODE}" = "baseline" ] || [ "${EXPECTED_MODE}" = "edited" ] || {
  printf '%s\n' "Usage: $0 [baseline|edited]" >&2
  exit 2
}
[ -r "${SESSION_MANIFEST}" ] || {
  printf '%s\n' "The managed ASSET-VIS-001 session manifest is not readable: ${SESSION_MANIFEST}" >&2
  exit 2
}

session_id_for() {
  local user_id="$1"
  jq -er --arg user_id "${user_id}" \
    '.sessions[] | select(.userId == $user_id and .sessionKind == "demo") | .sessionId | select(length > 0)' \
    "${SESSION_MANIFEST}"
}

api_get() {
  local user_id="$1"
  local route="$2"
  local session_id
  session_id="$(session_id_for "${user_id}")"
  curl --silent --show-error --fail-with-body \
    -H 'X-App-Session-Kind: demo' \
    -H "X-Demo-User-Id: ${user_id}" \
    -H "X-App-Session-Id: ${session_id}" \
    "${API_BASE_URL}${route}"
}

assert_identity() {
  local actor="$1"
  local user_id="$2"
  local body
  body="$(api_get "${user_id}" "/auth/me?userId=${user_id}")"
  if ! jq -e --arg user_id "${user_id}" '.id == $user_id' >/dev/null <<<"${body}"; then
    printf '%s\n' "${actor}: /auth/me did not resolve ${user_id}." >&2
    exit 1
  fi
}

target_ids() {
  local mode="$1"
  jq -c --arg prefix "${PREFIX}" --arg mode "${mode}" '
    (if $mode == "owned" then . else (.items // []) end)
    | map(select((.id // "") | startswith($prefix)))
    | map(.id)
    | sort
  '
}

assert_target_set() {
  local actor="$1"
  local user_id="$2"
  local source="$3"
  local expected="$4"
  local body actual
  if [ "${source}" = "owned" ]; then
    body="$(api_get "${user_id}" "/assets?userId=${user_id}")"
  else
    body="$(api_get "${user_id}" "/assets/explore?userId=${user_id}&type=Transport&page=0&pageSize=100&order=availability")"
  fi
  actual="$(target_ids "${source}" <<<"${body}")"
  if [ "${actual}" != "${expected}" ]; then
    printf '%s\n' "${actor} ${source}: got ${actual}, expected ${expected}." >&2
    exit 1
  fi
}

detail_response() {
  local user_id="$1"
  local asset_id="$2"
  local session_id
  session_id="$(session_id_for "${user_id}")"
  curl --silent --show-error \
    -H 'X-App-Session-Kind: demo' \
    -H "X-Demo-User-Id: ${user_id}" \
    -H "X-App-Session-Id: ${session_id}" \
    --write-out $'\n%{http_code}' \
    "${API_BASE_URL}/assets/${asset_id}?userId=${user_id}"
}

assert_detail_allowed() {
  local actor="$1"
  local user_id="$2"
  local asset_id="$3"
  local response status body
  response="$(detail_response "${user_id}" "${asset_id}")"
  status="${response##*$'\n'}"
  body="${response%$'\n'*}"
  if [ "${status}" != "200" ] || ! jq -e --arg asset_id "${asset_id}" '.id == $asset_id' >/dev/null <<<"${body}"; then
    printf '%s\n' "${actor}: expected readable detail ${asset_id}, got HTTP ${status}." >&2
    exit 1
  fi
}

assert_detail_denied() {
  local actor="$1"
  local user_id="$2"
  local asset_id="$3"
  local response status body compact
  response="$(detail_response "${user_id}" "${asset_id}")"
  status="${response##*$'\n'}"
  body="${response%$'\n'*}"
  compact="$(tr -d '[:space:]' <<<"${body}")"
  if [ "${status}" = "403" ] || [ "${status}" = "404" ]; then
    return
  fi
  if [ "${status}" = "200" ] && { [ -z "${compact}" ] || [ "${compact}" = "null" ]; }; then
    return
  fi
  printf '%s\n' "${actor}: denied detail ${asset_id} exposed data with HTTP ${status}." >&2
  exit 1
}

OWNER_IDS="$(jq -cn --arg public "${PUBLIC_ASSET_ID}" --arg friends "${FRIENDS_ASSET_ID}" --arg invitation "${INVITATION_ASSET_ID}" '[$public, $friends, $invitation] | sort')"
FRIEND_IDS="$(jq -cn --arg public "${PUBLIC_ASSET_ID}" --arg friends "${FRIENDS_ASSET_ID}" '[$public, $friends] | sort')"
FRIENDS_ONLY_IDS="$(jq -cn --arg friends "${FRIENDS_ASSET_ID}" '[$friends]')"
PUBLIC_IDS="$(jq -cn --arg public "${PUBLIC_ASSET_ID}" '[$public]')"
EMPTY_IDS='[]'

if [ "${EXPECTED_MODE}" = "edited" ]; then
  EXPECTED_FRIEND_EXPLORE="${FRIENDS_ONLY_IDS}"
  EXPECTED_UNRELATED_EXPLORE="${EMPTY_IDS}"
else
  EXPECTED_FRIEND_EXPLORE="${FRIEND_IDS}"
  EXPECTED_UNRELATED_EXPLORE="${PUBLIC_IDS}"
fi

assert_identity "Casey" "${OWNER_USER_ID}"
assert_identity "Lina" "${FRIEND_USER_ID}"
assert_identity "Liam" "${UNRELATED_USER_ID}"

assert_target_set "Casey" "${OWNER_USER_ID}" owned "${OWNER_IDS}"
assert_target_set "Casey" "${OWNER_USER_ID}" explore "${EMPTY_IDS}"
assert_target_set "Lina" "${FRIEND_USER_ID}" owned "${EMPTY_IDS}"
assert_target_set "Lina" "${FRIEND_USER_ID}" explore "${EXPECTED_FRIEND_EXPLORE}"
assert_target_set "Liam" "${UNRELATED_USER_ID}" owned "${EMPTY_IDS}"
assert_target_set "Liam" "${UNRELATED_USER_ID}" explore "${EXPECTED_UNRELATED_EXPLORE}"

assert_detail_allowed "Casey" "${OWNER_USER_ID}" "${PUBLIC_ASSET_ID}"
assert_detail_allowed "Casey" "${OWNER_USER_ID}" "${FRIENDS_ASSET_ID}"
assert_detail_allowed "Casey" "${OWNER_USER_ID}" "${INVITATION_ASSET_ID}"
assert_detail_allowed "Lina" "${FRIEND_USER_ID}" "${FRIENDS_ASSET_ID}"
assert_detail_denied "Lina" "${FRIEND_USER_ID}" "${INVITATION_ASSET_ID}"
assert_detail_denied "Liam" "${UNRELATED_USER_ID}" "${FRIENDS_ASSET_ID}"
assert_detail_denied "Liam" "${UNRELATED_USER_ID}" "${INVITATION_ASSET_ID}"
if [ "${EXPECTED_MODE}" = "edited" ]; then
  assert_detail_denied "Lina" "${FRIEND_USER_ID}" "${PUBLIC_ASSET_ID}"
  assert_detail_denied "Liam" "${UNRELATED_USER_ID}" "${PUBLIC_ASSET_ID}"
else
  assert_detail_allowed "Lina" "${FRIEND_USER_ID}" "${PUBLIC_ASSET_ID}"
  assert_detail_allowed "Liam" "${UNRELATED_USER_ID}" "${PUBLIC_ASSET_ID}"
fi

jq -n \
  --arg checkpointId 'ASSET-VIS-001' \
  --arg apiBaseUrl "${API_BASE_URL}" \
  --arg expectedMode "${EXPECTED_MODE}" \
  --argjson ownerOwned "${OWNER_IDS}" \
  --argjson ownerExplore "${EMPTY_IDS}" \
  --argjson friendExplore "${EXPECTED_FRIEND_EXPLORE}" \
  --argjson unrelatedExplore "${EXPECTED_UNRELATED_EXPLORE}" \
  '{
    checkpointId: $checkpointId,
    phase: ("http-visibility-" + $expectedMode + "-verified"),
    apiBaseUrl: $apiBaseUrl,
    identitiesVerified: ["Casey", "Lina", "Liam"],
    targetSets: {
      ownerOwned: $ownerOwned,
      ownerExplore: $ownerExplore,
      friendExplore: $friendExplore,
      unrelatedExplore: $unrelatedExplore
    },
    deniedDetailReads: (if $expectedMode == "edited" then {
      friendEditedPublic: true,
      friendInvitation: true,
      unrelatedEditedPublic: true,
      unrelatedFriends: true,
      unrelatedInvitation: true
    } else {
      friendInvitation: true,
      unrelatedFriends: true,
      unrelatedInvitation: true
    } end)
  }'
