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
  'countryPartitions'
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

  portalDb.userExperienceProfiles.createIndex(
    { userId: 1 },
    { name: 'user_experience_profiles_user_id', unique: true }
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
