import {
  __spreadValues
} from "./chunk-XJL7SWH7.js";

// src/app/shared/app-utils.ts
var ASCII_EMOJI_CONVERSIONS = [
  { token: ":)", emoji: "\u{1F642}", label: "Smile" },
  { token: ":-)", emoji: "\u{1F642}", label: "Smile" },
  { token: "=)", emoji: "\u{1F642}", label: "Smile" },
  { token: ":D", emoji: "\u{1F604}", label: "Grin" },
  { token: ":-D", emoji: "\u{1F604}", label: "Grin" },
  { token: "=D", emoji: "\u{1F604}", label: "Grin" },
  { token: "xD", emoji: "\u{1F606}", label: "Laugh" },
  { token: "XD", emoji: "\u{1F606}", label: "Laugh" },
  { token: ";)", emoji: "\u{1F609}", label: "Wink" },
  { token: ";-)", emoji: "\u{1F609}", label: "Wink" },
  { token: ":(", emoji: "\u{1F641}", label: "Sad" },
  { token: ":-(", emoji: "\u{1F641}", label: "Sad" },
  { token: ":'(", emoji: "\u{1F622}", label: "Cry" },
  { token: ":'-(", emoji: "\u{1F622}", label: "Cry" },
  { token: ":P", emoji: "\u{1F61B}", label: "Tongue" },
  { token: ":-P", emoji: "\u{1F61B}", label: "Tongue" },
  { token: ":p", emoji: "\u{1F61B}", label: "Tongue" },
  { token: ":-p", emoji: "\u{1F61B}", label: "Tongue" },
  { token: ";P", emoji: "\u{1F61C}", label: "Wink tongue" },
  { token: ";-P", emoji: "\u{1F61C}", label: "Wink tongue" },
  { token: ":o", emoji: "\u{1F62E}", label: "Surprise" },
  { token: ":O", emoji: "\u{1F62E}", label: "Surprise" },
  { token: ":-o", emoji: "\u{1F62E}", label: "Surprise" },
  { token: ":-O", emoji: "\u{1F62E}", label: "Surprise" },
  { token: ":/", emoji: "\u{1FAE4}", label: "Unsure" },
  { token: ":-/", emoji: "\u{1FAE4}", label: "Unsure" },
  { token: ":\\", emoji: "\u{1FAE4}", label: "Unsure" },
  { token: ":-\\", emoji: "\u{1FAE4}", label: "Unsure" },
  { token: ":|", emoji: "\u{1F610}", label: "Neutral" },
  { token: ":-|", emoji: "\u{1F610}", label: "Neutral" },
  { token: ":*", emoji: "\u{1F618}", label: "Kiss" },
  { token: ":-*", emoji: "\u{1F618}", label: "Kiss" },
  { token: "<3", emoji: "\u2764\uFE0F", label: "Heart" },
  { token: "</3", emoji: "\u{1F494}", label: "Broken heart" },
  { token: "B)", emoji: "\u{1F60E}", label: "Cool" },
  { token: "B-)", emoji: "\u{1F60E}", label: "Cool" },
  { token: "8)", emoji: "\u{1F60E}", label: "Cool" },
  { token: "8-)", emoji: "\u{1F60E}", label: "Cool" },
  { token: "O:)", emoji: "\u{1F607}", label: "Angel" },
  { token: "O:-)", emoji: "\u{1F607}", label: "Angel" },
  { token: "0:)", emoji: "\u{1F607}", label: "Angel" },
  { token: "0:-)", emoji: "\u{1F607}", label: "Angel" },
  { token: ">:)", emoji: "\u{1F608}", label: "Devil" },
  { token: ">:-)", emoji: "\u{1F608}", label: "Devil" },
  { token: "-_-", emoji: "\u{1F611}", label: "Unamused" }
];
var ASCII_EMOJI_BY_TOKEN = new Map(ASCII_EMOJI_CONVERSIONS.map((conversion) => [conversion.token, conversion]));
var ASCII_EMOJI_TOKEN_REGEX = new RegExp(`(^|[\\s([{])(${ASCII_EMOJI_CONVERSIONS.map((conversion) => conversion.token).sort((first, second) => second.length - first.length).map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?=$|[\\s.,!?;:\\])}])`, "g");
var AppUtils = class {
  static cloneMapItems(input) {
    const output = {};
    for (const [key, value] of Object.entries(input)) {
      output[key] = value.map((item) => __spreadValues({}, item));
    }
    return output;
  }
  static normalizeText(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  static findByAlias(entries, value) {
    const normalized = this.normalizeText(value);
    if (!normalized) {
      return null;
    }
    return entries.find((entry) => entry.aliases.some((alias) => normalized.includes(this.normalizeText(alias)))) ?? null;
  }
  static initialsFromText(value) {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return "U";
    }
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  }
  static hasText(value, minLength = 1) {
    return `${value ?? ""}`.trim().length >= Math.max(0, Math.trunc(minLength));
  }
  static positiveInteger(value, fallback = 0) {
    const parsed = Math.trunc(Number(value));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }
  static normalizeRoutePath(url) {
    const [pathWithQuery] = `${url ?? "/"}`.split("?");
    const [path] = (pathWithQuery || "").split("#");
    const normalized = path.trim();
    if (!normalized || normalized === "/") {
      return "/";
    }
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }
  static normalizeHttpUrl(value) {
    const raw = `${value ?? ""}`.trim();
    if (!raw) {
      return "";
    }
    const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw) ? raw : `https://${raw}`;
    let parsed;
    try {
      parsed = new URL(candidate);
    } catch {
      return "";
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.hostname.trim() ? parsed.toString() : "";
  }
  static openExternalUrl(url, target = "_blank") {
    const normalized = `${url ?? ""}`.trim();
    if (!normalized || typeof window === "undefined") {
      return;
    }
    window.open(normalized, target, "noopener,noreferrer");
  }
  static revokeObjectUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    if (normalized.startsWith("blob:")) {
      URL.revokeObjectURL(normalized);
    }
  }
  static hashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) % 104729;
    }
    return Math.abs(hash);
  }
  static firstImageUrl(images) {
    return (images ?? []).map((image) => `${image ?? ""}`.trim()).find((image) => image.length > 0) ?? "";
  }
  static asciiEmojiConversions() {
    return ASCII_EMOJI_CONVERSIONS;
  }
  static convertAsciiEmojis(value) {
    const text = `${value ?? ""}`;
    if (!text) {
      return "";
    }
    return text.replace(ASCII_EMOJI_TOKEN_REGEX, (_match, prefix, token) => {
      const conversion = ASCII_EMOJI_BY_TOKEN.get(token);
      return conversion ? `${prefix}${conversion.emoji}` : `${prefix}${token}`;
    });
  }
  static trailingAsciiEmojiToken(value) {
    const match = `${value ?? ""}`.match(/(?:^|[\s([{])(\S{1,8})$/);
    const token = `${match?.[1] ?? ""}`.trim();
    return token && this.asciiEmojiSuggestionsForToken(token, 1).length > 0 ? token : "";
  }
  static asciiEmojiSuggestionsForToken(token, limit = 8) {
    const normalized = `${token ?? ""}`.trim();
    if (!normalized) {
      return [];
    }
    const lower = normalized.toLowerCase();
    return ASCII_EMOJI_CONVERSIONS.filter((conversion) => conversion.token.toLowerCase().startsWith(lower)).sort((first, second) => {
      const firstExact = first.token.toLowerCase() === lower ? 0 : 1;
      const secondExact = second.token.toLowerCase() === lower ? 0 : 1;
      return firstExact - secondExact || first.token.length - second.token.length;
    }).slice(0, Math.max(1, Math.trunc(limit)));
  }
  static replaceTrailingAsciiEmojiToken(value, replacement) {
    const text = `${value ?? ""}`;
    const token = this.trailingAsciiEmojiToken(text);
    if (!token) {
      return text;
    }
    return `${text.slice(0, text.length - token.length)}${replacement}`;
  }
  static mediaImageVariantUrl(imageUrl, variant) {
    const normalized = `${imageUrl ?? ""}`.trim();
    if (!normalized) {
      return "";
    }
    const publicKey = this.mediaPublicObjectKey(normalized);
    if (!publicKey) {
      return normalized;
    }
    const variantKey = this.mediaVariantObjectKey(publicKey, variant);
    if (!variantKey) {
      return normalized;
    }
    return normalized.replace(/([?&]key=)([^&#]*)/, (_match, prefix) => `${prefix}${encodeURIComponent(variantKey)}`);
  }
  static mediaImageVariantHtml(html, variant) {
    const normalized = `${html ?? ""}`;
    if (!normalized || typeof document === "undefined") {
      return normalized;
    }
    const template = document.createElement("template");
    template.innerHTML = normalized;
    template.content.querySelectorAll("img[src]").forEach((image) => {
      const sourceUrl = image.getAttribute("src");
      const variantUrl = this.mediaImageVariantUrl(sourceUrl, variant);
      if (variantUrl) {
        image.setAttribute("src", variantUrl);
      }
    });
    return template.innerHTML;
  }
  static removeManagedImageReferencesHtml(html, imageUrls) {
    const normalized = `${html ?? ""}`;
    if (!normalized || typeof document === "undefined") {
      return normalized;
    }
    const removedGroups = new Set(Array.from(imageUrls ?? []).map((imageUrl) => this.managedImageGroupKey(`${imageUrl ?? ""}`)).filter((groupKey) => Boolean(groupKey)));
    if (removedGroups.size === 0) {
      return normalized;
    }
    const template = document.createElement("template");
    template.innerHTML = normalized;
    template.content.querySelectorAll("img, a[href]").forEach((element) => {
      const attribute = element.tagName.toLowerCase() === "img" ? "src" : "href";
      const reference = element.getAttribute(attribute) ?? "";
      if (element.tagName.toLowerCase() === "img" && !reference.trim()) {
        element.remove();
        return;
      }
      const groupKey = this.managedImageGroupKey(reference);
      if (groupKey && removedGroups.has(groupKey)) {
        element.remove();
      }
    });
    template.content.querySelectorAll("figure").forEach((figure) => {
      if (!figure.textContent?.trim() && figure.children.length === 0) {
        figure.remove();
      }
    });
    return template.innerHTML;
  }
  static isHtmlTagPosition(html, offset) {
    const source = `${html ?? ""}`;
    const normalizedOffset = Math.max(0, Math.min(source.length, Math.trunc(Number(offset)) || 0));
    return source.lastIndexOf("<", normalizedOffset - 1) > source.lastIndexOf(">", normalizedOffset - 1);
  }
  static looksLikeHtmlFragment(value) {
    return /^<(?:!--|!doctype\b|\/?[a-z][a-z0-9:-]*(?:\s|>|\/))/i.test(`${value ?? ""}`.trim());
  }
  static uniqueTrimmedStrings(values) {
    return Array.from(new Set(Array.from(values ?? []).map((value) => `${value ?? ""}`.trim()).filter(Boolean)));
  }
  static mediaPublicObjectKey(imageUrl) {
    const match = imageUrl.match(/[?&]key=([^&#]+)/);
    if (!match?.[1]) {
      return null;
    }
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return null;
    }
  }
  static managedImageGroupKey(imageUrl) {
    const objectKey = this.mediaPublicObjectKey(imageUrl);
    if (!objectKey?.startsWith("images/")) {
      return null;
    }
    const slashIndex = objectKey.lastIndexOf("/");
    if (slashIndex <= 0 || slashIndex >= objectKey.length - 1) {
      return null;
    }
    const objectName = objectKey.slice(slashIndex + 1);
    return /^(?:original|small\.webp|medium\.webp|large\.webp)$/.test(objectName) ? objectKey.slice(0, slashIndex) : null;
  }
  static mediaVariantObjectKey(objectKey, variant) {
    if (!objectKey.startsWith("images/")) {
      return null;
    }
    const slashIndex = objectKey.lastIndexOf("/");
    if (slashIndex <= 0 || slashIndex >= objectKey.length - 1) {
      return null;
    }
    const objectName = objectKey.slice(slashIndex + 1);
    if (!/^(?:small|medium|large)\.webp$/.test(objectName)) {
      return null;
    }
    return `${objectKey.slice(0, slashIndex)}/${variant}.webp`;
  }
  static enumValue(value, values, fallback) {
    return this.enumValueOrNull(value, values) ?? fallback;
  }
  static enumValueOrNull(value, values) {
    const normalized = `${value ?? ""}`.trim();
    return values.includes(normalized) ? normalized : null;
  }
  static pad2(value) {
    return `${value}`.padStart(2, "0");
  }
  static fromIsoDate(value) {
    if (!value) {
      return null;
    }
    const parsed = /* @__PURE__ */ new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  static isIsoDate(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      return false;
    }
    return Number.isFinite(Date.parse(`${normalized}T00:00:00Z`));
  }
  static parseDate(value) {
    if (value === null || value === void 0 || value === "") {
      return null;
    }
    if (value instanceof Date) {
      const parsedDate = new Date(value.getTime());
      return Number.isFinite(parsedDate.getTime()) ? parsedDate : null;
    }
    if (typeof value === "number") {
      const parsedNumber = new Date(value);
      return Number.isFinite(parsedNumber.getTime()) ? parsedNumber : null;
    }
    const raw = `${value}`.trim();
    if (!raw) {
      return null;
    }
    const parsed = new Date(raw.replace(/\//g, "-"));
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  }
  static parseDateOnly(value) {
    const parsed = this.parseDate(value);
    return parsed ? this.dateOnly(parsed) : null;
  }
  static parseDateOnlyLocal(value) {
    const raw = `${value ?? ""}`.trim();
    if (!raw) {
      return null;
    }
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = Number.parseInt(match[1], 10);
      const month = Number.parseInt(match[2], 10) - 1;
      const day = Number.parseInt(match[3], 10);
      const parsed2 = new Date(year, month, day);
      return parsed2.getFullYear() === year && parsed2.getMonth() === month && parsed2.getDate() === day ? parsed2 : null;
    }
    const parsed = this.parseDate(value);
    return parsed ? this.dateOnly(parsed) : null;
  }
  static parseDateOnlyRange(startValue, endValue) {
    const start = this.parseDateOnlyLocal(startValue);
    const end = this.parseDateOnlyLocal(endValue);
    return start && end ? { start, end } : null;
  }
  static parseDateRange(startValue, endValue, defaultDurationMs = 2 * 60 * 60 * 1e3) {
    const start = this.parseDate(startValue);
    if (!start) {
      return null;
    }
    const hasEndValue = `${endValue ?? ""}`.trim().length > 0;
    const parsedEnd = hasEndValue ? this.parseDate(endValue) : null;
    if (hasEndValue && !parsedEnd) {
      return null;
    }
    const durationMs = Math.max(0, Math.trunc(Number(defaultDurationMs) || 0));
    const end = parsedEnd && parsedEnd.getTime() > start.getTime() ? parsedEnd : new Date(start.getTime() + durationMs);
    return Number.isFinite(end.getTime()) ? { start, end } : null;
  }
  static dateRangeValuesOverlap(startValue, endValue, rangeStart, rangeEnd, defaultDurationMs = 2 * 60 * 60 * 1e3) {
    const range = this.parseDateRange(startValue, endValue, defaultDurationMs);
    if (!range) {
      return false;
    }
    return this.dateRangeOverlaps(this.dateOnly(range.start), this.dateOnly(range.end), rangeStart, rangeEnd);
  }
  static filterItemsByDateOnlyRange(items, rangeStartValue, rangeEndValue, resolveStartValue, resolveEndValue, defaultDurationMs = 2 * 60 * 60 * 1e3) {
    const range = this.parseDateOnlyRange(rangeStartValue, rangeEndValue);
    if (!range) {
      return [...items];
    }
    return items.filter((item) => this.dateRangeValuesOverlap(resolveStartValue(item), resolveEndValue(item), range.start, range.end, defaultDurationMs));
  }
  static anchorDate(offsetInDays = 0, now = new Date(Date.now())) {
    const base = this.parseDate(now) ?? new Date(Date.now());
    const today = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
    const normalizedOffsetDays = Math.trunc(Number(offsetInDays) || 0);
    return this.addDays(today, normalizedOffsetDays);
  }
  static shiftDate(value, referenceDate, offsetInDays = 0, now = new Date(Date.now())) {
    const parsedValue = this.parseDate(value);
    const parsedReferenceDate = this.parseDate(referenceDate);
    if (!parsedValue || !parsedReferenceDate) {
      return new Date(Number.NaN);
    }
    return new Date(this.anchorDate(offsetInDays, now).getTime() + (parsedValue.getTime() - parsedReferenceDate.getTime()));
  }
  static rebaseDateTime(value, referenceDate, offsetInDays = 0, now = new Date(Date.now())) {
    const shifted = this.shiftDate(value, referenceDate, offsetInDays, now);
    return Number.isFinite(shifted.getTime()) ? this.toIsoDateTimeLocal(shifted) : void 0;
  }
  static dateTimeMs(value) {
    return this.parseDate(value)?.getTime() ?? null;
  }
  static shortMonthDayLabel(value) {
    return value.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  static weekdayMonthDayLabel(value) {
    return value.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }
  static weekdayMonthDayYearLabel(value) {
    return value.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  static clockTimeLabel(value) {
    return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  static dateTimeRangeLabel(startIso, endIso, fallback = "Date unavailable", defaultDurationMs = 2 * 60 * 60 * 1e3) {
    const start = this.parseDate(startIso);
    const end = this.parseDate(endIso);
    if (!start) {
      return fallback;
    }
    const safeEnd = end && end.getTime() > start.getTime() ? end : new Date(start.getTime() + defaultDurationMs);
    const startDateLabel = this.shortMonthDayLabel(start);
    const startTimeLabel = this.clockTimeLabel(start);
    const endTimeLabel = this.clockTimeLabel(safeEnd);
    if (start.toDateString() === safeEnd.toDateString()) {
      return `${startDateLabel}, ${startTimeLabel} - ${endTimeLabel}`;
    }
    return `${startDateLabel}, ${startTimeLabel} - ${this.shortMonthDayLabel(safeEnd)}, ${endTimeLabel}`;
  }
  static toIsoDate(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  static dateKey(value) {
    return this.toIsoDate(this.dateOnly(value));
  }
  static monthKey(value) {
    const copy = this.startOfMonth(value);
    const year = copy.getFullYear();
    const month = `${copy.getMonth() + 1}`.padStart(2, "0");
    return `${year}-${month}`;
  }
  static toIsoDateTime(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    const hours = `${value.getHours()}`.padStart(2, "0");
    const minutes = `${value.getMinutes()}`.padStart(2, "0");
    const seconds = `${value.getSeconds()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  static toIsoDateTimeLocal(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    const hours = `${value.getHours()}`.padStart(2, "0");
    const minutes = `${value.getMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  static isoLocalDateTimeToDate(value) {
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  static isoLocalTimePart(value) {
    const parsed = this.isoLocalDateTimeToDate(value);
    if (!parsed) {
      return "12:00";
    }
    const hours = `${parsed.getHours()}`.padStart(2, "0");
    const minutes = `${parsed.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  static applyDatePartToIsoLocal(current, date) {
    if (!date) {
      return current;
    }
    const base = this.isoLocalDateTimeToDate(current) ?? /* @__PURE__ */ new Date();
    const next = new Date(base);
    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return this.toIsoDateTimeLocal(next);
  }
  static applyTimePartToIsoLocal(current, time) {
    const base = this.isoLocalDateTimeToDate(current) ?? /* @__PURE__ */ new Date();
    const [hoursRaw, minutesRaw] = time.split(":");
    const hours = Number.parseInt(hoursRaw ?? "", 10);
    const minutes = Number.parseInt(minutesRaw ?? "", 10);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return current;
    }
    const next = new Date(base);
    next.setHours(hours, minutes, 0, 0);
    return this.toIsoDateTimeLocal(next);
  }
  static applyTimePartFromDateToIsoLocal(current, value) {
    if (!value) {
      return current;
    }
    const hours = value.getHours();
    const minutes = value.getMinutes();
    return this.applyTimePartToIsoLocal(current, `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}`);
  }
  static clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  static tournamentStageAccentHue(stageNumber, totalStages) {
    const normalizedStageNumber = Math.max(1, Math.trunc(Number(stageNumber) || 1));
    const normalizedTotalStages = Math.max(normalizedStageNumber, Math.trunc(Number(totalStages) || 1));
    if (normalizedTotalStages <= 1) {
      return 210;
    }
    const ratio = this.clampNumber((normalizedStageNumber - 1) / (normalizedTotalStages - 1), 0, 1);
    return Math.round(210 - 210 * ratio);
  }
  static dateOnly(value) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  static dateRangeOverlaps(startA, endA, startB, endB) {
    return startA.getTime() <= endB.getTime() && endA.getTime() >= startB.getTime();
  }
  static addDays(value, days) {
    const copy = new Date(value);
    copy.setDate(copy.getDate() + days);
    return this.dateOnly(copy);
  }
  static addMonths(value, months) {
    const copy = new Date(value.getFullYear(), value.getMonth() + months, 1);
    return this.dateOnly(copy);
  }
  static startOfMonth(value) {
    return this.dateOnly(new Date(value.getFullYear(), value.getMonth(), 1));
  }
  static endOfMonth(value) {
    return this.dateOnly(new Date(value.getFullYear(), value.getMonth() + 1, 0));
  }
  static startOfWeekMonday(value) {
    const copy = this.dateOnly(value);
    const day = copy.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    return this.addDays(copy, mondayOffset);
  }
  static endOfWeekSunday(value) {
    return this.addDays(this.startOfWeekMonday(value), 6);
  }
  static isoWeekNumber(date) {
    const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = copy.getUTCDay() || 7;
    copy.setUTCDate(copy.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
    return Math.ceil(((copy.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
  }
  static activityGroupLabel(row, activitiesView, labels) {
    if (activitiesView === "distance") {
      const distanceMeters = Number.isFinite(row.distanceMetersExact) ? Math.max(0, Math.trunc(Number(row.distanceMetersExact))) : 0;
      const bucket = Math.max(5, Math.ceil(distanceMeters / 5e3) * 5);
      return `${bucket} km`;
    }
    const parsed = new Date(row.dateIso ?? "");
    if (Number.isNaN(parsed.getTime())) {
      return labels.dateUnavailable;
    }
    if (activitiesView === "day") {
      return this.smartListDayLabel(parsed);
    }
    if (activitiesView === "month") {
      return parsed.toLocaleDateString(this.browserLocale(), { month: "long", year: "numeric" });
    }
    return `${labels.weekPrefix} ${this.isoWeekNumber(parsed)}, ${parsed.getFullYear()}`;
  }
  static smartListDayLabel(value) {
    return value.toLocaleDateString(this.browserLocale(), {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  static browserLocale() {
    if (typeof navigator === "undefined") {
      return void 0;
    }
    return Array.isArray(navigator.languages) && navigator.languages.length > 0 ? navigator.languages : navigator.language || void 0;
  }
  static findUserByName(users, name) {
    const target = this.normalizeText(name);
    return users.find((user) => this.normalizeText(user.name) === target);
  }
  static resolveAssetRequestUserId(request, users) {
    if (request.userId) {
      return request.userId;
    }
    const matchedUser = users.find((user) => user.name === request.name && user.initials === request.initials) ?? users.find((user) => user.name === request.name) ?? null;
    return matchedUser?.id ?? request.id;
  }
  static buildMonthAnchorWindow(focusMonth, radius) {
    const anchors = [];
    for (let offset = -radius; offset <= radius; offset += 1) {
      anchors.push(this.addMonths(focusMonth, offset));
    }
    return anchors;
  }
  static buildWeekAnchorWindow(focusWeek, radius) {
    const anchors = [];
    for (let offset = -radius; offset <= radius; offset += 1) {
      anchors.push(this.addDays(focusWeek, offset * 7));
    }
    return anchors;
  }
  static fromYearMonth(value) {
    if (!value || value === "Present") {
      return null;
    }
    const match = value.trim().match(/^(\d{4})[/-](\d{1,2})(?:[/-](\d{1,2}))?$/);
    if (!match) {
      return null;
    }
    const year = Number.parseInt(match[1], 10);
    const month = Number.parseInt(match[2], 10);
    const day = match[3] ? Number.parseInt(match[3], 10) : 1;
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day) || month < 1 || month > 12 || day < 1 || day > 31) {
      return null;
    }
    return new Date(year, month - 1, day);
  }
  static toYearMonth(value) {
    if (!value) {
      return "";
    }
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  static toSortableDate(value) {
    if (!value) {
      return Number.POSITIVE_INFINITY;
    }
    const safe = value.replace(/\//g, "-");
    const direct = new Date(safe);
    if (!Number.isNaN(direct.getTime())) {
      return direct.getTime();
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(safe)) {
      return (/* @__PURE__ */ new Date(`${safe}T00:00:00`)).getTime();
    }
    if (/^\d{4}-\d{2}$/.test(safe)) {
      return (/* @__PURE__ */ new Date(`${safe}-01T00:00:00`)).getTime();
    }
    return Number.POSITIVE_INFINITY;
  }
  static ageFromIsoDate(value, fallbackAge) {
    const birthday = this.fromIsoDate(value);
    if (!birthday) {
      return fallbackAge;
    }
    const now = /* @__PURE__ */ new Date();
    let age = now.getFullYear() - birthday.getFullYear();
    const monthDiff = now.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && now.getDate() < birthday.getDate()) {
      age -= 1;
    }
    return age;
  }
  static horoscopeByDate(value) {
    const month = value.getMonth() + 1;
    const day = value.getDate();
    if (month === 1 && day >= 20 || month === 2 && day <= 18)
      return "Aquarius";
    if (month === 2 && day >= 19 || month === 3 && day <= 20)
      return "Pisces";
    if (month === 3 && day >= 21 || month === 4 && day <= 19)
      return "Aries";
    if (month === 4 && day >= 20 || month === 5 && day <= 20)
      return "Taurus";
    if (month === 5 && day >= 21 || month === 6 && day <= 20)
      return "Gemini";
    if (month === 6 && day >= 21 || month === 7 && day <= 22)
      return "Cancer";
    if (month === 7 && day >= 23 || month === 8 && day <= 22)
      return "Leo";
    if (month === 8 && day >= 23 || month === 9 && day <= 22)
      return "Virgo";
    if (month === 9 && day >= 23 || month === 10 && day <= 22)
      return "Libra";
    if (month === 10 && day >= 23 || month === 11 && day <= 21)
      return "Scorpio";
    if (month === 11 && day >= 22 || month === 12 && day <= 21)
      return "Sagittarius";
    return "Capricorn";
  }
  static withContextIconItems(summary, iconMap) {
    return summary.split(",").map((part) => {
      const trimmed = part.trim();
      const key = Object.keys(iconMap).find((label) => trimmed.startsWith(label));
      return key ? `${iconMap[key]} ${trimmed}` : trimmed;
    });
  }
  static badgeItemsLength(items) {
    return items.reduce((sum, item) => sum + item.length, 0);
  }
};

// src/app/shared/core/common/constants.ts
var ACTIVITY_MEMBER_STATUSES = ["pending", "accepted", "disqualified", "deleted"];
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

export {
  AppUtils,
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
  CURRENT_PROFILE_FORM_VERSION
};
//# sourceMappingURL=chunk-ILMZK7SM.js.map
