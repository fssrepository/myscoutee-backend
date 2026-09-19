# Packaged production migrations

The service and controlled updater run these migrations after MongoDB readiness
and before starting the API. They never reset production collections or media.

| Migration | Exact mutation | Retained state | Compatibility |
| --- | --- | --- | --- |
| 004-deployment-configuration | Singleton `deployment-configuration`: schemaVersion 3 → 4, increment optimistic document version once | Every operator-managed field, credentials, branding, Firebase and payment state; all other documents/collections | Current-source QA1 and QA2 both require schema4. Rollback to these packages preserves schema4. Historical binaries requiring schema3 are not qualified rollback targets. |
| 005-deployment-configuration-integration | Singleton `deployment-configuration`: schemaVersion 4 → 5, add `integration.publicBaseUrl: null` only when the Integration object is absent, increment optimistic document version once | Every existing operator-managed field and any existing Integration value; all other documents/collections | MyScoutee 1.0.1 requires schema5. The migration is forward-compatible with the schema4 layout because it only adds an optional configuration object. |

Both migrations are idempotent. Missing singleton is left for first-install
seeding; unsupported schemas are rejected. Neither migration may be replaced by
a full seed overwrite.

`packaging/tests/deployment-configuration-migration-test.py` uses a dedicated,
unique temporary DB in the existing QA Mongo container, verifies both schema
steps, retained opaque credential and Integration values, repeated execution,
unsupported schemas and fresh-database behavior, then drops only its own
database. Native package upgrade/rollback qualification separately verifies the
actual retained deployment document and Configuration API.
