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

## 1. Deployment checks — workstation checks and reporting

Run these checks from the workstation against the configured deployment. Reuse
this checkpoint's verified non-demo session where authentication is required;
preparing a session does not prove provider login. Browser interactions use the
same phone. Reuse this checkpoint’s completed provider authorization and recorded
results; do not repeat them because the checklist order changed.

1. **Help initialization/update.** On a separately initialized disposable
   deployment, verify fresh initialization and the supported help update/import
   path for HU/EN against the canonical revision. Never reseed live production
   as a QA shortcut. Verify configured HTTP and MCP reads separately.
2. **Private invitation denial.** Using verified non-demo identities, reject an
   unauthorized direct/deep link to a pending invitation's private actions and
   resources. Prepare the private event, pending recipient and unrelated account
   within this checkpoint.

3. **OAuth discovery and configuration.** Verify discovery metadata,
   issuer/resource and callback configuration from the workstation. This step
   requires no provider login or grant. Execute client/grant protocol checks
   only in block2; they are not a second execution of this step.
4. **Report templates.** Verify the frontend repository's actual issue chooser
   and concise Bug, Feature and Question templates without submitting an issue.
   Authenticated chooser interaction, if needed, uses the same phone.

## 2. Configured OAuth — phone browser with the external client

Keep the browser on the phone throughout the remaining interactive checks.
Run the Inspector service on the workstation and forward its callback port to
the phone, alongside the deployment HTTPS port. Use the separately launched
official Inspector wrapper in
`myscoutee-mcp/tools/oauth-client` against this checkpoint's configured test
installation. A VMware deployment is sufficient when the client can reach its
HTTPS endpoint and the configured provider/callbacks. This branch verifies
application configuration and real provider login; it does not require ChatGPT.

1. Connect by MCP URL. Complete normal Firebase/Google/email sign-in as configured,
   approve the displayed profile/group, return to Inspector and call an allowed
   private read operation through that same OAuth connection. Verify the client's
   public-client registration against the configuration recorded in1.3.
2. Exercise existing-session authorization, cancellation and reconnect. Using
   this run's client/grant, deny invalid client/redirect/PKCE/resource, expired
   or reused code and refresh replay without exposing private data. Each
   assertion is executed once; reuse this run's recorded results from the
   connection sequence. Discovery/configuration checks belong only to1.3.
3. Verify that browser logout does not revoke an independently issued OAuth
   grant or API key; explicit permission/key revocation does. Ordinary app
   requests still require their browser session.
4. Restore this run's identities/configuration/checkpoint and remove its test
   client records. Reuse the revocation evidence from2.3; revoke only any
   remaining grants created by this run, then verify scoped cleanup.

A separate [post-deployment external-client smoke guide](../../../qualification/MCP-CLIENT-CONNECT-SMOKE.md)
owns real ChatGPT/Claude/Codex installation and conversation acceptance.
Those checks are outside this QA case and do not block its completion.
A prior dev/Inspector result cannot substitute for this configured-provider run.

## 3. Mobile checks — one final device block

Continue on the same phone after the machine-run work. Use this run's origin,
account and frontend revision; snapshot browser/OS permissions and pre-install
state. Record the expected deployed runtime version.

### 3.1. Firebase entry, registration, profile fields and location

Reuse the recorded Firebase results. Skip completed assertions when reaching
this block; do not repeat them because the checklist order changed. Provider
login is performed by the user only when a remaining assertion requires it.

Use one registration journey for authentication, location and registration-field
checks. Continue with that created profile; do not repeat registration as a
separate testcase block.

1. **Fresh registration.** With no saved coordinate, request location through
   Setup before opening provider login. In this entry context, the action uses
   the same **Login / Bejelentkezés** label as the landing button; after successful
   permission/location checks it continues login. **Close** only dismisses Setup
   and never starts login, whether demo or Firebase. Setup opened from Settings
   retains **Update** and stays open after saving. Complete normal provider login:
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
   preview. Check the required Setup Login/Close gate and enter the existing
   profile on the first attempt, without registration. Also verify the saved-point
   case. Real logout/account/session changes discard stale reads; a failed group
   switch unlocks the selector.
4. **Location retry and account isolation.** Reuse the controlled accounts and
   their scoped location checkpoint. Pending coordinates survive reload. Fail the
   profile request: no cached-success acknowledgement and no loss of the pending
   point; retry sends it again. Switching accounts must not send the other
   account's point, and an older reply must not clear a newer staged point.

### 3.2 Installed-app version

1. Install the tested app through the normal supported browser/device flow,
   then open it.
2. Verify that the runtime version remains at the right of Settings when the
   installation action is hidden. It must match the deployed revision.

### 3.3 Permission recovery and cleanup

1. Deny the applicable permission in browser/OS settings, then open Setup.
   Change the external setting as described by the platform guidance, return
   to MyScoutee and retry through the normal UI.
2. Verify the actual Android permission outcome; retain the observed denied and
   successful retry states.
3. Remove only this run's installation/session and restore captured permissions
   and account state.

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
