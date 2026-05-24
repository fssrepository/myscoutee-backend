import { assert, expectArray, expectObject, expectString } from '../../../../shared/assertions.mjs';
import { assertHelpState } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  assertHelpState(result.data, ctx, 'created explanation state');
  const revisions = expectArray(result.data.revisions, 'created explanation state.revisions');
  const revision = revisions.find(item => item.title === request.body.title);
  assert(revision, 'created explanation revision should be present', result.data);
  const revisionId = expectString(revision.id, 'created explanation revision.id');

  const deleted = await ctx.http.request('DELETE', `/api/admin/explanation/revisions/${revisionId}`, {
    headers: request.headers,
    json: {
      actorUserId: request.body.actorUserId
    },
    expectedStatus: 200
  });
  const deletedState = expectObject(deleted.data, 'deleted explanation state');
  assertHelpState(deletedState, ctx, 'deleted explanation state');
  assert(
    !(deletedState.revisions ?? []).some(item => item.id === revisionId),
    'deleted explanation revision should be removed from state',
    deletedState
  );
}
