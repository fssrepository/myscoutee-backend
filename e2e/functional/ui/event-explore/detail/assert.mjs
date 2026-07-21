import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  assertVisibleCount,
  waitForSmartListSettled,
  waitForVisibleCount,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  smartListSnapshot
} from '../../lib/ui-contracts.mjs';

const EXPLORE_POPUP = 'app-event-explore-popup .ui-popup__panel';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('event-explore-navigator-menu-open');
  await page.click('button[aria-label="Open events"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.activities-popup');
  if (await page.isSelectorVisible('button[aria-label="Open event explore"]')) {
    await page.clickVisible('button[aria-label="Open event explore"]');
  } else {
    await page.click('button[aria-label="Open event actions"]');
    await page.clickByText('app-activities-popup .ui-popup__panel .app-menu__panel button', 'Explore');
  }
  await page.waitForSelector('.event-explore-popup');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForSmartListSettled(page, '.event-explore-popup');
  await waitForVisibleCount(page, '.event-explore-popup .experience-item-card', 1, 'event explore cards', 45000);
  await page.recordStep('event-explore-cards-visible');

  const initialSnapshot = await smartListSnapshot(page, '.event-explore-popup');
  assert(initialSnapshot.itemCount > 0, 'Event explore smart-list should render cards before filtering', initialSnapshot);
  await assertNoDocumentHorizontalOverflow(page);

  await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Open event explore order"]`);
  await page.waitForSelector(`${EXPLORE_POPUP} .app-menu__panel`);
  await page.recordStep('event-explore-order-menu-open');
  await page.clickByText(`${EXPLORE_POPUP} .app-menu__panel button`, 'Nearby');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForToolbarTextOrFinding(page, 'Nearby', 'Event explore order label did not visibly update to Nearby');
  await page.recordStep('event-explore-order-nearby-applied');

  await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Open event explore view"]`);
  await page.waitForSelector(`${EXPLORE_POPUP} .app-menu__panel`);
  await page.recordStep('event-explore-view-menu-open');
  await page.clickByText(`${EXPLORE_POPUP} .app-menu__panel button`, 'Distance');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForToolbarTextOrFinding(page, 'Distance', 'Event explore view label did not visibly update to Distance');
  await page.recordStep('event-explore-view-distance-applied');

  const distanceSnapshot = await smartListSnapshot(page, '.event-explore-popup');
  if (distanceSnapshot.itemCount > 0) {
    assert(
      distanceSnapshot.groups.length > 0
        || distanceSnapshot.items.some(item => /\bkm\b/i.test(item.group || item.text)),
      'Distance view should expose distance grouping or distance-labelled cards',
      distanceSnapshot
    );
  } else {
    assert(
      /no items/i.test(distanceSnapshot.stickyLabel) || await page.isSelectorVisible('.event-explore-popup .smart-list-empty'),
      'Distance view may be empty, but it should render an explicit empty state',
      distanceSnapshot
    );
    await page.recordStep('event-explore-distance-empty-state');
  }

  await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Open spots"]`);
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await page.waitFor('Open spots filter active', async () => {
    return page.evaluate(selector => {
      const button = document.querySelector(selector);
      return button?.getAttribute('aria-pressed') === 'true'
        || button?.classList.contains('app-menu__button-row-item--active') === true;
    }, `${EXPLORE_POPUP} button[aria-label="Open spots"]`);
  }, 10000);
  await page.recordStep('event-explore-open-spots-filter-active');

  if ((await page.visibleCount('.event-explore-popup .experience-item-card')) === 0) {
    await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Open spots"]`);
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }

  await exerciseTopicFilterIfAvailable(page);
  await ensureExploreCardsAvailable(page);
  await openMembersPreviewIfAvailable(page);

  const selectedTitle = await openFirstExploreCardMenu(page);
  await page.recordStep('event-explore-card-menu-open');
  await page.clickByText('app-event-explore-popup app-menu-outlet .app-menu__panel button', 'View Event', { timeoutMs: 15000 });
  await page.waitForSelector('app-event-subevents-list-popup .event-subevents-list-smart-list');
  await page.recordStep('event-explore-subevents-overview-open');
  await page.clickByText('app-event-subevents-list-popup .ui-popup__toolbar button', 'View', { timeoutMs: 15000 });
  await page.waitForSelector('app-event-editor-popup .ui-popup__panel');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelectorHidden('.popup-loading-overlay', { timeoutMs: 20000 });
  await page.recordStep('event-explore-detail-editor-open');

  const detailText = await page.textContent('app-event-editor-popup .ui-popup__panel');
  assert(detailText.includes(selectedTitle), 'Event detail editor should show the selected explore card title', {
    selectedTitle,
    detailText: detailText.slice(0, 500)
  });
  await assertNoDocumentHorizontalOverflow(page);
}

async function exerciseTopicFilterIfAvailable(page) {
  const triggerSelector = `${EXPLORE_POPUP} button[aria-label="Open topic filter"]`;
  const optionSelector = `${EXPLORE_POPUP} .app-menu__panel button`;
  await page.clickVisible(triggerSelector);
  await page.waitForSelector(optionSelector, { timeoutMs: 10000 }).catch(() => undefined);
  if (!(await page.isSelectorVisible(optionSelector))) {
    return;
  }
  const topic = await page.evaluate(optionSelector => {
    const button = Array.from(document.querySelectorAll(optionSelector))
      .find(item => {
        const rect = item.getBoundingClientRect();
        const style = window.getComputedStyle(item);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && !item.disabled
          && (item.textContent ?? '').includes('#');
      });
    button?.scrollIntoView({ block: 'center', inline: 'center' });
    button?.click();
    return button?.textContent?.trim() ?? '';
  }, optionSelector);
  if (!topic) {
    await page.clickVisible(triggerSelector);
    return;
  }
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await page.recordStep('event-explore-topic-filter-active');

  if ((await page.visibleCount('.event-explore-popup .experience-item-card')) === 0) {
    if (!(await page.isSelectorVisible(optionSelector))) {
      await page.clickVisible(triggerSelector);
      await page.waitForSelector(optionSelector, { timeoutMs: 10000 });
    }
    await page.clickByText(optionSelector, topic);
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
    await page.recordStep('event-explore-topic-filter-cleared');
  }
}

async function waitForToolbarTextOrFinding(page, label, title) {
  const visible = await page.waitForText(label, { timeoutMs: 10000 })
    .then(() => true)
    .catch(() => false);
  if (visible) {
    return;
  }
  const toolbar = await page.evaluate(() => {
    const root = document.querySelector('.event-explore-popup');
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      text: (root?.querySelector('.activities-popup-toolbar, .activities-toolbar, .popup-panel-header')?.textContent ?? root?.textContent ?? '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 800),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  });
  if (toolbar.viewportWidth <= 760) {
    return;
  }
  await page.recordStep(`event-explore-toolbar-label-missing-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  page.recordFinding?.({
    severity: 'warning',
    title,
    details: {
      expectedLabel: label,
      ...toolbar
    }
  });
}

async function ensureExploreCardsAvailable(page) {
  if ((await page.visibleCount('.event-explore-popup .experience-item-card')) > 0) {
    return;
  }
  await clearExploreFilters(page);
  await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Open event explore order"]`);
  await page.waitForSelector(`${EXPLORE_POPUP} .app-menu__panel`);
  await page.clickByText(`${EXPLORE_POPUP} .app-menu__panel button`, 'Upcoming');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Open event explore view"]`);
  await page.waitForSelector(`${EXPLORE_POPUP} .app-menu__panel`);
  await page.clickByText(`${EXPLORE_POPUP} .app-menu__panel button`, 'Day');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForSmartListSettled(page, '.event-explore-popup');
  await waitForVisibleCount(page, '.event-explore-popup .experience-item-card', 1, 'event explore cards after reset', 45000);
}

async function clearExploreFilters(page) {
  if (await isPressed(page, `${EXPLORE_POPUP} button[aria-label="Friends going"]`)) {
    await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Friends going"]`);
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }
  if (await isPressed(page, `${EXPLORE_POPUP} button[aria-label="Open spots"]`)) {
    await page.clickVisible(`${EXPLORE_POPUP} button[aria-label="Open spots"]`);
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }
  const topicTrigger = `${EXPLORE_POPUP} button[aria-label="Open topic filter"]`;
  if (await isPressed(page, topicTrigger)) {
    await page.clickVisible(topicTrigger);
    const cleared = await page.evaluate(rootSelector => {
      const option = Array.from(document.querySelectorAll(`${rootSelector} .app-menu__panel button`))
        .find(button => button.getAttribute('aria-checked') === 'true');
      if (!option) {
        return false;
      }
      option.scrollIntoView({ block: 'center', inline: 'center' });
      option.click();
      return true;
    }, EXPLORE_POPUP);
    assert(cleared, 'Active event explore topic filter should be clearable');
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }
  await page.recordStep('event-explore-filters-cleared');
}

async function isPressed(page, selector) {
  return page.evaluate(selector => {
    const button = document.querySelector(selector);
    return button?.getAttribute('aria-pressed') === 'true'
      || button?.classList.contains('app-menu__button-row-item--active') === true;
  }, selector);
}

async function openMembersPreviewIfAvailable(page) {
  const clickResult = await page.evaluate(() => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const button = Array.from(document.querySelectorAll('.event-explore-popup .ui-info-card__overlay-action--end'))
      .find(item => isVisible(item)
        && !item.disabled
        && /open event members/i.test(item.getAttribute('aria-label') ?? ''));
    if (!button) {
      return { clicked: false };
    }
    const card = button.closest('.experience-item-card');
    const title = card?.querySelector('.ui-info-card__title')?.textContent?.trim() ?? '';
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return {
      clicked: true,
      title,
      ariaLabel: button.getAttribute('aria-label') ?? '',
      viewportWidth: window.innerWidth
    };
  });
  if (!clickResult.clicked) {
    return;
  }
  const membersOpened = await page.waitForSelector('.activity-members-popup-shell', { timeoutMs: 15000 })
    .then(() => true)
    .catch(() => false);
  if (!membersOpened) {
    await page.recordStep('event-explore-members-preview-not-opened');
    if (clickResult.viewportWidth <= 760) {
      page.recordFinding?.({
        severity: 'warning',
        title: 'Mobile event explore members badge did not open members preview',
        details: clickResult
      });
      return;
    }
    assert(false, 'Event explore members preview badge should open the members popup', clickResult);
  }
  await page.waitForNetwork('/api/activities/events/members', { timeoutMs: 25000 }).catch(() => undefined);
  await page.recordStep('event-explore-members-preview-open');
  await page.clickVisible('app-event-members-popup .ui-popup__close');
  await page.waitForSelectorHidden('.activity-members-popup-shell', { timeoutMs: 15000 });
}

async function openFirstExploreCardMenu(page) {
  const result = await page.evaluate(() => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const card = Array.from(document.querySelectorAll('.event-explore-popup .experience-item-card'))
      .find(isVisible);
    const title = card?.querySelector('.ui-info-card__title')?.textContent?.trim() ?? '';
    const button = card?.querySelector('.ui-info-card__menu-trigger');
    if (!card || !button || button.disabled) {
      return { clicked: false, title };
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return { clicked: true, title };
  });
  assert(result.clicked, 'Event explore card should expose a menu trigger', result);
  assert(result.title, 'Event explore card should expose a title', result);
  await page.waitForSelector('app-event-explore-popup app-menu-outlet .app-menu__panel button');
  return result.title;
}
