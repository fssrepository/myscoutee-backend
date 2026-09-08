import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.e2eUserId = e2eFixtureId(ctx, 'profile-owner');
  ctx.vars.e2eSecondUserId = e2eFixtureId(ctx, 'profile-target');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.e2eUserId, name: 'E2E Profile State', initials: 'EP', gender: 'man' },
    { id: ctx.vars.e2eSecondUserId, name: 'E2E Rated Target', initials: 'RT', gender: 'woman' }
  ]);
  return {};
}
