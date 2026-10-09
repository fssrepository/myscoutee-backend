# Database polling audit — 2026-10-09

## 1. Scope and evidence

This is a source audit of canonical backend scheduling and its existing service
owners, followed by the affinity/communication runtime checks in [PROGRESS.md](PROGRESS.md).
It is not a per-query CPU profile or a claim that every business scan runs on
every tick. Cadences below are Java defaults; deployed properties and persisted
job schedules can change effective timing. Row IDs are stable follow-up handles.
No worker in this inventory has been disabled merely because it polls.

The local KVM maps normal sessions to `msc121_real` and demo sessions to
`msc121_demo`; both live inside the same Mongo replica set. The established
seed owner maps `myscoutee_db` and `demo_db` seed directories to those lab names.
Dev Compose instead maps both session modes to its demo database. This audit
changes neither routing, fixture lifetime nor wipe behavior. A replica member
is a copy of **both** databases, not a separate REAL or DEMO pod.

## 2. Original scheduled paths (baseline before section 6 changes)

`NotificationJobs.forEachGroup` first asks the communication owner for configured
groups. `findRule`, due checks and admission then query `notificationRuleConfigs`.
Consequently a remote rule call can cause Mongo reads even when the caller's own
business collection is empty. Several workers repeat these calls for each
workspace and each configured database. Disabled business execution does not
necessarily mean zero database reads before the enablement gate.

| ID | Owner | Existing implementation | Default cadence | Data touched | Current behavior | Original candidate boundary (implementation status in section 6) |
| --- | --- | --- | --- | --- | --- | --- |
| P01 | identity | [IntegrationWebhookService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationWebhookService.java) | 1 s | integrationWebhookDeliveries | One due-work existence query per database; includes expired delivery leases. Empty queues still read Mongo. | Event wakeup plus earliest retry/lease timer. |
| P02 | identity | [AppSettingsService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/AppSettingsService.java) | 5 s | appSettings | Reloads global settings in both session modes even when unchanged. | Change notification with startup/reconnect snapshot. |
| P03 | identity | [IntegrationEncounterPublisher](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationEncounterPublisher.java) | 5 s | activityMingleSessions (through community owner) | Checks pending publication per configured workspace; job bookkeeping starts only for nonempty work. | Event wakeup and durable pending-work recovery. |
| P04 | community | [ActivitiesMingleWorkerService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesMingleWorkerService.java) | 5 s | activityMingleSessions | Tests timed statuses and phaseEndsAtIso in each database. Empty queue skips job admission. | Changes arm a local phase deadline; startup recovers timers. |
| P05 | community | [EventCancellationService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventCancellationService.java) | 5 s | events; payments through payment owner | Two event queries plus pending cancellation lookup per workspace, including when empty. No empty job history. | Wake on cancellation/refund changes and retain failed-work retry. |
| P06 | affinity | [AdminAffinityGraphLayoutWorkerService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminAffinityGraphLayoutWorkerService.java) | 5 s | notificationRuleConfigs; graph collections when admitted | Calls remote rule admission per configured workspace; materialization only after admission. | Cache next due time; wake on rule/input changes. |
| P07 | communication | [NotificationOutboxWorkerService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxWorkerService.java) | 5 s + 5 s | notificationOutbox; notificationRuleConfigs; Redis wakeup stream | Mongo due/pending checks and separate Redis reads. Redis path also reads Mongo-backed rules. Empty due checks now avoid run bookkeeping; unchanged pending counts no longer write. | Unify existing wakeup path with retry deadlines; keep durable recovery. |
| P08 | assets | [AssetLifecycleWork](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetLifecycleWork.java) | 10 s | assets | Queries lifecycleWork.0 existence in each database, limit 20. Even an empty asset collection is checked. | Wake on durable lifecycle work changes; recover pending work on startup/reconnect. |
| P09 | identity | [ProfileStatusWork](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ProfileStatusWork.java) | 10 s | users | Finds users with profileStatusWork, limit 20 per database. | Event-driven durable-work recovery. |
| P10 | identity | [ContactChatAccessWorkflow](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/ContactChatAccessWorkflow.java) | 10 s | contactAccessOperations | Reads due accepted contact commands per database; retries interrupted work. | Event wakeup plus claim/lease deadline; preserve command receipts. |
| P11 | community | [EventLifecycleWork](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventLifecycleWork.java) | 10 s | events | Queries lifecycleWork.0, limit 20 per database. | Event-driven durable-work recovery. |
| P12 | community | [EventMembershipCounterWork](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventMembershipCounterWork.java) | 10 s | events | Queries membershipCounterWork, limit 20 per database. | Event-driven durable-work recovery. |
| P13 | community | [FeedbackCounterWork](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/FeedbackCounterWork.java) | 10 s | eventFeedbackStates | Queries counterChangeId, limit 20 per database. | Event-driven durable-work recovery. |
| P14 | payments | [AffiliateRevenueService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/AffiliateRevenueService.java) | 30 s | payments | Runs scheduled workspace admission, then checks affiliateRevenuePending. | Wake on pending marker; preserve idempotent revenue completion. |
| P15 | communication | [I18nService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/localization/service/I18nService.java) | 60 s | i18n_bundles / i18n_messages | Refreshes cached bundles in both modes even without edits. | Change invalidation plus startup snapshot. |
| P16 | identity | [AdminStatsTelemetryWorkerService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminStatsTelemetryWorkerService.java) | 60 s | admin stats/menu projections; Redis telemetry | Job admission precedes enabled gate. With no Redis events it still refreshes graph science and admin menu counters. | Avoid unchanged projection refreshes; distinguish operational telemetry from host monitoring. |
| P17 | community | [CommunityScheduledTasksWorker](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityScheduledTasksWorker.java) | 60 s | notificationRuleConfigs; communityScheduledTasks when due | Rule lookup/admission each pass; due scheduled cases use time. | Next due timer plus rule/task changes. |
| P18 | community | [CommunityVotingWorker](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityVotingWorker.java) | 60 s | notificationRuleConfigs; communityAnnouncements when due | Rule checks followed by due vote closure. | Expiry timer armed from persisted vote deadline. |
| P19 | community | [ContentModerationWorker](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentModerationWorker.java) | 60 s | moderation pending decisions; notificationRuleConfigs | Drains committed decisions before scheduled automatic-approval gate. | Separate pending-decision events from time-based automatic approval. |
| P20 | community | [EventWatchService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventWatchService.java) | 60 s | eventWatchSubscriptions; events | Scheduled group admission, then scans subscriptions and observed event availability. | Wake on relevant capacity/membership changes. |
| P21 | community | [EventScheduler](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventScheduler.java) | 60 s + 60 s | notificationRuleConfigs; event/counter/basket data | Separate rule wrapper and waitlist-inviter passes. Feature flags can skip work after group/rule discovery. | Keep deadlines, remove repeated unchanged rule discovery. |
| P22 | identity | [DeletedAccountWarningWorker](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorker.java) | 60 s | users; deletion warning journal; notificationRuleConfigs | Checks schedule and due warning retries; email capability gates delivery. | Due deletion/retry timer; preserve uncertain-delivery handling. |
| P23 | communication | [PromotionalEmailPlannerService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailPlannerService.java) | 60 s | emailCampaignRules; notificationRuleConfigs | Group admission precedes promotions-enabled gate. Enabled path reloads rules and starts due workers. | Rule changes plus next campaign deadline. |
| P24 | communication | [PromotionalEmailDeliveryProcessor](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailDeliveryProcessor.java) | 60 s | emailOutbox; notificationRuleConfigs | Group admission precedes email-enabled gate; enabled delivery scans pending items. | Wake on outbox changes and retry deadlines. |
| P25 | payments | [PaymentMethodExpiryTaskService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentMethodExpiryTaskService.java) | 60 s | notificationRuleConfigs; saved payment methods when due | Rule gate precedes expiry scan; actual expiry is time driven. | Expiry timer plus card/rule changes. |
| P26 | payments | [ExchangeRateJob](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/ExchangeRateJob.java) | 60 s | notificationRuleConfigs; deploymentConfigurations; payment/exchange-rate data | Checks rule; non-due branch still calls fillMissing(false). Due branch can contact configured external rate provider. | Keep configured rate schedule; inspect missing-rate work independently. |
| P27 | identity | [OperatorGlobalIdentityService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorGlobalIdentityService.java) | 5 min | globalIdentityLinkStates and operator configuration | Retries pending linking/unlinking in both modes; registry readiness can gate external work. | Durable journal wakeup and bounded retry. |
| P28 | identity | [AccessControlService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/access/security/AccessControlService.java) | 30 min | accessPolicyDefinitions; accessGrants | Reloads complete policy/grant caches; filters expired grants. | Change invalidation plus grant expiry timer. |
| P29 | communication | [ScheduledMessageTaskService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskService.java) | 30 min | scheduledMessageTasks; notificationRuleConfigs | Reconciles DB work into local scheduled workers with lookahead; not just blind delivery polling. | Preserve existing exact-time workers; consider event-driven discovery. |
| P30 | identity | [DeletedAccountPurgeService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) | 1 hour | users; accountPurgeJobs; notificationRuleConfigs | Runs rule-gated purge and interrupted-purge recovery. | Retention deadline and recovery timers; never disable deletion obligations. |
| P31 | identity | [OperatorGlobalIdentityPresenceReportService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorGlobalIdentityPresenceReportService.java) | 1 hour | globalIdentityPresenceChunkOutbox and identity/configuration data | REAL/DEMO synchronization; registry readiness gates reporting. | Keep explicit reporting contract; inspect empty scans before changing cadence. |
| P32 | identity | [OperatorQualifiedMauReportService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorQualifiedMauReportService.java) | 1 hour | qualifiedMauReportOutbox; measurement inputs | REAL reporting, guarded against concurrent synchronization; initial delay 90 s. | Reporting schedule, not a one-second idle source. |
| P33 | identity | [OperatorRevenueReportService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueReportService.java) | 1 hour | revenueReportOutbox; revenue inputs | REAL reporting; initial delay 60 s. | Reporting schedule, not a one-second idle source. |
| P34 | affinity | [AffinityRecomputeWorkerService](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeWorkerService.java) | 1 s scheduler; no DB poll in stream mode | affinityRecomputeTasks | With stream enabled and fallback disabled, both REAL and DEMO return before any DB/rule lookup. Startup/reconnect and queued-work wakeups remain. | Implemented; verify live flags, cursor activity and tests. |

## 3. Work that must be counted separately

- Chat's `ChatStreamConsumer` waits on Redis, not Mongo. Its empty-read timeout is
  now 1000 ms; an arriving record wakes it immediately. This is not a one-second
  batching window. It repeats the blocking read after timeout (plus an existing
  10 ms idle/error pause), so it is still Redis traffic. Admin telemetry (P16)
  uses a nonblocking Redis stream read on its 60-second scheduler when its rule
  admits execution. Even an empty telemetry stream then refreshes graph science
  and admin menu counters: those downstream owner/DB reads remain a separate
  idle-load candidate. Notification outbox's former Redis reader remains an
  unscheduled compatibility method; production wakeups now use Mongo changes
  and due-work timers. No callers of its old Redis reader remain in production.
- `ChatCallSignalingService` probes STUN by UDP every 5 seconds. That is network
  health traffic, not a database query.
- `AdminNotificationService` starts a 100-ms progress heartbeat for an active
  job and cancels it afterwards. It is not an always-on idle Mongo scheduler.
- Mongo change streams use an oplog cursor and waiting `getMore` calls. They
  still have server/network overhead, but do not repeatedly run the application's
  pending-task query. Replica synchronization and driver topology heartbeats
  are additional traffic, independent of collection polling.
- Kubernetes probes, k3s, containerd, Redis, Mongo's own housekeeping, the VM
  host process, the one-second terminal observer and host Prometheus/Grafana
  must be attributed separately. An empty business collection does not make
  those processes silent. Source cadence is not measured CPU attribution.

## 4. Priority for follow-up

1. **P01, P02, P05, P07:** frequent empty reads and repeated configuration/rule
   lookups. Measure their query counts and owner-to-owner calls before altering
   behavior; reuse existing rule/configuration owners and Redis wakeup path.
2. **P08–P13:** durable work markers currently scanned every 10 seconds. A stream
   can trigger them, but startup/reconnect must recover committed pending work,
   and failed delivery/expired claims still need a bounded retry/deadline timer.
3. **P15, P16, P20:** unchanged cache reloads and derived-statistics refreshes.
   The telemetry worker itself can generate application work even when external
   monitoring is switched off.
4. **Time-based work:** a change stream alone does not emit an event when a stored
   timestamp becomes due. Keep expiry, retry, phase transition, retention and
   scheduled-message deadlines. Replace idle discovery only with an equivalent
   durable snapshot + event + timer mechanism, with restart coverage.

## 5. Affinity completion boundary

Normal Compose/KVM configuration enables task change streams and disables the
periodic fallback poll. One stream per distinct application database replaces
one per workspace. The stream opens before pending-task reconciliation so a
concurrent write is not missed; reconnection repeats reconciliation. Existing
250-ms coalescing, future task timers, job admission and task claims remain.
Only actual remaining pending work can schedule another attempt (minimum normal
retry delay 5 seconds); an empty queue schedules no task-query retry.

Collection indexes do not enable change streams. Affinity's startup snapshot
uses `status + availableAtIso`; group processing uses
`baseGroupId + status + availableAtIso`. These are application query indexes,
owned by the existing document/index initializer. The live audit found the
status index only in REAL and the group index only in DEMO before the initializer
fix; this explains why annotations alone are not evidence of installed indexes.
The change-stream implementation and replica bootstrap are covered by focused
JUnit and isolated Mongo checks; full browser/business-flow QA was not run.

## 6. Change-stream implementation tracking

The user authorized replacing database read polling wherever equivalent event
and deadline behavior can be retained. Work proceeds by service; this is not
permission to remove required retry, expiry, retention or reporting work.

1. **DONE — CPU baseline before expansion.** A direct 30-second process sample
   after revision 115 measured QEMU 88.17%, six JVMs 24.10% (affinity 2.46%),
   Mongo 8.16%, and separate host monitoring 2.02%. CPU improvement is not
   established against the earlier unmatched windows. The observation backlog
   and affinity startup failure reported during this check are handled first.
2. **DONE — runtime defects (revision 116).** Close the terminal's producer while the
   lifecycle lock prevents reads, avoiding queued historical frames. Wait for
   affinity's account/group startup dependencies before starting its JVM.
3. **IMPLEMENTED / TESTED — shared stream transport.** Reuse the existing affinity stream's
   subscribe-before-reconcile and session-mode handling in common infrastructure;
   retain business processing and claims in their current service owners.
   Use bounded listeners and coalescing rather than one cursor per workspace.
4. **IMPLEMENTED / TESTED — change-only caches and durable markers.** Replace P02/P08–P13/P15
   periodic discovery with startup/reconnect snapshots, change wakeups and
   retries only while committed work remains. Preserve mutation-time delivery.
5. **IMPLEMENTED / TESTED — queues with deadlines.** Convert webhook delivery, Mingle phase
   advancement, notification outbox and similar discovery to change events plus
   the earliest persisted deadline. Keep expired lease and rejected-work recovery.
6. **REVIEWED — remaining rule-driven and timed paths.** Inspect each owner's
   actual dependency and timer semantics; remove eligible read polls while
   retaining calendar/reporting deadlines. Record concrete retained exceptions.
7. **DONE — focused verification and local rollout; CPU investigation OPEN.** Focused restart/retry/empty-queue and
   REAL/DEMO tests; offline builds only for changed services, serially; live
   readiness and CPU/query comparison after warmup. Revision 117 reached six
   Ready backends with zero container restarts and twelve database stream cursors.
   CPU measurements and their limits are recorded in PROGRESS.md; full business
   QA is not claimed from scheduling tests alone.

Existing references: `AffinityRecomputeChangeStreamService` owns the current
stream/reconciliation behavior; `ScheduledMongoSessionRunner` owns distinct
REAL/DEMO execution; lifecycle work services already own persisted work and
idempotent delivery; `ScheduledMessageTaskService` already uses local deadline
workers. A shared transport is needed because the affinity-specific watcher
cannot serve other domain owners without importing affinity implementation.

The source batch replaces discovery polling in P01–P05, P07–P15, P17–P18,
P24, P28–P29, and P34 with owned collection changes and persisted deadlines
(where applicable). Cancellation/refund and encounter publication use extensions
of the existing CheckoutMemberships and EventChanges transport owners. Each
service opens at most one stream for each distinct configured database; no
cross-domain repository or foreign collection access was added.

Retained timers have different semantics: graph layout (P06), operational
telemetry (P16), moderation (P19), event watching (P20), stage/auto-invite
scheduling (P21), deletion warnings (P22), promotional planning (P23), event/card
expiry (P25), exchange-rate acquisition (P26), global identity retry (P27), purge
(P30), and registry reports (P31–P33). Their rule discovery/negative admission now
uses the communication owner's invalidated snapshot, while due execution still
uses authoritative admission. P19/P20 involve further workflow/input signals;
this batch does not claim that every retained read poll has been eliminated.
Clock deadlines and external reporting cannot be replaced solely by Mongo writes.

## 7. Backend cache freshness audit — source corrections and verification

Scope: the entire canonical Java backend and microservice transport, including
Spring cache annotations, retained maps/snapshots, runtime clients, Redis access
and failure fallbacks. This is a source/test result; rollout is tracked separately
in PROGRESS.md. A five-second TTL is bounded staleness, not immediate consistency.

| ID | Owner / retained data | Freshness and scope after correction | Evidence |
| --- | --- | --- | --- |
| C01 | NotificationRuleRegistryService schedules | Admin save refreshes before returning. External changes invalidate a generation before dependent workers wake. Startup/reconnect reload; REAL/DEMO separated or explicitly aliased. Positive execution admission still reads/claims Mongo. | Embedded admin enable/disable/timing save; actual replica-stream external enable/delete; negative-read reuse and dependency-order unit tests. |
| C02 | AppSettingsService admin settings | Per-database immutable snapshots; shared physical DB uses the same reference and lock for both modes. Save and reload serialize; stream change/reconnect reload. | Separate-mode and shared-DB admin-save tests. |
| C03 | I18nService bundles | Every change reloads messages, including edits/deletes without a bundle version bump. Same-DB aliases share reference/lock. Editor version is not a content validator: equal-version requests receive the current cached payload. | Same-version edit/delete tests; local/HTTP owner parity. No frontend source change. |
| C04 | DBMessageSource translations | Stream invalidates mode/language maps by replacing the map generation. An older in-flight load cannot repopulate the active generation. | Concurrent load/invalidate, deletion fallback, REAL/DEMO tests. |
| C05 | AccessControlService grants/policies | Per-DB snapshots, shared-DB aliases; change/disconnect invalidation is revision fenced. Grant expiry wakes independently of writes and is checked on access. Failed refresh does not validate an obsolete generation. | Mode separation, enable/delete/expiry owner tests; common stream tests. |
| C06 | HomeUserProfileService impressions | REAL/DEMO/workspace key and generation fence; local eviction plus owned user changes; existing five-second TTL bounds other-owner changes. | Focused mode/load-invalidation tests and existing profile suite. |
| C07 | HomeUserProfileService affinity weights | REAL/DEMO/workspace and user-list key; generation fence; existing five-second TTL for changes from the affinity owner. | Mode/workspace/load-invalidation tests. |
| C08 | HomeUserProfileService game stack | Per-mode/workspace snapshot rather than one process-wide value; generation fence and five-second TTL. | Mode/load-invalidation tests and profile suite. |
| C09 | Spring demo_users | Removed indefinite global selector cache; reuse existing authoritative parameterized selector implementation. Other selector dependencies span owners. | Existing profile tests; source call-path review. |
| C10 | ExchangeRateStore observations | Structured mode/group key (null differs from literal default); local save evicts all aliases; external change/reconnect clears. Synchronized Spring loading prevents an in-flight load from surviving completed eviction. | Actual Spring proxy concurrent load/eviction, mode/group and local-save test. |
| C11 | IntegrationPublicEndpointResolver | Removed indefinite instance cache; existing DeploymentSettings owner API reads each resolve. No foreign collection subscription. | Source call-path review; assembly/transport validation. |
| C12 | DeploymentBrandingResolver fallback | Successful resolve still reads Mongo. Last-known-good outage fallback is now per mode. | Transient failure and cross-mode failure tests. |
| C13 | DeploymentFirebaseRuntime | Existing revision/credential validation on actual use retained. Deployment configuration stream now refreshes the public activation flag on other instances too. | Activation/deactivation callback test; existing credential/mode tests. |
| C14 | ScheduledMessageTaskService task metadata/timers | Reconcile retained timers before rule admission, even if rule removed/disabled. Execution checks current enablement and atomically claims current status/suspension/due date; uses returned current document for payload. | External cancellation without admission test; existing task suite. |
| C15 | Parsed expressions, query mappings, provider registries | Keys are expression source, packaged query resources, class aliases, or immutable Spring providers. Evaluation context is fresh; these are not mutable Mongo result caches. | Source inventory, no invalidation change required. |
| C16 | Redis and execution state | Redis streams/cursors, active socket/call sessions, locks, metrics and job futures are execution state. No Redis result cache was found. Socket removal occurs on close/send failure; payload and case membership memoization is per broadcast. | Source lifetime review; no durable queue/session deletion performed. |
| C17 | HTTP/security/client configuration | Private transport responses use no-store; no response cache in remote owner clients. Transport credentials and S3 endpoint/credentials are startup configuration. Firebase SDK token/certificate caching is SDK-managed; credential handles checked by owner. | Source review and focused HTTP tests. No claim of auditing third-party SDK internals. |
| C18 | S3 bucket existence memo | Previously one permanent boolean for all buckets. Now keyed per bucket; NoSuchBucket invalidates and reuses existing ensure path once. Normal uploads do not add HEAD polling. | Mock S3 two-bucket and deleted-bucket recovery test. |
| C19 | JobGroupContext / FriendshipFacts memoization | Scoped to a single job/request, restored/removed in finally; cannot leak a previous invocation's data. | Source lifetime review. |
| C20 | Affinity fallback cadence / scheduler timestamps | Optional fallback caches only its last cadence until the next pass, then rereads the owner. Default stream mode bypasses it. Event scheduler timestamps throttle work; current rules still control admission. | Source review; these are not indefinite configuration snapshots. |

The commented-out I18nMessageService is not a Spring bean. Legacy empty Spring
cache regions/eviction annotations are harmless compatibility remnants, not
additional live caches. Document DTO maps and persisted projections were not
misclassified as process caches.

### Consistency limits and recovery

- Remote edits propagate asynchronously through one database stream per service
  and distinct database. The 25 ms coalescing period is a scheduling minimum,
  **not** a guaranteed maximum delivery time. Local job/admin saves publish their
  cache before returning. Other instances converge after the change arrives.
- Stream startup/reconnect subscribes before taking snapshots. Dirty changes
  arriving during reconciliation trigger another pass. Reconnect attempts use
  five seconds; a failed callback retries its outstanding work. Collection
  rename (including staging-to-live replacement), drop and database invalidation
  trigger reconciliation. No periodic empty-collection polling was added.
- The stream cannot supply fresh data while Mongo is unavailable. Existing
  AppSettings/I18n and branding outage fallbacks retain their last successful
  values; they recover on successful reload/reconnect. This is explicitly a
  last-known-good fallback, not a promise of freshness during an outage.
- The three profile read caches deliberately retain a five-second TTL for
  cross-owner changes. They are not authorization/claim caches. A request already
  executing when a change commits can finish with its earlier snapshot, but it
  cannot make that snapshot valid for subsequent cache hits after invalidation.
- Browser IndexedDB/translation activation and third-party SDK internals are
  outside this **backend** cache audit. No browser QA has been performed.

### Focused verification

Serial offline JUnit runs use tools/run-backend-junit.sh with isolated outputs;
embedded Mongo is the already-cached 6.0.6 binary in a temporary test replica set.
No live fixture was wiped. The tests cover actual stream routing/external rule
changes and delivery after a server-killed cursor, admin saves, load/eviction races, scoped caches, expiry and cancellation.
Focused bootstrap HTTP tests cover recovery commands, administrator settings and
both localization owner contracts. Full business-flow QA is a separate boundary.

## 8. Empty scheduled work suppression — 2026-10-09 follow-up

The existing Mongo change-stream owner now exposes `watchPresence`: a bounded
REAL/DEMO presence snapshot, refreshed after subscription/reconnect and relevant
collection changes. The normal minute scheduler reads this flag before starting
empty owner/group/database work. It is not a cache of admin settings or a new
stream/polling process. A stream disconnect makes the flag unavailable; the
existing reconnect path reconciles rather than trusting a stale negative result.
Shared REAL/DEMO databases use the same REAL cursor's result.

- **P19 moderation:** considers durable pending effects and all non-deleted
  under-review/rejected/blocked items. Future approvals and release-on-disable
  are included. Empty state skips group enumeration, claims, scans and empty
  job telemetry. Committed delivery still precedes approval-rule admission.
- **P20 event watching:** no watch subscriptions means no owner/group admission
  or event scan. Insert/delete/replace/drop/rename/reconnect re-evaluates presence.
- **P23 promotional planning:** no enabled campaign means no new scheduled pass;
  currently running tasks remain eligible for existing cancellation handling.
  Static disabled email/promotions configuration also skips empty job admission.
  Future enabled campaigns remain candidates; existing schedule checks are kept.
- **P21 basket-expiry call:** the payments owner skips its empty scheduled claim
  and query when no purgeable reservation with an expiry exists. Future expiries
  count as work. Manual purge retains its existing behavior. The community-to-
  payments scheduled HTTP call remains, so this is not zero cross-service traffic.
- **P16 admin telemetry:** unchanged. Its time-derived graph/profile/queue
  refreshes and actual stream records still use the established rule gate. This
  patch does not claim to have replaced that worker with a blocking Redis reader.

These are database-wide candidate guards, not per-group caches: when any group
has candidates, normal group routing and authoritative admin admission continue.
A rule enable/disable/interval edit never depends on invalidating a cached rule
inside these guards, because no rule settings are stored in them. Empty timers
still wake for a cheap memory read; positive work retains the configured cadence.

Focused tests cover empty-pass owner suppression, reactivation with current
admin rules, mode separation, shared-database aliases, stream changes/reconnect,
existing claims/history, event watching, promotional planning and basket logic.
Chat's empty Redis timeout is now 10 seconds; the dedicated blocking connection
and consumer thread preserve other requests and immediate arrival wakeup. The
isolated actual Spring/Lettuce test confirms this, including interruption.

## 9. P16: skip unchanged telemetry projections — 2026-10-09

The previous empty-read branch still recalculated graph science, scanned profile
statistics, refreshed admin queue counters and saved snapshots. In addition,
`admin-telemetry` emitted its own start/completion events into its input stream.
`processedCount=0` in its job history did **not** prove an empty Redis read: the
shared Runnable scheduler records zero regardless of the batch size.

The canonical worker now reads the existing Redis stream before job admission.
An empty batch with unchanged inputs returns without claiming a job or writing
its history. New telemetry updates telemetry counters and the durable cursor;
it does not automatically recalculate graph/profile statistics. The existing
admin enabled/timing checks and atomic claim still admit every actual pass.
Pending records and invalidation survive a denied claim.

Graph/profile projections are asynchronously reconciled after changes to
`users`, `userAffinityEdges`, `userRates` or `activityMembers`, plus the UTC date
boundary used by the existing graph timeline. Queue invalidation covers
`affinityRecomputeTasks`, `notificationOutbox` and terminal job results. Job
claims only set `currentStatus=running`; the failed-job predicate retains the
last terminal failure until a terminal result changes `lastRunStatus`. Watching
that terminal field avoids invalidating this worker on its own routine claims.
Insert/delete/replace and whole-runState updates are also covered by the shared
change-stream dispatcher.

This reuses `MongoChangeStreamService`: no extra Mongo cursor, per-domain Redis
transport or service was added. Revisions are database-scoped; completion is
tracked per existing group stream. Revisions are captured before processing, so
concurrent changes remain pending. Startup, disconnect and reconnect invalidate
projections. REAL/DEMO remain isolated; aliased databases share invalidation.
Admin rules are not cached by this worker. Reconciliation runs on the existing
60-second trigger **when the admin schedule admits it**, rather than overriding
admin suspension or interval settings.

Routine start/success telemetry for this consumer is omitted to break feedback;
its Mongo job history, runtime broadcasts and failure telemetry remain. Queue
snapshots are saved only when their values change. Background source/write
failures propagate for retry instead of being persisted as false zero counts;
a failure after telemetry cursor advancement still leaves queue reconciliation
pending. Existing interactive non-refresh counter reads retain their behavior.

Remaining work is explicit: one non-blocking XREAD per configured group per
minute, existing group routing, genuine telemetry persistence, source-triggered
reconciliation and the daily graph boundary. This is not a blocking Redis
consumer conversion or a claim of zero idle I/O. Business logic stays under
`server/projects/profile` for both monolith and split deployments. No Terraform
or runtime configuration override is needed for this Java-owned change.

Focused standard JUnit: **22 passed** (worker, stats, queue counters, notification
rule registry). Tests cover unchanged empty passes, admission denial/re-enable,
source mutation during refresh, queue-only mutation, UTC rollover, failure retry
including post-cursor counter failure, new telemetry without graph refresh,
REAL/DEMO separation, stream reconnect, unchanged snapshot writes and retained
self-failure/history. Source assembly audit and offline identity/communication
bootJar builds passed. Only those two images were rebuilt with network disabled.


## 10. P16: blocking, multiplexed Redis telemetry reader — 2026-10-09

The preceding section's minute-based Redis reads are replaced by one dedicated
`admin-telemetry-stream` reader in the canonical worker. It reuses the established
`StringRedisTemplate`/Spring-Lettuce blocking-read path used by chat. One
`XREAD BLOCK 30000 COUNT <maxBatchSize>` waits on all currently readable REAL/DEMO
and group stream keys. A new record wakes the command immediately; an empty
30-second timeout renews the wait. This is bounded blocking I/O, not a claim of
zero Redis commands or an indefinitely open server-push connection.

The existing minute scheduler now examines buffered batches and projection
revisions in memory. It retains admin-enabled/timing checks, atomic job admission,
source-change reconciliation and UTC-day refresh. Reception does not override
the admin processing window. The shared scheduler and HTTP threads never perform
the blocking read; Spring/Lettuce uses a dedicated connection for that command.

There is at most one batch per stream in memory (existing default: 500 records
per batch). A stream with a buffered batch, including an administratively suspended group,
is excluded from further reads until processing succeeds; other streams remain readable. When
all streams are buffered, the reader sleeps on a signal instead of spinning.
Removed groups are pruned after a successful inventory pass. Connection errors
retry with a five-second delay; shutdown interrupts the read and stops the owned
executor. No new Redis server, queue, consumer group, thread per tenant, or
parallel telemetry implementation was introduced.

Prefetch does not acknowledge/delete records or advance a durable cursor. After
admission, the existing stats and monitoring cursors are re-read independently:
records already committed by either projection are not counted twice. This also
handles another instance finishing an already-prefetched batch. Startup resumes
at the earlier of the two durable cursors; a partial commit retries the missing
projection. The buffered batch is released and retention cleanup occurs after
both projections succeed. Existing downstream counter retries remain pending.
This does not claim a new transactional exactly-once protocol across all owners.

Focused standard JUnit: **28 passed**, covering empty timers without Redis calls,
blocking-reader isolation/shutdown, bounded pending batches, admin suspension and
re-enable, multiple streams without head-of-line blocking, removed groups,
durable-cursor replay/partial-commit recovery, plus the previous projection and
notification-rule cases. The offline build targets only `:identity:bootJar`.
Business logic stays in canonical Java for monolith and split deployments; no
Terraform, Helm environment override or database schema change is required.

Live verification on Helm revision **123**: Redis `CLIENT LIST` showed an
identity-owned connection in blocked `XREAD` (14 seconds idle in the captured
sample), separately from chat's communication-owned reader. All 15 pods were
Ready. Startup owner unavailability recovered at 15:09:56 UTC; all six group/mode
telemetry runs completed by 15:09:59. Both durable projection cursors matched in
all six scopes and contained newly received deployment-time stream IDs
(15:08:52–15:09:53 UTC). No repeated Redis-reader failure was logged. Admin timing
and suspension settings were not changed. These are real split-runtime read,
processing and waiting observations, not a full E2E or CPU benchmark.

Evidence: `/tmp/myscoutee-admin-stream-{tests,build,package,deploy}.log`,
`/tmp/myscoutee-admin-stream-live-3.json`, and
`/tmp/myscoutee-admin-stream-cursors.json`.
