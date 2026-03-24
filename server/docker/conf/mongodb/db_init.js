const portalDb = db.getSiblingDB('myscoutee_db');
const requiredCollections = ['groups', 'profiles', 'users', 'events', 'messages'];
const existingCollections = new Set(portalDb.getCollectionNames());

requiredCollections.forEach(collectionName => {
  if (!existingCollections.has(collectionName)) {
    portalDb.createCollection(collectionName);
  }
});

portalDb.users.createIndex({ email: 1 }, { unique: true });
portalDb.messages.createIndex({ eventId: 1, createdDate: 1 });

if (!portalDb.getUser('guest')) {
  portalDb.createUser({
    user: 'guest',
    pwd: 'guest',
    roles: [
      { role: 'readWrite', db: 'myscoutee_db' }
    ]
  });
}
