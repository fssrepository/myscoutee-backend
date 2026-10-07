# MSC-120: Backend domain segregation

Task: https://github.com/fssrepository/myscoutee-roadmap/issues/158
Branch: `refactor/MSC-120-backend-domain-segregation`
Baseline: master `8af73cf0a` (2026-10-07)

## Intent and current boundary

The baseline backend has 682 Java source files. The `profile` package groups unrelated
controllers, documents, repositories and services horizontally. The candidate
ownership map moves 645 existing classes into 21 domain packages (plus the existing
shared DTO contract). This is a modular-monolith package reorganization, preserving
one application and the current MongoDB deployment. It does not yet make the
domains independently deployable services.

Use `com.raxim.myscoutee.domain.<owner>` with `controller`, `dto`, `document`,
`repository`, `service`, `mapper`, `config`, `security`, `websocket` and `algorithm`
subpackages only where that owner already has the corresponding implementation.
Keep application bootstrap, transport/security adapters, Mongo routing and common
utilities in their existing common owners. The Registry protocol implementation belongs to `domain.registry`; domain-owned
configuration lives beside its domain, and shared infrastructure remains common.

The Gradle module/artifact remains `projects:profile`, preserving launcher,
packaging and deployment paths. The domain packages replace the Java profile
umbrella; they do not replace the established runtime or invent additional
Spring profiles.

## Ownership inventory

Source counts include each owner's existing properties and index initializers.
Test counts are the baseline candidate ownership assignment, not passed tests.
Collection lists come from explicit `@Document` annotations; embedded value
objects and documents with default collection naming retain their simple names.

| Domain | Main Java classes | Test classes | Explicit MongoDB collections |
| --- | ---: | ---: | --- |
| `access` | 39 | 8 | `accessGrants`, `accessPolicyDefinitions` |
| `accounts` | 58 | 14 | `accountPurgeJobs`, `navigatorContacts`, `privacyConsents`, `userExperienceProfiles`, `userFilterPreferences`, `userFriendships`, `userLoginAudits`, `userPageFilterPreferences`, `userSessionActions`, `userSessionStates`, `users` |
| `administration` | 15 | 6 | `adminMonitoring`, `adminStats` |
| `affinity` | 33 | 11 | `adminAffinityGraphEdges`, `adminAffinityGraphForests`, `adminAffinityGraphLayouts`, `adminAffinityGraphNodes`, `affinityConfigs`, `affinityRecomputeTasks`, `userAffinityEdges`, `userRates` |
| `assets` | 11 | 6 | `assetRequests`, `assets` |
| `campaigns` | 8 | 2 | `campaignRatingSummaries`, `campaigns` |
| `chat` | 21 | 3 | `chats`, `contactChatAccess` |
| `community` | 34 | 6 | `communityAnnouncements`, `communityProviders`, `communityScheduledTasks`, `serviceCases`, `serviceFeedback`, `serviceOfferings`, `serviceProviderCalendars` |
| `content` | 29 | 9 | `contentModerationItems`, `contentModerationState`, `ideaPosts`, `photoFeedPosts`, `shareTokens`, `userFeedback`, `userReports` |
| `email` | 33 | 12 | `emailCampaignRules`, `emailOutbox`, `emailTemplates`, `operatorEmailConfigurations`, `scheduledMessageDeliveries`, `scheduledMessageRuns`, `scheduledMessageTasks` |
| `events` | 100 | 27 | `activityEventRuntimeItems`, `activityMembers`, `activityMingleRounds`, `activityMingleSessions`, `activityResources`, `activitySubEventGroups`, `activitySubEventStageRuntime`, `eventFeedbackAnswers`, `eventFeedbackStates`, `eventLeaderboardEntries`, `eventTicketAudit`, `eventTickets`, `eventWatchSubscriptions`, `events` |
| `groups` | 13 | 4 | `communityGroups` |
| `help` | 9 | 1 | `helpCenterAudit`, `helpCenterGuideFields`, `helpCenterRevisions` |
| `integrations` | 50 | 16 | `integrationExternalIds`, `integrationParticipantInvites`, `integrationTokens`, `integrationWebhookDeliveries`, `integrationWebhookSubscriptions`, `mcpAuthorizations`, `mcpEventSubscriptions`, `mcpOAuthClients` |
| `localization` | 10 | 2 | `i18n_bundles`, `i18n_messages` |
| `media` | 11 | 3 |  |
| `notifications` | 22 | 10 | `notificationOutbox`, `notificationRuleConfigs`, `notificationTemplates`, `userNotifications` |
| `operator` | 61 | 31 | `globalIdentityLinkStates`, `globalIdentityPresenceChunkOutbox`, `operatorClaimSubmissionSnapshots`, `operatorRegistryEndpoints`, `operatorRegistrySettings`, `qualifiedMauReportOutbox`, `revenueReportOutbox` |
| `payments` | 52 | 22 | `affiliateLinks`, `affiliateRegistrations`, `eventCheckoutBasketItems`, `paymentMethodRegistrations`, `paymentProviders`, `payment_gateway_operations`, `payments`, `savedPaymentMethods` |
| `platform` | 21 | 9 | `appSettings`, `countryPartitions`, `deploymentConfigurations`, `schedulerPlanMarkers` |
| `registry` | 14 | 10 |  |

The machine-readable inventory is in `backend-domain-map.json` and the exact
class/package ownership decisions are in `backend-package-map.json`.

## Persistence and public contract

Move existing implementations together without modifying endpoint mappings,
authorization rules, DTO fields, collection names, indexes, queries, aggregation
pipelines, denormalized read models, batching, worker scheduling or I/O counts.
No relational normalization, joins, database split or new remote service calls
are part of this task. Shared embedded snapshots stay embedded.

A Java package name is also MongoDB type metadata: Spring writes `_class` values
for root documents and polymorphic embedded values. Merely moving classes would
break historical polymorphic reads and rollback compatibility. Extend the
existing `common.config.MongoConverterConfig` converter extension point with a
fixed old-to-new type-name mapping. Read old names as the current domain type,
and continue writing the old names for moved persisted types, including nested
classes/records. New types retain normal Spring type alias behavior. The map is
loaded once from a classpath resource and performs no MongoDB queries or network
calls. No stored document rewrite is needed.

Closest existing owners: `MongoConverterConfig` and Spring's Mongo type mapper;
the existing converter post-processor already owns dotted key compatibility.
There was no package-move alias resolver in the backend. Preserve its early bean
initialization ordering and dotted-map-key handling while adding this capability.

## Remaining coupling and service extraction

Package ownership makes existing dependencies visible; it does not remove them.
The static dependency inventory records referenced classes and foreign repository
access. These counts are conservative source-level evidence, not runtime call
counts or measured latency.

The strongest existing coupling is between events and accounts: member lifecycle,
profile snapshots, event menu counters and organizer following access each
other's documents/repositories. Integrations compose multiple domains; community
cases create events; payments/checkout coordinate events and platform provider
configuration; operator composes Registry, platform and payments. SharedDtos and
AdminDtos also contain cross-domain presentation shapes. Do not pretend these
are already independently extractable or add HTTP hops to hide their coupling.

Largest services at baseline:

| Existing owner | Lines |
| --- | ---: |
| ActivitiesEventsService | 8,853 |
| ActivitiesMembersService | 5,915 |
| AssetsService | 5,419 |
| HomeUserProfileService | 3,899 |
| ChatService | 3,848 |
| EventScheduler | 2,962 |

Subsequent extraction must first isolate invariants and authoritative collection
ownership behind the owning existing services. Route foreign repository access
through those owners gradually, preserving batched access and stored projections.
Only then choose a deployment/data boundary. Dockerization can follow actual
ownership isolation; splitting databases or introducing remote calls now would
change consistency and performance contracts.

## Isolation and test levels

Work continues in the original repository on the refactor branch. The extra
worktree and proposed alternate Git-index/master-source mechanisms were removed.
The user authorized this branch for the existing dev compiler and subsequent QA.
The existing watcher compiled successfully and DevTools restarted in 4.297 seconds.
The user cancelled the planned E2E speed comparison for this package-only change.
Dev remains running; performance comparison belongs to subsequent cross-domain
data-access changes.

JUnit levels use the existing test source set and runner:

- `standard`: isolated unit/contract tests with mocks and in-memory values.
- `embedded`: self-contained Spring contexts, local test HTTP servers and
  disposable embedded dependencies, including MongoDB. This group runs alongside standard.
- `integration`: real deployment/environment connections and external protocol
  qualification. This group is excluded from the present verification.

The default `test` task runs standard and embedded tests and excludes integration
and the existing qualification tag. `standardTest`, `embeddedTest` and
`integrationTest` select individual levels; `qualificationTest` and the existing
separate E2E source set remain opt-in. Mixed test classes use method-level tags
so selecting standard does not accidentally include an embedded/integration
method through an inherited class tag.

Verification uses a copied Java 25 toolchain and the existing host Gradle cache,
one Gradle worker, a bounded JVM and no application server. The user authorized isolated backend verification while QA runs against dev. JUnit uses separate build outputs and does not signal the dev watcher. Production
changes are verified by the existing dev compiler.

## Verification evidence

Before any package move, the baseline test source needed four fixture/import/wiring
compilation repairs: current Campaign and ServiceCase constructors in ChatServiceTest,
a current IntegrationRoleAccessService dependency in WebSecurityConfigBootstrapTest,
and a missing MongoSessionMode import in OperatorConfigurationServiceTest. Production
code was not changed to satisfy these fixtures.

The standard + embedded baseline then ran 1,617 tests with 63 failures, no skipped
cases among discovered tests. Integration/qualification-tagged tests were excluded
by discovery. Results are not a passing regression suite; retain this baseline
when package relocation proceeds and compare test identifiers, not just totals.
The baseline failure identifiers are recorded in `backend-domain-verification.json`.

Baseline command, from `server`:

```bash
JAVA_HOME=/home/raxim/.local/share/myscoutee-domain-tests/jdk-25 ./gradlew :projects:profile:test --no-daemon --max-workers=1 -Dorg.gradle.jvmargs='-Xmx1024m -XX:MaxMetaspaceSize=512m' -Dorg.gradle.java.installations.paths=/home/raxim/.local/share/myscoutee-domain-tests/jdk-25
```

The relocated candidate ran the same 1,617 tests with the same 63 failures,
zero new failures and no missing baseline test identifiers. Eight focused Mongo
alias/architecture contract tests passed. All 645 mapped production class bodies
were compared with master after normalizing packages/imports and necessary Java
visibility changes: no unexpected logic changes were found.

The empty `profile`, `algo` and root `bootstrap` directories were removed. The
obsolete opt-in profile-image importer and empty FilterConfig were deleted; demo
media already uses the versioned Mongo/MinIO seed path. Historic Mongo `_class`
values remain compatible through the converter alias map.

The preexisting 63 failures were repaired in a separate test-only change: missing
scoped-job callbacks and collaborators, current repository overloads, required
actor authorization, stored rating read projections, atomic feedback total
updates and the current nullable payment field contract. Production Java, main
resources and application runtime configuration were not modified for those fixes.
The full local suite passed 1,622 tests (including five added architecture/type
compatibility tests), with zero failures and zero skipped discovered tests.
Ten independent integration checks passed (release signatures and OpenSSL);
the E2E source set also compiled, but E2E runtime tests were not run.

Both packages live in `src/e2eTest/java/com/raxim/myscoutee`: `dev` contains the
existing opt-in dev media/friendship fixture with a `dev` tag, while `e2e`
retains the E2E tests and `e2e` tag. The existing `e2eTest` task defaults to E2E;
`-Pe2eTestTag=dev` selects dev fixtures instead. Dev fixture/environment gates
remain unchanged; no extra runner or task was added. Functional E2E was not run,
and the user cancelled before/after latency measurement
for the package-only change. No measured performance claim is made.

Three versioned Java QA probes also follow the relocated domain imports. The
refactor checkpoint was fast-forward merged and pushed to master on 2026-10-07.
