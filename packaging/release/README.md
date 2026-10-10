# Release tools

These helpers operate on a MyScoutee source checkout to build, inspect, and
sign production release artifacts:

- `build-production.sh` builds frontend/backend artifacts and production images;
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
  the `myscoutee-update.json` GitHub release asset.

They are deliberately outside `packaging/scripts`. Everything under
`packaging/scripts` is runtime material copied into the Debian package, while
`packaging/release` is source-only and must never be installed by the package.

Destructive local datastore reset remains under `tools/` and is not a packaging
input.

## Current release

The current Debian package release is **1.3.0**, tagged `v1.3.0`. The
[1.3.1 frontend patch](../../guides/releases/v1.3.1.md) publishes only a compatible
nginx/frontend image; no DEB or automatic-update catalog is produced.
Package/image versions and
release qualification boundaries are recorded in
[the release notes](../../guides/releases/v1.3.0.md). Existing tags remain unchanged.

## Build a QA prerelease from current source

Use the normal builder with `MYSCOUTEE_VERSION=1.0.0-qa.1`. It builds the complete
current frontend/backend and managed images, then packages them. Application
markers, image tags and filenames use `1.0.0-qa.1`; the Debian control version
uses `1.0.0~qa.1` so it sorts before stable `1.0.0`. The final stable version
remains unchanged. Do not patch old application binaries to make this baseline.

Production nginx consumes `frontend/prod` through its named build context.
Release builds must not copy output into the dev-owned
`server/docker/conf/nginx/app/myscoutee` directory.

The source-only `guides/qa/tools/operator-update-config-fixture.py` provisions
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
python3 packaging/release/sign-update-manifest.py \
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
client installer** (`packaging/client-tools/install.sh`) to upgrade these hosts
with the seven-image 1.3.0 DEB; do not patch or replace the old worker separately.
Supply its normal `RELEASE_MANIFEST_PATH`, `RELEASE_PUBLIC_KEY_PATH` and independently
trusted fingerprint. The installer checks signatures before upload/installation
and runs the package qualification command afterward.

For in-app update catalogs targeting 1.3.0 or later, the signer requires a minimum
compatible version of at least `1.3.0-qa.1`, the first seven-image worker. Set the
actual qualified source range, not a broader promise. Older releases/tags remain
unchanged. Real upgrade/interruption/rollback qualification is still required.
