#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "TLS worker test failed: $1" >&2
  exit 1
}

TEST_ROOT="$(mktemp -d)"
trap 'rm -rf -- "${TEST_ROOT}"' EXIT

export MYSCOUTEE_TLS_STATE_DIR="${TEST_ROOT}/state"
export MYSCOUTEE_TLS_ENV_FILE="${TEST_ROOT}/myscoutee.env"
export MYSCOUTEE_TLS_SERVER_DIR="${TEST_ROOT}/server"
export MYSCOUTEE_API_USER_ID="$(id -u)"
export MYSCOUTEE_API_GROUP_ID="$(id -g)"
export MYSCOUTEE_TLS_WORKER_USER_ID="$(id -u)"
mkdir -p \
  "${MYSCOUTEE_TLS_SERVER_DIR}/data/certbot/conf" \
  "${MYSCOUTEE_TLS_SERVER_DIR}/data/certbot/www" \
  "${MYSCOUTEE_TLS_SERVER_DIR}/docker/conf/nginx/keys"
printf '%s\n' \
  'DOMAIN=localhost' \
  'LETSENCRYPT_ENABLED=false' \
  > "${MYSCOUTEE_TLS_ENV_FILE}"

# shellcheck source=../scripts/myscoutee-tls-worker.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/../scripts/myscoutee-tls-worker.sh"

safe_domain app.example.test \
  || fail "a valid public domain was rejected"
if safe_domain localhost || safe_domain '-bad.example.test'; then
  fail "an unsafe domain was accepted"
fi

CERTIFICATE="${TEST_ROOT}/certificate.pem"
PRIVATE_KEY="${TEST_ROOT}/private-key.pem"
openssl req -x509 -nodes -days 30 -newkey rsa:2048 \
  -keyout "${PRIVATE_KEY}" \
  -out "${CERTIFICATE}" \
  -subj '/CN=app.example.test' \
  -addext 'subjectAltName=DNS:app.example.test' \
  >/dev/null 2>&1
validate_pair "${CERTIFICATE}" "${PRIVATE_KEY}" app.example.test \
  || fail "a matching certificate and private key were rejected"
if validate_pair "${CERTIFICATE}" "${PRIVATE_KEY}" other.example.test \
    >/dev/null 2>&1; then
  fail "a certificate for another domain was accepted"
fi

prepare_directories
JOB_ID="tls_0123456789abcdef0123456789abcdef"
jq -n \
  --arg jobId "${JOB_ID}" \
  --arg certificate "$(cat "${CERTIFICATE}")" \
  --arg privateKey "$(cat "${PRIVATE_KEY}")" \
  '{
    schemaVersion: 1,
    jobId: $jobId,
    action: "TEST_CERTIFICATE",
    requestedAt: "2026-07-30T00:00:00Z",
    requestedBy: "operator-test",
    configuration: {
      enabled: true,
      mode: "MANUAL",
      domain: "app.example.test",
      contactEmail: "",
      autoRenew: false,
      certificate: $certificate,
      privateKey: $privateKey
    }
  }' > "${REQUEST_DIR}/${JOB_ID}.json"

process_request "${REQUEST_DIR}/${JOB_ID}.json" \
  || fail "the valid certificate test job failed"
jq -e '
  .jobId == "tls_0123456789abcdef0123456789abcdef"
  and .phase == "COMPLETED"
  and .percent == 100
  and .configuration == null
' "${JOB_ROOT}/${JOB_ID}/status.json" >/dev/null \
  || fail "the certificate test status is invalid"
if rg -l --fixed-strings \
    "$(sed -n '2p' "${PRIVATE_KEY}")" \
    "${MYSCOUTEE_TLS_STATE_DIR}" >/dev/null; then
  fail "private-key material remained in durable TLS state"
fi

echo "TLS worker tests passed."
