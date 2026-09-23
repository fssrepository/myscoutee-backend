#!/bin/sh
# Compose prerequisite: provision directories, never deployment identities.
set -eu
umask 077

runtime_root=${1:-/workspace/data}
owner_uid=${MYSCOUTEE_RUNTIME_UID:-1000}
owner_gid=${MYSCOUTEE_RUNTIME_GID:-1000}
case "$owner_uid:$owner_gid" in
  *[!0-9:]*|:*|*:) echo 'Runtime UID/GID must be numeric.' >&2; exit 1 ;;
esac
case "$runtime_root" in
  /*) ;;
  *) echo 'Runtime root must be absolute.' >&2; exit 1 ;;
esac

check_directory_path() {
  checked=$1
  while [ "$checked" != / ]; do
    if [ -L "$checked" ] || { [ -e "$checked" ] && [ ! -d "$checked" ]; }; then
      echo "Unsafe runtime directory: $checked" >&2
      exit 1
    fi
    checked=$(dirname -- "$checked")
  done
}

# Check all paths before changing permissions. Never recursively chown data,
# follow links, generate keys or start a server from this init service.
for name in configuration registry-demo-keys registry-demo-state release-simulator; do
  check_directory_path "$runtime_root/$name"
done
for name in configuration registry-demo-keys registry-demo-state release-simulator; do
  directory="$runtime_root/$name"
  mkdir -p -- "$directory"
  chown "$owner_uid:$owner_gid" -- "$directory"
  chmod 0700 -- "$directory"
done
echo 'Development runtime directories prepared.'
