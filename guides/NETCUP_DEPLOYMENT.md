# Netcup deployment

Operator procedure, verified on 2026-09-18. Run local commands from the
repository root; run server commands after connecting over SSH.
Connection details: [SSH access](NETCUP_SSH_ACCESS.md).

## Current deployment: 1.3.1 frontend patch (2026-09-29)

The installed Debian package is **1.3.0**, upgraded on 2026-09-28. The
[1.3.1 frontend patch](releases/v1.3.1.md) replaces only the nginx image with
`ghcr.io/fssrepository/myscoutee-nginx@sha256:dfdf6cd50a72b635a71b5a1ae4f6d32d653c0f3cd3455ac05e2ff4ea200056cf`.
Public HTTPS serves frontend version **1.3.1**, build
`9b350bf02162-20260928233206`. The landing and Settings → Install labels both
read this frontend version from `app-version.json`.

All eight containers are healthy; the other seven containers retain their
IDs, images and start times. Mounts, secrets, Compose configuration and all
environment settings except `NGINX_PRODUCTION_IMAGE` are unchanged. The partial
image selection is persistent, and all 13 external HTTP verification checks
passed. No DEB was built or installed and no data migration/reset was run.
See [release evidence](qualification/evidence/RELEASE_1.3.1_20260929.json).

The reviewed partial-image helper is already present at
`/root/myscoutee-partial-1.3.1-20260928/install-temporary-image.sh`. Its current
nginx operation state under `/var/lib/myscoutee/temporary-frontend/state.json`
retains the previous image for explicit rollback.

## Previous deployment: 1.0.2 partial update (2026-09-24)

The installed DEB remains **1.0.0**. All seven application containers now use
[the 1.0.2 release image digests](releases/v1.0.2.md#published-image-identities).
Their health and persistent image selection were verified. Public HTTPS serves
frontend build `6565d228726d-20260924151312` and `/entry` returns HTTP 200.

Both `production_db` and `demo_db` have configuration schema 5, recorded
migrations 004/005/006, synchronized system seeds and the new feed indexes.
Existing user/event/asset/payment record counts and ID hashes were retained.
The complete production backup is
`/var/backups/myscoutee/myscoutee-backup-20260924-172935.tar.gz`.
The demo backup, prior configuration/image selections, release inputs and
per-service logs are under `/root/myscoutee-partial-1.0.2-20260924` (root-only).

SSH access is retained in the ignored `packaging/client-tools/netcup.local.env`
file, distinct from the application's Operator credential file. See the
[access guide](NETCUP_SSH_ACCESS.md). The remaining sections below document
the original installation and earlier updates, not the current image selection.

## Host preparation before the application package

The Debian 13 minimal host preparation is a separate client-tools command:

```bash
scp packaging/client-tools/prepare-debian13-minimal.sh root@62.83.35.187:/root/
ssh root@62.83.35.187 'bash /root/prepare-debian13-minimal.sh'
```

Verify the SSH host fingerprint as described in the access guide. The script
runs on the target as root. It installs the required system packages, adds
Docker's official Debian repository when needed, installs Docker CE and the
Compose plugin, and verifies the daemon. It refuses conflicting container
runtime packages without removing them. It does not install MyScoutee or
configure domains, SSH credentials, TLS certificates, or firewall policy.

Fresh-host execution and a second execution both succeeded on this server:
Debian 13 minimal AMD64, Docker Engine 29.8.1, Docker Compose v5.5.1.

## Application installation

The existing `v1.0.0` DEB was downloaded from GitHub and matched against the
locally signature-verified release artifact before installation:

```text
myscoutee_1.0.0_amd64.deb
SHA-256: 06f9bc4126d2064a949ba85c116a51fc4fac5a4381836a1b0ffae8eacd48ee66
```

It was installed using `apt-get install -y --no-remove ./myscoutee_1.0.0_amd64.deb`
after host preparation. Package version remains `1.0.0`.

For the initial IP-based checks, these deployment environment values were set:

```dotenv
DOMAIN=62.83.35.187
WEBSOCKET_ALLOWED_ORIGIN_PATTERNS=https://62.83.35.187,https://localhost,https://127.0.0.1
EMAIL_BASE_URL=https://62.83.35.187
PAYMENT_SIMULATOR_PUBLIC_BASE_URL=https://62.83.35.187
PAYMENT_SIMULATOR_APPLICATION_BASE_URL=https://62.83.35.187
```

Firebase Authentication and Messaging are configured through Operator as
described below. External Registry participation and application updates are
not configured. See the domain procedure below for HTTPS.

The current Operator username and password are available locally in:

```text
packaging/client-tools/netcup-operator.credentials.env
```

The file has mode `0600` and is excluded by the versioned
`/packaging/client-tools/*.env` ignore rule. It is not a release artifact.
Open it locally when signing in; do not paste its contents into Git or logs.
The initial credential is also retained outside the repository at:

```text
/home/raxim/.local/share/myscoutee/netcup/operator-bootstrap-20260918.txt
```

The remote installation log also contains that credential. It is protected
under `/root/myscoutee-install-20260918/install-private.log`. Do not publish it.

## Independent client-tools packaging

```bash
MYSCOUTEE_VERSION=1.0.0 bash packaging/release/package-client-tools.sh
```

This builds the helper archive and its checksum only. It does not build the
application, Docker images, or the DEB. The full DEB packager calls this same
builder when a new application package is intentionally produced.

The release stays at `1.0.0` / `v1.0.0`. The owner uploads the large DEB through
GitHub's web interface; the five smaller assets are its checksum, client-tools
archive/checksum, signed release manifest and signed update catalog. All must
match the same final candidate.

The final release candidate is:

```text
packaging/dist/stable-1.0.0-netcup-operator-layout-20260918/myscoutee_1.0.0_amd64.deb
SHA-256: 6ce3e76370b133d504df9e55acc565f4aadc980791ca8dd0e34b1059d1bad4b7
Frontend build: stable-20260918-operator-layout
```

The currently installed full DEB has SHA-256
`2916abc901d6fe2ec9506575cafa06a2835c1c0f8effe4b315fa8c83f5ee5a2c`.
The latest frontend was applied separately from GHCR, as described below; this
does not claim installation of the entire newer DEB. The independently built
client-tools archive includes the new partial-update helper; the embedded copy
in the already built DEB predates that helper. Use the standalone signed archive.

For normal fresh installation or complete replacement, use the signed DEB with
[the normal client-tools installer](../packaging/client-tools/README.md#install-or-reinstall).
That installer owns package qualification and the deliberate same-version
unpack/configure sequence. A full reinstall refreshes disposable demo data and
preserves production data, deployment credentials and TLS configuration. A
normal `apt install` can skip an already installed version; do not mistake that
for replacement of the payload.

## Partial service update from GHCR

Run the helper **on the Netcup server**, after a normal DEB deployment exists.
It persists a partial image selection; it does not replace the DEB installer. Full
instructions, supported services and failure handling are in
[the client-tools guide](../packaging/client-tools/README.md#partial-update-from-ghcr-run-on-the-server).

1. Download and signature-verify the standalone `myscoutee-client-tools_1.0.0.tar.gz`
   using `verify-release.sh`, the matching release manifest and the independently
   trusted release public key. Copy/extract the archive on the server.
2. For private Packages, log in there with `sudo docker login ghcr.io -u fssrepository`.
   Enter a classic token with `read:packages` at the password prompt. Do not put
   the token into this guide, Git, a command-line argument or the helper archive.
3. Select the exact digest of the intended service image from the trusted
   publisher. Use one service per command; do not use a mutable `:1.0.0` tag.
4. Wait for the helper's health result, then verify public HTTPS and the changed
   application behavior. Use `status` to inspect the retained operation or
   `rollback` to restore its previous local image.

The currently deployed frontend build is `stable-20260919-avatar-session-preview`
(application version remains `1.0.0`). The verified command for this image is:

```bash
sudo bash install-temporary-image.sh install nginx \
  ghcr.io/fssrepository/myscoutee-nginx@sha256:75a61fff6efa733fa7af72fb4e7992431a2a042673e3f345a6efb34b2199edf1
sudo bash install-temporary-image.sh status nginx
# Only when a rollback is wanted:
sudo bash install-temporary-image.sh rollback nginx
```

For the backend use service `profilemanagement` and image
`ghcr.io/fssrepository/myscoutee-api@sha256:VERIFIED_DIGEST`; for the Registry use
service `registry` and `ghcr.io/fssrepository/myscoutee-registry@sha256:VERIFIED_DIGEST`.
Those Packages are associated with the private `myscoutee-backend` and
`myscoutee-registry` repositories respectively. The payment simulator Package
is associated with the private `myscoutee-payment-simulator` repository. The Docker pull uses GHCR and
the account's Package access; no Git clone or source-repository checkout is needed.

The helper atomically updates only the selected service image key in
`/etc/myscoutee/myscoutee.env`, preserves its owner/mode and `.env` symlink,
keeps the existing Compose overlays, and restarts only the selected service.
It leaves the installed package identity, unrelated configuration and volumes in place and does not invoke demo reset hooks. A database image swap
must retain the installed upstream version; database migrations and new package
versions use the normal deployment process. Run updates serially and never
concurrently with package installation or HTTPS configuration.

The image selection survives normal service restarts and server reboots, even
when application version `1.0.0` is unchanged. The script retains its historical
`install-temporary-image.sh` filename for compatibility. A later patch can be
applied directly; rollback restores the immediately preceding image and its
persistent setting. A normal DEB installation is a separate operation and can
replace that selection with its packaged image. Keep the previous image locally
for rollback. A container that disappears during an interrupted Docker operation
requires normal deployment recovery rather than an assumed successful rollback.

On this host, frontend installation from private GHCR, explicit rollback and
reapplication all succeeded. All seven containers were healthy afterward; the
six other containers retained their IDs during the partial update. The image
key was then made persistent; all unrelated environment keys, the secret file
and the TLS certificate retained their contents. The server-side publishing credential used
for this one-time verification was stored in a temporary root-only Docker
configuration and removed afterward; later private pulls require server login.

After persisting the nginx selection, `systemctl restart myscoutee.service`
was exercised successfully: the exact GHCR digest was retained and all seven
containers became healthy. This verifies the normal boot service startup path;
a full host reboot was not performed for this check.

The subsequent `stable-20260918-landing-cache` update used the same persistent
helper, replacing nginx only. All seven containers were healthy afterward;
the other six container IDs, unrelated environment settings and secret
environment file were unchanged. The helper reported both
`matchesSelectedImage: true` and `persistentSelectionMatches: true`.
Public HTTPS served the expected build and service worker, and the deployment
verifier passed all 13 checks. No DEB was rebuilt or installed for this update.
Its local publication and deployment receipts are under
`packaging/dist/partial-1.0.0-landing-cache-20260918/` (gitignored).

The subsequent `stable-20260919-webview-reload` frontend update prevents
bootstrap resource-error recovery from restarting an already running session
or looping offline. The production build and packaged files were verified,
and the published GHCR digest was applied with the same persistent updater.
All seven containers were healthy; the six other container IDs and unrelated
configuration remained unchanged. Public HTTPS served byte-identical index,
worker and version files, and all 13 deployment checks passed with a 15-second
per-request timeout. The focused source regression/cache checks passed 22/22.
Physical-device WebView behavior was not exercised. No DEB was rebuilt or
installed. Publication and deployment receipts are retained under
`packaging/dist/partial-1.0.0-webview-reload-20260919/` (gitignored).

The `stable-20260919-form-popup` frontend update adds a painted loading ring
before shared form construction, an immediate loading shell for the lazy
profile editor, retained current-user profile views, and pencil-button press
feedback. Profile saves still use `POST /api/auth/me/profile-ext`; the retained
view is a UI cache, not a replacement for backend persistence. Nine focused
tests passed, covering paint ordering, retained popup visibility, unchanged
profile reuse, discarded edits, confirmed saves, logout and identity changes.
The default test compilation encounters pre-existing errors in unrelated specs;
the focused run used a scoped TypeScript configuration. The production build
passed and all 332 frontend files were matched against the packaged image.
The persistent nginx-only update left all seven containers healthy and the
other six container IDs/configuration unchanged. Public files matched the build
and deployment checks passed 13/13. Device-specific rendering latency has not
been measured. Receipts and the complete source patch are retained under
`packaging/dist/partial-1.0.0-form-popup-20260919/` (gitignored).

The `stable-20260919-startup-auth` frontend update removes the redundant
Firebase session restoration from the public root redirect. Stored session
and role data only choose a destination; its protected guard still verifies
authentication and the server user before activation. Normal root-to-game,
admin and operator startup paths now restore the session once rather than
twice. Later protected navigations still revalidate; no authentication cache
or expiry window was added. Ten focused routing tests passed, including
invalid sessions, stale admin hints, onboarding, pending authentication and
failed server lookups. The pre-change run reproduced the duplicate calls.
Production build and image checks passed (332 matching frontend files).
The nginx-only deployment left seven containers healthy, the other six IDs
and unrelated configuration unchanged. Public artifact files matched the
build and all 13 deployment checks passed. Physical-device startup duration
was not measured. Receipts and source patch are retained under
`packaging/dist/partial-1.0.0-startup-auth-20260919/` (gitignored).

The `stable-20260919-startup-shell` frontend update keeps the existing
application-level logo visible through the first route's redirects, guards
and lazy component loading. Focus/resume, the watchdog and early outlet
activation no longer hide it while navigation is pending. It is dismissed
after navigation completes, or on a terminal navigation failure. Individual
page loaders, Home and SmartList are unchanged. Eight shell regression tests
and the ten authentication routing tests passed; the production build and
332-file image comparison passed. Frontend source commit:
`d71322e9` (includes the previous authentication fix in `f8b43eca`).
The nginx-only persistent update left all seven containers healthy and the
other six container IDs/configuration unchanged. Public index, worker and
version matched the artifact, and all 13 deployment checks passed. No
physical-device timing or full browser flow was measured. Receipts are under
`packaging/dist/partial-1.0.0-startup-shell-20260919/` (gitignored).

The subsequent `stable-20260919-game-startup` partial update makes the existing
game header controls visible while profile data loads, keeping dependent actions
disabled until ready. It releases the startup overlay on route activation,
without the additional navigation-end wait or 120 ms delay. This supersedes
the overlay handoff described for `startup-shell` above. The 19 focused tests,
production build, 332-file image comparison and all 13 public deployment checks
passed. Only nginx was replaced; the other six container IDs and unrelated
configuration were unchanged, and all seven containers remained healthy.
The persistent image selection and public index, worker and version were
verified against the published artifact. Source is frontend base `d71322e9`
plus the recorded patch; receipts and patch are retained under
`packaging/dist/partial-1.0.0-game-startup-20260919/` (gitignored).
Physical-device WebView behavior has not been verified.

The `stable-20260919-startup-performance-2` nginx-only update reduces eager
shared-component imports, defers closed popup components, avoids proactive
Firebase popup/iframe initialization, and limits demo seed prewarming to demo
sessions. Translation case matching also avoids repeated locale setup. The
user reverted the preceding header/overlay changes; this build retains that
revert and reduces the work before the existing startup logo ends.
Production build, 34 focused tests, 367-file image comparison and 13 public
checks passed. Exact registry image identity and persistent server selection
were verified; all seven containers are healthy and the other six IDs and
unrelated configuration are unchanged. Three repeated starts of the installed
Chrome WebAPK over ADB, with the existing session/cache, showed median logo
removal at 2.682 s (previously 3.380 s), and enabled buttons/avatar at 2.786 s
(previously 3.626 s, a 23.2% reduction). Observed decoded JavaScript fell from
4.50 MB to 2.84 MB. No demo seed or Home-filter component loaded during these
starts. These are repeated browser-navigation measurements, not fully cold
Android launches or full popup/provider-login qualification. Source patch,
image/server receipts, CPU profiles and measurements are retained under
`packaging/dist/startup-optimization-20260919/` (gitignored), with details in
`REPORT.md` and `comparison.json`.

The `stable-20260919-startup-avatar-4` nginx-only update paints the shared
Home header and disabled avatar/photo before the protected route is ready,
keeps identical mobile avatar geometry during handoff, and selects the small
managed image in legacy, private and public image namespaces. The preview uses
the server profile image tied to the current Firebase session, because the
Firebase UID and application profile ID differ; it does not use the provider's
monogram image. The loading sidebar retains that same preview until ready.
Authentication and role guards remain unchanged, including `/auth/me` and its
private-media session cookie. A trial removing that request caused a device
401 and was reverted. No database repair or image regeneration was needed:
all three existing variants returned 200. The displayed small photo is 128×66,
448 bytes, compared with the previous 1280×656, 23780-byte avatar source.
Production build, 65 focused tests, 371-file image comparison and all 13 public
checks passed. The final device check confirmed the small photo remains visible
under the loading ring and through handoff, with unchanged avatar geometry.
Seven containers are healthy; only nginx changed. Repeated earlier native
launches still needed 4.3–5.2 seconds for full readiness; this work does not
establish full native startup below three seconds. The final image/geometry
check and exact registry/server receipts, along with failed/update-transition
measurement exclusions, are recorded in
`packaging/dist/startup-shell-20260919/REPORT.md` (gitignored).

The `stable-20260919-avatar-session-preview` nginx-only update fixes the
intermittently empty startup avatar. Device evidence reproduced the problem on
the preceding current build: the saved login survived, but without the
session-lifetime media cookie the early private-image request correctly returned
401. `/auth/me` later restored that cookie. The frontend now retains the small
bitmap within the matching application session after authenticated loading and
uses those bytes during startup, avoiding that premature private-media request.
The preview is limited to 64 KiB and raster formats, invalidated on source changes
or logout, and cannot enable actions or bypass authentication. Successful image
loads also clear the hidden state left by an earlier failed load.
Production build, 85 focused tests and a 371-file image comparison passed. Two
device reloads with only the derived media cookie removed showed the photo inside
the disabled loading ring, unchanged geometry through handoff, normal cookie
restoration and no early avatar HTTP request. These are browser reload regression
checks, not full native launch measurements. The exact registry digest and
persistent server selection match; all seven containers are healthy, with the
other six container IDs and unrelated configuration unchanged. Evidence and
public verification results are retained under
`packaging/dist/avatar-consistency-20260919/REPORT.md` (gitignored).

## Concurrent-session setting

`AUTH_MAX_ACTIVE_SESSIONS=-1` disables the per-user concurrent-session cap.
This is the default in the shared Spring configuration, dev/prod/E2E Compose
profiles and the installation environment template. A positive number sets the
maximum; zero and values below `-1` are rejected at application startup.
The Spring property is `auth.max-active-sessions`.

Session registration, logout/revocation, login audit and new-login security
notifications remain active. The response reports `maxActiveSessions: -1`
when the cap is disabled. Existing active sessions do not need to be cleared.
For an existing deployment, changes to a container environment setting require
recreating the backend container; changing only a host shell variable does not
change an already running container. The current backend image defaults to
`-1` even with the older installed Compose file.

The deployed backend image for this setting is:

```text
ghcr.io/fssrepository/myscoutee-api@sha256:2d87f54333e7e8f7df06c978c13ba4b298b2354f3e099a0c167a05876cebf3d8
```

It was applied with `install-temporary-image.sh install profilemanagement`;
the selected image is persistent. The running JAR checksum matched the built
artifact, all seven containers were healthy, and the other six container IDs
and unrelated configuration were unchanged. Three simultaneous HTTP logins
under an isolated demo identity were accepted with `maxActiveSessions: -1`;
reusing the third session retained a count of three. All three verification
sessions were then logged out. The public deployment checks passed 13/13.
Receipts are in `packaging/dist/partial-1.0.0-session-limit-20260918/` (gitignored).

## Domain and HTTPS

In **Netcup Customer Control Panel → Domains → myscoutee.com → CloudDNS**,
set the following record and apply the changes:

| Hostname | Type | Destination | TTL |
| --- | --- | --- | --- |
| `@` | `A` | `62.83.35.187` | `3600` |

This record has been saved and DNS resolution verified. Only `myscoutee.com`
is configured; `www.myscoutee.com` is not included. DNS changes do not install
or start the application. SSH remains available directly by IP.

Sign in with the initial Operator credential and open the Operator
configuration's TLS section. Use:

| Setting | Value |
| --- | --- |
| Enabled | Yes |
| Mode | Automatic / Let's Encrypt |
| Domain | `myscoutee.com` |
| Contact email | `raxim.uk@gmail.com` |
| Automatic renewal | Yes |

Save and wait for the TLS job to complete. The application submits a request
to its installed TLS worker, which validates the public HTTP challenge path,
obtains the certificate, updates the public URL configuration, and applies it
to the deployment. Keep inbound TCP ports **80 and 443** reachable; port 80
also serves certificate validation. Outbound DNS and HTTPS must work.

The same operation can be submitted through the authenticated Operator API:
`PUT /api/operator/configuration/tls`. Check the returned job using
`GET /api/operator/configuration/tls/jobs/{jobId}`. Authentication tokens and
private keys must not be copied into this guide.

The certificate contact address does not itself grant Operator access. The
intended final Operator account is `raxim.uk@gmail.com`. Until Firebase has
been configured and that login is ready, use the existing generated bootstrap
Operator credential. Changing `OPERATOR_USER` away from the generated address
disables bootstrap login, so do that only as part of the Firebase handover.

## Firebase Authentication and Messaging

Sign in using **For Partners → Operator access → Continue with email**, using
`packaging/client-tools/netcup-operator.credentials.env`. Open **Configuration**.
The same popup contains HTTPS, branding, privacy contact, administrator access,
social links, payments, and Firebase. Configure only the required sections.

The deployed Firebase project is `myscoutee-8e57b`. The approved local inputs are:

- `server/projects/profile/secrets/firebase-web-config.json`: browser project
  identifiers, API key and Web Push VAPID public key.
- `server/projects/profile/secrets/firebase-service-account.json`: service-account
  JSON used in the write-only Authentication credential and Messaging credential
  fields. Keep this file out of Git, release assets, screenshots and logs.

To configure or replace Firebase:

1. In Firebase Authentication settings, ensure Google and email/password sign-in
   are enabled and `myscoutee.com` is an authorized domain. Preserve other
   authorized domains. The deployed auth domain remains
   `myscoutee-8e57b.firebaseapp.com`.
2. Populate the Firebase fields in Operator from the approved files, then select
   **Save Firebase**. A changed revision requires new tests before activation.
3. Select **Auth Test** and require success.
4. Select **Message Test** in the HTTPS browser. Allow browser notifications
   when prompted. The application generates its own temporary browser readiness
   token; the optional extra-device token can remain blank.
5. After both tests pass, select **Activate Firebase**. Reopen Configuration and
   confirm **Firebase active** and configured credentials without re-entering
   the private JSON.

Both provider tests and activation passed on 2026-09-18. The authorized domain
was added without removing existing entries. This proves the provider and
browser Messaging readiness checks; a personal Google sign-in and delivery of
ordinary application notifications are separate end-to-end checks.

Keep using the generated Operator login until the owner's Google sign-in is
verified and the Operator identity is deliberately handed over. Activation is
stored in the encrypted deployment configuration; the installation environment
flag alone does not describe the active Operator-managed Firebase revision.

## Routine checks and restart

On the server:

```bash
systemctl status myscoutee --no-pager
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
free -m
df -h /
/opt/myscoutee/packaging/scripts/qualify-deployment.sh check \
  --expected-version 1.0.0 --timeout-seconds 180 --leave-running-on-failure
```

`myscoutee.service` is a oneshot service; `active (exited)` is expected when
its container stack has started successfully. Check container health as well.
The qualification command checks the installed stack and seed data, including
a temporary MongoDB read/write check; it does not replace public HTTPS checks.

To restart deliberately, then verify:

```bash
systemctl restart myscoutee
/opt/myscoutee/packaging/scripts/qualify-deployment.sh check \
  --expected-version 1.0.0 --timeout-seconds 180 --leave-running-on-failure
```

From the local repository, check the public deployment with normal TLS trust:

```bash
node packaging/verify-deployment/run.mjs \
  --url https://myscoutee.com --expected-version 1.0.0 --demo-session
```

For HTTPS renewal status, on the server:

```bash
systemctl status myscoutee-tls-renew.timer --no-pager
systemctl list-timers myscoutee-tls-renew.timer
journalctl -u myscoutee-tls-renew.service -n 50 --no-pager
```

The installed timer checks daily with up to two hours of randomized delay.
Automatic renewal also requires the saved TLS configuration to remain enabled,
with Automatic mode and automatic renewal enabled.

To test certificate renewal without replacing the live certificate, on the server:

```bash
docker run --rm \
  -v /opt/myscoutee/server/data/certbot/conf:/etc/letsencrypt \
  -v /opt/myscoutee/server/data/certbot/www:/var/www/certbot \
  certbot/certbot:v5.4.0 renew --dry-run \
  --webroot --webroot-path /var/www/certbot
```

Certbot may wait several minutes before starting its renewal attempt. Do not
run another certificate operation concurrently.

## Visible demo smoke session

After host qualification, open the dedicated browser from the local checkout:

```bash
node guides/qa/tools/open-checkpoint-browser-sessions.mjs NETCUP-DEMO-SMOKE
```

This opens a visible, isolated Chrome window at `https://myscoutee.com/entry`.
It starts anonymously, preserves other managed sessions, and does not disable
certificate validation. For this deployment checkpoint only, Chrome resolves
`myscoutee.com` to `62.83.35.187`, avoiding the workstation's stale upstream DNS
cache. It does not change system DNS or `/etc/hosts`.

The launcher prepares the window; it does not execute the smoke journey.
The owner has authorized visible CDP operation for this demo smoke test.
Follow [the Netcup demo smoke checklist](qualification/NETCUP_DEMO_SMOKE.md):
create a new demo profile through the UI, then use that same new profile for
the remaining steps. Logging into a pre-existing seeded user does not satisfy
the registration step or replace this journey.

## Verified deployment state

The preceding full `1.0.0` DEB (SHA-256 `2916abc…e5a2c`) was installed on
2026-09-18; the final frontend was then applied using the GHCR helper above. Host qualification and all 13 public deployment checks passed
after installation, with all seven containers healthy. The partial updater now persists the nginx image key. Other deployment
configuration, secret configuration and the live TLS certificate remained
unchanged. Operator login using the local Git-ignored credential file was
verified over HTTPS.

Firebase Authentication and Messaging have passed their Operator tests and
are active. The owner uploads the DEB; Codex uploads its five accompanying
small assets after the installed candidate is verified.

On 2026-09-18, the fresh-start and ordinary service-restart qualification passed.
The final domain stack passed host qualification, and its Nginx, application,
MongoDB and payment simulator were healthy with no automatic restarts.

The Let's Encrypt certificate covers `myscoutee.com` and currently expires on
2026-12-17. Automatic renewal is enabled, its systemd timer is active, and the
Certbot renewal dry run passed. All 13 public deployment checks passed,
including normal certificate trust, redirects, frontend assets and precache,
backend content and the anonymous Operator access boundary. This verification
used the current public A record explicitly because the workstation's upstream
DNS cache still returned the previous parking address.

## Firebase login partial update — 2026-09-18

The account-linking frontend is deployed as build
`stable-20260918-firebase-link`, retaining application version `1.0.0`:

```text
ghcr.io/fssrepository/myscoutee-nginx@sha256:cd61c0af93d9cc76891ab756c2bcc666e964954f1603620fe9215d25f08e2ab2
```

It was installed with `install-temporary-image.sh install nginx <digest>`.
The updater verified the persistent `NGINX_PRODUCTION_IMAGE` selection and
health. All seven containers are healthy; the other six container IDs and
unrelated environment/secret configuration remained unchanged. The backend
continues running the previous session-limit image with default `-1`.

Ten EN/HU login messages were added to the production and demo catalogs, with
bundle versions `2026.09.18.en.114` and `2026.09.18.hu.114`. The same scoped
changes were persisted in the installed seed files so a later seed sync will
retain them. Other catalog messages were verified unchanged. Canonical source
bundles and all three repository seed sets are synchronized for future builds.

Verification: 17 focused frontend tests, 22 focused backend tests, the i18n
seed audit and the production frontend build passed. Public checks verified
the exact new authentication JavaScript hash, both live translation bundles,
and all 13 deployment checks. These checks do not prove personal Google or
Facebook OAuth consent; follow [the account-linking guide](FIREBASE_ACCOUNT_LINKING.md)
for the remaining normal-browser check and required Firebase provider settings.

No DEB was built or installed, and no release assets were replaced. Continue
using GHCR and persistent partial updates for subsequent fixes; build another
DEB only when explicitly requested by the owner.

### Facebook button correction

The later `stable-20260918-facebook-disabled` frontend patch restores the
original disabled Facebook button and **Coming soon** badge. Facebook setup
is incomplete; activating this button was outside the requested account-linking
change. The underlying linking support remains available for later activation.
The persistent nginx selection is now:

```text
ghcr.io/fssrepository/myscoutee-nginx@sha256:495ba3b1d95825b925a6850e3912bd0e0695eb03fd375641638277f51d785312
```

The production build and 17 focused frontend tests passed. Only nginx was
recreated; all seven containers were healthy, with the other six container IDs
and unrelated environment/secret configuration unchanged. No DEB was built.
The public build ID and authentication chunk hash matched the local artifact.
The deployment verifier passed 12 of 13 checks; complete precache verification
remained inconclusive because repeated requests encountered timeouts and
connection resets, including a separate check with reduced concurrency.

## Important server paths

| Purpose | Path |
| --- | --- |
| Installed application | `/opt/myscoutee` |
| Deployment configuration | `/etc/myscoutee/myscoutee.env` |
| Persistent application data | `/var/lib/myscoutee/data` |
| TLS configuration and job status | `/var/lib/myscoutee/tls/runtime` |
| Let's Encrypt certificate state | `/var/lib/myscoutee/data/certbot/conf` |
| Operator login, local Git-ignored file | `packaging/client-tools/netcup-operator.credentials.env` |

Keep passwords, private keys, secret configuration files and unreviewed logs
outside Git. This guide records commands and locations, not their secret values.
