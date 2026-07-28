#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
IDENTITY_SCRIPT="${REPO_ROOT}/packaging/scripts/ensure-deployment-identity.sh"
BACKUP_SCRIPT="${REPO_ROOT}/packaging/scripts/backup-production.sh"
RESTORE_SCRIPT="${REPO_ROOT}/packaging/scripts/restore-production.sh"
TEST_ROOT="$(mktemp -d /tmp/myscoutee-registry-packaging-test.XXXXXX)"

cleanup() {
  rm -rf "${TEST_ROOT}"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

canonical_hash() {
  local digest

  digest="$(printf '%s\n' "$@" | openssl dgst -sha256 -r | awk '{ print $1 }')"
  printf 'sha256:%s' "${digest}"
}

assert_file_mode() {
  local expected="$1"
  local file="$2"
  local actual

  actual="$(stat -c '%a' "${file}")"
  [[ "${actual}" == "${expected}" ]] || fail "${file} mode is ${actual}, expected ${expected}"
}

KEY_DIR="${TEST_ROOT}/identity"
STATE_DIR="${TEST_ROOT}/state"

MYSCOUTEE_REGISTRY_KEY_DIR="${KEY_DIR}" \
MYSCOUTEE_REGISTRY_STATE_DIR="${STATE_DIR}" \
  bash "${IDENTITY_SCRIPT}" >/dev/null

PRIVATE_KEY="${KEY_DIR}/deployment-private-key.pem"
PUBLIC_KEY="${KEY_DIR}/deployment-public-key.der"
[[ -s "${PRIVATE_KEY}" ]] || fail "first install did not create the private key"
[[ -s "${PUBLIC_KEY}" ]] || fail "first install did not create the public key"
[[ "$(stat -c '%s' "${PUBLIC_KEY}")" == "44" ]] || fail "SPKI DER public key is not 44 bytes"
assert_file_mode 600 "${PRIVATE_KEY}"
assert_file_mode 644 "${PUBLIC_KEY}"
assert_file_mode 700 "${KEY_DIR}"
assert_file_mode 700 "${STATE_DIR}"

private_hash_before="$(sha256sum "${PRIVATE_KEY}" | awk '{ print $1 }')"
public_hash_before="$(sha256sum "${PUBLIC_KEY}" | awk '{ print $1 }')"

MYSCOUTEE_REGISTRY_KEY_DIR="${KEY_DIR}" \
MYSCOUTEE_REGISTRY_STATE_DIR="${STATE_DIR}" \
  bash "${IDENTITY_SCRIPT}" >/dev/null

[[ "$(sha256sum "${PRIVATE_KEY}" | awk '{ print $1 }')" == "${private_hash_before}" ]] \
  || fail "rerun rotated the deployment private key"
[[ "$(sha256sum "${PUBLIC_KEY}" | awk '{ print $1 }')" == "${public_hash_before}" ]] \
  || fail "rerun changed the deployment public key"

cp "${PUBLIC_KEY}" "${TEST_ROOT}/expected-public.der"
rm -f "${PUBLIC_KEY}"
MYSCOUTEE_REGISTRY_KEY_DIR="${KEY_DIR}" \
MYSCOUTEE_REGISTRY_STATE_DIR="${STATE_DIR}" \
  bash "${IDENTITY_SCRIPT}" >/dev/null
cmp -s "${TEST_ROOT}/expected-public.der" "${PUBLIC_KEY}" \
  || fail "missing public key was not reconstructed from the preserved private key"

printf 'mismatched-public-key' > "${PUBLIC_KEY}"
if MYSCOUTEE_REGISTRY_KEY_DIR="${KEY_DIR}" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${STATE_DIR}" \
  bash "${IDENTITY_SCRIPT}" >/dev/null 2>&1; then
  fail "mismatched public key was accepted"
fi
[[ "$(sha256sum "${PRIVATE_KEY}" | awk '{ print $1 }')" == "${private_hash_before}" ]] \
  || fail "mismatch handling modified the private key"
cp "${TEST_ROOT}/expected-public.der" "${PUBLIC_KEY}"
chmod 0644 "${PUBLIC_KEY}"

ORPHAN_KEY_DIR="${TEST_ROOT}/orphan-identity"
ORPHAN_STATE_DIR="${TEST_ROOT}/orphan-state"
mkdir -p "${ORPHAN_STATE_DIR}"
printf '%s\n' '{"deployment_id":"dep_preserved_without_key"}' \
  > "${ORPHAN_STATE_DIR}/deployment-state.json"
if MYSCOUTEE_REGISTRY_KEY_DIR="${ORPHAN_KEY_DIR}" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${ORPHAN_STATE_DIR}" \
  bash "${IDENTITY_SCRIPT}" >/dev/null 2>&1; then
  fail "new identity was generated over preserved registry state"
fi

SYMLINK_STATE_KEY_DIR="${TEST_ROOT}/symlink-state-identity"
SYMLINK_STATE_DIR="${TEST_ROOT}/preserved-symlink-state"
mkdir -p "${SYMLINK_STATE_DIR}"
ln -s "${TEST_ROOT}/missing-state-target" "${SYMLINK_STATE_DIR}/preserved-entry"
if MYSCOUTEE_REGISTRY_KEY_DIR="${SYMLINK_STATE_KEY_DIR}" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${SYMLINK_STATE_DIR}" \
  bash "${IDENTITY_SCRIPT}" >/dev/null 2>&1; then
  fail "new identity was generated over a symbolic-link state entry"
fi

deployment_fingerprint="sha256:$(sha256sum "${PUBLIC_KEY}" | awk '{ print $1 }')"
deployment_id="dep_0123456789abcdef0123456789abcdef"
registry_private_key="${TEST_ROOT}/registry-private-key.pem"
registry_public_key="${TEST_ROOT}/registry-public-key.der"
registration_message="${TEST_ROOT}/registration-receipt-message"
registration_signature_file="${TEST_ROOT}/registration-receipt-signature"
batch_message="${TEST_ROOT}/batch-receipt-message"
batch_signature_file="${TEST_ROOT}/batch-receipt-signature"
openssl genpkey -algorithm ED25519 -out "${registry_private_key}"
openssl pkey \
  -in "${registry_private_key}" \
  -pubout \
  -outform DER \
  -out "${registry_public_key}"
registry_public_key_base64="$(base64 -w 0 "${registry_public_key}")"
registry_fingerprint="sha256:$(sha256sum "${registry_public_key}" | awk '{ print $1 }')"
registry_key_id="rkey_${registry_fingerprint#sha256:}"
registry_key_id="${registry_key_id:0:37}"
zero_hash="sha256:0000000000000000000000000000000000000000000000000000000000000000"
batch_id="batch_0123456789abcdef0123456789abcdef"
registration_idempotency_key="registration_packaging_test"
installation_idempotency_key="installation_packaging_test"
registered_at="2026-07-28T00:00:00Z"
accepted_at="2026-07-28T00:00:01Z"
printf '%s\n' \
  "myscoutee-registry-registration-receipt-v1" \
  "1" \
  "test-program:parent-a" \
  "${deployment_id}" \
  "${deployment_fingerprint}" \
  "${registered_at}" \
  "${registry_key_id}" > "${registration_message}"
openssl pkeyutl \
  -sign \
  -inkey "${registry_private_key}" \
  -rawin \
  -in "${registration_message}" \
  -out "${registration_signature_file}"
registration_signature="$(base64 -w 0 "${registration_signature_file}")"
commitment_hash="$(canonical_hash \
  "myscoutee-registry-installation-test-v1" \
  "${deployment_id}" \
  "${installation_idempotency_key}")"
batch_hash="$(canonical_hash \
  "myscoutee-registry-mau-batch-payload-v1" \
  "installation-test" \
  "2026-07" \
  "installation-test-v1" \
  "0" \
  "${commitment_hash}")"
entry_hash="$(canonical_hash \
  "myscoutee-registry-ledger-entry-v1" \
  "1" \
  "test-program:parent-a" \
  "1" \
  "INSTALLATION_TEST_BATCH_ACCEPTED" \
  "${deployment_id}" \
  "${batch_id}" \
  "installation-test" \
  "2026-07" \
  "installation-test-v1" \
  "0" \
  "${batch_hash}" \
  "${zero_hash}" \
  "${accepted_at}")"
printf '%s\n' \
  "myscoutee-registry-mau-receipt-v1" \
  "1" \
  "test-program:parent-a" \
  "${batch_id}" \
  "${deployment_id}" \
  "1" \
  "${entry_hash}" \
  "${zero_hash}" \
  "${batch_hash}" \
  "installation-test" \
  "2026-07" \
  "installation-test-v1" \
  "0" \
  "${accepted_at}" \
  "2026-07-28" \
  "${registry_key_id}" > "${batch_message}"
openssl pkeyutl \
  -sign \
  -inkey "${registry_private_key}" \
  -rawin \
  -in "${batch_message}" \
  -out "${batch_signature_file}"
batch_signature="$(base64 -w 0 "${batch_signature_file}")"
jq -n \
  --arg deployment_fingerprint "${deployment_fingerprint}" \
  --arg deployment_id "${deployment_id}" \
  --arg registry_key_id "${registry_key_id}" \
  --arg registry_fingerprint "${registry_fingerprint}" \
  --arg registry_public_key "${registry_public_key_base64}" \
  --arg registration_signature "${registration_signature}" \
  --arg registration_idempotency_key "${registration_idempotency_key}" \
  --arg installation_idempotency_key "${installation_idempotency_key}" \
  --arg registered_at "${registered_at}" \
  --arg accepted_at "${accepted_at}" \
  --arg entry_hash "${entry_hash}" \
  --arg batch_hash "${batch_hash}" \
  --arg batch_signature "${batch_signature}" \
  --arg zero_hash "${zero_hash}" \
  --arg batch_id "${batch_id}" \
  '{
    schema_version: 1,
    protocol_version: "1",
    registry_scope: "test-program:parent-a",
    public_key_fingerprint: $deployment_fingerprint,
    registration_idempotency_key: $registration_idempotency_key,
    registration_software_version: "packaging-test",
    installation_idempotency_key: $installation_idempotency_key,
    installation_period: "2026-07",
    trusted_registry_key_fingerprint: $registry_fingerprint,
    deployment_id: $deployment_id,
    registration: {
      receipt: {
        protocol_version: "1",
        registry_scope: "test-program:parent-a",
        deployment_id: $deployment_id,
        registered_at: $registered_at,
        public_key_fingerprint: $deployment_fingerprint,
        registry_key_id: $registry_key_id,
        registry_public_key: $registry_public_key,
        receipt_signature: $registration_signature,
        duplicate: false
      }
    },
    installation_batch: {
      protocol_version: "1",
      registry_scope: "test-program:parent-a",
      batch_id: $batch_id,
      deployment_id: $deployment_id,
      idempotency_key: $installation_idempotency_key,
      duplicate: false,
      receipt: {
        ledger_index: 1,
        entry_hash: $entry_hash,
        previous_entry_hash: $zero_hash,
        batch_hash: $batch_hash,
        kind: "installation-test",
        period: "2026-07",
        ruleset_version: "installation-test-v1",
        qualified_mau_count: 0,
        accepted_at: $accepted_at,
        checkpoint_date: "2026-07-28",
        registry_scope: "test-program:parent-a",
        registry_key_id: $registry_key_id,
        registry_public_key: $registry_public_key,
        signature: $batch_signature
      }
    },
    updated_at: "2026-07-28T00:00:02Z"
  }' > "${STATE_DIR}/deployment-state.json"
jq '.installation_batch' "${STATE_DIR}/deployment-state.json" \
  > "${STATE_DIR}/receipts/installation-test-${batch_id}.json"

SERVER_DIR="${TEST_ROOT}/server"
BACKUP_DIR="${TEST_ROOT}/backups"
STUB_DIR="${TEST_ROOT}/stubs"
CONFIG_SOURCE_DIR="${TEST_ROOT}/config-source"
mkdir -p "${SERVER_DIR}" "${BACKUP_DIR}" "${STUB_DIR}" "${CONFIG_SOURCE_DIR}"
printf '%s\n' 'REGISTRY_EXPECTED_KEY_FINGERPRINT=sha256:test-only' \
  > "${CONFIG_SOURCE_DIR}/myscoutee.env"
printf '%s\n' 'MONGO_APP_PASSWORD=test-only' \
  > "${CONFIG_SOURCE_DIR}/myscoutee.secrets.env"
ln -s "${CONFIG_SOURCE_DIR}/myscoutee.env" "${SERVER_DIR}/.env"
ln -s "${CONFIG_SOURCE_DIR}/myscoutee.secrets.env" "${SERVER_DIR}/.env.secrets"

cat > "${STUB_DIR}/docker" <<'STUB'
#!/usr/bin/env bash
exit 0
STUB
cat > "${STUB_DIR}/systemctl" <<'STUB'
#!/usr/bin/env bash
exit 1
STUB
chmod 0755 "${STUB_DIR}/docker" "${STUB_DIR}/systemctl"

backup_path="$(
  PATH="${STUB_DIR}:${PATH}" \
  MYSCOUTEE_SERVER_DIR="${SERVER_DIR}" \
  MYSCOUTEE_BACKUP_DIR="${BACKUP_DIR}" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${KEY_DIR}" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${STATE_DIR}" \
    bash "${BACKUP_SCRIPT}" 2>/dev/null
)"

[[ -s "${backup_path}" ]] || fail "backup archive was not created"
assert_file_mode 600 "${backup_path}"
tar -tzf "${backup_path}" | grep -q './registry/keys/deployment-private-key.pem' \
  || fail "backup omitted the deployment private key"
tar -tzf "${backup_path}" | grep -q './registry/keys/deployment-public-key.der' \
  || fail "backup omitted the deployment public key"
tar -tzf "${backup_path}" | grep -q './registry/state/deployment-state.json' \
  || fail "backup omitted deployment registry state"
tar -tzf "${backup_path}" \
  | grep -q "./registry/state/receipts/installation-test-${batch_id}.json" \
  || fail "backup omitted deployment registry receipts"
BACKUP_INSPECT_DIR="${TEST_ROOT}/backup-inspect"
mkdir -p "${BACKUP_INSPECT_DIR}"
tar -C "${BACKUP_INSPECT_DIR}" -xzf "${backup_path}"
[[ -f "${BACKUP_INSPECT_DIR}/config/.env" \
  && ! -L "${BACKUP_INSPECT_DIR}/config/.env" ]] \
  || fail "backup preserved the installed .env symlink instead of its contents"
[[ -f "${BACKUP_INSPECT_DIR}/config/.env.secrets" \
  && ! -L "${BACKUP_INSPECT_DIR}/config/.env.secrets" ]] \
  || fail "backup preserved the installed secrets symlink instead of its contents"
grep -q 'REGISTRY_EXPECTED_KEY_FINGERPRINT=sha256:test-only' \
  "${BACKUP_INSPECT_DIR}/config/.env" \
  || fail "backup omitted registry trust configuration"
grep -q 'MONGO_APP_PASSWORD=test-only' \
  "${BACKUP_INSPECT_DIR}/config/.env.secrets" \
  || fail "backup omitted installed credentials"

INCOMPLETE_BACKUP_DIR="${TEST_ROOT}/incomplete-backup"
INCOMPLETE_BACKUP_PATH="${TEST_ROOT}/incomplete-registry-backup.tar.gz"
mkdir -p "${INCOMPLETE_BACKUP_DIR}"
cp -a "${BACKUP_INSPECT_DIR}/." "${INCOMPLETE_BACKUP_DIR}/"
rm -f "${INCOMPLETE_BACKUP_DIR}/registry/state/deployment-state.json"
tar -C "${INCOMPLETE_BACKUP_DIR}" -czf "${INCOMPLETE_BACKUP_PATH}" .
if PATH="${STUB_DIR}:${PATH}" \
  CONFIRM_RESTORE=true \
  RESTORE_REGISTRY=true \
  MYSCOUTEE_SERVER_DIR="${TEST_ROOT}/incomplete-restore-server" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${TEST_ROOT}/incomplete-restore-identity" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${TEST_ROOT}/incomplete-restore-state" \
  bash "${RESTORE_SCRIPT}" "${INCOMPLETE_BACKUP_PATH}" >/dev/null 2>&1; then
  fail "restore accepted a deployment key without its matching registry state"
fi

MIXED_BACKUP_DIR="${TEST_ROOT}/mixed-backup"
MIXED_BACKUP_PATH="${TEST_ROOT}/mixed-registry-backup.tar.gz"
mkdir -p "${MIXED_BACKUP_DIR}"
cp -a "${BACKUP_INSPECT_DIR}/." "${MIXED_BACKUP_DIR}/"
sed -i \
  's/sha256:[0-9a-f]\{64\}/sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/' \
  "${MIXED_BACKUP_DIR}/registry/state/deployment-state.json"
tar -C "${MIXED_BACKUP_DIR}" -czf "${MIXED_BACKUP_PATH}" .
if PATH="${STUB_DIR}:${PATH}" \
  CONFIRM_RESTORE=true \
  RESTORE_REGISTRY=true \
  MYSCOUTEE_SERVER_DIR="${TEST_ROOT}/mixed-restore-server" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${TEST_ROOT}/mixed-restore-identity" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${TEST_ROOT}/mixed-restore-state" \
  bash "${RESTORE_SCRIPT}" "${MIXED_BACKUP_PATH}" >/dev/null 2>&1; then
  fail "restore accepted state bound to a different deployment key"
fi

TRUNCATED_BACKUP_DIR="${TEST_ROOT}/truncated-backup"
TRUNCATED_BACKUP_PATH="${TEST_ROOT}/truncated-registry-backup.tar.gz"
mkdir -p "${TRUNCATED_BACKUP_DIR}"
cp -a "${BACKUP_INSPECT_DIR}/." "${TRUNCATED_BACKUP_DIR}/"
head -c 240 "${BACKUP_INSPECT_DIR}/registry/state/deployment-state.json" \
  > "${TRUNCATED_BACKUP_DIR}/registry/state/deployment-state.json"
tar -C "${TRUNCATED_BACKUP_DIR}" -czf "${TRUNCATED_BACKUP_PATH}" .
if PATH="${STUB_DIR}:${PATH}" \
  CONFIRM_RESTORE=true \
  RESTORE_REGISTRY=true \
  MYSCOUTEE_SERVER_DIR="${TEST_ROOT}/truncated-restore-server" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${TEST_ROOT}/truncated-restore-identity" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${TEST_ROOT}/truncated-restore-state" \
  bash "${RESTORE_SCRIPT}" "${TRUNCATED_BACKUP_PATH}" >/dev/null 2>&1; then
  fail "restore accepted truncated deployment registry JSON"
fi

MALFORMED_RECEIPT_BACKUP_DIR="${TEST_ROOT}/malformed-receipt-backup"
MALFORMED_RECEIPT_BACKUP_PATH="${TEST_ROOT}/malformed-receipt-registry-backup.tar.gz"
mkdir -p "${MALFORMED_RECEIPT_BACKUP_DIR}"
cp -a "${BACKUP_INSPECT_DIR}/." "${MALFORMED_RECEIPT_BACKUP_DIR}/"
printf '%s' '{"protocol_version":"1"' \
  > "${MALFORMED_RECEIPT_BACKUP_DIR}/registry/state/receipts/installation-test-${batch_id}.json"
tar -C "${MALFORMED_RECEIPT_BACKUP_DIR}" -czf "${MALFORMED_RECEIPT_BACKUP_PATH}" .
if PATH="${STUB_DIR}:${PATH}" \
  CONFIRM_RESTORE=true \
  RESTORE_REGISTRY=true \
  MYSCOUTEE_SERVER_DIR="${TEST_ROOT}/malformed-receipt-restore-server" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${TEST_ROOT}/malformed-receipt-restore-identity" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${TEST_ROOT}/malformed-receipt-restore-state" \
  bash "${RESTORE_SCRIPT}" "${MALFORMED_RECEIPT_BACKUP_PATH}" >/dev/null 2>&1; then
  fail "restore accepted a malformed registry receipt"
fi

INVALID_SIGNATURE_BACKUP_DIR="${TEST_ROOT}/invalid-signature-backup"
INVALID_SIGNATURE_BACKUP_PATH="${TEST_ROOT}/invalid-signature-registry-backup.tar.gz"
mkdir -p "${INVALID_SIGNATURE_BACKUP_DIR}"
cp -a "${BACKUP_INSPECT_DIR}/." "${INVALID_SIGNATURE_BACKUP_DIR}/"
jq --arg signature "${batch_signature}" \
  '.registration.receipt.receipt_signature = $signature' \
  "${INVALID_SIGNATURE_BACKUP_DIR}/registry/state/deployment-state.json" \
  > "${INVALID_SIGNATURE_BACKUP_DIR}/registry/state/deployment-state.json.tmp"
mv \
  "${INVALID_SIGNATURE_BACKUP_DIR}/registry/state/deployment-state.json.tmp" \
  "${INVALID_SIGNATURE_BACKUP_DIR}/registry/state/deployment-state.json"
tar -C "${INVALID_SIGNATURE_BACKUP_DIR}" -czf "${INVALID_SIGNATURE_BACKUP_PATH}" .
if PATH="${STUB_DIR}:${PATH}" \
  CONFIRM_RESTORE=true \
  RESTORE_REGISTRY=true \
  MYSCOUTEE_SERVER_DIR="${TEST_ROOT}/invalid-signature-restore-server" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${TEST_ROOT}/invalid-signature-restore-identity" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${TEST_ROOT}/invalid-signature-restore-state" \
  bash "${RESTORE_SCRIPT}" "${INVALID_SIGNATURE_BACKUP_PATH}" >/dev/null 2>&1; then
  fail "restore accepted a registry state with an invalid central signature"
fi

UNRELATED_RECEIPT_BACKUP_DIR="${TEST_ROOT}/unrelated-receipt-backup"
UNRELATED_RECEIPT_BACKUP_PATH="${TEST_ROOT}/unrelated-receipt-registry-backup.tar.gz"
mkdir -p "${UNRELATED_RECEIPT_BACKUP_DIR}"
cp -a "${BACKUP_INSPECT_DIR}/." "${UNRELATED_RECEIPT_BACKUP_DIR}/"
jq '.duplicate = true' \
  "${UNRELATED_RECEIPT_BACKUP_DIR}/registry/state/receipts/installation-test-${batch_id}.json" \
  > "${UNRELATED_RECEIPT_BACKUP_DIR}/registry/state/receipts/installation-test-${batch_id}.json.tmp"
mv \
  "${UNRELATED_RECEIPT_BACKUP_DIR}/registry/state/receipts/installation-test-${batch_id}.json.tmp" \
  "${UNRELATED_RECEIPT_BACKUP_DIR}/registry/state/receipts/installation-test-${batch_id}.json"
tar -C "${UNRELATED_RECEIPT_BACKUP_DIR}" -czf "${UNRELATED_RECEIPT_BACKUP_PATH}" .
if PATH="${STUB_DIR}:${PATH}" \
  CONFIRM_RESTORE=true \
  RESTORE_REGISTRY=true \
  MYSCOUTEE_SERVER_DIR="${TEST_ROOT}/unrelated-receipt-restore-server" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${TEST_ROOT}/unrelated-receipt-restore-identity" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${TEST_ROOT}/unrelated-receipt-restore-state" \
  bash "${RESTORE_SCRIPT}" "${UNRELATED_RECEIPT_BACKUP_PATH}" >/dev/null 2>&1; then
  fail "restore accepted a standalone receipt that differs from deployment state"
fi

RESTORE_SERVER_DIR="${TEST_ROOT}/restore-server"
RESTORE_KEY_DIR="${TEST_ROOT}/restored-identity"
RESTORE_STATE_DIR="${TEST_ROOT}/restored-state"
mkdir -p "${RESTORE_SERVER_DIR}"

PATH="${STUB_DIR}:${PATH}" \
CONFIRM_RESTORE=true \
RESTORE_REGISTRY=true \
MYSCOUTEE_SERVER_DIR="${RESTORE_SERVER_DIR}" \
MYSCOUTEE_REGISTRY_KEY_DIR="${RESTORE_KEY_DIR}" \
MYSCOUTEE_REGISTRY_STATE_DIR="${RESTORE_STATE_DIR}" \
  bash "${RESTORE_SCRIPT}" "${backup_path}" >/dev/null

cmp -s "${PRIVATE_KEY}" "${RESTORE_KEY_DIR}/deployment-private-key.pem" \
  || fail "restore changed the deployment private key"
cmp -s "${TEST_ROOT}/expected-public.der" "${RESTORE_KEY_DIR}/deployment-public-key.der" \
  || fail "restore changed the deployment public key"
grep -q 'dep_0123456789abcdef0123456789abcdef' "${RESTORE_STATE_DIR}/deployment-state.json" \
  || fail "restore omitted deployment registry state"
assert_file_mode 600 "${RESTORE_KEY_DIR}/deployment-private-key.pem"
assert_file_mode 644 "${RESTORE_KEY_DIR}/deployment-public-key.der"

SYMLINK_TARGET="${TEST_ROOT}/symlink-target"
SYMLINK_KEY_DIR="${TEST_ROOT}/symlink-identity"
mkdir -p "${SYMLINK_TARGET}"
ln -s "${SYMLINK_TARGET}" "${SYMLINK_KEY_DIR}"
if PATH="${STUB_DIR}:${PATH}" \
  CONFIRM_RESTORE=true \
  RESTORE_REGISTRY=true \
  MYSCOUTEE_SERVER_DIR="${RESTORE_SERVER_DIR}" \
  MYSCOUTEE_REGISTRY_KEY_DIR="${SYMLINK_KEY_DIR}" \
  MYSCOUTEE_REGISTRY_STATE_DIR="${TEST_ROOT}/symlink-state" \
  bash "${RESTORE_SCRIPT}" "${backup_path}" >/dev/null 2>&1; then
  fail "restore accepted a symbolic-link key target"
fi

RACE_STUB_DIR="${TEST_ROOT}/race-stubs"
RACE_SERVER_DIR="${TEST_ROOT}/race-server"
RACE_KEY_DIR="${TEST_ROOT}/race-identity"
RACE_STATE_DIR="${TEST_ROOT}/race-state"
RACE_LOG="${TEST_ROOT}/race-docker.log"
mkdir -p "${RACE_STUB_DIR}" "${RACE_SERVER_DIR}"
printf '%s\n' 'FIREBASE_ENABLED=false' > "${RACE_SERVER_DIR}/.env"
cat > "${RACE_STUB_DIR}/docker" <<'STUB'
#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "ps" ]]; then
  printf '%s\n' myscoutee
  exit 0
fi
if [[ "${1:-}" == "compose" && " $* " == *" stop profilemanagement "* ]]; then
  [[ ! -e "${MYSCOUTEE_REGISTRY_KEY_DIR}/deployment-private-key.pem" ]]
  printf '%s\n' stop >> "${REGISTRY_RESTORE_TEST_LOG}"
  exit 0
fi
if [[ "${1:-}" == "compose" && " $* " == *" up -d --force-recreate profilemanagement "* ]]; then
  grep -q 'dep_0123456789abcdef0123456789abcdef' \
    "${MYSCOUTEE_REGISTRY_STATE_DIR}/deployment-state.json"
  printf '%s\n' start >> "${REGISTRY_RESTORE_TEST_LOG}"
  exit 0
fi
exit 0
STUB
chmod 0755 "${RACE_STUB_DIR}/docker"

PATH="${RACE_STUB_DIR}:${PATH}" \
CONFIRM_RESTORE=true \
RESTORE_REGISTRY=true \
REGISTRY_RESTORE_TEST_LOG="${RACE_LOG}" \
MYSCOUTEE_SERVER_DIR="${RACE_SERVER_DIR}" \
MYSCOUTEE_REGISTRY_KEY_DIR="${RACE_KEY_DIR}" \
MYSCOUTEE_REGISTRY_STATE_DIR="${RACE_STATE_DIR}" \
  bash "${RESTORE_SCRIPT}" "${backup_path}" >/dev/null

[[ "$(sed -n '1p' "${RACE_LOG}")" == "stop" ]] \
  || fail "registry restore did not stop the running backend before replacement"
[[ "$(sed -n '2p' "${RACE_LOG}")" == "start" ]] \
  || fail "registry restore did not recreate the backend after replacement"

if grep -Fxq '/opt/myscoutee/packaging/scripts/ensure-deployment-identity.sh' \
  "${REPO_ROOT}/packaging/debian/postinst"; then
  fail "postinst initializes a node identity before operator consent"
fi
grep -Fq 'install -d -m 0700 /etc/myscoutee/registry' \
  "${REPO_ROOT}/packaging/debian/postinst" \
  || fail "postinst does not create the empty deployment-key directory with mode 0700"
grep -Fq 'install -d -m 0700 /var/lib/myscoutee/registry' \
  "${REPO_ROOT}/packaging/debian/postinst" \
  || fail "postinst does not create the empty registry-state directory with mode 0700"
grep -Eq '^Depends:.*openssl' "${REPO_ROOT}/packaging/debian/control" \
  || fail "openssl is not a hard package dependency"
grep -Eq '^Depends:.*jq' "${REPO_ROOT}/packaging/debian/control" \
  || fail "jq is not a hard dependency for guarded registry-state restore"
grep -Fxq 'REGISTRY_ENABLED=false' \
  "${REPO_ROOT}/packaging/templates/myscoutee.env" \
  || fail "package enables registry participation before operator consent"
grep -Fxq 'REGISTRY_OUTBOUND_ALLOWED=false' \
  "${REPO_ROOT}/packaging/templates/myscoutee.env" \
  || fail "package permits registry communication before operator consent"
grep -Fxq 'REGISTRY_OPERATOR_REGISTRATION_CONFIRMED=false' \
  "${REPO_ROOT}/packaging/templates/myscoutee.env" \
  || fail "package marks registry registration confirmed before operator consent"
grep -Fxq 'REGISTRY_BASE_URL=' \
  "${REPO_ROOT}/packaging/templates/myscoutee.env" \
  || fail "package preselects a registry endpoint"
grep -Fxq 'REGISTRY_SCOPE=' \
  "${REPO_ROOT}/packaging/templates/myscoutee.env" \
  || fail "package preselects a registry scope"
grep -Fxq 'REGISTRY_TRUST_ON_FIRST_USE=false' \
  "${REPO_ROOT}/packaging/templates/myscoutee.env" \
  || fail "package trusts a registry before operator inspection"
grep -Fxq 'OPERATOR_USER=' \
  "${REPO_ROOT}/packaging/templates/myscoutee.env" \
  || fail "package does not expose an explicit Firebase operator allowlist"
grep -Fq 'BACKUP_DIR="/var/backups/myscoutee"' \
  "${REPO_ROOT}/packaging/scripts/backup-production.sh" \
  || fail "installed backups do not default outside the purgeable /opt tree"
if grep -Fq 'rm -rf /var/backups/myscoutee' \
  "${REPO_ROOT}/packaging/debian/postrm"; then
  fail "package purge deletes the external deployment recovery archive"
fi
grep -Fq 'cp -a "${REPO_ROOT}/packaging/scripts"' \
  "${REPO_ROOT}/packaging/scripts/package-production.sh" \
  || fail "package staging does not include the deployment identity helper"
grep -Fq 'packaging/scripts" -type f -name "*.sh" -exec chmod 0755' \
  "${REPO_ROOT}/packaging/scripts/package-production.sh" \
  || fail "package staging does not make the deployment identity helper executable"
grep -Fq 'sync -f "${KEY_DIR}"' "${IDENTITY_SCRIPT}" \
  || fail "deployment identity helper does not durably sync its key directory"
grep -Fq 'sync -f "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"' "${BACKUP_SCRIPT}" \
  || fail "production backup reports success before syncing its archive"
grep -Fq 'sync -f "${REGISTRY_STATE_DIR}"' "${RESTORE_SCRIPT}" \
  || fail "registry restore reports success before syncing restored state"

for compose_file in \
  "${REPO_ROOT}/packaging/compose/docker-compose.production.yml" \
  "${REPO_ROOT}/server/docker-compose-prod.yml"; do
  grep -q 'REGISTRY_OUTBOUND_ALLOWED' "${compose_file}" \
    || fail "${compose_file} does not pass the outbound registry gate"
  grep -q 'REGISTRY_OPERATOR_REGISTRATION_CONFIRMED' "${compose_file}" \
    || fail "${compose_file} does not pass the operator confirmation gate"
  grep -q 'OPERATOR_USER' "${compose_file}" \
    || fail "${compose_file} does not pass the Firebase operator allowlist"
  grep -q ':/etc/myscoutee/registry:rw' "${compose_file}" \
    || fail "${compose_file} does not let the authenticated Java initializer persist registry keys"
  grep -q ':/var/lib/myscoutee/registry' "${compose_file}" \
    || fail "${compose_file} does not mount registry state read-write"
done

DEMO_DEV_COMPOSE="${REPO_ROOT}/server/docker-compose-dev.yml"
CANONICAL_DEV_COMPOSE="${REPO_ROOT}/server/docker-compose.yml"
DEMO_USERS="${REPO_ROOT}/server/docker/conf/mongodb/demo_db/users.json"
E2E_USERS="${REPO_ROOT}/server/docker/conf/mongodb/e2e_db/users.json"

grep -Fq -- '- docker-compose-dev.yml' "${CANONICAL_DEV_COMPOSE}" \
  || fail "canonical docker compose entrypoint does not include the normal dev stack"
if grep -Fq 'docker-compose.registry-local.yml' "${CANONICAL_DEV_COMPOSE}"; then
  fail "canonical dev Compose still depends on the removed registry overlay"
fi
grep -Fq 'REGISTRY_DEMO_MODE: "live"' "${DEMO_DEV_COMPOSE}" \
  || fail "normal dev Compose is not explicitly restricted to live DEMO registry mode"
grep -Fq 'myscoutee-registry-dev-demo-data-v1' "${DEMO_DEV_COMPOSE}" \
  || fail "normal dev Compose does not use its explicit demo SQLite/signing-key volume"
grep -Fq '/workspace/data/registry-demo-keys/' "${DEMO_DEV_COMPOSE}" \
  || fail "local demo deployment keys are not separated from production keys"
grep -Fq '/workspace/data/registry-demo-state' "${DEMO_DEV_COMPOSE}" \
  || fail "local demo deployment state is not separated from production state"

for compose_file in \
  "${REPO_ROOT}/packaging/compose/docker-compose.production.yml" \
  "${REPO_ROOT}/server/docker-compose-prod.yml"; do
  if grep -Eq '^[[:space:]]+registry(-demo)?:[[:space:]]*$|REGISTRY_DEMO_' "${compose_file}"; then
    fail "${compose_file} bundles or configures a demo registry in production"
  fi
done

for seed_file in "${DEMO_USERS}" "${E2E_USERS}"; do
  jq -e '
    [.[] | select(
      .userId == "operator-demo-dev"
      and .email == "operator@myscoutee.local"
      and .operator == true
      and .hostTier == "Operator"
    )] | length == 1
  ' "${seed_file}" >/dev/null \
    || fail "${seed_file} does not contain exactly one selectable demo operator"
done

if docker compose version >/dev/null 2>&1; then
  COMPOSE_STAGE="${TEST_ROOT}/compose-stage"
  mkdir -p "${COMPOSE_STAGE}/projects/profile/secrets"
  cp "${REPO_ROOT}/packaging/compose/docker-compose.production.yml" \
    "${COMPOSE_STAGE}/docker-compose-prod.yml"
  cp "${REPO_ROOT}/server/.env.secrets.example" "${COMPOSE_STAGE}/.env.secrets"
  cp "${REPO_ROOT}/server/projects/profile/secrets/firebase-service-account.json.example" \
    "${COMPOSE_STAGE}/projects/profile/secrets/firebase-service-account.json"
  docker compose \
    --env-file "${REPO_ROOT}/packaging/templates/myscoutee.env" \
    -f "${COMPOSE_STAGE}/docker-compose-prod.yml" \
    config >/dev/null \
    || fail "packaged production Compose configuration does not render"

  (
    cd "${REPO_ROOT}/server"
    docker compose --env-file .env -f docker-compose-prod.yml config >/dev/null
  ) || fail "source production Compose configuration does not render"

  DEV_COMPOSE_JSON="$(
    cd "${REPO_ROOT}/server"
    docker compose config --format json
  )" || fail "canonical development Compose configuration does not render"
  jq -e '
    .services.registry.container_name == "registry"
    and .services.registry.image == "myscoutee-registry:1.0.0-dev"
    and .services.registry.environment.REGISTRY_SCOPE == "demo:local-registry"
    and .services.registry.environment.REGISTRY_DATABASE_PATH == "/data/registry.db"
    and .services.registry.environment.REGISTRY_SIGNING_KEY_PATH == "/data/registry-signing-key.pem"
    and .volumes["registry-dev-demo-data"].name == "myscoutee-registry-dev-demo-data-v1"
    and .services.profilemanagement.environment.MONGODB_DATABASE == "demo_db"
    and .services.profilemanagement.environment.OPERATOR_USER == "dev@myscoutee.local"
    and .services.profilemanagement.environment.REGISTRY_DEMO_MODE == "live"
    and .services.profilemanagement.environment.REGISTRY_DEMO_CANDIDATE_BASE_URL == "http://registry:8080"
    and .services.profilemanagement.environment.REGISTRY_DEMO_CANDIDATE_SCOPE == "demo:local-registry"
    and .services.profilemanagement.environment.REGISTRY_DEMO_PRIVATE_KEY_PATH
      == "/workspace/data/registry-demo-keys/deployment-private-key.pem"
    and .services.profilemanagement.environment.REGISTRY_DEMO_STATE_DIR
      == "/workspace/data/registry-demo-state"
    and (.services.profilemanagement.environment | has("REGISTRY_ENABLED") | not)
    and (.services.profilemanagement.environment | has("REGISTRY_OUTBOUND_ALLOWED") | not)
    and (.services.profilemanagement.environment
      | has("REGISTRY_OPERATOR_REGISTRATION_CONFIRMED")
      | not)
    and (.services.profilemanagement.environment | has("REGISTRY_PRIVATE_KEY_PATH") | not)
    and (.services.profilemanagement.environment | has("REGISTRY_STATE_DIR") | not)
  ' <<<"${DEV_COMPOSE_JSON}" >/dev/null \
    || fail "canonical dev Compose mixes demo registry state with real registry configuration"
fi

echo "Registry packaging tests passed."
