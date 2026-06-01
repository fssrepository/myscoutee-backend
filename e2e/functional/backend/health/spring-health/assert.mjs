import { assert, expectObject } from '../../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  const body = expectObject(result.data, 'health');
  assert(body.status === 'UP', 'health.status should be UP', body);
}
