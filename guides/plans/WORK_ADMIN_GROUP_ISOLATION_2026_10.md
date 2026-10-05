# Work administration and Campaign integration

Implementation checkpoint: 5 October 2026. Browser pair QA has not run for this
correction. Community remains outside this delivery.

## Administrative scope

The existing selector chooses Dating or Work. Menus and popup structure stay
unchanged. Jobs, parameters, content revisions, statistics, graph snapshots,
moderation/support cases and badge queries use the selected base group.

Each applicable job has a separate seeded row per base group. Configuration,
schedule, execution claim, pending count, runtime, history, queue selection,
Redis wakeups/telemetry and live updates carry that scope. Missing seed means
no execution. Work does not receive a random-room-generation seed. Identical
algorithms are reused, with separate state; Work does not modify the Dating
matching algorithm.

The group boundary is resolved from stored ownership. Background processing
includes workspaces of the corresponding type. Base-profile statistics exclude
independent-workspace member activity; job summaries describe the base group's
job instance. Separate workspace statistics remain a future feature.

## Job inventory

`D + W` means two independent seeded instances, not one global job. All three
Mongo fixture sets contain 23 Dating and 22 Work rows. The local catalog uses
the same Work allowlist and background-job definitions.

| Job key | Instances | Data boundary / behavior |
| --- | --- | --- |
| `event-random-groups` | D only | Existing Dating random room generation |
| `event-auto-inviter` | D + W | Own events, matching and campaign selection |
| `event-tournament-review` | D + W | Own tournament events |
| `event-counter-expiry` | D + W | Own event counters and following records |
| `event-checkout-basket-purge` | D + W | Basket owner; scope before batch limit |
| `event-mingle-advance` | D + W | Mingle session's event ownership |
| `event-watchlist` | D + W | Subscription's event ownership |
| `event-cancellation` | D + W | Own events and payer profiles |
| `notification-outbox` | D + W | Recipients partitioned before account mapping; scoped durable rows and wakeups |
| `payment-method-expiry` | D + W | Profile ownership before batch limit |
| `affinity-recompute` | D + W | Target ownership, durable tasks, timers, metrics and parameters |
| `affinity-graph-layout` | D + W | Separate graph snapshot/layout |
| `scheduled-messages` | D + W | Stored task ownership and executor context |
| `account-purge` | D + W | Deleted profile and durable purge ownership |
| `content-auto-approve` | D + W | Own moderation queue and settings |
| `account-deletion-warning` | D + W | Own profiles and warning claims |
| `payment-exchange-rates` | D + W | Own job, cache and immutable observations |
| `affiliate-revenue` | D + W | Payer ownership before batch limit |
| `integration-encounters` | D + W | Completed session's event ownership |
| `integration-webhooks` | D + W | Token/profile ownership; preserved executor context |
| `promotional-email-planning` | D + W | Own rules, templates, audience and runtime |
| `promotional-email-delivery` | D + W | Scoped email outbox |
| `admin-telemetry` | D + W | Own stream, cursor, statistics, monitoring and counters |

Operator reporting and deployment configuration remain operator-owned.
Translation/app-settings cache refresh is infrastructure, not an app-admin
business job. Shared polling threads do not provide shared execution claims or
shared group data. The existing schedule is checked for each seeded instance.

## Local and content behavior

- Local job catalogs and histories persist in separate IndexedDB scopes.
  Reseeding adds missing catalog entries without replacing saved settings.
- Local content approval, checkout cleanup and graph/statistics refresh use the
  selected instance's schedule. Runtime changes update its job badge and the
  workspace selector aggregate. Background services requiring external delivery
  remain backend processes; the local UI does not send real email or push.
- Local graph generation reuses the existing seed graph builder in its source
  repository. A job refreshes stored group snapshots; opening the statistics
  popup reads them. Graph health/insight uses the backend's thresholds instead
  of a permanent `cold` placeholder. Record timestamps provide chart history;
  previously computed graph days are retained. Local records are not a replay
  of the backend Redis telemetry stream.
- Help, Terms, Privacy and public explanations have separate Work revisions and
  history. Mutations cannot target another group's revision. The public landing
  routes carry the existing group selection; changing context invalidates old
  content and stale async results cannot replace the newly selected state.
- Work content and job fixtures are synchronized from the frontend canonical
  seed files into real/demo/e2e Mongo fixtures. Scoped unique indexes replace
  obsolete global key indexes before importing scoped records.

## Payment test tools

Work app admins are authorized through their stored account/profile relationship,
not a profile-ID prefix. Switching profiles reloads the embedded test surface.
The backend sends an explicit allowlist of selected base-profile IDs and payment
references to the simulator's existing authorization-access route. The simulator
filters pending Stripe, Barion and card-registration approvals server-side.
An authorization-only ticket cannot open provider configuration.

Provider selection, provider credentials and the simulator's general 3DS setting
remain deployment configuration. This change scopes payment approval data; it
does not introduce a separate payment provider per group. Authorization grants
use the existing short lifetime. A newly created Barion payment requires reopening
the approval surface if it was created after that grant's reference snapshot.

## Campaign API / MCP

Campaign is its own domain and persistence model. External creation reuses the
existing integration authentication, UUID mapping, batch response, image upload
and ownership checks:

- `POST /integrations/v1/campaigns` accepts JSON or the existing multipart pattern.
- The authenticated profile must be an accepted member of a Work workspace.
- Creation produces a draft owned by that profile. Publish/edit through the app.
- Repeating the caller's item UUID returns the existing Campaign mapping.
- The Java client/CLI expose `createCampaigns` / `campaigns`.
- MCP advertises `createCampaigns` only when the connection's API capabilities
  include it. A prompt or group ID cannot retarget an existing connection.
- No Campaign listing, external publishing or additional external product
  function was added. Listing remains a user decision.

Registry requires no change. The payment simulator changed only for the concrete
approval-filtering contract above. Client and MCP changes implement Campaign
creation, not a general group protocol redesign.

## Evidence

- Backend combined regression run: **165 tests passed** across 26 suites,
  including a real embedded-Mongo check that group filtering precedes batch limits,
  scheduled-message integration, Campaign creation/retry, job claims, notification
  partitioning, content isolation, event workers and affinity execution context.
- Frontend focused checks: **14 tests passed**, including Work save/reload/reseed,
  graph/statistics job scope, help revision isolation, support scope and selector
  badge updates. `npm run build:local` passed.
- Final admin/controller checks: **6 tests passed**, including Work payment
  approval scope and exclusion of independent-workspace activity from base statistics.
- Java client `./gradlew test`: **11 tests passed**.
- MCP `go test ./...` passed; the generated contract check matches all seven
  external operations, including Campaign creation. The test covers discovery,
  denial for a Dating connection and an authenticated Work write.
- Payment simulator `go test ./...` passed, including scope filtering and denial
  of provider configuration through an authorization-only grant.
- Seed synchronization check, scoped-key uniqueness audit and shell syntax check
  passed.

No live development database was reseeded. No browser checklist was executed.
Embedded test Mongo instances were created and stopped by the existing test
harness. Deployment/startup with existing production data, real Redis delivery,
and browser interactions still require the normal runtime/pair-QA checkpoint.

## Review branches

- Backend and frontend: `plan/multi-group-product-experiment`.
- Java client and MCP: `feat/work-campaign-create`.
- Payment simulator: `fix/group-admin-authorizations`.
- Tracking: [MSC-115](https://github.com/fssrepository/myscoutee-roadmap/issues/153).

Deploy the simulator authorization-scope support with the backend change; an
older simulator does not enforce the new allowlist. Branch publication is not a
production deployment or a browser-QA sign-off.
