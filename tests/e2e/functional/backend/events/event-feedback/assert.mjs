import { expectArray, expectObject } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'feedback').forEach((entry, index) => {
    expectObject(entry, `feedback[${index}]`);
  });
}
