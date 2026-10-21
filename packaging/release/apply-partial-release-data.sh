#!/usr/bin/env bash
# Versioned data prerequisites for an explicitly selected container-only update.
# No DEB installation, demo reset or user-content replacement.
set -euo pipefail
[[ $(id -u) == 0 && $# == 1 ]] || { echo 'Run as root with the extracted release input directory.' >&2; exit 1; }
release=$(realpath "$1")
server=/opt/myscoutee/server
package=/opt/myscoutee/packaging
[[ -f "$release/migrations/006-release-system-defaults.js" && -f "$server/docker-compose-prod.yml" ]] || exit 1
# Use the same selection as the shared synchronizer, plus migration-owned catalogs.
# Validate the complete input set before any package backup or database mutation.
seed_selection="$(jq -er '[.[].collection] + ["deploymentConfigurations", "helpCenterRevisions", "helpCenterGuideFields", "ideaPosts", "landingSlides", "emailTemplates", "notificationTemplates"] | unique[]' "$release/scripts/release-system-seeds.json")"
mapfile -t seed_names <<< "$seed_selection"
for database in production_db demo_db; do
 for name in "${seed_names[@]}"; do
  [[ -f "$release/seeds/$database/$name.json" && ! -L "$release/seeds/$database/$name.json" ]] || exit 1
 done
done
for name in campaigns serviceOfferings users; do
 [[ -f "$release/seeds/demo_db/$name.json" && ! -L "$release/seeds/demo_db/$name.json" ]] || exit 1
done
media_manifest="$release/migrations/seeds/023-seeded-image-webp/image-replacements.json"
if [[ -f "$media_manifest" ]]; then
 [[ -f "$release/scripts/migrate-seeded-media.py" && ! -L "$release/scripts/migrate-seeded-media.py" ]] || exit 1
 python3 "$release/scripts/migrate-seeded-media.py" check-inputs "$media_manifest" "$release/media"
fi
# Preserve the small package-owned input set, independently of live Mongo data.
if [[ ! -f "$release/previous-package-data.tar" ]]; then
 tar -C /opt/myscoutee -cf "$release/previous-package-data.tar" \
  packaging/migrations packaging/scripts/migrate-production-data.sh \
  server/docker/conf/mongodb/myscoutee_db server/docker/conf/mongodb/demo_db
 chmod 0600 "$release/previous-package-data.tar"
fi
if [[ -f "$media_manifest" ]]; then
 # An old scheduler could recreate PNG references after migration023 has its
 # receipt. The existing partial service updater installs the matching API next.
 [[ "$(docker inspect --format '{{.State.Running}}' myscoutee)" == false ]] || {
  echo 'Stop profilemanagement with the installed Compose helper before applying the media release data.' >&2
  exit 1
 }
fi
seed_directory="$(docker exec mongodb mktemp -d /tmp/myscoutee-release-seeds.XXXXXX)"
trap 'docker exec mongodb rm -rf "$seed_directory" >/dev/null' EXIT
docker cp "$release/seeds/." "mongodb:$seed_directory"
for database in production_db demo_db; do
 MYSCOUTEE_MIGRATION_DATABASE="$database" \
 MYSCOUTEE_MIGRATION_SEED_DIRECTORY="$seed_directory/$database" \
 MYSCOUTEE_MIGRATION_MEDIA_DIRECTORY="$release/media" \
 MYSCOUTEE_MIGRATION_MEDIA_RETIRE=false MYSCOUTEE_MIGRATION_PREPARE_MINIO=false \
  bash "$release/scripts/migrate-production-data.sh"
 directory=$database; [[ "$database" != production_db ]] || directory=myscoutee_db
 for name in "${seed_names[@]}"; do
  install -m 0644 "$release/seeds/$database/$name.json" "$server/docker/conf/mongodb/$directory/$name.json"
 done
done
for name in campaigns serviceOfferings users; do
 install -m 0644 "$release/seeds/demo_db/$name.json" "$server/docker/conf/mongodb/demo_db/$name.json"
done
if [[ -f "$media_manifest" ]]; then
 python3 "$release/scripts/migrate-seeded-media.py" retire "$media_manifest" "$release/media"
 while IFS= read -r key; do
  install -D -m 0644 "$release/media/$key" "$server/docker/conf/minio/media/$key"
 done < <(jq -r '.minio[].key' "$media_manifest")
 install -m 0755 "$release/scripts/migrate-seeded-media.py" "$package/scripts/migrate-seeded-media.py"
fi
# Existing systemd startup must recognize schema5 on later service restarts.
for source in "$release"/migrations/*.js; do install -m 0644 "$source" "$package/migrations/$(basename "$source")"; done
if [[ -d "$release/migrations/seeds" ]]; then
 while IFS= read -r -d '' source; do
  install -D -m 0644 "$source" "$package/migrations/seeds/${source#"$release/migrations/seeds/"}"
 done < <(find "$release/migrations/seeds" -type f -name '*.json' -print0)
fi
for name in migrate-production-data.sh run-data-migrations.js sync-release-system-seeds.js sync-i18n-seeds.sh; do
 install -m 0755 "$release/scripts/$name" "$package/scripts/$name"
done
install -m 0644 "$release/scripts/release-system-seeds.json" "$package/scripts/release-system-seeds.json"
# Keep the installed startup order consistent: Mongo readiness, schema, seeds.
unit=/lib/systemd/system/myscoutee.service
if [[ -f "$unit" ]] && grep -q '^ExecStartPre=/opt/myscoutee/packaging/scripts/sync-i18n-seeds.sh$' "$unit"; then
 [[ -f "$release/previous-myscoutee.service" ]] || cp -p "$unit" "$release/previous-myscoutee.service"
 sed -i 's@^ExecStartPre=/opt/myscoutee/packaging/scripts/sync-i18n-seeds.sh$@ExecStartPre=/opt/myscoutee/packaging/scripts/sync-i18n-seeds.sh --prepare-only@' "$unit"
 systemctl daemon-reload
fi
echo 'Partial-update data prerequisites complete; user collections and installed DEB retained.'
