#!/usr/bin/env node

import { appendFile, mkdir } from 'node:fs/promises';
import http from 'node:http';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}` : '';
};

const port = Number(option('--port') || 18090);
const output = resolve(option('--output') || '/tmp/myscoutee-integration-webhooks.ndjson');
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('--port must be a valid TCP port.');
}
await mkdir(dirname(output), { recursive: true });

const server = http.createServer(async (request, response) => {
  if (request.method !== 'POST' || request.url !== '/callback') {
    response.writeHead(404).end();
    return;
  }
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    response.writeHead(400).end();
    return;
  }
  await appendFile(output, `${JSON.stringify({
    receivedAt: new Date().toISOString(),
    headers: request.headers,
    body
  })}\n`, { mode: 0o600 });
  process.stdout.write(`${body.type ?? 'unknown'} ${body.deliveryId ?? ''}\n`);
  response.writeHead(204).end();
});

server.listen(port, '0.0.0.0', () => {
  process.stdout.write(`Webhook receiver listening on 0.0.0.0:${port}; output=${output}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
