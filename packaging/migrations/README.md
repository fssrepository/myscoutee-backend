# Packaged production migrations

The service and controlled updater run these migrations after MongoDB readiness
and before starting the API. They never reset production collections or media.

| Migration | Exact mutation | Retained state | Compatibility |
| --- | --- | --- | --- |
| 004-deployment-configuration | Singleton `deployment-configuration`: schemaVersion 3 → 4, increment optimistic document version once | Every operator-managed field, credentials, branding, Firebase and payment state; all other documents/collections | Current-source QA1 and QA2 both require schema4. Rollback to these packages preserves schema4. Historical binaries requiring schema3 are not qualified rollback targets. |

Migration004 is idempotent. Missing singleton is left for first-install seeding;
unsupported schemas are rejected. The schema3→4 source change introduced no
field representation change. It must not be replaced by a full seed overwrite.

`packaging/tests/deployment-configuration-migration-test.py` uses a dedicated,
unique temporary DB in the existing QA Mongo container, verifies retained opaque
credential values and repeated execution, rejects unsupported schemas and drops
only its own database. Native package upgrade/rollback qualification separately
verifies the actual retained deployment document and Configuration API.
