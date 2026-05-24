import { assertActivityResourceState } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  assertActivityResourceState(result.data);
}
