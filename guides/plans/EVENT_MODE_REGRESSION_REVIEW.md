# Standard / Tournament compatibility review — 2026-09-21

Review baseline: backend `0d84eb91`, frontend `8392644b` (the frontend pointer
at that backend commit). Reviewed feature heads: backend `8d1f270b`, frontend
`276de8ad`, plus the working-tree repairs described below. This covers the
entire intervening feature history: 31 backend-repository commits and 20
frontend commits, including the intervening QA, i18n and PWA fixes.

The review used the history of shared owners and the cumulative source diff,
then exercised the affected event suites. It is not a claim that every UI flow,
every historic commit checkout or every repository test was executed.

## Regressions repaired

1. **Standard/Tournament editors depended on the Mingle state endpoint.**
   Both initial edit and publication reload awaited `queryMingleState` through
   `Promise.all`, including ordinary events. A slow Mingle request therefore
   delayed those editors. The runtime request now happens only after the loaded
   detail identifies a Mingle event and the request is still current. Seven
   regression cases cover both entry paths and replacement of an in-flight edit.
   Owner: `frontend/src/app/activity/components/event-editor-popup/`.
2. **A live table context leaked into an ordinary event editor member list.**
   The `eventEditorMembers` navigation branch did not clear `mingleLive`.
   This could retain live-table empty-list/polling rules in a Standard or
   Tournament member list. All member navigation now sets its mode explicitly;
   leaving live mode and destroying the popup also stop its clock.
   Owner: `frontend/src/app/activity/components/event-members-popup/`.
3. **The pending-only member filter disappeared for ordinary participants.**
   Frontend commit `16239f20` restricted the shared control to managers,
   although the prior ordinary-event view exposed it. Its original visibility
   is restored outside the read-only live-table context. Member popup unit
   tests cover this and live-context cleanup; server permissions are unchanged.

## Shared behavior examined

| Area | Finding / evidence |
| --- | --- |
| Event mode normalization and DTOs | Legacy absent/unknown modes still default to `Casual`; `Tournament` remains distinct. Mingle configuration is additive and normalized only for that mode in save paths. |
| Standard subevents, slots and publication | Existing definition-driven paths remain after the explicit Mingle branch. Save/publication, recurring-slot, capacity and membership service tests pass. |
| Tournament generation and scoring | Existing generators were not edited. `GeneratorModels` only adds Mingle-specific records; the leaderboard's new round/table branches require Mingle. Existing generator and leaderboard suites pass. |
| Tournament groups and resources | Shared UI now uses SmartList/accordion items; tournament actions, scoring, assets and pending-resource counters remain in the non-Mingle branches. Converter and group-counter tests pass. Stage changes still load the selected stage snapshot. No browser interaction proof is claimed. |
| Membership | Server owner parsing adds the `:mingle-round-...:table:` form before the existing `:group:` handling. Existing membership service suite passes. Local Mingle actions explicitly reject both ordinary modes without changing memberships, rates, sessions or notifications. |
| Feedback | Shared completed-table peers are used only for Mingle; ordinary event participant selection remains. Explicit backend and local tests now cover both `Casual` and `Tournament`. Local Mingle tests cover more than five peers and an empty peer set without unrelated attendee fallback. |
| Met and friendship | **Intentional shared change, not mode-isolated:** the requested `Met AND reciprocal positive ratings` gate applies to all three formats. Ordinary completed-event membership still supplies Met evidence; Mingle supplies completed-table evidence. Existing scores are preserved. This is not a claim that Standard/Tournament friendship behavior is identical to the pre-feature baseline, which created friendship directly from attendance. |
| Ticket copies / assets | Mingle configuration is copied alongside existing event fields; asset mode normalization adds Mingle. Existing payment and ticket state machinery was not redesigned by these additions. |
| Explore / preferences | Explicitly requested shared UX change: saved page-specific filters and optional format filtering before pagination. Empty mode retains all formats. Home filter preferences remain separate. |
| External event link / integration | Explicitly requested additive `sourceLink`, format/configuration and encounters/invitation APIs. Existing default webhook types stay `event.changed` and `asset.changed`; encounters require opt-in. No real SDK-to-UI scenario was executed in this review. |
| Canonical demo seeds | JSON comparison against the baseline: one event and nine memberships added; zero existing event/member documents changed or removed. |
| PWA / i18n | These are shared changes in the reviewed interval, independent of event format. Existing focused suites pass (20 cases). |

Capacity input typing also changed in the history: the maximum is allowed to
be typed before blur normalizes it. The blur/save capacity normalization remains;
this was not reverted as an event-mode regression.

## Verification

- Backend initial focused run: **249 passed**, nine classes:
  `ActivitiesEventsServiceTest` (61), `ActivitiesEventLeaderboardServiceTest`
  (18), `ActivitiesEventFeedbackServiceTest` (15), `ActivitiesMembersServiceTest`
  (78), `ActivityTournamentGroupCounterServiceTest` (2),
  `EventFriendshipProjectionServiceTest` (5), `UserRatesServiceTest` (21),
  `EventSchedulerTest` (29), `EventGeneratorsTest` (20).
- After adding explicit Standard/Tournament parameter cases, the affected
  feedback/projection suites passed **22/22** (16 + 6), replacing the prior
  20 cases. Thus **251 distinct backend cases passed** across the reviewed set.
- Frontend event suites: initial **79 passed, 2 failed** (20 files). Three new
  local regression cases subsequently passed in a **9/9** focused rerun.
  Shared i18n/PWA suites passed **20/20**. Aggregate distinct results:
  **102 passed, 2 pre-existing failures** (22 files).
- Both HTTP failures also reproduce when the HTTP event service module is
  replaced by its exact `8392644b` source in the standalone test transform:
  **11 passed, the same 2 failed**. The failures are:
  - subevent page expectation omits the existing `canAccessResources: false`;
  - legacy `getRecords` catches backend errors and returns `[]`, while its
    test expects rejection. This production behavior predates the feature.
  These were initially recorded without modifying the HTTP adapter. Both were
  subsequently investigated and repaired at the user's request; see below.
- Existing `frontend-sync` watcher built and synced the final UI edits at
  **16:30:47 Europe/Bratislava**. No parallel production build was started.
- Parent/frontend `git diff --check` passed.

Backend commands used `docker exec myscoutee ./gradlew :projects:profile:test`
with selected `--tests` classes, `--max-workers=1 --no-daemon`, and excluded
`:projects:profile:compileJava`, `:projects:profile:processResources`,
`:projects:profile:classes` because the existing watcher owns production compilation.
Standalone frontend runs used the local Vitest binary, one worker, jsdom,
Angular testing initialization and inline component resources; execution configs
and logs are under ignored `frontend/.agent/event-history-*-vitest*` and
`frontend/.agent/pre-mingle-http-events-vitest*`. Test cases themselves are versioned.

Not proved here: full browser Standard/Tournament flows, live Mongo save/reload
for every edited path, an actual IndexedDB browser restart, SDK invitation claim
through sign-in/payment, and installed-PWA upgrade. The successful unit and
watcher checks do not replace those checks. No managed QA checkpoint, real user
membership or payment was mutated for this review.

## Queued icon adjustment

API settings and admin statistics now use the `question_mark` glyph instead of
`help_outline`. The API header uses the normal popup icon size; the admin help
icon is also `1.14rem`. The API help content uses the same uncircled glyph.
Following the user's size comparison, icon-only actions beside the close button
now share its common **34 × 34 px** sizing rule. No API-specific button sizing
was added; existing borders and colors remain.

## Follow-up fixes from reported UI defects

- Explore opens synchronously. Its SmartList loads saved preferences before
  requesting events, then updates the filter signal and badge. Concurrent page
  requests share preference loading; obsolete responses after cancellation,
  close/reopen or user change cannot populate the current popup. Failed
  preference loading can be retried and does not load an unfiltered event list.
- A separate first-click defect was reproduced with the real constructor and
  Angular effects: initial user synchronization closed the popup just opened by
  pending navigation. Initializing the current identity from the store fixes
  that ordering; actual user changes still close the popup. The regression test
  failed before this fix and passes afterward.
- Header order is filter, order, view. All three controls collapse on mobile;
  desktop labels remain. The filter popup is small, content-height, one column,
  with its dim backdrop and compact mobile presentation.
- Both previously reported HTTP test failures are resolved. The subevent test
  now includes the existing `canAccessResources: false` field. Legacy
  `getRecords` propagates backend failures instead of presenting a successful
  empty list; successful empty responses remain supported.

Follow-up verification: **24 distinct targeted tests passed** (8 Explore,
3 filter popup, 13 HTTP adapter). Isolated rendering of the source CSS at
320, 390, 760 and 1024 px confirmed equal help/close dimensions, viewport-fitting
filter panels, mobile label collapse and the dim backdrop. This is layout
evidence, not an interactive application browser-flow test. The existing
`frontend-sync` watcher compiled and synced the final edits at **16:43:12
Europe/Bratislava**, without a second production build. Local test/layout
artifacts are under ignored `frontend/.agent/explore-*` and
`frontend/.agent/check-explore-popup-layout.mjs`.

## Reviewed commit inventory

Backend repository:

```text
fb807319 mingle fix
564bdacf pwa fix
a5cb8461 mingle fix
cd5dd981 mingle fix
05f5e0e1 qa fix
3c6e2cdc migle fix
e6f0daab junit test fix
62476772 junit test fix
485fee76 junit test fix
8f8312c2 junit test fix
bf7457f9 jnuit fix
bfffc53f mingle fix
d78b93c3 mingle fix
19636283 mingle fix
d170cc5d mingle fix
d2c2cd98 mingle fix
4248f2f9 mingle fix
bfdb6e7b mingle fix
7604d438 mingle fix
bc1cb1a6 mingle fix
f4a679cc mingle service
34b3d722 mingle fix
5af99001 mingle fix
01e60a39 mingle fix
6eab312c mingle fix
670f0149 mingle fix
342d8243 mingle fix
d74baec4 mingle fix - not stable
32fa2db4 mingle fix - not stable
07d7c1f2 mingle fix - not stable
8d1f270b mingle fix - not stable
```

Frontend submodule:

```text
c4ac7ac0 pwa fix
5766d597 qa fix
dfa3c0b6 mingle fix
691289e6 mingle fix
ae9bafee mingle fix
a112e696 mingle fix
3afc73e3 mingle fix
0b0e94b1 mingle fix
392f336c mingle fix
b75b8f86 mingle fix
8b80cf2c mingle fix
16239f20 mingle fix
b52724a9 mingle fix
f797edfb mingle fix
fc92a162 mingle fix
9b6ac7c9 mingle fix
4386a17f mingle fix - not stable
0f4b55a0 mingle fix - not stable
38c74735 mingle fix - not stable
276de8ad mingle fix - not stable
```
