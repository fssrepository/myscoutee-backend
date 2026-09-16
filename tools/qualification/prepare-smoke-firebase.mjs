#!/usr/bin/env node
// Local credentials enter the deployment through its authenticated Operator API.
// Guest-side deployment-smoke-fixture stage must precede this operation.
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const root=new URL('../../',import.meta.url);
const credential=readFileSync(new URL('server/projects/profile/secrets/firebase-service-account.json',root),'utf8');
const account=JSON.parse(credential);
const client=JSON.parse(readFileSync(new URL('server/projects/profile/secrets/firebase-web-config.json',root),'utf8'));
if(account.project_id!==client.projectId||!account.private_key)throw Error('Mismatched Firebase prerequisite files');
const keys=['projectId','apiKey','authDomain','storageBucket','messagingSenderId','appId','measurementId','vapidKey'];
const firebase={...Object.fromEntries(keys.map(k=>[k,client[k]||''])),authenticationCredential:credential,messagingCredential:credential};
const script=`(async()=>{const t=sessionStorage.getItem('myscoutee.http.operator-bootstrap.token.v1');if(!t)throw Error('Operator login required');const h={Authorization:'OperatorBootstrap '+t,'Content-Type':'application/json'};const r=await fetch('/api/operator/configuration',{headers:h});if(!r.ok)return {status:r.status};const c=await r.json();if(c.firebase.active) return {status:'already-active'};if(c.firebase.authenticationCredentialConfigured||c.firebase.messagingCredentialConfigured)throw Error('Existing credentials require review');const r2=await fetch('/api/operator/configuration',{method:'PUT',headers:h,body:JSON.stringify({adminEmails:c.adminEmails,privacyContact:c.privacyContact,socialLinks:c.socialLinks,branding:c.branding,firebase:${JSON.stringify(firebase)}})});return {status:r2.status};})()`;
process.stdout.write(execFileSync('node',[new URL('guides/qa/tools/notification-admin-cdp.mjs',root).pathname,'eval','Operator'],{input:script,env:{...process.env,QA_CHECKPOINT:'DEPLOYMENT-SMOKE-001'}}));
