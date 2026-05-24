import { expectArray, expectObject } from '../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'member summaries').forEach((summary, index) => {
    expectObject(summary, `member summaries[${index}]`);
  });
}
