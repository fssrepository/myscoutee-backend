import { assertActivityMembers } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  assertActivityMembers(result.data);
}
