import { assert } from '../../../../shared/assertions.mjs';
import { assertNoDocumentHorizontalOverflow, openNavigatorMenu } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  const language = `E2E-Lang-${Date.now().toString(36).slice(-5)}`;

  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await page.recordStep('profile-deep-before-edit');

  const physique = await choosePhysiqueOption(page);
  await page.recordStep('profile-physique-selected');

  const detail = await chooseFirstDetailOption(page);
  await page.recordStep('profile-detail-dropdown-selected');

  const valueChip = await chooseProfileChip(page, 'values');
  await page.recordStep('profile-value-chip-selected');

  const interestChip = await chooseProfileChip(page, 'interest');
  await page.recordStep('profile-interest-chip-selected');

  await addLanguage(page, language);
  await page.recordStep('profile-language-added');

  await chooseFirstPrivacy(page, 'Private');
  await page.recordStep('profile-privacy-private-selected');

  await closeAndPersistProfile(page);
  await page.recordStep('profile-deep-saved');

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await page.recordStep('profile-deep-reopened');

  const snapshot = await readProfileDeepSnapshot(page);
  assert(snapshot.physique.toLowerCase().includes(physique.toLowerCase()), 'Physique choice should reload from backend', {
    expected: physique,
    snapshot
  });
  assert(snapshot.detailTexts.some(text => text.toLowerCase().includes(detail.toLowerCase())), 'A changed profile detail select should reload from backend', {
    expected: detail,
    snapshot
  });
  assert(snapshot.firstPrivacyClass.includes('status-inactive'), 'Changed field privacy should reload as Private', snapshot);

  await assertLanguageStillSelected(page, language);
  await page.recordStep('profile-language-reloaded');
  await assertChipStillSelected(page, 'values', valueChip);
  await page.recordStep('profile-value-chip-reloaded');
  await assertChipStillSelected(page, 'interest', interestChip);
  await page.recordStep('profile-interest-chip-reloaded');
  await assertNoDocumentHorizontalOverflow(page);
}

async function openProfileEditor(page) {
  await openNavigatorMenu(page);
  await page.recordStep('profile-navigator-menu-open');
  await page.click('button[aria-label="Open profile editor"]');
  await page.waitForSelector('.popup-panel-profile-editor');
  await page.waitForSelector('.profile-editor-wrap');
}

async function choosePhysiqueOption(page) {
  if ((await page.visibleCount('.popup-panel-profile-editor .physique-field .mat-mdc-select-trigger')) > 0) {
    await page.mouseClickVisible('.popup-panel-profile-editor .physique-field .mat-mdc-select-trigger');
  } else {
    await page.clickVisible('.popup-panel-profile-editor .physique-select-wrap');
  }
  await page.waitForSelector('.physique-options-panel, .mobile-profile-selector-sheet');
  const selected = await chooseVisibleOption(page, {
    optionSelector: '.physique-options-panel mat-option, .mobile-profile-selector-sheet .mobile-profile-selector-option',
    rejectActive: true
  });
  assert(selected, 'Physique selector should expose another option');
  await waitForProfileOptionPanelsClosed(page);
  return selected;
}

async function chooseFirstDetailOption(page) {
  if ((await page.visibleCount('.popup-panel-profile-editor .profile-details-select .mat-mdc-select-trigger')) > 0) {
    await page.mouseClickVisible('.popup-panel-profile-editor .profile-details-select .mat-mdc-select-trigger');
    await page.waitForSelector('.profile-bottom-sheet-panel, .mobile-profile-selector-sheet');
    const selected = await chooseVisibleOption(page, {
      optionSelector: '.profile-bottom-sheet-panel mat-option, .mobile-profile-selector-sheet .mobile-profile-selector-option',
      rejectActive: true
    });
    assert(selected, 'Profile detail dropdown should expose a selectable option');
    await waitForProfileOptionPanelsClosed(page);
    return selected;
  }

  const opened = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const controls = Array.from(document.querySelectorAll('.popup-panel-profile-editor .profile-details-select'))
      .filter(visible);
    const control = controls[0];
    if (!control) {
      return false;
    }
    control.scrollIntoView({ block: 'center', inline: 'center' });
    control.click();
    return true;
  });
  assert(opened, 'Profile detail dropdown should be openable');
  await page.waitForSelector('.profile-bottom-sheet-panel, .mobile-profile-selector-sheet');
  const selected = await chooseVisibleOption(page, {
    optionSelector: '.profile-bottom-sheet-panel mat-option, .mobile-profile-selector-sheet .mobile-profile-selector-option',
    rejectActive: true
  });
  assert(selected, 'Profile detail dropdown should expose a selectable option');
  await waitForProfileOptionPanelsClosed(page);
  return selected;
}

async function chooseProfileChip(page, kind) {
  const selectorClass = kind === 'values'
    ? 'profile-details-values-tone-values'
    : 'profile-details-values-tone-interest';
  const opened = await page.evaluate(selectorClass => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const button = Array.from(document.querySelectorAll(`.popup-panel-profile-editor .${selectorClass}`))
      .find(visible);
    if (!button) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  }, selectorClass);
  assert(opened, `Profile ${kind} selector should open`);
  await page.waitForSelector('.popup-panel-profile-selector');
  await makeRoomForProfileChipIfNeeded(page);
  const selected = await chooseInactiveProfileChip(page);
  assert(selected, `Profile ${kind} selector should expose an inactive chip to add`);
  await waitForProfileChipActive(page, selected);
  await page.clickVisible('.popup-panel-profile-selector .popup-back-btn');
  await page.waitForSelector('.popup-panel-profile-editor');
  return selected;
}

async function makeRoomForProfileChipIfNeeded(page) {
  const removed = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const selected = Array.from(document.querySelectorAll('.popup-panel-profile-selector .profile-filter-selector-chip'))
      .filter(visible);
    if (selected.length < 5) {
      return '';
    }
    const label = (selected[0].textContent ?? '').trim().replace(/\s+/g, ' ').replace(/\s*close\s*$/i, '');
    selected[0].click();
    return label;
  });
  if (!removed) {
    return;
  }
  await page.waitFor(`profile chip room after removing ${removed}`, async () => {
    return page.evaluate(removed => {
      const needle = `${removed}`.trim().toLowerCase();
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      return !Array.from(document.querySelectorAll('.popup-panel-profile-selector .profile-filter-selector-chip'))
        .filter(visible)
        .some(chip => (chip.textContent ?? '').trim().toLowerCase().includes(needle));
    }, removed);
  }, 10000);
}

async function chooseInactiveProfileChip(page) {
  return page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const selectedLabels = new Set(Array.from(document.querySelectorAll('.popup-panel-profile-selector .profile-filter-selector-chip'))
      .filter(visible)
      .map(chip => (chip.textContent ?? '').trim().replace(/\s+/g, ' ').replace(/\s*close\s*$/i, '').toLowerCase()));
    const options = Array.from(document.querySelectorAll('.popup-panel-profile-selector .profile-selector-chip'))
      .filter(element => visible(element) && !element.disabled && !element.classList.contains('active'));
    const option = options.find(element => {
      const label = (element.textContent ?? '').trim().replace(/\s+/g, ' ');
      return label && !selectedLabels.has(label.toLowerCase());
    }) ?? options[0];
    if (!option) {
      return '';
    }
    option.scrollIntoView({ block: 'center', inline: 'center' });
    const label = (option.textContent ?? '').trim().replace(/\s+/g, ' ');
    option.click();
    return label;
  });
}

async function waitForProfileChipActive(page, label) {
  await page.waitFor(`profile chip ${label} active`, async () => {
    return page.evaluate(label => {
      const needle = `${label}`.trim().toLowerCase();
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      return Array.from(document.querySelectorAll('.popup-panel-profile-selector .profile-selector-chip.active'))
        .filter(visible)
        .some(chip => (chip.textContent ?? '').trim().toLowerCase().includes(needle));
    }, label);
  }, 10000);
}

async function addLanguage(page, language) {
  await page.clickVisible('.popup-panel-profile-editor .language-select-btn');
  await page.waitForSelector('.mobile-profile-selector-sheet-language');
  await page.fillVisible('.mobile-profile-language-input-wrap input', language);
  await page.clickVisible('.mobile-profile-language-submit-btn');
  await page.waitForSelectorHidden('.mobile-profile-selector-sheet-language', { timeoutMs: 10000 });
}

async function chooseFirstPrivacy(page, label) {
  const opened = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const trigger = Array.from(document.querySelectorAll('.popup-panel-profile-editor .profile-details-privacy-trigger'))
      .find(visible);
    if (!trigger) {
      return false;
    }
    trigger.scrollIntoView({ block: 'center', inline: 'center' });
    trigger.click();
    return true;
  });
  assert(opened, 'Profile detail privacy selector should open');
  await page.waitForSelector('.profile-privacy-menu, .mobile-profile-selector-sheet');
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
    const button = Array.from(document.querySelectorAll('.profile-privacy-menu-option, .mobile-profile-selector-sheet .mobile-profile-selector-option'))
      .find(item => visible(item) && (item.textContent ?? '').toLowerCase().includes(needle) && !item.disabled);
    if (!button) {
      return false;
    }
    button.click();
    return true;
  }, label);
  assert(clicked, `Profile privacy selector should expose ${label}`);
  await waitForProfileOptionPanelsClosed(page);
}

async function closeAndPersistProfile(page) {
  await page.clickVisible('.popup-panel-profile-editor button.popup-close[aria-label="Close"]');
  await page.waitForNetwork('/api/auth/me/profile', { timeoutMs: 30000 });
  await page.waitForSelectorHidden('.popup-panel-profile-editor', { timeoutMs: 20000 });
}

async function chooseVisibleOption(page, options) {
  return page.evaluate(({ optionSelector, rejectActive }) => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const options = Array.from(document.querySelectorAll(optionSelector))
      .filter(element => visible(element) && !element.disabled)
      .filter(element => !rejectActive || (!element.classList.contains('active') && !element.classList.contains('hide-selected-option')));
    const option = options[0];
    if (!option) {
      return '';
    }
    option.scrollIntoView({ block: 'center', inline: 'center' });
    const label = (option.textContent ?? '').trim().replace(/\s+/g, ' ');
    option.click();
    return label;
  }, options);
}

async function waitForProfileOptionPanelsClosed(page) {
  const selector = '.physique-options-panel, .profile-bottom-sheet-panel, .mobile-profile-selector-sheet';
  const panelsClosed = await waitForNoVisibleProfileOptionPanels(page, selector, 5000)
    .then(() => true)
    .catch(() => false);
  if (panelsClosed) {
    return;
  }
  await page.evaluate(selector => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const backdrop = Array.from(document.querySelectorAll('.cdk-overlay-backdrop, .mobile-profile-selector-backdrop'))
      .reverse()
      .find(visible);
    if (backdrop) {
      backdrop.click();
      return;
    }
    document.querySelector('.popup-panel-profile-editor')?.click();
  }, selector);
  await waitForNoVisibleProfileOptionPanels(page, selector, 10000);
}

async function waitForNoVisibleProfileOptionPanels(page, selector, timeoutMs) {
  await page.waitFor('profile option panels closed', async () => {
    return page.evaluate(selector => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      return !Array.from(document.querySelectorAll(selector)).some(visible);
    }, selector);
  }, timeoutMs);
}

async function readProfileDeepSnapshot(page) {
  return page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const textOf = selector => {
      const element = Array.from(document.querySelectorAll(selector)).find(visible);
      return (element?.textContent ?? '').trim().replace(/\s+/g, ' ');
    };
    return {
      physique: textOf('.popup-panel-profile-editor .physique-select-wrap'),
      languageText: textOf('.popup-panel-profile-editor .language-select-btn'),
      detailTexts: Array.from(document.querySelectorAll('.popup-panel-profile-editor .profile-details-select'))
        .filter(visible)
        .map(element => (element.textContent ?? '').trim().replace(/\s+/g, ' ')),
      firstPrivacyClass: Array.from(document.querySelectorAll('.popup-panel-profile-editor .profile-details-privacy-trigger'))
        .find(visible)?.className ?? ''
    };
  });
}

async function assertChipStillSelected(page, kind, expectedLabel) {
  const selectorClass = kind === 'values'
    ? 'profile-details-values-tone-values'
    : 'profile-details-values-tone-interest';
  const opened = await page.evaluate(selectorClass => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const button = Array.from(document.querySelectorAll(`.popup-panel-profile-editor .${selectorClass}`))
      .find(visible);
    if (!button) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  }, selectorClass);
  assert(opened, `Profile ${kind} selector should reopen`);
  await page.waitForSelector('.popup-panel-profile-selector');
  const selected = await page.evaluate(expectedLabel => {
    const needle = `${expectedLabel}`.trim().toLowerCase();
    return Array.from(document.querySelectorAll('.popup-panel-profile-selector .profile-selector-chip.active'))
      .some(chip => (chip.textContent ?? '').trim().toLowerCase().includes(needle));
  }, expectedLabel);
  assert(selected, `Profile ${kind} chip should remain selected after reload`, { expectedLabel });
  await page.clickVisible('.popup-panel-profile-selector .popup-back-btn');
  await page.waitForSelector('.popup-panel-profile-editor');
}

async function assertLanguageStillSelected(page, language) {
  await page.clickVisible('.popup-panel-profile-editor .language-select-btn');
  await page.waitForSelector('.mobile-profile-selector-sheet-language');
  const selected = await page.evaluate(language => {
    const needle = `${language}`.trim().toLowerCase();
    return Array.from(document.querySelectorAll('.mobile-profile-language-chip, .mobile-profile-selector-option.active'))
      .some(item => (item.textContent ?? '').trim().toLowerCase().includes(needle));
  }, language);
  assert(selected, 'Added language should reload from backend', { language });
  await page.clickVisible('.mobile-profile-selector-close-btn');
  await page.waitForSelectorHidden('.mobile-profile-selector-sheet-language', { timeoutMs: 10000 });
}
