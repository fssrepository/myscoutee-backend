import { openNavigatorMenu } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('navigator-menu-open');
  await page.click('button[aria-label="Open profile editor"]');
  await page.waitForSelector('.profile-editor-popup-content');
  await page.waitForSelector('.profile-editor-wrap');
  await page.recordStep('profile-editor-open');
}
