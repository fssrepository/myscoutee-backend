import { assert, expectObject } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  const body = expectObject(result.data, 'health');
  assert(body.status === 'UP', 'health.status should be UP', body);
}
