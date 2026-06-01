import { assertLeaderboard } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  assertLeaderboard(result.data);
}
