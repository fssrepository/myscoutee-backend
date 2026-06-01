#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const frontendRoot = path.join(repoRoot, 'frontend', 'src');
const allowed = new Set(['max-width:760']);
const findings = [];
const duplicates = new Map();

await scan(frontendRoot);

if (findings.length > 0) {
  console.error('Unexpected frontend responsive breakpoints:');
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} @${finding.kind} ${finding.feature}: ${finding.width}px`);
  }
}

const duplicateFindings = [...duplicates.values()].filter((finding) => finding.count > 1);
if (duplicateFindings.length > 0) {
  console.error('Duplicate frontend responsive blocks:');
  for (const finding of duplicateFindings) {
    console.error(`- ${finding.file}:${finding.line} @${finding.kind} (${finding.feature}: ${finding.width}px) appears ${finding.count} times`);
  }
}

if (findings.length > 0 || duplicateFindings.length > 0) {
  process.exit(1);
}

console.log('frontend responsive breakpoints use only one max-width: 760px block per context');

async function scan(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scan(fullPath);
      continue;
    }
    if (!entry.name.endsWith('.scss') && !entry.name.endsWith('.css')) {
      continue;
    }
    const source = await readFile(fullPath, 'utf8');
    for (const match of source.matchAll(/@(media|container)[^{\n]*\((max-width|min-width)\s*:\s*(\d+)px\)/g)) {
      const kind = match[1];
      const feature = match[2];
      const width = Number(match[3]);
      const line = source.slice(0, match.index ?? 0).split('\n').length;
      const depth = braceDepth(source, match.index ?? 0);
      const indentStart = source.lastIndexOf('\n', match.index ?? 0) + 1;
      const indent = source.slice(indentStart, match.index ?? 0);
      if (!allowed.has(`${feature}:${width}`)) {
        findings.push({
          file: path.relative(repoRoot, fullPath),
          line,
          kind,
          feature,
          width
        });
      }
      const duplicateKey = `${fullPath}\0${kind}\0${feature}\0${width}\0${depth}\0${indent}`;
      const duplicate = duplicates.get(duplicateKey);
      if (duplicate) {
        duplicate.count += 1;
      } else {
        duplicates.set(duplicateKey, {
          file: path.relative(repoRoot, fullPath),
          line,
          kind,
          feature,
          width,
          count: 1
        });
      }
    }
  }
}

function braceDepth(source, index) {
  let depth = 0;
  for (let i = 0; i < index; i += 1) {
    if (source[i] === '{') {
      depth += 1;
    } else if (source[i] === '}') {
      depth -= 1;
    }
  }
  return depth;
}
