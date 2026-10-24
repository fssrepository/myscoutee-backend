import { assert, expectArray } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertRegistryStatus } from '../../lib/operator-contracts.mjs';

export function assertResponse({ result }) {
  const status = assertRegistryStatus(result.data, 'operator registry status', {
    expectedMode: 'DEMO'
  });
  const options = expectArray(status.registryOptions, 'operator registry status.registryOptions');
  assert(
    options.some(option => option.baseUrl === 'http://registry:8080'
      && option.registryScope === 'demo:myscoutee'),
    'operator registry options should expose the isolated seeded demo registry',
    options
  );
}
