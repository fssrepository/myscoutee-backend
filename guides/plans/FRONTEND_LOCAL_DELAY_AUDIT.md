# MSC-120 — frontend-local response-delay audit

Source review: 2026-10-09. This is an audit, not a claim that every listed flow has been changed or browser-tested.

## Required behavior

The local service starts hydration, IndexedDB access and response projection immediately. The existing 1,500 ms emulation runs concurrently for that service call. Independent service calls each retain their own delay. When one user operation needs several projections, keep those necessary operations inside one aggregate service call and apply the delay once at that boundary. A direct repository operation stays within its owning service request. Successful publication waits for both: `max(actual work, 1,500 ms)`, not their sum. The existing 3,000 ms indicator window and CSS animation remain unchanged. Slow real work must still finish; neither timeout values nor an animation may fabricate success. HTTP adapters keep their actual request timing. CSS animation does not imply that all SVG properties run independently on another thread; measure rendering separately from service sequencing.

## Open user-reported follow-up — 2026-10-11

1. **CM-LOCAL-001 — Content moderation settings popup and SmartList loading feedback.**
   Status: **OPEN; reported, not yet reproduced on the current revision**. The
   user observed frontend-local content moderation opening the gear/settings
   popup late, as if it awaited a request before showing the surface. The
   SmartList loading indicator was also not visible. The observed build may
   predate the current fixes; establish its version and reproduce with the
   current local adapter before changing code. Determine whether the wait is
   native local route emulation, IndexedDB/projection work, an unintended HTTP
   request or rendering time rather than inferring HTTP from the delay alone.

   Required behavior: show the settings popup immediately; if data must load,
   show the existing route-delay loading ring in its body until that request
   finishes. Show the existing SmartList loading/progress indicator during
   list loading. Preserve the established 1,500 ms local request emulation,
   3,000 ms indicator configuration and concurrent-work rules above; reuse
   the existing loading components without adding another delay or duplicate
   data request. Verify empty, loading, success and error transitions, and
   record response-time/main-thread CPU evidence with the tested revision.

   Scope: the original MyScoutee **content moderation** screen, distinct from
   the template's chat-report **Reports** popup. Do not copy this product
   moderation screen into the template. If the cause is in shared components
   or another retained owner, record and test the corresponding template impact.
   Queued during MSC-122 at the user's request; not a completed QA result.

## Confirmed findings

1. **Fixed: avatar/profile.** `LocalUsersService.loadProfileExtById` previously waited for readiness, then 1,500 ms, then workspace/profile processing and persistence. That entire read now runs concurrently with the existing delay. Session/workspace ownership and the existing inner-page avatar ring remain intact.
2. **Fixed: game cards.** `LocalGameService.queryUserGameCardsByFilter` previously started filtering/ranking only after the delay. It now runs repository readiness and the existing computation concurrently. The base service no longer waits for local readiness before declaring the request loading; hydration belongs to the adapter request.
3. **Already overlapping:** landing content, public guide/help, admin monitoring/stats/workspace, admin parameter/notification read helpers and affinity graph reads. Landing aggregates call undelayed child projections, so they do not add another 1,500 ms per child. Some admin help projection still follows the joined readiness/delay.
4. **Completed follow-up — overlapping reads:** feed pages, event/explore/checkout/feedback reads, chat pages, resources, invite candidates, assets/availability, tickets, contacts, rates, experiences, idea pages, branding, notification pages/sync, payment artwork/history and operator reads. The original source placed work after an awaited artificial delay. The follow-up applies the established `Promise.all` request boundary to 63 reads plus the operator storage reads, keeping projection and hydration inside the same request. This is verified service sequencing; it is not a browser latency measurement for every screen.
5. **Fixed aggregate reads:** moderation now owns one delay for the complete request, including group authorization and asset/event/group detail. The existing owners expose the same undelayed projections used by their normal public delayed calls. External invitation group checks, case-chat result reads and Mingle feedback validation reuse these projections instead of calling another delayed service entry point. No permission, projection or persistence work is omitted.
6. **Completed shared preparation helpers:** campaigns, community cases/announcements, service offerings/feedback and appointments now place the existing delay at each complete outer request. Their actor/context helper retains hydration and authorization without another artificial wait. All 26 affected outer operations retain their original projection/command bodies.
7. **Mutation caution:** several saves persist then wait, while others wait then mutate. An audit of their cancellation/session/atomicity boundaries is needed before changing their ordering. A mechanical replacement of every `await waitForRouteDelay` would change when writes become visible.
8. **Not route emulation:** realtime long-poll progression, notification scheduling, expiry timers, payment registration/status polls and operator update progress pacing. Their clocks are not interchangeable with a request minimum duration.
9. **Outside local adapters:** cached event-member presentation has an intentional initial members delay; the base community-member route also owns a delay. The HTTP currency selector calls the common helper, which resolves to zero for an HTTP-configured route. No HTTP, polling, indicator, SmartList or global timing configuration was changed.

## First-request CPU finding

CDP CPU sampling of a fresh local DEMO selection found approximately 2 seconds of synchronous work in the social-card cache. Distance calculation alone accounted for 1,174 ms in the sample. The cache eagerly built and sorted all users’ three social modes on the first request. It now reuses the same graph/cache and builds only the requested account, retaining graph-revision invalidation and detached result cards. Tests preserve all three modes and invalidation. No animation, timeout, ranking formula or visibility rule was changed.

Completed nested mutation review: asset/resource membership commands reuse the resource owner write; event synchronization reuses the authorized campaign read; cancellation reuses the complete leave operation; external invitations reuse member writes, workspace joins and the existing `skipLocalRouteDelay` event option. Public commands retain their delay. The aggregate-only paths retain required permissions, counters, notifications and persistence. Admin notification run helpers already pass their existing `skipDemoDelay: true` option to internal calls. The static call graph alone is not grounds to remove required operations or cancellation boundaries.

## Verification

- 111 focused tests pass: entry selection, base users/game, local profile/game/group/event/integration/moderation services and social-card repository.
- Regression checks hold the emulation unresolved and prove repository processing/persistence has already completed; conversely, slow hydration prevents premature publication.
- Production image `3bbd030035dd` browser retest passes. First DEMO navigation: 780 ms; avatar indicator lifecycle: about 1,600 ms; card loading: 1,573 ms. Configured display window remains 3,000 ms. Cold-selection CPU sampling reduced `distanceMeters` self time from 1,174 ms to 12.8 ms; the previous approximately 2-second synchronous block no longer appears. Remaining short render/IndexedDB serialization tasks peak at 123 ms in this sample. These are sample timings, not an exact frame deadline.
- The prior selection-only browser fix navigated in 515 ms; that result predates the timing correction and is not evidence for its ring duration.

## Source inventory

Whole `src/app` scan includes direct delay calls and wrappers. Methods may be readers, writers, wrappers or special-purpose clocks; a row is an inspection location, not an assertion that it needs the same edit. Additional `setTimeout`, `timer` and `delay` searches covered scheduling and UI animation call sites.

| File | Methods containing a delay or wrapper reference |
| --- | --- |
| [activity/components/event-members-popup/event-members-popup.component.ts](../../frontend/src/app/activity/components/event-members-popup/event-members-popup.component.ts) | `loadMembersPage` |
| [shared/core/base/services/activity-members.service.ts](../../frontend/src/app/shared/core/base/services/events/activity-members.service.ts) | `waitForMembersRouteDelay`, `queryMembersByOwner` |
| [shared/core/base/services/activity-resources.service.ts](../../frontend/src/app/shared/core/base/services/events/activity-resources.service.ts) | `waitForResourceRouteDelay` |
| [shared/core/base/services/admin-affinity-graph.service.ts](../../frontend/src/app/shared/core/base/services/affinity/admin-affinity-graph.service.ts) | `demoSnapshot`, `readLocalGraphSnapshot` |
| [shared/core/base/services/events.service.ts](../../frontend/src/app/shared/core/base/services/events/events.service.ts) | `waitForEventMutationDelay` |
| [shared/core/base/services/route-delay.service.ts](../../frontend/src/app/shared/core/base/services/platform/route-delay.service.ts) | `waitForRouteDelay` |
| [shared/core/http/services/payment-methods.service.ts](../../frontend/src/app/shared/core/http/services/payments/payment-methods.service.ts) | `selectSummaryCurrency` |
| [shared/core/local/source/services/activity-invite-candidates.service.ts](../../frontend/src/app/shared/core/local/source/services/events/activity-invite-candidates.service.ts) | `queryCandidates` |
| [shared/core/local/source/services/activity-members.service.ts](../../frontend/src/app/shared/core/local/source/services/events/activity-members.service.ts) | `queryMembersByOwner`, `syncMembersByOwner`, `querySummariesByOwners`, `replaceMembersByOwner`, `applyMemberActionEntries` |
| [shared/core/local/source/services/activity-resources.service.ts](../../frontend/src/app/shared/core/local/source/services/events/activity-resources.service.ts) | `querySubEventResourceState`, `querySubEventResourceScope`, `markResourceTypeRead`, `querySupplyContributionPage`, `replaceSubEventResourceState` |
| [shared/core/local/source/services/admin-affinity-graph.service.ts](../../frontend/src/app/shared/core/local/source/services/affinity/admin-affinity-graph.service.ts) | `readGraphSnapshot` |
| [shared/core/local/source/services/admin-moderation.service.ts](../../frontend/src/app/shared/core/local/source/services/content/admin-moderation.service.ts) | `warnUser`, `blockUser`, `unblockUser` |
| [shared/core/local/source/services/admin-monitoring.service.ts](../../frontend/src/app/shared/core/local/source/services/administration/admin-monitoring.service.ts) | `loadMonitoringState` |
| [shared/core/local/source/services/admin-notifications.service.ts](../../frontend/src/app/shared/core/local/source/services/administration/admin-notifications.service.ts) | `saveNotificationCenter`, `runNotificationRule`, `withAdminNotificationDelay`, `waitForAdminNotificationDelay` |
| [shared/core/local/source/services/admin-params.service.ts](../../frontend/src/app/shared/core/local/source/services/affinity/admin-params.service.ts) | `withAdminParamsDelay` |
| [shared/core/local/source/services/admin-stats.service.ts](../../frontend/src/app/shared/core/local/source/services/administration/admin-stats.service.ts) | `loadStatsDashboard` |
| [shared/core/local/source/services/admin-workspace.service.ts](../../frontend/src/app/shared/core/local/source/services/administration/admin-workspace.service.ts) | `setReportResolved`, `setFeedbackResolved`, `loadDashboardSlice` |
| [shared/core/local/source/services/asset-tickets.service.ts](../../frontend/src/app/shared/core/local/source/services/assets/asset-tickets.service.ts) | `queryTicketPage`, `syncTickets`, `validateTicket` |
| [shared/core/local/source/services/assets.service.ts](../../frontend/src/app/shared/core/local/source/services/assets/assets.service.ts) | `queryOwnedAssetsByUser`, `loadOwnedAssetDetailById`, `queryVisibleAssets`, `queryVisibleAssetsPage`, `loadOccupancyByAssetId`, `loadStatByAssetId`, `saveOwnedAsset`, `saveOwnedAssetRequests`, `applyMemberStatusChange`, `replaceOwnedAssets`, `deleteOwnedAsset`, `leaveOwnedAsset`, `takeOverOwnedAsset`, `makeAssetManager`, `revokeAssetManager` |
| [shared/core/local/source/services/campaigns.service.ts](../../frontend/src/app/shared/core/local/source/services/campaigns/campaigns.service.ts) | `actor` |
| [shared/core/local/source/services/case-appointments.service.ts](../../frontend/src/app/shared/core/local/source/services/community/case-appointments.service.ts) | `context` |
| [shared/core/local/source/services/chats.service.ts](../../frontend/src/app/shared/core/local/source/services/chat/chats.service.ts) | `ensureContactChat`, `addContactChatMembers`, `queryChatById`, `queryActivitiesChatPage`, `queryChatSharedMessages`, `queryChatMessagesPage`, `syncChatHeader`, `ensureServiceChat`, `queryChatMembers`, `queryChatMembersPage`, `sendChatMessageWithAttachments`, `updateChatMessage`, `markChatRead`, `updateSupportCase` |
| [shared/core/local/source/services/community-announcements.service.ts](../../frontend/src/app/shared/core/local/source/services/community/community-announcements.service.ts) | `actor` |
| [shared/core/local/source/services/community-cases.service.ts](../../frontend/src/app/shared/core/local/source/services/community/community-cases.service.ts) | `actor` |
| [shared/core/local/source/services/community-groups.service.ts](../../frontend/src/app/shared/core/local/source/services/groups/community-groups.service.ts) | `page`, `detail`, `save`, `join` |
| [shared/core/local/source/services/contacts.service.ts](../../frontend/src/app/shared/core/local/source/services/accounts/contacts.service.ts) | `loadChatAccess`, `changeChatAccess`, `loadContacts`, `loadContactProfile`, `saveContacts`, `deleteContact` |
| [shared/core/local/source/services/content-moderation.service.ts](../../frontend/src/app/shared/core/local/source/services/content/content-moderation.service.ts) | `snapshot`, `page`, `settings`, `decide`, `detail` |
| [shared/core/local/source/services/deployment-configuration.service.ts](../../frontend/src/app/shared/core/local/source/services/platform/deployment-configuration.service.ts) | `loadBranding` |
| [shared/core/local/source/services/device-registrations.service.ts](../../frontend/src/app/shared/core/local/source/services/accounts/device-registrations.service.ts) | `upsert`, `remove` |
| [shared/core/local/source/services/events.service.ts](../../frontend/src/app/shared/core/local/source/services/events/events.service.ts) | `queryItemsByUser`, `exportCalendar`, `queryInvitationItemsByUser`, `queryEventItemsByUser`, `queryHostingItemsByUser`, `queryTrashedItemsByUser`, `queryActivitiesEventDTOPage`, `loadEventDetailById`, `loadInvitationContext`, `loadSubEventsById`, `loadCheckoutSlots`, `loadCheckoutBasketByEvent`, `validateCheckoutPromoCode`, `saveCheckoutBasket`, `updateCheckoutBasketState`, `payEventCheckout`, `queryExploreItems`, `queryEventExplorePage`, `queryEventFeedbackStates`, `queryReceivedEventFeedback`, `loadEventFeedbackPage`, `loadEventFeedbackStatById`, `loadEventFeedback`, `submitEventFeedback`, `saveEventFeedbackNote`, `removeEventFeedbackEvent`, `restoreEventFeedbackEvent`, `syncEventSnapshot`, `saveActivityEvent`, `cancelItem`, `trashItem`, `publishItem`, `unpublishItem`, `restoreItem`, `setLocalEventWatchState`, `takeOverItem`, `waitForEventMutationDelay`, `applyStageAction`, `querySubEventLeaderboard`, `queryTournamentGroups`, `queryTournamentStageGroups`, `queryTournamentStageSnapshot`, `queryMingleState`, `applyMingleAction`, `saveTournamentGroup`, `deleteTournamentGroup`, `upsertSubEventLeaderboardEntry`, `requestJoin`, `leaveEvent`, `createCheckoutSession`, `authorizeCheckout`, `payCheckoutSession` |
| [shared/core/local/source/services/following.service.ts](../../frontend/src/app/shared/core/local/source/services/accounts/following.service.ts) | `change`, `members` |
| [shared/core/local/source/services/game.service.ts](../../frontend/src/app/shared/core/local/source/services/accounts/game.service.ts) | `queryUserGameCardsByFilter` |
| [shared/core/local/source/services/help-center.service.ts](../../frontend/src/app/shared/core/local/source/services/help/help-center.service.ts) | `loadState`, `loadAdminState`, `savePrivacyConsent`, `saveRevision`, `activateRevision`, `deleteRevision` |
| [shared/core/local/source/services/idea-posts.service.ts](../../frontend/src/app/shared/core/local/source/services/content/idea-posts.service.ts) | `loadPublishedPostsPage`, `loadAdminPosts`, `loadAdminPostsPage`, `savePost`, `deletePost`, `restorePost` |
| [shared/core/local/source/services/integration.service.ts](../../frontend/src/app/shared/core/local/source/services/integrations/integration.service.ts) | `externalInviteLink`, `claimExternalInvite`, `loadSettings`, `saveSettings`, `createToken`, `revokeToken` |
| [shared/core/local/source/services/landing-content.service.ts](../../frontend/src/app/shared/core/local/source/services/content/landing-content.service.ts) | `loadContent` |
| [shared/core/local/source/services/media.service.ts](../../frontend/src/app/shared/core/local/source/services/media/media.service.ts) | `uploadDocument`, `uploadImage`, `importImage`, `uploadAudio` |
| [shared/core/local/source/services/notifications.service.ts](../../frontend/src/app/shared/core/local/source/services/notifications/notifications.service.ts) | `queryPage`, `markRead`, `sync`, `updatePreferences` |
| [shared/core/local/source/services/operator-registry.service.ts](../../frontend/src/app/shared/core/local/source/services/operator/operator-registry.service.ts) | `loadStatus`, `inspect`, `confirm`, `register`, `retry`, `disconnect`, `synchronizeMeasurements`, `measurementReportPage`, `requeueMeasurementReport`, `leaderboardPage`, `leaderboardDeploymentPage`, `loadClaimStatus`, `claimShare`, `issueGroupingToken`, `linkOperatorGroup`, `loadDeploymentUpdate`, `applyDeploymentUpdate`, `loadConfiguration`, `loadTlsConfiguration`, `saveTlsConfiguration`, `testTlsConfiguration`, `saveConfiguration`, `testConfiguration`, `activateFirebase`, `loadRevenue`, `synchronizeRevenue`, `revenueReportPage`, `requeueRevenueReport`, `settlementPage`, `loadCommunityStatus`, `setCommunityAvailability`, `waitForOperatorRouteDelay` |
| [shared/core/local/source/services/payment-methods.service.ts](../../frontend/src/app/shared/core/local/source/services/payments/payment-methods.service.ts) | `selectSummaryCurrency`, `deleteCashReceipt`, `recordCashReceipt`, `queryPage`, `beginRegistration`, `refreshRegistration`, `deletePaymentMethod`, `queryHistory`, `queryAllHistory`, `requestRefund`, `approveRefund` |
| [shared/core/local/source/services/photo-feed.service.ts](../../frontend/src/app/shared/core/local/source/services/content/photo-feed.service.ts) | `page`, `create`, `remove`, `seen`, `events` |
| [shared/core/local/source/services/rates.service.ts](../../frontend/src/app/shared/core/local/source/services/affinity/rates.service.ts) | `queryRateItemsByUser`, `queryActivitiesRatePage` |
| [shared/core/local/source/services/route-delay.service.ts](../../frontend/src/app/shared/core/local/source/services/platform/route-delay.service.ts) | `waitForRouteDelay`, `waitForDelay` |
| [shared/core/local/source/services/service-feedback.service.ts](../../frontend/src/app/shared/core/local/source/services/community/service-feedback.service.ts) | `actor` |
| [shared/core/local/source/services/service-offerings.service.ts](../../frontend/src/app/shared/core/local/source/services/community/service-offerings.service.ts) | `actor` |
| [shared/core/local/source/services/user-experiences.service.ts](../../frontend/src/app/shared/core/local/source/services/accounts/user-experiences.service.ts) | `queryUserExperiences`, `saveUserExperiences` |
| [shared/core/local/source/services/users.service.ts](../../frontend/src/app/shared/core/local/source/services/accounts/users.service.ts) | `queryAvailableDemoUsers`, `queryUserById`, `loadProfileExtById`, `queryUserRealtimeLongPoll`, `saveUserFilterPreferences`, `saveUserProfile`, `saveUserProfileExt`, `submitUserFeedback`, `submitReportUser`, `logoutUser`, `deleteUser` |

Inventory: 237 method locations across 47 files. Static source review only; no claim of full UI coverage.

## Follow-up verification and stability repairs

- Application TypeScript compilation passes after the owner-boundary edits.
- Ten new timing/cancellation checks pass, plus both external-invitation tests.
  The tests hold emulation or real work unresolved to prove that publication
  waits for both, feed acknowledgement/projection occurs during emulation,
  pre-aborted commands do not write, and aggregate owner reads do not add delays.
- Initial plain Vitest local-service run: 114 passed, 10 failed. Repeating the
  five affected suites with the pre-edit source reproduced all ten failures.
- Stability follow-up repairs stale test fixtures rather than weakening product
  rules: explicit invited provider and enabled booking slots; actual case owner;
  required schedule start; both seeded expiring votes; explicit checkout actor
  workspace. Case chat coverage now asserts rejection before acceptance and
  an explicit chat invitation, then revocation on leaving, matching the current
  canonical membership/chat policy.
- Run through the repository's Angular test builder for constructor injection
  metadata. The raw focused Vite setup lacks that metadata for `ActivityStore`;
  product dependency injection was not changed to accommodate that harness.
- Specialized realtime/worker/payment polling timers and mutation session gates
  were reviewed separately and retain their established timing/authorization.
  A source inventory entry is not itself a request to reorder a write gate.

Final Angular suite: **21 files, 134 tests passed, zero failures** using
`npx ng test --watch=false --include='src/app/shared/core/local/source/services/**/*.spec.ts'`. Browser
coverage remains the explicitly listed flows; this audit does not claim every
feature was manually exercised.

Latest production-image CDP retest: `d878ec931c44`, backend replicas zero,
anonymous managed local-selection checkpoint. DEMO selection → `/game`:
756.6 ms. Avatar ring: 1,594.9 ms, configured animation duration `3000ms`.
Report: `microservices/build/reports/browser/demo-selection-verified.json`.
The managed test browser was closed before restoring all six HTTP services.
