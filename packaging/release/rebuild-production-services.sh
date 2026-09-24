#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  exec bash "$0" "$@"
fi

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
SERVER_DIR="${MYSCOUTEE_SERVER_DIR:-${REPO_ROOT}/server}"
FRONTEND_DIR="${MYSCOUTEE_FRONTEND_DIR:-${REPO_ROOT}/frontend}"

PRIVATE_BUILD_SERVICES=(profilemanagement nginx minio payment-simulator)
PRIVATE_RELOAD_SERVICES=(profilemanagement nginx minio payment-simulator)
BUILD_FRONTEND="${BUILD_FRONTEND:-true}"
BUILD_BACKEND="${BUILD_BACKEND:-true}"
BUILD_IMAGES="${BUILD_IMAGES:-true}"
RELOAD_IMAGES="${RELOAD_IMAGES:-true}"
FRONTEND_BUILD_SCRIPT="${FRONTEND_BUILD_SCRIPT:-build:prod}"

usage() {
  cat <<'USAGE'
Build and reload docker-compose-prod.yml private MyScoutee images.

Safe to run while docker-compose-prod.yml is already up: images are built first,
then only the rebuilt private services are recreated. MongoDB and Redis keep
running.

This targets only project-owned production services:
  - profilemanagement
  - nginx
  - minio
  - payment-simulator

It intentionally does not build or reload:
  - nginx base image
  - mongodb
  - redis

It builds and reloads the layered MinIO image and the isolated Explore payment
simulator alongside profilemanagement and nginx. MongoDB and Redis are not touched.

Usage:
  packaging/release/rebuild-production-services.sh [options]

Options:
  --build-only       Build artifacts/images but do not recreate containers.
  --reload-only      Recreate containers from already-built images.
  --no-artifacts     Skip frontend and backend artifact builds.
  --no-frontend      Skip frontend build.
  --no-backend       Skip backend bootJar build.
  --no-cache         Pass --no-cache to docker compose build.
  --pull             Pass --pull to docker compose build.
  -h, --help         Show this help.

Environment:
  MYSCOUTEE_SERVER_DIR       Defaults to <repo>/server.
  MYSCOUTEE_FRONTEND_DIR     Defaults to <repo>/frontend.
  MYSCOUTEE_VERSION          Defaults to server/.env MYSCOUTEE_VERSION, then 1.0.2.
  NGINX_BASE_IMAGE           Defaults to myscoutee-nginx:${MYSCOUTEE_VERSION}-base.
  NGINX_PRODUCTION_IMAGE     Defaults to myscoutee-nginx:${MYSCOUTEE_VERSION}-prod.
  MYSCOUTEE_PRODUCTION_IMAGE Defaults to myscoutee-api:${MYSCOUTEE_VERSION}-prod.
  MINIO_PRODUCTION_IMAGE     Defaults to myscoutee-minio:${MYSCOUTEE_VERSION}-prod.
  PAYMENT_SIMULATOR_IMAGE    Defaults to myscoutee-payment-simulator:${MYSCOUTEE_VERSION}-prod.
  FRONTEND_BUILD_SCRIPT      Defaults to build:prod.
  BUILD_FRONTEND             Defaults to true.
  BUILD_BACKEND              Defaults to true.
  BUILD_IMAGES               Defaults to true.
  RELOAD_IMAGES              Defaults to true.
USAGE
}

read_version() {
  if [[ -f "${SERVER_DIR}/.env" ]]; then
    sed -n 's/^MYSCOUTEE_VERSION=//p' "${SERVER_DIR}/.env" | head -n 1
  fi
}

compose() {
  (cd "${SERVER_DIR}" && docker compose -f docker-compose-prod.yml "$@")
}

build_args=()

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --build-only)
      RELOAD_IMAGES=false
      ;;
    --reload-only)
      BUILD_FRONTEND=false
      BUILD_BACKEND=false
      BUILD_IMAGES=false
      RELOAD_IMAGES=true
      ;;
    --no-artifacts)
      BUILD_FRONTEND=false
      BUILD_BACKEND=false
      ;;
    --no-frontend)
      BUILD_FRONTEND=false
      ;;
    --no-backend)
      BUILD_BACKEND=false
      ;;
    --no-cache)
      build_args+=(--no-cache)
      ;;
    --pull)
      build_args+=(--pull)
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

VERSION="${MYSCOUTEE_VERSION:-$(read_version)}"
VERSION="${VERSION:-1.0.2}"

export MYSCOUTEE_VERSION="${VERSION}"
export NGINX_BASE_IMAGE="${NGINX_BASE_IMAGE:-myscoutee-nginx:${VERSION}-base}"
export NGINX_PRODUCTION_IMAGE="${NGINX_PRODUCTION_IMAGE:-myscoutee-nginx:${VERSION}-prod}"
export MYSCOUTEE_PRODUCTION_IMAGE="${MYSCOUTEE_PRODUCTION_IMAGE:-myscoutee-api:${VERSION}-prod}"
export MINIO_PRODUCTION_IMAGE="${MINIO_PRODUCTION_IMAGE:-myscoutee-minio:${VERSION}-prod}"
export PAYMENT_SIMULATOR_IMAGE="${PAYMENT_SIMULATOR_IMAGE:-myscoutee-payment-simulator:${VERSION}-prod}"

if [[ ! -f "${SERVER_DIR}/docker-compose-prod.yml" ]]; then
  echo "Missing compose file: ${SERVER_DIR}/docker-compose-prod.yml" >&2
  exit 1
fi

echo "MyScoutee version: ${VERSION}"
echo "Using nginx base image without rebuilding it: ${NGINX_BASE_IMAGE}"
echo "Private production images:"
echo "  ${NGINX_PRODUCTION_IMAGE}"
echo "  ${MYSCOUTEE_PRODUCTION_IMAGE}"
echo "  ${MINIO_PRODUCTION_IMAGE}"
echo "  ${PAYMENT_SIMULATOR_IMAGE}"

if [[ "${BUILD_FRONTEND}" == "true" ]]; then
  echo "Building frontend with npm script: ${FRONTEND_BUILD_SCRIPT}"
  (cd "${FRONTEND_DIR}" && npm run "${FRONTEND_BUILD_SCRIPT}")
  echo "Frontend production output is available for nginx at: ${FRONTEND_DIR}/prod"
fi

if [[ "${BUILD_BACKEND}" == "true" ]]; then
  echo "Building backend bootJar."
  (cd "${SERVER_DIR}" && ./gradlew :projects:profile:bootJar)
fi

if [[ "${BUILD_IMAGES}" == "true" ]]; then
  echo "Building private docker-compose-prod.yml services: ${PRIVATE_BUILD_SERVICES[*]}"
  compose build "${build_args[@]}" "${PRIVATE_BUILD_SERVICES[@]}"
fi

if [[ "${RELOAD_IMAGES}" == "true" ]]; then
  echo "Recreating rebuilt services from the rebuilt images: ${PRIVATE_RELOAD_SERVICES[*]}"
  compose up -d --no-deps --force-recreate --no-build "${PRIVATE_RELOAD_SERVICES[@]}"
fi

echo "Done."
