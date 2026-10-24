import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Canonical seed preparation only; runtime changes use CommunityMembershipService.
const project = process.env.MYSCOUTEE_PACKAGING_PROJECT_ROOT || fileURLToPath(new URL('../../../../', import.meta.url));
const config = JSON.parse(await readFile(path.join(project, 'config/packaging/seeds/data/group-counters.json'), 'utf8'));
const root = pathToFileURL(path.join(project, config.seedRoot) + path.sep);
const buckets = config.buckets;
const write = process.argv.includes('--write');
for (const database of config.databases) {
  const userPath = new URL(`${database}/users.json`, root);
  const memberPath = new URL(`${database}/activityMembers.json`, root);
  const users = JSON.parse(await readFile(userPath, 'utf8'));
  const members = JSON.parse(await readFile(memberPath, 'utf8'));
  const accounts = new Map(users.filter(user => !user.workspaceGroupId).map(user => [user.userId, user]));
  for (const user of accounts.values()) {
    user.menuCounters = { ...user.menuCounters, ...Object.fromEntries(buckets.map(bucket => [`${config.counterPrefix}${bucket}`, 0])) };
    user.menuCounterVersions = Object.fromEntries(Object.entries(user.menuCounterVersions ?? {}).filter(([key]) => !key.startsWith(config.versionPrefix)));
  }
  for (const member of members) {
    if (member.ownerType !== config.ownerType) continue;
    const account = accounts.get(member.userId);
    if (!account) throw new Error(`Missing account for community membership ${member._id}`);
    const trash = member.status === 'blocked' || member.status === 'deleted' && member.requestKind == null
      && member.communityAction === 'remove' && member.userId === member.communityActor;
    const bucket = trash ? 'trash' : member.status === 'accepted' ? member.role === 'Admin' ? 'hosting' : 'participation'
      : member.status === 'pending' ? member.requestKind === 'invite' ? 'invitations' : 'pending' : null;
    member.groupCounterState = { revision: config.revision, bucket, pending: null };
    account.menuCounterVersions[`${config.versionPrefix}${createHash('md5').update(String(member._id)).digest('hex')}`] = 1;
    if (bucket) account.menuCounters[`${config.counterPrefix}${bucket}`]++;
  }
  if (write) {
    await writeFile(userPath, `${JSON.stringify(users, null, 2)}\n`);
    await writeFile(memberPath, `${JSON.stringify(members, null, 2)}\n`);
  }
  console.log(`${write ? 'Updated' : 'Checked'} ${database}: ${accounts.size} accounts, ${members.filter(m => m.ownerType === config.ownerType).length} group memberships (${fileURLToPath(userPath)})`);
}
