import { assert } from '../../../../shared/assertions.mjs';
import { assertCommunityProviders } from '../../lib/operator-contracts.mjs';

export function assertResponse({ ctx, result }) {
  const providers = assertCommunityProviders(result.data);
  if (ctx.mode === 'e2e' || ctx.mode === 'stress') {
    assert(
      providers.length === 0,
      'the disposable e2e seed should not inherit community providers from a stale volume',
      providers
    );
    return;
  }
  const ids = providers.map(provider => provider.id);
  assert(
    ids.includes('discord') && ids.includes('discourse'),
    'the demo catalog should expose the seeded Discord and Discourse providers',
    ids
  );
}
