# Event mode QA — in progress, 2026-09-22

The user resumed and delegated browser/API execution. This is the separate
EVENT-MODE-REGRESSION-001 feature check, not the general manual-QA campaign.
Use the stable event and INTEGRATION-API-001 checklists; do not mark the full
campaign complete from the partial evidence below.

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

Private evidence/scripts: `frontend/.agent/mode-qa/`, including
`landing-branding.json`, `explore-responsive.json`, `stale-round-result.json`,
`runtime-phases.json`, `completed-resume.json`, `encounters-resume.json` and
`countdown-vitest.log`. Do not publish private invitation URLs or SDK credentials.

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
