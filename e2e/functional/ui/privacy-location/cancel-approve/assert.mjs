import { assert } from '../../../../shared/assertions.mjs';
import { acceptEntryPrivacyIfPresent, waitForLoginDialogOrDemoSelector, waitForVisibleCount } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('app-entry-page');
  await acceptEntryPrivacyIfPresent(page);
  await page.recordStep('privacy-accepted');
  assert(!(await page.isSelectorVisible('.entry-auth-btn-location')), 'Demo selector mode should not show the location gate in the header');

  await page.click('.entry-cta-primary');
  await waitForLoginDialogOrDemoSelector(page, 30000);
  if (!(await page.isSelectorVisible('.dialog'))) {
    await page.waitForSelector('.demo-user-stage', { timeoutMs: 30000 });
    await waitForVisibleCount(page, '.demo-user-item', 2, 'demo users without location dialog', 60000);
    await page.recordStep('demo-selector-visible-without-location-dialog');
    return;
  }
  await page.recordStep('location-required-dialog-visible');

  const cancelled = await clickLocationDialogCancel(page);
  assert(cancelled, 'Location required dialog should expose a cancel/reject path');
  await page.waitForSelectorHidden('.dialog', { timeoutMs: 10000 });
  await page.recordStep('location-dialog-cancelled');

  assert(!(await page.isSelectorVisible('.demo-user-stage')), 'Demo selector should stay closed after cancelling location');

  await page.click('.entry-cta-primary');
  await page.waitForSelector('.dialog');
  await page.recordStep('location-required-dialog-visible-again');
  await page.setGeolocation({
    latitude: 47.5004928,
    longitude: 19.0742528,
    accuracy: 20
  });
  await page.click('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
  await page.waitForSelector('.demo-user-stage', { timeoutMs: 20000 });
  await waitForVisibleCount(page, '.demo-user-item', 2, 'demo users after location approve', 60000);
  await page.waitForNetwork('/api/auth/demo-users', { timeoutMs: 20000 });
  await page.recordStep('location-approved-demo-selector-visible');
}

async function clickLocationDialogCancel(page) {
  return page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const cancel = Array.from(document.querySelectorAll('.dialog-actions-menu .app-menu__button-row-item'))
      .find(button => visible(button) && !button.disabled);
    if (!cancel) {
      return false;
    }
    cancel.click();
    return true;
  });
}
