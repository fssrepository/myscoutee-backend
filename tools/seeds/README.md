# Seed-data maintenance tools

These source-checkout-only tools inspect or update canonical static demo/E2E
seed data. They do not connect to a running server or database. Review their
generated JSON/SVG diffs before committing.

- `backfill-user-rate-seed-distances.mjs` deterministically updates demo and
  E2E `userRates.json` distances.
- `normalize-chat-seed.mjs` checks chat/member/event JSON consistency; pass
  `--write` to apply its proposed normalization.
- `generate-help-center-seeded-images.mjs` regenerates static help-center SVGs
  consumed by frontend assets and backend seed resources.

```bash
node tools/seeds/normalize-chat-seed.mjs
node tools/seeds/normalize-chat-seed.mjs --write
```

Runtime database import/bootstrap code stays with the server. Packaging-time
seed synchronization stays under `packaging/scripts` because it is part of
artifact construction.
