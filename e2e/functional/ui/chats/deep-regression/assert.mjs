import { assert } from '../../../../shared/assertions.mjs';
import {
  assertBrowserExpectations,
  assertVisibleCount,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

const CHAT_POPUP_SELECTOR = '.event-chat-popup-shell .ui-popup__panel';

const SENDER_USER_ID = 'bf057de7c586eede7e84bdc7';
const RECEIVER_USER_ID = '7822c5f99eff99d63abe8933';
const PREFERRED_SHARED_CHAT_ID = '60c8f35688886a1030926aed';
const IMAGE_FIXTURE_PATH = '/home/raxim/workspace/myscoutee-backend/frontend/src/assets/logo/heart.png';
const TINY_WAV_DATA_URL = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';

export async function assertUi({ page, ctx, newIsolatedRecordedPage }) {
  assert(typeof newIsolatedRecordedPage === 'function', 'Chat deep regression requires isolated two-user browser support');

  const marker = `UI E2E chat deep ${Date.now().toString(36)}`;
  const sourceText = `${marker} source`;
  const replyText = `${marker} reply`;
  const replyEditedText = `${marker} reply edited`;
  const readReceiptText = `${marker} read receipt`;
  const resumeText = `${marker} offline resume`;
  const pollQuestion = `${marker} poll question`;
  const voiceTitle = `${marker} voice clip`;

  await page.waitForSelector('.game-page');
  await assertActiveUser(page, SENDER_USER_ID);
  await page.recordStep('sender-game-open');

  const sharedChat = await discoverSharedChat(page, SENDER_USER_ID, RECEIVER_USER_ID);
  assert(sharedChat?.id, 'Chat deep regression should find a shared chat for the two demo users', sharedChat);

  const historySeed = await seedHistoryMessages(page, sharedChat.id, marker);
  await page.recordStep('chat-history-seeded');

  await openChatOnPage(page, sharedChat.id);
  await page.recordStep('sender-chat-open-with-history');
  await assertReverseHistoryPagination(page, historySeed.oldestText, historySeed.newestText);
  await page.recordStep('sender-history-pagination-loaded-older-message');

  const receiver = await newIsolatedRecordedPage('receiver-user-session', {
    viewport: ctx.viewport
  });
  await primeDemoUser(receiver, RECEIVER_USER_ID);
  await receiver.navigate('/game', { loadTimeoutMs: 30000 });
  await receiver.waitForSelector('.game-page');
  await assertActiveUser(receiver, RECEIVER_USER_ID);
  await receiver.recordStep('receiver-game-open');
  await openChatOnPage(receiver, sharedChat.id);
  await receiver.recordStep('receiver-chat-open');

  await sendChatMessage(page, readReceiptText);
  await waitForMessageNotPending(page, readReceiptText, 45000);
  await waitForVisibleText(receiver, CHAT_POPUP_SELECTOR, readReceiptText, 45000);
  await waitForMessageChild(page, readReceiptText, '.chat-readers', 45000);
  await assertSingleMessage(page, readReceiptText, { mine: true, label: 'sender read-receipt probe' });
  await page.recordStep('sender-sees-receiver-read-receipt');
  await receiver.recordStep('receiver-read-message-visible');

  await sendChatMessage(page, sourceText);
  await waitForMessageNotPending(page, sourceText, 45000);
  await waitForVisibleText(receiver, CHAT_POPUP_SELECTOR, sourceText, 45000);
  await assertSingleMessage(receiver, sourceText, { mine: false, label: 'receiver sees source message once' });
  await page.recordStep('sender-source-message-acked');
  await receiver.recordStep('receiver-source-message-visible');

  await replyToMessage(receiver, sourceText, replyText);
  await waitForMessageNotPending(receiver, replyText, 45000);
  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, replyText, 45000);
  await waitForMessageChild(page, replyText, '.chat-message-reply-context', 45000);
  await assertSingleMessage(page, replyText, { mine: false, label: 'sender sees receiver reply once' });
  await page.recordStep('sender-sees-cross-user-reply');
  await receiver.recordStep('receiver-reply-sent');

  await pinMessage(receiver, sourceText);
  await waitForMessageChild(receiver, sourceText, '.chat-pin-badge', 30000);
  await waitForMessageChild(page, sourceText, '.chat-pin-badge', 45000);
  await page.recordStep('sender-sees-cross-user-pin');
  await receiver.recordStep('receiver-pinned-sender-message');

  await editOwnMessage(receiver, replyText, replyEditedText);
  await waitForMessageNotPending(receiver, replyEditedText, 45000);
  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, replyEditedText, 45000);
  await waitForMessageChild(page, replyEditedText, '.chat-edited-label', 45000);
  await assertSingleMessage(page, replyEditedText, { mine: false, label: 'sender sees receiver edit once' });
  await page.recordStep('sender-sees-cross-user-edit');
  await receiver.recordStep('receiver-edited-own-reply');

  const editedReplyId = await waitForMessageIdByText(receiver, replyEditedText, 30000);
  await unsendOwnMessage(receiver, replyEditedText);
  await waitForMessageDeletedById(receiver, editedReplyId, 45000);
  await waitForMessageDeletedById(page, editedReplyId, 45000);
  await page.recordStep('sender-sees-cross-user-delete');
  await receiver.recordStep('receiver-unsent-own-reply');

  const imageSinceIso = new Date().toISOString();
  await sendImageAttachment(page);
  const senderImage = await waitForAttachmentMessage(page, {
    type: 'image',
    mine: true,
    minSentAtIso: imageSinceIso
  });
  await waitForAttachmentRendered(page, senderImage.id, '.chat-image-attachment img', 45000);
  const receiverImage = await waitForAttachmentMessage(receiver, {
    type: 'image',
    mine: false,
    minSentAtIso: imageSinceIso
  });
  await waitForAttachmentRendered(receiver, receiverImage.id, '.chat-image-attachment img', 45000);
  await page.recordStep('sender-image-attachment-sent');
  await receiver.recordStep('receiver-image-attachment-visible');

  const pollSinceIso = new Date().toISOString();
  await createPoll(page, pollQuestion, ['Yes', 'No']);
  const senderPoll = await waitForAttachmentMessage(page, {
    type: 'poll',
    title: pollQuestion,
    mine: true,
    minSentAtIso: pollSinceIso
  });
  await waitForAttachmentRendered(page, senderPoll.id, '.chat-poll-attachment', 45000);
  const receiverPoll = await waitForAttachmentMessage(receiver, {
    type: 'poll',
    title: pollQuestion,
    mine: false,
    minSentAtIso: pollSinceIso
  });
  await waitForAttachmentRendered(receiver, receiverPoll.id, '.chat-poll-attachment', 45000);
  await votePoll(receiver, receiverPoll.id, 'Yes');
  await waitForPollVoteVisible(page, senderPoll.id, RECEIVER_USER_ID, 45000);
  await page.recordStep('sender-sees-poll-vote');
  await receiver.recordStep('receiver-voted-in-poll');

  const voiceSinceIso = new Date().toISOString();
  await postChatMessage(page, sharedChat.id, SENDER_USER_ID, {
    text: '',
    attachments: [{
      id: `voice-${Date.now()}`,
      type: 'voice',
      title: voiceTitle,
      subtitle: '0:01',
      url: TINY_WAV_DATA_URL,
      mimeType: 'audio/wav',
      sizeBytes: 44
    }]
  });
  const receiverVoice = await waitForAttachmentMessage(receiver, {
    type: 'voice',
    title: voiceTitle,
    mine: false,
    minSentAtIso: voiceSinceIso
  });
  await waitForAttachmentRendered(receiver, receiverVoice.id, '.chat-voice-attachment audio', 45000);
  await receiver.recordStep('receiver-voice-attachment-visible');

  await setNetworkOffline(receiver, true);
  await receiver.recordStep('receiver-network-offline-before-resume-message');
  await sendChatMessage(page, resumeText);
  await waitForMessageNotPending(page, resumeText, 45000);
  await page.recordStep('sender-sent-resume-message-while-receiver-offline');
  await setNetworkOffline(receiver, false);
  await receiver.navigate('/game', { loadTimeoutMs: 30000 });
  await receiver.waitForSelector('.game-page');
  await openChatOnPage(receiver, sharedChat.id);
  await waitForVisibleText(receiver, CHAT_POPUP_SELECTOR, resumeText, 45000);
  await receiver.recordStep('receiver-resumed-and-loaded-missed-message');

  await closeChatThread(receiver);
  await assertChatListUnread(receiver, sharedChat.id, 0);
  await receiver.recordStep('receiver-chat-list-unread-cleared-after-read');

  await assertBrowserExpectations(receiver, {
    selectors: ['.activities-popup'],
    absentSelectors: ['app-explanation-popup .ui-popup__panel', '.dialog', '.chat-message-pending', '.chat-message-timed-out'],
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
    'myscoutee.http.session.v1': JSON.stringify({ kind: 'demo', userId }),
    'myscoutee.http.demo.active-user.v1': userId
  };
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

async function seedHistoryMessages(page, chatId, marker) {
  const count = 26;
  const texts = [];
  for (let index = 1; index <= count; index += 1) {
    const text = `${marker} history ${String(index).padStart(2, '0')}`;
    const userId = index % 2 === 0 ? RECEIVER_USER_ID : SENDER_USER_ID;
    await postChatMessage(page, chatId, userId, { text });
    texts.push(text);
    await delay(20);
  }
  return {
    oldestText: texts[0],
    newestText: texts[texts.length - 1],
    texts
  };
}

async function postChatMessage(page, chatId, userId, body) {
  const result = await page.evaluate(async ({ chatId, userId, body }) => {
    const response = await fetch(`/api/activities/chats/${encodeURIComponent(chatId)}/messages?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Session-Kind': 'demo'
      },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  }, { chatId, userId, body });
  assert(result.ok, 'Chat setup message should be accepted by the backend', {
    chatId,
    userId,
    body,
    result
  });
  return result.data;
}

async function openChatOnPage(page, chatId) {
  await openChatList(page);
  const opened = await openChatById(page, chatId);
  await page.waitForSelector(CHAT_POPUP_SELECTOR);
  await page.waitForSelector('textarea[placeholder="Write message"]');
  await assertOpenChatId(page, chatId);
  await settleChatThread(page);
  return opened;
}

async function openChatList(page) {
  if (await page.isSelectorVisible('.activities-popup')) {
    return;
  }
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

async function assertReverseHistoryPagination(page, olderText, latestText) {
  await waitForVisibleText(page, CHAT_POPUP_SELECTOR, latestText, 30000);
  const before = await chatThreadSnapshot(page);
  assert(before.visibleMessageCount > 0, 'Chat thread should render visible messages after opening', before);
  const visibleBefore = await isVisibleChatText(page, olderText);
  if (visibleBefore) {
    return;
  }
  const after = await scrollChatThreadUntilText(page, olderText, 45000);
  assert(after.visibleMessageCount >= before.visibleMessageCount, 'Scrolling the reversed chat thread should keep or add visible history', {
    before,
    after,
    olderText
  });
}

async function chatThreadSnapshot(page) {
  return page.evaluate(() => {
    const scroll = document.querySelector('.event-chat-popup-shell .smart-list');
    const visibleMessages = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
      .filter(isVisible);
    return {
      itemsSnapshotCount: visibleMessages.length,
      total: visibleMessages.length,
      visibleMessageCount: visibleMessages.length,
      visibleTexts: visibleMessages
        .map(element => (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 180)),
      scrollTop: scroll?.scrollTop ?? 0,
      scrollHeight: scroll?.scrollHeight ?? 0,
      clientHeight: scroll?.clientHeight ?? 0
    };

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  });
}

async function scrollChatThreadUntilText(page, text, timeoutMs) {
  const started = Date.now();
  let lastSnapshot = null;
  while (Date.now() - started < timeoutMs) {
    if (await isVisibleChatText(page, text)) {
      return chatThreadSnapshot(page);
    }
    lastSnapshot = await page.evaluate(() => {
      const list = document.querySelector('.event-chat-popup-shell .smart-list');
      if (!list) {
        return { hasList: false };
      }
      const max = Math.max(0, list.scrollHeight - list.clientHeight);
      list.scrollTop = -max;
      list.dispatchEvent(new Event('scroll', { bubbles: true }));
      list.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: -900 }));
      return {
        hasList: true,
        max,
        scrollTop: list.scrollTop,
        scrollHeight: list.scrollHeight,
        clientHeight: list.clientHeight
      };
    });
    await delay(650);
  }
  const finalSnapshot = await chatThreadSnapshot(page).catch(() => lastSnapshot);
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Older chat history did not appear after reverse-thread pagination scroll',
    details: {
      expectedText: text,
      lastSnapshot,
      finalSnapshot
    }
  });
  assert(false, 'Older chat history should load when scrolling the reversed chat thread', {
    expectedText: text,
    lastSnapshot,
    finalSnapshot
  });
}

async function isVisibleChatText(page, text) {
  return page.evaluate(text => {
    return Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
      .some(element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && (element.textContent ?? '').includes(text);
      });
  }, text);
}

async function sendChatMessage(page, text) {
  await page.fillVisible('.event-chat-popup-shell textarea[placeholder="Write message"]', text);
  await page.clickVisible('.event-chat-popup-shell button[aria-label="Send message"]');
}

async function replyToMessage(page, sourceText, replyText) {
  await selectMessageContaining(page, sourceText);
  await page.clickVisible('.chat-message-tools button[aria-label="Reply"]');
  await page.waitForSelector('.chat-reply-draft');
  await page.fillVisible('.event-chat-popup-shell textarea[placeholder="Write message"]', replyText);
  await page.clickVisible('.event-chat-popup-shell button[aria-label="Send message"]');
}

async function pinMessage(page, text) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('app-menu-outlet .app-menu__panel');
  await page.clickByText('app-menu-outlet .app-menu__panel button', 'Pin');
}

async function editOwnMessage(page, text, nextText) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('app-menu-outlet .app-menu__panel');
  await page.clickByText('app-menu-outlet .app-menu__panel button', 'Edit');
  await page.waitForSelector('.chat-edit-draft');
  await page.fillVisible('.event-chat-popup-shell textarea[placeholder="Write message"]', nextText);
  await page.clickVisible('.event-chat-popup-shell button[aria-label="Send message"]');
}

async function unsendOwnMessage(page, text) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('app-menu-outlet .app-menu__panel');
  await page.clickByText('app-menu-outlet .app-menu__panel button', 'Unsend');
}

async function sendImageAttachment(page) {
  await page.clickVisible('.event-chat-popup-shell button[aria-label="Open chat tools"]');
  await page.waitForSelector('.chat-composer-app-menu .app-menu__panel');
  await page.recordStep('chat-composer-media-menu-open');
  await page.clickByText('.chat-composer-app-menu .app-menu__panel button', 'Upload image');
  await page.setFileInputFiles('.event-chat-popup-shell .chat-attachment-input', IMAGE_FIXTURE_PATH);
  await page.waitForNetwork('/api/media/images', { timeoutMs: 60000 });
}

async function createPoll(page, question, options) {
  await page.clickVisible('.event-chat-popup-shell button[aria-label="Open chat tools"]');
  await page.waitForSelector('.chat-composer-app-menu .app-menu__panel');
  await page.clickByText('.chat-composer-app-menu .app-menu__panel button', 'Create a poll');
  await page.waitForSelector('.chat-poll-composer');
  await page.fillVisible('.chat-poll-composer input[placeholder="Ask a question"]', question);
  const filled = await page.evaluate(({ options }) => {
    const inputs = Array.from(document.querySelectorAll('.chat-poll-composer-options input'));
    options.forEach((value, index) => {
      const input = inputs[index];
      if (!input) {
        return;
      }
      input.focus();
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.blur();
    });
    return inputs.length >= options.length;
  }, { options });
  assert(filled, 'Poll composer should expose option inputs', { options });
  await page.clickVisible('.chat-poll-create-btn');
}

async function votePoll(page, messageId, optionLabel) {
  await clickMessageChildById(page, messageId, '.chat-poll-vote-btn');
  await page.waitForSelector('.chat-poll-vote-body');
  await page.clickByText('.chat-poll-vote-option', optionLabel);
  await page.waitFor('poll vote submit enabled', async () => page.evaluate(() => {
    const button = document.querySelector('button[aria-label="Submit vote"]');
    return Boolean(button && !button.disabled);
  }), 10000);
  await page.clickVisible('button[aria-label="Submit vote"]');
  await page.waitForSelectorHidden('.chat-poll-vote-body', { timeoutMs: 30000 });
}

async function waitForPollVoteVisible(page, messageId, voterUserId, timeoutMs) {
  await page.waitFor(`poll vote by ${voterUserId} visible for ${messageId}`, async () => {
    return page.evaluate(messageId => {
      const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
        .find(element => element.getAttribute('data-chat-message-id') === messageId);
      return Boolean(message?.querySelector('.chat-poll-voter-avatar'));
    }, messageId);
  }, timeoutMs);
}

async function waitForAttachmentMessage(page, options) {
  let lastSnapshot = null;
  await page.waitFor(`chat attachment ${options.type} ${options.title ?? ''}`.trim(), async () => {
    lastSnapshot = await attachmentSnapshot(page, options);
    return Boolean(lastSnapshot.match?.id);
  }, options.timeoutMs ?? 60000);
  return lastSnapshot.match;
}

async function attachmentSnapshot(page, options) {
  return page.evaluate(options => {
    const selectorByType = {
      image: '.chat-image-attachment img',
      poll: '.chat-poll-attachment',
      voice: '.chat-voice-attachment audio'
    };
    const attachmentSelector = selectorByType[options.type] ?? '.chat-attachment-stack';
    const messages = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
      .filter(isVisible)
      .filter(element => typeof options.mine === 'boolean' ? element.classList.contains('mine') === options.mine : true)
      .filter(element => !element.classList.contains('chat-message-pending') && !element.classList.contains('chat-message-timed-out'))
      .filter(element => Boolean(element.querySelector(attachmentSelector)))
      .filter(element => !options.title || (element.textContent ?? '').includes(options.title));
    const match = messages[0] ?? null;
    return {
      match: match
        ? {
            id: match.getAttribute('data-chat-message-id') ?? '',
            text: (match.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 240),
            mine: match.classList.contains('mine'),
            sentAtIso: '',
            attachments: []
          }
        : null,
      visibleMessages: messages
        .map(element => ({
          id: element.getAttribute('data-chat-message-id') ?? '',
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 160)
        })),
      componentCount: messages.length
    };

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, options);
}

async function waitForAttachmentRendered(page, messageId, childSelector, timeoutMs) {
  await page.waitFor(`message ${messageId} renders ${childSelector}`, async () => {
    return page.evaluate(({ messageId, childSelector }) => {
      const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
        .find(element => element.getAttribute('data-chat-message-id') === messageId);
      if (!message) {
        return false;
      }
      const child = message.querySelector(childSelector);
      if (!child) {
        return false;
      }
      const rect = child.getBoundingClientRect();
      const style = window.getComputedStyle(child);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }, { messageId, childSelector });
  }, timeoutMs);
}

async function clickMessageChildById(page, messageId, childSelector) {
  const clicked = await page.evaluate(({ messageId, childSelector }) => {
    const message = Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message'))
      .find(element => element.getAttribute('data-chat-message-id') === messageId);
    const button = message?.querySelector(childSelector);
    if (!button || button.disabled) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  }, { messageId, childSelector });
  assert(clicked, `Message ${messageId} should expose ${childSelector}`);
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

async function waitForMessageIdByText(page, text, timeoutMs) {
  let snapshot = null;
  await page.waitFor(`message id for ${text}`, async () => {
    snapshot = await readMessageSnapshot(page, text);
    return Boolean(snapshot.componentMessages[0]?.id);
  }, timeoutMs);
  return snapshot.componentMessages[0].id;
}

async function waitForMessageDeletedById(page, messageId, timeoutMs) {
  await page.waitFor(`message ${messageId} deleted`, async () => {
    return page.evaluate(messageId => {
      return Array.from(document.querySelectorAll('.event-chat-popup-shell .chat-message-deleted'))
        .some(element => element.getAttribute('data-chat-message-id') === messageId);
    }, messageId);
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

async function setNetworkOffline(page, offline) {
  await page.connection.send('Network.emulateNetworkConditions', {
    offline,
    latency: 0,
    downloadThroughput: offline ? 0 : -1,
    uploadThroughput: offline ? 0 : -1,
    connectionType: offline ? 'none' : 'wifi'
  });
}

async function closeChatThread(page) {
  if (!(await page.isSelectorVisible(CHAT_POPUP_SELECTOR))) {
    return;
  }
  await page.clickVisible('.event-chat-popup-shell .ui-popup__close[aria-label="Close chat popup"]');
  await page.waitForSelectorHidden(CHAT_POPUP_SELECTOR, { timeoutMs: 20000 });
  await page.waitForSelector('.activities-popup');
}

async function assertChatListUnread(page, chatId, expectedUnread) {
  await page.waitFor(`chat ${chatId} unread count ${expectedUnread}`, async () => {
    const snapshot = await chatListSnapshot(page, chatId);
    return snapshot.chat?.unread === expectedUnread;
  }, 30000).catch(async error => {
    const snapshot = await chatListSnapshot(page, chatId);
    page.recordFinding?.({
      severity: 'fatal',
      title: 'Chat list unread badge did not clear after the receiver opened/read the thread',
      details: {
        expectedUnread,
        snapshot
      }
    });
    throw error;
  });
}

async function chatListSnapshot(page, chatId) {
  return page.evaluate(async chatId => {
    let userId = '';
    try {
      userId = JSON.parse(window.localStorage.getItem('myscoutee.http.session.v1') || '{}')?.userId ?? '';
    } catch {
      userId = '';
    }
    const response = userId
      ? await fetch(`/api/activities/chats?userId=${encodeURIComponent(userId)}`, {
          headers: { 'X-App-Session-Kind': 'demo' }
        })
      : null;
    const chatItems = response?.ok ? await response.json() : [];
    const chat = Array.isArray(chatItems)
      ? chatItems.find(item => `${item.id ?? ''}`.trim() === chatId) ?? null
      : null;
    return {
      chat: chat
        ? {
            id: chat.id,
            title: chat.title ?? '',
            unread: Math.max(0, Math.trunc(Number(chat.unread) || 0)),
            lastMessage: chat.lastMessage ?? ''
          }
        : null,
      visibleText: (document.querySelector('.activities-popup')?.textContent ?? '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 1000),
      visibleRowIds: Array.from(document.querySelectorAll('.activities-popup [data-chat-id]'))
        .map(row => row.getAttribute('data-chat-id'))
        .filter(Boolean)
        .slice(0, 20),
      chatCount: chatItems.length
    };
  }, chatId);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
