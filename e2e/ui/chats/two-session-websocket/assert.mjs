import { assert } from '../../../shared/assertions.mjs';
import {
  assertBrowserExpectations,
  assertVisibleCount,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

const SENDER_USER_ID = 'bf057de7c586eede7e84bdc7';
const RECEIVER_USER_ID = '7822c5f99eff99d63abe8933';
const PREFERRED_SHARED_CHAT_ID = '60c8f35688886a1030926aed';

export async function assertUi({ page, ctx, newIsolatedRecordedPage }) {
  assert(typeof newIsolatedRecordedPage === 'function', 'Two-user chat UI test requires isolated browser page support');

  const marker = `UI E2E two-user chat ${Date.now().toString(36)}`;
  const senderText = `${marker} sender to receiver`;
  const receiverText = `${marker} receiver to sender`;

  await page.waitForSelector('.game-page');
  await assertActiveUser(page, SENDER_USER_ID);
  await page.recordStep('sender-game-open');

  const receiver = await newIsolatedRecordedPage('receiver-user-session', {
    viewport: ctx.viewport
  });
  await primeDemoUser(receiver, RECEIVER_USER_ID);
  await receiver.navigate('/game', { loadTimeoutMs: 30000 });
  await receiver.waitForSelector('.game-page');
  await assertActiveUser(receiver, RECEIVER_USER_ID);
  await receiver.recordStep('receiver-game-open');

  await openChatList(page);
  await page.recordStep('sender-chat-list-open');
  await openChatList(receiver);
  await receiver.recordStep('receiver-chat-list-open');

  const sharedChat = await discoverSharedChat(page, SENDER_USER_ID, RECEIVER_USER_ID);
  assert(sharedChat?.id, 'Two-user chat test should find a shared chat for the two demo users', {
    senderUserId: SENDER_USER_ID,
    receiverUserId: RECEIVER_USER_ID,
    sharedChat
  });

  const senderOpen = await openChatById(page, sharedChat.id);
  await page.waitForSelector('.popup-panel-event-chat');
  await page.waitForSelector('textarea[placeholder="Write message"]');
  await assertOpenChatId(page, sharedChat.id);
  await page.recordStep(`sender-chat-thread-open-${senderOpen.method}`);

  const receiverOpen = await openChatById(receiver, sharedChat.id);
  await receiver.waitForSelector('.popup-panel-event-chat');
  await receiver.waitForSelector('textarea[placeholder="Write message"]');
  await assertOpenChatId(receiver, sharedChat.id);
  await receiver.recordStep(`receiver-chat-thread-open-${receiverOpen.method}`);

  await settleChatThread(page);
  await settleChatThread(receiver);

  await sendChatMessage(page, senderText);
  await waitForVisibleText(page, '.popup-panel-event-chat', senderText, 30000);
  await waitForMessageNotPending(page, senderText, 45000);
  await assertSingleMessage(page, senderText, { mine: true, label: 'sender sees own sent message once' });
  await page.recordStep('sender-message-sent-and-acked');

  await waitForVisibleText(receiver, '.popup-panel-event-chat', senderText, 45000);
  await assertSingleMessage(receiver, senderText, { mine: false, label: 'receiver sees sender message once' });
  await receiver.recordStep('receiver-sees-sender-message');

  await reactToMessage(receiver, senderText);
  await waitForMessageChild(receiver, senderText, '.chat-reaction-summary', 30000);
  await waitForMessageChild(page, senderText, '.chat-reaction-summary', 45000);
  await assertSingleMessage(page, senderText, { mine: true, label: 'sender still has one reacted message' });
  await assertSingleMessage(receiver, senderText, { mine: false, label: 'receiver still has one reacted message' });
  await page.recordStep('sender-sees-receiver-reaction');
  await receiver.recordStep('receiver-reacted-to-sender-message');

  await sendChatMessage(receiver, receiverText);
  await waitForVisibleText(receiver, '.popup-panel-event-chat', receiverText, 30000);
  await waitForMessageNotPending(receiver, receiverText, 45000);
  await assertSingleMessage(receiver, receiverText, { mine: true, label: 'receiver sees own sent message once' });
  await receiver.recordStep('receiver-message-sent-and-acked');

  await waitForVisibleText(page, '.popup-panel-event-chat', receiverText, 45000);
  await assertSingleMessage(page, receiverText, { mine: false, label: 'sender sees receiver message once' });
  await page.recordStep('sender-sees-receiver-message');

  await assertBrowserExpectations(receiver, {
    selectors: ['.popup-panel-event-chat', '.chat-message'],
    absentSelectors: ['.chat-message-pending', '.chat-message-timed-out'],
    network: ['/api/activities/chats'],
    noCrashText: true,
    noBrokenImages: true,
    noConsoleErrors: true
  });
}

async function primeDemoUser(page, userId) {
  await page.primeOrigin({
    localStorage: demoStorage(userId)
  });
}

function demoStorage(userId) {
  return {
    'app-session': JSON.stringify({ kind: 'demo', userId }),
    'demo-active-user': userId
  };
}

async function assertActiveUser(page, expectedUserId) {
  const session = await page.evaluate(() => {
    const appSession = JSON.parse(window.localStorage.getItem('app-session') || '{}');
    return {
      appSessionUserId: appSession.userId ?? '',
      demoActiveUser: window.localStorage.getItem('demo-active-user') ?? ''
    };
  });
  assert(
    session.appSessionUserId === expectedUserId && session.demoActiveUser === expectedUserId,
    'Browser page should be logged in as the expected demo user',
    { expectedUserId, session }
  );
}

async function discoverSharedChat(page, senderUserId, receiverUserId) {
  return page.evaluate(async ({ senderUserId, receiverUserId, preferredChatId }) => {
    const fetchChats = async userId => {
      const response = await fetch(`/api/activities/chats?userId=${encodeURIComponent(userId)}`, {
        headers: { 'X-App-Session-Kind': 'demo' }
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    };
    const senderChats = await fetchChats(senderUserId);
    const receiverChats = await fetchChats(receiverUserId);
    const receiverChatIds = new Set(receiverChats.map(chat => `${chat.id ?? ''}`.trim()).filter(Boolean));
    const candidates = senderChats.filter(chat => {
      const id = `${chat.id ?? ''}`.trim();
      const memberIds = Array.isArray(chat.memberIds) ? chat.memberIds.map(value => `${value ?? ''}`.trim()) : [];
      return id
        && receiverChatIds.has(id)
        && memberIds.includes(senderUserId)
        && memberIds.includes(receiverUserId);
    });
    const preferred = candidates.find(chat => chat.id === preferredChatId);
    const picked = preferred ?? candidates[0] ?? null;
    return picked
      ? {
          id: picked.id,
          title: picked.title ?? '',
          memberIds: picked.memberIds ?? [],
          senderChatCount: senderChats.length,
          receiverChatCount: receiverChats.length,
          candidateCount: candidates.length
        }
      : {
          id: '',
          title: '',
          memberIds: [],
          senderChatCount: senderChats.length,
          receiverChatCount: receiverChats.length,
          candidateCount: candidates.length
        };
  }, { senderUserId, receiverUserId, preferredChatId: PREFERRED_SHARED_CHAT_ID });
}

async function openChatList(page) {
  await openNavigatorMenu(page);
  await page.recordStep('chat-navigator-menu-open');
  await page.click('button[aria-label="Open chat"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.popup-panel-activities');
  await page.waitForNetwork('/api/activities/chats', { timeoutMs: 30000 });
  await page.waitFor('visible chat rows', async () => {
    return page.visibleCount('.popup-panel-activities .activities-card-chat, .popup-panel-activities .activities-row-item')
      .then(count => count > 0);
  }, 30000);
  await assertVisibleCount(page, '.activities-card-chat', 1, 'chat rows');
}

async function openChatById(page, chatId) {
  await page.waitFor(`chat ${chatId} loaded into activities component`, async () => {
    return page.evaluate(chatId => {
      const host = document.querySelector('app-activities-popup');
      const component = window.ng?.getComponent?.(host);
      return Array.isArray(component?.chatItems)
        && component.chatItems.some(chat => `${chat.id ?? ''}`.trim() === chatId);
    }, chatId);
  }, 30000);
  const result = await page.evaluate(chatId => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const host = document.querySelector('app-activities-popup');
    const component = window.ng?.getComponent?.(host);
    const chat = Array.isArray(component?.chatItems)
      ? component.chatItems.find(item => `${item.id ?? ''}`.trim() === chatId)
      : null;
    const rowLabels = [
      chat?.title,
      chat?.subtitle,
      chat?.name,
      chatId
    ]
      .map(value => `${value ?? ''}`.trim())
      .filter(Boolean);
    const rows = Array.from(document.querySelectorAll('.popup-panel-activities .activities-card-chat')).filter(isVisible);
    const matchingRow = rows.find(row => rowLabels.some(label => (row.textContent ?? '').includes(label)));
    if (matchingRow) {
      matchingRow.scrollIntoView({ block: 'center', inline: 'center' });
      matchingRow.click();
      return {
        opened: true,
        method: 'row-click',
        rowIndex: rows.indexOf(matchingRow),
        visibleRows: rows.length,
        title: chat?.title ?? ''
      };
    }
    const items = typeof component?.activitiesSmartList?.itemsSnapshot === 'function'
      ? component.activitiesSmartList.itemsSnapshot()
      : [];
    const chatRows = items.filter(row => row?.type === 'chats');
    const rowIndex = chatRows.findIndex(row => `${row.id ?? ''}`.trim() === chatId);
    if (rowIndex >= 0 && rows[rowIndex]) {
      rows[rowIndex].scrollIntoView({ block: 'center', inline: 'center' });
      rows[rowIndex].click();
      return {
        opened: true,
        method: 'row-click',
        rowIndex,
        visibleRows: rows.length,
        title: chat?.title ?? ''
      };
    }
    return {
      opened: false,
      method: 'none',
      rowIndex,
      visibleRows: rows.length,
      rowLabels,
      smartListIds: items.map(row => row?.id).filter(Boolean).slice(0, 20),
      chatItemIds: (component?.chatItems ?? []).map(item => item?.id).filter(Boolean).slice(0, 20),
      visibleRowTexts: rows.map(row => (row.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 160))
    };
  }, chatId);
  assert(result.opened, `Should open chat ${chatId} from the activities UI`, result);
  return result;
}

async function assertOpenChatId(page, expectedChatId) {
  await page.waitFor(`chat popup opened for ${expectedChatId}`, async () => {
    return page.evaluate(expectedChatId => {
      const host = document.querySelector('app-event-chat-popup');
      const component = window.ng?.getComponent?.(host);
      const session = typeof component?.session === 'function' ? component.session() : null;
      return `${session?.item?.id ?? ''}`.trim() === expectedChatId;
    }, expectedChatId);
  }, 15000);
}

async function settleChatThread(page) {
  await page.waitFor('chat initial load settled', async () => {
    return page.evaluate(() => {
      const host = document.querySelector('app-event-chat-popup');
      const component = window.ng?.getComponent?.(host);
      return component && component.chatInitialLoadPending !== true;
    });
  }, 30000);
}

async function sendChatMessage(page, text) {
  await page.fillVisible('.popup-panel-event-chat textarea[placeholder="Write message"]', text);
  await page.clickVisible('.popup-panel-event-chat button[aria-label="Send message"]');
}

async function reactToMessage(page, text) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="React"]');
  await page.waitForSelector('.chat-quick-reactions');
  await page.clickVisible('.chat-quick-reactions button');
}

async function selectMessageContaining(page, text) {
  const point = await page.evaluate(text => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const message = Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
      .find(element => isVisible(element) && (element.textContent ?? '').includes(text));
    if (!message) {
      return null;
    }
    message.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = message.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }, text);
  assert(point, `Should select chat message containing ${text}`);
  await clickPoint(page, point);
  await page.waitForSelector('.chat-message-tools', { timeoutMs: 10000 });
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
    const snapshot = await readMessageSnapshot(page, text);
    return snapshot.componentMessages.some(message => !message.pending && !message.timedOut);
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
      const message = Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
        .find(element => isVisible(element) && (element.textContent ?? '').includes(text));
      return Boolean(message?.querySelector(childSelector));
    }, { text, childSelector });
  }, timeoutMs);
}

async function assertSingleMessage(page, text, options = {}) {
  const snapshot = await readMessageSnapshot(page, text);
  const label = options.label ?? `message ${text} should appear once`;
  assert(snapshot.componentMessages.length === 1, label, { text, snapshot });
  assert(snapshot.visibleMessages.length === 1, `${label} in visible DOM`, { text, snapshot });
  if (typeof options.mine === 'boolean') {
    assert(snapshot.componentMessages[0].mine === options.mine, `${label} should have expected ownership`, {
      text,
      expectedMine: options.mine,
      snapshot
    });
    assert(snapshot.visibleMessages[0].mine === options.mine, `${label} should have expected visible ownership`, {
      text,
      expectedMine: options.mine,
      snapshot
    });
  }
  assert(!snapshot.componentMessages[0].pending, `${label} should not be pending`, { text, snapshot });
  assert(!snapshot.componentMessages[0].timedOut, `${label} should not be timed out`, { text, snapshot });
}

async function readMessageSnapshot(page, text) {
  return page.evaluate(text => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const host = document.querySelector('app-event-chat-popup');
    const component = window.ng?.getComponent?.(host);
    const allMessages = Array.isArray(component?.allMessages) ? component.allMessages : [];
    const componentMessages = allMessages
      .filter(message => `${message.text ?? ''}`.includes(text))
      .map(message => ({
        id: message.id,
        clientId: message.clientId ?? '',
        text: message.text ?? '',
        mine: message.mine === true,
        pending: message.deliveryState === 'pending',
        timedOut: message.deliveryState === 'timed-out',
        reactions: (message.reactions ?? []).length
      }));
    const visibleMessages = Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
      .filter(element => isVisible(element) && (element.textContent ?? '').includes(text))
      .map(element => ({
        id: element.getAttribute('data-chat-message-id') ?? '',
        mine: element.classList.contains('mine'),
        pending: element.classList.contains('chat-message-pending'),
        timedOut: element.classList.contains('chat-message-timed-out'),
        text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 240)
      }));
    return {
      componentMessages,
      visibleMessages,
      componentMessageCount: componentMessages.length,
      visibleMessageCount: visibleMessages.length
    };
  }, text);
}
