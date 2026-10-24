// Block 11 rejected requests only; existing versioned managed Alex login and UI-created chat required.
(async () => {
  const actor = 'af0436815ab38f4864dd1e24';
  const peer = 'eb1ca0b761885bb0763e2929';
  const session = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  if (location.hostname !== 'localhost' || session?.kind !== 'demo' || session.userId !== actor)
    throw Error('Configured managed Alex login required');
  const chatId = 'c-contact-' + btoa([actor, peer].sort().join('\n')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const headers = {'Content-Type':'application/json','X-App-Session-Kind':'demo','X-Demo-User-Id':actor,'X-App-Session-Id':session.sessionId};
  const read = async () => {
    const r = await fetch(`/api/activities/chats/by-id/${chatId}?userId=${actor}`, {headers});
    if (!r.ok) throw Error(`Existing chat required: ${r.status}`);
    const c = await r.json();
    return {id:c.id, memberIds:[...c.memberIds].sort(), revision:c.revision};
  };
  const before = await read();
  if (before.memberIds.length !== 2) throw Error('Use the two-member consent replay baseline');
  const results = [];
  for (const [name,userIds,expected] of [
    ['saved-without-approval', ['f6f22ba0a6f14cfcf4585d47'], 403],
    ['saved-without-approval-batch', ['f6f22ba0a6f14cfcf4585d47','9184901a15076d32ea8b626f'], 403],
    ['non-contact',['1b1c70be2349b3359a8f6f94'],404],
    ['foreign-workspace',['group:seed-community-language-lab:b29df68956f3fe15e04558de'],404]
  ]) {
    const r = await fetch(`/api/activities/chats/${chatId}/members?userId=${actor}`, {
      method:'POST',headers,body:JSON.stringify({userIds})
    });
    results.push({name,status:r.status});
    if (r.status !== expected) throw Error(`${name}: expected${expected}, got${r.status}; retain fixture`);
  }
  const after = await read();
  if (JSON.stringify(before)!==JSON.stringify(after)) throw Error('Rejected invitation changed membership/revision');
  return {results,before,after,unchanged:true};
})()
