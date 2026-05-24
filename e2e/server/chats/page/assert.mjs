import { assertChatPage } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertChatPage(result.data, ctx);
}
