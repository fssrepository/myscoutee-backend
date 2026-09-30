# Explanation guide QA — 2026-09-30

Status: **PASS / CLOSED in the recorded guide scope, including the accepted mobile and launcher follow-ups**.
The user delegated full-flow guide testing, fixes and desktop/mobile checks.
Final inventory: **45 contexts, 963 conditional fields, English and Hungarian**.
The chronological initial runs below covered 40 contexts / 896 fields.
These are catalog counts, not a claim that every conditional role/state branch
was present in the fixture. Runtime progress uses available targets.

## Changes and evidence

- Compact **v4 tours** are active for all 40 contexts in EN/HU in frontend-local
  defaults and all three Mongo seeds. The public HTTP endpoint returned all
  80 matching revisions. The compiled local seed repository produced all 80
  matching revisions in its normal fresh-bootstrap contract. Local persistence
  across an ordinary local deployment reload was not exercised: this running
  deployment uses HTTP and disables local storage hydration.
- Admin Content Editor exposes **40/40** routes at 390×844 and 1280×900. The
  create button measures 30×30 with 50% radius. Final route audit retained below.
- Removed guide targeting of the invisible SmartList beneath fullscreen rating
  cards and inactive stacked profiles. The real image slice and profile action
  supply geometry. Rates has separate **slider and Save**; Home has **slider
  and Go**. Copy explicitly explains the slider and when the value is committed.
- Open menus now supply their actual bounds for guide positioning. Fixed menu
  panels escape their trigger's scrolling ancestors, including when the target
  itself is fixed. This repaired the mobile Summary currency blank/dim guide.
  Its three steps pass at both widths; the after screenshot is retained.
- Guide scrolling temporarily selects SmartList's existing `none` snap mode.
  Mandatory row snapping previously pulled an offscreen status chip back out
  of view and left the guide waiting. The populated Events **20-step** tour
  now passes on mobile and desktop. Normal snap reactivation follows the
  existing deferred-until-scroll behavior when the guide closes.
- Side-menu pencil → profile and profile pencil → gallery transfer the guide.
  Opening-mobile-animation geometry no longer prematurely dismisses it.
  Gallery **7 steps** include separate link-copy and remove actions. Both icons
  are 16px, with measured center deltas 0/0 at both widths.
- The user explicitly requires the floating guide button **above the grey guide
  shade and above notifications**. It remains visible during a tour; the rail
  uses at least z-index24060, with guide slot2 above notification slot1. A native
  hit test confirmed the guide button is topmost. These draggable launchers can
  overlap underlying content: one 390×900 Rates profile-center diagnostic saw
  the launcher; the 390×844 retest hit the profile button. They are intentionally
  not hidden to manufacture a zero-occlusion result.
- Asset Explore's date input now has the shared guide metadata in all three
  popup date branches. Both widths pass **12 steps**, including the date filter,
  card three-dot actions, owner/member badges and Borrow explanation.
- Payment history now covers the actual row-menu ID, row status, summary,
  organizer/asset-owner contact, conditional refund/cash actions, summary
  currency and saved-card menus. Runtime examples: populated member11,
  owner-income10, saved cards6, summarycurrency3, asset payment summary8 steps.
  Owner availability with earlier requests passes10 on both widths; Borrow
  review was inspected without submitting a request or payment.
- Group editor rules11, policy3, members10 and exploration10 pass both widths.
  Tournament groups16 pass 390×844, 390×560 and1280×900, including group menu
  anchoring and inner scrolling. Mutation observation recorded one open/close
  per menu, not repeated reopening on each adjacent guide step.
- Event creation23, tournament stage14, checkout19, normal subevents12 and
  resource branches were traversed without saving. Mobile Mingle7, eventchat7
  and feedback detail4 complete the remaining mobile subviews. The readonly
  event image badge transfers into the image-view guide.
- Empty Casey/Nova profiles correctly reduce available steps: Home2, Events7,
  Groups5, Feed4, Contacts5. No absent card is highlighted.
- Feed image draft checks: empty gallery5, image draft8, details4, event chooser5;
  missing required event shows a red pencil and disables Save. The upload
  response was intercepted with an existing fixture image. This proves frontend
  validation, **not a real backend media upload**.
- Escape, shade and Back dismiss the guide first. Further Back dismisses an
  opened submenu, then its popup/side menu. Popup-opening actions transfer the
  guide; ordinary clicks end it. Both desktop/mobile checks and actual Android
  KEYCODE_BACK runs in Chrome and the installed PWA passed.

## Phone and execution boundaries

The user authorized installation. The local PWA was installed as
`org.chromium.webapk.a5c3f9fb9cc58ea84_v2`; standalone mode and the app service
worker were verified. This is **Chrome/PWA evidence, not a native Android
WebView wrapper claim**. The device was disconnected before final cleanup;
ADB lists no device or retained host forwards. The installation is retained.
The localhost8080 development app needs its ADB reverse connection to reach
this dev stack again. No personal browser tabs or permission settings changed.

Only the existing frontend-sync watcher compiled the changes; its final
recorded build completed at 2026-09-30T01:51:25.888Z. No parallel Angular/Java
compiler, unit runner or second server was started. Separate unit suites were
not run. Source/seed validation passes: 896 unique fields, matching section IDs,
80 active tours per Mongo seed, both languages, 11,380 synchronized messages.
All measured guide descriptions fit at most five lines at the tested narrow
body width. Business commits, payments, refund requests, joins, messages and
credential creation were not submitted.

## Resolved demo data defect

The authenticated demo HTTP response for Nagy Eszter reports zero pending
feedback rows but `eventFeedback.pending=1`. Both retained feedback states are
submitted; the canonical demo user seed also contains the stale1. The own-event
count1 is independent and is not changed. E2E already has pending0.

The exact one-field correction is prepared in
[`guide-feedback-seed.patch`](EXPLANATION-GUIDE-001-20260930/guide-feedback-seed.patch),
with the authenticated response in
[`guide-feedback-diagnostic.json`](EXPLANATION-GUIDE-001-20260930/guide-feedback-diagnostic.json).
The user explicitly authorized the demo-user reload. The prepared one-field
correction was applied and the existing Mongo watcher imported all 78 users
successfully at 2026-09-30T02:04:55Z. Read-back confirmed pending0 while
ownEvents1 remained. The retained patch is historical evidence, not pending work.

The later Event badge investigation is separate from guide coverage. The expiry
batch implementation was restored at the user's request; it is not refactored.

## Retained artifacts and reproduction

The [artifact directory](EXPLANATION-GUIDE-001-20260930) contains chronological
runtime diagnostics and retests, active/local/admin audits, real phone Back
records, menu observations and selected screenshots. Earlier failed checks
remain in `runtime-runs.json`; the successful final named runs above supersede
them. Menu option values such as currencies, languages and filter choices are
explained by their owning selector step and do not each require a catalog field.

Use the versioned fixture and launcher in the
[stable checklist](../../checklists/general/EXPLANATION-GUIDE-001.md). Focused
replays attach only to those managed sessions:

```sh
python3 guides/qa/tools/explanation-guide/audit-seeds.py
node guides/qa/tools/explanation-guide/ratings.mjs
node guides/qa/tools/explanation-guide/image-actions.mjs
CHECKPOINT=EXPLANATION-GUIDE-PAYMENT-001 node guides/qa/tools/explanation-guide/currency.mjs
```

Fixture/session cleanup is recorded in `cleanup.json` once completed. The approved demo pending-feedback correction is applied.

## Overlay follow-up — 2026-09-30

The guide step selector was sampled through CDP on Home and Events at 390×844
and 1280×900. All four panels fit inside the viewport and their header hit tests
landed inside the menu. A missing mobile title was reproduced and fixed using
the existing AppMenu `title` input. The existing EN/HU `explanations` key supplies
the title. The redundant max1 hint was removed; selection still navigates to
one guide step. The populated mobile Home sample was reopened and left visible
at the user's request. These are sample checks, not a second full tour campaign.

The drag-dismiss X uses exactly the launcher's dynamic layer (minimum24060),
a red background, white icon and light border. Screenshots at both widths show
it above the active guide shade. Its pointer-events remain none: dropping is
handled by the existing drag target geometry, not by an X click handler.
The existing frontend watcher completed the corrected build at
2026-09-30T02:23:36.963Z. No separate compiler/test runner was started.

Evidence: [overlay measurements](EXPLANATION-GUIDE-001-20260930/overlay-followup.json),
populated mobile selector (local screenshot; excluded from Git),
mobile drag X (local screenshot; excluded from Git),
desktop selector (local screenshot; excluded from Git).

## Separate Past/badge follow-up — subsequently closed

The investigation below is historical. The requested server regression was
subsequently verified and closed in
[the focused expiry evidence](../event/EVENT-PAST-BADGES-001-20260930.md).

The popup's first Events dropdown now binds to All. The side-menu binding was
not changed. The normal Event mutation counter refresh previously included
ended events. The narrow end-time filter and local repository equivalent have
been added, and canonical demo Event counters regenerated using the existing
seed generator's counters-only command. All78 users reimported successfully;
Nagy Eszter reads All25, active6, pending2, invitations5, hosting12. Feedback
remains pending0/ownEvents1. These changes are not proof of a complete lifecycle
job regression.

`ActivitiesEventsService.toSortProjection` classifies Past by end time (start
fallback), independently of expired. `EventCounterExpiryService` selects active,
not-yet-expired records after that boundary; its existing batch counter refresh
retains pending/drafts and does not refresh Ticket counters. Already-expired
records are not selected again just because a badge became stale. The user's
explicit instruction was to retain this batch implementation: the service and
its test match HEAD exactly. No job was merged, replaced or added.

Time-bound scope found: Event scopes and subevent/slot views, Tickets, and
Followed event totals. Followed has its existing nextExpiryAtIso path invoked
by the Event expiry worker. Rates is explicitly excluded: its buckets do not
expire. A general application-wide Past counter job has not been found or
implemented. Do not infer that every historical list's badge must decrease:
asset ownership, pending decisions and archived records require their own
existing counter contract.

Open verification: reproduce the stale-counter transition on an isolated
fixture, including already-expired records and all applicable time-bound
counters. The attempted event-schedulers stage was rejected before mutation by
older active fixture markers. The reported affiliate-exchange-operator marker
has no snapshots, so no claim is made that it was restored. Guide sampling used
the existing isolated event-rating baseline instead. Java regression source was
added; the separate unit runner was not run. The existing backend watcher built
the restored batch implementation successfully.

### Why expiry was introduced

Repository history identifies `a26069e16` (2026-06-02, “fix expire event”) as
the introduction of EventCounterExpiryService. Its original scheduled method
was named `expirePastEventCounters`: it already refreshed invitations/events/
hosting after the end boundary and then persisted expired=true so the same
records would not be selected on every pass. Commit `1ee1c50e8` moved its
scheduling into EventScheduler and added the stale-hosting-counter E2E flow.
It was not originally a separate, unrelated expiration mechanism.

Past remains an immediate read-time time classification; expiry performs stored
side effects asynchronously. Current expired consumers also reject check-in
and participant invitations; changing an event's time boundary resets the flag.
No second application-wide Past job exists in the inspected registration.
The original job has since acquired feedback/friendship/following projections,
which is another reason not to replace its batch implementation during guide QA.

The concrete stale-count risk is separate: a normal mutation could recount Past
records after the worker had already marked them expired. The existing worker
would then skip them; pending/drafts and Ticket counter coverage also require a
separate lifecycle regression. Rates is outside this investigation by design.


## Landing and editable-feedback follow-up — 2026-09-30

The user explicitly limited this follow-up to the new landing surfaces, then
added feedback and the Rates arrow-only bucket. The earlier 40 contexts were
not replayed. Current canonical inventory is **45 contexts / 963 fields**:
53 landing fields, seven conditional feedback-form fields and seven pair-card
fields were added.
The same General UI matrix row is retained; no new QA case was introduced.

The landing reuses the internal guide engine, popup and extracted floating
launcher. Its separate instance loads through the existing HTTP/local
LandingContentService and now has independent, visit-scoped dismissal (no persistent preference). The anonymous endpoint
accepts only the five public context keys. The question-mark help document has
no nested tour. The launcher clears the version badge by 10 px at mobile width
and 4.48 px at desktop width.

The first setup attempt used the launcher's inherited Austin location. The
existing regional login gate correctly rejected it. The versioned anonymous
launcher now uses eligible Budapest; neither the gate nor production location
rules were bypassed. No auth account or profile was saved. Three existing seed
images were uploaded into the unsaved registration form.

A concrete feedback defect was reproduced: the editable form exposed only its
Close explanation. The existing form-control model now accepts an optional
stable guide field ID, used by the existing feedback converter for both required
questions, traits and optional event comment. Existing progress/Next/Submit
markers complete the form tour. This does not change feedback submission logic.

A normal form action immediately hides the old guide card while the existing
popup-transfer check runs. This prevents the outgoing page's anchor moving the
guide during a slide. A non-popup action still ends guide mode; the user can
reopen it on the next card. No new animation or navigation mechanism was added.

Verification through the existing dev stack and prepared launcher sessions:

- `landing-smoke.mjs`: PASS at 390×844 and 1280×900, **64 visible guide steps
  per viewport**. Home, demo roles/member card, setup, empty/filled registration
  images, lifestyle, review, auth providers and email/Create were exercised.
  Version clearance, help-on-help exclusion, valid-page slide exit, Escape and
  drag dismissal passed. Required fields were filled; final profile Save and
  auth submission were not clicked.
- `feedback-smoke.mjs`: PASS at both viewports, **39 guide steps per viewport**.
  Event plus all four participant cards were filled and reviewed. Empty required
  answers disabled Next; final Submit became enabled but was not clicked. The
  guide stayed fixed until hidden on a real Next click; reopening on each new
  card used that card's controls. Text remained within five lines; no missing,
  covered or off-viewport targets were reported.
- `rating-arrow-smoke.mjs`: PASS at both viewports. Suggestions → Received in
  fullscreen has no Save button. The `pagination-next` explanation targets the
  actual Next item arrow. Clicking it closed the guide without a position jump,
  advanced the visible card and allowed the guide to reopen. No rating was saved.
- Public anonymous HTTP: ten allowed context/language combinations returned 200;
  internal, removed-help and unknown contexts returned 404.
- `audit-seeds.py`: 45 contexts / 963 fields; EN/HU and frontend-local/demo/e2e/
  production seed parity passed. Each Mongo seed has 90 active compact v4 tours.
- Existing frontend/backend hot-deploy builds passed. No parallel compiler or
  unit runner was launched. This follow-up used the HTTP dev UI; full local
  persistence and a new physical-phone/native-WebView run are not claimed.

Evidence: [landing mobile](EXPLANATION-GUIDE-001-20260930/landing-checks-390.json),
[landing desktop](EXPLANATION-GUIDE-001-20260930/landing-checks-1280.json),
[feedback mobile](EXPLANATION-GUIDE-001-20260930/feedback-checks-390.json),
[feedback desktop](EXPLANATION-GUIDE-001-20260930/feedback-checks-1280.json),
mobile arrow (local screenshot; excluded from Git),
[rating arrows](EXPLANATION-GUIDE-001-20260930/rating-arrow-checks.json),
[anonymous HTTP](EXPLANATION-GUIDE-001-20260930/landing-public-http.json).

The separate Past/badge lifecycle investigation above remains PARTIAL. The
expiry batch service was not edited during this landing/feedback follow-up.


### Shared double-panel highlight follow-up

The user requested a single explanation for matching controls on both panes,
not duplicate left/right steps. Pair images now share `pair-images`, and both
profile eyes share `pair-profiles`, within an explicit repeated-control scope.
The existing overlay renders separate focus rectangles and shade cutouts for
those matches, using their combined bounds to place the one explanation card.
Ordinary repeated list rows remain single-target. Hidden previews are excluded.

`pair-panel-smoke.mjs` passed for Home and Rates at 390×844 and 1280×900.
Rates exposed 3 + 2 photos: the first third and first half were highlighted
simultaneously. Home exposed 1 + 2 photos: only the multiple-photo side was
highlighted. Both profile eyes were highlighted by a single step. Only the active
pair card supplied targets. All sampled descriptions fit within five lines.

The mobile-only divider has a distinct step on both surfaces. An actual Home
drag changed the split from 50% to 60.94%, then restored it. Its previous invisible
full-height hit strip intercepted the left profile eye; the hit area is now
limited to the visible middle grip, preserving the grip's appearance and drag.

The received pair score and editable fullscreen score summary have separate
explanations. Fullscreen badges remain intentionally noninteractive. In the
editable list, the central badge explanation points to the actual badge and a
real click opened the slider and Save. No rating was saved. An initial hypothesis
that the fullscreen badge's disabled pointer style was a defect was rejected
following the converter trace; that style was retained.

Evidence: [Home double panel](EXPLANATION-GUIDE-001-20260930/pair-home-checks.json),
[Rates double panel](EXPLANATION-GUIDE-001-20260930/pair-rates-checks.json),
mobile divider (local screenshot; excluded from Git),
two image slices (local screenshot; excluded from Git).


After the shared multi-target renderer changed, the full 39-step mobile feedback
form run was repeated successfully, including valid-card guide exit. The landing
Home's three steps were also repeated at both widths; single-target shade,
placement and click behavior remained correct. See
[single-target regression](EXPLANATION-GUIDE-001-20260930/landing-highlight-regression.jsonl).


## Launcher visibility and control clearance — 2026-09-30

Landing dismissal is now scoped to the current entry visit. Popup transitions
retain dismissal; a new visit/reload shows the guide again. The internal guide
still defaults ON only when its browser preference is absent, preserving an
explicit OFF. It is not a Mongo user setting, so no database preference rewrite
was introduced. `landing-visibility-smoke.mjs` passed at both viewport sizes;
`guide-preference-smoke.mjs` proved UI OFF/reload/public-entry/internal-return and
restored the initial missing preference.

The reported fresh-browser consent issue was reproduced using native CDP
`Storage.clearDataForOrigin` (`storageTypes: all`) and cookie deletion on the
isolated anonymous profile, then normal landing navigation. This replaced an
initial, rejected diagnostic using only consent-key removal. No application
state method or fabricated consent value is used in the retained regression.
Before the fix, the 42 px guide button at y=758 overlapped the consent footer
starting at y=779 by 21 px on 390×844. The Data privacy link opened earlier was
a separate view-only test, not evidence of the initial consent path.

On mobile widths up to 760 px, the shared FloatingLauncher now measures the visible consent footer, rating/form
commit buttons and profile eyes after render/scroll/resize. An overlap temporarily
lifts the launcher 8 px above the control. Both guide and notification reuse this
one implementation; ordered clearance keeps them apart. Hidden or covered card
controls are excluded. No polling, server I/O or business-flow change was added.
Manual drag commits the visible drop location without jumping when clearance is
no longer needed; red-X behavior is retained.

`launcher-clearance-smoke.mjs` passed all three scenarios at 390×844 and 1280×900:

- **Consent:** real automatic initial popup, visible accept action, 8 px mobile
  clearance; UI acceptance removes the footer and restores launcher position;
  reload preserves consent. Desktop retains its original position; no automatic lift is applied there.
- **Activity Rates fullscreen:** Save and both pair-profile eyes remain clear
  of guide and notification; mobile buttons sit above the right eye with a gap.
- **Home fullscreen:** Go and the profile eye remain clear of both launchers.
  Both internal scenarios verify manual drag without a release-position jump.

The existing landing drag-to-X/hidden-across-popups/reload test was repeated after
this shared change and passed at both widths. No rating or final profile form was
submitted. Existing frontend-sync compilation passed at 04:01:36Z; no separate
compiler or unit-test runner was started.

Artifacts: [consent](EXPLANATION-GUIDE-001-20260930/launcher-consent-checks.json),
[Home](EXPLANATION-GUIDE-001-20260930/launcher-home-checks.json),
[Activity Rates](EXPLANATION-GUIDE-001-20260930/launcher-rates-checks.json),
[landing visibility](EXPLANATION-GUIDE-001-20260930/landing-visibility-checks.json),
[internal preference](EXPLANATION-GUIDE-001-20260930/guide-preference-checks.json).
The same EXPLANATION-GUIDE-001 matrix row is updated. Release 1.3.2 remains
explicitly paused by the user; no squash, merge, tag, push or deploy was performed.


### Input-stability correction and real-phone check

The user clarified that automatic launcher clearance is mobile-only. Desktop
now explicitly bypasses that adjustment. Launcher measurements use the stable
menu host rather than the button's temporary visual geometry. The draggable
launcher's pressed style also retains its size. Hover, press and stationary
hold were checked separately from deliberate test drags; test drag positions
are now restored before leaving the browser.

The cropped screenshots also identified the **pair-card divider**, not merely
a launcher. Reproduction showed the global interactive-motion rule replacing
`translateX(-50%)` with hover translate/scale: the handle shifted about 18 px
while the split percentage stayed unchanged. The fix is the existing
`data-motion="none"` opt-out on that single button. No pair drag algorithm,
ratio persistence, resize bounds or business behavior changed.

`pair-divider-input-smoke.mjs` passed on Home and Activity Rates: mouse hover,
press/release, touch tap, stationary touch hold, stepwise drag and reverse drag.
The grip stays at its original position until actual movement, follows each
5 px touch delta, and does not jump on release. Desktop has no mobile grip.
The Android checkpoint launcher verified the retained event-rating baseline
and opened the local forwarded origin without injecting consent/login/state.
On the connected Xiaomi 22126RN91Y, Activity Rates was tested with real Chrome
through ADB: touch tap/hold/drag/release and restoration passed. Physical-device
results are separate from browser viewport emulation. Home coverage here is the
browser viewport, not a claim of phone Home or native WebView coverage.

The first phone launcher probe was discarded: it overlapped navigation on the
phone and its input no longer hit the sampled control. It was not product-failure
or acceptance evidence. The retained divider test asserts the native input hits
the intended handle. No database state or consent flag was fabricated.

Artifacts: `pair-divider-home-checks.json`, `pair-divider-rates-checks.json`, and
`pair-divider-rates-phone-checks.json` in the existing evidence directory.
All 79 guide screenshots present in the worktree (66 previously tracked) were
moved to `/tmp/myscoutee-guide-screenshots`; screenshot writers now use that local
folder. The old screenshot files are removed from the pending change, and an
ignore rule prevents reintroduction. Removing them from the final squashed
branch history remains part of the paused release; no history rewrite was run.


### Fixed photo scale during mobile pair dragging

The user additionally requested full-pane image sizing while dragging, on mobile
only. The existing pair grid is now a CSS inline-size container; its image
background is painted on a full-pane-width pseudo-element. The current pane clips
that image. The existing lazy-background loader, gradient, profile text, photo
segments and desktop sizing remain in their owners. No image or drag service was
added. Home retains `contain`; Activity Rates retains `cover`, as on their single
cards. Thus Home can letterbox, while Rates crops more closely.

Both browser scenarios passed the input suite again and opened both endpoints
(0% and 100%): canvas width and height remained constant at 50%, intermediate
splits and either fully opened side. The desktop pseudo-element is absent and
the mobile divider remains hidden there. The real-phone suite also covers these
endpoints and native ADB tap, stationary hold and drag. Native return positioning
is compared within one physical pixel because Android rounds injected coordinates;
the original overly strict 0.1 CSS-pixel restoration assertion was corrected after
observing a 0.125 CSS-pixel residual. No product snapping was added to hide it.

The reported possible stretching was checked against both source images: each is
960×1280 (3:4). Rates uses a 341.406×628.297 canvas at 390 px; `cover` draws the
source at approximately 471.223×628.297, preserving the same 3:4 aspect ratio.
The closer faces are cropping/zoom from cover, not independent X/Y stretching.
See `pair-rates-image-aspect-checks.json`. Final existing watcher build passed
at 04:09:03Z. Screenshots used for visual review remain outside the repository.


### Mobile pair fit unified after screenshot comparison — 2026-09-30 06:17

The earlier fixed-canvas change preserved Home contain versus Rates cover. That
was an incomplete interpretation: the user also required the same visual sizing
on both mobile surfaces. Their screenshots made the remaining close-up/crop
difference explicit. The shared pair grid now sets the existing
`--rate-card-image-fit: contain` inside its max-width 760 px rule. The fixed canvas
still prevents image rescaling while dragging. Desktop and list-card fit are
unchanged. The earlier cover/aspect measurements above describe the superseded
Rates mobile behavior, not the final fit.

The existing watcher compiled this correction successfully at 04:16:53Z. The
focused Home/Rates divider check now explicitly requires contain in both places,
in addition to stable hover/tap, drag/release, both fully opened ends and absence
of the mobile override on desktop. Screenshots remain local-only.

Both focused browser scenarios passed after the correction; the 390 px Rates
screenshot was visually reviewed. This final fit-only adjustment was not rerun
on the physical phone; the preceding divider/ADB result remains separate.

## Final mobile and guide follow-up — 2026-09-30

- Shared mobile launcher rail reserves the visible fullscreen card's eye row even at a 0/100% split. Home now has guide above notification above the eye; desktop offsets remain unchanged.
- `SCENARIO=home` and `SCENARIO=rates` pair-divider input checks passed with unchanged launcher geometry through tap/hold/drag and both fully open endpoints. `PHONE=1 SCENARIO=home` passed on the connected Android Chrome including native ADB tap, hold, drag and restore. Images retain the accepted mobile `contain` fit with a fixed canvas; no photo crop was added.
- `step-continuity-smoke.mjs`: all 14 available mobile and 13 desktop Home guide steps retained the same mounted card, with zero removals and every position inside the viewport.
- `filter-badge-smoke.mjs`: the Home badge now counts selected options and narrowed ranges, independently of remaining discovery results. Real HTTP UI save/reload changed gender selection from one option to two and restored it: badge 1 → 2 → 1, results 6 → 8 → 6, Ratings counter remained 109. Original preferences restored. Earlier attempts used the private Casey actor (no discovery controls) and an Escape that closed the draft; these were harness errors and did not submit preferences.
- Existing backend registration and local repository defaults select the opposite gender and retain explicit saved choices. All 56 stored preferences in each demo/e2e seed matched that rule; production seed contains zero synthetic users/preferences. Existing registration tests cover both genders and explicit clearing. No new registration or local persistence run is claimed in this follow-up.
- Guide seed audit passed: 45 contexts, 963 fields, 90 active EN/HU compact v4 guides in each of demo/e2e/production, aligned with the local catalog.
- Existing frontend-sync build passed at 04:28:28Z. No parallel compiler was started. Screenshots remain under `/tmp`, outside Git.
- User resumed completion toward release after the temporary pause. Release actions and artifact identities will be recorded separately.


## Physical-phone performance follow-up — in progress, 2026-09-30

The user reported slow Rates list/fullscreen switching and a stuttering pair
divider. Earlier input-position PASS results prove geometry, not smoothness.
The physical Android Chrome/dev-build measurements confirmed the report:
user-driven fullscreen transitions had first-paint upper-bound samples around
700–800 ms, versus approximately 170–200 ms back to list. This is not a release
performance PASS. The temporary passive meter records RAF timing, event queue
delay, long tasks, switches and drags; its canvas updates at 5 Hz. Raw profiles
and user captures stay under `/tmp`, never in Git.

Changes under focused verification: consume the divider's duplicate touch and
pointer move streams before page-wide menu listeners; retain mobile photo/handle
compositor layers; replace the inherited split custom property with direct pane
and divider styles; synchronize fullscreen selection without an extra RAF;
remove the permanent rating bar's menu-entry animation and irrelevant anchored
menu geometry reads. The accepted fixed `contain` canvas remains unchanged.
No lazy loading or intentional delay was added to Affinity. Actual user switch
samples confirmed Affinity and card become visible in the same sampled frame.

The shared launcher menu-exclusion change initially also hid both launchers
behind the permanent rating bar. This regression was corrected by excluding
bottom-docked panels and selecting only a menu's own panel. Both launchers were
observed visible again with the fullscreen rating bar. The divider regression
now checks computed visibility as well as positions. Active-guide auto-opened
menu coverage remains to be rerun; normal menu test preparation was interrupted
when the user took over the phone.

`phone-performance-meter.mjs` installs on the retained Android page without
navigation or app-state edits. `--collect` saves bounded measurements to
`/tmp/myscoutee-phone-performance.json`; `--collect --stop` also removes the
meter. Reload removes it automatically. No new matrix row was created.

Latest focused verification (05:17:54Z watcher build): native Android
`pair-divider-input-smoke.mjs` passed tap/hold/drag/release, both 0/100%
endpoints, fixed contain canvas and visible/stable launchers. The pointer stream
now remains authoritative on touch devices; touch is a fallback instead of
overwriting an already captured pointer gesture. This is geometry/input proof,
not a smoothness acceptance.

The observed 20 running image-loader animations included opacity-zero completed
loaders and loaders in the occluded retained list. The shared rate-card stylesheet
now displays loaders only while loading and suppresses loaders inside that
occluded list. The corrected loaded fullscreen surface had zero running loader
animations, with both floating launchers visible. The latest automated dev-phone
fullscreen sample was 263 ms to card creation and 394 ms to the next-frame
paint upper bound. User-driven remeasurement is still pending; do not equate this
single automated sample with the earlier user gesture distribution. The passive
meter was reinstalled after the final reload and browser actions handed back to
the user. No production performance claim or release completion is made.


### Native switch reduction and list badge clearance — 07:36 CEST

The remaining fullscreen lag is still open; the following work reduces proven
redundant work without deferring Affinity or introducing a loading screen:

- Selection/presentation invalidation uses the existing per-row card revision.
  Native switches now rebuild one retained list row rather than all six; the
  selected rating survives both directions. Fullscreen still creates its three
  existing pagination cards.
- One current rating DTO is read per card conversion and passed through badge
  helpers, instead of repeatedly projecting/cloning the complete rate list.
- Launcher collision checks skip known occluded list and inactive fullscreen
  card controls before reading geometry. Actual visible-control hit testing and
  the guide/drag exclusions remain intact.
- The list-only pair rating badge was raised 0.75rem (12 CSS pixels at the tested
  font size). All six phone list cards have at least 2.367px clearance above the
  primary name line. Fullscreen badge styling is unchanged.

`phone-rates-performance.mjs` now uses six native ADB taps on the retained
physical phone and verifies selection, Affinity readiness and bounded list-card
rebuilds. It does not run a CPU profiler or HUD; `--reload` explicitly prepares
Rates/pair-given after reloading the retained authorized session. Final run PASS
for these functional assertions. No ratings were saved. Build verification used
the existing frontend-sync watcher, latest completion 05:34:46Z.

Warm three-sample medians for the two-RAF upper-bound proxy changed from
293ms to 254ms entering fullscreen, and 161ms to 108ms returning to list. This
is a small same-device diagnostic comparison, not a percentile claim or proof
of production performance. A fresh-reload final run had fullscreen samples
285/248/234ms and list samples 242/137/125ms. Affinity was present with the
fullscreen card in every sample. See `phone-switch-comparison.json` and
`phone-rates-performance.json`. Raw profiles stay outside Git.

Physical-phone menu exclusion regression PASS: both launchers are visible with
the fixed rating bar, hidden for a normal menu, restored when it closes; a
guide-triggered menu retains the guide launcher and active overlay. See
`phone-launcher-menu-checks.json`. This closes the previously pending mobile
active-guide/menu assertion, not any unrun desktop retest.

The read-only divider probe sampled nine real user drags without a deviation
from the expected input-to-split position. This does not exclude missed frames
or compositor stalls. Both that probe and CPU profiling are stopped. The
passive meter was reinstalled with `--quiet`; no canvas updates or visible HUD.
The retained phone is left on Rates fullscreen for user observation. Release
consolidation/publication/deployment has not started.


## Retained Rates panels accepted — 2026-09-30 08:22 CEST

User accepted the physical-phone result ("es jo is lett"). SmartList now creates
its list and bounded fullscreen stack from one loaded collection. Both retained
layers stay at `visibility: visible`, `opacity: 1`, equal stable dimensions and
persistent compositing hints. Fullscreen switches z-index 0/4 around list layer1;
`inert` excludes the inactive controls. The Affinity outlet belongs to the retained
fullscreen layer. No second store, second page loader or page size was added.
Inactive list/fullscreen views defer only new image requests; loaded images stay
available. The existing near-end prefetch still feeds the shared collection.

Native Android Chrome six-switch check: all original card/Affinity nodes retained,
zero card projections on the warm six-switch sample, zero list scroll displacement,
and equal 347×579 CSS-pixel layer dimensions. Same-device three-sample medians
against the committed pre-change baseline: fullscreen 207.9→127.7ms; list
103.0→128.1ms. These are dev-build two-RAF upper-bound proxies, not physical display
latency; improvement is demonstrated for opening, not both directions. First-entry
selection initialization still updates its selected card once. No live profiler,
HUD or persistent measurement wrapper remains.

The existing score4 was resaved unchanged through the UI. Paging retained the
card instances and advanced cursor0→1. The hidden list aligned while paging;
closing/reopening preserved cursor1, selected identity and scrollTop348 without
post-close scrolling. `phone-retained-paging.json` records the readbacks.
`phone-rates-performance.json` includes node identity, layers and timing samples.
No screenshot was added to Git.

Focused checks: 5 lazy-background-image tests (inactive request gating, ready-image
retention, new-row stale-image clearing, success/failure spinner completion) plus
4 existing SmartList page-preload tests: **9/9 PASS**. Earlier incremental-i18n
suite: **13/13 PASS**. Each focused run stopped the existing frontend-sync owner
first and restarted it afterward. No concurrent frontend compiler was started.
The development build passed through that watcher. Full unfiltered frontend test
compilation remains blocked by pre-existing unrelated spec typing errors; this is
not a full-suite PASS. Further performance tuning is closed at user acceptance.

Release1.3.2 remains authorized and is the next activity: compatibility/retained
data checks, one consolidated guide commit per repository, master merge, pinned
frontend/backend images, final tags/releases and Netcup partial update. Existing
`EVENT-PAST-BADGES-001` PARTIAL and local-persistence/native-WebView limitations are
unchanged. Original expiry batch service/test remain preserved.


## Scroll-stable Rates launchers — 2026-09-30 08:38 CEST

The generic image-eye collision rule moved the launchers as Rates list cards
scrolled. An initial Save-relative anchor was too high. At the user's correction,
both launchers now use the stable Rates panel bottom: 56px inset in list mode,
96px in fullscreen to reserve its fixed footer. The list inset was raised40px
to clear the final row profile-eye control. No Save or eye coordinates are
queried. User drag offsets remain separate; desktop behavior is unchanged.
Native Android vertical swipe: original guide/bell ranges48/56px over100frames;
final panel-relative version0/0px over100frames. List→fullscreen→list retained
all card nodes and restored the same list positions. The final complete list
(hasMore=false) left10.65px between the lower launcher and the last profile-eye
control, with no overlap. Evidence:
`phone-rates-scroll-rail.json`.

## Image-only fast-scroll handling — 2026-09-30

The user rejected replacing whole cards with generic shells. Both the temporary
SmartList scroll-preview mode and the adaptive page/image-prefetch experiment
were removed. SmartList configuration, templates, pagination and card structures
remain at their previously accepted implementation.

The fix is in the existing lazy-background-image loader and image spinner styles.
A shared passive scroll listener measures each scrolling surface. Fast movement
postpones new requests without a spinner. Slow movement/native scrollend (120ms
idle fallback) rechecks current visibility: passed images remain lazy; only
currently visible images start through the existing request/decode/cache path.
Repeated observer callbacks share each in-flight request. Offscreen images waiting
for intersection no longer have an active loading class/animation.

The final visibility rule is per image, not a blanket fast-scroll toggle.
The existing IntersectionObserver remains attached after image completion. Only
photos leaving the viewport become suspended. An already-visible cached image
stays unchanged as scroll speed changes. An entering/passed photo waits during a
fling, then reveals once if still visible, without rewriting the URL or starting
a request. Card colors, borders, metadata and dimensions remain visible. The
mobile CSS suppresses only suspended backgrounds; no skeleton swap remains.

Phone baseline showed four offscreen loading images with four active animations.
Final native swipe: 8 sampled fast-scroll frames, 26 samples of initially visible
images, zero visible-image flickers, zero requests/spinners during fast movement,
three requests afterward (all visible), all existing nodes and inline image URLs
retained, cached paint restored, two offscreen photos suspended, no skeletons or
remaining animations. These are functional observations, not a controlled frame-
time speedup claim. Evidence: `phone-image-scroll.json`.

Focused checks: **11 image lifecycle/scroll/cache tests +4 existing SmartList
pagination tests =15/15 PASS**. The existing frontend watcher was stopped before
the focused runner and restarted afterward; its dev build passed. No screenshot
is included in Git. The full suite and production performance remain unclaimed.

Photo-associated score/status/context badges, profile-eye buttons and image indicator
bars now follow each suspended image on mobile. The shared pair score remains
visible while either pane remains visible. Native Android swipe checks sampled
90 frames each in individual-given and pair-given: no visibility mismatches;
metadata stayed visible. User accepted the result. Existing shared card CSS only;
no additional list state or DOM rebuild. Evidence is included in
`phone-image-scroll.json`.

## Launcher menu/layer follow-up — 2026-09-30

Desktop menus retain both floating launchers. The embedded guide launcher now
creates its intended positioned layer above its own tour shade; notification
layering remains unchanged at the user's final request. Mobile menus hide both
launchers even during a tour, while the sibling guide panel stays mounted and
steps through the menu. Closing the menu restores both launchers.

Managed browser regression at1280px and390px passed: guide-triggered Preferences
opening, Next while the menu is open, dismissal by shade click, and menu closing
with restored launchers. The user accepted desktop behavior and the final fix.
Evidence:`launcher-menu-layer-checks.json`.

A separate local502 was traced to nginx retaining the backend's old Docker IP
after the production-build restart. Reloading existing nginx restored API health
UP and landing HTTP200; no application/data change was needed.

The accepted launcher fix was republished as1.3.2, frontend source
`d4414ae8158ce752eb75c9217ecb2057430b04cf`, build
`d4414ae8158c-20260930074116`. Netcup nginx-only replacement passed13/13
public checks; all8 containers healthy and the other7 unchanged.
See release evidence for immutable image and backup receipts.


## Final ledger closure — 2026-09-30

The accepted guide scope and all its recorded mobile/launcher follow-ups are
PASS / CLOSED. Earlier in-progress statements above are chronological evidence
and are superseded by the accepted retained-panel, image-scroll and launcher
results. There is no remaining manual oracle for that accepted scope. The
canonical CSV, regenerated XLSX, README and resume pointer record this closure.
Local PARTIAL retains the untested persistence boundary; native WebView and
universal production performance are not claimed. The separate
`EVENT-PAST-BADGES-001` was still PARTIAL at this bookkeeping correction. It was
subsequently verified and closed in the linked focused expiry evidence. No new
runtime test was performed for the earlier guide bookkeeping correction.
