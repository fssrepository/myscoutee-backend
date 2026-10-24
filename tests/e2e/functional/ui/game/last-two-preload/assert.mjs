import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { settleFirstRunOverlays } from '@fssrepository/myscoutee-e2e/functional/ui/lib/ui-contracts.mjs';

const GAME_CARDS_QUERY = '/api/game-cards/query';
const SMART_LIST = '.home-smart-list';
const ACTIVE_CARD = `${SMART_LIST} .smart-list__fullscreen-card--active`;
const RATE_COMMIT = `${SMART_LIST} app-menu-outlet .rate__commit`;
const FIRST_PAGE_SIZE = 10;
const RATINGS_TO_TWO_REMAINING = 7;

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await settleFirstRunOverlays(page);
  await selectInsideNetworkMode(page);
  await page.waitForNetwork(GAME_CARDS_QUERY, { timeoutMs: 30000 });
  await page.waitForSelector(ACTIVE_CARD);
  await page.waitForSelector(RATE_COMMIT);

  const firstPage = await gameStackSnapshot(page);
  assert(firstPage.activeCardFingerprint, 'The first game card should be visible', firstPage);
  await page.recordStep('game-inside-network-first-page');

  page.clearNetworkLog();

  for (let index = 0; index < RATINGS_TO_TWO_REMAINING - 1; index += 1) {
    await rateAndAdvance(page, index);
  }
  await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 500)));
  assert(successfulGameCardQueries(page).length === 0, 'The next page should not load while more than two cards remain', {
    completedRatings: RATINGS_TO_TWO_REMAINING - 1,
    network: page.network
  });

  await rateAndAdvance(page, RATINGS_TO_TWO_REMAINING - 1);

  await page.waitFor('next game-card page request at the two-remaining threshold', async () => {
    return successfulGameCardQueries(page).length >= 1;
  }, 30000);

  const preloaded = await gameStackSnapshot(page);
  const documentLoads = page.network.filter(entry => entry.type === 'Document');
  assert(documentLoads.length === 0, 'The next game-card page should load without reloading the document', {
    documentLoads,
    network: page.network
  });
  assert(!preloaded.emptyStateVisible, 'The game should not show an empty state while the next page is available', preloaded);
  await page.recordStep('game-next-page-preloaded-with-two-remaining');

  for (let index = RATINGS_TO_TWO_REMAINING; index < FIRST_PAGE_SIZE; index += 1) {
    await rateAndAdvance(page, index);
  }

  const crossedPageBoundary = await gameStackSnapshot(page);
  assert(crossedPageBoundary.activeCardFingerprint, 'The first card from the preloaded page should be visible', crossedPageBoundary);
  assert(!crossedPageBoundary.emptyStateVisible, 'Crossing the first-page boundary should not show the empty state', crossedPageBoundary);
  assert(
    crossedPageBoundary.activeCardFingerprint !== firstPage.activeCardFingerprint,
    'Crossing the first-page boundary should advance to a card from the preloaded page',
    { firstPage, crossedPageBoundary }
  );
  await page.recordStep('game-crossed-into-preloaded-page');
}

async function selectInsideNetworkMode(page) {
  await page.clickVisible('button[aria-label="Select game mode"]');
  await page.waitForSelector('.game-header-menu .app-menu__panel');
  await page.clickByText('.game-header-menu .app-menu__panel button', 'Inside Network');
  await page.waitFor('Inside Network mode selected', async () => {
    return page.evaluate(() => {
      const trigger = document.querySelector('button[aria-label="Select game mode"]');
      return (trigger?.textContent ?? '').includes('Inside Network');
    });
  }, 15000);
}

async function rateAndAdvance(page, index) {
  await page.waitFor(`game card ${index + 1} ready to rate`, async () => {
    const state = await gameStackSnapshot(page);
    return Boolean(state.activeCardFingerprint) && !state.transitioning && state.commitVisible;
  }, 15000);
  const before = await gameStackSnapshot(page);
  const changed = await page.evaluate(({ sliderSelector, score }) => {
    const slider = Array.from(document.querySelectorAll(sliderSelector))
      .find(element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return element instanceof HTMLInputElement
          && !element.disabled
          && rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      });
    if (!(slider instanceof HTMLInputElement)) {
      return false;
    }
    slider.value = String(score);
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }, {
    sliderSelector: `${SMART_LIST} app-menu-outlet .rate__slider`,
    score: index % 2 === 0 ? 7 : 8
  });
  assert(changed, `Game card ${index + 1} should expose an editable rating slider`, before);
  await page.clickVisible(RATE_COMMIT);
  await page.waitFor(`game card ${index + 1} advances`, async () => {
    const after = await gameStackSnapshot(page);
    return Boolean(after.activeCardFingerprint)
      && after.activeCardFingerprint !== before.activeCardFingerprint;
  }, 15000);
}

async function gameStackSnapshot(page) {
  return page.evaluate(({ smartListSelector, activeCardSelector, commitSelector }) => {
    const visible = element => {
      if (!element) {
        return false;
      }
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const smartList = document.querySelector(smartListSelector);
    const activeCard = document.querySelector(activeCardSelector);
    const fingerprint = activeCard
      ? (activeCard.textContent ?? '').trim().replace(/\s+/g, ' ')
      : '';
    return {
      activeCardFingerprint: fingerprint,
      emptyStateVisible: visible(smartList?.querySelector('.smart-list__fullscreen-empty')),
      commitVisible: visible(smartList?.querySelector(commitSelector.replace(`${smartListSelector} `, ''))),
      transitioning: Boolean(smartList?.querySelector(
        '.smart-list__fullscreen-card--curling, .smart-list__fullscreen-card--curling-backward'
      ))
    };
  }, {
    smartListSelector: SMART_LIST,
    activeCardSelector: ACTIVE_CARD,
    commitSelector: RATE_COMMIT
  });
}

function successfulGameCardQueries(page) {
  return page.network.filter(entry => {
    return entry.url.includes(GAME_CARDS_QUERY)
      && entry.status >= 200
      && entry.status < 400;
  });
}
