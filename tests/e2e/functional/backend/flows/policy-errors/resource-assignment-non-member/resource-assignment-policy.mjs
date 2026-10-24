import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function assertResponse({ ctx, request }) {
  const state = await ctx.http.get('/api/activities/events/subevent-resources', {
    headers: request.headers,
    params: {
      ownerId: request.body.ownerId,
      subEventId: request.body.subEventId,
      assetOwnerUserId: request.body.assetOwnerUserId
    },
    expectedStatus: 200
  });
  assert(state.data === null || state.data === undefined, 'denied resource assignment should not create resource state', state.data);
}
