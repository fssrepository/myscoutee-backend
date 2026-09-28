# GROUP-ISOLATION-001 — Workspace isolation samples

Domain: Group. Independent fixture, checkpoints, execution and cleanup.

## Baseline

Prepare one account with Base, Group A and Group B profiles, an A-only peer,
a B-only peer and an outsider. Use distinct account/profile IDs, private A/B
groups and distinctly identified Event/member/chat, home-rating and Feed
controls. Include A and B notification targets with the same display name.
Capture records and counters before each block; restore its own checkpoint
before a repeat. Use the versioned checkpoint harness and managed-browser
launcher. Record HTTP and frontend-local execution independently.

## 1. Event lifecycle across workspaces

Create an A Event through the ordinary UI, invite the A peer and accept as
that peer. Check list, detail, members and context chat. Compare Base/B owned,
participation and invitation lists and counters: A's Event/member/chat must
not be projected into those profiles. Reopen A and verify persisted results.

## 2. Private Event and chat requests

With B selected, and separately as the outsider, read and mutate the recorded
private A Event/member/chat IDs through real HTTP routes. Existing authority
must reject unauthorized operations (403/404 as applicable), with no persisted
change or counter delta. Include a forged group header/parameter on these
requests: it cannot replace the saved account selection. A permitted public
projection is not authority for private reads or writes.

## 3. Home ratings, filters, Feed and Following

- Rate the A control through home cards. Compare persisted ratings, exclusions,
  impressions and counters in A, Base and B; no cross-profile relationship.
- Save distinct filters in Base/A/B, explicitly clearing gender in one. Switch,
  reload and edit the profile: each filter remains scoped, including the clear.
- Open the Rates filter menu on desktop and narrow mobile. Before the close X,
  show exactly one icon + Social + switch control, applying to both Preferences
  and Suggestions. Neither section has its former Social on/off mini-button.
  The red badge is the sum of both sections' Social-on filter counts, even
  while Social is off. Toggle both ways: both sections switch together, while
  that badge keeps the same Social-on total. Reopen/select the other section
  and verify the shared state. Switch Base/A/B: the total comes from the
  selected profile, with no stale previous-profile count.
- Inspect the Feed controls and perform one Following action in A. Compare
  content, relationships and counters with Base/B and reopen A.

## 4. Late Event replies and notification targets

- Hold a real A detail or poll response, select B through the UI, then release
  it unchanged. It cannot overwrite B's active profile, cards or badges.
  Reopen A and verify its saved result.
- With the A/B same-name targets staged, open the A notification while B is
  selected. It must select A and resolve the exact A target ID, not B's target.

## 5. Moderation replies during a group change

Prepare distinct A/B moderation queues/settings and snapshot their counts.
Hold an actual A queue/preview response, select B through the UI, and release
it. The old response must not replace B's popup, settings or badges. Reopen A
and compare both queues and stored counts with the snapshot.

## 6. Revoked access while another actor is active

Remove the active actor's A membership as A's other administrator. Ordinary
refresh must remove A from available workspaces, and old A private links and
request IDs must no longer grant access. Base and B remain usable and their
records/counters unchanged. Restore this block's membership snapshot.

## 7. Support history and pending participants

Prepare eventless App support and A Group support controls with their real
participant lists, including enough A history to put an old message beyond
the first page. Use normal chat/header-member entry points.

- As a non-participant, and from B/Base, attempt private A support chat,
  message and member requests, including that old message. Reject unauthorized
  reads/writes without an owner copy or unread change. Keep App support and
  Group support authority distinct from contact-chat consent.
- Hold A support-chat/member-popup loading, select B, then release the actual
  response. A's conversation/participants/badges must not replace B's surface.
  Reopen A and verify its history is intact.

## 8. Contact invitation authority and pending replies

Prepare an approved account contact chat, a saved approved invitee, a
saved contact without MyScoutee chat approval, a non-contact and a foreign
conversation. Snapshot chats, members and counters.

- In the UI picker, show only eligible saved, approved contacts who are not
  already participants. A non-contact or an unrelated workspace profile must
  not appear at all: there must be no row the user can click to invite them.
- Saved contacts without MyScoutee chat approval remain absent from the
  invitation picker, including while a request is pending. Send the access
  request first using the MyScoutee action on their contact card. Only after
  approval may they appear as invite candidates; requesting access alone must
  not add them to the conversation or create their chat owner copy.
- Java tests cover add-member attempts for a non-contact, an outsider's chat,
  App support or Group support: reject before creating an owner copy. An
  unrelated profile ID cannot impersonate an account contact. These are backend
  authority checks; the unavailable person is absent from the UI picker.
- Hold the real invite-picker response; change workspace within the same
  account, then repeat with an account change. Stale replies must not replace
  the other account's popup or participants.
- Hold an invitation mutation response. The confirmation stays busy and the
  picker cannot close until persistence succeeds. Release the response and
  verify the account conversation's returned members. Workspace/account
  switching through controls behind this modal is not a user-accessible step;
  the Java authority checks above cover direct foreign-account write attempts.

## 9. Contact reads versus group Event unread

Prepare an approved account contact chat plus unread A/B Event chat controls.
Read the account contact chat from Base and A. It remains the same channel
with the same account sender/member/read identity, while A/B Event unread
counts remain unchanged. Compare Event-share candidate lists in A and B:
those retain their active-profile scope.

## Cleanup and evidence

Restore the testcase's own snapshots and verify exact records/counts; close
only its managed sessions. Record actor/account/profile/target IDs, actual
requests and statuses, persisted before/after data, UI/reload observations
and any failed or unexecuted branch. Redact credentials. An automated unit
check or fixture verification alone is not a completed browser journey.
