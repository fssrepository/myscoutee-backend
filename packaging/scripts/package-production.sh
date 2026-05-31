#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
SERVER_DIR="${REPO_ROOT}/server"
DIST_DIR="${REPO_ROOT}/packaging/dist"
STAGING_DIR="${DIST_DIR}/deb-root"

read_version() {
  sed -n 's/^MYSCOUTEE_VERSION=//p' "${SERVER_DIR}/.env" | head -n 1
}

VERSION="${MYSCOUTEE_VERSION:-$(read_version)}"
VERSION="${VERSION:-1.0.0}"
ARCHITECTURE="${DEB_ARCHITECTURE:-amd64}"
PACKAGE_NAME="myscoutee_${VERSION}_${ARCHITECTURE}"
DEB_PATH="${DIST_DIR}/${PACKAGE_NAME}.deb"

export MYSCOUTEE_VERSION="${VERSION}"
export NGINX_BASE_IMAGE="${NGINX_BASE_IMAGE:-myscoutee-nginx:${VERSION}-base}"
export NGINX_PRODUCTION_IMAGE="${NGINX_PRODUCTION_IMAGE:-myscoutee-nginx:${VERSION}-prod}"
export MYSCOUTEE_PRODUCTION_IMAGE="${MYSCOUTEE_PRODUCTION_IMAGE:-myscoutee-api:${VERSION}-prod}"

if [[ "${BUILD_ARTIFACTS:-true}" == "true" ]]; then
  bash "${SCRIPT_DIR}/build-production.sh"
fi

rm -rf "${STAGING_DIR}" "${DEB_PATH}"
install -d "${STAGING_DIR}/DEBIAN"
install -d "${STAGING_DIR}/opt/myscoutee/server/docker/conf"
install -d "${STAGING_DIR}/opt/myscoutee/server/docker/scripts"
install -d "${STAGING_DIR}/opt/myscoutee/server/projects/profile/secrets"
install -d "${STAGING_DIR}/opt/myscoutee/packaging"
install -d "${STAGING_DIR}/opt/myscoutee/images"
install -d "${STAGING_DIR}/lib/systemd/system"

sed \
  -e "s/^Version:.*/Version: ${VERSION}/" \
  -e "s/^Architecture:.*/Architecture: ${ARCHITECTURE}/" \
  "${REPO_ROOT}/packaging/debian/control" > "${STAGING_DIR}/DEBIAN/control"
install -m 0755 "${REPO_ROOT}/packaging/debian/postinst" "${STAGING_DIR}/DEBIAN/postinst"
install -m 0755 "${REPO_ROOT}/packaging/debian/prerm" "${STAGING_DIR}/DEBIAN/prerm"
install -m 0755 "${REPO_ROOT}/packaging/debian/postrm" "${STAGING_DIR}/DEBIAN/postrm"

install -m 0644 "${REPO_ROOT}/packaging/compose/docker-compose.production.yml" "${STAGING_DIR}/opt/myscoutee/server/docker-compose-prod.yml"
install -m 0644 "${REPO_ROOT}/packaging/compose/docker-compose.production-replicaset.yml" "${STAGING_DIR}/opt/myscoutee/server/docker-compose.replicaset.yml"
install -m 0644 "${SERVER_DIR}/projects/profile/secrets/README.md" "${STAGING_DIR}/opt/myscoutee/server/projects/profile/secrets/README.md"
install -m 0644 "${SERVER_DIR}/projects/profile/secrets/firebase-service-account.json.example" "${STAGING_DIR}/opt/myscoutee/server/projects/profile/secrets/firebase-service-account.json.example"
cp -a "${SERVER_DIR}/docker/conf/mongodb" "${STAGING_DIR}/opt/myscoutee/server/docker/conf/"
cp -a "${SERVER_DIR}/docker/scripts/." "${STAGING_DIR}/opt/myscoutee/server/docker/scripts/"
cp -a "${REPO_ROOT}/packaging/scripts" "${STAGING_DIR}/opt/myscoutee/packaging/"
cp -a "${REPO_ROOT}/packaging/templates" "${STAGING_DIR}/opt/myscoutee/packaging/"
install -m 0644 "${REPO_ROOT}/packaging/systemd/myscoutee.service" "${STAGING_DIR}/lib/systemd/system/myscoutee.service"

sed \
  -e "s/^MYSCOUTEE_VERSION=.*/MYSCOUTEE_VERSION=${VERSION}/" \
  -e "s/^NGINX_BASE_IMAGE=.*/NGINX_BASE_IMAGE=myscoutee-nginx:${VERSION}-base/" \
  -e "s/^NGINX_PRODUCTION_IMAGE=.*/NGINX_PRODUCTION_IMAGE=myscoutee-nginx:${VERSION}-prod/" \
  -e "s/^MYSCOUTEE_PRODUCTION_IMAGE=.*/MYSCOUTEE_PRODUCTION_IMAGE=myscoutee-api:${VERSION}-prod/" \
  -i "${STAGING_DIR}/opt/myscoutee/packaging/templates/myscoutee.env"

find "${STAGING_DIR}" -type d -exec chmod 0755 {} +
find "${STAGING_DIR}" -type f -exec chmod 0644 {} +
chmod 0755 "${STAGING_DIR}/DEBIAN/postinst" "${STAGING_DIR}/DEBIAN/prerm" "${STAGING_DIR}/DEBIAN/postrm"
find "${STAGING_DIR}/opt/myscoutee/packaging/scripts" -type f -name "*.sh" -exec chmod 0755 {} +
find "${STAGING_DIR}/opt/myscoutee/server/docker" -type f -name "*.sh" -exec chmod 0755 {} +

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

if [[ "${PACKAGE_IMAGES:-true}" == "true" ]]; then
  save_image "${NGINX_BASE_IMAGE}" "myscoutee-nginx-${VERSION}-base"
  save_image "${NGINX_PRODUCTION_IMAGE}" "myscoutee-nginx-${VERSION}-prod"
  save_image "${MYSCOUTEE_PRODUCTION_IMAGE}" "myscoutee-api-${VERSION}-prod"
fi

if [[ "${PACKAGE_OFFICIAL_IMAGES:-false}" == "true" ]]; then
  save_image "${MONGO_IMAGE:-mongo:8.0.4}" "mongo" true
  save_image "${REDIS_IMAGE:-redis:8.6.1-alpine}" "redis" true
  save_image "${MINIO_IMAGE:-minio/minio:RELEASE.2025-09-07T16-13-09Z}" "minio" true
fi

if ! command -v dpkg-deb >/dev/null 2>&1; then
  echo "dpkg-deb is required to build the Debian package." >&2
  exit 1
fi

dpkg-deb --root-owner-group --build "${STAGING_DIR}" "${DEB_PATH}"
echo "${DEB_PATH}"
