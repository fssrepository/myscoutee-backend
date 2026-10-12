import test from 'node:test';
import assert from 'node:assert/strict';
import { createContext } from './context.mjs';

test('load users keep independent requirement state and reuse resolved actors/chats', async () => {
  const users = [{ id: 'a', name: 'A', initials: 'A', gender: 'unknown' },
    { id: 'b', name: 'B', initials: 'B', gender: 'unknown' }];
  const first = createContext({ baseUrl: 'http://example.invalid', mode: 'contract', runId: 'one', vu: 1 });
  const second = createContext({ baseUrl: 'http://example.invalid', mode: 'contract', runId: 'two', vu: 2 });
  const calls = [];
  first.http = { get: async route => {
    calls.push(route);
    if (route === '/api/auth/demo-users') return { data: users };
    assert.equal(route, '/api/activities/chats');
    return { data: [{ id: 'chat', title: 'Chat', memberIds: ['a', 'b'] }] };
  }};
  await first.resolveRequirement('chat');
  await first.resolveRequirement('chat');
  await first.resolveRequirement('demoUser');
  assert.deepEqual(calls, ['/api/auth/demo-users', '/api/activities/chats']);
  assert.equal(first.vars.chatId, 'chat');
  assert.equal(second.vars.chatId, undefined);
  assert.notEqual(first.vars.e2eUserId, second.vars.e2eUserId);
  await assert.rejects(first.resolveRequirement('absent'), /Unknown stress requirement/);
});
