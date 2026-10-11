// Materialize the existing local demo seed profile details into both Mongo fixtures.
// No production seed or running database is modified by this command.
import { readFile, writeFile } from 'node:fs/promises';
import { build } from '../../frontend/node_modules/esbuild/lib/main.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const mode = process.argv[2];
if (!['--check', '--write'].includes(mode)) throw Error('Use --check or --write');
const result = await build({
  entryPoints: [path.join(root, 'frontend/src/app/shared/core/local/seed/builders/accounts/user-seed.builder.ts')],
  bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent'
});
const { SeedUserBuilder } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const seeds = SeedUserBuilder.buildExpandedDemoUsers(50);
const byName = new Map(seeds.map(user => [user.name, user]));
if (byName.size !== seeds.length) throw Error('Ambiguous local seed name mapping');
let mismatch = false;
for (const db of ['demo_db', 'e2e_db']) {
  const file = path.join(root, 'server/docker/conf/mongodb', db, 'users.json');
  const users = JSON.parse(await readFile(file, 'utf8'));
  let matched = 0, changed = 0;
  for (const user of users) {
    if (user.accountUserId || user.workspaceGroupId) continue;
    const seed = byName.get(user.name);
    if (!seed) continue;
    matched++;
    const expected = seed.profileDetails;
    if (JSON.stringify(user.profileDetails) === JSON.stringify(expected)) continue;
    // Existing curated seed values require explicit reconciliation, never silent overwrite.
    if (user.profileDetails != null) throw Error(`${db}: existing profile details differ for ${user.name}`);
    user.profileDetails = expected;
    changed++;
  }
  if (matched !== seeds.length) throw Error(`${db}: expected ${seeds.length} mapped base profiles, found ${matched}`);
  if (changed) {
    mismatch = true;
    if (mode === '--write') await writeFile(file, JSON.stringify(users, null, 2) + '\n');
  }
  console.log(`${db}: ${matched} matched seed profiles; ${changed} ${mode === '--write' ? 'updated' : 'missing'}`);
}
if (mode === '--check' && mismatch) process.exitCode = 1;
