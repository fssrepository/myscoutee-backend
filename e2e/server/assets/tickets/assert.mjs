import { assertTicketsPage } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertTicketsPage(result.data, ctx);
}
