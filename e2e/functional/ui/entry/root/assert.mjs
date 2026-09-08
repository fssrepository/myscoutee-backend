import { assert } from '../../../../shared/assertions.mjs';
import {
  acceptEntryPrivacyIfPresent,
  clickEntryPrimaryAction,
  waitForLoginDialogOrDemoSelector,
  waitForVisibleCount
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await acceptEntryPrivacyIfPresent(page);
  await page.recordStep('privacy-ready');
  await clickEntryPrimaryAction(page);
  await waitForLoginDialogOrDemoSelector(page, 30000);
  if (await page.isSelectorVisible('.dialog')) {
    await page.recordStep('location-required-dialog');
    await page.waitForText('Location Required For Login');
    await page.waitForText('Allow location');
    await page.waitForText('Not now');
    const hasDemoSelector = await page.isSelectorVisible('.demo-user-stage');
    assert(!hasDemoSelector, 'Demo selector should not open before location is approved');
    await page.click('.dialog-actions-menu .app-menu__button-row-item:first-of-type');
    await page.waitForSelectorHidden('.dialog');
    await page.recordStep('location-dialog-cancelled');
    return;
  }
  await page.waitForSelector('.demo-user-stage');
  await page.waitForNetwork('/api/auth/demo-users', { timeoutMs: 30000 });
  await waitForVisibleCount(page, '.demo-user-item', 2, 'demo selector users', 60000);
  await page.recordStep('demo-selector-loaded-without-location-dialog');
}
