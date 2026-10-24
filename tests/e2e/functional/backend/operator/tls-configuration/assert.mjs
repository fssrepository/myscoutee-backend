import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import {
  assertNoWriteOnlyConfiguration,
  assertOperatorTlsConfiguration
} from '../../lib/operator-contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const runSlug = `${ctx.vars.runId}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36) || 'run';
  const initial = assertOperatorTlsConfiguration(
    result.data,
    'operator TLS configuration in demo mode'
  );
  assert(
    initial.capability === 'BACKEND_UNAVAILABLE'
      && initial.unavailableReason === 'operator.configuration.tls.backend.unavailable',
    'managed TLS should use the explicit unavailable projection in demo mode',
    initial
  );
  assert(
    initial.enabled === false
      && initial.mode === 'AUTOMATIC'
      && initial.domain === ''
      && initial.contactEmail === ''
      && initial.autoRenew === false
      && initial.certificateConfigured === false
      && initial.certificateIssuer === null
      && initial.certificateExpiresAt === null
      && initial.updatedAt === null,
    'unavailable managed TLS should not project host configuration state',
    initial
  );

  for (const invalidRequest of [
    {
      label: 'missing TLS apply body',
      method: 'PUT',
      path: request.path
    },
    {
      label: 'missing TLS apply mode',
      method: 'PUT',
      path: request.path,
      json: {
        enabled: false,
        autoRenew: false
      }
    },
    {
      label: 'missing TLS test body',
      method: 'POST',
      path: `${request.path}/tests`
    },
    {
      label: 'missing TLS test kind and configuration',
      method: 'POST',
      path: `${request.path}/tests`,
      json: {}
    }
  ]) {
    const rejected = await ctx.http.request(
      invalidRequest.method,
      invalidRequest.path,
      {
        headers: request.headers,
        json: invalidRequest.json,
        expectedStatus: 400
      }
    );
    assert(
      rejected.status === 400,
      `${invalidRequest.label} should fail request validation`,
      rejected.data
    );
    assertNoWriteOnlyConfiguration(
      rejected.data,
      `${invalidRequest.label} response`
    );
  }

  const automaticConfiguration = {
    enabled: true,
    mode: 'AUTOMATIC',
    domain: `tls-${runSlug}.example.test`,
    contactEmail: `tls+${runSlug}@example.test`,
    autoRenew: true,
    certificate: '',
    privateKey: ''
  };
  const unavailableApply = await ctx.http.request('PUT', request.path, {
    headers: request.headers,
    json: automaticConfiguration,
    expectedStatus: 503
  });
  assert(
    unavailableApply.status === 503,
    'managed TLS apply should fail closed in demo mode',
    unavailableApply.data
  );
  assertNoWriteOnlyConfiguration(
    unavailableApply.data,
    'unavailable TLS apply response'
  );

  const certificateMarker = `e2e-certificate-${runSlug}`;
  const privateKeyMarker = `e2e-private-key-${runSlug}`;
  const certificate = [
    '-----BEGIN CERTIFICATE-----',
    certificateMarker,
    '-----END CERTIFICATE-----'
  ].join('\n');
  const privateKey = [
    '-----BEGIN PRIVATE KEY-----',
    privateKeyMarker,
    '-----END PRIVATE KEY-----'
  ].join('\n');
  const forbiddenSecrets = [
    certificate,
    privateKey,
    certificateMarker,
    privateKeyMarker
  ];
  const unavailableCertificateTest = await ctx.http.post(`${request.path}/tests`, {
    headers: request.headers,
    json: {
      kind: 'CERTIFICATE',
      configuration: {
        enabled: true,
        mode: 'MANUAL',
        domain: `tls-${runSlug}.example.test`,
        contactEmail: '',
        autoRenew: false,
        certificate,
        privateKey
      }
    },
    expectedStatus: 503
  });
  assert(
    unavailableCertificateTest.status === 503,
    'managed TLS certificate testing should fail closed in demo mode',
    unavailableCertificateTest.data
  );
  assertNoWriteOnlyConfiguration(
    unavailableCertificateTest.data,
    'unavailable TLS certificate-test response',
    forbiddenSecrets
  );
  assertSecretsHidden(
    unavailableCertificateTest,
    forbiddenSecrets,
    'unavailable TLS certificate-test response'
  );

  const unavailableJob = await ctx.http.get(
    `${request.path}/jobs/tls_00000000000000000000000000000000`,
    {
      headers: request.headers,
      expectedStatus: 503
    }
  );
  assert(
    unavailableJob.status === 503,
    'managed TLS job state should fail closed in demo mode',
    unavailableJob.data
  );

  const afterResult = await ctx.http.get(request.path, {
    headers: request.headers,
    expectedStatus: 200
  });
  const after = assertOperatorTlsConfiguration(
    afterResult.data,
    'operator TLS configuration after rejected requests',
    { forbiddenValues: forbiddenSecrets }
  );
  assert(
    JSON.stringify(after) === JSON.stringify(initial),
    'rejected TLS requests must not mutate the unavailable projection',
    {
      before: initial,
      after
    }
  );
}

function assertSecretsHidden(result, forbiddenValues, path) {
  const rawResponse = `${result.text ?? ''}\n${JSON.stringify(result.data ?? '')}`;
  for (const forbiddenValue of forbiddenValues.filter(Boolean)) {
    assert(
      !rawResponse.includes(forbiddenValue),
      `${path} must not echo certificate material`
    );
  }
}
