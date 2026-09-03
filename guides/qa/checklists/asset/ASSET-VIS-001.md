# ASSET-VIS-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current dates, status, IDs or
machine-oracle evidence to it.

The complete baseline, category-filter and visibility-Edit journey is one
testcase transaction. The baseline phrase is only a replay savepoint inside
that testcase, not a separate test or matrix row.

## Actors and startup

- **Casey** is the owner, **Lina** is Casey's deterministic friend, and
  **Liam** is the unrelated non-friend control.
- Codex stages three Casey-owned Transport controls plus the read-only
  `QA ASSET-VIS-001 Event → QA Visibility Stage` navigation scaffold and opens
  one isolated browser for each actor.
- Compare only titles beginning `QA ASSET-VIS-001`. Other demo Assets are not
  part of the target set and may remain visible.
- The baseline sections contain reads and category filtering only. After its
  savepoint, perform exactly the one named owner Visibility Edit. Do not select
  Borrow, Share, Contact, Report, Delete, Add, Invite or any other confirmation
  action.
- Stop at the first mismatch. Do not compensate with another navigation,
  filter, browser profile, API call, fixture change or write action.

To start a complete replay, tell Codex:

`Prepare the ASSET-VIS-001 user test.`

Begin only after Codex confirms all of the following:

- the checkpoint is `baseline-ready` with three stable Casey-owned target
  Assets: one `Public`, one `Friends only` and one `Invitation only`;
- Casey owns the Event/Sub-event scaffold and Casey, Lina and Liam are its
  three accepted members;
- no target borrow request, Asset membership, assignment, notification or
  outbox item exists;
- the authenticated server baseline agrees with the expected visibility
  matrix;
- three isolated, identity-verified Casey/Lina/Liam windows are open.

## Visibility journey

### 1. Owner sets

1. In **Casey**, open `My Assets → Transport`.
2. Confirm the controlled title set contains exactly these three cards once
   each:

   - `QA ASSET-VIS-001 Public Transport` — `Public`
   - `QA ASSET-VIS-001 Friends Transport` — `Friends only`
   - `QA ASSET-VIS-001 Invitation Transport` — `Invitation only`

3. Do not open an Edit action. Close My Assets.
4. In Casey, open:

   `Activities → Events → Active Events → QA ASSET-VIS-001 Event → View Event → QA Visibility Stage → Transport → Explore`

5. Confirm Casey's controlled Explore title set is empty. Casey's own three
   target Assets must not be returned as external discovery results. Close
   Asset Explore without changing filters or dates.

### 2. Friend sets and readable detail

6. In **Lina**, open `My Assets → Transport`. Confirm none of the three
   controlled titles appears in Lina's owned/managed list. Close My Assets.
7. Open the same Event/Sub-event path in Lina:

   `Activities → Events → Active Events → QA ASSET-VIS-001 Event → View Event → QA Visibility Stage → Transport → Explore`

8. Confirm Lina's controlled Explore title set contains exactly these two
   cards once each:

   - `QA ASSET-VIS-001 Public Transport`
   - `QA ASSET-VIS-001 Friends Transport`

9. Confirm `QA ASSET-VIS-001 Invitation Transport` is absent.
10. Confirm both target cards show Casey's actual profile image in the owner
    avatar instead of the `CB` initials fallback. Select the owner avatar on
    one card, confirm Casey's same profile/impressions surface opens as from
    Event Explore, then close it.
11. Open each visible target card menu and select `View Asset`, one at a time.
    Confirm the read-only detail shows the same title, owner Casey, category
    `Sedan` and matching visibility. Close each detail without selecting
    another action.
12. Open the category selector and choose `Sedan`. Confirm the controlled set
    remains exactly Public plus Friends. Choose `Van`; confirm the controlled
    set is empty. Restore `All Transport`; confirm Public plus Friends return
    exactly once each.

### 3. Unrelated-user sets and readable detail

13. In **Liam**, open `My Assets → Transport`. Confirm none of the three
    controlled titles appears in Liam's owned/managed list. Close My Assets.
14. Open the same Event/Sub-event path in Liam:

    `Activities → Events → Active Events → QA ASSET-VIS-001 Event → View Event → QA Visibility Stage → Transport → Explore`

15. Confirm Liam's controlled Explore title set contains exactly
    `QA ASSET-VIS-001 Public Transport` once.
16. Confirm both `QA ASSET-VIS-001 Friends Transport` and
    `QA ASSET-VIS-001 Invitation Transport` are absent.
17. Confirm the Public card shows Casey's profile image as its interactive
    owner avatar. Select it, confirm Casey's profile/impressions surface opens,
    then close it.
18. Open the Public card menu and select `View Asset`. Confirm its read-only
    detail shows owner Casey, category `Sedan` and visibility `Public`. Close
    the detail and Asset Explore without selecting another action.

### 4. Baseline savepoint

19. Report the intermediate phrase:

    `ASSET-VIS-001 baseline ready: category and owner profile match`

Wait for Codex's authenticated baseline/detail-denial and persisted read-only
oracles before performing the Edit.

### 5. One visibility Edit and reload reconstruction

20. After Codex confirms the baseline savepoint, in **Casey** open
    `My Assets → Transport` and open only
    `QA ASSET-VIS-001 Public Transport` with `Edit`.
21. Change only Visibility from `Public` to `Invitation only`. Select Save
    exactly once.
22. Without reloading, confirm the same three Casey-owned cards remain, the
    edited card now shows `Invitation only`, and the Transport count does not
    change in either the Asset type selector or side menu.
23. Reload Casey, Lina and Liam exactly once each.
24. Reopen only the same My Assets and Event/Sub-event Asset Explore paths.
    Confirm the controlled sets now remain exactly:

    - Casey owned: all three original titles, with the Public-title control now
      `Invitation only`; Casey Explore: none;
    - Lina owned: none; Lina Explore: Friends Transport only;
    - Liam owned: none; Liam Explore: no controlled target.

25. Confirm Casey remains the owner, the available owner avatar still opens
    Casey's profile/impressions surface, and no borrow/request/assignment or
    success/pending notification was created by filtering or viewing.
26. Report the terminal phrase:

    `ASSET-VIS-001 UI complete: edited visibility matrix persists after reload`

Wait for Codex's edited authenticated detail-denial and exact persisted
single-write oracles. Do not reset or continue to another testcase until Codex
records the outcome and restores this fixture.
