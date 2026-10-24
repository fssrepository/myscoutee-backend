// Real packaged MCP/Java clients. No simulated server responses or app state.
import {spawn} from 'node:child_process';
// Codex's persistent Node REPL does not expose process; standalone Node does.
const runtimeEnv = typeof process === 'undefined' ? {PATH: '/usr/bin:/bin'} : process.env;

export async function openMcpStdio({binary, args = [], apiBase, token, clientId, protocolVersion = '2025-11-25'}) {
  const child = spawn(binary, args, {env: {...runtimeEnv,
    MYSCOUTEE_API_BASE_URL: apiBase, MYSCOUTEE_API_TOKEN: token,
    MYSCOUTEE_CLIENT_ID: clientId, MYSCOUTEE_MCP_TRANSPORT: 'stdio'}, stdio: ['pipe', 'pipe', 'pipe']});
  let buffer = '', serial = 0, ended = false;
  const pending = new Map();
  child.stderr.resume(); // Never echo credential-bearing upstream diagnostics.
  const fail = () => {
    ended = true;
    for (const task of pending.values()) task.reject(Error('Packaged MCP exited before replying'));
    pending.clear();
  };
  child.on('error', fail);
  child.on('exit', fail);
  child.stdout.on('data', chunk => {
    buffer += chunk.toString();
    let boundary;
    while ((boundary = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 1);
      if (!line.trim()) continue;
      let message;
      try { message = JSON.parse(line); } catch { fail(); child.kill('SIGTERM'); return; }
      const task = pending.get(message.id);
      if (task) { pending.delete(message.id); task.resolve(message); }
    }
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    if (ended) { reject(Error('Packaged MCP is not running')); return; }
    const id = ++serial;
    const timer = setTimeout(() => { pending.delete(id); reject(Error('MCP response timeout')); }, 20000);
    pending.set(id, {resolve: result => { clearTimeout(timer); resolve(result); },
      reject: error => { clearTimeout(timer); reject(error); }});
    child.stdin.write(JSON.stringify({jsonrpc: '2.0', id, method, params}) + '\n', error => {
      if (error) { const task = pending.get(id); pending.delete(id); task?.reject(Error('MCP input closed')); }
    });
  });
  const close = async () => {
    if (ended) return;
    const exit = new Promise(resolve => child.once('exit', resolve));
    child.stdin.end(); child.kill('SIGTERM'); await exit;
  };
  try {
    const initialization = await call('initialize', {protocolVersion, capabilities: {},
      clientInfo: {name: 'myscoutee-qa', version: '1'}});
    if (initialization.error) throw Error('MCP initialization failed');
    child.stdin.write(JSON.stringify({jsonrpc: '2.0', method: 'notifications/initialized'}) + '\n');
    return {call, initialization, close};
  } catch (error) { await close(); throw error; }
}

export function createMcpHttp({request, origin = 'http://localhost', token, protocolVersion = '2025-11-25'}) {
  let serial = 0;
  return async (method, params = {}) => {
    const mcp2 = protocolVersion === '2026-07-28';
    const response = await request.post(origin + (token ? '/mcp/private' : '/mcp'), {
      headers: {Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': protocolVersion,
        ...(mcp2 ? {'Mcp-Method': method,
          ...(method === 'tools/call' ? {'Mcp-Name': params.name} : {})} : {}),
        ...(token ? {Authorization: 'Bearer ' + token} : {})},
      data: {jsonrpc: '2.0', id: ++serial, method, params: mcp2 ? {...params, _meta: {
        ...params._meta,
        'io.modelcontextprotocol/protocolVersion': protocolVersion,
        'io.modelcontextprotocol/clientInfo': {name: 'myscoutee-qa', version: '1'},
        'io.modelcontextprotocol/clientCapabilities': {}
      }} : params}});
    const body = await response.text();
    let data = null;
    try { data = JSON.parse(body); } catch {
      const events = body.split(/\r?\n/).filter(line => line.startsWith('data:'));
      if (events.length) data = JSON.parse(events.at(-1).slice(5));
    }
    return {status: response.status(), data};
  };
}

export async function runJavaClient({executable, configPath, args}) {
  const child = spawn(executable, args, {env: {...runtimeEnv, MYSCOUTEE_CONFIG: configPath},
    stdio: ['ignore', 'pipe', 'pipe']});
  let output = '', error = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { error += chunk; });
  const code = await new Promise((resolve, reject) => { child.once('exit', resolve); child.once('error', reject); });
  let data;
  try { data = JSON.parse(output); } catch { /* CLI failure may have no JSON response. */ }
  // Full response data stays with the caller; only explicit sanitized assertions belong in evidence.
  return {code, data, httpStatus: Number(error.match(/HTTP (\d{3})/)?.[1]) || null};
}
