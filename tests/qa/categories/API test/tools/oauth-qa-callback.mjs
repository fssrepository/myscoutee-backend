#!/usr/bin/env node
// Loopback landing page only. The real application performs consent and token issuance.
import http from 'node:http';
import {pathToFileURL} from 'node:url';

export function callbackHandler(request, response) {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (request.method !== 'GET' || url.pathname !== '/oauth/callback') {
    response.writeHead(404).end(); return;
  }
  const denied = url.searchParams.has('error');
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'"});
  response.end(`<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>MyScoutee QA</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;background:#f5f7fb;color:#24364b;font:16px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.card{width:min(100%,440px);padding:36px 28px;text-align:center;border:1px solid #dce3ed;border-radius:16px;background:#fff;box-shadow:0 8px 28px #23344c0a}.icon{display:grid;place-items:center;width:48px;height:48px;margin:0 auto 18px;border-radius:50%;background:#e7f5ed;color:#258451;font-size:26px}h1{margin:0 0 8px;font-size:21px;font-weight:600}p{margin:0;color:#627187}</style>
<main class="card" role="status"><div class="icon" aria-hidden="true">${denied ? '–' : '✓'}</div>
<h1>${denied ? 'Authorization declined' : 'Authorization received'}</h1><p>Continuing QA…</p></main></html>`);
  // No request URL/code/state/token is logged, saved or echoed into the HTML.
}

export async function startCallback(port = 6274) {
  const server = http.createServer(callbackHandler);
  await new Promise((resolve, reject) => {
    server.once('error', reject); server.listen(port, '127.0.0.1', resolve);
  });
  return server;
}

if (typeof process !== 'undefined' && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[2] || 6274);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw Error('Invalid callback port');
  const server = await startCallback(port);
  console.log(`QA callback receiver ready on loopback port ${port}. Ctrl+C stops it.`);
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close());
}
