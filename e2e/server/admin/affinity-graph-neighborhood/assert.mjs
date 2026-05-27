import { assertAffinityGraphNeighborhood } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertAffinityGraphNeighborhood(result.data, ctx, 'admin affinity graph neighborhood');
}
