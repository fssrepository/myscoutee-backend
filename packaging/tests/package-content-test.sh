#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
PACKAGE_SCRIPT="${REPO_ROOT}/packaging/scripts/package-production.sh"
TEST_ROOT="$(mktemp -d /tmp/myscoutee-package-content-test.XXXXXX)"

cleanup() {
  rm -rf "${TEST_ROOT}"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

for command_name in dpkg-deb jq tar; do
  command -v "${command_name}" >/dev/null 2>&1 \
    || fail "required test command is missing: ${command_name}"
done

DEB_PATH="$(
  MYSCOUTEE_VERSION=1.0.0 \
  MYSCOUTEE_DIST_DIR="${TEST_ROOT}/dist" \
  BUILD_ARTIFACTS=false \
  PACKAGE_IMAGES=false \
  ALLOW_UNBUNDLED_IMAGES_FOR_TESTS=true \
  bash "${PACKAGE_SCRIPT}" | tail -n 1
)"
[[ -f "${DEB_PATH}" ]] || fail "package-content fixture was not built"

CONTENTS="${TEST_ROOT}/contents.txt"
dpkg-deb --fsys-tarfile "${DEB_PATH}" | tar -tf - > "${CONTENTS}"
if grep -Fxq './opt/myscoutee/server/projects/profile/secrets/firebase-service-account.json' \
  "${CONTENTS}"; then
  fail "real Firebase service-account JSON was embedded in the package"
fi
grep -Fxq \
  './opt/myscoutee/server/projects/profile/secrets/firebase-service-account.json.example' \
  "${CONTENTS}" \
  || fail "Firebase provisioning example is missing"
grep -Fxq './opt/myscoutee/packaging/scripts/myscoutee-safe-copy.py' \
  "${CONTENTS}" \
  || fail "safe-copy helper is missing"
grep -Fxq \
  './opt/myscoutee/packaging/scripts/ensure-operator-configuration-key.sh' \
  "${CONTENTS}" \
  || fail "operator configuration key initializer is missing"
if grep -Fxq './etc/myscoutee/configuration/deployment-master-key' \
  "${CONTENTS}"; then
  fail "operator configuration master key was embedded in the package"
fi
grep -Fxq './lib/systemd/system/myscoutee-update.service' "${CONTENTS}" \
  || fail "update service is missing"
grep -Fxq './lib/systemd/system/myscoutee-update.path' "${CONTENTS}" \
  || fail "update path unit is missing"
grep -Fxq './opt/myscoutee/packaging/IMAGE-MANIFEST.json' "${CONTENTS}" \
  || fail "package image manifest is missing"

EXTRACTED="${TEST_ROOT}/extracted"
dpkg-deb -x "${DEB_PATH}" "${EXTRACTED}"
jq -e \
  '.schemaVersion == 1
    and .releaseVersion == "1.0.0"
    and .bundled == false
    and .images == []' \
  "${EXTRACTED}/opt/myscoutee/packaging/IMAGE-MANIFEST.json" >/dev/null \
  || fail "test-only unbundled manifest is invalid"
[[ -x "${EXTRACTED}/opt/myscoutee/packaging/scripts/myscoutee-safe-copy.py" ]] \
  || fail "safe-copy helper is not executable"

KEY_HELPER="${EXTRACTED}/opt/myscoutee/packaging/scripts/ensure-operator-configuration-key.sh"
KEY_DIR="${TEST_ROOT}/configuration"
MYSCOUTEE_OPERATOR_CONFIGURATION_KEY_DIR="${KEY_DIR}" \
MYSCOUTEE_CONFIGURATION_OWNER_UID="$(id -u)" \
MYSCOUTEE_CONFIGURATION_OWNER_GID="$(id -g)" \
  "${KEY_HELPER}"
first_key="$(tr -d '\n' < "${KEY_DIR}/deployment-master-key")"
[[ "${first_key}" =~ ^[0-9a-f]{64}$ ]] \
  || fail "operator configuration helper generated an invalid key"
MYSCOUTEE_OPERATOR_CONFIGURATION_KEY_DIR="${KEY_DIR}" \
MYSCOUTEE_CONFIGURATION_OWNER_UID="$(id -u)" \
MYSCOUTEE_CONFIGURATION_OWNER_GID="$(id -g)" \
  "${KEY_HELPER}"
[[ "$(tr -d '\n' < "${KEY_DIR}/deployment-master-key")" == "${first_key}" ]] \
  || fail "operator configuration helper rotated an existing key"
[[ "$(stat -c '%a' "${KEY_DIR}")" == "750" \
  && "$(stat -c '%a' "${KEY_DIR}/deployment-master-key")" == "640" ]] \
  || fail "operator configuration key permissions are incorrect"
grep -Fq \
  '/opt/myscoutee/packaging/scripts/ensure-operator-configuration-key.sh' \
  "${REPO_ROOT}/packaging/debian/postinst" \
  || fail "postinst does not run the persistent key initializer"
for collection in \
  operatorRegistryEndpoints paymentProviders deploymentConfigurations; do
  grep -Fq "${collection}" \
    "${EXTRACTED}/opt/myscoutee/packaging/templates/myscoutee.env" \
    || fail "production seed allow-list omits ${collection}"
done

REAL_FIREBASE="${REPO_ROOT}/server/projects/profile/secrets/firebase-service-account.json"
if [[ -f "${REAL_FIREBASE}" ]]; then
  private_key_id="$(jq -r '.private_key_id // ""' "${REAL_FIREBASE}")"
  if [[ -n "${private_key_id}" ]] \
    && grep -R -Fq -- "${private_key_id}" "${EXTRACTED}"; then
    fail "a real Firebase private-key identifier leaked into package content"
  fi
fi

if MYSCOUTEE_VERSION=1.0.0-prod \
  MYSCOUTEE_DIST_DIR="${TEST_ROOT}/invalid-dist" \
  BUILD_ARTIFACTS=false \
  PACKAGE_IMAGES=false \
  ALLOW_UNBUNDLED_IMAGES_FOR_TESTS=true \
  bash "${PACKAGE_SCRIPT}" >/dev/null 2>&1; then
  fail "suffixed Debian package version was accepted"
fi

echo "package content tests passed"
