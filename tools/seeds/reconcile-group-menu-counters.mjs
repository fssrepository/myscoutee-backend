import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Canonical seed preparation only; runtime changes use CommunityMembershipService.
const root = new URL('../../server/docker/conf/mongodb/', import.meta.url);
const buckets = ['hosting', 'participation', 'pending', 'invitations', 'trash'];
const write = process.argv.includes('--write');
for (const database of ['demo_db', 'e2e_db', 'myscoutee_db']) {
  const userPath = new URL(`${database}/users.json`, root);
  const memberPath = new URL(`${database}/activityMembers.json`, root);
  const users = JSON.parse(await readFile(userPath, 'utf8'));
  const members = JSON.parse(await readFile(memberPath, 'utf8'));
  const accounts = new Map(users.filter(user => !user.workspaceGroupId).map(user => [user.userId, user]));
  for (const user of accounts.values()) {
    user.menuCounters = { ...user.menuCounters, ...Object.fromEntries(buckets.map(bucket => [`groups_${bucket}`, 0])) };
    user.menuCounterVersions = Object.fromEntries(Object.entries(user.menuCounterVersions ?? {}).filter(([key]) => !key.startsWith('group-member-')));
  }
  for (const member of members) {
    if (member.ownerType !== 'community') continue;
    const account = accounts.get(member.userId);
    if (!account) throw new Error(`Missing account for community membership ${member._id}`);
    const trash = member.status === 'blocked' || member.status === 'deleted' && member.requestKind == null
      && member.communityAction === 'remove' && member.userId === member.communityActor;
    const bucket = trash ? 'trash' : member.status === 'accepted' ? member.role === 'Admin' ? 'hosting' : 'participation'
      : member.status === 'pending' ? member.requestKind === 'invite' ? 'invitations' : 'pending' : null;
    member.groupCounterState = { revision: 1, bucket, pending: null };
    account.menuCounterVersions[`group-member-${createHash('md5').update(String(member._id)).digest('hex')}`] = 1;
    if (bucket) account.menuCounters[`groups_${bucket}`]++;
  }
  if (write) {
    await writeFile(userPath, `${JSON.stringify(users, null, 2)}\n`);
    await writeFile(memberPath, `${JSON.stringify(members, null, 2)}\n`);
  }
  console.log(`${write ? 'Updated' : 'Checked'} ${database}: ${accounts.size} accounts, ${members.filter(m => m.ownerType === 'community').length} group memberships (${fileURLToPath(userPath)})`);
}
