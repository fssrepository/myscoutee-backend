#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd -P)"

CANDIDATE_DEB="${MYSCOUTEE_CANDIDATE_DEB:-${1:-}}"
OLDEST_SUPPORTED_DEB="${MYSCOUTEE_OLDEST_SUPPORTED_DEB:-${2:-}}"
REGISTRY_IMAGE="${MYSCOUTEE_REGISTRY_IMAGE:-${3:-}}"
EVIDENCE_DIR="${MYSCOUTEE_QUALIFICATION_EVIDENCE_DIR:-}"

usage() {
  cat >&2 <<'EOF'
Usage:
  MYSCOUTEE_QUALIFICATION_EVIDENCE_DIR=/absolute/output/directory \
    qualify-release-artifacts.sh \
      /absolute/myscoutee_<candidate>_<arch>.deb \
      /absolute/myscoutee_<oldest-supported>_<arch>.deb \
      myscoutee-registry:<candidate>-prod

This command performs read-only candidate-artifact checks and writes a
machine-readable evidence manifest. It does not install, upgrade, restore, or
start any service. Those host-changing release drills remain separate.
EOF
  exit 2
}

[[ -n "${CANDIDATE_DEB}" && -n "${OLDEST_SUPPORTED_DEB}" \
  && -n "${REGISTRY_IMAGE}" && -n "${EVIDENCE_DIR}" ]] || usage
[[ "${CANDIDATE_DEB}" == /* && "${OLDEST_SUPPORTED_DEB}" == /* \
  && "${EVIDENCE_DIR}" == /* ]] || {
  echo "Candidate, oldest-supported package, and evidence paths must be absolute." >&2
  exit 2
}
[[ -f "${CANDIDATE_DEB}" && ! -L "${CANDIDATE_DEB}" ]] || {
  echo "Candidate Debian package is missing or is a symbolic link." >&2
  exit 2
}
[[ -f "${OLDEST_SUPPORTED_DEB}" && ! -L "${OLDEST_SUPPORTED_DEB}" ]] || {
  echo "Oldest-supported Debian package is missing or is a symbolic link." >&2
  exit 2
}
[[ "${CANDIDATE_DEB}" != "${OLDEST_SUPPORTED_DEB}" ]] || {
  echo "Candidate and oldest-supported package paths must differ." >&2
  exit 2
}
if [[ -e "${EVIDENCE_DIR}" && (! -d "${EVIDENCE_DIR}" || -L "${EVIDENCE_DIR}") ]]; then
  echo "Evidence path must be a real directory, not a file or symbolic link." >&2
  exit 2
fi

for command_name in docker dpkg dpkg-deb jq sha256sum stat uname; do
  command -v "${command_name}" >/dev/null 2>&1 || {
    echo "Release-artifact qualification requires ${command_name}." >&2
    exit 2
  }
done

candidate_package="$(dpkg-deb -f "${CANDIDATE_DEB}" Package)"
candidate_version="$(dpkg-deb -f "${CANDIDATE_DEB}" Version)"
candidate_architecture="$(dpkg-deb -f "${CANDIDATE_DEB}" Architecture)"
oldest_package="$(dpkg-deb -f "${OLDEST_SUPPORTED_DEB}" Package)"
oldest_version="$(dpkg-deb -f "${OLDEST_SUPPORTED_DEB}" Version)"
oldest_architecture="$(dpkg-deb -f "${OLDEST_SUPPORTED_DEB}" Architecture)"

[[ "${candidate_package}" == "myscoutee" && "${oldest_package}" == "myscoutee" ]] || {
  echo "Both artifacts must be MyScoutee Debian packages." >&2
  exit 1
}
[[ "${candidate_architecture}" == "${oldest_architecture}" ]] || {
  echo "Candidate and oldest-supported package architectures differ." >&2
  exit 1
}
dpkg --validate-version "${candidate_version}" >/dev/null 2>&1
dpkg --validate-version "${oldest_version}" >/dev/null 2>&1
dpkg --compare-versions "${candidate_version}" gt "${oldest_version}" || {
  echo "Candidate version must be newer than the oldest-supported version." >&2
  exit 1
}
[[ "${candidate_version}" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]] || {
  echo "Candidate package version must be a plain SemVer core." >&2
  exit 1
}

expected_registry_image="myscoutee-registry:${candidate_version}-prod"
[[ "${REGISTRY_IMAGE}" == "${expected_registry_image}" ]] || {
  echo "Registry image must use the candidate-derived tag ${expected_registry_image}." >&2
  exit 1
}
docker image inspect "${REGISTRY_IMAGE}" >/dev/null

registry_user="$(docker image inspect --format '{{.Config.User}}' "${REGISTRY_IMAGE}")"
registry_entrypoint="$(
  docker image inspect --format '{{json .Config.Entrypoint}}' "${REGISTRY_IMAGE}"
)"
registry_ports="$(
  docker image inspect --format '{{json .Config.ExposedPorts}}' "${REGISTRY_IMAGE}"
)"
registry_os="$(docker image inspect --format '{{.Os}}' "${REGISTRY_IMAGE}")"
registry_architecture="$(docker image inspect --format '{{.Architecture}}' "${REGISTRY_IMAGE}")"
registry_image_id="$(docker image inspect --format '{{.Id}}' "${REGISTRY_IMAGE}")"
registry_repo_digests="$(
  docker image inspect --format '{{json .RepoDigests}}' "${REGISTRY_IMAGE}"
)"

[[ "${registry_user}" == "65532:65532" ]] || {
  echo "Registry image does not run as numeric user 65532:65532." >&2
  exit 1
}
[[ "${registry_entrypoint}" == '["/registry"]' ]] || {
  echo "Registry image entrypoint is not the scratch-runtime registry binary." >&2
  exit 1
}
jq -e 'keys == ["8080/tcp"]' <<< "${registry_ports}" >/dev/null || {
  echo "Registry image must expose only container port 8080." >&2
  exit 1
}
[[ "${registry_os}" == "linux" ]] || {
  echo "Registry candidate image is not a Linux image." >&2
  exit 1
}
[[ "${registry_architecture}" == "${candidate_architecture}" ]] || {
  echo "Registry image and candidate Debian architectures differ." >&2
  exit 1
}

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/myscoutee-release-artifacts.XXXXXX")"
cleanup() {
  rm -rf -- "${work_dir}"
}
trap cleanup EXIT

candidate_root="${work_dir}/candidate"
install -d "${candidate_root}"
dpkg-deb -x "${CANDIDATE_DEB}" "${candidate_root}"

bash "${SCRIPT_DIR}/audit-package-credentials.sh" "${candidate_root}"

packaged_version_file="${candidate_root}/opt/myscoutee/packaging/VERSION"
[[ -f "${packaged_version_file}" ]] || {
  echo "Candidate package omits the installed VERSION marker." >&2
  exit 1
}
[[ "$(tr -d '\r\n' < "${packaged_version_file}")" == "${candidate_version}" ]] || {
  echo "Candidate control version and installed VERSION marker differ." >&2
  exit 1
}

candidate_compose="${candidate_root}/opt/myscoutee/server/docker-compose-prod.yml"
[[ -f "${candidate_compose}" ]] || {
  echo "Candidate package omits the production Compose definition." >&2
  exit 1
}
grep -Fq "myscoutee-registry:${candidate_version}-prod" "${candidate_compose}" || {
  echo "Candidate package does not bind Explore to the matching registry image." >&2
  exit 1
}
if awk '
    /^  registry:/ { in_registry = 1; next }
    /^  [[:alnum:]_-]+:/ { in_registry = 0 }
    in_registry && /^[[:space:]]+ports:/ { found = 1 }
    END { exit !found }
  ' "${candidate_compose}"; then
  echo "Packaged Explore registry unexpectedly publishes a host port." >&2
  exit 1
fi

candidate_sha256="$(sha256sum "${CANDIDATE_DEB}" | awk '{print $1}')"
oldest_sha256="$(sha256sum "${OLDEST_SUPPORTED_DEB}" | awk '{print $1}')"
candidate_size="$(stat -c '%s' "${CANDIDATE_DEB}")"
oldest_size="$(stat -c '%s' "${OLDEST_SUPPORTED_DEB}")"
source_commit="$(git -C "${REPO_ROOT}" rev-parse HEAD 2>/dev/null || true)"
registry_source_commit="$(
  git -C "${REPO_ROOT}/../myscoutee-registry" rev-parse HEAD 2>/dev/null || true
)"
backend_dirty="$(
  if [[ -n "$(git -C "${REPO_ROOT}" status --porcelain 2>/dev/null || true)" ]]; then
    printf 'true'
  else
    printf 'false'
  fi
)"
registry_dirty="$(
  if [[ -n "$(
    git -C "${REPO_ROOT}/../myscoutee-registry" status --porcelain 2>/dev/null || true
  )" ]]; then
    printf 'true'
  else
    printf 'false'
  fi
)"

install -d -m 0750 "${EVIDENCE_DIR}"
evidence_path="${EVIDENCE_DIR}/release-artifact-evidence.json"
evidence_tmp="$(mktemp "${EVIDENCE_DIR}/.release-artifact-evidence.XXXXXX")"
trap 'rm -f -- "${evidence_tmp}"; cleanup' EXIT

jq -n \
  --arg generatedAt "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  --arg sourceCommit "${source_commit}" \
  --arg registrySourceCommit "${registry_source_commit}" \
  --argjson backendDirty "${backend_dirty}" \
  --argjson registryDirty "${registry_dirty}" \
  --arg host "$(uname -srvmo)" \
  --arg candidatePath "${CANDIDATE_DEB}" \
  --arg candidateVersion "${candidate_version}" \
  --arg candidateArchitecture "${candidate_architecture}" \
  --arg candidateSha256 "sha256:${candidate_sha256}" \
  --argjson candidateSize "${candidate_size}" \
  --arg oldestPath "${OLDEST_SUPPORTED_DEB}" \
  --arg oldestVersion "${oldest_version}" \
  --arg oldestArchitecture "${oldest_architecture}" \
  --arg oldestSha256 "sha256:${oldest_sha256}" \
  --argjson oldestSize "${oldest_size}" \
  --arg registryImage "${REGISTRY_IMAGE}" \
  --arg registryImageID "${registry_image_id}" \
  --argjson registryRepoDigests "${registry_repo_digests}" \
  --arg registryOS "${registry_os}" \
  --arg registryArchitecture "${registry_architecture}" \
  '{
    schemaVersion: 1,
    generatedAt: $generatedAt,
    source: {
      backendCommit: $sourceCommit,
      backendCheckoutDirty: $backendDirty,
      registryCommit: $registrySourceCommit,
      registryCheckoutDirty: $registryDirty,
      binding: "checkout context only; package/image hashes are authoritative"
    },
    host: $host,
    artifacts: {
      candidatePackage: {
        path: $candidatePath,
        version: $candidateVersion,
        architecture: $candidateArchitecture,
        sha256: $candidateSha256,
        sizeBytes: $candidateSize
      },
      oldestSupportedPackage: {
        path: $oldestPath,
        version: $oldestVersion,
        architecture: $oldestArchitecture,
        sha256: $oldestSha256,
        sizeBytes: $oldestSize
      },
      registryImage: {
        reference: $registryImage,
        imageID: $registryImageID,
        repoDigests: $registryRepoDigests,
        os: $registryOS,
        architecture: $registryArchitecture,
        user: "65532:65532",
        entrypoint: ["/registry"],
        exposedPorts: ["8080/tcp"]
      }
    },
    automatedChecks: {
      packageIdentityAndVersionOrdering: "PASS",
      packageCredentialAudit: "PASS",
      packageVersionMarker: "PASS",
      packagedExploreRegistryIsolation: "PASS",
      registryImageRuntimeContract: "PASS"
    },
    externalDrills: {
      exactArtifactJavaGoRail: "OPEN",
      hostInstallRestartAndPowerLoss: "OPEN",
      cleanHostBackupRestore: "OPEN",
      oldestSupportedUpgradeAndRollback: "OPEN",
      publicTLSMultiRegistryIsolation: "OPEN",
      sustainedAndBurstLoad: "OPEN",
      independentSecurityReview: "OPEN"
    }
  }' > "${evidence_tmp}"
chmod 0640 "${evidence_tmp}"
mv -f -- "${evidence_tmp}" "${evidence_path}"
trap cleanup EXIT

echo "Release-artifact preflight passed."
echo "Evidence: ${evidence_path}"
echo "Host-changing and external Phase 9 drills remain OPEN in the evidence manifest."
