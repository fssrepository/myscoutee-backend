import { assertAffinityGraphForests } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertAffinityGraphForests(result.data, ctx, 'admin affinity graph forests level');
}
