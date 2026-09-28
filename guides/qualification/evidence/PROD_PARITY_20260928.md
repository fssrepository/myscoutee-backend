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
subnet reachability was not established. The independent fixture is staged and its `firebase-entry` snapshot captured.
The unused email provider actor `no` was removed after the user selected normal
Google accounts; provider absence and local secret removal were verified. The VM reached
Google HTTPS; public inbound reachability is separate. A temporary QA Compose overlay advertises
`https://localhost:8443` for OAuth and allows that WebSocket origin. Restore the
standard Compose runtime before final package qualification; the installed env
file and Operator provider configuration were not changed.

After configured phone/Inspector QA, build the final DEB and perform the requested
additional VMware upgrade. Do not infer that a patched runtime proves packaging.
Release tags/publication and the later user-requested Netcup upgrade follow their
recorded release gates. No release/tag/Netcup action has occurred here.

## Android transport preparation

- Phone `https://localhost:8443` → USB `adb reverse` → host loopback8443
  → SSH local forwarding → VMware loopback443. The earlier temporary nginx
  transport container was stopped and removed.
- Direct VMware443 and the SSH-forwarded endpoint return identical TLS
  certificate SHA-256: `1ef56e502a758940d73c56e55dc4ee5ff672977c2315efa3c859526e1fb56e94`.
  The phone loaded the expected1.3.0 frontend through this route.
- Android rejected binding reverse port443; device8443 is retained.
- The user certificate store was inspected and empty; no certificate was
  installed. A copy of the public VM certificate remains in Downloads for
  cleanup. Certificate settings preparation was abandoned before any change.
- Chrome notification permission and display settings have private restore
  snapshots under `/tmp/myscoutee-deploy-qa-transport`. USB keep-awake was enabled;
  tethering and location settings were preserved.
- Versioned launcher opened the anonymous entry after a fresh fixture status
  check. Privacy consent was accepted through the UI and Login selected.
  This is progress evidence, not a registration or installed-app PASS.

## Block1.1 — Firebase entry order repair and registration in progress

The physical phone exposed a product defect: provider login opened before the
required Setup flow; after successful Google authentication, its overlay at
z-index2850 covered the Setup popup. This was observed through the actual
rendered hit-test stack. The SSH endpoint returned the same certificate as
direct VMware443, and the browser reported a secure context. No certificate
installation was used to repair this UI defect.

User-confirmed order: missing location → Setup → successful Update (popup stays
open) → Close → provider login. Close without accepted location only dismisses
Setup. Firebase with no application user opens registration. Demo uses its
existing selector/admission flow. The repaired Firebase branch reuses the same
Setup promise and binds an anonymous accepted point to the resulting account
before its profile read; optional notification opt-out does not open Setup again.

- Focused Angular tests:63/63 PASS across entry, Setup and location service;
  includes existing demo admission, cancellation/retry and account-scoped pending
  coordinate tests. The first unrestricted test compile was blocked by unrelated
  existing spec type errors; the existing focused tsconfig was reused.
- Actual production frontend rebuilt and nginx image transferred/recreated alone.
  VMware nginx healthy; phone and HTTP app-version report
  `0f723f2d23a0-20260928044638`. The earlier420-file audit describes the preceding
  artifact; the final release still needs its final artifact qualification.
- Previous incomplete Google session ended through normal Settings→Logout.
  Anonymous entry with browser geolocation `prompt` opened Setup alone; Update
  stayed disabled until Location selection. Android's precise location permission
  was granted with “Allow this time”. After successful Update, Setup stayed open;
  Close opened provider choices with no application session present.
- User selected their other Google account and reached Registration.
  The initial `registration-before.json` query omitted `firebaseUid`; its zero-row result does not establish absence of an application user. Do not use it as a fresh-record baseline.
  The account-scoped pending-login location exists in browser storage. The
  request trace started after the initial provider/profile request, so that
  first request's parameters are not claimed as captured evidence.
- User now controls registration; Codex observes network/Mongo/IndexedDB in
  parallel. Three repository test images were copied to Android Downloads as
  `MyScoutee-QA-1.png`, `MyScoutee-QA-2.png`, `MyScoutee-QA-3.png`. Remove these
  exact copies during device cleanup. No personal gallery images were selected.
- Entry network trace is private under
  `/tmp/myscoutee-deploy-qa-transport/entry-network.jsonl`; authorization headers
  and tokens are excluded. Keep this and the VM baseline until verification.

The following continuation supersedes the registration-in-progress pointer above.
No final DEB upgrade or release has occurred.


## Registration completed; block1.2 reload verification pending

- User completed registration; no registration replay is planned. The observed
  registration write and authoritative profile read returned HTTP200. Mongo
  records a public profile, form version2 and three images; the saved point
  matches the observed latitude/longitude request, with no location X-header.
  Pending browser coordinates cleared after the successful authoritative read.
  IndexedDB user tables were inspected separately and empty in this HTTP flow.
- Baseline limitation: the initial identity query was incomplete (see above).
  Completion of registration does not establish creation of a previously absent
  database record. Retain that distinction when closing individual assertions.
- Children translation defect was a second DOM translation of the correct HU
  label “Van” into the vehicle label “Furgon”. Existing translation-ignore
  markers now protect menu labels and profile detail values;20 focused menu
  tests passed. Canonical translation seeds were already correct.
- Production nginx build `0f723f2d23a0-20260928050359` was loaded/recreated on
  VMware; the SSH HTTPS endpoint returns this exact build ID. User may reload
  for block1.2; physical label/profile/filter verification remains pending.
- Former registration block4 is merged into block1. Current blocks4/5 cover
  reporting/installed version and Android recovery; block6 iOS is IGNORED.
  Blocks1–3 may run on desktop against this configured VM, with normal provider
  authentication; no dev-stack result substitutes for deployment evidence.
- Existing raxim.uk account location control is already staged through the
  versioned harness for1.3. Restore its exact saved point after that check.

### Block1.2 — user confirmation

The user confirmed on the phone that the Children label repair is correct
(“jó lett a gyerek”). Record the reported label defect as verified fixed.
This confirmation alone does not close the remaining HU/EN value variants,
saved profile-view semantics or Hungarian filter assertions.


### Block1.2 — profile-field persistence and filter defect

- Through normal phone UI, saved Children Yes and Prefer not to say, reopened
  the editor and independently read the exact Mongo values. Restored the
  registration account's original No/Private value. HU labels were Van and
  Nem szeretné megadni; initial No displayed Nincs.
- Versioned Children control snapshots only the existing comparison account's
  Children row, stages explicit values/Public visibility, and restores the exact
  original row. Its separate missing-location control remains retained for1.3.
  The harness initially reported a cross-realm object comparison mismatch even
  though the write succeeded; sorted-entry verification repaired this fixture
  assertion. The original snapshot was retained throughout.
- A public Yes control displayed Van in the profile view, while the game filter
  offered Nincs and retained that Yes profile after applying No. This exposed
  static frontend facet data and missing server profile-detail predicates.
- User requested removing the unnecessary search textbox specifically from the
  Children choice menu; existing filterable configuration now disables it there.
- User clarified all modes must read seeded repository data. Runtime static
  facet fallbacks are being removed; the existing local seed builder now stores
  the prior 50 demo users' values, and demo/e2e Mongo seeds are synchronized from
  that builder. Real profiles receive no fabricated defaults. Existing/cleared
  saved details are preserved during missing-field seed initialization.
-19 server game service tests passed, including14 saved-detail filtering cases.
  Demo migration009 test passed on disposable Mongo:47 missing rows initialized,
  empty/custom/renamed rows preserved, production unchanged, repeat exact.
  Seed synchronization check passes for both50-profile baselines;42 seed audit
  passes. Updated application artifacts are not yet deployed at this entry.
