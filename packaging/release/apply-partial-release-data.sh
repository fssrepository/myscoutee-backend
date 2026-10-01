#!/usr/bin/env bash
# Versioned data prerequisites for an explicitly selected container-only update.
# No DEB installation, demo reset or user-content replacement.
set -euo pipefail
[[ $(id -u) == 0 && $# == 1 ]] || { echo 'Run as root with the extracted release input directory.' >&2; exit 1; }
release=$(realpath "$1")
server=/opt/myscoutee/server
package=/opt/myscoutee/packaging
[[ -f "$release/migrations/006-release-system-defaults.js" && -f "$server/docker-compose-prod.yml" ]] || exit 1
for database in production_db demo_db; do
 for name in deploymentConfigurations exchangeRates notificationRuleConfigs countryPartitions helpCenterRevisions helpCenterGuideFields i18n_messages i18n_bundles; do
  [[ -f "$release/seeds/$database/$name.json" && ! -L "$release/seeds/$database/$name.json" ]] || exit 1
 done
done
# Preserve the small package-owned input set, independently of live Mongo data.
if [[ ! -f "$release/previous-package-data.tar" ]]; then
 tar -C /opt/myscoutee -cf "$release/previous-package-data.tar" \
  packaging/migrations packaging/scripts/migrate-production-data.sh \
  server/docker/conf/mongodb/myscoutee_db server/docker/conf/mongodb/demo_db
 chmod 0600 "$release/previous-package-data.tar"
fi
seed_directory="$(docker exec mongodb mktemp -d /tmp/myscoutee-release-seeds.XXXXXX)"
trap 'docker exec mongodb rm -rf "$seed_directory" >/dev/null' EXIT
docker cp "$release/seeds/." "mongodb:$seed_directory"
for database in production_db demo_db; do
 MYSCOUTEE_MIGRATION_DATABASE="$database" \
 MYSCOUTEE_MIGRATION_SEED_DIRECTORY="$seed_directory/$database" \
  bash "$release/scripts/migrate-production-data.sh"
 directory=$database; [[ "$database" != production_db ]] || directory=myscoutee_db
 for name in deploymentConfigurations exchangeRates notificationRuleConfigs countryPartitions helpCenterRevisions helpCenterGuideFields i18n_messages i18n_bundles; do
  install -m 0644 "$release/seeds/$database/$name.json" "$server/docker/conf/mongodb/$directory/$name.json"
 done
done
# Existing systemd startup must recognize schema5 on later service restarts.
for source in "$release"/migrations/*.js; do install -m 0644 "$source" "$package/migrations/$(basename "$source")"; done
for name in migrate-production-data.sh run-data-migrations.js sync-release-system-seeds.js sync-i18n-seeds.sh; do
 install -m 0755 "$release/scripts/$name" "$package/scripts/$name"
done
# Keep the installed startup order consistent: Mongo readiness, schema, seeds.
unit=/lib/systemd/system/myscoutee.service
if [[ -f "$unit" ]] && grep -q '^ExecStartPre=/opt/myscoutee/packaging/scripts/sync-i18n-seeds.sh$' "$unit"; then
 [[ -f "$release/previous-myscoutee.service" ]] || cp -p "$unit" "$release/previous-myscoutee.service"
 sed -i 's@^ExecStartPre=/opt/myscoutee/packaging/scripts/sync-i18n-seeds.sh$@ExecStartPre=/opt/myscoutee/packaging/scripts/sync-i18n-seeds.sh --prepare-only@' "$unit"
 systemctl daemon-reload
fi
echo 'Partial-update data prerequisites complete; user collections and installed DEB retained.'
