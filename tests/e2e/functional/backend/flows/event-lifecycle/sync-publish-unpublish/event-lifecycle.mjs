import { assert, expectObject } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertEvent, assertEventList, assertEventPage } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const draft = expectObject(result.data, 'event sync draft');
  assertEvent(draft, 'event sync draft');
  assert(draft.id === request.body.id, 'sync should return the created event id', { expected: request.body.id, actual: draft.id });
  assert(draft.status === 'DR', 'synced e2e event should start as a draft', draft);

  const actionBody = {
    userId: request.body.creatorUserId,
    type: 'hosting',
    sourceId: request.body.id
  };

  await ctx.http.post('/api/activities/events/publish', {
    headers: request.headers,
    json: actionBody,
    expectedStatus: 200
  });
  const publishedHosting = await ctx.http.get('/api/activities/events/hosting', {
    headers: request.headers,
    params: { userId: request.body.creatorUserId }
  });
  const published = assertEventList(publishedHosting.data, ctx, 'published hosting')
    .find(event => event.id === request.body.id);
  assert(published?.status === 'A', 'publish should activate the event', published);

  const explored = await waitForExploreEvent(ctx, request);
  assert(explored, 'published event should converge into explore');

  await ctx.http.post('/api/activities/events/unpublish', {
    headers: request.headers,
    json: actionBody,
    expectedStatus: 200
  });
  const unpublishedHosting = await ctx.http.get('/api/activities/events/hosting', {
    headers: request.headers,
    params: { userId: request.body.creatorUserId }
  });
  const unpublished = assertEventList(unpublishedHosting.data, ctx, 'unpublished hosting')
    .find(event => event.id === request.body.id);
  assert(unpublished?.status === 'DR', 'unpublish should restore draft status', unpublished);

  await ctx.http.post('/api/activities/events/trash', {
    headers: request.headers,
    json: actionBody,
    expectedStatus: 200
  });
  const trash = await ctx.http.get('/api/activities/events/trash', {
    headers: request.headers,
    params: { userId: request.body.creatorUserId }
  });
  assert(
    assertEventList(trash.data, ctx, 'trash').some(event => event.id === request.body.id),
    'trash endpoint should contain the trashed event'
  );

  await ctx.http.post('/api/activities/events/restore', {
    headers: request.headers,
    json: actionBody,
    expectedStatus: 200
  });
  const restoredHosting = await ctx.http.get('/api/activities/events/hosting', {
    headers: request.headers,
    params: { userId: request.body.creatorUserId }
  });
  assert(
    assertEventList(restoredHosting.data, ctx, 'restored hosting').some(event => event.id === request.body.id),
    'restore should put the event back into hosting'
  );
}

async function waitForExploreEvent(ctx, request) {
  const deadline = Date.now() + Number(process.env.E2E_EVENT_EXPLORE_WAIT_MS ?? 10000);
  do {
    const explore = await ctx.http.post('/api/activities/events/explore', {
      headers: {
        ...request.headers,
        'X-Demo-User-Id': ctx.vars.e2eSecondUserId
      },
      json: {
        userId: ctx.vars.e2eSecondUserId
      }
    });
    const events = Array.isArray(explore.data)
      ? assertEventList(explore.data, ctx, 'member explore')
      : assertEventPage(explore.data, ctx, 'member explore page').records;
    const event = events.find(item => item.id === request.body.id);
    if (event) {
      return event;
    }
    await sleep(200);
  } while (Date.now() <= deadline);
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
