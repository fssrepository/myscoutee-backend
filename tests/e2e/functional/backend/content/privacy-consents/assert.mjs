import { assert, expectObject, expectOptionalString, expectString } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertHelpState } from '../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  assertHelpState(result.data, ctx, 'active privacy state');
  const revision = result.data.activeRevision ?? result.data.revisions?.[0];
  assert(revision?.id, 'active privacy revision should be available for consent lookup', result.data);
  const consent = await ctx.http.get('/api/privacy/consents', {
    headers: request.headers,
    params: {
      userId: ctx.vars.userId,
      revisionId: revision.id,
      revisionVersion: revision.version
    },
    expectedStatus: 200
  });
  if (consent.data === null || consent.data === undefined) {
    return;
  }
  const body = expectObject(consent.data, 'privacy consent');
  expectString(body.userId, 'privacy consent.userId');
  expectString(body.revisionId, 'privacy consent.revisionId');
  expectOptionalString(body.source, 'privacy consent.source');
}
