# EVENT-EDIT-RUNTIME-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add the current status, dates, or
machine-oracle evidence to it.

The complete journey is one testcase transaction. The named boundaries inside
it are replay savepoints, not separate testcase IDs.

## Actors and startup

- **Casey** is the tested Event admin. Perform every Event and Transport
  mutation in Casey's window. Casey enters the runtime screen with `Manage
  Event`; the `Edit` button inside that screen edits the Event definition.
- **Nova** is the controlled participant. Use Nova's window only where this
  guide explicitly requests it.
- Codex prepares the clean boundary, opens the isolated browser windows, and
  runs the machine-side oracles. Do not create replacement test data or browser
  sessions.

To start a complete replay, tell Codex:

`Prepare the complete EVENT-EDIT-RUNTIME-001 user test.`

Start section 1 only after Codex confirms this baseline:

- no Event titled `QA EVENT-RUNTIME-001` exists;
- no matching MAIN_EVENT runtime, resource assignment, request, or member
  artifact exists;
- Casey owns exactly one unassigned fixture in each category: `QA Main Event
  Transport`, `QA Slot Accommodation`, and `QA Slot Supplies`;
- separate Casey and Nova windows are open.

Stop at the first mismatch. Do not compensate with a second Save, Publish,
Invite, Delete, or an unlisted reload. Report the step number and what is
actually visible.

## Complete test journey

### 1. Create the Event and prove root/Slot MAIN_EVENT isolation

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
6. From that Draft card, select `Manage Event`.
7. Confirm that the Sub Events surface already shows exactly one card for the
   main Event. The following are failures:

   - `No sub events yet` or another empty-state message appears;
   - the Event appears more than once;
   - a synthetic `default` child or tournament-only action appears.

8. Report the following and wait for Codex to capture the application-created
   Event and MAIN_EVENT identities:

   `EVENT-RUNTIME-001 create ready: one MAIN_EVENT visible`

9. On the visible main Event card, open `Transport`.
10. Open the green `+` menu, select `Assign`, select only `QA Main Event
    Transport`, and select `Save` exactly once.
11. Confirm that Transport shows that card exactly once at `1 / 0 - 4`, with
    no red pending counter.
12. Close Transport. The root MAIN_EVENT card remains visible exactly once.
13. Select `Edit` in the runtime screen header. Do not use or expect a second
    `Manage Event` action inside this screen: this `Edit` opens the Event
    definition.
14. Turn `Slots` On and add exactly two distinct slots inside the Event's date
    range: one at the Event start and one one hour later. Keep `Sub Events` Off
    and do not change another Event field.
15. Select `Save` exactly once, then reopen the Draft card with `Manage Event`.
16. Confirm that exactly two Slot sections are shown in chronological order.
17. Confirm that each Slot contains exactly one card labelled `Event`. These
    are two slot-scoped MAIN_EVENT runtimes. The following are failures:

    - either Slot is empty or says `No sub events yet`;
    - only one Event card is shown for two Slots;
    - the original root MAIN_EVENT is shown as a third standalone section;
    - a synthetic `default` Sub Event appears.

18. Open the first Slot's Event card, then open `Accommodation`.
19. Select `Assign`, select only `QA Slot Accommodation`, and select `Save`
    exactly once. Confirm it appears once only in the first Slot.
20. Open the second Slot's Event card, then open `Supplies`.
21. Select `Assign`, select only `QA Slot Supplies`, and select `Save` exactly
    once. Confirm it appears once only in the second Slot.
22. Reopen both Slot cards and confirm the isolation:

    - first Slot: Accommodation present; Supplies and Transport absent;
    - second Slot: Supplies present; Accommodation and Transport absent.

23. Report the following and wait for Codex to verify the root and generated
    Slot runtime/resource identities:

    `EVENT-RUNTIME-001 two slot MAIN_EVENT resources ready`

24. Select `Edit`, remove both Slots, and turn `Slots` Off. Keep `Sub Events`
    Off.
25. Select `Save` exactly once, then reopen the Draft with `Manage Event`.
26. Confirm that the original single MAIN_EVENT card has returned, with no Slot
    section and no empty state.
27. Open its resource categories and confirm that `QA Main Event Transport`
    returned, while `QA Slot Accommodation` and `QA Slot Supplies` are absent.
28. Return to the Draft card and select `Publish → Publish` exactly once.
29. Confirm that the active Event appears exactly once at `1 / 8`.
30. Report the following and wait. Codex verifies that the original MAIN_EVENT
    identity was reactivated, prepares Nova as the accepted participant, and
    records the replayable `post-create` boundary at `2 / 8`:

    `EVENT-RUNTIME-001 childless restored: original MAIN_EVENT visible and Event published`

### 2. Capacity edit preserves the existing MAIN_EVENT

31. After Codex confirms the `post-create` boundary, reload **Casey** exactly
    once.
32. Open `Activities`, find `QA EVENT-RUNTIME-001`, open its menu, and select
    `Manage Event`.
33. Select `Edit`, then change only `Max capacity` from `8` to `9`.
34. Select `Save` exactly once.
35. Do not reload the Activities list. Confirm that the same card changes in
    place from `2 / 8` to `2 / 9` and that no duplicate card appears.
36. Select `Manage Event` and confirm that exactly one MAIN_EVENT card still
    represents `QA EVENT-RUNTIME-001`.
37. Report the following and wait for Codex to prove that the capacity Save
    preserved the original runtime identity:

    `EVENT-RUNTIME-001 Save ready: card changed to 2/9 and one MAIN_EVENT remains`

### 3. MAIN_EVENT presentation

38. Open and close `Event Members`, `Transport`, `Accommodation`, and
    `Supplies`, one at a time.
39. `Event Members` shows Casey once as Admin and Nova once as Member, with
    occupancy `2 / 9`.
40. Transport still contains `QA Main Event Transport` exactly once at
    `1 / 0 - 4`. Accommodation and Supplies are empty, and no resource category
    has a red counter.
41. Report the following, then wait while Codex checks the read-only boundary:

    `EVENT-RUNTIME-001 MAIN_EVENT presentation ready`

### 4. Invite Nova and delete the invitation

The red Transport counter counts pending invitations only. Accepted Transport
usage is the first number in the occupancy label. The correct transition in
this section is therefore `0 → 1 → 0`, never `1 → 2 → 1`.

42. In Casey, open `MAIN_EVENT → Transport → Members`.
43. Select `Invite members`.
44. On Nova's card, select the `+` control, then use the green checkmark in the
    header to send the invitation exactly once.
45. Confirm that Nova appears exactly once with pending status.
46. Confirm that the red Transport counter appears and changes `0 → 1` while
    occupancy remains `1 / 0 - 4`.
47. Do not close Members or reload. Report the following and wait for Codex
    before selecting Delete:

    `EVENT-RUNTIME-001 invite precondition ready: Nova pending, red counter 1`

48. Open Nova's card menu and select `Delete invitation → Delete` exactly once.
49. Without reloading the list, immediately confirm all of the following:

    - Nova disappears;
    - the pending header and pending count disappear;
    - the red Transport counter changes `1 → 0` and disappears;
    - occupancy remains `1 / 0 - 4`.

50. Close and reopen `Members`. Nova remains absent and no red counter is
    present.
51. Reload the full Casey window exactly once, return to
    `Transport → Members`, and confirm the same state. Occupancy remains
    `1 / 0 - 4`.
52. Report the following and wait for Codex's persistence and latency oracle:

    `EVENT-RUNTIME-001 Delete invitation ready: Nova absent, no red counter`

### 5. Remove and reassign the Transport

53. In the `Transport` list, open the `QA Main Event Transport` card menu.
54. Select `Remove`, then select `Remove` once in the `Remove assignment`
    confirmation dialog.
55. Confirm that the Transport disappears, the accepted resource signal
    changes `1 → 0`, and no red counter appears.
56. Close and reopen Transport, then reload the full page exactly once. The
    assignment remains absent.
57. Report the following and wait for Codex:

    `EVENT-RUNTIME-001 Transport removed: 1->0, no red counter`

58. Open the green `+` menu on Transport again and select `Assign`.
59. Select the same `QA Main Event Transport` asset and select `Save` once.
60. Confirm that the accepted resource signal changes `0 → 1`, occupancy is
    `1 / 0 - 4`, and the red pending counter remains absent.
61. Close and reopen Transport, then reload once. The same state returns.
62. Report the following and wait for Codex's terminal oracle:

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

   `Activities → QA EVENT-RUNTIME-001 → Manage Event → MAIN_EVENT → Transport → Members`

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
