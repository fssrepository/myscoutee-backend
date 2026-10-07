# MSC-120: Cross-domain E2E verification

Status: verification executed, 2026-10-07. External HTTP collection passes;
the separate Java HTTP suite retains the baseline failures below. This is backend HTTP and load verification,
not the manual browser QA campaign.

## Runtime and baseline

- Domain candidate: `1bee3d0eaa2c745c1bf6ae312b4a3ed77fd5e582`.
- Verified production fix: `6fdab9f25`; E2E contract/fixture corrections: `3c448b6f`.
- Baseline: master `752ba4d15cb7fdd0ec958c2169e552047a77ea78`.
- Frontend: unchanged `ad026fbbf768ca12eb63fe95e0c005ca6aa7b9c3`.
- Standalone `server/docker-compose.e2e.yml`, built production-style images,
  HTTPS, isolated `e2e_db` and `myscoutee-e2e` volumes. Dev remains stopped.
- Baseline image built directly from `git archive` of the pinned master using
  the existing E2E Dockerfile. No checkout, new branch or worktree was needed.
- Backend image replacements are serial: stop the current application before
  starting its replacement. Other E2E services remain the same.
- The session-limit flow uses `AUTH_MAX_ACTIVE_SESSIONS=2` on both images.
  The product default remains `-1` (unlimited).

## Failure diagnosis and changes

The first complete run selected 95 checks, including mutation flows. Both the
original candidate and the pinned master produced **68 passes and the same 27
failing cases**. Failure presence alone therefore did not identify a new
cross-domain regression.

| Boundary / files | Diagnosis and correction | Behavior / slowdown risk |
| --- | --- | --- |
| `e2e/functional/backend/run.mjs`, `e2e/stress/backend/{run,flows}.mjs` | Use the seeded app-admin profile `admin-demo-ava`; the previous email was not that profile. | Test identity only; no product change. |
| `e2e/functional/backend/lib/operator-contracts.mjs`, `flows/operator/configuration-lifecycle/operator-configuration-lifecycle.mjs` | Remove obsolete `themePreset` expectations. The field is absent from the pinned master DTO too. Retain save/reload, revision, secret, validation and restore checks. | Test contract only; no removed product capability is reintroduced. |
| `e2e/functional/backend/operator/community-providers/assert.mjs` | Assert the versioned Discord/Discourse catalog, which is present in the E2E seed. The previous assertion incorrectly required an empty catalog. | Test fixture expectation only. |
| `e2e/functional/backend/event-editor/members/prepare.mjs` | Resolve the event creator from the existing detail endpoint and use that identity for the editor roster. An explore-list reader is not necessarily a member. | Test actor only; product authorization is unchanged. |
| `e2e/README.md` | Document the existing session-limit override needed by the two-session flow and the app-admin identity. | Test setup only; unlimited product default unchanged. |
| `domain/content/service/AdminModerationService.java` | An optional missing `reportId` returned null and was dereferenced by `warn` on master too. For a general warning, check the target's workspace; retain reporter scope for a specified report. The existing local frontend also supports general warnings scoped to the target. | Narrow production fix; unauthorized workspaces still rejected, no additional query loop or remote call. |
| `domain/content/service/AdminModerationServiceTest.java` | Add successful general-warning and foreign-workspace rejection regressions. All 5 focused tests pass. | Regression coverage; no runtime effect. |

Java paths are relative to `server/projects/profile/src/main/java/com/raxim/myscoutee`
and the corresponding test source tree.

The aligned suite initially produced **93 passes / 2 failures** on unchanged
master: the known moderation failure and the editor's mismatched actor.

## Evidence

Local raw logs and performance artifacts are under
`~/.local/state/myscoutee-domain-segregation/e2e/`. They are not committed because
HTTP recordings can contain disposable session material.

- `functional-candidate.log`: original branch, 68/95.
- `functional-baseline-original.log`: original master, 68/95, same failure IDs.
- `functional-baseline-aligned.log`: aligned assertions and session limit, 93/95.
- `members-baseline.log`: corrected owner identity passes on unchanged master.
- `functional-candidate-final.log`: **95 passed, 0 failed, 0 skipped**, including all 16 mutation flows.
- `moderation-junit.log`: 5 focused tests pass.

The full external HTTP collection passes. It exercises event publication,
participation/feedback, assets/tickets, chat, sessions, profile/contacts,
moderation/support authorization and operator configuration/registry boundaries.
It does not erase the separate Java HTTP failures listed below.

## Java HTTP E2E comparison

The existing Gradle `e2eTest` task was also executed serially with the Docker
backend stopped. These tests start an isolated Spring HTTP server and embedded
Mongo; they do not test the deployed Compose application or its databases.
The pinned master was built from an archive into local build inputs, without a
Git worktree or index change. Both runs used the same host and Gradle options.
The temporary master build inputs were removed after retaining the XML results.

| Version | Passed | Failed | Total |
| --- | ---: | ---: | ---: |
| Pinned master | 15 | 27 | 42 |
| Candidate with moderation fix | 16 | 26 | 42 |

There are **zero newly failing test IDs**.
`BackendContentMediaE2ETest.moderationReportWarnBlockAndUnblockWorkThroughHttp`
is the one repaired case. All remaining failures also reproduce on master;
this is not a claim that their behavior is correct or that they are all test
bugs. They remain failed verification, and prevent an all-green E2E claim.

| Class | Remaining failing test | Observed mismatch |
| --- | --- | --- |
| `BackendAdminParamsRealtimeE2ETest` | `adminNotificationParamsDriveOutboxGroupingAndRecomputeTasksThroughHttp` | 403 |
| `BackendAdminParamsRealtimeE2ETest` | `chatMessageRetrievalPublishesStructuredRealtimeCountersAndReadReceiptThroughHttp` |  "e2e-admin-params-u03"  but was: "" |
| `BackendAlgorithmsE2ETest` | `backendAlgorithmsHandleFiftyUsersThroughHttpAndWorkers` |  4 but was: 0 |
| `BackendChatMediaE2ETest` | `chatMutationsNotificationsReadsAndSharedAttachmentLifecycleWorkThroughHttp` |  "unavailable"  but was: "available" |
| `BackendContentMediaE2ETest` | `mediaContentPrivacyLandingAndShareTokensWorkThroughHttp` | 503 |
| `BackendEmailAccountSchedulersE2ETest` | `emailAndDeletedAccountSchedulersProcessDueBackendWorkForVariedUsers` |  30 but was: 0 |
| `BackendLifecycleE2ETest` | `eventExplorePaginationFiltersVisibilityAndOpenSpotContractsWorkThroughHttp` | 403 |
| `BackendLifecycleE2ETest` | `assetLifecyclePromotionsSuppressionRestoreAndTakeoverNotifyAffectedUsers` |  "e2e-life-u06"  but was: "" |
| `BackendLifecycleE2ETest` | `unauthorizedMemberActionsLeaveAcceptedMemberAndTicketUntouchedThroughHttp` | 403 |
| `BackendLifecycleE2ETest` | `eventLifecycleCheckoutTicketsWaitlistMembersAndResourcesWorkThroughHttp` | 403 |
| `BackendLifecycleE2ETest` | `paymentRefundAndPendingApprovalEdgesWorkThroughHttp` | 403 |
| `BackendLifecycleE2ETest` | `eventExploreFriendsOnlyUsesBackendFriendGateThroughHttp` | 403 |
| `BackendLifecycleE2ETest` | `eventJoinIsIdempotentForAcceptedMembersThroughHttp` | 403 |
| `BackendLifecycleE2ETest` | `eventTrashRestoreKeepsExploreTrashAndHostingListsConsistentThroughHttp` | 403 |
| `BackendNotificationDeliveryE2ETest` | `notificationWorkerMarksNoTokenRecipientsSentWithoutCallingFirebase` |  "sent"  but was: "pending" |
| `BackendNotificationDeliveryE2ETest` | `singleRecipientNotificationUsesDirectFirebaseSendAndExcludesSenderDevice` |  "sent"  but was: "pending" |
| `BackendNotificationDeliveryE2ETest` | `notificationWorkerSkipsDisabledDevicesAndRecordsPartialFirebaseFailuresInOneGroupedSend` |  "sent"  but was: "pending" |
| `BackendNotificationDeliveryE2ETest` | `chatNotificationGoesToRightRecipientsInOneFirebaseMulticast` |  "sent"  but was: "pending" |
| `BackendPaymentsConcurrencyE2ETest` | `concurrentPaidJoinsRespectCapacityWaitlistTicketsAndPaymentStateThroughHttp` | 403 |
| `BackendPaymentsConcurrencyE2ETest` | `paymentSessionsAreIdempotentRejectCrossUserMutationAndIgnoreClientPricesThroughHttp` | 403 |
| `BackendPaymentsConcurrencyE2ETest` | `pendingAndWaitlistPaidJoinsDoNotRecordPaymentOrPostMemberJoinedChatSideEffectsThroughHttp` | 403 |
| `BackendPaymentsConcurrencyE2ETest` | `failedProviderPayLeavesCheckoutUnapprovedAndWithoutMembershipSideEffectsThroughHttp` | 403 |
| `BackendPaymentsConcurrencyE2ETest` | `duplicateCheckoutCreatesIndependentPendingSessionsForSameUserSourceAmountAndCurrencyThroughHttp` | 403 |
| `BackendSchedulersE2ETest` | `backendSchedulersPickUpDueWorkAndPersistSideEffects` |  "completed"  but was: "scheduled" |
| `BackendSecurityContractsE2ETest` | `firebaseEnabledAdminRoutesDoNotTreatDemoSessionHeaderAsAdminBypass` | HTTP authorization: expected 2xx, received 403 |
| `BackendSecurityContractsE2ETest` | `firebaseEnabledAdminRoutesRejectNormalUsersAndAllowConfiguredAdmins` | HTTP authorization: expected 2xx, received 403 |

Evidence: `java-e2e-candidate.log`, `java-e2e-baseline.log`,
`java-candidate-original-results/` and `java-baseline-original-results/` under
the local evidence directory above. The remaining Java HTTP failures were not
reclassified, skipped or disabled.

## Performance comparison

Existing `server-read-sweep` and `server-events-read` scenarios were executed
serially, against the same pinned images, proxy, dependencies, versioned E2E
seed and session-limit setting. There was no build, dev stack or other test
process running during a timed load scenario. Requests include the configured
think time and context setup; throughput is not a saturation-capacity claim.

Columns below are **master / candidate**.

| Scenario | Requests | Requests/s | p95 latency | Error rate |
| --- | ---: | ---: | ---: | ---: |
| First read sweep | 756 / 540 | 22.53 / 17.02 | 272 / 531 ms | 0% / 0% |
| Events, 8 users / 90 seconds | 1926 / 1917 | 20.69 / 20.60 | 316 / 313 ms | 0% / 0% |
| Warmed read sweep, 4 users / 30 seconds | 810 / 810 | 24.05 / 23.92 | 258 / 239 ms | 0% / 0% |

The initial candidate sweep was slower and is retained in the evidence rather
than discarded. Its application/Mongo CPU peaks were higher. A subsequent
master control run of the events scenario immediately after a reset/restart
also showed startup variability: 1,566 requests, 16.92 requests/s, 880 ms p95,
zero failures. This does not establish the exact cause of the startup variation.

For the warmed sweep, each application had first run the 90-second event
workload on its reset seed. Both completed 810 requests. Candidate throughput
was about 0.5% lower; p95 was 239 versus 258 ms. The preceding comparable events
runs were also close (313 versus 316 ms p95). These samples show no sustained
slowdown in the covered read workloads; they are not proof of equal performance
for every endpoint, cold start or large background-job backlog.

Raw summaries, per-step latency, response volume and sampled host/container
resources are in the five `performance-*` artifact directories, with comparison
Markdown alongside the logs.

## Verification limits and handoff

- The 26 shared Java HTTP failures remain unresolved and are listed above.
  Matching failure IDs does not prove equivalent behavior after each failing
  assertion. Do not describe the complete E2E suite as green.
- The general read scenarios do not qualify owner-scoped payment/integration
  scans against large unrelated backlogs, crash/retry/refund/purge sequences or
  live Firebase delivery. These remain the high-risk targets in the domain
  progress plan; no performance percentage is claimed for them.
- No manual browser campaign, UI acceptance run or master merge was performed.
- Leave the candidate E2E stack running at `https://localhost`, with dev stopped
  and `AUTH_MAX_ACTIVE_SESSIONS=2`. The retained data is disposable `e2e_db`.
- All changes and evidence belong to the working branch only. Master and the
  frontend commit remain the pinned versions recorded above.
