# MSC-122 — complete minimal backend template

Updated: 2026-10-11. Task: [MSC-122](https://github.com/fssrepository/myscoutee-roadmap/issues/160).

## Delivery boundary and order

`myscoutee-template` is a standalone, complete minimal counterpart of
`myscoutee-backend`: backend, frontend shell, local development, service assembly,
release/version tags, Debian package, Netcup installation, KVM lab, and a getting
started guide/PDF. It is not a component demonstration or a frontend-only starter.
Reuse the existing owners and operational workflows. Select the models required by the minimal flows and retain those models unchanged,
including their seed/local/backend contracts, so later MyScoutee upgrades remain
compatible. Keep the full structural and operational foundations; minimal UI
exposure does not authorize truncating retained schemas. Registry models the MyScoutee virtual company and
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

The minimum runnable product is a member SmartList and chat, backed by the selected, unchanged
MyScoutee member models and canonical identity capabilities: REAL/DEMO database and session
separation, Firebase authentication, native login/logout and account lifecycle.
Retain the schemas and minimal seed required by those flows. Derive membership,
chat participants and authorization from the retained canonical models. Review the dependency closure before
excluding event/matchmaking/payment models; do not remove fields from retained
models merely because the initial screen does not display them. Do not substitute mock login, in-memory
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
| Member/session | accounts `Users`, native auth/session controllers, Firebase filters; frontend session and Firebase services | Select required models with their dependency closure; preserve every retained model unchanged, including fields hidden from the minimal UI |
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

Both localization/i18n and geographic location are required in the template.
Localization currently remains in communication; geographic country partitions
belong to platform, and login/location eligibility and region policies belong to
accounts/access. An operator configuration switch may disable location use later;
this does not authorize deleting the location models or creating a parallel feature
framework. Reuse the existing configuration owner.

The proposed help/content regrouping was withdrawn. `help` stays separate;
`content` stays inside `community`. Its current scope includes articles/landing,
photo feed, sharing, feedback/reports, moderation, statistics and privacy cleanup.
No domain rename or five additional transport boundaries were implemented.

The original monolith, endpoint paths, collection owners, signed field order,
signing domain strings and helper request schema are retained. In particular,
the legacy `myscoutee-registry-update-manifest-v1` signing discriminator remains
unchanged so existing signatures remain verifiable.

## Verification / current gate

The eight-service KVM gate is complete at Helm revision **129**. The serial
monolith gate and final focused JUnit batch also pass. No complete-template
extraction is claimed.

- All 21 domains retain exactly one assembly owner. Eight independent JARs/images
  passed packaging/ownership checks; immutable identities are in
  `microservices/deploy/images.lock.json`.
- KVM native DEMO login/read/logout and public routes pass. Native consent save,
  logout and a fresh login retain the accepted version. The owned fixture was
  cleaned up. Integration reports reject a write-only token (403); explicit READ
  reaches the network owner and its native unenrolled-state conflict (409).
- Managed headless browser: **15 checks pass**, including member/operator native
  login, profile editor and image-editor entry, help/privacy/terms documents,
  guide completion, existing chat messages, events, Work/Dating workspace switches,
  operator configuration and logout. No browser action saves operator configuration.
  The release catalog returns HTTP 200. Report:
  `microservices/build/reports/browser/kvm/qualification.json`.
- KVM configuration initially lacked the platform master's key. A persistent
  deployment key is now retained in the existing private workload state and
  mounted only by its owner. Existing REAL/DEMO configuration contained no
  ciphertext before provisioning; no encrypted configuration key was replaced.
- The lab now packages the existing Compose release simulator. Bootstrap starts
  support services first and copies only the public TLS CA into a ConfigMap;
  private keys stay with the simulator. An empty local catalog never falls back
  to GitHub and is not package-installation evidence.
- The independently discovered public 1.3.0 release defect is repaired: its missing
  signed update catalog was added with the retained signing key and exact existing
  DEB identity. Canonical Java discovery verifies it from GitHub. Compatibility is
  exactly 1.3.0–1.3.0; older-worker upgrades still use the signed client installer.
  See `guides/qualification/evidence/RELEASE_1.3.0_CATALOG_REPAIR_20261010.json`.
- Revision-125 warmed read stress: **4,498 requests, zero errors, 74.9 requests/s**
  over 60.05 seconds, both selected assets served, zero application restarts.
  The cold 47.4 requests/s sample recovered after JVM warm-up; no CPU patch was
  justified. After load, the 40-second sample measured QEMU at 0.639 core
  (5.32% of the 12-CPU host), with total host utilization 12.45%.
- Final regressions: **228 transport tests**, **359 canonical JUnit tests**
  (340 standard, 10 embedded update HTTP/download tests, 9 release-discovery
  integration tests), zero failures/errors/skips. Monolith native login, seven
  domain reads, logout and the same **15 browser checks** pass, including HTTP 200
  release discovery. KVM is stopped and the existing dev stack is healthy.
- Infrastructure safety: **65 tests pass**. The platform key survives repeated
  state reads; an invalid retained key is rejected, not rotated. Foreign simulator
  deployments and private-key material cannot supply the backend CA.
- Existing HTTP contract evidence: public help 24 responses; measurement
  eligibility 12; global-identity privacy 11; operator reports 49. These fixtures
  do not prove KVM Registry persistence or production recovery. Whole-inventory
  schema validation still has pre-existing missing affinity recompute response
  evidence; no full-inventory pass is claimed.
- Guest resources remain 8192 MiB / 4 vCPU, with no host-boot autostart. Dev and
  KVM run serially. All original database/media volumes are retained.

Registry enrollment/registered-network flows, durable global-identity purge,
provider Firebase login, full image editing, signed update installation,
interruption/rollback and template installation remain separate qualification
scopes. The existing content/help grouping is unchanged. Documentation records
only exercised behavior, not every optional screen or future template flow.

## Latest narrow extraction checkpoint — 2026-10-11

Administrator identity is already separated from content moderation. Campaign
organizer-contact eligibility now belongs to campaigns through its existing
catalog API; chat retains conversation creation and no longer injects affinity's
`RatingDirectory`. The stored models and eligibility predicates are unchanged.
KVM Helm 134 and the monolith pass the focused checks recorded in
[PROGRESS](../../microservices/PROGRESS.md#msc-122-campaign-organizer-contact--2026-10-11).
The communication image and live credential inventory confirm the removed client.

This does not make community optional yet: event/member, case and announcement
references still require review. No template application sources, frontend
submodule contents, models or seed data were copied in this checkpoint.

The next account-selection boundary also passes KVM Helm **136** and monolith:
existing selection logic now has its own account service, and the redundant
`AdministratorCandidate` type no longer makes normal profile views depend on
administration. See the [source and runtime evidence](../qualification/evidence/MSC122_PROFILE_SELECTION_20261011.json).

Template implementation has now started through explicit file selection recorded
in `myscoutee-template/tools/upstream-sources.json`: native account/session/consent
models and services, required narrow read interfaces and an independent Gradle
build. `Users.affiliateRegistration` is omitted as requested. No events,
community, payment or Registry implementation/seed has been copied. The initial
26 account/session/consent tests pass; deployment/Firebase configuration selection
is in progress. The template is not runnable yet, and no installation is claimed.

## Remaining complete-template work

1. The serial MyScoutee KVM → monolith gate above is complete for this extraction
   boundary. Preserve its evidence and retain the separately listed unqualified
   production/update/network scopes.
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
