#!/bin/sh
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT HUP INT TERM
export MYSCOUTEE_RUNTIME_UID=${MYSCOUTEE_RUNTIME_UID:-$(id -u)}
export MYSCOUTEE_RUNTIME_GID=${MYSCOUTEE_RUNTIME_GID:-$(id -g)}

mkdir "$test_root/data"
chmod 0755 "$test_root/data"
sh "$script_dir/prepare_dev_runtime_directories.sh" "$test_root/data"
for name in configuration registry-demo-keys registry-demo-state; do
  test "$(stat -c '%u:%g:%a' "$test_root/data/$name")" = \
    "$MYSCOUTEE_RUNTIME_UID:$MYSCOUTEE_RUNTIME_GID:700"
  test -z "$(ls -A "$test_root/data/$name")"
done
printf '%s' 'retained-key-content' > "$test_root/data/registry-demo-keys/existing"
before=$(sha256sum "$test_root/data/registry-demo-keys/existing")
file_mode=$(stat -c '%u:%g:%a' "$test_root/data/registry-demo-keys/existing")
sh "$script_dir/prepare_dev_runtime_directories.sh" "$test_root/data"
test "$before" = "$(sha256sum "$test_root/data/registry-demo-keys/existing")"
test "$file_mode" = "$(stat -c '%u:%g:%a' "$test_root/data/registry-demo-keys/existing")"

mkdir "$test_root/outside" "$test_root/unsafe"
ln -s "$test_root/outside" "$test_root/unsafe/registry-demo-keys"
if sh "$script_dir/prepare_dev_runtime_directories.sh" "$test_root/unsafe"; then
  echo 'FAIL: accepted a symlink' >&2; exit 1
fi
test ! -e "$test_root/unsafe/configuration"
test -z "$(ls -A "$test_root/outside")"
if MYSCOUTEE_RUNTIME_UID=invalid sh "$script_dir/prepare_dev_runtime_directories.sh" "$test_root/data"; then
  echo 'FAIL: accepted an invalid owner' >&2; exit 1
fi
echo 'PASS: ownership, mode, empty provisioning, retained file preservation, repeat, symlink and invalid-owner checks.'
