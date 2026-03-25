#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="${FRONTEND_ROOT:-/workspace/frontend}"
SYNC_SCRIPT="${SYNC_SCRIPT:-/scripts/sync_frontend_assets.sh}"
BUILD_MODE="${FRONTEND_BUILD_MODE:-dev}"
BUILD_OUTPUT_DIR="${FRONTEND_SOURCE_DIR:-${FRONTEND_ROOT}/dev}"
BUILD_LOG_FILE="${BUILD_LOG_FILE:-}"

if [[ ! -d "${FRONTEND_ROOT}" ]]; then
  echo "Error: frontend root not found: ${FRONTEND_ROOT}" >&2
  exit 1
fi

cd "${FRONTEND_ROOT}"

if [[ ! -d node_modules ]]; then
  echo "Error: frontend/node_modules is missing. Run npm install in the frontend workspace first." >&2
  exit 1
fi

wait_for_host_port() {
  local host_port="$1"
  local host="${host_port%%:*}"
  local port="${host_port##*:}"

  if [[ -z "${host}" || -z "${port}" || "${host}" == "${port}" ]]; then
    echo "Skipping invalid WAIT_FOR_HOSTS entry: ${host_port}" >&2
    return 0
  fi

  until bash -c ">/dev/tcp/${host}/${port}" >/dev/null 2>&1; do
    echo "Waiting for ${host}:${port} ..."
    sleep 1
  done
}

wait_for_dependencies() {
  local wait_for_hosts="${WAIT_FOR_HOSTS:-}"
  if [[ -z "${wait_for_hosts}" ]]; then
    return 0
  fi

  for host_port in ${wait_for_hosts}; do
    wait_for_host_port "${host_port}"
  done
}

wait_for_initial_build_output() {
  local debounce_seconds="${SYNC_DEBOUNCE_SECONDS:-2}"

  while true; do
    if ! kill -0 "${build_pid}" >/dev/null 2>&1; then
      wait "${build_pid}"
    fi

    if grep -q 'Application bundle generation complete\.' "${BUILD_LOG_FILE}"       && grep -q 'Watch mode enabled\. Watching for file changes' "${BUILD_LOG_FILE}"; then
      break
    fi

    sleep 1
  done

  if [[ -d "${BUILD_OUTPUT_DIR}" ]] && command -v inotifywait >/dev/null 2>&1; then
    while inotifywait -q -r -t "${debounce_seconds}" -e create,delete,modify,move "${BUILD_OUTPUT_DIR}" >/dev/null 2>&1; do
      :
    done
  fi
}

cleanup() {
  if [[ -n "${build_pid:-}" ]]; then
    kill "${build_pid}" >/dev/null 2>&1 || true
    wait "${build_pid}" 2>/dev/null || true
  fi
  if [[ -n "${BUILD_LOG_FILE:-}" && -f "${BUILD_LOG_FILE}" ]]; then
    rm -f "${BUILD_LOG_FILE}" || true
  fi
}
trap cleanup EXIT INT TERM

if [[ -z "${BUILD_LOG_FILE}" ]]; then
  BUILD_LOG_FILE="$(mktemp)"
else
  : > "${BUILD_LOG_FILE}"
fi

echo "Starting Angular watch build in ${FRONTEND_ROOT}..."
NG_BUILD_MAX_WORKERS="${NG_BUILD_MAX_WORKERS:-12}" npm run watch > >(tee -a "${BUILD_LOG_FILE}") 2>&1 &
build_pid=$!

echo "Waiting for the first fresh dev build output..."
wait_for_initial_build_output

echo "Waiting for dependent services before syncing nginx assets..."
wait_for_dependencies

echo "Syncing fresh build into nginx..."
FRONTEND_SOURCE_DIR="${FRONTEND_SOURCE_DIR:-${FRONTEND_ROOT}/dev}" \
  NGINX_HTML_DIR="${NGINX_HTML_DIR:-/workspace/nginx-html}" \
  bash "${SYNC_SCRIPT}" "${BUILD_MODE}"

echo "Starting nginx asset sync watcher..."
FRONTEND_SOURCE_DIR="${FRONTEND_SOURCE_DIR:-${FRONTEND_ROOT}/dev}" \
  NGINX_HTML_DIR="${NGINX_HTML_DIR:-/workspace/nginx-html}" \
  SKIP_INITIAL_SYNC="true" \
  bash "${SYNC_SCRIPT}" "${BUILD_MODE}" watch &
sync_pid=$!

wait -n "${build_pid}" "${sync_pid}"
