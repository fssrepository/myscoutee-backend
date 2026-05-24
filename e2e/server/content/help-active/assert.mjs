import { assertHelpState } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertHelpState(result.data, ctx, 'help');
}
