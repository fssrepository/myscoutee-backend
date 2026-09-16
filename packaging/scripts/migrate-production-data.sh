#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# Invoked only after MongoDB readiness/seed synchronization, before API startup.
# Mongo credentials stay inside the already-running container.
docker exec -i mongodb sh -c '
  exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" \
    --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin \
    production_db --file /dev/stdin
' < "${SCRIPT_DIR}/../migrations/004-deployment-configuration.js"
