#!/usr/bin/env node
// Populate the disposable dev Operator fixture from gitignored project secrets.
// Provider tests and activation remain real operations; this never forges them.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../..', import.meta.url));
const harness = path.join(root, 'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh');
const checkpoint = ['operator-domain', 'OPERATOR-FIREBASE-001'];
const action = process.argv[2] || 'status';
if (!['load', 'status', 'test-authentication'].includes(action)) throw Error('Use load|status|test-authentication');
const [container] = JSON.parse(execFileSync('docker', ['inspect', 'myscoutee'], { encoding: 'utf8' }));
const env = Object.fromEntries(container.Config.Env.map(value => {
  const split = value.indexOf('='); return [value.slice(0, split), value.slice(split + 1)];
}));
if (!container.State.Running || env.SPRING_PROFILES_ACTIVE !== 'dev'
    || env.MONGODB_DATABASE !== 'demo_db' || env.FIREBASE_ENABLED !== 'false'
    || container.Config.Labels?.['com.docker.compose.project.config_files'] !== path.join(root, 'server/docker-compose-dev.yml')) {
  throw Error('Requires the existing repository dev stack and demo_db');
}
const oracle = command => JSON.parse(execFileSync('bash', [harness, command, ...checkpoint], { encoding: 'utf8' }));
const endpoint = 'http://localhost/api/operator/configuration';
async function request(method, suffix = '', body) {
  const response = await fetch(`${endpoint}${suffix}?userId=operator%40myscoutee.local`, {
    method, headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(60000)
  });
  // Never print request/response bodies: they may contain public client values.
  if (!response.ok) throw Error(`Operator fixture ${method} ${suffix || '/'} returned HTTP ${response.status}`);
  return response.json();
}
const before = oracle('status');
if (action === 'status') {
  console.log(JSON.stringify(before, null, 2));
} else if (action === 'test-authentication') {
  if (before.phase === 'not-staged') throw Error('Load the guarded fixture first');
  const result = await request('POST', '/tests', { kind: 'FIREBASE_AUTHENTICATION' });
  console.log(JSON.stringify({ kind: result.kind, success: result.success, testedAt: result.testedAt }));
  if (!result.success) process.exitCode = 1;
} else {
  const secrets = path.join(root, 'server/projects/profile/secrets');
  const credential = readFileSync(path.join(secrets, 'firebase-service-account.json'), 'utf8');
  const account = JSON.parse(credential);
  const client = JSON.parse(readFileSync(path.join(secrets, 'firebase-web-config.json'), 'utf8'));
  const fields = ['projectId', 'apiKey', 'authDomain', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId', 'vapidKey'];
  if (account.type !== 'service_account' || !account.private_key || !account.client_email
      || account.project_id !== client.projectId || fields.filter(k => k !== 'measurementId').some(k => !client[k])) {
    throw Error('Local Firebase files are incomplete or belong to different projects');
  }
  const current = await request('GET');
  if (current.firebase.active || current.firebase.authenticationCredentialConfigured || current.firebase.messagingCredentialConfigured) {
    throw Error('Firebase is already populated; inspect status instead of overwriting it');
  }
  if (before.phase === 'not-staged') oracle('stage');
  await request('PUT', '', {
    adminEmails: current.adminEmails, privacyContact: current.privacyContact,
    socialLinks: current.socialLinks, branding: current.branding,
    firebase: { ...Object.fromEntries(fields.map(k => [k, client[k] || ''])),
      authenticationCredential: credential, messagingCredential: credential }
  });
  console.log(JSON.stringify(oracle('status'), null, 2));
}
