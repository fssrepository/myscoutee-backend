#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TEST_ROOT="$(mktemp -d /tmp/mongodb-seed-sync-test.XXXXXX)"
WATCHER_PID=""

cleanup() {
  local status=$?
  if [[ -n "${WATCHER_PID}" ]]; then
    kill "${WATCHER_PID}" >/dev/null 2>&1 || true
    wait "${WATCHER_PID}" >/dev/null 2>&1 || true
  fi
  if (( status != 0 )); then
    [[ ! -f "${TEST_ROOT}/watcher.log" ]] || {
      printf '%s\n' '--- watcher log ---' >&2
      cat "${TEST_ROOT}/watcher.log" >&2
    }
    [[ ! -f "${TEST_IMPORT_LOG:-}" ]] || {
      printf '%s\n' '--- import log ---' >&2
      cat "${TEST_IMPORT_LOG}" >&2
    }
  fi
  rm -rf "${TEST_ROOT}"
  return "${status}"
}
trap cleanup EXIT

mkdir -p "${TEST_ROOT}/seed/demo_db" "${TEST_ROOT}/bin"
printf '[{"version":"v1"}]\n' > "${TEST_ROOT}/seed/demo_db/chats.json"
printf '[{"version":"v1"}]\n' > "${TEST_ROOT}/seed/demo_db/i18n_messages.json"
printf '[{"version":"v1"}]\n' > "${TEST_ROOT}/seed/demo_db/i18n_bundles.json"

cat > "${TEST_ROOT}/bin/mongosh" <<'EOF'
#!/usr/bin/env bash
exit 0
EOF

cat > "${TEST_ROOT}/fake-import.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
if [[ -z "${MONGO_IMPORT_SINGLE_FILE:-}" ]]; then
  printf 'initial\n' >> "${TEST_IMPORT_LOG}"
  return 0 2>/dev/null || exit 0
fi
version="$(sed -n 's/.*"version":"\([^"]*\)".*/\1/p' "${MONGO_IMPORT_SINGLE_FILE}")"
printf 'file:%s:%s\n' "$(basename "${MONGO_IMPORT_SINGLE_FILE}")" "${version}" >> "${TEST_IMPORT_LOG}"
printf 'start:%s\n' "${version}" >> "${TEST_IMPORT_LOG}"
touch "${TEST_ROOT}/single-import-started-${version}"
sleep 1
printf 'finish:%s\n' "${version}" >> "${TEST_IMPORT_LOG}"
EOF

chmod 0755 "${TEST_ROOT}/bin/mongosh" "${TEST_ROOT}/fake-import.sh"
export PATH="${TEST_ROOT}/bin:${PATH}"
export TEST_ROOT
export TEST_IMPORT_LOG="${TEST_ROOT}/imports.log"

MONGODB_SEED_ROOT="${TEST_ROOT}/seed" \
MONGO_IMPORT_SCRIPT="${TEST_ROOT}/fake-import.sh" \
MONGODB_SEED_SYNC_STATE_DIRECTORY="${TEST_ROOT}/state" \
MONGODB_SEED_SYNC_DEBOUNCE_SECONDS=0.1 \
MONGODB_SEED_SYNC_RECONCILE_SECONDS=1 \
MONGODB_SEED_SYNC_MAX_RECONCILE_PASSES=1 \
  bash "${SCRIPT_DIR}/mongodb-seed-sync.sh" > "${TEST_ROOT}/watcher.log" 2>&1 &
WATCHER_PID="$!"

for _ in $(seq 1 50); do
  [[ -f "${TEST_IMPORT_LOG}" ]] && break
  sleep 0.1
done
grep -Fxq 'initial' "${TEST_IMPORT_LOG}"

printf '[{"version":"v2"}]\n' > "${TEST_ROOT}/seed/demo_db/i18n_messages.json"
printf '[{"version":"v2"}]\n' > "${TEST_ROOT}/seed/demo_db/i18n_bundles.json"
printf '[{"version":"v2"}]\n' > "${TEST_ROOT}/seed/demo_db/chats.json"
for _ in $(seq 1 50); do
  [[ -f "${TEST_ROOT}/single-import-started-v2" ]] && break
  sleep 0.1
done
[[ -f "${TEST_ROOT}/single-import-started-v2" ]]

# This write occurs while v2 is being imported. The old one-shot inotify
# watcher lost precisely this class of event.
printf '[{"version":"v3"}]\n' > "${TEST_ROOT}/seed/demo_db/chats.json"

wait "${WATCHER_PID}"
WATCHER_PID=""

grep -Fxq 'finish:v2' "${TEST_IMPORT_LOG}"
grep -Fxq 'finish:v3' "${TEST_IMPORT_LOG}"
grep -Fq 'Seed changed during import; importing the newer version next' "${TEST_ROOT}/watcher.log"

messages_line="$(grep -n -F 'file:i18n_messages.json:v2' "${TEST_IMPORT_LOG}" | cut -d: -f1)"
bundles_line="$(grep -n -F 'file:i18n_bundles.json:v2' "${TEST_IMPORT_LOG}" | cut -d: -f1)"
[[ -n "${messages_line}" && -n "${bundles_line}" ]]
(( messages_line < bundles_line ))

printf 'mongodb seed sync tests passed\n'
