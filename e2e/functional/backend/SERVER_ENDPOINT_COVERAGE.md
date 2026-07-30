# Server E2E Coverage

The server suite is a Postman-like collection rooted at `e2e/functional/backend`.
Each case is independently runnable and keeps its request, response contract,
and assertion script together:

```text
request.json
response.json
*.mjs
```

## Read-Only Contracts

Default command:

```bash
NODE_EXTRA_CA_CERTS=/tmp/myscoutee-e2e-nginx-ca.pem \
E2E_SERVER_BASE_URL=https://127.0.0.1 node e2e/functional/backend/run.mjs
```

Copy the current container certificate as described in `e2e/README.md` before
running this command.

Covered groups:

- `health`: nginx shell and Spring health routing.
- `profile`: demo users, `auth/me`, experiences, eligibility, realtime.
- `content`: landing, i18n, help, privacy, explanation, privacy consent lookup.
- `game`: card query used by the home/profile game.
- `rates`: rate list and smart-list page.
- `events`: list, invitations, attending, hosting, trash, filter, explore, feedback, received feedback.
- `assets`: owned assets, explore picker, tickets.
- `chats`: list, page, messages.
- `websocket`: chat and admin notification websocket connects.
- `event-editor`: members, member summaries, invite candidates, subevent resources, leaderboard.
- `admin`: dashboard, stats, monitoring, params, notifications, notification runtime, help, privacy, explanation, ideas.
- `operator`: controller-wide operator authorization, bootstrap/request/query validation, registry status, deployment and managed TLS configuration with secret redaction, community providers, local revenue invariants, update overview, and demo-isolated Firebase capability tests.
- `media`: collected local image URLs from prior API responses are reachable.

Latest local validation:

```text
server e2e: 49 passed, 0 failed, 0 skipped, 49 selected
```

This is a historical execution result. The current authored inventory is 77
safe contracts; 14 of those are the operator cases authored for the later run.

## E2E Mutation Flows

Default command:

```bash
NODE_EXTRA_CA_CERTS=/tmp/myscoutee-e2e-nginx-ca.pem \
E2E_SERVER_BASE_URL=https://127.0.0.1 \
E2E_SERVER_MODE=stress \
node e2e/functional/backend/run.mjs --group flows --include-mutations
```

These reset and seed `e2e_db`, not `demo_db`.

Covered flows:

- Event lifecycle: sync draft, publish, unpublish, trash, restore.
- Asset lifecycle: upsert, list, delete, restore.
- Profile state: preferences, experiences, user rates, feedback, logout, delete.
- Share token: seed asset, create token, resolve token.
- Chat lifecycle: send, edit, pin, react, update attachments, device upsert/delete, delete message.
- Help revision: create explanation revision and delete it.
- Event participation: publish ticketed event, join as accepted member, submit feedback, note, remove, restore.
- Operator pre-registration guards: dormant QMAU/revenue synchronization, report/network/update/Firebase fail-closed behavior, request-identifier redaction, partial registration rejection, and no implicit registration.
- Operator configuration lifecycle: save/reload, admin/social normalization, managed branding, public projection, payment routing and credential retention, Stripe/Barion validation, write-only credential masking, provider-switch cleanup, and semantic restore.
- Operator registry selection: inspect, reject endpoint/scope/URL-shape mismatch, normalize root URLs, invalidate stale tokens, require single-use confirmation and explicit registration, and idempotently disconnect an unregistered selection.

Latest local validation:

```text
server e2e: 7 passed, 0 failed, 0 skipped, 7 selected
```

This is a historical execution result. The current authored inventory is 14
mutation cases; 3 of those are the operator state-machine flows authored for
the later run.

## Stress Scenarios

Default command:

```bash
node e2e/stress/backend/run.mjs --scenario <scenario-name>
```

Validated scenarios:

- `server-contract-smoke`: 20 requests, 0 failures.
- `websocket-smoke`: 18 websocket connects, 0 failures.
- `e2e-flow-smoke`: 14 mutation flow steps, 0 failures.
- `server-read-sweep`: 765 requests over the short read sweep, 0 failures.
- `server-event-feedback-list`: focused read pressure for event feedback first load.

`server-capacity-probe` is intentionally opt-in. It runs 12 virtual users for
two minutes and should be started only when a hard local load probe is wanted.

## Intentional Non-Default Cases

- Payment execution is not run by default because local compose has
  `PAYMENT_ENABLE_PAY=false`.
- Multipart media upload is not in the default server suite yet;
  media reachability is covered through collected image URLs.
- Hard destructive admin moderation actions are not in the read-only contract
  run. E2E admin/content mutations are covered by the help revision flow.
- Operator registration, claims, deployment deactivation/reactivation, and
  package installation are not run by this collection because the current
  compose topology persists the Go registry and host update state separately
  from `e2e_db`. Signed Java-to-Go registration, report delivery,
  idempotency, restart, and tamper checks are covered by
  `../myscoutee-registry/scripts/qualify-java-rails.sh`.

## Authored Operator Cases

The operator additions are intentionally not included in the historical
validation counts above until the full stack is run later. Their collection
definitions and assertion modules have been syntax-checked only.

The safe `operator` group includes controller-wide access checks, bootstrap
boundary and secret redaction, request binding validation, settlement query
validation, Firebase request validation without Firebase configuration
mutation, managed TLS availability and write-only certificate boundaries,
configuration/registry/community/revenue/update projections, and revenue
aggregation invariants. The opt-in `flows/operator` collection adds the three
mutation state-machine scenarios listed above.
