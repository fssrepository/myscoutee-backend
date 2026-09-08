import { assert } from '../../../../shared/assertions.mjs';
import {
  closeExplanationPopupEventually,
  openNavigatorMenu,
  waitForSmartListSettled,
  waitForVisibleCount
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  const preparedEvent = await seedJoinableEvent(page);
  await openEventExplore(page);
  await page.recordStep('event-explore-ready-for-join');

  const action = await openFirstJoinableEventAction(page, preparedEvent.title);
  assert(action.clicked, 'Event explore should expose at least one join/book/waitlist action', action);
  await page.recordStep('event-explore-join-action-opened');

  await page.waitFor('join confirmation or checkout review visible', async () => {
    return (await isEventJoinConfirmationVisible(page))
      || (await page.isSelectorVisible('app-event-editor-popup .ui-popup__panel'));
  }, 15000);
  const checkoutReviewAlreadyVisible = await page.isSelectorVisible('app-event-editor-popup .ui-popup__panel');
  if (!checkoutReviewAlreadyVisible && await isEventJoinConfirmationVisible(page)) {
    await page.recordStep('event-explore-simple-join-dialog');
    await page.waitFor('simple join confirm enabled', async () => {
      return page.evaluate(() => {
        const button = document.querySelector('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
        return Boolean(button && !button.disabled);
      });
    }, 15000);
    await page.clickVisible('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
    const progressed = await page.waitFor('simple join submitted or checkout review opened', async () => {
      return page.hasNetwork('/api/activities/events/join')
        || (await page.isSelectorVisible('app-event-editor-popup .ui-popup__panel'));
    }, 30000).then(() => true).catch(() => false);
    assert(progressed, 'Event join confirmation should submit or open checkout review', await readJoinFlowSnapshot(page));
    if (!(await page.isSelectorVisible('app-event-editor-popup .ui-popup__panel'))) {
      await page.waitForNetwork('/api/activities/events/join', { timeoutMs: 30000 });
      await page.waitForSelectorHidden('.dialog', { timeoutMs: 30000 });
      await page.recordStep('event-explore-simple-join-submitted');
      return;
    }
  }

  await page.waitForSelector('app-event-editor-popup .ui-popup__panel', { timeoutMs: 15000 });
  await page.recordStep('event-explore-checkout-open');
  await closeExplanationPopupEventually(page, 10000);
  await prepareCheckout(page);
  await page.recordStep('event-explore-checkout-prepared');
  await submitCheckout(page);
  await page.waitForSelectorHidden('app-event-editor-popup .ui-popup__panel', { timeoutMs: 45000 }).catch(() => undefined);
  await page.recordStep('event-explore-checkout-submitted');
}

async function isEventJoinConfirmationVisible(page) {
  return page.evaluate(() => {
    const dialog = document.querySelector('.dialog');
    if (!dialog) {
      return false;
    }
    const rect = dialog.getBoundingClientRect();
    const style = window.getComputedStyle(dialog);
    if (rect.width <= 0 || rect.height <= 0 || style.visibility === 'hidden' || style.display === 'none') {
      return false;
    }
    const title = dialog.querySelector('h3')?.textContent?.trim() ?? '';
    return ['Join waiting list?', 'Request to join?', 'Continue booking?'].includes(title);
  });
}

async function readJoinFlowSnapshot(page) {
  return page.evaluate(() => ({
    dialogTitle: document.querySelector('.dialog h3')?.textContent?.trim() ?? '',
    dialogText: document.querySelector('.dialog')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 600) ?? '',
    checkoutVisible: Boolean(document.querySelector('app-event-editor-popup .ui-popup__panel')),
    visiblePopups: Array.from(document.querySelectorAll('.ui-popup__panel'))
      .filter(element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .map(element => ({
        host: element.parentElement?.tagName?.toLowerCase() ?? '',
        text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 220)
      }))
  }));
}

async function seedJoinableEvent(page) {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const eventId = `e2e-ui-join-${suffix}`;
  const hostUserId = `e2e-ui-join-host-${suffix}`;
  const title = `E2E UI Join ${suffix}`;
  const startAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
  startAt.setUTCHours(18, 0, 0, 0);
  const endAt = new Date(startAt.getTime() + (2 * 60 * 60 * 1000));
  const startAtIso = startAt.toISOString();
  const endAtIso = endAt.toISOString();
  const headers = {
    'Content-Type': 'application/json',
    'X-App-Session-Kind': 'demo'
  };

  const result = await page.evaluate(async ({ eventId, hostUserId, title, startAtIso, endAtIso, headers }) => {
    const jsonFetch = async (url, body) => {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!response.ok) {
        throw new Error(`${url} returned ${response.status}: ${text.slice(0, 300)}`);
      }
      return data;
    };

    await jsonFetch('/api/auth/me/profile', {
      id: hostUserId,
      name: 'E2E UI Join Host',
      age: 31,
      birthday: '1995-01-12',
      city: 'Budapest',
      height: '180 cm',
      physique: 'active',
      languages: ['en'],
      initials: 'JH',
      gender: 'man',
      statusText: 'E2E UI join host',
      profileStatus: 'public',
      locationCoordinates: {
        latitude: 47.4979,
        longitude: 19.0402
      },
      images: []
    });

    const event = await jsonFetch('/api/activities/events/sync', {
      syncKey: eventId,
      id: eventId,
      target: 'hosting',
      title,
      shortDescription: 'Created by the UI join/checkout regression scenario.',
      timeframe: 'Tomorrow evening',
      activity: 5,
      isAdmin: false,
      startAtIso,
      endAtIso,
      distanceKm: 1.2,
      imageUrl: '',
      acceptedMembers: 1,
      pendingMembers: 0,
      capacityTotal: 8,
      capacityMin: 2,
      capacityMax: 8,
      autoInviter: false,
      frequency: 'One-time',
      ticketing: true,
      slotsEnabled: false,
      eventType: 'meetup',
      visibility: 'Public',
      blindMode: 'Open Event',
      status: 'A',
      creatorUserId: hostUserId,
      creatorName: 'E2E UI Join Host',
      creatorInitials: 'JH',
      creatorGender: 'man',
      creatorCity: 'Budapest',
      location: 'Budapest',
      locationCoordinates: {
        latitude: 47.4979,
        longitude: 19.0402
      },
      topics: ['e2e', 'ui-join'],
      pricing: {
        enabled: true,
        mode: 'fixed',
        basePrice: 1,
        currency: 'USD',
        taxMode: 'included',
        chargeType: 'per_attendee',
        minPrice: 0,
        maxPrice: 5,
        rounding: 'none',
        demandRulesEnabled: false,
        demandRules: [],
        timeRulesEnabled: false,
        timeRules: [],
        cancellationPolicy: {
          enabled: false,
          rules: []
        },
        slotPricingEnabled: false,
        slotOverrides: [],
        audience: {
          enabled: false,
          memberPrice: null,
          vipPrice: null,
          inviteOnlyDiscountPercent: null,
          promoCodes: [],
          soldOutLabel: 'Sold out'
        }
      },
      policies: [
        {
          id: `${eventId}-policy`,
          title: 'UI join policy',
          description: 'Required policy for the UI join regression scenario.',
          required: true
        }
      ],
      subEvents: [],
      subEventsDisplayMode: 'list'
    });
    return { id: event?.id ?? eventId, title: event?.title ?? title };
  }, { eventId, hostUserId, title, startAtIso, endAtIso, headers });

  assert(result?.id === eventId, 'Join scenario should seed a fresh active event', result);
  return result;
}

async function openEventExplore(page) {
  await openNavigatorMenu(page);
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
}

async function openFirstJoinableEventAction(page, preferredTitle) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const result = await page.evaluate(preferredTitle => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const cards = Array.from(document.querySelectorAll('.event-explore-popup .experience-item-card'))
        .filter(visible);
      const orderedCards = cards.filter(
        card => (card.querySelector('.ui-info-card__title')?.textContent?.trim() ?? '') === preferredTitle
      );
      for (const card of orderedCards) {
        const title = card.querySelector('.ui-info-card__title')?.textContent?.trim() ?? '';
        if (/participation/i.test(title)) {
          continue;
        }
        const trigger = card.querySelector('.ui-info-card__menu-trigger');
        if (!trigger || trigger.disabled) {
          continue;
        }
        trigger.scrollIntoView({ block: 'center', inline: 'center' });
        trigger.click();
        return {
          menuOpened: true,
          title
        };
      }
      return { menuOpened: false };
    }, preferredTitle);
    if (!result.menuOpened) {
      await scrollExploreList(page);
      continue;
    }
    await page.waitForSelector('app-event-explore-popup app-menu-outlet .app-menu__panel button');
    const clicked = await page.evaluate(() => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const actions = Array.from(document.querySelectorAll('app-event-explore-popup app-menu-outlet .app-menu__panel button'))
        .filter(visible);
      const action = actions.find(button => {
        const text = (button.textContent ?? '').toLowerCase();
        const icon = button.querySelector('mat-icon')?.textContent?.trim();
        return icon === 'person_add'
          || icon === 'hourglass_empty'
          || text.includes('join')
          || text.includes('book')
          || text.includes('wait');
      });
      if (!action) {
        document.body.click();
        return { clicked: false, labels: actions.map(item => (item.textContent ?? '').trim().replace(/\s+/g, ' ')) };
      }
      const label = (action.textContent ?? '').trim().replace(/\s+/g, ' ');
      action.click();
      return { clicked: true, label };
    });
    if (clicked.clicked) {
      return { ...result, ...clicked };
    }
    await scrollExploreList(page);
  }
  const snapshot = await page.evaluate(() => {
    const root = document.querySelector('.event-explore-popup');
    return {
      text: (root?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200),
      visibleCards: Array.from(document.querySelectorAll('.event-explore-popup .experience-item-card'))
        .filter(element => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          return rect.width > 0
            && rect.height > 0
            && style.visibility !== 'hidden'
            && style.display !== 'none';
        })
        .map(card => (card.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 240))
    };
  });
  await page.recordStep('event-explore-join-action-missing');
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Event explore did not expose a join/book/waitlist action',
    details: {
      preferredTitle,
      ...snapshot
    }
  });
  return { clicked: false };
}

async function prepareCheckout(page) {
  await page.waitForSelector('app-event-editor-popup .event-editor-checkout-footer');
}

async function submitCheckout(page) {
  await page.waitFor('checkout confirm enabled', async () => {
    return page.evaluate(() => {
      const button = document.querySelector(
        'app-event-editor-popup .event-editor-checkout-footer__actions button[aria-label="Join"]'
      );
      return Boolean(button && !button.disabled);
    });
  }, 20000);
  await page.clickVisible('app-event-editor-popup .event-editor-checkout-footer__actions button[aria-label="Join"]');
  await page.waitForSelector('.dialog');
  await page.clickVisible('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
  await page.waitFor('checkout submitted or payment step visible', async () => {
    return (await page.isSelectorVisible('app-event-editor-popup .editor-list-card--payment'))
      || page.hasNetwork('/api/activities/events/checkout/pay');
  }, 30000);
  if (await page.isSelectorVisible('app-event-editor-popup .editor-list-card--payment')) {
    await page.recordStep('event-explore-checkout-payment-step');
    const joinRequestsBeforeFinalConfirm = page.network.filter(entry => (
      entry.url.includes('/api/activities/events/join')
    )).length;
    await page.waitFor('checkout payment confirm enabled', async () => {
      return page.evaluate(() => {
        const button = document.querySelector(
          'app-event-editor-popup .event-editor-checkout-footer__actions .app-menu__button-row-item:last-of-type'
        );
        return Boolean(button && !button.disabled);
      });
    }, 20000);
    await page.clickVisible(
      'app-event-editor-popup .event-editor-checkout-footer__actions .app-menu__button-row-item:last-of-type'
    );
    await page.waitForSelector('.dialog');
    await page.clickVisible('.dialog-actions-menu .app-menu__button-row-item:last-of-type');
    await page.waitFor('cash confirmation or provider payment request', async () => {
      const joinRequests = page.network.filter(entry => (
        entry.url.includes('/api/activities/events/join')
      )).length;
      return joinRequests > joinRequestsBeforeFinalConfirm
        || page.hasNetwork('/api/activities/events/checkout/pay');
    }, 45000);
  }
}

async function scrollExploreList(page) {
  await page.evaluate(() => {
    const list = document.querySelector('.event-explore-popup .smart-list');
    list?.scrollBy({ top: 600, left: 0, behavior: 'instant' });
    list?.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await waitForSmartListSettled(page, '.event-explore-popup', 30000);
}
