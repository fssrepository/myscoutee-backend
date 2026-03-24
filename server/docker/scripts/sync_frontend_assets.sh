#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"

DEFAULT_FRONTEND_ROOT="${REPO_ROOT}/frontend"
DEFAULT_NGINX_HTML_DIR="${REPO_ROOT}/server/docker/conf/nginx/app/myscoutee"

MODE="${1:-dev}"
WATCH_MODE="${2:-}"

if [[ "${MODE}" == "watch" ]]; then
  MODE="${FRONTEND_BUILD_MODE:-dev}"
  WATCH_MODE="watch"
fi

if [[ "${MODE}" != "dev" && "${MODE}" != "prod" ]]; then
  echo "Usage: $0 [dev|prod] [watch]" >&2
  echo "Example: $0 dev watch" >&2
  echo "Env overrides: FRONTEND_ROOT, FRONTEND_SOURCE_DIR, NGINX_HTML_DIR" >&2
  exit 1
fi

FRONTEND_ROOT="${FRONTEND_ROOT:-${DEFAULT_FRONTEND_ROOT}}"
if [[ "${MODE}" == "dev" ]]; then
  DEFAULT_SOURCE_DIR="${FRONTEND_ROOT}/dev"
else
  DEFAULT_SOURCE_DIR="${FRONTEND_ROOT}/docs"
fi

SOURCE_DIR="${FRONTEND_SOURCE_DIR:-${DEFAULT_SOURCE_DIR}}"
TARGET_DIR="${NGINX_HTML_DIR:-${DEFAULT_NGINX_HTML_DIR}}"

if ! command -v rsync >/dev/null 2>&1; then
  echo "Error: rsync is required." >&2
  exit 1
fi

if [[ ! -d "${SOURCE_DIR}" ]]; then
  echo "Error: source directory not found: ${SOURCE_DIR}" >&2
  exit 1
fi

mkdir -p "${TARGET_DIR}"

sync_once() {
  rsync -a --delete "${SOURCE_DIR}/" "${TARGET_DIR}/"
  echo "Synced ${SOURCE_DIR} -> ${TARGET_DIR} at $(date '+%Y-%m-%d %H:%M:%S')"
}

sync_once

if [[ "${WATCH_MODE}" == "watch" ]]; then
  if ! command -v inotifywait >/dev/null 2>&1; then
    echo "Error: watch mode needs inotifywait (inotify-tools)." >&2
    exit 1
  fi

  echo "Watching ${SOURCE_DIR} ..."
  while inotifywait -r -e create,delete,modify,move "${SOURCE_DIR}" >/dev/null 2>&1; do
    sync_once
  done
fi
