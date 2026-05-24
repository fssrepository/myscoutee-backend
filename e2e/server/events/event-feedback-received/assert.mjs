import { expectArray, expectObject } from '../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  expectArray(result.data, 'received event feedback').forEach((entry, index) => {
    expectObject(entry, `received event feedback[${index}]`);
  });
}
