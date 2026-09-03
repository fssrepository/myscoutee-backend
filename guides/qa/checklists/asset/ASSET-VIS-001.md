# ASSET-VIS-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current dates, status, IDs or
machine-oracle evidence to it.

## Actors and startup

- **Casey** is the owner, **Lina** is Casey's deterministic friend, and
  **Liam** is the unrelated non-friend control.
- Codex stages three Casey-owned Transport controls plus the read-only
  `QA ASSET-VIS-001 Event → QA Visibility Stage` navigation scaffold and opens
  one isolated browser for each actor.
- Compare only titles beginning `QA ASSET-VIS-001`. Other demo Assets are not
  part of the target set and may remain visible.
- This checkpoint contains reads only. Do not select Borrow, Share, Contact,
  Report, Edit, Delete, Add, Invite or any confirmation action.
- Stop at the first mismatch. Do not compensate with another navigation,
  filter, browser profile, API call, fixture change or write action.

To start a complete replay, tell Codex:

`Prepare the ASSET-VIS-001 user test.`

Begin only after Codex confirms all of the following:

- the checkpoint is `baseline-ready` with three stable Casey-owned target
  Assets: one `Public`, one `Friends only` and one `Invitation only`;
- Casey owns the Event/Sub-event scaffold and Casey, Lina and Liam are its
  three accepted members;
- no target borrow request, Asset membership, assignment, notification,
  outbox item or recompute task exists;
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
10. Open each visible target card menu and select `View Asset`, one at a time.
    Confirm the read-only detail shows the same title, owner Casey, category
    `Sedan` and matching visibility. Close each detail without selecting
    another action.

### 3. Unrelated-user sets and readable detail

11. In **Liam**, open `My Assets → Transport`. Confirm none of the three
    controlled titles appears in Liam's owned/managed list. Close My Assets.
12. Open the same Event/Sub-event path in Liam:

    `Activities → Events → Active Events → QA ASSET-VIS-001 Event → View Event → QA Visibility Stage → Transport → Explore`

13. Confirm Liam's controlled Explore title set contains exactly
    `QA ASSET-VIS-001 Public Transport` once.
14. Confirm both `QA ASSET-VIS-001 Friends Transport` and
    `QA ASSET-VIS-001 Invitation Transport` are absent.
15. Open the Public card menu and select `View Asset`. Confirm its read-only
    detail shows owner Casey, category `Sedan` and visibility `Public`. Close
    the detail and Asset Explore without selecting another action.

### 4. Reload reconstruction

16. Reload Casey, Lina and Liam exactly once each.
17. Reopen only the same My Assets and Event/Sub-event Asset Explore paths.
    Confirm the controlled sets remain exactly:

    - Casey owned: Public + Friends only + Invitation only; Explore: none;
    - Lina owned: none; Explore: Public + Friends only;
    - Liam owned: none; Explore: Public only.

18. Confirm no target card changed its visibility, owner, availability or
    presentation and no success/pending notification appeared merely because
    of these reads.
19. Report the terminal phrase:

    `ASSET-VIS-001 UI complete: owner, friend and unrelated sets persist`

Wait for Codex's authenticated detail-denial and persisted read-only oracles.
Do not reset or continue to another testcase until Codex records the outcome
and restores this fixture.
