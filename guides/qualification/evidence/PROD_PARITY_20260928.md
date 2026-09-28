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

### Block1.2 — full filter catalog repair and sampled production verification

- Deployed production UI `313df4a1d342-20260928054954` and rebuilt API on VMware;
  all ten containers healthy. Installed DEB remains1.0.0, final upgrade pending.
  Migration009 was applied earlier: production unchanged;49 missing demo profile
  details initialized, one existing row retained.
- Filters now reuse profile-editor option menus, including labels/icons/palettes,
  and adapt single selections to uncapped multiple selections. Interests/values
  retain editor groups; languages use two alphabetic tabs. Search remains only
  for these long lists. Horoscope metadata is shared with the date input; all12
  signs are available. Main trait uses all8 impression catalog entries.
- Empty results no longer empty the choices. Existing custom selections remain
  removable; matching ignores letter case. Stored gender and existing impression
  aliases are handled through the shared data/resolver in local and HTTP paths.
- Focused verification:27 frontend tests PASS;21 Java game service tests PASS.
  Production frontend build and API bootJar/image build PASS.
- Actual Android HU sample:12 horoscope choices,8 translated/color-coded traits,
  grouped language tabs and all three Children choices. Children has no search
  box and retains profile-editor blue/green/orange colors. Saving No returned
  HTTP200 and excluded the Yes comparison profile (zero visible cards).
- User requested sampled filter checks to conserve quota. No exhaustive UI
  sweep is claimed. User currently inspects the phone; wait for handback before
  restoring the test filter and Children control and continuing1.3.

- Follow-up requested by user: filter popup now reuses the profile editor's
  FormFlow loading surface and shared after-paint scheduler before rendering
  its fields. Menu models are cached by each selected-value array, avoiding
  rebuilding every option on unrelated change detection; canceled popups cancel
  pending preparation. Production build055516 deployed; ten containers healthy.
  Phone observation of this final loading change awaits user handback/reload.

### Block1.3 — existing Firebase login and consent defect

- Android Children sample completed: No excludes the Yes control; Yes returns
  exactly that profile. Test Children filter cleared through normal UI and
  saved HTTP200. Versioned `restore-children-control` restored the exact original
  empty/Private row. The independent location snapshot remains retained.
- User completed raxim.uk login at06:01UTC and confirmed entry. Eligibility200,
  Firebase login200 and profile-ext200 carrying the pending point were observed;
  no location X-header. Mongo verifies the same existing canonical profile ID
  with saved coordinates/public status/form version2; no registration replay.
- Reported unexpected privacy popup: initial consent GET used Firebase UID,
  returned empty; anonymous-consent POST403. Hydration then resolved the canonical
  profile ID and its existing consent200, but the already opened forced popup
  remained without approval buttons. Source now gates consent on the hydrated
  profile and dismisses only a stale required privacy popup, preserving voluntary
  document reading. Four focused regression tests PASS; production build06450
  (full ID313df4a1d342-20260928060450) built, not activated on VMware.
- Separate EN/HU entry prompts were caused by the language probe: revision IDs
  differ by language and anonymous storage retains one revision. Acceptance
  records were not reset. Browser language override is restored. Full EN Children
  editor/view variants were not completed; no PASS is claimed for that boundary.
- User explicitly requested no separate manual consent retest and deferred
  deployment of fixes. Spinner rotation now starts at twelve o'clock in source,
  also pending activation. Active VMware UI remains055516. The image archive
  transfer had already completed when deployment was deferred; no docker load
  or container recreation was performed for06450.
- Normal logout completed; user prompted for the existing account's saved-point
  sign-in to finish1.3. Remaining1.4/1.5 and blocks2–5 are not yet executed.

- Saved-point login reached Setup while native geolocation was granted and
  notification permission remained default. The current gate can open Setup for
  pending notification permission. The user explicitly chose to leave the
  landing/Setup behavior unchanged after discussion; no location/landing code
  was edited. The phone is currently signed out at entry; saved-point Firebase
  sign-in remains pending. Do not label this branch PASS before completion.


### Firebase completion evidence and revised execution order

- User confirmed the saved-point raxim.uk sign-in at06:12UTC. Normal login,
  account read and profile-ext returned200; the existing identity reached/game
  with no registration. Setup behavior was retained by explicit user decision.
- Location retry runtime06:15–06:16UTC: normal application reloads retained the
  pending point after a transport failure, retried it successfully, and cleared
  only its account's acknowledged sample. A held older200 response did not clear
  a newer staged sample. The other real identity's pending sample was neither
  sent nor consumed. This was namespace isolation with the current real session,
  not a fresh provider account-switch test. Browser fixtures were exactly
  restored; independent Mongo read matched the sent point, then the versioned
  location control restored the original database coordinates.
- User requested no replay of completed checks. Firebase remains block1 with
  existing evidence and limitations; do not rerun registration/login/retry.
  Block2 now holds remaining machine checks, block3 interactive desktop OAuth,
  block4 final physical Android installation/permission checks. iOS was removed
  from the active checklist by explicit user request; no iOS PASS is claimed.
  Former1.5 is now2.2, former help3 is2.1, reporting4.1 is2.4.

### Authorized pending-artifact deployment and machine help checks

- User authorized deployment of queued fixes. Loaded and activated production
  nginx build313df4a1d342-20260928060450; HTTPS/app-version.json verifies1.3.0
  and that exact build. Archive SHA256:
  3f8508e8b0e0c78f2dff8bc7eee65770b608355c96b15d13a69e63e1c41a3033.
  Prior image retained as myscoutee-nginx:qa-before-consent-055516.
  All ten containers healthy. Consent and spinner fixes are now deployed;
  separate manual consent retest remains waived.
- No backend update was missing: running and local production JAR hashes match:
  2e01b4df46ad1beb83f1e48b5afa3589bc3fa6b19d81e25a4b482d1e167dbff7.
  No DEB/tag/registry release or Netcup operation performed.
- Versioned deploy-help-initialization.sh exercised the installed Mongo importer
  on a uniquely named disposable database on VMware:36 documents imported,
  HU/EN activev3 exactly matched canonical seeds, no users; DB/users removed and
  cleanup verified. This proves fresh importer initialization, not a separately
  booted complete application deployment.
- Existing default-help-migration-test.py ran on VMware Mongo: HU/EN upgrade,
  fresh state, repeat/interrupted retry, custom/disabled preservation, version
  conflict and retained privacy/users PASS. Its disposable database was dropped.
- Configured HTTP/help/active returned200 with v3 for HU/EN. Full canonical
  payload comparison and MCP read are tracked separately; do not infer a full
  block2.1 PASS from importer/migration checks alone.


### Final ordering clarification and remaining machine results

The user's final clarification supersedes intermediate numbering above: machine1,
interactive OAuth2, one mobile3 block with Firebase3.1 retained, installed-app3.2
and Android3.3. Skip completed Firebase assertions when reaching mobile3.1.

- HU/EN HTTP active-help content fields and all17 sections match canonical seeds.
  Additional DTO presentation defaults (panelSpan, optional, imageUrls) are normal
  service projections, not seed content differences. Anonymous MCP resources/read
  returns the same v3/language/title and17 section IDs/titles/summaries with content.
- Versioned private invitation fixture used two existing Firebase identities as
  pending recipient and unrelated actor. Its owner was a fixture-only account.
  Existing real outsider session reused from workstation; no provider-login claim.
  Event detail404, members403, unpublish403, member removal403. Existing private
  chat/message controls then verified: chat/messages/member-page404, send403.
  Initial absent-chat responses were not used as proof of private-content denial.
  Scoped database snapshots remained identical; exact fixture cleanup verified.
  No visual deep-link navigation claim; direct resource requests were exercised.
- Configured OAuth well-known discovery200 exposes VMware8443 issuer, endpoints,
  S256 and matching private resource. Invalid remote HTTP redirect400, unsupported
  client auth400, implicit grant400, nonexistent client400, missing client401.
  No client/grant created by these negative probes. Valid grant/PKCE/replay/
  revocation cases remain for the official Inspector flow.
- Actual GitHub issue chooser redirects to sign-in. Local Bug/Feature/Question
  templates are concise; authenticated deployed chooser is not yet proven.
- Official Inspector2.8.0 started against https://localhost:8443/mcp/private with
  the local QA certificate scoped through NODE_EXTRA_CA_CERTS. Existing versioned
  browser launcher opened a separate anonymous desktop session; phone unchanged.
  Private runtime log and real-session request credentials stay under /tmp only.


### Desktop OAuth prerequisite correction

The initial desktop launcher inherited the global Austin geolocation fixture,
causing the user's observed unsupported-region Setup message. This was a QA
preparation error. Stopped only that managed browser's geolocation holder and
restarted the same versioned holder with the previously observed native phone
sample, without reloading or dropping the OAuth URL. Browser geolocation matched
the retained sample. The desktop checkpoint now explicitly disables inherited
geolocation emulation by default; future emulation must be scoped intentionally.
The flow reached normal Google sign-in; provider credentials remain user-owned.

Inspector's newly registered public client is retained in the deployment harness
via capture-oauth-client. Revoke its permission normally, then run
restore-oauth-client before final cleanup. The temporary workstation copy of
Firebase request credentials was deleted after the direct-request checks.


### OAuth2.1 — physical phone Inspector connection and private read

User required moving OAuth to the phone because desktop CDP provider login is
unreliable, then required all remaining browser checks on the phone in order.
Added only adb reverse6274→workstation6274 (existing mappings snapshotted), opened
the official Inspector UI on the phone and retained the normal Firebase session.
Removed the unused desktop DCR record via the scoped harness. Inspector initially
reused its cached old registration; cleared it through Settings → Clear stored
OAuth state and restarted normal Connect. The new phone client is captured by
the harness; no approval/grant was injected. Inspector reached Connected and
advertised the correct base-profile identity and private read tools.

Executed Inspector's advertised event read for an existing account-owned Event.
Normal tools/call returned its source ID, title, DR status and Casual mode in both
content and structured output. No Event was created or edited. This closes2.1's
configured-provider existing-session authorization/private-read boundary; it does
not claim a new provider sign-in on this attempt. Current phone client:
mcp_370eafab-15dc-43df-ae7f-a353a0e5f7d2. Permission token record:
aa4cd241-dc12-4c4f-9858-4e98100c1a47 (identifier only, not a credential).
Desktop managed browser closed; Inspector service retained.2.2 disconnect/
reconnect started; cancellation and grant-negative/revocation checks remain.


### OAuth2.2 and2.3 — ordered phone continuation

- Normal Inspector Disconnect/Connect returned Connected using its existing
  connection. Two further fresh authorization attempts used Inspector's own
  Clear OAuth state action. All three actual phone DCR clients are retained in
  the versioned deployment harness for exact cleanup.
- Cancelled the third client's normal MyScoutee consent with Mégse. Inspector
  displayed access_denied and Failed; independent Mongo counts were zero
  connections and zero grants for that client. Re-authenticate returned the
  correct existing base profile; normal approval returned Connected.
- Protocol probes used the third registered client and the real browser session
  against normal configured endpoints, after the actual Inspector UI flow.
  Wrong redirect/resource/client/plain PKCE400; valid context200 with correct
  profile; wrong verifier/resource400; valid exchange/private read200; reused
  code400; refresh rotation/read200; refresh replay400 and revoked access401,
  revoked refresh400. These API-generated code/grant prerequisites are recorded
  separately from the observed Inspector UI result.
- Expired-code case: one normally issued code had only its expiresAt moved into
  the past by the versioned expire-oauth-code fixture, guarded by the captured
  client IDs and exact code digest. Token exchange returned400. This is fixture
  time preparation, not a measured five-minute wall-clock expiry.
-2.3 prerequisites: created one day-long API key via the ordinary authenticated
  API, named DEPLOY-EXTERNAL-CONFIG-001 logout control; captured its ID in the
  harness. Before logout, API-key/OAuth private reads and browser auth/me all200.
  Normal phone menu Logout and confirmation completed, session storage cleared
  and entry displayed. Afterward OAuth/API-key reads remained200; the retained
  browser session returned401. Thus browser logout did not revoke either grant.
- User was asked to sign in again on the phone for normal revocation.2.3 explicit
  revocation and2.4 cleanup are pending. Do not reset the fixture or delete token
  records before normal revocation verification. API control ID:
  1170f5a5-fbc5-4df4-b107-a2ed267df1c2. All client/key ownership metadata remains
  in the deployment harness; credential material stays in private /tmp files.


### OAuth2 final revocation and cleanup — 2026-09-28

OAuth2.1–2.4 PASS/CLOSED: normal phone logout retained independent OAuth/API access200 and rejected old browser401; explicit ordinary endpoint revocations then rejected both credentials401. Three captured clients and one QA key exactly restored, zero remaining. Inspector stopped, owned tabs/callback6274 and private credentials removed; original8443 transport and real account/Event retained. Next: finish audit of1.1–1.4 before3, per user.
Revocation used normal authenticated phone-browser API requests; no visual revoke-button claim. Expired-code evidence retains the previously documented scoped fixture deadline boundary. Main checkpoint stays staged for remaining checks.


### Retained profile editor / loading feedback repair and no-replay boundary

User reported profile destruction below the image editor and frozen profile/filter
loading feedback. Profile image/experience editors now use the existing Popup
stack above the retained profile; closing the nested editor preserves its form
instance, unsaved draft and scroll position. Shared spinner rotation moved from
the filtered SVG to a compositor-hinted HTML layer, retaining the twelve-o’clock
start. No new loader or data flow.

Focused Angular profile suite:5/5 PASS, including real parent-template retention
and logout/account isolation; existing FormFlow/filter suites:23/23 PASS in the
same repair run. Initial broad test TypeScript scope encountered unrelated existing
spec errors; narrowed tsconfig used. Spinner smoothness is not yet device-proven.
Patch is local only; VMware still serves06450. No phone popup was closed for this
repair and no deployment/init reset was run.

Latest user direction: preserve all existing results; do not restart QA or fresh
installation.1.1 importer/migration/HTTP/MCP evidence retained with its previously
recorded standalone-deployment boundary;1.2 and1.3 have completed evidence.1.4
authenticated actual GitHub chooser remains unverified. Overall QA remains open.


### Block1.4 actual GitHub forms — complete

1.4 PASS: authenticated actual GitHub chooser and all three Bug/Feature/Question forms opened on physical Android; concise fields match versioned templates. No issue submitted. See DEPLOY_GITHUB_20260928.json. Blocks1.2/1.3 and2 remain complete;1.1 retains verified importer/migration/HTTP/MCP scope and documented standalone-deployment limitation, with no restart per user.


Checklist duplication corrected:1.3 owns discovery/configuration only;2.1 owns connection/public-client registration;2.2 owns session/cancellation/reconnect and protocol negatives;2.3 owns logout independence/explicit revocation;2.4 owns cleanup. Existing evidence retained; this documentation repair authorizes no replay.


### Profile retention/spinner production activation — 2026-09-28

Production frontend build5f8ec73f0d7f-20260928071508 built through build:prod and
the existing nginx production Dockerfile, transferred with matching SHA256
0b4e992159f490da05dd0bbd5c124f663e97f34901099c3f5afd2015f9b1bc0d.
Only VMware nginx recreated; all10 containers healthy. HTTPS app-version.json
confirms exact build/version1.3.0. Previous image retained as
myscoutee-nginx:qa-before-profile-loader-071508. Phone app reloaded only after
read-only inspection confirmed no open editor/dialog; session retained.

3.2 started on physical Android with normal Settings→Install→Setup Install.
Native Chrome Install app dialog showed MyScoutee/localhost:8443; normal Install
selected after package baseline captured. Installation completion/version
verification pending. No previous Firebase/registration test replay.


### Block3.2 completion and3.3 observed timing defect — 2026-09-28

The installed Android WebAPK (`org.chromium.webapk.aa6357a1183d07d82_v2`)
opened standalone at the same localhost8443 origin. Settings retained runtime
version1.3.0 at the right; the actual Install action was absent. The Settings
entry remains available because it also opens permissions. No side-menu repair
was required. This completes3.2; retain the pre-install package snapshot for
scoped cleanup.

On3.3, revoking Chrome OS location permission and granting it again during Update
produced an error while the visible ring still had time remaining. The earlier
speculative retry was reverted by the user and was never deployed. Read-only
CDP breakpoints on the deployed native callbacks then captured:

-07:38:29 UTC: Android location provider started after native grant.
-07:38:35.658 UTC: actual GeolocationPositionError, code3, `Timeout expired`.
-A second measured user attempt: native request07:41:37.957, native grant
07:41:41.723, ring first observed07:41:42.443 (83ms into a10000ms animation),
native coordinate success07:41:47.013. No coordinates were logged.

These observations establish different starts for the native timeout and visible
acquisition ring in this Android OS permission recovery path. The fix retains
one acquisition deadline from the existing permission-granted handler. Only an
early native TIMEOUT after that grant may consume the remaining part of that
same deadline, once; denial, position-unavailable, expired budgets and closed
Setup do not trigger it. Already-granted requests retain their normal limit.
Focused Setup/location tests:36/36 PASS. An initial test invocation omitted
runner include filters and failed on unrelated files outside the narrowed
TypeScript scope; the corrected focused invocation passed. Runtime acceptance
of the repair and3.3 cleanup remain pending; successful second clicks on the old
build do not close this defect. Raw temporary diagnosis logs contain no GPS data.
