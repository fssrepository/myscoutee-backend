import { assertOperatorRevenue } from '../../lib/operator-contracts.mjs';

export function assertResponse({ result }) {
  assertOperatorRevenue(result.data);
}
