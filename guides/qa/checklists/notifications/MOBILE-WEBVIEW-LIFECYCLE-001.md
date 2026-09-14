# MOBILE-WEBVIEW-LIFECYCLE-001 user test guide

This one Android WebView journey checks coherent cache upgrade, app resume,
account-switch isolation and deliberate offline/online recovery. It must use a
real disposable device state: clearing app data would erase the boundary the
test is meant to prove.

## Required environment and actors

- One disposable Android phone starts with the previous QA frontend shell and
  cache already installed and opened once as **Riley**.
- The candidate frontend is a separately identified coherent build served by
  the QA environment. Codex records both build identities before the switch.
- **Nova** is the account-switch control. Riley has one controlled upcoming
  Ticket/QR, one authenticated image and one unread notification cached before
  the switch. Nova has a different controlled upcoming Ticket/QR that can be
  cached after the switch for the offline branch.
- A controlled Public Asset may remain cached across users; authenticated
  Ticket, QR, image and notification data may not.
- Codex owns ADB inspection, reverse-tunnel changes, the explicitly delegated
  QA PWA installation below and server-side fixture mutations. After setup
  handoff, the tester owns every phone tap, popup, clipboard action, app
  background/close and login/logout in the numbered journey.

## Install the local QA app before establishing the old-cache baseline

The phone's existing MyScoutee icon may point to
`https://fssrepository.github.io/myscoutee/`. Keep that installation; its origin
and cache are separate from the local QA environment. This test uses a separate
Chrome-installed **PWA at `http://localhost:8080/`**, not a replacement Android
System WebView package.

Codex performs the following installation setup when delegated by the tester:

- Connect the phone over USB, verify `adb devices` reports `device`, and set
  `adb reverse tcp:8080 tcp:80` against the already-running QA server. Record
  any existing mapping before changing it; do not restart the application stack.
- Open `http://localhost:8080/` in phone Chrome. Use Chrome's menu:
  `Install and create shortcut -> Install`, then confirm that the installation
  dialog shows `http://localhost:8080` before pressing `Install`. Choose the
  installed app option; `Create shortcut` opens an ordinary Chrome tab.
- Open the newly installed local app and verify its origin is
  `http://localhost:8080`, its display mode is `standalone`, and an activated
  service worker controls the page. Both home-screen icons may be named
  MyScoutee: identify the local app by its installation origin/package, not its
  label alone. Retain the device route and package identity in execution evidence.
- If the dev build's worker is disabled, enable only the existing dev
  service-worker override during setup and verify activation. Do not treat a
  successful installation alone as proof that offline caching works.
- Establish Riley's controlled old-build/cache baseline in this local app,
  record the old and candidate build identities, and then hand off the test.
  If an old local baseline already exists, capture it before loading a newer
  build. Never use reinstall or clear-storage as an upgrade-test step.

Keep USB connected. After an ADB daemon restart or USB reconnection, verify and
restore the same reverse mapping before continuing online observations. App
data and both installations remain intact throughout the numbered journey.
For a visible paired run, record the previous power setting and use
`adb shell svc power stayon usb` so the phone stays awake while USB-powered.
Keep this setting fixed during the observations; screen sleep is not the
backgrounding action under test.

Transport security belongs to the checkpoint fixture. The USB route above uses
loopback `localhost`; verify `isSecureContext` on the phone before requesting
device capabilities. If a testcase requires an HTTPS origin, its fixture must
provide a local test certificate trusted by the device, record its hostname,
certificate identity and prior route/trust state, and define exact restoration.
Do not substitute a certificate-error bypass for that HTTPS observation.

To start, tell Codex:

`Prepare MOBILE-WEBVIEW-LIFECYCLE-001 with the old-cache boundary.`

Start only after Codex confirms the old shell was genuinely loaded once, app
data was not cleared, the candidate build is ready, Riley's three controlled
authenticated cache items exist and ADB transport is healthy.

## 1. Coherent cold-start upgrade and popup layout

1. Fully close the phone app. Do not clear storage or uninstall it.
2. Wait while Codex switches only the QA frontend target from the recorded old
   build to the recorded candidate build and verifies the candidate files are
   complete.
3. Cold-start the app normally. It must render one coherent candidate build:
   no blank screen, endless loader, missing-chunk error, repeated reload or
   mixture of old labels with new code.
4. Check the startup **location-permission popup**, not a Location menu item.
   With permission undecided, the normal location request must show the browser/
   Android prompt. Accept it and confirm the app receives location access.
5. Repeat after declining location access, then reopening the app. Location is
   required for the applicable entry flow; rejection must not silently bypass
   it. Keep an explicit retry available. A persistent browser/OS block requires
   changing site/app settings; restarting cannot override that native decision.
   Restore the permission state recorded before this branch.
6. Open `My Assets -> Transport`, select the exact controlled Asset printed by
   Codex and choose `Edit`. In Details, copy this value on the phone:

   `https://example.com/qa/mobile-webview-source`

7. Select the Source link `Paste link` action once. The field shows that exact
   value without stretching, clipping or blanking the popup. Cancel the Asset
   editor; this layout check does not save an Asset change.
8. Repeat the Source link Paste action after declining clipboard access. A
   fresh click must retry the browser API; if the browser retains a block, show
   actionable guidance. Clipboard access can wait until this form action.
   Open one other available side-menu popup: normal dimensions and scrolling
   remain, with no Asset editor or clipboard overlay left behind.
9. Report:

   `MOBILE-WEBVIEW-LIFECYCLE-001 coherent upgrade complete`

Codex checks the effective build/cache generation and ADB WebView console. Old
HTML must never request missing candidate chunks, and the candidate cache is
promoted only after all required files are available.

## 2. Background mutation and resume

Exercise this block with **different Android applications** open, not several
MyScoutee tabs or sessions. Retain the same Riley identity and registration.
Repeat the background/resume observation once with Android **Settings** in the
foreground, and once with **Chrome displaying a non-QA page** in the foreground.
Other applications may remain in Recents. Do not change Settings during the
measured interval or close MyScoutee for these resident-background variants.
Each variant has its own single controlled notification mutation; record which
application was foregrounded and whether MyScoutee remained resident or was
recreated by Android. Verify the same identity, one new row and one counter
delta after returning to MyScoutee. System-push delivery is measured separately
in the [Push lifecycle guide](MOBILE-PUSH-LIFECYCLE-001.md).

10. In Riley, open `Notifications -> New` and leave that surface open at the
    controlled baseline. Press Android Home to background the app; do not close
    it.
11. Report:

    `MOBILE-WEBVIEW-LIFECYCLE-001 Riley backgrounded`

12. Wait while Codex performs exactly one versioned server-side notification
    mutation for Riley and records its newer revision. No browser or device
    automation opens the UI.
13. Resume the app from Recents without manual refresh. Riley's identity,
    notification counter and already-open New list reconcile the new row once.
14. Wait through one normal realtime cycle. The row and counter remain stable;
    an older WebView snapshot must not remove or duplicate the server result.
15. Close/reopen Notifications once and confirm the same state. Report:

    `MOBILE-WEBVIEW-LIFECYCLE-001 resume reconciliation complete`

## 3. Logout and account-switch cache isolation

16. Before logout, open Riley's controlled Upcoming Ticket and QR once, the
    authenticated image once, and the controlled notification once. Return to
    the main screen.
17. Use the ordinary `Logout` action. Before another identity renders, Riley's
    name, Ticket/QR, authenticated image, counters and notification content are
    no longer visible.
18. Sign in as **Nova** through the prepared QA identity path. Do not clear app
    data between users.
19. Confirm Nova's own identity and counters. Open Tickets and Notifications:
    no Riley Ticket, QR, authenticated image, notification text or counter is
    present. Nova's different controlled Ticket is allowed; open that Ticket
    and its QR once so it becomes the current-user offline control. The
    controlled Public Asset may also remain cached and visible.
20. Close and cold-start the app once as Nova. The same isolation remains.
    Report:

    `MOBILE-WEBVIEW-LIFECYCLE-001 account switch isolated`

Codex verifies the tracked Riley session was revoked and the device cache keys
are scoped to the current user without exposing their stored values.

## 4. Deliberate offline and online recovery

21. Wait while Codex records the healthy ADB route/certificate state, then
    disables only the checkpoint's device-to-QA transport. Do not enable
    airplane mode or clear app data unless Codex's prepared route explicitly
    uses it.
22. In the app, confirm the offline state is explicit. The cached avatar remains
    visible and clickable, including when only the backend is unavailable.
    Verify the cached Ticket menu and available server-independent header
    actions (including the GitHub report link). Previously loaded policy/consent
    content remains readable where cached; submitting changes still requires
    the server. Open only the supported
    cached Ticket/QR contract prepared for the current actor. An uncached or
    server-required surface must show an honest unavailable/offline state, not
    stale success for another user.
23. Close/reopen the supported offline Ticket/QR once. It stays usable and no
    authenticated Riley data appears.
24. Report:

    `MOBILE-WEBVIEW-LIFECYCLE-001 offline boundary observed`

25. Wait while Codex restores the same ADB transport. Resume the app without
    clearing data or reinstalling.
26. Confirm user, counters and the open surface converge once to server truth;
    no refresh loop, duplicate row, mixed build or stale-user overwrite occurs.
27. Report:

    `MOBILE-WEBVIEW-LIFECYCLE-001 user steps complete`

Codex captures final transport/cache diagnostics, compares server truth and
restores the versioned device/fixture boundary.

## 5. Opt-in development demo fallback

This additional trial uses the existing HTTP and local seed adapters. It is
limited to a development HTTP build on localhost and the 50 canonical demo
members. Firebase, support, operator and synthetic QA identities are excluded.
It changes adapters through a page reload at an idle main-screen boundary;
local edits remain local and are never uploaded on reconnect.

1. With the existing dev stack running and no other Mobile WebView fixture
   staged, run the common harness `stage-demo mobile-webview
   MOBILE-WEBVIEW-LIFECYCLE-001`. Prepare browser sessions through the same
   harness with `MANUAL_QA_BROWSER_USER_IDS=bf057de7c586eede7e84bdc7` and
   `prepare browser-sessions MOBILE-WEBVIEW-LIFECYCLE-001`. Use the physical
   device helper's tracked `login Anna` startup. This maps HTTP Farkas Anna to
   local seed `u1`; it does not create a second backend account.
2. Open `/game?qaOfflineDemo=1` in the installed local QA PWA. Confirm the live
   HTTP profile while the backend is healthy. The trial flag persists across
   reloads/cold starts on this origin until explicitly disabled.
3. Run `node guides/qa/tools/mobile-webview-device.mjs backend-offline` and keep
   its terminal attached. This blocks only the QA page's `/api/*` requests;
   it does not simulate a complete internet outage. Return to the idle main
   screen. Within the next 10-second check plus health timeout/bootstrap,
   confirm local Anna appears. Capture both distinct IndexedDB names and
   verify the retained HTTP session is unchanged, without exposing tokens.
4. Edit Anna's About text with a unique QA marker and save. Reopen the editor
   to prove local persistence. Add another unsaved marker. Send `online` to
   the transport helper and wait more than 10 seconds: the editor, draft and
   page time origin must remain unchanged. The floating icon and
   menu bell show `cloud_off` on a grey/slate background, not the muted-bell symbol. They return to their
   online icons when connectivity returns, even with the editor still open.
   The floating icon appears offline even at zero unread count; its counter,
   click, drag and dismissal still work. Dismissal persists for that outage.
   The notification-list mute toggle shows the same offline icon and is
   disabled until reconnect, preserving the prior mute preference.
   Repeat with `network-offline` on an already loaded local page to emulate
   complete target network loss (`navigator.onLine === false`), then `online`;
   distinguish this CDP emulation from a physical-radio or cold-start test.
5. Cancel the draft and return to the main screen. Reconnect must keep the
   same local session and page time origin, including at idle. Its bell marker
   clears once the backend is reachable. On a later explicit reload/reopen,
   HTTP Anna is preferred. Reopen the profile: neither local marker may have
   reached the server. Different live/local counters are expected; no data
   merge is part of this trial. A repeated outage retains the saved local edit.
6. Run `node --experimental-vm-modules guides/qa/tools/check-demo-failover.mjs`
   against the existing watcher's output for exclusion gates, auth errors,
   session restoration, reconnect without reload, cold start, account switch
   and editor/write guards.
   Do not launch another Angular build or test compiler.
7. Send `stop` to restore transport and detach. Open `/game?qaOfflineDemo=0`,
   use ordinary logout for the tracked HTTP session, then run the common
   harness `reset mobile-webview MOBILE-WEBVIEW-LIFECYCLE-001`. Disabling the
   trial restores any pre-existing local session; local demo data stays in
   its separate database. Do not clear the HTTP cache or unrelated app data.

With the trial disabled, block only the API while an HTTP page is open. The
notification marker must indicate the outage and clear after the existing poll
succeeds again. Keep the same page time origin and session throughout; no seed
account or reload is allowed in this control.

A full device-offline cold start, including all portraits/assets, remains a
separate service-worker/cache assertion. API failover alone does not prove it.

## Expected effort

| Work | Clean run | With one cache/transport replay |
| --- | ---: | ---: |
| Old/new build and ADB preflight | 25 min | 60 min |
| Cold-start upgrade and popup regression | 25 min | 55 min |
| Resume mutation and reconciliation | 20 min | 45 min |
| Account switch and cache isolation | 20 min | 45 min |
| Offline/online recovery, evidence and cleanup | 20 min | 55 min |
| **Total** | **110 min** | **260 min** |

## 6. Public demo images and protected Firebase media

This is part of this testcase, not a separate PASS inferred from logout or
list visibility. Public landing, Explore and generated demo images remain
anonymous; Firebase disabled means demo entry, not an authenticated media test.

1. Record the public demo image and a controlled real-session image separately.
   An anonymous direct request to the public image succeeds. Do not classify
   a publicly accessible generated demo avatar as a private-image leak.
2. With an active Firebase app session, display the controlled private image
   through the ordinary UI. It must use the protected media read boundary.
   Public and private namespaces cannot be selected merely by changing the
   read URL or supplying demo headers.
3. Repeat the private request without its credential and with an invalid one:
   neither returns image bytes. A retained legacy public URL for the same
   private key must also end at the protected boundary.
4. Log out normally. The old credential no longer reads the image, and neither
   service-worker cache nor another user's session restores private image data.
   Public demo images may remain cached. Private responses are not stored in
   a shared or persistent public cache.
5. In a scrolling list, verify that image loading does not repeat Firebase
   sign-in or run a per-image visibility query chain. After an avatar update,
   the normal live profile/poll result selects the new image without reload;
   the offline cache must not overwrite the newer profile on reconnect.
6. Retain existing visibility levels (including Friends only) in their owning
   list/detail flows. Record image-endpoint fine-grained visibility separately
   from the mandatory active-session gate. A ten-minute signed URL is not an
   agreed acceptance requirement.

Record authenticated positive, anonymous/invalid/revoked negatives and browser
cache evidence separately. If Firebase entry is not configured, the public-demo
checks and automated private-route tests do not prove the physical Firebase
sign-in/image/logout branch; leave that branch explicitly unproven.
