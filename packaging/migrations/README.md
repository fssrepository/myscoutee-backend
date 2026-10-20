# Packaged production migrations

The service and controlled updater run these migrations after MongoDB readiness
and before starting the API. They never reset production collections or media.

| Migration | Exact mutation | Retained state | Compatibility |
| --- | --- | --- | --- |
| 004-deployment-configuration | Singleton `deployment-configuration`: schemaVersion 3 → 4, increment optimistic document version once | Every operator-managed field, credentials, branding, Firebase and payment state; all other documents/collections | Current-source QA1 and QA2 both require schema4. Rollback to these packages preserves schema4. Historical binaries requiring schema3 are not qualified rollback targets. |
| 005-deployment-configuration-integration | Singleton `deployment-configuration`: schemaVersion 4 → 5, add `integration.publicBaseUrl: null` only when the Integration object is absent, increment optimistic document version once | Every existing operator-managed field and any existing Integration value; all other documents/collections | MyScoutee 1.0.1 requires schema5. The migration is forward-compatible with the schema4 layout because it only adds an optional configuration object. |

Migrations are idempotent; 004 also recognizes the already-applied schema5 so the full chain can run again. Missing singleton is left for first-install
seeding; unsupported schemas are rejected. Neither migration may be replaced by
a full seed overwrite.

`packaging/tests/deployment-configuration-migration-test.py` uses a dedicated,
unique temporary DB in the existing QA Mongo container, verifies both schema
steps, retained opaque credential and Integration values, repeated execution,
unsupported schemas and fresh-database behavior, then drops only its own
database. Native package upgrade/rollback qualification separately verifies the
actual retained deployment document and Configuration API.

## Ordered chain and repeatable seed loading

Migration020 adds the EN/HU corrections and DE/ES help, guide, article and
email/notification-template catalogs, including the non-blocking setup launcher
guide step. Its pinned `020-four-language-content/catalog-updates.json` reuses
migration017's unchanged default/custom/inactive/version-collision policy.
New editable catalog rows preserve both stored and semantic operator identities.
The existing recurring i18n seed sync supplies all four message bundles after
the migration. Both DEB startup and partial releases execute this same numbered
step; existing migration scripts and receipts remain unchanged.

`run-data-migrations.js` discovers numbered migration files in order and records
successful steps in `schemaMigrations` with a source SHA-256. Already-applied
steps are skipped; changing an applied script is rejected. Failed steps are not
recorded, stop later steps, and can be retried because each migration is
idempotent. Add a new numbered migration for later releases; do not rewrite a
released migration. A source schema newer than this release understands is
rejected before mutation. Source schemas3/4/5, repeated execution, changed-script
rejection and interruption/resume have real-Mongo regression coverage.

Historical inputs that must not follow later catalog edits live in
`seeds/<migration-id>/*.json`. The same runner selects that directory for the
individual migration and restores the release seed directory afterward, even
on failure. New receipts also record the sorted input-file SHA-256; changing or
removing recorded inputs is rejected. Legacy receipts remain valid and are not
rewritten. DEB and container-only updates carry these inputs with the migration
directory.

After the chain completes, `sync-release-system-seeds.js` runs on **every**
release/startup, including when all migration steps were already recorded.
Package-owned country partitions and i18n documents are replaced by exact `_id`;
messages precede bundle versions. Missing notification jobs and exchange-rate
observations/defaults are inserted; existing job overrides and observations are
retained. No user-content collection is a seed-load target.

## 006 — exchange-rate configuration default (1.0.2)

After schema5, add `payment.exchangeRateUrl` only when absent; retain explicit
blank/null/custom choices. Read the default from the packaged system seed.
`MYSCOUTEE_MIGRATION_SEED_DIRECTORY` selects the matching production/Explore
seed set for a container-only update. Feed is a new backend collection; the
existing startup initializer owns its indexes. No event, asset, feed, payment,
membership or user record is rewritten by these migrations.

## 007 — stored community pending-member counter (1.3.0)

Initialize `communityGroups.pendingMembers` only where the field is missing,
using that group's pending `activityMembers` records. Existing counter values,
groups and memberships remain intact. Normal membership writes maintain the
counter afterward; reads consume it directly. Demo/E2E and frontend local seeds
include it, and retained local storage initializes missing values once during
hydration. This step participates in the same packaged ordered migration chain.

## 008 — common help v3 (1.3.0)

Load the original HU/EN common help from the migration's pinned seed on retained databases.
Activate it when the installation still uses an unchanged packaged default;
deactivate that older default after insertion. Preserve custom content and
deliberately inactive selections. Add the new revision inactive when a custom
selection exists. If an operator already owns version3, retain it and report
that the packaged revision needs an explicit import. Privacy, Terms, explanation
guides and user data are untouched. Interrupted insertion/deactivation retries
are idempotent. `default-help-migration-test.py` exercises these cases in a
temporary database on the existing QA Mongo container.

The four original v1/v3 rows are preserved from release-source commit
`c02e54982` (`server/docker/conf/mongodb/myscoutee_db/helpCenterRevisions.json`).
Later release seeds deliberately mark v3 inactive when publishing newer help;
using them as migration008 input made an older installation's ordered upgrade
fail with `Missing canonical help v3 seed`. The released migration script and
its checksum remain unchanged. This snapshot is only migration input; it does
not replace the current help seed or an operator's active/custom selection.

## 009 — stored demo profile details (1.3.0)

Only in `demo_db`, initialize missing `profileDetails` on the 50 exact canonical
base demo identities (matching `_id`, `userId` and name). Values come from the
packaged demo seed, synchronized with the frontend local seed builder by
`tools/seeds/synchronize-demo-profile-details.mjs`. Retain existing details,
including an explicitly empty array, custom/renamed profiles and group profiles.
Do not insert users. The production database is a no-op. This replaces runtime
static filter defaults with repository data; repeated execution is idempotent.


## 010 — compact explanation guides (1.3.2)

Install package-owned EN/HU version4 compact tours and guide-field metadata through
the existing ordered chain. Activate unchanged packaged defaults, preserving custom
revisions, explicitly inactive selections, version collisions and all user preferences.
New contexts start active. Retrying interrupted insertion/deactivation is idempotent.
No user, Privacy or Terms collection is rewritten. The matching seed directory is
required for production/Explore. `compact-guide-migration-test.py` runs the actual
migration with uniquely prefixed disposable collections in the existing dev database
using the configured application credentials, then drops only those collections.

Migration011 refreshes package-owned fields for `home.game` and
`activities.rates`, including the granular-rating steps and ordering. It leaves
other screens, custom field IDs, help revisions and user data unchanged. The
shared release seed sync installs matching EN/HU messages and bundle versions.

## 012 — integration indexes

Move all eleven MCP grant, subscription and webhook indexes from the Java
startup initializer to Mongo initialization and the existing ordered migration
chain. Add the four already model-declared API-token/client-registration indexes.
Keep names, key order, uniqueness and TTL settings; no credential, grant,
subscription or delivery document is rewritten. Existing duplicate token hashes
stop index creation rather than deleting or rewriting credentials.

Fresh installations use `db_init.js`; seed initialization uses the existing
`ensure_runtime_indexes` policy even when these collections have no seed JSON.
Retained packaged installations run migration012 before starting the API.
Retained lab databases also require this migration before replacing the Java
image; a Java restart no longer creates integration indexes.
`integration-indexes-test.py` checks all three definitions, idempotency, empty
databases, retained data, duplicate rejection and an indexed key lookup on
disposable databases in the existing monolith or KVM Mongo runtime.

## 013 — common help v5

Complete the missed retained-installation update for the existing MSC-119 help:
EN/HU common, Work and Community v5 revisions. The UI/local/Mongo seeds already
contain this content; this migration brings older installed databases forward.
Activate v5 only for an empty scope or an unchanged older packaged default,
independently per group and language. Preserve customized content, explicit
inactive selections, an operator-owned version5 and any newer active revision.
Existing v5 content remains unchanged. An interrupted insertion/deactivation
can be retried. Privacy, Terms, explanation guides, consents and users are not
updated by this step.

The twelve canonical help rows from source `399f450ab` are pinned in
`seeds/013-default-help-v5/helpCenterRevisions.json`; all three canonical seed
sets agree. Older rows provide comparison values for detecting operator edits.
The live/current seed files are unchanged. Migration008 retains its original
input so the oldest supported upgrade reaches this new step; stopping at v3
does not satisfy the v5 upgrade.

For retained pre-group databases, the step uses the canonical Mongo policy's
group-aware unique and active indexes, creating the replacement unique index
before dropping the obsolete unscoped unique index. Help is loaded once and
changes use one ordered bulk write. This runs during upgrade, before the API,
and introduces no application request or background-work overhead.

`default-help-v5-migration-test.py` tests v1/v3/v4 upgrades, current v5, retry,
old index replacement, independent scopes, custom/inactive/colliding/newer
revisions and retained unrelated data. `migration-chain-test.py` verifies that
the complete ordered chain ends with v5, including installations with earlier
migration receipts. Both use isolated databases on the existing test runtime.

## 014 — account deletion-warning cleanup index

Ensure `accountDeletionWarnings.userId` (`account_warning_user`) for the existing
account purge worker. All warning records remain unchanged during migration;
the worker deletes only the permanently removed account's records. The same
index is declared for fresh databases and retained dev/seed imports. Existing
retry and stale-claim index definitions are unchanged.

## 016 — complete the 1.4.0 retained catalog upgrade

Read the immutable production inputs under `seeds/016-release-catalog-parity`.
This completes missing delivery paths found by comparing every packaged Mongo
JSON with the retained VMware database; it is not a direct database repair.

| Collection | Upgrade operation | Retained control |
| --- | --- | --- |
| affinityConfigs | Insert missing configuration keys | Any existing version/active choice for that key wins |
| emailCampaignRules | Insert missing group/rule keys | Existing IDs, group/rule identities and enabled/disabled values win |
| emailTemplates, notificationTemplates | Insert missing group/template keys | Existing IDs, semantic identities, content and enabled/disabled values win |
| ideaPosts | Insert missing packaged article IDs/content-key/language pairs | Custom content, publication/trash state and unrelated articles survive |
| landingSlides | Insert missing packaged IDs/workspace/slide identities | Existing slide values survive |
| helpCenterRevisions | Add missing selected revisions in each group/document/language/context scope | Reuse migration013's unchanged-default/custom/inactive/newer/collision policy; existing operator text and choices win |
| helpCenterGuideFields | Replace exact package-owned metadata IDs | Unrelated custom field IDs survive, as in migrations010/011 |

The chain records this operation once, including its input checksum. It does not
reinsert operator-deleted editable content on every subsequent startup. Existing
inactive or trashed records are never reactivated. For an empty help scope the
packaged active revision is installed, following the established migration013
policy. An unchanged older active default advances to the packaged revision;
custom or deliberately inactive scopes receive new defaults inactive. Version
collisions retain the operator revision. Insert the new default before retiring
the old one, so interrupted upgrades can be retried.

Users, consents, deployment configuration, runtime activity and uploads are not
targets. New group catalogs retain the existing storage contracts. The minimal
template uses the same script with an empty native-catalog selection and only
its selected help/guide inputs. It does not acquire the omitted native domains.

`release-catalog-parity-test.mjs --print-script` exercises fresh/repeat upgrades,
semantic identity collisions, inactive/custom/newer selections, older defaults,
interruption and retained controls on an isolated database in the existing
Mongo service. The package preflight also compares pinned inputs with the current
selected production seeds. A later catalog change needs its own reviewed upgrade
and updated current-release check; do not edit these recorded migration inputs.
