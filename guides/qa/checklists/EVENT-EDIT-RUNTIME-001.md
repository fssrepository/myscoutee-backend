# EVENT-EDIT-RUNTIME-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add the current status, dates, or
machine-oracle evidence to it.

The complete journey is one testcase transaction. The named boundaries inside
it are replay savepoints, not separate testcase IDs.

## Actors and startup

- **Casey** is the tested Event admin. Perform every Event and Transport
  mutation in Casey's window.
- **Nova** is the controlled participant. Use Nova's window only where this
  guide explicitly requests it.
- Codex prepares the clean boundary, opens the isolated browser windows, and
  runs the machine-side oracles. Do not create replacement test data or browser
  sessions.

To start a complete replay, tell Codex:

`Prepare the complete EVENT-EDIT-RUNTIME-001 user test.`

Start section 1 only after Codex confirms this baseline:

- no Event titled `QA EVENT-RUNTIME-001` exists;
- no matching MAIN_EVENT runtime, resource, controlled Transport, request, or
  member artifact exists;
- separate Casey and Nova windows are open.

Stop at the first mismatch. Do not compensate with a second Save, Publish,
Invite, Delete, or an unlisted reload. Report the step number and what is
actually visible.

## Complete test journey

### 1. Create the Event and prove MAIN_EVENT/Slot switching

1. In **Casey**, open `Activities → Events`.
2. Open the green `+` menu and select `Create Event`.
3. Enter these values:

   - Name: `QA EVENT-RUNTIME-001`
   - Description: `Manual childless Event runtime QA`
   - Capacity: minimum `1`, maximum `8`
   - Location: `Austin`
   - Mode: `Casual`
   - Date: one future two-hour window
   - Auto inviter: Off
   - Ticketing: Off
   - Slots: Off
   - Sub Events: Off

4. Select `Save` exactly once. Do not publish yet.
5. Open `Drafts` and confirm that the Event appears exactly once at `1 / 8`.
6. From that Draft card, select `View Event`.
7. Confirm that the Sub Events surface already shows exactly one card for the
   main Event. The following are failures:

   - `No sub events yet` or another empty-state message appears;
   - the Event appears more than once;
   - a synthetic `default` child or tournament-only action appears.

8. Report the following and wait for Codex to capture the application-created
   Event and MAIN_EVENT identities:

   `EVENT-RUNTIME-001 create ready: one MAIN_EVENT visible`

9. Return to the same Draft card and select `Edit Event`.
10. Turn `Slots` On and add exactly one slot inside the Event's date range.
    Keep `Sub Events` Off and do not change another Event field.
11. Select `Save` exactly once.
12. Select `View Event` again.
13. Confirm that the created slot is shown and the standalone MAIN_EVENT card
    is absent. The slot view replaces the childless view; the two must never be
    displayed together.
14. Report the following and wait for Codex to verify that the original
    MAIN_EVENT runtime is deactivated rather than duplicated:

    `EVENT-RUNTIME-001 slot override ready: slot visible, MAIN_EVENT absent`

15. Return to `Edit Event`, remove the slot, and turn `Slots` Off. Keep
    `Sub Events` Off.
16. Select `Save` exactly once.
17. Select `View Event` again and confirm that the single MAIN_EVENT card has
    returned, with no slot and no empty state.
18. Return to the Draft card and select `Publish → Publish` exactly once.
19. Confirm that the active Event appears exactly once at `1 / 8`.
20. Report the following and wait. Codex verifies that the original MAIN_EVENT
    identity was reactivated, prepares Nova as the accepted participant, and
    records the replayable `post-create` boundary at `2 / 8`:

    `EVENT-RUNTIME-001 childless restored: original MAIN_EVENT visible and Event published`

### 2. Capacity edit preserves the existing MAIN_EVENT

21. After Codex confirms the `post-create` boundary, reload **Casey** exactly
    once.
22. Open `Activities`, find `QA EVENT-RUNTIME-001`, open its menu, and select
    `Manage Event`.
23. Change only `Max capacity` from `8` to `9`.
24. Select `Save` exactly once.
25. Do not reload the Activities list. Confirm that the same card changes in
    place from `2 / 8` to `2 / 9` and that no duplicate card appears.
26. Select `View Event` and confirm that exactly one MAIN_EVENT card still
    represents `QA EVENT-RUNTIME-001`.
27. Report the following and wait for Codex to prove that the capacity Save
    preserved the original runtime identity:

    `EVENT-RUNTIME-001 Save ready: card changed to 2/9 and one MAIN_EVENT remains`

### 3. MAIN_EVENT presentation

28. Open and close `Event Members`, `Transport`, `Accommodation`, and
    `Supplies`, one at a time.
29. `Event Members` shows Casey once as Admin and Nova once as Member, with
    occupancy `2 / 9`.
30. No resource category has a red counter at this boundary.
31. Report the following, then wait while Codex checks the read-only boundary
    and prepares `QA Main Event Transport`:

    `EVENT-RUNTIME-001 MAIN_EVENT presentation ready`

### 4. Assign one Transport

32. After Codex confirms that the Transport is prepared, reload the **Casey**
    window exactly once.
33. Navigate to:

    `Activities → QA EVENT-RUNTIME-001 → View Event → MAIN_EVENT → Transport`

34. Open the green `+` menu and select `Assign`.
35. Select only `QA Main Event Transport`, then select `Save` exactly once.
36. Immediately confirm all of the following:

    - Transport occupancy is `1 / 0 - 4`;
    - no red Transport counter is present;
    - the Transport card appears exactly once.

37. Close and reopen `Transport`. It still shows `1 / 0 - 4` with no red
    counter.
38. Reload the full Casey window exactly once, return to the same surface, and
    confirm the same state again.
39. Report the following and wait for Codex's machine-side check:

    `EVENT-RUNTIME-001 Transport ready: 1/0-4, no red counter`

### 5. Invite Nova and delete the invitation

The red Transport counter counts pending invitations only. Accepted Transport
usage is the first number in the occupancy label. The correct transition in
this section is therefore `0 → 1 → 0`, never `1 → 2 → 1`.

40. In Casey, open `MAIN_EVENT → Transport → Members`.
41. Select `Invite members`.
42. On Nova's card, select the `+` control, then use the green checkmark in the
    header to send the invitation exactly once.
43. Confirm that Nova appears exactly once with pending status.
44. Confirm that the red Transport counter appears and changes `0 → 1` while
    occupancy remains `1 / 0 - 4`.
45. Do not close Members or reload. Report the following and wait for Codex
    before selecting Delete:

    `EVENT-RUNTIME-001 invite precondition ready: Nova pending, red counter 1`

46. Open Nova's card menu and select `Delete invitation → Delete` exactly once.
47. Without reloading the list, immediately confirm all of the following:

    - Nova disappears;
    - the pending header and pending count disappear;
    - the red Transport counter changes `1 → 0` and disappears;
    - occupancy remains `1 / 0 - 4`.

48. Close and reopen `Members`. Nova remains absent and no red counter is
    present.
49. Reload the full Casey window exactly once, return to
    `Transport → Members`, and confirm the same state. Occupancy remains
    `1 / 0 - 4`.
50. Report the following and wait for Codex's persistence and latency oracle:

    `EVENT-RUNTIME-001 Delete invitation ready: Nova absent, no red counter`

### 6. Remove and reassign the Transport

51. In the `Transport` list, open the `QA Main Event Transport` card menu.
52. Select `Remove`, then select `Remove` once in the `Remove assignment`
    confirmation dialog.
53. Confirm that the Transport disappears, the accepted resource signal
    changes `1 → 0`, and no red counter appears.
54. Close and reopen Transport, then reload the full page exactly once. The
    assignment remains absent.
55. Report the following and wait for Codex:

    `EVENT-RUNTIME-001 Transport removed: 1->0, no red counter`

56. Open the green `+` menu on Transport again and select `Assign`.
57. Select the same `QA Main Event Transport` asset and select `Save` once.
58. Confirm that the accepted resource signal changes `0 → 1`, occupancy is
    `1 / 0 - 4`, and the red pending counter remains absent.
59. Close and reopen Transport, then reload once. The same state returns.
60. Report the following and wait for Codex's terminal oracle:

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

4. Invite Nova once. Confirm that Nova appears once as pending and that the red
   counter changes `0 → 1` while occupancy remains `1 / 0 - 4`.
5. Report the invite-precondition phrase and wait for Codex. Do not close
   Members, reload, or select Delete yet.
6. After Codex permits the Delete action, delete the invitation exactly once.
   Confirm the immediate disappearance of Nova, the pending header, and the red
   counter. Occupancy remains `1 / 0 - 4`.
7. Close and reopen Members once, then reload the full page once and return to
   the same surface. The absence and occupancy persist.
8. Report:

   `EVENT-RUNTIME-001 Delete replay ready: Nova absent, no red counter`

The user portion ends here. Codex records PASS/FAIL only after its independent
machine-side oracle. The execution result never gets written into this file.
