// Run in the already compiled application via the QA CDP fixture. No app hook,
// token, permission override, or additional compiler. Disposable local users only.
(async () => {
  const service = ng.getComponent(document.querySelector('app-setup-popup')).store.messaging.deviceRegistrations.local;
  const db = service.repository.memoryDb;
  await db.whenReady();
  const a = 'qa-device-registration-a', b = 'qa-device-registration-b';
  const before = db.read().users;
  if (before.byId[a] || before.byId[b]) throw Error('Disposable device fixture already exists');
  const assert = (value, message) => { if (!value) throw Error(message); };
  const persistedUsers = async () => {
    const connection = await db.openIndexedDb(true);
    try {
      return await new Promise((resolve, reject) => {
        const request = connection.transaction('tables').objectStore('tables').get('users');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally { connection.close(); }
  };
  const request = { userId: a, deviceId: 'qa-browser-device', platform: 'web-browser', notificationsEnabled: true };
  try {
    db.write(state => ({ ...state, users: { byId: { ...state.users.byId,
      [a]: { id: a, name: 'Device fixture A' }, [b]: { id: b, name: 'Device fixture B' }
    }, ids: [...state.users.ids, a, b] } }));
    await service.upsert(request);
    const first = (await persistedUsers()).byId[a].devices;
    assert(first.length === 1 && !('firebaseToken' in first[0]), 'Persist one local registration without a fabricated provider token');
    await service.upsert(request);
    assert((await persistedUsers()).byId[a].devices.length === 1, 'Repeated registration must be idempotent');
    await service.upsert({ ...request, deviceId: 'qa-second-device' });
    await service.upsert({ ...request, userId: b });
    let saved = await persistedUsers();
    assert(saved.byId[a].devices.length === 1 && saved.byId[a].devices[0].deviceId === 'qa-second-device'
      && saved.byId[b].devices[0].deviceId === request.deviceId, 'Account switch transfers only the current browser device');
    await service.remove({ userId: a, deviceId: request.deviceId });
    assert((await persistedUsers()).byId[b].devices.length === 1, 'A different account cannot remove the registration');
    await service.remove({ userId: b, deviceId: request.deviceId });
    await service.remove({ userId: b, deviceId: request.deviceId });
    saved = await persistedUsers();
    assert(saved.byId[b].devices.length === 0 && saved.byId[a].devices.length === 1, 'Device opt-out persists and preserves other devices');
    let rejected = false;
    try { await service.upsert({ ...request, userId: 'qa-missing-user' }); } catch { rejected = true; }
    assert(rejected, 'Do not silently register a nonexistent actor');
    return { passed: 6, persistence: 'actual local service/repository and fresh IndexedDB reads',
      delayMs: service.routeDelayService.resolveDelayMs('/activities/chats/devices'),
      limitation: 'Local adapter invoked from the running HTTP deployment; no real Firebase delivery asserted.' };
  } finally {
    db.write(state => {
      const byId = { ...state.users.byId }; delete byId[a]; delete byId[b];
      return { ...state, users: { ...state.users, byId, ids: state.users.ids.filter(id => id !== a && id !== b) } };
    });
    await db.flushToIndexedDb();
  }
})()
