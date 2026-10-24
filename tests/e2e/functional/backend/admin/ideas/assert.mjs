import { assertIdeaPost } from '../../lib/contracts.mjs';
import { expectArray } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'admin ideas').forEach((idea, index) => assertIdeaPost(idea, `admin ideas[${index}]`));
}
