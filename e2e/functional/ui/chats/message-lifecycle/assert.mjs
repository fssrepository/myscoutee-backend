import { assert } from '../../../../shared/assertions.mjs';
import { assertVisibleCount, closeExplanationPopupEventually, openNavigatorMenu, waitForVisibleText } from '../../lib/ui-contracts.mjs';

const PREFERRED_CHAT_TITLE = 'Group A · Group Channel';
const CHAT_ROW_SELECTOR = '.activities-popup app-activities-chat-template .ui-single-row';
const CHAT_POPUP_SELECTOR = '.event-chat-popup-shell .ui-popup__panel';

export async function assertUi({ page }) {
  const marker = `UI E2E chat ${Date.now().toString(36)}`;
  const lifecycleMarker = `${marker} lifecycle`;
  const editedMarker = `${lifecycleMarker} edited`;

  await page.waitForSelector('.game-page');
  await openChatList(page);
  await page.recordStep('chat-list-open');

  await openPreferredChat(page);
  await page.waitForSelector(CHAT_POPUP_SELECTOR);
  await page.waitForSelector('textarea[placeholder="Write message"]');
  await page.recordStep('chat-thread-open');

  await sendChatMessage(page, lifecycleMarker);
  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, lifecycleMarker, 20000);
  await page.recordStep('chat-message-sent-visible');
  await waitForMessageNotPending(page, lifecycleMarker, 30000);
  await page.recordStep('chat-message-ack-cleared-pending');

  await selectMessageContaining(page, lifecycleMarker);
  await page.clickVisible('.chat-message-tools button[aria-label="React"]');
  await page.waitForSelector('.chat-quick-reactions');
  await page.clickVisible('.chat-quick-reactions button');
  await waitForMessageChild(page, lifecycleMarker, '.chat-reaction-summary', 30000);
  await page.recordStep('chat-message-reacted');

  await selectMessageContaining(page, lifecycleMarker);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('app-menu-outlet .app-menu__panel');
  await page.clickByText('app-menu-outlet .app-menu__panel button', 'Pin');
  await waitForMessageChild(page, lifecycleMarker, '.chat-pin-badge', 30000);
  await page.recordStep('chat-message-pinned');

  await selectMessageContaining(page, lifecycleMarker);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('app-menu-outlet .app-menu__panel');
  await page.clickByText('app-menu-outlet .app-menu__panel button', 'Edit');
  await sendChatMessage(page, editedMarker);
  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, editedMarker, 30000);
  await waitForMessageChild(page, editedMarker, '.chat-edited-label', 30000);
  await waitForMessageNotPending(page, editedMarker, 30000);
  await page.recordStep('chat-message-edited');

  await selectMessageContaining(page, editedMarker);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('app-menu-outlet .app-menu__panel');
  await page.clickByText('app-menu-outlet .app-menu__panel button', 'Unsend');
  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, 'You deleted this message', 30000);
  await waitForDeletedMessage(page, 30000);
  await page.recordStep('chat-message-unsent');
}

async function assertTwoSessionFanout(newRecordedPage, senderPage, chatTitle, marker, receiverMarker) {
  const receiver = await newRecordedPage('receiver-session');
  try {
    const activeUserId = await senderPage.evaluate(() => {
      const session = JSON.parse(window.localStorage.getItem('myscoutee.http.session.v1') || '{}');
      return session.userId || window.localStorage.getItem('myscoutee.http.demo.active-user.v1') || '';
    });
    assert(activeUserId, 'Two-session chat fanout requires the sender demo user id');
    await receiver.primeOrigin({
      localStorage: {
        'myscoutee.http.session.v1': JSON.stringify({ kind: 'demo', userId: activeUserId }),
        'myscoutee.http.demo.active-user.v1': activeUserId
      }
    });
    await receiver.navigate('/game', { loadTimeoutMs: 25000 });
    await receiver.waitForSelector('.game-page');
    await openChatList(receiver);
    await receiver.recordStep('receiver-chat-list-open');
    await openChatByTitle(receiver, chatTitle);
    await receiver.waitForSelector(CHAT_POPUP_SELECTOR);
    await receiver.waitForSelector('textarea[placeholder="Write message"]');
    await receiver.recordStep('receiver-chat-thread-open');

    await senderPage.fillVisible('.event-chat-popup-shell textarea[placeholder="Write message"]', `${marker} fanout`);
    await senderPage.clickVisible('.event-chat-popup-shell button[aria-label="Send message"]');
    await waitForVisibleText(senderPage, CHAT_POPUP_SELECTOR, `${marker} fanout`, 30000);
    await waitForVisibleText(receiver, CHAT_POPUP_SELECTOR, `${marker} fanout`, 30000);
    await receiver.recordStep('receiver-sees-sender-message');

    await receiver.fillVisible('.event-chat-popup-shell textarea[placeholder="Write message"]', receiverMarker);
    await receiver.clickVisible('.event-chat-popup-shell button[aria-label="Send message"]');
    await waitForVisibleText(receiver, CHAT_POPUP_SELECTOR, receiverMarker, 30000);
    await waitForVisibleText(senderPage, CHAT_POPUP_SELECTOR, receiverMarker, 30000);
    await senderPage.recordStep('chat-sender-sees-receiver-message');
  } finally {
    await receiver.close().catch(() => undefined);
  }
}

async function sendChatMessage(page, text) {
  await page.fillVisible('.event-chat-popup-shell textarea[placeholder="Write message"]', text);
  await page.waitFor('chat send button enabled', async () => {
    return page.evaluate(() => {
      const button = document.querySelector('.event-chat-popup-shell button[aria-label="Send message"]');
      return Boolean(button && !button.disabled);
    });
  }, 10000);
  await page.clickVisible('.event-chat-popup-shell button[aria-label="Send message"]');
}

async function openChatList(page) {
  await openNavigatorMenu(page);
  await page.recordStep('chat-navigator-menu-open');
  await page.click('button[aria-label="Open chat"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/chats', { timeoutMs: 25000 });
  await page.waitFor('visible chat rows', async () => {
    return page.visibleCount(CHAT_ROW_SELECTOR)
      .then(count => count > 0);
  }, 20000);
  await assertVisibleCount(page, CHAT_ROW_SELECTOR, 1, 'chat rows');
}

async function openPreferredChat(page) {
  if (await openChatByTitle(page, PREFERRED_CHAT_TITLE, { optional: true })) {
    return PREFERRED_CHAT_TITLE;
  }
  return openFirstChat(page);
}

async function openFirstChat(page) {
  const title = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const row = Array.from(document.querySelectorAll('.activities-popup app-activities-chat-template .ui-single-row'))
      .find(visible);
    if (!row) {
      return '';
    }
    const title = row.querySelector('.ui-single-row__subtitle')?.textContent?.trim()
      || row.querySelector('.ui-single-row__title')?.textContent?.trim()
      || '';
    row.scrollIntoView({ block: 'center', inline: 'center' });
    row.click();
    return title;
  });
  assert(title, 'Should open the first visible chat row');
  return title;
}

async function openChatByTitle(page, title, options = {}) {
  const clicked = await page.evaluate(title => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const row = Array.from(document.querySelectorAll('.activities-popup app-activities-chat-template .ui-single-row'))
      .find(element => visible(element) && (element.textContent ?? '').includes(title));
    if (!row) {
      return false;
    }
    row.scrollIntoView({ block: 'center', inline: 'center' });
    row.click();
    return true;
  }, title);
  if (!clicked && options.optional) {
    return false;
  }
  assert(clicked, `Should open chat row ${title}`);
  return true;
}

async function selectMessageContaining(page, text) {
  let details = null;
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    const target = await chatMessageClickTarget(page, text);
    assert(target, `Should select chat message containing ${text}`);
    if (target.toolsVisible) {
      return;
    }
    await clickPoint(page, target.point);
    const toolsVisible = await page.waitForSelector('.chat-message-tools', { timeoutMs: 1600 })
      .then(() => true)
      .catch(() => false);
    if (toolsVisible) {
      return;
    }
    details = target.details;
  }
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Chat message action toolbar did not open after selecting a message',
    details
  });
  assert(false, 'Chat message tools should open after selecting a message', { text });
}

async function chatMessageClickTarget(page, text) {
  return page.evaluate(text => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const root = document.querySelector('.event-chat-popup-shell');
    const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
      .find(element => isVisible(element) && (element.textContent ?? '').includes(text));
    if (!message) {
      return null;
    }
    message.scrollIntoView({ block: 'center', inline: 'center' });
    const clickTarget = message.querySelector('.chat-bubble')
      ?? message.querySelector('.chat-message-content')
      ?? message;
    const rect = clickTarget.getBoundingClientRect();
    return {
      toolsVisible: Boolean(message.querySelector('.chat-message-tools')),
      point: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      },
      details: {
        selectedText: text,
        messageId: message.getAttribute('data-chat-message-id') ?? '',
        messageClasses: message.getAttribute('class') ?? '',
        targetClasses: clickTarget.getAttribute('class') ?? '',
        targetRect: {
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        chatText: (root?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200)
      }
    };
  }, text);
}

async function clickPoint(page, point) {
  await page.connection.send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: point.x,
    y: point.y,
    button: 'none'
  });
  await page.connection.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: point.x,
    y: point.y,
    button: 'left',
    buttons: 1,
    clickCount: 1
  });
  await page.connection.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: point.x,
    y: point.y,
    button: 'left',
    buttons: 0,
    clickCount: 1
  });
}

async function waitForMessageNotPending(page, text, timeoutMs) {
  await page.waitFor(`chat message ${text} not pending`, async () => {
    return page.evaluate(text => {
      const isVisible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
        .find(element => isVisible(element) && (element.textContent ?? '').includes(text));
      return Boolean(message && !message.classList.contains('chat-message-pending') && !message.classList.contains('chat-message-timed-out'));
    }, text);
  }, timeoutMs);
}

async function waitForMessageChild(page, text, childSelector, timeoutMs) {
  await page.waitFor(`chat message ${text} child ${childSelector}`, async () => {
    return page.evaluate(({ text, childSelector }) => {
      const isVisible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };
      const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
        .find(element => isVisible(element) && (element.textContent ?? '').includes(text));
      return Boolean(message?.querySelector(childSelector));
    }, { text, childSelector });
  }, timeoutMs);
}

async function waitForDeletedMessage(page, timeoutMs) {
  await page.waitFor('deleted chat message not pending', async () => {
    return page.evaluate(() => {
      return Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message-deleted'))
        .some(message => !message.classList.contains('chat-message-pending') && !message.classList.contains('chat-message-timed-out'));
    });
  }, timeoutMs);
}
