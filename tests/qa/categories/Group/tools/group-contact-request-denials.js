// Delegated Group block 12: only rejected/idempotent commands against a UI-created pending request.
(async () => {
  const alex = 'af0436815ab38f4864dd1e24';
  const milo = 'eb1ca0b761885bb0763e2929';
  const session = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  const actor = session?.userId;
  if (location.hostname !== 'localhost' || session?.kind !== 'demo' || ![alex, milo].includes(actor))
    throw Error('Configured managed Alex/Milo session required');
  const peer = actor === alex ? milo : alex;
  const headers = { 'Content-Type': 'application/json', 'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': actor, 'X-App-Session-Id': session.sessionId };
  const read = async () => {
    const r = await fetch('/api/navigator/contacts/chat-access', { headers });
    if (!r.ok) throw Error(`Consent read failed: ${r.status}`);
    return r.json();
  };
  const before = await read();
  const record = before.records.find(r => r.contact.userId === peer);
  if (record?.status !== 'pending' || record.requestedBy !== alex)
    throw Error('UI-created Alex-to-Milo pending baseline required');
  const cases = actor === alex
    ? [['requester-approve', peer, 'approve', record.version, 403],
       ['requester-reject', peer, 'reject', record.version, 403],
       ['duplicate-request', peer, 'request', record.version, 200],
       ['foreign-workspace', 'group:seed-community-language-lab:b29df68956f3fe15e04558de', 'request', null, 404]]
    : [['stale-approve', peer, 'approve', record.version - 1, 409],
       ['stale-reject', peer, 'reject', record.version - 1, 409]];
  const results = [];
  for (const [name, target, action, version, expected] of cases) {
    const r = await fetch(`/api/navigator/contacts/${encodeURIComponent(target)}/chat-access`, {
      method: 'PUT', headers, body: JSON.stringify({ action, version })
    });
    results.push({ name, status: r.status });
    if (r.status !== expected) throw Error(`${name}: expected ${expected}, got ${r.status}`);
  }
  const deniedChat = await fetch('/api/activities/chats/contact', {
    method: 'POST', headers, body: JSON.stringify({ targetUserId: peer })
  });
  // The recipient has not saved the requester yet: the existing contact guard runs first.
  const expectedChatStatus = actor === alex ? 403 : 404;
  if (deniedChat.status !== expectedChatStatus)
    throw Error(`Unapproved chat: expected ${expectedChatStatus}, got ${deniedChat.status}`);
  results.push({ name: 'unapproved-chat', status: deniedChat.status });
  const after = await read();
  if (JSON.stringify(before) !== JSON.stringify(after)) throw Error('Denied/idempotent commands changed consent snapshot');
  return { actor, results, unchanged: true, pendingCount: after.pendingCount, record };
})()
