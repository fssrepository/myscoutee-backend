import { assertAffinityGraphTile } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertAffinityGraphTile(result.data, ctx, 'admin affinity graph tile component');
}
