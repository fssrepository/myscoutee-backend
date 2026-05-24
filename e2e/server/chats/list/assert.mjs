import { assertChats } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertChats(result.data, ctx, 'chats');
}
