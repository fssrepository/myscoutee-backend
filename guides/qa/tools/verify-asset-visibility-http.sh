#!/usr/bin/env bash

set -euo pipefail

API_BASE_URL="${QA_API_BASE_URL:-http://localhost/api}"
PREFIX="manual-qa-checkpoint:v1:asset-domain:asset:visibility:"
OWNER_USER_ID="650000000000000000000061"
FRIEND_USER_ID="178e8d0cbe164fa3fede5884"
UNRELATED_USER_ID="2d520f3c98b0440c1556f4af"
PUBLIC_ASSET_ID="${PREFIX}public"
FRIENDS_ASSET_ID="${PREFIX}friends"
INVITATION_ASSET_ID="${PREFIX}invitation"

command -v curl >/dev/null 2>&1 || { printf '%s\n' "curl is required." >&2; exit 2; }
command -v jq >/dev/null 2>&1 || { printf '%s\n' "jq is required." >&2; exit 2; }

api_get() {
  local user_id="$1"
  local route="$2"
  curl --silent --show-error --fail-with-body \
    -H 'X-App-Session-Kind: demo' \
    -H "X-Demo-User-Id: ${user_id}" \
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
  curl --silent --show-error \
    -H 'X-App-Session-Kind: demo' \
    -H "X-Demo-User-Id: ${user_id}" \
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
PUBLIC_IDS="$(jq -cn --arg public "${PUBLIC_ASSET_ID}" '[$public]')"
EMPTY_IDS='[]'

assert_identity "Casey" "${OWNER_USER_ID}"
assert_identity "Lina" "${FRIEND_USER_ID}"
assert_identity "Liam" "${UNRELATED_USER_ID}"

assert_target_set "Casey" "${OWNER_USER_ID}" owned "${OWNER_IDS}"
assert_target_set "Casey" "${OWNER_USER_ID}" explore "${EMPTY_IDS}"
assert_target_set "Lina" "${FRIEND_USER_ID}" owned "${EMPTY_IDS}"
assert_target_set "Lina" "${FRIEND_USER_ID}" explore "${FRIEND_IDS}"
assert_target_set "Liam" "${UNRELATED_USER_ID}" owned "${EMPTY_IDS}"
assert_target_set "Liam" "${UNRELATED_USER_ID}" explore "${PUBLIC_IDS}"

assert_detail_allowed "Casey" "${OWNER_USER_ID}" "${PUBLIC_ASSET_ID}"
assert_detail_allowed "Casey" "${OWNER_USER_ID}" "${FRIENDS_ASSET_ID}"
assert_detail_allowed "Casey" "${OWNER_USER_ID}" "${INVITATION_ASSET_ID}"
assert_detail_allowed "Lina" "${FRIEND_USER_ID}" "${PUBLIC_ASSET_ID}"
assert_detail_allowed "Lina" "${FRIEND_USER_ID}" "${FRIENDS_ASSET_ID}"
assert_detail_denied "Lina" "${FRIEND_USER_ID}" "${INVITATION_ASSET_ID}"
assert_detail_allowed "Liam" "${UNRELATED_USER_ID}" "${PUBLIC_ASSET_ID}"
assert_detail_denied "Liam" "${UNRELATED_USER_ID}" "${FRIENDS_ASSET_ID}"
assert_detail_denied "Liam" "${UNRELATED_USER_ID}" "${INVITATION_ASSET_ID}"

jq -n \
  --arg checkpointId 'ASSET-VIS-001' \
  --arg apiBaseUrl "${API_BASE_URL}" \
  --argjson ownerOwned "${OWNER_IDS}" \
  --argjson ownerExplore "${EMPTY_IDS}" \
  --argjson friendExplore "${FRIEND_IDS}" \
  --argjson unrelatedExplore "${PUBLIC_IDS}" \
  '{
    checkpointId: $checkpointId,
    phase: "http-visibility-verified",
    apiBaseUrl: $apiBaseUrl,
    identitiesVerified: ["Casey", "Lina", "Liam"],
    targetSets: {
      ownerOwned: $ownerOwned,
      ownerExplore: $ownerExplore,
      friendExplore: $friendExplore,
      unrelatedExplore: $unrelatedExplore
    },
    deniedDetailReads: {
      friendInvitation: true,
      unrelatedFriends: true,
      unrelatedInvitation: true
    }
  }'
