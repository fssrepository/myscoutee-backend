#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const seedFiles = [
  'server/docker/conf/mongodb/demo_db/users.json',
  'server/docker/conf/mongodb/e2e_db/users.json'
];

for (const relativePath of seedFiles) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  const users = JSON.parse(await readFile(absolutePath, 'utf8'));
  let memberNumber = 0;
  let adminNumber = 0;
  let operatorNumber = 0;

  for (const user of users) {
    const hostTier = `${user.hostTier ?? ''}`.trim().toLowerCase();
    if (user.operator === true || hostTier === 'operator') {
      operatorNumber += 1;
      user.email = `operator${operatorNumber}@myscoutee.local`;
    } else if (hostTier === 'admin') {
      adminNumber += 1;
      user.email = `admin${adminNumber}@myscoutee.local`;
    } else {
      memberNumber += 1;
      user.email = `member${memberNumber}@myscoutee.local`;
    }
  }

  const emails = users.map(user => `${user.email ?? ''}`.trim().toLowerCase());
  if (emails.some(email => !email) || new Set(emails).size !== emails.length) {
    throw new Error(`${relativePath} did not receive a complete unique email set.`);
  }
  if (adminNumber !== 2 || operatorNumber !== 1 || memberNumber < 1) {
    throw new Error(
      `${relativePath} has unexpected role cardinality: `
      + `${memberNumber} members, ${adminNumber} admins, ${operatorNumber} operators.`
    );
  }

  await writeFile(absolutePath, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
  process.stdout.write(
    `${relativePath}: ${memberNumber} member, ${adminNumber} admin and `
    + `${operatorNumber} operator emails assigned uniquely.\n`
  );
}
