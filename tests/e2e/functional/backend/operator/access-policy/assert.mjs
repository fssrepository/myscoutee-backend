import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertOperatorConfiguration } from '../../lib/operator-contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  assertOperatorConfiguration(result.data, 'authorized operator configuration');

  const rejectedIdentities = [
    {
      label: 'missing credentials',
      headers: {}
    },
    {
      label: 'demo session without an operator identity',
      headers: {
        'X-App-Session-Kind': 'demo'
      }
    },
    {
      label: 'regular demo member',
      headers: {
        'X-App-Session-Kind': 'demo',
        'X-Demo-User-Id': ctx.vars.nonOperatorUserId
      }
    },
    {
      label: 'demo administrator without operator authority',
      headers: {
        'X-App-Session-Kind': 'demo',
        'X-Demo-User-Id': ctx.vars.demoAdminUserId
      }
    },
    {
      label: 'unknown demo operator identity',
      headers: {
        'X-App-Session-Kind': 'demo',
        'X-Demo-User-Id': `missing-${ctx.vars.runId}`
      }
    }
  ];

  for (const identity of rejectedIdentities) {
    const rejected = await ctx.http.get(request.path, {
      headers: identity.headers,
      expectedStatus: 403
    });
    assert(
      rejected.status === 403,
      `${identity.label} should be rejected by the operator authority boundary`,
      rejected.data
    );
  }
}
