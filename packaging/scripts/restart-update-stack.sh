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

# The worker inherited these values before apt installed the new package.
# postinst updates the installed .env; let Compose read that current file for
# both upgrade and rollback rather than overriding it with the worker snapshot.
unset MYSCOUTEE_VERSION NGINX_BASE_IMAGE NGINX_PRODUCTION_IMAGE \
  MYSCOUTEE_PRODUCTION_IMAGE MINIO_PRODUCTION_IMAGE REGISTRY_DEMO_IMAGE \
  PAYMENT_SIMULATOR_IMAGE

"$COMPOSE" stop profilemanagement
printf '[myscoutee-update-phase] PREPARING_DATA\n'
"${SCRIPT_DIR}/reset-demo-state.sh"
"${SCRIPT_DIR}/sync-i18n-seeds.sh" --prepare-only
"${SCRIPT_DIR}/migrate-production-data.sh"
printf '[myscoutee-update-phase] STARTING_SERVICES\n'
"$COMPOSE" up -d --no-deps --wait --wait-timeout "$TIMEOUT" mongodb redis minio registry payment-simulator
"$COMPOSE" up -d --no-deps profilemanagement
printf '[myscoutee-update-phase] WAITING_FOR_HEALTH\n'
deadline=$((SECONDS + TIMEOUT))
while (( SECONDS < deadline )); do
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' myscoutee)"
  if [[ "$health" == healthy ]]; then
    printf '[myscoutee-update-phase] SWITCHING_INGRESS\n'
    "$COMPOSE" up -d --no-deps nginx
    exit 0
  fi
  [[ "$health" != unhealthy ]] || exit 1
  sleep 2
done
echo "Application health deadline exceeded; retained HTTPS progress remains available." >&2
exit 1
