import { expectArray, expectObject } from '../../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'received feedback').forEach((entry, index) => {
    expectObject(entry, `received feedback[${index}]`);
  });
}
