import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  recordInfoCardMenuAnchorFinding,
  selectActivitiesEventScope,
  waitForVisibleText
} from '@fssrepository/myscoutee-e2e/functional/ui/lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  const title = `UI E2E Event ${Date.now().toString(36)}`;
  const description = `Created by UI deep regression ${Date.now().toString(36)}`;
  const policyTitle = `E2E policy ${Date.now().toString(36).slice(-5)}`;
  const subEventTitle = `E2E Stage ${Date.now().toString(36).slice(-5)}`;

  await page.waitForSelector('.game-page');
  await openMyEvents(page);
  await page.recordStep('event-editor-my-events-open');

  await page.click('button[aria-label="Open event actions"]');
  await page.clickByText('app-activities-popup .ui-popup__panel .app-menu__panel button', 'Create Event');
  await page.waitForSelector('app-event-editor-popup .ui-popup__panel');
  await page.waitForSelector('app-event-editor-popup .ui-popup__panel');
  await page.recordStep('event-editor-create-open');

  await page.fillVisible('app-event-editor-popup .ui-popup__panel .experience-title-field input', title);
  await page.fillVisible('app-event-editor-popup .ui-popup__panel .experience-description-field textarea', description);
  await setVisibleInputValues(page, 'app-event-editor-popup .ui-popup__panel .event-capacity-range-field input', ['1', '12']);
  await page.fillVisible('app-event-editor-popup .ui-popup__panel .event-location-field input', 'E2E Test Venue');
  await page.recordStep('event-editor-fields-filled');

  await setVisibility(page, 'Friends only');
  await toggleEditorCards(page);
  await pickFirstTopic(page);
  await page.recordStep('event-editor-options-and-topic-set');

  await addPolicy(page, policyTitle);
  await page.recordStep('event-editor-policy-added');

  await ensureSubEventsEnabled(page);
  await page.clickVisible('app-event-editor-popup button[aria-label="Add sub event definition"]');
  await page.waitForSelector('app-event-subevent-stage-form-popup .ui-popup__panel');
  await page.recordStep('event-editor-subevents-open');
  await addSubEvent(page, subEventTitle);
  await waitForVisibleText(page, 'app-event-editor-popup .subevent-definition-panel', subEventTitle, 15000);
  await page.recordStep('event-editor-subevent-added');

  await page.clickVisible('app-event-editor-popup .event-policies-panel .event-slots-open-btn');
  await page.waitForSelector('.event-policies-popup-body');
  await page.recordStep('event-editor-policy-setup-open');
  await page.clickVisible('button[aria-label="Close policy setup"]');
  await page.waitForSelectorHidden('.event-policies-popup-body');

  await page.waitFor('event save button enabled', async () => {
    return page.evaluate(() => {
      const button = document.querySelector('app-event-editor-popup .ui-popup__panel button[aria-label="Save event"]');
      return Boolean(button && !button.disabled);
    });
  }, 20000);
  await page.clickVisible('app-event-editor-popup .ui-popup__panel button[aria-label="Save event"]');
  await page.waitForNetwork('/api/activities/events/sync', { timeoutMs: 30000 });
  await page.waitForSelectorHidden('app-event-editor-popup .ui-popup__panel', { timeoutMs: 30000 });
  await waitForActivityTitleVisible(page, title, 30000);
  await page.recordStep('event-editor-saved-visible-in-list');

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openMyEvents(page);
  await waitForActivityTitleVisible(page, title, 30000);
  await page.recordStep('event-editor-reloaded-from-backend-list');
  await openSavedEventFromList(page, title);
  await closeExplanationPopupEventually(page, 10000);
  await waitForVisibleFieldValue(page, 'app-event-editor-popup .experience-title-field input', title, 30000);
  await waitForVisibleFieldValue(page, 'app-event-editor-popup .ui-popup__panel .experience-description-field textarea', description, 30000);
  await assertReopenedPolicyPanel(page, policyTitle);
  await page.clickVisible('app-event-editor-popup .event-policies-panel .event-slots-open-btn');
  await page.waitForSelector('.event-policies-popup-body');
  await waitForVisibleText(page, '.event-policies-popup-body', policyTitle, 30000);
  await page.clickVisible('button[aria-label="Close policy setup"]');
  await page.waitForSelectorHidden('.event-policies-popup-body');
  await waitForVisibleText(page, 'app-event-editor-popup .subevent-definition-panel', subEventTitle, 30000);
  await page.recordStep('event-editor-reopened-saved-details');
  await assertNoDocumentHorizontalOverflow(page);
  await page.clickVisible('app-event-editor-popup > app-popup .ui-popup__close[aria-label="Close"]');
  await page.waitForSelectorHidden('app-event-editor-popup .ui-popup__panel', { timeoutMs: 30000 });

  const visibleTitleCount = await page.evaluate(title => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    return Array.from(document.querySelectorAll('.activities-popup .ui-info-card__title, .activities-popup .activities-card-title'))
      .filter(isVisible)
      .filter(element => (element.textContent ?? '').includes(title))
      .length;
  }, title);
  assert(visibleTitleCount > 0, 'Saved event should be visible after page reload', { title, visibleTitleCount });
}

async function waitForVisibleFieldValue(page, selector, value, timeoutMs = 15000) {
  const needle = `${value ?? ''}`;
  await page.waitFor(`${selector} visible value ${needle}`, async () => {
    return page.evaluate(({ selector, needle }) => {
      const isVisible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      return Array.from(document.querySelectorAll(selector)).some(element => {
        return isVisible(element) && `${element.value ?? ''}`.includes(needle);
      });
    }, { selector, needle });
  }, timeoutMs);
}

async function waitForActivityTitleVisible(page, title, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let scrollCount = 0;
  while (Date.now() < deadline) {
    const visible = await page.evaluate(title => {
      const isVisible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      return Array.from(document.querySelectorAll('.activities-popup .ui-info-card__title, .activities-popup .activities-card-title'))
        .some(element => isVisible(element) && (element.textContent ?? '').includes(title));
    }, title);
    if (visible) {
      return;
    }
    await page.evaluate(() => {
      const list = document.querySelector('.activities-popup .smart-list');
      if (list) {
        list.scrollBy({ top: Math.max(360, list.clientHeight * 0.85), left: 0, behavior: 'instant' });
        list.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
    });
    scrollCount += 1;
    if (scrollCount % 3 === 0) {
      await page.recordStep(`event-editor-search-saved-card-${scrollCount}`);
    }
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 300)));
  }
  const listState = await page.evaluate(() => {
    const list = document.querySelector('.activities-popup .smart-list');
    return {
      text: (document.querySelector('.activities-popup')?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200),
      scrollTop: list?.scrollTop ?? 0,
      scrollHeight: list?.scrollHeight ?? 0,
      clientHeight: list?.clientHeight ?? 0
    };
  });
  await page.recordStep('event-editor-saved-card-missing');
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Saved event card did not appear in the activities list after save/reload',
    details: {
      expectedTitle: title,
      ...listState
    }
  });
  assert(false, `Saved event ${title} should be visible in the activities list`, {
    title,
    ...listState
  });
}

async function assertReopenedPolicyPanel(page, policyTitle) {
  const panel = await page.evaluate(() => {
    const root = document.querySelector('app-event-editor-popup .ui-popup__panel');
    const button = root?.querySelector('.event-policies-panel .event-slots-open-btn');
    return {
      hasPanelButton: Boolean(button),
      editorText: (root?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200)
    };
  });
  if (!panel.hasPanelButton) {
    await page.recordStep('event-editor-policy-panel-missing');
    page.recordFinding?.({
      severity: 'fatal',
      title: 'Saved event reopened without its policy panel/persisted policies',
      details: {
        expectedPolicy: policyTitle,
        ...panel
      }
    });
  }
  assert(panel.hasPanelButton, 'Saved event should reopen with the policy panel and persisted policy', {
    expectedPolicy: policyTitle,
    ...panel
  });
}

async function openMyEvents(page) {
  await openNavigatorMenu(page);
  await page.click('button[aria-label="Open events"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/events', { timeoutMs: 25000 });
  await selectActivitiesEventScope(page, 'My Events');
}

async function setVisibleInputValues(page, selector, values) {
  const updated = await page.evaluate(({ selector, values }) => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const inputs = Array.from(document.querySelectorAll(selector))
      .filter(input => isVisible(input) && 'value' in input);
    values.forEach((value, index) => {
      const input = inputs[index];
      if (!input) {
        return;
      }
      input.value = `${value}`;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.blur();
    });
    return inputs.length;
  }, { selector, values });
  assert(updated >= values.length, `Should update ${values.length} visible input(s) for ${selector}`, { updated });
}

async function setVisibility(page, label) {
  await page.clickVisible('app-event-editor-popup button[aria-label="Open visibility selector"]');
  await page.waitForSelector('app-event-editor-popup .ui-popup__header-controls .app-menu__panel');
  await page.clickByText('app-event-editor-popup .ui-popup__header-controls .app-menu__panel button', label);
  await waitForVisibleText(page, 'app-event-editor-popup button[aria-label="Open visibility selector"]', label, 10000);
}

async function toggleEditorCards(page) {
  const toggled = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll(
      'app-event-editor-popup .event-intel-menu .app-menu__button-row-item'
    )).filter(button => !button.disabled);
    for (const index of [0, 2, 3]) {
      buttons[index]?.click();
    }
    return buttons.length;
  });
  assert(toggled >= 4, 'Event intel menu should expose blind mode, auto inviter, and ticketing toggles', { toggled });
  await waitForVisibleText(page, 'app-event-editor-popup .ui-popup__panel', 'Ticketing', 10000).catch(() => undefined);
}

async function pickFirstTopic(page) {
  const opened = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll(
      'app-event-editor-popup .event-intel-menu .app-menu__button-row-item'
    ));
    const topics = buttons[1];
    if (!topics || topics.disabled) {
      return false;
    }
    topics.click();
    return true;
  });
  assert(opened, 'Event intel menu should expose the topics selector');
  await page.waitForSelector('app-event-editor-popup .event-intel-menu .app-menu__panel');
  const topic = await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll('app-event-editor-popup .event-intel-menu .app-menu__tabs-item'))
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
  assert(topic, 'Event topic picker should expose at least one topic');
  const topicsActive = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(
      'app-event-editor-popup .event-intel-menu .app-menu__button-row-item'
    ))[1]?.classList.contains('app-menu__button-row-item--active') === true;
  });
  assert(topicsActive, 'Selecting a topic should mark the event topics action active', { topic });
}

async function addPolicy(page, policyTitle) {
  const policiesOn = await page.evaluate(() => {
    return document.querySelector('app-event-editor-popup .event-policies-panel')?.classList.contains('is-on') === true;
  });
  if (!policiesOn) {
    await page.clickVisible('app-event-editor-popup .event-policies-toggle');
  }
  await page.clickVisible('app-event-editor-popup .ui-popup__panel .event-policies-panel .event-slots-open-btn');
  await page.waitForSelector('.event-policies-popup-body');
  await page.clickVisible('button[aria-label="Add policy"]');
  await page.waitForSelector('app-policies-input-popup .ui-popup__panel');
  await page.fillVisible('app-policies-input-popup [data-control-id="title"] input', policyTitle);
  await page.fillVisible('app-policies-input-popup [data-control-id="description"] textarea', `${policyTitle} must be accepted during e2e.`);
  await page.clickVisible('app-policies-input-popup button[aria-label="Save policy"]');
  await page.waitForSelectorHidden('app-policies-input-popup .ui-popup__panel');
  await waitForVisibleText(page, '.event-policies-popup-body', policyTitle, 15000);
  await page.clickVisible('button[aria-label="Close policy setup"]');
  await page.waitForSelectorHidden('.event-policies-popup-body');
}

async function addSubEvent(page, subEventTitle) {
  await page.fillVisible('app-event-subevent-stage-form-popup .subevent-name-field input', subEventTitle);
  await page.fillVisible('app-event-subevent-stage-form-popup .experience-description-field textarea', `${subEventTitle} description`);
  await page.fillVisible('app-event-subevent-stage-form-popup .subevent-location-field input', 'E2E Stage Venue');
  await page.clickVisible('app-event-subevent-stage-form-popup button[aria-label="Save sub event"]');
  await page.waitForSelectorHidden('app-event-subevent-stage-form-popup .ui-popup__panel');
}

async function ensureSubEventsEnabled(page) {
  const toggle = 'app-event-editor-popup .subevent-definition-panel__toggle';
  const enabled = await page.evaluate(selector => {
    return document.querySelector(selector)?.classList.contains('is-on') === true;
  }, toggle);
  if (!enabled) {
    await page.clickVisible(toggle);
  }
  await page.waitForSelector('app-event-editor-popup button[aria-label="Add sub event definition"]');
}

async function openSavedEventFromList(page, title) {
  const opened = await page.evaluate(title => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const card = Array.from(document.querySelectorAll('.activities-popup .experience-item-card'))
      .find(element => visible(element) && (element.textContent ?? '').includes(title));
    const menu = card?.querySelector('.ui-info-card__menu-trigger');
    if (!menu || menu.disabled) {
      return false;
    }
    menu.scrollIntoView({ block: 'center', inline: 'center' });
    menu.click();
    return true;
  }, title);
  assert(opened, 'Saved event card should expose an action menu', { title });
  await page.waitForSelector('app-activities-popup app-menu-outlet .app-menu__panel button');
  await recordInfoCardMenuAnchorFinding(page, {
    title: 'Saved event card action menu is visually detached from its three-dot trigger'
  });
  await page.recordStep('event-editor-saved-card-menu-anchored');
  await page.clickByText('app-activities-popup app-menu-outlet .app-menu__panel button', 'Manage Event');
  await page.waitFor('saved event details or sub-events overview open', async () => {
    return (await page.isSelectorVisible('app-event-editor-popup .ui-popup__panel'))
      || (await page.isSelectorVisible('app-event-subevents-list-popup .event-subevents-list-smart-list'));
  }, 20000);
  if (await page.isSelectorVisible('app-event-subevents-list-popup .event-subevents-list-smart-list')) {
    const openedEditor = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll(
        'app-event-subevents-list-popup .ui-popup__toolbar .app-menu__button-row-item'
      ));
      const button = buttons.find(item => /\b(edit|view)\b/i.test(
        `${item.getAttribute('aria-label') ?? ''} ${item.textContent ?? ''}`
      ));
      button?.click();
      return {
        clicked: Boolean(button),
        count: buttons.length,
        labels: buttons.map(item => ({ aria: item.getAttribute('aria-label'), text: item.textContent?.trim() ?? '' }))
      };
    });
    assert(openedEditor.clicked, 'Sub-events overview should expose its event editor action', openedEditor);
  }
  await page.waitForSelector('app-event-editor-popup .ui-popup__panel');
  await page.waitForSelectorHidden('.popup-loading-overlay', { timeoutMs: 30000 });
}
