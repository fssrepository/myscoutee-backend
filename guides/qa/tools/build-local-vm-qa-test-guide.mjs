#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..', '..', '..');
const qaManualDirectory = path.join(repositoryRoot, 'guides', 'qa', 'manuals');
const sourcePath = path.join(qaManualDirectory, 'myscoutee-local-vm-qa-test-guide-en.html');
const logoPath = path.join(qaManualDirectory, 'img', 'myscoutee-heart.png');
const outputPath = path.join(qaManualDirectory, 'MyScoutee_Local_VM_QA_Test_Guide_v1.0.0_EN.pdf');
const browserExecutable = process.env.DOCS_CHROME_PATH || await firstExistingPath([
  '/usr/bin/google-chrome',
  '/opt/google/chrome/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
]);

if (!browserExecutable) {
  throw new Error('Google Chrome or Chromium is required to generate the QA PDF.');
}
await Promise.all([fs.access(sourcePath), fs.access(logoPath)]);

const chromeArguments = [
  '--headless=new',
  '--disable-dev-shm-usage',
  '--font-render-hinting=none',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPath}`,
  pathToFileURL(sourcePath).href
];
if (process.getuid?.() === 0) chromeArguments.unshift('--no-sandbox');

await new Promise((resolve, reject) => {
  const child = spawn(browserExecutable, chromeArguments, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', chunk => {
    stderr += chunk;
  });
  child.once('error', reject);
  child.once('exit', code => {
    if (code === 0) resolve();
    else reject(new Error(`Chrome PDF generation failed with exit ${code}: ${stderr.trim()}`));
  });
});

const handle = await fs.open(outputPath, 'r');
try {
  const signature = Buffer.alloc(5);
  await handle.read(signature, 0, signature.length, 0);
  if (signature.toString('ascii') !== '%PDF-') {
    throw new Error(`Generated output is not a PDF: ${outputPath}`);
  }
} finally {
  await handle.close();
}
const outputStats = await fs.stat(outputPath);
if (outputStats.size < 10_000) {
  throw new Error(`Generated PDF is suspiciously small: ${outputPath}`);
}
process.stdout.write(`Generated: ${path.relative(repositoryRoot, outputPath)}\n`);

async function firstExistingPath(candidates) {
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next supported Chrome path.
    }
  }
  return null;
}
