import { assert } from '../../../../shared/assertions.mjs';

export async function assertResponse({ ctx, result, request }) {
  assert(
    result.status === 400,
    'generic operator actions should reject the canonical claim action in favor of the structured endpoint'
  );
  assertNotEchoed(
    result.data,
    request.body.idempotencyKey,
    'generic claim rejection'
  );

  const missingBodyPaths = [
    '/api/operator/network/actions',
    '/api/operator/claim',
    '/api/operator/claim/client-token/revoke',
    '/api/operator/claim/redeem',
    '/api/operator/claim/group-link/revoke',
    '/api/operator/updates'
  ];
  for (const path of missingBodyPaths) {
    const rejected = await ctx.http.request('POST', path, {
      headers: request.headers,
      expectedStatus: 400
    });
    assert(rejected.status === 400, `${path} should require a JSON request body`, rejected.data);
  }

  const invalidBindings = [
    {
      label: 'revenue report page',
      path: '/api/operator/revenue/reports',
      params: { page: 'not-a-number' }
    },
    {
      label: 'measurement report size',
      path: '/api/operator/measurements/reports',
      params: { size: 'not-a-number' }
    },
    {
      label: 'leaderboard limit',
      path: '/api/operator/leaderboard',
      params: { limit: 'not-a-number' }
    },
    {
      label: 'announcement includeExpired',
      path: '/api/operator/announcements',
      params: { includeExpired: 'not-a-boolean' }
    },
    {
      label: 'update event cursor',
      path: '/api/operator/updates/jobs/upd_missing/events',
      params: { after: 'not-a-number' }
    },
    {
      label: 'settlement superseded selector',
      path: '/api/operator/revenue/settlements',
      params: { includeSuperseded: 'not-a-boolean' }
    }
  ];
  for (const invalidBinding of invalidBindings) {
    const rejected = await ctx.http.get(invalidBinding.path, {
      headers: request.headers,
      params: invalidBinding.params,
      expectedStatus: 400
    });
    assert(
      rejected.status === 400,
      `${invalidBinding.label} should reject malformed query parameter types`,
      rejected.data
    );
  }
}

function assertNotEchoed(value, forbiddenValue, path) {
  assert(
    !JSON.stringify(value ?? '').includes(forbiddenValue),
    `${path} must not echo the idempotency key`
  );
}
