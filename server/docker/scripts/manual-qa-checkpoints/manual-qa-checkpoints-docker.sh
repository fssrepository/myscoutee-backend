#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if [ "${MANUAL_QA_MONGO_MODE:-container}" != "container" ]; then
  printf '%s\n' \
    "manual-qa-checkpoints-docker: MANUAL_QA_MONGO_MODE must be 'container' for this entry point." >&2
  exit 2
fi

export MANUAL_QA_MONGO_MODE="container"
export MANUAL_QA_MONGO_CONTAINER="${MANUAL_QA_MONGO_CONTAINER:-mongodb}"

# This wrapper only selects the already-running MongoDB container. The owning
# checkpoint harness verifies Docker access and container state and never starts,
# stops, restarts or rebuilds the dev stack.
exec bash "${SCRIPT_DIR}/manual-qa-checkpoints.sh" "$@"
