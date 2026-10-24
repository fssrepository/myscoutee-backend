import {
  assert,
  expectArray,
  expectBoolean,
  expectObject,
  expectString
} from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function assertResponse({ ctx, result, request }) {
  const initialPage = expectObject(result.data, 'initial ticket page');
  const initialTicket = findTicket(initialPage, ctx.vars.ticketCheckInEventId, 'initial ticket page');
  const scanCode = expectString(initialTicket.scanCode, 'initial ticket.scanCode');

  assert(
    /^TKT-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(scanCode),
    'issued ticket should expose an opaque server scan code',
    { scanCode }
  );
  assert(
    initialTicket.holderUserId === ctx.vars.ticketCheckInHolderUserId,
    'ticket card should belong to the accepted event member',
    initialTicket
  );
  assert(
    !`${initialTicket.usedAtIso ?? ''}`.trim(),
    'fresh ticket card should not have a check-in timestamp',
    initialTicket
  );

  const unauthorized = await validateTicket(ctx, request, {
    code: scanCode,
    userId: ctx.vars.ticketCheckInHolderUserId
  });
  assertValidation(unauthorized.data, false, 'not_authorized', 'unauthorized check-in');
  assert(
    unauthorized.data.ticket === null,
    'unauthorized validation should not disclose a ticket payload',
    unauthorized.data
  );

  const malformed = await validateTicket(ctx, request, {
    code: 'not-a-ticket-code',
    userId: ctx.vars.ticketCheckInHostUserId
  });
  assertValidation(malformed.data, false, 'invalid_code', 'malformed check-in');
  assert(
    malformed.data.ticket === null,
    'malformed validation should not return a ticket payload',
    malformed.data
  );

  const firstCheckIn = await validateTicket(ctx, request, {
    code: scanCode,
    userId: ctx.vars.ticketCheckInHostUserId
  });
  const firstValidation = assertValidation(firstCheckIn.data, true, 'valid', 'first check-in');
  const checkedInTicket = expectObject(firstValidation.ticket, 'first check-in.ticket');
  assert(checkedInTicket.code === scanCode, 'successful check-in should return the scanned code', checkedInTicket);
  assert(
    checkedInTicket.holderUserId === ctx.vars.ticketCheckInHolderUserId,
    'successful check-in should return the server-side ticket holder',
    checkedInTicket
  );
  assert(
    checkedInTicket.holderName === 'E2E Ticket Holder',
    'scanner payload should show the ticket holder name',
    checkedInTicket
  );
  assert(
    checkedInTicket.eventId === ctx.vars.ticketCheckInEventId,
    'successful check-in should return the matching event',
    checkedInTicket
  );
  const usedAtIso = expectString(checkedInTicket.usedAtIso, 'first check-in.ticket.usedAtIso');
  assert(
    Number.isFinite(Date.parse(usedAtIso)),
    'successful check-in timestamp should be valid ISO time',
    { usedAtIso }
  );
  const notifications = await ctx.http.get('/api/notifications', {
    headers: {
      ...request.headers,
      'X-Demo-User-Id': ctx.vars.ticketCheckInHolderUserId
    },
    params: {
      userId: ctx.vars.ticketCheckInHolderUserId,
      bucket: 'all',
      limit: '50'
    },
    expectedStatus: 200
  });
  const notificationPage = expectObject(notifications.data, 'holder notifications');
  const notificationRecords = expectArray(notificationPage.records, 'holder notifications.records');
  const checkedInNotification = notificationRecords.find(item => (
    item?.kind === 'event-ticket-checked-in'
    && item?.sourceId === ctx.vars.ticketCheckInEventId
  ));
  assert(
    checkedInNotification,
    'successful check-in should notify the ticket holder',
    notificationRecords
  );
  assert(
    checkedInNotification.payload?.usedAtIso === usedAtIso,
    'check-in notification should carry the persisted scan timestamp',
    checkedInNotification
  );

  const replay = await validateTicket(ctx, request, {
    code: scanCode,
    userId: ctx.vars.ticketCheckInHostUserId
  });
  assertValidation(replay.data, false, 'already_used', 'replayed check-in');
  assert(
    replay.data.ticket === null,
    'replayed validation should not return an active ticket payload',
    replay.data
  );

  const refreshed = await ctx.http.get('/api/assets/tickets', {
    headers: request.headers,
    params: request.params,
    expectedStatus: 200
  });
  const refreshedTicket = findTicket(
    expectObject(refreshed.data, 'refreshed ticket page'),
    ctx.vars.ticketCheckInEventId,
    'refreshed ticket page'
  );
  assert(
    refreshedTicket.scanCode === scanCode,
    'holder refresh should keep the same ticket identity',
    refreshedTicket
  );
  assert(
    refreshedTicket.usedAtIso === usedAtIso,
    'holder refresh should expose the persisted check-in timestamp',
    { expected: usedAtIso, ticket: refreshedTicket }
  );
}

async function validateTicket(ctx, request, body) {
  return ctx.http.post('/api/assets/tickets/validate', {
    headers: {
      ...request.headers,
      'X-Demo-User-Id': body.userId
    },
    json: body,
    expectedStatus: 200
  });
}

function assertValidation(value, expectedValid, expectedReason, path) {
  const response = expectObject(value, path);
  expectBoolean(response.valid, `${path}.valid`);
  expectString(response.reason, `${path}.reason`);
  assert(response.valid === expectedValid, `${path}.valid should be ${expectedValid}`, response);
  assert(response.reason === expectedReason, `${path}.reason should be ${expectedReason}`, response);
  return response;
}

function findTicket(page, eventId, path) {
  const items = expectArray(page.items, `${path}.items`);
  const ticket = items.find(item => item?.id === eventId);
  assert(ticket, `${path} should contain the prepared event ticket`, {
    eventId,
    ticketIds: items.map(item => item?.id)
  });
  return expectObject(ticket, `${path}.ticket`);
}
