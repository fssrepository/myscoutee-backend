import { assertAssets } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertAssets(result.data, ctx, 'asset explore');
}
