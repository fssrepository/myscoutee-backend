import { operatorHeaders } from '../../lib/operator-contracts.mjs';

export async function prepare({ ctx }) {
  const baseline = await ctx.http.get('/api/operator/configuration', {
    headers: operatorHeaders(ctx.vars.operatorUserId),
    expectedStatus: 200
  });
  ctx.vars.firebaseValidationBaseline = baseline.data;
  return {};
}
