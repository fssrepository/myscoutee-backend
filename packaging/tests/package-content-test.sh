#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
PACKAGE_SCRIPT="${REPO_ROOT}/packaging/scripts/package-production.sh"
CREDENTIAL_AUDIT="${REPO_ROOT}/packaging/scripts/audit-package-credentials.sh"
TEST_ROOT="$(mktemp -d /tmp/myscoutee-package-content-test.XXXXXX)"

cleanup() {
  rm -rf "${TEST_ROOT}"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

for command_name in dpkg-deb jq python3 tar; do
  command -v "${command_name}" >/dev/null 2>&1 \
    || fail "required test command is missing: ${command_name}"
done

assert_dockerignore_line() {
  local dockerignore="$1"
  local pattern="$2"

  grep -Fxq -- "${pattern}" "${dockerignore}" \
    || fail "${dockerignore#${REPO_ROOT}/} does not exclude ${pattern}"
}

SERVER_DOCKERIGNORE="${REPO_ROOT}/server/.dockerignore"
NGINX_DOCKERIGNORE="${REPO_ROOT}/server/docker/.dockerignore"
for pattern in \
  '.env' '.env.*' 'projects/profile/secrets/' \
  'docker/conf/nginx/keys/' 'data/' \
  '**/*.pem' '**/*.key' '**/*.p8' \
  '**/*service-account*.json' '**/*client-secret*.json' \
  '**/*provider-credentials*.json'; do
  assert_dockerignore_line "${SERVER_DOCKERIGNORE}" "${pattern}"
done
for pattern in \
  'conf/nginx/keys/' \
  '**/*.pem' '**/*.key' '**/*.p8' \
  '**/*service-account*.json' '**/*client-secret*.json' \
  '**/*provider-credentials*.json'; do
  assert_dockerignore_line "${NGINX_DOCKERIGNORE}" "${pattern}"
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
if grep -Eiq \
  '/(\.env\.secrets|application-secrets\.ya?ml|[^/]*(client-secret|provider-credentials)[^/]*\.json|[^/]*\.(p12|pfx|jks|keystore))$' \
  "${CONTENTS}"; then
  fail "an external provider credential container was embedded in the package"
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
if grep -Eq \
  '/(deployment-private-key\.pem|deployment-public-key\.der|registry-demo-signing-key\.pem)$' \
  "${CONTENTS}"; then
  fail "a node or demo-registry identity key was embedded in the package"
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

PACKAGED_MONGO="${EXTRACTED}/opt/myscoutee/server/docker/conf/mongodb"
PACKAGED_PRODUCTION_SEED="${PACKAGED_MONGO}/myscoutee_db"
PACKAGED_DEMO_SEED="${PACKAGED_MONGO}/demo_db"
[[ ! -e "${PACKAGED_MONGO}/e2e_db" ]] \
  || fail "E2E Mongo fixtures were embedded in the production package"
for forbidden_seed in \
  users adminUsers userRates userFilterPreferences navigatorContacts \
  activityMembers activityResources assets assetRequests events chats \
  chatMessages payments; do
  [[ ! -e "${PACKAGED_PRODUCTION_SEED}/${forbidden_seed}.json" ]] \
    || fail "private/runtime production seed was embedded: ${forbidden_seed}"
done
jq -e '
  type == "array"
  and all(.[];
    ((.adminEmails // []) | type == "array")
    and ((.adminEmails // []) | length == 0))
' "${PACKAGED_PRODUCTION_SEED}/appSettings.json" >/dev/null \
  || fail "production app settings contain a packaged administrator"
jq -e '
  type == "array"
  and any(.[];
    .settingsKey == "global"
    and ((.adminEmails // []) | length > 0))
  and all(.[];
    all((.adminEmails // [])[];
      test("@[^@]+\\.(local|invalid)$"; "i")))
' "${PACKAGED_DEMO_SEED}/appSettings.json" >/dev/null \
  || fail "Explore app settings do not use isolated synthetic administrators"
[[ ! -e "${PACKAGED_PRODUCTION_SEED}/communityProviders.json" ]] \
  || fail "production social/community URLs were embedded instead of remaining operator-managed"
if grep -RIEiq \
    -- 'https?://([^/"[:space:]]+\.)?(facebook\.com|instagram\.com|linkedin\.com|x\.com|twitter\.com|tiktok\.com|youtube\.com|discord\.(com|gg)|discourse\.[^/"[:space:]]+)/[^/"[:space:]][^"[:space:]]*' \
    "${PACKAGED_PRODUCTION_SEED}"; then
  fail "a deployment-specific social-page URL was embedded in the production seed"
fi
consumer_email_pattern='[[:alnum:]._%+-]+@(gmail\.com|googlemail\.com|outlook\.com|hotmail\.com|live\.com|yahoo\.[[:alpha:].]+|icloud\.com|me\.com|proton(mail)?\.com)'
personal_social_pattern='https?://([^/"[:space:]]+\.)?(instagram\.com/[^/"[:space:]][^"[:space:]]*|facebook\.com/[^/"[:space:]][^"[:space:]]*|youtube\.com/(@|channel/|c/|user/)[^/"[:space:]][^"[:space:]]*)'
if grep -RIl \
    --exclude='*.tar' \
    -E -i -- "${consumer_email_pattern}" \
    "${EXTRACTED}" \
    | grep -q .; then
  fail "a personal deployment email was embedded in the package"
fi
while IFS= read -r candidate_file; do
  if (
    set +o pipefail
    sed \
      -e 's#https://www\.instagram\.com/myscoutee##gI' \
      -e 's#https://www\.facebook\.com/myscoutee##gI' \
      -e 's#https://www\.youtube\.com/@myscoutee##gI' \
      "${candidate_file}" \
      | grep -Eiq -- "${personal_social_pattern}"
  ); then
    fail "a personal social-page URL was embedded in the package"
  fi
done < <(
  grep -RIl \
    --exclude='*.tar' \
    -E -i -- "${personal_social_pattern}" \
    "${EXTRACTED}" \
    || true
)
PACKAGED_COMPOSE="${EXTRACTED}/opt/myscoutee/server/docker-compose-prod.yml"
if grep -Eq '^[[:space:]]*(ADMIN_USER|DEV_USER):' "${PACKAGED_COMPOSE}"; then
  fail "production Compose contains a baked administrator/developer identity"
fi
grep -Fxq 'OPERATOR_USER=' \
  "${EXTRACTED}/opt/myscoutee/packaging/templates/myscoutee.env" \
  || fail "runtime operator bootstrap allow-list is not empty in the package"
grep -Fxq 'OPERATOR_BOOTSTRAP_PASSWORD_SHA256=' \
  "${EXTRACTED}/opt/myscoutee/packaging/templates/myscoutee.secrets.env" \
  || fail "package contains a bootstrap password digest instead of an empty placeholder"
grep -Fxq 'OPERATOR_BOOTSTRAP_EMAIL=' \
  "${EXTRACTED}/opt/myscoutee/packaging/templates/myscoutee.secrets.env" \
  || fail "package contains a bootstrap subject instead of an empty placeholder"

[[ -x "${EXTRACTED}/opt/myscoutee/packaging/scripts/myscoutee-safe-copy.py" ]] \
  || fail "safe-copy helper is not executable"
[[ -x "${EXTRACTED}/opt/myscoutee/packaging/scripts/ensure-operator-bootstrap.sh" ]] \
  || fail "Operator bootstrap helper is not executable"
UPDATE_PATH_UNIT="${EXTRACTED}/lib/systemd/system/myscoutee-update.path"
grep -Fxq \
  'DirectoryNotEmpty=/var/lib/myscoutee/update/inbox/requests' \
  "${UPDATE_PATH_UNIT}" \
  || fail "packaged update path unit does not watch every inbox entry"
if grep -Eq '^[[:space:]]*PathExistsGlob=' "${UPDATE_PATH_UNIT}"; then
  fail "packaged update path unit still filters inbox entries by glob"
fi

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
INVALID_KEY_DIR="${TEST_ROOT}/invalid-configuration"
mkdir "${INVALID_KEY_DIR}"
printf '6%.0s' {1..32} > "${INVALID_KEY_DIR}/deployment-master-key"
printf '\n' >> "${INVALID_KEY_DIR}/deployment-master-key"
printf '6%.0s' {1..32} >> "${INVALID_KEY_DIR}/deployment-master-key"
if MYSCOUTEE_OPERATOR_CONFIGURATION_KEY_DIR="${INVALID_KEY_DIR}" \
  MYSCOUTEE_CONFIGURATION_OWNER_UID="$(id -u)" \
  MYSCOUTEE_CONFIGURATION_OWNER_GID="$(id -g)" \
    "${KEY_HELPER}" >/dev/null 2>&1; then
  fail "operator configuration helper accepted an embedded newline"
fi
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
  client_email="$(jq -r '.client_email // ""' "${REAL_FIREBASE}")"
  if [[ -n "${private_key_id}" ]] \
    && grep -R -Fq -- "${private_key_id}" "${EXTRACTED}"; then
    fail "a real Firebase private-key identifier leaked into package content"
  fi
  if [[ -n "${client_email}" ]] \
    && grep -R -Fq -- "${client_email}" "${EXTRACTED}"; then
    fail "a real Firebase service-account identity leaked into package content"
  fi
fi

SECRETS_TEMPLATE="${EXTRACTED}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"
for external_key in \
  FACEBOOK_APP_SECRET \
  FCM_API_KEY \
  PAYMENT_STRIPE_API_KEY \
  PAYMENT_BARION_API_KEY \
  EMAIL_SENDGRID_API_KEY; do
  external_value="$(
    sed -n "s/^${external_key}=//p" "${SECRETS_TEMPLATE}" | tail -n 1
  )"
  [[ -z "${external_value}" ]] \
    || fail "${external_key} must be supplied after installation, not embedded in the package"
done
if grep -RIl \
  --exclude='*.example' \
  --exclude='audit-package-credentials.sh' \
  --exclude='audit-nested-archive.py' \
  -E -- '-----BEGIN ([A-Z0-9]+ )*PRIVATE KEY-----|-----BEGIN PGP PRIVATE KEY BLOCK-----' \
  "${EXTRACTED}" \
  | grep -q .; then
  fail "private key material was embedded in the package"
fi

AUDIT_FIXTURE="${TEST_ROOT}/credential-audit"
mkdir -p \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates" \
  "${AUDIT_FIXTURE}/opt/myscoutee/server/projects/profile/secrets"
cp \
  "${REPO_ROOT}/packaging/templates/myscoutee.secrets.env" \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"
bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}"

printf '%s\n' '{"type":"service_account","private_key":"test-only"}' \
  > "${AUDIT_FIXTURE}/opt/myscoutee/server/projects/profile/secrets/firebase-service-account.json"
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted an external Firebase service-account file"
fi
rm -f \
  "${AUDIT_FIXTURE}/opt/myscoutee/server/projects/profile/secrets/firebase-service-account.json"

sed -i \
  's/^PAYMENT_STRIPE_API_KEY=.*/PAYMENT_STRIPE_API_KEY=test-only-token/' \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted an embedded external provider token"
fi
cp \
  "${REPO_ROOT}/packaging/templates/myscoutee.secrets.env" \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"

sed -i \
  's/^OPERATOR_BOOTSTRAP_EMAIL=.*/OPERATOR_BOOTSTRAP_EMAIL=operator-aaaaaaaaaaaaaaaaaaaaaaaa@deployment.invalid/' \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a fixed Operator bootstrap subject"
fi
cp \
  "${REPO_ROOT}/packaging/templates/myscoutee.secrets.env" \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"

sed -i \
  's/^MONGO_APP_PASSWORD=.*/MONGO_APP_PASSWORD=fixed-test-only-password/' \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a fixed internal password instead of an install-time placeholder"
fi
cp \
  "${REPO_ROOT}/packaging/templates/myscoutee.secrets.env" \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"

sed -i \
  's/^OPERATOR_BOOTSTRAP_PASSWORD_SHA256=.*/OPERATOR_BOOTSTRAP_PASSWORD_SHA256=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/' \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a fixed Operator bootstrap password digest"
fi
cp \
  "${REPO_ROOT}/packaging/templates/myscoutee.secrets.env" \
  "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/myscoutee.secrets.env"

IMAGE_BUILD="${TEST_ROOT}/image-build"
IMAGE_LAYER_ROOT="${IMAGE_BUILD}/layer-root"
IMAGE_ARCHIVE_DIR="${AUDIT_FIXTURE}/opt/myscoutee/images"
mkdir -p "${IMAGE_LAYER_ROOT}/app" "${IMAGE_ARCHIVE_DIR}"
printf '%s\n' 'safe fixture' > "${IMAGE_LAYER_ROOT}/app/README"
tar -cf "${IMAGE_BUILD}/layer.tar" -C "${IMAGE_LAYER_ROOT}" .
jq -n \
  '{config:{Env:["MONGO_APP_PASSWORD=replace-with-install-generated-password"]}}' \
  > "${IMAGE_BUILD}/config.json"
jq -n \
  '[{Config:"config.json",RepoTags:["test-only:1.0.0"],Layers:["layer.tar"]}]' \
  > "${IMAGE_BUILD}/manifest.json"
tar -cf "${IMAGE_ARCHIVE_DIR}/test-only.tar" \
  -C "${IMAGE_BUILD}" manifest.json config.json layer.tar
bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}"

mkdir -p "${IMAGE_LAYER_ROOT}/run/secrets"
printf '%s\n' '{"type":"service_account","private_key":"test-only"}' \
  > "${IMAGE_LAYER_ROOT}/run/secrets/firebase-service-account.json"
tar -cf "${IMAGE_BUILD}/layer.tar" -C "${IMAGE_LAYER_ROOT}" .
tar -cf "${IMAGE_ARCHIVE_DIR}/test-only.tar" \
  -C "${IMAGE_BUILD}" manifest.json config.json layer.tar
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted an external credential inside a managed image layer"
fi

rm -f "${IMAGE_LAYER_ROOT}/run/secrets/firebase-service-account.json"
python3 -c \
  'import sys, zipfile; z=zipfile.ZipFile(sys.argv[1],"w"); z.writestr("BOOT-INF/classes/firebase-service-account.json", "{}"); z.close()' \
  "${IMAGE_LAYER_ROOT}/app/application.jar"
tar -cf "${IMAGE_BUILD}/layer.tar" -C "${IMAGE_LAYER_ROOT}" .
tar -cf "${IMAGE_ARCHIVE_DIR}/test-only.tar" \
  -C "${IMAGE_BUILD}" manifest.json config.json layer.tar
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted an external credential inside a nested managed-image JAR"
fi

python3 -c \
  'import sys, zipfile; z=zipfile.ZipFile(sys.argv[1],"w"); z.writestr("BOOT-INF/classes/application-prod.yaml", "config:\\n  adminUser: owner@gmail.com\\n"); z.close()' \
  "${IMAGE_LAYER_ROOT}/app/application.jar"
tar -cf "${IMAGE_BUILD}/layer.tar" -C "${IMAGE_LAYER_ROOT}" .
tar -cf "${IMAGE_ARCHIVE_DIR}/test-only.tar" \
  -C "${IMAGE_BUILD}" manifest.json config.json layer.tar
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a personal admin identity inside a managed-image JAR"
fi

python3 -c \
  'import sys, zipfile; z=zipfile.ZipFile(sys.argv[1],"w"); z.writestr("BOOT-INF/classes/application-prod.yaml", "landing:\\n  social: https://instagram.com/private-demo-owner\\n"); z.close()' \
  "${IMAGE_LAYER_ROOT}/app/application.jar"
tar -cf "${IMAGE_BUILD}/layer.tar" -C "${IMAGE_LAYER_ROOT}" .
tar -cf "${IMAGE_ARCHIVE_DIR}/test-only.tar" \
  -C "${IMAGE_BUILD}" manifest.json config.json layer.tar
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a personal social-page URL inside a managed-image JAR"
fi

python3 -c \
  'import sys, zipfile; z=zipfile.ZipFile(sys.argv[1],"w"); z.writestr("BOOT-INF/classes/application-prod.yaml", "config:\\n  operator-bootstrap-password-sha256: ${OPERATOR_BOOTSTRAP_PASSWORD_SHA256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}\\n"); z.close()' \
  "${IMAGE_LAYER_ROOT}/app/application.jar"
tar -cf "${IMAGE_BUILD}/layer.tar" -C "${IMAGE_LAYER_ROOT}" .
tar -cf "${IMAGE_ARCHIVE_DIR}/test-only.tar" \
  -C "${IMAGE_BUILD}" manifest.json config.json layer.tar
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a fixed Operator bootstrap digest inside a managed-image JAR"
fi

python3 -c \
  'import sys, zipfile; z=zipfile.ZipFile(sys.argv[1],"w"); z.writestr("BOOT-INF/classes/application-prod.yaml", "config:\\n  operator-bootstrap-email: ${OPERATOR_BOOTSTRAP_EMAIL:operator-aaaaaaaaaaaaaaaaaaaaaaaa@deployment.invalid}\\n"); z.close()' \
  "${IMAGE_LAYER_ROOT}/app/application.jar"
tar -cf "${IMAGE_BUILD}/layer.tar" -C "${IMAGE_LAYER_ROOT}" .
tar -cf "${IMAGE_ARCHIVE_DIR}/test-only.tar" \
  -C "${IMAGE_BUILD}" manifest.json config.json layer.tar
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a fixed Operator bootstrap subject inside a managed-image JAR"
fi
rm -rf "${IMAGE_ARCHIVE_DIR}" "${IMAGE_BUILD}"

printf '%s\n' \
  '-----BEGIN PRIVATE KEY-----' \
  'test-only-not-a-real-key' \
  '-----END PRIVATE KEY-----' \
  > "${AUDIT_FIXTURE}/opt/myscoutee/server/projects/profile/secrets/provider-key.pem"
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted embedded private-key material"
fi
rm -f \
  "${AUDIT_FIXTURE}/opt/myscoutee/server/projects/profile/secrets/provider-key.pem"

printf '%s\n' 'https://facebook.com/private-demo-owner' \
  > "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/personal-social.txt"
if bash "${CREDENTIAL_AUDIT}" "${AUDIT_FIXTURE}" >/dev/null 2>&1; then
  fail "credential audit accepted a personal social-page URL"
fi
rm -f "${AUDIT_FIXTURE}/opt/myscoutee/packaging/templates/personal-social.txt"

PACKAGED_APP_SETTINGS="${PACKAGED_PRODUCTION_SEED}/appSettings.json"
cp "${PACKAGED_APP_SETTINGS}" "${TEST_ROOT}/appSettings.safe.json"
jq 'map(if .settingsKey == "global" then .adminEmails = ["owner@gmail.com"] else . end)' \
  "${TEST_ROOT}/appSettings.safe.json" > "${PACKAGED_APP_SETTINGS}"
if bash "${CREDENTIAL_AUDIT}" "${EXTRACTED}" >/dev/null 2>&1; then
  fail "credential audit accepted a personal production administrator seed"
fi
mv "${TEST_ROOT}/appSettings.safe.json" "${PACKAGED_APP_SETTINGS}"

printf '[]\n' > "${PACKAGED_PRODUCTION_SEED}/users.json"
if bash "${CREDENTIAL_AUDIT}" "${EXTRACTED}" >/dev/null 2>&1; then
  fail "credential audit accepted a production user fixture"
fi
rm -f "${PACKAGED_PRODUCTION_SEED}/users.json"

printf '%s\n' \
  '[{"_id":"personal-social","url":"https://linkedin.com/in/private-owner"}]' \
  > "${PACKAGED_PRODUCTION_SEED}/communityProviders.json"
if bash "${CREDENTIAL_AUDIT}" "${EXTRACTED}" >/dev/null 2>&1; then
  fail "credential audit accepted a personal production social-page seed"
fi
rm -f "${PACKAGED_PRODUCTION_SEED}/communityProviders.json"

if MYSCOUTEE_VERSION=1.0.0-prod \
  MYSCOUTEE_DIST_DIR="${TEST_ROOT}/invalid-dist" \
  BUILD_ARTIFACTS=false \
  PACKAGE_IMAGES=false \
  ALLOW_UNBUNDLED_IMAGES_FOR_TESTS=true \
  bash "${PACKAGE_SCRIPT}" >/dev/null 2>&1; then
  fail "suffixed Debian package version was accepted"
fi

echo "package content tests passed"
