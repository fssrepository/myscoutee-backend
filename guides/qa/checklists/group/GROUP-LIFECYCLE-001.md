# GROUP-LIFECYCLE-001 — Community group lifecycle

Domain: Group. This covers community workspaces, not the generated groups inside
an Event or Tournament. Execution results belong in the matrix and a dated
evidence log; this is the stable checklist.

## Execution and progress contract

- Complete blocks in dependency order. A block is closed only when every check
  assigned to it is evidenced in its named adapter; a fixture/savepoint or source
  change alone never closes it.
- Before advancing past an unavailable prerequisite, move the exact unexecuted
  checks into an explicitly numbered later block, retain the original-step
  mapping, and include that block in the denominator. Do not move a defect merely
  to avoid repairing/retesting it. Never discard a requirement or reopen closed
  PASS cases to change accounting.
- Report **closed execution blocks / total execution blocks**, current block,
  next block and actual blockers. Do not use the currently visited block number
  as the completed count. HTTP and Local each contribute their own blocks.
- The same rule applies to the queued Group Isolation and Integration API
  checklists. Their blocks remain in the campaign denominator before they start.
  Device/external-prerequisite checks remain open until executed; moving them
  later never gives them partial or inferred credit.
- Preserve captured evidence and resume the next unfinished check from the
  corresponding savepoint. Structural edits are not new test results.

## Baseline

Use an organizer, a member, and an unrelated account. Prepare a public group,
a private group, and an invitation-only group, with both pending join and pending
invitation controls. Use the normal local seed and demo Mongo collections,
including `activityMembers` with `ownerType: community`; do not add a parallel
seed catalogue. Snapshot affected records before the versioned checkpoint
fixture stages changes. Register the checkpoint with the existing browser
launcher before starting its managed sessions. Do not reset the user's unrelated
data or borrow an earlier closed checkpoint's PASS.

Run each block to completion in one named adapter before advancing. HTTP and
Local are separate execution blocks in the progress ledger; neither borrows the
other's PASS. Schedule the complete Local sequence after the HTTP sequence. This baseline description does not itself authorize fixture mutation
or claim that a fixture or browser session has already been prepared.

## 1. Group lists and category colors

1. Open Groups from the Community menu. Confirm Hosting, Active groups, Pending groups and
   Invitations are distinct: owned/administered groups belong in Hosting; accepted
   non-admin memberships belong in Active groups; pending join requests belong
   in Pending groups; pending invitations belong in Invitations. The plus menu
   offers Create group and Explore groups, matching the Event action menu. Explore
   opens a separate popup with category filtering only there; it
   excludes owned and already-interacted groups. Check category filtering and
   pagination against the same membership state. Reconfirm the original closed
   company/group requirement: invitation-only groups never appear in Explore,
   including filtered totals, subsequent pages and sync upserts. A pending
   invitation belongs in Invitations; only accepted members can select the
   workspace. A known private group ID does not grant an outsider detail access.
2. Compare category icon colors with their filter menu items. Check selected
   menu-item tint, card labels and pending/member badges. Use the card's actions
   and member badge; do not require a newly invented whole-card animation.
   Distance headers show the interval's inclusive lower boundary, using the
   shared Activity grouping: **0 <= d < 5 km → 0 km**, **5 <= d < 10 km → 5 km**.
   Check 0, 3.2, 4.999, 5, 5.1, 9.999 and 10 km; display, server/local ordering
   and pagination must use the same boundaries. The Activity/Event cross-surface
   regression is retained in block 29 after the corresponding fixtures exist.
   Resize the list: two cards remain side by side when the available width
   fits them (including a roughly 600px window); narrow phones use one column.
   The last card retains a normal column width and distance headers span the row.
   Images retain their aspect ratio and remain fully visible in the compact
   image area, including square images and their top edge.
   The shared header menu offers Distance and Recent immediately before Close.
   The shared circular plus at the right end of the second row opens the action
   menu. Hosting/Active/Pending/Invitations use Event green/orange/amber/violet.
   Explore uses violet in the plus menu. Its popup has no bucket selector: category
   is left-aligned on row two and Distance/Recent remains before Close. Closing
   Explore preserves the underlying main list selection and scroll position.
   Explore defaults to exact
   distance ascending, including within each distance interval; Hosting and
   Active groups/Pending groups/Invitations default to last-change time descending, with date headers.
   Switch either sort in each bucket, filter and paginate; read/sync order agrees.
   Recent uses saved change time, not creation time. Block 29 owns the subsequent
   live-mutation/retry ordering checks after those mutations have been exercised.

## 2. Create and reopen a group

3. Create a group with image, name, description, category and visibility. Try
   an empty name and a name exceeding 20 characters. Save a valid name and
   reopen the editor; confirm every saved field.

The three-role roster visibility check formerly numbered step 4 is in block 27.1,
after membership and administrator fixtures exist. Block 2 closes on the created
and reopened group, not on later role/presentation or Local execution.

## 3. Group rules and draft persistence

5. Enable group rules and choose optional fields from different sections.
   Base-profile mandatory fields are absent.
6. Nested confirmation updates the editor's draft/table only; cancelling the
   group editor leaves stored policy unchanged. Repeat and save with the outer
   editor's confirmation. Reopen and verify persisted required fields.
7. Disable rules: the rules button and table collapse. Re-enable and check that
   draft selections remain. Read-only viewing must prevent edits.
8. Enable Group Policies using the shared Event Policy input/editor. Add a named
   mandatory rule and a recommendation, cancel the outer editor, then repeat and
   save. Only outer Save persists the draft; reopening preserves enabled state,
   both texts and their required/optional values. In View, the nested title is
   Policy / Szabályzat and the fields cannot be edited.

The cross-viewport presentation assertions from steps 5–8 are retained in block
27.2. Detail-request and adapter-delay assertions from step 8 are in block 28.
The Local replay is a separately counted execution phase. These are separately required closure gates,
not requirements removed from the campaign.

## 4. Join requests and member decisions

9. Request to join as the unrelated account. Cancel first, then confirm. Both
   the menu and confirmation use the Event Join button's blue palette. The
   confirmed group moves from Explore to Pending groups and survives
   reload; no group workspace is selectable before acceptance.
10. Approve the request as administrator. Confirm movement from Pending to Active, accepted membership, one
    workspace profile, updated member counts, and a selectable workspace.
    Separately invite the member through the normal members popup, then accept
    or reject as that member and compare the canonical list state. A pending
    invite appears in Invitations, with its own Accept action even if the roster
    is private. The confirmation has a full question and matches the menu color.
    Acceptance moves the card to Active groups and updates card, menu, category,
    workspace and sidebar counters immediately through the shared stores. No
    group-join payment is introduced. With the main Pending list behind Explore,
    a successful join uses the existing shared signal change to insert the returned
    card into Pending and remove it from Explore without a full list reload.
    Member counts, corresponding menu/sidebar attention and subsequent approval
    converge through the same store and polling flow.

## 5. Workspace selection and profile loading

11. Select the group in the header. Cross-role header geometry is checked in
    block 27.3 after the required role fixtures are available.
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
   corresponding group menu items, card three-dot, Hosting/Active groups/Pending groups/Invitations dropdown,
   workspace dropdown and sidebar aggregate. Preserve visibility rules: a member
   sees changes they may access, never the administrator's moderation queue.
   The card three-dot counter sums only its contained menu counters (currently
   administrator moderation), not the full group-profile total. Accessible member
   badges sum pending decisions and unread member changes once. Hidden roster
   badges have no red counter for non-administrators. The workspace selector owns
   the full accessible group-profile aggregate, including events and other menus.
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
5. Hosting, Active groups, Pending groups and Invitations: verify their menu items
   and selected dropdown trigger. Categories appear only in the separate Explore popup. Each sums relevant
   operations, including pending interactions. Explore has no red counter on
   its action or categories, even while Hosting/Active groups/Pending groups/Invitations have changes.
6. The workspace selector shows the complete attention count of this user's
   profile in each accepted group, including its accessible activity, impressions,
   member changes and administrator-only moderation. Main profile owns account
   tools/contact counts; those counts are not repeated on every group. The avatar
   aggregates Main and all group-profile changes once. Nested totals must not be
   counted twice: event.all already contains its invitation/hosting counts.
   Groups also includes unresolved invitations to not-yet-selectable workspaces;
   its total is not necessarily equal to the workspace selector total. Verify the
   actual profile counters, not a fixed 2-versus-3 fixture example. While a group
   is active, Main counts keep updating through the existing realtime response
   and stale-response guard, without an additional polling request.
7. Read one member-change notification. Only that recipient's corresponding
   Members/card/dropdown/sidebar counts decrease in place. Reading it again
   does not decrement again; an unread change for another member/group remains.
   Pending membership decisions remain counted until resolved, independently
   of whether their notification was read. A retained profile from an earlier
   membership cannot put private activity badges on an Explore card.
8. Compare normal writes with a fresh local/Mongo seed and upgraded retained
   storage. Pending counters are stored on the group and updated by the actual
   transition delta, following Activity Event; neither reads nor ordinary writes
   rebuild the total from child collections. During concurrent membership and notification
   updates, neither write erases the other's state. Retry does not duplicate
   the notification. Confirm local and HTTP behavior separately.

### 6.2. Moderation and support lifecycle

13. Report a group as a non-owner. In **app-admin** content moderation, verify
    the **Group** dropdown category, preview and configured review lifecycle.
    With app moderation enabled, group creation follows that configuration;
    with it disabled, no review hold is added. Check the group card's status
    badge at the **bottom left of the image frame** in each applicable state.
    Record the deployment's actual settings and restore them afterward.
    Open a Group preview: it uses the shared read-only Group editor and exposes
    the full description, cover, category, visibility, member-list setting,
    required profile fields and textual policies. Nested policy views remain
    accessible, with no editable field or save action.
14. As an accepted **group administrator**, open Moderation from the group
    card menu. The same moderation popup exposes this group's Asset/Event/Feed
    content and its own settings; **Group** is absent from its categories.
    Submit pending content, decide it, and repeat the same command/reload.
    The item title heads the action menu; the current status is not repeated as
    a disabled action. The settings category dropdown retains its selected-value
    label and uses the shared multi-toggle sheet with an explicit Close button.
    Verify the stored moderation count, the red Moderation menu badge, the
    three-dot badge, workspace dropdown and sidebar Groups aggregate. Approval,
    rejection, unblocking and configured worker approval update the count only
    once. A decision updates the existing SmartList card and an open dropdown
    through the signal store immediately: no page reload, list restart or
    full-list detail fetch, and no scroll/filter loss. A late older poll must
    not restore the old count. An ordinary member sees no admin queue count.
    In app-admin and group moderation, open a multi-image Photo Feed item. Its
    preview uses the same editor layout in read-only mode: every stored image
    can be selected, and each image's Event, organizer, location and caption can
    be read in Image details. No upload, replacement, removal, metadata change
    or save is available. Event and Asset previews continue to use their own
    existing read-only editors; do not substitute a thumbnail-only preview.
15. Reject/block group content with a message. Confirm one **Group support**
    conversation between the group's profiles, with its own channel filter
    and unread counter. Reading and replying update that counter and the
    ordinary Chats total. The app-admin Support queue, App support filter and
    base-profile support counter remain unchanged. Retry delivery: no second
    message or unread increment. Check the new HU/EN labels after reload.

## 7. Leave and remove membership

16. Leave the test group. Its card moves from Active groups to Trash and its
    workspace becomes unavailable. Trash uses the Activity Event delete icon,
    danger menu palette and deleted card tone; it adds no change-count badge.
    Restore a voluntary departure: after persisted success the membership is
    accepted again without approval, the card leaves Trash and the workspace
    returns. A failed save retains the dialog and unchanged card; while saving,
    the confirmation remains busy. No reload is needed for mutation updates.
17. An administrator removes the same ordinary member: its status is blocked
    and the group appears in that member's Trash. Restore now submits a pending
    join request requiring administrator approval. The confirmation explains
    this distinction. The recipient cannot self-approve or turn the blocked
    membership into a voluntary departure to bypass approval. Retry must not
    duplicate the request or notifications. Approve through the administrator's
    member card and verify the retained member/group lists and workspace choices.
18. Independently check persisted state and ordinary reload. An owner cannot be
    removed through an ordinary member action. Last-member group deletion,
    voluntary creator departure, restored administrator responsibility and
    handover remain in block 26.
    Restore fixture data only from the checkpoint's exact snapshots.

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

1. Open Share from a group/event card. There is one sharing entry, with
   the common share icon and contextual teal color. It opens the **external
   link popup**, not the former raw-token confirmation dialog or a second
   legacy copy menu. Compare its read-only link field, Copy icon, dimensions,
   spacing and copied checkmark directly with Profile → Affiliate, in HU/EN
   and on desktop/mobile. Copy and reopen the complete URL, not a raw token.
   Asset cards have no external Share-link menu entry; Assets are selected
   with checkmarks and shared inside chat through the existing basket flow.
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
4. For an event belonging to a group, the external invitation also establishes
   group membership and one group profile, then selects that workspace so the
   event is accessible. Replaying the link must not duplicate either membership
   or profile. A Main-profile event must not create group membership. Preserve
   the removed/blocked-member approval rule from block 7.

## 9. Chat sharing basket and message changes

4. In an open chat, choose Share event, then Share asset separately. These open
   the card selection surface. Check the usual basket count/list, removable
   basket items, and the confirmation tick beside Close. The card selector sits at the image
   bottom-right, above the three-dot button, and stays circular at wide and tall image ratios;
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
    has no fabricated booking link. The payer can Request refund on an active
    cash receipt; the recipient can approve it through the existing confirmation
    flow. Verify pending/approved history, notifications and totals for both
    parties, with no affiliate contribution. A deleted receipt cannot request
    another refund.
11. On a manually recorded cash receipt, the recording recipient's item menu
    offers the standard red Delete action and a confirmation dialog with a matching red confirm button. Cancel leaves the
    receipt and totals unchanged. During deletion the confirmation waits for
    persistence; failure retains the dialog with an error and the existing row.
    After success, retain the receipt with a Deleted badge and no further Delete
    menu action; reverse its income/expense totals for both parties without
    reloading the list. Reopen both histories to verify
    persistence. Repeating deletion must not reverse totals twice; replaying
    the original create request must not resurrect the deleted receipt. The
    payer and unrelated users cannot delete another member's recorded receipt;
    ordinary checkout payments do not expose this manual-receipt Delete action.

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
    the inviting user's saved contacts with approved chat access**, excluding people already in this chat.
    Request, pending and rejected contacts must not appear in the invitation picker;
    direct commands must reject them before writing any member or owner copy,
    including a batch containing both approved and unapproved contacts.
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
5. **Children (UI note 9).** Check Nincs/Van and No children/Has children in registration, the editor, profile
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

1. Open the side-menu Help in HU and EN. Check all 17 topics, readability and
   coverage of existing features. AI integration is the second topic. This is
   separate from the setup-permissions help above.
2. Compare the canonical frontend-local and prod/dev/demo/e2e seed sources.
   Check fresh initialization and the supported update/import path in the
   local/dev/e2e test environments. Both languages use common help revision v3. Keep local and HTTP
   execution results separate.
3. Check that anonymous MCP reads the active HU/EN help and that private MCP
   discovery identifies the key's actual profile/group and authorized operations.
   Group keys must not advertise asset creation. Discovery must not probe write
   operations.

Prepare the required identities, profile/group boundaries and UI-created keys
inside this testcase's own versioned checkpoint. Record this run's help and
discovery responses. Earlier runs or other testcases do not supply a PASS.

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

## 19. First location save and demo admission

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

### 19.2. Demo admission and pending coordinates — NOT RUN

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

- In demo mode, verify pending-coordinate retry after a failed full profile load,
  account isolation. A failed request retains pending; the next authoritative
  success clears the sent sample.
  A different account must never send or clear that sample.


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

### 25.3. Application confirmation wording — NOT RUN

1. Review action confirmations in Group/Event/Asset membership and lifecycle,
   checkout/refunds, contacts/following, moderation/support, account actions,
   editor deletion, integration keys and AI connections. The title asks a clear
   question describing the action; the action button keeps its short verb.
2. Check Hungarian and English, including dynamic names/revision numbers,
   narrow mobile wrapping, cancellation and the existing menu/button palette.
   Informational notices, payment summaries and forms keep their own headings.
3. Source audit and focused unit checks are recorded separately from execution
   of every dialog. These checks do not reopen any closed PASS case.

## 26. Group administrators, responsibility transfer and last-member deletion

Use the existing Asset Manager lifecycle as the reference, with group-scoped
Admin roles. Its closed evidence is not evidence for this Group block. Prepare
isolated creator A, accepted members B/C/D and a pending/outsider control; record
each promotion's granting account. Run local and dev HTTP independently. Capture
replayable fixture savepoints between the independent branches below.

1. As A, promote B; as B, promote C. Cancel each confirmation first, then confirm.
   Persist both the Admin role and who granted it. Role changes update the open
   roster, card actions, Hosting/Active lists, workspace authority and contextual
   counters through the existing shared stores. Reload retains those results.
2. B may revoke C's Admin role because B granted it; A may revoke B's because A
   granted it. A cannot revoke C's grant and C cannot revoke B's. Verify both menu
   visibility and direct HTTP denial, with unchanged persisted roles/counters on
   denial. Revocation returns the target to Member without removing membership
   or the workspace profile. Revoking an Admin must not silently revoke grants
   that Admin previously made to others. A pending member or outsider cannot
   promote or revoke anyone. Retrying a completed change produces no duplicate
   notification or counter delta.
3. Restore the branch baseline. Let the creator voluntarily leave while other
   accepted Admins remain. Follow the Asset owner-release/Take Over flow: former
   creator authority ends, the group remains available for handover, and the
   takeover invitation goes to the existing eligible Admins, not ordinary
   members. Cancel then confirm takeover as an eligible Admin. Verify the new
   responsible Admin, persisted authority, and rejection of a competing/repeated
   takeover. A creator's historical identity must not retain admin privileges.
4. Separately let the responsible Admin leave when accepted ordinary members
   remain but no other Admin exists. The existing Asset no-manager fallback is
   the reference: eligible accepted members receive the takeover invitation and
   can accept responsibility as group Admin. Pending users and outsiders cannot
   take over. The group must not continue ordinary operation without an Admin;
   check the explicit handover state and its permitted actions until acceptance.
   Apply the same invariant when stepping down or revoking the last Admin.
5. Return the former creator through the normal invitation/join flow. The account
   returns as an ordinary Member; neither its former creator status nor old
   grants restore Admin authority. Also exercise Trash Restore for a voluntary
   departure: membership returns accepted without approval, but historical Admin
   authority is not resurrected. Responsibility still follows the explicit
   takeover action where applicable. A fresh promotion follows the same grant rule.
6. In a separate isolated group, let every member leave, including the last
   remaining Admin/member. Confirm automatic group deletion. Without reload, the
   card disappears from all open relevant lists and selectors; the selected
   deleted workspace is no longer usable and affected counters update once.
   Reload and direct API reads confirm the deletion and loss of workspace access.
   Repeating the final action or submitting Trash Restore must not resurrect the
   deleted group or repeat its effects.
7. Reuse the Asset Manager action icons and base palettes contextually: promotion
   uses `admin_panel_settings` / blue, revocation `person_remove` / warning,
   departure `logout` / danger, takeover `verified_user` / warning, and voluntary
   step-down `person` / warning. The menu, confirmation dialog and confirm button
   use the same action palette. Questions, explanatory text and buttons refer to
   this group and its Admins, not an Event or Asset. Check HU/EN and mobile.
8. Verify notifications alongside every successful promotion, revocation,
   responsibility release and takeover, using the corresponding Asset Manager
   recipient rules. Capture each actor's notification IDs and unread counters
   before and after. Admin-first and accepted-member fallback takeover branches
   must have their respective recipients only; no self-notification or unrelated
   group recipient. Open each notification through its ordinary entry: it targets
   the correct group and exposes only actions still authorized by current state.
   Compare contextual icon, palette, wording and action with the Asset equivalent.
   Cancellation/denial produces no success notification. Retry/delivery replay
   produces no duplicate notification or unread increment. Verify read/dismiss,
   group-profile/selector/avatar badge propagation and persistence after reload.
   The avatar aggregate counts each change once. Restore only fixture-owned
   records after capturing mutation, notification and reload evidence.

## 27. Group editor and roster presentation across roles

Prerequisite: creation/policy (blocks 2–3), accepted/pending membership (block 4)
and Admin-role controls (block 26). Reuse their closest savepoint instead of
recreating their lifecycle. Existing observations may satisfy individual checks;
close this block only after its complete role/viewport matrix is proven.

### 27.1. Roster visibility (former block 2, step 4)

1. Toggle **Taglista látható** and compare organizer, accepted-member and
   unrelated-account roster views. The toggle aligns with the description's
   right edge and its state survives reload. Category and toggle share the row
   when both fit, wrapping only at narrower widths. A hidden member list uses
   the existing Event Explore disabled badge and crossed-out eye; its member
   badge has no red counter for non-administrators. The administrator retains
   access and pending-member counter. The card actions contain no duplicate
   Members entry; the member badge is the entry point. Own invitation acceptance
   remains available from the invitation card, including with a hidden roster.

### 27.2. Policy editor presentation (former block 3, steps 5–8)

- Profile visibility rules stack sections vertically. Optional fields use equal
  two-column controls with labels left and switches right; Base mandatory fields
  are absent. Check desktop size, mobile full screen, scrolling and no opening jump.
- Reopened selected-field tables use bold first-column labels and pale row colors
  corresponding to their toggles. Read-only viewing remains legible.
- Required Profile Fields / Kötelező profilmezők uses the profile-badge heading
  icon; its picker label remains visible on mobile. Group Policies retains the
  shared Event Policy editor and purple palette. Open Policy Setup is left-aligned
  at content width. Member list visible shares the category row when both fit,
  wrapping only when they no longer fit.

### 27.3. Workspace header across roles (former block 5, step 11)

Long names truncate only the label; the monogram remains circular and fully
visible. Base-profile globe and group choices use their contextual colors.
Verify avatar/name/location spacing below the toolbar and spacing between body
menu sections; smoke normal, admin and operator layouts where exposed.

## 28. Group detail loading and adapter request boundaries

Prerequisite: the saved editor/policy state from blocks 2–3; repeat the corresponding
request checks during the separately counted Local pass. This preserves former block 3 step 8.
List summaries omit description/policy. View/Edit loads the detail on opening.
Opening the nested rules editor performs no additional detail request. Local
uses its configured route delay; HTTP adds no artificial client delay. Capture
normal network records independently from the saved-field persistence evidence.

## 29. Cross-surface distance and mutation ordering

Prerequisite: list reads (block 1), creation and membership writes (blocks 2–4),
and controlled Activity/Event data. This retains the write-driven assertions
formerly interleaved into block 1. Activity distance views and Event Explore use
the same inclusive lower distance bands as Groups. Repeat the listed 0/3.2/4.999/
5/5.1/9.999/10 km boundaries there. A successful Group mutation updates Recent
ordering in place through the shared store; list sync preserves the same order.
Retrying a completed operation does not make it recent again. Keep sort/filter
and scroll state while verifying these updates.
