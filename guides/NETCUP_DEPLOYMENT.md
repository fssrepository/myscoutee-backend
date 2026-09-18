# Netcup deployment

Operator procedure, verified on 2026-09-18. Run local commands from the
repository root; run server commands after connecting over SSH.
Connection details: [SSH access](NETCUP_SSH_ACCESS.md).

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
It is an optional temporary path; it does not replace the DEB installer. Full
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

The verified frontend command for this build is:

```bash
sudo bash install-temporary-image.sh install nginx \
  ghcr.io/fssrepository/myscoutee-nginx@sha256:ad3abebbe54fb3ec6906b2562441735b764cb88bf5d8853d41201b90f84ea773
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

The helper preserves the existing Compose overlays and restarts only the
selected service. It leaves the installed package identity, configuration and
volumes in place and does not invoke demo reset hooks. A database image swap
must retain the installed upstream version; database migrations and new package
versions use the normal deployment process. Run updates serially and never
concurrently with package installation or HTTPS configuration.

This path is intentionally temporary: the normal service startup/reinstall
uses the package-configured image again. Keep the previous image locally for
rollback. A container that disappears during an interrupted Docker operation
requires normal deployment recovery rather than an assumed successful rollback.

On this host, frontend installation from private GHCR, explicit rollback and
reapplication all succeeded. All seven containers were healthy afterward; the
six other containers retained their IDs. Environment/secret files and the TLS
certificate retained their hashes. The server-side publishing credential used
for this one-time verification was stored in a temporary root-only Docker
configuration and removed afterward; later private pulls require server login.

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
after installation, with all seven containers healthy. The deployment
configuration, secret configuration and live TLS certificate remained
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
