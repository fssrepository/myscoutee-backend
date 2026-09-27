// Delegated Group block17: use UI-created keys and the deployed MCP binary.
// Credentials stay in the private temporary directory; output is evidence only.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {attach} from './admin-client-qa-runtime.mjs';

const [action, scope = 'group'] = process.argv.slice(2);
if (!['group', 'base'].includes(scope)) throw Error('Unknown QA scope');
const root = '/tmp/myscoutee-group-mcp-qa';
await mkdir(root, {recursive: true, mode: 0o700});
const credentialsPath = `${root}/${scope}-credentials.json`;
if (action === 'capture') {
  const browser = await attach('GROUP-LIFECYCLE-001-MCP');
  try {
    const token = await browser.evaluate(`document.querySelector('.integration-token-secret code')?.textContent.trim()`);
    if (!token) throw Error('Create a dedicated key through the normal UI first');
    await writeFile(credentialsPath, JSON.stringify({token, clientId: randomUUID()}), {mode: 0o600, flag: 'wx'});
    console.log(JSON.stringify({scope, captured: true, secretPrinted: false}));
  } finally { browser.close(); }
} else if (action === 'probe') {
  const credentials = JSON.parse(await readFile(credentialsPath, 'utf8'));
  const response = await fetch('http://localhost/api/integrations/v1/connect', {
    method: 'POST', headers: {Authorization: `Bearer ${credentials.token}`, 'X-MyScoutee-Client-Id': credentials.clientId}
  });
  const connection = response.ok ? await response.json() : null;
  const child = spawn(`${root}/myscoutee-mcp`, [], {env: {...process.env,
    MYSCOUTEE_API_BASE_URL: 'http://localhost/api', MYSCOUTEE_API_TOKEN: credentials.token,
    MYSCOUTEE_CLIENT_ID: credentials.clientId, MYSCOUTEE_MCP_TRANSPORT: 'stdio'}, stdio: ['pipe', 'pipe', 'pipe']});
  let buffer = '', serial = 0;
  const pending = new Map();
  child.stdout.on('data', data => {
    buffer += data.toString();
    let boundary;
    while ((boundary = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 1);
      if (!line.trim()) continue;
      const message = JSON.parse(line), resolve = pending.get(message.id);
      if (resolve) { pending.delete(message.id); resolve(message); }
    }
  });
  // Do not echo transport logs or upstream error bodies containing private data.
  child.stderr.resume();
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial;
    const timeout = setTimeout(() => { pending.delete(id); reject(Error('MCP response timeout')); }, 20000);
    pending.set(id, message => { clearTimeout(timeout); resolve(message); });
    child.stdin.write(JSON.stringify({jsonrpc: '2.0', id, method, params}) + '\n');
  });
  try {
    const initialization = await call('initialize', {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 'group-block17-qa', version: '1'}});
    child.stdin.write(JSON.stringify({jsonrpc: '2.0', method: 'notifications/initialized'}) + '\n');
    const listing = await call('tools/list');
    const result = {scope, connectStatus: response.status, connection,
      server: initialization.result?.serverInfo, tools: listing.result?.tools?.map(tool => ({name: tool.name, description: tool.description})),
      discoveryError: listing.error ?? null};
    await writeFile(`${root}/${scope}-probe.json`, JSON.stringify(result, null, 2), {mode: 0o600});
    console.log(JSON.stringify(result, null, 2));
  } finally { child.stdin.end(); child.kill('SIGTERM'); }
} else { throw Error('Use capture or probe'); }
