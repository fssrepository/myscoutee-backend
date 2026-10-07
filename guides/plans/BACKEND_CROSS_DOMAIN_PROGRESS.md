# MSC-120: Cross-domain separation progress

Status: in progress, 2026-10-07. This file tracks the cross-domain implementation.
The earlier package reorganization remains documented in the
[domain plan](BACKEND_DOMAIN_SEGREGATION.md).

## Baseline and working rules

- Working branch: `refactor/MSC-120-backend-domain-segregation`.
- Synchronized master baseline: `752ba4d15cb7fdd0ec958c2169e552047a77ea78`.
- Cross-domain changes stay on this branch. Merging into master requires the
  user's subsequent review and decision.
- The scope covers **21 domains**. Inspect foreign persistence access and calls
  coupled to another domain's implementation. Zero repository imports alone do
  not establish a complete boundary.
- **Create a separate `[MSC-120]` commit after each domain is separated and
  verified.** Name the domain in the commit and record its verification and
  commit identifier below. A partial boundary is not a completed domain. Keep
  these domain checkpoint commits separate even though their MSC number matches.
- Keep these domain numbers stable and use them in chat progress reports.
- Repository Markdown and commit messages must be written in English.
- Reuse existing services behind domain interfaces, with domain-owned transfer
  types where needed. Calls remain in-process: no new HTTP hop, database split,
  public endpoint, or external payload change is part of this implementation.
- Run standard and embedded JUnit serially through the existing isolated runner.
  Integration and E2E results are separate evidence. **Stop the dev application
  before starting an E2E application server**; both must not run together.

## Numbered domain inventory

The file/import columns count explicit foreign repository imports at the pinned
baseline, grouped by consuming domain: **77 files, 148 imports, 36 distinct foreign
repositories**. This is a lower bound: fully qualified references, raw Mongo
operations, indexes and concrete service dependencies require additional review.
Numbers are stable identifiers, not a strict dependency order. Related domains
may need changes together.

| # | Domain | Files | Imports | Status | Verification / commit |
| ---: | --- | ---: | ---: | --- | --- |
| 1 | accounts | 4 | 23 | In progress: notification recipient, preference and counter API | First boundary tests passed; remaining account boundaries pending |
| 2 | notifications | 6 | 7 | Complete: incoming/outgoing business-domain contracts and persistence ownership | 1638 local tests passed; final 38 focused tests passed; `96a049287` |
| 3 | groups | 4 | 7 | Pending; group-name API and notification index ownership touched | Whole domain not separated |
| 4 | events | 8 | 14 | Pending; member-attention API and random-assignment summary added | Whole domain not separated |
| 5 | chat | 4 | 8 | Pending; presence interface and shared Redis helper ownership touched | Whole domain not separated |
| 6 | assets | 1 | 2 | Pending | — |
| 7 | affinity | 6 | 11 | Pending | — |
| 8 | community | 6 | 10 | Pending | — |
| 9 | campaigns | 1 | 4 | Pending | — |
| 10 | payments | 8 | 10 | Pending; exchange-rate job interface added | Whole domain not separated |
| 11 | integrations | 11 | 15 | Pending; role-attention interface added | Whole domain not separated |
| 12 | content | 2 | 5 | Pending; existing admin-access methods exposed through interface | Whole domain not separated |
| 13 | email | 2 | 5 | Pending; process catalog and notification template boundary touched | Whole domain not separated |
| 14 | access | 3 | 7 | Pending | — |
| 15 | administration | 4 | 7 | Pending; telemetry interface and notification counters touched | Whole domain not separated |
| 16 | operator | 4 | 7 | Pending; role-notification API call updated | Whole domain not separated |
| 17 | platform | 2 | 5 | Pending; notification policy, audience, settings and branding contracts added | Whole domain not separated |
| 18 | help | 1 | 1 | Pending | — |
| 19 | media | 0 | 0 | Pending: raw Mongo and service-boundary review | — |
| 20 | localization | 0 | 0 | Complete: translation and bundle service contracts | 132 focused tests passed; localization checkpoint commit |
| 21 | registry | 0 | 0 | Pending: full boundary review | — |

**Completed domains: 2/21 — #2 notifications and #20 localization.** A domain is complete when foreign
persistence operations go through the owning domain, remaining dependencies are
explicitly documented, and relevant regression and boundary tests pass. This
is distinct from proving separate-process deployment or E2E performance.

## Changes and risks

### #2 notifications complete; #1 accounts partially prepared

Production paths below are relative to
`server/projects/profile/src/main/java/com/raxim/myscoutee/`.

- `domain/accounts/api/AccountNotifications.java` and
  `domain/accounts/service/AccountNotificationService.java`: account-owned
  recipient/device/sender lookup, mute preference, unread-counter updates and
  invalid-token cleanup. Immutable transfer values cross this interface, not
  repositories or Mongo documents.
- `domain/notifications/service/NotificationOutboxService.java`: recipient and
  device resolution through that API, reusing each invocation's batch results.
- `domain/notifications/service/NotificationOutboxWorkerService.java`: delivery
  and invalid-token cleanup through the account owner.
- `domain/notifications/service/UserNotificationService.java` and
  `domain/notifications/repository/UserNotificationPageRepository.java`: user
  preference/counter writes move to accounts; member-attention counter writes
  move to `domain/events/api/MemberAttention.java` and its owning service.
- `domain/notifications/mapper/UserNotificationMapper.java`: batched sender values.
- `domain/notifications/api/RoleNotifications.java` and its existing service:
  registration, moderation and release producers call an interface. The accounts
  and operator callers use the same implementation and durable outbox.
- `domain/accounts/api/SelectedProfile.java`: the existing authenticated profile
  selection is exposed through an interface; the notification controller's
  endpoint and authorization behavior stay unchanged.
- `domain/groups/api/GroupDirectory.java` and its service: workspace display name
  lookup stays with the group owner, using the same single repository lookup.
- `domain/email/api/EmailProcessCatalog.java` and its service: enabled templates
  and the latest 12 task results are returned as values, preserving group scope
  and query ordering.
- `domain/chat/api/ChatPresence.java`, `domain/content/api/AdministrativeAccess.java`,
  `domain/administration/api/OperationalTelemetry.java`,
  `domain/payments/api/ExchangeRateRefresh.java`: existing implementations expose
  the notification consumer's operations without a parallel implementation.
- `domain/events/api/RandomGroupAssignment.java`: the existing generator returns
  its plan/user counts and progress to notification administration. Algorithm
  objects remain within events. A future remote job adapter still needs a
  transport for progress; no remote execution is claimed here.
- `domain/integrations/api/RoleAttentionEvents.java`: the existing webhook owner
  receives the role event's identifiers and recipients, not an outbox document.
- `domain/platform/api/`: notification policy, administrator settings, job
  audience and deployment branding expose their existing owners. Branding's
  existing value type and fallback behavior now belong to its contract.
- `common/redis/RedisStreamRetentionService.java`: the unchanged generic Redis
  retention implementation moves out of chat; all callers reuse it.
- `domain/notifications/api/NotificationCatalog.java` and its service: unread
  count, job failure count, outbox counts and notification template snapshots
  replace foreign repository access in accounts, administration and email.
- `domain/notifications/api/NotificationPrivacy.java` and its service: existing
  delivery erasure and author anonymization move from the account purge worker
  to the notification owner, preserving operation order and redaction content.
- `domain/notifications/config/NotificationIndexInitializer.java`: existing
  notification index initialization moves from groups. Index names, keys,
  uniqueness and old-index replacement rules are preserved.

| Area | Functional regression risk | Severe slowdown risk | Required verification |
| --- | --- | --- | --- |
| Workspace to account recipient/device resolution | Medium | Low; remains batched | Base/workspace audiences separately and together; saved delivery decisions; payload scope |
| Sender, mute and unread/member-attention counters | Medium | Low; same targeted queries/updates | Missing sender/account, mute, read/delete/retry and counter behavior |
| Invalid push-token cleanup | Medium; the existing read/save concurrency window remains | Low; one extra batch read only after rejected provider tokens | Rotated token, retained devices/profile fields and retry |
| Role notifications and integration forwarding | Medium | Low; recipient batch retained | Operator/admin/member/workspace exclusions, moderation/release event identity |
| Admin job calls, catalog and counts | Medium | Low; original bounded queries and generator reused | Group scope, failure classification, latest task results and progress summary |
| Account purge notification cleanup | High impact if incorrect | Low; same operations and affected collections | Recipient deletion, sender/payload redaction, author anonymization, repeated purge |
| Notification indexes | Medium | Low during normal requests; startup retains existing index work | Same names, compound keys and uniqueness; both configured databases |
| Branding and shared Redis helper | Low | Low; behavior and cache retained | Fallback, saved branding, rendering and Redis retention callers |

Expected query changes (not measured latency): direct-account enqueue uses one
user batch instead of two; workspace-only enqueue needs at most two; mixed
profile/account audiences reuse an already loaded account. Invalid-token cleanup
adds one fresh batch read after the provider responds, only on that error path.

The notification domain still shares runtime infrastructure: `JobGroupContext`,
`ConfigProperties`, the authenticated principal and the Firebase runtime adapter.
These are explicit in-process environment/transport dependencies, not evidence of
independent deployment. Incoming producers, inbox consumers, administration and schedulers now use
`NotificationDelivery`, `NotificationInbox`, `NotificationAdministration` and
`NotificationJobs`. Delivery receipts and job configuration are read-only local
views of owner-managed objects; consumers no longer name persistence classes.
They are not detached snapshots or proof of a remote deployment. The public
HTTP DTOs and stored Mongo type names remain unchanged.

The two-sided compiled-code guard rejects foreign notification implementations,
foreign persistence used by notifications, and notification collection literals
in other domains. Shared bootstrap/transport wiring under `common` is outside
that business-domain rule. The complete standard/embedded suite and the final focused boundary checks passed.

E2E and latency measurements: **not run**. Risk levels are engineering estimates;
no percentage slowdown is asserted without measurement.

## Verification and commit log

| Domain # | Evidence | Result | Commit |
| --- | --- | --- | --- |
| 1–2 | Initial notification/account targeted JUnit run | 76 tests, 3 failures caused by missing account-interface mock responses; repaired | — |
| 1–2 | Repeated targeted JUnit run | 76 tests passed | — |
| 1–2 | Expanded notification/accounts/email regression runs | Snapshot-fixture stubbing and generic provider declarations repaired; superseded by passing full suite | — |
| 1–2 | Existing dev hot-deploy compiler | Successful builds and application restart observed; not E2E proof | — |
| 2 | Full local suite, then final scheduler/boundary checks | 1638 passed, then 38 passed; no failures or skips | `96a049287` |

Notification checkpoint commit subject:
`[MSC-120] Isolate notifications behind domain service contracts`.
Commit: `96a0492874f2be4fb8c02bfe4b64b90dff8d3dcf` (pushed to the working branch).
Master remains at the pinned baseline.

Final evidence for this checkpoint:

- `JAVA_HOME=/home/raxim/.local/share/myscoutee-domain-tests/jdk-25 tools/run-backend-junit.sh local`:
  **1638 tests passed, 0 failures, 0 errors, 0 skipped**.
- Final review reused the existing event scheduler's distinct-member counting
  helper rather than retaining a duplicate. After that final adjustment, the
  same runner with `--tests 'com.raxim.myscoutee.domain.events.service.EventSchedulerTest'`
  and `--tests 'com.raxim.myscoutee.domain.notifications.NotificationDomainBoundaryTest'`
  passed **38 tests, 0 failures, 0 errors, 0 skipped**, including the new summary/progress case.
- The compiled boundary tests verify both dependency directions and reject
  notification collection literals in foreign domains.
- Explicit foreign repository imports dropped from 148 to 136, across 71
  remaining consumer files. Notifications now has zero such imports.
- The existing dev watcher compiled the changes and restarted the application;
  the `myscoutee` container is healthy. `git diff --check` passed.
- No E2E application, live user journey, remote interface or latency benchmark
  was run. Dev remains running. Standard/embedded tests used isolated outputs
  and disposable embedded Mongo, not the dev database.
- Frontend and master were not changed by this checkpoint.

## Exact changed-file inventory

This inventory covers the first notification-domain change. Paths are relative
to the repository root. Risk is an estimate before E2E; “high” for privacy code
reflects the consequence of an incorrect erasure, not evidence of a regression.
Unlisted algorithms and endpoint payloads are outside this commit's changes.

| File | Change / regression risk | Severe slowdown risk |
| --- | --- | --- |
| `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md` | Documentation only | None |
| `guides/plans/BACKEND_DOMAIN_SEGREGATION.md` | Documentation only | None |
| `server/projects/profile/src/e2eTest/java/com/raxim/myscoutee/e2e/BackendChatStreamSchedulerE2ETest.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/common/redis/RedisStreamRetentionService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountNotifications.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/SelectedProfile.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/AccountNotificationService.java` | Medium: recipient/device/delivery behavior | Low; bounded batch changes described above |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java` | High: preserve account-erasure semantics | Low; same Mongo operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/NavigatorContactsService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserLoginSessionService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/api/OperationalTelemetry.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminMenuCounterService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminParamsService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminStatsTelemetryWorkerService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminTelemetryService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminAffinityGraphLayoutWorkerService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeChangeStreamService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeWorkerService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserRatesService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/ChatPresence.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/ChatSessionAttributes.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatPushNotificationService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatStreamPublisher.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatWebSocketSessionRegistry.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/RedisStreamRetentionService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/websocket/ChatHandshakeInterceptor.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityAnnouncementsService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityCasesService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityScheduledTasksWorker.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityVotingWorker.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceFeedbackService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/AdministrativeAccess.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentModerationWorker.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/EmailProcessCatalog.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/DeletedAccountWarningWorker.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailProcessCatalogService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailDeliveryProcessor.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailPlannerService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledNotificationDeliveryService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/MemberAttention.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/RandomGroupAssignment.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventFeedbackService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleWorkerService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesResourcesService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventCancellationService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventCounterExpiryService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventInviteNotificationService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventScheduler.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventWatchService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/MemberAttentionService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupDirectory.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/config/AdminGroupIndexInitializer.java` | Medium: index ownership, names and uniqueness | Low; existing startup index work |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityGroupsService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/GroupDirectoryService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/api/RoleAttentionEvents.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationEncounterPublisher.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationWebhookService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/api/NotificationAdministration.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/api/NotificationCatalog.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/api/NotificationDelivery.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/api/NotificationInbox.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/api/NotificationJobs.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/api/NotificationPrivacy.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/api/RoleNotifications.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/config/NotificationIndexInitializer.java` | Medium: index ownership, names and uniqueness | Low; existing startup index work |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/controller/UserNotificationsController.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/document/NotificationOutboxItem.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/document/NotificationRuleConfig.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/mapper/UserNotificationMapper.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/repository/UserNotificationPageRepository.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/AdminNotificationService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/NotificationCatalogService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxService.java` | Medium: recipient/device/delivery behavior | Low; bounded batch changes described above |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxWorkerService.java` | Medium: recipient/device/delivery behavior | Low; bounded batch changes described above |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/NotificationPrivacyService.java` | High: preserve account-erasure semantics | Low; same Mongo operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/NotificationRuleRegistryService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/RoleNotificationService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/UserNotificationService.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/websocket/AdminNotificationWebSocketHandler.java` | Medium: owning-domain data or service boundary | Low; existing queries retained |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorUpdateReleaseService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/api/ExchangeRateRefresh.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/AffiliateRevenueService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/EventCheckoutBasketService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/ExchangeRateJob.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentMethodExpiryTaskService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentRefundService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/AdministratorSettings.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/DeploymentBranding.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/JobAudience.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/NotificationPolicy.java` | Low: typed domain contract | Low; local calls |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/AppSettingsService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/DeploymentBrandingResolver.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/JobGroupScopeService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/ModelStatusPropagationService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/PlatformParametersService.java` | Low: existing implementation, contract wiring or import move | Low; no new I/O |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/AccountNotificationServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/NavigatorContactsServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/administration/service/AdminParamsServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/UserRatesServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/service/AssetsServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatPushNotificationServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/AdminModerationServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskServiceIntegrationTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/ScheduledNotificationDeliveryServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventFeedbackServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesResourcesServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/EventInviteNotificationServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/EventSchedulerTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/NotificationDomainBoundaryTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/mapper/UserNotificationMapperTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/repository/UserNotificationPageRepositoryTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/AdminNotificationServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/NotificationCatalogServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/NotificationDeliveryDecisionTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxWorkerServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/RoleNotificationServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/UserNotificationServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/payments/service/PaymentRefundServiceTest.java` | Verification only | None in production |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/platform/service/DeploymentBrandingResolverTest.java` | Verification only | None in production |


## #20 localization checkpoint — complete

`Translations` and `TranslationBundles` expose the existing owners directly.
Six foreign consumers in assets, payments and email now depend on these contracts.
The localized message bodies, language negotiation, realm-specific caches, bundle
version handling and refresh schedule are unchanged. No new query or network call
is introduced; functional and severe slowdown risk are low. Future remote adapters
must propagate the request locale and database realm rather than assuming local
thread context. No remote adapter is implemented in this checkpoint.

The notification boundary test is generalized as `domain/DomainServiceBoundaryTest`
and reused for both completed domains. It checks both dependency directions and
foreign collection literals in production bytecode. The localization HTTP
controller still owns its existing service and returns the unchanged DTO.

Verification: the existing isolated runner passed **132 tests, 0 failures,
0 errors, 0 skipped**, selecting `domain.localization.*`,
`domain.DomainServiceBoundaryTest`, `domain.email.*`,
`domain.assets.service.AssetsServiceTest` and
`domain.payments.service.EventCheckoutPricingServiceTest`. The selection includes
standard and embedded tests. The dev watcher built successfully, restarted the
application, and the application container remains healthy. E2E was not run.

Commit subject: `[MSC-120] Isolate localization behind translation contracts`.
The hash will be recorded in the next domain checkpoint. Master stays at
`752ba4d15`; only the working branch receives this commit.

### #20 exact changed files and risk

All production changes below are interface declarations, implementation
bindings or consumer type replacements. Their bodies, query counts and public
HTTP serialization are unchanged. Functional risk: low; severe slowdown risk:
low. The shared architecture test changes only verification.

- `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/controller/PublicEmailUnsubscribeController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/DeletedAccountWarningWorker.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailPresentationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/localization/api/TranslationBundles.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/localization/api/Translations.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/localization/service/I18nService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/localization/service/TranslationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/EventCheckoutPricingService.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/NotificationDomainBoundaryTest.java`
