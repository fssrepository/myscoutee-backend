# MSC-116 — consolidated automatic API/MCP and guide QA

Authorized on 2026-10-15: Codex executes the complete development QA, including
visible browser/API actions, diagnosis, repairs and targeted retests. Continue
through user questions and status requests. Do not ask again for already delegated
work. Reuse the managed windows and the previous session’s Playwright/CDP workflow.

## Execution contract

Execute the numbered steps top to bottom, grouped into the blocks below. Each
block names its baseline, actions and expected behavior; no checklist hopping is
required. Use the current four-pack contract introduced by the related MSC-119
changes. This single campaign also owns the remaining MSC-119 guide introduction;
there is no separate MSC-119 QA run. Complete monolith/local checks before the
one serial KVM sample. Preserve completed evidence; consolidation does not
require replay. Prepare each block’s disposable state through existing fixture owners.
Do not fabricate successful lifecycle results through fixture writes.

Report progress briefly in chat by block and step. Do not edit this checklist or
write a narrative after every action. Collect bounded, secret-free evidence during
execution and reconcile results at the end of a block/campaign. At the user’s
request, this document receives execution notes only at campaign end.

MyScoutee monolith, local mode and a targeted serial KVM sample are in scope.
Template verification belongs in the existing template QA; record applicable fix
propagation there. Production deployment, real vendor-host qualification and
publication are separate. A blocked external prerequisite must be named precisely;
continue independent development checks without claiming it passed.

Use the existing build/watch owners and serial test exceptions. Monitor CPU and
memory proportionally; prefer targeted tests and retest only affected behavior.
Never persist tokens, secrets, callback URLs or private message bodies in evidence.

## Preparation

Baseline: Use the existing monolith, saved fixture and visible Alex/Maya sessions.

1. Record source revisions, worktree state, active runtime owners, database/profile, health, CPU and available memory. Keep KVM stopped while monolith runs.

2. Validate the existing work-community baseline and retain its snapshots. Reuse the two visible isolated INTEGRATION-ACCESS-001 launcher sessions; Alex is issuer/manager and Maya is the separate-account/member control.

3. Enable bounded, secret-free request/timing and browser-error capture. Open Alex’s API/integration settings and identify the single combined settings GET. Opening Advanced must not fetch a second settings response.

## MSC116-SETTINGS — Access controls and drafts

Baseline: Alex’s ordinary profile, no unsaved business action; disposable credentials are created through the normal UI.

4. Inspect the main MCP shield and the API/manual MCP/OAuth row placements. Shields identify their target and remain separate from copy controls; do not seed credential secrets to populate rows.

5. Open the main MCP selector. Verify red Blocked, amber Write, blue Read and green Full, the target title, current label, changing shield colour and explanatory message.

6. Move through all four choices without a network request. X restores the opening value; a changed-state tick stages only the parent draft and closes the child.

7. Discard the parent with X and reopen. The discarded draft must not persist.

8. Create a disposable API key through the ordinary UI. Verify one-time secret, issuing profile, expiry and unchanged generation flow without an added approval step.

9. Create a disposable manual MCP client through the ordinary UI. Verify its shield, one-time secret and independent saved client pack.

10. Stage different API, main MCP and client packs. Save with one revision-checked parent PUT; reopen and reload to verify all values persisted.

11. Create and revoke a second disposable key while another permission draft is staged. Metadata updates without losing that draft; the one-time secret belongs only to the issuer.

12. Delay settings load/key creation through the transport and switch profile. Old responses, secret and editor must not leak into the new profile. Closing and reopening clears the secret.

13. Fail a save through the real transport boundary. The draft and existing error surface remain; restore transport and retry successfully. Do not inject application state.

14. Use two settings views with the same revision. First save succeeds; stale save returns409 without partial changes. Foreign, revoked and inappropriate role-key IDs are rejected.

15. On a profile without stored preferences, main MCP defaults to Blocked and new API/manual clients to Write. Key generation does not enable the main link; explicit old Write/Full preferences remain.

16. Repeat selector staging, parent save and reload in Work and Community. Values stay profile-owned and do not change Dating or Maya.

17. Edit the ordinary profile and reload. Saved integration access survives; interactive workspace switching never retargets an issued credential.

## MSC116-GUIDES — HTTP settings presentation

Baseline: Use populated settings and the current selector/help contexts; desktop1280×900 and mobile390×844.

18. Walk every rendered parent and selector guide target in Dating/Work/Community, EN/HU, desktop. Next/Back/Done must not alter drafts or permissions.

19. Repeat at mobile width. Check clipping, copy/shield separation and focus. Closing the child restores the parent guide context without stale registration or repeated settings GET.

20. Open ? help in EN/HU. Verify connection instructions, four packs, manual keys, Events setup/stop/limits and role readers. Its own guide closes/reopens without leaking context.

## MSC116-API — Enforcement, discovery and domain contracts

Baseline: Use disposable API/manual clients and resources owned by the intended base/group profile.

21. Run focused settings/token/capability/filter/controller JUnit cases serially through tools/run-backend-junit.sh. Record totals once for the batch; follow resource and owner rules.

22. Exercise all16 main/manual-client pack combinations. Blocked denies; other effective access is their intersection. API keys stay independent. Read is cumulative for member credentials, not a general read-only credential.

23. Exercise API Blocked/Write/Read/Full independently. Write permits supported organizing operations and necessary results; Read/Full only permitted domain reads; Full adds no decision/operator authority.

24. Downgrade an active manual Full client to Write. Live discovery drops broader reads, stale read calls fail and authorized organizing writes remain. Blocked denies private calls and queued callbacks.

25. Anonymous help remains available. Failed/missing capability metadata never advertises private tools. Remove fixture membership within a retained snapshot boundary and verify access is lost.

26. Compare actual API, Java SDK/CLI and MCP names, schemas, pagination and effect annotations. Anonymous packages contain only help operations.

27. Sample paged events/groups/chats/messages/notifications/ratings and follow returned cursors. Cross-owner IDs respect visibility; MCP message reads do not change human unread/read-receipt state.

28. Compare Work campaign/history and Community service/case/announcement/recurring-task reads with the same actor’s UI. Assets remain base-only; aggregate ratings without campaignId preserve decimals.

29. Use SDK/CLI and MCP to edit/publish disposable campaigns with Write and Full. Verify UI/persistence, version conflicts and minimal ID/status/version write receipts.

30. Use manager-owned disposable case/board/announcement/recurring-task operations with Write and Full. Maya’s forbidden writes leave data unchanged; payload userId cannot change the actor.

31. Attempt rating/interest/feedback/ballot/recommendation/join/leave/take-over/invitation response/offer/offer-decision integration writes. None is callable or creates a decision, membership, notification or financial effect. Existing app decisions retain their rules.

## MSC116-OAUTH — Identity isolation

Baseline: Use one disposable public DCR client and two unrelated accounts with retained state.

32. Authorize the DCR client separately as Alex and Maya using code+S256 PKCE. Consent shows each selected profile; grants/tokens/settings/revocation remain independent. OAuth-row shields follow the normal draft/save contract.

33. Check metadata/issuer/exact redirect/resource/scope. Wrong issuer/resource/verifier, reused code/refresh, expiry and revocation fail. Browser logout alone does not revoke an independent grant.

34. Exercise all16 main/OAuth-client pack combinations, active Full→Write/Read/Blocked, discovery and stale calls. Existing access/refresh and new authorization respect current access.

## MSC116-LOCAL — Persistence and guide parity

Baseline: Switch the existing frontend runtime serially using its established local-mode route; retain and restore the original HTTP configuration.

35. In local Dating/Work/Community repeat four-pack selection, child X/tick, parent X/save, draft preservation during key changes and ordinary profile edits.

36. Reload IndexedDB-backed state: saved packs survive and account switching leaks no draft/secret. Settings/landing do not bootstrap the full demo graph. Check local admin API/MCP save parity.

37. Walk local EN/HU desktop/mobile parent/selector/help guides for member and role surfaces. User-edited help is not overwritten by seed updates. Restore the original HTTP runtime.

38. Run OAuth/Events/callback/webhook JUnit and Go MCP regressions serially. Frontend tests require frontend-sync stop, watcher exit, capacity check and restoration even on failure.

## MSC116-EVENTS-SETUP — Protocol, subscription and lifetime

Baseline: Use disposable development callbacks with valid HTTPS and signed-challenge echo; two accounts, two clients for one account, base/group identities and owned event/asset resources. This is development protocol QA, not real vendor-host or production qualification.

39. Prepare and verify the callback fixture and exact cleanup boundary. Keep tokens, callback URLs/secrets and personal payloads out of evidence.

40. On /mcp/private with MCP-Protocol-Version2026-07-28, discovery advertises Events. Anonymous /mcp and static API-key stdio do not advertise background Events.

41. Write/Read catalogs are empty; Read/Full and Full/Read cannot subscribe. Full/Full exposes only permitted event.changed/event.encounters/asset.changed with required resourceId; group identities have no base assets.

42. Subscribe to owned resources after a signed random challenge. Failed/mismatched/stalled challenges leave no active subscription.

43. Reject unknown events/arguments/modes, unsafe URLs and invalid whsec_ or decoded key sizes outside24–64bytes. Raw secrets never appear in responses/logs/plain Mongo fields.

44. Identical subscriptions retain ID; TTL/key refresh retains identity; different owner/client/resource/callback changes it. Concurrent refresh/unsubscribe cannot resurrect stale state; conflicts are retryable.

45. Challenge cache is scoped by principal/callback/key and expires after5minutes. Key change re-verifies; dual signatures last2minutes. Restart retains encrypted keys, expiry and state.

46. Default/null TTL is1day; shorter positive ttlMs is not extended; no-expiry requests remain finite. Expiry stops delivery; resubscribe changes generation and invalidates old queued work.

47. Unsubscribe twice succeeds; other users/clients cannot unsubscribe it. Full→Write/Read still permits unsubscribe and clears the secret. Valid OAuth refresh preserves a subscription.

## MSC116-EVENTS-DELIVERY — Publication, retry and privacy

Baseline: Use normal application/API mutations on disposable resources, a controlled receiver and retained queue/subscription snapshots.

48. Publish ordinary event/asset changes. Only matching resource/account subscriptions receive compact summaries; participation changes publish event.changed.

49. Complete a fixture Mingle event normally. event.encounters contains revision/total once per revision; retrieve pairs through the paged tool. Personal decision writes remain unavailable.

50. Validate Standard Webhooks signatures against exact UTF-8 bytes, message ID and timestamp, including X-MCP-Subscription-Id. Retries retain eventId/body with a new signing time; user text remains data.

51. Drop the response after acceptance: bounded retry retains eventId.2xx marks sent;410 stops the subscription;413/permanent4xx do not retry; transient errors follow5s/30s retries.

52. Restart only the owning process with a claimed delivery. Recovery follows the60s lease, including demo context. Record at-least-once behavior without an exactly-once claim.

53. After enqueue, revoke grant/client, block or lower either pack to Read, remove membership or ownership. No later network delivery occurs; a new subscription cannot revive the old generation.

54. Purge an isolated disposable account and verify subscription/queued-payload removal. Check7day delivery retention and expired-subscription retention for a further7days; ordinary watch policy stays unchanged.

## MSC116-EVENTS-BOUNDS — Resource limits and network security

Baseline: Use bounded development workloads and controlled destinations; preserve at least the required memory headroom and keep only one application stack running.

55. Measure default4callback-starts/s, burst4,8concurrent callbacks and2verifications/process, overrides and safety ceilings. Virtual threads preserve the shared semaphore and real/demo context.

56. Rate-blocked rows remain pending without claim/rewrite/retry consumption. Slow callbacks cannot accumulate unbounded waiting threads; body limit4096bytes and total deadline10s apply.

57. Check admission near100active subscriptions/profile,1000pending Events/profile and10000/database with disposable data. App actions remain usable; overflow records a durable gap and refresh reports truncated. Record concurrent-admission limits.

58. Use controlled public/private DNS changes to verify the actual connection resolver denies loopback/private/link-local/metadata/reserved/ULA/mapped IPv4 and unsafe numeric destinations. TLS verifies the original hostname; redirects and HTTP downgrade are not followed.

## MSC116-ROLES — Privileged readers, node attention and development packages

Baseline: Use retained app-admin/operator fixtures, disposable producer inputs and the development MCP packages. Verify the existing development Registry and normal registered-node prerequisite before the operator report reads and node producers; retain their state through the existing paired Registry fixture. Real ChatGPT/Claude accounts, production deployment and directory submission stay outside this campaign.

59. App-admin settings return desktop API keys and MCP rows in one GET and save atomically. Blocking an old admin key denies overview without breaking the existing desktop endpoint.

60. Role credentials expose no role tools with Write. Read/Full expose adminOverview only for app-admin and operatorMeasurements/operatorRevenueReports only for operator. Wrong/revoked roles fail forced calls.

61. Role credentials cannot invoke member organizing commands, legacy watch, moderation, payments, update approval, report sync or configuration changes. Full adds no role writes.

62. Full/Full admin discovers only admin.attention; operator only operator.attention; actual dual roles both. resourceId=node is required and another resource is denied.

63. Exercise existing node-member/report-feedback/release producers. Compact role summaries contain no member IDs/secrets; replay does not duplicate delivery/reset retries. Authorized aggregate reads do not mark human viewed state or add a polling worker.

64. Queued role deliveries stop after role loss, owner block, either pack Read or grant revocation/expiry. Unsubscribe works after Full→Read; existing signature/throttle/security rules still apply.

65. Run the packaged authenticated development MCP’s positive/negative review cases with isolated identities: permitted reads/organizing actions and refusal of personal decisions/privileged writes. Verify actual package version and effect annotations.

66. Run the anonymous help-only development package cases separately. No personal tool/Events discovery or authenticated authority may leak into that package.

67. Compare the English/Hungarian MCP guide with the tested development setup, key lifecycle and four-pack behavior. Record actual vendor-host/Scheduled/production-link qualification only in the separate live-deployment follow-up, never as a development PASS.

## MSC116-FEEDBACK — FormFlow, choices and guides

Baseline: Prepare the approved completed-case/pending-feedback baseline and snapshot it before actions. Use the ordinary card and FormFlow, not a fabricated successful result.

68. Open a pending Feedback evaluation from its card. The Start feedback badge has the shared30px height and aligns with neighboring media actions.

69. Check service image/title/provider/case in the existing event-style FormFlow. Missing/hidden/deleted service images use the existing placeholder without leaking private images.

70. Each of4criteria has five separate labelled choices; no numeric input, slider or free-text field. Selecting one criterion preserves the others; incomplete forms cannot submit.

71. Save the four selected labels normally and verify their persisted values, read-only reopen and reload. Internal numeric codes are not a user-facing 1–10 scale; the card must not display an average or /10 score. Invalid direct values fail the API rule.

72. Check local feedback save/reload/pagination parity. Image metadata arrives with the page, without per-card fetch/seed loading. Restore original HTTP configuration afterward.

73. Walk all Feedback evaluation guide anchors in EN/HU desktop/mobile:4criteria, save and close. Check labels, overflow and event-style navigation/summary; sample ordinary event feedback/rating for regressions.

## Shared fix propagation

74. For every shared fix, propagate applicable source changes and add the exact remaining verification to the existing template QA. Record product-only behavior as N/A there; do not run template QA as part of this campaign.

## MSC119-INTRO — First-visit guide-button behavior on monolith

Baseline: Keep the existing monolith and authenticated campaign fixtures. Use isolated anonymous entry profiles for this block. Accepted MSC-115 guide coverage and already assigned API/MCP, Feedback, call/volume and role guide checks are not repeated. EXPLANATION-GUIDE-001 stays closed; this block adds no testcase or ledger row.

75. Retain the current runtime and other campaigns’ state. Prepare the existing versioned anonymous browser-session launcher with introduction auto-dismiss disabled. Verify its configured entry URL, consent baseline and isolated storage before launch. Clear only this test’s disposable origin state when a fresh visitor is required; never clear a personal profile or fabricate consent/preferences. Use the current frontend without another server or compiler.

76. Open entry as a fresh visitor and wait for consent readiness. The lightbulb receives exactly one introductory step: landing.guide / guide-launcher, progress 1/1. It explains current-screen help, Next/Back/Done, dragging the lightbulb and bell, red-X hiding and persistent Side menu Explanations OFF/ON. No additional introductory step or popup.

77. Check EN/HU at 1280×900 and 390×844, plus short 390×560. The text fits five lines without losing the recovery instruction. The highlight belongs to the visible lightbulb above consent, not an obscured control. Preserve existing desktop-beside/mobile-above placement.

78. In separate fresh isolated runs close the introduction with Done, X, shade, Escape and browser Back. Consent remains pending with no acceptance/rejection or privacy-choice mutation. Reload after each dismissal: the introduction does not automatically reappear.

79. Reopen as a previously consented visitor and after the normal seed/version upgrade path: the introduction is not newly forced on that known visitor. Opening another surface or leaving entry removes its temporary guide context; a late response cannot restore the closed introduction.

80. After ordinary consent handling, opening the lightbulb starts the current screen’s normal guide. Preserve a previously saved internal Explanations OFF preference through public entry and return; restore it afterward. Dragging the launcher is only a drag, not an accidental guide activation. Do not repeat the accepted consent-tour and role-launcher matrices.

81. Repair any observed introduction defect through the existing guide/seed/launcher owner and verify only the affected behavior. Propagate applicable shared fixes to the template and record their exact remaining checks in its existing QA without running them here. Restore only this block’s isolated browser/preferences/session state and close its windows through the same versioned launcher. Preserve the authenticated campaign actors and retained fixtures for the remaining work; retain no new build/server owner.

## KVM sample and closure

Baseline: All remaining monolith/local checks, including the guide introduction, precede one serial KVM backend sample. Template runtime and live-deployment execution are separate campaigns.

82. Stop monolith before the existing KVM startup. Sample settings/auth/domain/Events API/MCP transport with equivalent isolated data; verify domain database separation and avoidable cross-service HTTP calls. Do not replay the full UI for a packaging-only sample.

83. Assess request counts, CPU and latency against comparable prior measurements. Record increases too; functional success is not performance parity. Keep stress focused on the concrete Events behavior.

84. Revoke disposable keys/grants/subscriptions through the normal flows, restore only retained fixture/session snapshots and verify cleanup. Leave KVM off and restore the original monolith/watchers; retain no duplicate owners.

85. At campaign end, record block results and defects once, reconcile the three QA rows and CSV/XLSX totals, and update the handoff. Attribute the introduction result to MSC-119 within this consolidated campaign; do not create a second QA record or replay. Keep precise unproven development boundaries. Template and live deployment retain their separate records; removing the standalone checklist does not close any retained publication obligation or imply unexecuted checks passed.

## Campaign results — 2026-10-15

Closed for the delegated development scope. Results below credit completed work once; no full application or Feedback replay was performed.

| Steps | Block | Result | Evidence and boundary |
| --- | --- | --- | --- |
| 1–3 | Preparation | PASS | Retained fixture, isolated managed actors and single settings GET established. |
| 4–17 | Settings | PASS | Nested drafts, one parent PUT, profile ownership, failed-save retry and a real stale revision conflict verified. |
| 18–20 | HTTP guides | PASS | EN/HU desktop/mobile contexts checked; 37 recorded runs and 291 steps. Popup transitions retained separately. |
| 21–31 | API and domain contracts | PASS | Manual-client 16-pack matrix, API packs, live downgrade, discovery and permitted/forbidden operations checked. Development package evidence retained; no vendor-host acceptance claim. |
| 32–34 | OAuth | PASS | Independent account grants, PKCE and negative identity/rotation cases, live access enforcement and browser-logout independence checked. |
| 35–38 | Local parity and regressions | PASS | IndexedDB save/reload and role settings checked; 24 local guide runs / 180 steps. Latest Events regression: 137 tests in 17 suites, zero failures/errors/skips; focused embedded and Go checks also passed. |
| 39–47 | Events setup | PASS | Discovery, challenge, resource filters, pack matrix, signing-key boundaries, TTL, refresh and unsubscribe checked. |
| 48–54 | Events delivery | PASS | Real producers, encounters, signatures, retries, claimed-work restart recovery, authority loss, account purge and retention checked. At-least-once delivery retained. |
| 55–58 | Events bounds | PASS WITH RECORDED LIMIT | Concurrency, verification admission, response bounds, queue limits and DNS/TLS/redirect protections checked. Count-based queue admission is not a global reservation: concurrent publishers may occupy previously admitted slots. |
| 59–67 | Roles and development packages | PASS | Role readers, forbidden writes, node catalogs/producers, queued authority and anonymous/private package separation checked. Real vendor-host/Scheduled/publication qualification remains separate. |
| 68–73 | Central Feedback | PASS | One combined page request; real labelled choices, normal submit, read-only reopen, owner counters, green badge and no numeric card score. HTTP/local and retained EN/HU guides passed. Rejected synthetic 8/9 → 8.5 UI evidence is excluded. |
| 74 | Shared fix propagation | RECORDED | Applicable guide/access fixes propagated to existing template sources and QA. Template runtime remains NOT RUN; product Feedback is N/A there. |
| 75–81 | First-visit introduction | PASS | Consolidated MSC-119 scope: EN/HU desktop/mobile/short viewport, dismissal persistence, unchanged consent, preference preservation and stale-response suppression. Existing context priority corrected in product and template. |
| 82 | Serial KVM sample | PASS | Eight updated assemblies started. Native auth, combined settings/Feedback page, real OAuth, MCP Events catalog and domain read passed; revoke returned 200 and subsequent access 401. Full UI was not replayed. |
| 83 | Focused measurement | MEASURED; NO COMPARABLE BASELINE | events/list: 3 warmups + 20 samples, concurrency 1, zero errors, median 97.06 ms and p95 121.10 ms. Resource window includes background work. No performance-parity or regression claim. |
| 84 | Cleanup | PASS WITH RETAINED METADATA | 17 campaign credentials revoked through owner APIs. Registry and Mongo fixture/session snapshots restored; active campaign credentials, enabled subscriptions and campaign events are zero. One inactive public DCR registration remains. KVM off; original 8 monolith containers restored for cleanup, then stopped at the user’s request. frontend-sync remains off. |
| 85 | Documentation and ledger | COMPLETE | QA records and PDF updated; task accounting and Project closure recorded separately. No duplicate MSC-119 campaign or added QA row. |

Early temporary artifacts lost during the workstation restart are supported by retained session observations, not reconstructed files. Final aggregate evidence is retained in `guides/qa/evidence/general/MSC116-closure-20261015/`. Template runtime and external deployment/host acceptance remain outside this closure.
