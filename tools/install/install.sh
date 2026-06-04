#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd "${SCRIPT_DIR}/../.." && pwd)"

usage() {
  cat >&2 <<'USAGE'
Usage:
  tools/install/install.sh [path/to/myscoutee.deb]

The local target config is gitignored:
  tools/install/install.env

Override the config path with:
  CONFIG_FILE=/path/to/install.env tools/install/install.sh [path/to/myscoutee.deb]
USAGE
}

fail() {
  echo "fail $1" >&2
  exit 1
}

is_truthy() {
  case "$1" in
    1|true|TRUE|True|yes|YES|Yes|on|ON|On|enabled|ENABLED|Enabled)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

latest_deb() {
  [ -d "${REPO_ROOT}/packaging/dist" ] || return 0

  find "${REPO_ROOT}/packaging/dist" -maxdepth 1 -type f -name 'myscoutee_*_*.deb' -printf '%T@ %p\n' 2>/dev/null \
    | sort -nr \
    | awk 'NR == 1 { print $2 }'
}

CONFIG_FILE="${CONFIG_FILE:-${SCRIPT_DIR}/install.env}"

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if [ ! -f "${CONFIG_FILE}" ]; then
  fail "config file not found: ${CONFIG_FILE}"
fi

# shellcheck source=/dev/null
. "${CONFIG_FILE}"

REMOTE_HOST="${REMOTE_HOST:-}"
REMOTE_USER="${REMOTE_USER:-}"
REMOTE_PORT="${REMOTE_PORT:-22}"
REMOTE_PASSWORD="${REMOTE_PASSWORD:-}"
REMOTE_KEY_FILE="${REMOTE_KEY_FILE:-}"
REMOTE_SUDO_PASSWORD="${REMOTE_SUDO_PASSWORD:-${REMOTE_PASSWORD}}"
REMOTE_DEB_PATH="${REMOTE_DEB_PATH:-/tmp/myscoutee.deb}"
REMOTE_HOST_KEY_CHECKING="${REMOTE_HOST_KEY_CHECKING:-accept-new}"
REMOTE_CONNECT_TIMEOUT_SECONDS="${REMOTE_CONNECT_TIMEOUT_SECONDS:-20}"
REMOTE_SSH_OPTIONS="${REMOTE_SSH_OPTIONS:-}"
RUN_APT_UPDATE="${RUN_APT_UPDATE:-false}"
START_SERVICE="${START_SERVICE:-true}"
STOP_ON_FAILURE="${STOP_ON_FAILURE:-true}"
WAIT_AFTER_START_SECONDS="${WAIT_AFTER_START_SECONDS:-20}"

DEB_PATH="${DEB_PATH:-${1:-}}"
if [ -z "${DEB_PATH}" ]; then
  DEB_PATH="$(latest_deb)"
fi

[ -n "${REMOTE_HOST}" ] || fail "REMOTE_HOST is required in ${CONFIG_FILE}"
[ -n "${REMOTE_USER}" ] || fail "REMOTE_USER is required in ${CONFIG_FILE}"
[ -n "${DEB_PATH}" ] || fail "DEB_PATH is not set and no deb was found under packaging/dist"
[ -f "${DEB_PATH}" ] || fail "deb file not found: ${DEB_PATH}"

SMOKE_BASE_URL="http://${REMOTE_HOST}"

if ! command -v dpkg-deb >/dev/null 2>&1; then
  fail "dpkg-deb is required to read package metadata from ${DEB_PATH}"
fi

PACKAGE_NAME="$(dpkg-deb -f "${DEB_PATH}" Package)"
PACKAGE_VERSION="$(dpkg-deb -f "${DEB_PATH}" Version)"
[ -n "${PACKAGE_NAME}" ] || fail "package name is missing from ${DEB_PATH}"
[ -n "${PACKAGE_VERSION}" ] || fail "package version is missing from ${DEB_PATH}"

ssh_target="${REMOTE_USER}@${REMOTE_HOST}"

PASSWORD_AUTH_MODE=""
SSH_ASKPASS_HELPER=""

cleanup_password_helper() {
  if [ -n "${SSH_ASKPASS_HELPER}" ]; then
    rm -f "${SSH_ASKPASS_HELPER}"
  fi
}
trap cleanup_password_helper EXIT

setup_password_auth() {
  [ -n "${REMOTE_PASSWORD}" ] || return 0

  if command -v sshpass >/dev/null 2>&1; then
    PASSWORD_AUTH_MODE="sshpass"
    return 0
  fi

  if ! command -v setsid >/dev/null 2>&1; then
    fail "REMOTE_PASSWORD is set, but neither sshpass nor setsid is available locally"
  fi

  SSH_ASKPASS_HELPER="$(mktemp)"
  chmod 0700 "${SSH_ASKPASS_HELPER}"
  cat > "${SSH_ASKPASS_HELPER}" <<'ASKPASS'
#!/bin/sh
printf '%s\n' "${REMOTE_PASSWORD:?}"
ASKPASS

  export REMOTE_PASSWORD
  export SSH_ASKPASS="${SSH_ASKPASS_HELPER}"
  export SSH_ASKPASS_REQUIRE=force
  export DISPLAY="${DISPLAY:-:0}"
  PASSWORD_AUTH_MODE="askpass"
}

run_password_command() {
  case "${PASSWORD_AUTH_MODE}" in
    sshpass)
      SSHPASS="${REMOTE_PASSWORD}"
      export SSHPASS
      sshpass -e "$@"
      ;;
    askpass)
      setsid "$@"
      ;;
    *)
      "$@"
      ;;
  esac
}

run_ssh() {
  if [ -n "${REMOTE_KEY_FILE}" ]; then
    # shellcheck disable=SC2086
    run_password_command ssh \
      -p "${REMOTE_PORT}" \
      -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
      -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
      -i "${REMOTE_KEY_FILE}" \
      ${REMOTE_SSH_OPTIONS} \
      "${ssh_target}" \
      "$@"
    return
  fi

  # shellcheck disable=SC2086
  run_password_command ssh \
    -p "${REMOTE_PORT}" \
    -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
    -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
    ${REMOTE_SSH_OPTIONS} \
    "${ssh_target}" \
    "$@"
}

run_scp() {
  source_path="$1"
  destination_path="$2"

  if [ -n "${REMOTE_KEY_FILE}" ]; then
    # shellcheck disable=SC2086
    run_password_command scp \
      -P "${REMOTE_PORT}" \
      -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
      -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
      -i "${REMOTE_KEY_FILE}" \
      ${REMOTE_SSH_OPTIONS} \
      "${source_path}" \
      "${ssh_target}:${destination_path}"
    return
  fi

  # shellcheck disable=SC2086
  run_password_command scp \
    -P "${REMOTE_PORT}" \
    -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
    -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
    ${REMOTE_SSH_OPTIONS} \
    "${source_path}" \
    "${ssh_target}:${destination_path}"
}

setup_password_auth

echo "Target: ${ssh_target}"
echo "Config: ${CONFIG_FILE}"
echo "Debian package: ${DEB_PATH}"
echo "Package: ${PACKAGE_NAME} ${PACKAGE_VERSION}"
echo "Remote path: ${REMOTE_DEB_PATH}"
echo "Smoke URL: ${SMOKE_BASE_URL}"

echo "Uploading Debian package..."
run_scp "${DEB_PATH}" "${REMOTE_DEB_PATH}"

echo "Installing and smoke testing on remote host..."
run_ssh bash -s -- \
  "${REMOTE_DEB_PATH}" \
  "${SMOKE_BASE_URL}" \
  "${RUN_APT_UPDATE}" \
  "${START_SERVICE}" \
  "${STOP_ON_FAILURE}" \
  "${WAIT_AFTER_START_SECONDS}" \
  "${REMOTE_SUDO_PASSWORD}" \
  "${PACKAGE_NAME}" \
  "${PACKAGE_VERSION}" <<'REMOTE_SCRIPT'
set -euo pipefail

REMOTE_DEB_PATH="$1"
SMOKE_BASE_URL="$2"
RUN_APT_UPDATE="$3"
START_SERVICE="$4"
STOP_ON_FAILURE="$5"
WAIT_AFTER_START_SECONDS="$6"
SUDO_PASSWORD="$7"
PACKAGE_NAME="$8"
PACKAGE_VERSION="$9"

stage="initialization"

is_truthy() {
  case "${1,,}" in
    1|true|yes|on|enabled)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

log() {
  printf '[remote] %s\n' "$*"
}

sudo_run() {
  if [[ "$(id -u)" -eq 0 ]]; then
    "$@"
    return
  fi

  if [[ -n "${SUDO_PASSWORD}" ]]; then
    printf '%s\n' "${SUDO_PASSWORD}" | sudo -S -p '' "$@"
    return
  fi

  sudo -n -p '' "$@"
}

collect_status() {
  log "systemctl status myscoutee"
  sudo_run systemctl --no-pager --full status myscoutee || true

  if command -v docker >/dev/null 2>&1; then
    log "docker containers"
    sudo_run docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' || true
  fi

  if [[ -x /opt/myscoutee/packaging/scripts/myscoutee-compose.sh ]]; then
    log "myscoutee compose status"
    sudo_run /opt/myscoutee/packaging/scripts/myscoutee-compose.sh ps || true
  fi

  log "recent myscoutee service logs"
  sudo_run journalctl -u myscoutee -n 120 --no-pager || true
}

stop_myscoutee() {
  sudo_run systemctl stop myscoutee || true
}

fail_remote() {
  local message="$1"
  trap - ERR
  log "FAILED at ${stage}: ${message}"
  collect_status
  if is_truthy "${STOP_ON_FAILURE}"; then
    log "stopping myscoutee after failure"
    stop_myscoutee
  fi
  exit 1
}

trap 'rc=$?; fail_remote "command exited with status ${rc}"' ERR

check_restart_loops() {
  local restarting

  if ! command -v docker >/dev/null 2>&1; then
    return
  fi

  restarting="$(sudo_run docker ps -a \
    --filter 'label=com.docker.compose.project=server' \
    --format '{{.Names}} {{.Status}}' \
    | awk '/Restarting/ { print }')"

  if [[ -n "${restarting}" ]]; then
    log "restart-looping containers:"
    printf '%s\n' "${restarting}"
    fail_remote "docker container restart loop detected"
  fi
}

cleanup_same_version_runtime() {
  local image

  if ! command -v docker >/dev/null 2>&1; then
    return
  fi

  log "cleaning same-version Docker runtime before reinstall"
  stop_myscoutee

  if [[ -d /opt/myscoutee/server && -f /opt/myscoutee/server/docker-compose-prod.yml ]]; then
    (
      cd /opt/myscoutee/server
      sudo_run docker compose -f docker-compose-prod.yml down --remove-orphans
    ) || true
  fi

  for image in \
    "myscoutee-nginx:${PACKAGE_VERSION}-base" \
    "myscoutee-nginx:${PACKAGE_VERSION}-prod" \
    "myscoutee-api:${PACKAGE_VERSION}-prod"; do
    if sudo_run docker image inspect "${image}" >/dev/null 2>&1; then
      sudo_run docker image rm -f "${image}" || true
    fi
  done
}

installed_package_version() {
  local line status version

  line="$(dpkg-query -W -f='${db:Status-Abbrev}\t${Version}\n' "${PACKAGE_NAME}" 2>/dev/null || true)"
  [[ -n "${line}" ]] || return 0

  status="${line%%$'\t'*}"
  version="${line#*$'\t'}"
  if [[ "${status:0:2}" != "ii" ]]; then
    return 0
  fi

  printf '%s' "${version}"
}

stage="package install"
if is_truthy "${RUN_APT_UPDATE}"; then
  sudo_run apt-get update
fi

installed_version="$(installed_package_version)"
if [[ -z "${installed_version}" ]]; then
  log "${PACKAGE_NAME} is not installed; installing ${PACKAGE_VERSION}"
elif [[ "${installed_version}" == "${PACKAGE_VERSION}" ]]; then
  log "${PACKAGE_NAME} ${installed_version} is already installed; removing before reinstall"
  cleanup_same_version_runtime
  sudo_run env DEBIAN_FRONTEND=noninteractive apt-get remove -y "${PACKAGE_NAME}"
else
  log "${PACKAGE_NAME} ${installed_version} is installed; upgrading to ${PACKAGE_VERSION}"
fi

sudo_run env DEBIAN_FRONTEND=noninteractive apt-get install -y "${REMOTE_DEB_PATH}"

stage="service start"
if is_truthy "${START_SERVICE}"; then
  sudo_run systemctl restart myscoutee
  sleep "${WAIT_AFTER_START_SECONDS}"
  sudo_run systemctl is-active --quiet myscoutee
  check_restart_loops
else
  log "START_SERVICE=false, skipping service restart"
fi

stage="smoke test"
if [[ ! -x /opt/myscoutee/packaging/scripts/smoke-mongo-compatibility.sh ]]; then
  fail_remote "smoke script is missing from installed package"
fi

sudo_run env MYSCOUTEE_BASE_URL="${SMOKE_BASE_URL}" START_STACK=false \
  bash /opt/myscoutee/packaging/scripts/smoke-mongo-compatibility.sh
check_restart_loops

stage="bundle smoke test"
bundle_body="$(curl -fsS "${SMOKE_BASE_URL%/}/api/i18n/bundle?lang=hu")"
if [[ "${bundle_body}" != *'"lang":"hu"'* || "${bundle_body}" != *'"data":{'* ]]; then
  fail_remote "i18n bundle smoke failed for ${SMOKE_BASE_URL%/}/api/i18n/bundle?lang=hu"
fi
log "i18n bundle smoke passed"

log "install and smoke test passed"
REMOTE_SCRIPT
