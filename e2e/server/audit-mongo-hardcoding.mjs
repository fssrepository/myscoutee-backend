#!/usr/bin/env node
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const javaRoot = path.join(repoRoot, 'server/projects/profile/src/main/java');
const reportPath = path.join(repoRoot, 'e2e/server/MONGO_HARDCODE_AUDIT.md');

const patterns = [
  {
    name: 'explicit database name',
    regex: /\b(?:demo_db|myscoutee_db|playground_db)\b/g
  },
  {
    name: 'MongoTemplate literal collection',
    regex: /mongoTemplate\.[\s\S]{0,140}?,\s*"([^"]+)"/g
  },
  {
    name: 'getCollection literal',
    regex: /getCollection\(\s*"([^"]+)"\s*\)/g
  },
  {
    name: '@Document collection mapping',
    regex: /@Document\s*\(\s*collection\s*=\s*"([^"]+)"/g
  }
];

const findings = [];
await scan(javaRoot);
await writeReport(findings);
printSummary(findings);

async function scan(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scan(fullPath);
      continue;
    }
    if (!entry.name.endsWith('.java')) {
      continue;
    }
    const source = await readFile(fullPath, 'utf8');
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern.regex)) {
        const line = lineNumber(source, match.index ?? 0);
        const value = match[1] ?? match[0];
        findings.push({
          pattern: pattern.name,
          file: path.relative(repoRoot, fullPath),
          line,
          value: cleanup(value)
        });
      }
    }
  }
}

async function writeReport(items) {
  const byPattern = groupBy(items, item => item.pattern);
  const lines = [
    '# Mongo Hard-Code Audit',
    '',
    'This report lists Java code that names Mongo databases/collections directly or uses low-level Mongo APIs.',
    'It is meant to protect playground/stress mode from accidentally bypassing routed repositories.',
    '',
    `Generated candidates: ${items.length}`,
    ''
  ];

  for (const [pattern, patternItems] of Object.entries(byPattern)) {
    lines.push(`## ${pattern}`, '');
    for (const item of patternItems.sort(compareFinding)) {
      lines.push(`- \`${item.file}:${item.line}\` - \`${item.value}\``);
    }
    lines.push('');
  }

  lines.push('## Notes', '');
  lines.push('- `@Document(collection = "...")` is expected for entity mapping; it is listed so seed/reset coverage can be checked.');
  lines.push('- `MongoTemplate` calls using entity classes usually still route through the active database factory.');
  lines.push('- Literal collection-string calls are the ones to review most carefully before trusting playground isolation.');
  lines.push('');

  await writeFile(reportPath, `${lines.join('\n')}\n`);
}

function printSummary(items) {
  console.log(`Mongo hard-code audit wrote ${path.relative(repoRoot, reportPath)} (${items.length} findings).`);
  const literalRisk = items.filter(item => item.pattern !== '@Document collection mapping');
  if (literalRisk.length > 0) {
    console.log(`Review ${literalRisk.length} non-entity mapping finding(s) first.`);
  }
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

function cleanup(value) {
  return `${value ?? ''}`.replace(/\s+/g, ' ').trim().slice(0, 220);
}

function groupBy(items, keyFn) {
  return items.reduce((result, item) => {
    const key = keyFn(item);
    result[key] ??= [];
    result[key].push(item);
    return result;
  }, {});
}

function compareFinding(left, right) {
  const fileCompare = left.file.localeCompare(right.file);
  return fileCompare !== 0 ? fileCompare : left.line - right.line;
}
