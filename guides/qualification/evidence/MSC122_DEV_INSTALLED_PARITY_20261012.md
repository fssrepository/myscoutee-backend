# MSC-122 — DEV and installed runtime input comparison

Date: 2026-10-12. Scope: native MyScoutee and the minimal template. The reference
is the working development implementation and its classified environment inputs,
not merely the Debian builder's own file allow-list. No Netcup access is allowed.

## Current verdict: native installed input checks PASS; campaign IN PROGRESS

The corrected native 1.4.0 package was installed through the supported installer
on local VMware. The complete read-only database/index audit, retained-data
controls, historical migration chain and 13 external HTTP checks now pass.
Template installation and live E2E/KVM/monolith checks remain open. The user
explicitly waived the email-verification registration check on 2026-10-12; it is
SKIPPED by request, not a verified PASS. Its dependent new-account image journey
is not claimed by the demo checks. This is not a completed release or full-flow verdict.

### Corrected artifact replay

- Source: `15858a4cb`; package: `myscoutee_1.4.0_amd64.deb`.
- SHA-256: `0ad71a60dddb5c2c28dba63ad36d04c0affc484abb33235f5432ceaff434922e`.
- Complete actual DEB audit: 179 payload files and four control files match the
  verified stage, including bytes, mode and ownership. Existing image inputs
  also pass the complete payload comparison.
- All 49 demo and 23 production JSON inputs were checked after installation:
  no required seed IDs are missing. Both databases have all 199 canonical
  indexes with matching ordered keys and declared options, including collation.
  Runtime-owned and retained operator field differences remain classified.
- All 18 retained production collection counts and SHA-256 controls are
  unchanged across the same-version reinstall, including real users, consents,
  deployment settings, chats, activities, payments and integrations.
- All nine services are healthy. Mongo's actual soft/hard open-file limit is
  64000. Mongo and the application have zero restarts since this installation.
- Full historical migration-chain tests pass from schema3, schema4 and schema5,
  including repeats, immutable source/input checksums, legacy receipts,
  retained/current help, interrupted steps and invalid-input retries. The two
  earlier open-file-limit failures remain historical failures below.
- All 13 external HTTP checks pass with certificate validation and expected
  version 1.4.0. They do not replace browser or registered-account checks.
- Visible managed Chrome: the entry guide renders; the demo selector displays
  all 53 accounts and images; clicking Casey Bridge signs in and reaches
  `/game`. The avatar-menu chat list opens with HTTP 200 (no chats for that
  selected account; sending messages/video remains a separate check).
- Same 53-member request: warmup 0.4874 s, then 0.2932 / 0.2311 / 0.2748 s,
  compared with the earlier 5.270 / 5.435 / 4.680 s. This proves the selector
  request improvement, not a whole-application performance claim. A current
  idle sample records API 3.60% and Mongo 3.50% CPU; there is no matched CPU
  baseline for this batch, so CPU parity is not claimed.

Durable counts, hashes, index results, timings and test summaries:
[Native VMware parity evidence](MSC122_NATIVE_VMWARE_PARITY_20261012.json).
Temporary visual captures: `/tmp/msc122-native-installed-guide.png`,
`/tmp/msc122-native-demo-selector-after.png`, `/tmp/msc122-native-login-after.png`
and `/tmp/msc122-native-chat-after.png`.

Continue with the reusable [environment parity checklist](../ENVIRONMENT_PARITY_CHECKLIST.md).
No installed application data or indexes were repaired manually; the versioned
package supplied the fixes and all post-install audits were read-only.

## Historical failures before the corrected replay

Read-only diagnosis of the native 1.4.0 VMware candidate on 2026-10-12 found:

| Boundary | Actual evidence | Status / required correction |
| --- | --- | --- |
| Installed demo indexes | 29 of 199 canonical indexes missing; production has all 199 with matching definitions | FAIL. Demo reset drops the database and calls the importer without replaying the complete initializer |
| Visible demo selector | HTTP 200 with 53 members takes 4.68–5.44 seconds, exceeding the existing 3-second UI deadline; popup shows unavailable | FAIL. `countryPartitions` has only `_id_`; the actual geo lookup uses COLLSCAN. Fix initialization, not the timeout or Java query |
| Full demo JSON inventory | All 49 packaged files inspected; no seed document missing; jobs have changed runtime-owned fields | Data presence alone passes; reset/index/runtime qualification remains failed |
| Full retained production JSON inventory | All 23 packaged files inspected. Missing IDs in affinityConfigs (2), emailCampaignRules (6), emailTemplates (10), helpCenterRevisions (848), ideaPosts (16), landingSlides (12), notificationTemplates (10) | OPEN. Classify default ownership, operator changes and semantic identity before defining upgrade changes. Counts alone do not authorize restoring deleted operator content |
| Public entry guide | Visible entry guide reports no guide for the screen | FAIL. Trace current guide selection and retained revisions through the versioned upgrade path |
| Template reset oracle | Shared reset script unconditionally requires nonempty `events`; the template deliberately has no event domain | FAIL by source inspection; template installation not yet run. Use the selected project's seed contract |
| Source seeds | Native 143 JSON files and template 39 parsed and classified by existing seed audit; source checks pass | PASS at source only; actual E2E and template installation still pending |

Native source revision: `2751ea861`; installed artifact was built from
`aa2371c94` (the later change concerns the browser harness). Template source:
`37455e5`. Raw read-only local inventory: `/tmp/msc122-all-mongo-inputs-before.json`;
this temporary file is diagnostic evidence, not a durable release artifact.
No installed database documents or indexes were manually changed by this audit.

### Reset correction (subsequently replayed by the corrected package)

The package reset now invokes the existing `db_init.js` after import. Its new
reset selector accepts only literal `demo_db`, rejects a matching REAL database,
and excludes every other configured database. Ordinary fresh initialization is
unchanged. The shared reset oracle checks IDs/counts for every packaged JSON,
including empty baselines, rather than requiring the native-only event domain.
The reset marker is retained on an initializer failure.

Focused checks passed for native and template:

- `runtime-index-parity-test.mjs`: full definition agreement (199 / 67), actual
  initializer target selection and rejected unsafe reset targets.
- Its `--print-script` real-Mongo test on the existing VMware Mongo service:
  uniquely named disposable test databases only; missing indexes recreated,
  repeated initialization and upgrade, retained documents, scoped uniqueness
  and indexed lookup. Actual `demo_db` and `production_db` were not changed.
- `demo-reset-test.sh`: command order/readiness, target/media boundaries,
  failed initialization and retained retry marker, both project selections.
- `demo-reset-seed-test.mjs`: actual reset-oracle source with all 49 / 15 JSON
  files and mocked collection reads; missing/wrong identities, unexpectedly
  populated empty baselines and external avatars are rejected. This source
  regression does not replace a real package reset/import.

At this earlier checkpoint the installed package still had the defect. The
corrected-artifact replay and measured result are recorded above.

### Retained catalog and configuration corrections

All 23 production inputs were classified. The existing repeatable sync owns
country partitions, i18n messages/bundles, notification jobs, exchange rates and
system community roots/providers. Configuration migrations/import preserve
deployment and app settings. Admin monitoring/statistics and scheduling state
are runtime-owned. Access-policy/payment-provider inputs currently match; empty
operator Registry input must not clear operator-selected endpoints.

New immutable migration016 supplies the uncovered catalog paths: missing
affinity keys, group email rules/templates, notification templates, packaged
articles/slides and current help/guide revisions/metadata. See the exact
[ownership table](../../../packaging/migrations/README.md#016--complete-the-140-retained-catalog-upgrade).
The template carries the same script with only its selected help/guide inputs.
Focused real-Mongo tests passed in disposable databases for complete inputs,
repeat execution, existing operator semantic identities, custom/inactive/newer
revisions, interrupted upgrades and unchanged user/consent/configuration controls.
The complete historical migration-chain replay and actual package replay are
separate gates; both later passed for the exact native artifact recorded above.

Additional reviewed environment differences:

| Input | Classification / action |
| --- | --- |
| Source DEV/PROD `/etc/timezone` bind | Removed in both projects, matching installed production. Ubuntu26.04 has a directory at this path; `TZ` and `/etc/localtime` remain the existing timezone owners |
| Template PROD email URL fallback | Restored native `https://localhost`; DEV retains its intentional HTTP development fallback |
| VMware browser origin | Versioned campaign launcher configuration now uses the documented `https://localhost/entry`; guest address remains transport configuration |
| Source vs installed native API variables | Installed TLS/update host controls are intentionally installed-only; blank member override and operator identity/bootstrap values are environment inputs; Firebase bootstrap differs explicitly rather than silently copying DEV authentication into production |
| E2E variables | Isolated physical E2E seeds/database, fixture authentication, external-service simulators, test timing and no host source mounts remain deliberate test settings |
| DEV-only variables | Compiler/DevTools/debug ownership, fixture gateway credentials, explicit local webhook allowances and test purge timing remain development settings |
| KVM variables | Existing runtime manifest maps isolated DBs, internal service transports, local public URL, STUN and simulator endpoints; it reads the same Mongo initializer. Runtime qualification still pending |

Both repositories' environment render checks pass for DEV, source PROD, E2E
and installed PROD, including nondefault variable probes. This does not yet
prove live E2E/KVM behavior or the complete installed browser journey.

The full chain test exposed another installed configuration defect before
migration015 completed: Mongo's actual soft open-file limit was **1024**, inherited
from the guest Docker default. Mongo logged WiredTiger `Too many open files`
and a fatal assertion, then Docker restarted it; the interrupted test exited137.
There was no OOM event. The two interrupted test databases are
`qa_chain_6acc780ffa5ed8f47b544ca8` and `qa_chain_6acc78868088ccab84544ca8`;
they are disposable test-owned state, not application databases.

The shared Compose replica configuration now sets soft/hard `nofile=64000`,
inherited by DEV, E2E, source PROD and installed PROD in both projects. This is
the [MongoDB recommended open-file limit](https://www.mongodb.com/docs/manual/reference/ulimit/).
Installed qualification now checks the actual `mongod` process limit. KVM's
existing k3s service declares `LimitNOFILE=1048576`; verify the actual Mongo
process there during the serial KVM run. Do not patch the live process limit
or installed Compose file by hand: apply the corrected package before rerunning
the full chain test. The two interruptions are failed tests, not successful
migration-chain evidence.

## Comparison inventory

| Input boundary | Development source | Installed delivery and expected difference | Result before installation |
| --- | --- | --- | --- |
| Java application | `server/projects/profile`, DEV runner | The same application compiled into the release JAR; PROD profile, no watcher/DevTools | Found wildcard selection of an old JAR; now selects the exact version and compares image JAR bytes plus every classpath resource |
| Frontend | `frontend`, dev watcher and Nginx bind mount | Optimized `frontend/prod` baked into Nginx; all output files retained | Native 471 files and template 163 files match, including the unchanged upstream Nginx error page |
| Nginx | Shared routing, stream, runtime-status configuration | Same shared inputs, explicit production HTTP/TLS/update-status policies and entrypoint | Image files compared against each source owner |
| Mongo initializer/index definitions | Shared `db_init.js`, `mongo_import.sh`, adjacent project policy | Exact files mounted from installed payload | Checked with all seed inputs; no Java fallback added |
| Demo data | Native 49 JSON files; template 15 | Complete isolated demo baseline; only packaged synthetic administrator allow-list normalization | Every document compared against canonical DEV inputs |
| Production catalogs/configuration | Classified production variants of the DEV model | Native 23 selected JSON files; template 9; no real/synthetic users or activity rows | Found missing native guide fields and system Work/Community roots; required input coverage now derives independently from seed classification and nonempty safe production baselines |
| Import rules | Source `.env` and importer fallback | Fresh installed environment, retained upgrade environment and installer fallback | Found missing catalog names and database-insensitive upgrade matching; exact production rule merging now preserves other database rules and existing entries |
| Existing production data | Retained operator/user records | Historical migration chain and selected system-seed synchronization | Historical migration sources unchanged. Missing system roots/provider definitions use existing `$setOnInsert` synchronization; existing operator edits are retained |
| Migration inputs | `packaging/migrations` plus canonical production inputs | All native 14 migration files, including historical pinned inputs; template one selected migration | Exact tree comparison; complete current seed coverage checked before packaging |
| Media | Same MinIO bootstrap scripts and development seed directory | Files baked into MinIO; separate persistent `/data` | Native 879 files and template 1 file match their source trees; bootstrap scripts match |
| API/MCP/Registry/payment images | Existing Dockerfile/build owners | Exact selected image IDs; native seven images, template five | Entrypoint existence and selected image identities checked; template excludes native Registry/payment services |
| Compose | DEV services plus source production composition | Installed production composition, replica-set override and shared STUN definition | Same retained application services. DEV-only frontend/Mongo watchers, directory initializer and native release simulator are intentionally omitted |
| STUN | Shared `server/docker-compose-stun.yml` | Same service extended by each composition | Found missing template DEV service selection; now uses the existing definition |
| Host scripts/lifecycle | `packaging/scripts`, migrations, templates, Debian scripts | Native 33 host scripts, template 28; nine systemd units and sysusers definition each | Whole selected trees compared with source; secret paths and runtime directories remain deployment inputs |
| Timezone | Development host mounts and `TZ` | Installed Compose uses `TZ` and `/etc/localtime` | Template inherited `/etc/timezone` binds absent from native packaging. Removed them: the actual Ubuntu VMware guest has a directory at that path |
| TLS, credentials, configuration keys, update/TLS requests, DB/media state | Local development paths and credentials | Generated/provisioned host inputs under project-specific `/etc`, `/var` and `/opt` paths | Deliberate environment differences; private keys, actual credentials and E2E fixtures must remain outside payload |
| Package/client archive | Release builder and selected client manifest | Versioned DEB and client tools | Existing credential/archive/lifecycle checks retained; new check compares all actual DEB bytes, modes, ownership and control files with the independently verified stage |

## Concrete failure and regression evidence

The first VMware native candidate failed on a missing
`myscoutee_db/helpCenterGuideFields.json` before Java started. The broader
comparison then rejected its missing `communityGroups` input and incomplete
fresh/source/upgrade import rules. This failure is not a functional application
regression or proof that the candidate was successfully deployed.

The original API candidate image
`sha256:d0b0c7f235f534c5492b72a468470b72fa301af9da640dca9c526507948cfd7b`
contained `Implementation-Version: 1.3.2`, although its tag was `1.3.1-qa.1`.
The build directory held five different JAR versions and Docker's `COPY *.jar`
selected/overwrote the destination with the stale one. The corrected image
`sha256:16bf8c0f50cf085296c5e4f805a06a58bfb3fc20f54c975345d15033c3d0fd3f`
matches the intended `profile-1.3.1-qa.1.jar` byte for byte. This invalidates the
old candidate as evidence for current native source; it does not invalidate
independently built KVM or development source tests.

`tools/seeds/check-system-seed-parity.py` now checks source/importer/fresh/upgrade
coverage, and accepts `--packaged-root` to compare delivered data against DEV and
the production variants. `packaging/tests/deployment-input-parity-test.py`
compares complete runtime input trees and the image contents. The existing
package builder invokes both before producing a Debian artifact. It never
starts an application container. Missing or stale inputs fail packaging.

```sh
python3 packaging/tests/deployment-input-parity-test.py \
  packaging/dist/msc122-vmware/deb-root --images \
  --deb packaging/dist/msc122-vmware/myscoutee_1.3.1-qa.1_amd64.deb
```

Focused native/template install-policy tests pass, including partial legacy
rules, collection-name substrings, duplicate production rules, preservation of
unrelated configuration and repeat execution. Release-seed tests verify batched
insert-only behavior for the two new native selections and their absence from
the minimal selection. Existing package-content/lifecycle qualification is run
as one coherent batch.

## Remaining evidence boundary

Native input/payload, actual install, retained controls, visible guide/demo login
and external HTTP checks have passed for the artifact above. The user waived
the email-verification registration check; do not block template installation
on that unavailable path or report its dependent new-account journey as passed.
Install the template with independent data/media state.
Shut down the VM before live E2E, and validate KVM/monolith serially. Record each
boundary separately; the native result does not qualify the template.

The user authorized an intermediate native GitHub release, followed by another
after the remaining manual QA. The user uploads all DEBs. Other assets may be
uploaded, but each release stays draft until its matching DEB is present and
verified. GitHub Actions and Netcup are outside this work.

## Follow-up: environment wiring and retained index upgrade

The next installed start exposed an old unique notification job index before
Java could initialize the group-scoped replacement. The complete existing
Mongo definition inventory was compared: 199 required indexes, 12 missing on
the retained VMware database, zero changed definitions. Migration015 pins the
complete existing catalog, creates replacement constraints before retiring the
six explicitly obsolete constraints, and never changes documents. Fresh Mongo
initialization now also includes the existing importer/runtime definitions.
The live disposable-DB regression passed on VMware: all199 definitions,
repeat execution, retained operator data, group inserts, duplicate rejection and
an indexed scoped lookup examining exactly one document. Log:
`/tmp/msc122-native-runtime-index-parity.log`. The earlier candidate was not a successful deployment. Corrected installed
startup and the complete post-reset index audit are recorded above.

Environment checks render DEV, source PROD, standalone E2E and installed PROD
independently, using nondefault configuration probes. Corrections route DEV STUN
settings to Java (not Mongo), pass the native E2E release version into its build,
and expose existing updater origin/CA settings in source PROD. Template email
configuration now consumes the packaged `EMAIL_SENDGRID_*` names and its PROD
compositions pass the configured update CA. Both environment checks pass.

User instruction: the next native and template releases are both **1.4.0**.
The four remaining source QA tasks are separate; a fixes-only follow-up would
be 1.4.1. Earlier1.0.0/template and1.3.1-qa.1/native artifacts remain historical
qualification candidates and must not be published as the final release.

The two exact interrupted `qa_chain_*` test databases listed above were removed
after checking their test-only sentinel and migration receipts. No application
database was changed by this cleanup. The qualified native VMware state is
preserved in snapshot `msc122-native-1.4.0-parity-20261012` before switching
stacks.

## Template runtime identity correction

The first template 1.4.0 DEB (`27cc742a5c7fad1eb5f93e8aa18fa19995fea5fe355aca520c8d45937d9d265b`)
failed before initialization: it requested UID/GID 10001 under a different
account name while MyScoutee already owned those IDs. It is a rejected candidate.
No template application database was initialized. The qualified native snapshot
is the retry baseline; do not repair the failed installation by changing accounts
or application data manually.

The existing package-owned release policy now specifies runtime UID/GID. Native
MyScoutee remains 10001; template uses 10002. Production image build, Debian
ownership, configuration-key access, update/TLS workers and restore consume that
policy. The installer rejects a foreign ID before sysusers can allocate a different
account. Isolated KVM service images retain their existing 10001 container identity;
they do not share Debian host-owned directories. Dev compilers retain the host
identity. This does not change application roles, database queries or port bindings.

Focused checks passed: native/minimal install policy, release policy rejection
cases, numeric ownership and retained-account/repeat-install tests in both projects,
update worker, both TLS workers, template backup/restore orchestration, and both
four-environment Compose audits. The rebuilt template image must additionally
match the policy in the complete artifact audit. VMware installation and browser
flows remain pending at this source checkpoint.
