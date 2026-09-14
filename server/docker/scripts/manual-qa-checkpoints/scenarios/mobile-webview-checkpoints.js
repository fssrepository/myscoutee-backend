/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const SCENARIO = "mobile-webview";
  const CHECKPOINT = "MOBILE-WEBVIEW-LIFECYCLE-001";
  const PREFIX = "manual-qa-checkpoint:v1:mobile-webview";
  const RILEY = "650000000000000000000063";
  const NOVA = "650000000000000000000062";
  const HOST = "650000000000000000000061";
  const ACTORS = [{ id: RILEY, name: "Riley" }, { id: NOVA, name: "Nova" }];
  const ASSET = `${PREFIX}:transport`;
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== CHECKPOINT) Q.fail("Wrong Mobile WebView checkpoint.");
  const eventId = actor => `${PREFIX}:event:${actor.name.toLowerCase()}`;
  const eventIds = ACTORS.map(eventId);
  const notificationSelector = { sourceType: "mobile-webview-fixture", sourceId: PREFIX };
  const specs = [
    { collection: "events", selector: { $or: [{ _id: { $in: eventIds } }, { sourceId: { $in: eventIds } }] } },
    { collection: "eventTickets", selector: { eventId: { $in: eventIds } } },
    { collection: "activityMembers", selector: { ownerId: { $in: [...eventIds, ASSET] } } },
    { collection: "activityEventRuntimeItems", selector: { eventId: { $in: eventIds } } },
    { collection: "assets", selector: { assetId: ASSET } },
    { collection: "userNotifications", selector: notificationSelector }
  ];
  function notification(phase) {
    const now = Q.nowIso();
    return { _id: `${PREFIX}:notification:${phase}`, syncKey: `${PREFIX}:notification:${phase}`,
      recipientUserId: RILEY, kind: "fixture-control", category: "user",
      title: `QA Mobile ${phase}`, message: `Riley-only Mobile WebView ${phase}`,
      senderUserId: null, actionPath: "/game", sourceType: "mobile-webview-fixture", sourceId: PREFIX,
      payload: { fixture: CHECKPOINT, phase }, readAtIso: null,
      createdDate: now, updatedDate: now, createdUser: Q.ACTOR, updatedUser: Q.ACTOR };
  }
  function addNotification(phase) {
    const doc = notification(phase);
    if (Q.collection("userNotifications").countDocuments({ _id: doc._id })) Q.fail("This variant already has its single mutation.");
    Q.collection("userNotifications").insertOne(doc);
    Q.collection("users").updateOne({ userId: RILEY }, { $inc: { "activities.notifications": 1 }, $set: { updatedDate: doc.updatedDate } });
    return { id: doc._id, updatedDate: doc.updatedDate };
  }
  function stage() {
    Q.assertNotStaged(SCENARIO);
    ACTORS.forEach(actor => Q.ensureUser(actor.id));
    Q.ensureUser(HOST);
    const snapshots = Q.snapshotSpecs(specs);
    if (snapshots.some(s => s.documents.length)) Q.fail("Owned fixture namespace is not empty.");
    const template = Q.collection("assets").findOne({ type: "Transport", status: "A", imageUrl: { $regex: "^/media/public" } });
    const eventTemplate = Q.collection("events").findOne({ status: "A", imageUrl: { $regex: "^/media/public" } });
    if (!template || !eventTemplate) Q.fail("Existing managed image fixtures are required.");
    const now = Q.nowIso();
    const state = { _id: Q.stateId(SCENARIO), scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: "staging", stagedAtIso: now, snapshots, counterDeltas: [], variants: [] };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    const startAtIso = new Date(Date.now() + 86400000).toISOString();
    const endAtIso = new Date(Date.now() + 90000000).toISOString();
    for (const actor of ACTORS) {
      const id = eventId(actor);
      const accepted = [HOST, actor.id];
      Q.collection("events").insertOne({ _id: id, sourceId: id, syncKey: id,
        title: `QA Mobile ${actor.name} Ticket`, subtitle: "Mobile WebView controlled upcoming ticket",
        ownerUserId: HOST, creatorUserId: HOST, admins: [HOST], status: "A", published: true,
        visibility: "public", blindMode: "Open Event", autoInviter: false, ticketing: true,
        approvalRequired: false, capacityMin: 1, capacityMax: 8, capacityTotal: 8,
        acceptedMembers: 2, pendingMembers: 0, acceptedMemberUserIds: accepted,
        pendingMemberUserIds: [], invitedMemberUserIds: [], pendingRequestMemberUserIds: [],
        subEvents: [], subEventsEnabled: false, subEventDefinitions: [], slotsEnabled: false, slotTemplates: [],
        mode: "Casual", topics: ["Manual QA"], imageUrl: eventTemplate.imageUrl,
        location: "Austin", locationCoordinates: { latitude: 30.2672, longitude: -97.7431 },
        startAtIso, endAtIso, createdDate: now, updatedDate: now, createdUser: Q.ACTOR, updatedUser: Q.ACTOR });
      const source = Q.collection("events").findOne({ _id: id });
      Q.collection("events").insertOne({ ...source, _id: `${id}:participant`,
        syncKey: `${id}:participant`, ownerUserId: actor.id, isAdmin: false });
      for (const userId of accepted) {
        Q.collection("activityMembers").insertOne({ _id: `${id}:member:${userId}`, syncKey: `${id}:member:${userId}`,
          ownerType: "event", ownerId: id, userId, role: userId === HOST ? "Admin" : "Member",
          status: "accepted", pendingSource: null, requestKind: null, invitedByUserId: null,
          createdDate: now, updatedDate: now, createdUser: Q.ACTOR, updatedUser: Q.ACTOR });
      }
      Q.collection("eventTickets").insertOne({ _id: `${id}:ticket`, code: `TKT-${require("crypto").randomUUID()}`,
        eventId: id, holderUserId: actor.id, status: "A", issuedAtIso: now, usedAtIso: null, usedByUserId: null });
      const delta = { "activities.tickets": 1, "activities.asset.tickets": 1,
        "activities.events": 1, "activities.event.all": 1, "activities.event.active": 1 };
      Q.collection("users").updateOne({ userId: actor.id }, { $inc: delta });
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $push: { counterDeltas: { userId: actor.id, delta } } });
    }
    const hostDelta = { "activities.events": 2, "activities.hosting": 2,
      "activities.event.all": 2, "activities.event.active": 2, "activities.event.hosting": 2 };
    Q.collection("users").updateOne({ userId: HOST }, { $inc: hostDelta });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $push: { counterDeltas: { userId: HOST, delta: hostDelta } } });
    const asset = { ...template, _id: ASSET, assetId: ASSET, syncKey: ASSET, ownerUserId: RILEY,
      title: "QA Mobile Public Transport", subtitle: "Mobile layout and public image control",
      status: "A", visibility: "Public", requests: [], members: [], sourceLink: "",
      createdDate: now, updatedDate: now, createdUser: Q.ACTOR, updatedUser: Q.ACTOR };
    Q.collection("assets").insertOne(asset);
    const delta = { "activities.cars": 1, "activities.asset.cars": 1 };
    Q.collection("users").updateOne({ userId: RILEY }, { $inc: delta });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $push: { counterDeltas: { userId: RILEY, delta } } });
    addNotification("baseline");
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { phase: "fixture-ready" } });
    status();
  }
  function stageDemoFailover() {
    Q.assertNotStaged(SCENARIO);
    const user = Q.ensureUser('bf057de7c586eede7e84bdc7');
    Q.collection(Q.STATE_COLLECTION).insertOne({ _id: Q.stateId(SCENARIO), scenario: SCENARIO,
      checkpointId: CHECKPOINT, phase: 'demo-failover-ready', stagedAtIso: Q.nowIso(),
      snapshots: [], counterDeltas: [], variants: [] });
    Q.printObject({ scenario: SCENARIO, phase: 'demo-failover-ready',
      httpUserId: 'bf057de7c586eede7e84bdc7', localUserId: 'u1', name: user.name });
  }
  function status() {
    const state = Q.activeState(SCENARIO);
    if (!state) return Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "not-staged" });
    if (state.phase === 'demo-failover-ready') return Q.printObject({
      scenario: SCENARIO, checkpoint: CHECKPOINT, phase: state.phase,
      httpUserId: 'bf057de7c586eede7e84bdc7', localUserId: 'u1',
      canonicalActorPresent: Boolean(Q.ensureUser('bf057de7c586eede7e84bdc7'))
    });
    const tickets = Q.collection("eventTickets").find({ eventId: { $in: eventIds } }).toArray();
    const notifications = Q.collection("userNotifications").find(notificationSelector).toArray();
    Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: state.phase,
      tickets: tickets.map(t => ({ id: t._id, holderUserId: t.holderUserId, status: t.status, hasCode: Boolean(t.code) })),
      notifications: notifications.map(n => ({ id: n._id, recipientUserId: n.recipientUserId, read: Boolean(n.readAtIso), updatedDate: n.updatedDate })),
      asset: { id: ASSET, title: "QA Mobile Public Transport" },
      variants: state.variants,
      activeSessions: ACTORS.map(actor => ({ userId: actor.id,
        count: (Q.collection("userSessionStates").findOne({ _id: actor.id })?.activeSessions || []).length })),
      checks: { twoDistinctUpcomingTickets: tickets.length === 2 && ACTORS.every(a => tickets.filter(t => t.holderUserId === a.id && t.status === "A").length === 1
          && Q.collection("events").countDocuments({ sourceId: eventId(a), ownerUserId: a.id, status: "A", ticketing: true }) === 1),
        rileyOnlyNotifications: notifications.every(n => n.recipientUserId === RILEY),
        publicAssetPresent: Q.collection("assets").countDocuments({ assetId: ASSET, ownerUserId: RILEY, status: "A" }) === 1 } });
  }
  function reset() {
    const state = Q.activeState(SCENARIO, true);
    const unread = Q.collection("userNotifications").countDocuments({ ...notificationSelector, readAtIso: null });
    const counters = [...state.counterDeltas, { userId: RILEY, delta: { "activities.notifications": unread } }];
    for (const entry of counters) {
      const reverse = Object.fromEntries(Object.entries(entry.delta).filter(([, n]) => n).map(([key, n]) => [key, -n]));
      if (!Object.keys(reverse).length) continue;
      const guard = Object.fromEntries(Object.entries(entry.delta).map(([key, n]) => [key, { $gte: n }]));
      const result = Q.collection("users").updateOne({ userId: entry.userId, ...guard }, { $inc: reverse });
      if (result.modifiedCount !== 1) Q.fail("Fixture counter reversal guard failed; retain state for diagnosis.");
    }
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    if (specs.some(s => Q.collection(s.collection).countDocuments(s.selector))) Q.fail("Owned fixture rows remain.");
    Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "reset-complete" });
  }
  if (command === "stage") stage();
  else if (command === "stage-demo") stageDemoFailover();
  else if (command === "status") status();
  else if (command === "profile-batch-timing") {
    Q.activeState(SCENARIO, true);
    const users = Q.collection("users");
    const ids = users.find({ userId: { $type: "string", $ne: "" } }, { userId: 1 }).sort({ userId: 1 }).limit(50).toArray().map(u => u.userId);
    const clock = require('node:perf_hooks').performance;
    const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
    const results = [];
    for (const size of [1, 10, 50].filter(n => n <= ids.length)) {
      const selected = ids.slice(0, size);
      const canonical = rows => EJSON.stringify(rows.sort((a, b) => a.userId.localeCompare(b.userId)));
      const individual = () => selected.map(userId => users.findOne({ userId }));
      const batch = () => users.find({ userId: { $in: selected } }).toArray();
      const expected = canonical(individual());
      if (canonical(batch()) !== expected) Q.fail("Batch profile contents differ from individual reads.");
      const times = { individual: [], batch: [] };
      for (let round = 0; round < 20; round += 1) {
        for (const name of round % 2 ? ['batch', 'individual'] : ['individual', 'batch']) {
          const start = clock.now();
          const rows = name === 'batch' ? batch() : individual();
          times[name].push(clock.now() - start);
          if (canonical(rows) !== expected) Q.fail("Profiles changed during timing; discard this measurement.");
        }
      }
      results.push({ profiles: size, rounds: 20, individualQueries: size, batchQueries: 1,
        individualMedianMs: Number(median(times.individual).toFixed(3)),
        batchMedianMs: Number(median(times.batch).toFixed(3)), equalFullDocuments: true });
    }
    Q.printObject({ scenario: SCENARIO, measurement: 'Mongo profile reads only; warm cache, alternating order, no writes; not full HTTP latency', results });
  }
  else if (command === "media-controls") {
    const state = Q.activeState(SCENARIO, true);
    if (state.phase !== "fixture-ready") Q.fail("The full Mobile WebView fixture must be ready.");
    const asset = Q.collection("assets").findOne({ assetId: ASSET, ownerUserId: RILEY });
    if (!asset || !Q.text(asset.imageUrl).startsWith("/media/public?")) Q.fail("Public fixture image is missing.");
    Q.printObject({ publicImageUrl: asset.imageUrl });
  }
  else if (command === "reset") reset();
  else if (command === "reset-background-settings-resident") {
    const state = Q.activeState(SCENARIO, true);
    const phase = "background-settings-resident";
    const id = `${PREFIX}:notification:${phase}`;
    const row = Q.collection("userNotifications").findOne({ _id: id, ...notificationSelector, recipientUserId: RILEY });
    if (!row || !state.variants.some(v => v.phase === phase && v.id === id)) Q.fail("No owned resident replay to reset.");
    if (!row.readAtIso) {
      const result = Q.collection("users").updateOne({ userId: RILEY, "activities.notifications": { $gte: 1 } },
        { $inc: { "activities.notifications": -1 }, $set: { updatedDate: Q.nowIso() } });
      if (result.modifiedCount !== 1) Q.fail("Resident replay counter reversal guard failed.");
    }
    Q.collection("userNotifications").deleteOne({ _id: id });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $pull: { variants: { phase } } });
    status();
  }
  else if (["background-settings", "background-settings-resident", "background-chrome"].includes(command)) {
    const state = Q.activeState(SCENARIO, true);
    const mutation = addNotification(command);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $push: { variants: { phase: command, ...mutation } } });
    status();
  } else Q.fail("Unsupported Mobile WebView command.");
})();
