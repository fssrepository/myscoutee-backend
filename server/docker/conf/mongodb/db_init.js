const requiredCollections = [
  'users',
  'userRates',
  'userFilterPreferences',
  'assets',
  'assetRequests',
  'activityMembers',
  'activityResources',
  'eventCheckoutBasketItems',
  'payments',
  'savedPaymentMethods',
  'revenueReportOutbox',
  'qualifiedMauReportOutbox',
  'accessPolicyDefinitions',
  'accessGrants',
  'chats',
  'chatMessages',
  'events',
  'eventTickets',
  'eventFeedbackStates',
  'eventFeedbackAnswers',
  'ideaPosts',
  'appSettings',
  'notificationRuleConfigs',
  'emailTemplates',
  'emailCampaignRules',
  'notificationTemplates',
  'userNotifications',
  'scheduledMessageTasks',
  'affinityConfigs',
  'adminStats',
  'adminMonitoring',
  'helpCenterRevisions',
  'helpCenterGuideFields',
  'helpCenterAudit',
  'privacyConsents',
  'accountDeletionWarnings',
  'userExperienceProfiles',
  'navigatorContacts',
  'countryPartitions',
  'operatorRegistryEndpoints',
  'paymentProviders',
  'communityProviders',
  'deploymentConfigurations',
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
  process.env.MONGO_E2E_DATABASE
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

  portalDb.accountDeletionWarnings.createIndex({ userId: 1 }, { name: 'account_warning_user' });

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

  portalDb.integrationTokens.createIndex({ tokenHash: 1 }, { name: 'integration_token_hash', unique: true });
  portalDb.integrationTokens.createIndex({ ownerUserId: 1, createdAtIso: -1 }, { name: 'integration_token_owner_created' });
  portalDb.mcpOAuthClients.createIndex({ createdAt: 1 }, { name: 'createdAt' });
  portalDb.mcpOAuthClients.createIndex({ expiresAt: 1 }, { name: 'expiresAt', expireAfterSeconds: 0 });
  portalDb.mcpAuthorizations.createIndex({ clientId: 1 }, { name: 'clientId' });
  portalDb.mcpAuthorizations.createIndex({ accessHash: 1 }, { name: 'accessHash' });
  portalDb.mcpAuthorizations.createIndex({ refreshHash: 1 }, { name: 'refreshHash' });
  portalDb.mcpAuthorizations.createIndex({ expiresAt: 1 }, { name: 'expiresAt', expireAfterSeconds: 0 });
  portalDb.mcpEventSubscriptions.createIndex({ ownerUserId: 1, name: 1, resourceId: 1, enabled: 1 }, { name: 'mcp_events_owner_event' });
  portalDb.mcpEventSubscriptions.createIndex({ ownerUserId: 1, tokenId: 1, clientId: 1, callbackUrl: 1 }, { name: 'mcp_events_callback' });
  portalDb.mcpEventSubscriptions.createIndex({ ownerUserId: 1, enabled: 1, expiresAt: 1 }, { name: 'mcp_events_owner_active' });
  portalDb.mcpEventSubscriptions.createIndex({ deleteAfter: 1 }, { name: 'deleteAfter', expireAfterSeconds: 0 });
  portalDb.integrationWebhookDeliveries.createIndex({ protocol: 1, status: 1, ownerUserId: 1 }, { name: 'integration_delivery_protocol_status' });
  portalDb.integrationWebhookDeliveries.createIndex({ status: 1, nextAttemptAtIso: 1, createdAtIso: 1 }, { name: 'integration_webhook_delivery_due' });
  portalDb.integrationWebhookDeliveries.createIndex({ deleteAfter: 1 }, { name: 'deleteAfter', expireAfterSeconds: 0 });

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
    { name: 'users_email', unique: true, sparse: true }
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
  portalDb.users.createIndex(
    { name: 1, userId: 1 },
    { name: 'users_name_user_id', collation: { locale: 'en', strength: 2 } }
  );

  portalDb.appSettings.createIndex(
    { settingsKey: 1 },
    { name: 'app_settings_key', unique: true }
  );
  portalDb.notificationRuleConfigs.createIndex(
    { syncKey: 1 },
    { name: 'notification_rule_config_sync_key', unique: true, sparse: true }
  );
  portalDb.notificationRuleConfigs.createIndex(
    { ruleKey: 1 },
    { name: 'notification_rule_config_rule_key', unique: true }
  );
  portalDb.emailTemplates.createIndex(
    { syncKey: 1 },
    { name: 'email_template_sync_key', unique: true, sparse: true }
  );
  portalDb.emailTemplates.createIndex(
    { templateKey: 1 },
    { name: 'email_template_key', unique: true }
  );
  portalDb.emailCampaignRules.createIndex(
    { syncKey: 1 },
    { name: 'email_campaign_rule_sync_key', unique: true, sparse: true }
  );
  portalDb.emailCampaignRules.createIndex(
    { ruleKey: 1 },
    { name: 'email_campaign_rule_key', unique: true }
  );
  portalDb.emailCampaignRules.createIndex(
    { enabled: 1, priority: -1 },
    { name: 'email_campaign_rule_enabled_priority' }
  );
  portalDb.notificationTemplates.createIndex(
    { syncKey: 1 },
    { name: 'notification_template_sync_key', unique: true, sparse: true }
  );
  portalDb.notificationTemplates.createIndex(
    { templateKey: 1 },
    { name: 'notification_template_key', unique: true }
  );
  portalDb.userNotifications.createIndex(
    { syncKey: 1 },
    { name: 'user_notifications_sync_key', unique: true, sparse: true }
  );
  portalDb.userNotifications.createIndex(
    { recipientUserId: 1, readAtIso: 1, createdDate: -1, _id: -1 },
    { name: 'user_notifications_recipient_read_created' }
  );
  portalDb.userNotifications.createIndex(
    { recipientUserId: 1, createdDate: -1, _id: -1 },
    { name: 'user_notifications_recipient_created' }
  );
  portalDb.userNotifications.createIndex(
    { sourceType: 1, sourceId: 1, createdDate: -1 },
    { name: 'user_notifications_source_created' }
  );
  portalDb.userNotifications.createIndex(
    { recipientUserId: 1, kind: 1, sourceType: 1, sourceId: 1, readAtIso: 1 },
    { name: 'user_notifications_recipient_kind_source' }
  );
  portalDb.scheduledMessageTasks.createIndex(
    { syncKey: 1 },
    { name: 'scheduled_message_task_sync_key', unique: true, sparse: true }
  );
  portalDb.scheduledMessageTasks.createIndex(
    { taskKey: 1 },
    { name: 'scheduled_message_task_key', unique: true }
  );
  portalDb.scheduledMessageTasks.createIndex(
    { status: 1, dueAtIso: 1 },
    { name: 'scheduled_message_task_status_due' }
  );
  portalDb.affinityConfigs.createIndex(
    { active: 1, version: -1 },
    { name: 'affinity_config_active_version' }
  );
  portalDb.affinityConfigs.createIndex(
    { key: 1, version: -1 },
    { name: 'affinity_config_key_version', unique: true }
  );
  portalDb.adminStats.createIndex(
    { statsKey: 1 },
    { name: 'admin_stats_key', unique: true }
  );
  portalDb.adminMonitoring.createIndex(
    { monitoringKey: 1 },
    { name: 'admin_monitoring_key', unique: true }
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
    { ownerUserId: 1, mode: 1, relatedUserId: 1, secondaryRelatedUserId: 1, campaignId: 1 },
    { name: 'user_rate_owner_mode_target_campaign_unique_v2', unique: true }
  );
  if (portalDb.userRates.getIndexes().some(index => index.name === 'user_rate_owner_mode_target_unique_v1')) {
    portalDb.userRates.dropIndex('user_rate_owner_mode_target_unique_v1');
  }
  portalDb.userRates.createIndex(
    { relatedUserId: 1, secondaryRelatedUserId: 1, mode: 1 },
    { name: 'user_rate_pair_lookup_v2' }
  );
  portalDb.userRates.createIndex(
    { scoreGiven: 1, updatedDate: 1, createdDate: 1, ownerUserId: 1 },
    { name: 'user_rate_qmau_window' }
  );

  portalDb.userFilterPreferences.createIndex(
    { syncKey: 1 },
    { name: 'user_filter_preferences_sync_key', unique: true, sparse: true }
  );

  portalDb.eventTickets.createIndex(
    { code: 1 },
    { name: 'event_ticket_code', unique: true }
  );
  portalDb.eventTickets.createIndex(
    { eventId: 1, holderUserId: 1 },
    {
      name: 'event_ticket_active_event_holder',
      unique: true,
      partialFilterExpression: { status: 'A' }
    }
  );
  portalDb.eventTickets.createIndex(
    { eventId: 1, usedAtIso: 1 },
    { name: 'event_ticket_event_used' }
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

  portalDb.assetRequests.createIndex(
    { status: 1, requestedAtIso: 1, userId: 1 },
    { name: 'asset_request_qmau_booking_window' }
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
  portalDb.activityMembers.createIndex(
    { ownerType: 1, status: 1, actionAtIso: 1, userId: 1 },
    { name: 'activity_member_qmau_join' }
  );

  portalDb.eventCheckoutBasketItems.createIndex(
    { userId: 1, sourceId: 1, status: 1, updatedAtIso: -1 },
    { name: 'checkout_basket_user_source_status' }
  );
  portalDb.eventCheckoutBasketItems.createIndex(
    { userId: 1, sourceId: 1, status: 1, resultState: 1, updatedAtIso: -1 },
    { name: 'checkout_basket_user_source_result_status' }
  );
  portalDb.eventCheckoutBasketItems.createIndex(
    { userId: 1, sourceId: 1, itemId: 1 },
    {
      name: 'checkout_basket_active_user_source_item',
      unique: true,
      partialFilterExpression: { reservationActive: true }
    }
  );
  portalDb.eventCheckoutBasketItems.createIndex(
    { expiresAtIso: 1, status: 1 },
    { name: 'checkout_basket_expiry_status' }
  );

  portalDb.payments.createIndex(
    { userId: 1, sourceId: 1, createdDate: -1 },
    { name: 'payment_user_source' }
  );
  portalDb.payments.createIndex(
    { userId: 1, sourceId: 1, bookingStatus: 1, createdDate: -1 },
    { name: 'payment_user_source_booking' }
  );
  portalDb.payments.createIndex(
    { revisionRootSessionId: 1, revisionNumber: -1, createdDate: -1 },
    { name: 'payment_revision_root' }
  );
  portalDb.payments.createIndex(
    { checkoutSessionId: 1 },
    { name: 'payment_checkout_session', unique: true, sparse: true }
  );
  portalDb.payments.createIndex(
    { gatewaySessionId: 1 },
    { name: 'payment_gateway_session', unique: true, sparse: true }
  );
  portalDb.payments.createIndex(
    { status: 1, provider: 1, auditKind: 1, createdDate: 1, _id: 1 },
    { name: 'payment_revenue_period_scan' }
  );

  portalDb.revenueReportOutbox.createIndex(
    { deploymentId: 1, period: 1, revision: 1 },
    { name: 'revenue_outbox_deployment_period_revision', unique: true }
  );
  portalDb.revenueReportOutbox.createIndex(
    {
      deploymentId: 1,
      status: 1,
      nextRetryAt: 1,
      period: 1,
      revision: 1
    },
    { name: 'revenue_outbox_delivery' }
  );
  portalDb.revenueReportOutbox.createIndex(
    { idempotencyKey: 1 },
    { name: 'revenue_outbox_idempotency', unique: true }
  );

  portalDb.qualifiedMauReportOutbox.createIndex(
    { deploymentId: 1, period: 1, revision: 1 },
    { name: 'qmau_outbox_deployment_period_revision', unique: true }
  );
  portalDb.qualifiedMauReportOutbox.createIndex(
    {
      deploymentId: 1,
      status: 1,
      nextRetryAt: 1,
      period: 1,
      revision: 1
    },
    { name: 'qmau_outbox_delivery' }
  );
  portalDb.qualifiedMauReportOutbox.createIndex(
    { idempotencyKey: 1 },
    { name: 'qmau_outbox_idempotency', unique: true }
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
    { name: 'activity_resource_active_owner_subevent_asset_owner', unique: true, partialFilterExpression: { status: 'A' } }
  );
  portalDb.activityResources.createIndex(
    { assetOwnerUserId: 1, ownerId: 1 },
    { name: 'activity_resource_owner_key' }
  );

  portalDb.accessPolicyDefinitions.createIndex(
    { syncKey: 1 },
    { name: 'access_policy_definition_sync_key', unique: true, sparse: true }
  );
  portalDb.accessPolicyDefinitions.createIndex(
    { policyKey: 1 },
    { name: 'access_policy_definition_key', unique: true }
  );

  portalDb.accessGrants.createIndex(
    { syncKey: 1 },
    { name: 'access_grant_sync_key', unique: true, sparse: true }
  );
  portalDb.accessGrants.createIndex(
    { subjectUserId: 1, permission: 1, resourceType: 1, resourceId: 1 },
    { name: 'access_grant_subject_permission_resource' }
  );
  portalDb.accessGrants.createIndex(
    { resourceType: 1, resourceId: 1, permission: 1 },
    { name: 'access_grant_resource_permission' }
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
    { creatorUserId: 1, startAtIso: 1 },
    { name: 'event_creator_start' }
  );
  portalDb.events.createIndex(
    { admins: 1, startAtIso: 1 },
    { name: 'event_admins_lookup' }
  );
  portalDb.events.createIndex(
    { admins: 1, sourceId: 1 },
    { name: 'event_admins_source' }
  );
  portalDb.events.createIndex(
    { acceptedMemberUserIds: 1, status: 1, startAtIso: 1, sourceId: 1 },
    { name: 'event_accepted_member_start' }
  );
  portalDb.events.createIndex(
    { invitedMemberUserIds: 1, status: 1, startAtIso: 1, sourceId: 1 },
    { name: 'event_invited_member_start' }
  );
  portalDb.events.createIndex(
    { pendingRequestMemberUserIds: 1, status: 1, startAtIso: 1, sourceId: 1 },
    { name: 'event_pending_request_member_start' }
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
    { expired: 1, endAtIso: 1, sourceId: 1 },
    { name: 'event_expired_end' }
  );
  portalDb.events.createIndex(
    { expired: 1, startAtIso: 1, sourceId: 1 },
    { name: 'event_expired_start' }
  );
  portalDb.events.createIndex(
    { locationGeo: '2dsphere' },
    { name: 'event_location_geo' }
  );
  portalDb.events.createIndex(
    { status: 1, generated: 1, createdDate: 1, creatorUserId: 1 },
    { name: 'event_qmau_host_window' }
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
  portalDb.chatMessages.createIndex(
    { sentAtIso: 1, 'senderAvatar.id': 1, deletedAtIso: 1 },
    { name: 'chat_message_qmau_window' }
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
  portalDb.eventFeedbackStates.createIndex(
    { removed: 1, submittedAtIso: 1, viewerUserId: 1, eventId: 1 },
    { name: 'event_feedback_state_qmau_window' }
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
    { viewerUserId: 1, eventId: 1, submittedAtIso: -1 },
    { name: 'event_feedback_answer_user_event_submitted' }
  );
  portalDb.eventFeedbackAnswers.createIndex(
    { eventId: 1, submittedAtIso: -1 },
    { name: 'event_feedback_answer_event_submitted' }
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
    { lang: 1, published: 1, submittedAtIso: -1, _id: -1 },
    { name: 'idea_post_public_page' }
  );
  portalDb.ideaPosts.createIndex(
    { lang: 1, published: 1, featured: 1, submittedAtIso: -1, _id: -1 },
    { name: 'idea_post_public_featured_preview' }
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
  portalDb.navigatorContacts.createIndex(
    { userId: 1 },
    { name: 'navigator_contacts_user_id', unique: true }
  );

  portalDb.operatorRegistryEndpoints.createIndex(
    { enabled: 1, sortOrder: 1, label: 1, _id: 1 },
    { name: 'operator_registry_endpoint_enabled_sort' }
  );
  portalDb.operatorRegistryEndpoints.createIndex(
    { baseUrl: 1, registryScope: 1 },
    { name: 'operator_registry_endpoint_base_scope', unique: true }
  );
  portalDb.paymentProviders.createIndex(
    { enabled: 1, sortOrder: 1, label: 1, _id: 1 },
    { name: 'payment_provider_enabled_sort' }
  );
  portalDb.savedPaymentMethods.createIndex(
    { userId: 1, status: 1, createdAtIso: -1 },
    { name: 'saved_payment_method_user_status_created' }
  );
  portalDb.savedPaymentMethods.createIndex(
    { status: 1, expiryKey: 1, expiredNotifiedAtIso: 1 },
    { name: 'saved_payment_method_expiry_scan' }
  );
  portalDb.savedPaymentMethods.createIndex(
    { userId: 1, artworkKey: 1, status: 1 },
    { name: 'saved_payment_method_user_art_status' }
  );
  portalDb.savedPaymentMethods.createIndex(
    { registrationId: 1 },
    { name: 'saved_payment_method_registration', unique: true, sparse: true }
  );

  portalDb.communityProviders.createIndex(
    { enabled: 1, sortOrder: 1, name: 1, _id: 1 },
    { name: 'community_provider_enabled_sort' }
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
