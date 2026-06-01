import { assertEventPage } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertEventPage(result.data, ctx, 'event filter');
}
