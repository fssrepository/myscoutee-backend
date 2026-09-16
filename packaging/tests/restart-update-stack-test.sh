#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
TEST_DIR="$(mktemp -d)"
trap 'rm -rf -- "$TEST_DIR"' EXIT
cp "$ROOT/packaging/scripts/restart-update-stack.sh" "$TEST_DIR/"
mkdir "$TEST_DIR/bin"
export UPDATE_RESTART_TRACE="$TEST_DIR/trace"
export PATH="$TEST_DIR/bin:$PATH"
export MYSCOUTEE_COMPOSE_SCRIPT="$TEST_DIR/compose"
for command in compose reset-demo-state.sh sync-i18n-seeds.sh; do
  cat > "$TEST_DIR/$command" <<'SH'
#!/bin/sh
printf '%s %s\n' "$(basename "$0")" "$*" >> "$UPDATE_RESTART_TRACE"
SH
  chmod +x "$TEST_DIR/$command"
done
cat > "$TEST_DIR/bin/systemctl" <<'SH'
#!/bin/sh
exit 0
SH
cat > "$TEST_DIR/bin/docker" <<'SH'
#!/bin/sh
printf '%s\n' "${UPDATE_TEST_HEALTH:-healthy}"
SH
chmod +x "$TEST_DIR/bin/"*
bash "$TEST_DIR/restart-update-stack.sh"
python3 - "$UPDATE_RESTART_TRACE" <<'PY'
import sys
from pathlib import Path
lines = Path(sys.argv[1]).read_text().splitlines()
assert lines == [
    'compose stop profilemanagement',
    'reset-demo-state.sh ',
    'sync-i18n-seeds.sh ',
    'compose up -d --no-deps --wait --wait-timeout 300 mongodb redis minio registry-demo payment-simulator',
    'compose up -d --no-deps profilemanagement',
    'compose up -d --no-deps nginx',
], lines
PY
: > "$UPDATE_RESTART_TRACE"
if UPDATE_TEST_HEALTH=unhealthy bash "$TEST_DIR/restart-update-stack.sh"; then
  echo 'FAIL: unhealthy backend was accepted' >&2
  exit 1
fi
if grep -q 'nginx\| down\|stop nginx' "$UPDATE_RESTART_TRACE"; then
  echo 'FAIL: ingress touched after backend health failure' >&2
  exit 1
fi
echo 'PASS: ingress retained until backend health; failure retains existing ingress.'
