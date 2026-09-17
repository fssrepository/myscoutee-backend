# ASSET-BORROW-001 user test guide

This is the stable manual guide, not an execution log. Use only the staged
Casey, Nova and Riley browser sessions. Do not compensate for a mismatch with
an extra click, reload or manual data edit.

## Baseline

Start with **Casey in Block 1** below. For **Block 2**, open as **Nova**:

`Activities → Events → Active Events → QA ASSET-BORROW-001 Tournament → View Event → QA Borrow Stage → Groups → Group A → Assets → Transport → + / Explore`

Use these exact date ranges:

- overlap: Start `09/17/2026 09:32`, End `09/24/2026 10:32`
- non-overlap: Start `09/25/2026 10:32`, End `09/26/2026 10:32`
- paid checks (steps 22 and 29): Start `09/18/2026 10:32`, End `09/20/2026 10:32` — exactly two days.

Times above use the prepared browser's local timezone (Europe/Bratislava).

Explore must show each source Asset exactly once:

| Asset | Stored quantity | Price | Overlap availability |
| --- | ---: | ---: | ---: |
| `QA ASSET-BORROW-001 Capacity Transport` | `3` | Free | `1 left` |
| `QA ASSET-BORROW-001 Reject Transport` | `2` | Free | `2 left` |
| `QA ASSET-BORROW-001 Cancel Transport` | `2` | Free | `2 left` |
| `QA ASSET-BORROW-001 Paid Transport` | `2` | `3200 HUF / day` | `2 left` |

Every Borrow dialog must show `Quantity = 1` as read-only and must still show
`Available for this time: X item(s)`. To request two items, submit Borrow twice.
Each submission is a new request, approval, assigned card and—when paid—a new
payment. Existing assigned cards are read-only.

The Explore-card menu must not contain `Payment summary`. An assigned paid
request card must contain it.

## 1. Event Organizer only and started tournament Group

The prepared tournament Stage is already active. Its Group participants cannot
switch to `Organizer only`: leaving must use `Leave group`, which also handles
tournament participation. The main Event's own setting remains independent.

1. **Casey — Event Members.** Open `Activities → Events → Active Events`.
   Find **QA ASSET-BORROW-001 Tournament** → **4 / 4 member badge** on its card
   image → **Casey Bridge** → **three-dot menu** → `Organizer only`.
   Check the Event count changes **4 → 3** and Casey stays **Admin**.
   Leave this setting on and close Members with **X**.

2. **Casey — Group A Members.** On the Tournament card, open **three-dot menu**
   → `View Event` → **QA Borrow Stage** → **three-dot menu** → `Groups`.
   Check Group A still has **3 members**, with Casey, Nova and Riley in
   **Standings**. On **Group A**, open **three-dot menu** → **Tagok** (Members)
   → **Casey Bridge** → **three-dot menu**.
   Neither `Organizer only` nor `Count as participant` may appear for this
   started tournament Group. The Event setting must not change Casey's Group
   membership, role or standings. Close Members. The Group menu's `Leave group`
   is the withdrawal action; do not leave during this Borrow setup.

3. **Casey — restore only the Event setting.** Return to
   `Activities → Events → Active Events` → Tournament's **3 / 4 member badge**
   → **Casey Bridge** → **three-dot menu** → `Count as participant`.
   The Event returns **3 → 4**; Group A stays **3**. Check after one reload that
   the Event count, Group count and standings remain unchanged.

The inaccessible standalone Stage Members toggle check has been removed.
If Group A already shows **2 members** while Standings still lists all three,
report that retained mismatch before continuing; it is not a passing baseline.

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
   `09/17/2026 – 09/24/2026`; the red pending delta reaches Transport, Group A,
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

22. **Nova — use the two-day paid range above → `Paid Transport → Borrow`.** Expected: Quantity
    is read-only `1`, availability is `2 items`, total is `6400 HUF`, provider
    is Barion, and saved card is Mastercard `****4444`. Pay and send once.

23. Expected without reload: exactly one pending Paid Transport card appears
    with `09/18/2026 – 09/20/2026`; all pending badges increase by one. Explore
    now says `1 left` for the overlap dates.

24. **Nova — pending Paid Transport Members row → `Organizer only`.** Expected:
    the request remains pending, Nova remains Manager, only `Count as
    participant` replaces the menu action, and Event/Stage/Group memberships
    do not change.

    **Nova — Payment history:** open this payment → card menu → `Payment summary`. The duration row must say **2 days**, matching Borrow, and the total must remain **HUF 6400**.

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

29. **Nova — Explore, the same two-day paid range → `Paid Transport → Borrow`.** Quantity is
    again read-only `1`, availability is `1 item`, total is `6400 HUF`. Pay and
    send once. Do not reload.

30. Expected immediately: the assigned list contains two separate cards,
    `QA ASSET-BORROW-001 Paid Transport #1` and `#2`. Both show the booking date
    range. One is accepted and one is pending. Each card has its own `Payment
    summary`; Explore still has no Payment summary menu.

31. **Casey.** Two separate Paid rows are visible. Approve only the new pending
    row once. Expected: both are accepted, no pending badge remains, and Paid
    Transport says `0 left` for the overlap dates.

32. Reload Casey and Nova once. Expected: two request IDs, two accepted cards,
    two approvals and two independent `6400 HUF` Payment summaries remain.
    Nova is still Organizer only in this Asset scope, so its accepted
    participant count is `0`; its Manager role and both accepted requests stay.

33. Confirm the three free branches and Lina's Group B Quantity `2` control are
    unchanged. Report:

    `ASSET-BORROW-001 UI complete: free branches, two paid requests and scope-local organizer state persist`

Wait for `verify-borrow-terminal`. Do not reset the fixture until its server
oracle has passed and the QA ledger/resume pointer has been updated.
