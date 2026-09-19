#!/usr/bin/env bash
set -uo pipefail

seed_root="${MONGODB_SEED_ROOT:-/docker-entrypoint-initdb.d}"
seed_directory_name="${MONGO_SEED_DIRECTORY:-demo_db}"
watch_root="${seed_root}/${seed_directory_name}"
target_database="${MONGO_APP_DATABASE:-${MONGO_DEMO_DATABASE:-demo_db}}"
auth_database="${MONGO_AUTH_DATABASE:-${target_database}}"
mongo_host="${MONGO_IMPORT_HOST:-mongodb}"
mongo_port="${MONGO_IMPORT_PORT:-27017}"
mongo_username="${MONGO_IMPORT_USERNAME:-${MONGO_APP_USERNAME:-guest}}"
mongo_password="${MONGO_IMPORT_PASSWORD:-${MONGO_APP_PASSWORD:-guest}}"
mongo_import_script="${MONGO_IMPORT_SCRIPT:-${seed_root}/mongo_import.sh}"
debounce_seconds="${MONGODB_SEED_SYNC_DEBOUNCE_SECONDS:-1}"
reconcile_seconds="${MONGODB_SEED_SYNC_RECONCILE_SECONDS:-2}"
max_reconcile_passes="${MONGODB_SEED_SYNC_MAX_RECONCILE_PASSES:-0}"
state_directory="${MONGODB_SEED_SYNC_STATE_DIRECTORY:-/tmp/mongodb-seed-sync-state}"

log() {
  printf '[mongodb-seed-sync] %s\n' "$*"
}

fail() {
  printf '[mongodb-seed-sync] ERROR: %s\n' "$*" >&2
  exit 1
}

is_non_negative_integer() {
  [[ "$1" =~ ^[0-9]+$ ]]
}

is_positive_integer() {
  [[ "$1" =~ ^[1-9][0-9]*$ ]]
}

is_positive_number() {
  [[ "$1" =~ ^[0-9]+([.][0-9]+)?$ ]] && [[ "$1" != "0" ]] && [[ "$1" != "0.0" ]]
}

file_fingerprint() {
  local file="$1"
  stat -c '%s:%y' "${file}" 2>/dev/null
}

file_state_path() {
  local file="$1"
  local key
  key="$(printf '%s' "${file}" | sha256sum | awk '{print $1}')"
  printf '%s/%s' "${state_directory}" "${key}"
}

record_file_fingerprint() {
  local file="$1"
  local fingerprint="$2"
  printf '%s\n' "${fingerprint}" > "$(file_state_path "${file}")"
}

recorded_file_fingerprint() {
  local state_file
  state_file="$(file_state_path "$1")"
  if [[ -f "${state_file}" ]]; then
    cat "${state_file}"
  fi
}

seed_files() {
  find "${watch_root}" -maxdepth 1 \( -type f -o -type l \) -name '*.json' \
    ! -name 'i18n_bundles.json' -print0 | sort -z
  # Publish the i18n version only after every changed message document has
  # been imported. Otherwise the API may cache a new version while the
  # replacement i18n_messages collection is still empty or incomplete.
  find "${watch_root}" -maxdepth 1 \( -type f -o -type l \) -name 'i18n_bundles.json' -print0 \
    | sort -z
}

wait_until_file_stable() {
  local file="$1"
  local previous=""
  local current=""
  while [[ -f "${file}" ]]; do
    previous="$(file_fingerprint "${file}")"
    sleep "${debounce_seconds}"
    current="$(file_fingerprint "${file}")"
    if [[ -n "${current}" && "${previous}" == "${current}" ]]; then
      printf '%s' "${current}"
      return 0
    fi
    log "Seed file changed while settling; waiting again: ${file}" >&2
  done
  return 1
}

run_import_all() {
  MONGO_IMPORT_HOST="${mongo_host}" \
  MONGO_IMPORT_PORT="${mongo_port}" \
  MONGO_IMPORT_USERNAME="${mongo_username}" \
  MONGO_IMPORT_PASSWORD="${mongo_password}" \
  MONGO_APP_DATABASE="${target_database}" \
  MONGO_SEED_DIRECTORY="${seed_directory_name}" \
  MONGO_IMPORT_REPLACE_COLLECTIONS=true \
    "${mongo_import_script}"
}

run_import_file() {
  local file="$1"
  MONGO_IMPORT_HOST="${mongo_host}" \
  MONGO_IMPORT_PORT="${mongo_port}" \
  MONGO_IMPORT_USERNAME="${mongo_username}" \
  MONGO_IMPORT_PASSWORD="${mongo_password}" \
  MONGO_APP_DATABASE="${target_database}" \
  MONGO_SEED_DIRECTORY="${seed_directory_name}" \
  MONGO_IMPORT_SINGLE_FILE="${file}" \
  MONGO_IMPORT_REPLACE_COLLECTIONS=true \
    "${mongo_import_script}"
}

import_file_until_stable() {
  local file="$1"
  local before=""
  local after=""
  local collection=""

  while [[ -f "${file}" ]]; do
    before="$(wait_until_file_stable "${file}")" || return 0
    collection="$(basename "${file}" .json)"
    log "Importing ${target_database}.${collection} from ${file}"
    if ! run_import_file "${file}"; then
      log "Import failed; the unchanged fingerprint was not acknowledged and will be retried: ${file}"
      return 1
    fi
    after="$(file_fingerprint "${file}")"
    if [[ -n "${after}" && "${before}" == "${after}" ]]; then
      record_file_fingerprint "${file}" "${after}"
      log "Imported stable seed ${target_database}.${collection} (${after})"
      return 0
    fi
    log "Seed changed during import; importing the newer version next: ${file}"
  done
}

prime_fingerprint_state() {
  local file=""
  local fingerprint=""
  while IFS= read -r -d '' file; do
    fingerprint="$(file_fingerprint "${file}")"
    if [[ -n "${fingerprint}" ]]; then
      record_file_fingerprint "${file}" "${fingerprint}"
    fi
  done < <(seed_files)
}

reconcile_changed_files() {
  local file=""
  local current=""
  local recorded=""
  local failures=0
  while IFS= read -r -d '' file; do
    current="$(file_fingerprint "${file}")"
    recorded="$(recorded_file_fingerprint "${file}")"
    if [[ -n "${current}" && "${current}" != "${recorded}" ]]; then
      import_file_until_stable "${file}" || failures=$((failures + 1))
    fi
  done < <(seed_files)
  return "${failures}"
}

wait_for_mongo() {
  until mongosh \
      --host "${mongo_host}" \
      --port "${mongo_port}" \
      --username "${mongo_username}" \
      --password "${mongo_password}" \
      --authenticationDatabase "${auth_database}" \
      --quiet \
      "${target_database}" \
      --eval 'db.runCommand({ ping: 1 }).ok' >/dev/null 2>&1; do
    log "Waiting for MongoDB ${mongo_host}:${mongo_port}/${target_database}"
    sleep 2
  done
}

wait_for_change_or_reconcile_deadline() {
  if command -v inotifywait >/dev/null 2>&1; then
    inotifywait \
      -q \
      -r \
      -t "${reconcile_seconds}" \
      -e close_write,create,move,delete \
      "${watch_root}" >/dev/null 2>&1 || true
    return
  fi
  sleep "${reconcile_seconds}"
}

[[ -d "${watch_root}" ]] || fail "Seed directory does not exist: ${watch_root}"
[[ -x "${mongo_import_script}" ]] || fail "Mongo import script is not executable: ${mongo_import_script}"
is_positive_number "${debounce_seconds}" || fail "MONGODB_SEED_SYNC_DEBOUNCE_SECONDS must be positive."
is_positive_integer "${reconcile_seconds}" || fail "MONGODB_SEED_SYNC_RECONCILE_SECONDS must be a positive integer."
is_non_negative_integer "${max_reconcile_passes}" || fail "MONGODB_SEED_SYNC_MAX_RECONCILE_PASSES must be a non-negative integer."

mkdir -p "${state_directory}"
wait_for_mongo

# Record the pre-import state first. If any file changes while the initial
# import is running, the first reconciliation pass sees the newer fingerprint.
prime_fingerprint_state
until run_import_all; do
  log "Initial seed import failed; retrying without acknowledging any new file fingerprints."
  sleep 2
done
log "Initial seed import completed for ${target_database}."

reconcile_pass=0
while true; do
  wait_for_change_or_reconcile_deadline
  reconcile_changed_files || true
  reconcile_pass=$((reconcile_pass + 1))
  if (( max_reconcile_passes > 0 && reconcile_pass >= max_reconcile_passes )); then
    log "Stopped after ${reconcile_pass} reconciliation pass(es) as requested."
    exit 0
  fi
done
