import {
  APP_STATIC_DATA,
  AssetCardBuilder,
  AssetDefaultsBuilder
} from "./chunk-EWHSEKAB.js";
import {
  ActivityResourceBuilder,
  PricingBuilder
} from "./chunk-LM6UNLJK.js";
import {
  ActivityEventDetailDTO,
  EventFeedbackDetailDto,
  EventFeedbackPageResultDto
} from "./chunk-C6JV7CA3.js";
import {
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  isAssetType
} from "./chunk-N7OBXPJA.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/common/tournament-group-count.ts
function tournamentGroupCountForIncoming(input) {
  const groupCapacityMin = nonNegativeInteger(input.groupCapacityMin);
  const groupCapacityMax = Math.max(groupCapacityMin, nonNegativeInteger(input.groupCapacityMax));
  if (groupCapacityMin <= 0 && groupCapacityMax <= 0) {
    return 0;
  }
  const incomingCapacityMax = nonNegativeInteger(input.incomingCapacityMax);
  const stageCapacityMax = nonNegativeInteger(input.stageCapacityMax);
  const effectiveCapacityMax = incomingCapacityMax > 0 && stageCapacityMax > 0 ? Math.min(incomingCapacityMax, stageCapacityMax) : Math.max(incomingCapacityMax, stageCapacityMax);
  if (effectiveCapacityMax <= 0) {
    return 0;
  }
  const divisor = Math.max(1, groupCapacityMax > 0 ? groupCapacityMax : groupCapacityMin);
  const groupsNeededForMaximum = Math.ceil(effectiveCapacityMax / divisor);
  const groupsAllowedByMinimum = groupCapacityMin > 0 ? Math.max(1, Math.floor(effectiveCapacityMax / groupCapacityMin)) : groupsNeededForMaximum;
  return Math.min(groupsNeededForMaximum, groupsAllowedByMinimum);
}
function tournamentCurrentStageFromSubEvents(items) {
  const stages = (items ?? []).filter((item) => isTournamentStage(item));
  if (stages.length === 0) {
    return null;
  }
  let currentIndex = 0;
  while (currentIndex + 1 < stages.length && normalizeStageStatus(stages[currentIndex]?.stageStatus) === "F") {
    currentIndex += 1;
  }
  const stage = stages[currentIndex];
  return {
    id: `${stage?.id ?? ""}`.trim(),
    name: `${stage?.name ?? ""}`.trim(),
    stageNumber: currentIndex + 1,
    totalStages: stages.length,
    status: normalizeStageStatus(stage?.stageStatus)
  };
}
function tournamentParticipationLocked(stage) {
  return isTournamentStage(stage) && ["A", "SR", "F", "S"].includes(normalizeStageStatus(stage?.stageStatus));
}
function isTournamentStage(stage) {
  if (!stage || stage.optional === true) {
    return false;
  }
  const leaderboardType = `${stage.tournamentLeaderboardType ?? ""}`.trim().toLowerCase();
  return nonNegativeInteger(stage.tournamentGroupCapacityMin) > 0 || nonNegativeInteger(stage.tournamentGroupCapacityMax) > 0 || leaderboardType === "score" || leaderboardType === "fifa";
}
function normalizeStageStatus(value) {
  const status = `${value ?? ""}`.trim().toUpperCase();
  return status === "RS" || status === "SR" || status === "F" || status === "S" || status === "E" ? status : "A";
}
function nonNegativeInteger(value) {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

// src/app/shared/core/local/source/mappers/event.mapper.ts
var LocalActivityEventsMapper = class {
  static toDto(record) {
    return {
      id: record.id,
      userId: record.userId,
      type: record.type,
      status: record.status,
      statusBeforeSuppression: record.statusBeforeSuppression ?? null,
      trashedAtIso: record.trashedAtIso ?? null,
      adminIds: [...record.adminIds ?? []],
      title: record.title,
      subtitle: record.subtitle,
      timeframe: record.timeframe,
      inviter: record.inviter ?? null,
      activity: this.aggregateRuntimeActivity(record),
      creatorUserId: record.creatorUserId,
      creatorName: record.creatorName,
      creatorInitials: record.creatorInitials,
      creatorCity: record.creatorCity,
      organizerUserId: record.organizerUserId ?? record.creatorUserId,
      visibility: record.visibility,
      startAtIso: record.startAtIso,
      endAtIso: record.endAtIso,
      distanceKm: record.distanceKm,
      imageUrl: record.imageUrl,
      location: record.location,
      capacityTotal: record.capacityTotal,
      full: record.full === true,
      capacityMin: record.capacityMin,
      capacityMax: record.capacityMax,
      eventType: record.eventType,
      mode: ActivityEventDetailDTO.normalizeMode(record.mode),
      currentStage: record.currentStage ? __spreadValues({}, record.currentStage) : null,
      ticketing: record.ticketing === true,
      pricing: record.pricing ? PricingBuilder.clonePricingConfig(record.pricing) : record.pricing,
      policiesEnabled: record.policiesEnabled === true,
      policies: (record.policies ?? []).map((item) => __spreadValues({}, item)),
      slotsEnabled: record.slotsEnabled === true,
      slotTemplates: (record.slotTemplates ?? []).map((item) => __spreadProps(__spreadValues({}, item), {
        subEventDefinitions: (item.subEventDefinitions ?? []).map((definition) => __spreadProps(__spreadValues({}, definition), {
          pricing: definition.pricing ? PricingBuilder.clonePricingConfig(definition.pricing) : definition.pricing
        }))
      })),
      nextSlot: record.nextSlot ? __spreadValues({}, record.nextSlot) : null,
      upcomingSlots: (record.upcomingSlots ?? []).map((item) => __spreadValues({}, item)),
      subEventsEnabled: record.subEventsEnabled !== false,
      subEventDefinitions: (record.subEventDefinitions ?? []).map((item) => __spreadProps(__spreadValues({}, item), {
        pricing: item.pricing ? PricingBuilder.clonePricingConfig(item.pricing) : item.pricing
      })),
      subEvents: (record.subEvents ?? []).map((item) => __spreadProps(__spreadValues({}, item), {
        pricing: item.pricing ? PricingBuilder.clonePricingConfig(item.pricing) : item.pricing
      })),
      acceptedMembers: record.acceptedMembers,
      pendingMembers: record.pendingMembers,
      acceptedMemberUserIds: [...record.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...record.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...record.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...record.pendingRequestMemberUserIds ?? []],
      pendingReason: record.pendingReason,
      approvalRequired: record.approvalRequired === true,
      checkoutResultState: null,
      watched: record.watched === true,
      boost: record.boost
    };
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toDtoPage(page) {
    return {
      items: page.records.map((record) => this.toDto(record)),
      total: page.total,
      nextCursor: page.nextCursor
    };
  }
  static toSubEventsSlots(parentEventId, parentRecord, query) {
    const normalizedParentEventId = `${parentEventId ?? ""}`.trim();
    const direction = `${query?.order ?? ""}`.trim().toLowerCase() === "past" ? -1 : 1;
    const nowMs = Date.now();
    const sources = this.subEventsSlotSources(normalizedParentEventId, parentRecord, query).filter((source) => this.slotSourceMatchesOrder(source, query, nowMs)).filter((source) => this.slotSourceOverlapsRange(source, query)).sort((left, right) => direction * (this.dateMs(left.startAt) - this.dateMs(right.startAt)));
    const groupCountsBySource = this.stageGroupCountsBySource(sources, parentRecord.capacityMax);
    return sources.map((source) => this.toSubEventsSlot(source, parentRecord, groupCountsBySource.get(source) ?? /* @__PURE__ */ new Map()));
  }
  static toSubEventsSlot(source, parentRecord, groupCountsByStageId) {
    const generatedItems = source.definitions.length > 0 ? this.subEventItemsForSlot(source.startAt, source.definitions, groupCountsByStageId) : source.slotSourceId ? [this.slotMainEventItem(source, parentRecord)] : [];
    const storedItemsById = new Map((parentRecord.subEvents ?? []).map((item) => [`${item.id ?? ""}`.trim(), item]));
    const subEventItems = generatedItems.map((item) => this.withStoredSubEventCounters(item, storedItemsById.get(`${item.id ?? ""}`.trim())));
    return {
      id: source.id,
      parentEventId: source.parentEventId,
      slotSourceId: source.slotSourceId,
      slotTemplateId: source.slotTemplateId,
      title: source.title,
      timeframe: source.timeframe,
      startAt: source.startAt,
      endAt: source.endAt,
      subEventItems
    };
  }
  static subEventResourceLookups(slots, assetOwnerUserId) {
    return this.subEventStateLookups(slots, assetOwnerUserId).resourceLookups;
  }
  static subEventStateLookups(slots, assetOwnerUserId) {
    const normalizedAssetOwnerUserId = `${assetOwnerUserId ?? ""}`.trim();
    const resourceLookups = [];
    const stageRuntimeLookups = [];
    for (const slot of slots ?? []) {
      const ownerId = this.subEventResourceOwnerIdFromSlot(slot);
      if (!ownerId) {
        continue;
      }
      for (let index = 0; index < (slot.subEventItems ?? []).length; index += 1) {
        const item = slot.subEventItems[index];
        const subEventId = `${item.id ?? ""}`.trim() || this.fallbackSubEventId(index);
        if (!subEventId) {
          continue;
        }
        stageRuntimeLookups.push({ ownerId, subEventId });
        if (normalizedAssetOwnerUserId) {
          resourceLookups.push({ ownerId, subEventId, assetOwnerUserId: normalizedAssetOwnerUserId });
        }
      }
    }
    return {
      resourceLookups,
      stageRuntimeLookups
    };
  }
  static subEventResourceRecordKey(ref) {
    const ownerId = `${ref.ownerId ?? ""}`.trim();
    const subEventId = `${ref.subEventId ?? ""}`.trim();
    const assetOwnerUserId = `${ref.assetOwnerUserId ?? ""}`.trim();
    return ownerId && subEventId && assetOwnerUserId ? `${ownerId}:${subEventId}:${assetOwnerUserId}` : "";
  }
  static withSubEventResourceRecords(slots, resourcesByKey, assetOwnerUserId) {
    return this.withSubEventStates(slots, resourcesByKey, /* @__PURE__ */ new Map(), assetOwnerUserId);
  }
  static subEventStageRuntimeRecordKey(ref) {
    const ownerId = `${ref.ownerId ?? ""}`.trim();
    const subEventId = `${ref.subEventId ?? ""}`.trim();
    return ownerId && subEventId ? `${ownerId}:${subEventId}` : "";
  }
  static subEventResourceMetricKey(ownerIdValue, subEventIdValue, typeValue) {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    const type = `${typeValue ?? ""}`.trim();
    return ownerId && subEventId && type ? `${ownerId}:${subEventId}:${type}` : "";
  }
  static withSubEventStates(slots, resourcesByKey, stageRuntimeByKey, assetOwnerUserId, resourceMetricsByKey = /* @__PURE__ */ new Map()) {
    return slots.map((slot) => this.withSubEventStatesForSlot(slot, resourcesByKey, stageRuntimeByKey, assetOwnerUserId, resourceMetricsByKey));
  }
  static withSubEventStatesForSlot(slot, resourcesByKey, stageRuntimeByKey, assetOwnerUserId, resourceMetricsByKey) {
    const ownerId = this.subEventResourceOwnerIdFromSlot(slot);
    return __spreadProps(__spreadValues({}, slot), {
      subEventItems: (slot.subEventItems ?? []).map((item, index) => {
        const subEventId = `${item.id ?? ""}`.trim() || this.fallbackSubEventId(index);
        const resource = resourcesByKey.get(this.subEventResourceRecordKey({
          ownerId,
          subEventId,
          assetOwnerUserId
        })) ?? null;
        const stageRuntime = stageRuntimeByKey.get(this.subEventStageRuntimeRecordKey({
          ownerId,
          subEventId
        })) ?? null;
        return this.withSubEventStageRuntime(this.withSubEventResource(item, resource, resourceMetricsByKey), stageRuntime);
      })
    });
  }
  static subEventsSlotSources(parentEventId, parentRecord, query) {
    if (!parentRecord) {
      return [];
    }
    if (this.isGeneratedSlotRecord(parentRecord)) {
      return [this.recordSlotSource(parentEventId, parentRecord)];
    }
    const templates = parentRecord.slotsEnabled === true ? parentRecord.slotTemplates ?? [] : [];
    if (templates.length > 0) {
      return this.templateSlotSources(parentEventId, parentRecord, templates, query);
    }
    if (parentRecord.subEventsEnabled === false) {
      return [];
    }
    const definitions = ActivityEventDetailDTO.normalizeSubEventDefinitions(parentRecord.subEventDefinitions ?? []);
    return definitions.length > 0 ? [{
      id: `${parentEventId}:default`,
      parentEventId,
      slotSourceId: null,
      slotTemplateId: null,
      title: null,
      timeframe: null,
      startAt: `${parentRecord.startAtIso ?? ""}`.trim() || null,
      endAt: `${parentRecord.endAtIso ?? ""}`.trim() || null,
      definitions
    }] : [];
  }
  static recordSlotSource(parentEventId, record) {
    return {
      id: `${record.id ?? ""}`.trim() || `${parentEventId}:slot`,
      parentEventId,
      slotSourceId: `${record.id ?? ""}`.trim() || null,
      slotTemplateId: `${record.slotTemplateId ?? ""}`.trim() || null,
      title: `${record.title ?? ""}`.trim() || null,
      timeframe: `${record.timeframe ?? ""}`.trim() || null,
      startAt: `${record.startAtIso ?? ""}`.trim() || null,
      endAt: `${record.endAtIso ?? ""}`.trim() || null,
      definitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(record.subEventDefinitions ?? [])
    };
  }
  static templateSlotSources(parentEventId, parentRecord, templates, query) {
    const parentStart = AppUtils.parseDate(`${parentRecord.startAtIso ?? ""}`.trim());
    const parentEnd = AppUtils.parseDate(`${parentRecord.endAtIso ?? ""}`.trim());
    if (!parentStart || !parentEnd || parentEnd.getTime() < parentStart.getTime()) {
      return [];
    }
    const horizon = this.slotGenerationHorizon(parentStart, parentEnd, query);
    if (!horizon) {
      return [];
    }
    const sources = [];
    const overrideDates = new Set(templates.map((template) => this.slotOverrideDateKey(template.overrideDate)).filter((value) => Boolean(value)));
    for (const template of templates) {
      if (template.closed === true || this.slotOverrideDateKey(template.overrideDate)) {
        continue;
      }
      const templateStart = AppUtils.parseDate(`${template.startAt ?? ""}`.trim());
      if (!templateStart) {
        continue;
      }
      const definitions = this.slotTemplateSubEventDefinitions(parentRecord, template);
      const durationMs = this.slotDurationMinutes(parentRecord, definitions, templateStart) * 60 * 1e3;
      for (const startAt of this.generateSlotOccurrenceStarts(parentRecord.frequency ?? "One-time", templateStart, horizon.start, horizon.end)) {
        const occurrenceDateKey = this.slotOccurrenceAnchorDateKey(startAt, templateStart, parentStart);
        if (occurrenceDateKey && overrideDates.has(occurrenceDateKey)) {
          continue;
        }
        const endAt = new Date(startAt.getTime() + durationMs);
        if (startAt.getTime() < parentStart.getTime() || endAt.getTime() > parentEnd.getTime()) {
          continue;
        }
        sources.push(this.templateSlotSource(parentEventId, parentRecord, template, definitions, startAt, endAt));
      }
    }
    for (const template of templates) {
      if (template.closed === true || !this.slotOverrideDateKey(template.overrideDate)) {
        continue;
      }
      const startAt = AppUtils.parseDate(`${template.startAt ?? ""}`.trim());
      if (!startAt) {
        continue;
      }
      const definitions = this.slotTemplateSubEventDefinitions(parentRecord, template);
      const endAt = new Date(startAt.getTime() + this.slotDurationMinutes(parentRecord, definitions, startAt) * 60 * 1e3);
      if (startAt.getTime() < horizon.start.getTime() || startAt.getTime() > horizon.end.getTime()) {
        continue;
      }
      if (startAt.getTime() < parentStart.getTime() || endAt.getTime() > parentEnd.getTime()) {
        continue;
      }
      sources.push(this.templateSlotSource(parentEventId, parentRecord, template, definitions, startAt, endAt));
    }
    return sources;
  }
  static templateSlotSource(parentEventId, parentRecord, template, definitions, startAt, endAt) {
    const slotTemplateId = `${template.id ?? ""}`.trim();
    const sourceId = this.generatedSlotSourceId(parentEventId, slotTemplateId, startAt);
    return {
      id: sourceId,
      parentEventId,
      slotSourceId: sourceId,
      slotTemplateId,
      title: `${parentRecord.title ?? ""}`.trim() || null,
      timeframe: this.generatedSlotTimeframe(startAt, endAt),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      definitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(definitions)
    };
  }
  static slotTemplateSubEventDefinitions(parentRecord, template) {
    const overrideDefinitions = ActivityEventDetailDTO.normalizeSubEventDefinitions(template.subEventDefinitions ?? []);
    return overrideDefinitions.length > 0 ? overrideDefinitions : ActivityEventDetailDTO.normalizeSubEventDefinitions(parentRecord.subEventDefinitions ?? []);
  }
  static slotDurationMinutes(parentRecord, definitions, slotStart) {
    const definitionsDuration = this.subEventDefinitionsDurationMinutes(definitions);
    if (definitionsDuration > 0) {
      return definitionsDuration;
    }
    const parentStart = AppUtils.parseDate(`${parentRecord.startAtIso ?? ""}`.trim());
    const parentEnd = AppUtils.parseDate(`${parentRecord.endAtIso ?? ""}`.trim());
    if (!parentStart || !parentEnd || parentEnd.getTime() <= parentStart.getTime()) {
      return 0;
    }
    const frequency = ActivityEventDetailDTO.normalizeFrequency(parentRecord.frequency ?? "One-time");
    if (frequency === "One-time" || frequency === "Custom") {
      return Math.max(0, Math.trunc((parentEnd.getTime() - slotStart.getTime()) / (60 * 1e3)));
    }
    const parentStartMinutes = parentStart.getHours() * 60 + parentStart.getMinutes();
    const parentEndMinutes = parentEnd.getHours() * 60 + parentEnd.getMinutes();
    const duration = parentEndMinutes - parentStartMinutes;
    return duration > 0 ? duration : duration + 24 * 60;
  }
  static slotGenerationHorizon(parentStart, parentEnd, query) {
    const rangeStart = this.queryRangeStart(query);
    const rangeEnd = this.queryRangeEnd(query);
    const nowMs = Date.now();
    const dayMs = 24 * 60 * 60 * 1e3;
    const isPast = `${query?.order ?? ""}`.trim().toLowerCase() === "past";
    const defaultStart = new Date(nowMs - (isPast ? 45 : 1) * dayMs);
    const defaultEnd = new Date(nowMs + (isPast ? 1 : 45) * dayMs);
    const start = new Date(Math.max(parentStart.getTime(), (rangeStart ?? defaultStart).getTime()));
    const end = new Date(Math.min(parentEnd.getTime(), (rangeEnd ?? defaultEnd).getTime()));
    return end.getTime() < start.getTime() ? null : { start, end };
  }
  static slotSourceMatchesOrder(source, query, nowMs) {
    const start = this.dateMs(source.startAt);
    let end = this.dateMs(source.endAt);
    if (!Number.isFinite(end) || end <= 0) {
      end = start;
    }
    if (!Number.isFinite(end) || end <= 0) {
      return false;
    }
    const isPast = end < nowMs;
    return `${query?.order ?? ""}`.trim().toLowerCase() === "past" ? isPast : !isPast;
  }
  static slotSourceOverlapsRange(source, query) {
    const rangeStart = this.queryRangeStart(query);
    const rangeEnd = this.queryRangeEnd(query);
    if (!rangeStart && !rangeEnd) {
      return true;
    }
    const start = this.dateMs(source.startAt);
    let end = this.dateMs(source.endAt);
    if (!Number.isFinite(end) || end <= 0) {
      end = start;
    }
    if (rangeStart && end < rangeStart.getTime()) {
      return false;
    }
    if (rangeEnd && start > rangeEnd.getTime()) {
      return false;
    }
    return true;
  }
  static subEventDefinitionsDurationMinutes(definitions) {
    return this.subEventDefinitionTimeline(definitions).reduce((maxEnd, entry) => Math.max(maxEnd, entry.startOffsetMinutes + entry.durationMinutes), 0);
  }
  static generateSlotOccurrenceStarts(frequency, templateStart, horizonStart, horizonEnd) {
    const normalizedFrequency = `${frequency ?? ""}`.trim().toLowerCase();
    if (!normalizedFrequency || normalizedFrequency === "one-time" || normalizedFrequency === "custom") {
      return templateStart.getTime() >= horizonStart.getTime() && templateStart.getTime() <= horizonEnd.getTime() ? [new Date(templateStart)] : [];
    }
    const starts = [];
    const cursor = new Date(horizonStart);
    cursor.setHours(0, 0, 0, 0);
    const endDate = new Date(horizonEnd);
    endDate.setHours(0, 0, 0, 0);
    while (cursor.getTime() <= endDate.getTime()) {
      if (this.matchesSlotFrequency(cursor, templateStart, normalizedFrequency)) {
        const next = new Date(cursor);
        next.setHours(templateStart.getHours(), templateStart.getMinutes(), templateStart.getSeconds(), templateStart.getMilliseconds());
        if (next.getTime() >= horizonStart.getTime() && next.getTime() <= horizonEnd.getTime()) {
          starts.push(next);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return starts;
  }
  static matchesSlotFrequency(date, templateStart, frequency) {
    if (frequency === "daily") {
      return true;
    }
    if (frequency === "weekly") {
      return date.getDay() === templateStart.getDay();
    }
    if (frequency === "bi-weekly" || frequency === "biweekly") {
      if (date.getDay() !== templateStart.getDay()) {
        return false;
      }
      const diffDays = Math.floor((date.getTime() - AppUtils.dateOnly(templateStart).getTime()) / (24 * 60 * 60 * 1e3));
      const diffWeeks = Math.floor(diffDays / 7);
      return diffWeeks >= 0 && diffWeeks % 2 === 0;
    }
    if (frequency === "monthly") {
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return date.getDate() === Math.min(templateStart.getDate(), lastDayOfMonth);
    }
    if (frequency === "yearly" || frequency === "annual" || frequency === "annually") {
      if (date.getMonth() !== templateStart.getMonth()) {
        return false;
      }
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return date.getDate() === Math.min(templateStart.getDate(), lastDayOfMonth);
    }
    return false;
  }
  static generatedSlotSourceId(parentEventId, slotTemplateId, startAt) {
    return `${parentEventId}:slot:${slotTemplateId}:${startAt.toISOString()}`;
  }
  static generatedSlotTimeframe(startAt, endAt) {
    const dateLabel = startAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startLabel = startAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endLabel = endAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${dateLabel} \xB7 ${startLabel} - ${endLabel}`;
  }
  static queryRangeStart(query) {
    const value = `${query?.rangeStart ?? ""}`.trim();
    const parsed = AppUtils.parseDateOnly(value);
    return parsed ? AppUtils.dateOnly(parsed) : null;
  }
  static queryRangeEnd(query) {
    const value = `${query?.rangeEnd ?? ""}`.trim();
    const parsed = AppUtils.parseDateOnly(value);
    if (!parsed) {
      return null;
    }
    const end = AppUtils.dateOnly(parsed);
    end.setHours(23, 59, 59, 999);
    return end;
  }
  static slotOverrideDateKey(value) {
    const raw = `${value ?? ""}`.trim();
    if (!raw) {
      return null;
    }
    const parsed = AppUtils.parseDate(raw.includes("T") ? raw : `${raw}T00:00`);
    if (!parsed) {
      return null;
    }
    const year = parsed.getFullYear();
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsed.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  static slotOccurrenceAnchorDateKey(occurrenceStart, templateStart, parentStart) {
    const templateOffsetMs = templateStart.getTime() - parentStart.getTime();
    return this.slotOverrideDateKey(new Date(occurrenceStart.getTime() - templateOffsetMs).toISOString());
  }
  static dateMs(value) {
    return AppUtils.parseDate(value)?.getTime() ?? Number.POSITIVE_INFINITY;
  }
  static slotMainEventItem(source, parentRecord) {
    const slotSourceId = `${source.slotSourceId ?? ""}`.trim();
    const startAt = `${source.startAt ?? parentRecord.startAtIso ?? ""}`.trim();
    const endAt = `${source.endAt ?? parentRecord.endAtIso ?? startAt}`.trim() || startAt;
    const startMs = this.dateMs(startAt);
    const endMs = this.dateMs(endAt);
    const slotDurationMinutes = Number.isFinite(startMs) && Number.isFinite(endMs) ? Math.max(0, Math.trunc((endMs - startMs) / (60 * 1e3))) : 0;
    return {
      id: `main-event:${slotSourceId}`,
      runtimeKind: "MAIN_EVENT",
      eventId: source.parentEventId,
      name: `${parentRecord.title ?? source.title ?? ""}`.trim(),
      description: `${parentRecord.subtitle ?? ""}`.trim(),
      startAt,
      endAt,
      location: `${parentRecord.location ?? ""}`.trim(),
      createdByUserId: `${parentRecord.creatorUserId ?? ""}`.trim(),
      optional: false,
      pricing: parentRecord.pricing ? PricingBuilder.clonePricingConfig(parentRecord.pricing) : parentRecord.pricing,
      capacityMin: this.nonNegativeInteger(parentRecord.capacityMin),
      capacityMax: this.nonNegativeInteger(parentRecord.capacityMax),
      membersAccepted: this.nonNegativeInteger(parentRecord.acceptedMembers),
      membersPending: this.nonNegativeInteger(parentRecord.pendingMembers),
      carsPending: 0,
      accommodationPending: 0,
      suppliesPending: 0,
      carsAccepted: 0,
      accommodationAccepted: 0,
      suppliesAccepted: 0,
      slotStartOffsetMinutes: 0,
      slotDurationMinutes
    };
  }
  static subEventItemsForSlot(slotStartIso, definitions, groupCountsByStageId) {
    const slotStart = AppUtils.parseDate(`${slotStartIso ?? ""}`.trim()) ?? /* @__PURE__ */ new Date();
    return this.subEventDefinitionTimeline(definitions).map(({ item, startOffsetMinutes, durationMinutes }, index) => {
      const startAt = new Date(slotStart.getTime() + startOffsetMinutes * 60 * 1e3);
      const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1e3);
      const isTournamentStage2 = this.isTournamentStageDefinition(item);
      const stageStatus = isTournamentStage2 ? "RS" : void 0;
      const stageId = `${item.id ?? this.fallbackSubEventId(index)}`.trim() || this.fallbackSubEventId(index);
      return {
        id: stageId,
        name: `${item.name ?? `Sub Event ${index + 1}`}`.trim(),
        description: `${item.description ?? ""}`.trim(),
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        location: `${item.location ?? ""}`.trim(),
        tournamentGroupCapacityMin: item.tournamentGroupCapacityMin,
        tournamentGroupCapacityMax: item.tournamentGroupCapacityMax,
        tournamentLeaderboardType: item.tournamentLeaderboardType,
        tournamentAdvancePerGroup: item.tournamentAdvancePerGroup,
        optional: item.optional,
        pricing: item.pricing ? PricingBuilder.clonePricingConfig(item.pricing) : item.pricing,
        capacityMin: item.capacityMin,
        capacityMax: item.capacityMax,
        membersAccepted: 0,
        membersPending: 0,
        groupsCount: groupCountsByStageId.get(stageId),
        groupsPending: 0,
        carsPending: 0,
        accommodationPending: 0,
        suppliesPending: 0,
        slotStartOffsetMinutes: startOffsetMinutes,
        slotDurationMinutes: durationMinutes,
        stageStatus,
        stageStatusReason: stageStatus === "RS" ? "awaiting-tournament-start" : void 0
      };
    });
  }
  static subEventDefinitionTimeline(items) {
    let previousStartOffsetMinutes = 0;
    let previousEndOffsetMinutes = 0;
    let hasPrevious = false;
    return ActivityEventDetailDTO.normalizeSubEventDefinitions(items).map((item) => {
      const durationMinutes = Math.max(0, Math.trunc(Number(item.durationMinutes) || 0));
      const offsetMinutes = Math.max(0, Math.trunc(Number(item.offsetMinutes) || 0));
      const timing = ActivityEventDetailDTO.normalizeSubEventDefinitionTiming(item.timing);
      const startOffsetMinutes = !hasPrevious ? offsetMinutes : timing === "During" ? previousStartOffsetMinutes + offsetMinutes : previousEndOffsetMinutes + offsetMinutes;
      previousStartOffsetMinutes = startOffsetMinutes;
      previousEndOffsetMinutes = startOffsetMinutes + durationMinutes;
      hasPrevious = true;
      return { item, startOffsetMinutes, durationMinutes };
    });
  }
  static isTournamentStageDefinition(item) {
    return item.optional !== true && ((item.tournamentGroupCapacityMin ?? 0) > 0 || (item.tournamentGroupCapacityMax ?? 0) > 0 || item.tournamentLeaderboardType === "Score" || item.tournamentLeaderboardType === "Fifa");
  }
  static stageGroupCountsByStageId(definitions, eventCapacityMax) {
    const countsByStageId = /* @__PURE__ */ new Map();
    let incomingCapacityMax = this.nonNegativeInteger(eventCapacityMax);
    this.subEventDefinitionTimeline(definitions).forEach(({ item }, index) => {
      const stageId = `${item.id ?? this.fallbackSubEventId(index)}`.trim() || this.fallbackSubEventId(index);
      const groupCount = this.autoTournamentGroupCountForIncoming(item, incomingCapacityMax);
      countsByStageId.set(stageId, groupCount);
      if (!this.isTournamentStageDefinition(item)) {
        return;
      }
      const advancePerGroup = this.nonNegativeInteger(item.tournamentAdvancePerGroup);
      incomingCapacityMax = groupCount > 0 && advancePerGroup > 0 ? groupCount * advancePerGroup : 0;
    });
    return countsByStageId;
  }
  static stageGroupCountsBySource(sources, eventCapacityMax) {
    const countsBySource = /* @__PURE__ */ new Map();
    const countsByDefinitionsKey = /* @__PURE__ */ new Map();
    for (const source of sources) {
      const key = this.stageGroupCalculationKey(source.definitions, eventCapacityMax);
      let countsByStageId = countsByDefinitionsKey.get(key);
      if (!countsByStageId) {
        countsByStageId = this.stageGroupCountsByStageId(source.definitions, eventCapacityMax);
        countsByDefinitionsKey.set(key, countsByStageId);
      }
      countsBySource.set(source, countsByStageId);
    }
    return countsBySource;
  }
  static stageGroupCalculationKey(definitions, eventCapacityMax) {
    return [
      this.nonNegativeInteger(eventCapacityMax),
      ...ActivityEventDetailDTO.normalizeSubEventDefinitions(definitions).map((item, index) => [
        `${item.id ?? this.fallbackSubEventId(index)}`.trim() || this.fallbackSubEventId(index),
        item.optional === true ? "1" : "0",
        this.nonNegativeInteger(item.tournamentGroupCapacityMin),
        this.nonNegativeInteger(item.tournamentGroupCapacityMax),
        `${item.tournamentLeaderboardType ?? ""}`.trim(),
        this.nonNegativeInteger(item.tournamentAdvancePerGroup)
      ].join(":"))
    ].join("|");
  }
  static autoTournamentGroupCountForIncoming(item, incomingCapacityMax) {
    if (!this.isTournamentStageDefinition(item)) {
      return 0;
    }
    return tournamentGroupCountForIncoming({
      groupCapacityMin: item.tournamentGroupCapacityMin,
      groupCapacityMax: item.tournamentGroupCapacityMax,
      incomingCapacityMax,
      stageCapacityMax: item.capacityMax
    });
  }
  static withSubEventResource(item, resource, resourceMetricsByKey) {
    if (item.runtimeKind !== "MAIN_EVENT") {
      return item;
    }
    const car = this.resourceMetric(resource, ASSET_TYPE_TRANSPORT, {
      accepted: item.carsAccepted,
      pending: item.carsPending,
      capacityMin: item.carsCapacityMin,
      capacityMax: item.carsCapacityMax
    }, resourceMetricsByKey);
    const accommodation = this.resourceMetric(resource, ASSET_TYPE_ACCOMMODATION, {
      accepted: item.accommodationAccepted,
      pending: item.accommodationPending,
      capacityMin: item.accommodationCapacityMin,
      capacityMax: item.accommodationCapacityMax
    }, resourceMetricsByKey);
    const supplies = this.resourceMetric(resource, ASSET_TYPE_SUPPLIES, {
      accepted: item.suppliesAccepted,
      pending: item.suppliesPending,
      capacityMin: item.suppliesCapacityMin,
      capacityMax: item.suppliesCapacityMax
    }, resourceMetricsByKey);
    return __spreadProps(__spreadValues({}, item), {
      carsAccepted: car.accepted,
      carsPending: car.pending,
      carsCapacityMin: car.capacityMin,
      carsCapacityMax: car.capacityMax,
      accommodationAccepted: accommodation.accepted,
      accommodationPending: accommodation.pending,
      accommodationCapacityMin: accommodation.capacityMin,
      accommodationCapacityMax: accommodation.capacityMax,
      suppliesAccepted: supplies.accepted,
      suppliesPending: supplies.pending,
      suppliesCapacityMin: supplies.capacityMin,
      suppliesCapacityMax: supplies.capacityMax
    });
  }
  static withSubEventStageRuntime(item, stageRuntime) {
    if (!stageRuntime) {
      return item;
    }
    return __spreadProps(__spreadValues({}, item), {
      stageStatus: `${stageRuntime.stageStatus ?? ""}`.trim() || item.stageStatus,
      stageStatusReason: `${stageRuntime.stageStatusReason ?? ""}`.trim() || item.stageStatusReason,
      stageStatusUpdatedAt: `${stageRuntime.stageStatusUpdatedAt ?? ""}`.trim() || item.stageStatusUpdatedAt,
      stageFinalizedAt: `${stageRuntime.stageFinalizedAt ?? ""}`.trim() || item.stageFinalizedAt,
      stageFinalizedByUserId: `${stageRuntime.stageFinalizedByUserId ?? ""}`.trim() || item.stageFinalizedByUserId,
      stageResultRevision: stageRuntime.stageResultRevision ?? item.stageResultRevision,
      groupsCount: stageRuntime.groupsCount ?? item.groupsCount,
      groupsPending: Math.max(0, Math.trunc(Number(item.groupsPending) || 0))
    });
  }
  static resourceMetric(resource, type, fallback, resourceMetricsByKey) {
    if (!resource) {
      return {
        accepted: this.nonNegativeInteger(fallback.accepted),
        pending: this.nonNegativeInteger(fallback.pending),
        capacityMin: this.nonNegativeInteger(fallback.capacityMin),
        capacityMax: this.nonNegativeInteger(fallback.capacityMax)
      };
    }
    const settingsById = resource.assetSettingsByType[type] ?? {};
    const assignedIds = resource.assetAssignmentIds[type] ?? [];
    const assetIds = this.normalizedAssetIds(assignedIds.length > 0 ? assignedIds : Object.keys(settingsById));
    const capacityMin = assetIds.reduce((sum, assetId) => sum + this.nonNegativeInteger(settingsById[assetId]?.capacityMin), 0);
    const capacityMax = assetIds.reduce((sum, assetId) => sum + this.nonNegativeInteger(settingsById[assetId]?.capacityMax), 0);
    const accepted = type === ASSET_TYPE_SUPPLIES ? assetIds.reduce((sum, assetId) => sum + (resource.supplyContributionEntriesByAssetId[assetId] ?? []).reduce((entrySum, entry) => entrySum + this.nonNegativeInteger(entry.quantity), 0), 0) : assetIds.length;
    const pending = 0;
    const metric = resourceMetricsByKey.get(this.subEventResourceMetricKey(resource.ownerId, resource.subEventId, type));
    return {
      accepted: metric ? this.nonNegativeInteger(metric.accepted) : accepted,
      pending: metric ? this.nonNegativeInteger(metric.pending) : pending,
      capacityMin,
      capacityMax
    };
  }
  static withStoredSubEventCounters(item, stored) {
    if (!stored) {
      return item;
    }
    return __spreadProps(__spreadValues({}, item), {
      membersAccepted: this.nonNegativeInteger(stored.membersAccepted),
      membersPending: this.nonNegativeInteger(stored.membersPending),
      carsAccepted: this.nonNegativeInteger(stored.carsAccepted),
      carsPending: this.nonNegativeInteger(stored.carsPending),
      carsCapacityMin: this.nonNegativeInteger(stored.carsCapacityMin),
      carsCapacityMax: this.nonNegativeInteger(stored.carsCapacityMax),
      accommodationAccepted: this.nonNegativeInteger(stored.accommodationAccepted),
      accommodationPending: this.nonNegativeInteger(stored.accommodationPending),
      accommodationCapacityMin: this.nonNegativeInteger(stored.accommodationCapacityMin),
      accommodationCapacityMax: this.nonNegativeInteger(stored.accommodationCapacityMax),
      suppliesAccepted: this.nonNegativeInteger(stored.suppliesAccepted),
      suppliesPending: this.nonNegativeInteger(stored.suppliesPending),
      suppliesCapacityMin: this.nonNegativeInteger(stored.suppliesCapacityMin),
      suppliesCapacityMax: this.nonNegativeInteger(stored.suppliesCapacityMax),
      groupsPending: this.nonNegativeInteger(stored.groupsPending)
    });
  }
  static normalizedAssetIds(source) {
    const ids = /* @__PURE__ */ new Set();
    source.forEach((item) => {
      const assetId = `${item ?? ""}`.trim();
      if (assetId) {
        ids.add(assetId);
      }
    });
    return [...ids];
  }
  static subEventResourceOwnerIdFromSlot(slot) {
    return `${slot.slotSourceId ?? ""}`.trim() || `${slot.parentEventId ?? ""}`.trim() || `${slot.id ?? ""}`.trim();
  }
  static fallbackSubEventId(index) {
    return `subevent-${index + 1}`;
  }
  static isGeneratedSlotRecord(record) {
    return record?.generated === true || record?.eventType === "slot" || Boolean(record?.parentEventId);
  }
  static aggregateRuntimeActivity(record) {
    const mode = ActivityEventDetailDTO.normalizeMode(record.mode);
    const subEventPending = (record.subEvents ?? []).reduce((total, item) => {
      if (mode === "Tournament") {
        return total + this.nonNegativeInteger(item.groupsPending);
      }
      return total + (item.optional === true ? this.nonNegativeInteger(item.membersPending) : 0) + this.nonNegativeInteger(item.carsPending) + this.nonNegativeInteger(item.accommodationPending) + this.nonNegativeInteger(item.suppliesPending);
    }, 0);
    return Math.max(this.nonNegativeInteger(record.activity), subEventPending);
  }
  static nonNegativeInteger(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.max(0, Math.trunc(parsed));
  }
};
var LocalActivityEventDetailsMapper = class {
  static toRecord(payload) {
    const id = payload.id.trim();
    const creatorUserId = payload.creatorUserId.trim() || payload.userId.trim();
    const adminIds = this.uniqueUserIds([
      ...payload.adminIds ?? [],
      creatorUserId
    ]);
    const creatorName = payload.creatorName.trim() || "Unknown Host";
    const creatorInitials = payload.creatorInitials.trim() || AppUtils.initialsFromText(creatorName);
    const startAtIso = payload.startAtIso.trim() || (/* @__PURE__ */ new Date()).toISOString();
    const endAtIso = payload.endAtIso.trim() || new Date(new Date(startAtIso).getTime() + 2 * 60 * 60 * 1e3).toISOString();
    const title = payload.title.trim() || "Untitled draft event";
    const subtitle = payload.subtitle.trim() || "Draft event in progress";
    const type = this.normalizeRepositoryItemType(payload.type);
    const visibility = this.normalizeVisibility(payload.visibility);
    const blindMode = this.normalizeBlindMode(payload.blindMode);
    const requestedFrequency = this.normalizeFrequency(payload.frequency);
    const normalizedSlotTemplates = this.normalizeSlotTemplates(payload.slotTemplates);
    const hasSlots = payload.slotsEnabled === true && normalizedSlotTemplates.length > 0;
    const frequency = hasSlots ? requestedFrequency : "One-time";
    const topics = this.normalizeTopics(payload.topics);
    const slotTemplates = hasSlots ? normalizedSlotTemplates : [];
    const subEventDefinitions = ActivityEventDetailDTO.normalizeSubEventDefinitions(payload.subEventDefinitions);
    const subEventsEnabled = payload.subEventsEnabled !== false && subEventDefinitions.length > 0;
    const subEvents = this.normalizeSubEvents(payload.subEvents);
    const policiesEnabled = payload.policiesEnabled === true;
    const policies = this.normalizePolicies(payload.policies);
    const slotCatalog = PricingBuilder.slotCatalogFromEventSlotTemplates(slotTemplates);
    const ticketing = payload.ticketing === true;
    const approvalRequired = payload.approvalRequired === true;
    const pricing = PricingBuilder.syncSlotOverrides(PricingBuilder.normalizePricingConfig(payload.pricing, {
      context: "event",
      slotCatalog
    }), slotCatalog);
    const acceptedMembers = this.nonNegativeInteger(payload.acceptedMembers);
    const pendingMembers = this.nonNegativeInteger(payload.pendingMembers);
    const capacityTotal = Math.max(acceptedMembers, this.normalizeCount(payload.capacityTotal) ?? this.normalizeCount(payload.capacityMax) ?? acceptedMembers);
    const rating = this.nonNegativeInteger(payload.rating) || 6 + AppUtils.hashText(`${id}:${title}`) % 35 / 10;
    const boost = this.nonNegativeInteger(payload.boost) || 50 + AppUtils.hashText(`${id}:${title}`) % 51;
    const affinity = this.nonNegativeInteger(payload.affinity) || this.resolveEventAffinity({
      id,
      title,
      subtitle,
      topics,
      visibility,
      blindMode,
      rating,
      acceptedMembers,
      capacityTotal
    });
    return {
      id,
      userId: payload.userId.trim() || creatorUserId,
      type,
      status: this.normalizeEventStatus(payload.status),
      statusBeforeSuppression: payload.statusBeforeSuppression ?? null,
      adminIds,
      avatar: payload.avatar.trim() || creatorInitials,
      title,
      subtitle,
      timeframe: payload.timeframe.trim() || this.buildTimeframeLabel(startAtIso, endAtIso, frequency),
      inviter: payload.inviter ?? null,
      unread: this.nonNegativeInteger(payload.unread),
      activity: this.nonNegativeInteger(payload.activity),
      trashedAtIso: payload.trashedAtIso ?? null,
      creatorUserId,
      creatorName,
      creatorInitials,
      creatorGender: payload.creatorGender ?? "man",
      creatorCity: payload.creatorCity,
      visibility,
      blindMode,
      startAtIso,
      endAtIso,
      distanceKm: Math.max(0, Number(payload.distanceKm) || 0),
      imageUrl: payload.imageUrl.trim(),
      sourceLink: payload.sourceLink.trim(),
      location: this.normalizeLocation(payload.location),
      locationCoordinates: this.normalizeLocationCoordinates(payload.locationCoordinates),
      capacityMin: this.normalizeCount(payload.capacityMin) ?? 0,
      capacityMax: this.normalizeCount(payload.capacityMax) ?? capacityTotal,
      capacityTotal,
      full: payload.full === true || capacityTotal > 0 && acceptedMembers >= capacityTotal,
      autoInviter: payload.autoInviter === true,
      frequency,
      ticketing,
      approvalRequired,
      pricing,
      policiesEnabled,
      policies,
      slotsEnabled: hasSlots,
      slotTemplates,
      parentEventId: payload.parentEventId ?? null,
      slotTemplateId: payload.slotTemplateId ?? null,
      generated: payload.generated === true,
      eventType: payload.eventType ?? "main",
      nextSlot: payload.nextSlot ? __spreadValues({}, payload.nextSlot) : null,
      upcomingSlots: payload.upcomingSlots.map((item) => __spreadValues({}, item)),
      checkoutBasket: ActivityEventDetailDTO.cloneCheckoutBasket(payload.checkoutBasket),
      acceptedMembers,
      pendingMembers,
      acceptedMemberUserIds: [...payload.acceptedMemberUserIds],
      pendingMemberUserIds: [...payload.pendingMemberUserIds],
      invitedMemberUserIds: [...payload.invitedMemberUserIds],
      pendingRequestMemberUserIds: [...payload.pendingRequestMemberUserIds],
      pendingReason: payload.pendingReason,
      topics,
      subEventsEnabled,
      subEventDefinitions,
      subEvents,
      mode: this.normalizeEventMode(payload.mode ?? this.inferredEventMode(subEvents)),
      currentStage: tournamentCurrentStageFromSubEvents(subEvents),
      rating,
      boost,
      affinity
    };
  }
  static toDto(record) {
    return new ActivityEventDetailDTO().apply({
      id: record.id,
      userId: record.userId,
      type: record.type,
      status: record.status,
      statusBeforeSuppression: "statusBeforeSuppression" in record ? record.statusBeforeSuppression ?? null : void 0,
      adminIds: [...record.adminIds ?? []],
      avatar: record.avatar,
      title: record.title,
      subtitle: record.subtitle,
      timeframe: record.timeframe,
      inviter: record.inviter ?? null,
      unread: record.unread,
      activity: this.aggregateRuntimeActivity(record),
      trashedAtIso: "trashedAtIso" in record ? record.trashedAtIso ?? null : void 0,
      creatorUserId: record.creatorUserId,
      creatorName: record.creatorName,
      creatorInitials: record.creatorInitials,
      creatorGender: "creatorGender" in record ? record.creatorGender : void 0,
      creatorCity: record.creatorCity,
      visibility: record.visibility,
      blindMode: record.blindMode ?? "Open Event",
      startAtIso: record.startAtIso,
      endAtIso: record.endAtIso,
      distanceKm: record.distanceKm,
      imageUrl: record.imageUrl,
      sourceLink: record.sourceLink ?? "",
      location: record.location,
      locationCoordinates: this.cloneLocationCoordinates(record.locationCoordinates),
      capacityMin: record.capacityMin,
      capacityMax: record.capacityMax,
      capacityTotal: record.capacityTotal,
      full: record.full === true,
      autoInviter: record.autoInviter ?? false,
      frequency: record.frequency ?? "One-time",
      ticketing: record.ticketing,
      approvalRequired: record.approvalRequired === true,
      pricing: record.pricing ?? null,
      policiesEnabled: record.policiesEnabled === true,
      policies: record.policies ?? [],
      slotsEnabled: record.slotsEnabled === true,
      slotTemplates: record.slotTemplates ?? [],
      parentEventId: record.parentEventId ?? null,
      slotTemplateId: record.slotTemplateId ?? null,
      generated: record.generated === true,
      eventType: record.eventType ?? "main",
      nextSlot: record.nextSlot ? __spreadValues({}, record.nextSlot) : null,
      upcomingSlots: (record.upcomingSlots ?? []).map((item) => __spreadValues({}, item)),
      checkoutBasket: ActivityEventDetailDTO.cloneCheckoutBasket(record.checkoutBasket),
      acceptedMembers: record.acceptedMembers,
      pendingMembers: record.pendingMembers,
      acceptedMemberUserIds: [...record.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...record.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...record.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...record.pendingRequestMemberUserIds ?? []],
      pendingReason: record.pendingReason,
      topics: [...record.topics ?? []],
      subEventsEnabled: record.subEventsEnabled !== false,
      subEventDefinitions: record.subEventDefinitions ?? [],
      subEvents: record.subEvents ?? [],
      mode: this.normalizeEventMode(record.mode),
      currentStage: record.currentStage ? __spreadValues({}, record.currentStage) : null,
      rating: record.rating,
      boost: record.boost,
      affinity: record.affinity,
      paymentSessionId: null
    });
  }
  static inferredEventMode(items) {
    if (items.some((item) => !item.optional && ((item.tournamentGroupCapacityMin ?? 0) > 0 || (item.tournamentGroupCapacityMax ?? 0) > 0 || item.tournamentLeaderboardType === "Score" || item.tournamentLeaderboardType === "Fifa"))) {
      return "Tournament";
    }
    return "Casual";
  }
  static normalizeEventMode(value) {
    return `${value ?? ""}`.trim().toLowerCase() === "tournament" ? "Tournament" : "Casual";
  }
  static resolveEventAffinity(options) {
    const tokens = this.uniqueAffinityTokens([
      options.title,
      options.subtitle ?? "",
      ...options.topics,
      options.visibility,
      options.blindMode
    ]);
    return this.resolveAffinityTokenScore(tokens, `event:${options.id}`) * 89 + Math.round(AppUtils.clampNumber(Number(options.rating) || 0, 0, 10) * 100) * 29 + Math.max(0, Math.trunc(Number(options.acceptedMembers) || 0)) * 19 + Math.max(0, Math.trunc(Number(options.capacityTotal) || 0)) * 7;
  }
  static uniqueAffinityTokens(values) {
    const seen = /* @__PURE__ */ new Set();
    for (const value of values) {
      const normalized = AppUtils.normalizeText(`${value ?? ""}`.replace(/^#+\s*/, "").trim());
      if (normalized) {
        seen.add(normalized);
      }
    }
    return [...seen];
  }
  static resolveAffinityTokenScore(tokens, seedPrefix) {
    return tokens.reduce((total, token) => total + (AppUtils.hashText(`${seedPrefix}:${token}`) % 997 + 1), 0);
  }
  static cloneLocationCoordinates(value) {
    if (!value || !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) {
      return null;
    }
    return {
      latitude: value.latitude,
      longitude: value.longitude
    };
  }
  static normalizeEventStatus(status) {
    const normalized = `${status ?? ""}`.trim();
    switch (normalized) {
      case "A":
      case "DR":
      case "T":
      case "UR":
      case "B":
      case "D":
      case "I":
        return normalized;
      default:
        return "A";
    }
  }
  static normalizeTopics(topics) {
    return Array.from(new Set(topics.map((topic) => `${topic ?? ""}`.trim().replace(/^#+/, "")).filter((topic) => topic.length > 0).slice(0, 5)));
  }
  static normalizeRepositoryItemType(value) {
    return value === "hosting" || value === "invitations" ? value : "events";
  }
  static normalizeVisibility(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (normalized === "private" || normalized.includes("friend")) {
      return "Friends only";
    }
    if (normalized.includes("invitation")) {
      return "Invitation only";
    }
    return "Public";
  }
  static normalizeBlindMode(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    return normalized.includes("blind") ? "Blind Event" : "Open Event";
  }
  static normalizeFrequency(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (normalized === "custom") {
      return "Custom";
    }
    if (normalized === "daily") {
      return "Daily";
    }
    if (normalized === "weekly") {
      return "Weekly";
    }
    if (normalized.includes("bi-week") || normalized.includes("bi week")) {
      return "Bi-weekly";
    }
    if (normalized === "monthly") {
      return "Monthly";
    }
    if (normalized === "yearly" || normalized === "annual" || normalized === "annually") {
      return "Yearly";
    }
    return "One-time";
  }
  static buildTimeframeLabel(startAt, endAt, frequency) {
    const start = this.parseDate(startAt);
    const end = this.parseDate(endAt);
    if (!start || !end) {
      return startAt || endAt || "";
    }
    const dateLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const normalizedFrequency = this.normalizeFrequency(frequency);
    if (normalizedFrequency === "One-time") {
      return `${dateLabel} \xB7 ${startTime} - ${endTime}`;
    }
    return `${normalizedFrequency} \xB7 ${dateLabel} \xB7 ${startTime} - ${endTime}`;
  }
  static normalizePolicies(items) {
    return items.map((item, index) => ({
      id: `${item.id ?? `policy-${index + 1}`}`.trim() || `policy-${index + 1}`,
      title: `${item.title ?? ""}`.trim() || `Policy ${index + 1}`,
      description: `${item.description ?? ""}`.trim(),
      required: item.required !== false
    })).filter((item) => item.id || item.title || item.description);
  }
  static normalizeSlotTemplates(items) {
    return items.map((item, index) => {
      if (item.closed === true) {
        return {
          id: `${item.id ?? `slot-${index + 1}`}`.trim() || `slot-${index + 1}`,
          startAt: "",
          overrideDate: this.normalizeSlotOverrideDate(item.overrideDate),
          closed: true,
          subEventDefinitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(item.subEventDefinitions ?? [])
        };
      }
      const normalizedStart = `${item.startAt ?? ""}`.trim();
      const parsedStart = this.parseDate(normalizedStart) ?? /* @__PURE__ */ new Date();
      return {
        id: `${item.id ?? `slot-${index + 1}`}`.trim() || `slot-${index + 1}`,
        startAt: this.parseDate(normalizedStart) ? normalizedStart : this.toIsoDateTimeLocal(parsedStart),
        overrideDate: this.normalizeSlotOverrideDate(item.overrideDate),
        closed: false,
        subEventDefinitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(item.subEventDefinitions ?? [])
      };
    });
  }
  static normalizeSubEvents(items) {
    return items.map((item, index) => {
      const capacityMin = this.nonNegativeInteger(item.capacityMin);
      const capacityMax = Math.max(capacityMin, this.nonNegativeInteger(item.capacityMax));
      return {
        id: `${item.id ?? `subevent-${index + 1}`}`.trim() || `subevent-${index + 1}`,
        name: `${item.name ?? `Sub Event ${index + 1}`}`.trim(),
        description: `${item.description ?? ""}`.trim(),
        startAt: `${item.startAt ?? ""}`.trim(),
        endAt: `${item.endAt ?? ""}`.trim(),
        location: this.normalizeLocation(item.location),
        createdByUserId: item.createdByUserId?.trim() || void 0,
        optional: item.optional === true,
        pricing: this.clonePricingConfig(item.pricing),
        capacityMin,
        capacityMax,
        tournamentGroupCapacityMin: this.optionalNonNegativeInteger(item.tournamentGroupCapacityMin),
        tournamentGroupCapacityMax: this.optionalNonNegativeInteger(item.tournamentGroupCapacityMax),
        tournamentLeaderboardType: item.tournamentLeaderboardType === "Fifa" ? "Fifa" : "Score",
        tournamentAdvancePerGroup: this.optionalNonNegativeInteger(item.tournamentAdvancePerGroup),
        groupsCount: this.optionalNonNegativeInteger(item.groupsCount),
        groupsPending: this.optionalNonNegativeInteger(item.groupsPending),
        membersAccepted: this.nonNegativeInteger(item.membersAccepted),
        membersPending: this.nonNegativeInteger(item.membersPending),
        carsPending: this.nonNegativeInteger(item.carsPending),
        accommodationPending: this.nonNegativeInteger(item.accommodationPending),
        suppliesPending: this.nonNegativeInteger(item.suppliesPending),
        carsAccepted: this.optionalNonNegativeInteger(item.carsAccepted),
        accommodationAccepted: this.optionalNonNegativeInteger(item.accommodationAccepted),
        suppliesAccepted: this.optionalNonNegativeInteger(item.suppliesAccepted),
        carsCapacityMin: this.optionalNonNegativeInteger(item.carsCapacityMin),
        carsCapacityMax: this.optionalNonNegativeInteger(item.carsCapacityMax),
        accommodationCapacityMin: this.optionalNonNegativeInteger(item.accommodationCapacityMin),
        accommodationCapacityMax: this.optionalNonNegativeInteger(item.accommodationCapacityMax),
        suppliesCapacityMin: this.optionalNonNegativeInteger(item.suppliesCapacityMin),
        suppliesCapacityMax: this.optionalNonNegativeInteger(item.suppliesCapacityMax),
        slotStartOffsetMinutes: this.optionalNonNegativeInteger(item.slotStartOffsetMinutes),
        slotDurationMinutes: this.optionalNonNegativeInteger(item.slotDurationMinutes),
        stageStatus: `${item.stageStatus ?? ""}`.trim() || void 0,
        stageStatusReason: `${item.stageStatusReason ?? ""}`.trim() || void 0,
        stageStatusUpdatedAt: `${item.stageStatusUpdatedAt ?? ""}`.trim() || void 0,
        stageFinalizedAt: `${item.stageFinalizedAt ?? ""}`.trim() || void 0,
        stageFinalizedByUserId: `${item.stageFinalizedByUserId ?? ""}`.trim() || void 0,
        stageResultRevision: this.optionalNonNegativeInteger(item.stageResultRevision)
      };
    });
  }
  static clonePricingConfig(value) {
    if (!value) {
      return null;
    }
    return __spreadProps(__spreadValues({}, value), {
      demandRules: (value.demandRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), { action: __spreadValues({}, rule.action), slotIds: [...rule.slotIds ?? []] })),
      timeRules: (value.timeRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), { action: __spreadValues({}, rule.action), slotIds: [...rule.slotIds ?? []] })),
      cancellationPolicy: __spreadProps(__spreadValues({}, value.cancellationPolicy), {
        rules: (value.cancellationPolicy?.rules ?? []).map((rule) => __spreadValues({}, rule))
      }),
      slotOverrides: (value.slotOverrides ?? []).map((slot) => __spreadValues({}, slot)),
      audience: __spreadProps(__spreadValues({}, value.audience), {
        promoCodes: (value.audience?.promoCodes ?? []).map((code) => __spreadProps(__spreadValues({}, code), { action: __spreadValues({}, code.action) }))
      })
    });
  }
  static normalizeLocation(value) {
    return `${value ?? ""}`.trim();
  }
  static normalizeSlotOverrideDate(value) {
    const parsed = this.parseDateOnly(value);
    return parsed ? this.toIsoDate(parsed) : null;
  }
  static normalizeCount(value) {
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
  static nonNegativeInteger(value) {
    return this.normalizeCount(value) ?? 0;
  }
  static aggregateRuntimeActivity(record) {
    const mode = ActivityEventDetailDTO.normalizeMode(record.mode);
    const subEventPending = (record.subEvents ?? []).reduce((total, item) => {
      if (mode === "Tournament") {
        return total + this.nonNegativeInteger(item.groupsPending);
      }
      return total + (item.optional === true ? this.nonNegativeInteger(item.membersPending) : 0) + this.nonNegativeInteger(item.carsPending) + this.nonNegativeInteger(item.accommodationPending) + this.nonNegativeInteger(item.suppliesPending);
    }, 0);
    return Math.max(this.nonNegativeInteger(record.activity), subEventPending);
  }
  static uniqueUserIds(userIds) {
    const unique = [];
    for (const userId of userIds) {
      const normalizedUserId = `${userId ?? ""}`.trim();
      if (!normalizedUserId || unique.includes(normalizedUserId)) {
        continue;
      }
      unique.push(normalizedUserId);
    }
    return unique;
  }
  static optionalNonNegativeInteger(value) {
    return this.normalizeCount(value) ?? void 0;
  }
  static normalizeLocationCoordinates(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const latitude = Number(value.latitude);
    const longitude = Number(value.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    return {
      latitude,
      longitude
    };
  }
  static parseDate(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value);
    }
    if (typeof value !== "string" || !value.trim()) {
      return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  static parseDateOnly(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }
    if (typeof value !== "string" || !value.trim()) {
      return null;
    }
    const dateOnlyMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      const parsed2 = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(parsed2.getTime()) ? null : parsed2;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }
  static toIsoDateTimeLocal(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    const hours = `${value.getHours()}`.padStart(2, "0");
    const minutes = `${value.getMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  static toIsoDate(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

// src/app/shared/core/local/source/mappers/user.mapper.ts
var LocalUsersMapper = class {
  static toDto(record) {
    const _a = record, { devices: _devices } = _a, profile = __objRest(_a, ["devices"]);
    return this.cloneUser(__spreadProps(__spreadValues({}, profile), { notificationDevices: (_devices ?? []).map((device) => ({
      deviceId: device.deviceId,
      notificationsEnabled: device.notificationsEnabled === true
    })) }));
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toSelectorListItem(record) {
    return {
      id: record.id,
      name: record.name,
      city: record.city,
      initials: record.initials,
      avatarUrl: (record.images ?? []).find((imageUrl) => `${imageUrl ?? ""}`.trim())?.replace(/\/large\.webp$/, "/small.webp") ?? "",
      gender: record.gender,
      statusText: record.statusText,
      completion: record.completion,
      profileFormVersion: record.profileFormVersion,
      status: record.status,
      deletedAtIso: record.deletedAtIso ?? null
    };
  }
  static toSelectorListItemList(records) {
    return records.map((record) => this.toSelectorListItem(record));
  }
  static toRecord(dto) {
    const _a = this.cloneUser(dto), { notificationDevices: _notificationDevices } = _a, profile = __objRest(_a, ["notificationDevices"]);
    const record = profile;
    record.images = this.normalizeImages(record.images);
    record.affinity = this.resolveUserAffinity(record);
    return record;
  }
  static toRecordList(dtos) {
    return dtos.map((dto) => this.toRecord(dto));
  }
  static cloneRecord(record) {
    return this.toRecord(this.toDto(record));
  }
  static cloneUser(user) {
    return __spreadProps(__spreadValues({}, user), {
      locationCoordinates: user.locationCoordinates ? {
        latitude: user.locationCoordinates.latitude,
        longitude: user.locationCoordinates.longitude
      } : void 0,
      languages: [...user.languages ?? []],
      images: [...user.images ?? []],
      profileDetails: user.profileDetails ? user.profileDetails.map((group) => ({
        title: `${group.title ?? ""}`,
        rows: (group.rows ?? []).map((row) => ({
          labelKey: `${row.labelKey ?? ""}`,
          value: `${row.value ?? ""}`,
          privacy: row.privacy,
          options: [...row.options ?? []]
        }))
      })) : void 0,
      impressions: user.impressions ? {
        host: user.impressions.host ? __spreadProps(__spreadValues({}, user.impressions.host), {
          vibeBadges: [...user.impressions.host.vibeBadges ?? []],
          personalityBadges: [...user.impressions.host.personalityBadges ?? []],
          personalityTraits: (user.impressions.host.personalityTraits ?? []).map((trait) => __spreadValues({}, trait)),
          categoryBadges: [...user.impressions.host.categoryBadges ?? []]
        }) : void 0,
        member: user.impressions.member ? __spreadProps(__spreadValues({}, user.impressions.member), {
          vibeBadges: [...user.impressions.member.vibeBadges ?? []],
          personalityBadges: [...user.impressions.member.personalityBadges ?? []],
          personalityTraits: (user.impressions.member.personalityTraits ?? []).map((trait) => __spreadValues({}, trait)),
          categoryBadges: [...user.impressions.member.categoryBadges ?? []]
        }) : void 0
      } : void 0,
      notificationDevices: "notificationDevices" in user ? user.notificationDevices?.map((device) => __spreadValues({}, device)) : void 0,
      notificationPreferences: user.notificationPreferences ? {
        muted: user.notificationPreferences.muted === true
      } : void 0,
      paymentTotals: user.paymentTotals ? {
        outgoing: __spreadValues({}, user.paymentTotals.outgoing ?? {}),
        incoming: __spreadValues({}, user.paymentTotals.incoming ?? {}),
        all: __spreadValues({}, user.paymentTotals.all ?? {})
      } : void 0,
      activities: __spreadValues({}, user.activities)
    });
  }
  static normalizeImages(images) {
    return (images ?? []).map((image) => image?.trim() ?? "").filter((image) => image.length > 0);
  }
  static resolveUserAffinity(user) {
    const tokens = this.uniqueAffinityTokens([
      user.name,
      user.city,
      user.physique,
      ...user.languages ?? [],
      user.horoscope,
      user.gender,
      user.hostTier,
      user.traitLabel
    ]);
    const heightCm = this.parseHeightCm(user.height) ?? 170;
    return this.resolveAffinityTokenScore(tokens, `user:${user.id}`) * 97 + Math.max(18, Math.trunc(Number(user.age) || 30)) * 17 + heightCm * 11 + Math.max(0, Math.trunc(Number(user.completion) || 0)) * 13;
  }
  static uniqueAffinityTokens(values) {
    const seen = /* @__PURE__ */ new Set();
    for (const value of values) {
      const normalized = AppUtils.normalizeText(`${value ?? ""}`.replace(/^#+\s*/, "").trim());
      if (normalized) {
        seen.add(normalized);
      }
    }
    return [...seen];
  }
  static resolveAffinityTokenScore(tokens, seedPrefix) {
    return tokens.reduce((total, token) => total + (AppUtils.hashText(`${seedPrefix}:${token}`) % 997 + 1), 0);
  }
  static parseHeightCm(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.max(40, Math.min(250, parsed));
  }
};

// src/app/shared/core/local/source/mappers/activity.mapper.ts
var LocalActivityInviteCandidatesMapper = class {
  static toEntry(query, candidate) {
    const user = candidate.user;
    const rowKey = `${query.owner.sourceType}:${query.owner.ownerId}`;
    return {
      id: `${rowKey}:${user.id}`,
      userId: user.id,
      name: user.name,
      initials: user.initials,
      gender: user.gender,
      city: user.city,
      statusText: user.statusText,
      role: query.owner.isAdmin && user.id === query.activeUserId ? "Admin" : "Member",
      status: "pending",
      pendingSource: "admin",
      requestKind: "invite",
      invitedByActiveUser: true,
      metAtIso: candidate.metAtIso,
      actionAtIso: candidate.metAtIso,
      metWhere: candidate.metWhere,
      avatarUrl: AppUtils.firstImageUrl(user.images),
      profile: user
    };
  }
  static toEntries(query, candidates) {
    return candidates.map((candidate) => this.toEntry(query, candidate));
  }
};
var LocalActivityMembersBuilder = class {
  static toEntry(record, resolveProfile, involvementRecords = []) {
    return {
      id: record.id,
      userId: record.userId,
      name: record.name,
      initials: record.initials,
      gender: record.gender,
      city: record.city,
      statusText: record.statusText,
      role: record.role,
      status: record.status,
      pendingSource: record.pendingSource,
      requestKind: record.requestKind,
      invitedByActiveUser: record.invitedByActiveUser,
      invitedByUserId: record.invitedByUserId ?? null,
      metAtIso: record.metAtIso,
      actionAtIso: record.actionAtIso,
      metWhere: record.metWhere,
      avatarUrl: record.avatarUrl,
      involvements: this.toInvolvementEntries(involvementRecords),
      revision: record.updatedAtIso,
      attendanceStatus: record.attendanceStatus ?? null,
      checkedInAtIso: record.checkedInAtIso ?? null,
      checkedInByUserId: record.checkedInByUserId ?? null,
      checkedInTicketId: record.checkedInTicketId ?? null,
      managerGrantedByUserId: record.managerGrantedByUserId ?? null,
      organizerOnly: record.organizerOnly === true,
      profile: resolveProfile(record.userId, {
        name: record.name,
        initials: record.initials,
        city: record.city,
        gender: record.gender
      })
    };
  }
  static toRecord(owner, member, existingRecord) {
    const normalizedOwner = this.normalizeOwner(owner);
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const _a = member, { involvements: _involvements } = _a, persistedMember = __objRest(_a, ["involvements"]);
    const invitedByUserId = member.status === "pending" && (member.requestKind === "invite" || member.requestKind === "waitlist-invite" || member.requestKind === "approval") ? member.invitedByUserId?.trim() || null : null;
    return __spreadProps(__spreadValues({}, persistedMember), {
      invitedByUserId: existingRecord?.eventVipInvitation ? existingRecord.invitedByUserId : invitedByUserId,
      eventVipInvitation: existingRecord?.eventVipInvitation === true,
      eventVipAcceptedAtIso: existingRecord?.eventVipAcceptedAtIso ?? null,
      eventVipOfferedAtIso: existingRecord?.eventVipOfferedAtIso ?? null,
      eventVipOfferedPricing: existingRecord?.eventVipOfferedPricing ?? null,
      eventVipPriceAudit: existingRecord?.eventVipPriceAudit ?? [],
      invitedByActiveUser: invitedByUserId ? member.invitedByActiveUser === true : false,
      ownerType: normalizedOwner.ownerType,
      ownerId: normalizedOwner.ownerId,
      ownerKey: this.ownerKey(normalizedOwner),
      createdMs: Number.isFinite(Number(existingRecord?.createdMs)) ? Number(existingRecord?.createdMs) : nowMs,
      updatedMs: nowMs,
      createdAtIso: existingRecord?.createdAtIso?.trim() || nowIso,
      updatedAtIso: nowIso
    });
  }
  static recordsToOwnerSnapshot(owner, records, capacityTotal) {
    const normalizedOwner = this.normalizeOwner(owner);
    const normalizedRecords = this.cloneRecords(records);
    const acceptedMemberUserIds = this.memberUserIds(normalizedRecords, (record) => record.status === "accepted" && record.organizerOnly !== true);
    const capacityOccupyingAcceptedMemberUserIds = this.memberUserIds(normalizedRecords, (record) => record.status === "accepted" && record.organizerOnly !== true);
    const pendingMemberUserIds = this.memberUserIds(normalizedRecords, (record) => record.status === "pending");
    return {
      ownerType: normalizedOwner.ownerType,
      ownerId: normalizedOwner.ownerId,
      records: normalizedRecords,
      acceptedMemberUserIds,
      capacityOccupyingAcceptedMemberUserIds,
      pendingMemberUserIds,
      invitedMemberUserIds: this.memberUserIds(normalizedRecords, (record) => record.status === "pending" && this.isInvitationRecord(record)),
      pendingRequestMemberUserIds: this.memberUserIds(normalizedRecords, (record) => record.status === "pending" && !this.isInvitationRecord(record)),
      adminUserIds: this.memberUserIds(normalizedRecords, (record) => record.status === "accepted" && (record.role === "Admin" || record.role === "Manager")),
      capacityTotal: Math.max(capacityOccupyingAcceptedMemberUserIds.length, this.normalizeCount(capacityTotal) ?? capacityOccupyingAcceptedMemberUserIds.length)
    };
  }
  static ownerSnapshotToSummary(snapshot) {
    return {
      ownerType: snapshot.ownerType,
      ownerId: snapshot.ownerId,
      acceptedMembers: snapshot.capacityOccupyingAcceptedMemberUserIds.length,
      pendingMembers: snapshot.pendingMemberUserIds.length,
      capacityTotal: Math.max(snapshot.capacityOccupyingAcceptedMemberUserIds.length, this.normalizeCount(snapshot.capacityTotal) ?? 0),
      acceptedMemberUserIds: [...snapshot.acceptedMemberUserIds],
      pendingMemberUserIds: [...snapshot.pendingMemberUserIds]
    };
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      profile: record.profile ? __spreadValues({}, record.profile) : record.profile
    });
  }
  static cloneRecords(records) {
    return records.map((record) => this.cloneRecord(record));
  }
  static toInvolvementEntries(records) {
    const seen = /* @__PURE__ */ new Set();
    return records.filter((record) => record.status !== "deleted").map((record) => this.toInvolvementEntry(record)).filter((entry) => Boolean(entry)).filter((entry) => {
      const key = `${entry.ownerType}:${entry.ownerId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  static toInvolvementEntry(record) {
    const ownerId = `${record.ownerId ?? ""}`.trim();
    if (!ownerId) {
      return null;
    }
    const scope = this.ownerTypeLabel(record.ownerType);
    const slotDate = this.slotDateLabel(ownerId);
    const label = [
      record.metWhere?.trim() || scope,
      slotDate
    ].filter((value) => value.length > 0).join(" \xB7 ");
    const detail = [
      scope,
      this.statusLabel(record.status),
      record.role
    ].filter((value) => value.length > 0).join(" \xB7 ");
    return {
      id: `${record.ownerType}:${ownerId}`,
      ownerType: record.ownerType,
      ownerId,
      label,
      detail,
      status: record.status,
      role: record.role,
      actionAtIso: record.actionAtIso
    };
  }
  static ownerTypeLabel(ownerType) {
    switch (ownerType) {
      case "event":
        return "Event";
      case "subEvent":
        return "Sub event";
      case "group":
        return "Group";
      case "asset":
        return "Asset";
    }
  }
  static statusLabel(status) {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "pending":
        return "Pending";
      case "disqualified":
        return "Disqualified";
      case "removed":
        return "Removed";
      case "deleted":
        return "Deleted";
    }
  }
  static slotDateLabel(ownerId) {
    const marker = ":slot:";
    const markerIndex = ownerId.indexOf(marker);
    if (markerIndex < 0) {
      return "";
    }
    const tail = ownerId.slice(markerIndex + marker.length);
    const separatorIndex = tail.indexOf(":");
    const dateText = separatorIndex >= 0 ? tail.slice(separatorIndex + 1) : tail;
    const dateMs = Date.parse(dateText);
    if (!Number.isFinite(dateMs)) {
      return "";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(new Date(dateMs));
  }
  static sortEntriesForManagement(entries) {
    return [...entries].sort((left, right) => {
      const priorityComparison = this.managementPriority(left) - this.managementPriority(right);
      if (priorityComparison !== 0) {
        return priorityComparison;
      }
      const actionComparison = AppUtils.toSortableDate(right.actionAtIso) - AppUtils.toSortableDate(left.actionAtIso);
      return actionComparison !== 0 ? actionComparison : left.userId.localeCompare(right.userId);
    });
  }
  static managementPriority(entry) {
    if (entry.status === "pending") {
      return 0;
    }
    if (entry.status === "accepted" && (entry.role === "Admin" || entry.role === "Manager")) {
      return 1;
    }
    if (entry.status === "accepted") {
      return 2;
    }
    return entry.status === "disqualified" ? 3 : 4;
  }
  static normalizeOwner(owner) {
    return {
      ownerType: owner.ownerType,
      ownerId: owner.ownerId.trim()
    };
  }
  static ownerKey(owner) {
    return `${owner.ownerType}:${owner.ownerId}`;
  }
  static memberUserIds(records, predicate) {
    const ids = [];
    const seen = /* @__PURE__ */ new Set();
    for (const record of records) {
      const userId = record.userId.trim();
      if (!userId || seen.has(userId) || !predicate(record)) {
        continue;
      }
      seen.add(userId);
      ids.push(userId);
    }
    return ids;
  }
  static isInvitationRecord(record) {
    return record.requestKind === "invite" || record.requestKind === "waitlist-invite";
  }
  static normalizeCount(value) {
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
};
var LocalActivityResourcesMapper = class {
  static STATUS_ACTIVE = "A";
  static STATUS_DELETED = "D";
  static normalizeRef(ref) {
    const ownerId = `${ref?.ownerId ?? ""}`.trim();
    const subEventId = `${ref?.subEventId ?? ""}`.trim();
    const assetOwnerUserId = `${ref?.assetOwnerUserId ?? ""}`.trim();
    if (!ownerId || !subEventId || !assetOwnerUserId) {
      return null;
    }
    return {
      ownerId,
      subEventId,
      assetOwnerUserId
    };
  }
  static recordId(ref) {
    return ActivityResourceBuilder.recordId(ref);
  }
  static ownerKey(ref) {
    return ActivityResourceBuilder.ownerKey(ref);
  }
  static normalizeState(state, fallbackRef) {
    return ActivityResourceBuilder.normalizeState(state, fallbackRef);
  }
  static toRecord(state, existing, status = this.STATUS_ACTIVE) {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    return {
      id: existing?.id ?? this.newRecordId(state),
      status,
      ownerKey: this.ownerKey(state),
      ownerId: state.ownerId,
      subEventId: state.subEventId,
      assetOwnerUserId: state.assetOwnerUserId,
      assetAssignmentIds: ActivityResourceBuilder.cloneAssetAssignmentIds(state.assetAssignmentIds),
      assetSettingsByType: ActivityResourceBuilder.cloneAssetSettingsByType(state.assetSettingsByType),
      supplyContributionEntriesByAssetId: ActivityResourceBuilder.cloneSupplyContributionEntriesByAssetId(state.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: ActivityResourceBuilder.cloneFallbackAssetCardsByType(state.fallbackAssetCardsByType),
      resourceMetricsByType: ActivityResourceBuilder.cloneResourceMetricsByType(state.resourceMetricsByType),
      createdMs: existing?.createdMs ?? nowMs,
      updatedMs: nowMs,
      createdAtIso: existing?.createdAtIso ?? nowIso,
      updatedAtIso: nowIso
    };
  }
  static newRecordId(ref) {
    const generation = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return `${this.recordId(ref)}:${generation}`;
  }
  static toState(record) {
    if (this.isDeleted(record)) {
      return null;
    }
    const normalizedState = ActivityResourceBuilder.normalizeState({
      ownerId: record.ownerId,
      subEventId: record.subEventId,
      assetOwnerUserId: record.assetOwnerUserId,
      assetAssignmentIds: ActivityResourceBuilder.cloneAssetAssignmentIds(record.assetAssignmentIds),
      assetSettingsByType: ActivityResourceBuilder.cloneAssetSettingsByType(record.assetSettingsByType),
      supplyContributionEntriesByAssetId: ActivityResourceBuilder.cloneSupplyContributionEntriesByAssetId(record.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: ActivityResourceBuilder.cloneFallbackAssetCardsByType(record.fallbackAssetCardsByType),
      resourceMetricsByType: ActivityResourceBuilder.cloneResourceMetricsByType(record.resourceMetricsByType)
    }, record);
    return normalizedState ? ActivityResourceBuilder.cloneState(normalizedState) : null;
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      assetAssignmentIds: ActivityResourceBuilder.cloneAssetAssignmentIds(record.assetAssignmentIds),
      assetSettingsByType: ActivityResourceBuilder.cloneAssetSettingsByType(record.assetSettingsByType),
      supplyContributionEntriesByAssetId: ActivityResourceBuilder.cloneSupplyContributionEntriesByAssetId(record.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: ActivityResourceBuilder.cloneFallbackAssetCardsByType(record.fallbackAssetCardsByType)
    });
  }
  static isDeleted(record) {
    return `${record?.status ?? ""}`.trim() === this.STATUS_DELETED;
  }
};
var LocalActivitySubEventStageRuntimeMapper = class {
  static STATUS_ACTIVE = "A";
  static STATUS_DELETED = "D";
  static normalizeRef(ref) {
    const ownerId = `${ref?.ownerId ?? ""}`.trim();
    const subEventId = `${ref?.subEventId ?? ""}`.trim();
    if (!ownerId || !subEventId) {
      return null;
    }
    return {
      ownerId,
      subEventId
    };
  }
  static recordId(ref) {
    return `${ref.ownerId.trim()}:${ref.subEventId.trim()}`;
  }
  static ownerKey(ref) {
    return ref.ownerId.trim();
  }
  static normalizeState(state, fallbackRef) {
    const ref = this.normalizeRef(state) ?? this.normalizeRef(fallbackRef);
    if (!ref) {
      return null;
    }
    return {
      ownerId: ref.ownerId,
      subEventId: ref.subEventId,
      stageStatus: `${state?.stageStatus ?? ""}`.trim() || null,
      stageStatusReason: `${state?.stageStatusReason ?? ""}`.trim() || null,
      stageStatusUpdatedAt: `${state?.stageStatusUpdatedAt ?? ""}`.trim() || null,
      stageFinalizedAt: `${state?.stageFinalizedAt ?? ""}`.trim() || null,
      stageFinalizedByUserId: `${state?.stageFinalizedByUserId ?? ""}`.trim() || null,
      stageResultRevision: this.normalizeCount(state?.stageResultRevision),
      groupsCount: this.normalizeCount(state?.groupsCount)
    };
  }
  static toRecord(state, existing) {
    const normalized = this.normalizeState(state);
    if (!normalized) {
      throw new Error("Invalid sub-event stage runtime state.");
    }
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    return {
      id: this.recordId(normalized),
      status: this.STATUS_ACTIVE,
      ownerKey: this.ownerKey(normalized),
      ownerId: normalized.ownerId,
      subEventId: normalized.subEventId,
      stageStatus: `${normalized.stageStatus ?? ""}`.trim() || null,
      stageStatusReason: `${normalized.stageStatusReason ?? ""}`.trim() || null,
      stageStatusUpdatedAt: `${normalized.stageStatusUpdatedAt ?? ""}`.trim() || null,
      stageFinalizedAt: `${normalized.stageFinalizedAt ?? ""}`.trim() || null,
      stageFinalizedByUserId: `${normalized.stageFinalizedByUserId ?? ""}`.trim() || null,
      stageResultRevision: normalized.stageResultRevision ?? existing?.stageResultRevision ?? null,
      groupsCount: normalized.groupsCount ?? existing?.groupsCount ?? null,
      groupResourceMetricsByAssetOwnerId: this.cloneGroupResourceMetrics(existing?.groupResourceMetricsByAssetOwnerId),
      groupResourceReadAtByUserId: this.cloneGroupResourceReadAt(existing?.groupResourceReadAtByUserId),
      createdMs: existing?.createdMs ?? nowMs,
      updatedMs: nowMs,
      createdAtIso: existing?.createdAtIso ?? nowIso,
      updatedAtIso: nowIso
    };
  }
  static toState(record, viewerUserId) {
    if (this.isDeleted(record)) {
      return null;
    }
    const normalized = this.normalizeState({
      ownerId: record.ownerId,
      subEventId: record.subEventId,
      stageStatus: record.stageStatus,
      stageStatusReason: record.stageStatusReason,
      stageStatusUpdatedAt: record.stageStatusUpdatedAt,
      stageFinalizedAt: record.stageFinalizedAt,
      stageFinalizedByUserId: record.stageFinalizedByUserId,
      stageResultRevision: record.stageResultRevision,
      groupsCount: record.groupsCount
    }, record);
    return normalized ? __spreadProps(__spreadValues({}, normalized), {
      groupsResourcePendingRead: 0
    }) : null;
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      groupResourceMetricsByAssetOwnerId: this.cloneGroupResourceMetrics(record.groupResourceMetricsByAssetOwnerId),
      groupResourceReadAtByUserId: this.cloneGroupResourceReadAt(record.groupResourceReadAtByUserId)
    });
  }
  static cloneGroupResourceMetrics(source) {
    return Object.fromEntries(Object.entries(source ?? {}).map(([groupId, byAssetOwner]) => [
      groupId,
      Object.fromEntries(Object.entries(byAssetOwner ?? {}).map(([assetOwnerUserId, metricsByType]) => [
        assetOwnerUserId,
        ActivityResourceBuilder.cloneResourceMetricsByType(metricsByType)
      ]))
    ]));
  }
  static cloneGroupResourceReadAt(source) {
    return Object.fromEntries(Object.entries(source ?? {}).map(([groupId, byUser]) => [
      groupId,
      Object.fromEntries(Object.entries(byUser ?? {}).map(([userId, readAtByType]) => [
        userId,
        __spreadValues({}, readAtByType ?? {})
      ]))
    ]));
  }
  static resourcePendingRead(_record, _viewerUserId) {
    return 0;
  }
  static isDeleted(record) {
    return `${record?.status ?? ""}`.trim() === this.STATUS_DELETED;
  }
  static normalizeCount(value) {
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
};

// src/app/shared/core/local/source/mappers/event-checkout-basket.mapper.ts
var LocalEventCheckoutBasketsMapper = class {
  static toRecordFromRequest(request) {
    const userId = request.userId?.trim() ?? "";
    const sourceId = request.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    const status = this.normalizeDtoStatus(request.checkoutState);
    const currency = request.currency?.trim() || "USD";
    const items = (request.basketItems ?? []).map((item) => this.itemRecordFromDto(__spreadProps(__spreadValues({}, item), {
      status: item?.status === "pay" ? "pay" : status,
      resultState: item?.resultState ?? "pending"
    }), status, currency)).filter((item) => Boolean(item));
    return this.cloneRecord({
      userId,
      sourceId,
      status,
      items,
      pricingSummaryRows: this.pricingRowsToRecords(request.pricingSummaryRows, currency),
      lineItems: this.lineItemsToRecords(request.lineItems, currency),
      totalAmount: this.roundMoney(request.totalAmount),
      currency,
      slotSourceId: request.slotSourceId?.trim() || items.find((item) => item.slotSourceId?.trim())?.slotSourceId || null,
      selectedDateKey: items.find((item) => item.selectedDateKey?.trim())?.selectedDateKey ?? null,
      checkoutSessionId: items.find((item) => item.checkoutSessionId?.trim())?.checkoutSessionId ?? null,
      expiresAtIso: items.find((item) => item.expiresAtIso?.trim())?.expiresAtIso ?? null,
      appliedPromoCodes: this.normalizeAppliedPromoCodes(request.appliedPromoCodes)
    });
  }
  static toStatePatchRecord(request) {
    const userId = request.userId?.trim() ?? "";
    const sourceId = request.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    return {
      userId,
      sourceId,
      checkoutState: this.normalizeStatus(request.checkoutState),
      resultState: request.resultState == null ? null : this.normalizeResultState(request.resultState),
      checkoutSessionId: request.checkoutSessionId?.trim() || null
    };
  }
  static toRecord(dto) {
    if (!dto) {
      return null;
    }
    const userId = dto.userId?.trim() ?? "";
    const sourceId = dto.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    const currency = dto.currency?.trim() || "USD";
    const status = this.normalizeStatus(dto.status);
    const items = (dto.items ?? []).map((item) => this.itemRecordFromDto(item, status, currency)).filter((item) => Boolean(item));
    return this.cloneRecord({
      userId,
      sourceId,
      status,
      items,
      pricingSummaryRows: this.pricingRowsToRecords(dto.pricingSummaryRows, currency),
      lineItems: this.lineItemsToRecords(dto.lineItems, currency),
      totalAmount: this.roundMoney(dto.totalAmount),
      currency,
      slotSourceId: dto.slotSourceId?.trim() || null,
      selectedDateKey: dto.selectedDateKey?.trim() || null,
      checkoutSessionId: dto.checkoutSessionId?.trim() || null,
      expiresAtIso: dto.expiresAtIso?.trim() || null,
      appliedPromoCodes: this.normalizeAppliedPromoCodes(dto.appliedPromoCodes)
    });
  }
  static toDto(record) {
    const cloned = this.cloneRecord(record);
    if (!cloned) {
      return null;
    }
    return {
      userId: cloned.userId,
      sourceId: cloned.sourceId,
      status: this.normalizeDtoStatus(cloned.status),
      items: this.itemRecordsToDtos(cloned.items),
      pricingSummaryRows: cloned.pricingSummaryRows.map((row) => this.pricingRowToDto(row, cloned.currency)),
      lineItems: cloned.lineItems.map((item) => ({
        id: item.id,
        kind: item.kind,
        label: item.label,
        detail: item.detail,
        amount: item.amount,
        currency: item.currency || cloned.currency || "USD"
      })),
      totalAmount: cloned.totalAmount,
      currency: cloned.currency || "USD",
      slotSourceId: cloned.slotSourceId ?? null,
      selectedDateKey: cloned.selectedDateKey ?? null,
      checkoutSessionId: cloned.checkoutSessionId ?? null,
      expiresAtIso: cloned.expiresAtIso ?? null,
      appliedPromoCodes: [...cloned.appliedPromoCodes]
    };
  }
  static itemRecordsToDtos(records) {
    return (records ?? []).map((record) => this.itemRecordToDto(record)).filter((item) => Boolean(item));
  }
  static itemRecordToDto(record) {
    const cloned = this.cloneItemRecord(record);
    if (!cloned) {
      return null;
    }
    return {
      id: cloned.id,
      kind: cloned.kind,
      sourceId: cloned.sourceId,
      slotSourceId: cloned.slotSourceId ?? null,
      slotTemplateId: cloned.slotTemplateId ?? null,
      selectedDateKey: cloned.selectedDateKey ?? null,
      subEventId: cloned.subEventId ?? null,
      resourceType: cloned.resourceType ?? null,
      label: cloned.label,
      detail: cloned.detail,
      amount: cloned.amount,
      currency: cloned.currency,
      quantity: cloned.quantity,
      status: this.normalizeDtoStatus(cloned.status),
      resultState: this.normalizeResultState(cloned.resultState),
      pricingSummaryRows: cloned.pricingSummaryRows.map((row) => this.pricingRowToDto(row, cloned.currency)),
      checkoutSessionId: cloned.checkoutSessionId ?? null,
      createdAtIso: cloned.createdAtIso ?? null,
      updatedAtIso: cloned.updatedAtIso ?? null,
      expiresAtIso: cloned.expiresAtIso ?? null
    };
  }
  static cloneRecord(record) {
    const userId = record?.userId?.trim() ?? "";
    const sourceId = record?.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    const currency = record?.currency?.trim() || "USD";
    const status = this.normalizeStatus(record?.status);
    return {
      userId,
      sourceId,
      status,
      items: (record?.items ?? []).map((item) => this.cloneItemRecord(item, status, currency)).filter((item) => Boolean(item)),
      pricingSummaryRows: this.pricingRowsToRecords(record?.pricingSummaryRows, currency),
      lineItems: this.lineItemsToRecords(record?.lineItems, currency),
      totalAmount: this.roundMoney(record?.totalAmount),
      currency,
      slotSourceId: record?.slotSourceId?.trim() || null,
      selectedDateKey: record?.selectedDateKey?.trim() || null,
      checkoutSessionId: record?.checkoutSessionId?.trim() || null,
      expiresAtIso: record?.expiresAtIso?.trim() || null,
      appliedPromoCodes: this.normalizeAppliedPromoCodes(record?.appliedPromoCodes)
    };
  }
  static cloneItemRecord(record, fallbackStatus = "draft", fallbackCurrency) {
    const id = record?.id?.trim() ?? "";
    const sourceId = record?.sourceId?.trim() ?? "";
    const label = record?.label?.trim() ?? "";
    if (!id || !sourceId || !label) {
      return null;
    }
    const currency = record?.currency?.trim() || fallbackCurrency?.trim() || "USD";
    return {
      id,
      kind: this.normalizeKind(record?.kind),
      sourceId,
      slotSourceId: record?.slotSourceId?.trim() || null,
      slotTemplateId: record?.slotTemplateId?.trim() || null,
      selectedDateKey: record?.selectedDateKey?.trim() || null,
      subEventId: record?.subEventId?.trim() || null,
      resourceType: record?.resourceType ?? null,
      label,
      detail: record?.detail?.trim() || "",
      amount: this.roundMoney(record?.amount),
      currency,
      quantity: Math.max(1, Math.trunc(Number(record?.quantity) || 1)),
      status: this.normalizeStatus(record?.status ?? fallbackStatus),
      resultState: this.normalizeResultState(record?.resultState),
      pricingSummaryRows: this.pricingRowsToRecords(record?.pricingSummaryRows, currency),
      checkoutSessionId: record?.checkoutSessionId?.trim() || null,
      createdAtIso: record?.createdAtIso?.trim() || null,
      updatedAtIso: record?.updatedAtIso?.trim() || null,
      expiresAtIso: record?.expiresAtIso?.trim() || null
    };
  }
  static normalizeStatus(value) {
    return value === "confirmed" || value === "waiting" || value === "approval-pending" || value === "approved" || value === "pay" || value === "cancelled" || value === "rejected" || value === "deleted" ? value : "draft";
  }
  static normalizeDtoStatus(value) {
    const status = this.normalizeStatus(value);
    return status === "deleted" ? "draft" : status;
  }
  static normalizeResultState(value) {
    return value === "deleted" || value === "succeeded" || value === "failed" ? value : "pending";
  }
  static isInactiveResultState(resultState) {
    return resultState === "deleted" || resultState === "succeeded";
  }
  static isActiveStatus(status) {
    return status === "draft" || status === "confirmed" || status === "waiting" || status === "approval-pending" || status === "approved" || status === "pay";
  }
  static recordKey(userId, sourceId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    const normalizedSourceId = `${sourceId ?? ""}`.trim();
    return normalizedUserId && normalizedSourceId ? `${normalizedUserId}::${normalizedSourceId}` : "";
  }
  static itemRecordFromDto(item, fallbackStatus, fallbackCurrency) {
    if (!item) {
      return null;
    }
    return this.cloneItemRecord({
      id: item.id,
      kind: item.kind,
      sourceId: item.sourceId,
      slotSourceId: item.slotSourceId ?? null,
      slotTemplateId: item.slotTemplateId ?? null,
      selectedDateKey: item.selectedDateKey ?? null,
      subEventId: item.subEventId ?? null,
      resourceType: item.resourceType ?? null,
      label: item.label,
      detail: item.detail,
      amount: item.amount,
      currency: item.currency,
      quantity: item.quantity,
      status: this.normalizeStatus(item.status ?? fallbackStatus),
      resultState: this.normalizeResultState(item.resultState),
      pricingSummaryRows: this.pricingRowsToRecords(item.pricingSummaryRows, item.currency || fallbackCurrency),
      checkoutSessionId: item.checkoutSessionId ?? null,
      createdAtIso: item.createdAtIso ?? null,
      updatedAtIso: item.updatedAtIso ?? null,
      expiresAtIso: item.expiresAtIso ?? null
    }, fallbackStatus, fallbackCurrency);
  }
  static pricingRowToDto(row, fallbackCurrency) {
    return {
      key: row.key,
      label: row.label,
      detail: row.detail ?? null,
      amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
      currency: row.currency?.trim() || fallbackCurrency?.trim() || "USD",
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    };
  }
  static pricingRowsToRecords(rows, fallbackCurrency) {
    const currency = fallbackCurrency?.trim() || "USD";
    return (rows ?? []).map((row) => ({
      key: row.key?.trim() || row.label?.trim() || "pricing",
      label: row.label?.trim() || "Pricing",
      detail: row.detail?.trim() || null,
      amount: Number.isFinite(row.amount) ? this.roundMoney(Number(row.amount)) : null,
      currency: row.currency?.trim() || currency,
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    })).filter((row) => row.label);
  }
  static lineItemsToRecords(items, fallbackCurrency) {
    const currency = fallbackCurrency?.trim() || "USD";
    return (items ?? []).map((item) => ({
      id: item.id?.trim() ?? "",
      kind: this.normalizeKind(item.kind),
      label: item.label?.trim() ?? "",
      detail: item.detail?.trim() ?? "",
      amount: this.roundMoney(item.amount),
      currency: item.currency?.trim() || currency
    })).filter((item) => item.id && item.label);
  }
  static normalizeKind(value) {
    return value === "sub_event" || value === "resource" ? value : "event";
  }
  static normalizeAppliedPromoCodes(value) {
    return [...new Set((value ?? []).map((code) => `${code ?? ""}`.trim().toUpperCase()).filter(Boolean))];
  }
  static roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }
};

// src/app/shared/core/local/source/mappers/event-feedback.mapper.ts
var LocalEventFeedbackMapper = class {
  static DEFAULT_UNLOCK_DELAY_MS = 2 * 60 * 60 * 1e3;
  static toPageResult(options) {
    const query = this.normalizeQuery(options.query);
    const events = this.uniqueEvents(options.events);
    const organizerEvents = this.uniqueEvents(options.organizerEvents ?? options.events);
    const users = this.uniqueUsers(options.users, options.activeUser);
    const state = this.stateSnapshotFromDtos(options.states);
    const receivedEvents = this.cloneReceivedEvents(options.receivedEvents);
    const receivedByEventId = new Map(receivedEvents.map((item) => [item.eventId, item.entries]));
    const unlockDelayMs = options.eventFeedbackUnlockDelayMs ?? this.DEFAULT_UNLOCK_DELAY_MS;
    const nowMs = options.nowMs ?? Date.now();
    const feedbackCards = this.toFeedbackCards({
      events,
      users,
      activeUser: options.activeUser,
      eventFeedbackUnlockDelayMs: unlockDelayMs,
      nowMs
    });
    const cardsByEventId = this.cardsByEventId(feedbackCards);
    const allItems = this.toFeedbackEventItems({
      events,
      cardsByEventId,
      state,
      activeUserId: options.activeUser.id,
      eventFeedbackUnlockDelayMs: unlockDelayMs,
      nowMs
    });
    const organizerItems = this.toOrganizerItems(organizerEvents, receivedByEventId, unlockDelayMs, nowMs);
    const filtered = this.filterItems(query.filter, allItems, organizerItems);
    const pageItems = filtered.slice(query.page * query.pageSize, query.page * query.pageSize + query.pageSize);
    return new EventFeedbackPageResultDto({
      items: pageItems,
      total: filtered.length,
      allItems,
      organizerItems,
      receivedEvents,
      state,
      counts: this.counts(options.activeUser)
    });
  }
  static toDetail(options) {
    const eventId = options.query.eventId.trim();
    const userId = options.query.userId.trim();
    if (!userId || !eventId) {
      return new EventFeedbackDetailDto({ eventId });
    }
    const events = this.uniqueEvents(options.events);
    const event = events.find((item) => item.id === eventId) ?? null;
    if (!event) {
      return new EventFeedbackDetailDto({ eventId });
    }
    const users = this.uniqueUsers(options.users, options.activeUser);
    const cards = this.toFeedbackCards({
      events: [event],
      users,
      activeUser: options.activeUser,
      eventFeedbackUnlockDelayMs: options.eventFeedbackUnlockDelayMs ?? this.DEFAULT_UNLOCK_DELAY_MS,
      nowMs: options.nowMs ?? Date.now()
    }).filter((card) => card.eventId === eventId);
    return new EventFeedbackDetailDto({
      eventId,
      title: event.title,
      cards
    });
  }
  static toStat(options) {
    const eventId = options.query.eventId.trim();
    const records = options.records.filter((record) => record.eventId === eventId).map((record) => ({
      eventId,
      viewerUserId: record.viewerUserId.trim(),
      submittedAtIso: record.submittedAtIso.trim(),
      updatedAtIso: record.updatedAtIso.trim(),
      overallValue: record.overallValue.trim(),
      improveValue: record.improveValue.trim(),
      personalityTraitIds: (record.personalityTraitIds ?? []).map((traitId) => traitId.trim()).filter(Boolean)
    })).filter((record) => record.viewerUserId.length > 0);
    const totalResponses = records.length;
    return {
      eventId,
      totalResponses,
      sections: [
        this.toStatSection("overall", totalResponses, records.map((record) => record.overallValue)),
        this.toStatSection("improve", totalResponses, records.map((record) => record.improveValue)),
        this.toStatSection("traits", totalResponses, records.flatMap((record) => record.personalityTraitIds))
      ]
    };
  }
  static toFeedbackCards(options) {
    const cards = [];
    for (const event of options.events) {
      if (!this.isFeedbackAttendeeEvent(event)) {
        continue;
      }
      const startMs = this.eventStartAtMs(event);
      if (startMs === null || options.nowMs < startMs + options.eventFeedbackUnlockDelayMs) {
        continue;
      }
      const eventLabel = this.eventFeedbackWhenLabel(event);
      const host = this.feedbackHostUserForEvent(event, options.users, options.activeUser);
      const attendees = this.feedbackAttendeesForEvent(event, host.id, options.users, options.activeUser.id);
      cards.push({
        id: `feedback-event-${event.id}`,
        eventId: event.id,
        kind: "event",
        targetUserId: host.id,
        targetRole: "Admin",
        eventTitle: event.title,
        eventSubtitle: event.subtitle,
        eventImageUrl: event.imageUrl?.trim() || "",
        eventTimeframe: event.timeframe,
        eventStartAtIso: event.startAtIso?.trim() ?? "",
        eventLabel,
        targetName: host.name,
        targetAge: host.age,
        targetCity: host.city,
        targetGender: host.gender,
        targetTraitLabel: host.traitLabel,
        targetImageUrl: AppUtils.firstImageUrl(host.images)
      });
      for (const attendee of attendees) {
        const attendeeRole = this.feedbackRoleForAttendee(event.id, attendee.id);
        cards.push({
          id: `feedback-attendee-${event.id}-${attendee.id}`,
          eventId: event.id,
          kind: "attendee",
          attendeeUserId: attendee.id,
          targetUserId: attendee.id,
          targetRole: attendeeRole,
          eventTitle: event.title,
          eventSubtitle: event.subtitle,
          eventImageUrl: event.imageUrl?.trim() || "",
          eventTimeframe: event.timeframe,
          eventStartAtIso: event.startAtIso?.trim() ?? "",
          eventLabel,
          targetName: attendee.name,
          targetAge: attendee.age,
          targetCity: attendee.city,
          targetGender: attendee.gender,
          targetTraitLabel: attendee.traitLabel,
          targetImageUrl: AppUtils.firstImageUrl(attendee.images)
        });
      }
    }
    return cards;
  }
  static toFeedbackEventItems(options) {
    const items = [];
    for (const event of options.events) {
      if (!this.isFeedbackAttendeeEvent(event)) {
        continue;
      }
      const startMs = this.eventStartAtMs(event);
      if (startMs === null || options.nowMs < startMs + options.eventFeedbackUnlockDelayMs) {
        continue;
      }
      const cards = (options.cardsByEventId[event.id] ?? []).filter((card) => !(card.kind === "attendee" && card.attendeeUserId === options.activeUserId));
      if (cards.length === 0) {
        continue;
      }
      const eventSubmitted = Boolean(options.state.submittedEventsById[event.id]);
      const pendingCards = eventSubmitted ? 0 : cards.filter((card) => !options.state.submittedCardsById[card.id]).length;
      const isRemoved = Boolean(options.state.removedEventsById[event.id]);
      items.push({
        eventId: event.id,
        title: event.title,
        subtitle: event.subtitle,
        timeframe: event.timeframe,
        imageUrl: event.imageUrl?.trim() || "",
        startAtMs: startMs,
        pendingCards,
        totalCards: cards.length,
        isRemoved,
        isFeedbacked: !isRemoved && pendingCards === 0,
        feedbackedAtMs: this.isoToMs(options.state.submittedEventsById[event.id]),
        removedAtMs: this.isoToMs(options.state.removedEventDatesById[event.id])
      });
    }
    return this.sortPendingItems(items);
  }
  static toOrganizerItems(events, receivedByEventId, eventFeedbackUnlockDelayMs, nowMs) {
    return events.filter((event) => !this.isTrashedEvent(event) && !this.isInvitationEvent(event) && this.isEventAdmin(event)).filter((event) => this.isFeedbackUnlocked(event, eventFeedbackUnlockDelayMs, nowMs)).map((event) => {
      const entries = receivedByEventId.get(event.id) ?? [];
      return {
        eventId: event.id,
        title: event.title,
        subtitle: event.subtitle,
        timeframe: event.timeframe,
        imageUrl: event.imageUrl?.trim() || "",
        startAtMs: this.eventStartAtMs(event) ?? 0,
        pendingCards: entries.length,
        totalCards: entries.length,
        isRemoved: false,
        isFeedbacked: false,
        feedbackedAtMs: this.entriesLatestAtMs(entries),
        removedAtMs: null,
        isOwnEvent: true
      };
    }).filter((item) => item.eventId.length > 0).sort((left, right) => this.compareDates(left.startAtMs, right.startAtMs, "asc") || left.title.localeCompare(right.title) || right.totalCards - left.totalCards || this.compareDates(left.feedbackedAtMs, right.feedbackedAtMs, "desc"));
  }
  static filterItems(filter, allItems, organizerItems) {
    switch (filter) {
      case "own-events":
        return organizerItems.map((item) => __spreadValues({}, item));
      case "feedbacked":
        return allItems.filter((item) => item.isFeedbacked).sort((left, right) => this.compareDates(left.feedbackedAtMs ?? left.startAtMs, right.feedbackedAtMs ?? right.startAtMs, "desc") || right.title.localeCompare(left.title));
      case "removed":
        return allItems.filter((item) => item.isRemoved).sort((left, right) => this.compareDates(left.removedAtMs ?? left.feedbackedAtMs ?? left.startAtMs, right.removedAtMs ?? right.feedbackedAtMs ?? right.startAtMs, "desc") || right.title.localeCompare(left.title));
      case "pending":
      default:
        return this.sortPendingItems(allItems.filter((item) => !item.isRemoved && item.pendingCards > 0));
    }
  }
  static sortPendingItems(items) {
    return [...items].sort((left, right) => this.compareDates(left.startAtMs, right.startAtMs, "asc") || left.title.localeCompare(right.title));
  }
  static isFeedbackUnlocked(event, eventFeedbackUnlockDelayMs, nowMs) {
    const endAtMs = new Date(event.endAtIso ?? "").getTime();
    return Number.isFinite(endAtMs) && nowMs >= endAtMs + eventFeedbackUnlockDelayMs;
  }
  static counts(activeUser) {
    const counters = activeUser.activities?.eventFeedback;
    return {
      ownEvents: this.counter(counters?.ownEvents),
      pending: this.counter(counters?.pending),
      feedbacked: this.counter(counters?.feedbacked),
      removed: this.counter(counters?.removed)
    };
  }
  static counter(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  static toStatSection(key, responseCount, values) {
    return {
      key,
      responseCount,
      options: this.countStatOptions(values)
    };
  }
  static countStatOptions(values) {
    const countByKey = /* @__PURE__ */ new Map();
    for (const value of values) {
      const normalizedValue = value.trim();
      if (!normalizedValue) {
        continue;
      }
      countByKey.set(normalizedValue, (countByKey.get(normalizedValue) ?? 0) + 1);
    }
    return [...countByKey.entries()].map(([key, count]) => ({ key, count })).sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));
  }
  static stateSnapshotFromDtos(states) {
    const snapshot = this.emptyStateSnapshot();
    for (const state of states) {
      const eventId = state.eventId?.trim() ?? "";
      if (!eventId) {
        continue;
      }
      if (state.removed) {
        snapshot.removedEventsById[eventId] = true;
        const removedAtIso = state.removedAtIso?.trim() ?? "";
        if (removedAtIso) {
          snapshot.removedEventDatesById[eventId] = removedAtIso;
        }
      }
      const submittedAtIso = state.submittedAtIso?.trim() ?? "";
      if (submittedAtIso) {
        snapshot.submittedEventsById[eventId] = submittedAtIso;
      }
      const organizerNote = state.organizerNote?.trim() ?? "";
      if (organizerNote) {
        snapshot.organizerNotesByEventId[eventId] = organizerNote;
      }
      for (const [cardId, answer] of Object.entries(state.answersByCardId ?? {})) {
        const normalizedCardId = cardId.trim();
        if (!normalizedCardId || !answer) {
          continue;
        }
        snapshot.submittedCardsById[normalizedCardId] = true;
        snapshot.submittedAnswersByCardId[normalizedCardId] = this.cloneSubmittedEventFeedbackAnswer(answer);
      }
    }
    return snapshot;
  }
  static emptyStateSnapshot() {
    return {
      submittedCardsById: {},
      submittedAnswersByCardId: {},
      submittedEventsById: {},
      removedEventsById: {},
      removedEventDatesById: {},
      organizerNotesByEventId: {}
    };
  }
  static cloneReceivedEvents(events) {
    return (events ?? []).map((item) => {
      const eventId = item.eventId?.trim() ?? "";
      return {
        eventId,
        entries: (item.entries ?? []).map((entry) => ({
          viewerUserId: entry.viewerUserId?.trim() ?? "",
          viewerName: entry.viewerName?.trim() ?? "",
          viewerInitials: entry.viewerInitials?.trim() ?? "",
          viewerGender: entry.viewerGender === "woman" ? "woman" : "man",
          viewerImageUrl: entry.viewerImageUrl?.trim() ?? "",
          eventId: entry.eventId?.trim() || eventId,
          submittedAtIso: entry.submittedAtIso?.trim() ?? "",
          updatedAtIso: entry.updatedAtIso?.trim() ?? "",
          organizerNote: entry.organizerNote?.trim() ?? "",
          answers: (entry.answers ?? []).map((answer) => this.cloneSubmittedEventFeedbackAnswer(answer))
        })).filter((entry) => entry.viewerUserId.length > 0)
      };
    }).filter((item) => item.eventId.length > 0);
  }
  static cardsByEventId(cards) {
    const next = {};
    for (const card of cards) {
      const eventId = card.eventId?.trim() ?? "";
      if (!eventId) {
        continue;
      }
      next[eventId] = [...next[eventId] ?? [], __spreadValues({}, card)];
    }
    return next;
  }
  static uniqueEvents(events) {
    const byId = /* @__PURE__ */ new Map();
    for (const event of events) {
      const eventId = event.id?.trim() ?? "";
      if (!eventId) {
        continue;
      }
      const current = byId.get(eventId);
      if (!current || this.eventPreferenceScore(event) > this.eventPreferenceScore(current)) {
        byId.set(eventId, event);
      }
    }
    return [...byId.values()];
  }
  static eventPreferenceScore(event) {
    return (this.isEventAdmin(event) ? 8 : 0) + (event.type === "hosting" ? 4 : 0) + (!this.isInvitationEvent(event) ? 2 : 0) + (!this.isTrashedEvent(event) ? 1 : 0);
  }
  static isFeedbackAttendeeEvent(event) {
    return event.type === "events" && !this.isTrashedEvent(event) && !this.isInvitationEvent(event) && !this.isEventAdmin(event);
  }
  static isEventAdmin(event) {
    const userId = `${event.userId ?? ""}`.trim();
    return !!userId && (event.creatorUserId === userId || (event.adminIds ?? []).some((adminId) => `${adminId ?? ""}`.trim() === userId));
  }
  static isInvitationEvent(event) {
    return event.type === "invitations";
  }
  static isTrashedEvent(event) {
    return event.status === "T";
  }
  static uniqueUsers(users, activeUser) {
    const byId = /* @__PURE__ */ new Map();
    for (const user of [activeUser, ...users]) {
      const userId = user.id?.trim() ?? "";
      if (userId) {
        byId.set(userId, user);
      }
    }
    return [...byId.values()];
  }
  static normalizeQuery(query) {
    return {
      userId: query.userId.trim(),
      filter: query.filter,
      page: Math.max(0, Math.trunc(Number(query.page) || 0)),
      pageSize: Math.max(1, Math.trunc(Number(query.pageSize) || 1))
    };
  }
  static feedbackHostUserForEvent(event, users, activeUser) {
    const creatorUserId = event.creatorUserId?.trim() ?? "";
    if (creatorUserId) {
      const creator = users.find((user) => user.id === creatorUserId);
      if (creator) {
        return creator;
      }
    }
    const candidates = users.filter((user) => user.id !== activeUser.id);
    if (candidates.length === 0) {
      return activeUser;
    }
    const index = AppUtils.hashText(`feedback-host:${event.id}`) % candidates.length;
    return candidates[index] ?? candidates[0];
  }
  static feedbackAttendeesForEvent(event, hostId, users, activeUserId) {
    const attendeeIds = [...new Set([
      ...event.acceptedMemberUserIds ?? [],
      ...event.pendingMemberUserIds ?? []
    ].map((userId) => `${userId}`.trim()).filter(Boolean))].filter((userId) => userId !== activeUserId && userId !== hostId);
    if (attendeeIds.length > 0) {
      const usersById = new Map(users.map((user) => [user.id, user]));
      const resolved = attendeeIds.map((userId) => usersById.get(userId)).filter((user) => Boolean(user));
      if (resolved.length > 0) {
        return resolved.slice(0, Math.min(5, resolved.length));
      }
    }
    const candidates = users.filter((user) => user.id !== activeUserId && user.id !== hostId);
    if (candidates.length === 0) {
      return [];
    }
    const seed = AppUtils.hashText(`feedback-attendees:${event.id}`);
    const desired = Math.min(candidates.length, 3 + seed % 4);
    const picked = [];
    for (let index = 0; index < candidates.length && picked.length < desired; index += 1) {
      const candidate = candidates[(seed + index * 3) % candidates.length];
      if (!candidate || candidate.id === activeUserId || picked.some((item) => item.id === candidate.id)) {
        continue;
      }
      picked.push(candidate);
    }
    return picked;
  }
  static feedbackRoleForAttendee(eventId, attendeeUserId) {
    const seed = AppUtils.hashText(`feedback-role:${eventId}:${attendeeUserId}`);
    if (seed % 11 === 0) {
      return "Admin";
    }
    if (seed % 4 === 0) {
      return "Manager";
    }
    return "Member";
  }
  static eventStartAtMs(event) {
    const iso = event.startAtIso?.trim() ?? "";
    if (!iso) {
      return null;
    }
    const value = new Date(iso).getTime();
    return Number.isNaN(value) ? null : value;
  }
  static eventFeedbackWhenLabel(event) {
    const startMs = this.eventStartAtMs(event);
    if (startMs === null) {
      return "Recent event";
    }
    const parsed = new Date(startMs);
    const day = parsed.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const time = parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return `${day} \xB7 ${time}`;
  }
  static entriesLatestAtMs(entries) {
    let latestAtMs = null;
    for (const entry of entries) {
      const candidateMs = this.entryTimestampMs(entry);
      if (candidateMs <= 0) {
        continue;
      }
      latestAtMs = latestAtMs === null ? candidateMs : Math.max(latestAtMs, candidateMs);
    }
    return latestAtMs;
  }
  static entryTimestampMs(entry) {
    const iso = entry.updatedAtIso?.trim() || entry.submittedAtIso?.trim() || (entry.answers ?? []).map((answer) => answer.submittedAtIso?.trim() ?? "").find(Boolean) || "";
    return this.isoToMs(iso) ?? 0;
  }
  static cloneSubmittedEventFeedbackAnswer(answer) {
    return __spreadProps(__spreadValues({}, answer), {
      cardId: answer.cardId?.trim() ?? "",
      eventId: answer.eventId?.trim() ?? "",
      kind: answer.kind === "attendee" ? "attendee" : "event",
      targetUserId: answer.targetUserId?.trim() || null,
      targetRole: answer.targetRole === "Admin" || answer.targetRole === "Manager" ? answer.targetRole : "Member",
      primaryValue: answer.primaryValue?.trim() ?? "",
      secondaryValue: answer.secondaryValue?.trim() ?? "",
      eventComment: answer.kind === "event" ? answer.eventComment?.trim() ?? "" : "",
      personalityTraitIds: [...answer.personalityTraitIds ?? []],
      tags: [...answer.tags ?? []],
      submittedAtIso: answer.submittedAtIso?.trim() ?? ""
    });
  }
  static isoToMs(iso) {
    const normalizedIso = iso?.trim() ?? "";
    if (!normalizedIso) {
      return null;
    }
    const value = new Date(normalizedIso).getTime();
    return Number.isNaN(value) ? null : value;
  }
  static compareDates(leftMs, rightMs, direction) {
    const left = Number.isFinite(leftMs) && (leftMs ?? 0) > 0 ? Number(leftMs) : null;
    const right = Number.isFinite(rightMs) && (rightMs ?? 0) > 0 ? Number(rightMs) : null;
    if (left === null && right === null) {
      return 0;
    }
    if (left === null) {
      return 1;
    }
    if (right === null) {
      return -1;
    }
    return direction === "asc" ? left - right : right - left;
  }
};

// src/app/shared/core/local/source/mappers/event-participation-action.mapper.ts
var LocalEventParticipationActionMapper = class {
  static toResult(record, userId, options = {}) {
    const acceptedMembers = this.nonNegativeInteger(record.acceptedMembers);
    const pendingMembers = this.nonNegativeInteger(record.pendingMembers);
    const capacityTotal = Math.max(acceptedMembers, this.nonNegativeInteger(record.capacityTotal));
    const pendingReason = this.normalizePendingReason(options.pendingReason ?? record.pendingReason);
    const normalizedUserId = userId.trim();
    return {
      sourceId: record.id,
      slotSourceId: options.slotSourceId?.trim() || null,
      action: "join",
      membershipStatus: pendingReason || !record.acceptedMemberUserIds?.includes(normalizedUserId) ? "pending" : "accepted",
      pendingReason,
      acceptedMembers,
      pendingMembers,
      capacityTotal,
      full: record.full === true || capacityTotal > 0 && acceptedMembers >= capacityTotal,
      paymentSessionId: options.paymentSessionId?.trim() || null
    };
  }
  static normalizePendingReason(value) {
    if (value === "waitlist") {
      return "waitlist";
    }
    if (value === "approval") {
      return "approval";
    }
    return null;
  }
  static nonNegativeInteger(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
};

// src/app/shared/core/local/source/mappers/help-center.mapper.ts
var LocalHelpCenterMapper = class {
  static toDto(record) {
    if ("approvedOptionalSectionIds" in record) {
      return this.privacyConsentDto(record);
    }
    if ("action" in record) {
      return this.auditDto(record);
    }
    return this.revisionDto(record);
  }
  static toRecord(dto) {
    if ("approvedOptionalSectionIds" in dto) {
      return this.privacyConsentRecord(dto);
    }
    if ("action" in dto) {
      return this.auditRecord(dto);
    }
    return this.revisionRecord(dto);
  }
  static revisionDto(record) {
    return {
      id: record.id,
      documentKind: this.toDocumentKind(record.documentKind),
      contextKey: record.contextKey,
      lang: record.lang,
      languageLabel: record.languageLabel,
      version: record.version,
      title: record.title,
      summary: record.summary,
      description: record.description,
      headerColor: this.toHeaderColor(record.headerColor),
      sections: record.sections.map((section) => this.toSectionDTO(section)),
      active: record.active,
      createdAtIso: record.createdAtIso,
      createdByUserId: record.createdByUserId,
      updatedAtIso: record.updatedAtIso,
      updatedByUserId: record.updatedByUserId
    };
  }
  static revisionRecord(dto) {
    return {
      id: dto.id,
      documentKind: dto.documentKind,
      contextKey: dto.contextKey,
      lang: dto.lang,
      languageLabel: dto.languageLabel,
      version: dto.version,
      title: dto.title,
      summary: dto.summary,
      description: dto.description,
      headerColor: dto.headerColor,
      sections: dto.sections.map((section) => this.toSectionRecord(section)),
      active: dto.active,
      createdAtIso: dto.createdAtIso,
      createdByUserId: dto.createdByUserId,
      updatedAtIso: dto.updatedAtIso,
      updatedByUserId: dto.updatedByUserId
    };
  }
  static auditDto(record) {
    return {
      id: record.id,
      documentKind: this.toDocumentKind(record.documentKind),
      lang: record.lang,
      languageLabel: record.languageLabel,
      revisionId: record.revisionId,
      version: record.version,
      action: this.toAuditAction(record.action),
      actorUserId: record.actorUserId,
      createdAtIso: record.createdAtIso,
      message: record.message
    };
  }
  static auditRecord(dto) {
    return {
      id: dto.id,
      documentKind: dto.documentKind,
      lang: dto.lang,
      languageLabel: dto.languageLabel,
      revisionId: dto.revisionId,
      version: dto.version,
      action: dto.action,
      actorUserId: dto.actorUserId,
      createdAtIso: dto.createdAtIso,
      message: dto.message
    };
  }
  static privacyConsentDto(record) {
    return {
      id: record.id,
      userId: record.userId,
      revisionId: record.revisionId,
      revisionVersion: record.revisionVersion,
      approvedOptionalSectionIds: [...record.approvedOptionalSectionIds],
      acceptedAtIso: record.acceptedAtIso,
      updatedAtIso: record.updatedAtIso,
      source: this.toPrivacyConsentSource(record.source)
    };
  }
  static privacyConsentRecord(dto) {
    return {
      id: dto.id,
      userId: dto.userId,
      revisionId: dto.revisionId,
      revisionVersion: dto.revisionVersion,
      approvedOptionalSectionIds: [...dto.approvedOptionalSectionIds],
      acceptedAtIso: dto.acceptedAtIso,
      updatedAtIso: dto.updatedAtIso,
      source: dto.source
    };
  }
  static toSectionDTO(record) {
    return {
      id: record.id,
      icon: record.icon,
      title: record.title,
      blurb: record.blurb,
      contentHtml: record.contentHtml,
      imageUrls: record.imageUrls ? [...record.imageUrls] : record.imageUrls,
      panelSpan: this.toSectionPanelSpan(record.panelSpan),
      optional: record.optional,
      details: record.details ? [...record.details] : record.details,
      points: record.points ? [...record.points] : record.points
    };
  }
  static toSectionRecord(dto) {
    return {
      id: dto.id,
      icon: dto.icon,
      title: dto.title,
      blurb: dto.blurb,
      contentHtml: dto.contentHtml,
      imageUrls: dto.imageUrls ? [...dto.imageUrls] : dto.imageUrls,
      panelSpan: dto.panelSpan,
      optional: dto.optional,
      details: dto.details ? [...dto.details] : dto.details,
      points: dto.points ? [...dto.points] : dto.points
    };
  }
  static toDocumentKind(value) {
    switch (`${value ?? ""}`.trim()) {
      case "help":
      case "privacy":
      case "terms":
      case "explanation":
        return value;
      default:
        return void 0;
    }
  }
  static toHeaderColor(value) {
    return AppUtils.enumValueOrNull(value, APP_STATIC_DATA.helpCenterHeaderColors) ?? void 0;
  }
  static toSectionPanelSpan(value) {
    switch (`${value ?? ""}`.trim()) {
      case "span-1":
      case "span-2":
      case "span-3":
        return value;
      default:
        return void 0;
    }
  }
  static toAuditAction(value) {
    switch (`${value ?? ""}`.trim()) {
      case "seed":
      case "create":
      case "update":
      case "activate":
      case "delete":
        return value;
      default:
        return "update";
    }
  }
  static toPrivacyConsentSource(value) {
    return `${value ?? ""}`.trim() === "settings" ? "settings" : "entry";
  }
};

// src/app/shared/core/local/source/mappers/profile-experiences.mapper.ts
var LocalProfileExperiencesMapper = class {
  static toEntry(entry) {
    const id = `${entry?.id ?? ""}`.trim();
    if (!id) {
      return null;
    }
    return {
      id,
      type: this.normalizeType(entry?.type),
      title: `${entry?.title ?? ""}`.trim(),
      org: `${entry?.org ?? ""}`.trim(),
      city: `${entry?.city ?? ""}`.trim(),
      dateFrom: `${entry?.dateFrom ?? ""}`.trim(),
      dateTo: `${entry?.dateTo ?? ""}`.trim() || "Present",
      description: `${entry?.description ?? ""}`.trim()
    };
  }
  static toEntries(entries) {
    return entries.map((entry) => this.toEntry(entry)).filter((entry) => Boolean(entry));
  }
  static cloneEntries(entries) {
    return entries.map((entry) => __spreadValues({}, entry));
  }
  static normalizeType(value) {
    if (value === "School" || value === "Online Session" || value === "Additional Project") {
      return value;
    }
    return "Workspace";
  }
};

// src/app/shared/core/local/source/mappers/chat-message.mapper.ts
var LocalChatMessageMapper = class {
  static toDto(record) {
    return {
      id: record.messageId,
      clientId: record.clientId ?? void 0,
      sender: record.senderName,
      senderAvatar: this.avatarToDto(record.senderAvatar),
      text: record.bodyText,
      time: record.timeLabel,
      sentAtIso: record.sentAtIso,
      mine: record.mine,
      readBy: (record.readBy ?? []).map((reader) => this.avatarToDto(reader)),
      deliveryState: record.deliveryState ?? void 0,
      deletedAtIso: record.deletedAtIso,
      deletedByUserId: record.deletedByUserId,
      deletedByName: record.deletedByName,
      editedAtIso: record.editedAtIso,
      pinnedAtIso: record.pinnedAtIso,
      pinnedByUserId: record.pinnedByUserId,
      replyTo: record.replyTo ? {
        id: record.replyTo.messageId,
        sender: record.replyTo.senderName,
        text: record.replyTo.bodyText
      } : record.replyTo,
      reactions: (record.reactions ?? []).map((reaction) => this.reactionToDto(reaction)),
      attachments: (record.attachments ?? []).map((attachment) => this.attachmentToDto(attachment))
    };
  }
  static toRecord(ownerUserId, chatId, dto) {
    const normalizedOwnerUserId = `${ownerUserId ?? ""}`.trim();
    const normalizedChatId = `${chatId ?? ""}`.trim();
    const messageId = `${dto.id ?? ""}`.trim();
    return {
      recordId: this.recordKey(normalizedOwnerUserId, normalizedChatId, messageId),
      ownerUserId: normalizedOwnerUserId,
      chatId: normalizedChatId,
      messageId,
      clientId: dto.clientId ?? null,
      senderName: `${dto.sender ?? ""}`.trim(),
      senderAvatar: this.avatarToRecord(dto.senderAvatar),
      bodyText: `${dto.text ?? ""}`,
      timeLabel: `${dto.time ?? ""}`.trim(),
      sentAtIso: `${dto.sentAtIso ?? ""}`.trim(),
      mine: dto.mine === true,
      readBy: (dto.readBy ?? []).map((reader) => this.avatarToRecord(reader)),
      deliveryState: dto.deliveryState ?? null,
      deletedAtIso: dto.deletedAtIso ?? null,
      deletedByUserId: dto.deletedByUserId ?? null,
      deletedByName: dto.deletedByName ?? null,
      editedAtIso: dto.editedAtIso ?? null,
      pinnedAtIso: dto.pinnedAtIso ?? null,
      pinnedByUserId: dto.pinnedByUserId ?? null,
      replyTo: dto.replyTo ? {
        messageId: `${dto.replyTo.id ?? ""}`.trim(),
        senderName: `${dto.replyTo.sender ?? ""}`.trim(),
        bodyText: `${dto.replyTo.text ?? ""}`
      } : dto.replyTo,
      reactions: (dto.reactions ?? []).map((reaction) => this.reactionToRecord(reaction)),
      attachments: (dto.attachments ?? []).map((attachment) => this.attachmentToRecord(attachment))
    };
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static recordKey(ownerUserId, chatId, messageId) {
    return `${ownerUserId.trim()}:${chatId.trim()}:${messageId.trim()}`;
  }
  static chatKey(ownerUserId, chatId) {
    return `${ownerUserId.trim()}:${chatId.trim()}`;
  }
  static avatarToDto(record) {
    return {
      id: record.userId,
      initials: record.initials,
      gender: record.gender,
      imageUrl: record.imageUrl
    };
  }
  static avatarToRecord(dto) {
    return {
      userId: `${dto.id ?? ""}`.trim(),
      initials: `${dto.initials ?? ""}`.trim(),
      gender: dto.gender,
      imageUrl: dto.imageUrl ?? null
    };
  }
  static reactionToDto(record) {
    return {
      emoji: record.emoji,
      userId: record.userId,
      userName: record.userName,
      userInitials: record.userInitials,
      userGender: record.userGender,
      reactedAtIso: record.reactedAtIso
    };
  }
  static reactionToRecord(dto) {
    return {
      emoji: `${dto.emoji ?? ""}`.trim(),
      userId: `${dto.userId ?? ""}`.trim(),
      userName: `${dto.userName ?? ""}`.trim(),
      userInitials: `${dto.userInitials ?? ""}`.trim(),
      userGender: dto.userGender,
      reactedAtIso: `${dto.reactedAtIso ?? ""}`.trim()
    };
  }
  static attachmentToDto(record) {
    return {
      id: record.attachmentId,
      type: record.type,
      title: record.title,
      entityId: record.entityId,
      assetType: record.assetType,
      ownerUserId: record.ownerUserId,
      status: record.status,
      unavailableReason: record.unavailableReason,
      subtitle: record.subtitle,
      description: record.description,
      url: record.url,
      previewUrl: record.previewUrl,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes
    };
  }
  static attachmentToRecord(dto) {
    return {
      attachmentId: `${dto.id ?? ""}`.trim(),
      type: dto.type,
      title: `${dto.title ?? ""}`.trim(),
      entityId: dto.entityId ?? null,
      assetType: dto.assetType ?? null,
      ownerUserId: dto.ownerUserId ?? null,
      status: dto.status ?? null,
      unavailableReason: dto.unavailableReason ?? null,
      subtitle: dto.subtitle ?? null,
      description: dto.description ?? null,
      url: dto.url ?? null,
      previewUrl: dto.previewUrl ?? null,
      mimeType: dto.mimeType ?? null,
      sizeBytes: dto.sizeBytes ?? null
    };
  }
};

// src/app/shared/core/local/source/mappers/chat-thread.mapper.ts
var LocalChatThreadMapper = class {
  static toDto(record) {
    return {
      id: record.id,
      avatar: record.avatar,
      title: record.title,
      lastMessage: record.lastMessage,
      lastSenderId: record.lastSenderId,
      memberIds: [...record.memberIds ?? []],
      members: this.cloneMembers(record.members),
      unread: Math.max(0, Math.trunc(Number(record.unread) || 0)),
      dateIso: record.dateIso,
      contextStartAtIso: record.contextStartAtIso ?? null,
      contextEndAtIso: record.contextEndAtIso ?? null,
      distanceKm: record.distanceKm,
      distanceMetersExact: record.distanceMetersExact,
      channelType: record.channelType,
      serviceContext: record.serviceContext,
      ownerId: record.ownerId,
      eventId: record.eventId,
      ownerStatus: record.ownerStatus ?? null,
      revision: Math.max(1, Math.trunc(Number(record.revision) || 1)),
      subEventId: record.subEventId,
      supportCase: this.cloneSupportCase(record.supportCase),
      ownerUserId: record.ownerUserId,
      metrics: null
    };
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toMap(records) {
    const result = /* @__PURE__ */ new Map();
    for (const record of records ?? []) {
      const ownerId = `${record.ownerId ?? ""}`.trim();
      if (ownerId) {
        result.set(ownerId, this.toDto(record));
      }
    }
    return result;
  }
  static toDtoPage(page) {
    return {
      items: this.toDtoList(page.items),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: page.nextCursor ?? null
    };
  }
  static withMetrics(dto, metrics) {
    return __spreadProps(__spreadValues({}, dto), {
      memberIds: [...dto.memberIds ?? []],
      members: this.cloneMembers(dto.members),
      supportCase: this.cloneSupportCase(dto.supportCase),
      metrics: this.cloneMetrics(metrics)
    });
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      memberIds: [...record.memberIds],
      members: this.cloneMembers(record.members),
      supportCase: this.cloneSupportCase(record.supportCase)
    });
  }
  static buildRecordKey(ownerUserId, sourceId) {
    return `${ownerUserId}:${sourceId}`;
  }
  static cloneSupportCase(supportCase) {
    return supportCase ? __spreadProps(__spreadValues({}, supportCase), {
      assignee: supportCase.assignee ? __spreadValues({}, supportCase.assignee) : supportCase.assignee
    }) : supportCase;
  }
  static cloneMetrics(metrics) {
    return metrics ? {
      members: metrics.members ? __spreadValues({}, metrics.members) : null,
      transport: metrics.transport ? __spreadValues({}, metrics.transport) : null,
      accommodation: metrics.accommodation ? __spreadValues({}, metrics.accommodation) : null,
      supplies: metrics.supplies ? __spreadValues({}, metrics.supplies) : null,
      groupsCount: metrics.groupsCount ?? null,
      pendingTotal: Math.max(0, Math.trunc(Number(metrics.pendingTotal) || 0))
    } : null;
  }
  static cloneMembers(members) {
    return members ? members.map((member) => __spreadValues({}, member)) : members;
  }
};

// src/app/shared/core/base/mappers/rate.mapper.ts
var BaseUserRatesMapper = class {
  static toRecord(ownerUserIdOrInput, item) {
    if (typeof ownerUserIdOrInput === "string") {
      return this.toActivityRateRecord(ownerUserIdOrInput, item);
    }
    switch (ownerUserIdOrInput.kind) {
      case "game-card":
        return this.toGameCardRateRecord(ownerUserIdOrInput);
      case "game-card-pair":
        return this.toGameCardPairRateRecord(ownerUserIdOrInput);
      case "activity-rate":
        return this.toActivityRateInputRecord(ownerUserIdOrInput);
      default:
        return null;
    }
  }
  static toActivityRateRecord(ownerUserId, item) {
    const normalizedOwnerUserId = ownerUserId.trim();
    const normalizedCounterpartyUserId = item.userId.trim();
    const normalizedSecondaryUserId = item.secondaryUserId?.trim() ?? "";
    const activityRateId = item.id.trim() || this.createRateId();
    const scoreGiven = this.normalizeRateScore(item.scoreGiven);
    const scoreReceived = this.normalizeRateScore(item.scoreReceived);
    let fromUserId = normalizedOwnerUserId;
    let toUserId = normalizedCounterpartyUserId;
    let rate = scoreGiven;
    if (item.mode === "pair" && normalizedSecondaryUserId && normalizedSecondaryUserId !== normalizedCounterpartyUserId) {
      fromUserId = normalizedCounterpartyUserId;
      toUserId = normalizedSecondaryUserId;
      rate = item.direction === "received" ? scoreReceived : scoreGiven;
    } else {
      if (item.direction === "received") {
        fromUserId = normalizedCounterpartyUserId;
        toUserId = normalizedOwnerUserId;
        rate = scoreReceived;
      } else if (item.direction === "met") {
        rate = 0;
      }
    }
    const happenedAtIso = item.happenedAt?.trim() || (/* @__PURE__ */ new Date()).toISOString();
    return {
      id: activityRateId,
      fromUserId,
      toUserId,
      rate,
      mode: item.mode === "pair" ? "pair" : "single",
      createdAtIso: happenedAtIso,
      updatedAtIso: happenedAtIso,
      ownerUserId: normalizedOwnerUserId,
      displayId: activityRateId,
      displayDirection: item.direction,
      socialContext: item.socialContext,
      bridgeUserId: item.bridgeUserId,
      bridgeCount: item.bridgeCount,
      scoreGiven,
      scoreReceived,
      eventName: item.eventName,
      happenedAtIso,
      distanceMetersExact: this.normalizeDistanceMetersExact(item.distanceMetersExact)
    };
  }
  static toGameCardRateRecord(input) {
    const normalizedRaterId = input.raterUserId.trim();
    const normalizedRatedUserId = input.ratedUserId.trim();
    const mode = input.mode === "pair" ? "pair" : "single";
    if (!normalizedRaterId || !normalizedRatedUserId || normalizedRaterId === normalizedRatedUserId) {
      return null;
    }
    const normalizedRating = this.normalizeRequiredRateScore(input.rating);
    if (!Number.isFinite(normalizedRating) || normalizedRating <= 0) {
      return null;
    }
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const normalizedSocialContext = this.normalizeRateSocialContext(mode, input.socialContext);
    const normalizedBridgeUserId = normalizedSocialContext === "friends-in-common" ? input.bridgeUserId?.trim() ?? "" : "";
    const normalizedBridgeCount = normalizedSocialContext === "friends-in-common" && Number.isFinite(Number(input.bridgeCount)) ? Math.max(1, Math.trunc(Number(input.bridgeCount))) : void 0;
    return this.toActivityRateRecord(normalizedRaterId, __spreadProps(__spreadValues(__spreadValues({
      id: `game-card:${normalizedRaterId}:${normalizedRatedUserId}`,
      userId: normalizedRatedUserId,
      mode: mode === "pair" ? "pair" : "individual",
      direction: "given",
      socialContext: normalizedSocialContext ?? void 0
    }, normalizedBridgeUserId ? { bridgeUserId: normalizedBridgeUserId } : {}), normalizedBridgeCount ? { bridgeCount: normalizedBridgeCount } : {}), {
      scoreGiven: normalizedRating,
      scoreReceived: 0,
      eventName: "Single rate",
      happenedAt: nowIso,
      distanceMetersExact: 0
    }));
  }
  static toGameCardPairRateRecord(input) {
    const normalizedOwnerUserId = input.raterUserId.trim();
    const normalizedFirstUserId = input.firstRatedUserId.trim();
    const normalizedSecondUserId = input.secondRatedUserId.trim();
    if (!normalizedOwnerUserId || !normalizedFirstUserId || !normalizedSecondUserId || normalizedFirstUserId === normalizedSecondUserId || normalizedFirstUserId === normalizedOwnerUserId || normalizedSecondUserId === normalizedOwnerUserId) {
      return null;
    }
    const normalizedRating = this.normalizeRequiredRateScore(input.rating);
    if (!Number.isFinite(normalizedRating) || normalizedRating <= 0) {
      return null;
    }
    const [fromUserId, toUserId] = [normalizedFirstUserId, normalizedSecondUserId].sort((left, right) => left.localeCompare(right));
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    return this.toActivityRateRecord(normalizedOwnerUserId, {
      id: `game-card-pair:${normalizedOwnerUserId}:${fromUserId}:${toUserId}`,
      userId: fromUserId,
      secondaryUserId: toUserId,
      mode: "pair",
      direction: "given",
      socialContext: this.normalizeRateSocialContext("pair", input.socialContext) ?? void 0,
      scoreGiven: normalizedRating,
      scoreReceived: 0,
      eventName: "Pair rate",
      happenedAt: nowIso,
      distanceMetersExact: 0
    });
  }
  static toActivityRateInputRecord(input) {
    const normalizedOwnerUserId = input.ownerUserId.trim();
    const normalizedUserId = input.item.userId.trim();
    if (!normalizedOwnerUserId || !normalizedUserId) {
      return null;
    }
    const nextDirection = this.normalizeRateDirection(input.direction ?? input.item.direction);
    if (!nextDirection) {
      return null;
    }
    return this.toActivityRateRecord(normalizedOwnerUserId, __spreadProps(__spreadValues({}, input.item), {
      userId: normalizedUserId,
      secondaryUserId: input.item.secondaryUserId?.trim() || void 0,
      direction: nextDirection,
      socialContext: input.item.socialContext,
      bridgeUserId: input.item.bridgeUserId?.trim() || void 0,
      bridgeCount: Number.isFinite(input.item.bridgeCount) ? Math.max(0, Math.trunc(Number(input.item.bridgeCount))) : void 0,
      scoreGiven: this.normalizeRequiredRateScore(input.rating),
      scoreReceived: this.normalizeOptionalRateScore(input.item.scoreReceived),
      eventName: input.item.eventName?.trim() || "Rate",
      happenedAt: input.item.happenedAt?.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      distanceMetersExact: Number.isFinite(input.item.distanceMetersExact) ? Math.max(0, Math.trunc(Number(input.item.distanceMetersExact))) : 0
    }));
  }
  static toDto(record) {
    const direction = record.displayDirection;
    const ownerUserId = record.ownerUserId?.trim() ?? "";
    if (!direction || !ownerUserId) {
      return null;
    }
    if (record.mode === "pair") {
      const firstUserId = record.fromUserId.trim();
      const secondUserId = record.toUserId.trim();
      if (!firstUserId || !secondUserId || firstUserId === secondUserId) {
        return null;
      }
      const socialContext = this.resolvePairSocialContext(record);
      if (direction === "received") {
        if (firstUserId === ownerUserId) {
          return {
            id: record.displayId?.trim() || record.id,
            userId: secondUserId,
            secondaryUserId: firstUserId,
            mode: "pair",
            direction,
            socialContext,
            bridgeUserId: record.bridgeUserId,
            bridgeCount: record.bridgeCount,
            scoreGiven: this.normalizeRateScore(record.scoreGiven),
            scoreReceived: this.normalizeRateScore(record.scoreReceived),
            eventName: record.eventName?.trim() || "Rate",
            happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
            distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
          };
        }
        if (secondUserId === ownerUserId) {
          return {
            id: record.displayId?.trim() || record.id,
            userId: firstUserId,
            secondaryUserId: secondUserId,
            mode: "pair",
            direction,
            socialContext,
            bridgeUserId: record.bridgeUserId,
            bridgeCount: record.bridgeCount,
            scoreGiven: this.normalizeRateScore(record.scoreGiven),
            scoreReceived: this.normalizeRateScore(record.scoreReceived),
            eventName: record.eventName?.trim() || "Rate",
            happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
            distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
          };
        }
      } else if (firstUserId === ownerUserId || secondUserId === ownerUserId) {
        return null;
      }
      return {
        id: record.displayId?.trim() || record.id,
        userId: firstUserId,
        secondaryUserId: secondUserId,
        mode: "pair",
        direction,
        socialContext,
        bridgeUserId: record.bridgeUserId,
        bridgeCount: record.bridgeCount,
        scoreGiven: this.normalizeRateScore(record.scoreGiven),
        scoreReceived: this.normalizeRateScore(record.scoreReceived),
        eventName: record.eventName?.trim() || "Rate",
        happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
        distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
      };
    }
    const counterpartyUserId = record.fromUserId === ownerUserId ? record.toUserId : record.fromUserId;
    return {
      id: record.displayId?.trim() || record.id,
      userId: counterpartyUserId,
      mode: "individual",
      direction,
      socialContext: record.socialContext,
      bridgeUserId: record.bridgeUserId,
      bridgeCount: record.bridgeCount,
      scoreGiven: this.normalizeRateScore(record.scoreGiven),
      scoreReceived: this.normalizeRateScore(record.scoreReceived),
      eventName: record.eventName?.trim() || "Rate",
      happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
      distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
    };
  }
  static toSyncPayload(record) {
    const id = record.id?.trim() ?? "";
    const fromUserId = record.fromUserId?.trim() ?? "";
    const toUserId = record.toUserId?.trim() ?? "";
    const mode = record.mode === "pair" ? "pair" : record.mode === "single" ? "single" : null;
    if (!id || !fromUserId || !toUserId || !mode || fromUserId === toUserId) {
      return null;
    }
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const createdAtIso = record.createdAtIso?.trim() || record.happenedAtIso?.trim() || record.updatedAtIso?.trim() || nowIso;
    const updatedAtIso = record.updatedAtIso?.trim() || createdAtIso;
    const payload = {
      id,
      fromUserId,
      toUserId,
      rate: this.normalizeOptionalRateScore(record.rate),
      mode,
      createdAtIso,
      updatedAtIso
    };
    const ownerUserId = record.ownerUserId?.trim() ?? "";
    if (ownerUserId) {
      payload.ownerUserId = ownerUserId;
    }
    const displayId = record.displayId?.trim() ?? "";
    if (displayId) {
      payload.displayId = displayId;
    }
    const displayDirection = this.normalizeRateDirection(record.displayDirection);
    if (displayDirection) {
      payload.displayDirection = displayDirection;
    }
    const socialContext = this.normalizeRateSocialContext(mode, record.socialContext);
    if (socialContext) {
      payload.socialContext = socialContext;
    }
    const bridgeUserId = record.bridgeUserId?.trim() ?? "";
    if (bridgeUserId) {
      payload.bridgeUserId = bridgeUserId;
    }
    if (Number.isFinite(Number(record.bridgeCount))) {
      payload.bridgeCount = Math.max(0, Math.trunc(Number(record.bridgeCount)));
    }
    payload.scoreGiven = this.normalizeOptionalRateScore(record.scoreGiven);
    payload.scoreReceived = this.normalizeOptionalRateScore(record.scoreReceived);
    const eventName = record.eventName?.trim() ?? "";
    if (eventName) {
      payload.eventName = eventName;
    }
    const happenedAtIso = record.happenedAtIso?.trim() ?? "";
    if (happenedAtIso) {
      payload.happenedAtIso = happenedAtIso;
    }
    if (Number.isFinite(Number(record.distanceMetersExact))) {
      payload.distanceMetersExact = Math.max(0, Math.trunc(Number(record.distanceMetersExact)));
    }
    return payload;
  }
  static normalizeRateDirection(direction) {
    if (direction === "given" || direction === "received" || direction === "mutual" || direction === "met") {
      return direction;
    }
    return null;
  }
  static normalizeRateScore(value) {
    if (!Number.isFinite(Number(value))) {
      return 0;
    }
    return Math.max(0, Math.min(10, Math.trunc(Number(value))));
  }
  static normalizeOptionalRateScore(value) {
    if (!Number.isFinite(Number(value))) {
      return 0;
    }
    return Math.max(0, Math.min(10, Math.trunc(Number(value))));
  }
  static normalizeRequiredRateScore(value) {
    return Math.max(1, Math.min(10, Math.trunc(Number(value) || 0)));
  }
  static normalizeRateSocialContext(mode, value) {
    if (mode === "single") {
      return value === "friends-in-common" ? "friends-in-common" : null;
    }
    return value === "separated-friends" ? "separated-friends" : null;
  }
  static createRateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `rate-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
  static resolvePairSocialContext(record) {
    return record.socialContext;
  }
  static normalizeDistanceMetersExact(value) {
    if (Number.isFinite(Number(value))) {
      return Math.max(0, Math.trunc(Number(value)));
    }
    return 0;
  }
};

// src/app/shared/core/local/source/mappers/rate.mapper.ts
var LocalUserRatesMapper = class {
  static toRecord(ownerUserIdOrInput, item) {
    return typeof ownerUserIdOrInput === "string" ? BaseUserRatesMapper.toRecord(ownerUserIdOrInput, item) : BaseUserRatesMapper.toRecord(ownerUserIdOrInput);
  }
  static toDto(record) {
    return BaseUserRatesMapper.toDto(record);
  }
};
var LocalUserFilterPreferencesMapper = class {
  static toDto(record) {
    return this.clone(record);
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toRecord(dto) {
    return this.clone(dto);
  }
  static toRecordList(dtos) {
    return dtos.map((dto) => this.toRecord(dto));
  }
  static clone(preferences) {
    return __spreadProps(__spreadValues({}, preferences), {
      interests: [...preferences.interests ?? []],
      values: [...preferences.values ?? []],
      physiques: [...preferences.physiques ?? []],
      languages: [...preferences.languages ?? []],
      genders: [...preferences.genders ?? []],
      horoscopes: [...preferences.horoscopes ?? []],
      traitLabels: [...preferences.traitLabels ?? []],
      smoking: [...preferences.smoking ?? []],
      drinking: [...preferences.drinking ?? []],
      workout: [...preferences.workout ?? []],
      pets: [...preferences.pets ?? []],
      familyPlans: [...preferences.familyPlans ?? []],
      children: [...preferences.children ?? []],
      loveStyles: [...preferences.loveStyles ?? []],
      communicationStyles: [...preferences.communicationStyles ?? []],
      sexualOrientations: [...preferences.sexualOrientations ?? []],
      religions: [...preferences.religions ?? []]
    });
  }
};

// src/app/shared/core/local/source/mappers/contacts.mapper.ts
var LocalContactsMapper = class {
  static toStoredContact(value) {
    if (!value) {
      return null;
    }
    const id = `${value.id ?? ""}`.trim();
    const userId = `${value.userId ?? ""}`.trim();
    if (!id && !userId) {
      return null;
    }
    return {
      id: id || userId,
      userId,
      name: `${value.name ?? ""}`.trim() || "Contact",
      initials: `${value.initials ?? ""}`.trim(),
      gender: value.gender === "woman" ? "woman" : "man",
      city: `${value.city ?? ""}`.trim(),
      avatarUrl: `${value.avatarUrl ?? ""}`.trim(),
      headline: `${value.headline ?? ""}`.trim(),
      createdAtIso: `${value.createdAtIso ?? ""}`.trim(),
      updatedAtIso: `${value.updatedAtIso ?? ""}`.trim(),
      methods: (value.methods ?? []).map((method) => this.toMethodDraft(method)).filter((method) => Boolean(method))
    };
  }
  static toStoredContacts(values) {
    return values.map((value) => this.toStoredContact(value)).filter((contact) => Boolean(contact));
  }
  static cloneContacts(contacts) {
    return contacts.map((contact) => __spreadProps(__spreadValues({}, contact), {
      methods: contact.methods.map((method) => __spreadValues({}, method))
    }));
  }
  static toMethodDraft(value) {
    if (!value) {
      return null;
    }
    const type = `${value.type ?? ""}`.trim();
    const methodType = [
      "phone",
      "sms",
      "whatsapp",
      "email",
      "facebook",
      "instagram",
      "telegram",
      "linkedin",
      "website"
    ].includes(type) ? type : "phone";
    const methodValue = `${value.value ?? ""}`.trim();
    if (!methodValue) {
      return null;
    }
    return {
      id: `${value.id ?? ""}`.trim(),
      type: methodType,
      value: methodValue
    };
  }
};

// src/app/shared/core/local/source/mappers/idea-post.mapper.ts
var LocalIdeaPostsMapper = class {
  static IMAGE_LIMIT = 24;
  static toDto(record) {
    const contentHtml = this.normalizeHtml(record.contentHtml);
    const imageUrls = this.imageUrls(record.imageUrls, record.imageUrl);
    return __spreadProps(__spreadValues({}, record), {
      id: `${record.id ?? ""}`.trim(),
      contentKey: this.contentKey(record.contentKey, record.id),
      lang: this.normalizeLang(record.lang),
      languageLabel: this.languageLabel(record.lang),
      title: `${record.title ?? ""}`.trim() || "Untitled idea",
      excerpt: this.excerpt(record.excerpt, contentHtml),
      contentHtml,
      imageUrl: `${record.imageUrl ?? ""}`.trim() || imageUrls[0] || "",
      imageUrls,
      featured: record.featured === true,
      published: record.published !== false,
      trashed: record.trashed === true,
      trashedAtIso: `${record.trashedAtIso ?? ""}`.trim(),
      trashedByUserId: `${record.trashedByUserId ?? ""}`.trim(),
      submittedAtIso: `${record.submittedAtIso ?? ""}`.trim() || `${record.updatedAtIso ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      createdAtIso: `${record.createdAtIso ?? ""}`.trim(),
      createdByUserId: `${record.createdByUserId ?? ""}`.trim(),
      updatedAtIso: `${record.updatedAtIso ?? record.createdAtIso ?? ""}`.trim(),
      updatedByUserId: `${record.updatedByUserId ?? record.createdByUserId ?? ""}`.trim()
    });
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toDtoPage(page) {
    return {
      records: this.toDtoList(page.records),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null
    };
  }
  static toAdminDtoPage(page) {
    return {
      records: this.toDtoList(page.records),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null,
      counts: {
        all: Math.max(0, Math.trunc(Number(page.counts.all) || 0)),
        featured: Math.max(0, Math.trunc(Number(page.counts.featured) || 0)),
        published: Math.max(0, Math.trunc(Number(page.counts.published) || 0)),
        drafts: Math.max(0, Math.trunc(Number(page.counts.drafts) || 0)),
        trashed: Math.max(0, Math.trunc(Number(page.counts.trashed) || 0))
      }
    };
  }
  static toRecord(request, options) {
    const lang = this.normalizeLang(request.lang);
    const contentHtml = this.normalizeHtml(request.contentHtml);
    const imageUrls = this.imageUrls(request.imageUrls, request.imageUrl);
    const actorUserId = `${request.actorUserId ?? ""}`.trim() || "admin";
    return {
      id: options.id,
      contentKey: this.contentKey(request.contentKey, options.id),
      lang,
      languageLabel: this.languageLabel(lang),
      title: `${request.title ?? ""}`.trim() || "Untitled idea",
      excerpt: this.excerpt(request.excerpt, contentHtml),
      contentHtml,
      imageUrl: `${request.imageUrl ?? ""}`.trim() || imageUrls[0] || "",
      imageUrls,
      featured: request.featured === true,
      published: request.published !== false,
      trashed: false,
      trashedAtIso: "",
      trashedByUserId: "",
      submittedAtIso: this.submittedAtIso(request.submittedAtIso),
      createdAtIso: options.nowIso,
      createdByUserId: actorUserId,
      updatedAtIso: options.nowIso,
      updatedByUserId: actorUserId
    };
  }
  static normalizeHtml(value) {
    return `${value ?? ""}`.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "").replace(/\s(?:href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, "").trim();
  }
  static excerpt(explicitExcerpt, contentHtml) {
    const value = `${explicitExcerpt ?? ""}`.trim() || this.htmlToText(contentHtml);
    const normalized = value.replace(/\s+/g, " ").trim();
    return normalized.length <= 180 ? normalized : `${normalized.slice(0, 179).trim()}...`;
  }
  static htmlToText(value) {
    if (typeof document === "undefined") {
      return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    const template = document.createElement("template");
    template.innerHTML = value;
    return `${template.content.textContent ?? ""}`.replace(/\s+/g, " ").trim();
  }
  static normalizeLang(lang) {
    return `${lang ?? ""}`.trim().toLowerCase().split("-")[0] === "hu" ? "hu" : "en";
  }
  static languageLabel(lang) {
    return this.normalizeLang(lang) === "hu" ? "Magyar" : "English";
  }
  static contentKey(value, fallbackId) {
    const normalized = `${value ?? ""}`.trim() || fallbackId.trim();
    return normalized.endsWith("-hu") ? normalized.slice(0, -3) : normalized;
  }
  static imageUrls(imageUrls, primaryImageUrl) {
    const urls = /* @__PURE__ */ new Set();
    const primary = `${primaryImageUrl ?? ""}`.trim();
    if (primary) {
      urls.add(primary);
    }
    for (const value of imageUrls ?? []) {
      const normalized = `${value ?? ""}`.trim();
      if (normalized) {
        urls.add(normalized);
      }
      if (urls.size >= this.IMAGE_LIMIT) {
        break;
      }
    }
    return [...urls];
  }
  static submittedAtIso(requested) {
    const normalized = `${requested ?? ""}`.trim();
    if (!normalized) {
      return "";
    }
    const parsed = Date.parse(normalized);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : normalized;
  }
};

// src/app/shared/core/local/source/mappers/asset.mapper.ts
var LocalAssetsMapper = class {
  static cloneCards(cards) {
    return AssetCardBuilder.cloneCards(cards);
  }
  static normalizeCards(cards) {
    return cards.map((card) => this.normalizeCard(card)).filter((card) => Boolean(card));
  }
  static normalizeCard(card) {
    const id = card?.id?.trim() ?? "";
    if (!id) {
      return null;
    }
    const type = card?.type;
    if (!isAssetType(type)) {
      return null;
    }
    const requests = this.normalizeRequests(card?.requests);
    return {
      id,
      type,
      title: card?.title?.trim() ?? "",
      subtitle: card?.subtitle?.trim() ?? "",
      category: AssetDefaultsBuilder.normalizeCategory(type, card?.category),
      city: card?.city?.trim() ?? "",
      capacityTotal: AssetCardBuilder.capacityValue({ capacityTotal: card?.capacityTotal ?? 0 }),
      quantity: AssetCardBuilder.storedQuantityValue({
        type,
        quantity: card?.quantity,
        capacityTotal: card?.capacityTotal ?? 0
      }),
      description: this.assetDescription(card),
      imageUrl: card?.imageUrl?.trim() ?? "",
      locationLabel: this.assetLocationLabel(card, type),
      priceLabel: this.assetPriceLabel(card),
      policyCount: this.assetPolicyCount(card),
      visibility: card?.visibility === "Friends only" ? "Friends only" : card?.visibility === "Invitation only" ? "Invitation only" : "Public",
      status: this.normalizeAssetStatus(card?.status),
      ownerUserId: `${card?.ownerUserId ?? ""}`.trim() || void 0,
      ownerName: `${card?.ownerName ?? ""}`.trim() || void 0,
      ownerAvatarUrl: `${card?.ownerAvatarUrl ?? ""}`.trim() || null,
      ownerReleasedAtIso: `${card?.ownerReleasedAtIso ?? ""}`.trim() || null,
      menuActions: Array.isArray(card?.menuActions) ? card.menuActions.map((action) => `${action ?? ""}`.trim()).filter((action) => action.length > 0) : [],
      requests,
      metrics: this.assetRequestMetrics(card?.metrics)
    };
  }
  static normalizeBorrowWindow(window) {
    const eventId = `${window?.eventId ?? ""}`.trim();
    const subEventId = `${window?.subEventId ?? ""}`.trim();
    const startAtIso = `${window?.startAtIso ?? ""}`.trim();
    const endAtIso = `${window?.endAtIso ?? ""}`.trim();
    return eventId && subEventId && startAtIso && endAtIso ? { eventId, subEventId, startAtIso, endAtIso } : null;
  }
  static fallbackAssetDto(card) {
    const requests = this.normalizeRequests(card.requests);
    return this.normalizeCard(card) ?? {
      id: `${card.id ?? ""}`.trim(),
      type: isAssetType(card.type) ? card.type : ASSET_TYPE_TRANSPORT,
      title: `${card.title ?? ""}`.trim(),
      subtitle: `${card.subtitle ?? ""}`.trim(),
      category: AssetDefaultsBuilder.normalizeCategory(card.type, card.category),
      city: `${card.city ?? ""}`.trim(),
      capacityTotal: AssetCardBuilder.capacityValue({ capacityTotal: card.capacityTotal ?? 0 }),
      quantity: AssetCardBuilder.storedQuantityValue({
        type: isAssetType(card.type) ? card.type : ASSET_TYPE_TRANSPORT,
        quantity: card.quantity,
        capacityTotal: card.capacityTotal ?? 0
      }),
      description: this.assetDescription(card),
      imageUrl: `${card.imageUrl ?? ""}`.trim(),
      sourceLink: `${card.sourceLink ?? ""}`.trim(),
      visibility: card.visibility,
      status: this.normalizeAssetStatus(card.status),
      ownerUserId: `${card.ownerUserId ?? ""}`.trim() || void 0,
      ownerName: `${card.ownerName ?? ""}`.trim() || void 0,
      ownerAvatarUrl: `${card.ownerAvatarUrl ?? ""}`.trim() || null,
      ownerReleasedAtIso: `${card.ownerReleasedAtIso ?? ""}`.trim() || null,
      requests,
      metrics: this.assetRequestMetrics(card.metrics),
      menuActions: Array.isArray(card.menuActions) ? [...card.menuActions] : void 0
    };
  }
  static normalizeDetail(card) {
    const id = card?.id?.trim() ?? "";
    if (!id) {
      return null;
    }
    const type = card?.type;
    if (!isAssetType(type)) {
      return null;
    }
    const requests = this.normalizeRequests(card?.requests);
    return {
      id,
      type,
      title: card?.title?.trim() ?? "",
      subtitle: card?.subtitle?.trim() ?? "",
      category: AssetDefaultsBuilder.normalizeCategory(type, card?.category),
      city: card?.city?.trim() ?? "",
      capacityTotal: AssetCardBuilder.capacityValue({ capacityTotal: card?.capacityTotal ?? 0 }),
      quantity: AssetCardBuilder.storedQuantityValue({
        type,
        quantity: card?.quantity,
        capacityTotal: card?.capacityTotal ?? 0
      }),
      details: card?.details?.trim() ?? "",
      imageUrl: card?.imageUrl?.trim() ?? "",
      sourceLink: card?.sourceLink?.trim() ?? "",
      routes: Array.isArray(card?.routes) ? card.routes.map((route) => `${route ?? ""}`.trim()).filter((route) => route.length > 0) : [],
      topics: Array.isArray(card?.topics) ? card.topics.map((topic) => `${topic ?? ""}`.trim()).filter((topic) => topic.length > 0) : [],
      policiesEnabled: AssetCardBuilder.assetPoliciesEnabled(card),
      policies: Array.isArray(card?.policies) ? card.policies.map((item) => ({
        id: `${item?.id ?? ""}`.trim(),
        title: `${item?.title ?? ""}`.trim(),
        description: `${item?.description ?? ""}`.trim(),
        required: item?.required !== false
      })).filter((item) => item.id || item.title || item.description) : [],
      pricing: PricingBuilder.normalizePricingConfig(card?.pricing, { context: "asset" }),
      visibility: card?.visibility === "Friends only" ? "Friends only" : card?.visibility === "Invitation only" ? "Invitation only" : "Public",
      status: this.normalizeAssetStatus(card?.status),
      ownerUserId: `${card?.ownerUserId ?? ""}`.trim() || void 0,
      ownerName: `${card?.ownerName ?? ""}`.trim() || void 0,
      ownerAvatarUrl: `${card?.ownerAvatarUrl ?? ""}`.trim() || null,
      ownerReleasedAtIso: `${card?.ownerReleasedAtIso ?? ""}`.trim() || null,
      menuActions: Array.isArray(card?.menuActions) ? card.menuActions.map((action) => `${action ?? ""}`.trim()).filter((action) => action.length > 0) : [],
      borrowWindow: this.normalizeBorrowWindow(card?.borrowWindow),
      requests,
      metrics: this.assetRequestMetrics(card?.metrics)
    };
  }
  static normalizeAssetStatus(status) {
    return AssetCardBuilder.normalizeAssetStatus(status);
  }
  static restoredAssetStatus(card) {
    return AssetCardBuilder.restoredAssetStatus(card);
  }
  static cloneRequest(request) {
    return AssetCardBuilder.cloneRequest(request);
  }
  static toAssetDto(record, options = {}) {
    const viewerUserId = options.viewerUserId?.trim() ?? "";
    return {
      id: record.id,
      type: record.type,
      title: record.title,
      subtitle: record.subtitle,
      category: AssetDefaultsBuilder.normalizeCategory(record.type, record.category),
      city: record.city,
      capacityTotal: record.capacityTotal,
      quantity: AssetCardBuilder.storedQuantityValue({
        type: record.type,
        quantity: record.quantity,
        capacityTotal: record.capacityTotal
      }),
      description: record.details,
      imageUrl: record.imageUrl,
      sourceLink: record.sourceLink,
      locationLabel: record.type === ASSET_TYPE_ACCOMMODATION ? (record.routes ?? []).map((route) => route.trim()).find(Boolean) ?? record.city : record.city,
      priceLabel: this.assetPriceLabelFromRecord(record),
      policiesEnabled: record.policiesEnabled === true,
      policyCount: record.policiesEnabled === true ? (record.policies ?? []).length : 0,
      visibility: record.visibility,
      status: this.normalizeAssetStatus(record.status),
      ownerUserId: record.ownerUserId,
      ownerName: record.ownerName,
      requests: record.requests.filter((request) => request.recordStatus !== "D").map((request) => {
        const dto = this.cloneRequest(request);
        return __spreadProps(__spreadValues({}, dto), {
          menuActions: options.resolveRequestMenuActions?.(record, dto, viewerUserId) ?? dto.menuActions ?? []
        });
      }),
      metrics: this.assetRequestMetrics(options.requestMetrics),
      menuActions: options.resolveMenuActions?.(record, viewerUserId) ?? [...record.menuActions ?? []]
    };
  }
  static toAssetDtos(records, options = {}) {
    return records.map((record) => this.toAssetDto(record, options));
  }
  static toAssetDetailDto(record, options = {}) {
    const viewerUserId = options.viewerUserId?.trim() ?? "";
    return {
      id: record.id,
      type: record.type,
      title: record.title,
      subtitle: record.subtitle,
      category: AssetDefaultsBuilder.normalizeCategory(record.type, record.category),
      city: record.city,
      capacityTotal: record.capacityTotal,
      quantity: AssetCardBuilder.storedQuantityValue({
        type: record.type,
        quantity: record.quantity,
        capacityTotal: record.capacityTotal
      }),
      details: record.details,
      imageUrl: record.imageUrl,
      sourceLink: record.sourceLink,
      routes: [...record.routes ?? []],
      topics: [...record.topics ?? []],
      policiesEnabled: record.policiesEnabled === true,
      policies: (record.policies ?? []).map((item) => __spreadValues({}, item)),
      pricing: record.pricing ? PricingBuilder.clonePricingConfig(record.pricing) : void 0,
      visibility: record.visibility,
      status: this.normalizeAssetStatus(record.status),
      ownerUserId: record.ownerUserId,
      ownerName: record.ownerName,
      requests: record.requests.filter((request) => request.recordStatus !== "D").map((request) => {
        const dto = this.cloneRequest(request);
        return __spreadProps(__spreadValues({}, dto), {
          menuActions: options.resolveRequestMenuActions?.(record, dto, viewerUserId) ?? dto.menuActions ?? []
        });
      }),
      metrics: this.assetRequestMetrics(options.requestMetrics),
      menuActions: options.resolveMenuActions?.(record, viewerUserId) ?? [...record.menuActions ?? []]
    };
  }
  static toAssetAvailabilityDtoPage(page) {
    return {
      items: page.records.map((record) => this.toAssetAvailabilityRowDto(record)),
      total: page.total,
      nextCursor: page.nextCursor
    };
  }
  static toAssetAvailabilityStatDtoPage(page) {
    return {
      items: page.records.map((record) => this.toAssetAvailabilityStatDto(record)),
      total: page.total,
      nextCursor: page.nextCursor
    };
  }
  static toAssetAvailabilityStatDto(record) {
    const day = AppUtils.dateOnly(record.date);
    const nextDay = AppUtils.addDays(day, 1);
    const overlapping = record.requests.filter((request) => this.assetRequestDateRangeOverlaps(request, day, nextDay));
    const occupied = overlapping.filter((request) => this.isCommittedAssetRequest(request)).reduce((sum, request) => sum + this.assetRequestOccupancyCount(request), 0);
    const pending = overlapping.filter((request) => this.isPendingAssetRequest(request));
    const pendingQuantity = pending.reduce((sum, request) => sum + this.assetRequestQuantity(request), 0);
    const dateIso = AppUtils.dateKey(day);
    return {
      id: `${record.assetId}:${dateIso}`,
      assetId: record.assetId,
      ownerUserId: record.ownerUserId,
      dateIso,
      startAtIso: AppUtils.toIsoDateTimeLocal(day),
      endAtIso: AppUtils.toIsoDateTimeLocal(nextDay),
      occupied,
      capacity: Math.max(0, Math.trunc(Number(record.assetCapacity) || 0)),
      pendingCount: pending.length,
      pendingQuantity,
      itemCount: overlapping.length
    };
  }
  static toAssetAvailabilityRowDto(record) {
    const request = record.request;
    const requestRange = this.assetRequestDateRange(request);
    const status = request.requestKind === "manual" ? "assigned" : request.status;
    const overlappingCommitted = record.requests.filter((other) => this.isCommittedAssetRequest(other)).filter((other) => {
      if (record.dateRange) {
        return this.assetRequestDateRangeOverlaps(other, record.dateRange.start, record.dateRange.end);
      }
      return this.assetRequestsOverlap(request, other);
    }).reduce((sum, other) => sum + this.assetRequestOccupancyCount(other), 0);
    const pendingCurrentQuantity = this.isCommittedAssetRequest(request) ? 0 : this.assetRequestQuantity(request);
    const capacity = Math.max(0, Math.trunc(Number(request.assetCapacity) || 0));
    const pendingForWindow = record.requests.filter((other) => this.isPendingAssetRequest(other)).filter((other) => {
      if (record.dateRange) {
        return this.assetRequestDateRangeOverlaps(other, record.dateRange.start, record.dateRange.end);
      }
      return this.assetRequestsOverlap(request, other);
    });
    return {
      id: this.sourceAssetRequestId(request),
      assetId: request.assetId,
      ownerUserId: request.ownerUserId,
      userId: request.userId,
      isManager: (request.menuActions ?? []).includes("revokeManager"),
      dateIso: requestRange ? AppUtils.dateKey(requestRange.start) : "",
      startAtIso: request.booking?.startAtIso,
      endAtIso: request.booking?.endAtIso,
      title: request.name,
      subtitle: [
        `${request.booking?.eventTitle ?? ""}`.trim(),
        `${request.booking?.subEventTitle ?? ""}`.trim()
      ].filter(Boolean).join(" \xB7 ") || void 0,
      detail: this.visibleAssetRequestNote(request),
      scheduleLabel: this.assetRequestScheduleLabel(request),
      avatarInitials: request.initials,
      gender: request.gender,
      status,
      requestKind: request.requestKind ?? "borrow",
      quantity: this.assetRequestQuantity(request),
      occupied: overlappingCommitted,
      capacity,
      remaining: capacity - overlappingCommitted - pendingCurrentQuantity,
      pendingCount: pendingForWindow.length,
      pendingQuantity: pendingForWindow.reduce((sum, other) => sum + this.assetRequestQuantity(other), 0),
      eventId: `${request.booking?.eventId ?? ""}`.trim() || void 0,
      eventTitle: `${request.booking?.eventTitle ?? ""}`.trim() || void 0,
      subEventId: `${request.booking?.subEventId ?? ""}`.trim() || void 0,
      subEventTitle: `${request.booking?.subEventTitle ?? ""}`.trim() || void 0,
      subEventStartAtIso: `${request.booking?.startAtIso ?? ""}`.trim() || void 0,
      subEventEndAtIso: `${request.booking?.endAtIso ?? ""}`.trim() || void 0,
      menuActions: this.assetRequestMenuActions(request)
    };
  }
  static sourceAssetRequestId(request) {
    const requestId = `${request.requestId ?? ""}`.trim();
    if (requestId) {
      return requestId;
    }
    const projectionId = `${request.id ?? ""}`.trim();
    const prefix = `${request.assetId ?? ""}`.trim() + ":request:";
    return projectionId.startsWith(prefix) ? projectionId.slice(prefix.length).trim() : projectionId;
  }
  static assetRequestsOverlap(left, right) {
    if (left.id === right.id) {
      return true;
    }
    const leftRange = this.assetRequestDateRange(left);
    const rightRange = this.assetRequestDateRange(right);
    if (leftRange && rightRange) {
      return leftRange.start.getTime() < rightRange.end.getTime() && rightRange.start.getTime() < leftRange.end.getTime();
    }
    const leftWindow = this.assetRequestWindowKey(left);
    const rightWindow = this.assetRequestWindowKey(right);
    return Boolean(leftWindow && rightWindow && leftWindow === rightWindow);
  }
  static assetRequestDateRangeOverlaps(request, start, end) {
    const range = this.assetRequestDateRange(request);
    return range ? range.start.getTime() < end.getTime() && start.getTime() < range.end.getTime() : false;
  }
  static assetRequestDateRange(request) {
    const start = this.parseAssetRequestDate(request.booking?.startAtIso ?? request.requestedAtIso);
    if (!start) {
      return null;
    }
    const parsedEnd = this.parseAssetRequestDate(request.booking?.endAtIso);
    const end = parsedEnd && parsedEnd.getTime() > start.getTime() ? parsedEnd : AppUtils.addDays(start, 1);
    return { start, end };
  }
  static assetRequestWindowKey(request) {
    return [
      `${request.booking?.eventId ?? ""}`.trim(),
      `${request.booking?.subEventId ?? ""}`.trim(),
      `${request.booking?.slotLabel ?? ""}`.trim(),
      `${request.booking?.timeframe ?? ""}`.trim()
    ].filter(Boolean).join("|");
  }
  static parseAssetRequestDate(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized) {
      return null;
    }
    return AppUtils.isoLocalDateTimeToDate(normalized) ?? AppUtils.parseDate(normalized);
  }
  static isCommittedAssetRequest(request) {
    return request.status === "accepted" || request.requestKind === "manual";
  }
  static isPendingAssetRequest(request) {
    return request.status === "pending" && request.requestKind !== "manual";
  }
  static assetRequestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 1));
  }
  static assetRequestOccupancyCount(request) {
    return request.requestKind === "manual" ? 1 : this.assetRequestQuantity(request);
  }
  static visibleAssetRequestNote(request) {
    const note = `${request.note ?? ""}`.trim();
    if (!note || this.isSystemAssetRequestNote(note)) {
      return void 0;
    }
    return note;
  }
  static isSystemAssetRequestNote(note) {
    return note === "Awaiting owner confirmation." || note === "Approved and synced with the plan." || note === "Reserved and assigned by the owner." || note === "Borrow request approved by the owner." || note === "Promoted to asset manager.";
  }
  static assetRequestScheduleLabel(request) {
    const start = this.parseAssetRequestDate(request.booking?.startAtIso);
    const end = this.parseAssetRequestDate(request.booking?.endAtIso);
    if (start && end) {
      return this.formatAssetRequestDateRange(start, end);
    }
    return `${request.booking?.timeframe ?? request.booking?.slotLabel ?? ""}`.trim() || void 0;
  }
  static formatAssetRequestDateRange(start, end) {
    const sameDay = AppUtils.dateKey(start) === AppUtils.dateKey(end);
    const startDate = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endDate = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return sameDay ? `${startDate} ${startTime} - ${endTime}` : `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  static assetRequestMenuActions(request) {
    if (this.isPendingAssetRequest(request)) {
      const scopedBorrow2 = request.requestKind === "borrow" && Boolean(request.booking?.eventId) && Boolean(request.booking?.subEventId);
      return !scopedBorrow2 && (request.menuActions ?? []).includes("makeManager") ? ["accept", "makeManager", "remove"] : ["accept", "remove"];
    }
    if (request.requestKind === "manual") {
      return request.booking?.eventId && request.booking?.subEventId ? ["manage"] : [];
    }
    const scopedBorrow = request.requestKind === "borrow" && Boolean(request.booking?.eventId) && Boolean(request.booking?.subEventId);
    return !scopedBorrow && (request.menuActions ?? []).includes("makeManager") ? ["makeManager"] : [];
  }
  static normalizedCount(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
  }
  static toAssetRequestMetrics(requests) {
    const rows = (requests ?? []).filter((request) => this.isLaterAssetRequestMetric(request));
    const assignedItems = rows.filter((request) => request.requestKind === "manual").length;
    const borrowedItems = rows.filter((request) => request.status === "accepted" && request.requestKind !== "manual").length;
    const pendingItems = rows.filter((request) => request.status === "pending" && request.requestKind !== "manual").length;
    const activeItems = assignedItems + borrowedItems;
    return {
      allItems: activeItems + pendingItems,
      activeItems,
      assignedItems,
      borrowedItems,
      pendingItems
    };
  }
  static isLaterAssetRequestMetric(request) {
    const end = this.assetRequestDateRange(request)?.end ?? this.parseAssetRequestDate(request.requestedAtIso);
    return end !== null && end.getTime() >= Date.now();
  }
  static assetRequestMetrics(metrics) {
    if (metrics) {
      return {
        allItems: this.normalizedCount(metrics.allItems),
        activeItems: this.normalizedCount(metrics.activeItems),
        assignedItems: this.normalizedCount(metrics.assignedItems),
        borrowedItems: this.normalizedCount(metrics.borrowedItems),
        pendingItems: this.normalizedCount(metrics.pendingItems)
      };
    }
    return this.emptyAssetRequestMetrics();
  }
  static emptyAssetRequestMetrics() {
    return {
      allItems: 0,
      activeItems: 0,
      assignedItems: 0,
      borrowedItems: 0,
      pendingItems: 0
    };
  }
  static toAssetRecord(asset, ownerUserId) {
    const summary = this.normalizeCard(asset);
    if (!summary) {
      return null;
    }
    const detail = "details" in asset ? this.normalizeDetail(asset) : null;
    const now = /* @__PURE__ */ new Date();
    const nowMs = now.getTime();
    return {
      id: summary.id,
      type: summary.type,
      title: summary.title,
      subtitle: summary.subtitle,
      category: summary.category,
      city: summary.city,
      capacityTotal: summary.capacityTotal,
      quantity: summary.quantity,
      details: detail?.details ?? summary.description,
      imageUrl: summary.imageUrl,
      sourceLink: detail?.sourceLink ?? summary.sourceLink ?? "",
      routes: detail?.routes ? [...detail.routes] : [],
      topics: detail?.topics ? [...detail.topics] : [],
      policiesEnabled: detail?.policiesEnabled === true,
      policies: detail?.policies ? detail.policies.map((item) => __spreadValues({}, item)) : [],
      pricing: detail?.pricing ? PricingBuilder.clonePricingConfig(detail.pricing) : detail?.pricing,
      visibility: summary.visibility ?? "Public",
      status: summary.status ?? "A",
      statusBeforeSuppression: null,
      ownerUserId: `${summary.ownerUserId ?? ""}`.trim() || ownerUserId.trim(),
      ownerName: summary.ownerName,
      ownerReleasedAtIso: summary.ownerReleasedAtIso ?? null,
      requests: this.normalizeRequests(summary.requests),
      menuActions: [...summary.menuActions ?? []],
      createdAtIso: now.toISOString(),
      updatedAtIso: now.toISOString(),
      createdMs: nowMs,
      updatedMs: nowMs
    };
  }
  static normalizeRequests(requests) {
    return Array.isArray(requests) ? requests.map((request) => __spreadProps(__spreadValues({}, request), {
      id: `${request?.id ?? ""}`.trim(),
      userId: `${request?.userId ?? ""}`.trim() || void 0,
      name: `${request?.name ?? ""}`.trim(),
      initials: `${request?.initials ?? ""}`.trim(),
      gender: request?.gender === "woman" ? "woman" : "man",
      status: request?.status === "accepted" ? "accepted" : "pending",
      note: `${request?.note ?? ""}`.trim(),
      requestKind: request?.requestKind === "manual" ? "manual" : request?.requestKind === "invite" ? "invite" : "borrow",
      requestedAtIso: `${request?.requestedAtIso ?? ""}`.trim() || void 0,
      menuActions: Array.isArray(request?.menuActions) ? request.menuActions.map((action) => `${action ?? ""}`.trim()).filter((action) => action.length > 0) : [],
      booking: request?.booking ? __spreadProps(__spreadValues({}, request.booking), {
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null
    })).filter((request) => request.id.length > 0) : [];
  }
  static assetDescription(card) {
    return "description" in card ? card.description.trim() : card.details.trim();
  }
  static assetLocationLabel(card, type) {
    if ("locationLabel" in card && card.locationLabel?.trim()) {
      return card.locationLabel.trim();
    }
    if (type !== ASSET_TYPE_ACCOMMODATION || !("routes" in card)) {
      return card.city?.trim() ?? "";
    }
    return (card.routes ?? []).map((route) => `${route ?? ""}`.trim()).find((route) => route.length > 0) ?? card.city.trim();
  }
  static assetPriceLabel(card) {
    if ("priceLabel" in card && card.priceLabel?.trim()) {
      return card.priceLabel.trim();
    }
    if (!("pricing" in card) || !card.pricing?.enabled) {
      return void 0;
    }
    const amount = Math.max(0, Number(card.pricing.basePrice) || 0);
    if (amount <= 0) {
      return "Free borrow";
    }
    const currency = card.pricing.currency || "USD";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(0)}`;
    }
  }
  static assetPolicyCount(card) {
    if (!AssetCardBuilder.assetPoliciesEnabled(card)) {
      return 0;
    }
    if ("policyCount" in card && Number.isFinite(Number(card.policyCount))) {
      return Math.max(0, Math.trunc(Number(card.policyCount)));
    }
    return "policies" in card ? (card.policies ?? []).length : 0;
  }
  static assetPriceLabelFromRecord(record) {
    if (!record.pricing?.enabled) {
      return void 0;
    }
    const amount = Math.max(0, Number(record.pricing.basePrice) || 0);
    if (amount <= 0) {
      return "Free borrow";
    }
    const currency = record.pricing.currency || "USD";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(0)}`;
    }
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      routes: [...record.routes ?? []],
      topics: [...record.topics ?? []],
      policiesEnabled: record.policiesEnabled === true,
      policies: (record.policies ?? []).map((item) => __spreadValues({}, item)),
      pricing: record.pricing ? PricingBuilder.clonePricingConfig(record.pricing) : void 0,
      requests: record.requests.map((request) => this.cloneRequest(request)),
      menuActions: [...record.menuActions ?? []]
    });
  }
};
var LocalAssetTicketsMapper = class {
  static toTicketDTOs(records, creatorsByUserId = {}) {
    return this.cloneDTOs(records.filter(({ ticket }) => ticket.status === "A").map(({ ticket, event }) => this.toTicketDTO(ticket, LocalActivityEventsMapper.toDto(event), creatorsByUserId[event.creatorUserId ?? ""])));
  }
  static pageRows(rows, query) {
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 1));
    const orderedRows = [...rows].sort((left, right) => this.toSortableDate(left.dateIso) - this.toSortableDate(right.dateIso));
    const visibleRows = orderedRows.filter((row) => this.matchesTicketOrder(row, query.order));
    if (query.order === "past") {
      visibleRows.reverse();
    }
    const startIndex = page * pageSize;
    return {
      items: this.cloneDTOs(visibleRows.slice(startIndex, startIndex + pageSize)),
      total: visibleRows.length
    };
  }
  static cloneDTOs(rows) {
    return rows.map((row) => __spreadValues({}, row));
  }
  static toTicketDTO(ticket, dto, creator) {
    const creatorName = creator?.name?.trim() || dto.creatorName;
    const creatorAvatarUrl = AppUtils.firstImageUrl(creator?.images);
    return {
      id: dto.id,
      revision: [
        ticket.id,
        ticket.code,
        ticket.status,
        ticket.issuedAtIso,
        ticket.usedAtIso,
        dto.status,
        dto.title,
        dto.subtitle,
        dto.timeframe,
        dto.startAtIso,
        dto.endAtIso,
        dto.imageUrl,
        dto.visibility,
        creatorName,
        creatorAvatarUrl
      ].map((value) => `${value ?? ""}`).join(""),
      scanCode: ticket.code,
      holderUserId: ticket.holderUserId,
      usedAtIso: `${ticket.usedAtIso ?? ""}`.trim() || null,
      issuedAtIso: ticket.issuedAtIso,
      type: "events",
      status: dto.status,
      title: dto.title,
      subtitle: dto.subtitle,
      detail: dto.timeframe,
      dateIso: dto.startAtIso,
      distanceMetersExact: Math.max(0, Math.round((Number(dto.distanceKm) || 0) * 1e3)),
      isAdmin: false,
      startAt: dto.startAtIso,
      endAt: dto.endAtIso,
      imageUrl: dto.imageUrl,
      visibility: dto.visibility,
      avatarInitials: dto.creatorInitials,
      creatorInitials: dto.creatorInitials,
      creatorName,
      creatorAvatarUrl
    };
  }
  static matchesTicketOrder(row, order) {
    const isPast = this.resolveTicketEndTimestamp(row) < Date.now();
    return order === "past" ? isPast : !isPast;
  }
  static resolveTicketEndTimestamp(row) {
    const endAtMs = this.toSortableDate(row.endAt ?? "");
    if (endAtMs > 0) {
      return endAtMs;
    }
    return this.toSortableDate(row.dateIso);
  }
  static toSortableDate(dateIso) {
    const parsed = new Date(dateIso);
    const value = parsed.getTime();
    return Number.isNaN(value) ? 0 : value;
  }
};

// src/app/shared/core/local/source/mappers/notification.mapper.ts
var LocalNotificationMapper = class {
  static toDto(record) {
    return __spreadProps(__spreadValues({}, record), {
      readAtIso: record.readAtIso ?? null,
      senderUserId: record.senderUserId ?? null,
      senderName: record.senderName ?? null,
      senderAvatarUrl: record.senderAvatarUrl ?? null,
      actionPath: record.actionPath ?? null,
      sourceType: record.sourceType ?? null,
      sourceId: record.sourceId ?? null,
      payload: record.payload ? __spreadValues({}, record.payload) : null,
      revision: Math.max(1, Math.trunc(Number(record.revision) || 1))
    });
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toRecord(dto) {
    return __spreadProps(__spreadValues({}, dto), {
      readAtIso: dto.readAtIso ?? null,
      senderUserId: dto.senderUserId ?? null,
      senderName: dto.senderName ?? null,
      senderAvatarUrl: dto.senderAvatarUrl ?? null,
      actionPath: dto.actionPath ?? null,
      sourceType: dto.sourceType ?? null,
      sourceId: dto.sourceId ?? null,
      payload: dto.payload ? __spreadValues({}, dto.payload) : null,
      revision: Math.max(1, Math.trunc(Number(dto.revision) || 1))
    });
  }
  static toDtoPage(page) {
    return {
      records: this.toDtoList(page.records),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null,
      unreadCount: Math.max(0, Math.trunc(Number(page.unreadCount) || 0)),
      muted: page.muted === true
    };
  }
};

export {
  tournamentGroupCountForIncoming,
  tournamentCurrentStageFromSubEvents,
  tournamentParticipationLocked,
  LocalActivityEventsMapper,
  LocalActivityEventDetailsMapper,
  LocalAssetsMapper,
  LocalAssetTicketsMapper,
  LocalUsersMapper,
  LocalActivityInviteCandidatesMapper,
  LocalActivityMembersBuilder,
  LocalActivityResourcesMapper,
  LocalActivitySubEventStageRuntimeMapper,
  LocalContactsMapper,
  LocalEventCheckoutBasketsMapper,
  LocalEventFeedbackMapper,
  LocalEventParticipationActionMapper,
  LocalHelpCenterMapper,
  LocalIdeaPostsMapper,
  LocalProfileExperiencesMapper,
  LocalChatMessageMapper,
  LocalChatThreadMapper,
  LocalNotificationMapper,
  BaseUserRatesMapper,
  LocalUserRatesMapper,
  LocalUserFilterPreferencesMapper
};
//# sourceMappingURL=chunk-OY7NWTMT.js.map
