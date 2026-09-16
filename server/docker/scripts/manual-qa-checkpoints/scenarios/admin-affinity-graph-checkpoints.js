/* global ManualQa, process */
(() => {
  const Q=ManualQa, scenario='admin-affinity-graph', checkpointId='ADMIN-AFFINITY-GRAPH-001';
  const command=Q.text(process.env.MANUAL_QA_COMMAND), actor='admin-demo-ava';
  const ruleKey='affinity-graph-layout', prefix='manual-qa-graph:', owned={$regex:'^manual-qa-graph:'};
  Q.assertDeploymentSafety();
  if(Q.text(process.env.MANUAL_QA_CHECKPOINT_ID)!==checkpointId) Q.fail('Wrong Graph checkpoint');
  const layout=()=>Q.collection('adminAffinityGraphLayouts').find().sort({generatedAtIso:-1}).limit(1).toArray()[0];
  const summary=()=>{const l=layout();return l&&{...l,storedNodes:Q.collection('adminAffinityGraphNodes').countDocuments({layoutVersion:l.layoutVersion}),storedEdges:Q.collection('adminAffinityGraphEdges').countDocuments({layoutVersion:l.layoutVersion}),storedForests:Q.collection('adminAffinityGraphForests').countDocuments({layoutVersion:l.layoutVersion})};};
  if(command==='stage') {
    Q.assertNotStaged(scenario);Q.assertNoOtherActiveScenario(scenario);Q.ensureUser(actor);
    if(Q.collection('adminJobFixtureSnapshots').countDocuments({}))Q.fail('Reset the previous job fixture');
    const rule=Q.assertRuleNotRunning(ruleKey), l=layout();
    if(!l)Q.fail('Existing materialized baseline required');
    const nodes=Q.collection('adminAffinityGraphNodes').find({layoutVersion:l.layoutVersion}).sort({degree:1,userId:1}).toArray();
    const member=nodes.find(n=>n.degree>0), isolated=nodes.find(n=>n.name==='Riley Outside')||nodes.find(n=>n.degree===0);
    const edge=Q.collection('adminAffinityGraphEdges').find({layoutVersion:l.layoutVersion,$or:[{sourceUserId:member.userId},{targetUserId:member.userId}]}).sort({weight:-1}).limit(1).toArray()[0];
    const specs=[...['adminAffinityGraphLayouts','adminAffinityGraphNodes','adminAffinityGraphEdges','adminAffinityGraphForests'].map(collection=>({collection,selector:{}})),
      {collection:'users',selector:{$or:[{userId:actor},{userId:owned}]}},
      {collection:'userAffinityEdges',selector:{$or:[{leftUserId:owned},{rightUserId:owned}]}},
      ...['userLoginAudits','userSessionActions','userSessionStates'].map(collection=>({collection,selector:{$or:[{userId:actor},{_id:actor}]}})),
      {collection:'userNotifications',selector:{kind:'security-login',recipientUserId:actor}},
      {collection:'notificationOutbox',selector:{notificationType:'security-login',createdUser:actor}}];
    Q.collection(Q.STATE_COLLECTION).insertOne({_id:Q.stateId(scenario),scenario,checkpointId,phase:'baseline-ready',stagedAtIso:Q.nowIso(),originalRule:Q.ruleConfigSnapshot(rule),baseline:summary(),context:{member,isolated,edge},snapshots:Q.snapshotSpecs(specs)});
    Q.holdRule(ruleKey,0,'Graph QA retains the materialized baseline until the larger fixture is ready.');
  } else if(command==='prepare-larger') {
    const s=Q.activeState(scenario,true);Q.assertRuleNotRunning(ruleKey);
    if(!['baseline-ready','larger-scheduled'].includes(s.phase))Q.fail('Larger fixture already prepared');
    const users=[],edges=[],now=Q.nowIso();
    for(let c=0;c<20;c++)for(let n=0;n<5;n++){
      const id=`${prefix}${String(c).padStart(2,'0')}:${n}`;
      users.push({_id:id,userId:id,syncKey:id,name:`Graph QA ${c+1} / ${n+1}`,initials:'GQ',gender:'woman',status:'A',profileStatus:'public',city:'Austin',age:30,activities:{},createdDate:now,createdUser:'manual-qa'});
      if(n){const left=`${prefix}${String(c).padStart(2,'0')}:${n-1}`,key=`${left}|${id}`;edges.push({_id:key,pairKey:key,leftUserId:left,rightUserId:id,edgeWeight:.25+.15*n,affinityScore:.5,evidence:{mutualSingleCount:1},updatedDate:now});}
    }
    Q.collection('users').bulkWrite(users.map(document=>({replaceOne:{filter:{_id:document._id},replacement:document,upsert:true}})));
    Q.collection('userAffinityEdges').bulkWrite(edges.map(document=>({replaceOne:{filter:{_id:document._id},replacement:document,upsert:true}})));
    const timing=Q.scheduleRule(ruleKey,10);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:s._id},{$set:{phase:'larger-scheduled',larger:{users:100,edges:80,components:20,root:`${prefix}00:0`,distant:`${prefix}19:4`},...timing}});
  } else if(command==='capture-larger') {
    const s=Q.activeState(scenario,true);Q.assertRuleNotRunning(ruleKey);
    const current=summary();
    if(s.phase!=='larger-scheduled'||current.layoutVersion===s.baseline.layoutVersion)Q.fail('Normal larger materialization is not complete');
    if(Q.collection('adminAffinityGraphNodes').countDocuments({layoutVersion:current.layoutVersion,userId:owned})!==100)Q.fail('Larger nodes missing');
    Q.holdRule(ruleKey,0,'Graph QA retains its completed larger materialization.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:s._id},{$set:{phase:'larger-ready',largerResult:current}});
  } else if(command==='restore-baseline') {
    const s=Q.activeState(scenario,true);Q.assertRuleNotRunning(ruleKey);
    Q.holdRule(ruleKey,0,'Graph QA restores its original materialized baseline.');
    Q.restoreSnapshots(s.snapshots.filter(x=>x.collection.startsWith('adminAffinityGraph')));
    Q.collection('users').deleteMany({userId:owned});Q.collection('userAffinityEdges').deleteMany({$or:[{leftUserId:owned},{rightUserId:owned}]});
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:s._id},{$set:{phase:'baseline-restored'}});
  } else if(command==='reset') {
    const s=Q.activeState(scenario,true);Q.assertRuleNotRunning(ruleKey);
    Q.restoreSnapshots(s.snapshots);Q.restoreRuleConfig(s.originalRule);
    const byId=rows=>rows.sort((a,b)=>String(a._id).localeCompare(String(b._id)));
    for(const item of s.snapshots)if(!Q.sameJson(byId(Q.collection(item.collection).find(item.selector).toArray()),byId(item.documents)))Q.fail(`Graph reset mismatch: ${item.collection}`);
    Q.collection(Q.STATE_COLLECTION).deleteOne({_id:s._id});
  } else if(command!=='status')Q.fail('Use stage|status|prepare-larger|restore-baseline|reset');
  const s=Q.activeState(scenario);
  Q.printObject({checkpointId,phase:s?.phase||'not-staged',baseline:s?.baseline,context:s?.context,larger:s?.larger,current:summary(),rule:Q.ruleSummary(ruleKey)});
})();
