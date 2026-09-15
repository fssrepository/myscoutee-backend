#!/usr/bin/env node
// Authenticated device baseline only. No permission, login or WebView verdict.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const harness = path.join(root, 'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh');
const status = JSON.parse(execFileSync('bash', [harness, 'status', 'mobile-push', 'MOBILE-PUSH-LIFECYCLE-001'], { encoding: 'utf8' }));
if (status.phase !== 'awaiting-device-registration' || status.messages.length) throw Error('Device setup requires the initial Push baseline');
const credential = JSON.parse(readFileSync(path.join(root, 'server/projects/profile/secrets/mobile-push-provider-user.local.json'), 'utf8'));
if (credential.uid !== '650000000000000000000063') throw Error('Unexpected physical actor');
const script = `(async()=>{
  if(location.origin!=='http://localhost:8080')throw Error('Unexpected phone origin');
  const c=ng.getComponent(document.querySelector('app-entry-page'));
  if(!c)throw Error('Expected the prepared entry page');
  const current=c.sessionService.currentSession();
  if(current && (current.kind!=='firebase'||current.profile.id!==${JSON.stringify(credential.uid)}))throw Error('Another phone identity is active');
  const result=current||await c.sessionService.startFirebaseSession(${JSON.stringify({ provider: 'email', emailMode: 'sign-in', email: credential.email, password: credential.password })});
  return {kind:result?.kind||null,uid:result?.profile?.id||null,notice:c.sessionService.firebaseNotice(),permission:Notification.permission};
})()`;
// The password goes only over stdin to the existing local CDP helper.
try {
  const result = execFileSync('node', [path.join(root, 'guides/qa/tools/mobile-webview-device.mjs'), 'eval'], { input: script, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 45000 });
  console.log(result.trim());
} catch {
  throw Error('Physical-device baseline preparation failed; inspect the current phone state without printing credentials');
}
