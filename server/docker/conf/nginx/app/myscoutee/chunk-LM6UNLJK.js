import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT
} from "./chunk-N7OBXPJA.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/base/builders/pricing.builder.ts
var PricingBuilder = class {
  static createDefaultPricingConfig(context = "event") {
    return {
      enabled: false,
      mode: "fixed",
      basePrice: 0,
      currency: "USD",
      taxMode: "excluded",
      chargeType: "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
      minPrice: null,
      maxPrice: null,
      rounding: "none",
      demandRulesEnabled: false,
      demandRules: [],
      timeRulesEnabled: false,
      timeRules: [],
      cancellationPolicy: {
        enabled: false,
        rules: []
      },
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: {
        enabled: false,
        memberPrice: null,
        vipPrice: null,
        inviteOnlyDiscountPercent: null,
        promoCodes: [],
        soldOutLabel: 'Show "Sold Out"'
      }
    };
  }
  static clonePricingConfig(pricing) {
    const normalized = pricing ?? this.createDefaultPricingConfig();
    return __spreadProps(__spreadValues({}, normalized), {
      quantityRules: (normalized.quantityRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action)
      })),
      demandRules: (normalized.demandRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      timeRules: (normalized.timeRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      cancellationPolicy: {
        enabled: normalized.cancellationPolicy?.enabled === true,
        rules: (normalized.cancellationPolicy?.rules ?? []).map((rule) => __spreadValues({}, rule))
      },
      slotOverrides: (normalized.slotOverrides ?? []).map((item) => __spreadValues({}, item)),
      audience: __spreadProps(__spreadValues({}, normalized.audience), {
        promoCodes: (normalized.audience?.promoCodes ?? []).map((code) => __spreadProps(__spreadValues({}, code), {
          action: __spreadValues({}, code.action)
        }))
      })
    });
  }
  static normalizePricingConfig(value, options = {}) {
    const context = options.context ?? "event";
    const allowSlotFeatures = options.allowSlotFeatures ?? context === "event";
    const slotCatalog = allowSlotFeatures ? options.slotCatalog ?? [] : [];
    const fallback = this.createDefaultPricingConfig(context);
    const source = typeof value === "object" && value !== null ? value : {};
    const audienceSource = typeof source["audience"] === "object" && source["audience"] !== null ? source["audience"] : {};
    const normalized = {
      enabled: this.normalizeBoolean(source["enabled"], this.hasMeaningfulPricingContent(source)),
      mode: this.normalizeMode(source["mode"]),
      basePrice: this.normalizeMoney(source["basePrice"] ?? source["amount"]) ?? fallback.basePrice,
      currency: this.normalizeCurrency(source["currency"]) || fallback.currency,
      taxMode: this.normalizeTaxMode(source["taxMode"]) ?? fallback.taxMode,
      chargeType: this.normalizeChargeType(source["chargeType"]) ?? fallback.chargeType,
      quantityRulesEnabled: this.normalizeBoolean(source["quantityRulesEnabled"], Array.isArray(source["quantityRules"]) && source["quantityRules"].length > 0),
      quantityRules: this.normalizeQuantityRules(source["quantityRules"]),
      minPrice: this.normalizeMoney(source["minPrice"]),
      maxPrice: this.normalizeMoney(source["maxPrice"]),
      rounding: this.normalizeRounding(source["rounding"]) ?? fallback.rounding,
      demandRulesEnabled: this.normalizeBoolean(source["demandRulesEnabled"], Array.isArray(source["demandRules"]) && source["demandRules"].length > 0),
      demandRules: this.normalizeDemandRules(source["demandRules"]),
      timeRulesEnabled: this.normalizeBoolean(source["timeRulesEnabled"], Array.isArray(source["timeRules"]) && source["timeRules"].length > 0),
      timeRules: this.normalizeTimeRules(source["timeRules"]),
      cancellationPolicy: this.normalizeCancellationPolicy(source["cancellationPolicy"]),
      slotPricingEnabled: this.normalizeBoolean(source["slotPricingEnabled"], Array.isArray(source["slotOverrides"]) && source["slotOverrides"].length > 0),
      slotOverrides: this.normalizeSlotOverrides(source["slotOverrides"]),
      audience: {
        enabled: this.normalizeBoolean(audienceSource["enabled"], Array.isArray(audienceSource["promoCodes"]) && audienceSource["promoCodes"].length > 0),
        memberPrice: this.normalizeMoney(audienceSource["memberPrice"]),
        vipPrice: this.normalizeMoney(audienceSource["vipPrice"]),
        inviteOnlyDiscountPercent: this.normalizePercent(audienceSource["inviteOnlyDiscountPercent"]),
        promoCodes: this.normalizePromoCodes(audienceSource["promoCodes"], options.preserveEmptyPromoCodes === true),
        soldOutLabel: this.normalizeText(audienceSource["soldOutLabel"]) || fallback.audience.soldOutLabel
      }
    };
    const allowedChargeTypes = this.allowedChargeTypesForContext(context, allowSlotFeatures, options.allowedChargeTypes);
    normalized.chargeType = allowedChargeTypes.includes(normalized.chargeType) ? normalized.chargeType : allowedChargeTypes[0] ?? fallback.chargeType;
    const slotCatalogIds = new Set(slotCatalog.map((item) => this.normalizeText(item.id)).filter((item) => item.length > 0));
    normalized.demandRules = normalized.demandRules.map((rule) => this.sanitizeRuleScope(rule, slotCatalogIds, allowSlotFeatures));
    normalized.timeRules = normalized.timeRules.map((rule) => this.sanitizeRuleScope(rule, slotCatalogIds, allowSlotFeatures));
    if (!allowSlotFeatures || slotCatalogIds.size === 0) {
      normalized.slotPricingEnabled = false;
      normalized.slotOverrides = [];
    }
    if (!options.preservePriceBounds && normalized.maxPrice !== null && normalized.minPrice !== null && normalized.maxPrice < normalized.minPrice) {
      normalized.maxPrice = normalized.minPrice;
    }
    return this.syncSlotOverrides(normalized, slotCatalog);
  }
  static compactPricingConfig(pricing, options = {}) {
    return this.normalizePricingConfig(pricing, __spreadProps(__spreadValues({}, options), {
      preserveEmptyPromoCodes: false
    }));
  }
  static syncSlotOverrides(pricing, slotCatalog = []) {
    const next = this.clonePricingConfig(pricing);
    const catalogById = new Map(slotCatalog.map((item) => [this.normalizeText(item.id), item]).filter((entry) => Boolean(entry[0])));
    next.slotOverrides = next.slotOverrides.map((item, index) => {
      const slotId = this.normalizeText(item.slotId);
      const linked = slotId ? catalogById.get(slotId) ?? null : null;
      const label = linked?.label?.trim() || this.normalizeText(item.label) || `Slot ${index + 1}`;
      return __spreadProps(__spreadValues({}, item), {
        id: this.normalizeText(item.id) || `slot-override-${index + 1}`,
        slotId: slotId || null,
        label,
        startAt: linked?.startAt ?? item.startAt ?? null,
        endAt: linked?.endAt ?? item.endAt ?? null,
        currency: this.normalizeCurrency(item.currency) || next.currency,
        price: this.normalizeMoney(item.price)
      });
    }).filter((item, index, source) => source.findIndex((candidate) => candidate.id === item.id) === index);
    return next;
  }
  static resolveAssetBorrowPricing(options) {
    const normalized = this.compactPricingConfig(options.pricing, {
      context: "asset",
      allowSlotFeatures: false
    });
    const currency = normalized.currency?.trim() || "USD";
    if (!normalized.enabled) {
      return {
        amount: 0,
        currency,
        rows: []
      };
    }
    const totalQuantity = Math.max(1, Math.trunc(Number(options.totalQuantity) || 1));
    const requestedQuantity = Math.max(1, Math.trunc(Number(options.requestedQuantity) || 1));
    const excludedRequestId = `${options.excludeRequestId ?? ""}`.trim();
    const overlappingCommitted = (options.requests ?? []).filter((request) => !excludedRequestId || request.id !== excludedRequestId).filter((request) => request.status === "accepted" || request.requestKind === "manual" || request.status === "pending" && request.requestKind === "borrow").filter((request) => request.booking?.inventoryApplied !== true).filter((request) => this.isPricingWindowOverlap(request, options.startAtIso, options.endAtIso)).reduce((sum, request) => sum + this.assetRequestQuantity(request), 0);
    const capacityFilledPercent = Math.round(Math.min(totalQuantity, overlappingCommitted + requestedQuantity) / totalQuantity * 100);
    const hoursUntilStart = this.resolveHoursUntilStart(options.startAtIso);
    const billableDays = this.resolveAssetBorrowBillableDays(options.startAtIso, options.endAtIso);
    const rows = [{
      key: "base",
      label: "pricing.asset.daily.rate",
      detail: null,
      amount: normalized.basePrice,
      currency,
      multiplier: 1
    }];
    let nextPrice = normalized.basePrice;
    if (normalized.quantityRulesEnabled) {
      for (const rule of normalized.quantityRules) {
        if (requestedQuantity < rule.minQuantity) {
          continue;
        }
        const previousPrice = nextPrice;
        nextPrice = this.applyPricingAction(nextPrice, rule.action);
        rows.push({
          key: `quantity-rule:${rule.id}`,
          label: "pricing.quantity.adjustment",
          detail: `${rule.minQuantity}+ \xB7 ${this.describePricingAction(rule.action)}`,
          amount: this.roundMoney(nextPrice - previousPrice),
          currency,
          multiplier: 1
        });
      }
    }
    if ((normalized.mode === "demand-based" || normalized.mode === "hybrid") && normalized.demandRulesEnabled) {
      for (const rule of normalized.demandRules) {
        if (this.matchesPricingDemandRule(rule, capacityFilledPercent)) {
          const previousPrice = nextPrice;
          nextPrice = this.applyPricingAction(nextPrice, rule.action);
          rows.push({
            key: `demand:${rule.id}`,
            label: "pricing.demand.adjustment",
            detail: `${capacityFilledPercent}% \xB7 ${this.describePricingAction(rule.action)}`,
            amount: this.roundMoney(nextPrice - previousPrice),
            currency,
            multiplier: 1
          });
        }
      }
    }
    if ((normalized.mode === "time-based" || normalized.mode === "hybrid") && normalized.timeRulesEnabled) {
      for (const rule of normalized.timeRules) {
        if (this.matchesPricingTimeRule(rule, hoursUntilStart, options.startAtIso)) {
          const previousPrice = nextPrice;
          nextPrice = this.applyPricingAction(nextPrice, rule.action);
          rows.push({
            key: `time:${rule.id}`,
            label: "pricing.time.adjustment",
            detail: `${this.describePricingTimeCondition(rule)} \xB7 ${this.describePricingAction(rule.action)}`,
            amount: this.roundMoney(nextPrice - previousPrice),
            currency,
            multiplier: 1
          });
        }
      }
    }
    if (normalized.minPrice !== null) {
      const previousPrice = nextPrice;
      nextPrice = Math.max(normalized.minPrice, nextPrice);
      if (nextPrice !== previousPrice) {
        rows.push({
          key: "min-price",
          label: "pricing.minimum",
          detail: null,
          amount: this.roundMoney(nextPrice - previousPrice),
          currency,
          multiplier: 1
        });
      }
    }
    if (normalized.maxPrice !== null) {
      const previousPrice = nextPrice;
      nextPrice = Math.min(normalized.maxPrice, nextPrice);
      if (nextPrice !== previousPrice) {
        rows.push({
          key: "max-price",
          label: "pricing.maximum",
          detail: null,
          amount: this.roundMoney(nextPrice - previousPrice),
          currency,
          multiplier: 1
        });
      }
    }
    const roundedUnitPrice = this.applyPricingRounding(nextPrice, normalized.rounding);
    if (roundedUnitPrice !== nextPrice) {
      rows.push({
        key: "rounding",
        label: "pricing.rounding",
        detail: null,
        amount: this.roundMoney(roundedUnitPrice - nextPrice),
        currency,
        multiplier: 1
      });
    }
    const durationPrice = this.roundMoney(roundedUnitPrice * billableDays);
    if (billableDays > 1) {
      rows.push({
        key: "duration",
        label: "pricing.asset.billed.duration",
        detail: null,
        amount: this.roundMoney(roundedUnitPrice * (billableDays - 1)),
        currency,
        multiplier: billableDays
      });
    }
    const quantityMultiplier = normalized.chargeType === "per_attendee" ? requestedQuantity : 1;
    if (quantityMultiplier > 1) {
      rows.push({
        key: "quantity",
        label: "pricing.asset.items",
        detail: null,
        amount: this.roundMoney(durationPrice * (quantityMultiplier - 1)),
        currency,
        multiplier: quantityMultiplier
      });
    }
    return {
      amount: this.roundMoney(durationPrice * quantityMultiplier),
      currency,
      rows
    };
  }
  static matchesPricingDemandRule(rule, capacityFilledPercent) {
    if (rule.operator === "lte") {
      return capacityFilledPercent <= rule.capacityFilledPercent;
    }
    return capacityFilledPercent >= rule.capacityFilledPercent;
  }
  static matchesPricingTimeRule(rule, hoursUntilStart, comparisonIso) {
    if (rule.trigger === "specific_date") {
      const start = `${rule.specificDateStart ?? ""}`.trim();
      const end = `${rule.specificDateEnd ?? ""}`.trim();
      if (!start || !end || !comparisonIso) {
        return false;
      }
      const comparisonDate = comparisonIso.slice(0, 10);
      return comparisonDate >= start && comparisonDate <= end;
    }
    if (rule.trigger === "hours_before_start") {
      return hoursUntilStart <= Math.max(0, Number(rule.offsetValue) || 0);
    }
    const dayWindowHours = Math.max(0, Number(rule.offsetValue) || 0) * 24;
    return hoursUntilStart <= dayWindowHours;
  }
  static applyPricingAction(currentPrice, action) {
    const value = Number(action.value) || 0;
    if (action.kind === "set_exact_price") {
      return Math.max(0, value);
    }
    if (action.kind === "increase_amount") {
      return Math.max(0, currentPrice + value);
    }
    if (action.kind === "decrease_amount") {
      return Math.max(0, currentPrice - value);
    }
    const percent = value / 100;
    if (action.kind === "decrease_percent") {
      return Math.max(0, currentPrice * (1 - percent));
    }
    return Math.max(0, currentPrice * (1 + percent));
  }
  static describePricingAction(action) {
    const value = Math.max(0, Number(action.value) || 0);
    switch (action.kind) {
      case "set_exact_price":
        return `= ${value}`;
      case "increase_amount":
        return `+${value}`;
      case "decrease_amount":
        return `-${value}`;
      case "decrease_percent":
        return `-${value}%`;
      default:
        return `+${value}%`;
    }
  }
  static describePricingTimeCondition(rule) {
    if (rule.trigger === "specific_date") {
      return `${rule.specificDateStart ?? ""} \u2013 ${rule.specificDateEnd ?? ""}`.trim();
    }
    const value = Math.max(0, Number(rule.offsetValue) || 0);
    return rule.trigger === "hours_before_start" ? `\u2264 ${value}h` : `\u2264 ${value}d`;
  }
  static roundMoney(value) {
    return Math.round(value * 100) / 100;
  }
  static applyPricingRounding(price, rounding) {
    if (rounding === "whole") {
      return Math.round(price);
    }
    if (rounding === "half") {
      return Math.round(price * 2) / 2;
    }
    return Math.round(price * 100) / 100;
  }
  static resolveHoursUntilStart(startAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    if (!start) {
      return 0;
    }
    return Math.max(0, Math.round((start.getTime() - Date.now()) / (60 * 60 * 1e3)));
  }
  static resolveAssetBorrowBillableDays(startAtIso, endAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(endAtIso);
    if (!start || !end || end.getTime() <= start.getTime()) {
      return 1;
    }
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1e3)));
  }
  static assetRequestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 0));
  }
  static isPricingWindowOverlap(request, startAtIso, endAtIso) {
    const requestStart = this.parseLocalDateMs(request.booking?.startAtIso);
    const requestEnd = this.parseLocalDateMs(request.booking?.endAtIso);
    const windowStart = this.parseLocalDateMs(startAtIso);
    const windowEnd = this.parseLocalDateMs(endAtIso);
    if (requestStart !== null && requestEnd !== null && windowStart !== null && windowEnd !== null) {
      return requestStart < windowEnd && windowStart < requestEnd;
    }
    const requestWindow = [
      `${request.booking?.eventId ?? ""}`.trim(),
      `${request.booking?.subEventId ?? ""}`.trim(),
      `${request.booking?.slotKey ?? ""}`.trim(),
      `${request.booking?.timeframe ?? ""}`.trim()
    ].filter(Boolean).join("|");
    const targetWindow = [startAtIso.trim(), endAtIso.trim()].filter(Boolean).join("|");
    if (requestWindow && targetWindow) {
      return requestWindow === targetWindow;
    }
    return true;
  }
  static parseLocalDateMs(value) {
    const parsed = AppUtils.isoLocalDateTimeToDate(`${value ?? ""}`.trim());
    return parsed ? parsed.getTime() : null;
  }
  static hasMeaningfulPricingContent(source) {
    const basePrice = this.normalizeMoney(source["basePrice"] ?? source["amount"]) ?? 0;
    const quantityRules = Array.isArray(source["quantityRules"]) ? source["quantityRules"].length : 0;
    const demandRules = Array.isArray(source["demandRules"]) ? source["demandRules"].length : 0;
    const timeRules = Array.isArray(source["timeRules"]) ? source["timeRules"].length : 0;
    const slotOverrides = Array.isArray(source["slotOverrides"]) ? source["slotOverrides"].length : 0;
    const cancellationPolicySource = typeof source["cancellationPolicy"] === "object" && source["cancellationPolicy"] !== null ? source["cancellationPolicy"] : {};
    const cancellationRules = Array.isArray(cancellationPolicySource["rules"]) ? cancellationPolicySource["rules"].length : 0;
    const audienceSource = typeof source["audience"] === "object" && source["audience"] !== null ? source["audience"] : {};
    const promoCodes = Array.isArray(audienceSource["promoCodes"]) ? audienceSource["promoCodes"].length : 0;
    const memberPrice = this.normalizeMoney(audienceSource["memberPrice"]);
    const vipPrice = this.normalizeMoney(audienceSource["vipPrice"]);
    const inviteOnlyDiscount = this.normalizePercent(audienceSource["inviteOnlyDiscountPercent"]);
    return basePrice > 0 || demandRules > 0 || quantityRules > 0 || timeRules > 0 || cancellationRules > 0 || slotOverrides > 0 || promoCodes > 0 || memberPrice !== null || vipPrice !== null || inviteOnlyDiscount !== null;
  }
  static slotOverrideFromReference(reference, price = null, currency = "USD") {
    return {
      id: `slot-override-${reference.id}`,
      slotId: reference.id,
      label: reference.label,
      startAt: reference.startAt ?? null,
      endAt: reference.endAt ?? null,
      price,
      currency
    };
  }
  static slotCatalogFromEventSlotTemplates(slots) {
    return slots.map((slot, index) => ({
      id: `${slot.id ?? `slot-${index + 1}`}`.trim() || `slot-${index + 1}`,
      label: `Slot ${index + 1}`,
      startAt: `${slot.startAt ?? ""}`.trim() || null,
      endAt: null
    }));
  }
  static allowedChargeTypesForContext(context, allowSlotFeatures, override) {
    const normalizedOverride = (override ?? []).filter((value, index, source) => (value === "per_attendee" || value === "per_booking" || value === "per_slot") && source.indexOf(value) === index);
    if (normalizedOverride.length > 0) {
      return allowSlotFeatures ? normalizedOverride : normalizedOverride.filter((value) => value !== "per_slot");
    }
    const defaults = context === "asset" ? ["per_booking", "per_attendee"] : ["per_attendee", "per_booking"];
    if (allowSlotFeatures) {
      defaults.push("per_slot");
    }
    return defaults;
  }
  static sanitizeRuleScope(rule, slotCatalogIds, allowSlotFeatures) {
    if (!allowSlotFeatures || slotCatalogIds.size === 0 || rule.appliesTo !== "selected_slots") {
      return __spreadProps(__spreadValues({}, rule), {
        appliesTo: "all_slots",
        slotIds: []
      });
    }
    const slotIds = (rule.slotIds ?? []).map((item) => this.normalizeText(item)).filter((item) => slotCatalogIds.has(item));
    if (slotIds.length === 0) {
      return __spreadProps(__spreadValues({}, rule), {
        appliesTo: "all_slots",
        slotIds: []
      });
    }
    return __spreadProps(__spreadValues({}, rule), {
      slotIds
    });
  }
  static normalizeDemandRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `demand-rule-${index + 1}`,
        operator: this.normalizeDemandOperator(source["operator"]) ?? "gte",
        capacityFilledPercent: this.normalizePercent(source["capacityFilledPercent"]) ?? 50,
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"]),
        appliesTo: this.normalizeRuleScope(source["appliesTo"]) ?? "all_slots",
        slotIds: this.normalizeStringArray(source["slotIds"])
      };
    });
  }
  static normalizeQuantityRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `quantity-rule-${index + 1}`,
        minQuantity: this.normalizePositiveInteger(source["minQuantity"] ?? source["quantity"]) ?? 2,
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"])
      };
    });
  }
  static normalizeTimeRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return __spreadValues({}, this.normalizeTimeRuleDateRange({
        id: this.normalizeText(source["id"]) || `time-rule-${index + 1}`,
        trigger: this.normalizeTimeTrigger(source["trigger"]) ?? "days_before_start",
        offsetValue: this.normalizeOffset(source["offsetValue"]),
        specificDateStart: this.normalizeDate(source["specificDateStart"]),
        specificDateEnd: this.normalizeDate(source["specificDateEnd"]),
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"]),
        appliesTo: this.normalizeRuleScope(source["appliesTo"]) ?? "all_slots",
        slotIds: this.normalizeStringArray(source["slotIds"])
      }));
    });
  }
  static normalizeCancellationPolicy(value) {
    const source = typeof value === "object" && value !== null ? value : {};
    const rules = this.normalizeCancellationRules(source["rules"]);
    return {
      enabled: this.normalizeBoolean(source["enabled"], rules.length > 0),
      rules
    };
  }
  static normalizeCancellationRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      const refundKind = this.normalizeCancellationRefundKind(source["refundKind"]) ?? "percent";
      return {
        id: this.normalizeText(source["id"]) || `cancellation-rule-${index + 1}`,
        offsetUnit: this.normalizeCancellationUnit(source["offsetUnit"]) ?? "days",
        offsetValue: this.normalizeOffset(source["offsetValue"]),
        refundKind,
        refundValue: refundKind === "percent" ? this.normalizePercent(source["refundValue"]) : refundKind === "fixed_amount" ? this.normalizeMoney(source["refundValue"]) : null
      };
    });
  }
  static normalizeSlotOverrides(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `slot-override-${index + 1}`,
        slotId: this.normalizeText(source["slotId"]) || null,
        label: this.normalizeText(source["label"]) || `Slot ${index + 1}`,
        startAt: this.normalizeText(source["startAt"]) || null,
        endAt: this.normalizeText(source["endAt"]) || null,
        price: this.normalizeMoney(source["price"]),
        currency: this.normalizeCurrency(source["currency"]) || null
      };
    });
  }
  static normalizePromoCodes(value, preserveEmpty = false) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `promo-code-${index + 1}`,
        code: this.normalizeText(source["code"]).toUpperCase(),
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"])
      };
    }).filter((item) => preserveEmpty || item.code.length > 0);
  }
  static normalizeAction(actionValue, actionKindValue, rawValue) {
    const source = typeof actionValue === "object" && actionValue !== null ? actionValue : {};
    return {
      kind: this.normalizeActionKind(source["kind"] ?? actionKindValue) ?? "increase_percent",
      value: this.normalizeMoney(source["value"] ?? rawValue) ?? 0
    };
  }
  static normalizeStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => this.normalizeText(item)).filter((item, index, source) => item.length > 0 && source.indexOf(item) === index);
  }
  static normalizeBoolean(value, fallback = false) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "on" || normalized === "enabled") {
        return true;
      }
      if (normalized === "false" || normalized === "off" || normalized === "disabled") {
        return false;
      }
    }
    return fallback;
  }
  static normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }
  static normalizeMoney(value) {
    if (value === null || value === void 0 || value === "") {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.round(parsed * 100) / 100;
  }
  static normalizePercent(value) {
    const parsed = this.normalizeMoney(value);
    if (parsed === null) {
      return null;
    }
    return Math.max(0, Math.min(100, parsed));
  }
  static normalizePositiveInteger(value) {
    const parsed = this.normalizeMoney(value);
    if (parsed === null) {
      return null;
    }
    return Math.max(1, Math.trunc(parsed));
  }
  static normalizeOffset(value) {
    const parsed = this.normalizeMoney(value);
    if (parsed === null) {
      return null;
    }
    return Math.max(0, parsed);
  }
  static normalizeCurrency(value) {
    return this.normalizeText(value).toUpperCase().slice(0, 8);
  }
  static normalizeCancellationUnit(value) {
    const normalized = this.normalizeText(value);
    return normalized === "hours" || normalized === "days" || normalized === "weeks" || normalized === "months" ? normalized : null;
  }
  static normalizeCancellationRefundKind(value) {
    const normalized = this.normalizeText(value);
    return normalized === "percent" || normalized === "fixed_amount" || normalized === "full" || normalized === "none" ? normalized : null;
  }
  static normalizeDate(value) {
    const normalized = this.normalizeText(value);
    return normalized.length > 0 ? normalized : null;
  }
  static normalizeTimeRuleDateRange(rule) {
    const start = rule.specificDateStart;
    const end = rule.specificDateEnd;
    if (!start && !end) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: null,
        specificDateEnd: null
      });
    }
    if (start && !end) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: start,
        specificDateEnd: start
      });
    }
    if (!start && end) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: end,
        specificDateEnd: end
      });
    }
    if ((start ?? "") > (end ?? "")) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: end,
        specificDateEnd: start
      });
    }
    return rule;
  }
  static normalizeMode(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "demand-based" || normalized === "demand") {
      return "demand-based";
    }
    if (normalized === "time-based" || normalized === "time") {
      return "time-based";
    }
    if (normalized === "hybrid") {
      return "hybrid";
    }
    return "fixed";
  }
  static normalizeTaxMode(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "included") {
      return "included";
    }
    if (normalized === "excluded") {
      return "excluded";
    }
    return null;
  }
  static normalizeChargeType(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "per_booking" || normalized === "booking") {
      return "per_booking";
    }
    if (normalized === "per_slot" || normalized === "slot") {
      return "per_slot";
    }
    if (normalized === "per_attendee" || normalized === "attendee" || normalized === "person") {
      return "per_attendee";
    }
    return null;
  }
  static normalizeRounding(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "whole" || normalized === "whole_number") {
      return "whole";
    }
    if (normalized === "half" || normalized === "0.5") {
      return "half";
    }
    if (normalized === "none" || normalized === "no_rounding") {
      return "none";
    }
    return null;
  }
  static normalizeActionKind(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "set_exact_price" || normalized === "exact_price") {
      return "set_exact_price";
    }
    if (normalized === "decrease_percent" || normalized === "discount") {
      return "decrease_percent";
    }
    if (normalized === "decrease_amount" || normalized === "discount_amount" || normalized === "fixed_discount") {
      return "decrease_amount";
    }
    if (normalized === "increase_amount" || normalized === "surcharge_amount" || normalized === "fixed_increase") {
      return "increase_amount";
    }
    if (normalized === "increase_percent" || normalized === "increase") {
      return "increase_percent";
    }
    return null;
  }
  static normalizeRuleScope(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "selected_slots" || normalized === "selected") {
      return "selected_slots";
    }
    if (normalized === "all_slots" || normalized === "all") {
      return "all_slots";
    }
    return null;
  }
  static normalizeDemandOperator(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "lte" || normalized === "<=" || normalized === "lt") {
      return "lte";
    }
    if (normalized === "gte" || normalized === ">=" || normalized === "gt") {
      return "gte";
    }
    return null;
  }
  static normalizeTimeTrigger(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "hours_before_start" || normalized === "hours") {
      return "hours_before_start";
    }
    if (normalized === "specific_date" || normalized === "date") {
      return "specific_date";
    }
    if (normalized === "days_before_start" || normalized === "days") {
      return "days_before_start";
    }
    return null;
  }
};

// src/app/shared/core/base/builders/activity-resource.builder.ts
var ActivityResourceBuilder = class {
  static chatResourceDateRange(chat) {
    const startAtIso = `${chat.contextStartAtIso ?? ""}`.trim();
    const endAtIso = `${chat.contextEndAtIso ?? ""}`.trim();
    return startAtIso && endAtIso ? { startAtIso, endAtIso } : null;
  }
  static authorizationEventId(ownerIdValue, subEventIdValue = "") {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    if (!ownerId) {
      return "";
    }
    let runtimeOwnerId = ownerId;
    if (subEventId) {
      const groupOwnerMarker = ownerId.indexOf(`:${subEventId}:`);
      if (groupOwnerMarker > 0) {
        runtimeOwnerId = ownerId.slice(0, groupOwnerMarker);
      }
    }
    const slotMarker = runtimeOwnerId.indexOf(":slot:");
    return slotMarker > 0 ? runtimeOwnerId.slice(0, slotMarker) : runtimeOwnerId;
  }
  static runtimeResourceScopeIdentity(ref) {
    const resourceOwnerId = `${ref.ownerId ?? ""}`.trim();
    const resourceScopeId = `${ref.subEventId ?? ""}`.trim();
    const groupId = `${ref.groupId ?? ""}`.trim();
    const memberOwnerId = `${ref.memberOwnerId ?? ""}`.trim();
    const memberOwnerType = ref.memberOwnerType === "event" ? "event" : "group";
    const isMainEvent = !groupId && `${ref.runtimeKind ?? ""}`.trim().toUpperCase() === "MAIN_EVENT";
    const eventId = `${ref.eventId ?? ""}`.trim() || this.authorizationEventId(resourceOwnerId, resourceScopeId);
    if (groupId) {
      const suffix = `:${resourceScopeId}:${groupId}`;
      const chatOwnerId = resourceOwnerId && resourceScopeId ? resourceOwnerId.endsWith(suffix) ? resourceOwnerId : `${resourceOwnerId}${suffix}` : "";
      return {
        isMainEvent: false,
        eventId,
        resourceOwnerId,
        resourceScopeId,
        memberOwner: memberOwnerId ? { ownerType: memberOwnerType, ownerId: memberOwnerId } : resourceOwnerId ? { ownerType: "group", ownerId: resourceOwnerId } : null,
        chatChannelType: chatOwnerId ? "groupSubEvent" : null,
        chatOwnerId
      };
    }
    if (isMainEvent) {
      return {
        isMainEvent: true,
        eventId,
        resourceOwnerId,
        resourceScopeId,
        memberOwner: eventId ? { ownerType: "event", ownerId: eventId } : null,
        chatChannelType: eventId ? "mainEvent" : null,
        chatOwnerId: eventId
      };
    }
    const subEventOwnerId = resourceOwnerId && resourceScopeId ? `${resourceOwnerId}:${resourceScopeId}` : resourceScopeId || resourceOwnerId;
    return {
      isMainEvent: false,
      eventId,
      resourceOwnerId,
      resourceScopeId,
      memberOwner: subEventOwnerId ? { ownerType: "subEvent", ownerId: subEventOwnerId } : null,
      chatChannelType: resourceOwnerId && resourceScopeId ? "optionalSubEvent" : null,
      chatOwnerId: resourceOwnerId && resourceScopeId ? subEventOwnerId : ""
    };
  }
  static runtimeResourceTarget(ref) {
    const id = `${ref.subEventId ?? ""}`.trim();
    if (!id) {
      return null;
    }
    const runtimeKind = `${ref.runtimeKind ?? ""}`.trim() || null;
    const isMainEvent = runtimeKind?.toUpperCase() === "MAIN_EVENT";
    const eventId = `${ref.eventId ?? ""}`.trim() || (isMainEvent ? this.authorizationEventId(`${ref.ownerId ?? ""}`, id) : "");
    return {
      id,
      runtimeKind,
      eventId: eventId || null,
      name: `${ref.name ?? ""}`.trim() || (isMainEvent ? "Event" : "Sub Event"),
      description: `${ref.description ?? ""}`.trim(),
      location: `${ref.location ?? ""}`.trim(),
      startAt: `${ref.startAt ?? ""}`.trim(),
      endAt: `${ref.endAt ?? ""}`.trim(),
      optional: !isMainEvent,
      capacityMin: 0,
      capacityMax: 0,
      membersAccepted: 0,
      membersPending: 0,
      carsPending: 0,
      accommodationPending: 0,
      suppliesPending: 0,
      carsAccepted: 0,
      accommodationAccepted: 0,
      suppliesAccepted: 0
    };
  }
  static ownerKey(ref) {
    return `${ref.assetOwnerUserId}:${ref.ownerId}`;
  }
  static recordId(ref) {
    return `${ref.assetOwnerUserId}:${ref.ownerId}:${ref.subEventId}`;
  }
  static scopeId(ref) {
    return `${ref.ownerId}:${ref.subEventId}:${ref.assetOwnerUserId}`;
  }
  static createEmptyState(ref) {
    return {
      ownerId: ref.ownerId.trim(),
      subEventId: ref.subEventId.trim(),
      assetOwnerUserId: ref.assetOwnerUserId.trim(),
      assetAssignmentIds: {},
      assetSettingsByType: {},
      supplyContributionEntriesByAssetId: {},
      fallbackAssetCardsByType: {},
      resourceMetricsByType: {}
    };
  }
  static hasResourceData(state) {
    if (!state) {
      return false;
    }
    return ASSET_TYPES.some((type) => (state.assetAssignmentIds?.[type] ?? []).length > 0 || Object.keys(state.assetSettingsByType?.[type] ?? {}).length > 0) || Object.values(state.supplyContributionEntriesByAssetId ?? {}).some((entries) => (entries ?? []).length > 0);
  }
  static cloneState(state) {
    if (!state) {
      return null;
    }
    return {
      ownerId: `${state.ownerId ?? ""}`.trim(),
      subEventId: `${state.subEventId ?? ""}`.trim(),
      assetOwnerUserId: `${state.assetOwnerUserId ?? ""}`.trim(),
      assetAssignmentIds: this.cloneAssetAssignmentIds(state.assetAssignmentIds),
      assetSettingsByType: this.cloneAssetSettingsByType(state.assetSettingsByType),
      supplyContributionEntriesByAssetId: this.cloneSupplyContributionEntriesByAssetId(state.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: this.cloneFallbackAssetCardsByType(state.fallbackAssetCardsByType),
      resourceMetricsByType: this.cloneResourceMetricsByType(state.resourceMetricsByType)
    };
  }
  static normalizeState(state, fallbackRef) {
    const fallback = fallbackRef ? this.createEmptyState(fallbackRef) : null;
    if (!state && !fallback) {
      return null;
    }
    const next = this.cloneState(state) ?? fallback;
    if (!next) {
      return null;
    }
    if (!next.ownerId || !next.subEventId || !next.assetOwnerUserId) {
      return fallback;
    }
    next.assetAssignmentIds = this.cloneAssetAssignmentIds(next.assetAssignmentIds);
    next.assetSettingsByType = this.cloneAssetSettingsByType(next.assetSettingsByType);
    next.supplyContributionEntriesByAssetId = this.cloneSupplyContributionEntriesByAssetId(next.supplyContributionEntriesByAssetId);
    next.fallbackAssetCardsByType = this.cloneFallbackAssetCardsByType(next.fallbackAssetCardsByType);
    next.resourceMetricsByType = this.cloneResourceMetricsByType(next.resourceMetricsByType);
    return next;
  }
  static normalizeScope(scope, viewerRef) {
    const viewerState = this.normalizeState(scope?.viewerState, viewerRef) ?? this.createEmptyState(viewerRef);
    const visibleByRecordId = /* @__PURE__ */ new Map();
    for (const source of scope?.visibleStates ?? []) {
      const state = this.normalizeState(source);
      if (!state || state.ownerId !== viewerRef.ownerId || state.subEventId !== viewerRef.subEventId) {
        continue;
      }
      visibleByRecordId.set(this.recordId(state), state);
    }
    if (viewerState.assetAssignmentIds && Object.keys(viewerState.assetAssignmentIds).length > 0 || viewerState.assetSettingsByType && Object.keys(viewerState.assetSettingsByType).length > 0 || Object.keys(viewerState.supplyContributionEntriesByAssetId ?? {}).length > 0) {
      visibleByRecordId.set(this.recordId(viewerState), viewerState);
    }
    return {
      viewerState: this.cloneState(viewerState) ?? this.createEmptyState(viewerRef),
      visibleStates: [...visibleByRecordId.values()].sort((left, right) => left.assetOwnerUserId.localeCompare(right.assetOwnerUserId)).map((state) => this.cloneState(state))
    };
  }
  static cloneResourceMetricsByType(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const metric = source?.[type];
      if (!metric) {
        continue;
      }
      next[type] = {
        accepted: Math.max(0, Math.trunc(Number(metric.accepted) || 0)),
        pending: Math.max(0, Math.trunc(Number(metric.pending) || 0)),
        capacityMin: Math.max(0, Math.trunc(Number(metric.capacityMin) || 0)),
        capacityMax: Math.max(0, Math.trunc(Number(metric.capacityMax) || 0))
      };
    }
    return next;
  }
  static withPersistedResourceMetrics(subEvent, state) {
    const next = __spreadValues({}, subEvent);
    const metrics = this.cloneResourceMetricsByType(state?.resourceMetricsByType);
    const transport = metrics[ASSET_TYPE_TRANSPORT];
    if (transport) {
      next.carsAccepted = transport.accepted;
      next.carsPending = transport.pending;
      next.carsCapacityMin = transport.capacityMin;
      next.carsCapacityMax = transport.capacityMax;
    }
    const accommodation = metrics[ASSET_TYPE_ACCOMMODATION];
    if (accommodation) {
      next.accommodationAccepted = accommodation.accepted;
      next.accommodationPending = accommodation.pending;
      next.accommodationCapacityMin = accommodation.capacityMin;
      next.accommodationCapacityMax = accommodation.capacityMax;
    }
    const supplies = metrics[ASSET_TYPE_SUPPLIES];
    if (supplies) {
      next.suppliesAccepted = supplies.accepted;
      next.suppliesPending = supplies.pending;
      next.suppliesCapacityMin = supplies.capacityMin;
      next.suppliesCapacityMax = supplies.capacityMax;
    }
    return next;
  }
  static cloneAssetAssignmentIds(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const ids = Array.isArray(source?.[type]) ? source?.[type] : [];
      const normalizedIds = Array.from(new Set(ids.map((id) => `${id ?? ""}`.trim()).filter((id) => id.length > 0)));
      if (normalizedIds.length > 0) {
        next[type] = normalizedIds;
      }
    }
    return next;
  }
  static cloneAssetSettingsByType(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const rawMap = source?.[type];
      if (!rawMap || typeof rawMap !== "object") {
        continue;
      }
      const normalizedMap = {};
      for (const [assetId, settings] of Object.entries(rawMap)) {
        const normalizedAssetId = `${assetId ?? ""}`.trim();
        if (!normalizedAssetId || !settings) {
          continue;
        }
        const routes = this.normalizeRoutes(settings.routes);
        normalizedMap[normalizedAssetId] = {
          capacityMin: Math.max(0, Math.trunc(Number(settings.capacityMin) || 0)),
          capacityMax: Math.max(0, Math.trunc(Number(settings.capacityMax) || 0)),
          quantity: Math.max(0, Math.trunc(Number(settings.quantity) || 0)),
          addedByUserId: `${settings.addedByUserId ?? ""}`.trim(),
          routeEnabled: this.normalizeRouteEnabled(settings, routes),
          routes
        };
      }
      if (Object.keys(normalizedMap).length > 0) {
        next[type] = normalizedMap;
      }
    }
    return next;
  }
  static cloneSupplyContributionEntriesByAssetId(source) {
    const next = {};
    if (!source || typeof source !== "object") {
      return next;
    }
    for (const [assetId, rawEntries] of Object.entries(source)) {
      const normalizedAssetId = `${assetId ?? ""}`.trim();
      if (!normalizedAssetId || !Array.isArray(rawEntries)) {
        continue;
      }
      const entries = rawEntries.map((entry) => ({
        id: `${entry?.id ?? ""}`.trim(),
        userId: `${entry?.userId ?? ""}`.trim(),
        quantity: Math.max(0, Math.trunc(Number(entry?.quantity) || 0)),
        addedAtIso: `${entry?.addedAtIso ?? ""}`.trim()
      })).filter((entry) => entry.id.length > 0 && entry.userId.length > 0 && entry.quantity > 0).sort((left, right) => AppUtils.toSortableDate(left.addedAtIso) - AppUtils.toSortableDate(right.addedAtIso));
      if (entries.length > 0) {
        next[normalizedAssetId] = entries;
      }
    }
    return next;
  }
  static cloneFallbackAssetCardsByType(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const cards = source?.[type];
      if (!Array.isArray(cards) || cards.length === 0) {
        continue;
      }
      next[type] = cards.map((card) => this.cloneAssetCard(card));
    }
    return next;
  }
  static resolveAssignedAssetIds(state, type, assets) {
    const eligibleIds = this.resolveAvailableAssetCards(type, state, assets).map((card) => card.id);
    const eligible = new Set(eligibleIds);
    const stored = state?.assetAssignmentIds?.[type] ?? [];
    return stored.filter((id) => eligible.has(id));
  }
  static resolveAssignedAssetSettings(state, type) {
    return __spreadValues({}, state?.assetSettingsByType?.[type] ?? {});
  }
  static resolveSupplyContributionEntries(state, assetId) {
    const normalizedAssetId = assetId.trim();
    if (!normalizedAssetId) {
      return [];
    }
    return [
      ...state?.supplyContributionEntriesByAssetId?.[normalizedAssetId] ?? []
    ].map((entry) => __spreadValues({}, entry));
  }
  static resourceAcceptedCount(subEvent, type, state, assets) {
    const assignedCards = this.resolveAssignedCards(type, state, assets);
    if (assignedCards.length > 0) {
      if (type === ASSET_TYPE_SUPPLIES) {
        return assignedCards.reduce((sum, card) => sum + this.resolveSupplyContributionEntries(state, card.id).reduce((entrySum, entry) => entrySum + Math.max(0, Math.trunc(Number(entry.quantity) || 0)), 0), 0);
      }
      return assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, subEvent.id, "accepted", state?.ownerId), 0);
    }
    if (state) {
      return 0;
    }
    if (type === ASSET_TYPE_TRANSPORT) {
      return Math.max(0, Math.trunc(Number(subEvent.carsAccepted) || 0));
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return Math.max(0, Math.trunc(Number(subEvent.accommodationAccepted) || 0));
    }
    return Math.max(0, Math.trunc(Number(subEvent.suppliesAccepted) || 0));
  }
  static resourcePendingCount(subEvent, type, state, assets) {
    const assignedCards = this.resolveAssignedCards(type, state, assets);
    if (assignedCards.length > 0) {
      if (type === ASSET_TYPE_SUPPLIES) {
        return 0;
      }
      return assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, subEvent.id, "pending", state?.ownerId), 0);
    }
    if (state) {
      return 0;
    }
    if (type === ASSET_TYPE_TRANSPORT) {
      return Math.max(0, Math.trunc(Number(subEvent.carsPending) || 0));
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return Math.max(0, Math.trunc(Number(subEvent.accommodationPending) || 0));
    }
    return Math.max(0, Math.trunc(Number(subEvent.suppliesPending) || 0));
  }
  static resourceCapacityBounds(subEvent, type, state, assets, accepted, pending) {
    const assignedCards = this.resolveAssignedCards(type, state, assets);
    if (assignedCards.length > 0) {
      const settings = this.resolveAssignedAssetSettings(state, type);
      return {
        capacityMin: 0,
        capacityMax: assignedCards.reduce((sum, card) => sum + Math.max(0, Math.trunc(Number(settings[card.id]?.capacityMax ?? card.capacityTotal) || 0)), 0)
      };
    }
    if (state) {
      return { capacityMin: 0, capacityMax: 0 };
    }
    const observed = Math.max(accepted, accepted + pending);
    if (type === ASSET_TYPE_TRANSPORT) {
      const min2 = Math.max(0, Math.trunc(Number(subEvent.carsCapacityMin) || 0));
      const max2 = Math.max(min2, Math.trunc(Number(subEvent.carsCapacityMax) || observed));
      return { capacityMin: min2, capacityMax: max2 };
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      const min2 = Math.max(0, Math.trunc(Number(subEvent.accommodationCapacityMin) || 0));
      const max2 = Math.max(min2, Math.trunc(Number(subEvent.accommodationCapacityMax) || observed));
      return { capacityMin: min2, capacityMax: max2 };
    }
    const min = Math.max(0, Math.trunc(Number(subEvent.suppliesCapacityMin) || 0));
    const max = Math.max(min, Math.trunc(Number(subEvent.suppliesCapacityMax) || observed));
    return { capacityMin: min, capacityMax: max };
  }
  static buildPersistedResourceMetrics(state, assets) {
    return Object.fromEntries(ASSET_TYPES.map((type) => {
      const assignedCards = this.resolveAssignedCards(type, state, assets);
      const settings = this.resolveAssignedAssetSettings(state, type);
      const accepted = type === ASSET_TYPE_SUPPLIES ? Object.values(state.supplyContributionEntriesByAssetId ?? {}).flat().reduce((sum, entry) => sum + Math.max(0, Math.trunc(Number(entry.quantity) || 0)), 0) : assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, state.subEventId, "accepted", state.ownerId), 0);
      const pending = type === ASSET_TYPE_SUPPLIES ? 0 : assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, state.subEventId, "pending", state.ownerId), 0);
      const capacityMin = assignedCards.reduce((sum, card) => sum + Math.max(0, Math.trunc(Number(settings[card.id]?.capacityMin) || 0)), 0);
      const capacityMax = assignedCards.reduce((sum, card) => sum + Math.max(0, Math.trunc(Number(settings[card.id]?.capacityMax ?? card.capacityTotal) || 0)), 0);
      return [type, {
        accepted,
        pending,
        capacityMin,
        capacityMax: Math.max(capacityMin, capacityMax)
      }];
    }));
  }
  static resolveAssignedCards(type, state, assets) {
    const assignedIds = this.resolveAssignedAssetIds(state, type, assets);
    const availableCards = this.resolveAvailableAssetCards(type, state, assets);
    return assignedIds.map((id) => availableCards.find((card) => card.id === id && card.type === type) ?? null).filter((card) => card !== null);
  }
  static resolveAvailableAssetCards(type, state, assets) {
    const nextById = /* @__PURE__ */ new Map();
    for (const card of assets) {
      if (card.type !== type) {
        continue;
      }
      nextById.set(card.id, card);
    }
    for (const card of state?.fallbackAssetCardsByType?.[type] ?? []) {
      if (card.type !== type || nextById.has(card.id)) {
        continue;
      }
      nextById.set(card.id, card);
    }
    return [...nextById.values()];
  }
  static isSubEventManualAssignmentRequest(request, subEventId) {
    const normalizedSubEventId = subEventId.trim();
    const requestId = `${request.id ?? ""}`.trim();
    return request.requestKind === "manual" && normalizedSubEventId.length > 0 && requestId.startsWith(`manual:${normalizedSubEventId}:`);
  }
  static isSubEventScopedAssetRequest(request, subEventId, ownerId) {
    const normalizedSubEventId = subEventId.trim();
    const normalizedOwnerId = `${ownerId ?? ""}`.trim();
    const bookingOwnerId = `${request.booking?.eventId ?? ""}`.trim();
    const ownerIdsMatchExactly = bookingOwnerId === normalizedOwnerId;
    const groupOwnerMarker = normalizedSubEventId ? `:${normalizedSubEventId}:` : "";
    const ownerIsUngroupedSlotRuntime = normalizedOwnerId.includes(":slot:") && (!groupOwnerMarker || !normalizedOwnerId.includes(groupOwnerMarker));
    const bookingIsUngroupedSlotRuntime = bookingOwnerId.includes(":slot:") && (!groupOwnerMarker || !bookingOwnerId.includes(groupOwnerMarker));
    const ownerIdsMatchSlotAuthorizationScope = (ownerIsUngroupedSlotRuntime || bookingIsUngroupedSlotRuntime) && this.authorizationEventId(normalizedOwnerId, normalizedSubEventId) === this.authorizationEventId(bookingOwnerId, normalizedSubEventId);
    if (normalizedOwnerId && !ownerIdsMatchExactly && !ownerIdsMatchSlotAuthorizationScope) {
      return false;
    }
    return this.isSubEventManualAssignmentRequest(request, normalizedSubEventId) || `${request.booking?.subEventId ?? ""}`.trim() === normalizedSubEventId;
  }
  static assetRequestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 1));
  }
  static subEventOccupancyRequestCount(card, subEventId, status, ownerId) {
    const normalizedSubEventId = subEventId.trim();
    if (!normalizedSubEventId) {
      return 0;
    }
    return card.requests.filter((request) => request.status === status && this.isSubEventScopedAssetRequest(request, normalizedSubEventId, ownerId) && !this.isSubEventManualAssignmentRequest(request, normalizedSubEventId)).length;
  }
  static assetRequestSyncSignature(request) {
    return JSON.stringify({
      id: request.id,
      userId: request.userId ?? "",
      status: request.status,
      requestKind: request.requestKind ?? "",
      bookingQuantity: request.booking?.quantity ?? "",
      bookingAcceptedPolicyIds: [...request.booking?.acceptedPolicyIds ?? []]
    });
  }
  static subEventAssetAssignmentKey(subEventId, type) {
    return `${subEventId}:${type}`;
  }
  static subEventSupplyAssignmentKey(subEventId, cardId) {
    return `${subEventId}:${cardId}`;
  }
  static assetDetailText(card) {
    return `${card.details ?? card.description ?? ""}`.trim();
  }
  static assetSourceLink(card) {
    return `${card.sourceLink ?? ""}`.trim();
  }
  static normalizeAssetRoutes(type, routes) {
    if (type === ASSET_TYPE_SUPPLIES) {
      return [];
    }
    const cleaned = (routes ?? []).map((value) => `${value ?? ""}`.trim()).filter((value, index, arr) => value.length > 0 && arr.indexOf(value) === index);
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return cleaned.length > 0 ? [cleaned[0]] : [""];
    }
    return cleaned.length > 0 ? cleaned : [""];
  }
  static assetRequestTimeframeLabel(startAtIso, endAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(endAtIso);
    if (!start || !end) {
      return "";
    }
    const sameDay = start.toDateString() === end.toDateString();
    const startDate = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endDate = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return sameDay ? `${startDate} \xB7 ${startTime} - ${endTime}` : `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  static defaultAssetExploreRange(subEvent) {
    const startAtIso = `${subEvent.startAt ?? ""}`.trim() || AppUtils.toIsoDateTimeLocal(/* @__PURE__ */ new Date());
    const endAtIso = `${subEvent.endAt ?? ""}`.trim();
    if (endAtIso) {
      return {
        startAtIso,
        endAtIso
      };
    }
    const base = AppUtils.isoLocalDateTimeToDate(startAtIso) ?? /* @__PURE__ */ new Date();
    const nextEnd = new Date(base);
    nextEnd.setHours(nextEnd.getHours() + 2);
    return {
      startAtIso,
      endAtIso: AppUtils.toIsoDateTimeLocal(nextEnd)
    };
  }
  static cloneAssetCard(card) {
    return __spreadProps(__spreadValues({}, card), {
      routes: [...card.routes ?? []],
      topics: [...card.topics ?? []],
      policies: (card.policies ?? []).map((item) => __spreadValues({}, item)),
      pricing: card.pricing ? PricingBuilder.clonePricingConfig(card.pricing) : void 0,
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      }))
    });
  }
  static normalizeRoutes(routes) {
    if (!Array.isArray(routes)) {
      return [];
    }
    return routes.map((route) => `${route ?? ""}`.trim()).filter((route) => route.length > 0);
  }
  static normalizeRouteEnabled(settings, routes) {
    return typeof settings.routeEnabled === "boolean" ? settings.routeEnabled : routes.length > 0;
  }
};

export {
  PricingBuilder,
  ActivityResourceBuilder
};
//# sourceMappingURL=chunk-LM6UNLJK.js.map
