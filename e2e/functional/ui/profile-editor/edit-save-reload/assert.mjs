import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  const marker = `UI E2E profile ${Date.now().toString(36)}`;
  const nextName = `E2E ${Date.now().toString(36).slice(-6)}`;
  const nextCity = 'E2E City';
  const nextHeight = '181';

  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await page.recordStep('profile-before-edit');

  await setProfileStatus(page, 'friends only');
  await page.fillVisible('.profile-editor-popup-content [data-control-id="full-name"] input', nextName);
  await page.fillVisible('.profile-editor-popup-content [data-control-id="city"] input', nextCity);
  await page.fillVisible('.profile-editor-popup-content [data-control-id="height"] input', nextHeight);
  await page.fillVisible('.profile-editor-popup-content [data-control-id="about"] textarea', marker);
  await page.recordStep('profile-fields-edited');

  await page.clickVisible('app-profile-editor button[aria-label="Save profile"]');
  await page.waitForNetwork('/api/auth/me/profile-ext', { timeoutMs: 20000 });
  await page.waitForSelectorHidden('.profile-editor-popup-content', { timeoutMs: 20000 });
  await page.recordStep('profile-save-closed');

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await waitForProfileValues(page, { nextName, nextCity, marker });
  await page.recordStep('profile-reloaded-saved-values');

  const values = await page.evaluate(() => {
    const visibleValue = selector => {
      const isVisible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const element = Array.from(document.querySelectorAll(selector)).find(isVisible);
      return element && 'value' in element ? element.value : '';
    };
    return {
      name: visibleValue('.profile-editor-popup-content [data-control-id="full-name"] input'),
      city: visibleValue('.profile-editor-popup-content [data-control-id="city"] input'),
      height: visibleValue('.profile-editor-popup-content [data-control-id="height"] input'),
      status: document.querySelector('app-profile-editor button[aria-label="Open profile status selector"]')?.textContent ?? '',
      about: visibleValue('.profile-editor-popup-content [data-control-id="about"] textarea')
    };
  });
  assert(values.name === nextName, 'Profile name should reload from backend', values);
  assert(values.city === nextCity, 'Profile city should reload from backend', values);
  assert(values.height === nextHeight, 'Profile height should reload from backend', values);
  assert(values.status.toLowerCase().includes('friends only'), 'Profile status should reload from backend', values);
  assert(values.about.includes(marker), 'Profile about text should reload from backend', values);

  await setProfileStatus(page, 'public');
  await page.recordStep('profile-status-restored-public');
  await page.clickVisible('app-profile-editor button[aria-label="Save profile"]');
  await page.waitForNetwork('/api/auth/me/profile-ext', { timeoutMs: 20000 });
  await page.waitForSelectorHidden('.profile-editor-popup-content', { timeoutMs: 20000 });
  await page.recordStep('profile-public-restore-saved');

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await waitForProfileStatus(page, 'public');
  await closeExplanationPopupEventually(page);
  await page.recordStep('profile-public-restored-after-reload');
  await assertNoDocumentHorizontalOverflow(page);
}

async function waitForProfileValues(page, { nextName, nextCity, marker }) {
  await page.waitFor('profile saved values visible in form fields', async () => {
    const values = await readVisibleProfileValues(page);
    return values.name === nextName
      && values.city === nextCity
      && values.about.includes(marker);
  }, 20000);
}

async function waitForProfileStatus(page, label) {
  const needle = `${label}`.trim().toLowerCase();
  await page.waitFor(`profile status ${label} visible`, async () => {
    const status = await page.evaluate(() => {
      return document.querySelector('app-profile-editor button[aria-label="Open profile status selector"]')?.textContent ?? '';
    });
    return status.toLowerCase().includes(needle);
  }, 20000);
}

async function openProfileEditor(page) {
  await openNavigatorMenu(page);
  await page.recordStep('profile-navigator-menu-open');
  await page.click('button[aria-label="Open profile editor"]');
  await page.waitForSelector('.profile-editor-popup-content');
  await page.waitForSelector('.profile-editor-wrap');
}

async function setProfileStatus(page, label) {
  await page.clickVisible('app-profile-editor button[aria-label="Open profile status selector"]');
  await page.waitForSelector('app-profile-editor .ui-popup__header-controls .app-menu__panel');
  const clicked = await page.evaluate(({ selector, label }) => {
    const needle = `${label}`.trim().toLowerCase();
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const option = Array.from(document.querySelectorAll(selector))
      .find(element => visible(element) && (element.textContent ?? '').toLowerCase().includes(needle));
    if (!option) {
      return false;
    }
    option.scrollIntoView({ block: 'center', inline: 'center' });
    option.click();
    return true;
  }, {
    selector: 'app-profile-editor .ui-popup__header-controls .app-menu__panel button',
    label
  });
  assert(clicked, 'Profile status picker should expose the requested option', { label });
}

async function readVisibleProfileValues(page) {
  return page.evaluate(() => {
    const visibleValue = selector => {
      const isVisible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const element = Array.from(document.querySelectorAll(selector)).find(isVisible);
      return element && 'value' in element ? element.value : '';
    };
    return {
      name: visibleValue('.profile-editor-popup-content [data-control-id="full-name"] input'),
      city: visibleValue('.profile-editor-popup-content [data-control-id="city"] input'),
      about: visibleValue('.profile-editor-popup-content [data-control-id="about"] textarea')
    };
  });
}
