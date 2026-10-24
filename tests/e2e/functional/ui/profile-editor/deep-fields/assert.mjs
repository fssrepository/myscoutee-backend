import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertNoDocumentHorizontalOverflow, openNavigatorMenu } from '@fssrepository/myscoutee-e2e/functional/ui/lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await page.recordStep('profile-deep-before-edit');

  const physique = await selectDifferentMenuItem(page, 'physique');
  const language = await selectDifferentMenuItem(page, 'languages', { keepOpen: true });
  await closeControlMenu(page, 'languages');
  await page.recordStep('profile-basics-options-selected');

  await waitForLifestyleControls(page);
  const detail = await selectDifferentMenuItem(page, 'drinking');
  const value = await selectDifferentMenuItem(page, 'values', { keepOpen: true });
  await closeControlMenu(page, 'values');
  const interest = await selectDifferentMenuItem(page, 'interests', { keepOpen: true });
  await closeControlMenu(page, 'interests');
  await selectPrivacy(page, 'drinking', 'Private');
  await page.recordStep('profile-lifestyle-options-selected');

  await saveProfile(page);
  await page.recordStep('profile-deep-saved');

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await assertControlTriggerIncludes(page, 'physique', physique);
  await assertMenuItemActive(page, 'languages', language);

  await waitForLifestyleControls(page);
  await assertControlTriggerIncludes(page, 'drinking', detail);
  await assertMenuItemActive(page, 'values', value);
  await assertMenuItemActive(page, 'interests', interest);
  await assertPrivacySelected(page, 'drinking', 'Private');
  await page.recordStep('profile-deep-reloaded');
  await assertNoDocumentHorizontalOverflow(page);
}

async function openProfileEditor(page) {
  await openNavigatorMenu(page);
  await page.recordStep('profile-navigator-menu-open');
  await page.click('button[aria-label="Open profile editor"]');
  await page.waitForSelector('.profile-editor-popup-content');
  await page.waitForSelector('.profile-editor-popup-content [data-step-id="basics"]');
}

async function waitForLifestyleControls(page) {
  await page.waitForSelector('.profile-editor-popup-content [data-step-id="lifestyle"]');
}

async function selectDifferentMenuItem(page, controlId, { keepOpen = false } = {}) {
  const root = controlRoot(controlId);
  await page.clickVisible(`${root} > app-menu .app-menu__trigger`);
  await page.waitForSelector(`${root} > app-menu .app-menu__panel`);
  if (keepOpen) {
    await freeMultiSelectSlot(page, root, controlId);
  }
  const result = await page.evaluate(({ root, keepOpen }) => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const buttons = Array.from(document.querySelectorAll(
      `${root} > app-menu .app-menu__panel .app-menu__item, ${root} > app-menu .app-menu__panel .app-menu__tabs-item`
    )).filter(element => visible(element) && !element.disabled);
    const currentText = (document.querySelector(`${root} > app-menu .app-menu__trigger`)?.textContent ?? '').toLowerCase();
    const option = buttons.find(element => {
      const label = element.querySelector('.app-menu__item-label, .app-menu__tabs-item-label')?.textContent ?? '';
      return element.getAttribute('aria-checked') !== 'true'
        && label.trim().length > 0
        && !currentText.includes(label.trim().toLowerCase());
    }) ?? buttons.find(element => element.getAttribute('aria-checked') !== 'true') ?? buttons[0];
    if (!option) {
      return { label: '', keepOpen };
    }
    const labelElement = option.querySelector('.app-menu__item-label, .app-menu__tabs-item-label');
    const label = (labelElement?.textContent ?? option.textContent ?? '').trim().replace(/\s+/g, ' ');
    option.scrollIntoView({ block: 'center', inline: 'center' });
    option.click();
    return { label, keepOpen };
  }, { root, keepOpen });
  assert(result.label, `Profile ${controlId} menu should expose a selectable option`, result);
  if (keepOpen) {
    await page.waitFor(`profile ${controlId} option ${result.label} selected`, async () => {
      return page.evaluate(({ root, label }) => {
        const needle = label.trim().toLowerCase();
        return Array.from(document.querySelectorAll(
          `${root} > app-menu .app-menu__panel .app-menu__item, ${root} > app-menu .app-menu__panel .app-menu__tabs-item`
        )).some(button => {
          const optionLabel = button.querySelector('.app-menu__item-label, .app-menu__tabs-item-label')?.textContent ?? '';
          return optionLabel.trim().toLowerCase() === needle && button.getAttribute('aria-checked') === 'true';
        });
      }, { root, label: result.label });
    }, 10000);
  }
  if (!keepOpen) {
    await waitForControlMenuClosed(page, controlId);
  }
  return result.label;
}

async function freeMultiSelectSlot(page, root, controlId) {
  const deselectedLabel = await page.evaluate(root => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const active = Array.from(document.querySelectorAll(
      `${root} > app-menu .app-menu__panel .app-menu__item, ${root} > app-menu .app-menu__panel .app-menu__tabs-item`
    )).find(element => visible(element) && !element.disabled && element.getAttribute('aria-checked') === 'true');
    if (!active) {
      return '';
    }
    const label = active.querySelector('.app-menu__item-label, .app-menu__tabs-item-label')?.textContent ?? '';
    active.click();
    return label.trim().replace(/\s+/g, ' ');
  }, root);
  if (!deselectedLabel) {
    return;
  }
  await page.waitFor(`profile ${controlId} option ${deselectedLabel} deselected`, async () => {
    return page.evaluate(({ root, label }) => {
      const needle = label.trim().toLowerCase();
      return Array.from(document.querySelectorAll(
        `${root} > app-menu .app-menu__panel .app-menu__item, ${root} > app-menu .app-menu__panel .app-menu__tabs-item`
      )).every(button => {
        const optionLabel = button.querySelector('.app-menu__item-label, .app-menu__tabs-item-label')?.textContent ?? '';
        return optionLabel.trim().toLowerCase() !== needle || button.getAttribute('aria-checked') !== 'true';
      });
    }, { root, label: deselectedLabel });
  }, 10000);
  if (!(await page.isSelectorVisible(`${root} > app-menu .app-menu__panel`))) {
    await page.clickVisible(`${root} > app-menu .app-menu__trigger`);
    await page.waitForSelector(`${root} > app-menu .app-menu__panel`);
  }
}

async function closeControlMenu(page, controlId) {
  const root = controlRoot(controlId);
  if (await page.isSelectorVisible(`${root} > app-menu .app-menu__panel`)) {
    await page.clickVisible(`${root} > app-menu .app-menu__trigger`);
  }
  await waitForControlMenuClosed(page, controlId);
}

async function waitForControlMenuClosed(page, controlId) {
  const selector = `${controlRoot(controlId)} > app-menu .app-menu__panel`;
  await page.waitFor('profile form menu closed', async () => !(await page.isSelectorVisible(selector)), 10000);
}

async function selectPrivacy(page, controlId, label) {
  const root = controlRoot(controlId);
  await page.clickVisible(`${root} > app-menu.form-flow__control-accessory .app-menu__trigger`);
  await page.waitForSelector(`${root} > app-menu.form-flow__control-accessory .app-menu__panel`);
  const clicked = await clickButtonByText(page, `${root} > app-menu.form-flow__control-accessory .app-menu__panel button`, label);
  assert(clicked, `Profile privacy menu should expose ${label}`, { controlId, label });
  await page.waitFor('profile privacy menu closed', async () => {
    return !(await page.isSelectorVisible(`${root} > app-menu.form-flow__control-accessory .app-menu__panel`));
  }, 10000);
}

async function assertPrivacySelected(page, controlId, label) {
  const root = controlRoot(controlId);
  await page.clickVisible(`${root} > app-menu.form-flow__control-accessory .app-menu__trigger`);
  await page.waitForSelector(`${root} > app-menu.form-flow__control-accessory .app-menu__panel`);
  const selected = await page.evaluate(({ selector, label }) => {
    const needle = label.toLowerCase();
    return Array.from(document.querySelectorAll(selector)).some(button =>
      (button.textContent ?? '').toLowerCase().includes(needle) && button.getAttribute('aria-checked') === 'true');
  }, {
    selector: `${root} > app-menu.form-flow__control-accessory .app-menu__panel button`,
    label
  });
  assert(selected, `Profile ${controlId} privacy should reload as ${label}`);
  await page.clickVisible(`${root} > app-menu.form-flow__control-accessory .app-menu__trigger`);
}

async function assertControlTriggerIncludes(page, controlId, expected) {
  const actual = await page.evaluate(selector => {
    return (document.querySelector(selector)?.textContent ?? '').trim().replace(/\s+/g, ' ');
  }, `${controlRoot(controlId)} > app-menu .app-menu__trigger`);
  assert(actual.toLowerCase().includes(expected.toLowerCase()), `Profile ${controlId} should reload from backend`, {
    expected,
    actual
  });
}

async function assertMenuItemActive(page, controlId, expected) {
  const root = controlRoot(controlId);
  await page.clickVisible(`${root} > app-menu .app-menu__trigger`);
  await page.waitForSelector(`${root} > app-menu .app-menu__panel`);
  const selected = await page.evaluate(({ root, expected }) => {
    const needle = expected.trim().toLowerCase();
    const buttons = Array.from(document.querySelectorAll(
      `${root} > app-menu .app-menu__panel .app-menu__item, ${root} > app-menu .app-menu__panel .app-menu__tabs-item`
    ));
    return buttons.some(button => {
      const label = button.querySelector('.app-menu__item-label, .app-menu__tabs-item-label')?.textContent ?? '';
      return label.trim().toLowerCase() === needle && button.getAttribute('aria-checked') === 'true';
    });
  }, { root, expected });
  assert(selected, `Profile ${controlId} selection should reload from backend`, { expected });
  await closeControlMenu(page, controlId);
}

async function clickButtonByText(page, selector, label) {
  return page.evaluate(({ selector, label }) => {
    const needle = label.trim().toLowerCase();
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const button = Array.from(document.querySelectorAll(selector))
      .find(element => visible(element) && !element.disabled && (element.textContent ?? '').toLowerCase().includes(needle));
    if (!button) {
      return false;
    }
    button.click();
    return true;
  }, { selector, label });
}

async function saveProfile(page) {
  page.clearNetworkLog();
  await page.clickVisible('app-profile-editor button[aria-label="Save profile"]');
  await page.waitForNetwork('/api/auth/me/profile-ext', { timeoutMs: 30000 });
  await page.waitForSelectorHidden('.profile-editor-popup-content', { timeoutMs: 20000 });
}

function controlRoot(controlId) {
  return `.profile-editor-popup-content [data-control-id="${controlId}"]`;
}
