# Seed-data maintenance configuration

These commands inspect or update canonical static demo/E2E
seed data. They do not connect to a running server or database. Review their
generated JSON/SVG diffs before committing.

- `npm --prefix config/packaging run seed-parity` classifies the demo, production and E2E
  baselines, checks shared definitions/configuration differences and simulator-card
  owners, and rejects synthetic production identities/activity.
  Production packaging runs this check before staging artifacts.
  Landing slides and guide fields are shared catalogs. Community announcements,
  campaigns, service offerings/cases and community scheduled tasks have matching
  demo/E2E fixtures; their production baseline must be absent or empty.
  The two public, system-owned root workspaces and public MyScoutee social
  links introduced by MSC-115 remain production catalogs. E2E uses five-second
  event-counter expiry for all three configured scopes; other rule differences
  are rejected.
- `backfill-seed-distances.mjs` deterministically updates demo and
  E2E `userRates.json` distances.
- `normalize-chat-seed.mjs` checks chat/member/event JSON consistency; pass
  `--write` to apply its proposed normalization.
- `generate-help-center-illustrations.mjs` regenerates static help-center SVGs
  consumed by both local and HTTP help revisions from frontend assets. Optional
  context arguments (for example `profile-editor`) regenerate only those contexts.

```bash
npm --prefix config/packaging run normalize-chat-seed --
npm --prefix config/packaging run normalize-chat-seed -- --write
```

Runtime database import/bootstrap code stays with the server. Packaging-time
seed synchronization is maintained by `myscoutee-packaging` because it is part
of artifact construction.

The common runtime engine is `server/docker/conf/mongodb/mongo_import.sh`.
Its adjacent `mongo-seed-policy.inc` owns the project's collection allow-list,
special import handlers, indexes and migrations. Keep these two files together
in DEB, E2E and KVM seed bundles; the `.inc` suffix prevents Mongo's entrypoint
from executing the policy independently. `db_init.js` remains the project-owned
fresh database schema. A new project can reuse the engine byte-for-byte and
select its own policy and schema without importing MyScoutee product collections.

KVM seed fingerprints include both files. A changed importer or policy must not
silently authorize reimporting an existing database or updating its bootstrap
receipt. The existing explicit bootstrap/migration guards still apply.

The parity auditor runs directly from the installed `myscoutee-packaging` dependency.
Collection classifications live in `config/packaging/tests/release-seeds.json`;
the `parity` rules and their expected values are JSON data in that file.

Invoke maintenance with `npm --prefix config/packaging run NAME -- [OPTIONS]`.
Shared e-mail assignment, deterministic distances and configured profile-detail
synchronization live in `myscoutee-packaging/release/seeds`. Their project inputs
are JSON files under `data/`. The four product implementations live under
`scripts/`: help illustration rendering, event/asset image pool generation,
event-chat normalization and community menu reconciliation.

| Command | Input |
| --- | --- |
| `assign-seed-user-emails` | `data/emails.json`: files, domain and role counts |
| `backfill-seed-distances` | `data/seed-distances.json`: files, salt and distance parameters |
| `normalize-chat-seed` | `data/chat.json`: databases, collections and channel ownership |
| `reconcile-group-menu-counters` | `data/group-counters.json`: databases, owner type, prefixes and buckets |
| `generate-help-center-illustrations` | `data/help-images.json`: contexts, languages, labels and output directory |
| `synchronize-demo-image-pools` | `data/image-pools.json`: identities, prompts, slots, counts, paths and variants |
| `synchronize-seed-profile-details` | `data/profile-details.json`: existing frontend builder and database selection |

E-mail assignment selects account records and preserves workspace profiles.
The profile builder's `preloadModules` loads its required runtime modules into
the standalone bundle; the Angular builder selects `@angular/compiler`.
Image synchronization updates its configured pool without removing other
fixtures or recalculating account counters. Counter refresh remains explicit.

`data/demo-image-pool-manifest.json` is the image pool output inventory. Paths in the
configuration resolve from the application root. Counter reconciliation and
image/profile synchronization retain their explicit `--write` modes; email,
distance and help-image generation commands write their configured files.
