# DEPLOY-EXTERNAL-CONFIG-001 — Externally configured authentication and integrations

Domain: Identity & access. This is an independent testcase.
This checklist covers the existing checks requiring provider configuration or
external client registration, configured registration and installed/device
acceptance. Use an isolated configured test deployment and
controlled accounts; it does not authorize changing a live production system.
Execution status and evidence belong in the QA ledger, not this checklist.

## Prerequisites

- Configure and activate the tested Firebase revision through the existing
  Operator configuration flow. Use controlled fresh and existing accounts.
- For configured OAuth, provide the external development client, reachable test
  HTTPS endpoint and matching provider/redirect configuration.
- Reuse the existing fixture harness and browser launcher. Real authentication
  must use the normal UI; injected demo sessions cannot prove these checks.

## 1. Firebase entry, registration, profile fields and location

Use one registration journey for authentication, location and registration-field
checks. Continue with that created profile; do not repeat registration as a
separate testcase block.

1. **Fresh registration.** With no saved coordinate, request location through
   Setup before opening provider login. Successful **Update** keeps Setup open;
   **Close** then opens login. Without accepted location, **Close** only dismisses
   Setup and never opens login. Reuse the same Update/Close behavior as demo entry,
   without changing its selector/admission flow. Complete normal provider login:
   if no application user exists, registration opens. Check Children choices,
   including non-disclosure, as part of this same onboarding and record the
   selected value. Complete registration. Verify Mongo account/active group
   profile and local IndexedDB separately. The pending point is sent as
   latitude/longitude on `/auth/me/profile-ext` (alongside groupId when selected),
   with no location X-header; only a successful authoritative response clears it.
2. **Profile fields after registration.** Reuse the resulting account. Verify
   that the saved Children value appears with its stored meaning in the profile.
   Check HU/EN No, Yes and non-disclosure through the existing profile editor and
   view, capturing/restoring the edited values. Check the Hungarian profile filter
   for Nincs/Van/non-disclosure against the recorded values. A label repair or
   language/value variant does not require registering the same account again.
3. **Existing account login.** Snapshot and stage missing coordinates for the
   existing controlled account, then logout and sign in once with a changed avatar
   preview. Check the required Setup Update/Close gate and enter the existing
   profile on the first attempt, without registration. Also verify the saved-point
   case. Real logout/account/session changes discard stale reads; a failed group
   switch unlocks the selector.
4. **Location retry and account isolation.** Reuse the controlled accounts and
   their scoped location checkpoint. Pending coordinates survive reload. Fail the
   profile request: no cached-success acknowledgement and no loss of the pending
   point; retry sends it again. Switching accounts must not send the other
   account's point, and an older reply must not clear a newer staged point.
5. **Private invitation denial.** Using verified non-demo identities, reject an
   unauthorized direct/deep link to a pending invitation's private actions and
   resources. Prepare the private event, pending recipient and unrelated account
   within this checkpoint.

## 2. Configured OAuth with the external development client

Use the separately launched official Inspector wrapper in
`myscoutee-mcp/tools/oauth-client` against this checkpoint's configured test
installation. A VMware deployment is sufficient when the client can reach its
HTTPS endpoint and the configured provider/callbacks. This branch verifies
application configuration and real provider login; it does not require ChatGPT.

1. Connect by MCP URL. Complete normal Firebase/Google/email sign-in as configured,
   approve the displayed profile/group, return to Inspector and call an allowed
   private read operation through that same OAuth connection.
2. Repeat with an existing signed-in session, cancellation and reconnect. Check
   the installation's issuer, resource, callbacks and public-client registration.
   Deny invalid client/redirect/PKCE/resource, expired or reused code, refresh
   replay and revoked grants without exposing private data.
3. Verify that browser logout does not revoke an independently issued OAuth
   grant or API key; explicit permission/key revocation does. Ordinary app
   requests still require their browser session.
4. Revoke this run's grants and restore its identities/configuration/checkpoint.

A separate [post-deployment external-client smoke guide](../../../qualification/MCP-CLIENT-CONNECT-SMOKE.md)
owns real ChatGPT/Claude/Codex installation and conversation acceptance.
Those checks are outside this QA case and do not block its completion.
A prior dev/Inspector result cannot substitute for this configured-provider run.

## 3. Configured deployment help initialization/update

On this testcase's separately configured deployment,
verify fresh initialization and the supported help update/import path for both
languages against the canonical help revision. Never reseed live production as
a QA shortcut.

## 4. External reporting and installed-app version

Prepare this run's frontend origin/revision, a controlled authenticated GitHub
session and a supported installable browser/device. Capture the pre-install
state and the expected runtime version; do not use another testcase's session.

1. Open Report an issue and the frontend repository's actual issue chooser.
   Verify concise Bug, Feature and Question templates without submitting an issue.
2. Install the tested app through the normal supported flow, then open it.
   Verify that the runtime version remains at the right of Settings when the
   installation action is hidden. It must match the deployed revision.
3. Remove only this run's installation/session and restore captured settings.

## 5. Android physical-device permission recovery

Prepare a controlled Android device for this test origin, with this run's account
and an explicit snapshot of browser/OS permission settings.

1. Deny the applicable permission in browser/OS settings, then open Setup.
   Change the external setting as described by the platform guidance, return
   to MyScoutee and retry through the normal UI.
2. Verify the actual Android permission outcome; retain the observed denied and
   successful retry states.
3. Restore the recorded permissions, account state and test installation.

## 6. iOS physical-device permission recovery — IGNORED

Ignored at the user's request: no iOS device is available. This block does not
gate completion of blocks1–5 and has no PASS evidence.

For a future explicitly resumed iOS run, prepare a controlled iPhone or iPad for this test origin, with this run's
account and an explicit snapshot of Safari/OS permission settings.

1. Deny the applicable permission in Safari/OS settings, then open Setup.
   Follow the iOS guidance to change the external setting, return to MyScoutee
   and retry through the normal UI.
2. Verify the actual iOS permission outcome and retain the observed denied and
   successful retry states.
3. Restore the recorded permissions, account state and test installation.

## Restaging, checkpoints and cleanup

- Start with an isolated configured test deployment and a snapshot of its tested
  configuration revisions. Prepare fresh and existing identity actors, two
  disjoint groups/profile owners, a private pending invitation and unrelated
  denial actor. Record their IDs in this testcase's fixture manifest.
- Register the fixture and actor/browser configuration under this testcase's
  own checkpoint ID in the existing versioned harness and launcher. Verify the
  baseline before starting; no retained state from another testcase is assumed.
- Capture separate entry checkpoints for the combined Firebase/registration/profile-field journey,
  remote MCP, help setup, installed-app/reporting and each physical-device branch.
  Restage the applicable checkpoint before retrying a failed branch. Snapshot
  provider settings, test identities, invitation/membership records and grants
  within the exact cleanup scope; never reset unrelated deployment data.
- For fresh-install help checks, use a separately initialized disposable
  deployment. For update checks, stage the recorded prior revision and execute
  the actual supported update path, then verify HU/EN and MCP reads.
- After execution, revoke this run's keys/grants, unregister its test clients
  where applicable, clean up its test accounts and restore captured configuration
  and database state. Independently verify cleanup before closing the testcase.
- Earlier successful combinations are diagnostic context only. Every assertion
  here needs this testcase's own staged execution and persisted evidence.
