import { assert } from '../../../../shared/assertions.mjs';
import {
  applyCurrentDemoSessionHeaders,
  assertBrowserExpectations,
  assertVisibleCount,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  performDemoLogin,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

const CHAT_POPUP_SELECTOR = '.event-chat-popup-shell .ui-popup__panel';

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
  await performDemoLogin(receiver, {
    geolocation: { latitude: 47.5004928, longitude: 19.0742528, accuracy: 20 },
    userId: RECEIVER_USER_ID,
    timeoutMs: 60000
  });
  await applyCurrentDemoSessionHeaders(receiver);
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
  await page.waitForSelector(CHAT_POPUP_SELECTOR);
  await page.waitForSelector('textarea[placeholder="Write message"]');
  await assertOpenChatId(page, sharedChat.id);
  await page.recordStep(`sender-chat-thread-open-${senderOpen.method}`);

  const receiverOpen = await openChatById(receiver, sharedChat.id);
  await receiver.waitForSelector(CHAT_POPUP_SELECTOR);
  await receiver.waitForSelector('textarea[placeholder="Write message"]');
  await assertOpenChatId(receiver, sharedChat.id);
  await receiver.recordStep(`receiver-chat-thread-open-${receiverOpen.method}`);

  await settleChatThread(page);
  await settleChatThread(receiver);

  await sendChatMessage(page, senderText);
  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, senderText, 30000);
  await waitForMessageNotPending(page, senderText, 45000);
  await assertSingleMessage(page, senderText, { mine: true, label: 'sender sees own sent message once' });
  await page.recordStep('sender-message-sent-and-acked');

  await waitForVisibleText(receiver, CHAT_POPUP_SELECTOR, senderText, 45000);
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
  await waitForVisibleText(receiver, CHAT_POPUP_SELECTOR, receiverText, 30000);
  await waitForMessageNotPending(receiver, receiverText, 45000);
  await assertSingleMessage(receiver, receiverText, { mine: true, label: 'receiver sees own sent message once' });
  await receiver.recordStep('receiver-message-sent-and-acked');

  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, receiverText, 45000);
  await assertSingleMessage(page, receiverText, { mine: false, label: 'sender sees receiver message once' });
  await page.recordStep('sender-sees-receiver-message');

  await assertBrowserExpectations(receiver, {
    selectors: [CHAT_POPUP_SELECTOR, '.chat-message'],
    absentSelectors: ['.chat-message-pending', '.chat-message-timed-out'],
    network: ['/api/activities/chats'],
    noCrashText: true,
    noBrokenImages: true,
    noConsoleErrors: true
  });
}

async function assertActiveUser(page, expectedUserId) {
  const session = await page.evaluate(() => {
    const appSession = JSON.parse(window.localStorage.getItem('myscoutee.http.session.v1') || '{}');
    return {
      appSessionUserId: appSession.userId ?? '',
      demoActiveUser: window.localStorage.getItem('myscoutee.http.demo.active-user.v1') ?? ''
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
    const fetchChatPage = async userId => {
      const params = new URLSearchParams({
        userId,
        limit: '12',
        sort: 'date',
        sortDirection: 'desc',
        secondaryFilter: 'recent'
      });
      const response = await fetch(`/api/activities/chats/page?${params.toString()}`, {
        headers: { 'X-App-Session-Kind': 'demo' }
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data?.items) ? data.items : [];
    };
    const senderChats = await fetchChats(senderUserId);
    const receiverChats = await fetchChats(receiverUserId);
    const receiverChatIds = new Set(receiverChats.map(chat => `${chat.id ?? ''}`.trim()).filter(Boolean));
    const candidateFrom = chats => chats.filter(chat => {
      const id = `${chat.id ?? ''}`.trim();
      const memberIds = Array.isArray(chat.memberIds) ? chat.memberIds.map(value => `${value ?? ''}`.trim()) : [];
      return id
        && receiverChatIds.has(id)
        && memberIds.includes(senderUserId)
        && memberIds.includes(receiverUserId);
    });
    const senderPage = await fetchChatPage(senderUserId);
    const receiverPageIds = new Set((await fetchChatPage(receiverUserId)).map(chat => `${chat.id ?? ''}`.trim()).filter(Boolean));
    const visibleCandidates = candidateFrom(senderPage).filter(chat => receiverPageIds.has(`${chat.id ?? ''}`.trim()));
    const candidates = candidateFrom(senderChats);
    const preferred = visibleCandidates.find(chat => chat.id === preferredChatId)
      ?? candidates.find(chat => chat.id === preferredChatId && receiverPageIds.has(chat.id));
    const picked = preferred ?? visibleCandidates[0] ?? candidates[0] ?? null;
    return picked
      ? {
          id: picked.id,
          title: picked.title ?? '',
          memberIds: picked.memberIds ?? [],
          senderChatCount: senderChats.length,
          receiverChatCount: receiverChats.length,
          candidateCount: candidates.length,
          visibleCandidateCount: visibleCandidates.length
        }
      : {
          id: '',
          title: '',
          memberIds: [],
          senderChatCount: senderChats.length,
          receiverChatCount: receiverChats.length,
          candidateCount: candidates.length,
          visibleCandidateCount: visibleCandidates.length
        };
  }, { senderUserId, receiverUserId, preferredChatId: PREFERRED_SHARED_CHAT_ID });
}

async function openChatList(page) {
  await openNavigatorMenu(page);
  await page.recordStep('chat-navigator-menu-open');
  await page.click('button[aria-label="Open chat"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/chats', { timeoutMs: 30000 });
  await page.waitFor('visible chat rows', async () => {
    return page.visibleCount('.activities-popup app-activities-chat-template .ui-single-row')
      .then(count => count > 0);
  }, 30000);
  await assertVisibleCount(page, '.activities-popup app-activities-chat-template .ui-single-row', 1, 'chat rows');
}

async function openChatById(page, chatId) {
  await scrollActivitiesChatListUntilRow(page, chatId, 60000);
  const result = await page.evaluate(chatId => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const matchingRow = document.querySelector(`[data-single-row-id="${CSS.escape(chatId)}"]`);
    if (matchingRow) {
      matchingRow.scrollIntoView({ block: 'center', inline: 'center' });
      matchingRow.click();
      return {
        opened: true,
        method: 'row-click',
        visible: isVisible(matchingRow),
        text: (matchingRow.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 160)
      };
    }
    return {
      opened: false,
      method: 'none',
      visibleRowIds: Array.from(document.querySelectorAll('.activities-popup [data-single-row-id]'))
        .map(row => row.getAttribute('data-single-row-id'))
        .filter(Boolean)
        .slice(0, 20)
    };
  }, chatId);
  assert(result.opened, `Should open chat ${chatId} from the activities UI`, result);
  return result;
}

async function scrollActivitiesChatListUntilRow(page, chatId, timeoutMs = 60000) {
  const started = Date.now();
  let lastState = null;
  while (Date.now() - started < timeoutMs) {
    const found = await page.evaluate(chatId => {
      const row = document.querySelector(`[data-single-row-id="${CSS.escape(chatId)}"]`);
      if (!row) {
        return false;
      }
      const rect = row.getBoundingClientRect();
      const style = window.getComputedStyle(row);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }, chatId);
    if (found) {
      return;
    }
    lastState = await scrollActivitiesChatListOnce(page);
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 400)));
  }
  await page.recordStep('chat-row-missing-after-scroll');
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Activities chat list did not expose the selected chat after scrolling',
    details: {
      chatId,
      lastState: lastState ?? {}
    }
  });
  assert(false, `chat ${chatId} should be visible in activities list after scrolling`, lastState ?? {});
}

async function scrollActivitiesChatListOnce(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.activities-popup') ?? document;
    const list = root.querySelector('.smart-list');
    if (!list) {
      return { hasList: false };
    }
    const before = list.scrollTop;
    const step = Math.max(260, Math.floor((list.clientHeight || window.innerHeight || 360) * 0.82));
    list.scrollTo({ top: Math.min(list.scrollHeight, before + step), behavior: 'auto' });
    list.dispatchEvent(new Event('scroll', { bubbles: true }));
    return {
      hasList: true,
      before,
      after: list.scrollTop,
      clientHeight: list.clientHeight,
      scrollHeight: list.scrollHeight,
      visibleRowIds: Array.from(root.querySelectorAll('[data-chat-id]'))
        .map(row => row.getAttribute('data-chat-id'))
        .filter(Boolean)
        .slice(0, 20)
    };
  });
}

async function assertOpenChatId(page, expectedChatId) {
  await page.waitFor(`chat popup opened for ${expectedChatId}`, async () => {
    return page.evaluate(expectedChatId => {
      const panel = document.querySelector('.event-chat-popup-shell');
      return `${panel?.getAttribute('data-chat-id') ?? ''}`.trim() === expectedChatId;
    }, expectedChatId);
  }, 15000);
}

async function settleChatThread(page) {
  await page.waitFor('chat initial load settled', async () => {
    return page.evaluate(() => {
      const input = document.querySelector('.event-chat-popup-shell textarea[placeholder="Write message"]');
      return Boolean(input && !input.disabled);
    });
  }, 30000);
}

async function sendChatMessage(page, text) {
  await page.fillVisible('.event-chat-popup-shell textarea[placeholder="Write message"]', text);
  await page.clickVisible('.event-chat-popup-shell button[aria-label="Send message"]');
}

async function reactToMessage(page, text) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="React"]');
  await page.waitForSelector('.chat-quick-reactions');
  await page.clickVisible('.chat-quick-reactions button');
}

async function selectMessageContaining(page, text) {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    const target = await chatMessageClickTarget(page, text);
    assert(target, `Should select chat message containing ${text}`);
    if (target.toolsVisible) {
      return;
    }
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 150)));
    await clickPoint(page, target.point);
    const toolsVisible = await page.waitForSelector('.chat-message-tools', { timeoutMs: 1600 })
      .then(() => true)
      .catch(() => false);
    if (toolsVisible) {
      return;
    }
    await clickMessageElement(page, text);
    const programmaticToolsVisible = await page.waitForSelector('.chat-message-tools', { timeoutMs: 1600 })
      .then(() => true)
      .catch(() => false);
    if (programmaticToolsVisible) {
      return;
    }
  }
  assert(false, 'Chat message tools should open after selecting a message', { text });
}

async function clickMessageElement(page, text) {
  await page.evaluate(text => {
    const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
      .find(element => (element.textContent ?? '').includes(text));
    message?.click();
  }, text);
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
      const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
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
    const visibleMessages = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
      .filter(element => isVisible(element) && (element.textContent ?? '').includes(text))
      .map(element => ({
        id: element.getAttribute('data-chat-message-id') ?? '',
        mine: element.classList.contains('mine'),
        pending: element.classList.contains('chat-message-pending'),
        timedOut: element.classList.contains('chat-message-timed-out'),
        text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 240)
      }));
    return {
      componentMessages: visibleMessages,
      visibleMessages,
      componentMessageCount: visibleMessages.length,
      visibleMessageCount: visibleMessages.length
    };
  }, text);
}
