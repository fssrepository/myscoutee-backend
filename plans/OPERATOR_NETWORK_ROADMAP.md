# Operator network implementation roadmap

This roadmap keeps the installer offline and makes every external relationship an
explicit operator action. It separates what is safe to ship now from MAU
qualification and global-user deduplication, which require their own privacy and
fraud specifications.

## Non-negotiable deployment model

- Installation does not contact a registry and does not create a node identity.
- The authenticated operator chooses or enters a registry URL in the local UI.
- Registry inspection is read-only. Identity creation and registration happen
  only after the operator confirms the selected signed registry identity.
- No geography or company is hard-coded. Any independently deployed compatible
  registry can be selected.
- A deployment can be unregistered, claimed later, or moved only through an
  explicit audited protocol.
- The Java server owns all outbound registry communication. The browser never
  receives a deployment private key or calls a registry directly.
- The Go append-only ledger is the audit source of truth. Query tables are
  written in the same transaction for efficient cursor-paginated reads; they are
  not rebuilt projections on each leaderboard request.

## Phase 1 — signed deployment rail

Status: implemented and under integration validation.

- Operator-selected registry inspection and pinned registry identity.
- Deferred Ed25519 node identity creation.
- Signed deployment registration and stable deployment code.
- Append-only, idempotent zero-count installation receipt.
- Auditable hash-linked ledger and transactionally maintained query tables.
- Optional deployment claim, temporary single-use grouping client tokens, and
  virtual operator groups that preserve each deployment as an independent node.
- Cursor-paginated founder, claimed, and unclaimed leaderboard views.
- Registry-signed announcements and a local, non-HTTP publisher CLI.
- No global user deduplication and no Firebase migration in this phase.

Exit criteria:

- Registration can be retried after interruption without creating another node.
- A browser/server restart can rediscover registration and update state.
- Registry/Java protocol tests cover signatures, replay, cursors, and crash
  boundaries.
- Dev mode exercises the real Java-to-Go path; Explore mode stays browser-local.

## Phase 2 — persisted operator configuration and branding

Status: in progress.

- One deployment configuration record serves both the public brand view and the
  authenticated operator editor.
- Ten supported landing themes:
  `AURORA`, `OCEAN`, `FOREST`, `SUNSET`, `VIOLET`, `ROSE`, `AMBER`, `SLATE`,
  `AQUARIUS`, and `MONOCHROME`.
- Product name, home label, and one uploaded logo stored in MinIO through the
  existing image-carousel/media flow.
- Production payment-provider catalog seeded from the implemented processors;
  the operator selects a provider and stores a write-only credential.
- Firebase credential registration and real capability checks, without silently
  changing the application's Firebase identity model in this phase.
- IndexedDB persistence for Explore and Mongo persistence for authenticated
  deployments. Reopening the popup reloads the stored state under the normal
  route-delay loading indicator.

Exit criteria:

- No secret is returned to the browser after submission or stored in plaintext
  in Mongo.
- Public branding contains no operator/payment/Firebase fields.
- Landing/header branding is resolved centrally rather than hard-coded in
  individual components.

## Phase 3 — reliable signed revenue delivery

Status: in progress.

- Revenue is operator-only. Remove monetary fields from `/admin/stats` and load
  the dedicated revenue view only when the operator opens it.
- Group finalized payments by ISO-4217 currency and store integer minor units
  with that currency's explicit fraction-digit count. Never total or compare
  unlike currencies.
- Count only captured/finalized payment states. Pending or action-required
  sessions are not revenue. Subtract a refund only when its currency exactly
  matches the captured payment currency.
- Keep ticket and asset price projections as local display information. The
  commission basis is finalized net captured revenue only.
- Version the accounting rule as `net-captured-revenue-v1`. The network
  commission rate is 500 basis points, calculated independently per currency as
  `floor(net_minor * 500 / 10000)`.
- Materialize one immutable UTC-day snapshot per deployment. A later refund
  creates the next revision for the original payment day and explicitly
  supersedes the previously accepted batch; accepted history is never edited.
- Persist the exact signed request in a durable Java outbox before attempting
  HTTPS delivery. Retry with stable idempotency until the registry-signed
  receipt is durably stored.
- Send aggregate currency rows only. User IDs, payment IDs, session IDs, raw
  transactions, and customer identifiers never leave the deployment.
- Append each accepted revenue batch to the Go hash-linked ledger and write its
  immutable currency query rows in the same SQLite transaction. Registry reads
  select the latest revision directly from those rows; there is no asynchronous
  projection or repair path.

Exit criteria:

- Java and Go share canonical signing fixtures for payloads and receipts.
- Duplicate delivery, lost responses, Java/Go restarts, corrections, stale
  supersedes links, malformed currencies, and cross-currency refunds are
  covered by tests.
- Registry verification independently checks every revenue query row against
  the authoritative batch and ledger entry.
- An operator can inspect each currency independently and the admin API exposes
  no revenue data.

## Phase 4 — reliable deployment-level MAU delivery

Status: next protocol milestone.

- Freeze the exact QMAU qualification rule and qualifying action vocabulary.
- Compute completed periods locally from authoritative activity records.
- Persist a durable local outbox before any network attempt.
- Submit signed, append-only period batches with stable batch IDs, sequence
  numbers, schema/rule version, and deployment code.
- Retry with exponential backoff and idempotency until a signed registry receipt
  is durably stored.
- Add an operator-visible delivery status and a manual resend button in the node
  or measurement popup, not in Configuration.
- Append the accepted batch to the Go hash-linked ledger and update the
  leaderboard query table in the same SQLite transaction.
- Quarantine conflicting replays; never repair or overwrite accepted history.

Exit criteria:

- Network loss, Java restart, Go restart, duplicate delivery, and out-of-order
  delivery tests prove eventual exactly-once receipt semantics.
- A manual resend cannot create additional weight.
- Six-complete-month weight calculations have fixed fixtures shared by Java and
  Go.

## Phase 5 — privacy-safe global deduplication

Status: deliberately deferred.

Before implementation, select and document a cross-deployment privacy design.
Plain email, Firebase UID, phone, profile IDs, or a registry-wide unsalted hash
must never be sent.

Candidate design work:

- Define the human-account linking and recovery model.
- Evaluate an OPRF/PSI-style deduplication protocol or another independently
  reviewed construction.
- Separate uniqueness evidence from activity/weight evidence.
- Specify key rotation, deletion, collision, shared-device, bot, and account
  merger behavior.
- Obtain privacy, security, and legal review before collecting global linkage
  evidence.

Exit criteria:

- The registry can prove the deduplicated total without reconstructing local
  profiles or exporting raw identifiers.
- Test vectors cover the same person on multiple deployments, key rotation,
  deletion, and malicious replay.

## Phase 6 — fraud, claims, and exit audit

- Record every claim, token issue/redeem/revoke, group change, MAU receipt, and
  eligibility change in the append-only ledger.
- Add anomaly flags without rewriting measured history.
- Separate indicative leaderboard state from legally validated exit eligibility.
- At an exit record date, freeze the ledger checkpoint, buyer review evidence,
  company/person validation, tamper checks, disputes, and final contractual
  allocation.
- Preserve individual deployments beneath an aggregated operator row.

## Phase 7 — registry federation and migration

- Define signed capability discovery for multiple compatible registry operators.
- Define an explicit prepare/confirm migration protocol; never silently register
  from the installer.
- Export/import signed deployment history with both registry identities and
  immutable audit references.
- Define parent-registry settlement separately from node enrollment so regional
  or partner infrastructure is reusable by other products.
- Test split connectivity and independently hosted registries without
  geography-specific branches.

## Phase 8 — signed update channel

- Registry-signed announcement and release manifest.
- Operator reviews the verified URL/version and explicitly approves.
- Java downloads and verifies; a narrow root worker installs only the verified
  local Debian artifact.
- Durable progress survives browser/API restarts.
- Host input/output paths are privilege-separated, crash-reconciled, bounded,
  and auditable.
- Completion requires the expected package and container versions plus healthy
  Java and nginx services.

## Phase 9 — production qualification

- Protocol compatibility matrix for Java, Go, frontend, package, and schema
  versions.
- Restore/upgrade tests from the oldest supported package.
- TLS-only production registry with certificate renewal and backup drills.
- Load tests for MAU ingestion and cursor leaderboard reads.
- Security review of secret storage, update boundary, registry federation, and
  global deduplication.
- Operator documentation for registration, provider/Firebase setup,
  announcements, updates, backup/restore, migration, and exit evidence.
