# GROUP-ISOLATION-001 — Workspace isolation samples

Domain: Group. Prerequisite: GROUP-LIFECYCLE-001's accepted-membership and
workspace-selection baseline. This is a focused cross-domain sample, not a
replay of the already closed Asset/Event campaigns.

## Baseline

One account has Base, Group A and Group B profiles; a second account belongs
only to A, and a third belongs to neither. Prepare distinctly named controls
in all three workspaces: one Event with member/chat activity, one Asset, one
home-rating pair and one Feed item. Store expected IDs and initial counters in
the versioned fixture snapshot. Include one pending-only group membership.
Use the existing checkpoint harness and managed-browser launcher; retain
separate local and dev HTTP evidence. No live fixture is implied by this guide.

## Numbered checks

1. In Base, A and B, compare the profile ID and selected workspace with the
   corresponding stored profile. Switching must preserve each workspace's
   independent edits and must not merge its activity with the base profile.
2. For the Asset sample, create/edit one asset in A through the ordinary UI.
   Check its owned list, detail, image and one normal member/request action.
   Switch to Base and B: the A-owned item and its request/badge must not appear
   as owned workspace data. Reopen A and verify persistence.
3. For the Event sample, create one A event and perform an ordinary invitation
   and acceptance within A. Check list, detail, members and context chat.
   Compare Base/B owned, participation and invitation lists and counters: no
   A event/member/chat entry may be projected into those workspaces.
4. Read and mutate the recorded A asset/event/member/chat IDs through the real
   HTTP routes while selecting B or using the non-member account. Existing
   authority rules must reject cross-workspace private access (403/404 as
   applicable), with no state change. Normal requests use the saved account
   selection; a forged `X-MyScoutee-Group-Id` header or a `groupId` parameter on
   other routes cannot override it. On the profile-load route, attempt selecting
   a pending-only or unrelated group: reject it without changing the saved
   selection. Pending membership alone grants no workspace access. A permitted public
   projection is not permission to read private data or mutate the owner.
5. Rate the A control using the home cards, then inspect the stored rating and
   A card stack/counter. Base and B retain their own ratings, exclusions,
   impressions and counters; the rating must not join profiles across groups.
6. Save different rating filters in Base, A and B, including explicitly clearing
   the gender filter in one. Switch and reload: settings remain scoped and a
   cleared filter is not silently re-enabled by profile editing.
7. Check the Feed control and one Following action in A, then Base and B. The
   corresponding content, relationships and counters stay in their workspace.
8. While an A detail request or normal poll is pending, switch to B. A late
   response cannot replace B's active profile, cards or badges. Reopen A and
   verify its last saved result; use real transport timing, not substituted
   application methods.
9. Produce one notification in Base, A and B. The account bell is intentionally
   aggregated. All shows all three; Base/A/B filters show their own messages
   with the same selector colors. Opening an A notification selects A before
   resolving its target; it must not open an identically named B target.
10. Change a guide/device header setting and switch workspaces: guide, share
    and account/device menu behavior remains at its defined global scope.
    Body activity and asset menus follow the active profile. Do not treat the
    deliberately aggregated bell or device setting as a data leak.
11. Enable moderation in A and use different settings in B and app-admin.
    As A's admin, inspect A's queue/settings/counts, then attempt B/global
    state, list, settings, decision and preview routes with the same identity.
    Foreign private IDs and missing admin roles are rejected without writes.
    App-admin's Group category controls the group itself; group admins cannot
    use it to moderate group creation. Exercise one A decision and configured
    worker approval: A's stored red badges change, B/global counts do not.
    Switch groups while a queue/preview request is pending: the old response
    must not overwrite the new popup or badges. A warning appears only under
    A's **Group support** channel; Base/B and app-admin support queues cannot
    read its chat or receive its unread counter.
12. Remove the actor's A membership as its administrator. Ordinary refresh
    removes A from available workspaces; old A links and saved request IDs no
    longer grant member/private access. Base and B remain usable and unchanged.
13. Restore the checkpoint snapshots, then compare counts and records with
    the initial state. Record exact successful and rejected requests, and close
    only this checkpoint's managed sessions.

## Evidence

Use UI observation plus persisted/read-only API oracles for each sample.
Record workspace/account/profile IDs, request outcomes, before/after counters
and replay/reload results. Redact session and integration tokens. The explicit
account-level exceptions above are part of the expected result; do not invent
additional visibility exceptions to make a failing sample pass.

## NOT RUN — Eventless chat regression discovered during the sharing batch

These checks also cover the existing support implementation, beyond the new
contact/chat-sharing features. They are prepared checks, not execution evidence.

- Open an existing **App support** conversation and an A **Group support**
  conversation through their normal entry points. Confirm that each uses its
  own chat ID and participant list without a backing event. Check the header
  avatar pill/member popup against the persisted `memberIds`; do not invent an
  event membership or an invitation permission for support participants.
- Exchange one message in each direction with the configured support actors;
  verify delivery, unread/read state, and the appropriate channel filter. Reopen
  the chat and compare with persisted history. The app-admin and group-admin
  workflows keep their existing, distinct authority.
- As a non-participant, and again from B/the base profile, attempt the private A
  support chat/message/member IDs. Reject unauthorized reads and writes without
  creating an owner copy or changing unread counters. Include an old message,
  outside the first loaded page, in this check.
- Switch A to B while the support chat or member popup is loading. A late reply
  cannot replace B's active chat, participants, or badges. Reopen A to verify
  that its conversation remains intact.
- Compare the new contact chat separately: it also has no event, but its
  contact filter and permitted member-picker actions must not turn App support
  or Group support into contact chats or broaden their access.

Record dev HTTP and frontend-local outcomes independently; keep this subsection
NOT RUN until the user executes the corresponding checklist steps.

### Contact-only chat invitations — NOT RUN refinement

In each workspace, the contact-chat invite picker shows only that actor's saved
contacts who are not already members. Empty contacts must produce an empty
picker, never the generic Event candidate list. A raw add-members command for a
non-contact, an outsider's chat, an App support / Group support chat or a contact
profile belonging to another workspace must fail before any owner copy is made.
Verify that the invited contacts receive the same conversation and that
contact-channel unread deltas stay in the contacts filter. Repeat after switching
account/workspace while the picker or mutation is pending; no stale result may
update the replacement user's popup. This extends this existing NOT RUN case.

### Separate direct-chat permission — NOT RUN refinement (2026-09-26)

Run with two actors in the same workspace, then repeat in frontend-local mode.

1. Save B in A's Contacts and add a phone or Facebook method. This alone must
   not grant MyScoutee direct-chat access. Contact rows are orange; ordinary
   methods remain independently editable. The MyScoutee method asks through
   the existing confirmation dialog. Cancel writes nothing; the Contacts popup
   stays visible beneath the blurred backdrop.
2. Request chat access once. Only B receives the request notification and a
   pending-count increment. A sees Pending; another click explains that state
   without sending another request. Neither side receives the other's private
   contact methods.
3. At desktop and narrow mobile width, the search shares one row with a normal
   icon + short-label menu on its right: Contacts / Requests. Both menu buckets
   display their corresponding counts; the Contacts side-menu red badge shows
   only incoming pending requests, never the saved-contact total. Requests use
   the same SmartList, incoming pending only, newest request first; text search
   still works. Check multiple requests and a later loaded page.
4. Approve as B. The pending row disappears and its badge decreases without
   reloading the SmartList. A is saved in B's Contacts, its count updates, and
   the approved chat chip is green. Only A receives the decision notification.
   Both users open the same existing eventless chat popup/conversation. Reopen
   and reload to prove the stored consent and saved contact survive.
5. On another request, Reject is a separate action with confirmation; Cancel
   never rejects. The request leaves the pending list and the count decreases;
   A receives the rejection, sees the red chat method and cannot open direct
   chat. A fresh request can be sent; repeated commands must not duplicate
   pending counts, contacts or notifications. Approved/rejected decisions must
   be restricted to the recipient and reject stale pending versions.
6. Keep both Contacts popups open while the other actor requests or decides.
   The existing realtime counter signal refreshes the row/status and counts
   in place; no whole-list reload, lost search or custom polling loop. A failed
   mutation keeps the prior row/count and permits retry. Switch workspace or
   account during a delayed response: it cannot update the new actor's list.
7. Attempt the direct-chat API without approval, and use request/decision IDs
   from another workspace. Reject access before creating a chat or sending a
   notification. Existing App support, Group support and event chat authority
   remain separate. The prior contact-only member-invite checks above still
   apply; this consent does not invent event membership or friendship facts.

These are unexecuted manual micros within GROUP-ISOLATION-001, not new PASS
rows. Record HTTP and local outcomes independently, including notification
recipient, persisted permission pair, contact list and write-side counter.
