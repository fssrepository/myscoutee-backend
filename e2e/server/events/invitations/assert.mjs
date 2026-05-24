import { assertEventList } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertEventList(result.data, ctx, 'invitations');
}
