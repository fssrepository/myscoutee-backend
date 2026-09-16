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

## Prepared release and browser

- Package: `packaging/dist/qa3-20260916-permission-sync/myscoutee_1.0.0-qa.3_amd64.deb` (335253454 bytes).
- SHA-256: `d8f8e32a5ce6852115448e3dd6e2603935b6a8b127ddb422ab06c9490414df05`.
- UI build: `qa3-20260916-permission-sync`.
- Package/helper signatures and update manifest signature verified with the retained QA key. Local HTTPS download independently matched the signed package hash. The VM successfully fetched the catalog using its configured CA.
- Local emulator catalog includes QA3 and the installed QA2 r8 package for rollback; runtime root `/tmp/myscoutee-local-release-qa3-20260916`. GitHub unchanged.
- Versioned launcher `OPERATOR-UPDATE-QA3-PRESERVATION` prepared one isolated Operator session and confirmed the Operator page. Other browser sessions preserved. No Check/Apply/Update action performed.
- Final pre-update snapshot: `qa3-handoff-before-update-20260916.json` beside this document; guest copy `/var/lib/myscoutee/qa-fixtures/qa3-handoff-before-update-20260916.json`.

Status: QA3 prepared and Operator browser handed to the user. Update and post-update comparison remain pending user action.

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
