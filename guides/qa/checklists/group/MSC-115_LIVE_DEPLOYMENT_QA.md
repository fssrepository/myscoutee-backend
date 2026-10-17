# MSC-115 — separate live-deployment qualification

Status: agreed five-point VMware execution complete (2026-10-17); public-host
publication qualification remains separate. These checks require an actual configured deployment, external
identity/provider account or installed client. They do not block closure of the
separately proven development scope. This document does not authorize production
mutation, publication, real invitations or money movement.

Run top to bottom when that environment is available. Each item records its
deployment/version, account/device prerequisites, expected/observed result and
evidence separately. No local PASS is copied into this table.

| ID | Prerequisites and ordered action | Completion evidence | Status |
| --- | --- | --- | --- |
| MSC115-LIVE-01 | Published candidate with real configured identity provider and disposable consenting test account. Open an actual Work invite, sign in/register through that provider, claim it and verify private/base workspace membership. Repeat with an independent Community invite/account. | Actual redirect/provider/account/profile and saved membership; no publisher-account reuse. Local invitation/claim/denial tests remain in development QA. | USER ACCEPTED — preceding VMware session |
| MSC115-LIVE-02 | Configured Firebase deployment and physical browser/device with notification permission. Cause one authorized test Campaign/Case notification and verify foreground, background and reopened destination in the intended workspace. | Actual device delivery and permissions; persisted outbox alone is insufficient. Disabled 204, misconfigured 503 and in-app notification/counter behavior stay in development QA. | PASS — VMware provider/device scope |
| MSC115-LIVE-03 | Published GitHub Pages/local build and deployed HTTP build at their real URLs. Open fresh and warmed clients, verify mode articles/images/social links, then repeat offline and reconnect. | Actual deployed asset/cache/service-worker behavior, with cold/warmed/offline outcomes distinguished. Local public-catalog/no-write/override/retry tests stay in development QA. | PASS — VMware HTTP/PWA; public Pages NOT RUN |
| MSC115-LIVE-04 | Installed supported PWA/mobile client and the published candidate. Open Work/Community child popup, guide and nested menu; use native Back, background/resume and reopen. | Device/OS/browser/version and exact navigation/guide/state behavior. Responsive desktop/mobile CDP checks stay in development QA. | PASS — Android VMware PWA |

MSC-116/119 third-party MCP hosting, Events, publication and marketplace review
are independent tasks, not additional MSC-115 closure requirements. Manual
cash/transfer history is tested without executing a real bank transaction.

Development closure must name these four open follow-ups and retain their
status. Any product defect found here reopens its owning implementation scope;
separation is not permission to hide a known development defect.

## VMware execution — 2026-10-17

The agreed execution order has five points: (1) registration/login,
(2) Work/Community invitation, (3) push, (4) cache/offline/reconnect,
(5) native PWA navigation/background/resume. Points 1 and 2 were accepted by
the user in the preceding Codex session; preserve that scope without replay.
The four contract rows above remain the definitions, not a second execution order.

Candidate: MyScoutee 1.4.1 on the existing VMware installation, HTTPS forwarded
to the separate Android PWA at `https://localhost:8443`; build
`msc123-worker-completion-20261017` (final UI spacing/update completion; functional checks on
`msc123-offline-profile-20261017`). Device: Android 14, 22126RN91Y, Chrome
151.0.7922.173, standalone
Chrome WebAPK `org.chromium.webapk.aebafa51aa4ce7a87_v2`. The production app is separate.
This run does not claim final public-host/release publication qualification.

- **1 — CLOSED, user acceptance.** Registration and login accepted after the
  previous session's fixes.
- **2 — CLOSED, user acceptance.** User explicitly closed Work/Community; no replay.
- **3 — PASS, VMware provider/device scope.** Existing real test identities,
  normal authenticated Case API and the actual configured Firebase provider.
  A dedicated test Case was created for the notification proof. Foreground
  deliveries entered the app inbox without a duplicate system notification.
  Background delivery produced an Android notification owned by this test PWA;
  the service-worker notification carried the exact Case ID and Community
  workspace. Native tap selected Community and opened that Case's board;
  the user confirmed the destination. Provider receipts: one token success and
  zero failures per observed delivery. Raw tokens are excluded.
- **4 — PASS, VMware HTTP/PWA scope.** A network-loaded new build previously
  left its worker waiting, so offline reload served an older build. The existing
  updater now activates the waiting worker even when the document already has
  the current build, without another reload. It also rechecks at installation
  completion when download exceeds the initial bounded wait. Verified no waiting/installing
  worker, identical online/offline build and retained Firebase session. The
  profile cache also used the server profile ID while restoration looked up
  the Firebase UID; current-user responses now use the requesting identity's
  cache key. Offline reload remains on `/game` with the saved real profile and
  the explicit network-required message. Reconnect restores the Community
  service list without login. Its previous 404 was repaired by resolving the
  persisted Community profile ID; VMware returns 200 with a legitimate empty
  result. The existing transport workspace query/DTO preserves that ID; no
  transport implementation change or split-runtime claim is made. The warmed
  public entry retains all four articles offline; opening one also loads its
  text and 1280-pixel image. No broken images observed. No client data was
  cleared to produce a cold-cache claim. Public Pages/public-host coverage is
  not inferred from this VMware result.
  Final rollout `msc123-worker-completion-20261017` automatically activated its
  completed worker while the page stayed open: no waiting/installing worker,
  final-build data caches, one document load and no observed JS exception.
- **5 — PASS, Android VMware PWA scope.** Native Back closes the Case card menu
  while preserving the Cases popup, and closes the child task board while
  preserving its parent list. The task-board guide and its step-picker open in
  the matching context; Back dismisses the controlling guide and its picker
  without closing the underlying popups. Home makes the document hidden;
  returning through Android Recents restores the same Cases popup and test
  Case. Reopening the installed standalone PWA restores the Firebase identity,
  Community workspace and service screen without login.

Cleanup: the owned push Case is in trash, the temporary private membership was
removed through its owner API, and the additional producer session was closed.
The three setup-only memberships and their three generated profiles were
removed with exact-ID guards and a private restore snapshot; original private
Work/Community memberships remain accepted. Original base selection restored.
Network shaping is stopped and the user's notification permission is retained.

Completed UI adjustment: the avatar pencil uses right -14 px and top -6 px;
the avatar's red notification counter moves only 3 px outward/upward because
its viewport margin is smaller. The completion badge overhang increases from
6 to 13 px downward, following the user's separate clarification.
The user accepted the final placement on the device; no further spacing change.

Focused auth regression tests (56), backend service-profile tests (5) and
frontend service-profile tests (2) passed before the user restricted subsequent
verification to VMware. Later PWA/profile-cache regression cases were added
without another standalone test run; production compilation and the actual
VMware/device checks above provide the subsequent verification. No separate
KVM/monolith run was performed under that explicit scope restriction.
