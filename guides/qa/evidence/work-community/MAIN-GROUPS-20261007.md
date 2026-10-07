# Main-group identity and global pagination — 2026-10-07

Scope: show the selected dedicated main group's landing identity after login;
highlight actual main-group cards and order them once before paging. This does
not change membership eligibility, subgroup identity or desktop/mobile layout.

## Changes

- The workspace button, workspace menu and notification scope share the existing
  landing label/icon/palette mapping. Dating is the account profile; Work and
  Community are recognized by canonical base IDs. Private groups keep their own
  names, initials, assigned palettes, counters and existing visibility rules.
- The existing card converter gives dedicated main groups the same localized
  name/icon/color and a short “Main group” / “Főcsoport” marker.
- Java's existing snapshot and the local service sort base IDs first **before**
  slicing a page. Existing distance/date order remains inside each partition.
  SmartList's existing sort key preserves this order during delta updates.
  There is no page-local prepend, extra query, timer or DOM traversal.
- EN/HU bundles and all three Mongo seed copies publish version 2026.10.07.9.

## Focused evidence — PASS

- Existing frontend-sync watcher compiled and synchronized the final sources.
  Existing Java continuous compiler reported BUILD SUCCESSFUL; DevTools restarted
  the same application. No second compiler, server or stack was launched.
- `node --max-old-space-size=192 frontend/scripts/check-main-groups-runtime.mjs
  server/docker/conf/nginx/app/myscoutee`: real compiled Angular workspace store,
  local service, popup/card converter and SmartList ordering. Member/admin main
  identities, private names/initials/counters and admin visibility passed. A
  25-group fixture whose base groups originally sort last passed full pagination
  at sizes 1/2/10/20 under both sorts, unique IDs/no omissions, delta ordering,
  unchanged sync, category filtering and EN/HU card presentation.
- `python3 guides/qa/tools/verify-main-groups-http.py`: actual running HTTP
  controller/service, five existing participation groups, sizes 1/2/3, distance
  and updated sorts. Both base groups occur once before three ordinary groups;
  totals/counters, unchanged sync, initial sync and category filtering passed.
  Only reads, including the read-only `/groups/sync`, were performed; no fixture,
  session, membership or profile was created/reset. The script reuses an active
  demo session without printing its identifier.
- `audit-i18n-mongo-seed.js` and complete live EN/HU bundle equality checks passed.
- Parent/frontend `git diff --check` passed.

## Limits and diagnostic failures

- No browser navigation or manual checklist action was performed. Actual
  desktop/mobile visual acceptance and the full paired campaign remain NOT RUN.
- The broad `check-work-community-reactivity.mjs` run stopped before workspace
  checks because the current AOT graph does not export the unrelated
  `SeedOperatorRegistryBuilder`. No product behavior was changed to satisfy that
  older harness. New assertions live in the focused script above, which passes.
- The first frontend compilation exposed an overly broad palette type in the
  shared appearance map. Preserving its literal palette types fixed that error;
  the final watcher compilation passed.
