// Explicitly delegated Isolation block 2; retained versioned demo login only.
(async () => {
  const session = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  const permittedActors = ['f02809260000000000000001', 'f02809260000000000000003'];
  if (location.hostname !== 'localhost' || session?.kind !== 'demo' || !permittedActors.includes(session.userId))
    throw Error('Own Isolation Alex or outsider managed login required');
  const actor = session.userId;
  const event = 'h1790547269571';
  const headers = {'Content-Type': 'application/json', 'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': actor, 'X-App-Session-Id': session.sessionId};
  const results = [];
  for (const forged of [false, true]) {
    const user = forged ? 'f02809260000000000000011' : actor;
    const suffix = forged ? '&groupId=qa-isolation-a&workspaceGroupId=qa-isolation-a' : '';
    const requestHeaders = forged ? {...headers, 'X-Group-Id': 'qa-isolation-a', 'X-Workspace-Group-Id': 'qa-isolation-a'} : headers;
    const requests = [
      ['detail', 'GET', `/api/activities/events/detail?userId=${user}&eventId=${event}${suffix}`],
      ['event-members', 'GET', `/api/activities/events/members?ownerType=event&ownerId=${event}${suffix}`],
      ['chat', 'GET', `/api/activities/chats/by-id/${event}?userId=${user}${suffix}`],
      ['messages', 'GET', `/api/activities/chats/${event}/messages?userId=${user}&limit=10${suffix}`],
      ['chat-members', 'GET', `/api/activities/chats/${event}/members/page?userId=${user}&limit=10${suffix}`],
      ['unpublish-event', 'POST', `/api/activities/events/unpublish?probe=isolation${suffix}`,
        {userId:user,sourceId:event}],
      ['remove-member', 'POST', `/api/activities/events/members/action?probe=isolation${suffix}`,
        {owner:{ownerType:'event',ownerId:event},actorUserId:user,targetUserId:'f02809260000000000000012',action:'remove'}],
      ['send-message', 'POST', `/api/activities/chats/${event}/messages?userId=${user}${suffix}`,
        {text:'REJECTED Isolation block2 cross-workspace attempt'}]
    ];
    for (const [name, method, path, body] of requests) {
      const response = await fetch(path, {method, headers:requestHeaders, ...(body ? {body:JSON.stringify(body)} : {})});
      const raw = await response.text(); let data = raw;
      try { data = JSON.parse(raw); } catch {}
      results.push({name, forged, method, path, status:response.status,
        body:response.ok ? data : {error:data?.error, message:data?.message}});
    }
  }
  return {at:new Date().toISOString(), actor, event, results};
})()
