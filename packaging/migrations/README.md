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

`run-data-migrations.js` discovers numbered migration files in order and records
successful steps in `schemaMigrations` with a source SHA-256. Already-applied
steps are skipped; changing an applied script is rejected. Failed steps are not
recorded, stop later steps, and can be retried because each migration is
idempotent. Add a new numbered migration for later releases; do not rewrite a
released migration. A source schema newer than this release understands is
rejected before mutation. Source schemas3/4/5, repeated execution, changed-script
rejection and interruption/resume have real-Mongo regression coverage.

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

Load the new HU/EN common help from the packaged seeds on retained databases.
Activate it when the installation still uses an unchanged packaged default;
deactivate that older default after insertion. Preserve custom content and
deliberately inactive selections. Add the new revision inactive when a custom
selection exists. If an operator already owns version3, retain it and report
that the packaged revision needs an explicit import. Privacy, Terms, explanation
guides and user data are untouched. Interrupted insertion/deactivation retries
are idempotent. `default-help-migration-test.py` exercises these cases in a
temporary database on the existing QA Mongo container.

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
