Tools
=====

The `tools` folder contains source-checkout-only developer helpers. The helper
names describe their scope, so general-purpose development tools live directly
in this directory:

- `run-backend-junit.sh [local|standard|embedded|integration]` runs backend JUnit
  in separate build and project-cache directories, without signaling DevTools.
  `local` (default) includes standard and embedded tests, excluding integration
  and qualification tests. It can run alongside the existing backend server.
  Both environment packages live in `src/e2eTest/java/com/raxim/myscoutee`:
  `e2e` uses `@Tag("e2e")`, and `dev` uses `@Tag("dev")`. The existing `e2eTest`
  task defaults to E2E; `-Pe2eTestTag=dev` selects dev fixtures instead. Their
  explicit environment opt-ins still apply.

- `purge-local-datastores.sh` destructively resets local MongoDB, Redis, and
  MinIO state. Use `--dry-run` before destructive use.
- `seeds/` contains canonical static demo/E2E seed maintenance and generation
  tools; these do not connect to a running database.
- `release/` contains [historical QA artifact preparation](release/README.md):
  consistent prerelease versioning, retained-key signing and signature checks.
  It does not build images, upload releases or install packages.
- `smoke/` contains short-lived, replayable local smoke fixtures. They are
  separate from canonical seeds and from the versioned manual-QA checkpoints.
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
- `traffic/analyze-access-log.py` infers possible visitor journeys from existing
  nginx logs and stamped frontend assets, separating lazy loads from probable
  service-worker precache. It supports read-only Netcup input; see
  [usage and inference limits](traffic/README.md).

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
