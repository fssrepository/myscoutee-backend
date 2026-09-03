# ASSET-MEMBER-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current dates, status, IDs or
machine-oracle evidence to it.

The pending `ASSET-MEMBER-001` and terminal `ASSET-MEMBER-002` definitions are
one consolidated testcase transaction. The pending phrase is only a replay
savepoint inside that testcase, not a separate matrix row.

## Actors and startup

- **Casey** owns the controlled Transport, is the Event Admin and belongs to
  generated Group A.
- **Nova** and **Riley** are Event Members in the same generated Group A. Nova
  receives Casey's Invite; Riley submits the independent Join request.
- **Lina** is the sole Group B negative control. Her state is verified by
  Casey's UI and the persisted oracle; no fourth browser is required.
- Every Asset action must originate from
  `QA ASSET-MEMBER-001 Tournament → QA Membership Stage → Group A → Transport`
  and target `QA ASSET-MEMBER-001 Group Transport`.
- Use only the three isolated Casey/Nova/Riley windows opened by Codex. Do not
  create another profile or use an API, MongoDB or fixture command to perform
  an Invite, Join, response, removal or promotion.
- This owned-Asset journey does not use polling. Reload only at the two steps
  that explicitly require it, and select each Invite, Join, Accept, Remove or
  manager-promotion or manager-revocation confirmation exactly once.
- The red `+N` chain and the Asset card's `N pending` badge both represent the
  unresolved request total. Opening or closing Event, stage, Group, Transport
  or Asset Members must not clear it. It decreases only when a pending request
  is accepted, rejected or cancelled. Resolved membership changes use the
  recipient's Notifications unread counter instead of retaining or creating a
  pending red counter on the Event/stage/Group/Asset chain.
- `Participation` is a read-only involvement list, not a management right. Any
  viewer may open it on a member card when that member has at least one
  involvement row. An empty involvement list renders no `Participation` item;
  the member's `Member`/`Manager` role must not change that rule.
- Stop at the first mismatch. Do not compensate with a second click, another
  actor, a different group, an unrelated Asset or an ad-hoc fixture change.

To start a complete replay, tell Codex:

`Prepare the ASSET-MEMBER-001 user test.`

Begin only after Codex confirms all of the following:

- the checkpoint is `baseline-ready` with exactly one Casey-owned Public
  Transport already assigned to generated Group A;
- Group A contains Casey, Nova and Riley as accepted Event Members, while
  Group B contains only Lina;
- the target Transport starts at `1 / 4`, zero pending, with only Casey's
  accepted manual assignment and no Asset Manager membership;
- parent Event and both generated-group memberships have been snapshotted for
  exact unchanged-state comparison;
- no controlled Asset notification, outbox item or affinity task exists;
- three isolated, identity-verified Casey/Nova/Riley windows are open.

## Compact retained-run verification

Use this shorter route when the already-retained exploratory state has Casey,
Nova and Riley accepted on the target Asset and Nova is already an Asset
Manager. Its assertions may be visited in a convenient order, except that
owner leave must precede takeover and takeover must precede Casey's fresh
return. The long replay below remains the deterministic clean-fixture route;
it is not required in addition to this compact route.

1. Open Asset Members from any actor. On a member with a non-empty involvement
   list, confirm `Participation` opens the same read-only list for an ordinary
   Member and for a Manager viewer. On a member with no involvement rows,
   confirm the item is absent rather than replaced by a role-specific action.
2. In Casey, confirm Casey's own Asset-owner card offers `Leave asset` plus
   `Participation` only when its list is non-empty. It must not offer a
   self-promotion or self-revocation action. An accepted ordinary Member still
   has no direct self-leave or management action.

### Owner handover, Take Over and fresh return

3. Record Nova's and Riley's Notifications unread counters, then select Casey's
   `Leave asset` and confirm exactly once. Without reload, Casey disappears
   from Asset Members, the accepted total decreases once, every pending red
   counter stays unchanged, and the Asset becomes `Under review` instead of
   being deleted.
4. Confirm Nova and Riley each receive exactly one `Asset needs a new owner`
   notification and no duplicate occurrence. Casey no longer has owner or
   Manager authority during this handover state.
5. In Nova, open `My Assets → Transport`. The same target must come from the
   backend query with `Take over`; Riley, as a plain Member, must not receive
   that action. Confirm `Take over` exactly once.
6. Confirm Nova becomes the new Asset owner: the Asset returns to its previous
   active status, Nova retains the Manager label/icon but now has owner-level
   member-removal authority, and a second actor cannot also take over. Event
   and Group roles remain unchanged.
7. Casey is not banned. After Nova's takeover, either invite Casey again or
   let Casey send a fresh Join request. After the normal acceptance, Casey
   returns as an ordinary Asset Member. Casey may later be promoted to Asset
   Manager again, but that promotion creates only a normal delegated Manager;
   it must not restore owner/super-manager authority. Only a later successful
   `Take over` of a genuinely ownerless Asset can do that.
8. Reload the actors once and confirm the new owner, Casey's fresh role, the
   zero pending state after resolution, and the exact-once notifications are
   reconstructed without stale menus or duplicate rows.

## 1. Confirm the generated-group baseline

1. In **Casey**, open:

   `Activities → Events → Active Events → QA ASSET-MEMBER-001 Tournament → View Event`

2. On `QA Membership Stage`, open `⋮ → Groups`. Confirm the stage selector is
   `QA Membership Stage` and exactly Group A and Group B are shown.
3. Open Group A's `⋮ → Assets → Transport`. Confirm
   `QA ASSET-MEMBER-001 Group Transport` appears exactly once with `1 / 4` and
   no pending counter. Close Transport.
4. Open Group B's `⋮ → Assets → Transport`. Confirm the controlled Transport
   is absent and Group B has no Transport pending counter. Close Transport,
   but keep the Event path available for the next section.

## 2. Create the distinct Invite and Join requests

5. In **Casey**, reopen Group A `⋮ → Assets → Transport` and select the target
   card's `Open member requests` capacity badge.
6. Confirm Asset Members initially shows only Casey's accepted manager/owner
   row and no pending rows. Select `Invite`.
7. Select only **Nova Social**, then select the `Invite selected members`
   confirmation exactly once. Do not select Riley in this picker.
8. Without reloading, confirm Asset Members now shows Nova once as a pending
   Invite. Close Asset Members and confirm the target Transport still shows
   `1 / 4` accepted with `1` pending.
9. Still without reloading Casey, close upward one surface at a time and prove
   the same `+1` is carried through the whole open signal chain: the target
   Transport card, Group A's Transport action, Group A's action trigger, the
   selected stage trigger/menu item, `QA Membership Stage`, and the parent
   Activity/Event card each show one pending change. Group B remains zero.
10. Reload **Casey** exactly once. Starting again from the Activity/Event card,
    confirm the same red `+1` pending chain is reconstructed top-down through
    the stage and Group A. Reopen Transport and confirm that opening the path
    does not clear any level: the target card must still appear exactly once
    with `1 / 4` and `1` pending. This is the independent server-write/reload
    check, not a repeat of the live signal assertion.
11. Reload **Nova** exactly once. From the Activity/Event card, follow the same
    stage → Group A → Transport path and confirm the red `+1` pending marker at
    each level. In the Transport list, the target Transport card itself must
    appear exactly once and show `1 / 4` with Nova's one pending Invite. Open
    Asset Members and confirm only Nova's own row is pending for her response;
    the complete red `+1` chain must still remain after these reads.
12. In Nova, open Notifications. Confirm exactly one controlled Asset Invite
    notification from Casey for the target Transport, with no duplicate row.
    It may move from `New` to notification history after opening; do not expect
    it to disappear from history.
13. In **Riley**, open the same Event, stage Groups, Group A and Transport path.
    Open the target Transport card menu and confirm both `Join` and
    `Ask Organizer` are available. Select `Ask Organizer` before joining.
14. Confirm `Asset Service · QA ASSET-MEMBER-001 Group Transport` opens in the
    standard chat popup with its normal composer and tools. Send exactly one
    message:

    `QA ASSET-MEMBER-001: Riley asks Casey about the assigned Transport.`

15. Without reloading **Casey**, confirm the Chats unread counter increases by
    exactly one. Open `Chats`, select the `Service` channel filter and confirm
    exactly one target row shows Riley as sender and the controlled message as
    its preview. Open it and confirm the same message is present in the standard
    chat popup, then return to Riley's still-open Event path.
16. In **Riley**, reopen the target Transport card menu and select `Join`.
17. In `Join QA ASSET-MEMBER-001 Group Transport`, keep the staged date range
    and select `Send join request` exactly once.
18. Without reloading Riley, confirm the card no longer offers another Join and
    the Group A Transport pending counter has increased by exactly one to `2`.
    Riley's own pending member row may offer `Cancel join request`; it must not
    say `Leave asset`. Do not select it.
19. Reload **Casey** exactly once. Confirm the persisted pending chain is now
    exactly red `+2` from the parent Activity/Event card through the stage and
    Group A. Opening Transport must not consume that pending chain, and its
    target card must show the same `2` pending total. Open Notifications and
    confirm exactly one controlled Asset Join-request notification from Riley
    for the target Transport, with no duplicate row.
20. In Casey, reopen the target card's `Open member requests` badge.
    Confirm exactly these three rows:

    - Casey — accepted manual owner/manager assignment;
    - Nova — pending Invite;
    - Riley — pending Join request.

21. Confirm the target Transport still shows `1 / 4` accepted and `2` pending.
    Reopen Group B Transport once and confirm the target remains absent with no
    pending counter. Do not accept, reject or promote anyone yet.
22. Report the intermediate phrase:

    `ASSET-MEMBER-001 pending ready: Nova Invite and Riley Join share Group A only`

Wait for Codex's exact persisted pending oracle. It must prove distinct
Invite/Join request kinds and the same Asset/Event/stage/generated-group scope,
with byte-identical parent Event and both generated-group memberships. It must
also prove exactly one Casey-to-Nova Asset Invite notification and exactly one
Riley-to-Casey Asset Join-request notification, with no duplicate occurrence.

## 3. Resolve the two requests and keep member actions role-gated

23. After Codex confirms the pending savepoint, in **Nova** reopen the same
    Event, stage Groups, Group A and Transport path without another reload,
    then open the target card's `Open member requests` badge.
24. Record Casey's Notifications unread counter. On Nova's own pending Invite
    row select `Accept`, then confirm `Accept` exactly once. Confirm Nova is now
    a plain accepted Asset Member and no member-card action menu is available
    to her. Close Asset Members.
25. Without reloading Casey, confirm the red pending chain decreases from `+2`
    to `+1`, because only Riley's request remains unresolved. Confirm Casey's
    Notifications unread counter increased by exactly one and exactly one new
    controlled Asset invitation-accepted notification from Nova exists for the
    target Transport; it must not duplicate after reopening Notifications.
26. In **Casey**, open `My Assets → Transport` and locate only
    `QA ASSET-MEMBER-001 Group Transport`. Select its interactive availability
    count badge (or the card menu's `Availability` action).
27. Record Riley's Notifications unread counter. On Riley's still-pending row
    select `Accept`, then confirm `Accept` exactly once. Confirm the target is
    now `3 / 4`, its pending count is zero and the complete Event → stage →
    Group A → Transport → Asset-card red pending chain is zero. No replacement
    red counter may appear for the resolved Accept transition.
28. Without reloading Riley, confirm his Notifications unread counter increases
    by exactly one and exactly one controlled Asset request-accepted
    notification from Casey exists. Reopen the target Asset Members popup and
    confirm Riley is a plain accepted Member: neither Riley's own card nor
    Casey's card has a member action menu. In particular, there is no `Leave
    asset`, `Promote to admin` or `Report User` action.
29. Record Nova's Notifications unread counter. On Nova's accepted row in
    Casey's Asset Members surface select `Make Manager`, then confirm `Make
    Manager` exactly once.
30. Without reloading Casey, confirm Nova's card changes in place from Member to
    Asset Manager, with the Manager label and icon. `Make Manager` must
    disappear. Casey is the Asset owner, so Nova's menu must now contain both
    `Revoke Manager` and `Remove member`. The target remains `3 / 4`, every
    pending counter remains zero, and the My Assets Transport count itself does
    not change.
31. In Nova, confirm her Notifications unread counter increases by exactly one
    and exactly one controlled Asset manager-promotion notification from Casey
    exists.
32. Still without reloading Nova, reopen the same Event → stage → Group A →
    Transport → Asset Members path. Confirm Nova is an Asset Manager, can open
    the Invite control, and Riley's accepted Member card exposes `Make Manager`.
    Nova's own card must not offer `Make Manager` or a self-revocation action.
    Casey remains the Asset owner/Manager; his Event `Admin` role must not leak
    into this Asset-membership card.
33. Record Riley's and Casey's Notifications unread counters. In Nova select
    Riley's `Make Manager` action and confirm it exactly once.
34. Confirm Riley's card changes in place from Member to Asset Manager in
    Nova's still-open SmartList, with the Manager label and icon. `Make Manager`
    disappears; because Nova granted this role, `Revoke Manager` replaces it,
    while `Remove member` is absent for Nova. In Riley, confirm Nova's Manager
    card has no `Revoke Manager`: Riley did not grant Nova's role. In Casey,
    confirm the Asset owner may revoke or remove either non-owner Manager. The
    target remains `3 / 4`, every pending counter remains zero, and Nova and
    Riley remain Event Members with no Event or Group role change.
35. Confirm Riley's Notifications unread counter and Casey's Notifications
    unread counter each increase by exactly one. Riley receives exactly one
    controlled Asset manager-promotion notification from Nova; Casey receives
    exactly one notification for Nova's delegated Riley promotion. Reopening
    Notifications must not duplicate either occurrence.
36. Record Riley's and Casey's Notifications unread counters. In Nova select
    Riley's `Revoke Manager` action and confirm it exactly once. Confirm Riley
    remains on the Asset as an accepted plain Member, his card updates in
    place, `Revoke Manager` disappears and `Make Manager` becomes available
    again. Riley's and Casey's Notifications unread counters each increase by
    exactly one, with one controlled manager-revocation notification from Nova
    and no duplicate occurrence. Capacity, pending counters, Event membership
    and Group membership remain unchanged.
37. Record Riley's current Notifications unread counter. In Casey, reopen the
    target Asset Members surface, select Riley's accepted row `Remove member`
    and confirm `Remove` exactly once. Confirm Riley's row disappears, the
    target returns to `2 / 4`, and every pending red counter remains zero.
38. In Riley, confirm the Notifications unread counter increases by exactly one
    from the step-37 baseline and exactly one controlled Asset membership-
    removed notification from Casey exists. Riley may still use the target
    card's `Ask Organizer` Service chat, but he cannot remove himself.
39. In Casey's Event path, reopen the same Group A Transport and confirm the
    same `2 / 4`, zero-pending state appears immediately. Confirm Group B still
    has no controlled Transport or pending state. Confirm the Event membership
    surface still shows Casey as Event Admin and Nova and Riley as Event
    Members. Nova must not become Event Admin, and no one moves between Group A
    and Group B.

## 4. Reload reconstruction and notification

40. Reload Casey, Nova and Riley exactly once each.
41. Reopen the same Event/Group A Transport path in all three windows. Confirm
    `2 / 4`, zero pending and the same target identity persist. Nova can see
    the Asset as its manager but remains only an Event Member; Riley has no
    active Asset request and cannot see a stale pending row.
42. In Riley, reopen Asset Members and confirm accepted-member menus did not
    reappear after reload. Riley has no direct leave/remove control; Casey still
    owns the member-removal operation.
43. In Casey's `Chats → Service` list, confirm exactly one row for the Riley
    Asset Service channel and exactly one occurrence of the controlled message
    still exist after reload. Unrelated messages manually sent during an
    exploratory run do not count as duplicates of the controlled message.
44. In Nova's notification history, confirm exactly one controlled Asset Invite
    and exactly one Asset manager-promotion notification from Casey. In Casey's
    history, confirm exactly one controlled Riley Join-request notification,
    exactly one controlled Asset invitation-accepted notification from Nova,
    exactly one delegated Riley manager-promotion notification from Nova, and
    exactly one delegated Riley manager-revocation notification from Nova.
    In Riley's history, confirm exactly one controlled request-accepted
    notification from Casey, one manager-promotion and one manager-revocation
    notification from Nova, and one membership-removed notification from
    Casey. None of these ten
    controlled occurrences may be duplicated. These resolved notifications
    use only the relevant Notifications unread counter; they must not recreate
    the pending red Event/stage/Group/Asset chain.
45. In Casey, confirm Group B and the parent Event membership roles remain
    unchanged after reload.
46. Report the terminal phrase:

    `ASSET-MEMBER-001 terminal complete: Nova Manager, Riley removed, Event and Group B unchanged`

Wait for Codex's terminal persisted oracle. Do not reset or continue to another
testcase until Codex records the consolidated result and restores this fixture.
