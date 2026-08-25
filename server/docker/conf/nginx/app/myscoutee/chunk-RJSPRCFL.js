import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/converters/notification-single-row.converter.ts
var NotificationSingleRowConverter = class {
  convert(notification, ...optionsArg) {
    const options = optionsArg[0] ?? {};
    const read = Boolean(`${notification.readAtIso ?? ""}`.trim());
    const senderName = `${notification.senderName ?? ""}`.trim();
    const systemRandomRoom = this.isSystemGeneratedRoom(notification);
    const stageAvatar = this.hasStageAvatar(notification);
    const tournamentRoom = `${notification.payload?.["eventScope"] ?? ""}`.trim() === "tournament-room";
    const sourceLabel = this.sourceLabel(notification.category);
    const timestamp = this.timestampLabel(notification.createdAtIso, options.locale);
    const occurrenceCount = Math.max(1, Math.trunc(Number(notification.occurrenceCount ?? 1)) || 1);
    const statusBadgeKey = `${notification.payload?.["notification_status_badge_key"] ?? ""}`.trim();
    const statusBadgeFallback = `${notification.payload?.["notification_status_badge_fallback"] ?? ""}`.trim();
    const statusBadgeLabel = statusBadgeKey && options.translate ? options.translate(statusBadgeKey, statusBadgeFallback) : statusBadgeFallback;
    return {
      id: notification.id,
      title: this.title(notification, options),
      subtitle: senderName ? `${senderName} \xB7 ${sourceLabel}` : sourceLabel,
      detail: this.message(notification, options),
      dateIso: notification.createdAtIso,
      avatarUrl: systemRandomRoom || stageAvatar ? null : `${notification.senderAvatarUrl ?? ""}`.trim() || null,
      avatarInitials: !systemRandomRoom && !stageAvatar && senderName ? this.initials(senderName) : null,
      avatarAriaLabel: senderName || sourceLabel,
      avatarToneClass: stageAvatar ? this.stageAvatarToneClass(notification) : systemRandomRoom ? "notification-system-avatar" : null,
      accentHue: stageAvatar ? this.stageAccentHue(notification) : null,
      icon: stageAvatar ? `${notification.payload?.["notification_avatar_icon"] ?? ""}`.trim() || "emoji_events" : systemRandomRoom ? tournamentRoom ? "emoji_events" : "auto_awesome" : senderName ? null : this.categoryIcon(notification.category),
      surfaceTone: this.surfaceTone(notification, read),
      toneClass: `notification-row notification-row--${notification.category}`,
      badges: [
        ...statusBadgeLabel ? [{
          label: statusBadgeLabel,
          ariaLabel: statusBadgeLabel,
          title: statusBadgeLabel,
          tone: this.payloadTone(notification.payload?.["notification_status_badge_tone"]) ?? "muted",
          position: "inline"
        }] : [],
        ...occurrenceCount > 1 ? [{
          label: `${occurrenceCount}`,
          icon: "repeat",
          ariaLabel: `${occurrenceCount} matching notifications`,
          title: `${occurrenceCount} matching notifications`,
          tone: "warning",
          position: "inline"
        }] : [],
        {
          label: timestamp,
          icon: "schedule",
          ariaLabel: timestamp,
          title: timestamp,
          tone: read ? "muted" : this.badgeTone(notification),
          position: "top-right"
        },
        ...read ? [{
          label: "Read",
          icon: "done_all",
          tone: "muted",
          position: "inline"
        }] : []
      ],
      menuActions: read ? [] : ["markNotificationRead"],
      progressRing: options.progressRing === true,
      eagerDetail: __spreadProps(__spreadValues({}, notification), {
        payload: notification.payload ? __spreadValues({}, notification.payload) : null
      })
    };
  }
  message(notification, options) {
    const key = `${notification.payload?.["notification_message_key"] ?? ""}`.trim();
    const translated = key && options.translate ? options.translate(key, notification.message) : notification.message;
    return this.interpolatePayload(translated, notification.payload);
  }
  title(notification, options) {
    const key = `${notification.payload?.["notification_title_key"] ?? ""}`.trim();
    const translated = key && options.translate ? options.translate(key, notification.title) : notification.title;
    return this.interpolatePayload(translated, notification.payload);
  }
  interpolatePayload(value, payload) {
    return `${value ?? ""}`.replace(/\{([A-Za-z0-9_.-]+)\}/g, (match, key) => {
      const replacement = payload?.[key];
      return replacement == null ? match : `${replacement}`;
    });
  }
  isSystemGeneratedRoom(notification) {
    return notification.kind === "event-random-groups" || ["random-room", "tournament-room"].includes(`${notification.payload?.["eventScope"] ?? ""}`.trim());
  }
  hasStageAvatar(notification) {
    return `${notification.payload?.["notification_avatar_tone"] ?? ""}`.trim() === "stage";
  }
  stageAvatarToneClass(notification) {
    switch (`${notification.kind ?? ""}`.trim()) {
      case "event-stage-advanced":
      case "event-tournament-won":
        return "notification-stage-avatar notification-stage-avatar--positive";
      case "event-stage-not-advanced":
      case "event-tournament-not-won":
        return "notification-stage-avatar notification-stage-avatar--negative";
      default:
        return "notification-stage-avatar";
    }
  }
  stageAccentHue(notification) {
    return AppUtils.tournamentStageAccentHue(Number(notification.payload?.["stageIndex"]), Number(notification.payload?.["stageTotal"]));
  }
  surfaceTone(notification, read) {
    if (read) {
      return "muted";
    }
    const contextualTone = this.contextualTone(notification);
    if (contextualTone) {
      return contextualTone;
    }
    switch (notification.category) {
      case "chat":
      case "event":
        return "info";
      case "event-admin":
        return "accent";
      case "asset":
        return "warning";
      case "app-admin":
        return "danger";
      case "scheduled":
        return "success";
      default:
        return "neutral";
    }
  }
  badgeTone(notification) {
    const contextualTone = this.contextualTone(notification);
    if (contextualTone) {
      return contextualTone;
    }
    switch (notification.category) {
      case "chat":
      case "event":
        return "info";
      case "event-admin":
        return "accent";
      case "asset":
        return "warning";
      case "app-admin":
        return "danger";
      case "scheduled":
        return "success";
      default:
        return "neutral";
    }
  }
  contextualTone(notification) {
    return this.payloadTone(notification.payload?.["notification_tone"]);
  }
  payloadTone(value) {
    const requestedTone = `${value ?? ""}`.trim();
    switch (requestedTone) {
      case "info":
      case "accent":
      case "success":
      case "warning":
      case "danger":
        return requestedTone;
      default:
        return null;
    }
  }
  categoryIcon(category) {
    switch (category) {
      case "user":
        return "person";
      case "chat":
        return "chat";
      case "event":
        return "event";
      case "event-admin":
        return "admin_panel_settings";
      case "asset":
        return "inventory_2";
      case "app-admin":
        return "verified_user";
      case "scheduled":
        return "schedule";
    }
  }
  sourceLabel(category) {
    switch (category) {
      case "user":
        return "Member";
      case "chat":
        return "Chat";
      case "event":
        return "Event";
      case "event-admin":
        return "Event admin";
      case "asset":
        return "Asset";
      case "app-admin":
        return "MyScoutee";
      case "scheduled":
        return "Scheduled";
    }
  }
  timestampLabel(value, locale) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value.trim();
    }
    try {
      return new Intl.DateTimeFormat(locale?.trim() || void 0, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(date);
    } catch {
      return date.toLocaleString();
    }
  }
  initials(value) {
    const initials = value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
    return initials || "N";
  }
};
var notificationSingleRowConverter = new NotificationSingleRowConverter();

export {
  NotificationSingleRowConverter
};
//# sourceMappingURL=chunk-RJSPRCFL.js.map
