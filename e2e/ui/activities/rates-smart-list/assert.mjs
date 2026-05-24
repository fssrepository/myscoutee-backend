import { assert } from '../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  assertVisibleCount,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  scrollSmartList,
  smartListSnapshot
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('rates-navigator-menu-open');
  await page.click('button[aria-label="Open rates"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.popup-panel-activities');
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
  await selectActivitiesView(page, 'Distance');
  await selectSecondaryFilter(page, 'Recent');
  await selectRateFilterWithPositiveBadge(page);
  await assertVisibleRateCards(page, 'rate cards');
  await page.recordStep('rates-list-open');

  const initial = await smartListSnapshot(page, '.popup-panel-activities');
  assert(initial.itemCount > 0, 'Rates smart-list should expose visible cards', initial);
  await assertNoDocumentHorizontalOverflow(page);

  await selectRateFilter(page, 'Received');
  await page.recordStep('rates-filter-received-selected');
  if ((await page.visibleCount('.popup-panel-activities .activities-rate-profile-card')) === 0) {
    await selectRateFilter(page, 'Given');
    await page.recordStep('rates-filter-given-selected-after-empty');
  }
  await assertVisibleRateCards(page, 'filtered rate cards');

  await selectActivitiesView(page, 'Week');
  await page.waitForSelector('.popup-panel-activities .smart-list--calendar');
  await page.recordStep('rates-week-calendar-view');
  await assertCalendarHasStructure(page);

  await selectActivitiesView(page, 'Month');
  await page.waitForSelector('.popup-panel-activities .smart-list--calendar');
  await page.recordStep('rates-month-calendar-view');
  await assertCalendarHasStructure(page);

  await selectActivitiesView(page, 'Day');
  await page.waitForSelector('.popup-panel-activities .smart-list--calendar');
  await page.recordStep('rates-day-calendar-view');
  await assertCalendarHasStructure(page);

  await selectActivitiesView(page, 'Distance');
  await page.waitForSelector('.popup-panel-activities .smart-list--list');
  await assertVisibleRateCards(page, 'distance rate cards restored');
  await page.recordStep('rates-distance-list-restored');

  const beforeScroll = await smartListSnapshot(page, '.popup-panel-activities');
  await scrollSmartList(page, '.popup-panel-activities', 900);
  await page.waitFor('rates smart-list scroll position changes', async () => {
    const after = await smartListSnapshot(page, '.popup-panel-activities');
    return after.scrollTop > beforeScroll.scrollTop || after.itemCount >= beforeScroll.itemCount;
  }, 10000);
  await page.recordStep('rates-list-scrolled-pagination-probe');

  await openRateDock(page);
  await page.recordStep('rates-rating-dock-open');
  await commitRating(page);
  await page.recordStep('rates-rating-committed');

  await scrollSmartList(page, '.popup-panel-activities', 700);
  await page.waitFor('rating dock closes after scroll', async () => {
    return page.visibleCount('.rating-star-bar-host--dock-open').then(count => count === 0);
  }, 15000);
  await page.recordStep('rates-rating-dock-dismissed-by-scroll');

  if (await page.isSelectorVisible('.activities-rates-fullscreen-toggle.is-enter')) {
    await page.clickVisible('.activities-rates-fullscreen-toggle.is-enter');
    await page.waitForSelector('.activities-popup-rates-fullscreen .activities-rates-fullscreen-card');
    await page.recordStep('rates-fullscreen-open');
    await page.clickVisible('.activities-rates-fullscreen-toggle.is-exit');
    await page.waitForSelectorHidden('.activities-popup-rates-fullscreen');
  }
  await assertNoDocumentHorizontalOverflow(page);
}

async function selectRateFilter(page, label) {
  if (await page.isSelectorVisible('.activities-mobile-rate-filter-picker .activities-rate-filter-select')) {
    await page.clickVisible('.activities-mobile-rate-filter-picker .activities-rate-filter-select');
    await page.waitForSelector('.activities-mobile-rate-filter-panel');
    await page.clickByText('.activities-mobile-rate-filter-panel .activities-view-option', label);
    await page.waitForSelectorHidden('.activities-mobile-rate-filter-panel');
    await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
    return;
  }
  await openDesktopRateFilter(page);
  await page.waitForSelector('.activities-rate-options-panel, .cdk-overlay-pane');
  await page.clickByText('mat-option', label);
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
}

async function selectRateFilterWithPositiveBadge(page) {
  if (await page.isSelectorVisible('.activities-mobile-rate-filter-picker .activities-rate-filter-select')) {
    await page.clickVisible('.activities-mobile-rate-filter-picker .activities-rate-filter-select');
    await page.waitForSelector('.activities-mobile-rate-filter-panel');
    const selected = await clickFirstPositiveRateFilter(page, '.activities-mobile-rate-filter-panel .activities-view-option');
    assert(selected, 'Rates filter menu should expose a filter with visible data');
    await page.waitForSelectorHidden('.activities-mobile-rate-filter-panel');
    await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
    return;
  }
  await openDesktopRateFilter(page);
  await page.waitForSelector('.activities-rate-options-panel, .cdk-overlay-pane');
  const selected = await clickFirstPositiveRateFilter(page, 'mat-option:not(.rate-filter-group-option)');
  assert(selected, 'Rates filter menu should expose a filter with visible data');
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
}

async function openDesktopRateFilter(page) {
  await page.mouseClickVisible('.activities-rate-filter-select .mat-mdc-select-trigger, .activities-rate-filter-select mat-select');
}

async function clickFirstPositiveRateFilter(page, selector) {
  return page.evaluate(selector => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const option = Array.from(document.querySelectorAll(selector))
      .find(element => {
        if (!visible(element) || element.disabled || element.getAttribute('aria-disabled') === 'true') {
          return false;
        }
        const badge = element.querySelector('.rate-filter-count-badge')?.textContent ?? '';
        const count = Number((badge.match(/\d+/) ?? ['0'])[0]);
        return count > 0;
      });
    if (!option) {
      return false;
    }
    option.scrollIntoView({ block: 'center', inline: 'center' });
    option.click();
    return true;
  }, selector);
}

async function selectSecondaryFilter(page, label) {
  await page.clickVisible('button[aria-label^="Open secondary filter"]');
  await page.waitForSelector('.activities-secondary-picker .activities-view-picker-panel');
  await page.clickByText('.activities-secondary-picker .activities-view-option', label);
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
}

async function selectActivitiesView(page, label) {
  await page.click('button[aria-label^="Open view selector"]');
  await page.waitForSelector('.activities-view-picker-panel');
  await page.clickByText('.activities-view-picker-panel .activities-view-option', label);
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
}

async function assertCalendarHasStructure(page) {
  const calendar = await smartListSnapshot(page, '.popup-panel-activities');
  assert(calendar.isCalendar, 'Activities rates view should switch to calendar mode', calendar);
  const calendarCells = await page.visibleCount('.popup-panel-activities .smart-list__month-cell, .popup-panel-activities .smart-list__week-day-col');
  assert(calendarCells > 0, 'Calendar view should render month/week cells', { calendarCells });
}

async function assertVisibleRateCards(page, label) {
  const count = await page.visibleCount('.popup-panel-activities .activities-rate-profile-card');
  if (count > 0) {
    return;
  }
  const details = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const root = document.querySelector('.popup-panel-activities');
    return {
      text: (root?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1000),
      allRateCards: document.querySelectorAll('.popup-panel-activities .activities-rate-profile-card').length,
      visibleItemShells: Array.from(document.querySelectorAll('.popup-panel-activities .smart-list__item-shell'))
        .filter(visible)
        .map(element => ({
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 240),
          html: element.innerHTML.slice(0, 300)
        })),
      smartListText: (document.querySelector('.popup-panel-activities .smart-list')?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1000)
    };
  });
  const snapshot = await smartListSnapshot(page, '.popup-panel-activities');
  assert(count >= 1, `${label} should have at least 1 visible item(s)`, {
    count,
    snapshot,
    details
  });
}

async function openRateDock(page) {
  if ((await page.visibleCount('.popup-panel-activities .activities-rate-score-badge:not(.is-disabled)')) === 0) {
    await selectRateFilter(page, 'Given');
  }
  await page.clickVisible('.popup-panel-activities .activities-rate-score-badge:not(.is-disabled)');
  await page.waitForSelector('.rating-star-bar-host--dock-open');
  await assertVisibleCount(page, '.rating-star-bar__slider', 1, 'rating slider');
}

async function commitRating(page) {
  const changed = await page.evaluate(() => {
    const slider = document.querySelector('.rating-star-bar__slider');
    if (!slider || slider.disabled) {
      return false;
    }
    const next = String(Math.min(Number(slider.max || 10), Math.max(Number(slider.min || 1), Number(slider.value || 5) + 1)));
    slider.value = next;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  });
  assert(changed, 'Rating slider should be editable');
  await page.waitForSelector('.rating-star-bar__commit');
  await page.clickVisible('.rating-star-bar__commit');
  await page.waitFor('.rating bar value commits', async () => {
    return page.visibleCount('.rating-star-bar__commit').then(count => count === 0);
  }, 10000);
}
