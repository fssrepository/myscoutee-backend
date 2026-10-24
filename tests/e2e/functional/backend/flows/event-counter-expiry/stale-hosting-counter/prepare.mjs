import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.counterHostUserId = e2eFixtureId(ctx, 'counter-host');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.counterHostUserId, name: 'E2E Counter Host', initials: 'EC', gender: 'man' }
  ]);
  return {};
}
