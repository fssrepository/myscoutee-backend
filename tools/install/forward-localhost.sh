#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"

usage() {
  cat >&2 <<'USAGE'
Usage:
  tools/install/forward-localhost.sh

The script reads the remote SSH target from:
  tools/install/install.env
USAGE
}

fail() {
  echo "fail $1" >&2
  exit 1
}

CONFIG_FILE="${CONFIG_FILE:-${SCRIPT_DIR}/install.env}"

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if [ ! -f "$CONFIG_FILE" ]; then
  fail "config file not found: $CONFIG_FILE"
fi

. "$CONFIG_FILE"

REMOTE_HOST="${REMOTE_HOST:-}"
REMOTE_USER="${REMOTE_USER:-}"
REMOTE_PORT="${REMOTE_PORT:-22}"
REMOTE_PASSWORD="${REMOTE_PASSWORD:-}"
REMOTE_KEY_FILE="${REMOTE_KEY_FILE:-}"
REMOTE_HOST_KEY_CHECKING="${REMOTE_HOST_KEY_CHECKING:-accept-new}"
REMOTE_CONNECT_TIMEOUT_SECONDS="${REMOTE_CONNECT_TIMEOUT_SECONDS:-20}"
REMOTE_SSH_OPTIONS="${REMOTE_SSH_OPTIONS:-}"

LOCAL_FORWARD_HOST="${LOCAL_FORWARD_HOST:-127.0.0.1}"
LOCAL_FORWARD_REMOTE_HOST="$REMOTE_HOST"
LOCAL_FORWARD_PORTS="${LOCAL_FORWARD_PORTS:-80}"

[ -n "$REMOTE_HOST" ] || fail "REMOTE_HOST is required in $CONFIG_FILE"
[ -n "$REMOTE_USER" ] || fail "REMOTE_USER is required in $CONFIG_FILE"
[ -n "$LOCAL_FORWARD_PORTS" ] || fail "LOCAL_FORWARD_PORTS is empty"

ssh_target="${REMOTE_USER}@${REMOTE_HOST}"
PASSWORD_AUTH_MODE=""
SSH_ASKPASS_HELPER=""

cleanup_password_helper() {
  if [ -n "$SSH_ASKPASS_HELPER" ]; then
    rm -f "$SSH_ASKPASS_HELPER"
  fi
}
trap cleanup_password_helper EXIT

setup_password_auth() {
  if [ -z "$REMOTE_PASSWORD" ]; then
    return 0
  fi

  if command -v sshpass >/dev/null 2>&1; then
    PASSWORD_AUTH_MODE="sshpass"
    return 0
  fi

  if ! command -v setsid >/dev/null 2>&1; then
    fail "REMOTE_PASSWORD is set, but neither sshpass nor setsid is available locally"
  fi

  SSH_ASKPASS_HELPER="$(mktemp)"
  chmod 0700 "$SSH_ASKPASS_HELPER"
  cat > "$SSH_ASKPASS_HELPER" <<'ASKPASS'
#!/bin/sh
printf '%s\n' "${REMOTE_PASSWORD:?}"
ASKPASS

  export REMOTE_PASSWORD
  export SSH_ASKPASS="$SSH_ASKPASS_HELPER"
  export SSH_ASKPASS_REQUIRE=force
  export DISPLAY="${DISPLAY:-:0}"
  PASSWORD_AUTH_MODE="askpass"
}

run_password_command() {
  case "$PASSWORD_AUTH_MODE" in
    sshpass)
      SSHPASS="$REMOTE_PASSWORD"
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

start_forward() {
  local_port="$1"
  remote_port="$1"
  forward_spec="${LOCAL_FORWARD_HOST}:${local_port}:${LOCAL_FORWARD_REMOTE_HOST}:${remote_port}"

  echo "Target: $ssh_target"
  echo "Config: $CONFIG_FILE"
  echo "Forward: ${LOCAL_FORWARD_HOST}:${local_port}->${LOCAL_FORWARD_REMOTE_HOST}:${remote_port}"

  if [ -n "$REMOTE_KEY_FILE" ]; then
    # shellcheck disable=SC2086
    run_password_command ssh \
      -p "$REMOTE_PORT" \
      -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
      -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
      -o ExitOnForwardFailure=yes \
      -o ServerAliveInterval=30 \
      -o ServerAliveCountMax=3 \
      -i "$REMOTE_KEY_FILE" \
      $REMOTE_SSH_OPTIONS \
      -fN \
      -L "$forward_spec" \
      "$ssh_target"
    return
  fi

  # shellcheck disable=SC2086
  run_password_command ssh \
    -p "$REMOTE_PORT" \
    -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
    -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
    -o ExitOnForwardFailure=yes \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    $REMOTE_SSH_OPTIONS \
    -fN \
    -L "$forward_spec" \
    "$ssh_target"
}

matching_forward_pids() {
  local_port="$1"
  forward_prefix="${LOCAL_FORWARD_HOST}:${local_port}:"

  ps -ww -eo pid=,args= | awk \
    -v self="$$" \
    -v parent="${PPID:-}" \
    -v prefix="$forward_prefix" '
      $1 != self && $1 != parent {
        pid = $1
        $1 = ""
        args = $0
        if (args ~ /(^|[[:space:]])ssh([[:space:]]|$)/ &&
            (index(args, "-L " prefix) || index(args, "-L" prefix))) {
          print pid
        }
      }
    '
}

replace_existing_forward() {
  local_port="$1"
  pids="$(matching_forward_pids "$local_port")"

  if [ -z "$pids" ]; then
    return 0
  fi

  echo "Replacing existing forward on ${LOCAL_FORWARD_HOST}:${local_port}"
  for pid in $pids; do
    kill -TERM "$pid" 2>/dev/null || true
  done

  sleep 1
  pids="$(matching_forward_pids "$local_port")"
  if [ -n "$pids" ]; then
    fail "existing forward did not stop on ${LOCAL_FORWARD_HOST}:${local_port}"
  fi
}

needs_privileged_bind=false
OLD_IFS="$IFS"
IFS=", "
for spec in $LOCAL_FORWARD_PORTS; do
  case "$spec" in
    ""|*[!0-9]*)
      fail "invalid local port in forward spec: $spec"
      ;;
  esac

  if [ "$spec" -lt 1024 ]; then
    needs_privileged_bind=true
  fi
done
IFS="$OLD_IFS"

if [ "$needs_privileged_bind" = true ] && [ "$(id -u)" -ne 0 ]; then
  if ! [ -t 0 ]; then
    fail "local port 80 requires sudo; run: sudo -E $0"
  fi

  exec sudo -E "$0" "$@"
fi

setup_password_auth

OLD_IFS="$IFS"
IFS=", "
for spec in $LOCAL_FORWARD_PORTS; do
  replace_existing_forward "$spec"
  start_forward "$spec"
done
IFS="$OLD_IFS"

echo "Forward active"
