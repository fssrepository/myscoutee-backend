import { assert } from '../../shared/assertions.mjs';

export async function assertBrowserExpectations(page, expected = {}) {
  for (const selector of expected.selectors ?? []) {
    await page.waitForSelector(selector, { timeoutMs: expected.timeoutMs });
  }
  for (const selector of expected.optionalSelectors ?? []) {
    await page.waitForSelector(selector, { timeoutMs: expected.timeoutMs }).catch(() => undefined);
  }
  for (const text of expected.text ?? []) {
    await page.waitForText(text, { timeoutMs: expected.timeoutMs });
  }
  for (const networkPattern of expected.network ?? []) {
    await page.waitForNetwork(networkPattern, { timeoutMs: expected.timeoutMs });
  }
  if (expected.noPageErrors !== false) {
    assert(page.pageErrors.length === 0, 'Browser page should not throw runtime exceptions', {
      pageErrors: page.pageErrors
    });
  }
  if (expected.noFailedApi !== false) {
    const failedApiResponses = page.network.filter(entry => {
      return entry.url.includes('/api/') && entry.status >= 400;
    });
    assert(failedApiResponses.length === 0, 'Browser should not receive failed API responses', {
      failedApiResponses
    });
  }
}

export async function openNavigatorMenu(page) {
  await settleFirstRunOverlays(page);
  await page.waitFor('global navigator button enabled', async () => page.evaluate(() => {
    const button = document.querySelector('button.user-selector-btn-global');
    return Boolean(button && !button.disabled);
  }));
  await page.click('button.user-selector-btn-global');
  await page.waitForSelector('.user-menu-panel.open');
}

export async function assertActiveBackendCalls(page, patterns) {
  for (const pattern of patterns) {
    assert(page.hasNetwork(pattern), `Expected backend call matching ${pattern}`, {
      network: page.network.map(entry => ({ url: entry.url, status: entry.status }))
    });
  }
}

export async function assertVisibleCount(page, selector, minCount, label = selector) {
  const count = await page.evaluate(selector => {
    return Array.from(document.querySelectorAll(selector)).filter(element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    }).length;
  }, selector);
  assert(count >= minCount, `${label} should have at least ${minCount} visible item(s)`, { count });
}

export async function performDemoLogin(page, options = {}) {
  const timeoutMs = Number(options.timeoutMs ?? 45000);
  if (options.geolocation) {
    await page.setGeolocation(options.geolocation);
  }
  await page.primeOrigin(options.storage ?? {});
  await page.navigate(options.entryRoute ?? '/', { loadTimeoutMs: timeoutMs });
  await page.recordStep('suite-login-entry');
  await page.waitForSelector('app-entry-shell', { timeoutMs });
  await acceptEntryPrivacyIfPresent(page, timeoutMs);
  await page.recordStep('suite-login-privacy-accepted');
  await page.click('.entry-cta-primary', { timeoutMs });
  await waitForLoginDialogOrDemoSelector(page, timeoutMs);
  if (await page.isSelectorVisible('.confirmation-dialog')) {
    await page.recordStep('suite-login-location-dialog');
    await page.grantGeolocationPermission();
    await page.click('.confirmation-dialog-confirm-btn', { timeoutMs });
  }
  await page.waitForSelector('.demo-login-overlay', { timeoutMs });
  await page.waitForSelector('.demo-user-item', { timeoutMs });
  await page.recordStep('suite-login-demo-selector');
  await clickDemoUser(page, options.userId ?? '', timeoutMs);
  await page.waitForUrlPath('/game', timeoutMs);
  await settleFirstRunOverlays(page, { timeoutMs });
  await page.recordStep('suite-login-game-ready');
  return page.storageSnapshot();
}

export async function settleFirstRunOverlays(page, options = {}) {
  const timeoutMs = Number(options.timeoutMs ?? 15000);
  await approveNavigatorPrivacyIfPresent(page, timeoutMs);
  await closeExplanationPopupIfPresent(page, timeoutMs);
}

export async function acceptEntryPrivacyIfPresent(page, timeoutMs = 15000) {
  if (!(await page.isSelectorVisible('.entry-consent-overlay'))) {
    await page.waitForSelector('.entry-consent-overlay', {
      timeoutMs: Math.min(timeoutMs, 5000)
    }).catch(() => undefined);
  }
  if (!(await page.isSelectorVisible('.entry-consent-overlay'))) {
    return false;
  }
  await page.waitFor('entry privacy accept enabled', async () => page.evaluate(() => {
    const button = document.querySelector('.entry-consent-btn-primary');
    return Boolean(button && !button.disabled);
  }), timeoutMs);
  await page.click('.entry-consent-btn-primary', { timeoutMs });
  await page.waitForSelectorHidden('.entry-consent-overlay', { timeoutMs });
  await page.recordStep('entry-privacy-accepted');
  return true;
}

export async function approveNavigatorPrivacyIfPresent(page, timeoutMs = 15000) {
  if (!(await page.isSelectorVisible('app-navigator-privacy-popup'))) {
    return false;
  }
  await page.waitFor('navigator privacy save enabled', async () => page.evaluate(() => {
    const button = document.querySelector('.support-privacy-save-btn');
    return Boolean(button && !button.disabled);
  }), timeoutMs);
  await page.click('.support-privacy-save-btn', { timeoutMs });
  await page.waitForSelectorHidden('app-navigator-privacy-popup', { timeoutMs });
  await page.recordStep('navigator-privacy-approved');
  return true;
}

export async function closeExplanationPopupIfPresent(page, timeoutMs = 15000) {
  if (!(await page.isSelectorVisible('.explanation-popup'))) {
    return false;
  }
  await page.click('.explanation-popup__header-action', { timeoutMs });
  await page.waitForSelectorHidden('.explanation-popup', { timeoutMs });
  await page.recordStep('explanation-popup-closed');
  return true;
}

async function clickDemoUser(page, userId, timeoutMs) {
  const clicked = await page.evaluate(({ userId }) => {
    const buttons = Array.from(document.querySelectorAll('.demo-user-item'))
      .filter(button => !button.disabled);
    const normalizedUserId = `${userId ?? ''}`.trim();
    const matchById = normalizedUserId
      ? buttons.find(button => button.getAttribute('data-user-id') === normalizedUserId)
      : null;
    const preferred = matchById
      ?? buttons.find(button => !button.classList.contains('demo-user-item-new') && !button.classList.contains('demo-user-item-blocked'))
      ?? buttons[0];
    if (!preferred) {
      return false;
    }
    preferred.scrollIntoView({ block: 'center', inline: 'center' });
    preferred.click();
    return true;
  }, { userId });
  assert(clicked, 'Should select a demo user from the demo selector');
  await page.waitFor('demo selector closes after user selection', async () => {
    return !(await page.isSelectorVisible('.demo-login-overlay'));
  }, timeoutMs);
}

async function waitForLoginDialogOrDemoSelector(page, timeoutMs) {
  await page.waitFor('location dialog or demo selector', async () => {
    return (await page.isSelectorVisible('.confirmation-dialog'))
      || (await page.isSelectorVisible('.demo-login-overlay'));
  }, timeoutMs);
}
