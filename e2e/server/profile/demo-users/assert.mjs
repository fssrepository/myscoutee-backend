import { assertDemoUsers } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertDemoUsers(result.data, ctx);
}
