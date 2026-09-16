# Production / E2E seed audit — 2026-09-16

All 40 dev collection baselines were compared, including document identities, nested configuration fields and the production allow-list. Runtime scenario datasets are not required to have equal counts.

## Repairs

- Added communityProviders to production/E2E and the packaged production allow-list.
- Added the missing affinityConfigs.jobs debounce defaults to production/E2E.
- Added the three simulator saved-payment-method fixtures required by the E2E fixture loader; their owners exist in E2E users.
- Added explicit empty JSON baselines for omitted production runtime collections and E2E payments/userNotifications. Demo payment/notification history is not transplanted: it includes scenario-specific references and booking state absent from E2E.
- Kept E2E counter-expiry at its intentional 5-second interval, production admin/contact/social settings empty, and production runtime counters/data empty.
- Updated bootstrap/import indexes to the application’s active-only unique activityResources index; added the four SavedPaymentMethod indexes. No target-database switch or new migration was added.

## Reviewed fixture differences

E2E has a separately scaled activity dataset. Event policies, nested slot pricing, service notification chats, historical booking/payment fields, notification preferences and activity counters are optional scenario data. They are not missing system definitions; copying them individually would create inconsistent activity/payment/chat state. The dedicated fixture scenarios establish these states when exercised. E2E filter preferences and notifications start empty. Production excludes all synthetic activity.

## Inventory

| Collection | Dev | Production | E2E |
| --- | ---: | ---: | ---: |
| accessPolicyDefinitions | 50 | 50 | 50 |
| activityMembers | 1655 | 0 | 4663 |
| activityResources | 7181 | 0 | 19813 |
| activitySubEventStageRuntime | 5 | 0 | 5 |
| adminMonitoring | 1 | 1 | 1 |
| adminStats | 1 | 1 | 1 |
| adminUsers | — | 0 | — |
| affinityConfigs | 1 | 1 | 1 |
| appSettings | 1 | 1 | 1 |
| assetRequests | 117 | 0 | 698 |
| assets | 50 | 0 | 300 |
| chatMessages | 10171 | 0 | 26732 |
| chats | 1231 | 0 | 3267 |
| communityProviders | 2 | 2 | 2 |
| countryPartitions | 2 | 2 | 2 |
| deploymentConfigurations | 1 | 1 | 1 |
| emailCampaignRules | 3 | 3 | 3 |
| emailTemplates | 5 | 5 | 5 |
| eventFeedbackAnswers | 25 | 0 | 22 |
| eventFeedbackStates | 12 | 0 | 9 |
| events | 100 | 0 | 285 |
| helpCenterRevisions | 34 | 34 | 34 |
| i18n_bundles | 2 | 2 | 2 |
| i18n_messages | 6874 | 6874 | 6874 |
| ideaPosts | 10 | 10 | 10 |
| navigatorContacts | 1 | 0 | 1 |
| notificationRuleConfigs | 11 | 11 | 11 |
| notificationTemplates | 5 | 5 | 5 |
| operatorRegistryEndpoints | 1 | 0 | 1 |
| paymentProviders | 2 | 2 | 2 |
| payments | 4 | 0 | 0 |
| savedPaymentMethods | 3 | 0 | 3 |
| scheduledMessageTasks | 1 | 1 | 1 |
| userAffinityEdges | 1129 | 0 | 1129 |
| userExperienceProfiles | 1 | 0 | 1 |
| userFeedback | 2 | 0 | 2 |
| userFilterPreferences | 9 | 0 | 0 |
| userNotifications | 65 | 0 | 0 |
| userRates | 2761 | 0 | 2761 |
| userReports | 2 | 0 | 3 |
| users | 56 | 0 | 56 |

## VMware reload

The explicitly authorized production test documents were cleared and the 19 allow-listed production JSON files imported through mongo_import.sh. Existing Mongo authentication and indexes were retained; demo/Registry databases and object storage were not reset. All 150 db_init.js index definitions were found after import, including the four saved-payment-method indexes. Firebase smoke setup is a separate authenticated runtime configuration, never embedded in seeds.

The earlier image failure was missing media.read in the retained live database; the rule already existed in all three canonical policy JSON files. Its presence in the fresh import is verified; the user owns the browser smoke retest.
