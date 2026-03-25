const portalDb = db.getSiblingDB('myscoutee_db');
const requiredCollections = [
  'users',
  'userRates',
  'userFilterPreferences',
  'assets',
  'activityMembers',
  'activityResources',
  'chats',
  'events'
];
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
      { role: 'readWrite', db: 'myscoutee_db' }
    ]
  });
}
