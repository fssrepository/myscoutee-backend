import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import {
  assertOperatorSync,
  assertRegistryStatus
} from '../../../lib/operator-contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const revenue = assertOperatorSync(result.data, 'dormant operator revenue synchronization');
  assert(revenue.state === 'DORMANT', 'revenue synchronization should be dormant before registration', revenue);
  assert(
    revenue.code === 'REGISTRY_NOT_CONFIGURED',
    'revenue synchronization should explain that no registry is configured',
    revenue
  );
  assertZeroWork(revenue, 'dormant operator revenue synchronization');

  const measurements = await ctx.http.post('/api/operator/measurements/synchronize', {
    headers: request.headers,
    expectedStatus: 200
  });
  const measurementSync = assertOperatorSync(
    measurements.data,
    'dormant operator measurement synchronization'
  );
  assert(
    measurementSync.state === 'DORMANT'
      && measurementSync.code === 'REGISTRY_NOT_CONFIGURED',
    'measurement synchronization should be dormant before registration',
    measurementSync
  );
  assertZeroWork(measurementSync, 'dormant operator measurement synchronization');

  for (const guardedRequest of [
    {
      label: 'revenue report list',
      method: 'GET',
      path: '/api/operator/revenue/reports',
      params: { page: 0, size: 10 }
    },
    {
      label: 'measurement report list',
      method: 'GET',
      path: '/api/operator/measurements/reports',
      params: { page: 0, size: 10 }
    },
    {
      label: 'revenue report requeue',
      method: 'POST',
      path: '/api/operator/revenue/reports/000000000000000000000000/requeue'
    },
    {
      label: 'measurement report requeue',
      method: 'POST',
      path: '/api/operator/measurements/reports/000000000000000000000000/requeue'
    },
    {
      label: 'operator settlements',
      method: 'GET',
      path: '/api/operator/revenue/settlements',
      params: { includeSuperseded: false, limit: 10 }
    },
    {
      label: 'claim status',
      method: 'GET',
      path: '/api/operator/claim'
    },
    {
      label: 'structured company claim',
      method: 'POST',
      path: '/api/operator/claim',
      body: {
        legalName: 'E2E Unregistered Operator',
        registrationNumber: `E2E-PRE-REG-${ctx.vars.runId}`,
        jurisdiction: 'SK',
        registeredAddress: 'E2E test address',
        website: 'https://operator.example.test',
        verificationContactName: 'E2E Operator',
        verificationContactRole: 'Owner',
        verificationContactEmail: 'operator@example.test',
        authorityAttested: true
      }
    },
    {
      label: 'claim withdrawal',
      method: 'POST',
      path: '/api/operator/claim/withdraw',
      body: {
        idempotencyKey: `pre-withdraw-${ctx.vars.runId}`
      }
    },
    {
      label: 'claimed leaderboard',
      method: 'GET',
      path: '/api/operator/leaderboard',
      params: { view: 'claimed', limit: 10 }
    },
    {
      label: 'operator announcements',
      method: 'GET',
      path: '/api/operator/announcements',
      params: { includeExpired: false, limit: 10 }
    },
    {
      label: 'generic operator network action',
      method: 'POST',
      path: '/api/operator/network/actions',
      body: {
        action: 'WITHDRAW_CLAIM',
        idempotencyKey: `pre-register-${ctx.vars.runId}`
      }
    },
    {
      label: 'grouping token issue',
      method: 'POST',
      path: '/api/operator/claim/client-token',
      body: {
        tokenTtlSeconds: 300,
        idempotencyKey: `pre-token-${ctx.vars.runId}`
      }
    },
    {
      label: 'grouping token revoke',
      method: 'POST',
      path: '/api/operator/claim/client-token/revoke',
      body: {
        referenceId: `token_${ctx.vars.runId}`,
        idempotencyKey: `pre-token-revoke-${ctx.vars.runId}`
      }
    },
    {
      label: 'grouping token redemption',
      method: 'POST',
      path: '/api/operator/claim/redeem',
      body: {
        clientToken: `client_${ctx.vars.runId}`,
        idempotencyKey: `pre-token-redeem-${ctx.vars.runId}`
      }
    },
    {
      label: 'group link revoke',
      method: 'POST',
      path: '/api/operator/claim/group-link/revoke',
      body: {
        referenceId: `link_${ctx.vars.runId}`,
        idempotencyKey: `pre-link-revoke-${ctx.vars.runId}`
      }
    },
    {
      label: 'deployment deactivation',
      method: 'POST',
      path: '/api/operator/deployment/deactivate',
      body: {
        idempotencyKey: `pre-deactivate-${ctx.vars.runId}`
      }
    },
    {
      label: 'deployment reactivation',
      method: 'POST',
      path: '/api/operator/deployment/reactivate',
      body: {
        idempotencyKey: `pre-reactivate-${ctx.vars.runId}`
      }
    },
    {
      label: 'leaderboard deployment drill-down',
      method: 'GET',
      path: '/api/operator/leaderboard/groups/group_missing/deployments',
      params: { limit: 10 }
    }
  ]) {
    const guarded = await ctx.http.request(guardedRequest.method, guardedRequest.path, {
      headers: request.headers,
      params: guardedRequest.params,
      json: guardedRequest.body,
      expectedStatus: 409
    });
    assert(
      guarded.status === 409,
      `${guardedRequest.label} should require a registered deployment`,
      guarded.data
    );
    assertNotEchoed(
      guarded.data,
      [
        guardedRequest.body?.idempotencyKey,
        guardedRequest.body?.clientToken,
        guardedRequest.body?.referenceId
      ],
      `${guardedRequest.label} rejection`
    );
  }

  for (const body of [
    {},
    {
      registryBaseUrl: 'http://registry:8080'
    },
    {
      expectedRegistryScope: 'demo:myscoutee'
    }
  ]) {
    const missingRegistrationTarget = await ctx.http.post(
      '/api/operator/registry/register',
      {
        headers: request.headers,
        json: body,
        expectedStatus: 400
      }
    );
    assert(
      missingRegistrationTarget.status === 400,
      'registry registration should require both an explicit endpoint and scope'
    );
  }

  const missingInspectionToken = `inspection_missing_${ctx.vars.runId}`;
  const missingInspection = await ctx.http.post('/api/operator/registry/confirm', {
    headers: request.headers,
    json: {
      inspectionToken: missingInspectionToken
    },
    expectedStatus: 409
  });
  assert(missingInspection.status === 409, 'registry confirmation should require a current inspection');
  assertNotEchoed(
    missingInspection.data,
    [missingInspectionToken],
    'missing registry inspection rejection'
  );

  const retryWithoutRegistration = await ctx.http.post('/api/operator/registry/retry', {
    headers: request.headers,
    expectedStatus: 409
  });
  assert(retryWithoutRegistration.status === 409, 'registry retry should require pending registration');

  const firebaseActivation = await ctx.http.post('/api/operator/configuration/firebase/activate', {
    headers: request.headers,
    expectedStatus: 409
  });
  assert(firebaseActivation.status === 409, 'Firebase activation should be unavailable in demo mode');

  const updateApproval = await ctx.http.post('/api/operator/updates', {
    headers: request.headers,
    json: {
      announcementId: 'ann_00000000000000000000000000000000'
    },
    expectedStatus: 409
  });
  assert(updateApproval.status === 409, 'package update approval should be unavailable in demo mode');

  for (const path of [
    '/api/operator/updates/jobs/upd_00000000000000000000000000000000',
    '/api/operator/updates/jobs/upd_00000000000000000000000000000000/events'
  ]) {
    const updateRead = await ctx.http.get(path, {
      headers: request.headers,
      expectedStatus: 409
    });
    assert(updateRead.status === 409, 'package update job state should be unavailable in demo mode');
  }

  const finalRegistry = await ctx.http.get('/api/operator/registry', {
    headers: request.headers,
    expectedStatus: 200
  });
  const finalStatus = assertRegistryStatus(finalRegistry.data, 'registry after pre-registration guards', {
    expectedMode: 'DEMO'
  });
  assert(
    finalStatus.lifecycle === 'UNCONFIGURED' && finalStatus.enabled === false,
    'rejected pre-registration operations must leave the registry unconfigured',
    finalStatus
  );
}

function assertZeroWork(sync, path) {
  for (const field of ['materialized', 'submitted', 'accepted', 'pending', 'blocked']) {
    assert(sync[field] === 0, `${path}.${field} should stay zero`, sync);
  }
}

function assertNotEchoed(value, forbiddenValues, path) {
  const serialized = JSON.stringify(value ?? '');
  for (const forbiddenValue of forbiddenValues.filter(Boolean)) {
    assert(
      !serialized.includes(forbiddenValue),
      `${path} must not echo request credentials or replay identifiers`
    );
  }
}
