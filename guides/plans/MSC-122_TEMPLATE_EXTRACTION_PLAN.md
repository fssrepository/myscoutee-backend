# MSC-122 — complete minimal backend template

Updated: 2026-10-10. Task: [MSC-122](https://github.com/fssrepository/myscoutee-roadmap/issues/160).

## Delivery boundary and order

`myscoutee-template` is a standalone, complete minimal counterpart of
`myscoutee-backend`: backend, frontend shell, local development, service assembly,
release/version tags, Debian package, Netcup installation, KVM lab, and a getting
started guide/PDF. It is not a component demonstration or a frontend-only starter.
Reuse the existing owners and operational workflows. A template domain may have
a smaller implementation appropriate to its purpose; retain the full structural
and operational foundations. Registry models the MyScoutee virtual company and
is excluded entirely, including the Java network client and Go Registry server.

### Minimal backend and optional screens

**Architecture decision rule:** minimal refers primarily to the initial product
and seed, not to discarding reusable foundations. MyScoutee must remain a plausible
application built on those foundations. Retain useful generic schemas, domain
boundaries and extension points even when the initial UI does not expose them.
Before removing or narrowing one, identify current callers, persistence/security
invariants, future extension cost and a concrete benefit over keeping it. Do not
add speculative abstractions either. A material loss of future capability needs
a concrete user decision before the cut; the inventory below is not blanket
authorization to delete every unused field or domain.

The minimum runnable product is a member SmartList and chat, backed by a small
member model and canonical identity capabilities: REAL/DEMO database and session
separation, Firebase authentication, native login/logout and account lifecycle.
Retain the schemas and minimal seed required by those flows. Derive membership,
chat participants and authorization from the retained member model, without
carrying MyScoutee event/matchmaking/payment/Registry structures merely because
the current product references them. Do not substitute mock login, in-memory
chat or a disconnected sample list for the existing persisted flows.

Keep the existing group/workspace structure where identity, session scoping and
chat authorization require it; begin with one minimal seeded group rather than
inventing a replacement profile model. The shell includes an avatar menu with a
small profile and image editor, top-level guide/notification access and minimal
settings required by these retained flows. Consent is foundational: retain
versioned documents, persisted acceptance, enforcement and its user-facing flow,
with REAL/DEMO isolation. Its presence is independent of an admin editing screen.

Select backend capabilities separately from frontend screens. Omitting a screen
does not remove its required schema, indexes, seed data, API or background work.
The minimal template has **no administration screen by default**. Keep necessary
account lifecycle jobs and durable state without copying MyScoutee's admin
dashboard, statistics or moderation UI. The operator installation/configuration
screen is foundational and remains; it must not pull in virtual-company Registry.

Help/guide content may retain its canonical schema and a small template-owned
seed without its management screens. In the current backend, `domain/help` owns
revisions, guide fields and audit entries; `domain/content` consumes published
content, and `AdminController` exposes editing. These are separate ownership and
presentation boundaries, not a reason to copy the whole content/admin product.
Similarly, account deletion is owned by `accounts/DeletedAccountPurgeService`
and its durable `AccountPurgeJob`, not by the admin screen. Preserve retry and
completion semantics for retained template domains; omit absent product-domain
purge stages explicitly instead of supplying fake successful adapters.

The eight-service MyScoutee composition is the verification target for this
separation, not a requirement that the minimal template run eight JVMs. Keep the
existing configurable assembly structure and compose only retained capabilities.

Source inventory for that selection (not completed template implementation):

| Minimum flow | Existing owner to reuse | Product coupling to review for the template |
| --- | --- | --- |
| Member/session | accounts `Users`, native auth/session controllers, Firebase filters; frontend session and Firebase services | Review matchmaking/profile scoring, organizer/event/payment fields and counters individually; preserve generally reusable structure |
| Member list | Existing shared SmartList and account-owned profile reads | Product discovery filters and business card compositions |
| Chat | chat documents/repositories, message/read state and existing client/server transport | Event/asset/support-case conversation branches and their foreign ports; retain member authorization |
| Account deletion | accounts `DeletedAccountPurgeService` / `AccountPurgeJob`, notification-owned job admission, platform scheduling | Purge stages for omitted product domains; preserve retained-domain cleanup and durable retry |
| Help/guide data | help revisions, guide-field schema, indexes, canonical Mongo importer | Product screen keys, help content and admin editing UI |
| Installation/configuration | platform bootstrap/configuration/TLS/update owners and existing operator frontend | Registry enrollment and virtual-company/network screens |

Seed through the existing importer and REAL/DEMO separation. Current production
`users`, `chats` and `chatMessages` seed arrays are empty; the DEMO seed contains
125 users, 1,244 chats and 10,171 messages, including product references. Help has
980 revisions and 1,455 guide-field rows per source database. These counts explain
why copying the entire product seed is inappropriate: prepare a small coherent
template dataset for retained member/chat/help contracts, with no dangling
event/asset/Registry references. This does not authorize shrinking the existing
MyScoutee KVM fixture or changing its data during qualification.

Concrete dependency findings from the current shell review:

- `GroupWorkspaceFilter` selects/restores the authenticated workspace principal;
  `CommunityGroupProfilesService` checks group access and membership. Group/profile
  separation is an authorization boundary, not merely a menu. Keep it initially.
- `settings-popups.component.ts` resolves the account behind a workspace before
  loading/saving consent. `AccountConsentService` persists document revision,
  version and optional-section approvals. Preserve account-level consent rather
  than silently turning it into independent per-workspace acceptance.
- `side-menu.component.ts` currently disables notification access when account
  location coordinates are missing. Review that product eligibility rule before
  template reuse; do not confuse it with notification delivery infrastructure.
- Existing settings mix foundational help/privacy/terms/delete/logout with
  product feedback, sharing and a hardcoded MyScoutee issue link. Reuse the common
  menu/document components and review each action; copying the entire side menu
  would also import admin/operator/product wiring.
- The existing profile editor invokes its image editor separately and already
  supplies FormFlow configuration. Retain that extension path and media storage
  contracts while reviewing which profile fields the minimal form exposes.

The user explicitly requires testing changes in **MyScoutee's existing KVM lab
first**. Only then carry the verified foundations into the template. Unit tests,
a successful monolith restart, or old MSC-121 lab evidence do not satisfy this
new KVM gate. Finish the source separation before runtime qualification. The
current user-directed order is **development → dev stop → KVM qualification →
KVM stop → monolith qualification**. Never run the two stacks together and do
not automatically return to dev while the KVM phase is pending.

CPU qualification is included. Reuse the existing warmed-up idle/load probes and
record host, VM and per-service CPU separately. Diagnose and repair measured
regressions, then repeat the same profile. The October-9 archived session
`01a11e6b-bb1d-7381-b62b-2078a58ebd06` records unnecessary graph recalculation,
empty-work suppression and the later blocking Redis stream reader. Its 5.15% VM
and 11.68% host averages were measured **before** the final blocking-reader fix;
they are historical context, not a proven final baseline. See
`microservices/DATABASE_POLLING_AUDIT.md`, sections 9–10.

Repository topology:

- `myscoutee-template/frontend` is a real Git submodule, currently backed by the
  local repository `/home/raxim/workspace/myscoutee-template-frontend`.
- `frontend/components` is a submodule of the existing remote
  `https://github.com/fssrepository/myscoutee-components.git`, pinned to the
  released component source. It is not another local-only repository.
- The frontend can receive its own remote later. Until then the parent URL is
  intentionally machine-local; this is not a portable published release.
- Existing MyScoutee frontend and component integration stay the product consumer.
  No new remote repository or release has been published in this continuation.

## Backend preparation in this working tree

The closest existing deployment owner is `domain/platform`: it already owns
operator configuration, encrypted secrets, branding, Firebase activation and
runtime settings. Bootstrap login, TLS and updates previously lived beside
network accounting under `domain/operator`.

| Capability | Previous owner | Current source owner / behavior |
| --- | --- | --- |
| Bootstrap auth/filter and public contribution contract | operator | platform; same HTTP and authorization behavior |
| Operator configuration endpoint and DTOs | operator, with platform service | platform; one owner |
| TLS controller/service/repository/properties | operator | platform; same privileged-helper handoff |
| Release discovery, staging, approval, rollback, status | operator | platform; same signed metadata and durable job schema |
| Release/announcement DTOs | OperatorNetworkDtos | platform OperatorUpdateDtos; JSON fields and stored Mongo aliases preserved |
| Release manifest/version validation | RegistryProtocol | platform ReleaseProtocol; canonical signing bytes unchanged |
| Canonical encodings/hash/key verification | RegistryProtocol/RegistrySignatures | common.security.crypto; shared by release and Registry consumers, no copied implementation |
| Installed update version | RegistryConfiguration bean | OperatorUpdateProperties, bound to the existing MYSCOUTEE_VERSION input |
| Enrollment, claims, MAU/revenue, settlements, global identity | operator + registry | remain MyScoutee-only; no protocol behavior removed |
| Guide/help deployment | community assembly | dedicated help assembly and Docker image |

The platform has no `operator` or `registry` code dependency. A compiled-class
regression gate checks that condition. This does **not** yet mean that the whole
platform or account domain is product-independent: platform scheduling and
configuration still have group, payment, asset and event contracts. The remaining
ports must be reviewed before creating the minimal composition.

`assemblies.json` now defines eight processes. Help has its own image, public
gateway destination and 256/512-MiB heap/container budget. Operator/Registry now
belong to the separate `network` assembly (384/768 MiB), leaving five domains in
identity. Generic deployment routes stay at identity; the network routes and
Registry client state follow network ownership.

The completed source boundaries use existing narrow profile-summary/email-profile
ports, bounded account measurement eligibility, the canonical durable global-identity
purge handoff, and signed integration report reads. Report authority is added only
inside the existing integration owner's role/read check, then restored; the receiver
verifies that signed authority, request bytes/path and REAL/DEMO. No general operator
write authority is granted. Large identity lookups use bounded batches.

Landing content consumes the narrow `PublicHelpContent` API; its bounded read
transport preserves REAL/DEMO and the canonical published-document implementation.

Localization means translation/i18n and currently remains in communication.
Geographic country partitions belong to platform; login/location eligibility and
region access policies belong to accounts/access. These are distinct capabilities.

The original monolith, endpoint paths, collection owners, signed field order,
signing domain strings and helper request schema are retained. In particular,
the legacy `myscoutee-registry-update-manifest-v1` signing discriminator remains
unchanged so existing signatures remain verifiable.

## Verification / current gate

The eight-service source and packaging checks below pass. KVM and final monolith
qualification remain pending; the earlier 271-test canonical regression result
predates the network split and does not qualify its latest canonical changes.

- Existing monolith watcher compiled the source and restarted the application.
- Source assembly inventory: all 21 domains have exactly one owner.
- Infrastructure checks: 61 passed (`microservices/tools/test_infra.py`).
- Focused backend regression: **271 passed**, zero failures/errors/skips, with
  `tools/run-backend-junit.sh standard` selecting Operator, Registry, Help,
  MongoConverter and domain-boundary/ownership tests. The runner uses isolated
  outputs and no dev databases (`/tmp/msc122-platform-junit.log`).
- Eight independent JAR builds and artifact ownership checks passed; **228**
  transport tests passed (`/tmp/msc122-network-assemblies.log`). The existing affinity
  HTTP fixture lacked its canonical `ScheduledMongoSessionRunner` bean; the
  fixture now supplies it, preserving its native-owner assertions.
- New public-help transport: **24 actual HTTP responses** validate against its
  OpenAPI contract, including published content, REAL/DEMO, unknown fields,
  service credentials, forbidden GET, size/media limits and owner failures.
  Run `node microservices/tools/verify-transport-contracts.mjs
  --contract=help/public-help-content-v1` (on one line). All contract schemas
  compile. Whole-inventory wire validation stops at pre-existing missing
  `affinity/recompute-metrics-v1` HTTP evidence; no full-inventory pass is claimed.
- Eight runtime Docker images built; `deploy/images.lock.json` records exact
  identities (`/tmp/msc122-network-images.log`). No guest image import/deploy has run.
- New network contracts validate actual HTTP evidence: measurement eligibility
  12 responses, global-identity privacy 11, operator reports 49. These HTTP
  fixtures do not prove KVM persistence or production recovery.
- The domain audit exposed pre-existing change-stream registration literals in
  `AdminStatsTelemetryWorkerService.watchInputs` and
  `PromotionalEmailDeliveryProcessor.watchDeliveries` and
  `ScheduledMessageTaskService.watchScheduledTasks`. Its exception is limited
  to those exact methods and reviewed subscription collections. Actual foreign
  document references and other collection accesses remain rejected.
- KVM runtime/context/flow qualification has **not run for this source**. Dev is
  stopped and libvirt is active after interactive sudo in the opened terminal.
  The separate versioned `vm.py observe` terminal is open. After the user directed
  continuation past the small host-memory shortfall, startup used the existing
  per-invocation `--host-reserve-mib 1792` option; guest size remains 8192 MiB /
  4 vCPU and defaults are unchanged. Actual startup preflight found 10,251 MiB
  available. Cloud-init and k3s API readiness passed; rollout is in progress.
  Host memory-pressure averages were zero during the initial startup sample.

Continue the existing serial lifecycle: keep the
Compose dev owners stopped, reuse the built/locked images above if source is unchanged
(otherwise run `microservices/tools/lab.sh build` and `workloads.py lock-images`),
import locked images through `workloads.py`, and deploy to the retained VM with the coordinated
backend writer guard. Keep the same persistent volumes and canonical REAL/DEMO
seed. Check real contexts, native login, help/consent and operator deployment
routes, logout and the applicable existing public/read smoke suite. Record exact
image identities and results in `microservices/PROGRESS.md`. Do not start the
8-GiB guest alongside the host dev stack or use a second build cache.

## Remaining complete-template work

1. Finish the MyScoutee KVM gate above before template application extraction.
2. Inventory remaining product dependencies in accounts/access/platform/admin,
   communication/media and integrations/MCP. Separate required extension ports
   at their current owners; retain login/session/demo, consent/guide, generic
   operator settings/jobs, communication and API/MCP. Exclude matchmaking,
   assets/events/campaign rules, payments/network accounting, Registry enrollment
and product moderation. A missing implementation must not be hidden by a
stub or permissive fallback.
3. Build the frontend shell in its local submodule using the actual shared
   components and the extracted application services. Keep the requested member
   member SmartList and basic chat, login/demo entry and Template
   branding. Do not substitute a fake in-memory login or duplicate guide engine.
4. Carry the canonical development/build/packaging/host-helper/release workflows
   into the standalone project, with project-owned names, paths and credentials.
   Preserve independent semantic versions/tags and signed release trust. Derive
   KVM ownership from that project's configuration; never adopt MyScoutee's VM,
   volumes or production state.
5. Verify a fresh minimal project through install, startup, restart and upgrade
   on its own KVM, then document Debian/Netcup setup and generate its getting
   started PDF with the established manual builder. Publish no release until
   these outcomes are proven.

The earlier frontend-only attempt was reverted. This document and the new
backend preparation supersede that attempt; its temporary build logs are not
current template evidence.
