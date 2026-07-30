#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
TEST_ROOT="$(mktemp -d /tmp/myscoutee-numeric-ownership-test.XXXXXX)"

cleanup() {
  rm -rf -- "${TEST_ROOT}"
}
trap cleanup EXIT

fail() {
  echo "Numeric ownership policy test failed: $1" >&2
  exit 1
}

join_shell_continuations() {
  sed \
    -e ':join' \
    -e '/\\[[:space:]]*$/ {
      N
      s/\\[[:space:]]*\n[[:space:]]*/ /
      b join
    }' \
    "$1"
}

scan_script() {
  local script="$1"
  local logical_lines="${TEST_ROOT}/logical-lines"

  join_shell_continuations "${script}" > "${logical_lines}"
  if grep -Eq \
      '(^|[;&|()[:space:]])install[[:space:]][^;]*[[:space:]](-o|-g|--owner(=|[[:space:]])|--group(=|[[:space:]]))' \
      "${logical_lines}"; then
    fail "${script#${REPO_ROOT}/} uses install ownership options"
  fi
  if grep -Eq \
      '(chown|chgrp)[[:space:]][^;]*(root:)?("\$\{[A-Z0-9_]*(UID|GID|USER_ID|GROUP_ID)(:-[0-9]+)?\}|root:"\$\{[A-Z0-9_]*(GID|GROUP_ID)(:-[0-9]+)?\})' \
      "${logical_lines}"; then
    fail "${script#${REPO_ROOT}/} uses a numeric ownership variable without the coreutils + prefix"
  fi
}

while IFS= read -r host_script; do
  scan_script "${host_script}"
done < <(
  {
    find "${REPO_ROOT}/packaging/debian" \
      -maxdepth 1 -type f -print
    find "${REPO_ROOT}/packaging/scripts" \
      -maxdepth 1 -type f -name '*.sh' -print
  } | LC_ALL=C sort
)

FAKE_BIN="${TEST_ROOT}/bin"
COMMAND_LOG="${TEST_ROOT}/commands.log"
mkdir -p "${FAKE_BIN}"
: > "${COMMAND_LOG}"
for command_name in install chown chmod; do
  cat > "${FAKE_BIN}/${command_name}" <<'STUB'
#!/usr/bin/env bash
set -euo pipefail

command_name="$(basename -- "$0")"
printf '%s\t%s\n' "${command_name}" "$*" >> "${NUMERIC_OWNERSHIP_COMMAND_LOG:?}"
case "${command_name}" in
  install)
    for argument in "$@"; do
      case "${argument}" in
        -o|-g|--owner|--owner=*|--group|--group=*)
          exit 91
          ;;
      esac
    done
    ;;
  chown)
    [[ "${1:-}" == '+10001:+10001' ]] || exit 92
    ;;
esac
STUB
  chmod 0755 "${FAKE_BIN}/${command_name}"
done

for helper_source in \
  "${REPO_ROOT}/packaging/debian/postinst" \
  "${REPO_ROOT}/packaging/scripts/myscoutee-update-worker.sh" \
  "${REPO_ROOT}/packaging/scripts/myscoutee-tls-worker.sh"; do
  helper_file="${TEST_ROOT}/$(basename -- "${helper_source}").helper"
  sed -n \
    '/^install_numeric_owned_directory() {$/,/^}$/p' \
    "${helper_source}" > "${helper_file}"
  grep -Fq 'install_numeric_owned_directory() {' "${helper_file}" \
    || fail "numeric directory helper is missing from ${helper_source#${REPO_ROOT}/}"
  PATH="${FAKE_BIN}:/usr/bin:/bin" \
  NUMERIC_OWNERSHIP_COMMAND_LOG="${COMMAND_LOG}" \
  NUMERIC_OWNERSHIP_HELPER="${helper_file}" \
    bash -c '
      source "${NUMERIC_OWNERSHIP_HELPER}"
      install_numeric_owned_directory \
        0700 10001 10001 /tmp/myscoutee-numeric-owner-fixture
    '
done

[[ "$(grep -Fxc $'install\t-d -m 0700 -- /tmp/myscoutee-numeric-owner-fixture' "${COMMAND_LOG}")" == "3" ]] \
  || fail "numeric directory helpers did not separate creation from ownership"
[[ "$(grep -Fxc $'chown\t+10001:+10001 -- /tmp/myscoutee-numeric-owner-fixture' "${COMMAND_LOG}")" == "3" ]] \
  || fail "numeric directory helpers did not force explicit numeric chown"
[[ "$(grep -Fxc $'chmod\t0700 -- /tmp/myscoutee-numeric-owner-fixture' "${COMMAND_LOG}")" == "3" ]] \
  || fail "numeric directory helpers did not restore the requested mode"

echo "Numeric ownership policy tests passed."
