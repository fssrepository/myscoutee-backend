#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHttpClient } from '../shared/http.mjs';
import { parseCommonArgs, runCollection } from '../shared/collection-runner.mjs';
import {
  assertAssets,
  assertAuthMe,
  assertChats,
  assertDemoUsers,
  assertEventList,
  assertEventPage,
  rememberFirstEvent
} from './lib/contracts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = parseCommonArgs(process.argv.slice(2));
const baseUrl = process.env.E2E_SERVER_BASE_URL ?? 'http://localhost';
const mode = process.env.E2E_SERVER_MODE ?? 'contract';

const ctx = {
  http: createHttpClient({
    baseUrl,
    timeoutMs: Number(process.env.E2E_HTTP_TIMEOUT_MS ?? 15000)
  }),
  mode,
  vars: {
    adminUserId: process.env.E2E_ADMIN_USER_ID ?? 'myscoutee@gmail.com',
    playgroundUserId: process.env.E2E_PLAYGROUND_USER_ID ?? 'e2e-host',
    playgroundSecondUserId: process.env.E2E_PLAYGROUND_SECOND_USER_ID ?? 'e2e-member',
    runId: process.env.E2E_RUN_ID ?? `run-${Date.now()}`
  },
  defaultMaxMs: Number(process.env.E2E_DEFAULT_MAX_MS ?? 2500),
  resolveRequirement
};

if ((mode === 'playground' || mode === 'stress') && process.env.E2E_SKIP_PLAYGROUND_RESET !== 'true') {
  const hooks = await import('./hooks/playground-db.mjs');
  await hooks.resetPlaygroundDatabase(ctx);
}

async function resolveRequirement(requirement) {
  if (requirement === 'demoUser') {
    await ensureDemoUser();
    return;
  }
  if (requirement === 'userProfile') {
    await ensureUserProfile();
    return;
  }
  if (requirement === 'event') {
    await ensureEvent(false);
    return;
  }
  if (requirement === 'subEvent') {
    await ensureEvent(true);
    if (!ctx.vars.subEventId) {
      throw new Error('No demo event with subEvents was found for subEvent requirement');
    }
    return;
  }
  if (requirement === 'asset') {
    await ensureAsset();
    return;
  }
  if (requirement === 'chat') {
    await ensureChat();
    return;
  }
  throw new Error(`Unknown server e2e requirement: ${requirement}`);
}

async function ensureUserProfile() {
  if (ctx.vars.userProfileLoaded) {
    return;
  }
  await ensureDemoUser();
  const result = await ctx.http.get('/api/auth/me', {
    params: { userId: ctx.vars.userId },
    headers: demoHeaders()
  });
  assertAuthMe(result.data, ctx);
  ctx.vars.userProfileLoaded = 'true';
}

async function ensureEvent(requireSubEvent = false) {
  if (ctx.vars.eventId && (!requireSubEvent || ctx.vars.subEventId)) {
    return;
  }
  await ensureDemoUser();
  const candidates = candidateDemoUserIds();
  for (const userId of candidates) {
    delete ctx.vars.eventId;
    delete ctx.vars.ownerId;
    delete ctx.vars.subEventId;
    const result = await ctx.http.post('/api/activities/events/explore', {
      headers: demoHeaders(),
      json: {
        userId,
        limit: 100
      }
    });
    if (Array.isArray(result.data)) {
      assertEventList(result.data, ctx, 'event requirement');
    } else {
      assertEventPage(result.data, ctx, 'event requirement');
    }
    if (ctx.vars.eventId && (!requireSubEvent || ctx.vars.subEventId)) {
      ctx.vars.userId = userId;
      return;
    }
  }
  throw new Error(requireSubEvent
    ? 'No demo event with subEvents was found for subEvent requirement'
    : 'No demo event was found for event requirement');
}

async function ensureAsset() {
  if (ctx.vars.assetId) {
    return;
  }
  await ensureDemoUser({ preserveSelectedUser: true });
  const result = await ctx.http.get('/api/assets', {
    params: { userId: ctx.vars.userId },
    headers: demoHeaders()
  });
  assertAssets(result.data, ctx, 'asset requirement');
}

async function ensureChat() {
  if (ctx.vars.chatId) {
    return;
  }
  await ensureDemoUser({ preserveSelectedUser: true });
  for (const userId of candidateDemoUserIds()) {
    delete ctx.vars.chatId;
    const result = await ctx.http.get('/api/activities/chats', {
      params: { userId },
      headers: demoHeaders()
    });
    assertChats(result.data, ctx, 'chat requirement');
    if (ctx.vars.chatId) {
      ctx.vars.userId = userId;
      return;
    }
  }
  throw new Error('No chat was available for chat requirement');
}

async function ensureDemoUser(options = {}) {
  if (ctx.vars.userId && Array.isArray(ctx.vars.demoUsers) && ctx.vars.demoUsers.length > 0) {
    return;
  }
  const existingUserId = ctx.vars.userId;
  const result = await ctx.http.get('/api/auth/demo-users', {
    headers: demoHeaders(),
    timeoutMs: 15000
  });
  assertDemoUsers(result.data, ctx);
  if (options.preserveSelectedUser && existingUserId) {
    ctx.vars.userId = existingUserId;
  }
}

function demoHeaders() {
  return {
    'X-App-Session-Kind': 'demo'
  };
}

function candidateDemoUserIds() {
  const users = Array.isArray(ctx.vars.demoUsers) ? ctx.vars.demoUsers : [];
  const envPreferred = `${process.env.E2E_DEMO_USER_ID ?? ''}`.trim();
  return [
    envPreferred,
    ctx.vars.userId,
    ...users
      .filter(user => !user.deletedAtIso && user.profileStatus !== 'deleted')
      .map(user => user.id)
  ].map(value => `${value ?? ''}`.trim()).filter((value, index, values) => value && values.indexOf(value) === index);
}

const summary = await runCollection({
  rootDir: __dirname,
  ctx,
  ...args,
  artifactsDir: path.join(__dirname, '..', '..', '.e2e-artifacts', 'server')
});

console.log(`\nserver e2e: ${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped, ${summary.total} selected`);
process.exitCode = summary.failed > 0 ? 1 : 0;
