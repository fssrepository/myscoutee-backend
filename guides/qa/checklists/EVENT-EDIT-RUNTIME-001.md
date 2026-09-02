# EVENT-EDIT-RUNTIME-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add the current status, dates, or
machine-oracle evidence to it.

## Actors and startup

- **Casey** is the tested Event admin. Perform every Event and Transport
  mutation in Casey's window.
- **Nova** is an accepted Event member. Use Nova's window only where this
  guide explicitly requests it.
- Codex prepares the fixture, opens the isolated browser windows, and runs the
  machine-side oracles. Do not create replacement test data or browser
  sessions.

To start a complete replay, tell Codex:

`Prepare the complete EVENT-EDIT-RUNTIME-001 user test.`

Start step 1 only after Codex confirms this baseline:

- the `QA EVENT-RUNTIME-001` card shows `2 / 8`;
- Casey is Admin and Nova is an accepted Member;
- Slots and Sub Events are Off;
- no MAIN_EVENT runtime or Transport assignment exists;
- separate Casey and Nova windows are open.

Stop at the first mismatch. Do not compensate with a second Save, Invite,
Delete, or an unlisted reload. Report the step number and what is actually
visible.

## Complete test journey

### 1. Managed-session check

1. Inspect the freshly opened **Nova** window.
2. Wait for the application to finish loading.
3. Confirm that **No network** is absent and the application is online.
4. Do not open or mutate an Event as Nova.
5. Report:

   `EVENT-RUNTIME-001 launcher ready: Nova online`

### 2. Capacity edit and MAIN_EVENT materialization

6. In **Casey**, open `Activities`.
7. Find the `QA EVENT-RUNTIME-001` card.
8. Open its menu and select `Manage Event`.
9. Change only `Max capacity` from `8` to `9`. Do not edit another field.
10. Select `Save` exactly once.
11. Do not reload the Activities list. Confirm that the same card changes in
    place from `2 / 8` to `2 / 9` and that no duplicate card appears.
12. Report the following and wait for Codex to finish the persisted oracle:

    `EVENT-RUNTIME-001 Save ready: card changed to 2/9 without reload`

### 3. MAIN_EVENT presentation

13. From the same Event card menu, select `View Event`.
14. Confirm that exactly one MAIN_EVENT card represents
    `QA EVENT-RUNTIME-001`.
15. Any of the following is a failure:

    - an empty `Sub Events` list appears instead of the MAIN_EVENT card;
    - the parent Event appears twice;
    - tournament-only `Groups`, `Finalize`, or leaderboard actions appear.

16. Open and close `Event Members`, `Transport`, `Accommodation`, and
    `Supplies`, one at a time.
17. `Event Members` shows Casey once as Admin and Nova once as Member, with
    occupancy `2 / 9`.
18. No resource category has a red counter at this boundary.
19. Report the following, then wait while Codex checks the read-only boundary
    and prepares `QA Main Event Transport`:

    `EVENT-RUNTIME-001 MAIN_EVENT presentation ready`

### 4. Assign one Transport

20. After Codex confirms that the Transport is prepared, reload the **Casey**
    window exactly once.
21. Navigate to:

    `Activities → QA EVENT-RUNTIME-001 → View Event → MAIN_EVENT → Transport`

22. Open the green `+` menu and select `Assign`.
23. Select only `QA Main Event Transport`, then select `Save` exactly once.
24. Immediately confirm all of the following:

    - Transport occupancy is `1 / 0 - 4`;
    - no red Transport counter is present;
    - the Transport card appears exactly once.

25. Close and reopen `Transport`. It still shows `1 / 0 - 4` with no red
    counter.
26. Reload the full Casey window exactly once, return to the same surface, and
    confirm the same state again.
27. Report the following and wait for Codex's machine-side check:

    `EVENT-RUNTIME-001 Transport ready: 1/0-4, no red counter`

### 5. Invite Nova and delete the invitation

The red Transport counter counts pending invitations only. Accepted Transport
usage is the first number in the occupancy label. The correct transition in
this section is therefore `0 → 1 → 0`, never `1 → 2 → 1`.

28. In Casey, open `MAIN_EVENT → Transport → Members`.
29. Select `Invite members`.
30. On Nova's card, select the `+` control, then use the green checkmark in the
    header to send the invitation exactly once.
31. Confirm that Nova appears exactly once with pending status.
32. Confirm that the red Transport counter appears and changes `0 → 1` while
    occupancy remains `1 / 0 - 4`.
33. When running the focused Delete regression, do not close Members or reload
    at this point.
34. Open Nova's card menu and select `Delete invitation → Delete` exactly once.
35. Without reloading the list, immediately confirm all of the following:

    - Nova disappears;
    - the pending header and pending count disappear;
    - the red Transport counter changes `1 → 0` and disappears;
    - occupancy remains `1 / 0 - 4`.

36. Close and reopen `Members`. Nova remains absent and no red counter is
    present.
37. Reload the full Casey window exactly once, return to
    `Transport → Members`, and confirm the same state. Occupancy remains
    `1 / 0 - 4`.
38. Report the following and wait for Codex's persistence and latency oracle:

    `EVENT-RUNTIME-001 Delete invitation ready: Nova absent, no red counter`

### 6. Remove and reassign the Transport

39. In the `Transport` list, open the `QA Main Event Transport` card menu.
40. Select `Remove`, then select `Remove` once in the `Remove assignment`
    confirmation dialog.
41. Confirm that the Transport disappears, the accepted resource signal
    changes `1 → 0`, and no red counter appears.
42. Close and reopen Transport, then reload the full page exactly once. The
    assignment remains absent.
43. Report the following and wait for Codex:

    `EVENT-RUNTIME-001 Transport removed: 1->0, no red counter`

44. Open the green `+` menu on Transport again and select `Assign`.
45. Select the same `QA Main Event Transport` asset and select `Save` once.
46. Confirm that the accepted resource signal changes `0 → 1`, occupancy is
    `1 / 0 - 4`, and the red pending counter remains absent.
47. Close and reopen Transport, then reload once. The same state returns.
48. Report the following and wait for Codex's terminal oracle:

    `EVENT-RUNTIME-001 Transport reassigned: 1/0-4, no red counter`

## Focused Delete regression

Use this shorter journey when the complete test is already accepted and only
the invitation-deletion repair or latency must be measured again. It is not a
new testcase and does not replace the complete journey.

1. Tell Codex:

   `Prepare the EVENT-EDIT-RUNTIME-001 focused Delete regression.`

2. Wait for Codex to confirm the Transport boundary with `accepted=1`,
   `pending=0`, occupancy `1 / 0 - 4`, and no red counter.
3. Reload Casey exactly once, then open:

   `Activities → QA EVENT-RUNTIME-001 → View Event → MAIN_EVENT → Transport → Members`

4. Perform complete-journey steps 29–32: invite Nova once and confirm the red
   counter changes `0 → 1`.
5. Without closing or reloading, perform steps 34–35: delete the invitation
   once and confirm the immediate disappearance of Nova, the pending header,
   and the red counter. The counter changes `1 → 0`; occupancy remains
   `1 / 0 - 4`.
6. Perform the single close/reopen and single reload check from steps 36–37.
7. Report:

   `EVENT-RUNTIME-001 Delete replay ready: Nova absent, no red counter`

The user portion ends here. Codex records PASS/FAIL only after its independent
machine-side oracle. The execution result never gets written into this file.
