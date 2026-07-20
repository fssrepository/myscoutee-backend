import { closeExplanationPopupEventually, openNavigatorMenu } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('navigator-menu-open');
  await page.click('button[aria-label="Open my events"]');
  await page.waitForSelector('.activities-popup');
  await page.recordStep('my-events-open');
  await page.click('button[aria-label="Open event actions"]');
  await page.clickByText('app-activities-popup .ui-popup__panel .app-menu__panel button', 'Create Event');
  await page.waitForSelector('app-event-editor-popup .ui-popup__panel');
  await closeExplanationPopupEventually(page);
  await page.waitForSelector('button[aria-label="Save event"]', { visible: false });
  await page.recordStep('event-editor-create-open');
}
