# ASSET-BORROW-001 user test guide

This file is the tester's stable, repeatable guide. It is not an execution
log: do not add current status, timestamps or machine evidence to it.

The cancel, reject and accept/capacity branches are one consolidated testcase.
The report phrases below are savepoints inside that testcase, not separate
matrix rows.

This is the third Event/Asset payment-control combination: all three staged
Assets are genuinely free, so no Payment block, provider badge, Cash-only
recording action or card selector may appear. Cash-only paid behavior is owned
by `EVENT-CHECKOUT-001`; Barion is owned by
`ASSET-CHECKOUT-001`; Stripe is owned by the Event checkout journey.

This guide intentionally does not replay already-closed Asset coverage:

- `ASSET-ASSIGNMENT-LIFECYCLE-001` owns direct Assign/Edit/Unassign, resource
  generation replacement and contribution management. Do not use those actions
  here.
- `ASSET-CHECKOUT-001` owns generic Borrow-form bounds, paid request approval,
  persisted Payment summary, scoped Manager lifecycle, Take Over, Remove,
  Leave and refund. Do not repeat those actions here.
- `ASSET-MEMBER-LIFECYCLE-001` owns Invite/Join, promotion/revocation and
  general Asset-member permission rules. This case checks notifications and
  live counters only where the free Borrow transition itself creates them.

The remaining unique evidence is the zero-payment free request path, requester
Cancel, owner Reject, cross-group overlapping availability, a single free
approval without a second reservation, and its Asset Statistics delta.
Pricing configuration, refund-policy disclosure and immutable payment-time
snapshots belong to the separate interactive
[`ASSET-PRICING-001`](ASSET-PRICING-001.md) journey and are not executed in
this free fixture.

## Actors and startup

- **Casey** owns all three controlled Public/free Transport Assets and is the
  Event Admin in generated Group A.
- **Nova** is the Group A requester for the cancel and accepted-capacity
  branches.
- **Riley** is the Group A requester for the owner-reject branch.
- **Lina** is the sole Group B control. Her already-accepted quantity `2`
  reservation on the Capacity Asset must remain unchanged; no fourth browser
  is required.
- The user exclusively opens and controls the configured isolated
  Casey/Nova/Riley browser sessions. Do not reuse old ASSET-MEMBER windows as
  evidence and do not create replacement data or profiles.
- This checkpoint exercises free Borrow only. It must not create a checkout
  session, payment, payment summary or inventory-applied reservation. The paid
  flow belongs to `ASSET-CHECKOUT-001`.
- Select each Send, Cancel, Reject and Approve confirmation exactly once. Stop
  at the first mismatch; do not compensate with a second action, an ad-hoc
  reload or an API/Mongo write.

To start a complete replay, tell Codex:

`Continue ASSET-BORROW-001 from the staged baseline.`

Begin only after Codex runs the read-only checkpoint status and the versioned
launcher completes its common snapshot-protected session cleanup, then
confirms:

- phase `baseline-ready`, with the browser still unopened for this checkpoint;
- `QA ASSET-BORROW-001 Tournament → QA Borrow Stage` contains Group A
  (Casey, Nova, Riley) and Group B (Lina);
- Group A has no Transport resource assignment or pending request;
- Group B has exactly one accepted quantity `2` reservation for Lina on
  `QA ASSET-BORROW-001 Capacity Transport`;
- these three Casey-owned Public/free Sedan controls exist exactly once:

  | Asset | Stored quantity | Initial request state |
  | --- | ---: | --- |
  | `QA ASSET-BORROW-001 Capacity Transport` | `3` | Lina accepted `2` for Start `09/08/2026`, End `09/15/2026` |
  | `QA ASSET-BORROW-001 Reject Transport` | `2` | none |
  | `QA ASSET-BORROW-001 Cancel Transport` | `2` | none |

- the date values written directly into steps 3–32 match the staged fixture;
  update those steps whenever this fixture is staged with new dates;
- no controlled notification/outbox effect exists after fixture staging.

## 1. Confirm Explore scope and overlap capacity

1. **Nova — open:**

   `Activities → Events → Active Events → QA ASSET-BORROW-001 Tournament → View Event → QA Borrow Stage → Groups → Group A → Assets → Transport → + / Explore`

   **Expected:** the Explore header identifies **Group A** and **Transport**.

2. **Nova — check the Explore list. Expected:** each of these Casey-owned
   Assets appears exactly once:

   - `QA ASSET-BORROW-001 Capacity Transport`
   - `QA ASSET-BORROW-001 Reject Transport`
   - `QA ASSET-BORROW-001 Cancel Transport`

3. **Nova — set the Explore date fields to Start `09/08/2026`, End
   `09/15/2026`. Check `QA ASSET-BORROW-001 Capacity Transport`.**

   **Expected:** its badge says exactly `1 left`, because its stored quantity
   is `3` and Lina already occupies quantity `2` during these dates.

4. **Nova — keep Start `09/08/2026`, End `09/15/2026`, then open
   `QA ASSET-BORROW-001 Capacity Transport → Borrow`.**

   **Expected:** the footer button says `Send borrow request`; no Payment,
   provider or card block appears; no checkout error appears. Close the dialog
   without pressing `Send borrow request`.

5. **Nova — set Start `09/16/2026`, End `09/17/2026`. Check
   `QA ASSET-BORROW-001 Capacity Transport`.**

   **Expected:** its badge says exactly `3 left`.

   Then set the fields back to Start `09/08/2026`, End `09/15/2026`.

6. **Nova — with Start `09/08/2026`, End `09/15/2026`, check the other two
   cards. Expected:** Reject Transport says `2 left`, Cancel Transport says
   `2 left`, and both remain free Borrow items. Do not send either request yet.

   **Casey — check Group B. Expected:** Lina still has the original accepted
   Capacity Transport quantity `2`; Nova's Explore reads and date changes did
   not modify Group B.

## 2. Nova sends and cancels one free request

7. **Nova — set Start `09/08/2026`, End `09/15/2026`; open
   `QA ASSET-BORROW-001 Cancel Transport → Borrow`; keep Quantity `1`; press
   `Send borrow request` exactly once.**

8. **Nova — expected immediately, without reload:** the dialog closes; red `1`
   appears on the Cancel Transport card, the Transport filter, Group A, QA
   Borrow Stage and the Tournament card under Activity → Events. The resource
   popup header says `0 members · 1 pending`. The same card must not offer a
   second submission for Nova in Group A. Do not try to force a duplicate.

9. **Casey — check:** exactly one new Borrow-request notification and exactly
   one pending Nova row under `QA ASSET-BORROW-001 Cancel Transport`.

   **Expected notification detail:**
   `Requested access · QA ASSET-BORROW-001 Cancel Transport`.

   **Expected row:** Group A, QA Borrow Stage, Start `09/08/2026`, End
   `09/15/2026`, Quantity `1`.

10. **Nova — open Nova's own pending Cancel Transport row; press `Cancel join
    request`; confirm exactly once.**

    **Expected wording:** `Cancel join request`, not `Leave asset`.

11. **Nova — check without reload. Expected:** the pending row, Group A
    Transport resource and complete pending red-counter chain disappear;
    Cancel Transport returns to `2 left` for Start `09/08/2026`, End
    `09/15/2026`.

    **Casey — check Group B. Expected:** Lina's quantity `2` control is
    unchanged.

12. **Reload Nova once and Casey once. Expected:** no Cancel Transport
    pending/accepted request, Asset membership, Group A assignment or payment
    state returns.

13. **Report this exact phrase and wait:**

    `ASSET-BORROW-001 cancel complete: Nova request removed once`

Codex must run `verify-borrow-cancel` before the Reject branch.

## 3. Riley sends and Casey rejects one free request

14. Continue only after Codex confirms step 13. **Riley — set Start
    `09/08/2026`, End `09/15/2026`; open `QA ASSET-BORROW-001 Reject
    Transport → Borrow`; keep Quantity `1`; press `Send borrow request`
    exactly once.**

15. **Expected:** Group A gains exactly one pending delta. Casey receives one
    notification with detail
    `Requested access · QA ASSET-BORROW-001 Reject Transport`. Group B,
    Capacity Transport and Cancel Transport remain unchanged.

16. **Casey — open the pending Riley row under Reject Transport; press `Reject
    request`; confirm exactly once.**

17. **Expected immediately:** Riley's row and the complete Group A
    resource/pending chain disappear; Reject Transport returns to `2 left` for
    Start `09/08/2026`, End `09/15/2026`.

18. **Riley — check notifications and roles. Expected:** exactly one rejection
    notification; no Asset Manager, Event Admin or generated-Group role.

19. **Reload Casey once and Riley once. Expected:** the rejected request does
    not return and no duplicate rejection notification appears.

20. **Report this exact phrase and wait:**

    `ASSET-BORROW-001 reject complete: Riley rejected once and scope cleared`

Codex must run `verify-borrow-reject` before the accepted Capacity branch.

## 4. Nova requests the overlapping Capacity item and Casey accepts

21. Continue only after Codex confirms step 20. **Casey — open Capacity
    Transport Statistics and write down every displayed total.**

    **Expected baseline:** accepted borrowed items `1`; occupied quantity `2`.

22. **Nova — set Start `09/08/2026`, End `09/15/2026`; open
    `QA ASSET-BORROW-001 Capacity Transport → Borrow`; keep Quantity `1`;
    press `Send borrow request` exactly once.**

    **Expected:** Capacity Transport becomes `0 left` for Start `09/08/2026`,
    End `09/15/2026`. Change to Start `09/16/2026`, End `09/17/2026`: it must
    show `3 left`. Then restore Start `09/08/2026`, End `09/15/2026`.

23. **Casey — check:** exactly one notification with detail
    `Requested access · QA ASSET-BORROW-001 Capacity Transport`, and exactly
    one pending Nova row under Capacity Transport showing Group A, QA Borrow
    Stage, Start `09/08/2026`, End `09/15/2026`, Quantity `1`. Press `Approve`
    and confirm exactly once.

24. **Casey — check without reload. Expected:** Nova's row changes from
    pending to accepted exactly once; the complete pending red-counter chain
    clears; Capacity Transport remains `0 left` for Start `09/08/2026`, End
    `09/15/2026`. Approval must not subtract Quantity `1` again.

25. **Casey — check both groups. Expected:** Group A contains Capacity
    Transport exactly once with Nova Quantity `1`; Group B still contains
    Lina's accepted Capacity Transport Quantity `2`.

26. **Nova — check the Group A Capacity Transport assignment. Expected:** Nova
    is `Manager` only for this exact assignment. Nova is not the global Asset
    owner, Event Admin, Group A Admin or a member of another Tournament group.
    Do not use any Manager action.

27. **Casey — reopen Capacity Transport Statistics. Expected:** accepted
    borrowed items changed `1 → 2`; occupied quantity changed `2 → 3`;
    assigned and pending totals have no unrelated change.

28. **Nova — check notifications. Expected:** exactly one acceptance
    notification. No checkout, payment session, Payment summary or
    `inventoryApplied=true` state exists.

29. **Report this exact phrase and wait:**

    `ASSET-BORROW-001 accepted: Group A quantity 1, Group B quantity 2, occupied 3`

Codex must run `verify-borrow-accepted` before the terminal reload.

## 5. Reload and terminal isolation

30. Continue only after Codex confirms step 29. **Reload Casey once and Nova
    once. Do not reload Riley again.**

31. **Nova — reopen Group A. Casey — reopen Group A and Group B. Expected:**
    Group A retains Nova's accepted Capacity Transport Quantity `1`; Group B
    retains Lina's Quantity `2`; Reject and Cancel branches remain absent.

32. **Nova — check Explore. Expected:** Capacity Transport says `0 left` for
    Start `09/08/2026`, End `09/15/2026`, and `3 left` for Start `09/16/2026`,
    End `09/17/2026`. No quantity, request or member row is duplicated.

33. **Check Event roles and both generated-Group member lists. Expected:**

    - Event: Casey is Admin; Nova, Riley and Lina are Members;
    - Group A: Casey, Nova and Riley are Members;
    - Group B: Lina is the only Member;
    - Nova is Manager only on Group A's Capacity Transport assignment.

    Borrow must not create global Asset ownership or another Event/Group role.

34. **Casey — check Capacity Transport Statistics. Expected:** accepted
    borrowed items remain `2`; occupied quantity remains `3`.

    **Check notifications. Expected:** Casey has one request notification for
    Nova's Cancel request, one for Riley's Reject request and one for Nova's
    Capacity request; Riley has one rejection notification; Nova has one
    acceptance notification. None is duplicated.

35. **Report this exact terminal phrase:**

    `ASSET-BORROW-001 UI complete: cancel, reject, accept, capacity and Statistics persist`

Wait for Codex's final server-side persistence and scope check. Do not reset or
begin another testcase until the matrix result and next resume boundary are
saved. Codex runs `verify-borrow-terminal` only after the terminal phrase.
