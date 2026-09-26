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

## 1. Group lists and category colors

1. Open Groups from the Community menu. Confirm Hosting, Participation and
   Explore are distinct: owned/administered groups belong in Hosting; accepted
   memberships and either pending interaction belong in Participation; Explore
   excludes owned and already-interacted groups. Check category filtering and
   pagination against the same membership state.
2. Compare category icon colors with their filter menu items. Check selected
   menu-item tint, card labels and pending/member badges. Use the card's actions
   and member badge; do not require a newly invented whole-card animation.

## 2. Create and reopen a group

3. Create a group with image, name, description, category and visibility. Try
   an empty name and a name exceeding 20 characters. Save a valid name and
   reopen the editor; confirm every saved field.
4. Toggle **Taglista látható** and compare organizer, accepted-member and
   unrelated-account roster views. The toggle aligns with the description's
   right edge and its state survives reload.

## 3. Group rules and draft persistence

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

## 4. Join requests and member decisions

9. Request to join as the unrelated account. Cancel first, then confirm. Both
   the menu and confirmation use the Event Join button's blue palette. The
   confirmed group moves from Explore to Participation as pending and survives
   reload; no group workspace is selectable before acceptance.
10. Approve the request as administrator. Confirm accepted membership, one
    workspace profile, updated member counts, and a selectable workspace.
    Separately invite the member through the normal members popup, then accept
    or reject as that member and compare the canonical list state.

## 5. Workspace selection and profile loading

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
    Groups remain a flat account-level membership list while a workspace is
    selected: using the Groups menu does not create child/subgroups.

## 6. App moderation, group moderation and support

### 6.1. Relevant changes, menu badges and notification recipients

The Groups sidebar badge sums the **relevant operations/changes inside groups**
for the current member/organizer. It is not a count of groups with activity.
For example, two relevant changes in one group and three in another must show
five, not two. Moderation is an additional administrator-only source, not the
definition of all group activity.

1. As organizer and ordinary member, cause distinct relevant changes, including
   a join request, an accepted/new member and ordinary group activity. Check the
   corresponding group menu items, card three-dot, Hosting/Participation dropdown,
   workspace dropdown and sidebar aggregate. Preserve visibility rules: a member
   sees changes they may access, never the administrator's moderation queue.
   In each menu, a single-digit badge is the same 20px circle as the card's red
   counter, with its number centered in both axes. Check the card's dark member
   total and red pending counter too. Longer counts may widen; they must not
   clip or squeeze.
2. Add a moderation decision/request as administrator alongside member-visible
   activity. Verify both sources independently and their sum; completing one
   operation must not clear the other source or count the same operation twice.
3. Compare the mutation response and stored write-side counters. Immediate
   updates use the existing signal stores and SmartList insert/update/remove
   behavior. No reload, full-list restart, or query-time reconstruction of
   counters; an older poll must not restore the previous state. Reload is a
   separate persistence check, not how the UI obtains the change.
4. For each notifying mutation, inspect both actors: the appropriate affected
   recipient receives the notification, not the actor executing the mutation.
   Retry must not create another notification or increment for the same change.
   Notifications remain account-wide, identify their group, and obey the existing
   All/Base/group filter. No unrelated group/account receives the notification.

### 6.2. Moderation and support lifecycle

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

## 7. Leave and remove membership

16. Leave/remove the test membership and check the remaining group lists and
    workspace choices after reload. An owner cannot be removed through an
    ordinary member action. Restore only the checkpoint's exact snapshots.

## Independent oracles

Compare immediate response, persisted group/membership/workspace profile, then
ordinary reload/poll. Capture IDs, role/status/requestKind, policy and count
deltas without credentials. A correct local UI alone does not prove HTTP
authorization. Record missing branches as NOT RUN, never as inferred PASS.

Run these within the same checkpoint before its cleanup. Prepare two fresh
registration actors, one existing account, two events, two assets, a contact
and a two-party chat. Include one own shared message older than the loaded
message page. Record local and dev HTTP results independently; this extension
has no inherited PASS from the earlier Event/Asset/Chat checkpoints.

## 8. External sharing links and admission

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

## 9. Chat sharing basket and message changes

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

## 10. Cash history and affiliate exclusion

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

## 11. Contacts and the existing chat popup

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

These extend this existing unexecuted checkpoint; they do not reopen or inherit
PASS from closed journeys. The implementation/task status is tracked separately
in [UI notes](../../../plans/UI_NOTES_2026_09_25.md). Record frontend-local and
dev HTTP outcomes independently, in HU/EN and at desktop/mobile widths.

## 12. Selection limits and contact-request controls

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

## 13. Empty calendar export

3. **Empty calendar export (UI note 3).** With no exportable upcoming event,
   show the localized information popup with X and no footer action buttons;
   no empty/malformed ICS download. The underlying popup remains visible,
   blurred, and returns intact after closing the notice. With an eligible
   upcoming event, the normal ICS export still works and imports correctly.

## 14. Birthday, horoscope and children fields

4. **Birthday and horoscope (UI notes 7–8).** Type and select 1974/10/04 in the
   shared date control; save, reopen and reload. Day/month must not swap, and
   the profile shows Libra/Mérleg. Reject an invalid day without rolling into
   the next month. Do not infer or bulk-repair ambiguous historical birthdays.
5. **Children (UI note 9).** Check Nincs/Van and No/Yes in the editor, profile
   and filter; save/reopen and confirm the stored meaning and existing
   non-disclosure option remain intact.

## 15. Landing social heading

6. **Landing social heading (UI note 10).** Check Kövess minket / Follow us
   above the existing social links. This label change must not alter targets.

### 15.1. Earlier landing and reporting requests — NOT RUN

1. In Partners, check the additional concise closed-community/company card,
   including its employee wellbeing use case, in HU/EN. Before Optional network
   registration, check the full-width API block, distinct color and working
   GitHub API link; the text explains user-bound integration for booking and
   internal company systems without claiming broader permissions.
2. On desktop, the discovery/join button row is left aligned. Supported countries
   and Report an issue use the same blurred backdrop as the other footer popups.
3. On the frontend GitHub issue chooser, verify the concise Bug, Feature and
   Question templates. Merely finding local template files does not prove that
   the remote repository has them. Do not submit an issue for this check.
4. Check the current version on the right of the installation/settings menu,
   including when installation is already complete and its button is hidden.
   It uses the existing runtime version source; a popup-only or hardcoded version
   is not sufficient. Do not change landing content to implement this label.

## 16. Setup permission help

7. **Setup help (UI note 12).** The question-mark button is beside X. It opens
   the existing information popup with short blocks explaining location,
   notifications, installation and prior browser/OS denial. Check Android and
   iOS guidance separately; after changing the relevant external settings,
   return and retry. Closing the help leaves the underlying setup popup intact.
   Confirmation-like notices blur their parent; full-cover surfaces do not
   need an additional visible-parent requirement. Record physical-device
   branches separately; desktop observation is not a device PASS.

## 17. Common help seed and AI integration

Check the expanded 17-topic side-menu Help accordion structure,
coverage of existing features, readability and HU/EN text. Compare the canonical
frontend-local and prod/dev/demo/e2e seed sources, including fresh seed and the
existing supported update/import path; never reseed a live production database
as a QA shortcut. Old content must not remain in one adapter/environment while
another receives the new version. This is the side-menu Help task, separate
from the already implemented setup-permissions help above. AI integration is the
second topic. Anonymous MCP reads the same active HU/EN help API. Local private
MCP discovery matches the key's actual profile/group and authorized operations;
group keys cannot create assets. See the API checklist for detailed MCP micros.
Personal remote OAuth and the connections table are implemented; exercise their
profile-bound permissions and local-only settings in the API checklist’s NOT RUN
micros. The seeded common help revision is v3 in both languages.

## 18. Back and close-button history

- On mobile, open a popup, its menu/sheet and a confirmation. Native Back closes
  only the top surface each time, retaining the parent and its state; required or
  busy surfaces retain their existing close rules.
- X followed by Back must not require an extra invisible step. Rapid X/reopen and
  repeated Back must not close the wrong surface or navigate into entry consent.
- On desktop, X remains the visible close control; browser Back follows the same
  overlay stack. Forward does not resurrect closed dialogs. Without overlays,
  normal route Back/Forward still works. Reload leaves no stale overlay marker.
- Sign-in/session, active group, stored location and privacy consent must remain
  intact across these checks. Rating/docked surfaces retain their existing
  scroll/inline dismissal behavior. Record real device and Router behavior;
  isolated store tests alone do not prove the user journey.

Keep these micros in this existing NOT RUN case; no new case or manual PASS.

## 19. First location save and Firebase sign-in

### 19.1. Complete demo entry — NOT RUN

Use a separately prepared signed-out browser and the actual Login/demo-selector
UI. The Group list fixture's injected session is not evidence for this block.
Demo members are pre-registered; selecting one is not new-user registration.
Snapshot any missing/invalid-coordinate control before changing it; do not
damage the three valid Group list actors to create this negative control.

1. Open the landing, complete required consent, press Login and select a valid
   demo member. Check both local and HTTP modes. Eligibility is established
   before the application session is created; then the first profile/avatar
   load completes and the home page appears once, without a second login.
2. Repeat with browser location denied, then with an unsupported browser point
   while the profile retains an accepted point. No automatic Setup/installation
   popup, loss of the accepted point, game flash followed by logout, or session
   removal. An installable browser must not automatically open Setup after login.
3. Run the missing/invalid-coordinate control described below through the real
   selector: badge, Setup, rejected point, cancel, retry with an accepted point.
   Before successful admission there is no new application session or game UI.
4. Verify the initial avatar-load persistence, reload, explicit logout and
   another real demo selection. Reload restores the same authenticated account;
   logout/login creates only the intended new session. A failed profile load
   can be retried and cannot admit a different actor or acknowledge stale data.
5. Follow a group invitation while signed out and repeat the selector/Setup
   cancellation/retry branch under INTEGRATION-API-GROUP-001 block 3. Its claim,
   membership and active workspace are verified there; this block does not
   borrow PASS from previously closed registration/authentication cases.

### 19.2. Admission, pending coordinates and Firebase — NOT RUN

Demo admission (pre-registered profiles; run local and HTTP separately):

- Verify every selectable seeded member has coordinates inside an enabled
  country partition. This comes from seed data, not a demo eligibility bypass.
- In the missing/unsupported-location controls, the existing status badge slot
  shows the amber localized **Helyadat kell / Location needed** state. There is
  only one badge per card; blocked/deleted states retain that same slot.
  Valid members and privileged role selectors do not get a location warning.
- Select a valid member while the browser has an old, unsupported location.
  The selected profile's stored point is checked before session creation;
  no stale browser point replaces it and no installation popup is needed.
  No separate eligibility call checks the later cached/pending sample. It
  travels on the avatar/profile load; an unsupported sample is discarded by
  the server, returning the saved point successfully and clearing pending.
- With a checkpoint-owned missing/invalid-coordinate control, select the
  member. The existing Setup popup opens before session creation or game
  navigation. A rejected fresh point shows its localized error inside Setup;
  changing browser permission/location and retrying remains possible.
- Cancel: no new session and no game cards. Retry with an eligible point:
  complete the normal profile preparation and first profile-load persistence,
  then enter once. Restore the control from its snapshot after the check.

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

## 20. Stored location and optional tracking

4. Restore a session using server-stored coordinates while geolocation is denied.
   No mandatory GPS request or landing-page trap. Notifications retain their
   own setup flow. Opening the landing alone must not acquire GPS repeatedly.
5. With native location granted, disable location in Setup and save. Watch stops,
   existing server point remains usable. Reopen Settings and confirm OFF remains;
   enable again explicitly. Native denial/revocation does not erase the point.
   Movement below 5 km causes no write; >=5 km saves through the existing path.
   Deliver a point outside eligible countries after a valid saved point:
   Mongo/IndexedDB, browser cache and movement baseline retain the accepted
   point. No automatic Setup/installation or access-restricted popup, session
   deletion or logout. Explicitly opening Settings remains available. A later
   eligible movement can still save normally.
   The server first checks the saved country, then uses the existing spatial
   index if necessary. An empty country lookup discards the new point; it is
   not a failed admission or a reason to re-check the previously accepted point.

## 21. Mobile sheet close buttons

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

Run these microchecks within this existing case in local and HTTP mode; they
are pending manual verification, not extensions of an earlier PASS.

## 22. Account-owned tools and Asset Explore

- In **My Tools / Eszközeim**, create an asset while group A is selected. Verify
  the stored owner is the Base account. Open the same inventory in Base and group B;
  the asset remains present and the open popup retains its account owner. Create,
  edit or delete an asset and verify the tool badges update immediately through
  the shared store in the active group, with no full reload. An older in-flight
  poll must not restore the previous badge count; event counters remain separate.
- Switch Base → group A → group B. Asset Explore and owned tools retain the
  account inventory; Event Explore shows only the selected profile's workspace.
  Include a public asset booked for an event in a group the viewer has not joined:
  the asset remains discoverable without granting access to that group's event.
  Private/friends-only asset visibility still applies; own assets stay out of Explore.

## 23. Profile scope and asset payment history

- Profile, affiliate settings/API keys and event payment history follow the selected
  profile. Community, Impressions and Activities and their nested surfaces are
  group-scoped. Tools and their nested surfaces remain account-wide. Asset booking
  and ticket rows do not add workspace labels; notifications retain their labels.
- Pay for an asset from a group profile. The existing payment stays on that payer
  profile and appears there as an expense. The asset owner's Base history reads
  the same payment as income by its stored recipient ID; no copied history record,
  payer reassignment or query-time Asset/Event lookup to classify the payment.
  Other group profiles do not inherit this expense or income. Refunds reverse the
  direction for the same payer/recipient and retain their existing workflow.

## 24. Account contacts and event-linked assets

- Open an approved account contact from group A and Base: one contact conversation,
  same members, sender identity and read receipts. Request/approve/reject updates
  stay on the account's contact state across group changes. A switch to another
  account rejects stale responses. Invites remain limited to saved contacts.
- Borrow/assign an asset for an event in group A. Account asset ownership/management
  is usable, but the borrow request retains the event participant's group profile.
  Repeat from group B and Base without event authority: the event operation fails.
  Ticket lists remain account-wide; scanning authorizes the authenticated event
  profile, ignoring a forged body user ID. No asset ownership grants event access.

## 25. Global notifications and scoped API keys

### 25.1. Notification layout — NOT RUN

1. At the narrow mobile size from the report, the date/time badge aligns with
   the first row. The explanation uses the available space up to the three-dot
   action and can use two lines. Preserve the title's original width behavior.
2. Only the All filter menu moves to the row below the header/X. The New filter,
   bell and Close remain in the header. Verify long HU and EN explanations and
   opening/closing item actions without overlapping text or hidden controls.

### 25.2. Scope and authority

- Notifications stay account-wide, identify their group and retain the existing
  All/Base/group filter. Check write-side counters and live updates after a group
  switch, including account contact requests and tickets from multiple groups.
- Issue a Base API key and a group-A API key, then select group B interactively.
  The Base key creates Base assets; the group key creates group-A events.
  Both JSON and multipart asset creation with the group key return 403 with no
  created asset, external-ID mapping or uploaded image. Repeat after returning to
  Base: the group key still cannot create assets. Revoking membership blocks the
  group key. No group header or per-request group selection is involved.
