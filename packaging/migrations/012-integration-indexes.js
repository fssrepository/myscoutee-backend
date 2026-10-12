// Integration indexes belong to Mongo initialization and versioned migrations.
// Keep existing names/options and all stored credentials, grants and delivery data.
db.getCollection('integrationTokens').createIndex({ tokenHash: 1 }, { name: 'integration_token_hash', unique: true });
db.getCollection('integrationTokens').createIndex({ ownerUserId: 1, createdAtIso: -1 }, { name: 'integration_token_owner_created' });
db.getCollection('mcpOAuthClients').createIndex({ createdAt: 1 }, { name: 'createdAt' });
db.getCollection('mcpOAuthClients').createIndex({ expiresAt: 1 }, { name: 'expiresAt', expireAfterSeconds: 0 });
db.getCollection('mcpAuthorizations').createIndex({ clientId: 1 }, { name: 'clientId' });
db.getCollection('mcpAuthorizations').createIndex({ accessHash: 1 }, { name: 'accessHash' });
db.getCollection('mcpAuthorizations').createIndex({ refreshHash: 1 }, { name: 'refreshHash' });
db.getCollection('mcpAuthorizations').createIndex({ expiresAt: 1 }, { name: 'expiresAt', expireAfterSeconds: 0 });
db.getCollection('mcpEventSubscriptions').createIndex({ ownerUserId: 1, name: 1, resourceId: 1, enabled: 1 }, { name: 'mcp_events_owner_event' });
db.getCollection('mcpEventSubscriptions').createIndex({ ownerUserId: 1, tokenId: 1, clientId: 1, callbackUrl: 1 }, { name: 'mcp_events_callback' });
db.getCollection('mcpEventSubscriptions').createIndex({ ownerUserId: 1, enabled: 1, expiresAt: 1 }, { name: 'mcp_events_owner_active' });
db.getCollection('mcpEventSubscriptions').createIndex({ deleteAfter: 1 }, { name: 'deleteAfter', expireAfterSeconds: 0 });
db.getCollection('integrationWebhookDeliveries').createIndex({ protocol: 1, status: 1, ownerUserId: 1 }, { name: 'integration_delivery_protocol_status' });
db.getCollection('integrationWebhookDeliveries').createIndex({ status: 1, nextAttemptAtIso: 1, createdAtIso: 1 }, { name: 'integration_webhook_delivery_due' });
db.getCollection('integrationWebhookDeliveries').createIndex({ deleteAfter: 1 }, { name: 'deleteAfter', expireAfterSeconds: 0 });
print('Migration012: integration indexes ensured.');
