/* global ManualQa, process */
(() => {
  const Q = ManualQa, scenario = 'admin-monitoring', checkpointId = 'ADMIN-MONITORING-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND), actor = 'admin-demo-ava';
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Expected ADMIN-MONITORING-001');
  const activeConfig = () => Q.collection('affinityConfigs').find({active:true}).sort({version:-1}).limit(1).toArray()[0];
  // Missing persisted fields use AffinityConfig.JobParameters defaults, as the backend does.
  const jobValues = config => ({userChangedDebounceSeconds:300,eventChangedDebounceSeconds:180,
    eventMembersChangedDebounceSeconds:300,assetChangedDebounceSeconds:180,assetRequestsChangedDebounceSeconds:180,
    configChangedDebounceSeconds:900,workerPollDelayMs:60000,batchSize:50,leaseDurationSeconds:600,
    eventSchedulerPollDelayMs:1800000,autoInviterCadenceMs:7200000,notificationOutboxPollDelayMs:60000,
    accountPurgeWindowDays:30,...config?.jobs});
  function evidence() {
    const state = Q.activeState(scenario), since = state?.stagedAtIso || Q.nowIso();
    return {
      at: Q.nowIso(), config: activeConfig(),
      monitoring: Q.collection('adminMonitoring').find({}).toArray(),
      rules: Q.collection('notificationRuleConfigs').find({}, {ruleKey:1,runState:1,runHistory:1}).toArray(),
      tasks: Q.collection('affinityRecomputeTasks').find({$or:[{status:{$in:['pending','running','failed']}},{createdDate:{$gte:since}}]}).toArray(),
      parameterVersions: Q.collection('affinityConfigs').find({changedDate:{$gte:since},changedUser:actor,changedSection:'jobs'}).toArray(),
      parameterOutbox: Q.collection('notificationOutbox').find({notificationType:'admin-params-changed',createdDate:{$gte:since},createdUser:actor},{payload:1,status:1,recipientUserIds:1,pendingCounterTracked:1}).toArray()
    };
  }
  if (command === 'stage') {
    Q.assertNotStaged(scenario); Q.assertNoOtherActiveScenario(scenario);
    if (Q.collection('adminJobFixtureSnapshots').countDocuments({})) Q.fail('Reset the previous Admin fixture first');
    Q.ensureUser(actor);
    const config = activeConfig();
    if (!config || !Number.isFinite(Number(jobValues(config).userChangedDebounceSeconds))) Q.fail('Jobs configuration missing');
    const specs = [
      {collection:'users',selector:{userId:actor}},
      ...['userLoginAudits','userSessionActions','userSessionStates'].map(collection=>({collection,selector:{$or:[{userId:actor},{_id:actor}]}})),
      {collection:'userNotifications',selector:{kind:'security-login',recipientUserId:actor}},
      {collection:'notificationOutbox',selector:{notificationType:'security-login',createdUser:actor}}
    ];
    Q.collection(Q.STATE_COLLECTION).insertOne({_id:Q.stateId(scenario),scenario,checkpointId,
      phase:'baseline-ready-not-started',stagedAtIso:Q.nowIso(),originalConfig:config,
      snapshots:Q.snapshotSpecs(specs),baseline:evidence(),captures:[]});
  } else if (command.startsWith('capture-')) {
    if (!['capture-before-params','capture-after-save','capture-after-revert'].includes(command)) Q.fail('Unknown capture');
    const state = Q.activeState(scenario,true);
    if (command==='capture-before-params' && Q.collection('adminJobFixtureSnapshots').countDocuments({})) Q.fail('Reset the recompute fixture before the parameter block');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:state._id},{$set:{phase:command},$push:{captures:{name:command,evidence:evidence()}}});
  } else if (command === 'reset') {
    const state = Q.activeState(scenario,true);
    if (Q.collection('adminJobFixtureSnapshots').countDocuments({})) Q.fail('Reset the controlled Admin job fixture first');
    if (!Q.sameJson(jobValues(activeConfig()),jobValues(state.originalConfig))) Q.fail('Revert the Jobs values through Params History first');
    if (Q.collection('affinityRecomputeTasks').countDocuments({status:{$in:['pending','running']}})) Q.fail('Wait for recompute tasks before cleanup');
    if (Q.collection('notificationOutbox').countDocuments({notificationType:'admin-params-changed',createdDate:{$gte:state.stagedAtIso},pendingCounterTracked:true})) Q.fail('Wait for parameter notification delivery');
    Q.restoreSnapshots(state.snapshots);
    const byId=rows=>rows.sort((a,b)=>String(a._id).localeCompare(String(b._id)));
    for(const s of state.snapshots) if(!Q.sameJson(byId(Q.collection(s.collection).find(s.selector).toArray()),byId(s.documents))) Q.fail(`Restored ${s.collection} differs; snapshot retained`);
    // Real parameter versions, audit and completed deliveries remain evidence.
    // Only launcher-owned state is restored; job fixture has its own exact reset.
    Q.collection(Q.STATE_COLLECTION).deleteOne({_id:state._id});
  } else if(command!=='status') Q.fail('Use stage|status|capture-before-params|capture-after-save|capture-after-revert|reset');
  const state=Q.activeState(scenario);
  Q.printObject({checkpointId,phase:state?.phase||'not-staged',actor,
    parameter:state&&{section:'Jobs',field:'User debounce',before:jobValues(state.originalConfig).userChangedDebounceSeconds,testValue:Number(jobValues(state.originalConfig).userChangedDebounceSeconds)+1},
    evidence:command==='status'?evidence():undefined,
    next:state?.phase==='baseline-ready-not-started'?'User starts checklist block1 step1: Admin menu → Metrics. Preparation has not executed any test action.':state?'Continue from the captured checklist boundary; do not replay earlier blocks.':'Not staged'});
})();
