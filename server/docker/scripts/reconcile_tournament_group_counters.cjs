/* eslint-disable no-console */
'use strict';

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

function isTournamentStage(subEvent) {
  return array(subEvent && subEvent.groups).length > 0
    || count(subEvent && subEvent.groupsCount) > 0
    || count(subEvent && subEvent.tournamentGroupCount) > 0
    || count(subEvent && subEvent.tournamentGroupCapacityMin) > 0
    || count(subEvent && subEvent.tournamentGroupCapacityMax) > 0
    || Boolean(text(subEvent && subEvent.tournamentLeaderboardType));
}

function groupMemberPending(activityMembers, eventId, subEventId) {
  const directOwnerPrefix = `${eventId}:${subEventId}:`;
  const slotOwnerPrefix = `${eventId}:slot:`;
  const slotStageMarker = `:${subEventId}:`;
  return array(activityMembers).filter(member => {
    const ownerId = text(member && member.ownerId);
    return ownerId.startsWith(directOwnerPrefix)
      || (ownerId.startsWith(slotOwnerPrefix) && ownerId.includes(slotStageMarker));
  }).length;
}

function groupResourcePending(stageRuntimes, eventId, subEventId) {
  const slotOwnerPrefix = `${eventId}:slot:`;
  return array(stageRuntimes)
    .filter(runtime =>
      text(runtime && runtime.subEventId) === subEventId
      && (
        text(runtime && runtime.ownerId) === eventId
        || text(runtime && runtime.ownerId).startsWith(slotOwnerPrefix)
      )
    )
    .reduce((runtimeTotal, runtime) =>
      runtimeTotal + Object.values(object(runtime.groupResourceMetricsByAssetOwnerId))
        .reduce((groupTotal, byAssetOwner) =>
          groupTotal + Object.values(object(byAssetOwner))
            .reduce((ownerTotal, byType) =>
              ownerTotal + Object.values(object(byType))
                .reduce((typeTotal, metric) => typeTotal + count(metric && metric.pending), 0),
            0),
          0),
      0);
}

function reconcile(data, apply) {
  const changedEvents = [];
  let changedSubEvents = 0;

  for (const event of array(data.events)) {
    const eventId = text(event && event.sourceId);
    if (!eventId) {
      continue;
    }
    let eventChanged = false;
    const subEvents = array(event.subEvents).map(subEvent => {
      if (!isTournamentStage(subEvent) || !text(subEvent && subEvent.id)) {
        return subEvent;
      }
      const groupsPending = groupMemberPending(data.activityMembers, eventId, text(subEvent.id))
        + groupResourcePending(data.activitySubEventStageRuntime, eventId, text(subEvent.id));
      if (
        Object.prototype.hasOwnProperty.call(subEvent, 'groupsPending')
        && count(subEvent.groupsPending) === groupsPending
      ) {
        return subEvent;
      }
      eventChanged = true;
      changedSubEvents += 1;
      return { ...subEvent, groupsPending };
    });
    const activity = subEvents.some(isTournamentStage)
      ? subEvents.reduce((total, subEvent) => total + count(subEvent && subEvent.groupsPending), 0)
      : count(event.activity);
    if (count(event.activity) !== activity) {
      eventChanged = true;
    }
    if (!eventChanged) {
      continue;
    }
    changedEvents.push({ id: event._id, sourceId: eventId, subEvents, activity });
    if (apply) {
      event.subEvents = subEvents;
      event.activity = activity;
    }
  }

  return {
    changedEvents,
    report: {
      scannedEvents: array(data.events).length,
      changedEvents: changedEvents.length,
      changedSubEvents
    }
  };
}

function runMongo() {
  const data = {
    events: db.events.find({}).toArray(),
    activityMembers: db.activityMembers.find({
      ownerType: 'group',
      status: 'pending'
    }).toArray(),
    activitySubEventStageRuntime: db.activitySubEventStageRuntime.find({
      status: { $ne: 'D' }
    }).toArray()
  };
  const apply = typeof process !== 'undefined'
    && process.env
    && process.env.TOURNAMENT_GROUP_COUNTER_APPLY === 'true';
  const result = reconcile(data, apply);
  if (apply && result.changedEvents.length) {
    db.events.bulkWrite(result.changedEvents.map(event => ({
      updateOne: {
        filter: { _id: event.id },
        update: {
          $set: {
            subEvents: event.subEvents,
            activity: event.activity
          }
        }
      }
    })), { ordered: false });
  }
  print(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', ...result.report }, null, 2));
}

if (typeof db !== 'undefined' && db && typeof db.getCollection === 'function') {
  runMongo();
}

if (typeof module !== 'undefined') {
  module.exports = { reconcile };
}
