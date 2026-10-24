// Rejected-request contract checks for the versioned Group block-10 fixture.
// Run with new-features-cdp.mjs GROUP-LIFECYCLE-001-CASH <actor> eval <this file>.
// Uses the existing managed login. Never edits browser stores or Mongo data.
// UI-created receipts are prerequisites; no successful domain mutation is expected.
(async () => {
  const recipient = 'af0436815ab38f4864dd1e24';
  const payer = 'eb1ca0b761885bb0763e2929';
  const unrelated = 'admin-demo-ava';
  const session = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  if (location.hostname !== 'localhost' || session?.kind !== 'demo'
      || ![recipient, payer, unrelated].includes(session.userId) || !session.sessionId) {
    throw Error('The configured Group cash QA login is required');
  }
  const headers = { 'Content-Type': 'application/json', 'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': session.userId, 'X-App-Session-Id': session.sessionId };
  const path = '/api/payment-methods/history';
  const read = async () => {
    const response = await fetch(`${path}?userId=${session.userId}&page=0&size=50`, { headers });
    if (!response.ok) throw Error(`History precondition failed: ${response.status}`);
    return response.json();
  };
  const before = await read();
  const receipt = before.items.find(item => item.fulfillmentKind === 'cash-receipt'
    && item.auditKind === 'payment' && item.note === 'QA block 10 cash live refund');
  if (!receipt && session.userId !== unrelated) throw Error('Create the configured receipt through the UI first');
  const results = [];
  const deny = async (name, method, route, expected, body) => {
    const response = await fetch(`${route}?userId=${session.userId}`, {
      method, headers, ...(body ? { body: JSON.stringify(body) } : {})
    });
    results.push({ name, status: response.status, expected });
    if (response.status !== expected) throw Error(`${name}: expected ${expected}, got ${response.status}; retain fixture for diagnosis`);
  };
  const invalidReceipt = { requestId: crypto.randomUUID(), payerUserId: payer, amount: 1, currency: 'EUR', note: 'QA denied request' };
  if (session.userId === unrelated) {
    // Existing, UI-created primary receipt, independently verified in
    // GROUP-LIFECYCLE-001-block10-cash-20260927.json validAttributionReplay.
    // A future fixture reset requires a new verified reference, never a made-up ID.
    const retainedReceiptId = 'cash:af0436815ab38f4864dd1e24:3358188f-eb6b-4576-8cd2-10186aa4a4a9';
    await deny('unrelated-user-cannot-delete-recipient-receipt', 'DELETE', `${path}/cash/${encodeURIComponent(retainedReceiptId)}`, 404);
  } else if (session.userId === recipient) {
    await deny('self-payment', 'POST', `${path}/cash`, 400, { ...invalidReceipt, payerUserId: recipient });
    await deny('zero-amount', 'POST', `${path}/cash`, 400, { ...invalidReceipt, amount: 0 });
    await deny('negative-amount', 'POST', `${path}/cash`, 400, { ...invalidReceipt, amount: -1 });
    await deny('foreign-workspace-payer', 'POST', `${path}/cash`, 404, {
      ...invalidReceipt, payerUserId: 'group:seed-community-language-lab:b29df68956f3fe15e04558de'
    });
    const checkout = before.items.find(item => item.auditKind === 'payment' && item.sourceId === 'f02709270000000000000102');
    if (!checkout) throw Error('Complete the card checkout control before this denial check');
    await deny('checkout-is-not-a-manual-receipt', 'DELETE', `${path}/cash/${encodeURIComponent(checkout.id)}`, 404);
    const deleted = before.items.find(item => item.status === 'deleted' && item.note === 'QA block 10 delete retry');
    if (!deleted) throw Error('Delete the configured second receipt through the UI first');
    await deny('create-replay-after-deletion', 'POST', `${path}/cash`, 409, {
      requestId: deleted.id.slice(`cash:${recipient}:`.length), payerUserId: payer,
      amount: deleted.amount, currency: deleted.currency, note: deleted.note
    });
  } else {
    await deny('payer-cannot-delete-recipient-receipt', 'DELETE', `${path}/cash/${encodeURIComponent(receipt.id)}`, 404);
    const deleted = before.items.find(item => item.status === 'deleted' && item.note === 'QA block 10 delete retry');
    if (!deleted) throw Error('Wait for the deleted receipt to reach payer history');
    await deny('deleted-receipt-refund', 'POST', `${path}/${encodeURIComponent(deleted.id)}/refund-request`, 409, {});
  }
  const after = await read();
  const state = page => JSON.stringify({ items: page.items, total: page.total,
    income: page.incomeTotals, spending: page.spendingTotals, pending: page.pendingRefundCount });
  if (state(before) !== state(after)) throw Error('A rejected request changed payment history or totals');
  return { actor: session.userId === unrelated ? 'unrelated' : session.userId === recipient ? 'recipient' : 'payer', results, historyAndTotalsUnchanged: true };
})()
