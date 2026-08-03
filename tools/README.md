Tools
=====

The `tools` folder contains source-checkout-only developer helpers. The helper
names describe their scope, so general-purpose tools live directly in this
directory:

- `build-debian-release.sh` builds the production Debian package and the
  separately downloadable client-tools bundle.
- `sign-release-artifacts.sh` validates and signs a matching canonical Debian
  package and client-tools archive with an explicitly supplied, pre-existing
  Ed25519 PKCS#8 release key. It atomically writes
  `myscoutee-release_<version>.json`; it never creates or stores a private key.
- `rebuild-production-services.sh` builds production frontend/backend artifacts
  and project-owned images, then recreates the affected Compose services.
- `purge-local-datastores.sh` destructively resets local MongoDB, Redis, and
  MinIO state. Use `--dry-run` before destructive use.
- `backfill-user-rate-seed-distances.mjs` updates the demo and E2E user-rate
  seed distances.
- `generate-help-center-seeded-images.mjs` regenerates seeded help-center image
  assets.
- `validate-trust-library.sh` validates the repository-local agent trust
  protocol, its required files, Markdown links, and canonical code references.
- `work-day/list-login-sessions-for-day.sh YYYY-MM-DD` lists completed Linux
  login sessions for one day.
- `work-day/work-hours-summary.sh` calculates daily, weekly, monthly, and
  four-month totals from the same login history, including zero-hour days.

Release-packaged client tools live with the Debian packaging source:

```text
packaging/client-tools/README.md
```
