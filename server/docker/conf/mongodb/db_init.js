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
