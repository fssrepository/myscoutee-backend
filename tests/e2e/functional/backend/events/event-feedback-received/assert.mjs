import { expectArray, expectObject } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'received feedback').forEach((entry, index) => {
    expectObject(entry, `received feedback[${index}]`);
  });
}
