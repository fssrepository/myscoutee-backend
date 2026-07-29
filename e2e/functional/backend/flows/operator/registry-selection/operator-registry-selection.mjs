import {
  assert,
  expectArray,
  expectBoolean,
  expectKeys,
  expectNumber
} from '../../../../../shared/assertions.mjs';
import {
  assertRegistryInspection,
  assertRegistryStatus
} from '../../../lib/operator-contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const initialStatus = assertRegistryStatus(result.data, 'initial operator registry', {
    expectedMode: 'DEMO'
  });
  assert(
    initialStatus.lifecycle === 'UNCONFIGURED' && initialStatus.enabled === false,
    'registry selection flow requires the clean unconfigured e2e seed',
    initialStatus
  );

  let cleanupRequired = true;
  try {
    const inspectionResult = await ctx.http.post('/api/operator/registry/inspect', {
      headers: request.headers,
      json: {},
      expectedStatus: 200,
      timeoutMs: 12000
    });
    const inspection = assertRegistryInspection(inspectionResult.data);
    assert(
      inspection.baseUrl === 'http://registry:8080',
      'demo registry inspection should stay on the isolated registry endpoint',
      inspection
    );
    assert(
      inspection.registryIdentity.registryScope === 'demo:myscoutee',
      'demo registry inspection should verify the seeded registry scope',
      inspection
    );

    const inspectedStatusResult = await ctx.http.get('/api/operator/registry', {
      headers: request.headers,
      expectedStatus: 200
    });
    const inspectedStatus = assertRegistryStatus(
      inspectedStatusResult.data,
      'registry after inspection',
      { expectedMode: 'DEMO' }
    );
    assert(
      inspectedStatus.lifecycle === 'INSPECTED'
        && inspectedStatus.enabled === false
        && inspectedStatus.draftInspection?.baseUrl === inspection.baseUrl
        && inspectedStatus.draftInspection?.registryScope
          === inspection.registryIdentity.registryScope,
      'inspection should persist only a disabled draft selection',
      inspectedStatus
    );
    assert(
      !JSON.stringify(inspectedStatus).includes(inspection.inspectionToken),
      'registry status must not expose the confirmation token'
    );

    for (const invalidInspection of [
      {
        label: 'different demo registry endpoint',
        body: {
          baseUrl: 'http://example.invalid',
          expectedScope: 'demo:myscoutee'
        }
      },
      {
        label: 'different demo registry scope',
        body: {
          baseUrl: 'http://registry:8080',
          expectedScope: 'demo:different'
        }
      },
      {
        label: 'registry URL with user information',
        body: {
          baseUrl: 'http://operator@registry:8080',
          expectedScope: 'demo:myscoutee'
        }
      },
      {
        label: 'registry URL with a query string',
        body: {
          baseUrl: 'http://registry:8080?probe=true',
          expectedScope: 'demo:myscoutee'
        }
      },
      {
        label: 'registry URL with a fragment',
        body: {
          baseUrl: 'http://registry:8080#identity',
          expectedScope: 'demo:myscoutee'
        }
      },
      {
        label: 'registry URL with a non-root path',
        body: {
          baseUrl: 'http://registry:8080/v1',
          expectedScope: 'demo:myscoutee'
        }
      }
    ]) {
      const rejected = await ctx.http.post('/api/operator/registry/inspect', {
        headers: request.headers,
        json: invalidInspection.body,
        expectedStatus: 400
      });
      assert(
        rejected.status === 400,
        `${invalidInspection.label} should be rejected before registry egress`,
        rejected.data
      );
    }

    const replacementInspectionResult = await ctx.http.post(
      '/api/operator/registry/inspect',
      {
        headers: request.headers,
        json: {
          baseUrl: 'http://registry:8080/',
          expectedScope: 'demo:myscoutee'
        },
        expectedStatus: 200,
        timeoutMs: 12000
      }
    );
    const replacementInspection = assertRegistryInspection(
      replacementInspectionResult.data,
      'replacement operator registry inspection'
    );
    assert(
      replacementInspection.baseUrl === inspection.baseUrl
        && replacementInspection.inspectionToken !== inspection.inspectionToken,
      'a new inspection should normalize the root URL and replace the prior token',
      replacementInspection
    );

    const staleConfirmation = await ctx.http.post('/api/operator/registry/confirm', {
      headers: request.headers,
      json: {
        inspectionToken: inspection.inspectionToken
      },
      expectedStatus: 409
    });
    assert(
      staleConfirmation.status === 409,
      'a newer inspection should invalidate the previous confirmation token'
    );
    assert(
      !JSON.stringify(staleConfirmation.data ?? '').includes(inspection.inspectionToken),
      'a stale confirmation token must not be echoed'
    );

    const missingConfirmation = await ctx.http.post('/api/operator/registry/confirm', {
      headers: request.headers,
      json: {},
      expectedStatus: 409
    });
    assert(
      missingConfirmation.status === 409,
      'a missing confirmation token should not consume the active inspection'
    );

    const invalidToken = `inspection_invalid_${ctx.vars.runId}`;
    const rejectedConfirmation = await ctx.http.post('/api/operator/registry/confirm', {
      headers: request.headers,
      json: {
        inspectionToken: invalidToken
      },
      expectedStatus: 409
    });
    assert(
      rejectedConfirmation.status === 409,
      'an invalid confirmation token should not consume the current inspection'
    );
    assert(
      !JSON.stringify(rejectedConfirmation.data ?? '').includes(invalidToken),
      'an invalid confirmation token must not be echoed'
    );

    const confirmedResult = await ctx.http.post('/api/operator/registry/confirm', {
      headers: request.headers,
      json: {
        inspectionToken: replacementInspection.inspectionToken
      },
      expectedStatus: 200,
      timeoutMs: 12000
    });
    const confirmed = assertRegistryStatus(
      confirmedResult.data,
      'confirmed operator registry',
      { expectedMode: 'DEMO' }
    );
    assert(
      confirmed.lifecycle === 'CONFIGURED'
        && confirmed.enabled === true
        && confirmed.selection?.baseUrl === replacementInspection.baseUrl
        && confirmed.selection?.registryIdentity?.registryScope
          === replacementInspection.registryIdentity.registryScope,
      'confirmation should enable the verified selection without registering',
      confirmed
    );
    assert(confirmed.draftInspection === null, 'confirmation should consume the draft inspection');
    assert(confirmed.enrollment === null, 'confirmation alone must not register the deployment');
    assert(
      !JSON.stringify(confirmed).includes(replacementInspection.inspectionToken),
      'confirmed registry status must not expose the consumed token'
    );

    const reusedConfirmation = await ctx.http.post('/api/operator/registry/confirm', {
      headers: request.headers,
      json: {
        inspectionToken: replacementInspection.inspectionToken
      },
      expectedStatus: 409
    });
    assert(reusedConfirmation.status === 409, 'an inspection token should be single-use');

    const retryWithoutRegistration = await ctx.http.post('/api/operator/registry/retry', {
      headers: request.headers,
      expectedStatus: 409
    });
    assert(
      retryWithoutRegistration.status === 409,
      'a confirmed selection should not create an implicit registration retry'
    );

    for (const path of [
      '/api/operator/claim',
      '/api/operator/leaderboard?view=claimed&limit=10',
      '/api/operator/announcements?includeExpired=false&limit=10'
    ]) {
      const networkRead = await ctx.http.get(path, {
        headers: request.headers,
        expectedStatus: 409
      });
      assert(
        networkRead.status === 409,
        'operator network reads should still require explicit deployment registration',
        { path, body: networkRead.data }
      );
    }

    const disconnectedResult = await ctx.http.post('/api/operator/registry/disconnect', {
      headers: request.headers,
      expectedStatus: 200,
      timeoutMs: 12000
    });
    assertDisconnectMutation(disconnectedResult.data, 'operator registry disconnect');
    cleanupRequired = false;

    const finalResult = await ctx.http.get('/api/operator/registry', {
      headers: request.headers,
      expectedStatus: 200
    });
    const finalStatus = assertRegistryStatus(finalResult.data, 'registry after disconnect', {
      expectedMode: 'DEMO'
    });
    assert(
      finalStatus.lifecycle === 'UNCONFIGURED'
        && finalStatus.enabled === false
        && finalStatus.draftInspection === null
        && finalStatus.selection === null
        && finalStatus.enrollment === null,
      'disconnect should return registry selection state to unconfigured',
      finalStatus
    );

    const repeatedDisconnectResult = await ctx.http.post(
      '/api/operator/registry/disconnect',
      {
        headers: request.headers,
        expectedStatus: 200,
        timeoutMs: 12000
      }
    );
    assertDisconnectMutation(
      repeatedDisconnectResult.data,
      'repeated operator registry disconnect'
    );
  } finally {
    if (cleanupRequired) {
      await ctx.http.post('/api/operator/registry/disconnect', {
        headers: request.headers,
        allowStatuses: [200, 409, 502, 503],
        timeoutMs: 12000
      }).catch(() => undefined);
    }
  }
}

function assertDisconnectMutation(value, path) {
  const mutation = expectKeys(value, [
    'status',
    'leaderboardEntry',
    'leaderboardUpserts',
    'removedLeaderboardEntryIds',
    'leaderboardTotalDelta',
    'created'
  ], path);
  const status = assertRegistryStatus(mutation.status, `${path}.status`, {
    expectedMode: 'DEMO'
  });
  assert(
    status.lifecycle === 'UNCONFIGURED' && status.enabled === false,
    `${path}.status should be unconfigured`,
    status
  );
  assert(mutation.leaderboardEntry === null, `${path}.leaderboardEntry should be null`);
  const upserts = expectArray(mutation.leaderboardUpserts, `${path}.leaderboardUpserts`);
  const removed = expectArray(
    mutation.removedLeaderboardEntryIds,
    `${path}.removedLeaderboardEntryIds`
  );
  assert(upserts.length === 0, `${path}.leaderboardUpserts should stay empty without enrollment`);
  assert(removed.length === 0, `${path}.removedLeaderboardEntryIds should stay empty without enrollment`);
  const delta = expectNumber(mutation.leaderboardTotalDelta, `${path}.leaderboardTotalDelta`);
  assert(delta === 0, `${path}.leaderboardTotalDelta should stay zero without enrollment`);
  expectBoolean(mutation.created, `${path}.created`);
  assert(mutation.created === false, `${path}.created should be false for disconnect`);
}
