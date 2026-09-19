import {
  CommonModule,
  NgClass,
  NgTemplateOutlet
} from "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  ɵsetClassDebugInfo,
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
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/core/smart-list/smart-list-calendar.adapter.ts
var smartListMonthCalendarAdapter = createMonthCalendarAdapter();
var smartListWeekCalendarAdapter = createWeekCalendarAdapter();
var SmartListCalendarAdapter = {
  getInstance(mode) {
    if (mode === "month") {
      return smartListMonthCalendarAdapter;
    }
    if (mode === "week") {
      return smartListWeekCalendarAdapter;
    }
    return null;
  }
};
function countSmartListCalendarOverlaps(items, start, end, resolveDateRange) {
  let count = 0;
  for (const item of items) {
    const range = resolveDateRange(item);
    if (!range) {
      continue;
    }
    if (range.start.getTime() < end.getTime() && range.end.getTime() > start.getTime()) {
      count += 1;
    }
  }
  return count;
}
function createMonthCalendarAdapter() {
  return {
    mode: "month",
    config: calendarConfig,
    variant: calendarVariant,
    anchorRadius,
    initialAnchor,
    initialAnchorKey,
    normalizeAnchor: (anchor) => AppUtils.startOfMonth(anchor),
    keyForAnchor: (anchor) => AppUtils.monthKey(AppUtils.startOfMonth(anchor)),
    shiftAnchor: (anchor, direction) => AppUtils.addMonths(AppUtils.startOfMonth(anchor), direction),
    queryForAnchor: (query, anchor) => queryForAnchor(query, AppUtils.startOfMonth(anchor), monthRangeForAnchor),
    anchorForPage: (page) => page.anchor,
    labelForPage: (page) => page.label,
    buildPage: (context) => {
      const anchor = AppUtils.startOfMonth(context.anchor);
      const resolveDateRange = (item) => context.viewConfig.resolveDateRange(item, context.query);
      const items = [...context.items];
      const itemsByDate = buildCalendarItemsByDate(items, resolveDateRange, (value) => AppUtils.dateKey(value));
      return buildCalendarMonthPage(anchor, itemsByDate, items, resolveDateRange, {
        trackByKey: context.trackByKey,
        dateKey: (value) => AppUtils.dateKey(value),
        monthKey: (value) => AppUtils.monthKey(value)
      });
    }
  };
}
function createWeekCalendarAdapter() {
  return {
    mode: "week",
    config: calendarConfig,
    variant: calendarVariant,
    anchorRadius,
    initialAnchor,
    initialAnchorKey,
    normalizeAnchor: (anchor) => AppUtils.startOfWeekMonday(anchor),
    keyForAnchor: (anchor) => AppUtils.dateKey(AppUtils.startOfWeekMonday(anchor)),
    shiftAnchor: (anchor, direction) => AppUtils.addDays(AppUtils.startOfWeekMonday(anchor), direction * 7),
    queryForAnchor: (query, anchor) => queryForAnchor(query, AppUtils.startOfWeekMonday(anchor), weekRangeForAnchor),
    anchorForPage: (page) => page.anchor,
    labelForPage: (page) => page.label,
    buildPage: (context) => {
      const anchor = AppUtils.startOfWeekMonday(context.anchor);
      const resolveDateRange = (item) => context.viewConfig.resolveDateRange(item, context.query);
      const itemsByDate = buildCalendarItemsByDate([...context.items], resolveDateRange, (value) => AppUtils.dateKey(value));
      return buildCalendarWeekPage(anchor, itemsByDate, (value) => AppUtils.dateKey(value));
    }
  };
}
function calendarConfig(config) {
  return config.calendar ?? null;
}
function calendarVariant(config, query) {
  const value = config.calendarVariant;
  if (typeof value === "function") {
    return value(query);
  }
  return value ?? "default";
}
function anchorRadius(calendar) {
  return Math.max(0, Math.trunc(calendar?.anchorRadius ?? 1));
}
function initialAnchor(calendar, query) {
  const parsed = AppUtils.parseDate(resolveInitialAnchorValue(calendar, query));
  return parsed ? AppUtils.dateOnly(parsed) : null;
}
function initialAnchorKey(calendar, query) {
  const parsed = AppUtils.parseDate(resolveInitialAnchorValue(calendar, query));
  return parsed ? AppUtils.dateKey(parsed) : "";
}
function resolveInitialAnchorValue(calendar, query) {
  const value = calendar?.initialAnchor;
  if (typeof value === "function") {
    return value(query);
  }
  return value ?? null;
}
function queryForAnchor(query, normalizedAnchor, rangeForAnchor) {
  const range = rangeForAnchor(normalizedAnchor);
  return __spreadProps(__spreadValues({}, query), {
    page: 0,
    anchorDate: AppUtils.dateKey(normalizedAnchor),
    rangeStart: AppUtils.dateKey(range.start),
    rangeEnd: AppUtils.dateKey(range.end)
  });
}
function monthRangeForAnchor(anchor) {
  const monthStart = AppUtils.startOfMonth(anchor);
  return {
    start: AppUtils.startOfWeekMonday(monthStart),
    end: AppUtils.endOfWeekSunday(AppUtils.endOfMonth(monthStart))
  };
}
function weekRangeForAnchor(anchor) {
  const weekStart = AppUtils.startOfWeekMonday(anchor);
  return {
    start: weekStart,
    end: AppUtils.endOfWeekSunday(weekStart)
  };
}
function buildCalendarItemsByDate(items, resolveDateRange, dateKey) {
  const byDate = /* @__PURE__ */ new Map();
  for (const item of items) {
    const range = resolveDateRange(item);
    if (!range) {
      continue;
    }
    let cursor = AppUtils.dateOnly(range.start);
    const endDate = AppUtils.dateOnly(range.end);
    while (cursor.getTime() <= endDate.getTime()) {
      const key = dateKey(cursor);
      const current = byDate.get(key) ?? [];
      current.push(item);
      byDate.set(key, current);
      cursor = AppUtils.addDays(cursor, 1);
    }
  }
  return byDate;
}
function buildCalendarMonthPage(anchor, itemsByDate, items, resolveDateRange, keys) {
  const firstDay = AppUtils.startOfMonth(anchor);
  const firstWeekStart = AppUtils.startOfWeekMonday(firstDay);
  const monthEnd = AppUtils.endOfMonth(anchor);
  const lastWeekEnd = AppUtils.endOfWeekSunday(monthEnd);
  const weeks = [];
  let cursor = AppUtils.dateOnly(firstWeekStart);
  while (cursor.getTime() <= lastWeekEnd.getTime()) {
    const weekStart = AppUtils.dateOnly(cursor);
    const weekEnd = AppUtils.addDays(weekStart, 6);
    const days = [];
    for (let day = 0; day < 7; day += 1) {
      const date = AppUtils.addDays(cursor, day);
      days.push(buildCalendarDay(date, itemsByDate, firstDay.getMonth(), keys.dateKey));
    }
    weeks.push({
      start: weekStart,
      end: weekEnd,
      days,
      spans: buildMonthWeekSpans(weekStart, weekEnd, items, resolveDateRange, keys)
    });
    cursor = AppUtils.addDays(cursor, 7);
  }
  return {
    key: keys.monthKey(anchor),
    label: anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    anchor: AppUtils.startOfMonth(anchor),
    weeks
  };
}
function buildCalendarWeekPage(anchor, itemsByDate, dateKey) {
  const start = AppUtils.startOfWeekMonday(anchor);
  const days = [];
  for (let day = 0; day < 7; day += 1) {
    const date = AppUtils.addDays(start, day);
    days.push(buildCalendarDay(date, itemsByDate, date.getMonth(), dateKey));
  }
  const end = AppUtils.addDays(start, 6);
  return {
    key: dateKey(start),
    label: weekRangeLabel(start, end),
    anchor: start,
    days
  };
}
function buildMonthWeekSpans(weekStart, weekEnd, items, resolveDateRange, keys) {
  const spansBase = [];
  for (const item of items) {
    const range = resolveDateRange(item);
    if (!range) {
      continue;
    }
    const startDate = AppUtils.dateOnly(range.start);
    const endDate = AppUtils.dateOnly(range.end);
    if (!AppUtils.dateRangeOverlaps(startDate, endDate, weekStart, weekEnd)) {
      continue;
    }
    const visibleStart = startDate.getTime() < weekStart.getTime() ? weekStart : startDate;
    const visibleEnd = endDate.getTime() > weekEnd.getTime() ? weekEnd : endDate;
    spansBase.push({
      item,
      startCol: Math.max(0, dayDiff(weekStart, visibleStart)),
      endCol: Math.min(6, dayDiff(weekStart, visibleEnd))
    });
  }
  spansBase.sort((first, second) => first.startCol - second.startCol || second.endCol - first.endCol);
  const lanes = [];
  const spans = [];
  for (const span of spansBase) {
    let laneIndex = 0;
    while (laneIndex < lanes.length) {
      const conflict = lanes[laneIndex].some((item) => !(span.endCol < item.startCol || span.startCol > item.endCol));
      if (!conflict) {
        break;
      }
      laneIndex += 1;
    }
    if (!lanes[laneIndex]) {
      lanes[laneIndex] = [];
    }
    lanes[laneIndex].push({ startCol: span.startCol, endCol: span.endCol });
    spans.push({
      key: `${keys.trackByKey(span.item)}-${keys.dateKey(weekStart)}-${span.startCol}-${span.endCol}-${laneIndex}`,
      item: span.item,
      startCol: span.startCol,
      endCol: span.endCol,
      lane: laneIndex
    });
  }
  return spans;
}
function buildCalendarDay(date, itemsByDate, currentMonthIndex, dateKey) {
  const safeDate = AppUtils.dateOnly(date);
  const key = dateKey(safeDate);
  const todayKey = dateKey(AppUtils.dateOnly(/* @__PURE__ */ new Date()));
  return {
    key,
    date: safeDate,
    dayNumber: safeDate.getDate(),
    inCurrentMonth: safeDate.getMonth() === currentMonthIndex,
    isToday: key === todayKey,
    items: itemsByDate.get(key) ?? []
  };
}
function weekRangeLabel(start, end) {
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startLabel} - ${endLabel}`;
}
function dayDiff(from, to) {
  const ms = AppUtils.dateOnly(to).getTime() - AppUtils.dateOnly(from).getTime();
  return Math.floor(ms / 864e5);
}

// src/app/shared/ui/components/core/smart-list/card/calendar-card/calendar-card.component.ts
var _c0 = [[["", "smart-list-page-card-header", ""]], [["", "calendar-card-header", ""]]];
var _c1 = ["[smart-list-page-card-header]", "[calendar-card-header]"];
function CalendarCardComponent_Conditional_3_For_1_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dayLabel_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(dayLabel_r1);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r5 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r5.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r5.alertLabel);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const day_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r3, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r5 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r5));
    \u0275\u0275attribute("aria-label", counter_r5.ariaLabel || counter_r5.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r5.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r5.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Template, 4, 4, "button", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_35_0;
    const day_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("smart-list__month-cell--outside", !day_r3.inCurrentMonth)("smart-list__month-cell--today", day_r3.isToday)("smart-list__month-cell--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r3.dayNumber);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_35_0 = ctx_r3.isCounterCalendarVariant() && ctx_r3.calendarDayCounter(day_r3)) ? 3 : -1, tmp_35_0);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_For_2_Template_button_click_0_listener($event) {
      const span_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r3.selectItem(span_r7.item, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const span_r7 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275styleProp("left", span_r7.startCol * 100 / 7, "%")("width", (span_r7.endCol - span_r7.startCol + 1) * 100 / 7, "%")("top", 18 + span_r7.lane * 20, "px");
    \u0275\u0275property("ngClass", ctx_r3.calendarBadgeToneClass(span_r7.item));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.calendarBadgeLabel(span_r7.item));
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275repeaterCreate(1, CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_For_2_Template, 3, 8, "button", 13, \u0275\u0275componentInstance().trackByCalendarSpanKey, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const week_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(week_r8.spans);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275repeaterCreate(1, CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Template, 4, 8, "div", 7, \u0275\u0275componentInstance().trackByCalendarDayKey, true);
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_Template, 3, 0, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const week_r8 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("smart-list__month-week--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance();
    \u0275\u0275repeater(week_r8.days);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r3.isCounterCalendarVariant() && week_r8.spans.length > 0 ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_3_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 3);
    \u0275\u0275repeaterCreate(2, CalendarCardComponent_Conditional_3_For_1_For_3_Template, 2, 1, "span", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 4);
    \u0275\u0275repeaterCreate(5, CalendarCardComponent_Conditional_3_For_1_For_6_Template, 4, 3, "div", 5, \u0275\u0275componentInstance().trackByCalendarMonthWeekKey, true);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const page_r9 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("--month-week-count", page_r9.weeks.length);
    \u0275\u0275classProp("smart-list__calendar-page--month-six-weeks", page_r9.weeks.length === 6)("smart-list__calendar-page--month-counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.calendarWeekdayLabels());
    \u0275\u0275advance(2);
    \u0275\u0275classProp("smart-list__month-grid--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance();
    \u0275\u0275repeater(page_r9.weeks);
  }
}
function CalendarCardComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_3_For_1_Template, 7, 8, "section", 1, \u0275\u0275componentInstance().trackByCalendarPageKey, true);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r3.monthPages());
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r12 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r12.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r12.alertLabel);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const day_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r11, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r12 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r12));
    \u0275\u0275attribute("aria-label", counter_r12.ariaLabel || counter_r12.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r12.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r12.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Template, 4, 4, "button", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_25_0;
    const day_r11 = ctx.$implicit;
    const \u0275$index_53_r13 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("smart-list__week-board-day-head--today", day_r11.isToday);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.calendarWeekdayLabels()[\u0275$index_53_r13]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r11.dayNumber);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_25_0 = ctx_r3.isCounterCalendarVariant() && ctx_r3.calendarDayCounter(day_r11)) ? 5 : -1, tmp_25_0);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const hour_r14 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.weekHourLabel(hour_r14), " ");
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r17 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r17.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r17.alertLabel);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const day_r16 = \u0275\u0275nextContext(3).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r16, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r17 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(6);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r17));
    \u0275\u0275attribute("aria-label", counter_r17.ariaLabel || counter_r17.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r17.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r17.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275conditionalCreate(1, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Template, 4, 4, "button", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_32_0;
    const hour_r18 = ctx.$implicit;
    const day_r16 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_32_0 = ctx_r3.calendarHourCounter(day_r16, hour_r18)) ? 1 : -1, tmp_32_0);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Template, 2, 1, "div", 26, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r20 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r20.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r20.alertLabel);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r19);
      const day_r16 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r16, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r20 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r20));
    \u0275\u0275attribute("aria-label", counter_r20.ariaLabel || counter_r20.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r20.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r20.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_For_1_Template, 1, 0, "div", 29, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(2, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Template, 4, 4, "button", 30);
  }
  if (rf & 2) {
    let tmp_23_0;
    const day_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_23_0 = ctx_r3.calendarDayCounter(day_r16)) ? 2 : -1, tmp_23_0);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_3_Template_button_click_0_listener($event) {
      const badge_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r3.selectItem(badge_r22.item, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const badge_r22 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275styleProp("top", badge_r22.topPct, "%")("height", badge_r22.heightPct, "%");
    \u0275\u0275property("ngClass", ctx_r3.calendarBadgeToneClass(badge_r22.item));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.calendarBadgeLabel(badge_r22.item));
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_1_Template, 1, 0, "div", 29, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275repeaterCreate(2, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_3_Template, 3, 6, "button", 32, \u0275\u0275componentInstance().trackByCalendarTimedBadge, true);
  }
  if (rf & 2) {
    const day_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.weekDayTimedBadges(day_r16));
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275conditionalCreate(1, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_Template, 2, 0)(2, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Template, 3, 1)(3, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_Template, 4, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r16 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("smart-list__week-day-col--today", day_r16.isToday)("smart-list__week-day-col--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.isCounterCalendarVariant() && ctx_r3.calendarCounterGranularity() === "hour" ? 1 : ctx_r3.isCounterCalendarVariant() ? 2 : 3);
  }
}
function CalendarCardComponent_Conditional_4_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 15)(1, "div", 16);
    \u0275\u0275element(2, "div", 17);
    \u0275\u0275repeaterCreate(3, CalendarCardComponent_Conditional_4_For_1_For_4_Template, 6, 5, "div", 18, \u0275\u0275componentInstance().trackByCalendarDayKey, true);
    \u0275\u0275elementStart(5, "div", 19);
    \u0275\u0275repeaterCreate(6, CalendarCardComponent_Conditional_4_For_1_For_7_Template, 2, 1, "div", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(8, CalendarCardComponent_Conditional_4_For_1_For_9_Template, 4, 5, "div", 21, \u0275\u0275componentInstance().trackByCalendarDayKey, true);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const page_r23 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("--week-slot-count", ctx_r3.calendarWeekHours().length);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r23.days);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r23.days);
  }
}
function CalendarCardComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_Template, 10, 2, "section", 15, \u0275\u0275componentInstance().trackByCalendarPageKey, true);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r3.weekPages());
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tick_r24 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(tick_r24.label);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 42);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275repeaterCreate(1, CalendarCardComponent_Conditional_5_For_1_For_7_For_2_Template, 1, 0, "div", 42, \u0275\u0275componentInstance().trackByTimelineTickKey, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r25 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(page_r25.ticks);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 44);
  }
  if (rf & 2) {
    const templateRef_r28 = \u0275\u0275nextContext();
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngTemplateOutlet", templateRef_r28)("ngTemplateOutletContext", ctx)("ngTemplateOutletInjector", (ctx_r3.model == null ? null : ctx_r3.model.itemTemplateInjector) || null);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Conditional_0_Template, 1, 3, "ng-container", 44);
  }
  if (rf & 2) {
    let tmp_23_0;
    const ctx_r28 = \u0275\u0275nextContext();
    const span_r27 = ctx_r28.$implicit;
    const $index_r30 = ctx_r28.$index;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_23_0 = ctx_r3.timelineItemContext(span_r27, $index_r30)) ? 0 : -1, tmp_23_0);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const span_r27 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(span_r27.meta);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Conditional_2_Template, 2, 1, "small");
  }
  if (rf & 2) {
    const span_r27 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(span_r27.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(span_r27.meta ? 2 : -1);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_5_For_1_For_9_Template_div_click_0_listener($event) {
      const span_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectTimelineSpan(span_r27, $event));
    })("keydown", function CalendarCardComponent_Conditional_5_For_1_For_9_Template_div_keydown_0_listener($event) {
      const span_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.onTimelineSpanKeydown(span_r27, $event));
    });
    \u0275\u0275conditionalCreate(1, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Template, 1, 1)(2, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Template, 3, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_34_0;
    const span_r27 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("left", span_r27.leftPct, "%")("width", span_r27.widthPct, "%")("top", span_r27.topPx, "px")("height", span_r27.heightPx, "px");
    \u0275\u0275classProp("motion-static", !ctx_r3.timelineItemInteractive())("smart-list__timeline-span--static", !ctx_r3.timelineItemInteractive())("smart-list__timeline-span--template", ctx_r3.timelineItemTemplate() !== null)("smart-list__timeline-span--continues-before", span_r27.continuesBefore)("smart-list__timeline-span--continues-after", span_r27.continuesAfter);
    \u0275\u0275property("ngClass", span_r27.toneClass);
    \u0275\u0275attribute("role", ctx_r3.timelineItemInteractive() ? "button" : null)("tabindex", ctx_r3.timelineItemInteractive() ? 0 : null)("aria-label", ctx_r3.timelineItemInteractive() ? span_r27.ariaLabel : null);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_34_0 = ctx_r3.timelineItemTemplate()) ? 1 : 2, tmp_34_0);
  }
}
function CalendarCardComponent_Conditional_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 35)(1, "div", 36)(2, "div", 37);
    \u0275\u0275repeaterCreate(3, CalendarCardComponent_Conditional_5_For_1_For_4_Template, 3, 1, "div", 38, \u0275\u0275componentInstance().trackByTimelineTickKey, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 39);
    \u0275\u0275repeaterCreate(6, CalendarCardComponent_Conditional_5_For_1_For_7_Template, 3, 0, "div", 40, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275repeaterCreate(8, CalendarCardComponent_Conditional_5_For_1_For_9_Template, 3, 23, "div", 41, \u0275\u0275componentInstance().trackByTimelineSpanKey, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const page_r25 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("--timeline-step-count", page_r25.ticks.length);
    \u0275\u0275advance();
    \u0275\u0275styleProp("--timeline-step-count", page_r25.ticks.length)("--timeline-row-count", page_r25.rowCount)("--timeline-row-h", page_r25.rowHeightPx + "px");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r25.ticks);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.timelineRows(page_r25));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r25.spans);
  }
}
function CalendarCardComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_5_For_1_Template, 10, 8, "section", 34, \u0275\u0275componentInstance().trackByCalendarPageKey, true);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r3.timelinePages());
  }
}
var CalendarCardComponent = class _CalendarCardComponent {
  model = null;
  get isTouching() {
    return this.model?.touching === true;
  }
  trackByCalendarPageKey = (_index, page) => page.key;
  trackByCalendarMonthWeekKey = (_index, week) => `${week.start.toISOString()}-${week.end.toISOString()}`;
  trackByCalendarDayKey = (_index, day) => day.key;
  trackByCalendarSpanKey = (_index, span) => span.key;
  trackByCalendarTimedBadge = (index, badge) => this.calendarTrackKey(index, badge.item);
  trackByTimelineTickKey = (_index, tick) => tick.key;
  trackByTimelineSpanKey = (_index, span) => span.key;
  monthPages() {
    if (this.model?.mode !== "month") {
      return [];
    }
    return this.model?.pages ?? [];
  }
  weekPages() {
    if (this.model?.mode !== "week") {
      return [];
    }
    return this.model?.pages ?? [];
  }
  timelinePages() {
    if (this.model?.mode !== "timeline") {
      return [];
    }
    return this.model?.pages ?? [];
  }
  isMonthMode() {
    return this.model?.mode === "month";
  }
  isWeekMode() {
    return this.model?.mode === "week";
  }
  isCounterCalendarVariant() {
    return this.model?.variant === "counter";
  }
  calendarWeekdayLabels() {
    return this.calendar()?.weekdayLabels ?? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  }
  calendarWeekHours() {
    const startHour = this.calendarWeekStartHour();
    const endHour = this.calendarWeekEndHour();
    return Array.from({ length: Math.max(0, endHour - startHour + 1) }, (_value, index) => startHour + index);
  }
  weekHourLabel(hour) {
    return `${`${hour}`.padStart(2, "0")}:00`;
  }
  calendarCounterGranularity() {
    return this.calendar()?.counterGranularity ?? "hour";
  }
  calendarDayCounter(day) {
    const calendar = this.calendar();
    const query = this.query();
    if (!query) {
      return null;
    }
    const customCounter = calendar?.dayCounter?.(day, query) ?? null;
    if (customCounter) {
      return customCounter;
    }
    const count = day.items.length;
    return count > 0 ? this.counterFromCount(count) : null;
  }
  calendarHourCounter(day, hour) {
    const calendar = this.calendar();
    const query = this.query();
    if (!calendar || !query) {
      return null;
    }
    const customCounter = calendar.hourCounter?.(day, hour, query) ?? null;
    if (customCounter) {
      return customCounter;
    }
    const slotStart = new Date(day.date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    const count = countSmartListCalendarOverlaps(day.items, slotStart, slotEnd, (item) => calendar.resolveDateRange(item, query));
    return count > 0 ? this.counterFromCount(count) : null;
  }
  weekDayTimedBadges(day) {
    const calendar = this.calendar();
    const query = this.query();
    if (!calendar || !query) {
      return [];
    }
    const dayStart = new Date(day.date);
    dayStart.setHours(this.calendarWeekStartHour(), 0, 0, 0);
    const dayEnd = new Date(day.date);
    dayEnd.setHours(this.calendarWeekEndHour() + 1, 0, 0, 0);
    const totalMinutes = Math.max(1, (dayEnd.getTime() - dayStart.getTime()) / 6e4);
    const badges = [];
    for (const item of day.items) {
      const range = calendar.resolveDateRange(item, query);
      if (!range) {
        continue;
      }
      const segmentStart = new Date(Math.max(range.start.getTime(), dayStart.getTime()));
      const segmentEnd = new Date(Math.min(range.end.getTime(), dayEnd.getTime()));
      if (segmentEnd.getTime() <= segmentStart.getTime()) {
        continue;
      }
      const minutesFromTop = (segmentStart.getTime() - dayStart.getTime()) / 6e4;
      const durationMinutes = (segmentEnd.getTime() - segmentStart.getTime()) / 6e4;
      badges.push({
        item,
        topPct: minutesFromTop / totalMinutes * 100,
        heightPct: Math.max(2.2, durationMinutes / totalMinutes * 100)
      });
    }
    return badges;
  }
  counterHeatClassByCount(count) {
    if (count <= 0) {
      return "calendar-counter-heat-0";
    }
    const clamped = Math.min(100, count);
    const normalized = (clamped - 1) / 99;
    if (normalized <= 0.16) {
      return "calendar-counter-heat-1";
    }
    if (normalized <= 0.32) {
      return "calendar-counter-heat-2";
    }
    if (normalized <= 0.5) {
      return "calendar-counter-heat-3";
    }
    if (normalized <= 0.68) {
      return "calendar-counter-heat-4";
    }
    if (normalized <= 0.84) {
      return "calendar-counter-heat-5";
    }
    return "calendar-counter-heat-6";
  }
  counterLabel(value) {
    if (!Number.isFinite(value) || value <= 0) {
      return "0";
    }
    return value > 99 ? "99+" : `${value}`;
  }
  calendarBadgeLabel(item) {
    const query = this.query();
    const label = query ? this.calendar()?.badgeLabel?.(item, query) : null;
    if (typeof label === "string" && label.trim()) {
      return label;
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
  calendarBadgeToneClass(item) {
    const query = this.query();
    return query ? this.calendar()?.badgeToneClass?.(item, query) ?? null : null;
  }
  calendarCounterClass(counter) {
    return counter?.toneClass ?? null;
  }
  selectCalendarDay(day, sourceEvent) {
    sourceEvent?.preventDefault();
    sourceEvent?.stopPropagation();
    const item = day.items[0] ?? null;
    if (!item) {
      return;
    }
    this.selectItem(item, sourceEvent, {
      calendarDate: new Date(day.date),
      calendarDateIso: day.key
    });
  }
  selectItem(item, sourceEvent, context) {
    this.model?.onItemSelect?.(item, sourceEvent, context);
  }
  selectTimelineSpan(span, sourceEvent) {
    if (!this.timelineItemInteractive()) {
      return;
    }
    sourceEvent?.preventDefault();
    sourceEvent?.stopPropagation();
    this.selectItem(span.item, sourceEvent, {
      timelineStartOffsetMinutes: span.startOffsetMinutes,
      timelineEndOffsetMinutes: span.endOffsetMinutes
    });
  }
  onTimelineSpanKeydown(span, event) {
    if (!this.timelineItemInteractive()) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    this.selectTimelineSpan(span, event);
  }
  timelineRows(page) {
    return Array.from({ length: Math.max(1, page.rowCount) }, (_item, index) => index);
  }
  timelineItemContext(span, index) {
    return this.model?.itemContext?.(span.item, index) ?? null;
  }
  timelineItemTemplate() {
    if (!this.shouldUseTimelineItemTemplate()) {
      return null;
    }
    return this.model?.itemTemplate ?? null;
  }
  timelineItemInteractive() {
    const config = this.timeline();
    const query = this.query();
    const value = config?.itemInteractive;
    if (typeof value === "function" && query) {
      return value(query) === true;
    }
    if (typeof value === "boolean") {
      return value;
    }
    return !this.shouldUseTimelineItemTemplate();
  }
  shouldUseTimelineItemTemplate() {
    const config = this.timeline();
    const query = this.query();
    const value = config?.useItemTemplate;
    if (typeof value === "function" && query) {
      return value(query) === true;
    }
    return value === true;
  }
  calendarWeekStartHour() {
    return Math.max(0, Math.min(23, Math.trunc(this.calendar()?.weekStartHour ?? 0)));
  }
  calendarWeekEndHour() {
    return Math.max(this.calendarWeekStartHour(), Math.min(23, Math.trunc(this.calendar()?.weekEndHour ?? 23)));
  }
  calendarTrackKey(index, item) {
    return this.model?.trackByItem?.(index, item) ?? index;
  }
  calendar() {
    return this.model?.config ?? null;
  }
  timeline() {
    return this.model?.config ?? null;
  }
  query() {
    return this.model?.query ?? null;
  }
  counterFromCount(count) {
    return {
      label: this.counterLabel(count),
      toneClass: this.counterHeatClassByCount(count)
    };
  }
  static \u0275fac = function CalendarCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CalendarCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CalendarCardComponent, selectors: [["app-calendar-card"], ["app-smart-list-page-card"]], hostVars: 2, hostBindings: function CalendarCardComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("is-touching", ctx.isTouching);
    }
  }, inputs: { model: "model" }, ngContentSelectors: _c1, decls: 6, vars: 1, consts: [[1, "calendar-card__pages"], [1, "smart-list__page", "smart-list__page--month", "smart-list__calendar-page", "smart-list__calendar-page--month", 3, "--month-week-count", "smart-list__calendar-page--month-six-weeks", "smart-list__calendar-page--month-counter"], [1, "smart-list__page", "smart-list__page--month", "smart-list__calendar-page", "smart-list__calendar-page--month"], [1, "smart-list__calendar-weekdays"], [1, "smart-list__month-grid"], [1, "smart-list__month-week", 3, "smart-list__month-week--counter"], [1, "smart-list__month-week"], [1, "smart-list__month-cell", 3, "smart-list__month-cell--outside", "smart-list__month-cell--today", "smart-list__month-cell--counter"], [1, "smart-list__month-week-spans"], [1, "smart-list__month-cell"], [1, "smart-list__month-day-num"], ["type", "button", 1, "smart-list__month-counter", 3, "ngClass"], ["type", "button", 1, "smart-list__month-counter", 3, "click", "ngClass"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__month-span-badge", 3, "ngClass", "left", "width", "top"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__month-span-badge", 3, "click", "ngClass"], [1, "smart-list__page", "smart-list__page--week", "smart-list__calendar-page", "smart-list__calendar-page--week"], [1, "smart-list__week-board"], [1, "smart-list__week-board-corner"], [1, "smart-list__week-board-day-head", 3, "smart-list__week-board-day-head--today"], [1, "smart-list__week-hours-col"], [1, "smart-list__week-hour-label"], [1, "smart-list__week-day-col", 3, "smart-list__week-day-col--today", "smart-list__week-day-col--counter"], [1, "smart-list__week-board-day-head"], ["type", "button", 1, "smart-list__week-counter-head", 3, "ngClass"], ["type", "button", 1, "smart-list__week-counter-head", 3, "click", "ngClass"], [1, "smart-list__week-day-col"], [1, "smart-list__week-hour-slot", "smart-list__week-counter-slot"], ["type", "button", 1, "smart-list__week-hour-counter", 3, "ngClass"], ["type", "button", 1, "smart-list__week-hour-counter", 3, "click", "ngClass"], [1, "smart-list__week-hour-slot"], ["type", "button", 1, "smart-list__week-counter", 3, "ngClass"], ["type", "button", 1, "smart-list__week-counter", 3, "click", "ngClass"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__week-timed-badge", 3, "ngClass", "top", "height"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__week-timed-badge", 3, "click", "ngClass"], [1, "smart-list__page", "smart-list__page--timeline", "smart-list__timeline-page", 3, "--timeline-step-count"], [1, "smart-list__page", "smart-list__page--timeline", "smart-list__timeline-page"], [1, "smart-list__timeline-board"], [1, "smart-list__timeline-header"], [1, "smart-list__timeline-header-cell"], [1, "smart-list__timeline-grid"], [1, "smart-list__timeline-row"], [1, "smart-list__timeline-span", 3, "motion-static", "smart-list__timeline-span--static", "ngClass", "smart-list__timeline-span--template", "smart-list__timeline-span--continues-before", "smart-list__timeline-span--continues-after", "left", "width", "top", "height"], [1, "smart-list__timeline-cell"], [1, "smart-list__timeline-span", 3, "click", "keydown", "ngClass"], [3, "ngTemplateOutlet", "ngTemplateOutletContext", "ngTemplateOutletInjector"]], template: function CalendarCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c0);
      \u0275\u0275projection(0);
      \u0275\u0275projection(1, 1);
      \u0275\u0275elementStart(2, "div", 0);
      \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_Template, 2, 0)(4, CalendarCardComponent_Conditional_4_Template, 2, 0)(5, CalendarCardComponent_Conditional_5_Template, 2, 0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.isMonthMode() ? 3 : ctx.isWeekMode() ? 4 : 5);
    }
  }, dependencies: [CommonModule, NgClass, NgTemplateOutlet], styles: ["\n[_nghost-%COMP%] {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  align-items: stretch;\n  width: 100%;\n  min-height: 0;\n}\n.smart-list--presentation-fullscreen[_nghost-%COMP%], \n.smart-list--month[_nghost-%COMP%], \n.smart-list--week[_nghost-%COMP%], \n.smart-list--timeline[_nghost-%COMP%] {\n  height: 100%;\n}\n.smart-list--week[_nghost-%COMP%], \n.smart-list--timeline[_nghost-%COMP%] {\n  overflow-x: auto;\n  overflow-y: auto;\n}\n@media (max-width: 760px) {\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%] {\n    scroll-snap-type: x mandatory;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n  }\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%]::-webkit-scrollbar {\n    display: none;\n  }\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%]   .smart-list__page--timeline[_ngcontent-%COMP%] {\n    scroll-snap-align: none;\n    scroll-snap-stop: normal;\n  }\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%]   .smart-list__timeline-header-cell[_ngcontent-%COMP%] {\n    scroll-snap-align: start;\n    scroll-snap-stop: normal;\n  }\n}\n.smart-list--month[_nghost-%COMP%] {\n  overflow-x: auto;\n  overflow-y: clip;\n}\n.calendar-card__pages[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n  min-width: 100%;\n  height: 100%;\n  min-height: 0;\n}\n.smart-list__calendar-page[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  min-width: 100%;\n  max-width: 100%;\n  width: 100%;\n  height: 100%;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n  touch-action: pan-x pan-y;\n  padding-right: 0;\n  padding-bottom: 0.48rem;\n  box-sizing: border-box;\n}\n.is-touching[_nghost-%COMP%]   .smart-list__calendar-page[_ngcontent-%COMP%] {\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__calendar-page--month[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  min-width: 0;\n  min-height: 100%;\n  --month-week-count: 5;\n  overflow: hidden;\n}\n.smart-list__calendar-page--week[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__page--timeline[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__calendar-weekdays[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.24rem;\n  margin-bottom: 0.3rem;\n}\n.smart-list__calendar-weekdays[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  text-align: left;\n  color: rgba(31, 58, 92, 0.76);\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n  padding-left: 0.28rem;\n}\n.smart-list__month-grid[_ngcontent-%COMP%] {\n  display: grid;\n  row-gap: 0.34rem;\n  column-gap: 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  min-width: 0;\n  grid-template-rows: repeat(var(--month-week-count), minmax(0, 1fr));\n}\n.smart-list__month-week[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.16rem;\n  min-height: 0;\n  width: 100%;\n  min-width: 0;\n}\n.smart-list__month-cell[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 6.2rem;\n  height: auto;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.2rem;\n  box-sizing: border-box;\n  display: grid;\n  align-content: start;\n  gap: 0.12rem;\n}\n.smart-list__month-cell--outside[_ngcontent-%COMP%] {\n  background: #f6f8fc;\n}\n.smart-list__month-day-num[_ngcontent-%COMP%] {\n  justify-self: center;\n  color: #244267;\n  font-size: 0.7rem;\n  font-weight: 800;\n}\n.smart-list__month-cell--today[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__month-counter[_ngcontent-%COMP%] {\n  justify-self: start;\n  align-self: end;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__month-cell--counter[_ngcontent-%COMP%] {\n  grid-template-rows: auto 1fr;\n  align-content: stretch;\n  align-items: stretch;\n  justify-items: center;\n  gap: 0;\n}\n.smart-list__month-cell--counter[_ngcontent-%COMP%]   .smart-list__month-day-num[_ngcontent-%COMP%] {\n  justify-self: center;\n  align-self: start;\n}\n.smart-list__month-cell--counter[_ngcontent-%COMP%]   .smart-list__month-counter[_ngcontent-%COMP%] {\n  justify-self: center;\n  align-self: center;\n}\n.smart-list__month-counter[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%], \n.smart-list__week-counter-head[_ngcontent-%COMP%], \n.smart-list__week-hour-counter[_ngcontent-%COMP%] {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  background: #eef7f0;\n  color: #1f5135;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1.05;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n  max-width: 100%;\n  white-space: normal;\n}\n.smart-list__month-counter[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  min-width: 0;\n  min-height: 1.48rem;\n  border-radius: 999px;\n  padding: 0.16rem 0.36rem;\n}\n.smart-list__month-counter[_ngcontent-%COMP%] {\n  justify-self: center;\n  align-self: center;\n  margin-top: 0.12rem;\n}\n.smart-list__month-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.smart-list__week-counter-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.smart-list__week-hour-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  min-width: 1rem;\n  min-height: 1rem;\n  border-radius: 999px;\n  background: #c93838;\n  color: #fff;\n  font-size: 0.56rem;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.2rem;\n  box-sizing: border-box;\n}\n.smart-list__month-counter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.smart-list__week-counter-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.smart-list__week-hour-counter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  white-space: nowrap;\n}\n.smart-list__month-counter.calendar-counter-empty[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-empty[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-empty[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-empty[_ngcontent-%COMP%] {\n  background: #f4f7fb;\n  color: #5a6f88;\n}\n.smart-list__month-counter.calendar-counter-full[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-full[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-full[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-full[_ngcontent-%COMP%] {\n  background: #f4f7fb;\n  border-color: rgba(105, 119, 140, 0.28);\n  color: #5a4658;\n}\n.smart-list__month-counter.calendar-counter-booked-full[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-booked-full[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-booked-full[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-booked-full[_ngcontent-%COMP%] {\n  background: #fff3e4;\n  border-color: rgba(183, 113, 37, 0.3);\n  color: #7a4515;\n}\n.smart-list__month-counter.calendar-counter-over[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-over[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-over[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-over[_ngcontent-%COMP%] {\n  background: #fff0f0;\n  border-color: rgba(196, 60, 60, 0.34);\n  color: #8a2828;\n}\n.smart-list__month-week-spans[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.smart-list__calendar-badge[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(39, 70, 108, 0.2);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e8f0ff 100%);\n  color: #214268;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1.2;\n  text-align: left;\n  padding: 0.16rem 0.42rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: clip;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__calendar-badge.calendar-badge-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__calendar-badge.calendar-badge-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__calendar-badge.calendar-badge-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__calendar-badge.calendar-badge-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__calendar-badge.calendar-badge-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9e9 0%,\n      #edf3d9 100%);\n  border-color: rgba(106, 135, 43, 0.28);\n  color: #4f6520;\n}\n.smart-list__calendar-badge.calendar-badge-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f3f7 0%,\n      #e6ebf2 100%);\n  border-color: rgba(78, 98, 128, 0.28);\n  color: #2f435e;\n}\n.smart-list__month-span-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  pointer-events: auto;\n  z-index: 3;\n  width: auto;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  min-height: 18px;\n  padding: 0.1rem 0.34rem;\n}\n.smart-list__week-board[_ngcontent-%COMP%] {\n  --week-slot-h: 34px;\n  --week-slot-count: 24;\n  display: grid;\n  grid-template-columns: 34px repeat(7, minmax(0, 1fr));\n  grid-template-rows: auto auto;\n  gap: 0;\n  min-height: max(100%, var(--week-slot-count) * var(--week-slot-h) + 34px);\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-board-corner[_ngcontent-%COMP%] {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-bottom: 0;\n  border-right: 0;\n  border-radius: 10px 0 0 0;\n  background: #f6f9ff;\n}\n.smart-list__week-board-day-head[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-bottom: 0;\n  background: #fff;\n  gap: 0.06rem;\n  padding: 0.18rem 0.14rem;\n  color: #244267;\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-board-day-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.smart-list__week-counter-head[_ngcontent-%COMP%] {\n  margin-top: 0.1rem;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter-head[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n  min-height: 1.16rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  border-radius: 999px;\n  padding: 0.1rem 0.24rem;\n  font-size: 0.58rem;\n}\n.smart-list__week-board-day-head--today[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hours-col[_ngcontent-%COMP%] {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-top: 0;\n  border-right: 0;\n  border-radius: 0 0 0 10px;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background: #fff;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-hour-label[_ngcontent-%COMP%] {\n  padding: 0.28rem 0.12rem 0 0.18rem;\n  color: rgba(37, 63, 96, 0.72);\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-day-col[_ngcontent-%COMP%] {\n  position: relative;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-top: 0;\n  background: #fff;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-day-col[_ngcontent-%COMP%]:last-child {\n  border-radius: 0 0 10px 0;\n}\n.smart-list__week-day-col--today[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hour-slot[_ngcontent-%COMP%] {\n  height: var(--week-slot-h);\n  border: 0;\n}\n.smart-list__week-counter-slot[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(33, 54, 82, 0.12);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.smart-list__week-counter-slot[_ngcontent-%COMP%]:first-child {\n  border-top: 0;\n}\n.smart-list__week-hour-counter[_ngcontent-%COMP%] {\n  min-width: 1.18rem;\n  min-height: 1.18rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.18rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 2;\n  left: 4px;\n  right: 4px;\n  top: 8px;\n  min-height: 1.7rem;\n}\n.smart-list__week-timed-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 2px;\n  right: 2px;\n  width: auto;\n  z-index: 2;\n  border-radius: 8px;\n  padding: 0.12rem 0.26rem;\n  white-space: normal;\n  text-wrap: pretty;\n  overflow: clip;\n  text-overflow: clip;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-break: auto;\n  -webkit-hyphens: auto;\n  hyphens: auto;\n  display: flex;\n  align-items: flex-start;\n}\n.smart-list__week-timed-badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-height: 1.15;\n}\n.smart-list__timeline-board[_ngcontent-%COMP%] {\n  --timeline-step-count: 8;\n  --timeline-row-count: 1;\n  --timeline-row-h: 64px;\n  display: grid;\n  grid-template-rows: auto auto;\n  width: 100%;\n  min-width: 0;\n  min-height: max(100%, var(--timeline-row-count) * var(--timeline-row-h) + 34px);\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  overflow: hidden;\n  touch-action: pan-x pan-y;\n}\n.smart-list__timeline-header[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 4;\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-height: 34px;\n  background: #f6f9ff;\n  border-bottom: 1px solid rgba(37, 63, 96, 0.18);\n}\n.smart-list__timeline-header-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  padding: 0.28rem 0.4rem;\n  border-left: 1px solid rgba(37, 63, 96, 0.14);\n  color: rgba(37, 63, 96, 0.78);\n  font-size: 0.64rem;\n  font-weight: 850;\n  line-height: 1;\n  box-sizing: border-box;\n}\n.smart-list__timeline-header-cell[_ngcontent-%COMP%]:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-header-cell[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.smart-list__timeline-grid[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-rows: repeat(var(--timeline-row-count), var(--timeline-row-h));\n  min-height: calc(var(--timeline-row-count) * var(--timeline-row-h));\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(249, 251, 255, 0.98) 100%);\n}\n.smart-list__timeline-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__timeline-row[_ngcontent-%COMP%]    + .smart-list__timeline-row[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(37, 63, 96, 0.12);\n}\n.smart-list__timeline-cell[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 0;\n  border-left: 1px solid rgba(37, 63, 96, 0.1);\n  background: rgba(255, 255, 255, 0.42);\n}\n.smart-list__timeline-cell[_ngcontent-%COMP%]:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 0.1rem;\n  min-width: 2.8rem;\n  border: 1px solid rgba(39, 70, 108, 0.22);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e7efff 100%);\n  color: #214268;\n  box-shadow: 0 5px 14px rgba(36, 65, 104, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72);\n  font: inherit;\n  font-size: 0.7rem;\n  font-weight: 800;\n  line-height: 1.15;\n  text-align: left;\n  padding: 0.24rem 0.42rem;\n  overflow: hidden;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n}\n.smart-list__timeline-span--template[_ngcontent-%COMP%] {\n  min-width: 6.5rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  box-shadow: none;\n  padding: 0;\n  overflow: visible;\n}\n.smart-list__timeline-span--static[_ngcontent-%COMP%] {\n  cursor: default;\n  -webkit-tap-highlight-color: transparent;\n  transition: none;\n  animation: none;\n  transform: none;\n  filter: none;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(57, 108, 182, 0.62);\n  outline-offset: 2px;\n}\n.smart-list__timeline-span--continues-before[_ngcontent-%COMP%] {\n  border-top-left-radius: 2px;\n  border-bottom-left-radius: 2px;\n}\n.smart-list__timeline-span--continues-after[_ngcontent-%COMP%] {\n  border-top-right-radius: 2px;\n  border-bottom-right-radius: 2px;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.smart-list__timeline-span[_ngcontent-%COMP%]    > small[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]    > small[_ngcontent-%COMP%] {\n  color: rgba(35, 61, 95, 0.72);\n  font-size: 0.58rem;\n  font-weight: 750;\n  line-height: 1.12;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n}\n[_nghost-%COMP%]     .smart-list__timeline-span > * {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n.smart-list__timeline-span.calendar-badge-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__timeline-span.calendar-badge-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__timeline-span.calendar-badge-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__timeline-span.calendar-badge-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__timeline-span.calendar-badge-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__timeline-span.calendar-badge-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__month-counter.calendar-counter-heat-0[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-0[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-0[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e8eef7 100%);\n  border-color: rgba(97, 120, 154, 0.18);\n  color: #6a7890;\n}\n.smart-list__month-counter.calendar-counter-heat-1[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-1[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #dfeafb 100%);\n  border-color: rgba(70, 118, 183, 0.22);\n  color: #2d5c99;\n}\n.smart-list__month-counter.calendar-counter-heat-2[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-2[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f3 0%,\n      #d8f1e7 100%);\n  border-color: rgba(55, 146, 104, 0.24);\n  color: #256d4d;\n}\n.smart-list__month-counter.calendar-counter-heat-3[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-3[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e7 0%,\n      #ffecce 100%);\n  border-color: rgba(198, 145, 45, 0.24);\n  color: #8f6115;\n}\n.smart-list__month-counter.calendar-counter-heat-4[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-4[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0e7 0%,\n      #ffe2d2 100%);\n  border-color: rgba(200, 116, 61, 0.26);\n  color: #9b4f23;\n}\n.smart-list__month-counter.calendar-counter-heat-5[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-5[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffeaf0 0%,\n      #ffd7e2 100%);\n  border-color: rgba(196, 77, 121, 0.28);\n  color: #9d2d57;\n}\n.smart-list__month-counter.calendar-counter-heat-6[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-6[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0e6ff 0%,\n      #e2d3ff 100%);\n  border-color: rgba(113, 82, 193, 0.28);\n  color: #5a3d9d;\n}\n@media (max-width: 760px) {\n  .smart-list__calendar-page--month[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 100%;\n    max-width: 100%;\n    min-height: auto;\n    height: auto;\n    padding-bottom: 0.08rem;\n    overflow: hidden;\n    background: #fff;\n    contain: paint;\n    box-shadow: -1px 0 0 #fff, 1px 0 0 #fff;\n  }\n  .smart-list__calendar-page--month-counter[_ngcontent-%COMP%] {\n    grid-template-rows: auto auto;\n  }\n  .smart-list__month-grid[_ngcontent-%COMP%], \n   .smart-list__month-grid--counter[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 0.44rem;\n    height: auto;\n    min-height: 0;\n    width: 100%;\n    min-width: 0;\n  }\n  .smart-list__month-week[_ngcontent-%COMP%], \n   .smart-list__month-week--counter[_ngcontent-%COMP%] {\n    flex: 0 0 5.6rem;\n    height: 5.6rem;\n    min-height: 5.6rem;\n    gap: 0.8rem;\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n  }\n  .smart-list__month-week[_ngcontent-%COMP%]   .smart-list__month-cell[_ngcontent-%COMP%], \n   .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-cell[_ngcontent-%COMP%] {\n    min-height: 0;\n    height: 100%;\n    padding: 0.14rem;\n    border-radius: 9px;\n  }\n  .smart-list__calendar-page--month-six-weeks[_ngcontent-%COMP%]   .smart-list__month-week[_ngcontent-%COMP%], \n   .smart-list__calendar-page--month-six-weeks[_ngcontent-%COMP%]   .smart-list__month-week--counter[_ngcontent-%COMP%] {\n    flex: 0 0 4.72rem;\n    height: 4.72rem;\n    min-height: 4.72rem;\n  }\n  .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-cell--counter[_ngcontent-%COMP%] {\n    grid-template-rows: auto 1fr;\n    align-content: stretch;\n    align-items: stretch;\n    justify-items: center;\n    gap: 0;\n  }\n  .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-day-num[_ngcontent-%COMP%] {\n    justify-self: center;\n    align-self: start;\n    font-size: 0.62rem;\n  }\n  .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-counter[_ngcontent-%COMP%] {\n    min-width: 0.94rem;\n    min-height: 0.94rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n    justify-self: center;\n    align-self: center;\n  }\n  .smart-list__week-counter[_ngcontent-%COMP%], \n   .smart-list__week-counter-head[_ngcontent-%COMP%], \n   .smart-list__week-hour-counter[_ngcontent-%COMP%] {\n    min-height: 1.16rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n  }\n  .smart-list__week-counter[_ngcontent-%COMP%] {\n    left: 2px;\n    right: 2px;\n    min-height: 1.18rem;\n  }\n  .smart-list__month-counter[_ngcontent-%COMP%]:has(strong), \n   .smart-list__week-counter[_ngcontent-%COMP%]:has(strong), \n   .smart-list__week-counter-head[_ngcontent-%COMP%]:has(strong), \n   .smart-list__week-hour-counter[_ngcontent-%COMP%]:has(strong) {\n    flex-direction: column;\n    flex-wrap: nowrap;\n    min-width: 1.38rem;\n    min-height: 1.86rem;\n    padding: 0.14rem 0.16rem;\n    gap: 0.08rem;\n  }\n  .smart-list__month-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .smart-list__week-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .smart-list__week-counter-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .smart-list__week-hour-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    min-width: 0.9rem;\n    min-height: 0.9rem;\n    font-size: 0.52rem;\n    padding: 0 0.16rem;\n  }\n}\n/*# sourceMappingURL=calendar-card.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalendarCardComponent, [{
    type: Component,
    args: [{ selector: "app-calendar-card, app-smart-list-page-card", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<ng-content select="[smart-list-page-card-header]"></ng-content>
<ng-content select="[calendar-card-header]"></ng-content>

<div class="calendar-card__pages">
  @if (isMonthMode()) {
    @for (page of monthPages(); track trackByCalendarPageKey($index, page)) {
      <section
        class="smart-list__page smart-list__page--month smart-list__calendar-page smart-list__calendar-page--month"
        [style.--month-week-count]="page.weeks.length"
        [class.smart-list__calendar-page--month-six-weeks]="page.weeks.length === 6"
        [class.smart-list__calendar-page--month-counter]="isCounterCalendarVariant()"
      >
        <div class="smart-list__calendar-weekdays">
          @for (dayLabel of calendarWeekdayLabels(); track dayLabel) {
            <span>{{ dayLabel }}</span>
          }
        </div>
        <div class="smart-list__month-grid" [class.smart-list__month-grid--counter]="isCounterCalendarVariant()">
          @for (week of page.weeks; track trackByCalendarMonthWeekKey($index, week)) {
            <div
              class="smart-list__month-week"
              [class.smart-list__month-week--counter]="isCounterCalendarVariant()"
            >
              @for (day of week.days; track trackByCalendarDayKey($index, day)) {
                <div
                  class="smart-list__month-cell"
                  [class.smart-list__month-cell--outside]="!day.inCurrentMonth"
                  [class.smart-list__month-cell--today]="day.isToday"
                  [class.smart-list__month-cell--counter]="isCounterCalendarVariant()"
                >
                  <div class="smart-list__month-day-num">{{ day.dayNumber }}</div>
                  @if (isCounterCalendarVariant() && calendarDayCounter(day); as counter) {
                    <button
                      type="button"
                      class="smart-list__month-counter"
                      [ngClass]="calendarCounterClass(counter)"
                      [attr.aria-label]="counter.ariaLabel || counter.label"
                      (click)="selectCalendarDay(day, $event)"
                    >
                      <span>{{ counter.label }}</span>
                      @if (counter.alertLabel) {
                        <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                      }
                    </button>
                  }
                </div>
              }
              @if (!isCounterCalendarVariant() && week.spans.length > 0) {
                <div class="smart-list__month-week-spans">
                  @for (span of week.spans; track trackByCalendarSpanKey($index, span)) {
                    <button
                      type="button"
                      class="smart-list__calendar-badge smart-list__month-span-badge"
                      [ngClass]="calendarBadgeToneClass(span.item)"
                      [style.left.%]="(span.startCol * 100) / 7"
                      [style.width.%]="((span.endCol - span.startCol + 1) * 100) / 7"
                      [style.top.px]="18 + (span.lane * 20)"
                      (click)="selectItem(span.item, $event)"
                    >
                      <span>{{ calendarBadgeLabel(span.item) }}</span>
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>
      </section>
    }
  } @else if (isWeekMode()) {
    @for (page of weekPages(); track trackByCalendarPageKey($index, page)) {
      <section class="smart-list__page smart-list__page--week smart-list__calendar-page smart-list__calendar-page--week">
        <div class="smart-list__week-board" [style.--week-slot-count]="calendarWeekHours().length">
          <div class="smart-list__week-board-corner"></div>
          @for (day of page.days; track trackByCalendarDayKey($index, day); let dayIndex = $index) {
            <div
              class="smart-list__week-board-day-head"
              [class.smart-list__week-board-day-head--today]="day.isToday"
            >
              <span>{{ calendarWeekdayLabels()[dayIndex] }}</span>
              <strong>{{ day.dayNumber }}</strong>
              @if (isCounterCalendarVariant() && calendarDayCounter(day); as counter) {
                <button
                  type="button"
                  class="smart-list__week-counter-head"
                  [ngClass]="calendarCounterClass(counter)"
                  [attr.aria-label]="counter.ariaLabel || counter.label"
                  (click)="selectCalendarDay(day, $event)"
                >
                  <span>{{ counter.label }}</span>
                  @if (counter.alertLabel) {
                    <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                  }
                </button>
              }
            </div>
          }
          <div class="smart-list__week-hours-col">
            @for (hour of calendarWeekHours(); track hour) {
              <div class="smart-list__week-hour-label">
                {{ weekHourLabel(hour) }}
              </div>
            }
          </div>
          @for (day of page.days; track trackByCalendarDayKey($index, day)) {
            <div
              class="smart-list__week-day-col"
              [class.smart-list__week-day-col--today]="day.isToday"
              [class.smart-list__week-day-col--counter]="isCounterCalendarVariant()"
            >
              @if (isCounterCalendarVariant() && calendarCounterGranularity() === 'hour') {
                @for (hour of calendarWeekHours(); track hour) {
                  <div class="smart-list__week-hour-slot smart-list__week-counter-slot">
                    @if (calendarHourCounter(day, hour); as counter) {
                      <button
                        type="button"
                        class="smart-list__week-hour-counter"
                        [ngClass]="calendarCounterClass(counter)"
                        [attr.aria-label]="counter.ariaLabel || counter.label"
                        (click)="selectCalendarDay(day, $event)"
                      >
                        <span>{{ counter.label }}</span>
                        @if (counter.alertLabel) {
                          <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                        }
                      </button>
                    }
                  </div>
                }
              } @else if (isCounterCalendarVariant()) {
                @for (hour of calendarWeekHours(); track hour) {
                  <div class="smart-list__week-hour-slot"></div>
                }
                @if (calendarDayCounter(day); as counter) {
                  <button
                    type="button"
                    class="smart-list__week-counter"
                    [ngClass]="calendarCounterClass(counter)"
                    [attr.aria-label]="counter.ariaLabel || counter.label"
                    (click)="selectCalendarDay(day, $event)"
                  >
                    <span>{{ counter.label }}</span>
                    @if (counter.alertLabel) {
                      <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                    }
                  </button>
                }
              } @else {
                @for (hour of calendarWeekHours(); track hour) {
                  <div class="smart-list__week-hour-slot"></div>
                }
                @for (badge of weekDayTimedBadges(day); track trackByCalendarTimedBadge($index, badge)) {
                  <button
                    type="button"
                    class="smart-list__calendar-badge smart-list__week-timed-badge"
                    [ngClass]="calendarBadgeToneClass(badge.item)"
                    [style.top.%]="badge.topPct"
                    [style.height.%]="badge.heightPct"
                    (click)="selectItem(badge.item, $event)"
                  >
                    <span>{{ calendarBadgeLabel(badge.item) }}</span>
                  </button>
                }
              }
            </div>
          }
        </div>
      </section>
    }
  } @else {
    @for (page of timelinePages(); track trackByCalendarPageKey($index, page)) {
      <section
        class="smart-list__page smart-list__page--timeline smart-list__timeline-page"
        [style.--timeline-step-count]="page.ticks.length"
      >
        <div
          class="smart-list__timeline-board"
          [style.--timeline-step-count]="page.ticks.length"
          [style.--timeline-row-count]="page.rowCount"
          [style.--timeline-row-h]="page.rowHeightPx + 'px'"
        >
          <div class="smart-list__timeline-header">
            @for (tick of page.ticks; track trackByTimelineTickKey($index, tick)) {
              <div class="smart-list__timeline-header-cell">
                <span>{{ tick.label }}</span>
              </div>
            }
          </div>
          <div class="smart-list__timeline-grid">
            @for (row of timelineRows(page); track row) {
              <div class="smart-list__timeline-row">
                @for (tick of page.ticks; track trackByTimelineTickKey($index, tick)) {
                  <div class="smart-list__timeline-cell"></div>
                }
              </div>
            }
            @for (span of page.spans; track trackByTimelineSpanKey($index, span)) {
              <div
                class="smart-list__timeline-span"
                [class.motion-static]="!timelineItemInteractive()"
                [class.smart-list__timeline-span--static]="!timelineItemInteractive()"
                [attr.role]="timelineItemInteractive() ? 'button' : null"
                [attr.tabindex]="timelineItemInteractive() ? 0 : null"
                [ngClass]="span.toneClass"
                [class.smart-list__timeline-span--template]="timelineItemTemplate() !== null"
                [class.smart-list__timeline-span--continues-before]="span.continuesBefore"
                [class.smart-list__timeline-span--continues-after]="span.continuesAfter"
                [style.left.%]="span.leftPct"
                [style.width.%]="span.widthPct"
                [style.top.px]="span.topPx"
                [style.height.px]="span.heightPx"
                [attr.aria-label]="timelineItemInteractive() ? span.ariaLabel : null"
                (click)="selectTimelineSpan(span, $event)"
                (keydown)="onTimelineSpanKeydown(span, $event)"
              >
                @if (timelineItemTemplate(); as templateRef) {
                  @if (timelineItemContext(span, $index); as timelineContext) {
                    <ng-container
                      [ngTemplateOutlet]="templateRef"
                      [ngTemplateOutletContext]="timelineContext"
                      [ngTemplateOutletInjector]="model?.itemTemplateInjector || null"
                    ></ng-container>
                  }
                } @else {
                  <span>{{ span.label }}</span>
                  @if (span.meta) {
                    <small>{{ span.meta }}</small>
                  }
                }
              </div>
            }
          </div>
        </div>
      </section>
    }
  }
</div>
`, styles: ["/* src/app/shared/ui/components/core/smart-list/card/calendar-card/calendar-card.component.scss */\n:host {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  align-items: stretch;\n  width: 100%;\n  min-height: 0;\n}\n:host(.smart-list--presentation-fullscreen),\n:host(.smart-list--month),\n:host(.smart-list--week),\n:host(.smart-list--timeline) {\n  height: 100%;\n}\n:host(.smart-list--week),\n:host(.smart-list--timeline) {\n  overflow-x: auto;\n  overflow-y: auto;\n}\n@media (max-width: 760px) {\n  :host(.smart-list--timeline.smart-list--mobile-stepper) {\n    scroll-snap-type: x mandatory;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n  }\n  :host(.smart-list--timeline.smart-list--mobile-stepper)::-webkit-scrollbar {\n    display: none;\n  }\n  :host(.smart-list--timeline.smart-list--mobile-stepper) .smart-list__page--timeline {\n    scroll-snap-align: none;\n    scroll-snap-stop: normal;\n  }\n  :host(.smart-list--timeline.smart-list--mobile-stepper) .smart-list__timeline-header-cell {\n    scroll-snap-align: start;\n    scroll-snap-stop: normal;\n  }\n}\n:host(.smart-list--month) {\n  overflow-x: auto;\n  overflow-y: clip;\n}\n.calendar-card__pages {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n  min-width: 100%;\n  height: 100%;\n  min-height: 0;\n}\n.smart-list__calendar-page {\n  flex: 0 0 100%;\n  min-width: 100%;\n  max-width: 100%;\n  width: 100%;\n  height: 100%;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n  touch-action: pan-x pan-y;\n  padding-right: 0;\n  padding-bottom: 0.48rem;\n  box-sizing: border-box;\n}\n:host(.is-touching) .smart-list__calendar-page {\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__calendar-page--month {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  min-width: 0;\n  min-height: 100%;\n  --month-week-count: 5;\n  overflow: hidden;\n}\n.smart-list__calendar-page--week {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__page--timeline {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__calendar-weekdays {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.24rem;\n  margin-bottom: 0.3rem;\n}\n.smart-list__calendar-weekdays span {\n  text-align: left;\n  color: rgba(31, 58, 92, 0.76);\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n  padding-left: 0.28rem;\n}\n.smart-list__month-grid {\n  display: grid;\n  row-gap: 0.34rem;\n  column-gap: 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  min-width: 0;\n  grid-template-rows: repeat(var(--month-week-count), minmax(0, 1fr));\n}\n.smart-list__month-week {\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.16rem;\n  min-height: 0;\n  width: 100%;\n  min-width: 0;\n}\n.smart-list__month-cell {\n  min-width: 0;\n  min-height: 6.2rem;\n  height: auto;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.2rem;\n  box-sizing: border-box;\n  display: grid;\n  align-content: start;\n  gap: 0.12rem;\n}\n.smart-list__month-cell--outside {\n  background: #f6f8fc;\n}\n.smart-list__month-day-num {\n  justify-self: center;\n  color: #244267;\n  font-size: 0.7rem;\n  font-weight: 800;\n}\n.smart-list__month-cell--today {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__month-counter {\n  justify-self: start;\n  align-self: end;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__month-cell--counter {\n  grid-template-rows: auto 1fr;\n  align-content: stretch;\n  align-items: stretch;\n  justify-items: center;\n  gap: 0;\n}\n.smart-list__month-cell--counter .smart-list__month-day-num {\n  justify-self: center;\n  align-self: start;\n}\n.smart-list__month-cell--counter .smart-list__month-counter {\n  justify-self: center;\n  align-self: center;\n}\n.smart-list__month-counter,\n.smart-list__week-counter,\n.smart-list__week-counter-head,\n.smart-list__week-hour-counter {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  background: #eef7f0;\n  color: #1f5135;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1.05;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n  max-width: 100%;\n  white-space: normal;\n}\n.smart-list__month-counter,\n.smart-list__week-counter {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  min-width: 0;\n  min-height: 1.48rem;\n  border-radius: 999px;\n  padding: 0.16rem 0.36rem;\n}\n.smart-list__month-counter {\n  justify-self: center;\n  align-self: center;\n  margin-top: 0.12rem;\n}\n.smart-list__month-counter strong,\n.smart-list__week-counter strong,\n.smart-list__week-counter-head strong,\n.smart-list__week-hour-counter strong {\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  min-width: 1rem;\n  min-height: 1rem;\n  border-radius: 999px;\n  background: #c93838;\n  color: #fff;\n  font-size: 0.56rem;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.2rem;\n  box-sizing: border-box;\n}\n.smart-list__month-counter span,\n.smart-list__week-counter span,\n.smart-list__week-counter-head span,\n.smart-list__week-hour-counter span {\n  min-width: 0;\n  white-space: nowrap;\n}\n.smart-list__month-counter.calendar-counter-empty,\n.smart-list__week-counter.calendar-counter-empty,\n.smart-list__week-counter-head.calendar-counter-empty,\n.smart-list__week-hour-counter.calendar-counter-empty {\n  background: #f4f7fb;\n  color: #5a6f88;\n}\n.smart-list__month-counter.calendar-counter-full,\n.smart-list__week-counter.calendar-counter-full,\n.smart-list__week-counter-head.calendar-counter-full,\n.smart-list__week-hour-counter.calendar-counter-full {\n  background: #f4f7fb;\n  border-color: rgba(105, 119, 140, 0.28);\n  color: #5a4658;\n}\n.smart-list__month-counter.calendar-counter-booked-full,\n.smart-list__week-counter.calendar-counter-booked-full,\n.smart-list__week-counter-head.calendar-counter-booked-full,\n.smart-list__week-hour-counter.calendar-counter-booked-full {\n  background: #fff3e4;\n  border-color: rgba(183, 113, 37, 0.3);\n  color: #7a4515;\n}\n.smart-list__month-counter.calendar-counter-over,\n.smart-list__week-counter.calendar-counter-over,\n.smart-list__week-counter-head.calendar-counter-over,\n.smart-list__week-hour-counter.calendar-counter-over {\n  background: #fff0f0;\n  border-color: rgba(196, 60, 60, 0.34);\n  color: #8a2828;\n}\n.smart-list__month-week-spans {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.smart-list__calendar-badge {\n  width: 100%;\n  border: 1px solid rgba(39, 70, 108, 0.2);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e8f0ff 100%);\n  color: #214268;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1.2;\n  text-align: left;\n  padding: 0.16rem 0.42rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: clip;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__calendar-badge.calendar-badge-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__calendar-badge.calendar-badge-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__calendar-badge.calendar-badge-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__calendar-badge.calendar-badge-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__calendar-badge.calendar-badge-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9e9 0%,\n      #edf3d9 100%);\n  border-color: rgba(106, 135, 43, 0.28);\n  color: #4f6520;\n}\n.smart-list__calendar-badge.calendar-badge-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f3f7 0%,\n      #e6ebf2 100%);\n  border-color: rgba(78, 98, 128, 0.28);\n  color: #2f435e;\n}\n.smart-list__month-span-badge {\n  position: absolute;\n  pointer-events: auto;\n  z-index: 3;\n  width: auto;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  min-height: 18px;\n  padding: 0.1rem 0.34rem;\n}\n.smart-list__week-board {\n  --week-slot-h: 34px;\n  --week-slot-count: 24;\n  display: grid;\n  grid-template-columns: 34px repeat(7, minmax(0, 1fr));\n  grid-template-rows: auto auto;\n  gap: 0;\n  min-height: max(100%, var(--week-slot-count) * var(--week-slot-h) + 34px);\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-board-corner {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-bottom: 0;\n  border-right: 0;\n  border-radius: 10px 0 0 0;\n  background: #f6f9ff;\n}\n.smart-list__week-board-day-head {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-bottom: 0;\n  background: #fff;\n  gap: 0.06rem;\n  padding: 0.18rem 0.14rem;\n  color: #244267;\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-board-day-head strong {\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.smart-list__week-counter-head {\n  margin-top: 0.1rem;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter-head {\n  margin-top: 0.08rem;\n  min-height: 1.16rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  border-radius: 999px;\n  padding: 0.1rem 0.24rem;\n  font-size: 0.58rem;\n}\n.smart-list__week-board-day-head--today {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hours-col {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-top: 0;\n  border-right: 0;\n  border-radius: 0 0 0 10px;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background: #fff;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-hour-label {\n  padding: 0.28rem 0.12rem 0 0.18rem;\n  color: rgba(37, 63, 96, 0.72);\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-day-col {\n  position: relative;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-top: 0;\n  background: #fff;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-day-col:last-child {\n  border-radius: 0 0 10px 0;\n}\n.smart-list__week-day-col--today {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hour-slot {\n  height: var(--week-slot-h);\n  border: 0;\n}\n.smart-list__week-counter-slot {\n  border-top: 1px solid rgba(33, 54, 82, 0.12);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.smart-list__week-counter-slot:first-child {\n  border-top: 0;\n}\n.smart-list__week-hour-counter {\n  min-width: 1.18rem;\n  min-height: 1.18rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.18rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter {\n  position: absolute;\n  z-index: 2;\n  left: 4px;\n  right: 4px;\n  top: 8px;\n  min-height: 1.7rem;\n}\n.smart-list__week-timed-badge {\n  position: absolute;\n  left: 2px;\n  right: 2px;\n  width: auto;\n  z-index: 2;\n  border-radius: 8px;\n  padding: 0.12rem 0.26rem;\n  white-space: normal;\n  text-wrap: pretty;\n  overflow: clip;\n  text-overflow: clip;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-break: auto;\n  -webkit-hyphens: auto;\n  hyphens: auto;\n  display: flex;\n  align-items: flex-start;\n}\n.smart-list__week-timed-badge > span {\n  display: block;\n  width: 100%;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-height: 1.15;\n}\n.smart-list__timeline-board {\n  --timeline-step-count: 8;\n  --timeline-row-count: 1;\n  --timeline-row-h: 64px;\n  display: grid;\n  grid-template-rows: auto auto;\n  width: 100%;\n  min-width: 0;\n  min-height: max(100%, var(--timeline-row-count) * var(--timeline-row-h) + 34px);\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  overflow: hidden;\n  touch-action: pan-x pan-y;\n}\n.smart-list__timeline-header {\n  position: sticky;\n  top: 0;\n  z-index: 4;\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-height: 34px;\n  background: #f6f9ff;\n  border-bottom: 1px solid rgba(37, 63, 96, 0.18);\n}\n.smart-list__timeline-header-cell {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  padding: 0.28rem 0.4rem;\n  border-left: 1px solid rgba(37, 63, 96, 0.14);\n  color: rgba(37, 63, 96, 0.78);\n  font-size: 0.64rem;\n  font-weight: 850;\n  line-height: 1;\n  box-sizing: border-box;\n}\n.smart-list__timeline-header-cell:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-header-cell span {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.smart-list__timeline-grid {\n  position: relative;\n  display: grid;\n  grid-template-rows: repeat(var(--timeline-row-count), var(--timeline-row-h));\n  min-height: calc(var(--timeline-row-count) * var(--timeline-row-h));\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(249, 251, 255, 0.98) 100%);\n}\n.smart-list__timeline-row {\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__timeline-row + .smart-list__timeline-row {\n  border-top: 1px solid rgba(37, 63, 96, 0.12);\n}\n.smart-list__timeline-cell {\n  min-width: 0;\n  min-height: 0;\n  border-left: 1px solid rgba(37, 63, 96, 0.1);\n  background: rgba(255, 255, 255, 0.42);\n}\n.smart-list__timeline-cell:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-span {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 0.1rem;\n  min-width: 2.8rem;\n  border: 1px solid rgba(39, 70, 108, 0.22);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e7efff 100%);\n  color: #214268;\n  box-shadow: 0 5px 14px rgba(36, 65, 104, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72);\n  font: inherit;\n  font-size: 0.7rem;\n  font-weight: 800;\n  line-height: 1.15;\n  text-align: left;\n  padding: 0.24rem 0.42rem;\n  overflow: hidden;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n}\n.smart-list__timeline-span--template {\n  min-width: 6.5rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  box-shadow: none;\n  padding: 0;\n  overflow: visible;\n}\n.smart-list__timeline-span--static {\n  cursor: default;\n  -webkit-tap-highlight-color: transparent;\n  transition: none;\n  animation: none;\n  transform: none;\n  filter: none;\n}\n.smart-list__timeline-span:focus-visible {\n  outline: 2px solid rgba(57, 108, 182, 0.62);\n  outline-offset: 2px;\n}\n.smart-list__timeline-span--continues-before {\n  border-top-left-radius: 2px;\n  border-bottom-left-radius: 2px;\n}\n.smart-list__timeline-span--continues-after {\n  border-top-right-radius: 2px;\n  border-bottom-right-radius: 2px;\n}\n.smart-list__timeline-span > span,\n.smart-list__timeline-span > small {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.smart-list__timeline-span > span {\n  white-space: nowrap;\n}\n.smart-list__timeline-span > small {\n  color: rgba(35, 61, 95, 0.72);\n  font-size: 0.58rem;\n  font-weight: 750;\n  line-height: 1.12;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n}\n:host ::ng-deep .smart-list__timeline-span > * {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n.smart-list__timeline-span.calendar-badge-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__timeline-span.calendar-badge-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__timeline-span.calendar-badge-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__timeline-span.calendar-badge-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__timeline-span.calendar-badge-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__timeline-span.calendar-badge-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__month-counter.calendar-counter-heat-0,\n.smart-list__week-counter-head.calendar-counter-heat-0,\n.smart-list__week-hour-counter.calendar-counter-heat-0 {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e8eef7 100%);\n  border-color: rgba(97, 120, 154, 0.18);\n  color: #6a7890;\n}\n.smart-list__month-counter.calendar-counter-heat-1,\n.smart-list__week-counter-head.calendar-counter-heat-1,\n.smart-list__week-hour-counter.calendar-counter-heat-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #dfeafb 100%);\n  border-color: rgba(70, 118, 183, 0.22);\n  color: #2d5c99;\n}\n.smart-list__month-counter.calendar-counter-heat-2,\n.smart-list__week-counter-head.calendar-counter-heat-2,\n.smart-list__week-hour-counter.calendar-counter-heat-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f3 0%,\n      #d8f1e7 100%);\n  border-color: rgba(55, 146, 104, 0.24);\n  color: #256d4d;\n}\n.smart-list__month-counter.calendar-counter-heat-3,\n.smart-list__week-counter-head.calendar-counter-heat-3,\n.smart-list__week-hour-counter.calendar-counter-heat-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e7 0%,\n      #ffecce 100%);\n  border-color: rgba(198, 145, 45, 0.24);\n  color: #8f6115;\n}\n.smart-list__month-counter.calendar-counter-heat-4,\n.smart-list__week-counter-head.calendar-counter-heat-4,\n.smart-list__week-hour-counter.calendar-counter-heat-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0e7 0%,\n      #ffe2d2 100%);\n  border-color: rgba(200, 116, 61, 0.26);\n  color: #9b4f23;\n}\n.smart-list__month-counter.calendar-counter-heat-5,\n.smart-list__week-counter-head.calendar-counter-heat-5,\n.smart-list__week-hour-counter.calendar-counter-heat-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #ffeaf0 0%,\n      #ffd7e2 100%);\n  border-color: rgba(196, 77, 121, 0.28);\n  color: #9d2d57;\n}\n.smart-list__month-counter.calendar-counter-heat-6,\n.smart-list__week-counter-head.calendar-counter-heat-6,\n.smart-list__week-hour-counter.calendar-counter-heat-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #f0e6ff 0%,\n      #e2d3ff 100%);\n  border-color: rgba(113, 82, 193, 0.28);\n  color: #5a3d9d;\n}\n@media (max-width: 760px) {\n  .smart-list__calendar-page--month {\n    width: 100%;\n    min-width: 100%;\n    max-width: 100%;\n    min-height: auto;\n    height: auto;\n    padding-bottom: 0.08rem;\n    overflow: hidden;\n    background: #fff;\n    contain: paint;\n    box-shadow: -1px 0 0 #fff, 1px 0 0 #fff;\n  }\n  .smart-list__calendar-page--month-counter {\n    grid-template-rows: auto auto;\n  }\n  .smart-list__month-grid,\n  .smart-list__month-grid--counter {\n    display: flex;\n    flex-direction: column;\n    gap: 0.44rem;\n    height: auto;\n    min-height: 0;\n    width: 100%;\n    min-width: 0;\n  }\n  .smart-list__month-week,\n  .smart-list__month-week--counter {\n    flex: 0 0 5.6rem;\n    height: 5.6rem;\n    min-height: 5.6rem;\n    gap: 0.8rem;\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n  }\n  .smart-list__month-week .smart-list__month-cell,\n  .smart-list__month-week--counter .smart-list__month-cell {\n    min-height: 0;\n    height: 100%;\n    padding: 0.14rem;\n    border-radius: 9px;\n  }\n  .smart-list__calendar-page--month-six-weeks .smart-list__month-week,\n  .smart-list__calendar-page--month-six-weeks .smart-list__month-week--counter {\n    flex: 0 0 4.72rem;\n    height: 4.72rem;\n    min-height: 4.72rem;\n  }\n  .smart-list__month-week--counter .smart-list__month-cell--counter {\n    grid-template-rows: auto 1fr;\n    align-content: stretch;\n    align-items: stretch;\n    justify-items: center;\n    gap: 0;\n  }\n  .smart-list__month-week--counter .smart-list__month-day-num {\n    justify-self: center;\n    align-self: start;\n    font-size: 0.62rem;\n  }\n  .smart-list__month-week--counter .smart-list__month-counter {\n    min-width: 0.94rem;\n    min-height: 0.94rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n    justify-self: center;\n    align-self: center;\n  }\n  .smart-list__week-counter,\n  .smart-list__week-counter-head,\n  .smart-list__week-hour-counter {\n    min-height: 1.16rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n  }\n  .smart-list__week-counter {\n    left: 2px;\n    right: 2px;\n    min-height: 1.18rem;\n  }\n  .smart-list__month-counter:has(strong),\n  .smart-list__week-counter:has(strong),\n  .smart-list__week-counter-head:has(strong),\n  .smart-list__week-hour-counter:has(strong) {\n    flex-direction: column;\n    flex-wrap: nowrap;\n    min-width: 1.38rem;\n    min-height: 1.86rem;\n    padding: 0.14rem 0.16rem;\n    gap: 0.08rem;\n  }\n  .smart-list__month-counter strong,\n  .smart-list__week-counter strong,\n  .smart-list__week-counter-head strong,\n  .smart-list__week-hour-counter strong {\n    min-width: 0.9rem;\n    min-height: 0.9rem;\n    font-size: 0.52rem;\n    padding: 0 0.16rem;\n  }\n}\n/*# sourceMappingURL=calendar-card.component.css.map */\n"] }]
  }], null, { model: [{
    type: Input
  }], isTouching: [{
    type: HostBinding,
    args: ["class.is-touching"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CalendarCardComponent, { className: "CalendarCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/calendar-card/calendar-card.component.ts", lineNumber: 35 });
})();

export {
  SmartListCalendarAdapter,
  CalendarCardComponent
};
//# sourceMappingURL=chunk-IPHHDSOR.js.map
