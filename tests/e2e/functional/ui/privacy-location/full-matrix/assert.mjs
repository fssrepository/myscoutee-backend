import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import {
  assertBrowserExpectations,
  assertNoDocumentHorizontalOverflow,
  clickEntryPrimaryAction,
  closeExplanationPopupEventually,
  waitForLoginDialogOrDemoSelector,
  waitForVisibleCount
} from '@fssrepository/myscoutee-e2e/functional/ui/lib/ui-contracts.mjs';

const DEMO_USER_ID = 'bf057de7c586eede7e84bdc7';
const GEOLOCATION = {
  latitude: 47.5004928,
  longitude: 19.0742528,
  accuracy: 20
};

export async function assertUi({ page }) {
  await page.waitForSelector('app-entry-page');
  await page.waitForSelector('app-entry-page app-document-viewer .ui-popup__panel', { timeoutMs: 30000 });
  await assertNoDocumentHorizontalOverflow(page);
  await assertEntryPrivacyPopup(page, 'initial entry privacy popup');
  await page.recordStep('entry-privacy-initial-visible');

  await toggleEntryOptionalPrivacyIfPresent(page);
  await page.recordStep('entry-privacy-optional-toggled-before-reject');
  await page.clickVisible('app-entry-page app-document-viewer button[aria-label="Cancel"]');
  await page.waitForSelectorHidden('app-entry-page app-document-viewer .ui-popup__panel', { timeoutMs: 10000 });
  await assertEntryConsentRejected(page);
  await page.recordStep('entry-privacy-rejected');
  await assertNoDemoSelector(page, 'rejecting entry privacy should not open demo selector automatically');

  await resetEntryConsentStorage(page);
  await page.navigate('/', { loadTimeoutMs: 30000 });
  await page.waitForSelector('app-entry-page');
  await page.waitForSelector('app-entry-page app-document-viewer .ui-popup__panel', { timeoutMs: 30000 });
  await assertEntryPrivacyPopup(page, 'entry privacy popup for acceptance pass');
  await toggleEntryOptionalPrivacyIfPresent(page);
  await page.clickVisible('app-entry-page app-document-viewer button[aria-label="Accept and continue"]');
  await page.waitForSelectorHidden('app-entry-page app-document-viewer .ui-popup__panel', { timeoutMs: 10000 });
  await assertEntryConsentAccepted(page);
  await page.recordStep('entry-privacy-accepted');
  assert(!(await page.isSelectorVisible('.entry-auth-btn-location')), 'Demo selector mode should not show the location gate in the header');

  await page.setGeolocationPermission('denied');
  await clickEntryPrimaryAction(page);
  await waitForLoginDialogOrDemoSelector(page, 30000);
  if (await page.isSelectorVisible('.dialog')) {
    await assertLocationDialog(page, 'Location Required For Login');
    await page.recordStep('location-dialog-open-denied-permission');
    await page.clickVisible('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
    await page.waitForSelector('.dialog-error', { timeoutMs: 10000 });
    await assertNoDemoSelector(page, 'browser-denied location should not open demo selector');
    await page.recordStep('location-browser-denied-error');
    await page.clickVisible('.dialog-actions-menu .app-menu__button-row-item:first-of-type');
    await page.waitForSelectorHidden('.dialog', { timeoutMs: 10000 });
    await page.recordStep('location-denied-dialog-cancelled');

    await page.resetPermissions();
    await clickEntryPrimaryAction(page);
    await page.waitForSelector('.dialog', { timeoutMs: 20000 });
    await page.clickVisible('.dialog-backdrop');
    await page.waitForSelectorHidden('.dialog', { timeoutMs: 10000 });
    await assertNoDemoSelector(page, 'backdrop-cancelled location should not open demo selector');
    await page.recordStep('location-dialog-backdrop-cancelled');

    await page.setGeolocation(GEOLOCATION);
    await clickEntryPrimaryAction(page);
    await page.waitForSelector('.dialog', { timeoutMs: 20000 });
    await page.recordStep('location-dialog-open-approve');
    await page.clickVisible('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
    await page.waitForSelectorHidden('.dialog', { timeoutMs: 20000 }).catch(() => undefined);
  } else {
    await page.recordStep('demo-selector-visible-without-location-dialog');
  }
  await page.waitForSelector('.demo-user-stage', { timeoutMs: 30000 });
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
      'app-entry-page app-document-viewer .ui-popup__panel',
      '.dialog',
      '.demo-user-stage',
      'app-profile-settings-popups app-document-viewer .ui-popup__panel'
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
    const overlay = document.querySelector('app-entry-page app-document-viewer .ui-popup__panel');
    const sections = Array.from(overlay?.querySelectorAll('.document-viewer-accordion .ui-accordion__item') ?? []).filter(visible);
    const optional = sections.filter(section => Boolean(section.querySelector('.ui-accordion__select')));
    const mandatory = sections.filter(section => !section.querySelector('.ui-accordion__select'));
    const acceptButton = overlay?.querySelector('button[aria-label="Accept and continue"]');
    const rejectButton = overlay?.querySelector('button[aria-label="Cancel"]');
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
    const optional = Array.from(document.querySelectorAll('app-entry-page app-document-viewer .document-viewer-accordion .ui-accordion__item'))
      .find(section => visible(section) && section.querySelector('.ui-accordion__select'));
    const button = optional?.querySelector('.ui-accordion__select');
    if (!button || button.disabled) {
      return {
        toggled: false,
        optionalCount: document.querySelectorAll('app-entry-page app-document-viewer .document-viewer-accordion .ui-accordion__select').length
      };
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
    const audit = parse('myscoutee.http.entry.gdpr-consent-audit.v1');
    return {
      consent: parse('myscoutee.http.entry.gdpr-consent.v1'),
      optional: parse('myscoutee.http.privacy.optional-approvals.v1'),
      auditActions: Array.isArray(audit) ? audit.map(record => record?.action).filter(Boolean) : []
    };
  });
}

async function resetEntryConsentStorage(page) {
  await page.evaluate(() => {
    window.localStorage.removeItem('myscoutee.http.entry.gdpr-consent.v1');
    window.localStorage.removeItem('myscoutee.http.entry.gdpr-consent-audit.v1');
    window.localStorage.removeItem('myscoutee.http.privacy.optional-approvals.v1');
  });
}

async function assertLocationDialog(page, titleNeedle) {
  const snapshot = await page.evaluate(titleNeedle => {
    const dialog = document.querySelector('.dialog');
    const actions = dialog?.querySelectorAll('.dialog-actions-menu .app-menu__button-row-item') ?? [];
    return {
      visible: Boolean(dialog),
      title: (dialog?.querySelector('h3')?.textContent ?? '').trim(),
      message: (dialog?.querySelector('p')?.textContent ?? '').trim(),
      hasCancel: actions.length >= 2,
      hasConfirm: actions.length >= 1
    };
  }, titleNeedle);
  assert(snapshot.visible, 'Location dialog should be visible', snapshot);
  assert(snapshot.title.includes(titleNeedle), `Location dialog should have title ${titleNeedle}`, snapshot);
  assert(snapshot.hasCancel && snapshot.hasConfirm, 'Location dialog should expose cancel and approve actions', snapshot);
}

async function assertNoDemoSelector(page, label) {
  assert(!(await page.isSelectorVisible('.demo-user-stage')), label);
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
  const privacyPopup = 'app-profile-settings-popups app-document-viewer .ui-popup__panel';
  const requiredVisible = await page.waitForSelector(privacyPopup, { timeoutMs: 6000 })
    .then(() => true)
    .catch(() => false);
  if (requiredVisible) {
    await page.recordStep('navigator-privacy-required-visible');
    await clickVisibleIfPresent(page, 'button[aria-label="Close privacy popup"]');
    assert(await page.isSelectorVisible(privacyPopup), 'Required navigator privacy popup should not close before approval');
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
    const button = document.querySelector('.navigator-trigger-rail:not(.is-covered) .user-selector-menu button[aria-label="Open user menu"]');
    return Boolean(button && !button.disabled);
  }), 20000);
  await page.click('.navigator-trigger-rail:not(.is-covered) .user-selector-menu button[aria-label="Open user menu"]');
  await page.waitForSelector('.user-menu-panel.open', { timeoutMs: 15000 });
  await page.clickVisible('.user-menu-panel.open button[aria-label="Open settings menu"]');
  await page.waitForSelector('button[aria-label="Open privacy"]', { timeoutMs: 15000 });
  await page.clickVisible('button[aria-label="Open privacy"]');
  await page.waitForSelector('app-profile-settings-popups app-document-viewer .ui-popup__panel', { timeoutMs: 20000 });
  await page.waitForSelector('app-profile-settings-popups .document-viewer-accordion .ui-accordion__item', { timeoutMs: 20000 });
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
    const root = document.querySelector('app-profile-settings-popups app-document-viewer .ui-popup__panel');
    const sections = Array.from(root?.querySelectorAll('.document-viewer-accordion .ui-accordion__item') ?? []).filter(visible);
    return {
      visible: Boolean(root && visible(root)),
      sectionCount: sections.length,
      optionalCount: sections.filter(section => Boolean(section.querySelector('.ui-accordion__select'))).length,
      mandatoryCount: sections.filter(section => !section.querySelector('.ui-accordion__select')).length,
      saveVisible: Boolean(root?.querySelector('.document-viewer-action-menu button'))
    };
  });
  assert(snapshot.visible, 'Navigator privacy popup should be visible before saving', snapshot);
  assert(snapshot.sectionCount > 0, 'Navigator privacy popup should render privacy sections', snapshot);

  if (!options.required) {
    await toggleNavigatorOptionalPrivacyIfPresent(page);
  }

  const saveSelector = 'app-profile-settings-popups .document-viewer-action-menu button';
  const saveVisible = await page.isSelectorVisible(saveSelector);
  if (saveVisible) {
    await page.waitFor('navigator privacy save enabled', async () => page.evaluate(() => {
      const button = document.querySelector('app-profile-settings-popups .document-viewer-action-menu button');
      return Boolean(button && !button.disabled);
    }), 20000);
    await page.clickVisible(saveSelector);
    await page.waitForNetwork('/api/privacy/consents', { timeoutMs: 30000 });
    await page.waitForSelectorHidden('app-profile-settings-popups app-document-viewer .ui-popup__panel', { timeoutMs: 30000 });
    return;
  }

  await page.clickVisible('button[aria-label="Close privacy popup"]');
  await page.waitForSelectorHidden('app-profile-settings-popups app-document-viewer .ui-popup__panel', { timeoutMs: 10000 });
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
    const optional = Array.from(document.querySelectorAll(
      'app-profile-settings-popups .document-viewer-accordion .ui-accordion__item'
    )).find(section => visible(section) && section.querySelector('.ui-accordion__select'));
    const button = optional?.querySelector('.ui-accordion__select');
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
