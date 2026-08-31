# ROLE-TRIAD-CORE-001 manual execution checklist

The fixture was reset and staged cleanly, and a read-only oracle confirmed the
`baseline-ready` state. Three new isolated managed browser windows are open:
Kai (member), Ava (admin), and the Deployment Operator. Do not introduce a
fourth identity. Do not reload or replace these windows before capturing the
initial baseline.

Initial state before any mutation:

- Kai is `host only`, is not blocked, and has no previous profile status.
- Both controlled reports are unresolved and unwarned.
- The controlled feedback item is unresolved.
- No controlled support chat or support message exists.
- Ava shows Reports `2`, Feedback `1`, Chats `0`, and avatar aggregate `3`.
- Those four values remain unchanged through one normal poll cycle.
- The Blocked users action has no badge and its list is empty.
- Every stored Ava support-case status bucket is `0`.

If any expectation differs, stop at that numbered step. Do not attempt to fix
the state by reloading, repeating the action, or applying a compensating
mutation. Report the step number and the state that was actually visible.

## 22-step journey

1. [ ] Kai authorization boundaries

   - `/game` works in Kai's window.
   - No Admin or Operator entry is visible.
   - Direct navigation to `/admin` and `/operator` cannot grant access.
   - Protected content must not flash before the denial or redirect.
   - Return to the normal member surface afterwards.

2. [ ] Ava authorization boundaries

   - Ava's `/admin` workspace works.
   - Reports, Feedback, and Chats are available.
   - `/operator` cannot open and redirects back to the admin surface.
   - Ava's admin session and selected admin identity remain unchanged.

3. [ ] Operator authorization boundaries

   - `/operator` works in the Operator window.
   - Admin moderation data is not visible.
   - Direct navigation to `/admin` does not grant admin access.
   - The Operator session and operator authority remain intact.

4. [ ] Branding mutation and persistence

   In the Operator window:

   - Record the original product name, logo, home label, and theme values.
   - Change one branding value and select `Save branding`.
   - Reopen the branding surface or explicitly reload the Operator window;
     the saved value must be reconstructed.
   - Explicitly reload Kai and Ava afterwards. Their fresh reads show the new
     branding without losing their sessions or roles.
   - Automatic branding refresh in an already-open client is **not required**
     and its absence is not a failure.
   - Kai and Ava still cannot edit operator configuration.

5. [ ] Reports baseline and report details

   In Ava:

   - Open `Moderation & support → Reports`.
   - The main Reports badge is `2`; the external red Unresolved filter badge
     is `2`.
   - Resolved has no positive count on this clean baseline.
   - Open the `No-show / unsafe event behavior` report.
   - Reporter, Kai target, reason, and source details are correct.
   - The `Harassment` report remains the unchanged control.
   - `View user` may open a new tab, but it must not replace the admin session
     in Ava's original tab. Close the new tab after checking it.

6. [ ] Send the warning and verify admin status counters

   In Ava, on the selected `No-show / unsafe event behavior` report:

   - Select `Warn user`.
   - No error may claim that Ava lacks permission to send the warning.
   - Exactly one warning is added to Kai's persisted support thread.
   - Ava receives no self-notification.
   - The report stays unresolved: Reports `2`, Unresolved `2`.
   - The support case becomes Warned.
   - Ava's Chats main badge immediately becomes `1`; Warned is `1` in the
     support status dropdown.
   - Ava's avatar aggregate becomes `4` = Reports `2` + Feedback `1` +
     actionable Chats `1`.
   - A normal poll cycle does not clear or revert these values.

7. [ ] Receive the warning in Kai's closed-chat state

   Keep Kai's support chat closed.

   - The bell receives one new unread notification.
   - Kai's member-side Chats unread counter increases.
   - The App support row has an unread badge.
   - The notification and chat both refer to the same warning.
   - Ava's Chats `1` is a case-status counter, not a copy of Kai's unread.

8. [ ] Open Kai's persisted App support chat

   - The existing `c-support-admin-*` thread opens; no synthetic View chat or
     replacement support session is created.
   - The warning is immediately visible.
   - Real Kai and Ava avatar images are shown.
   - There is no generic or stretched `2 members` avatar pill.
   - Opening clears Kai's chat unread and member Chats unread counter
     immediately.
   - The related bell notification and notification counter reconcile from
     the server on the normal notification poll. Loading the chat must not
     optimistically overwrite the notification counter from the chat response.
   - After that poll, the related notification is no longer in New and the
     bell counter reflects the same persisted read state.
   - Ava's case remains Warned and Ava's Chats main badge remains `1`.
   - Closing the chat does not recreate the already-read warning notification.

9. [ ] Send Kai's support reply

   Keep Ava's chat closed. Kai sends exactly:

   `ROLE-TRIAD support reply: understood.`

   - The message is written to the same persisted support thread.
   - Kai's session does not change during the send.

10. [ ] Verify Ava unread state separately from the Chats main badge

   - Ava's Activities → Chats → App support row gains an unread badge.
   - Ava's bell also signals because the thread is closed.
   - Ava's Chats main badge **remains `1`** because it counts Warned, Pending,
     Picked, and Blocked cases, not unread messages.
   - The dropdown shows All `1`, Warned `1`, and every other status `0`.
   - Ava's avatar aggregate remains `4`.
   - Neither the status badge nor the row unread disappears and reappears over
     a complete normal poll cycle.

11. [ ] Open Ava's support chat and exercise live status buckets

   - Kai's reply is immediately visible with the earlier messages.
   - Real avatars are shown and History is directly before Close in the header.
   - No generic Members pill is shown in the App-support header.
   - Opening clears Ava's row unread and bell, while the Chats main badge stays
     `1`.
   - From Kai's support row, select Pick: Warned `1 → 0`, Picked `0 → 1`
     immediately and without reload.
   - While the support filter is All, that status transition patches the same
     visible row in place; it must not remove the row from All.
   - Select Unpick: Picked `1 → 0`, Pending `0 → 1` immediately.
   - Select the Pending bucket, then select Pick once more: Kai's row is
     removed immediately from the currently filtered SmartList, while Pending
     `1 → 0` and Picked `0 → 1`. Switching to Picked shows the same row in its
     new bucket; no reload, component-owned array mutation, or list refetch is
     involved.
   - The actionable main badge stays `1`, the avatar aggregate stays `4`, and
     the foreground/background poll handoff does not overwrite any transition.

12. [ ] Verify History, View chat, and popup stacking

   Select History in Ava's chat header.

   - A support user with no moderation history has a disabled History action;
     clicking it cannot open an empty-state or error dialog.
   - A support user with history has an external red badge containing the
     total stored report count.
   - History opens above the chat while the underlying chat remains mounted.
   - Only Kai's relevant reports and moderation history are listed.
   - The list is a SmartList, not a separately hand-built panel.
   - Each date/group row is a full-width header, not an enlarged grid content
     cell.
   - `View chat` opens the same persisted support thread inside the admin app;
     it does not create a new identity or replace Ava's session.

13. [ ] Resolve exactly one controlled report

   - Resolve only `No-show / unsafe event behavior`.
   - Reports main badge changes `2 → 1`.
   - The external red Unresolved filter badge changes `2 → 1`.
   - The external green Resolved filter badge changes `0 → 1` and remains
     visible outside the filter control.
   - `Harassment` remains unresolved and unchanged.
   - No duplicate resolution or repeated moderation event is created.
   - The reporter's support case becomes Solved, so the Chats dropdown is All
     `2`, Picked `1`, Solved `1`; the Chats main badge remains `1`.
   - Ava's avatar aggregate becomes `3` = Reports `1` + Feedback `1` +
     actionable Chats `1`.

14. [ ] Resolve exactly one controlled feedback item

   In Ava:

   - Open `Moderation & support → Feedback`.
   - Main Feedback and its red Unresolved filter badge start at `1`.
   - Open Kai's controlled feedback and select `Mark resolved`.
   - Feedback main badge changes `1 → 0`; Unresolved changes `1 → 0`.
   - The external green Resolved filter badge changes `0 → 1`.
   - Only this feedback changes; unrelated report, rating, and impression data
     remain unchanged.
   - Kai receives exactly one `feedback-resolved` bell notification sourced
     from the controlled feedback ID; Ava receives no self-notification. Kai
     opens and reads it once through the normal notification surface/poll.
   - Feedback resolution creates no chat, channel or chat message. In
     particular it neither creates `c-feedback-admin-*` nor writes into Kai's
     moderation/warn `c-support-admin-*` thread.
   - It does not change chat unread, the Chats main badge, or any moderation
     support-case bucket.
   - Ava's support buckets therefore remain All `2`, Picked `1`, Solved `1`,
     with all other status buckets `0`.
   - Ava's Chats main badge remains `1`; avatar aggregate changes `3 → 2`.
     The remaining `2` are the unresolved `Harassment` report and Kai's
     actionable Picked moderation case.
   - All changes are immediate and survive a normal poll cycle.

15. [ ] Block Kai

   From Ava's Reports/History surface:

   - Select `Block user` and confirm once.
   - The crossed-person Blocked users action shows an external red `1` badge.
   - Counts of ten or more use the standard `9+` format.
   - Kai's case becomes Blocked: All `2`, Blocked `1`, Solved `1`.
   - Chats main badge remains `1`; avatar aggregate remains `2` while the
     existing actionable case changes from Picked to Blocked immediately.
   - Reports remains `1`; blocking does not resolve the control report.

16. [ ] Observe the live block and the blocked-user support chat

   In Kai, without reload:

   - The side-menu poll applies the blocked profile status.
   - Protected member functionality becomes unavailable.
   - App support remains available and looks like a normal chat.
   - The moderation information message states that Kai is blocked and may
     request review/unblocking here or contact support.
   - No generic Members/avatar pill is shown.
   - Reading the block message clears Kai's unread and bell.
   - Ava and the Operator remain usable with their existing sessions.

17. [ ] Verify Blocked users layout and persisted chat shortcut

   In Ava, while Reports/History is still open:

   - Select the crossed-person `Blocked users` action.
   - The Blocked users popup opens above Reports/History, never underneath it.
   - Desktop uses the Members reference grid and normal member-card proportions,
     not a custom full-panel giant card.
   - Narrow/mobile layout uses two columns.
   - The date/group header spans the full grid in both layouts and is not part
     of the card content.
   - Kai's image is not stretched.
   - Chat, History, and Unblock actions are available on Kai's card.
   - Chat opens the same persisted `c-support-admin-*` thread; it creates no
     synthetic thread, tab identity, or admin-session replacement.

18. [ ] Send the block-review message

   Keep Ava's chat closed. While blocked, Kai sends exactly:

   `ROLE-TRIAD block review requested.`

   - Ava's App support row unread increases and Ava's bell signals.
   - Ava's Chats main badge remains `1` because the case is still Blocked;
     the unread message does not add another actionable case.
   - Ava's avatar aggregate remains `2`.
   - The message appears in the same persisted support thread.
   - A normal poll cycle neither clears nor duplicates these counters.

19. [ ] Unblock Kai from the Blocked users SmartList

   In Ava:

   - Select Unblock on Kai's card and confirm once.
   - Kai's card disappears immediately without reload.
   - The external Blocked users counter changes `1 → 0` and its badge vanishes.
   - The Blocked users popup remains on the correct upper layer.
   - The support case may remain Blocked until its separate support workflow
     is closed; therefore Chats main badge `1` is still correct at this point.

20. [ ] Observe Kai access restoration

   In Kai, without reload:

   - The side-menu poll applies the unblock.
   - Normal member functionality becomes available again.
   - Profile status returns to `host only` with no previous profile status.
   - Only Kai's access is restored.
   - Ava and Operator roles and sessions do not change.
   - The support thread and its history remain available.

21. [ ] Restore branding exactly

   In the Operator window:

   - Restore every original branding value recorded in step 4.
   - Select `Save branding`, then explicitly reload or reopen the Operator
     surface and verify the persisted original values.
   - After an explicit reload/fresh read, Kai and Ava also show the original
     branding while retaining their sessions and roles.
   - Automatic open-client branding convergence is still not required.

22. [ ] Close the support case and verify the final state

   In Ava's Chats list:

   - Open Kai's case; the final Ava row unread and bell are cleared.
   - Select Reopen on the Blocked case: Blocked `1 → 0`, Pending `0 → 1`;
     Chats main badge remains `1`.
   - Then select Solve: Pending `1 → 0`, Solved `1 → 2`.
   - All remains `2`, but Chats main badge changes `1 → 0` because Solved is
     excluded from the actionable total.
   - Ava's avatar aggregate changes `2 → 1`; the only remaining item is the
     unresolved `Harassment` report.
   - After a normal poll: Reports `1`, Feedback `0`, Chats `0`, avatar `1`.
   - Kai is unblocked and normal member access works.
   - Neither Kai nor Ava has an unjustified support unread or recurring bell
     notification.
   - Exactly one report and one feedback item were resolved; the control report
     is unchanged.
   - Blocked users is empty and its action badge is absent.
   - Operator configuration contains the original branding values.
   - All three sessions retain their original roles.

When all 22 steps are checked, report `ROLE-TRIAD complete`. Codex then runs
only the independent backend/API/persisted oracle for route-denial/no-mutation,
branding revision and restored values, warning/report/feedback audit, support
status buckets, block/unblock audit, notification/read state, and Kai's final
access. The user owns all frontend visual and interaction PASS/FAIL decisions.
Physical Firebase push is outside this local checkpoint.
