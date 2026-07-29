import { assert } from '../../../../shared/assertions.mjs';
import { assertOperatorConfiguration } from '../../lib/operator-contracts.mjs';

export async function assertResponse({ ctx, result }) {
  assertOperatorConfiguration(result.data, 'authorized operator authority probe');

  const controllerReads = [
    {
      label: 'configuration controller',
      path: '/api/operator/configuration'
    },
    {
      label: 'registry controller',
      path: '/api/operator/registry'
    },
    {
      label: 'community controller',
      path: '/api/operator/community/providers'
    },
    {
      label: 'revenue controller',
      path: '/api/operator/revenue'
    },
    {
      label: 'measurement controller',
      path: '/api/operator/measurements/reports',
      params: { page: 0, size: 1 }
    },
    {
      label: 'network controller',
      path: '/api/operator/claim'
    },
    {
      label: 'update controller',
      path: '/api/operator/updates'
    }
  ];
  const rejectedIdentities = [
    {
      label: 'missing credentials',
      headers: {}
    },
    {
      label: 'anonymous demo session',
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
      label: 'demo administrator',
      headers: {
        'X-App-Session-Kind': 'demo',
        'X-Demo-User-Id': ctx.vars.demoAdminUserId
      }
    }
  ];

  for (const controller of controllerReads) {
    for (const identity of rejectedIdentities) {
      const rejected = await ctx.http.get(controller.path, {
        params: controller.params,
        headers: identity.headers,
        expectedStatus: 403
      });
      assert(
        rejected.status === 403,
        `${identity.label} should not reach the ${controller.label}`,
        {
          path: controller.path,
          body: rejected.data
        }
      );
    }
  }
}
