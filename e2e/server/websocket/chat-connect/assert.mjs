import { assert } from '../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  assert(result.status === 101, 'chat websocket should open', result);
  assert(!result.error, 'chat websocket should not report an error', result);
  assert(result.closed === null || result.closed.code === 1000, 'chat websocket should close cleanly after e2e probe', result);
}
