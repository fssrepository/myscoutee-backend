# OPERATOR-CONFIGURATION-LIFECYCLE-001 user test guide

## Purpose

One Configuration journey: public configuration, HTTPS, payment and Firebase,
followed by fresh sign-in and exact restoration. These checkpoints belong to
one existing matrix row; they are not new independently counted testcases.
Execution evidence and PASS status belong in the QA pack and CSV/XLSX ledger.

## Checkpoint ownership and fixture preparation

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
Codex records the exact previously passed assertions before startup and uses
fixtures for their resulting configuration/identity/device state. Execute only
a missing or behaviorally affected assertion in its owning test. A no-change
Save or existing active revision does not prove a new changed-value save.
Prepared credentials or sessions do not count as capability/sign-in evidence.

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
   masked Firebase state, active revisions and existing operation IDs. Codex
   snapshots their persisted records and unaffected blocks for comparison.
2. Confirm the existing Operator can open Configuration. Fixture-prepared
   access is setup; count Operator login only if actually performed.

## C02 — public configuration

1. Change one reversible public value, such as the displayed branding name,
   to the controlled value declared for this run. Save that block once.
2. Close and reopen Configuration. The normalized saved value remains.
3. Observe its public surface after an ordinary reload. Codex correlates the
   changed block with exactly one configuration revision and the displayed
   result; unrelated blocks retain their values.
4. Restore the original value and verify the original public result after
   reload. Retain the changed/restored records separately from fixture cleanup.

## C03 — HTTPS

1. In the prepared TLS environment, apply the declared reversible HTTPS
   configuration through its visible action.
2. Observe progress and the resulting capability state. Reopen the block and
   compare the normalized saved configuration.
3. Codex correlates the changed TLS block with its configuration revision and,
   where the visible action creates work, its actual operation/job result.
   A saved value alone does not prove certificate provisioning or readiness.
4. Open the configured trusted HTTPS origin and confirm its actual certificate
   and connection. Restore the prior configuration and fixture-owned TLS state;
   verify the restored capability and retained Operator access.

## C04 — payment configuration

1. Use the controlled provider environment and its declared credentials and
   public URL. Register/update the payment block through its normal action.
2. Reopen it: provider and normalized values persist, credentials stay masked,
   and the capability result agrees with the configured provider.
3. Codex correlates the changed payment block with one configuration revision
   and the provider capability result. Other blocks remain unchanged; a UI
   success message alone does not prove the saved provider configuration.
4. Restore and reopen the prior configuration. Checkout, card callbacks and
   captured payments belong to the existing Event/Asset tests; fixtures supply
   their already-proven prerequisites here.

## C05 — Firebase save and capability tests

Reuse exact prior changed-save/reopen/capability evidence for the relevant
revision. If only a no-change Save was proven, retain the changed-save check
below as unproven; do not relabel the no-change result as full coverage.


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
6. Codex verifies one revision for the controlled configuration change and
   correlates capability outcomes with that revision. Credentials remain
   masked and other configuration blocks remain unchanged.

The extra token sends to an additional controlled destination once and is not
saved. It is not required for the ordinary browser test. Neither credential
field is a test-only field; both configure the application's Firebase service.

## C06 — activate and reuse the identity

When the matching WebView registration branch already proves the assertions
below, use its evidence and fixture-prepared resulting identity; do not repeat
registration. A still-missing activation or identity-link assertion is tested
once here and referenced by the consumer guide.


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

## C07 — consumer prerequisites from completed tests

1. Codex references the exact device/build/revision evidence from
   [WebView section 0](../notifications/MOBILE-WEBVIEW-LIFECYCLE-001.md#0-repeat-the-complete-entry-journey)
   and the [Push lifecycle](../notifications/MOBILE-PUSH-LIFECYCLE-001.md).
   Fixtures supply their proven identity, configuration and device state.
2. Do not repeat location, online/offline, consent, native permissions, cache,
   clipboard, account isolation, resume or push delivery in Configuration.
   Any unproven consumer boundary stays assigned to its owning guide for a
   single execution; a Configuration capability test cannot pass it.

## C08 — restore and close

1. Complete the shared active-Firebase branches before restoring the baseline.
2. Verify the public/TLS/payment restorations already performed in C02–C04;
   restore only a block still changed. Confirm original public/capability
   results and retained Operator recovery access without repeating completed work.
3. Codex runs the retained Firebase fixture's `reset`, then `status`, and
   compares the exact original configuration and entry mode. Clean up only
   declared fixture identities, bootstrap settings and external overrides.
4. Compare every block's original values, configuration revision history and
   relevant operation result. Codex verifies no duplicate subject/user/profile
   links and exact restoration of the declared local/external QA state.
5. Require distinct public, TLS, payment and Firebase evidence before closing
   the row. A successful Firebase subset remains a partial result.

## Outside this manual journey

Invalid-input, secret-leak, callback-security, TLS-worker failure, renewal and
fault-injection tests remain automated regression coverage under the canonical
QA pack. Operator Registry, Updates and Revenue retain their separate existing
matrix rows; this guide neither removes nor passes them.

## Original matrix coverage

| Source requirement | Owning checks |
| --- | --- |
| Public configuration save/reopen/public read/restore | C02 |
| TLS configuration, actual capability and restoration | C03 |
| Payment configuration, masking and provider result | C04 |
| Firebase changed revision, Auth/Message results and activation | C05–C06; exact prior assertions reused |
| One honest result and one revision per changed block | C01 baseline; C02–C05 correlated records |
| One Firebase subject/user/profile link and repeat identity reuse | C06; fixture replaces already-proven registration |
| Consumer device boundaries | C07 references their owning WebView/Push tests |
| Full restoration and retained recovery access | C08, including external state beyond the Mongo snapshot |
