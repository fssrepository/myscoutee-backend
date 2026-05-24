import { expectObject, expectString } from '../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  const body = expectObject(result.data, 'realtime');
  expectString(body.userId, 'realtime.userId');
  expectObject(body.counters, 'realtime.counters');
}
