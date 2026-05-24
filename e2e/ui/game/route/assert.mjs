import { assertActiveBackendCalls, settleFirstRunOverlays } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await settleFirstRunOverlays(page);
  await page.waitForNetwork('/api/game-cards/query', { timeoutMs: 30000 });
  await page.recordStep('game-after-overlays');
  await page.waitFor('global navigator button enabled', async () => page.evaluate(() => {
    const button = document.querySelector('button.user-selector-btn-global');
    return Boolean(button && !button.disabled);
  }), 30000);
  await assertActiveBackendCalls(page, [
    '/api/auth/me',
    '/api/game-cards/query'
  ]);
}
