import { assert } from '../../../../../shared/assertions.mjs';
import { assertAssets, assertAsset } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, request }) {
  const list = await ctx.http.get('/api/assets', {
    headers: request.headers,
    params: { userId: request.body.userId }
  });
  const assets = list.data;
  assertAssets(assets, ctx, 'asset lifecycle list');
  assert(assets.some(asset => asset.id === request.body.asset.id), 'upserted asset should appear in owned assets');

  await ctx.http.post('/api/assets/delete', {
    headers: request.headers,
    json: {
      userId: request.body.userId,
      assetId: request.body.asset.id
    },
    expectedStatus: 200
  });

  const restored = await ctx.http.post('/api/assets/restore', {
    headers: request.headers,
    json: {
      userId: request.body.userId,
      assetId: request.body.asset.id
    },
    expectedStatus: 200
  });
  assertAsset(restored.data, 'restored asset');
  assert(restored.data.id === request.body.asset.id, 'restore should return the same asset id');
}
