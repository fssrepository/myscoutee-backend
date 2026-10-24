import { assertIdeaPost } from '../../lib/contracts.mjs';
import {
  assert,
  expectArray,
  expectNumber,
  expectObject,
  expectOptionalString
} from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  const response = expectObject(result.data, 'admin ideas page');
  const records = expectArray(response.records, 'admin ideas page.records');
  records.forEach((idea, index) => {
    assertIdeaPost(idea, `admin ideas page.records[${index}]`);
    assert(idea.published === true && idea.trashed !== true, 'published page should only include published non-trashed ideas', idea);
  });
  const total = expectNumber(response.total, 'admin ideas page.total');
  expectOptionalString(response.nextCursor, 'admin ideas page.nextCursor');
  const counts = expectObject(response.counts, 'admin ideas page.counts');
  ['all', 'featured', 'published', 'drafts', 'trashed'].forEach(key => {
    expectNumber(counts[key], `admin ideas page.counts.${key}`);
  });
  assert(total === counts.published, 'published page total should match published counter', {
    total,
    published: counts.published
  });
  assert(records.length <= 2, 'published page should respect pageSize=2', { count: records.length });
}
