// Product requirements used by the shared load runner.
import { assertDemoUsers, assertAuthMe, assertAssets, assertChats, assertEventList, assertEventPage } from '../../functional/backend/lib/contracts.mjs';
import { createHttpClient } from '@fssrepository/myscoutee-e2e/shared/http.mjs';

export function sessionActors() {
  return [process.env.E2E_ADMIN_USER_ID ?? 'admin-demo-ava', process.env.E2E_DEMO_USER_ID];
}

export function createContext({ baseUrl, mode, runId, vu, nativeSessions }) {
  const ctx = {
    mode,
    http: createHttpClient({
      baseUrl,
      headersForRequest: nativeSessions?.headersForRequest,
      timeoutMs: Number(process.env.E2E_STRESS_HTTP_TIMEOUT_MS ?? process.env.E2E_HTTP_TIMEOUT_MS ?? 15000)
    }),
    defaultMaxMs: Number(process.env.E2E_STRESS_DEFAULT_MAX_MS ?? process.env.E2E_DEFAULT_MAX_MS ?? 5000),
    vars: {
      adminUserId: process.env.E2E_ADMIN_USER_ID ?? 'admin-demo-ava',
      e2eUserId: `${process.env.E2E_USER_ID ?? 'e2e-host'}-${runId}`,
      e2eSecondUserId: `${process.env.E2E_SECOND_USER_ID ?? 'e2e-member'}-${runId}`,
      runId,
      vu: String(vu)
    }
  };
  ctx.resolveRequirement = requirement => resolveRequirement(ctx, requirement);
  return ctx;
}

async function resolveRequirement(ctx, requirement) {
  if (requirement === 'demoUser') {
    if (!ctx.vars.userId) {
      const demoUsersLimit = Number(process.env.E2E_STRESS_DEMO_USERS_LIMIT ?? 64);
      const result = await ctx.http.get('/api/auth/demo-users', {
        params: Number.isFinite(demoUsersLimit) && demoUsersLimit > 0 ? { limit: demoUsersLimit } : undefined,
        headers: demoHeaders()
      });
      assertDemoUsers(result.data, ctx);
      applyPreferredDemoUser(ctx);
    }
    return;
  }
  if (requirement === 'userProfile') {
    await resolveRequirement(ctx, 'demoUser');
    const result = await ctx.http.get('/api/auth/me', {
      params: { userId: ctx.vars.userId },
      headers: demoHeaders()
    });
    assertAuthMe(result.data, ctx);
    return;
  }
  if (requirement === 'event' || requirement === 'subEvent') {
    if (requirement === 'event' && ctx.vars.eventId) {
      return;
    }
    if (requirement === 'subEvent' && ctx.vars.eventId && ctx.vars.subEventId) {
      return;
    }
    await resolveRequirement(ctx, 'demoUser');
    for (const userId of candidateDemoUserIds(ctx)) {
      delete ctx.vars.eventId;
      delete ctx.vars.ownerId;
      delete ctx.vars.subEventId;
      const result = await ctx.http.post('/api/activities/events/explore', {
        headers: demoHeaders(),
        json: { userId, limit: 25 }
      });
      if (Array.isArray(result.data)) {
        assertEventList(result.data, ctx, 'stress event requirement');
      } else {
        assertEventPage(result.data, ctx, 'stress event requirement');
      }
      if (requirement === 'subEvent' && !ctx.vars.subEventId) {
        await rememberEventWithSubEventDefinition(ctx, userId, eventItems(result.data));
      }
      if (ctx.vars.eventId && (requirement !== 'subEvent' || ctx.vars.subEventId)) {
        ctx.vars.userId = userId;
        return;
      }
      if (requirement === 'subEvent') {
        delete ctx.vars.eventId;
        delete ctx.vars.ownerId;
        delete ctx.vars.subEventId;
        const fullList = await ctx.http.get('/api/activities/events', {
          params: { userId, limit: 12 },
          headers: demoHeaders()
        });
        if (Array.isArray(fullList.data)) {
          assertEventList(fullList.data, ctx, 'stress event requirement full list');
        } else {
          assertEventPage(fullList.data, ctx, 'stress event requirement full list');
        }
        if (!ctx.vars.subEventId) {
          await rememberEventWithSubEventDefinition(ctx, userId, eventItems(fullList.data));
        }
        if (ctx.vars.eventId && ctx.vars.subEventId) {
          ctx.vars.userId = userId;
          return;
        }
      }
    }
    throw new Error(requirement === 'subEvent'
      ? 'No subEvent available for stress requirement'
      : 'No event available for stress requirement');
  }
  if (requirement === 'asset') {
    if (ctx.vars.assetId) {
      return;
    }
    await resolveRequirement(ctx, 'demoUser');
    const result = await ctx.http.get('/api/assets', {
      params: { userId: ctx.vars.userId },
      headers: demoHeaders()
    });
    assertAssets(result.data, ctx, 'stress asset requirement');
    return;
  }
  if (requirement === 'chat') {
    if (ctx.vars.chatId) {
      return;
    }
    await resolveRequirement(ctx, 'demoUser');
    for (const userId of candidateDemoUserIds(ctx)) {
      delete ctx.vars.chatId;
      const result = await ctx.http.get('/api/activities/chats', {
        params: { userId },
        headers: demoHeaders()
      });
      assertChats(result.data, ctx, 'stress chat requirement');
      if (ctx.vars.chatId) {
        ctx.vars.userId = userId;
        return;
      }
    }
    throw new Error('No chat was available for stress chat requirement');
  }
  throw new Error(`Unknown stress requirement: ${requirement}`);
}

function eventItems(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return Array.isArray(value?.records) ? value.records : (Array.isArray(value?.items) ? value.items : []);
}

async function rememberEventWithSubEventDefinition(ctx, userId, events) {
  for (const event of events) {
    if (!event?.id) {
      continue;
    }
    const result = await ctx.http.get('/api/activities/events/detail', {
      params: { userId, eventId: event.id },
      headers: demoHeaders()
    });
    const subEvent = Array.isArray(result.data?.subEvents) && result.data.subEvents.length > 0
      ? result.data.subEvents[0]
      : (Array.isArray(result.data?.subEventDefinitions) ? result.data.subEventDefinitions[0] : null);
    if (subEvent?.id) {
      ctx.vars.eventId = event.id;
      ctx.vars.ownerId = event.id;
      ctx.vars.subEventId = subEvent.id;
      return;
    }
  }
}

function preferredDemoUserId() {
  return `${process.env.E2E_STRESS_DEMO_USER_ID ?? process.env.E2E_DEMO_USER_ID ?? ''}`.trim();
}

function activeDemoUser(user) {
  return user && !user.deletedAtIso && user.profileStatus !== 'deleted';
}

function applyPreferredDemoUser(ctx) {
  const preferred = preferredDemoUserId();
  if (!preferred) {
    return;
  }
  const users = Array.isArray(ctx.vars.demoUsers) ? ctx.vars.demoUsers : [];
  const selected = users.find(user => `${user?.id ?? ''}`.trim() === preferred);
  if (!selected) {
    throw new Error(`Preferred demo user ${preferred} was not returned by /api/auth/demo-users; increase E2E_STRESS_DEMO_USERS_LIMIT or choose a seeded demo user`);
  }
  if (!activeDemoUser(selected)) {
    throw new Error(`Preferred demo user ${preferred} is deleted or inactive`);
  }
  const second = users.find(user => activeDemoUser(user) && user.id !== selected.id)
    ?? users.find(user => user.id !== selected.id);
  ctx.vars.userId = selected.id;
  ctx.vars.demoUserId = selected.id;
  ctx.vars.secondUserId = second?.id ?? selected.id;
}

function candidateDemoUserIds(ctx) {
  const users = Array.isArray(ctx.vars.demoUsers) ? ctx.vars.demoUsers : [];
  const envPreferred = preferredDemoUserId();
  return [
    envPreferred,
    ctx.vars.userId,
    ...users
      .filter(user => !user.deletedAtIso && user.profileStatus !== 'deleted')
      .map(user => user.id)
  ].map(value => `${value ?? ''}`.trim()).filter((value, index, values) => value && values.indexOf(value) === index);
}

function demoHeaders() {
  return { 'X-App-Session-Kind': 'demo' };
}
