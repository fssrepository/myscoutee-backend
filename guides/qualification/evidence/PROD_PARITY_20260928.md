# Production parity and VMware runtime preparation — 2026-09-28

Scope: prepare the local VMware installation for the independently delegated
`DEPLOY-EXTERNAL-CONFIG-001` phone campaign. Final DEB qualification and Netcup
deployment remain pending. This record does not award a checklist PASS.

## Verified runtime

- Full production builder completed: frontend `build:prod`, backend `bootJar`,
  nginx base and all six owned runtime images, including MCP.
- VMware runs the `1.3.0-prod` images with the production Spring profile.
  All eight managed containers reached healthy. Installed DEB remains `1.0.0`
  during the user-authorized direct runtime patch.
- All 420 production frontend files match the running nginx files by SHA-256.
  Only nginx's stock `50x.html` is additional. App metadata is `1.3.0`, frontend
  commit `0f723f2d23a0`, build `0f723f2d23a0-20260928035258`.
- Running API JAR matches `profile-1.3.0.jar`:
  `92d9e838cab2cef2f8a555d9e06ae91628ee48d2c0987961bdb3771a42996baa`.
  All four source resource files match the archive; DevTools is absent.
- All 42 source seed baselines pass classification/parity. All 20 packaged
  production seed collections have their expected documents in the running DB.
  Mutable deployment settings, telemetry, job execution history and extra runtime
  exchange-rate/scheduled-task records are retained, rather than overwritten.
- EN and HU API bundles each contain all 4,033 current source messages with
  identical values and bundle versions. Missing/extra/changed keys: zero.
- Common help v3 responds in EN and HU. Its initial arrival on this VM used
  an explicit seed import; that alone did not prove the DEB update path.
- Source production Compose and packaged Compose now carry the same application
  configuration keys, except the intentionally empty `MEMBER_USER` override;
  production Spring already defaults it to empty. Dev-only build/debug controls,
  demo identity fallback, private HTTP webhook permissions, simulator test values
  and accelerated timing are intentional differences.

Structured comparisons: [prod-parity-20260928.json](prod-parity-20260928.json).

## Defects found and repaired

1. Packaged Compose omitted `AUTH_MAX_ACTIVE_SESSIONS`, although its installed
   env template exposed it. The configured limit now reaches the backend.
2. Packaged Compose omitted the existing `INTEGRATION_PUBLIC_BASE_URL` override.
   It now passes the override and otherwise derives HTTPS from `DOMAIN`.
   Real Compose rendering verified defaults and explicit overrides.
3. Retained databases did not receive new common-help revisions during package
   migration. New migration008 publishes unchanged packaged defaults in EN/HU;
   custom or disabled help remains selected as before. A custom version3
   collision is retained and reported for explicit import. Privacy/Terms and
   user records are untouched. Actual Mongo tests cover fresh/retained data,
   custom/disabled/conflicting versions, retry and interrupted insertion.
4. The migration-chain test had a stale hard-coded receipt count. It now checks
   every current migration. Schema3/4/5, checksum rejection and failure/retry pass.

Nginx transport policy and production QA/build-context isolation checks passed.
The source changes above concern packaging/configuration; no second Java or
frontend compilation was required.

## Preserved state and artifact identity

- Complete verified pre-patch backup on VM:
  `/var/backups/myscoutee/myscoutee-backup-20260928-035754.tar.gz`.
- Original runtime files retained at
  `/var/lib/myscoutee/qa-fixtures/release-1.3.0/before-runtime-files.tar`.
- Image archive SHA-256:
  `2e5b285bac2e692f06b9fcd5383517817a65d0dc5b4b5b4469c24793b4fccd33`.
  All six runtime image content fingerprints matched after transfer/load.
- Before/after retained-data fingerprints are in that VM fixture directory.
  Initial runtime patch preserved all 983 media objects and user/activity data;
  changed system rows were translations, help, migration receipt and runtime
  telemetry/job state. New MCP authorization collection was empty.

## Remaining execution

The VM's Operator-managed Firebase revision is active with encrypted provider
credentials. `FIREBASE_ENABLED=false` and the legacy placeholder file do **not**
disable that active configuration; runtime availability includes the Operator
configuration. No credential was copied or replaced during this audit.

The phone is Android14. It reaches the host over USB tethering; direct VMware
subnet reachability was not established. Local phone transport, the independent
fixture/actors and real provider login still need preparation. The VM reached
Google HTTPS; public inbound reachability is separate. OAuth currently advertises
`https://localhost`, matching the local installation configuration.

After configured phone/Inspector QA, build the final DEB and perform the requested
additional VMware upgrade. Do not infer that a patched runtime proves packaging.
Release tags/publication and the later user-requested Netcup upgrade follow their
recorded release gates. No release/tag/Netcup action has occurred here.
