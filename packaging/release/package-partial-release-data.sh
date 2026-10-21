#!/usr/bin/env bash
# Stage versioned data inputs for apply-partial-release-data.sh; no host changes.
set -euo pipefail
[[ $# == 1 ]] || { echo 'Usage: package-partial-release-data.sh NEW_OUTPUT_DIRECTORY' >&2; exit 1; }
script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repository="$(cd -- "$script_directory/../.." && pwd)"
output="$1"
[[ ! -e "$output" ]] || { echo 'Output must not already exist.' >&2; exit 1; }
python3 "$repository/tools/seeds/check-system-seed-parity.py"
node "$repository/frontend/scripts/audit-i18n-mongo-seed.js"
manifest="$repository/packaging/migrations/seeds/023-seeded-image-webp/image-replacements.json"
media="$repository/server/docker/conf/minio/media"
python3 "$repository/packaging/scripts/migrate-seeded-media.py" check-inputs "$manifest" "$media"
mkdir -p "$output/scripts" "$output/seeds/production_db" "$output/seeds/demo_db"
cp -a "$repository/packaging/migrations" "$output/migrations"
for name in migrate-production-data.sh migrate-seeded-media.py run-data-migrations.js sync-release-system-seeds.js sync-i18n-seeds.sh release-project.sh release-project.json release-system-seeds.json; do
 install -m 0644 "$repository/packaging/scripts/$name" "$output/scripts/$name"
done
install -m 0755 "$script_directory/apply-partial-release-data.sh" "$output/apply-partial-release-data.sh"
mapfile -t names < <(jq -r '[.[].collection] + ["deploymentConfigurations", "helpCenterRevisions", "helpCenterGuideFields", "ideaPosts", "landingSlides", "emailTemplates", "notificationTemplates"] | unique[]' "$repository/packaging/scripts/release-system-seeds.json")
for database in production_db demo_db; do
 source_database="$database"; [[ "$database" != production_db ]] || source_database=myscoutee_db
 for name in "${names[@]}"; do
  install -m 0644 "$repository/server/docker/conf/mongodb/$source_database/$name.json" "$output/seeds/$database/$name.json"
 done
done
for name in campaigns serviceOfferings users; do
 install -m 0644 "$repository/server/docker/conf/mongodb/demo_db/$name.json" "$output/seeds/demo_db/$name.json"
done
while IFS= read -r key; do
 install -D -m 0644 "$media/$key" "$output/media/$key"
done < <(jq -r '.minio[].key' "$manifest")
(cd "$output" && find . -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS)
echo "Partial release data staged: $output"
