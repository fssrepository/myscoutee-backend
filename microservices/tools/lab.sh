#!/usr/bin/env bash
set -euo pipefail
shell_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
backend_root="$(realpath -- "${MYSCOUTEE_BACKEND_SOURCE:-${shell_root}/..}")"
export MYSCOUTEE_BACKEND_SOURCE="${backend_root}"
state_root="${XDG_STATE_HOME:-${HOME}/.local/state}/myscoutee-microservices/msc121"
# Public convenience credential for this loopback-only developer lab.
grafana_lab_password='msc121-local-only'

preflight() {
  python3 - <<'PY'
import fcntl, os, shutil
from pathlib import Path
mem = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
print('Available memory: %.1f GiB' % (int(mem['MemAvailable'].split()[0]) / 1024 ** 2))
print('Free workspace disk: %.1f GiB' % (shutil.disk_usage('.').free / 1024 ** 3))
try:
    fd = os.open('/dev/kvm', os.O_RDWR)
    try: print('KVM API:', fcntl.ioctl(fd, 0xAE00, 0))
    finally: os.close(fd)
except OSError as error: print('KVM unavailable:', error.strerror)
for name in ('docker', 'java', 'qemu-system-x86_64', 'virsh', 'terraform', 'kubectl'):
    print(name + ':', shutil.which(name) or 'not installed')
PY
  docker ps --format '{{.Names}}  {{.Image}}'
}

build_jars() {
  require_idle_build_owner
  local revision
  revision="$(git -C "${backend_root}" rev-parse HEAD)"
  "${shell_root}/gradlew" --no-daemon --max-workers=1 \
    -Dorg.gradle.jvmargs=-Xmx1024m -PbackendRevision="${revision}" verifyAssemblies
}

require_idle_build_owner() {
  # Never compete with an existing hot-deploy owner. Preflight output remains reviewable.
  preflight
  if ps -eo args= | grep -E '[b]ootRun|[f]rontend_auto_watch|[s]tart_profilemanagement_dev|[n]g serve' >/dev/null; then
    echo 'An existing dev build/server owns compilation. Use its pipeline; separate assembly build stopped.' >&2
    exit 2
  fi
  if docker ps --format '{{.Names}} {{.Image}}' | grep -Ei 'sync|watch|(^|[-_:])dev($|[-_: ])' >/dev/null; then
    echo 'A dev/watch container is running. Stop its owner before this serial packaging build.' >&2
    exit 2
  fi
}

build_frontend_image() {
  require_idle_build_owner
  install -d -m 0700 "${state_root}"
  touch "${state_root}/images.tsv"
  chmod 0600 "${state_root}/images.tsv"
  # Reuse the canonical optimized build, stamping and production Dockerfile.
  # This explicit release action is never called by VM/workload startup.
  (cd "${backend_root}/frontend" && \
    NG_BUILD_MAX_WORKERS="${NG_BUILD_MAX_WORKERS:-1}" \
    NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}" \
    node_modules/.bin/ng build --configuration production && \
    FRONTEND_BUILD_OUTPUT_DIR=prod node scripts/stamp-prod-build.js)
  package_frontend_image
}

package_frontend_image() {
  # Repackage an already built canonical bundle; no Angular compilation.
  test -f "${backend_root}/frontend/prod/index.html"
  docker build --network=none --pull=false --file "${backend_root}/server/docker/images/nginx/prod/Dockerfile" \
    --build-context "frontend-prod=${backend_root}/frontend/prod" \
    --build-arg "NGINX_BASE_IMAGE=${NGINX_BASE_IMAGE:-myscoutee-nginx:1.3.0-base}" \
    --label com.myscoutee.task=MSC-121 --tag myscoutee-frontend-runtime-base:msc121 \
    "${backend_root}/server/docker"
  record_image myscoutee-frontend-runtime-base:msc121
  docker build --network=none --pull=false --file "${shell_root}/runtime-status/Dockerfile" \
    --build-arg FRONTEND_BASE_IMAGE=myscoutee-frontend-runtime-base:msc121 \
    --build-context "runtime-common=${backend_root}/server/docker/images/nginx/runtime-status" \
    --label com.myscoutee.task=MSC-121 --tag myscoutee-service-frontend:msc121 \
    "${shell_root}/runtime-status"
  record_image myscoutee-service-frontend:msc121
}

record_image() {
  local image_ref="$1" image_id
  image_id="$(docker image inspect --format '{{.Id}}' "${image_ref}")"
  printf '%s\t%s\n' "${image_ref}" "${image_id}" >> "${state_root}/images.tsv"
}

build_minio_image() {
  require_idle_build_owner
  install -d -m 0700 "${state_root}"
  touch "${state_root}/images.tsv"
  chmod 0600 "${state_root}/images.tsv"
  # Reuse the production image and seed startup; startup never calls this build.
  docker build --file "${backend_root}/server/docker/images/minio/Dockerfile" \
    --label com.myscoutee.task=MSC-121 --tag myscoutee-service-minio:msc121 \
    "${backend_root}/server"
  record_image myscoutee-service-minio:msc121
}

build_support_images() {
  require_idle_build_owner
  install -d -m 0700 "${state_root}"
  touch "${state_root}/images.tsv"
  chmod 0600 "${state_root}/images.tsv"
  local service source image_ref
  # Production Dockerfiles own these optimized Go binaries. Build serially;
  # never overwrite the monolith's tags or start a second dev/watch process.
  for service in mcp registry payment-simulator; do
    source="$(dirname -- "${backend_root}")/myscoutee-${service}"
    [[ -f "${source}/Dockerfile" ]] || { echo "Missing canonical source: ${source}" >&2; return 2; }
    image_ref="myscoutee-service-${service}:msc121"
    docker build --file "${source}/Dockerfile" --label com.myscoutee.task=MSC-121 \
      --tag "${image_ref}" "${source}"
    record_image "${image_ref}"
  done
}

build_images() {
  python3 "${shell_root}/tools/audit-assemblies.py" --artifacts
  python3 "${shell_root}/tools/render-deployment.py"
  install -d -m 0700 "${state_root}"
  touch "${state_root}/images.tsv"
  chmod 0600 "${state_root}/images.tsv"
  local stage service revision dirty image_ref
  revision="$(git -C "${backend_root}" rev-parse HEAD)"
  dirty=false
  [[ -z "$(git -C "${backend_root}" status --porcelain --untracked-files=normal)" ]] || dirty=true
  mkdir -p "${shell_root}/build/runtime-context"
  for stage in jre-runtime media-runtime; do
    image_ref="myscoutee-service-${stage}:msc121"
    docker build --target "${stage}" --label com.myscoutee.task=MSC-121 \
      --file "${backend_root}/server/docker/images/profilemanagement/prod/Dockerfile" \
      --tag "${image_ref}" "${shell_root}/build/runtime-context"
    record_image "${image_ref}"
  done
  while IFS= read -r service; do
    image_ref="myscoutee-service-${service}:msc121"
    docker build --file "${shell_root}/build/deployment/${service}.Dockerfile" \
      --build-arg BACKEND_REVISION="${revision}" --build-arg BACKEND_DIRTY="${dirty}" \
      --tag "${image_ref}" "${shell_root}/build/${service}/libs"
    record_image "${image_ref}"
  done < <(python3 -c 'import json,sys; print("\n".join(json.load(open(sys.argv[1]))["services"]))' "${shell_root}/assemblies.json")
}

clean_images() {
  [[ -f "${state_root}/images.tsv" ]] || return 0
  local image_ref expected actual failed=0
  # Only task-recorded tags still pointing to the recorded image are removable.
  # No force, container removal, global prune, or build-cache removal.
  while IFS=$'\t' read -r image_ref expected; do
    [[ "${image_ref}" =~ ^myscoutee-service-[a-z0-9-]+:(msc121|0\.1\.0-[a-f0-9]{12})$ && "${expected}" =~ ^sha256:[a-f0-9]{64}$ ]] || {
      echo 'Invalid image inventory; stopped.' >&2; return 2;
    }
    actual="$(docker image inspect --format '{{.Id}}' "${image_ref}" 2>/dev/null || true)"
    [[ -n "${actual}" ]] || continue
    if [[ "${actual}" != "${expected}" ]]; then
      echo "Preserved changed image: ${image_ref}" >&2
      failed=1
      continue
    fi
    docker image rm "${image_ref}" || failed=1
  done < <(tac "${state_root}/images.tsv" | awk -F '\t' '!seen[$1]++')
  if [[ "${failed}" == 0 ]]; then rm "${state_root}/images.tsv"; rmdir "${state_root}" 2>/dev/null || true; fi
  return "${failed}"
}

monitoring() {
  local action="$1"
  local environment_file="${state_root}/monitoring.env"
  if [[ "${action}" == up ]]; then
    python3 "${shell_root}/tools/render-deployment.py"
    install -d -m 0700 "${state_root}"
    if [[ ! -f "${environment_file}" ]]; then
      (umask 077; printf 'GRAFANA_ADMIN_PASSWORD=%s\n' "${grafana_lab_password}" > "${environment_file}")
    fi
  fi
  [[ -f "${environment_file}" ]] || { echo 'Monitoring has no local state.'; return 0; }
  local -a compose=(docker compose --project-name msc121-observability --env-file "${environment_file}" -f "${shell_root}/observability/compose.yaml")
  case "${action}" in
    up)
      "${compose[@]}" up -d
      # A newly created Prometheus has no signal handler yet: early SIGHUP
      # terminates it (exit 129). Reload only after its HTTP readiness gate.
      python3 - <<'PY'
import time, urllib.error, urllib.request
deadline = time.monotonic() + 60
while time.monotonic() < deadline:
    try:
        with urllib.request.urlopen('http://127.0.0.1:19090/-/ready', timeout=2) as response:
            if response.status == 200:
                break
    except (OSError, urllib.error.URLError):
        pass
    time.sleep(1)
else:
    raise SystemExit('Prometheus did not become ready; inspect the owned monitoring container logs.')
PY
      "${compose[@]}" kill --signal SIGHUP prometheus
      ;;
    stop) "${compose[@]}" stop ;;
    reset-password)
      # Explicitly reconcile an existing lab volume to the documented login.
      python3 - "${environment_file}" "${grafana_lab_password}" <<'PY'
import base64, json, sys, urllib.request
from pathlib import Path
path = Path(sys.argv[1])
previous = path.read_text().strip().split('=', 1)[1]
password = sys.argv[2]
authorization = base64.b64encode(('lab:' + previous).encode()).decode()
request = urllib.request.Request('http://127.0.0.1:13000/api/user/password',
    method='PUT', headers={'Authorization': 'Basic ' + authorization, 'Content-Type': 'application/json'},
    data=json.dumps({'oldPassword': previous, 'newPassword': password, 'confirmNew': password}).encode())
if previous != password:
    with urllib.request.urlopen(request, timeout=10) as response:
        if response.status != 200:
            raise SystemExit('Grafana password update failed; existing state preserved.')
    path.write_text('GRAFANA_ADMIN_PASSWORD=' + password + '\n')
print('The loopback-only Grafana login is now lab / ' + password)
PY
      ;;
    destroy)
      "${compose[@]}" down --volumes
      rm -- "${environment_file}"
      rmdir "${state_root}" 2>/dev/null || true
      ;;
  esac
}

case "${1:-preflight}" in
  preflight) preflight ;;
  build) build_jars; build_images ;;
  jars) build_jars ;;
  images) build_images ;;
  frontend-image) build_frontend_image ;;
  frontend-package) package_frontend_image ;;
  minio-image) build_minio_image ;;
  support-images) build_support_images ;;
  render) python3 "${shell_root}/tools/render-deployment.py" ;;
  monitoring-up) monitoring up ;;
  monitoring-stop) monitoring stop ;;
  monitoring-destroy) monitoring destroy ;;
  monitoring-reset-password) monitoring reset-password ;;
  clean-images) clean_images ;;
  clean-build)
    if [[ -n "$(docker ps -q --filter label=com.docker.compose.project=msc121-observability)" ]]; then
      echo 'Stop the task monitoring stack before removing its generated configuration.' >&2
      exit 2
    fi
    [[ ! -L "${shell_root}/build" && ! -L "${shell_root}/.gradle" ]] || { echo 'Refusing symlinked build paths.' >&2; exit 2; }
    rm -rf -- "${shell_root}/build" "${shell_root}/.gradle"
    ;;
  *) echo 'Usage: lab.sh [preflight|build|jars|images|frontend-image|frontend-package|minio-image|support-images|render|monitoring-up|monitoring-stop|monitoring-destroy|monitoring-reset-password|clean-images|clean-build]' >&2; exit 2 ;;
esac
