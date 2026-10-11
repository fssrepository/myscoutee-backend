# Seed-data maintenance tools

These source-checkout-only tools inspect or update canonical static demo/E2E
seed data. They do not connect to a running server or database. Review their
generated JSON/SVG diffs before committing.

- `check-system-seed-parity.py` classifies all 40 demo, production and E2E
  baselines, checks shared definitions/configuration differences and simulator-card
  owners, and rejects synthetic production identities/activity.
  Production packaging runs this check before staging artifacts.
- `backfill-user-rate-seed-distances.mjs` deterministically updates demo and
  E2E `userRates.json` distances.
- `normalize-chat-seed.mjs` checks chat/member/event JSON consistency; pass
  `--write` to apply its proposed normalization.
- `generate-help-center-seeded-images.mjs` regenerates static help-center SVGs
  consumed by both local and HTTP help revisions from frontend assets. Optional
  context arguments (for example `profile-editor`) regenerate only those contexts.

```bash
node tools/seeds/normalize-chat-seed.mjs
node tools/seeds/normalize-chat-seed.mjs --write
```

Runtime database import/bootstrap code stays with the server. Packaging-time
seed synchronization stays under `packaging/scripts` because it is part of
artifact construction.

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
