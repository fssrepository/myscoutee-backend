import { assert } from '../../../../shared/assertions.mjs';
import { assertOperatorUpdateOverview } from '../../lib/operator-contracts.mjs';

export function assertResponse({ result }) {
  const overview = assertOperatorUpdateOverview(result.data);
  assert(overview.enabled === false, 'package updates should be disabled in Explore/demo mode', overview);
  assert(overview.latestJob === null, 'Explore/demo mode should not expose a package update job', overview);
}
