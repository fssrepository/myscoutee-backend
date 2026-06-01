import { assertI18nBundle } from '../../lib/contracts.mjs';

export function assertResponse({ result }) {
  assertI18nBundle(result.data);
}
