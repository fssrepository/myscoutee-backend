import { expectString } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function prepare({ ctx }) {
  const detail = await ctx.http.get('/api/activities/events/detail', {
    headers: { 'X-App-Session-Kind': 'demo' },
    params: { userId: ctx.vars.userId, eventId: ctx.vars.eventId },
    expectedStatus: 200
  });
  // An explore-list reader need not be a member. Exercise the editor as its owner.
  const creatorUserId = expectString(detail.data?.creatorUserId, 'event creator');
  return { headers: { 'X-Demo-User-Id': creatorUserId } };
}
