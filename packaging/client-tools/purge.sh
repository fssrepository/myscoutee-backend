#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"
TRANSPORT_SCRIPT="${SCRIPT_DIR}/remote-transport.sh"
CONFIG_FILE="${CONFIG_FILE:-${SCRIPT_DIR}/install.env}"

fail() {
  echo "fail $1" >&2
  exit 1
}

[ -f "$CONFIG_FILE" ] || fail "config file not found: $CONFIG_FILE"
[ -f "$TRANSPORT_SCRIPT" ] || fail "transport helper not found: $TRANSPORT_SCRIPT"

# shellcheck source=/dev/null
. "$CONFIG_FILE"
# shellcheck source=/dev/null
. "$TRANSPORT_SCRIPT"

REMOTE_HOST="${REMOTE_HOST:-}"
REMOTE_USER="${REMOTE_USER:-}"
REMOTE_DEB_PATH="${REMOTE_DEB_PATH:-/tmp/myscoutee.deb}"
printf '%s\n' "$REMOTE_DEB_PATH" \
  | grep -Eq '^/tmp/[A-Za-z0-9][A-Za-z0-9._-]*\.deb$' \
  || fail "REMOTE_DEB_PATH must be a simple absolute .deb path directly under /tmp"

remote_transport_setup "$CONFIG_FILE"
trap remote_transport_cleanup EXIT

echo "Target: ${REMOTE_TRANSPORT_TARGET}"
echo "Config: ${CONFIG_FILE}"
echo "Purging the MyScoutee package on the remote host..."
remote_transport_run_root \
  env DEBIAN_FRONTEND=noninteractive \
  apt-get purge -y myscoutee
remote_transport_run_root rm -f -- "$REMOTE_DEB_PATH"

if remote_transport_run sh -c \
    "dpkg-query -W -f='\${db:Status-Abbrev}' myscoutee 2>/dev/null | grep -q '^ii'"; then
  fail "myscoutee is still installed after apt-get purge"
fi

echo "Remote package purge passed."
