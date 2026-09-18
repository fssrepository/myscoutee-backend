import {
  CalendarCardComponent,
  SmartListCalendarAdapter,
  UiPollCoordinator,
  UiTaskScheduler
} from "./chunk-V477GJDH.js";
import {
  AppMenuDispatcher,
  AppMenuOutletComponent,
  I18nPipe,
  IndicatorComponent,
  MatIcon,
  MatIconModule
} from "./chunk-J4QS2YUJ.js";
import {
  AppUtils
} from "./chunk-QZPIQIRC.js";
import {
  CommonModule,
  NgClass,
  NgTemplateOutlet
} from "./chunk-JMCIB2VE.js";
import {
  ROUTE_CONFIG
} from "./chunk-52XNNRXY.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  NgZone,
  Output,
  ViewChild,
  __spreadProps,
  __spreadValues,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/core/smart-list/smart-list-timeline.adapter.ts
var TIMELINE_EPOCH_MS = Date.UTC(2e3, 0, 1, 0, 0, 0, 0);
var DEFAULT_TIMELINE_STEP_MINUTES = 30;
var DEFAULT_TIMELINE_VISIBLE_DURATION_MINUTES = 4 * 60;
var DEFAULT_TIMELINE_ROW_HEIGHT_PX = 64;
var smartListTimelineAdapter = createTimelineAdapter();
var SmartListTimelineAdapter = {
  getInstance(mode) {
    if (mode === "timeline") {
      return smartListTimelineAdapter;
    }
    return null;
  }
};
function createTimelineAdapter() {
  return {
    mode: "timeline",
    config: timelineConfig,
    variant: () => "default",
    anchorRadius,
    initialAnchor,
    initialAnchorKey,
    normalizeAnchor,
    keyForAnchor,
    shiftAnchor,
    queryForAnchor,
    anchorForPage: (page) => page.anchor,
    labelForPage: (page) => page.label,
    buildPage: (context) => buildTimelinePage(context)
  };
}
function timelineConfig(config) {
  return config.timeline ?? null;
}
function anchorRadius(timeline) {
  return Math.max(0, Math.trunc(timeline?.anchorRadius ?? 1));
}
function initialAnchor(timeline, query) {
  const offset = initialOffsetMinutes(timeline, query);
  return dateFromOffsetMinutes(offset);
}
function initialAnchorKey(timeline, query) {
  return keyForOffsetMinutes(initialOffsetMinutes(timeline, query));
}
function normalizeAnchor(anchor, timeline, query) {
  const startOffset = startOffsetMinutes(timeline, query);
  const pageStep = pageStepMinutes(timeline, query);
  const offset = offsetMinutesFromDate(anchor);
  const pageIndex = Math.round((offset - startOffset) / pageStep);
  return dateFromOffsetMinutes(startOffset + pageIndex * pageStep);
}
function keyForAnchor(anchor, _timeline, _query) {
  return keyForOffsetMinutes(offsetMinutesFromDate(anchor));
}
function shiftAnchor(anchor, direction, timeline, query) {
  const normalized = normalizeAnchor(anchor, timeline, query);
  return dateFromOffsetMinutes(offsetMinutesFromDate(normalized) + direction * pageStepMinutes(timeline, query));
}
function queryForAnchor(query, anchor, timeline) {
  const startOffset = offsetMinutesFromDate(anchor);
  const endOffset = startOffset + visibleDurationMinutes(timeline, query);
  return __spreadProps(__spreadValues({}, query), {
    page: 0,
    cursor: void 0,
    anchorDate: `${startOffset}`,
    rangeStart: `${startOffset}`,
    rangeEnd: `${endOffset}`
  });
}
function buildTimelinePage(context) {
  const startOffset = offsetMinutesFromDate(context.anchor);
  const visibleDuration = visibleDurationMinutes(context.viewConfig, context.query);
  const endOffset = startOffset + visibleDuration;
  const step = stepMinutes(context.viewConfig, context.query);
  const rowHeightPx = timelineRowHeightPx(context.viewConfig, context.query);
  const ticks = timelineTicks(startOffset, endOffset, step, context.viewConfig, context.query);
  const candidates = timelineSpanCandidates(context.items, startOffset, endOffset, context);
  const rows = assignTimelineRows(candidates);
  const configuredRows = resolvedOptionalPositiveInteger(context.viewConfig.rowCount, null, context.query);
  const rowCount = Math.max(1, configuredRows ?? 0, rows.rowCount);
  const spans = rows.candidates.map((candidate) => timelineSpanFromCandidate(candidate, startOffset, visibleDuration, rowHeightPx, context));
  return {
    key: keyForOffsetMinutes(startOffset),
    label: `${formatOffsetMinutes(startOffset)} - ${formatOffsetMinutes(endOffset)}`,
    anchor: dateFromOffsetMinutes(startOffset),
    startOffsetMinutes: startOffset,
    endOffsetMinutes: endOffset,
    visibleDurationMinutes: visibleDuration,
    stepMinutes: step,
    rowCount,
    rowHeightPx,
    ticks,
    spans
  };
}
function timelineTicks(startOffset, endOffset, step, timeline, query) {
  const count = Math.max(1, Math.ceil((endOffset - startOffset) / step));
  return Array.from({ length: count }, (_item, index) => {
    const offset = startOffset + index * step;
    const customLabel = timeline.offsetLabel?.(offset, query);
    return {
      key: `${offset}`,
      offsetMinutes: offset,
      label: typeof customLabel === "string" && customLabel.trim() ? customLabel : formatOffsetMinutes(offset)
    };
  });
}
function timelineSpanCandidates(items, pageStartOffset, pageEndOffset, context) {
  const candidates = [];
  const minimumLaneDuration = minimumLaneDurationMinutes(context.viewConfig, context.query);
  for (const item of items) {
    const range = normalizeTimelineRange(context.viewConfig.resolveRange(item, context.query));
    if (!range) {
      continue;
    }
    if (range.startOffsetMinutes >= pageEndOffset || range.endOffsetMinutes <= pageStartOffset) {
      continue;
    }
    const visibleStartOffsetMinutes = Math.max(range.startOffsetMinutes, pageStartOffset);
    const visibleEndOffsetMinutes = Math.min(range.endOffsetMinutes, pageEndOffset);
    candidates.push({
      item,
      startOffsetMinutes: range.startOffsetMinutes,
      endOffsetMinutes: range.endOffsetMinutes,
      visibleStartOffsetMinutes,
      visibleEndOffsetMinutes,
      collisionStartOffsetMinutes: visibleStartOffsetMinutes,
      collisionEndOffsetMinutes: Math.min(pageEndOffset, Math.max(visibleEndOffsetMinutes, visibleStartOffsetMinutes + minimumLaneDuration)),
      row: normalizedRow(range.row)
    });
  }
  return candidates.sort((first, second) => first.visibleStartOffsetMinutes - second.visibleStartOffsetMinutes || second.visibleEndOffsetMinutes - first.visibleEndOffsetMinutes);
}
function assignTimelineRows(candidates) {
  const lanes = [];
  const assigned = [];
  for (const candidate of candidates) {
    const row = candidate.row ?? firstAvailableTimelineRow(lanes, candidate);
    if (!lanes[row]) {
      lanes[row] = [];
    }
    lanes[row].push({
      startOffsetMinutes: candidate.collisionStartOffsetMinutes,
      endOffsetMinutes: candidate.collisionEndOffsetMinutes
    });
    assigned.push(__spreadProps(__spreadValues({}, candidate), { row }));
  }
  return {
    candidates: assigned,
    rowCount: lanes.length
  };
}
function firstAvailableTimelineRow(lanes, candidate) {
  let row = 0;
  while (row < lanes.length) {
    const conflict = lanes[row].some((item) => candidate.collisionStartOffsetMinutes < item.endOffsetMinutes && candidate.collisionEndOffsetMinutes > item.startOffsetMinutes);
    if (!conflict) {
      return row;
    }
    row += 1;
  }
  return row;
}
function timelineSpanFromCandidate(candidate, pageStartOffset, visibleDuration, rowHeightPx, context) {
  const row = candidate.row ?? 0;
  const label = timelineBadgeLabel(candidate.item, context);
  const meta = context.viewConfig.badgeMeta?.(candidate.item, context.query)?.trim() || null;
  const toneClass = context.viewConfig.badgeToneClass?.(candidate.item, context.query) ?? null;
  const customAriaLabel = context.viewConfig.badgeAriaLabel?.(candidate.item, context.query)?.trim();
  const rangeLabel = `${formatOffsetMinutes(candidate.startOffsetMinutes)} - ${formatOffsetMinutes(candidate.endOffsetMinutes)}`;
  return {
    key: [
      context.trackByKey(candidate.item),
      pageStartOffset,
      candidate.visibleStartOffsetMinutes,
      candidate.visibleEndOffsetMinutes,
      row
    ].join(":"),
    item: candidate.item,
    startOffsetMinutes: candidate.startOffsetMinutes,
    endOffsetMinutes: candidate.endOffsetMinutes,
    visibleStartOffsetMinutes: candidate.visibleStartOffsetMinutes,
    visibleEndOffsetMinutes: candidate.visibleEndOffsetMinutes,
    row,
    leftPct: (candidate.visibleStartOffsetMinutes - pageStartOffset) / visibleDuration * 100,
    widthPct: Math.max(1.4, (candidate.visibleEndOffsetMinutes - candidate.visibleStartOffsetMinutes) / visibleDuration * 100),
    topPx: row * rowHeightPx + 6,
    heightPx: Math.max(32, rowHeightPx - 12),
    label,
    meta,
    ariaLabel: customAriaLabel || `${label}, ${rangeLabel}`,
    toneClass,
    continuesBefore: candidate.startOffsetMinutes < candidate.visibleStartOffsetMinutes,
    continuesAfter: candidate.endOffsetMinutes > candidate.visibleEndOffsetMinutes
  };
}
function normalizeTimelineRange(range) {
  if (!range) {
    return null;
  }
  const start = Math.trunc(Number(range.startOffsetMinutes));
  const end = Math.trunc(Number(range.endOffsetMinutes));
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return null;
  }
  return {
    startOffsetMinutes: start,
    endOffsetMinutes: Math.max(start + 1, end),
    row: range.row
  };
}
function timelineBadgeLabel(item, context) {
  const custom = context.viewConfig.badgeLabel?.(item, context.query);
  if (typeof custom === "string" && custom.trim()) {
    return custom;
  }
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }
  if (item && typeof item === "object") {
    const candidate = item.title ?? item.name ?? item.label;
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return "Item";
}
function initialOffsetMinutes(timeline, query) {
  const configured = resolveConfigValue(timeline?.initialOffsetMinutes, null, query);
  if (Number.isFinite(Number(configured))) {
    return Math.trunc(Number(configured));
  }
  return startOffsetMinutes(timeline, query);
}
function startOffsetMinutes(timeline, query) {
  return resolvedInteger(timeline?.startOffsetMinutes, 0, query);
}
function stepMinutes(timeline, query) {
  return Math.max(1, resolvedInteger(timeline?.stepMinutes, DEFAULT_TIMELINE_STEP_MINUTES, query));
}
function visibleDurationMinutes(timeline, query) {
  const visible = Math.max(1, resolvedInteger(timeline?.visibleDurationMinutes, DEFAULT_TIMELINE_VISIBLE_DURATION_MINUTES, query));
  return Math.max(stepMinutes(timeline, query), visible);
}
function pageStepMinutes(timeline, query) {
  return Math.max(1, resolvedInteger(timeline?.pageStepMinutes, visibleDurationMinutes(timeline, query), query));
}
function timelineRowHeightPx(timeline, query) {
  return Math.max(44, resolvedInteger(timeline.rowHeightPx, DEFAULT_TIMELINE_ROW_HEIGHT_PX, query));
}
function minimumLaneDurationMinutes(timeline, query) {
  return Math.max(1, resolvedInteger(timeline.minimumLaneDurationMinutes, 1, query));
}
function resolvedInteger(value, fallback, query) {
  const resolved = resolveConfigValue(value, fallback, query);
  const parsed = Math.trunc(Number(resolved));
  return Number.isFinite(parsed) ? parsed : fallback;
}
function resolvedOptionalPositiveInteger(value, fallback, query) {
  const resolved = resolveConfigValue(value, fallback, query);
  const parsed = Math.trunc(Number(resolved));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function resolveConfigValue(value, fallback, query) {
  if (typeof value === "function") {
    return value(query);
  }
  return value ?? fallback;
}
function normalizedRow(value) {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
function dateFromOffsetMinutes(offsetMinutes) {
  return new Date(TIMELINE_EPOCH_MS + Math.trunc(offsetMinutes) * 6e4);
}
function offsetMinutesFromDate(value) {
  const timestamp = value instanceof Date ? value.getTime() : Number.NaN;
  return Number.isFinite(timestamp) ? Math.trunc((timestamp - TIMELINE_EPOCH_MS) / 6e4) : 0;
}
function keyForOffsetMinutes(offsetMinutes) {
  return `timeline:${Math.trunc(offsetMinutes)}`;
}
function formatOffsetMinutes(totalMinutes) {
  const normalized = Math.trunc(totalMinutes);
  const sign = normalized < 0 ? "-" : "";
  const absolute = Math.abs(normalized);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  if (hours <= 0) {
    return `${sign}${minutes}m`;
  }
  if (minutes <= 0) {
    return `${sign}${hours}h`;
  }
  return `${sign}${hours}h ${minutes}m`;
}

// src/app/shared/ui/components/core/smart-list/smart-list-local-sort.ts
function smartListLocalSortKeyFromItem(item) {
  if (!item || typeof item !== "object" || !("localSortKey" in item)) {
    return null;
  }
  const key = item.localSortKey;
  return key === void 0 ? null : key;
}
function compareSmartListLocalSortKeys(left, right) {
  const leftValues = smartListLocalSortKeyValues(left);
  const rightValues = smartListLocalSortKeyValues(right);
  const length = Math.max(leftValues.length, rightValues.length);
  for (let index = 0; index < length; index += 1) {
    const value = compareSmartListLocalSortValues(leftValues[index], rightValues[index]);
    if (value !== 0) {
      return value;
    }
  }
  return 0;
}
function smartListLocalSortKeyValues(key) {
  if (key === null || key === void 0) {
    return [];
  }
  return Array.isArray(key) ? key : [key];
}
function compareSmartListLocalSortValues(left, right) {
  const leftEmpty = left === null || left === void 0;
  const rightEmpty = right === null || right === void 0;
  if (leftEmpty || rightEmpty) {
    return leftEmpty === rightEmpty ? 0 : leftEmpty ? 1 : -1;
  }
  if (typeof left === "number" || typeof right === "number") {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
      return leftNumber - rightNumber;
    }
  }
  if (typeof left === "boolean" || typeof right === "boolean") {
    return Number(left) - Number(right);
  }
  return String(left).localeCompare(String(right));
}

// src/app/shared/ui/components/core/smart-list/smart-list-item-key.ts
function smartListItemKeyFromItem(item) {
  if (!item || typeof item !== "object" || !("smartListKey" in item)) {
    return null;
  }
  const key = item.smartListKey;
  if (key === null || key === void 0) {
    return null;
  }
  const normalized = `${key}`.trim();
  if (!normalized) {
    return null;
  }
  return typeof key === "number" ? key : normalized;
}
function smartListItemByIdentity(items, identity, identityForItem) {
  const normalizedIdentity = identity.trim();
  if (!normalizedIdentity) {
    return null;
  }
  return items.find((item, index) => `${identityForItem(item, index)}`.trim() === normalizedIdentity) ?? null;
}

// src/app/shared/ui/components/core/smart-list/infinite-stepper.ts
var InfiniteStepper = class _InfiniteStepper {
  config;
  callbacks;
  static DEFAULT_SCROLL_END_DEBOUNCE_MS = 96;
  static DEFAULT_SCROLL_STABLE_DELAY_MS = 64;
  static DEFAULT_SCROLL_SETTLE_TOLERANCE_PX = 1;
  static DEFAULT_DIRECTION_COMMIT_MIN_PX = 32;
  static DEFAULT_DIRECTION_COMMIT_RATIO = 0.12;
  pageItems = /* @__PURE__ */ new Map();
  pageTotals = /* @__PURE__ */ new Map();
  deferredPageKeys = /* @__PURE__ */ new Set();
  pagesValue = [];
  edgeSettleTimer = null;
  postSettleTimer = null;
  windowAnchorsValue = [];
  focusAnchorValue = null;
  initialPageIndexOverrideValue = null;
  pendingPageKeyValue = null;
  pendingPageAnchorValue = null;
  preloadingPageKeyValue = null;
  pendingVisualKeyValue = null;
  frozenProgressValue = null;
  programmaticTargetKeyValue = null;
  lastSettledPageKey = null;
  scrollStartLeft = null;
  scrollDirection = null;
  preparedAheadPageKey = null;
  scrollInProgressValue = false;
  renderDeferredValue = false;
  suppressSettleValue = false;
  constructor(config, callbacks) {
    this.config = config;
    this.callbacks = callbacks;
  }
  get scrollInProgress() {
    return this.scrollInProgressValue;
  }
  set scrollInProgress(value) {
    this.scrollInProgressValue = value;
  }
  get renderDeferred() {
    return this.renderDeferredValue;
  }
  get suppressSettle() {
    return this.suppressSettleValue;
  }
  set suppressSettle(value) {
    this.suppressSettleValue = value;
    if (value) {
      this.clearSettleTimers();
    }
  }
  get pendingPageKey() {
    return this.pendingPageKeyValue;
  }
  get pendingPageAnchor() {
    return this.pendingPageAnchorValue;
  }
  get preloadingPageKey() {
    return this.preloadingPageKeyValue;
  }
  get pendingVisualKey() {
    return this.pendingVisualKeyValue;
  }
  get frozenProgress() {
    return this.frozenProgressValue;
  }
  get programmaticTargetKey() {
    return this.programmaticTargetKeyValue;
  }
  get focusAnchor() {
    return this.focusAnchorValue;
  }
  anchorWindow() {
    return this.windowAnchorsValue;
  }
  pages() {
    return this.pagesValue;
  }
  pageKey(anchor) {
    const adapter = this.callbacks.pageAdapter();
    const normalizedAnchor = this.normalizeAnchor(anchor);
    return adapter ? adapter.keyForAnchor(normalizedAnchor, this.callbacks.viewConfig(), this.callbacks.baseQuery()) : String(normalizedAnchor);
  }
  normalizeAnchor(anchor) {
    return this.callbacks.pageAdapter()?.normalizeAnchor(anchor, this.callbacks.viewConfig(), this.callbacks.baseQuery()) ?? anchor;
  }
  shiftAnchor(anchor, direction) {
    return this.callbacks.pageAdapter()?.shiftAnchor(anchor, direction, this.callbacks.viewConfig(), this.callbacks.baseQuery()) ?? anchor;
  }
  pageKeyForPage(page) {
    return this.pageKey(this.anchorForPage(page));
  }
  anchorForPage(page) {
    const adapter = this.callbacks.pageAdapter();
    if (!adapter) {
      return this.callbacks.fallbackAnchor();
    }
    return this.normalizeAnchor(adapter.anchorForPage(page));
  }
  hasPageData(pageKey) {
    return this.pageItems.has(pageKey);
  }
  itemsForAnchor(anchor) {
    const pageKey = this.pageKey(anchor);
    if (this.deferredPageKeys.has(pageKey)) {
      return [];
    }
    return this.pageItems.get(pageKey) ?? [];
  }
  totalForAnchor(anchor, fallback) {
    return this.pageTotals.get(this.pageKey(anchor)) ?? fallback;
  }
  setPageResult(anchor, items, total, options = {}) {
    const pageKey = this.pageKey(anchor);
    const safeTotal = Math.max(items.length, Math.max(0, Math.trunc(total)));
    this.pageItems.set(pageKey, [...items]);
    this.pageTotals.set(pageKey, safeTotal);
    if (options.deferRender === true) {
      this.deferredPageKeys.add(pageKey);
      this.renderDeferredValue = true;
      return;
    }
    this.deferredPageKeys.delete(pageKey);
    this.renderDeferredValue = this.deferredPageKeys.size > 0;
  }
  setEmptyPage(anchor, options = {}) {
    this.setPageResult(anchor, [], 0, options);
  }
  flushDeferredPages() {
    this.deferredPageKeys.clear();
    this.renderDeferredValue = false;
  }
  setWindowFocus(anchor, options = {}) {
    const normalizedAnchor = this.normalizeAnchor(anchor);
    this.focusAnchorValue = normalizedAnchor;
    this.windowAnchorsValue = this.buildAnchorWindow(normalizedAnchor);
    if (options.useInitialPageIndex === true) {
      this.initialPageIndexOverrideValue = this.desiredPageIndex(this.windowAnchorsValue.length);
    }
  }
  initialAnchor() {
    return this.callbacks.pageAdapter()?.initialAnchor(this.callbacks.viewConfig(), this.callbacks.baseQuery()) ?? this.callbacks.fallbackAnchor();
  }
  initialAnchorKey() {
    return this.callbacks.pageAdapter()?.initialAnchorKey(this.callbacks.viewConfig(), this.callbacks.baseQuery()) ?? "";
  }
  ensureWindow() {
    if (this.windowAnchorsValue.length > 0) {
      return;
    }
    this.setWindowFocus(this.initialAnchor(), { useInitialPageIndex: true });
  }
  clearWindow() {
    this.windowAnchorsValue = [];
    this.focusAnchorValue = null;
    this.initialPageIndexOverrideValue = null;
    this.pagesValue = [];
  }
  desiredPageIndex(totalPages = this.windowAnchorsValue.length) {
    if (totalPages <= 1) {
      return 0;
    }
    return Math.max(0, Math.min(totalPages - 1, this.normalizedAnchorRadius()));
  }
  initialPageIndex(totalPages = this.pagesValue.length) {
    if (totalPages <= 1) {
      return 0;
    }
    if (this.initialPageIndexOverrideValue !== null) {
      return clampIndex(this.initialPageIndexOverrideValue, totalPages);
    }
    if (this.focusAnchorValue) {
      const focusKey = this.pageKey(this.focusAnchorValue);
      const pages = this.pagesValue;
      const pageIndex = pages.findIndex((page) => this.pageKeyForPage(page) === focusKey);
      if (pageIndex >= 0) {
        return pageIndex;
      }
    }
    return this.desiredPageIndex(totalPages);
  }
  clearInitialPageIndexOverride() {
    this.initialPageIndexOverrideValue = null;
  }
  queryForAnchor(anchor, baseQuery = this.callbacks.baseQuery()) {
    const viewConfig = this.callbacks.viewConfig();
    return this.callbacks.pageAdapter()?.queryForAnchor(baseQuery, this.normalizeAnchor(anchor), viewConfig) ?? baseQuery;
  }
  applySnapshot(options = {}) {
    const snapshot = this.snapshot(options);
    this.callbacks.applySnapshot(snapshot);
    this.callbacks.afterSnapshotApplied?.();
    return snapshot;
  }
  snapshot(options = {}) {
    if (options.flushDeferred === true) {
      this.flushDeferredPages();
    }
    const adapter = this.callbacks.pageAdapter();
    const viewConfig = this.callbacks.viewConfig();
    if (!this.callbacks.isActive() || !adapter || !viewConfig) {
      this.pagesValue = [];
      return this.emptySnapshot();
    }
    this.ensureWindow();
    if (this.windowAnchorsValue.length === 0) {
      this.pagesValue = [];
      return this.emptySnapshot();
    }
    const baseQuery = this.callbacks.baseQuery();
    this.pagesValue = this.windowAnchorsValue.map((anchor) => {
      const normalizedAnchor = this.normalizeAnchor(anchor);
      return adapter.buildPage({
        anchor: normalizedAnchor,
        items: this.itemsForAnchor(normalizedAnchor),
        query: adapter.queryForAnchor(baseQuery, normalizedAnchor, viewConfig),
        viewConfig,
        trackByKey: this.callbacks.trackByKey
      });
    });
    const scrollElement = this.callbacks.scrollElement();
    const activeAnchor = (scrollElement ? this.currentAnchor(scrollElement) : null) ?? this.focusAnchorValue ?? this.windowAnchorsValue[this.desiredPageIndex(this.windowAnchorsValue.length)] ?? this.windowAnchorsValue[0] ?? null;
    const activeItems = activeAnchor ? [...this.itemsForAnchor(activeAnchor)] : [];
    const activeTotal = activeAnchor ? this.totalForAnchor(activeAnchor, activeItems.length) : 0;
    const activePageKey = activeAnchor ? this.pageKey(activeAnchor) : null;
    const stickyPage = this.pagesValue.find((page) => this.pageKeyForPage(page) === activePageKey) ?? this.pagesValue[this.initialPageIndex(this.pagesValue.length)] ?? null;
    const stickyLabel = stickyPage ? adapter.labelForPage(stickyPage) : "";
    return {
      pages: this.pagesValue,
      activeAnchor,
      activeItems,
      activeTotal,
      stickyLabel
    };
  }
  applySurfaceState(scrollElement = this.callbacks.scrollElement()) {
    this.callbacks.applySurfaceState(this.surfaceState(scrollElement), scrollElement);
  }
  shiftWindow(direction) {
    if (this.windowAnchorsValue.length === 0) {
      return;
    }
    if (direction < 0) {
      const first = this.windowAnchorsValue[0];
      const nextAnchor2 = this.normalizeAnchor(this.shiftAnchor(first, -1));
      this.windowAnchorsValue = [nextAnchor2, ...this.windowAnchorsValue.slice(0, -1)];
      return;
    }
    const last = this.windowAnchorsValue[this.windowAnchorsValue.length - 1];
    const nextAnchor = this.normalizeAnchor(this.shiftAnchor(last, 1));
    this.windowAnchorsValue = [...this.windowAnchorsValue.slice(1), nextAnchor];
  }
  navigateBy(delta, behavior = "smooth") {
    if (!this.callbacks.isActive()) {
      return;
    }
    this.callbacks.cancelPendingPageLoad();
    const scrollElement = this.callbacks.scrollElement();
    const pages = this.pagesValue;
    if (!scrollElement || pages.length === 0) {
      this.navigateFocusBy(delta);
      return;
    }
    const step = delta < 0 ? -1 : 1;
    const currentIndex = this.currentPageIndex(scrollElement, pages.length);
    const targetIndex = currentIndex + step;
    if (targetIndex >= 0 && targetIndex < pages.length) {
      this.scrollToPage(targetIndex, behavior);
      return;
    }
    const holdIndex = step < 0 ? 1 : Math.max(0, pages.length - 2);
    this.suppressSettle = true;
    this.shiftWindow(step);
    this.applySnapshot();
    this.callbacks.emitState();
    this.callbacks.markForCheck();
    setTimeout(() => {
      const nextElement = this.callbacks.scrollElement();
      if (!nextElement) {
        this.suppressSettle = false;
        return;
      }
      const holdLeft = this.pageOffsetLeft(nextElement, holdIndex);
      if (holdLeft < 0) {
        this.suppressSettle = false;
        return;
      }
      const previousScrollBehavior = nextElement.style.scrollBehavior;
      const previousSnapType = nextElement.style.scrollSnapType;
      nextElement.style.scrollBehavior = "auto";
      nextElement.style.scrollSnapType = "none";
      nextElement.scrollLeft = holdLeft;
      nextElement.style.scrollBehavior = previousScrollBehavior;
      const slide = () => {
        nextElement.style.scrollSnapType = previousSnapType;
        this.suppressSettle = false;
        this.applySurfaceState(nextElement);
        this.callbacks.emitState();
        this.callbacks.markForCheck();
        this.scrollToPage(holdIndex + step, behavior);
      };
      this.releaseAfterSettle(slide);
    }, 0);
  }
  currentAnchor(scrollElement = this.callbacks.scrollElement()) {
    const page = this.currentPage(scrollElement);
    if (page) {
      return this.anchorForPage(page);
    }
    return this.focusAnchorValue;
  }
  navigateFocusBy(delta) {
    const direction = delta < 0 ? -1 : 1;
    let nextAnchor = this.currentAnchor() ?? this.focusAnchorValue ?? this.initialAnchor();
    for (let index = 0; index < Math.max(1, Math.abs(delta)); index += 1) {
      nextAnchor = this.shiftAnchor(nextAnchor, direction);
    }
    this.setWindowFocus(nextAnchor, { useInitialPageIndex: true });
    this.applySnapshot();
    this.callbacks.emitState();
    this.callbacks.markForCheck();
  }
  beginPendingPage(anchor, currentProgress) {
    const normalizedAnchor = this.normalizeAnchor(anchor);
    const pageKey = this.pageKey(normalizedAnchor);
    this.pendingPageKeyValue = pageKey;
    this.pendingPageAnchorValue = normalizedAnchor;
    this.showPendingVisual(normalizedAnchor, currentProgress);
    return pageKey;
  }
  showPendingVisual(anchor, currentProgress) {
    const pageKey = this.pageKey(anchor);
    if (this.pendingVisualKeyValue !== pageKey) {
      this.frozenProgressValue = currentProgress;
    }
    this.pendingVisualKeyValue = pageKey;
    return pageKey;
  }
  clearPendingVisual() {
    this.pendingVisualKeyValue = null;
    this.frozenProgressValue = null;
  }
  clearPendingPage(options = {}) {
    this.pendingPageKeyValue = null;
    this.pendingPageAnchorValue = null;
    this.clearPendingVisual();
    if (options.clearProgrammaticTarget === true) {
      this.programmaticTargetKeyValue = null;
    }
  }
  beginPreloadingPage(anchor) {
    const pageKey = this.pageKey(anchor);
    this.preloadingPageKeyValue = pageKey;
    return pageKey;
  }
  clearPreloadingPage(pageKey) {
    if (pageKey && this.preloadingPageKeyValue !== pageKey) {
      return;
    }
    this.preloadingPageKeyValue = null;
  }
  setLastSettledPageKey(key) {
    this.lastSettledPageKey = key;
  }
  clearProgrammaticTarget() {
    this.programmaticTargetKeyValue = null;
  }
  clearPageCache() {
    this.pageItems.clear();
    this.pageTotals.clear();
    this.deferredPageKeys.clear();
    this.renderDeferredValue = false;
    this.pendingPageKeyValue = null;
    this.pendingPageAnchorValue = null;
    this.preloadingPageKeyValue = null;
    this.pendingVisualKeyValue = null;
    this.frozenProgressValue = null;
    this.programmaticTargetKeyValue = null;
    this.lastSettledPageKey = null;
    this.pagesValue = [];
    this.resetScrollTracking();
  }
  reset() {
    this.clearSettleTimers();
    this.suppressSettleValue = false;
    this.callbacks.cancelPendingPageLoad();
    this.callbacks.cancelPendingPreload();
    this.clearPageCache();
  }
  resetScrollTracking() {
    this.scrollStartLeft = null;
    this.scrollDirection = null;
    this.preparedAheadPageKey = null;
    this.scrollInProgressValue = false;
  }
  emptySnapshot() {
    return {
      pages: [],
      activeAnchor: null,
      activeItems: [],
      activeTotal: 0,
      stickyLabel: ""
    };
  }
  clearSettleTimers() {
    if (this.edgeSettleTimer) {
      clearTimeout(this.edgeSettleTimer);
      this.edgeSettleTimer = null;
    }
    if (this.postSettleTimer) {
      clearTimeout(this.postSettleTimer);
      this.postSettleTimer = null;
    }
  }
  flushDeferredSnapshot(scrollElement) {
    if (!this.renderDeferredValue) {
      return;
    }
    this.applySnapshot({ flushDeferred: true });
    this.applySurfaceState(scrollElement ?? this.callbacks.scrollElement());
  }
  onScroll(scrollElement) {
    if (!this.scrollInProgressValue) {
      this.scrollStartLeft = this.currentPageOffsetLeft(scrollElement);
      this.preparedAheadPageKey = null;
    }
    this.scrollInProgressValue = true;
    this.preparePageAheadForScroll(scrollElement);
    this.applySurfaceState(scrollElement);
    this.callbacks.emitState();
    const visiblePage = this.currentPage(scrollElement);
    const visiblePageKey = visiblePage ? this.pageKeyForPage(visiblePage) : null;
    if (visiblePageKey && this.pendingPageKeyValue && this.pendingPageKeyValue !== visiblePageKey && (!this.programmaticTargetKeyValue || this.programmaticTargetKeyValue === visiblePageKey)) {
      this.callbacks.cancelPendingPageLoad();
    }
    if (this.callbacks.isTouchingSurface()) {
      return;
    }
    if (this.programmaticTargetKeyValue && visiblePageKey !== this.programmaticTargetKeyValue) {
      this.scheduleScrollEnd(scrollElement);
      return;
    }
    if (visiblePageKey === this.programmaticTargetKeyValue) {
      this.programmaticTargetKeyValue = null;
    }
    this.scheduleScrollEnd(scrollElement);
  }
  onScrollEnd(scrollElement) {
    this.handleScrollEnd(scrollElement);
  }
  scheduleScrollEnd(scrollElement) {
    if (!this.callbacks.isActive()) {
      this.clearSettleTimers();
      return;
    }
    if (this.suppressSettleValue) {
      this.scrollInProgressValue = false;
      this.clearSettleTimers();
      return;
    }
    if (this.postSettleTimer) {
      clearTimeout(this.postSettleTimer);
      this.postSettleTimer = null;
    }
    if (this.edgeSettleTimer) {
      clearTimeout(this.edgeSettleTimer);
    }
    this.edgeSettleTimer = setTimeout(() => {
      this.edgeSettleTimer = null;
      this.handleScrollEnd(scrollElement);
    }, this.scrollEndDebounceMs());
  }
  handleScrollEnd(scrollElement) {
    if (!this.callbacks.isActive() || this.callbacks.isTouchingSurface() || this.suppressSettleValue || scrollElement !== this.callbacks.scrollElement()) {
      return;
    }
    if (!this.isScrollPageAligned(scrollElement)) {
      this.scheduleStableScrollEnd(scrollElement);
      return;
    }
    this.clearSettleTimers();
    this.scrollInProgressValue = false;
    this.preparedAheadPageKey = null;
    const visiblePage = this.currentPage(scrollElement);
    const visiblePageKey = visiblePage ? this.pageKeyForPage(visiblePage) : null;
    if (!visiblePageKey || visiblePageKey !== this.programmaticTargetKeyValue) {
      if (this.programmaticTargetKeyValue && this.pendingPageKeyValue === this.programmaticTargetKeyValue && visiblePageKey !== this.programmaticTargetKeyValue) {
        this.callbacks.cancelPendingPageLoad();
      }
      this.programmaticTargetKeyValue = null;
    }
    if (this.settleWindow(scrollElement)) {
      this.scrollStartLeft = null;
      this.scrollDirection = null;
      this.flushDeferredSnapshot(scrollElement);
      this.callbacks.emitState();
      this.callbacks.markForCheck();
      return;
    }
    this.scrollStartLeft = null;
    this.scrollDirection = null;
    this.applySurfaceState(scrollElement);
    this.flushDeferredSnapshot(scrollElement);
    this.callbacks.emitState();
    this.callbacks.markForCheck();
  }
  maybeLoadCurrentPage(scrollElement = this.callbacks.scrollElement(), options = {}) {
    if (!this.callbacks.isActive() || !scrollElement) {
      return;
    }
    const page = this.currentPage(scrollElement);
    if (!page) {
      return;
    }
    const pageKey = this.pageKeyForPage(page);
    if (this.programmaticTargetKeyValue) {
      if (pageKey !== this.programmaticTargetKeyValue) {
        return;
      }
      this.programmaticTargetKeyValue = null;
    }
    if (this.hasPageData(pageKey) || this.pendingPageKeyValue === pageKey || this.preloadingPageKeyValue === pageKey) {
      return;
    }
    const anchor = this.anchorForPage(page);
    this.callbacks.loadPage(anchor, this.queryForAnchor(anchor), options);
  }
  scrollToPage(pageIndex, behavior) {
    const scrollElement = this.callbacks.scrollElement();
    const pages = this.pagesValue;
    if (!scrollElement || pages.length === 0) {
      return;
    }
    const targetIndex = clampIndex(pageIndex, pages.length);
    const targetPage = pages[targetIndex] ?? null;
    const targetPageKey = targetPage ? this.pageKeyForPage(targetPage) : null;
    const targetLeft = this.pageTargetLeft(scrollElement, targetIndex, pages.length);
    if (targetLeft < 0) {
      this.programmaticTargetKeyValue = null;
      return;
    }
    const currentIndex = this.currentPageIndex(scrollElement, pages.length);
    const isSmoothPageMove = behavior === "smooth" && currentIndex !== targetIndex;
    const targetPageToLoad = targetPage && targetPageKey && !this.hasPageData(targetPageKey) ? targetPage : null;
    this.programmaticTargetKeyValue = currentIndex === targetIndex ? null : targetPageKey;
    this.scrollInProgressValue = this.scrollInProgressValue || isSmoothPageMove;
    scrollElement.scrollTo({
      left: targetLeft,
      behavior
    });
    this.callbacks.emitState();
    this.callbacks.markForCheck();
    if (targetPageToLoad) {
      this.loadPageAfterScrollStarts(this.anchorForPage(targetPageToLoad));
    }
  }
  normalizePageAlignment(scrollElement) {
    const pages = this.pagesValue;
    if (pages.length === 0) {
      return;
    }
    const nearestPageIndex = this.currentPageIndex(scrollElement, pages.length);
    const nearestPageLeft = this.pageOffsetLeft(scrollElement, nearestPageIndex);
    if (nearestPageLeft < 0) {
      return;
    }
    if (Math.abs(scrollElement.scrollLeft - nearestPageLeft) > 0.75) {
      return;
    }
    const previousScrollBehavior = scrollElement.style.scrollBehavior;
    scrollElement.style.scrollBehavior = "auto";
    scrollElement.scrollLeft = nearestPageLeft;
    scrollElement.style.scrollBehavior = previousScrollBehavior;
  }
  currentPage(scrollElement = this.callbacks.scrollElement()) {
    const pages = this.pagesValue;
    if (pages.length === 0) {
      return null;
    }
    return pages[this.currentPageIndex(scrollElement, pages.length)] ?? null;
  }
  surfaceState(scrollElement = this.callbacks.scrollElement()) {
    const pages = this.pagesValue;
    const adapter = this.callbacks.pageAdapter();
    if (!scrollElement || pages.length === 0) {
      return {
        scrollable: false,
        progress: 0,
        pageIndex: 0,
        label: pages[0] && adapter ? adapter.labelForPage(pages[0]) : ""
      };
    }
    const pageIndex = this.currentPageIndex(scrollElement, pages.length);
    const page = pages[pageIndex] ?? pages[0];
    return {
      scrollable: pages.length > 1,
      progress: this.surfaceProgress(scrollElement, pages.length),
      pageIndex,
      label: page && adapter ? adapter.labelForPage(page) : ""
    };
  }
  currentPageIndex(scrollElement = this.callbacks.scrollElement(), totalPages = this.pagesValue.length) {
    if (!scrollElement || totalPages <= 1) {
      return 0;
    }
    const pageElements = Array.from(scrollElement.querySelectorAll(this.config.pageSelector)).slice(0, totalPages);
    if (pageElements.length === 0) {
      const pageWidth = this.viewportWidth(scrollElement) || 1;
      return clampIndex(Math.round(scrollElement.scrollLeft / pageWidth), totalPages);
    }
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < pageElements.length; index += 1) {
      const distance = Math.abs(scrollElement.scrollLeft - pageElements[index].offsetLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    }
    return clampIndex(nearestIndex, totalPages);
  }
  pageIndexForLeft(scrollElement, totalPages, left) {
    if (totalPages <= 1) {
      return 0;
    }
    const pageElements = Array.from(scrollElement.querySelectorAll(this.config.pageSelector)).slice(0, totalPages);
    if (pageElements.length === 0) {
      const pageWidth = this.viewportWidth(scrollElement) || 1;
      return clampIndex(Math.round(left / pageWidth), totalPages);
    }
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < pageElements.length; index += 1) {
      const distance = Math.abs(left - pageElements[index].offsetLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    }
    return clampIndex(nearestIndex, totalPages);
  }
  pageOffsetLeft(scrollElement, pageIndex) {
    const pageElements = Array.from(scrollElement.querySelectorAll(this.config.pageSelector));
    const pageElement = pageElements[pageIndex];
    if (pageElement) {
      return pageElement.offsetLeft;
    }
    const pageWidth = this.viewportWidth(scrollElement);
    if (pageWidth <= 0) {
      return -1;
    }
    return pageWidth * pageIndex;
  }
  pageTargetLeft(scrollElement, pageIndex, totalPages = this.pagesValue.length) {
    const safeTotal = Math.max(0, Math.trunc(totalPages));
    const safeIndex = clampIndex(pageIndex, safeTotal);
    if (safeTotal <= 1) {
      return 0;
    }
    const measuredLeft = this.pageOffsetLeft(scrollElement, safeIndex);
    if (measuredLeft > 0 || safeIndex === 0) {
      return measuredLeft;
    }
    const maxScrollLeft = Math.max(0, scrollElement.scrollWidth - scrollElement.clientWidth);
    if (maxScrollLeft > 0) {
      return maxScrollLeft / Math.max(1, safeTotal - 1) * safeIndex;
    }
    return measuredLeft;
  }
  viewportWidth(scrollElement) {
    const rectWidth = scrollElement.getBoundingClientRect().width;
    if (Number.isFinite(rectWidth) && rectWidth > 0) {
      return rectWidth;
    }
    return scrollElement.clientWidth || 0;
  }
  surfaceProgress(scrollElement, totalPages) {
    if (this.pendingVisualKeyValue && this.frozenProgressValue !== null) {
      return this.frozenProgressValue;
    }
    if (totalPages <= 0) {
      return 0;
    }
    if (totalPages === 1) {
      return 0.5;
    }
    const pageWidth = this.viewportWidth(scrollElement);
    if (pageWidth <= 0) {
      return clampNumber(this.currentPageIndex(scrollElement, totalPages) / Math.max(1, totalPages - 1), 0, 1);
    }
    const rawPageIndex = scrollElement.scrollLeft / pageWidth;
    return clampNumber(rawPageIndex / Math.max(1, totalPages - 1), 0, 1);
  }
  currentPageOffsetLeft(scrollElement) {
    const pages = this.pagesValue;
    if (pages.length === 0) {
      return scrollElement.scrollLeft;
    }
    const pageIndex = this.currentPageIndex(scrollElement, pages.length);
    const pageLeft = this.pageOffsetLeft(scrollElement, pageIndex);
    return pageLeft >= 0 ? pageLeft : scrollElement.scrollLeft;
  }
  settledPageIndex(scrollElement, totalPages) {
    if (!this.scrollDirection || this.scrollStartLeft === null) {
      return this.currentPageIndex(scrollElement, totalPages);
    }
    const startIndex = this.pageIndexForLeft(scrollElement, totalPages, this.scrollStartLeft);
    const currentIndex = this.currentPageIndex(scrollElement, totalPages);
    if (currentIndex !== startIndex) {
      return currentIndex;
    }
    const delta = Math.abs(scrollElement.scrollLeft - this.scrollStartLeft);
    if (delta < this.directionCommitThresholdPx(scrollElement)) {
      return startIndex;
    }
    return clampIndex(startIndex + this.scrollDirection, totalPages);
  }
  releaseAfterSettle(callback) {
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(callback));
      return;
    }
    setTimeout(callback, this.scrollStableDelayMs());
  }
  buildAnchorWindow(focusAnchor) {
    const radius = this.normalizedAnchorRadius();
    const anchors = [focusAnchor];
    let previousAnchor = focusAnchor;
    for (let index = 0; index < radius; index += 1) {
      previousAnchor = this.normalizeAnchor(this.shiftAnchor(previousAnchor, -1));
      anchors.unshift(previousAnchor);
    }
    let nextAnchor = focusAnchor;
    for (let index = 0; index < radius; index += 1) {
      nextAnchor = this.normalizeAnchor(this.shiftAnchor(nextAnchor, 1));
      anchors.push(nextAnchor);
    }
    const anchorsByKey = /* @__PURE__ */ new Map();
    for (const anchor of anchors) {
      anchorsByKey.set(this.pageKey(anchor), anchor);
    }
    return [...anchorsByKey.values()];
  }
  normalizedAnchorRadius() {
    return Math.max(0, Math.trunc(this.callbacks.pageAdapter()?.anchorRadius(this.callbacks.viewConfig()) ?? 0));
  }
  recenterWindow(anchor, targetIndex, options = {}) {
    const loadAfterRecenter = options.loadAfterRecenter !== false;
    const normalizedAnchor = this.normalizeAnchor(anchor);
    const targetPageKey = this.pageKey(normalizedAnchor);
    if (!loadAfterRecenter || this.hasPageData(targetPageKey)) {
      this.clearPendingVisual();
    } else {
      this.showPendingVisual(normalizedAnchor, this.callbacks.currentProgress());
    }
    this.setWindowFocus(normalizedAnchor);
    this.suppressSettle = true;
    const nextElement = this.callbacks.scrollElement();
    const previousScrollBehavior = nextElement?.style.scrollBehavior ?? "";
    const previousSnapType = nextElement?.style.scrollSnapType ?? "";
    if (nextElement) {
      nextElement.style.scrollBehavior = "auto";
      nextElement.style.scrollSnapType = "none";
    }
    this.applySnapshot();
    this.callbacks.detectChanges();
    if (!nextElement) {
      this.suppressSettle = false;
      if (loadAfterRecenter) {
        this.maybeLoadCurrentPage();
      }
      this.callbacks.emitState();
      this.callbacks.markForCheck();
      return;
    }
    const targetLeft = this.pageOffsetLeft(nextElement, targetIndex);
    if (targetLeft < 0) {
      nextElement.style.scrollBehavior = previousScrollBehavior;
      nextElement.style.scrollSnapType = previousSnapType;
      this.suppressSettle = false;
      if (loadAfterRecenter) {
        this.maybeLoadCurrentPage(nextElement);
      }
      this.callbacks.emitState();
      this.callbacks.markForCheck();
      return;
    }
    nextElement.scrollLeft = targetLeft;
    nextElement.style.scrollBehavior = previousScrollBehavior;
    const release = () => {
      nextElement.style.scrollSnapType = previousSnapType;
      this.suppressSettle = false;
      this.applySurfaceState(nextElement);
      this.callbacks.emitState();
      this.callbacks.markForCheck();
      if (loadAfterRecenter) {
        this.maybeLoadCurrentPage(nextElement);
      }
    };
    this.releaseAfterSettle(release);
  }
  scheduleStableScrollEnd(scrollElement) {
    if (this.postSettleTimer) {
      clearTimeout(this.postSettleTimer);
    }
    const scrollLeftSnapshot = scrollElement.scrollLeft;
    this.postSettleTimer = setTimeout(() => {
      this.postSettleTimer = null;
      if (!this.callbacks.isActive() || this.suppressSettleValue || scrollElement !== this.callbacks.scrollElement()) {
        return;
      }
      const scrollDelta = Math.abs(scrollElement.scrollLeft - scrollLeftSnapshot);
      if (scrollDelta > this.scrollSettleTolerancePx()) {
        this.scheduleScrollEnd(scrollElement);
        return;
      }
      if (!this.isScrollPageAligned(scrollElement)) {
        this.alignScrollToSettledPage(scrollElement);
      }
      this.handleScrollEnd(scrollElement);
    }, this.scrollStableDelayMs());
  }
  isScrollPageAligned(scrollElement) {
    const targetPageLeft = this.settledPageLeft(scrollElement);
    if (targetPageLeft === null) {
      return true;
    }
    return Math.abs(scrollElement.scrollLeft - targetPageLeft) <= this.scrollSettleTolerancePx();
  }
  alignScrollToSettledPage(scrollElement) {
    const targetPageLeft = this.settledPageLeft(scrollElement);
    if (targetPageLeft === null) {
      return;
    }
    scrollElement.scrollTo({ left: targetPageLeft, behavior: "smooth" });
  }
  settledPageLeft(scrollElement) {
    const pages = this.pagesValue;
    if (pages.length === 0) {
      return null;
    }
    const pageIndex = this.settledPageIndex(scrollElement, pages.length);
    const pageLeft = this.pageOffsetLeft(scrollElement, pageIndex);
    return pageLeft < 0 ? null : pageLeft;
  }
  settleWindow(scrollElement) {
    const pages = this.pagesValue;
    if (pages.length === 0) {
      return false;
    }
    const currentIndex = this.settledPageIndex(scrollElement, pages.length);
    const activePage = pages[currentIndex];
    if (!activePage) {
      return false;
    }
    this.loadPageForSettledPage(activePage);
    const desiredIndex = this.desiredPageIndex(pages.length);
    if (currentIndex !== desiredIndex && (currentIndex === 0 || currentIndex === pages.length - 1)) {
      this.recenterWindow(this.anchorForPage(activePage), desiredIndex, { loadAfterRecenter: false });
      return true;
    }
    return false;
  }
  loadPageForSettledPage(page) {
    const pageKey = this.pageKeyForPage(page);
    const settledPageChanged = this.lastSettledPageKey !== pageKey;
    this.lastSettledPageKey = pageKey;
    if (settledPageChanged) {
      if (this.pendingPageKeyValue === pageKey) {
        return;
      }
      this.callbacks.cancelPendingPreload();
      const anchor2 = this.anchorForPage(page);
      this.callbacks.loadPage(anchor2, this.queryForAnchor(anchor2), { replacePending: true, force: true });
      return;
    }
    if (this.hasPageData(pageKey) || this.pendingPageKeyValue === pageKey || this.preloadingPageKeyValue === pageKey) {
      return;
    }
    const anchor = this.anchorForPage(page);
    this.callbacks.loadPage(anchor, this.queryForAnchor(anchor), { replacePending: true });
  }
  preparePageAheadForScroll(scrollElement) {
    const pages = this.pagesValue;
    if (pages.length < 2 || this.suppressSettleValue) {
      return;
    }
    const baselineLeft = this.scrollStartLeft ?? this.currentPageOffsetLeft(scrollElement);
    this.scrollStartLeft = baselineLeft;
    const pageWidth = this.viewportWidth(scrollElement);
    const directionThreshold = Math.max(8, pageWidth * 0.02);
    const delta = scrollElement.scrollLeft - baselineLeft;
    if (Math.abs(delta) < directionThreshold) {
      return;
    }
    const direction = delta > 0 ? 1 : -1;
    this.scrollDirection = direction;
    const projectedIndex = clampIndex(Math.round(scrollElement.scrollLeft / Math.max(1, pageWidth)), pages.length);
    const projectedPage = pages[projectedIndex] ?? null;
    const projectedPageKey = projectedPage ? this.pageKeyForPage(projectedPage) : null;
    const anchor = projectedPage && projectedPageKey && !this.hasPageData(projectedPageKey) ? this.anchorForPage(projectedPage) : direction > 0 ? this.shiftAnchor(this.anchorForPage(pages[pages.length - 1]), 1) : this.shiftAnchor(this.anchorForPage(pages[0]), -1);
    const pageKey = this.pageKey(anchor);
    if (this.preparedAheadPageKey === pageKey || this.hasPageData(pageKey) || this.pendingPageKeyValue === pageKey || this.preloadingPageKeyValue === pageKey) {
      return;
    }
    this.preparedAheadPageKey = pageKey;
    this.callbacks.preloadPage(anchor, this.queryForAnchor(anchor));
  }
  loadPageAfterScrollStarts(anchor) {
    setTimeout(() => {
      this.callbacks.loadPage(anchor, this.queryForAnchor(anchor), { replacePending: true });
    }, 0);
  }
  directionCommitThresholdPx(scrollElement) {
    return Math.max(this.directionCommitMinPx(), this.viewportWidth(scrollElement) * this.directionCommitRatio());
  }
  scrollEndDebounceMs() {
    return this.config.scrollEndDebounceMs ?? _InfiniteStepper.DEFAULT_SCROLL_END_DEBOUNCE_MS;
  }
  scrollStableDelayMs() {
    return this.config.scrollStableDelayMs ?? _InfiniteStepper.DEFAULT_SCROLL_STABLE_DELAY_MS;
  }
  scrollSettleTolerancePx() {
    return this.config.scrollSettleTolerancePx ?? _InfiniteStepper.DEFAULT_SCROLL_SETTLE_TOLERANCE_PX;
  }
  directionCommitMinPx() {
    return this.config.directionCommitMinPx ?? _InfiniteStepper.DEFAULT_DIRECTION_COMMIT_MIN_PX;
  }
  directionCommitRatio() {
    return this.config.directionCommitRatio ?? _InfiniteStepper.DEFAULT_DIRECTION_COMMIT_RATIO;
  }
};
function clampIndex(index, total) {
  return Math.max(0, Math.min(Math.max(0, total - 1), index));
}
function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
}

// src/app/shared/ui/components/core/smart-list/finite-stepper.ts
var FiniteStepper = class {
  callbacks;
  cursorIndexValue = 0;
  emptyCursorValue = false;
  leavingItemValue = null;
  animatingValue = false;
  constructor(callbacks) {
    this.callbacks = callbacks;
  }
  get index() {
    return this.cursorIndexValue;
  }
  get leavingItem() {
    return this.leavingItemValue;
  }
  get animating() {
    return this.animatingValue;
  }
  state(indexOverride = this.cursorIndexValue) {
    const items = this.callbacks.items();
    const total = this.cursorTotal();
    if (total === 0) {
      return {
        index: 0,
        total: 0,
        progress: 0,
        canPrev: false,
        canNext: false,
        item: null
      };
    }
    const lastItemIndex = Math.max(0, total - 1);
    const maxCursorIndex = this.canUseEmptyCursor() ? total : lastItemIndex;
    const index = Math.max(0, Math.min(Math.trunc(indexOverride), maxCursorIndex));
    return {
      index,
      total,
      progress: index >= total ? 1 : lastItemIndex > 0 ? clampNumber2(index / lastItemIndex, 0, 1) : 0,
      canPrev: index > 0,
      canNext: index < lastItemIndex,
      item: index < items.length ? items[index] ?? null : null
    };
  }
  cursorTotal() {
    const total = Number(this.callbacks.total());
    const normalizedTotal = Number.isFinite(total) ? Math.max(0, Math.trunc(total)) : 0;
    return Math.max(normalizedTotal, this.callbacks.items().length);
  }
  canMove(delta) {
    const cursor = this.state();
    if (!Number.isFinite(delta) || delta === 0) {
      return false;
    }
    const targetIndex = cursor.index + Math.trunc(delta);
    if (targetIndex < 0) {
      return false;
    }
    return targetIndex < cursor.total;
  }
  deltaFor(direction, step, pageSize) {
    if (step !== "page") {
      return direction;
    }
    const cursor = this.state();
    if (cursor.total <= 1) {
      return 0;
    }
    const normalizedPageSize = Math.max(1, Math.trunc(pageSize));
    if (direction < 0) {
      return Math.max(0, cursor.index - normalizedPageSize) - cursor.index;
    }
    const maxPageStart = Math.max(0, cursor.total - normalizedPageSize);
    return Math.min(cursor.index + normalizedPageSize, maxPageStart) - cursor.index;
  }
  setIndex(index, options = {}) {
    const normalizedIndex = Math.max(0, Math.trunc(index));
    this.cursorIndexValue = normalizedIndex;
    this.syncBounds();
    this.notify(options);
    return this.state().index === normalizedIndex;
  }
  syncBounds() {
    const total = this.cursorTotal();
    if (total === 0) {
      this.cursorIndexValue = 0;
      return;
    }
    const maxCursorIndex = this.canUseEmptyCursor() ? total : total - 1;
    this.cursorIndexValue = Math.max(0, Math.min(this.cursorIndexValue, maxCursorIndex));
  }
  setEmptyCursor(value, options = {}) {
    this.emptyCursorValue = value;
    this.syncBounds();
    this.notify(options);
  }
  canUseEmptyCursor() {
    return this.emptyCursorValue && this.cursorIndexValue >= this.cursorTotal() && this.cursorTotal() > 0 && !this.callbacks.hasMore() && !this.callbacks.loading();
  }
  canMoveToEmptyCursor() {
    const cursor = this.state();
    return cursor.item !== null && cursor.total > 0 && cursor.index === cursor.total - 1 && !this.callbacks.hasMore() && !this.callbacks.loading();
  }
  beginTransition(item) {
    this.leavingItemValue = item;
    this.animatingValue = true;
    this.callbacks.markDirty();
  }
  finishTransition(options = {}) {
    if (!this.animatingValue && this.leavingItemValue === null) {
      return;
    }
    this.animatingValue = false;
    this.leavingItemValue = null;
    this.notify(options);
  }
  reset(options = {}) {
    this.cursorIndexValue = 0;
    this.emptyCursorValue = false;
    this.animatingValue = false;
    this.leavingItemValue = null;
    this.notify(options);
  }
  destroy() {
    this.animatingValue = false;
    this.leavingItemValue = null;
  }
  notify(options) {
    if (options.notify === false) {
      return;
    }
    this.callbacks.markDirty();
  }
};
function clampNumber2(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

// src/app/shared/ui/components/core/smart-list/smart-list.component.ts
var _c0 = ["scrollHost"];
var _c1 = ["paginationMenuOutlet"];
function SmartListComponent_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "span", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 18)(4, "button", 19);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_3_Conditional_3_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.navigatePageHeader(-1, $event));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 20);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_3_Conditional_3_Template_button_click_7_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.navigatePageHeader(1, $event));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r1.resolvedStickyHeaderClass());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.stickyLabel);
  }
}
function SmartListComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "app-smart-list-page-card", 15, 3);
    \u0275\u0275listener("scroll", function SmartListComponent_Conditional_3_Template_app_smart_list_page_card_scroll_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPageScroll($event));
    })("scrollend", function SmartListComponent_Conditional_3_Template_app_smart_list_page_card_scrollend_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPageScrollEnd($event));
    })("touchstart", function SmartListComponent_Conditional_3_Template_app_smart_list_page_card_touchstart_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSurfaceTouchStart());
    })("touchend", function SmartListComponent_Conditional_3_Template_app_smart_list_page_card_touchend_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSurfaceTouchEnd());
    })("touchcancel", function SmartListComponent_Conditional_3_Template_app_smart_list_page_card_touchcancel_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSurfaceTouchEnd());
    });
    \u0275\u0275conditionalCreate(3, SmartListComponent_Conditional_3_Conditional_3_Template, 10, 2, "div", 16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("smart-list__page-shell--presentation-list", ctx_r1.resolvedPresentation() === "list")("smart-list__page-shell--presentation-fullscreen", ctx_r1.resolvedPresentation() === "fullscreen");
    \u0275\u0275advance();
    \u0275\u0275classProp("smart-list--month", ctx_r1.isMonthMode())("smart-list--week", ctx_r1.isWeekMode())("smart-list--timeline", ctx_r1.isTimelineMode())("smart-list--mobile-stepper", ctx_r1.resolvedMobileStepper())("smart-list--presentation-list", ctx_r1.resolvedPresentation() === "list")("smart-list--presentation-fullscreen", ctx_r1.resolvedPresentation() === "fullscreen")("smart-list--page-touching", ctx_r1.isTouchingSurface);
    \u0275\u0275property("model", ctx_r1.pageCardModel());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.shouldShowStickyHeader() ? 3 : -1);
  }
}
function SmartListComponent_Conditional_4_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 18)(1, "button", 26);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_4_Conditional_0_Conditional_3_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onPaginationPrev($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 27);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_4_Conditional_0_Conditional_3_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onPaginationNext($event));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.canMovePagination(-1));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.canMovePagination(1));
  }
}
function SmartListComponent_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "span", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, SmartListComponent_Conditional_4_Conditional_0_Conditional_3_Template, 7, 2, "span", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r1.resolvedStickyHeaderClass());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.stickyLabel);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.shouldRenderStickyPaginationActions() ? 3 : -1);
  }
}
function SmartListComponent_Conditional_4_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 18)(1, "button", 26);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_4_Conditional_3_Conditional_3_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onPaginationPrev($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 27);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_4_Conditional_3_Conditional_3_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onPaginationNext($event));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.canMovePagination(-1));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.canMovePagination(1));
  }
}
function SmartListComponent_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "span", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, SmartListComponent_Conditional_4_Conditional_3_Conditional_3_Template, 7, 2, "span", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("smart-list__sticky--list-header", ctx_r1.shouldRenderStickyPaginationActions());
    \u0275\u0275property("ngClass", ctx_r1.resolvedStickyHeaderClass());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.stickyLabel);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.shouldRenderStickyPaginationActions() ? 3 : -1);
  }
}
function SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext();
    const group_r8 = ctx_r6.$implicit;
    const \u0275$index_73_r9 = ctx_r6.$index;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275styleProp("z-index", ctx_r1.isReversedListFlow() ? ctx_r1.groups.length - \u0275$index_73_r9 + 3 : null);
    \u0275\u0275property("ngClass", ctx_r1.resolvedGroupMarkerClass());
    \u0275\u0275attribute("data-group-label", group_r8.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", group_r8.label, " ");
  }
}
function SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 34);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275styleProp("height", ctx_r1.prependRestoreSpacerHeight, "px");
    \u0275\u0275property("id", ctx_r1.prependRestoreSpacerId);
  }
}
function SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_For_2_Conditional_0_Template, 1, 3, "div", 31);
    \u0275\u0275elementStart(1, "div", 32);
    \u0275\u0275elementContainer(2, 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = ctx.$implicit;
    const \u0275$index_78_r11 = ctx.$index;
    const group_r8 = \u0275\u0275nextContext().$implicit;
    const templateRef_r12 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.shouldRenderPrependRestoreSpacer(item_r10, group_r8.startIndex + \u0275$index_78_r11) ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-group-label", group_r8.label || null)("data-smart-list-index", group_r8.startIndex + \u0275$index_78_r11)("data-smart-list-anchor", ctx_r1.itemAnchorKey(item_r10, group_r8.startIndex + \u0275$index_78_r11));
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", templateRef_r12)("ngTemplateOutletContext", ctx_r1.itemContext(item_r10, \u0275$index_78_r11, group_r8.label))("ngTemplateOutletInjector", ctx_r1.itemTemplateInjector);
  }
}
function SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext();
    const group_r8 = ctx_r6.$implicit;
    const \u0275$index_73_r9 = ctx_r6.$index;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275styleProp("z-index", ctx_r1.isReversedListFlow() ? ctx_r1.groups.length - \u0275$index_73_r9 + 3 : null);
    \u0275\u0275property("ngClass", ctx_r1.resolvedGroupMarkerClass());
    \u0275\u0275attribute("data-group-label", group_r8.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", group_r8.label, " ");
  }
}
function SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_Conditional_0_Template, 2, 5, "div", 29);
    \u0275\u0275repeaterCreate(1, SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_For_2_Template, 3, 7, null, null, \u0275\u0275componentInstance().trackByItem, true);
    \u0275\u0275conditionalCreate(3, SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_Conditional_3_Template, 2, 5, "div", 29);
  }
  if (rf & 2) {
    const group_r8 = ctx.$implicit;
    const \u0275$index_73_r9 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(!ctx_r1.isReversedListFlow() && ctx_r1.shouldShowGroupMarker(group_r8, \u0275$index_73_r9) && group_r8.label ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(group_r8.items);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.isReversedListFlow() && ctx_r1.shouldShowGroupMarker(group_r8, \u0275$index_73_r9) && group_r8.label ? 3 : -1);
  }
}
function SmartListComponent_Conditional_4_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, SmartListComponent_Conditional_4_Conditional_4_Conditional_0_For_1_Template, 4, 2, null, null, \u0275\u0275componentInstance().trackByGroup, true);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r1.groups);
  }
}
function SmartListComponent_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SmartListComponent_Conditional_4_Conditional_4_Conditional_0_Template, 2, 0);
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.resolvedItemTemplate()) ? 0 : -1, tmp_7_0);
  }
}
function SmartListComponent_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 24);
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const emptyState_r13 = \u0275\u0275reference(14);
    \u0275\u0275property("ngTemplateOutlet", emptyState_r13);
  }
}
function SmartListComponent_Conditional_4_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 35);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("height", ctx_r1.resolvedFooterSpacerHeight());
  }
}
function SmartListComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, SmartListComponent_Conditional_4_Conditional_0_Template, 4, 3, "div", 21);
    \u0275\u0275elementStart(1, "div", 22, 3);
    \u0275\u0275listener("wheel", function SmartListComponent_Conditional_4_Template_div_wheel_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onHorizontalWheel($event));
    })("scroll", function SmartListComponent_Conditional_4_Template_div_scroll_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onListScroll($event));
    })("scrollend", function SmartListComponent_Conditional_4_Template_div_scrollend_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onListScrollEnd($event));
    })("touchstart", function SmartListComponent_Conditional_4_Template_div_touchstart_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSurfaceTouchStart());
    })("touchend", function SmartListComponent_Conditional_4_Template_div_touchend_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSurfaceTouchEnd());
    })("touchcancel", function SmartListComponent_Conditional_4_Template_div_touchcancel_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSurfaceTouchEnd());
    });
    \u0275\u0275conditionalCreate(3, SmartListComponent_Conditional_4_Conditional_3_Template, 4, 5, "div", 23);
    \u0275\u0275conditionalCreate(4, SmartListComponent_Conditional_4_Conditional_4_Template, 1, 1)(5, SmartListComponent_Conditional_4_Conditional_5_Template, 1, 1, "ng-container", 24);
    \u0275\u0275conditionalCreate(6, SmartListComponent_Conditional_4_Conditional_6_Template, 1, 2, "div", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.shouldRenderListHeaderOutsideScroll() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275styleProp("--smart-list-desktop-columns", ctx_r1.resolvedDesktopColumns())("--smart-list-mobile-columns", ctx_r1.resolvedMobileColumns())("--smart-list-scroll-padding-top", ctx_r1.resolvedScrollPaddingTop())("--smart-list-sticky-header-height", ctx_r1.stickyHeaderHeightPx > 0 ? ctx_r1.stickyHeaderHeightPx : null, "px");
    \u0275\u0275classProp("smart-list--list", true)("smart-list--stack", ctx_r1.resolvedListLayout() === "stack")("smart-list--card-grid", ctx_r1.resolvedListLayout() === "card-grid")("smart-list--thread", ctx_r1.resolvedListLayout() === "thread")("smart-list--horizontal", ctx_r1.isHorizontalList())("smart-list--compact-horizontal", ctx_r1.shouldUseCompactHorizontal())("smart-list--mobile-stepper", ctx_r1.resolvedMobileStepper())("smart-list--flow-reverse", ctx_r1.isReversedListFlow())("smart-list--presentation-list", ctx_r1.resolvedPresentation() === "list")("smart-list--presentation-fullscreen", ctx_r1.resolvedPresentation() === "fullscreen")("smart-list--desktop-columns-1", ctx_r1.resolvedDesktopColumns() === "1")("smart-list--desktop-columns-2", ctx_r1.resolvedDesktopColumns() === "2")("smart-list--desktop-columns-3", ctx_r1.resolvedDesktopColumns() === "3")("smart-list--desktop-columns-4", ctx_r1.resolvedDesktopColumns() === "4")("smart-list--mobile-columns", ctx_r1.resolvedMobileColumns() !== null)("smart-list--snap-none", ctx_r1.resolvedSnapMode() === "none" || ctx_r1.suppressListSnapNearEnd || ctx_r1.shouldSuppressSnapDuringTouch() || ctx_r1.shouldSuspendHorizontalSnap())("smart-list--snap-proximity", ctx_r1.resolvedSnapMode() === "proximity" && !ctx_r1.suppressListSnapNearEnd && !ctx_r1.shouldSuppressSnapDuringTouch() && !ctx_r1.shouldSuspendHorizontalSnap())("smart-list--snap-mandatory", ctx_r1.resolvedSnapMode() === "mandatory" && !ctx_r1.suppressListSnapNearEnd && !ctx_r1.shouldSuppressSnapDuringTouch() && !ctx_r1.shouldSuspendHorizontalSnap());
    \u0275\u0275property("ngClass", ctx_r1.resolvedContainerClass());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.shouldShowStickyHeader() && !ctx_r1.shouldRenderListHeaderOutsideScroll() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.groups.length > 0 ? 4 : 5);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.resolvedFooterSpacerHeight() !== null ? 6 : -1);
  }
}
function SmartListComponent_Conditional_5_Conditional_1_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 41);
    \u0275\u0275elementContainer(2, 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fullscreenTemplateRef_r15 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", fullscreenTemplateRef_r15)("ngTemplateOutletInjector", ctx_r1.itemTemplateInjector)("ngTemplateOutletContext", ctx_r1.hostedFullscreenItemContext(ctx, ctx_r1.hostedFullscreenStackRenderState(2), ctx_r1.hostedFullscreenStackItemIndex(2)));
  }
}
function SmartListComponent_Conditional_5_Conditional_1_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "div", 41);
    \u0275\u0275elementContainer(2, 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fullscreenTemplateRef_r15 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", fullscreenTemplateRef_r15)("ngTemplateOutletInjector", ctx_r1.itemTemplateInjector)("ngTemplateOutletContext", ctx_r1.hostedFullscreenItemContext(ctx, ctx_r1.hostedFullscreenStackRenderState(1), ctx_r1.hostedFullscreenStackItemIndex(1)));
  }
}
function SmartListComponent_Conditional_5_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, SmartListComponent_Conditional_5_Conditional_1_Conditional_2_Conditional_0_Template, 3, 3, "div", 38);
    \u0275\u0275conditionalCreate(1, SmartListComponent_Conditional_5_Conditional_1_Conditional_2_Conditional_1_Template, 3, 3, "div", 39);
    \u0275\u0275elementStart(2, "div", 40);
    \u0275\u0275listener("animationend", function SmartListComponent_Conditional_5_Conditional_1_Conditional_2_Template_div_animationend_2_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onHostedFullscreenActiveCardAnimationEnd($event));
    });
    \u0275\u0275elementStart(3, "div", 41);
    \u0275\u0275elementContainer(4, 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_10_0;
    let tmp_11_0;
    const fullscreenTemplateRef_r15 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_10_0 = ctx_r1.hostedFullscreenStackItem(2)) ? 0 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_11_0 = ctx_r1.hostedFullscreenStackItem(1)) ? 1 : -1, tmp_11_0);
    \u0275\u0275advance();
    \u0275\u0275classProp("smart-list__fullscreen-card--curling", ctx_r1.hostedFullscreenIsCurling())("smart-list__fullscreen-card--curling-backward", ctx_r1.hostedFullscreenIsCurlingBackwards());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", fullscreenTemplateRef_r15)("ngTemplateOutletInjector", ctx_r1.itemTemplateInjector)("ngTemplateOutletContext", ctx_r1.hostedFullscreenItemContext(ctx, ctx_r1.hostedFullscreenCurrentRenderState(), ctx_r1.hostedFullscreenCurrentItemIndex()));
  }
}
function SmartListComponent_Conditional_5_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 24);
  }
  if (rf & 2) {
    \u0275\u0275nextContext(3);
    const fullscreenEmptyState_r16 = \u0275\u0275reference(12);
    \u0275\u0275property("ngTemplateOutlet", fullscreenEmptyState_r16);
  }
}
function SmartListComponent_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37, 4);
    \u0275\u0275conditionalCreate(2, SmartListComponent_Conditional_5_Conditional_1_Conditional_2_Template, 5, 9)(3, SmartListComponent_Conditional_5_Conditional_1_Conditional_3_Template, 1, 1, "ng-container", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_8_0 = ctx_r1.hostedFullscreenCurrentItem()) ? 2 : 3, tmp_8_0);
  }
}
function SmartListComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275conditionalCreate(1, SmartListComponent_Conditional_5_Conditional_1_Template, 4, 1, "div", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("smart-list__stage-overlay--with-rating-bar", ctx_r1.shouldRenderPaginationRatingBar());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r1.resolvedFullscreenItemTemplate()) ? 1 : -1, tmp_6_0);
  }
}
function SmartListComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-indicator", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const headerProgressConfig_r17 = \u0275\u0275nextContext().hostedIndicatorConfig();
    \u0275\u0275advance();
    \u0275\u0275property("placement", headerProgressConfig_r17.placement ?? "inline")("tone", headerProgressConfig_r17.tone ?? "default")("state", headerProgressConfig_r17.state ?? "scrolling")("position", headerProgressConfig_r17.position ?? 0);
  }
}
function SmartListComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "button", 44);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_7_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPaginationPrev($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 45);
    \u0275\u0275listener("click", function SmartListComponent_Conditional_7_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPaginationNext($event));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.canMovePagination(-1));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.canMovePagination(1));
  }
}
function SmartListComponent_Conditional_8_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 47);
  }
  if (rf & 2) {
    const dotIndex_r19 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-active", ctx_r1.isHorizontalPaginationDotActive(dotIndex_r19));
  }
}
function SmartListComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, SmartListComponent_Conditional_8_For_2_Template, 1, 2, "span", 46, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.horizontalPaginationDotIndexes());
  }
}
function SmartListComponent_ng_template_11_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.hostedFullscreenEmptyDescription()));
  }
}
function SmartListComponent_ng_template_11_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48)(1, "h4");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, SmartListComponent_ng_template_11_Conditional_0_Conditional_4_Template, 3, 3, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 2, ctx_r1.hostedFullscreenEmptyLabel()));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hostedFullscreenEmptyDescription() ? 4 : -1);
  }
}
function SmartListComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SmartListComponent_ng_template_11_Conditional_0_Template, 5, 4, "div", 48);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.initialLoading ? 0 : -1);
  }
}
function SmartListComponent_ng_template_13_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.emptyDescription()));
  }
}
function SmartListComponent_ng_template_13_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "h4");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, SmartListComponent_ng_template_13_Conditional_0_Conditional_4_Template, 3, 3, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 2, ctx_r1.emptyLabel()));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.emptyDescription() ? 4 : -1);
  }
}
function SmartListComponent_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SmartListComponent_ng_template_13_Conditional_0_Template, 5, 4, "div", 49);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.initialLoading ? 0 : -1);
  }
}
var SmartListComponent = class _SmartListComponent {
  static DEFAULT_LOADING_DELAY_MS = 0;
  static DEFAULT_LOADING_WINDOW_MS = ROUTE_CONFIG.defaultRequestTimeoutMs;
  static DEFAULT_MOBILE_BREAKPOINT_PX = 760;
  static DEFAULT_MOBILE_PAGE_SIZE_CAP = 6;
  static QUICK_COMPLETE_THRESHOLD_MS = 120;
  static HOSTED_FULLSCREEN_STACK_SIZE = 3;
  static HOSTED_FULLSCREEN_PAGE_CURL_DURATION_MS = 420;
  static LIST_SNAP_SETTLE_DELAY_MS = 250;
  static LIST_SNAP_SETTLE_GUARD_MS = 280;
  static PAGINATION_RATING_MENU_ID = "smart-list-pagination-rating";
  static PAGINATION_RATING_ITEM_ID = "pagination-rating";
  static LIST_CARD_SNAP_TARGET_SELECTOR = ".activities-row-item, .asset-item-card, .activities-card, .event-explore-card, .experience-item-card";
  cdr = inject(ChangeDetectorRef);
  itemTemplateInjector = inject(Injector);
  itemMenuDispatcher = inject(AppMenuDispatcher);
  pollCoordinator = inject(UiPollCoordinator);
  restoreAnchorSequence = 0;
  ngZone = inject(NgZone);
  scrollHostRef;
  paginationMenuOutlet;
  config = {};
  loadPage = null;
  loaders = null;
  itemTemplate = null;
  fullscreenItemTemplate = null;
  query = null;
  view = null;
  presentation = null;
  sort = null;
  direction = null;
  filters = null;
  groupBy = null;
  stateChange = new EventEmitter();
  viewChange = new EventEmitter();
  itemSelect = new EventEmitter();
  menuItemSelect = new EventEmitter();
  refresh = new EventEmitter();
  items = [];
  groups = [];
  prependRestoreSpacerAnchorKey = null;
  prependRestoreSpacerId = null;
  prependRestoreSpacerHeight = 0;
  pages = [];
  stickyLabel = "";
  stickyHeaderHeightPx = 0;
  autoFooterSpacerHeightPx = 0;
  loading = false;
  initialLoading = true;
  suppressListSnapNearEnd = false;
  horizontalListScrollInProgress = false;
  total = 0;
  resolvedListTrackKeys = [];
  fallbackTrackKeyByObject = /* @__PURE__ */ new WeakMap();
  sourceItemByIdentity = /* @__PURE__ */ new Map();
  listItemIndexByObject = /* @__PURE__ */ new WeakMap();
  resolvedListTrackKeyByObject = /* @__PURE__ */ new WeakMap();
  fallbackTrackKeySequence = 0;
  converterContext = null;
  totalItemCount() {
    return this.total;
  }
  onDispatchedMenuItemSelect(event) {
    this.menuItemSelect.emit(event);
  }
  onMenuOutletItemSelect(event) {
    if (this.isPaginationRatingMenuSelect(event)) {
      const score = Number(event.value);
      if (Number.isFinite(score)) {
        this.onPaginationRatingSelect(score);
      }
      return;
    }
    this.refreshSurfaceSoon();
    this.onDispatchedMenuItemSelect(event);
  }
  dispatchedMenuItems() {
    const menu = this.itemMenuDispatcher.activeMenu();
    if (!menu) {
      return null;
    }
    const itemMenu = this.itemMenuContext(menu.context);
    const currentItem = itemMenu ? smartListItemByIdentity(this.items, itemMenu.itemId, (item, index) => this.cacheTrackKey(item, index)) ?? itemMenu.item : null;
    return this.config.menuItems?.({
      menu,
      query: this.currentQuery(),
      items: this.items,
      item: currentItem,
      itemId: itemMenu?.itemId ?? null,
      request: itemMenu?.request ?? null
    }) ?? menu.items;
  }
  itemMenuContext(context) {
    if (!context || typeof context !== "object") {
      return null;
    }
    const candidate = context;
    return candidate.menu === "smart-list-item" && typeof candidate.itemId === "string" ? candidate : null;
  }
  openItemMenu(item, request) {
    const itemId = `${request.id ?? ""}`.trim();
    if (!itemId) {
      return;
    }
    const menuId = `smart-list-item:${itemId}`;
    if (this.itemMenuDispatcher.isOpen(menuId)) {
      this.itemMenuDispatcher.close(menuId);
      this.refreshSurfaceSoon();
      return;
    }
    this.itemMenuDispatcher.open({
      id: menuId,
      kind: request.kind ?? "select",
      title: request.title ?? null,
      items: request.items ?? [],
      context: {
        menu: "smart-list-item",
        itemId,
        item,
        request
      },
      triggerRect: request.triggerRect ?? null,
      openUp: request.openUp === true,
      panelAlign: request.panelAlign ?? "auto",
      panelMode: request.panelMode ?? "auto",
      closeOnSelect: request.closeOnSelect !== false,
      onClose: () => {
        request.closeTrigger?.();
        this.refreshSurfaceSoon();
      }
    }, null);
    if (request.panelMode === "dock" && this.resolvedPresentation() !== "fullscreen") {
      this.revealDockedItemMenuSoon(item);
    }
  }
  menuOpen() {
    return this.itemMenuDispatcher.activeMenu() !== null;
  }
  isMenuOpen(id) {
    return this.itemMenuDispatcher.isOpen(id);
  }
  closeMenu(id) {
    this.itemMenuDispatcher.close(id);
  }
  onViewportResize() {
    this.refreshSurfaceSoon();
    this.syncHorizontalViewportAfterResize();
  }
  hasMore = true;
  pageIndex = 0;
  nextPageCursor = null;
  scrollable = false;
  progress = 0;
  loadingProgress = 0;
  loadingOverdue = false;
  currentViewKey = null;
  currentViewMode = "list";
  previousPresentation = "list";
  afterViewInit = false;
  pendingScrollResetAfterViewInit = false;
  loadSequence = 0;
  loadingCounter = 0;
  loadingStartedAtMs = 0;
  autoplayTimer = null;
  autoplayPaused = false;
  loadingInterval = null;
  loadingCompleteTimer = null;
  suppressVisibleLoadingProgress = false;
  listSnapSettleTimer = null;
  listSnapSettleGuardTimer = null;
  horizontalListScrollEndTimer = null;
  horizontalCursorScrollLockTargetIndex = null;
  horizontalCursorScrollLockTimer = null;
  suppressListSnapSettle = false;
  flushScheduled = false;
  awaitScrollReset = false;
  awaitScrollResetBaselineTop = null;
  awaitScrollResetBaselineReverseDistance = null;
  stepperInitialAnchorKey = "";
  listPageLoadAbortController = null;
  stepperPageLoadAbortController = null;
  stepperPreloadAbortController = null;
  activePageAdapter = null;
  weekCounterViewportPageKey = null;
  hostedFullscreenPendingDelta = 0;
  hostedFullscreenCompletingTransition = false;
  hostedFullscreenTransitionTimer = null;
  pollScheduler = new UiTaskScheduler({
    intervalMs: () => this.resolvedPollIntervalMs(),
    state: () => this.visiblePollQuery(),
    task: ({ state, signal }) => this.pollVisibleItems(state, signal),
    pollCoordinator: this.pollCoordinator,
    pollPriority: "foreground"
  });
  suspendSnapReactivation = false;
  deferSnapReactivationUntilScroll = false;
  lastResolvedBaseSnapMode = null;
  releaseDeferredSnapOnScroll() {
    if (!this.suspendSnapReactivation && !this.deferSnapReactivationUntilScroll) {
      return;
    }
    this.suspendSnapReactivation = false;
    this.deferSnapReactivationUntilScroll = false;
    this.cdr.markForCheck();
  }
  isTouchingSurface = false;
  touchStartScrollSnapType = null;
  onSurfaceTouchStart() {
    this.isTouchingSurface = true;
    if (this.isHorizontalList()) {
      this.pausePaginationAutoplay();
    }
    this.cdr.markForCheck();
    this.clearListSnapSettleTimers();
    this.stepper.clearSettleTimers();
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (scrollElement) {
      if (this.shouldUseHorizontalMobileStepper() || this.shouldUseTimelineMobileStepper()) {
        return;
      }
      const currentTop = scrollElement.scrollTop;
      const currentLeft = scrollElement.scrollLeft;
      scrollElement.style.scrollBehavior = "auto";
      if (this.touchStartScrollSnapType === null) {
        this.touchStartScrollSnapType = scrollElement.style.scrollSnapType;
      }
      scrollElement.style.scrollSnapType = "none";
      scrollElement.scrollTop = currentTop;
      scrollElement.scrollLeft = currentLeft;
      scrollElement.style.scrollBehavior = "";
    }
  }
  onSurfaceTouchEnd() {
    this.isTouchingSurface = false;
    this.cdr.markForCheck();
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (!scrollElement) {
      this.touchStartScrollSnapType = null;
      return;
    }
    if (!this.shouldUseHorizontalMobileStepper() && !this.shouldUseTimelineMobileStepper()) {
      scrollElement.style.scrollSnapType = this.touchStartScrollSnapType ?? "";
      this.touchStartScrollSnapType = null;
    }
    if (this.currentViewMode === "list") {
      if (this.isHorizontalList() && !this.shouldUseHorizontalMobileStepper()) {
        this.clearHorizontalListScrollEndTimer();
      }
      if (this.shouldUseHorizontalMobileStepper()) {
        this.touchStartScrollSnapType = null;
        return;
      }
      this.scheduleListSnapSettle(scrollElement);
      return;
    }
    if (this.isPageMode()) {
      if (this.usesTimelineViewportScroll(scrollElement)) {
        this.touchStartScrollSnapType = null;
        this.updateTimelineViewportScrollState(scrollElement);
        return;
      }
      this.stepper.scheduleScrollEnd(scrollElement);
    }
  }
  finiteStepper = new FiniteStepper({
    items: () => this.items,
    total: () => this.total,
    hasMore: () => this.hasMore,
    loading: () => this.loading,
    markDirty: () => {
      this.emitState();
      this.cdr.markForCheck();
    }
  });
  stepper = new InfiniteStepper({
    pageSelector: ".smart-list__page"
  }, {
    isActive: () => this.isPageMode(),
    isTouchingSurface: () => this.isTouchingSurface,
    scrollElement: () => this.scrollHostRef?.nativeElement ?? null,
    pageAdapter: () => this.activePageAdapter,
    viewConfig: () => this.activePageAdapter?.config(this.config) ?? null,
    baseQuery: () => this.currentBaseQuery(),
    fallbackAnchor: () => AppUtils.dateOnly(/* @__PURE__ */ new Date()),
    trackByKey: (item) => this.pageTrackKey(0, item),
    cancelPendingPageLoad: () => this.cancelPendingAnchorPageLoad(),
    cancelPendingPreload: () => this.cancelPendingAnchorPreload(),
    loadPage: (anchor, query, options) => {
      void this.loadAnchorPage(anchor, query, false, options);
    },
    preloadPage: (anchor, query) => {
      void this.preloadAnchorPage(anchor, query);
    },
    currentProgress: () => this.progress,
    applySnapshot: (snapshot) => this.applyPageSnapshot(snapshot),
    applySurfaceState: (state, scrollElement) => this.applyPageSurfaceState(state, scrollElement),
    afterSnapshotApplied: () => this.focusVisibleWeekCounterHourSoon(),
    detectChanges: () => this.cdr.detectChanges(),
    emitState: () => this.emitState(),
    markForCheck: () => this.cdr.markForCheck()
  });
  ngAfterViewInit() {
    this.afterViewInit = true;
    if (this.pendingScrollResetAfterViewInit) {
      this.pendingScrollResetAfterViewInit = false;
      this.resetScrollSoon();
    }
    this.refreshSurfaceSoon();
  }
  ngOnChanges(changes) {
    const previousPresentation = this.previousPresentation;
    const nextViewKey = this.resolveViewKey();
    const previousViewKey = this.currentViewKey;
    this.currentViewKey = nextViewKey;
    this.currentViewMode = this.resolveViewMode(nextViewKey);
    this.activePageAdapter = this.isPageMode() ? this.pageAdapterForMode(this.currentViewMode) : null;
    this.previousPresentation = this.resolvedPresentation();
    const pageDataInputsChanged = Boolean(changes["config"] || changes["loadPage"] || changes["loaders"] || changes["query"] || changes["sort"] || changes["direction"] || changes["filters"] || changes["groupBy"]);
    if (pageDataInputsChanged) {
      this.clearPageViewCache();
    }
    const nextInitialAnchorKey = this.stepper.initialAnchorKey();
    const initialAnchorChanged = nextInitialAnchorKey !== this.stepperInitialAnchorKey;
    this.stepperInitialAnchorKey = nextInitialAnchorKey;
    if (changes["view"] && previousViewKey !== this.currentViewKey || initialAnchorChanged && this.isPageMode()) {
      this.stepper.clearSettleTimers();
      this.stepper.suppressSettle = false;
      if (this.isPageMode()) {
        this.stepper.setWindowFocus(this.stepper.initialAnchor(), { useInitialPageIndex: true });
      } else {
        this.stepper.clearWindow();
      }
    }
    if (previousViewKey && previousViewKey !== this.currentViewKey && this.currentViewKey) {
      this.viewChange.emit(this.currentViewKey);
    }
    if (changes["config"] || changes["loadPage"] || changes["loaders"] || changes["query"] || changes["view"] || changes["sort"] || changes["direction"] || changes["filters"] || changes["groupBy"]) {
      this.resetPaginationAutoplay();
      this.resetAndReload();
    }
    if (previousPresentation !== this.previousPresentation && this.previousPresentation === "fullscreen") {
      this.syncCursorIndexToVisibleListItem();
    }
    if (!this.shouldUseHostedFullscreenPagination()) {
      this.resetHostedFullscreenTransition();
    }
  }
  ngOnDestroy() {
    this.loadSequence += 1;
    this.listPageLoadAbortController?.abort();
    this.listPageLoadAbortController = null;
    this.pollScheduler.destroy();
    this.stepper.reset();
    this.clearListSnapSettleTimers();
    this.clearHorizontalCursorScrollLock();
    this.clearLoadingAnimation();
    this.clearHostedFullscreenTransitionTimer();
    this.clearPaginationAutoplay();
    this.finiteStepper.destroy();
  }
  reload() {
    this.resetAndReload();
  }
  refreshVisibleItems() {
    return this.pollVisibleItems(this.visiblePollQuery());
  }
  scrollElement() {
    return this.scrollHostRef?.nativeElement ?? null;
  }
  setView(viewKey) {
    if (!viewKey.trim() || this.currentViewKey === viewKey) {
      return;
    }
    this.currentViewKey = viewKey;
    this.currentViewMode = this.resolveViewMode(viewKey);
    this.viewChange.emit(viewKey);
    this.reload();
  }
  indicatorBarConfig(overrides = {}, mode = "surface") {
    const cursor = this.finiteStepper.state();
    const loadingActive = this.isLoadingActive();
    const position = mode === "cursor" ? cursor.progress : this.progress;
    return __spreadValues({
      position: loadingActive ? this.loadingProgress : position,
      state: loadingActive ? this.loadingOverdue ? "loading-overdue" : "loading" : "scrolling"
    }, overrides);
  }
  shouldRenderHostedIndicator() {
    if (this.config.headerProgress && this.config.headerProgress.enabled !== void 0) {
      return this.resolveConfigValue(this.config.headerProgress.enabled, false);
    }
    return this.resolvedLoadingDelayMs() > 0;
  }
  hostedIndicatorConfig() {
    const placement = this.resolveConfigValue(this.config.headerProgress?.placement, "inline");
    const state = this.resolveConfigValue(this.config.headerProgress?.state, "active");
    return this.indicatorBarConfig(__spreadValues({
      tone: this.resolveConfigValue(this.config.headerProgress?.tone, "default"),
      placement
    }, state === "inactive" ? { state: "inactive" } : {}), this.resolvedHeaderProgressMode());
  }
  resolvedPaginationMode() {
    const value = this.config.pagination?.mode;
    if (typeof value === "function") {
      return value(this.cursorItem(), this.currentQuery());
    }
    return value ?? "scroll";
  }
  shouldRenderPaginationArrows() {
    return this.resolvedPaginationMode() === "arrows" && !this.shouldRenderStickyPaginationActions();
  }
  shouldRenderStickyPaginationActions() {
    return this.resolvedPaginationMode() === "arrows" && this.resolveConfigValue(this.config.pagination?.headerControls, false) && this.shouldShowStickyHeader();
  }
  shouldRenderListHeaderOutsideScroll() {
    return this.currentViewMode === "list" && this.isHorizontalList() && this.shouldRenderStickyPaginationActions();
  }
  canMovePagination(direction) {
    if (this.isTimelineMode()) {
      const scrollElement = this.scrollHostRef?.nativeElement ?? null;
      if (this.pages.length === 1 && scrollElement) {
        return this.canScrollTimelineViewport(direction, scrollElement);
      }
      return this.pages.length > 1 || this.pages.length > 0 && direction > 0;
    }
    const delta = this.paginationCursorDelta(direction);
    return delta !== 0 && this.finiteStepper.canMove(delta);
  }
  shouldRenderHorizontalPaginationDots() {
    return this.isHorizontalList() && this.finiteStepper.state().total > 1;
  }
  horizontalPaginationDotIndexes() {
    const total = this.finiteStepper.state().total;
    return Array.from({ length: Math.max(0, total) }, (_item, index) => index);
  }
  isHorizontalPaginationDotActive(index) {
    return this.finiteStepper.state().index === index;
  }
  resolvedPaginationRatingBarConfig() {
    const baseConfig = this.config.pagination?.ratingBarConfig?.(this.cursorItem(), this.currentQuery()) ?? null;
    if (!baseConfig) {
      return null;
    }
    if (!this.shouldUseHostedFullscreenPagination()) {
      return baseConfig;
    }
    return __spreadProps(__spreadValues({}, baseConfig), {
      presentation: "fullscreen",
      dock: {
        enabled: true,
        state: "permanent"
      }
    });
  }
  shouldRenderPaginationRatingBar() {
    return this.resolvedPaginationMode() === "rating-stars" && this.resolvedPaginationRatingBarConfig() !== null;
  }
  paginationRatingMenu() {
    if (!this.shouldRenderPaginationRatingBar()) {
      return null;
    }
    return {
      id: _SmartListComponent.PAGINATION_RATING_MENU_ID,
      kind: "select",
      layout: "row",
      title: null,
      filterable: false,
      items: this.paginationRatingMenuItems(),
      model: null,
      groups: [],
      value: null,
      trigger: null,
      context: { menu: _SmartListComponent.PAGINATION_RATING_MENU_ID },
      openUp: false,
      panelAlign: "auto",
      panelMode: this.shouldUseHostedFullscreenPagination() ? "fixed" : "dock",
      mobileBreakpointPx: 760,
      closeOnSelect: false,
      triggerElement: null,
      triggerRect: null,
      onClose: null
    };
  }
  paginationRatingMenuItems() {
    const config = this.resolvedPaginationRatingBarConfig();
    if (!config) {
      return [];
    }
    return [{
      id: _SmartListComponent.PAGINATION_RATING_ITEM_ID,
      kind: "rate",
      closeOnSelect: false,
      value: this.resolvedPaginationRatingBarValue(),
      rateConfig: config,
      context: { menu: _SmartListComponent.PAGINATION_RATING_MENU_ID }
    }];
  }
  resolvedPaginationRatingBarValue() {
    const value = this.config.pagination?.ratingBarValue?.(this.cursorItem(), this.currentQuery()) ?? 0;
    return Number.isFinite(value) ? value : 0;
  }
  onPaginationPrev(event) {
    event.stopPropagation();
    this.pausePaginationAutoplay();
    if (this.shouldUseHostedFullscreenPagination()) {
      this.interruptHostedFullscreenTransition();
      void this.advanceHostedFullscreenPagination(-1);
      return;
    }
    if (this.isTimelineMode()) {
      this.moveTimelineViewport(-1);
      return;
    }
    void this.moveCursor(this.paginationCursorDelta(-1));
  }
  onPaginationNext(event) {
    event.stopPropagation();
    this.pausePaginationAutoplay();
    if (this.shouldUseHostedFullscreenPagination()) {
      this.interruptHostedFullscreenTransition();
      void this.advanceHostedFullscreenPagination(1);
      return;
    }
    if (this.isTimelineMode()) {
      this.moveTimelineViewport(1);
      return;
    }
    void this.moveCursor(this.paginationCursorDelta(1));
  }
  onPaginationRatingSelect(score) {
    if (this.shouldUseHostedFullscreenPagination()) {
      void this.handleHostedFullscreenRatingSelect(score);
      return;
    }
    void this.config.pagination?.onRatingSelect?.(this.cursorItem(), score, this.currentQuery());
  }
  isPaginationRatingMenuSelect(event) {
    const context = event.context;
    return context?.menu === _SmartListComponent.PAGINATION_RATING_MENU_ID && event.id === _SmartListComponent.PAGINATION_RATING_ITEM_ID;
  }
  itemsSnapshot() {
    return this.items;
  }
  visibleItemCount() {
    return this.items.length;
  }
  async preloadNextListPage(options = {}) {
    if (this.currentViewMode !== "list" || this.loading || !this.hasMore && options.force !== true) {
      return false;
    }
    const previousItemCount = this.items.length;
    await this.loadNextPage();
    return this.items.length > previousItemCount;
  }
  findVisibleItem(predicate) {
    return this.items.find(predicate) ?? null;
  }
  paginationMenuHeightPx() {
    return this.shouldRenderPaginationRatingBar() ? this.paginationMenuOutlet?.heightPx() ?? 0 : 0;
  }
  isPaginationMenuTarget(target) {
    return this.shouldRenderPaginationRatingBar() && (this.paginationMenuOutlet?.containsTarget(target) ?? false);
  }
  cursorState() {
    return this.finiteStepper.state();
  }
  cursorItem() {
    return this.finiteStepper.state().item;
  }
  isLoadingActive() {
    return !this.suppressVisibleLoadingProgress && (this.loading || this.loadingProgress > 0);
  }
  isFullscreenPaginationAnimating() {
    return this.finiteStepper.animating;
  }
  beginHostedLoading() {
    this.startLoadingAnimation();
    this.emitState();
    this.cdr.markForCheck();
  }
  endHostedLoading() {
    this.endLoadingAnimation();
    this.cdr.markForCheck();
  }
  clearHostedLoading() {
    this.clearLoadingAnimation();
    this.emitState();
    this.cdr.markForCheck();
  }
  replaceVisibleItems(items, options = {}) {
    if (this.currentViewMode !== "list") {
      return;
    }
    this.finiteStepper.setEmptyCursor(false, { notify: false });
    this.clearLoadingAnimation();
    this.loading = false;
    this.initialLoading = false;
    this.clearAwaitScrollReset();
    this.items = this.orderSortableItems(items);
    this.cacheDirectSourceItems();
    this.total = Number.isFinite(options.total) ? Math.max(this.items.length, Math.trunc(Number(options.total))) : this.items.length;
    const computedHasMore = this.items.length < this.total;
    this.hasMore = typeof options.hasMore === "boolean" ? options.hasMore && computedHasMore : computedHasMore;
    if (Object.prototype.hasOwnProperty.call(options, "nextCursor")) {
      this.nextPageCursor = typeof options.nextCursor === "string" && options.nextCursor.trim() ? options.nextCursor.trim() : null;
    }
    this.syncGroups();
    this.finiteStepper.syncBounds();
    this.emitState();
    this.cdr.markForCheck();
    this.refreshSurfaceSoon();
  }
  adjustVisibleTotal(delta) {
    if (this.currentViewMode !== "list") {
      return false;
    }
    const numericDelta = Number(delta);
    if (!Number.isFinite(numericDelta)) {
      return false;
    }
    const normalizedDelta = Math.trunc(numericDelta);
    if (normalizedDelta === 0) {
      return false;
    }
    const nextTotal = Math.max(this.items.length, this.total + normalizedDelta);
    if (nextTotal === this.total) {
      return false;
    }
    this.replaceVisibleItems(this.items, {
      total: nextTotal,
      nextCursor: this.nextPageCursor
    });
    return true;
  }
  syncVisibleItems(items, options = {}) {
    if (this.currentViewMode !== "list") {
      return false;
    }
    const nextItems = this.orderSortableItems(items);
    const nextTotal = Number.isFinite(options.total) ? Math.max(nextItems.length, Math.trunc(Number(options.total))) : nextItems.length;
    const nextComputedHasMore = nextItems.length < nextTotal;
    const nextHasMore = typeof options.hasMore === "boolean" ? options.hasMore && nextComputedHasMore : nextComputedHasMore;
    const query = this.currentQuery();
    const adapterEquals = this.cacheableConfig()?.equals;
    const equals = options.equals ?? ((current, next, index) => adapterEquals ? adapterEquals(current, next, index, query) : current === next);
    const sameShape = this.total === nextTotal && this.hasMore === nextHasMore && this.items.length === nextItems.length && this.items.every((item, index) => this.cacheTrackKey(item, index, options.trackBy) === this.cacheTrackKey(nextItems[index], index, options.trackBy));
    if (!sameShape) {
      const currentByKey = new Map(this.items.map((item, index) => [this.cacheTrackKey(item, index, options.trackBy), item]));
      const reconciledItems = nextItems.map((item, index) => {
        const current = currentByKey.get(this.cacheTrackKey(item, index, options.trackBy));
        return current !== void 0 && equals(current, item, index) ? current : item;
      });
      this.replaceVisibleItems(reconciledItems, __spreadValues({
        total: nextTotal,
        hasMore: nextHasMore
      }, Object.prototype.hasOwnProperty.call(options, "nextCursor") ? { nextCursor: options.nextCursor ?? null } : {}));
      this.emitRefresh();
      return true;
    }
    let changed = false;
    if (Object.prototype.hasOwnProperty.call(options, "nextCursor")) {
      const nextCursor = typeof options.nextCursor === "string" && options.nextCursor.trim() ? options.nextCursor.trim() : null;
      if (this.nextPageCursor !== nextCursor) {
        this.nextPageCursor = nextCursor;
        changed = true;
      }
    }
    const patchedItems = this.items.map((item, index) => {
      const nextItem = nextItems[index];
      if (nextItem === void 0 || equals(item, nextItem, index)) {
        return item;
      }
      changed = true;
      return nextItem;
    });
    if (!changed) {
      return false;
    }
    this.items = patchedItems;
    this.cacheDirectSourceItems();
    this.syncGroups();
    this.finiteStepper.syncBounds();
    this.emitState();
    this.emitRefresh();
    this.cdr.markForCheck();
    return true;
  }
  convertItems(sources, context) {
    const query = this.currentQuery();
    this.converterContext = context ?? null;
    const converter = this.resolvedConverter(query);
    if (!converter) {
      return [];
    }
    const items = converter.convertList(sources, this.converterOptions(query));
    this.cacheSourceItems(items, sources);
    return items;
  }
  async moveCursor(delta) {
    if (!Number.isFinite(delta) || delta === 0) {
      return false;
    }
    return this.setCursorIndex(this.finiteStepper.state().index + Math.trunc(delta));
  }
  resolvedPaginationStep() {
    return this.resolveConfigValue(this.config.pagination?.step, "item");
  }
  paginationCursorDelta(direction) {
    return this.finiteStepper.deltaFor(direction, this.resolvedPaginationStep(), this.paginationPageSize());
  }
  paginationPageSize() {
    if (this.isHorizontalList() && this.shouldUseHorizontalMobileStepper()) {
      return 1;
    }
    const columns = Number(this.resolvedDesktopColumns());
    if (Number.isFinite(columns) && columns > 0) {
      return Math.max(1, Math.trunc(columns));
    }
    const pageSize = Number(this.currentQuery().pageSize);
    return Number.isFinite(pageSize) && pageSize > 0 ? Math.max(1, Math.trunc(pageSize)) : 1;
  }
  async setCursorIndex(index) {
    const normalizedIndex = Math.max(0, Math.trunc(index));
    this.finiteStepper.setIndex(normalizedIndex, { notify: false });
    this.emitState();
    this.cdr.markForCheck();
    while (this.currentViewMode === "list" && this.items.length <= normalizedIndex && this.hasMore && !this.loading) {
      await this.loadNextPage();
    }
    if (this.currentViewMode === "list" && this.resolvedPresentation() === "fullscreen" && this.hasMore && !this.loading) {
      const remaining = this.items.length - (normalizedIndex + 1);
      if (remaining <= _SmartListComponent.HOSTED_FULLSCREEN_STACK_SIZE - 1) {
        void this.loadNextPage();
      }
    }
    this.finiteStepper.syncBounds();
    this.scrollHorizontalListItemIntoView(normalizedIndex, "smooth");
    this.emitState();
    this.cdr.markForCheck();
    return this.finiteStepper.state().index === normalizedIndex;
  }
  isPageMode() {
    return this.currentViewMode === "month" || this.currentViewMode === "week" || this.currentViewMode === "timeline";
  }
  isMonthMode() {
    return this.currentViewMode === "month";
  }
  isWeekMode() {
    return this.currentViewMode === "week";
  }
  isTimelineMode() {
    return this.currentViewMode === "timeline";
  }
  resolvedContainerClass() {
    return this.resolveConfigValue(this.config.containerClass, null);
  }
  resolvedStickyHeaderClass() {
    return this.resolveConfigValue(this.config.stickyHeaderClass, null);
  }
  resolvedGroupMarkerClass() {
    return this.resolveConfigValue(this.config.groupMarkerClass, null);
  }
  resolvedFooterSpacerHeight() {
    const configuredHeight = this.resolveConfigValue(this.config.footerSpacerHeight, null);
    if (this.autoFooterSpacerHeightPx <= 0) {
      return configuredHeight;
    }
    const autoHeight = `${this.autoFooterSpacerHeightPx}px`;
    return configuredHeight ? `calc(${configuredHeight} + ${autoHeight})` : autoHeight;
  }
  resolvedPresentation() {
    return this.presentation ?? this.resolveConfigValue(this.config.presentation, "list");
  }
  resolvedSelectMode() {
    return this.resolveConfigValue(this.config.selectMode, false);
  }
  resolvedListLayout() {
    return this.resolveConfigValue(this.config.listLayout, "stack");
  }
  resolvedOrientation() {
    return this.resolveConfigValue(this.config.orientation, "vertical");
  }
  isHorizontalList() {
    return this.currentViewMode === "list" && this.resolvedOrientation() === "horizontal";
  }
  shouldUseCompactHorizontal() {
    return this.isHorizontalList() && this.resolveConfigValue(this.config.compactHorizontal, false);
  }
  shouldSuspendHorizontalSnap() {
    return this.horizontalListScrollInProgress && this.isCompactHorizontalViewport() && !this.shouldUseHorizontalMobileStepper();
  }
  shouldSuppressSnapDuringTouch() {
    return this.isTouchingSurface && !this.shouldUseHorizontalMobileStepper();
  }
  resolvedMobileStepper() {
    return this.resolveConfigValue(this.config.mobileStepper, false);
  }
  isReversedListFlow() {
    return this.resolveConfigValue(this.config.listFlow, "normal") === "reverse";
  }
  resolvedDesktopColumns() {
    const value = this.resolveConfigValue(this.config.desktopColumns, null);
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return `${Math.max(1, Math.trunc(Number(value)))}`;
  }
  resolvedMobileColumns() {
    const value = this.resolveConfigValue(this.config.mobileColumns, null);
    if (value == null || `${value}`.trim() === "" || !Number.isFinite(Number(value))) {
      return null;
    }
    return `${Math.max(1, Math.trunc(Number(value)))}`;
  }
  resolvedSnapMode() {
    const baseSnapMode = this.resolveConfigValue(this.config.snapMode, "none");
    const snapMode = this.shouldUseHorizontalMobileStepper() ? "mandatory" : baseSnapMode;
    this.trackSnapModeTransition(snapMode);
    return this.deferSnapReactivationUntilScroll ? "none" : snapMode;
  }
  trackSnapModeTransition(snapMode) {
    if (this.currentViewMode !== "list") {
      this.lastResolvedBaseSnapMode = snapMode;
      this.deferSnapReactivationUntilScroll = false;
      return;
    }
    const previousSnapMode = this.lastResolvedBaseSnapMode;
    if (previousSnapMode !== null && previousSnapMode === "none" && snapMode !== "none") {
      this.deferSnapReactivationUntilScroll = true;
      this.clearListSnapSettleTimer();
    }
    if (snapMode === "none") {
      this.deferSnapReactivationUntilScroll = false;
    }
    this.lastResolvedBaseSnapMode = snapMode;
  }
  resolvedScrollPaddingTop() {
    return this.resolveConfigValue(this.config.scrollPaddingTop, null);
  }
  shouldShowStickyHeader() {
    return this.config.showStickyHeader !== false;
  }
  shouldRenderPrependRestoreSpacer(item, index) {
    if (!this.prependRestoreSpacerAnchorKey || this.prependRestoreSpacerHeight <= 0) {
      return false;
    }
    return this.itemAnchorKey(item, index) === this.prependRestoreSpacerAnchorKey;
  }
  onHorizontalWheel(event) {
    if (!this.isHorizontalList()) {
      return;
    }
    const target = event.currentTarget;
    if (!target) {
      return;
    }
    const maxScrollLeft = Math.max(0, target.scrollWidth - target.clientWidth);
    if (maxScrollLeft <= 1) {
      return;
    }
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return;
    }
    const rawDelta = event.deltaX;
    const delta = this.normalizedWheelDelta(rawDelta, event.deltaMode, target);
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.5) {
      return;
    }
    const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, target.scrollLeft + delta));
    if (Math.abs(nextScrollLeft - target.scrollLeft) < 0.5) {
      return;
    }
    this.pausePaginationAutoplay();
    this.beginHorizontalListScroll(target);
    event.preventDefault();
    target.scrollLeft = nextScrollLeft;
    this.syncListScrollState(target, { scheduleSnap: false });
    this.scheduleHorizontalListScrollEnd(target);
  }
  normalizedWheelDelta(delta, deltaMode, target) {
    if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
      return delta * 16;
    }
    if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      return delta * target.clientWidth;
    }
    return delta;
  }
  onListScroll(event) {
    const target = event.target;
    const isHorizontal = this.isHorizontalList();
    if (isHorizontal) {
      this.beginHorizontalListScroll(target);
    }
    this.syncListScrollState(target, { scheduleSnap: !isHorizontal });
    if (isHorizontal) {
      this.scheduleHorizontalListScrollEnd(target);
    }
  }
  onListScrollEnd(event) {
    const target = event.target;
    if (this.isHorizontalList()) {
      this.finishHorizontalListScroll(target);
    }
  }
  syncListScrollState(target, options = {}) {
    this.releaseDeferredSnapOnScroll();
    if (this.shouldShowStickyHeader()) {
      this.updateStickyLabel(target.scrollTop);
    } else {
      this.stickyHeaderHeightPx = 0;
    }
    this.updateListSnapNearEndSuppression(target);
    this.updateScrollProgress(target);
    this.syncHorizontalCursorIndexToVisibleListItem(target);
    this.emitState();
    this.maybeLoadMore(target);
    if (options.scheduleSnap !== false) {
      this.scheduleListSnapSettle(target);
    }
  }
  onPageScroll(event) {
    const target = event.target;
    if (this.usesTimelineViewportScroll(target)) {
      this.updateTimelineViewportScrollState(target);
      return;
    }
    this.stepper.onScroll(target);
  }
  onPageScrollEnd(event) {
    const target = event.target;
    if (this.usesTimelineViewportScroll(target)) {
      this.updateTimelineViewportScrollState(target);
      return;
    }
    this.stepper.onScrollEnd(target);
  }
  trackByGroup = (_index, group) => `${group.startIndex}:${group.label}`;
  trackByItem = (index, item) => this.config.trackBy ? this.resolvedListTrackKeyForItem(index, item) : index;
  shouldShowGroupMarker(group, groupIndex) {
    if (this.config.showGroupMarker) {
      return this.config.showGroupMarker({
        group,
        groupIndex,
        query: this.currentQuery(),
        scrollable: this.scrollable,
        totalGroups: this.groups.length
      });
    }
    if (groupIndex > 0) {
      return true;
    }
    return this.config.showFirstGroupMarker !== false;
  }
  itemContext(item, index, groupLabel) {
    return {
      $implicit: item,
      index,
      sourceItem: this.sourceItemForItem(item, index),
      groupLabel,
      query: this.currentQuery(),
      selectMode: this.resolvedSelectMode(),
      presentation: "list",
      renderState: "list",
      selectItem: (event) => this.selectSmartListItem(item, event),
      openMenu: (request) => this.openItemMenu(item, request)
    };
  }
  resolvedFullscreenItemTemplate() {
    return this.fullscreenItemTemplate ?? this.itemTemplate;
  }
  shouldRenderHostedFullscreenOverlay() {
    return this.shouldUseHostedFullscreenPagination() && this.resolvedFullscreenItemTemplate() !== null;
  }
  hostedFullscreenCurrentItem() {
    return this.finiteStepper.leavingItem ?? this.hostedFullscreenResolvedCursor().item;
  }
  hostedFullscreenCurrentItemIndex() {
    return this.hostedFullscreenResolvedCursor().index;
  }
  hostedFullscreenCurrentRenderState() {
    return this.finiteStepper.animating ? "leaving" : "active";
  }
  hostedFullscreenStackItem(slotOffset) {
    const index = this.hostedFullscreenStackItemIndex(slotOffset);
    if (index < 0 || index >= this.items.length) {
      return null;
    }
    return this.items[index] ?? null;
  }
  hostedFullscreenStackRenderState(slotOffset) {
    if (slotOffset === 1 && this.finiteStepper.animating && this.hostedFullscreenPendingDelta !== 0) {
      return "active";
    }
    return "default";
  }
  hostedFullscreenIsCurling() {
    return this.finiteStepper.animating && this.hostedFullscreenPendingDelta !== 0;
  }
  hostedFullscreenIsCurlingBackwards() {
    return this.hostedFullscreenIsCurling() && this.hostedFullscreenPendingDelta < 0;
  }
  onHostedFullscreenActiveCardAnimationEnd(event) {
    if (event.animationName !== "smart-list-fullscreen-page-curl") {
      return;
    }
    if (event.currentTarget !== event.target || !this.hostedFullscreenIsCurling()) {
      return;
    }
    void this.completeHostedFullscreenPaginationTransition();
  }
  hostedFullscreenItemContext(item, renderState, index = this.finiteStepper.state().index) {
    return {
      $implicit: item,
      index,
      sourceItem: this.sourceItemForItem(item, index),
      groupLabel: "",
      query: this.currentQuery(),
      selectMode: this.resolvedSelectMode(),
      presentation: "fullscreen",
      renderState,
      selectItem: (event) => this.selectSmartListItem(item, event),
      openMenu: (request) => this.openItemMenu(item, request)
    };
  }
  hostedFullscreenResolvedCursor() {
    const cursor = this.finiteStepper.state();
    if (cursor.item !== null || this.items.length === 0 || cursor.index >= cursor.total) {
      return cursor;
    }
    const fallbackIndex = Math.max(0, Math.min(cursor.index, this.items.length - 1));
    return __spreadProps(__spreadValues({}, cursor), {
      index: fallbackIndex,
      item: this.items[fallbackIndex] ?? null
    });
  }
  selectSmartListItem(item, event, context) {
    event?.stopPropagation();
    const itemIndex = this.items.indexOf(item);
    this.itemSelect.emit({
      item,
      sourceItem: this.sourceItemForItem(item, itemIndex),
      query: this.currentQuery(),
      currentView: this.currentViewKey,
      currentViewMode: this.currentViewMode,
      selectMode: this.resolvedSelectMode(),
      sourceEvent: event,
      calendarDate: context?.calendarDate,
      calendarDateIso: context?.calendarDateIso,
      timelineStartOffsetMinutes: context?.timelineStartOffsetMinutes,
      timelineEndOffsetMinutes: context?.timelineEndOffsetMinutes
    });
  }
  cacheSourceItems(items, sources) {
    for (const [index, item] of items.entries()) {
      const identity = `${this.cacheTrackKey(item, index)}`.trim();
      if (!identity) {
        continue;
      }
      this.sourceItemByIdentity.set(identity, sources[index]);
    }
  }
  cacheDirectSourceItems() {
    if (this.resolvedConverter(this.currentQuery())) {
      return;
    }
    this.cacheSourceItems(this.items, this.items);
  }
  sourceItemForItem(item, index) {
    const identity = `${this.cacheTrackKey(item, Math.max(0, index))}`.trim();
    return identity ? this.sourceItemByIdentity.get(identity) : void 0;
  }
  sourceItemSnapshot(identity) {
    const normalizedIdentity = identity.trim();
    return normalizedIdentity ? this.sourceItemByIdentity.get(normalizedIdentity) : void 0;
  }
  sourceItemsSnapshot() {
    return this.items.map((item, index) => this.sourceItemForItem(item, index) ?? item);
  }
  cacheVisibleSourceItem(source, item) {
    const itemKey = `${smartListItemKeyFromItem(item) ?? ""}`.trim();
    const index = this.items.findIndex((candidate, candidateIndex) => {
      if (candidate === item) {
        return true;
      }
      const candidateKey = `${smartListItemKeyFromItem(candidate) ?? ""}`.trim();
      return !!itemKey && candidateKey === itemKey || !!itemKey && `${this.cacheTrackKey(candidate, candidateIndex)}`.trim() === itemKey;
    });
    if (index < 0) {
      return;
    }
    const identity = `${this.cacheTrackKey(this.items[index], index)}`.trim();
    if (identity) {
      this.sourceItemByIdentity.set(identity, source);
    }
  }
  emitRefresh() {
    this.refresh.emit({
      items: [...this.items],
      sourceItems: this.sourceItemsSnapshot(),
      query: this.currentQuery(),
      currentView: this.currentViewKey,
      currentViewMode: this.currentViewMode
    });
  }
  hostedFullscreenEmptyLabel() {
    if (this.isLoadingActive()) {
      return "Loading more items";
    }
    if (this.config.emptyLabel !== void 0) {
      return this.emptyLabel();
    }
    if (this.items.length > 0 || this.total > 0) {
      return "No cards available";
    }
    return this.emptyLabel();
  }
  hostedFullscreenEmptyDescription() {
    if (this.isLoadingActive()) {
      return "Preloading the next stack in the background.";
    }
    if (this.config.emptyDescription !== void 0) {
      return this.emptyDescription();
    }
    if (this.items.length > 0 || this.total > 0) {
      return "Wait for more cards to load or adjust the current filter.";
    }
    return this.emptyDescription();
  }
  emptyLabel() {
    return this.resolveText(this.config.emptyLabel, "No items");
  }
  emptyDescription() {
    return this.resolveText(this.config.emptyDescription, "");
  }
  resolvedItemTemplate() {
    return this.itemTemplate;
  }
  hasPageItems() {
    return this.pages.length > 0;
  }
  isCounterPageVariant() {
    return this.activePageAdapter?.variant(this.config, this.currentBaseQuery()) === "counter";
  }
  pageCardModel() {
    return {
      mode: this.currentViewMode,
      pages: this.pages,
      config: this.activePageAdapter?.config(this.config) ?? null,
      query: this.currentQuery(),
      variant: this.isCounterPageVariant() ? "counter" : "default",
      touching: this.isTouchingSurface,
      trackByItem: (index, item) => this.pageTrackKey(index, item),
      itemTemplate: this.itemTemplate,
      itemTemplateInjector: this.itemTemplateInjector,
      itemContext: (item, index) => this.itemContext(item, index, ""),
      onItemSelect: this.selectPageCardItem
    };
  }
  selectPageCardItem = (item, event, context) => {
    this.selectSmartListItem(item, event, context);
  };
  navigatePageHeader = (direction, event) => {
    event?.stopPropagation();
    this.stepper.navigateBy(direction);
  };
  resetAndReload() {
    this.listPageLoadAbortController?.abort();
    this.listPageLoadAbortController = null;
    this.resetHostedFullscreenTransition();
    this.clearHorizontalCursorScrollLock();
    this.clearLoadingAnimation();
    this.stepper.reset();
    this.suspendSnapReactivation = false;
    this.deferSnapReactivationUntilScroll = false;
    this.lastResolvedBaseSnapMode = null;
    this.loading = false;
    this.loadSequence += 1;
    this.suppressVisibleLoadingProgress = false;
    this.finiteStepper.reset({ notify: false });
    this.items = [];
    this.groups = [];
    this.pages = [];
    this.total = 0;
    this.pageIndex = 0;
    this.nextPageCursor = null;
    this.hasMore = this.currentViewMode === "list";
    this.initialLoading = true;
    this.clearAwaitScrollReset();
    this.stickyLabel = this.resolveEmptyStickyLabel();
    this.progress = 0;
    this.scrollable = false;
    this.weekCounterViewportPageKey = null;
    this.pollScheduler.restart();
    if (this.currentViewMode === "list") {
      this.stepper.clearWindow();
      this.emitState();
      this.resetScrollSoon();
      void this.loadInitialListPages();
      return;
    }
    this.stepper.ensureWindow();
    this.stepper.applySnapshot();
    this.seedPageProgress();
    this.emitState();
    this.resetScrollSoon();
    void this.loadPageWindow();
  }
  visiblePollQuery() {
    const pageSize = this.config.pollDelta ? Math.max(1, this.resolveEffectivePageSize()) : Math.max(1, this.items.length || this.resolveEffectivePageSize());
    return __spreadProps(__spreadValues({}, this.currentQuery(0)), {
      page: 0,
      pageSize,
      cursor: void 0
    });
  }
  async pollVisibleItems(query, signal) {
    const loader = this.resolveLoadPage();
    const pollDelta = this.config.pollDelta;
    if (signal?.aborted || !loader && !pollDelta || this.currentViewMode !== "list" || this.initialLoading || this.loading) {
      return;
    }
    const sequence = this.loadSequence;
    if (pollDelta) {
      const currentQuery = this.currentQuery();
      const identity = this.cacheableConfig()?.identity;
      if (!identity) {
        return;
      }
      const knownItems = this.items.map((item, index) => ({
        id: `${identity(item, index, currentQuery)}`.trim(),
        revision: pollDelta.revision(item, index, currentQuery)
      })).filter((item) => item.id.length > 0);
      const tailIndex = this.items.length - 1;
      const tailItem = tailIndex >= 0 ? this.items[tailIndex] : void 0;
      const result2 = await firstValueFrom(pollDelta.load(query, {
        knownItems,
        loadedTail: tailItem === void 0 ? null : {
          id: `${identity(tailItem, tailIndex, currentQuery)}`.trim(),
          position: pollDelta.position(tailItem, tailIndex, currentQuery)
        }
      }, { signal }));
      if (signal?.aborted || sequence !== this.loadSequence || this.currentViewMode !== "list") {
        return;
      }
      this.syncVisiblePollDelta(result2);
      return;
    }
    if (!loader) {
      return;
    }
    const result = await firstValueFrom(loader(query, { signal }));
    if (signal?.aborted || sequence !== this.loadSequence || this.currentViewMode !== "list") {
      return;
    }
    const items = Array.isArray(result?.items) ? result.items : [];
    const hasExplicitNextCursor = Boolean(result && Object.prototype.hasOwnProperty.call(result, "nextCursor"));
    const requestedPageSize = Math.max(1, Math.trunc(Number(query.pageSize) || this.resolveEffectivePageSize()));
    const loadedShortPage = items.length > 0 && items.length < requestedPageSize;
    const total = Number.isFinite(result?.total) ? Math.max(0, Math.trunc(Number(result?.total))) : void 0;
    const hasMore = hasExplicitNextCursor ? typeof result?.nextCursor === "string" && result.nextCursor.trim().length > 0 : items.length > 0 && items.length < (total ?? items.length) && !loadedShortPage;
    const syncOptions = __spreadValues({
      total,
      hasMore
    }, hasExplicitNextCursor ? {
      nextCursor: typeof result?.nextCursor === "string" && result.nextCursor.trim() ? result.nextCursor.trim() : null
    } : {});
    this.syncVisibleItems(items, syncOptions);
  }
  syncVisiblePollDelta(delta) {
    const cacheable = this.cacheableConfig();
    if (!cacheable?.identity) {
      return false;
    }
    const query = this.currentQuery();
    const removedIds = new Set((delta.removedIds ?? []).map((id) => `${id}`.trim()).filter(Boolean));
    let nextItems = removedIds.size === 0 ? this.items : this.items.filter((item, index) => !removedIds.has(`${cacheable.identity?.(item, index, query) ?? ""}`.trim()));
    let itemsChanged = nextItems !== this.items;
    for (const polledItem of delta.upserts ?? []) {
      const polledIdentity = `${cacheable.identity(polledItem, 0, query) ?? ""}`.trim();
      if (!polledIdentity) {
        continue;
      }
      const currentIndex = nextItems.findIndex((item, index) => `${cacheable.identity?.(item, index, query) ?? ""}`.trim() === polledIdentity);
      if (currentIndex >= 0) {
        if (!itemsChanged) {
          nextItems = [...nextItems];
          itemsChanged = true;
        }
        nextItems.splice(currentIndex, 1);
        nextItems.splice(this.visibleInsertionIndex(polledItem, nextItems), 0, polledItem);
        continue;
      }
      if (!itemsChanged) {
        nextItems = [...nextItems];
        itemsChanged = true;
      }
      nextItems.splice(this.visibleInsertionIndex(polledItem, nextItems), 0, polledItem);
    }
    const nextTotal = Number.isFinite(delta.total) ? Math.max(nextItems.length, Math.trunc(Number(delta.total))) : Math.max(nextItems.length, this.total);
    const nextHasMore = nextItems.length < nextTotal;
    const stateChanged = itemsChanged || nextTotal !== this.total || nextHasMore !== this.hasMore;
    if (!stateChanged) {
      return false;
    }
    this.items = nextItems;
    this.total = nextTotal;
    this.hasMore = nextHasMore;
    this.cacheDirectSourceItems();
    this.syncGroups();
    this.finiteStepper.syncBounds();
    this.emitState();
    this.emitRefresh();
    this.cdr.markForCheck();
    this.refreshSurfaceSoon();
    return true;
  }
  async loadInitialListPages() {
    const initialPageCount = this.initialPageCount();
    for (let page = 0; page < initialPageCount; page += 1) {
      await this.loadNextPage({
        isInitial: page === 0,
        applyInitialAnchor: true
      });
      if (!this.hasMore) {
        this.scheduleFinalInitialListAnchor();
        return;
      }
    }
    this.scheduleFinalInitialListAnchor();
  }
  async loadNextPage(options = {}) {
    const isInitial = options.isInitial === true;
    const applyInitialAnchor = options.applyInitialAnchor === true;
    const loader = this.resolveLoadPage();
    if (!loader || this.currentViewMode !== "list") {
      this.loading = false;
      this.initialLoading = false;
      this.hasMore = false;
      this.emitState();
      this.cdr.markForCheck();
      return;
    }
    const query = this.loadQuery(this.pageIndex, isInitial);
    this.listPageLoadAbortController?.abort();
    const abortController = typeof AbortController === "undefined" ? null : new AbortController();
    this.listPageLoadAbortController = abortController;
    const sequence = ++this.loadSequence;
    const shouldSuppressVisibleLoadingProgress = !isInitial && this.currentViewMode === "list" && this.resolvedPresentation() === "fullscreen" && this.items.length > 0 && !this.resolveConfigValue(this.config.showBackgroundLoadingProgress, false);
    this.suppressVisibleLoadingProgress = shouldSuppressVisibleLoadingProgress;
    this.loading = true;
    if (!shouldSuppressVisibleLoadingProgress) {
      this.startLoadingAnimation();
    }
    this.emitState();
    const shouldUseManualPrependRestore = !isInitial && this.listMergeStrategy() === "prepend" && this.prependRestoreMode() === "manual";
    const shouldUseReverseAppendAnchorRestore = !isInitial && this.listMergeStrategy() === "append" && this.isReversedListFlow() && this.listLoadTriggerEdge() === "end";
    const shouldUseNativePrependReveal = !isInitial && this.listMergeStrategy() === "prepend" && this.prependRestoreMode() === "native";
    const restoreContext = shouldUseManualPrependRestore ? this.captureListRestoreContext(isInitial) : null;
    let reverseAppendAnchorContext = shouldUseReverseAppendAnchorRestore ? this.captureReverseAppendAnchorContext(isInitial) : null;
    let handledManualPrepend = false;
    let shouldAnimateEmptyAppendCompletion = false;
    try {
      const [result] = await Promise.all([
        firstValueFrom(loader(query, { signal: abortController?.signal })),
        this.wait(this.resolvedLoadingDelayMs(), abortController?.signal)
      ]);
      if (sequence !== this.loadSequence) {
        return;
      }
      const nextItems = Array.isArray(result?.items) ? result.items : [];
      shouldAnimateEmptyAppendCompletion = !isInitial && nextItems.length === 0;
      if (shouldUseReverseAppendAnchorRestore) {
        reverseAppendAnchorContext = this.captureReverseAppendAnchorContext(isInitial) ?? reverseAppendAnchorContext;
      }
      this.applyListPageResult(result, isInitial, query.pageSize);
      if (sequence !== this.loadSequence) {
        return;
      }
      if (restoreContext && shouldUseManualPrependRestore) {
        handledManualPrepend = true;
      }
    } catch {
      if (sequence !== this.loadSequence) {
        return;
      }
      this.initialLoading = false;
      this.hasMore = false;
    } finally {
      if (this.listPageLoadAbortController === abortController) {
        this.listPageLoadAbortController = null;
      }
      if (sequence !== this.loadSequence) {
        return;
      }
      this.loading = false;
      this.suppressVisibleLoadingProgress = false;
      this.awaitScrollReset = true;
      this.awaitScrollResetBaselineTop = null;
      this.awaitScrollResetBaselineReverseDistance = null;
      this.endLoadingAnimation({
        forceAnimatedCompletion: shouldAnimateEmptyAppendCompletion
      });
      this.syncGroups();
      if (handledManualPrepend && restoreContext) {
        this.cdr.detectChanges();
        this.scheduleManualPrependRestore(restoreContext);
      } else if (reverseAppendAnchorContext) {
        this.cdr.detectChanges();
        this.scheduleReverseAppendAnchorRestore(reverseAppendAnchorContext, applyInitialAnchor);
      } else if (shouldUseNativePrependReveal) {
        this.cdr.detectChanges();
        this.scheduleNativePrependReveal();
      } else {
        this.schedulePostListLoadAdjustments(null, applyInitialAnchor);
      }
      if (applyInitialAnchor && (isInitial || (this.scrollHostRef?.nativeElement?.scrollTop ?? 0) <= 1)) {
        this.scheduleInitialListSnap();
      }
      this.emitState();
      this.cdr.markForCheck();
    }
  }
  scheduleManualPrependRestore(restoreContext) {
    const run = () => {
      this.applyPrependRestore(restoreContext);
      this.emitState();
      this.cdr.markForCheck();
    };
    if (!this.afterViewInit) {
      run();
      return;
    }
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  async loadPageWindow() {
    const loader = this.resolveLoadPage();
    if (!loader || !this.isPageMode()) {
      this.loading = false;
      this.initialLoading = false;
      this.hasMore = false;
      this.emitState();
      this.cdr.markForCheck();
      return;
    }
    const anchor = this.currentPageAnchor();
    if (!anchor) {
      this.loading = false;
      this.initialLoading = false;
      this.hasMore = false;
      this.emitState();
      this.cdr.markForCheck();
      return;
    }
    this.stepper.setLastSettledPageKey(this.stepper.pageKey(anchor));
    await this.loadAnchorPage(anchor, this.stepper.queryForAnchor(anchor), true);
  }
  applyListPageResult(result, isInitial, requestedPageSizeValue) {
    if (!isInitial && this.listMergeStrategy() !== "prepend" && this.suppressListSnapNearEnd) {
      this.suspendSnapReactivation = true;
    }
    const nextItems = Array.isArray(result?.items) ? result.items : [];
    const hasExplicitNextCursor = Boolean(result && Object.prototype.hasOwnProperty.call(result, "nextCursor"));
    const requestedPageSize = Math.max(1, Math.trunc(Number(requestedPageSizeValue) || this.resolveEffectivePageSize()));
    const loadedShortPage = nextItems.length > 0 && nextItems.length < requestedPageSize;
    if (isInitial) {
      this.items = this.orderSortableItems(nextItems);
    } else if (this.listMergeStrategy() === "prepend") {
      this.items = this.orderSortableItems([...nextItems, ...this.items]);
    } else {
      this.items = this.orderSortableItems([...this.items, ...nextItems]);
    }
    const total = Number.isFinite(result?.total) ? Math.max(0, Math.trunc(Number(result?.total))) : this.items.length;
    this.total = Math.max(this.items.length, total);
    this.nextPageCursor = hasExplicitNextCursor ? typeof result?.nextCursor === "string" && result.nextCursor.trim().length > 0 ? result.nextCursor : null : null;
    this.hasMore = hasExplicitNextCursor ? this.nextPageCursor !== null : nextItems.length > 0 && this.items.length < this.total && !loadedShortPage;
    if (nextItems.length > 0) {
      this.pageIndex += 1;
    } else {
      this.hasMore = false;
    }
    this.initialLoading = false;
    this.finiteStepper.syncBounds();
  }
  applyAnchorPageResult(anchor, result, options = {}) {
    const nextItems = Array.isArray(result?.items) ? result.items : [];
    const total = Number.isFinite(result?.total) ? Math.max(0, Math.trunc(Number(result?.total))) : nextItems.length;
    this.stepper.setPageResult(anchor, nextItems, total, options);
    this.initialLoading = false;
    if (options.deferRender === true) {
      return;
    }
    this.items = this.orderSortableItems(nextItems);
    this.total = Math.max(nextItems.length, total);
    this.pageIndex = 0;
    this.hasMore = false;
    this.groups = [];
    this.finiteStepper.syncBounds();
    this.stepper.applySnapshot();
  }
  maybeLoadMore(scrollElement) {
    if (this.currentViewMode !== "list" || this.loading || !this.hasMore) {
      return;
    }
    const triggerEdge = this.listLoadTriggerEdge();
    const threshold = Math.max(0, this.config.preloadOffsetPx ?? (triggerEdge === "start" ? 48 : 520));
    if (this.isHorizontalList()) {
      this.maybeLoadMoreHorizontal(scrollElement, threshold, triggerEdge);
      return;
    }
    const maxVerticalScroll = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
    const distanceToVisualTop = this.reverseDistanceToVisualTop(scrollElement, maxVerticalScroll);
    if (this.awaitScrollReset) {
      if (this.isReversedListFlow() && triggerEdge === "end") {
        const resetThreshold = Math.max(120, threshold * 2);
        const baselineTop = this.awaitScrollResetBaselineTop;
        const baselineDistance = this.awaitScrollResetBaselineReverseDistance;
        const topDelta = baselineTop === null ? 0 : Math.abs(scrollElement.scrollTop - baselineTop);
        const distanceDelta = baselineDistance === null ? 0 : Math.abs(distanceToVisualTop - baselineDistance);
        if (distanceToVisualTop > resetThreshold || maxVerticalScroll <= resetThreshold || topDelta > 12 || distanceDelta > 12) {
          this.clearAwaitScrollReset();
        }
      } else {
        const remainingPx2 = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
        if (triggerEdge === "start") {
          if (scrollElement.scrollTop > Math.max(120, threshold * 2)) {
            this.clearAwaitScrollReset();
          }
        } else {
          const resetThreshold = Math.max(360, threshold);
          if (remainingPx2 > resetThreshold || maxVerticalScroll <= resetThreshold) {
            this.clearAwaitScrollReset();
          }
        }
      }
      if (this.awaitScrollReset) {
        return;
      }
    }
    if (this.isReversedListFlow() && triggerEdge === "end") {
      if (!this.shouldStartReverseAppendPreload(scrollElement, threshold)) {
        return;
      }
      void this.loadNextPage();
      return;
    }
    const remainingPx = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    if (triggerEdge === "start") {
      if (scrollElement.scrollTop > threshold) {
        return;
      }
      void this.loadNextPage();
      return;
    }
    if (!this.shouldStartAppendPreload(scrollElement, remainingPx, threshold)) {
      return;
    }
    void this.loadNextPage();
  }
  maybeLoadMoreHorizontal(scrollElement, threshold, triggerEdge) {
    const maxHorizontalScroll = Math.max(0, scrollElement.scrollWidth - scrollElement.clientWidth);
    if (maxHorizontalScroll <= 1) {
      return;
    }
    if (this.awaitScrollReset) {
      this.clearAwaitScrollReset();
    }
    const scrollLeft = Math.max(0, scrollElement.scrollLeft);
    if (triggerEdge === "start") {
      if (scrollLeft > threshold) {
        return;
      }
      void this.loadNextPage();
      return;
    }
    const remainingPx = maxHorizontalScroll - scrollLeft;
    if (remainingPx > threshold) {
      return;
    }
    void this.loadNextPage();
  }
  shouldStartReverseAppendPreload(scrollElement, threshold) {
    const maxVerticalScroll = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
    if (maxVerticalScroll <= 1) {
      return false;
    }
    const distanceToVisualTop = this.reverseDistanceToVisualTop(scrollElement, maxVerticalScroll);
    return distanceToVisualTop <= Math.max(48, threshold);
  }
  reverseDistanceToVisualTop(scrollElement, maxVerticalScroll = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight)) {
    return Math.max(0, maxVerticalScroll - Math.abs(scrollElement.scrollTop));
  }
  captureAwaitScrollResetBaseline(scrollElement) {
    if (!this.awaitScrollReset || !this.isReversedListFlow() || this.listLoadTriggerEdge() !== "end") {
      return;
    }
    this.awaitScrollResetBaselineTop = scrollElement.scrollTop;
    this.awaitScrollResetBaselineReverseDistance = this.reverseDistanceToVisualTop(scrollElement);
  }
  clearAwaitScrollReset() {
    this.awaitScrollReset = false;
    this.awaitScrollResetBaselineTop = null;
    this.awaitScrollResetBaselineReverseDistance = null;
  }
  shouldStartAppendPreload(scrollElement, remainingPx, threshold) {
    if (remainingPx <= Math.max(240, threshold)) {
      return true;
    }
    const itemElements = this.ownedListElements(scrollElement, "[data-smart-list-index]");
    if (itemElements.length === 0) {
      return false;
    }
    if (itemElements.length <= 3) {
      return true;
    }
    const preloadAnchor = itemElements[Math.max(0, itemElements.length - 3)];
    const viewportBottom = scrollElement.scrollTop + scrollElement.clientHeight;
    return viewportBottom >= preloadAnchor.offsetTop;
  }
  initialPageCount() {
    return Math.max(1, Math.trunc(this.config.initialPageCount ?? 1));
  }
  listLoadTriggerEdge() {
    return this.config.loadTriggerEdge ?? "end";
  }
  listMergeStrategy() {
    return this.config.mergeStrategy ?? (this.listLoadTriggerEdge() === "start" ? "prepend" : "append");
  }
  initialListScrollAnchor() {
    return this.config.initialScrollAnchor ?? (this.listLoadTriggerEdge() === "start" ? "end" : "start");
  }
  prependRestoreMode() {
    return this.config.prependRestoreMode ?? "manual";
  }
  prependRevealPx() {
    return Math.max(0, Number(this.config.prependRevealPx) || 0);
  }
  ownedListElements(scrollElement, selector) {
    return Array.from(scrollElement.querySelectorAll(selector)).filter((element) => element.closest(".smart-list") === scrollElement);
  }
  ownedListElement(scrollElement, selector) {
    return this.ownedListElements(scrollElement, selector)[0] ?? null;
  }
  listTopInset(scrollElement, options = {}) {
    const threadRect = scrollElement.getBoundingClientRect();
    const styles = getComputedStyle(scrollElement);
    const scrollPaddingTop = Number.parseFloat(styles.scrollPaddingTop || "0") || 0;
    const stickyHeaderHeight = this.shouldShowStickyHeader() ? this.ownedListElement(scrollElement, ".smart-list__sticky")?.offsetHeight ?? 0 : 0;
    const includeStickyGroupMarker = options.includeStickyGroupMarker !== false;
    const baseInset = Math.max(stickyHeaderHeight, scrollPaddingTop);
    if (!includeStickyGroupMarker) {
      return baseInset;
    }
    const stickyGroupMarker = this.ownedListElements(scrollElement, ".smart-list__group-marker").find((marker) => {
      const rect = marker.getBoundingClientRect();
      return rect.top <= threadRect.top + 1 && rect.bottom > threadRect.top + 1;
    }) ?? null;
    if (!stickyGroupMarker) {
      return baseInset;
    }
    const markerStyles = getComputedStyle(stickyGroupMarker);
    const markerMarginBottom = Number.parseFloat(markerStyles.marginBottom || "0") || 0;
    return baseInset + stickyGroupMarker.getBoundingClientRect().height + markerMarginBottom;
  }
  captureListRestoreContext(isInitial) {
    if (isInitial || this.listMergeStrategy() !== "prepend") {
      return null;
    }
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (!scrollElement) {
      return null;
    }
    const threadRect = scrollElement.getBoundingClientRect();
    const visibleTop = threadRect.top + this.listTopInset(scrollElement, {
      includeStickyGroupMarker: false
    });
    const anchors = this.ownedListElements(scrollElement, ".smart-list__item-shell[data-smart-list-anchor]");
    const anchorElement = anchors.find((element) => element.getBoundingClientRect().bottom > threadRect.top + 1) ?? anchors.find((element) => element.getBoundingClientRect().top >= visibleTop - 1) ?? anchors.find((element) => element.getBoundingClientRect().bottom > visibleTop + 1) ?? null;
    let restoreAnchorId = null;
    let restoreAnchorCreatedId = false;
    if (anchorElement) {
      const anchorKey = anchorElement.dataset["smartListAnchor"] ?? null;
      const topInset = this.listTopInset(scrollElement);
      this.clearPrependRestoreSpacerState();
      if (anchorKey && topInset > 0) {
        this.prependRestoreSpacerAnchorKey = anchorKey;
        this.prependRestoreSpacerId = `smart-list-restore-spacer-${++this.restoreAnchorSequence}`;
        this.prependRestoreSpacerHeight = topInset;
        this.cdr.detectChanges();
        scrollElement.scrollTop += topInset;
        restoreAnchorId = this.prependRestoreSpacerId;
      } else {
        restoreAnchorId = anchorElement.id;
        if (!restoreAnchorId) {
          restoreAnchorId = `smart-list-restore-anchor-${++this.restoreAnchorSequence}`;
          anchorElement.id = restoreAnchorId;
          restoreAnchorCreatedId = true;
        }
      }
    }
    return {
      scrollHeight: scrollElement.scrollHeight,
      scrollTop: scrollElement.scrollTop,
      restoreAnchorId,
      restoreAnchorCreatedId
    };
  }
  captureReverseAppendAnchorContext(isInitial) {
    if (isInitial || !this.isReversedListFlow() || this.listMergeStrategy() !== "append") {
      return null;
    }
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (!scrollElement) {
      return null;
    }
    const threadRect = scrollElement.getBoundingClientRect();
    const visibleTop = threadRect.top + this.listTopInset(scrollElement, {
      includeStickyGroupMarker: false
    });
    const anchorElement = this.topVisibleItemShell(scrollElement, visibleTop);
    const anchorKey = anchorElement?.dataset["smartListAnchor"]?.trim() ?? "";
    if (!anchorElement || !anchorKey) {
      return null;
    }
    return {
      anchorKey,
      offsetTop: anchorElement.getBoundingClientRect().top - visibleTop
    };
  }
  topVisibleItemShell(scrollElement, visibleTop = scrollElement.getBoundingClientRect().top + this.listTopInset(scrollElement)) {
    const itemShells = this.ownedListElements(scrollElement, ".smart-list__item-shell[data-smart-list-anchor]").sort((first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top);
    return itemShells.find((element) => element.getBoundingClientRect().bottom > visibleTop + 1) ?? itemShells.find((element) => element.getBoundingClientRect().top >= visibleTop - 1) ?? itemShells.find((element) => element.getBoundingClientRect().bottom > scrollElement.getBoundingClientRect().top + 1) ?? null;
  }
  schedulePostListLoadAdjustments(restoreContext, applyInitialAnchor) {
    const run = () => {
      const scrollElement = this.scrollHostRef?.nativeElement;
      if (!scrollElement || this.currentViewMode !== "list") {
        return;
      }
      if (restoreContext) {
        this.applyPrependRestore(restoreContext);
      } else if (applyInitialAnchor && this.initialListScrollAnchor() === "end") {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      } else if (applyInitialAnchor && this.initialListScrollAnchor() === "start" && this.isReversedListFlow()) {
        scrollElement.scrollTop = 0;
      } else if (applyInitialAnchor && this.initialListScrollAnchor() === "first-item" && this.groups.length > 0) {
        const firstBoundary = this.ownedListElement(scrollElement, ".smart-list__group-marker, .smart-list__item-shell");
        if (firstBoundary) {
          scrollElement.scrollTop = firstBoundary.offsetTop;
        }
      }
      this.finalizePostListLoad(scrollElement);
    };
    if (!this.afterViewInit) {
      run();
      return;
    }
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  scheduleReverseAppendAnchorRestore(restoreContext, applyInitialAnchor) {
    const run = () => {
      const scrollElement = this.scrollHostRef?.nativeElement;
      if (!scrollElement || this.currentViewMode !== "list") {
        return;
      }
      this.applyReverseAppendAnchorRestore(restoreContext);
      if (applyInitialAnchor && this.initialListScrollAnchor() === "start") {
        scrollElement.scrollTop = Math.min(0, scrollElement.scrollTop);
      }
      this.finalizePostListLoad(scrollElement);
    };
    if (!this.afterViewInit) {
      run();
      return;
    }
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  applyReverseAppendAnchorRestore(restoreContext) {
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (!scrollElement || this.currentViewMode !== "list") {
      return;
    }
    const threadRect = scrollElement.getBoundingClientRect();
    const visibleTop = threadRect.top + this.listTopInset(scrollElement, {
      includeStickyGroupMarker: false
    });
    const anchorElement = this.ownedListElements(scrollElement, ".smart-list__item-shell[data-smart-list-anchor]").find((element) => (element.dataset["smartListAnchor"] ?? "") === restoreContext.anchorKey) ?? null;
    if (!anchorElement) {
      return;
    }
    const currentOffsetTop = anchorElement.getBoundingClientRect().top - visibleTop;
    const offsetDelta = currentOffsetTop - restoreContext.offsetTop;
    if (Math.abs(offsetDelta) <= 0.5) {
      return;
    }
    scrollElement.scrollTop += offsetDelta;
  }
  finalizePostListLoad(scrollElement) {
    if (this.shouldShowStickyHeader()) {
      this.updateStickyLabel(scrollElement.scrollTop);
    } else {
      this.stickyHeaderHeightPx = 0;
      this.stickyLabel = this.resolveEmptyStickyLabel();
    }
    this.captureAwaitScrollResetBaseline(scrollElement);
    this.updateListSnapNearEndSuppression(scrollElement);
    this.updateAutoFooterSpacerHeight(scrollElement);
    this.updateScrollProgress(scrollElement);
    this.emitState();
    this.cdr.markForCheck();
    this.maybeAutoloadToFillViewport(scrollElement);
  }
  applyPrependRestore(restoreContext) {
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (!scrollElement || this.currentViewMode !== "list") {
      return;
    }
    const heightDelta = scrollElement.scrollHeight - restoreContext.scrollHeight;
    let nextScrollTop = Math.max(0, restoreContext.scrollTop + Math.max(0, heightDelta));
    if (restoreContext.restoreAnchorId) {
      const restoredAnchor = document.getElementById(restoreContext.restoreAnchorId);
      if (restoredAnchor instanceof HTMLElement && scrollElement.contains(restoredAnchor)) {
        if (restoredAnchor.classList.contains("smart-list__prepend-restore-spacer")) {
          const revealPx = restoredAnchor.offsetHeight;
          if (revealPx > 0) {
            this.animatePrependRestoreSpacer(restoredAnchor, scrollElement, revealPx);
          } else {
            this.clearPrependRestoreSpacerState(restoredAnchor.id);
          }
        }
        if (restoreContext.restoreAnchorCreatedId && restoredAnchor.id === restoreContext.restoreAnchorId) {
          restoredAnchor.removeAttribute("id");
        }
      }
    }
    scrollElement.scrollTop = nextScrollTop;
    if (this.shouldShowStickyHeader()) {
      this.updateStickyLabel(scrollElement.scrollTop);
    } else {
      this.stickyLabel = this.resolveEmptyStickyLabel();
    }
    this.updateScrollProgress(scrollElement);
  }
  clearPrependRestoreSpacerState(expectedSpacerId = null) {
    if (expectedSpacerId && this.prependRestoreSpacerId !== expectedSpacerId) {
      return;
    }
    this.prependRestoreSpacerAnchorKey = null;
    this.prependRestoreSpacerId = null;
    this.prependRestoreSpacerHeight = 0;
  }
  animatePrependRestoreSpacer(spacer, scrollElement, revealPx) {
    const remove = () => {
      this.clearPrependRestoreSpacerState(spacer.id);
      this.cdr.markForCheck();
    };
    const collapse = (startedAt, startScrollTop) => {
      if (!spacer.isConnected) {
        return;
      }
      const durationMs = 180;
      const elapsedMs = Math.max(0, performance.now() - startedAt);
      const progress = Math.min(1, elapsedMs / durationMs);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      spacer.style.height = `${Math.max(0, revealPx * (1 - easedProgress))}px`;
      scrollElement.scrollTop = Math.max(0, startScrollTop - revealPx * easedProgress);
      if (progress >= 1) {
        remove();
        return;
      }
      globalThis.requestAnimationFrame(() => collapse(startedAt, startScrollTop));
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      const startScrollTop = scrollElement.scrollTop;
      const startedAt = performance.now();
      globalThis.requestAnimationFrame(() => collapse(startedAt, startScrollTop));
      return;
    }
    spacer.style.height = "0px";
    scrollElement.scrollTop = Math.max(0, scrollElement.scrollTop - revealPx);
    remove();
  }
  itemAnchorKey(item, index) {
    if (!this.config.trackBy) {
      return null;
    }
    return String(this.resolvedListTrackKeyForItem(index, item));
  }
  rebuildResolvedListTrackKeys() {
    if (!this.config.trackBy) {
      this.resolvedListTrackKeys = [];
      return;
    }
    const rawKeys = this.items.map((item, index) => this.normalizedConfiguredTrackKey(index, item));
    const rawKeyCounts = /* @__PURE__ */ new Map();
    for (const rawKey of rawKeys) {
      if (!rawKey) {
        continue;
      }
      rawKeyCounts.set(rawKey, (rawKeyCounts.get(rawKey) ?? 0) + 1);
    }
    this.resolvedListTrackKeys = rawKeys.map((rawKey, index) => {
      const item = this.items[index];
      if (!rawKey) {
        const resolvedFallback = this.fallbackResolvedTrackKey(index, item);
        this.rememberResolvedListTrackKey(item, index, resolvedFallback);
        return resolvedFallback;
      }
      const resolvedKey = (rawKeyCounts.get(rawKey) ?? 0) > 1 ? `${rawKey}::${this.trackItemInstanceToken(item, index)}` : rawKey;
      this.rememberResolvedListTrackKey(item, index, resolvedKey);
      return resolvedKey;
    });
  }
  rememberResolvedListTrackKey(item, index, resolvedKey) {
    if (!item || typeof item !== "object" && typeof item !== "function") {
      return;
    }
    const reference = item;
    this.listItemIndexByObject.set(reference, index);
    this.resolvedListTrackKeyByObject.set(reference, resolvedKey);
  }
  resolvedListTrackKeyForItem(index, item) {
    if (item && (typeof item === "object" || typeof item === "function")) {
      const reference = item;
      const resolvedKey = this.resolvedListTrackKeyByObject.get(reference);
      if (resolvedKey !== void 0) {
        return resolvedKey;
      }
      const absoluteIndex = this.listItemIndexByObject.get(reference);
      if (absoluteIndex !== void 0) {
        return this.resolvedListTrackKeys[absoluteIndex] ?? this.fallbackResolvedTrackKey(absoluteIndex, item);
      }
    }
    return this.resolvedListTrackKeys[index] ?? this.fallbackResolvedTrackKey(index, item);
  }
  normalizedConfiguredTrackKey(index, item) {
    const key = this.config.trackBy?.(index, item);
    if (key === null || key === void 0) {
      return null;
    }
    const normalized = String(key).trim();
    return normalized.length > 0 ? normalized : null;
  }
  orderSortableItems(items) {
    const sortable = this.sortableConfig();
    if (!sortable) {
      return [...items];
    }
    const query = this.currentQuery();
    return items.map((item, index) => ({
      item,
      index,
      sortKey: this.localSortKeyForItem(item, query, index)
    })).sort((left, right) => compareSmartListLocalSortKeys(left.sortKey, right.sortKey) || left.index - right.index).map((entry) => entry.item);
  }
  localSortKeyForItem(item, query, index) {
    return this.sortableConfig()?.sortKey?.(item, index, query) ?? smartListLocalSortKeyFromItem(item);
  }
  cacheableConfig() {
    const cacheable = this.config.cacheable;
    if (cacheable === true) {
      return {};
    }
    return cacheable && typeof cacheable === "object" ? cacheable : null;
  }
  sortableConfig() {
    const sortable = this.config.sortable;
    if (sortable === true) {
      return {};
    }
    return sortable && typeof sortable === "object" ? sortable : null;
  }
  resolvedConverter(query) {
    const converter = this.config.converter;
    if (!converter) {
      return null;
    }
    const resolved = typeof converter === "function" ? converter(query) : converter;
    return resolved;
  }
  converterOptions(query) {
    return this.converterContext === null || this.converterContext === void 0 ? query : __spreadProps(__spreadValues({}, query), {
      context: this.converterContext
    });
  }
  cacheTrackKey(item, index, trackBy) {
    if (item === void 0 || trackBy) {
      return this.visibleSyncTrackKey(item, index, trackBy);
    }
    const identity = this.cacheableConfig()?.identity;
    if (!identity) {
      return this.visibleSyncTrackKey(item, index);
    }
    const key = identity(item, index, this.currentQuery());
    if (key === null || key === void 0) {
      return this.visibleSyncTrackKey(item, index);
    }
    const normalized = `${key}`.trim();
    if (normalized.length > 0) {
      return normalized;
    }
    const itemKey = smartListItemKeyFromItem(item);
    return itemKey ?? this.visibleSyncTrackKey(item, index);
  }
  visibleSyncTrackKey(item, index, trackBy) {
    if (item === void 0) {
      return `smart-list-sync:missing:${index}`;
    }
    const key = trackBy?.(index, item) ?? this.config.trackBy?.(index, item);
    if (key === null || key === void 0) {
      return smartListItemKeyFromItem(item) ?? index;
    }
    const normalized = String(key).trim();
    return normalized.length > 0 ? normalized : smartListItemKeyFromItem(item) ?? index;
  }
  fallbackResolvedTrackKey(index, item) {
    return `smart-list-track:${this.trackItemInstanceToken(item, index)}`;
  }
  pageTrackKey(index, item) {
    const itemKey = smartListItemKeyFromItem(item);
    return this.normalizedConfiguredTrackKey(index, item) ?? (itemKey === null ? null : `${itemKey}`) ?? this.fallbackResolvedTrackKey(index, item);
  }
  trackItemInstanceToken(item, index) {
    if (item && (typeof item === "object" || typeof item === "function")) {
      const reference = item;
      let token = this.fallbackTrackKeyByObject.get(reference);
      if (!token) {
        token = `obj-${++this.fallbackTrackKeySequence}`;
        this.fallbackTrackKeyByObject.set(reference, token);
      }
      return `${token}:${index}`;
    }
    return `idx-${index}:${String(item)}`;
  }
  scheduleNativePrependReveal() {
    const revealPx = this.prependRevealPx();
    const run = () => {
      const scrollElement = this.scrollHostRef?.nativeElement;
      if (!scrollElement || this.currentViewMode !== "list") {
        return;
      }
      if (revealPx > 0) {
        scrollElement.scrollTop = Math.max(0, scrollElement.scrollTop - revealPx);
      }
      if (this.shouldShowStickyHeader()) {
        this.updateStickyLabel(scrollElement.scrollTop);
      } else {
        this.stickyLabel = this.resolveEmptyStickyLabel();
      }
      this.updateScrollProgress(scrollElement);
      this.emitState();
      this.cdr.markForCheck();
    };
    if (!this.afterViewInit) {
      run();
      return;
    }
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  scheduleFinalInitialListAnchor() {
    if (this.initialListScrollAnchor() !== "end") {
      return;
    }
    const run = () => {
      const scrollElement = this.scrollHostRef?.nativeElement;
      if (!scrollElement || this.currentViewMode !== "list") {
        return;
      }
      scrollElement.scrollTop = scrollElement.scrollHeight;
      if (this.shouldShowStickyHeader()) {
        this.updateStickyLabel(scrollElement.scrollTop);
      } else {
        this.stickyLabel = this.resolveEmptyStickyLabel();
      }
      this.updateScrollProgress(scrollElement);
      this.emitState();
      this.cdr.markForCheck();
    };
    if (!this.afterViewInit) {
      run();
      return;
    }
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run)));
      return;
    }
    setTimeout(run, 0);
  }
  syncGroups() {
    if (this.currentViewMode !== "list") {
      this.resolvedListTrackKeys = [];
      this.groups = [];
      this.stickyLabel = this.resolveEmptyStickyLabel();
      return;
    }
    this.rebuildResolvedListTrackKeys();
    const groupBy = this.config.groupBy;
    if (!groupBy) {
      this.groups = this.items.length > 0 ? [{ label: "", items: [...this.items], startIndex: 0 }] : [];
      if (!this.items.length || !this.shouldShowStickyHeader()) {
        this.stickyLabel = this.resolveEmptyStickyLabel();
      }
      return;
    }
    const query = this.currentQuery();
    const nextGroups = [];
    let itemIndex = 0;
    for (const item of this.items) {
      const label = groupBy(item, query);
      const lastGroup = nextGroups[nextGroups.length - 1];
      if (!lastGroup || lastGroup.label !== label) {
        nextGroups.push({
          label,
          items: [item],
          startIndex: itemIndex
        });
      } else {
        lastGroup.items.push(item);
      }
      itemIndex += 1;
    }
    this.groups = nextGroups;
    if (nextGroups.length === 0 || !this.shouldShowStickyHeader()) {
      this.stickyLabel = this.resolveEmptyStickyLabel();
      return;
    }
    if (!this.stickyLabel || this.stickyLabel === this.resolveEmptyStickyLabel()) {
      this.stickyLabel = nextGroups[0].label;
    }
  }
  applyPageSnapshot(snapshot) {
    if (!this.isPageMode()) {
      this.pages = [];
      this.items = [];
      this.total = 0;
      this.stickyLabel = this.resolveEmptyStickyLabel();
      return;
    }
    this.pages = [...snapshot.pages];
    this.items = [...snapshot.activeItems];
    this.total = snapshot.activeTotal;
    this.pageIndex = 0;
    this.hasMore = false;
    this.groups = [];
    this.stickyLabel = snapshot.stickyLabel || this.resolveEmptyStickyLabel();
    this.finiteStepper.syncBounds();
  }
  seedPageProgress() {
    if (!this.isPageMode()) {
      this.progress = 0;
      this.scrollable = false;
      return;
    }
    if (this.pages.length === 0) {
      this.progress = 0;
      this.scrollable = false;
      return;
    }
    const surface = this.stepper.surfaceState(this.scrollHostRef?.nativeElement ?? null);
    this.scrollable = surface.scrollable;
    this.progress = surface.progress;
  }
  clearPageViewCache() {
    this.stepper.reset();
    this.pages = [];
  }
  updateStickyLabel(scrollTop) {
    if (!this.shouldShowStickyHeader()) {
      this.stickyHeaderHeightPx = 0;
      this.stickyLabel = this.resolveEmptyStickyLabel();
      return;
    }
    if (this.groups.length === 0) {
      this.stickyHeaderHeightPx = 0;
      this.stickyLabel = this.resolveEmptyStickyLabel();
      return;
    }
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (!scrollElement) {
      this.stickyHeaderHeightPx = 0;
      this.stickyLabel = this.groups[0]?.label ?? this.resolveEmptyStickyLabel();
      return;
    }
    const stickyHeader = this.ownedListElement(scrollElement, ".smart-list__sticky");
    const stickyHeaderHeight = stickyHeader?.offsetHeight ?? 0;
    this.stickyHeaderHeightPx = stickyHeaderHeight;
    const targetTop = scrollTop + stickyHeaderHeight;
    const boundaries = this.ownedListElements(scrollElement, ".smart-list__item-shell[data-group-label], .smart-list__group-marker[data-group-label]");
    if (boundaries.length === 0) {
      this.stickyLabel = this.groups[0]?.label ?? this.resolveEmptyStickyLabel();
      return;
    }
    if (scrollTop <= 1) {
      this.stickyLabel = boundaries[0]?.dataset["groupLabel"] ?? this.groups[0].label;
      return;
    }
    let activeBoundary = boundaries[0];
    for (let i = boundaries.length - 1; i >= 0; i--) {
      if (boundaries[i].offsetTop <= targetTop + 1) {
        activeBoundary = boundaries[i];
        break;
      }
    }
    this.stickyLabel = activeBoundary?.dataset["groupLabel"] ?? this.groups[0].label;
  }
  updateScrollProgress(scrollElement) {
    const target = scrollElement ?? this.scrollHostRef?.nativeElement;
    if (!target) {
      this.scrollable = false;
      this.progress = 0;
      return;
    }
    if (this.isHorizontalList()) {
      const maxHorizontalScroll = Math.max(0, target.scrollWidth - target.clientWidth);
      const scrollOffset2 = Math.max(0, target.scrollLeft);
      this.scrollable = maxHorizontalScroll > 1;
      this.progress = maxHorizontalScroll > 1 ? AppUtils.clampNumber(scrollOffset2 / maxHorizontalScroll, 0, 1) : 0;
      return;
    }
    const maxVerticalScroll = Math.max(0, target.scrollHeight - target.clientHeight);
    const scrollOffset = this.isReversedListFlow() ? Math.abs(target.scrollTop) : target.scrollTop;
    this.scrollable = maxVerticalScroll > 1;
    this.progress = maxVerticalScroll > 1 ? AppUtils.clampNumber(scrollOffset / maxVerticalScroll, 0, 1) : 0;
  }
  maybeAutoloadToFillViewport(scrollElement) {
    const target = scrollElement ?? this.scrollHostRef?.nativeElement;
    if (!target || this.currentViewMode !== "list" || this.loading || !this.hasMore) {
      return;
    }
    if (this.shouldRenderHostedFullscreenOverlay()) {
      return;
    }
    const maxScroll = this.isHorizontalList() ? Math.max(0, target.scrollWidth - target.clientWidth) : Math.max(0, target.scrollHeight - target.clientHeight);
    if (maxScroll > 1) {
      return;
    }
    void this.loadNextPage();
  }
  applyPageSurfaceState(stateOrScrollElement, scrollElement) {
    const hasSurfaceState = Boolean(stateOrScrollElement && "progress" in stateOrScrollElement && "pageIndex" in stateOrScrollElement);
    const target = hasSurfaceState ? scrollElement ?? this.scrollHostRef?.nativeElement ?? null : stateOrScrollElement ?? this.scrollHostRef?.nativeElement ?? null;
    const surface = hasSurfaceState ? stateOrScrollElement : this.stepper.surfaceState(target);
    if (!target || this.pages.length === 0) {
      this.stickyHeaderHeightPx = 0;
      this.scrollable = false;
      this.progress = 0;
      this.stickyLabel = surface.label || this.pages[0]?.label || this.resolveEmptyStickyLabel();
      return;
    }
    this.stickyHeaderHeightPx = this.shouldShowStickyHeader() ? this.ownedListElement(target, ".smart-list__sticky")?.offsetHeight ?? 0 : 0;
    this.scrollable = surface.scrollable;
    this.progress = surface.progress;
    this.stickyLabel = surface.label || this.pages[surface.pageIndex]?.label || this.pages[0]?.label || this.resolveEmptyStickyLabel();
  }
  refreshSurfaceSoon() {
    const refresh = () => {
      if (this.isPageMode()) {
        this.applyPageSurfaceState();
        this.focusVisibleWeekCounterHourSoon();
      } else {
        if (this.shouldShowStickyHeader()) {
          this.updateStickyLabel(this.scrollHostRef?.nativeElement?.scrollTop ?? 0);
        } else {
          this.stickyHeaderHeightPx = 0;
          this.stickyLabel = this.resolveEmptyStickyLabel();
        }
        this.updateListSnapNearEndSuppression();
        this.updateAutoFooterSpacerHeight();
        this.updateScrollProgress();
      }
      this.emitState();
      this.cdr.markForCheck();
    };
    if (!this.afterViewInit) {
      refresh();
      return;
    }
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(refresh));
      return;
    }
    setTimeout(refresh, 0);
  }
  focusVisibleWeekCounterHourSoon() {
    if (!this.isWeekMode() || !this.isCounterPageVariant()) {
      this.weekCounterViewportPageKey = null;
      return;
    }
    const scrollElement = this.scrollHostRef?.nativeElement;
    const pages = this.pages;
    if (!scrollElement || pages.length === 0) {
      return;
    }
    const pageIndex = this.stepper.currentPageIndex(scrollElement, pages.length);
    const visiblePageKey = pages[pageIndex]?.key ?? null;
    if (!visiblePageKey || this.weekCounterViewportPageKey === visiblePageKey) {
      return;
    }
    const run = () => {
      const currentScrollElement = this.scrollHostRef?.nativeElement;
      if (!currentScrollElement || !this.isWeekMode() || !this.isCounterPageVariant()) {
        return;
      }
      const pageElements = Array.from(currentScrollElement.querySelectorAll(".smart-list__page--week"));
      const currentPages = this.pages;
      const currentPageIndex = this.stepper.currentPageIndex(currentScrollElement, currentPages.length);
      const currentVisiblePageKey = currentPages[currentPageIndex]?.key ?? null;
      if (!currentVisiblePageKey || currentVisiblePageKey !== visiblePageKey) {
        return;
      }
      const pageElement = pageElements[currentPageIndex];
      if (!pageElement) {
        return;
      }
      const firstBadge = pageElement.querySelector(".smart-list__week-hour-counter");
      this.weekCounterViewportPageKey = currentVisiblePageKey;
      if (!firstBadge) {
        return;
      }
      const slot = firstBadge.closest(".smart-list__week-counter-slot");
      if (!slot) {
        return;
      }
      const targetTop = Math.max(0, slot.offsetTop - 10);
      if (Math.abs(currentScrollElement.scrollTop - targetTop) <= 1) {
        return;
      }
      currentScrollElement.scrollTop = targetTop;
      this.applyPageSurfaceState(currentScrollElement);
      this.emitState();
      this.cdr.markForCheck();
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  scheduleInitialListSnap() {
    const run = () => {
      const scrollElement = this.scrollHostRef?.nativeElement;
      if (!scrollElement || this.currentViewMode !== "list") {
        return;
      }
      if (!this.shouldBootstrapInitialListSnap(scrollElement)) {
        return;
      }
      if (this.isHorizontalList() || scrollElement.scrollTop > 1) {
        return;
      }
      const firstSnapTarget = this.listCardSnapTargets(scrollElement)[0] ?? null;
      if (!firstSnapTarget) {
        return;
      }
      const maxVerticalScroll = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
      if (maxVerticalScroll <= 1) {
        return;
      }
      const finalTop = this.listSnapTargetPosition(scrollElement, firstSnapTarget);
      const overshootTop = Math.min(maxVerticalScroll, finalTop + 28);
      if (overshootTop <= finalTop + 1) {
        return;
      }
      const previousScrollBehavior = scrollElement.style.scrollBehavior;
      scrollElement.style.scrollBehavior = "auto";
      scrollElement.scrollTop = overshootTop;
      const settle = () => {
        const currentScrollElement = this.scrollHostRef?.nativeElement;
        if (!currentScrollElement || currentScrollElement !== scrollElement) {
          return;
        }
        scrollElement.style.scrollBehavior = previousScrollBehavior;
        this.guardListSnapSettle();
        scrollElement.scrollTo({ top: finalTop, behavior: "smooth" });
      };
      if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(() => settle());
        return;
      }
      setTimeout(settle, 0);
    };
    if (!this.afterViewInit) {
      return;
    }
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  shouldBootstrapInitialListSnap(_scrollElement) {
    return !this.isHorizontalList() && this.resolvedListLayout() === "card-grid" && this.resolvedSnapMode() !== "none";
  }
  scheduleListSnapSettle(scrollElement) {
    if (!this.shouldUseSmoothListSnapSettle(scrollElement)) {
      this.clearListSnapSettleTimer();
      return;
    }
    this.clearListSnapSettleTimer();
    this.listSnapSettleTimer = setTimeout(() => {
      this.listSnapSettleTimer = null;
      this.settleListSnapSmoothly(scrollElement);
    }, _SmartListComponent.LIST_SNAP_SETTLE_DELAY_MS);
  }
  shouldUseSmoothListSnapSettle(scrollElement) {
    return !this.suppressListSnapSettle && !this.suppressListSnapNearEnd && !this.isTouchingSurface && !this.horizontalListScrollInProgress && this.currentViewMode === "list" && this.resolvedListLayout() === "card-grid" && (!this.isHorizontalList() || this.isCompactHorizontalViewport()) && this.resolvedSnapMode() !== "none" && scrollElement === this.scrollHostRef?.nativeElement;
  }
  isCompactHorizontalViewport() {
    return this.isMobileViewport();
  }
  shouldUseHorizontalMobileStepper() {
    return this.currentViewMode === "list" && this.isHorizontalList() && this.resolvedMobileStepper() && this.isMobileViewport();
  }
  shouldUseTimelineMobileStepper() {
    return this.isTimelineMode() && this.resolvedMobileStepper() && this.isMobileViewport();
  }
  usesTimelineViewportScroll(scrollElement) {
    return this.isTimelineMode() && this.pages.length === 1 && Boolean(scrollElement) && (scrollElement?.scrollWidth ?? 0) > (scrollElement?.clientWidth ?? 0) + 1;
  }
  canScrollTimelineViewport(direction, scrollElement) {
    const maxScrollLeft = Math.max(0, scrollElement.scrollWidth - scrollElement.clientWidth);
    return direction < 0 ? scrollElement.scrollLeft > 1 : scrollElement.scrollLeft < maxScrollLeft - 1;
  }
  moveTimelineViewport(direction) {
    const scrollElement = this.scrollHostRef?.nativeElement ?? null;
    if (!scrollElement) {
      return;
    }
    if (!this.usesTimelineViewportScroll(scrollElement)) {
      this.stepper.navigateBy(direction);
      return;
    }
    const firstCell = scrollElement.querySelector(".smart-list__timeline-header-cell");
    const cellWidth = firstCell?.getBoundingClientRect().width ?? 0;
    const visibleCellCount = cellWidth > 0 ? Math.max(1, Math.floor((scrollElement.clientWidth + 1) / cellWidth)) : 1;
    const stepWidth = cellWidth > 0 ? visibleCellCount * cellWidth : Math.max(1, scrollElement.clientWidth);
    const maxScrollLeft = Math.max(0, scrollElement.scrollWidth - scrollElement.clientWidth);
    const targetLeft = Math.max(0, Math.min(maxScrollLeft, scrollElement.scrollLeft + direction * stepWidth));
    scrollElement.scrollTo({ left: targetLeft, behavior: "smooth" });
  }
  updateTimelineViewportScrollState(scrollElement) {
    const maxScrollLeft = Math.max(0, scrollElement.scrollWidth - scrollElement.clientWidth);
    this.scrollable = maxScrollLeft > 1;
    this.progress = maxScrollLeft > 0 ? AppUtils.clampNumber(scrollElement.scrollLeft / maxScrollLeft, 0, 1) : 0;
    this.emitState();
    this.cdr.markForCheck();
  }
  isMobileViewport() {
    const breakpointPx = _SmartListComponent.DEFAULT_MOBILE_BREAKPOINT_PX;
    const matcher = globalThis.matchMedia?.(`(max-width: ${breakpointPx}px)`);
    if (matcher) {
      return matcher.matches;
    }
    return (globalThis.innerWidth ?? Number.POSITIVE_INFINITY) <= breakpointPx;
  }
  beginHorizontalListScroll(scrollElement) {
    if (!this.isHorizontalList() || scrollElement !== this.scrollHostRef?.nativeElement) {
      return;
    }
    this.clearListSnapSettleTimer();
    if (this.horizontalListScrollInProgress) {
      return;
    }
    this.horizontalListScrollInProgress = true;
    this.cdr.markForCheck();
  }
  scheduleHorizontalListScrollEnd(scrollElement) {
    if (!this.isHorizontalList() || scrollElement !== this.scrollHostRef?.nativeElement) {
      this.clearHorizontalListScrollEndTimer();
      return;
    }
    if (this.horizontalListScrollEndTimer) {
      clearTimeout(this.horizontalListScrollEndTimer);
    }
    this.horizontalListScrollEndTimer = setTimeout(() => {
      this.horizontalListScrollEndTimer = null;
      this.finishHorizontalListScroll(scrollElement);
    }, _SmartListComponent.LIST_SNAP_SETTLE_DELAY_MS);
  }
  finishHorizontalListScroll(scrollElement) {
    if (this.horizontalListScrollEndTimer) {
      clearTimeout(this.horizontalListScrollEndTimer);
      this.horizontalListScrollEndTimer = null;
    }
    if (!this.isHorizontalList() || scrollElement !== this.scrollHostRef?.nativeElement) {
      this.clearHorizontalListScrollEndTimer();
      return;
    }
    if (this.horizontalListScrollInProgress) {
      this.horizontalListScrollInProgress = false;
      this.cdr.markForCheck();
    }
    if (this.shouldUseHorizontalMobileStepper()) {
      return;
    }
    this.settleListSnapSmoothly(scrollElement);
  }
  settleListSnapSmoothly(scrollElement) {
    if (!this.shouldUseSmoothListSnapSettle(scrollElement)) {
      return;
    }
    const nearestTarget = this.nearestListSnapTarget(scrollElement);
    if (!nearestTarget) {
      return;
    }
    const targetPosition = this.listSnapTargetPosition(scrollElement, nearestTarget);
    const currentPosition = this.listSnapScrollPosition(scrollElement);
    if (Math.abs(currentPosition - targetPosition) <= 2) {
      return;
    }
    this.guardListSnapSettle();
    this.scrollToListSnapPosition(scrollElement, targetPosition, "smooth");
  }
  nearestListSnapTarget(scrollElement) {
    const targets = this.listCardSnapTargets(scrollElement);
    if (targets.length === 0) {
      return null;
    }
    const currentPosition = this.listSnapScrollPosition(scrollElement);
    return targets.reduce((nearest, candidate) => {
      const nearestDistance = Math.abs(this.listSnapTargetPosition(scrollElement, nearest) - currentPosition);
      const candidateDistance = Math.abs(this.listSnapTargetPosition(scrollElement, candidate) - currentPosition);
      return candidateDistance < nearestDistance ? candidate : nearest;
    }, targets[0]);
  }
  guardListSnapSettle() {
    this.suppressListSnapSettle = true;
    if (this.listSnapSettleGuardTimer) {
      clearTimeout(this.listSnapSettleGuardTimer);
    }
    this.listSnapSettleGuardTimer = setTimeout(() => {
      this.listSnapSettleGuardTimer = null;
      this.suppressListSnapSettle = false;
    }, _SmartListComponent.LIST_SNAP_SETTLE_GUARD_MS);
  }
  clearListSnapSettleTimer() {
    if (!this.listSnapSettleTimer) {
      return;
    }
    clearTimeout(this.listSnapSettleTimer);
    this.listSnapSettleTimer = null;
  }
  clearListSnapSettleTimers() {
    this.clearListSnapSettleTimer();
    this.clearHorizontalListScrollEndTimer();
    if (this.listSnapSettleGuardTimer) {
      clearTimeout(this.listSnapSettleGuardTimer);
      this.listSnapSettleGuardTimer = null;
    }
    this.suppressListSnapSettle = false;
  }
  clearHorizontalListScrollEndTimer() {
    if (this.horizontalListScrollEndTimer) {
      clearTimeout(this.horizontalListScrollEndTimer);
      this.horizontalListScrollEndTimer = null;
    }
    if (this.horizontalListScrollInProgress) {
      this.horizontalListScrollInProgress = false;
      this.cdr.markForCheck();
    }
  }
  updateAutoFooterSpacerHeight(scrollElement) {
    void scrollElement;
    if (this.resolvedPresentation() === "fullscreen") {
      this.autoFooterSpacerHeightPx = 0;
      return;
    }
    this.autoFooterSpacerHeightPx = this.activeDockedMenuHeightPx();
  }
  revealDockedItemMenuSoon(item) {
    const prepare = () => {
      this.updateAutoFooterSpacerHeight();
      this.cdr.markForCheck();
      const reveal = () => this.revealDockedItemMenu(item);
      if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(reveal);
        return;
      }
      setTimeout(reveal, 0);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(prepare));
      return;
    }
    setTimeout(prepare, 0);
  }
  revealDockedItemMenu(item) {
    const scrollElement = this.scrollHostRef?.nativeElement;
    const dockHeight = this.activeDockedMenuHeightPx();
    if (!scrollElement || dockHeight <= 0) {
      return;
    }
    const itemIndex = this.items.indexOf(item);
    if (itemIndex < 0) {
      return;
    }
    const itemElement = this.ownedListElement(scrollElement, `.smart-list__item-shell[data-smart-list-index="${itemIndex}"]`);
    if (!itemElement) {
      return;
    }
    const scrollRect = scrollElement.getBoundingClientRect();
    const itemRect = itemElement.getBoundingClientRect();
    const safeBottom = scrollRect.bottom - dockHeight - 8;
    if (itemRect.bottom <= safeBottom) {
      return;
    }
    scrollElement.scrollTop += itemRect.bottom - safeBottom;
    this.updateScrollProgress(scrollElement);
    this.emitState();
    this.cdr.markForCheck();
  }
  activeDockedMenuHeightPx() {
    const outlet = this.paginationMenuOutlet;
    return outlet?.isDocked() ? outlet.heightPx() : 0;
  }
  listCardSnapTargets(scrollElement) {
    if (this.isHorizontalList()) {
      return this.ownedListElements(scrollElement, ".smart-list__item-shell[data-smart-list-index]");
    }
    return this.ownedListElements(scrollElement, _SmartListComponent.LIST_CARD_SNAP_TARGET_SELECTOR);
  }
  updateListSnapNearEndSuppression(scrollElement) {
    const target = scrollElement ?? this.scrollHostRef?.nativeElement;
    let nextValue = this.shouldSuppressListSnapNearEnd(target);
    if (this.suspendSnapReactivation && this.suppressListSnapNearEnd && !nextValue) {
      nextValue = true;
    }
    if (this.suppressListSnapNearEnd === nextValue) {
      return;
    }
    this.suppressListSnapNearEnd = nextValue;
    if (nextValue) {
      this.clearListSnapSettleTimer();
    }
    this.cdr.markForCheck();
  }
  shouldSuppressListSnapNearEnd(scrollElement) {
    if (!scrollElement || this.currentViewMode !== "list" || this.resolvedListLayout() !== "card-grid" || this.resolvedSnapMode() === "none") {
      return false;
    }
    const maxScroll = this.listMaxScroll(scrollElement);
    if (maxScroll <= 1) {
      return false;
    }
    const lastReachableSnapPosition = this.lastReachableListSnapTargetPosition(scrollElement, maxScroll);
    if (lastReachableSnapPosition === null || maxScroll <= lastReachableSnapPosition + 1) {
      return false;
    }
    return this.listSnapScrollPosition(scrollElement) > lastReachableSnapPosition + 1;
  }
  lastReachableListSnapTargetPosition(scrollElement, maxScroll) {
    const maxPosition = maxScroll ?? this.listMaxScroll(scrollElement);
    const reachablePositions = this.listCardSnapTargets(scrollElement).map((target) => this.listSnapTargetPosition(scrollElement, target)).filter((position) => position <= maxPosition + 1);
    if (reachablePositions.length === 0) {
      return null;
    }
    return Math.max(...reachablePositions);
  }
  listMaxScroll(scrollElement) {
    return this.isHorizontalList() ? Math.max(0, scrollElement.scrollWidth - scrollElement.clientWidth) : Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
  }
  listSnapScrollPosition(scrollElement) {
    return this.isHorizontalList() ? Math.max(0, scrollElement.scrollLeft) : Math.max(0, scrollElement.scrollTop);
  }
  listSnapTargetPosition(scrollElement, target) {
    const scrollPadding = this.listSnapPaddingStart(scrollElement);
    const targetOffset = this.isHorizontalList() ? target.offsetLeft : target.offsetTop;
    return Math.max(0, targetOffset - scrollPadding);
  }
  scrollToListSnapPosition(scrollElement, position, behavior) {
    if (this.isHorizontalList()) {
      scrollElement.scrollTo({ left: position, behavior });
      return;
    }
    scrollElement.scrollTo({ top: position, behavior });
  }
  listSnapPaddingStart(scrollElement) {
    const computed = globalThis.getComputedStyle?.(scrollElement);
    const rawScrollPadding = this.isHorizontalList() ? computed?.scrollPaddingLeft || computed?.getPropertyValue("scroll-padding-left") : computed?.scrollPaddingTop || computed?.getPropertyValue("scroll-padding-top") || "";
    const parsedScrollPadding = Number.parseFloat(rawScrollPadding);
    const stickyHeaderHeight = this.shouldShowStickyHeader() ? this.ownedListElement(scrollElement, ".smart-list__sticky")?.offsetHeight ?? 0 : 0;
    if (Number.isFinite(parsedScrollPadding)) {
      return parsedScrollPadding;
    }
    return this.isHorizontalList() ? 0 : stickyHeaderHeight;
  }
  resetScrollSoon() {
    const reset = () => {
      const scrollElement = this.scrollHostRef?.nativeElement;
      if (!scrollElement) {
        return;
      }
      scrollElement.scrollTop = 0;
      if (this.isPageMode()) {
        const initialIndex = this.stepper.initialPageIndex();
        this.stepper.clearInitialPageIndexOverride();
        const pageCount = this.stepper.pages().length || this.pages.length;
        const targetLeft = this.stepper.pageTargetLeft(scrollElement, initialIndex, pageCount);
        if (targetLeft >= 0) {
          this.stepper.suppressSettle = true;
          const previousScrollBehavior = scrollElement.style.scrollBehavior;
          const previousSnapType = scrollElement.style.scrollSnapType;
          scrollElement.style.scrollBehavior = "auto";
          scrollElement.style.scrollSnapType = "none";
          scrollElement.scrollLeft = targetLeft;
          scrollElement.style.scrollBehavior = previousScrollBehavior;
          const release = () => {
            scrollElement.style.scrollSnapType = previousSnapType;
            this.stepper.suppressSettle = false;
            this.applyPageSurfaceState(scrollElement);
            this.emitState();
            this.cdr.markForCheck();
          };
          if (typeof globalThis.requestAnimationFrame === "function") {
            globalThis.requestAnimationFrame(() => release());
          } else {
            setTimeout(release, 0);
          }
        } else {
          this.applyPageSurfaceState(scrollElement);
        }
      } else {
        scrollElement.scrollLeft = 0;
        if (this.shouldShowStickyHeader()) {
          this.updateStickyLabel(0);
        } else {
          this.stickyLabel = this.resolveEmptyStickyLabel();
        }
        this.updateScrollProgress(scrollElement);
      }
      this.emitState();
      this.cdr.markForCheck();
    };
    if (!this.afterViewInit) {
      this.pendingScrollResetAfterViewInit = true;
      return;
    }
    this.pendingScrollResetAfterViewInit = false;
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(reset));
      return;
    }
    setTimeout(reset, 0);
  }
  startLoadingAnimation() {
    this.loadingCounter += 1;
    if (this.loadingCounter > 1) {
      return;
    }
    this.loadingProgress = 0.02;
    this.loadingOverdue = false;
    this.loadingStartedAtMs = performance.now();
    if (this.loadingCompleteTimer) {
      clearTimeout(this.loadingCompleteTimer);
      this.loadingCompleteTimer = null;
    }
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
    this.updateLoadingWindow();
    this.flushSoon();
    this.loadingInterval = this.ngZone.runOutsideAngular(() => setInterval(() => {
      this.updateLoadingWindow();
      this.flushSoon();
    }, 16));
  }
  endLoadingAnimation(options = {}) {
    if (this.loadingCounter === 0) {
      return;
    }
    this.loadingCounter = Math.max(0, this.loadingCounter - 1);
    if (this.loadingCounter !== 0) {
      return;
    }
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
    const elapsed = Math.max(0, performance.now() - this.loadingStartedAtMs);
    const forceAnimatedCompletion = options.forceAnimatedCompletion === true;
    if (!forceAnimatedCompletion && elapsed < _SmartListComponent.QUICK_COMPLETE_THRESHOLD_MS) {
      this.loadingProgress = 0;
      this.loadingOverdue = false;
      this.loadingStartedAtMs = 0;
      this.emitState();
      this.flushSoon();
      return;
    }
    this.loadingProgress = 1;
    this.loadingOverdue = false;
    this.emitState();
    this.flushSoon();
    if (this.loadingCompleteTimer) {
      clearTimeout(this.loadingCompleteTimer);
    }
    this.loadingCompleteTimer = this.ngZone.runOutsideAngular(() => setTimeout(() => {
      this.ngZone.run(() => {
        if (this.loadingCounter !== 0) {
          return;
        }
        this.loadingProgress = 0;
        this.loadingOverdue = false;
        this.loadingStartedAtMs = 0;
        this.loadingCompleteTimer = null;
        this.emitState();
        this.flushSoon();
        this.cdr.markForCheck();
      });
    }, 100));
  }
  clearLoadingAnimation() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
    if (this.loadingCompleteTimer) {
      clearTimeout(this.loadingCompleteTimer);
      this.loadingCompleteTimer = null;
    }
    this.loadingCounter = 0;
    this.loadingProgress = 0;
    this.loadingOverdue = false;
    this.loadingStartedAtMs = 0;
  }
  resolvedLoadingDelayMs() {
    const configured = Number(this.config.loadingDelayMs);
    if (Number.isFinite(configured) && configured >= 0) {
      return Math.max(0, Math.trunc(configured));
    }
    return _SmartListComponent.DEFAULT_LOADING_DELAY_MS;
  }
  updateLoadingWindow() {
    if (!this.loading) {
      return;
    }
    const elapsed = Math.max(0, performance.now() - this.loadingStartedAtMs);
    const windowMs = Math.max(600, this.config.loadingWindowMs ?? _SmartListComponent.DEFAULT_LOADING_WINDOW_MS);
    const nextProgress = Math.min(1, Math.max(0, elapsed / windowMs));
    this.loadingProgress = Math.max(this.loadingProgress, nextProgress);
    this.loadingOverdue = elapsed >= windowMs && this.loadingCounter > 0;
  }
  flushSoon() {
    if (this.flushScheduled) {
      return;
    }
    this.flushScheduled = true;
    this.ngZone.runOutsideAngular(() => {
      const flush = () => {
        this.ngZone.run(() => {
          this.flushScheduled = false;
          this.cdr.markForCheck();
        });
      };
      if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(() => flush());
        return;
      }
      setTimeout(flush, 0);
    });
  }
  emitState() {
    this.stateChange.emit(this.buildStateChange());
    this.syncPaginationAutoplay();
  }
  resolvedPaginationAutoplayMs() {
    const value = this.resolveConfigValue(this.config.pagination?.autoplayMs, null);
    const normalized = Math.trunc(Number(value));
    return Number.isFinite(normalized) && normalized >= 1e3 ? normalized : null;
  }
  syncPaginationAutoplay() {
    const autoplayMs = this.resolvedPaginationAutoplayMs();
    const canAutoplay = autoplayMs !== null && !this.autoplayPaused && this.currentViewMode === "list" && this.isHorizontalList() && this.items.length > 1;
    if (!canAutoplay) {
      this.clearPaginationAutoplay();
      return;
    }
    if (this.autoplayTimer !== null) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      this.autoplayTimer = setInterval(() => {
        const cursor = this.finiteStepper.state();
        if (cursor.total <= 1) {
          this.clearPaginationAutoplay();
          return;
        }
        const nextIndex = cursor.index >= cursor.total - 1 ? 0 : cursor.index + 1;
        this.ngZone.run(() => {
          void this.setCursorIndex(nextIndex);
        });
      }, autoplayMs);
    });
  }
  pausePaginationAutoplay() {
    this.autoplayPaused = true;
    this.clearPaginationAutoplay();
  }
  resetPaginationAutoplay() {
    this.autoplayPaused = false;
    this.clearPaginationAutoplay();
  }
  clearPaginationAutoplay() {
    if (this.autoplayTimer === null) {
      return;
    }
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }
  buildStateChange() {
    const loadingVisible = this.isVisiblePageLoading();
    const cursor = this.finiteStepper.state();
    return {
      items: this.items,
      groups: this.groups,
      query: this.currentQuery(),
      total: this.total,
      currentView: this.currentViewKey,
      hasMore: this.hasMore,
      loading: loadingVisible,
      initialLoading: this.initialLoading,
      progress: this.progress,
      loadingProgress: loadingVisible ? Math.max(this.loadingProgress, this.stepper.pendingVisualKey ? 0.02 : 0) : 0,
      loadingOverdue: loadingVisible ? this.loadingOverdue : false,
      scrollable: this.scrollable,
      stickyLabel: this.stickyLabel || this.resolveEmptyStickyLabel(),
      cursorIndex: cursor.index,
      cursorTotal: cursor.total,
      cursorProgress: cursor.progress,
      cursorCanPrev: cursor.canPrev,
      cursorCanNext: cursor.canNext
    };
  }
  resolvedHeaderProgressMode() {
    return this.resolvedPresentation() === "fullscreen" && this.resolvedPaginationMode() !== "scroll" ? "cursor" : "surface";
  }
  shouldUseHostedFullscreenPagination() {
    return this.currentViewMode === "list" && this.resolvedPresentation() === "fullscreen" && this.resolvedPaginationMode() !== "scroll";
  }
  syncCursorIndexToVisibleListItem() {
    if (!this.shouldUseHostedFullscreenPagination()) {
      return;
    }
    const scrollElement = this.scrollHostRef?.nativeElement;
    if (!scrollElement || this.items.length === 0) {
      return;
    }
    const visibleIndex = this.firstVisibleListItemIndex(scrollElement);
    if (visibleIndex === null || visibleIndex === this.finiteStepper.state().index) {
      return;
    }
    void this.setCursorIndex(visibleIndex);
  }
  syncHorizontalCursorIndexToVisibleListItem(scrollElement) {
    if (!this.isHorizontalList() || this.items.length === 0) {
      return;
    }
    if (this.horizontalCursorScrollLockTargetIndex !== null) {
      this.scheduleHorizontalCursorScrollLockRelease(scrollElement);
      return;
    }
    const visibleIndex = this.firstVisibleHorizontalListItemIndex(scrollElement);
    if (visibleIndex === null || visibleIndex === this.finiteStepper.state().index) {
      return;
    }
    this.finiteStepper.setIndex(visibleIndex, { notify: false });
    this.cdr.markForCheck();
  }
  firstVisibleHorizontalListItemIndex(scrollElement) {
    const listRect = scrollElement.getBoundingClientRect();
    const visibleLeft = listRect.left + 1;
    const itemElements = this.ownedListElements(scrollElement, "[data-smart-list-index]");
    const anchorElement = itemElements.find((element) => element.getBoundingClientRect().right > visibleLeft) ?? itemElements.find((element) => element.getBoundingClientRect().left >= listRect.left - 1) ?? itemElements[0] ?? null;
    if (!anchorElement) {
      return null;
    }
    const rawIndex = Number.parseInt(anchorElement.dataset["smartListIndex"] ?? "", 10);
    return Number.isFinite(rawIndex) ? Math.max(0, rawIndex) : null;
  }
  scrollHorizontalListItemIntoView(index, behavior) {
    if (!this.isHorizontalList()) {
      return;
    }
    const run = () => {
      const scrollElement = this.scrollHostRef?.nativeElement;
      if (!scrollElement || !this.isHorizontalList()) {
        return;
      }
      const itemElement = this.ownedListElement(scrollElement, `.smart-list__item-shell[data-smart-list-index="${index}"]`);
      if (!itemElement) {
        return;
      }
      if (behavior === "smooth") {
        this.horizontalCursorScrollLockTargetIndex = index;
        this.scheduleHorizontalCursorScrollLockRelease(scrollElement);
      } else {
        this.clearHorizontalCursorScrollLock();
      }
      this.scrollToListSnapPosition(scrollElement, this.listSnapTargetPosition(scrollElement, itemElement), behavior);
      this.updateScrollProgress(scrollElement);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  syncHorizontalViewportAfterResize() {
    if (!this.afterViewInit || !this.isHorizontalList()) {
      return;
    }
    if (!this.shouldUseCompactHorizontal() && !this.shouldUseHorizontalMobileStepper()) {
      return;
    }
    this.scrollHorizontalListItemIntoView(this.finiteStepper.state().index, "auto");
  }
  scheduleHorizontalCursorScrollLockRelease(scrollElement) {
    if (this.horizontalCursorScrollLockTimer) {
      clearTimeout(this.horizontalCursorScrollLockTimer);
    }
    this.horizontalCursorScrollLockTimer = setTimeout(() => {
      this.horizontalCursorScrollLockTimer = null;
      const targetIndex = this.horizontalCursorScrollLockTargetIndex;
      this.horizontalCursorScrollLockTargetIndex = null;
      const currentScrollElement = this.scrollHostRef?.nativeElement;
      if (!currentScrollElement || currentScrollElement !== scrollElement || !this.isHorizontalList()) {
        return;
      }
      const finalIndex = this.firstVisibleHorizontalListItemIndex(currentScrollElement) ?? targetIndex;
      if (finalIndex === null || finalIndex === this.finiteStepper.index) {
        return;
      }
      this.finiteStepper.setIndex(finalIndex, { notify: false });
      this.emitState();
      this.cdr.markForCheck();
    }, 120);
  }
  clearHorizontalCursorScrollLock() {
    if (this.horizontalCursorScrollLockTimer) {
      clearTimeout(this.horizontalCursorScrollLockTimer);
      this.horizontalCursorScrollLockTimer = null;
    }
    this.horizontalCursorScrollLockTargetIndex = null;
  }
  firstVisibleListItemIndex(scrollElement) {
    const threadRect = scrollElement.getBoundingClientRect();
    const visibleTop = threadRect.top + this.listTopInset(scrollElement);
    const itemElements = this.ownedListElements(scrollElement, "[data-smart-list-index]");
    const anchorElement = itemElements.find((element) => element.getBoundingClientRect().bottom > visibleTop + 1) ?? itemElements.find((element) => element.getBoundingClientRect().top >= visibleTop - 1) ?? itemElements[0] ?? null;
    if (!anchorElement) {
      return null;
    }
    const rawIndex = Number.parseInt(anchorElement.dataset["smartListIndex"] ?? "", 10);
    return Number.isFinite(rawIndex) ? Math.max(0, rawIndex) : null;
  }
  ratingAdvanceInFlight = false;
  async handleHostedFullscreenRatingSelect(score) {
    this.interruptHostedFullscreenTransition();
    await this.config.pagination?.onRatingSelect?.(this.cursorItem(), score, this.currentQuery());
    if (!this.shouldUseHostedFullscreenPagination()) {
      return;
    }
    const canMoveToNextItem = this.finiteStepper.canMove(1);
    const canMoveToEmptyState = !canMoveToNextItem && this.shouldUseHostedFullscreenPagination() && this.finiteStepper.canMoveToEmptyCursor();
    if (!canMoveToNextItem && !canMoveToEmptyState) {
      return;
    }
    if (this.ratingAdvanceInFlight) {
      return;
    }
    this.ratingAdvanceInFlight = true;
    try {
      await this.wait(120);
      if (!this.shouldUseHostedFullscreenPagination() || this.finiteStepper.animating) {
        return;
      }
      await this.advanceHostedFullscreenPagination(1, { allowEmptyTarget: canMoveToEmptyState });
    } finally {
      this.ratingAdvanceInFlight = false;
    }
  }
  async advanceHostedFullscreenPagination(delta, options = {}) {
    if (!this.shouldUseHostedFullscreenPagination() || this.finiteStepper.animating) {
      return false;
    }
    const normalizedDelta = Math.trunc(delta);
    const allowEmptyTarget = options.allowEmptyTarget === true && normalizedDelta > 0 && this.shouldUseHostedFullscreenPagination() && this.finiteStepper.canMoveToEmptyCursor();
    if (!this.finiteStepper.canMove(normalizedDelta) && !allowEmptyTarget) {
      return false;
    }
    const currentIndex = this.finiteStepper.state().index;
    const targetIndex = currentIndex + normalizedDelta;
    const targetIsEmptyState = allowEmptyTarget && targetIndex === this.finiteStepper.cursorTotal();
    if (!targetIsEmptyState && !await this.ensureHostedFullscreenTargetLoaded(targetIndex)) {
      return false;
    }
    if (normalizedDelta > 0) {
      const previewIndex = currentIndex + (_SmartListComponent.HOSTED_FULLSCREEN_STACK_SIZE - 1);
      await this.ensureHostedFullscreenTargetLoaded(previewIndex);
    }
    const currentItem = this.cursorItem();
    if (!currentItem) {
      return this.moveCursor(normalizedDelta);
    }
    this.finiteStepper.setEmptyCursor(targetIsEmptyState, { notify: false });
    this.finiteStepper.setIndex(targetIndex, { notify: false });
    this.finiteStepper.syncBounds();
    this.emitState();
    this.cdr.markForCheck();
    this.hostedFullscreenPendingDelta = normalizedDelta;
    this.hostedFullscreenCompletingTransition = false;
    this.finiteStepper.beginTransition(currentItem);
    if (this.currentViewMode === "list" && this.resolvedPresentation() === "fullscreen" && this.hasMore && !this.loading) {
      const remaining = this.items.length - (this.finiteStepper.index + 1);
      if (remaining <= _SmartListComponent.HOSTED_FULLSCREEN_STACK_SIZE - 1) {
        void this.loadNextPage();
      }
    }
    this.startHostedFullscreenTransitionTimer();
    return true;
  }
  async ensureHostedFullscreenTargetLoaded(index) {
    const normalizedIndex = Math.max(0, Math.trunc(index));
    if (!this.shouldUseHostedFullscreenPagination() || normalizedIndex < this.items.length || normalizedIndex === this.total) {
      return true;
    }
    let waitTicks = 0;
    while (this.items.length <= normalizedIndex) {
      if (!this.hasMore && !this.loading) {
        return false;
      }
      if (!this.loading) {
        await this.loadNextPage();
        waitTicks = 0;
        continue;
      }
      await this.wait(16);
      waitTicks += 1;
      if (waitTicks >= 320 && this.items.length <= normalizedIndex) {
        return false;
      }
    }
    return true;
  }
  isVisiblePageLoading() {
    if (!this.isPageMode()) {
      return this.loading || this.loadingProgress > 0;
    }
    if (this.stepper.pendingVisualKey) {
      return true;
    }
    if (this.initialLoading) {
      return this.loading || this.loadingProgress > 0;
    }
    if (!this.stepper.pendingPageKey) {
      return false;
    }
    const visibleAnchor = this.stepper.currentAnchor() ?? this.currentPageAnchor();
    if (!visibleAnchor) {
      return false;
    }
    return this.stepper.pageKey(visibleAnchor) === this.stepper.pendingPageKey && (this.loading || this.loadingProgress > 0);
  }
  currentQuery(page = this.pageIndex) {
    const query = this.currentBaseQuery(page);
    if (!this.isPageMode()) {
      return query;
    }
    const anchor = this.stepper.currentAnchor() ?? this.currentPageAnchor();
    return anchor ? this.stepper.queryForAnchor(anchor, this.currentBaseQuery(0)) : query;
  }
  currentBaseQuery(page = this.pageIndex) {
    const activeView = this.activeViewConfig();
    const baseQuery = this.query ?? {};
    const nextFilters = __spreadValues(__spreadValues(__spreadValues({}, this.config.defaultFilters ?? {}), baseQuery.filters ?? {}), this.filters ?? {});
    const pageSize = this.resolveEffectivePageSize(this.currentViewKey);
    const query = {
      page: this.currentViewMode === "list" ? page : 0,
      pageSize,
      cursor: this.currentViewMode === "list" ? this.nextPageCursor : void 0,
      sort: this.sort ?? baseQuery.sort ?? this.config.defaultSort,
      direction: this.direction ?? baseQuery.direction ?? this.config.defaultDirection,
      filters: Object.keys(nextFilters).length > 0 ? nextFilters : void 0,
      groupBy: this.currentViewMode === "list" ? this.groupBy ?? baseQuery.groupBy ?? activeView?.groupBy ?? this.config.defaultGroupBy : void 0,
      view: this.currentViewKey ?? baseQuery.view ?? void 0
    };
    return query;
  }
  loadQuery(page = this.pageIndex, isInitial = false) {
    const query = this.currentQuery(page);
    if (!isInitial) {
      return query;
    }
    const initialPageSize = this.config.initialPageSize;
    if (!Number.isFinite(initialPageSize)) {
      return query;
    }
    return __spreadProps(__spreadValues({}, query), {
      pageSize: this.resolveEffectiveInitialPageSize(query.pageSize, Number(initialPageSize))
    });
  }
  resolveLoadPage() {
    const viewKey = this.currentViewKey ?? "";
    return this.activeViewConfig()?.loadPage ?? this.loaders?.[viewKey] ?? this.loadPage;
  }
  resolveViewKey() {
    const explicit = this.view?.trim();
    if (explicit) {
      return explicit;
    }
    const queryView = this.query?.view?.trim();
    if (queryView) {
      return queryView;
    }
    const configDefault = this.config.defaultView?.trim();
    if (configDefault) {
      return configDefault;
    }
    return this.config.views?.[0]?.key ?? null;
  }
  resolveViewMode(viewKey = this.currentViewKey) {
    const activeView = this.activeViewConfig(viewKey);
    if (activeView?.mode) {
      return activeView.mode;
    }
    if (viewKey === "month" || viewKey === "week" || viewKey === "timeline") {
      return viewKey;
    }
    return "list";
  }
  pageAdapterForMode(mode) {
    return SmartListCalendarAdapter.getInstance(mode) ?? SmartListTimelineAdapter.getInstance(mode);
  }
  activeViewConfig(viewKey = this.currentViewKey) {
    if (!viewKey) {
      return null;
    }
    return this.config.views?.find((view) => view.key === viewKey) ?? null;
  }
  resolveEmptyStickyLabel() {
    return this.resolveText(this.config.emptyStickyLabel, "No items");
  }
  resolveText(value, fallback) {
    if (typeof value === "function") {
      const resolved = value(this.currentQuery());
      return typeof resolved === "string" && resolved.trim() ? resolved : fallback;
    }
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    return fallback;
  }
  resolvedPollIntervalMs() {
    return Math.max(0, Math.trunc(Number(this.resolveConfigValue(this.config.pollIntervalMs, null)) || 0));
  }
  resolveConfigValue(value, fallback) {
    if (typeof value === "function") {
      return value(this.currentQuery());
    }
    return value ?? fallback;
  }
  wait(delayMs, signal) {
    if (delayMs <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(this.createAbortError());
        return;
      }
      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, delayMs);
      const onAbort = () => {
        cleanup();
        reject(this.createAbortError());
      };
      const cleanup = () => {
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
      };
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }
  createAbortError() {
    const error = new Error("Request aborted.");
    error.name = "AbortError";
    return error;
  }
  isAbortError(error) {
    return error instanceof Error && error.name === "AbortError";
  }
  hostedFullscreenStackItemIndex(slotOffset) {
    const baseIndex = this.finiteStepper.state().index;
    if (!this.finiteStepper.animating || this.hostedFullscreenPendingDelta === 0) {
      return baseIndex + slotOffset;
    }
    const direction = this.hostedFullscreenPendingDelta < 0 ? -1 : 1;
    return baseIndex + (slotOffset - 1) * direction;
  }
  startHostedFullscreenTransitionTimer() {
    this.clearHostedFullscreenTransitionTimer();
    this.hostedFullscreenTransitionTimer = setTimeout(() => {
      this.hostedFullscreenTransitionTimer = null;
      void this.completeHostedFullscreenPaginationTransition();
    }, _SmartListComponent.HOSTED_FULLSCREEN_PAGE_CURL_DURATION_MS + 48);
  }
  clearHostedFullscreenTransitionTimer() {
    if (!this.hostedFullscreenTransitionTimer) {
      return;
    }
    clearTimeout(this.hostedFullscreenTransitionTimer);
    this.hostedFullscreenTransitionTimer = null;
  }
  interruptHostedFullscreenTransition() {
    if (!this.finiteStepper.animating) {
      return;
    }
    this.clearHostedFullscreenTransitionTimer();
    this.hostedFullscreenPendingDelta = 0;
    this.hostedFullscreenCompletingTransition = false;
    this.finiteStepper.finishTransition();
  }
  resetHostedFullscreenTransition() {
    this.interruptHostedFullscreenTransition();
    this.finiteStepper.reset();
  }
  async completeHostedFullscreenPaginationTransition() {
    if (!this.finiteStepper.animating || this.hostedFullscreenPendingDelta === 0 || this.hostedFullscreenCompletingTransition) {
      return;
    }
    this.hostedFullscreenPendingDelta = 0;
    this.hostedFullscreenCompletingTransition = true;
    this.clearHostedFullscreenTransitionTimer();
    this.hostedFullscreenCompletingTransition = false;
    this.finiteStepper.finishTransition();
  }
  currentPageAnchor() {
    if (this.isPageMode()) {
      this.stepper.ensureWindow();
    }
    return this.stepper.focusAnchor;
  }
  resolveEffectivePageSize(viewKey = this.currentViewKey) {
    const configuredPageSize = Math.max(1, Math.trunc(this.activeViewConfig(viewKey)?.pageSize ?? this.config.pageSize ?? 10));
    const mobileCap = this.mobilePageSizeCapForView(viewKey);
    return mobileCap === null ? configuredPageSize : Math.min(configuredPageSize, mobileCap);
  }
  resolveEffectiveInitialPageSize(queryPageSize, configuredInitialPageSize) {
    const normalizedInitialPageSize = Math.max(1, Math.trunc(configuredInitialPageSize));
    const mobileCap = this.mobilePageSizeCapForView();
    if (mobileCap === null) {
      return normalizedInitialPageSize;
    }
    return Math.max(1, Math.trunc(queryPageSize));
  }
  mobilePageSizeCapForView(viewKey = this.currentViewKey) {
    if (typeof window === "undefined" || !this.isMobileViewport()) {
      return null;
    }
    if (this.resolveViewMode(viewKey) !== "list") {
      return null;
    }
    const configuredCap = this.config.mobilePageSizeCap;
    if (configuredCap === null) {
      return null;
    }
    return Math.max(1, Math.trunc(configuredCap ?? _SmartListComponent.DEFAULT_MOBILE_PAGE_SIZE_CAP));
  }
  async loadAnchorPage(anchor, query, isInitial = false, options = {}) {
    const loader = this.resolveLoadPage();
    if (!loader || !this.isPageMode()) {
      this.loading = false;
      this.initialLoading = false;
      this.hasMore = false;
      this.emitState();
      this.cdr.markForCheck();
      return;
    }
    const pageKey = this.stepper.pageKey(anchor);
    if (options.force === true && this.stepper.preloadingPageKey) {
      this.cancelPendingAnchorPreload();
    }
    if (this.stepper.hasPageData(pageKey) && options.force !== true) {
      if (isInitial) {
        this.initialLoading = false;
        this.items = [...this.stepper.itemsForAnchor(anchor)];
        this.total = this.stepper.totalForAnchor(anchor, this.items.length);
        this.emitState();
        this.cdr.markForCheck();
      }
      return;
    }
    if (this.stepper.pendingPageKey) {
      if (this.stepper.pendingPageKey !== pageKey && options.replacePending === true) {
        this.cancelPendingAnchorPageLoad();
      } else {
        return;
      }
    }
    if (this.stepper.pendingPageKey) {
      return;
    }
    const sequence = ++this.loadSequence;
    const abortController = typeof AbortController === "undefined" ? null : new AbortController();
    this.stepperPageLoadAbortController = abortController;
    this.stepper.beginPendingPage(this.stepper.normalizeAnchor(anchor), this.progress);
    this.loading = true;
    this.startLoadingAnimation();
    this.emitState();
    try {
      const [result] = await Promise.all([
        firstValueFrom(loader(query, { signal: abortController?.signal })),
        this.wait(this.resolvedLoadingDelayMs(), abortController?.signal)
      ]);
      if (sequence !== this.loadSequence) {
        return;
      }
      this.applyAnchorPageResult(anchor, result, {
        deferRender: !isInitial && this.stepper.scrollInProgress
      });
    } catch (error) {
      if (sequence !== this.loadSequence) {
        return;
      }
      if (this.isAbortError(error)) {
        return;
      }
      this.stepper.setEmptyPage(anchor, {
        deferRender: !isInitial && this.stepper.scrollInProgress
      });
      if (!isInitial && this.stepper.scrollInProgress) {
        this.initialLoading = false;
        return;
      }
      this.items = [];
      this.total = 0;
      this.initialLoading = false;
      this.hasMore = false;
      this.stepper.applySnapshot();
    } finally {
      if (sequence !== this.loadSequence) {
        return;
      }
      if (this.stepperPageLoadAbortController === abortController) {
        this.stepperPageLoadAbortController = null;
      }
      this.stepper.clearPendingPage();
      this.loading = false;
      this.endLoadingAnimation();
      if (!this.stepper.renderDeferred) {
        this.refreshSurfaceSoon();
      }
      this.emitState();
      this.cdr.markForCheck();
      if (!this.stepper.scrollInProgress) {
        this.stepper.maybeLoadCurrentPage();
      }
    }
  }
  cancelPendingAnchorPageLoad() {
    if (!this.stepper.pendingPageKey) {
      return;
    }
    this.loadSequence += 1;
    this.stepperPageLoadAbortController?.abort();
    this.stepperPageLoadAbortController = null;
    this.stepper.clearPendingPage({ clearProgrammaticTarget: true });
    this.loading = false;
    this.clearLoadingAnimation();
    this.emitState();
    this.cdr.markForCheck();
  }
  patchVisibleItem(predicate, patch) {
    if (this.currentViewMode !== "list") {
      return false;
    }
    const index = this.items.findIndex(predicate);
    if (index < 0) {
      return false;
    }
    const currentItem = this.items[index];
    if (currentItem === void 0) {
      return false;
    }
    const nextItem = typeof patch === "function" ? patch(currentItem, index) : __spreadValues(__spreadValues({}, currentItem), patch);
    if (nextItem === currentItem) {
      return false;
    }
    const nextItems = [...this.items];
    nextItems[index] = nextItem;
    this.items = this.orderSortableItems(nextItems);
    this.cacheDirectSourceItems();
    this.syncGroups();
    this.finiteStepper.syncBounds();
    this.emitState();
    this.cdr.markForCheck();
    return true;
  }
  patchConvertedVisibleItem(source, options = {}) {
    const query = this.currentQuery();
    const converter = this.resolvedConverter(query);
    if (!converter) {
      return false;
    }
    const nextItem = converter.convert(source, this.converterOptions(query));
    const normalizedIdentity = `${smartListItemKeyFromItem(nextItem) ?? ""}`.trim();
    const predicate = options.predicate ?? (normalizedIdentity ? (item, index) => `${this.cacheTrackKey(item, index)}`.trim() === normalizedIdentity : null);
    if (!predicate) {
      return false;
    }
    if (!this.patchVisibleItem(predicate, () => nextItem)) {
      return false;
    }
    this.cacheVisibleSourceItem(source, nextItem);
    this.emitRefresh();
    return true;
  }
  upsertConvertedVisibleItem(source, options = {}) {
    const query = this.currentQuery();
    const converter = this.resolvedConverter(query);
    if (!converter) {
      return false;
    }
    const nextItem = converter.convert(source, this.converterOptions(query));
    const normalizedIdentity = `${smartListItemKeyFromItem(nextItem) ?? ""}`.trim();
    const predicate = options.predicate ?? (normalizedIdentity ? (item, index) => `${this.cacheTrackKey(item, index)}`.trim() === normalizedIdentity : null);
    if (predicate && this.patchVisibleItem(predicate, () => nextItem)) {
      this.cacheVisibleSourceItem(source, nextItem);
      this.emitRefresh();
      return true;
    }
    if (!this.reinsertVisibleItem(nextItem, {
      totalDelta: options.totalDelta,
      loadedRange: options.loadedRange
    })) {
      return false;
    }
    this.cacheVisibleSourceItem(source, nextItem);
    this.emitRefresh();
    return true;
  }
  removeVisibleItems(predicate, options = {}) {
    if (this.currentViewMode !== "list") {
      return false;
    }
    const removedIdentities = [];
    const nextItems = this.items.filter((item, index) => {
      const shouldRemove = predicate(item, index);
      if (shouldRemove) {
        const identity = `${this.cacheTrackKey(item, index)}`.trim();
        if (identity) {
          removedIdentities.push(identity);
        }
      }
      return !shouldRemove;
    });
    if (nextItems.length === this.items.length) {
      return false;
    }
    for (const identity of removedIdentities) {
      this.sourceItemByIdentity.delete(identity);
    }
    this.replaceVisibleItems(nextItems, {
      total: Math.max(nextItems.length, this.total + (options.totalDelta ?? -1))
    });
    this.emitRefresh();
    return true;
  }
  removeVisibleItemByIdentity(identity, options = {}) {
    const normalizedIdentity = `${identity}`.trim();
    return this.removeVisibleItems((item, index) => `${this.cacheTrackKey(item, index)}`.trim() === normalizedIdentity, options);
  }
  reinsertVisibleItem(item, options = {}) {
    if (this.currentViewMode !== "list") {
      return false;
    }
    const identity = `${this.cacheTrackKey(item, this.items.length)}`.trim();
    if (this.items.some((currentItem, index) => `${this.cacheTrackKey(currentItem, index)}`.trim() === identity)) {
      return false;
    }
    const insertionIndex = this.visibleInsertionIndex(item);
    const insertsAfterLoadedTail = insertionIndex >= this.items.length;
    const loadedShortPage = this.items.length < this.resolveEffectivePageSize();
    if (options.loadedRange === "before-or-within" && this.items.length > 0 && this.hasMore && !loadedShortPage && insertsAfterLoadedTail && !this.visibleGroupAlreadyLoaded(item)) {
      return false;
    }
    const nextItems = [...this.items];
    nextItems.splice(insertionIndex, 0, item);
    this.replaceVisibleItems(nextItems, {
      total: Math.max(this.items.length + 1, this.total + (options.totalDelta ?? 1))
    });
    return true;
  }
  visibleInsertionIndex(item, items = this.items) {
    if (!this.sortableConfig()) {
      return items.length;
    }
    const query = this.currentQuery();
    const itemSortKey = this.localSortKeyForItem(item, query, items.length);
    const index = items.findIndex((currentItem, currentIndex) => compareSmartListLocalSortKeys(itemSortKey, this.localSortKeyForItem(currentItem, query, currentIndex)) < 0);
    return index >= 0 ? index : items.length;
  }
  visibleGroupAlreadyLoaded(item) {
    const groupBy = this.config.groupBy;
    if (!groupBy || this.items.length === 0) {
      return false;
    }
    const query = this.currentQuery();
    const label = groupBy(item, query);
    return this.items.some((currentItem) => groupBy(currentItem, query) === label);
  }
  cancelPendingAnchorPreload() {
    this.stepperPreloadAbortController?.abort();
    this.stepperPreloadAbortController = null;
    this.stepper.clearPreloadingPage();
  }
  async preloadAnchorPage(anchor, query) {
    const loader = this.resolveLoadPage();
    if (!loader || !this.isPageMode()) {
      return;
    }
    const pageKey = this.stepper.pageKey(anchor);
    if (this.stepper.hasPageData(pageKey) || this.stepper.pendingPageKey === pageKey) {
      return;
    }
    if (this.stepper.preloadingPageKey === pageKey) {
      return;
    }
    if (this.stepper.preloadingPageKey) {
      this.stepperPreloadAbortController?.abort();
      this.stepperPreloadAbortController = null;
      this.stepper.clearPreloadingPage();
    }
    const abortController = typeof AbortController === "undefined" ? null : new AbortController();
    this.stepperPreloadAbortController = abortController;
    this.stepper.beginPreloadingPage(anchor);
    try {
      const result = await firstValueFrom(loader(query, { signal: abortController?.signal }));
      if (this.stepper.preloadingPageKey !== pageKey || abortController?.signal.aborted) {
        return;
      }
      this.applyAnchorPageResult(anchor, result, { deferRender: true });
    } catch (error) {
      if (this.stepper.preloadingPageKey !== pageKey || abortController?.signal.aborted) {
        return;
      }
      if (!this.isAbortError(error)) {
        this.stepper.setEmptyPage(anchor, { deferRender: true });
      }
    } finally {
      if (this.stepper.preloadingPageKey === pageKey) {
        this.stepperPreloadAbortController = null;
        this.stepper.clearPreloadingPage(pageKey);
      }
      if (!this.stepper.scrollInProgress && this.stepper.renderDeferred) {
        this.flushDeferredPageRender();
        this.emitState();
        this.cdr.markForCheck();
      }
    }
  }
  flushDeferredPageRender(scrollElement) {
    if (!this.stepper.renderDeferred) {
      return;
    }
    this.stepper.applySnapshot({ flushDeferred: true });
    this.applyPageSurfaceState(scrollElement);
  }
  static \u0275fac = function SmartListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SmartListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SmartListComponent, selectors: [["app-smart-list"]], viewQuery: function SmartListComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5, ElementRef)(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.scrollHostRef = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.paginationMenuOutlet = _t.first);
    }
  }, hostBindings: function SmartListComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function SmartListComponent_resize_HostBindingHandler() {
        return ctx.onViewportResize();
      }, \u0275\u0275resolveWindow);
    }
  }, inputs: { config: "config", loadPage: "loadPage", loaders: "loaders", itemTemplate: "itemTemplate", fullscreenItemTemplate: "fullscreenItemTemplate", query: "query", view: "view", presentation: "presentation", sort: "sort", direction: "direction", filters: "filters", groupBy: "groupBy" }, outputs: { stateChange: "stateChange", viewChange: "viewChange", itemSelect: "itemSelect", menuItemSelect: "menuItemSelect", refresh: "refresh" }, features: [\u0275\u0275ProvidersFeature([AppMenuDispatcher]), \u0275\u0275NgOnChangesFeature], decls: 15, vars: 19, consts: [["paginationMenuOutlet", ""], ["fullscreenEmptyState", ""], ["emptyState", ""], ["scrollHost", ""], ["fullscreenSurface", ""], [1, "smart-list__surface"], [1, "smart-list__stage"], [1, "smart-list__stage-list-shell"], [1, "smart-list__page-shell", 3, "smart-list__page-shell--presentation-list", "smart-list__page-shell--presentation-fullscreen"], [1, "smart-list__stage-overlay", 3, "smart-list__stage-overlay--with-rating-bar"], [1, "smart-list__header-progress-shell"], [1, "smart-list__pagination-arrows"], ["aria-hidden", "true", 1, "smart-list__horizontal-dots"], [3, "itemSelect", "menu", "items"], [1, "smart-list__page-shell"], [1, "smart-list", "smart-list--page", 3, "scroll", "scrollend", "touchstart", "touchend", "touchcancel", "model"], ["smart-list-page-card-header", "", 1, "smart-list__sticky", "smart-list__sticky--page", 3, "ngClass"], [1, "smart-list__sticky-label"], [1, "smart-list__sticky-actions"], ["type", "button", "aria-label", "Previous period", 1, "smart-list__sticky-action-btn", 3, "click"], ["type", "button", "aria-label", "Next period", 1, "smart-list__sticky-action-btn", 3, "click"], [1, "smart-list__sticky", "smart-list__sticky--list-header", 3, "ngClass"], [1, "smart-list", 3, "wheel", "scroll", "scrollend", "touchstart", "touchend", "touchcancel", "ngClass"], [1, "smart-list__sticky", 3, "smart-list__sticky--list-header", "ngClass"], [3, "ngTemplateOutlet"], ["aria-hidden", "true", 1, "smart-list__footer-spacer", 3, "height"], ["type", "button", "aria-label", "Previous page", 1, "smart-list__sticky-action-btn", 3, "click", "disabled"], ["type", "button", "aria-label", "Next page", 1, "smart-list__sticky-action-btn", 3, "click", "disabled"], [1, "smart-list__sticky", 3, "ngClass"], [1, "smart-list__group-marker", 3, "ngClass", "z-index"], [1, "smart-list__group-marker", 3, "ngClass"], ["aria-hidden", "true", 1, "smart-list__prepend-restore-spacer", 3, "id", "height"], [1, "smart-list__item-shell"], [3, "ngTemplateOutlet", "ngTemplateOutletContext", "ngTemplateOutletInjector"], ["aria-hidden", "true", 1, "smart-list__prepend-restore-spacer", 3, "id"], ["aria-hidden", "true", 1, "smart-list__footer-spacer"], [1, "smart-list__stage-overlay"], [1, "smart-list__fullscreen-surface"], ["aria-hidden", "true", 1, "smart-list__fullscreen-card", "smart-list__fullscreen-card--slot-2", "smart-list__fullscreen-card--preview"], ["aria-hidden", "true", 1, "smart-list__fullscreen-card", "smart-list__fullscreen-card--slot-1", "smart-list__fullscreen-card--preview"], [1, "smart-list__fullscreen-card", "smart-list__fullscreen-card--active", 3, "animationend"], [1, "smart-list__fullscreen-card-content"], [3, "ngTemplateOutlet", "ngTemplateOutletInjector", "ngTemplateOutletContext"], ["kind", "bar", 3, "placement", "tone", "state", "position"], ["type", "button", "aria-label", "Previous item", 1, "smart-list__pagination-arrow", "smart-list__pagination-arrow--prev", "motion-static", 3, "click", "disabled"], ["type", "button", "aria-label", "Next item", 1, "smart-list__pagination-arrow", "smart-list__pagination-arrow--next", "motion-static", 3, "click", "disabled"], [1, "smart-list__horizontal-dot", 3, "is-active"], [1, "smart-list__horizontal-dot"], [1, "smart-list__fullscreen-empty"], [1, "smart-list__empty"]], template: function SmartListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 5)(1, "div", 6)(2, "div", 7);
      \u0275\u0275conditionalCreate(3, SmartListComponent_Conditional_3_Template, 4, 20, "div", 8)(4, SmartListComponent_Conditional_4_Template, 7, 49);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, SmartListComponent_Conditional_5_Template, 2, 3, "div", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, SmartListComponent_Conditional_6_Template, 2, 4, "div", 10);
      \u0275\u0275conditionalCreate(7, SmartListComponent_Conditional_7_Template, 7, 2, "div", 11);
      \u0275\u0275conditionalCreate(8, SmartListComponent_Conditional_8_Template, 3, 0, "div", 12);
      \u0275\u0275elementStart(9, "app-menu-outlet", 13, 0);
      \u0275\u0275listener("itemSelect", function SmartListComponent_Template_app_menu_outlet_itemSelect_9_listener($event) {
        return ctx.onMenuOutletItemSelect($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(11, SmartListComponent_ng_template_11_Template, 1, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(13, SmartListComponent_ng_template_13_Template, 1, 1, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      \u0275\u0275classProp("smart-list__surface--horizontal", ctx.isHorizontalList())("smart-list__surface--timeline", ctx.isTimelineMode())("smart-list__surface--compact-horizontal", ctx.shouldUseCompactHorizontal())("smart-list__surface--fullscreen", ctx.resolvedPresentation() === "fullscreen")("smart-list__surface--fullscreen-with-rating-bar", ctx.resolvedPresentation() === "fullscreen" && ctx.shouldRenderPaginationRatingBar());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("is-occluded", ctx.shouldRenderHostedFullscreenOverlay());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isPageMode() ? 3 : 4);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.shouldRenderHostedFullscreenOverlay() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldRenderHostedIndicator() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldRenderPaginationArrows() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldRenderHorizontalPaginationDots() ? 8 : -1);
      const ratingPaginationMenu_r20 = ctx.paginationRatingMenu();
      \u0275\u0275advance();
      \u0275\u0275property("menu", ratingPaginationMenu_r20)("items", ratingPaginationMenu_r20 ? ctx.paginationRatingMenuItems() : ctx.dispatchedMenuItems());
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgTemplateOutlet,
    MatIconModule,
    MatIcon,
    IndicatorComponent,
    AppMenuOutletComponent,
    CalendarCardComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n  position: relative;\n}\n.smart-list__surface[_ngcontent-%COMP%] {\n  --smart-list-pagination-arrow-size: 2.2rem;\n  --smart-list-pagination-arrow-inline-offset: 0.6rem;\n  --smart-list-fullscreen-top-offset: 0px;\n  --smart-list-fullscreen-bottom-offset: 0px;\n  position: relative;\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__surface--fullscreen[_ngcontent-%COMP%] {\n  --smart-list-fullscreen-top-offset: 0.42rem;\n}\n.smart-list__surface--fullscreen-with-rating-bar[_ngcontent-%COMP%] {\n  --smart-list-fullscreen-bottom-offset: calc(5.25rem + env(safe-area-inset-bottom));\n}\n@media (min-width: 761px) {\n  .smart-list__surface--fullscreen[_ngcontent-%COMP%]:has(app-pair-card[data-card-presentation=fullscreen]) {\n    --smart-list-pagination-arrow-inline-offset: 0.16rem;\n  }\n}\n.smart-list__surface--compact-horizontal[_ngcontent-%COMP%] {\n  height: 100%;\n}\n.smart-list__stage[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n  top: 5px;\n}\n.smart-list__stage-list-shell[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__stage-list-shell.is-occluded[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.smart-list__stage-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  min-height: 0;\n  pointer-events: none;\n}\n.smart-list__fullscreen-surface[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr);\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n  padding: var(--smart-list-fullscreen-top-offset) 0 3.4rem;\n  overflow: hidden;\n  pointer-events: none;\n  perspective: 1800px;\n}\n.smart-list__fullscreen-card[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0 0 var(--smart-list-fullscreen-bottom-offset) 0;\n  margin: 0;\n  pointer-events: none;\n  transform-origin: center right;\n  transform-style: preserve-3d;\n  backface-visibility: hidden;\n  will-change: transform, opacity;\n}\n.smart-list__fullscreen-card--active[_ngcontent-%COMP%] {\n  z-index: 3;\n}\n.smart-list__fullscreen-card-content[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n[_nghost-%COMP%]     .smart-list__fullscreen-card-content > * {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__fullscreen-card--active[_ngcontent-%COMP%]   .smart-list__fullscreen-card-content[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n.smart-list__fullscreen-card--preview[_ngcontent-%COMP%]   .smart-list__fullscreen-card-content[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.smart-list__fullscreen-card--slot-1[_ngcontent-%COMP%] {\n  z-index: 2;\n}\n.smart-list__fullscreen-card--slot-2[_ngcontent-%COMP%] {\n  z-index: 1;\n}\n.smart-list__fullscreen-card--curling[_ngcontent-%COMP%] {\n  z-index: 4;\n  animation: _ngcontent-%COMP%_smart-list-fullscreen-page-curl 420ms cubic-bezier(0.18, 0.64, 0.24, 1) forwards;\n}\n.smart-list__fullscreen-card--curling[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.smart-list__fullscreen-card--curling-backward[_ngcontent-%COMP%] {\n  transform-origin: center left;\n  animation-name: _ngcontent-%COMP%_smart-list-fullscreen-page-curl-backward;\n}\n.smart-list__fullscreen-empty[_ngcontent-%COMP%] {\n  align-self: stretch;\n  justify-self: stretch;\n  display: grid;\n  align-content: center;\n  justify-items: center;\n  gap: 0.42rem;\n  height: 100%;\n  min-height: 0;\n  padding: 1rem;\n  border: 1px dashed var(--deployment-card-border, rgba(67, 96, 134, 0.22));\n  border-radius: 14px;\n  background: var(--deployment-card-background, linear-gradient(180deg, rgba(250, 252, 255, 0.96) 0%, rgba(241, 246, 255, 0.92) 100%));\n  color: var(--deployment-text-main, rgba(35, 56, 84, 0.82));\n  text-align: center;\n}\n.smart-list__fullscreen-empty[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.smart-list__fullscreen-empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.smart-list__fullscreen-empty[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 800;\n}\n.smart-list__fullscreen-empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--deployment-text-muted, rgba(56, 77, 104, 0.74));\n}\n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%], \n.smart-list--list.smart-list--stack[_ngcontent-%COMP%] {\n  --smart-list-card-snap-gap: 0.34rem;\n  scroll-padding-top: calc(var(--smart-list-sticky-header-height, var(--smart-list-scroll-padding-top, 2.6rem)) + var(--smart-list-card-snap-gap));\n  scroll-behavior: smooth;\n  transition: padding-bottom 180ms ease;\n  -webkit-overflow-scrolling: touch;\n  touch-action: pan-y;\n}\n.smart-list--list.smart-list--thread[_ngcontent-%COMP%] {\n  display: block;\n  gap: 0;\n  padding-right: 0.12rem;\n  scroll-behavior: auto;\n  overflow-anchor: none;\n}\n.smart-list--list.smart-list--thread.smart-list--flow-reverse[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column-reverse;\n  align-items: stretch;\n  overflow-anchor: none;\n}\n.smart-list--list.smart-list--card-grid.smart-list--snap-proximity[_ngcontent-%COMP%], \n.smart-list--list.smart-list--stack.smart-list--snap-proximity[_ngcontent-%COMP%] {\n  scroll-snap-type: y proximity;\n}\n.smart-list--list.smart-list--card-grid.smart-list--snap-mandatory[_ngcontent-%COMP%], \n.smart-list--list.smart-list--stack.smart-list--snap-mandatory[_ngcontent-%COMP%] {\n  scroll-snap-type: y mandatory;\n}\n.smart-list--list.smart-list--card-grid.smart-list--snap-none[_ngcontent-%COMP%], \n.smart-list--list.smart-list--stack.smart-list--snap-none[_ngcontent-%COMP%] {\n  scroll-snap-type: none;\n}\n.smart-list--list.smart-list--snap-none[_ngcontent-%COMP%]   .smart-list__item-shell[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .smart-list--list.smart-list--snap-none .activities-row-item, \n[_nghost-%COMP%]     .smart-list--list.smart-list--snap-none .asset-item-card, \n[_nghost-%COMP%]     .smart-list--list.smart-list--snap-none .activities-card, \n[_nghost-%COMP%]     .smart-list--list.smart-list--snap-none .event-explore-card, \n[_nghost-%COMP%]     .smart-list--list.smart-list--snap-none .experience-item-card {\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__group-marker.chat-thread-group-marker[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 3;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 6.5rem;\n  box-sizing: border-box;\n  margin: 0.08rem auto 0.3rem;\n  border: 1px solid rgba(43, 74, 116, 0.2);\n  border-radius: 999px;\n  background: rgb(255, 255, 255);\n  color: rgba(36, 64, 99, 0.88);\n  font-size: 0.66rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  white-space: nowrap;\n}\n.smart-list__prepend-restore-spacer[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-height: 0;\n  pointer-events: none;\n  visibility: hidden;\n  overflow: hidden;\n  overflow-anchor: none;\n}\n.smart-list__item-shell[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n  overflow-anchor: none;\n  scroll-snap-align: start;\n}\n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__item-shell[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__item-shell[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__sticky[_ngcontent-%COMP%], \n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__group-marker[_ngcontent-%COMP%], \n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__footer-spacer[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n}\n.smart-list__footer-spacer[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-height: 0;\n  pointer-events: none;\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__header-progress-shell[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 34;\n  pointer-events: none;\n}\n.smart-list__pagination-arrows[_ngcontent-%COMP%] {\n  --smart-list-arrow-motion-duration: 0.16s;\n  --smart-list-arrow-motion-ease: cubic-bezier(0.22, 0.61, 0.36, 1);\n  --smart-list-arrow-hover-brightness: 1.02;\n  --smart-list-arrow-press-brightness: 0.96;\n  position: absolute;\n  inset: 0;\n  z-index: 34;\n  pointer-events: none;\n}\n.smart-list__surface--horizontal[_ngcontent-%COMP%] {\n  --smart-list-pagination-arrow-inline-offset: -1.1rem;\n}\n.smart-list__surface--horizontal[_ngcontent-%COMP%]   .smart-list__pagination-arrows[_ngcontent-%COMP%] {\n  display: none;\n}\n.smart-list__surface--timeline[_ngcontent-%COMP%]   .smart-list__pagination-arrows[_ngcontent-%COMP%] {\n  display: none;\n}\n@keyframes _ngcontent-%COMP%_smart-list-pagination-arrow-touch-feedback {\n  0% {\n    transform: translateY(-50%);\n    filter: brightness(1);\n    border-color: rgba(43, 73, 116, 0.16);\n    background: rgba(255, 255, 255, 0.96);\n    box-shadow: 0 8px 22px rgba(13, 24, 40, 0.16);\n  }\n  45% {\n    transform: translateY(-50%);\n    filter: brightness(var(--smart-list-arrow-press-brightness));\n    border-color: rgba(53, 86, 132, 0.28);\n    background: rgba(246, 250, 255, 0.99);\n    box-shadow:\n      0 12px 28px rgba(13, 24, 40, 0.2),\n      0 0 0 1px rgba(255, 255, 255, 0.48),\n      inset 0 1px 0 rgba(255, 255, 255, 0.46);\n  }\n  100% {\n    transform: translateY(-50%);\n    filter: brightness(1);\n    border-color: rgba(43, 73, 116, 0.16);\n    background: rgba(255, 255, 255, 0.96);\n    box-shadow: 0 8px 22px rgba(13, 24, 40, 0.16);\n  }\n}\n.smart-list__pagination-arrow[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--smart-list-pagination-arrow-size);\n  height: var(--smart-list-pagination-arrow-size);\n  border: 1px solid rgba(43, 73, 116, 0.16);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.96);\n  color: #27456f;\n  box-shadow: 0 8px 22px rgba(13, 24, 40, 0.16);\n  pointer-events: auto;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    filter var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    box-shadow var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    background-color var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    border-color var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    color var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease);\n}\n@media (hover: hover) and (pointer: fine) {\n  .smart-list__pagination-arrow[_ngcontent-%COMP%]:not(:disabled):hover {\n    transform: translateY(-50%);\n    filter: brightness(var(--smart-list-arrow-hover-brightness));\n    border-color: rgba(53, 86, 132, 0.24);\n    background: rgba(251, 253, 255, 0.99);\n    box-shadow: 0 12px 28px rgba(13, 24, 40, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.52);\n  }\n  .smart-list__pagination-arrow[_ngcontent-%COMP%]:not(:disabled):active {\n    transform: translateY(-50%);\n    filter: brightness(var(--smart-list-arrow-press-brightness));\n    border-color: rgba(59, 93, 140, 0.3);\n    background: rgba(245, 249, 255, 0.99);\n    box-shadow:\n      0 7px 18px rgba(13, 24, 40, 0.17),\n      0 0 0 1px rgba(255, 255, 255, 0.44),\n      inset 0 1px 0 rgba(255, 255, 255, 0.4);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  .smart-list__pagination-arrow[_ngcontent-%COMP%]:not(:disabled):active {\n    animation: _ngcontent-%COMP%_smart-list-pagination-arrow-touch-feedback 0.2s ease;\n  }\n}\n.smart-list__pagination-arrow[_ngcontent-%COMP%]:disabled {\n  display: none;\n  cursor: default;\n}\n.smart-list__pagination-arrow[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.smart-list__pagination-arrow--prev[_ngcontent-%COMP%] {\n  left: var(--smart-list-pagination-arrow-inline-offset);\n}\n.smart-list__pagination-arrow--next[_ngcontent-%COMP%] {\n  right: var(--smart-list-pagination-arrow-inline-offset);\n}\n.smart-list__surface--compact-horizontal[_ngcontent-%COMP%]   .smart-list__pagination-arrows[_ngcontent-%COMP%] {\n  display: block;\n}\n.smart-list__horizontal-dots[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: var(--smart-list-horizontal-dots-bottom, 0.42rem);\n  z-index: 35;\n  display: none;\n  align-items: center;\n  justify-content: center;\n  gap: 0.36rem;\n  pointer-events: none;\n}\n.smart-list__horizontal-dot[_ngcontent-%COMP%] {\n  display: block;\n  width: 0.48rem;\n  height: 0.48rem;\n  border: 1px solid rgba(64, 105, 157, 0.2);\n  border-radius: 999px;\n  background: #d7e1ef;\n  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.7);\n}\n.smart-list__horizontal-dot.is-active[_ngcontent-%COMP%] {\n  width: 1.28rem;\n  border-color: rgba(129, 88, 236, 0.38);\n  background:\n    linear-gradient(\n      90deg,\n      #7357ee 0%,\n      #f54fbc 100%);\n  box-shadow: 0 4px 12px rgba(125, 86, 234, 0.28);\n}\n.smart-list__surface--compact-horizontal[_ngcontent-%COMP%]   .smart-list__horizontal-dots[_ngcontent-%COMP%] {\n  display: flex;\n}\n@keyframes _ngcontent-%COMP%_smart-list-fullscreen-page-curl {\n  0% {\n    transform: perspective(1800px) translate3d(0, 0, 0) rotateY(0deg) scale3d(1, 1, 1);\n    opacity: 1;\n  }\n  24% {\n    transform: perspective(1800px) translate3d(-4%, 0, 10px) rotateY(-14deg) scale3d(0.998, 1, 1);\n    opacity: 0.96;\n  }\n  62% {\n    transform: perspective(1800px) translate3d(-18%, 0, 24px) rotateY(-42deg) scale3d(0.982, 1, 1);\n    opacity: 0.92;\n  }\n  100% {\n    transform: perspective(1800px) translate3d(-118%, 0, 0) rotateY(-84deg) scale3d(0.94, 1, 1);\n    opacity: 0;\n  }\n}\n@keyframes _ngcontent-%COMP%_smart-list-fullscreen-page-curl-backward {\n  0% {\n    transform: perspective(1800px) translate3d(0, 0, 0) rotateY(0deg) scale3d(1, 1, 1);\n    opacity: 1;\n  }\n  24% {\n    transform: perspective(1800px) translate3d(4%, 0, 10px) rotateY(14deg) scale3d(0.998, 1, 1);\n    opacity: 0.96;\n  }\n  62% {\n    transform: perspective(1800px) translate3d(18%, 0, 24px) rotateY(42deg) scale3d(0.982, 1, 1);\n    opacity: 0.92;\n  }\n  100% {\n    transform: perspective(1800px) translate3d(118%, 0, 0) rotateY(84deg) scale3d(0.94, 1, 1);\n    opacity: 0;\n  }\n}\n[_nghost-%COMP%]     .smart-list--list.smart-list--card-grid .activities-row-item, \n[_nghost-%COMP%]     .smart-list--list.smart-list--card-grid .asset-item-card, \n[_nghost-%COMP%]     .smart-list--list.smart-list--card-grid .activities-card, \n[_nghost-%COMP%]     .smart-list--list.smart-list--card-grid .event-explore-card, \n[_nghost-%COMP%]     .smart-list--list.smart-list--card-grid .experience-item-card {\n  width: 100%;\n  max-width: 100%;\n  scroll-snap-align: start;\n  scroll-margin-top: 0;\n  scroll-snap-stop: normal;\n}\n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%] {\n  --smart-list-card-snap-gap: 0.6rem;\n  display: grid;\n  grid-template-columns: repeat(var(--smart-list-desktop-columns, 3), minmax(0, 1fr));\n  align-content: start;\n  justify-items: stretch;\n  column-gap: 0.34rem;\n  row-gap: 0.6rem;\n  padding-bottom: 0.52rem;\n}\n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__sticky[_ngcontent-%COMP%], \n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__group-marker[_ngcontent-%COMP%], \n.smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__footer-spacer[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%] {\n  --smart-list-horizontal-gap: 0.78rem;\n  --smart-list-horizontal-end-inset: 0.58rem;\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  gap: var(--smart-list-horizontal-gap);\n  overflow-x: auto;\n  overflow-y: visible;\n  padding: 0;\n  padding-block-end: 0.52rem;\n  padding-inline-end: var(--smart-list-horizontal-end-inset);\n  scroll-padding-left: 0;\n  scroll-padding-right: var(--smart-list-horizontal-end-inset);\n  scrollbar-width: thin;\n  scrollbar-color: rgba(83, 111, 154, 0.38) rgba(222, 230, 242, 0.72);\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-1[_ngcontent-%COMP%] {\n  --smart-list-horizontal-item-basis: 100%;\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-2[_ngcontent-%COMP%] {\n  --smart-list-horizontal-item-basis: calc((100% - var(--smart-list-horizontal-gap)) / 2);\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-3[_ngcontent-%COMP%] {\n  --smart-list-horizontal-item-basis: calc((100% - var(--smart-list-horizontal-gap) - var(--smart-list-horizontal-gap)) / 3);\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-4[_ngcontent-%COMP%] {\n  --smart-list-horizontal-item-basis: calc((100% - var(--smart-list-horizontal-gap) - var(--smart-list-horizontal-gap) - var(--smart-list-horizontal-gap)) / 4);\n}\n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]::-webkit-scrollbar {\n  height: 0.5rem;\n}\n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  border-radius: 999px;\n  background: rgba(222, 230, 242, 0.72);\n}\n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background: rgba(83, 111, 154, 0.38);\n}\n.smart-list--list.smart-list--horizontal.smart-list--snap-proximity[_ngcontent-%COMP%] {\n  scroll-snap-type: x proximity;\n}\n.smart-list--list.smart-list--horizontal.smart-list--snap-mandatory[_ngcontent-%COMP%] {\n  scroll-snap-type: x mandatory;\n}\n.smart-list--list.smart-list--horizontal.smart-list--snap-none[_ngcontent-%COMP%] {\n  scroll-snap-type: none;\n}\n.smart-list--list.smart-list--horizontal.smart-list--compact-horizontal[_ngcontent-%COMP%] {\n  --smart-list-horizontal-item-basis: 100%;\n  --smart-list-horizontal-end-inset: 0;\n  height: 100%;\n  min-height: 0;\n  padding-inline-end: 0;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.smart-list--list.smart-list--horizontal.smart-list--compact-horizontal[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n.smart-list--list.smart-list--horizontal.smart-list--compact-horizontal[_ngcontent-%COMP%]   .smart-list__item-shell[_ngcontent-%COMP%] {\n  min-height: 0;\n}\n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]   .smart-list__item-shell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  flex: 0 0 var(--smart-list-horizontal-item-basis, min(21rem, 78vw));\n  width: auto;\n  align-self: stretch;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n}\n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]   .smart-list__item-shell[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  align-self: stretch;\n}\n[_nghost-%COMP%]     .smart-list--list.smart-list--horizontal .ui-info-card {\n  touch-action: pan-x pan-y;\n}\n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]   .smart-list__sticky[_ngcontent-%COMP%], \n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]   .smart-list__group-marker[_ngcontent-%COMP%], \n.smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]   .smart-list__footer-spacer[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  width: 100%;\n}\n.smart-list__surface--horizontal[_ngcontent-%COMP%]   .smart-list__sticky--list-header[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 100%;\n  box-sizing: border-box;\n  margin-bottom: 0.42rem;\n}\n.smart-list--list.experience-card-list[_ngcontent-%COMP%] {\n  padding-bottom: 0.35rem;\n}\n.smart-list--list.assets-card-list[_ngcontent-%COMP%] {\n  gap: 0.68rem;\n}\n.smart-list--list.chat-thread-list[_ngcontent-%COMP%] {\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-y: contain;\n  touch-action: pan-y;\n}\n.smart-list--list.notification-center-smart-list[_ngcontent-%COMP%] {\n  padding-right: 0.18rem;\n  scrollbar-gutter: stable;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(96, 74, 154, 0.58) rgba(226, 232, 240, 0.88);\n}\n.smart-list--list.notification-center-smart-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 10px;\n}\n.smart-list--list.notification-center-smart-list[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  border-radius: 999px;\n  background: rgba(226, 232, 240, 0.88);\n}\n.smart-list--list.notification-center-smart-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  border: 2px solid rgba(226, 232, 240, 0.88);\n  border-radius: 999px;\n  background: rgba(96, 74, 154, 0.58);\n}\n.smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1;\n  min-height: 0;\n  flex-direction: column;\n  gap: 0.34rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.smart-list--presentation-fullscreen[_ngcontent-%COMP%] {\n  height: 100%;\n}\n.smart-list__page-shell[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n  flex-direction: column;\n  gap: 0.4rem;\n  overflow: hidden;\n}\n.smart-list__page-shell--presentation-fullscreen[_ngcontent-%COMP%] {\n  height: 100%;\n}\n.smart-list--page[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  align-items: stretch;\n  scroll-snap-type: x mandatory;\n  scroll-behavior: smooth;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n  touch-action: pan-x pan-y;\n  padding-bottom: calc(0.8rem + env(safe-area-inset-bottom));\n}\n.smart-list--page.smart-list--week[_ngcontent-%COMP%] {\n  overflow-y: auto;\n  touch-action: pan-x pan-y;\n  overscroll-behavior-y: contain;\n  padding-bottom: 0;\n}\n.smart-list--page.smart-list--month[_ngcontent-%COMP%] {\n  overflow-y: clip;\n}\n.smart-list--page.smart-list--page-touching[_ngcontent-%COMP%] {\n  scroll-snap-type: none;\n  scroll-behavior: auto;\n}\n.smart-list--page[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n.smart-list__sticky[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 25;\n  overflow-anchor: none;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f3f8ff 100%);\n  color: #203b5d;\n  font-size: 0.76rem;\n  font-weight: 800;\n  padding: 0.35rem 0.55rem;\n  margin-bottom: 0.06rem;\n}\n.smart-list__sticky--page[_ngcontent-%COMP%] {\n  left: 0;\n}\n.smart-list__sticky--page[_ngcontent-%COMP%], \n.smart-list__sticky--list-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.45rem;\n  width: 100%;\n  box-sizing: border-box;\n}\n.smart-list__sticky--slot-section[_ngcontent-%COMP%] {\n  position: relative;\n  top: auto;\n  z-index: 1;\n  border-color: var(--smart-list-slot-header-border, rgba(146, 108, 49, 0.24));\n  background: var(--smart-list-slot-header-bg, linear-gradient(135deg, rgba(255, 248, 235, 0.98) 0%, rgba(239, 247, 255, 0.92) 100%));\n  color: var(--smart-list-slot-header-color, #6e4a12);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82), 0 6px 16px var(--smart-list-slot-header-shadow, rgba(115, 82, 33, 0.08));\n}\n.smart-list__sticky--slot-section[_ngcontent-%COMP%]   .smart-list__sticky-action-btn[_ngcontent-%COMP%] {\n  border-color: var(--smart-list-slot-header-action-border, rgba(146, 108, 49, 0.24));\n  background: var(--smart-list-slot-header-action-bg, rgba(255, 252, 246, 0.94));\n  color: var(--smart-list-slot-header-action-color, #7a5517);\n}\n.smart-list__sticky-label[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.smart-list__sticky-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.22rem;\n  flex: 0 0 auto;\n}\n.smart-list__sticky-action-btn[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  margin: 0;\n  line-height: 0;\n  border-radius: 999px;\n  border: 1px solid rgba(34, 58, 91, 0.24);\n  background: rgba(255, 255, 255, 0.9);\n  color: #244267;\n  display: inline-grid;\n  place-items: center;\n  cursor: pointer;\n}\n.smart-list__sticky-action-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.38;\n  cursor: default;\n  pointer-events: none;\n}\n.smart-list__sticky-action-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  display: block;\n  margin: 0;\n}\n.smart-list__group-marker[_ngcontent-%COMP%] {\n  z-index: 1;\n  scroll-snap-align: none;\n  overflow-anchor: none;\n  border: 1px solid rgba(39, 60, 92, 0.16);\n  border-radius: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f3f8ff 100%);\n  color: rgba(31, 58, 92, 0.9);\n  font-size: 0.78rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  padding: 0.32rem 0.58rem;\n}\n.smart-list__empty[_ngcontent-%COMP%] {\n  margin: auto 0;\n  overflow-anchor: none;\n  border: 1px dashed rgba(37, 54, 82, 0.16);\n  border-radius: 18px;\n  background: rgba(248, 250, 253, 0.92);\n  padding: 1.15rem 1rem;\n  text-align: center;\n}\n.smart-list__empty[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #18314d;\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n.smart-list__empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.45rem 0 0;\n  color: rgba(27, 45, 69, 0.74);\n  font-size: 0.82rem;\n  line-height: 1.45;\n}\n@media (max-width: 760px) {\n  .smart-list__surface--fullscreen-with-rating-bar[_ngcontent-%COMP%] {\n    --smart-list-fullscreen-bottom-offset: calc(5.25rem + env(safe-area-inset-bottom));\n  }\n  .smart-list--page.smart-list--month[_ngcontent-%COMP%] {\n    padding-bottom: 0;\n    overflow-y: hidden;\n  }\n  .smart-list--list.smart-list--card-grid[_ngcontent-%COMP%] {\n    --smart-list-card-snap-gap: 0.34rem;\n    display: flex;\n    flex-direction: column;\n    gap: 0.34rem;\n    padding-bottom: 0;\n  }\n  .smart-list--list.smart-list--card-grid.smart-list--mobile-columns[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: repeat(var(--smart-list-mobile-columns), minmax(0, 1fr));\n    align-content: start;\n    gap: 0.45rem;\n    padding-bottom: 0.6rem;\n  }\n  .smart-list--list.smart-list--horizontal[_ngcontent-%COMP%] {\n    --smart-list-horizontal-item-basis: 100%;\n    --smart-list-horizontal-end-inset: 0;\n    flex-direction: row;\n    gap: 0.72rem;\n    padding-bottom: 2rem;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n  }\n  .smart-list__surface--horizontal[_ngcontent-%COMP%] {\n    margin-inline: var(--smart-list-horizontal-mobile-surface-margin, 0.72rem);\n  }\n  .smart-list__surface--fullscreen[_ngcontent-%COMP%] {\n    --smart-list-pagination-arrow-inline-offset: -1.1rem;\n    margin-inline: var(--smart-list-fullscreen-mobile-surface-margin, 0.72rem);\n  }\n  .smart-list__surface--fullscreen[_ngcontent-%COMP%]:has(app-single-card[data-card-presentation=fullscreen]) {\n    margin-inline: 0;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-1[_ngcontent-%COMP%], \n   .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-2[_ngcontent-%COMP%], \n   .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-3[_ngcontent-%COMP%], \n   .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-4[_ngcontent-%COMP%] {\n    --smart-list-horizontal-item-basis: 100%;\n  }\n  .smart-list--list.smart-list--horizontal[_ngcontent-%COMP%]::-webkit-scrollbar {\n    display: none;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--mobile-stepper[_ngcontent-%COMP%] {\n    scroll-behavior: smooth;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--snap-proximity[_ngcontent-%COMP%] {\n    scroll-snap-type: x proximity;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--snap-mandatory[_ngcontent-%COMP%] {\n    scroll-snap-type: x mandatory;\n  }\n  .smart-list__surface--horizontal[_ngcontent-%COMP%]   .smart-list__pagination-arrows[_ngcontent-%COMP%] {\n    display: block;\n  }\n  .smart-list__surface--timeline[_ngcontent-%COMP%]   .smart-list__pagination-arrows[_ngcontent-%COMP%] {\n    display: block;\n  }\n  .smart-list__horizontal-dots[_ngcontent-%COMP%] {\n    display: flex;\n  }\n  .smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__sticky[_ngcontent-%COMP%], \n   .smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__group-marker[_ngcontent-%COMP%], \n   .smart-list--list.smart-list--card-grid[_ngcontent-%COMP%]   .smart-list__footer-spacer[_ngcontent-%COMP%] {\n    grid-column: auto;\n  }\n  .smart-list--list.smart-list--card-grid.smart-list--mobile-columns[_ngcontent-%COMP%]   .smart-list__sticky[_ngcontent-%COMP%], \n   .smart-list--list.smart-list--card-grid.smart-list--mobile-columns[_ngcontent-%COMP%]   .smart-list__group-marker[_ngcontent-%COMP%], \n   .smart-list--list.smart-list--card-grid.smart-list--mobile-columns[_ngcontent-%COMP%]   .smart-list__footer-spacer[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .smart-list--list.smart-list--thread[_ngcontent-%COMP%] {\n    padding-right: 0.08rem;\n  }\n  .smart-list--list.chat-thread-list[_ngcontent-%COMP%] {\n    transform: translateZ(0);\n    backface-visibility: hidden;\n  }\n}\n/*# sourceMappingURL=smart-list.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SmartListComponent, [{
    type: Component,
    args: [{ selector: "app-smart-list", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      IndicatorComponent,
      AppMenuOutletComponent,
      CalendarCardComponent,
      I18nPipe
    ], providers: [AppMenuDispatcher], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div
  class="smart-list__surface"
  [class.smart-list__surface--horizontal]="isHorizontalList()"
  [class.smart-list__surface--timeline]="isTimelineMode()"
  [class.smart-list__surface--compact-horizontal]="shouldUseCompactHorizontal()"
  [class.smart-list__surface--fullscreen]="resolvedPresentation() === 'fullscreen'"
  [class.smart-list__surface--fullscreen-with-rating-bar]="resolvedPresentation() === 'fullscreen' && shouldRenderPaginationRatingBar()"
>
  <div class="smart-list__stage">
    <div class="smart-list__stage-list-shell" [class.is-occluded]="shouldRenderHostedFullscreenOverlay()">
      @if (isPageMode()) {
        <div
          class="smart-list__page-shell"
          [class.smart-list__page-shell--presentation-list]="resolvedPresentation() === 'list'"
          [class.smart-list__page-shell--presentation-fullscreen]="resolvedPresentation() === 'fullscreen'"
        >
          <app-smart-list-page-card
            #scrollHost
            class="smart-list smart-list--page"
            [class.smart-list--month]="isMonthMode()"
            [class.smart-list--week]="isWeekMode()"
            [class.smart-list--timeline]="isTimelineMode()"
            [class.smart-list--mobile-stepper]="resolvedMobileStepper()"
            [class.smart-list--presentation-list]="resolvedPresentation() === 'list'"
            [class.smart-list--presentation-fullscreen]="resolvedPresentation() === 'fullscreen'"
            [class.smart-list--page-touching]="isTouchingSurface"
            [model]="pageCardModel()"
            (scroll)="onPageScroll($event)"
            (scrollend)="onPageScrollEnd($event)"
            (touchstart)="onSurfaceTouchStart()"
            (touchend)="onSurfaceTouchEnd()"
            (touchcancel)="onSurfaceTouchEnd()"
          >
            @if (shouldShowStickyHeader()) {
              <div
                smart-list-page-card-header
                class="smart-list__sticky smart-list__sticky--page"
                [ngClass]="resolvedStickyHeaderClass()"
              >
                <span class="smart-list__sticky-label">{{ stickyLabel }}</span>
                <span class="smart-list__sticky-actions">
                  <button
                    type="button"
                    class="smart-list__sticky-action-btn"
                    (click)="navigatePageHeader(-1, $event)"
                    aria-label="Previous period"
                  >
                    <mat-icon>chevron_left</mat-icon>
                  </button>
                  <button
                    type="button"
                    class="smart-list__sticky-action-btn"
                    (click)="navigatePageHeader(1, $event)"
                    aria-label="Next period"
                  >
                    <mat-icon>chevron_right</mat-icon>
                  </button>
                </span>
              </div>
            }
          </app-smart-list-page-card>
        </div>
      } @else {
        @if (shouldRenderListHeaderOutsideScroll()) {
          <div class="smart-list__sticky smart-list__sticky--list-header" [ngClass]="resolvedStickyHeaderClass()">
            <span class="smart-list__sticky-label">{{ stickyLabel }}</span>
            @if (shouldRenderStickyPaginationActions()) {
              <span class="smart-list__sticky-actions">
                <button
                  type="button"
                  class="smart-list__sticky-action-btn"
                  [disabled]="!canMovePagination(-1)"
                  (click)="onPaginationPrev($event)"
                  aria-label="Previous page"
                >
                  <mat-icon>chevron_left</mat-icon>
                </button>
                <button
                  type="button"
                  class="smart-list__sticky-action-btn"
                  [disabled]="!canMovePagination(1)"
                  (click)="onPaginationNext($event)"
                  aria-label="Next page"
                >
                  <mat-icon>chevron_right</mat-icon>
                </button>
              </span>
            }
          </div>
        }
        <div
          #scrollHost
          class="smart-list"
          [ngClass]="resolvedContainerClass()"
          [class.smart-list--list]="true"
          [class.smart-list--stack]="resolvedListLayout() === 'stack'"
          [class.smart-list--card-grid]="resolvedListLayout() === 'card-grid'"
          [class.smart-list--thread]="resolvedListLayout() === 'thread'"
          [class.smart-list--horizontal]="isHorizontalList()"
          [class.smart-list--compact-horizontal]="shouldUseCompactHorizontal()"
          [class.smart-list--mobile-stepper]="resolvedMobileStepper()"
          [class.smart-list--flow-reverse]="isReversedListFlow()"
          [class.smart-list--presentation-list]="resolvedPresentation() === 'list'"
          [class.smart-list--presentation-fullscreen]="resolvedPresentation() === 'fullscreen'"
          [class.smart-list--desktop-columns-1]="resolvedDesktopColumns() === '1'"
          [class.smart-list--desktop-columns-2]="resolvedDesktopColumns() === '2'"
          [class.smart-list--desktop-columns-3]="resolvedDesktopColumns() === '3'"
          [class.smart-list--desktop-columns-4]="resolvedDesktopColumns() === '4'"
          [class.smart-list--mobile-columns]="resolvedMobileColumns() !== null"
          [class.smart-list--snap-none]="resolvedSnapMode() === 'none' || suppressListSnapNearEnd || shouldSuppressSnapDuringTouch() || shouldSuspendHorizontalSnap()"
          [class.smart-list--snap-proximity]="resolvedSnapMode() === 'proximity' && !suppressListSnapNearEnd && !shouldSuppressSnapDuringTouch() && !shouldSuspendHorizontalSnap()"
          [class.smart-list--snap-mandatory]="resolvedSnapMode() === 'mandatory' && !suppressListSnapNearEnd && !shouldSuppressSnapDuringTouch() && !shouldSuspendHorizontalSnap()"
          [style.--smart-list-desktop-columns]="resolvedDesktopColumns()"
          [style.--smart-list-mobile-columns]="resolvedMobileColumns()"
          [style.--smart-list-scroll-padding-top]="resolvedScrollPaddingTop()"
          [style.--smart-list-sticky-header-height.px]="stickyHeaderHeightPx > 0 ? stickyHeaderHeightPx : null"
          (wheel)="onHorizontalWheel($event)"
          (scroll)="onListScroll($event)"
          (scrollend)="onListScrollEnd($event)"
          (touchstart)="onSurfaceTouchStart()"
          (touchend)="onSurfaceTouchEnd()"
          (touchcancel)="onSurfaceTouchEnd()"
        >
          @if (shouldShowStickyHeader() && !shouldRenderListHeaderOutsideScroll()) {
            <div
              class="smart-list__sticky"
              [class.smart-list__sticky--list-header]="shouldRenderStickyPaginationActions()"
              [ngClass]="resolvedStickyHeaderClass()"
            >
              <span class="smart-list__sticky-label">{{ stickyLabel }}</span>
              @if (shouldRenderStickyPaginationActions()) {
                <span class="smart-list__sticky-actions">
                  <button
                    type="button"
                    class="smart-list__sticky-action-btn"
                    [disabled]="!canMovePagination(-1)"
                    (click)="onPaginationPrev($event)"
                    aria-label="Previous page"
                  >
                    <mat-icon>chevron_left</mat-icon>
                  </button>
                  <button
                    type="button"
                    class="smart-list__sticky-action-btn"
                    [disabled]="!canMovePagination(1)"
                    (click)="onPaginationNext($event)"
                    aria-label="Next page"
                  >
                    <mat-icon>chevron_right</mat-icon>
                  </button>
                </span>
              }
            </div>
          }

          @if (groups.length > 0) {
            @if (resolvedItemTemplate(); as templateRef) {
              @for (group of groups; track trackByGroup($index, group); let groupIndex = $index) {
                @if (!isReversedListFlow() && shouldShowGroupMarker(group, groupIndex) && group.label) {
                  <div
                    class="smart-list__group-marker"
                    [ngClass]="resolvedGroupMarkerClass()"
                    [attr.data-group-label]="group.label"
                    [style.z-index]="isReversedListFlow() ? groups.length - groupIndex + 3 : null"
                  >
                    {{ group.label }}
                  </div>
                }

                @for (item of group.items; track trackByItem($index, item); let itemIndex = $index) {
                  @if (shouldRenderPrependRestoreSpacer(item, group.startIndex + itemIndex)) {
                    <div
                      class="smart-list__prepend-restore-spacer"
                      [id]="prependRestoreSpacerId"
                      [style.height.px]="prependRestoreSpacerHeight"
                      aria-hidden="true"
                    ></div>
                  }
                  <div
                    class="smart-list__item-shell"
                    [attr.data-group-label]="group.label || null"
                    [attr.data-smart-list-index]="group.startIndex + itemIndex"
                    [attr.data-smart-list-anchor]="itemAnchorKey(item, group.startIndex + itemIndex)"
                  >
                    <ng-container
                      [ngTemplateOutlet]="templateRef"
                      [ngTemplateOutletContext]="itemContext(item, itemIndex, group.label)"
                      [ngTemplateOutletInjector]="itemTemplateInjector"
                    ></ng-container>
                  </div>
                }
                @if (isReversedListFlow() && shouldShowGroupMarker(group, groupIndex) && group.label) {
                  <div
                    class="smart-list__group-marker"
                    [ngClass]="resolvedGroupMarkerClass()"
                    [attr.data-group-label]="group.label"
                    [style.z-index]="isReversedListFlow() ? groups.length - groupIndex + 3 : null"
                  >
                    {{ group.label }}
                  </div>
                }
              }
            }
          } @else {
            <ng-container [ngTemplateOutlet]="emptyState"></ng-container>
          }

          @if (resolvedFooterSpacerHeight() !== null) {
            <div
              class="smart-list__footer-spacer"
              [style.height]="resolvedFooterSpacerHeight()"
              aria-hidden="true"
            ></div>
          }
        </div>
      }
    </div>

    @if (shouldRenderHostedFullscreenOverlay()) {
      <div
        class="smart-list__stage-overlay"
        [class.smart-list__stage-overlay--with-rating-bar]="shouldRenderPaginationRatingBar()"
      >
        @if (resolvedFullscreenItemTemplate(); as fullscreenTemplateRef) {
          <div #fullscreenSurface class="smart-list__fullscreen-surface">
            @if (hostedFullscreenCurrentItem(); as currentItem) {
              @if (hostedFullscreenStackItem(2); as thirdItem) {
                <div
                  class="smart-list__fullscreen-card smart-list__fullscreen-card--slot-2 smart-list__fullscreen-card--preview"
                  aria-hidden="true"
                >
                  <div class="smart-list__fullscreen-card-content">
                    <ng-container
                      [ngTemplateOutlet]="fullscreenTemplateRef"
                      [ngTemplateOutletInjector]="itemTemplateInjector"
                      [ngTemplateOutletContext]="
                        hostedFullscreenItemContext(
                          thirdItem,
                          hostedFullscreenStackRenderState(2),
                          hostedFullscreenStackItemIndex(2)
                        )
                      "
                    ></ng-container>
                  </div>
                </div>
              }

              @if (hostedFullscreenStackItem(1); as nextItem) {
                <div
                  class="smart-list__fullscreen-card smart-list__fullscreen-card--slot-1 smart-list__fullscreen-card--preview"
                  aria-hidden="true"
                >
                  <div class="smart-list__fullscreen-card-content">
                    <ng-container
                      [ngTemplateOutlet]="fullscreenTemplateRef"
                      [ngTemplateOutletInjector]="itemTemplateInjector"
                      [ngTemplateOutletContext]="
                        hostedFullscreenItemContext(
                          nextItem,
                          hostedFullscreenStackRenderState(1),
                          hostedFullscreenStackItemIndex(1)
                        )
                      "
                    ></ng-container>
                  </div>
                </div>
              }

              <div
                class="smart-list__fullscreen-card smart-list__fullscreen-card--active"
                [class.smart-list__fullscreen-card--curling]="hostedFullscreenIsCurling()"
                [class.smart-list__fullscreen-card--curling-backward]="hostedFullscreenIsCurlingBackwards()"
                (animationend)="onHostedFullscreenActiveCardAnimationEnd($event)"
              >
                <div class="smart-list__fullscreen-card-content">
                  <ng-container
                    [ngTemplateOutlet]="fullscreenTemplateRef"
                    [ngTemplateOutletInjector]="itemTemplateInjector"
                    [ngTemplateOutletContext]="
                      hostedFullscreenItemContext(
                        currentItem,
                        hostedFullscreenCurrentRenderState(),
                        hostedFullscreenCurrentItemIndex()
                      )
                    "
                  ></ng-container>
                </div>
              </div>
            } @else {
              <ng-container [ngTemplateOutlet]="fullscreenEmptyState"></ng-container>
            }
          </div>
        }
      </div>
    }
  </div>

  @if (shouldRenderHostedIndicator()) {
    <div class="smart-list__header-progress-shell">
      @let headerProgressConfig = hostedIndicatorConfig();
      <app-indicator
        kind="bar"
        [placement]="headerProgressConfig.placement ?? 'inline'"
        [tone]="headerProgressConfig.tone ?? 'default'"
        [state]="headerProgressConfig.state ?? 'scrolling'"
        [position]="headerProgressConfig.position ?? 0"
      ></app-indicator>
    </div>
  }

  @if (shouldRenderPaginationArrows()) {
    <div class="smart-list__pagination-arrows">
      <button
        type="button"
        class="smart-list__pagination-arrow smart-list__pagination-arrow--prev motion-static"
        [disabled]="!canMovePagination(-1)"
        (click)="onPaginationPrev($event)"
        aria-label="Previous item"
      >
        <mat-icon>chevron_left</mat-icon>
      </button>
      <button
        type="button"
        class="smart-list__pagination-arrow smart-list__pagination-arrow--next motion-static"
        [disabled]="!canMovePagination(1)"
        (click)="onPaginationNext($event)"
        aria-label="Next item"
      >
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  }

  @if (shouldRenderHorizontalPaginationDots()) {
    <div class="smart-list__horizontal-dots" aria-hidden="true">
      @for (dotIndex of horizontalPaginationDotIndexes(); track dotIndex) {
        <span
          class="smart-list__horizontal-dot"
          [class.is-active]="isHorizontalPaginationDotActive(dotIndex)"
        ></span>
      }
    </div>
  }

  @let ratingPaginationMenu = paginationRatingMenu();
  <app-menu-outlet
    #paginationMenuOutlet
    [menu]="ratingPaginationMenu"
    [items]="ratingPaginationMenu ? paginationRatingMenuItems() : dispatchedMenuItems()"
    (itemSelect)="onMenuOutletItemSelect($event)"
  ></app-menu-outlet>
</div>

<ng-template #fullscreenEmptyState>
  @if (!initialLoading) {
    <div class="smart-list__fullscreen-empty">
      <h4>{{ hostedFullscreenEmptyLabel() | i18n }}</h4>
      @if (hostedFullscreenEmptyDescription()) {
        <p>{{ hostedFullscreenEmptyDescription() | i18n }}</p>
      }
    </div>
  }
</ng-template>

<ng-template #emptyState>
  @if (!initialLoading) {
    <div class="smart-list__empty">
      <h4>{{ emptyLabel() | i18n }}</h4>
      @if (emptyDescription()) {
        <p>{{ emptyDescription() | i18n }}</p>
      }
    </div>
  }
</ng-template>
`, styles: ["/* src/app/shared/ui/components/core/smart-list/smart-list.component.scss */\n:host {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n  position: relative;\n}\n.smart-list__surface {\n  --smart-list-pagination-arrow-size: 2.2rem;\n  --smart-list-pagination-arrow-inline-offset: 0.6rem;\n  --smart-list-fullscreen-top-offset: 0px;\n  --smart-list-fullscreen-bottom-offset: 0px;\n  position: relative;\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__surface--fullscreen {\n  --smart-list-fullscreen-top-offset: 0.42rem;\n}\n.smart-list__surface--fullscreen-with-rating-bar {\n  --smart-list-fullscreen-bottom-offset: calc(5.25rem + env(safe-area-inset-bottom));\n}\n@media (min-width: 761px) {\n  .smart-list__surface--fullscreen:has(app-pair-card[data-card-presentation=fullscreen]) {\n    --smart-list-pagination-arrow-inline-offset: 0.16rem;\n  }\n}\n.smart-list__surface--compact-horizontal {\n  height: 100%;\n}\n.smart-list__stage {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n  top: 5px;\n}\n.smart-list__stage-list-shell {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__stage-list-shell.is-occluded {\n  opacity: 0;\n  pointer-events: none;\n}\n.smart-list__stage-overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  min-height: 0;\n  pointer-events: none;\n}\n.smart-list__fullscreen-surface {\n  position: relative;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr);\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n  padding: var(--smart-list-fullscreen-top-offset) 0 3.4rem;\n  overflow: hidden;\n  pointer-events: none;\n  perspective: 1800px;\n}\n.smart-list__fullscreen-card {\n  position: absolute;\n  inset: 0 0 var(--smart-list-fullscreen-bottom-offset) 0;\n  margin: 0;\n  pointer-events: none;\n  transform-origin: center right;\n  transform-style: preserve-3d;\n  backface-visibility: hidden;\n  will-change: transform, opacity;\n}\n.smart-list__fullscreen-card--active {\n  z-index: 3;\n}\n.smart-list__fullscreen-card-content {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n:host ::ng-deep .smart-list__fullscreen-card-content > * {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__fullscreen-card--active .smart-list__fullscreen-card-content {\n  pointer-events: auto;\n}\n.smart-list__fullscreen-card--preview .smart-list__fullscreen-card-content {\n  pointer-events: none;\n}\n.smart-list__fullscreen-card--slot-1 {\n  z-index: 2;\n}\n.smart-list__fullscreen-card--slot-2 {\n  z-index: 1;\n}\n.smart-list__fullscreen-card--curling {\n  z-index: 4;\n  animation: smart-list-fullscreen-page-curl 420ms cubic-bezier(0.18, 0.64, 0.24, 1) forwards;\n}\n.smart-list__fullscreen-card--curling > * {\n  pointer-events: none;\n}\n.smart-list__fullscreen-card--curling-backward {\n  transform-origin: center left;\n  animation-name: smart-list-fullscreen-page-curl-backward;\n}\n.smart-list__fullscreen-empty {\n  align-self: stretch;\n  justify-self: stretch;\n  display: grid;\n  align-content: center;\n  justify-items: center;\n  gap: 0.42rem;\n  height: 100%;\n  min-height: 0;\n  padding: 1rem;\n  border: 1px dashed var(--deployment-card-border, rgba(67, 96, 134, 0.22));\n  border-radius: 14px;\n  background: var(--deployment-card-background, linear-gradient(180deg, rgba(250, 252, 255, 0.96) 0%, rgba(241, 246, 255, 0.92) 100%));\n  color: var(--deployment-text-main, rgba(35, 56, 84, 0.82));\n  text-align: center;\n}\n.smart-list__fullscreen-empty h4,\n.smart-list__fullscreen-empty p {\n  margin: 0;\n}\n.smart-list__fullscreen-empty h4 {\n  font-size: 0.95rem;\n  font-weight: 800;\n}\n.smart-list__fullscreen-empty p {\n  font-size: 0.8rem;\n  color: var(--deployment-text-muted, rgba(56, 77, 104, 0.74));\n}\n.smart-list--list.smart-list--card-grid,\n.smart-list--list.smart-list--stack {\n  --smart-list-card-snap-gap: 0.34rem;\n  scroll-padding-top: calc(var(--smart-list-sticky-header-height, var(--smart-list-scroll-padding-top, 2.6rem)) + var(--smart-list-card-snap-gap));\n  scroll-behavior: smooth;\n  transition: padding-bottom 180ms ease;\n  -webkit-overflow-scrolling: touch;\n  touch-action: pan-y;\n}\n.smart-list--list.smart-list--thread {\n  display: block;\n  gap: 0;\n  padding-right: 0.12rem;\n  scroll-behavior: auto;\n  overflow-anchor: none;\n}\n.smart-list--list.smart-list--thread.smart-list--flow-reverse {\n  display: flex;\n  flex-direction: column-reverse;\n  align-items: stretch;\n  overflow-anchor: none;\n}\n.smart-list--list.smart-list--card-grid.smart-list--snap-proximity,\n.smart-list--list.smart-list--stack.smart-list--snap-proximity {\n  scroll-snap-type: y proximity;\n}\n.smart-list--list.smart-list--card-grid.smart-list--snap-mandatory,\n.smart-list--list.smart-list--stack.smart-list--snap-mandatory {\n  scroll-snap-type: y mandatory;\n}\n.smart-list--list.smart-list--card-grid.smart-list--snap-none,\n.smart-list--list.smart-list--stack.smart-list--snap-none {\n  scroll-snap-type: none;\n}\n.smart-list--list.smart-list--snap-none .smart-list__item-shell,\n:host ::ng-deep .smart-list--list.smart-list--snap-none .activities-row-item,\n:host ::ng-deep .smart-list--list.smart-list--snap-none .asset-item-card,\n:host ::ng-deep .smart-list--list.smart-list--snap-none .activities-card,\n:host ::ng-deep .smart-list--list.smart-list--snap-none .event-explore-card,\n:host ::ng-deep .smart-list--list.smart-list--snap-none .experience-item-card {\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__group-marker.chat-thread-group-marker {\n  position: sticky;\n  top: 0;\n  z-index: 3;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 6.5rem;\n  box-sizing: border-box;\n  margin: 0.08rem auto 0.3rem;\n  border: 1px solid rgba(43, 74, 116, 0.2);\n  border-radius: 999px;\n  background: rgb(255, 255, 255);\n  color: rgba(36, 64, 99, 0.88);\n  font-size: 0.66rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  white-space: nowrap;\n}\n.smart-list__prepend-restore-spacer {\n  display: block;\n  width: 100%;\n  min-height: 0;\n  pointer-events: none;\n  visibility: hidden;\n  overflow: hidden;\n  overflow-anchor: none;\n}\n.smart-list__item-shell {\n  display: block;\n  min-width: 0;\n  overflow-anchor: none;\n  scroll-snap-align: start;\n}\n.smart-list--list.smart-list--card-grid .smart-list__item-shell {\n  width: 100%;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.smart-list--list.smart-list--card-grid .smart-list__item-shell > * {\n  width: 100%;\n  max-width: 100%;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.smart-list--list.smart-list--card-grid .smart-list__sticky,\n.smart-list--list.smart-list--card-grid .smart-list__group-marker,\n.smart-list--list.smart-list--card-grid .smart-list__footer-spacer {\n  width: 100%;\n  box-sizing: border-box;\n}\n.smart-list__footer-spacer {\n  flex: 0 0 auto;\n  min-height: 0;\n  pointer-events: none;\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__header-progress-shell {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 34;\n  pointer-events: none;\n}\n.smart-list__pagination-arrows {\n  --smart-list-arrow-motion-duration: 0.16s;\n  --smart-list-arrow-motion-ease: cubic-bezier(0.22, 0.61, 0.36, 1);\n  --smart-list-arrow-hover-brightness: 1.02;\n  --smart-list-arrow-press-brightness: 0.96;\n  position: absolute;\n  inset: 0;\n  z-index: 34;\n  pointer-events: none;\n}\n.smart-list__surface--horizontal {\n  --smart-list-pagination-arrow-inline-offset: -1.1rem;\n}\n.smart-list__surface--horizontal .smart-list__pagination-arrows {\n  display: none;\n}\n.smart-list__surface--timeline .smart-list__pagination-arrows {\n  display: none;\n}\n@keyframes smart-list-pagination-arrow-touch-feedback {\n  0% {\n    transform: translateY(-50%);\n    filter: brightness(1);\n    border-color: rgba(43, 73, 116, 0.16);\n    background: rgba(255, 255, 255, 0.96);\n    box-shadow: 0 8px 22px rgba(13, 24, 40, 0.16);\n  }\n  45% {\n    transform: translateY(-50%);\n    filter: brightness(var(--smart-list-arrow-press-brightness));\n    border-color: rgba(53, 86, 132, 0.28);\n    background: rgba(246, 250, 255, 0.99);\n    box-shadow:\n      0 12px 28px rgba(13, 24, 40, 0.2),\n      0 0 0 1px rgba(255, 255, 255, 0.48),\n      inset 0 1px 0 rgba(255, 255, 255, 0.46);\n  }\n  100% {\n    transform: translateY(-50%);\n    filter: brightness(1);\n    border-color: rgba(43, 73, 116, 0.16);\n    background: rgba(255, 255, 255, 0.96);\n    box-shadow: 0 8px 22px rgba(13, 24, 40, 0.16);\n  }\n}\n.smart-list__pagination-arrow {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--smart-list-pagination-arrow-size);\n  height: var(--smart-list-pagination-arrow-size);\n  border: 1px solid rgba(43, 73, 116, 0.16);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.96);\n  color: #27456f;\n  box-shadow: 0 8px 22px rgba(13, 24, 40, 0.16);\n  pointer-events: auto;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    filter var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    box-shadow var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    background-color var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    border-color var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease),\n    color var(--smart-list-arrow-motion-duration) var(--smart-list-arrow-motion-ease);\n}\n@media (hover: hover) and (pointer: fine) {\n  .smart-list__pagination-arrow:not(:disabled):hover {\n    transform: translateY(-50%);\n    filter: brightness(var(--smart-list-arrow-hover-brightness));\n    border-color: rgba(53, 86, 132, 0.24);\n    background: rgba(251, 253, 255, 0.99);\n    box-shadow: 0 12px 28px rgba(13, 24, 40, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.52);\n  }\n  .smart-list__pagination-arrow:not(:disabled):active {\n    transform: translateY(-50%);\n    filter: brightness(var(--smart-list-arrow-press-brightness));\n    border-color: rgba(59, 93, 140, 0.3);\n    background: rgba(245, 249, 255, 0.99);\n    box-shadow:\n      0 7px 18px rgba(13, 24, 40, 0.17),\n      0 0 0 1px rgba(255, 255, 255, 0.44),\n      inset 0 1px 0 rgba(255, 255, 255, 0.4);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  .smart-list__pagination-arrow:not(:disabled):active {\n    animation: smart-list-pagination-arrow-touch-feedback 0.2s ease;\n  }\n}\n.smart-list__pagination-arrow:disabled {\n  display: none;\n  cursor: default;\n}\n.smart-list__pagination-arrow .mat-icon {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.smart-list__pagination-arrow--prev {\n  left: var(--smart-list-pagination-arrow-inline-offset);\n}\n.smart-list__pagination-arrow--next {\n  right: var(--smart-list-pagination-arrow-inline-offset);\n}\n.smart-list__surface--compact-horizontal .smart-list__pagination-arrows {\n  display: block;\n}\n.smart-list__horizontal-dots {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: var(--smart-list-horizontal-dots-bottom, 0.42rem);\n  z-index: 35;\n  display: none;\n  align-items: center;\n  justify-content: center;\n  gap: 0.36rem;\n  pointer-events: none;\n}\n.smart-list__horizontal-dot {\n  display: block;\n  width: 0.48rem;\n  height: 0.48rem;\n  border: 1px solid rgba(64, 105, 157, 0.2);\n  border-radius: 999px;\n  background: #d7e1ef;\n  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.7);\n}\n.smart-list__horizontal-dot.is-active {\n  width: 1.28rem;\n  border-color: rgba(129, 88, 236, 0.38);\n  background:\n    linear-gradient(\n      90deg,\n      #7357ee 0%,\n      #f54fbc 100%);\n  box-shadow: 0 4px 12px rgba(125, 86, 234, 0.28);\n}\n.smart-list__surface--compact-horizontal .smart-list__horizontal-dots {\n  display: flex;\n}\n@keyframes smart-list-fullscreen-page-curl {\n  0% {\n    transform: perspective(1800px) translate3d(0, 0, 0) rotateY(0deg) scale3d(1, 1, 1);\n    opacity: 1;\n  }\n  24% {\n    transform: perspective(1800px) translate3d(-4%, 0, 10px) rotateY(-14deg) scale3d(0.998, 1, 1);\n    opacity: 0.96;\n  }\n  62% {\n    transform: perspective(1800px) translate3d(-18%, 0, 24px) rotateY(-42deg) scale3d(0.982, 1, 1);\n    opacity: 0.92;\n  }\n  100% {\n    transform: perspective(1800px) translate3d(-118%, 0, 0) rotateY(-84deg) scale3d(0.94, 1, 1);\n    opacity: 0;\n  }\n}\n@keyframes smart-list-fullscreen-page-curl-backward {\n  0% {\n    transform: perspective(1800px) translate3d(0, 0, 0) rotateY(0deg) scale3d(1, 1, 1);\n    opacity: 1;\n  }\n  24% {\n    transform: perspective(1800px) translate3d(4%, 0, 10px) rotateY(14deg) scale3d(0.998, 1, 1);\n    opacity: 0.96;\n  }\n  62% {\n    transform: perspective(1800px) translate3d(18%, 0, 24px) rotateY(42deg) scale3d(0.982, 1, 1);\n    opacity: 0.92;\n  }\n  100% {\n    transform: perspective(1800px) translate3d(118%, 0, 0) rotateY(84deg) scale3d(0.94, 1, 1);\n    opacity: 0;\n  }\n}\n:host ::ng-deep .smart-list--list.smart-list--card-grid .activities-row-item,\n:host ::ng-deep .smart-list--list.smart-list--card-grid .asset-item-card,\n:host ::ng-deep .smart-list--list.smart-list--card-grid .activities-card,\n:host ::ng-deep .smart-list--list.smart-list--card-grid .event-explore-card,\n:host ::ng-deep .smart-list--list.smart-list--card-grid .experience-item-card {\n  width: 100%;\n  max-width: 100%;\n  scroll-snap-align: start;\n  scroll-margin-top: 0;\n  scroll-snap-stop: normal;\n}\n.smart-list--list.smart-list--card-grid {\n  --smart-list-card-snap-gap: 0.6rem;\n  display: grid;\n  grid-template-columns: repeat(var(--smart-list-desktop-columns, 3), minmax(0, 1fr));\n  align-content: start;\n  justify-items: stretch;\n  column-gap: 0.34rem;\n  row-gap: 0.6rem;\n  padding-bottom: 0.52rem;\n}\n.smart-list--list.smart-list--card-grid .smart-list__sticky,\n.smart-list--list.smart-list--card-grid .smart-list__group-marker,\n.smart-list--list.smart-list--card-grid .smart-list__footer-spacer {\n  grid-column: 1/-1;\n}\n.smart-list--list.smart-list--horizontal {\n  --smart-list-horizontal-gap: 0.78rem;\n  --smart-list-horizontal-end-inset: 0.58rem;\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  gap: var(--smart-list-horizontal-gap);\n  overflow-x: auto;\n  overflow-y: visible;\n  padding: 0;\n  padding-block-end: 0.52rem;\n  padding-inline-end: var(--smart-list-horizontal-end-inset);\n  scroll-padding-left: 0;\n  scroll-padding-right: var(--smart-list-horizontal-end-inset);\n  scrollbar-width: thin;\n  scrollbar-color: rgba(83, 111, 154, 0.38) rgba(222, 230, 242, 0.72);\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-1 {\n  --smart-list-horizontal-item-basis: 100%;\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-2 {\n  --smart-list-horizontal-item-basis: calc((100% - var(--smart-list-horizontal-gap)) / 2);\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-3 {\n  --smart-list-horizontal-item-basis: calc((100% - var(--smart-list-horizontal-gap) - var(--smart-list-horizontal-gap)) / 3);\n}\n.smart-list--list.smart-list--horizontal.smart-list--desktop-columns-4 {\n  --smart-list-horizontal-item-basis: calc((100% - var(--smart-list-horizontal-gap) - var(--smart-list-horizontal-gap) - var(--smart-list-horizontal-gap)) / 4);\n}\n.smart-list--list.smart-list--horizontal::-webkit-scrollbar {\n  height: 0.5rem;\n}\n.smart-list--list.smart-list--horizontal::-webkit-scrollbar-track {\n  border-radius: 999px;\n  background: rgba(222, 230, 242, 0.72);\n}\n.smart-list--list.smart-list--horizontal::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background: rgba(83, 111, 154, 0.38);\n}\n.smart-list--list.smart-list--horizontal.smart-list--snap-proximity {\n  scroll-snap-type: x proximity;\n}\n.smart-list--list.smart-list--horizontal.smart-list--snap-mandatory {\n  scroll-snap-type: x mandatory;\n}\n.smart-list--list.smart-list--horizontal.smart-list--snap-none {\n  scroll-snap-type: none;\n}\n.smart-list--list.smart-list--horizontal.smart-list--compact-horizontal {\n  --smart-list-horizontal-item-basis: 100%;\n  --smart-list-horizontal-end-inset: 0;\n  height: 100%;\n  min-height: 0;\n  padding-inline-end: 0;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.smart-list--list.smart-list--horizontal.smart-list--compact-horizontal::-webkit-scrollbar {\n  display: none;\n}\n.smart-list--list.smart-list--horizontal.smart-list--compact-horizontal .smart-list__item-shell {\n  min-height: 0;\n}\n.smart-list--list.smart-list--horizontal .smart-list__item-shell {\n  display: flex;\n  align-items: stretch;\n  flex: 0 0 var(--smart-list-horizontal-item-basis, min(21rem, 78vw));\n  width: auto;\n  align-self: stretch;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n}\n.smart-list--list.smart-list--horizontal .smart-list__item-shell > * {\n  flex: 1 1 auto;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  align-self: stretch;\n}\n:host ::ng-deep .smart-list--list.smart-list--horizontal .ui-info-card {\n  touch-action: pan-x pan-y;\n}\n.smart-list--list.smart-list--horizontal .smart-list__sticky,\n.smart-list--list.smart-list--horizontal .smart-list__group-marker,\n.smart-list--list.smart-list--horizontal .smart-list__footer-spacer {\n  flex: 0 0 100%;\n  width: 100%;\n}\n.smart-list__surface--horizontal .smart-list__sticky--list-header {\n  flex: 0 0 auto;\n  width: 100%;\n  box-sizing: border-box;\n  margin-bottom: 0.42rem;\n}\n.smart-list--list.experience-card-list {\n  padding-bottom: 0.35rem;\n}\n.smart-list--list.assets-card-list {\n  gap: 0.68rem;\n}\n.smart-list--list.chat-thread-list {\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-y: contain;\n  touch-action: pan-y;\n}\n.smart-list--list.notification-center-smart-list {\n  padding-right: 0.18rem;\n  scrollbar-gutter: stable;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(96, 74, 154, 0.58) rgba(226, 232, 240, 0.88);\n}\n.smart-list--list.notification-center-smart-list::-webkit-scrollbar {\n  width: 10px;\n}\n.smart-list--list.notification-center-smart-list::-webkit-scrollbar-track {\n  border-radius: 999px;\n  background: rgba(226, 232, 240, 0.88);\n}\n.smart-list--list.notification-center-smart-list::-webkit-scrollbar-thumb {\n  border: 2px solid rgba(226, 232, 240, 0.88);\n  border-radius: 999px;\n  background: rgba(96, 74, 154, 0.58);\n}\n.smart-list {\n  display: flex;\n  flex: 1;\n  min-height: 0;\n  flex-direction: column;\n  gap: 0.34rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.smart-list--presentation-fullscreen {\n  height: 100%;\n}\n.smart-list__page-shell {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n  flex-direction: column;\n  gap: 0.4rem;\n  overflow: hidden;\n}\n.smart-list__page-shell--presentation-fullscreen {\n  height: 100%;\n}\n.smart-list--page {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  align-items: stretch;\n  scroll-snap-type: x mandatory;\n  scroll-behavior: smooth;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n  touch-action: pan-x pan-y;\n  padding-bottom: calc(0.8rem + env(safe-area-inset-bottom));\n}\n.smart-list--page.smart-list--week {\n  overflow-y: auto;\n  touch-action: pan-x pan-y;\n  overscroll-behavior-y: contain;\n  padding-bottom: 0;\n}\n.smart-list--page.smart-list--month {\n  overflow-y: clip;\n}\n.smart-list--page.smart-list--page-touching {\n  scroll-snap-type: none;\n  scroll-behavior: auto;\n}\n.smart-list--page::-webkit-scrollbar {\n  display: none;\n}\n.smart-list__sticky {\n  position: sticky;\n  top: 0;\n  z-index: 25;\n  overflow-anchor: none;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f3f8ff 100%);\n  color: #203b5d;\n  font-size: 0.76rem;\n  font-weight: 800;\n  padding: 0.35rem 0.55rem;\n  margin-bottom: 0.06rem;\n}\n.smart-list__sticky--page {\n  left: 0;\n}\n.smart-list__sticky--page,\n.smart-list__sticky--list-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.45rem;\n  width: 100%;\n  box-sizing: border-box;\n}\n.smart-list__sticky--slot-section {\n  position: relative;\n  top: auto;\n  z-index: 1;\n  border-color: var(--smart-list-slot-header-border, rgba(146, 108, 49, 0.24));\n  background: var(--smart-list-slot-header-bg, linear-gradient(135deg, rgba(255, 248, 235, 0.98) 0%, rgba(239, 247, 255, 0.92) 100%));\n  color: var(--smart-list-slot-header-color, #6e4a12);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82), 0 6px 16px var(--smart-list-slot-header-shadow, rgba(115, 82, 33, 0.08));\n}\n.smart-list__sticky--slot-section .smart-list__sticky-action-btn {\n  border-color: var(--smart-list-slot-header-action-border, rgba(146, 108, 49, 0.24));\n  background: var(--smart-list-slot-header-action-bg, rgba(255, 252, 246, 0.94));\n  color: var(--smart-list-slot-header-action-color, #7a5517);\n}\n.smart-list__sticky-label {\n  min-width: 0;\n}\n.smart-list__sticky-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.22rem;\n  flex: 0 0 auto;\n}\n.smart-list__sticky-action-btn {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  margin: 0;\n  line-height: 0;\n  border-radius: 999px;\n  border: 1px solid rgba(34, 58, 91, 0.24);\n  background: rgba(255, 255, 255, 0.9);\n  color: #244267;\n  display: inline-grid;\n  place-items: center;\n  cursor: pointer;\n}\n.smart-list__sticky-action-btn:disabled {\n  opacity: 0.38;\n  cursor: default;\n  pointer-events: none;\n}\n.smart-list__sticky-action-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  display: block;\n  margin: 0;\n}\n.smart-list__group-marker {\n  z-index: 1;\n  scroll-snap-align: none;\n  overflow-anchor: none;\n  border: 1px solid rgba(39, 60, 92, 0.16);\n  border-radius: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f3f8ff 100%);\n  color: rgba(31, 58, 92, 0.9);\n  font-size: 0.78rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  padding: 0.32rem 0.58rem;\n}\n.smart-list__empty {\n  margin: auto 0;\n  overflow-anchor: none;\n  border: 1px dashed rgba(37, 54, 82, 0.16);\n  border-radius: 18px;\n  background: rgba(248, 250, 253, 0.92);\n  padding: 1.15rem 1rem;\n  text-align: center;\n}\n.smart-list__empty h4 {\n  margin: 0;\n  color: #18314d;\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n.smart-list__empty p {\n  margin: 0.45rem 0 0;\n  color: rgba(27, 45, 69, 0.74);\n  font-size: 0.82rem;\n  line-height: 1.45;\n}\n@media (max-width: 760px) {\n  .smart-list__surface--fullscreen-with-rating-bar {\n    --smart-list-fullscreen-bottom-offset: calc(5.25rem + env(safe-area-inset-bottom));\n  }\n  .smart-list--page.smart-list--month {\n    padding-bottom: 0;\n    overflow-y: hidden;\n  }\n  .smart-list--list.smart-list--card-grid {\n    --smart-list-card-snap-gap: 0.34rem;\n    display: flex;\n    flex-direction: column;\n    gap: 0.34rem;\n    padding-bottom: 0;\n  }\n  .smart-list--list.smart-list--card-grid.smart-list--mobile-columns {\n    display: grid;\n    grid-template-columns: repeat(var(--smart-list-mobile-columns), minmax(0, 1fr));\n    align-content: start;\n    gap: 0.45rem;\n    padding-bottom: 0.6rem;\n  }\n  .smart-list--list.smart-list--horizontal {\n    --smart-list-horizontal-item-basis: 100%;\n    --smart-list-horizontal-end-inset: 0;\n    flex-direction: row;\n    gap: 0.72rem;\n    padding-bottom: 2rem;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n  }\n  .smart-list__surface--horizontal {\n    margin-inline: var(--smart-list-horizontal-mobile-surface-margin, 0.72rem);\n  }\n  .smart-list__surface--fullscreen {\n    --smart-list-pagination-arrow-inline-offset: -1.1rem;\n    margin-inline: var(--smart-list-fullscreen-mobile-surface-margin, 0.72rem);\n  }\n  .smart-list__surface--fullscreen:has(app-single-card[data-card-presentation=fullscreen]) {\n    margin-inline: 0;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-1,\n  .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-2,\n  .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-3,\n  .smart-list--list.smart-list--horizontal.smart-list--desktop-columns-4 {\n    --smart-list-horizontal-item-basis: 100%;\n  }\n  .smart-list--list.smart-list--horizontal::-webkit-scrollbar {\n    display: none;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--mobile-stepper {\n    scroll-behavior: smooth;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--snap-proximity {\n    scroll-snap-type: x proximity;\n  }\n  .smart-list--list.smart-list--horizontal.smart-list--snap-mandatory {\n    scroll-snap-type: x mandatory;\n  }\n  .smart-list__surface--horizontal .smart-list__pagination-arrows {\n    display: block;\n  }\n  .smart-list__surface--timeline .smart-list__pagination-arrows {\n    display: block;\n  }\n  .smart-list__horizontal-dots {\n    display: flex;\n  }\n  .smart-list--list.smart-list--card-grid .smart-list__sticky,\n  .smart-list--list.smart-list--card-grid .smart-list__group-marker,\n  .smart-list--list.smart-list--card-grid .smart-list__footer-spacer {\n    grid-column: auto;\n  }\n  .smart-list--list.smart-list--card-grid.smart-list--mobile-columns .smart-list__sticky,\n  .smart-list--list.smart-list--card-grid.smart-list--mobile-columns .smart-list__group-marker,\n  .smart-list--list.smart-list--card-grid.smart-list--mobile-columns .smart-list__footer-spacer {\n    grid-column: 1/-1;\n  }\n  .smart-list--list.smart-list--thread {\n    padding-right: 0.08rem;\n  }\n  .smart-list--list.chat-thread-list {\n    transform: translateZ(0);\n    backface-visibility: hidden;\n  }\n}\n/*# sourceMappingURL=smart-list.component.css.map */\n"] }]
  }], null, { scrollHostRef: [{
    type: ViewChild,
    args: ["scrollHost", { read: ElementRef }]
  }], paginationMenuOutlet: [{
    type: ViewChild,
    args: ["paginationMenuOutlet"]
  }], config: [{
    type: Input
  }], loadPage: [{
    type: Input
  }], loaders: [{
    type: Input
  }], itemTemplate: [{
    type: Input
  }], fullscreenItemTemplate: [{
    type: Input
  }], query: [{
    type: Input
  }], view: [{
    type: Input
  }], presentation: [{
    type: Input
  }], sort: [{
    type: Input
  }], direction: [{
    type: Input
  }], filters: [{
    type: Input
  }], groupBy: [{
    type: Input
  }], stateChange: [{
    type: Output
  }], viewChange: [{
    type: Output
  }], itemSelect: [{
    type: Output
  }], menuItemSelect: [{
    type: Output
  }], refresh: [{
    type: Output
  }], onViewportResize: [{
    type: HostListener,
    args: ["window:resize"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SmartListComponent, { className: "SmartListComponent", filePath: "app/shared/ui/components/core/smart-list/smart-list.component.ts", lineNumber: 117 });
})();

export {
  SmartListComponent
};
//# sourceMappingURL=chunk-JWRKXGRX.js.map
