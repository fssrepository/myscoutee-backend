#!/usr/bin/env bash
# Opt-in, temporary service image override for an existing DEB deployment.
set -euo pipefail
umask 077
usage() {
  cat <<'EOF'
Usage (on the deployment host):
  sudo bash install-temporary-image.sh install SERVICE ghcr.io/OWNER/IMAGE@sha256:DIGEST
  sudo bash install-temporary-image.sh status SERVICE
  sudo bash install-temporary-image.sh rollback SERVICE

Requires an existing, running MyScoutee DEB deployment and Docker Compose.
Services: nginx, profilemanagement, mongodb, redis, minio, registry, payment-simulator.
Use a trusted, compatible image published for the installed package version.
nginx-base is a build dependency, not a running service; it is not restartable.
GHCR login for private images must be configured separately with docker login.
This does not publish images, install a fresh host, modify package files or
configuration, reset demo data, or update the recorded DEB identity. A normal
service restart/reinstall uses the package-configured image again.
EOF
}
fail() { printf 'Error: %s\n' "$*" >&2; exit 1; }
action="${1:---help}"
case "$action" in --help|-h) usage; exit 0;; install|rollback|status) ;; *) usage >&2; exit 2;; esac
service="${2:-}"
case "$service" in
  nginx) container=nginx; image_var=NGINX_PRODUCTION_IMAGE; image_name=myscoutee-nginx; label_service=nginx;;
  profilemanagement) container=myscoutee; image_var=MYSCOUTEE_PRODUCTION_IMAGE; image_name=myscoutee-api; label_service=profilemanagement;;
  mongodb) container=mongodb; image_var=MONGO_IMAGE; image_name=myscoutee-mongodb; label_service=mongodb;;
  redis) container=redis; image_var=REDIS_IMAGE; image_name=myscoutee-redis; label_service=redis;;
  minio) container=minio; image_var=MINIO_PRODUCTION_IMAGE; image_name=myscoutee-minio; label_service=minio;;
  registry) container=registry-demo; image_var=REGISTRY_DEMO_IMAGE; image_name=myscoutee-registry; label_service=registry-demo;;
  payment-simulator) container=payment-simulator; image_var=PAYMENT_SIMULATOR_IMAGE; image_name=myscoutee-payment-simulator; label_service=payment-simulator;;
  *) fail 'Select an explicitly supported Compose service.';;
esac
reference="${3:-}"
if [[ "$action" == install ]]; then
  [[ $# == 3 && "$reference" =~ ^ghcr\.io/[a-z0-9][a-z0-9._/-]*@sha256:[a-f0-9]{64}$ ]] \
    || fail 'Provide an exact ghcr.io image digest, not a mutable tag.'
else
  [[ $# == 2 ]] || fail 'Unexpected arguments.'
fi
[[ $(id -u) == 0 ]] || fail 'Run this helper as root on the deployment host.'
for tool in docker jq flock dpkg-query realpath tar; do command -v "$tool" >/dev/null || fail "Missing $tool"; done
server="${MYSCOUTEE_SERVER_DIR:-/opt/myscoutee/server}"
if [[ "$service" == nginx ]]; then
  state_dir="${MYSCOUTEE_TEMP_IMAGE_STATE_DIR:-${MYSCOUTEE_TEMP_FRONTEND_STATE_DIR:-/var/lib/myscoutee/temporary-frontend}}"
else
  state_dir="${MYSCOUTEE_TEMP_IMAGE_STATE_DIR:-/var/lib/myscoutee/temporary-images/$service}"
fi
[[ -d "$server" && -f "$server/docker-compose-prod.yml" && -f "$server/.env" && -f "$server/.env.secrets" ]] || fail 'Existing deployment configuration is required.'
server="$(realpath "$server")"
[[ ! -L "$state_dir" ]] || fail 'State directory must not be a symlink.'
install -d -m 0700 "$state_dir"
state_dir="$(realpath "$state_dir")"
[[ ! -L "$state_dir/lock" && ! -L "$state_dir/state.json" ]] || fail 'State files must not be symlinks.'
exec 9>"$state_dir/lock"
flock -n 9 || fail 'Another temporary service image operation is running.'
state="$state_dir/state.json"
version="$(dpkg-query -W -f='${Version}' myscoutee)"
[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(~qa\.[0-9]+)?$ ]] || fail 'Installed MyScoutee package version is invalid.'
docker compose version >/dev/null
inspect() { docker inspect "$container" | jq -er "$1"; }
current_id="$(inspect '.[0].Image')"
project="$(inspect '.[0].Config.Labels["com.docker.compose.project"]')"
[[ "$project" =~ ^[a-z0-9][a-z0-9_-]*$ ]] || fail 'Invalid existing Compose project.'
[[ "$(inspect '.[0].Config.Labels["com.docker.compose.service"]')" == "$service" ]] || fail 'Container is not the selected Compose service.'
[[ "$(inspect '.[0].Config.Labels["com.docker.compose.project.working_dir"]')" == "$server" ]] || fail 'Container belongs to another deployment.'
if [[ "$action" == status ]]; then
  if [[ -f "$state" ]]; then
    jq --arg current "$current_id" '{phase,version,reference,previousId,targetId,currentId:$current,matchesTemporaryImage:($current==.targetId),matchesPreviousImage:($current==.previousId)}' "$state"
  else
    printf 'No temporary service image operation is recorded.\n'
  fi
  exit 0
fi
# Do not run this helper during normal package/TLS operations.
[[ ! -e /var/lib/myscoutee/demo-reset-required ]] || fail 'A package installation is pending; finish the normal installation first.'
compose=(docker compose --project-directory "$server" --project-name "$project")
# Preserve the running service's complete Compose overlay selection.
config_files="$(inspect '.[0].Config.Labels["com.docker.compose.project.config_files"]')"
IFS=',' read -r -a files <<< "$config_files"
[[ ${#files[@]} -gt 0 ]] || fail 'Existing Compose file list is missing.'
for file in "${files[@]}"; do
  [[ -f "$file" ]] || fail 'Existing Compose file is missing.'
  file="$(realpath "$file")"
  case "$file" in "$server/docker-compose-prod.yml"|"$server/docker-compose.replicaset.yml") ;; *) fail 'Unknown Compose overlay; use the normal installer.';; esac
  compose+=(-f "$file")
done
# Dependencies are never recreated by this helper.
run_image() {
  local image="$1"
  (cd "$server" && env "$image_var=$image" "${compose[@]}" up -d --no-deps --pull never --wait --wait-timeout 180 --no-build "$service")
}
healthy_image() {
  [[ "$(inspect '.[0].Image')" == "$1" && "$(inspect '.[0].State.Health.Status')" == healthy ]]
}
phase() {
  jq --arg phase "$1" '.phase=$phase' "$state" > "$state_dir/state.next"
  mv -f "$state_dir/state.next" "$state"
}
rollback_saved() {
  local previous
  previous="$(jq -er '.previousId' "$state")"
  [[ "$previous" =~ ^sha256:[a-f0-9]{64}$ ]] || fail 'Invalid retained image identity.'
  docker image inspect "$previous" >/dev/null
  phase rolling-back
  if run_image "$previous" && healthy_image "$previous"; then
    phase rolled-back
    printf 'Previous service image restored and healthy.\n'
    return 0
  fi
  phase rollback-failed
  printf 'Rollback failed; inspect "$container". Retained state: %s\n' "$state" >&2
  return 1
}
if [[ "$action" == rollback ]]; then
  [[ -f "$state" ]] || fail 'No retained frontend image to restore.'
  [[ "$(jq -er '.version' "$state")" == "$version" && "$(jq -er '.project' "$state")" == "$project" ]] || fail 'Deployment changed since this operation; use the normal installer.'
  previous="$(jq -er '.previousId' "$state")"; target="$(jq -er '.targetId' "$state")"
  [[ "$current_id" == "$target" || "$current_id" == "$previous" ]] || fail 'Another deployment replaced the selected container; refusing to overwrite it.'
  rollback_saved
  exit
fi
[[ "$(inspect '.[0].State.Health.Status')" == healthy ]] || fail 'Existing service must be healthy before applying a temporary image.'
if [[ -f "$state" ]]; then
  old_phase="$(jq -er '.phase' "$state")"
  [[ "$old_phase" == rolled-back ]] || fail 'An earlier temporary operation is recorded; inspect status and roll it back first.'
fi
printf 'Pulling the explicitly selected image...\n'
docker pull "$reference"
target_id="$(docker image inspect "$reference" | jq -er '.[0].Id')"
[[ "$target_id" =~ ^sha256:[a-f0-9]{64}$ ]] || fail 'Invalid pulled image identity.'
current_platform="$(docker image inspect "$current_id" | jq -er '.[0] | .Os+"/"+.Architecture')"
target_platform="$(docker image inspect "$target_id" | jq -er '.[0] | .Os+"/"+.Architecture')"
[[ "$current_platform" == "$target_platform" ]] || fail 'Image platform does not match the running frontend.'
# Publisher labels bind the exact digest to the selected service/package line.
candidate_labels="$(docker image inspect "$target_id" | jq -er '.[0].Config.Labels')"
[[ "$(jq -er '."io.myscoutee.service"' <<< "$candidate_labels")" == "$label_service" ]] || fail 'Image belongs to another service.'
[[ "$(jq -er '."io.myscoutee.package-version"' <<< "$candidate_labels")" == "${version/\~/-}" ]] || fail 'Image is for a different package version.'
if [[ "$service" == nginx ]]; then
  probe_container="$(docker create --entrypoint /bin/true "$target_id")"
  trap 'docker rm "$probe_container" >/dev/null 2>&1 || true' EXIT
  candidate_version="$(docker cp "$probe_container:/usr/share/nginx/html/app-version.json" - | tar -xO | jq -er '.version')"
  docker rm "$probe_container" >/dev/null
  trap - EXIT
  [[ "$candidate_version" == "${version/\~/-}" ]] || fail 'Frontend content version does not match the installed package.'
fi
if [[ "$service" == mongodb || "$service" == redis ]]; then
  # An image swap is not a database migration. Require the installed upstream version.
  expected_upstream="$(cd "$server" && "${compose[@]}" config --format json | jq -er --arg s "$service" '.services[$s].image')"
  [[ "$(jq -er '."io.myscoutee.upstream-reference"' <<< "$candidate_labels")" == "$expected_upstream" ]] || fail 'Database image version differs; use a planned database migration.'
fi
[[ "$(inspect '.[0].Image')" == "$current_id" ]] || fail 'Service changed while downloading; refusing to replace it.'
jq -n --arg service "$service" --arg version "$version" --arg project "$project" --arg reference "$reference" --arg previous "$current_id" --arg target "$target_id" \
  '{phase:"applying",service:$service,version:$version,project:$project,reference:$reference,previousId:$previous,targetId:$target}' > "$state_dir/state.next"
mv -f "$state_dir/state.next" "$state"
# Persist intent before recreation. An interrupted operation can be inspected and rolled back.
if run_image "$reference" && healthy_image "$target_id"; then
  phase applied
  printf 'Temporary service image installed and healthy. Package/configuration/data unchanged.\n'
  printf 'A normal service restart or reinstall restores the package-configured image.\n'
else
  phase failed
  printf 'Temporary service image failed its health check; restoring the previous image.\n' >&2
  rollback_saved || true
  exit 1
fi
