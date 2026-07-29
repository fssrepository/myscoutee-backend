import { assert } from '../../../../shared/assertions.mjs';

export async function assertResponse({ ctx, result, request }) {
  assert(result.status === 400, 'operator bootstrap login should reject demo sessions');
  assertSecretsHidden(result.data, [
    request.body.password
  ], 'demo-session bootstrap rejection');

  const oversizedPassword = `bootstrap-${'p'.repeat(513)}`;
  const invalidLogins = [
    {
      label: 'missing bootstrap fields',
      body: {}
    },
    {
      label: 'malformed bootstrap e-mail',
      body: {
        email: 'not-an-email',
        password: 'malformed-email-password'
      },
      secrets: ['malformed-email-password']
    },
    {
      label: 'oversized bootstrap password',
      body: {
        email: 'bootstrap-probe@example.test',
        password: oversizedPassword
      },
      secrets: [oversizedPassword]
    }
  ];
  for (const invalidLogin of invalidLogins) {
    const rejected = await ctx.http.post(request.path, {
      headers: {
        'X-Forwarded-Proto': 'https'
      },
      json: invalidLogin.body,
      expectedStatus: 400
    });
    assert(
      rejected.status === 400,
      `${invalidLogin.label} should fail input validation`,
      rejected.data
    );
    assertSecretsHidden(
      rejected.data,
      invalidLogin.secrets ?? [],
      `${invalidLogin.label} response`
    );
  }

  const unknownPassword = `unknown-bootstrap-${ctx.vars.runId}-7q9w`;
  const unknownLogin = await ctx.http.post(request.path, {
    headers: {
      'X-Forwarded-Proto': 'https'
    },
    json: {
      email: `missing-bootstrap-${ctx.vars.runId}@example.test`,
      password: unknownPassword
    },
    expectedStatus: 404
  });
  assert(
    unknownLogin.status === 404,
    'an unconfigured bootstrap identity should not disclose credential validity',
    unknownLogin.data
  );
  assertSecretsHidden(unknownLogin.data, [unknownPassword], 'unknown bootstrap response');

  const invalidToken = `invalid-bootstrap-token-${ctx.vars.runId}`;
  const tokenRejection = await ctx.http.get('/api/operator/configuration', {
    headers: {
      Authorization: `OperatorBootstrap ${invalidToken}`,
      'X-Forwarded-Proto': 'https'
    },
    expectedStatus: 401
  });
  assert(tokenRejection.status === 401, 'an invalid bootstrap token should be rejected');
  assertSecretsHidden(tokenRejection.data, [invalidToken], 'invalid bootstrap token response');

  const mixedSessionRejection = await ctx.http.get('/api/operator/configuration', {
    headers: {
      Authorization: `OperatorBootstrap ${invalidToken}`,
      'X-Forwarded-Proto': 'https',
      'X-App-Session-Kind': 'demo',
      'X-Demo-User-Id': ctx.vars.operatorUserId
    },
    expectedStatus: 401
  });
  assert(
    mixedSessionRejection.status === 401,
    'bootstrap authorization must not be combined with a demo session'
  );
  assertSecretsHidden(
    mixedSessionRejection.data,
    [invalidToken],
    'mixed bootstrap/demo response'
  );
}

function assertSecretsHidden(value, secrets, path) {
  const serialized = JSON.stringify(value ?? '');
  for (const secret of secrets.filter(Boolean)) {
    assert(!serialized.includes(secret), `${path} must not echo a credential`);
  }
}
