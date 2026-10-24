// CDP-only development fixture, evaluated in the managed /game page.
// Exercises the compiled stores with deferred native/provider doubles. It never
// submits credentials, writes a profile/preference or claims real FCM delivery.
(async () => {
  const check = (value, message) => { if (!value) throw Error(message); };
  const signal = initial => { let value = initial; const ref = () => value;
    ref.set = next => { value = next; }; ref.update = change => { value = change(value); }; return ref; };
  const defer = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; };
  const tick = () => new Promise(resolve => setTimeout(resolve, 0));
  const component = window.ng?.getComponent(document.querySelector('app-setup-popup'));
  const side = window.ng?.getComponent(document.querySelector('app-side-menu'));
  check(component && side, 'Requires the current managed development /game page');
  const results = [];
  function setupFixture() {
    const calls = [];
    const store = Object.create(Object.getPrototypeOf(component.store));
    const native = defer(), coordinates = defer(), eligibility = defer(), registration = defer();
    Object.assign(store, {
      loggedIn: () => false, generation: 0, completeLogin: null, checkLocation: null, permission: null,
      isOpen: signal(false), locationSelected: signal(false), notificationsSelected: signal(false), notificationsEdited: signal(false),
      locationGranted: signal(false), locationPermission: signal('prompt'), nativePending: signal(false),
      busy: signal(false), error: signal(''),
      actionPending: () => store.busy() || store.nativePending(),
      allowDisabled: () => !store.locationSelected() || store.actionPending(),
      refreshPermissions: async () => {}, i18n: { translate: text => text },
      location: { requestCurrentCoordinates: () => { calls.push('location'); return coordinates.promise; } },
      messaging: { refreshNotificationPermission: () => {}, deviceNotificationsEnabled: () => false, requestEntryPermission: () => { calls.push('notification'); return native.promise; },
        setDeviceNotificationsEnabled: enabled => { calls.push(enabled ? 'registration' : 'unregister'); return enabled ? registration.promise : Promise.resolve(); } },
      pwa: { dismissInstallPrompt() {}, requestNotificationRegistrationForActiveUser: () => {
        calls.push('registration'); return registration.promise;
      } }
    });
    const login = () => store.requestForLogin(() => { calls.push('eligibility'); return eligibility.promise; });
    return { store, calls, native, coordinates, eligibility, registration, login };
  }
  const f = setupFixture(); const loggedIn = f.login();
  await f.store.allow(); check(!f.calls.length, 'Unchecked location must disable Allow');
  f.store.locationSelected.set(true); f.store.notificationsSelected.set(true);
  const allowing = f.store.allow();
  check(f.store.nativePending() && !f.store.busy() && f.store.allowDisabled(), 'Native decision disables without a ring');
  check(f.calls.join() === 'notification', 'Only the first selected native request may start');
  f.native.resolve('granted'); await tick();
  check(f.calls.join() === 'notification,location' && !f.store.busy(), 'Location follows notification before any background work');
  f.coordinates.resolve({ latitude: 30.2672, longitude: -97.7431 }); await tick();
  check(f.store.locationPermission() === 'granted' && f.store.busy() && !f.store.nativePending(), 'Granted location turns green before the background ring');
  f.eligibility.resolve(true); await tick();
  check(f.calls.join() === 'notification,location,eligibility,registration' && f.store.busy(), 'One ring covers the background sequence');
  f.registration.resolve(); await allowing;
  check(await loggedIn && !f.store.isOpen() && !f.store.busy(), 'Background completion continues login and releases the button');
  results.push('selected native sequence / no native ring / background ring / required location');

  const reject = setupFixture(); const deniedLogin = reject.login();
  reject.store.locationSelected.set(true); reject.store.notificationsSelected.set(true);
  const denied = reject.store.allow(); reject.native.resolve('granted'); await tick(); reject.coordinates.resolve(null);
  await denied;
  check(reject.store.isOpen() && reject.store.error() && !reject.store.actionPending(), 'Rejected location keeps the shared popup open for retry');
  check(!reject.calls.includes('eligibility') && !reject.calls.includes('registration'), 'Rejected location forbids every background operation');
  reject.store.close(); check(await deniedLogin === false && !reject.store.isOpen(), 'X closes without approving entry');
  const reopened = reject.login(); check(reject.store.isOpen(), 'Next Login reopens'); reject.store.close(); await reopened;
  results.push('location rejection stops / popup retained / X / repeat Login');

  const cancelled = setupFixture(); const cancelledLogin = cancelled.login();
  cancelled.store.locationSelected.set(true); cancelled.store.notificationsSelected.set(true);
  const cancelledAllow = cancelled.store.allow(); cancelled.store.close();
  check(await cancelledLogin === false && !cancelled.store.isOpen(), 'Normal X closes even while native decision is pending');
  cancelled.native.resolve('granted'); await cancelledAllow;
  check(cancelled.calls.join() === 'notification', 'Closed workflow never advances to location or registration');
  results.push('X during native wait / no late continuation');

  const optional = setupFixture(); const optionalLogin = optional.login();
  optional.store.locationSelected.set(true); optional.store.notificationsSelected.set(true);
  const optionalAllow = optional.store.allow(); optional.native.resolve('denied'); await tick();
  optional.coordinates.resolve({ latitude: 30.2672, longitude: -97.7431 }); await tick(); optional.eligibility.resolve(true);
  await optionalAllow; check(await optionalLogin && !optional.calls.includes('registration'), 'Optional notification rejection must not block location-approved entry or register push');
  results.push('optional notification rejection / no unwanted registration');

  const update = setupFixture(); update.store.loggedIn = () => true; update.store.open();
  update.store.notificationsSelected.set(false); await update.store.allow();
  check(update.calls.join() === 'unregister', 'Signed-in Update disables device registration without re-requesting location');
  results.push('signed-in Update / locked location / device unregister');

  function bellFixture() {
    const store = Object.create(Object.getPrototypeOf(side.notificationCenterStore));
    let permissionRequired = true; const calls = []; const native = defer(), registration = defer();
    Object.assign(store, { generation: 1, pageContextRevision: 0, activeUserIdRef: signal('qa-actor'),
      permissionPromptPending: signal(false), permissionBusy: signal(false),
      permissionActionPending: () => store.permissionPromptPending() || store.permissionBusy(),
      permissionRequired: () => permissionRequired, muted: () => permissionRequired,
      attentionRequestedRef: signal(false), syncMuted() {}, i18n: { translate: text => text },
      messaging: { requestEntryPermission: () => { calls.push('native'); return native.promise.then(decision => { permissionRequired = decision !== 'granted'; }); },
        requestAndRegisterForActiveUser: () => { calls.push('registration'); return registration.promise; } },
      notificationsService: { setMuted: async () => { calls.push('preference'); return { muted: false }; } }
    }); return { store, calls, native, registration };
  }
  const bell = bellFixture(); const unmuting = bell.store.setMuted(false);
  check(bell.store.permissionPromptPending() && !bell.store.permissionBusy(), 'Bell waits for native decision with no ring');
  await bell.store.setMuted(false); check(bell.calls.length === 1, 'A second bell click cannot duplicate the request');
  bell.native.resolve('granted'); await tick(); check(bell.store.permissionBusy() && !bell.store.permissionPromptPending(), 'Bell ring starts only for registration');
  bell.registration.resolve(); await unmuting;
  check(bell.calls.join() === 'native,registration,preference' && !bell.store.permissionActionPending(), 'Bell completes a single registration/preference sequence');
  const blocked = bellFixture(); const blockedRequest = blocked.store.setMuted(false).catch(() => 'blocked');
  blocked.native.resolve('denied'); check(await blockedRequest === 'blocked' && blocked.calls.join() === 'native' && !blocked.store.permissionActionPending(), 'Native rejection stops without a background ring');
  const switched = bellFixture(); const switchedRequest = switched.store.setMuted(false);
  switched.store.generation++; switched.store.activeUserIdRef.set('other-actor'); switched.native.resolve('granted'); await switchedRequest;
  check(switched.calls.join() === 'native', 'Account change during native permission forbids registering the wrong actor');
  results.push('direct bell / native disabled / registration ring / reject / account switch');
  // Device opt-out persistence must be checked through the normal UI or an
  // isolated unit-test environment, never by replacing Storage on the live page.
  return { passed: results, standalone: matchMedia('(display-mode: standalone)').matches,
    boundary: 'compiled workflow contracts, controlled native/provider doubles; real push delivery remains separate' };
})()
