import { e2eFixtureId, seedE2eProfiles } from '../../../lib/e2e-fixtures.mjs';

export async function prepare({ ctx }) {
  const suffix = `${ctx.vars.runId ?? Date.now()}`
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .slice(-72);
  const startsAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
  const endsAt = new Date(startsAt.getTime() + (2 * 60 * 60 * 1000));

  ctx.vars.ticketCheckInEventId = `e2e-ticket-event-${suffix}`;
  ctx.vars.ticketCheckInHostUserId = e2eFixtureId(ctx, 'ticket-host');
  ctx.vars.ticketCheckInHolderUserId = e2eFixtureId(ctx, 'ticket-holder');
  ctx.vars.ticketCheckInStartAtIso = startsAt.toISOString();
  ctx.vars.ticketCheckInEndAtIso = endsAt.toISOString();

  await seedE2eProfiles(ctx, [
    {
      id: ctx.vars.ticketCheckInHostUserId,
      name: 'E2E Ticket Host',
      initials: 'TH',
      gender: 'man'
    },
    {
      id: ctx.vars.ticketCheckInHolderUserId,
      name: 'E2E Ticket Holder',
      initials: 'TK',
      gender: 'woman'
    }
  ]);

  return {};
}
