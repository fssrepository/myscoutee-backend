# Periodic UI update jank diagnosis

Status: Admin Job manual visual pass; performance trace and Chat retest pending
Defect: `UI-POLL-JANK-001`
Last updated: 2026-09-08

## Scope

This note separates two reported symptoms:

1. pointer and scroll movement stutters while an Admin Job Detail popup is
   open;
2. a similar stutter may occur in an open event chat.

The Admin Job mechanism is corroborated by the current code. The Chat symptom
is retained as a separate trace checkpoint because it does not use the same
five-second process-center poll.

## Admin Job Detail: original corroborated update path

The process-center component creates a `UiTaskScheduler` with a fixed
five-second interval whenever the Admin Jobs popup is active. Its scheduler
state contains the selected rule key while detail is open, but the task ignores
that state and always calls `pollProcessList()`.

Each tick performs all of the following:

1. requests the complete `/admin/notifications` center for the selected list
   filter;
2. normalizes the complete response;
3. maps the current rules and creates new objects for every matching rule;
4. replaces every matching run-history array;
5. commits a new center object and rules array to the shared state signal;
6. re-evaluates both the process list and the nested detail popup.

The component uses default Angular change detection. Template helpers also
filter, copy and sort rule/history arrays during evaluation. The outer process
list remains mounted behind the nested detail popup, so the update is not
limited to the visible detail content.

The frontend already has two narrower runtime mechanisms:

- live rule-runtime WebSocket events;
- `GET /admin/notifications/{ruleKey}/runtime` for one rule.

The five-second detail path currently uses neither as its polling scope. The
backend center response also loads enabled email template options and filter
counts. With filter `all`, it returns all rules before the frontend filters for
scheduled processes.

`UiTaskScheduler` prevents overlapping requests and supports aborting an
in-flight request. It does not run the timer or state update outside Angular,
and it does not suppress a state commit when the response is materially
unchanged.

### Current conclusion

Periodic full-state processing and Angular rendering on the UI thread is a
credible primary cause of the observed five-second Job Detail hitch. This is a
code-path diagnosis, not yet a measured frame-time proof. A browser Performance
and Network trace must correlate the visible hitch with the request completion,
scripting, layout or paint before the defect is closed.

The background job scheduler itself is not directly rendering the popup. A job
runtime change may produce a WebSocket event, but the unconditional frontend
poll and state replacement occur even when no runtime value changed.

## Chat: separate hypothesis

Event Chat uses `ChangeDetectionStrategy.OnPush` and subscribes to chat live
events through a WebSocket. A separate Side Menu scheduler performs the global
user realtime long-poll every 30 seconds, with route-delay configuration able
to shorten it in demo mode. Chat also calls `markForCheck()` for live-message,
typing, media and optimistic-update transitions.

No current code evidence ties the reported Chat hitch to the Admin Jobs
five-second poll. Capture Chat independently and correlate any hitch with:

- chat WebSocket messages or reconnects;
- global user realtime long-poll completion;
- typing-indicator timers;
- message-list reconciliation, scrolling, layout and paint;
- image/media decode or resize work.

Do not close the Chat checkpoint based on an Admin Job fix.

## Implemented Admin Job remediation

The Admin process table now uses the shared SmartList live-surface contract:

1. SmartList owns the five-second polling interval, request cancellation,
   stable row identity, equality checks, visible-item reconciliation and local
   re-sorting.
2. Rows are keyed by `ruleKey`. An unchanged response preserves every row
   reference and causes no list state commit or DOM replacement.
3. A changed response replaces only changed keyed rows. SmartList may reorder
   those rows when their current filter sort key changes.
4. The nested Job Detail is backed by a separate selected-row signal. It is
   updated only when the selected rule changes; changes to another row do not
   notify or re-render Job Detail.
5. WebSocket and local Run/Suspend updates use the same SmartList
   `patchVisibleItem` path instead of maintaining a second list scheduler.
6. The component now uses Angular `OnPush` change detection.

The full-center endpoint remains the table's data source. Opening Job Detail
does not create a second poll and does not send the complete list into the
detail surface. This preserves list freshness and filter ordering while
isolating detail rendering.

Focused component tests cover initial versus background loading, unchanged-row
reference preservation, single-row replacement, selected-row detail delivery,
non-selected-row isolation and local updates through SmartList patching.

### Manual retest evidence

On 2026-08-04, the running frontend hot-deploy completed the SmartList build at
10:28:43 and published it at 10:28:45. With that build open, the previously
visible Job Detail pointer stutter was no longer observed. This is a manual
visual pass. No browser Performance trace was captured, so the long-task and
frame-time acceptance bullets remain unmeasured. Chat remains a separate open
checkpoint.

## Reproduction and evidence script

Use the existing dev stack. Do not start a second frontend, backend, database
or scheduler.

### A. Idle and Admin process-list controls

1. Open browser DevTools Performance and Network.
2. Record 20–30 seconds on an idle ordinary screen while moving the pointer in
   a continuous circle. Save the trace as the control.
3. Open Admin Jobs without opening a detail. Record the same pointer movement
   and scroll the process list slowly.
4. Mark every visible hitch and the timestamp of every
   `/admin/notifications` request.

### B. Admin Job Detail

1. Open one scheduled process detail and leave Parameters/Schedule editors
   closed.
2. Start a 20–30 second Performance and Network recording.
3. Continuously move the pointer over the popup, then scroll the run-history
   area at a steady speed.
4. Do not press Run and do not modify the job schedule during this performance
   checkpoint.
5. Compare the hitch timestamps with five-second center requests, WebSocket
   events, scripting, style recalculation, layout and paint.
6. Record whether the response contained a material runtime/history delta.

Expected after the implemented fix: the SmartList-owned center request may
continue while detail is open, but an unchanged response causes no row or
detail state commit. A changed non-selected row patches only that keyed list
row. A changed selected row also sends that one row to Job Detail.

### C. Chat

1. Close Admin Jobs so its five-second scheduler is not active.
2. Open one populated event chat.
3. Record 30–45 seconds while moving the pointer, scrolling the message list
   and typing without sending.
4. In a second isolated user session, send one message during the recording.
5. Mark the WebSocket event, user realtime long-poll completion and every
   visible hitch separately.

### D. Session retention during the same trace

This is a supplemental block of `UI-POLL-JANK-001`, not a new testcase and not
a reopening of the closed `AUTH-SESSION-001` result. Its purpose is to
attribute the reported unexpected logout while the normal two-session limit is
active.

1. Use one controlled user in exactly two intended isolated Chrome profiles.
   Before attaching DevTools/CDP, record these comparisons without printing
   secret values:

   - server-side active-session count and a hash/set-equality representation of
     its opaque session IDs;
   - immutable login-audit count and outcomes;
   - each managed Chrome PID and user-data directory identity;
   - page-target IDs and browser-context IDs;
   - whether the expected authentication carrier exists in cookie,
     localStorage or sessionStorage, as booleans only;
   - `/auth/me` status and resolved controlled-user identity.

2. Attach the Performance/Network tooling and any read-only CDP observer only
   to the already-open page target. Do not call `Target.createBrowserContext`,
   create another tab/window, reinstall the demo identity, log in again or
   perform a QA click through CDP. Repeat the comparison above. A diagnostic
   attach must create no server session, login audit, warning notification or
   new browser context.
3. Let the user normally close exactly one of the two Chrome windows. Before
   running `prepare-browser`, the versioned launcher, an explicit logout/revoke
   or any session cleanup, record the server active-session set and the tail of
   the already-running request/network evidence. Also record whether the
   closed PID and CDP port ended.
4. Classify the first observed divergence, without guessing:

   - a new server session or login audit at CDP attachment means the diagnostic
     path registered another login;
   - an unchanged server session with a missing browser auth carrier or failed
     `/auth/me` means profile/context storage continuity failed;
   - a server slot removed at window close must be backed by an observed normal
     logout/revoke request or server audit;
   - a slot removed only by later `prepare-browser` or launcher replacement is
     harness cleanup, not evidence that ordinary browser close logged out;
   - `BLOCKED_LIMIT` is attributed to the two-session policy only when the
     server already held exactly two other active session IDs at that login
     decision.

5. Preserve the existing fixture cleanup path after evidence is captured. Do
   not leave an extra profile/session behind and do not put raw cookies,
   bearer tokens, session IDs or full browser fingerprints into the QA pack,
   matrix, trace filename or handoff.

## Acceptance criteria

Admin Job Detail passes only when all of these are true:

- no visible periodic pointer, scroll or input hitch during a 30-second trace;
- no long main-thread task of 50 ms or more aligned with the refresh path;
- an unchanged table response causes no row state commit or DOM mutation;
- changed table responses patch only affected keyed rows and preserve valid
  sort order;
- the open detail receives only its selected changed rule, never the complete
  process list;
- real WebSocket runtime progress and terminal history still appear within the
  documented freshness window;
- list filters, Parameters, Schedule, Suspend and manual Run remain correct.

Chat passes only when its independent trace shows smooth pointer, scroll and
typing behavior during idle, one live message and one user realtime completion.
The session supplement passes only when CDP attachment is proven not to create
another session/context and the ordinary-close boundary is attributed from the
immediate server/browser evidence before launcher cleanup. The defect remains
open until both performance surfaces and this attribution block pass.
