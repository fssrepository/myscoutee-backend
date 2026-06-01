import { assertMessages } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertMessages(result.data, ctx);
}
