import { assert, expectObject } from '../../../../../shared/assertions.mjs';

const ADMIN_USER_ID = 'admin-demo-ava';
const NON_ADMIN_USER_ID = 'bf057de7c586eede7e84bdc7';

export async function assertResponse({ ctx, result, request }) {
  assert(result.data?.submitted === true, 'report setup should be accepted before support-case policy check', result.data);

  const targetUserId = request.body.targetUserId;
  const supportChatId = `c-support-admin-${targetUserId}`;

  await ctx.http.post(`/api/admin/users/${targetUserId}/warn`, {
    headers: request.headers,
    json: {
      adminUserId: ADMIN_USER_ID,
      message: `Functional support case ${ctx.vars.runId}`
    },
    expectedStatus: 200
  });

  await ctx.http.post(`/api/activities/chats/${supportChatId}/support-case`, {
    headers: request.headers,
    params: { userId: NON_ADMIN_USER_ID },
    json: {
      userId: NON_ADMIN_USER_ID,
      action: 'pick'
    },
    expectedStatus: 403
  });

  const picked = await ctx.http.post(`/api/activities/chats/${supportChatId}/support-case`, {
    headers: request.headers,
    params: { userId: ADMIN_USER_ID },
    json: {
      userId: ADMIN_USER_ID,
      action: 'pick'
    },
    expectedStatus: 200
  });
  const summary = expectObject(picked.data, 'admin support-case pick response');
  assert(summary.supportCaseStatus === 'picked', 'admin should be able to pick support case', summary);
  assert(summary.supportCaseAssigneeUserId === ADMIN_USER_ID, 'support case should be assigned to the admin actor', summary);
}
