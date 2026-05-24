import { assertAdminState } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertAdminState(result.data, ctx, 'admin params');
}
