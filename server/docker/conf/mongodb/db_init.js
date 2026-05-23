const requiredCollections = [
  'users',
  'userRates',
  'userFilterPreferences',
  'assets',
  'activityMembers',
  'activityResources',
  'chats',
  'events',
  'eventFeedbackStates',
  'eventFeedbackAnswers',
  'userExperienceProfiles',
  'countryPartitions',
  'i18n_bundles',
  'i18n_messages'
];

['demo_db', 'myscoutee_db'].forEach(databaseName => {
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
    { ownerUserId: 1, sourceId: 1 },
    { name: 'event_owner_source' }
  );
  portalDb.events.createIndex(
    { sourceId: 1, type: 1 },
    { name: 'event_source_lookup' }
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
  portalDb.chats.createIndex(
    { messageSenderUserIds: 1, dateIso: -1 },
    { name: 'chat_message_sender_date' }
  );
  portalDb.chats.createIndex(
    { messageReadByUserIds: 1, dateIso: -1 },
    { name: 'chat_message_reader_date' }
  );
  portalDb.chats.createIndex(
    { messageReactionUserIds: 1, dateIso: -1 },
    { name: 'chat_message_reaction_date' }
  );
  portalDb.chats.createIndex(
    { messageAttachmentKeys: 1, dateIso: -1 },
    { name: 'chat_message_attachment_date' }
  );
  portalDb.chats.createIndex(
    { pollVoterUserIds: 1, dateIso: -1 },
    { name: 'chat_poll_voter_date' }
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

  if (!portalDb.getUser('guest')) {
    portalDb.createUser({
      user: 'guest',
      pwd: 'guest',
      roles: [
        { role: 'readWrite', db: databaseName }
      ]
    });
  }
});
