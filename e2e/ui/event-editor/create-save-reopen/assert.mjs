import { assert } from '../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  recordInfoCardMenuAnchorFinding,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  const title = `UI E2E Event ${Date.now().toString(36)}`;
  const description = `Created by UI deep regression ${Date.now().toString(36)}`;
  const policyTitle = `E2E policy ${Date.now().toString(36).slice(-5)}`;
  const subEventTitle = `E2E Stage ${Date.now().toString(36).slice(-5)}`;

  await page.waitForSelector('.game-page');
  await openMyEvents(page);
  await page.recordStep('event-editor-my-events-open');

  await page.click('button[aria-label="Open event actions"]');
  await page.click('.activities-quick-action-option-create');
  await page.waitForSelector('.event-editor-popup-shell');
  await page.waitForSelector('.popup-panel-event-editor');
  await page.recordStep('event-editor-create-open');

  await page.fillVisible('.popup-panel-event-editor .experience-title-field input', title);
  await page.fillVisible('.popup-panel-event-editor .experience-description-field textarea', description);
  await setVisibleInputValues(page, '.popup-panel-event-editor .event-capacity-range-field input', ['1', '12']);
  await page.fillVisible('.popup-panel-event-editor .event-location-field input', 'E2E Test Venue');
  await page.recordStep('event-editor-fields-filled');

  await setVisibility(page, 'Friends only');
  await toggleEditorCards(page);
  await pickFirstTopic(page);
  await page.recordStep('event-editor-options-and-topic-set');

  await addPolicy(page, policyTitle);
  await page.recordStep('event-editor-policy-added');

  await page.clickVisible('.popup-panel-event-editor .event-subevents-panel-trigger');
  await page.waitForSelector('.subevents-panel');
  await page.recordStep('event-editor-subevents-open');
  await addSubEvent(page, subEventTitle);
  await waitForVisibleText(page, '.subevents-panel', subEventTitle, 15000);
  await page.recordStep('event-editor-subevent-added');
  await page.clickVisible('.subevents-panel .subevents-back-btn');
  await page.waitForSelectorHidden('.subevents-panel');

  await page.clickVisible('.popup-panel-event-editor .event-slots-open-btn');
  await page.waitForSelector('.event-policies-popup');
  await page.recordStep('event-editor-policy-setup-open');
  await page.clickVisible('.event-policies-popup .event-slots-popup-close');
  await page.waitForSelectorHidden('.event-policies-popup');

  await page.waitFor('event save button enabled', async () => {
    return page.evaluate(() => {
      const button = document.querySelector('.popup-panel-event-editor button[aria-label="Save event"]');
      return Boolean(button && !button.disabled);
    });
  }, 20000);
  await page.clickVisible('.popup-panel-event-editor button[aria-label="Save event"]');
  await page.waitForNetwork('/api/activities/events/sync', { timeoutMs: 30000 });
  await page.waitForSelectorHidden('.popup-panel-event-editor', { timeoutMs: 30000 });
  await waitForActivityTitleVisible(page, title, 30000);
  await page.recordStep('event-editor-saved-visible-in-list');

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openMyEvents(page);
  await waitForActivityTitleVisible(page, title, 30000);
  await page.recordStep('event-editor-reloaded-from-backend-list');
  await openSavedEventFromList(page, title);
  await closeExplanationPopupEventually(page, 10000);
  await waitForVisibleText(page, '.popup-panel-event-editor', title, 30000);
  await waitForVisibleFieldValue(page, '.popup-panel-event-editor .experience-description-field textarea', description, 30000);
  await assertReopenedPolicyPanel(page, policyTitle);
  await page.clickVisible('.popup-panel-event-editor .event-policies-panel .event-slots-open-btn');
  await page.waitForSelector('.event-policies-popup');
  await waitForVisibleText(page, '.event-policies-popup', policyTitle, 30000);
  await page.clickVisible('.event-policies-popup .event-slots-popup-close');
  await page.waitForSelectorHidden('.event-policies-popup');
  await page.clickVisible('.popup-panel-event-editor .event-subevents-panel-trigger');
  await page.waitForSelector('.subevents-panel');
  await waitForVisibleText(page, '.subevents-panel', subEventTitle, 30000);
  await page.recordStep('event-editor-reopened-saved-details');
  await assertNoDocumentHorizontalOverflow(page);
  await page.clickVisible('.subevents-panel .subevents-back-btn');
  await page.waitForSelectorHidden('.subevents-panel');
  await page.clickVisible('.popup-panel-event-editor .popup-close[aria-label="Close"]');
  await page.waitForSelectorHidden('.popup-panel-event-editor', { timeoutMs: 30000 });

  const visibleTitleCount = await page.evaluate(title => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    return Array.from(document.querySelectorAll('.popup-panel-activities .ui-info-card__title, .popup-panel-activities .activities-card-title'))
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
      return Array.from(document.querySelectorAll('.popup-panel-activities .ui-info-card__title, .popup-panel-activities .activities-card-title'))
        .some(element => isVisible(element) && (element.textContent ?? '').includes(title));
    }, title);
    if (visible) {
      return;
    }
    await page.evaluate(() => {
      const list = document.querySelector('.popup-panel-activities .smart-list');
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
    const list = document.querySelector('.popup-panel-activities .smart-list');
    return {
      text: (document.querySelector('.popup-panel-activities')?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200),
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
    const root = document.querySelector('.popup-panel-event-editor');
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
  await page.click('button[aria-label="Open my events"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.popup-panel-activities');
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/events', { timeoutMs: 25000 });
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
  await page.clickVisible('.popup-panel-event-editor .event-visibility-trigger');
  await page.waitForSelector('.popup-panel-event-editor .activities-view-picker-panel');
  await page.clickByText('.popup-panel-event-editor .activities-view-option', label);
  await waitForVisibleText(page, '.popup-panel-event-editor .event-visibility-trigger', label, 10000);
}

async function toggleEditorCards(page) {
  await page.clickVisible('.popup-panel-event-editor .event-blind-mode-card');
  await page.clickVisible('.popup-panel-event-editor .event-auto-inviter-card');
  await page.clickVisible('.popup-panel-event-editor .event-ticketing-card');
  await waitForVisibleText(page, '.popup-panel-event-editor', 'Ticketing', 10000).catch(() => undefined);
}

async function pickFirstTopic(page) {
  await page.clickVisible('.popup-panel-event-editor .event-topics-panel');
  await page.waitForSelector('.popup-panel-topic-picker');
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
  assert(topic, 'Event topic picker should expose at least one topic');
  await page.clickVisible('.popup-panel-topic-picker .popup-back-btn');
  await page.waitForSelectorHidden('.popup-panel-topic-picker');
  await waitForVisibleText(page, '.popup-panel-event-editor .event-topics-panel', topic, 10000);
}

async function addPolicy(page, policyTitle) {
  await page.clickVisible('.popup-panel-event-editor .event-policies-panel .event-slots-open-btn');
  await page.waitForSelector('.event-policies-popup');
  await page.clickVisible('.event-policies-popup button[aria-label="Add policy"]');
  await page.waitForSelector('.event-policy-editor-popup');
  await page.fillVisible('.event-policy-editor-popup input[placeholder="Policy title"]', policyTitle);
  await page.fillVisible('.event-policy-editor-popup textarea[placeholder="Explain the policy clearly."]', `${policyTitle} must be accepted during e2e.`);
  await page.clickVisible('.event-policy-editor-popup button[aria-label="Save policy"]');
  await page.waitForSelectorHidden('.event-policy-editor-popup');
  await waitForVisibleText(page, '.event-policies-popup', policyTitle, 15000);
  await page.clickVisible('.event-policies-popup .event-slots-popup-close');
  await page.waitForSelectorHidden('.event-policies-popup');
}

async function addSubEvent(page, subEventTitle) {
  await page.clickVisible('.subevents-panel button[aria-label="Add sub event"]');
  await page.waitForSelector('.subevent-form-popup');
  await page.fillVisible('.subevent-form-popup .subevent-name-field input', subEventTitle);
  await page.fillVisible('.subevent-form-popup .experience-description-field textarea', `${subEventTitle} description`);
  await page.fillVisible('.subevent-form-popup .subevent-location-field input', 'E2E Stage Venue');
  await page.clickVisible('.subevent-form-popup button[aria-label="Save sub event"]');
  await page.waitForSelectorHidden('.subevent-form-popup');
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
    const card = Array.from(document.querySelectorAll('.popup-panel-activities .experience-item-card'))
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
  await page.waitForSelector('.item-action-menu-btn, .ui-info-card__menu-action');
  await recordInfoCardMenuAnchorFinding(page, {
    title: 'Saved event card action menu is visually detached from its three-dot trigger'
  });
  await page.recordStep('event-editor-saved-card-menu-anchored');
  await page.clickByText('.item-action-menu-btn, .ui-info-card__menu-action', 'View');
  await page.waitForSelector('.popup-panel-event-editor');
  await page.waitForSelectorHidden('.popup-loading-overlay', { timeoutMs: 30000 });
}
