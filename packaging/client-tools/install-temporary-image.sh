#!/usr/bin/env bash
# Partial service update with a persistent image selection for an existing DEB deployment.
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
Persists the selected image in the deployment environment, including same-version
patches. Restarts/reboots retain it. Rollback restores the prior image setting.
Does not rebuild/install a DEB, modify package files, or reset demo data.
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
for tool in docker jq flock dpkg-query realpath tar python3; do command -v "$tool" >/dev/null || fail "Missing $tool"; done
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
flock -n 9 || fail 'Another partial image operation is running.'
state="$state_dir/state.json"
# .env is normally a symlink to /etc/myscoutee/myscoutee.env. Replace its
# resolved target atomically, retaining the symlink, ownership and mode.
env_file="$(realpath "$server/.env")"
env_setting() {
  python3 - "$env_file" "$image_var" "$@" <<'PYENV'
import fcntl,json,os,pathlib,re,stat,sys,tempfile
path=pathlib.Path(sys.argv[1]);key=sys.argv[2];action=sys.argv[3]
pattern=re.compile(r'^[ \t]*'+re.escape(key)+r'[ \t]*=')
# Shared across services; state files have separate per-service locks.
with open(str(path)+'.partial-image.lock','a') as lock:
    os.chmod(lock.name,0o600)
    fcntl.flock(lock,fcntl.LOCK_EX)
    info=path.stat();content=path.read_text();lines=content.splitlines(keepends=True)
    indices=[i for i,line in enumerate(lines) if pattern.match(line)]
    if len(indices)>1:raise SystemExit('Duplicate image setting; resolve it before updating.')
    current=lines[indices[0]].rstrip('\r\n') if indices else None
    if action=='read':print(json.dumps(current));sys.exit(0)
    expected,replacement=map(json.loads,sys.argv[4:6])
    if current!=expected:raise SystemExit('Image setting changed concurrently; no configuration was overwritten.')
    if replacement is not None and ('\n' in replacement or '\r' in replacement or not pattern.match(replacement)):
        raise SystemExit('Invalid retained image setting.')
    if current==replacement:sys.exit(0)
    if indices:
        if replacement is None:del lines[indices[0]]
        else:lines[indices[0]]=replacement+'\n'
    elif replacement is not None:
        if lines and not lines[-1].endswith('\n'):lines[-1]+='\n'
        lines.append(replacement+'\n')
    fd,name=tempfile.mkstemp(prefix='.'+path.name+'.',dir=path.parent)
    try:
        with os.fdopen(fd,'w') as output:
            os.fchown(output.fileno(),info.st_uid,info.st_gid)
            os.fchmod(output.fileno(),stat.S_IMODE(info.st_mode))
            output.write(''.join(lines));output.flush();os.fsync(output.fileno())
        os.replace(name,path)
        parent=os.open(path.parent,os.O_RDONLY|os.O_DIRECTORY)
        try:os.fsync(parent)
        finally:os.close(parent)
    finally:
        if os.path.exists(name):os.unlink(name)
PYENV
}
current_setting="$(env_setting read)"
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
    jq --arg current "$current_id" --argjson setting "$current_setting" '{phase,version,reference,previousId,targetId,currentId:$current,matchesSelectedImage:($current==.targetId),persistentSelectionMatches:(has("targetSetting") and $setting==.targetSetting),matchesPreviousImage:($current==.previousId)}' "$state"
  else
    printf 'No partial image operation is recorded.\n'
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
  local target_setting previous_setting actual_setting
  target_setting="$(jq -c '.targetSetting' "$state")"
  previous_setting="$(jq -c '.previousSetting' "$state")"
  actual_setting="$(env_setting read)"
  [[ "$actual_setting" == "$target_setting" || "$actual_setting" == "$previous_setting" ]] || fail 'Persistent image setting changed; refusing to overwrite another deployment.'
  phase rolling-back
  env_setting replace "$actual_setting" "$previous_setting" || return 1
  if run_image "$previous" && healthy_image "$previous"; then
    phase rolled-back
    printf 'Previous service image restored and healthy.\n'
    return 0
  fi
  phase rollback-failed
  printf 'Rollback failed; inspect %s. Retained state: %s\n' "$container" "$state" >&2
  return 1
}
if [[ "$action" == rollback ]]; then
  [[ -f "$state" ]] || fail 'No retained service image to restore.'
  jq -e 'has("previousSetting") and has("targetSetting")' "$state" >/dev/null || fail 'Reapply the current digest to persist this legacy temporary update before rollback.'
  [[ "$(jq -er '.envFile' "$state")" == "$env_file" ]] || fail 'Deployment environment location changed.'
  [[ "$(jq -er '.version' "$state")" == "$version" && "$(jq -er '.project' "$state")" == "$project" ]] || fail 'Deployment changed since this operation; use the normal installer.'
  previous="$(jq -er '.previousId' "$state")"; target="$(jq -er '.targetId' "$state")"
  [[ "$current_id" == "$target" || "$current_id" == "$previous" ]] || fail 'Another deployment replaced the selected container; refusing to overwrite it.'
  rollback_saved
  exit
fi
[[ "$(inspect '.[0].State.Health.Status')" == healthy ]] || fail 'Existing service must be healthy before applying a temporary image.'
previous_id="$current_id"
previous_setting="$current_setting"
if [[ -f "$state" ]]; then
  old_phase="$(jq -er '.phase' "$state")"
  [[ "$old_phase" == applied || "$old_phase" == rolled-back ]] || fail 'An interrupted operation is recorded; inspect status and roll it back first.'
  if [[ "$old_phase" == applied ]]; then
    [[ "$(jq -r '.version' "$state")" == "$version" && "$(jq -r '.project' "$state")" == "$project" && "$(jq -r '.targetId' "$state")" == "$current_id" ]] || fail 'Deployment changed since the last partial update.'
    if jq -e 'has("targetSetting")' "$state" >/dev/null; then
      [[ "$(jq -c '.targetSetting' "$state")" == "$current_setting" ]] || fail 'Persistent image selection was changed by another deployment.'
      if [[ "$(jq -r '.reference' "$state")" == "$reference" ]]; then
        printf 'Selected image is already healthy and persistent.\n'
        exit 0
      fi
    else
      # Adopt the old runtime-only helper state without replacing the live image.
      [[ "$(jq -r '.reference' "$state")" == "$reference" ]] || fail 'First reapply the currently running digest to persist the legacy temporary update.'
      previous_id="$(jq -er '.previousId' "$state")"
    fi
  fi
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
image_version="$(jq -er '."io.myscoutee.package-version"' <<< "$candidate_labels")"
[[ "$image_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-qa\.[0-9]+)?$ ]] || fail 'Invalid image release version.'
if [[ "$image_version" != "${version/\~/-}" ]]; then
  # Cross-version image updates require the publisher to explicitly qualify
  # the installed host package. This does not run migrations or replace DEB files.
  compatible_versions="$(jq -r '."io.myscoutee.compatible-package-versions" // ""' <<< "$candidate_labels")"
  [[ "$compatible_versions" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-qa\.[0-9]+)?(,[0-9]+\.[0-9]+\.[0-9]+(-qa\.[0-9]+)?)*$ ]] || fail 'Image is for a different package version without explicit compatibility.'
  [[ ",$compatible_versions," == *",${version/\~/-},"* ]] || fail 'Installed package is not in the image compatibility list.'
fi
if [[ "$service" == nginx ]]; then
  probe_container="$(docker create --entrypoint /bin/true "$target_id")"
  trap 'docker rm "$probe_container" >/dev/null 2>&1 || true' EXIT
  candidate_version="$(docker cp "$probe_container:/usr/share/nginx/html/app-version.json" - | tar -xO | jq -er '.version')"
  docker rm "$probe_container" >/dev/null
  trap - EXIT
  [[ "$candidate_version" == "$image_version" ]] || fail 'Frontend content version does not match the image release.'
fi
if [[ "$service" == mongodb || "$service" == redis ]]; then
  # An image swap is not a database migration. Require the installed upstream version.
  expected_upstream="$(docker image inspect "$current_id" | jq -r '.[0].Config.Labels["io.myscoutee.upstream-reference"] // empty')"
  if [[ -z "$expected_upstream" ]]; then
    expected_upstream="$(cd "$server" && "${compose[@]}" config --format json | jq -er --arg s "$service" '.services[$s].image')"
  fi
  [[ "$(jq -er '."io.myscoutee.upstream-reference"' <<< "$candidate_labels")" == "$expected_upstream" ]] || fail 'Database image version differs; use a planned database migration.'
fi
[[ "$(inspect '.[0].Image')" == "$current_id" ]] || fail 'Service changed while downloading; refusing to replace it.'
target_setting="$(jq -nc --arg value "$image_var=$reference" '$value')"
[[ "$(env_setting read)" == "$current_setting" ]] || fail 'Image setting changed while downloading.'
[[ ! -f "$state" ]] || cp -p "$state" "$state_dir/previous-operation.json"
jq -n --arg envFile "$env_file" --argjson previousSetting "$previous_setting" --argjson targetSetting "$target_setting" --arg service "$service" --arg version "$version" --arg project "$project" --arg reference "$reference" --arg previous "$previous_id" --arg target "$target_id" \
  '{envFile:$envFile,previousSetting:$previousSetting,targetSetting:$targetSetting,phase:"applying",service:$service,version:$version,project:$project,reference:$reference,previousId:$previous,targetId:$target}' > "$state_dir/state.next"
mv -f "$state_dir/state.next" "$state"
# Persist intent, then the boot selection, before changing the live container.
if ! env_setting replace "$current_setting" "$target_setting"; then
  phase configuration-failed
  exit 1
fi
if run_image "$reference" && healthy_image "$target_id"; then
  phase applied
  printf 'Partial update installed, healthy and persistent. Package identity and data volumes retained.\n'
  printf 'Service restart and host reboot retain this image. Explicit rollback restores the previous selection.\n'
else
  phase failed
  printf 'Partial update failed its health check; restoring the previous image.\n' >&2
  rollback_saved || true
  exit 1
fi
