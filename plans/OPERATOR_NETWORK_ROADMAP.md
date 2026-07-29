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
- Moving to another endpoint is never a URL rewrite: the current registry must
  first return a verified signed deployment-deactivation receipt, which
  withdraws the deployment from its claim/group. Java then archives the old
  signed local state and receipts, clears only the active registry binding, and
  preserves the deployment key pair. A later Register action creates a fresh
  enrollment at the newly inspected signed registry.
- Disconnect does not copy ledger, claim, share, or receipt history into the new
  registry. Cross-registry history transfer requires the separate signed
  migration protocol in Phase 7.
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
- Signed, fail-closed deployment disconnect: central deactivation and claim
  withdrawal are confirmed before the active local binding is archived/reset.
- Cursor-paginated founder, claimed, and unclaimed leaderboard views.
- Pending claims remain visible as yellow rows with an `Under review` marker
  and retain their measured percentage badge for transparency. That
  percentage is indicative only and is excluded from approved-share
  allocation until approval. Independently, the large workspace action keeps
  `Claim share` as its primary label and changes only its secondary status to
  `Under review`.
- Registration, claim, deactivation, and client-code responses carry targeted
  canonical leaderboard upserts, removals, and a net row-count delta so the
  shared signal store patches and reorders cached rows without reloading the
  complete list.
- Registry-signed announcements and a local, non-HTTP publisher CLI.
- No global user deduplication and no Firebase migration in this phase.

Exit criteria:

- Registration can be retried after interruption without creating another node.
- A browser/server restart can rediscover registration and update state.
- Registry/Java protocol tests cover signatures, replay, cursors, and crash
  boundaries.
- Every backend-connected development, E2E, and production Explore session
  exercises the real Java-to-Go path against a dedicated seeded demo registry.
  Production uses the stripped production Go image, an internal-only service,
  and isolated demo SQLite/signing/client-state volumes. The real
  operator-selected registry remains external and unseeded. Browser-local
  Explore is retained only as an explicit local/offline fallback.

## Phase 2 — persisted operator configuration and branding

Status: implemented at the deployment/API boundary. Remaining PWA/offline
presentation cleanup is tracked separately from the persisted configuration
model.

- One deployment configuration record serves both the public brand view and the
  authenticated operator editor.
- Ten supported landing themes:
  `AURORA`, `OCEAN`, `FOREST`, `SUNSET`, `VIOLET`, `ROSE`, `AMBER`, `SLATE`,
  `AQUARIUS`, and `MONOCHROME`.
- Product name and one uploaded logo stored in MinIO through the existing
  image-carousel/media flow. The landing eyebrow remains localized product
  copy, not a hidden operator-editable branding field.
- Production payment-provider catalog seeded from the implemented processors;
  the operator selects a provider and stores a write-only credential.
- Firebase public browser configuration plus separate write-only authentication
  and messaging service-account credentials. Saving creates a new inactive
  revision; both real capability checks must attest that exact revision before
  a distinct Operator action can activate it. Runtime token verification and
  notification delivery then use the encrypted active deployment revision,
  while the deployment-local bootstrap recovery login remains available.
- Community-provider links are deployment-owned Mongo catalog data. Explore and
  `demo_db` may seed Discord/Discourse examples, while a production deployment
  may intentionally expose an empty provider list; signed announcements still
  come from the selected registry.
- Mongo persistence for every backend-connected Explore or authenticated
  deployment; IndexedDB persistence exists only in the explicit local/offline
  adapter. Reopening the popup reloads the stored state under the normal
  route-delay loading indicator.

Exit criteria:

- No secret is returned to the browser after submission or stored in plaintext
  in Mongo.
- Public branding contains no operator/payment/Firebase fields.
- Landing/header branding is resolved centrally rather than hard-coded in
  individual components.

## Phase 3 — reliable signed revenue delivery

Status: implemented. Exact release-artifact Java-to-Go delivery, interruption,
restart, and correction drills remain part of Phase 9 production qualification.

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

Status: implemented. The `qmau-v1` local evidence calculator, immutable Mongo
outbox, signed revision/supersession protocol, registry receipt verification,
same-transaction Go ledger/query/Merkle writes, operator status, and manual
requeue path are present. Exact release-artifact Java-to-Go restart and lost
response drills remain part of Phase 9 production qualification.

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

Status: the signed claim, independent review, client-code grouping,
deactivation/withdrawal, immutable audit, direct query-state verification, and
indicative share foundation are implemented. The registry-local anomaly/case
rail also supports signed, hash-linked flag/clear events and
same-transaction query rows without changing eligibility. Rejection,
suspension, reinstatement, disputes, ownership transfer, evidence policy, exit
record-date freezing, buyer/auditor decisions, and final legal allocation
remain open. Contract-dependent payout and valuation rules are deliberately
not inferred.

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

Status: implemented at the package/control-plane boundary. Release-artifact,
oldest-supported-version, interruption, restore, and host-operational drills
remain part of Phase 9 production qualification.

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

Status: open. Unit and integration coverage exists, but the complete
release-artifact compatibility matrix and operational drill set is not yet a
release sign-off.

- Protocol compatibility matrix for Java, Go, frontend, package, and schema
  versions.
- Restore/upgrade tests from the oldest supported package.
- TLS-only production registry with certificate renewal and backup drills.
- Load tests for MAU ingestion and cursor leaderboard reads.
- Security review of secret storage, update boundary, registry federation, and
  global deduplication.
- Operator documentation for registration, provider/Firebase setup,
  announcements, updates, backup/restore, migration, and exit evidence.
