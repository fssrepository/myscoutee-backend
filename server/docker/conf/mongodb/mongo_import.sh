#! /bin/bash
set -euo pipefail

db_name="${MONGO_APP_DATABASE:-${MONGO_INITDB_DATABASE:-demo_db}}"
seed_dir_name="${MONGO_SEED_DIRECTORY:-${db_name}}"
seed_root="/docker-entrypoint-initdb.d"
mongo_host="${MONGO_IMPORT_HOST:-127.0.0.1}"
mongo_port="${MONGO_IMPORT_PORT:-27017}"
mongo_username="${MONGO_IMPORT_USERNAME:-${MONGO_APP_USERNAME:-guest}}"
mongo_password="${MONGO_IMPORT_PASSWORD:-${MONGO_APP_PASSWORD:-guest}}"
replace_collections="${MONGO_IMPORT_REPLACE_COLLECTIONS:-false}"
single_file="${MONGO_IMPORT_SINGLE_FILE:-}"
allowed_collections_by_db="${MONGO_IMPORT_ALLOWED_COLLECTIONS_BY_DB:-demo_db:*;e2e_db:*;myscoutee_db:countryPartitions,i18n_bundles,i18n_messages,ideaPosts,helpCenterRevisions,adminUsers,appSettings,notificationRuleConfigs,emailTemplates,emailCampaignRules,notificationTemplates,scheduledMessageTasks,affinityConfigs,adminStats,adminMonitoring,accessPolicyDefinitions,operatorRegistryEndpoints,paymentProviders,communityProviders,deploymentConfigurations;production_db:countryPartitions,i18n_bundles,i18n_messages,ideaPosts,helpCenterRevisions,adminUsers,appSettings,notificationRuleConfigs,emailTemplates,emailCampaignRules,notificationTemplates,scheduledMessageTasks,affinityConfigs,adminStats,adminMonitoring,accessPolicyDefinitions,operatorRegistryEndpoints,paymentProviders,communityProviders,deploymentConfigurations}"

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
  local clear_command="db.getCollection('${collection_name}').deleteMany({})"

  if [ "${collection_name}" = "helpCenterRevisions" ]; then
    clear_command="db.getCollection('${collection_name}').drop()"
  fi

  mongosh \
    --host "${mongo_host}" \
    --port "${mongo_port}" \
    --username "${mongo_username}" \
    --password "${mongo_password}" \
    --authenticationDatabase "${target_db}" \
    --quiet \
    "${target_db}" \
    --eval "${clear_command}" >/dev/null
}

collection_should_replace_on_import() {
  local collection_name="$1"

  if [ "${collection_name}" = "adminUsers" ] \
      || [ "${collection_name}" = "deploymentConfigurations" ]; then
    return 1
  fi

  [ "${replace_collections}" = "true" ] || [ "${collection_name}" = "helpCenterRevisions" ]
}

target_collection_name() {
  local collection_name="$1"

  if [ "${collection_name}" = "adminUsers" ]; then
    printf '%s\n' "users"
    return 0
  fi

  printf '%s\n' "${collection_name}"
}

deployment_configuration_exists() {
  local target_db="$1"

  mongosh \
    --host "${mongo_host}" \
    --port "${mongo_port}" \
    --username "${mongo_username}" \
    --password "${mongo_password}" \
    --authenticationDatabase "${target_db}" \
    --quiet \
    "${target_db}" \
    --eval "
if (db.getCollection('deploymentConfigurations').countDocuments(
      { _id: 'deployment-configuration' },
      { limit: 1 }
    ) > 0) {
  quit(0);
}
quit(1);
" >/dev/null
}

import_deployment_configuration_seed() {
  local target_db="$1"
  local jsonfile="$2"

  if deployment_configuration_exists "${target_db}"; then
    echo "Preserving existing ${target_db}.deploymentConfigurations singleton."
    return 0
  fi

  # This singleton is mutable operator state after its first import. Insert
  # mode is deliberate: a concurrent importer/operator write can only make
  # this insert fail with a duplicate key; it can never overwrite that state.
  if mongoimport \
      -h "${mongo_host}" \
      --port "${mongo_port}" \
      -d "${target_db}" \
      -c "deploymentConfigurations" \
      -u "${mongo_username}" \
      -p "${mongo_password}" \
      --mode=insert \
      --file "${jsonfile}" \
      --jsonArray \
      --type json; then
    return 0
  fi

  if deployment_configuration_exists "${target_db}"; then
    echo "Preserving concurrently created ${target_db}.deploymentConfigurations singleton."
    return 0
  fi

  echo "Failed to insert ${target_db}.deploymentConfigurations singleton." >&2
  return 1
}

ensure_collection_indexes() {
  local target_db="$1"
  local collection_name="$2"

  case "${collection_name}" in
    users)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('users').createIndex({ syncKey: 1 }, { name: 'users_sync_key', unique: true, sparse: true });
db.getCollection('users').createIndex({ userId: 1 }, { name: 'users_user_id', unique: true });
db.getCollection('users').createIndex({ email: 1 }, { name: 'users_email', sparse: true });
db.getCollection('users').createIndex({ partitionKey: 1 }, { name: 'users_partition_key', sparse: true });
db.getCollection('users').createIndex({ profileStatus: 1 }, { name: 'users_profile_status' });
db.getCollection('users').createIndex({ profileStatus: 1, deletedAtIso: 1 }, { name: 'users_profile_status_deleted' });
db.getCollection('users').createIndex({ hostTier: 1 }, { name: 'users_host_tier' });
db.getCollection('users').createIndex({ name: 1, userId: 1 }, { name: 'users_name_user_id', collation: { locale: 'en', strength: 2 } });
" >/dev/null
      ;;
    userRates)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('userRates').createIndex({ syncKey: 1 }, { name: 'user_rate_sync_key', unique: true, sparse: true });
db.getCollection('userRates').createIndex({ ownerUserId: 1, mode: 1, updatedDate: -1 }, { name: 'user_rate_owner_mode_updated_v2' });
db.getCollection('userRates').createIndex({ relatedUserId: 1, updatedDate: -1 }, { name: 'user_rate_primary_lookup_v2' });
db.getCollection('userRates').createIndex({ secondaryRelatedUserId: 1, updatedDate: -1 }, { name: 'user_rate_secondary_lookup_v2', sparse: true });
db.getCollection('userRates').createIndex({ ownerUserId: 1, relatedUserId: 1, secondaryRelatedUserId: 1, mode: 1 }, { name: 'user_rate_owner_primary_mode_v2' });
db.getCollection('userRates').createIndex({ ownerUserId: 1, mode: 1, relatedUserId: 1, secondaryRelatedUserId: 1 }, { name: 'user_rate_owner_mode_target_unique_v1', unique: true });
db.getCollection('userRates').createIndex({ relatedUserId: 1, secondaryRelatedUserId: 1, mode: 1 }, { name: 'user_rate_pair_lookup_v2' });
db.getCollection('userRates').createIndex({ scoreGiven: 1, updatedDate: 1, createdDate: 1, ownerUserId: 1 }, { name: 'user_rate_qmau_window' });
" >/dev/null
      ;;
    appSettings)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('appSettings').createIndex({ settingsKey: 1 }, { name: 'app_settings_key', unique: true });
" >/dev/null
      ;;
    notificationRuleConfigs)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('notificationRuleConfigs').createIndex({ syncKey: 1 }, { name: 'notification_rule_config_sync_key', unique: true, sparse: true });
db.getCollection('notificationRuleConfigs').createIndex({ ruleKey: 1 }, { name: 'notification_rule_config_rule_key', unique: true });
" >/dev/null
      ;;
    emailTemplates)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('emailTemplates').createIndex({ syncKey: 1 }, { name: 'email_template_sync_key', unique: true, sparse: true });
db.getCollection('emailTemplates').createIndex({ templateKey: 1 }, { name: 'email_template_key', unique: true });
" >/dev/null
      ;;
    emailCampaignRules)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('emailCampaignRules').createIndex({ syncKey: 1 }, { name: 'email_campaign_rule_sync_key', unique: true, sparse: true });
db.getCollection('emailCampaignRules').createIndex({ ruleKey: 1 }, { name: 'email_campaign_rule_key', unique: true });
db.getCollection('emailCampaignRules').createIndex({ enabled: 1, priority: -1 }, { name: 'email_campaign_rule_enabled_priority' });
" >/dev/null
      ;;
    notificationTemplates)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('notificationTemplates').createIndex({ syncKey: 1 }, { name: 'notification_template_sync_key', unique: true, sparse: true });
db.getCollection('notificationTemplates').createIndex({ templateKey: 1 }, { name: 'notification_template_key', unique: true });
" >/dev/null
      ;;
    userNotifications)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('userNotifications').createIndex({ syncKey: 1 }, { name: 'user_notifications_sync_key', unique: true, sparse: true });
db.getCollection('userNotifications').createIndex({ recipientUserId: 1, readAtIso: 1, createdDate: -1, _id: -1 }, { name: 'user_notifications_recipient_read_created' });
db.getCollection('userNotifications').createIndex({ recipientUserId: 1, createdDate: -1, _id: -1 }, { name: 'user_notifications_recipient_created' });
db.getCollection('userNotifications').createIndex({ sourceType: 1, sourceId: 1, createdDate: -1 }, { name: 'user_notifications_source_created' });
" >/dev/null
      ;;
    scheduledMessageTasks)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('scheduledMessageTasks').createIndex({ syncKey: 1 }, { name: 'scheduled_message_task_sync_key', unique: true, sparse: true });
db.getCollection('scheduledMessageTasks').createIndex({ taskKey: 1 }, { name: 'scheduled_message_task_key', unique: true });
db.getCollection('scheduledMessageTasks').createIndex({ status: 1, dueAtIso: 1 }, { name: 'scheduled_message_task_status_due' });
" >/dev/null
      ;;
    affinityConfigs)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('affinityConfigs').createIndex({ active: 1, version: -1 }, { name: 'affinity_config_active_version' });
db.getCollection('affinityConfigs').createIndex({ key: 1, version: -1 }, { name: 'affinity_config_key_version', unique: true });
" >/dev/null
      ;;
    adminStats)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('adminStats').createIndex({ statsKey: 1 }, { name: 'admin_stats_key', unique: true });
" >/dev/null
      ;;
    adminMonitoring)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('adminMonitoring').createIndex({ monitoringKey: 1 }, { name: 'admin_monitoring_key', unique: true });
" >/dev/null
      ;;
    userFilterPreferences)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('userFilterPreferences').createIndex({ syncKey: 1 }, { name: 'user_filter_preferences_sync_key', unique: true, sparse: true });
db.getCollection('userFilterPreferences').createIndex({ userId: 1 }, { name: 'user_filter_preferences_user', unique: true });
" >/dev/null
      ;;
    assets)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('assets').createIndex({ syncKey: 1 }, { name: 'asset_sync_key', unique: true, sparse: true });
db.getCollection('assets').createIndex({ assetId: 1 }, { name: 'asset_logical_id' });
db.getCollection('assets').createIndex({ ownerUserId: 1, assetId: 1 }, { name: 'asset_owner_asset_id', unique: true });
db.getCollection('assets').createIndex({ ownerUserId: 1, updatedDate: -1 }, { name: 'asset_owner_updated' });
" >/dev/null
      ;;
    assetRequests)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('assetRequests').createIndex({ status: 1, requestedAtIso: 1, userId: 1 }, { name: 'asset_request_qmau_booking_window' });
" >/dev/null
      ;;
    activityMembers)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('activityMembers').createIndex({ syncKey: 1 }, { name: 'activity_member_sync_key', unique: true, sparse: true });
db.getCollection('activityMembers').createIndex({ ownerType: 1, ownerId: 1, userId: 1 }, { name: 'activity_member_owner_user', unique: true });
db.getCollection('activityMembers').createIndex({ ownerType: 1, ownerId: 1, actionAtIso: -1 }, { name: 'activity_member_owner_action' });
db.getCollection('activityMembers').createIndex({ ownerType: 1, ownerId: 1, status: 1, actionAtIso: -1 }, { name: 'activity_member_owner_status' });
db.getCollection('activityMembers').createIndex({ ownerType: 1, userId: 1, actionAtIso: -1 }, { name: 'activity_member_user_action' });
db.getCollection('activityMembers').createIndex({ ownerType: 1, status: 1, requestKind: 1 }, { name: 'activity_member_status_request' });
db.getCollection('activityMembers').createIndex({ ownerType: 1, status: 1, actionAtIso: 1, userId: 1 }, { name: 'activity_member_qmau_join' });
" >/dev/null
      ;;
    activityResources)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('activityResources').createIndex({ syncKey: 1 }, { name: 'activity_resource_sync_key', unique: true, sparse: true });
db.getCollection('activityResources').createIndex({ recordId: 1 }, { name: 'activity_resource_record_id', unique: true });
db.getCollection('activityResources').createIndex({ ownerId: 1, subEventId: 1, assetOwnerUserId: 1 }, { name: 'activity_resource_owner_subevent_asset_owner' });
db.getCollection('activityResources').createIndex({ assetOwnerUserId: 1, ownerId: 1 }, { name: 'activity_resource_owner_key' });
" >/dev/null
      ;;
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
db.getCollection('chats').createIndex({ memberIds: 1, dateIso: -1 }, { name: 'chat_member_date' });
db.getCollection('chats').createIndex({ channelType: 1, dateIso: -1 }, { name: 'chat_channel_date' });
" >/dev/null
      ;;
    chatMessages)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('chatMessages').createIndex({ chatId: 1, id: 1 }, { name: 'chat_message_lookup', unique: true });
db.getCollection('chatMessages').createIndex({ chatId: 1, sentAtIso: -1, id: -1 }, { name: 'chat_message_page_desc' });
db.getCollection('chatMessages').createIndex({ messageSenderUserIds: 1, sentAtIso: -1 }, { name: 'chat_message_sender_date' });
db.getCollection('chatMessages').createIndex({ messageReadByUserIds: 1, sentAtIso: -1 }, { name: 'chat_message_reader_date' });
db.getCollection('chatMessages').createIndex({ messageReactionUserIds: 1, sentAtIso: -1 }, { name: 'chat_message_reaction_date' });
db.getCollection('chatMessages').createIndex({ messageAttachmentKeys: 1, sentAtIso: -1 }, { name: 'chat_message_attachment_date' });
db.getCollection('chatMessages').createIndex({ pollVoterUserIds: 1, sentAtIso: -1 }, { name: 'chat_poll_voter_date' });
db.getCollection('chatMessages').createIndex({ sentAtIso: 1, 'senderAvatar.id': 1, deletedAtIso: 1 }, { name: 'chat_message_qmau_window' });
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
db.getCollection('events').deleteMany({
  \$or: [
    { generated: true },
    { parentEventId: { \$exists: true, \$nin: [null, ''] } }
  ]
});
db.getCollection('events').updateMany({}, {
  \$unset: {
    generated: '',
    parentEventId: '',
    slotTemplateId: '',
    upcomingSlots: ''
  }
});
db.getCollection('events').createIndex({ syncKey: 1 }, { name: 'event_sync_key', unique: true, sparse: true });
db.getCollection('events').createIndex({ ownerUserId: 1, type: 1, sourceId: 1 }, { name: 'event_owner_type_source', unique: true });
db.getCollection('events').createIndex({ ownerUserId: 1, type: 1, startAtIso: 1 }, { name: 'event_owner_type' });
db.getCollection('events').createIndex({ ownerUserId: 1, type: 1, status: 1, startAtIso: 1 }, { name: 'event_owner_type_status_start' });
db.getCollection('events').createIndex({ ownerUserId: 1, startAtIso: 1, sourceId: 1 }, { name: 'event_owner_start_source' });
db.getCollection('events').createIndex({ ownerUserId: 1, sourceId: 1 }, { name: 'event_owner_source' });
db.getCollection('events').createIndex({ sourceId: 1, type: 1 }, { name: 'event_source_lookup' });
db.getCollection('events').createIndex({ sourceId: 1, startAtIso: 1, type: 1 }, { name: 'event_source_start_lookup' });
db.getCollection('events').createIndex({ status: 1, creatorUserId: 1, visibility: 1 }, { name: 'event_explore_visibility' });
db.getCollection('events').createIndex({ type: 1, status: 1, generated: 1, creatorUserId: 1, sourceId: 1 }, { name: 'event_explore_candidates_status' });
db.getCollection('events').createIndex({ type: 1, status: 1, generated: 1, published: 1, startAtIso: 1, sourceId: 1 }, { name: 'event_explore_feed_status' });
db.getCollection('events').createIndex({ expired: 1, endAtIso: 1, sourceId: 1 }, { name: 'event_expired_end' });
db.getCollection('events').createIndex({ expired: 1, startAtIso: 1, sourceId: 1 }, { name: 'event_expired_start' });
db.getCollection('events').createIndex({ locationGeo: '2dsphere' }, { name: 'event_location_geo' });
db.getCollection('events').createIndex({ status: 1, generated: 1, createdDate: 1, creatorUserId: 1 }, { name: 'event_qmau_host_window' });
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
    navigatorContacts)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('navigatorContacts').createIndex({ userId: 1 }, { name: 'navigator_contacts_user_id', unique: true });
" >/dev/null
      ;;
    operatorRegistryEndpoints)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('operatorRegistryEndpoints').createIndex({ enabled: 1, sortOrder: 1, label: 1, _id: 1 }, { name: 'operator_registry_endpoint_enabled_sort' });
db.getCollection('operatorRegistryEndpoints').createIndex({ baseUrl: 1, registryScope: 1 }, { name: 'operator_registry_endpoint_base_scope', unique: true });
" >/dev/null
      ;;
    paymentProviders)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('paymentProviders').createIndex({ enabled: 1, sortOrder: 1, label: 1, _id: 1 }, { name: 'payment_provider_enabled_sort' });
" >/dev/null
      ;;
    communityProviders)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('communityProviders').createIndex({ enabled: 1, sortOrder: 1, name: 1, _id: 1 }, { name: 'community_provider_enabled_sort' });
" >/dev/null
      ;;
    payments)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('payments').createIndex({ status: 1, provider: 1, auditKind: 1, createdDate: 1, _id: 1 }, { name: 'payment_revenue_period_scan' });
" >/dev/null
      ;;
    revenueReportOutbox)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('revenueReportOutbox').createIndex({ deploymentId: 1, period: 1, revision: 1 }, { name: 'revenue_outbox_deployment_period_revision', unique: true });
db.getCollection('revenueReportOutbox').createIndex({ deploymentId: 1, status: 1, nextRetryAt: 1, period: 1, revision: 1 }, { name: 'revenue_outbox_delivery' });
db.getCollection('revenueReportOutbox').createIndex({ idempotencyKey: 1 }, { name: 'revenue_outbox_idempotency', unique: true });
" >/dev/null
      ;;
    qualifiedMauReportOutbox)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('qualifiedMauReportOutbox').createIndex({ deploymentId: 1, period: 1, revision: 1 }, { name: 'qmau_outbox_deployment_period_revision', unique: true });
db.getCollection('qualifiedMauReportOutbox').createIndex({ deploymentId: 1, status: 1, nextRetryAt: 1, period: 1, revision: 1 }, { name: 'qmau_outbox_delivery' });
db.getCollection('qualifiedMauReportOutbox').createIndex({ idempotencyKey: 1 }, { name: 'qmau_outbox_idempotency', unique: true });
" >/dev/null
      ;;
    eventFeedbackStates)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('eventFeedbackStates').createIndex({ syncKey: 1 }, { name: 'event_feedback_state_sync_key', unique: true, sparse: true });
db.getCollection('eventFeedbackStates').createIndex({ viewerUserId: 1, eventId: 1 }, { name: 'event_feedback_state_user_event', unique: true });
db.getCollection('eventFeedbackStates').createIndex({ viewerUserId: 1, updatedDate: -1 }, { name: 'event_feedback_state_user_updated' });
db.getCollection('eventFeedbackStates').createIndex({ eventId: 1, updatedDate: -1 }, { name: 'event_feedback_state_event_updated' });
db.getCollection('eventFeedbackStates').createIndex({ removed: 1, submittedAtIso: 1, viewerUserId: 1, eventId: 1 }, { name: 'event_feedback_state_qmau_window' });
" >/dev/null
      ;;
    eventFeedbackAnswers)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('eventFeedbackAnswers').createIndex({ syncKey: 1 }, { name: 'event_feedback_answer_sync_key', unique: true, sparse: true });
db.getCollection('eventFeedbackAnswers').createIndex({ viewerUserId: 1, eventId: 1, cardId: 1 }, { name: 'event_feedback_answer_user_event_card', unique: true });
db.getCollection('eventFeedbackAnswers').createIndex({ viewerUserId: 1, eventId: 1 }, { name: 'event_feedback_answer_user_event' });
db.getCollection('eventFeedbackAnswers').createIndex({ viewerUserId: 1, eventId: 1, submittedAtIso: -1 }, { name: 'event_feedback_answer_user_event_submitted' });
db.getCollection('eventFeedbackAnswers').createIndex({ eventId: 1, submittedAtIso: -1 }, { name: 'event_feedback_answer_event_submitted' });
db.getCollection('eventFeedbackAnswers').createIndex({ targetUserId: 1, submittedAtIso: -1 }, { name: 'event_feedback_answer_target_user_submitted' });
" >/dev/null
      ;;
    ideaPosts)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('ideaPosts').createIndex({ contentKey: 1, lang: 1 }, { name: 'idea_post_content_lang', unique: true });
db.getCollection('ideaPosts').createIndex({ lang: 1, submittedAtIso: -1 }, { name: 'idea_post_lang_submitted' });
db.getCollection('ideaPosts').createIndex({ lang: 1, published: 1, submittedAtIso: -1 }, { name: 'idea_post_lang_published_submitted' });
db.getCollection('ideaPosts').createIndex({ lang: 1, published: 1, submittedAtIso: -1, _id: -1 }, { name: 'idea_post_public_page' });
db.getCollection('ideaPosts').createIndex({ lang: 1, published: 1, featured: 1, submittedAtIso: -1, _id: -1 }, { name: 'idea_post_public_featured_preview' });
db.getCollection('ideaPosts').createIndex({ published: 1, submittedAtIso: -1 }, { name: 'idea_post_published_submitted' });
db.getCollection('ideaPosts').createIndex({ featured: 1, published: 1, submittedAtIso: -1 }, { name: 'idea_post_featured_submitted' });
db.getCollection('ideaPosts').createIndex({ trashed: 1, submittedAtIso: -1 }, { name: 'idea_post_trashed_submitted' });
" >/dev/null
      ;;
    privacyConsents)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('privacyConsents').createIndex({ userId: 1, revisionId: 1 }, { name: 'privacy_consent_user_revision', unique: true });
db.getCollection('privacyConsents').createIndex({ userId: 1 }, { name: 'privacy_consent_user' });
db.getCollection('privacyConsents').createIndex({ revisionId: 1 }, { name: 'privacy_consent_revision' });
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
    userAffinityEdges)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('userAffinityEdges').createIndex({ pairKey: 1 }, { name: 'user_affinity_edge_pair_key', unique: true });
db.getCollection('userAffinityEdges').createIndex({ leftUserId: 1, rightUserId: 1 }, { name: 'user_affinity_edge_left_right', unique: true });
db.getCollection('userAffinityEdges').createIndex({ leftUserId: 1, edgeWeight: -1 }, { name: 'user_affinity_edge_left_weight' });
db.getCollection('userAffinityEdges').createIndex({ rightUserId: 1, edgeWeight: -1 }, { name: 'user_affinity_edge_right_weight' });
" >/dev/null
      ;;
    adminAffinityGraphLayouts)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('adminAffinityGraphLayouts').createIndex({ layoutVersion: 1 }, { name: 'admin_affinity_graph_layout_version', unique: true });
db.getCollection('adminAffinityGraphLayouts').createIndex({ generatedAtIso: 1 }, { name: 'admin_affinity_graph_layout_generated_at' });
" >/dev/null
      ;;
    adminAffinityGraphNodes)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('adminAffinityGraphNodes').createIndex({ layoutVersion: 1 }, { name: 'admin_affinity_graph_node_layout' });
db.getCollection('adminAffinityGraphNodes').createIndex({ layoutVersion: 1, userId: 1 }, { name: 'admin_affinity_graph_node_layout_user', unique: true });
db.getCollection('adminAffinityGraphNodes').createIndex({ layoutVersion: 1, tileZ: 1, tileX: 1, tileY: 1 }, { name: 'admin_affinity_graph_node_layout_tile' });
db.getCollection('adminAffinityGraphNodes').createIndex({ layoutVersion: 1, x: 1, z: 1 }, { name: 'admin_affinity_graph_node_layout_position' });
db.getCollection('adminAffinityGraphNodes').createIndex({ layoutVersion: 1, componentId: 1 }, { name: 'admin_affinity_graph_node_layout_component' });
db.getCollection('adminAffinityGraphNodes').createIndex({ layoutVersion: 1, centrality: -1 }, { name: 'admin_affinity_graph_node_layout_centrality' });
" >/dev/null
      ;;
    adminAffinityGraphEdges)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('adminAffinityGraphEdges').createIndex({ layoutVersion: 1 }, { name: 'admin_affinity_graph_edge_layout' });
db.getCollection('adminAffinityGraphEdges').createIndex({ layoutVersion: 1, sourceUserId: 1, targetUserId: 1 }, { name: 'admin_affinity_graph_edge_layout_pair', unique: true });
db.getCollection('adminAffinityGraphEdges').createIndex({ layoutVersion: 1, sourceUserId: 1 }, { name: 'admin_affinity_graph_edge_layout_source' });
db.getCollection('adminAffinityGraphEdges').createIndex({ layoutVersion: 1, targetUserId: 1 }, { name: 'admin_affinity_graph_edge_layout_target' });
db.getCollection('adminAffinityGraphEdges').createIndex({ layoutVersion: 1, componentId: 1, lodLevel: 1 }, { name: 'admin_affinity_graph_edge_layout_component_lod' });
db.getCollection('adminAffinityGraphEdges').createIndex({ layoutVersion: 1, weight: -1 }, { name: 'admin_affinity_graph_edge_layout_weight' });
" >/dev/null
      ;;
    adminAffinityGraphForests)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('adminAffinityGraphForests').createIndex({ layoutVersion: 1 }, { name: 'admin_affinity_graph_forest_layout' });
db.getCollection('adminAffinityGraphForests').createIndex({ layoutVersion: 1, componentId: 1 }, { name: 'admin_affinity_graph_forest_layout_component', unique: true });
db.getCollection('adminAffinityGraphForests').createIndex({ layoutVersion: 1, memberCount: -1 }, { name: 'admin_affinity_graph_forest_layout_size' });
" >/dev/null
      ;;
    helpCenterRevisions)
      mongosh \
        --host "${mongo_host}" \
        --port "${mongo_port}" \
        --username "${mongo_username}" \
        --password "${mongo_password}" \
        --authenticationDatabase "${target_db}" \
        --quiet \
        "${target_db}" \
        --eval "
db.getCollection('helpCenterRevisions').createIndex({ documentType: 1, lang: 1, contextKey: 1, version: -1 }, { name: 'help_revision_document_lang_context_version', unique: true });
db.getCollection('helpCenterRevisions').createIndex({ documentType: 1, lang: 1, contextKey: 1, active: 1, version: -1 }, { name: 'help_revision_document_lang_context_active' });
db.getCollection('helpCenterRevisions').createIndex({ documentType: 1 }, { name: 'help_revision_document_type' });
db.getCollection('helpCenterRevisions').createIndex({ lang: 1 }, { name: 'help_revision_lang' });
db.getCollection('helpCenterRevisions').createIndex({ contextKey: 1 }, { name: 'help_revision_context_key' });
db.getCollection('helpCenterRevisions').createIndex({ active: 1 }, { name: 'help_revision_active' });
" >/dev/null
      ;;
  esac
}

ensure_runtime_indexes() {
  local target_db="$1"

  ensure_collection_indexes "${target_db}" "operatorRegistryEndpoints"
  ensure_collection_indexes "${target_db}" "paymentProviders"
  ensure_collection_indexes "${target_db}" "communityProviders"
  ensure_collection_indexes "${target_db}" "payments"
  ensure_collection_indexes "${target_db}" "revenueReportOutbox"
  ensure_collection_indexes "${target_db}" "qualifiedMauReportOutbox"
  ensure_collection_indexes "${target_db}" "adminAffinityGraphLayouts"
  ensure_collection_indexes "${target_db}" "adminAffinityGraphNodes"
  ensure_collection_indexes "${target_db}" "adminAffinityGraphEdges"
  ensure_collection_indexes "${target_db}" "adminAffinityGraphForests"
}

import_json_file() {
  local target_db="$1"
  local jsonfile="$2"
  local collection_name
  local target_collection
  collection_name="$(basename "${jsonfile}" .json)"
  target_collection="$(target_collection_name "${collection_name}")"

  if ! collection_is_seed_managed "${target_db}" "${collection_name}"; then
    echo "Skipping runtime-managed collection ${target_db}.${collection_name}; seed import is disabled for this collection."
    return 0
  fi

  # All seed files are JSON arrays of documents. If the file contains no object
  # start at all, it is just an empty array like "[]", which mongoimport rejects.
  if ! json_file_has_documents "${jsonfile}"; then
    if collection_should_replace_on_import "${collection_name}" && database_has_wildcard_seed_rule "${target_db}"; then
      clear_collection "${target_db}" "${target_collection}"
      ensure_collection_indexes "${target_db}" "${target_collection}"
      echo "Cleared ${target_db}.${target_collection} because the seed file ${jsonfile} is empty."
      return 0
    fi

    echo "Skipping empty JSON array seed ${jsonfile}"
    return 0
  fi

  if [ "${collection_name}" = "deploymentConfigurations" ]; then
    import_deployment_configuration_seed "${target_db}" "${jsonfile}"
    return 0
  fi

  if collection_should_replace_on_import "${collection_name}"; then
    clear_collection "${target_db}" "${target_collection}"
  fi

  mongoimport \
    -h "${mongo_host}" \
    --port "${mongo_port}" \
    -d "${target_db}" \
    -c "${target_collection}" \
    -u "${mongo_username}" \
    -p "${mongo_password}" \
    --mode=upsert \
    --upsertFields _id \
    --file "$jsonfile" \
    --jsonArray \
    --type json

  ensure_collection_indexes "${target_db}" "${target_collection}"
}

import_seed_directory() {
  local target_db="$1"
  local target_seed_dir_name="$2"
  local seed_dir="${seed_root}/${target_seed_dir_name}"

  if [ ! -d "${seed_dir}" ]; then
    echo "Seed directory ${seed_dir} does not exist, skipping mongoimport."
    ensure_runtime_indexes "${target_db}"
    return 0
  fi

  find "${seed_dir}" -maxdepth 1 \( -type f -o -type l \) -name '*.json' | sort | while read -r jsonfile; do
    import_json_file "${target_db}" "${jsonfile}"
  done
  ensure_runtime_indexes "${target_db}"
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
  if [ "${db_name}" != "demo_db" ]; then
    import_seed_directory "${db_name}" "${seed_dir_name}"
  fi
  exit 0
fi

import_seed_directory "${db_name}" "${seed_dir_name}"
