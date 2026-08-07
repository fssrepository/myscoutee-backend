#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

exec "$SCRIPT_DIR/open-checkpoint-browser-sessions.sh" "${1:-${QA_CHECKPOINT:-EVENT-TICKET-005}}"
