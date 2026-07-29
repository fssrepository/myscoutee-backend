#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="${CONFIG_FILE:-${SCRIPT_DIR}/install.env}"

fail() {
  echo "fail $1" >&2
  exit 1
}

quote_shell() {
  printf "'%s'" "$(printf '%s' "$1" | sed "s/'/'\\\\''/g")"
}

[ -f "$CONFIG_FILE" ] || fail "config file not found: $CONFIG_FILE"

# shellcheck source=/dev/null
. "$CONFIG_FILE"

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

[ -n "$REMOTE_HOST" ] || fail "REMOTE_HOST is required in $CONFIG_FILE"
[ -n "$REMOTE_USER" ] || fail "REMOTE_USER is required in $CONFIG_FILE"
[ -n "$REMOTE_SUDO_PASSWORD" ] || fail "REMOTE_SUDO_PASSWORD or REMOTE_PASSWORD is required in $CONFIG_FILE"

ssh_target="${REMOTE_USER}@${REMOTE_HOST}"
password_helper=""

cleanup() {
  [ -z "$password_helper" ] || rm -f "$password_helper"
}
trap cleanup EXIT

setup_password_auth() {
  [ -n "$REMOTE_PASSWORD" ] || return 0

  if command -v sshpass >/dev/null 2>&1; then
    return 0
  fi

  command -v setsid >/dev/null 2>&1 || fail "REMOTE_PASSWORD is set, but neither sshpass nor setsid is available locally"

  password_helper="$(mktemp)"
  chmod 0700 "$password_helper"
  cat > "$password_helper" <<'ASKPASS'
#!/bin/sh
printf '%s\n' "${REMOTE_PASSWORD:?}"
ASKPASS

  export REMOTE_PASSWORD
  export SSH_ASKPASS="$password_helper"
  export SSH_ASKPASS_REQUIRE=force
  export DISPLAY="${DISPLAY:-:0}"
}

run_ssh() {
  if [ -n "$REMOTE_KEY_FILE" ]; then
    if command -v sshpass >/dev/null 2>&1 && [ -n "$REMOTE_PASSWORD" ]; then
      SSHPASS="$REMOTE_PASSWORD" sshpass -e ssh \
        -p "$REMOTE_PORT" \
        -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
        -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
        -i "$REMOTE_KEY_FILE" \
        ${REMOTE_SSH_OPTIONS} \
        "$ssh_target" "$@"
      return
    fi
    setsid ssh \
      -p "$REMOTE_PORT" \
      -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
      -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
      -i "$REMOTE_KEY_FILE" \
      ${REMOTE_SSH_OPTIONS} \
      "$ssh_target" "$@"
    return
  fi

  if command -v sshpass >/dev/null 2>&1 && [ -n "$REMOTE_PASSWORD" ]; then
    SSHPASS="$REMOTE_PASSWORD" sshpass -e ssh \
      -p "$REMOTE_PORT" \
      -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
      -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
      ${REMOTE_SSH_OPTIONS} \
      "$ssh_target" "$@"
    return
  fi

  setsid ssh \
    -p "$REMOTE_PORT" \
    -o "ConnectTimeout=${REMOTE_CONNECT_TIMEOUT_SECONDS}" \
    -o "StrictHostKeyChecking=${REMOTE_HOST_KEY_CHECKING}" \
    ${REMOTE_SSH_OPTIONS} \
    "$ssh_target" "$@"
}

setup_password_auth

remote_script='set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

managed_images=""
if command -v docker >/dev/null 2>&1; then
  if [[ -f /opt/myscoutee/packaging/IMAGE-MANIFEST.json ]] \
      && command -v jq >/dev/null 2>&1; then
    managed_images="$(
      jq -r \
        '"'"'.images[]?.reference // empty'"'"' \
        /opt/myscoutee/packaging/IMAGE-MANIFEST.json \
        | awk '"'"'
            /^myscoutee-api:/ ||
            /^myscoutee-nginx:/ ||
            /^myscoutee-minio:/ ||
            /^myscoutee-registry:/ {
              print
            }
          '"'"'
    )"
  fi

  if [[ -z "${managed_images}" ]]; then
    managed_images="$(
      docker images --format "{{.Repository}}:{{.Tag}}" \
        | awk '"'"'
            /^myscoutee-api:/ ||
            /^myscoutee-nginx:/ ||
            /^myscoutee-minio:/ ||
            /^myscoutee-registry:/ {
              print
            }
          '"'"'
    )"
  fi
fi

echo "Stopping MyScoutee service..."
systemctl stop myscoutee || true

echo "Removing MyScoutee compose containers, network, and volumes..."
if [[ -x /opt/myscoutee/packaging/scripts/myscoutee-compose.sh ]]; then
  /opt/myscoutee/packaging/scripts/myscoutee-compose.sh down -v --remove-orphans || true
elif [[ -f /opt/myscoutee/server/docker-compose-prod.yml ]]; then
  (cd /opt/myscoutee/server && docker compose -f docker-compose-prod.yml down -v --remove-orphans) || true
fi

echo "Purging MyScoutee Debian package..."
apt-get purge -y myscoutee || true

echo "Removing MyScoutee-owned files..."
rm -rf /etc/myscoutee
rm -rf /opt/myscoutee
rm -rf /var/lib/myscoutee
rm -rf /var/log/myscoutee
rm -f "${REMOTE_DEB_PATH}"

echo "Removing MyScoutee-owned Docker images..."
if command -v docker >/dev/null 2>&1 && [[ -n "${managed_images}" ]]; then
  while IFS= read -r managed_image; do
    [[ -n "${managed_image}" ]] || continue
    docker image rm -f "${managed_image}" || true
  done <<< "${managed_images}"
fi

systemctl daemon-reload || true

echo "Remaining MyScoutee containers:"
if command -v docker >/dev/null 2>&1; then
  docker ps -a --format "{{.Names}} {{.Image}}" \
    | awk "\$1 == \"myscoutee\" || \$1 == \"nginx\" || \$1 == \"mongodb\" || \$1 == \"redis\" || \$1 == \"minio\" || \$1 == \"registry-demo\" { print }" || true
fi

echo "Remaining MyScoutee compose volumes:"
if command -v docker >/dev/null 2>&1; then
  docker volume ls --format "{{.Name}}" \
    | awk "/^server_/ || /^myscoutee-registry-demo-/ { print }" || true
fi

echo "MyScoutee purge complete."
'

remote_deb_path_assignment="REMOTE_DEB_PATH=$(quote_shell "$REMOTE_DEB_PATH")"
quoted_remote_script="$(quote_shell "$remote_script")"

echo "Target: $ssh_target"
echo "Config: $CONFIG_FILE"
echo "Purging MyScoutee install on remote host..."
printf '%s\n' "$REMOTE_SUDO_PASSWORD" | run_ssh "sudo -S env $remote_deb_path_assignment bash -lc $quoted_remote_script"
