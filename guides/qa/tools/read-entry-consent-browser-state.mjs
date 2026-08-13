#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const checkpointId = `${process.argv[2] ?? ''}`.trim();
if (!checkpointId) {
  throw new Error('Usage: read-entry-consent-browser-state.mjs CHECKPOINT_ID');
}

const safeCheckpointId = checkpointId.replace(/[^A-Za-z0-9_.-]+/g, '-');
const manifestPath = path.join(
  os.tmpdir(),
  'myscoutee-qa-browser-sessions',
  `${safeCheckpointId}.json`
);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const sessions = [];

for (const session of manifest.sessions ?? []) {
  const port = Number(session.devToolsPort);
  const targets = await jsonRequest(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find(target =>
    target.type === 'page'
    && target.webSocketDebuggerUrl
    && /^https?:\/\/(localhost|127\.0\.0\.1)(?::[0-9]+)?\//.test(`${target.url ?? ''}`)
  );
  if (!page) {
    throw new Error(`No MyScoutee page target found for ${session.actor}.`);
  }
  sessions.push({
    actor: session.actor,
    ...(await cdpEvaluate(page.webSocketDebuggerUrl, `(() => {
      const consentKey = 'myscoutee.http.entry.gdpr-consent.v1';
      const optionalKey = 'myscoutee.http.privacy.optional-approvals.v1';
      const auditKey = 'myscoutee.http.entry.gdpr-consent-audit.v1';
      const sessionKey = 'myscoutee.http.session.v1';
      const parse = key => {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return { invalidJson: true }; }
      };
      const entryElement = document.querySelector('app-entry-page');
      const entry = entryElement
        ? globalThis.ng?.getComponent?.(entryElement)
        : null;
      const revision = entry?.privacyPolicy?.activeRevision?.() ?? null;
      const visibleDocumentViewers = [...document.querySelectorAll('app-document-viewer')]
        .filter(element => element.getClientRects().length > 0
          || [...element.querySelectorAll('*')].some(child => child.getClientRects().length > 0));
      const visibleDocumentViewer = visibleDocumentViewers[0] ?? null;
      const visibleDocumentComponent = visibleDocumentViewer
        ? globalThis.ng?.getComponent?.(visibleDocumentViewer)
        : null;
      const visibleDocumentConfig = visibleDocumentComponent?.activeConfig?.() ?? null;
      const storedSession = parse(sessionKey);
      return {
        pathname: location.pathname,
        activeRevision: revision ? {
          id: revision.id,
          version: revision.version,
          title: revision.title,
          sections: (revision.sections ?? []).map(section => ({
            id: section.id,
            title: section.title,
            optional: section.optional === true
          }))
        } : null,
        selectedOptionalSectionIds: entry?.entryApprovedPrivacySectionIds
          ? [...entry.entryApprovedPrivacySectionIds].sort()
          : [],
        consent: parse(consentKey),
        optionalApprovals: parse(optionalKey),
        audit: parse(auditKey),
        hasSession: Boolean(storedSession),
        session: storedSession ? {
          kind: storedSession.kind ?? null,
          userId: storedSession.userId ?? storedSession.profile?.id ?? null,
          name: storedSession.profile?.name ?? null
        } : null,
        privacyPopupVisible: visibleDocumentViewers.length > 0,
        visibleDocument: visibleDocumentConfig ? {
          title: visibleDocumentConfig.title ?? null,
          versionLabel: visibleDocumentConfig.versionLabel ?? null,
          selectedSectionIds: [...(visibleDocumentConfig.selectedSectionIds ?? [])].sort(),
          sectionIds: [...(visibleDocumentConfig.sections ?? [])].map(section => section.id)
        } : null,
        visibleActions: [...document.querySelectorAll('.document-viewer-actions button')]
          .filter(button => button.offsetParent !== null)
          .map(button => button.textContent?.trim() ?? '')
          .filter(Boolean)
      };
    })()`))
  });
}

process.stdout.write(`${JSON.stringify({ checkpointId, sessions }, null, 2)}\n`);

async function jsonRequest(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return await response.json();
}

async function cdpEvaluate(webSocketUrl, expression) {
  const message = await new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error('Chrome Runtime.evaluate timed out.'));
    }, 5000);
    socket.addEventListener('open', () => socket.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: { expression, awaitPromise: true, returnByValue: true }
    })));
    socket.addEventListener('message', event => {
      const response = JSON.parse(`${event.data}`);
      if (response.id !== 1) {
        return;
      }
      clearTimeout(timeout);
      socket.close();
      if (response.error || response.result?.exceptionDetails) {
        reject(new Error(response.error?.message || 'Chrome Runtime.evaluate failed.'));
        return;
      }
      resolve(response);
    });
    socket.addEventListener('error', () => {
      clearTimeout(timeout);
      reject(new Error('Unable to connect to Chrome DevTools.'));
    });
  });
  return message.result?.result?.value;
}
