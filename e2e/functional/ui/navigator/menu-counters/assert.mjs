import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  waitForBackendUiWindow,
  waitForSmartListSettled
} from '../../lib/ui-contracts.mjs';

const MENU_COUNTER_SELECTORS = {
  rates: 'button[aria-label="Open rates"]',
  chat: 'button[aria-label="Open chat"]',
  invitations: 'button[aria-label="Open invitations"]',
  events: 'button[aria-label="Open events"]',
  cars: 'button[aria-label="Transport"]',
  accommodation: 'button[aria-label="Accommodation"]',
  supplies: 'button[aria-label="Supplies"]',
  tickets: 'button[aria-label="Ticket"]',
  feedback: 'button[aria-label="Open feedback"]'
};

export async function assertUi({ page }) {
  await closeExplanationPopupEventually(page, 15000);
  await waitForBackendUiWindow(page);

  const expected = await readExpectedAppCounters(page);
  const initialMenu = await readOpenMenuBadges(page);
  assertBadgeMatches(initialMenu.events, expected.activities.event.all, 'Menu should show the consolidated event counter on login', {
    initialMenu,
    expected
  });
  assertBadgeMatches(initialMenu.invitations, expected.activities.invitations, 'Menu should show invitation counter on login', {
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
  assertBadgeMatches(initialMenu.feedback, expected.activities.feedbackCounts.pending, 'Menu feedback counter should show pending feedback on login', {
    initialMenu,
    expected
  });
  assert(
    normalizeCounter(expected.activities.feedback) === normalizeCounter(expected.activities.feedbackCounts.pending),
    'Top-level feedback counter should be the pending feedback counter',
    { expected }
  );

  await openEventsPopupFromMenu(page);
  const eventCounters = await readEventPopupCounters(page);
  assertBadgeMatches(eventCounters.primaryTrigger, expected.activities.events, 'Event popup Events trigger badge should match the active event counter', {
    initialMenu,
    eventCounters,
    expected
  });
  assertBadgeTextEquals(eventCounters.scopeTrigger, initialMenu.events, 'Event popup All scope badge should match the navigator Events badge', {
    initialMenu,
    eventCounters
  });
  assertBadgeMatches(eventCounters.scopeTrigger, expected.activities.event.all, 'Event popup default All scope trigger should match the consolidated event counter', {
    initialMenu,
    eventCounters,
    expected
  });
  assertBadgeMatches(eventCounters.scope.activeEvents, expected.activities.event.active, 'Event popup Active Events badge should match app-context active events', {
    initialMenu,
    eventCounters
  });
  assertBadgeTextEquals(eventCounters.scope.invitations, initialMenu.invitations, 'Event popup Invitations badge should match menu Invitations badge', {
    initialMenu,
    eventCounters
  });
  assertBadgeMatches(eventCounters.scope.myEvents, expected.activities.event.hosting, 'Event popup My Events badge should match app-context hosting events', {
    initialMenu,
    eventCounters
  });
  assertBadgeMatches(eventCounters.scope.all, expected.activities.event.all, 'Event popup All badge should be the stored app-context event total', {
    initialMenu,
    eventCounters,
    expected
  });
  await closePopup(page, '.activities-popup');
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
  await closePopup(page, '.asset-popup-content');
  await assertMenuCountersUnchanged(page, initialMenu, 'opening the assets popup');

  await openFeedbackPopupFromMenu(page);
  const feedbackCounters = await readFeedbackPopupCounters(page);
  assertBadgeTextEquals(feedbackCounters.pending, initialMenu.feedback, 'Event feedback Pending badge should match menu Feedback badge', {
    initialMenu,
    feedbackCounters
  });
  await closePopup(page, '.feedback-list-popup');
  await assertMenuCountersUnchanged(page, initialMenu, 'opening the feedback popup');

  await assertNoDocumentHorizontalOverflow(page);
}

async function openEventsPopupFromMenu(page) {
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open button[aria-label="Open events"]');
  await page.waitForSelector('.activities-popup', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
  await waitForSmartListSettled(page, '.activities-popup', 30000);
}

async function openAssetsPopupFromMenu(page) {
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open button[aria-label="Transport"]');
  await page.waitForSelector('.asset-popup-content', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
  await waitForBackendUiWindow(page, '.asset-popup-content', 30000);
}

async function openFeedbackPopupFromMenu(page) {
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open button[aria-label="Open feedback"]');
  await page.waitForSelector('.feedback-list-popup', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
  await waitForBackendUiWindow(page, '.feedback-list-popup', 30000);
}

async function readOpenMenuBadges(page) {
  await openNavigatorMenu(page);
  return page.evaluate(selectors => {
    const counters = {};
    for (const [key, selector] of Object.entries(selectors)) {
      const button = document.querySelector(`.user-menu-panel.open ${selector}`);
      counters[key] = normalizeBadgeText(button?.querySelector('.app-menu__counter')?.textContent ?? '');
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
  const toolbarSelector = '.ui-popup__panel:has(.activities-popup) .ui-popup__toolbar';
  const primaryTrigger = await readMenuTriggerCounter(page, toolbarSelector, 'Events');
  const scopeTrigger = await readMenuTriggerCounter(page, toolbarSelector, 'All');
  await page.clickByText(`${toolbarSelector} .app-menu__trigger`, 'All');
  const optionSelector = `${toolbarSelector} .app-menu__panel button`;
  await page.waitForSelector(optionSelector, { timeoutMs: 10000 });
  const scope = await readOptionCountersByLabel(page, optionSelector, {
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
  await page.mouseClickVisible('app-asset-popup button[aria-label="Open asset filter"]');
  const optionSelector = 'app-asset-popup .app-menu__panel button';
  await page.waitForSelector(optionSelector, { timeoutMs: 10000 });
  const counters = await readOptionCountersByLabel(page, optionSelector, {
    car: 'Transport',
    property: 'Accommodation',
    supplies: 'Supplies',
    ticket: 'Ticket'
  });
  await closeMatOverlay(page);
  return counters;
}

async function readFeedbackPopupCounters(page) {
  await page.mouseClickVisible('app-feedback-popup button[aria-label="Open feedback filter"]');
  const optionSelector = 'app-feedback-popup .app-menu__panel button';
  await page.waitForSelector(optionSelector, { timeoutMs: 10000 });
  const counters = await readOptionCountersByLabel(page, optionSelector, {
    ownEvents: 'Own Events',
    pending: 'Pending',
    feedbacked: 'Feedbacked',
    removed: 'Removed'
  });
  await page.mouseClickVisible('app-feedback-popup button[aria-label="Open feedback filter"]');
  return counters;
}

async function readMenuTriggerCounter(page, rootSelector, label) {
  return page.evaluate(({ rootSelector, label }) => {
    const normalize = value => `${value ?? ''}`.trim().replace(/\s+/g, ' ');
    const trigger = Array.from(document.querySelectorAll(`${rootSelector} .app-menu__trigger`))
      .find(button => normalize(button.querySelector('.app-menu__trigger-label')?.textContent) === label);
    return normalize(trigger?.querySelector('.app-menu__counter')?.textContent);
  }, { rootSelector, label });
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
      counters[match[0]] = normalizeBadgeText(option.querySelector('.app-menu__counter, .rate-filter-count-badge')?.textContent ?? '');
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
    const eventResponse = await fetch('/api/activities/events/filter', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: session.userId,
        filter: 'all',
        hostingPublicationFilter: 'all',
        secondaryFilter: 'recent',
        sort: 'date',
        view: 'day',
        limit: 1,
        cursor: null
      })
    });
    if (!eventResponse.ok) {
      throw new Error(`Failed to load canonical event counters: ${eventResponse.status}`);
    }
    const eventPage = await eventResponse.json();
    const event = eventPage.eventCounters ?? activities.event ?? {};
    return {
      userId: user.id,
      activities: {
        ...activities,
        events: event.active ?? activities.events,
        invitations: event.invitations ?? activities.invitations,
        hosting: event.hosting ?? activities.hosting,
        event,
        asset: activities.asset ?? {},
        feedbackCounts: activities.feedbackCounts ?? {}
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

function expectedBadgeText(value, max = 99) {
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
  await page.evaluate(panelSelector => {
    const panel = document.querySelector(panelSelector)?.closest('.ui-popup__panel');
    panel?.querySelector('.ui-popup__close')?.click();
  }, panelSelector);
  await page.waitForSelectorHidden(panelSelector, { timeoutMs: 20000 });
}
