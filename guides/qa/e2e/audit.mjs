#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { E2E_RESET_COLLECTIONS } from '../../../e2e/functional/backend/hooks/e2e-db.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..');
const matrixPath = path.join(repoRoot, 'guides', 'qa', 'matrices', 'ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv');
const packPath = path.join(repoRoot, 'guides', 'qa', 'manuals', 'DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md');
const checkpointPath = path.join(here, 'checkpoint.json');
const functionalRoot = path.join(repoRoot, 'e2e', 'functional');
const stressBackendScenarioRoot = path.join(repoRoot, 'e2e', 'stress', 'backend', 'scenarios');
const stressUiScenarioRoot = path.join(repoRoot, 'e2e', 'stress', 'ui', 'scenarios');
const standaloneMetadataRoot = path.join(repoRoot, 'e2e', 'stress', 'backend');
const javaRoot = path.join(repoRoot, 'server', 'projects', 'profile', 'src', 'main');
const seedRoot = path.join(repoRoot, 'server', 'docker', 'conf', 'mongodb', 'e2e_db');
const fingerprintFields = [
  'ID',
  'QA domain',
  'Area',
  'Scenario',
  'Manual status',
  'Last manual date',
  'Automated coverage',
  'Result',
  'Evidence / notes'
];

const args = new Set(process.argv.slice(2));
const matrixText = await readFile(matrixPath, 'utf8');
const packText = await readFile(packPath, 'utf8');
const rows = recordsFromCsv(matrixText);
const completed = rows.filter(isCompletedQaBranch);
const packSections = qaPackSections(packText);
const descriptors = (await Promise.all([
  discoverDescriptors(functionalRoot, 'functional', filename => path.basename(filename) === 'request.json'),
  discoverDescriptors(stressBackendScenarioRoot, 'stress/backend', filename => filename.endsWith('.json')),
  discoverDescriptors(stressUiScenarioRoot, 'stress/ui', filename => filename.endsWith('.json')),
  discoverDescriptors(standaloneMetadataRoot, 'stress/standalone', filename => filename.endsWith('.qa.json'))
])).flat();
const traceability = collectTraceability(descriptors);
const resetAudit = await auditResetCollections();
const current = currentCheckpoint(completed, packSections, matrixText);

if (args.has('--print-current')) {
  process.stdout.write(`${JSON.stringify(current, null, 2)}\n`);
  process.exit(0);
}

const checkpoint = JSON.parse(await readFile(checkpointPath, 'utf8'));
const delta = compareCheckpoint(checkpoint, current);
const staleTraceability = [...traceability.keys()]
  .filter(id => !current.branches[id])
  .sort();
const invalidTraceability = descriptors.flatMap(descriptor => descriptor.invalidQaBranches);
const failures = [];

if (delta.added.length > 0) {
  failures.push(`new PASS branches: ${delta.added.join(', ')}`);
}
if (delta.changed.length > 0) {
  failures.push(`changed PASS branches: ${delta.changed.join(', ')}`);
}
if (delta.removed.length > 0) {
  failures.push(`branches no longer at the audited PASS boundary: ${delta.removed.join(', ')}`);
}
if (staleTraceability.length > 0) {
  failures.push(`E2E metadata references non-PASS QA branches: ${staleTraceability.join(', ')}`);
}
if (invalidTraceability.length > 0) {
  failures.push(`invalid qaBranches metadata: ${invalidTraceability.join('; ')}`);
}
if (resetAudit.missing.length > 0) {
  failures.push(`E2E reset misses Mongo collections: ${resetAudit.missing.join(', ')}`);
}

const coverage = coverageSummary(current, traceability);
if (failures.length > 0) {
  console.error('QA -> E2E audit FAILED. Review only the listed QA branches or reset collections:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error(`Current coverage: ${coverage.core} core, ${coverage.supporting} supporting, ${coverage.unlinked} unlinked.`);
  process.exit(1);
}

console.log(
  `PASS: ${coverage.total} QA PASS branches match checkpoint; `
  + `E2E traceability is ${coverage.core} core, ${coverage.supporting} supporting, ${coverage.unlinked} unlinked.`
);
console.log(
  `PASS: E2E reset covers all ${resetAudit.expected.length} Java-model/E2E-seed Mongo collections `
  + `(${E2E_RESET_COLLECTIONS.length} explicit reset targets).`
);
console.log(`PASS: QA metadata validated across ${formatDescriptorCounts(descriptors)}.`);
if (checkpoint.matrixFileSha256 !== current.matrixFileSha256) {
  console.log('INFO: the QA matrix changed only outside the audited PASS rows. No completed branch needs re-review.');
}
if (args.has('--verbose') && coverage.unlinkedIds.length > 0) {
  console.log(`Unlinked PASS branches: ${coverage.unlinkedIds.join(', ')}`);
}

function currentCheckpoint(completedRows, sections, matrixSource) {
  const branches = Object.fromEntries(completedRows
    .sort((left, right) => left.ID.localeCompare(right.ID))
    .map(row => {
      const packSection = sections.get(row.ID) ?? '';
      return [row.ID, fingerprint({
        matrix: Object.fromEntries(
          fingerprintFields.map(field => [field, normalize(row[field])])
        ),
        packSection: packSection || null
      })];
    }));
  return {
    schemaVersion: 1,
    auditedAt: new Date().toISOString(),
    sourceCommit: gitHead(),
    matrixFileSha256: fingerprint(matrixSource),
    completedBranchCount: Object.keys(branches).length,
    branches
  };
}

function compareCheckpoint(expected, actual) {
  const expectedIds = new Set(Object.keys(expected.branches ?? {}));
  const actualIds = new Set(Object.keys(actual.branches));
  const added = [...actualIds].filter(id => !expectedIds.has(id)).sort();
  const removed = [...expectedIds].filter(id => !actualIds.has(id)).sort();
  const changed = [...actualIds].filter(id => {
    const before = expected.branches?.[id];
    const after = actual.branches[id];
    return before && before !== after;
  }).sort();
  return { added, removed, changed };
}

function isCompletedQaBranch(row) {
  const result = normalize(row.Result);
  return result === 'PASS' || result === 'PASS / CLOSED';
}

function coverageSummary(checkpoint, mapping) {
  const ids = Object.keys(checkpoint.branches);
  let core = 0;
  let supporting = 0;
  const unlinkedIds = [];
  for (const id of ids) {
    const coverage = mapping.get(id);
    if (coverage?.core.size > 0) {
      core += 1;
    } else if (coverage?.supporting.size > 0) {
      supporting += 1;
    } else {
      unlinkedIds.push(id);
    }
  }
  return { total: ids.length, core, supporting, unlinked: unlinkedIds.length, unlinkedIds };
}

function collectTraceability(discoveredDescriptors) {
  const mapping = new Map();
  for (const descriptor of discoveredDescriptors) {
    for (const level of ['core', 'supporting']) {
      for (const id of descriptor.qaBranches[level]) {
        const coverage = mapping.get(id) ?? { core: new Set(), supporting: new Set() };
        coverage[level].add(descriptor.id);
        mapping.set(id, coverage);
      }
    }
  }
  return mapping;
}

async function discoverDescriptors(root, suite, predicate) {
  const files = await walkFiles(root, predicate);
  return Promise.all(files.map(async filename => {
    const descriptor = JSON.parse(await readFile(filename, 'utf8'));
    const relativePath = path.relative(root, filename).replaceAll(path.sep, '/');
    const relative = relativePath.endsWith('/request.json')
      ? relativePath.slice(0, -'/request.json'.length)
      : relativePath.replace(/\.qa\.json$|\.json$/u, '');
    const descriptorId = `${suite}/${relative}`;
    const branches = descriptor.qaBranches;
    const invalidQaBranches = [];
    let core = [];
    let supporting = [];
    if (branches !== undefined) {
      if (!branches || typeof branches !== 'object' || Array.isArray(branches)) {
        invalidQaBranches.push(`${descriptorId}: qaBranches must be an object`);
      } else {
        core = stringArray(branches.core, `${descriptorId}.qaBranches.core`, invalidQaBranches);
        supporting = stringArray(branches.supporting, `${descriptorId}.qaBranches.supporting`, invalidQaBranches);
        const overlap = core.filter(id => supporting.includes(id));
        if (overlap.length > 0) {
          invalidQaBranches.push(`${descriptorId}: core/supporting overlap ${overlap.join(', ')}`);
        }
      }
    }
    return {
      id: descriptorId,
      suite,
      qaBranches: { core, supporting },
      invalidQaBranches
    };
  }));
}

function formatDescriptorCounts(descriptors) {
  const counts = new Map();
  for (const descriptor of descriptors) {
    counts.set(descriptor.suite, (counts.get(descriptor.suite) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([suite, count]) => `${count} ${suite}`)
    .join(', ');
}

function stringArray(value, label, errors) {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || item.trim() === '')) {
    errors.push(`${label} must contain non-empty strings`);
    return [];
  }
  if (new Set(value).size !== value.length) {
    errors.push(`${label} contains duplicates`);
  }
  return [...new Set(value)];
}

async function auditResetCollections() {
  const javaFiles = await walkFiles(javaRoot, filename => filename.endsWith('.java'));
  const expected = new Set();
  for (const filename of javaFiles) {
    const source = await readFile(filename, 'utf8');
    for (const match of source.matchAll(/@Document\s*\(\s*(?:collection\s*=\s*)?"([^"]+)"/g)) {
      expected.add(match[1]);
    }
  }
  for (const entry of await readdir(seedRoot, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      expected.add(entry.name.slice(0, -'.json'.length));
    }
  }
  const missing = [...expected].filter(collection => !E2E_RESET_COLLECTIONS.includes(collection)).sort();
  return { expected: [...expected].sort(), missing };
}

async function walkFiles(root, predicate) {
  const result = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(filename);
      } else if (entry.isFile() && predicate(filename)) {
        result.push(filename);
      }
    }
  }
  await walk(root);
  return result.sort();
}

function qaPackSections(markdown) {
  const lines = markdown.split(/(?<=\n)/);
  const headings = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^###\s+`([^`]+)`/);
    if (match) {
      headings.push({ id: match[1], index });
    }
  }
  const sections = new Map();
  for (let index = 0; index < headings.length; index += 1) {
    const current = headings[index];
    const end = headings[index + 1]?.index ?? lines.length;
    sections.set(current.id, lines.slice(current.index, end).join(''));
  }
  return sections;
}

function recordsFromCsv(source) {
  const records = [];
  let record = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      record.push(field);
      field = '';
    } else if (char === '\n') {
      record.push(field.replace(/\r$/, ''));
      records.push(record);
      record = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || record.length > 0) {
    record.push(field.replace(/\r$/, ''));
    records.push(record);
  }
  const [header, ...body] = records.filter(row => row.some(value => value !== ''));
  return body.map(values => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ''])));
}

function normalize(value) {
  return `${value ?? ''}`.replace(/\s+/g, ' ').trim();
}

function fingerprint(value) {
  const source = typeof value === 'string' ? value : JSON.stringify(value);
  return createHash('sha256').update(source).digest('hex');
}

function gitHead() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'unknown';
  }
}
