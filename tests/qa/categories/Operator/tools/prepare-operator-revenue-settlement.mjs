#!/usr/bin/env node
// Revenue-only prerequisite: use normal signed claim/measurement operations.
// This does not synchronize Revenue, fabricate settlements or award a UI PASS.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../../..', import.meta.url));
const checkpoint = 'OPERATOR-REVENUE-LIFECYCLE-001';
const retained = path.join(tmpdir(), 'myscoutee-qa-operator-revenue');
const manifest = JSON.parse(readFileSync(path.join(retained, 'manifest.json')));
if (manifest.checkpoint !== checkpoint || manifest.phase !== 'baseline-ready') {
  throw new Error('An active paired Revenue snapshot is required.');
}
execFileSync('python3', ['tests/qa/categories/Operator/tools/operator-registry-fixture.py', 'status', '--checkpoint', 'revenue'], { cwd: root, stdio: 'pipe' });
const baseline = JSON.parse(execFileSync('bash', [
  'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh',
  'status', 'operator-revenue', checkpoint
], { cwd: root, encoding: 'utf8' }));
if (baseline.phase !== 'baseline-ready' || !baseline.sourceUnchanged || !baseline.reportCount) {
  throw new Error('Stage the fixture and complete normal Revenue synchronization first.');
}
const run = (exe, args, input) => JSON.parse(execFileSync(exe, args, {
  cwd: root, encoding: 'utf8', input,
  env: { ...process.env, QA_CHECKPOINT: checkpoint }
}));
const api = (route, body) => run('node', ['tests/qa/categories/Notifications/tools/notification-admin-cdp.mjs', 'eval', 'Operator'], `
(async () => {
  const session = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  if (session?.kind !== 'demo' || session.userId !== 'operator@myscoutee.local' || !session.sessionId) throw Error('Unexpected actor');
  const response = await fetch(${JSON.stringify('/api' + route)}, {
    method: ${JSON.stringify(body === undefined ? 'GET' : 'POST')},
    headers: { 'X-App-Session-Kind': 'demo', 'X-Demo-User-Id': session.userId,
      'X-App-Session-Id': session.sessionId, 'Content-Type': 'application/json' },
    ${body === undefined ? '' : `body: ${JSON.stringify(JSON.stringify(body))},`}
  });
  if (!response.ok) throw Error('Prerequisite API returned ' + response.status);
  return response.json();
})()`);
const go = (...args) => run('docker', ['exec', 'registry', '/registry', ...args]);
const status = api('/operator/registry');
const deployment = status.enrollment?.deploymentCode;
if (!deployment || status.lifecycle !== 'REGISTERED') throw Error('Normal UI registration required');
const legalName = 'Revenue QA Operator s.r.o.';
let claim = api('/operator/claim');
if (claim.status.verificationStatus === 'NOT_SUBMITTED') {
  claim = api('/operator/claim', {
    legalName, registrationNumber: 'QA-REVENUE-001', jurisdiction: 'SK',
    registeredAddress: 'QA Test Street 1, Bratislava', website: 'https://example.invalid',
    verificationContactName: 'Revenue QA Reviewer', verificationContactRole: 'Operator',
    verificationContactEmail: 'revenue-qa@example.invalid', authorityAttested: true
  });
}
const detail = go('show-operator-claim', '--deployment-id', deployment);
if (detail.legal_name !== legalName) throw Error('Foreign claim; preserve and investigate');
const approval = go('approve-operator-claim', '--deployment-id', deployment,
  '--claim-action-id', detail.claim_action_id, '--group-id', detail.group_id,
  '--legal-name', legalName, '--reviewer-id', 'qa-revenue-fixture',
  '--review-reference', checkpoint, '--idempotency-key', 'qa-revenue-approval-' + detail.claim_action_id);
const measurements = api('/operator/measurements/synchronize', null);
if (measurements.pending || measurements.blocked) throw Error('Contribution prerequisite incomplete');
const verified = api('/operator/claim');
if (!verified.status.claimed) throw Error('Approved claim did not converge');
const now = new Date();
const period = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0)).toISOString().slice(0, 7);
const settlement = go('calculate-settlement', '--period', period, '--currency', 'EUR');
const evidence = { deployment, period, approval, measurements, claim: verified.status, settlement };
writeFileSync(path.join(retained, 'settlement-prerequisite.json'), JSON.stringify(evidence, null, 2) + '\n', { mode: 0o600 });
console.log(JSON.stringify({ deployment, period, claimed: verified.status.claimed, measurements,
  settlementId: settlement.receipt.settlement_id, revision: settlement.receipt.revision }, null, 2));
