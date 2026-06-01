import { assertRates } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  assertRates(result.data);
}
