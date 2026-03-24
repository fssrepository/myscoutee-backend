#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="${FRONTEND_ROOT:-/workspace/frontend}"
SYNC_SCRIPT="${SYNC_SCRIPT:-/scripts/sync_frontend_assets.sh}"
BUILD_MODE="${FRONTEND_BUILD_MODE:-dev}"

if [[ ! -d "${FRONTEND_ROOT}" ]]; then
  echo "Error: frontend root not found: ${FRONTEND_ROOT}" >&2
  exit 1
fi

cd "${FRONTEND_ROOT}"

if [[ ! -d node_modules ]]; then
  echo "Error: frontend/node_modules is missing. Run npm install in the frontend workspace first." >&2
  exit 1
fi

cleanup() {
  if [[ -n "${build_pid:-}" ]]; then
    kill "${build_pid}" >/dev/null 2>&1 || true
    wait "${build_pid}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "Starting Angular watch build in ${FRONTEND_ROOT}..."
NG_BUILD_MAX_WORKERS="${NG_BUILD_MAX_WORKERS:-12}" npm run watch &
build_pid=$!

echo "Waiting for the first dev build output..."
while [[ ! -f "${FRONTEND_ROOT}/dev/index.html" ]]; do
  if ! kill -0 "${build_pid}" >/dev/null 2>&1; then
    wait "${build_pid}"
  fi
  sleep 1
done

echo "Starting nginx asset sync watcher..."
FRONTEND_SOURCE_DIR="${FRONTEND_SOURCE_DIR:-${FRONTEND_ROOT}/dev}" \
  NGINX_HTML_DIR="${NGINX_HTML_DIR:-/workspace/nginx-html}" \
  bash "${SYNC_SCRIPT}" "${BUILD_MODE}" watch &
sync_pid=$!

wait -n "${build_pid}" "${sync_pid}"
