import { assertLandingContent } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertLandingContent(result.data, ctx);
}
