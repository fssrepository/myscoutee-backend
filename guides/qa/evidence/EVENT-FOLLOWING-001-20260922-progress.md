# EVENT-FOLLOWING-001 — 2026-09-22 — PASS / CLOSED (dev HTTP scope)

Environment: existing dev HTTP stack, demo actors from the versioned
`event-following-fixture.py`, managed checkpoint browser sessions. Explicitly
delegated automatic testing. Historical PASS cases are unchanged.

| Step | Result | Observed evidence |
| --- | --- | --- |
| 1 | PASS | Final requested layout: Table below avatar at left, cyan Followed at right. Verified together at 916px and 500px with paused-table fixture prerequisite. |
| 2 | PASS | Real Explore card menu Follow action persists organizer relationship. |
| 3 | PASS | Initial follow: events 2, organizers 1; viewer activities remained empty. |
| 4 | PASS | Only current + future from followed organizer; past/private/draft/other excluded. Accepted membership + viewer event copy prepared by layout-table: followed list still contains the future event once. |
| 5 | PASS | Existing two toggles above Followed/list row; all three shared indicators; save/reopen. |
| 6 | PASS | Existing Members popup, organizer, Unfollow confirmation, relationship and counter cleared. Latest build recheck: translated subtitle and no unrelated Pending toggle. |
| 7 | PASS | Reload/poll restores stored relationship/count; duplicate follow remains one organizer; forged body userId leaves organizer unchanged, authenticated viewer used; self-follow 400. |
| 8 | PASS | Authenticated organizer trash 2→1, restore 1→2, publish draft 2→3, repeated publish no duplication. |
| 9 | PASS | Fixture shortens current event to 04:08:50Z without touching following state. Normal follow request stores boundary/count 3; ordinary expiry worker at 04:10:14Z updates stored count to 2. Filtered list excludes expired current. Existing realtime poll subsequently rendered badge 2 without reload. |
| 10 | PASS | Watch/unwatch each succeeds and following remains one organizer/count 3. Final UI Unfollow clears members and counter. EN/HU translation keys checked; 500px compact controls unclipped. Managed windows closed, actors/events/session snapshots cleaned. |

## Reproduction

1. Stage and launch as defined in the stable checklist; perform steps 1–8.
2. Run `python3 guides/qa/tools/event-following-fixture.py shorten-current`.
3. Repeat ordinary follow request before the 45-second boundary; count remains 3
   with the shortened nextExpiryAtIso. This is application behavior, not fixture
   counter injection.
4. Allow the existing scheduled expiry worker to run, then inspect `status`,
   Followed list and existing realtime poll. No new counter polling loop.
5. API checks are preserved in `EVENT-FOLLOWING-001-20260922-api.json`;
   worker outcome in `EVENT-FOLLOWING-001-20260922-expiry.json`.

## Automated checks

- Existing frontend watcher compilation/sync: PASS; no parallel build.
- Focused backend tests: 44 PASS (Following 10, activity counters 10, page-filter
  preferences 3, UserRates 21). Existing main classes reused with Gradle compileJava
  and processResources excluded. No MediaFriendshipQualificationTest was discovered
  by the normal test task; do not count it as executed.
- Frontend local eligibility tests: 9 PASS. Local browser full flow not exercised.

## Corrections during execution

- HTTP realtime adapter now forwards following state to the shared store.
- Members subtitle and toolbar use followed-organizer mode correctly.
- Followed controls moved below existing toggles as user specified.
- User requested matching cyan palette for side-menu Followed and filter toggle;
  watcher/render verification PASS. Icons retained after user accepted them.

## Final verification and limits

- `layout-table` is a paused-table display prerequisite, not proof of matchmaking.
- Compact launch: `QA_SCREEN_WIDTH=900 QA_SCREEN_HEIGHT=900 node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-FOLLOWING-001`; Chrome enforced 500px minimum window width. Both owned windows were closed before relaunch. No existing user viewport override.
- Palette: side Followed and filter controls use the existing cyan colors. Shared menu implementation unchanged.
- Latest user-reported document footer defect: narrow column footer now aligns action menu to end; 500px browser measurement right=482 with footer right=500 (18px padding). Screenshot retained. No policy submission was needed for this check.
- Reset returned `{state:null,users:[]}`. No fixture browser or test runner left running.
- Not proven: physical mobile / sub-500px viewport, Hungarian visual rendering, complete frontend-local browser lifecycle. Hungarian keys and 9 local eligibility tests passed. These are explicit boundaries of this dev HTTP checkpoint, not claimed full platform coverage.
- Existing production expiry interval remains 5 minutes; observed convergence was at the next scheduled pass. No timing configuration changed.

Screenshots: [compact filter](EVENT-FOLLOWING-001-20260922-filter.png), [header](EVENT-FOLLOWING-001-20260922-header.png), [privacy footer](EVENT-FOLLOWING-001-20260922-privacy.png).
