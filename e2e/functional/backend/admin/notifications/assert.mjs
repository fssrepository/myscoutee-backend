import { expectArray, expectObject } from '../../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  const state = expectObject(result.data, 'admin notifications');
  expectArray(state.rules ?? [], 'admin notifications.rules');
  expectArray(state.outbox ?? state.recentOutbox ?? [], 'admin notifications.outbox');
}
