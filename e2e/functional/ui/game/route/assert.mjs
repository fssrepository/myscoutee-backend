import { assert } from '../../../../shared/assertions.mjs';
import { assertActiveBackendCalls, settleFirstRunOverlays } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await settleFirstRunOverlays(page);
  const paused = await page.evaluate(() => {
    const text = document.body.innerText ?? '';
    return {
      visible: text.includes('Game discovery is paused'),
      text: text.slice(0, 500)
    };
  });
  if (paused.visible) {
    page.recordFinding?.({
      severity: 'fatal',
      title: 'Game discovery is paused, so the UI does not request game cards',
      details: paused
    });
    assert(false, 'Game discovery is paused; the suite demo user must be Public before expecting /api/game-cards/query', paused);
  }
  await page.waitForNetwork('/api/game-cards/query', { timeoutMs: 30000 });
  await page.recordStep('game-after-overlays');
  await page.waitFor('global navigator button enabled', async () => page.evaluate(() => {
    const button = document.querySelector('.navigator-trigger-rail:not(.is-covered) .user-selector-menu button[aria-label="Open user menu"]');
    return Boolean(button && !button.disabled);
  }), 30000);
  await assertActiveBackendCalls(page, [
    '/api/auth/me',
    '/api/game-cards/query'
  ]);
}
