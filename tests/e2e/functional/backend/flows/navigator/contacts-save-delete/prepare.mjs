import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.e2eUserId = e2eFixtureId(ctx, 'contacts-owner');
  ctx.vars.e2eSecondUserId = e2eFixtureId(ctx, 'contacts-target');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.e2eUserId, name: 'E2E Contacts Owner', initials: 'EC' }
  ]);
  return {};
}
