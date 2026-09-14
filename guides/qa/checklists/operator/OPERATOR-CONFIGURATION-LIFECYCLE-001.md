# OPERATOR-CONFIGURATION-LIFECYCLE-001 user test guide

One Configuration journey: public configuration, HTTPS, payment and Firebase,
followed by fresh sign-in and exact restoration. These checkpoints belong to
one existing matrix row; they are not new independently counted testcases.
Execution evidence and PASS status belong in the QA pack and CSV/XLSX ledger.

## Shared coverage: run once and reference both guides

| Checkpoint | Operator ownership | Reuse in the WebView / Push journey |
| --- | --- | --- |
| C01 — baseline and access | Existing Operator access; reversible configuration snapshot | Shared environment preparation only; not proof of consumer login |
| C02 — public configuration | Save, reopen, public read and restore | No matching WebView assertion; remains required here |
| C03 — HTTPS | Configured TLS action, result and restoration | Not proved by a localhost PWA; remains required here |
| C04 — payment configuration | Save, reopen and capability result | Not covered by notification permission or Firebase; remains required here |
| C05 — Firebase save and tests | Save/reopen, Auth Test, Message Test | Active Firebase prerequisite for both notification guides; do not repeat the same revision's tests merely because the guide changes |
| C06 — activation and fresh sign-in | Activate, eligible fresh registration, reload and repeat sign-in | Shared with WebView section 0, Registration and return (`ENTRY-FIREBASE-REG-001`) |
| C07 — device-specific entry and permissions | Reference the consumer identity and active revision | WebView owns desktop/phone location, online/offline, native permission and layout observations; Push owns background/closed-app delivery |
| C08 — restoration | Restore configuration and retained Operator recovery | Perform once after all shared branches that need active Firebase |

Sharing requires the same relevant build, configuration revision and identity.
One desktop result does not prove the phone boundary. Auth Test does not prove
consumer sign-in; Message Test does not prove background/closed-app delivery.
If a relevant repair changes the behavior, replay that affected checkpoint.

## Preparation

- Use the existing isolated QA deployment, configured Operator and controlled
  Firebase project. Keep the current phone cache and desktop window geometry.
- Codex verifies the fixture with the versioned harness before mutation.
  Reuse an already staged matching snapshot; never stage over its baseline.
- The existing Firebase fixture is `operator-domain OPERATOR-FIREBASE-001`:

  ```bash
  server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status operator-domain OPERATOR-FIREBASE-001
  ```

  For a clean, unstaged start only, use the same command with `stage`.
  It snapshots the deployment configuration document. It does not restore
  external TLS certificates, DNS, provider state or accounts created by login.
- Before C03/C04, identify the prepared TLS/provider environment and its
  restoration procedure. A local HTTP origin is not an HTTPS success.
- Keep real credentials in the ignored application secret files. Evidence
  records configured/masked state, revision and outcomes, never secret values.
- Open the normal Operator page and Configuration. The Operator label moves
  with the Community/avatar controls and must not overlap them.

## C01 — capture the baseline

1. Record the current public configuration, TLS state, payment provider and
   masked Firebase state. Keep the original values available for restoration.
2. Confirm the existing Operator can open Configuration. Fixture-prepared
   access is setup; count Operator login only if actually performed.

## C02 — public configuration

1. Change one reversible public value, such as the displayed branding name,
   to the controlled value declared for this run. Save that block once.
2. Close and reopen Configuration. The normalized saved value remains.
3. Observe its public surface after an ordinary reload. Restore the original
   value and verify the original public result in the same way.

## C03 — HTTPS

1. In the prepared TLS environment, apply the declared reversible HTTPS
   configuration through its visible action.
2. Observe progress and the resulting capability state. Reopen the block and
   compare the normalized saved configuration.
3. Open the configured trusted HTTPS origin and confirm its actual certificate
   and connection. Restore the prior configuration and fixture-owned TLS state.

## C04 — payment configuration

1. Use the controlled provider environment and its declared credentials and
   public URL. Register/update the payment block through its normal action.
2. Reopen it: provider and normalized values persist, credentials stay masked,
   and the capability result agrees with the configured provider.
3. Restore and reopen the prior configuration. Checkout, card callbacks and
   captured payments belong to the existing Event/Asset tests, not this block.

## C05 — Firebase save and capability tests

1. Enter the project's public client configuration and the two service-account
   credential fields; choose **Save Firebase**.
2. Reopen Configuration. Public values persist. Stored private credentials are
   blank/masked with a registered indicator; leaving them blank preserves them.
   The word **rotate** means replace a stored credential, not rotate a device.
3. Choose **Auth Test** and observe the actual result for the saved revision.
4. Leave **Optional extra test-device token** empty for the ordinary browser
   readiness test. Choose **Message Test**. If the browser asks for notification
   permission, use the native prompt. The browser obtains its own token.
5. Require the actual successful result for that revision. Codex compares the
   masked harness oracle: both tested revisions match the saved revision.

The extra token sends to an additional controlled destination once and is not
saved. It is not required for the ordinary browser test. Neither credential
field is a test-only field; both configure the application's Firebase service.

## C06 — activate and reuse the identity

1. Choose **Activate Firebase** after both capability tests pass. Require the
   active revision to match the saved/tested revision.
2. Keep the existing Operator recovery session usable. In the consumer test
   session, open ordinary `/entry` at an eligible fixture location.
3. Complete a real fresh Firebase sign-in, required consent and onboarding.
   No injected session, demo actor or fabricated verification counts as sign-in.
4. Reload, log out and sign in again. Codex verifies one Firebase subject/email
   links to one application user/profile and repeat entry reuses that identity.
5. Reference this same evidence from WebView section 0 instead of repeating
   the same registration simply to satisfy a second document.

## C07 — shared desktop and phone regression

Continue [WebView section 0](../notifications/MOBILE-WEBVIEW-LIFECYCLE-001.md#0-repeat-the-complete-entry-journey)
on each required device: Budapest and London eligible, Paris unavailable,
location deny/retry, browser online/offline recovery, consent and session flow.
The unavailable label and icon must fit the mobile button. Browser connectivity
events must update entry without a reload; a backend-only outage is a separate
transport failure and does not necessarily emit a browser offline event.

Continue [Push lifecycle](../notifications/MOBILE-PUSH-LIFECYCLE-001.md) for
device registration and delivery when that row is active. Cache, clipboard,
account isolation and application resume remain WebView-owned steps.

## C08 — restore and close

1. Complete the shared active-Firebase branches before restoring the baseline.
2. Restore changed public/TLS/payment settings through their normal controls,
   verify their public effects and retained Operator access.
3. Codex runs the retained Firebase fixture's `reset`, then `status`, and
   compares the exact original configuration and entry mode. Clean up only
   declared fixture identities, bootstrap settings and external overrides.
4. Require separate evidence for C02, C03 and C04 before closing the whole
   Operator row. A successful Firebase subset is only a partial result.

## Outside this manual journey

Invalid-input, secret-leak, callback-security, TLS-worker failure, renewal and
fault-injection tests remain automated regression coverage under the canonical
QA pack. Operator Registry, Updates and Revenue retain their separate existing
matrix rows; this guide neither removes nor passes them.
