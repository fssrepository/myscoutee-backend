# MSC-126: prioritized Lighthouse gains

## Current checkpoint — 1.4.5 release deployed and verified

This entry supersedes older pending/deployment statements below. The current
MSC-126 delivery batch is complete; the remaining priorities await the next
matched Lighthouse report or explicit manual verification. Source commits are
consolidated under `[MSC-126]`; release publication/accounting receipts accompany
[v1.4.5](../releases/v1.4.5.md).

1. Main and applicable template source/build work is complete. Catalogs remain
   four languages/9,174 messages each in main, two/1,816 in template, all at
   `2026.10.21.2`. Migration 024 pins 270×4 key renames; 025 guards the two intended
   demo lifecycle corrections. Template 019 independently pins 52×2. Static and
   real-Mongo retry/customization/version-ordering checks passed.
2. Focused regressions passed: main partner/events 21, demo bootstrap 20,
   runtime-card/home-filter 21, setup-popup 10, article captions 6; backend 15.
   Template frontend batches 92 then 30 and backend 7 passed. Grouping tests 9/8
   and partial-release inputs 8 passed. No full frontend suite was rerun. The
   original blocked/deleted profiles remain; source 50→active 48, ratings 32/16.
3. All four optimized 1.4.5 builds passed. Main HTTP 82/standalone 81 application
   chunks; template 31/27, all with two startup files. Main's 83 root JS files
   include the worker. HTTP startup has zero local service/seed bytes; standalone
   has zero HTTP service bytes. EN version metadata contributes 21 bytes.
   [Full inventory and feature increments](MSC-126_BUNDLE_INVENTORY.md).
4. Both mobile setup popups select the existing fullscreen presentation; actual
   shared CSS geometry fills 390×844 and 541×844. Article card chrome uses existing
   UI keys, with missing dates translated at the owning service; article content
   retains its identity. Roboto 400/500 remain unchanged at the owner's request.
5. VMware and Netcup serve 1.4.5 build `d9e2a1c84934-20261021232116`; API/MinIO/nginx
   selections are healthy and persistent. Installed DEBs remain 1.4.1. Netcup's
   actual starting state was schema 5/migration 022; 023–025 completed through the
   shared numbered runner. Netcup public checks 13/13 pass; VMware 10 pass/three
   HTTP-listener checks skip through its custom HTTPS tunnel. All 82 served JS
   hashes, backend canonical caption values, full-version equality, direct WebP
   MIME and old-PNG 404 behavior were checked.
6. Netcup's seven production user documents, 125 demo users and all indexes remain.
   Media 947→971: 25 added, one exact old room PNG removed, zero modifications to
   other existing objects; all 17 originals retained. VMware keeps all 1,055 objects
   and five production users. Fresh production/configuration/media and separate
   demo backups were verified on Netcup; no full VMware backup batch was made.
   Runtime statistics/outbox revisions and notification run state advance normally.
7. Fresh HU mobile profiles on both hosts show one navigation per cold/warm run,
   no local EN/HU requests, no EN→HU heading switch and no JS errors. Article
   actions render Hungarian; warm version validation is 420 encoded bytes in the
   observed run. These observations are not a matched Lighthouse comparison.
8. Follow-up priorities remain below: startup/demo payloads still exceed the
   approximate 200 KB preference in several files; animation/layout/CSS/cache/
   security/manual checks are not claimed complete. Current inspected feature
   transitions each add one chunk. No numerical LCP/TBT/CLS improvement is claimed.
9. Private detailed logs, source mappings, actual manifests and measurements are
   retained under `/home/raxim/.local/share/myscoutee-work/msc126-20261021-release/`.
   Public aggregate evidence is in the release receipt. The stopped host
   frontend-sync remains stopped; owned test/build/browser processes have exited.
   Existing VMware/Netcup deployments and the pre-existing tunnel remain running.

## Historical batches and evidence

Source: owner-supplied `/home/raxim/Downloads/download.pdf`, captured October 21,
2026, on `https://myscoutee.com/`, mobile / slow 4G. Reported performance 48,
accessibility 93, best practices 100, SEO 100; LCP 10.8 s, TBT 1,030 ms,
CLS 0.037. The report warns that retained IndexedDB may affect measurements.
Its recommendations are audit evidence, not additional user instructions.

The implementation was prepared without agent-created commits. Existing
`backup` commits subsequently captured it while VMware deployment was underway.
Complete the clear, bounded improvements first; record verification and leave
larger changes explicitly pending.

Owner constraint confirmed from Git and the October 21 clarification: preserve
MSC-125's consolidation into fewer startup chunks. That change reduced the
anonymous landing's JavaScript resource graph from 102 resources to four, as
recorded in `guides/releases/v1.4.4.md`. The consolidated build has two startup
bundles (main and landing); the preload candidate retains those same two.

Scope clarification: prioritize measured or directly evidenced Lighthouse gains.
Do not change product behavior to simplify optimization. Preserve the existing
failover and the accepted disabled-login / `No network` state. Build-mode and
failover redesign are outside this performance batch; standalone npm/GitHub data
must not be confused with cached backend data used while offline.

1. [x] **Reduce the landing card image payload.** Added quality-90 WebP variants
   of all three existing atlases. Dimensions, alpha channels and quadrant layout
   are preserved; side-by-side inspection passed. Current seeds now reference
   the real WebP paths directly. The three former PNGs and the runtime PNG-URL
   rewrite have been removed; migration023 updates stored server references.
   See the owned-image follow-up below for current packaging and validation.
2. [ ] **Validate the startup preload candidate.** Implemented, but its runtime
   performance benefit is not yet measured. Investigation found
   that `scripts/startup-bundles.js` removed all module preload hints. It now
   emits one hint for the already-required landing bundle in initial HTML,
   before the diagnostic script. Environment selection still precedes module
   evaluation, and member/optional features stay lazy. This addresses a
   prerequisite of image discovery; it does not reduce chunk count or JS bytes.
   An unconditional dating-image preload was
   rejected because the selected mode and configured slide image are runtime
   content; it could download the wrong image. Direct LCP image prioritization
   remains a separate follow-up below.
3. [x] **Repair the two reported accessibility failures.** The existing named
   wordmark now has `role="img"`, making its accessible label valid. Shared warp
   and info cards accept an accessible heading level, retaining defaults 3/4;
   landing uses level 2 beneath its h1. Footer sections use h2 with the existing
   visual styles. The visible wording and card layout are retained.
4. [x] **Verify text/font and transport opportunities.** Existing nginx gzip
   already covers JavaScript and JSON. Roboto already uses `font-display: swap`.
   The reported block policy belongs to the Material Icons ligature font;
   replacing it blindly with swap could expose words such as `login` before
   glyphs arrive. No transport or icon-display change was made in this batch.
5. [x] **Verify the completed batch.** Five startup packaging tests, 18 focused
   application tests and seven shared-component tests passed serially. Baseline
   and candidate optimized production builds passed. Exact asset/bundle checks
   and final diff checks passed; details below.
6. [x] **Assess the larger remaining work.** The existing package consolidator
   groups the static dependency closure of App, app configuration and EntryPage
   into the landing chunk. Preserve that deliberate consolidation. Any reduction
   of startup dependencies must retain the fewer-chunks constraint and needs a
   separate measured batch. The earlier EN/HU dual-loading assessment was
   superseded by the selected-language loading work recorded in the checkpoint.
   Every published translation change advances the full multipart catalog
   version, as clarified by the owner and checked against recent Git history.
   Reuse that existing version contract; no hash-based validator is needed.

## Measured asset changes

| Landing mode | Original PNG bytes | WebP bytes | Reduction |
| --- | ---: | ---: | ---: |
| Dating | 1,286,284 | 166,488 | 87.1% |
| Work | 1,837,133 | 189,432 | 89.7% |
| Community | 2,191,851 | 251,082 | 88.5% |

These are per-mode asset sizes, not cumulative savings on one page. Conversion
used Pillow WebP, `quality=90, method=6`. All dimensions and alpha-channel pixels
match their originals. RGB compression is lossy; the checked comparison showed
consistent appearance. Compiled assets match the source WebP bytes exactly.

## Verification

Baseline: frontend `2f1ac97f6f335a034d5c6c762878455987df67e0`, components
`ce3a0c3e821f63b27a0c3d6408720c0e390b795e`. Candidate: the uncommitted working
tree based on those revisions. Both builds used the same local dependencies
and `npm run build:prod`, with no stack running. Source changes are confined to
the frontend, its nested components repository, and this plan in the backend.

| Startup output | Baseline raw / gzip bytes | Candidate raw / gzip bytes |
| --- | ---: | ---: |
| Main | 257,669 / 82,860 | 257,669 / 82,860 |
| Landing | 3,975,187 / 940,272 | 3,975,611 / 940,380 |

Startup JavaScript increased **424 raw / 108 gzip bytes**. Gzip sizes were
calculated identically with Python `gzip.compress(..., mtime=0)`; they are local
comparative measurements, not captured wire sizes. Preloading improves request
discovery, not bundle size. No smaller-JavaScript claim is made.

Executed serially from `frontend` unless noted:

1. `node --test scripts/startup-bundles.test.mjs`: **5/5 PASS**, including shared
   service identity, environment ordering, lazy features and idempotent stamping.
2. `npm test -- --watch=false --include='src/app/shared/core/common/image-urls.spec.ts' --include='src/app/entry/components/entry-landing/entry-landing.component.spec.ts'`:
   **18/18 PASS**.
3. From `frontend/components`, its existing test script:
   `npm test -- --include='src/lib/ui/components/core/deployment-brand/deployment-brand.component.spec.ts' --include='src/lib/ui/components/core/smart-list/card/warp-image-card/warp-image-card.component.spec.ts'`:
   **7/7 PASS**.
4. `npm run build:prod`: **PASS** before and after the changes. The candidate
   warning set is identical to the baseline (existing Angular/Sass, style budget
   and qrcode warnings). Candidate HTML contains exactly the non-main required
   startup preload; its target exists, with no optional feature preloads.
5. `git diff --check` in all three repositories: **PASS**.

Local logs and comparative metrics are retained under `/tmp/msc-126-*`.
At the implementation-validation stage, no deployment, browser checklist
execution, new Lighthouse run, measured LCP/TBT improvement or
accessibility-score change was claimed. The later owner-authorized VMware
deployment is recorded below. KVM and
monolith backend runtime qualification is not applicable to this frontend-only
batch. All agent-started tests/builds exited. No containers were started;
`frontend-sync` was initially stopped and remains stopped. Available RAM stayed
above 8 GiB at sampled checks, with no swap usage. Trust mode: `standard`.

## Remaining priorities — complete report review, October 21

All28 pages reviewed, including passed, manual and informational audits. This
list orders the remaining work by likely user benefit and implementation risk.
The report's estimates are historical evidence, not measured candidate savings.

1. [ ] **P1 — Startup JavaScript / main-thread work** (pp3,5–8).
   Record an optimized baseline and inspect the consolidated dependency graph.
   Identify startup-only dependencies that do not serve anonymous landing paint;
   preserve the existing two startup bundles, environment selection and singleton
   identities. The report's unused JS577KiB, execution1.8s, main-thread4.5s,
   17 long tasks and large network payload overlap; they are not five additive
   savings. Do not undo MSC-125 consolidation. The tested adapter-boundary batch
   below removes 398,026 raw / 131,976 gzip bytes from backend startup while
   retaining two startup bundles. Runtime Lighthouse measurement remains pending.
2. [x] **P1 — Actual LCP image request priority** (pp2–3).
   Extend the existing image-loading owner for the selected first landing card,
   retaining URL resolution, SVG localization, request sharing, failure handling
   and offscreen loading rules. Use the selected mode's real image; no hardcoded
   dating preload or PNG-to-WebP substitution. The existing landing-module
   preload is implemented; its end-to-end benefit remains unmeasured.
3. [x] **P2 — Avoid retransferring a known translation catalog** (pp3,7).
   Source, focused tests and VMware runtime verification complete.
   Compare the complete existing multipart version and return the existing empty
   payload response on equality. Preserve selected language, English-source
   support, edit/delete updates and REAL/DEMO cache isolation. This improves
   repeat loads with a cached catalog; first-load payload is unchanged.
4. [x] **P2 — Font payload and earlier discovery; display policy reviewed** (pp2–3,7).
   Roboto already swaps. Inspect whether the imported Material Icons stylesheet
   ships unused font families and can be narrowed to the used family. Preserve
   ligature rendering; do not expose icon names by blindly changing display.
5. [ ] **P2 — Non-composited loading animations** (pp9–10).
   Trace the reported spinner/bar/loader styles to their owner and remove
   unnecessary animated color/border/shadow properties while keeping loading,
   progress, timeout, error and reduced-motion behavior.
6. [ ] **P2 — Layout shifts** (pp4–5).
   Check the article-more row, warp-card image area and auth-button state sizing.
   Reserve space only where async content currently moves adjacent content;
   retain responsive layout and do not hide content to improve CLS0.037.
7. [ ] **P3 — Unused/component CSS and render blocking** (pp4,7).
   The reported stylesheet blocking estimate is0ms; do not inline every style.
   Inspect the ~19KiB unused component-style estimate after the startup graph,
   distinguishing hidden/interactive states from truly unreachable styles.
8. [ ] **P3 — Back/forward cache** (pp6–7).
   Inspect document/public-response no-store ownership separately from private
   API data. Do not broadly weaken cache policy. A change needs logout/private
   data and navigation compatibility evidence.
9. [ ] **P3 — Security-header advice** (pp21–22).
   Review existing CSP script-src, Trusted Types and COOP against Firebase
   popups, workers, inline diagnostics and integrations before enforcement.
   HSTS includeSubDomains/preload requires an explicit domain-wide rollout
   decision; do not add irreversible policy for a Lighthouse suggestion.
10. [ ] **P3 — Browser compatibility and diagnostics** (pp22–25).
    Check feature guards for performance observers/requestIdleCallback,
    scrollend, PWA and CSS enhancement fallbacks. User Timing, detected libraries
    and feature availability are informational, not automatic defects. Large
    bundle source maps are a diagnosis aid; do not publish sources just for score.
11. [ ] **Manual validation remains** (pp13–14,27).
    Ten accessibility checks cover focus, tab order, offscreen controls, dialogs,
    landmarks and custom controls; structured data has one manual SEO check.
    These are not proven by source/unit checks and are not a browser delegation.
12. [ ] **Matched Lighthouse measurement** (pp1–2,28).
    After a coherent batch, measure the same candidate/baseline environment,
    Moto G Power/slow4G settings and clean storage, recording LCP/TBT/CLS,
    bytes/request counts and increases as well as decreases. The original run
    warns about retained IndexedDB. Existing browser sessions belong to the owner;
    no fresh browser run or numerical speed improvement is claimed yet.

Already repaired: image delivery (pp4,7; all owned images now WebP), prohibited
wordmark ARIA (p12) and heading order (p13). Preserve these changes.

Passed/not-applicable coverage: performance13 checks (pp10–12: cache lifetimes,
TTFB, redirects, duplicate/legacy JS, DOM, minification and dimensions),
accessibility18 passed/43 N/A (pp14–20), best practices12 passed/2 N/A
(pp25–26), SEO9 passed/1 N/A (pp27–28). Do not turn passing or N/A findings
into speculative product changes. Best practices and SEO scored100 originally.

### First remaining-audit batch — source tested, VMware unchanged

History checked **before application edits**:

- `2f1ac97f6` (MSC-125) intentionally consolidates startup dependencies and keeps
  environment selection before evaluation. Two startup bundles remain.
- Shared-components `65f5283` (MSC-115) deliberately retains loaded atlases across
  carousel transitions; the earlier loader also defers offscreen/fast-scroll
  requests. These rules are preserved.
- Shared spinner styles already rotate the HTML layer, with progress/error
  behavior retained by MSC-115. No animation rewrite without fresh evidence.
- `6128bf11b5` (MSC-7) introduced the all-family icon stylesheet. Current source
  has no Outlined/Round/Sharp/Two Tone family or `fontSet` consumers. The filled
  import retains the exact font files, ligatures and `font-display:block` policy.
- MSC-125's i18n change prevents duplicate refreshes and raw-key flashes; neither
  catalog removal nor equal-version response suppression was introduced.

Implemented through existing owners:

1. The first actual landing card passes high priority through WarpImageCard and
   LazyBgImageDirective. A visible priority card starts without the scheduled
   visibility timer; an offscreen/inactive card still waits. `fetchPriority` is
   assigned before `src`, and atlas requests/cache entries remain shared. Existing
   URL resolution, SVG localization, fallback, timeout and scroll handling remain.
   There is no unconditional image preload in initial HTML; discovering the
   selected URL still requires the landing data/code.
2. The application imports only `filled.css`. The existing build stamper discovers
   that font's hashed WOFF2 URL from the emitted stylesheet and emits one font
   preload with matching CORS behavior. Relative URLs remain base-path aware,
   stamping is idempotent, and the worker does not add fonts to blanket precache.

Checks, all serial with no local watcher/server:

1. Shared loader/card: **19/19**, including high/ordinary request sharing,
   priority-before-src, offscreen/inactive deferral, cached-atlas retention,
   fast scrolling, load/failure states and Angular input integration.
2. Application landing/image URLs: **15/15** through the existing npm wrapper.
3. Startup/worker packaging: **5/5**, including environment ordering, two startup
   bundles, lazy feature identity, repeat stamping, font hint and limited precache.
4. Optimized production build and normal stamping passed. Existing warnings
   remain; final diff checks pass in backend/frontend/components. No test/build
   owner remains. `frontend-sync` was initially stopped and was not started.

Matched local build-size comparison: frontend baseline `ea73244307fc`, components
`f831dce`, backend `ce5de4f23`; candidate is their uncommitted worktree, same
production configuration/dependencies and gzip calculation (`mtime=0`).

| Output | Baseline raw / gzip bytes | Candidate raw / gzip bytes |
| --- | ---: | ---: |
| Main | 257,669 / 82,860 | 257,669 / 82,860 |
| Landing | 3,975,487 / 940,324 | 3,975,915 / 940,423 |
| Global CSS | 49,275 / 6,674 | 46,861 / 6,495 |

Startup JS **increased428 raw/99 gzip bytes**. CSS decreased2,414 raw/179 gzip
bytes. Eight unused font assets totaling **1,564,708bytes** were removed from the
build. These are packaging savings: the browser was already using only the filled
WOFF2, whose128,352bytes are unchanged. Its earlier request is a latency candidate,
not a measured Lighthouse improvement. Candidate build:
`ea73244307fc-20261021144914`; all three landing WebP bytes remain unchanged.

The captured Angular graph identifies concrete next investigation targets:
~1,256,999 raw output bytes in the shared UI module, app-static-data138,822bytes,
DE/ES/GB local country geometry253,322bytes, Material datepicker110,783bytes.
These are per-input compiler contributions, not compressed wire savings. Country
geometry serves exact local partition checks in standalone npm/GitHub mode;
this is separate from backend-connected offline cache operation. It must not be
deleted or replaced by approximate bounds. No import restructuring was performed in this
batch. The pre-consolidation graph has101 static output files; the delivered
startup still has **two** bundles, one module preload, and one filled-font preload.

Read-only VMware transport checks confirm gzip is already active: HU catalog
305,512 compressed/931,158 decoded bytes; EN270,772/843,495. Both currently use
`no-store` with no ETag. Document also uses no-store; CSP currently covers
frame-ancestors/object-src/base-uri, HSTS has31536000s without subdomains/preload,
and COOP is absent. These confirm the remaining investigation entries; policies
were not changed. No new migration, deployment, commit or browser session was
created. Existing VMware remains on the preceding tested WebP batch. New
LCP/TBT/CLS scores, visual/manual QA and browser-cache behavior are unmeasured.

Local evidence: `/tmp/msc126-next-{baseline-build,candidate-build,candidate-stamp,
components-tests-final,frontend-tests,startup-tests}.log`,
`/tmp/msc126-next-baseline/metrics.json`,
`/tmp/msc126-next-candidate-metrics.json`,
`/tmp/msc126-next-startup-analysis.json`.

MSC-126 is the owner-provided task identifier; no existing matching roadmap
issue was returned by the scoped lookup. The configured historical Project
helper path is absent; its relocated copy exists in
`myscoutee-roadmap/guides/history-tools/reconstruction/github_api.py`. No issue,
Project or release state is changed by this work.

### Translation version follow-up — source tested, deployment pending

1. Git history showed that `0941aac8a` (consolidated in `46ee4b11d`, MSC-121)
   removed equal-version short responses under the assumption that translation
   edits could be published without a version change. The owner corrected that
   assumption: even one changed word requires a new complete multipart version.
2. The last ten catalog-affecting commits in each repository were compared.
   Among existing languages, none changed content without advancing the version.
   Most recently, frontend `ea73244307fc` and backend `4f9b2dddc` changed eight
   values per language and advanced `2026.10.20.2` to `2026.10.21.1` in EN/HU/DE/ES;
   the backend change covers all three package-owned MongoDB seed sets.
3. The existing backend service now compares the entire version string. Equal
   versions return HTTP 200 with language/version and no message payload; the
   frontend already supports this response through its existing scoped cache.
   Missing or different versions still receive the full catalog. There is no
   new hash, ETag, cache mechanism, endpoint or frontend runtime implementation.
4. Focused backend service/controller tests: **8/8 PASS**. Focused frontend
   service/repository tests: **19/19 PASS**. Coverage includes complete-version
   comparison (different dates with the same final component), cached REAL/DEMO
   reuse, and changed-version edits/deletions. No catalog content changed, so
   this service-only change does not require a catalog version bump.
5. This follow-up and the preceding font/LCP source batch have not been deployed
   to VMware. KVM/monolith runtime qualification and the owner's new Lighthouse
   run remain pending the combined batch. No first-load or measured LCP/TBT gain
   is claimed from the translation response change.

Local test evidence: `/tmp/msc126-version-revalidation-junit.log`,
`/tmp/msc126-version-revalidation-frontend.log`; history comparison:
`/tmp/msc126-catalog-version-history.json`.

### Backend/local import boundary — source tested, deployment pending

1. **Verified existing data boundaries.** HTTP translations are stored in
   `myscoutee_http_db`, separated by REAL/DEMO scope; the local application uses
   `myscoutee_demo_db`. The service worker also precaches the complete local
   EN/HU asset catalogs during its installation on the landing. These asset
   copies are distinct from the backend catalog repository. Local help seeding
   calls `ensureLanguageLoaded` while preparing its language-specific documents.
   None of these catalog, database, seed-progress or cache flows was changed.
2. **Fix the import owner rather than local implementations.** Shared/base
   services eagerly imported a connected group of local services even when HTTP
   routes were selected. Their classes and country tables therefore entered the
   consolidated landing bundle. Eight provider aliases now expose those same
   singleton classes through a dynamically imported provider module. Existing
   environment selection and explicit local route settings determine registration
   before Angular bootstrap. Four remaining barrel consumers use direct imports
   of the same classes. No file under `shared/core/local` was modified.
3. **Preserve standalone and demo availability.** npm local startup registers
   the local providers; the GitHub build explicitly includes them in its existing
   startup pair through `FRONTEND_BUILD_PROFILE=standalone`. Backend startup
   keeps them outside its initial pair. The existing eligible-demo code warmup
   now includes this module, both for a restored demo and for a demo selected
   after anonymous startup. This downloads code after an accepted demo session;
   it does not run a seed or read the backend i18n database as a local fallback.
   Failover decisions, the accepted `No network` state and popup guards remain.
4. **Measured benefit before the proxy follow-up below.** Matched production builds use frontend `c8b4a558dcbe`
   as baseline and its uncommitted candidate, with the same configuration,
   dependencies and gzip calculation (`mtime=0`). Baseline assets were retained
   before the reverted first attempt; only the completed boundary change is
   represented by the candidate below.

   | Startup output | Baseline raw / gzip bytes | Candidate raw / gzip bytes |
   | --- | ---: | ---: |
   | Main | 257,669 / 82,860 | 257,784 / 82,913 |
   | Landing | 3,975,915 / 940,423 | 3,577,774 / 808,394 |

   Startup decreases **398,026 raw / 131,976 gzip bytes** (12.9% of startup gzip).
   Main increases 115 raw / 53 gzip bytes; landing decreases 398,141 raw /
   132,029 gzip bytes. The country geometry is present in the separate local
   chunk (623,606 raw / 189,355 gzip bytes), not deleted or approximated.
   Production retains two startup bundles, one module preload and one font
   preload. GitHub also builds with two startup bundles and retains its local
   geometry in startup; its `/myscoutee/` base path is preserved.
   Total emitted JavaScript files increase from 103 to 104. The backend local
   provider's static dependency closure contains three files outside startup
   (20,371 / 623,606 / 36,422 raw bytes); they are not all new files or a single
   download. Cache state determines their actual network transfers. Evidence:
   `/tmp/msc126-adapter-boundary-chunk-graph.json`.
5. **Cost/benefit decision for i18n.** Full local EN/HU catalogs contain 8,743
   keys each and occupy 198,390 / 222,549 gzip bytes (about 411 KiB combined,
   gzip level 9); these are source-file comparisons, not captured HTTP transfer.
   Splitting landing/app translations would require shared/dynamic text coverage,
   versioning and cache work. It is deferred rather than mixed into this batch.
   No new cross-reference between backend and local catalog databases was added.
6. **Validation and limits.** The focused adapter/profile/session/landing/i18n
   suites pass **169/169**; startup/profile packaging tests pass **6/6**. Production
   and GitHub optimized builds pass. Generated tracked GitHub output was restored
   after verification; source changes remain reviewable. The broader local-seed
   suite passed 18/20 on its first run: its admin-notification timeout passed on
   isolated retry; its affinity test still expects 50 active nodes but receives
   48. The unchanged local seed has one blocked and one deleted profile. Backend
   demo/e2e seeds also mark these accounts B/D, but retain their visibility values
   in `profileStatus`; this representation difference is recorded, not silently
   repaired. No live/real database was used for this test diagnosis.

No VMware deployment, commit or new browser audit was performed for this batch.
End-to-end offline warmup and LCP/TBT/CLS remain unmeasured. Host frontend-sync
was initially stopped and remains stopped; all agent-started tests/builds exited.
Evidence: `/tmp/msc126-adapter-boundary-{tests-final,startup-tests,build,
github-build,seed-recheck}.log`, `/tmp/msc126-adapter-boundary-metrics.json`,
`/tmp/msc126-adapter-boundary-github-metrics.json`.

### Keyed adapter proxy — first consumer verified

1. **Keep route ownership.** `BaseRouteModeService` remains unchanged. The named
   `UserExperiencesService` now passes local/HTTP key constants to its existing
   route selector, then asks `AdapterProxyService` for only the selected key.
   Concrete implementation imports are centralized in `adapter-loaders.ts` as
   dynamic loaders. Other service consumers have not yet been migrated to this
   proxy; this is not application-wide local/HTTP separation.
2. **Cache loading, preserve instances.** The proxy caches the in-flight promise
   per key and resolves the existing Angular singleton through the injector.
   Parallel callers share one load. Import errors propagate; a later call can
   retry. Local/HTTP selection, route overrides, data conversion and storage
   ownership remain with their existing owners.
3. **Remove proven duplicate copies.** The local repository/adapter and HTTP
   adapter already return detached experience records. Removed only the base
   service's additional copies after load/save. Import-draft copies remain.
   Final focused tests pass **15/15**, including parallel loading, singleton
   identity, unused-adapter exclusion, both explicit mode overrides, failure
   propagation/retry, and mutation isolation with the real local repository
   and HTTP adapter/cache. No local implementation was changed.
4. **Build evidence and limit.** The optimized production proxy build passes.
   Both implementation entry points exclude the opposite experience adapter
   from their static dependency closure. Startup remains two files; emitted JS
   increases from the preceding boundary candidate's 104 to 105 files. That
   build adds 252 startup gzip bytes versus the preceding candidate: the proxy
   itself is not a demonstrated startup performance gain. This graph/size check
   preceded removal of the two base copies; final source was compiled by the
   focused test run, and final artifact sizes were not remeasured. No browser
   audit, offline-flow verification, deployment or commit was performed.

Evidence: `/tmp/msc126-proxy-cache-tests.log`,
`/tmp/msc126-proxy-cache-build.log`,
`/tmp/msc126-proxy-cache-import-boundary.json`,
`/tmp/msc126-proxy-cache-metrics.json`. Host frontend-sync was stopped throughout;
all test/build descendants exited.

## VMware deployment and data prerequisite correction, October 21

Owner-authorized local VMware deployment completed at
`https://localhost:8443`, using the existing loopback-only SSH forwarding helper.
Build: `msc126-lighthouse-20261021-r1-worktree`, application content 1.4.4;
installed DEB remains 1.4.1. Existing `install-temporary-image.sh install-local`
persisted the exact selected image. Only nginx was recreated; the other eight
container identities/start times were retained. All nine services are healthy.

The initial nginx-only update omitted release-data prerequisites. The owner
reported raw setup translation keys; API inspection confirmed old bundles
`2026.10.19.2` and missing migrations021/022 in both databases. After a fresh,
verified complete backup, the existing `apply-partial-release-data.sh` applied
the unchanged numbered migrations and synchronized the complete package-owned
seed selection into production_db and demo_db. No new migration was authored
and no reset was performed. Migration022 changed 12 canonical demo locations;
production user records were unchanged.

Verification after correction:

1. Both databases have receipts through022 and bundle version `2026.10.20.2`.
2. All **8,743 canonical messages per language**, EN/HU/DE/ES, match API values
   in normal and demo modes: eight comparisons, zero mismatches. Extra retained
   noncanonical translation rows were not deleted.
3. The existing external HTTPS verifier passed **10 checks, zero failures**;
   three HTTP-listener checks were skipped for the custom-port tunnel.
4. The served main/landing bundles and three WebPs match the built artifact
   SHA-256 values. HTML contains exactly the intended landing module preload.
5. The existing retained-data fingerprint compared 97 production collections
   and 1,031 media objects. User records, deployment configuration and media
   were unchanged; catalog/migration changes and background monitoring/job
   state changes were recorded. No existing production documents were removed
   and no indexes changed.
6. nginx syntax, selected-image persistence and all nine container health checks
   passed. No agent-created commit or release publication occurred.

At this stage, complete backups, the previous live nginx HTML and input backups
were retained privately under `/var/backups/myscoutee`; deployment receipts/artifact checks are
also under `~/.local/share/myscoutee-backups/msc126-vmware-20261021`. The previous
HTML backup matters because the former nginx container included writable-layer
frontend patches. Image rollback alone would not recreate those patches.
The SSH forwarding remains active for owner testing. No browser actions or
fresh Lighthouse score are claimed. Reload the page to fetch the new catalog.


## Owned-image follow-up, October 21 — deployed to local VMware

1. [x] **Convert the owned raster illustrations.** Eight Work/Community article
   PNGs: 18,769,818 → 1,756,192 bytes (90.6% smaller). Random-room PNG:
   1,912,453 → 183,266 bytes (90.4% smaller). Removed those nine PNGs and the
   three superseded landing-atlas PNGs. Five compatibility PNGs (PWA icons and
   heart logo), the favicon ICO and SVG assets remain. No external photos were
   downloaded or added; uploaded originals and upload/access policy are untouched.
2. [x] **Preserve standalone and backend modes.** `local` npm and GitHub builds
   include the eight article WebPs. HTTP builds omit that directory. The same
   32 articles in all three Mongo seed sets reference their corresponding MinIO
   illustrations, using the existing small/medium/large WebP layout (128/640/1280
   maximum pixels). Existing seed/i18n generators preserve that mapping. These
   are article data, not fallback images. HTTP-mode offline behavior continues
   to use cached backend URLs; there is no client PNG→WebP URL substitution.
3. [x] **Provide the durable upgrade.** Migration023 updates exact owned-image
   references, including article HTML and URL-keyed image metadata, preserving
   edited text, identities, dates and unrelated URLs. The existing migration
   runner prepares/verifies the 25 replacement objects before Mongo updates;
   it retires only the old system-room PNG with its recorded checksum.
   `package-production.sh` stages its source bytes. The existing partial-data
   helper and `package-partial-release-data.sh` provide the corresponding Netcup
   route; see `packaging/release/README.md`. The API must be stopped for the
   partial update so an old scheduler cannot recreate retired PNG references.
4. [x] **Run focused and artifact checks.** Backend EventScheduler JUnit **37/37**;
   frontend **26/26**; startup-bundle checks **5/5**; media safety tests **9/9**;
   partial-input/API-stop tests **7/7**. Real Mongo migration023 checks passed on
   a disposable database, including HTML/metadata, retry, concurrent edits and
   retained user data. Real MinIO prepare/repeat/retire/repeat checks passed on
   an owned disposable bucket: 25 WebPs, checksums/MIME and retained upload.
   Production, GitHub and standalone npm builds passed; compiled article-image
   inclusion/exclusion and bytes were checked. Full package-content checks passed
   for stable and QA test packages; these deliberately omit managed images and
   are not deployment releases. Content-only seed sync, all 59 classified seed
   baselines and four-language i18n audits passed. No watcher was running or started.
5. [x] **Repair stale package checks found during validation.** The four jobs
   added in `bc302b3c4` were absent from the older test list; their existing
   implementations and media-deletion manual route were checked. The test now
   covers them. Privacy checks now cover all four supported languages, retaining
   runtime contact-token checks. Catalog parity replays migration023 rather than
   modifying historical pinned inputs.
6. [x] **Deploy and check local VMware.** The persistent updater installed the
   matching MinIO, API and nginx images; the DEB identity remains1.4.1, served
   application1.4.4, build `14ec958e08b7-20261021134103`. The existing data helper
   ran the shared chain in both databases: historical steps skipped, migration023
   recorded. A real-runner scope defect in the new023 was corrected before any
   receipt was written; the regression now exercises actual `load`, pinned inputs,
   receipt and retry, alongside the original isolated data/concurrency checks.
   The existing image updater now handles completed older-package history and an
   explicitly stopped API after data migration; **24/24** tests and reproducible
   client-tools packaging passed. No intermediate package installation is needed
   within supported source schemas3–5. Netcup's actual starting package/schema/
   receipts must be read before its later rollout; Netcup remains unchanged.

   Runtime checks: all25 WebP hashes/MIME match; old room PNG and HTTP-bundled
   article asset return404; all 32 Work/Community article records per database
   use MinIO WebP URLs. Public responses cover64 article records across four
   languages and normal/demo modes. All8,743 canonical i18n keys per language
   match in both modes, bundle2026.10.21.1. The HTTPS verifier passed10 checks,
   zero failures, with three custom-port HTTP checks skipped. All nine containers
   are healthy, nginx syntax passes, and the six unrelated container IDs are
   unchanged. All three image selections are persistent.

   MinIO now has1,055 objects:940 WebPs,77 SVGs and38 retained originals; zero
   served PNG objects. The inventory comparison shows25 additions, only the known
   room PNG removed, and zero modifications of retained objects. All38 originals
   retain their prior size/ETag. Guest image IDs:

   - API: `sha256:73371e8eab0acda7040020d8b594b9444776c6b36ad917f8f47b2280272f7e2e`
   - nginx: `sha256:d30851e718de1271593c66ffff8d36a1b6c1fc8eeff01f20c7c18d095145863c`
   - MinIO: `sha256:af04201ace71a67cfefde3862ea9ea5f1b4d477880250638a80bfe5841d27e23`

   Host/guest Docker storage produced different image IDs; the transferred
   archive checksum and storage-independent content/config fingerprints matched
   for all three. Receipts are private under
   `~/.local/share/myscoutee-backups/msc126-vmware-20261021-r2`.

   At the owner's explicit playground-cleanup request,17 unused images and nine
   obsolete backup entries were removed, retaining current/rollback images and
   one verified complete pre-update backup, `myscoutee-backup-20261021-140927.tar.gz`
   (56,491,982bytes). Transferred/extracted temporary release archives were removed
   after installation. No volumes or application data were discarded.
   Final guest root free space is approximately2.5GiB, up from517MiB before
   the owner-authorized cleanup.

   Limits: the all-history synthetic migration-chain attempt did not complete
   (inline fixture heap limit, then Mongo minimum disk floor); it is not a pass.
   The real retained VMware chain and focused023 tests passed. KVM is unavailable
   (no libvirt socket), so KVM runtime verification is not claimed. Full
   `sync-work-seeds.js --check` reports unchanged job/template/member catalogs
   outside image content; the scoped content check passes. Browser-local retained
   seed records are not silently rewritten/reset. Owner manual QA and a fresh
   Lighthouse measurement remain outstanding. No agent commit or publication.
