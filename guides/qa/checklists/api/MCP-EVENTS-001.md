# MCP-EVENTS-001 — OAuth users, subscriptions and bounded delivery

MSC-116 / MSC-119 stable checklist. **NOT RUN.** Source implementation/build results do not
mark these cases PASS. Use the existing fixture and launcher when execution is
authorized; never operate the user's browser as part of documentation work.

## Setup

Use two unrelated accounts, two clients for one account, a base profile and a
group profile, an organized event and an owned asset. Use disposable callbacks
with valid public HTTPS and real certificate validation. The callback must echo
signed verification challenges. Never log credentials, callback secrets/URLs or
personal payloads. Keep HTTP/local settings guide QA in INTEGRATION-ACCESS-001.

## Discovery and OAuth 2.1

1. Register one public DCR client, then authorize it separately as each unrelated
   account using code + S256 PKCE. Each consent shows that user's selected profile;
   code, access/refresh token, connection settings and revocation remain separate.
2. Check resource metadata, issuer, exact redirect URI, resource audience and
   scope. Wrong issuer/resource, mismatched/reused code, wrong verifier, refresh
   reuse, expiry and revoked client fail. Browser logout alone does not revoke an
   independent OAuth grant. Refreshing access tokens preserves a valid subscription.
3. On /mcp/private with MCP-Protocol-Version 2026-07-28, server/discover advertises
   events. events/list returns only permitted definitions. Anonymous /mcp and the
   static API-key stdio package do not advertise background Events.
4. Write and Read return an empty event catalog. Full on both main MCP and client permits
   subscription. Group profiles do not expose base assets. For member profiles, the three names
   are event.changed, event.encounters and asset.changed; each requires resourceId.

## Subscribe, refresh, unsubscribe

1. Subscribe to each owned resource. Verify the signed, random challenge before
   activation; a failed/mismatched/stalled challenge leaves no active subscription.
2. Reject unknown events/arguments, wrong delivery mode, unsafe URLs and signing
   secrets without whsec_ or with decoded sizes outside 24–64 bytes. No raw secret
   may appear in responses, application logs or stored Mongo subscription fields.
3. Repeat identical requests: same ID. Changing only TTL/secret keeps identity;
   a different owner, client, resource or callback has a different ID. Concurrent
   refresh/unsubscribe must not restore stale state; a version conflict is retryable.
4. Verify a cached challenge is scoped to the principal, callback and key, and
   expires after five minutes. Key replacement re-verifies and supplies both old
   and new signatures for two minutes. Restart preserves keys, expiry and state.
5. Default/null TTL receives one day; a shorter positive ttlMs gets no longer than
   requested. No-expiry requests receive a finite grant. Expiry stops delivery;
   resubscription creates a new generation, invalidating old queued work.
6. Unsubscribe twice: both succeed. Another user/client cannot stop this
   subscription. Unsubscribe still works after Full → Write. Secret is cleared.

## Publication, delivery, privacy

1. Trigger the normal app/API mutations for an event/asset the account owns. A
   matching subscription receives the compact summary; other resource IDs and the
   second account receive nothing. Event participation changes share event.changed.
2. Complete the fixture's Mingle event. event.encounters carries revision and
   total only, once per published revision; retrieve pairs with the existing paged
   encounters tool. No personal rating/interest/feedback/ballot write is exposed.
3. Check Standard Webhooks signatures against exact transmitted UTF-8 bytes,
   message ID and timestamp. Headers include X-MCP-Subscription-Id. Retry retains
   eventId/body and changes signing time/signature. User text remains ordinary data.
4. Drop response after receiver acceptance: a bounded retry has the same eventId.
   2xx marks sent; 410 stops the subscription; 413 and other permanent 4xx fail
   without retry. Transient failures use the existing 5s/30s retry schedule.
5. Restart with a claimed delivery: its lease permits recovery after 60s, including
   the configured demo database. This is at-least-once delivery, never exactly once.
6. Revoke the authorizing grant/client, block or downgrade main/client access,
   remove group membership or lose resource ownership after enqueue: no later
   network delivery. Recreating a subscription cannot revive its old generation.
7. Account purge removes Events subscriptions and queued payloads. Retention/TTL
   removes Events deliveries after seven days and expired subscriptions after a
   further seven days. Existing ordinary /watch payloads and policy are unchanged.

## Server load and network boundary

1. Default rate is four outbound callback starts/second, burst four, maximum eight
   concurrent requests per backend process, at most two verifications. Verify
   configured overrides and safety ceilings. Virtual threads retain the existing
   shared delivery-worker semaphore; real/demo context is restored after each task.
2. A rate-blocked queued item remains pending without being claimed/re-written or
   spending retries. A slow endpoint cannot create unbounded waiting threads.
   HTTP response body and total elapsed time are bounded (4096 bytes / 10s).
3. A profile has at most 100 active subscriptions. Admission stops near 1000 pending
   Events deliveries/profile or 10000/database (concurrent publishers may occupy
   already-admitted slots). Source app actions remain usable; overflow records a
   durable gap, reported as truncated on refresh. No replay is claimed.
4. On a controlled DNS endpoint, alternate public/private addresses; verify the
   actual connection resolver blocks loopback, private, link-local, metadata,
   reserved, ULA and mapped IPv4 destinations. Numeric destinations are checked too.
   TLS verifies the original hostname. Redirects and HTTP downgrade are never followed.

## ChatGPT handoff and guide

In a supported Work/Cloud chat, rescan the remote plugin, select an available
event and verify subscribe → callback → chat event → unsubscribe. Repeat with the
second account's own authorization; the publisher's personal connection must not
be reused. Check EN/HU settings guides explain Full, background event summaries,
stopping monitoring in the AI client and revoking the connection. Embedded review
UI and public directory publication remain outside this implementation.

Record exact commits/image ID, executed cases and remaining unproven boundaries
in the matrix. Revoke disposable credentials and restore only test-owned state.

## MSC-119 role Events (NOT RUN)

- Full/Full admin discovers only admin.attention; operator only operator.attention
  (both if actually both roles). Filter resourceId=node; another resource is denied.
- Exercise the existing MSC-118 producers: new node member for both roles;
  report/feedback for admin; new release for operator. Outbox materialization queues
  one compact kind per subscription. Replay of the same outbox item does not create
  a duplicate delivery or reset retry state. Payload has no member IDs or secrets.
- Read the authorized aggregate/paged reports after the signal, without changing
  human unread/viewed state or invoking any mutation. No extra polling worker.
- Revoke role, block owner, lower either pack to Read, revoke grant or expire it
  with a queued delivery: no callback leaves the server. Unsubscribe works after
  Full→Read. Existing throttle/restart/SSRF/signature checks apply equally to roles.
- Host support is verified separately. A paid subscription or successful ordinary
  Claude MCP connection alone is not proof of Events interoperability.
