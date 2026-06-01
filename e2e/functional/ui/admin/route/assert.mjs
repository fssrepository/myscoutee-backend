import { assertActiveBackendCalls, settleFirstRunOverlays } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.admin-workspace');
  await settleFirstRunOverlays(page);
  await page.recordStep('admin-workspace-after-overlays');
  await page.waitForSelector('button.user-selector-btn-global');
  await assertActiveBackendCalls(page, [
    '/api/admin/dashboard'
  ]);
}
