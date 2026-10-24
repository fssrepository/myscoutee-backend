// Delegated Group block17: use UI-created keys and the deployed MCP binary.
// Credentials stay in the private temporary directory; output is evidence only.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {openMcpStdio} from './mcp-qa-client.mjs';
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
  const client = await openMcpStdio({binary: `${root}/myscoutee-mcp`, apiBase: 'http://localhost/api',
    token: credentials.token, clientId: credentials.clientId, protocolVersion: '2025-03-26'});
  try {
    const initialization = client.initialization;
    const listing = await client.call('tools/list');
    const result = {scope, connectStatus: response.status, connection,
      server: initialization.result?.serverInfo, tools: listing.result?.tools?.map(tool => ({name: tool.name, description: tool.description})),
      discoveryError: listing.error ?? null};
    await writeFile(`${root}/${scope}-probe.json`, JSON.stringify(result, null, 2), {mode: 0o600});
    console.log(JSON.stringify(result, null, 2));
  } finally { await client.close(); }
} else { throw Error('Use capture or probe'); }
