# Release tools

These helpers operate on a MyScoutee source checkout to build, inspect, and
sign production release artifacts:

- `build-production.sh` builds frontend and backend artifacts and production images;
- `build-debian-release.sh` builds the Debian package and Operator bundle and
  writes a separate `.sha256` checksum file beside each artifact;
- `package-production.sh` stages and creates those release archives;
- `audit-package-credentials.sh` and its Python helpers reject credentials and
  private key material from staged package content;
- `qualify-release-artifacts.sh` performs read-only candidate checks;
- `rebuild-production-services.sh` rebuilds project-owned production images and
  optionally reloads their Compose services;
- `sign-release-artifacts.sh` validates and signs release artifacts with an
  approved, pre-existing private key;
- `sign-update-manifest.py` signs the complete standalone update manifest for
  the `myscoutee-update.json` GitHub release asset. Its explicitly selected
  `config/packaging/release/update-compatibility-policy.json` owns product-specific installed-worker
  requirements; missing or malformed policy stops signing. The MyScoutee policy
  retains the existing 1.3.0 seven-image restriction unchanged.

The locked dependency owns the release tools. Runtime tools are selected by
`config/packaging/runtime-inputs.json` and assembled without source proxies into
`build/scripts` for checkout use and the existing `packaging/scripts` path inside
the Debian package. Project configuration remains under `config/packaging`.

Destructive local datastore reset remains under `tools/` and is not a packaging
input.

## Current release

The current source/container release is **1.5.0**; see [notes](v1.5.0.md).
The managed images, frontend Pages build and corrected signed Debian package are
published. The owner's uploaded DEB, matching metadata, signatures and canonical
Java update discovery are verified. Netcup runs that exact 1.5.0 package, including
the corrected shared deployment verifier; host qualification and all 13 public
checks pass. Template VMware testing is separate.

The earlier validated Debian release is **1.4.1**. Its
[release](v1.4.1.md) includes the signed DEB and published
Docker images; the owner’s uploaded hash and canonical discovery are verified. The
[1.4.3 frontend patch](v1.4.3.md) publishes only a compatible
nginx/frontend image; no DEB or automatic-update catalog is produced.
Package/image versions and
release qualification boundaries are recorded in
[the release notes](v1.3.0.md). Historical published release
tags remain unchanged; the coordinated `v1.4.1` source tag identifies this candidate.

## Build a QA prerelease from current source

Use the normal builder with `MYSCOUTEE_VERSION=1.0.0-qa.1`. It builds the complete
current frontend and backend artifacts and managed images, then packages them. Application
markers, image tags and filenames use `1.0.0-qa.1`; the Debian control version
uses `1.0.0~qa.1` so it sorts before stable `1.0.0`. The final stable version
remains unchanged. Do not patch old application binaries to make this baseline.

Production nginx consumes `myscoutee-frontend/prod` through its named build context.
Release builds must not copy output into the dev-owned
`server/docker/conf/nginx/app/myscoutee` directory.

The source-only `tests/qa/categories/Operator/tools/operator-update-config-fixture.py` provisions
the designated QA guest's normal update settings and independently pinned public
key. Its `stage`, `status` and `reset` actions retain only those configuration
inputs; restart the existing deployment after stage/reset. It never writes
installed versions or successful update results.

## Standalone update discovery

Operator Updates reads `fssrepository/myscoutee` GitHub releases through Java,
without a Registry connection. The repository and inclusion of prereleases are
configured by `MYSCOUTEE_UPDATE_GITHUB_REPOSITORY` and
`MYSCOUTEE_UPDATE_INCLUDE_PRERELEASES` (default false).

Publish `myscoutee-update.json` alongside the Debian asset. A DEB upload is not
complete until its separately signed catalog is present and the canonical Java
release discovery verifies it from GitHub. Signing `myscoutee-release_<version>.json`
alone does not produce this catalog. If the owner uploads the DEB later, retain
this check as an explicit open release step; do not close it after checksum or
client-installer verification alone. Prepare the existing
`update_manifest` JSON fields with the real package version, channel, HTTPS asset
URL, byte size, SHA-256, package signing key ID and package signature from
`sign-release-artifacts.sh`; declare the actual minimum/maximum compatible
versions and set `backup_required: false`. Update and package rollback preserve
production data in place; they do not copy or restore production datasets.
List static seed/media changes and any data migration in the release gate
before signing; qualify the actual candidate on the preproduction VMware host. The package version must be newer than the
installed package. GitHub tag names do not substitute for package versions.

```sh
python3 ../myscoutee-packaging/release/signing/sign-update-manifest.py \
  --compatibility-policy config/packaging/release/update-compatibility-policy.json \
  --private-key /secure/release-private-key.pem \
  --manifest /path/to/update-manifest.json \
  --output /path/to/myscoutee-update.json
```

The envelope contains `schemaVersion: 1`, `manifestBase64` (exact UTF-8 JSON
bytes) and `signature` (padded base64 Ed25519). The signed message is the ASCII
prefix `myscoutee-update-catalog-v1` followed by a newline and those exact bytes.
Java verifies the full metadata and the existing package signature with the
locally pinned release key. Apply reloads and revalidates the release before
allocating a job. The root worker still independently verifies the actual DEB.
Missing metadata, an invalid signature or an absent trusted key disables Apply;
these conditions must not be reported as an up-to-date deployment.

### Configurable release source

`MYSCOUTEE_UPDATE_RELEASE_API_ORIGIN` defaults to `https://api.github.com`;
`MYSCOUTEE_UPDATE_RELEASE_DOWNLOAD_ORIGIN` defaults to `https://github.com`.
A configured mirror must expose the same repository release-list and asset-path
format. Only HTTPS origins without paths or credentials are accepted. Metadata
redirects are restricted to those origins (plus GitHub's asset CDN for the default
GitHub source). An optional `MYSCOUTEE_UPDATE_TLS_CA_CERTIFICATE` points to a
readable public CA bundle for these update clients; hostname verification and
release signatures remain mandatory. Leave it empty for system TLS trust.

The signed client installer records only the installed package version/hash
following successful host qualification. The privileged worker retains that
identity as the next update's recovery point. Explicit UI rollback resolves and
verifies the previous release again, downloads it normally, and requires the
exact retained artifact hash. It does not restore database or media data. An
installation without a retained package identity cannot advertise a proven
rollback target.

### Seven-image transition (1.3.0)

Installed pre-1.3.0 workers require exactly six images. Use the **existing signed
client installer** (`npm --prefix config/packaging run client -- install`) to upgrade these hosts
with the seven-image 1.3.0 DEB; do not patch or replace the old worker separately.
Supply its normal `RELEASE_MANIFEST_PATH`, `RELEASE_PUBLIC_KEY_PATH` and independently
trusted fingerprint. The installer checks signatures before upload/installation
and runs the package qualification command afterward.

For in-app update catalogs targeting 1.3.0 or later, the signer requires a minimum
compatible version of at least `1.3.0-qa.1`, the first seven-image worker. Set the
actual qualified source range, not a broader promise. Older releases/tags remain
unchanged. Real upgrade/interruption/rollback qualification is still required.


## Owned WebP media and migration023

The current release converts the eight Work/Community illustrations and the
random-room image to WebP. Standalone npm/local and GitHub builds contain the
article illustrations. HTTP builds use their MinIO variants through the article
records; offline HTTP clients retain the existing backend-cache behavior.
Compatibility icons remain PNG/ICO. User upload handling and stored originals
are unchanged.

The normal Debian package carries migration023, its pinned replacement manifest,
and the 25 verified MinIO source objects. The startup migration runner waits for
MinIO, prepares/verifies replacement bytes and MIME types, runs Mongo migrations,
and retires the exact old room PNG only when its checksum matches. Custom data at
an owned key stops preparation rather than being overwritten. Historical
migration files and pinned catalogs remain immutable.

Upgrades run every missing numbered migration in order, using the same runner
for package startup and partial releases. Applied steps and their pinned inputs
are checked against recorded SHA-256 values and skipped. Intermediate package
versions do not need separate installation. The current runner accepts source
schema versions 3–5; this is a forward-upgrade contract, not arbitrary downgrade
support. Before the later Netcup rollout, inspect its actual installed package,
schema and migration receipts. Its starting version has not been established by
the VMware qualification.

For a compatible container-only update, use the existing partial service updater
and data helper; do not replace files in a running container. Build the API,
nginx and MinIO images from the same source and retain their exact approved
identities. This data bundle does not build or publish those images.

1. On the source host, stage the data payload into a **new** directory:

   ```bash
   npm --prefix config/packaging run release -- package-partial-release-data /tmp/msc126-release-data
   ```

   It includes the complete selected production/demo catalogs, numbered/pinned
   migrations, runtime data scripts, replacement WebPs and `SHA256SUMS`. It
   excludes deployment credentials and user-upload data. Transfer this directory
   through the existing trusted Operator transport to the selected Netcup or
   VMware deployment.
2. On the deployment host, verify `sha256sum -c SHA256SUMS` from the extracted
   directory and create/verify a complete backup using the installed
   `backup-production.sh`. The data helper's `previous-package-data.tar` protects
   package inputs only and is not a Mongo/MinIO backup.
3. Stop `profilemanagement` through the installed `myscoutee-compose.sh` helper.
   Install the matching MinIO image through the existing persistent
   `install-temporary-image.sh` service updater. Then, as root, run:

   ```bash
   bash ./apply-partial-release-data.sh "$PWD"
   ```

   Both databases must complete before the PNG is retired. The helper persists
   the updated migration scripts, seeds and replacement media inputs for later
   restarts. It refuses this media upgrade while the API container is running,
   preventing an older scheduler from recreating PNG references after migration.
4. Install the matching API image and then nginx image with the same existing
   persistent updater. For the API intentionally stopped in step3, explicitly
   pass `MYSCOUTEE_TEMP_IMAGE_STOPPED_API=true` through `sudo env` when invoking
   `install-temporary-image.sh`. This accepts only an exited API with exit code
   0/143 and no OOM; other unhealthy services remain rejected. Do not restart the
   old scheduler between migration and image replacement. Check service health,
   migration023 receipts in both
   databases and the served article/room WebP responses. A failed update uses the
   matching prior images and the verified full backup for restoration; an image
   rollback alone does not reverse database/media changes.

This source-built route completed on local VMware on October21: both databases
have migration023 receipts, all 25 served WebPs match the pinned hashes/MIME,
and all nine containers are healthy. The partial updater preserves completed
history from a strictly older DEB while taking the current image as its rollback
baseline. Its 24 focused tests and reproducible client-tools packaging pass.
At that checkpoint Netcup remained unchanged. The October25 rollout is ordered
after the owner replaces the 1.5.0 DEB and its public metadata is verified.

## Release configuration

`config/packaging/release/settings.json` overrides the common packaging dependency's
`release/lib/defaults.json`; environment overrides retain their existing precedence.
Runtime script selection is in `config/packaging/release/runtime-scripts.json`.
Product seed audit predicates and their selection are under the same configuration
directory. Image identity stays in `config/packaging/release-project.json`.
