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
4. Open Riley's menu and select `Location`. Confirm the popup has normal phone
   width/height, scrolls inside its body and closes once with its close action.
5. Open `Location` again. It must have the same layout and fresh usable
   controls; the earlier overlay must not remain behind it.
6. Open `My Assets -> Transport`, select the exact controlled Asset printed by
   Codex and choose `Edit`. In Details, copy this value on the phone:

   `https://example.com/qa/mobile-webview-source`

7. Select the Source link `Paste link` action once. The field shows that exact
   value without stretching, clipping or blanking the popup. Cancel the Asset
   editor; this layout check does not save an Asset change.
8. Reopen `Location`, then close it and open one other available side-menu
   popup. Both use their normal dimensions and scrolling; no Asset editor or
   clipboard overlay leaks into them.
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
22. In the app, confirm the offline state is explicit. Open only the supported
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

## Expected effort

| Work | Clean run | With one cache/transport replay |
| --- | ---: | ---: |
| Old/new build and ADB preflight | 25 min | 60 min |
| Cold-start upgrade and popup regression | 25 min | 55 min |
| Resume mutation and reconciliation | 20 min | 45 min |
| Account switch and cache isolation | 20 min | 45 min |
| Offline/online recovery, evidence and cleanup | 20 min | 55 min |
| **Total** | **110 min** | **260 min** |
