import {
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

// src/app/shared/ui/converters/notification-single-row.converter.ts
var NotificationSingleRowConverter = class _NotificationSingleRowConverter {
  convert(notification, ...optionsArg) {
    const options = optionsArg[0] ?? {};
    const read = Boolean(`${notification.readAtIso ?? ""}`.trim());
    const securityAlert = notification.kind === "security-login";
    const senderName = securityAlert ? "" : `${notification.senderName ?? ""}`.trim();
    const systemRandomRoom = this.isSystemGeneratedRoom(notification);
    const systemAvatar = securityAlert || systemRandomRoom;
    const stageAvatar = this.hasStageAvatar(notification);
    const tournamentRoom = `${notification.payload?.["eventScope"] ?? ""}`.trim() === "tournament-room";
    const sourceLabel = securityAlert ? "MyScoutee" : this.sourceLabel(notification.category, options);
    const timestamp = this.timestampLabel(notification.createdAtIso, options.locale);
    const occurrenceCount = Math.max(1, Math.trunc(Number(notification.occurrenceCount ?? 1)) || 1);
    const statusBadgeKey = `${notification.payload?.["notification_status_badge_key"] ?? ""}`.trim();
    const statusBadgeFallback = `${notification.payload?.["notification_status_badge_fallback"] ?? ""}`.trim();
    const statusBadgeLabel = statusBadgeKey && options.translate ? options.translate(statusBadgeKey, statusBadgeFallback) : statusBadgeFallback;
    const targetAction = _NotificationSingleRowConverter.targetActionId(notification);
    return {
      id: notification.id,
      title: this.title(notification, options),
      subtitle: senderName ? `${senderName} \xB7 ${sourceLabel}` : sourceLabel,
      detail: this.message(notification, options),
      dateIso: notification.createdAtIso,
      avatarUrl: systemAvatar || stageAvatar ? null : `${notification.senderAvatarUrl ?? ""}`.trim() || null,
      avatarInitials: !systemAvatar && !stageAvatar && senderName ? this.initials(senderName) : null,
      avatarAriaLabel: senderName || sourceLabel,
      avatarToneClass: stageAvatar ? this.stageAvatarToneClass(notification) : systemAvatar ? "notification-system-avatar" : null,
      accentHue: stageAvatar ? this.stageAccentHue(notification) : null,
      icon: securityAlert ? "warning_amber" : stageAvatar ? `${notification.payload?.["notification_avatar_icon"] ?? ""}`.trim() || "emoji_events" : systemRandomRoom ? tournamentRoom ? "emoji_events" : "auto_awesome" : senderName ? null : this.categoryIcon(notification.category),
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
          ariaLabel: this.translation(options, "notification.matches.count", `${occurrenceCount} matching notifications`, { count: `${occurrenceCount}` }),
          title: this.translation(options, "notification.matches.count", `${occurrenceCount} matching notifications`, { count: `${occurrenceCount}` }),
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
          label: this.translation(options, "notification.status.read", "Read"),
          icon: "done_all",
          tone: "muted",
          position: "inline"
        }] : []
      ],
      menuActions: [
        ...!read ? ["markNotificationRead"] : [],
        ...targetAction ? [targetAction] : []
      ],
      progressRing: options.progressRing === true,
      eagerDetail: __spreadProps(__spreadValues({}, notification), {
        payload: notification.payload ? __spreadValues({}, notification.payload) : null
      })
    };
  }
  static targetActionId(notification) {
    const eventId = this.eventId(notification);
    if (!eventId) {
      return null;
    }
    const payload = notification.payload;
    const ownerId = `${payload?.["ownerId"] ?? ""}`.trim();
    const subEventId = `${payload?.["subEventId"] ?? ""}`.trim();
    if (ownerId && subEventId) {
      switch (`${payload?.["resourceType"] ?? ""}`.trim()) {
        case ASSET_TYPE_TRANSPORT:
          return "openNotificationTransport";
        case ASSET_TYPE_ACCOMMODATION:
          return "openNotificationAccommodation";
        case ASSET_TYPE_SUPPLIES:
          return "openNotificationSupplies";
      }
    }
    return notification.kind === "event-invite" ? "openNotificationInvitation" : "openNotificationEvent";
  }
  static eventId(notification) {
    return `${notification.payload?.["eventId"] ?? ""}`.trim();
  }
  message(notification, options) {
    const key = `${notification.payload?.["notification_message_key"] ?? this.notificationMessageKey(notification)}`.trim();
    const translated = key && options.translate ? options.translate(key, notification.message) : notification.message;
    return this.compactMessage(notification, this.interpolatePayload(translated, notification.payload));
  }
  compactMessage(notification, fallback) {
    return this.withoutRepeatedSender(fallback, notification.senderName);
  }
  withoutRepeatedSender(value, senderName) {
    const message = `${value ?? ""}`.trim();
    const sender = `${senderName ?? ""}`.trim();
    if (!sender || !message.toLocaleLowerCase().startsWith(`${sender.toLocaleLowerCase()} `)) {
      return message;
    }
    const remainder = message.slice(sender.length).trimStart();
    return remainder ? `${remainder.charAt(0).toLocaleUpperCase()}${remainder.slice(1)}` : message;
  }
  title(notification, options) {
    const key = `${notification.payload?.["notification_title_key"] ?? this.notificationKey(notification.kind, "title")}`.trim();
    const translated = key && options.translate ? options.translate(key, notification.title) : notification.title;
    return this.interpolatePayload(translated, notification.payload);
  }
  interpolatePayload(value, payload) {
    return `${value ?? ""}`.replace(/\{([A-Za-z0-9_.-]+)\}/g, (match, key) => {
      const replacement = payload?.[key];
      return replacement == null ? match : `${replacement}`;
    });
  }
  notificationKey(kind, field) {
    const normalizedKind = `${kind ?? ""}`.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return normalizedKind ? `notification.kind.${normalizedKind}.${field}` : "";
  }
  notificationMessageKey(notification) {
    const key = this.notificationKey(notification.kind, "message");
    return notification.kind === "event-invite" && `${notification.payload?.["location"] ?? ""}`.trim() ? `${key}.location` : key;
  }
  translation(options, key, fallback, payload) {
    const translated = options.translate ? options.translate(key, fallback) : fallback;
    return this.interpolatePayload(translated, payload ?? null);
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
  sourceLabel(category, options) {
    switch (category) {
      case "user":
        return this.translation(options, "notification.source.member", "Member");
      case "chat":
        return this.translation(options, "notification.source.chat", "Chat");
      case "event":
        return this.translation(options, "notification.source.event", "Event");
      case "event-admin":
        return this.translation(options, "notification.source.event.admin", "Event admin");
      case "asset":
        return this.translation(options, "notification.source.asset", "Asset");
      case "app-admin":
        return "MyScoutee";
      case "scheduled":
        return this.translation(options, "notification.source.scheduled", "Scheduled");
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
//# sourceMappingURL=chunk-ATZPOBBV.js.map
