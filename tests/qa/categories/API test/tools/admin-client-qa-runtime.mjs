// Private runtime access for the explicitly delegated admin-client checkpoint.
import {readFile} from 'node:fs/promises';
export async function attach(checkpoint, actor = 0) {
  const manifest = JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`, 'utf8'));
  const session = manifest.sessions[actor];
  const targets = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`).then(r => r.json());
  const page = targets.find(t => t.type === 'page' && (checkpoint !== 'ADMIN-CLIENT-MONITOR-001' || new URL(t.url).hostname === '127.0.0.1'));
  if (!page) throw Error('Managed checkpoint page missing');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let serial = 0;
  const pending = new Map();
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data), task = pending.get(message.id);
    if (!task) return;
    pending.delete(message.id);
    if (message.error || message.result?.exceptionDetails) task.reject(Error('Managed browser action failed'));
    else task.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
  });
  return { session, send, close: () => ws.close(), evaluate: async expression =>
    (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value };
}

export const qaRoot = '/tmp/myscoutee-admin-client-qa-20260923';
export async function monitorRequest(route='/state', body, headers={}) {
 const instance=JSON.parse(await readFile(qaRoot+'/runtime/myscoutee-admin/instance.json','utf8'));
 return fetch(`http://127.0.0.1:${instance.port}${route}`,{method:body===undefined?'GET':'POST',headers:{'X-Monitor-Control':instance.control,'Content-Type':'application/json',...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
}
export async function monitorState(){return (await monitorRequest()).json();}
