import { assert, expectArray, expectObject } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { queryE2eMongo } from '../../../lib/e2e-fixtures.mjs';

export async function assertResponse({ ctx, result, request }) {
  assertLogin(result.data, {
    accepted: true,
    existingSession: false,
    outcome: 'ACCEPTED',
    activeSessionCount: 1
  }, 'client A login');

  const replayA = await login(ctx, request, ctx.vars.sessionAId, ctx.vars.sessionAttemptAId, 200);
  assertLogin(replayA.data, {
    accepted: true,
    existingSession: true,
    outcome: 'ACCEPTED',
    activeSessionCount: 1
  }, 'client A idempotent replay');

  const clientB = await login(ctx, request, ctx.vars.sessionBId, ctx.vars.sessionAttemptBId, 200);
  assertLogin(clientB.data, {
    accepted: true,
    existingSession: false,
    outcome: 'ACCEPTED',
    activeSessionCount: 2
  }, 'client B login');

  const blockedC = await login(
    ctx,
    request,
    ctx.vars.sessionCId,
    ctx.vars.sessionAttemptCBlockedId,
    409
  );
  assertLogin(blockedC.data, {
    accepted: false,
    existingSession: false,
    outcome: 'BLOCKED_LIMIT',
    activeSessionCount: 2
  }, 'client C blocked login');

  await assertSessionUsable(ctx, request, ctx.vars.sessionAId);
  await assertSessionUsable(ctx, request, ctx.vars.sessionBId);
  await assertPersistedSessionContract(ctx, { expectedAuditOutcomes: ['ACCEPTED', 'ACCEPTED', 'BLOCKED_LIMIT'], expectedSessions: [ctx.vars.sessionAId, ctx.vars.sessionBId], expectedNotifications: 2 });

  const logoutA = await ctx.http.post('/api/auth/me/logout', {
    headers: sessionHeaders(request, ctx.vars.sessionAId),
    json: { userId: ctx.vars.sessionUserId },
    expectedStatus: 200
  });
  assert(logoutA.data?.submitted === true, 'client A logout should revoke its exact slot', logoutA.data);

  const admittedC = await login(
    ctx,
    request,
    ctx.vars.sessionCId,
    ctx.vars.sessionAttemptCAcceptedId,
    200
  );
  assertLogin(admittedC.data, {
    accepted: true,
    existingSession: false,
    outcome: 'ACCEPTED',
    activeSessionCount: 2
  }, 'client C admitted login');

  await assertSessionUsable(ctx, request, ctx.vars.sessionBId);
  await assertSessionUsable(ctx, request, ctx.vars.sessionCId);
  await assertPersistedSessionContract(ctx, {
    expectedAuditOutcomes: ['ACCEPTED', 'ACCEPTED', 'BLOCKED_LIMIT', 'ACCEPTED'],
    expectedSessions: [ctx.vars.sessionBId, ctx.vars.sessionCId],
    expectedNotifications: 3
  });
}

async function login(ctx, request, sessionId, attemptId, expectedStatus) {
  return ctx.http.post(request.path, {
    headers: sessionHeaders(request, sessionId),
    json: { attemptId, provider: 'demo' },
    expectedStatus
  });
}

async function assertSessionUsable(ctx, request, sessionId) {
  const response = await ctx.http.get('/api/auth/me', {
    headers: sessionHeaders(request, sessionId),
    params: { userId: ctx.vars.sessionUserId },
    expectedStatus: 200
  });
  assert(response.data?.id === ctx.vars.sessionUserId, 'accepted session should remain usable', response.data);
}

async function assertPersistedSessionContract(ctx, expected) {
  const deadline = Date.now() + Number(process.env.E2E_SESSION_NOTIFICATION_WAIT_MS ?? 10000);
  let snapshot;
  do {
    snapshot = await sessionSnapshot(ctx);
    if (snapshot.notifications.length === expected.expectedNotifications) {
      break;
    }
    await sleep(200);
  } while (Date.now() <= deadline);

  const state = expectObject(snapshot.state, 'persisted session state');
  const activeSessions = expectArray(state.activeSessions, 'persisted active sessions');
  assert(
    JSON.stringify(activeSessions.map(item => item.sessionId).sort())
      === JSON.stringify([...expected.expectedSessions].sort()),
    'active sessions should match the exact admitted slots',
    activeSessions
  );
  const audits = expectArray(snapshot.audits, 'persisted login audits');
  assert(
    JSON.stringify(audits.map(item => item.outcome)) === JSON.stringify(expected.expectedAuditOutcomes),
    'login audit outcomes should preserve attempt order',
    audits
  );
  assert(
    new Set(audits.map(item => item.attemptId)).size === audits.length,
    'idempotent login replay must not create a duplicate audit row',
    audits
  );
  const notifications = expectArray(snapshot.notifications, 'persisted security notifications');
  assert(
    notifications.length === expected.expectedNotifications,
    'security warning cardinality should match second, blocked and admitted logins',
    notifications
  );
  const allSessionIds = [ctx.vars.sessionAId, ctx.vars.sessionBId, ctx.vars.sessionCId];
  for (const notification of notifications) {
    const serialized = JSON.stringify(notification);
    assert(notification.kind === 'security-login', 'session warning should use security-login kind', notification);
    assert(
      !allSessionIds.some(sessionId => serialized.includes(sessionId)),
      'security notification must not expose any current or revoked session id',
      notification
    );
    assert(!serialized.includes('Mozilla/5.0'), 'security notification must not expose the raw user agent', notification);
  }
}

async function sessionSnapshot(ctx) {
  const userId = JSON.stringify(ctx.vars.sessionUserId);
  return queryE2eMongo(ctx, `({
    state: db.userSessionStates.findOne({ _id: ${userId} }),
    audits: db.userLoginAudits.find({ userId: ${userId} }).sort({ attemptedAtIso: 1, _id: 1 }).toArray(),
    notifications: db.userNotifications.find({ recipientUserId: ${userId}, kind: 'security-login' }).sort({ createdDate: 1, _id: 1 }).toArray()
  })`);
}

function assertLogin(value, expected, path) {
  const response = expectObject(value, path);
  for (const [key, expectedValue] of Object.entries(expected)) {
    assert(response[key] === expectedValue, `${path}.${key} should be ${expectedValue}`, response);
  }
  assert(response.maxActiveSessions === 2, `${path}.maxActiveSessions should be 2`, response);
}

function sessionHeaders(request, sessionId) {
  return {
    ...request.headers,
    'X-App-Session-Id': sessionId
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
