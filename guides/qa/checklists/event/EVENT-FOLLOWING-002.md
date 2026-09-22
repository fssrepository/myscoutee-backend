# EVENT-FOLLOWING-002 — Event menus, confirmation and committed following

Independent follow-up to closed EVENT-FOLLOWING-001. Do not rewrite its result.

## Fixture and managed sessions

1. `python3 guides/qa/tools/event-following-fixture.py status EVENT-FOLLOWING-002` must show no retained fixture.
2. Run `stage EVENT-FOLLOWING-002`, then `menu-invitation EVENT-FOLLOWING-002`, then `status EVENT-FOLLOWING-002` with the same script.
3. Run `node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-FOLLOWING-002`.
4. Viewer has two Event invitations from the organizer; current has a controlled external link, future has none. Organizer owns two eligible current/public events. Neither actor initially follows anyone.

## Numbered checks

1. Activities → Invitations → current event menu: invitation actions remain; External info and Follow organizer exist. Future menu has no External info. External info opens the configured URL in a separate tab.
2. Activities Follow organizer → Cancel: no mutation/request and no badge/member change.
3. Activities Follow organizer → Confirm: shared busy dialog waits for the real save; response delta +2, users.following eventCount 2, side badge 2. Reopen card menu: Unfollow replaces Follow.
4. Activities Unfollow → Cancel preserves state; Confirm returns delta -2 and count 0; reopen offers Follow.
5. Explore: follow/unfollow have the same confirm/cancel behavior. Real network failure retains the dialog/error and previous state. Retry after transport restoration succeeds once.
6. Followed-only Explore + Members: Unfollow Cancel retains the member. Successful Confirm removes it and updates member/event totals and the visible filtered cards without full-list refetch.
7. Reload and ordinary poll reflect the stored state; repeating an already-committed relationship request returns zero delta. Self-owned Activities card has no Follow action.
8. Close only these managed sessions, reset EVENT-FOLLOWING-002, verify no actors/events/snapshot remain.

## Evidence boundary

Use actual browser menu actions and network responses for UI acceptance. Setup is not a mutation PASS. Delay/failure uses CDP transport controls, never substituted application methods or fetch mocks. Record executed observations separately under `guides/qa/evidence/`.

## Delegated automation commands

After the baseline and versioned launcher above, use
`node guides/qa/tools/event-following-menu-qa.mjs COMMAND [VALUE] [ACTOR]`.
Actor 0 is viewer; actor 1 is organizer. `prepare` accepts the privacy dialog and
opens the side menu. `activities` opens Invitations; `menu "QA FOLLOWING current"`
opens its card menu. `click "Follow organizer"`, `cancel`, and `confirm` drive the
shared dialog. The actual unfollow label is `Unfollow`.

`confirm delay` adds 1500ms transport latency; `confirm fail` blocks just the
following save. Both restore transport settings in finally. After the failure,
plain `confirm` retries the retained dialog. `external` verifies/closes the
controlled external tab. `followed`, `click "Event filters"`, and
`click "Followed organizers"` open the filtered list and shared Members popup.
Use `click "Open actions for Following QA Other"` for its member action menu.

For the ordinary Explore follow branch, disable Only followed and follow Other
(+1); the primary organizer's two events already have invitation copies.
`repeat` sends the real HTTP adapter's already-committed Other-unfollow request
and must return zero delta. `reload` then `poll` observes normal stored-state
hydration; poll capture waits up to 45 seconds and does not invoke a poll itself.
Each successful command appends timestamped state and sanitized network evidence.

Cleanup commands:

```sh
node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-FOLLOWING-002 --close-only
python3 guides/qa/tools/event-following-fixture.py reset EVENT-FOLLOWING-002
python3 guides/qa/tools/event-following-fixture.py status EVENT-FOLLOWING-002
```
