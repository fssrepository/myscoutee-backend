#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const repositoryRoot = process.env.MYSCOUTEE_PACKAGING_PROJECT_ROOT || fileURLToPath(new URL('../../../../', import.meta.url));
const config = JSON.parse(await readFile(path.join(repositoryRoot, 'config/packaging/seeds/data/chat.json'), 'utf8'));
const CHANNEL_OWNER_TYPES = new Map(config.channelOwnerTypes);
const KEY_SEPARATOR = '\u0000';

const writeChanges = process.argv.includes('--write');
const requestedDirectories = process.argv
  .slice(2)
  .filter(argument => argument !== '--write')
  .map(directory => path.resolve(repositoryRoot, directory));
const seedDirectories = requestedDirectories.length > 0
  ? requestedDirectories
  : config.databases.map(database =>
      path.join(repositoryRoot, config.seedRoot, database)
    );

let pendingChanges = 0;
for (const seedDirectory of seedDirectories) {
  const result = await normalizeSeedDirectory(seedDirectory);
  pendingChanges += result.pendingChanges;
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
if (!writeChanges && pendingChanges > 0) {
  process.exitCode = 1;
}

async function normalizeSeedDirectory(seedDirectory) {
  const [chats, messages, activityMembers, events, users] = await Promise.all([
    readJson(path.join(seedDirectory, config.files.chats)),
    readJson(path.join(seedDirectory, config.files.chatMessages)),
    readJson(path.join(seedDirectory, config.files.activityMembers)),
    readJson(path.join(seedDirectory, config.files.events)),
    readJson(path.join(seedDirectory, config.files.users))
  ]);

  const usersById = new Map(users.map(user => [normalizeId(user.userId), user]));
  const usersByName = uniqueUsersByName(users);
  const repairedMessageSenderIdentities = normalizeMessageSenderIdentities(
    messages,
    usersById,
    usersByName
  );
  const channelByChatId = channelScopeByChatId(chats);
  const membershipChanges = ensureMessageAuthorsAreAccepted(
    activityMembers,
    messages,
    channelByChatId,
    usersById
  );
  const acceptedMemberIdsByOwner = acceptedMemberIdsByOwnerKey(activityMembers);
  const repairedEventDocuments = syncEventMembershipDocuments(events, activityMembers);
  const messagesByChatId = groupMessagesByChatId(messages);
  const latestMessageByChatId = latestMessagesByChatId(messagesByChatId);
  const normalizedChats = normalizeChats(
    chats,
    messagesByChatId,
    latestMessageByChatId,
    acceptedMemberIdsByOwner
  );

  if (writeChanges) {
    await Promise.all([
      writeJson(path.join(seedDirectory, config.files.chats), normalizedChats.items),
      writeJson(path.join(seedDirectory, config.files.chatMessages), messages),
      writeJson(path.join(seedDirectory, config.files.activityMembers), activityMembers),
      writeJson(path.join(seedDirectory, config.files.events), events)
    ]);
  }

  return {
    database: path.basename(seedDirectory),
    mode: writeChanges ? 'write' : 'check',
    chatsBefore: chats.length,
    chatsAfter: normalizedChats.items.length,
    removedOwnerCopies: normalizedChats.removedOwnerCopies,
    addedOwnerCopies: normalizedChats.addedOwnerCopies,
    repairedChatSummaries: normalizedChats.repairedChatSummaries,
    repairedChatMemberLists: normalizedChats.repairedChatMemberLists,
    repairedMessageSenderIdentities,
    addedMessageAuthorMemberships: membershipChanges.added,
    promotedMessageAuthorMemberships: membershipChanges.promoted,
    repairedEventDocuments,
    pendingChanges: normalizedChats.removedOwnerCopies
      + normalizedChats.addedOwnerCopies
      + normalizedChats.repairedChatSummaries
      + normalizedChats.repairedChatMemberLists
      + repairedMessageSenderIdentities
      + membershipChanges.added
      + membershipChanges.promoted
      + repairedEventDocuments
  };
}

function uniqueUsersByName(users) {
  const result = new Map();
  const duplicateNames = new Set();
  for (const user of users) {
    const nameKey = normalizeName(user.name);
    if (!nameKey) {
      continue;
    }
    if (result.has(nameKey)) {
      duplicateNames.add(nameKey);
      continue;
    }
    result.set(nameKey, user);
  }
  for (const duplicateName of duplicateNames) {
    result.delete(duplicateName);
  }
  return result;
}

function normalizeMessageSenderIdentities(messages, usersById, usersByName) {
  let repaired = 0;
  for (const message of messages) {
    const senderName = `${message.sender ?? ''}`.trim();
    const namedUser = usersByName.get(normalizeName(senderName));
    if (!namedUser) {
      continue;
    }
    const namedUserId = normalizeId(namedUser.userId);
    const currentUserId = normalizeId(message.senderAvatar?.id);
    const currentUser = usersById.get(currentUserId);
    if (
      currentUserId === namedUserId
      && normalizeName(currentUser?.name) === normalizeName(senderName)
    ) {
      continue;
    }
    message.sender = `${namedUser.name ?? senderName}`.trim();
    message.senderAvatar = {
      id: namedUserId,
      initials: `${namedUser.initials ?? ''}`.trim() || initialsFromName(senderName),
      gender: namedUser.gender === 'woman' ? 'woman' : 'man'
    };
    message.messageSenderUserIds = [namedUserId];
    repaired += 1;
  }
  return repaired;
}

function acceptedMemberIdsByOwnerKey(activityMembers) {
  const result = new Map();
  for (const member of activityMembers) {
    if (`${member.status ?? ''}`.trim().toLowerCase() !== 'accepted') {
      continue;
    }
    const ownerType = `${member.ownerType ?? ''}`.trim();
    const ownerId = normalizeId(member.ownerId);
    const userId = normalizeId(member.userId);
    if (!ownerType || !ownerId || !userId) {
      continue;
    }
    const key = ownerKey(ownerType, ownerId);
    if (!result.has(key)) {
      result.set(key, []);
    }
    if (!result.get(key).includes(userId)) {
      result.get(key).push(userId);
    }
  }
  return result;
}

function channelScopeByChatId(chats) {
  const result = new Map();
  for (const chat of chats) {
    const ownerType = CHANNEL_OWNER_TYPES.get(chat.channelType);
    const chatId = normalizeId(chat.id);
    const ownerId = normalizeId(chat.ownerId);
    if (!ownerType || !chatId || !ownerId) {
      continue;
    }
    const scope = {
      ownerType,
      ownerId,
      ownerKey: ownerKey(ownerType, ownerId),
      eventId: normalizeId(chat.eventId)
    };
    const existing = result.get(chatId);
    if (
      existing
      && (
        existing.ownerType !== scope.ownerType
        || existing.ownerId !== scope.ownerId
        || existing.eventId !== scope.eventId
      )
    ) {
      throw new Error(`Chat ${chatId} has conflicting activity owners.`);
    }
    result.set(chatId, scope);
  }
  return result;
}

function ensureMessageAuthorsAreAccepted(
  activityMembers,
  messages,
  channelByChatId,
  usersById
) {
  const recordsByOwnerAndUser = new Map(activityMembers.map(member => [
    activityMemberKey(member.ownerType, member.ownerId, member.userId),
    member
  ]));
  const acceptedKeys = new Set(activityMembers
    .filter(member => `${member.status ?? ''}`.trim().toLowerCase() === 'accepted')
    .map(member => activityMemberKey(member.ownerType, member.ownerId, member.userId)));
  let added = 0;
  let promoted = 0;

  for (const message of messages) {
    const chatId = normalizeId(message.chatId);
    const scope = channelByChatId.get(chatId);
    if (!scope) {
      continue;
    }
    const senderId = normalizeId(message.senderAvatar?.id);
    if (!senderId || !usersById.has(senderId)) {
      continue;
    }
    const targets = [{
      ownerType: scope.ownerType,
      ownerId: scope.ownerId
    }];
    if (scope.ownerType !== 'event' && scope.eventId) {
      targets.push({
        ownerType: 'event',
        ownerId: scope.eventId
      });
    }
    for (const target of targets) {
      const key = activityMemberKey(target.ownerType, target.ownerId, senderId);
      if (acceptedKeys.has(key)) {
        continue;
      }
      const existing = recordsByOwnerAndUser.get(key);
      if (existing) {
        existing.status = 'accepted';
        existing.role = `${existing.role ?? ''}`.trim() || 'Member';
        existing.pendingSource = null;
        existing.requestKind = null;
        existing.invitedByUserId = null;
        existing.actionAtIso = `${existing.actionAtIso ?? message.sentAtIso ?? ''}`;
        existing.updatedDate = `${message.sentAtIso ?? existing.updatedDate ?? ''}`;
        promoted += 1;
      } else {
        const created = buildAcceptedActivityMember(
          target.ownerType,
          target.ownerId,
          senderId,
          message.sentAtIso
        );
        activityMembers.push(created);
        recordsByOwnerAndUser.set(key, created);
        added += 1;
      }
      acceptedKeys.add(key);
    }
  }
  return { added, promoted };
}

function buildAcceptedActivityMember(ownerType, ownerId, userId, actionAtIso) {
  const stableKey = `${ownerType}|${ownerId}|${userId}`;
  const timestamp = `${actionAtIso ?? ''}`.trim() || '2026-02-21T09:00:00Z';
  return {
    _id: {
      $oid: createHash('sha256')
        .update(`activity-member:${stableKey}`)
        .digest('hex')
        .slice(0, 24)
    },
    syncKey: stableUuid(`activity-member-sync:${stableKey}`),
    ownerType,
    ownerId,
    userId,
    role: 'Member',
    status: 'accepted',
    pendingSource: null,
    requestKind: null,
    invitedByUserId: null,
    metAtIso: timestamp,
    actionAtIso: timestamp,
    metWhere: 'Event Chat',
    createdDate: timestamp,
    createdUser: userId,
    updatedDate: timestamp,
    updatedUser: userId
  };
}

function syncEventMembershipDocuments(events, activityMembers) {
  const acceptedByEventId = new Map();
  const pendingByEventId = new Map();
  for (const member of activityMembers) {
    if (`${member.ownerType ?? ''}`.trim() !== 'event') {
      continue;
    }
    const eventId = normalizeId(member.ownerId);
    const userId = normalizeId(member.userId);
    if (!eventId || !userId) {
      continue;
    }
    const target = `${member.status ?? ''}`.trim().toLowerCase() === 'accepted'
      ? acceptedByEventId
      : pendingByEventId;
    if (!target.has(eventId)) {
      target.set(eventId, []);
    }
    if (!target.get(eventId).includes(userId)) {
      target.get(eventId).push(userId);
    }
  }

  let repaired = 0;
  for (const event of events) {
    const eventId = normalizeId(event.sourceId);
    const acceptedMemberUserIds = acceptedByEventId.get(eventId) ?? [];
    const pendingMemberUserIds = (pendingByEventId.get(eventId) ?? [])
      .filter(userId => !acceptedMemberUserIds.includes(userId));
    const nextInvited = (event.invitedMemberUserIds ?? [])
      .filter(userId => pendingMemberUserIds.includes(userId));
    const nextPendingRequests = (event.pendingRequestMemberUserIds ?? [])
      .filter(userId => pendingMemberUserIds.includes(userId));
    const changed = !sameStringArray(event.acceptedMemberUserIds, acceptedMemberUserIds)
      || !sameStringArray(event.pendingMemberUserIds, pendingMemberUserIds)
      || !sameStringArray(event.invitedMemberUserIds, nextInvited)
      || !sameStringArray(event.pendingRequestMemberUserIds, nextPendingRequests)
      || Number(event.acceptedMembers) !== acceptedMemberUserIds.length
      || Number(event.pendingMembers) !== pendingMemberUserIds.length;
    if (!changed) {
      continue;
    }
    event.acceptedMemberUserIds = acceptedMemberUserIds;
    event.pendingMemberUserIds = pendingMemberUserIds;
    event.invitedMemberUserIds = nextInvited;
    event.pendingRequestMemberUserIds = nextPendingRequests;
    event.acceptedMembers = acceptedMemberUserIds.length;
    event.pendingMembers = pendingMemberUserIds.length;
    event.capacityTotal = Math.max(
      Number(event.capacityTotal) || 0,
      acceptedMemberUserIds.length + pendingMemberUserIds.length
    );
    repaired += 1;
  }
  return repaired;
}

function normalizeChats(
  chats,
  messagesByChatId,
  latestMessageByChatId,
  acceptedMemberIdsByOwner
) {
  const existingByChatAndOwner = new Map();
  const baseByChatId = new Map();
  const retained = [];
  let removedOwnerCopies = 0;
  let addedOwnerCopies = 0;
  let repairedChatSummaries = 0;
  let repairedChatMemberLists = 0;

  for (const chat of chats) {
    const ownerType = CHANNEL_OWNER_TYPES.get(chat.channelType);
    const chatId = normalizeId(chat.id);
    const ownerId = normalizeId(chat.ownerId);
    if (!ownerType || !chatId || !ownerId) {
      retained.push(normalizeChatSummary(chat, messagesByChatId, latestMessageByChatId));
      continue;
    }

    baseByChatId.set(chatId, baseByChatId.get(chatId) ?? chat);
    const acceptedMemberIds = acceptedMemberIdsByOwner.get(ownerKey(ownerType, ownerId)) ?? [];
    const ownerUserId = normalizeId(chat.ownerUserId);
    if (!acceptedMemberIds.includes(ownerUserId)) {
      removedOwnerCopies += 1;
      continue;
    }

    const copyKey = chatOwnerKey(chatId, ownerUserId);
    if (existingByChatAndOwner.has(copyKey)) {
      removedOwnerCopies += 1;
      continue;
    }
    existingByChatAndOwner.set(copyKey, chat);
    const normalized = normalizeScopedChat(
      chat,
      ownerUserId,
      acceptedMemberIds,
      messagesByChatId,
      latestMessageByChatId
    );
    if (!sameStringArray(chat.memberIds, normalized.memberIds)) {
      repairedChatMemberLists += 1;
    }
    if (!sameChatSummary(chat, normalized)) {
      repairedChatSummaries += 1;
    }
    retained.push(normalized);
  }

  for (const [chatId, base] of baseByChatId) {
    const ownerType = CHANNEL_OWNER_TYPES.get(base.channelType);
    const acceptedMemberIds = acceptedMemberIdsByOwner.get(
      ownerKey(ownerType, normalizeId(base.ownerId))
    ) ?? [];
    for (const ownerUserId of acceptedMemberIds) {
      const copyKey = chatOwnerKey(chatId, ownerUserId);
      if (existingByChatAndOwner.has(copyKey)) {
        continue;
      }
      const clone = {
        ...base,
        _id: stableMongoId(ownerUserId, chatId),
        ownerUserId
      };
      retained.push(normalizeScopedChat(
        clone,
        ownerUserId,
        acceptedMemberIds,
        messagesByChatId,
        latestMessageByChatId
      ));
      existingByChatAndOwner.set(copyKey, clone);
      addedOwnerCopies += 1;
    }
  }

  return {
    items: retained,
    removedOwnerCopies,
    addedOwnerCopies,
    repairedChatSummaries,
    repairedChatMemberLists
  };
}

function normalizeScopedChat(
  chat,
  ownerUserId,
  acceptedMemberIds,
  messagesByChatId,
  latestMessageByChatId
) {
  const memberIds = [
    ownerUserId,
    ...acceptedMemberIds.filter(userId => userId !== ownerUserId)
  ];
  const messages = messagesByChatId.get(normalizeId(chat.id)) ?? [];
  const unread = messages.filter(message => {
    const senderId = normalizeId(message.senderAvatar?.id);
    const readByUserIds = (message.readBy ?? []).map(reader => normalizeId(reader.id));
    return senderId && senderId !== ownerUserId && !readByUserIds.includes(ownerUserId);
  }).length;
  return normalizeChatSummary(
    { ...chat, ownerUserId, memberIds, unread },
    messagesByChatId,
    latestMessageByChatId
  );
}

function normalizeChatSummary(chat, messagesByChatId, latestMessageByChatId) {
  const chatId = normalizeId(chat.id);
  const latest = latestMessageByChatId.get(chatId);
  if (!latest) {
    return chat;
  }
  return {
    ...chat,
    lastMessage: `${latest.text ?? ''}`,
    lastSenderId: normalizeId(latest.senderAvatar?.id),
    dateIso: `${latest.sentAtIso ?? chat.dateIso ?? ''}`
  };
}

function groupMessagesByChatId(messages) {
  const result = new Map();
  for (const message of messages) {
    const chatId = normalizeId(message.chatId);
    if (!chatId) {
      continue;
    }
    if (!result.has(chatId)) {
      result.set(chatId, []);
    }
    result.get(chatId).push(message);
  }
  return result;
}

function latestMessagesByChatId(messagesByChatId) {
  const result = new Map();
  for (const [chatId, messages] of messagesByChatId) {
    const latest = [...messages].sort((left, right) =>
      `${right.sentAtIso ?? ''}`.localeCompare(`${left.sentAtIso ?? ''}`)
      || normalizeId(right.id).localeCompare(normalizeId(left.id))
    )[0];
    if (latest) {
      result.set(chatId, latest);
    }
  }
  return result;
}

function sameChatSummary(left, right) {
  return `${left.lastMessage ?? ''}` === `${right.lastMessage ?? ''}`
    && normalizeId(left.lastSenderId) === normalizeId(right.lastSenderId)
    && `${left.dateIso ?? ''}` === `${right.dateIso ?? ''}`;
}

function sameStringArray(left, right) {
  const leftValues = (left ?? []).map(normalizeId);
  const rightValues = (right ?? []).map(normalizeId);
  return leftValues.length === rightValues.length
    && leftValues.every((value, index) => value === rightValues[index]);
}

function stableMongoId(ownerUserId, chatId) {
  return createHash('sha256')
    .update(`chat-owner-copy:${ownerUserId}|${chatId}`)
    .digest('hex')
    .slice(0, 24);
}

function stableUuid(value) {
  const bytes = createHash('sha256').update(value).digest('hex').slice(0, 32).split('');
  bytes[12] = '5';
  bytes[16] = ['8', '9', 'a', 'b'][Number.parseInt(bytes[16], 16) % 4];
  const hex = bytes.join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function initialsFromName(name) {
  return `${name ?? ''}`
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'CH';
}

function ownerKey(ownerType, ownerId) {
  return `${ownerType}${KEY_SEPARATOR}${ownerId}`;
}

function chatOwnerKey(chatId, ownerUserId) {
  return `${chatId}${KEY_SEPARATOR}${ownerUserId}`;
}

function activityMemberKey(ownerType, ownerId, userId) {
  return [ownerType, ownerId, userId].map(normalizeId).join(KEY_SEPARATOR);
}

function normalizeId(value) {
  return `${value ?? ''}`.trim();
}

function normalizeName(value) {
  return `${value ?? ''}`.trim().toLocaleLowerCase('en-US');
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}
