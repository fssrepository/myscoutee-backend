# Mongo Hard-Code Audit

This report lists Java code that names Mongo databases/collections directly or uses low-level Mongo APIs.
It is meant to protect e2e/stress mode from accidentally bypassing routed repositories.

Generated candidates: 87

## explicit database name

- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/mongo/ScheduledMongoSessionRunner.java:17` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/mongo/ScheduledMongoSessionRunner.java:18` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/mongo/ScheduledMongoSessionRunner.java:56` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:29` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:44` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:55` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:62` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:83` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/properties/RegistryDemoProperties.java:10` - `demo_db`

## @Document collection mapping

- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AccessGrant.java:9` - `accessGrants`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AccessPolicyDefinition.java:9` - `accessPolicyDefinitions`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AccountPurgeJob.java:12` - `accountPurgeJobs`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivityEvent.java:25` - `events`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivityMainEventRuntime.java:9` - `activityEventRuntimeItems`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivityMember.java:9` - `activityMembers`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivitySubEventGroup.java:9` - `activitySubEventGroups`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivitySubEventResource.java:13` - `activityResources`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivitySubEventStageRuntime.java:12` - `activitySubEventStageRuntime`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminAffinityGraphEdge.java:9` - `adminAffinityGraphEdges`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminAffinityGraphForest.java:9` - `adminAffinityGraphForests`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminAffinityGraphLayout.java:7` - `adminAffinityGraphLayouts`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminAffinityGraphNode.java:12` - `adminAffinityGraphNodes`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminMonitoringSnapshot.java:12` - `adminMonitoring`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminStatsSnapshot.java:12` - `adminStats`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AffinityConfig.java:11` - `affinityConfigs`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AffinityRecomputeTask.java:13` - `affinityRecomputeTasks`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AppSettings.java:10` - `appSettings`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/Asset.java:14` - `assets`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AssetRequest.java:12` - `assetRequests`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/Chat.java:15` - `chats`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/CommunityProvider.java:8` - `communityProviders`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/CountryPartition.java:10` - `countryPartitions`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/DeploymentConfiguration.java:9` - `deploymentConfigurations`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EmailCampaignRule.java:12` - `emailCampaignRules`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EmailOutboxItem.java:12` - `emailOutbox`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EmailTemplate.java:7` - `emailTemplates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventCheckoutBasketItem.java:14` - `eventCheckoutBasketItems`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventFeedbackAnswer.java:12` - `eventFeedbackAnswers`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventFeedbackState.java:9` - `eventFeedbackStates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventLeaderboardEntry.java:9` - `eventLeaderboardEntries`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventTicket.java:9` - `eventTickets`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventTicketAudit.java:8` - `eventTicketAudit`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventWatchSubscription.java:9` - `eventWatchSubscriptions`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/GlobalIdentityLinkState.java:19` - `globalIdentityLinkStates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/GlobalIdentityPresenceOutboxItem.java:20` - `globalIdentityPresenceChunkOutbox`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/HelpCenterAuditEntry.java:8` - `helpCenterAudit`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/HelpCenterRevision.java:13` - `helpCenterRevisions`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/I18nBundle.java:7` - `i18n_bundles`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/I18nMessage.java:7` - `i18n_messages`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/IdeaPost.java:12` - `ideaPosts`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/NavigatorContactsProfile.java:11` - `navigatorContacts`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/NotificationOutboxItem.java:14` - `notificationOutbox`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/NotificationRuleConfig.java:10` - `notificationRuleConfigs`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/NotificationTemplate.java:7` - `notificationTemplates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/OperatorClaimSubmissionSnapshot.java:7` - `operatorClaimSubmissionSnapshots`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/OperatorRegistryEndpoint.java:8` - `operatorRegistryEndpoints`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/OperatorRegistrySettings.java:7` - `operatorRegistrySettings`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/Payment.java:18` - `payments`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/PaymentGatewayOperation.java:8` - `payment_gateway_operations`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/PaymentMethodRegistration.java:8` - `paymentMethodRegistrations`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/PaymentProvider.java:8` - `paymentProviders`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/PrivacyConsent.java:12` - `privacyConsents`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/QualifiedMauReportOutboxItem.java:22` - `qualifiedMauReportOutbox`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/RevenueReportOutboxItem.java:22` - `revenueReportOutbox`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/SavedPaymentMethod.java:10` - `savedPaymentMethods`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ScheduledMessageDelivery.java:8` - `scheduledMessageDeliveries`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ScheduledMessageRun.java:9` - `scheduledMessageRuns`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ScheduledMessageTask.java:12` - `scheduledMessageTasks`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/SchedulerPlanMarker.java:11` - `schedulerPlanMarkers`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ShareToken.java:7` - `shareTokens`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserAffinityEdge.java:9` - `userAffinityEdges`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserExperienceProfile.java:11` - `userExperienceProfiles`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserFeedbackSubmission.java:9` - `userFeedback`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserFilterPreferences.java:12` - `userFilterPreferences`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserLoginAudit.java:9` - `userLoginAudits`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserNotification.java:12` - `userNotifications`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserRate.java:9` - `userRates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserReportSubmission.java:9` - `userReports`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/Users.java:14` - `users`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserSessionAction.java:9` - `userSessionActions`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserSessionState.java:10` - `userSessionStates`

## getCollection literal

- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/repository/MongoQualifiedMauEvidenceRepository.java:235` - `userRates`

## MongoTemplate literal collection

- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AssetsService.java:1516` - `assets`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AssetsService.java:2616` - `assets`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/ChatService.java:696` - `chats`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/DeletedAccountPurgeService.java:587` - `activityResources`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/DeletedAccountPurgeService.java:758` - `userNotifications`

## Notes

- `@Document(collection = "...")` is expected for entity mapping; it is listed so seed/reset coverage can be checked.
- `MongoTemplate` calls using entity classes usually still route through the active database factory.
- Literal collection-string calls are the ones to review most carefully before trusting e2e isolation.

