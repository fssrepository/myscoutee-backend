# GROUP-LIFECYCLE-001 — Community group lifecycle

Domain: Group. This covers community workspaces, not the generated groups inside
an Event or Tournament. Execution results belong in the matrix and a dated
evidence log; this is the stable checklist.

## Baseline

Use an organizer, a member, and an unrelated account. Prepare a public group,
a private group, and an invitation-only group, with both pending join and pending
invitation controls. Use the normal local seed and demo Mongo collections,
including `activityMembers` with `ownerType: community`; do not add a parallel
seed catalogue. Snapshot affected records before the versioned checkpoint
fixture stages changes. Register the checkpoint with the existing browser
launcher before starting its managed sessions. Do not reset the user's unrelated
data or borrow an earlier closed checkpoint's PASS.

Run the same contract in frontend local and dev HTTP modes. Record each mode
separately. This baseline description does not itself authorize fixture mutation
or claim that a fixture or browser session has already been prepared.

## Numbered checks

1. Open Groups from the Community menu. Confirm Hosting, Participation and
   Explore are distinct: owned/administered groups belong in Hosting; accepted
   memberships and either pending interaction belong in Participation; Explore
   excludes owned and already-interacted groups. Check category filtering and
   pagination against the same membership state.
2. Compare category icon colors with their filter menu items. Check selected
   menu-item tint, card labels and pending/member badges. Use the card's actions
   and member badge; do not require a newly invented whole-card animation.
3. Create a group with image, name, description, category and visibility. Try
   an empty name and a name exceeding 20 characters. Save a valid name and
   reopen the editor; confirm every saved field.
4. Toggle **Taglista látható** and compare organizer, accepted-member and
   unrelated-account roster views. The toggle aligns with the description's
   right edge and its state survives reload.
5. Enable group rules. Open Profile visibility rules: sections stack vertically;
   optional fields have equal-width controls in two columns, labels left and
   switches right. Base-profile mandatory fields are absent. Check desktop
   height/width, mobile full screen, scrolling, and absence of an opening jump.
6. Select fields from different sections. Nested confirmation updates the
   editor's draft/table only; cancelling the group editor leaves stored policy
   unchanged. Repeat and save with the group editor's confirmation. Reopen:
   values persist, the first table column is bold, and rows use pale versions
   of their corresponding toggle colors.
7. Disable rules: both the rules button and table collapse. Re-enable and check
   the draft selections. Read-only group viewing remains legible.
8. Open View/Edit from a list card and inspect the ordinary network record:
   list summaries omit description/policy; detail loads on opening. Local mode
   uses its configured route delay; HTTP mode adds no artificial client delay.
   The nested rules popup performs no independent detail load.
9. Request to join as the unrelated account. Cancel first, then confirm. Both
   the menu and confirmation use the Event Join button's blue palette. The
   confirmed group moves from Explore to Participation as pending and survives
   reload; no group workspace is selectable before acceptance.
10. Approve the request as administrator. Confirm accepted membership, one
    workspace profile, updated member counts, and a selectable workspace.
    Separately invite the member through the normal members popup, then accept
    or reject as that member and compare the canonical list state.
11. Select the group in the header. Long names truncate only the label; the
    monogram remains circular and fully visible. Base-profile globe and group
    choices use their contextual colors. Verify avatar/name/location spacing
    below the toolbar and spacing between body menu sections; smoke normal,
    admin and operator layouts where those roles expose the menu.
12. Compare group profile details with the base profile. Required fields follow
    the saved policy. Organizer/member role actions use their normal authority;
    an ordinary member cannot approve others or edit group policy.
13. Report a group as a non-owner. In **app-admin** content moderation, verify
    the **Group** dropdown category, preview and configured review lifecycle.
    With app moderation enabled, group creation follows that configuration;
    with it disabled, no review hold is added. Check the group card's status
    badge at the **bottom left of the image frame** in each applicable state.
    Record the deployment's actual settings and restore them afterward.
14. As an accepted **group administrator**, open Moderation from the group
    card menu. The same moderation popup exposes this group's Asset/Event/Feed
    content and its own settings; **Group** is absent from its categories.
    Submit pending content, decide it, and repeat the same command/reload.
    Verify the stored moderation count, the red Moderation menu badge, the
    three-dot badge, workspace dropdown and sidebar Groups aggregate. Approval,
    rejection, unblocking and configured worker approval update the count only
    once. A decision updates the existing SmartList card and an open dropdown
    through the signal store immediately: no page reload, list restart or
    full-list detail fetch, and no scroll/filter loss. A late older poll must
    not restore the old count. An ordinary member sees no admin queue count.
15. Reject/block group content with a message. Confirm one **Group support**
    conversation between the group's profiles, with its own channel filter
    and unread counter. Reading and replying update that counter and the
    ordinary Chats total. The app-admin Support queue, App support filter and
    base-profile support counter remain unchanged. Retry delivery: no second
    message or unread increment. Check the new HU/EN labels after reload.
16. Leave/remove the test membership and check the remaining group lists and
    workspace choices after reload. An owner cannot be removed through an
    ordinary member action. Restore only the checkpoint's exact snapshots.

## Independent oracles

Compare immediate response, persisted group/membership/workspace profile, then
ordinary reload/poll. Capture IDs, role/status/requestKind, policy and count
deltas without credentials. A correct local UI alone does not prove HTTP
authorization. Record missing branches as NOT RUN, never as inferred PASS.
