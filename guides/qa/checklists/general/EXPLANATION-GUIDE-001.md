# EXPLANATION-GUIDE-001 — application-wide explanation guide click-through

This case checks that the in-app explanation guide can be opened and completed
on every registered application surface, and that each step explains and points
to its intended control. Popup-opening transitions and unsaved editor validation are in scope. Underlying business transactions are not.
Never save a form, send a message, join/leave an event, confirm checkout, create
a token, or submit any other business action during this case.

Current inventory: 67 explainable screen contexts and 1151 conditional catalog fields.
Runtime progress counts only the targets available on the current surface.
The context and step inventory in
`frontend/src/app/shared/core/local/seed/data/help-center-guide-fields.json` is
the source of truth. For an explicitly limited follow-up, repeat only the changed
surfaces and shared behavior affected by that change.

## Expanded Work/Community scope — 2026-10-06

Status: **REOPENED / NOT RUN** for the newly added/changed surfaces. The September PASS covers only its recorded inventory. Follow [MSC-115](../MSC-115_WORK_COMMUNITY_PAIR_QA.md) for actors, reachable content and latest acceptance rules. The canonical `help-center-guide-versions.json` lists 28 revised contexts. Run EN/HU, desktop/mobile, local/HTTP, visible-target highlighting, popup transitions and empty/populated states for these contexts and their affected shared components. Do not execute business mutations during the guide-only portion.

The startup commands below document the earlier Event-only fixture. Do not treat it as the expanded Work/Community baseline: first inspect retained fixture status and prepare the required actors through the existing versioned harness/launcher. No new full campaign browser delegation is implied by this document; the 2026-10-06 delegation is currently limited to login/logout diagnosis.

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
8. Admin Content Editor must expose every registered context. Verify active compact tour defaults and EN/HU field/section parity in frontend-local and all three Mongo seeds. Phone Chrome and the installed PWA must preserve the same Back priority; installation is separately user-authorized.

Run the full sequence on the populated profile first, then repeat relevant
surfaces on both no-event profiles. At minimum, verify every context on one
profile and verify the populated/empty comparison on Events, Event editor,
Explore, Members, Chat, Resources, Sub-events, Rates, Community groups/feed,
Contacts, and Profile view. Record any context that cannot be reached with its
exact profile and visible prerequisite; do not infer new role eligibility.

## Context inventory

| Context key | Conditional catalog fields |
| --- | ---: |
| `activities.rates` | 40 |
| `home.game` | 17 |
| `chats` | 9 |
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
| `event.chat` | 7 |
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
| `profile.integrations` | 23 |
| `payment.cash.receipt` | 6 |
| `navigation.menu` | 33 |
| `members` | 21 |
| `assets.availability` | 15 |
| `assets.explore` | 27 |
| `landing.home` | 5 |
| `landing.setup` | 5 |
| `landing.demo` | 6 |
| `landing.auth` | 7 |
| `landing.registration` | 32 |
| `community.cases` | 6 |
| `community.tasks` | 7 |
| `community.case.editor` | 7 |
| `community.task.editor` | 13 |
| `work.campaigns` | 12 |
| `work.campaign.editor` | 22 |
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
| `work.campaign.history` | 10 |
| `members.select` | 5 |

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
