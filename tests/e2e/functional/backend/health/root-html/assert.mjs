import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export function assertResponse({ result }) {
  const contentType = `${result.headers['content-type'] ?? ''}`.toLowerCase();
  assert(contentType.includes('text/html'), 'root should return HTML', { contentType });
  assert(result.text.includes('<app-root') || result.text.includes('main'), 'root HTML should look like the Angular shell');
}
