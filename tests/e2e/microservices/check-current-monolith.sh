#!/usr/bin/env bash
# Reuse the canonical disposable E2E stack and unchanged scenario runners.
# The lab VM must be fully stopped before any build or container startup.
set -euo pipefail
performance_only=false
source_ref=''
while [[ $# -gt 0 ]]; do
  case "$1" in
    --performance-only) performance_only=true; shift ;;
    --source-ref) source_ref="${2:?A Git source revision is required}"; performance_only=true; shift 2 ;;
    *) echo 'Usage: check-current-monolith.sh [--performance-only | --source-ref REVISION]' >&2; exit 2 ;;
  esac
done
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$root/server"
if pgrep -f '[q]emu-system.*guest=myscoutee-msc121' >/dev/null; then
  echo 'Stop the MSC-121 VM completely before monolith qualification.' >&2
  exit 1
fi
export MYSCOUTEE_E2E_IMAGE="${MYSCOUTEE_E2E_IMAGE:-myscoutee-api:msc120-current-20261009}"
if [[ -n "$source_ref" ]]; then
  source_ref="$(git rev-parse --verify "${source_ref}^{commit}")"
  export MYSCOUTEE_E2E_IMAGE="myscoutee-api:msc120-source-${source_ref:0:12}"
fi
export AUTH_MAX_ACTIVE_SESSIONS=2
export MONGO_E2E_DATABASE=e2e_db E2E_DATABASE=e2e_db
export E2E_BACKEND_CONTAINER=myscoutee
unset E2E_RESET_COMMAND
compose=(docker compose -f "$root/server/docker-compose.e2e.yml")
# Refuse existing dev/prod containers sharing canonical container names.
python3 - <<'PY'
import json,subprocess
config=json.loads(subprocess.check_output(['docker','compose','-f','docker-compose.e2e.yml','config','--format','json']))
for service in config['services'].values():
 name=service.get('container_name')
 if not name: continue
 result=subprocess.run(['docker','inspect',name],capture_output=True,text=True)
 if result.returncode: continue
 labels=json.loads(result.stdout)[0]['Config'].get('Labels') or {}
 if labels.get('com.docker.compose.project')!='myscoutee-e2e':
  raise SystemExit('Refusing an existing non-E2E container: '+name)
PY
umask 077
result_dir="${XDG_STATE_HOME:-$root/.local/state}/myscoutee-domain-segregation/e2e/current-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$result_dir"
printf '%s\n' "$result_dir"
trap '"${compose[@]}" stop > "$result_dir/stop.log" 2>&1' EXIT
if [[ -n "$source_ref" ]]; then
  printf '%s\n' "$source_ref" > "$result_dir/source-revision.txt"
  if docker image inspect "$MYSCOUTEE_E2E_IMAGE" >/dev/null 2>&1; then
    actual_ref="$(docker image inspect "$MYSCOUTEE_E2E_IMAGE" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')"
    [[ "$actual_ref" == "$source_ref" ]] || { echo 'Source image identity mismatch' >&2; exit 1; }
  else
    mkdir "$result_dir/source"
    git -C "$root" archive "$source_ref" server | tar -x -C "$result_dir/source"
    base_repository_options=(--secret "id=github-packages,src=${MYSCOUTEE_GITHUB_PACKAGES_PROPERTIES:-$HOME/.gradle/gradle.properties}")
    if rg -q 'COPY --from=myscoutee-base-repository' "$result_dir/source/server/docker/images/profilemanagement/e2e/Dockerfile"; then
      base_repository_options=(--build-context "myscoutee-base-repository=${MYSCOUTEE_BASE_REPOSITORY_DIRECTORY:-$root/../myscoutee-base/server/build/repository}")
    fi
    docker build --label "org.opencontainers.image.revision=$source_ref" \
      "${base_repository_options[@]}" \
      -f "$result_dir/source/server/docker/images/profilemanagement/e2e/Dockerfile" \
      -t "$MYSCOUTEE_E2E_IMAGE" "$result_dir/source/server" > "$result_dir/build.log" 2>&1
  fi
elif "$performance_only"; then
  docker image inspect "$MYSCOUTEE_E2E_IMAGE" --format '{{.Id}}' > "$result_dir/backend-image.txt"
else
  "${compose[@]}" build profilemanagement > "$result_dir/build.log" 2>&1
fi
"${compose[@]}" up --no-build --pull never --wait > "$result_dir/start.log" 2>&1
docker image inspect "$MYSCOUTEE_E2E_IMAGE" --format '{{.Id}}' > "$result_dir/backend-image.txt"
"${compose[@]}" cp nginx:/etc/nginx/keys/nginx.crt "$result_dir/nginx-ca.pem" >/dev/null
export NODE_EXTRA_CA_CERTS="$result_dir/nginx-ca.pem"
export E2E_SERVER_BASE_URL=https://127.0.0.1
export E2E_STRESS_BASE_URL="$E2E_SERVER_BASE_URL"
unset E2E_NATIVE_DEMO_SESSIONS E2E_SKIP_E2E_RESET E2E_STRESS_MODE
cd "$root"
if ! "$performance_only"; then
  E2E_SERVER_MODE=e2e node tests/e2e/functional/backend/run.mjs --include-mutations --record > "$result_dir/functional.log" 2>&1
fi
# Reset after functional mutations; keep the read-sweep warm, as in the baseline.
E2E_STRESS_MODE=e2e node tests/e2e/stress/backend/run.mjs --scenario server-events-read --record --artifacts-dir "$result_dir/performance" > "$result_dir/events.log" 2>&1
# A cold sample cannot be compared with a warmed baseline as a source regression.
# Repeat without reset/restart and preserve both recorded samples.
E2E_STRESS_MODE=e2e E2E_SKIP_E2E_RESET=true node tests/e2e/stress/backend/run.mjs --scenario server-events-read --record --artifacts-dir "$result_dir/performance-events-warm" > "$result_dir/events-warm.log" 2>&1
node tests/e2e/stress/backend/run.mjs --scenario server-read-sweep --record --artifacts-dir "$result_dir/performance-warm" > "$result_dir/read-sweep.log" 2>&1
printf 'PASS: monolith qualification; evidence: %s\n' "$result_dir"
