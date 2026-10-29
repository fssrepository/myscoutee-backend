#!/usr/bin/env node
// Existing watcher JavaScript + worker source; no Angular compiler/test server.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root = path.resolve('server/docker/.qa-mobile-runtime/lifecycle-2');
const files = readdirSync(root).filter(name => /^chunk-.*\.js$/.test(name));
const entry = files.find(name => readFileSync(path.join(root, name), 'utf8').includes('var OfflineCacheService = class'));
assert.ok(entry);
const data = new Map();
const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)), removeItem: key => data.delete(key) };
const cached = new Map();
const cacheStorage = {
  keys: async () => [...cached.keys()],
  open: async name => {
    if (!cached.has(name)) cached.set(name, new Map());
    const rows = cached.get(name);
    return { keys: async () => [...rows.keys()].map(url => ({ url })),
      delete: async request => rows.delete(request.url),
      match: async request => rows.get(request.url),
      put: async (request, response) => rows.set(request.url, response) };
  },
  delete: async name => cached.delete(name)
};
const api = 'myscoutee-runtime-api-v1', media = 'myscoutee-runtime-media-v1';
cached.set(api, new Map([['http://localhost:8080/api/auth/me', 'private'], ['http://localhost:8080/api/landing/content', 'public']]));
cached.set(media, new Map([['http://localhost:8080/media/private/avatar', 'private'], ['http://localhost:8080/media/public?key=images/demo-assets/asset/large.webp', 'public']]));
const context = vm.createContext({ console, URL, URLSearchParams, TextEncoder, TextDecoder, performance, setTimeout, clearTimeout,
  localStorage: storage, sessionStorage: storage, caches: cacheStorage,
  window: { location: { search: '', hostname: 'localhost' } }, document: { baseURI: 'http://localhost:8080/' }, navigator: { onLine: true } });
const modules = new Map();
function get(file) {
  if (!modules.has(file)) modules.set(file, new vm.SourceTextModule(readFileSync(file, 'utf8'), { context, identifier: file }));
  return modules.get(file);
}
const module = get(path.join(root, entry));
await module.link((specifier, parent) => get(path.resolve(path.dirname(parent.identifier), specifier)));
await module.evaluate();
const Cache = module.namespace.OfflineCacheService;
const service = new Cache();
const a = 'qa-cache-a', b = 'qa-cache-b';
service.writeUser(a, { user: { id: a } });
service.writeUser(b, { user: { id: b } });
service.writeTicketPage(a, 'upcoming', { items: [{ id: 'secret-ticket-a' }], total: 1 });
service.writeTicketPage(b, 'upcoming', { items: [{ id: 'secret-ticket-b' }], total: 1 });
const clearing = service.clearUser(a);
assert.equal(service.readUser(a), null, 'Profile purge is synchronous');
assert.equal(service.readTicketPage(a, 'upcoming'), null);
service.writeUser(a, { user: { id: a } });
service.writeTicketPage(a, 'upcoming', { items: [{ id: 'late-ticket' }], total: 1 });
await clearing;
assert.equal(service.readUser(a), null, 'Late response cannot repopulate a logged-out user');
assert.equal(service.readTicketPage(a, 'upcoming'), null);
assert.equal(service.readUser(b).user.id, b, 'Another user cache is unaffected');
assert.equal(service.readTicketPage(b, 'upcoming').total, 1);
assert.equal(cached.get(api).size, 1);
assert.equal(cached.get(media).size, 1);
assert.ok(cached.get(media).has('http://localhost:8080/media/public?key=images/demo-assets/asset/large.webp'));
service.activateUser(a);
service.writeUser(a, { user: { id: a } });
assert.equal(service.readUser(a).user.id, a, 'Fresh login can cache its own profile');

const handlers = new Map();
const workerContext = vm.createContext({ URL, Request, Response, console, caches: cacheStorage,
  fetch: async () => new Response('public-image'),
  self: { location: { origin: 'http://localhost:8080', href: 'http://localhost:8080/app-sw.js' },
    clients: { claim: async () => {} }, addEventListener: (name, handler) => handlers.set(name, handler) } });
vm.runInContext(readFileSync('myscoutee-frontend/src/app-sw.js', 'utf8'), workerContext);
for (const [url, destination] of [['/api/auth/me', ''], ['/api/auth/me/realtime/long-poll', ''], ['/media/private/avatar', 'image']]) {
  let intercepted = false;
  handlers.get('fetch')({ request: { url: 'http://localhost:8080' + url, method: 'GET', mode: 'cors', destination }, respondWith: () => { intercepted = true; } });
  assert.equal(intercepted, false, 'Worker must not serve private responses from a shared URL cache');
}
let response;
handlers.get('fetch')({ request: { url: 'http://localhost:8080/media/public?key=images/demo-assets/new/large.webp', method: 'GET', mode: 'cors', destination: 'image' }, respondWith: promise => { response = promise; } });
assert.equal(await (await response).text(), 'public-image');
console.log('PASS: user cache purge, late-response guard, other-user/public retention, fresh login and private-worker-cache exclusion.');
