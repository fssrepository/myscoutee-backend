import { assert, expectObject } from '../../../../shared/assertions.mjs';
import { assertEvent, assertEventList, assertEventPage } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const draft = expectObject(result.data, 'event sync draft');
  assertEvent(draft, 'event sync draft');
  assert(draft.id === request.body.id, 'sync should return the created event id', { expected: request.body.id, actual: draft.id });
  assert(draft.published === false, 'synced playground event should start as unpublished draft', draft);

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
  assert(published?.published === true, 'publish should make the event visible as published', published);

  const explore = await ctx.http.post('/api/activities/events/explore', {
    headers: request.headers,
    json: {
      userId: ctx.vars.playgroundSecondUserId,
      limit: 20
    }
  });
  if (Array.isArray(explore.data)) {
    assert(assertEventList(explore.data, ctx, 'member explore').some(event => event.id === request.body.id), 'published event should appear in explore');
  } else {
    assertEventPage(explore.data, ctx, 'member explore page');
    assert(explore.data.records.some(event => event.id === request.body.id), 'published event should appear in explore page');
  }

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
  assert(unpublished?.published === false, 'unpublish should flip published false', unpublished);

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
