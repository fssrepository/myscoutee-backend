import { assertGameCards } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertGameCards(result.data, ctx);
}
