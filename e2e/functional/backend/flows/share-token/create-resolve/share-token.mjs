import { assert, expectObject, expectString } from '../../../../../shared/assertions.mjs';

export async function assertResponse({ ctx, result, request }) {
  const body = expectObject(result.data, 'share token create response');
  expectString(body.token, 'share token create response.token');
  const resolved = await ctx.http.get('/api/share-tokens/resolve', {
    headers: request.headers,
    params: {
      token: body.token,
      userId: request.body.ownerUserId
    },
    expectedStatus: 200
  });
  const resolvedBody = expectObject(resolved.data, 'resolved share token');
  assert(resolvedBody.entityId === request.body.entityId, 'resolved share token should point at created entity', resolvedBody);
  assert(resolvedBody.kind === request.body.kind, 'resolved share token should preserve kind', resolvedBody);
}
