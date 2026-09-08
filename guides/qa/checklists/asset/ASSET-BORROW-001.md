# ASSET-BORROW-001 user test guide

This is the stable manual guide, not an execution log. Use only the staged
Casey, Nova and Riley browser sessions. Do not compensate for a mismatch with
an extra click, reload or manual data edit.

## Baseline

Open as **Nova**:

`Activities → Events → Active Events → QA ASSET-BORROW-001 Tournament → View Event → QA Borrow Stage → Groups → Group A → Assets → Transport → + / Explore`

Use these exact date ranges:

- overlap: Start `09/08/2026`, End `09/15/2026`
- non-overlap: Start `09/16/2026`, End `09/17/2026`

Explore must show each source Asset exactly once:

| Asset | Stored quantity | Price | Overlap availability |
| --- | ---: | ---: | ---: |
| `QA ASSET-BORROW-001 Capacity Transport` | `3` | Free | `1 left` |
| `QA ASSET-BORROW-001 Reject Transport` | `2` | Free | `2 left` |
| `QA ASSET-BORROW-001 Cancel Transport` | `2` | Free | `2 left` |
| `QA ASSET-BORROW-001 Paid Transport` | `2` | `3200 HUF` | `2 left` |

Every Borrow dialog must show `Quantity = 1` as read-only and must still show
`Available for this time: X item(s)`. To request two items, submit Borrow twice.
Each submission is a new request, approval, assigned card and—when paid—a new
payment. Existing assigned cards are read-only.

The Explore-card menu must not contain `Payment summary`. An assigned paid
request card must contain it.

## 1. Scope-local Organizer only

Finish this block before sending a Borrow request. Always switch the tested row
back to `Count as participant`, so all baseline counts are restored.

1. **Casey — Tournament Members → Casey.** Select `Organizer only`.
   Expected immediately: Tournament accepted count `4 → 3`; Casey stays Admin;
   QA Borrow Stage and Group A do not change. Reopen Casey's menu: only
   `Count as participant` is shown. Select it and expect `3 → 4`.

2. **Casey — QA Borrow Stage Members → Casey.** Select `Organizer only`.
   Expected: only the Stage accepted count changes `4 → 3`; Tournament and
   Group A do not change. Select `Count as participant` and expect `3 → 4`.

3. **Casey — Group A Members → Casey.** Select `Organizer only`.
   Expected: only Group A changes `3 → 2`; Tournament and Stage do not change.
   Select `Count as participant` and expect `2 → 3`.

No action above removes a membership, changes a role or rewrites another
scope. All counter/card changes must appear without reload and persist after
one reload.

## 2. Date range and free dialog

4. **Nova — Explore, overlap dates.** Capacity must say `1 left` because Lina
   already occupies two of its three items in Group B.

5. Open `Capacity Transport → Borrow`. Expected: Quantity is read-only `1`,
   availability is `1 item`, button is `Send borrow request`, and there is no
   Payment/provider/card block. Close without sending.

6. Set the non-overlap dates. Capacity must say `3 left`. Set the overlap
   dates again. Reject and Cancel must each say `2 left`.

7. **Casey — Group B.** Lina's accepted Capacity request is still Quantity
   `2`; Explore reads and date changes made no write.

## 3. Free Cancel

8. **Nova — overlap dates → `Cancel Transport → Borrow`.** Confirm read-only
   Quantity `1`; press `Send borrow request` once.

9. Expected without reload: one new pending card appears with date range
   `09/08/2026 – 09/15/2026`; the red pending delta reaches Transport, Group A,
   Stage and Tournament. The header says `0 members · 1 pending`.

10. **Casey.** Exactly one request notification identifies
    `QA ASSET-BORROW-001 Cancel Transport`, and exactly one pending Nova row
    shows Group A, Stage, the same date range and Quantity `1`.

11. **Nova — own pending row → `Cancel join request`.** Confirm once.
    Expected without reload: the row, assigned card and complete pending badge
    chain disappear; Cancel returns to `2 left`. Group B is unchanged.

12. Reload Nova and Casey once. Nothing from the cancelled branch returns.
    Report:

    `ASSET-BORROW-001 cancel complete: Nova request removed once`

Wait for `verify-borrow-cancel`.

## 4. Free Reject

13. **Riley — overlap dates → `Reject Transport → Borrow`.** Confirm Quantity
    is read-only `1`; send once.

14. **Casey.** Open the one pending Riley row for Reject Transport and select
    `Reject request` once.

15. Expected without reload: Riley's row/card and pending badge chain
    disappear; Reject returns to `2 left`. Riley receives exactly one rejection
    notification identifying Reject Transport and gains no Asset/Event/Group
    role.

16. Reload Casey and Riley once. The request and badges do not return. Report:

    `ASSET-BORROW-001 reject complete: Riley rejected once and scope cleared`

Wait for `verify-borrow-reject`.

## 5. Free Accept and capacity

17. **Casey — Capacity Transport Statistics.** Baseline is one accepted Borrow
    request and occupied Quantity `2` (Lina in Group B).

18. **Nova — overlap dates → `Capacity Transport → Borrow`.** Send the
    read-only Quantity `1` request once. Expected without reload: overlap
    availability becomes `0 left`; non-overlap remains `3 left`.

19. **Casey.** Approve the one pending Nova Capacity row once. Expected: the
    row becomes accepted, all pending badges clear, and availability remains
    `0 left`—approval must not subtract it a second time.

20. Group A contains Nova's Quantity `1` card and Group B contains Lina's
    Quantity `2` card. Both show their booking date ranges. Nova is Manager only
    for the scoped Asset assignment; no Event or Group role changed.

21. Capacity Statistics is now two accepted Borrow requests and occupied
    Quantity `3`. No payment exists for this free request. Report:

    `ASSET-BORROW-001 accepted: Group A quantity 1, Group B quantity 2, occupied 3`

Wait for `verify-borrow-accepted`.

## 6. First paid request and Organizer only before approval

22. **Nova — overlap dates → `Paid Transport → Borrow`.** Expected: Quantity
    is read-only `1`, availability is `2 items`, total is `3200 HUF`, provider
    is Barion, and saved card is Mastercard `****4444`. Pay and send once.

23. Expected without reload: exactly one pending Paid Transport card appears
    with `09/08/2026 – 09/15/2026`; all pending badges increase by one. Explore
    now says `1 left` for the overlap dates.

24. **Nova — pending Paid Transport Members row → `Organizer only`.** Expected:
    the request remains pending, Nova remains Manager, only `Count as
    participant` replaces the menu action, and Event/Stage/Group memberships
    do not change.

25. **Casey.** Confirm there is exactly one pending Paid request and one owner
    notification identifying `QA ASSET-BORROW-001 Paid Transport`. Do not
    approve yet. Report:

    `ASSET-BORROW-001 paid pending: one request, organizer only before approval`

Wait for `verify-borrow-paid-pending-organizer`.

## 7. Approve, count as participant, then switch back

26. **Casey.** Approve that exact Paid request once.

27. **Nova — accepted Paid Transport Members row → `Count as participant`.**
    Expected without reload: the Asset scope accepted participant count changes
    `0 → 1`; request, payment, card and Manager role remain unchanged. Report:

    `ASSET-BORROW-001 paid accepted: counted as participant after approval`

Wait for `verify-borrow-paid-accepted-participant`.

28. **Nova — same accepted row → `Organizer only`.** Expected: only the Asset
    scope accepted participant count changes `1 → 0`; the accepted request and
    paid assigned card remain.

## 8. Second independent paid request

29. **Nova — Explore, overlap dates → `Paid Transport → Borrow`.** Quantity is
    again read-only `1`, availability is `1 item`, total is `3200 HUF`. Pay and
    send once. Do not reload.

30. Expected immediately: the assigned list contains two separate cards,
    `QA ASSET-BORROW-001 Paid Transport #1` and `#2`. Both show the booking date
    range. One is accepted and one is pending. Each card has its own `Payment
    summary`; Explore still has no Payment summary menu.

31. **Casey.** Two separate Paid rows are visible. Approve only the new pending
    row once. Expected: both are accepted, no pending badge remains, and Paid
    Transport says `0 left` for the overlap dates.

32. Reload Casey and Nova once. Expected: two request IDs, two accepted cards,
    two approvals and two independent `3200 HUF` Payment summaries remain.
    Nova is still Organizer only in this Asset scope, so its accepted
    participant count is `0`; its Manager role and both accepted requests stay.

33. Confirm the three free branches and Lina's Group B Quantity `2` control are
    unchanged. Report:

    `ASSET-BORROW-001 UI complete: free branches, two paid requests and scope-local organizer state persist`

Wait for `verify-borrow-terminal`. Do not reset the fixture until its server
oracle has passed and the QA ledger/resume pointer has been updated.
