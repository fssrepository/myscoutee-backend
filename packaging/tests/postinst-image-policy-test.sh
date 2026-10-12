#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf -- "$work"' EXIT
mkdir -p "$work/opt/packaging/scripts" "$work/etc"
cp "$root/packaging/scripts/release-project.sh" "$work/opt/packaging/scripts/"
cp "$root/packaging/scripts/release-project.json" "$work/opt/packaging/scripts/"
for function_name in upsert_env_value normalize_packaged_image_values verify_packaged_image_manifest; do
  sed -n "/^${function_name}() {$/,/^}$/p" "$root/packaging/debian/postinst"
done | sed "s|\${PACKAGE_ROOT}|$work/opt|g; s|\${PACKAGE_ETC}|$work/etc|g; s|\${PACKAGE_NAME}|myscoutee|g" > "$work/functions.sh"
source "$work/functions.sh"
# Model installed file ownership only for the isolated policy; all remaining
# stat calls use the real filesystem. No host path or Docker process is touched.
stat() {
  if [[ "$*" == "-c %u $work/opt/packaging/scripts/release-project.json" ]]; then printf '0\n';
  else command stat "$@"; fi
}
fingerprint="sha256:$(printf 'a%.0s' {1..64})"
printf '#!/bin/sh\nprintf "%%s\\n" "%s"\n' "$fingerprint" \
  > "$work/opt/packaging/scripts/image-content-fingerprint.sh"
for project in myscoutee sample-template; do
  if [[ "$project" == sample-template ]]; then
    jq '.packageName="sample-template" | .images |= map(
      select(.service != "registry-demo" and .service != "payment-simulator")
      | .repository |= sub("^myscoutee-"; "sample-template-"))' \
      "$root/packaging/scripts/release-project.json" > "$work/opt/packaging/scripts/release-project.json"
  fi
  printf '1.3.0\n' > "$work/opt/packaging/VERSION"
  printf 'DOMAIN=retained.example\nNGINX_PRODUCTION_IMAGE=old:tag\n' > "$work/etc/myscoutee.env"
  normalize_packaged_image_values
  grep -Fxq DOMAIN=retained.example "$work/etc/myscoutee.env"
  grep -Fxq "NGINX_PRODUCTION_IMAGE=${project}-nginx:1.3.0-prod" "$work/etc/myscoutee.env"
  if [[ "$project" == sample-template ]]; then
    ! grep -Eq 'REGISTRY_DEMO_IMAGE|PAYMENT_SIMULATOR_IMAGE' "$work/etc/myscoutee.env"
  fi
  release_project_images 1.3.0 | jq --arg fingerprint "$fingerprint" '{schemaVersion:1,
    releaseVersion:"1.3.0",bundled:true,images:[.[] | {service,container,reference,
      imageId:$fingerprint,contentFingerprint:$fingerprint}]}' > "$work/opt/packaging/IMAGE-MANIFEST.json"
  verify_packaged_image_manifest
  cp "$work/opt/packaging/IMAGE-MANIFEST.json" "$work/valid.json"
  for mutation in '.images[0].reference="foreign:tag"' '.images += [.images[0]]' \
    '.images[0].contentFingerprint=("sha256:" + ("b" * 64))'; do
    jq "$mutation" "$work/valid.json" > "$work/opt/packaging/IMAGE-MANIFEST.json"
    if (verify_packaged_image_manifest) >/dev/null 2>&1; then
      echo "Accepted invalid installed image identity: $project $mutation" >&2; exit 1
    fi
  done
done
echo 'PASS: native/minimal installed image policy, retained settings, wrong reference, duplicate service and changed content rejection.'
