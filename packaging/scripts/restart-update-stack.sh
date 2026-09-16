#!/usr/bin/env bash
set -euo pipefail

# Keep the current HTTPS ingress and the host status reader alive while replacing
# the application. Switch the nginx image last; the browser retries that brief gap.
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE="${MYSCOUTEE_COMPOSE_SCRIPT:-${SCRIPT_DIR}/myscoutee-compose.sh}"
TIMEOUT="${MYSCOUTEE_UPDATE_HEALTH_TIMEOUT_SECONDS:-300}"
[[ "$TIMEOUT" =~ ^[1-9][0-9]*$ && "$TIMEOUT" -le 3600 ]] || exit 1
systemctl is-active --quiet myscoutee.service
systemctl is-active --quiet myscoutee-update-status.socket

"$COMPOSE" stop profilemanagement
"${SCRIPT_DIR}/reset-demo-state.sh"
"${SCRIPT_DIR}/sync-i18n-seeds.sh"
"$COMPOSE" up -d --no-deps --wait --wait-timeout "$TIMEOUT" mongodb redis minio registry-demo payment-simulator
"$COMPOSE" up -d --no-deps profilemanagement
deadline=$((SECONDS + TIMEOUT))
while (( SECONDS < deadline )); do
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' myscoutee)"
  if [[ "$health" == healthy ]]; then
    "$COMPOSE" up -d --no-deps nginx
    exit 0
  fi
  [[ "$health" != unhealthy ]] || exit 1
  sleep 2
done
echo "Application health deadline exceeded; retained HTTPS progress remains available." >&2
exit 1
