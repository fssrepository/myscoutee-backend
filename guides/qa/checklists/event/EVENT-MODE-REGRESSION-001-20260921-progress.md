# Event mode QA — in progress, 2026-09-22

The user resumed and delegated browser/API execution. This is the separate
EVENT-MODE-REGRESSION-001 feature check, not the general manual-QA campaign.
Use the stable event and INTEGRATION-API-001 checklists; do not mark the full
campaign complete from the partial evidence below.

## Numbered execution status — 01:55 CEST

Step numbers refer to the stable EVENT-MODE-REGRESSION-001 checklist. Supporting
unit/adapter evidence is distinguished from visible browser journeys.

| Step | Result | Evidence / remaining boundary |
| --- | --- | --- |
| 1. First Explore open | PASS | 166 ms, held real preference response; no premature event query. |
| 2. Filter apply/cancel/reload | PASS | Open spots + Mingle, badge 2; persisted settings. |
| 3. Compact mobile controls | PASS | Earlier 320/390 px measurements; native viewport restored. Do not reintroduce emulation. |
| 4. Landing/About/API help | PASS | EN/HU rendering; About reused branding, API controls 34 px; landing version 1.0.1. Admin geometry is not covered. |
| 5. Standard external link | PARTIAL | Create/update/clear/restore/reopen passed; public action pending. |
| 6. Standard membership | PASS | UI publish, Nova request, Casey approval, 2 accepted members. |
| 7. Tournament | IN PROGRESS | Create/publish/approve/start/group assignment passed. Retry stage scheduled to enter score review at 01:56 CEST; score write/reopen pending. |
| 8. Ordinary feedback/friendship | SUPPORTING TESTS PASS | 43 backend tests: feedback 16, rates 21, friendship projection 6. Full ordinary feedback browser journey not yet proven. |
| 9. Speed meeting rounds | PASS | Two actual rounds, pause/resume/manual advance/automatic transition; saved history reopened. Select Past to inspect past round cards. |
| 10. Unique feedback peers | SUPPORTING TESTS PASS | Actual organizer feedback submitted in HTTP UI; isolated local adapter restored seven unique attendee cards, excluding pending outsider. Two HTTP actors do not prove the larger visible peer list. |
| 11. Local restart | PASS — adapter/IndexedDB | Real Chromium reload restores preferences, link, paused state and two completed rounds; not a full local-app UI journey. |
| Cleanup | NOT RUN | Restore preferences; unwatch/revoke test key; disposable resources and managed-session restoration. |

Menu correction: the rejected dock request was reverted by the user and is not
reintroduced. Runtime menu items use the same default tinted item configuration
as ActivityEventInfoCardMenuConverter; the earlier title/min-width CSS overrides
are removed. Native browser measurement: item width equals menu content width
249.64 px, height 36 px, no underline, anchored placement. Actual Tables action
opens saved Round 1 / Table 1 with two members when Past is selected. Evidence:
`final-menu-version.json`, `menu-standard-layout.png`, `menu-tables-navigation.txt`.
The earlier menu narrowing claims below are superseded by this correction.

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

## Current investigation — Tournament and assignment notifications

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

## Still to finish / not proven

1. Timer badge browser assertions passed: ticking running time, frozen paused
   time, blue/amber phase colors, placement beside Close, retained Table 1 and
   SmartList using the full body width. Evidence: timer-header.json/png.
   Current disposable verification event: `7754188d-9eef-4979-9cfe-2cdfa4a8ad61`,
   title `QA MODE 20260922 Timer`, two accepted participants.
2. Landing/About Hungarian rendering, join CTA and admin help geometry. Earlier
   API help/close measurement was 34 × 34 px; do not infer admin coverage from it.
3. Standard and Tournament complete create/edit/publish/join/approval journeys,
   external-link update/clear/reload and public action, Tournament stage/scoring,
   ordinary feedback and absence of Mingle interference.
4. Unique completed-table feedback and Met + mutual positive friendship,
   including positive ratings recorded before Met; persisted round history.
5. Local adapter IndexedDB reload/restart for preferences/link/rounds. Do not
   start a duplicate development build or stack to exercise it.
6. API other-owner authorization and remaining external-link/invitation edges.
7. Restore original preferences (saved in preferences-before.json), unwatch and
   revoke only the test key, remove disposable resources, stop the test callback
   receiver, restore managed-session snapshot through the versioned harness,
   and update sanitized evidence/checklists/CSV/XLSX ledgers.

## Runtime continuation

Managed browser manifest:
`/tmp/myscoutee-qa-browser-sessions/INTEGRATION-API-001.json`.
Read current ports from it. Before any relaunch, verify the fixture baseline and
use `guides/qa/tools/open-checkpoint-browser-sessions.mjs`; preserve current native
viewport. The callback receiver uses port 18090; inspect its owner before starting
another process. Existing Docker frontend/backend watchers own compilation.

## Continuation at 01:35 CEST

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
