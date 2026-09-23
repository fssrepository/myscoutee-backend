# ADMIN-CLIENT-API-001 — 2026-09-23 progress

Status: IN PROGRESS.

- Backend 44d6ffd6 / frontend 72e556c5 with preserved dirty worktrees; client 24bdd82 clean.
- Existing dev watchers only. Versioned admin-client fixture staged; retained unrelated Borrow and archived Event Mode snapshots preserved.
- Debian package 1.0.2 metadata/dependencies verified and extracted into `/tmp/myscoutee-admin-client-qa-20260923/root`. Packaged Python/JS/HTML/CSS byte-match current client sources. No system installation or build.
- Extracted client started `--no-open` with isolated XDG config/runtime directories under that QA root. Loopback port 39685; disconnected. Control token remains in private instance file, never printed. Native `notify-send` and D-Bus are available.
- Launcher first attempt exposed checkpoint config error: admin route requested dismissal of the game-only guide. Corrected Ava's configured autoDismissExplanationGuide to false, matching the existing Email admin startup. No product code altered for this harness issue.

Next: managed Ava/normal startup, API UI and key creation, monitor connection; native notification/full lifecycle still NOT RUN.

## Visible client and profile side corrections, 18:12 CEST

- Managed `ADMIN-CLIENT-MONITOR-001` app window is visible. Extracted Debian client uses its Python background process, not a system installation. The Apply button is bottom-aligned with its input; source CSS and repackaged artifact agree.
- One test admin key was generated through Ava's API integration UI. Client connected through its visible form in demo mode. Key cleared from form and absent from preferences. Do not inspect/screenshot Ava's revealed-key popup or print the local control token.
- Read-only overview reports 55 active profiles: 26 women, 29 men (fixture delta +2). Root DTO fields are statistics/attention; generatedAtIso belongs to statistics. Wrong client identity rejected with HTTP 401. Remaining native notifications/revoke/restart/full lifecycle tests are NOT RUN.
- User-reported profile side task: Gender has no visibility accessory and draft normalization fixes its privacy to Public. Profession input follows Languages; Workplace/School occupy the following row, each with the existing visibility accessory. Settings persist in canonical profileDetails through the existing save path.
- Browser UI saved `QA Systems engineer`, Workplace Private, School Friends on disposable actor `6ac102000000000000000001`; Mongo and browser reload confirmed the values. At desktop width, Languages/Profession share y=585.84375 and Workplace/School share y=649.84375. No horizontal overflow. Screenshot `/tmp/qa-profile-profession-layout.png`.
- Viewing Liam through the ordinary profile-view button shows Gender/Profession/Workplace/School in Basics (empty optional fields say Not set). Profession appears only once. This is read-only display evidence, not privacy authorization proof.
- EN/HU bundle revision 154 and all three Mongo i18n seeds synchronized; i18n seed audit PASS. Existing frontend watcher built the changes; no parallel compiler or unit runner started.
- Found pre-existing missing field-privacy enforcement on contact profile reads. The user's requested visibility behavior is not marked complete. Public/Friends/Hosts/Private is the existing selector; the Hosts audience has no implemented/canonical rule. Asked the user what Hosts means, explained after their question, and await the audience definition before implementing dependent enforcement. No new host eligibility rule inferred.

## Profile/privacy and masked key completion

- Hosts clarification resolved: the user questioned the unrequested field-level option. Removed Hosts from the selectable field-privacy menu. Legacy Hosts reads/saves normalize to Private; no broadening to Public/Friends. Gender privacy is canonical Public in frontend normalization and backend row mapping.
- Contact-profile API now projects only permitted selectable fields and Workspace/School entries using authenticated viewer identity and existing friendship facts. Its hiddenFields metadata prevents the view popup from reconstructing hidden optional values. Local adapter mirrors the same owner/Public/Friends/Private decision with its existing local friendship resolver.
- Created a real Workplace experience through the normal editor UI (`QA Private workplace`) on the disposable actor. `profile-field-visibility-qa.mjs Private`, `Friends`, and `Public` each PASS: owner retains entry; unrelated/friend responses match selected visibility; prepared friendship precondition is removed in finally. These checks prepare friendship only, not the expected profile response. Initial harness attempt hit mongosh optional-chain evaluation trouble; replaced its fixture guard with explicit checks. No product fallback added.
- Profession create/save/reload and clear/save verified through UI and persisted Mongo value. 360px editor overflow check PASS; existing mobile single-column layout retained. New viewing-popup fields appear in Basics without duplication.
- Java privacy regression cases added (owner/friend/unrelated/legacy Hosts); standalone Java test runner NOT RUN under active watcher ownership. Backend continuous build and frontend watcher builds PASS. Local adapter runtime NOT RUN.
- Admin monitor now renders only Women/Men; no Other/unspecified line. Repackaged/extracted 1.0.2 and verified the visible connected window.
- User-requested connected-key preview implemented as the first 12 characters plus ellipsis (short invalid credentials fully masked). The password input stays empty and uses the preview as placeholder; local state exposes only the masked preview, never the full key. Disconnect/revocation clears it, and preferences never store it.
- Client `python3 -m unittest tests.test_monitor.MonitorTest -q`: 12 tests PASS, including preview/disconnect/revoke/short-key checks. Capacity checked first; no Java/Angular parallel runner. Stopped the old isolated monitor before replacing it; reopened only its managed window and reconnected via UI. `admin-client-connect-qa.mjs` confirms preview equals the revealed token prefix, full password value empty, preferences key-free, wrong client identity 401.
- Fixture reset now also removes this checkpoint's owned userExperienceProfiles. The active fixture is retained until Admin-client QA cleanup; its Workplace is currently Public, School Friends, Profession empty. Temporary friendship restored. Remaining full admin-client lifecycle still IN PROGRESS.

## Continued lifecycle, 18:45–19:02 CEST

- `verify-admin-client-api-qa.mjs` PASS: normal actor settings/create/revoke 403,
  guessed revoke 404, missing key and cross-scope calls 401, aggregate DTO and
  snapshot genders/7-day/30-day registration sums match Mongo. Invalid interval,
  remote HTTP/credentialed URL, bad local control and foreign Origin rejected.
- Corrected the QA oracle's second-client IDs to valid UUIDs. Earlier invalid
  string IDs only proved input rejection. Repeated with valid distinct UUIDs:
  claimed-key second client and affiliate/private scope separation PASS.
- `verify-admin-client-owner-guards.py` PASS against HTTP using only a disposable
  fixture owner/token: active admin 200; inactive/blocked/deleted/removed role or
  missing owner 403; expired/revoked 401; another admin cannot revoke its key (404).
  Original owner restored and temporary token removed in finally. Initial harness
  failures were a hex-vs-base64URL hash and non-UUID client identifier, both fixed
  in the fixture rather than product code.
- `verify-admin-client-cadence.mjs` PASS through the visible Apply control: remote
  success gaps 5.021/5.023s and 20.020/20.021s. Unchanged repeated polls did not
  increment native notification sequence. Local UI refresh did not accelerate
  remote polling. Returned to 10s.
- Two normal-user Feedback submissions through the actual UI increased the real
  overview counter. The second was sent with the monitor window closed; the
  background process kept its connection and invoked D-Bus Notify. Reopened via
  the managed launcher without Connect; invoking isolated `--no-open` again
  retained the same private instance/port rather than creating another process.
- Local loopback overview failure stub + `verify-admin-client-faults.mjs` PASS:
  18s response times out at the client's 15s bound, last snapshot remains with
  connection error, recovery has maximum one active request; disconnect ignores
  a late response and clears data/preview; HTTP redirect never reaches credential
  trap; same-count/new unread-version alerts once, repeats/decreases do not. EN/HU
  controls verified. Stub stopped after use; only a synthetic key went to it.
- Real support-message flow PASS, separately from the stub. Versioned owned report
  precondition plus backend warning established the disposable actor's support
  channel. User sent replies through the visible chat composer. Admin read/closed
  the first reply; a second arrived before the next 20s poll. Exact unread total
  remained 1, version increased and one notification fired. Reading to zero did
  not notify. `verify-admin-client-support-notification.mjs` PASS.
- D-Bus Notify payload contains only generic MyScoutee Admin text, app name,
  `myscoutee-client-admin` icon and desktop-entry hint. Desktop DND was already ON
  (`show-banners=false`) and left unchanged. Visual notification-center icon and
  actual desktop-login/reboot behavior NOT RUN; extracted package XDG entry was
  inspected and its isolated `--no-open` behavior exercised.
- Open MyScoutee via an actual pointer click opened `/entry` in the anonymous
  monitor browser, with Login/Free to join, no key-based app login. A scripted click
  without user gesture was popup-blocked; no product defect. Closed that test tab.
- Ava reopened key settings: raw token absent, prefix/claim metadata present.
  Existing connected key revoked through confirmation; next poll produced
  authorization_failed and cleared data/preview. Created a second disposable key,
  connected, stopped the existing background owner, then restarted serially:
  URL/10s interval persisted, key/data did not. Reconnected with the same stable
  client identity and revoked the second key through UI too.
- One temporary inspection helper accidentally printed the second disposable key
  while its reveal panel was open. It was immediately revoked and the helper was
  narrowed to button metadata. No production credentials involved; do not reuse
  that key or claim the entire QA trace was secret-free.
- Client Python suite: 14 tests PASS in 1.382s after capacity check. No additional
  Java/Angular compiler/test runner. Cross-database live/demo isolation NOT RUN:
  this dev stack maps both modes to `demo_db`.
- QA Feedback/report rows resolved and support case solved via actual backend
  endpoints; audit messages retained. Both generated keys revoked, guard token
  removed. Managed windows/client, fault stub and D-Bus monitor stopped; fixture
  reset restored session state and removed owned profiles/experiences.
- User's installer-link correction arrived during cleanup. Narrowly re-staged
  the same fixture for UI-only verification (no replay of completed lifecycle).
  Replaced native link with a right-aligned blue tinted pill `app-menu` action,
  retaining EN/HU label, repository destination and safe external-link handling.
