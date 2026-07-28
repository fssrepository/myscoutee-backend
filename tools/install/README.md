Install Tools
=============

This folder contains the Debian package build and remote install flow.

Build the Debian package:

```bash
tools/install/build-deb.sh
```

Package version is read from:

```text
server/.env
```

Change this line in that file:

```bash
MYSCOUTEE_VERSION=1.0.0
```

Or override it for one build without editing the file:

```bash
MYSCOUTEE_VERSION=1.0.1 tools/install/build-deb.sh
```

The package is created under `packaging/dist/`, for example:

```text
packaging/dist/myscoutee_1.0.0_amd64.deb
```

Config
------

The installer reads one local config file:

```text
tools/install/install.env
```

That file is gitignored. Update it with the current target host, user, and password or key.

The minimum required values are:

```bash
REMOTE_HOST=
REMOTE_USER=
REMOTE_PASSWORD=
```

`REMOTE_KEY_FILE` can be used instead of `REMOTE_PASSWORD`. When `REMOTE_PASSWORD` is set, the script uses `sshpass` when it exists locally, otherwise it falls back to OpenSSH askpass through `setsid`.

The live smoke URL is derived from `REMOTE_HOST`:

```text
http://${REMOTE_HOST}
```

The remote installer does not initialize a node, choose a registry, or write a
registry URL/scope. Registry configuration belongs to the authenticated local
operator workflow after the product is running.

Explore mode on an installed production node may display the sample Operator
workspace, but it never contacts a registry or creates deployment keys/state.
The package does not install a local Go registry. Real registration is
available only to an authenticated Operator and uses the separately deployed
registry's HTTPS endpoint.

Remote Install
--------------

For a fresh-install check, purge the remote package, config, data directories, compose stack, and MyScoutee Docker volumes first:

```bash
tools/install/purge.sh
```

This purge also removes `/etc/myscoutee/registry` and
`/var/lib/myscoutee/registry`. Use the production backup script first if the
registered deployment identity, deployment code, or receipt history must be
recoverable.

Run the install:

```bash
tools/install/install.sh
```

Use a specific deb:

```bash
tools/install/install.sh packaging/dist/myscoutee_1.0.0_amd64.deb
```

The install flow is:

1. upload the deb to `REMOTE_DEB_PATH` with `scp`
2. read the installed `myscoutee` version on the remote host
3. remove and reinstall when the installed version already matches the deb
4. install the deb as an upgrade when the version differs
5. restart `myscoutee` with systemd
6. run `/opt/myscoutee/packaging/scripts/smoke-mongo-compatibility.sh` against `http://${REMOTE_HOST}`
7. `curl http://${REMOTE_HOST}/api/i18n/bundle?lang=hu` and verify a bundle payload comes back
8. report whether the node is uninitialized, initialized but unregistered, or
   already has a preserved deployment code
9. check for MyScoutee Docker containers stuck in `Restarting`

The script is fail-safe by default. If install, start, smoke test, or restart-loop detection fails, the remote script prints `systemctl`, Docker, compose, and journal diagnostics to the terminal, then stops `myscoutee`. Set `STOP_ON_FAILURE=false` only when you explicitly want to leave the failed service running for manual inspection.

Registry availability is irrelevant to installation because installation
makes no registry request. If a node was initialized and registered earlier,
upgrades preserve its identity, local state, and receipts.

Local Forward
-------------

Forward the configured `REMOTE_HOST` to localhost:

```bash
tools/install/forward-localhost.sh
```

By default it uses same-port forwarding from `install.env`:

```text
127.0.0.1:80 -> REMOTE_HOST:80
```

Re-running the script replaces an existing forward on the same local host and port, so changing `REMOTE_HOST` in `install.env` updates the active tunnel.

Port `80` requires a privileged local bind, so the script re-runs through `sudo`.

Local DB Purge
--------------

Purge the local MyScoutee DB state:

```bash
tools/install/purge-localhost-dbs.sh
```

Preview the local DB purge without deleting anything:

```bash
tools/install/purge-localhost-dbs.sh --dry-run
```

The script stops the local `server` Docker Compose project, removes local MongoDB
and MinIO data under `server/data/`, and clears Redis by removing the local
compose container state. Use `--mongo`, `--redis`, or `--minio` to limit the
purge to one backend. If you pass `--skip-compose --redis`, the script flushes
the running `redis` container instead.

If Docker created root-owned database files, the script retries data removal
with passwordless `sudo`, then with an already-local Docker helper image. Set
`LOCAL_PURGE_HELPER_IMAGE` to choose a specific helper image.
