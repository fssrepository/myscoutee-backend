import { openNavigatorMenu } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('navigator-menu-open');
  await page.click('button[aria-label="Open my events"]');
  await page.waitForSelector('.popup-panel-activities');
  await page.recordStep('my-events-open');
  await page.click('button[aria-label="Open event actions"]');
  await page.click('.activities-quick-action-option-create');
  await page.waitForSelector('.event-editor-popup-shell');
  await page.waitForSelector('.popup-panel-event-editor');
  await page.waitForSelector('button[aria-label="Save event"]', { visible: false });
  await page.recordStep('event-editor-create-open');
}
