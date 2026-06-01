# Mongo Hard-Code Audit

This report lists Java code that names Mongo databases/collections directly or uses low-level Mongo APIs.
It is meant to protect playground/stress mode from accidentally bypassing routed repositories.

Generated candidates: 49

## explicit database name

- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:29` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:43` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:53` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:60` - `demo_db`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoRoutingConfig.java:80` - `demo_db`

## @Document collection mapping

- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AccountPurgeJob.java:12` - `accountPurgeJobs`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivityChat.java:18` - `chats`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivityEvent.java:20` - `events`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivityMember.java:9` - `activityMembers`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ActivitySubEventResource.java:13` - `activityResources`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminMonitoringSnapshot.java:10` - `adminMonitoring`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AdminStatsSnapshot.java:10` - `adminStats`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AffinityConfig.java:11` - `affinityConfigs`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/AffinityRecomputeTask.java:13` - `affinityRecomputeTasks`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/Asset.java:14` - `assets`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/CountryPartition.java:10` - `countryPartitions`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EmailCampaignRule.java:12` - `emailCampaignRules`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EmailOutboxItem.java:12` - `emailOutbox`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EmailTemplate.java:7` - `emailTemplates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventFeedbackAnswer.java:12` - `eventFeedbackAnswers`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventFeedbackState.java:9` - `eventFeedbackStates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/EventLeaderboardEntry.java:9` - `eventLeaderboardEntries`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/HelpCenterAuditEntry.java:8` - `helpCenterAudit`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/HelpCenterRevision.java:13` - `helpCenterRevisions`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/I18nBundle.java:7` - `i18n_bundles`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/I18nMessage.java:7` - `i18n_messages`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/IdeaPost.java:12` - `ideaPosts`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/NotificationOutboxItem.java:14` - `notificationOutbox`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/NotificationRuleConfig.java:10` - `notificationRuleConfigs`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/NotificationTemplate.java:7` - `notificationTemplates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/Payment.java:15` - `payments`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/PrivacyConsent.java:12` - `privacyConsents`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ScheduledMessageDelivery.java:8` - `scheduledMessageDeliveries`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ScheduledMessageRun.java:9` - `scheduledMessageRuns`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ScheduledMessageTask.java:12` - `scheduledMessageTasks`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/SchedulerPlanMarker.java:11` - `schedulerPlanMarkers`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/ShareToken.java:7` - `shareTokens`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserAffinityEdge.java:9` - `userAffinityEdges`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserExperienceProfile.java:10` - `userExperienceProfiles`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserFeedbackSubmission.java:9` - `userFeedback`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserFilterPreferences.java:12` - `userFilterPreferences`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserRate.java:9` - `userRates`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserReportSubmission.java:9` - `userReports`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/Users.java:12` - `users`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/document/UserSessionAction.java:9` - `userSessionActions`

## MongoTemplate literal collection

- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/ActivitiesResourcesService.java:160` - `activityResources`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AssetsService.java:669` - `assets`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AssetsService.java:684` - `assets`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/DeletedAccountPurgeService.java:483` - `activityResources`

## Notes

- `@Document(collection = "...")` is expected for entity mapping; it is listed so seed/reset coverage can be checked.
- `MongoTemplate` calls using entity classes usually still route through the active database factory.
- Literal collection-string calls are the ones to review most carefully before trusting playground isolation.

