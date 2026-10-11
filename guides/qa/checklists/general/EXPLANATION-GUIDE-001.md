# EXPLANATION-GUIDE-001 — application-wide explanation guide click-through

This case checks that the in-app explanation guide can be opened and completed
on every registered application surface, and that each step explains and points
to its intended control. Popup-opening transitions and unsaved editor validation are in scope. Underlying business transactions are not.
Never save a form, send a message, join/leave an event, confirm checkout, create
a token, or submit any other business action during this case.

Current inventory: 118 explainable screen contexts and 1458 conditional catalog fields.
The 37 system role contexts / 136 fields are covered by
[ROLE-GUIDES-NOTIFICATIONS-001](ROLE-GUIDES-NOTIFICATIONS-001.md).
Runtime progress counts only the targets available on the current surface.
The context and step inventory in
`frontend/src/app/shared/core/local/seed/data/help-center-guide-fields.json` is
the source of truth. For an explicitly limited follow-up, repeat only the changed
surfaces and shared behavior affected by that change.

## Template regression and fix propagation — MSC-122

Run the applicable guide checks on the template's selected member/admin/operator
contexts, in EN/HU, desktop/mobile and local/HTTP modes. Use its own guide seed
inventory, not all source contexts. Preserve this case's guide-only boundary:
no business mutations. Carry shared guide-engine, anchor, translation and
launcher-placement fixes into the template and retest the affected surfaces.

Follow the [shared template regression requirements](../README.md#template-regression-and-fix-propagation--msc-122).
Record template impact, propagated revisions and its own targeted result for
each defect; source PASS alone does not close the template follow-up.

## Expanded Work/Community scope — 2026-10-06

Status: **REOPENED / NOT RUN** for the newly added/changed surfaces. The September PASS covers only its recorded inventory. Follow [MSC-115](../MSC-115_WORK_COMMUNITY_PAIR_QA.md) for actors, reachable content and latest acceptance rules. The canonical `help-center-guide-versions.json` records each revised context and its current version. Run EN/HU, desktop/mobile, local/HTTP, visible-target highlighting, popup transitions and empty/populated states for these contexts and their affected shared components. Do not execute business mutations during the guide-only portion.

The startup commands below document the earlier Event-only fixture. Do not treat it as the expanded Work/Community baseline: first inspect retained fixture status and prepare the required actors through the existing versioned harness/launcher. No new full campaign browser delegation is implied by this document; the 2026-10-06 delegation is currently limited to login/logout diagnosis.

## Operator / app-admin wiring audit — 2026-10-07

The earlier wiring audit found missing role contexts and excluded Operator
launchers. MSC-118 has implemented 37 protected system contexts, shared role
launchers/menu preferences and role notifications. Follow the dedicated
[ROLE-GUIDES-NOTIFICATIONS-001](ROLE-GUIDES-NOTIFICATIONS-001.md) checklist and
[development evidence](../../evidence/general/ROLE-GUIDES-NOTIFICATIONS-001-20261007.md).
**Manual role click-through remains NOT RUN.** The prior
[read-only audit](../../evidence/general/EXPLANATION-GUIDE-001-20261007.md#operator--app-admin-wiring-audit)
remains historical evidence of the original gap.

## Historical Event-only profiles

| Window | Profile | Prepared state |
| --- | --- | --- |
| 1 | Nagy Eszter | Existing profile with owned and joined events; exercises populated event surfaces. |
| 2 | Casey Rating QA | No-event `before-meeting` fixture; exercises empty event surfaces. |
| 3 | Nova Rating QA | No-event `before-meeting` fixture; independent session and empty state. |

The fixture is setup data only. Unsaved editor drafts are allowed. Do not submit ratings or persist application content during this guide check.

## Baseline and browser setup

1. Inspect the current branch and preserve existing work; do not switch to the archived September branch. Confirm the existing dev stack and its frontend/backend
   hot-deploy logs. Do not start a second stack or compiler.
Close the admin and payment companion windows through their same launcher entries.
Preserve the user-authorized phone installation; end only the owned QA session.

2. Run `bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status event-rating EVENT-ACTIVITY-RATING-001`.
   If it is `not-staged`, run `stage event-rating EVENT-ACTIVITY-RATING-001 before-meeting`, then `status` and `ready` for that same checkpoint. Do not replace an existing staged baseline.
3. Launch the three configured profiles with the versioned managed
   browser launcher:

   ```sh
   node guides/qa/tools/open-checkpoint-browser-sessions.mjs EXPLANATION-GUIDE-001
   ```

The configured companion checkpoints `EXPLANATION-GUIDE-ADMIN-001` and
`EXPLANATION-GUIDE-PAYMENT-001` reuse this ready fixture and preserve the main
windows. The phone checkpoint `EXPLANATION-GUIDE-PHONE-001` performs anonymous
startup; select the demo identity through the ordinary login UI.

4. Confirm the profile names and the populated/empty event distinction. The
   guide preference starts enabled in the isolated browser profiles.

## Per-surface guide sequence

For every context in the inventory below, use the normal in-app navigation to
open that surface, then inspect the guide through the managed profile. Codex may operate it only with explicit delegation for this checkpoint:

1. Open the floating explanation-guide launcher. Confirm the guide loads for
   the current surface and displays step `1 / N`, a title, and explanatory text.
2. Use **Next** through every step. Record the step ID, visible title, and
   progress at the first failure. For a rendered target, confirm the focus
   outline follows that target and the guide card remains readable. A target absent from an empty profile must be omitted from the sequence and its total. A hidden list behind a fullscreen card must never supply the highlighted target.
3. Use **Back** and the step picker to reach earlier and later steps, then use
   **Done** on the last step. Confirm the guide closes and the application
   surface remains open.
4. Inspect visible actionable buttons. If an explanatory action has no guide
   step, record it as a separate missing step candidate with its context key,
   button label, and profile. Add a dedicated guide field/step and localized
   English and Hungarian label/description through the established help-center
   seed path, then let the existing watcher deploy it and repeat that surface.
5. Click popup-opening controls to verify that the guide transfers to the new surface. An ordinary action, shade click, Escape or system Back ends the guide first. Subsequent Back closes a submenu, then its parent popup or side menu. Never submit a business action.
6. Repeat at 390×844 and 1280×900; exercise a short mobile viewport for nested menus. Text must fit within five lines. Open menus must be highlighted and scrollable, with their guide card visible. Menus must not repeatedly reopen between adjacent steps.
7. Verify Rates and Home have separate slider and Save/Go steps; copy explicitly names the slider and when the value is committed. Verify photo link-copy/remove, gallery navigation, status badges and popup-opening image badges.
8. Admin Content Editor must expose registered editable contexts and exclude
   `isSystem` contexts. System guides still load normally on their own surfaces. Verify active compact tour defaults and EN/HU field/section parity in frontend-local and all three Mongo seeds. Phone Chrome and the installed PWA must preserve the same Back priority; installation is separately user-authorized.
9. On the landing article popup and any other surface without a usable guide,
   click Guide: show a persistent, compact, centered guide-style message,
   EN “There is no guide for this screen.” / HU “Ehhez a felülethez nincs
   útmutató.” Do not flash and disappear, show an empty tour, or use targets
   behind the popup. Verify missing content and absent visible targets, cold
   and repeated clicks, at desktop/mobile sizes. X, Escape, Back, the shade and
   another Guide click close only this message; the underlying surface remains.
   A real load failure retains the separate retry/error explanation. On a
   supported surface, Next/Back/Done and the existing card placement still work.

Run the full sequence on the populated profile first, then repeat relevant
surfaces on both no-event profiles. At minimum, verify every context on one
profile and verify the populated/empty comparison on Events, Event editor,
Explore, Members, Chat, Resources, Sub-events, Rates, Community groups/feed,
Contacts, and Profile view. Record any context that cannot be reached with its
exact profile and visible prerequisite; do not infer new role eligibility.

## WebRTC Help-popup follow-up — 2026-10-07

Status: **NOT RUN manually**. This extends the existing explanation-guide case;
[CHAT-CALL-001](CHAT-CALL-001.md) remains the functional call/media checklist.
Use that checkpoint's verified actors and prepared waiting, incoming and joined
call states. Its setup is separate from stepping through Help. The historical
Event-only launcher above does not prepare a WebRTC call. Revalidate fixture
readiness after a dev demo reset before using the configured call launcher.

1. In both `chats` and `event.chat`, open the guide and find `chat-call` when
   the telephone control is rendered. Explain green availability and the red,
   disabled state. **Next must not start a call.** Check Dating, Work and
   Community so a scoped guide revision cannot hide the new step.
2. In a prepared call, open Help. The context is `chat.call`, with 17 catalog
   fields; the live total includes only rendered targets. Waiting/self-only,
   incoming and joined states must omit absent peer, admin, accept/decline,
   spectrum and browser-audio-unlock controls. No raw i18n keys appear.
3. Walk the visible participant grid, follow-speakers switch, own mic/camera,
   participant mute/video, enlargement, spectrum, bottom controls and close.
   The explanation distinguishes local playback controls from an admin's
   whole-call mute. **Guide navigation never toggles media, joins, declines,
   moderates or hangs up.**
4. Open the existing volume panel through its normal control, then Help.
   The active context becomes `chat.call.volume`, with seven conditional
   fields. The launcher remains available on the compact popup. The `Én`/`Me`
   slider explains incoming playback volume, not microphone gain. Peer steps
   target the controls inside the named participant's block.
5. Close only Help: volume and call stay open. Close the volume panel: its
   guide registration is removed and Help belongs to `chat.call` again. Once
   the functional call check ends the call, Help returns to the parent chat.
   Repeat opening/closing the child panel; no duplicate guide or load loop.
6. In the prepared paged/focused call state, highlight only visible tiles and
   controls, never the hidden page or the chat beneath the call. A missing
   control is omitted from progress. Return to the grid and reopen Help.
7. Exercise Next, Back, the step selector and Done with the existing guide
   behavior. Repeat EN/HU at 390×844 and 1280×900. Preserve the established
   mobile/desktop placement; text and highlighted controls remain readable.
8. Check the new call contexts in Admin Content Editor and check local/Mongo
   catalog parity. Actual calls require the HTTP/signaling fixture; an offline
   seed audit does not prove a working call or a browser Help click-through.

## First-visit guide-button introduction — 2026-10-07

Status: **NOT RUN manually**. Use the existing isolated anonymous landing
checkpoint. Do not clear the user's ordinary browser data or manufacture a
consent record. The existing desktop-beside/mobile-above guide placement and
launcher positioning are regression expectations, not a request to redesign them.

1. On a fresh isolated profile, open the entry page normally. When consent is
   ready, the guide button receives exactly **one** introductory step
   (`landing.guide`, `guide-launcher`, progress `1 / 1`). It explains that the
   lightbulb opens step-by-step help for the current screen, Next/Back/Done,
   that both the lightbulb and bell can be dragged or hidden on the red X,
   and that Side menu → Explanations turns the guide off or back on persistently.
   The short EN/HU text must fit within five lines without cutting off that
   recovery instruction; no extra introductory step or popup is added.
2. Check EN/HU and 390×844/1280×900 with the original responsive positioning.
   The intro points to the visible lightbulb above the consent shade, not to
   a control behind consent. Closing the intro leaves consent pending and
   does not accept, reject or write privacy choices.
3. Close with Done, X, shade, Escape or system Back in separate fresh-profile
   runs. Reopening the page must not auto-show the completed introduction.
   Previously accepted consent must not cause the intro to appear on upgrade.
   Opening another surface or leaving entry cleans up its temporary context.
4. After ordinary consent handling, the lightbulb opens the current surface's
   normal guide. The introduction does not change the internal saved guide
   ON/OFF preference. A drag remains a drag, without also activating the guide.
5. At a prepared logged-in surface with both launchers visible, verify their
   independent hit targets and drag behavior. Never hide or clear notifications
   merely to make this check pass. Drag one over the other, including near the
   top edge; after release both must have separate targets. Repeat in Rates
   list/fullscreen while preserving the stable panel-bottom 56/96px anchor.
   Hide a launcher on the red X; notifications remain accessible from the side
   menu. Verify the Explanations OFF/ON preference survives reload and restores
   the guide. Record the actual surface and viewport for any overlap.

## Consent Accept-button guide — 2026-10-07

Status: full EN/HU manual case **NOT RUN**. The later user-authorized isolated
browser regression passed in EN at desktop and 390px mobile width; see the dated
guide evidence. Use the existing anonymous baseline.

1. With the initial consent open, finish the one-step launcher introduction,
   then click the guide button. Exactly one `landing.consent` step highlights
   **Accept and continue**; it must remain visible instead of flashing closed.
2. The short EN/HU text explains acceptance of the data handling terms, browser
   retention for the current version and a new prompt for a new version. Check
   five-line fit at both existing desktop/mobile sizes and Help placement.
3. Closing/reopening Help and Next/Back/Done never accept consent, change an
   optional choice or dismiss the consent popup. Closing the underlying consent
   restores the landing guide context. Follow the existing consent case for
   actual acceptance/version persistence; do not fabricate a consent record.
4. During content loading or read-only privacy review, the underlying landing
   tour must not open over the document. Repeat opening the normal initial
   consent to check that this temporary suppression does not hide its guide.
5. Close the initial consent **without accepting**. Switch Dating → Work →
   Community → Dating without reloading. Each first selection shows its own
   image set; switching alone does not reopen consent. Login still opens consent
   when the current version is not accepted. Repeat at desktop/mobile sizes.
6. Expand Privacy: its summary appears once, followed by the last-updated date.
   Check EN/HU, then open Help: the step selector must show a translated label,
   not an i18n key. Help itself does not write an acceptance record.
7. With consent closed, check the landing header in EN/HU at 320, 360 and 390px,
   plus desktop. For Dating, Work and Community the group button shows its full
   label and down arrow. Login / Belépés stays on one line; brand, group trigger
   and Login do not overlap. The trigger still opens the existing group menu.

## Shared launcher check during every QA case

Whenever another test exposes the guide and notification buttons, also check
that neither covers the other: both icons/counters remain identifiable and each
has its own usable click/tap area. Check after popup/menu transitions, resize,
paging and drag release when those actions belong to the active checklist.
On consent, also check that the floating button does not cover the acceptance
action. Preserve the existing desktop/mobile positioning and mobile menu hiding
rules. If overlap is noticed in any new test, record the surface, viewport,
state and reproduction in that test's evidence and link `EXPLANATION-GUIDE-001`;
do not mark the surface clean, silently hide a button or redesign the layout.

The 2026-10-07 peer-clearance fix uses registered launcher element references,
not a document-wide launcher search. Desktop checks peers only. Rates keeps its
panel anchor and does not enumerate Save/eye controls. Automated geometry and
operation-count evidence is in
[the follow-up record](../../evidence/general/EXPLANATION-GUIDE-001-20261007.md);
it does not replace these manual UI checks.

## Context inventory

Affiliate/API permissions follow-up: use section 4 of
[INTEGRATION-ACCESS-001](../api/INTEGRATION-ACCESS-001.md). The existing shield
steps belong to `profile.integrations`; the selector uses
`profile.integration-access`. All three workspaces must provide the EN/HU
guide. Manual execution remains **NOT RUN**.

| Context key | Conditional catalog fields |
| --- | ---: |
| `activities.rates` | 40 |
| `home.game` | 17 |
| `chats` | 10 |
| `profile.editor` | 40 |
| `profile.view` | 9 |
| `contacts` | 10 |
| `assets` | 43 |
| `assets.transport` | 27 |
| `assets.accommodation` | 27 |
| `assets.supplies` | 27 |
| `assets.tickets` | 27 |
| `events` | 43 |
| `event.editor` | 79 |
| `event.feedback` | 20 |
| `notifications` | 6 |
| `payment.history` | 27 |
| `profile.impressions` | 4 |
| `community.groups` | 22 |
| `community.groups.explore` | 22 |
| `community.feed` | 27 |
| `events.followed` | 19 |
| `event.explore` | 40 |
| `event.chat` | 8 |
| `event.members` | 21 |
| `event.checkout` | 31 |
| `event.resources` | 30 |
| `event.subevents` | 22 |
| `event.feedback.detail` | 4 |
| `home.filters` | 20 |
| `community.group.editor` | 24 |
| `community.group.policy` | 3 |
| `event.tournament.groups` | 22 |
| `event.mingle.configuration` | 7 |
| `assets.checkout` | 20 |
| `profile.integrations` | 27 |
| `payment.cash.receipt` | 6 |
| `navigation.menu` | 33 |
| `members` | 21 |
| `assets.availability` | 15 |
| `assets.explore` | 27 |
| `landing.home` | 5 |
| `landing.consent` | 1 |
| `landing.setup` | 5 |
| `landing.demo` | 6 |
| `landing.auth` | 7 |
| `landing.registration` | 32 |
| `community.cases` | 6 |
| `community.tasks` | 7 |
| `community.case.editor` | 7 |
| `community.task.editor` | 13 |
| `work.campaigns` | 12 |
| `work.campaign.editor` | 23 |
| `community.home` | 3 |
| `community.voting` | 3 |
| `community.announcement.editor` | 10 |
| `work.home` | 9 |
| `community.services.home` | 8 |
| `community.services` | 6 |
| `community.service.editor` | 21 |
| `community.service.calendar` | 2 |
| `community.case.appointments` | 6 |
| `community.case.board` | 2 |
| `community.case.board.task` | 8 |
| `community.case.quotations` | 5 |
| `community.case.quotation.editor` | 5 |
| `work.campaign.select` | 5 |
| `work.campaign.history` | 11 |
| `members.select` | 5 |
| `profile.integration-access` | 3 |
| `community.service-feedback` | 6 |
| `chat.call` | 17 |
| `chat.call.volume` | 7 |
| `landing.guide` | 1 |

## Landing and form-pagination follow-up

Use the existing `EXPLANATION-GUIDE-LANDING-001` launcher entry for anonymous
landing checks and `EXPLANATION-GUIDE-FEEDBACK-001` for the pending-feedback actor.
Both reuse the verified event-rating baseline and retain the other managed windows.

1. Check the five public landing contexts at 390×844 and 1280×900. The floating
   launcher must clear the version badge and appear on every new landing visit.
   Drag-dismissal lasts through popup transitions in that visit only; it must
   not write a persistent preference or inherit the logged-in guide switch.
2. Open the question-mark help: the existing help remains open, with no nested
   explanation tour. Setup uses the configured, eligible Budapest location.
3. Fill registration Basics, upload three existing seed images, then visit
   Photos, Lifestyle and Review. Check conditional image actions and validation.
   Do not save the profile. Check email/Create controls without submitting auth.
4. On a complete form page, open its arrow explanation and click the real Next
   arrow. The guide closes without jumping; reopen it on the next page.
5. On feedback, inspect the event and every participant card: both required
   questions, one-to-three traits, optional event comment, progress, Next and
   final Submit. Fill unsent answers to reach the overview; never submit.
6. In Rates → Suggestions → Received → fullscreen, inspect Next cards. Click
   the real arrow with the guide open; only the card advances, the guide closes,
   and reopening targets the new card. No rating is saved.
7. On a double image panel, one photo-switch step highlights the first clickable
   segment on each side that has multiple photos (one third for three, one
   quarter for four). An only-photo side is omitted. One profile step highlights
   both eye buttons. Keep each repeated target within the active pair card;
   never highlight the hidden list or preview cards. Check the mobile divider
   explanation and actual drag, plus read-only, fullscreen summary and editable
   list-badge variants. A list badge must open its slider and Save without saving.
8. Check Escape preserves the underlying popup and drag-to-red-X dismisses the
   landing launcher. Record results in this existing General UI case.

## Step-selector and drag-control sample

On populated Home and one popup, sample the middle guide step selector at mobile
and desktop widths. Check the Explanations header, viewport fit, tab switching,
step selection and close action. Drag the floating guide/notification launcher:
the red X with white icon must remain visible above the shade and other overlays.

## Launcher defaults and collision follow-up

1. On the isolated anonymous profile, clear the origin's browser site data using
   the browser's storage-deletion API (no fabricated consent record). Reopen the
   landing. The initial consent must appear automatically with Accept and continue.
   On mobile (up to 760 px), the floating launcher must sit at least 8 px above
   its footer if they overlap. Desktop positioning is unchanged.
   Accept through the UI, then reload: consent must remain accepted and the
   launcher must return to its normal position when clearance is unnecessary.
2. On Home and Activity Rates → Suggestions → Given → fullscreen, check both
   floating launchers against the visible rating action and profile eye buttons.
   On mobile, overlapping launchers move above those controls with a small gap and preserve
   their rail order. Ignore controls belonging to covered/hidden cards.
3. Repeat at 390×844 and 1280×900. Drag a launcher away from the controls: its
   release position must not jump. Drag to the red X still dismisses it.
4. With no stored internal guide preference it starts ON. Switch OFF through the
   UI, reload, and visit the landing: internal OFF remains saved while the public
   guide is visible. Return internally and verify OFF remains; restore the test
   profile's initial setting. Migration must not overwrite an explicit preference.

## Pair-divider input stability

On both Home and Activity Rates double panels, hover, press, tap and stationary
finger hold must leave the divider's position, size and split ratio unchanged.
Only actual dragging changes the ratio. The handle stays under the finger and
must not jump on release. Reverse the test drag to restore the initial ratio.
On mobile, photos use the fully opened pane width at every split: dragging
changes the visible crop, not the image scale. Exercise both fully opened ends
and restore the ratio. Use the same full-pane `contain` fit on Home and Activity Rates mobile pairs;
preserve the desktop appearance.
Check the 390 px browser viewport and the connected Android Chrome using the
versioned phone launcher and ADB input. Desktop must not expose the mobile grip.

QA screenshots are local diagnostics under `/tmp/myscoutee-guide-screenshots`;
keep only text/JSON evidence in Git.

## Close and restore

1. Close the guide-test windows with the same versioned launcher:

   ```sh
   node guides/qa/tools/open-checkpoint-browser-sessions.mjs EXPLANATION-GUIDE-001 --close-only
   ```

Close the admin and payment companion windows through their same launcher entries.
Preserve the user-authorized phone installation; end only the owned QA session.

2. Run `bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh reset event-rating EVENT-ACTIVITY-RATING-001` to restore the captured profile and session baseline. Confirm `status` reports `not-staged`.
3. Record actual context/step counts, profile-specific differences, missing
   explanations repaired, and any unvisited context in the dated evidence and
   QA matrix. A static seed audit alone is not a runtime pass.

### Final shared UI follow-ups

- On mobile Home and fullscreen Rates, drag the divider to both endpoints. Guide and notification retain their vertical positions, ordered above the eye row. Tap/hold alone must not move the divider or launchers. Keep desktop positioning unchanged and mobile photos at the accepted `contain` fit.
- Next/Back guide navigation must retain the mounted guide card and reposition it without closing/reopening it.
- For the explicitly requested filter follow-up, preserve the actor's preferences, change one selected option, apply and reload, then restore it. The Home filter badge counts selected options plus narrowed ranges, independently of the discovery result total and Ratings badge.


## MSC-119 — complete MSC-114 onward guide wiring audit — 2026-10-07

Status: **REOPENED / NOT RUN**. Earlier PASS evidence does not cover this extension.
Source audit: [MSC-119 guide wiring](../../evidence/general/MSC-119_GUIDE_WIRING_20261007.md).
Use the existing fixture and managed-launcher rules. Guide navigation must never
execute ratings, votes, client generation, permission saves or other business actions.

1. On an actual no-guide surface, confirm that the translated “Explanations” /
   “Magyarázatok” heading shares the X button's header row. Repeat for a genuine
   load error. X, Escape, Back and the launcher retain their existing behavior.
2. Open Work home, Community service discovery and a community noticeboard.
   Each must show its own guide, including empty-list states; no missing-guide
   message caused by an absent surface root. Open and close child windows, then
   verify that the parent guide is restored. Repeat after changing workspace.
3. Follow the Work campaign list, editor/details, campaign-specific ratings,
   aggregate ratings, history and member selection. Check read-only history text:
   it explains reading images and documents, not editing or uploading them.
4. Follow Community cases, scheduled tasks, the case board and task editor,
   quotations/editor, services/editor/picker/calendar and completed service
   feedback. Verify each available card-menu action has its matching explanation;
   hidden actions must not create phantom steps. Verify all plus/header controls,
   selected-member labels, date/frequency fields and read-only states.
5. Open task quotation and dependency pickers. Their own guides cover available
   cards, selection basket, apply and close; closing restores the task guide.
   Do not apply or save selections in this guide-only case.
6. From quotation work/refund terms, open the shared terms list and term editor.
   Verify their independent `policies.list` / `policies.editor` contexts, translated
   field descriptions and return to the quotation guide. Repeat in an existing
   Event form because the same shared component owns both uses.
7. Service feedback highlights four independent labelled choices, carousel
   navigation and submit. Check the service image identifies the subject.
   Do not submit answers. This differs from the discovery interest criteria.
8. Follow API / MCP settings, the four-pack permission window, the actual help
   popup, Advanced, client technical details and OAuth authorization. Each child
   has the right context and restores the parent after close. Check Main Blocked
   versus new-client Write defaults, draft tick versus parent save, role-only
   statistics, Read versus Full/Events, and AI-provider support descriptions.
   Authorization approval and key generation belong to the separate API cases.
9. Revisit affected Side-menu entries and the existing MSC-118 role guide pack.
   Protected system-guide metadata and administrative editor exclusion must remain.
10. Repeat changed surfaces in EN/HU, desktop/mobile and frontend-local/HTTP.
    Verify the same current sections in Dating, Work and Community; an old scoped
    revision must not hide newer fields. Test a pre-existing system seed upgrade
    through the normal seed flow and preserve an administrator-edited revision.
    Record screenshots and actual step counts only after execution.

Functional/browser execution, layer placement and device-specific rendering:
**NOT RUN**. Compilation and seed/contract checks are development evidence only.
