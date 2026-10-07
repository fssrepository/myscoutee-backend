# MSC-120: Cross-domain E2E verification

Status: expanded failure investigation and backend verification completed,
2026-10-07. **1,733 standard/embedded tests, 44 Java HTTP E2E cases and 95 deployed
HTTP E2E cases pass, with zero failures or skips.** This closes the observed
failures, including those shared with master and assertions reached only after
repairing the initial fixtures.
This is backend HTTP and load verification, not the manual browser QA campaign.

## Runtime and baseline

- Initial domain candidate: `1bee3d0eaa2c745c1bf6ae312b4a3ed77fd5e582`.
- Verified production fix: `6fdab9f25`; E2E contract/fixture corrections: `3c448b6f`.
- Additional verified fixes: `46ae2f218` (Firebase admin authentication with
  support-session preservation), `de79b70e2` (profile-ID lookup in invitation graphs).
- Rebuilt and verified backend image: `sha256:df63342d0ce0ba050e7df33f9b0e83dc0f0ee84bce060fcbca7403f88e897052`.
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
The separate Java HTTP failures are recorded historically below and closed by
the expanded investigation at the end of this report.

## Historical Java HTTP E2E comparison

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
is the one repaired case. The other 26 failures also reproduced on master. That comparison was insufficient
to close them: the expanded investigation below found two more production
defects and repaired the fixtures before exercising the rest of each flow.

| Class | Originally failing test | Original mismatch |
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
the local evidence directory above. The final run executes all original 42 cases plus two new security regressions,
with no skipped or disabled cases. These retained XMLs document the failures
before repair.

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

- The original Java failures are now closed by a complete 44-case execution,
  including assertions after each formerly failing step. The historical
  master comparison alone was not used as closure evidence.
- The general read scenarios do not qualify owner-scoped payment/integration
  scans against large unrelated backlogs, crash/retry/refund/purge sequences or
  live Firebase delivery. These remain the high-risk targets in the domain
  progress plan; no performance percentage is claimed for them.
- No manual browser campaign, UI acceptance run or master merge was performed.
- Leave the candidate E2E stack running at `https://localhost`, with dev stopped
  and `AUTH_MAX_ACTIVE_SESSIONS=2`. The retained data is disposable `e2e_db`.
- All changes and evidence belong to the working branch only. Master and the
  frontend commit remain the pinned versions recorded above.

## Reopened investigation

Master `752ba4d15` already contains the package refactor. Matching failures on it
cannot qualify either that refactor or the behavior behind the failed assertions.
The package-move commit is `9c9411264`; its parent `5a23e829f` is the source
checkpoint used to distinguish earlier behavior from the domain changes.

The inventory includes the original 27 external HTTP failures, all 27 Java HTTP
failures (including the repaired moderation failure), earlier standard/embedded
and compilation failures in the local domain-work logs, and every subsequent
failure exposed by continuing these flows. Prior green results must be matched
to the actual failing cases; no failure is closed merely because master has it.

| # | Area and changed files | Diagnosis, correction and evidence | Break / severe slowdown risk |
| ---: | --- | --- | --- |
| 1 | `Backend*E2ETest` request fixtures | `config.dev-user` was renamed before the refactor. Use `config.member-user` and explicitly select each request actor through existing test authentication. Seed the canonical access policies. Cross-user, non-member and non-admin denials remain asserted. | Test setup only. No authentication shortcut added to production. |
| 2 | `BackendContentMediaE2ETest` | Replace a PNG with invalid IDAT CRC by a valid generated image. Exercise current private-media URLs with an active media cookie, and assert anonymous denial, stored bytes, all generated variants, audio, malformed input and failed-storage cleanup. The full help/privacy/share flow also passes. | Test data only. Media authorization remains enforced. |
| 3 | `E2eScheduledJobTestSupport`, scheduler/email/notification tests | Seed explicit scheduled job instances for isolated global fixtures. Email also needs its English catalog and an isolated configuration key. Real workers now execute message, affinity, email and deleted-account purge assertions. | Test infrastructure only. No dev configuration or database access. |
| 4 | `BackendNotificationDeliveryE2ETest` | Delivery eligibility is saved at enqueue. Configure the fake Firebase sender first, then enable the worker after checking pending state. Direct, multicast, no-token, disabled-device and invalid-token cases pass. | Test timing only; no production delivery decision changed. |
| 5 | `EventScheduler`, `EventSchedulerTest`, `BackendAlgorithmsE2ETest` | **Production defect:** graph user IDs were looked up as Mongo `_id` values. Use existing batched `findByUserIdIn` at both profile lookups. Keep the fixture's distinct Mongo/profile IDs; all 50-user random-room, priority-invitation and leaderboard assertions pass. Also correct the test's outbox field from `type` to `notificationType`. | Medium functional scope: restores previously omitted invitees and profile attributes. Existing indexed batch query; no extra round trip or per-user query. Correctly executing previously skipped invitations may do more work; no large-job slowdown percentage is established. |
| 6 | `BackendLifecycleE2ETest`, `BackendPaymentsConcurrencyE2ETest` | Exercise actual ownership release before takeover, notify the remaining manager, use stored friendships, and handle the existing array/mutation-envelope distinction. Participant trash does not refund money: run payer refund request and recipient approval separately, including policy rejection. Payment fixtures use valid saved cards and typed fake gateway processors; deployment selection, server pricing, idempotency, failure atomicity and 49 concurrent joins still execute. Capacity includes the host. | Tests only. No production payment, membership, capacity, refund or ownership rule changed. Gateway processors are test doubles, not live gateway qualification. |
| 7 | `FirebaseFilter`, `BackendSecurityContractsE2ETest`, `BackendAdminParamsRealtimeE2ETest` | **Production defect:** demo routing skipped Firebase verification on protected admin routes. A forged demo admin identity previously returned 200; it is now rejected. Verified admins remain accepted. The seven security cases include the existing support share → selected-member login → profile read → return-to-admin flow. Admin parameter fixtures use the demo admin realm, exclude the initiating admin from notifications and clear inbox state between methods. | Medium security scope, limited to Firebase-enabled protected routes. Ordinary demo/support and separately authenticated operator paths retained. No new remote service; normal Firebase verification now runs where it was incorrectly bypassed. |
| 8 | Earlier standard/embedded failures | Full local run: **1,733 pass, 0 failures/skips**. All 124 earlier failing IDs plus the two query-verification variants exposed during this repair map to passing final cases. | No lost or disabled case; four renamed/strengthened tests are explicitly mapped in the ledger. |
| 9 | Deployed HTTP collection | Rebuilt candidate: **95 pass, 0 failures/skips**, including all 16 mutation flows. All 27 originally failed external case IDs pass. | Existing stack and versioned reset; no dev or master changes. |

The two newly identified production defects also exist in the pre-package-move
checkpoint `5a23e829f`: `common/config/firebase/FirebaseFilter.java` has the
unconditional demo branch, and `profile/service/EventScheduler.java` uses
`findAllById` for profile IDs. They were not introduced by the cross-domain
interfaces, but they are fixed rather than dismissed as baseline behavior.

The earlier moderation defect was a null dereference in a warning without a
report ID. Commit `6fdab9f25` preserves authorization by checking the target's
workspace for a general warning and the reporter's workspace for a specified
report. The focused positive/foreign-workspace regressions and the complete
HTTP moderation flow pass.

Final Java evidence: `java-full-repaired.log`, `java-repaired-results/`:
**44 passed, 0 failed, 0 skipped**, all 12 classes. The two added cases cover
forged demo admin identity rejection and successful support impersonation.
`java-security-before.log` records the forged-identity failure before the fix.
Support UI/browser interaction was not automated; the HTTP sequence follows
`admin-help-session-page.component.ts` and the existing session service.

## Final reconciliation and runtime handoff

[The failure ledger](BACKEND_CROSS_DOMAIN_FAILURE_RECONCILIATION.csv) matches
**189 distinct previously failing case IDs** from the retained logs to successful
final evidence: 126 standard/embedded, 36 Java HTTP and 27 deployed HTTP cases.
This includes intermediate fixture/development failures, not 189 product defects.
There are zero unmatched or still-failing IDs. Four renamed tests retain explicit
mappings; parameterized XML display names are checked against the current test
method and every matching final result.

- `full-local-final.log` and `server/projects/profile/build/junit/test-results/test/`:
  1,733 tests passed, including all 42 architecture checks for 21 domains,
  historical Mongo type aliases, session/operator permissions and batched graph lookup.
- `java-full-repaired.log` and `java-repaired-results/`: all 44 HTTP cases passed.
- `functional-repaired-final.log`: all 95 deployed checks passed on the rebuilt image.
- The earlier warmed performance measurements remain valid evidence for the
  earlier pinned images. They were not re-labelled as a benchmark of the two
  subsequent production fixes. Large invitation/backlog workloads remain unmeasured.
- Runtime log review: the Redis connection-closed warning occurred during the
  reset harness's graceful application shutdown (19:11:43–19:11:46 local time).
  After restart, warnings are HTTP validation failures from the negative cases
  and the HTTP metrics URI-cardinality limit reached by the wide endpoint sweep.
  That metric limit is retained; it can omit additional per-URI metric series,
  but does not reject requests. No unexpected post-restart exception was found.
- E2E application remains running and healthy; dev remains stopped. No browser
  navigation, live Firebase send, real-money payment, master merge or frontend
  modification was performed during this repair.

All repair commits remain on `refactor/MSC-120-backend-domain-segregation`.
Master and `origin/master` remain at `752ba4d15cb7fdd0ec958c2169e552047a77ea78`.
