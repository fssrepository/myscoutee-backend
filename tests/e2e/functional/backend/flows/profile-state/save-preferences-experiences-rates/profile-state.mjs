import { assert, expectArray, expectObject, expectString } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertAuthMe, assertExperiences } from '../../../lib/contracts.mjs';

export async function assertResponse({ ctx, request }) {
  const userId = request.body.userId;
  const targetUserId = ctx.vars.e2eSecondUserId;

  const profile = await ctx.http.get('/api/auth/me', {
    headers: request.headers,
    params: { userId }
  });
  const auth = assertAuthMe(profile.data, ctx);
  assert(auth.filterPreferences?.ageMin === 25, 'saved filter preferences should round-trip through auth/me', auth.filterPreferences);

  const experienceId = `e2e-experience-${ctx.vars.runId}`;
  const savedExperiences = await ctx.http.post('/api/auth/me/experiences', {
    headers: request.headers,
    json: {
      userId,
      entries: [
        {
          id: experienceId,
          type: 'work',
          title: 'E2E Integration Tester',
          org: 'MyScoutee',
          city: 'Bratislava',
          dateFrom: '2024-01',
          dateTo: '2026-01',
          description: 'Created by the e2e collection.'
        }
      ]
    },
    expectedStatus: 200
  });
  assertExperiences(savedExperiences.data, ctx);
  assert(savedExperiences.data.entries.some(entry => entry.id === experienceId), 'saved experience should be returned');

  const loadedExperiences = await ctx.http.get('/api/auth/me/experiences', {
    headers: request.headers,
    params: { userId }
  });
  assertExperiences(loadedExperiences.data, ctx);
  assert(loadedExperiences.data.entries.some(entry => entry.id === experienceId), 'saved experience should persist');

  const rateId = `e2e-rate-${ctx.vars.runId}`;
  const rates = await ctx.http.post('/api/user-rates/sync', {
    headers: request.headers,
    json: {
      rates: [
        {
          id: rateId,
          fromUserId: userId,
          toUserId: targetUserId,
          rate: 8,
          mode: 'single',
          createdAtIso: '2026-05-24T00:00:00Z',
          updatedAtIso: '2026-05-24T00:00:00Z',
          ownerUserId: userId,
          displayId: targetUserId,
          displayDirection: 'given',
          socialContext: 'e2e',
          bridgeUserId: '',
          bridgeCount: 0,
          scoreGiven: 8,
          scoreReceived: 0,
          eventName: 'E2E Rating',
          happenedAtIso: '2026-05-24T00:00:00Z',
          distanceMetersExact: 1200
        }
      ]
    },
    expectedStatus: 200
  });
  const ratesBody = expectObject(rates.data, 'rates sync response');
  expectArray(ratesBody.syncedRateIds, 'rates sync response.syncedRateIds');
  assert(ratesBody.syncedRateIds.includes(rateId), 'rate sync should include the e2e rate id', ratesBody);

  const feedback = await ctx.http.post('/api/auth/me/feedback', {
    headers: request.headers,
    json: {
      userId,
      category: 'e2e',
      subject: 'Server e2e feedback',
      details: 'Created by the e2e profile state flow.'
    },
    expectedStatus: 200
  });
  assert(feedback.data?.submitted === true, 'feedback submit should succeed', feedback.data);

  const logout = await ctx.http.post('/api/auth/me/logout', {
    headers: request.headers,
    json: { userId },
    expectedStatus: 200
  });
  assert(logout.data?.submitted === true, 'logout action should succeed', logout.data);

  const deleted = await ctx.http.post('/api/auth/me/delete', {
    headers: {
      ...request.headers,
      'X-App-Session-Id': `e2e-profile-session-b-${ctx.vars.runId}`
    },
    json: { userId },
    expectedStatus: 200
  });
  assert(deleted.data?.submitted === true, 'delete action should succeed in e2e', deleted.data);
  expectString(deleted.data.message ?? '', 'delete action message', { allowEmpty: true });
}
