#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
RESET_SCRIPT="${REPO_ROOT}/packaging/scripts/reset-demo-state.sh"
TEST_ROOT="$(mktemp -d /tmp/myscoutee-demo-reset-test.XXXXXX)"

cleanup() {
  rm -rf -- "${TEST_ROOT}"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

mkdir -p "${TEST_ROOT}/bin"
cat > "${TEST_ROOT}/bin/docker" <<'EOF'
#!/usr/bin/env sh
if [ "${1:-}" = inspect ]; then
  printf '%s\n' healthy
  exit 0
fi
exit 64
EOF
chmod 0755 "${TEST_ROOT}/bin/docker"

cat > "${TEST_ROOT}/compose" <<'EOF'
#!/usr/bin/env sh
printf '%s\n' "$*" >> "${DEMO_RESET_COMMAND_LOG:?}"
exit 0
EOF
chmod 0755 "${TEST_ROOT}/compose"

cat > "${TEST_ROOT}/myscoutee.env" <<'EOF'
MONGO_DEMO_DATABASE=demo_db
MONGO_REAL_DATABASE=production_db
EOF
printf '%s\n' 1.0.0 > "${TEST_ROOT}/marker"

PATH="${TEST_ROOT}/bin:${PATH}" \
DEMO_RESET_COMMAND_LOG="${TEST_ROOT}/commands.log" \
MYSCOUTEE_COMPOSE_SCRIPT="${TEST_ROOT}/compose" \
MYSCOUTEE_ENV_FILE="${TEST_ROOT}/myscoutee.env" \
MYSCOUTEE_DEMO_RESET_MARKER="${TEST_ROOT}/marker" \
MYSCOUTEE_DEMO_RESET_WAIT_SECONDS=1 \
MYSCOUTEE_DEMO_RESET_ALLOW_NON_ROOT_FOR_TESTS=true \
  bash "${RESET_SCRIPT}" >/dev/null

[[ ! -e "${TEST_ROOT}/marker" ]] \
  || fail "successful reset did not consume the install marker"
grep -Fxq 'up -d mongodb minio' "${TEST_ROOT}/commands.log" \
  || fail "reset did not start only the MongoDB and MinIO prerequisites"
grep -Fq 'MONGO_RESET_DATABASE=demo_db' "${TEST_ROOT}/commands.log" \
  || fail "reset did not pin its destructive Mongo operation to demo_db"
grep -Fq 'dropUser(process.env.MONGO_APP_USERNAME)' "${TEST_ROOT}/commands.log" \
  || fail "reset did not remove a stale demo-scoped application user"
grep -Fq 'MONGO_IMPORT_ALL_SEED_DATABASES=false' "${TEST_ROOT}/commands.log" \
  || fail "reset could import another database"
grep -Fq 'MONGO_SEED_DIRECTORY=demo_db' "${TEST_ROOT}/commands.log" \
  || fail "reset did not select the packaged demo seed"
grep -Fq 'images/demo-assets images/demo-events images/demo-profiles' \
  "${TEST_ROOT}/commands.log" \
  || fail "reset did not restrict MinIO cleanup to package-owned demo prefixes"

cat > "${TEST_ROOT}/myscoutee.env" <<'EOF'
MONGO_DEMO_DATABASE=production_db
MONGO_REAL_DATABASE=production_db
EOF
printf '%s\n' 1.0.0 > "${TEST_ROOT}/marker"
if PATH="${TEST_ROOT}/bin:${PATH}" \
    DEMO_RESET_COMMAND_LOG="${TEST_ROOT}/rejected.log" \
    MYSCOUTEE_COMPOSE_SCRIPT="${TEST_ROOT}/compose" \
    MYSCOUTEE_ENV_FILE="${TEST_ROOT}/myscoutee.env" \
    MYSCOUTEE_DEMO_RESET_MARKER="${TEST_ROOT}/marker" \
    MYSCOUTEE_DEMO_RESET_ALLOW_NON_ROOT_FOR_TESTS=true \
      bash "${RESET_SCRIPT}" >/dev/null 2>&1; then
  fail "reset accepted a production database as its target"
fi
[[ -f "${TEST_ROOT}/marker" ]] \
  || fail "a rejected reset consumed its retry marker"
[[ ! -e "${TEST_ROOT}/rejected.log" ]] \
  || fail "a rejected reset invoked Compose"

echo "Demo reset boundary test passed."
