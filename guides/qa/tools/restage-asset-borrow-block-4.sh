#!/usr/bin/env bash
set -euo pipefail

# Archives the interrupted run, then uses the normal snapshot-backed reset/stage.
# Earlier manual steps are not simulated or marked as verified.
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
HARNESS="${ROOT_DIR}/server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh"
EVIDENCE_DIR="$(mktemp -d /tmp/asset-borrow-block4.XXXXXX)"

bash "${HARNESS}" inspect-borrow asset-domain ASSET-BORROW-001 > "${EVIDENCE_DIR}/previous-run.json"
bash "${HARNESS}" reset asset-domain ASSET-BORROW-001 > "${EVIDENCE_DIR}/reset.log"
bash "${HARNESS}" stage asset-domain ASSET-BORROW-001 > "${EVIDENCE_DIR}/stage.log"
bash "${HARNESS}" prepare-borrow-reject asset-domain ASSET-BORROW-001 > "${EVIDENCE_DIR}/block4.log"
bash "${HARNESS}" status asset-domain ASSET-BORROW-001 > "${EVIDENCE_DIR}/status.log"
printf 'Block 4 fixture ready. Previous run and baseline evidence: %s\n' "${EVIDENCE_DIR}"
bash "${ROOT_DIR}/guides/qa/tools/open-checkpoint-browser-sessions.sh" ASSET-BORROW-001
