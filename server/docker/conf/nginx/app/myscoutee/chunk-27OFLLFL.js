import {
  __spreadProps,
  __spreadValues
} from "./chunk-FMXFYYCS.js";

// src/app/shared/core/contracts/activity.interface.ts
var ActivityEventDetailDTO = class _ActivityEventDetailDTO {
  id = "";
  userId = "";
  type = "events";
  status = "DR";
  statusBeforeSuppression = null;
  adminIds = [];
  avatar = "";
  title = "";
  subtitle = "";
  timeframe = "";
  inviter = null;
  unread = 0;
  activity = 0;
  trashedAtIso = null;
  creatorUserId = "";
  creatorName = "";
  creatorInitials = "";
  creatorGender;
  creatorCity = "";
  visibility = "Public";
  blindMode = "Open Event";
  startAtIso = "";
  endAtIso = "";
  dateRange = { startAt: "", endAt: "", precision: "minute" };
  distanceKm = 0;
  imageUrl = "";
  sourceLink = "";
  location = "";
  locationCoordinates = null;
  capacityMin = 0;
  capacityMax = 0;
  capacityTotal = 0;
  full = false;
  autoInviter = false;
  frequency = "One-time";
  ticketing = false;
  approvalRequired = false;
  pricing = null;
  policiesEnabled = false;
  policies = [];
  slotsEnabled = false;
  slotTemplates = [];
  parentEventId = null;
  slotTemplateId = null;
  generated = false;
  eventType = "main";
  nextSlot = null;
  upcomingSlots = [];
  checkoutBasket = null;
  acceptedMembers = 0;
  pendingMembers = 0;
  acceptedMemberUserIds = [];
  pendingMemberUserIds = [];
  invitedMemberUserIds = [];
  pendingRequestMemberUserIds = [];
  pendingReason;
  topics = [];
  subEventsEnabled = true;
  subEventDefinitions = [];
  subEvents = [];
  mode = "Casual";
  currentStage = null;
  rating = 0;
  boost = 0;
  affinity = 0;
  paymentSessionId = null;
  apply(update) {
    if (!update) {
      return this;
    }
    this.id = update.id ?? this.id;
    this.userId = update.userId ?? this.userId;
    this.type = update.type ?? this.type;
    this.status = update.status ?? this.status;
    this.statusBeforeSuppression = update.statusBeforeSuppression ?? this.statusBeforeSuppression;
    this.adminIds = [...update.adminIds ?? this.adminIds];
    this.avatar = update.avatar ?? this.avatar;
    this.title = update.title ?? this.title;
    this.subtitle = update.subtitle ?? this.subtitle;
    this.timeframe = update.timeframe ?? this.timeframe;
    this.inviter = update.inviter ?? this.inviter;
    this.unread = _ActivityEventDetailDTO.nonNegativeInteger(update.unread ?? this.unread);
    this.activity = _ActivityEventDetailDTO.nonNegativeInteger(update.activity ?? this.activity);
    this.trashedAtIso = update.trashedAtIso ?? this.trashedAtIso;
    this.creatorUserId = update.creatorUserId ?? this.creatorUserId;
    this.creatorName = update.creatorName ?? this.creatorName;
    this.creatorInitials = update.creatorInitials ?? this.creatorInitials;
    this.creatorGender = update.creatorGender ?? this.creatorGender;
    this.creatorCity = update.creatorCity ?? this.creatorCity;
    this.visibility = update.visibility ?? this.visibility;
    this.blindMode = update.blindMode ?? this.blindMode;
    this.dateRange = _ActivityEventDetailDTO.normalizeDateRange(update.dateRange ?? {
      startAt: update.startAtIso ?? this.dateRange.startAt ?? this.startAtIso,
      endAt: update.endAtIso ?? this.dateRange.endAt ?? this.endAtIso,
      precision: "minute"
    });
    this.startAtIso = this.dateRange.startAt;
    this.endAtIso = this.dateRange.endAt;
    this.distanceKm = Number.isFinite(update.distanceKm) ? Number(update.distanceKm) : this.distanceKm;
    this.imageUrl = update.imageUrl ?? this.imageUrl;
    this.sourceLink = update.sourceLink ?? this.sourceLink;
    this.location = update.location ?? this.location;
    this.locationCoordinates = update.locationCoordinates ? __spreadValues({}, update.locationCoordinates) : update.locationCoordinates === null ? null : this.locationCoordinates;
    this.capacityMin = update.capacityMin ?? this.capacityMin;
    this.capacityMax = update.capacityMax ?? this.capacityMax;
    this.capacityTotal = _ActivityEventDetailDTO.nonNegativeInteger(update.capacityTotal ?? this.capacityTotal);
    this.full = update.full === void 0 ? this.full : update.full === true;
    this.autoInviter = update.autoInviter ?? this.autoInviter;
    this.frequency = update.frequency ?? this.frequency;
    this.ticketing = update.ticketing ?? this.ticketing;
    this.approvalRequired = update.approvalRequired ?? this.approvalRequired;
    this.pricing = _ActivityEventDetailDTO.clonePricingConfig(update.pricing ?? this.pricing);
    this.policiesEnabled = update.policiesEnabled ?? this.policiesEnabled;
    this.applyPolicies(update.policies ?? this.policies);
    this.slotsEnabled = update.slotsEnabled ?? this.slotsEnabled;
    this.applySlotTemplates(update.slotTemplates ?? this.slotTemplates);
    this.parentEventId = update.parentEventId ?? this.parentEventId;
    this.slotTemplateId = update.slotTemplateId ?? this.slotTemplateId;
    this.generated = update.generated ?? this.generated;
    this.eventType = update.eventType ?? this.eventType;
    this.nextSlot = update.nextSlot ? __spreadValues({}, update.nextSlot) : update.nextSlot === null ? null : this.nextSlot;
    this.upcomingSlots = (update.upcomingSlots ?? this.upcomingSlots).map((item) => __spreadValues({}, item));
    this.checkoutBasket = update.checkoutBasket ? _ActivityEventDetailDTO.cloneCheckoutBasket(update.checkoutBasket) : update.checkoutBasket === null ? null : this.checkoutBasket;
    this.acceptedMembers = _ActivityEventDetailDTO.nonNegativeInteger(update.acceptedMembers ?? this.acceptedMembers);
    this.pendingMembers = _ActivityEventDetailDTO.nonNegativeInteger(update.pendingMembers ?? this.pendingMembers);
    this.acceptedMemberUserIds = [...update.acceptedMemberUserIds ?? this.acceptedMemberUserIds];
    this.pendingMemberUserIds = [...update.pendingMemberUserIds ?? this.pendingMemberUserIds];
    this.invitedMemberUserIds = [...update.invitedMemberUserIds ?? this.invitedMemberUserIds];
    this.pendingRequestMemberUserIds = [...update.pendingRequestMemberUserIds ?? this.pendingRequestMemberUserIds];
    this.pendingReason = update.pendingReason ?? this.pendingReason;
    this.topics = [...update.topics ?? this.topics];
    this.subEventsEnabled = update.subEventsEnabled ?? this.subEventsEnabled;
    this.applySubEventDefinitions(update.subEventDefinitions ?? this.subEventDefinitions);
    this.applySubEvents(update.subEvents ?? this.subEvents);
    this.mode = _ActivityEventDetailDTO.normalizeMode(update.mode ?? this.mode);
    this.currentStage = update.currentStage ? __spreadValues({}, update.currentStage) : update.currentStage === null ? null : this.currentStage;
    this.rating = _ActivityEventDetailDTO.nonNegativeInteger(update.rating ?? this.rating);
    this.boost = _ActivityEventDetailDTO.nonNegativeInteger(update.boost ?? this.boost);
    this.affinity = _ActivityEventDetailDTO.nonNegativeInteger(update.affinity ?? this.affinity);
    this.paymentSessionId = update.paymentSessionId ?? this.paymentSessionId;
    return this;
  }
  static cloneCheckoutBasket(value) {
    if (!value) {
      return null;
    }
    return {
      userId: `${value.userId ?? ""}`.trim(),
      sourceId: `${value.sourceId ?? ""}`.trim(),
      status: _ActivityEventDetailDTO.normalizeCheckoutState(value.status),
      slotSourceId: value.slotSourceId?.trim() || null,
      selectedDateKey: value.selectedDateKey?.trim() || null,
      checkoutSessionId: value.checkoutSessionId?.trim() || null,
      expiresAtIso: value.expiresAtIso?.trim() || null,
      appliedPromoCodes: _ActivityEventDetailDTO.normalizeAppliedPromoCodes(value.appliedPromoCodes),
      items: (value.items ?? []).map((item) => _ActivityEventDetailDTO.cloneCheckoutBasketItem(item)).filter(Boolean),
      pricingSummaryRows: _ActivityEventDetailDTO.cloneCheckoutPricingSummaryRows((value.pricingSummaryRows ?? []).length > 0 ? value.pricingSummaryRows : (value.items ?? []).flatMap((item) => item.pricingSummaryRows ?? []), value.currency),
      lineItems: (value.lineItems ?? []).map((item) => ({
        id: item.id?.trim() ?? "",
        kind: item.kind,
        label: item.label?.trim() ?? "",
        detail: item.detail?.trim() ?? "",
        amount: Number(item.amount) || 0,
        currency: item.currency?.trim() || value.currency?.trim() || "USD"
      })).filter((item) => item.id && item.label),
      totalAmount: Math.max(0, Number(value.totalAmount) || 0),
      currency: value.currency?.trim() || "USD"
    };
  }
  static cloneCheckoutBasketItem(value) {
    const id = value?.id?.trim() ?? "";
    const sourceId = value?.sourceId?.trim() ?? "";
    const label = value?.label?.trim() ?? "";
    if (!id || !sourceId || !label) {
      return null;
    }
    const currency = value?.currency?.trim() || "USD";
    return {
      id,
      kind: value?.kind === "sub_event" || value?.kind === "resource" ? value.kind : "event",
      sourceId,
      slotSourceId: value?.slotSourceId?.trim() || null,
      slotTemplateId: value?.slotTemplateId?.trim() || null,
      selectedDateKey: value?.selectedDateKey?.trim() || null,
      subEventId: value?.subEventId?.trim() || null,
      resourceType: value?.resourceType ?? null,
      label,
      detail: value?.detail?.trim() || "",
      amount: Number(value?.amount) || 0,
      currency,
      quantity: Math.max(1, Math.trunc(Number(value?.quantity) || 1)),
      status: _ActivityEventDetailDTO.normalizeCheckoutState(value?.status),
      resultState: _ActivityEventDetailDTO.normalizeCheckoutResultState(value?.resultState),
      pricingSummaryRows: (value?.pricingSummaryRows ?? []).map((row) => ({
        key: row.key?.trim() || row.label?.trim() || "pricing",
        label: row.label?.trim() || "Pricing",
        detail: row.detail?.trim() || null,
        amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
        currency: row.currency?.trim() || currency,
        multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
      })).filter((row) => row.label),
      checkoutSessionId: value?.checkoutSessionId?.trim() || null,
      createdAtIso: value?.createdAtIso?.trim() || null,
      updatedAtIso: value?.updatedAtIso?.trim() || null,
      expiresAtIso: value?.expiresAtIso?.trim() || null
    };
  }
  static cloneCheckoutPricingSummaryRows(value, fallbackCurrency) {
    const currency = fallbackCurrency?.trim() || "USD";
    return (value ?? []).map((row) => ({
      key: row.key?.trim() || row.label?.trim() || "pricing",
      label: row.label?.trim() || "Pricing",
      detail: row.detail?.trim() || null,
      amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
      currency: row.currency?.trim() || currency,
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    })).filter((row) => row.label);
  }
  static normalizeAppliedPromoCodes(value) {
    return [...new Set((value ?? []).map((code) => `${code ?? ""}`.trim().toUpperCase()).filter(Boolean))];
  }
  static normalizeCheckoutState(value) {
    return value === "confirmed" || value === "waiting" || value === "approval-pending" || value === "approved" || value === "pay" || value === "cancelled" || value === "rejected" ? value : "draft";
  }
  static normalizeCheckoutResultState(value) {
    return value === "deleted" || value === "succeeded" || value === "failed" ? value : "pending";
  }
  clone() {
    return new _ActivityEventDetailDTO().apply(this);
  }
  toPersistencePayload() {
    const payload = this.clone();
    payload.startAtIso = _ActivityEventDetailDTO.toIsoInstant(this.startAtIso);
    payload.endAtIso = _ActivityEventDetailDTO.toIsoInstant(this.endAtIso);
    payload.slotTemplates = payload.slotTemplates.map((template) => template.closed === true ? __spreadValues({}, template) : __spreadProps(__spreadValues({}, template), {
      startAt: _ActivityEventDetailDTO.toIsoInstant(template.startAt)
    }));
    payload.dateRange = __spreadProps(__spreadValues({}, payload.dateRange), {
      startAt: payload.startAtIso,
      endAt: payload.endAtIso
    });
    return payload;
  }
  applyPolicies(items) {
    this.policies = _ActivityEventDetailDTO.normalizePolicies(items);
    return this;
  }
  applySlotTemplates(items) {
    this.slotTemplates = _ActivityEventDetailDTO.normalizeSlotTemplates(items);
    return this;
  }
  applySubEventDefinitions(items) {
    this.subEventDefinitions = _ActivityEventDetailDTO.normalizeSubEventDefinitions(items);
    return this;
  }
  applySubEvents(items) {
    this.subEvents = _ActivityEventDetailDTO.normalizeSubEvents(items);
    return this;
  }
  normalizeCapacityRange() {
    const min = _ActivityEventDetailDTO.nonNegativeIntegerOrNull(this.capacityMin);
    const maxCandidate = _ActivityEventDetailDTO.nonNegativeIntegerOrNull(this.capacityMax);
    const max = min !== null && maxCandidate !== null ? Math.max(min, maxCandidate) : maxCandidate ?? min;
    this.capacityMin = min;
    this.capacityMax = max;
    return { min, max };
  }
  syncFirstSubEventLocation(location) {
    if (this.subEvents.length === 0) {
      return this;
    }
    const first = _ActivityEventDetailDTO.firstSubEventByOrder(this.subEvents);
    if (!first?.id) {
      return this;
    }
    const normalizedLocation = _ActivityEventDetailDTO.normalizeLocation(location);
    this.subEvents = this.subEvents.map((item) => item.id === first.id ? __spreadProps(__spreadValues({}, item), { location: normalizedLocation }) : __spreadValues({}, item));
    return this;
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
          overrideDate: _ActivityEventDetailDTO.normalizeSlotOverrideDate(item.overrideDate),
          closed: true,
          subEventDefinitions: _ActivityEventDetailDTO.normalizeSubEventDefinitions(item.subEventDefinitions ?? [])
        };
      }
      const normalizedStart = `${item.startAt ?? ""}`.trim();
      const parsedStart = _ActivityEventDetailDTO.parseDate(normalizedStart) ?? /* @__PURE__ */ new Date();
      return {
        id: `${item.id ?? `slot-${index + 1}`}`.trim() || `slot-${index + 1}`,
        startAt: _ActivityEventDetailDTO.parseDate(normalizedStart) ? normalizedStart : _ActivityEventDetailDTO.toIsoDateTimeLocal(parsedStart),
        overrideDate: _ActivityEventDetailDTO.normalizeSlotOverrideDate(item.overrideDate),
        closed: false,
        subEventDefinitions: _ActivityEventDetailDTO.normalizeSubEventDefinitions(item.subEventDefinitions ?? [])
      };
    });
  }
  static normalizeSubEventDefinitions(items) {
    return items.map((item, index) => {
      const capacityMin = _ActivityEventDetailDTO.nonNegativeInteger(item.capacityMin);
      const capacityMax = Math.max(capacityMin, _ActivityEventDetailDTO.nonNegativeInteger(item.capacityMax));
      const durationMinutes = _ActivityEventDetailDTO.nonNegativeInteger(item.durationMinutes);
      const timing = _ActivityEventDetailDTO.normalizeSubEventDefinitionTiming(item.timing);
      const offsetMinutes = _ActivityEventDetailDTO.nonNegativeInteger(item.offsetMinutes);
      return {
        id: `${item.id ?? `subevent-definition-${index + 1}`}`.trim() || `subevent-definition-${index + 1}`,
        name: `${item.name ?? `Sub Event ${index + 1}`}`.trim() || `Sub Event ${index + 1}`,
        description: `${item.description ?? ""}`.trim(),
        timing,
        offsetMinutes,
        durationMinutes,
        location: _ActivityEventDetailDTO.normalizeLocation(item.location),
        tournamentGroupCapacityMin: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.tournamentGroupCapacityMin),
        tournamentGroupCapacityMax: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.tournamentGroupCapacityMax),
        tournamentLeaderboardType: item.tournamentLeaderboardType === "Fifa" ? "Fifa" : "Score",
        tournamentAdvancePerGroup: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.tournamentAdvancePerGroup),
        optional: item.optional === true,
        pricing: _ActivityEventDetailDTO.clonePricingConfig(item.pricing),
        capacityMin,
        capacityMax,
        icon: `${item.icon ?? ""}`.trim() || null
      };
    });
  }
  static normalizeSubEventDefinitionTiming(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (normalized === "before") {
      return "Before";
    }
    if (normalized === "after") {
      return "After";
    }
    return "During";
  }
  static normalizeDateRange(value) {
    return {
      startAt: `${value?.startAt ?? ""}`.trim(),
      endAt: `${value?.endAt ?? ""}`.trim(),
      precision: value?.precision === "date" ? "date" : "minute"
    };
  }
  static normalizeSubEvents(items) {
    return items.map((item, index) => {
      const capacityMin = _ActivityEventDetailDTO.nonNegativeInteger(item.capacityMin);
      const capacityMax = Math.max(capacityMin, _ActivityEventDetailDTO.nonNegativeInteger(item.capacityMax));
      return {
        id: `${item.id ?? `subevent-${index + 1}`}`.trim() || `subevent-${index + 1}`,
        name: `${item.name ?? `Sub Event ${index + 1}`}`.trim(),
        description: `${item.description ?? ""}`.trim(),
        startAt: `${item.startAt ?? ""}`.trim(),
        endAt: `${item.endAt ?? ""}`.trim(),
        location: _ActivityEventDetailDTO.normalizeLocation(item.location),
        createdByUserId: item.createdByUserId?.trim() || void 0,
        optional: item.optional === true,
        pricing: _ActivityEventDetailDTO.clonePricingConfig(item.pricing),
        capacityMin,
        capacityMax,
        tournamentGroupCapacityMin: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.tournamentGroupCapacityMin),
        tournamentGroupCapacityMax: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.tournamentGroupCapacityMax),
        tournamentLeaderboardType: item.tournamentLeaderboardType === "Fifa" ? "Fifa" : "Score",
        tournamentAdvancePerGroup: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.tournamentAdvancePerGroup),
        groupsCount: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.groupsCount),
        membersAccepted: _ActivityEventDetailDTO.nonNegativeInteger(item.membersAccepted),
        membersPending: _ActivityEventDetailDTO.nonNegativeInteger(item.membersPending),
        carsPending: _ActivityEventDetailDTO.nonNegativeInteger(item.carsPending),
        accommodationPending: _ActivityEventDetailDTO.nonNegativeInteger(item.accommodationPending),
        suppliesPending: _ActivityEventDetailDTO.nonNegativeInteger(item.suppliesPending),
        carsAccepted: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.carsAccepted),
        accommodationAccepted: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.accommodationAccepted),
        suppliesAccepted: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.suppliesAccepted),
        carsCapacityMin: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.carsCapacityMin),
        carsCapacityMax: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.carsCapacityMax),
        accommodationCapacityMin: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.accommodationCapacityMin),
        accommodationCapacityMax: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.accommodationCapacityMax),
        suppliesCapacityMin: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.suppliesCapacityMin),
        suppliesCapacityMax: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.suppliesCapacityMax),
        slotStartOffsetMinutes: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.slotStartOffsetMinutes),
        slotDurationMinutes: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.slotDurationMinutes),
        stageStatus: `${item.stageStatus ?? ""}`.trim() || void 0,
        stageStatusReason: `${item.stageStatusReason ?? ""}`.trim() || void 0,
        stageStatusUpdatedAt: `${item.stageStatusUpdatedAt ?? ""}`.trim() || void 0,
        stageFinalizedAt: `${item.stageFinalizedAt ?? ""}`.trim() || void 0,
        stageFinalizedByUserId: `${item.stageFinalizedByUserId ?? ""}`.trim() || void 0,
        stageResultRevision: _ActivityEventDetailDTO.optionalNonNegativeInteger(item.stageResultRevision)
      };
    });
  }
  static sortSubEventsByStartAsc(items) {
    return [...items].map((item, index) => ({ item, index, startMs: _ActivityEventDetailDTO.parseDate(item.startAt)?.getTime() ?? Number.POSITIVE_INFINITY })).sort((left, right) => left.startMs - right.startMs || left.index - right.index).map((entry) => entry.item);
  }
  static firstSubEventByOrder(items) {
    return _ActivityEventDetailDTO.sortSubEventsByStartAsc(items)[0] ?? null;
  }
  static normalizeSlotOverrideDate(value) {
    const parsed = _ActivityEventDetailDTO.parseDateOnly(value);
    return parsed ? _ActivityEventDetailDTO.toIsoDate(parsed) : null;
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
  static normalizeBlindMode(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    return normalized.includes("blind") ? "Blind Event" : "Open Event";
  }
  static normalizeMode(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    return normalized === "tournament" ? "Tournament" : "Casual";
  }
  static normalizeTopics(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => `${item ?? ""}`.trim().replace(/^#+/, "")).filter((item) => item.length > 0).slice(0, 5);
  }
  static normalizeTopicToken(value) {
    return `${value ?? ""}`.trim().replace(/^#+/, "").toLowerCase();
  }
  static normalizeLocation(value) {
    return `${value ?? ""}`.trim();
  }
  static buildTimeframeLabel(startAt, endAt, frequency) {
    const start = _ActivityEventDetailDTO.parseDate(startAt);
    const end = _ActivityEventDetailDTO.parseDate(endAt);
    if (!start || !end) {
      return startAt || endAt || "";
    }
    const dateLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const normalizedFrequency = _ActivityEventDetailDTO.normalizeFrequency(frequency);
    if (normalizedFrequency === "One-time") {
      return `${dateLabel} \xB7 ${startTime} - ${endTime}`;
    }
    return `${normalizedFrequency} \xB7 ${dateLabel} \xB7 ${startTime} - ${endTime}`;
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
  static nonNegativeInteger(value) {
    return _ActivityEventDetailDTO.nonNegativeIntegerOrNull(value) ?? 0;
  }
  static optionalNonNegativeInteger(value) {
    return _ActivityEventDetailDTO.nonNegativeIntegerOrNull(value) ?? void 0;
  }
  static nonNegativeIntegerOrNull(value) {
    if (value === null || value === void 0 || value === "") {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : null;
  }
  static parseDate(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value);
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      const parsedNumber = new Date(value);
      return Number.isNaN(parsedNumber.getTime()) ? null : parsedNumber;
    }
    const raw = `${value ?? ""}`.trim();
    if (!raw) {
      return null;
    }
    const parsed = new Date(raw.replace(/\//g, "-"));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  static parseDateOnly(value) {
    const parsed = _ActivityEventDetailDTO.parseDate(value);
    return parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()) : null;
  }
  static toIsoDate(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  static toIsoDateTimeLocal(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    const hours = `${value.getHours()}`.padStart(2, "0");
    const minutes = `${value.getMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  static toIsoInstant(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized) {
      return "";
    }
    const parsed = _ActivityEventDetailDTO.parseDate(normalized);
    return parsed ? parsed.toISOString() : normalized;
  }
};
function defaultUserGameFilterPreferences() {
  return {
    ageMin: 18,
    ageMax: 120,
    heightMinCm: 40,
    heightMaxCm: 250,
    interests: [],
    values: [],
    physiques: [],
    languages: [],
    genders: [],
    horoscopes: [],
    traitLabels: [],
    smoking: [],
    drinking: [],
    workout: [],
    pets: [],
    familyPlans: [],
    children: [],
    loveStyles: [],
    communicationStyles: [],
    sexualOrientations: [],
    religions: []
  };
}
var EVENT_CHECKOUT_PROMO_CODE_INVALID_MESSAGE_KEY = "event.checkout.promo.invalid";
var EventFeedbackPageResultDto = class _EventFeedbackPageResultDto {
  items;
  total;
  allItems;
  organizerItems;
  receivedEvents;
  state;
  counts;
  constructor(result = null) {
    const allItems = _EventFeedbackPageResultDto.clonePageItems(result?.allItems);
    const organizerItems = _EventFeedbackPageResultDto.clonePageItems(result?.organizerItems);
    this.items = _EventFeedbackPageResultDto.clonePageItems(result?.items);
    this.total = Math.max(0, Math.trunc(Number(result?.total) || 0));
    this.allItems = allItems;
    this.organizerItems = organizerItems;
    this.receivedEvents = _EventFeedbackPageResultDto.cloneReceivedEvents(result?.receivedEvents);
    this.state = _EventFeedbackPageResultDto.cloneStateSnapshot(result?.state);
    this.counts = {
      ownEvents: Math.max(0, Math.trunc(Number(result?.counts?.ownEvents) || 0)),
      pending: Math.max(0, Math.trunc(Number(result?.counts?.pending) || 0)),
      feedbacked: Math.max(0, Math.trunc(Number(result?.counts?.feedbacked) || 0)),
      removed: Math.max(0, Math.trunc(Number(result?.counts?.removed) || 0))
    };
  }
  itemById(eventId) {
    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return null;
    }
    return [
      ...this.items,
      ...this.allItems,
      ...this.organizerItems
    ].find((item) => item.eventId === normalizedEventId) ?? null;
  }
  eventTitleById(eventId) {
    return this.itemById(eventId)?.title?.trim() || "this event";
  }
  filterCount(filter) {
    switch (filter) {
      case "own-events":
        return Math.max(0, Math.trunc(Number(this.counts.ownEvents) || 0));
      case "feedbacked":
        return Math.max(0, Math.trunc(Number(this.counts.feedbacked) || 0));
      case "removed":
        return Math.max(0, Math.trunc(Number(this.counts.removed) || 0));
      case "pending":
      default:
        return Math.max(0, Math.trunc(Number(this.counts.pending) || 0));
    }
  }
  filterCountWithDelta(filter, delta = {}) {
    return Math.max(0, this.filterCount(filter) + (delta[filter] ?? 0));
  }
  itemMatchesFilter(item, filter) {
    switch (filter) {
      case "own-events":
        return item.isOwnEvent === true;
      case "feedbacked":
        return item.isFeedbacked === true;
      case "removed":
        return item.isRemoved === true;
      case "pending":
      default:
        return !item.isRemoved && item.pendingCards > 0;
    }
  }
  applySubmitToItem(item, dto) {
    const submittedAtMs = this.submitTimestampMs(dto);
    const pendingCards = Math.max(0, item.pendingCards - dto.cards.length);
    return __spreadProps(__spreadValues({}, item), {
      pendingCards,
      isRemoved: false,
      isFeedbacked: pendingCards === 0,
      feedbackedAtMs: pendingCards === 0 ? submittedAtMs : item.feedbackedAtMs,
      removedAtMs: null
    });
  }
  removeItem(item, removedAtMs = Date.now()) {
    return __spreadProps(__spreadValues({}, item), {
      isRemoved: true,
      isFeedbacked: false,
      removedAtMs
    });
  }
  restoreItem(item) {
    return __spreadProps(__spreadValues({}, item), {
      isRemoved: false,
      isFeedbacked: item.pendingCards === 0,
      removedAtMs: null
    });
  }
  filterCountDelta(before, after) {
    return {
      pending: this.filterMembershipDelta(before, after, "pending"),
      feedbacked: this.filterMembershipDelta(before, after, "feedbacked"),
      removed: this.filterMembershipDelta(before, after, "removed"),
      "own-events": this.filterMembershipDelta(before, after, "own-events")
    };
  }
  patchItem(item) {
    const patchList = (items) => items.map((current) => current.eventId === item.eventId ? __spreadValues({}, item) : __spreadValues({}, current));
    return new _EventFeedbackPageResultDto(__spreadProps(__spreadValues({}, this), {
      items: patchList(this.items),
      allItems: patchList(this.allItems),
      organizerItems: patchList(this.organizerItems)
    }));
  }
  patchOrganizerNote(eventId, text) {
    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return this;
    }
    const organizerNotesByEventId = __spreadValues({}, this.state.organizerNotesByEventId);
    const trimmedText = text.trim();
    if (trimmedText) {
      organizerNotesByEventId[normalizedEventId] = trimmedText;
    } else {
      delete organizerNotesByEventId[normalizedEventId];
    }
    return new _EventFeedbackPageResultDto(__spreadProps(__spreadValues({}, this), {
      state: __spreadProps(__spreadValues({}, this.state), {
        organizerNotesByEventId
      })
    }));
  }
  receivedEntries(eventId) {
    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return [];
    }
    return this.receivedEvents.find((item) => item.eventId === normalizedEventId)?.entries ?? [];
  }
  organizerEntries(eventId) {
    return [...this.receivedEntries(eventId)].sort((left, right) => this.entryTimestampMs(right) - this.entryTimestampMs(left));
  }
  entriesLatestAtMs(entries) {
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
  groupTimestampMs(item, filter) {
    switch (filter) {
      case "feedbacked":
        return this.numberOrNull(item.feedbackedAtMs ?? item.startAtMs);
      case "removed":
        return this.numberOrNull(item.removedAtMs ?? item.feedbackedAtMs ?? item.startAtMs);
      case "own-events":
      case "pending":
      default:
        return this.numberOrNull(item.startAtMs);
    }
  }
  static clonePageItems(items) {
    return (items ?? []).map((item) => ({
      eventId: item.eventId?.trim() ?? "",
      title: item.title?.trim() ?? "",
      subtitle: item.subtitle?.trim() ?? "",
      timeframe: item.timeframe?.trim() ?? "",
      imageUrl: item.imageUrl?.trim() ?? "",
      startAtMs: Math.max(0, Math.trunc(Number(item.startAtMs) || 0)),
      pendingCards: Math.max(0, Math.trunc(Number(item.pendingCards) || 0)),
      totalCards: Math.max(0, Math.trunc(Number(item.totalCards) || 0)),
      isRemoved: item.isRemoved === true,
      isFeedbacked: item.isFeedbacked === true,
      feedbackedAtMs: _EventFeedbackPageResultDto.numberOrNullStatic(item.feedbackedAtMs),
      removedAtMs: _EventFeedbackPageResultDto.numberOrNullStatic(item.removedAtMs),
      isOwnEvent: item.isOwnEvent === true
    })).filter((item) => item.eventId.length > 0);
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
          answers: (entry.answers ?? []).map((answer) => _EventFeedbackPageResultDto.cloneSubmittedAnswer(answer))
        })).filter((entry) => entry.viewerUserId.length > 0)
      };
    }).filter((item) => item.eventId.length > 0);
  }
  static cloneStateSnapshot(state) {
    const next = {
      submittedCardsById: {},
      submittedAnswersByCardId: {},
      submittedEventsById: {},
      removedEventsById: {},
      removedEventDatesById: {},
      organizerNotesByEventId: {}
    };
    for (const [key, value] of Object.entries(state?.submittedCardsById ?? {})) {
      const normalizedKey = key.trim();
      if (normalizedKey && value) {
        next.submittedCardsById[normalizedKey] = true;
      }
    }
    for (const [key, value] of Object.entries(state?.submittedAnswersByCardId ?? {})) {
      const normalizedKey = key.trim();
      if (normalizedKey && value) {
        next.submittedAnswersByCardId[normalizedKey] = _EventFeedbackPageResultDto.cloneSubmittedAnswer(value);
      }
    }
    for (const [key, value] of Object.entries(state?.submittedEventsById ?? {})) {
      const normalizedKey = key.trim();
      const normalizedValue = value?.trim() ?? "";
      if (normalizedKey && normalizedValue) {
        next.submittedEventsById[normalizedKey] = normalizedValue;
      }
    }
    for (const [key, value] of Object.entries(state?.removedEventsById ?? {})) {
      const normalizedKey = key.trim();
      if (normalizedKey && value) {
        next.removedEventsById[normalizedKey] = true;
      }
    }
    for (const [key, value] of Object.entries(state?.removedEventDatesById ?? {})) {
      const normalizedKey = key.trim();
      const normalizedValue = value?.trim() ?? "";
      if (normalizedKey && normalizedValue) {
        next.removedEventDatesById[normalizedKey] = normalizedValue;
      }
    }
    for (const [key, value] of Object.entries(state?.organizerNotesByEventId ?? {})) {
      const normalizedKey = key.trim();
      const normalizedValue = value?.trim() ?? "";
      if (normalizedKey && normalizedValue) {
        next.organizerNotesByEventId[normalizedKey] = normalizedValue;
      }
    }
    return next;
  }
  static cloneSubmittedAnswer(answer) {
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
  static numberOrNullStatic(value) {
    return Number.isFinite(value) && (value ?? 0) > 0 ? Number(value) : null;
  }
  submitTimestampMs(dto) {
    const submittedAtIso = dto.submittedAtIso.trim();
    const submittedAtMs = submittedAtIso ? new Date(submittedAtIso).getTime() : Date.now();
    return Number.isNaN(submittedAtMs) ? Date.now() : submittedAtMs;
  }
  filterMembershipDelta(before, after, filter) {
    const wasVisible = this.itemMatchesFilter(before, filter);
    const isVisible = this.itemMatchesFilter(after, filter);
    return wasVisible === isVisible ? 0 : wasVisible ? -1 : 1;
  }
  entryTimestampMs(entry) {
    const iso = entry.updatedAtIso?.trim() || entry.submittedAtIso?.trim() || (entry.answers ?? []).map((answer) => answer.submittedAtIso?.trim() ?? "").find(Boolean) || "";
    const value = iso ? new Date(iso).getTime() : 0;
    return Number.isNaN(value) ? 0 : value;
  }
  numberOrNull(value) {
    return _EventFeedbackPageResultDto.numberOrNullStatic(value);
  }
};
var EventFeedbackDetailDto = class _EventFeedbackDetailDto {
  eventId;
  title;
  submittedAtIso;
  organizerNote;
  cards;
  constructor(result = null) {
    this.eventId = result?.eventId?.trim() ?? "";
    this.title = result?.title?.trim() ?? "";
    this.submittedAtIso = result?.submittedAtIso?.trim() ?? "";
    this.organizerNote = result?.organizerNote?.trim() ?? "";
    this.cards = _EventFeedbackDetailDto.cloneCards(result?.cards);
  }
  pending(options = {}) {
    const activeUserId = options.activeUserId?.trim() ?? "";
    return new _EventFeedbackDetailDto(__spreadProps(__spreadValues({}, this), {
      title: this.title || options.fallbackTitle?.trim() || "",
      cards: this.cards.filter((card) => card.eventId === this.eventId && !(card.kind === "attendee" && card.attendeeUserId === activeUserId))
    }));
  }
  submitted(options) {
    return new _EventFeedbackDetailDto(__spreadProps(__spreadValues({}, this), {
      submittedAtIso: options.submittedAtIso
    }));
  }
  withPersistedState(state) {
    const answersByCardId = state?.answersByCardId ?? {};
    const answers = Object.values(answersByCardId);
    return new _EventFeedbackDetailDto(__spreadProps(__spreadValues({}, this), {
      submittedAtIso: state?.submittedAtIso?.trim() || this.submittedAtIso,
      organizerNote: state ? state.organizerNote?.trim() ?? "" : this.organizerNote,
      cards: this.cards.map((card) => {
        const answer = answersByCardId[card.id] ?? answers.find((item) => item.kind === card.kind && (card.kind === "event" || item.targetUserId === (card.targetUserId ?? null)));
        if (!answer) {
          return card;
        }
        return __spreadProps(__spreadValues({}, card), {
          answerPrimary: answer.primaryValue?.trim() ?? "",
          answerSecondary: answer.secondaryValue?.trim() ?? "",
          eventComment: answer.kind === "event" ? answer.eventComment?.trim() ?? "" : "",
          selectedTraitIds: [...answer.personalityTraitIds ?? []].map((traitId) => traitId.trim()).filter(Boolean)
        });
      })
    }));
  }
  withEmptyAnswers() {
    return new _EventFeedbackDetailDto(__spreadProps(__spreadValues({}, this), {
      cards: this.cards.map((card) => __spreadProps(__spreadValues({}, card), {
        answerPrimary: "",
        answerSecondary: "",
        eventComment: "",
        selectedTraitIds: []
      }))
    }));
  }
  withFormValue(value) {
    const record = _EventFeedbackDetailDto.isRecord(value) ? value : {};
    const inputCards = Array.isArray(record["cards"]) ? record["cards"] : [];
    const cardInputById = /* @__PURE__ */ new Map();
    for (const item of inputCards) {
      if (!_EventFeedbackDetailDto.isRecord(item)) {
        continue;
      }
      const cardId = `${item["id"] ?? ""}`.trim();
      if (cardId) {
        cardInputById.set(cardId, item);
      }
    }
    return new _EventFeedbackDetailDto(__spreadProps(__spreadValues({}, this), {
      cards: this.cards.map((card) => {
        const inputCard = cardInputById.get(card.id) ?? {};
        return __spreadProps(__spreadValues({}, card), {
          answerPrimary: _EventFeedbackDetailDto.stringValue(inputCard["answerPrimary"]),
          answerSecondary: _EventFeedbackDetailDto.stringValue(inputCard["answerSecondary"]),
          eventComment: card.kind === "event" ? _EventFeedbackDetailDto.stringValue(inputCard["eventComment"]) : "",
          selectedTraitIds: _EventFeedbackDetailDto.normalizeSelectedTraitIds(inputCard["selectedTraitIds"])
        });
      })
    }));
  }
  static cloneCards(cards) {
    return (cards ?? []).map((card) => ({
      id: card.id?.trim() ?? "",
      eventId: card.eventId?.trim() ?? "",
      kind: card.kind === "attendee" ? "attendee" : "event",
      attendeeUserId: card.attendeeUserId?.trim() || void 0,
      targetUserId: card.targetUserId?.trim() || void 0,
      targetRole: _EventFeedbackDetailDto.normalizeRole(card.targetRole),
      eventTitle: card.eventTitle?.trim() ?? "",
      eventSubtitle: card.eventSubtitle?.trim() ?? "",
      eventImageUrl: card.eventImageUrl?.trim() ?? "",
      eventTimeframe: card.eventTimeframe?.trim() ?? "",
      eventStartAtIso: card.eventStartAtIso?.trim() ?? "",
      eventLabel: card.eventLabel?.trim() ?? "",
      targetName: card.targetName?.trim() ?? "",
      targetAge: _EventFeedbackDetailDto.numberOrUndefined(card.targetAge),
      targetCity: card.targetCity?.trim() || void 0,
      targetGender: card.targetGender === "woman" ? "woman" : "man",
      targetTraitLabel: card.targetTraitLabel?.trim() || void 0,
      targetImageUrl: card.targetImageUrl?.trim() || void 0,
      answerPrimary: card.answerPrimary?.trim() ?? "",
      answerSecondary: card.answerSecondary?.trim() ?? "",
      eventComment: card.kind === "event" ? card.eventComment?.trim() ?? "" : "",
      selectedTraitIds: [...card.selectedTraitIds ?? []].map((traitId) => traitId.trim()).filter(Boolean)
    })).filter((card) => card.id.length > 0 && card.eventId.length > 0);
  }
  static normalizeRole(role) {
    if (role === "Admin" || role === "Manager" || role === "Member") {
      return role;
    }
    return void 0;
  }
  static numberOrUndefined(value) {
    const normalized = Number(value);
    return Number.isFinite(normalized) && normalized > 0 ? normalized : void 0;
  }
  static stringValue(value) {
    return `${value ?? ""}`.trim();
  }
  static normalizeSelectedTraitIds(value) {
    const requestedValues = Array.isArray(value) ? value : value === null || value === void 0 || value === "" ? [] : [value];
    const selectedTraitIds = [];
    for (const requestedValue of requestedValues) {
      const traitId = `${requestedValue ?? ""}`.trim();
      if (!traitId || selectedTraitIds.includes(traitId)) {
        continue;
      }
      selectedTraitIds.push(traitId);
      if (selectedTraitIds.length >= 3) {
        break;
      }
    }
    return selectedTraitIds;
  }
  static isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
};

// src/app/shared/core/common/constants.ts
var ACTIVITY_MEMBER_STATUSES = ["pending", "accepted", "disqualified", "removed", "deleted"];
var ASSET_TYPE_TRANSPORT = "Transport";
var ASSET_TYPE_ACCOMMODATION = "Accommodation";
var ASSET_TYPE_SUPPLIES = "Supplies";
var ASSET_FILTER_TICKET = "Ticket";
var ASSET_TYPES = [ASSET_TYPE_TRANSPORT, ASSET_TYPE_ACCOMMODATION, ASSET_TYPE_SUPPLIES];
var ASSET_FILTER_TYPES = [...ASSET_TYPES, ASSET_FILTER_TICKET];
var SUB_EVENT_RESOURCE_FILTERS = ["Members", ...ASSET_TYPES];
var TRANSPORT_CATEGORY_SEDAN = "Sedan";
var TRANSPORT_CATEGORY_SUV = "SUV";
var TRANSPORT_CATEGORY_VAN = "Van";
var TRANSPORT_CATEGORY_BUS = "Bus";
var TRANSPORT_CATEGORY_TRUCK = "Truck";
var TRANSPORT_CATEGORY_MOTORCYCLE = "Motorcycle";
var TRANSPORT_CATEGORY_BICYCLE = "Bicycle";
var TRANSPORT_CATEGORY_BOAT = "Boat";
var TRANSPORT_CATEGORY_FLIGHT = "Flight";
var TRANSPORT_CATEGORY_SHUTTLE = "Shuttle";
var ACCOMMODATION_CATEGORY_HOTEL = "Hotel";
var ACCOMMODATION_CATEGORY_APARTMENT = "Apartment";
var ACCOMMODATION_CATEGORY_HOUSE = "House";
var ACCOMMODATION_CATEGORY_ROOM = "Room";
var ACCOMMODATION_CATEGORY_VENUE = "Venue";
var ACCOMMODATION_CATEGORY_CAMPSITE = "Campsite";
var ACCOMMODATION_CATEGORY_STORAGE = "Storage";
var ACCOMMODATION_CATEGORY_WORKSPACE = "Workspace";
var SUPPLIES_CATEGORY_CAMPING = "Camping";
var SUPPLIES_CATEGORY_COOKING = "Cooking";
var SUPPLIES_CATEGORY_GAMES = "Games";
var SUPPLIES_CATEGORY_AUDIO = "Audio";
var SUPPLIES_CATEGORY_SPORTS = "Sports";
var SUPPLIES_CATEGORY_SAFETY = "Safety";
var SUPPLIES_CATEGORY_DECOR = "Decor";
var SUPPLIES_CATEGORY_TECH = "Tech";
var TRANSPORT_ASSET_CATEGORIES = [
  TRANSPORT_CATEGORY_SEDAN,
  TRANSPORT_CATEGORY_SUV,
  TRANSPORT_CATEGORY_VAN,
  TRANSPORT_CATEGORY_BUS,
  TRANSPORT_CATEGORY_TRUCK,
  TRANSPORT_CATEGORY_MOTORCYCLE,
  TRANSPORT_CATEGORY_BICYCLE,
  TRANSPORT_CATEGORY_BOAT,
  TRANSPORT_CATEGORY_FLIGHT,
  TRANSPORT_CATEGORY_SHUTTLE
];
var ACCOMMODATION_ASSET_CATEGORIES = [
  ACCOMMODATION_CATEGORY_HOTEL,
  ACCOMMODATION_CATEGORY_APARTMENT,
  ACCOMMODATION_CATEGORY_HOUSE,
  ACCOMMODATION_CATEGORY_ROOM,
  ACCOMMODATION_CATEGORY_VENUE,
  ACCOMMODATION_CATEGORY_CAMPSITE,
  ACCOMMODATION_CATEGORY_STORAGE,
  ACCOMMODATION_CATEGORY_WORKSPACE
];
var SUPPLIES_ASSET_CATEGORIES = [
  SUPPLIES_CATEGORY_CAMPING,
  SUPPLIES_CATEGORY_COOKING,
  SUPPLIES_CATEGORY_GAMES,
  SUPPLIES_CATEGORY_AUDIO,
  SUPPLIES_CATEGORY_SPORTS,
  SUPPLIES_CATEGORY_SAFETY,
  SUPPLIES_CATEGORY_DECOR,
  SUPPLIES_CATEGORY_TECH
];
var ASSET_CATEGORY_OPTIONS_BY_TYPE = {
  [ASSET_TYPE_TRANSPORT]: TRANSPORT_ASSET_CATEGORIES,
  [ASSET_TYPE_ACCOMMODATION]: ACCOMMODATION_ASSET_CATEGORIES,
  [ASSET_TYPE_SUPPLIES]: SUPPLIES_ASSET_CATEGORIES
};
function isAssetType(value) {
  return ASSET_TYPES.includes(value);
}
var EVENT_VISIBILITIES = ["Public", "Friends only", "Invitation only"];
var EVENT_FEEDBACK_LIST_FILTERS = ["own-events", "pending", "feedbacked", "removed"];
var CURRENT_PROFILE_FORM_VERSION = 2;
var USER_GENDERS = ["woman", "man"];

export {
  ActivityEventDetailDTO,
  defaultUserGameFilterPreferences,
  EVENT_CHECKOUT_PROMO_CODE_INVALID_MESSAGE_KEY,
  EventFeedbackPageResultDto,
  EventFeedbackDetailDto,
  ACTIVITY_MEMBER_STATUSES,
  ASSET_TYPE_TRANSPORT,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_FILTER_TICKET,
  ASSET_TYPES,
  ASSET_FILTER_TYPES,
  SUB_EVENT_RESOURCE_FILTERS,
  TRANSPORT_CATEGORY_SEDAN,
  TRANSPORT_CATEGORY_SUV,
  TRANSPORT_CATEGORY_VAN,
  TRANSPORT_CATEGORY_SHUTTLE,
  ACCOMMODATION_CATEGORY_APARTMENT,
  ACCOMMODATION_CATEGORY_HOUSE,
  ACCOMMODATION_CATEGORY_ROOM,
  SUPPLIES_CATEGORY_CAMPING,
  SUPPLIES_CATEGORY_COOKING,
  SUPPLIES_CATEGORY_GAMES,
  SUPPLIES_CATEGORY_AUDIO,
  SUPPLIES_CATEGORY_SPORTS,
  SUPPLIES_CATEGORY_SAFETY,
  SUPPLIES_CATEGORY_DECOR,
  SUPPLIES_CATEGORY_TECH,
  TRANSPORT_ASSET_CATEGORIES,
  ACCOMMODATION_ASSET_CATEGORIES,
  SUPPLIES_ASSET_CATEGORIES,
  ASSET_CATEGORY_OPTIONS_BY_TYPE,
  isAssetType,
  EVENT_VISIBILITIES,
  EVENT_FEEDBACK_LIST_FILTERS,
  CURRENT_PROFILE_FORM_VERSION,
  USER_GENDERS
};
//# sourceMappingURL=chunk-27OFLLFL.js.map
