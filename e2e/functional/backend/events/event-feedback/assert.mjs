import { expectArray, expectObject } from '../../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'feedback').forEach((entry, index) => {
    expectObject(entry, `feedback[${index}]`);
  });
}
