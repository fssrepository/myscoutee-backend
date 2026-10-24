#!/usr/bin/env bash
# Product-owned host checks; common deployment and Mongo checks remain shared.
project_smoke_dependencies() {
  if ! is_truthy "${START_STACK}"; then require_existing_container_running payment-simulator; fi
  wait_for_health payment-simulator healthy
  docker exec payment-simulator /payment-simulator healthcheck >/dev/null
  status_line ok "payment simulator internal health"
}

project_smoke_seeds() {
  require_count "production idea posts seed" "$1" "ideaPosts"
  require_count "demo events seed" "$2" "events"
}

project_smoke_http() {
  check_http_or_internal "landing content query" "/api/landing/content?lang=en" '"ideas"'
  check_http_or_internal "active explanation content" "/api/explanation/active?lang=en&contextKey=home.game" '"documentKind":"explanation"'
}

project_qualification_report() {
  local REGISTRY_STATE_DIR="${MYSCOUTEE_REGISTRY_STATE_DIR:-/var/lib/${RELEASE_PROJECT_NAME}/registry}"
  local REGISTRY_KEY_DIR="${MYSCOUTEE_REGISTRY_KEY_DIR:-/etc/${RELEASE_PROJECT_NAME}/registry}"
  local registry_url state_dir key_dir state_file public_key
  local deployment_id fingerprint

  registry_url="$(read_env_file_value REGISTRY_BASE_URL "${ENV_FILE}" || true)"
  state_dir="$(read_env_file_value REGISTRY_STATE_DIR_HOST "${ENV_FILE}" || true)"
  key_dir="$(read_env_file_value REGISTRY_KEY_DIR_HOST "${ENV_FILE}" || true)"
  state_dir="${state_dir:-${REGISTRY_STATE_DIR}}"
  key_dir="${key_dir:-${REGISTRY_KEY_DIR}}"
  state_file="${state_dir}/deployment-state.json"
  public_key="${key_dir}/deployment-public-key.der"

  deployment_id=""
  if [[ -s "${state_file}" && ! -L "${state_file}" ]]; then
    if command -v jq >/dev/null 2>&1; then
      deployment_id="$(jq -r '.deployment_id // empty' "${state_file}" 2>/dev/null || true)"
    else
      deployment_id="$(
        sed -n 's/.*"deployment_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' \
          "${state_file}" | head -n 1
      )"
    fi
  fi
  if [[ ! "${deployment_id}" =~ ^dep_[0-9a-f]{32}$ ]]; then
    deployment_id=""
  fi

  fingerprint=""
  if command -v openssl >/dev/null 2>&1 \
      && [[ -s "${public_key}" && ! -L "${public_key}" ]]; then
    fingerprint="$(openssl dgst -sha256 -r "${public_key}" | awk '{ print $1 }')"
  fi

  if [[ -n "${deployment_id}" ]]; then
    log "deployment code: ${deployment_id}"
    log "deployment registry: registered at ${registry_url:-configured registry}"
  elif [[ -n "${fingerprint}" ]]; then
    log "node identity is initialized but unregistered"
    log "deployment public-key fingerprint: sha256:${fingerprint}"
  else
    log "node is uninitialized; installation did not select or contact a registry"
  fi
}
