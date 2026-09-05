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
  approved, pre-existing private key.

They are deliberately outside `packaging/scripts`. Everything under
`packaging/scripts` is runtime material copied into the Debian package, while
`packaging/release` is source-only and must never be installed by the package.

Destructive local datastore reset remains under `tools/` and is not a packaging
input.
