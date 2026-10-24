import { expectObject, expectString } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  const body = expectObject(result.data, 'realtime');
  expectString(body.userId, 'realtime.userId');
  expectObject(body.counters, 'realtime.counters');
}
