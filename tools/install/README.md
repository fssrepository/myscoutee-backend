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

Remote Install
--------------

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
8. check for MyScoutee Docker containers stuck in `Restarting`

The script is fail-safe by default. If install, start, smoke test, or restart-loop detection fails, the remote script prints `systemctl`, Docker, compose, and journal diagnostics to the terminal, then stops `myscoutee`. Set `STOP_ON_FAILURE=false` only when you explicitly want to leave the failed service running for manual inspection.

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
