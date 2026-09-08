import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  ctx.vars.sessionUserId = e2eFixtureId(ctx, 'session-user');
  ctx.vars.sessionAId = e2eFixtureId(ctx, 'session-a');
  ctx.vars.sessionBId = e2eFixtureId(ctx, 'session-b');
  ctx.vars.sessionCId = e2eFixtureId(ctx, 'session-c');
  ctx.vars.sessionAttemptAId = e2eFixtureId(ctx, 'attempt-a');
  ctx.vars.sessionAttemptBId = e2eFixtureId(ctx, 'attempt-b');
  ctx.vars.sessionAttemptCBlockedId = e2eFixtureId(ctx, 'attempt-c-blocked');
  ctx.vars.sessionAttemptCAcceptedId = e2eFixtureId(ctx, 'attempt-c-accepted');
  await seedE2eProfiles(ctx, [
    { id: ctx.vars.sessionUserId, name: 'E2E Session User', initials: 'ES' }
  ]);
  return {};
}
