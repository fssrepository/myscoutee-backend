#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const argumentsList = process.argv.slice(2);
const checkpointId = `${argumentsList[0] ?? ''}`.trim();
const actorOptionIndex = argumentsList.indexOf('--actor');
const requestedActor = actorOptionIndex >= 0
  ? `${argumentsList[actorOptionIndex + 1] ?? ''}`.trim().toLowerCase()
  : '';
if (!checkpointId) {
  throw new Error(
    'Usage: read-landing-eligibility-browser-state.mjs CHECKPOINT_ID [--actor NAME]'
  );
}

const safeCheckpointId = checkpointId.replace(/[^A-Za-z0-9_.-]+/g, '-');
const manifestPath = path.join(
  os.tmpdir(),
  'myscoutee-qa-browser-sessions',
  `${safeCheckpointId}.json`
);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const sessions = [];

const selectedSessions = (manifest.sessions ?? []).filter(session =>
  !requestedActor || `${session.actor ?? ''}`.trim().toLowerCase() === requestedActor
);
if (requestedActor && selectedSessions.length !== 1) {
  throw new Error(`Expected one '${requestedActor}' session, found ${selectedSessions.length}.`);
}

for (const session of selectedSessions) {
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
    expectedName: session.expectedName,
    configuredGeolocation: session.geolocation ?? null,
    configuredPermission: session.geolocationPermission ?? null,
    devToolsPort: port,
    ...(await cdpEvaluate(page.webSocketDebuggerUrl, `(async () => {
      const text = value => \`${'${value ?? \'\'}'}\`.replace(/\\s+/g, ' ').trim();
      const entryElement = document.querySelector('app-entry-page');
      const entry = entryElement ? globalThis.ng?.getComponent?.(entryElement) : null;
      const authButton = document.querySelector('.entry-auth-btn');
      const dialogPanel = document.querySelector('.dialog-panel');
      let permission = null;
      try {
        permission = (await navigator.permissions.query({ name: 'geolocation' })).state;
      } catch {}
      const sessionKeys = ['myscoutee.http.session.v1', 'myscoutee.demo.session.v1'];
      return {
        url: location.href,
        online: navigator.onLine,
        permission,
        authMode: entry?.authMode ?? null,
        locationEligibilityResolvedFromCoordinates:
          entry?.locationEligibilityResolvedFromCoordinates === true,
        landingLoginAvailability: entry?.landingLoginAvailability
          ? {
              eligible: entry.landingLoginAvailability.eligible === true,
              partitionKey: entry.landingLoginAvailability.partitionKey ?? null,
              message: entry.landingLoginAvailability.message ?? null,
              securityGateEnabled: entry.landingLoginAvailability.securityGateEnabled === true,
              locationRequired: entry.landingLoginAvailability.locationRequired === true
            }
          : null,
        ui: {
          unavailable: entry?.entryAuthUnavailable === true,
          locationRequired: entry?.entryAuthLocationRequired === true,
          networkUnavailable: entry?.entryNetworkUnavailable === true,
          label: text(authButton?.textContent),
          ariaLabel: text(authButton?.getAttribute('aria-label')),
          disabled: authButton?.matches(':disabled') === true,
          className: authButton?.className ?? null
        },
        dialog: dialogPanel ? {
          title: text(dialogPanel.querySelector('h3')?.textContent),
          message: text(dialogPanel.querySelector('p:not(.dialog-error):not(.dialog-warning)')?.textContent),
          error: text(dialogPanel.querySelector('.dialog-error')?.textContent),
          actions: [...dialogPanel.querySelectorAll('button, [role=button]')]
            .map(action => ({
              text: text(action.textContent),
              ariaLabel: text(action.getAttribute('aria-label')),
              disabled: action.matches(':disabled')
            }))
        } : null,
        eligibilityRequests: performance.getEntriesByType('resource')
          .map(resource => resource.name)
          .filter(name => name.includes('/auth/eligibility')),
        hasSession: sessionKeys.some(key => Boolean(localStorage.getItem(key)))
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
        reject(new Error(
          response.error?.message
          || response.result?.exceptionDetails?.text
          || 'Chrome Runtime.evaluate failed.'
        ));
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
