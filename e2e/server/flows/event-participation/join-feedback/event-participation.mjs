import { assert, expectArray } from '../../../../shared/assertions.mjs';
import { assertEvent, assertEventList } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const event = assertEvent(result.data, 'participation event sync');
  const eventId = event.id;
  assert(event.published === true, 'participation event should be published from sync', event);

  const join = await ctx.http.post('/api/activities/events/join', {
    headers: request.headers,
    json: {
      userId: ctx.vars.playgroundSecondUserId,
      type: 'events',
      sourceId: eventId,
      optionalSubEventIds: [],
      assetSelections: [],
      acceptedPolicyIds: [],
      bookingConfirmed: true
    },
    expectedStatus: 200
  });
  assertEvent(join.data, 'joined participation event');

  const attending = await ctx.http.get('/api/activities/events/attending', {
    headers: request.headers,
    params: {
      userId: ctx.vars.playgroundSecondUserId
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
    json: {
      userId: ctx.vars.playgroundSecondUserId,
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
    json: {
      userId: ctx.vars.playgroundSecondUserId,
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
    json: {
      userId: ctx.vars.playgroundSecondUserId,
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
    json: {
      userId: ctx.vars.playgroundSecondUserId,
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
      userId: ctx.vars.playgroundSecondUserId
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
