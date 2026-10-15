/* global ManualQa, db, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "work-community", checkpointId = "MSC115-WORK-COMMUNITY";
  const actors = [
    { id: "bf057de7c586eede7e84bdc7", name: "Farkas Anna", role: "organizer" },
    { id: "1b1c70be2349b3359a8f6f94", name: "Maya Stone", role: "participant" },
    { id: "1d7d3545ba5e0f1d63918589", name: "Evan Reed", role: "provider" },
    { id: "af0436815ab38f4864dd1e24", name: "Alex Turner", role: "workspace-admin" }
  ];
  const groups = ["myscoutee-work", "myscoutee-community"];
  const accountIds = actors.map(a => a.id);
  const profileIds = actors.flatMap(a => [a.id, ...groups.map(g => `group:${g}:${a.id}`)]);
  const userSelector = { userId: { $in: profileIds } };
  const ownedSelector = { $or: ["ownerUserId", "userId", "accountUserId", "authorUserId", "recipientUserId", "createdUser", "organizerUserId"]
    .map(field => ({ [field]: { $in: profileIds } })) };
  const serviceSelector = { ownerAccountId: { $in: accountIds } };
  // Only these actor-owned rows are restored. New block-specific relations must
  // be captured before the corresponding mutation, never by resetting demo_db.
  const collections = ["activityMembers", "campaigns", "communityGroups", "serviceOfferings", "serviceCases",
    "communityScheduledTasks", "communityAnnouncements", "chats", "chatMessages", "userNotifications", "notificationOutbox",
    "privacyConsents", "userExperienceProfiles", "userFilterPreferences", "userPageFilterPreferences"];
  function baseline() {
    const profiles = Q.collection("users").find(userSelector).toArray();
    for (const actor of actors) {
      const rows = profiles.filter(p => p.userId === actor.id || p.accountUserId === actor.id);
      if (rows.length !== 3 || rows.some(p => p.name !== actor.name || !p.images?.length)) {
        Q.fail(`Existing showcase profile or images missing for ${actor.name}; repair canonical seed first.`);
      }
      for (const group of groups) {
        const member = Q.collection("activityMembers").findOne({ ownerType: "community", ownerId: group, userId: actor.id, status: "accepted" });
        if (!member) Q.fail(`Missing ${group} membership for ${actor.name}.`);
      }
    }
    return profiles.map(p => ({ userId: p.userId, name: p.name, group: p.workspaceGroupId ?? null,
      imageCount: p.images.length, profileStatus: p.profileStatus }));
  }
  function status(ready) {
    const state = Q.activeState(scenario, true);
    const rule = Q.collection("notificationRuleConfigs").findOne({ ruleKey: "event-auto-inviter", baseGroupId: "myscoutee-work" });
    Q.printObject({ scenario, checkpointId, phase: state.phase, actors, profiles: ready ? baseline() : undefined,
      autoInviter: { shortened: !!state.autoInviterSchedule, intervalSeconds: rule?.timing?.intervalSeconds, runState: rule?.runState },
      serviceDiscovery: state.serviceDiscovery ? serviceDiscoveryStatus(state, ready) : null,
      serviceRatingSnapshotRetained: !!state.serviceRatings,
      serviceProviderControl: !!state.serviceProviderControl,
      serviceCalendarControl: !!state.serviceCalendarControl,
      caseCatalogSnapshotRetained: !!state.caseCatalog,
      feedbackEvaluationSnapshotRetained: !!state.feedbackEvaluation,
      integrationEventsSnapshotRetained: !!state.integrationEvents,
      integrationEvents: state.integrationEvents ? {
        subscriptions: Q.collection('mcpEventSubscriptions').countDocuments(state.integrationEvents.selector),
        enabled: Q.collection('mcpEventSubscriptions').countDocuments({ ...state.integrationEvents.selector, enabled: true }),
        activeByOwner: Q.collection('mcpEventSubscriptions').aggregate([
          { $match: { ...state.integrationEvents.selector, enabled: true, expiresAt: { $gt: new Date() } } },
          { $group: { _id: '$ownerUserId', count: { $sum: 1 } } }
        ]).toArray(),
        stagedBacklog: Q.collection('integrationWebhookDeliveries').countDocuments({ _id: /^msc116-events-backlog-/ }),
        subscriptionStates: Q.collection('mcpEventSubscriptions').find(state.integrationEvents.selector,
          { _id: 1, ownerUserId: 1, name: 1, enabled: 1, expiresAt: 1, generation: 1, verifiedUntil: 1, previousSecretUntil: 1, truncated: 1,
            secret: 1, previousSecret: 1, deleteAfter: 1 }).toArray().map(({ secret, previousSecret, ...row }) => ({
              ...row, hasSecret: !!secret, hasPreviousSecret: !!previousSecret })),
        plaintextSigningSecrets: Q.collection('mcpEventSubscriptions').find(state.integrationEvents.selector).toArray()
          .filter(row => JSON.stringify(row).includes('whsec_')).length,
        retentionIndexes: ['mcpEventSubscriptions', 'integrationWebhookDeliveries'].map(collection => ({
          collection, indexes: Q.collection(collection).getIndexes().filter(index => index.key.deleteAfter)
            .map(index => ({ key: index.key, expireAfterSeconds: index.expireAfterSeconds })) })),
        deliveries: Q.collection('integrationWebhookDeliveries').countDocuments(state.integrationEvents.selector),
        deliveryStates: Q.collection('integrationWebhookDeliveries').find({ ...state.integrationEvents.selector,
          _id: { $not: /^msc116-events-backlog-/ } },
          { _id: 1, subscriptionId: 1, status: 1, attemptCount: 1, nextAttemptAtIso: 1, lastError: 1,
            createdAtIso: 1, deleteAfter: 1, protocol: 1 }).toArray(),
        retryStates: Q.collection('integrationWebhookRetries').find({ 'request.deliveryId': { $in:
          Q.collection('integrationWebhookDeliveries').find(state.integrationEvents.selector, { _id: 1 })
            .toArray().map(row => row._id) } },
          { _id: 1, status: 1, attemptCount: 1, nextAttemptAt: 1, lastError: 1 }).toArray()
      } : null,
      adminContentSnapshotRetained: !!state.adminContent,
      adminJobsSnapshotRetained: !!state.adminJobs,
      paymentCatalogSnapshotRetained: !!state.paymentCatalog,
      mixingEventIds: state.mixingCatalog?.eventIds || [],
      announcements: state.announcementCatalog ? Q.collection('communityAnnouncements').find(
        { title: { $regex: '^MSC11[56] QA announcement ' }, authorAccountId: { $in: accountIds } },
        { _id: 1, title: 1, status: 1, version: 1, attachments: 1, voting: 1, pendingDocumentDeletes: 1 }).toArray() : [],
      scheduledTaskCatalog: state.scheduledTaskCatalog ? { capturedAtIso: state.scheduledTaskCatalog.capturedAtIso, boundaryAtIso: state.scheduledTaskCatalog.boundaryAtIso, startAtIso: state.scheduledTaskCatalog.startAtIso } : null,
      scope: "Existing permanent showcase profiles, captured without reseeding or cloning. Block-specific temporary QA records remain reversible." });
  }
  function serviceDiscoveryStatus(state, ready) {
    const records = Q.collection("serviceOfferings").find({ _id: { $in: state.serviceDiscovery.ids } }).toArray();
    if (ready && (records.length !== 14 || records.filter(r => r.status === "published").length !== 12
      || records.some(r => !r.imageUrls?.length || r.baseGroupId !== "myscoutee-community"))) {
      Q.fail("MSC115 service discovery baseline differs; inspect it before relaunch.");
    }
    return { records: records.map(r => ({ id: r._id, ownerAccountId: r.ownerAccountId,
      status: r.status, category: r.category, imageUrls: r.imageUrls })),
      expectedPublished: 12, customer: actors[3].id, emptyCategory: "renovation" };
  }
  function stageServiceDiscovery() {
    const state = Q.activeState(scenario, true);
    if (state.serviceDiscovery) Q.fail("Service discovery is already staged; use ready/status.");
    baseline();
    const source = Q.collection("serviceOfferings").findOne({ _id: "service-anna-meters", ownerAccountId: actors[0].id });
    if (!source) Q.fail("Canonical Anna service missing.");
    const ids = Array.from({ length: 14 }, (_, index) => `msc115-service-discovery-${String(index + 1).padStart(2, "0")}`);
    const selector = { _id: { $in: ids } };
    if (Q.collection("serviceOfferings").countDocuments(selector)) Q.fail("Service discovery IDs already exist.");
    const snapshots = Q.snapshotSpecs([{ collection: "serviceOfferings", selector }]);
    // Capture the exact empty ID range before insertion; never overwrite showcase records.
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { serviceDiscovery: { ids, snapshots } } });
    const now = Q.nowIso();
    Q.collection("serviceOfferings").insertMany(ids.map((id, index) => ({ ...source, _id: id,
      ownerAccountId: index < 8 || index >= 12 ? actors[0].id : actors[2].id,
      title: `MSC115 service ${String(index + 1).padStart(2, "0")} — ${index < 8 ? "Meter care" : "Electrical care"}`,
      description: `Service-owned description ${index + 1}; prepared discovery baseline.`,
      category: index < 8 || index >= 12 ? "plumbing" : "electrical",
      imageUrls: [index < 8 || index >= 12 ? "/assets/articles/community-meter.png" : "/assets/articles/community-fault.png"],
      maxDistanceKm: null, languages: [], staffAccountIds: [index < 8 || index >= 12 ? actors[0].id : actors[2].id],
      status: index === 12 ? "draft" : index === 13 ? "trash" : "published",
      createdAtIso: now, updatedAtIso: now, version: NumberLong("0") })));
  }
  function serviceProviderControl(restore) {
    const state = Q.activeState(scenario, true);
    const selector = { userId: `group:myscoutee-community:${actors[0].id}` };
    if (restore) {
      if (!state.serviceProviderControl) return;
      Q.collection('users').updateOne(selector, { $set: { profileStatus: state.serviceProviderControl.profileStatus } });
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $unset: { serviceProviderControl: '' } });
      return;
    }
    if (state.serviceProviderControl) Q.fail('Restore the existing provider control before staging it again.');
    const profile = Q.collection('users').findOne(selector);
    if (profile?.profileStatus !== 'public') Q.fail('Provider control requires Anna’s restored public Community profile.');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { serviceProviderControl: { profileStatus: profile.profileStatus } } });
    Q.collection('users').updateOne(selector, { $set: { profileStatus: 'deleted' } });
  }
  function serviceCalendarControl(restore) {
    const state = Q.activeState(scenario, true);
    const selector = { _id: 'community-case-park-meters' };
    if (restore) {
      if (!state.serviceCalendarControl) return;
      Q.collection('serviceCases').updateOne(selector, { $set: { boardTasks: state.serviceCalendarControl.boardTasks } });
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $unset: { serviceCalendarControl: '' } });
      return;
    }
    if (state.serviceCalendarControl) Q.fail('Restore the existing calendar control before staging it again.');
    const c = Q.collection('serviceCases').findOne(selector);
    if (!c || !(c.support || []).some(s => s.accountId === actors[0].id && s.status === 'accepted')
      || !(c.boardTasks || []).some(t => t._id === 'meters-install')) Q.fail('Existing accepted provider and meter-install task required.');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { serviceCalendarControl: { boardTasks: c.boardTasks } } });
    const today = Q.nowIso().slice(0, 10);
    Q.collection('serviceCases').updateOne(selector, { $set: { boardTasks: c.boardTasks.map(t => t._id === 'meters-install'
      ? { ...t, assigneeAccountIds: [actors[0].id], startAtIso: `${today}T10:00:00.000Z`, endAtIso: `${today}T11:00:00.000Z` } : t) } });
  }
  // Reuse the event-mode fixture's configuration-only schedule boundary.
  // Runtime timestamps, run history, participants and outcomes stay untouched.
  function autoInviterSchedule(restore) {
    const state = Q.activeState(scenario, true);
    if (restore && !state.autoInviterSchedule) return;
    const rules = Q.collection("notificationRuleConfigs");
    const selector = { ruleKey: "event-auto-inviter", baseGroupId: "myscoutee-work" };
    const rule = rules.findOne(selector);
    if (!rule || (!restore && rule.enabled !== true) || rule.runState?.currentStatus === "running")
      Q.fail("Work auto-inviter must exist, be enabled and not currently running.");
    if (restore) {
      const set = {}, unset = {};
      for (const field of state.autoInviterSchedule.fields) {
        if (field.present) set[field.key] = field.value;
        else unset[field.key] = "";
      }
      const update = { $set: set };
      if (Object.keys(unset).length) update.$unset = unset;
      if (rules.updateOne({ ...selector, _id: rule._id, "runState.currentStatus": { $ne: "running" } }, update).matchedCount !== 1)
        Q.fail("Work auto-inviter began running; retry restoration after completion.");
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $unset: { autoInviterSchedule: "" } });
      return;
    }
    if (!state.autoInviterSchedule) {
      const fields = ["timing", "scheduleSlots", "updatedDate", "updatedUser"];
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { autoInviterSchedule: {
        armedAtIso: Q.nowIso(), previousLastRunAtIso: rule.runState?.lastRunAtIso ?? null,
        fields: fields.map(key => ({ key, present: Object.prototype.hasOwnProperty.call(rule, key), value: rule[key] }))
      } } });
    }
    const result = rules.updateOne({ ...selector, _id: rule._id, "runState.currentStatus": { $ne: "running" } }, { $set: {
      timing: { ...rule.timing, mode: "interval", intervalAmount: 1, intervalUnit: "minutes", intervalSeconds: 60, intervalMinutes: 1 },
      scheduleSlots: [], updatedDate: Q.nowIso(), updatedUser: Q.ACTOR
    } });
    if (result.matchedCount !== 1) Q.fail("Work auto-inviter began running; retry scheduling after completion.");
  }
  function scheduleExclusion(command) {
    const state = Q.activeState(scenario, true);
    if (!state.scheduledTaskCatalog) Q.fail('Capture the schedule baseline first.');
    const saved = state.scheduleExclusion;
    if (command === 'arm-schedule-exclusion') {
      if (saved) Q.fail('Schedule exclusion control already exists.');
      const titles = ['MSC115 QA schedule personal 71', 'MSC115 QA schedule group 71', 'MSC115 QA schedule boundary 74'];
      const tasks = titles.map(title => Q.collection('communityScheduledTasks').findOne({ title }));
      if (tasks.some(t => !t || !accountIds.includes(t.ownerAccountId))) Q.fail('Create the three disposable schedules through the UI first.');
      const [paused, deleted, control] = tasks;
      if (paused.enabled || paused.deleted || !deleted.deleted || deleted.enabled || !control.enabled || control.deleted || control.frequency !== 'once')
        Q.fail('Expected paused personal, deleted group and active one-time control.');
      const boundaryAtIso = new Date(Date.parse(control.startAtIso) - 45 * 86400000).toISOString();
      if (Date.parse(boundaryAtIso) <= Date.now() + 30000) Q.fail('The control boundary must still be in the future.');
      const caseIds = tasks.map(t => `scheduled-case:${t._id}:${control.startAtIso}`);
      if (Q.collection('serviceCases').countDocuments({ _id: { $in: caseIds } })) Q.fail('Control occurrence already exists.');
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { scheduleExclusion: {
        phase: 'armed', tasks, boundaryAtIso, caseIds, armedAtIso: Q.nowIso()
      } } });
      // Only move disposable disabled schedules into the same due window.
      // Status and generated outcomes are left to the application/real worker.
      const writes = [paused, deleted].map(t => ({ updateOne: { filter: { _id: t._id, version: t.version },
        update: { $set: { nextDueAtIso: control.startAtIso }, $inc: { version: NumberLong('1') } } } }));
      if (Q.collection('communityScheduledTasks').bulkWrite(writes).matchedCount !== 2) Q.fail('A control changed while arming.');
      Q.printObject({ command, phase: 'before-boundary', boundaryAtIso, caseIds, cases: 0 });
      return;
    }
    if (!saved || saved.phase !== 'armed') Q.fail('Arm the exclusion control first.');
    if (Date.now() < Date.parse(saved.boundaryAtIso)) Q.fail('Wait for the real boundary.');
    const cases = Q.collection('serviceCases').find({ _id: { $in: saved.caseIds } }).toArray();
    if (cases.length !== 1 || cases[0]._id !== saved.caseIds[2]) Q.fail('Expected only the active control occurrence from the real worker.');
    const current = Q.collection('communityScheduledTasks').find({ _id: { $in: saved.tasks.map(t => t._id) } }).toArray();
    for (const old of saved.tasks.slice(0, 2)) {
      const row = current.find(t => t._id === old._id);
      if (!row || row.enabled || row.deleted !== old.deleted || row.nextDueAtIso !== saved.tasks[2].startAtIso
        || Number(row.version) !== Number(old.version) + 1) Q.fail('A disabled control changed unexpectedly.');
    }
    for (const old of saved.tasks.slice(0, 2)) {
      const row = current.find(t => t._id === old._id);
      if (Q.collection('communityScheduledTasks').updateOne({ _id: row._id, version: row.version }, {
        $set: { nextDueAtIso: old.nextDueAtIso }, $inc: { version: NumberLong('1') }
      }).matchedCount !== 1) Q.fail('Concurrent control change during restoration.');
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'scheduleExclusion.phase': 'verified-restored' } });
    Q.printObject({ command, phase: 'verified-restored', boundaryAtIso: saved.boundaryAtIso,
      cases: cases.map(c => ({ id: c._id, createdAtIso: c.createdAtIso })), excluded: saved.caseIds.slice(0, 2) });
  }
  function scheduleRetry(command) {
    const state = Q.activeState(scenario, true);
    if (!state.scheduledTaskCatalog || !state.caseCatalog) Q.fail('Capture the schedule/case baselines first.');
    const tasks = Q.collection('communityScheduledTasks').find({ title: { $in: [
      'MSC115 QA schedule group 71', 'MSC115 QA schedule personal 71'
    ] } }).sort({ _id: 1 }).toArray();
    if (tasks.length !== 2 || tasks.some(t => !accountIds.includes(t.ownerAccountId) || !t.enabled || t.deleted
      || t.startAtIso !== state.scheduledTaskCatalog.startAtIso)) Q.fail('Expected both retained UI-created step71 schedules.');
    const caseIds = tasks.map(t => `scheduled-case:${t._id}:${t.startAtIso}`);
    const cases = Q.collection('serviceCases').find({ _id: { $in: caseIds } }).sort({ _id: 1 }).toArray();
    const outboxes = Q.collection('notificationOutbox').find({ entityId: { $in: caseIds }, notificationType: 'case-reminder' }).sort({ _id: 1 }).toArray();
    const inbox = Q.collection('userNotifications').find({ sourceId: { $in: caseIds }, kind: 'case-reminder' }).sort({ _id: 1 }).toArray();
    if (cases.length !== 2 || outboxes.length !== 2 || inbox.length !== 4
      || outboxes.some(o => o.firebaseDeliveryRequested !== false)) Q.fail('Expected two existing cases/reminders and four no-push inbox records.');
    const saved = state.scheduleRetry;
    if (command === 'replay-schedule-occurrence') {
      if (saved || outboxes.some(o => o.status !== 'sent') || tasks.some(t => t.nextDueAtIso === t.startAtIso))
        Q.fail('Replay requires a completed first occurrence and no prior retry control.');
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { scheduleRetry: {
        phase: 'occurrence-armed', armedAtIso: Q.nowIso(), tasks, cases, outboxes, inbox
      } } });
      // Emulate interruption after enqueue but before recurrence advancement.
      // Existing cases, inbox records and delivery identities remain untouched.
      const writes = tasks.map(t => ({ updateOne: { filter: { _id: t._id, version: t.version },
        update: { $set: { nextDueAtIso: t.startAtIso }, $inc: { version: NumberLong('1') } } } }));
      if (Q.collection('communityScheduledTasks').bulkWrite(writes).matchedCount !== 2) Q.fail('A schedule changed while arming replay.');
    } else {
      if (!saved) Q.fail('Arm the occurrence replay first.');
      if (!Q.sameJson(cases, saved.cases) || !Q.sameJson(inbox, saved.inbox)) Q.fail('Replay changed a case or inbox record.');
      if (tasks.some(t => t.nextDueAtIso !== saved.tasks.find(old => old._id === t._id)?.nextDueAtIso))
        Q.fail('Wait for the real worker to advance the replayed occurrences.');
      if (command === 'verify-schedule-occurrence') {
        if (!Q.sameJson(outboxes, saved.outboxes)) Q.fail('Occurrence replay changed reminder delivery records.');
        Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'scheduleRetry.phase': 'occurrence-verified' } });
      } else if (command === 'retry-schedule-delivery') {
        if (saved.phase !== 'occurrence-verified' || outboxes.some(o => o.status !== 'sent')) Q.fail('Verify occurrence dedupe before delivery retry.');
        Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'scheduleRetry.phase': 'delivery-armed', 'scheduleRetry.deliveryArmedAtIso': Q.nowIso() } });
        // Replay only these already-materialized no-push deliveries through the existing worker.
        Q.collection('notificationOutbox').updateMany({ _id: { $in: outboxes.map(o => o._id) }, status: 'sent' }, {
          $set: { status: 'pending', pendingCounterTracked: true, nextRetryAt: Q.nowIso() }
        });
      } else if (command === 'verify-schedule-delivery') {
        if (saved.phase !== 'delivery-armed' || outboxes.some(o => o.status !== 'sent'
          || o.sentDate <= saved.deliveryArmedAtIso || o.pendingCounterTracked !== false
          || o.tokenSuccessCount !== 0 || o.tokenFailureCount !== 0)) Q.fail('Wait for both real no-push deliveries to finish.');
        Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'scheduleRetry.phase': 'verified' } });
      }
    }
    Q.printObject({ command, cases: cases.length, reminders: outboxes.length, inbox: inbox.length,
      taskDates: tasks.map(t => ({ id: t._id, startAtIso: t.startAtIso, nextDueAtIso: t.nextDueAtIso })),
      outboxes: outboxes.map(o => ({ id: o._id, status: o.status, sentDate: o.sentDate })) });
  }
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail("Wrong MSC-115 checkpoint.");
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  if (command === "stage") {
    Q.assertNotStaged(scenario);
    baseline();
    const snapshots = Q.snapshotSpecs([{ collection: "users", selector: userSelector },
      ...collections.map(collection => ({ collection, selector: collection === "serviceOfferings" ? serviceSelector : ownedSelector }))]);
    Q.collection(Q.STATE_COLLECTION).insertOne({ _id: Q.stateId(scenario), scenario, checkpointId,
      database: db.getName(), stagedAtIso: Q.nowIso(), phase: "fixture-ready", actors: accountIds, snapshots });
    status(true);
  } else if (command === "status" || command === "ready") status(command === "ready");
  else if (command === 'capture-integration-roles') {
    const state = Q.activeState(scenario, true);
    const selector = { $or: [{ userId: { $in: ['admin-demo-ava', 'operator@myscoutee.local'] } },
      { email: 'operator@myscoutee.local' }] };
    const users = Q.collection('users').find(selector).toArray();
    if (!users.some(u => u.userId === 'admin-demo-ava') || !users.some(u => u.userId === 'operator@myscoutee.local'))
      Q.fail('Canonical app-admin/operator fixtures are missing.');
    if (!state.integrationRoles) Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      integrationRoles: { snapshots: Q.snapshotSpecs([{ collection: 'users', selector }]), capturedAtIso: Q.nowIso() }
    } });
    Q.printObject({ command, phase: 'role-baseline-retained', profiles: users.map(u => u.userId) });
  }
  else if (['capture-integration-producers', 'stage-integration-registration', 'stage-integration-registration-maya', 'integration-producers-status'].includes(command)) {
    const state = Q.activeState(scenario, true);
    if (!state.integrationRoles || !state.integrationEvents) Q.fail('Capture role and Events baselines first.');
    if (command === 'capture-integration-producers') {
      if (state.integrationProducers) Q.fail('Producer baseline is already retained.');
      const settings = Q.collection('appSettings').findOne({ _id: 'app-settings-global' });
      const recipients = Q.collection('users').find({ $or: [
        { operator: true }, { email: { $in: settings?.adminEmails || [] } }
      ] }).toArray().map(row => row.userId);
      if (!recipients.includes('admin-demo-ava') || !recipients.includes('operator@myscoutee.local'))
        Q.fail('Expected canonical role recipients are missing.');
      const snapshots = Q.snapshotSpecs([
        { collection: 'users', selector: { userId: { $in: recipients } } },
        { collection: 'userNotifications', selector: { recipientUserId: { $in: recipients } } },
        { collection: 'notificationOutbox', selector: { recipientUserIds: { $in: recipients } } },
        ...['userFeedback', 'userReports'].map(collection => ({ collection, selector: userSelector }))
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        integrationProducers: { recipients, snapshots, capturedAtIso: Q.nowIso() }
      } });
      Q.printObject({ command, recipients, phase: 'producer-baseline-retained' });
    } else {
      if (!state.integrationProducers) Q.fail('Capture the producer baseline first.');
      if (command.startsWith('stage-integration-registration')) {
        // Existing base-account snapshot owns cleanup; normal profile save owns publication.
        Q.collection('users').updateOne({ userId: actors[command.endsWith('-maya') ? 1 : 3].id }, { $set: { profileStatus: 'onboarding' } });
      }
      Q.printObject({ command, recipients: state.integrationProducers.recipients,
        inbox: Q.collection('userNotifications').find({ recipientUserId: { $in: state.integrationProducers.recipients } },
          { _id: 1, recipientUserId: 1, kind: 1, sourceId: 1, readAtIso: 1, occurrenceCount: 1 }).toArray(),
        outbox: Q.collection('notificationOutbox').find({ recipientUserIds: { $in: state.integrationProducers.recipients } },
          { _id: 1, notificationType: 1, entityId: 1, status: 1, attemptCount: 1 }).toArray(),
        submissions: ['userFeedback', 'userReports'].map(collection => ({ collection,
          ids: Q.collection(collection).find(userSelector, { _id: 1 }).toArray() })) });
    }
  }
  else if (command === 'stage-integration-rating-cards' || command === 'restore-integration-rating-cards') {
    const state = Q.activeState(scenario, true);
    if (!state.mixingCatalog) Q.fail('Capture actor rating relations before UI rating.');
    if (command.startsWith('stage-')) {
      if (state.integrationRatingCards?.phase === 'active') Q.fail('Rating discovery is already isolated.');
      const selector = { workspaceGroupId: 'myscoutee-work', category: 'creative', status: 'published',
        title: { $not: /^MSC116 QA rating campaign [12]$/ } };
      const snapshots = Q.snapshotSpecs([{ collection: 'campaigns', selector }]);
      // Retain exact IDs because the staged status no longer matches the selector.
      snapshots[0].selector = { _id: { $in: snapshots[0].documents.map(row => row._id) } };
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { integrationRatingCards: { snapshots, phase: 'active' } } });
      Q.collection('campaigns').updateMany(snapshots[0].selector, { $set: { status: 'draft' } });
    } else {
      if (state.integrationRatingCards?.phase !== 'active') Q.fail('No active rating discovery control.');
      Q.restoreSnapshots(state.integrationRatingCards.snapshots);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'integrationRatingCards.phase': 'restored' } });
    }
    Q.printObject({ command, phase: command.startsWith('stage-') ? 'isolated-discovery' : 'restored' });
  }
  else if (command === 'advance-integration-role-retries') {
    const state = Q.activeState(scenario, true);
    if (!state.integrationProducers) Q.fail('Capture the producer baseline first.');
    const selector = { ownerUserId: { $in: ['admin-demo-ava', 'operator@myscoutee.local'] },
      protocol: 'mcp-events', status: 'RETRY', createdAtIso: { $gte: state.integrationProducers.capturedAtIso } };
    const rows = Q.collection('integrationWebhookDeliveries').find(selector, { _id: 1, nextAttemptAtIso: 1, attemptCount: 1 }).toArray();
    const now = new Date();
    const changed = Q.collection('integrationWebhookRetries').updateMany({ _id: { $in: rows.map(row => row._id) } },
      { $set: { nextAttemptAt: now } });
    Q.collection('integrationWebhookDeliveries').updateMany(selector, { $set: { nextAttemptAtIso: now.toISOString() } });
    Q.printObject({ command, previous: rows, retryTasksAdvanced: changed.modifiedCount,
      scope: 'Only due timestamps change; the normal worker owns attempts, authorization and outcome.' });
  }
  else if (command === 'stage-integration-role-grant-expiry' || command === 'restore-integration-role-grant') {
    const state = Q.activeState(scenario, true);
    if (!state.integrationProducers) Q.fail('Capture the producer baseline first.');
    if (command.startsWith('stage-')) {
      if (state.integrationRoleGrant?.phase === 'active') Q.fail('Restore the prior grant control first.');
      const clientIds = Q.collection('mcpOAuthClients').find({ name: /^MSC116 QA / }, { _id: 1 }).toArray().map(row => row._id);
      const selector = { ownerUserId: 'admin-demo-ava', kind: 'grant', clientId: { $in: clientIds }, revoked: false };
      const snapshots = Q.snapshotSpecs([{ collection: 'mcpAuthorizations', selector }]);
      if (snapshots[0].documents.length !== 1) Q.fail('Expected exactly one disposable admin Events grant.');
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { integrationRoleGrant: { snapshots, phase: 'active' } } });
      Q.collection('mcpAuthorizations').updateMany(selector, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    } else {
      if (state.integrationRoleGrant?.phase !== 'active') Q.fail('No active grant control.');
      Q.restoreSnapshots(state.integrationRoleGrant.snapshots);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'integrationRoleGrant.phase': 'restored' } });
    }
    Q.printObject({ command, phase: command.startsWith('stage-') ? 'expired-fixture' : 'restored' });
  }
  else if (/^stage-integration-(admin-role-loss|operator-role-loss|admin-block|operator-block|dual-role)$/.test(command)
      || command === 'restore-integration-role-control') {
    const state = Q.activeState(scenario, true);
    if (!state.integrationRoles) Q.fail('Capture role profiles first.');
    const saved = state.integrationRoleControl;
    if (command === 'restore-integration-role-control') {
      if (!saved || saved.phase !== 'active') Q.fail('No active role control to restore.');
      const set = {}, unset = {};
      for (const [field, original] of Object.entries(saved.fields)) {
        if (original.present) set[field] = original.value; else unset[field] = '';
      }
      Q.collection('users').updateOne({ userId: saved.owner }, {
        ...(Object.keys(set).length ? { $set: set } : {}), ...(Object.keys(unset).length ? { $unset: unset } : {}) });
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'integrationRoleControl.phase': 'restored' } });
    } else {
      if (saved?.phase === 'active') Q.fail('Restore the previous role control first.');
      const owner = command.includes('operator-') ? 'operator@myscoutee.local' : 'admin-demo-ava';
      const row = Q.collection('users').findOne({ userId: owner });
      if (!row) Q.fail('Retained role profile is missing.');
      const fields = Object.fromEntries(['email', 'operator', 'status', 'profileStatus'].map(field => [field,
        { present: Object.prototype.hasOwnProperty.call(row, field), value: row[field] ?? null }]));
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        integrationRoleControl: { owner, fields, phase: 'active', command }
      } });
      const change = command.endsWith('-block') ? { status: 'B', profileStatus: 'blocked' }
        : command.endsWith('dual-role') ? { operator: true }
        : { email: 'msc116-no-role@qa.myscoutee.test', operator: false };
      Q.collection('users').updateOne({ userId: owner }, { $set: change });
    }
    Q.printObject({ command, phase: command.startsWith('restore-') ? 'restored' : 'active' });
  }
  else if (['capture-integration-registry', 'integration-registry-status', 'restore-integration-registry'].includes(command)) {
    const state = Q.activeState(scenario, true);
    const names = ['operatorRegistrySettings', 'operatorClaimSubmissionSnapshots', 'revenueReportOutbox', 'qualifiedMauReportOutbox'];
    if (command === 'capture-integration-registry') {
      if (!state.integrationRoles || !state.integrationEvents) Q.fail('Capture role and Events baselines first.');
      if (state.integrationRegistry) Q.fail('Registry baseline is already retained.');
      const conflicts = Q.collection(Q.STATE_COLLECTION).find({ _id: { $ne: state._id } }).toArray()
        .filter(row => names.some(name => JSON.stringify(row).includes(name)));
      if (conflicts.length) Q.fail('Another retained fixture references Registry collections; inspect overlap first.');
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { integrationRegistry: {
        phase: 'baseline-ready', snapshots: Q.snapshotSpecs(names.map(collection => ({ collection, selector: {} })))
      } } });
    } else if (command === 'restore-integration-registry') {
      if (!state.integrationRegistry || state.integrationRegistry.phase !== 'baseline-ready') Q.fail('No active paired Registry baseline.');
      Q.restoreSnapshots(state.integrationRegistry.snapshots);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'integrationRegistry.phase': 'restored' } });
    }
    const saved = Q.activeState(scenario, true).integrationRegistry;
    Q.printObject({ scenario, checkpointId, phase: saved ? saved.phase : 'not-staged',
      counts: Object.fromEntries(names.map(name => [name, Q.collection(name).countDocuments({})])),
      externalState: 'Use operator-registry-fixture.py --checkpoint mcp-events for paired stage/reset.' });
  }
  else if (command === 'capture-integration-events') {
    const state = Q.activeState(scenario, true); baseline();
    if (!state.integrationEvents) {
      const selector = { ownerUserId: { $in: [...profileIds, 'admin-demo-ava', 'operator@myscoutee.local'] } };
      const deliveryIds = Q.collection('integrationWebhookDeliveries').find(selector, { _id: 1 }).toArray().map(row => row._id);
      const snapshots = Q.snapshotSpecs([
        { collection: 'mcpEventSubscriptions', selector },
        { collection: 'integrationWebhookDeliveries', selector },
        { collection: 'integrationWebhookRetries', selector: { 'request.deliveryId': { $in: deliveryIds } } }
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        integrationEvents: { selector, snapshots, capturedAtIso: Q.nowIso() }
      } });
    }
    if (!state.integrationEvents?.clients) Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      'integrationEvents.clients': Q.snapshotSpecs([
        { collection: 'mcpOAuthClients', selector: { name: { $regex: '^MSC116 QA Events ' } } }
      ])
    } });
    Q.printObject({ command, phase: 'events-baseline-retained' });
  }
  else if (command === 'clear-events-backlog' || /^stage-events-backlog-(profile-(998|999|1000)|database-(9998|9999|10000))$/.test(command)) {
    const state = Q.activeState(scenario, true);
    if (!state.integrationEvents) Q.fail('Capture the Events baseline first.');
    const collection = Q.collection('integrationWebhookDeliveries');
    const selector = { _id: /^msc116-events-backlog-/ };
    if (!state.integrationEvents.backlog) {
      if (collection.countDocuments(selector)) Q.fail('Unexpected backlog fixture IDs already exist.');
      const snapshots = Q.snapshotSpecs([{ collection: 'integrationWebhookDeliveries', selector }]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'integrationEvents.backlog': snapshots } });
    } else Q.restoreSnapshots(state.integrationEvents.backlog);
    if (command !== 'clear-events-backlog') {
      const parts = command.split('-'), scope = parts[3], target = Number(parts[4]);
      const owner = 'group:myscoutee-community:af0436815ab38f4864dd1e24';
      const source = collection.findOne({ ownerUserId: owner, protocol: 'mcp-events', status: 'SENT' });
      if (!source) Q.fail('A real delivered Events envelope is required before staging backlog.');
      const active = { protocol: 'mcp-events', status: { $in: ['PENDING', 'RETRY', 'SENDING'] },
        ...(scope === 'profile' ? { ownerUserId: owner } : {}) };
      const existing = collection.countDocuments(active), count = target - existing;
      if (count < 0 || count > 10000) Q.fail('Existing backlog exceeds the requested boundary.');
      const otherOwners = profileIds.filter(id => id !== owner);
      const now = new Date(), future = new Date(now.getTime() + 2 * 3600000).toISOString();
      const rows = Array.from({ length: count }, (_, i) => ({ ...source,
        _id: `msc116-events-backlog-${i}`, ownerUserId: scope === 'profile' ? owner : otherOwners[i % otherOwners.length],
        status: 'PENDING', attemptCount: 0, nextAttemptAtIso: future, createdAtIso: now.toISOString(),
        deleteAfter: new Date(now.getTime() + 7 * 86400000), lastError: null }));
      for (let offset = 0; offset < rows.length; offset += 500) collection.insertMany(rows.slice(offset, offset + 500));
      Q.printObject({ command, scope, target, retainedActive: existing, inserted: count,
        actual: collection.countDocuments(active), dueNow: collection.countDocuments({ ...selector, nextAttemptAtIso: { $lte: Q.nowIso() } }) });
    } else Q.printObject({ command, remaining: collection.countDocuments(selector) });
  }
  else if (command === 'capture-integration-catalog') {
    const state = Q.activeState(scenario, true); baseline();
    if (!state.integrationCatalog) {
      const snapshots = Q.snapshotSpecs(['integrationExternalIds', 'integrationParticipantInvites', 'events', 'activityResources']
        .map(collection => ({ collection, selector: ownedSelector })));
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        integrationCatalog: { snapshots, capturedAtIso: Q.nowIso() }
      } });
    }
    Q.printObject({ command, phase: 'integration-baseline-retained' });
  }
  else if (command === "capture-admin-content") {
    const state = Q.activeState(scenario, true);
    if (!state.adminContent) {
      const adminIds = ['admin-demo-ava', ...groups.map(group => `group:${group}:admin-demo-ava`)];
      const snapshots = Q.snapshotSpecs([
        { collection: 'users', selector: { userId: { $in: adminIds } } },
        { collection: 'ideaPosts', selector: { title: { $regex: '^MSC11[56] QA admin103 ' }, createdUser: { $in: adminIds } } }
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        adminContent: { snapshots, capturedAtIso: Q.nowIso() }
      } });
    }
    status(true);
  }
  else if (command === "capture-admin-jobs") {
    const state = Q.activeState(scenario, true);
    if (!state.adminJobs) {
      // The existing demo exchange feed is the input. Capture all three scopes
      // so the manual Work run has independent unchanged-group controls.
      if (Q.collection('payments').countDocuments({ auditKind: 'payment', euro: null, accountedSpentAmount: { $gt: 0 } })) {
        Q.fail('Pending payment conversion exists; do not run the exchange control against unrelated payments.');
      }
      const snapshots = Q.snapshotSpecs([
        { collection: 'notificationRuleConfigs', selector: { ruleKey: 'payment-exchange-rates' } },
        { collection: 'exchangeRates', selector: {} }
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        adminJobs: { snapshots, capturedAtIso: Q.nowIso() }
      } });
    }
    status(true);
  }
  else if (command === "capture-service-catalog") {
    const state = Q.activeState(scenario, true);
    if (state.serviceDiscovery) Q.fail("Restore temporary service discovery before capturing the permanent catalog.");
    const previous = state.snapshots.find(s => s.collection === "serviceOfferings");
    if (!previous || previous.documents.length || previous.selector.ownerAccountId) Q.fail("Service catalog was already captured; keep its original baseline.");
    // Upgrade the retained pre-service checkpoint: offerings belong to accounts,
    // while the old generic snapshot selected profile-owned fields only.
    const snapshot = Q.snapshotSpecs([{ collection: "serviceOfferings", selector: serviceSelector }])[0];
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      snapshots: state.snapshots.map(s => s.collection === "serviceOfferings" ? snapshot : s)
    } });
    status(true);
  }
  else if (command === 'restore-feedback-evaluation-answers') {
    const state = Q.activeState(scenario, true);
    if (!state.feedbackEvaluation?.rebased) Q.fail('The retained, rebased feedback fixture is required.');
    const rows = state.feedbackEvaluation.snapshots.flatMap(s => s.documents);
    const ids = rows.map(r => r._id);
    if (Q.collection('feedbackEvaluations').countDocuments({ _id: { $nin: ids } })
        || Q.collection('feedbackEvaluations').countDocuments({ 'counterState.pending.0': { $exists: true } }))
      Q.fail('Uncaptured or unfinished feedback exists; do not reset its projection.');
    // Restore only this fixture's answers. Clear their projection receipts so
    // the existing worker can replay the retained pending rows exactly once.
    for (const user of Q.collection('users').find(userSelector).toArray()) {
      const unset = {};
      for (const key of Object.keys(user.menuCounterVersions || {}))
        if (key.startsWith('feedbackEvaluation-')) unset[`menuCounterVersions.${key}`] = '';
      for (const key of Object.keys(user.menuCounters || {}))
        if (key.startsWith('feedbackEvaluation_') || key === 'feedback') unset[`menuCounters.${key}`] = '';
      if (Object.keys(unset).length) Q.collection('users').updateOne({ _id: user._id }, { $unset: unset });
    }
    Q.restoreSnapshots(state.feedbackEvaluation.snapshots);
    Q.collection('feedbackEvaluations').updateMany({ _id: { $in: ids } }, { $unset: { counterState: '' } });
    Q.printObject({ command, restoredAnswers: ids.length, owner: 'FeedbackEvaluationCounters' });
  }
  else if (command === 'rebase-feedback-evaluation-baseline') {
    const state = Q.activeState(scenario, true);
    if (!state.feedbackEvaluation || state.feedbackEvaluation.rebased) Q.fail('An unrepaired feedback snapshot is required.');
    const rows = state.feedbackEvaluation.snapshots.flatMap(s => s.documents);
    const users = Q.collection('users').find(userSelector).toArray();
    // Old QA feedback survived a seed users replacement. Never bypass an
    // existing receipt or fabricate counters: only the all-missing baseline
    // may be replayed by the normal FeedbackEvaluationCounters worker.
    if (!rows.length || users.some(u => Object.keys(u.menuCounterVersions || {}).some(k => k.startsWith('feedbackEvaluation-')))
        || users.some(u => Object.entries(u.menuCounters || {}).some(([k,v]) => (k.startsWith('feedbackEvaluation_') || k === 'feedback') && v !== 0)))
      Q.fail('Feedback projection is not an empty, safely replayable baseline.');
    if (Q.collection('feedbackEvaluations').countDocuments({ _id: { $nin: rows.map(r => r._id) } }))
      Q.fail('Uncaptured feedback exists; do not rebase unrelated state.');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { 'feedbackEvaluation.rebased': true } });
    Q.restoreSnapshots(state.feedbackEvaluation.snapshots);
    Q.collection('feedbackEvaluations').updateMany({ _id: { $in: rows.map(r => r._id) } }, { $unset: { counterState: '' } });
    Q.printObject({ command, replayRequested: rows.length, owner: 'FeedbackEvaluationCounters' });
  }
  else if (['stage-feedback-image-missing', 'stage-feedback-image-hidden', 'stage-feedback-image-deleted', 'restore-feedback-image'].includes(command)) {
    const state = Q.activeState(scenario, true);
    if (!state.feedbackEvaluation) Q.fail('Capture feedback before image controls.');
    const selector = { _id: 'service-anna-meters', ownerAccountId: actors[0].id };
    if (command === 'restore-feedback-image') {
      if (state.feedbackImageControl) Q.restoreSnapshots(state.feedbackImageControl);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $unset: { feedbackImageControl: '' } });
    } else {
      if (state.feedbackImageControl) Q.fail('Restore the previous image control first.');
      if (!Q.collection('serviceOfferings').findOne(selector)) Q.fail('Expected retained service is missing.');
      const snapshots = Q.snapshotSpecs([{ collection: 'serviceOfferings', selector }]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { feedbackImageControl: snapshots } });
      if (command === 'stage-feedback-image-deleted') Q.collection('serviceOfferings').deleteOne(selector);
      else Q.collection('serviceOfferings').updateOne(selector, { $set: command === 'stage-feedback-image-hidden' ? { status: 'draft' } : { imageUrls: [] } });
    }
    Q.printObject({ command, restored: command === 'restore-feedback-image' });
  }
  else if (command === "capture-feedback-evaluation") {
    const state = Q.activeState(scenario, true);
    if (!state.caseCatalog) Q.fail('Capture the case catalog before feedback QA.');
    if (!state.feedbackEvaluation) {
      const snapshots = Q.snapshotSpecs([{ collection: 'feedbackEvaluations', selector: { $or: [
        { viewerAccountId: { $in: accountIds } }, { providerAccountId: { $in: accountIds } }
      ] } }]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        feedbackEvaluation: { snapshots, capturedAtIso: Q.nowIso() }
      } });
    }
    status(true);
  }
  else if (command === "capture-service-ratings") {
    const state = Q.activeState(scenario, true);
    if (!state.serviceRatings) {
      const inUsers = { $in: actors.map(a => `group:myscoutee-community:${a.id}`) };
      // The fullscreen Go action also rates the provider. Retain its relations
      // before pagination, using the existing activity-rating snapshot boundary.
      const snapshots = Q.snapshotSpecs([
        { collection: "userRates", selector: { $or: [{ ownerUserId: inUsers }, { relatedUserId: inUsers }, { secondaryRelatedUserId: inUsers }] } },
        ...["userFriendships", "userAffinityEdges"].map(collection => ({ collection,
          selector: { $or: [{ leftUserId: inUsers }, { rightUserId: inUsers }] } })),
        { collection: "affinityRecomputeTasks", selector: { targetId: inUsers } }
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { serviceRatings: { snapshots, capturedAtIso: Q.nowIso() } } });
    }
    status(true);
  }
  else if (['arm-schedule-exclusion', 'verify-schedule-exclusion'].includes(command)) scheduleExclusion(command);
  else if (['replay-schedule-occurrence', 'verify-schedule-occurrence', 'retry-schedule-delivery', 'verify-schedule-delivery'].includes(command)) scheduleRetry(command);
  else if (command === "capture-mixing-event") {
    const state = Q.activeState(scenario, true); baseline();
    const eventId = Q.text(process.env.MANUAL_QA_EVENT_ID);
    const editorDraft = /^h[0-9]{10,20}$/.test(eventId);
    const apiEventId = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(eventId);
    if (!editorDraft && !apiEventId) Q.fail('Provide an editor draft or disposable integration event ID in MANUAL_QA_EVENT_ID.');
    const catalog = state.mixingCatalog || { eventIds: [], snapshots: [], capturedAtIso: Q.nowIso() };
    if (!catalog.eventIds.includes(eventId)) {
      if (editorDraft && Q.collection('events').countDocuments({ $or: [{ sourceId: eventId }, { _id: eventId }] }))
        Q.fail('Capture the event before its first save.');
      if (apiEventId) {
        // API creation assigns the internal UUID. Capture immediately afterward,
        // before admission or Mingle actions; the earlier integration snapshot
        // owns removal of this new event during reset.
        const savedEvents = state.integrationCatalog && state.integrationCatalog.snapshots.find(s => s.collection === 'events');
        const event = Q.collection('events').findOne({ $and: [ownedSelector,
          { $or: [{ sourceId: eventId }, { _id: eventId }] }, { title: 'MSC116 QA Events Mingle' }] });
        if (!savedEvents || !event || savedEvents.documents.some(e => e._id === event._id)
          || Q.collection('activityMingleSessions').countDocuments({ eventId })
          || Q.collection('activityMingleRounds').countDocuments({ eventId }))
          Q.fail('Expected a new captured-actor integration Mingle event before its first session.');
      }
      const prefix = `^${eventId}(?::|$)`;
      const related = { $or: ['sourceId', 'eventId', 'ownerId', 'entityId', 'targetId', 'chatId', 'parentEventId', 'payload.eventId']
        .map(field => ({ [field]: { $regex: prefix } })) };
      const specs = ['events', 'activityMembers', 'activityResources', 'activitySubEventGroups',
        'activitySubEventStageRuntime', 'activityMingleSessions', 'activityMingleRounds', 'eventLeaderboardEntries',
        'chats', 'chatMessages', 'eventCheckoutBasketItems', 'payments', 'eventTickets',
        'notificationOutbox', 'userNotifications', 'scheduledMessageTasks']
        .map(collection => ({ collection, selector: related }));
      if (!catalog.eventIds.length) {
        const profiles = { $or: [{ userId: { $in: accountIds } }, { accountUserId: { $in: accountIds } }] };
        const ids = Q.collection('users').find(profiles, { userId: 1 }).toArray().map(user => user.userId);
        specs.push({ collection: 'users', selector: profiles },
          { collection: 'userRates', selector: { $or: ['ownerUserId', 'relatedUserId', 'secondaryRelatedUserId'].map(field => ({ [field]: { $in: ids } })) } },
          { collection: 'userAffinityEdges', selector: { $or: ['leftUserId', 'rightUserId'].map(field => ({ [field]: { $in: ids } })) } },
          { collection: 'affinityRecomputeTasks', selector: { targetId: { $in: ids } } });
      }
      catalog.eventIds.push(eventId);
      catalog.snapshots.push(...Q.snapshotSpecs(specs));
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { mixingCatalog: catalog } });
    }
    // A previously prepared, still-unsaved draft can refine this snapshot safely.
    const oldTasks = catalog.snapshots.find(snapshot => snapshot.collection === 'affinityRecomputeTasks' && snapshot.selector.userId);
    if (oldTasks) {
      if (Q.collection('events').countDocuments({ sourceId: { $in: catalog.eventIds } })) Q.fail('Cannot refine a mixing baseline after save.');
      const replacement = Q.snapshotSpecs([{ collection: 'affinityRecomputeTasks', selector: { targetId: oldTasks.selector.userId } }])[0];
      catalog.snapshots = catalog.snapshots.map(snapshot => snapshot === oldTasks ? replacement : snapshot);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { mixingCatalog: catalog } });
    }
    Q.printObject({ command, phase: 'mixing-event-baseline-retained', eventIds: catalog.eventIds });
  }
  else if (command === "capture-payment-catalog") {
    const state = Q.activeState(scenario, true); baseline();
    if (!state.paymentCatalog) {
      if (Q.collection('payments').countDocuments({ receiptNote: { $regex: '^MSC11[56] QA payment ' } }))
        Q.fail('Capture payments before creating the disposable manual receipts.');
      const receiptId = `^cash:(?:group:[^:]+:)?(?:${accountIds.join('|')}):`;
      const profiles = { $or: [{ userId: { $in: accountIds } }, { accountUserId: { $in: accountIds } }] };
      const snapshots = Q.snapshotSpecs([
        { collection: 'payments', selector: { _id: { $regex: receiptId } } },
        { collection: 'users', selector: profiles },
        { collection: 'notificationOutbox', selector: { entityId: { $regex: receiptId } } },
        { collection: 'userNotifications', selector: { sourceId: { $regex: receiptId } } }
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { paymentCatalog: {
        snapshots, capturedAtIso: Q.nowIso()
      } } });
    }
    Q.printObject({ command, phase: 'payment-baseline-retained' });
  }
  else if (command === "capture-announcement-catalog") {
    const state = Q.activeState(scenario, true); baseline();
    if (!state.announcementCatalog) {
      if (Q.collection('communityAnnouncements').countDocuments({ title: { $regex: '^MSC11[56] QA announcement ' } }))
        Q.fail('Capture announcements before creating the disposable notices/votes.');
      const selector = { $or: [{ authorAccountId: { $in: accountIds } }, { title: { $regex: '^MSC11[56] QA announcement ' } }] };
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { announcementCatalog: {
        snapshots: Q.snapshotSpecs([{ collection: 'communityAnnouncements', selector }]), capturedAtIso: Q.nowIso()
      } } });
    }
    Q.printObject({ command, phase: 'announcement-baseline-retained' });
  }
  else if (['stage-announcement-former-member', 'restore-announcement-member'].includes(command)) {
    const state = Q.activeState(scenario, true);
    if (command === 'restore-announcement-member') {
      if (state.announcementMemberControl) {
        Q.restoreSnapshots(state.announcementMemberControl);
        Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $unset: { announcementMemberControl: '' } });
      }
      Q.printObject({ command, phase: 'membership-restored' });
    } else {
      if (!state.announcementCatalog || state.announcementMemberControl) Q.fail('Retained announcement baseline and no active member control required.');
      const selector = { ownerType: 'community', ownerId: 'community-park-court', userId: actors[1].id };
      const member = Q.collection('activityMembers').findOne(selector);
      if (!member || member.status !== 'accepted' || member.role === 'Admin') Q.fail('Expected accepted Maya member control.');
      const snapshots = Q.snapshotSpecs([{ collection: 'activityMembers', selector }]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { announcementMemberControl: snapshots } });
      Q.collection('activityMembers').updateOne({ _id: member._id, status: 'accepted' }, { $set: { status: 'left' } });
      Q.printObject({ command, phase: 'former-member', userId: actors[1].id });
    }
  }
  else if (['stage-integration-former-member', 'restore-integration-member'].includes(command)) {
    const state = Q.activeState(scenario, true);
    if (command === 'restore-integration-member') {
      if (state.integrationMemberControl) {
        Q.restoreSnapshots(state.integrationMemberControl);
        Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $unset: { integrationMemberControl: '' } });
      }
      Q.printObject({ command, phase: 'membership-restored' });
    } else {
      if (state.integrationMemberControl) Q.fail('Restore the existing integration member control first.');
      const selector = { ownerType: 'community', ownerId: 'myscoutee-work', userId: actors[3].id };
      const member = Q.collection('activityMembers').findOne(selector);
      if (!member || member.status !== 'accepted') Q.fail('Expected Alex’s accepted Work membership.');
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
        integrationMemberControl: Q.snapshotSpecs([{ collection: 'activityMembers', selector }])
      } });
      Q.collection('activityMembers').updateOne({ _id: member._id, status: 'accepted' }, { $set: { status: 'left' } });
      Q.printObject({ command, phase: 'former-member' });
    }
  }
  else if (command === "announcement-media-prefixes") {
    const state = Q.activeState(scenario, true), catalog = state.announcementCatalog;
    const retainedIds = catalog ? catalog.snapshots.flatMap(snapshot => snapshot.documents.map(a => a._id)) : [];
    const created = catalog ? Q.collection('communityAnnouncements').find({
      title: { $regex: '^MSC11[56] QA announcement ' }, authorAccountId: { $in: accountIds },
      _id: { $nin: retainedIds }, createdAtIso: { $gte: catalog.capturedAtIso }
    }).toArray() : [];
    // The editor uploads as the active Community profile, not its account ID.
    // Keep the entire disposable entity prefix so removed attachments are included.
    Q.printObject({ prefixes: created.map(a => `private/documents/group-${a.communityId}-${a.authorAccountId}/${a._id}/`) });
  }
  else if (command === "capture-schedule-catalog") {
    const state = Q.activeState(scenario, true);
    baseline();
    if (!state.scheduledTaskCatalog) {
      const selector = { $or: [{ ownerAccountId: { $in: accountIds } }, { title: { $regex: '^MSC11[56] QA schedule ' } }] };
      if (Q.collection('communityScheduledTasks').countDocuments({ title: { $regex: '^MSC11[56] QA schedule ' } }))
        Q.fail('Capture the schedule baseline before creating disposable schedules.');
      const snapshots = Q.snapshotSpecs([{ collection: 'communityScheduledTasks', selector }]);
      // UI creates the personal/group schedules. This only records the cleanup
      // boundary and the shared future minute; it never fabricates worker outcomes.
      const boundaryAt = new Date(Math.ceil((Date.now() + 6 * 60000) / 60000) * 60000);
      const startAt = new Date(boundaryAt.getTime() + 45 * 86400000);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { scheduledTaskCatalog: {
        snapshots, capturedAtIso: Q.nowIso(), boundaryAtIso: boundaryAt.toISOString(), startAtIso: startAt.toISOString()
      } } });
    }
    status(true);
  }
  else if (command === "capture-case-catalog") {
    const state = Q.activeState(scenario, true);
    if (!state.caseCatalog) {
      const selector = { $or: [{ ownerAccountId: { $in: accountIds } },
        { participantAccountIds: { $in: accountIds } }, { title: { $regex: '^MSC11[56] QA ' } }] };
      if (Q.collection('serviceCases').countDocuments({ title: { $regex: '^MSC11[56] QA ' } }))
        Q.fail('Capture the case baseline before creating disposable MSC115 QA cases.');
      const snapshots = Q.snapshotSpecs([{ collection: 'serviceCases', selector }]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { caseCatalog: { snapshots, capturedAtIso: Q.nowIso() } } });
    }
    status(true);
  }
  else if (command === "stage-service-discovery") { stageServiceDiscovery(); status(true); }
  else if (command === "stage-deleted-service-provider" || command === "restore-service-provider") {
    serviceProviderControl(command === "restore-service-provider");
    status(false);
  }
  else if (command === "stage-service-calendar" || command === "restore-service-calendar") {
    serviceCalendarControl(command === "restore-service-calendar");
    status(false);
  }
  else if (command === "restore-service-discovery") {
    const state = Q.activeState(scenario, true);
    if (!state.serviceDiscovery) Q.fail("Service discovery is not staged.");
    Q.restoreSnapshots(state.serviceDiscovery.snapshots);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $unset: { serviceDiscovery: "" } });
    status(false);
  }
  else if (command === "schedule-auto-inviter" || command === "restore-auto-inviter") {
    autoInviterSchedule(command === "restore-auto-inviter");
    status(false);
  }
  else if (command === "accept-seed-images") {
    const state = Q.activeState(scenario, true);
    const snapshot = state.snapshots.find(s => s.collection === "campaigns");
    if (!snapshot) Q.fail("Campaign baseline snapshot missing.");
    const documents = snapshot.documents.map(previous => {
      const current = Q.collection("campaigns").findOne({ _id: previous._id });
      const changedKeys = current ? [...new Set([...Object.keys(previous), ...Object.keys(current)])]
        .filter(key => key !== 'imageUrls' && !Q.sameJson(previous[key], current[key])) : ['missing'];
      if (!current?.imageUrls?.length || changedKeys.length) {
        Q.fail(`Campaign ${previous._id} differs beyond the canonical image correction: ${changedKeys.join(', ')}; images=${current?.imageUrls?.length ?? 0}.`);
      }
      return current;
    });
    snapshot.documents = documents;
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: { snapshots: state.snapshots } });
    Q.printObject({ scenario, checkpointId, phase: "canonical-images-retained", campaigns: documents.length });
  }
  else if (command === "reset") {
    if (Q.activeState(scenario, true).integrationRegistry?.phase === 'baseline-ready')
      Q.fail('Restore the paired Registry baseline with operator-registry-fixture.py --checkpoint mcp-events first.');
    autoInviterSchedule(true);
    serviceProviderControl(true);
    serviceCalendarControl(true);
    const state = Q.activeState(scenario, true);
    if (state.integrationRatingCards?.phase === 'active') Q.restoreSnapshots(state.integrationRatingCards.snapshots);
    if (state.mixingCatalog) Q.restoreSnapshots(state.mixingCatalog.snapshots);
    if (state.adminContent) Q.restoreSnapshots(state.adminContent.snapshots);
    // Only Work was exercised; the other scopes were read-only controls.
    if (state.adminJobs) Q.restoreSnapshots(state.adminJobs.snapshots.map(snapshot => ({
      ...snapshot,
      selector: { ...snapshot.selector, baseGroupId: 'myscoutee-work' },
      documents: snapshot.documents.filter(document => document.baseGroupId === 'myscoutee-work')
    })));
    if (state.paymentCatalog) Q.restoreSnapshots(state.paymentCatalog.snapshots);
    if (state.serviceRatings) Q.restoreSnapshots(state.serviceRatings.snapshots);
    if (state.feedbackImageControl) Q.restoreSnapshots(state.feedbackImageControl);
    if (state.announcementMemberControl) Q.restoreSnapshots(state.announcementMemberControl);
    if (state.integrationMemberControl) Q.restoreSnapshots(state.integrationMemberControl);
    if (state.integrationEvents) {
      // This block creates new API-owned assets only; never restore or delete
      // pre-existing assets sharing an actor. The retained start time bounds it.
      Q.collection('assets').deleteMany({ ...state.integrationEvents.selector,
        title: 'MSC116 QA Events owned asset', createdDate: { $gte: state.integrationEvents.capturedAtIso } });
      const deliveryIds = Q.collection('integrationWebhookDeliveries').find(state.integrationEvents.selector, { _id: 1 })
        .toArray().map(row => row._id);
      Q.collection('integrationWebhookRetries').deleteMany({ 'request.deliveryId': { $in: deliveryIds } });
      Q.restoreSnapshots(state.integrationEvents.snapshots);
      if (state.integrationEvents.backlog) Q.restoreSnapshots(state.integrationEvents.backlog);
      if (state.integrationEvents.clients) Q.restoreSnapshots(state.integrationEvents.clients);
    }
    if (state.integrationCatalog) Q.restoreSnapshots(state.integrationCatalog.snapshots);
    if (state.integrationProducers) Q.restoreSnapshots(state.integrationProducers.snapshots);
    if (state.integrationRoles) Q.restoreSnapshots(state.integrationRoles.snapshots);
    if (state.serviceDiscovery) Q.restoreSnapshots(state.serviceDiscovery.snapshots);
    if (state.scheduledTaskCatalog) {
      // Worker-created outbox rows use a system actor, so the original actor-owned
      // snapshot does not cover them. Remove only new disposable schedule cases'
      // deliveries; canonical schedules and pre-capture outboxes stay untouched.
      const retainedIds = state.scheduledTaskCatalog.snapshots.flatMap(snapshot => snapshot.documents.map(t => t._id));
      const disposableIds = Q.collection('communityScheduledTasks').find({
        title: { $regex: '^MSC11[56] QA schedule ' }, ownerAccountId: { $in: accountIds },
        _id: { $nin: retainedIds }, createdAtIso: { $gte: state.scheduledTaskCatalog.capturedAtIso }
      }).toArray().map(t => t._id);
      const caseIds = Q.collection('serviceCases').find({ scheduledTaskId: { $in: disposableIds } }).toArray().map(c => c._id);
      if (caseIds.length) Q.collection('notificationOutbox').deleteMany({
        entityId: { $in: caseIds }, createdUser: 'community-scheduled-cases',
        createdDate: { $gte: state.scheduledTaskCatalog.capturedAtIso }
      });
      Q.restoreSnapshots(state.scheduledTaskCatalog.snapshots);
    }
    if (state.announcementCatalog) {
      const catalog = state.announcementCatalog;
      const retainedIds = catalog.snapshots.flatMap(snapshot => snapshot.documents.map(a => a._id));
      const created = Q.collection('communityAnnouncements').find({ title: { $regex: '^MSC11[56] QA announcement ' },
        authorAccountId: { $in: accountIds }, _id: { $nin: retainedIds }, createdAtIso: { $gte: catalog.capturedAtIso }
      }).toArray();
      Q.collection('notificationOutbox').deleteMany({ entityId: { $in: created.map(a => a._id) },
        createdDate: { $gte: catalog.capturedAtIso }, createdUser: 'community-voting-close' });
      Q.restoreSnapshots(catalog.snapshots);
    }
    if (state.caseCatalog) {
      const retainedIds = state.caseCatalog.snapshots.flatMap(snapshot => snapshot.documents.map(c => c._id));
      const disposableIds = Q.collection('serviceCases').find({ title: { $regex: '^MSC11[56] QA ' },
        ownerAccountId: { $in: accountIds }, _id: { $nin: retainedIds }
      }).toArray().map(c => c._id);
      // Earlier case lifecycle checks may already have produced eligibility.
      // Those rows must not survive removal of their disposable parent cases.
      const feedbackIds = Q.collection('feedbackEvaluations').find({ caseId: { $in: disposableIds } }).toArray().map(f => f._id);
      if (state.feedbackEvaluation) Q.restoreSnapshots(state.feedbackEvaluation.snapshots);
      Q.collection('feedbackEvaluations').deleteMany({ caseId: { $in: disposableIds } });
      Q.collection('notificationOutbox').deleteMany({ entityType: 'feedback-evaluation', entityId: { $in: feedbackIds } });
      const taskKeys = Q.collection('scheduledMessageTasks').find({ actionKey: 'case.feedback.prepare' }).toArray()
        .filter(task => typeof task.taskKey === "string" && disposableIds.some(id => task.taskKey.startsWith(`case-feedback:${id}:`))).map(task => task.taskKey);
      for (const collection of ['scheduledMessageTasks', 'scheduledMessageRuns', 'scheduledMessageDeliveries']) {
        Q.collection(collection).deleteMany({ taskKey: { $in: taskKeys } });
      }
      Q.restoreSnapshots(state.caseCatalog.snapshots);
    } else if (state.feedbackEvaluation) Q.restoreSnapshots(state.feedbackEvaluation.snapshots);
    Q.restoreSnapshots(state.snapshots);
    // Restored users precede re-arming the existing worker, so cleanup does
    // not recreate the stale receipt gap from the original imported baseline.
    if (state.feedbackEvaluation?.rebased) Q.collection('feedbackEvaluations').updateMany({
      _id: { $in: state.feedbackEvaluation.snapshots.flatMap(s => s.documents.map(r => r._id)) }
    }, { $unset: { counterState: '' } });
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({ scenario, checkpointId, phase: "reset-complete" });
  } else Q.fail("Unsupported MSC-115 fixture command.");
})();
