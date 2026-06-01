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

  if (await page.isSelectorVisible('.confirmation-dialog')) {
    await page.recordStep('event-explore-simple-join-dialog');
    await page.waitFor('simple join confirm enabled', async () => {
      return page.evaluate(() => {
        const button = document.querySelector('.confirmation-dialog-confirm-btn');
        return Boolean(button && !button.disabled);
      });
    }, 15000);
    await page.mouseClickVisible('.confirmation-dialog-confirm-btn');
    await page.waitForNetwork('/api/activities/events/join', { timeoutMs: 30000 });
    await page.waitForSelectorHidden('.confirmation-dialog', { timeoutMs: 30000 });
    await page.recordStep('event-explore-simple-join-submitted');
    return;
  }

  await page.waitForSelector('.event-checkout-dialog', { timeoutMs: 15000 });
  await page.recordStep('event-explore-checkout-open');
  await prepareCheckout(page);
  await page.recordStep('event-explore-checkout-prepared');
  await submitCheckout(page);
  await page.waitForNetwork('/api/activities/events/join', { timeoutMs: 45000 });
  await page.waitForSelectorHidden('.event-checkout-dialog', { timeoutMs: 45000 }).catch(() => undefined);
  await page.recordStep('event-explore-checkout-submitted');
}

async function seedJoinableEvent(page) {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const eventId = `e2e-ui-join-${suffix}`;
  const hostUserId = `e2e-ui-join-host-${suffix}`;
  const title = `E2E UI Join ${suffix}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-App-Session-Kind': 'demo'
  };

  const result = await page.evaluate(async ({ eventId, hostUserId, title, headers }) => {
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
      city: 'Bratislava',
      height: '180 cm',
      physique: 'active',
      languages: ['en'],
      initials: 'JH',
      gender: 'man',
      statusText: 'E2E UI join host',
      profileStatus: 'public',
      locationCoordinates: {
        latitude: 48.1486,
        longitude: 17.1077
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
      startAt: '2026-06-20T18:00:00Z',
      endAt: '2026-06-20T20:00:00Z',
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
      published: true,
      creatorUserId: hostUserId,
      creatorName: 'E2E UI Join Host',
      creatorInitials: 'JH',
      creatorGender: 'man',
      creatorCity: 'Bratislava',
      location: 'Bratislava',
      locationCoordinates: {
        latitude: 48.1486,
        longitude: 17.1077
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
  }, { eventId, hostUserId, title, headers });

  assert(result?.id === eventId, 'Join scenario should seed a fresh published event', result);
  return result;
}

async function openEventExplore(page) {
  await openNavigatorMenu(page);
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
      const cards = Array.from(document.querySelectorAll('.popup-panel-event-explore .experience-item-card'))
        .filter(visible);
      const orderedCards = [
        ...cards.filter(card => (card.querySelector('.ui-info-card__title')?.textContent?.trim() ?? '') === preferredTitle),
        ...cards.filter(card => (card.querySelector('.ui-info-card__title')?.textContent?.trim() ?? '') !== preferredTitle)
      ];
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
    await page.waitForSelector('.popup-panel-event-explore .ui-info-card__menu-action');
    const clicked = await page.evaluate(() => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const actions = Array.from(document.querySelectorAll('.popup-panel-event-explore .ui-info-card__menu-action'))
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
    const root = document.querySelector('.popup-panel-event-explore');
    return {
      text: (root?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200),
      visibleCards: Array.from(document.querySelectorAll('.popup-panel-event-explore .experience-item-card'))
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
  if ((await page.visibleCount('.event-checkout-slot-card')) > 0) {
    await page.evaluate(() => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const selected = Array.from(document.querySelectorAll('.event-checkout-slot-card.is-selected')).find(visible);
      if (!selected) {
        Array.from(document.querySelectorAll('.event-checkout-slot-card')).find(visible)?.click();
      }
    });
  }
  await page.evaluate(() => {
    for (const input of document.querySelectorAll('.event-checkout-policy-card input[type="checkbox"]')) {
      if (!input.checked) {
        input.click();
      }
    }
  });
}

async function submitCheckout(page) {
  await page.waitFor('checkout confirm enabled', async () => {
    return page.evaluate(() => {
      const button = document.querySelector('.event-checkout-btn--confirm');
      return Boolean(button && !button.disabled);
    });
  }, 20000);
  await page.clickVisible('.event-checkout-btn--confirm');
  await page.waitFor('checkout submitted or payment step visible', async () => {
    return (await page.isSelectorVisible('.event-checkout-card--payment'))
      || page.hasNetwork('/api/activities/events/join');
  }, 30000);
  if (await page.isSelectorVisible('.event-checkout-card--payment')) {
    await page.recordStep('event-explore-checkout-payment-step');
    await page.waitFor('checkout payment confirm enabled', async () => {
      return page.evaluate(() => {
        const button = document.querySelector('.event-checkout-btn--confirm');
        return Boolean(button && !button.disabled);
      });
    }, 20000);
    await page.clickVisible('.event-checkout-btn--confirm');
  }
}

async function scrollExploreList(page) {
  await page.evaluate(() => {
    const list = document.querySelector('.popup-panel-event-explore .smart-list');
    list?.scrollBy({ top: 600, left: 0, behavior: 'instant' });
    list?.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await waitForSmartListSettled(page, '.popup-panel-event-explore', 30000);
}
