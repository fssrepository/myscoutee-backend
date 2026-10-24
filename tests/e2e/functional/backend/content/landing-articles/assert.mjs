import { assertIdeaPost } from '../../lib/contracts.mjs';
import {
  assert,
  expectArray,
  expectNumber,
  expectObject,
  expectOptionalString
} from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  const response = expectObject(result.data, 'landing articles page');
  const records = expectArray(response.records, 'landing articles page.records');
  records.forEach((idea, index) => {
    assertIdeaPost(idea, `landing articles page.records[${index}]`);
    assert(idea.published === true, 'public article page should only contain published records', idea);
    assert(idea.trashed !== true, 'public article page should exclude trashed records', idea);
    assert(idea.lang === 'en', 'public article page should use the requested language', idea);
  });
  const total = expectNumber(response.total, 'landing articles page.total');
  expectOptionalString(response.nextCursor, 'landing articles page.nextCursor');
  assert(records.length <= 2, 'public article page should respect pageSize=2', { count: records.length });
  assert(total >= records.length, 'public article total should cover the returned page', {
    total,
    count: records.length
  });
}
