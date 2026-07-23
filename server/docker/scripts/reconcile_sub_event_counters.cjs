/* eslint-disable no-console */
'use strict';

const COUNTER_FIELDS = [
  'membersAccepted',
  'membersPending',
  'carsAccepted',
  'carsPending',
  'carsCapacityMin',
  'carsCapacityMax',
  'accommodationAccepted',
  'accommodationPending',
  'accommodationCapacityMin',
  'accommodationCapacityMax',
  'suppliesAccepted',
  'suppliesPending',
  'suppliesCapacityMin',
  'suppliesCapacityMax'
];

function text(value) {
  return value == null ? '' : String(value).trim();
}

function count(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function mapBy(items, keySelector) {
  const result = new Map();
  for (const item of array(items)) {
    const key = text(keySelector(item));
    if (key) {
      result.set(key, item);
    }
  }
  return result;
}

function normalizeLifecycleStatus(status) {
  const value = text(status).toLowerCase();
  switch (value) {
    case 'active':
      return 'A';
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
      return text(status);
  }
}

function isEligibleLifecycle(asset) {
  return asset && !new Set(['UR', 'B', 'D', 'I', 'T']).has(normalizeLifecycleStatus(asset.status));
}

function authorizationEventId(ownerId, subEventId) {
  const owner = text(ownerId);
  const subEvent = text(subEventId);
  let runtimeOwner = owner;
  const groupMarker = subEvent ? owner.indexOf(`:${subEvent}:`) : -1;
  if (groupMarker > 0) {
    runtimeOwner = owner.slice(0, groupMarker);
  }
  const slotMarker = runtimeOwner.indexOf(':slot:');
  return slotMarker > 0 ? runtimeOwner.slice(0, slotMarker) : runtimeOwner;
}

function bookingMatches(booking, eventId, subEventId) {
  return booking
    && text(booking.eventId) === text(eventId)
    && text(booking.subEventId) === text(subEventId);
}

function eligibleAsset(asset, resource, assetRequests) {
  if (!isEligibleLifecycle(asset)) {
    return false;
  }
  const assetOwnerUserId = text(resource.assetOwnerUserId);
  if (text(asset.ownerUserId) === assetOwnerUserId) {
    return true;
  }
  const eventId = authorizationEventId(resource.ownerId, resource.subEventId);
  return array(assetRequests).some(request =>
    text(request.assetId) === text(asset.assetId)
    && text(request.userId) === assetOwnerUserId
    && text(request.requestKind).toLowerCase() === 'borrow'
    && ['accepted', 'pending'].includes(text(request.status).toLowerCase())
    && bookingMatches(request.booking, eventId, resource.subEventId)
  );
}

function scopedAssetRequestStatuses(asset, ownerId, subEventId) {
  const statusByIdentity = new Map();
  for (const request of array(asset && asset.requests)) {
    if (!bookingMatches(request && request.booking, ownerId, subEventId)) {
      continue;
    }
    const status = text(request.status).toLowerCase();
    if (status !== 'accepted' && status !== 'pending') {
      continue;
    }
    const identity = text(request.userId) || text(request._id) || text(request.id);
    if (!identity) {
      continue;
    }
    const existing = statusByIdentity.get(identity);
    if (existing !== 'accepted' || status === 'accepted') {
      statusByIdentity.set(identity, status);
    }
  }
  return statusByIdentity;
}

function hasScopedAssetRequestForUser(asset, ownerId, subEventId, userId) {
  const normalizedUserId = text(userId);
  return normalizedUserId && array(asset && asset.requests).some(request =>
    text(request && request.userId) === normalizedUserId
    && bookingMatches(request && request.booking, ownerId, subEventId)
    && ['accepted', 'pending'].includes(text(request && request.status).toLowerCase())
  );
}

function assignedAssetIds(resource, type) {
  const assignments = array(object(resource.assetAssignmentIds)[type]);
  const settings = object(object(resource.assetSettingsByType)[type]);
  const values = assignments.length ? assignments : Object.keys(settings);
  return [...new Set(values.map(text).filter(Boolean))];
}

function resourceMetric(resource, type, assetsById, assetRequests) {
  const settingsByAssetId = object(object(resource.assetSettingsByType)[type]);
  let accepted = 0;
  let pending = 0;
  let capacityMin = 0;
  let capacityMax = 0;

  for (const assetId of assignedAssetIds(resource, type)) {
    const asset = assetsById.get(assetId);
    if (!eligibleAsset(asset, resource, assetRequests)) {
      continue;
    }
    const settings = object(settingsByAssetId[assetId]);
    const quantity = Math.max(1, count(settings.quantity));
    capacityMin += count(settings.capacityMin);
    capacityMax += asset.capacityTotal != null
      ? count(asset.capacityTotal) * quantity
      : count(settings.capacityMax) * quantity;

    if (type === 'Supplies') {
      accepted += array(object(resource.supplyContributionEntriesByAssetId)[assetId])
        .reduce((sum, entry) => sum + count(entry && entry.quantity), 0);
      continue;
    }

    const statuses = scopedAssetRequestStatuses(asset, resource.ownerId, resource.subEventId);
    accepted += [...statuses.values()].filter(status => status === 'accepted').length;
    pending += [...statuses.values()].filter(status => status === 'pending').length;
    const managerUserId = text(settings.addedByUserId);
    if (managerUserId && !hasScopedAssetRequestForUser(
      asset,
      resource.ownerId,
      resource.subEventId,
      managerUserId
    )) {
      if (managerUserId === text(asset.ownerUserId)) {
        accepted += 1;
      } else {
        pending += 1;
      }
    }
  }

  return {
    accepted,
    pending,
    capacityMin,
    capacityMax: Math.max(capacityMin, capacityMax)
  };
}

function memberMetric(activityMembers, ownerId) {
  const accepted = new Set();
  const pending = new Set();
  for (const member of array(activityMembers)) {
    if (text(member.ownerType) !== 'subEvent' || text(member.ownerId) !== ownerId) {
      continue;
    }
    const userId = text(member.userId);
    const status = text(member.status).toLowerCase();
    if (!userId || status === 'deleted') {
      continue;
    }
    if (status === 'accepted') {
      accepted.add(userId);
    } else if (status === 'pending') {
      pending.add(userId);
    }
  }
  return { accepted: accepted.size, pending: pending.size };
}

function aggregateResourceMetrics(resources, assetsById, assetRequests) {
  const result = {
    Transport: { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 0 },
    Accommodation: { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 0 },
    Supplies: { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 0 }
  };
  for (const resource of array(resources)) {
    for (const type of Object.keys(result)) {
      const metric = resourceMetric(resource, type, assetsById, assetRequests);
      result[type].accepted += metric.accepted;
      result[type].pending += metric.pending;
      result[type].capacityMin += metric.capacityMin;
      result[type].capacityMax += metric.capacityMax;
    }
  }
  for (const metric of Object.values(result)) {
    metric.capacityMax = Math.max(metric.capacityMin, metric.capacityMax);
  }
  return result;
}

function nextCounters(event, subEvent, context) {
  const sourceId = text(event.sourceId);
  const subEventId = text(subEvent && subEvent.id);
  const projectionUserId = text(event.ownerUserId) || text(event.creatorUserId);
  const member = memberMetric(context.activityMembers, `${sourceId}:${subEventId}`);
  const resources = context.activityResources.filter(resource =>
    text(resource.status) !== 'D'
    && text(resource.ownerId) === sourceId
    && text(resource.subEventId) === subEventId
    && text(resource.assetOwnerUserId) === projectionUserId
  );
  const metrics = aggregateResourceMetrics(resources, context.assetsById, context.assetRequests);
  return {
    membersAccepted: member.accepted,
    membersPending: member.pending,
    carsAccepted: metrics.Transport.accepted,
    carsPending: metrics.Transport.pending,
    carsCapacityMin: metrics.Transport.capacityMin,
    carsCapacityMax: metrics.Transport.capacityMax,
    accommodationAccepted: metrics.Accommodation.accepted,
    accommodationPending: metrics.Accommodation.pending,
    accommodationCapacityMin: metrics.Accommodation.capacityMin,
    accommodationCapacityMax: metrics.Accommodation.capacityMax,
    suppliesAccepted: metrics.Supplies.accepted,
    suppliesPending: metrics.Supplies.pending,
    suppliesCapacityMin: metrics.Supplies.capacityMin,
    suppliesCapacityMax: metrics.Supplies.capacityMax
  };
}

function reconcile(data, apply) {
  const context = {
    activityMembers: array(data.activityMembers),
    activityResources: array(data.activityResources),
    assetRequests: array(data.assetRequests),
    assetsById: mapBy(data.assets, asset => asset && asset.assetId)
  };
  const changedEvents = [];
  const examples = [];
  let changedSubEvents = 0;
  let changedFields = 0;

  for (const event of array(data.events)) {
    if (!text(event && event.sourceId) || !array(event && event.subEvents).length) {
      continue;
    }
    let eventChanged = false;
    const subEvents = event.subEvents.map(subEvent => {
      if (!text(subEvent && subEvent.id)) {
        return subEvent;
      }
      const counters = nextCounters(event, subEvent, context);
      const fieldChanges = COUNTER_FIELDS.filter(field => count(subEvent[field]) !== counters[field]);
      if (!fieldChanges.length) {
        return subEvent;
      }
      eventChanged = true;
      changedSubEvents += 1;
      changedFields += fieldChanges.length;
      if (examples.length < 25) {
        examples.push({
          sourceId: event.sourceId,
          title: event.title,
          subEventId: subEvent.id,
          subEventName: subEvent.name,
          fields: fieldChanges
        });
      }
      return apply ? { ...subEvent, ...counters } : subEvent;
    });
    if (eventChanged) {
      changedEvents.push({
        id: event._id,
        sourceId: event.sourceId,
        subEvents
      });
      if (apply) {
        event.subEvents = subEvents;
      }
    }
  }

  return {
    changedEvents,
    report: {
      scannedEvents: array(data.events).length,
      changedEvents: changedEvents.length,
      changedSubEvents,
      changedFields,
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
    throw new Error('Usage: node reconcile_sub_event_counters.cjs --seed-dir <dir> [--apply]');
  }
  const seedDir = path.resolve(args[seedIndex + 1]);
  const read = name => JSON.parse(fs.readFileSync(path.join(seedDir, `${name}.json`), 'utf8'));
  const data = {
    events: read('events'),
    activityMembers: read('activityMembers'),
    activityResources: read('activityResources'),
    assetRequests: read('assetRequests'),
    assets: read('assets')
  };
  const apply = args.includes('--apply');
  const result = reconcile(data, apply);
  if (apply) {
    fs.writeFileSync(path.join(seedDir, 'events.json'), `${JSON.stringify(data.events, null, 2)}\n`);
  }
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', ...result.report }, null, 2));
}

function runMongo() {
  const data = {
    events: db.events.find({}).toArray(),
    activityMembers: db.activityMembers.find({}).toArray(),
    activityResources: db.activityResources.find({}).toArray(),
    assetRequests: db.assetRequests.find({}).toArray(),
    assets: db.assets.find({}).toArray()
  };
  const apply = typeof process !== 'undefined'
    && process.env
    && process.env.SUB_EVENT_COUNTER_APPLY === 'true';
  const result = reconcile(data, apply);
  if (apply && result.changedEvents.length) {
    const operations = result.changedEvents.map(event => ({
      updateOne: {
        filter: { _id: event.id },
        update: { $set: { subEvents: event.subEvents } }
      }
    }));
    db.events.bulkWrite(operations, { ordered: false });
  }
  print(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', ...result.report }, null, 2));
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
  module.exports = { reconcile };
}
