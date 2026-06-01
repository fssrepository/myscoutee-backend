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

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('event-explore-navigator-menu-open');
  await page.click('button[aria-label="Open events"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.popup-panel-activities');
  if (await page.isSelectorVisible('.activities-explore-btn')) {
    await page.clickVisible('.activities-explore-btn');
  } else {
    await page.click('button[aria-label="Open event actions"]');
    await page.click('.activities-quick-action-option-explore');
  }
  await page.waitForSelector('.popup-panel-event-explore');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForSmartListSettled(page, '.popup-panel-event-explore');
  await waitForVisibleCount(page, '.popup-panel-event-explore .experience-item-card', 1, 'event explore cards', 45000);
  await page.recordStep('event-explore-cards-visible');

  const initialSnapshot = await smartListSnapshot(page, '.popup-panel-event-explore');
  assert(initialSnapshot.itemCount > 0, 'Event explore smart-list should render cards before filtering', initialSnapshot);
  await assertNoDocumentHorizontalOverflow(page);

  await page.clickVisible('.popup-panel-event-explore .event-explore-order-trigger');
  await page.waitForSelector('.popup-panel-event-explore .event-explore-order-panel');
  await page.recordStep('event-explore-order-menu-open');
  await page.clickByText('.popup-panel-event-explore .event-explore-order-panel button', 'Nearby');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForToolbarTextOrFinding(page, 'Nearby', 'Event explore order label did not visibly update to Nearby');
  await page.recordStep('event-explore-order-nearby-applied');

  await page.clickVisible('.popup-panel-event-explore .event-explore-view-trigger');
  await page.waitForSelector('.popup-panel-event-explore .event-explore-order-panel');
  await page.recordStep('event-explore-view-menu-open');
  await page.clickByText('.popup-panel-event-explore .event-explore-order-panel button', 'Distance');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForToolbarTextOrFinding(page, 'Distance', 'Event explore view label did not visibly update to Distance');
  await page.recordStep('event-explore-view-distance-applied');

  const distanceSnapshot = await smartListSnapshot(page, '.popup-panel-event-explore');
  if (distanceSnapshot.itemCount > 0) {
    assert(
      distanceSnapshot.groups.length > 0
        || distanceSnapshot.items.some(item => /\bkm\b/i.test(item.group || item.text)),
      'Distance view should expose distance grouping or distance-labelled cards',
      distanceSnapshot
    );
  } else {
    assert(
      /no items/i.test(distanceSnapshot.stickyLabel) || await page.isSelectorVisible('.popup-panel-event-explore .smart-list-empty'),
      'Distance view may be empty, but it should render an explicit empty state',
      distanceSnapshot
    );
    await page.recordStep('event-explore-distance-empty-state');
  }

  await page.clickVisible('.popup-panel-event-explore .event-explore-filter-rooms');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await page.waitFor('.event-explore-filter-rooms active', async () => {
    return page.evaluate(() => document.querySelector('.event-explore-filter-rooms')?.classList.contains('is-active') === true);
  }, 10000);
  await page.recordStep('event-explore-open-spots-filter-active');

  if ((await page.visibleCount('.popup-panel-event-explore .experience-item-card')) === 0) {
    await page.clickVisible('.popup-panel-event-explore .event-explore-filter-rooms');
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }

  await exerciseTopicFilterIfAvailable(page);
  await ensureExploreCardsAvailable(page);
  await openMembersPreviewIfAvailable(page);

  const selectedTitle = await openFirstExploreCardMenu(page);
  await page.recordStep('event-explore-card-menu-open');
  await page.clickByText('.popup-panel-event-explore .ui-info-card__menu-action', 'View Event', { timeoutMs: 15000 });
  await page.waitForSelector('.popup-panel-event-editor');
  await page.waitForSelector('.event-editor-popup-shell');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelectorHidden('.popup-loading-overlay', { timeoutMs: 20000 });
  await page.recordStep('event-explore-detail-editor-open');

  const detailText = await page.textContent('.popup-panel-event-editor');
  assert(detailText.includes(selectedTitle), 'Event detail editor should show the selected explore card title', {
    selectedTitle,
    detailText: detailText.slice(0, 500)
  });
  await assertNoDocumentHorizontalOverflow(page);
}

async function exerciseTopicFilterIfAvailable(page) {
  await page.clickVisible('.popup-panel-event-explore .event-explore-filter-topic');
  await page.waitForSelector('.popup-panel-topic-picker', { timeoutMs: 10000 }).catch(() => undefined);
  if (!(await page.isSelectorVisible('.popup-panel-topic-picker'))) {
    return;
  }
  const topic = await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll('.popup-panel-topic-picker .values-option-chip'))
      .find(item => {
        const rect = item.getBoundingClientRect();
        const style = window.getComputedStyle(item);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && !item.disabled;
      });
    button?.scrollIntoView({ block: 'center', inline: 'center' });
    button?.click();
    return button?.textContent?.trim() ?? '';
  });
  if (!topic) {
    await page.clickVisible('.popup-panel-topic-picker .popup-back-btn');
    return;
  }
  await page.waitForSelectorHidden('.popup-panel-topic-picker', { timeoutMs: 10000 });
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await page.recordStep('event-explore-topic-filter-active');

  if ((await page.visibleCount('.popup-panel-event-explore .experience-item-card')) === 0) {
    await page.clickVisible('.popup-panel-event-explore .event-explore-filter-topic');
    await page.waitForSelector('.popup-panel-topic-picker', { timeoutMs: 10000 });
    await page.clickByText('.popup-panel-topic-picker .values-option-chip', topic);
    await page.waitForSelectorHidden('.popup-panel-topic-picker', { timeoutMs: 10000 });
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
    const root = document.querySelector('.popup-panel-event-explore');
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
  if ((await page.visibleCount('.popup-panel-event-explore .experience-item-card')) > 0) {
    return;
  }
  await clearExploreFilters(page);
  await page.clickVisible('.popup-panel-event-explore .event-explore-order-trigger');
  await page.waitForSelector('.popup-panel-event-explore .event-explore-order-panel');
  await page.clickByText('.popup-panel-event-explore .event-explore-order-panel button', 'Upcoming');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await page.clickVisible('.popup-panel-event-explore .event-explore-view-trigger');
  await page.waitForSelector('.popup-panel-event-explore .event-explore-order-panel');
  await page.clickByText('.popup-panel-event-explore .event-explore-order-panel button', 'Day');
  await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  await waitForSmartListSettled(page, '.popup-panel-event-explore');
  await waitForVisibleCount(page, '.popup-panel-event-explore .experience-item-card', 1, 'event explore cards after reset', 45000);
}

async function clearExploreFilters(page) {
  if (await page.isSelectorVisible('.popup-panel-event-explore .event-explore-filter-friends.is-active')) {
    await page.clickVisible('.popup-panel-event-explore .event-explore-filter-friends');
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }
  if (await page.isSelectorVisible('.popup-panel-event-explore .event-explore-filter-rooms.is-active')) {
    await page.clickVisible('.popup-panel-event-explore .event-explore-filter-rooms');
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }
  if (await page.isSelectorVisible('.popup-panel-event-explore .event-explore-filter-topic.is-active')) {
    await page.clickVisible('.popup-panel-event-explore .event-explore-filter-topic');
    await page.waitForSelector('.popup-panel-topic-picker', { timeoutMs: 10000 });
    const cleared = await page.evaluate(() => {
      const chip = document.querySelector('.popup-panel-topic-picker .friends-picker-chip');
      if (!chip) {
        return false;
      }
      chip.scrollIntoView({ block: 'center', inline: 'center' });
      chip.click();
      return true;
    });
    assert(cleared, 'Active event explore topic filter should be clearable');
    await page.clickVisible('.popup-panel-topic-picker .popup-back-btn');
    await page.waitForSelectorHidden('.popup-panel-topic-picker', { timeoutMs: 10000 });
    await page.waitForNetwork('/api/activities/events/explore', { timeoutMs: 25000 });
  }
  await page.recordStep('event-explore-filters-cleared');
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
    const button = Array.from(document.querySelectorAll('.popup-panel-event-explore .ui-info-card__overlay-action--end'))
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
  const membersOpened = await page.waitForSelector('.popup-panel-members', { timeoutMs: 15000 })
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
  await page.clickVisible('.popup-panel-members .popup-close');
  await page.waitForSelectorHidden('.popup-panel-members', { timeoutMs: 15000 });
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
    const card = Array.from(document.querySelectorAll('.popup-panel-event-explore .experience-item-card'))
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
  await page.waitForSelector('.popup-panel-event-explore .ui-info-card__menu-action');
  return result.title;
}
