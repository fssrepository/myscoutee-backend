Tools
=====

The `tools` folder contains source-checkout-only developer helpers. The helper
names describe their scope, so general-purpose development tools live directly
in this directory:

- `purge-local-datastores.sh` destructively resets local MongoDB, Redis, and
  MinIO state. Use `--dry-run` before destructive use.
- `seeds/` contains canonical static demo/E2E seed maintenance and generation
  tools; these do not connect to a running database.
- `trust/validate-trust-library.sh` validates the repository-local agent trust
  protocol, its required files, Markdown links, and canonical code references.
- `trust/trust-mode.sh status|off|light|standard|deep|default` selects a gitignored
  local trust-loading mode; `default` removes the override and restores
  `standard`.
- `trust/run-trust-evals.mjs` validates or runs the read-only model regression
  suite in `tools/trust/suite`; live runs require an explicit model and write only to
  `.e2e-artifacts/trust-evals/`.
- `work-day/list-login-sessions-for-day.sh YYYY-MM-DD` lists completed Linux
  login sessions for one day.
- `work-day/work-hours-summary.sh` calculates daily, weekly, monthly, and
  four-month totals from the same login history, including zero-hour days.

Release-packaged client tools live with the Debian packaging source:

```text
packaging/client-tools/README.md
```

Debian release building, artifact signing, and their tests live with the
packaging owner. `packaging/release` is not copied into the Debian package:

```text
packaging/release/build-debian-release.sh
packaging/release/sign-release-artifacts.sh
packaging/tests/release-signing-test.sh
```

`packaging/release/rebuild-production-services.sh` rebuilds production
artifacts and project-owned images from the checkout, then optionally recreates
the affected Compose services. Like the other release tools, it is outside the
Debian payload.
