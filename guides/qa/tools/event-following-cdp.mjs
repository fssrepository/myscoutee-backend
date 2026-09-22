#!/usr/bin/env node
// Full-flow runner for the explicitly delegated EVENT-FOLLOWING-001 checkpoint.
import { readFile } from 'node:fs/promises';
import WebSocket from '../../../frontend/node_modules/ws/index.js';
const [actor = '0', script] = process.argv.slice(2);
const checkpoint = process.env.QA_CHECKPOINT || 'EVENT-FOLLOWING-001';
if (!['EVENT-FOLLOWING-001', 'EVENT-FOLLOWING-002'].includes(checkpoint)) throw Error('Unknown checkpoint');
const manifest = JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`, 'utf8'));
const port = manifest.sessions[Number(actor)].devToolsPort;
const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
const page = pages.find(p => p.type === 'page' && p.url.startsWith('http://localhost'));
if (!page) throw Error('Checkpoint page missing');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.once('open', resolve); ws.once('error', reject); });
const deadline = setTimeout(() => { ws.close(); throw Error('CDP timeout'); }, 30000);
try {
 const expression = script ? await readFile(script, 'utf8') : `({text:document.body.innerText,buttons:[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().height).map(b=>({text:b.innerText,aria:b.getAttribute('aria-label')}))})`;
 const result = new Promise((resolve, reject) => ws.on('message', raw => {
  const m = JSON.parse(String(raw)); if (m.id !== 1) return;
  if(m.error || m.result?.exceptionDetails) reject(Error(JSON.stringify(m.error ?? m.result.exceptionDetails)));
  else resolve(m.result.result.value);
 }));
 ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression,awaitPromise:true,returnByValue:true}}));
 console.log(JSON.stringify(await result,null,2));
} finally { clearTimeout(deadline); ws.close(); }
