import { assertEligibility } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  assertEligibility(result.data);
}
