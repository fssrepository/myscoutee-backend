import { assert, expectArray, expectObject, expectString } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertMessages } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const message = expectObject(result.data, 'sent chat message');
  const messageId = expectString(message.id, 'sent chat message.id');
  const chatId = ctx.vars.chatId;
  assert(message.text === request.body.text, 'sent chat message should preserve text', message);

  const edited = await ctx.http.post(`/api/activities/chats/${chatId}/messages/${messageId}/edit`, {
    headers: request.headers,
    params: request.params,
    json: { text: `Edited ${request.body.text}` },
    expectedStatus: 200
  });
  assert(edited.data?.text?.startsWith('Edited '), 'edited chat message should return edited text', edited.data);

  const pinned = await ctx.http.post(`/api/activities/chats/${chatId}/messages/${messageId}/pin`, {
    headers: request.headers,
    params: request.params,
    json: { pinned: true },
    expectedStatus: 200
  });
  assert(pinned.data?.pinnedAtIso, 'pin should stamp pinnedAtIso', pinned.data);

  const reacted = await ctx.http.post(`/api/activities/chats/${chatId}/messages/${messageId}/reaction`, {
    headers: request.headers,
    params: request.params,
    json: { emoji: '+1' },
    expectedStatus: 200
  });
  expectArray(reacted.data?.reactions ?? [], 'chat message reactions');

  const attached = await ctx.http.post(`/api/activities/chats/${chatId}/messages/${messageId}/attachments`, {
    headers: request.headers,
    params: request.params,
    json: {
      attachments: [
        {
          id: `e2e-attachment-${ctx.vars.runId}`,
          type: 'link',
          title: 'E2E attachment',
          entityId: '',
          assetType: '',
          ownerUserId: request.params.userId,
          status: 'available',
          subtitle: 'integration',
          description: 'Created by server e2e',
          url: 'https://example.com/e2e',
          previewUrl: '',
          mimeType: 'text/html',
          sizeBytes: 0
        }
      ]
    },
    expectedStatus: 200
  });
  assert((attached.data?.attachments ?? []).length === 1, 'attachments update should return one attachment', attached.data);

  const messages = await ctx.http.get(`/api/activities/chats/${chatId}/messages`, {
    headers: request.headers,
    params: request.params,
    expectedStatus: 200
  });
  assertMessages(messages.data, ctx);
  assert(messages.data.items.some(item => item.id === messageId), 'message list should include the created message');

  await ctx.http.post('/api/activities/chats/devices', {
    headers: request.headers,
    params: request.params,
    json: {
      userId: request.params.userId,
      deviceId: `e2e-device-${ctx.vars.runId}`,
      platform: 'node',
      firebaseToken: `e2e-token-${ctx.vars.runId}`,
      notificationsEnabled: true
    },
    expectedStatus: 200
  });
  await ctx.http.request('DELETE', '/api/activities/chats/devices', {
    headers: request.headers,
    params: request.params,
    json: {
      userId: request.params.userId,
      deviceId: `e2e-device-${ctx.vars.runId}`,
      firebaseToken: `e2e-token-${ctx.vars.runId}`
    },
    expectedStatus: 200
  });

  const deleted = await ctx.http.post(`/api/activities/chats/${chatId}/messages/${messageId}/delete`, {
    headers: request.headers,
    params: request.params,
    expectedStatus: 200
  });
  assert(deleted.data?.deletedAtIso, 'deleted chat message should return deletedAtIso', deleted.data);
}
