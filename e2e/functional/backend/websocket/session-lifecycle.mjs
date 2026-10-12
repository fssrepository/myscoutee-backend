import assert from 'node:assert/strict';
import { nativeDemoSessions } from '../../../shared/native-demo-sessions.mjs';
import { connectWebSocket, toWebSocketUrl } from '../../../shared/websocket.mjs';

// The collection's short handshake probe cannot qualify a persistent socket.
// Reuse native session ownership, existing demo chats and the public protocol;
// this probe creates no users, messages or call rooms and never resets a DB.
const base = process.env.E2E_SERVER_BASE_URL ?? 'http://localhost:18080';
const sessions = nativeDemoSessions(base);
const delegated = process.env.E2E_SOCKET_DELEGATED_AUTH !== 'false';
let socket;
let sessionsClosed = false;
const messages = [];
async function waitFor(predicate, label, timeout = 10000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw Error('Timed out: ' + label);
}
async function headers(actor) {
  return sessions.headersForRequest('GET', base + '/api/auth/me', {
    headers: {'X-App-Session-Kind':'demo','X-Demo-User-Id':actor}
  });
}
async function get(path, auth = {}) {
  const response = await fetch(base + '/api' + path, {headers:auth});
  assert.equal(response.status, 200, path.split('?')[0]);
  return response.json();
}
try {
  const actor = process.env.E2E_USER_ID ?? (await get('/auth/demo-users'))[0].id;
  const auth = await headers(actor);
  const chats = await get('/activities/chats?userId=' + encodeURIComponent(actor), auth);
  assert(Array.isArray(chats), 'Native chat list is an array');
  const chatId = process.env.E2E_CHAT_ID ?? chats[0]?.id;
  assert(chatId, 'Existing demo chat required');
  const params = {chatId,userId:actor,sessionKind:'demo',sessionId:auth['X-App-Session-Id']};
  socket = new WebSocket(toWebSocketUrl(base, '/api/activities/chats/ws', params));
  let closed = null;
  socket.addEventListener('message', event => messages.push(JSON.parse(event.data)));
  socket.addEventListener('error', () => {});
  socket.addEventListener('close', event => { closed = event.code; });
  await waitFor(() => socket.readyState === WebSocket.OPEN, 'socket open');
  async function configuration() {
    const before = messages.filter(m => m.kind === 'configuration').length;
    socket.send(JSON.stringify({type:'call',call:{action:'configuration'}}));
    await waitFor(() => messages.filter(m => m.kind === 'configuration').length > before, 'authorized configuration');
    assert.equal(messages.at(-1).kind, 'configuration');
    assert.equal(messages.at(-1).available, true);
  }
  await configuration();
  if (delegated) await new Promise(resolve => setTimeout(resolve, 35000));
  await configuration();
  assert.equal(socket.readyState, WebSocket.OPEN, 'Original socket survives grant renewal');
  if (process.env.E2E_ADMIN_USER_ID) {
    const admin = process.env.E2E_ADMIN_USER_ID, adminAuth = await headers(admin);
    const result = await connectWebSocket(toWebSocketUrl(base, '/api/admin/notifications/ws', {
      userId:admin,adminUserId:admin,sessionKind:'demo',sessionId:adminAuth['X-App-Session-Id']
    }));
    assert.equal(result.status, 101);
    assert.equal(result.error, null);
    assert.equal(result.closed?.code, 1000);
  }
  await sessions.close();
  sessionsClosed = true;
  // Revocation is enforced at the next bounded grant renewal, never by
  // accepting an expired actor or extending the original signed grant.
  if (delegated) {
    await new Promise(resolve => setTimeout(resolve, 35000));
    socket.send(JSON.stringify({type:'call',call:{action:'configuration'}}));
    await waitFor(() => closed !== null, 'revoked session closes socket');
    assert.equal(closed, 1008);
  }
  assert(!messages.some(m => m.kind === 'error'), 'No business-message authorization failure before revocation');
  console.log(JSON.stringify({result:'PASS',originalSocketRenewed:delegated,revocationCloseCode:closed,
    adminSocket:!!process.env.E2E_ADMIN_USER_ID,ownedSessionsRevoked:true}));
} finally {
  socket?.close();
  if (!sessionsClosed) await sessions.close();
}
