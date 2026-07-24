/* eslint-disable no-console */
'use strict';

const MEMBER_FIELDS = [
  'acceptedMembers',
  'pendingMembers',
  'acceptedMemberUserIds',
  'pendingMemberUserIds',
  'invitedMemberUserIds',
  'pendingRequestMemberUserIds',
  'admins',
  'capacityTotal',
  'full'
];

function text(value) {
  return value == null ? '' : String(value).trim();
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function count(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
}

function distinct(values) {
  return [...new Set(array(values).map(text).filter(Boolean))];
}

function memberStatus(value) {
  const status = text(value);
  if (status === 'I' || status === 'pending'
    || status === 'deleted' || status === 'disqualified') {
    return status;
  }
  return 'accepted';
}

function isInvitation(member) {
  return text(member && member.pendingSource) === 'admin'
    || new Set(['invite', 'waitlist-invite']).has(text(member && member.requestKind));
}

function memberPriority(member) {
  const status = memberStatus(member && member.status);
  if (status === 'pending') {
    return 0;
  }
  if (status === 'accepted'
    && new Set(['Admin', 'Manager']).has(text(member && member.role))) {
    return 1;
  }
  if (status === 'accepted') {
    return 2;
  }
  return status === 'disqualified' ? 3 : 4;
}

function orderedMembers(members) {
  return array(members)
    .filter(Boolean)
    .filter(member => memberStatus(member.status) !== 'deleted')
    .sort((left, right) => {
      const priority = memberPriority(left) - memberPriority(right);
      if (priority) {
        return priority;
      }
      const action = text(right.actionAtIso).localeCompare(text(left.actionAtIso));
      return action || text(left.userId).localeCompare(text(right.userId));
    });
}

function projection(event, members) {
  const ordered = orderedMembers(members);
  const acceptedMemberUserIds = distinct(ordered
    .filter(member => memberStatus(member.status) === 'accepted')
    .map(member => member.userId));
  const pendingMemberUserIds = distinct(ordered
    .filter(member => memberStatus(member.status) === 'pending')
    .map(member => member.userId));
  const invitedMemberUserIds = distinct(ordered
    .filter(member => {
      const status = memberStatus(member.status);
      return status === 'I' || (status === 'pending' && isInvitation(member));
    })
    .map(member => member.userId));
  const pendingRequestMemberUserIds = distinct(ordered
    .filter(member =>
      memberStatus(member.status) === 'pending' && !isInvitation(member))
    .map(member => member.userId));
  const admins = distinct([
    ...ordered
      .filter(member =>
        memberStatus(member.status) === 'accepted'
        && text(member.role) === 'Admin')
      .map(member => member.userId),
    event && event.creatorUserId
  ]);
  const capacityTotal = Math.max(
    acceptedMemberUserIds.length,
    count(event && event.capacityTotal));
  return {
    acceptedMembers: acceptedMemberUserIds.length,
    pendingMembers: pendingMemberUserIds.length,
    acceptedMemberUserIds,
    pendingMemberUserIds,
    invitedMemberUserIds,
    pendingRequestMemberUserIds,
    admins,
    capacityTotal,
    full: capacityTotal > 0 && acceptedMemberUserIds.length >= capacityTotal
  };
}

function comparable(value) {
  return Array.isArray(value) ? distinct(value).sort() : value;
}

function sameField(left, right) {
  return JSON.stringify(comparable(left)) === JSON.stringify(comparable(right));
}

function reconcile(data, apply) {
  const membersByEventId = new Map();
  for (const member of array(data.activityMembers)) {
    if (text(member && member.ownerType) !== 'event' || !text(member.ownerId)) {
      continue;
    }
    const ownerId = text(member.ownerId);
    if (!membersByEventId.has(ownerId)) {
      membersByEventId.set(ownerId, []);
    }
    membersByEventId.get(ownerId).push(member);
  }

  const changedEvents = [];
  const examples = [];
  const changedFieldsByName =
    Object.fromEntries(MEMBER_FIELDS.map(field => [field, 0]));
  let changedFields = 0;
  let skippedWithoutMemberRecords = 0;
  for (const event of array(data.events)) {
    const sourceId = text(event && event.sourceId);
    const members = membersByEventId.get(sourceId);
    if (!sourceId || !members || !members.length) {
      if (sourceId && (!members || !members.length)) {
        skippedWithoutMemberRecords += 1;
      }
      continue;
    }
    const next = projection(event, members);
    const fields = MEMBER_FIELDS.filter(field =>
      !(field === 'full' && event[field] == null)
      && !sameField(event[field], next[field]));
    if (!fields.length) {
      continue;
    }
    changedFields += fields.length;
    fields.forEach(field => {
      changedFieldsByName[field] += 1;
    });
    const changes = Object.fromEntries(fields.map(field => [field, next[field]]));
    changedEvents.push({ id: event._id, sourceId, next: changes });
    if (examples.length < 25) {
      examples.push({
        sourceId,
        title: event.title,
        fields,
        current: Object.fromEntries(fields.map(field => [field, event[field]])),
        next: Object.fromEntries(fields.map(field => [field, next[field]]))
      });
    }
    if (apply) {
      Object.assign(event, changes);
    }
  }
  return {
    changedEvents,
    report: {
      scannedEvents: array(data.events).length,
      scannedActivityMembers: array(data.activityMembers).length,
      changedEvents: changedEvents.length,
      changedFields,
      changedFieldsByName,
      skippedWithoutMemberRecords,
      examples
    }
  };
}

async function runSeedCli() {
  const fs = require('node:fs');
  const path = require('node:path');
  const args = process.argv.slice(2);
  const seedIndex = args.indexOf('--seed-dir');
  if (seedIndex < 0 || !args[seedIndex + 1]) {
    throw new Error('Usage: node reconcile_event_member_projections.cjs --seed-dir <dir> [--apply]');
  }
  const seedDir = path.resolve(args[seedIndex + 1]);
  const read = name =>
    JSON.parse(fs.readFileSync(path.join(seedDir, `${name}.json`), 'utf8'));
  const data = {
    events: read('events'),
    activityMembers: read('activityMembers')
  };
  const apply = args.includes('--apply');
  const result = reconcile(data, apply);
  if (apply) {
    fs.writeFileSync(
      path.join(seedDir, 'events.json'),
      `${JSON.stringify(data.events, null, 2)}\n`);
  }
  console.log(JSON.stringify(
    { mode: apply ? 'apply' : 'dry-run', ...result.report },
    null,
    2));
}

function runMongo() {
  const data = {
    events: db.events.find({}).toArray(),
    activityMembers: db.activityMembers.find({}).toArray()
  };
  const apply = typeof process !== 'undefined'
    && process.env
    && process.env.EVENT_MEMBER_PROJECTION_APPLY === 'true';
  const result = reconcile(data, apply);
  if (apply && result.changedEvents.length) {
    db.events.bulkWrite(result.changedEvents.map(event => ({
      updateOne: {
        filter: { _id: event.id },
        update: { $set: event.next }
      }
    })), { ordered: false });
  }
  print(JSON.stringify(
    { mode: apply ? 'apply' : 'dry-run', ...result.report },
    null,
    2));
}

if (typeof db !== 'undefined' && db && typeof db.getCollection === 'function') {
  runMongo();
} else if (typeof require === 'function' && require.main === module) {
  runSeedCli().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

if (typeof module !== 'undefined') {
  module.exports = { projection, reconcile };
}
