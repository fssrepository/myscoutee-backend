import { assert } from '../../../../shared/assertions.mjs';
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
  await waitForVisibleText(receiver, '.popup-panel-event-chat', readReceiptText, 45000);
  await waitForMessageChild(page, readReceiptText, '.chat-readers', 45000);
  await assertSingleMessage(page, readReceiptText, { mine: true, label: 'sender read-receipt probe' });
  await page.recordStep('sender-sees-receiver-read-receipt');
  await receiver.recordStep('receiver-read-message-visible');

  await sendChatMessage(page, sourceText);
  await waitForMessageNotPending(page, sourceText, 45000);
  await waitForVisibleText(receiver, '.popup-panel-event-chat', sourceText, 45000);
  await assertSingleMessage(receiver, sourceText, { mine: false, label: 'receiver sees source message once' });
  await page.recordStep('sender-source-message-acked');
  await receiver.recordStep('receiver-source-message-visible');

  await replyToMessage(receiver, sourceText, replyText);
  await waitForMessageNotPending(receiver, replyText, 45000);
  await waitForVisibleText(page, '.popup-panel-event-chat', replyText, 45000);
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
  await waitForVisibleText(page, '.popup-panel-event-chat', replyEditedText, 45000);
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
  await waitForVisibleText(receiver, '.popup-panel-event-chat', resumeText, 45000);
  await receiver.recordStep('receiver-resumed-and-loaded-missed-message');

  await closeChatThread(receiver);
  await assertChatListUnread(receiver, sharedChat.id, 0);
  await receiver.recordStep('receiver-chat-list-unread-cleared-after-read');

  await assertBrowserExpectations(receiver, {
    selectors: ['.popup-panel-activities'],
    absentSelectors: ['.explanation-popup', '.confirmation-dialog', '.chat-message-pending', '.chat-message-timed-out'],
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
  await page.waitForSelector('.popup-panel-event-chat');
  await page.waitForSelector('textarea[placeholder="Write message"]');
  await assertOpenChatId(page, chatId);
  await settleChatThread(page);
  return opened;
}

async function openChatList(page) {
  if (await page.isSelectorVisible('.popup-panel-activities')) {
    return;
  }
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
    if (chat && typeof component?.activitiesContext?.openEventChat === 'function') {
      component.activitiesContext.openEventChat(chat);
      return {
        opened: true,
        method: 'component-open',
        visibleRows: rows.length,
        title: chat?.title ?? ''
      };
    }
    return {
      opened: false,
      method: 'none',
      visibleRows: rows.length,
      rowLabels,
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

async function assertReverseHistoryPagination(page, olderText, latestText) {
  await waitForVisibleText(page, '.popup-panel-event-chat', latestText, 30000);
  const before = await chatThreadSnapshot(page);
  assert(before.total >= 26, 'Chat history setup should create a paginated thread', before);
  assert(before.itemsSnapshotCount < before.total, 'Chat thread should initially render a paginated subset', before);
  const visibleBefore = await isVisibleChatText(page, olderText);
  if (visibleBefore) {
    return;
  }
  const after = await scrollChatThreadUntilText(page, olderText, 45000);
  assert(after.itemsSnapshotCount > before.itemsSnapshotCount, 'Scrolling the reversed chat thread should load older history', {
    before,
    after,
    olderText
  });
}

async function chatThreadSnapshot(page) {
  return page.evaluate(() => {
    const host = document.querySelector('app-event-chat-popup app-smart-list');
    const component = window.ng?.getComponent?.(host);
    const items = typeof component?.itemsSnapshot === 'function' ? component.itemsSnapshot() : [];
    const total = typeof component?.totalItemCount === 'function' ? component.totalItemCount() : items.length;
    const scroll = document.querySelector('.popup-panel-event-chat .smart-list');
    return {
      itemsSnapshotCount: items.length,
      total,
      visibleMessageCount: Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
        .filter(isVisible)
        .length,
      visibleTexts: Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
        .filter(isVisible)
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
      const list = document.querySelector('.popup-panel-event-chat .smart-list');
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
    return Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
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
  await page.fillVisible('.popup-panel-event-chat textarea[placeholder="Write message"]', text);
  await page.clickVisible('.popup-panel-event-chat button[aria-label="Send message"]');
}

async function replyToMessage(page, sourceText, replyText) {
  await selectMessageContaining(page, sourceText);
  await page.clickVisible('.chat-message-tools button[aria-label="Reply"]');
  await page.waitForSelector('.chat-reply-draft');
  await page.fillVisible('.popup-panel-event-chat textarea[placeholder="Write message"]', replyText);
  await page.clickVisible('.popup-panel-event-chat button[aria-label="Send message"]');
}

async function pinMessage(page, text) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('.chat-message-action-menu');
  await page.clickByText('.chat-message-action-menu button', 'Pin');
}

async function editOwnMessage(page, text, nextText) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('.chat-message-action-menu');
  await page.clickByText('.chat-message-action-menu button', 'Edit');
  await page.waitForSelector('.chat-edit-draft');
  await page.fillVisible('.popup-panel-event-chat textarea[placeholder="Write message"]', nextText);
  await page.clickVisible('.popup-panel-event-chat button[aria-label="Send message"]');
}

async function unsendOwnMessage(page, text) {
  await selectMessageContaining(page, text);
  await page.clickVisible('.chat-message-tools button[aria-label="More message actions"]');
  await page.waitForSelector('.chat-message-action-menu');
  await page.clickByText('.chat-message-action-menu button', 'Unsend');
}

async function sendImageAttachment(page) {
  await page.clickVisible('.popup-panel-event-chat .chat-compose-plus-btn');
  await page.waitForSelector('.chat-composer-menu');
  await page.recordStep('chat-composer-media-menu-open');
  await page.clickVisible('.chat-composer-menu-item-media');
  await page.setFileInputFiles('.popup-panel-event-chat .chat-attachment-input', IMAGE_FIXTURE_PATH);
  await page.waitForNetwork('/api/media/images', { timeoutMs: 60000 });
}

async function createPoll(page, question, options) {
  await page.clickVisible('.popup-panel-event-chat .chat-compose-plus-btn');
  await page.waitForSelector('.chat-composer-menu');
  await page.clickVisible('.chat-composer-menu-item-poll');
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
  await page.waitForSelector('.chat-poll-vote-panel');
  await page.clickByText('.chat-poll-vote-option', optionLabel);
  await page.waitFor('poll vote submit enabled', async () => page.evaluate(() => {
    const button = document.querySelector('.chat-poll-vote-submit');
    return Boolean(button && !button.disabled);
  }), 10000);
  await page.clickVisible('.chat-poll-vote-submit');
  await page.waitForSelectorHidden('.chat-poll-vote-panel', { timeoutMs: 30000 });
}

async function waitForPollVoteVisible(page, messageId, voterUserId, timeoutMs) {
  await page.waitFor(`poll vote by ${voterUserId} visible for ${messageId}`, async () => {
    return page.evaluate(({ messageId, voterUserId }) => {
      const host = document.querySelector('app-event-chat-popup');
      const component = window.ng?.getComponent?.(host);
      const messages = Array.isArray(component?.allMessages) ? component.allMessages : [];
      const message = messages.find(item => `${item.id ?? ''}`.trim() === messageId);
      const pollAttachment = (message?.attachments ?? []).find(attachment => attachment.type === 'poll') ?? null;
      return `${pollAttachment?.description ?? ''}`.includes(voterUserId);
    }, { messageId, voterUserId });
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
    const minSentAt = Date.parse(options.minSentAtIso ?? '');
    const host = document.querySelector('app-event-chat-popup');
    const component = window.ng?.getComponent?.(host);
    const messages = Array.isArray(component?.allMessages) ? component.allMessages : [];
    const candidates = messages
      .filter(message => typeof options.mine === 'boolean' ? message.mine === options.mine : true)
      .filter(message => !message.deliveryState)
      .filter(message => !Number.isFinite(minSentAt) || Date.parse(message.sentAtIso ?? '') >= minSentAt - 1000)
      .filter(message => (message.attachments ?? []).some(attachment => {
        if (attachment.type !== options.type) {
          return false;
        }
        if (options.title && attachment.title !== options.title) {
          return false;
        }
        return true;
      }))
      .sort((first, second) => Date.parse(second.sentAtIso ?? '') - Date.parse(first.sentAtIso ?? ''));
    const match = candidates[0] ?? null;
    return {
      match: match
        ? {
            id: match.id,
            text: match.text ?? '',
            mine: match.mine === true,
            sentAtIso: match.sentAtIso ?? '',
            attachments: match.attachments ?? []
          }
        : null,
      visibleMessages: Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
        .filter(isVisible)
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
      const message = Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
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
    const message = Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message'))
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
      const component = window.ng?.getComponent?.(document.querySelector('app-event-chat-popup'));
      const messages = Array.isArray(component?.allMessages) ? component.allMessages : [];
      const componentDeleted = messages.some(message =>
        `${message.id ?? ''}`.trim() === messageId && Boolean(message.deletedAtIso)
      );
      const domDeleted = Array.from(document.querySelectorAll('.popup-panel-event-chat .chat-message-deleted'))
        .some(element => element.getAttribute('data-chat-message-id') === messageId);
      return componentDeleted && domDeleted;
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
  if (!(await page.isSelectorVisible('.popup-panel-event-chat'))) {
    return;
  }
  await page.clickVisible('.popup-panel-event-chat .popup-close[aria-label="Close chat popup"]');
  await page.waitForSelectorHidden('.popup-panel-event-chat', { timeoutMs: 20000 });
  await page.waitForSelector('.popup-panel-activities');
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
  return page.evaluate(chatId => {
    const host = document.querySelector('app-activities-popup');
    const component = window.ng?.getComponent?.(host);
    const chatItems = Array.isArray(component?.chatItems) ? component.chatItems : [];
    const chat = chatItems.find(item => `${item.id ?? ''}`.trim() === chatId) ?? null;
    return {
      chat: chat
        ? {
            id: chat.id,
            title: chat.title ?? '',
            unread: Math.max(0, Math.trunc(Number(chat.unread) || 0)),
            lastMessage: chat.lastMessage ?? ''
          }
        : null,
      visibleText: (document.querySelector('.popup-panel-activities')?.textContent ?? '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 1000),
      chatCount: chatItems.length
    };
  }, chatId);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
