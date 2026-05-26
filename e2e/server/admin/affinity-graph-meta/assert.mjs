import { assertAffinityGraphMeta } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertAffinityGraphMeta(result.data, ctx, 'admin affinity graph meta');
}
