import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoWriteOnlyConfiguration,
  assertOperatorConfiguration
} from '../../lib/operator-contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  assert(result.status === 400, 'a Firebase capability test kind should be required');

  const oversizedDestinationToken = `destination-${'x'.repeat(4097)}`;
  const oversizedReadinessToken = `readiness-${'y'.repeat(4097)}`;
  const oversizedBrowserAppId = `app-${'z'.repeat(257)}`;
  const invalidRequests = [
    {
      label: 'unknown capability kind',
      body: {
        kind: 'LIVE_PROBE'
      }
    },
    {
      label: 'oversized destination token',
      forbiddenValue: oversizedDestinationToken,
      body: {
        kind: 'FIREBASE_MESSAGING',
        destinationToken: oversizedDestinationToken
      }
    },
    {
      label: 'oversized browser readiness token',
      forbiddenValue: oversizedReadinessToken,
      body: {
        kind: 'FIREBASE_MESSAGING',
        browserReadinessToken: oversizedReadinessToken
      }
    },
    {
      label: 'oversized browser app id',
      forbiddenValue: oversizedBrowserAppId,
      body: {
        kind: 'FIREBASE_MESSAGING',
        browserAppId: oversizedBrowserAppId
      }
    },
    {
      label: 'non-numeric browser configuration revision',
      body: {
        kind: 'FIREBASE_MESSAGING',
        browserConfigurationRevision: 'not-a-number'
      }
    }
  ];

  for (const invalidRequest of invalidRequests) {
    const rejected = await ctx.http.post(request.path, {
      headers: request.headers,
      json: invalidRequest.body,
      expectedStatus: 400
    });
    assert(
      rejected.status === 400,
      `${invalidRequest.label} should be rejected before capability execution`,
      rejected.data
    );
    assertNoWriteOnlyConfiguration(
      rejected.data,
      `${invalidRequest.label} error response`,
      invalidRequest.forbiddenValue ? [invalidRequest.forbiddenValue] : []
    );
  }

  const afterResult = await ctx.http.get('/api/operator/configuration', {
    headers: request.headers,
    expectedStatus: 200
  });
  const after = assertOperatorConfiguration(
    afterResult.data,
    'operator configuration after rejected Firebase requests'
  );
  const baseline = assertOperatorConfiguration(
    ctx.vars.firebaseValidationBaseline,
    'operator configuration before rejected Firebase requests'
  );
  assert(
    JSON.stringify(after) === JSON.stringify(baseline),
    'rejected Firebase capability requests must not mutate operator configuration'
  );
}
