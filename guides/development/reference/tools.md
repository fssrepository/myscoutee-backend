Tools
=====

Shared development mechanisms live in their owning sibling projects. Run the
commands below from the application root:

- `../myscoutee-microservices/tools/run-backend-junit.sh [local|standard|embedded|integration]` runs backend JUnit
  in separate build and project-cache directories, without signaling DevTools.
  `local` (default) includes standard and embedded tests, excluding integration
  and qualification tests. It can run alongside the existing backend server.
  Both environment packages live in `src/e2eTest/java/com/raxim/myscoutee`:
  `e2e` uses `@Tag("e2e")`, and `dev` uses `@Tag("dev")`. The existing `e2eTest`
  task defaults to E2E; `-Pe2eTestTag=dev` selects dev fixtures instead. Their
  explicit environment opt-ins still apply.

- `npm --prefix config/packaging run development -- purge-local-datastores` destructively resets local MongoDB, Redis, and
  MinIO state. Use `--dry-run` before destructive use.
- `npm --prefix config/packaging run NAME --` runs canonical static demo/E2E
  seed maintenance. Project inputs and the four product-specific implementations
  live under `config/packaging/seeds/data/` and `seeds/scripts/`, respectively;
  these commands do not connect to a running database.
- Historical QA release tooling lives in `../myscoutee-packaging/release/qa/`;
  invoke it through `npm --prefix config/packaging run qa-release -- TOOL`.
  See [the application release instructions](qa-releases.md).
- Runtime/resource qualification lives in `../myscoutee-packaging/verification/qualification/`;
  project selection is JSON under `config/packaging/qualification.json`.
- Product microservices scenarios live under `tests/e2e/microservices/`; shared
  runtime and infrastructure tests live in `../myscoutee-microservices`.
- Deployment smoke prerequisites are application fixtures under
  `tests/qa/categories/QA infrastructure/tools/deployment-smoke/`.
- `tests/smoke/` contains short-lived, replayable local smoke fixtures. They are
  separate from canonical seeds and from the versioned manual-QA checkpoints.
- `../myscoutee-skills/tools/trust/validate-trust-library.sh` validates the repository-local agent trust
  protocol, its required files, Markdown links, and canonical code references.
- `../myscoutee-skills/tools/trust/trust-mode.sh status|off|light|standard|deep|default` selects a gitignored
  local trust-loading mode; `default` removes the override and restores
  `standard`.
- `../myscoutee-skills/tools/trust/run-trust-evals.mjs` validates or runs the read-only model regression
  suite in `../myscoutee-skills/tools/trust/suite`; live runs require an explicit model and write only to
  `.e2e-artifacts/trust-evals/`.
- `../myscoutee-skills/tools/work-day/list-login-sessions-for-day.sh YYYY-MM-DD` lists completed Linux
  login sessions for one day.
- `../myscoutee-skills/tools/work-day/work-hours-summary.sh` calculates daily, weekly, monthly, and
  four-month totals from the same login history, including zero-hour days.
- `../myscoutee-nginx/tools/traffic/analyze-access-log.py` infers possible visitor journeys from existing
  nginx logs and stamped frontend assets, separating lazy loads from probable
  service-worker precache. It supports read-only Netcup input; see
  [usage and inference limits](../../../../myscoutee-nginx/tools/traffic/README.md).

Release-packaged client tools live with the Debian packaging source:

```text
../myscoutee-packaging/client-tools/README.md
```

Debian release building, artifact signing, and their tests live with the
packaging owner. Release tools in the packaging dependency are not copied into the Debian package:

```text
npm --prefix config/packaging run release -- build-debian-release
../myscoutee-packaging/release/signing/sign-release-artifacts.sh
../myscoutee-packaging/tests/integration/release-signing-test.sh
```

`npm --prefix config/packaging run release -- rebuild-production-services` rebuilds production
artifacts and project-owned images from the checkout, then optionally recreates
the affected Compose services. Like the other release tools, it is outside the
Debian payload.
