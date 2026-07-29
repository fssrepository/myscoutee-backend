# Project context

This is the canonical implementation context for work spanning the MyScoutee
deployment repository and the separate Go registry. The fuller trust, MAU,
identity-migration, and exit model is maintained in
`../../myscoutee-registry/plans/project_context.md`; this file records the current
deployment decisions that take precedence over older installer-first sketches.

## Current deployment boundary

- The installer is offline with respect to every registry. It installs the
  application but does not select a registry, initialize a node identity,
  register a deployment, or transmit telemetry.
- An authenticated operator performs a read-only inspection of a chosen
  registry endpoint in the local operator UI. Only explicit confirmation of
  that signed registry identity permits the Java backend to initialize the
  deployment's Ed25519 identity and register it over HTTPS.
- The Java backend owns the deployment private key and all registry traffic.
  The browser never receives that key and never calls the Go registry directly.
- Registry endpoints are deployment data, not hard-coded regions. Demo data may
  offer examples; a production catalog can be empty.
- To move to a genuinely different registry identity, the operator first
  completes a signed unregister/deactivation at the current registry. That
  withdraws the current claim. The Java backend then archives the old binding
  and receipts locally, preserves the node key, and permits explicit
  registration at the new registry. No claim, ledger history, or registry
  identity is migrated implicitly.

## Accounting and claims

- The Go append-only hash-linked ledger is the audit source of truth. Query
  tables are written in the same transaction for efficient cursor-paginated
  reads; leaderboard requests do not rebuild a projection.
- Deployment receipts, claims, virtual operator groups, and eventual global
  identity linking are separate records. Grouping deployments never merges
  their node identities, users, receipts, or histories.
- A pending claim remains visible as a yellow, under-review leaderboard row and
  is excluded from approved-share allocation. The row uses the under-review
  badge instead of an approved percentage.
- On the large operator action tile, the main action remains “Claim share”; only
  its secondary status text changes to “Under review” while approval is
  pending. These two UI rules are complementary.
- Client-code redemption returns every changed canonical leaderboard row,
  removed row identifiers, and the net row-count delta so the shared signal
  store can patch and reorder its cache. It must not invalidate and reload the
  entire leaderboard.

## Scope discipline

- Keep authentication-provider logic behind an interface. Never treat a
  Firebase UID alone as globally meaningful; scoped identity is
  `provider + issuer + subject`.
- Global-human deduplication and Firebase migration remain later milestones.
- Preserve the existing shared/core frontend and Java
  controller/service/mapper/repository patterns. Do not add component-local
  route-delay implementations or repair seed data in application classes.
- Explore demo bootstrap performs its single IndexedDB read up front, carries
  state in memory between steps, and flushes each completed step.
- Branding is deployment-specific where the deployment presents itself to
  users. MyScoutee network support, legal material, guides, moderation, and bug
  reporting remain MyScoutee product/vendor concerns and must use i18n strings
  rather than being silently renamed to the operator brand.

## Roadmaps

- Deployment integration: `plans/OPERATOR_NETWORK_ROADMAP.md`
- Registry protocol and later milestones:
  `../../myscoutee-registry/plans/roadmap.md`
