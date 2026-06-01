import { assert } from '../../../../shared/assertions.mjs';
import {
  assertBrowserExpectations,
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  waitForLoginDialogOrDemoSelector,
  waitForVisibleCount
} from '../../lib/ui-contracts.mjs';

const DEMO_USER_ID = 'bf057de7c586eede7e84bdc7';
const GEOLOCATION = {
  latitude: 47.5004928,
  longitude: 19.0742528,
  accuracy: 20
};

export async function assertUi({ page }) {
  await page.waitForSelector('app-entry-shell');
  await page.waitForSelector('.entry-consent-overlay', { timeoutMs: 30000 });
  await assertNoDocumentHorizontalOverflow(page);
  await assertEntryPrivacyPopup(page, 'initial entry privacy popup');
  await page.recordStep('entry-privacy-initial-visible');

  await toggleEntryOptionalPrivacyIfPresent(page);
  await page.recordStep('entry-privacy-optional-toggled-before-reject');
  await page.clickVisible('.entry-consent-btn-muted');
  await page.waitForSelectorHidden('.entry-consent-overlay', { timeoutMs: 10000 });
  await assertEntryConsentRejected(page);
  await page.recordStep('entry-privacy-rejected');
  await assertNoDemoSelector(page, 'rejecting entry privacy should not open demo selector automatically');

  await resetEntryConsentStorage(page);
  await page.navigate('/', { loadTimeoutMs: 30000 });
  await page.waitForSelector('app-entry-shell');
  await page.waitForSelector('.entry-consent-overlay', { timeoutMs: 30000 });
  await assertEntryPrivacyPopup(page, 'entry privacy popup for acceptance pass');
  await toggleEntryOptionalPrivacyIfPresent(page);
  await page.clickVisible('.entry-consent-btn-primary');
  await page.waitForSelectorHidden('.entry-consent-overlay', { timeoutMs: 10000 });
  await assertEntryConsentAccepted(page);
  await page.recordStep('entry-privacy-accepted');
  assert(!(await page.isSelectorVisible('.entry-auth-btn-location')), 'Demo selector mode should not show the location gate in the header');

  await page.setGeolocationPermission('denied');
  await page.clickVisible('.entry-cta-primary');
  await waitForLoginDialogOrDemoSelector(page, 30000);
  if (await page.isSelectorVisible('.confirmation-dialog')) {
    await assertLocationDialog(page, 'Location Required For Login');
    await page.recordStep('location-dialog-open-denied-permission');
    await page.clickVisible('.confirmation-dialog-confirm-btn');
    await page.waitForSelector('.confirmation-dialog-error', { timeoutMs: 10000 });
    await assertNoDemoSelector(page, 'browser-denied location should not open demo selector');
    await page.recordStep('location-browser-denied-error');
    await page.clickVisible('.confirmation-dialog-cancel-btn');
    await page.waitForSelectorHidden('.confirmation-dialog', { timeoutMs: 10000 });
    await page.recordStep('location-denied-dialog-cancelled');

    await page.resetPermissions();
    await page.clickVisible('.entry-cta-primary');
    await page.waitForSelector('.confirmation-dialog', { timeoutMs: 20000 });
    await page.clickVisible('.confirmation-dialog-backdrop');
    await page.waitForSelectorHidden('.confirmation-dialog', { timeoutMs: 10000 });
    await assertNoDemoSelector(page, 'backdrop-cancelled location should not open demo selector');
    await page.recordStep('location-dialog-backdrop-cancelled');

    await page.setGeolocation(GEOLOCATION);
    await page.clickVisible('.entry-cta-primary');
    await page.waitForSelector('.confirmation-dialog', { timeoutMs: 20000 });
    await page.recordStep('location-dialog-open-approve');
    await page.clickVisible('.confirmation-dialog-confirm-btn');
    await page.waitForSelectorHidden('.confirmation-dialog', { timeoutMs: 20000 }).catch(() => undefined);
  } else {
    await page.recordStep('demo-selector-visible-without-location-dialog');
  }
  await page.waitForSelector('.demo-login-overlay', { timeoutMs: 30000 });
  await waitForVisibleCount(page, '.demo-user-item', 2, 'demo users after privacy and location approval', 60000);
  await page.waitForNetwork('/api/auth/demo-users', { timeoutMs: 30000 });
  await page.recordStep('demo-selector-visible-after-privacy-location');
  await selectDemoUser(page, DEMO_USER_ID);
  await page.waitForUrlPath('/game', 45000);
  await page.waitForSelector('.game-page', { timeoutMs: 45000 });
  await page.recordStep('game-loaded-after-demo-user');

  await exerciseNavigatorPrivacy(page);
  await assertBrowserExpectations(page, {
    selectors: ['.game-page'],
    absentSelectors: [
      '.entry-consent-overlay',
      '.confirmation-dialog',
      '.demo-login-overlay',
      'app-navigator-privacy-popup',
      '.navigator-settings-popup-shell'
    ],
    network: ['/api/auth/demo-users', '/api/privacy/consents'],
    noCrashText: true,
    noBrokenImages: true,
    noConsoleErrors: true
  });
}

async function assertEntryPrivacyPopup(page, label) {
  const snapshot = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const overlay = document.querySelector('.entry-consent-overlay');
    const sections = Array.from(document.querySelectorAll('.entry-consent-accordion-item')).filter(visible);
    const optional = sections.filter(section => section.classList.contains('is-optional'));
    const mandatory = sections.filter(section => section.classList.contains('is-mandatory'));
    const acceptButton = document.querySelector('.entry-consent-btn-primary');
    const rejectButton = document.querySelector('.entry-consent-btn-muted');
    return {
      overlayVisible: Boolean(overlay && visible(overlay)),
      sectionCount: sections.length,
      optionalCount: optional.length,
      mandatoryCount: mandatory.length,
      acceptEnabled: Boolean(acceptButton && !acceptButton.disabled && visible(acceptButton)),
      rejectVisible: Boolean(rejectButton && visible(rejectButton)),
      text: (overlay?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 600)
    };
  });
  assert(snapshot.overlayVisible, `${label} should be visible`, snapshot);
  assert(snapshot.sectionCount > 0, `${label} should render privacy sections`, snapshot);
  assert(snapshot.acceptEnabled, `${label} should expose an enabled accept action`, snapshot);
  assert(snapshot.rejectVisible, `${label} should expose a reject/cancel action`, snapshot);
}

async function toggleEntryOptionalPrivacyIfPresent(page) {
  return page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const optional = Array.from(document.querySelectorAll('.entry-consent-accordion-item.is-optional'))
      .find(visible);
    const button = optional?.querySelector('.entry-consent-section-check');
    if (!button || button.disabled) {
      return { toggled: false, optionalCount: document.querySelectorAll('.entry-consent-accordion-item.is-optional').length };
    }
    const wasApproved = button.getAttribute('aria-pressed') === 'true';
    button.click();
    return {
      toggled: true,
      wasApproved,
      nowApproved: button.getAttribute('aria-pressed') === 'true'
    };
  });
}

async function assertEntryConsentRejected(page) {
  const state = await readEntryConsentStorage(page);
  assert(!state.consent, 'Rejecting entry privacy should not store accepted entry consent', state);
  assert(state.auditActions.includes('rejected'), 'Rejecting entry privacy should write a rejected audit record', state);
}

async function assertEntryConsentAccepted(page) {
  const state = await readEntryConsentStorage(page);
  assert(state.consent?.accepted === true, 'Accepting entry privacy should store accepted entry consent', state);
  assert(typeof state.consent?.acceptedAtIso === 'string' && state.consent.acceptedAtIso.length > 0, 'Accepted entry consent should include timestamp', state);
  assert(state.auditActions.includes('accepted'), 'Accepting entry privacy should write an accepted audit record', state);
}

async function readEntryConsentStorage(page) {
  return page.evaluate(() => {
    const parse = key => {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch {
        return { parseError: true, raw };
      }
    };
    const audit = parse('entry-gdpr-consent-audit');
    return {
      consent: parse('entry-gdpr-consent'),
      optional: parse('myscoutee-privacy-optional-approvals'),
      auditActions: Array.isArray(audit) ? audit.map(record => record?.action).filter(Boolean) : []
    };
  });
}

async function resetEntryConsentStorage(page) {
  await page.evaluate(() => {
    window.localStorage.removeItem('entry-gdpr-consent');
    window.localStorage.removeItem('entry-gdpr-consent-audit');
    window.localStorage.removeItem('myscoutee-privacy-optional-approvals');
  });
}

async function assertLocationDialog(page, titleNeedle) {
  const snapshot = await page.evaluate(titleNeedle => {
    const dialog = document.querySelector('.confirmation-dialog');
    return {
      visible: Boolean(dialog),
      title: (dialog?.querySelector('h3')?.textContent ?? '').trim(),
      message: (dialog?.querySelector('p')?.textContent ?? '').trim(),
      hasCancel: Boolean(dialog?.querySelector('.confirmation-dialog-cancel-btn')),
      hasConfirm: Boolean(dialog?.querySelector('.confirmation-dialog-confirm-btn'))
    };
  }, titleNeedle);
  assert(snapshot.visible, 'Location dialog should be visible', snapshot);
  assert(snapshot.title.includes(titleNeedle), `Location dialog should have title ${titleNeedle}`, snapshot);
  assert(snapshot.hasCancel && snapshot.hasConfirm, 'Location dialog should expose cancel and approve actions', snapshot);
}

async function assertNoDemoSelector(page, label) {
  assert(!(await page.isSelectorVisible('.demo-login-overlay')), label);
}

async function selectDemoUser(page, userId) {
  const clicked = await page.evaluate(userId => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const buttons = Array.from(document.querySelectorAll('.demo-user-item'))
      .filter(button => visible(button) && !button.disabled);
    const preferred = buttons.find(button => button.getAttribute('data-user-id') === userId)
      ?? buttons.find(button => !button.classList.contains('demo-user-item-new') && !button.classList.contains('demo-user-item-blocked'))
      ?? buttons[0];
    if (!preferred) {
      return false;
    }
    preferred.scrollIntoView({ block: 'center', inline: 'center' });
    preferred.click();
    return true;
  }, userId);
  assert(clicked, 'Should select a demo user from the demo selector', { userId });
}

async function exerciseNavigatorPrivacy(page) {
  await closeExplanationPopupEventually(page, 12000);
  const requiredVisible = await page.waitForSelector('app-navigator-privacy-popup', { timeoutMs: 6000 })
    .then(() => true)
    .catch(() => false);
  if (requiredVisible) {
    await page.recordStep('navigator-privacy-required-visible');
    await clickVisibleIfPresent(page, '.navigator-settings-popup-shell .popup-close');
    assert(await page.isSelectorVisible('app-navigator-privacy-popup'), 'Required navigator privacy popup should not close before approval');
    await page.recordStep('navigator-privacy-required-close-blocked');
    await saveNavigatorPrivacy(page, { required: true });
    await page.recordStep('navigator-privacy-required-approved');
    return;
  }

  await openNavigatorPrivacyFromSettings(page);
  await page.recordStep('navigator-privacy-settings-opened');
  await saveNavigatorPrivacy(page, { required: false });
  await page.recordStep('navigator-privacy-settings-saved-or-closed');
}

async function openNavigatorPrivacyFromSettings(page) {
  await page.waitFor('global navigator button enabled', async () => page.evaluate(() => {
    const button = document.querySelector('button.user-selector-btn-global');
    return Boolean(button && !button.disabled);
  }), 20000);
  await page.click('button.user-selector-btn-global');
  await page.waitForSelector('.user-menu-panel.open', { timeoutMs: 15000 });
  await page.clickVisible('.user-menu-settings-btn');
  await page.waitForSelector('.user-settings-menu', { timeoutMs: 15000 });
  const clicked = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const button = Array.from(document.querySelectorAll('.user-settings-item'))
      .find(item => visible(item) && !item.disabled && (item.textContent ?? '').includes('Privacy'));
    if (!button) {
      return false;
    }
    button.click();
    return true;
  });
  assert(clicked, 'Settings menu should expose Privacy');
  await page.waitForSelector('.navigator-settings-popup-shell app-navigator-privacy-popup', { timeoutMs: 20000 });
  await page.waitForSelector('.support-privacy-accordion-item', { timeoutMs: 20000 });
}

async function saveNavigatorPrivacy(page, options = {}) {
  const snapshot = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const root = document.querySelector('app-navigator-privacy-popup');
    const sections = Array.from(root?.querySelectorAll('.support-privacy-accordion-item') ?? []).filter(visible);
    return {
      visible: Boolean(root && visible(root)),
      sectionCount: sections.length,
      optionalCount: sections.filter(section => section.classList.contains('is-optional')).length,
      mandatoryCount: sections.filter(section => section.classList.contains('is-mandatory')).length,
      saveVisible: Boolean(root?.querySelector('.support-privacy-save-btn'))
    };
  });
  assert(snapshot.visible, 'Navigator privacy popup should be visible before saving', snapshot);
  assert(snapshot.sectionCount > 0, 'Navigator privacy popup should render privacy sections', snapshot);

  if (!options.required) {
    await toggleNavigatorOptionalPrivacyIfPresent(page);
  }

  const saveVisible = await page.isSelectorVisible('.support-privacy-save-btn');
  if (saveVisible) {
    await page.waitFor('navigator privacy save enabled', async () => page.evaluate(() => {
      const button = document.querySelector('.support-privacy-save-btn');
      return Boolean(button && !button.disabled);
    }), 20000);
    await page.clickVisible('.support-privacy-save-btn');
    await page.waitForNetwork('/api/privacy/consents', { timeoutMs: 30000 });
    await page.waitForSelectorHidden('.navigator-settings-popup-shell', { timeoutMs: 30000 });
    return;
  }

  await page.clickVisible('.navigator-settings-popup-shell .popup-close');
  await page.waitForSelectorHidden('.navigator-settings-popup-shell', { timeoutMs: 10000 });
}

async function toggleNavigatorOptionalPrivacyIfPresent(page) {
  return page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const optional = Array.from(document.querySelectorAll('app-navigator-privacy-popup .support-privacy-accordion-item.is-optional'))
      .find(visible);
    const button = optional?.querySelector('.support-privacy-section-check');
    if (!button || button.disabled) {
      return { toggled: false };
    }
    const wasApproved = button.getAttribute('aria-pressed') === 'true';
    button.click();
    return {
      toggled: true,
      wasApproved,
      nowApproved: button.getAttribute('aria-pressed') === 'true'
    };
  });
}

async function clickVisibleIfPresent(page, selector) {
  if (!(await page.isSelectorVisible(selector))) {
    return false;
  }
  await page.clickVisible(selector);
  return true;
}
