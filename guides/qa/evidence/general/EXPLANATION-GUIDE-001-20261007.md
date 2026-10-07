# Guide / WebRTC follow-up — 2026-10-07

Initial development checks passed; **manual browser QA NOT RUN** at that point.
No browser sequence, fixture reset, stack restart or extra compiler was performed
for that initial follow-up. The later explicitly authorized isolated-browser
regression is recorded separately at the end of this document.
The user subsequently authorized committing/pushing the completed work.
Existing September browser evidence remains historical.

## Changes and retained behavior

- `FloatingLauncherComponent`: peer clearance now also runs on desktop and
  after the mobile Rates panel anchor. Earlier DOM launchers yield to later
  ones, with two monotonic searches (above, then below) to avoid moving back
  into a previously checked obstacle near the viewport edge. Hidden, empty,
  horizontally separate and disconnected peers do not displace the launcher.
- `FloatingLauncherRegistry`: the component registers its own host/menu
  references and unregisters on destruction. No global launcher query, polling,
  MutationObserver or DOM index rebuild was added. Work scales with live
  launchers rather than the number of cards on the page.
- The Rates panel-bottom anchor remains **56px list / 96px fullscreen**.
  Rates does not query Save buttons or profile-eye controls. Desktop avoidance
  concerns peer launchers only; the existing general mobile control clearance
  and menu-hiding rules remain. An open guide freezes the existing anchor but
  still permits peer clearance if the buttons overlap.
- Help card `placeCard()` ordering and responsive layout were not changed.
  The new first-visit step uses the existing guide engine and context stack.
- The single introductory step explains Next/Back/Done, dragging either
  launcher, hiding it on the red X, and persistent guide OFF/ON through Side
  menu → Explanations. Final body length: HU156 / EN155 characters, explicitly
  naming the notification bell. The same
  instructions are in the existing side-menu Help steps. No extra popup or
  extra introductory step was created. Rendered five-line fit is still a
  manual check, not proven by character count.
- The introduction stops checking launcher geometry once offered/skipped.
  It does not accept consent or change the saved explanation preference.
  Dismissal releases its temporary `landing.guide` context; late responses do
  not reopen it. Existing consent or a completed introduction suppresses it.
- The current call Help integration registers `chat.call` (17 fields) and
  its volume child (7 conditional fields), with EN/HU and Dating/Work/Community
  revisions. Parent restoration, language changes and repeated opening use
  the existing guide service. The volume popup keeps the guide available.
- The QA CSV now uses LF line endings; newline normalization changed no cells.
  Follow-up checklist/evidence cells were then updated deliberately and the
  existing CSV-to-XLSX synchronizer was used.

## Automated evidence

All runtime checks below import the existing frontend watcher's AOT output;
they start neither a compiler nor a browser. DOM rectangles/visibility are
controlled test inputs, so these are not browser-layout or device-media proofs.

```sh
node --max-old-space-size=192 frontend/scripts/check-floating-launcher-runtime.mjs server/docker/conf/nginx/app/myscoutee
node --max-old-space-size=192 frontend/scripts/check-guide-introduction-runtime.mjs server/docker/conf/nginx/app/myscoutee
node --max-old-space-size=192 frontend/scripts/check-chat-call-runtime.mjs server/docker/conf/nginx/app/myscoutee
python3 guides/qa/tools/explanation-guide/audit-seeds.py --context chats --context event.chat --context chat.call --context chat.call.volume --context landing.guide --context navigation.menu
node --max-old-space-size=256 frontend/scripts/sync-work-seeds.js --check
```

- Launcher PASS: desktop/mobile collision, hidden/empty peers, registration
  priority/removal, top edge, multiple obstacles, open-guide collision and
  drag-release continuity. **1500 deterministic geometry cases** return a
  bounded non-overlapping position whenever a free vertical slot exists.
- Rates PASS: **400 rechecks** across list/fullscreen anchors, zero control/peer
  DOM enumeration, zero card hit-tests, and zero repeat signal writes after
  settling. With no peers, each check reads only menu, rail and panel rectangles.
  This is an operation-count bound, not a physical-phone CPU benchmark. Existing
  non-Rates mobile control discovery is unchanged and not claimed scan-free.
- Introduction PASS: one step, EN/HU language switching, 200 repeat offers
  without extra requests, completed/known-visitor suppression, saved OFF→ON,
  normal-guide reopening, temporary context cleanup and late/empty responses.
  Final intro/side-menu text matches EN/HU × 3 workspaces × 3 Mongo seeds.
- Call PASS: 2×2 mobile / up to 3×2 desktop pages, viewport video preferences,
  manual video prohibitions, camera-only sender pause/resume, speaker ordering,
  stable models, bounded SmartList effects, nested Help and language cleanup.
- Targeted guide audit PASS: 72-context /1193-field catalog parity and selected
  six-context default revision parity; scoped chat/intro content also passes.
  Seed synchronizer reports synchronized content. Earlier full-catalog revision
  gaps in `home.game` and `payment.history` remain outside this change.
- Compilation PASS through the existing `frontend-sync` watcher; no second
  Angular build/test pipeline was started.

## Remaining manual evidence

Use the updated `EXPLANATION-GUIDE-001` and `CHAT-CALL-001` checklists. Actual
five-line text fit, consent shade/highlight, drag hit targets, responsive Help
placement, a full guide click-through and device audio/video remain **NOT RUN**.
The local self preview is muted; delayed feedback from testing two browsers on
one computer is not evidence that a physical two-device audio test passed.
No manual PASS or campaign completion is inferred from these development checks.

## Affiliate/API permission guide — queued follow-up completed

The four parent guide fields already existed: API-key access, main MCP access,
client access and parent Save. The child component already registered
`profile.integration-access`, but that key was missing from
`APP_STATIC_DATA.explainableSurfaces`, so the guide service rejected its context.
Default EN/HU child revisions existed; Work/Community child revisions did not.

Added the single enabled-surface entry and the existing three-step EN/HU child
content to both workspace seed sources, then regenerated the three Mongo seeds
with `sync-work-seeds.js`. No access levels, permission checks, settings save or
API/MCP behavior changed. The existing child level/Apply/Close targets are reused.

```sh
node --max-old-space-size=192 frontend/scripts/check-integration-access-guide-runtime.mjs server/docker/conf/nginx/app/myscoutee
python3 guides/qa/tools/explanation-guide/audit-seeds.py --context profile.integrations --context profile.integration-access
```

Both PASS. Real compiled guide service: enabled parent/child registration, four
parent fields, three child fields, EN/HU, navigation without duplicate loads,
parent restoration, closing/reopening and cleanup, in Dating/Work/Community.
Local scoped and all Mongo child revisions match. The focused seed audit now
includes both integration contexts in its workspace checks. Existing watcher
compilation passed at 00:40:36Z. The comprehensive i18n audit also passed:
two bundles /13564 messages and three synchronized Mongo seeds.

Manual EN/HU desktop/mobile target highlighting, conditional Apply visibility
and permission enforcement remain NOT RUN; the existing INTEGRATION-ACCESS-001
manual status is preserved, with explicit Help steps added to its section 4.

## Consent guide flash — reported follow-up

The initial consent document had no guide context. Clicking the launcher opened
`landing.home`, whose targets are absent inside the top consent popup; the
overlay therefore closed the guide. The entry template now registers
`landing.consent` through the existing `LandingGuideSurfaceDirective` only while
the consent document is mounted. Its one field reuses the document menu's
existing `entry-privacy-accept` action ID. No document viewer or Accept handler
was changed. Loading/read-only privacy uses an explicit null modal context to
temporarily suppress the underlying landing guide; destruction restores it.

One short EN/HU step explains accepting the data handling terms, browser
retention of this version and renewed acceptance for a new version. This matches
the existing revision ID/version comparison in `loadEntryConsentState()`;
consent persistence and validation are unchanged. The public landing allowlist,
canonical catalog, workspace sources and three generated Mongo seeds include
the new context. The i18n bundle version is `2026.10.07.5`.

- Existing frontend watcher compilation/sync PASS (00:51:48Z); existing backend
  hot-deploy `:projects:profile:compileJava` / `BUILD SUCCESSFUL in 2s`, restarted
  application ready at 02:51:14+02:00. No additional compiler was started.
- Extended `check-guide-introduction-runtime.mjs` PASS: real directive/service,
  null-context suppression, introduction → consent restoration, one real
  document-menu Accept target, EN/HU, cached reopen, context cleanup and no
  consent write. **200 target checks reuse one existing index scan.**
- Live public HTTP PASS: one matching consent step in EN/HU ×
  Dating/Work/Community (6 requests). An authenticated `profile.integrations`
  context remains inaccessible on that public route (404).
- Focused seed audit PASS: 73 contexts /1194 fields; new consent and existing
  intro/call/volume/integration context parity across the three Mongo seeds.
- Final i18n audit PASS: two source bundles /13574 messages and three Mongo
  seeds synchronized; `sync-work-seeds.js --check` and both repository
  whitespace checks PASS. Launcher, call and integration AOT checks also PASS
  after the consent change.
- Desktop/mobile visual fit and the reported click sequence remain manual
  NOT RUN; these development tests use controlled DOM geometry, not a browser.

## Landing group switch, dismissed consent and duplicate seed — later follow-up

The user clarified that the defect concerned the main-group image set, not
autoplay, and that consent was closed without acceptance. Group selection must
not reopen it; Login must still enforce consent. The user explicitly authorized
CDP in a **new browser** for this diagnosis.

### Proven cause and narrow changes

- Before the fix, `app-sw.js` answered a first Work/Community cache miss with any
  cached landing response, including Dating. Its background fetch cached the
  correct response for later visits, explaining why reload appeared to repair
  the images. The isolated browser reproduced Work with Dating's image URLs.
  Five of seven new service-worker tests failed before the fix.
- Landing cache misses now await the exact requested URL. Exact cache hits keep
  their existing immediate response/revalidation. The cross-group fallback and
  its cache enumeration were removed; there is no new DOM scan, polling or
  extra request. Offline unknown groups return 503 instead of another group's
  content; offline previously cached groups remain available.
- `changeLandingMode()` calls the existing loader with `promptConsent: false`.
  Initial entry loading and Login's existing consent gate retain their behavior.
  The browser reproduced the unwanted reopening before this change.
- Privacy repeated its English blurb in `contentHtml`. Removed that one
  paragraph from `app-static-data.ts` and the three Mongo seed files. All privacy
  sections were checked in EN/HU; no other exact summary/body repeats were found.
  Revision IDs, version, summary, date and substantive policy content remain.
- The real consent Help selector exposed an additional stale translation issue:
  API version `2026.10.07.5` had 6782 English messages while Mongo contained 6787,
  including the missing label. Logs showed the version import before messages.
  The generator now writes message data before publishing bundle metadata,
  complementing the existing watcher import ordering. Published `.6` after
  verifying the complete message collection, without restarting the stack.
  No runtime translation fallback or cache scan was added.

### Verification

- Existing `frontend-sync` compiled/synced the page and source-seed change
  (01:07:34Z / 01:10:48Z); bundle metadata sync completed at 01:13:32Z. No extra
  Angular/Java compiler or server was started. The existing Mongo watcher
  imported only the changed help collection and later bundle metadata.
- Plain Node service-worker regression: **20/20 PASS** across landing cache,
  navigation, immutable bundles and push suites. Seven landing cases cover
  first Work/Community selection, language isolation, exact pending refresh,
  cached/uncached offline behavior and server failure; enumeration count is zero.
- Explicitly authorized CDP used the versioned browser launcher with an isolated
  anonymous `MSC117-LANDING-CONSENT-REGRESSION` checkpoint override: entry/target
  `/entry?redirect=%2Fgame`, preserve other sessions, no consent bootstrap,
  no geolocation override or actor login. No fixture reset or user-browser action.
- Fresh profile: initial consent appears. Finish the intro, close consent with
  X without accepting, then select Work → Community → Dating → Work. At desktop
  (1236×769 content viewport), each group's real rendered background-image URL
  follows its selected mode without reload; consent stays closed. Login opens
  consent again, and consent storage remains empty.
- The same close/switch/Login sequence also passed with CDP mobile metrics
  **390×844**. The consent Help remained open for its one Accept step, showed
  translated `Privacy consent` in the selector, and the entire English body
  fitted in three visible lines. The Accept button remained visible below it.
  This is Chromium mobile emulation, not physical-phone evidence.
- A fresh browser showed the Privacy summary exactly once. Live public HTTP
  EN/HU × Dating/Work/Community also returned the corrected privacy section.
  Both live translation bundles at `.6` match all source messages exactly.
- Existing watcher AOT component/data checks passed the accepted-consent branch
  and group slide propagation to SmartList, with three content loads for five
  selections. This uses controlled services/DOM, not a real browser acceptance.
- `sync-work-seeds.js --check`, `audit-i18n-mongo-seed.js` (13574 messages), JSON
  privacy duplicate inspection and both repository whitespace checks passed.

The original manual consent registration/transfer checkpoint and full guide,
WebRTC and affiliate permission campaigns were not replayed or marked complete.
Autoplay was not changed or claimed tested. Existing open pages need the normal
service-worker update activation to run the new worker; the regression used a
fresh isolated profile. The `.6` bump is translation metadata, not a new privacy
revision and therefore does not request renewed consent.

## Landing mobile group selector — requested after commit consolidation

The existing landing `compactOnMobile: true` option deliberately hid both the
group label and caret, leaving an ambiguous icon. The landing now uses the
existing labelled pill and compact menu density instead. No shared menu logic,
additional automatic guide, animation, DOM measurement loop or observer was
introduced. The header's new scoped `landing.login` key is EN `Login` / HU
`Belépés`; other uses of the existing global `login` translation are unchanged.
At 360px and below the landing brand uses 16px type and a 22px logo, preventing
its text from overlapping the group button on 320px screens.

The existing watcher compiled/synced the final SCSS at 01:19:41Z. The same owned
anonymous browser was used through CDP: **24 header cases PASS** = EN/HU ×
320/360/390/1236px × Dating/Work/Community. Each case opened the real group menu
and selected its option. DOM geometry verified a visible caret, complete group
label (no clipping), one-line Login/Belépés and disjoint brand-text/button/login
bounds inside the viewport. Screenshot inspection also confirmed the final
320px Hungarian Community header. Consent stayed closed throughout selection.
This is Chromium viewport emulation, not physical-device testing.

Translation version `.7` contains the two new scoped labels. Watcher logs show
the complete message import before the version import. Live EN/HU responses
each match all 6788 source messages; i18n seed audit passes all three databases
(13576 total messages). Repository whitespace checks pass. No duplicate
compiler, fixture reset or stack restart was used. The temporary owned browser
was closed through the versioned launcher after verification.

## Shared feedback when a surface has no guide

The user's final requirement is a persistent centered guide-style message,
not silent dismissal: EN “There is no guide for this screen.” / HU “Ehhez a
felülethez nincs útmutató.” This applies to the shared engine, including the
landing article and other surfaces with no usable revision or rendered target.

Before the fix, the actual watcher-AOT popup rendered a shade and loading ring
while resolving an article's guide (`2 !== 0` in the new render regression).
The overlay registered Back before it had a visible target, then closed on an
empty target list. After the fix, resolution itself paints no temporary modal;
a missing guide instead produces the existing centered card with explicit
feedback, no tour controls and no automatic close. Only visible guide/feedback
UI activates the launcher and its Back boundary. The normal target index and
desktop/mobile placement algorithm are reused; no new DOM scan or polling loop.

Focused verification, using the existing frontend watcher's compiled output at
`server/docker/conf/nginx/app/myscoutee`:

- `node --max-old-space-size=256 frontend/scripts/check-guide-empty-surface-runtime.mjs <output>`:
  **PASS** actual Angular AOT template in isolated JSDOM. Cold/cached article-like
  and other empty surfaces keep one centered message; targets behind the popup
  are excluded. X, Escape, Back callback, launcher toggle and shade dismiss it.
  The same card survives 200 viewport notifications with zero target rescans.
  Missing revisions/fields reuse cached results; valid tours retain their card
  across Next/Back and close on Done. Target loss, absent surfaces, EN/HU
  language changes and genuine load errors also pass.
- `check-guide-introduction-runtime.mjs`: **PASS**, including consent target,
  first-visit lifecycle, cancellation, preferences, EN/HU seeds and 200 target
  checks reusing one index scan. Missing intro content now follows the same
  explicit feedback contract, without marking unseen content read.
- `check-integration-access-guide-runtime.mjs`: **PASS** existing parent/child
  Help contexts in Dating, Work and Community, EN/HU and cleanup.
- The running watcher compiled/synced the final UI at 01:30:23Z. No duplicate
  compiler, stack restart, fixture reset or user browser action was used.
- Translation version `.8` adds one EN/HU message through the existing seed
  generator. Seed audit: **13578 messages**, two languages, all three Mongo
  seed directories agree. The running seed watcher imported messages before
  bundle metadata. Live HTTP EN/HU bundles at `.8` each match all 6789 source
  messages, including the new feedback text.

JSDOM uses controlled geometry and transport. These checks establish shared
render/state behavior; they do not establish physical-phone layout, native
browser Back history or a replay of the full manual Guide campaign. The new
manual step above remains **NOT RUN** in the managed browser checkpoint.

## Operator / app-admin wiring audit

Requested after committing the main-group corrections. Result: **GAP — dedicated
operator and app-admin step guides are not wired**. No product change or browser
action was made for this inspection.

| Boundary | Evidence |
| --- | --- |
| Launcher visibility | `side-menu.component.html:31` explicitly excludes `/operator` via `!isOperatorMode()`. No launcher occurs in operator page templates. |
| User preference | `side-menu.component.ts`, `navigatorHeaderActionMenuModel`, excludes the Explanations toggle for `isPrivilegedWorkspaceMode()` (both `/admin` and `/operator`). |
| Surface registration | No `ExplanationGuideService`, `registerContext`, `data-guide-surface` or `guideFieldId` binding occurs in `frontend/src/app/admin` or `frontend/src/app/operator`. |
| Runtime catalog | The current watcher output's real `APP_STATIC_DATA` exports 68 registered surfaces and no `admin.*` or `operator.*` entry. `navigation.menu` is enabled. |
| Field catalog | The versioned catalog contains 73 field contexts, none for `admin.*` or `operator.*`. Its shared `navigation.menu` fields cover common/member navigation, not the admin shortcuts. |
| Durable revisions | Each of `demo_db`, `e2e_db`, `myscoutee_db` has 508 seeded help revisions, none with an `admin.*` or `operator.*` context. |
| Running database | Read-only `demo_db.helpCenterRevisions` inspection likewise found zero operator/admin contexts; six active `navigation.menu` revisions cover EN/HU in three base scopes. |

App-admin can reach the common menu guide when the guide preference is enabled.
This does not establish coverage of moderation, reports, feedback/support,
jobs, parameters, payments, content editing, statistics, metrics or graph.
Operator's page/action/registry/revenue/configuration controls have no dedicated
step tour. The Help/Content Editor and the historical Guide QA admin companion
window provide content administration, not guides for those role surfaces.

This audit does not expand the implementation into authoring all role-specific
tours. Their absence is now explicitly recorded in the stable guide checklist
and QA ledger; the full browser campaign remains NOT RUN.
