import { expectArray, expectObject } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'member summaries').forEach((summary, index) => {
    expectObject(summary, `member summaries[${index}]`);
  });
}
