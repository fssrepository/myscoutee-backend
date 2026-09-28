// DEPLOY-EXTERNAL-CONFIG-001 block1.4. Browser storage is a scoped fixture;
// the application owns all requests/acknowledgements after ordinary reloads.
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';

export async function runLocationRetry({send, evaluate, socket, origin, runtimeDirectory, fixturePath}) {
  const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
  const {accountId, otherAccountId, coordinates, newerCoordinates} = fixture;
  const assert = (condition, message) => { if (!condition) throw Error(message); };
  for (const point of [coordinates, newerCoordinates]) {
    assert(Number.isFinite(point?.latitude) && Number.isFinite(point?.longitude), 'Two retained coordinate samples are required');
  }
  assert(accountId && otherAccountId && accountId !== otherAccountId, 'Two scoped account identities are required');
  assert(JSON.stringify(coordinates) !== JSON.stringify(newerCoordinates), 'Samples must differ');
  const account = () => evaluate(`JSON.parse(localStorage.getItem('myscoutee.http.session.v1')||'null')?.profile?.id`);
  assert(await account() === accountId, 'The intended real Firebase account must already be signed in');
  const keys = [accountId, otherAccountId].map(id => `myscoutee.http.location.v1:${id}:pending-login`);
  const snapshotFile = path.join(runtimeDirectory, 'location-retry.before.json');
  const evidenceFile = path.join(runtimeDirectory, 'location-retry-evidence.json');
  assert(!existsSync(snapshotFile), 'Restore the retained location retry snapshot before repeating');
  const before = await evaluate(`${JSON.stringify(keys)}.map(key=>({key,value:localStorage.getItem(key)}))`);
  writeFileSync(snapshotFile, JSON.stringify({origin, accountId, before}), {mode:0o600});
  const stage = (key, point) => evaluate(`localStorage.setItem(${JSON.stringify(key)},${JSON.stringify(JSON.stringify(point))});true`);
  const pending = () => evaluate(`${JSON.stringify(keys)}.map(key=>JSON.parse(localStorage.getItem(key)||'null'))`);
  const equal = (left,right) => left?.latitude === right.latitude && left?.longitude === right.longitude;
  const records = [];
  let mode = 'fail', failure = null;
  const held = new Set();
  const waitFor = async (check, label) => {
    const until = Date.now()+30000;
    while (Date.now()<until) {
      if (failure) throw failure;
      try { if (await check()) return; } catch (error) {
        if (!/context|Cannot find|navigat/i.test(error.message)) throw error;
      }
      await new Promise(resolve=>setTimeout(resolve,200));
    }
    throw Error(`Timed out: ${label}`);
  };
  const report = (phase, details={}) => {
    records.push({phase, at:new Date().toISOString(), ...details});
    writeFileSync(evidenceFile, JSON.stringify(records,null,2), {mode:0o600});
    console.log(JSON.stringify(records.at(-1)));
  };
  const onMessage = data => {
    const event = JSON.parse(data);
    if (event.method !== 'Fetch.requestPaused') return;
    const p = event.params;
    (async()=>{
      const url = new URL(p.request.url);
      if (url.origin !== origin || url.pathname !== '/api/auth/me/profile-ext') {
        await send('Fetch.continueRequest',{requestId:p.requestId}); return;
      }
      const point = url.searchParams.has('latitude') ? {latitude:Number(url.searchParams.get('latitude')),longitude:Number(url.searchParams.get('longitude'))} : null;
      assert(!Object.keys(p.request.headers).some(name=>/^x-.*(location|latitude|longitude)/i.test(name)), 'Location must not be sent in X-headers');
      if (p.responseStatusCode === undefined) {
        if (mode === 'fail') {
          assert(equal(point,coordinates),'Reload must send the staged point of the current account');
          await send('Fetch.failRequest',{requestId:p.requestId,errorReason:'ConnectionReset'});
          report('request-failed',{correctAccountPoint:true}); return;
        }
        assert(mode === 'hold' ? equal(point,coordinates) : mode === 'retry' ? equal(point,newerCoordinates) : point === null,
          'Profile request used unexpected account coordinates');
        await send('Fetch.continueRequest',{requestId:p.requestId});
      } else {
        assert(p.responseStatusCode === 200,'Authoritative retry response must succeed');
        if (mode === 'hold') {
          held.add(p.requestId);
          report('old-response-held',{status:200});
        } else {
          await send('Fetch.continueRequest',{requestId:p.requestId});
          report(mode === 'retry' ? 'newer-point-retried' : 'other-account-isolated',{status:200});
        }
      }
    })().catch(error=>{failure=error;send('Fetch.continueRequest',{requestId:p.requestId}).catch(()=>{});});
  };
  socket.on('message',onMessage);
  try {
    await stage(keys[0],coordinates);
    await stage(keys[1],newerCoordinates);
    await send('Fetch.enable',{patterns:[{urlPattern:`${origin}/api/auth/me/profile-ext*`,requestStage:'Request'},{urlPattern:`${origin}/api/auth/me/profile-ext*`,requestStage:'Response'}]});
    await send('Page.reload');
    await waitFor(()=>records.some(r=>r.phase==='request-failed'),'failed request');
    const afterFailure=await pending();
    assert(equal(afterFailure[0],coordinates)&&equal(afterFailure[1],newerCoordinates),'Failure cleared pending coordinates');
    report('reload-and-failure-retain-pending',{current:true,other:true});
    mode='hold';
    await send('Page.reload');
    await waitFor(()=>held.size>0,'held success response');
    await stage(keys[0],newerCoordinates);
    for (const requestId of held) await send('Fetch.continueResponse',{requestId});
    held.clear();
    await waitFor(async()=>await evaluate(`!!document.querySelector('[aria-label="Open user menu"]')`),'hydrated UI');
    await new Promise(resolve=>setTimeout(resolve,500));
    assert(equal((await pending())[0],newerCoordinates),'Older response cleared the newer point');
    report('old-response-preserves-newer-point');
    mode='retry';
    await send('Page.reload');
    await waitFor(async()=>records.some(r=>r.phase==='newer-point-retried') && (await pending())[0]===null,'authoritative acknowledgement');
    assert(equal((await pending())[1],newerCoordinates),'Current-account acknowledgement touched the other account');
    report('retry-acknowledges-current-account-only');
    mode='isolate';
    await send('Page.reload');
    await waitFor(()=>records.some(r=>r.phase==='other-account-isolated'),'isolated account read');
    assert(equal((await pending())[1],newerCoordinates),'Other-account sample was consumed');
    assert(await account()===accountId,'The fixture changed the signed-in identity');
    report('PASS',{fixturePreparation:'scoped pending-location storage only',requestProducer:'normal application reload'});
  } finally {
    socket.off('message',onMessage);
    for (const requestId of held) await send('Fetch.continueResponse',{requestId}).catch(()=>{});
    await send('Fetch.disable');
    await evaluate(`for(const row of ${JSON.stringify(before)}){if(row.value===null)localStorage.removeItem(row.key);else localStorage.setItem(row.key,row.value)};true`);
    const restored = await evaluate(`${JSON.stringify(keys)}.map(key=>({key,value:localStorage.getItem(key)}))`);
    assert(JSON.stringify(restored)===JSON.stringify(before),'Scoped browser restore failed');
    unlinkSync(snapshotFile);
    report('browser-fixture-restored');
  }
}
