import { assert } from '../../../../shared/assertions.mjs';
import { assertConfigurationTestResult } from '../../lib/operator-contracts.mjs';

export function assertResponse({ result }) {
  const test = assertConfigurationTestResult(result.data, 'Firebase authentication test');
  assert(test.kind === 'FIREBASE_AUTHENTICATION', 'Firebase authentication test should echo its kind', test);
  assert(test.success === false, 'live Firebase authentication testing should stay disabled in demo mode', test);
  assert(test.firebase === null, 'demo Firebase authentication testing must not expose or mutate Firebase state', test);
  assert(
    test.message.includes('Explore/demo mode'),
    'Firebase authentication testing should use the demo-isolation branch',
    test
  );
}
