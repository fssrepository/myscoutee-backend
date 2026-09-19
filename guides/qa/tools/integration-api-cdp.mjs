#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import WebSocket from '../../../frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const command = args[0] || 'inspect';
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}` : '';
};
const port = Number(option('--port'));
if (!Number.isInteger(port) || port <= 0) fail('--port is required.');

const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(response => response.json());
const page = targets.find(target => target.type === 'page'
  && target.url.startsWith('http://localhost')
  && target.webSocketDebuggerUrl);
if (!page) fail(`No localhost page target is available on port ${port}.`);

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let requestId = 0;
socket.on('message', raw => {
  const message = JSON.parse(String(raw));
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message || JSON.stringify(message.error)));
  else request.resolve(message.result);
});
await new Promise((resolve, reject) => {
  socket.once('open', resolve);
  socket.once('error', reject);
});

try {
  if (command === 'inspect') {
    print(await evaluate(`(() => {
      const visible = element => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const text = value => String(value ?? '').replace(/\\s+/g, ' ').trim();
      return {
        url: location.href,
        title: document.title,
        bodyText: document.body.innerText.slice(0, 30000),
        controls: [...document.querySelectorAll('button,[role="button"],a,input,select,textarea')]
          .filter(visible)
          .map((element, index) => ({
            index,
            tag: element.tagName.toLowerCase(),
            text: text(element.innerText || element.value),
            aria: text(element.getAttribute('aria-label')),
            title: text(element.getAttribute('title')),
            placeholder: text(element.getAttribute('placeholder')),
            type: text(element.getAttribute('type')),
            disabled: Boolean(element.disabled),
            className: text(element.className)
          })),
        images: [...document.querySelectorAll('img')]
          .filter(visible)
          .map(element => ({
            src: element.currentSrc || element.src,
            alt: text(element.alt),
            className: text(element.className)
          }))
      };
    })()`));
  } else if (command === 'click') {
    const selector = option('--selector');
    const aria = option('--aria');
    const requestedText = option('--text');
    const index = Number(option('--index') || 0);
    print(await evaluate(`(() => {
      const normalize = value => String(value ?? '').replace(/\\s+/g, ' ').trim();
      const selector = ${JSON.stringify(selector)};
      const aria = ${JSON.stringify(aria)};
      const requestedText = ${JSON.stringify(requestedText)};
      const candidates = selector
        ? [...document.querySelectorAll(selector)]
        : [...document.querySelectorAll('button,[role="button"],a')].filter(element => {
            if (aria) return normalize(element.getAttribute('aria-label')) === aria;
            return requestedText && normalize(element.innerText).includes(requestedText);
          });
      const element = candidates[${index}];
      if (!element) throw new Error('Click target was not found.');
      element.scrollIntoView({ block: 'center', inline: 'nearest' });
      if (element.disabled) throw new Error('Click target is disabled.');
      element.click();
      return { clicked: true, tag: element.tagName, text: normalize(element.innerText), aria: normalize(element.getAttribute('aria-label')) };
    })()`));
    await delay(500);
  } else if (command === 'fill') {
    const selector = option('--selector');
    const value = option('--value');
    const index = Number(option('--index') || 0);
    if (!selector) fail('--selector is required for fill.');
    print(await evaluate(`(() => {
      const element = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
      if (!element) throw new Error('Input target was not found.');
      element.scrollIntoView({ block: 'center', inline: 'nearest' });
      element.focus();
      const prototype = element instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, ${JSON.stringify(value)});
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: ${JSON.stringify(value)} }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return { filled: true, value: element.value };
    })()`));
  } else if (command === 'screenshot') {
    const path = option('--path');
    if (!path) fail('--path is required for screenshot.');
    await send('Page.enable');
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path, Buffer.from(result.data, 'base64'));
    print({ screenshot: path });
  } else if (command === 'reload') {
    await send('Page.enable');
    await send('Page.reload', { ignoreCache: true });
    await delay(1500);
    print({ reloaded: true });
  } else if (command === 'fetch') {
    const url = option('--url');
    if (!url) fail('--url is required for fetch.');
    print(await evaluate(`fetch(${JSON.stringify(url)}, { credentials: 'include' }).then(async response => ({
      status: response.status,
      contentType: response.headers.get('content-type'),
      length: (await response.arrayBuffer()).byteLength
    }))`));
  } else if (command === 'download') {
    const url = option('--url');
    const path = option('--path');
    if (!url) fail('--url is required for download.');
    if (!path) fail('--path is required for download.');
    const result = await evaluate(`fetch(${JSON.stringify(url)}, { credentials: 'include' }).then(async response => {
      if (!response.ok) throw new Error('Download failed with HTTP ' + response.status + '.');
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = '';
      for (let offset = 0; offset < bytes.length; offset += 32768) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
      }
      return {
        contentType: response.headers.get('content-type'),
        data: btoa(binary)
      };
    })`);
    await writeFile(path, Buffer.from(result.data, 'base64'));
    print({ downloaded: path, contentType: result.contentType });
  } else {
    fail('Usage: integration-api-cdp.mjs inspect|click|fill|screenshot|reload|fetch|download --port PORT [options]');
  }
} finally {
  socket.close();
}

async function evaluate(expression) {
  const response = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description
      || response.exceptionDetails.text
      || 'Runtime evaluation failed.');
  }
  return response.result?.value;
}

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (!pending.has(id)) return;
      pending.delete(id);
      reject(new Error(`${method} timed out.`));
    }, 10000).unref();
  });
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function print(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
