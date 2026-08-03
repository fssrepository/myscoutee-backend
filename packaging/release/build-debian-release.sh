#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd "${SCRIPT_DIR}/../.." && pwd)"
# The package builder is runtime-source packaging logic, not a release wrapper.
PACKAGE_SCRIPT="${SCRIPT_DIR}/package-production.sh"
DIST_DIR="${REPO_ROOT}/packaging/dist"

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

echo "Debian package ready: ${latest_deb}"
