# Netcup deployment

Deployment record and operator procedure, 2026-09-18.
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

## Application installation and current configuration

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

Firebase, public Let's Encrypt TLS, external Registry participation, and
application updates have not been configured by this procedure.

The initial Operator credential was retained outside Git, with mode `0600`, at:

```text
/home/raxim/.local/share/myscoutee/netcup/operator-bootstrap-20260918.txt
```

The remote installation log also contains that credential. It is protected
under `/root/myscoutee-install-20260918/install-private.log`. Do not publish it.

## First-start defect and source correction

The original package's Mongo health probe became healthy while the official
Mongo entrypoint was still importing its initial datasets through a temporary
daemon. The demo reset then dropped and recreated the demo application user.
The concurrent initializer lost authentication, Mongo restarted, and the
service's preparation step exited with status 137. This was not a host OOM.
Starting the service again did not repair the incomplete production seed.

The correction in `packaging/scripts/reset-demo-state.sh` waits for both Docker
health and the final `mongod` process at PID 1 before any demo reset. Focused
tests cover delayed initialization, an initialization timeout retaining the
retry marker without resetting data, and rejection of a production reset target.

The corrected script was installed on the server for verification. The
installed server therefore includes a source fix not yet present in the
published DEB. The original script and the first attempt's MongoDB and MinIO
data are retained under:

```text
/root/myscoutee-install-20260918/before-fresh-start/
```

Production user count was zero before the clean-start check. Services were
stopped before the data directories were moved aside; no parallel stack was
started. The configured credentials were preserved.

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

## Domain and HTTPS handoff

At the last check, `myscoutee.com` still resolved to `46.38.243.234`.
The user will change the Netcup CloudDNS `@` A record to `62.83.35.187`.
After DNS is confirmed, configure the public domain, HTTPS certificate and
automatic renewal, and change the IP-based public URLs above to the domain.

The package's bootstrap certificate covers `localhost` and `127.0.0.1` only.
An ordinary browser or TLS client must reject it at the public IP. Diagnostic
IP checks can use the exact certificate retrieved over verified SSH with the
`localhost` TLS name; that proves the endpoint and application response, not
public browser trust or domain TLS readiness.
