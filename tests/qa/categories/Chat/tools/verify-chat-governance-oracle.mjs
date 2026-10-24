#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import WebSocket from '../../../../../frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};

const manifestPath = option('--manifest');
const phase = option('--phase') || 'terminal';
if (!manifestPath || !['baseline', 'terminal'].includes(phase)) {
  fail('Usage: verify-chat-governance-oracle.mjs --manifest FILE [--phase baseline|terminal]');
}

const prefix = 'manual-qa-checkpoint:v1:chat-governance';
const ids = {
  casey: '650000000000000000000061',
  nova: '650000000000000000000062',
  riley: '650000000000000000000063',
  lina: '178e8d0cbe164fa3fede5884',
  sophia: '0216b1ceb256d6f2c89073b8',
  olivia: '25f4744ead36d038064d62c3'
};
const eventId = `${prefix}:event`;
const eventChatId = `${prefix}:event-chat`;
const groupAChatId = `${prefix}:group-a-chat`;
const groupBChatId = `${prefix}:group-b-chat`;
const reportMessageId = `${prefix}:message:report-target`;
const expected = {
  eventAccepted: [ids.casey, ids.nova, ids.riley, ids.olivia].sort(),
  groupAAccepted: [ids.casey, ids.nova, ids.riley].sort(),
  eventPending: [ids.lina],
  groupAPending: [ids.lina],
  names: {
    [ids.casey]: 'Casey Bridge',
    [ids.nova]: 'Nova Social',
    [ids.riley]: 'Riley Outside',
    [ids.olivia]: 'Olivia Turner',
    [ids.lina]: 'Lina Park'
  }
};

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const actors = [ids.casey, ids.nova, ids.riley];
const results = [];
for (const actorUserId of actors) {
  const session = (manifest.sessions ?? []).find(item => `${item.userId ?? ''}`.trim() === actorUserId);
  const port = Number(session?.devToolsPort);
  if (!Number.isInteger(port) || port <= 0) fail(`No live DevTools session for actor '${actorUserId}'.`);
  const target = await localhostTarget(port);
  results.push(await evaluate(target.webSocketDebuggerUrl, actorUserId, phase));
}

const commonChecks = {
  exactActors: results.length === actors.length,
  exactVisibleMemberLists: results.every(result => result.eventMembers.exact && result.groupAMembers.exact),
  acceptedAvatarsPresent: results.every(result => result.eventMembers.imagesPresent && result.groupAMembers.imagesPresent),
  pendingSeparatedFromDefault: results.every(result => result.eventPending.exact && result.groupAPending.exact),
  controlAccessBoundary: results.every(result => result.controls.linaEvent === 404
    && result.controls.linaGroupA === 404
    && result.controls.sophiaEvent === 404
    && result.controls.sophiaGroupA === 404
    && result.controls.oliviaEvent === 200
    && result.controls.oliviaGroupA === 404
    && result.controls.oliviaGroupB === 200),
  expectedChatRows: results.every(result => result.chatRows)
};

if (phase === 'baseline') {
  if (!Object.values(commonChecks).every(Boolean)) {
    fail(`CHAT-GOVERNANCE-001 baseline browser oracle mismatch: ${JSON.stringify({ checks: commonChecks, results })}`);
  }
  console.log(JSON.stringify({ checkpoint: 'CHAT-GOVERNANCE-001', phase, checks: commonChecks, actors: results }, null, 2));
  process.exit(0);
}

const admin = results.find(result => result.actorUserId === ids.casey)?.adminReport ?? null;
const terminalChecks = {
  ...commonChecks,
  exactlyOneRileyReview: admin?.reportedUserCount === 1 && admin?.reportCount === 1,
  exactReporterAndTarget: admin?.reporterUserId === ids.nova
    && admin?.reporterName === 'Nova Social'
    && admin?.targetUserId === ids.riley
    && admin?.handle === 'Riley Outside',
  exactReportContext: admin?.eventId === eventId
    && admin?.eventTitle === 'QA Chat Governance Event'
    && admin?.sourceType === 'chat'
    && admin?.sourceId === reportMessageId
    && admin?.sourceText === 'QA governance report target'
    && admin?.chatId === groupAChatId
    && admin?.messageId === reportMessageId,
  exactReasonAndDetails: admin?.reason === 'Harassment'
    && admin?.details === 'QA governance duplicate report',
  unresolvedIntake: admin?.resolvedAtIso === null
    && admin?.resolvedByAdminUserId === null
    && admin?.warnedAtIso === null
    && admin?.warnedByAdminUserId === null,
  exactControlledHistory: admin?.chatTitle === 'QA Chat Governance · Group A'
    && admin?.historyCount === 3
    && admin?.historyIds?.length === 3
    && admin?.historyIds?.includes(reportMessageId)
    && admin?.reportTargetSenderId === ids.riley
};
if (!Object.values(terminalChecks).every(Boolean)) {
  fail(`CHAT-GOVERNANCE-001 terminal browser oracle mismatch: ${JSON.stringify({ checks: terminalChecks, results })}`);
}
console.log(JSON.stringify({ checkpoint: 'CHAT-GOVERNANCE-001', phase, checks: terminalChecks, actors: results }, null, 2));

async function localhostTarget(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`);
  if (!response.ok) fail(`Chrome DevTools target list returned HTTP ${response.status}.`);
  const targets = await response.json();
  const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(`${item.url ?? ''}`));
  if (!target?.webSocketDebuggerUrl) fail(`No localhost page target found on DevTools port ${port}.`);
  return target;
}

async function evaluate(webSocketUrl, actorUserId, requestedPhase) {
  const expression = `(${browserOracle.toString()})(${JSON.stringify({
    actorUserId,
    requestedPhase,
    ids,
    eventId,
    eventChatId,
    groupAChatId,
    groupBChatId,
    reportMessageId,
    expected
  })})`;
  const result = await cdpCommand(webSocketUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (result.exceptionDetails) {
    fail(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? 'Browser governance oracle failed.');
  }
  return result.result?.value ?? null;
}

async function browserOracle({
  actorUserId,
  requestedPhase,
  ids,
  eventId,
  eventChatId,
  groupAChatId,
  groupBChatId,
  reportMessageId,
  expected
}) {
  const stored = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  if (stored?.kind !== 'demo' || `${stored?.userId ?? ''}`.trim() !== actorUserId) {
    throw new Error('Unexpected authenticated demo actor.');
  }
  const headersFor = userId => ({
    'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': userId,
    ...(userId === actorUserId && stored.sessionId ? { 'X-App-Session-Id': `${stored.sessionId}` } : {})
  });
  const actorHeaders = headersFor(actorUserId);
  const memberPage = async (chatId, pendingOnly = false, headers = actorHeaders) => {
    const search = new URLSearchParams({ userId: headers['X-Demo-User-Id'], limit: '20' });
    if (pendingOnly) search.set('pendingOnly', 'true');
    const response = await fetch(`/api/activities/chats/${encodeURIComponent(chatId)}/members/page?${search}`, { headers });
    const body = response.ok ? await response.json() : null;
    return { status: response.status, body };
  };
  const memberSummary = (result, expectedIds) => {
    const items = result.body?.items ?? [];
    const ids = items.map(item => `${item.id ?? ''}`).sort();
    return {
      status: result.status,
      ids,
      exact: result.status === 200
        && Number(result.body?.total ?? -1) === expectedIds.length
        && JSON.stringify(ids) === JSON.stringify(expectedIds)
        && items.every(item => `${item.status ?? ''}` === (expectedIds.length === 1 ? 'pending' : 'accepted'))
        && items.every(item => `${item.name ?? ''}` === `${expected.names[item.id] ?? ''}`),
      imagesPresent: items.every(item => `${item.imageUrl ?? ''}`.trim().length > 0)
    };
  };

  const [eventMembersResponse, groupAMembersResponse, eventPendingResponse, groupAPendingResponse] = await Promise.all([
    memberPage(eventChatId),
    memberPage(groupAChatId),
    memberPage(eventChatId, true),
    memberPage(groupAChatId, true)
  ]);
  const controls = {};
  for (const [key, userId, chatId] of [
    ['linaEvent', ids.lina, eventChatId],
    ['linaGroupA', ids.lina, groupAChatId],
    ['sophiaEvent', ids.sophia, eventChatId],
    ['sophiaGroupA', ids.sophia, groupAChatId],
    ['oliviaEvent', ids.olivia, eventChatId],
    ['oliviaGroupA', ids.olivia, groupAChatId],
    ['oliviaGroupB', ids.olivia, groupBChatId]
  ]) {
    controls[key] = (await memberPage(chatId, false, headersFor(userId))).status;
  }

  const chatSearch = new URLSearchParams({ userId: actorUserId, limit: '20', contextFilter: 'all', sort: 'date', sortDirection: 'desc' });
  const chatResponse = await fetch(`/api/activities/chats/page?${chatSearch}`, { headers: actorHeaders });
  if (!chatResponse.ok) throw new Error(`Chat list returned HTTP ${chatResponse.status}.`);
  const chatPage = await chatResponse.json();
  const chatIds = (chatPage.items ?? []).map(item => `${item.id ?? ''}`);
  const result = {
    actorUserId,
    eventMembers: memberSummary(eventMembersResponse, expected.eventAccepted),
    groupAMembers: memberSummary(groupAMembersResponse, expected.groupAAccepted),
    eventPending: memberSummary(eventPendingResponse, expected.eventPending),
    groupAPending: memberSummary(groupAPendingResponse, expected.groupAPending),
    controls,
    chatRows: chatIds.includes(eventChatId) && chatIds.includes(groupAChatId),
    adminReport: null
  };

  if (requestedPhase === 'terminal' && actorUserId === ids.casey) {
    const search = new URLSearchParams({ adminUserId: ids.casey, reportsStatus: 'unresolved' });
    const response = await fetch(`/api/admin/dashboard?${search}`, { headers: actorHeaders });
    if (!response.ok) throw new Error(`Admin dashboard returned HTTP ${response.status}.`);
    const dashboard = await response.json();
    const reportedUsers = (dashboard.reportedUsers ?? []).filter(user => `${user.userId ?? ''}` === ids.riley);
    const user = reportedUsers[0] ?? null;
    const reports = (user?.reports ?? []).filter(report => `${report.eventId ?? ''}` === eventId);
    const report = reports[0] ?? null;
    const history = report?.chatMessages ?? [];
    const targetMessage = history.find(message => `${message.id ?? ''}` === reportMessageId);
    result.adminReport = {
      reportedUserCount: reportedUsers.length,
      reportCount: reports.length,
      reporterUserId: report?.reporterUserId ?? null,
      reporterName: report?.reporterName ?? null,
      targetUserId: report?.targetUserId ?? null,
      handle: report?.handle ?? null,
      reason: report?.reason ?? null,
      details: report?.details ?? null,
      eventId: report?.eventId ?? null,
      eventTitle: report?.eventTitle ?? null,
      sourceType: report?.sourceType ?? null,
      sourceId: report?.sourceId ?? null,
      sourceText: report?.sourceText ?? null,
      chatId: report?.chatId ?? null,
      messageId: report?.messageId ?? null,
      chatTitle: report?.chatTitle ?? null,
      warnedAtIso: report?.warnedAtIso ?? null,
      warnedByAdminUserId: report?.warnedByAdminUserId ?? null,
      resolvedAtIso: report?.resolvedAtIso ?? null,
      resolvedByAdminUserId: report?.resolvedByAdminUserId ?? null,
      historyCount: history.length,
      historyIds: history.map(message => `${message.id ?? ''}`).sort(),
      reportTargetSenderId: targetMessage?.senderUserId ?? null
    };
  }
  return result;
}

function cdpCommand(webSocketUrl, method, params) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    socket.addEventListener('open', () => socket.send(JSON.stringify({ id: 1, method, params })));
    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.id !== 1) return;
      socket.close();
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    });
    socket.addEventListener('error', () => reject(new Error('CDP connection failed.')), { once: true });
  });
}

function fail(message) {
  console.error(`verify-chat-governance-oracle: ${message}`);
  process.exit(2);
}
