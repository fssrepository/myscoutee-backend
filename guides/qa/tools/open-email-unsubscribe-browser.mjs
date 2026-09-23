#!/usr/bin/env node
// Reuse the managed launcher; unsubscribe capability remains in private runtime files.
import {readFile,writeFile,chmod} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const phase=process.argv[2]||'operator';
let session;
if(phase==='operator') session={actor:'Email operator',sessionKind:'demo',userId:'operator@myscoutee.local',expectedName:'Demo Operator',targetUrl:'http://localhost/operator',entryUrl:'http://localhost/entry?redirect=%2Foperator',autoDismissExplanationGuide:false,window:{x:40,y:70,width:920,height:850}};
else {
 const records=(await readFile('/tmp/myscoutee-email-qa-unsubscribe.jsonl','utf8')).trim().split('\n').map(JSON.parse);
 const body=records[Number(process.env.QA_EMAIL_RECORD_INDEX||0)].payload.content.find(row=>row.type==='text/plain').value;
 const url=body.match(/http:\/\/localhost\/api\/public\/email\/unsubscribe#token=[A-Za-z0-9_-]+/)?.[0];
 if(!url)throw Error('Expected local QA unsubscribe link');
 session={actor:'Public email preferences',sessionKind:'anonymous',expectedName:'Email preferences',targetUrl:url,entryUrl:url,autoDismissExplanationGuide:false,window:{x:80,y:80,width:540,height:780}};
}
const checkpoint=phase==='operator'?'OPERATOR-EMAIL-WARNING-001':'EMAIL-UNSUBSCRIBE-001';
const config={schemaVersion:1,checkpoints:{[checkpoint]:{preserveOtherSessions:true,bootstrapEntryConsent:false,layout:{columns:1,appWindows:true},sessions:[session]}}};
const file='/tmp/email-unsubscribe-'+phase+'.private.json';await writeFile(file,JSON.stringify(config),{mode:0o600});await chmod(file,0o600);
const child=spawn(process.execPath,['guides/qa/tools/open-checkpoint-browser-sessions.mjs',checkpoint,...process.argv.slice(3)],{stdio:'inherit',env:{...process.env,QA_BROWSER_SESSION_CONFIG:file}});
child.on('exit',code=>process.exitCode=code??1);
