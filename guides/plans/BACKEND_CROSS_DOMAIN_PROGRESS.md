# MSC-120: Cross-domain separation progress

Status: **21/21 domains implemented and locally verified**, 2026-10-07.
E2E behavior and performance verification is deferred to 2026-10-08 by user instruction.
This file tracks the cross-domain implementation.
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
| 1 | accounts | 4 | 23 | Complete: account-owned identity, consent, authentication, session audit and scoped jobs | 425 local tests passed; `a7fe68125` |
| 2 | notifications | 6 | 7 | Complete: incoming/outgoing business-domain contracts and persistence ownership | 1638 local tests passed; final 38 focused tests passed; `96a049287` |
| 3 | groups | 4 | 7 | Complete: group contracts, workspace ownership, membership commands and scoped queries | 1671 local tests and 65 final focused tests passed; `052ddb8b7` |
| 4 | events | 8 | 14 | Complete: owner-controlled reads/writes, feedback projection, privacy and scoped scheduling | 566 regression tests and 59 final focused checks passed; `0fcacac34` |
| 5 | chat | 4 | 8 | Complete: conversation contracts, account writes, event context and chat privacy ownership | 653 regression tests and 98 final focused tests passed; `4d20ef5f2` |
| 6 | assets | 1 | 2 | Complete: asset ownership, booking contracts, privacy and save events | 1,147 regression tests passed; stale alias repaired; 44 final focused tests passed; `07b4c337c` |
| 7 | affinity | 6 | 11 | Complete: owner-controlled inputs, derived writes, rating evidence and calculation contracts | 1680 local tests and 31 final focused tests passed; `b1d603881` |
| 8 | community | 6 | 10 | Complete: community operations, case conversation values and owner-controlled reads | 625 regression, contract and serialization tests passed; `92f3cde2d` |
| 9 | campaigns | 1 | 4 | Complete: campaign, profile, rating and conversation contracts | 145 regression/boundary tests and 101 final consumer tests passed; `5264877a1` |
| 10 | payments | 8 | 10 | Complete: owner-controlled checkout, accounting, cancellations and scoped jobs | 1,109 regression tests passed; two purge fixtures repaired; 178 focused tests and 31 final boundary/header tests passed; `e7be89bd0` |
| 11 | integrations | 11 | 15 | Complete: owner-controlled authorization, invitations, publication and webhook jobs | 794 regression tests passed; three security bootstrap fixtures repaired; 167 final focused tests passed; `7108a7b22` |
| 12 | content | 2 | 5 | Complete: moderation ownership, support review, submissions, counters and privacy | 899 regression, boundary and serialization tests passed; `e7ac81ab3` |
| 13 | email | 2 | 5 | Complete: scheduled messaging, account lifecycle, privacy and configuration contracts | 814 regression tests and 67 final focused tests passed; `636d4c239` |
| 14 | access | 3 | 7 | Complete: owning-domain permission facts and public access contract | 1655 local tests and 195 final focused tests passed; `fb4695886` |
| 15 | administration | 4 | 7 | Complete: owner-controlled counters, profile statistics, graph results and administration contracts | 382 focused tests passed; `c5dceafa1` |
| 16 | operator | 4 | 7 | Complete: operator contracts and platform-owned deployment configuration commands | 241 focused local tests passed; `c11829ad0` |
| 17 | platform | 2 | 5 | Complete: read-only runtime policy, owner-resolved job scope and strict contracts | 273 focused tests; final full local suite: 1,731 passed; this checkpoint |
| 18 | help | 1 | 1 | Complete: help service, account consent and privacy contracts; owner indexes | 138 focused tests and 3 consent contract tests passed; `9368dcd92` |
| 19 | media | 0 | 0 | Complete: storage/session contracts and owner indexes | 67 boundary/media/security tests and 30 consumer/serialization tests passed; `2bb3bd0ae` |
| 20 | localization | 0 | 0 | Complete: translation and bundle service contracts | 132 focused tests passed; `6f8f086f0` |
| 21 | registry | 0 | 0 | Complete: operations, signed enrollment evidence, protocol values and configuration contracts | 270 regression tests, 48 focused tests and 15 final alias tests passed; `602f0367b` |

**Completed domains: 21/21 — #1 accounts, #2 notifications, #3 groups, #4 events, #5 chat, #6 assets, #7 affinity, #8 community, #9 campaigns, #10 payments, #11 integrations, #12 content, #13 email, #14 access, #15 administration, #16 operator, #17 platform, #18 help, #19 media, #20 localization and #21 registry.** A domain is complete when foreign
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

The notification checkpoint initially retained shared runtime infrastructure.
The final #1/#17 checkpoints expose these through `platform/api/JobGroupContext`,
`RuntimeConfiguration`, `accounts/api/AccountIdentity` and `FirebaseRuntime`;
no foreign implementation exception remains in the compiled boundary guard.
These remain in-process environment/transport contracts, not evidence of
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

## #18 help checkpoint

The existing help implementation now implements `HelpCenter`; its administration
and landing-content callers use that interface. Account-owned consent storage
moves to `AccountConsentService` through `AccountConsents`, returning detached
values. Help retains revision validation, optional-section filtering and the
existing HTTP DTO mapping. Exact-revision lookup still precedes latest-consent
fallback; reaccepting the same version retains its original acceptance timestamp.
Help owns revision indexes and author anonymization. The account purge calls the
help owner in the same position as the previous Mongo operations.

Existing authorization annotations and policy keys move to the access API; the
interceptor and policy checks remain the same. This is declarative contract
exposure, not another authorization mechanism. Base-group identifiers and their
existing type mapping are exposed by the groups API. Persisted document classes
and Mongo type identities are unchanged.

Verification: 138 focused help/access/purge/boundary tests passed. Three additional
consent tests cover lazy fallback, detached values and acceptance timestamp
preservation/upgrades. The initial compile caught a removed ObjectId import still
needed by help audit creation; restored before the passing runs. No E2E or latency
measurement has been performed. Queries and index definitions are unchanged.

Break risk: medium for consent validation/storage and authorization wiring; high
impact if author anonymization were wrong. Severe slowdown risk: low, because
query counts, bounds and update shapes are retained; no network hops added.
E2E focus: privacy accept/reaccept, optional-section selection, wrong-user denial,
workspace-scoped help administration, revision activation/deletion and account
erasure. Existing privacy and permission regression assertions remain in place.

Exact checkpoint files follow. Most authorization callers only change imports.

| File | Break risk | Severe slowdown risk |
| --- | --- | --- |
| `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md` | Documentation only | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/api/AccessPolicyKeys.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/api/ConsentAuthorization.java` | Medium: consent or privacy ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/api/RequiresPolicies.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/api/RequiresPolicy.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/AccessControlService.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/AccessPolicyKeys.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/RequiresPolicies.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/RequiresPolicy.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/RequiresPolicyMethodInterceptor.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/RequiresPolicySupport.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountConsents.java` | Medium: consent or privacy ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/controller/AuthController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/AccountConsentService.java` | Medium: consent or privacy ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java` | Medium: consent or privacy ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/controller/AssetsController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/controller/ChatsController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/LandingContentController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/controller/ActivitiesEventLeaderboardController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/controller/ActivitiesEventsController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/controller/ActivitiesResourcesController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/BaseGroups.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/config/AdminGroupIndexInitializer.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/document/CommunityGroup.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/api/HelpCenter.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/api/HelpPrivacy.java` | Medium: consent or privacy ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/config/HelpCenterIndexInitializer.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/controller/HelpCenterController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/service/HelpCenterService.java` | Medium: consent or privacy ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/service/HelpPrivacyService.java` | Medium: consent or privacy ownership | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/controller/MediaController.java` | Low: contract/import/index ownership | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/AccessControlServiceTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/AccessPolicySeedTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/BoundaryPolicyAnnotationTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/RequiresPolicyMethodInterceptorTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/RequiresPolicyRegistrationTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/AccountConsentServiceTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeServiceTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatServiceTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/controller/ActivitiesResourcesControllerPolicyTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesResourcesServiceTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/help/service/HelpCenterServiceTest.java` | Verification only | Low; same operations |

## #19 media checkpoint

Existing media storage implements `MediaStorage`. Image-set result values move
to that contract; path/attachment validation becomes an explicit public API. The
four-field attachment record is a shared value, not a media repository entity,
and now lives in `media.dto`. Its Mongo compatibility entry still writes and
reads the original profile-package identity. A nested Object-valued BSON
round-trip test verifies that identity as well as the fields.

`MediaSessionAccess` exposes the current HTTP security adapter. Its implementation
uses `AccountMediaSessions` for session lookup, token verification and replacement;
only accounts reads/writes `UserSessionState`. Cookie format, whole-cookie hashing,
REAL/DEMO separation, session revocation and conditional positional update remain
unchanged. Authentication remains one primary-key existence query, cookie issuance
retains one projected lookup and one conditional update.

Indexes previously initialized by media belong to assets, events, content,
campaigns and chat. Their names, keys, sparse/unique settings and REAL/DEMO
database coverage are unchanged. Media has no remaining Mongo access.

Verification: 67 focused media/security/purge/boundary tests, then 30 consumer and
Mongo serialization tests passed. Wrong realm/token, revocation and absent session
negative paths remain covered. No E2E or measured latency claim. The local servlet
and MultipartFile adapter contracts still require transport adaptation for a
future separate process; this checkpoint does not claim remote readiness.

Break risk: medium for authentication wiring and attachment serialization; low for
unchanged index and storage operations. Severe slowdown risk: low; no additional
queries, file operations or network calls. E2E focus: authenticated private media
reads, session revoke/logout, REAL/DEMO isolation, image import/deletion, attachments
after save/reload and indexed media authorization.

| File | Break risk | Severe slowdown risk |
| --- | --- | --- |
| `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md` | Documentation only | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/mongo/SessionMongoRoutingFilter.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/MediaPolicyFacts.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountMediaSessions.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/security/firebase/FirebaseFilter.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/AccountMediaSessionService.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserLoginSessionService.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/config/AssetsMediaIndexInitializer.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/config/CampaignsMediaIndexInitializer.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/document/Campaign.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/dto/CampaignDtos.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/config/ChatMediaIndexInitializer.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/document/CommunityAnnouncement.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/dto/CommunityAnnouncementDtos.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityAnnouncementsService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceOfferingsService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/config/ContentMediaIndexInitializer.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/IdeaPostsService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/PhotoFeedService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/config/EventsMediaIndexInitializer.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationSyncService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/api/DocumentAttachments.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/api/MediaAccessPaths.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/api/MediaSessionAccess.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/api/MediaStorage.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/config/MediaPolicyIndexInitializer.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/controller/MediaController.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/document/DocumentAttachment.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/dto/DocumentAttachment.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/service/DocumentAttachments.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/service/MediaAccessPaths.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/service/MediaSessionAccessService.java` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/media/service/MediaStorageService.java` | Low: same implementation/index, exposed contract | Low; same operations |
| `server/projects/profile/src/main/resources/mongo-domain-types.properties` | Medium: session or serialized value boundary | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/MongoConverterConfigTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/MediaPolicyFactsTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/media/controller/MediaControllerTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/media/service/MediaAccessPathsTest.java` | Verification only | Low; same operations |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/media/service/MediaSessionAccessServiceTest.java` | Verification only | Low; same operations |

## #9 campaigns checkpoint

Campaign operations now expose `Campaigns` and a read-only `CampaignView`.
`CampaignCatalog` owns the exact existing campaign lookups used by chat, rating
synchronization, integration retries and media authorization. No foreign domain
reads the campaign collection or names its persistence classes.

Campaigns consumes accounts' current-profile/directory contracts, groups' type
and membership contracts, affinity's detached campaign-rating evidence, and
chat's campaign interaction values. Owner and rating reads remain batched before
filtering/paging; history keeps the original evidence and visibility order.
`WorkspaceProfile` is an explicitly read-only local view implemented by Users.
It is not a detached snapshot or a remote transport. Persisted profile fields
and nested coordinate types are unchanged.

The campaign rating projection was stored under campaigns but is written/read
exclusively by the affinity pipeline and embeds UserRate evidence. Its existing
service and document move to affinity, retaining the collection, indexes,
algorithm, and original stored Mongo type name. A BSON round-trip covers the
projection and nested rating. The existing distance calculation now belongs to
the profile API and is shared by campaign/service-offering DTO mapping.

Verification: 145 campaign/affinity/chat/access/integration/boundary tests passed,
then 101 event/integration/campaign/serialization consumer tests passed. Actor
resolution additionally verifies Work group/account requirements and membership
selection. Existing lifecycle/version, cross-workspace and campaign-rating
assertions were preserved. No E2E or latency measurement performed.

Break risk: medium for workspace visibility, campaign chat/rating eligibility
and integration retry wiring. Severe slowdown risk: low: same query counts,
batch sizes, projections and indexes; only in-memory transfer values are added.
E2E focus: publish/unpublish/trash/restore, workspace isolation, history/rating
paging, campaign-linked events, rating-gated questions, idempotent campaign
imports, private attachments, and saved rating projection reload.

| File | Break risk | Severe slowdown risk |
| --- | --- | --- |
| `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md` | Documentation only | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/MediaPolicyFacts.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/CurrentProfile.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileDirectory.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileDistances.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/document/Users.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileDirectoryService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/CampaignRatings.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/document/CampaignRatingSummary.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/CampaignRatingEvidenceService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/CampaignRatingProjectionService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserAffinityEdgeService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserRatesService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/api/CampaignCatalog.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/api/CampaignView.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/api/Campaigns.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/document/Campaign.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/document/CampaignRatingSummary.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/dto/CampaignDtos.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/mapper/CampaignMapper.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignCatalogService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignRatingProjectionService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/CampaignConversations.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/CampaignConversationService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceOfferingsService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupDirectory.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/WorkspaceMembership.java` | Low: explicit contract | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityGroupProfilesService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/GroupDirectoryService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationDomainController.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationSyncService.java` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/main/resources/mongo-domain-types.properties` | Medium: ownership, authorization or persistence boundary | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/MongoConverterConfigTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/MediaPolicyFactsTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/CampaignRatingProjectionServiceTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/UserAffinityEdgeServiceTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/UserRatesServiceTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/campaigns/service/CampaignRatingProjectionServiceTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsServiceTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatServiceTest.java` | Verification only | Low; same queries and batching |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/IntegrationCampaignCreateTest.java` | Verification only | Low; same queries and batching |

## #14 `fb4695886`

The current policy evaluator implements `AccessPermissions`; callers use this
contract. Policy keys/annotations already belonged to the access API; the grant
effect enum and region-security read contract now do too. The evaluator, named
Spring bean, annotations, policy cache, conditional ordering and denial behavior
are unchanged.

Membership/event/asset/chat facts consume read-only contracts from their owners.
The existing documents implement those narrow local views; no persisted type or
field changes. Case participant calculation stays with community. Administrator
classification exposes its existing rules through an interface. The principal's
`profileView()` accessor avoids adding a JavaBean/JSON property. Workspace-context
selection is exposed from groups and retains its existing security-context logic.

Friendship adjacency queries and their request/realm-scoped cache move together
to accounts. Media-policy Mongo reads move to their respective accounts, groups,
community, assets, events, content and chat owners. Access retains decision order
and consumes typed metadata, including all forwarded chat attachment candidates.
There is no foreign repository, document reference or raw collection read left
in access. No process-wide authorization cache or new fallback was introduced.

Queries retain their existing filters and cardinality. The small account-media
projection consistently selects profile status/account/workspace IDs; it no longer
loads the unused profile-image array. Membership media checks share the existing
accepted-member filter and project role. Other media projections are unchanged.
Read-only local views are not detached snapshots or independent deployment proof.

Verification: the complete standard/embedded suite passed **1655 tests, zero
failures/errors/skips**, followed by **195 passing access/groups/auth/boundary
tests** after the final principal accessor naming adjustment. The dev watcher
compiled and restarted successfully; the container is healthy. No E2E application
or latency benchmark ran.

Break risk: high impact for a wrong authorization result; medium likelihood
estimate due to the number of moved boundaries. Severe slowdown risk: low; query
count/order and request-cache scope are retained, with small metadata mapping
cost. E2E focus: wrong-user/realm denials, event/asset management and takeover,
accepted/blocked participants, account-vs-workspace contact chats, support scope,
private media and forwarded attachments, moderation privileges and revocation.

| File | Break risk | Severe slowdown risk |
| --- | --- | --- |
| `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md` | Documentation only | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/api/AccessGrantEffect.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/api/AccessPermissions.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/api/RegionSecurity.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/config/RegionSecurityProperties.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/AccessControlService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/AccessGrantEffect.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/AccessPolicyData.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/ChatPolicyFacts.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/FriendshipFacts.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/MediaPolicyFacts.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/MemberPolicyFacts.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/condition/ExplicitAllowCondition.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/condition/NoExplicitDenyCondition.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountMediaVisibility.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/Friendships.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/security/firebase/dto/FirebasePrincipal.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/AccountMediaVisibilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/FriendshipFacts.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/NavigatorContactsService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/OrganizerFollowingService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/api/AdministratorClassification.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminMenuCounterService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetMediaVisibility.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetOwnership.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/document/Asset.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetAvailabilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetMediaVisibilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetOwnershipService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/ChatDirectory.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/ChatMediaVisibility.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/document/Chat.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatDirectoryService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatMediaVisibilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/CaseParticipants.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/CommunityMediaVisibility.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CaseParticipantsService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityMediaVisibilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/ContentMediaVisibility.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentMediaVisibilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventMediaVisibility.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventOwnership.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/MemberDirectory.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/controller/CalendarExportController.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/document/ActivityEvent.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/document/ActivityMember.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventFeedbackService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventLeaderboardService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMembersService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesResourcesService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventMediaVisibilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventOwnershipService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventTicketService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventWatchService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/MemberDirectoryService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupMediaVisibility.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/WorkspaceContext.java` | Low: explicit read/permission contract | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityGroupProfilesService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/GroupMediaVisibilityService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/AdminClientSettingsController.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationApiController.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationSettingsController.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/McpSettingsController.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationCapabilitiesService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationParticipantInviteService.java` | Medium; high impact if permission facts differ | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/AccessControlServiceTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/FriendshipFactsTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/MediaPolicyFactsTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/NavigatorContactsServiceTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/OrganizerFollowingServiceTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/service/AssetsServiceTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatServiceTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsServiceTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesResourcesServiceTest.java` | Verification only | Low; same query count/order |
| `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/EventWatchServiceTest.java` | Verification only | Low; same query count/order |

### #15 administration complete

- Existing administration, content and affinity services now expose operation interfaces.
  The affinity parameter editor and its regression tests moved to affinity; its HTTP
  paths, payloads, validation, history and recomputation behavior remain unchanged.
- Account-owned `AdminProfileCounterService` performs the existing profile reads,
  counter updates and conditional saves. Administration owns queue facts and monitoring
  snapshots. Counters remain cached once per workspace within each refresh; there are
  no extra database reads per administrator.
- Account-owned `ProfileStatisticsService` retains the existing scoped population,
  status normalization, seed/staff exclusions and full-scan behavior. Affinity returns
  calculated graph values; administration applies them to its own stored snapshot.
- Telemetry uses an API event record with identical JSON fields. Integration statistics
  use an administration-owned query with the same filter and projection. No Mongo
  document classes or stored type aliases changed in this checkpoint.
- Break risk: medium for Spring injection, workspace-scoped counters, graph history and
  affinity configuration editing. Severe slowdown risk: low from this change, because
  batching, query filters/counts and existing scans are retained. Existing graph/full
  profile scans remain an E2E observation point, not a newly introduced optimization.
- Evidence: 382 focused standard/embedded tests passed with no failures, errors or skips,
  including both administration boundary directions, graph history, audience resolution,
  configuration history, account/integration consumers and two new counter tests proving
  workspace batching, unchanged-save suppression and context restoration. Existing dev
  watcher compiled successfully and the application health check passed. E2E not run yet.
- Public views and record payloads describe the in-process boundary; they do not prove
  remote deployment or measured latency equivalence.

Exact files in the `c5dceafa1` (including owner and consumer updates):

- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AdminCounterRefresh.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileStatistics.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/AdminProfileCounterService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileStatisticsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/api/AdminAudience.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/api/AdminTelemetryEvent.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/api/AdministrativeQueues.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/api/AdministrativeStatistics.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminAudienceService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminMenuCounterService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminMonitoringService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminParamsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminStatsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminStatsTelemetryWorkerService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminTelemetryEvent.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminTelemetryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdministrativeStatisticsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/AffinityGraph.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/AffinityParameters.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/GraphScience.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/RecomputeMetrics.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/RecomputeQueue.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminAffinityGraphService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminGraphScienceService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminParamsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeMetricsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/RecomputeQueueService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserRatesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/AdministrativeAccess.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/IdeaPosts.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/IdeaPostsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventFeedbackService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMembersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventCounterExpiryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityGroupsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/repository/AdminClientRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/AdminClientAccessService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/AdminClientService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/JobAudience.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/AdminProfileCounterServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/administration/service/AdminAffinityGraphControllerTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/administration/service/AdminAudienceServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/administration/service/AdminMonitoringServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/administration/service/AdminParamsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/administration/service/AdminStatsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AdminGraphScienceServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AdminParamsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/AdminModerationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/AdminClientServiceTest.java`

### #13 email complete

- `ScheduledMessages` exposes the existing task scheduler. Accounts and events use
  scheduling receipts, account profile views and event schedule views; persisted
  account, event, stage and task classes retain their identities.
- Account-owned `AccountInactivityService` performs the existing activity lookup and
  profile transition before email audit/rescheduling resumes. It retains the device
  and session activity rules, save-before-affinity ordering and already-inactive guard.
- `DeletedAccountWarningWorker` moved to accounts, which owns deletion lifecycle and
  the `accountDeletionWarnings` claims. Email sending/rendering use the existing email
  services through interfaces; retries, claim ordering, cancellation and unknown-send
  suppression are unchanged.
- Community owns serialization/deserialization of the saved closed-case snapshot.
  Email stores the same opaque JSON task payload and calls the existing feedback
  preparation through its operation contract, without loading community documents.
- Existing branding and job scope services are consumed through their interfaces.
  Profile audiences remain batched and membership queries retain the existing service's
  accepted/pending/invited semantics. No new remote call or per-recipient query was added.
- Email owns its template/rule indexes and account-purge/anonymization operations.
  Index definitions, both database targets, purge filters and operation order are retained.
- `EncryptedSecret` moved from the nested platform document class to a platform transfer
  type. Its fields, encryption purpose, algorithm and wire JSON are unchanged. The Mongo
  compatibility mapper now checks explicit nested overrides before the existing root
  fallback, preserving `DeploymentConfiguration$EncryptedSecret` as its historical stored
  identity. Other nested identities continue to use the existing root mapping.
- Break risk: medium for scheduler/provider injection, account inactivity, case snapshot
  replay, privacy purge and encrypted configuration round trips. Severe slowdown risk: low
  from this change because the same batch lookups, worker limits, claim filters and scans
  remain. Existing scans and asynchronous scheduling remain E2E observation points.
- Verification so far: 814 focused standard/embedded tests passed, including the embedded
  scheduler's timed inactivity, refresh cancellation, republish and pre-limit group filters;
  three new inactivity tests; warning retries; Mongo nested-envelope round trip; community
  snapshot handoff; event, platform and operator regressions. Final 67 focused tests also passed with
  no failures, errors or skips. The dev watcher compiled and the application restarted successfully.
- E2E and measured latency equivalence are not yet proven. Local read-only views are not
  detached remote contracts; extracting a process still requires transport mapping.

Exact files in the `636d4c239` (including moves, shared value and consumer changes):

- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/MongoConverterConfig.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountInactivity.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/document/Users.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/AccountInactivityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorker.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/FacebookDataDeletionService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/AffinityStatusChanges.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/document/AffinityRecomputeTask.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/CaseFeedbackPreparation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityCasesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceFeedbackService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/EmailLinks.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/EmailPrivacy.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/EmailRendering.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/EmailSendRequest.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/EmailSendResult.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/EmailSending.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/api/ScheduledMessages.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/config/EmailGroupIndexInitializer.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/config/EmailProperties.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/controller/PublicEmailUnsubscribeController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/document/ScheduledMessageTask.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/DeletedAccountWarningWorker.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailPresentationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailPrivacyService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailProvider.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailProviderGateway.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailSendRequest.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailSendResult.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailTemplateRenderer.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailUnsubscribeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/NoopEmailProvider.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/OperatorEmailConfigurationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailDeliveryProcessor.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailPlannerService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailRuleEvaluator.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageAuditService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledNotificationDeliveryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/SendGridEmailProvider.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventSchedule.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/MemberAudience.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/document/ActivityEvent.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/document/SubEventItem.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMembersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/config/AdminGroupIndexInitializer.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/document/McpEventSubscription.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/JobAudience.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/SecretEncryption.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/document/DeploymentConfiguration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/dto/EncryptedSecret.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/DeploymentConfigurationCrypto.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/DeploymentFirebaseRuntime.java`
- `server/projects/profile/src/main/resources/mongo-domain-types.properties`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/MongoConverterConfigTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/AccountInactivityServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorkerTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CommunityCasesServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/DeletedAccountWarningWorkerTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/EmailProviderGatewayTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/OperatorEmailConfigurationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailDeliveryProcessorTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskServiceIntegrationTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/SendGridConfiguredEmailTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/McpEventsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/mapper/OperatorConfigurationMapperTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/platform/service/DeploymentConfigurationCryptoTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/platform/service/DeploymentFirebaseRuntimeTest.java`


### #3 groups complete

Group consumers now use `Groups`, `CommunityAuthority`, `GroupDirectory`,
`GroupAdministration`, and read-only `GroupView`. The existing group services
remain the implementation. Group policy values live in `groups.dto`; the Mongo
alias mapper preserves the historical nested `CommunityGroup$Policy` identity.

Profile admission, selection, policy enforcement, presentation and workspace
filtering belong to accounts. The event and asset owners now stamp their own
workspace field through typed Mongo listeners. Both reuse the account directory;
neither accepts a caller-supplied workspace as authoritative. Group counters and
moderation projections now write through the group owner, retaining the exact
conditional revision predicates, increments and timestamps.

`CommunityMemberships` owns the community-member queries and conditional
transitions in events. Transfer objects are detached from stored members. The
expected status, role and action timestamp still guard each transition; a lost
compare-and-set is not reported as a successful transition. Group report
persistence and duplicate handling move to the content owner. No endpoint or
external request/response field changes.

The announcement closure query previously joined `communityGroups`. It now reads
candidate announcements in ordered batches of at most 100 and asks the group
owner for eligible IDs in one batch. Filtering still happens before the final
100-result processing limit. No announcement is mutated while candidate pages
are being collected. Missing, deleted, under-review, base and non-community groups
remain excluded. This removes the cross-domain Mongo join but adds round trips;
it is a specific performance target for E2E verification.

| Area | Functional regression risk | Severe slowdown risk | E2E focus |
| --- | --- | --- | --- |
| Workspace admission, selected identity and policy | High impact if incorrect | Low; previous profile queries and saves retained | Account/base/private workspace switching, missing membership, profile privacy policy |
| Invites, restoration and membership transitions | Medium | Low; same conditional update and batch reads, small detached DTO copies | Invitation replay, join approval, removal, concurrent role/status changes, active selection cleanup |
| Group moderation and pending counters | Medium | Low; identical targeted Mongo updates | Approve/reject, revision races, badges and successful-transition-only increments |
| Event and asset workspace stamping | Medium | Low; one owner lookup, same as before | Save/reload, missing owner, untrusted workspace field |
| Group policy serialization | Medium | Low | Historical BSON read, current write and external JSON fields |
| Announcement voting closure selection | Medium | Medium for a large backlog of ineligible groups; each candidate batch adds one group query | More than 100 ineligible candidates ahead of eligible rows; output limit, retries and notification acknowledgement |
| Job workspace inventory | Medium | Low; same projected Mongo query and per-job memoization | Dating, Work and Community scope; one inventory read per job |
| Group report registration | Low | Low; same durable write and duplicate handling | Repeated report key, telemetry and validation |

`WorkspaceProfile` remains an owner-issued local read-only view. Accounts accepts
that view back for its existing in-memory profile activation/presentation path,
so no extra read is added. That adapter requires an accounts-issued view and is
not a detached HTTP contract. A future remote account adapter must replace this
local identity handoff. `GroupView` is also an in-process read-only contract, not
a claim of independent deployment.

Verification: **1671 standard + embedded tests passed, zero failures/errors/skips**.
This includes conditional membership guards, detached member mutation, workspace
listener ownership, historical policy BSON identity, closure eligibility before
limit, workspace job memoization, invitation replay, group counters, and both
incoming/outgoing group boundary checks. The dev watcher compiled successfully
and the dev application restarted healthy. E2E stability and latency remain
unmeasured; no E2E application has run alongside dev.

Exact files in this domain checkpoint (paths relative to the repository root;
removed paths are recorded because their responsibilities moved):

- `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/WebSecurityConfig.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountWorkspaces.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfilePresentation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/config/GroupWorkspaceFilter.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/controller/AuthController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/mapper/CommunityGroupProfileMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/security/firebase/FirebaseAuthenticationToken.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/CommunityGroupPolicyCallback.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/CommunityGroupProfilesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/NavigatorContactsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AbsoluteAffinityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityCalculationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserRatesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetAvailabilityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetWorkspaceDocumentListener.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatWebSocketSessionRegistry.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/mapper/CommunityCaseMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/repository/CommunityAnnouncementsRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CaseAppointmentsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityAnnouncementsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityCasesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityScheduledTasksService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceFeedbackService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceOfferingsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/CommunityReports.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/ContentRegistration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/ContentModerationController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/LandingContentController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/repository/PhotoFeedRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/CommunityReportService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/CommunityMemberships.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/controller/ActivitiesMembersController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/dto/CommunityMember.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesInviteCandidatesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/CommunityMembershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventScheduler.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventWorkspaceDocumentListener.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/CommunityAuthority.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupAdministration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupCounters.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupModerationProjection.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/GroupView.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/api/Groups.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/config/GroupWorkspaceFilter.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/document/CommunityGroup.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/dto/CommunityGroupDtos.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/dto/GroupPolicy.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/mapper/CommunityGroupMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/mapper/CommunityGroupProfileMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/repository/CommunityGroupsRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityAccessService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityGroupPolicyCallback.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityGroupProfilesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityGroupsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityWorkspaceDocumentListener.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/GroupAdministrationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/GroupCounterService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/GroupDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/GroupModerationProjectionService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/api/ParticipantInvitation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/config/IntegrationTokenAuthenticationFilter.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/document/IntegrationParticipantInvite.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationCapabilitiesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationParticipantInviteService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/McpAuthorizationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/McpEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/JobGroupScopeService.java`
- `server/projects/profile/src/main/resources/mongo-domain-types.properties`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/MongoConverterConfigTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/WebSecurityConfigBootstrapTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorkerTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AffinityCalculationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/UserRatesServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CommunityAnnouncementsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CommunityCasesServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CommunityScheduledTasksServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/AdminModerationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/ContentModerationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskServiceIntegrationTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/CommunityMembershipServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/EventSchedulerTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/groups/config/GroupWorkspaceFilterTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/groups/document/CommunityGroupInviteClaimTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/groups/document/CommunityGroupWorkspaceSelectionTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/groups/mapper/CommunityGroupMapperTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/groups/service/GroupTestSupport.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/groups/service/WorkspaceOwnershipListenersTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/config/IntegrationTokenAuthenticationFilterTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/IntegrationCapabilitiesServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/IntegrationParticipantInviteServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/McpAuthorizationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/McpEventsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/payments/service/EventCheckoutBasketServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/payments/service/ExchangeRateTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/platform/service/JobGroupScopeServiceTest.java`


### #8 community complete

Integration controllers call `Cases`, `Announcements`, `ScheduledCases` and
`ServiceOfferings`; the existing services implement these interfaces without
changing endpoint validation or response shapes. Accounts owns profile reads and
feedback-counter writes. Events owns membership queries and recurrence, and
payments exposes the existing appointment price calculation. Affinity owns the
existing score query, campaign exclusion and duplicate-key reduction.

Community owns the case counts, case lookup and announcement lookup used by
accounts and chat. `CaseConversation` is a detached value: community computes main
conversation and private offer participants before passing them to chat's existing
synchronization logic. No additional database read is needed when a saved case
is handed to chat. Socket membership rechecks use the same owner lookup. Invited
and removed participants stay excluded; provider access to one offer does not
expand into another offer or the main conversation.

The immutable case detail records move into `community.dto.CaseDetails` because
they are already part of request/response contracts. Explicit nested Mongo aliases
preserve the historical `ServiceCase$BoardTask`, `$Support`, `$Recommendation` and
`$Offer` identities. `ServiceOfferingView` exposes the existing read-only service
record to API consumers; its JSON field names and serialized content are unchanged.
No migration or new collection is introduced.

| Area | Functional regression risk | Severe slowdown risk | E2E focus |
| --- | --- | --- | --- |
| Case and offer chat membership | High impact if incorrect | Low; same queries, detached values created from the already loaded case | Invited/removed members, separate providers, main vs private offer chats, socket updates |
| Case menu counts | Medium | Low; same bucket aggregation and integer cap | Managed communities, participant visibility, trash exclusion |
| Offering search, staff and rating eligibility | Medium | Low; existing batch reads and 100-member query retained | Languages, distance, inactive profiles, rating exclusion and accepted staff |
| Appointment recurrence and prices | Medium | Low; same implementation and rounding | Overrides, occurrence dates, occupancy price and replay |
| Feedback counters and notifications | Medium | Low; same account-scoped updates and batched profile lookup | Completed-case snapshot, pending feedback counts, recipient scope |
| Case detail BSON and service response JSON | Medium | Low | Historical nested identities, save/reload and integration request forwarding |

Verification: **625 focused standard + embedded tests passed**, with zero failures,
errors or skips. The selection covers community, chat, accounts, integrations,
payments, affinity, slot behavior, Mongo type identity and every completed-domain
boundary. New contract tests exercise private offer membership, excluded actors,
case count capping and all four moved BSON value types. The dev watcher compiled
successfully and the dev application is healthy. No measured E2E latency claim is
made. All calls remain in-process; read-only owner views need a transport adapter
before separate-process deployment.

Exact files in this domain checkpoint:

- `guides/plans/BACKEND_CROSS_DOMAIN_PROGRESS.md`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ServiceFeedbackCounters.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/AccountRatings.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AccountRatingService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserRatesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/CaseConversations.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatWebSocketSessionRegistry.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/AnnouncementDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/Announcements.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/CaseFeedbackPreparation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/CaseParticipants.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/Cases.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/ScheduledCases.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/ServiceOfferingView.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/api/ServiceOfferings.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/document/ServiceCase.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/document/ServiceOffering.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/dto/CaseAppointmentDtos.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/dto/CaseConversation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/dto/CaseDetails.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/dto/CommunityCaseDtos.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/dto/ServiceOfferingDtos.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/mapper/CaseConversationMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/mapper/CommunityCaseMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/AnnouncementDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CaseAppointmentsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CaseParticipantsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityAnnouncementsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityCasesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityScheduledTasksService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceFeedbackService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceOfferingsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/CommunityMemberships.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/SlotRecurrence.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/mapper/ActivityEventSubEventsMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/CommunityMembershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationDomainController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/api/ServiceSlotPricing.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/EventCheckoutPricingService.java`
- `server/projects/profile/src/main/resources/mongo-domain-types.properties`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/MongoConverterConfigTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CaseAppointmentsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CaseParticipantsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CommunityAnnouncementsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CommunityCasesServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/community/service/CommunityScheduledTasksServiceTest.java`

### #7 affinity complete: owner inputs, derived writes and calculation contracts

- The existing affinity algorithms implement `AffinityScores`, `Ratings`,
  `AffinityStatusChanges` and `CampaignGraphs`; their callers depend on these
  interfaces. Scores, debounce values, edge accumulation and client payloads
  retain their existing rules.
- `ProfileDirectory`, `Experiences`, `EventOwnership`, `MemberDirectory` and
  `AssetOwnership` supply owner-issued read views. They remain local views of
  the same objects, not detached remote DTOs. Read-only accessors do not authorize
  callers to mutate the returned collections. Event/asset/account affinity
  updates execute inside their owner, including the original optimistic date
  guard and post-success in-memory update. A later HTTP adapter must make this
  local identity behavior explicit.
- Account rating projections and friendship upserts now belong to accounts.
  Exact narrow field updates, unordered bulk writes, timestamp maxima, earliest
  friendship / latest meeting guards and literal Mongo expressions are retained.
- Events submit bounded meeting-evidence commands to affinity. The existing
  pair identity, upsert, batch size (500), retry behavior and completion-after-
  persistence ordering remain intact. Affinity privacy commands replace the
  original raw purge/anonymization calls at the same coordinator positions.
- `ConfigurationCatalog`, `RatingDirectory` and `EdgeDirectory` own reads of
  affinity persistence. Campaign graph snapshots use one rating batch for both
  participants and calculated edges; no per-campaign or per-participant read
  is introduced.
- Scoped full recomputation reuses the already selected account IDs, querying
  rating owners in batches of 1,000 instead of joining the users collection.
  This changes the query plan. The unscoped path still uses its original scan.
- QMAU's old cross-domain Mongo union is split into owner-controlled sorted
  streams (`RatingMeasurement`, `EventMeasurement`, `ChatMeasurement`,
  `AssetMeasurement`) and account-owned `MeasurementEligibility`. Operator
  merges six cursors and checks eligibility in batches of 1,000. The shared
  cursor helper contains no domain query or acceptance rule. The vocabulary,
  timestamp fallback, exclusions and deterministic evidence order are retained.
  Eligibility is read per batch rather than inside one aggregate; concurrent
  profile changes can therefore be observed at different times. Neither path
  promises a transactional snapshot. Cursor lifetime is an in-process contract;
  a future remote adapter needs paged/streamed evidence, not a Mongo cursor.

| Area | Functional regression risk | Severe slowdown risk | Required attention |
| --- | --- | --- | --- |
| Scores, rating pages, recompute signals | Medium | Low | Existing score fixtures, social modes, task coalescing and notifications |
| Guarded event/asset writes and profile projections | Medium | Low | Concurrent edits must not be overwritten; memory changes only after a matched write |
| Meeting/friendship writes and privacy purge | High | Low | Retry after partial work, shared rating orientation, monotonic dates and purge coverage |
| Campaign graphs | Medium | Low | Campaign isolation and exactly one evidence read |
| Scoped full recomputation | Medium | Medium | Representative owner counts, indexed owner lookup and no cross-workspace ratings |
| QMAU evidence merge | High | Medium | Compare old/new evidence and commitment; period-scale data, sort spills and batch latency; concurrent eligibility changes |

The risk ratings above are engineering estimates, not measured latency claims.
The QMAU implementation opens six bounded cursors and performs one account query
per 1,000 candidate rows; it does not load all evidence into JVM memory. E2E
performance remains to be measured after stopping the dev application.

Changed files for this checkpoint (repository-relative):

- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/measurement/EvidenceCursor.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/measurement/MeasurementEvidence.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/common/measurement/MongoEvidenceCursor.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountAffinityProjections.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/Experiences.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/FollowingEvents.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/Friendships.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/MeasurementEligibility.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfilePresentation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/document/UserExperienceProfile.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/document/Users.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/AccountAffinityProjectionService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ExperienceDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/FriendshipFacts.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/MeasurementEligibilityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/OrganizerFollowingService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserExperienceProfilesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/AffinityPrivacy.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/AffinityScores.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/AffinityStatusChanges.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/CampaignGraphs.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/ConfigurationCatalog.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/EdgeDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/EdgeView.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/MeetingEvidence.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/RatingDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/RatingMeasurement.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/RatingView.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/api/Ratings.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/document/AffinityConfig.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/document/UserAffinityEdge.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/document/UserRate.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/repository/UserRatesRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AbsoluteAffinityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminAffinityGraphService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminGraphScienceService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityCalculationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityMaintenanceService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityPrivacyService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeWorkerService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/ConfigurationCatalogService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/EdgeDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/MeetingEvidenceService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/RatingDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/RatingMeasurementService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserAffinityEdgeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserRatesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetMeasurement.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetOwnership.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/document/Asset.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetMeasurementService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetOwnershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/ChatMeasurement.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatMeasurementService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventMeasurement.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventOwnership.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/MemberDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/document/SubEventItem.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventFeedbackService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventLeaderboardService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesInviteCandidatesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMembersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventFriendshipProjectionService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventMeasurementService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventOwnershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventScheduler.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/MemberDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/repository/MongoQualifiedMauEvidenceRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/JobAudience.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/ModelStatusChanges.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/SchedulingPolicy.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/JobGroupScopeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/ModelStatusPropagationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/PlatformParametersService.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AdminAffinityGraphServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AdminGraphScienceServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AffinityCalculationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AffinityProjectionOwnershipTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/UserAffinityEdgeServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/affinity/service/UserRatesServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskServiceIntegrationTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesInviteCandidatesServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/EventFriendshipProjectionServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/EventSchedulerTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/AdminClientServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/repository/LegacyQualifiedMauEvidence.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/repository/MongoQualifiedMauEvidenceRepositoryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/repository/QualifiedMauOwnerParityTest.java`

Verification: the full standard + embedded suite passed **1,680 tests** with no
failures, errors or skips. After adding write-guard, scoped-batch and campaign
snapshot proofs, **31 final focused tests** passed. The embedded QMAU parity
fixture produced exactly the same ordered 1,013 evidence rows as the frozen
pre-change union query, across all six action types and exclusion rules.
Existing dev hot-deploy compilation succeeded and the container is healthy.
Master and the frontend submodule remain unchanged. E2E performance is not yet
measured.

### #12 content complete: moderation and submission ownership

- Content moderation calls event/asset owner commands with the same source ID,
  version and decision. The original version predicates, suppression exclusions,
  previous-status restoration and counter-refresh ordering are retained. Event
  details are read and mapped by events, and asset details reuse AssetsService
  through `AssetModerationDetails`.
- Profile block/unblock saves move to `ProfileModeration`; content retains the
  existing report and administrator scope checks before calling it. Repeated
  blocking retains the original status. Local owner-issued profile identity is
  reused, with no additional database read.
- `ChatReview` owns report-message membership, author validation and the existing
  newest-50-message read/reversal. `ChatDirectory` supplies support summaries;
  `SupportMessages` reuses ChatService's existing durable message behavior.
- Feedback and report creation use `UserFeedback` and `UserReports`. Accounts
  still performs its existing actor/event/chat authorization and normalization.
  IDs, sync keys, duplicate responses, timestamps, notification ordering and
  telemetry remain unchanged. The existing CommunityReportService implements
  report submission rather than adding a second report persistence path.
- Content owns feed-count aggregation, unresolved-report/feedback counts, idea
  media cleanup and content privacy operations. Accounts retains the original
  feed-counter compare-and-set loop; each retry re-reads the authoritative
  content counts. Privacy calls retain their coordinator ordering and fail-fast
  media deletion before removing idea rows.
- Feed counter records move from a nested account document type to an account
  DTO. The exact historical nested Mongo `_class` identity is explicitly mapped
  and round-trip tested. No collection or JSON field is renamed.
- Landing, feed and share-link consumers use existing account, country, event
  and asset implementations through read contracts. FirebasePrincipal implements
  `AccountIdentity`; the existing email/principal fallback and admin-email check
  remain at the same authorization point.

| Area | Functional regression risk | Severe slowdown risk | Required attention |
| --- | --- | --- | --- |
| Moderation and lifecycle restoration | High | Low | Version conflicts, repeated decisions, block/unblock restoration, counters after writes |
| Reported chat inspection | High | Low | Reporter membership, target author and bounded history; unauthorized history stays hidden |
| Feedback/report submission | Medium | Low | Natural-key duplicates, original responses, notification/telemetry ordering |
| Feed counters and persisted value identity | Medium | Low | Retry concurrent writes, historical Mongo identity and unchanged JSON |
| Privacy and idea media purge | High | Low | Media deletion failure must prevent subsequent row removal |
| Read-only country/profile/event/asset contracts | Low | Low | Same reads and batching; local views are not remote DTOs |

Verification: **899 standard regression, boundary and serialization tests passed**
with no failures, errors or skips. This includes content, accounts, chat, events,
assets and integrations, plus explicit lifecycle guard and chat authorization
proofs. The dev watcher compiled successfully and the application container is
healthy. No new network hop or per-item read was introduced. Performance ratings
are estimates; E2E performance remains unmeasured. Master and frontend are unchanged.

Changed files for this checkpoint (repository-relative):

- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/AccountIdentity.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ActivityCounters.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/FeedCounts.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileModeration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfilePresentation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/document/Users.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/dto/AuthDtos.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/dto/FeedCountersRecord.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/security/firebase/dto/FirebasePrincipal.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/FeedCountsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetModerationDetails.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetModerationProjection.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetOwnership.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetModerationProjectionService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetOwnershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/ChatDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/ChatReview.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/SupportMessages.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatReviewService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/ContentPrivacy.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/ContentRegistration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/ContentStatistics.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/UserFeedback.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/api/UserReports.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/ContentModerationController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/LandingContentController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/PhotoFeedController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/dto/PhotoFeedDtos.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/mapper/PhotoFeedMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/repository/PhotoFeedRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/CommunityReportService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentPrivacyService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentStatisticsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/IdeaPostsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/PhotoFeedService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ShareTokensService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/UserFeedbackService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventModeration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventOwnership.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/FeedEvents.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventModerationService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventOwnershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/repository/AdminClientRepository.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/controller/AdminPaymentSimulatorController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/api/CountryDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/document/CountryPartition.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/CountryPartitionService.java`
- `server/projects/profile/src/main/resources/mongo-domain-types.properties`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/MongoConverterConfigTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatReviewServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/controller/ContentModerationControllerTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/AdminModerationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/ContentModerationServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/ModerationOwnershipTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/content/service/PhotoFeedServiceTest.java`


## #6 assets: ownership and collaboration checkpoint

Status: complete. Checkpoint subject: `[MSC-120] Isolate asset ownership and booking collaboration`.

The asset owner now publishes the existing `Assets` operations and `AssetOwnership`
read views. Foreign callers no longer import asset repositories, documents or
service implementations. The existing batch reads retain their original query
predicates, ordering and result scope. Read views remain local owner-managed
objects; they are not detached values or proof of HTTP deployability.

- Account/profile reads use `ProfileDirectory` and `WorkspaceProfile`; account
  counter refreshes use `ActivityCounters`.
- Asset participation is still owned by events. `AssetMemberships` now performs
  the existing manager promotion, duplicate-key handling and deletion. Promotion
  retains the same `_id` (or owner/type/user) and updated-date/role/status guards,
  creation metadata and precise set/unset fields. Asset authorization and the
  subsequent asset-request projection stay in their original order.
- `ParticipationTickets`, `TicketAudit`, `ResourceAssignments`, `AssetPayments`,
  `CheckoutResults` and `AttachmentLifecycle` expose existing implementations.
  No network hop, payment policy, ticket lifecycle or resource reassignment rule
  was added. The lazy resource-service lookup is retained.
- Borrow-window reads move to the event owner with the same ID/source-ID query.
  Chat asset reads, integration existence reads and job-target scope reads move
  to the asset owner without replacing the original predicates.
- Asset status projection uses the original optimistic update, including its
  matched-count result and unchanged caller snapshot. Asset privacy splits media
  deletion, record deletion and request cleanup into owner commands; the account
  coordinator keeps media/member/asset deletion order and resumable job IDs.
- The typed asset save listener emits through `AssetChanges`. The generic
  integration listener no longer emits asset saves, preventing duplicate delivery.
- Asset request, booking and policy records move unchanged to `AssetDetails`;
  explicit legacy nested Mongo aliases preserve stored identities. The asset
  catalog moves to the API package and its historical alias is updated. The
  nonpersisted payment-replacement result moves to payments DTOs.

| Changed boundary | Functional regression risk | Severe slowdown risk | E2E focus |
| --- | --- | --- | --- |
| Manager promotion and request projection | High: two existing guarded writes still have their original partial-success window | Low: same queries and writes | Concurrent promotion, revoke, ownership release/takeover, retry after conflict |
| Booking/resource/payment calls | High impact if sequencing changes | Low: existing implementations and batch calls retained | Paid/free booking, manager replacement, cancellation and inventory restoration |
| Ticket snapshot/check-in/replay | Medium | Low: same bulk holder lookup and check-in implementation | Multi-profile ticket list, check-in, duplicate scan and replay warning |
| Chat/webhook reads and typed save listener | Medium | Low: no added reads on save, batch chat lookup retained | Asset service chat and exactly one integration event per save |
| Status and account erasure commands | High impact if incorrect | Low: original write guards and deletion order | Suppression/restoration, retryable purge and retained request cleanup |
| Immutable value moves and stored aliases | Medium | Low: same record fields and serialized content | Reload existing requests, policies, booking and inventory flags |

Verification so far: the original 63 asset service tests pass. The broader run
executed 1,148 tests: 1,147 passed and the alias-resolution test found the moved
catalog's stale class mapping. That mapping was repaired; all **44 final serialization,
owner-command and two-sided boundary tests passed**, with no errors or skips. Added tests cover stale
promotion, duplicate creation, preserved creation metadata, the single asset save
producer and all three historical nested asset aliases. Remaining `assets` string
literals in foreign domains were inspected: they are telemetry/UI categories and
GitHub release JSON keys, not collection accesses; the guard records those exact
semantic method exceptions.

Dev hot-deploy compiled successfully and restarted a healthy application. No E2E
server or latency measurement has run for this checkpoint. Risk estimates are not
measured slowdown percentages.

Exact changed files for this checkpoint (repository-relative):

- `server/projects/profile/src/e2eTest/java/com/raxim/myscoutee/e2e/BackendChatMediaE2ETest.java`
- `server/projects/profile/src/e2eTest/java/com/raxim/myscoutee/e2e/BackendContentMediaE2ETest.java`
- `server/projects/profile/src/e2eTest/java/com/raxim/myscoutee/e2e/BackendEmailAccountSchedulersE2ETest.java`
- `server/projects/profile/src/e2eTest/java/com/raxim/myscoutee/e2e/BackendLifecycleE2ETest.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/ProfileDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/api/WorkspaceProfile.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetCatalog.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetOwnership.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/AssetPrivacy.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/api/Assets.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/document/Asset.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/document/AssetRequest.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/dto/AssetDetails.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/dto/AssetsDtos.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/mapper/AssetAvailabilityMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetAvailabilityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetCatalog.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetIntegrationChangeListener.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetOwnershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetPrivacyService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/api/AttachmentLifecycle.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatAttachmentLifecycleService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/AssetMemberships.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/EventOwnership.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/MemberDirectory.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/ParticipationTickets.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/ResourceAssignments.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/api/TicketAudit.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/document/EventTicket.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/mapper/ActivityEventSubEventsMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMembersService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesResourcesService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/AssetMembershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventOwnershipService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventParticipationTicketService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventTicketAuditService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventTicketService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/MemberDirectoryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/api/AssetChanges.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationResourceChangeListener.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationSyncService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationWebhookService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/McpEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/api/AssetPayments.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/api/CheckoutResults.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/dto/AssetPaymentReplacement.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/EventCheckoutBasketService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/JobGroupScopeService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/ModelStatusPropagationService.java`
- `server/projects/profile/src/main/resources/mongo-domain-types.properties`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/common/config/MongoConverterConfigTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/access/security/AccessControlServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/document/AssetBorrowCancellationRegressionTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/document/AssetBorrowRejectionPolicyTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/document/AssetBorrowWindowRegressionTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/mapper/AssetAvailabilityMapperTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/service/AssetBoundaryOwnershipTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/service/AssetTestSupport.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/assets/service/AssetsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/chat/service/ChatServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/events/service/ActivitiesMembersServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/groups/service/GroupTestSupport.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/IntegrationWebhookServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/integrations/service/McpEventsServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/payments/service/PaymentServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/platform/service/ModelStatusPropagationServiceTest.java`


## #21 registry: signed operations and durable evidence ownership

Status: complete. Checkpoint subject:
`[MSC-120] Isolate registry operations and signed enrollment evidence`.

`RegistryOperations`, `RegistryNetwork`, `RegistryTransport` and `RegistrySigner`
are the public capabilities. Existing bridges, HTTP client, private-key loader
and local store remain the implementations. No registry request, durable file,
Mongo collection, retry policy or enrollment rule is added.

- Operator services use contracts and domain-owned values instead of constructing
  registry HTTP clients or accessing the local store/key loader. Transport
  construction stays at the original call sites through the existing registry
  owner; this change adds no request or background process.
- The operator checks configured/enabled/registered/outbound gates first.
  Only then does `RegistryOperations.registeredEvidence` validate the endpoint,
  load keys and durable state, and run the original signed registration and
  installation-receipt checks in their original order. The operator supplies a
  value snapshot of its selected trust anchor and enrollment summary.
- Private keys remain in `RegistryCrypto`; the caller receives the existing
  local signing capability through `RegistrySigner`. Registered runtime values
  and configuration paths are in-process contracts, not serialized secrets or
  proof that this boundary can already run over HTTP.
- Public-key parsing/verification moves without algorithm changes to
  `RegistrySignatures`. Canonical `RegistryProtocol` and the VOPRF client move to
  the API package; a source comparison confirms their algorithms are unchanged.
  VOPRF private inputs and blinding remain local. The fixed-blind vector test
  moves alongside its package-private deterministic test entry point.
- Immutable state, archive, inspection, enrollment and network action values move
  to `registry/dto`, preserving fields and Jackson names. Explicit nested Mongo
  aliases preserve the historical registry root fallback identities. The
  nonpersisted registered-runtime value does not invent a historical Mongo alias.
- `RegistryProperties` and `RegistryDemoProperties` keep their configuration
  annotations and extend the public configuration values. Defaults, setters,
  validation, original property prefixes and separate REAL/DEMO paths are retained.
  Operator code still creates a separate per-request configuration snapshot.

| Changed boundary | Functional regression risk | Severe slowdown risk | E2E focus |
| --- | --- | --- | --- |
| Operator gate to signed enrollment evidence | High impact: trust and privacy boundary | Low: same validation, key/file reads and request construction | Missing/disabled/unregistered/outbound-disabled gates; wrong trust anchor; tampered/missing receipts |
| Registry HTTP operations and retry errors | Medium | Low: same client and per-call creation, no extra hop | MAU/revenue/presence retry and receipt verification; settlement reads and error classification |
| Local signing and public verification | High impact if canonical bytes differ | Low: unchanged cryptographic algorithms | Signature vectors, malformed keys/signatures, exact deployment identity |
| State and network value moves | Medium | Low: unchanged JSON fields and durable store | Reload, archive/restore, duplicate enrollment, claim/actions, leaderboard and announcements |
| Configuration binding and DEMO isolation | High impact if scopes or key paths cross | Low: same snapshots/defaults | Bound property values, REAL outbound policy, pinned demo endpoint and isolated files |

Evidence: **270 registry/operator, protocol, cryptographic, state, boundary and
serialization tests passed** with no errors or skips. A further **48 focused
tests passed**, including the added operator gate noninteraction proof and
Spring configuration binding/default/validation/isolation proof. The existing dev
watcher compiled and restarted the application successfully; container health is
healthy. All **15 final alias/serialization tests passed** after removing an unnecessary
alias for the nonpersisted runtime value. E2E application testing and latency measurements
remain pending; the tests do not establish separate-process deployment readiness.

Exact changed files for this checkpoint (repository-relative):

- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/controller/OperatorNetworkController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/document/GlobalIdentityLinkState.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/document/GlobalIdentityPresenceOutboxItem.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/document/QualifiedMauReportOutboxItem.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/document/RevenueReportOutboxItem.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/mapper/OperatorNetworkMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/mapper/OperatorRegistryMapper.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorGlobalIdentityPresenceReportService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorGlobalIdentityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorNetworkService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorQualifiedMauCalculator.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorQualifiedMauReportService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRegistryService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueRegistryRuntimeResolver.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueReportService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorSettlementService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorUpdateReleaseService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorUpdateService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/GlobalIdentityVoprfClient.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryCrypto.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryEnrollmentService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryHttpClient.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryLocalStore.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryNodeIdentityService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryOperatorNetworkOperations.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryOperatorNetworkService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryOperatorOperations.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryPreflightService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryProtocol.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryProtocolException.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/GlobalIdentityVoprfClient.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryConfiguration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryDemoConfiguration.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryHttpException.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryNetwork.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryOperations.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryProtocol.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryProtocolException.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistrySignatures.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistrySigner.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/api/RegistryTransport.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/config/RegistryDemoProperties.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/config/RegistryProperties.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/dto/NodeIdentity.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/dto/RegistryEnrollmentValues.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/dto/RegistryExpectation.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/dto/RegistryInspection.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/dto/RegistryNetworkValues.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/dto/RegistryRegisteredState.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/dto/RegistryState.java`
- `server/projects/profile/src/main/resources/mongo-domain-types.properties`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/DomainServiceBoundaryTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/mapper/OperatorRegistryMapperTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorGlobalIdentityPresenceReportServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorGlobalIdentityServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorGoRegistryRailQualificationTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorNetworkServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorQualifiedMauReportServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorRegistryServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueRegistryRuntimeResolverTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueReportServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorSettlementServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorUpdateReleaseServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/OperatorUpdateServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/operator/service/RegistryRuntimeTestSupport.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/GlobalIdentityVoprfClientTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryCryptoTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryEnrollmentServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryGoEndToEndTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryHttpClientTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryLocalStoreTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryNodeIdentityServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryOperatorNetworkServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryPreflightServiceTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryProtocolTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/RegistryTestIdentity.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/api/GlobalIdentityVoprfClientTest.java`
- `server/projects/profile/src/test/java/com/raxim/myscoutee/domain/registry/config/RegistryConfigurationBindingTest.java`


### #10 payments: owner-controlled checkout, accounting and cancellation

- `domain/payments/api/{EventPayments,CheckoutBaskets,CheckoutPricing,PaymentRefunds,
  PaymentMethods,CurrentPaymentProvider,PaymentProviders,PaymentSimulatorConfiguration,
  ExchangeRateConfiguration,Affiliates}.java` expose the existing implementations.
  Existing event, account, integration, operator and deployment callers use these
  contracts. Provider selection, checkout state transitions, refund provider calls,
  authorization checks and public response fields remain in their existing order.
- `domain/payments/api/PaymentView.java` is a **local read-only view**, not a detached
  transport payload. Event fulfillment and operator accounting read this view.
  `EventPayments.completeEventCancellation` accepts the locally owned snapshot;
  the payment owner performs the mutation. A future HTTP adapter must define a
  versioned command and detached transport values before replacing this call.
- `domain/payments/api/EventPaymentCancellations.java` and
  `domain/payments/service/EventPaymentCancellationService.java` take the existing
  payment queries, unordered enqueue bulk, version increments, changed-terms
  eligibility predicate and cancellation acknowledgement guard out of
  `domain/events/service/EventCancellationService.java`. Event membership,
  notification and event completion operations retain their original order.
- `domain/payments/api/PaymentRevenue.java` and its owner service keep the existing
  narrow repository candidate query used by `OperatorRevenueService`.
- `domain/accounts/api/PaymentTotals.java` and `AccountPaymentTotalsService`
  own the existing atomic spending/income/all-total increments, receipt reversal
  marker, pending-refund counter guards and summary-currency read/write.
  `ProfileDirectory{,Service}` gains the original account queries used by
  checkout, refunds, affiliate attribution and the payment simulator.
- `domain/events/api/{EventOwnership,MemberDirectory,EventCheckout,
  CheckoutMemberships}.java` expose the existing pricing facts, VIP offer
  eligibility, event fulfillment and expired-reservation commands. Existing
  event implementations provide them; payment code no longer accesses event
  or membership repositories. Collection-valued views remain local read-only
  views and are not claimed to be remotely serializable contracts.
- `domain/platform/api/DeploymentSettings.java` and its owner service expose
  existing payment configuration values. The original configuration document
  implements the read-only view. `PaymentCredentialPurpose` owns the same pure
  encryption-purpose computation used by both configuration and payments.
- `domain/integrations/api/ParticipantStatistics.java` and its owner service
  execute the original participant-invite aggregation, including unique-person
  counting and claimed-user eligibility. Affiliate results retain their shape.
- `domain/payments/dto/AffiliateRegistration.java` moves the immutable attribution
  value out of persistence implementation packages. Accounts can embed that
  value. Payment-owned Mongo operations name the original collection explicitly;
  `mongo-domain-types.properties` retains the historical discriminator. Reload
  verification covers root values and embedded records without `_class`.
- `PaymentPrivacy{,Service}` preserves account purge's exact payer-only deletion
  query and its place in the purge sequence. `AffiliateIndexInitializer` owns
  the same two affiliate indexes for the existing real/demo database factories.
- `PaymentProviderResponse` marks exactly the existing event and payment
  controllers for the existing response advice. The provider response header
  keeps its previous value and availability condition.
- `common/mongo/OwnerScopedQuery.java`, `accounts/api/AccountJobScopes.java`,
  `accounts/service/AccountJobScopeService.java` and
  `payments/service/PaymentJobQueries.java` replace payment jobs' foreign `users`
  lookup with a sorted candidate cursor and account-owned projected selection
  in batches of at most 1,000 candidates. Scope filtering still precedes skip
  and limit. Missing owners remain excluded; duplicate owner rows retain the
  previous any-match (`$in`) / no-match (`$nin`) semantics. Cursors close on early
  limit, exhaustion and failure. Payment tasks preserve their original result
  batch sizes (20/100), query predicates and subsequent update/version guards.
  The database query plan changes: each candidate batch adds one projected
  owner query, and unrelated-workspace candidates may be scanned. Concurrent
  owner reassignment can be observed between batches instead of within a single
  join operation. No transaction or snapshot consistency was added.

| Area | Functional regression risk | Severe slowdown risk | E2E focus |
| --- | --- | --- | --- |
| Payment/refund/receipt accounting | High | Low; same atomic writes and provider calls | Retry, duplicate callback, partial refund, two-party receipt reversal, account totals |
| Event cancellation and changed paid terms | High | Low; original payment predicates, guarded bulk and 20-payment batch | Interrupted cancellation, pending refund, membership removal, late payment, notification deduplication |
| Scoped payment jobs | Medium; account-scope observation is now batched | Medium to high for a large unrelated-workspace backlog; no measured percentage claimed | Default/private scopes, backlog skew, concurrent workspace reassignment, cursor closure, throughput |
| Checkout pricing and reservations | Medium | Low; original owner queries and pricing algorithm | VIP offer, optional slots, capacity, expired basket, saved card |
| Affiliate attribution, configuration and privacy | Medium | Low; same queries, immutable value and indexes | Legacy profile reload, provider credentials, participant counts, payer purge |

Verification status and checkpoint commit are recorded in the numbered table.
No E2E performance result is claimed by the local checks.

Payment checkpoint evidence: the running dev watcher compiled successfully and
restarted the application; Docker health is healthy. The expanded regression
run passed 1,109 tests and exposed two fixture-wiring failures in the purge test.
After wiring the real payment privacy owner, all 178 focused tests passed,
including embedded Mongo parity, cancellation guards and attribution reload.
The final expanded collection-boundary and response-header checks passed all
31 tests. Integration/E2E and performance measurements remain separate work.


### #11 integrations: owner-controlled authorization, invitations and publication

- `domain/integrations/dto/IntegrationAccess.java` is the existing immutable,
  revisioned access value, moved from the document package. Accounts retains
  ownership of its embedded storage. The historical Mongo alias is retained.
  `accounts/api/AccountIntegrationAccess.java` and its service execute the
  original `UsersRepository.updateIntegrationAccess` revision guard.
- `accounts/api/{ProfileDirectory,WorkspaceProfile,AccountIdentity,
  ProfileAuthentication}.java` and their existing/new owner implementations
  expose stored account lookup, activity counters and authenticated profile
  creation/rebinding. `ProfileAuthenticationService` reuses `FirebasePrincipal`
  and `FirebaseAuthenticationToken.forProfile`; authentication attributes,
  authority checks, binding rejection and context restoration remain unchanged.
  Integration filters/services use account contracts and the existing
  `AccountWorkspaces` and `SelectedProfile` operations.
- `integrations/api/IntegrationClientIdentity.java` is implemented by the
  existing verified integration details record. The Firebase filter uses this
  public contract while retaining its integration authority and URL guards.
  No token expiry, grant revocation, IP validation or OAuth checks are moved or
  bypassed. Common security composition still wires the actual integration
  filters; this is application bootstrap, not business-domain data access.
- `events/api/{EventOperations,EventOwnership,PartnerInvitationAdmission,
  MingleEncounters}.java` and owner services expose the existing event queries,
  admission workflow, completed-round/session reads, pending-publication read
  and guarded acknowledgement. `IntegrationEventQueryService`,
  `IntegrationParticipantInviteService`, `IntegrationSyncService` and
  `IntegrationEncounterPublisher` retain their existing validations and public
  results. Event/session/round/table views are **local read-only views**, not
  detached HTTP contracts. Admission consumes the owner-issued event snapshot.
- `events/service/EventIntegrationChangeListener.java` replaces the former
  integration-owned listener. It sends each saved event/member once through
  `integrations/api/EventChanges.java`; assets retain their separate existing
  producer. Webhook payload fields and owner deduplication remain unchanged.
- `chat/api/ChatQueries.java` exposes existing chat page/message readers.
  `ChatDirectory{,Service}.unreadVersion` owns the original projected, sorted
  single-chat query used by `integrations/repository/AdminClientRepository`.
- `operator/api/{MeasurementReports,RevenueReports}.java` expose existing
  bounded operator report readers. Integration role authorization stays before
  those calls. `platform/api/DeploymentSettings.java` adds the existing
  integration endpoint read-only value; its validation/fallback is unchanged.
- `integrations/service/IntegrationWebhookService.java` uses the common
  `OwnerScopedQuery` and account-owned workspace selection from checkpoint #10.
  The existing due criteria, sort, batch limit, claim guard, worker semaphore,
  HTTP timeout and retry schedule are unchanged. Account filtering precedes
  limit; owner reads are batched, and the same cross-batch scope observation
  and backlog-scan risks documented for payment jobs apply here.
- `IntegrationPrivacy{,Service}` owns the existing invitation/subscription/
  delivery/external-ID purge operations in their original order.
  `ParticipantIntegrationIndexInitializer` owns the same participant and
  external-ID indexes, including unique keys, in both existing databases.
  The events initializer retains Mingle indexes.

| Area | Functional regression risk | Severe slowdown risk | E2E focus |
| --- | --- | --- | --- |
| API/OAuth profile binding and access revisions | High | Low; same repository reads and guarded write | Revoked/expired grant, blocked mode, workspace profile, cross-account invite, revision conflict |
| Event invite admission and public participant results | High | Low; same owner lookups, batching and pair construction | Reusable link, bound token retry, completed Mingle, private workspace, no internal-ID disclosure |
| Encounter publication and save listeners | Medium | Low; same batch/read/update counts | Failed enqueue retries, stale session revision, deleted event, one notification producer |
| Scoped webhook claiming | Medium | Medium to high under unrelated-workspace backlog; unmeasured | Claim race, workspace skew, scope reassignment, semaphore saturation, retry and timeout |
| Embedded access reload, index and purge ownership | Medium | Low; unchanged persisted shape and queries | Legacy profile reload, unique participant mapping, deleted account cleanup |

Integration checkpoint verification and commit are recorded in the numbered
inventory. These local checks do not claim E2E throughput or detached-domain
HTTP readiness.

Verification: 794 tests passed in the expanded regression run; three isolated
security bootstrap fixtures were repaired to register the existing account
authentication owner. The final 167 focused integration, security, owner-event,
serialization and boundary tests passed with no failures or skips. The existing
dev watcher compiled and restarted successfully, and the application is healthy.

### #5 chat: account writes and event context through their owners

- `domain/chat/api/EventConversations.java`: the existing `ChatService` provides
  event rooms, publication results, owner status changes and system messages.
  Event callers use this contract and the existing `AttachmentLifecycle` contract.
- `domain/accounts/api/AccountDevices.java`, `ChatCounters.java` and their
  services: device registration/deletion and single/bulk unread-counter writes
  move to accounts. Original matching, device timestamps, account save behavior,
  `$inc` fields, signs and unordered bulk execution are preserved.
- `ProfileDirectory` retains batched profile lookup and now owns saved-contact
  lookup and the existing count/sorted-page queries. `ProfilePresentation`,
  `SelectedProfile`, `ActivityCounters` and `AccountIdentity` replace concrete
  account services/principals in chat, its mappers, push delivery and sockets.
- `MemberDirectory` owns membership count/paging. `EventOwnership` owns the
  existing projected event navigation lookup and sub-event presentation.
  `EventResourceDirectory` owns batched resource/runtime reads; its read-only
  local views are not detached transport representations. Existing storage
  classes and nested record identities remain unchanged.
- `domain/chat/service/ChatPrivacyService.java`: the original account-purge chat
  implementation moves intact into chat, including 100-message pages, attachment
  deletion, authorship/read/reaction/poll/reply/pin scrubbing and summary refresh.
  Account purge invokes it at the original point in the sequence.
- `ContactPermissions` / `ContactPermissionService`: private-contact consent is
  stored by chat, using the existing pair key and optimistic version guard.
  Accounts retains actor eligibility, contact saving, counters and notifications.
- `ChatReview` owns reportability evidence; `ChatDirectory` owns support-case
  aggregation, preserving chat-id deduplication and base-group filtering.
- `DomainServiceBoundaryTest` covers incoming/outgoing chat dependencies and raw
  collection references. Two exact method-level exceptions are semantic telemetry
  and integration capability labels, not database access.

Functional risk: **medium**, concentrated in unread-counter deltas, chat member
paging, support-case counters, contact approval version conflicts and account
purge. WebSocket identity still uses the account-issued principal through its
interface. Public chat DTOs, URLs, collection names and persisted shapes stay the
same. No new network hop or per-member query is introduced; previous query
batching and projections are retained. Severe slowdown risk: **low** for these
moves, with chat member/header reads and purge batches retained as E2E targets.
No measured E2E latency claim is made by local tests.

Verification so far: 653 regression tests passed across chat, accounts, events
and Mongo aliases; the sole failure was an integration capability label caught
by the collection-name guard. A focused final run checks its narrowly scoped
exception. The embedded persistence test verifies counter writes/readback,
workspace filtering, chat-copy deduplication and rejection of a stale consent
approval. The earlier focused run also exercised account purge and reportability
through the real owner adapters over the original repository fixtures.

Final verification: all 98 focused chat, embedded persistence, Mongo alias and
architecture checks passed with no failures or skips. The existing dev watcher
compiled successfully and the application health check is healthy.

### #4 events: persistence ownership, feedback projection and scoped jobs

- `EventOwnership`, `MemberDirectory`, `ParticipationTickets`, `FeedbackDirectory`
  and `EventWatchDirectory`: account presentation/counters, following, operator
  revenue and platform status propagation read event-owned facts through contracts.
  The existing repository queries, projections, ordering and batching are retained.
  Event and nested sub-event values are read-only local views, not HTTP-ready copies.
- `EventFeedbackEligibilityService`: eligibility-state creation/updates and event
  projection markers move from accounts into events. Accounts receives explicit
  bucket deltas; eligibility save, account counter application and completion
  marker updates remain in the original order, including the failure boundary.
  Legacy submitted/removed states, unlock delay, canonical-event preference and
  generated-event filtering retain their existing rules.
- `EventPrivacyService`: owned event/media deletion, event/asset memberships,
  managed-admin references, resource cleanup, ticket audit anonymization,
  feedback/leaderboard deletion and scheduler authorship cleanup move to events.
  Account purge preserves its durable stages and operation ordering.
- `EventOwnershipService.updateStatusIfSnapshotCurrent`: the original id plus
  optional updated-date guard and status-before-suppression write stay together
  in the event owner. Platform retains status decisions and notification order.
- `EventJobQueries`: the original event-owned `$lookup` query moves from platform
  into events. Workspace membership is provided by `JobAudience`; filtering still
  precedes sort/skip/limit. Unlike a foreign-domain join, both persisted sides of
  this query belong to events. No extra query or network hop is added.
- `SchedulerPlanMarker` and its repository move from platform to events; the
  original persisted alias is updated in `mongo-domain-types.properties`.
  `EventFriendshipIndexInitializer` now owns the existing due-projection index in
  both session databases; account friendship indexes retain their original owner.
- `ProfileDirectory`, `ContactDirectory`, `ProfilePresentation`, `ActivityCounters`
  and `FollowingEvents` replace event-side account repository/service dependencies.
  Contact candidate fallback identifiers remain distinct from chat eligibility.
  `AccountEventCounterUpdateService` owns expiry counter construction, equality
  checks and the original changed-profile bulk save; events supplies calculated
  invitation/event/hosting counts through an explicit command.
- `DomainServiceBoundaryTest` now checks events in both directions, including its
  collection names. Exact semantic-label exceptions cover existing telemetry,
  UI buckets, navigation contexts and MCP catalog keys only.

Functional risk: **medium/high**, focused on feedback eligibility/counter ordering,
expiry projections, suppression/restoration and account purge. These paths need
E2E attention despite the successful local regression. Public endpoints, event
DTOs, collection names, status values and optimistic conditions are preserved.
Severe slowdown risk: **low** for the owner-interface moves: the event-owned job
join, sorted paging and batched profile/member reads retain their query shapes.
No new per-event profile lookup is introduced. E2E latency is not yet measured.

Verification: all **566 regression tests** passed across events, accounts, status
propagation, operator revenue and encounter publication. All **59 final focused
checks** passed, including the expanded architecture guard, Mongo aliases,
security bootstrap and embedded Mongo parity. Embedded checks cover mixed
workspace event projections, absent owners, filtering before skip/limit and a
stale status snapshot that must not overwrite a concurrent event update. The dev
watcher compiled successfully and restarted the application in 7.86 seconds;
this startup duration is diagnostic evidence, not a throughput benchmark.

## #1 Accounts — completed boundary

- `accounts/api/AccountIdentity`, `ProfileAuthentication`, `BootstrapAccounts`,
  `BootstrapLoginAudit` and their existing account services now own principal,
  Firebase credential checks, bootstrap account loading/token construction and
  login audit. Media, access, help, groups, notifications and operator consume
  these contracts. The original authentication predicates, authorities and
  audit ordering remain in place; no new public authentication endpoint exists.
- `AccountConsents.latest` supplies the existing immutable consent snapshot to
  global identity preparation. Required acceptance/revision checks and the
  consent commitment inputs remain identical. Operator network and platform
  status propagation consume read-only `WorkspaceProfile` values.
- `AccountJobQueries` builds account-owned workspace criteria from `JobAudience`.
  Platform audience resolution uses account-owned profile queries with the
  original predicates and batching. The unused platform foreign-user join was
  removed; the embedded scheduling test now invokes the payment owner's actual
  replacement and retains its before-limit assertions.
- Account purge calls `operator/api/GlobalIdentityPrivacy`; scheduling, country,
  administrator settings and Firebase runtime dependencies use their owner APIs.
  `OperatorBootstrapRequestSupport` is the shared operator API protocol helper;
  its historical type alias is retained after relocation.
- **Functional risk: high** at bootstrap/media authorization and account purge
  boundaries; medium at consent and scoped scheduling. **Severe slowdown risk:
  low** for this checkpoint: no extra request, query-per-user loop or HTTP hop.
- Verification: **425 standard/embedded tests passed, zero failures/skips**,
  including account/operator/platform/media security, WebSecurity bootstrap,
  Mongo aliases, the 19-domain boundary guard and embedded scheduling. Missing
  owner beans and a repository-mock assertion were repaired in test fixtures;
  product behavior was not relaxed to accommodate them. The existing dev
  watcher compiled and restarted successfully. Full HTTP E2E is unproven.
- User scheduling decision: E2E and speed measurements are deferred to the next
  session. Keep dev running now; stop the dev application before any E2E server
  is started in that later session.

## #16 Operator — completed boundary

- `operator/controller/OperatorConfigurationController` now consumes
  `platform/api/DeploymentConfigurationManagement`. It retains the same routes,
  operator authorization, DTOs, validation and response behavior.
- The existing `OperatorConfigurationService`, `OperatorConfigurationMapper`
  and `OperatorConfigurationProperties` move into platform beside the deployment
  document/repository, encryption and Firebase runtime they already manage.
  Their algorithms are unchanged: per-database locks, optimistic save failures,
  secret purposes/envelopes, test-before-activation revision checks, cache
  eviction, administrator updates and runtime refresh ordering remain together.
  The `operator.configuration` binding prefix and master-key path are unchanged.
- Configuration service/mapper tests follow their actual owner. Existing
  controller, crypto, Firebase runtime, payment credential and email unsubscribe
  tests continue to exercise the same behavior. The boundary guard now covers
  incoming/outgoing contracts and raw collection ownership for 20 domains.
- **Functional risk: medium**, concentrated on configuration bean wiring and
  Firebase activation. **Severe slowdown risk: low**: the same service instance,
  locks, Mongo operations and capability checks run behind the interface.
- Verification: **241 focused standard/embedded tests passed, zero failures/skips**.
  The running dev watcher compiled and restarted successfully. No external
  configuration was submitted. HTTP E2E remains deferred by user instruction.

## #17 Platform — implementation and local verification

- `platform/api/RuntimeConfiguration` exposes the existing runtime policy as a
  read-only interface. `platform/config/ConfigProperties` remains the single
  configuration-bound owner with the unchanged `config` prefix, defaults and
  Firebase activation flag. Twenty consumer classes now name the interface;
  configuration binding and platform activation retain mutation rights.
- `platform/api/JobGroupContext` is the existing in-process execution context,
  relocated unchanged. Nested scope restoration, per-scope memoization and
  cleanup after exceptions have a focused regression test. It is a local
  runtime contract, not a distributed context transport.
- `platform/service/JobGroupScopeService` now resolves ownership exclusively
  through account, group, asset, event and affinity APIs. Its unused Mongo
  constructor and obsolete foreign-query helper are removed. Workspace scope
  values retain inclusion/exclusion and default-group semantics; the owning
  domains construct their own queries.
- `DomainServiceBoundaryTest` covers **all 21 domains in both directions**:
  foreign types must be under the owning domain's root `api` or `dto` package.
  There are **no foreign implementation exceptions**. The raw collection guard
  keeps narrowly enumerated telemetry/UI label exceptions; these are not
  persistence exceptions. `DomainRepositoryOwnershipTest` also checks that each
  Mongo repository and authoritative document have the same domain owner.
- **Functional risk: medium/high** at runtime authorization and workspace job
  boundaries. **Severe slowdown risk: low** for this checkpoint: the original
  singleton policies and per-job memoization are retained, with no added I/O.
- Focused evidence: **273 standard/embedded tests passed, zero failures/skips**,
  covering platform/operator/account security, configuration/crypto/activation,
  WebSecurity bootstrap, aliases, ownership and all 42 directional boundary
  checks. The complete local suite is recorded in the closeout below.
- Existing dev hot-deploy compiled and restarted successfully. Read-only HTTP
  checks returned **200** from `/deployment/configuration` and **204** from the
  inactive `/deployment/configuration/firebase-config` endpoint. The configured
  container TCP health check also passes. `/actuator/health` is not exposed by
  this deployment; it is not used as health evidence.

### Final three checkpoints: exact production file inventory

Paths below are relative to `server/projects/profile/src/main/`. The functional
and slowdown risks above apply to their respective checkpoint; consumer import
changes do not introduce a second implementation. Tests and documentation are
also available in each named commit's complete diff.

#1 accounts:

- `java/com/raxim/myscoutee/common/config/WebSecurityConfig.java`
- `java/com/raxim/myscoutee/common/config/mongo/SessionMongoRoutingFilter.java`
- `java/com/raxim/myscoutee/domain/access/security/AccessControlService.java`
- `java/com/raxim/myscoutee/domain/access/security/ChatPolicyFacts.java`
- `java/com/raxim/myscoutee/domain/accounts/api/AccountConsents.java`
- `java/com/raxim/myscoutee/domain/accounts/api/AccountIdentity.java`
- `java/com/raxim/myscoutee/domain/accounts/api/BootstrapAccounts.java`
- `java/com/raxim/myscoutee/domain/accounts/api/BootstrapLoginAudit.java`
- `java/com/raxim/myscoutee/domain/accounts/api/ProfileAuthentication.java`
- `java/com/raxim/myscoutee/domain/accounts/security/firebase/DefaultFirebaseTokenVerifier.java`
- `java/com/raxim/myscoutee/domain/accounts/security/firebase/FirebaseFilter.java`
- `java/com/raxim/myscoutee/domain/accounts/security/firebase/FirebaseService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/AccountConsentService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/AccountJobQueries.java`
- `java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorker.java`
- `java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/OrganizerFollowingService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/ProfileAuthenticationService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/UserLoginSessionService.java`
- `java/com/raxim/myscoutee/domain/groups/api/WorkspaceContext.java`
- `java/com/raxim/myscoutee/domain/help/service/HelpCenterService.java`
- `java/com/raxim/myscoutee/domain/media/service/MediaSessionAccessService.java`
- `java/com/raxim/myscoutee/domain/notifications/service/DefaultFirebaseMessagingGateway.java`
- `java/com/raxim/myscoutee/domain/notifications/websocket/AdminNotificationWebSocketHandler.java`
- `java/com/raxim/myscoutee/domain/operator/api/GlobalIdentityPrivacy.java`
- `java/com/raxim/myscoutee/domain/operator/api/OperatorBootstrapRequestSupport.java`
- `java/com/raxim/myscoutee/domain/operator/controller/OperatorBootstrapController.java`
- `java/com/raxim/myscoutee/domain/operator/controller/OperatorNetworkController.java`
- `java/com/raxim/myscoutee/domain/operator/controller/OperatorRegistryController.java`
- `java/com/raxim/myscoutee/domain/operator/controller/OperatorTlsController.java`
- `java/com/raxim/myscoutee/domain/operator/controller/OperatorUpdateController.java`
- `java/com/raxim/myscoutee/domain/operator/security/bootstrap/OperatorBootstrapAuthenticationFilter.java`
- `java/com/raxim/myscoutee/domain/operator/security/bootstrap/OperatorBootstrapAuthenticationService.java`
- `java/com/raxim/myscoutee/domain/operator/security/bootstrap/OperatorBootstrapRequestSupport.java`
- `java/com/raxim/myscoutee/domain/operator/service/OperatorGlobalIdentityService.java`
- `java/com/raxim/myscoutee/domain/operator/service/OperatorNetworkService.java`
- `java/com/raxim/myscoutee/domain/platform/api/CountryDirectory.java`
- `java/com/raxim/myscoutee/domain/platform/api/FirebaseRuntime.java`
- `java/com/raxim/myscoutee/domain/platform/service/DeploymentFirebaseRuntime.java`
- `java/com/raxim/myscoutee/domain/platform/service/JobGroupScopeService.java`
- `java/com/raxim/myscoutee/domain/platform/service/ModelStatusPropagationService.java`
- `resources/mongo-domain-types.properties`

#16 operator:

- `java/com/raxim/myscoutee/common/config/AppConfig.java`
- `java/com/raxim/myscoutee/domain/operator/config/OperatorConfigurationProperties.java`
- `java/com/raxim/myscoutee/domain/operator/controller/OperatorConfigurationController.java`
- `java/com/raxim/myscoutee/domain/operator/mapper/OperatorConfigurationMapper.java`
- `java/com/raxim/myscoutee/domain/operator/service/OperatorConfigurationService.java`
- `java/com/raxim/myscoutee/domain/platform/api/DeploymentConfigurationManagement.java`
- `java/com/raxim/myscoutee/domain/platform/config/OperatorConfigurationProperties.java`
- `java/com/raxim/myscoutee/domain/platform/controller/DeploymentConfigurationController.java`
- `java/com/raxim/myscoutee/domain/platform/mapper/OperatorConfigurationMapper.java`
- `java/com/raxim/myscoutee/domain/platform/service/DeploymentConfigurationCrypto.java`
- `java/com/raxim/myscoutee/domain/platform/service/DeploymentFirebaseRuntime.java`
- `java/com/raxim/myscoutee/domain/platform/service/OperatorConfigurationService.java`

#17 platform (including the old location of relocated classes):

- `java/com/raxim/myscoutee/domain/access/security/AccessControlService.java`
- `java/com/raxim/myscoutee/domain/accounts/config/FirebaseConfig.java`
- `java/com/raxim/myscoutee/domain/accounts/security/firebase/FirebaseFilter.java`
- `java/com/raxim/myscoutee/domain/accounts/security/firebase/FirebaseService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/AccountAffinityProjectionService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/AdminProfileCounterService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorker.java`
- `java/com/raxim/myscoutee/domain/accounts/service/FacebookDataDeletionService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java`
- `java/com/raxim/myscoutee/domain/accounts/service/OrganizerFollowingService.java`
- `java/com/raxim/myscoutee/domain/administration/service/AdminMenuCounterService.java`
- `java/com/raxim/myscoutee/domain/administration/service/AdminMonitoringService.java`
- `java/com/raxim/myscoutee/domain/administration/service/AdminStatsService.java`
- `java/com/raxim/myscoutee/domain/administration/service/AdminStatsTelemetryWorkerService.java`
- `java/com/raxim/myscoutee/domain/administration/service/AdminTelemetryService.java`
- `java/com/raxim/myscoutee/domain/affinity/service/AdminAffinityGraphService.java`
- `java/com/raxim/myscoutee/domain/affinity/service/AffinityMaintenanceService.java`
- `java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeChangeStreamService.java`
- `java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeMetricsService.java`
- `java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskService.java`
- `java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeWorkerService.java`
- `java/com/raxim/myscoutee/domain/chat/websocket/ChatWebSocketHandler.java`
- `java/com/raxim/myscoutee/domain/community/service/CommunityAnnouncementsService.java`
- `java/com/raxim/myscoutee/domain/community/service/CommunityCasesService.java`
- `java/com/raxim/myscoutee/domain/community/service/CommunityScheduledTasksService.java`
- `java/com/raxim/myscoutee/domain/community/service/ServiceFeedbackService.java`
- `java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java`
- `java/com/raxim/myscoutee/domain/content/service/ContentModerationService.java`
- `java/com/raxim/myscoutee/domain/content/service/IdeaPostsService.java`
- `java/com/raxim/myscoutee/domain/email/repository/EmailCampaignRulesRepository.java`
- `java/com/raxim/myscoutee/domain/email/repository/EmailTemplatesRepository.java`
- `java/com/raxim/myscoutee/domain/email/service/PromotionalEmailDeliveryProcessor.java`
- `java/com/raxim/myscoutee/domain/email/service/PromotionalEmailPlannerService.java`
- `java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskService.java`
- `java/com/raxim/myscoutee/domain/events/service/ActivitiesMembersService.java`
- `java/com/raxim/myscoutee/domain/events/service/EventCounterExpiryService.java`
- `java/com/raxim/myscoutee/domain/events/service/EventFriendshipProjectionService.java`
- `java/com/raxim/myscoutee/domain/events/service/EventScheduler.java`
- `java/com/raxim/myscoutee/domain/help/service/HelpCenterService.java`
- `java/com/raxim/myscoutee/domain/integrations/service/IntegrationRoleAccessService.java`
- `java/com/raxim/myscoutee/domain/integrations/service/IntegrationWebhookService.java`
- `java/com/raxim/myscoutee/domain/integrations/service/McpAuthorizationService.java`
- `java/com/raxim/myscoutee/domain/notifications/repository/NotificationTemplatesRepository.java`
- `java/com/raxim/myscoutee/domain/notifications/service/AdminNotificationService.java`
- `java/com/raxim/myscoutee/domain/notifications/service/AdminNotificationSocketSessionRegistry.java`
- `java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxService.java`
- `java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxWorkerService.java`
- `java/com/raxim/myscoutee/domain/notifications/service/NotificationRuleRegistryService.java`
- `java/com/raxim/myscoutee/domain/notifications/service/RoleNotificationService.java`
- `java/com/raxim/myscoutee/domain/notifications/websocket/AdminNotificationWebSocketHandler.java`
- `java/com/raxim/myscoutee/domain/operator/controller/OperatorBootstrapController.java`
- `java/com/raxim/myscoutee/domain/operator/security/bootstrap/OperatorBootstrapAuthenticationFilter.java`
- `java/com/raxim/myscoutee/domain/operator/security/bootstrap/OperatorBootstrapAuthenticationService.java`
- `java/com/raxim/myscoutee/domain/operator/security/bootstrap/OperatorBootstrapTransportSecurity.java`
- `java/com/raxim/myscoutee/domain/payments/service/EventCheckoutBasketService.java`
- `java/com/raxim/myscoutee/domain/payments/service/ExchangeRateStore.java`
- `java/com/raxim/myscoutee/domain/payments/service/PaymentEuroService.java`
- `java/com/raxim/myscoutee/domain/platform/api/JobGroupContext.java`
- `java/com/raxim/myscoutee/domain/platform/api/RuntimeConfiguration.java`
- `java/com/raxim/myscoutee/domain/platform/config/ConfigProperties.java`
- `java/com/raxim/myscoutee/domain/platform/service/JobGroupContext.java`
- `java/com/raxim/myscoutee/domain/platform/service/JobGroupScopeService.java`
- `java/com/raxim/myscoutee/domain/platform/service/PlatformParametersService.java`

## Final local closeout — 2026-10-07

All **21 domains** have an individual `[MSC-120]` checkpoint commit on
`refactor/MSC-120-backend-domain-segregation`. No cross-domain commit has been
merged into master. Master and `origin/master` remain at
`752ba4d15cb7fdd0ec958c2169e552047a77ea78`; the frontend submodule remains unchanged.

| Evidence | Result |
| --- | --- |
| Final full standard/embedded JUnit suite | **1,731 passed; 0 failures, 0 errors, 0 skipped** |
| Final platform/security/architecture focused suite | **273 passed; 0 failures or skips** |
| Domain guard | All **42** incoming/outgoing checks pass across **21** domains; no foreign implementation exceptions |
| Source review | **0** foreign domain implementation references; root `api`/`dto` contracts only |
| Repository and legacy Mongo type checks | Passed in the full local suite |
| E2E/dev test source compilation | Passed; tests **not executed** |
| Dev runtime | Existing watcher build/restart successful; container healthy; public configuration HTTP 200, inactive Firebase config HTTP 204 |
| E2E journeys and latency/throughput comparison | **Not run; deferred by user instruction** |

The first complete run exposed 31 failures in four test classes sharing an
outdated `GroupTestSupport` fixture. The helper now wires the real account and
event owner adapters to the existing mock Mongo fixtures. No product predicate
or expectation was relaxed. The repeated full suite passed. Compiling the
separate `e2eTest` source set then caught an outdated scheduler-marker import
and the dev media qualification test's old profile-repository constructor;
both were updated without executing either live-server suite.

Reproducible local verification (JDK 25, isolated output, serial worker):

```sh
JAVA_HOME=/home/raxim/.local/share/myscoutee-domain-tests/jdk-25   tools/run-backend-junit.sh local :projects:profile:compileE2eTestJava
```

Private execution logs are retained locally under
`/home/raxim/.local/state/myscoutee-domain-segregation/`: `accounts-tests.log`,
`operator-tests.log`, `platform-tests.log`, `final-local-tests.log` and
`final-e2e-compilation.log`. The latter confirms the final source compilation;
its local test task is up-to-date after the successful 1,731-test run.

### Remaining verification and highest-risk E2E targets

There is no remaining domain implementation in this 21-domain scope. The next
session should verify real HTTP journeys and performance; a master merge remains
subject to the user's later review. Dev is intentionally left running now.
**Stop the dev application before starting the E2E application.** Use disposable
E2E data and the same representative fixtures for any baseline/branch comparison.

| Priority | Boundary | Functional risk | Severe slowdown risk / reason | Required E2E evidence |
| ---: | --- | --- | --- | --- |
| 1 | Payment/integration owner-scoped jobs | High: scope, pagination and retry correctness | Medium/high for skewed backlogs: the foreign join becomes owner lookups in batches of up to 1,000 candidates | Mixed workspaces, large unrelated backlog, limit/offset, cursor release and throughput versus the pinned baseline |
| 2 | Account purge and payment cancellation/refunds | High: durable ordering, privacy and money | Low/medium; retain existing batches and guarded writes | Interrupted/repeated purge, interrupted cancellation, duplicate provider receipts, refund counters and redaction |
| 3 | Authentication, bootstrap and media sessions | High: authorization and realm isolation | Low: same local owner and credential checks | Real/demo separation, bootstrap restrictions, active sessions, media token issue/revoke and access denial |
| 4 | Event feedback, memberships and chat counters | High: ownership and derived-state consistency | Low/medium: retained batch reads and atomic/bulk writes | Repeated feedback, publication/member changes, stale snapshot rejection, chat consent and reload-visible counters |
| 5 | Deployment configuration and Firebase activation | Medium/high: protected config and capability activation | Low: unchanged locks, encryption, revision checks and cache behavior | Operator authorization, failed save/test, activation and refresh/reload |

These are engineering risk estimates, not measured percentages. Local read-only
views and infrastructure interfaces intentionally remain in-process contracts;
future OpenAPI adapters still need detached transport schemas and distributed
execution/error semantics. Independent microservice deployment is not claimed.
