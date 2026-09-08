import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.e2eUserId = e2eFixtureId(ctx, 'asset-owner');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.e2eUserId, name: 'E2E Asset Owner', initials: 'EA', gender: 'man' }
  ]);
  return {};
}
