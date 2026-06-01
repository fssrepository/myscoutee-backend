import { expectObject, expectOptionalString } from '../../../../shared/assertions.mjs';

export function assertResponse({ result }) {
  const rule = expectObject(result.data, 'admin notification rule runtime');
  expectOptionalString(rule.ruleKey, 'admin notification rule runtime.ruleKey');
  expectOptionalString(rule.title, 'admin notification rule runtime.title');
}
