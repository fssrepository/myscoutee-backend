# OPERATOR-CONFIGURATION-LIFECYCLE-001 — Firebase configuration and activation

## Purpose

Verify the remaining Firebase changed-save, capability-test and activation path,
then restore the baseline. Follow the blocks below in order.

## Fixture prerequisites

The versioned fixture prepares Operator access, public/payment configuration,
required identity/device state and the rollback snapshot. Verify the fixture,
then launch the managed browser. Keep credentials in ignored secret files.

## C01 — Firebase save and capability tests

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

## C02 — activate and reuse the identity

1. Choose **Activate Firebase** after both capability tests pass. Require the
   active revision to match the saved/tested revision.
2. Keep the Operator recovery session usable. Check that ordinary `/entry`
   exposes Firebase sign-in for the activated configuration.
## C03 — restore and close

1. Restore the changed Firebase configuration through the retained fixture,
   then run its status oracle. Compare the exact original values, revisions and
   entry mode; public and payment configuration must remain unchanged.
2. Restore fixture-owned bootstrap settings and remove only declared temporary
   identities, sessions and device records. Confirm retained Operator recovery
   access and the original public entry capability.
3. Correlate C01/C02 results with the saved/tested/active revision and exact
   cleanup. Close the Configuration row only after all results and restoration are verified.
