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
    Selection uses `GET /auth/me/profile-ext?groupId=<id>`; an explicit empty
    `groupId` selects Base. The server/local repository stores the choice.
    Reload without the parameter restores it without writing a new selection.
    While the shared profile load is pending, the selector is disabled and the
    home page follows that same load state. On error or the configured 3-second
    HTTP timeout, the previous selection/profile stays displayed, the selector
    re-enables, and selecting the same target again retries. Confirm that a late
    response from the failed attempt cannot replace a newer successful choice.
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

## NOT RUN — Sharing, invitations, cash and contacts microchecks

Run these within the same checkpoint before its cleanup. Prepare two fresh
registration actors, one existing account, two events, two assets, a contact
and a two-party chat. Include one own shared message older than the loaded
message page. Record local and dev HTTP results independently; this extension
has no inherited PASS from the earlier Event/Asset/Chat checkpoints.

1. Open Share from a group/event/asset card. There is one sharing entry, with
   the common share icon and contextual teal color. It opens the **external
   link popup**, not the former raw-token confirmation dialog or a second
   legacy copy menu. Compare its read-only link field, Copy icon, dimensions,
   spacing and copied checkmark directly with Profile → Affiliate, in HU/EN
   and on desktop/mobile. Copy and reopen the complete URL, not a raw token.
2. Follow an external group link while signed out, register and finish the
   existing onboarding gates. Verify inviter attribution, accepted membership,
   one workspace profile and the selected active group. Reopen as that account:
   no duplicate membership, profile or affiliate registration. Repeat with an
   already registered account; its prior attribution must not be overwritten.
3. Follow an external event link as a fresh and an existing account. Verify
   that the target event is retained after authentication and the participant
   enters the normal event participation flow. Record the exact resulting
   accepted/pending/payment/approval state; flag a missing automatic attachment
   to the event. Existing capacity, payment and approval requirements still
   apply; do not mark the check PASS merely because registration succeeded.
4. In an open chat, choose Share event, then Share asset separately. These open
   the card selection surface. Check the usual basket count/list, removable
   basket items, and the confirmation tick beside Close. The card selector sits
   below the three-dot button and stays circular at wide and tall image ratios;
   existing member and status badges remain unobscured.
5. Select **two new cards**, then confirm once. The background chat receives
   **two separate messages**, each with its own attachment and message ID.
   Nothing requires Copy/Paste or a second Send. Check both participants,
   persist/reopen, and repeat confirmation/retry: no duplicate messages.
6. Reopen the picker: existing own shares are selected. In **one confirmation**,
   select two new cards and untick two previously shared cards. Verify that the
   same apply operation contains both additions and removals: two independent
   new messages, plus the original two messages shown as deleted. Untouched
   shares remain unchanged. Selecting and unticking a never-sent card creates
   neither a message nor a deletion.
7. Repeat removal for the old share which is absent from the recipient's first
   loaded page. Later load that page: the original message is deleted there as
   well. Remove/re-add another item and check its message identity. The picker
   must use persisted own shares, not infer them from the visible chat page.
8. Close a changed picker without confirming: no chat writes. Exercise a real
   load failure, a partial send/delete failure and retry; selection is disabled
   until its baseline loads, and retry sends only outstanding changes. Switch
   chat/account/group while a response is pending: no late result may affect
   the replacement chat or close its picker. SmartList/store updates happen
   in place, preserving position; no whole-list reload is needed.
9. Open Payment history and record received cash: select the payer, enter
   amount/currency and a note. Save/reopen as both parties; verify one matching
   income/expense record with counterparty and note, plus one notification to
   the payer. Retry the same command after a transport failure: no duplicate
   record, total or notification. Reuse its request ID with changed data:
   reject it. Check invalid amounts, self-payment and foreign-workspace payer.
10. Compare affiliate revenue/commission totals before and after both manual
    cash and a normal cash checkout. Neither contributes. A non-cash control
    still contributes normally; its refund still reverses the proper amount.
    Ordinary payment history/totals continue to include cash. A manual receipt
    has no fabricated booking link or booking-refund action.
11. Add a MyScoutee member as a contact. Its first contact method uses the
    MyScoutee emblem and opens the existing shared chat popup **above the still
    open contact list**. Closing the chat returns to that same contact list,
    with its search and loaded window intact. The chat's member and share
    pickers open above it; confirming a share returns to the same chat.
    Phone and other methods remain available. Both parties can write without an event. Reopen from
    the contact and verify the same conversation, not a duplicate.
12. Use the chat list's contacts filter and compare its contents with the
    ordinary list. Event and support channels keep their existing categories.
    Open the direct-chat avatar pill/member popup and exercise its supported
    member invitation with the existing picker. Its candidates must be **only
    the inviting user's saved contacts**, excluding people already in this chat.
    An empty contact list stays empty; it must never fall back to general member
    discovery. A person saved only by another participant is not eligible for
    this inviter. Try a non-contact and a foreign-workspace contact by direct
    command as well: both are rejected without a new membership or owner copy.
    Invite two eligible contacts and check immediate member/header/store updates,
    the recipients' own chat-list entries, two-way messages and the contacts
    unread badge (including read/reset). Reopen and verify durable membership,
    without creating an event.
    Record absent or incorrect behavior as a defect, never an inferred PASS.

For each failed microcheck, record its number, mode, actor/workspace IDs and
observed result. All twelve remain NOT RUN until explicitly executed.

## NOT RUN — September 25–26 shared UI regression micros

These extend this existing unexecuted checkpoint; they do not reopen or inherit
PASS from closed journeys. The implementation/task status is tracked separately
in [UI notes](../../../plans/UI_NOTES_2026_09_25.md). Record frontend-local and
dev HTTP outcomes independently, in HU/EN and at desktop/mobile widths.

1. **Configured selection maximum (UI note 1).** Open the topic/category
   selector in Event Explore, an equivalent Profile editor selector and another
   existing limited selector. Its heading includes only the short configured
   suffix, e.g. `Téma (max. 3 db)`. Check actual limits 1 and greater than 1;
   do not assume every selector permits three. A selector without a configured
   limit has no fabricated maximum. The suffix is in the heading, not a longer
   explanation or trigger label. Existing select/deselect enforcement remains
   consistent with the displayed limit, including nested menus and mobile.
2. **Contact requests (UI note 2).** Execute the separate direct-chat permission
   micros in [GROUP-ISOLATION-001](GROUP-ISOLATION-001.md#separate-direct-chat-permission--not-run-refinement-2026-09-26):
   pending-only side-menu badge, search-row icon+label filter, reverse request
   order, recipient decisions/notifications, persisted contact on approval and
   immediate SmartList remove/insert without reload. Do not substitute this
   link for executing those steps.
3. **Empty calendar export (UI note 3).** With no exportable upcoming event,
   show the localized information popup with X and no footer action buttons;
   no empty/malformed ICS download. The underlying popup remains visible,
   blurred, and returns intact after closing the notice. With an eligible
   upcoming event, the normal ICS export still works and imports correctly.
4. **Birthday and horoscope (UI notes 7–8).** Type and select 1974/10/04 in the
   shared date control; save, reopen and reload. Day/month must not swap, and
   the profile shows Libra/Mérleg. Reject an invalid day without rolling into
   the next month. Do not infer or bulk-repair ambiguous historical birthdays.
5. **Children (UI note 9).** Check Nincs/Van and No/Yes in the editor, profile
   and filter; save/reopen and confirm the stored meaning and existing
   non-disclosure option remain intact.
6. **Landing social heading (UI note 10).** Check Kövess minket / Follow us
   above the existing social links. This label change must not alter targets.
7. **Setup help (UI note 12).** The question-mark button is beside X. It opens
   the existing information popup with short blocks explaining location,
   notifications, installation and prior browser/OS denial. Check Android and
   iOS guidance separately; after changing the relevant external settings,
   return and retry. Closing the help leaves the underlying setup popup intact.
   Confirmation-like notices blur their parent; full-cover surfaces do not
   need an additional visible-parent requirement. Record physical-device
   branches separately; desktop observation is not a device PASS.

### Queued help-content reseed — NOT RUN, implementation pending

After the side-menu Help content is expanded, check its accordion structure,
coverage of existing features, readability and HU/EN text. Compare the canonical
frontend-local and prod/dev/demo/e2e seed sources, including fresh seed and the
existing supported update/import path; never reseed a live production database
as a QA shortcut. Old content must not remain in one adapter/environment while
another receives the new version. This is the side-menu Help task, separate
from the already implemented setup-permissions help above. UI note 11 remains
on hold for the user's revised idea.

## NOT RUN — initial location, Firebase entry and mobile menu closing

Keep these micros in this existing NOT RUN case; no new case or manual PASS.

1. Fresh Firebase registration/sign-in with no saved coordinate: request location
   through Setup, then complete onboarding. The scoped browser pending point
   survives reload and is sent only on the first `/auth/me/profile-ext` request
   as latitude/longitude parameters (alongside groupId when selected), with no
   location X-header. Verify Mongo account/active group profile and local
   IndexedDB separately. Only a successful authoritative response clears pending.
2. Fail that profile request: no cached-success acknowledgement, no losing the
   pending point; retry sends it again. Account switch must not send another
   account's point, and an older reply must not clear a newer staged point.
3. Existing registered Firebase user: logout and sign in once, with avatar preview
   changing. Enter the app on that first attempt. Real logout/account/session
   change still discards stale reads; failed group switch unlocks the selector.
4. Restore a session using server-stored coordinates while geolocation is denied.
   No mandatory GPS request or landing-page trap. Notifications retain their
   own setup flow. Opening the landing alone must not acquire GPS repeatedly.
5. With native location granted, disable location in Setup and save. Watch stops,
   existing server point remains usable. Reopen Settings and confirm OFF remains;
   enable again explicitly. Native denial/revocation does not erase the point.
   Movement below 5 km causes no write; >=5 km saves through the existing path.
6. Mobile: open a card's three-dot menu above a popup whose X becomes covered.
   The sheet has its own X in the heading; it closes only the sheet, leaves the
   parent list/search/scroll intact and does not select an item.
7. Check all seven surfaces in the [UI-notes menu audit](../../../plans/UI_NOTES_2026_09_25.md):
   moderation categories, activity rating filter, event topics, asset basket,
   invite-member basket, event-share basket, asset-share basket. Title and X
   remain usable after selecting/removing items; no unintended basket commit.
   Check a profile multiselect, price-scope selector and checkout optional-item
   card menu too. HU/EN and narrow mobile widths; no header/button overlap.
8. Desktop: titles are allowed, the added mobile X is absent. Rate-score popup
   retains its scroll-dismiss behavior; dock/fixed/explicit anchored special
   controls retain their existing close lifecycle.
