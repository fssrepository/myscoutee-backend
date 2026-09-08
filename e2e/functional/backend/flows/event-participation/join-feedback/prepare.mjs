import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.e2eUserId = e2eFixtureId(ctx, 'participation-host');
  ctx.vars.e2eSecondUserId = e2eFixtureId(ctx, 'participation-member');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.e2eUserId, name: 'E2E Participation Host', initials: 'PH', gender: 'man' },
    { id: ctx.vars.e2eSecondUserId, name: 'E2E Participation Member', initials: 'PM', gender: 'woman' }
  ]);
  return {};
}
