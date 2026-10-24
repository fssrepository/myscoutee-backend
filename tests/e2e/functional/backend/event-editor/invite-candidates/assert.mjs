import { assertActivityMembers } from '../../lib/contracts.mjs';
import {
  assert,
  expectNumber,
  expectObject
} from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  const page = expectObject(result.data, 'invite candidates page');
  assertActivityMembers(page.items);
  const total = expectNumber(page.total, 'invite candidates page.total');
  const pageNumber = expectNumber(page.page, 'invite candidates page.page');
  const pageSize = expectNumber(page.pageSize, 'invite candidates page.pageSize');

  assert(Number.isInteger(total) && total >= 0, 'invite candidates page.total should be a non-negative integer');
  assert(Number.isInteger(pageNumber) && pageNumber >= 0, 'invite candidates page.page should be a non-negative integer');
  assert(
    Number.isInteger(pageSize) && pageSize >= 1 && pageSize <= 100,
    'invite candidates page.pageSize should be an integer between 1 and 100'
  );
  assert(page.items.length <= pageSize, 'invite candidates page should respect pageSize');
  assert(total >= page.items.length, 'invite candidates total should cover the returned page');
}
