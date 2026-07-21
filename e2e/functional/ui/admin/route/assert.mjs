import { assertActiveBackendCalls, settleFirstRunOverlays } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.admin-workspace');
  await settleFirstRunOverlays(page);
  await page.recordStep('admin-workspace-after-overlays');
  await page.waitForSelector('.user-selector-menu button[aria-label="Open user menu"]');
  await assertActiveBackendCalls(page, [
    '/api/admin/dashboard'
  ]);
}
