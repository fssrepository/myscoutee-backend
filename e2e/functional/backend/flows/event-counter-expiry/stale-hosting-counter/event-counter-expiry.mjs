import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { assert, expectObject } from '../../../../../shared/assertions.mjs';
import { assertAuthMe, assertEvent } from '../../../lib/contracts.mjs';

const execFileAsync = promisify(execFile);

export async function assertResponse({ ctx, result, request }) {
  const host = assertAuthMe(result.data, ctx);
  const hostUserId = request.body.id;
  assert(host.id === hostUserId, 'profile save should return the counter host', {
    expected: hostUserId,
    actual: host.id
  });

  await setUserActivities(hostUserId, { hosting: 1 });
  const stale = await queryUser(ctx, request.headers, hostUserId);
  assert(counterValue(stale, 'hosting') === 1, 'test setup should expose the stale hosting counter before event expiry', stale.activities);

  const eventId = `e2e-counter-expiry-${ctx.vars.runId}`;
  const now = Date.now();
  const created = await ctx.http.post('/api/activities/events/sync', {
    headers: request.headers,
    json: eventPayload({
      eventId,
      hostUserId,
      startAtIso: new Date(now - 7_200_000).toISOString(),
      endAtIso: new Date(now - 3_600_000).toISOString()
    }),
    expectedStatus: 200,
    timeoutMs: 15000
  });
  const event = assertEvent(created.data, 'counter expiry past event');
  assert(event.id === eventId, 'created past event should use the e2e source id', {
    expected: eventId,
    actual: event.id
  });

  const refreshed = await waitForCounter(ctx, request.headers, hostUserId, 'hosting', 0);
  assert(counterValue(refreshed, 'hosting') === 0, 'expired past event should be removed from the host counter', refreshed.activities);
}

function eventPayload({ eventId, hostUserId, startAtIso, endAtIso }) {
  return {
    syncKey: eventId,
    id: eventId,
    target: 'hosting',
    title: 'E2E Expired Counter Event',
    shortDescription: 'Past event used to verify scheduled counter expiry.',
    timeframe: 'Already finished',
    activity: 5,
    isAdmin: false,
    startAt: startAtIso,
    endAt: endAtIso,
    distanceKm: 1.2,
    imageUrl: '',
    acceptedMembers: 1,
    pendingMembers: 0,
    capacityTotal: 8,
    capacityMin: 2,
    capacityMax: 8,
    autoInviter: false,
    frequency: 'One-time',
    ticketing: false,
    slotsEnabled: false,
    eventType: 'meetup',
    visibility: 'Public',
    blindMode: 'Open Event',
    published: true,
    creatorUserId: hostUserId,
    creatorName: 'E2E Counter Host',
    creatorInitials: 'EC',
    creatorGender: 'man',
    creatorCity: 'Bratislava',
    location: 'Bratislava',
    locationCoordinates: {
      latitude: 48.1486,
      longitude: 17.1077
    },
    topics: ['e2e', 'counter-expiry'],
    subEvents: [],
    subEventsDisplayMode: 'list'
  };
}

async function waitForCounter(ctx, headers, userId, key, expectedValue) {
  const deadline = Date.now() + Number(process.env.E2E_COUNTER_EXPIRY_WAIT_MS ?? 30000);
  let lastUser = null;
  while (Date.now() <= deadline) {
    lastUser = await queryUser(ctx, headers, userId);
    if (counterValue(lastUser, key) === expectedValue) {
      return lastUser;
    }
    await sleep(1000);
  }
  assert(false, `counter ${key} should become ${expectedValue} before timeout`, {
    userId,
    activities: lastUser?.activities
  });
}

async function queryUser(ctx, headers, userId) {
  const response = await ctx.http.get('/api/auth/me', {
    headers,
    params: { userId },
    expectedStatus: 200,
    timeoutMs: 10000
  });
  return assertAuthMe(response.data, ctx);
}

function counterValue(user, key) {
  const activities = expectObject(user.activities ?? {}, `auth/me.activities`);
  return Number(activities[key] ?? 0);
}

async function setUserActivities(userId, overrides) {
  const dbName = process.env.E2E_DATABASE
    ?? process.env.MONGO_E2E_DATABASE
    ?? 'e2e_db';
  const activities = {
    game: 0,
    chat: 0,
    invitations: 0,
    events: 0,
    hosting: 0,
    cars: 0,
    accommodation: 0,
    supplies: 0,
    tickets: 0,
    contacts: 0,
    feedback: 0,
    adminJobs: 0,
    adminMetrics: 0,
    ...overrides
  };
  const evalScript = [
    `const result = db.users.updateOne({ userId: ${JSON.stringify(userId)} }, { $set: { activities: ${JSON.stringify(activities)} } });`,
    'if (result.matchedCount !== 1) { throw new Error("Expected one user document to update, matched " + result.matchedCount); }'
  ].join('\n');
  await execFileAsync('docker', [
    'exec',
    process.env.E2E_MONGO_CONTAINER ?? 'mongodb',
    'mongosh',
    '--username',
    process.env.E2E_MONGO_USERNAME ?? process.env.MONGO_APP_USERNAME ?? 'guest',
    '--password',
    process.env.E2E_MONGO_PASSWORD ?? process.env.MONGO_APP_PASSWORD ?? 'guest',
    '--authenticationDatabase',
    dbName,
    '--quiet',
    dbName,
    '--eval',
    evalScript
  ], {
    timeout: Number(process.env.E2E_COUNTER_EXPIRY_MONGO_TIMEOUT_MS ?? 15000),
    maxBuffer: 1024 * 1024
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
