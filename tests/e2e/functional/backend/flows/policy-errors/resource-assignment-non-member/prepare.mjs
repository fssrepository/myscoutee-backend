import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  await seedE2eProfiles(ctx, [
    {
      id: e2eFixtureId(ctx, 'policy-host'),
      name: 'E2E Policy Host',
      initials: 'PH',
      gender: 'man'
    },
    {
      id: e2eFixtureId(ctx, 'policy-asset-owner'),
      name: 'E2E Policy Asset Owner',
      initials: 'PA',
      gender: 'woman'
    }
  ]);
  return {};
}
