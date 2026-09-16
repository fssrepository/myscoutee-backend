# QA3 permission synchronization and retained-data check

## Scope

Current production code is packaged as `1.0.0-qa.3`. The user starts the update from a separate Operator browser. Release discovery/download uses the local HTTPS emulator at `https://192.168.153.1:18445`; no GitHub release is changed.

## Source verification

- Native notification permission already granted: save the browser preference immediately and register the delivery token in the background.
- Settings Update keeps the permissions popup open; the separate login permission gate still completes normally.
- Granted geolocation: Settings Update requests coordinates and synchronizes them in the background without blocking the popup. No background native permission prompt.
- Missing server coordinates: a failed first save remains eligible for retry; optimistic browser coordinates are not treated as a successful server save.
- 13 focused tests passed across `firebase-messaging.service.spec.ts` and `app-location.service.spec.ts`.
- Full production frontend build passed. Production package seed-parity and i18n audits passed. User browser verification on the installed QA3 is pending.

## Data comparison

Use `tools/qualification/retained-data-fingerprint.py` on the VM before and after the user-operated update. It records hashes for each production document and field, index definitions, and media key/size/ETag inventory. It does not copy document contents or media and is not a backup. ETags are storage fingerprints, not independent streamed SHA-256 verification.

Compare against the final handoff baseline, not the earlier source-restart baseline: the user continued working on the app between snapshots. Report every changed collection and field; distinguish runtime counters/timestamps and expected packaged static definitions from member data. Do not call an update preservation PASS before the after-state is measured.

Expected packaged static-seed differences from QA2 r8: `communityProviders.json` added; `affinityConfigs.json` and `i18n_messages.json` changed. Existing migration scripts are unchanged. This inventory alone does not prove what the installer actually changes.

## Initial release and browser (superseded by r4 below)

- Package: `packaging/dist/qa3-20260916-permission-sync/myscoutee_1.0.0-qa.3_amd64.deb` (335253454 bytes).
- SHA-256: `d8f8e32a5ce6852115448e3dd6e2603935b6a8b127ddb422ab06c9490414df05`.
- UI build: `qa3-20260916-permission-sync`.
- Package/helper signatures and update manifest signature verified with the retained QA key. Local HTTPS download independently matched the signed package hash. The VM successfully fetched the catalog using its configured CA.
- Local emulator catalog includes QA3 and the installed QA2 r8 package for rollback; runtime root `/tmp/myscoutee-local-release-qa3-20260916`. GitHub unchanged.
- Versioned launcher `OPERATOR-UPDATE-QA3-PRESERVATION` prepared one isolated Operator session and confirmed the Operator page. Other browser sessions preserved. No Check/Apply/Update action performed.
- Final pre-update snapshot: `qa3-handoff-before-update-20260916.json` beside this document; guest copy `/var/lib/myscoutee/qa-fixtures/qa3-handoff-before-update-20260916.json`.

Initial handoff: Operator browser handed to the user. Final served artifact and comparison baseline are now r4 below.

## Reported live save defect, 20:59

User reported that permission settings could not be saved in the Operator window, and provided a second normal-member screenshot stuck at Saving. Read-only diagnosis of the managed Operator browser confirmed:

- The server still serves `1.0.0-qa.2`, UI build `monitor-qa2-20260916-r6`; QA3 has not been installed by this preparation.
- Its actually loaded `chunk-2FWLD4FJ.js` implements `setDeviceNotificationsEnabled(true)` by awaiting `requestAndRegisterForActiveUser()`.
- Its displayed notification-enabled value additionally requires an enabled registered device when an active user exists.
- Browser native notification permission was `granted` and the saved browser preference was `true`. This confirms that the visible switch can disagree with the stored preference; it does not prove FCM delivery works.

QA3 source removes both dependencies from settings Save/display, as documented above. The user-owned normal-member browser was not controlled or inspected. Earlier tests do not constitute a verified live production save/reopen PASS. The installed QA3 save behavior remains pending the user-operated update and retest.

## Additional reported defects and r2 source verification

- Updates popup overflow: read-only live DOM measured a 367.22px section with a 513.48px implicit grid column. Its three action buttons were kept on one nowrap row. Source now constrains the update column with minmax(0,1fr) and opts this action row into wrapping/content sizing; other menu rows keep their defaults.
- Claim GET returned409. Read-only Registry status returned UNCONFIGURED, enabled=false, enrollment absent. The existing backend requires registered state. The client now confirms this prerequisite after409 and returns the existing translated registration-required message; other conflicts get a generic translated failure, not the raw URL/status text.
- Configuration tile moved immediately after Updates at the user's request.
- Notification configuration is resolved when the permissions popup opens, before the native permission click. Missing/inactive Messaging does not start a permission prompt, worker wait or token registration. Background registration never starts its own native prompt.
- Initial FCM registration gets a separate30s background bound instead of the3s settings-write bound. A5s successful token is accepted without blocking Save. Explicit opt-out writes the backend registration removal without waiting on Firebase token deletion; browser-owned permission/subscription remains intact.
- 54 focused tests PASS:13 messaging,4 location,37 HTTP Operator Registry. Production build and seed/i18n gates passed. These tests do not prove real delivery in the user's regular browser.
- Live Operator diagnostic: active service worker, browser Push subscription present; Firebase Installations and FCM registration requests both200; nginx recorded Operator device registration POST200. No exact timeout cause was captured from the separate user-owned member browser. Do not equate the Operator success with member/WebView proof.

r2 package was built but not published. The user then requested that unconfigured Messaging also render Notifications OFF and disabled. This is implemented in the popup/store and included in the repeated54 passing tests. QA3 r3 is being built with all reported fixes. Existing QA3 was not installed by Codex.


## Final source additions, 21:25

- The user accepted the existing runtime-config gate after its source was traced: `FirebaseAppService.loadFirebaseConfig()` fetches `/api/deployment/configuration/firebase-config` with `cache: no-store`. The backend returns persisted, active Operator configuration; VAPID is not taken from a frontend build-time key. No duplicate server capability flag was added. Production notification controls remain OFF/disabled without a usable active runtime; local adapter behavior is unchanged.
- Community defect confirmed through read-only authenticated GETs: announcements409 and Registry200 with `UNCONFIGURED`, `enabled=false`. The HTTP adapter now returns `operator.community.error.registration.required` for this confirmed prerequisite. Other failures retain translated generic/timeout messages. No registration or announcement data was mutated.
- Removed the standalone Operator heading beside Community/avatar, including its unused style and computed label.
- 57 focused tests PASS (13 Messaging,4 location,40 HTTP Operator Registry), including Community409 both with and without registered state and503. EN/HU bundles and all three Mongo translation seeds pass the i18n consistency audit.
- r3 completed but was not published. r4 packages the additional Community message and heading removal; only the frontend changed since the already-built backend. Real notification delivery, live QA3 interaction, and post-update data preservation still require the user-operated update.


## Final r4 handoff

- Served release version: `1.0.0-qa.3`; UI build `qa3-20260916-permission-sync-r4`.
- Artifact: `packaging/dist/qa3-20260916-permission-sync-r4/myscoutee_1.0.0-qa.3_amd64.deb`, 335252742 bytes.
- SHA-256: `20fa173e8330676009006cc8d62ca64e323f6cc748ac485a8a0020458a725b57`.
- Package/helper signatures and update manifest signature verified with the retained QA signing key. Full trusted-HTTPS download matched signed size and SHA-256.
- VM successfully fetched the catalog using its configured CA. Catalog retains the actual installed QA2 r8 package for rollback.
- Serving root `/tmp/myscoutee-local-release-qa3-r4-20260916`, PID1500176, origin unchanged: `https://192.168.153.1:18445`. Replaced only the previous fixture server after confirming no established download connection.
- Final baseline `qa3-r4-before-update-20260916.json`: QA2, 53 production collections, 7024 documents, 911 media objects. Guest copy `/var/lib/myscoutee/qa-fixtures/qa3-r4-before-update-20260916.json`.
- User must Check for updates again before Apply because the prepared QA3 artifact hash changed. Existing managed Operator session remains open. No browser action, app update, database mutation, Git action, or GitHub upload was performed in this finalization.

Status: signed QA3 r4 ready on HTTPS. User-operated installation and subsequent before/after data comparison are pending; real member notification delivery and installed UI verification remain unproven.


## User-installed r4 and follow-up correction, 21:36

Read-only inspection confirmed the server now serves QA3 r4. The Firebase config endpoint returned200 with a nonempty VAPID key; no key/credential value was recorded. Therefore the reported screen is not evidence of a missing server configuration. The user still reported that the Update control had been affected by the requested notification-toggle gate.

Source defect found: `AppSetupStore.allowDisabled` incorrectly included `notificationConfigurationPending`, blocking the unrelated settings Update action during Firebase configuration loading. It no longer does. The settings/login save flow snapshots notification availability and skips native permission and notification preference/registration writes while Messaging configuration is absent or pending. An OFF value on an unavailable control is not treated as an explicit opt-out; ordinary explicit opt-out when configured retains its existing behavior. Settings stays open.

19 focused tests PASS (15 Messaging,4 location), including the two new regressions: Update remains available during a stalled config lookup and missing config does not unregister a retained device. These follow-up source changes are NOT included in the installed or HTTPS-served r4 artifact. No extra package rebuild or runtime patch was performed for this correction.

Post-update evidence: `qa3-r4-after-update-20260916.json`, compared with the final r4 before-state. Version QA3,53 collections,7028 documents,911 media objects. No document removals, no changed indexes, no added/removed/changed media keys,size,ETag. Changes are limited to monitoring aggregates, scheduled/notification rule runtime state, translation bundle versions and four added translation documents, and one user's `devices` field. Concurrent user permission interactions prevent assigning that device-field change to the installer or the browser from these fingerprints alone. No broader claim of byte-identical user data or actual push delivery is made.


## Clarified defect: missing save feedback, 21:44

The user clarified that Save returns too quickly to show visible feedback. Read-only diagnosis found notification preference=true in the managed Operator browser and matched its hashed user/device/token against the persisted production user device: notificationsEnabled=true,lastRegisteredAtIso=2026-09-16T19:40:27.258679044Z. Recent device requests returned200 in25–42ms. This establishes this observed saved state, not every earlier attempt or push delivery.

The final correction is visual feedback: after settings save resolves, the existing Update action shows a green check-circle and shared success-ring animation for1000ms. It does not delay the write or close the popup. Editing, retrying, closing or destroying the store clears the feedback; save failures do not display success. The previous speculative pending-configuration save-path change is not part of this final implementation; the current save and registration flow is retained.

17 focused tests PASS, including an Angular DOM test that clicks the rendered Update button, verifies the saved browser preference, green button/success-ring class/check icon and open popup, then checks return to the normal button after1000ms. Other regression cases cover immediate completion, save error and close/reopen. Firebase remains mocked in this component test; it is not a live-VM animation or push-delivery PASS. The first DOM-test run exposed an incomplete matchMedia test stub; adding its listener methods fixed the harness, with no product workaround.

This animation is source-only. Installed and HTTPS-served QA3 r4 is unchanged.


## User-requested missing-VAPID observation, 21:46

On the QA3 guest, removed only `firebase.publicClient.vapidKey` from the persisted deployment configuration using a guarded QA-only fixture mutation. Previous key and document version retained root-only at `/var/lib/myscoutee/qa-fixtures/vapid-toggle-20260916/before.ejson`; no key value printed. Document version incremented for concurrency. User controls the browser observation. Public firebase-config now returns503 (not200); the exact503 cause has not been diagnosed. Restore only this saved VAPID field when requested; do not restore an entire configuration snapshot or replay activation.


## Messaging credential clarification and VAPID restore

At the user's request, restored the saved VAPID value using a guarded single-field mutation; public firebase-config returned200 again. The temporary missing-VAPID fixture is no longer active.

The user clarified that the notification toggle must depend on the Operator's Messaging service-account credential, not the Web Push VAPID key. Source now exports only `firebaseMessagingConfigured` in the existing public deployment configuration, derived with the same stored-credential presence check as Operator `messagingCredentialConfigured`. The client reloads this public capability for popup preparation, uses it for OFF/disabled state, and blocks background Firebase/token/device registration when absent. The local adapter derives the same field from its Operator configuration. VAPID remains checked when performing actual Web Push registration; it is no longer the toggle capability gate. This correction is not yet packaged or installed.


Messaging-capability verification:26 focused frontend tests PASS (20 Messaging/settings component,6 public deployment configuration),11 focused backend tests PASS (8 mapper,3 controller). Cases include VAPID present with Messaging credential absent => false; credential present with VAPID absent => true; the rendered notification toggle is OFF/disabled without Messaging credentials; no background Firebase/worker/token/device registration starts while absent. Public HTTP serialization exposes only the boolean. Production Java compilation succeeded. The normal filtered backend task initially hit76 unrelated test compilation errors; the two owning test sources were subsequently compiled/run with a temporary Gradle include filter using the existing cache, without altering unrelated test sources. The mapper test was adjusted for the intentional new public boolean and initialized its explicit public-client fixture. No deployment or live-VM capability test has been performed.


## Build stopped by user; OFF cleanup and two-hour history review, 22:05

The r5 production build had already completed when the stop request was checked; no build process remained and no package was installed. Do not start a new release build or deploy without renewed user direction. VMware and HTTPS still serve r4.

Read-only Git history review covered the frontend notification paths and related backend/fixture changes from20:00 through22:04. Commit1ada54be (20:40) separated saved browser preference from delivery registration, put HTTP registration in the background, kept settings open, reduced worker readiness to3s and introduced3s token/device-request limits. Background registration follows the user's request to save an already-granted preference without waiting for delivery setup; ON consequently does not prove delivery registration. No measurement justifying the3s initial token bound was found. Commit67ab6e7a (21:10) increased the token bound to30s and removed deleteToken from opt-out, leaving browser Push subscribed. Later changes gated unavailable controls (21:22), added visible save feedback (21:44), and changed the gate to server Messaging credential presence (21:54). The20:19 Firebase smoke fixture stages activation readiness explicitly as NOT RUN evidence, per the earlier fixture request; it does not prove browser messaging.

OFF now attempts both backend device removal and existing browser PushSubscription.unsubscribe independently, without requesting native permission, waiting for worker.ready, creating a worker, or loading Firebase config. Failure is reported through the existing translated save error and can be retried. Missing worker/subscription is a no-op. A token acquisition completing after OFF, including after its timeout, cleans up its late browser subscription. Browser site permission itself is unchanged.

31 focused tests PASS (25 Messaging/settings,6 deployment configuration). Added cases cover unsubscribe without retained app token or permission prompt, missing worker/subscription, failure/retry, backend failure with browser cleanup, and late token completion after OFF and timeout. These are mocked browser/FCM tests, not live delivery evidence. Only source/test/docs changed in this correction; no Git mutation, deployment, database mutation or browser action.


## User correction: await registration and restore original timeout behavior, 22:14

This supersedes the earlier source descriptions and tests that treated background registration as sufficient for successful settings Save. The user rejected that behavior. With Messaging configured, explicit ON Save now awaits token acquisition and the backend device write; failed acquisition, unavailable runtime/worker, or failed server write is reported with the existing translated error, without success feedback. A failed ON operation restores the preceding browser preference unless a newer operation superseded it. Background startup registration remains best-effort. Missing Messaging capability still prevents registration and unavailable-toggle opt-out; explicit OFF retains browser Push unsubscription.

Removed the custom30s token wrapper and3s HTTP device-write timeouts introduced during this investigation. Restored the pre-change10s worker-readiness bound. No replacement token/HTTP deadline was invented.

33 focused tests PASS (27 Messaging/settings,6 deployment configuration) with updated assertions: Save remains pending during token acquisition and server writes, success follows server completion, errors produce no success, retry works, and late token completion cannot re-enable an opted-out device. These tests use mocked Firebase/browser/server dependencies; previous live QA results do not prove this revised flow. No release build or deployment performed.
