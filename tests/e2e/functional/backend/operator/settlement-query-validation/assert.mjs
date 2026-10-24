import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function assertResponse({ ctx, result, request }) {
  assert(result.status === 400, 'settlement currency codes should be canonical uppercase values');

  const invalidQueries = [
    {
      label: 'invalid calendar period',
      params: {
        fromPeriod: '2026-13',
        limit: 10
      }
    },
    {
      label: 'reversed period range',
      params: {
        fromPeriod: '2026-08',
        throughPeriod: '2026-07',
        limit: 10
      }
    },
    {
      label: 'zero page size',
      params: {
        limit: 0
      }
    },
    {
      label: 'oversized page size',
      params: {
        limit: 101
      }
    },
    {
      label: 'cursor period without settlement id',
      params: {
        afterPeriod: '2026-07',
        limit: 10
      }
    },
    {
      label: 'cursor settlement id without period',
      params: {
        afterSettlementId: 'stl_00000000000000000000000000000000',
        limit: 10
      }
    },
    {
      label: 'malformed settlement cursor id',
      params: {
        afterPeriod: '2026-07',
        afterSettlementId: 'invalid',
        limit: 10
      }
    }
  ];

  for (const invalidQuery of invalidQueries) {
    const rejected = await ctx.http.get(request.path, {
      headers: request.headers,
      params: invalidQuery.params,
      expectedStatus: 400
    });
    assert(
      rejected.status === 400,
      `${invalidQuery.label} should be rejected before registry access`,
      rejected.data
    );
  }
}
