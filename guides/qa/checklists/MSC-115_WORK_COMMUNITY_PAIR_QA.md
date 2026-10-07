# MSC-115 Work and Community — pair-QA checklist

Status: **Manual campaign NOT RUN**. Focused implementation checks are recorded at the end; they do not mark the manual campaign passed. Automated evidence is recorded separately in the implementation plan. These are user-controlled browser checks; preparing this document does not start or authorize browser automation.

Run the applicable scenarios in frontend local and backend/HTTP modes. Use the versioned checkpoint launcher and a deliberately prepared fixture before execution. No live fixture was changed while writing this checklist. Names below identify canonical demo actors; select their relevant workspace profiles.

For notification checks, compare sender and recipients, unread/menu/base-selector counters, open destination and retry behavior. Automatic reminders include their affected creator; human actions exclude their actor.

## MSC115-LANDING — Shared landing and demo selection

Actors: Public visitor; Alex Turner; Ava.

1. Open the normal entry URL: Dating is selected. Switch to Work and Community using the existing header AppMenu at desktop and mobile width.
2. Check the unchanged page structure and MyScoutee logo; check mode-specific heading, slideshow (including the fourth explanation image), articles, footer and guide step. Follow-us links are the same in all three modes, including a fresh local landing before opening the demo picker. This public load creates no demo users or operator record; saved operator overrides, including an empty social-link list, remain authoritative. Returning to a mode reuses its loaded content.
3. Open the demo picker for each mode. Confirm membership-based availability, including people who belong to more than one base group. Cards show normal name/profile metadata without overlapping group labels, and rows align at the top. Login still resolves the account/profile through the existing flow.
4. Check UK in supported areas. Seeded users have plausible covered-area coordinates; only the designated location-prompt demo actors request location.


### 2026-10-06 landing and authentication additions

5. Work and Community each have four complete articles in EN/HU (eight topics, sixteen translations), each with a distinct image and six explanatory sections. Dating content remains unchanged. Follow Read more and verify the full text and image, not only the excerpt. Every article title reserves exactly two lines, including a one-line title: dates and descriptions start at the same baseline within each row. Compare all card footer buttons at desktop and narrow widths: they share one baseline within each row. The October 7 mobile header retains the localized mode label, icon and dropdown arrow on one line; the Hungarian login action uses “Belépés”. This supersedes the October 6 icon-only expectation recorded below.
6. Community uses a green/teal hero and a multicolor login gradient. Check Dating and Work retain their own themes. The follow-us footer displays the configured social icons; simulate an initial configuration request failure using the existing external network tooling, restore connectivity and verify the ordinary retry restores the links.
7. Accept the current website privacy policy once. Switch landing modes and authenticated groups: the same policy is not requested again. A genuinely new policy revision still requires acceptance. An identical legacy Work/Community v1 acceptance remains valid.
8. Login and logout through their normal controls with delayed destination loading: one successful route transition each, no return to the previous page, no blank intermediate shell, no raw translation keys, no duplicated confirmation/demo popup or restarting ring. Repeat successful login, cancellation, failed login/retry, and member/admin navigation. Record a route trace and screenshots/video; source checks alone are not visual evidence.
9. After member and app-admin login, check the workspace button and its menu: Dating/Work/Community use the landing's localized name, icon and color, rather than “Main profile”/“Alapprofil” or an arbitrary private-group palette. Check notification scope uses the same names. Private workspaces retain their own name, initials, assigned color and counters; admin visibility rules stay unchanged.
10. In Groups and Explore, dedicated main groups present in the active filter have their localized main-group name, matching icon/color and “Main group”/“Főcsoport” marker. They appear once at the beginning of the **entire filtered result**, with ordering applied before pagination. Check distance and latest-update sorts, category filters, live refresh and desktop/mobile paging through all subsequent pages: no repeated main-group block, missing private group or duplicate card. A filtered-out main group must not be reinserted. Dating is the account profile, not an invented extra group record.

Focused October 7 evidence: [main-group identity and global pagination](../evidence/work-community/MAIN-GROUPS-20261007.md). Manual visual checks remain NOT RUN.

### Granular rating domain oracle

| Evaluated card | Criterion set |
| --- | --- |
| Dating person | attraction, personality, interests, values |
| Dating pair | chemistry, interests, values, compatibility |
| Campaign | relevance, appeal, clarity, collaboration |
| Work person | fit, interests, communication, collaboration |
| Service discovery interest | relevance, clarity, confidence, value |
| Completed service feedback | quality, reliability, communication, value |

Open the detailed rating from each actual card and check its domain, labels in EN/HU, stored mean and reopened criterion values. Changing the global workspace must not select another card’s criterion set. An aggregate average has no invented granular breakdown. Single scalar ratings remain valid. Reopen a campaign after rating and verify the saved criterion snapshot, including after a reload.

## MSC115-INVITE — Shared links, workspace registration and promotion

Actors: Group manager; signed-out invitee.

1. Create a Work private-group invite and a Community private-group invite using the existing invite action. Open each link in a clean prepared session.
2. Check the relevant landing mode, then register/claim. Verify membership in the invited workspace and its base group, with the correct active profile.
3. Switch to a Dating group from a Community account: its Dating behavior remains independent. Check joining an available base group is explicit and does not require approval. Promotional cards remain a later refinement.

## MSC115-ADMIN — App-admin scope and aggregate badges

Actors: Ava; a second admin profile if needed.

1. Switch Dating → Work → Community above the avatar. The menu structure stays consistent and all opened surfaces use the selected base group.
2. Compare the selector red count with the existing menu counters; inspect moderation, reports, feedback, chat, content/articles, parameters, stats, metrics and graph in each scope.
3. Change a scoped content item or parameter and return to another base group: its data is unchanged. A report retains the actor/action/event and optional group context without granting private-workspace membership.
4. Open payment test tools from each scope and inspect their existing authorization link/context. Operator remains deployment-wide.

## MSC115-JOBS — Per-base-group job ownership and execution

Actors: Ava.

1. Open Jobs in every base group. Confirm independent seeded definitions, enabled state, timing and run history.
2. Run an available scoped job and inspect only that scope’s results, progress, counters and history. Do not enable absent/inapplicable random-room jobs in Work or Community.
3. Inspect Community scheduled-case and vote-close jobs. Confirm shared notification/exchange/processing definitions have separate group items and that an unseeded job does not execute for that group.

## MSC115-WORK-CAMPAIGN — Campaign authoring and discovery

Actors: Work member as organizer; another Work member as participant.

1. Open Campaigns next to Groups; create a draft through + with title, description, opportunity type, category, images and optional documents. Select multiple documents; verify the comma-separated filename field, removal and saved download table.
2. Save, reopen, publish, edit, unpublish, trash and restore using existing FormFlow/SmartList patterns. Observe write results without a full unrelated list reload.
3. In the Campaign management list, verify category-colored image cards with aligned category/status chips and working three-dot actions. The published-only picker keeps +/check at the upper right and has no status chip or three-dot menu. Neither list has a search field.
4. Check the compact Work Home image card with its category badge at the upper left, without a status badge or three-dot menu. The eye opens Details by default; the header app-menu switches between read-only campaign details/documents and the existing Organizer profile. Discovery uses the direct opportunity/category selectors; private drafts stay private. Check the shared Dating-style frame, loading, paging and full-height empty state.

## MSC115-WORK-RATING — Person ratings with optional Campaign context

Actors: Two Work members; one author with two campaigns. The author’s own campaign management menu contains no Author profile action.

1. Rate two campaigns of the same author. Inspect the Ratings list: it displays people, with aggregate person rating when no Campaign filter is selected. Open the person from Ratings: the header starts at Details and switches to Organizer using the same blue/violet app-menu. Details shows campaign history for this pair (including other campaigns while a Campaign filter is selected), one block per visible campaign, grouped and ordered by the latest recorded rating/chat interaction date. Reuse the pageable SmartList/accordion pattern: load five at a time; expand read-only details, gallery and documents in place. Switching to Organizer and back preserves the loaded list and expanded blocks. No campaign interaction shows an explicit empty state; a failed request shows an error with retry.
2. The Activities/Ratings popup has no Campaign selector. From an owned campaign’s three-dot menu choose Ratings: this opens the same popup scoped to that campaign. Its subtitle puts the campaign title above the rating direction. Open ordinary Ratings from Home/sidebar: the campaign scope is cleared. The campaign picker remains available in the Event editor. With two ratings 8 and 9 for the same person, ordinary Ratings shows 8.5; the campaign-specific views show 8 and 9. Revise one context to 10: the average becomes 9.5. A missing context contributes no zero. Inspect the write-side summary rather than re-aggregating every list request.
3. Revise one rating. Check the corresponding write and aggregate query, including the opposite participant view. An unchanged retry must not create another notification.
4. Use an unfiltered event for aggregate sympathy selection and a Campaign-selected event for campaign-specific selection; do not create horizontal channels or fake campaign events.

## MSC115-WORK-CHAT — Campaign questions and event group chat

Actors: Campaign organizer and positively rating participant.

1. Before a saved positive rating, verify the Campaign question action requires rating first. Rate, then open campaign Details through the Home eye or a campaign block in the aggregated Ratings history and choose Ask the organizer.
2. Check the independent Campaign chat bucket, correct organizer, recipient-only new-message notification and unread badge. Reopening/retrying does not duplicate the chat or message.
3. Create the corresponding real event: its group conversation uses the existing event chat owner and is separate from the direct Campaign question.

## MSC115-WORK-EVENT — Campaign-scoped invitation, capacity and related filters

Actors: Work event organizer and candidates.

1. Create an event and select a Campaign through the existing selector-style control. Check the event’s own capacity and priority-based invitation behavior; selecting a campaign must not overwrite event capacity.
2. Open Events, select a Campaign filter and verify its title/subtitle, paging and displayed events. Clear the filter to return to all events.
3. Check the Campaign filter in event feedback. Campaign chats use their own bucket; a whole-chat-list Campaign filter is deferred. Verify event creation, invitation, acceptance/removal and feedback notifications reach other affected participants only.
4. Check that the scheduled random event generator does not create Work rooms.

## MSC115-CAMPAIGN-API — Campaign create through existing API/MCP architecture

Actors: Authorized Work member API/MCP identity.

1. Use the existing integration authorization in the Work profile and create a Campaign with the supported create capability.
2. Check it appears as the same model in Campaigns and respects actor/group ownership. A different group identity must not create or modify it on behalf of the owner.
3. For this checkpoint, verify the existing draft-create capability and unchanged event/group create calls. The later requested Blocked / Write / Full permission expansion and read capabilities have a separate queued checkpoint; do not report those as already implemented.

## MSC115-SERVICE — Community service sheet and priority discovery

Actors: Anna as provider; Alex as customer; another eligible staff member.

1. In base Community open the service photo-card Home. Reload with the Community profile active: the startup header shows no provisional Dating/Filters buttons; category and Ratings appear only after the active profile is ready. Its header has category and Ratings controls; neither Your services nor the provisional Filters/distance popup is present. Check category selection and location ordering. The card uses the service's own images, name and short description; its eye opens the provider profile. The top-left category badge matches the category menu. Empty results, loading, paging and mobile height use the shared Dating frame and SmartList.
2. Open My services from the sidebar Community block. Create/edit/publish/draft/trash/restore a sheet. The existing gallery is left and name, short description (120 characters) and category are right in view/edit modes. On desktop the gallery height follows the right-hand form block; mobile uses the existing event-gallery height rule. Images keep their proportions. Verify native pointer focus and typing. A separate shared FormFlow staff block shows every selected person as a compact inline name pill; pills wrap and open profiles without changing selection. Its + opens the existing preselected member picker; its header tick commits changes, including unassignment. The read-only service sheet keeps the visible list and hides +. The block keeps its header +; each name uses the existing task-assignee pill pattern. No generic radius, availability, slot or pricing fields remain. Check contextual list cards/menus and the provider calendar for agreed task dates.
3. Rate the provider through a service. Multiple services from that provider use the existing person priority. Publishing a sheet alone sends no unsolicited notification.
4. Confirm a draft, deleted/inactive provider or another person’s private image is not exposed through discovery.

## MSC115-CASE — Shared Cases lifecycle and member access

Actors: Alex; Maya; external provider Anna.

1. In a concrete community, create a case from Cases +. The active group supplies the community; there is no group selector. Name and case type share a row, description follows. A new manual case starts with no affected members selected and can be saved that way; its creator is the accepted case admin. The affected-member block shows compact inline name pills and a +. The existing member picker header has a labelled All switch; the checkmark confirms selected members or clears them. Keep the aggregate-view + condition unchanged.
2. Check daily descending InfoCard groups with one sticky header. The category badge is top-left with the existing saturated stage treatment, and the unchanged contextual status badge is top-right. The case name and category appear once; below the media, show the community and description. No affected-member count badge remains. The red case-card/Tasks counter is exactly the number of tasks, independent of unread attention; zero has no badge. Open members through the case card menu. Inspect status/type item totals and the aggregate Cases badge. Opening a case leaves these counts unchanged; create/status/trash/reopen changes the appropriate counts. The sidebar sums visible non-trash cases.
3. Open the same case as another affected member and as a manager of multiple communities; both are read-only unless they are this case's admin. Unrelated members cannot read it.
4. As this case's admin, check lifecycle-appropriate three-dot actions: Start only while open; complete/cancel while active; reopen after completion/cancellation/deletion; no duplicate delete on deleted cases. Edit/close/reopen using these supported actions. Check targeted list/counter updates and notifications to affected others; the human actor receives none.

5. A manual case creator immediately has accepted membership and the Admin role. A group-admin role alone does not grant administration of another user's case. Only the case admin edits the case and tasks. When that admin leaves, the case loses its admin, remaining participants receive the owner-left notification, and Take over case becomes available. After takeover, verify persisted ownership and loss of edit controls for everyone else. If the final remaining participant leaves, the case goes to Trash. Pending invitations keep the case available; declining the final pending invitation also empties/trashes it.
6. Any mutation error appears once in the active popup's red contextual notice directly below the header, above the form. Permission/stale-version errors have specific translations. Enter agreed dates through the actual shared DateInput and save/reopen; local input times must reach the API as absolute ISO timestamps.

## MSC115-CASE-PROVIDER — Recommendations, provider invitations and quotations

Actors: Community member; manager; external provider.

1. In the case chat, use + → Recommend provider to select a published service/provider. In the provider picker, + toggles to a checkmark; choosing another replaces the selection. Inspect/remove through the header basket; confirm applies and closing cancels. The chat receives the existing event/asset-style attachment card showing that service’s own image, name and description. As case admin, open its message menu and invite that exact provider directly; do not search for the provider again. Ordinary members have no Invite action; after invitation it disappears. View opens the service sheet.
2. As provider see the shared case in aggregate Community Cases and accept/decline. In Quotations, the header avatar pill and > open a service-card list using the same cards as Community Home. A provider's + is below Close in the header toolbar. Submit using the same grouped FormFlow as asset/event: price/currency/proposal, work policy and refund policy. Describe possible start time as free text; no dedicated availability dates or upfront service pricing.
3. As a customer member inspect quotations as simple rows with right-hand three-dot menus; the status badge is at the right edge above the menu, with no separate Joined provider row. All accepted case members can inspect quotations. View opens the same read-only sheet without Save/Edit. Work/refund policy blocks show their full inline text without a redundant View policies button; the existing policy editor remains available during editing. Only the case admin edits a saved quotation or changes its status. Pending, Accepted and Rejected are reversible through the menu and have their own filter buckets.
4. From a quotation's Conversation action, open its own group chat with the residents and that quotation's provider. It is a distinct conversation in the existing Chats → Cases filter and All list, with stable identity across reopening. It is neither a private pair chat nor the main case chat. Other providers cannot enter competing quotation discussions.
5. Check invitation/response/offer/decision notifications and their correct case destination. Repeating a provider invitation must preserve an accepted assignment.
6. An external provider must not gain private-group navigation or announcement access. A declined invitation retains permitted case history but removes live case-chat access.

## MSC115-CASE-CHAT — Shared case channel and permission changes

Actors: Manager; affected resident; invited provider.

1. Open the main case chat and the quotation group chat from permitted actors and inspect the existing Cases bucket and All list. Both use the distinct Cases base color; all other channel colors and filtering remain unchanged. Invitation to the main case chat remains optional, separate from quotation discussion. Providers retain normal +/poll/sharing/chat actions. Send a message; only other current chat participants get notification/unread increments.
2. Mark read and reopen. Existing messages and other members’ unread counts survive case membership synchronization.
3. Decline/remove the provider and check both HTTP and an already-open websocket against current case access. No private group membership is created.
4. With an actor who still has access, open the case chat without opening the Cases overview first. Click **Tasks / Feladatok** in the chat header. Only that case's task board opens above the chat; no new Cases list opens beneath it. In the HTTP request trace, distinguish requests already completed by opening the chat from those caused by this click: the click loads the target case detail once and does not request the Cases list or prefetch the Scheduled tasks counter. Read the board's three columns from that detail without another list load.
5. Close the task board: return directly to the same chat, with no stranded Cases popup. Reopen Tasks and repeat. As a separate control, open the Cases overview normally and open/close its task board; the existing overview remains open in that navigation flow.
6. If the target detail request fails or access is denied, an error remains visible without opening an underlying Cases list. Close that error popup and keep the chat usable; restore the permitted request and retry through the chat's Tasks button. Record this HTTP/UI regression separately from the WebRTC media result; [CHAT-CALL-001](general/CHAT-CALL-001.md) links here for the shared header regression.

## MSC115-SCHEDULE — Scheduled task and 45-day case reminder

Actors: Personal schedule owner; group manager; affected residents.

1. From the Cases header open the labelled Scheduled tasks pill with a trailing chevron and red item counter. It opens a separate popup. Case creation stays group-gated, with + at the right of the second row, below Close. Scheduled tasks are personal from the overview; a group admin creates them in the entered group with All/selected affected members. No Kinek/group selector is shown. Ordinary members retain personal scheduling. Check the affected count, right-hand recurrence badge and passive SingleRow with a three-dot menu. The affected members and service staff use compact avatar/name pills with profile chevrons, preserving the selection when a profile opens.
2. Set Start from to a date and minute and use the existing recurrence popup. At just before the first occurrence minus 45 days, the scoped job creates nothing. At the boundary it creates one case and reminds all affected users, including an affected scheduled-task creator. A personal occurrence belongs only to its owner, who can edit it. A group occurrence invites participants and leaves the case admin unassigned. Join accepts membership but grants no edit rights. The first eligible participant using the separate Take over case menu action becomes admin; a competing stale takeover cannot overwrite that owner.
3. Rerun the same occurrence and simulate a delivery retry through the prepared test mechanism: no second case/reminder. Recurrence advances only after enqueueing.
4. Check monthly/quarterly/yearly recurrence and short-month dates. The worker advances the next occurrence while retaining Start from. Reopening or changing the description must not reset worker progress; changing Start from or recurrence recalculates the next occurrence. Asset editor has no utility scheduling fields.
5. Active/Suspended/Deleted buckets have live red item counters. Suspend/resume, delete/restore use the three-dot menu; the form contains no raw Active boolean field. Paused/deleted schedules are excluded from worker execution. The owner/group admin can edit; affected ordinary members have View only. Bucket totals and the Cases header badge update immediately; schedules add no separate count to the sidebar. Reload retains the same state and counters.
6. Suspend and Delete open the existing confirmation dialog. The confirm button matches the menu action (amber for Suspend, danger/red for Delete); cancelling makes no mutation. A failed list request reports a loading failure in a compact inline alert without covering the list. Retry clears that error on success. It must not claim that an unsaved modification failed.

Engineering evidence, 2026-10-06 (manual browser steps remain with the user): existing Angular/Java watchers compiled the changes. Compiled-output checks `check-form-flow-input.mjs`, `check-work-community-reactivity.mjs`, `check-community-case-board.mjs`, and `check-community-schedules.mjs` covered component wiring, avatar pills, existing event recurrence controls, local persistence/ownership, worker boundaries and live counters. Read-only authenticated HTTP GETs for active/paused/trash returned 200 with totals 1/0/0 and matching shared context after correcting the aggregation projection to the existing typed-bucket pattern. No HTTP lifecycle mutation was performed.

## MSC115-CASE-BOARD — Task board, assignments and agreed dates

Actors: Evan Reed (viewer); Alex Turner (seeded case admin); Maya Stone; Farkas Anna.

1. View Joint meter replacement. The board uses a native horizontal SmartList: one column at 375 px, three on desktop. Swipe both directions on a task and on empty column space. Status headers are compact contextual TextCards with vertically centered icon/label.
2. For the case admin, only the common + and Close controls are in the header. A normal member has only Close and can view every task without mutation actions. The task three-dot menu shows View and read-only Members to normal members; Edit, assignment, Start/Complete/Reopen and Delete are admin-only. Direct local/HTTP mutation by a non-admin must also fail. No case description or unrelated action toolbar appears in the body. + opens a task editor with functional name/description and the shared event/asset date-range block for optional agreed start/end. There is no status selector in the editor. Assignees and Preceding tasks each have a separate shared FormFlow block with the complete selected list and their own + picker action for the admin. Assignees are inline name pills with a profile-opening chevron; opening the profile does not select/highlight the pill or change the form value. No city is shown. A separate Quotations block supports multiple accepted quotations as subactivities. It uses the same TextCard summaries as Slots, in the existing three-column SmartList (responsive on mobile), with description, a passive price badge at the upper right and the three-dot menu below. The name and description start at the top beside the price; no empty badge row or fixed 128 px minimum remains. Task form order is Assignees, Name/Description, Date, Quotations, Preceding tasks. Card menus use the shared list overlay: they may extend vertically outside the block/popup within screen bounds, while horizontal positioning stays within the popup. The provider/menu heading remains outside the scrolling action list. View opens the complete terms sheet; only the admin sees Remove, which detaches from the task draft without deleting the quotation. Confirm/save persists the selection. Pending/rejected quotations cannot be assigned in either adapter. The board task displays the sum of all assigned parts, grouped by currency without conversion. The earlier compact toolbar buttons are superseded. Read-only task views keep both lists visible and hide +. At the end of the native horizontal mobile scroll, the final column retains its full right border and end gutter.
3. Task cards use the existing slot TextCard and three-dot menu. After browser reload, already assigned people are checked and present in the basket. Clear one or all assignments and save with the header tick; reopen/reload and confirm removal. Repeat this shared-picker check for service staff and other assignment callers. Inspect member assignment via the shared basket, existing prerequisites and the distinct complete date subtitle. The prerequisite summary appears as a separate text block below the description, with a small gap on every task card; the two blocks have independent line clamping. Update an existing task and verify its column, members and details reconcile without reloading the list. Reopen and verify persistence. Adding/deleting a task updates the case-card/View task count immediately via the existing store/SmartList patch, without resetting scroll or reloading the list. Assignment changes use existing case notifications for affected others, excluding the actor.
4. Progress the task using its three-dot menu: To do → Start → In progress → Complete → Done; Reopen returns it to To do. Saving ordinary task fields preserves its status. Add a prerequisite and reject a self/circular prerequisite. As case admin, delete a task from its three-dot menu in To do, In progress or Done, including after case completion. It remains in Done with Deleted/Törölt, the existing danger palette, its dates, assignees and prerequisite references preserved. The case task counter still counts that retained task. Deletion does not silently remove prerequisite references; deleted tasks no longer appear as scheduled work in the provider calendar. A regular member cannot create or edit any task, change its assignees/status or bypass deletion rights through a task save. Parallel tasks remain possible. Tasks share the case chat and have no separate channels.
5. Open Quotations from the case card. Evan sees Farkas Anna's accepted EUR 360 quotation with populated work/refund policies, already assigned as task work; the provider is accepted. The quote's decision badge remains visible in the quotation list. Alex can review decision actions. An external provider can add a quotation but cannot retrieve the customer quotation list. Inviting that provider to the main case chat is a separate optional action; the quotation has its own group conversation under Cases. Chat +, polls and sharing stay available.
6. Verify agreed task dates in the existing provider calendar. Service publication has no generic promise of availability or pricing.

## MSC115-ANNOUNCEMENT — Private Community Home and document editing

Actors: Private Community admin; accepted resident; outsider.

1. Open private Community Home: newest-first SingleRow announcements grouped by day replace the rating stack, with a single sticky date header. Voting replaces Ratings in the sidebar Activities block; Your services remains in the Community block.
2. As admin create a minimal draft with text and optional PDF/text/office attachments, then publish/edit/unpublish/trash/restore through three-dot actions and buckets. Select multiple files in one upload: the editor textbox shows their names separated by comma and space. Its three-dot attachment menu retains per-file removal. Save and reopen View: each attachment occupies one table row with its own download action. Removing a file and saving must also remove it from the reopened table.
3. Check member visibility and color/action distinction for voting vs ordinary announcements. Members cannot publish directly. “Ask the group admin” opens the existing group-support chat, both from inline Home and above the Voting popup. In HTTP mode the request contains the announcement ID and needs no event/target ID. An unavailable chat produces the existing header error notice; switching workspace or closing the source while the request is pending must not reopen it.
4. Test attachment download as a current member and denied outsider/former member. Unpublished documents remain admin/owner-only; normal feedback opening sends no notification.
5. Read-only details show a normal title and complete paragraph text, without disabled inputs or a “Voting: false” row. The shared Attachments block lets the admin add documents with +, remove them and save; reopening retains downloadable files. Members have download actions only.
6. Residents see no Published selector or empty toolbar on Home or the Voting popup. Admins retain Published/Draft/Trash. Item timestamps follow the app language and include hours and minutes.

## MSC115-VOTING — Member voting rights and final votes

Actors: Group admin; two eligible members; member without a voting right.

1. In the group Members list grant/revoke voting rights on accepted members through the three-dot menu. Both actions require confirmation matching the menu palette; cancellation changes nothing. The localized violet Voter badge appears immediately, survives reload, and disappears after revocation. Other membership roles remain visible. Ordinary members cannot manage these rights.
2. Each eligible member may cast one final vote per published open vote. A grant applies to already-open votes; revocation prevents new votes but preserves existing ballots. Regrant and deadline extension do not permit replacement votes. There is no apartment/unit/weight form or button.
3. View opens description and attachments. Vote and Results are mutually exclusive actions opening the same grouped popup. Results appear after deadline or explicit closure and count one vote per member, without exposing other members' choices. List cards and badges remain passive. Unpublish, Delete, Close voting and final vote submission require confirmation with the corresponding action palette.
4. Extend the deadline to reopen while retaining prior ballots. The Community-only job closes due votes once and notifies participants; casting notifies other managers.
5. Sidebar Voting filters voting items before paging and totals; Home retains notices and votes. Creating from Voting enables voting initially.
6. The canonical Park Court fixture gives Alex Turner and Evan Reed member voting rights; Maya Stone has none. `park-meter-vote` remains open until 2026-11-01 18:00 UTC, and `park-meter-notice` remains separate. Local and demo/e2e fixtures share these member flags.

Focused announcement evidence (2026-10-06): reproduced the HTTP no-request failure before fixing its context guard. `check-announcement-chat.mjs` passed HTTP dispatch/session/error/stale-response checks plus vote filtering, canonical Evan voting right, repository save/reload/clear and document-byte loading. `check-form-flow-input.mjs` passed the rendered prose, voting toggle, upload/save/reopen/download actions, separated details/voting blocks and deadline-gated results; `check-work-community-reactivity.mjs` passed mutually exclusive Vote/Results routing, member/admin controls and EN/HU minute timestamps. Existing frontend/backend watchers compiled; Mongo seed watcher imported the five canonical announcements. Live multi-actor browser execution and HTTP document-upload/access checks remain **NOT RUN**.

## MSC115-PAYMENT — Group-scoped history, member basket and manual transfer

Actors: Two members in each of Dating, Work and Community.

1. Open Payment history. The member control and expense/income totals share the second header row. The member button shows its avatar/count when selected and ends with a chevron; no selection shows All. Select one member with +, then confirm an empty basket to return to All. Check paging and both directions.
2. Record cash received and bank transfer received from another member with amount/currency/note. Cash/transfer menu items and selected trigger use contextual icons/colors. Check matching historical entries, contextual method badge and payer-only notification.
3. Retry the same save; check one receipt. Delete or request/approve a permitted manual refund and verify both histories/counters. No provider gateway is invoked for manual cash/transfer.
4. Switch profile/group and verify filter/context isolation. Global profile totals are not replaced by the selected member subtotal. Alex’s local demo cards/payments match canonical demo amounts/dates and real counterparties.

## MSC115-MIXING — Priority-off Mingle and Tournament

Actors: Private Community manager; participants; Dating comparison group.

1. Create/operate Mingle or a Tournament in a private Community workspace using the existing controls.
2. Check participant-only random mixing without affinity weighting, retained capacity/history rules and no automatic random-room scheduler for the Community base mode.
3. As a participating manager start/advance manually: no own-action notification. Automatic phase changes notify affected participants. Compare the unchanged priority behavior in a Dating workspace.

## MSC115-GUIDES — Context guides and shared-surface continuity

Actors: Member and app admin; English and Hungarian.

1. Open the guide at landing/Home mode switch, Campaign list/editor, service Home/list/editor/calendar, Cases/tasks/editors/appointments, private Home/Voting/rights and payment history/receipt.
2. Check the explanation targets the visible control and describes the current group’s behavior in English and Hungarian. Lazy-opened popups get their own registered context.
3. Switch modes while popups/requests are active. Check stale responses and selections do not populate another profile. Read/unread counters follow their established read actions; case/task counts follow saved lifecycle changes and do not clear on opening.
4. Execute the expanded `EXPLANATION-GUIDE-001` scope once and reference its evidence here. Its earlier PASS does not cover these additions.

## MSC115-SERVICE-LINK — Shared external link input

1. In the service editor, enter an external service URL below the description using the existing event/asset LinkInput (paste/open/remove). Save and reopen/reload; the same URL remains. Clear it, save and verify the cleared value persists.
2. In read-only service view, name/description and the link are not editable, while the existing Open link action works. The home card still shows the service's own image/name/description, not the provider's profile content.

## Focused implementation evidence — 2026-10-06

- Existing frontend AOT watcher and backend Java classes watcher: successful compilation; no second compiler, server or test build was started.
- Compiled AOT domain checks: task assignment/dependency mutation-read, cycle guards, retained soft deletion across all task statuses and completed cases, participant access, quotation policy round-trip, member submission denial, existing assignment/invitation/offer notifications, separate quotation groups in Cases/All, competing-provider isolation and leave-access revocation passed.
- Compiled shared UI checks: picker initial selection for local/server candidate sources, off-page basket, clearing all selections and committing with the header tick; quotation read-only/member/admin/provider modes; task-only counters using the existing signal/SmartList update path; the shared task date range, visible assignee/prerequisite blocks and card-menu Start/Complete/Reopen/Delete lifecycle passed.
- Latest quotation/task checks: Slots TextCard reuse, right-hand passive price badges, menu-only View/admin-only detach, three-column SmartList configuration, in-place removal, unchanged form value after opening a profile, retained bound-menu selection, accepted-only assignment and aggregate subactivity prices passed. Local and Java task validators reject non-accepted quotation IDs; local domain mutation/read check and existing backend compilation passed. The latest layout has not been visually rechecked in a live browser.
- Compiled FormFlow/Popup DOM checks: native input focus, character input, pointer default handling, single case labels, category/status badge placement, all selected service staff names, the staff block + picker and clearing its list passed. These are bounded tests against the current watch output, not a replacement manual campaign.
- Compiled Home checks: no provisional startup buttons, profile/query readiness gating, and only the resolved Community menu passed. The latest gallery-height and mobile end-gutter CSS changes compiled successfully; their live mobile/desktop visual recheck is still pending.
- Earlier isolated-browser defect evidence: 375 px Home retained a visible card; task-board columns stayed horizontal (one mobile/three desktop); real native touch gestures moved the scroll container in both directions; desktop icon/label alignment and unclipped dates were checked. The user's browser was not used.
- Manual multi-actor end-to-end execution of the updated quotation, recommendation and notification scenarios remains NOT RUN. Backend tests requiring another Java test build were not run while the existing watcher owned compilation.

## Conversation reconciliation — 2026-10-06

This is a source/targeted-check audit of the requests in this conversation, **not a completed manual campaign**. Later corrections take precedence. No push, release or unrelated channel redesign is part of this audit.

| Request family | Current implementation / evidence | Manual checkpoint |
| --- | --- | --- |
| Navigation and activity badges | Sidebar Activities selects Voting for a private Community, Ratings otherwise; My services is in Community. Cases status/type buckets carry aggregate counters. `side-menu.component.ts`, `CommunityCaseConverter`, focused AOT checks. | MSC115-LANDING, MSC115-CASE |
| Payment history and contextual controls | Counterparty and totals share one toolbar; popup-opening actions use >; receipt method choices use the existing cash/transfer palettes. `PaymentMethodsPopupComponent`, `CashReceiptPopupComponent`. | MSC115-PAYMENT |
| My services views | Own services have no category selector; category remains in the form and the picker. List/week/month selector is labelled on desktop; + is below Close. One daily sticky header, shared calendar views. `ServiceOfferingsPopupComponent`, `ServiceProviderCalendarComponent`. | MSC115-SERVICE |
| Landing and demo selection | The three modes share deployment social links; demo rows align at the top. Existing configuration/selector implementations and focused local-source check. | MSC115-LANDING |
| Home card and loading | Existing Dating frame, SingleCard and SmartList loading/paging/empty state; service-owned image/name/short description, profile eye, matching category badge. No service/filter/three-dot extras. Startup no longer paints provisional Dating controls. AOT and earlier isolated-browser checks. | MSC115-SERVICE |
| Service definition | Working text inputs, 120-character description, own gallery, shared external LinkInput. No radius, generic availability or pricing controls. Gallery follows form height with preserved image proportions. **Latest:** staff block with header + and wrapping profile-name pills, matching task assignees. | MSC115-SERVICE, MSC115-SERVICE-LINK |
| Case identity and cards | Residential group required; no Personal case. Name/category occur once, category left with stronger existing stage treatment, status right with preserved palette. Red card/Tasks count is tasks only; signal changes patch SmartList. AOT converter/DOM/patch checks. | MSC115-CASE |
| Case participation | Join/decline, leave, admin invitation/removal use existing member flows. Inviting a provider to the main case chat is optional. Provider chat +/poll/sharing controls remain available. Focused local domain checks and source audit. | MSC115-CASE, MSC115-CASE-BOARD |
| Board and task editor | Existing TextCards and native horizontal SmartList: three desktop columns, one mobile column; contextual headers, aligned icon/label, header +, no body description. Shared date range retains full date text. **Latest:** assignee/prerequisite list blocks with + supersede compact buttons. | MSC115-CASE-BOARD |
| Task lifecycle | Three-dot Start/Complete/Reopen; **latest:** admin Delete preserves a Deleted task in Done with the existing danger palette. Local mutation/read tests cover task states, completed case, references and rights; Java watcher compiled the matching backend. | MSC115-CASE-BOARD |
| Quotations | Case-card menu opens quotations; provider avatars in header, provider + below Close, shared price/work/refund blocks, no start-date input or Joined row. Right-side status badge above the menu; All/Pending/Accepted/Rejected filters. Members view read-only; the case admin edits structured policy blocks and reversibly changes status through the menu. Focused component/domain checks. | MSC115-CASE-PROVIDER |
| Quotation chat and recommendation | Each quotation has a separate group conversation inside existing Cases/All. The main case chat is separate. Only Cases gains gold; other channel palettes stay unchanged. Chat recommendations share service attachment cards; admin invites their provider directly from that message's menu. Source and focused chat/access checks. | MSC115-CASE-PROVIDER |
| Assignment restoration | Shared member picker restores persisted selections across reload/page changes and applies deselection with header tick. Service staff block/picker share one bounded editor-session member request and discard late closed-editor results. AOT checks. | MSC115-CASE-BOARD / MSC115-SERVICE |
| Notifications and demonstration data | Existing case notifications handle task changes, provider invitations and quotations. Matching local/Mongo seeds include Park Court, Farkas Anna's EUR 360 quote, policies, assigned/dependent tasks and quotation chat copies. | MSC115-CASE-BOARD, MSC115-CASE |
| Translations, help and remaining visual evidence | EN/HU sources and all three Mongo translation sets are synchronized. Help and this checklist follow the latest list-block/soft-delete decisions. Full paired manual execution and the latest gallery-height/mobile-last-column visual recheck remain **NOT RUN**. | MSC115-GUIDES |

### Latest authority and error corrections — 2026-10-06

- Manual creator = accepted case admin; automatic cases = invited participants and no admin. Join is membership only; takeover is explicit and version-checked.
- Admin-only task creation/editing/assignment/lifecycle/deletion, with read-only task/member views for other participants. Unauthorized +/Save/mutation menu entries are hidden before form entry.
- Owner departure releases administration and notifies remaining participants through the existing case notification flow. Last-participant departure moves the empty case to Trash.
- Case/service errors use the common Popup error notice and existing danger palette. Shared date input values are converted to absolute timestamps before task save.
- The reported apparent frozen board was identified by the user as compilation in progress; the existing board loading flow was retained.
- Case member/service DTOs omit the unused seeded city field. Staff/assignee lists show assigned names without profile-city metadata; geographic service distance continues to use coordinates. The two list blocks and existing pickers remain.

Latest focused verification: compiled domain checks passed for creator-only administration, join without edit rights, first-writer takeover, owner-left/takeover notifications, final-participant Trash, retained task deletion, deleted-task calendar exclusion, and city-free case member DTOs. Compiled UI checks passed for hidden task mutations, read-only member views, error routing and DateInput-to-absolute-timestamp conversion. The Java watcher compiled the matching services. Added Java ownership regression source has not been executed separately while the live watcher owns the build.

Geography constraint: use coordinates and the existing partition only. These case/service flows do not infer a city, download city boundaries, or call Google Maps for reverse geocoding. Seeded city labels were removed from the new case/service DTOs and UI.

The compiled DOM check also passed for the common popup error notice above its body (modal and nonmodal), native input focus, the visible staff block without city metadata, and the existing Home startup-control readiness. Translation/Mongo and Work/Community seed synchronization checks and both repository diff-whitespace checks passed. Full paired manual QA and the previously noted mobile final-column/gallery visual recheck remain NOT RUN.


## MSC115-SERVICE-FEEDBACK — Closure worker and shared Feedback navigation

Actors: Alex Turner (Park Court case admin and closing participant), Evan Reed/Maya Stone (accepted residents), Farkas Anna (accepted provider).

1. In the case-admin card menu verify Start, Complete, Cancel, Trash and Reopen move the case to the corresponding existing bucket. The member sees no admin mutations. Closing the case persists Completed and queues `case.feedback.prepare` through the existing scheduled-message worker; the request does not await feedback preparation. Completing tasks alone does not close the case.
2. Worker preparation creates one review opportunity per accepted customer participant/provider, excluding self-review. **The closing admin remains eligible and receives the automatic ready notification.** Replaying the worker or reopening/completing again does not duplicate opportunities or overwrite an existing review.
3. Open sidebar Feedback. Event and service feedback appear together in the original three-column SmartList; service cards have a different background color. Keep the existing Pending/Feedbacked/Removed/Own status menu, icons, contextual colors and red counters. There is no event/service selector or separate service list. The title and empty labels are generic; Own includes provider feedback received. There is no feedback action in the case card menu. The existing activity feedback badge includes pending service reviews; ready notifications open this surface in Community context.
4. Review quality of work, reliability, communication and value for money on the shared FormFlow carousel with optional text up to 160 characters. Check remove/restore and submit/reload. Other users cannot submit the reviewer's row. Received/submitted sheets are read-only.
5. Open the provider's service sheet: its common statistics block shows submitted review count, overall mean and the same four criterion means. Community Home discovery uses service-interest criteria (relevance, clarity, confidence and value); completed-work feedback uses quality, reliability, communication and value. Event/Dating criteria and their existing counters remain intact.
   The pending service-review count is a typed part of the existing activity projection; contact, event-expiry and admin-counter updates must preserve it. Reload and verify that the shared Feedback badge still includes both event and service opportunities.
6. Announcement rows place the notice/voting badge at top right, above the shared three-dot button. View opens the actual read-only form; voting appears when the current member has a voting right and no cast vote. Park Court's notice is one announcement linked by subject to one Park Court case; Cases remains the documented cross-community aggregate opened from either navigation entry.

Focused evidence (2026-10-06): existing watcher compiled frontend/backend; compiled-output domain checks passed for nonblocking local closure handoff, closing-admin notification, worker replay, reviewer isolation, submit/remove/restore, persisted reload and provider statistics. Case-board, reactivity and real FormFlow input checks passed. Live browser/multi-actor HTTP execution, real worker interruption/restart and notification delivery remain **NOT RUN**.

Follow-up verification (2026-10-06): the rendered compiled Feedback popup passed checks for one common list, the original status control and palettes, combined counters, service-card tint, detail opening and remove/restore refresh. Paginated event/service boundaries and the common notification entry passed the domain check. The compiled case checks passed admin-only lifecycle menus, unchanged item totals after viewing, and Cancel/Complete/Trash/Reopen bucket moves. Store-response checks passed sidebar and bucket updates, including create without double counting. The existing frontend and Java watchers compiled these changes. Shared menu-label optical alignment was adjusted and compiled; live visual confirmation remains **NOT RUN**.


## MSC115-LANDING-THEME — Build-defined mode palette

1. On the public landing switch Dating → Work → Community and back. Each mode uses its existing selector palette blended with the shared violet identity color. The complete landing (page, panels, hero, cards, footer and landing popups) inherits the resulting semantic theme tokens. The selector itself retains its contextual mode color.
2. Reload in each supported landing mode and repeat the switch without a backend configuration change. On leaving the landing, its scoped document theme marker is removed.
3. Operator Branding has no theme dropdown. Product name, logo URL/image, logo character position and other branding settings remain editable. Public/operator DTOs, local persistence mapping and canonical Mongo configuration seeds no longer expose `themePreset`; old theme choices do not affect rendering.
4. Verify login/consent, SmartList native horizontal scrolling and all existing landing links. No navigation or worker behavior is changed by selecting a color theme.

Evidence: the existing watcher compiled the shared SCSS mode palettes and removed operator control. `check-landing-mode-theme.mjs` passed against that compiled output: Dating/Work/Community switching and cleanup, three distinct build-defined semantic palettes, white hero-text contrast across gradient stops, and branding normalization that retains the logo/name while ignoring the retired database theme. Browser visual verification is **NOT RUN**.

Latest read-only diagnosis (2026-10-06 05:36): the reported Park Court card was open as Evan Reed, with Alex Turner as case owner and `canManage=false`. The missing admin mutations match the explicit admin-only rule; no permission relaxation or live mutation was performed.


### Latest case-editor and counter corrections — 2026-10-06

- Case menu action is Tasks; the unfiltered type selector is All. Menu badges count items. The open status/type controls read current signals, including zero; moving a case updates both bucket counts immediately. HTTP user initialization retains the server's case count across reload.
- New manual cases use the active concrete group and start with empty affected-member selection. Existing cases retain their group. Creator administration and case lifecycle rules remain as above. Scheduled-task audience validation remains unchanged.
- Affected members and service staff use the existing inline profile-name pills inside their shared FormFlow blocks. Pills wrap; profile opening does not toggle selection. The affected-member picker header contains the labelled All switch; the section itself retains only its + mutation action.

Verification: the existing frontend watcher compiled the changes; compiled-output FormFlow/DOM and Work/Community reactivity checks passed, including already-open dropdown refresh, HTTP initialization and canonical demo/e2e count projection, empty initial audience, picker confirmation/clear across pages, and profile navigation preserving selection. The earlier compiled case-domain save/reload check passed for empty/selected/cleared manual audiences. The Java watcher compiled the matching save behavior; its added Java regression test was not run separately. EN/HU and all three Mongo i18n sets plus canonical Work/Community seeds are synchronized. Live browser execution remains NOT RUN.


### Group card category and status presentation — 2026-10-06

The group card background uses its existing category palette through the shared InfoCard accent surface. Friends/work/sport/learning/hobbies/neighbourhood retain teal/blue/orange/violet/rose/green respectively. The image frame's bottom-left status badge uses the existing membership bucket and contextual status colors; content review, blocked membership and deletion retain their explicit labels. Owner/member badges and menus keep their existing behavior.

Verification: existing frontend watcher compiled; rendered compiled InfoCard checks passed for distinct category hues, passive lower-left status, moderation/deletion labels, member access and restore-menu preservation. Live visual inspection remains NOT RUN.

## Conversation review — 2026-10-06

The latest correction takes precedence where requests evolved. Implementation claims below are source/focused-check findings; the manual campaign remains NOT RUN.

| User request | Owner / checkpoint | Review result |
| --- | --- | --- |
| Preserve group-dependent Cases +, then place it below Close | Community Cases header / MSC115-CASE | Existing group condition retained; second header row. |
| No implicit affected people on a manual case; labelled All switch in picker header | Case editor + member picker / MSC115-CASE | Empty initial manual selection; labelled header action; selection remains explicit. |
| Compact affected people/providers and real avatar pills | FormFlow member controls / MSC115-CASE, SERVICE | Shared inline avatar pills; wrapping rather than one full row per person. |
| Group card category colors and contextual lower-left status | Community group converter / MSC115-ADMIN | Source implementation present; visual recheck pending. |
| Labelled scheduled-task badge, chevron and red count in Cases header | Cases popup / MSC115-SCHEDULE | Dedicated header control; no extra sidebar schedule aggregate. |
| Personal and group schedules; menu actions, no clickable whole rows | Scheduled tasks store/converter / MSC115-SCHEDULE | Role/scope distinction and three-dot actions present. |
| Start from + existing frequency popup; center annual badge | Scheduled task FormFlow/SlotsInput / MSC115-SCHEDULE | Start anchor and frequency control; exact worker timing and visual centering need the lifecycle run. |
| Remove Active textbox; active/suspended/deleted buckets, counters and confirmations | Task popup / MSC115-SCHEDULE | Bucket menus and contextual confirmation buttons. |
| Remove redundant Kinek inside a group | Task editor / MSC115-SCHEDULE | Current group provides context. |
| List errors should not cover the entire list or pretend a save happened | Community popup error handling / MSC115-CASE, SCHEDULE | Header notice/operation state; force failed read and failed write separately in QA. |
| Multiple attachments: comma-separated names while editing, table in View | Shared DocumentAttachments / ANNOUNCEMENT, WORK-CAMPAIGN | Shared upload/remove/save/reopen path; focused compiled checks passed. |
| Remove apartment weighting; grant/revoke member voting rights | Member list + announcement service / MSC115-VOTING | Confirmation palette and Voter badge; final member votes, no inferred apartments. |
| Confirm critical voting/announcement changes | DialogStore + announcement actions / MSC115-VOTING | Unpublish/delete/close/final vote confirmation. |
| Campaign image cards, category colors, aligned corner badges, no duplicate title/km/search | Campaign converter/popups / MSC115-WORK-CAMPAIGN | Image cards, compact copy, passive aligned badges; management three-dot menu retained. |
| Remove campaign capacity/distance/language form/filter fields | Campaign contracts/editor + API client / WORK-CAMPAIGN, CAMPAIGN-API | Removed from authoring and integration schema; Event capacity remains an Event field. |
| Direct category selector instead of Filters | Work Home / MSC115-WORK-CAMPAIGN | Existing header AppMenu reused. |
| Published-only campaign picker: upper-right +, no three-dot/status/search | Campaign picker / MSC115-WORK-CAMPAIGN | Selection-only actions. |
| Home eye opens Details first, contextual Details/Organizer menu, full text/gallery/docs | Campaign editor/read-only view / MSC115-WORK-CAMPAIGN | Shared read-only form and Organizer tab. |
| Latest Home category badge correction | Campaign converter / MSC115-WORK-CAMPAIGN | Category badge restored on Home; status badge stays absent. |
| Own Campaign menu is management, no Organizer profile action | Campaign converter / MSC115-WORK-RATING | Own menu has View/Edit/Ratings/lifecycle actions only. |
| Ratings eye opens campaign history with date blocks and lazy pages | Campaign history custom component / MSC115-WORK-RATING | Existing SmartList/accordion reused, page size five; compiled actual-popup test passed. |
| Remove Activities campaign chooser, enter scoped Ratings through campaign menu | CampaignsStore + Activities / MSC115-WORK-RATING | Event campaign selection retained. |
| Person rating is AVG, decimals, write-side projection, unscoped Event priorities | Rating summary/service + local projection / MSC115-WORK-RATING | Focused local mutation/read checks passed; Java summary added; cross-actor HTTP lifecycle not yet run. |
| Granular rating follows card domain and reopening preserves criteria | Rating domain contract + Home/Rates / granular oracle above | Six domain sets; Campaign snapshot carried by both adapters. |
| EN/HU detailed guides on every new surface/control | Guide catalog/revision map / EXPLANATION-GUIDE-001 | 67 contexts, 1153 conditional fields, 28 contexts revised. Runtime full tour remains pending. |
| Reopen the old guide PASS for the expanded scope | Existing ledger row + guide checklist | NOT RUN; historical September evidence retained. |
| Website-wide privacy consent | HelpCenter/PrivacyPolicy local + HTTP / MSC115-LANDING | All three anonymous HTTP requests return the same policy ID. |
| Eight complete articles and eight unique generated images | Landing seed assets + content / MSC115-LANDING | Six sections per EN/HU article; source and live content updated. |
| Green Community/rainbow gradient, footer icons, aligned Read more | Deployment theme/config + landing SCSS / MSC115-LANDING | Compiled; three links returned by API; initial-load retry check passed; visual check pending. |
| Login/logout instability and confirmation-ring flicker | App shell/overlays/I18n / MSC115-LANDING | CDP caught raw translation key and early shell switch; fixes followed by scoped auth replay. |
| Campaign create MCP/API status | Existing integrations endpoint/client/MCP / MSC115-CAMPAIGN-API | Implemented JSON/multipart draft create; schema synchronization checked. |
| Later API/MCP Blocked/Write/Full, read capabilities and publication research | Separate next work package | Queued after this implementation/review; not included in completed claims. |

### Explicitly unproven or still requiring the next QA run

- Full paired Local + HTTP lifecycle for schedules, voting rights/ballots, documents/access and cross-campaign averages; focused tests do not replace it.
- Latest desktop/mobile visual alignment, article button baselines, footer icons, gallery sizing and all guide target positions.
- The expanded Work/Community multi-actor fixture is not yet staged. The existing `MSC115-UI-REGRESSION` launcher is an isolated anonymous UI entry, not proof that the full fixture is ready.
- The newly added Java unit cases have not been executed: the running Java watcher compiles application classes only. No parallel Gradle process was started.
- Platform publication, account pricing/hosting lifetime and API/MCP permission expansion belong to the explicitly queued next package.

Focused auth evidence: [2026-10-06 CDP diagnosis and final replay](../evidence/work-community/AUTH-TRANSITION-20261006.md) passed for the successful desktop Community member login/logout. It does not close MSC115-LANDING or the expanded guide campaign.

### Review follow-up — 2026-10-06, before the API/MCP expansion

- Article titles now reserve two lines even when only one is used; this aligns the date and description below. Existing equal-height footer actions remain. The temporary mobile mode-label experiment was reverted at the user's request: mobile keeps the compact icon and single-row header.
- Article detail uses the existing article-layout popup header with a smaller top/intro gap, a visible bottom separator and spacing before the scrolling body. Scroll a long article on desktop/mobile and verify the excerpt remains clearly separate from the body.
- Re-ran the existing compiled-output checks for schedules, member voting, campaign documents/history/AVG, Cases/task boards, form inputs, service feedback, announcement chat, reactivity and landing configuration/theme. Reactivity first failed because its store stub lacked the new history target and its Home assertion still prohibited the subsequently requested category badge. Those test expectations were corrected; the rerun passed.
- The theme check first assumed every compiled color was RGB. After supporting the compiler's hex output, it exposed insufficient white-text contrast at the Community primary/accent gradient stops (4.30 and 3.34). These two stops were darkened within the green palette; the existing 4.5 contrast assertion now passes for every landing gradient stop. Removed the unused entry-page outlet import left after the global overlay fix. The existing frontend watcher compiled the result without that warning.
- Corrected the service-feedback QA sentence to distinguish discovery interest criteria from completed-work feedback criteria, matching the domain oracle and the actual service card.
- Canonical Work/Community content, all EN/HU Mongo translations (13198 messages) and all seven existing MCP schemas remain synchronized. This verifies the existing campaign-create contract; it does not implement the queued permission/read expansion.
- Follow-us data uses the existing deployment configuration. The canonical demo/e2e seeds contain Instagram, YouTube and Facebook; the same data has been added to the main configuration seed. The existing dev importer was invoked for this singleton and preserved its already-populated configuration. Production reads the persisted `socialLinks` field and preserves existing operator settings on import. The attempted v9 empty-list backfill was reverted, and the earlier local-reader seed fallback was removed: loading configuration must not fabricate missing seed data. The then-current focused check used an actually seeded record and was **not rerun**, following the user's instruction to defer testing. That source check is now superseded by the public-catalog regression described below; the earlier fresh-unseeded fallback PASS does not prove this new path. Verify the affected browser during the later QA run.
- **Local/GitHub Pages public configuration was subsequently re-authorized and implemented through the existing local service.** The public local repository lazily reads one small canonical `deployment-configuration.json` before an operator record exists. The operator builder uses that same data, while saved configuration (including an intentionally empty social-link list) remains authoritative. Public reads create no operator/demo records and perform no seed normalization writes. The rejected application initializer remains removed; the Mongo configuration seed change is retained.
- Work's short hero list now explicitly includes company team building: `Munka · Üzleti ötletek · Céges csapatépítés` / `Work · Business ideas · Company team building`. The existing EN/HU bundles and all three Mongo seed bundles carry this copy; desktop/mobile layout verification remains deferred.
- **Follow-us diagnosis resolved by the user's confirmation.** The affected Chrome profile upgraded the HTTP configuration request to HTTPS because it retained a cached redirect; the user cleared that cache and confirmed the links now work. The application/seed was not changed to work around this browser state. Direct HTTP returns 200 without redirect, and separate CDP read-only inspection found three visible links. The HTTP adapter does not persist this configuration in IndexedDB; the service-worker branding cache stores product name, home label and logo only. No navigation, clicks, storage/DOM writes or service-state injection were performed during this follow-up diagnosis.
- Firebase's normal disabled/demo state previously produced a 404 from the existing public configuration endpoint. The existing service now returns no configuration for those states, its controller emits `204 No Content` with `no-store`/`no-cache`, and the existing frontend Firebase service handles 204 without parsing an empty body or initializing the SDK. Active incomplete/undecryptable configuration remains 503. Both existing watchers compiled the change, and live anonymous/demo requests returned 204 with zero body bytes and the expected cache headers. Controller/service/frontend regression sources were updated, but their execution and active-Firebase browser lifecycle remain **NOT RUN**, following the deferred-QA instruction.
- The shared [MCP Events discussion](https://chatgpt.com/share/6ac4a55f-8ee0-83eb-97af-b90e12dcaf96) has been read. The queued MCP investigation now includes the [official MCP Events contract](https://developers.openai.com/plugins/build/mcp-events): MCP 2.0, authenticated subscription ownership, persistent subscriptions, verified signed webhooks and revocation. The shared conversation's examples are research context, not authorization to expose operator-only data to ordinary users or to publish a plugin.

- Final source review found that removing the campaign picker and Home three-dot menu had removed the ordinary participant entry to Campaign questions. The read-only campaign Details form now reuses the existing eligible Ask menu action and CampaignsStore chat service, both from the Home eye and each expanded history campaign. Successful opening closes the campaign overlay so the existing chat popup is visible. Error state remains in the source popup; cancelled requests cannot reopen it. EN/HU guide fields and the chat oracle follow this entry. Header and sidebar Ratings both clear campaign scope and remain aggregated; only owned campaign-card Ratings actions select a campaign. The detail/history DTOs now carry the same viewer rating and criteria snapshot as the list; HTTP history reuses its already-loaded pair evidence without per-campaign database reads. Both existing watchers compiled the changes. Local/Java regression sources cover the viewer score separately from the peer score; their execution and the browser lifecycle stay NOT RUN.

- Public landing dependency review: the existing static-content seed call moved from EntryPage into LocalLandingContentService, retaining its lazy import and HTTP/local routing. The configuration reader no longer imports the operator builder. Two seed-repository barrel imports were narrowed to their exact builders and the help mapper. In the existing dev watcher output, the initial static graph stayed at 8 files / 1,214,007 bytes; the static-content dependency graph shrank from 22 files / 4,481,810 bytes to 15 files / 3,758,385 bytes, with only its five help/article seed classes instead of eighteen seed classes. The public configuration data import has a three-file dependency graph of 4,644 bytes including shared runtime code. These are uncompressed dev-bundle dependency measurements, not optimized GitHub Pages or browser timing claims. The watcher compiled successfully. Fresh-state/no-write, saved-override/empty-list and source-parity regression cases were added or updated; execution remains deferred.
- Local/backend emulation review: the backend public configuration service projects its persisted deployment seed without writing during the GET. Removing local read-time full-operator normalization follows that boundary; the existing demo bootstrap, seed writes and operator IndexedDB save/load remain. A fresh local build serves the packaged public seed before any operator workspace exists, while HTTP requires its separately imported deployment seed. This initialization difference is explicit. Route selection and offline storage were not changed: production HTTP does not automatically switch to demo/local data when disconnected. The existing service worker caches loaded JavaScript chunks, including this small local catalog. A cold/warmed offline browser replay remains **NOT RUN**; this source review does not establish complete offline availability of HTTP public configuration.

The multi-actor manual campaign and expanded guide execution stay **NOT RUN**. No fixture reset, navigation, social-link click or new broad browser automation was performed during this review.

Latest execution order from the user: finish MSC-115 development and consolidate its backup commits; **stop before the API/MCP expansion**. That expansion will be a separately numbered project task. QA, including the expanded guide test, comes after the development phases and is not a prerequisite for beginning the later MCP work once authorized.
