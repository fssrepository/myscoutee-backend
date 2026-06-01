import { expectArray, expectObject } from '../../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'event feedback').forEach((entry, index) => {
    expectObject(entry, `event feedback[${index}]`);
  });
}
