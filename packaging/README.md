# MyScoutee Packaging

This folder is the root-level packaging workspace for production deploys. It is separate from the dev Docker setup so dev hot reload, workspace mounts, playground mode, and demo helpers can keep their current behavior.

## Current Scope

The current packaging path builds and runs the production Docker stack from the existing repo layout:

- nginx production image with baked frontend assets
- backend production image with the jar under `/app`
- MongoDB
- Redis
- MinIO

It intentionally does not add Java, Mongo, or Redis memory caps. Optional small/medium/large presets can be added later as explicit production profiles.

## Scripts

Run from the repo root:

```bash
bash packaging/scripts/build-production.sh
bash packaging/scripts/start-production.sh
bash packaging/scripts/status-production.sh
bash packaging/scripts/stop-production.sh
bash packaging/scripts/backup-production.sh
bash packaging/scripts/package-production.sh
```

Useful overrides:

```bash
MYSCOUTEE_VERSION=1.0.0 bash packaging/scripts/build-production.sh
BUILD_FRONTEND=false bash packaging/scripts/build-production.sh
BUILD_BACKEND=false bash packaging/scripts/build-production.sh
BUILD_IMAGES=false bash packaging/scripts/build-production.sh
BUILD_ARTIFACTS=false PACKAGE_IMAGES=false bash packaging/scripts/package-production.sh
```

`package-production.sh` creates `packaging/dist/myscoutee_<version>_amd64.deb`. By default it builds production artifacts and packages the MyScoutee nginx/API images. Set `PACKAGE_OFFICIAL_IMAGES=true` to also include MongoDB, Redis, and MinIO image archives for a larger, more offline-friendly bundle.

`restore-production.sh` is intentionally guarded:

```bash
CONFIRM_RESTORE=true bash packaging/scripts/restore-production.sh /path/to/myscoutee-backup.tar.gz
```

Set `RESTORE_MINIO=true` to restore MinIO files and `RESTORE_CONFIG=true` to restore `.env` files.

## Image Naming

Production:

```text
myscoutee-nginx:1.0.0
myscoutee-api:1.0.0
```

Development:

```text
myscoutee-nginx:1.0.0-dev
myscoutee-api:1.0.0-dev
```

Shared nginx base:

```text
myscoutee-nginx:1.0.0-base
```

## Future Debian Package

The Debian package installs a prepared bundle under `/opt/myscoutee`, with configuration under `/etc/myscoutee` and persistent data linked through `/var/lib/myscoutee`.

The package should avoid aggressive system upgrades. Server convenience tools should be installed only when missing, and only in the smallest useful set.

Target helper tools:

- curl
- jq
- gnupg
- ufw
- ncdu
- iotop
- redis-tools
- mongosh

The systemd unit is in `packaging/systemd/myscoutee.service`.
