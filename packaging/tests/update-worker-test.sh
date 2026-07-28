#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
WORKER_SCRIPT="${REPO_ROOT}/packaging/scripts/myscoutee-update-worker.sh"
SAFE_COPY_HELPER="${REPO_ROOT}/packaging/scripts/myscoutee-safe-copy.py"
TEST_ROOT="$(mktemp -d /tmp/myscoutee-update-worker-test.XXXXXX)"

cleanup() {
  rm -rf "${TEST_ROOT}"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

for command_name in jq openssl sha256sum base64 stat dpkg dpkg-deb tar python3; do
  command -v "${command_name}" >/dev/null 2>&1 \
    || fail "required test command is missing: ${command_name}"
done

STATE_ROOT="${TEST_ROOT}/state"
CACHE_ROOT="${TEST_ROOT}/cache"
AUDIT_ROOT="${TEST_ROOT}/audit"
FAKE_BIN="${TEST_ROOT}/bin"
VERSION_FILE="${TEST_ROOT}/installed-version"
APT_CALLS_FILE="${TEST_ROOT}/apt-calls"
BACKUP_FILE="${TEST_ROOT}/backup.tar.gz"
BACKUP_HELPER="${TEST_ROOT}/backup.sh"
INSTALLED_MANIFEST="${TEST_ROOT}/installed-image-manifest.json"
PRIVATE_KEY="${TEST_ROOT}/release-private-key.pem"
PUBLIC_KEY="${TEST_ROOT}/release-public-key.pem"
PUBLIC_DER="${TEST_ROOT}/release-public-key.der"
PACKAGE_ROOT="${TEST_ROOT}/package-root"
PACKAGE_PATH="${TEST_ROOT}/myscoutee_999.0.0_test.deb"
PACKAGE_VERSION="999.0.0"
PACKAGE_CHANNEL="stable"
HOST_ARCH="$(dpkg --print-architecture)"
NGIN_BASE_ID="sha256:$(printf '1%.0s' {1..64})"
NGIN_ID="sha256:$(printf '2%.0s' {1..64})"
API_ID="sha256:$(printf '3%.0s' {1..64})"
MINIO_ID="sha256:$(printf '4%.0s' {1..64})"

mkdir -p \
  "${FAKE_BIN}" \
  "${PACKAGE_ROOT}/DEBIAN" \
  "${PACKAGE_ROOT}/opt/myscoutee/packaging"
printf '%s\n' '1.0.0' > "${VERSION_FILE}"
: > "${APT_CALLS_FILE}"

jq -n \
  --arg version "${PACKAGE_VERSION}" \
  --arg nginxBaseId "${NGIN_BASE_ID}" \
  --arg nginxId "${NGIN_ID}" \
  --arg apiId "${API_ID}" \
  --arg minioId "${MINIO_ID}" \
  '{
    schemaVersion: 1,
    releaseVersion: $version,
    bundled: true,
    images: [
      {
        service: "nginx-base",
        container: null,
        reference: ("myscoutee-nginx:" + $version + "-base"),
        imageId: $nginxBaseId
      },
      {
        service: "nginx",
        container: "nginx",
        reference: ("myscoutee-nginx:" + $version + "-prod"),
        imageId: $nginxId
      },
      {
        service: "profilemanagement",
        container: "myscoutee",
        reference: ("myscoutee-api:" + $version + "-prod"),
        imageId: $apiId
      },
      {
        service: "minio",
        container: "minio",
        reference: ("myscoutee-minio:" + $version + "-prod"),
        imageId: $minioId
      }
    ]
  }' > "${PACKAGE_ROOT}/opt/myscoutee/packaging/IMAGE-MANIFEST.json"

printf '%s\n' \
  "Package: myscoutee" \
  "Version: ${PACKAGE_VERSION}" \
  "Section: web" \
  "Priority: optional" \
  "Architecture: ${HOST_ARCH}" \
  "Maintainer: MyScoutee test" \
  "Description: update worker verification fixture" \
  > "${PACKAGE_ROOT}/DEBIAN/control"
dpkg-deb --root-owner-group --build "${PACKAGE_ROOT}" "${PACKAGE_PATH}" >/dev/null

openssl genpkey -algorithm ED25519 -out "${PRIVATE_KEY}"
openssl pkey -in "${PRIVATE_KEY}" -pubout -out "${PUBLIC_KEY}"
openssl pkey -in "${PRIVATE_KEY}" -pubout -outform DER -out "${PUBLIC_DER}"
PUBLIC_KEY_DIGEST="$(sha256sum "${PUBLIC_DER}" | awk '{ print $1 }')"
PACKAGE_KEY_ID="pkey_${PUBLIC_KEY_DIGEST:0:32}"

printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -euo pipefail' \
  'cat "${UPDATE_TEST_VERSION_FILE}"' \
  > "${FAKE_BIN}/dpkg-query"
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -euo pipefail' \
  'artifact="${*: -1}"' \
  'version="$(/usr/bin/dpkg-deb -f "${artifact}" Version)"' \
  'printf "%s\n" "${version}" > "${UPDATE_TEST_VERSION_FILE}"' \
  '/usr/bin/dpkg-deb --fsys-tarfile "${artifact}" | /usr/bin/tar -xOf - ./opt/myscoutee/packaging/IMAGE-MANIFEST.json > "${UPDATE_TEST_INSTALLED_MANIFEST}"' \
  'printf "%s\n" "$*" >> "${UPDATE_TEST_APT_CALLS_FILE}"' \
  > "${FAKE_BIN}/apt-get"
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'exit 0' \
  > "${FAKE_BIN}/systemctl"
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -euo pipefail' \
  'format="${3:-}"' \
  'container="${4:-}"' \
  'if [[ "${1:-}" != "inspect" || "${2:-}" != "--format" ]]; then exit 1; fi' \
  'case "${format}" in' \
  '  "{{.Config.Image}}")' \
  '    case "${container}" in' \
  '      nginx) printf "%s\n" "myscoutee-nginx:999.0.0-prod" ;;' \
  '      myscoutee) printf "%s\n" "myscoutee-api:999.0.0-prod" ;;' \
  '      minio) printf "%s\n" "myscoutee-minio:999.0.0-prod" ;;' \
  '      *) exit 1 ;;' \
  '    esac' \
  '    ;;' \
  '  "{{.Image}}")' \
  '    if [[ "${UPDATE_TEST_BAD_IMAGE:-false}" == "true" && "${container}" == "myscoutee" ]]; then' \
  '      printf "sha256:%064d\n" 0' \
  '    else' \
  '      case "${container}" in' \
  '        nginx) printf "%s\n" "${UPDATE_TEST_NGINX_ID}" ;;' \
  '        myscoutee) printf "%s\n" "${UPDATE_TEST_API_ID}" ;;' \
  '        minio) printf "%s\n" "${UPDATE_TEST_MINIO_ID}" ;;' \
  '        *) exit 1 ;;' \
  '      esac' \
  '    fi' \
  '    ;;' \
  '  *) printf "%s\n" healthy ;;' \
  'esac' \
  > "${FAKE_BIN}/docker"
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -euo pipefail' \
  'work="$(mktemp -d)"' \
  'trap '\''rm -rf "${work}"'\'' EXIT' \
  'printf "%s\n" '\''{"schemaVersion":1,"complete":true}'\'' > "${work}/backup-manifest.json"' \
  'tar -C "${work}" -czf "${UPDATE_TEST_BACKUP_FILE}" .' \
  'chmod 0600 "${UPDATE_TEST_BACKUP_FILE}"' \
  'printf "%s\n" "${UPDATE_TEST_BACKUP_FILE}"' \
  > "${BACKUP_HELPER}"
chmod 0755 \
  "${FAKE_BIN}/dpkg-query" \
  "${FAKE_BIN}/apt-get" \
  "${FAKE_BIN}/systemctl" \
  "${FAKE_BIN}/docker" \
  "${BACKUP_HELPER}" \
  "${SAFE_COPY_HELPER}"

export PATH="${FAKE_BIN}:${PATH}"
export UPDATE_TEST_VERSION_FILE="${VERSION_FILE}"
export UPDATE_TEST_APT_CALLS_FILE="${APT_CALLS_FILE}"
export UPDATE_TEST_INSTALLED_MANIFEST="${INSTALLED_MANIFEST}"
export UPDATE_TEST_BACKUP_FILE="${BACKUP_FILE}"
export UPDATE_TEST_NGINX_ID="${NGIN_ID}"
export UPDATE_TEST_API_ID="${API_ID}"
export UPDATE_TEST_MINIO_ID="${MINIO_ID}"
export MYSCOUTEE_UPDATE_STATE_DIR="${STATE_ROOT}"
export MYSCOUTEE_UPDATE_CACHE_DIR="${CACHE_ROOT}"
export MYSCOUTEE_UPDATE_AUDIT_DIR="${AUDIT_ROOT}"
export MYSCOUTEE_UPDATE_RELEASE_PUBLIC_KEY="${PUBLIC_KEY}"
export MYSCOUTEE_UPDATE_BACKUP_SCRIPT="${BACKUP_HELPER}"
export MYSCOUTEE_UPDATE_SAFE_COPY_HELPER="${SAFE_COPY_HELPER}"
export MYSCOUTEE_UPDATE_INSTALLED_MANIFEST_PATH="${INSTALLED_MANIFEST}"
export MYSCOUTEE_UPDATE_MIN_FREE_BYTES=1
export MYSCOUTEE_UPDATE_HEALTH_TIMEOUT_SECONDS=1
export MYSCOUTEE_UPDATE_CACHE_RETENTION_JOBS=2
export MYSCOUTEE_UPDATE_ENABLED=true
export MYSCOUTEE_API_USER_ID
MYSCOUTEE_API_USER_ID="$(id -u)"
export MYSCOUTEE_API_GROUP_ID
MYSCOUTEE_API_GROUP_ID="$(id -g)"
export MYSCOUTEE_UPDATE_WORKER_USER_ID
MYSCOUTEE_UPDATE_WORKER_USER_ID="$(id -u)"

# shellcheck source=../scripts/myscoutee-update-worker.sh
source "${WORKER_SCRIPT}"

prepare_directories
require_runtime

make_request() {
  local job_id="$1"
  local staged_artifact="$2"
  local request_file="$3"
  local artifact_size artifact_sha message_file signature_file signature

  artifact_size="$(stat -c '%s' "${staged_artifact}")"
  artifact_sha="sha256:$(sha256sum "${staged_artifact}" | awk '{ print $1 }')"
  message_file="${TEST_ROOT}/${job_id}-message"
  signature_file="${TEST_ROOT}/${job_id}-signature"
  printf '%s\n' \
    "myscoutee-release-package-v1" \
    "${PACKAGE_VERSION}" \
    "${PACKAGE_CHANNEL}" \
    "${artifact_size}" \
    "${artifact_sha}" > "${message_file}"
  openssl pkeyutl -sign -inkey "${PRIVATE_KEY}" -rawin \
    -in "${message_file}" -out "${signature_file}"
  signature="$(base64 -w 0 "${signature_file}")"

  jq -n \
    --arg jobId "${job_id}" \
    --arg releaseVersion "${PACKAGE_VERSION}" \
    --arg channel "${PACKAGE_CHANNEL}" \
    --arg artifactSha "${artifact_sha}" \
    --arg packageKeyId "${PACKAGE_KEY_ID}" \
    --arg packageSignature "${signature}" \
    --argjson artifactSize "${artifact_size}" \
    '{
      schema_version: 1,
      job_id: $jobId,
      requested_at: "2026-07-28T12:00:00Z",
      requested_by: "operator-packaging-test",
      manifest_hash: ("sha256:" + ("1" * 64)),
      release_version: $releaseVersion,
      channel: $channel,
      artifact_name: "myscoutee.deb",
      artifact_size_bytes: $artifactSize,
      artifact_sha256: $artifactSha,
      package_signing_key_id: $packageKeyId,
      package_signature: $packageSignature
    }' > "${request_file}"
}

run_request() {
  local request_file="$1"
  local claim

  claim="$(claim_request_entry "${request_file}")"
  process_claim "${claim}"
}

stage_request() {
  local job_id="$1"
  local request_file="${REQUEST_DIR}/${job_id}.json"
  local stage="${STAGING_DIR}/${job_id}"

  mkdir -p "${stage}"
  cp "${PACKAGE_PATH}" "${stage}/myscoutee.deb"
  make_request "${job_id}" "${stage}/myscoutee.deb" "${request_file}"
  printf '%s' "${request_file}"
}

SUCCESS_JOB="upd_0123456789abcdef0123456789abcdef"
SUCCESS_REQUEST="$(stage_request "${SUCCESS_JOB}")"
run_request "${SUCCESS_REQUEST}" || fail "valid signed update was rejected"
SUCCESS_STATUS="${JOBS_DIR}/${SUCCESS_JOB}/status.json"
jq -e \
  --arg version "${PACKAGE_VERSION}" \
  '.phase == "COMPLETED"
    and .percent == 100
    and .targetVersion == $version
    and (.backupPath | type == "string")' \
  "${SUCCESS_STATUS}" >/dev/null \
  || fail "completed status is incomplete"
[[ "$(cat "${VERSION_FILE}")" == "${PACKAGE_VERSION}" ]] \
  || fail "verified package was not passed to apt"
[[ "$(wc -l < "${APT_CALLS_FILE}")" == "1" ]] \
  || fail "valid update did not invoke apt exactly once"
[[ -s "${AUDIT_ROOT}/${SUCCESS_JOB}/request.json" ]] \
  || fail "accepted request was not copied to the durable audit directory"
[[ "$(wc -l < "${JOBS_DIR}/${SUCCESS_JOB}/events.ndjson")" -ge 5 ]] \
  || fail "update progress was not written as reconnectable events"
[[ "$(stat -c '%a' "${SUCCESS_STATUS}")" == "640" ]] \
  || fail "worker status is not group-readable"
[[ "$(stat -c '%g' "${SUCCESS_STATUS}")" == "${MYSCOUTEE_API_GROUP_ID}" ]] \
  || fail "worker status does not use the API group"

printf '%s\n' '1.0.0' > "${VERSION_FILE}"
TAMPER_JOB="upd_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
TAMPER_REQUEST="$(stage_request "${TAMPER_JOB}")"
printf '%s' tampered >> "${STAGING_DIR}/${TAMPER_JOB}/myscoutee.deb"
if run_request "${TAMPER_REQUEST}"; then
  fail "tampered package was accepted"
fi
jq -e '.phase == "FAILED" and .percent == 100' \
  "${JOBS_DIR}/${TAMPER_JOB}/status.json" >/dev/null \
  || fail "tampered package did not produce a durable failed status"
[[ "$(wc -l < "${APT_CALLS_FILE}")" == "1" ]] \
  || fail "tampered update reached apt"

SYMLINK_JOB="upd_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
SYMLINK_STAGE="${STAGING_DIR}/${SYMLINK_JOB}"
SYMLINK_REQUEST="${REQUEST_DIR}/${SYMLINK_JOB}.json"
mkdir -p "${SYMLINK_STAGE}"
ln -s "${PACKAGE_PATH}" "${SYMLINK_STAGE}/myscoutee.deb"
make_request "${SYMLINK_JOB}" "${PACKAGE_PATH}" "${SYMLINK_REQUEST}"
if run_request "${SYMLINK_REQUEST}"; then
  fail "symbolic-link artifact was accepted"
fi
jq -e '.phase == "FAILED"' "${JOBS_DIR}/${SYMLINK_JOB}/status.json" >/dev/null \
  || fail "symbolic-link artifact did not fail closed"

INTERMEDIATE_JOB="upd_cccccccccccccccccccccccccccccccc"
INTERMEDIATE_REQUEST="${REQUEST_DIR}/${INTERMEDIATE_JOB}.json"
ln -s "${TEST_ROOT}" "${STAGING_DIR}/${INTERMEDIATE_JOB}"
make_request "${INTERMEDIATE_JOB}" "${PACKAGE_PATH}" "${INTERMEDIATE_REQUEST}"
if run_request "${INTERMEDIATE_REQUEST}"; then
  fail "symbolic-link staging directory was accepted"
fi

OVERSIZED_REQUEST="${REQUEST_DIR}/oversized.json"
head -c 70000 /dev/zero > "${OVERSIZED_REQUEST}"
if run_request "${OVERSIZED_REQUEST}"; then
  fail "oversized request was accepted"
fi

DANGLING_REQUEST="${REQUEST_DIR}/dangling.json"
ln -s "${TEST_ROOT}/does-not-exist" "${DANGLING_REQUEST}"
if run_request "${DANGLING_REQUEST}"; then
  fail "dangling request symlink was accepted"
fi

DIRECTORY_REQUEST="${REQUEST_DIR}/directory.json"
mkdir "${DIRECTORY_REQUEST}"
if run_request "${DIRECTORY_REQUEST}"; then
  fail "request directory was accepted"
fi
FIFO_REQUEST="${REQUEST_DIR}/fifo.json"
mkfifo "${FIFO_REQUEST}"
if run_request "${FIFO_REQUEST}"; then
  fail "request FIFO was accepted"
fi
[[ -z "$(find "${PROCESSING_DIR}" -mindepth 1 -maxdepth 1 -print -quit)" ]] \
  || fail "a claimed adversarial input remained in processing"
[[ "$(find "${REJECTED_DIR}" -mindepth 1 -maxdepth 1 | wc -l)" -ge 3 ]] \
  || fail "adversarial request entries were not durably quarantined"

CRASH_JOB="upd_dddddddddddddddddddddddddddddddd"
CRASH_REQUEST="$(stage_request "${CRASH_JOB}")"
read_request "${CRASH_REQUEST}" || fail "crash fixture request is invalid"
prepare_job_context || fail "crash fixture job could not be prepared"
CURRENT_VERSION="1.0.0"
write_status "INSTALLING" 85 "Simulated interrupted install."
printf '%s\n' "${PACKAGE_VERSION}" > "${VERSION_FILE}"
cp "${PACKAGE_ROOT}/opt/myscoutee/packaging/IMAGE-MANIFEST.json" \
  "${INSTALLED_MANIFEST}"
if ! run_request "${CRASH_REQUEST}"; then
  fail "installed interrupted update was not reconciled"
fi
jq -e '.phase == "COMPLETED"' \
  "${JOBS_DIR}/${CRASH_JOB}/status.json" >/dev/null \
  || fail "reconciled update did not become completed"
[[ "$(wc -l < "${APT_CALLS_FILE}")" == "1" ]] \
  || fail "crash reconciliation retried apt"

RECOVERY_JOB="upd_eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
printf '%s\n' '1.0.0' > "${VERSION_FILE}"
RECOVERY_REQUEST="$(stage_request "${RECOVERY_JOB}")"
read_request "${RECOVERY_REQUEST}" || fail "recovery fixture request is invalid"
prepare_job_context || fail "recovery fixture job could not be prepared"
CURRENT_VERSION="1.0.0"
write_status "INSTALLING" 85 "Simulated ambiguous install."
if run_request "${RECOVERY_REQUEST}"; then
  fail "ambiguous interrupted update reported success"
fi
jq -e '.phase == "RECOVERY_REQUIRED"' \
  "${JOBS_DIR}/${RECOVERY_JOB}/status.json" >/dev/null \
  || fail "ambiguous interrupted update was left nonterminal"
[[ "$(wc -l < "${APT_CALLS_FILE}")" == "1" ]] \
  || fail "ambiguous crash reconciliation retried apt"

BAD_IMAGE_JOB="upd_ffffffffffffffffffffffffffffffff"
BAD_IMAGE_REQUEST="$(stage_request "${BAD_IMAGE_JOB}")"
export UPDATE_TEST_BAD_IMAGE=true
if run_request "${BAD_IMAGE_REQUEST}"; then
  fail "wrong running image identity was accepted"
fi
unset UPDATE_TEST_BAD_IMAGE
jq -e '.phase == "RECOVERY_REQUIRED"' \
  "${JOBS_DIR}/${BAD_IMAGE_JOB}/status.json" >/dev/null \
  || fail "wrong running image did not require recovery"

mkdir -p \
  "${CACHE_JOBS_DIR}/upd_10000000000000000000000000000000" \
  "${CACHE_JOBS_DIR}/upd_20000000000000000000000000000000" \
  "${CACHE_JOBS_DIR}/upd_30000000000000000000000000000000"
touch -d '2026-07-28 00:00:01Z' \
  "${CACHE_JOBS_DIR}/upd_10000000000000000000000000000000"
touch -d '2026-07-28 00:00:02Z' \
  "${CACHE_JOBS_DIR}/upd_20000000000000000000000000000000"
touch -d '2026-07-28 00:00:03Z' \
  "${CACHE_JOBS_DIR}/upd_30000000000000000000000000000000"
prune_cache
[[ "$(find "${CACHE_JOBS_DIR}" -mindepth 1 -maxdepth 1 -type d | wc -l)" == "2" ]] \
  || fail "cache retention did not enforce its configured bound"

echo "update worker tests passed"
