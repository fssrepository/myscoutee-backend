# Event mode QA — PASS / CLOSED, 2026-09-22

The user resumed and delegated browser/API execution. This is the separate
EVENT-MODE-REGRESSION-001 feature check, not the general manual-QA campaign.
Use the stable event and INTEGRATION-API-001 checklists; do not mark the full
campaign complete from this feature-specific evidence. The numbered scope below is closed;
explicit adapter/service evidence limits remain recorded.

## Final numbered execution status — 03:00 CEST

Step numbers refer to the stable EVENT-MODE-REGRESSION-001 checklist. Supporting
unit/adapter evidence is distinguished from visible browser journeys.

| Step | Result | Evidence / remaining boundary |
| --- | --- | --- |
| 1. First Explore open | PASS | 166 ms, held real preference response; no premature event query. |
| 2. Filter apply/cancel/reload | PASS | Open spots + Mingle, badge 2; persisted settings. |
| 3. Compact mobile controls | PASS | Earlier 320/390 px measurements; native viewport restored. Do not reintroduce emulation. |
| 4. Landing/About/API help | PASS | EN/HU rendering; About reused branding, API controls 34 px; landing version 1.0.1. Admin geometry is not covered. |
| 5. Standard external link | PASS | Create/update/clear/restore/reopen passed. Nova, before joining fresh Standard h1790038436581, opened External Info in a new tab at the exact stored URL (02:56:46 CEST). |
| 6. Standard membership | PASS | UI publish, Nova request, Casey approval, 2 accepted members. |
| 7. Tournament | PASS | Real review worker ran at 02:05:51 with the reversible 60-second fixture; UI Add Score saved Casey +3. Reopened Groups: Casey 3 points / 1 update, Nova 0 / 0. |
| 8. Ordinary feedback/friendship | PASS with scoped evidence | Standard organizer feedback submitted (200) and reopened with saved answers. Met/mutual branches: 43 supporting backend tests, not a browser friendship journey. |
| 9. Speed meeting rounds | PASS | Two actual rounds, pause/resume/manual advance/automatic transition; saved history reopened. Select Past to inspect past round cards. |
| 10. Unique feedback peers | PASS | HTTP fixture: 8 accepted + 1 pending, two actual rounds; Nova gets 6 distinct attendee cards + organizer. All 7 submitted (200). API 28 pairs across 10/10/8 pages match delivered webhook revision 4. |
| 11. Local restart | PASS — adapter/IndexedDB | Real Chromium reload restores preferences, link, paused state and two completed rounds; not a full local-app UI journey. |
| Cleanup | PASS | Original preferences restored; watch disabled; UI key revoked; subsequent connect 401. All 11 disposable QA events are in Trash (T), receiver stopped, integration/session snapshots reset; final supplemental logins ended through normal Logout. Native viewports preserved. |

Menu correction: the rejected dock request was reverted by the user and is not
reintroduced. Runtime menu items use the same default tinted item configuration
as ActivityEventInfoCardMenuConverter; the earlier title/min-width CSS overrides
are removed. Native browser measurement: item width equals menu content width
249.64 px, height 36 px, no underline, anchored placement. Actual Tables action
opens saved Round 1 / Table 1 with two members when Past is selected. Evidence:
`final-menu-version.json`, `menu-standard-layout.png`, `menu-tables-navigation.txt`.
The earlier menu narrowing claims below are superseded by this correction.

## Continuation after 02:05 CEST

- Chat textbox overlap: removed only the two `z-index: 70` overrides from
  `.chat-compose-box`. Existing watcher compiled; native browser reported
  composer `auto`, open menu `40`, and the composer tools opened normally.
  The user subsequently confirmed the chat is correct. No group-menu styling,
  shared-menu appearance or viewport change was made for this correction.
- Step 7.4: versioned timing fixture armed at 02:05:11, actual review worker
  completed at 02:05:51. Its original 1800-second interval was restored;
  real run history was retained. Evidence: `tournament-timing-result.json`.
- Steps 7.5–7.6: Casey opened Groups → Group A → Add Score, entered +3 and
  `QA MODE score persistence`, saved, closed Groups, reopened and expanded it.
  Persisted standings show Casey 3 / 1 update and Nova 0 / 0. Evidence:
  `tournament-score-write.json`, `tournament-score-reopened.txt`.
- Runtime checkpoints: `tournament-before-scores` captures event
  `h1790031368189`; `mingle-completed-history` captures
  `f4b67368-7232-485e-81b1-7517f1a9b230`. The latter was restored at
  02:15:57; captured collection documents matched exactly. This was an
  idempotent runtime restore, not a claim that feedback/delivery state rewinds.
  The stable guide now contains exact timing/capture/restore commands.
- API/public external-link boundary: the public list DTO omitted `sourceLink`
  while persistence already contained it. Mapper/DTO corrected; focused mapper
  suite passed 7 tests. Nova's real External Info action opened the saved URL
  from event `711e22ee-60ca-407c-8221-72fa6476be51`. Target response interception
  proves URL navigation only. Evidence: `public-external-link.json`.
- Step 8 uses disposable Standard event
  `0252a93a-21e4-4c78-a2ee-2dc1282cb5f9` (caller ID
  `8718f4f9-34de-491c-a5eb-fa7d602f3782`), created through the SDK with a past
  source interval. Nova claimed the link, opened Invitations → Past and accepted
  normally. Feedback submission returned 200 at 02:23:44; Feedbacked → View my
  feedback retained Excellent / No major change / Reliable One. Evidence:
  `standard-feedback-submitted.json`, `standard-feedback-reopened.txt`.
- Step 10: created `d357a203-7f8d-4c64-b5dc-31be16c4edef` (caller ID
  `d9d7d34c-dd78-4a25-8d7c-f65bedcdfd5b`) with group size 8. Versioned
  `stage-feedback-peers` prepared 8 accepted memberships and pending Riley;
  its pre-runtime reset/restage was exercised. Casey started round 1 normally,
  opened Tables (8 visible members), ended the round, observed automatic round 2,
  opened its Tables (same 8), then completed through the normal UI. No rounds,
  scores, feedback or outcome records were staged.
- Nova's one event feedback wizard contained the organizer plus exactly Sophia
  Lane, Lina Stone, Mia Grant, Elijah Grant, Leo Reed and Lina Park; Riley was
  absent, repeated table peers were deduplicated. All 7 cards were submitted
  successfully at 02:31:58. A completed checkpoint
  `mingle-six-peers-completed` was captured before submission. Evidence:
  `peer-table-1.txt`, `peer-table-2.txt`, `peer-feedback-detail.json`,
  `peer-feedback-submitted.json`.
- API encounters returned 28 unique pairs of 8 opaque participants over three
  pages (10/10/8), revision 4. The delivered `event.encounters` callback matched
  the combined pair list exactly. Evidence: `peer-encounter-pages.json`,
  `peer-encounter-parity.json`. The same external-link event now has matching
  owner-editor and API reads as well as the earlier public navigation proof.
- User reported saved-feedback body clipping. Browser diagnosis: body client
  height 678 px, scroll height 2119 px, `overflow: hidden` from `bodyLayout: fill`.
  Changed only that popup model to the shared scrollable `default` body layout.
  Existing watcher compiled. Mouse wheel reached scrollTop 1441; last card bottom
  755.59 was within body bottom 755.80, header stayed at y=16, native viewport
  remained 840×759. Evidence: feedback-body-scroll.json. No shared popup CSS changed.

## Corrections retained

- Reverted the unwanted 23:49 frontend/backend commits in cd8189f1 / dad8ee6c.
  About identity reuses the existing operator branding used by the landing logo.
  Separate founder metadata was removed. Earlier founder-field verification is
  superseded and does not describe current code.
- Desktop document consent actions use the existing AppMenu content sizing.
  Browser measurements: Cancel 67.2 px, Accept 148.94 px, menu 221.58 px.
- Live table members use the shared header countdown badge beside Close, with
  neutral/blue running and warning/amber paused/break tones. Table subtitle is
  unchanged. The round/status block has been removed from the SmartList body.
  Eight focused member-popup/store tests pass, including local ticking, frozen
  paused time, no HTTP on repeated countdown reads and ordinary mode isolation.
  The existing frontend watcher compiled and synced the change successfully.

- Table shortcut uses the same rose palette as the Speed meeting mode selector;
  the browser confirmed its rose foreground/gradient.
- AppMenu labelled actions now default to existing content sizing; explicit
  `actionSizing: 'fill'` retains full-width behavior. No per-popup CSS workaround.
  All 12 AppMenu tests passed; real Join review footer measured a 138 px button
  in a 795.22 px footer. Both managed windows use native viewport sizing;
  previous responsive-test overrides were explicitly reset and rechecked.

## Verified in this resumed run

- About displayed MyScoutee through four open/close cycles: one exact
  `/api/deployment/configuration` request on load, no additional request on About
  interaction. The current landing/i18n/repository suite passed 21 tests.
- Explore opened in 166 ms while its real preference response was withheld.
  No explore query ran before preferences arrived. Apply, cancel and reload
  persistence passed; Open spots + Mingle produced badge 2.
- At 320/390 px filter/order/view controls measured 36 px in that order. Filter
  popup fit both widths with a dim backdrop; desktop popup width was 380 px.
  Device metrics overrides were subsequently cleared on both managed browsers.
- Disposable event `aea04117-bd92-4442-8ada-46746f1a86b8` completed two rounds
  with Casey/Nova. Pause, resume, manual end and automatic advance were exercised.
- A held Start round confirmation raced automatic advance; submission returned
  409 MINGLE_STATE_CHANGED and retained round 2. Actual live Table 1 listed both
  participants. Completion returned revision 6.
- Encounters before completion returned 409. Completed SDK encounters and the
  event.encounters webhook had identical pairs and revision 6: one unique pair,
  using qa-casey / qa-nova partner IDs. Offset 1 returned an empty page and null
  nextOffset. Encounter payload assertions excluded internal user IDs/emails.
- Reopening Nova's claimed invitation retained membership without duplication.
- Standard event `h1790029353341` was created in the UI, link updated/cleared/
  restored and reopened, published, requested by Nova, then approved by Casey.
  The ordinary member header changed from 1 member + 1 pending to 2 members,
  retaining normal admin/member actions. Proof: standard-created.json,
  standard-links.json and standard-members-approved.txt. A transient cleared
  input read as `https://n/`; explicit clear/blur/save and full sequence repeat
  passed without a code change; do not attribute an unproven cause.

Private evidence/scripts: `frontend/.agent/mode-qa/`, including
`landing-branding.json`, `explore-responsive.json`, `stale-round-result.json`,
`runtime-phases.json`, `completed-resume.json`, `encounters-resume.json` and
`countdown-vitest.log`. Do not publish private invitation URLs or SDK credentials.

## Historical investigation — superseded by final status above

- Tournament UI create/publish/request/approve passed for disposable event
  `h1790030034508`. Start initially returned an unchanged RS state: command
  projection omitted the definition timeline and skipped group generation for
  definition-only events. The repair reuses the visible-list timeline mapper,
  saves canonical stage runtime before generation, and reads runtime overlays
  in the assignment planner. Browser start now returns A; group/scoring
  verification is still ongoing. Do not mark the whole Tournament flow passed.
- Follow-up evidence: the focused ActivitiesEventsService (62), EventScheduler
  (30) and ActivityEventSubEventsMapper (7) tests passed: 99 total. The scheduler
  case covers both embedded stages and definition-only stages with canonical
  runtime. Existing watchers compiled production; the test command excluded
  production compile/classes/resources tasks.
- New disposable Tournament `h1790031368189` (`QA MODE 20260922 Tournament retry`)
  passed UI create/publish/request/approval/start. Its single Group A contains
  both Casey and Nova, with ordinary standings and participant menus. Evidence:
  tournament-retry-created.json, tournament-retry-members-approved.txt and
  tournament-retry-groups.txt. Scoring is correctly hidden while stage status is
  A; score-write/reload verification remains unproven until SR. Scheduled end:
  2026-09-21T23:56:00Z. The earlier empty-group fixture has four groups with only
  two participants and must not be used as proof of a valid full assignment.
- Stage runtime reads in the command path are batched per owner instead of one
  query per stage. The two-slot mapper test also needed a deterministic same-day
  anchor: its old relative timestamps crossed UTC midnight outside its day query.
- Drawing Speed meeting tables already enqueues targeted notification intents
  with eventId, roundNumber and tableNumber through the common Firebase outbox.
  Actual device delivery has not been proven in this run. The user explicitly
  requires push notifications and polling to remain independent. The attempted
  push-triggered refresh and its tests were removed; no frontend push/poll change
  remains. Do not treat those discarded tests as final implementation evidence.

## Explicit evidence limits

- Met/mutual-positive friendship branches use the 43 supporting backend tests;
  this is not a completed browser friendship journey (per checklist 8.3).
- Local restart is compiled adapter plus real IndexedDB/browser reload coverage,
  not a complete visible local-app journey (per checklist 11.4).
- API help geometry was measured; separate Admin help geometry was not tested.
- Targeted Firebase outbox enqueue was inspected. Actual device push delivery and
  automatic refresh of an already-open Group popup were not proven in this run.
- External destination responses were intercepted: the tests prove exact URL/new-tab
  navigation, not availability of example.org.
- These limits remain distinct from the newly requested, queued rating comparison.

## Historical runtime continuation (sessions now logged out)

Managed browser manifest:
`/tmp/myscoutee-qa-browser-sessions/INTEGRATION-API-001.json`.
Read current ports from it. Before any relaunch, verify the fixture baseline and
use `guides/qa/tools/open-checkpoint-browser-sessions.mjs`; preserve current native
viewport. The callback receiver uses port 18090; inspect its owner before starting
another process. Existing Docker frontend/backend watchers own compilation.

## Historical continuation at 01:35 CEST (superseded by final status)

- Hungarian About/CTA/format labels passed; original browser language restored.
- Foreign-owner API reads, encounters and invitations each returned 404. Repeated
  event creation is idempotent (`existing`), not an update endpoint; do not claim
  sourceLink updates through POST /events.
- Speed meeting cards now use the shared contextual status overlay; existing
  polling scopes its state to the viewed event. Main-event controls remain
  available after round one. 23 focused frontend tests passed. Browser observed
  Started -> automatic Completed; stale End round correctly returned 409.
- Context-menu pill sizing now honors existing content sizing instead of its
  unconditional 220 px minimum; long anchored titles wrap. Final geometry after
  the second CSS correction remains to be measured.
- Past-dated disposable event f4b67368-7232-485e-81b1-7517f1a9b230 completed two
  actual rounds. Nova submitted its organizer feedback through the UI (200).
  Two actors, one of them the organizer, do not prove a multi-attendee feedback
  list; the six-unique-peer / unrelated-attendee cases need separate evidence.
- A new failing scheduler test reproduced definition-only Tournament stages not
  closing: canonical runtime A was ignored in favor of the derived RS default.
  The repair reads runtimes in one batch and persists SR to existing canonical
  records without embedding definitions. All EventScheduler tests passed after
  the existing watcher compiled production.
- API PDF text already contains sourceLink, event read, encounters pagination and
  event.encounters callbacks at document version 1.0.1. No PDF regeneration was
  needed for these existing additions.
- Dev landing version: /app-version.json returned 404 and the component displayed
  a hardcoded v1.0.0 fallback. The fallback is removed; the existing dev asset
  sync now writes MYSCOUTEE_VERSION. A focused sync check passed 1.0.1 -> 1.0.2;
  only frontend-sync was stopped and recreated without rebuilding its image.
  HTTP now returns version 1.0.1; browser rendering still to verify.

## Queued release work — after QA, not completed by the dev fix

The user clarified the version requirement concerns **Netcup production partial
Docker Registry updates**, not only the dev stack. Installed application release
identity must follow a partial content update even when the Debian package is
not replaced. Inspect the production image/update/version source and preserve
signature/compatibility checks; the current temporary-image helper explicitly
requires the installed package version, so do not claim cross-version partial
release support from the dev sync test. Keep release Git tags and the user's
pending deb upload to the release tag in the release checklist. Do not publish
or deploy a release while this QA run is unfinished.

## Final closure — 2026-09-22

1. **Event Mode step 5.5 PASS:** normal UI created/published fresh Standard event
   `h1790038436581`, public, capacity 1–8, sourceLink
   `https://example.org/events/standard`. Nova's public Explore → External Info,
   before joining, opened exactly that address in a separate tab; only that tab
   was closed. Normal Delete Event returned 200. The earlier Standard edit and
   membership evidence was retained, not replayed.
2. **Feedback readback PASS:** saved organizer + six peer cards all persisted;
   native mouse-wheel scrolling reached the final card with a stationary header.
   The fix is the existing popup `bodyLayout: default` setting.
3. **Filter menus PASS:** existing Admin Jobs-style `bodyLayout: overflow` allows
   both format/topic menus beyond the compact filter popup. Measured menu bottom
   643.67 exceeded popup bottom 583.65, all four mode options fit (163 px client
   and scroll height). The user then confirmed both dropdowns. No shared-menu CSS.
4. **Invitations diagnosis:** the badge's three invitations were Upcoming;
   selecting Past explained the empty list. Upcoming displayed all three.
   No counter semantics or eligibility rule was changed.
5. **Cleanup PASS:** unwatch disabled the callback, UI revoke returned 200 and
   the same client connect returned 401. Original Explore preferences are
   false/false/empty/empty. Ten prior QA events and the supplemental Standard
   event are status T, verified directly in Mongo. Only the owned callback
   receiver was stopped. The versioned integration reset restored the retained
   session snapshot. Supplemental Casey/Nova UI logins were logged out normally;
   windows remain at native 916×869 and 840×759.
6. **Documentation:** stable fixture/reset/checkpoint instructions are retained.
   Sanitized evidence: `guides/qa/evidence/EVENT-MODE-REGRESSION-001-2026-09-22.json`.
   CSV/XLSX status is closed for this scope. New EVENT-ACTIVITY-RATING-001 is only
   queued in Event, without fixture implementation or execution.

The remaining release work is the separate Netcup partial-update/version/tag/deb
work above. No release or deployment was performed by closing this QA.
