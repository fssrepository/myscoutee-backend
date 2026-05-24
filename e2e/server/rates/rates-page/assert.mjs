import { assertRatePage } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  assertRatePage(result.data);
}
