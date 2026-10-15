# MSC-115 — ordered automatic Work/Community QA

Authorized on 2026-10-13: Codex executes the whole MSC-115 flow, diagnoses, fixes
and retests defects. Use visible CDP Chrome from the versioned launcher; never
headless. Status and evidence belong in the CSV/XLSX ledger and campaign evidence.

## Execution contract

Run the numbered steps from top to bottom in HTTP monolith, then local mode.
Every block has an independent prepared baseline: no action requires jumping to
another checklist, replaying a later block or remembering an earlier outcome.
The fixture must explicitly prepare the data named in that block before its
first action; a described baseline is not proof it was staged. Failed dependent
steps stay open until fixed/retested. Do not manufacture a PASS with seed writes.

For each step apply A01–A12 from
[the mandatory architecture gates](../../reference/ARCHITECTURE_STEP_GATES.md),
recording actual UI, requests, timing, persisted state and counters. Use EN/HU
and desktop/mobile for affected UI. The default desktop/mobile viewports are
1280×900 / 390×844. Notifications must match sender, recipients, unread/menu/
workspace counters and destination: human actions exclude their actor;
automatic reminders include an affected creator.

After the main run, perform the sequential KVM sample at the end, with monolith
stopped first. KVM is required even if no backend code changed. Assess template
impact for every defect and verify affected retained shared functions in its own
local/HTTP environment. Only one application stack runs at a time.

[Deployment-only follow-up](MSC-115_LIVE_DEPLOYMENT_QA.md) has its own open results.
A development task may close after this local/HTTP/KVM/template scope passes and
the exact deployment-only tail is recorded; a deferred check is never PASS.
Do not move ordinary lifecycle, workers, permissions, counters, fault/retry or
persistence checks out of this campaign merely because they are difficult.

Frontend compilation optimization is a separate engineering workstream, recorded
in [Frontend compilation optimization](../../../plans/FRONTEND_COMPILATION_OPTIMIZATION.md).
It adds no MSC-115 QA steps or closure prerequisites. Compilation needed to verify
an application fix is still part of that fix's evidence.

## Preparation

1. Record clean/dirty state and revisions for backend, frontend, components and template. Read the active handoff and trust gates; identify the sole runtime/build owner. Start only the existing intended stack and verify health, database/profile, seed revisions, CPU and available memory.
2. Verify the first block's baseline through the existing checkpoint harness. Launch visible isolated sessions through `guides/qa/tools/open-checkpoint-browser-sessions.mjs`. Record the managed CDP manifest; ordinary clicks and forms execute the tested behavior. Later blocks get their own ready check and actor setup before their first action.
3. Start bounded request/timing and browser-error capture without secrets or message bodies. Take initial per-actor counter/persisted-state snapshots. Record the A01–A12 source-owner map once for the current revisions, and attach the applicable runtime evidence to every numbered step.

## MSC115-LANDING — Shared landing and demo selection

Baseline: Anonymous session; no consent stored; public entry. Keep the app on its current default Dating mode.

4. Open the normal entry URL: Dating is selected. Switch to Work and Community using the existing header AppMenu at desktop and mobile width. Scroll the landing body to the footer and back: the logo, mode selector and Login row stays outside the scrolling content and remains usable.

5. Check the unchanged page structure and MyScoutee logo; check mode-specific heading, slideshow (including the fourth explanation image), articles, footer and guide step. Follow-us links are the same in all three modes, including a fresh local landing before opening the demo picker. This public load creates no demo users or operator record; saved operator overrides, including an empty social-link list, remain authoritative. Returning to a mode reuses its loaded content.

6. Open the demo picker for each mode. Confirm membership-based availability, including people who belong to more than one base group. Cards show normal name/profile metadata without overlapping group labels, and rows align at the top. Login still resolves the account/profile through the existing flow.

7. Check UK in supported areas. Seeded users have plausible covered-area coordinates; only the designated location-prompt demo actors request location.

8. Work and Community each have four complete articles in EN/HU (eight topics, sixteen translations), each with a distinct image and six explanatory sections. Dating content remains unchanged. Follow Read more and verify the full text and image, not only the excerpt. Every article title reserves exactly two lines, including a one-line title: dates and descriptions start at the same baseline within each row. Compare all card footer buttons at desktop and narrow widths: they share one baseline within each row. The October 7 mobile header retains the localized mode label, icon and dropdown arrow on one line; the Hungarian login action uses “Belépés”. This supersedes the October 6 icon-only expectation recorded below.

9. Community uses a green/teal hero and a multicolor login gradient. Check Dating and Work retain their own themes. The follow-us footer displays the configured social icons; simulate an initial configuration request failure using the existing external network tooling, restore connectivity and verify the ordinary retry restores the links.

10. Accept the current website privacy policy once. Switch landing modes and authenticated groups: the same policy is not requested again. A genuinely new policy revision still requires acceptance. An identical legacy Work/Community v1 acceptance remains valid.

11. Login and logout through their normal controls with delayed destination loading: one successful route transition each, no return to the previous page, no blank intermediate shell, no raw translation keys, no duplicated confirmation/demo popup or restarting ring. Repeat successful login, cancellation, failed login/retry, and member/admin navigation. Record a route trace and screenshots/video; source checks alone are not visual evidence.

12. After member and app-admin login, check the workspace button and its menu: Dating/Work/Community use the landing's localized name, icon and color, rather than “Main profile”/“Alapprofil” or an arbitrary private-group palette. Check notification scope uses the same names. Private workspaces retain their own name, initials, assigned color and counters; admin visibility rules stay unchanged.

13. In Groups and Explore, dedicated main groups present in the active filter have their localized main-group name, matching icon/color and “Main group”/“Főcsoport” marker. They appear once at the beginning of the **entire filtered result**, with ordering applied before pagination. Check distance and latest-update sorts, category filters, live refresh and desktop/mobile paging through all subsequent pages: no repeated main-group block, missing private group or duplicate card. A filtered-out main group must not be reinserted. Dating is the account profile, not an invented extra group record.

## MSC115-LANDING-THEME — Build-defined mode palette

Baseline: Anonymous landing session; desktop and mobile viewport.

14. On the public landing switch Dating → Work → Community and back. Each mode uses its existing selector palette blended with the shared violet identity color. The complete landing (page, panels, hero, cards, footer and landing popups) inherits the resulting semantic theme tokens. The selector itself retains its contextual mode color.

15. Reload in each supported landing mode and repeat the switch without a backend configuration change. On leaving the landing, its scoped document theme marker is removed.

16. Operator Branding has no theme dropdown. Product name, logo URL/image, logo character position and other branding settings remain editable. Public/operator DTOs, local persistence mapping and canonical Mongo configuration seeds no longer expose `themePreset`; old theme choices do not affect rendering.

17. Verify login/consent, SmartList native horizontal scrolling and all existing landing links. No navigation or worker behavior is changed by selecting a color theme.

## MSC115-INVITE — Shared links, workspace registration and promotion

Baseline: Disposable Work and Community private groups with a manager and a clean signed-out test invitee; registration/claim uses the existing non-production identity path. Real external provider enrollment is a separate deployment check.

18. Create a Work private-group invite and a Community private-group invite using the existing invite action. Open each link in a clean prepared session.

19. Check the relevant landing mode, then register/claim. Verify membership in the invited workspace and its base group, with the correct active profile.

20. Switch to a Dating group from a Community account: its Dating behavior remains independent. Check joining an available base group is explicit and does not require approval. Promotional cards remain a later refinement.

## MSC115-WORK-CAMPAIGN — Campaign authoring and discovery

Baseline: Work organizer and unrelated Work participant; disposable image plus two harmless PDF/text documents; empty and populated Campaign lists.

21. Open Campaigns next to Groups; create a draft through + with title, description, opportunity type, category, images and optional documents. Select multiple documents; verify one file per table row, the direct delete button at each editable row end, and the saved read-only download table.

22. Save, reopen, publish, edit, unpublish, trash and restore using existing FormFlow/SmartList patterns. Observe write results without a full unrelated list reload.

23. In the Campaign management list, verify category-colored image cards with aligned category/status chips and working three-dot actions. The published-only picker keeps +/check at the upper right and has no status chip or three-dot menu. Neither list has a search field.

24. Check the compact Work Home image card with its category badge at the upper left, without a status badge or three-dot menu. The eye opens Details by default; the header app-menu switches between read-only campaign details/documents and the existing Organizer profile. Discovery uses the direct opportunity/category selectors; private drafts stay private. Check the shared Dating-style frame, loading, paging and full-height empty state.

## MSC115-WORK-RATING — Person ratings with optional Campaign context

Baseline: Work organizer with two published disposable campaigns; participant with controlled 8/9 rating evidence; separate seeded Dating and completed-service controls for the six criterion domains.

25. Rate two campaigns of the same author. Inspect the Ratings list: it displays people, with aggregate person rating when no Campaign filter is selected. Open the person from Ratings: the header starts at Details and switches to Organizer using the same blue/violet app-menu. Details shows campaign history for this pair (including other campaigns while a Campaign filter is selected), one block per visible campaign, grouped and ordered by the latest recorded rating/chat interaction date. Reuse the pageable SmartList/accordion pattern: load five at a time; expand read-only details, gallery and documents in place. Switching to Organizer and back preserves the loaded list and expanded blocks. No campaign interaction shows an explicit empty state; a failed request shows an error with retry.

26. The Activities/Ratings popup has no Campaign selector. From an owned campaign’s three-dot menu choose Ratings: this opens the same popup scoped to that campaign. Its subtitle puts the campaign title above the rating direction. Open ordinary Ratings from Home/sidebar: the campaign scope is cleared. The campaign picker remains available in the Event editor. With two ratings 8 and 9 for the same person, ordinary Ratings shows 8.5; the campaign-specific views show 8 and 9. Revise one context to 10: the average becomes 9.5. A missing context contributes no zero. Inspect the write-side summary rather than re-aggregating every list request.

27. Revise one rating. Check the corresponding write and aggregate query, including the opposite participant view. An unchanged retry must not create another notification.

28. Use an unfiltered event for aggregate sympathy selection and a Campaign-selected event for campaign-specific selection; do not create horizontal channels or fake campaign events.

29. Open detailed rating from an actual Dating person (attraction/personality/interests/values), Dating pair (chemistry/interests/values/compatibility), Campaign (relevance/appeal/clarity/collaboration), Work person (fit/interests/communication/collaboration), service discovery card (relevance/clarity/confidence/value) and completed-service feedback (quality/reliability/communication/value). Verify EN/HU labels, persisted mean, scalar compatibility and saved criterion snapshot after reopening/reload. Workspace switching does not change the card domain; an aggregate mean has no invented criterion breakdown. Use a completed-case baseline for service feedback without depending on a later step.

## MSC115-WORK-CHAT — Campaign questions and event group chat

Baseline: One published campaign, its organizer and a participant without a saved positive rating; separate real test event.

30. Before a saved positive rating, verify the Campaign question action requires rating first. Rate, then open campaign Details through the Home eye or a campaign block in the aggregated Ratings history and choose Ask the organizer.

31. Check the independent Campaign chat bucket, correct organizer, recipient-only new-message notification and unread badge. Reopening/retrying does not duplicate the chat or message.

32. Create the corresponding real event: its group conversation uses the existing event chat owner and is separate from the direct Campaign question.

## MSC115-WORK-EVENT — Campaign-scoped invitation, capacity and related filters

Baseline: Work organizer, published campaign and eligible candidates; capacity and worker baseline recorded.

33. Create an event and select a Campaign through the existing selector-style control. Check the event’s own capacity and priority-based invitation behavior; selecting a campaign must not overwrite event capacity.

34. Open Events, select a Campaign filter and verify its title/subtitle, paging and displayed events. Clear the filter to return to all events.

35. Check the Campaign filter in event feedback. Campaign chats use their own bucket; a whole-chat-list Campaign filter is deferred. Verify event creation, invitation, acceptance/removal and feedback notifications reach other affected participants only.

36. Check that the scheduled random event generator does not create Work rooms.

## MSC115-CAMPAIGN-API — Campaign create through existing API/MCP architecture

Baseline: Disposable Work integration credential generated through normal UI; existing local API/MCP client; unrelated group identity for denial. Preserve current access controls; broader pack/Events QA belongs to MSC-116/119.

37. Use the existing integration authorization in the Work profile and create a Campaign with the supported create capability.

38. Check it appears as the same model in Campaigns and respects actor/group ownership. A different group identity must not create or modify it on behalf of the owner.

39. For this checkpoint, verify the existing draft-create capability and unchanged event/group create calls. This step covers campaign draft-create and unchanged event/group create only; broader access-pack and Events qualification is outside MSC-115.

## MSC115-SERVICE — Community service sheet and priority discovery

Baseline: Anna provider, Alex customer and eligible staff; disposable service and controlled private/draft/deleted controls.

40. In base Community open the service photo-card Home. Reload with the Community profile active: the startup header shows no provisional Dating/Filters buttons; category and Ratings appear only after the active profile is ready. Its header has category and Ratings controls; neither Your services nor the provisional Filters/distance popup is present. Check category selection and location ordering. The card uses the service's own images, name and short description; its eye opens the provider profile. The top-left category badge matches the category menu. Empty results, loading, paging and mobile height use the shared Dating frame and SmartList.

41. Open My services from the sidebar Community block. Create/edit/publish/draft/trash/restore a sheet. The existing gallery is left and name, short description (120 characters) and category are right in view/edit modes. On desktop the gallery height follows the right-hand form block; mobile uses the existing event-gallery height rule. Images keep their proportions. Verify native pointer focus and typing. A separate shared FormFlow staff block shows every selected person as a compact inline name pill; pills wrap and open profiles without changing selection. Its + opens the existing preselected member picker; its header tick commits changes, including unassignment. The read-only service sheet keeps the visible list and hides +. The block keeps its header +; each name uses the existing task-assignee pill pattern. No generic radius, availability, slot or pricing fields remain. Check contextual list cards/menus and the provider calendar for agreed task dates.

42. Rate the provider through a service. Multiple services from that provider use the existing person priority. Publishing a sheet alone sends no unsolicited notification.

43. Confirm a draft, deleted/inactive provider or another person’s private image is not exposed through discovery.

## MSC115-SERVICE-LINK — Shared external link input

Baseline: Provider-owned disposable service; use a harmless local test URL to verify LinkInput persistence/open/remove.

44. In the service editor, enter an external service URL below the description using the existing event/asset LinkInput (paste/open/remove). Save and reopen/reload; the same URL remains. Clear it, save and verify the cleared value persists.

45. In read-only service view, name/description and the link are not editable, while the existing Open link action works. The home card still shows the service's own image/name/description, not the provider's profile content.

## MSC115-CASE — Shared Cases lifecycle and member access

Baseline: Alex case creator/admin, Maya affected member and an unrelated resident; fresh disposable case per destructive terminal branch. Do not consume a later block’s baseline.

46. In a concrete community, create a case from Cases +. The active group supplies the community; there is no group selector. Name and case type share a row, description follows. A new manual case starts with no affected members selected and can be saved that way; its creator is the accepted case admin. The affected-member block shows compact inline name pills and a +. The existing member picker header has a labelled All switch; the checkmark confirms selected members or clears them. Keep the aggregate-view + condition unchanged.

47. Check daily descending InfoCard groups with one sticky header. The category badge is top-left with the existing saturated stage treatment, and the unchanged contextual status badge is top-right. The case name and category appear once; below the media, show the community and description. No affected-member count badge remains. The red case-card/Tasks counter is exactly the number of tasks, independent of unread attention; zero has no badge. Open members through the case card menu. Inspect status/type item totals and the aggregate Cases badge. Opening a case leaves these counts unchanged; create/status/trash/reopen changes the appropriate counts. The sidebar sums visible non-trash cases.

48. Open the same case as another affected member and as a manager of multiple communities; both are read-only unless they are this case's admin. Unrelated members cannot read it.

49. As this case's admin, check lifecycle-appropriate three-dot actions: Start only while open; complete/cancel while active; reopen after completion/cancellation/deletion; no duplicate delete on deleted cases. Edit/close/reopen using these supported actions. Check targeted list/counter updates and notifications to affected others; the human actor receives none.

50. A manual case creator immediately has accepted membership and the Admin role. A group-admin role alone does not grant administration of another user's case. Only the case admin edits the case and tasks. When that admin leaves, the case loses its admin, remaining participants receive the owner-left notification, and Take over case becomes available. After takeover, verify persisted ownership and loss of edit controls for everyone else. If the final remaining participant leaves, the case goes to Trash. Pending invitations keep the case available; declining the final pending invitation also empties/trashes it.

51. Any mutation error appears once in the active popup's red contextual notice directly below the header, above the form. Permission/stale-version errors have specific translations. Enter agreed dates through the actual shared DateInput and save/reopen; local input times must reach the API as absolute ISO timestamps.

## MSC115-CASE-PROVIDER — Recommendations, provider invitations and quotations

Baseline: Independent active case with admin/resident, Anna and a competing provider; published service and controlled pending/accepted/rejected quotations.

52. In the case chat, use + → Recommend provider to select a published service/provider. In the provider picker, + toggles to a checkmark; choosing another replaces the selection. Inspect/remove through the header basket; confirm applies and closing cancels. The chat receives the existing event/asset-style attachment card showing that service’s own image, name and description. As case admin, open its message menu and invite that exact provider directly; do not search for the provider again. Ordinary members have no Invite action; after invitation it disappears. View opens the service sheet.

53. As provider see the shared case in aggregate Community Cases and accept/decline. In Quotations, the header avatar pill and > open a service-card list using the same cards as Community Home. A provider's + is below Close in the header toolbar. Submit using the same grouped FormFlow as asset/event: price/currency/proposal, work policy and refund policy. Describe possible start time as free text; no dedicated availability dates or upfront service pricing.

54. As a customer member inspect quotations as simple rows with right-hand three-dot menus; the status badge is at the right edge above the menu, with no separate Joined provider row. All accepted case members can inspect quotations. View opens the same read-only sheet without Save/Edit. Work/refund policy blocks show their full inline text without a redundant View policies button; the existing policy editor remains available during editing. Only the case admin edits a saved quotation or changes its status. Pending, Accepted and Rejected are reversible through the menu and have their own filter buckets.

55. From a quotation's Conversation action, open its own group chat with the residents and that quotation's provider. It is a distinct conversation in the existing Chats → Cases filter and All list, with stable identity across reopening. It is neither a private pair chat nor the main case chat. Other providers cannot enter competing quotation discussions.

56. Check invitation/response/offer/decision notifications and their correct case destination. Repeating a provider invitation must preserve an accepted assignment.

57. An external provider must not gain private-group navigation or announcement access. A declined invitation retains permitted case history but removes live case-chat access.

## MSC115-CASE-BOARD — Task board, assignments and agreed dates

Baseline: Isolated equivalent of Joint meter replacement: Alex case admin, Evan viewer, Maya member, accepted Anna provider and accepted EUR 360 quotation with full terms, four tasks spanning all statuses. Keep source demo rows intact.

58. View Joint meter replacement. The board uses a native horizontal SmartList: one column at 375 px, three on desktop. Swipe both directions on a task and on empty column space. Status headers are compact contextual TextCards with vertically centered icon/label.

59. For the case admin, only the common + and Close controls are in the header. A normal member has only Close and can view every task without mutation actions. The task three-dot menu shows View and read-only Members to normal members; Edit, assignment, Start/Complete/Reopen and Delete are admin-only. Direct local/HTTP mutation by a non-admin must also fail. No case description or unrelated action toolbar appears in the body. + opens a task editor with functional name/description and the shared event/asset date-range block for optional agreed start/end. There is no status selector in the editor. Assignees and Preceding tasks each have a separate shared FormFlow block with the complete selected list and their own + picker action for the admin. Assignees are inline name pills with a profile-opening chevron; opening the profile does not select/highlight the pill or change the form value. No city is shown. A separate Quotations block supports multiple accepted quotations as subactivities. It uses the same TextCard summaries as Slots, in the existing three-column SmartList (responsive on mobile), with description, a passive price badge at the upper right and the three-dot menu below. The name and description start at the top beside the price; no empty badge row or fixed 128 px minimum remains. Task form order is Assignees, Name/Description, Date, Quotations, Preceding tasks. Card menus use the shared list overlay: they may extend vertically outside the block/popup within screen bounds, while horizontal positioning stays within the popup. The provider/menu heading remains outside the scrolling action list. View opens the complete terms sheet; only the admin sees Remove, which detaches from the task draft without deleting the quotation. Confirm/save persists the selection. Pending/rejected quotations cannot be assigned in either adapter. The board task displays one informational total in the existing Payment Summary display currency (EUR by default), converted from the memory-cached rates delivered by the first immediate profile realtime response and subsequent polls. Converted totals have an approximate marker. No per-card rate request is made, original quotation amounts/currencies remain unchanged, and quotation currency is not restricted by the display currency. The earlier compact toolbar buttons are superseded. Read-only task views keep both lists visible and hide +. At the end of the native horizontal mobile scroll, the final column retains its full right border and end gutter.

60. Task cards use the existing slot TextCard and three-dot menu. After browser reload, already assigned people are checked and present in the basket. Clear one or all assignments and save with the header tick; reopen/reload and confirm removal. Repeat this shared-picker check for service staff and other assignment callers. Inspect member assignment via the shared basket, existing prerequisites and the distinct complete date subtitle. The prerequisite summary appears as a separate text block below the description, with a small gap on every task card; the two blocks have independent line clamping. Update an existing task and verify its column, members and details reconcile without reloading the list. Reopen and verify persistence. Adding/deleting a task updates the case-card/View task count immediately via the existing store/SmartList patch, without resetting scroll or reloading the list. Assignment changes use existing case notifications for affected others, excluding the actor.

61. Progress the task using its three-dot menu: To do → Start → In progress → Complete → Done; Reopen returns it to To do. Saving ordinary task fields preserves its status. Add a prerequisite and reject a self/circular prerequisite. As case admin, delete a task from its three-dot menu in To do, In progress or Done, including after case completion. It remains in Done with Deleted/Törölt, the existing danger palette, its dates, assignees and prerequisite references preserved. The case task counter still counts that retained task. Deletion does not silently remove prerequisite references; deleted tasks no longer appear as scheduled work in the provider calendar. A regular member cannot create or edit any task, change its assignees/status or bypass deletion rights through a task save. Parallel tasks remain possible. Tasks share the case chat and have no separate channels.

62. Open Quotations from the case card. Evan sees Farkas Anna's accepted EUR 360 quotation with populated work/refund policies, already assigned as task work; the provider is accepted. The quote's decision badge remains visible in the quotation list. Alex can review decision actions. A provider can add a quotation; accepted case participants can view every quotation read-only, while competing quotation conversations remain isolated (as in step54). Inviting that provider to the main case chat is a separate optional action; the quotation has its own group conversation under Cases. Chat +, polls and sharing stay available.

63. Verify agreed task dates in the existing provider calendar. Service publication has no generic promise of availability or pricing.

## MSC115-CASE-CHAT — Shared case channel and permission changes

Baseline: Independent active case and accepted provider with both main-case and quotation chats; actor retains access for the task-navigation branches after the provider is removed.

64. Open the main case chat and the quotation group chat from permitted actors and inspect the existing Cases bucket and All list. Both use the distinct Cases base color; all other channel colors and filtering remain unchanged. Invitation to the main case chat remains optional, separate from quotation discussion. Providers retain normal +/poll/sharing/chat actions. Send a message; only other current chat participants get notification/unread increments.

65. Mark read and reopen. Existing messages and other members’ unread counts survive case membership synchronization.

66. Decline/remove the provider and check both HTTP and an already-open websocket against current case access. No private group membership is created.

67. With an actor who still has access, open the case chat without opening the Cases overview first. Click **Tasks / Feladatok** in the chat header. Only that case's task board opens above the chat; no new Cases list opens beneath it. In the HTTP request trace, distinguish requests already completed by opening the chat from those caused by this click: the click loads the target case detail once and does not request the Cases list or prefetch the Scheduled tasks counter. Read the board's three columns from that detail without another list load.

68. Close the task board: return directly to the same chat, with no stranded Cases popup. Reopen Tasks and repeat. As a separate control, open the Cases overview normally and open/close its task board; the existing overview remains open in that navigation flow.

69. If the target detail request fails or access is denied, an error remains visible without opening an underlying Cases list. Close that error popup and keep the chat usable; restore the permitted request and retry through the chat's Tasks button. Record the HTTP/UI task-board navigation result here; no media-call execution is required.

## MSC115-SCHEDULE — Scheduled task and 45-day case reminder

Baseline: Personal owner, community manager and affected residents; dedicated schedules and prepared before/at 45-day boundary savepoints. Change fixture-owned dates, never the host clock or production worker implementation.

70. From the Cases header open the labelled Scheduled tasks pill with a trailing chevron and red item counter. It opens a separate popup. Case creation stays group-gated, with + at the right of the second row, below Close. Scheduled tasks are personal from the overview; a group admin creates them in the entered group with All/selected affected members. No Kinek/group selector is shown. Ordinary members retain personal scheduling. Check the affected count, right-hand recurrence badge and passive SingleRow with a three-dot menu. The affected members and service staff use compact avatar/name pills with profile chevrons, preserving the selection when a profile opens.

71. Set Start from to a date and minute and use the existing recurrence popup. At just before the first occurrence minus 45 days, the scoped job creates nothing. At the boundary it creates one case and reminds all affected users, including an affected scheduled-task creator. A personal occurrence belongs only to its owner, who can edit it. A group occurrence invites participants and leaves the case admin unassigned. Join accepts membership but grants no edit rights. The first eligible participant using the separate Take over case menu action becomes admin; a competing stale takeover cannot overwrite that owner.

72. Rerun the same occurrence and simulate a delivery retry through the prepared test mechanism: no second case/reminder. Recurrence advances only after enqueueing.

73. Check monthly/quarterly/yearly recurrence and short-month dates. The worker advances the next occurrence while retaining Start from. Reopening or changing the description must not reset worker progress; changing Start from or recurrence recalculates the next occurrence. Asset editor has no utility scheduling fields.

74. Active/Suspended/Deleted buckets have live red item counters. Suspend/resume, delete/restore use the three-dot menu; the form contains no raw Active boolean field. Paused/deleted schedules are excluded from worker execution. The owner/group admin can edit; affected ordinary members have View only. Bucket totals and the Cases header badge update immediately; schedules add no separate count to the sidebar. Reload retains the same state and counters.

75. Suspend and Delete open the existing confirmation dialog. The confirm button matches the menu action (amber for Suspend, danger/red for Delete); cancelling makes no mutation. A failed list request reports a loading failure in a compact inline alert without covering the list. Retry clears that error on success. It must not claim that an unsaved modification failed.

## MSC115-ANNOUNCEMENT — Private Community Home and document editing

Baseline: Private Community admin, current member, former member and outsider; independent notices/votes plus disposable PDF/text/office attachments.

76. Open private Community Home: newest-first SingleRow announcements grouped by day replace the rating stack, with a single sticky date header. Voting replaces Ratings in the sidebar Activities block; Your services remains in the Community block.

77. As admin create a minimal draft with text and optional PDF/text/office attachments, then publish/edit/unpublish/trash/restore through three-dot actions and buckets. Select multiple files in one upload: each file occupies one table row with a direct delete button at its end. Save and reopen View: each attachment occupies one table row with its own download action. Removing a file and saving must also remove it from the reopened table.

78. Check member visibility and color/action distinction for voting vs ordinary announcements. Members cannot publish directly. “Ask the group admin” opens the existing group-support chat, both from inline Home and above the Voting popup. In HTTP mode the request contains the announcement ID and needs no event/target ID. The shared chat popup opens immediately, including with the local route delay; its SmartList owns lazy loading and an empty load-error state. No chat-load error is added to the source list or a separate notice dialog. Preserve the existing connectivity and overdue indicator behavior; a chat load failure must not set the offline indicator state. Closing the chat while its request is pending must not reopen it.

79. Test attachment download as a current member and denied outsider/former member. Unpublished documents remain admin/owner-only; normal feedback opening sends no notification.

80. Read-only details show a normal title and complete paragraph text, without disabled inputs or a “Voting: false” row. The shared Attachments block lets the admin add documents with +, remove them and save; reopening retains downloadable files. Members have download actions only.

81. Residents see no Published selector or empty toolbar on Home or the Voting popup. Admins retain Published/Draft/Trash. Item timestamps follow the app language and include hours and minutes.

## MSC115-VOTING — Member voting rights and final votes

Baseline: Private community admin, Alex/Evan eligible voters and Maya without voting right; independent open vote and ordinary notice, with deadline controlled by this fixture.

82. In the group Members list grant/revoke voting rights on accepted members through the three-dot menu. Both actions require confirmation matching the menu palette; cancellation changes nothing. The localized violet Voter badge appears immediately, survives reload, and disappears after revocation. Other membership roles remain visible. Ordinary members cannot manage these rights.

83. Each eligible member may cast one final vote per published open vote. A grant applies to already-open votes; revocation prevents new votes but preserves existing ballots. Regrant and deadline extension do not permit replacement votes. There is no apartment/unit/weight form or button.

84. View opens description and attachments. Vote and Results are mutually exclusive actions opening the same grouped popup. Results appear after deadline or explicit closure and count one vote per member, without exposing other members' choices. List cards and badges remain passive. Unpublish, Delete, Close voting and final vote submission require confirmation with the corresponding action palette.

85. Extend the deadline to reopen while retaining prior ballots. The Community-only job closes due votes once and notifies participants; casting notifies other managers.

86. Sidebar Voting filters voting items before paging and totals; Home retains notices and votes. Creating from Voting enables voting initially.

87. Verify this block’s prepared Park Court-equivalent fixture gives Alex Turner and Evan Reed voting rights and Maya Stone none. Its open vote has an explicit future deadline and remains separate from the ordinary notice. Local and HTTP fixture member flags agree.

## MSC115-PAYMENT — Group-scoped history, member basket and manual transfer

Baseline: Two disposable members in each Dating/Work/Community workspace; manual cash/transfer records only, no external money movement.

88. Open Payment history. The member control and expense/income totals share the second header row. The member button shows its avatar/count when selected and ends with a chevron; no selection shows All. Select one member with +, then confirm an empty basket to return to All. Check paging and both directions.

89. Record cash received and bank transfer received from another member with amount/currency/note. Cash/transfer menu items and selected trigger use contextual icons/colors. Check matching historical entries, contextual method badge and payer-only notification.

90. Retry the same save; check one receipt. Delete or request/approve a permitted manual refund and verify both histories/counters. No provider gateway is invoked for manual cash/transfer.

91. Switch profile/group and verify filter/context isolation. Global profile totals are not replaced by the selected member subtotal. Alex’s local demo cards/payments match canonical demo amounts/dates and real counterparties.

## MSC115-MIXING — Priority-off Mingle and Tournament

Baseline: Private Community participating manager plus enough members for the chosen existing Mingle/Tournament flow; independent Dating priority control.

92. Create/operate Mingle or a Tournament in a private Community workspace using the existing controls.

93. Check participant-only random mixing without affinity weighting, retained capacity/history rules and no automatic random-room scheduler for the Community base mode.

94. As a participating manager start/advance manually: no own-action notification. Automatic phase changes notify affected participants. Compare the unchanged priority behavior in a Dating workspace.

## MSC115-SERVICE-FEEDBACK — Closure worker and shared Feedback navigation

Baseline: Independent active case ready for completion, accepted customer participants/provider and retained event feedback controls; normal scheduled-message worker enabled for this fixture.

95. In the case-admin card menu verify Start, Complete, Cancel, Trash and Reopen move the case to the corresponding existing bucket. The member sees no admin mutations. Closing the case persists Completed and queues `case.feedback.prepare` through the existing scheduled-message worker; the request does not await feedback preparation. Completing tasks alone does not close the case.

96. Worker preparation creates one review opportunity per accepted customer participant/provider, excluding self-review. **The closing admin remains eligible and receives the automatic ready notification.** Replaying the worker or reopening/completing again does not duplicate opportunities or overwrite an existing review.

97. Open sidebar Feedback. Event and service feedback appear together in the original three-column SmartList; service cards have a different background color. Keep the existing Pending/Feedbacked/Removed/Own status menu, icons, contextual colors and red counters. There is no event/service selector or separate service list. The title and empty labels are generic; Own includes provider feedback received. There is no feedback action in the case card menu. The existing activity feedback badge includes pending service reviews; ready notifications open this surface in Community context.

98. Review quality of work, reliability, communication and value for money in the existing event-style FormFlow using four independent labelled radio/switch criteria with fixed 2/4/6/8/10 scores, no numeric input, slider or free-text field. Missing criteria cannot submit; invalid scores above 10 are rejected. Show the service image/title/provider/case, use the existing placeholder for missing/private images, and never fetch images separately per card. Check remove/restore and submit/reload. Other users cannot submit the reviewer's row. Received/submitted sheets are read-only.

99. Open the provider's service sheet: its common statistics block shows submitted review count, overall mean and the same four criterion means. Community Home discovery uses service-interest criteria (relevance, clarity, confidence and value); completed-work feedback uses quality, reliability, communication and value. Event/Dating criteria and their existing counters remain intact.
   The pending service-review count is a typed part of the existing activity projection; contact, event-expiry and admin-counter updates must preserve it. Reload and verify that the shared Feedback badge still includes both event and service opportunities.

100. Announcement rows place the notice/voting badge at top right, above the shared three-dot button. View opens the actual read-only form; voting appears when the current member has a voting right and no cast vote. Park Court's notice is one announcement linked by subject to one Park Court case; Cases remains the documented cross-community aggregate opened from either navigation entry.

## MSC115-ADMIN — App-admin scope and aggregate badges

Baseline: Ava app-admin with Dating/Work/Community scopes and separate disposable scoped content/parameter controls.

101. Switch Dating → Work → Community above the avatar. The menu structure stays consistent and all opened surfaces use the selected base group.

102. Compare the selector red count with the existing menu counters; inspect moderation, reports, feedback, chat, content/articles, parameters, stats, metrics and graph in each scope.

103. Change a scoped content item or parameter and return to another base group: its data is unchanged. A report retains the actor/action/event and optional group context without granting private-workspace membership.

104. Open payment test tools from each scope and inspect their existing authorization link/context. Operator remains deployment-wide.

## MSC115-JOBS — Per-base-group job ownership and execution

Baseline: Ava app-admin, fixture-owned due job inputs in each base group and recorded initial job history; do not enable absent jobs.

105. Open Jobs in every base group. Confirm independent seeded definitions, enabled state, timing and run history.

106. Run an available scoped job and inspect only that scope’s results, progress, counters and history. Do not enable absent/inapplicable random-room jobs in Work or Community.

107. Inspect Community scheduled-case and vote-close jobs. Confirm shared notification/exchange/processing definitions have separate group items and that an unseeded job does not execute for that group.

## MSC115-GUIDES — Context guides and shared-surface continuity

Baseline: Populated and empty member profiles plus app-admin, all needed independent editor/list records and no pending unsaved business action.

108. Using normal navigation as member then app admin, open each of these surfaces directly: landing/mode selector, login/demo/consent, Home, sidebar, Campaign list/editor/picker/history/Ratings, service Home/list/editor/calendar, Cases/detail/board/task editor/quotations/quotation editor/schedules, private Home/announcement editor/Voting/member voting rights, payment history/receipt, notifications and relevant chats. Prepare a populated and an empty/read-only variant using the approved isolated baseline. Record each context and conditional controls; do not count catalog fields as visible steps.

109. On each open surface click the guide launcher. Check step 1/N, title and localized explanation. Walk Next through every visible step. Each highlight follows the actual visible control; absent targets are omitted and controls behind a fullscreen popup are never highlighted. Run EN and HU, 1280×900 and 390×844 plus a short mobile viewport; guide text fits the established five-line layout and does not cover the active control.

110. Use Back and the step picker, then Done. The guide closes and the underlying surface remains. Open a nested popup through its ordinary control: guide ownership transfers to its visible context. Close guide then child then parent using X/Escape/Back/shade; the parent guide context returns, without repeated registration, stale targets or extra settings loads. Guide-only navigation must not save, vote, rate, publish or mutate business data.

111. Check every visible explanatory action has a current localized guide step. Inspect rating choice and actual Save/Go separately; media open/copy/remove/gallery, passive status badges and popup-opening badges remain distinct. Lists/menus stay scrollable and do not repeatedly reopen between guide steps. Admin Content Editor exposes editable contexts but excludes system contexts, while those system guides work on their actual surfaces.

112. On an article popup or surface without guide targets, Guide shows the persistent compact message “There is no guide for this screen.” / “Ehhez a felülethez nincs útmutató.” Check cold and repeat clicks. X/Escape/Back/shade/another Guide click closes only this message. A real load failure shows the separate retry error. No empty tour, flash or background target is accepted.

113. Switch Dating/Work/Community or close a popup while a request is pending. No late response reopens it or leaks previous profile selections/data. Verify notification unread uses its actual read action; case/task item counters stay unchanged merely by opening the surface. Repeat guide registration, empty/populated and readonly/edit variants in local and HTTP modes.

114. The completed template baseline is closed. Propagate affected shared fixes and record their template impact and source/template revisions. Per the user’s 2026-10-15 scope instruction, execute retained-template local/HTTP checks in the separate MSC115-TEMPLATE-REGRESSION QA checkpoint; they do not block this MSC-115 development closure. Do not repeat completed regression. For Work/Community-only contexts record N/A because those business domains are omitted; do not introduce them into the template.

## KVM sample and closure

Baseline: same candidate revisions and equivalent isolated actor/data state; stop monolith before starting the existing versioned KVM deployment.

115. Verify KVM services, routing and database health. Through the visible browser, create/edit/publish one Work campaign, confirm another eligible actor can see it, reopen/reload it and verify the same saved values. Capture popup/loader timing, requests and in-place card update.

116. In a prepared KVM Community case as admin, add/edit one task and change its status. Check the still-open underlying card and all applicable red badges without list reload, then after normal poll and explicit reload. The member reads the task but a forbidden mutation is denied with unchanged data.

117. Run one prepared due Community scheduled-case occurrence and repeat the worker: one case/reminder, no duplicate. Complete a separate prepared case and verify asynchronous feedback preparation and recipient counters. Capture cross-service failure/retry behavior encountered during these samples; no full KVM campaign PASS is implied.

118. For every defect confirm canonical fix, source revision and template affected/unaffected decision. Record pending template local/HTTP proof in the separate template QA, as specified in114. Record monolith/local/KVM sample results separately. All A01–A12 product failures relevant to this scope must be resolved; separately assigned template and deployment qualification remain tracked in their own QA checkpoints.

119. Revoke disposable integration keys through the existing flow, close only campaign sessions and reset only fixture-owned records/session snapshots. Verify restoration, no duplicate processes, intended final runtime and no real notifications/payments. Update the QA pack, CSV/XLSX, public counts and live handoff; close MSC-115 only for the executed scope, with exact remaining live-deployment items.
