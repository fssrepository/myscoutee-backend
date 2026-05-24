import { assert } from '../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  waitForSmartListSettled,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  const marker = `UI E2E asset ${Date.now().toString(36)}`;

  await page.waitForSelector('.game-page');
  await openAssetsPopup(page);
  await page.recordStep('asset-supplies-popup-open');
  await waitForSmartListSettled(page, '.popup-panel-assets');

  await exerciseAssetFilter(page);
  await page.recordStep('asset-filter-exercised');

  await page.clickVisible('.popup-panel-assets .assets-add-btn');
  await page.waitForSelector('.asset-form-popup');
  await page.recordStep('asset-form-open');

  await fillAssetForm(page, marker);
  await page.recordStep('asset-form-filled');

  await page.clickVisible('.asset-form-popup .asset-form-save-btn');
  await page.waitForNetwork('/api/assets', { timeoutMs: 30000 });
  await page.waitForSelectorHidden('.asset-form-popup', { timeoutMs: 30000 });
  await waitForVisibleText(page, '.popup-panel-assets', marker, 30000);
  await page.recordStep('asset-created-visible');

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openAssetsPopup(page);
  await waitForSmartListSettled(page, '.popup-panel-assets');
  await waitForVisibleText(page, '.popup-panel-assets', marker, 30000);
  await page.recordStep('asset-reloaded-visible');
  await assertNoDocumentHorizontalOverflow(page);
}

async function openAssetsPopup(page) {
  await openNavigatorMenu(page);
  await page.click('button[aria-label="Supplies"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.popup-panel-assets');
  await page.waitForNetwork('/api/assets', { timeoutMs: 25000 });
}

async function exerciseAssetFilter(page) {
  const before = await readAssetToolbarText(page);
  await page.mouseClickVisible('.popup-panel-assets .assets-primary-filter-select');
  await page.waitForSelector('.assets-filter-options-panel, .assets-mobile-filter-panel');
  const selected = await page.evaluate(before => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const option = Array.from(document.querySelectorAll('.assets-filter-options-panel mat-option, .assets-mobile-filter-panel .activities-view-option'))
      .filter(item => visible(item) && !item.disabled)
      .find(item => !(item.textContent ?? '').toLowerCase().includes(before.toLowerCase().trim()));
    if (!option) {
      return '';
    }
    const label = (option.textContent ?? '').trim().replace(/\s+/g, ' ');
    option.click();
    return label;
  }, before);
  assert(selected, 'Asset filter should expose at least one alternate filter');
  await page.waitForNetwork('/api/assets', { timeoutMs: 25000 });
  await waitForSmartListSettled(page, '.popup-panel-assets');
  await closeExplanationPopupEventually(page, 10000);

  await page.mouseClickVisible('.popup-panel-assets .assets-primary-filter-select');
  await page.waitForSelector('.assets-filter-options-panel, .assets-mobile-filter-panel');
  const restored = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const option = Array.from(document.querySelectorAll('.assets-filter-options-panel mat-option, .assets-mobile-filter-panel .activities-view-option'))
      .filter(item => visible(item) && !item.disabled)
      .find(item => (item.textContent ?? '').toLowerCase().includes('supplies'));
    if (!option) {
      return false;
    }
    option.click();
    return true;
  });
  assert(restored, 'Asset filter should be restorable to Supplies before creating a supply asset');
  await page.waitForNetwork('/api/assets', { timeoutMs: 25000 });
  await waitForSmartListSettled(page, '.popup-panel-assets');
  await closeExplanationPopupEventually(page, 10000);
}

async function readAssetToolbarText(page) {
  return page.evaluate(() => {
    const trigger = document.querySelector('.popup-panel-assets .assets-primary-filter-select');
    return (trigger?.textContent ?? '').trim().replace(/\s+/g, ' ');
  });
}

async function fillAssetForm(page, marker) {
  await fillAssetField(page, 'Title', marker);
  await fillAssetField(page, 'Subtitle', 'UI asset lifecycle');
  await fillAssetField(page, 'Total capacity', '3');
  await fillAssetField(page, 'Quantity', '3');
  await fillAssetTextarea(page, 'Details', `${marker} details`);
  await chooseAssetVisibility(page, 'Public');
}

async function fillAssetField(page, label, value) {
  const filled = await page.evaluate(({ label, value }) => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const needle = label.toLowerCase();
    const target = Array.from(document.querySelectorAll('.asset-form-popup label'))
      .find(item => visible(item) && (item.textContent ?? '').toLowerCase().includes(needle))
      ?.querySelector('input');
    if (!target) {
      return false;
    }
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.focus();
    target.value = value;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { label, value });
  assert(filled, `Asset form field ${label} should be fillable`);
}

async function fillAssetTextarea(page, label, value) {
  const filled = await page.evaluate(({ label, value }) => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const needle = label.toLowerCase();
    const target = Array.from(document.querySelectorAll('.asset-form-popup label'))
      .find(item => visible(item) && (item.textContent ?? '').toLowerCase().includes(needle))
      ?.querySelector('textarea');
    if (!target) {
      return false;
    }
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.focus();
    target.value = value;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { label, value });
  assert(filled, `Asset form textarea ${label} should be fillable`);
}

async function chooseAssetVisibility(page, label) {
  await page.clickVisible('.asset-form-popup .asset-form-visibility-picker .event-visibility-trigger');
  await page.waitForSelector('.asset-form-popup .asset-form-visibility-picker .activities-view-picker-panel');
  const clicked = await page.evaluate(label => {
    const needle = `${label}`.trim().toLowerCase();
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const option = Array.from(document.querySelectorAll('.asset-form-popup .asset-form-visibility-picker .activities-view-option'))
      .find(item => visible(item) && (item.textContent ?? '').toLowerCase().includes(needle));
    if (!option) {
      return false;
    }
    option.click();
    return true;
  }, label);
  assert(clicked, `Asset visibility picker should expose ${label}`);
}
