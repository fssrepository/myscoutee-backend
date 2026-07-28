#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
SERVER_DIR="${REPO_ROOT}/server"
FRONTEND_DIR="${REPO_ROOT}/frontend"

read_version() {
  sed -n 's/^MYSCOUTEE_VERSION=//p' "${SERVER_DIR}/.env" | head -n 1
}

VERSION="${MYSCOUTEE_VERSION:-$(read_version)}"
VERSION="${VERSION:-1.0.0}"
if [[ ! "${VERSION}" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]; then
  echo "MYSCOUTEE_VERSION must be a plain SemVer core such as 1.0.0." >&2
  exit 1
fi

export MYSCOUTEE_VERSION="${VERSION}"
export NGINX_BASE_IMAGE="${NGINX_BASE_IMAGE:-myscoutee-nginx:${VERSION}-base}"
export NGINX_PRODUCTION_IMAGE="${NGINX_PRODUCTION_IMAGE:-myscoutee-nginx:${VERSION}-prod}"
export MYSCOUTEE_PRODUCTION_IMAGE="${MYSCOUTEE_PRODUCTION_IMAGE:-myscoutee-api:${VERSION}-prod}"
export MINIO_PRODUCTION_IMAGE="${MINIO_PRODUCTION_IMAGE:-myscoutee-minio:${VERSION}-prod}"

BUILD_FRONTEND="${BUILD_FRONTEND:-true}"
BUILD_BACKEND="${BUILD_BACKEND:-true}"
BUILD_IMAGES="${BUILD_IMAGES:-true}"
FRONTEND_BUILD_SCRIPT="${FRONTEND_BUILD_SCRIPT:-build:prod}"

if [[ "${BUILD_FRONTEND}" == "true" ]]; then
  (cd "${FRONTEND_DIR}" && npm run "${FRONTEND_BUILD_SCRIPT}")
  (cd "${REPO_ROOT}" && bash server/docker/scripts/sync_frontend_assets.sh prod)
fi

if [[ "${BUILD_BACKEND}" == "true" ]]; then
  (cd "${SERVER_DIR}" && ./gradlew :projects:profile:bootJar)
fi

if [[ "${BUILD_IMAGES}" == "true" ]]; then
  docker build \
    -f "${SERVER_DIR}/docker/images/nginx/base/Dockerfile" \
    -t "${NGINX_BASE_IMAGE}" \
    "${SERVER_DIR}/docker"

  (cd "${SERVER_DIR}" && docker compose -f docker-compose-prod.yml build)
fi

echo "Built MyScoutee production artifacts for version ${VERSION}."
