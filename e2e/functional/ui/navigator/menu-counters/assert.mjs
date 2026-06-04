import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  waitForBackendUiWindow
} from '../../lib/ui-contracts.mjs';

const MENU_COUNTER_SELECTORS = {
  rates: '.menu-shortcuts .menu-shortcut-rates',
  chat: '.menu-shortcuts .menu-shortcut-chat',
  invitations: '.menu-shortcuts .menu-shortcut-invitations',
  events: '.menu-shortcuts .menu-shortcut-events',
  hosting: '.menu-shortcuts .menu-shortcut-hosting',
  cars: '.assets-shortcuts .asset-shortcut-car',
  accommodation: '.assets-shortcuts .asset-shortcut-accommodation',
  supplies: '.assets-shortcuts .asset-shortcut-supplies',
  tickets: '.assets-shortcuts .asset-shortcut-ticket',
  feedback: '.feedback-shortcut-event'
};

export async function assertUi({ page }) {
  await closeExplanationPopupEventually(page, 15000);
  await waitForBackendUiWindow(page);

  const expected = await readExpectedAppCounters(page);
  const initialMenu = await readOpenMenuBadges(page);
  assertBadgeMatches(initialMenu.events, expected.activities.events, 'Menu should show active event counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.invitations, expected.activities.invitations, 'Menu should show invitation counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.hosting, expected.activities.hosting, 'Menu should show hosting counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.cars, expected.activities.asset.cars, 'Menu should show car asset counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.accommodation, expected.activities.asset.accommodation, 'Menu should show accommodation asset counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.supplies, expected.activities.asset.supplies, 'Menu should show supplies asset counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.tickets, expected.activities.asset.tickets, 'Menu should show ticket counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.feedback, expected.activities.eventFeedback.pending, 'Menu feedback counter should show pending event feedback on login', {
    initialMenu,
    expected
  });
  assert(
    normalizeCounter(expected.activities.feedback) === normalizeCounter(expected.activities.eventFeedback.pending),
    'Top-level feedback counter should be the pending event-feedback counter',
    { expected }
  );

  await openEventsPopupFromMenu(page);
  const eventCounters = await readEventPopupCounters(page);
  assertBadgeMatches(eventCounters.primaryTrigger, expected.activities.event.all, 'Event popup Events trigger badge should match app-context All event counter', {
    initialMenu,
    eventCounters,
    expected
  });
  assertBadgeMatches(eventCounters.scopeTrigger, expected.activities.event.active, 'Event popup active scope trigger should match app-context Active Events counter', {
    initialMenu,
    eventCounters,
    expected
  });
  assertBadgeTextEquals(eventCounters.scope.activeEvents, initialMenu.events, 'Event popup Active Events badge should match menu Events badge', {
    initialMenu,
    eventCounters
  });
  assertBadgeTextEquals(eventCounters.scope.invitations, initialMenu.invitations, 'Event popup Invitations badge should match menu Invitations badge', {
    initialMenu,
    eventCounters
  });
  assertBadgeTextEquals(eventCounters.scope.myEvents, initialMenu.hosting, 'Event popup My Events badge should match menu My Events badge', {
    initialMenu,
    eventCounters
  });
  assertBadgeMatches(eventCounters.scope.all, expected.activities.event.all, 'Event popup All badge should be the stored app-context event total', {
    initialMenu,
    eventCounters,
    expected
  });
  await closePopup(page, '.popup-panel-activities');
  await assertMenuCountersUnchanged(page, initialMenu, 'opening the events popup');

  await openAssetsPopupFromMenu(page);
  const assetCounters = await readAssetPopupCounters(page);
  assertBadgeTextEquals(assetCounters.car, initialMenu.cars, 'Asset popup Car badge should match menu Car badge', { initialMenu, assetCounters });
  assertBadgeTextEquals(assetCounters.property, initialMenu.accommodation, 'Asset popup Property badge should match menu Property badge', {
    initialMenu,
    assetCounters
  });
  assertBadgeTextEquals(assetCounters.supplies, initialMenu.supplies, 'Asset popup Supplies badge should match menu Supplies badge', {
    initialMenu,
    assetCounters
  });
  assertBadgeTextEquals(assetCounters.ticket, initialMenu.tickets, 'Asset popup Ticket badge should match menu Ticket badge', {
    initialMenu,
    assetCounters
  });
  await closePopup(page, '.popup-panel-assets');
  await assertMenuCountersUnchanged(page, initialMenu, 'opening the assets popup');

  await openFeedbackPopupFromMenu(page);
  const feedbackCounters = await readFeedbackPopupCounters(page);
  assertBadgeTextEquals(feedbackCounters.pending, initialMenu.feedback, 'Event feedback Pending badge should match menu Feedback badge', {
    initialMenu,
    feedbackCounters
  });
  await closePopup(page, '.popup-panel-event-feedback');
  await assertMenuCountersUnchanged(page, initialMenu, 'opening the feedback popup');

  await assertNoDocumentHorizontalOverflow(page);
}

async function openEventsPopupFromMenu(page) {
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open .menu-shortcuts .menu-shortcut-events');
  await page.waitForSelector('.popup-panel-activities', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
  await waitForBackendUiWindow(page, '.popup-panel-activities', 30000);
}

async function openAssetsPopupFromMenu(page) {
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open .assets-shortcuts .asset-shortcut-car');
  await page.waitForSelector('.popup-panel-assets', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
  await waitForBackendUiWindow(page, '.popup-panel-assets', 30000);
}

async function openFeedbackPopupFromMenu(page) {
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open .feedback-shortcut-event');
  await page.waitForSelector('.popup-panel-event-feedback', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
  await waitForBackendUiWindow(page, '.popup-panel-event-feedback', 30000);
}

async function readOpenMenuBadges(page) {
  await openNavigatorMenu(page);
  return page.evaluate(selectors => {
    const counters = {};
    for (const [key, selector] of Object.entries(selectors)) {
      const button = document.querySelector(`.user-menu-panel.open ${selector}`);
      counters[key] = normalizeBadgeText(button?.querySelector('.menu-shortcut-badge, .card-badge')?.textContent ?? '');
    }
    return counters;

    function normalizeBadgeText(text) {
      return `${text ?? ''}`.trim();
    }
  }, MENU_COUNTER_SELECTORS);
}

async function assertMenuCountersUnchanged(page, expected, actionLabel) {
  const actual = await readOpenMenuBadges(page);
  for (const key of Object.keys(MENU_COUNTER_SELECTORS)) {
    assertBadgeTextEquals(actual[key], expected[key], `Menu ${key} counter should not change after ${actionLabel}`, {
      expected,
      actual
    });
  }
}

async function readEventPopupCounters(page) {
  const primaryTrigger = await readCounterText(page, '.popup-panel-activities .activities-primary-filter-select .rate-filter-trigger-badge');
  const scopeTrigger = await readCounterText(page, '.popup-panel-activities .activities-event-scope-filter-select .rate-filter-trigger-badge');
  await page.mouseClickVisible('.popup-panel-activities .activities-event-scope-filter-select .mat-mdc-select-trigger');
  await page.waitForSelector('.activities-event-scope-options-panel mat-option', { timeoutMs: 10000 });
  const scope = await readOptionCountersByLabel(page, '.activities-event-scope-options-panel mat-option', {
    all: 'All',
    activeEvents: 'Active Events',
    pending: 'Pending',
    invitations: 'Invitations',
    myEvents: 'My Events',
    drafts: 'Drafts',
    trash: 'Trash'
  });
  await closeMatOverlay(page);
  return { primaryTrigger, scopeTrigger, scope };
}

async function readAssetPopupCounters(page) {
  await page.mouseClickVisible('.popup-panel-assets .assets-primary-filter-select .mat-mdc-select-trigger');
  await page.waitForSelector('.assets-filter-options-panel mat-option', { timeoutMs: 10000 });
  const counters = await readOptionCountersByLabel(page, '.assets-filter-options-panel mat-option', {
    car: 'Car',
    property: 'Property',
    supplies: 'Supplies',
    ticket: 'Ticket'
  });
  await closeMatOverlay(page);
  return counters;
}

async function readFeedbackPopupCounters(page) {
  await page.mouseClickVisible('.popup-panel-event-feedback .event-feedback-filter-trigger');
  await page.waitForSelector('.popup-panel-event-feedback .event-feedback-filter-option', { timeoutMs: 10000 });
  const counters = await readOptionCountersByLabel(page, '.popup-panel-event-feedback .event-feedback-filter-option', {
    ownEvents: 'Own Events',
    pending: 'Pending',
    feedbacked: 'Feedbacked',
    removed: 'Removed'
  });
  await page.mouseClickVisible('.popup-panel-event-feedback .event-feedback-filter-trigger');
  return counters;
}

async function readCounterText(page, selector) {
  const text = await page.evaluate(selector => document.querySelector(selector)?.textContent ?? '', selector);
  return normalizeBadgeText(text);
}

async function readOptionCountersByLabel(page, selector, labelsByKey) {
  return page.evaluate(({ selector, labelsByKey }) => {
    const counters = Object.fromEntries(Object.keys(labelsByKey).map(key => [key, '']));
    const entries = Object.entries(labelsByKey)
      .sort((left, right) => right[1].length - left[1].length)
      .map(([key, label]) => [key, label.toLowerCase()]);
    for (const option of Array.from(document.querySelectorAll(selector)).filter(isVisible)) {
      const text = (option.textContent ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
      const match = entries.find(([, label]) => text.includes(label));
      if (!match) {
        continue;
      }
      counters[match[0]] = normalizeBadgeText(option.querySelector('.rate-filter-count-badge')?.textContent ?? '');
    }
    return counters;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }

    function normalizeBadgeText(text) {
      return `${text ?? ''}`.trim();
    }
  }, { selector, labelsByKey });
}

async function readExpectedAppCounters(page) {
  return page.evaluate(async () => {
    const session = Object.entries(localStorage)
      .filter(([key]) => key.endsWith('session.v1'))
      .map(([, value]) => {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      })
      .find(value => value?.kind === 'demo' && typeof value.userId === 'string');
    if (!session?.userId) {
      throw new Error('Missing demo session for counter expectations');
    }
    const response = await fetch(`/api/auth/me?userId=${encodeURIComponent(session.userId)}`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Failed to load app-context counters: ${response.status}`);
    }
    const user = await response.json();
    const activities = user.activities ?? {};
    return {
      userId: user.id,
      activities: {
        ...activities,
        event: activities.event ?? {},
        asset: activities.asset ?? {},
        eventFeedback: activities.eventFeedback ?? {}
      }
    };
  });
}

function assertBadgeMatches(actualText, rawValue, message, details = {}) {
  const expectedText = expectedBadgeText(rawValue);
  const normalizedActual = normalizeBadgeText(actualText);
  assert(
    normalizedActual === expectedText || (Number(rawValue) <= 0 && normalizedActual === ''),
    message,
    { ...details, actualText: normalizedActual, expectedText, rawValue }
  );
}

function assertBadgeTextEquals(actualText, expectedText, message, details = {}) {
  const normalizedActual = normalizeBadgeText(actualText);
  const normalizedExpected = normalizeBadgeText(expectedText);
  assert(normalizedActual === normalizedExpected, message, {
    ...details,
    actualText: normalizedActual,
    expectedText: normalizedExpected
  });
}

function expectedBadgeText(value, max = 9) {
  const normalizedMax = Math.max(1, Math.trunc(Number(max) || 9));
  const normalizedValue = Math.max(0, Math.trunc(Number(value) || 0));
  return normalizedValue > normalizedMax ? `${normalizedMax}+` : `${normalizedValue}`;
}

function normalizeBadgeText(text) {
  return `${text ?? ''}`.trim();
}

function normalizeCounter(value) {
  return Math.max(0, Math.trunc(Number(value) || 0));
}

async function closeMatOverlay(page) {
  await page.evaluate(() => {
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  });
  await page.waitForSelectorHidden('.cdk-overlay-pane .mat-mdc-select-panel', { timeoutMs: 10000 }).catch(() => undefined);
}

async function closePopup(page, panelSelector) {
  if (await page.isSelectorVisible(`${panelSelector} .popup-close`)) {
    await page.mouseClickVisible(`${panelSelector} .popup-close`);
  }
  await page.waitForSelectorHidden(panelSelector, { timeoutMs: 20000 });
}
