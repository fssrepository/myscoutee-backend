#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd "${SCRIPT_DIR}/../.." && pwd)"
# The package builder is runtime-source packaging logic, not a release wrapper.
PACKAGE_SCRIPT="${SCRIPT_DIR}/package-production.sh"
DIST_DIR="${MYSCOUTEE_DIST_DIR:-${REPO_ROOT}/packaging/dist}"

if [ ! -f "${PACKAGE_SCRIPT}" ]; then
  echo "Package script not found: ${PACKAGE_SCRIPT}" >&2
  exit 1
fi

echo "Building MyScoutee Debian package and Operator helper bundle..."
bash "${PACKAGE_SCRIPT}" "$@"

latest_deb="$(find "${DIST_DIR}" -maxdepth 1 -type f -name 'myscoutee_*_*.deb' -printf '%T@ %p\n' 2>/dev/null \
  | sort -nr \
  | awk 'NR == 1 { print $2 }')"

if [ -z "${latest_deb}" ]; then
  echo "Debian package was not found under ${DIST_DIR}." >&2
  exit 1
fi

package_version="$(dpkg-deb -f "${latest_deb}" Version)"
client_tools="${DIST_DIR}/myscoutee-client-tools_${package_version}.tar.gz"
if [ ! -f "${client_tools}" ]; then
  echo "Operator helper bundle was not found: ${client_tools}" >&2
  exit 1
fi

write_checksum() {
  artifact="$1"
  artifact_dir="$(dirname "${artifact}")"
  artifact_name="$(basename "${artifact}")"
  checksum_file="${artifact}.sha256"
  checksum_tmp="$(mktemp "${checksum_file}.tmp.XXXXXX")"
  if ! (cd "${artifact_dir}" && sha256sum "${artifact_name}") > "${checksum_tmp}"; then
    rm -f -- "${checksum_tmp}"
    return 1
  fi
  chmod 0644 "${checksum_tmp}"
  mv -f -- "${checksum_tmp}" "${checksum_file}"
  echo "SHA-256 ready: ${checksum_file}"
}

write_checksum "${latest_deb}"
write_checksum "${client_tools}"

echo "Debian package ready: ${latest_deb}"
