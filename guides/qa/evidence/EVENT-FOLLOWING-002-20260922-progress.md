# EVENT-FOLLOWING-002 — execution, 2026-09-22

**PASS / CLOSED** — all eight checks completed in dev HTTP scope.

Separate QA for Activities menus, confirmation and committed following deltas.
The closed EVENT-FOLLOWING-001 result is unchanged. User explicitly delegated
this full flow. Existing dev HTTP stack and its watchers were reused.

Checklist: [EVENT-FOLLOWING-002](../checklists/event/EVENT-FOLLOWING-002.md).
Replay commands and isolated baseline are in that checklist. Actual action
snapshots/network observations: [browser log](EVENT-FOLLOWING-002-20260922-browser.json).
No application method or response was substituted. `repeat` alone calls the real
HTTP adapter directly to test idempotency; UI checks use button actions.

| Step | Result | Observation |
| --- | --- | --- |
| 1 | PASS | Activities invitation actions retained. Current event has External info; future without URL does not. URL opened in a separate target and that target was closed. No menu-open detail request. |
| 2 | PASS | Follow Cancel sends no mutation and leaves count 0. |
| 3 | PASS | Follow Confirm: one POST, delta +2, store/badge 2, persisted users.following 2. Under 1500ms transport latency the dialog buttons stay disabled and state remains 0 until success. Reopening offers Unfollow. |
| 4 | PASS | Unfollow Cancel leaves count 2. Confirm: one POST, delta -2, count 0, menu returns to Follow organizer. |
| 5 | PASS | Explore Unfollow Cancel preserves both cards. Blocked transport retains error dialog and count 2. After restoring transport, retry makes one successful POST, delta -2, cards disappear without list refetch. Ordinary Explore then follows Other: Cancel leaves unchanged; delayed Confirm returns +1. |
| 6 | PASS | Reloaded Followed list contains Other. Members Cancel retains member/card/count 1. Confirm returns -1; member total becomes 0, row and filtered event card disappear, side count 0. Only the mutation POST occurs; no members/explore reload. |
| 7 | PASS | Repeated committed unfollow returns delta 0. Ordinary poll returns persisted empty/0; after another UI follow and reload the ordinary poll returns persisted count 2 and the store renders 2. Own Activities menu has no Follow. |
| 8 | PASS | Closed only EVENT-FOLLOWING-002 managed sessions and reset its fixture. Cleanup oracle: snapshot null, users empty, events 0, members 0. |

Fixture creates two invitations only as prerequisites. Relationships/counts are
created through actual UI saves. Explore's primary-organizer checks use the
Followed view (invitations already exist); ordinary Explore follows Other, whose
one public event is eligible. See the persisted JSON snapshots for zero and
positive users.following states.

Harness observations: the first external-link probe omitted CDP userGesture and
was blocked; adding userGesture opens the exact configured URL. A probe initially
looked for “Unfollow organizer”; the real localized button is “Unfollow”. Neither
required a product change. After reload, the store starts empty until the normal
30-second poll hydrates it; this run records the eventual stored-state result,
not immediate first-frame hydration.

Earlier focused extension tests: 27 frontend and 12 backend PASS, recorded in
[unit evidence](EVENT-FOLLOWING-MENU-20260922.md). This run adds desktop dev HTTP
browser evidence; it does not claim a full local-adapter browser run, mobile
platform coverage or a release deployment.

Persistence oracles: [zero](EVENT-FOLLOWING-002-20260922-persisted.json), [followed](EVENT-FOLLOWING-002-20260922-persisted-followed.json), [cleanup](EVENT-FOLLOWING-002-20260922-cleanup.json).
