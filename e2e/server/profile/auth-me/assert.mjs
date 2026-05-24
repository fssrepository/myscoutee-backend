import { assertAuthMe } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertAuthMe(result.data, ctx);
}
