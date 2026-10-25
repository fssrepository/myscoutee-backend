import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function assertResponse({ ctx, result, request }) {
  assert(result.status === 400, 'password login should reject demo sessions');
  assertSecretsHidden(result.data, [
    request.body.password
  ], 'demo-session bootstrap rejection');
  const realHeaders = { 'X-App-Session-Kind': 'real', 'X-App-Session-Id': 'session:login-boundary' };
  const secureTransport = new URL(ctx.http.baseUrl).protocol === 'https:';

  const oversizedPassword = `bootstrap-${'p'.repeat(513)}`;
  const invalidLogins = [
    {
      label: 'missing bootstrap fields',
      body: { attemptId: '' }
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
      json: { attemptId: 'attempt:invalid-login', ...invalidLogin.body },
      headers: realHeaders,
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
    headers: realHeaders,
    json: {
      attemptId: 'attempt:unknown-login',
      email: `missing-bootstrap-${ctx.vars.runId}@example.test`,
      password: unknownPassword
    },
    expectedStatus: secureTransport ? 404 : 426
  });
  assert(
    unknownLogin.status === (secureTransport ? 404 : 426),
    secureTransport
      ? 'an unconfigured bootstrap identity should not disclose credential validity'
      : 'cleartext bootstrap login should require HTTPS before evaluating credentials',
    unknownLogin.data
  );
  assertSecretsHidden(unknownLogin.data, [unknownPassword], 'unknown bootstrap response');

  const invalidToken = `invalid-bootstrap-token-${ctx.vars.runId}`;
  const tokenRejection = await ctx.http.get('/api/operator/configuration', {
    headers: {
      Authorization: `Bearer ${invalidToken}`
    },
    expectedStatus: 401
  });
  assert(
    tokenRejection.status === 401,
    secureTransport
      ? 'an invalid bootstrap token should be rejected'
      : 'an invalid app session must be rejected independently of role'
  );
  assertSecretsHidden(tokenRejection.data, [invalidToken], 'invalid bootstrap token response');

  const mixedSessionRejection = await ctx.http.get('/api/operator/configuration', {
    headers: {
      Authorization: `Bearer ${invalidToken}`,
      'X-App-Session-Kind': 'demo',
      'X-Demo-User-Id': ctx.vars.operatorUserId
    },
    expectedStatus: 401
  });
  assert(
    mixedSessionRejection.status === 401,
    secureTransport
      ? 'bootstrap authorization must not be combined with a demo session'
      : 'conflicting account and demo credentials must be rejected'
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
