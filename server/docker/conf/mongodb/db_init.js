const requiredCollections = [
  'users',
  'userRates',
  'userFilterPreferences',
  'assets',
  'activityMembers',
  'activityResources',
  'chats',
  'chatMessages',
  'events',
  'eventFeedbackStates',
  'eventFeedbackAnswers',
  'ideaPosts',
  'appSettings',
  'helpCenterRevisions',
  'helpCenterAudit',
  'privacyConsents',
  'userExperienceProfiles',
  'countryPartitions',
  'i18n_bundles',
  'i18n_messages'
];

const appUsername = process.env.MONGO_APP_USERNAME || 'guest';
const appPassword = process.env.MONGO_APP_PASSWORD || 'guest';

const configuredDatabases = [
  'demo_db',
  'myscoutee_db',
  process.env.MONGO_INITDB_DATABASE,
  process.env.MONGO_APP_DATABASE,
  process.env.MONGO_DEMO_DATABASE,
  process.env.MONGO_REAL_DATABASE,
  process.env.MONGO_PLAYGROUND_DATABASE
]
  .map(value => (value || '').trim())
  .filter(Boolean);

Array.from(new Set(configuredDatabases)).forEach(databaseName => {
  const portalDb = db.getSiblingDB(databaseName);
  const existingCollections = new Set(portalDb.getCollectionNames());

  requiredCollections.forEach(collectionName => {
    if (!existingCollections.has(collectionName)) {
      portalDb.createCollection(collectionName);
    }
  });

  portalDb.countryPartitions.createIndex(
    { partitionKey: 1 },
    { name: 'country_partition_key', unique: true }
  );
  portalDb.countryPartitions.createIndex(
    { countryCode: 1 },
    { name: 'country_partition_code', unique: true, sparse: true }
  );
  portalDb.countryPartitions.createIndex(
    { geometry: '2dsphere' },
    { name: 'country_partition_geometry' }
  );

  portalDb.users.createIndex(
    { syncKey: 1 },
    { name: 'users_sync_key', unique: true, sparse: true }
  );
  portalDb.users.createIndex(
    { userId: 1 },
    { name: 'users_user_id', unique: true }
  );
  portalDb.users.createIndex(
    { email: 1 },
    { name: 'users_email', sparse: true }
  );
  portalDb.users.createIndex(
    { partitionKey: 1 },
    { name: 'users_partition_key', sparse: true }
  );
  portalDb.users.createIndex(
    { profileStatus: 1 },
    { name: 'users_profile_status' }
  );
  portalDb.users.createIndex(
    { profileStatus: 1, deletedAtIso: 1 },
    { name: 'users_profile_status_deleted' }
  );
  portalDb.users.createIndex(
    { hostTier: 1 },
    { name: 'users_host_tier' }
  );

  portalDb.appSettings.createIndex(
    { settingsKey: 1 },
    { name: 'app_settings_key', unique: true }
  );

  portalDb.userRates.createIndex(
    { syncKey: 1 },
    { name: 'user_rate_sync_key', unique: true, sparse: true }
  );
  portalDb.userRates.createIndex(
    { ownerUserId: 1, mode: 1, updatedDate: -1 },
    { name: 'user_rate_owner_mode_updated_v2' }
  );
  portalDb.userRates.createIndex(
    { relatedUserId: 1, updatedDate: -1 },
    { name: 'user_rate_primary_lookup_v2' }
  );
  portalDb.userRates.createIndex(
    { secondaryRelatedUserId: 1, updatedDate: -1 },
    { name: 'user_rate_secondary_lookup_v2', sparse: true }
  );
  portalDb.userRates.createIndex(
    { ownerUserId: 1, relatedUserId: 1, secondaryRelatedUserId: 1, mode: 1 },
    { name: 'user_rate_owner_primary_mode_v2' }
  );
  portalDb.userRates.createIndex(
    { relatedUserId: 1, secondaryRelatedUserId: 1, mode: 1 },
    { name: 'user_rate_pair_lookup_v2' }
  );

  portalDb.userFilterPreferences.createIndex(
    { syncKey: 1 },
    { name: 'user_filter_preferences_sync_key', unique: true, sparse: true }
  );
  portalDb.userFilterPreferences.createIndex(
    { userId: 1 },
    { name: 'user_filter_preferences_user', unique: true }
  );

  portalDb.assets.createIndex(
    { syncKey: 1 },
    { name: 'asset_sync_key', unique: true, sparse: true }
  );
  portalDb.assets.createIndex(
    { assetId: 1 },
    { name: 'asset_logical_id' }
  );
  portalDb.assets.createIndex(
    { ownerUserId: 1, assetId: 1 },
    { name: 'asset_owner_asset_id', unique: true }
  );
  portalDb.assets.createIndex(
    { ownerUserId: 1, updatedDate: -1 },
    { name: 'asset_owner_updated' }
  );

  portalDb.activityMembers.createIndex(
    { syncKey: 1 },
    { name: 'activity_member_sync_key', unique: true, sparse: true }
  );
  portalDb.activityMembers.createIndex(
    { ownerType: 1, ownerId: 1, userId: 1 },
    { name: 'activity_member_owner_user', unique: true }
  );
  portalDb.activityMembers.createIndex(
    { ownerType: 1, ownerId: 1, actionAtIso: -1 },
    { name: 'activity_member_owner_action' }
  );
  portalDb.activityMembers.createIndex(
    { ownerType: 1, ownerId: 1, status: 1, actionAtIso: -1 },
    { name: 'activity_member_owner_status' }
  );
  portalDb.activityMembers.createIndex(
    { ownerType: 1, userId: 1, actionAtIso: -1 },
    { name: 'activity_member_user_action' }
  );
  portalDb.activityMembers.createIndex(
    { ownerType: 1, status: 1, requestKind: 1 },
    { name: 'activity_member_status_request' }
  );

  portalDb.activityResources.createIndex(
    { syncKey: 1 },
    { name: 'activity_resource_sync_key', unique: true, sparse: true }
  );
  portalDb.activityResources.createIndex(
    { recordId: 1 },
    { name: 'activity_resource_record_id', unique: true }
  );
  portalDb.activityResources.createIndex(
    { ownerId: 1, subEventId: 1, assetOwnerUserId: 1 },
    { name: 'activity_resource_owner_subevent_asset_owner' }
  );
  portalDb.activityResources.createIndex(
    { assetOwnerUserId: 1, ownerId: 1 },
    { name: 'activity_resource_owner_key' }
  );

  portalDb.events.createIndex(
    { syncKey: 1 },
    { name: 'event_sync_key', unique: true, sparse: true }
  );
  portalDb.events.createIndex(
    { ownerUserId: 1, type: 1, sourceId: 1 },
    { name: 'event_owner_type_source', unique: true }
  );
  portalDb.events.createIndex(
    { ownerUserId: 1, type: 1, startAtIso: 1 },
    { name: 'event_owner_type' }
  );
  portalDb.events.createIndex(
    { ownerUserId: 1, type: 1, status: 1, startAtIso: 1 },
    { name: 'event_owner_type_status_start' }
  );
  portalDb.events.createIndex(
    { ownerUserId: 1, startAtIso: 1, sourceId: 1 },
    { name: 'event_owner_start_source' }
  );
  portalDb.events.createIndex(
    { ownerUserId: 1, sourceId: 1 },
    { name: 'event_owner_source' }
  );
  portalDb.events.createIndex(
    { sourceId: 1, type: 1 },
    { name: 'event_source_lookup' }
  );
  portalDb.events.createIndex(
    { sourceId: 1, startAtIso: 1, type: 1 },
    { name: 'event_source_start_lookup' }
  );
  portalDb.events.createIndex(
    { status: 1, creatorUserId: 1, visibility: 1 },
    { name: 'event_explore_visibility' }
  );
  portalDb.events.createIndex(
    { type: 1, status: 1, generated: 1, creatorUserId: 1, sourceId: 1 },
    { name: 'event_explore_candidates_status' }
  );
  portalDb.events.createIndex(
    { type: 1, status: 1, generated: 1, published: 1, startAtIso: 1, sourceId: 1 },
    { name: 'event_explore_feed_status' }
  );
  portalDb.events.createIndex(
    { locationGeo: '2dsphere' },
    { name: 'event_location_geo' }
  );

  portalDb.chats.createIndex(
    { ownerUserId: 1, id: 1 },
    { name: 'chat_owner_public_id', unique: true }
  );
  portalDb.chats.createIndex(
    { id: 1 },
    { name: 'chat_public_id_lookup' }
  );
  portalDb.chats.createIndex(
    { ownerUserId: 1, dateIso: -1 },
    { name: 'chat_owner_date' }
  );
  portalDb.chats.createIndex(
    { memberIds: 1, dateIso: -1 },
    { name: 'chat_member_date' }
  );
  portalDb.chats.createIndex(
    { channelType: 1, dateIso: -1 },
    { name: 'chat_channel_date' }
  );
  portalDb.chatMessages.createIndex(
    { chatId: 1, id: 1 },
    { name: 'chat_message_lookup', unique: true }
  );
  portalDb.chatMessages.createIndex(
    { chatId: 1, sentAtIso: -1, id: -1 },
    { name: 'chat_message_page_desc' }
  );
  portalDb.chatMessages.createIndex(
    { messageSenderUserIds: 1, sentAtIso: -1 },
    { name: 'chat_message_sender_date' }
  );
  portalDb.chatMessages.createIndex(
    { messageReadByUserIds: 1, sentAtIso: -1 },
    { name: 'chat_message_reader_date' }
  );
  portalDb.chatMessages.createIndex(
    { messageReactionUserIds: 1, sentAtIso: -1 },
    { name: 'chat_message_reaction_date' }
  );
  portalDb.chatMessages.createIndex(
    { messageAttachmentKeys: 1, sentAtIso: -1 },
    { name: 'chat_message_attachment_date' }
  );
  portalDb.chatMessages.createIndex(
    { pollVoterUserIds: 1, sentAtIso: -1 },
    { name: 'chat_poll_voter_date' }
  );

  portalDb.eventFeedbackStates.createIndex(
    { syncKey: 1 },
    { name: 'event_feedback_state_sync_key', unique: true, sparse: true }
  );
  portalDb.eventFeedbackStates.createIndex(
    { viewerUserId: 1, eventId: 1 },
    { name: 'event_feedback_state_user_event', unique: true }
  );
  portalDb.eventFeedbackStates.createIndex(
    { viewerUserId: 1, updatedDate: -1 },
    { name: 'event_feedback_state_user_updated' }
  );
  portalDb.eventFeedbackStates.createIndex(
    { eventId: 1, updatedDate: -1 },
    { name: 'event_feedback_state_event_updated' }
  );

  portalDb.eventFeedbackAnswers.createIndex(
    { syncKey: 1 },
    { name: 'event_feedback_answer_sync_key', unique: true, sparse: true }
  );
  portalDb.eventFeedbackAnswers.createIndex(
    { viewerUserId: 1, eventId: 1, cardId: 1 },
    { name: 'event_feedback_answer_user_event_card', unique: true }
  );
  portalDb.eventFeedbackAnswers.createIndex(
    { viewerUserId: 1, eventId: 1 },
    { name: 'event_feedback_answer_user_event' }
  );
  portalDb.eventFeedbackAnswers.createIndex(
    { targetUserId: 1, submittedAtIso: -1 },
    { name: 'event_feedback_answer_target_user_submitted' }
  );

  portalDb.ideaPosts.createIndex(
    { contentKey: 1, lang: 1 },
    { name: 'idea_post_content_lang', unique: true }
  );
  portalDb.ideaPosts.createIndex(
    { lang: 1, submittedAtIso: -1 },
    { name: 'idea_post_lang_submitted' }
  );
  portalDb.ideaPosts.createIndex(
    { lang: 1, published: 1, submittedAtIso: -1 },
    { name: 'idea_post_lang_published_submitted' }
  );
  portalDb.ideaPosts.createIndex(
    { published: 1, submittedAtIso: -1 },
    { name: 'idea_post_published_submitted' }
  );
  portalDb.ideaPosts.createIndex(
    { featured: 1, published: 1, submittedAtIso: -1 },
    { name: 'idea_post_featured_submitted' }
  );
  portalDb.ideaPosts.createIndex(
    { trashed: 1, submittedAtIso: -1 },
    { name: 'idea_post_trashed_submitted' }
  );

  portalDb.privacyConsents.createIndex(
    { userId: 1, revisionId: 1 },
    { name: 'privacy_consent_user_revision', unique: true }
  );
  portalDb.privacyConsents.createIndex(
    { userId: 1 },
    { name: 'privacy_consent_user' }
  );
  portalDb.privacyConsents.createIndex(
    { revisionId: 1 },
    { name: 'privacy_consent_revision' }
  );

  portalDb.userExperienceProfiles.createIndex(
    { userId: 1 },
    { name: 'user_experience_profiles_user_id', unique: true }
  );

  portalDb.i18n_bundles.createIndex(
    { lang: 1 },
    { name: 'i18n_bundles_lang', unique: true }
  );
  portalDb.i18n_messages.createIndex(
    { key: 1, lang: 1 },
    { name: 'i18n_messages_key_lang', unique: true }
  );

  if (!portalDb.getUser(appUsername)) {
    portalDb.createUser({
      user: appUsername,
      pwd: appPassword,
      roles: [
        { role: 'readWrite', db: databaseName }
      ]
    });
  }
});
