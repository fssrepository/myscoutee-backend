# MSC-122 — DEV and installed runtime input comparison

Date: 2026-10-12. Scope: native MyScoutee and the minimal template. The reference
is the working development implementation and its classified environment inputs,
not merely the Debian builder's own file allow-list. No Netcup access is allowed.

## Current verdict: FAIL — installed parity is not established

The earlier source/payload checks below passed only their stated static boundary.
They did not cover the complete resulting database after reset and retained
upgrade. Do not interpret them as successful DEV/E2E/installed parity.
Continue with the reusable [environment parity checklist](../ENVIRONMENT_PARITY_CHECKLIST.md).
No direct database repair is permitted: corrections must be delivered through
the versioned installation/upgrade path, then verified against its result.

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

### Reset correction in source; installation replay still pending

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

The installed VMware package still has the original defect. No improved response
time or completed installation is claimed until the corrected artifact is
installed and its actual data, indexes and browser results are checked.

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

Input parity is not installed runtime qualification. After the complete batch
passes, install the corrected native candidate on the preserved local VMware
guest, open its visible browser entry and check health, retained application
flows, response times and CPU. Only then stop it and install the template with
its own fresh database/media state. Keep the runtime serial. Record completed
artifact and installed checks separately; do not mark pending checks passed.

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
`/tmp/msc122-native-runtime-index-parity.log`. Installed startup is still pending
with this correction; the previous candidate is not a successful deployment.

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
