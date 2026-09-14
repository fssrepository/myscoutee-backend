# UI-POLL-JANK-001 user test guide

This is one Notifications performance testcase. It checks the reported periodic
UI hitch in Admin Jobs and Chat, then uses the same prepared browsers to
identify why a user may appear logged out around DevTools/CDP use or browser
close. The session block is diagnostic coverage inside this testcase; it is not
a new Identity testcase.

This file is the tester's stable, repeatable guide. Do not add current status,
dates, screenshots or machine evidence here.

## Actors and startup

Codex prepares one controlled populated Group chat and opens three isolated
managed Chrome windows, matching the three available Google-account slots:

- **Ava → Nova** — Admin Jobs observer first; after the Admin recordings,
  the tester signs Ava out and signs Nova in within this same window;
- **Casey A** — first session of the controlled user and Chat reader;
- **Casey B** — second session of the same controlled user;
Nova sends the one live Chat message from the former Ava window. This is a
desktop test; a phone is not required.

Casey A and Casey B must be the same account in two different managed Chrome
profiles. They are the only two active server sessions for Casey at the
starting boundary. Ava and Nova use their own accounts and do not count toward
Casey's limit.

To prepare this test, tell Codex:

`Prepare UI-POLL-JANK-001 without starting the user steps.`

Start step 1 only after Codex confirms all of the following:

- the fixture and exact two-session Casey boundary are verified;
- every window shows the configured identity;
- Casey can read the controlled Group chat, and Nova has its verified fixture membership;
- no replacement launcher or session cleanup will run during the test;
  the one explicit Ava → Nova account switch is performed by the tester.

After the windows are handed over, the tester owns every navigation, click,
keystroke, DevTools action and browser close. Stop at the first visible
mismatch and report the step number.

## Recording rules

- Create exactly four Performance recordings: `idle`, `admin-list`,
  `admin-detail` and `chat`.
- Record the first three for **30 seconds** and Chat for **45 seconds**.
- Do not export a Network HAR or copy cookies, authorization headers, tokens or
  session IDs. The Performance recording and a note of the visible hitch time
  are sufficient user evidence.
- While recording, move the pointer continuously and scroll only where the
  step says so. Do not reload a page, press a job's `Run` action or edit a job.

## 1. Idle control

1. In **Ava**, remain on the ordinary Admin landing screen with no popup open.
   Open Chrome DevTools, select **Performance**, and start recording.
2. Move the pointer in a continuous circle for 30 seconds without clicking.
   Stop and save the recording as `UI-POLL-JANK-001-idle`.
3. Record whether a visible pointer hitch occurred. This is only the control;
   it does not pass or fail Admin Jobs by itself.

## 2. Admin Jobs list and detail

4. In Ava, open `Configuration -> Jobs`. Keep the `All` filter selected and do
   not open a process yet.
5. Record for 30 seconds. Continuously move the pointer and slowly scroll the
   process list down and back up. Save the recording as
   `UI-POLL-JANK-001-admin-list`.
6. During the same observation, confirm that a background refresh does not
   reset the scroll position, flash a full-screen loader, duplicate a row or
   make unchanged rows visibly jump.
7. Find **Send notifications** (`notification-outbox`) and open its
   `View process`/settings action. Leave Parameters and Schedule closed.
8. Record for 30 seconds. Move the pointer over Job Detail for the first half,
   then slowly scroll Runner history for the second half. Save the recording
   as `UI-POLL-JANK-001-admin-detail`.
9. Confirm all of the following:

   - pointer and scrolling remain smooth through every five-second refresh;
   - Job Detail does not close, flash, reset its scroll or replace its content
     with another job;
   - live status/history may update, but no manual run or configuration change
     occurs.

10. Close Admin Jobs completely so its five-second list refresh is not active
    during the Chat recording. In this same window, sign Ava out using the
    account menu. On Entry, select Member and sign in as **Nova Social**.
    Confirm Nova's name, then open `Chats -> Group` and the
    **QA UI-POLL-JANK-001 Group** thread. Leave both Casey windows signed in
    throughout; do not open a fourth window.

## 3. Chat trace with one live notification event

11. In **Casey A**, open `Chats -> Group` and open the controlled populated
    Group thread prepared for this checkpoint.
12. Start a 45-second Performance recording. Move the pointer continuously,
    slowly scroll through the visible messages, then type
    `UI-POLL-JANK-001 typing probe` without sending it.
13. At roughly the middle of that recording, use **Nova** to send exactly one
    message in the same thread:

    `UI-POLL-JANK-001 live message`

14. In Casey A, confirm the message appears live exactly once. Continue until
    the full 45 seconds have elapsed, then clear Casey's unsent typing probe
    and save the recording as `UI-POLL-JANK-001-chat`. Codex identifies the
    user-realtime completions in the saved trace; the tester does not have to
    locate them while recording.
15. Confirm pointer movement, scrolling and typing remained smooth before,
    during and after the live message. The thread must not jump to another
    position, duplicate the message, reopen, or log Casey out.

Report:

`UI-POLL-JANK-001 traces complete`

Codex correlates only the reported hitch times with the Admin Jobs refresh,
Chat WebSocket event, user-realtime completion, scripting, layout and paint.

## 4. Two-session and browser-close attribution

16. Without reloading, confirm **Casey A** and **Casey B** both still show
    Casey's identity and neither shows a session-limit warning. Do not open a
    third Casey login. Report:

    `UI-POLL-JANK-001 session baseline ready`

17. Wait while Codex records the read-only baseline: exactly two Casey server
    sessions, login-audit count, the two managed profile/process identities,
    existing page target/browser context identities, authentication-carrier
    presence as booleans, and `/auth/me` identity. Secret values are never
    printed or saved.
18. When Codex says the baseline is captured, leave both Casey windows on their
    current pages. Codex attaches one read-only observer to Casey B's already
    open page target. It must not create a tab, window, browser context, login,
    server session, audit row or warning notification.
19. After Codex confirms the comparison is captured, check that both Casey
    windows are still logged in and that no new tab/window or session warning
    appeared. Report:

    `UI-POLL-JANK-001 observer attach visible state unchanged`

20. Normally close the entire **Casey B** Chrome window using its window close
    button. Do not sign out first. Leave Casey A open and immediately report:

    `UI-POLL-JANK-001 Casey B closed; capture before cleanup`

21. Do not launch or reopen a browser until Codex captures the immediate close
    boundary. In Casey A, confirm Casey remains logged in and the application
    remains usable without a session warning.

Codex now classifies the first measured divergence rather than guessing:

- a session/audit created at observer attachment is a diagnostic-path defect;
- unchanged server state with a lost authentication carrier or failed
  `/auth/me` is a profile/context continuity defect;
- a session removed at normal close requires matching logout/revoke network or
  server evidence;
- a session removed only by later launcher preparation is harness cleanup;
- a `BLOCKED_LIMIT` result belongs to the two-session policy only if two other
  server sessions already existed at that exact login decision.

## Completion

22. Report any visible hitch with the recording name and approximate second,
    or report `none` for that recording. Then report:

    `UI-POLL-JANK-001 user steps complete`

After Codex confirms the final snapshots are captured, sign Nova out in the
former Ava window. Codex checks the traces and machine snapshots, removes the
one controlled Chat message, closes the remaining managed sessions through the versioned cleanup,
and restores the fixture. The testcase passes only when:

- Admin Job Detail has no visible periodic hitch and no refresh-aligned main
  thread task of 50 ms or more;
- unchanged Admin rows cause no row/DOM mutation, while a real change patches
  only its keyed row and only a selected-row change reaches open Job Detail;
- Chat stays smooth across idle typing, one WebSocket message and one
  user-realtime completion;
- observer attachment creates no session or browser context, and normal close
  is attributed from evidence captured before intentional cleanup.

## Expected effort

| Work | Clean run | With one diagnostic replay |
| --- | ---: | ---: |
| Fixture, three windows and identity/session baseline | 10 min | 20 min |
| Idle, Admin list and Admin detail recordings | 20 min | 40 min |
| Chat recording and one live message | 8 min | 15 min |
| Observer/session/normal-close comparison | 10 min | 25 min |
| Trace review, evidence entry and fixture cleanup | 12 min | 45 min |
| **Total** | **60 min** | **145 min** |

The upper estimate includes one controlled replay and trace correlation. It
does not include implementing a product fix found by the test.
