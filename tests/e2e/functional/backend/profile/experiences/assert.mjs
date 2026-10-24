import { assertExperiences } from '../../lib/contracts.mjs';

export function assertResponse({ ctx, result }) {
  assertExperiences(result.data, ctx);
}
