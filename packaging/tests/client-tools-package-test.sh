#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf -- "${TEST_ROOT}"' EXIT
mkdir -p "${TEST_ROOT}/bin" "${TEST_ROOT}/dist"
for command in docker dpkg-deb npm node java; do
  printf '#!/bin/sh\necho "Unexpected application build command" >&2\nexit 99\n' > "${TEST_ROOT}/bin/${command}"
  chmod 0755 "${TEST_ROOT}/bin/${command}"
done
printf 'existing DEB must remain unchanged\n' > "${TEST_ROOT}/dist/myscoutee_1.0.0_amd64.deb"
before="$(sha256sum "${TEST_ROOT}/dist/myscoutee_1.0.0_amd64.deb")"
PATH="${TEST_ROOT}/bin:${PATH}" MYSCOUTEE_VERSION=1.0.0 MYSCOUTEE_DIST_DIR="${TEST_ROOT}/dist" \
  bash "${REPO_ROOT}/packaging/release/package-client-tools.sh"
[[ "$(sha256sum "${TEST_ROOT}/dist/myscoutee_1.0.0_amd64.deb")" == "${before}" ]]
archive="${TEST_ROOT}/dist/myscoutee-client-tools_1.0.0.tar.gz"
(cd "${TEST_ROOT}/dist" && sha256sum -c myscoutee-client-tools_1.0.0.tar.gz.sha256)
[[ "$(tar -xOzf "${archive}" ./VERSION)" == 1.0.0 ]]
tar -xOzf "${archive}" ./prepare-debian13-minimal.sh \
  | cmp - "${REPO_ROOT}/packaging/client-tools/prepare-debian13-minimal.sh"
for helper in install-temporary-frontend.sh install-temporary-image.sh; do
  tar -xOzf "${archive}" "./${helper}" | cmp - "${REPO_ROOT}/packaging/client-tools/${helper}"
done
if tar -tzf "${archive}" | grep -Fxq './install.env'; then
  echo "Local credentials must not be packaged" >&2
  exit 1
fi
first_hash="$(sha256sum "${archive}")"
MYSCOUTEE_VERSION=1.0.0 MYSCOUTEE_DIST_DIR="${TEST_ROOT}/dist" \
  bash "${REPO_ROOT}/packaging/release/package-client-tools.sh"
[[ "$(sha256sum "${archive}")" == "${first_hash}" ]]
echo "Client-tools-only packaging passed: reproducible archive; DEB unchanged; no application build."
