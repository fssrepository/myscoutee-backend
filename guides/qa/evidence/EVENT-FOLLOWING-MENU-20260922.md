# Following menu extension — 2026-09-22

This is new verification for changes after EVENT-FOLLOWING-001 closed.
It does not rewrite that historical browser PASS.

## Behavior

- Activities Event cards reuse the shared card-menu converter for External info
  (valid HTTP(S) source link) and Follow organizer / Unfollow. Self-follow is hidden.
- The server already returns sourceLink in the list response. The frontend DTO
  and local mapper now retain it; opening the menu needs no detail request.
- Explore, Activities and followed Members all use DialogStore confirmation.
  Persistence starts only on confirm. The existing dialog busy/error behavior
  waits for completion, rejects duplicate confirmation, and retains failures.
- Local following uses the existing /activities/events route-delay mechanism.
  HTTP follows normal request completion, without a new artificial delay.
- A successful atomic users.following write returns the authoritative snapshot
  and eventCountDelta. First follow adds eligible current events; unfollow removes
  them; repeating the same relationship update has zero delta when events have not changed.
- FollowingStore updates only after success. It applies the signed delta against
  the server pre-write count, or reconciles the snapshot if a poll already caught
  up or the view is not hydrated. Old poll revisions cannot overwrite the commit.
- Members uses applyCommittedMembers -> SmartList.replaceVisibleItems with the
  reduced total after successful unfollow. Explore uses its shared-store effect
  to remove unfollowed cards, without a full-list reload.

## Executed verification

- Frontend focused Vitest: **27 PASS**.
  - activity-event-following-menu.spec.ts: 6
  - event.mapper.spec.ts: 4
  - following-confirmation.spec.ts: 11
  - following.store.spec.ts: 6
- Backend OrganizerFollowingServiceTest: **12 PASS** (zero failures/errors).
  Existing hot-deploy main classes reused; compileJava/processResources excluded
  from the focused Gradle test invocation; one worker.
- Existing frontend-sync and backend watcher compilation: PASS.
- `node frontend/scripts/audit-i18n-mongo-seed.js`: PASS.
- Parent/frontend `git diff --check`: PASS.

No new browser full-flow execution was performed for this extension. The
confirmation tests exercise real component action methods, DialogStore and the
Members SmartList integration using controlled deferred saves; backend tests
verify the successful write and returned delta. No fixture was staged, and no
user browser was navigated or resized.
