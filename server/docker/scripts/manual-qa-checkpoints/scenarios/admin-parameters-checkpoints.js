/* global ManualQa, process */
(() => {
  const Q = ManualQa, scenario = 'admin-parameters', checkpointId = 'ADMIN-PARAMETERS-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const backups = Q.collection('manualQaParameterSnapshots');
  const activeConfig = () => Q.collection('affinityConfigs').find({active: true}).sort({version: -1}).limit(1).toArray()[0];
  const pending = () => Q.collection('affinityRecomputeTasks').countDocuments({status: {$in: ['pending', 'running']}});
  const actors = ['admin-demo-ava', '650000000000000000000061'];
  const distancePrefix = 'manual-qa-parameters-distance:';
  const distanceUsers = new RegExp(`^${distancePrefix}`);
  const deliveryPrefix = 'manual-qa-parameters-delivery:';
  const deliveryChatId = `${deliveryPrefix}chat`;
  function removeDistanceInputs() {
    Q.collection('userRates').deleteMany({ownerUserId: distanceUsers});
    Q.collection('userAffinityEdges').deleteMany({$or: [{leftUserId: distanceUsers}, {rightUserId: distanceUsers}]});
    Q.collection('users').deleteMany({userId: distanceUsers});
  }
  const fields = [
    {section: 'matching', path: 'evidence.met.multiplier', field: 'evidence.met', value: 1},
    {section: 'profile', path: 'absolute.user.age.multiplier', field: 'absolute.user.age', value: 18},
    {section: 'events', path: 'boost.event.acceptedMembers.multiplier', field: 'boost.event.acceptedMembers', value: 20},
    {section: 'assets', path: 'boost.asset.quantity.multiplier', field: 'boost.asset.quantity', value: 12},
    {section: 'discovery', path: 'distance.maxMeters', field: 'distance.maxMeters', value: 25000},
    {section: 'notifications', path: 'notifications.multicastThreshold', field: 'notifications.multicastThreshold', value: 2},
    {section: 'jobs', path: 'jobs.userChangedDebounceSeconds', field: 'jobs.userChangedDebounceSeconds', value: 12}
  ];
  const valueAt = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
  function restoreConsumerInputs(state) {
    for (const input of state.consumerInputs || []) {
      const update = input.hadPublished ? {$set: {published: input.published}} : {$unset: {published: ''}};
      if (Q.collection('events').updateOne({_id: input.id}, update).matchedCount !== 1) Q.fail('Missing prepared Event');
    }
  }
  const derivedFields = {users: ['affinity'], userRates: ['affinityScore', 'evidenceConfidence', 'mutuallyRated', 'scoreReceived'],
    events: ['affinity', 'boost'], assets: ['affinity', 'boost']};
  function restoreDerived(snapshot) {
    const fields = derivedFields[snapshot.collection];
    for (const document of snapshot.documents) {
      const set = {}, unset = {};
      for (const field of fields) {
        if (Object.prototype.hasOwnProperty.call(document, field)) set[field] = document[field];
        else unset[field] = '';
      }
      const update = {};
      if (Object.keys(set).length) update.$set = set;
      if (Object.keys(unset).length) update.$unset = unset;
      if (Q.collection(snapshot.collection).updateOne({_id: document._id}, update).matchedCount !== 1) Q.fail(`Missing control: ${snapshot.collection}/${document._id}`);
    }
  }
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Wrong Parameters checkpoint');
  if (command === 'stage') {
    Q.assertNotStaged(scenario); Q.assertNoOtherActiveScenario(scenario);
    if (backups.countDocuments({}) || Q.collection('adminJobFixtureSnapshots').countDocuments({}) || pending()) Q.fail('Resolve retained fixtures or pending recompute first');
    actors.forEach(id => Q.ensureUser(id));
    const config = activeConfig();
    if (!config) Q.fail('Active parameter configuration required');
    const rule = Q.assertRuleNotRunning('affinity-graph-layout');
    Q.collection(Q.STATE_COLLECTION).insertOne({_id: Q.stateId(scenario), scenario, checkpointId,
      phase: 'staging', stagedAtIso: Q.nowIso(), originalConfig: config,
      originalRule: Q.ruleConfigSnapshot(rule), captures: []});
    // Separate collection snapshots keep the historical graph below Mongo's
    // per-document size limit and retain the full rollback boundary.
    const specs = ['users', 'userRates', 'userAffinityEdges', 'events', 'assets',
      'affinityRecomputeTasks', 'adminAffinityGraphLayouts', 'adminAffinityGraphNodes',
      'adminAffinityGraphEdges', 'adminAffinityGraphForests'].map(collection => ({collection, selector: {}}));
    specs.push(...['userLoginAudits', 'userSessionActions', 'userSessionStates'].map(collection =>
      ({collection, selector: {$or: [{userId: {$in: actors}}, {_id: {$in: actors}}]}})),
      {collection: 'userNotifications', selector: {kind: 'security-login', recipientUserId: {$in: actors}}},
      {collection: 'notificationOutbox', selector: {notificationType: 'security-login', createdUser: {$in: actors}}});
    for (const spec of specs) backups.insertOne({_id: `${scenario}:${spec.collection}`, scenario,
      ...Q.snapshotSpecs([spec])[0]});
    Q.holdRule('affinity-graph-layout', 0, 'Parameters QA retains the graph until an explicit normal materialization checkpoint.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: Q.stateId(scenario)}, {$set: {phase: 'baseline-ready'}});
  } else if (command === 'prepare-delivery') {
    const state = Q.activeState(scenario, true), now = Q.nowIso();
    if (state.delivery || pending()) Q.fail('Delivery already prepared or recompute pending');
    const recipientIds = ['a', 'b'].map(key => `${deliveryPrefix}${key}`);
    const members = [actors[1], ...recipientIds], eventId = `${deliveryPrefix}event`;
    const user = Q.ensureUser(actors[1]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {delivery: {
      chatId: deliveryChatId, eventId, recipientIds, actorChatCounters: user.activities?.chat,
      actorChats: user.activities?.chats
    }}});
    for (const id of recipientIds) Q.collection('users').insertOne({_id: id, userId: id, syncKey: id,
      name: `Threshold QA ${id.slice(-1).toUpperCase()}`, initials: 'TQ', gender: 'woman', age: 30,
      status: 'A', profileStatus: 'private', activities: {}, devices: [], createdDate: now, createdUser: 'manual-qa'});
    Q.collection('events').insertOne({_id: eventId, sourceId: eventId, syncKey: eventId, status: 'A',
      creatorUserId: actors[1], ownerUserId: actors[1], admins: [actors[1]], title: 'Parameters delivery fixture',
      visibility: 'Invitation only', published: true, eventType: 'main', mode: 'Casual',
      acceptedMembers: 3, acceptedMemberUserIds: members, pendingMembers: 0,
      startAtIso: new Date(Date.now() + 86400000).toISOString(), endAtIso: new Date(Date.now() + 93600000).toISOString(),
      createdDate: now, createdUser: 'manual-qa'});
    Q.collection('chats').insertMany(members.map(id => ({_id: `${deliveryChatId}:${id}`, id: deliveryChatId,
      ownerUserId: id, memberIds: members, title: 'QA Parameters · two recipients', avatar: 'PQ',
      lastMessage: 'Notification strategy fixture', lastSenderId: actors[1], unread: 0, dateIso: now,
      channelType: 'mainEvent', ownerId: eventId, eventId, ownerStatus: 'A', revision: 1})));
    Q.printObject({chatId: deliveryChatId, recipientIds, devices: 0, expectedThreshold2: 'multicast', expectedThreshold3: 'direct'});
  } else if (command === 'cleanup-delivery') {
    const state = Q.activeState(scenario, true), delivery = state.delivery;
    if (!delivery) Q.fail('Delivery fixture not prepared');
    if (Q.collection('notificationOutbox').countDocuments({entityId: delivery.chatId, status: {$nin: ['sent', 'skipped']}})) Q.fail('Wait for terminal controlled delivery');
    if (Q.collection('chats').countDocuments({ownerUserId: actors[1], id: {$ne: delivery.chatId}})) Q.fail('New actor chats require scoped counter reconciliation');
    Q.collection('chats').deleteMany({id: delivery.chatId});
    Q.collection('chatMessages').deleteMany({chatId: delivery.chatId});
    Q.collection('events').deleteOne({_id: delivery.eventId});
    Q.collection('users').deleteMany({userId: {$in: delivery.recipientIds}});
    Q.collection('userNotifications').deleteMany({recipientUserId: {$in: delivery.recipientIds}});
    Q.collection('users').updateOne({userId: actors[1]}, {$set: {'activities.chat': delivery.actorChatCounters, 'activities.chats': delivery.actorChats}});
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {delivery: ''}});
  } else if (command === 'prepare-distance') {
    Q.activeState(scenario, true);
    if (pending() || Q.collection('users').countDocuments({userId: distanceUsers})) Q.fail('Distance fixture already present or recompute pending');
    const now = Q.nowIso(), anchor = `${distancePrefix}anchor`;
    const cases = [{name: 'inside', meters: 12500}, {name: 'boundary', meters: 25000}, {name: 'outside', meters: 37500}];
    const user = (id, name, meters) => ({_id: id, userId: id, syncKey: id, name,
      initials: 'DQ', gender: 'woman', status: 'A', profileStatus: 'public', city: 'Distance QA', age: 30,
      activities: {}, locationCoordinates: {latitude: 0, longitude: meters / 6371000 * 180 / Math.PI},
      createdDate: now, createdUser: 'manual-qa'});
    Q.collection('users').insertOne(user(anchor, 'Distance QA anchor', 0));
    for (const test of cases) {
      const id = `${distancePrefix}${test.name}`;
      Q.collection('users').insertOne(user(id, `Distance QA ${test.name}`, test.meters));
      Q.collection('userRates').insertOne({_id: id, ownerUserId: anchor, relatedUserId: id,
        mode: 'single', scoreGiven: 0, scoreReceived: 0, met: true, mutuallyRated: false,
        affinityScore: 1 - test.meters / 50000, evidenceConfidence: 1, createdDate: now, createdUser: 'manual-qa'});
    }
    Q.printObject({cases: cases.map(test => ({...test, expectedAffinity: Math.max(0, 1 - test.meters / 25000)}))});
  } else if (command === 'prepare-events') {
    const state = Q.activeState(scenario, true);
    if (pending() || state.consumerInputs?.length) Q.fail('Restore the prior consumer branch first');
    const sourceIds = ['261512e744c1837cd7ba85f2', 'c66972829391ece30a38e9be'];
    const events = Q.collection('events').find({sourceId: {$in: sourceIds}, status: 'A', visibility: 'Public'}).toArray();
    if (events.length !== 2) Q.fail('Expected two canonical public Event prerequisites');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {consumerInputs: events.map(event => ({
      id: event._id, sourceId: event.sourceId, hadPublished: Object.prototype.hasOwnProperty.call(event, 'published'), published: event.published
    }))}});
    Q.collection('events').updateMany({_id: {$in: events.map(event => event._id)}}, {$set: {published: true}});
    Q.printObject({preparedEvents: events.map(event => ({sourceId: event.sourceId, title: event.title,
      acceptedMembers: event.acceptedMembers, expectedBoostDelta: event.acceptedMembers}))});
  } else if (command === 'capture') {
    const state = Q.activeState(scenario, true), config = activeConfig();
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {captures: {
      at: Q.nowIso(), configId: config._id, version: config.version, section: config.changedSection,
      tasks: Q.collection('affinityRecomputeTasks').find({targetType: 'CONFIG'}).toArray(),
      outbox: Q.collection('notificationOutbox').find({notificationType: 'admin-params-changed', createdDate: {$gte: state.stagedAtIso}},
        {payload: 1, status: 1, recipientUserIds: 1, deliveryStrategy: 1, pendingCounterTracked: 1}).toArray()
    }}});
  } else if (command === 'make-recompute-due') {
    const state = Q.activeState(scenario, true), last = state.captures.at(-1);
    if (!last) Q.fail('Capture the real save before shortening unrelated CONFIG wait');
    const ids = last.tasks.filter(t => t.status === 'pending').map(t => t._id);
    const selector = {_id: {$in: ids}, targetType: 'CONFIG', status: 'pending'};
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {duePreparations: {
      at: Q.nowIso(), tasks: Q.collection('affinityRecomputeTasks').find(selector).toArray()
    }}});
    Q.printObject({madeDue: Q.collection('affinityRecomputeTasks').updateMany(selector,
      {$set: {availableAtIso: Q.nowIso()}}).modifiedCount});
  } else if (command === 'restore-config') {
    const state = Q.activeState(scenario, true);
    Q.assertRuleNotRunning('affinity-graph-layout');
    if (pending()) Q.fail('Wait for recompute before restoring configuration');
    restoreConsumerInputs(state);
    removeDistanceInputs();
    Q.collection('affinityConfigs').updateMany({active: true}, {$set: {active: false}});
    Q.collection('affinityConfigs').replaceOne({_id: state.originalConfig._id}, state.originalConfig);
    for (const snapshot of backups.find({scenario}).toArray()) {
      if (derivedFields[snapshot.collection]) restoreDerived(snapshot);
      else if (snapshot.collection === 'userAffinityEdges' || snapshot.collection.startsWith('adminAffinityGraph')) Q.restoreSnapshots([snapshot]);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {consumerInputs: ''}});
  } else if (command === 'materialize') {
    Q.activeState(scenario, true); Q.assertRuleNotRunning('affinity-graph-layout');
    if (pending()) Q.fail('Wait for upstream recompute before materialization');
    Q.printObject(Q.scheduleRule('affinity-graph-layout', 10));
  } else if (command === 'hold-graph') {
    Q.activeState(scenario, true); Q.assertRuleNotRunning('affinity-graph-layout');
    Q.holdRule('affinity-graph-layout', 0, 'Parameters QA retains its completed materialization.');
  } else if (command === 'reset') {
    const state = Q.activeState(scenario, true);
    if (state.delivery) Q.fail('Clean up the delivery branch before reset');
    Q.assertRuleNotRunning('affinity-graph-layout');
    if (pending()) Q.fail('Wait for recompute before reset');
    if (Q.collection('notificationOutbox').countDocuments({notificationType: 'admin-params-changed',
      createdDate: {$gte: state.stagedAtIso}, pendingCounterTracked: true})) Q.fail('Wait for parameter delivery');
    if (!Q.sameJson(activeConfig(), state.originalConfig)) Q.fail('Restore configuration before reset');
    restoreConsumerInputs(state);
    removeDistanceInputs();
    const snapshots = backups.find({scenario}).toArray();
    for (const snapshot of snapshots) {
      if (derivedFields[snapshot.collection]) restoreDerived(snapshot);
      else Q.restoreSnapshots([snapshot]);
    }
    // Retain unrelated user fields and the recipient counters of real Admin
    // notifications; CONFIG only owns these derived fields on domain inputs.
    Q.restoreRuleConfig(state.originalRule);
    const sorted = rows => rows.sort((a, b) => String(a._id).localeCompare(String(b._id)));
    for (const snapshot of snapshots) {
      const select = rows => derivedFields[snapshot.collection]
        ? rows.map(row => Object.fromEntries(['_id', ...derivedFields[snapshot.collection]]
          .filter(key => Object.prototype.hasOwnProperty.call(row, key)).map(key => [key, row[key]]))) : rows;
      if (!Q.sameJson(sorted(select(Q.collection(snapshot.collection).find(snapshot.selector).toArray())),
        sorted(select(snapshot.documents)))) Q.fail(`Reset mismatch: ${snapshot.collection}`);
    }
    backups.deleteMany({scenario}); Q.collection(Q.STATE_COLLECTION).deleteOne({_id: state._id});
  } else if (command !== 'status') Q.fail('Use stage|status|capture|make-recompute-due|restore-config|reset');
  const state = Q.activeState(scenario), config = activeConfig();
  Q.printObject({checkpointId, phase: state?.phase || 'not-staged', configVersion: config?.version,
    fields: fields.map(field => ({...field, original: valueAt(state?.originalConfig || config, field.path), current: valueAt(config, field.path)})),
    pendingRecompute: pending(), retainedSnapshots: backups.countDocuments({scenario}), captures: state?.captures.length || 0});
})();
