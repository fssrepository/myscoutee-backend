#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const frontendRoot = path.join(repoRoot, 'myscoutee-frontend', 'src');
const allowed = new Set(['max-width:760']);
const allowedByFile = new Map(Object.entries({
  'myscoutee-frontend/src/app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-popup.component.scss': ['max-width:640'],
  'myscoutee-frontend/src/app/activity/components/event-checkout-slot-picker-popup/event-checkout-slot-picker-popup.component.scss': ['max-width:720'],
  'myscoutee-frontend/src/app/activity/components/event-editor-popup/event-payment-input/event-payment-input.component.scss': ['max-width:860', 'max-width:640'],
  'myscoutee-frontend/src/app/activity/components/feedback-rated-detail-popup/feedback-rated-detail-popup.component.scss': ['max-width:700'],
  'myscoutee-frontend/src/app/activity/components/event-resource-popup/asset-explore-borrow-dialog/event-resource-asset-explore-borrow-dialog.component.scss': ['max-width:640'],
  'myscoutee-frontend/src/app/activity/components/event-resource-popup/assigned-asset-join-dialog/event-resource-assigned-asset-join-dialog.component.scss': ['max-width:640'],
  'myscoutee-frontend/src/app/activity/components/event-subevent-definitions-panel/event-subevent-definitions-panel.component.scss': ['min-width:761'],
  'myscoutee-frontend/src/app/activity/components/event-subevents-list-popup/event-subevents-list-popup.component.scss': ['min-width:761'],
  'myscoutee-frontend/src/app/entry/components/entry-landing/entry-landing.component.scss': ['min-width:761'],
  'myscoutee-frontend/src/app/operator/components/operator-action-popup/operator-action-popup.component.scss': ['max-width:820', 'max-width:560'],
  'myscoutee-frontend/src/app/operator/components/operator-registry-popup/operator-registry-popup.component.scss': ['max-width:560'],
  'myscoutee-frontend/src/app/operator/components/operator-revenue-view/operator-revenue-view.component.scss': ['max-width:820', 'max-width:560'],
  'myscoutee-frontend/src/app/profile/components/feedback-popup/feedback-popup.component.scss': ['max-width:520'],
  'myscoutee-frontend/src/app/profile/components/report-user-popup/report-user-popup.component.scss': ['max-width:520'],
  'myscoutee-frontend/src/app/shared/ui/components/core/accordion/accordion.component.scss': ['max-width:620'],
  'myscoutee-frontend/src/app/shared/ui/components/core/form/flow/form-flow.component.scss': ['max-width:720'],
  'myscoutee-frontend/src/app/shared/ui/components/core/form/inputs/date-input/date-input.component.scss': ['max-width:520'],
  'myscoutee-frontend/src/app/shared/ui/components/core/form/inputs/route-input/route-input.component.scss': ['max-width:720', 'max-width:560'],
  'myscoutee-frontend/src/app/shared/ui/components/core/popup/popup.component.scss': ['min-width:761'],
  'myscoutee-frontend/src/app/shared/ui/components/core/smart-list/card/header-card/header-card.component.scss': ['max-width:640'],
  'myscoutee-frontend/src/app/shared/ui/components/core/smart-list/card/info-card/info-card.component.scss': ['min-width:761'],
  'myscoutee-frontend/src/app/shared/ui/components/core/smart-list/card/pair-card/pair-card.component.scss': ['min-width:761'],
  'myscoutee-frontend/src/app/shared/ui/components/core/smart-list/card/payment-card/payment-card.component.scss': ['max-width:520'],
  'myscoutee-frontend/src/app/shared/ui/components/core/smart-list/card/text-card/text-card.component.scss': ['max-width:560'],
  'myscoutee-frontend/src/app/shared/ui/components/core/smart-list/smart-list.component.scss': ['min-width:761'],
  'myscoutee-frontend/src/app/shared/ui/components/side-menu/side-menu.component.scss': ['max-width:900']
}).map(([file, queries]) => [file, new Set(queries)]));
const allowedDuplicateCounts = new Map([
  ['myscoutee-frontend/src/app/entry/components/entry-landing/entry-landing.component.scss|media|max-width|760', 2],
  ['myscoutee-frontend/src/app/shared/ui/components/core/image-carousel/image-carousel.component.scss|media|max-width|760', 2],
  ['myscoutee-frontend/src/app/shared/ui/components/core/popup/popup.component.scss|media|min-width|761', 2],
  ['myscoutee-frontend/src/app/shared/ui/components/core/smart-list/card/calendar-card/calendar-card.component.scss|media|max-width|760', 2]
]);
const findings = [];
const duplicates = new Map();

await scan(frontendRoot);

if (findings.length > 0) {
  console.error('Unexpected frontend responsive breakpoints:');
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} @${finding.kind} ${finding.feature}: ${finding.width}px`);
  }
}

const duplicateFindings = [...duplicates.values()].filter(finding => {
  const key = `${finding.file}|${finding.kind}|${finding.feature}|${finding.width}`;
  return finding.count > (allowedDuplicateCounts.get(key) ?? 1);
});
if (duplicateFindings.length > 0) {
  console.error('Duplicate frontend responsive blocks:');
  for (const finding of duplicateFindings) {
    console.error(`- ${finding.file}:${finding.line} @${finding.kind} (${finding.feature}: ${finding.width}px) appears ${finding.count} times`);
  }
}

if (findings.length > 0 || duplicateFindings.length > 0) {
  process.exit(1);
}

console.log('frontend responsive breakpoints match the reviewed file-scoped baseline');

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
      const relativeFile = path.relative(repoRoot, fullPath);
      const query = `${feature}:${width}`;
      if (!allowed.has(query) && !allowedByFile.get(relativeFile)?.has(query)) {
        findings.push({
          file: relativeFile,
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
          file: relativeFile,
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
