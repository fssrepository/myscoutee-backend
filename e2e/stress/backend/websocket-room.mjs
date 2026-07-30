#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const STREAM_KEY = 'activities:chat:messages';
const WRITE_STREAM_KEY = 'activities:chat:writes';

const args = parseArgs(process.argv.slice(2));
const config = resolveConfig(args);

if (args.help) {
  printHelp();
  process.exit(0);
}

if (config.clients > 1000 && !config.force) {
  throw new Error('Refusing to open more than 1000 sockets without --force.');
}
if (config.messages > 500 && !config.force) {
  throw new Error('Refusing to send more than 500 room messages without --force.');
}

const startedAtIso = new Date().toISOString();
const startedAt = performance.now();
const resourceMonitor = config.record ? startResourceMonitor(config) : null;
const sentMessages = [];
const clients = [];
let runError = null;

try {
  if (!config.skipPrepare) {
    await prepareRoom(config);
  }
  await verifyBackendUsesPreparedRoom(config);

  const redisBefore = await redisSnapshot(config);
  const connectSummary = await openClients(config, clients);
  const activeClients = clients.filter(client => client?.openOk && client.ws?.readyState === WebSocket.OPEN);
  if (activeClients.length === 0) {
    throw new Error('No websocket clients opened; cannot send room messages.');
  }
  await sleep(config.warmupMs);
  const sendSummary = await sendRoomMessages(config, activeClients, sentMessages);
  const deliverySummary = await waitForDelivery(config, sentMessages, activeClients);
  const closeSummary = await closeClients(clients, config.closeTimeoutMs);
  const redisAfter = await redisSnapshot(config);
  const finalConnectSummary = summarizeConnects(clients);

  const summary = buildSummary({
    config,
    startedAtIso,
    startedAt,
    connectSummary: finalConnectSummary,
    sendSummary,
    deliverySummary,
    closeSummary,
    redisBefore,
    redisAfter,
    resourceSamples: resourceMonitor?.samples ?? []
  });
  const artifactDir = config.record
    ? await writeArtifacts({
      config,
      summary,
      sentMessages,
      clients,
      resources: resourceMonitor?.samples ?? [],
      startedAtIso,
      endedAtIso: new Date().toISOString(),
      runError: null
    })
    : '';
  printSummary(summary, artifactDir);
  process.exitCode = summary.failed ? 1 : 0;
} catch (error) {
  runError = error;
  const summary = buildSummary({
    config,
    startedAtIso,
    startedAt,
    connectSummary: summarizeConnects(clients),
    sendSummary: summarizeSends(sentMessages),
    deliverySummary: summarizeDelivery(config, sentMessages, clients),
    closeSummary: summarizeCloses(clients),
    redisBefore: null,
    redisAfter: await redisSnapshot(config).catch(() => null),
    resourceSamples: resourceMonitor?.samples ?? [],
    runError
  });
  const artifactDir = config.record
    ? await writeArtifacts({
      config,
      summary,
      sentMessages,
      clients,
      resources: resourceMonitor?.samples ?? [],
      startedAtIso,
      endedAtIso: new Date().toISOString(),
      runError
    })
    : '';
  printSummary(summary, artifactDir);
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
} finally {
  await closeClients(clients, config.closeTimeoutMs).catch(error => {
    console.error(`WebSocket cleanup failed: ${error.message}`);
  });
  await resourceMonitor?.stop();
}

async function prepareRoom(config) {
  const userPrefixRegex = `^${escapeRegex(config.userPrefix)}-`;
  const script = `
const clientCount = ${Number(config.clients)};
const chatId = ${JSON.stringify(config.chatId)};
const userPrefix = ${JSON.stringify(config.userPrefix)};
const userPrefixRegex = ${JSON.stringify(userPrefixRegex)};
const now = new Date().toISOString();
const userIds = Array.from({ length: clientCount }, (_, index) => userPrefix + '-' + String(index + 1).padStart(4, '0'));
db.users.deleteMany({ userId: { $regex: userPrefixRegex } });
db.chats.deleteMany({ id: chatId });
db.chatMessages.deleteMany({ chatId });
db.users.insertMany(userIds.map((userId, index) => ({
  _id: userId,
  userId,
  name: 'WS Room User ' + String(index + 1),
  age: 24 + (index % 30),
  city: 'E2E',
  initials: 'W' + String((index + 1) % 10),
  gender: index % 2 === 0 ? 'woman' : 'man',
  status: 'A',
  profileStatus: 'public',
  completion: 100,
  images: [],
  networkMeasurementExcluded: true,
  networkMeasurementExclusionReason: 'e2e websocket room stress fixture',
  activities: {
    game: 0,
    chats: 1,
    invitations: 0,
    events: 0,
    hosting: 0,
    cars: 0,
    accommodation: 0,
    supplies: 0,
    tickets: 0,
    contacts: 0,
    feedback: 0,
    chat: {
      all: 1,
      event: 0,
      subEvent: 0,
      group: 0,
      service: 0,
      appSupport: 0
    },
    event: {
      all: 0,
      active: 0,
      pending: 0,
      invitations: 0,
      hosting: 0,
      drafts: 0,
      trash: 0
    },
    asset: {
      cars: 0,
      accommodation: 0,
      supplies: 0,
      tickets: 0
    },
    eventFeedback: {
      ownEvents: 0,
      pending: 0,
      feedbacked: 0,
      removed: 0
    },
    adminJobs: 0,
    adminMetrics: 0,
    notifications: 0
  }
})), { ordered: false });
db.chats.insertMany(userIds.map((userId, index) => ({
  _id: chatId + ':' + userId,
  id: chatId,
  ownerUserId: userId,
  avatar: 'WS',
  title: 'E2E websocket room ' + chatId,
  lastMessage: '',
  lastSenderId: '',
  memberIds: userIds,
  unread: 0,
  dateIso: now,
  channelType: 'e2eRoom',
  eventId: '',
  subEventId: '',
  groupId: ''
})), { ordered: false });
printjson({ ok: true, db: db.getName(), chatId, users: userIds.length, ownerCopies: userIds.length });
`;
  const result = await execFileAsync('docker', [
    'exec',
    config.mongoContainer,
    'mongosh',
    '--username',
    config.mongoUsername,
    '--password',
    config.mongoPassword,
    '--authenticationDatabase',
    config.database,
    '--quiet',
    config.database,
    '--eval',
    script
  ], {
    timeout: config.prepareTimeoutMs,
    maxBuffer: 10 * 1024 * 1024
  });
  if (config.verbose) {
    console.log(result.stdout.trim());
  }
}

async function verifyBackendUsesPreparedRoom(config) {
  const userId = userIdAt(config, 0);
  const auth = await httpJson(config, '/api/auth/me', {
    params: { userId },
    headers: demoHeaders()
  });
  if (auth.status !== 200 || auth.data?.id !== userId) {
    throw new Error(
      `Backend did not read prepared websocket room user ${userId}. ` +
      `Start the stack in e2e mode before this destructive simulation.`
    );
  }
  const page = await httpJson(config, '/api/activities/chats/page', {
    params: {
      userId,
      contextFilter: 'all',
      sort: 'date',
      sortDirection: 'desc',
      limit: '5'
    },
    headers: demoHeaders()
  });
  const items = Array.isArray(page.data?.items) ? page.data.items : [];
  if (page.status !== 200 || !items.some(item => item.id === config.chatId)) {
    throw new Error(`Backend could not see prepared room ${config.chatId} for ${userId}.`);
  }
}

async function openClients(config, clients) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(config.connectConcurrency, config.clients) }, async () => {
    while (nextIndex < config.clients) {
      const index = nextIndex;
      nextIndex += 1;
      const client = createClient(config, index);
      clients[index] = client;
      try {
        await openClient(client, config);
      } catch (error) {
        client.errors.push(error.message);
      }
      if ((index + 1) % config.progressEvery === 0) {
        console.log(`opened ${index + 1}/${config.clients} websocket clients`);
      }
    }
  });
  await Promise.all(workers);
  return summarizeConnects(clients);
}

function createClient(config, index) {
  return {
    index,
    userId: userIdAt(config, index),
    url: websocketUrl(config, userIdAt(config, index)),
    ws: null,
    openOk: false,
    openMs: 0,
    closeOk: false,
    closeCode: 0,
    closeReason: '',
    received: 0,
    duplicateFrames: 0,
    seenClientIds: new Map(),
    errors: [],
    socketErrors: []
  };
}

async function openClient(client, config) {
  const started = performance.now();
  const ws = new WebSocket(client.url);
  client.ws = ws;
  ws.addEventListener('message', event => handleSocketMessage(client, event, config));
  ws.addEventListener('error', event => {
    client.errors.push(event?.message || 'WebSocket error');
  });
  ws.addEventListener('close', event => {
    client.closeCode = event.code;
    client.closeReason = event.reason;
    client.closeOk = event.code === 1000 || event.code === 1001;
  });
  await waitForOpen(ws, config.openTimeoutMs);
  client.openOk = true;
  client.openMs = performance.now() - started;
}

function handleSocketMessage(client, event, config) {
  const receivedAt = performance.now();
  let parsed;
  try {
    parsed = JSON.parse(typeof event.data === 'string' ? event.data : Buffer.from(event.data).toString('utf8'));
  } catch (error) {
    client.errors.push(`Invalid JSON frame: ${error.message}`);
    return;
  }

  if (parsed.type === 'error') {
    client.socketErrors.push(parsed);
    return;
  }
  if (parsed.type !== 'message' || !parsed.message?.clientId?.startsWith(config.clientIdPrefix)) {
    return;
  }

  const sent = config.sentByClientId.get(parsed.message.clientId);
  if (!sent) {
    return;
  }

  if (!client.openOk) {
    client.openOk = true;
    client.openMs = client.openMs || 0;
    client.lateOpen = true;
  }
  const firstReceivedAtMs = client.seenClientIds.get(parsed.message.clientId);
  if (firstReceivedAtMs !== undefined) {
    client.duplicateFrames += 1;
    sent.duplicateFrames += 1;
    sent.duplicateLatenciesMs.push(receivedAt - sent.sentAtMs);
    sent.duplicateAfterFirstReceiveMs.push(receivedAt - firstReceivedAtMs);
    return;
  }
  client.seenClientIds.set(parsed.message.clientId, receivedAt);
  client.received += 1;
  sent.received += 1;
  const latencyMs = receivedAt - sent.sentAtMs;
  sent.receiveLatenciesMs.push(latencyMs);
  if (sent.firstReceiveMs === 0 || latencyMs < sent.firstReceiveMs) {
    sent.firstReceiveMs = latencyMs;
  }
  if (latencyMs > sent.lastReceiveMs) {
    sent.lastReceiveMs = latencyMs;
  }
  if (sent.received >= sent.expected && sent.completedAtMs === 0) {
    sent.completedAtMs = receivedAt;
  }
}

async function sendRoomMessages(config, clients, sentMessages) {
  const intervalMs = config.sendRatePerSec > 0 ? 1000 / config.sendRatePerSec : 0;
  for (let index = 0; index < config.messages; index += 1) {
    const sender = clients[index % clients.length];
    const record = {
      index,
      clientId: `${config.clientIdPrefix}-${String(index + 1).padStart(5, '0')}`,
      senderUserId: sender.userId,
      sentAtMs: performance.now(),
      sentAtIso: new Date().toISOString(),
      sendOk: false,
      received: 0,
      duplicateFrames: 0,
      expected: clients.length,
      firstReceiveMs: 0,
      lastReceiveMs: 0,
      completedAtMs: 0,
      receiveLatenciesMs: [],
      duplicateLatenciesMs: [],
      duplicateAfterFirstReceiveMs: [],
      error: ''
    };
    sentMessages.push(record);
    config.sentByClientId.set(record.clientId, record);
    try {
      sender.ws.send(JSON.stringify({
        type: 'message',
        clientId: record.clientId,
        text: `E2E websocket room ${config.runId} message ${index + 1}`
      }));
      record.sendOk = true;
    } catch (error) {
      record.error = error.message;
    }
    if ((index + 1) % config.progressEveryMessages === 0) {
      console.log(`sent ${index + 1}/${config.messages} websocket room messages`);
    }
    if (intervalMs > 0 && index < config.messages - 1) {
      await sleep(intervalMs);
    }
  }
  return summarizeSends(sentMessages);
}

async function waitForDelivery(config, sentMessages, clients) {
  const expected = sentMessages
    .filter(item => item.sendOk)
    .reduce((sum, item) => sum + item.expected, 0);
  const deadline = Date.now() + config.deliveryTimeoutMs;
  while (Date.now() < deadline) {
    const received = sentMessages.reduce((sum, item) => sum + item.received, 0);
    if (received >= expected) {
      break;
    }
    await sleep(100);
  }
  return summarizeDelivery(config, sentMessages, clients);
}

async function closeClients(clients, closeTimeoutMs) {
  for (const client of clients) {
    if (
      client?.ws?.readyState === WebSocket.CONNECTING
      || client?.ws?.readyState === WebSocket.OPEN
    ) {
      try {
        client.ws.close(1000, 'e2e websocket room complete');
      } catch (error) {
        client.errors.push(`WebSocket cleanup failed: ${error.message}`);
      }
    }
  }
  const deadline = Date.now() + closeTimeoutMs;
  while (Date.now() < deadline) {
    if (clients.every(client => !client?.ws || client.ws.readyState === WebSocket.CLOSED || client.closeCode > 0)) {
      break;
    }
    await sleep(50);
  }
  return summarizeCloses(clients);
}

function summarizeConnects(clients) {
  const opens = clients.filter(client => client?.openOk).map(client => client.openMs).sort((a, b) => a - b);
  return {
    attempted: clients.length,
    opened: opens.length,
    failed: clients.filter(client => client && !client.openOk).length,
    p50OpenMs: percentile(opens, 0.50),
    p95OpenMs: percentile(opens, 0.95),
    maxOpenMs: opens[opens.length - 1] ?? 0
  };
}

function summarizeSends(sentMessages) {
  return {
    attempted: sentMessages.length,
    sent: sentMessages.filter(item => item.sendOk).length,
    failed: sentMessages.filter(item => !item.sendOk).length
  };
}

function summarizeDelivery(config, sentMessages, clients) {
  const sent = sentMessages.filter(item => item.sendOk);
  const expected = sent.reduce((sum, item) => sum + item.expected, 0);
  const received = sent.reduce((sum, item) => sum + item.received, 0);
  const duplicateFrames = sent.reduce((sum, item) => sum + item.duplicateFrames, 0);
  const allLatencies = sent.flatMap(item => item.receiveLatenciesMs).sort((a, b) => a - b);
  const duplicateLatencies = sent.flatMap(item => item.duplicateLatenciesMs).sort((a, b) => a - b);
  const duplicateAfterFirstLatencies = sent.flatMap(item => item.duplicateAfterFirstReceiveMs).sort((a, b) => a - b);
  const completeLatencies = sent
    .filter(item => item.completedAtMs > 0)
    .map(item => item.completedAtMs - item.sentAtMs)
    .sort((a, b) => a - b);
  const slowestMessages = [...sent]
    .sort((left, right) => (right.lastReceiveMs || 0) - (left.lastReceiveMs || 0))
    .slice(0, 10)
    .map(item => ({
      clientId: item.clientId,
      received: item.received,
      expected: item.expected,
      firstReceiveMs: item.firstReceiveMs,
      lastReceiveMs: item.lastReceiveMs,
      completeMs: item.completedAtMs > 0 ? item.completedAtMs - item.sentAtMs : 0
    }));
  const clientReceives = clients
    .map(client => client?.received ?? 0)
    .sort((a, b) => a - b);
  return {
    expected,
    received,
    duplicateFrames,
    duplicateLatency: {
      p50Ms: percentile(duplicateLatencies, 0.50),
      p95Ms: percentile(duplicateLatencies, 0.95),
      p99Ms: percentile(duplicateLatencies, 0.99),
      maxMs: duplicateLatencies[duplicateLatencies.length - 1] ?? 0,
      p50AfterFirstReceiveMs: percentile(duplicateAfterFirstLatencies, 0.50),
      p95AfterFirstReceiveMs: percentile(duplicateAfterFirstLatencies, 0.95),
      maxAfterFirstReceiveMs: duplicateAfterFirstLatencies[duplicateAfterFirstLatencies.length - 1] ?? 0
    },
    missing: Math.max(0, expected - received),
    deliveryRatio: expected === 0 ? 0 : received / expected,
    completeMessages: sent.filter(item => item.received >= item.expected).length,
    p50ReceiveMs: percentile(allLatencies, 0.50),
    p95ReceiveMs: percentile(allLatencies, 0.95),
    p99ReceiveMs: percentile(allLatencies, 0.99),
    maxReceiveMs: allLatencies[allLatencies.length - 1] ?? 0,
    p50CompleteFanoutMs: percentile(completeLatencies, 0.50),
    p95CompleteFanoutMs: percentile(completeLatencies, 0.95),
    maxCompleteFanoutMs: completeLatencies[completeLatencies.length - 1] ?? 0,
    minReceivedPerClient: clientReceives[0] ?? 0,
    p50ReceivedPerClient: percentile(clientReceives, 0.50),
    maxReceivedPerClient: clientReceives[clientReceives.length - 1] ?? 0,
    slowestMessages
  };
}

function summarizeCloses(clients) {
  return {
    attempted: clients.length,
    clean: clients.filter(client => client?.closeOk).length,
    dirty: clients.filter(client => client && !client.closeOk).length
  };
}

function buildSummary({
  config,
  startedAtIso,
  startedAt,
  connectSummary,
  sendSummary,
  deliverySummary,
  closeSummary,
  redisBefore,
  redisAfter,
  resourceSamples,
  runError = null
}) {
  const resourceSummary = summarizeResources(resourceSamples);
  const failed = Boolean(runError)
    || connectSummary.failed > 0
    || sendSummary.failed > 0
    || deliverySummary.deliveryRatio < config.minDeliveryRatio
    || clients.some(client => (client?.socketErrors ?? []).length > 0);
  return {
    scenario: {
      id: 'websocket-room',
      runId: config.runId,
      baseUrl: config.baseUrl,
      database: config.database,
      chatId: config.chatId,
      clients: config.clients,
      messages: config.messages,
      sendRatePerSec: config.sendRatePerSec,
      connectConcurrency: config.connectConcurrency,
      warmupMs: config.warmupMs,
      minDeliveryRatio: config.minDeliveryRatio
    },
    startedAtIso,
    endedAtIso: new Date().toISOString(),
    durationMs: performance.now() - startedAt,
    connect: connectSummary,
    send: sendSummary,
    delivery: deliverySummary,
    close: closeSummary,
    redis: {
      before: redisBefore,
      after: redisAfter
    },
    resources: resourceSummary,
    socketErrorCount: clients.reduce((sum, client) => sum + (client?.socketErrors?.length ?? 0), 0),
    duplicateFrameCount: clients.reduce((sum, client) => sum + (client?.duplicateFrames ?? 0), 0),
    failed,
    runError: runError ? { message: runError.message, stack: runError.stack } : null
  };
}

async function writeArtifacts({ config, summary, sentMessages, clients, resources, startedAtIso, endedAtIso, runError }) {
  const rootDir = config.artifactsDir
    ? path.resolve(config.artifactsDir)
    : path.join(repoRoot, '.e2e-artifacts', 'stress', 'backend');
  const runDir = path.join(rootDir, `websocket-room-${startedAtIso.replace(/[:.]/g, '-')}`);
  await mkdir(runDir, { recursive: true });
  await writeFile(path.join(runDir, 'summary.json'), `${JSON.stringify({ ...summary, endedAtIso, runError }, null, 2)}\n`);
  await writeFile(path.join(runDir, 'messages.json'), `${JSON.stringify(sentMessages.map(stripLatencyArray), null, 2)}\n`);
  await writeFile(path.join(runDir, 'clients.json'), `${JSON.stringify(clients.map(stripClient), null, 2)}\n`);
  await writeFile(path.join(runDir, 'resources.json'), `${JSON.stringify(resources, null, 2)}\n`);
  await writeFile(path.join(runDir, 'index.md'), renderIndex(summary));
  return runDir;
}

function renderIndex(summary) {
  const lines = [
    '# WebSocket Room Simulation',
    '',
    `- Run: \`${summary.scenario.runId}\``,
    `- Base URL: \`${summary.scenario.baseUrl}\``,
    `- Database: \`${summary.scenario.database}\``,
    `- Chat: \`${summary.scenario.chatId}\``,
    `- Clients: ${summary.scenario.clients}`,
    `- Warmup: ${summary.scenario.warmupMs}ms`,
    `- Messages sent: ${summary.send.sent}/${summary.send.attempted}`,
    `- Expected deliveries: ${summary.delivery.expected}`,
    `- Received deliveries: ${summary.delivery.received}`,
    `- Duplicate frames ignored: ${summary.delivery.duplicateFrames}`,
    `- Duplicate/replay latency: p50 ${Math.round(summary.delivery.duplicateLatency.p50Ms)}ms, p95 ${Math.round(summary.delivery.duplicateLatency.p95Ms)}ms, max ${Math.round(summary.delivery.duplicateLatency.maxMs)}ms`,
    `- Duplicate after first delivery: p50 ${Math.round(summary.delivery.duplicateLatency.p50AfterFirstReceiveMs)}ms, p95 ${Math.round(summary.delivery.duplicateLatency.p95AfterFirstReceiveMs)}ms, max ${Math.round(summary.delivery.duplicateLatency.maxAfterFirstReceiveMs)}ms`,
    `- Delivery ratio: ${(summary.delivery.deliveryRatio * 100).toFixed(2)}%`,
    `- Receive latency: p50 ${Math.round(summary.delivery.p50ReceiveMs)}ms, p95 ${Math.round(summary.delivery.p95ReceiveMs)}ms, p99 ${Math.round(summary.delivery.p99ReceiveMs)}ms, max ${Math.round(summary.delivery.maxReceiveMs)}ms`,
    `- Full fanout latency: p50 ${Math.round(summary.delivery.p50CompleteFanoutMs)}ms, p95 ${Math.round(summary.delivery.p95CompleteFanoutMs)}ms, max ${Math.round(summary.delivery.maxCompleteFanoutMs)}ms`,
    `- Socket opens: ${summary.connect.opened}/${summary.connect.attempted}, p95 ${Math.round(summary.connect.p95OpenMs)}ms`,
    `- Host memory peak: ${formatBytes(summary.resources.host.maxUsedMemBytes)} used, min free ${formatBytes(summary.resources.host.minFreeMemBytes)}`,
    `- Host load peak: ${summary.resources.host.maxLoadAvg1.toFixed(2)} over ${summary.resources.host.cpuCount} CPUs`,
    '',
    '## Container Peaks',
    '',
    '| Container | Max CPU | Max Memory |',
    '| --- | ---: | ---: |',
    ...summary.resources.containers.map(item => `| ${escapeTable(item.name)} | ${item.maxCpuPercent.toFixed(2)}% | ${formatBytes(item.maxMemBytes)} |`),
    '',
    '## Slowest Messages',
    '',
    '| Client ID | Received | Expected | First | Last | Complete |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...summary.delivery.slowestMessages.map(item => `| ${escapeTable(item.clientId)} | ${item.received} | ${item.expected} | ${Math.round(item.firstReceiveMs)}ms | ${Math.round(item.lastReceiveMs)}ms | ${Math.round(item.completeMs)}ms |`),
    '',
    'Raw files: `summary.json`, `messages.json`, `clients.json`, `resources.json`.',
    ''
  ];
  return `${lines.join('\n')}\n`;
}

function printSummary(summary, artifactDir) {
  console.log('\nwebsocket room simulation');
  console.log(`clients: opened ${summary.connect.opened}/${summary.connect.attempted}, open p95=${Math.round(summary.connect.p95OpenMs)}ms max=${Math.round(summary.connect.maxOpenMs)}ms`);
  console.log(`warmup: ${summary.scenario.warmupMs}ms after client opens`);
  console.log(`messages: sent ${summary.send.sent}/${summary.send.attempted}, complete fanout ${summary.delivery.completeMessages}/${summary.send.sent}`);
  console.log(`deliveries: ${summary.delivery.received}/${summary.delivery.expected} (${(summary.delivery.deliveryRatio * 100).toFixed(2)}%), missing=${summary.delivery.missing}`);
  console.log(`duplicate frames ignored: ${summary.delivery.duplicateFrames}`);
  console.log(`duplicate/replay latency ms: p50=${Math.round(summary.delivery.duplicateLatency.p50Ms)} p95=${Math.round(summary.delivery.duplicateLatency.p95Ms)} max=${Math.round(summary.delivery.duplicateLatency.maxMs)}`);
  console.log(`duplicate after first delivery ms: p50=${Math.round(summary.delivery.duplicateLatency.p50AfterFirstReceiveMs)} p95=${Math.round(summary.delivery.duplicateLatency.p95AfterFirstReceiveMs)} max=${Math.round(summary.delivery.duplicateLatency.maxAfterFirstReceiveMs)}`);
  console.log(`receive latency ms: p50=${Math.round(summary.delivery.p50ReceiveMs)} p95=${Math.round(summary.delivery.p95ReceiveMs)} p99=${Math.round(summary.delivery.p99ReceiveMs)} max=${Math.round(summary.delivery.maxReceiveMs)}`);
  console.log(`complete fanout ms: p50=${Math.round(summary.delivery.p50CompleteFanoutMs)} p95=${Math.round(summary.delivery.p95CompleteFanoutMs)} max=${Math.round(summary.delivery.maxCompleteFanoutMs)}`);
  console.log(`resources: host max used=${formatBytes(summary.resources.host.maxUsedMemBytes)}, load1 max=${summary.resources.host.maxLoadAvg1.toFixed(2)}`);
  if (summary.redis.after) {
    console.log(`redis event stream xlen before=${summary.redis.before?.xlen ?? 'n/a'} after=${summary.redis.after.xlen}`);
    console.log(`redis write stream xlen before=${summary.redis.before?.writeXlen ?? 'n/a'} after=${summary.redis.after.writeXlen}`);
  }
  if (artifactDir) {
    console.log(`artifacts: ${artifactDir}`);
  }
  if (summary.failed) {
    console.log('result: FAILED thresholds/checks');
  } else {
    console.log('result: passed');
  }
}

async function httpJson(config, pathname, options = {}) {
  const url = new URL(pathname, config.baseUrl);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, `${value}`);
    }
  }
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: options.headers ?? {},
    body: options.json === undefined ? undefined : JSON.stringify(options.json)
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: response.status, data };
}

function websocketUrl(config, userId) {
  const url = new URL('/api/activities/chats/ws', config.baseUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.searchParams.set('chatId', config.chatId);
  url.searchParams.set('userId', userId);
  url.searchParams.set('sessionKind', 'demo');
  return url.toString();
}

async function redisSnapshot(config) {
  try {
    const [eventXlen, writeXlen] = await Promise.all([
      redisXlen(config, STREAM_KEY),
      redisXlen(config, WRITE_STREAM_KEY)
    ]);
    return {
      xlen: eventXlen,
      writeXlen,
      sampledAtIso: new Date().toISOString()
    };
  } catch (error) {
    return {
      error: error.message,
      sampledAtIso: new Date().toISOString()
    };
  }
}

async function redisXlen(config, streamKey) {
  const result = await execFileAsync('docker', [
    'exec',
    config.redisContainer,
    'redis-cli',
    'XLEN',
    streamKey
  ], { timeout: 5000 });
  return Number.parseInt(result.stdout.trim(), 10) || 0;
}

function startResourceMonitor(config) {
  const intervalMs = Math.max(500, config.resourceIntervalMs);
  const samples = [];
  let pending = Promise.resolve();
  let stopped = false;

  async function sample() {
    if (stopped) {
      return;
    }
    const [docker, redis] = await Promise.all([sampleDocker(), redisSnapshot(config)]);
    samples.push({
      sampledAtIso: new Date().toISOString(),
      host: sampleHost(),
      docker,
      redis
    });
  }

  const schedule = () => {
    pending = pending.then(sample).catch(error => {
      samples.push({
        sampledAtIso: new Date().toISOString(),
        host: sampleHost(),
        docker: { error: error.message },
        redis: { error: error.message }
      });
    });
  };
  schedule();
  const timer = setInterval(schedule, intervalMs);

  return {
    samples,
    async stop() {
      stopped = true;
      clearInterval(timer);
      await pending;
    }
  };
}

function sampleHost() {
  const totalMemBytes = os.totalmem();
  const freeMemBytes = os.freemem();
  return {
    totalMemBytes,
    freeMemBytes,
    usedMemBytes: totalMemBytes - freeMemBytes,
    loadAvg: os.loadavg(),
    cpuCount: os.cpus().length,
    uptimeSec: os.uptime()
  };
}

async function sampleDocker() {
  try {
    const result = await execFileAsync('docker', ['stats', '--no-stream', '--format', '{{json .}}'], {
      timeout: 5000,
      maxBuffer: 1024 * 1024
    });
    return result.stdout
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));
  } catch (error) {
    return { error: error.message };
  }
}

function summarizeResources(resources) {
  const hostSummary = {
    cpuCount: 0,
    minFreeMemBytes: Number.POSITIVE_INFINITY,
    maxUsedMemBytes: 0,
    maxLoadAvg1: 0
  };
  const containers = new Map();
  for (const sample of resources) {
    if (sample.host) {
      hostSummary.cpuCount = sample.host.cpuCount ?? hostSummary.cpuCount;
      hostSummary.minFreeMemBytes = Math.min(hostSummary.minFreeMemBytes, sample.host.freeMemBytes ?? Number.POSITIVE_INFINITY);
      hostSummary.maxUsedMemBytes = Math.max(hostSummary.maxUsedMemBytes, sample.host.usedMemBytes ?? 0);
      hostSummary.maxLoadAvg1 = Math.max(hostSummary.maxLoadAvg1, sample.host.loadAvg?.[0] ?? 0);
    }
    if (!Array.isArray(sample.docker)) {
      continue;
    }
    for (const item of sample.docker) {
      const name = item.Name ?? item.NameOrID ?? item.Container ?? item.ID ?? 'unknown';
      const current = containers.get(name) ?? { name, maxCpuPercent: 0, maxMemBytes: 0 };
      current.maxCpuPercent = Math.max(current.maxCpuPercent, parsePercent(item.CPUPerc));
      current.maxMemBytes = Math.max(current.maxMemBytes, parseDockerMemoryBytes(item.MemUsage));
      containers.set(name, current);
    }
  }
  if (!Number.isFinite(hostSummary.minFreeMemBytes)) {
    hostSummary.minFreeMemBytes = 0;
  }
  return {
    host: hostSummary,
    containers: [...containers.values()].sort((left, right) => right.maxMemBytes - left.maxMemBytes)
  };
}

function stripLatencyArray(item) {
  return {
    ...item,
    receiveLatenciesMs: undefined,
    duplicateLatenciesMs: undefined,
    duplicateAfterFirstReceiveMs: undefined,
    receiveLatencyCount: item.receiveLatenciesMs.length,
    p50ReceiveMs: percentile([...item.receiveLatenciesMs].sort((a, b) => a - b), 0.50),
    p95ReceiveMs: percentile([...item.receiveLatenciesMs].sort((a, b) => a - b), 0.95),
    duplicateLatencyCount: item.duplicateLatenciesMs.length,
    p50DuplicateMs: percentile([...item.duplicateLatenciesMs].sort((a, b) => a - b), 0.50),
    p95DuplicateMs: percentile([...item.duplicateLatenciesMs].sort((a, b) => a - b), 0.95),
    p50DuplicateAfterFirstReceiveMs: percentile([...item.duplicateAfterFirstReceiveMs].sort((a, b) => a - b), 0.50),
    p95DuplicateAfterFirstReceiveMs: percentile([...item.duplicateAfterFirstReceiveMs].sort((a, b) => a - b), 0.95)
  };
}

function stripClient(client) {
  return {
    index: client.index,
    userId: client.userId,
    openOk: client.openOk,
    openMs: client.openMs,
    closeOk: client.closeOk,
    closeCode: client.closeCode,
    closeReason: client.closeReason,
    received: client.received,
    duplicateFrames: client.duplicateFrames,
    lateOpen: Boolean(client.lateOpen),
    errors: client.errors,
    socketErrors: client.socketErrors
  };
}

function waitForOpen(ws, timeoutMs) {
  if (ws.readyState === WebSocket.OPEN) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out opening WebSocket after ${timeoutMs}ms`));
    }, timeoutMs);
    const onOpen = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('WebSocket failed before opening'));
    };
    const onClose = event => {
      cleanup();
      reject(new Error(`WebSocket closed before opening: ${event.code} ${event.reason}`.trim()));
    };
    const cleanup = () => {
      clearTimeout(timeout);
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('error', onError);
      ws.removeEventListener('close', onClose);
    };
    ws.addEventListener('open', onOpen);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
  });
}

function resolveConfig(args) {
  const runId = args.runId || compactTimestamp();
  const clients = numberArg(args.clients, process.env.E2E_WS_ROOM_CLIENTS, 500);
  return {
    runId,
    clients,
    messages: numberArg(args.messages, process.env.E2E_WS_ROOM_MESSAGES, 20),
    sendRatePerSec: numberArg(args.sendRate, process.env.E2E_WS_ROOM_SEND_RATE, 2),
    connectConcurrency: numberArg(args.connectConcurrency, process.env.E2E_WS_ROOM_CONNECT_CONCURRENCY, 25),
    baseUrl: args.baseUrl || process.env.E2E_WS_ROOM_BASE_URL || process.env.E2E_STRESS_BASE_URL || 'https://127.0.0.1',
    database: args.database || process.env.E2E_WS_ROOM_DATABASE || process.env.MONGO_E2E_DATABASE || 'e2e_db',
    mongoContainer: args.mongoContainer || process.env.E2E_MONGO_CONTAINER || 'mongodb',
    redisContainer: args.redisContainer || process.env.E2E_REDIS_CONTAINER || 'redis',
    mongoUsername: process.env.E2E_MONGO_USERNAME ?? process.env.MONGO_APP_USERNAME ?? 'guest',
    mongoPassword: process.env.E2E_MONGO_PASSWORD ?? process.env.MONGO_APP_PASSWORD ?? 'guest',
    userPrefix: args.userPrefix || process.env.E2E_WS_ROOM_USER_PREFIX || 'e2e-ws-room-user',
    chatId: args.chatId || process.env.E2E_WS_ROOM_CHAT_ID || 'e2e-ws-room',
    clientIdPrefix: args.clientIdPrefix || process.env.E2E_WS_ROOM_CLIENT_ID_PREFIX || `e2e-ws-room-${runId}`,
    sentByClientId: new Map(),
    openTimeoutMs: numberArg(args.openTimeoutMs, process.env.E2E_WS_ROOM_OPEN_TIMEOUT_MS, 30000),
    deliveryTimeoutMs: numberArg(args.deliveryTimeoutMs, process.env.E2E_WS_ROOM_DELIVERY_TIMEOUT_MS, 60000),
    closeTimeoutMs: numberArg(args.closeTimeoutMs, process.env.E2E_WS_ROOM_CLOSE_TIMEOUT_MS, 5000),
    prepareTimeoutMs: numberArg(args.prepareTimeoutMs, process.env.E2E_WS_ROOM_PREPARE_TIMEOUT_MS, 120000),
    warmupMs: numberArg(args.warmupMs, process.env.E2E_WS_ROOM_WARMUP_MS, 5000),
    minDeliveryRatio: decimalArg(args.minDeliveryRatio, process.env.E2E_WS_ROOM_MIN_DELIVERY_RATIO, 0.98),
    progressEvery: numberArg(args.progressEvery, process.env.E2E_WS_ROOM_PROGRESS_EVERY, 50),
    progressEveryMessages: numberArg(args.progressEveryMessages, process.env.E2E_WS_ROOM_PROGRESS_EVERY_MESSAGES, 5),
    resourceIntervalMs: numberArg(args.resourceIntervalMs, process.env.E2E_STRESS_RESOURCE_INTERVAL_MS, 2000),
    artifactsDir: args.artifactsDir || process.env.E2E_WS_ROOM_ARTIFACTS_DIR || '',
    record: args.record || process.env.E2E_WS_ROOM_RECORD === 'true',
    skipPrepare: args.skipPrepare || process.env.E2E_WS_ROOM_SKIP_PREPARE === 'true',
    verbose: args.verbose,
    force: args.force
  };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--record') {
      args.record = true;
    } else if (arg === '--skip-prepare') {
      args.skipPrepare = true;
    } else if (arg === '--verbose') {
      args.verbose = true;
    } else if (arg === '--force') {
      args.force = true;
    } else if (arg.startsWith('--')) {
      const [key, inlineValue] = arg.slice(2).split('=');
      const value = inlineValue ?? argv[index + 1] ?? '';
      args[toCamelCase(key)] = value;
      if (inlineValue === undefined) {
        index += 1;
      }
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node e2e/stress/backend/websocket-room.mjs --record
  node e2e/stress/backend/websocket-room.mjs --clients 500 --messages 20 --send-rate 2 --record

Requires the backend to run against e2e_db. The script seeds a disposable
room named e2e-ws-room and user ids named e2e-ws-room-user-0001...
The default warmup waits 5000ms after all client sockets report open, because
large handshake batches can still be finishing server-side registration.
`);
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function numberArg(argValue, envValue, fallback) {
  const value = argValue ?? envValue;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function decimalArg(argValue, envValue, fallback) {
  const value = argValue ?? envValue;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function userIdAt(config, index) {
  return `${config.userPrefix}-${String(index + 1).padStart(4, '0')}`;
}

function demoHeaders() {
  return { 'X-App-Session-Kind': 'demo' };
}

function compactTimestamp() {
  return new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
}

function percentile(values, ratio) {
  if (!values.length) {
    return 0;
  }
  const index = Math.min(values.length - 1, Math.ceil(values.length * ratio) - 1);
  return values[index];
}

function parsePercent(value) {
  const parsed = Number.parseFloat(`${value ?? ''}`.replace('%', ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDockerMemoryBytes(value) {
  const firstPart = `${value ?? ''}`.split('/')[0].trim();
  const match = firstPart.match(/^([\d.]+)\s*([kmgtp]?i?b?)$/i);
  if (!match) {
    return 0;
  }
  const amount = Number.parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    b: 1,
    kb: 1000,
    kib: 1024,
    mb: 1000 ** 2,
    mib: 1024 ** 2,
    gb: 1000 ** 3,
    gib: 1024 ** 3,
    tb: 1000 ** 4,
    tib: 1024 ** 4
  };
  return Number.isFinite(amount) ? amount * (multipliers[unit] ?? 1) : 0;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function escapeTable(value) {
  return `${value ?? ''}`.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function escapeRegex(value) {
  return `${value ?? ''}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
}
