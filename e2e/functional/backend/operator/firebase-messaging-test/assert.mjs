import { assert } from '../../../../shared/assertions.mjs';
import {
  assertConfigurationTestResult,
  assertNoWriteOnlyConfiguration
} from '../../lib/operator-contracts.mjs';

export function assertResponse({ ctx, result }) {
  const test = assertConfigurationTestResult(result.data, 'Firebase messaging test');
  assert(test.kind === 'FIREBASE_MESSAGING', 'Firebase messaging test should echo its kind', test);
  assert(test.success === false, 'live Firebase messaging testing should stay disabled in demo mode', test);
  assert(test.firebase === null, 'demo Firebase messaging testing must not expose or mutate Firebase state', test);
  assert(
    test.message.includes('Explore/demo mode'),
    'Firebase messaging testing should use the demo-isolation branch',
    test
  );
  assertNoWriteOnlyConfiguration(test, 'Firebase messaging test', [
    `e2e-destination-${ctx.vars.runId}`,
    `e2e-browser-readiness-${ctx.vars.runId}`,
    `e2e-browser-app-${ctx.vars.runId}`
  ]);
}
