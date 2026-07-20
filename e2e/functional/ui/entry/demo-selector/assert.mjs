import { assertVisibleCount, acceptEntryPrivacyIfPresent, waitForLoginDialogOrDemoSelector } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await acceptEntryPrivacyIfPresent(page);
  await page.recordStep('privacy-ready');
  await page.click('.entry-cta-primary');
  await waitForLoginDialogOrDemoSelector(page, 30000);
  if (await page.isSelectorVisible('.dialog')) {
    await page.recordStep('location-required-dialog');
    await page.grantGeolocationPermission();
    await page.click('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
    await page.waitForSelectorHidden('.dialog', { timeoutMs: 30000 }).catch(() => undefined);
  }
  await page.waitForSelector('.demo-user-stage');
  await page.waitForSelector('.demo-user-item');
  await page.recordStep('demo-selector-loaded');
  await assertVisibleCount(page, '.demo-user-item', 2, 'demo selector users');
  await page.waitForNetwork('/api/auth/demo-users');
}
