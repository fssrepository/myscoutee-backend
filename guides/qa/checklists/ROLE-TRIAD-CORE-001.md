# ROLE-TRIAD-CORE-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add the current status, dates, or
machine-oracle evidence to it.

## Actors and startup

- **Kai** is the controlled member and moderation target.
- **Ava** is the moderation admin.
- **Deployment Operator** is the operator-only branding actor.
- Use only the three isolated windows opened by Codex. Do not introduce a
  fourth identity or replace one of these sessions.

To start a replay, tell Codex:

`Prepare the ROLE-TRIAD-CORE-001 user test.`

Start step 1 only after Codex confirms this baseline:

- Kai is `host only`, is not blocked, and has no previous profile status;
- both controlled reports are unresolved and unwarned;
- the controlled feedback item is unresolved;
- no controlled support chat or support message exists;
- Ava shows Reports `2`, Feedback `1`, Chats `0`, and avatar aggregate `3`;
- a normal poll does not change those four values;
- Blocked users has no badge and its list is empty;
- Ava's support-case status buckets are all `0`.

Stop at the first mismatch. Do not compensate with a reload, repeated action,
or opposite mutation. Report the step number and what is actually visible.

## Complete 22-step journey

### 1. Kai authorization boundaries

1. In Kai, confirm that `/game` works and that no Admin or Operator entry is
   visible.
2. Navigate directly to `/admin`. Protected admin content must not flash; Kai
   is denied or redirected without gaining access.
3. Navigate directly to `/operator`. Operator content must not flash; Kai is
   denied or redirected without gaining access.
4. Return Kai to the normal member surface.

### 2. Ava authorization boundaries

5. In Ava, confirm that `/admin` opens the admin workspace and that Reports,
   Feedback, and Chats are available.
6. Navigate directly to `/operator`. Ava cannot open it and returns to the
   admin surface.
7. Confirm that Ava's admin identity and session did not change.

### 3. Operator authorization boundaries

8. In the Deployment Operator window, confirm that `/operator` works.
9. Confirm that admin moderation data is not visible.
10. Navigate directly to `/admin`. The Operator does not gain admin access.
11. Confirm that the operator identity and authority remain intact.

### 4. Branding mutation and persistence

12. In the Operator window, record the original product name, logo, home
    label, and theme values.
13. Change exactly one branding value and select `Save branding` once.
14. Reopen or reload the branding surface and confirm that the changed value
    is reconstructed.
15. Explicitly reload Kai and Ava. Both show the new branding while retaining
    their original sessions and roles.
16. Kai and Ava still cannot edit operator configuration. Automatic branding
    refresh in an already-open client is not required.

### 5. Reports baseline and report details

17. In Ava, open `Moderation & support → Reports`.
18. Confirm Reports `2`, external red Unresolved `2`, and no positive Resolved
    count.
19. Open `No-show / unsafe event behavior`.
20. Confirm the reporter, Kai target, reason, and source details. The
    `Harassment` report remains the unchanged control.
21. If `View user` opens a new tab, verify the profile there, close the tab,
    and confirm that Ava's original admin session was not replaced.

### 6. Warn Kai and verify admin status counters

22. On `No-show / unsafe event behavior`, select `Warn user` exactly once.
23. Confirm that no permission error appears and the report remains unresolved:
    Reports `2`, Unresolved `2`.
24. Confirm that Ava's Chats main badge becomes `1`, the Warned support bucket
    becomes `1`, and the avatar aggregate becomes `4` = Reports `2` + Feedback
    `1` + actionable Chats `1`.
25. Wait for one normal poll. These values do not clear or revert.

### 7. Receive the warning in Kai's closed-chat state

26. Keep Kai's support chat closed.
27. Confirm that Kai receives one unread bell notification, the member-side
    Chats unread counter rises, and the App support row has an unread badge.
28. The notification and chat refer to the same warning. Ava's Chats `1`
    remains a case-status counter, not a copy of Kai's unread.

### 8. Open Kai's persisted App support chat

29. Open the App support row in Kai.
30. Confirm that the existing support thread opens and the warning is visible;
    no synthetic View chat or replacement session is created.
31. Confirm real Kai and Ava avatars and no generic or stretched
    `2 members` avatar pill.
32. Opening clears Kai's chat unread and member Chats unread immediately.
33. Wait for the normal notification poll. The related bell notification
    leaves New and its counter matches the persisted read state.
34. Ava remains Warned with Chats `1`. Closing the chat does not recreate the
    read notification.

### 9. Send Kai's support reply

35. Keep Ava's support chat closed.
36. In Kai's existing support thread, send exactly:

    `ROLE-TRIAD support reply: understood.`

37. Confirm that the message remains in the same thread and Kai's session does
    not change.

### 10. Verify Ava unread separately from the Chats main badge

38. In Ava, open `Activities → Chats`.
39. Confirm that the App support row gains an unread badge and Ava's bell
    signals.
40. Confirm that the Chats main badge remains `1`; the dropdown shows All `1`,
    Warned `1`, and every other bucket `0`.
41. Ava's avatar aggregate remains `4`. One normal poll does not clear or
    duplicate either the unread or status values.

### 11. Open Ava's support chat and exercise live status buckets

42. Open Kai's support chat in Ava. Kai's reply and the earlier messages are
    visible, with real avatars and History directly before Close.
43. Opening clears Ava's row unread and bell while the Chats main badge remains
    `1`.
44. From Kai's support row, select `Pick`. Warned changes `1 → 0` and Picked
    changes `0 → 1` immediately, without reload. In the All filter, the same
    row remains visible.
45. Select `Unpick`. Picked changes `1 → 0` and Pending changes `0 → 1`.
46. Select the Pending bucket, then select `Pick` once. Kai's row disappears
    immediately from Pending, Pending changes `1 → 0`, and Picked changes
    `0 → 1`.
47. Switch to Picked and confirm the same row there. The main badge remains
    `1`, avatar aggregate remains `4`, and a normal poll does not overwrite
    the transitions.

### 12. Verify History, View chat, and popup stacking

48. Select `History` in Ava's chat header.
49. A user without moderation history has a disabled History action that does
    not open an empty or error dialog.
50. Kai's History action has an external red badge with the total stored report
    count and opens above the still-mounted chat.
51. Confirm that only Kai's relevant reports and moderation history appear.
    Date/group rows span the full list width.
52. Select `View chat`. It opens the same persisted support thread inside the
    admin app and does not replace Ava's identity or session.

### 13. Resolve exactly one controlled report

53. Resolve only `No-show / unsafe event behavior`.
54. Confirm Reports `2 → 1`, red Unresolved `2 → 1`, and green Resolved
    `0 → 1`.
55. `Harassment` remains unresolved and unchanged.
56. The reporter's support case becomes Solved. Chats buckets show All `2`,
    Picked `1`, Solved `1`; the Chats main badge remains `1`.
57. Ava's avatar aggregate becomes `3` = Reports `1` + Feedback `1` +
    actionable Chats `1`.

### 14. Resolve exactly one controlled feedback item

58. In Ava, open `Moderation & support → Feedback`.
59. Confirm Feedback `1` and red Unresolved `1`.
60. Open Kai's controlled feedback and select `Mark resolved` exactly once.
61. Confirm Feedback `1 → 0`, Unresolved `1 → 0`, and green Resolved
    `0 → 1`.
62. In Kai, confirm exactly one `feedback-resolved` bell notification and read
    it once through the normal notification surface.
63. Feedback resolution creates no chat or message and changes no support
    bucket. Ava remains All `2`, Picked `1`, Solved `1`, Chats `1`.
64. Ava's avatar aggregate changes `3 → 2`. A normal poll preserves all these
    values.

### 15. Block Kai

65. From Ava's Reports/History surface, select `Block user` and confirm once.
66. Confirm that the crossed-person Blocked users action gains an external red
    `1` badge.
67. Kai's case becomes Blocked: All `2`, Blocked `1`, Solved `1`; Chats remains
    `1` and avatar aggregate remains `2`.
68. Reports remains `1`; blocking does not resolve `Harassment`.

### 16. Observe the live block and blocked-user support chat

69. In Kai, do not reload. Wait for the side-menu poll.
70. Confirm that protected member functionality becomes unavailable while App
    support remains available as a normal chat.
71. The moderation information message states that Kai is blocked and may
    request review or contact support. No generic Members/avatar pill appears.
72. Reading the block message clears Kai's unread and bell. Ava and the
    Operator remain usable in their original sessions.

### 17. Verify Blocked users layout and persisted chat shortcut

73. In Ava, while Reports/History remains open, select the crossed-person
    `Blocked users` action.
74. Confirm that the popup opens above Reports/History, never underneath it.
75. Desktop uses normal member-card proportions; narrow/mobile layout uses two
    columns. The date/group header spans the full grid and Kai's image is not
    stretched.
76. Kai's card exposes Chat, History, and Unblock.
77. Select Chat and confirm that the same persisted support thread opens, with
    no synthetic thread, new identity, or admin-session replacement.

### 18. Send the block-review message

78. Keep Ava's support chat closed.
79. While blocked, send exactly this from Kai's existing support thread:

    `ROLE-TRIAD block review requested.`

80. Confirm that Ava's App support row unread rises and Ava's bell signals,
    while Chats remains `1` and avatar aggregate remains `2`.
81. The message is in the same thread. One normal poll neither clears nor
    duplicates these values.

### 19. Unblock Kai from the Blocked users SmartList

82. In Ava, select `Unblock` on Kai's card and confirm once.
83. Kai's card disappears immediately without reload. The Blocked users
    counter changes `1 → 0` and its badge disappears.
84. The popup remains on the correct upper layer. The support case may remain
    Blocked, so Chats `1` is still correct here.

### 20. Observe Kai access restoration

85. In Kai, do not reload. Wait for the side-menu poll.
86. Confirm that normal member functionality returns and profile status is
    again `host only`, with no previous profile status.
87. Only Kai's access changes. Ava and Operator sessions and roles remain
    intact, and the support thread history remains available.

### 21. Restore branding exactly

88. In the Operator window, restore every original value recorded in step 12.
89. Select `Save branding` once, then reopen or reload the Operator branding
    surface and confirm the persisted original values.
90. Explicitly reload Kai and Ava. Both show the original branding while
    retaining their sessions and roles.

### 22. Close the support case and verify the final visible state

91. In Ava's Chats list, open Kai's case. Confirm that Ava's final row unread
    and bell clear.
92. Select `Reopen` on the Blocked case. Blocked changes `1 → 0`, Pending
    changes `0 → 1`, and Chats remains `1`.
93. Select `Solve`. Pending changes `1 → 0`, Solved changes `1 → 2`, All
    remains `2`, and the Chats main badge changes `1 → 0`.
94. Ava's avatar aggregate changes `2 → 1`.
95. After a normal poll, confirm Reports `1`, Feedback `0`, Chats `0`, avatar
    aggregate `1`, and no unjustified recurring bell or support unread.
96. Confirm Kai is unblocked and normal member access works.
97. Confirm Blocked users is empty with no badge and the Operator contains the
    original branding values.
98. All three sessions retain their original roles.
99. Report:

    `ROLE-TRIAD complete`

The user portion ends here. Codex records PASS/FAIL only after its independent
machine-side oracle. The execution result never gets written into this file.
