#! /bin/bash
set -euo pipefail

db_name="${MONGO_APP_DATABASE:-${MONGO_INITDB_DATABASE:-demo_db}}"
seed_dir_name="${MONGO_SEED_DIRECTORY:-${db_name}}"
seed_root="/docker-entrypoint-initdb.d"
mongo_host="${MONGO_IMPORT_HOST:-127.0.0.1}"
mongo_port="${MONGO_IMPORT_PORT:-27017}"
mongo_username="${MONGO_IMPORT_USERNAME:-guest}"
mongo_password="${MONGO_IMPORT_PASSWORD:-guest}"
replace_collections="${MONGO_IMPORT_REPLACE_COLLECTIONS:-false}"
single_file="${MONGO_IMPORT_SINGLE_FILE:-}"
allowed_collections_by_db="${MONGO_IMPORT_ALLOWED_COLLECTIONS_BY_DB:-demo_db:*;myscoutee_db:countryPartitions,i18n_bundles,i18n_messages}"

json_file_has_documents() {
  local jsonfile="$1"

  grep -q '{' "${jsonfile}"
}

database_has_wildcard_seed_rule() {
  local target_db="$1"
  local old_ifs="${IFS}"
  local db_rules=()

  IFS=';'
  read -r -a db_rules <<< "${allowed_collections_by_db}"
  IFS="${old_ifs}"

  local db_rule
  for db_rule in "${db_rules[@]}"; do
    local rule_db="${db_rule%%:*}"
    local collections_csv="${db_rule#*:}"

    if [ "${rule_db}" != "${target_db}" ]; then
      continue
    fi

    local collection_rules=()
    IFS=','
    read -r -a collection_rules <<< "${collections_csv}"
    IFS="${old_ifs}"

    local allowed_collection
    for allowed_collection in "${collection_rules[@]}"; do
      if [ "${allowed_collection}" = "*" ]; then
        return 0
      fi
    done
  done

  return 1
}

collection_is_seed_managed() {
  local target_db="$1"
  local collection_name="$2"
  local old_ifs="${IFS}"
  local db_rules=()

  IFS=';'
  read -r -a db_rules <<< "${allowed_collections_by_db}"
  IFS="${old_ifs}"

  local db_rule
  for db_rule in "${db_rules[@]}"; do
    local rule_db="${db_rule%%:*}"
    local collections_csv="${db_rule#*:}"

    if [ "${rule_db}" != "${target_db}" ]; then
      continue
    fi

    local collection_rules=()
    IFS=','
    read -r -a collection_rules <<< "${collections_csv}"
    IFS="${old_ifs}"

    local allowed_collection
    for allowed_collection in "${collection_rules[@]}"; do
      if [ "${allowed_collection}" = "*" ] || [ "${allowed_collection}" = "${collection_name}" ]; then
        return 0
      fi
    done
  done

  return 1
}

clear_collection() {
  local target_db="$1"
  local collection_name="$2"

  mongosh \
    --host "${mongo_host}" \
    --port "${mongo_port}" \
    --username "${mongo_username}" \
    --password "${mongo_password}" \
    --authenticationDatabase "${target_db}" \
    --quiet \
    "${target_db}" \
    --eval "db.getCollection('${collection_name}').deleteMany({})" >/dev/null
}

ensure_collection_indexes() {
  local target_db="$1"
  local collection_name="$2"

  case "${collection_name}" in
    chats)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('chats').createIndex({ ownerUserId: 1, id: 1 }, { name: 'chat_owner_public_id', unique: true });
db.getCollection('chats').createIndex({ id: 1 }, { name: 'chat_public_id_lookup' });
db.getCollection('chats').createIndex({ ownerUserId: 1, dateIso: -1 }, { name: 'chat_owner_date' });
" >/dev/null
      ;;
    events)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('events').createIndex({ syncKey: 1 }, { name: 'event_sync_key', unique: true, sparse: true });
db.getCollection('events').createIndex({ ownerUserId: 1, type: 1, sourceId: 1 }, { name: 'event_owner_type_source', unique: true });
db.getCollection('events').createIndex({ ownerUserId: 1, type: 1, startAtIso: 1 }, { name: 'event_owner_type' });
db.getCollection('events').createIndex({ ownerUserId: 1, type: 1, status: 1, startAtIso: 1 }, { name: 'event_owner_type_status_start' });
db.getCollection('events').createIndex({ ownerUserId: 1, sourceId: 1 }, { name: 'event_owner_source' });
db.getCollection('events').createIndex({ sourceId: 1, type: 1 }, { name: 'event_source_lookup' });
db.getCollection('events').createIndex({ status: 1, creatorUserId: 1, visibility: 1 }, { name: 'event_explore_visibility' });
db.getCollection('events').createIndex({ type: 1, status: 1, generated: 1, creatorUserId: 1, sourceId: 1 }, { name: 'event_explore_candidates_status' });
db.getCollection('events').createIndex({ type: 1, status: 1, generated: 1, published: 1, startAtIso: 1, sourceId: 1 }, { name: 'event_explore_feed_status' });
db.getCollection('events').createIndex({ locationGeo: '2dsphere' }, { name: 'event_location_geo' });
" >/dev/null
      ;;
    userExperienceProfiles)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('userExperienceProfiles').createIndex({ userId: 1 }, { name: 'user_experience_profiles_user_id', unique: true });
" >/dev/null
      ;;
    i18n_bundles)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('i18n_bundles').createIndex({ lang: 1 }, { name: 'i18n_bundles_lang', unique: true });
" >/dev/null
      ;;
    i18n_messages)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('i18n_messages').createIndex({ key: 1, lang: 1 }, { name: 'i18n_messages_key_lang', unique: true });
" >/dev/null
      ;;
  esac
}

import_json_file() {
  local target_db="$1"
  local jsonfile="$2"
  local collection_name
  collection_name="$(basename "${jsonfile}" .json)"

  if ! collection_is_seed_managed "${target_db}" "${collection_name}"; then
    echo "Skipping runtime-managed collection ${target_db}.${collection_name}; seed import is disabled for this collection."
    return 0
  fi

  # All seed files are JSON arrays of documents. If the file contains no object
  # start at all, it is just an empty array like "[]", which mongoimport rejects.
  if ! json_file_has_documents "${jsonfile}"; then
    if [ "${replace_collections}" = "true" ] && database_has_wildcard_seed_rule "${target_db}"; then
      clear_collection "${target_db}" "${collection_name}"
      ensure_collection_indexes "${target_db}" "${collection_name}"
      echo "Cleared ${target_db}.${collection_name} because the seed file ${jsonfile} is empty."
      return 0
    fi

    echo "Skipping empty JSON array seed ${jsonfile}"
    return 0
  fi

  if [ "${replace_collections}" = "true" ]; then
    clear_collection "${target_db}" "${collection_name}"
  fi

  mongoimport \
    -h "${mongo_host}" \
    --port "${mongo_port}" \
    -d "${target_db}" \
    -c "${collection_name}" \
    -u "${mongo_username}" \
    -p "${mongo_password}" \
    --mode=upsert \
    --upsertFields _id \
    --file "$jsonfile" \
    --jsonArray \
    --type json

  ensure_collection_indexes "${target_db}" "${collection_name}"
}

import_seed_directory() {
  local target_db="$1"
  local target_seed_dir_name="$2"
  local seed_dir="${seed_root}/${target_seed_dir_name}"

  if [ ! -d "${seed_dir}" ]; then
    echo "Seed directory ${seed_dir} does not exist, skipping mongoimport."
    return 0
  fi

  find "${seed_dir}" -maxdepth 1 -type f -name '*.json' | sort | while read -r jsonfile; do
    import_json_file "${target_db}" "${jsonfile}"
  done
}

import_single_file() {
  local target_db="$1"
  local jsonfile="$2"

  if [ ! -f "${jsonfile}" ]; then
    echo "Seed file ${jsonfile} does not exist, skipping mongoimport."
    exit 0
  fi

  import_json_file "${target_db}" "${jsonfile}"
}

if [ -n "${single_file}" ]; then
  import_single_file "${db_name}" "${single_file}"
  exit 0
fi

if [ "${MONGO_IMPORT_ALL_SEED_DATABASES:-false}" = "true" ]; then
  import_seed_directory "demo_db" "demo_db"
  import_seed_directory "myscoutee_db" "myscoutee_db"
  exit 0
fi

import_seed_directory "${db_name}" "${seed_dir_name}"
