import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertOperatorConfiguration } from '../../lib/operator-contracts.mjs';

export function assertResponse({ result }) {
  const configuration = assertOperatorConfiguration(result.data);
  const providerIds = configuration.payment.availableProviders.map(provider => provider.id);
  assert(providerIds.includes('stripe'), 'operator configuration should list Stripe', providerIds);
  assert(providerIds.includes('barion'), 'operator configuration should list Barion', providerIds);
}
