import { assert, expectArray } from '../../../../../shared/assertions.mjs';
import { assertEvent, assertEventList } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const event = assertEvent(result.data, 'participation event sync');
  const eventId = event.id;
  assert(event.status === 'A', 'participation event should be active after sync', event);

  const join = await ctx.http.post('/api/activities/events/join', {
    headers: request.headers,
    json: {
      userId: ctx.vars.e2eSecondUserId,
      type: 'events',
      sourceId: eventId,
      optionalSubEventIds: [],
      assetSelections: [],
      acceptedPolicyIds: [],
      bookingConfirmed: true
    },
    expectedStatus: 200
  });
  assert(join.data?.sourceId === eventId, 'join should return the participation event source id', join.data);
  assert(join.data?.membershipStatus === 'accepted', 'join should accept the participant', join.data);

  const attending = await ctx.http.get('/api/activities/events/attending', {
    headers: request.headers,
    params: {
      userId: ctx.vars.e2eSecondUserId
    },
    expectedStatus: 200
  });
  const attendingEvents = assertEventList(attending.data, ctx, 'participation attending');
  assert(
    attendingEvents.some(item => item && item.id === eventId),
    'joined event should appear in attending list',
    attendingEvents
  );

  await ctx.http.post('/api/activities/events/feedback/submit', {
    headers: request.headers,
    params: { userId: ctx.vars.e2eSecondUserId },
    json: {
      userId: ctx.vars.e2eSecondUserId,
      eventId,
      answers: []
    },
    expectedStatus: 200
  });
  await assertFeedbackState(ctx, request, eventId, {
    submitted: true,
    removed: false
  });
  await ctx.http.post('/api/activities/events/feedback/note', {
    headers: request.headers,
    params: { userId: ctx.vars.e2eSecondUserId },
    json: {
      userId: ctx.vars.e2eSecondUserId,
      eventId,
      text: 'E2E organizer note'
    },
    expectedStatus: 200
  });
  await assertFeedbackState(ctx, request, eventId, {
    submitted: true,
    removed: false,
    organizerNote: 'E2E organizer note'
  });
  await ctx.http.post('/api/activities/events/feedback/remove', {
    headers: request.headers,
    params: { userId: ctx.vars.e2eSecondUserId },
    json: {
      userId: ctx.vars.e2eSecondUserId,
      eventId
    },
    expectedStatus: 200
  });
  await assertFeedbackState(ctx, request, eventId, {
    submitted: true,
    removed: true,
    organizerNote: 'E2E organizer note'
  });
  await ctx.http.post('/api/activities/events/feedback/restore', {
    headers: request.headers,
    params: { userId: ctx.vars.e2eSecondUserId },
    json: {
      userId: ctx.vars.e2eSecondUserId,
      eventId
    },
    expectedStatus: 200
  });
  await assertFeedbackState(ctx, request, eventId, {
    submitted: true,
    removed: false,
    organizerNote: 'E2E organizer note'
  });
}

async function assertFeedbackState(ctx, request, eventId, expected) {
  const feedback = await ctx.http.get('/api/activities/events/feedback', {
    headers: request.headers,
    params: {
      userId: ctx.vars.e2eSecondUserId
    },
    expectedStatus: 200
  });
  const states = expectArray(feedback.data, 'participation feedback states');
  const state = states.find(item => item && item.eventId === eventId);
  assert(state, 'feedback state should exist for joined event', states);
  if (expected.submitted) {
    assert(state.submittedAtIso, 'feedback state should have submittedAtIso', state);
  }
  assert(state.removed === expected.removed, 'feedback removed state should match', state);
  if (expected.organizerNote !== undefined) {
    assert(state.organizerNote === expected.organizerNote, 'feedback organizer note should match', state);
  }
}
