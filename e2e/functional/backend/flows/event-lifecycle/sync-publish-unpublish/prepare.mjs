import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.e2eUserId = e2eFixtureId(ctx, 'event-host');
  ctx.vars.e2eSecondUserId = e2eFixtureId(ctx, 'event-member');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.e2eUserId, name: 'E2E Host', initials: 'EH', gender: 'man' },
    { id: ctx.vars.e2eSecondUserId, name: 'E2E Member', initials: 'EM', gender: 'woman' }
  ]);
  return {};
}
