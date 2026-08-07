#!/usr/bin/env bash

set -euo pipefail

CHECKPOINT="${1:-${QA_CHECKPOINT:-EVENT-TICKET-005}}"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

exec node "$SCRIPT_DIR/open-checkpoint-browser-sessions.mjs" "$CHECKPOINT"
