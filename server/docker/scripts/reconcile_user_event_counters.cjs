/* eslint-disable no-console */
'use strict';

const COUNTER_FIELDS = [
  'all',
  'active',
  'pending',
  'invitations',
  'hosting',
  'drafts',
  'trash'
];

function text(value) {
  return value == null ? '' : String(value).trim();
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function count(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
}

function normalizeStatus(value) {
  switch (text(value).toLowerCase()) {
    case 'active':
      return 'A';
    case 'draft':
      return 'DR';
    case 'under-review':
    case 'under review':
      return 'UR';
    case 'blocked':
      return 'B';
    case 'deleted':
      return 'D';
    case 'inactive':
      return 'I';
    case 'trashed':
    case 'trash':
      return 'T';
    default:
      return text(value);
  }
}

function ids(values) {
  return new Set(array(values).map(text).filter(Boolean));
}

function isGeneratedSlot(event) {
  return Boolean(event && (
    event.generated === true
    || text(event.parentEventId)
    || text(event.eventType) === 'slot'
  ));
}

function collectedSourceId(event) {
  if (!event) {
    return '';
  }
  return isGeneratedSlot(event) && text(event.parentEventId)
    ? text(event.parentEventId)
    : text(event.sourceId);
}

function isTrash(event) {
  return Boolean(event && (
    event.isTrashed === true
    || normalizeStatus(event.status) === 'T'
  ));
}

function isActive(event) {
  const status = normalizeStatus(event && event.status);
  return status === 'A' || !status;
}

function isDraft(event) {
  return Boolean(event && !isActive(event));
}

function isPendingReview(event) {
  return new Set(['UR', 'B']).has(normalizeStatus(event && event.status));
}

function isHost(event, userId) {
  const user = text(userId);
  return Boolean(event && user && (
    text(event.creatorUserId) === user
    || ids(event.admins).has(user)
  ));
}

function preferenceScore(event, userId) {
  if (!event) {
    return 0;
  }
  return (text(event.ownerUserId) === text(userId) ? 64 : 0)
    + (isTrash(event) ? 0 : 16)
    + (isHost(event, text(event.creatorUserId)) ? 8 : 0)
    + (isActive(event) ? 2 : 0)
    + (ids(event.admins).size ? 1 : 0);
}

function sourceCandidates(events, members, userId) {
  const sourceIds = new Set();
  const deletedMembershipSourceIds = new Set();
  for (const member of array(members)) {
    if (text(member && member.ownerType) !== 'event'
      || text(member && member.userId) !== userId) {
      continue;
    }
    const status = normalizeStatus(member.status);
    if (status === 'D') {
      const sourceId = text(member.ownerId);
      if (sourceId) {
        sourceIds.add(sourceId);
        deletedMembershipSourceIds.add(sourceId);
      }
    }
  }
  for (const event of array(events)) {
    if (!event || event.generated === true || !text(event.sourceId)) {
      continue;
    }
    const direct = text(event.ownerUserId) === userId;
    const admin = ids(event.admins).has(userId);
    const accepted = ids(event.acceptedMemberUserIds).has(userId);
    const invited = isActive(event) && ids(event.invitedMemberUserIds).has(userId);
    const pending = ids(event.pendingRequestMemberUserIds).has(userId);
    if (direct || admin || accepted || invited || pending) {
      const sourceId = collectedSourceId(event);
      if (sourceId) {
        sourceIds.add(sourceId);
      }
    }
  }
  return { sourceIds, deletedMembershipSourceIds };
}

function preferredEvents(events, sourceIds, userId) {
  const result = new Map();
  for (const event of array(events)) {
    const sourceId = text(event && event.sourceId);
    if (!sourceId || !sourceIds.has(sourceId)) {
      continue;
    }
    const current = result.get(sourceId);
    if (!current || preferenceScore(event, userId) > preferenceScore(current, userId)) {
      result.set(sourceId, event);
    }
  }
  return result;
}

function eventCounters(events, members, userId) {
  const { sourceIds, deletedMembershipSourceIds } =
    sourceCandidates(events, members, userId);
  const preferred = preferredEvents(events, sourceIds, userId);
  const counters = {
    all: 0,
    active: 0,
    pending: 0,
    invitations: 0,
    hosting: 0,
    drafts: 0,
    trash: 0
  };
  for (const [sourceId, event] of preferred.entries()) {
    if (isTrash(event) || deletedMembershipSourceIds.has(sourceId)) {
      counters.trash += 1;
      continue;
    }
    if (ids(event.invitedMemberUserIds).has(userId)) {
      counters.invitations += 1;
      continue;
    }
    if (isHost(event, userId)) {
      counters.hosting += 1;
      if (isDraft(event)) {
        counters.drafts += 1;
      }
      if (isPendingReview(event)) {
        counters.pending += 1;
      }
      continue;
    }
    if (ids(event.pendingRequestMemberUserIds).has(userId) || isPendingReview(event)) {
      counters.pending += 1;
      continue;
    }
    if (ids(event.acceptedMemberUserIds).has(userId) || isActive(event)) {
      counters.active += 1;
    }
  }
  counters.all =
    counters.active + counters.pending + counters.invitations + counters.hosting;
  return counters;
}

function sameCounters(left, right) {
  return COUNTER_FIELDS.every(field => count(left && left[field]) === right[field]);
}

function reconcile(data, apply) {
  const events = array(data.events);
  const members = array(data.activityMembers);
  const changedUsers = [];
  const examples = [];
  for (const user of array(data.users)) {
    const userId = text(user && (user.userId || user.id));
    if (!userId) {
      continue;
    }
    const next = eventCounters(events, members, userId);
    const activities = object(user.activities);
    const current = object(activities.event);
    if (sameCounters(current, next)
      && count(activities.invitations) === next.invitations
      && count(activities.events) === next.active
      && count(activities.hosting) === next.hosting) {
      continue;
    }
    if (examples.length < 25) {
      examples.push({
        userId,
        name: user.name,
        current: Object.fromEntries(COUNTER_FIELDS.map(field => [field, count(current[field])])),
        next
      });
    }
    changedUsers.push({ id: user._id, userId, next });
    if (apply) {
      user.activities = {
        ...activities,
        invitations: next.invitations,
        events: next.active,
        hosting: next.hosting,
        event: next
      };
    }
  }
  return {
    changedUsers,
    report: {
      scannedUsers: array(data.users).length,
      scannedEvents: events.length,
      scannedActivityMembers: members.length,
      changedUsers: changedUsers.length,
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
    throw new Error('Usage: node reconcile_user_event_counters.cjs --seed-dir <dir> [--apply]');
  }
  const seedDir = path.resolve(args[seedIndex + 1]);
  const read = name =>
    JSON.parse(fs.readFileSync(path.join(seedDir, `${name}.json`), 'utf8'));
  const data = {
    users: read('users'),
    events: read('events'),
    activityMembers: read('activityMembers')
  };
  const apply = args.includes('--apply');
  const result = reconcile(data, apply);
  if (apply) {
    fs.writeFileSync(
      path.join(seedDir, 'users.json'),
      `${JSON.stringify(data.users, null, 2)}\n`);
  }
  console.log(JSON.stringify(
    { mode: apply ? 'apply' : 'dry-run', ...result.report },
    null,
    2));
}

function runMongo() {
  const data = {
    users: db.users.find({}).toArray(),
    events: db.events.find({}).toArray(),
    activityMembers: db.activityMembers.find({}).toArray()
  };
  const apply = typeof process !== 'undefined'
    && process.env
    && process.env.USER_EVENT_COUNTER_APPLY === 'true';
  const result = reconcile(data, apply);
  if (apply && result.changedUsers.length) {
    db.users.bulkWrite(result.changedUsers.map(user => ({
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set: {
            'activities.invitations': user.next.invitations,
            'activities.events': user.next.active,
            'activities.hosting': user.next.hosting,
            'activities.event': user.next
          }
        }
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
  module.exports = { eventCounters, reconcile };
}
