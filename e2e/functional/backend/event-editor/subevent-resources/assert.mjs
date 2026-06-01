import { assertActivityResourceState } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  if (result.data === null || result.data === undefined) {
    return;
  }
  assertActivityResourceState(result.data);
}
