import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertCommunityProviders } from '../../lib/operator-contracts.mjs';

export function assertResponse({ result }) {
  const providers = assertCommunityProviders(result.data);
  const ids = providers.map(provider => provider.id);
  assert(
    ids.includes('discord') && ids.includes('discourse'),
    'the seeded catalog should expose the seeded Discord and Discourse providers',
    ids
  );
}
