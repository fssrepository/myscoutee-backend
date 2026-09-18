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

Firebase, external Registry participation, and application updates are not yet
configured. See the domain procedure below for HTTPS.

The initial Operator credential was retained outside Git, with mode `0600`, at:

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

The user requested that the next DEB build and GitHub release replacement wait
until the corrected application is running on the domain and they have seen it.
No release replacement has been performed during this deployment work.

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

## Important server paths

| Purpose | Path |
| --- | --- |
| Installed application | `/opt/myscoutee` |
| Deployment configuration | `/etc/myscoutee/myscoutee.env` |
| Persistent application data | `/var/lib/myscoutee/data` |
| TLS configuration and job status | `/var/lib/myscoutee/tls/runtime` |
| Let's Encrypt certificate state | `/var/lib/myscoutee/data/certbot/conf` |
| Initial Operator credential on the local computer | `/home/raxim/.local/share/myscoutee/netcup/operator-bootstrap-20260918.txt` |

Keep passwords, private keys, secret configuration files and unreviewed logs
outside Git. This guide records commands and locations, not their secret values.
