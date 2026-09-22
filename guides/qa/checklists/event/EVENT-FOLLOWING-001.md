# EVENT-FOLLOWING-001 — Followed organizers

Independent regression case. Do not change historical Event or Integration PASS results.

## Baseline and scope

1. Run `python3 guides/qa/tools/event-following-fixture.py stage`, then `status`.
2. Launch `node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-FOLLOWING-001`.
3. The viewer follows nobody. Organizer has two current/public events, one past, one private and one draft. A second organizer has one current/public event. Fixture does not seed following outcomes.

## Numbered acceptance checks

1. Open viewer side menu: Followed appears before Tables when assigned. Location and buttons do not overlap; header provides a separate action row.
2. Open Explore, then the context menu of `QA FOLLOWING current`. Follow organizer. Watchlist remains independent.
3. The separate red side-menu badge becomes **2**, member count becomes **1**. Avatar activity total does not change because of following.
4. Click Followed: Explore opens with Only followed enabled and shows current + future. Past, private, draft and other-organizer events are absent. Existing participation does not hide an otherwise visible followed event.
5. Open filters. Only followed, Friends going and Open spots use the shared toggle indicator. Apply/reopen preserves the toggle. Switch off Only followed to recover the ordinary Explore view.
6. Open the followed-member icon: existing Members popup lists the organizer. Its action menu offers Unfollow. Confirm: list and member count become empty, event counter becomes zero. Follow again for remaining checks.
7. Reload: relationship, count and stored filter survive. Repeating a follow request does not duplicate the organizer or event count. Wrong caller-selected identity cannot replace the authenticated actor; self-follow is rejected.
8. As organizer, trash a current/public event. Viewer poll updates **2 → 1** without opening the followed list. Restore returns **1 → 2**. Publishing a draft adds exactly one, repeating the operation does not double-count.
9. Through a disposable short-lived event, verify end-time expiry removes it from both stored count and filtered list using the existing expiry worker. No additional frontend counter polling.
10. Add/remove Watchlist on one event and verify organizer following persists. Unfollow via Members, close only this checkpoint's windows and reset fixture. Check EN/HU labels and compact/mobile layout without changing existing user windows.

## Evidence

Keep dated execution results under `guides/qa/evidence/`. Mark only actually exercised steps PASS, record failures/limitations, and update the QA matrix after completion.
