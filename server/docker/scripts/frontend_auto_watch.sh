#!/usr/bin/env bash
set -euo pipefail

SOURCE_FRONTEND_ROOT="${FRONTEND_ROOT:-/workspace/frontend}"
SYNC_SCRIPT="${SYNC_SCRIPT:-/scripts/sync_frontend_assets.sh}"
BUILD_MODE="${FRONTEND_BUILD_MODE:-dev}"
BUILD_LOG_FILE="${BUILD_LOG_FILE:-}"
FRONTEND_ACTIVITIES_DATA_SOURCE="${FRONTEND_ACTIVITIES_DATA_SOURCE:-}"
BUILD_FRONTEND_ROOT="${BUILD_FRONTEND_ROOT:-}"
SOURCE_SYNC_DEBOUNCE_SECONDS="${SOURCE_SYNC_DEBOUNCE_SECONDS:-1}"
SOURCE_SYNC_EXCLUDE_REGEX='(^|/)(node_modules|dev|docs|out-tsc|\.angular|\.git|\.agent)(/|$)'
TEMP_BUILD_ROOT_CREATED="false"
BUILD_OUTPUT_DIR=""

if [[ ! -d "${SOURCE_FRONTEND_ROOT}" ]]; then
  echo "Error: frontend root not found: ${SOURCE_FRONTEND_ROOT}" >&2
  exit 1
fi

if [[ ! -d "${SOURCE_FRONTEND_ROOT}/node_modules" ]]; then
  echo "Error: frontend/node_modules is missing. Run npm install in the frontend workspace first." >&2
  exit 1
fi

resolve_build_output_dir() {
  case "${BUILD_MODE}" in
    dev)
      printf '%s\n' "${BUILD_FRONTEND_ROOT}/dev"
      ;;
    prod)
      printf '%s\n' "${BUILD_FRONTEND_ROOT}/docs"
      ;;
    *)
      printf '%s\n' "${BUILD_FRONTEND_ROOT}/dev"
      ;;
  esac
}

resolve_environment_file() {
  case "${BUILD_MODE}" in
    dev)
      printf '%s\n' "${BUILD_FRONTEND_ROOT}/src/environments/environment.development.ts"
      ;;
    prod)
      printf '%s\n' "${BUILD_FRONTEND_ROOT}/src/environments/environment.production.ts"
      ;;
    *)
      printf '%s\n' "${BUILD_FRONTEND_ROOT}/src/environments/environment.ts"
      ;;
  esac
}

resolve_route_mode_file() {
  printf '%s\n' "${BUILD_FRONTEND_ROOT}/src/app/shared/core/base/services/base-route-mode.service.ts"
}

initialize_build_workspace() {
  if [[ -z "${BUILD_FRONTEND_ROOT}" ]]; then
    BUILD_FRONTEND_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/myscoutee-frontend-sync.XXXXXX")"
    TEMP_BUILD_ROOT_CREATED="true"
  fi

  if [[ "${BUILD_FRONTEND_ROOT}" == "${SOURCE_FRONTEND_ROOT}" ]]; then
    echo "Error: BUILD_FRONTEND_ROOT must be different from FRONTEND_ROOT." >&2
    exit 1
  fi

  mkdir -p "${BUILD_FRONTEND_ROOT}"
  BUILD_OUTPUT_DIR="$(resolve_build_output_dir)"
}

sync_source_frontend_into_build_workspace() {
  rsync -a --delete \
    --exclude '/node_modules' \
    --exclude '/dev' \
    --exclude '/docs' \
    --exclude '/out-tsc' \
    --exclude '/.angular' \
    --exclude '/.git' \
    --exclude '/.agent' \
    "${SOURCE_FRONTEND_ROOT}/" "${BUILD_FRONTEND_ROOT}/"

  rm -rf "${BUILD_FRONTEND_ROOT}/node_modules"
  ln -s "${SOURCE_FRONTEND_ROOT}/node_modules" "${BUILD_FRONTEND_ROOT}/node_modules"
}

apply_environment_override() {
  if [[ -z "${FRONTEND_ACTIVITIES_DATA_SOURCE}" ]]; then
    return 0
  fi

  if [[ "${FRONTEND_ACTIVITIES_DATA_SOURCE}" != "demo" && "${FRONTEND_ACTIVITIES_DATA_SOURCE}" != "http" ]]; then
    echo "Error: FRONTEND_ACTIVITIES_DATA_SOURCE must be 'demo' or 'http'." >&2
    exit 1
  fi

  local environment_file
  local target_line

  environment_file="$(resolve_environment_file)"
  if [[ ! -f "${environment_file}" ]]; then
    echo "Error: environment file not found: ${environment_file}" >&2
    exit 1
  fi

  target_line="activitiesDataSource: '${FRONTEND_ACTIVITIES_DATA_SOURCE}' as 'demo' | 'http',"
  sed -i \
    -e "s/activitiesDataSource: 'demo' as 'demo' | 'http',/${target_line}/" \
    -e "s/activitiesDataSource: 'http' as 'demo' | 'http',/${target_line}/" \
    "${environment_file}"

  if ! grep -Fq "${target_line}" "${environment_file}"; then
    echo "Error: unable to override activitiesDataSource in ${environment_file}." >&2
    exit 1
  fi

  echo "Applied temp frontend environment override: activitiesDataSource=${FRONTEND_ACTIVITIES_DATA_SOURCE}"
}

apply_route_mode_override() {
  if [[ "${FRONTEND_ACTIVITIES_DATA_SOURCE}" != "http" ]]; then
    return 0
  fi

  local route_mode_file
  local target_line

  route_mode_file="$(resolve_route_mode_file)"
  if [[ ! -f "${route_mode_file}" ]]; then
    echo "Error: route mode file not found: ${route_mode_file}" >&2
    exit 1
  fi

  target_line="    return environment.activitiesDataSource !== 'http' && !routeConfig.http && (this.sessionService.currentSession()?.kind === 'demo' || !environment.loginEnabled);"
  ROUTE_MODE_FILE="${route_mode_file}" node <<'NODE'
const fs = require('fs');

const routeModeFile = process.env.ROUTE_MODE_FILE;
const originalLine = "    return !routeConfig.http && (this.sessionService.currentSession()?.kind === 'demo' || !environment.loginEnabled);";
const targetLine = "    return environment.activitiesDataSource !== 'http' && !routeConfig.http && (this.sessionService.currentSession()?.kind === 'demo' || !environment.loginEnabled);";

if (!routeModeFile) {
  process.exit(2);
}

const source = fs.readFileSync(routeModeFile, 'utf8');
if (source.includes(targetLine)) {
  process.exit(0);
}
if (!source.includes(originalLine)) {
  process.exit(3);
}

fs.writeFileSync(routeModeFile, source.replace(originalLine, targetLine));
NODE

  if ! grep -Fq "${target_line}" "${route_mode_file}"; then
    echo "Error: unable to force backend route mode in ${route_mode_file}." >&2
    exit 1
  fi

  echo "Applied temp route-mode override for backend HTTP services"
}

apply_build_workspace_overrides() {
  apply_environment_override
  apply_route_mode_override
}

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

    if grep -q 'Application bundle generation complete\.' "${BUILD_LOG_FILE}" \
      && grep -q 'Watch mode enabled\. Watching for file changes' "${BUILD_LOG_FILE}"; then
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

wait_for_source_quiet_period() {
  if ! command -v inotifywait >/dev/null 2>&1; then
    return 0
  fi

  while inotifywait -q -r -t "${SOURCE_SYNC_DEBOUNCE_SECONDS}" \
    -e create,delete,modify,move \
    --exclude "${SOURCE_SYNC_EXCLUDE_REGEX}" \
    "${SOURCE_FRONTEND_ROOT}" >/dev/null 2>&1; do
    :
  done
}

watch_frontend_source_changes() {
  if ! command -v inotifywait >/dev/null 2>&1; then
    echo "Source watch skipped: inotifywait is not available." >&2
    return 0
  fi

  echo "Watching frontend source at ${SOURCE_FRONTEND_ROOT} ..."
  while inotifywait -q -r -e create,delete,modify,move \
    --exclude "${SOURCE_SYNC_EXCLUDE_REGEX}" \
    "${SOURCE_FRONTEND_ROOT}" >/dev/null 2>&1; do
    wait_for_source_quiet_period
    echo "Syncing frontend source into temp build workspace..."
    sync_source_frontend_into_build_workspace
    apply_build_workspace_overrides
  done
}

cleanup() {
  if [[ -n "${build_pid:-}" ]]; then
    kill "${build_pid}" >/dev/null 2>&1 || true
    wait "${build_pid}" 2>/dev/null || true
  fi
  if [[ -n "${sync_pid:-}" ]]; then
    kill "${sync_pid}" >/dev/null 2>&1 || true
    wait "${sync_pid}" 2>/dev/null || true
  fi
  if [[ -n "${source_sync_pid:-}" ]]; then
    kill "${source_sync_pid}" >/dev/null 2>&1 || true
    wait "${source_sync_pid}" 2>/dev/null || true
  fi
  if [[ -n "${BUILD_LOG_FILE:-}" && -f "${BUILD_LOG_FILE}" ]]; then
    rm -f "${BUILD_LOG_FILE}" || true
  fi
  if [[ "${TEMP_BUILD_ROOT_CREATED}" == "true" && -n "${BUILD_FRONTEND_ROOT}" && -d "${BUILD_FRONTEND_ROOT}" ]]; then
    rm -rf "${BUILD_FRONTEND_ROOT}" || true
  fi
}
trap cleanup EXIT INT TERM

initialize_build_workspace
sync_source_frontend_into_build_workspace
apply_build_workspace_overrides

if [[ -z "${BUILD_LOG_FILE}" ]]; then
  BUILD_LOG_FILE="$(mktemp)"
else
  : > "${BUILD_LOG_FILE}"
fi

cd "${BUILD_FRONTEND_ROOT}"

echo "Starting Angular watch build in temp workspace ${BUILD_FRONTEND_ROOT}..."
NG_BUILD_MAX_WORKERS="${NG_BUILD_MAX_WORKERS:-12}" npm run watch > >(tee -a "${BUILD_LOG_FILE}") 2>&1 &
build_pid=$!

watch_frontend_source_changes &
source_sync_pid=$!

echo "Waiting for the first fresh dev build output..."
wait_for_initial_build_output

echo "Waiting for dependent services before syncing nginx assets..."
wait_for_dependencies

echo "Syncing fresh build into nginx..."
FRONTEND_SOURCE_DIR="${BUILD_OUTPUT_DIR}" \
  NGINX_HTML_DIR="${NGINX_HTML_DIR:-/workspace/nginx-html}" \
  bash "${SYNC_SCRIPT}" "${BUILD_MODE}"

echo "Starting nginx asset sync watcher..."
FRONTEND_SOURCE_DIR="${BUILD_OUTPUT_DIR}" \
  NGINX_HTML_DIR="${NGINX_HTML_DIR:-/workspace/nginx-html}" \
  SKIP_INITIAL_SYNC="true" \
  bash "${SYNC_SCRIPT}" "${BUILD_MODE}" watch &
sync_pid=$!

wait -n "${build_pid}" "${source_sync_pid}" "${sync_pid}"
