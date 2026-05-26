# Frontend Slim/Paged Read Upgrade Plan

Last updated: 2026-05-26

## Goal

Adopt optimized backend read contracts from the frontend without changing
user-facing behavior. Another Codex session can take this plan and upgrade the
Angular list screens while preserving full-record calls for detail/editor flows.

## Current Backend Status

- Done: backend event read optimizations are implemented and tested.
- Done: old full-array/full-record contracts still work for existing callers.
- Done: `event explore` optimization is automatic for the paged explore request.
- Done: `event list`, `attending`, `hosting`, `invitations`, `trash`, and
  `filter` require the frontend to opt into the slim/paged path.
- Verified: `./gradlew :projects:profile:test` passes.
- Verified: `node e2e/stress/ramp.mjs --scenario server-events-read --users 4,8`
  after the explore fast path produced 0% errors.
- Metric baseline: at 8 virtual users, event-read p95 is 105ms, p99 is 142ms,
  and throughput is 48.80 req/s.
- Capacity probe: at 32 virtual users, event-read p95 is 173ms with 0% errors
  and 165.63 req/s.
- Current stress follow-up: `server-chats-read` is complete for the current
  backend-only optimization pass.
- Chat baseline before the current backend candidate: at 8 virtual users,
  scenario p95 was 912ms, p99 was 972ms, and throughput was 10.84 req/s.
- Chat backend optimization complete: message reads reuse the loaded message
  list, chat access checks try the indexed owner copy first, chat owner-copy
  repair is cached per user, and message-history serialization caches repeated
  user lookups. This does not require a frontend request or response change.
- Chat metric after backend optimization: at 8 virtual users, chat-read p95 is
  409ms, p99 is 438ms, and throughput is 26.31 req/s.
- Chat capacity probe: at 32 virtual users, chat-read p95 is 414ms with 0%
  errors and 101.45 req/s. The slowest measured step is now websocket connect,
  which includes the test harness' 300ms hold-open.
- Stress follow-up: `server-assets-rates-read` measured healthy through 32
  virtual users, so no backend change was applied there.
- Stress follow-up: `server-event-editor-read` measured healthy through 32
  virtual users after fixing the stress harness to reuse the resolved
  event/subevent per virtual user. No app backend or frontend contract change
  was needed.
- Stress follow-up: `server-admin-content-read` measured healthy through 32
  virtual users, so no backend or frontend change was applied there.
- Done: `server-profile-read` auth/realtime bottleneck is optimized on the
  backend with a short hot-read snapshot cache for activity counters and merged
  impressions. This does not change frontend URLs or DTOs.
- Done: `game/cards-query` capacity bottleneck is optimized on the backend with
  a short hot global game-stack snapshot cache. The active user's rated list is
  still read per request, so card-stack behavior after a swipe is not made
  stale. No frontend URL or DTO change is needed.
- Done: `playground-flow-smoke` mutation flow is clean after making help-center
  revision creation retry version allocation on duplicate-key races. No
  frontend contract change is needed.
- Done: websocket room fanout measured clean through 500 clients and 20 room
  messages. No backend or frontend change was needed.
- Done: admin affinity graph view stress coverage is measured for the iframe's
  real `initialGraph` fan-out (`meta`, `forests`, `tile`) plus lazy forest,
  component tile, and neighborhood loads. The backend/index pass kept existing
  graph DTO contracts and gave a modest p95 improvement, not a 5x-class change.
  The remaining graph opportunity is payload/read-model shaping for tile and
  neighborhood responses.

## Frontend Contract Rules

- Use slim/paged calls for list-card screens.
- Keep full-record calls for detail, editor, checkout, sync, and any screen that
  edits or needs nested records not present on list cards.
- Do not pass `slim=true` to `event explore`; it does not have a slim field.
  Explore uses the optimized path when the request is paged.
- Always send a `limit` for list screens. Use `nextCursor` from the page payload
  when loading more.

## Endpoint Upgrade Matrix

| Screen/API | Frontend request | Optimized response | Status |
| --- | --- | --- | --- |
| Event list | `GET /api/activities/events?userId=...&limit=12&slim=true` | `EventListPageDto` | Backend ready, frontend TODO |
| Attending | `GET /api/activities/events/attending?userId=...&limit=12&slim=true` | `EventListPageDto` | Backend ready, frontend TODO |
| Hosting | `GET /api/activities/events/hosting?userId=...&limit=12&slim=true` | `EventListPageDto` | Backend ready, frontend TODO |
| Invitations | `GET /api/activities/events/invitations?userId=...&limit=12&slim=true` | `EventListPageDto` | Backend ready, frontend TODO |
| Trash | `GET /api/activities/events/trash?userId=...&limit=12&slim=true` | `EventListPageDto` | Backend ready, frontend TODO |
| Event filter | `POST /api/activities/events/filter` with `slim: true`, `limit`, `cursor` | `EventListPageDto` | Backend ready, frontend TODO |
| Event explore | `POST /api/activities/events/explore` with `limit`, `cursor`, `order`, `view` | `EventsExplorePageDto` | Backend ready, verify frontend already paged |
| Chat messages | No frontend change for current backend pass | Existing `ChatMessageDto[]` | Backend optimized/tested |
| Future chat history | Possible future `limit`/`cursor` if long histories remain slow | New paged DTO, not yet designed | Not started |
| Asset explore | No frontend change needed from this pass | Existing `AssetCardDto[]` | Measured healthy |
| Rate page | No frontend change needed from this pass | Existing `ActivityRatePageResponseDto` | Measured healthy |
| Event editor reads | No frontend change needed from this pass | Existing editor DTOs | Measured healthy after harness fix |
| Admin/content reads | No frontend change needed from this pass | Existing admin/content DTOs | Measured healthy |
| Admin affinity graph view | No frontend change needed for the current backend/index pass; screen already uses `meta` + `forests` + `tile` instead of full graph on open | Existing graph DTOs | Measured/optimized modestly; future payload-shaping candidate |
| Profile auth/realtime | No frontend change needed from this pass | Existing auth/realtime DTOs | Backend optimized/tested |
| Game cards | No frontend change needed from this pass | Existing game card page DTO | Backend optimized/tested |

## Expected Response Shapes

Slim list pages return:

```ts
type EventListPageDto = {
  records: EventListItemDto[];
  total: number;
  nextCursor: string | null;
};
```

Explore pages return:

```ts
type EventsExplorePageDto = {
  records: EventRecordDto[];
  total: number;
  nextCursor: string | null;
};
```

Legacy calls without `limit`, `cursor`, or `slim=true` still return the old
arrays. Avoid mixing array assumptions with page-response code.

## Frontend Work Items

- [ ] Inspect `frontend/src/app/shared/core/http/services/events.service.ts` and
  event repository/model types for existing page DTO support.
- [ ] Add or update TypeScript types for `EventListPageDto`,
  `EventListItemDto`, and `EventsExplorePageDto`.
- [ ] Update list-card data loaders to request `limit=12&slim=true`.
- [ ] Wire `nextCursor` into the smart-list load-more path for event list,
  attending, hosting, invitations, and trash.
- [ ] Update event filter body to include `slim: true`, `limit`, and `cursor`
  when rendering list cards.
- [ ] Verify explore already sends `limit`; if not, add `limit`/`cursor` but do
  not add `slim`.
- [ ] Keep detail/editor/open-card actions fetching full event data where needed.
- [ ] Run focused UI e2e for event explore/detail, event editor, and activity
  event list screens.
- [ ] Run `server-events-read` stress after frontend upgrade to confirm the
  deployed frontend path exercises the optimized endpoints.
- [ ] For chat, no frontend change is needed for the current backend-only
  candidate. Only introduce a chat-history page contract later if stress data
  still shows full message history as the dominant bottleneck.

## Backend Files To Reference

- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ActivitiesEventsController.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/ActivitiesEventsService.java`
- `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/data/dto/events/EventsDtos.java`
- `e2e/server/events/event-list/request.json`
- `e2e/server/events/attending/request.json`
- `e2e/server/events/hosting/request.json`
- `e2e/server/events/invitations/request.json`
- `e2e/server/events/trash/request.json`
- `e2e/server/events/event-filter-slim/request.json`
- `e2e/server/events/event-explore/request.json`

## Validation Commands

```bash
cd /home/raxim/workspace/myscoutee-backend/server
./gradlew :projects:profile:test
```

```bash
cd /home/raxim/workspace/myscoutee-backend
node e2e/server/run.mjs --case event-explore --fail-fast
node e2e/stress/ramp.mjs --scenario server-events-read --users 4,8 --duration-ms 30000 --ramp-up-ms 5000 --think-time-ms 100 --think-time-jitter-ms 100
node e2e/server/run.mjs --case chats --fail-fast
node e2e/server/run.mjs --case websocket/chat-connect --fail-fast
node e2e/stress/ramp.mjs --scenario server-chats-read --users 4,8 --duration-ms 30000 --ramp-up-ms 5000 --think-time-ms 100 --think-time-jitter-ms 100
node e2e/server/run.mjs --case affinity-graph --fail-fast
node e2e/stress/run.mjs --scenario server-admin-affinity-graph-view --record
```

## Open Notes For Next Codex Session

- Do not change the backend/frontend contract by forcing slim globally.
- Do not use slim DTOs for editor/detail workflows until each field requirement
  is audited.
- Prefer an adapter in the frontend service layer so components can consume a
  stable page model instead of each component parsing `records/nextCursor`.
- Before stress runs, confirm host CPU is mostly idle and no previous
  `node e2e/stress/*`, Gradle, Java playground, or Docker stack is still
  running.

## Remaining Stress Areas

- [x] Broad read sweep: rerun `server-read-sweep` after the latest event/chat/profile
  optimizations to identify the next focused bottleneck.
- [x] Capacity probe: run `server-capacity-probe` once the broad sweep is clean.
- [x] Game card capacity bottleneck: optimize and rerun the same
  `server-capacity-probe`.
- [x] Playground mutation flow: run `playground-flow-smoke` against disposable
  `playground_db` to cover write-path bottlenecks.
- [x] WebSocket room fanout: run `websocket-room.mjs` to measure chat delivery
  fanout, receive latency, and Redis stream pressure.
- [x] Admin affinity graph view: run `server-admin-affinity-graph-view` for the
  admin graph iframe open path and lazy graph loads.

## Live Stress Log

| Time | Area | Status | Notes |
| --- | --- | --- | --- |
| 2026-05-26 | Events read | Done | Backend optimized; frontend slim/paged adoption remains TODO. |
| 2026-05-26 | Chats read/connect baseline | Done | 8 users: 10.84 req/s, p95 912ms, p99 972ms; worst steps were chat messages and websocket connect. |
| 2026-05-26 | Chats read/connect first candidate | Done | Reusing loaded messages alone was mostly flat: 8 users p95 867ms, p99 939ms, 11.15 req/s. |
| 2026-05-26 | Chats read/connect final backend pass | Done | 8 users: 26.31 req/s, p95 409ms, p99 438ms; 32 users: 101.45 req/s, p95 414ms, 0 errors. |
| 2026-05-26 | Assets/rates read | Done, no change | 8 users: 52.90 req/s, p95 80ms; 32 users: 212.94 req/s, p95 71ms, 0 errors. No 5x-class bottleneck found. |
| 2026-05-26 | Event editor read harness | Done | Fixed e2e requirement resolution for demo subevents and reused the resolved context per virtual user. This changed measurement only, not app contracts. |
| 2026-05-26 | Event editor read | Done, no app change | 8 users: 57.25 req/s, p95 64ms; 32 users: 209.90 req/s, p95 79ms, 0 errors. Subevent resources has warmup p99 spikes but no steady p95 bottleneck. |
| 2026-05-26 | Admin/content read | Done, no change | 8 users: 59.84 req/s, p95 37ms; 32 users: 233.24 req/s, p95 49ms, 0 errors. No 5x-class bottleneck found. |
| 2026-05-26 | Profile read baseline | Done | 8 users: 27.61 req/s, p95 594ms, p99 682ms; bottlenecks were `auth me` p95 657ms and `realtime counters` p95 663ms. |
| 2026-05-26 | Profile read backend cache | Done | 8 users: 62.02 req/s, p95 41ms, p99 211ms; 32 users: 235.96 req/s, p95 58ms, 0 errors. Scenario p95 improved 14.5x. |
| 2026-05-26 | Broad read sweep | Done, clean | 8 users: 54.58 req/s, p95 88ms, p99 141ms, 0 errors. Worst step was `profile/auth-me` p95 198ms from cache-miss spikes. |
| 2026-05-26 | Capacity probe | Done, next bottleneck found | 12 users: 53.39 req/s, p95 399ms, 0 errors. Worst real API step is `game/cards-query` p95 506ms; websocket connect steps include harness hold time. |
| 2026-05-26 | Game cards capacity fix | Done | Same 12-user capacity probe after backend cache: 62.09 req/s, p95 396ms, 0 errors. `game/cards-query` p95 dropped from 506ms to 71ms, a 7.1x improvement. Remaining scenario p95 is websocket connect harness timing. |
| 2026-05-26 | Playground mutation flow | Fixed and done | First 2-user smoke found a concurrent help revision duplicate-key 500. Backend retry fixed it; rerun passed 14/14 with 0 errors. Slowest write flow after fix is event lifecycle p95 1081ms. |
| 2026-05-26 | WebSocket room fanout | Done, clean | 200 clients/10 messages: 100% delivery, receive p95 106ms. 500 clients/20 messages: 100% delivery, receive p95 55ms, complete fanout p95 55ms, no duplicates, Redis write stream stayed at 0. |
| 2026-05-26 | Admin affinity graph view | Done, modest backend/index pass | Baseline: 28.74 req/s, p95 141ms, 0 errors. After duplicate edge-query removal and durable graph indexes: 29.16 req/s, p95 131ms, 0 errors. No frontend contract change; next major candidate is graph payload/read-model shaping. |
