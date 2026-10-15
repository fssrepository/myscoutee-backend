import { assert, expectArray, expectObject } from '../../../../../shared/assertions.mjs';
import { assertEvent, assertEventList } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const event = assertEvent(result.data, 'participation event sync');
  const eventId = event.id;
  assert(event.status === 'A', 'participation event should be active after sync', event);

  const join = await ctx.http.post('/api/activities/events/join', {
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
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
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
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

  await moveEventIntoUnlockedFeedbackWindow(ctx, request, eventId);

  const feedbackDetailResult = await ctx.http.post('/api/feedback/detail', {
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
    json: {
      userId: ctx.vars.e2eSecondUserId,
      eventId
    },
    expectedStatus: 200
  });
  const feedbackDetail = expectObject(feedbackDetailResult.data, 'participation feedback detail');
  assert(feedbackDetail.eventId === eventId, 'feedback detail should belong to the participation event', feedbackDetail);
  const feedbackCards = expectArray(feedbackDetail.cards, 'participation feedback cards');
  assert(feedbackCards.length > 0, 'unlocked participation event should expose at least one feedback card', feedbackDetail);

  const submitted = await ctx.http.post('/api/feedback/submit', {
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
    json: {
      userId: ctx.vars.e2eSecondUserId,
      feedback: {
        eventId,
        title: feedbackDetail.title,
        submittedAtIso: new Date().toISOString(),
        cards: feedbackCards.map((card, index) => ({
          ...card,
          answerPrimary: index === 0 ? 'excellent' : 'positive',
          answerSecondary: index === 0 ? 'well-organized' : '',
          selectedTraitIds: Array.isArray(card.selectedTraitIds) ? card.selectedTraitIds : []
        }))
      }
    },
    expectedStatus: 200
  });
  const submittedFeedback = expectObject(submitted.data, 'submitted participation feedback');
  assert(submittedFeedback.eventId === eventId, 'submitted feedback should belong to the participation event', submittedFeedback);
  assert(submittedFeedback.submittedAtIso, 'submitted feedback should include a submission timestamp', submittedFeedback);
  const submittedCards = expectArray(submittedFeedback.cards, 'submitted participation feedback cards');
  assert(
    submittedCards.some(card => card?.answerPrimary === 'excellent'),
    'submitted feedback should preserve the primary answer',
    submittedCards
  );

  await assertFeedbackState(ctx, request, eventId, {
    submitted: true,
    removed: false
  });
  await ctx.http.post('/api/feedback/note', {
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
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
  await ctx.http.post('/api/feedback/remove', {
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
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
  await ctx.http.post('/api/feedback/restore', {
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
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

async function moveEventIntoUnlockedFeedbackWindow(ctx, request, eventId) {
  const actionBody = {
    userId: request.body.creatorUserId,
    type: 'hosting',
    sourceId: eventId
  };
  await ctx.http.post('/api/activities/events/unpublish', {
    headers: request.headers,
    json: actionBody,
    expectedStatus: 200
  });

  const now = Date.now();
  const startAtIso = new Date(now - 4 * 60 * 60 * 1000).toISOString();
  const endAtIso = new Date(now - 3 * 60 * 60 * 1000).toISOString();
  const updated = await ctx.http.post('/api/activities/events/sync', {
    headers: request.headers,
    json: {
      ...request.body,
      status: 'DR',
      startAtIso,
      endAtIso,
      timeframe: 'Finished earlier today'
    },
    expectedStatus: 200
  });
  const unlockedDraft = assertEvent(updated.data, 'participation feedback unlocked draft');
  assert(unlockedDraft.id === eventId, 'feedback window update should preserve the event id', unlockedDraft);
  assert(unlockedDraft.status === 'DR', 'feedback window update should keep the event as a draft', unlockedDraft);
  assert(
    Math.abs(Date.parse(unlockedDraft.startAtIso) - Date.parse(startAtIso)) < 1000,
    'feedback window update should move the event start into the past',
    { expected: startAtIso, actual: unlockedDraft.startAtIso }
  );

  await ctx.http.post('/api/activities/events/publish', {
    headers: request.headers,
    json: actionBody,
    expectedStatus: 200
  });
}

async function assertFeedbackState(ctx, request, eventId, expected) {
  const feedback = await ctx.http.get('/api/feedback', {
    headers: actorHeaders(request.headers, ctx.vars.e2eSecondUserId),
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

function actorHeaders(headers, userId) {
  return {
    ...headers,
    'X-Demo-User-Id': userId
  };
}
