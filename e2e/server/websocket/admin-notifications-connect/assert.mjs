import { assert } from '../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  assert(result.status === 101, 'admin notifications websocket should open', result);
  assert(!result.error, 'admin notifications websocket should not report an error', result);
}
