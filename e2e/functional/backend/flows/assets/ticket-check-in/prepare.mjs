export function prepare({ ctx }) {
  const suffix = `${ctx.vars.runId ?? Date.now()}`
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .slice(-80);
  const startsAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
  const endsAt = new Date(startsAt.getTime() + (2 * 60 * 60 * 1000));

  ctx.vars.ticketCheckInEventId = `e2e-ticket-event-${suffix}`;
  ctx.vars.ticketCheckInHostUserId = `e2e-ticket-host-${suffix}`;
  ctx.vars.ticketCheckInHolderUserId = `e2e-ticket-holder-${suffix}`;
  ctx.vars.ticketCheckInStartAtIso = startsAt.toISOString();
  ctx.vars.ticketCheckInEndAtIso = endsAt.toISOString();

  return {};
}
