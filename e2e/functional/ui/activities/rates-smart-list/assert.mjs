import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  assertVisibleCount,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  scrollSmartList,
  smartListSnapshot,
  waitForSmartListSettled
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openNavigatorMenu(page);
  await page.recordStep('rates-navigator-menu-open');
  await page.click('button[aria-label="Open rates"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
  await selectActivitiesView(page, 'Distance');
  await selectSecondaryFilter(page, 'Recent');
  await selectRateFilterWithPositiveBadge(page);
  await assertVisibleRateCards(page, 'rate cards');
  await page.recordStep('rates-list-open');

  const initial = await smartListSnapshot(page, '.activities-popup');
  assert(initial.itemCount > 0, 'Rates smart-list should expose visible cards', initial);
  await assertNoDocumentHorizontalOverflow(page);

  await selectRateFilter(page, 'Received');
  await page.recordStep('rates-filter-received-selected');
  if ((await page.visibleCount('.activities-popup .activities-rate-profile-card')) === 0) {
    await selectRateFilter(page, 'Given');
    await page.recordStep('rates-filter-given-selected-after-empty');
  }
  await assertVisibleRateCards(page, 'filtered rate cards');

  await selectActivitiesView(page, 'Week');
  await page.waitForSelector('.activities-popup .smart-list--week');
  await page.recordStep('rates-week-calendar-view');
  await assertCalendarHasStructure(page);

  await selectActivitiesView(page, 'Month');
  await page.waitForSelector('.activities-popup .smart-list--month');
  await page.recordStep('rates-month-calendar-view');
  await assertCalendarHasStructure(page);

  await selectActivitiesView(page, 'Day');
  await page.waitForSelector('.activities-popup .smart-list--list');
  await assertVisibleRateCards(page, 'day rate cards');
  await page.recordStep('rates-day-list-view');

  await selectActivitiesView(page, 'Distance');
  await page.waitForSelector('.activities-popup .smart-list--list');
  await assertVisibleRateCards(page, 'distance rate cards restored');
  await page.recordStep('rates-distance-list-restored');

  const beforeScroll = await smartListSnapshot(page, '.activities-popup');
  await scrollSmartList(page, '.activities-popup', 900);
  await page.waitFor('rates smart-list scroll position changes', async () => {
    const after = await smartListSnapshot(page, '.activities-popup');
    return after.scrollTop > beforeScroll.scrollTop || after.itemCount >= beforeScroll.itemCount;
  }, 10000);
  await page.recordStep('rates-list-scrolled-pagination-probe');

  await openRateDock(page);
  await page.recordStep('rates-rating-dock-open');
  await commitRating(page);
  await page.recordStep('rates-rating-committed');

  await waitForRatingDockCloseGuard(page);
  await userScrollSmartList(page, '.activities-popup', 700);
  await page.waitFor('rating dock closes after scroll', async () => {
    return page.visibleCount('.activities-popup app-menu-outlet.app-menu-outlet--dock').then(count => count === 0);
  }, 15000);
  await page.recordStep('rates-rating-dock-dismissed-by-scroll');

  if (await page.isSelectorVisible('button[aria-label="Open rates fullscreen mode"]')) {
    await page.clickVisible('button[aria-label="Open rates fullscreen mode"]');
    await page.waitForSelector('.activities-popup-rates-fullscreen .activities-rates-fullscreen-card');
    await page.recordStep('rates-fullscreen-open');
    await page.clickVisible('button[aria-label="Exit rates fullscreen mode"]');
    await page.waitForSelectorHidden('.activities-popup-rates-fullscreen');
  }
  await closeExplanationPopupEventually(page, 10000);
  await assertNoDocumentHorizontalOverflow(page);
}

async function selectRateFilter(page, label) {
  await page.clickVisible('app-activities-popup .ui-popup__toolbar app-menu:nth-of-type(2) .app-menu__trigger');
  await page.waitForSelector('app-activities-popup .ui-popup__toolbar app-menu:nth-of-type(2) .app-menu__panel');
  await page.clickByText('app-activities-popup .ui-popup__toolbar app-menu:nth-of-type(2) .app-menu__panel button', label);
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
}

async function selectRateFilterWithPositiveBadge(page) {
  await page.clickVisible('app-activities-popup .ui-popup__toolbar app-menu:nth-of-type(2) .app-menu__trigger');
  await page.waitForSelector('app-activities-popup .ui-popup__toolbar app-menu:nth-of-type(2) .app-menu__panel');
  const selected = await clickFirstPositiveRateFilter(
    page,
    'app-activities-popup .ui-popup__toolbar app-menu:nth-of-type(2) .app-menu__panel button'
  );
  assert(selected, 'Rates filter menu should expose a filter with visible data');
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
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
        const badge = element.querySelector('.app-menu__counter')?.textContent ?? '';
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
  const root = 'app-activities-popup .ui-popup__header-controls app-menu:first-of-type';
  await page.clickVisible(`${root} .app-menu__trigger`);
  await page.waitForSelector(`${root} .app-menu__panel`);
  await page.clickByText(`${root} .app-menu__panel button`, label);
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
}

async function selectActivitiesView(page, label) {
  const root = 'app-activities-popup .ui-popup__header-controls app-menu:last-of-type';
  await page.clickVisible(`${root} .app-menu__trigger`);
  await page.waitForSelector(`${root} .app-menu__panel`);
  await page.clickByText(`${root} .app-menu__panel button`, label);
  await page.waitForNetwork('/api/activities/rates/page', { timeoutMs: 30000 });
}

async function assertCalendarHasStructure(page) {
  const calendar = await smartListSnapshot(page, '.activities-popup');
  assert(calendar.isCalendar, 'Activities rates view should switch to calendar mode', calendar);
  const calendarCells = await page.visibleCount('.activities-popup .smart-list__month-cell, .activities-popup .smart-list__week-day-col');
  assert(calendarCells > 0, 'Calendar view should render month/week cells', { calendarCells });
}

async function assertVisibleRateCards(page, label) {
  const loaded = await waitForVisibleRateCards(page, label);
  const count = loaded.count;
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
    const root = document.querySelector('.activities-popup');
    return {
      text: (root?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1000),
      allRateCards: document.querySelectorAll('.activities-popup .activities-rate-profile-card').length,
      loadingBars: Array.from(document.querySelectorAll('.activities-popup .header-progress-bar'))
        .map(element => ({
          className: element.className,
          text: (element.textContent ?? '').trim()
        })),
      visibleItemShells: Array.from(document.querySelectorAll('.activities-popup .smart-list__item-shell'))
        .filter(visible)
        .map(element => ({
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 240),
          html: element.innerHTML.slice(0, 300)
        })),
      smartListText: (document.querySelector('.activities-popup .smart-list')?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1000)
    };
  });
  const snapshot = await smartListSnapshot(page, '.activities-popup');
  await page.recordStep('rates-empty-card-render');
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Rates smart-list rendered no visible rate cards after waiting for the loading/progress phase',
    details: {
      label,
      count,
      waitedMs: loaded.waitedMs,
      snapshot,
      details
    }
  });
  assert(count >= 1, `${label} should have at least 1 visible item(s)`, {
    count,
    snapshot,
    details
  });
}

async function waitForVisibleRateCards(page, label, timeoutMs = 12000) {
  const started = Date.now();
  const ready = await page.waitFor(`${label} visible after rates loading`, async () => {
    return page.evaluate(() => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      return Array.from(document.querySelectorAll('.activities-popup .activities-rate-profile-card'))
        .some(visible);
    });
  }, timeoutMs, 250).then(() => true).catch(() => false);

  if (ready) {
    await waitForSmartListSettled(page, '.activities-popup', 5000).catch(() => undefined);
  }

  return {
    count: await page.visibleCount('.activities-popup .activities-rate-profile-card'),
    waitedMs: Date.now() - started
  };
}

async function openRateDock(page) {
  if ((await page.visibleCount('.activities-popup .activities-rate-score-badge:not(.is-disabled)')) === 0) {
    await selectRateFilter(page, 'Given');
  }
  await page.clickVisible('.activities-popup .activities-rate-score-badge:not(.is-disabled)');
  await page.waitForSelector('.activities-popup app-menu-outlet.app-menu-outlet--dock');
  await assertVisibleCount(page, '.activities-popup app-menu-outlet.app-menu-outlet--dock .rate__slider', 1, 'rating slider');
}

async function commitRating(page) {
  const changed = await page.evaluate(() => {
    const slider = document.querySelector('.activities-popup app-menu-outlet.app-menu-outlet--dock .rate__slider');
    if (!slider || slider.disabled) {
      return false;
    }
    const next = String(Math.min(Number(slider.max || 10), Math.max(Number(slider.min || 1), Number(slider.value || 5) + 1)));
    slider.value = next;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  });
  assert(changed, 'Rating slider should be editable');
  await page.waitForSelector('.activities-popup app-menu-outlet.app-menu-outlet--dock .rate__commit');
  await page.clickVisible('.activities-popup app-menu-outlet.app-menu-outlet--dock .rate__commit');
  await page.waitFor('.rating bar value commits', async () => {
    return page.visibleCount('.activities-popup app-menu-outlet.app-menu-outlet--dock .rate__commit').then(count => count === 0);
  }, 10000);
}

async function waitForRatingDockCloseGuard(page) {
  await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 350)));
}

async function userScrollSmartList(page, rootSelector, amount = 700) {
  await page.evaluate(({ rootSelector, amount }) => {
    const root = document.querySelector(rootSelector) ?? document;
    const list = root.querySelector('.smart-list');
    if (!list) {
      return;
    }
    list.dispatchEvent(new WheelEvent('wheel', {
      deltaY: amount,
      bubbles: true,
      cancelable: true
    }));
    list.scrollBy({ top: amount, left: 0, behavior: 'instant' });
    list.dispatchEvent(new Event('scroll', { bubbles: true }));
  }, { rootSelector, amount });
}
