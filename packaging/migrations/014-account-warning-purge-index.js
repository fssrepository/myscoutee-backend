// Index the account-owned deletion-warning claims used by permanent profile cleanup.
// Retain all records; the existing purge worker removes only its selected user.
db.getCollection('accountDeletionWarnings').createIndex({ userId: 1 }, { name: 'account_warning_user' });
print('Migration014: account deletion-warning cleanup index ensured.');
