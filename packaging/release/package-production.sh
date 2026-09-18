#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
SERVER_DIR="${REPO_ROOT}/server"
DIST_DIR="${MYSCOUTEE_DIST_DIR:-${REPO_ROOT}/packaging/dist}"
STAGING_DIR="${DIST_DIR}/deb-root"

read_version() {
  sed -n 's/^MYSCOUTEE_VERSION=//p' "${SERVER_DIR}/.env" | head -n 1
}

VERSION="${MYSCOUTEE_VERSION:-$(read_version)}"
VERSION="${VERSION:-1.0.0}"
ARCHITECTURE="${DEB_ARCHITECTURE:-amd64}"
DEBIAN_VERSION="${VERSION/-/\~}"
if [[ ! "${VERSION}" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-qa\.[1-9][0-9]*)?$ ]] \
  || ! dpkg --validate-version "${DEBIAN_VERSION}" >/dev/null 2>&1; then
  echo "MYSCOUTEE_VERSION must be a SemVer core or QA prerelease such as 1.0.0-qa.1." >&2
  exit 1
fi
if [[ ! "${ARCHITECTURE}" =~ ^[a-z0-9][a-z0-9-]{0,31}$ ]]; then
  echo "DEB_ARCHITECTURE is invalid." >&2
  exit 1
fi
PACKAGE_NAME="myscoutee_${VERSION}_${ARCHITECTURE}"
DEB_PATH="${DIST_DIR}/${PACKAGE_NAME}.deb"
DEB_PARTIAL_PATH="${DIST_DIR}/${PACKAGE_NAME}.partial.deb"
CLIENT_TOOLS_ARCHIVE="${DIST_DIR}/myscoutee-client-tools_${VERSION}.tar.gz"
IMAGE_FINGERPRINT_HELPER="${REPO_ROOT}/packaging/scripts/image-content-fingerprint.sh"

export MYSCOUTEE_VERSION="${VERSION}"
export NGINX_BASE_IMAGE="${NGINX_BASE_IMAGE:-myscoutee-nginx:${VERSION}-base}"
export NGINX_PRODUCTION_IMAGE="${NGINX_PRODUCTION_IMAGE:-myscoutee-nginx:${VERSION}-prod}"
export MYSCOUTEE_PRODUCTION_IMAGE="${MYSCOUTEE_PRODUCTION_IMAGE:-myscoutee-api:${VERSION}-prod}"
export MINIO_PRODUCTION_IMAGE="${MINIO_PRODUCTION_IMAGE:-myscoutee-minio:${VERSION}-prod}"
export REGISTRY_DEMO_IMAGE="${REGISTRY_DEMO_IMAGE:-myscoutee-registry:${VERSION}-prod}"
export PAYMENT_SIMULATOR_IMAGE="${PAYMENT_SIMULATOR_IMAGE:-myscoutee-payment-simulator:${VERSION}-prod}"
if [[ "${NGINX_BASE_IMAGE}" != "myscoutee-nginx:${VERSION}-base" \
  || "${NGINX_PRODUCTION_IMAGE}" != "myscoutee-nginx:${VERSION}-prod" \
  || "${MYSCOUTEE_PRODUCTION_IMAGE}" != "myscoutee-api:${VERSION}-prod" \
  || "${MINIO_PRODUCTION_IMAGE}" != "myscoutee-minio:${VERSION}-prod" \
  || "${REGISTRY_DEMO_IMAGE}" != "myscoutee-registry:${VERSION}-prod" \
  || "${PAYMENT_SIMULATOR_IMAGE}" != "myscoutee-payment-simulator:${VERSION}-prod" ]]; then
  echo "Release packages require the canonical version-derived managed image tags." >&2
  exit 1
fi

if [[ "${BUILD_ARTIFACTS:-true}" == "true" ]]; then
  bash "${SCRIPT_DIR}/build-production.sh"
fi

rm -rf "${STAGING_DIR}" "${DEB_PARTIAL_PATH}"
install -d "${STAGING_DIR}/DEBIAN"
install -d "${STAGING_DIR}/opt/myscoutee/server/docker/conf"
install -d "${STAGING_DIR}/opt/myscoutee/server/docker/scripts"
install -d "${STAGING_DIR}/opt/myscoutee/server/projects/profile/secrets"
install -d "${STAGING_DIR}/opt/myscoutee/packaging"
install -d "${STAGING_DIR}/opt/myscoutee/packaging/update"
install -d "${STAGING_DIR}/opt/myscoutee/images"
install -d "${STAGING_DIR}/lib/systemd/system"
install -d "${STAGING_DIR}/usr/share/myscoutee"

sed \
  -e "s/^Version:.*/Version: ${DEBIAN_VERSION}/" \
  -e "s/^Architecture:.*/Architecture: ${ARCHITECTURE}/" \
  "${REPO_ROOT}/packaging/debian/control" > "${STAGING_DIR}/DEBIAN/control"
install -m 0755 "${REPO_ROOT}/packaging/debian/postinst" "${STAGING_DIR}/DEBIAN/postinst"
install -m 0755 "${REPO_ROOT}/packaging/debian/prerm" "${STAGING_DIR}/DEBIAN/prerm"
install -m 0755 "${REPO_ROOT}/packaging/debian/postrm" "${STAGING_DIR}/DEBIAN/postrm"

install -m 0644 "${REPO_ROOT}/packaging/compose/docker-compose.production.yml" "${STAGING_DIR}/opt/myscoutee/server/docker-compose-prod.yml"
install -m 0644 "${REPO_ROOT}/packaging/compose/docker-compose.production-replicaset.yml" "${STAGING_DIR}/opt/myscoutee/server/docker-compose.replicaset.yml"
install -m 0644 "${SERVER_DIR}/projects/profile/secrets/README.md" "${STAGING_DIR}/opt/myscoutee/server/projects/profile/secrets/README.md"
install -m 0644 "${SERVER_DIR}/projects/profile/secrets/firebase-service-account.json.example" "${STAGING_DIR}/opt/myscoutee/server/projects/profile/secrets/firebase-service-account.json.example"
# Credentials are deployment input, never package content. The operator
# provisions the real service-account file after installation through the
# protected deployment configuration path.

stage_mongo_configuration() {
  local source_root="${SERVER_DIR}/docker/conf/mongodb"
  local target_root="${STAGING_DIR}/opt/myscoutee/server/docker/conf/mongodb"
  local demo_source="${source_root}/demo_db"
  local demo_target="${target_root}/demo_db"
  local production_source="${source_root}/myscoutee_db"
  local production_target="${target_root}/myscoutee_db"
  local seed_rule collection source_file demo_file demo_admin_emails
  local production_identity_seed
  local -a production_collections=()

  install -d "${target_root}" "${demo_target}" "${production_target}"

  # Only the Mongo initializer itself is shared. Development/E2E databases and
  # runtime user collections are not release-package input.
  while IFS= read -r source_file; do
    install -m 0644 "${source_file}" "${target_root}/$(basename "${source_file}")"
  done < <(find "${source_root}" -maxdepth 1 -type f | sort)
  chmod 0755 "${target_root}/mongo_import.sh"

  for production_identity_seed in \
    "${production_source}/adminUsers.json" \
    "${production_source}/users.json"; do
    if ! jq -e 'type == "array" and length == 0' \
        "${production_identity_seed}" >/dev/null; then
      echo "Production identity seeds must remain empty; operators are provisioned after installation." >&2
      exit 1
    fi
  done

  # The bundled Explore database is isolated demo state. Derive its admin
  # allow-list only from explicitly synthetic demo users, never from a
  # developer/vendor address present in a source checkout.
  demo_admin_emails="$(
    jq -c '
      [
        .[]
        | select(
            (._id | type) == "string"
            and (._id | startswith("admin-demo-")))
        | (.email // "")
        | select(test("@[^@]+\\.(local|invalid)$"; "i"))
      ]
      | unique
    ' "${demo_source}/users.json"
  )"
  if ! jq -e 'type == "array" and length > 0' \
      <<< "${demo_admin_emails}" >/dev/null; then
    echo "Explore seed has no explicitly synthetic demo administrators." >&2
    exit 1
  fi
  while IFS= read -r demo_file; do
    if [[ "$(basename "${demo_file}")" == "appSettings.json" ]]; then
      jq --argjson adminEmails "${demo_admin_emails}" '
        map(
          if .settingsKey == "global"
          then .adminEmails = $adminEmails
          else .
          end
        )
      ' "${demo_file}" > "${demo_target}/appSettings.json"
    else
      install -m 0644 "${demo_file}" "${demo_target}/$(basename "${demo_file}")"
    fi
  done < <(find "${demo_source}" -maxdepth 1 -type f -name '*.json' | sort)

  # The production database receives only the system/configuration collections
  # declared in the packaged allow-list. In particular, users, adminUsers,
  # activity, chat, payment, and other deployment/runtime records are absent
  # from the .deb even though a developer checkout may contain fixtures.
  seed_rule="$(
    sed -n 's/^MONGO_IMPORT_ALLOWED_COLLECTIONS_BY_DB=//p' \
      "${REPO_ROOT}/packaging/templates/myscoutee.env" \
      | tr ';' '\n' \
      | sed -n 's/^production_db://p' \
      | tail -n 1
  )"
  if [[ -z "${seed_rule}" || "${seed_rule}" == *"*"* ]]; then
    echo "Production Mongo seed allow-list must be explicit and non-empty." >&2
    exit 1
  fi
  IFS=',' read -r -a production_collections <<< "${seed_rule}"
  for collection in "${production_collections[@]}"; do
    if [[ ! "${collection}" =~ ^[A-Za-z][A-Za-z0-9_]*$ ]]; then
      echo "Invalid production seed collection: ${collection}" >&2
      exit 1
    fi
    source_file="${production_source}/${collection}.json"
    if [[ ! -f "${source_file}" ]]; then
      echo "Missing production system seed: ${source_file}" >&2
      exit 1
    fi
    if [[ "${collection}" == "appSettings" ]]; then
      # Admin authorization is mutable deployment state configured by the
      # authenticated operator. A release never nominates an administrator.
      jq '
        map(
          if .settingsKey == "global"
          then .adminEmails = []
          else .
          end
        )
      ' "${source_file}" > "${production_target}/appSettings.json"
    else
      install -m 0644 "${source_file}" "${production_target}/${collection}.json"
    fi
  done
}

python3 "${REPO_ROOT}/tools/seeds/check-system-seed-parity.py"
node "${REPO_ROOT}/frontend/scripts/audit-i18n-mongo-seed.js"
stage_mongo_configuration
while IFS= read -r runtime_script_path; do
  cp -a "${runtime_script_path}" "${STAGING_DIR}/opt/myscoutee/server/docker/scripts/"
done < <(
  find "${SERVER_DIR}/docker/scripts" \
    -mindepth 1 \
    -maxdepth 1 \
    ! -name "admin-job-fixtures" \
    ! -name "manual-qa-checkpoints" \
    ! -name "start_profilemanagement_dev.sh" \
    ! -name "frontend_auto_watch.sh" \
    -print \
    | sort
)
# Only deployment-host runtime scripts are installed. Everything in
# packaging/release and repository developer helpers stays source-only.
cp -a "${REPO_ROOT}/packaging/scripts" "${STAGING_DIR}/opt/myscoutee/packaging/"
cp -a "${REPO_ROOT}/packaging/migrations" "${STAGING_DIR}/opt/myscoutee/packaging/"
cp -a "${REPO_ROOT}/packaging/templates" "${STAGING_DIR}/opt/myscoutee/packaging/"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee.service" "${STAGING_DIR}/lib/systemd/system/myscoutee.service"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-update.path" "${STAGING_DIR}/lib/systemd/system/myscoutee-update.path"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-update.service" "${STAGING_DIR}/lib/systemd/system/myscoutee-update.service"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-update-status.socket" "${STAGING_DIR}/lib/systemd/system/myscoutee-update-status.socket"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-update-status.service" "${STAGING_DIR}/lib/systemd/system/myscoutee-update-status.service"
install -d "${STAGING_DIR}/usr/lib/sysusers.d"
install -m 0644 "${REPO_ROOT}/packaging/sysusers/myscoutee.conf" "${STAGING_DIR}/usr/lib/sysusers.d/myscoutee.conf"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-tls.path" "${STAGING_DIR}/lib/systemd/system/myscoutee-tls.path"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-tls.service" "${STAGING_DIR}/lib/systemd/system/myscoutee-tls.service"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-tls-renew.service" "${STAGING_DIR}/lib/systemd/system/myscoutee-tls-renew.service"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee-tls-renew.timer" "${STAGING_DIR}/lib/systemd/system/myscoutee-tls-renew.timer"
install -m 0644 "${REPO_ROOT}/packaging/templates/update-release-key.README" "${STAGING_DIR}/opt/myscoutee/packaging/update/README"
printf '%s\n' "${VERSION}" > "${STAGING_DIR}/opt/myscoutee/packaging/VERSION"

sed \
  -e "s/^MYSCOUTEE_VERSION=.*/MYSCOUTEE_VERSION=${VERSION}/" \
  -e "s/^NGINX_BASE_IMAGE=.*/NGINX_BASE_IMAGE=myscoutee-nginx:${VERSION}-base/" \
  -e "s/^NGINX_PRODUCTION_IMAGE=.*/NGINX_PRODUCTION_IMAGE=myscoutee-nginx:${VERSION}-prod/" \
  -e "s/^MYSCOUTEE_PRODUCTION_IMAGE=.*/MYSCOUTEE_PRODUCTION_IMAGE=myscoutee-api:${VERSION}-prod/" \
  -e "s/^MINIO_PRODUCTION_IMAGE=.*/MINIO_PRODUCTION_IMAGE=myscoutee-minio:${VERSION}-prod/" \
  -e "s/^REGISTRY_DEMO_IMAGE=.*/REGISTRY_DEMO_IMAGE=myscoutee-registry:${VERSION}-prod/" \
  -e "s/^PAYMENT_SIMULATOR_IMAGE=.*/PAYMENT_SIMULATOR_IMAGE=myscoutee-payment-simulator:${VERSION}-prod/" \
  -i "${STAGING_DIR}/opt/myscoutee/packaging/templates/myscoutee.env"

save_image() {
  local image_name="$1"
  local archive_name="$2"
  local pull_if_missing="${3:-false}"

  if ! docker image inspect "${image_name}" >/dev/null 2>&1; then
    if [[ "${pull_if_missing}" == "true" ]]; then
      docker pull "${image_name}"
    fi
  fi

  if ! docker image inspect "${image_name}" >/dev/null 2>&1; then
    echo "Missing Docker image: ${image_name}" >&2
    echo "Run with BUILD_ARTIFACTS=true or build the image before packaging." >&2
    exit 1
  fi

  docker save -o "${STAGING_DIR}/opt/myscoutee/images/${archive_name}.tar" "${image_name}"
}

image_id() {
  local image_name="$1"
  local value

  value="$(docker image inspect --format '{{.Id}}' "${image_name}")"
  if [[ ! "${value}" =~ ^sha256:[0-9a-f]{64}$ ]]; then
    echo "Docker returned an invalid image ID for ${image_name}." >&2
    exit 1
  fi
  printf '%s' "${value}"
}

image_content_fingerprint() {
  local image_name="$1"
  local value

  value="$(bash "${IMAGE_FINGERPRINT_HELPER}" docker "${image_name}")"
  if [[ ! "${value}" =~ ^sha256:[0-9a-f]{64}$ ]]; then
    echo "Could not fingerprint Docker image ${image_name}." >&2
    exit 1
  fi
  printf '%s' "${value}"
}

if [[ "${PACKAGE_IMAGES:-true}" == "true" ]]; then
  save_image "${NGINX_BASE_IMAGE}" "myscoutee-nginx-${VERSION}-base"
  save_image "${NGINX_PRODUCTION_IMAGE}" "myscoutee-nginx-${VERSION}-prod"
  save_image "${MYSCOUTEE_PRODUCTION_IMAGE}" "myscoutee-api-${VERSION}-prod"
  save_image "${MINIO_PRODUCTION_IMAGE}" "myscoutee-minio-${VERSION}-prod"
  save_image "${REGISTRY_DEMO_IMAGE}" "myscoutee-registry-${VERSION}-prod"
  save_image "${PAYMENT_SIMULATOR_IMAGE}" "myscoutee-payment-simulator-${VERSION}-prod"
  jq -n \
    --arg releaseVersion "${VERSION}" \
    --arg nginxBaseReference "${NGINX_BASE_IMAGE}" \
    --arg nginxBaseId "$(image_id "${NGINX_BASE_IMAGE}")" \
    --arg nginxBaseFingerprint "$(image_content_fingerprint "${NGINX_BASE_IMAGE}")" \
    --arg nginxReference "${NGINX_PRODUCTION_IMAGE}" \
    --arg nginxId "$(image_id "${NGINX_PRODUCTION_IMAGE}")" \
    --arg nginxFingerprint "$(image_content_fingerprint "${NGINX_PRODUCTION_IMAGE}")" \
    --arg apiReference "${MYSCOUTEE_PRODUCTION_IMAGE}" \
    --arg apiId "$(image_id "${MYSCOUTEE_PRODUCTION_IMAGE}")" \
    --arg apiFingerprint "$(image_content_fingerprint "${MYSCOUTEE_PRODUCTION_IMAGE}")" \
    --arg minioReference "${MINIO_PRODUCTION_IMAGE}" \
    --arg minioId "$(image_id "${MINIO_PRODUCTION_IMAGE}")" \
    --arg minioFingerprint "$(image_content_fingerprint "${MINIO_PRODUCTION_IMAGE}")" \
    --arg registryDemoReference "${REGISTRY_DEMO_IMAGE}" \
    --arg registryDemoId "$(image_id "${REGISTRY_DEMO_IMAGE}")" \
    --arg registryDemoFingerprint "$(image_content_fingerprint "${REGISTRY_DEMO_IMAGE}")" \
    --arg paymentSimulatorReference "${PAYMENT_SIMULATOR_IMAGE}" \
    --arg paymentSimulatorId "$(image_id "${PAYMENT_SIMULATOR_IMAGE}")" \
    --arg paymentSimulatorFingerprint "$(image_content_fingerprint "${PAYMENT_SIMULATOR_IMAGE}")" \
    '{
      schemaVersion: 1,
      releaseVersion: $releaseVersion,
      bundled: true,
      images: [
        {
          service: "nginx-base",
          container: null,
          reference: $nginxBaseReference,
          imageId: $nginxBaseId,
          contentFingerprint: $nginxBaseFingerprint
        },
        {
          service: "nginx",
          container: "nginx",
          reference: $nginxReference,
          imageId: $nginxId,
          contentFingerprint: $nginxFingerprint
        },
        {
          service: "profilemanagement",
          container: "myscoutee",
          reference: $apiReference,
          imageId: $apiId,
          contentFingerprint: $apiFingerprint
        },
        {
          service: "minio",
          container: "minio",
          reference: $minioReference,
          imageId: $minioId,
          contentFingerprint: $minioFingerprint
        },
        {
          service: "registry-demo",
          container: "registry-demo",
          reference: $registryDemoReference,
          imageId: $registryDemoId,
          contentFingerprint: $registryDemoFingerprint
        },
        {
          service: "payment-simulator",
          container: "payment-simulator",
          reference: $paymentSimulatorReference,
          imageId: $paymentSimulatorId,
          contentFingerprint: $paymentSimulatorFingerprint
        }
      ]
    }' > "${STAGING_DIR}/opt/myscoutee/packaging/IMAGE-MANIFEST.json"
elif [[ "${ALLOW_UNBUNDLED_IMAGES_FOR_TESTS:-false}" == "true" ]]; then
  jq -n \
    --arg releaseVersion "${VERSION}" \
    '{
      schemaVersion: 1,
      releaseVersion: $releaseVersion,
      bundled: false,
      images: []
    }' > "${STAGING_DIR}/opt/myscoutee/packaging/IMAGE-MANIFEST.json"
else
  echo "Release packages must bundle their managed images." >&2
  echo "Set ALLOW_UNBUNDLED_IMAGES_FOR_TESTS=true only for package-content tests." >&2
  exit 1
fi

if [[ "${PACKAGE_OFFICIAL_IMAGES:-false}" == "true" ]]; then
  save_image "${MONGO_IMAGE:-mongo:8.0.4}" "mongo" true
  save_image "${REDIS_IMAGE:-redis:8.6.1-alpine}" "redis" true
fi

if ! command -v dpkg-deb >/dev/null 2>&1; then
  echo "dpkg-deb is required to build the Debian package." >&2
  exit 1
fi

find "${STAGING_DIR}" -type d -exec chmod 0755 {} +
find "${STAGING_DIR}" -type f -exec chmod 0644 {} +
chmod 0755 \
  "${STAGING_DIR}/DEBIAN/postinst" \
  "${STAGING_DIR}/DEBIAN/prerm" \
  "${STAGING_DIR}/DEBIAN/postrm"
find "${STAGING_DIR}/opt/myscoutee/packaging/scripts" \
  -type f \( -name "*.sh" -o -name "*.py" \) -exec chmod 0755 {} +
find "${STAGING_DIR}/opt/myscoutee/server/docker" \
  -type f -name "*.sh" -exec chmod 0755 {} +
# The same standalone builder is used for helper-only releases and full DEBs.
MYSCOUTEE_VERSION="${VERSION}" MYSCOUTEE_DIST_DIR="${DIST_DIR}" \
  bash "${SCRIPT_DIR}/package-client-tools.sh"

install -m 0644 \
  "${CLIENT_TOOLS_ARCHIVE}" \
  "${STAGING_DIR}/usr/share/myscoutee/$(basename "${CLIENT_TOOLS_ARCHIVE}")"

bash "${SCRIPT_DIR}/audit-package-credentials.sh" "${STAGING_DIR}"

dpkg-deb --root-owner-group --build \
  "${STAGING_DIR}" \
  "${DEB_PARTIAL_PATH}"
dpkg-deb --info "${DEB_PARTIAL_PATH}" >/dev/null
mv -f "${DEB_PARTIAL_PATH}" "${DEB_PATH}"
chmod 0644 "${DEB_PATH}"
echo "Operator client tools: ${CLIENT_TOOLS_ARCHIVE}" >&2
echo "${DEB_PATH}"
