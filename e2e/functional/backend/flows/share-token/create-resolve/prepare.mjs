import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.e2eUserId = e2eFixtureId(ctx, 'share-owner');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.e2eUserId, name: 'E2E Share Owner', initials: 'SO', gender: 'man' }
  ]);
  return {};
}
