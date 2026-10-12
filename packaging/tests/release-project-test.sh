#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
source "${root}/packaging/scripts/release-project.sh"
temporary="$(mktemp -d)"
trap 'rm -rf -- "$temporary"' EXIT
install -m 0644 "${root}/packaging/scripts/release-project.json" "${temporary}/release-project.json"
release_project_load "$temporary" "$(id -u)"
[[ "$(release_project_images 1.0.2 | jq length)" == 6 ]]
[[ "$(release_project_images 1.3.0-qa.1 | jq length)" == 7 ]]

# A different product selects five existing framework images from its own
# installed policy. No Registry/payment image is required or accepted.
jq '.packageName = "sample-template" | .images |= map(
  select(.service != "registry-demo" and .service != "payment-simulator")
  | .repository |= sub("^myscoutee-"; "sample-template-")
  | .sinceVersion = "1.0.0")' "${temporary}/release-project.json" > "${temporary}/selected.json"
install -m 0644 "${temporary}/selected.json" "${temporary}/release-project.json"
release_project_load "$temporary" "$(id -u)"
[[ "$RELEASE_PROJECT_NAME" == sample-template && "$RELEASE_PROJECT_ROOT" == /opt/sample-template ]]
images="$(release_project_images 1.0.0)"
[[ "$(jq length <<< "$images")" == 5 ]]
release_project_export_images 1.0.0 true
[[ "$NGINX_BASE_IMAGE" == sample-template-nginx:1.0.0-base ]]
[[ "$MCP_IMAGE" == sample-template-mcp:1.0.0-prod ]]
if (NGINX_BASE_IMAGE=foreign:tag; release_project_export_images 1.0.0 true); then
  echo 'Accepted a release image override' >&2; exit 1
fi
(NGINX_BASE_IMAGE=local:test; release_project_export_images 1.0.0 false; [[ "$NGINX_BASE_IMAGE" == local:test ]])
jq -n --argjson images "$images" '{schemaVersion:1, releaseVersion:"1.0.0", bundled:true,
  images:[$images[] | {service,container,reference,
    imageId:("sha256:" + ("a" * 64)), contentFingerprint:("sha256:" + ("b" * 64))}]}' > "${temporary}/manifest.json"
release_project_validate_manifest "${temporary}/manifest.json" 1.0.0
for mutation in \
  '.images[0].reference = "foreign:1.0.0-prod"' \
  '.images[0].container = "foreign"' \
  '.images += [.images[0]]' \
  'del(.images[0].contentFingerprint)' \
  '.images[0].imageId = "sha256:wrong"' \
  '.images[0].unexpected = true' \
  '.releaseVersion = "1.0.1"' \
  '.bundled = false'; do
  jq "$mutation" "${temporary}/manifest.json" > "${temporary}/invalid.json"
  if release_project_validate_manifest "${temporary}/invalid.json" 1.0.0; then
    echo "Accepted invalid manifest: $mutation" >&2; exit 1
  fi
done
for mutation in \
  '.packageName = "../../outside"' \
  '.images += [.images[0]]' \
  '.images[0].repository = "foreign/path:tag"' \
  '.images[0].sinceVersion = "latest"' \
  '.unknown = true'; do
  jq "$mutation" "${temporary}/selected.json" > "${temporary}/release-project.json"
  if release_project_load "$temporary" "$(id -u)"; then
    echo "Accepted invalid installed policy: $mutation" >&2; exit 1
  fi
done
install -m 0666 "${temporary}/selected.json" "${temporary}/release-project.json"
if release_project_load "$temporary" "$(id -u)"; then echo 'Accepted writable policy' >&2; exit 1; fi
rm "${temporary}/release-project.json"
ln -s "${temporary}/selected.json" "${temporary}/release-project.json"
if release_project_load "$temporary" "$(id -u)"; then echo 'Accepted symlink policy' >&2; exit 1; fi
echo 'PASS native image history, minimal project inventory and 15 manifest/policy rejection cases'
