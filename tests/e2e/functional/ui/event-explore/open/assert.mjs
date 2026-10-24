import { openNavigatorMenu } from '@fssrepository/myscoutee-e2e/functional/ui/lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('navigator-menu-open');
  await page.click('button[aria-label="Open events"]');
  await page.waitForSelector('.activities-popup');
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/events');
  await page.recordStep('event-explore-open');
}
