import {
  buildPairRateCardData,
  buildSingleRateCardData
} from "./chunk-XXLX3JOX.js";
import {
  CARD_MENU_ACTIONS
} from "./chunk-LXXIK2TC.js";
import {
  buildTabbedMenuModel
} from "./chunk-QD6QQNQX.js";
import {
  activityRateSortKey
} from "./chunk-VUN7WUNQ.js";
import {
  APP_STATIC_DATA,
  ActivityResourceBuilder,
  AssetDefaultsBuilder,
  AssetTicketBuilder
} from "./chunk-Y2Y4ZDHH.js";
import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  AppUtils,
  CURRENT_PROFILE_FORM_VERSION,
  isAssetType
} from "./chunk-XQ4NDAVX.js";
import {
  ActivityEventDetailDTO,
  EventFeedbackDetailDto
} from "./chunk-IECLTXM5.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/converters/help-center-revision-document-viewer.converter.ts
var HelpCenterDocumentViewerSectionConverter = class {
  static convert(section) {
    return {
      id: section.id,
      icon: section.icon,
      title: section.title,
      blurb: section.blurb,
      contentHtml: section.contentHtml,
      points: section.points,
      details: section.details
    };
  }
  static convertList(sections) {
    return sections.map((section) => this.convert(section));
  }
};
var HelpCenterPrivacyDocumentViewerSectionConverter = class {
  static convert(input) {
    const selectedIds = AppUtils.uniqueTrimmedStrings(input.selectedSectionIds);
    return HelpCenterDocumentViewerSectionConverter.convertList(input.sections).map((section, index) => {
      const source = input.sections[index];
      const optional = source?.optional === true;
      return __spreadProps(__spreadValues({}, section), {
        tone: optional ? "optional" : "mandatory",
        selected: selectedIds.includes(section.id),
        toggleable: optional
      });
    });
  }
};
var HelpCenterRevisionDocumentViewerConfigConverter = class {
  static convert(options) {
    const revision = options.revision;
    const sections = revision?.sections ?? [];
    return {
      shell: options.shell,
      open: options.open,
      onClose: options.onClose,
      closeOnBackdrop: options.closeOnBackdrop,
      closeAriaLabel: options.closeAriaLabel,
      ariaLabel: options.ariaLabel,
      title: revision?.summary?.trim() || options.titleFallback,
      description: revision?.description?.trim() || options.descriptionFallback || "",
      versionLabel: options.versionLabel,
      headerPalette: AppUtils.enumValue(options.headerPalette ?? revision?.headerColor, APP_STATIC_DATA.documentViewerHeaderPalettes, options.headerPaletteFallback ?? "amber"),
      showBrand: options.showBrand,
      loading: options.loading,
      loadingLabel: options.loadingLabel,
      emptyState: options.emptyState,
      sections: options.sectionMode === "privacy" ? HelpCenterPrivacyDocumentViewerSectionConverter.convert({
        sections,
        selectedSectionIds: options.selectedSectionIds
      }) : HelpCenterDocumentViewerSectionConverter.convertList(sections),
      selectedSectionIds: AppUtils.uniqueTrimmedStrings(options.selectedSectionIds),
      actions: options.actions,
      statusMessage: options.statusMessage,
      statusTone: options.statusTone
    };
  }
};

// src/app/shared/ui/converters/asset-ticket-info-card.converter.ts
var AssetTicketInfoCardConverter = class {
  static convert(row, options = {}) {
    return {
      id: `${row.type}:${row.id}`,
      dateIso: row.dateIso,
      distanceMetersExact: row.distanceMetersExact,
      status: row.usedAtIso ? "used" : "active",
      groupLabel: options.groupLabel ?? null,
      title: row.title,
      imageUrl: this.ticketImageUrl(row),
      metaRows: [this.ticketMetaLine(row)],
      description: row.subtitle,
      surfaceTone: row.usedAtIso ? "published" : "default",
      leadingIcon: {
        icon: this.ticketLeadingIcon(row),
        tone: this.ticketLeadingIconTone(row)
      },
      mediaStart: {
        variant: "avatar",
        tone: this.ticketSourceAvatarTone(row),
        label: this.ticketSourceAvatarLabel(row),
        interactive: false,
        ariaLabel: null
      },
      mediaEnd: {
        variant: "badge",
        tone: row.usedAtIso ? "stage-finalized" : "default",
        icon: row.usedAtIso ? "check_circle" : "qr_code_2",
        label: row.usedAtIso ? "asset.ticket.checked.in" : null,
        interactive: true,
        ariaLabel: row.usedAtIso ? "asset.ticket.checkin.details.aria" : "asset.ticket.qr.open.aria"
      },
      clickable: false
    };
  }
  static convertList(rows, options = {}) {
    return rows.map((row) => this.convert(row, options));
  }
  static groupLabel(dateIso) {
    return AssetTicketBuilder.groupLabel(dateIso);
  }
  static ticketImageUrl(row) {
    return `${row.imageUrl ?? ""}`.trim() || "https://picsum.photos/seed/event-default/1200/700";
  }
  static ticketMetaLine(row) {
    return `${row.type === "hosting" ? "Hosting" : "Event"} \xB7 ${AssetTicketBuilder.dateLabel(row)} \xB7 ${this.ticketDistanceLabel(row.distanceMetersExact)}`;
  }
  static ticketDistanceLabel(distanceMeters) {
    const meters = Number.isFinite(distanceMeters) ? Math.max(0, Math.trunc(Number(distanceMeters))) : 0;
    const rounded = Math.round(meters / 1e3 * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded} km` : `${rounded.toFixed(1)} km`;
  }
  static ticketLeadingIcon(row) {
    const visibility = this.ticketVisibility(row);
    if (visibility === "Friends only") {
      return "groups";
    }
    if (visibility === "Invitation only") {
      return "mail_lock";
    }
    return "public";
  }
  static ticketLeadingIconTone(row) {
    const visibility = this.ticketVisibility(row);
    if (visibility === "Friends only") {
      return "friends";
    }
    if (visibility === "Invitation only") {
      return "invitation";
    }
    return "public";
  }
  static ticketVisibility(row) {
    const visibility = row.visibility;
    if (visibility === "Friends only" || visibility === "Invitation only") {
      return visibility;
    }
    return "Public";
  }
  static ticketSourceAvatarTone(row) {
    const toneIndex = AppUtils.hashText(`${row.type}:${row.id}:${row.title}`) % 8 + 1;
    return `tone-${toneIndex}`;
  }
  static ticketSourceAvatarLabel(row) {
    const explicit = `${row.avatarInitials ?? row.creatorInitials ?? ""}`.trim();
    if (explicit) {
      return explicit.slice(0, 2).toUpperCase();
    }
    return AppUtils.initialsFromText(row.title);
  }
};

// src/app/shared/ui/converters/asset-availability-single-row.converter.ts
var AssetAvailabilitySingleRowConverter = class {
  static convert(row, options = {}) {
    const status = this.statusLabel(row, options);
    const quantityValue = Math.max(1, Math.trunc(Number(row.quantity) || 1));
    const schedule = `${row.scheduleLabel ?? ""}`.trim();
    const badges = [{
      label: `${status}: ${quantityValue}`,
      tone: this.statusBadgeTone(row),
      position: "top-right"
    }];
    return {
      id: row.id,
      smartListKey: `asset-availability:${row.assetId}:${row.id}`,
      ownerUserId: row.ownerUserId,
      ownerId: row.assetId,
      status: row.status,
      dateIso: row.startAtIso ?? row.dateIso,
      title: row.title || "Request",
      subtitle: row.subtitle ?? null,
      detail: row.detail || schedule || null,
      groupLabel: options.groupLabel ?? null,
      avatarInitials: row.avatarInitials ?? null,
      avatarUrl: row.avatarUrl ?? null,
      avatarToneClass: `user-color-${row.gender}`,
      surfaceTone: row.isManager ? "accent" : this.surfaceTone(row),
      badges,
      metaRows: schedule && row.detail ? [schedule] : [],
      menuActions: row.menuActions ?? [],
      eagerDetail: row
    };
  }
  static convertList(rows, options = {}) {
    return rows.map((row) => this.convert(row, options));
  }
  static statusLabel(row, options) {
    if (row.status === "assigned") {
      return this.translate(options, "asset.requests.status.assigned", "Assigned");
    }
    if (row.status === "accepted") {
      return this.translate(options, "asset.requests.status.borrowed", "Borrowed");
    }
    return this.translate(options, "asset.requests.status.pending", "Pending");
  }
  static surfaceTone(row) {
    if (row.status === "pending") {
      return "warning";
    }
    if (row.status === "assigned") {
      return "info";
    }
    return "success";
  }
  static statusBadgeTone(row) {
    if (row.status === "pending") {
      return "warning";
    }
    if (row.status === "assigned") {
      return "info";
    }
    return "success";
  }
  static translate(options, key, fallback) {
    return options.translate?.(key, fallback) ?? fallback;
  }
};

// src/app/shared/ui/converters/activity-chat-single-row.converter.ts
var ActivityChatSingleRowConverter = class {
  static convert(dto, options) {
    return this.convertWithResolvedOptions(dto, this.resolveOptions(options));
  }
  static convertList(dtos, options) {
    const resolvedOptions = this.resolveOptions(options);
    return dtos.map((dto) => this.convertWithResolvedOptions(dto, resolvedOptions));
  }
  static convertWithResolvedOptions(dto, options) {
    const systemSender = this.isSystemGeneratedRoomSender(dto);
    const systemAvatarUrl = systemSender ? this.systemAvatarUrl(dto.avatar) : null;
    const lastSender = systemSender ? null : this.resolveLastSender(dto, options);
    const unread = Math.max(0, Math.trunc(Number(dto.unread) || 0));
    const memberCount = this.resolveMemberCount(dto, options);
    const distanceMetersExact = Number.isFinite(Number(dto.distanceMetersExact)) ? Math.max(0, Math.trunc(Number(dto.distanceMetersExact))) : void 0;
    const supportStatus = this.supportStatus(dto.supportCase?.status);
    const supportAssigneeName = dto.supportCase?.assignee?.name ?? null;
    const showSupportControls = options.adminServiceMode === true && Boolean(supportStatus);
    const channelType = supportStatus ? "supportCase" : this.normalizeChannelType(dto);
    const eventUnderReview = dto.ownerStatus === "DR";
    const ownerId = `${dto.ownerId ?? ""}`.trim();
    const groupChannelLabel = channelType === "groupSubEvent" ? this.groupChannelLabel(dto) : "";
    const groupParentLabel = channelType === "groupSubEvent" ? this.groupParentLabel(dto) : "";
    const lastMessage = dto.lastMessage?.trim() || "";
    return {
      id: dto.id,
      chatRevision: Math.max(1, Math.trunc(Number(dto.revision) || 1)),
      chatOwnerStatus: dto.ownerStatus ?? null,
      ownerId: ownerId || null,
      smartListKey: this.smartListKeyForIdentity(channelType, ownerId, dto.id),
      status: supportStatus ?? channelType,
      dateIso: dto.dateIso ?? "2026-02-21T09:00:00",
      distanceMetersExact,
      badgeCount: showSupportControls ? 0 : unread,
      sortScore: unread * 10 + memberCount,
      title: systemSender ? "MyScoutee System" : lastSender?.name ?? dto.title,
      subtitle: groupChannelLabel || dto.title,
      detail: groupParentLabel || lastMessage,
      metaRows: groupParentLabel && lastMessage ? [lastMessage] : [],
      unread: showSupportControls ? 0 : unread,
      avatarUrl: systemSender ? systemAvatarUrl : this.personAvatarUrl(lastSender),
      avatarInitials: systemSender ? null : lastSender?.initials || AppUtils.initialsFromText(lastSender?.name ?? dto.title),
      avatarToneClass: systemSender && !systemAvatarUrl ? "notification-system-avatar" : lastSender ? `user-color-${lastSender.gender}` : null,
      avatarAriaLabel: systemSender ? "MyScoutee System" : lastSender?.name ?? dto.title,
      icon: systemSender && !systemAvatarUrl ? "auto_awesome" : null,
      memberCount: showSupportControls ? 0 : memberCount,
      toneClass: this.toneClass(dto),
      surfaceTone: showSupportControls ? this.supportCaseSurfaceTone(supportStatus) : this.chatSurfaceTone(dto),
      sideLabel: null,
      badges: showSupportControls ? [{
        label: this.supportCaseBadgeLabel(supportStatus, supportAssigneeName, options.translate),
        title: this.supportCaseBadgeLabel(supportStatus, supportAssigneeName, options.translate),
        tone: this.supportCaseBadgeTone(supportStatus),
        position: "top-right"
      }] : eventUnderReview ? [{
        label: options.translate?.("activities.chat.event.status.underReview") ?? "Under review",
        title: options.translate?.("activities.chat.event.status.underReview") ?? "Under review",
        tone: "warning",
        position: "inline",
        className: "event-chat-owner-status-badge"
      }] : [],
      menuActions: showSupportControls ? this.supportCaseMenuActionIds(supportStatus) : [],
      clickable: true
    };
  }
  static smartListKeyForIdentity(channelType, ownerId, fallbackId) {
    const normalizedOwnerId = `${ownerId ?? ""}`.trim();
    const normalizedFallbackId = `${fallbackId ?? ""}`.trim();
    const normalizedChannelType = this.normalizeSmartListChannelType(channelType);
    const usesOwnerIdentity = normalizedChannelType === "mainEvent" || normalizedChannelType === "optionalSubEvent" || normalizedChannelType === "groupSubEvent";
    const identity = usesOwnerIdentity ? normalizedOwnerId || normalizedFallbackId : normalizedFallbackId || normalizedOwnerId;
    const rowIdentity = identity ? `${normalizedChannelType}:${identity}` : "";
    return `chats:${rowIdentity || normalizedFallbackId}`;
  }
  static groupChannelLabel(dto) {
    const configured = `${dto.navigationContext?.group?.name ?? ""}`.trim();
    if (configured) {
      return configured;
    }
    const title = `${dto.title ?? ""}`.trim();
    return title.replace(/\s*[·-]\s*group channel\s*$/i, "").trim() || "Group";
  }
  static groupParentLabel(dto) {
    const navigation = dto.navigationContext;
    if (!navigation) {
      return "";
    }
    const timeframe = AppUtils.dateTimeRangeLabel(navigation.subEvent?.startAt, navigation.subEvent?.endAt, "");
    const parts = [
      `${navigation.eventTitle ?? ""}`.trim(),
      `${navigation.subEvent?.name ?? ""}`.trim(),
      timeframe
    ].filter(Boolean);
    return parts.filter((part, index) => parts.findIndex((candidate) => candidate.toLocaleLowerCase("en-US") === part.toLocaleLowerCase("en-US")) === index).join(" \xB7 ");
  }
  static supportStatus(status) {
    if (status === "pending" || status === "warned" || status === "picked" || status === "solved" || status === "blocked") {
      return status;
    }
    return null;
  }
  static supportCaseLabelKey(status) {
    if (status === "picked") {
      return "activities.support.case.status.picked";
    }
    if (status === "warned") {
      return "activities.support.case.status.warned";
    }
    if (status === "solved") {
      return "activities.support.case.status.solved";
    }
    if (status === "blocked") {
      return "activities.support.case.status.blocked";
    }
    return "activities.support.case.status.pending";
  }
  static supportCaseBadgeLabel(status, assigneeName, translate) {
    const resolvedAssigneeName = `${assigneeName ?? ""}`.trim();
    const t = translate ?? ((key) => key);
    if (resolvedAssigneeName) {
      return `${t("activities.support.case.assignee.by")} ${resolvedAssigneeName}`.trim();
    }
    return t(this.supportCaseLabelKey(status));
  }
  static supportCaseBadgeTone(status) {
    switch (status) {
      case "warned":
        return "warning";
      case "picked":
        return "info";
      case "solved":
        return "success";
      case "blocked":
        return "danger";
      default:
        return "warning";
    }
  }
  static supportCaseSurfaceTone(status) {
    return this.supportCaseBadgeTone(status);
  }
  static supportCaseMenuActionIds(status) {
    if (status === "solved" || status === "blocked") {
      return ["supportReopen"];
    }
    if (status === "picked" || status === "warned") {
      return ["supportUnpick", "supportSolve", "supportBlock"];
    }
    return ["supportPick", "supportSolve", "supportBlock"];
  }
  static chatSurfaceTone(dto) {
    const toneClass = this.toneClass(dto);
    if (toneClass.includes("activities-card-chat-group-sub-event")) {
      return "success";
    }
    if (toneClass.includes("activities-card-chat-optional-sub-event")) {
      return "warning";
    }
    if (toneClass.includes("activities-card-chat-service-notification")) {
      return "danger";
    }
    if (toneClass.includes("activities-card-chat-service-event") || toneClass.includes("activities-card-chat-service-asset")) {
      return "neutral";
    }
    if (toneClass.includes("activities-card-chat-main-event")) {
      return "info";
    }
    return "default";
  }
  static normalizeChannelType(dto) {
    if (dto.channelType === "mainEvent" || dto.channelType === "optionalSubEvent" || dto.channelType === "groupSubEvent" || dto.channelType === "serviceEvent" || dto.channelType === "appSupport") {
      return dto.channelType;
    }
    return "general";
  }
  static normalizeSmartListChannelType(channelType) {
    if (channelType === "mainEvent" || channelType === "optionalSubEvent" || channelType === "groupSubEvent" || channelType === "serviceEvent" || channelType === "appSupport" || channelType === "supportCase" || channelType === "general") {
      return channelType;
    }
    return "general";
  }
  static toneClass(dto) {
    const channelType = this.normalizeChannelType(dto);
    if (channelType === "mainEvent") {
      return "activities-card-chat-main-event";
    }
    if (channelType === "optionalSubEvent") {
      return "activities-card-chat-optional-sub-event";
    }
    if (channelType === "groupSubEvent") {
      return "activities-card-chat-group-sub-event";
    }
    if (channelType === "serviceEvent") {
      return this.serviceChatToneClass(dto);
    }
    if (channelType === "appSupport") {
      return "activities-card-chat-service-notification";
    }
    return "";
  }
  static serviceChatToneClass(dto) {
    if (dto.serviceContext === "notification" || dto.title.startsWith("Notify Participants") || dto.lastMessage.toLowerCase().includes("notification channel")) {
      return "activities-card-chat-service-notification";
    }
    if (dto.serviceContext === "asset" || dto.id.startsWith("c-service-asset-") || dto.title.startsWith("Asset Service")) {
      return "activities-card-chat-service-asset";
    }
    return "activities-card-chat-service-event";
  }
  static resolveLastSender(dto, options) {
    const lastSender = this.resolveUserById(dto.lastSenderId, dto, options);
    if (lastSender) {
      return lastSender;
    }
    const members = this.resolveMembers(dto, options);
    return members[0] ?? null;
  }
  static isSystemGeneratedRoomSender(dto) {
    const eventId = `${dto.eventId ?? dto.ownerId ?? ""}`.trim();
    return this.normalizeChannelType(dto) === "mainEvent" && eventId.startsWith("random-room:") && !`${dto.lastSenderId ?? ""}`.trim();
  }
  static systemAvatarUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    return /^(?:https?:\/\/|\/|data:image\/)/i.test(normalized) ? normalized : null;
  }
  static resolveMemberCount(dto, options) {
    const explicitMemberCount = new Set((dto.memberIds ?? []).map((memberId) => `${memberId ?? ""}`.trim()).filter(Boolean)).size;
    if (explicitMemberCount > 0) {
      return explicitMemberCount;
    }
    return this.resolveMembers(dto, options).length;
  }
  static resolveMembers(dto, options) {
    const memberIds = new Set([
      ...dto.memberIds ?? [],
      ...(dto.members ?? []).map((member) => member.id)
    ].map((memberId) => `${memberId ?? ""}`.trim()).filter(Boolean));
    const members = [...memberIds].map((memberId) => this.resolveUserById(memberId, dto, options)).filter((user) => Boolean(user));
    if (members.length > 0) {
      return this.uniqueUsersById(members);
    }
    return [options.fallbackUser];
  }
  static resolveOptions(options) {
    return __spreadProps(__spreadValues({}, options), {
      fallbackUser: options.activeUser
    });
  }
  static resolveUserById(userId, dto, options) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return null;
    }
    if (normalizedUserId === options.activeUser.id) {
      return options.activeUser;
    }
    const resolvedUser = options.resolveUserById?.(normalizedUserId) ?? null;
    if (resolvedUser) {
      return resolvedUser;
    }
    const member = (dto.members ?? []).find((candidate) => `${candidate.id ?? ""}`.trim() === normalizedUserId);
    return member ? this.memberSummaryPerson(member) : null;
  }
  static memberSummaryPerson(member) {
    const name = `${member.name ?? ""}`.trim() || member.id;
    return {
      id: member.id,
      name,
      initials: `${member.initials ?? ""}`.trim() || AppUtils.initialsFromText(name),
      gender: member.gender === "woman" ? "woman" : "man",
      avatarUrl: `${member.imageUrl ?? ""}`.trim() || null
    };
  }
  static personAvatarUrl(person) {
    if (!person) {
      return null;
    }
    return `${person.avatarUrl ?? ""}`.trim() || AppUtils.firstImageUrl(person.images) || null;
  }
  static uniqueUsersById(users) {
    const seen = /* @__PURE__ */ new Set();
    const unique = [];
    for (const user of users) {
      if (seen.has(user.id)) {
        continue;
      }
      seen.add(user.id);
      unique.push(user);
    }
    return unique;
  }
};

// src/app/shared/ui/converters/chat-popup-header-context.converter.ts
var ChatPopupHeaderContextConverter = class {
  static convert(chat, options = {}) {
    const chatId = `${chat.id ?? ""}`.trim();
    const title = `${chat.title ?? ""}`.trim() || "Chat";
    const members = this.resolveChatMembers(chat);
    const memberIds = this.uniqueUserIds([
      ...chat.memberIds ?? [],
      ...members.map((member) => member.id)
    ]);
    const controls = [];
    if (chatId && memberIds.length > 0) {
      const maxVisibleThumbs = 4;
      const thumbs = options.includeThumbs === true ? this.buildChatHeaderThumbs(members, maxVisibleThumbs) : [];
      const hiddenThumbCount = thumbs.length > 0 ? Math.max(0, memberIds.length - thumbs.length) : 0;
      controls.push({
        id: "members",
        label: "Members",
        summary: this.memberCountLabel(memberIds.length),
        visual: thumbs.length > 0 ? { kind: "thumbStack", thumbs, maxVisible: maxVisibleThumbs } : { kind: "icon", icon: "groups" },
        badge: hiddenThumbCount > 0 ? { value: hiddenThumbCount, tone: "danger" } : null,
        lookup: {
          type: "chat",
          id: chatId
        }
      });
    }
    return {
      revision: this.chatHeaderRevision(chatId, title, memberIds, chat.ownerStatus),
      title,
      titleBadge: chat.ownerStatus === "DR" ? { label: "activities.chat.event.status.underReview", tone: "warning" } : null,
      controls
    };
  }
  static uniqueUserIds(userIds) {
    return [...new Set(userIds.map((userId) => userId.trim()).filter(Boolean))];
  }
  static resolveChatMembers(chat) {
    return (chat.members ?? []).map((member) => __spreadProps(__spreadValues({}, member), {
      id: `${member.id ?? ""}`.trim(),
      name: `${member.name ?? ""}`.trim() || null,
      initials: `${member.initials ?? ""}`.trim(),
      imageUrl: `${member.imageUrl ?? ""}`.trim() || null
    })).filter((member) => member.id.length > 0);
  }
  static buildChatHeaderThumbs(members, maxVisible) {
    return members.slice(0, Math.max(0, Math.trunc(maxVisible))).map((member) => {
      const label = `${member.name ?? ""}`.trim() || member.id;
      return {
        id: member.id,
        label,
        initials: `${member.initials ?? ""}`.trim() || AppUtils.initialsFromText(label),
        imageUrl: `${member.imageUrl ?? ""}`.trim() || null
      };
    });
  }
  static memberCountLabel(count) {
    return count === 1 ? "1 member" : `${count} members`;
  }
  static chatHeaderRevision(chatId, title, memberIds, ownerStatus) {
    return ["chat-header", chatId, title, ownerStatus ?? "", ...memberIds].join(":");
  }
};

// src/app/shared/ui/converters/activity-member-image-card.converter.ts
var ActivityMemberImageCardConverter = class {
  static convert(dto, options = {}) {
    const age = Math.max(0, Math.trunc(Number(dto.profile?.age) || 0));
    const statusLabel = this.statusLabel(dto);
    const checkedIn = this.isCheckedIn(dto);
    const checkedInLabel = options.checkedInLabel?.trim() || "Checked in";
    const checkedInAt = `${dto.checkedInAtIso ?? ""}`.trim();
    const checkedInDetail = checkedIn ? [checkedInLabel, checkedInAt && options.formatCheckedInAt ? options.formatCheckedInAt(checkedInAt) : checkedInAt].filter(Boolean).join(" \xB7 ") : null;
    const pendingDetail = dto.status === "pending" || dto.status === "disqualified" ? statusLabel : null;
    const statusChipLabel = checkedIn ? checkedInDetail || checkedInLabel : dto.status === "deleted" ? this.roleLabel(dto) : statusLabel;
    return {
      id: dto.id,
      title: age > 0 ? `${dto.name}, ${age}` : dto.name,
      subtitle: `${this.roleLabel(dto)} \xB7 ${dto.city}`,
      detail: checkedInDetail || pendingDetail,
      imageUrl: dto.avatarUrl,
      placeholderIcon: "highlight_off",
      placeholderLabel: dto.initials,
      layout: "overlay",
      toneClass: [
        "subevent-member-image-card",
        "activity-member-image-card",
        this.toneClass(dto),
        dto.status === "deleted" ? "ui-image-card--deleted" : "",
        options.menuOpen === true ? "menu-open" : ""
      ].filter(Boolean).join(" "),
      statusChip: {
        icon: this.statusIcon(dto),
        label: checkedIn ? checkedInLabel : null,
        title: statusChipLabel,
        ariaLabel: statusChipLabel,
        palette: this.statusPalette(dto),
        className: this.statusClass(dto)
      },
      badge: dto.status === "deleted" ? {
        label: statusLabel,
        ariaLabel: statusLabel,
        className: "ui-image-card__badge--danger"
      } : null
    };
  }
  static convertList(dtos, options = {}) {
    return dtos.map((dto) => this.convert(dto, options));
  }
  static toneClass(dto) {
    if (this.isCheckedIn(dto)) {
      return "member-card-tone-checked-in";
    }
    if (dto.status === "disqualified") {
      return "member-card-tone-disqualified";
    }
    if (dto.status === "deleted") {
      return "member-card-tone-deleted";
    }
    if (dto.status === "accepted") {
      if (dto.role === "Admin") {
        return "member-card-tone-admin";
      }
      if (dto.role === "Manager") {
        return "member-card-tone-manager";
      }
      return "member-card-tone-accepted";
    }
    return "member-card-tone-invite-pending";
  }
  static statusClass(dto) {
    if (this.isCheckedIn(dto)) {
      return "member-status-checked-in";
    }
    if (dto.status === "disqualified") {
      return "member-status-disqualified";
    }
    if (dto.status === "accepted" || dto.status === "deleted") {
      if (dto.role === "Admin") {
        return "member-status-admin";
      }
      if (dto.role === "Manager") {
        return "member-status-manager";
      }
      return "member-status-member";
    }
    return "member-status-invite-pending";
  }
  static statusIcon(dto) {
    if (this.isCheckedIn(dto)) {
      return "how_to_reg";
    }
    if (dto.status === "disqualified") {
      return "gavel";
    }
    if (dto.status === "accepted" || dto.status === "deleted") {
      if (dto.role === "Admin") {
        return "admin_panel_settings";
      }
      if (dto.role === "Manager") {
        return "badge";
      }
      return "person";
    }
    if (this.isJoinRequest(dto)) {
      return "pending_actions";
    }
    return "outgoing_mail";
  }
  static statusLabel(dto) {
    if (dto.status === "disqualified") {
      return "Disqualified";
    }
    if (dto.status === "deleted") {
      return "Deleted";
    }
    if (dto.status === "accepted") {
      return this.roleLabel(dto);
    }
    if (this.isJoinRequest(dto)) {
      if (dto.requestKind === "waitlist") {
        return "waiting.list";
      }
      return "Waiting For Admin Approval";
    }
    if (dto.pendingSource === "admin") {
      return "Invitation Pending";
    }
    return "Waiting For Admin Approval";
  }
  static statusPalette(dto) {
    if (this.isCheckedIn(dto)) {
      return "green";
    }
    if (dto.status === "disqualified") {
      return "muted";
    }
    if (dto.status === "accepted" || dto.status === "deleted") {
      if (dto.role === "Admin") {
        return "blue";
      }
      if (dto.role === "Manager") {
        return "gold";
      }
      return "green";
    }
    return "orange";
  }
  static roleLabel(dto) {
    if (dto.role === "Admin") {
      return "Admin";
    }
    if (dto.role === "Manager") {
      return "Manager";
    }
    return "Member";
  }
  static isJoinRequest(dto) {
    if (dto.status === "pending" && dto.requestKind !== "approval" && (dto.requestKind === "invite" || dto.requestKind === "waitlist-invite" || dto.pendingSource === "admin" || dto.statusText.toLowerCase().includes("admin approval"))) {
      return false;
    }
    return dto.requestKind === "join" || dto.requestKind === "approval" || dto.requestKind === "waitlist" || dto.requestKind == null && dto.pendingSource === "member";
  }
  static isCheckedIn(dto) {
    return dto.status === "accepted" && dto.attendanceStatus === "checked-in" && `${dto.checkedInAtIso ?? ""}`.trim().length > 0;
  }
};

// src/app/shared/ui/converters/activity-event-info-card.converter.ts
var ActivityEventInfoCardConverter = class {
  static convert(dto, options = {}) {
    const activeUserId = options.activeUserId ?? "";
    const status = this.statusCode(dto.status);
    const statusBadgeLabelKey = this.statusBadgeLabelKey(status, dto, activeUserId);
    const pending = this.isPending(dto, activeUserId);
    const invited = this.isInvited(dto, activeUserId);
    const trashView = options.trashView === true;
    const title = dto.title;
    const profileUserId = this.profileUserId(dto);
    return {
      id: dto.id,
      smartListKey: `${this.rowType(dto)}:${dto.id}`,
      dateIso: dto.startAtIso,
      distanceMetersExact: Math.max(0, Math.round((Number(dto.distanceKm) || 0) * 1e3)),
      status,
      ownerId: profileUserId,
      ownerUserId: profileUserId,
      groupLabel: options.groupLabel ?? null,
      title,
      surfaceTone: trashView ? "deleted" : this.surfaceTone(status, dto, activeUserId),
      imageUrl: dto.imageUrl?.trim() || null,
      placeholderLabel: dto.imageUrl?.trim() ? null : title,
      metaRows: [
        ...this.currentStageMetaRows(dto, options),
        AppUtils.dateTimeRangeLabel(dto.startAtIso, dto.endAtIso, dto.timeframe || "Date unavailable"),
        ...this.locationMetaRows(dto)
      ],
      description: invited ? dto.creatorName : dto.eventType === "slot" ? `Slot occurrence${dto.subtitle ? " \xB7 " + dto.subtitle : ""}` : dto.subtitle,
      footerChips: this.footerChips(dto, pending),
      descriptionLines: 2,
      leadingIcon: {
        icon: this.leadingIcon(dto, status, pending, activeUserId)
      },
      mediaStart: this.mediaStart(dto),
      mediaEnd: {
        variant: "badge",
        tone: trashView ? "deleted" : this.mediaEndTone(status, dto, activeUserId),
        label: statusBadgeLabelKey || this.capacityLabel(dto),
        ariaLabel: statusBadgeLabelKey || "open.members",
        interactive: !statusBadgeLabelKey,
        pendingCount: statusBadgeLabelKey ? 0 : this.pendingMemberCount(dto)
      },
      hasMenuOptions: this.hasMenuOptions(dto),
      menuBadgeCount: Math.max(0, Math.trunc(Number(dto.activity) || 0)),
      clickable: false,
      state: options.state ?? "default"
    };
  }
  static convertList(dtos, options = {}) {
    return dtos.map((dto) => this.convert(dto, options));
  }
  static toActivityMembersOwner(card) {
    return {
      ownerType: "event",
      ownerId: card.id
    };
  }
  static toActivityMembersSummary(card, options = {}) {
    const capacity = this.parseCapacityLabel(options.capacityByRowId?.[card.id] ?? card.mediaEnd?.label);
    const acceptedMembers = capacity?.acceptedMembers ?? 0;
    const pendingMembers = this.summaryPendingMembers(card, options);
    const capacityTotal = Math.max(acceptedMembers, capacity?.capacityTotal ?? this.normalizeCount(options.capacityTotal) ?? acceptedMembers);
    if (acceptedMembers <= 0 && pendingMembers <= 0 && capacityTotal <= 0) {
      return null;
    }
    return __spreadProps(__spreadValues({}, this.toActivityMembersOwner(card)), {
      acceptedMembers,
      pendingMembers,
      capacityTotal,
      acceptedMemberUserIds: [],
      pendingMemberUserIds: []
    });
  }
  static locationMetaRows(dto) {
    const location = `${dto.location ?? dto.creatorCity ?? ""}`.trim();
    const distanceLabel = this.distanceLabel(dto);
    const line = location && distanceLabel ? `${location} \xB7 ${distanceLabel}` : location || distanceLabel;
    return line ? [line] : [];
  }
  static currentStageMetaRows(dto, options) {
    const stage = dto.currentStage;
    const stageName = `${stage?.name ?? ""}`.trim();
    if (!stageName) {
      return [];
    }
    const current = Math.max(1, Math.trunc(Number(stage?.stageNumber) || 1));
    const total = Math.max(current, Math.trunc(Number(stage?.totalStages) || current));
    const values = { stage: stageName, current, total };
    const fallback = `Current stage: ${stageName} \xB7 ${current}/${total}`;
    return [options.translateParams?.("event.tournament.current.stage", values, fallback) ?? fallback];
  }
  static distanceLabel(dto) {
    const distanceKm = Number(dto.distanceKm);
    if (!Number.isFinite(distanceKm)) {
      return "";
    }
    return `${distanceKm} km`;
  }
  static footerChips(dto, pending) {
    if (!pending) {
      return [];
    }
    if (dto.pendingReason === "waitlist") {
      return [{ label: "waiting.list" }];
    }
    return [{ label: "waiting.for.approval" }];
  }
  static mediaStart(dto) {
    if (dto.eventType === "random-room") {
      return {
        variant: "badge",
        shape: "circle",
        tone: "selected",
        icon: "auto_awesome",
        label: "",
        ariaLabel: "System generated room",
        interactive: false
      };
    }
    return {
      variant: "avatar",
      imageUrl: dto.creatorAvatarUrl?.trim() || null,
      label: AppUtils.initialsFromText(dto.creatorInitials ?? dto.creatorName ?? dto.inviter ?? dto.title),
      ariaLabel: `View ${dto.creatorName || "organizer"} profile`,
      interactive: Boolean(this.profileUserId(dto))
    };
  }
  static profileUserId(dto) {
    return `${dto.organizerUserId ?? ""}`.trim() || `${dto.creatorUserId ?? ""}`.trim();
  }
  static rowType(dto) {
    return dto.type === "events" || dto.type === "hosting" || dto.type === "invitations" ? dto.type : "events";
  }
  static isPending(dto, activeUserId) {
    if (this.isPendingReview(dto)) {
      return true;
    }
    const userId = activeUserId.trim();
    if (!userId) {
      return false;
    }
    return this.includesUserId(dto.pendingRequestMemberUserIds, userId) || dto.pendingReason === "approval" || dto.pendingReason === "waitlist";
  }
  static isFull(dto) {
    return this.statusCode(dto.status) === "A" && (dto.full === true || dto.capacityTotal > 0 && dto.acceptedMembers >= dto.capacityTotal);
  }
  static capacityLabel(dto) {
    if (dto.slotsEnabled === true && dto.eventType !== "slot") {
      return "Multislot";
    }
    return `${Math.max(0, dto.acceptedMembers)} / ${Math.max(dto.acceptedMembers, dto.capacityTotal)}`;
  }
  static pendingMemberCount(dto) {
    return Math.max(0, Math.trunc(Number(dto.pendingMembers) || 0));
  }
  static summaryPendingMembers(card, options) {
    return this.normalizeCount(options.pendingMembersByRowId?.[card.id]) ?? this.normalizeCount(card.mediaEnd?.pendingCount) ?? 0;
  }
  static parseCapacityLabel(label) {
    const normalizedLabel = `${label ?? ""}`.trim();
    if (!normalizedLabel.includes("/")) {
      return null;
    }
    const parts = normalizedLabel.split("/").map((part) => Number.parseInt(part.trim(), 10));
    if (parts.length < 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
      return null;
    }
    const acceptedMembers = Math.max(0, Math.trunc(parts[0]));
    return {
      acceptedMembers,
      capacityTotal: Math.max(acceptedMembers, Math.trunc(parts[1]))
    };
  }
  static normalizeCount(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : null;
  }
  static surfaceTone(status, dto, activeUserId) {
    switch (status) {
      case "UR":
        return "review";
      case "B":
        return "blocked";
      case "D":
      case "T":
        return "deleted";
      case "I":
        return "inactive";
      case "DR":
        return "draft";
      default:
        if (dto.eventType === "random-room" || dto.eventType === "tournament-room") {
          return "system";
        }
        if (this.isInvited(dto, activeUserId)) {
          return "pending";
        }
        if (this.isPending(dto, activeUserId)) {
          return "pending";
        }
        if (this.statusCode(dto.status) === "A") {
          return this.isOwnedByActiveUser(dto, activeUserId) ? "published" : "series";
        }
        return "default";
    }
  }
  static mediaEndTone(status, dto, activeUserId) {
    switch (status) {
      case "UR":
        return "review";
      case "B":
        return "blocked";
      case "D":
      case "T":
        return "deleted";
      case "I":
        return "inactive";
      default:
        if (this.isInvited(dto, activeUserId)) {
          return "invitation";
        }
        return this.isFull(dto) ? "full" : "default";
    }
  }
  static leadingIcon(dto, status, pending, activeUserId) {
    if (status === "UR") {
      return "pending_actions";
    }
    if (status === "B") {
      return "block";
    }
    if (status === "D" || status === "T") {
      return "delete";
    }
    if (status === "I") {
      return "visibility_off";
    }
    if (pending) {
      return "pending_actions";
    }
    if (this.isInvited(dto, activeUserId)) {
      return "mail";
    }
    if (dto.eventType === "tournament-room") {
      return "emoji_events";
    }
    if (dto.eventType === "random-room") {
      return "auto_awesome";
    }
    return this.visibilityIcon(dto.visibility);
  }
  static visibilityIcon(option) {
    switch (option) {
      case "Public":
        return "public";
      case "Friends only":
        return "groups";
      default:
        return "mail_lock";
    }
  }
  static hasMenuOptions(dto) {
    if (this.isTrashed(dto)) {
      return this.shouldRestore(dto);
    }
    return !!dto.id;
  }
  static shouldRestore(dto) {
    return this.statusCode(dto.status) === "T";
  }
  static isPendingReview(dto) {
    const status = this.statusCode(dto.status);
    return status === "UR" || status === "B";
  }
  static isTrashed(dto) {
    const status = this.statusCode(dto.status);
    return status === "T";
  }
  static isInvited(dto, activeUserId) {
    return this.includesUserId(dto.invitedMemberUserIds, activeUserId);
  }
  static isOwnedByActiveUser(dto, activeUserId) {
    const userId = activeUserId.trim();
    return !userId || `${dto.creatorUserId ?? ""}`.trim() === userId;
  }
  static includesUserId(userIds, activeUserId) {
    const userId = activeUserId.trim();
    return !!userId && (userIds ?? []).some((candidate) => `${candidate ?? ""}`.trim() === userId);
  }
  static statusBadgeLabelKey(status, dto, activeUserId) {
    switch (status) {
      case "UR":
        return "under.review";
      case "B":
        return "blocked.user";
      case "T":
        return this.trashedBadgeLabelKey(dto, activeUserId);
      case "D":
        return "deleted.user";
      case "I":
        return "inactive.user";
      default:
        return "";
    }
  }
  static trashedBadgeLabelKey(dto, activeUserId) {
    if (dto.type === "invitations") {
      return "trash.invitation";
    }
    if (dto.type === "hosting") {
      return this.statusCode(dto.statusBeforeSuppression) === "DR" ? "trash.draft" : "trash.own.event";
    }
    if (this.isPending(dto, activeUserId)) {
      return "trash.pending.event";
    }
    if (this.includesUserId(dto.acceptedMemberUserIds, activeUserId)) {
      return "trash.joined.event";
    }
    return "trash.event";
  }
  static statusCode(statusValue) {
    const status = `${statusValue ?? ""}`.trim();
    switch (status) {
      case "A":
        return "A";
      case "DR":
        return "DR";
      case "T":
        return "T";
      case "UR":
        return "UR";
      case "B":
        return "B";
      case "D":
        return "D";
      case "I":
        return "I";
      default:
        return "A";
    }
  }
};

// src/app/shared/ui/converters/event-explore-info-card.converter.ts
var EventExploreInfoCardConverter = class {
  static convert(record, options = {}) {
    const membersPreviewVisible = this.canPreviewMembers(record);
    const full = this.isFull(record);
    const visibility = record.visibility;
    return {
      id: record.id,
      status: record.status,
      dateIso: record.startAtIso,
      distanceMetersExact: Math.max(0, Math.round((Number(record.distanceKm) || 0) * 1e3)),
      ownerId: record.creatorUserId,
      groupLabel: options.groupLabel ?? null,
      title: record.title,
      imageUrl: record.imageUrl,
      metaRows: [
        `${record.slotsEnabled ? "Series" : this.typeLabel(record)} \xB7 ${visibility} \xB7 ${this.distanceLabel(record)}`
      ],
      description: record.subtitle,
      detailRows: [record.slotsEnabled && record.nextSlot ? `Next slot \xB7 ${record.nextSlot.timeframe}` : record.timeframe],
      detailStyle: "mono",
      footerChips: [
        ...record.slotsEnabled ? [{ label: "Series" }] : [],
        ...record.topics.map((topic) => ({
          label: `#${this.topicLabel(topic)}`,
          toneClass: this.resolveTopicToneClass(topic, options.topicToneGroups)
        }))
      ],
      surfaceTone: full ? "full" : record.slotsEnabled ? "series" : "default",
      leadingIcon: {
        icon: this.visibilityIcon(visibility),
        tone: this.visibilityTone(record)
      },
      mediaStart: {
        variant: "badge",
        layout: "avatar-metric",
        tone: this.creatorOverlayTone(record),
        interactive: true,
        ariaLabel: "Open host impressions",
        leadingAccessory: {
          label: this.creatorInitials(record),
          tone: this.creatorAvatarOverlayTone(record)
        },
        detailLabel: record.rating.toFixed(1),
        detailIcon: "star"
      },
      mediaEnd: {
        variant: "badge",
        layout: "badge-with-leading-accessory",
        tone: membersPreviewVisible ? full ? "full" : "default" : "inactive",
        interactive: membersPreviewVisible,
        disabled: !membersPreviewVisible,
        ariaLabel: membersPreviewVisible ? "Open event members" : "Members hidden for this event",
        label: this.membersLabel(record),
        pendingCount: Math.max(0, Math.trunc(Number(record.pendingMembers) || 0)),
        leadingAccessory: {
          icon: this.blindModeIcon(record.blindMode),
          tone: record.blindMode === "Open Event" ? "positive" : "negative"
        }
      },
      menuActions: this.menuActionsForRecord(record, options.activeUserId ?? null),
      clickable: false,
      state: options.state ?? "default"
    };
  }
  static convertList(records, options = {}) {
    return records.map((record) => this.convert(record, options));
  }
  static menuActionsForRecord(record, activeUserId) {
    const normalizedUserId = `${activeUserId ?? ""}`.trim();
    if (normalizedUserId && record.creatorUserId === normalizedUserId) {
      return ["view", "notifyParticipants"];
    }
    if (normalizedUserId && this.hasVisibleCheckoutBasket(record, normalizedUserId)) {
      return ["view", "continueBookingPending", "askOrganizer", "shareEvent", "reportOrganizer"];
    }
    const actions = ["view"];
    actions.push(this.joinActionId(record));
    actions.push("askOrganizer");
    actions.push("shareEvent");
    actions.push("reportOrganizer");
    return actions;
  }
  static hasVisibleCheckoutBasket(record, activeUserId) {
    return activeUserId.length > 0 && record.checkoutResultState != null && record.checkoutResultState !== "deleted";
  }
  static creatorOverlayTone(record) {
    const rating = AppUtils.clampNumber(record.rating, 0, 10);
    if (rating <= 3) {
      return "cool";
    }
    if (rating <= 5.5) {
      return "cool-mid";
    }
    if (rating <= 7.2) {
      return "neutral";
    }
    if (rating <= 8.6) {
      return "warm-mid";
    }
    return "warm";
  }
  static creatorAvatarOverlayTone(record) {
    const toneIndex = AppUtils.hashText(`${record.type}:${record.id}:${this.creatorInitials(record)}`) % 8 + 1;
    return `tone-${toneIndex}`;
  }
  static visibilityTone(record) {
    if (record.visibility === "Friends only") {
      return "friends";
    }
    if (record.visibility === "Invitation only") {
      return "invitation";
    }
    return "public";
  }
  static distanceLabel(record) {
    const rounded = Math.round(record.distanceKm * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded} km` : `${rounded.toFixed(1)} km`;
  }
  static typeLabel(record) {
    return record.type === "hosting" ? "Hosting" : "Event";
  }
  static creatorInitials(record) {
    return record.creatorInitials || AppUtils.initialsFromText(record.creatorName || record.title);
  }
  static membersLabel(record) {
    if (record.slotsEnabled === true) {
      return "Multislot";
    }
    if (record.capacityTotal <= 0) {
      return "0 / 0";
    }
    return `${record.acceptedMembers} / ${record.capacityTotal}`;
  }
  static isFull(record) {
    return record.full === true;
  }
  static canPreviewMembers(record) {
    return record.blindMode === "Open Event";
  }
  static joinActionId(record) {
    if (this.isFull(record)) {
      return "joinWaitlist";
    }
    return this.requiresBookingFlow(record) ? "bookEvent" : "requestJoin";
  }
  static requiresBookingFlow(record) {
    if (record.ticketing === true) {
      return true;
    }
    return Boolean(record.pricing?.enabled && (Number(record.pricing?.basePrice) || 0) > 0);
  }
  static topicLabel(topic) {
    return topic.replace(/^#+\s*/, "");
  }
  static normalizeTopic(topic) {
    return AppUtils.normalizeText(`${topic}`.replace(/^#+\s*/, "").trim());
  }
  static resolveTopicToneClass(topic, groups) {
    if (!groups?.length) {
      return "";
    }
    const normalizedTopic = this.normalizeTopic(topic);
    if (!normalizedTopic) {
      return "";
    }
    for (const group of groups) {
      if (group.options.some((option) => this.normalizeTopic(option) === normalizedTopic)) {
        return group.toneClass;
      }
    }
    return "";
  }
  static visibilityIcon(visibility) {
    if (visibility === "Friends only") {
      return "groups";
    }
    if (visibility === "Invitation only") {
      return "mail_lock";
    }
    return "public";
  }
  static blindModeIcon(mode) {
    if (mode === "Open Event") {
      return "groups";
    }
    if (mode === "Blind Event") {
      return "visibility_off";
    }
    return "shield";
  }
};

// src/app/shared/ui/converters/activity-event-info-card-menu.converter.ts
var ActivityEventInfoCardMenuConverter = class {
  static availableActions = [
    "restore",
    "takeOver",
    "publish",
    "editEvent",
    "manageEvent",
    "viewInvitation",
    "view",
    "paymentSummary",
    "continueBooking",
    "notifyParticipants",
    "askOrganizer",
    "shareEvent",
    "unpublish",
    "reportOrganizer",
    "accept",
    "leaveEvent",
    "deleteEvent",
    "rejectInvitation"
  ];
  static convert(subject, options = {}) {
    if (!subject) {
      return [];
    }
    const availableActions = options.availableActions ?? this.availableActions;
    const hiddenActions = new Set((options.hiddenActions ?? []).map((actionId) => `${actionId ?? ""}`.trim()));
    return availableActions.filter((actionId) => !hiddenActions.has(actionId)).flatMap((actionId) => this.menuItem(subject, actionId, options.activeUserId ?? ""));
  }
  static canEditEvent(subject, options = {}) {
    return this.eventEditorAction(subject, options) !== "view";
  }
  static eventEditorAction(subject, options = {}) {
    if (!subject) {
      return "view";
    }
    const activeUserId = options.activeUserId ?? "";
    if (this.isActionVisible(subject, "editEvent", activeUserId)) {
      return "edit";
    }
    return this.isActionVisible(subject, "manageEvent", activeUserId) ? "manage" : "view";
  }
  static menuItem(subject, actionId, activeUserId) {
    if (!this.isActionVisible(subject, actionId, activeUserId)) {
      return [];
    }
    const config = CARD_MENU_ACTIONS[actionId];
    if (!config) {
      return [];
    }
    const action = __spreadValues({
      id: actionId
    }, config);
    return [{
      id: actionId,
      label: config.label,
      icon: config.icon,
      palette: this.actionPalette(actionId, config.tone),
      surface: "tinted",
      counter: actionId === "view" && this.pendingActivityCount(subject) > 0 ? { value: this.pendingActivityCount(subject), max: 99 } : null,
      counterTone: actionId === "view" ? "alert" : "default",
      context: {
        menu: "activity-event-card",
        subject,
        action
      }
    }];
  }
  static isActionVisible(subject, actionId, activeUserId) {
    if (this.isTrashed(subject)) {
      if (this.isAdmin(subject, activeUserId)) {
        return actionId === "restore" || actionId === "view" || actionId === "notifyParticipants";
      }
      return actionId === "restore" || actionId === "view" || actionId === "askOrganizer";
    }
    switch (actionId) {
      case "restore":
        return false;
      case "takeOver":
        return this.statusCode(subject.status) === "UR" && this.isAdmin(subject, activeUserId);
      case "publish":
        return this.isAdmin(subject, activeUserId) && this.isDraft(subject) && !this.isPendingReview(subject);
      case "editEvent":
        return this.isAdmin(subject, activeUserId) && this.isDraft(subject) && !this.isPendingReview(subject);
      case "manageEvent":
        return this.isAdmin(subject, activeUserId) && !this.isDraft(subject) && !this.isPendingReview(subject);
      case "viewInvitation":
        return this.hasOutstandingInvitation(subject, activeUserId) && !this.isPendingReview(subject);
      case "view":
        return !this.hasOutstandingInvitation(subject, activeUserId);
      case "paymentSummary":
        return subject.checkoutMenuAction === "paymentSummary" && !this.isAdmin(subject, activeUserId);
      case "continueBooking":
        return subject.checkoutMenuAction === "continueBooking" && !this.isAdmin(subject, activeUserId);
      case "notifyParticipants":
        return this.isAdmin(subject, activeUserId);
      case "askOrganizer":
        return !this.isAdmin(subject, activeUserId);
      case "shareEvent":
        return true;
      case "unpublish":
        return this.isAdmin(subject, activeUserId) && !this.isDraft(subject) && !this.isPendingReview(subject);
      case "reportOrganizer":
        return this.shouldReport(subject, activeUserId);
      case "accept":
        return this.hasOutstandingInvitation(subject, activeUserId) && !this.checkoutJoinStarted(subject);
      case "leaveEvent":
        return !this.isAdmin(subject, activeUserId) && this.isAcceptedOrActiveEventMember(subject, activeUserId) && !this.hasOutstandingInvitation(subject, activeUserId);
      case "deleteEvent":
        return this.isAdmin(subject, activeUserId) && !this.isPendingReview(subject);
      case "rejectInvitation":
        return this.hasOutstandingInvitation(subject, activeUserId) && !this.checkoutJoinStarted(subject) && !this.isPendingReview(subject);
      default:
        return false;
    }
  }
  static isDraft(subject) {
    return this.statusCode(subject.status) === "DR";
  }
  static shouldReport(subject, activeUserId) {
    const ownerUserId = `${subject.ownerUserId ?? ""}`.trim();
    return !!ownerUserId && ownerUserId !== activeUserId.trim();
  }
  static isPendingReview(subject) {
    const status = this.statusCode(subject.status);
    return status === "UR" || status === "B";
  }
  static isTrashed(subject) {
    const status = this.statusCode(subject.status);
    return status === "T";
  }
  static isAdmin(subject, activeUserId) {
    const userId = activeUserId.trim();
    const ownerUserId = `${subject.ownerUserId ?? ""}`.trim();
    return !!userId && (ownerUserId === userId || this.includesUserId(subject.adminIds, userId));
  }
  static isInvited(subject, activeUserId) {
    return this.includesUserId(subject.invitedMemberUserIds, activeUserId);
  }
  static hasOutstandingInvitation(subject, activeUserId) {
    return this.isInvited(subject, activeUserId) && !this.isAcceptedMember(subject, activeUserId) && !this.isPendingRequest(subject, activeUserId);
  }
  static isPendingRequest(subject, activeUserId) {
    const userId = activeUserId.trim();
    return this.includesUserId(subject.pendingRequestMemberUserIds, userId) || this.includesUserId(subject.pendingMemberUserIds, userId) && !this.includesUserId(subject.invitedMemberUserIds, userId);
  }
  static isAcceptedMember(subject, activeUserId) {
    return this.includesUserId(subject.acceptedMemberUserIds, activeUserId);
  }
  static pendingActivityCount(subject) {
    return this.nonNegativeInteger(subject.activity);
  }
  static nonNegativeInteger(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
  static checkoutJoinStarted(subject) {
    return subject.checkoutState === "approved" || subject.checkoutState === "confirmed" || subject.checkoutState === "pay";
  }
  static isAcceptedOrActiveEventMember(subject, activeUserId) {
    if (this.isAcceptedMember(subject, activeUserId)) {
      return true;
    }
    if (subject.checkoutMenuAction === "paymentSummary") {
      return true;
    }
    return subject.eventScope === "active-events" && !this.isPendingRequest(subject, activeUserId);
  }
  static includesUserId(userIds, activeUserId) {
    const userId = activeUserId.trim();
    return !!userId && (userIds ?? []).some((candidate) => `${candidate ?? ""}`.trim() === userId);
  }
  static statusCode(statusValue) {
    const status = `${statusValue ?? ""}`.trim();
    switch (status) {
      case "A":
        return "A";
      case "DR":
        return "DR";
      case "T":
        return "T";
      case "UR":
        return "UR";
      case "B":
        return "B";
      case "D":
        return "D";
      case "I":
        return "I";
      default:
        return "A";
    }
  }
  static actionPalette(actionId, tone) {
    if (actionId === "paymentSummary") {
      return "teal";
    }
    switch (tone) {
      case "positive":
        return "teal";
      case "accent":
        return "brown";
      case "warning":
      case "review":
        return "orange";
      case "destructive":
        return "danger";
      default:
        return "default";
    }
  }
};

// src/app/shared/ui/converters/activity-sub-event-resource-info-card.converter.ts
var ActivitySubEventResourceInfoCardConverter = class {
  static convert(card, options) {
    return {
      id: card.id,
      groupLabel: options.groupLabel ?? null,
      title: card.title,
      imageUrl: card.imageUrl,
      metaRows: [`${card.type} \xB7 ${card.subtitle} \xB7 ${card.city}`],
      description: card.details,
      leadingIcon: {
        icon: this.resourceTypeIcon(card.type)
      },
      mediaStart: this.resourceMediaStart(card),
      mediaEnd: {
        variant: "badge",
        tone: "default",
        label: this.occupancyLabel(card),
        interactive: this.canOpenBadgeDetails(card),
        pendingCount: card.pending,
        ariaLabel: this.canOpenAssetMembers(card) ? "Open member requests" : "Open resource details"
      },
      menuActions: this.resourceMenuActions(card, options),
      clickable: false
    };
  }
  static convertList(cards, options) {
    return cards.map((card) => this.convert(card, options));
  }
  static resourceTypeIcon(type) {
    return type === "Members" ? "groups" : AssetDefaultsBuilder.assetTypeIcon(type);
  }
  static resourceMediaStart(card) {
    if (!this.canOpenMap(card)) {
      return null;
    }
    return {
      variant: "avatar",
      tone: "default",
      icon: "location_on",
      interactive: true,
      ariaLabel: card.type === ASSET_TYPE_TRANSPORT ? "Open route map" : "Open accommodation map"
    };
  }
  static resourceMenuActions(card, options) {
    const actions = ["viewAsset"];
    if (this.canJoin(card, options)) {
      actions.push("joinResource");
    } else if (this.canLeave(card, options)) {
      actions.push("leaveResource");
    }
    if (this.hasActiveUserBorrowRequest(card, options)) {
      actions.push("paymentSummary");
    }
    actions.push("askOrganizer");
    actions.push("shareAsset");
    if (this.canReportResourceManager(card, options)) {
      actions.push(card.sourceAssetId ? "reportManager" : "reportOrganizer");
    }
    if (this.isSourceAssetManagedByActiveUser(card, options)) {
      actions.push("removeAssignment");
    }
    return actions;
  }
  static resourceCardAssetType(card) {
    if (!card.sourceAssetId || !isAssetType(card.type)) {
      return null;
    }
    return card.type;
  }
  static canOpenMap(card) {
    if (!card.sourceAssetId || card.type !== ASSET_TYPE_TRANSPORT && card.type !== ASSET_TYPE_ACCOMMODATION) {
      return false;
    }
    return ActivityResourceBuilder.normalizeAssetRoutes(card.type, card.routes).some((stop) => stop.trim().length > 0);
  }
  static canOpenAssetMembers(card) {
    return this.isAssignableAsset(card);
  }
  static canOpenBadgeDetails(card) {
    return this.isAssignableAsset(card);
  }
  static canJoin(card, options) {
    return this.isJoinableAssignedAsset(card, options) && !this.hasActiveUserJoinRequest(card, options);
  }
  static canLeave(card, options) {
    return this.isJoinableAssignedAsset(card, options) && this.hasActiveUserJoinRequest(card, options);
  }
  static isJoinableAssignedAsset(card, options) {
    return !!card.sourceAssetId && (card.type === ASSET_TYPE_TRANSPORT || card.type === ASSET_TYPE_ACCOMMODATION) && !!this.sourceAsset(card, options) && !this.isSourceAssetManagedByActiveUser(card, options);
  }
  static isSourceAssetManagedByActiveUser(card, options) {
    const activeUserId = this.normalizeId(options.activeUserId);
    const managerUserId = this.normalizeId(this.sourceAsset(card, options)?.ownerUserId) || this.normalizeId(this.assetManagerUserId(card, options));
    return activeUserId.length > 0 && managerUserId === activeUserId;
  }
  static hasActiveUserJoinRequest(card, options) {
    const sourceAsset = this.sourceAsset(card, options);
    const subEventId = this.contextSubEventId(options);
    const activeUserId = this.normalizeId(options.activeUserId);
    if (!sourceAsset || !subEventId || !activeUserId) {
      return false;
    }
    const syncedStatus = this.activeUserStatusChange(card, options);
    if (syncedStatus) {
      return syncedStatus === "accepted" || syncedStatus === "pending";
    }
    const users = options.users ?? [];
    return (sourceAsset.requests ?? []).some((request) => request.requestKind !== "manual" && ActivityResourceBuilder.isSubEventScopedAssetRequest(request, subEventId) && AppUtils.resolveAssetRequestUserId(request, users) === activeUserId);
  }
  static hasActiveUserBorrowRequest(card, options) {
    const sourceAsset = this.sourceAsset(card, options);
    const subEventId = this.contextSubEventId(options);
    const activeUserId = this.normalizeId(options.activeUserId);
    if (!sourceAsset || !subEventId || !activeUserId) {
      return false;
    }
    const syncedStatus = this.activeUserStatusChange(card, options);
    if (syncedStatus) {
      return syncedStatus === "accepted" || syncedStatus === "pending";
    }
    const users = options.users ?? [];
    return (sourceAsset.requests ?? []).some((request) => request.requestKind === "borrow" && ActivityResourceBuilder.isSubEventScopedAssetRequest(request, subEventId) && AppUtils.resolveAssetRequestUserId(request, users) === activeUserId);
  }
  static canReportResourceManager(card, options) {
    const reportTargetUserId = this.normalizeId(this.reportTargetUserId(card, options));
    const activeUserId = this.normalizeId(options.activeUserId);
    return reportTargetUserId.length > 0 && reportTargetUserId !== activeUserId;
  }
  static isAssignableAsset(card) {
    return !!card.sourceAssetId && isAssetType(card.type);
  }
  static occupancyLabel(card) {
    return `${card.accepted} / ${card.capacityTotal}`;
  }
  static sourceAsset(card, options) {
    const type = this.resourceCardAssetType(card);
    const sourceAssetId = this.normalizeId(card.sourceAssetId);
    if (!type || !sourceAssetId) {
      return null;
    }
    return this.findSourceAsset(type, sourceAssetId, options);
  }
  static findSourceAsset(type, sourceAssetId, options) {
    return (options.activeUserAssets ?? []).find((asset) => asset.type === type && this.normalizeId(asset.id) === sourceAssetId) ?? (options.context?.fallbackCardsByType?.[type] ?? []).find((asset) => asset.type === type && this.normalizeId(asset.id) === sourceAssetId) ?? null;
  }
  static assetManagerUserId(card, options) {
    const subEventId = this.contextSubEventId(options);
    const sourceAssetId = this.normalizeId(card.sourceAssetId);
    if (!subEventId || !sourceAssetId || card.type !== ASSET_TYPE_TRANSPORT && card.type !== ASSET_TYPE_ACCOMMODATION) {
      return null;
    }
    const settings = options.assetSettingsByKey?.[ActivityResourceBuilder.subEventAssetAssignmentKey(subEventId, card.type)];
    const managerUserId = this.normalizeId(settings?.[sourceAssetId]?.addedByUserId);
    return managerUserId || null;
  }
  static reportTargetUserId(card, options) {
    const sourceAsset = this.sourceAsset(card, options);
    const managerUserId = this.normalizeId(sourceAsset?.ownerUserId) || this.normalizeId(this.assetManagerUserId(card, options));
    if (managerUserId) {
      return managerUserId;
    }
    return this.normalizeId(options.eventCreatorUserId) || this.normalizeId(options.context?.subEvent?.createdByUserId) || null;
  }
  static contextSubEventId(options) {
    return this.normalizeId(options.context?.subEvent?.id);
  }
  static activeUserStatusChange(card, options) {
    const assetId = this.normalizeId(card.sourceAssetId);
    const change = assetId ? options.memberSyncByOwnerId?.[assetId]?.memberStatusChange : null;
    if (!change || this.normalizeId(change.userId) !== this.normalizeId(options.activeUserId) || this.normalizeId(change.subEventId) !== this.contextSubEventId(options)) {
      return null;
    }
    const contextEventId = this.normalizeId(options.context?.ownerId);
    if (contextEventId && this.normalizeId(change.eventId) !== contextEventId) {
      return null;
    }
    return change.status;
  }
  static normalizeId(value) {
    return `${value ?? ""}`.trim();
  }
};

// src/app/shared/ui/converters/activity-rate-image-card.converter.ts
var ActivityRateImageCardConverter = class {
  static convert(dto, options) {
    const direction = dto.direction;
    const primaryUser = this.resolvePrimaryUser(dto, options);
    const ownScore = this.rateOwnScore(dto);
    const distanceMetersExact = this.exactDistanceMeters(dto);
    const sortScore = direction === "mutual" ? ownScore + Math.max(dto.scoreReceived, 0) : ownScore;
    return {
      id: dto.id,
      smartListKey: `rates:${dto.id}`,
      status: direction,
      dateIso: dto.happenedAt ?? "",
      distanceMetersExact,
      sortScore,
      localSortKey: activityRateSortKey(dto, options.order ?? {
        sort: "happenedAt",
        secondaryFilter: "recent"
      }),
      title: primaryUser?.name ?? dto.userId,
      subtitle: "",
      detail: "",
      mode: dto.mode,
      direction: dto.direction,
      displayedDirection: direction,
      eventName: dto.eventName,
      happenedOnLabel: this.formatMonthDayLabel(dto.happenedAt),
      primaryUser: primaryUser ? this.toImageCardPerson(primaryUser) : null,
      pairUsers: this.buildPairUsers(dto, options),
      availableUsers: this.buildAvailableUsers(options),
      singleImageUrls: this.buildSingleImageUrls(dto, primaryUser),
      pairSlots: this.buildPairSlots(dto, options),
      contextBadge: this.buildContextBadge(dto, options),
      stackClasses: [
        dto.mode === "pair" ? "activities-rate-profile-stack-pair" : "activities-rate-profile-stack-single",
        `activities-rate-profile-stack-${direction}`
      ],
      userId: dto.userId,
      secondaryUserId: dto.secondaryUserId ?? null,
      socialContext: dto.socialContext ?? null,
      bridgeUserId: dto.bridgeUserId ?? null,
      bridgeCount: Number.isFinite(dto.bridgeCount) ? Math.max(0, Math.trunc(Number(dto.bridgeCount))) : null,
      scoreGiven: Number.isFinite(dto.scoreGiven) ? dto.scoreGiven : null,
      scoreReceived: Number.isFinite(dto.scoreReceived) ? dto.scoreReceived : null
    };
  }
  static convertList(dtos, options) {
    return dtos.map((dto) => this.convert(dto, options));
  }
  static resolvePrimaryUser(dto, options) {
    return this.resolveRatedUserById(dto.userId, options);
  }
  static resolveRatedUserById(userId, options) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return null;
    }
    return (options.ratedUsers ?? []).find((user) => user.id.trim() === normalizedUserId) ?? null;
  }
  static buildAvailableUsers(options) {
    const usersById = /* @__PURE__ */ new Map();
    for (const user of options.ratedUsers ?? []) {
      const normalizedUserId = user.id.trim();
      if (!normalizedUserId || usersById.has(normalizedUserId)) {
        continue;
      }
      usersById.set(normalizedUserId, user);
    }
    return [...usersById.values()].map((user) => this.toImageCardPerson(user));
  }
  static toImageCardPerson(user) {
    return {
      id: user.id,
      name: user.name,
      age: user.age,
      city: user.city,
      gender: user.gender,
      profile: user
    };
  }
  static buildPairUsers(dto, options) {
    return [dto.userId, dto.secondaryUserId].filter((userId) => typeof userId === "string" && userId.trim().length > 0).map((userId) => this.resolveRatedUserById(userId, options)).filter((user) => Boolean(user)).map((user) => this.toImageCardPerson(user));
  }
  static buildSingleImageUrls(dto, user) {
    const seedUserId = user?.id ?? dto.userId ?? dto.id;
    const seededCount = 1 + AppUtils.hashText(`rate-photo-count:${seedUserId || dto.id}`) % 4;
    const desiredCount = dto.direction === "met" ? Math.min(2, seededCount) : seededCount;
    return this.buildDisplayImageUrls(user?.images, Math.max(1, Math.min(4, desiredCount)));
  }
  static buildPairSlots(dto, options) {
    return [0, 1].map((index) => {
      const slot = index === 0 ? "woman" : "man";
      const label = this.resolvePairSlotLabel(dto, index);
      const user = this.resolveRatedUserById(index === 0 ? dto.userId : dto.secondaryUserId, options);
      return {
        key: slot,
        label,
        tone: user?.gender ?? slot,
        slides: user ? this.buildPairSlotSlides(dto, slot, user) : [{
          imageUrl: "",
          primaryLine: `${label} - waiting`,
          secondaryLine: "No pair card yet",
          placeholderLabel: ""
        }],
        profileView: user ? {
          userId: user.id,
          label: user.name
        } : null
      };
    });
  }
  static buildContextBadge(dto, options) {
    if (dto.mode !== "individual" || dto.socialContext !== "friends-in-common") {
      return null;
    }
    const bridgeUser = this.resolveRatedUserById(dto.bridgeUserId, options);
    if (!bridgeUser) {
      return null;
    }
    const bridgeCount = Math.max(0, Math.trunc(Number(dto.bridgeCount) || 0));
    return {
      label: AppUtils.initialsFromText(bridgeUser.name),
      imageUrl: this.firstProfileImageUrl(bridgeUser),
      counterLabel: bridgeCount > 1 ? `+${bridgeCount - 1}` : null,
      title: this.contextBadgeTitle(bridgeUser.name, bridgeCount),
      ariaLabel: `View ${bridgeUser.name} profile`,
      profileView: {
        userId: bridgeUser.id,
        label: bridgeUser.name
      }
    };
  }
  static contextBadgeTitle(bridgeName, bridgeCount) {
    const extraCount = Math.max(0, Math.trunc(Number(bridgeCount) || 0) - 1);
    return extraCount > 0 ? `Shown via ${bridgeName} and ${extraCount} more` : `Shown via ${bridgeName}`;
  }
  static firstProfileImageUrl(user) {
    return user.images?.map((image) => `${image ?? ""}`.trim()).find((image) => image.length > 0) ?? null;
  }
  static buildPairSlotSlides(dto, slot, user) {
    const seededCount = 2 + AppUtils.hashText(`pair-rate-photo-count:${dto.id}:${slot}:${user.id}`) % 2;
    return this.buildDisplayImageUrls(user.images, seededCount).map((imageUrl) => ({
      imageUrl,
      primaryLine: `${user.name}, ${user.age}`,
      secondaryLine: `${user.city} - ${this.distanceKmFromMeters(this.exactDistanceMeters(dto))} km`,
      placeholderLabel: AppUtils.initialsFromText(user.name)
    }));
  }
  static buildDisplayImageUrls(images, count) {
    const normalizedCount = Math.max(1, Math.min(4, Math.trunc(count)));
    const source = (images ?? []).map((image) => `${image ?? ""}`.trim()).filter((image) => image.length > 0);
    if (source.length === 0) {
      return Array.from({ length: normalizedCount }, () => "");
    }
    return Array.from({ length: normalizedCount }, (_item, index) => source[index % source.length]);
  }
  static resolvePairSlotLabel(dto, index) {
    if (dto.socialContext === "friends-in-common") {
      return index === 0 ? "Person" : "Common friend";
    }
    if (dto.socialContext === "separated-friends") {
      return index === 0 ? "Friend A" : "Friend B";
    }
    return index === 0 ? "Person A" : "Person B";
  }
  static rateOwnScore(dto) {
    if (Number.isFinite(dto.scoreGiven) && dto.scoreGiven > 0) {
      return Math.min(10, Math.max(1, Math.round(dto.scoreGiven)));
    }
    return 5;
  }
  static exactDistanceMeters(dto) {
    if (Number.isFinite(dto.distanceMetersExact)) {
      return Math.max(0, Math.trunc(Number(dto.distanceMetersExact)));
    }
    return 0;
  }
  static distanceKmFromMeters(distanceMeters) {
    const meters = Math.max(0, Math.trunc(Number(distanceMeters) || 0));
    return Math.round(meters / 1e3 * 10) / 10;
  }
  static formatMonthDayLabel(isoValue) {
    const date = AppUtils.parseDate(isoValue);
    return date ? AppUtils.shortMonthDayLabel(date) : "Activity date";
  }
};

// src/app/shared/ui/converters/event-feedback-detail.converter.ts
var EventFeedbackDetailConverter = class {
  static convert(result) {
    return (result.cards ?? []).map((card) => this.convertCard(card));
  }
  static convertCard(source) {
    const eventId = source.eventId.trim();
    const eventTitle = source.eventTitle.trim() || "Event";
    const eventSubtitle = source.eventSubtitle.trim();
    const eventLabel = source.eventLabel.trim() || source.eventTimeframe.trim() || "Recent event";
    const targetName = source.targetName.trim() || "Member";
    const targetCity = source.targetCity?.trim() || "";
    const targetTraitLabel = source.targetTraitLabel?.trim() || "participant";
    if (source.kind === "attendee") {
      const targetRole = this.normalizeRole(source.targetRole) ?? "Member";
      return {
        id: source.id.trim(),
        eventId,
        kind: "attendee",
        attendeeUserId: source.attendeeUserId?.trim() || void 0,
        targetUserId: source.targetUserId?.trim() || void 0,
        targetRole,
        icon: "groups",
        imageUrl: source.targetImageUrl?.trim() || source.eventImageUrl?.trim() || `https://picsum.photos/seed/event-feedback-attendee-${eventId}-${source.targetUserId ?? source.id}/1200/700`,
        toneClass: `feedback-card-tone-attendee ${this.feedbackRoleToneClass(targetRole)}`,
        heading: `${targetName} \xB7 ${eventTitle}`,
        subheading: `Attendee feedback \xB7 ${eventLabel}`,
        identityTitle: this.identityTitle(targetName, source.targetAge),
        identitySubtitle: [targetRole, targetCity].filter(Boolean).join(" \xB7 "),
        identityStatusClass: this.feedbackRoleStatusClass(targetRole),
        identityStatusIcon: this.feedbackRoleStatusIcon(targetRole),
        questionPrimary: `How was collaboration with ${targetName} (${targetTraitLabel}) during this event?`,
        questionSecondary: `Would you team up with ${targetName} again in a future event?`,
        primaryOptions: [...APP_STATIC_DATA.eventFeedbackAttendeeCollabOptions],
        secondaryOptions: [...APP_STATIC_DATA.eventFeedbackAttendeeRejoinOptions],
        traitQuestion: `Which personality traits best matched ${targetName} in this event?`,
        traitOptions: [...APP_STATIC_DATA.eventFeedbackPersonalityTraitOptions],
        selectedTraitIds: [...source.selectedTraitIds ?? []],
        answerPrimary: source.answerPrimary?.trim() ?? "",
        answerSecondary: source.answerSecondary?.trim() ?? "",
        eventComment: ""
      };
    }
    return {
      id: source.id.trim(),
      eventId,
      kind: "event",
      targetUserId: source.targetUserId?.trim() || void 0,
      targetRole: "Admin",
      icon: "event_available",
      imageUrl: source.eventImageUrl?.trim() || "",
      toneClass: "feedback-card-tone-event feedback-role-admin",
      heading: eventTitle,
      subheading: [eventLabel, eventSubtitle].filter(Boolean).join(" \xB7 "),
      identityTitle: `${targetName} \xB7 Host`,
      identitySubtitle: ["Admin", targetCity].filter(Boolean).join(" \xB7 "),
      identityStatusClass: "member-status-admin",
      identityStatusIcon: "admin_panel_settings",
      questionPrimary: `How did ${eventTitle} feel for you overall?`,
      questionSecondary: `What should ${targetName} improve next time?`,
      primaryOptions: [...APP_STATIC_DATA.eventFeedbackEventOverallOptions],
      secondaryOptions: [...APP_STATIC_DATA.eventFeedbackHostImproveOptions],
      traitQuestion: `Which traits describe ${targetName} best as the event creator?`,
      traitOptions: [...APP_STATIC_DATA.eventFeedbackPersonalityTraitOptions],
      selectedTraitIds: [...source.selectedTraitIds ?? []],
      answerPrimary: source.answerPrimary?.trim() ?? "",
      answerSecondary: source.answerSecondary?.trim() ?? "",
      eventComment: source.eventComment?.trim() ?? ""
    };
  }
  static identityTitle(name, age) {
    const normalizedAge = Number(age);
    if (!Number.isFinite(normalizedAge) || normalizedAge <= 0) {
      return name;
    }
    return `${name}, ${Math.trunc(normalizedAge)}`;
  }
  static normalizeRole(role) {
    if (role === "Admin" || role === "Manager" || role === "Member") {
      return role;
    }
    return void 0;
  }
  static feedbackRoleToneClass(role) {
    if (role === "Admin") {
      return "feedback-role-admin";
    }
    if (role === "Manager") {
      return "feedback-role-manager";
    }
    return "feedback-role-member";
  }
  static feedbackRoleStatusClass(role) {
    if (role === "Admin") {
      return "member-status-admin";
    }
    if (role === "Manager") {
      return "member-status-manager";
    }
    return "member-status-member";
  }
  static feedbackRoleStatusIcon(role) {
    if (role === "Admin") {
      return "admin_panel_settings";
    }
    if (role === "Manager") {
      return "manage_accounts";
    }
    return "person";
  }
};
var EventFeedbackDetailInfoCardConverter = class {
  static convert(card) {
    const detailRows = [card.identityTitle].filter((row) => !!row?.trim());
    return {
      id: card.id,
      title: card.heading,
      imageUrl: card.imageUrl,
      metaRows: [card.subheading],
      metaRowsLimit: 1,
      detailRows,
      leadingIcon: {
        icon: card.icon
      },
      clickable: false
    };
  }
};
var EventFeedbackDetailImageCardConverter = class {
  static convert(card) {
    const isEventCard = card.kind === "event";
    return {
      id: card.id,
      title: isEventCard ? card.heading : card.identityTitle || card.heading,
      subtitle: isEventCard ? card.subheading : card.identitySubtitle || card.subheading,
      detail: isEventCard ? card.identityTitle : null,
      imageUrl: card.imageUrl,
      layout: "overlay",
      toneClass: card.toneClass,
      placeholderIcon: card.icon,
      placeholderLabel: isEventCard ? "Event" : "Member",
      statusChip: {
        icon: card.icon,
        tone: isEventCard ? "info" : "success",
        palette: isEventCard ? "blue" : "green",
        ariaLabel: isEventCard ? "Event feedback" : "Member feedback"
      }
    };
  }
};

// src/app/shared/ui/converters/event-feedback-form-flow.converter.ts
var EventFeedbackFormFlowConverter = class {
  static convert(detail, options = {}) {
    const normalizedDetail = new EventFeedbackDetailDto(detail);
    const cards = EventFeedbackDetailConverter.convert(normalizedDetail);
    return {
      title: "Event Feedback",
      subtitle: options.eventTitle?.trim() || normalizedDetail.title,
      layout: "carousel",
      loadingLabel: "Loading feedback",
      save: {
        label: "Submit feedback",
        ariaLabel: "Submit event feedback",
        icon: "send"
      },
      summary: {
        title: "Overview",
        subtitle: "Review your answers before submitting.",
        icon: "fact_check",
        includeEmpty: true
      },
      steps: cards.map((card, cardIndex) => ({
        id: card.id,
        title: card.kind === "event" ? card.heading : card.identityTitle || card.heading,
        subtitle: card.subheading,
        icon: card.icon,
        header: {
          title: card.kind === "event" ? card.heading : card.identityTitle || card.heading,
          subtitle: card.kind === "event" ? card.subheading : card.identitySubtitle || card.subheading,
          imageCard: card.kind === "event" ? null : EventFeedbackDetailImageCardConverter.convert(card),
          infoCard: card.kind === "event" ? EventFeedbackDetailInfoCardConverter.convert(card) : null,
          imageUrl: card.imageUrl,
          icon: card.icon
        },
        controls: [
          {
            id: `${card.id}-primary`,
            kind: "menu",
            label: card.questionPrimary,
            bind: ["cards", cardIndex, "answerPrimary"],
            required: true,
            config: this.inlineTabsMenuConfig(this.primaryOptionModel(card))
          },
          {
            id: `${card.id}-secondary`,
            kind: "menu",
            label: card.questionSecondary,
            bind: ["cards", cardIndex, "answerSecondary"],
            required: true,
            config: this.inlineTabsMenuConfig(this.secondaryOptionModel(card))
          },
          {
            id: `${card.id}-traits`,
            kind: "menu",
            layout: "wide",
            label: card.traitQuestion,
            description: "Pick up to 3",
            bind: ["cards", cardIndex, "selectedTraitIds"],
            required: true,
            config: this.inlineTabsMenuConfig(this.traitOptionModel(card))
          },
          ...card.kind === "event" ? [{
            id: `${card.id}-comment`,
            kind: "textarea",
            layout: "wide",
            label: "Your opinion about the event",
            description: "Optional \xB7 up to 160 characters",
            placeholder: "What would you tell someone about this event?",
            bind: ["cards", cardIndex, "eventComment"],
            rows: 3,
            maxLength: 160
          }] : []
        ]
      }))
    };
  }
  static inlineTabsMenuConfig(model) {
    return {
      kind: "inline",
      layout: "tabs",
      panelMode: "anchored",
      model,
      closeOnSelect: false
    };
  }
  static primaryOptionModel(card) {
    return this.optionModel(`${card.id}-primary-options`, card.primaryOptions.map((option) => this.optionMenuItem(card, "primary", option)));
  }
  static secondaryOptionModel(card) {
    return this.optionModel(`${card.id}-secondary-options`, card.secondaryOptions.map((option) => this.optionMenuItem(card, "secondary", option)));
  }
  static traitOptionModel(card) {
    const items = card.traitOptions.map((trait) => {
      return {
        id: `${card.id}-trait-${trait.id}`,
        label: trait.label,
        icon: trait.icon,
        kind: "checkbox",
        value: trait.id,
        palette: this.traitPalette(trait),
        surface: "tinted",
        closeOnSelect: false,
        context: {
          cardId: card.id,
          group: "traits"
        }
      };
    });
    return this.optionModel(`${card.id}-trait-options`, items, 3);
  }
  static optionMenuItem(card, group, option) {
    return {
      id: `${card.id}-${group}-${option.value}`,
      label: option.label,
      icon: option.icon,
      kind: "radio",
      value: option.value,
      palette: this.optionPalette(option),
      surface: "tinted",
      closeOnSelect: false,
      context: { cardId: card.id, group }
    };
  }
  static optionModel(id, items, maxSelected = null) {
    return {
      layout: "tabs",
      maxSelected,
      groups: [{
        id,
        items
      }]
    };
  }
  static optionPalette(option) {
    const impressionTag = `${option.impressionTag ?? ""}`.trim().toLowerCase();
    if (impressionTag.includes("reliab") || impressionTag.includes("trust") || impressionTag.includes("teamwork")) {
      return "green";
    }
    if (impressionTag.includes("communicat") || impressionTag.includes("compat")) {
      return "violet";
    }
    if (impressionTag.includes("organization") || impressionTag.includes("timing")) {
      return "amber";
    }
    if (impressionTag.includes("planning") || impressionTag.includes("resource") || impressionTag.includes("quality")) {
      return "mint";
    }
    if (impressionTag.includes("consistency") || impressionTag.includes("neutral")) {
      return "slate";
    }
    if (impressionTag.includes("risk")) {
      return "red";
    }
    if (impressionTag.includes("fit")) {
      return "orange";
    }
    switch (option.value.trim().toLowerCase()) {
      case "excellent":
      case "great":
      case "yes":
        return "sky";
      case "good":
      case "reliable":
        return "cyan";
      case "mixed":
      case "communication":
      case "neutral":
      case "maybe":
        return "violet";
      case "needs-work":
      case "resources":
      case "context":
        return "mint";
      case "timing":
      case "rough":
        return "amber";
      case "none":
      case "no":
        return "slate";
      default:
        return "sky";
    }
  }
  static traitPalette(trait) {
    const lookup = `${trait.id} ${trait.label} ${trait.coreVibe}`.toLowerCase();
    if (lookup.includes("creative")) {
      return "violet";
    }
    if (lookup.includes("empath") || lookup.includes("kind") || lookup.includes("nurtur")) {
      return "pink";
    }
    if (lookup.includes("reliable") || lookup.includes("trust") || lookup.includes("stable")) {
      return "green";
    }
    if (lookup.includes("adventur") || lookup.includes("energetic") || lookup.includes("bold")) {
      return "cyan";
    }
    if (lookup.includes("think") || lookup.includes("reflect") || lookup.includes("intellectual")) {
      return "blue";
    }
    if (lookup.includes("social") || lookup.includes("magnetic") || lookup.includes("talk")) {
      return "teal";
    }
    if (lookup.includes("playful") || lookup.includes("fun") || lookup.includes("lighthearted")) {
      return "orange";
    }
    if (lookup.includes("ambitious") || lookup.includes("driven") || lookup.includes("goal")) {
      return "sky";
    }
    return "blue";
  }
};

// src/app/shared/ui/converters/event-subevent-runtime-menu.converter.ts
var EventSubeventRuntimeMenuConverter = class {
  static convert(item, options = {}) {
    const mode = this.resolveMode(item, options);
    return mode === "Tournament" ? this.tournamentItems(item, options) : this.casualItems(item, options);
  }
  static runtimeBadgeCount(item, options = {}) {
    const mode = this.resolveMode(item, options);
    if (mode === "Tournament") {
      return this.groupPending(item);
    }
    return [
      item.optional === true ? item.membersPending : 0,
      item.carsPending,
      item.accommodationPending,
      item.suppliesPending
    ].reduce((sum, value) => sum + Math.max(0, this.toInteger(value)), 0);
  }
  static tournamentItems(item, options) {
    const items = [];
    const sourceId = `${options.sourceId ?? options.event?.id ?? ""}`.trim();
    const parentEventId = `${options.parentEventId ?? options.event?.id ?? sourceId}`.trim();
    const slotId = `${options.slotId ?? ""}`.trim() || null;
    const subEventId = `${item.id ?? ""}`.trim() || null;
    const subEventIndex = Math.max(0, this.toInteger(options.subEventIndex));
    const stageNumber = Math.max(1, this.toInteger(options.stageNumber) || subEventIndex + 1);
    if (options.canManageTournament && sourceId) {
      items.push(...this.stageStatusItems(item, {
        parentEventId,
        slotId,
        sourceId,
        subEventId,
        subEventIndex,
        stageNumber,
        siblings: options.siblingItems ?? [],
        nowMs: Number.isFinite(Number(options.nowMs)) ? Number(options.nowMs) : Date.now()
      }));
    }
    if (items.length > 0) {
      items.push({
        id: "runtime-divider",
        kind: "divider",
        disabled: true
      });
    }
    items.push({
      id: "groups",
      label: "Groups",
      icon: "groups",
      palette: "green",
      surface: "tinted",
      layout: "pill",
      counter: this.groupPending(item) > 0 ? { value: this.groupPending(item), max: 99 } : null,
      counterTone: "alert",
      context: {
        scope: "stage-dashboard",
        action: "groups",
        item,
        parentEventId,
        slotId,
        sourceId,
        subEventIndex
      }
    });
    return items;
  }
  static stageStatusItems(item, options) {
    const status = this.stageStatus(item);
    const isErrorStatus = this.rawStageStatus(item.stageStatus) === "E";
    const isStageStartPassed = this.hasDatePassed(item.startAt, options.nowMs);
    const isStageEnded = this.hasDatePassed(item.endAt, options.nowMs);
    const isStageWindowOpen = this.isStageInScheduleWindow(item, options.nowMs);
    const actions = [];
    const stageLabel = `${item.name ?? `Stage ${options.stageNumber}`}`.trim() || `Stage ${options.stageNumber}`;
    const base = {
      item,
      parentEventId: options.parentEventId,
      slotId: options.slotId,
      sourceId: options.sourceId,
      subEventId: options.subEventId,
      subEventIndex: options.subEventIndex
    };
    if (status === "RS" && !isErrorStatus && isStageStartPassed) {
      actions.push(this.stageActionItem(__spreadProps(__spreadValues({}, base), {
        action: "start-tournament",
        label: "Start Stage",
        icon: "play_circle",
        palette: "success",
        nextStatus: "A",
        reason: "tournament-started",
        title: "Start Stage",
        description: `Start ${stageLabel}? This locks admission and assigns first-stage rooms.`,
        confirmLabel: "Start",
        busyLabel: "Starting...",
        destructive: false
      })));
    }
    if ((status === "RS" && !isErrorStatus || status === "A") && isStageEnded) {
      actions.push(this.stageActionItem(__spreadProps(__spreadValues({}, base), {
        action: "close-stage",
        label: "Close Stage",
        icon: "rate_review",
        palette: "blue",
        nextStatus: "SR",
        reason: "stage-closed",
        title: "Close Stage",
        description: `Close ${stageLabel} and move it under score review?`,
        confirmLabel: "Close Stage",
        busyLabel: "Closing...",
        destructive: false
      })));
    }
    if (status === "SR") {
      actions.push(this.stageActionItem(__spreadProps(__spreadValues({}, base), {
        action: "finalize-stage",
        label: "Finalize Stage",
        icon: "verified",
        palette: "success",
        nextStatus: "F",
        reason: "stage-finalized",
        title: "Finalize Stage",
        description: `Finalize ${stageLabel}?`,
        confirmLabel: "Finalize",
        busyLabel: "Finalizing...",
        destructive: false
      })));
    }
    if (this.canReopenScores(item, options.siblings, options.subEventIndex)) {
      actions.push(this.stageActionItem(__spreadProps(__spreadValues({}, base), {
        action: "reopen-scores",
        label: "Reopen Scores",
        icon: "edit_note",
        palette: "amber",
        nextStatus: "SR",
        reason: "scores-reopened",
        title: "Reopen Scores",
        description: `Reopen scores for ${stageLabel}?`,
        confirmLabel: "Reopen",
        busyLabel: "Reopening...",
        destructive: false
      })));
    }
    if (status === "A" && isStageWindowOpen) {
      actions.push(this.stageActionItem(__spreadProps(__spreadValues({}, base), {
        action: "suspend-tournament",
        label: "Suspend Stage",
        icon: "pause_circle",
        palette: "warning",
        nextStatus: "S",
        reason: "manual-suspension",
        title: "Suspend Stage",
        description: `Suspend ${stageLabel}?`,
        confirmLabel: "Suspend",
        busyLabel: "Suspending...",
        destructive: true
      })));
    }
    if (status === "S") {
      const resumeNextStatus = this.hasDatePassed(item.endAt, options.nowMs) ? "SR" : "A";
      actions.push(this.stageActionItem(__spreadProps(__spreadValues({}, base), {
        action: "resume-tournament",
        label: "Resume Stage",
        icon: "play_circle",
        palette: "blue",
        nextStatus: resumeNextStatus,
        reason: "manual-resume",
        title: "Resume Stage",
        description: `Resume ${stageLabel}?`,
        confirmLabel: "Resume",
        busyLabel: "Resuming...",
        destructive: false
      })));
    }
    return actions;
  }
  static resolveMode(item, options) {
    const requestedMode = options.mode ?? options.event?.mode ?? null;
    if (requestedMode === "Casual" || requestedMode === "Tournament") {
      return requestedMode;
    }
    return this.isTournamentStage(item) ? "Tournament" : "Casual";
  }
  static isTournamentStage(item) {
    return item.tournamentLeaderboardType === "Score" || item.tournamentLeaderboardType === "Fifa" || Math.max(0, this.toInteger(item.tournamentGroupCapacityMin)) > 0 || Math.max(0, this.toInteger(item.tournamentGroupCapacityMax)) > 0 || this.hasStageStatus(item.stageStatus);
  }
  static hasStageStatus(status) {
    const normalized = `${status ?? ""}`.trim().toUpperCase();
    return normalized === "A" || normalized === "RS" || normalized === "SR" || normalized === "F" || normalized === "S";
  }
  static casualItems(item, options) {
    const items = [];
    const sourceId = `${options.sourceId ?? options.event?.id ?? ""}`.trim();
    const subEventIndex = Math.max(0, this.toInteger(options.subEventIndex));
    if (item.optional === true) {
      items.push(this.resourceItem("members", "Members", "Members", item, this.membersLabel(item), item.membersPending, sourceId, subEventIndex));
    }
    if (items.length > 0) {
      items.push({
        id: "runtime-divider",
        kind: "divider",
        disabled: true
      });
    }
    items.push({
      id: "runtime-section",
      kind: "section",
      label: "Tools",
      disabled: true
    }, this.resourceItem("transport", APP_STATIC_DATA.assetTypeLabels[ASSET_TYPE_TRANSPORT], ASSET_TYPE_TRANSPORT, item, this.assetLabel(item, ASSET_TYPE_TRANSPORT), item.carsPending, sourceId, subEventIndex), this.resourceItem("accommodation", APP_STATIC_DATA.assetTypeLabels[ASSET_TYPE_ACCOMMODATION], ASSET_TYPE_ACCOMMODATION, item, this.assetLabel(item, ASSET_TYPE_ACCOMMODATION), item.accommodationPending, sourceId, subEventIndex), this.resourceItem("supplies", APP_STATIC_DATA.assetTypeLabels[ASSET_TYPE_SUPPLIES], ASSET_TYPE_SUPPLIES, item, this.assetLabel(item, ASSET_TYPE_SUPPLIES), item.suppliesPending, sourceId, subEventIndex));
    return items;
  }
  static stageActionItem(options) {
    return {
      id: options.action,
      label: options.label,
      icon: options.icon,
      palette: options.palette,
      surface: "tinted",
      layout: "pill",
      context: {
        scope: "stage-status",
        action: options.action,
        item: options.item,
        parentEventId: options.parentEventId,
        slotId: options.slotId,
        sourceId: options.sourceId,
        subEventId: options.subEventId,
        subEventIndex: options.subEventIndex,
        nextStatus: options.nextStatus,
        reason: options.reason,
        title: options.title,
        description: options.description,
        confirmLabel: options.confirmLabel,
        busyLabel: options.busyLabel,
        destructive: options.destructive,
        confirmPalette: options.palette
      }
    };
  }
  static resourceItem(id, label, resourceType, item, description, pendingRaw, sourceId, subEventIndex) {
    const pending = Math.max(0, this.toInteger(pendingRaw));
    return {
      id,
      label,
      description,
      icon: this.resourceIcon(resourceType),
      palette: this.resourcePalette(resourceType),
      surface: "tinted",
      layout: "pill",
      counter: pending > 0 ? { value: pending, max: 99 } : null,
      counterTone: "alert",
      context: {
        scope: "resource",
        resourceType,
        item,
        sourceId,
        subEventIndex
      }
    };
  }
  static canReopenScores(item, siblings, subEventIndex) {
    if (this.stageStatus(item) !== "F") {
      return false;
    }
    return siblings.slice(Math.max(0, subEventIndex) + 1).filter((stage) => this.isTournamentStage(stage)).every((stage) => {
      const status = this.stageStatus(stage);
      const pristineActive = status === "A" && !`${stage.stageStatusUpdatedAt ?? ""}`.trim() && !`${stage.stageFinalizedAt ?? ""}`.trim();
      return status === "RS" || pristineActive;
    });
  }
  static isStageInScheduleWindow(item, nowMs) {
    const startMs = Date.parse(`${item.startAt ?? ""}`);
    const endMs = Date.parse(`${item.endAt ?? ""}`);
    return Number.isFinite(startMs) && Number.isFinite(endMs) && startMs <= nowMs && nowMs <= endMs;
  }
  static hasDatePassed(value, nowMs) {
    const parsed = Date.parse(`${value ?? ""}`);
    return Number.isFinite(parsed) && parsed <= nowMs;
  }
  static rawStageStatus(status) {
    return `${status ?? ""}`.trim().toUpperCase();
  }
  static stageStatus(item) {
    const raw = `${item.stageStatus ?? ""}`.trim();
    if (raw === "A" || raw === "RS" || raw === "SR" || raw === "F" || raw === "S") {
      return raw;
    }
    return "RS";
  }
  static groupPending(item) {
    return Math.max(0, this.toInteger(item.groupsPending));
  }
  static membersLabel(item) {
    const accepted = Math.max(0, this.toInteger(item.membersAccepted));
    return this.rangeLabel(accepted, item.capacityMin, item.capacityMax);
  }
  static assetLabel(item, type) {
    if (type === ASSET_TYPE_TRANSPORT) {
      return this.rangeLabel(item.carsAccepted, item.carsCapacityMin, item.carsCapacityMax);
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return this.rangeLabel(item.accommodationAccepted, item.accommodationCapacityMin, item.accommodationCapacityMax);
    }
    return this.rangeLabel(item.suppliesAccepted, item.suppliesCapacityMin, item.suppliesCapacityMax);
  }
  static rangeLabel(acceptedRaw, minRaw, maxRaw) {
    const accepted = Math.max(0, this.toInteger(acceptedRaw));
    const min = Math.max(0, this.toInteger(minRaw));
    const max = Math.max(min, this.toInteger(maxRaw));
    return `${accepted} / ${min} - ${max}`;
  }
  static resourceIcon(type) {
    switch (type) {
      case "Members":
        return "groups";
      case ASSET_TYPE_TRANSPORT:
        return "directions_car";
      case ASSET_TYPE_ACCOMMODATION:
        return "apartment";
      case ASSET_TYPE_SUPPLIES:
        return "inventory_2";
      default:
        return "category";
    }
  }
  static resourcePalette(type) {
    switch (type) {
      case "Members":
        return "blue";
      case ASSET_TYPE_TRANSPORT:
        return "sky";
      case ASSET_TYPE_ACCOMMODATION:
        return "green";
      case ASSET_TYPE_SUPPLIES:
        return "brown";
      default:
        return "default";
    }
  }
  static toInteger(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.trunc(parsed);
  }
};
var eventSubeventRuntimeMenuConverter = new EventSubeventRuntimeMenuConverter();

// src/app/shared/ui/converters/event-subevent-runtime-info-card.converter.ts
var EventSubeventRuntimeInfoCardConverter = class _EventSubeventRuntimeInfoCardConverter {
  static convert(item, options = {}) {
    const mode = this.resolveMode(item, options);
    const slotTimeframe = `${options.slotTimeframe ?? ""}`.trim();
    const dateLabel = AppUtils.dateTimeRangeLabel(item.startAt, item.endAt, slotTimeframe || "Date unavailable");
    const location = `${item.location ?? options.event?.location ?? ""}`.trim();
    const isTournament = mode === "Tournament";
    const sequenceNumber = Math.max(1, Math.trunc(Number(options.sequenceNumber) || 1));
    const sequenceTotal = Math.max(sequenceNumber, Math.trunc(Number(options.sequenceTotal) || sequenceNumber));
    const sequenceLabel = isTournament ? `Stage ${sequenceNumber}` : `Sub Event ${sequenceNumber}`;
    const status = this.definitionStatus(item);
    const nowMs = Number.isFinite(Number(options.nowMs)) ? Number(options.nowMs) : Date.now();
    const stageStatus = isTournament ? this.stageStatusBadge(item, nowMs) : null;
    const runtimeIcon = isTournament ? "emoji_events" : "inventory_2";
    const menuBadgeCount = options.menuBadgeCount == null ? EventSubeventRuntimeMenuConverter.runtimeBadgeCount(item, {
      event: options.event,
      mode
    }) : Math.max(0, Math.trunc(Number(options.menuBadgeCount) || 0));
    const capacityDetailRow = this.capacityDetailRow(item, mode, options);
    return {
      id: `${options.cardId ?? item.id ?? ""}`.trim(),
      dateIso: item.startAt,
      groupLabel: options.groupLabel ?? null,
      title: item.name,
      mediaMode: "title",
      mediaTone: "neutral",
      mediaIcon: runtimeIcon,
      mediaTitle: sequenceLabel,
      mediaSubtitle: mode,
      metaRows: [
        dateLabel,
        ...location ? [location] : [],
        ...capacityDetailRow ? [capacityDetailRow] : []
      ],
      descriptionLines: 2,
      description: item.description || "No description",
      detailRows: [],
      surfaceTone: isTournament ? "stage-runtime" : "draft",
      accentHue: isTournament ? AppUtils.tournamentStageAccentHue(sequenceNumber, sequenceTotal) : null,
      leadingIcon: {
        icon: isTournament ? "emoji_events" : status.icon,
        tone: isTournament ? "stage" : status.leadingTone
      },
      mediaStart: {
        variant: "avatar",
        tone: "default",
        icon: "location_on",
        interactive: false
      },
      mediaEnd: isTournament ? stageStatus : {
        variant: "badge",
        layout: "badge-with-leading-accessory",
        tone: status.overlayTone,
        label: status.label,
        interactive: false,
        leadingAccessory: {
          icon: status.icon,
          tone: status.accessoryTone
        }
      },
      hasMenuOptions: options.hasMenuOptions === true,
      menuTitle: options.menuTitle ?? item.name,
      menuBadgeCount: menuBadgeCount > 0 ? menuBadgeCount : null,
      clickable: false
    };
  }
  static convertList(items, options = {}) {
    return items.map((item) => this.convert(item, options));
  }
  convert(input, options) {
    return _EventSubeventRuntimeInfoCardConverter.convert(input, options);
  }
  convertList(input, options) {
    return _EventSubeventRuntimeInfoCardConverter.convertList(input, options);
  }
  static definitionStatus(item) {
    if (item.optional) {
      return {
        label: "Optional",
        icon: "toggle_on",
        overlayTone: "public",
        leadingTone: "public",
        accessoryTone: "positive"
      };
    }
    return {
      label: "Mandatory",
      icon: "block",
      overlayTone: "blocked",
      leadingTone: "invitation",
      accessoryTone: "negative"
    };
  }
  static resolveMode(item, options) {
    const requestedMode = options.mode ?? options.event?.mode ?? null;
    if (requestedMode === "Casual" || requestedMode === "Tournament") {
      return requestedMode;
    }
    return this.isTournamentStage(item) ? "Tournament" : "Casual";
  }
  static isTournamentStage(item) {
    return item.tournamentLeaderboardType === "Score" || item.tournamentLeaderboardType === "Fifa" || this.nonNegativeInteger(item.tournamentGroupCapacityMin) > 0 || this.nonNegativeInteger(item.tournamentGroupCapacityMax) > 0 || this.hasStageStatus(item.stageStatus);
  }
  static hasStageStatus(status) {
    const normalized = `${status ?? ""}`.trim().toUpperCase();
    return normalized === "A" || normalized === "RS" || normalized === "SR" || normalized === "F" || normalized === "S";
  }
  static capacityDetailRow(item, mode, options) {
    if (mode === "Tournament") {
      return this.tournamentGroupCapacitySummary(item, options);
    }
    if (!item.optional) {
      return null;
    }
    const accepted = Math.max(0, this.nonNegativeInteger(item.membersAccepted));
    const max = Math.max(accepted, this.nonNegativeInteger(item.capacityMax));
    return max > 0 || accepted > 0 ? `Capacity ${max > 0 ? `${accepted} / ${max}` : `${accepted}`}` : null;
  }
  static tournamentGroupCapacitySummary(item, options) {
    const groups = this.nonNegativeInteger(item.groupsCount);
    const configuredMin = this.nonNegativeInteger(item.tournamentGroupCapacityMin);
    const configuredMax = Math.max(configuredMin, this.nonNegativeInteger(item.tournamentGroupCapacityMax));
    if (groups <= 0 || configuredMin <= 0 && configuredMax <= 0) {
      return null;
    }
    const fallback = `Groups: ${groups} \xD7 ${configuredMin}\u2013${configuredMax} members`;
    return options.translateParams?.("event.subevents.stage.groups.capacity.summary", { groups, min: configuredMin, max: configuredMax }, fallback) ?? fallback;
  }
  static nonNegativeInteger(value) {
    const parsed = Math.trunc(Number(value));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }
  static stageStatusBadge(item, nowMs) {
    const rawStatus = this.rawStageStatus(item.stageStatus);
    const status = this.resolveStageStatus(item.stageStatus);
    if (this.isStageBlockedBySchedule(item, rawStatus, nowMs)) {
      return {
        variant: "badge",
        tone: "stage-blocked",
        label: "stage.status.blocked",
        icon: "lock",
        interactive: false
      };
    }
    if (this.isStageScheduledBySchedule(item, rawStatus, nowMs)) {
      return {
        variant: "badge",
        tone: "stage-scheduled",
        label: "stage.status.scheduled",
        icon: "schedule",
        interactive: false
      };
    }
    if (status === "A" && !this.isStageActiveBySchedule(item, rawStatus, nowMs)) {
      return null;
    }
    const scoreReviewStatus = this.scoreReviewStatusBadge(item);
    const map = {
      A: {
        label: "stage.status.started",
        icon: "play_circle",
        tone: "stage-active"
      },
      RS: {
        label: "stage.status.scheduled",
        icon: "schedule",
        tone: "stage-scheduled"
      },
      SR: {
        label: scoreReviewStatus.label,
        icon: scoreReviewStatus.icon,
        tone: scoreReviewStatus.tone
      },
      F: {
        label: "stage.status.finalized",
        icon: "verified",
        tone: "stage-finalized"
      },
      S: {
        label: "stage.status.suspended",
        icon: "pause_circle",
        tone: "stage-suspended"
      }
    };
    const config = map[status];
    return {
      variant: "badge",
      tone: config.tone,
      label: config.label,
      icon: config.icon,
      interactive: false
    };
  }
  static scoreReviewStatusBadge(item) {
    const reason = `${item.stageStatusReason ?? ""}`.trim();
    if (reason === "scores-reopened") {
      return {
        label: "stage.status.scores.review",
        icon: "edit_note",
        tone: "stage-start"
      };
    }
    return {
      label: "stage.status.closed",
      icon: "rate_review",
      tone: "stage-review"
    };
  }
  static isStageActiveBySchedule(item, rawStatus, nowMs) {
    if (rawStatus !== "A") {
      return false;
    }
    const startMs = this.dateMs(item.startAt);
    return !Number.isFinite(startMs) || startMs <= nowMs;
  }
  static isStageScheduledBySchedule(item, rawStatus, nowMs) {
    if (rawStatus !== "A" && rawStatus !== "RS") {
      return false;
    }
    const startMs = this.dateMs(item.startAt);
    return Number.isFinite(startMs) && startMs > nowMs;
  }
  static isStageBlockedBySchedule(item, rawStatus, nowMs) {
    if (rawStatus === "RS") {
      return this.hasDatePassed(item.startAt, nowMs) || this.hasDatePassed(item.endAt, nowMs);
    }
    return rawStatus === "A" && this.hasDatePassed(item.endAt, nowMs);
  }
  static hasDatePassed(value, nowMs) {
    const parsed = this.dateMs(value);
    return Number.isFinite(parsed) && parsed <= nowMs;
  }
  static dateMs(value) {
    return Date.parse(`${value ?? ""}`);
  }
  static rawStageStatus(status) {
    return `${status ?? ""}`.trim().toUpperCase();
  }
  static resolveStageStatus(status) {
    const normalized = `${status ?? ""}`.trim().toUpperCase();
    if (normalized === "RS" || normalized === "SR" || normalized === "F" || normalized === "S") {
      return normalized;
    }
    return "A";
  }
};
var eventSubeventRuntimeInfoCardConverter = new EventSubeventRuntimeInfoCardConverter();

// src/app/shared/ui/converters/event-subevents-slot.converter.ts
var EventSubeventsSlotConverter = class {
  static convertList(slots, options = {}) {
    return slots.map((slot, index) => this.convert(slot, index, options)).sort((left, right) => this.compareSlots(left, right, options.order));
  }
  static convert(slot, index, options = {}) {
    const id = `${slot.id ?? ""}`.trim() || `${slot.parentEventId ?? "event"}:${index}`;
    const items = Array.isArray(slot.subEventItems) ? slot.subEventItems : [];
    const firstItem = items[0] ?? null;
    const isSlot = this.isGeneratedSlot(slot);
    const title = isSlot ? this.slotTitle(slot, index + 1, options.event) : "Sub events";
    const subtitle = this.slotSubtitle(slot, firstItem, options.event);
    return {
      id,
      title,
      subtitle,
      startAt: `${slot.startAt ?? ""}`.trim() || firstItem?.startAt || null,
      endAt: `${slot.endAt ?? ""}`.trim() || firstItem?.endAt || slot.startAt || null,
      tone: this.slotTone(options.event),
      isSlot,
      slot,
      items
    };
  }
  static slotOwnerId(model) {
    return `${model.slot.slotSourceId ?? model.slot.parentEventId ?? ""}`.trim();
  }
  static itemKey(model, item, index = 0) {
    const itemId = `${item.id ?? ""}`.trim() || `subevent-${index + 1}`;
    return `${model.id}:${itemId}`;
  }
  static headerLabel(model) {
    const title = `${model.title ?? ""}`.trim();
    const subtitle = `${model.subtitle ?? ""}`.trim();
    return subtitle ? `${title} - ${subtitle}` : title;
  }
  static compareSlots(left, right, order) {
    const direction = `${order ?? ""}`.trim().toLowerCase() === "past" ? -1 : 1;
    const dateCompare = direction * (this.dateMs(left.startAt) - this.dateMs(right.startAt));
    return dateCompare !== 0 ? dateCompare : left.id.localeCompare(right.id);
  }
  static isGeneratedSlot(slot) {
    return Boolean(`${slot.slotSourceId ?? ""}`.trim() || `${slot.slotTemplateId ?? ""}`.trim());
  }
  static slotTitle(slot, fallbackIndex, event) {
    const templateId = `${slot.slotTemplateId ?? ""}`.trim();
    const templateIndex = templateId ? (event?.slotTemplates ?? []).findIndex((template) => `${template.id ?? ""}`.trim() === templateId) : -1;
    return `Slot ${templateIndex >= 0 ? templateIndex + 1 : fallbackIndex}`;
  }
  static slotSubtitle(slot, firstItem, event) {
    const template = this.slotTemplate(slot, event);
    const templateStart = AppUtils.parseDate(template?.startAt) ?? AppUtils.parseDate(slot.startAt ?? firstItem?.startAt);
    const frequency = ActivityEventDetailDTO.normalizeFrequency(event?.frequency ?? "");
    if (templateStart && frequency !== "One-time" && frequency !== "Custom") {
      return this.formatRecurringSlotLabel(frequency, templateStart);
    }
    return `${slot.timeframe ?? ""}`.trim() || AppUtils.dateTimeRangeLabel(slot.startAt ?? firstItem?.startAt, slot.endAt ?? firstItem?.endAt, "");
  }
  static slotTemplate(slot, event) {
    const templateId = `${slot.slotTemplateId ?? ""}`.trim();
    if (!templateId) {
      return null;
    }
    return (event?.slotTemplates ?? []).find((template) => `${template.id ?? ""}`.trim() === templateId) ?? null;
  }
  static slotTone(event) {
    switch (ActivityEventDetailDTO.normalizeFrequency(event?.frequency ?? "")) {
      case "Daily":
        return "green";
      case "Weekly":
        return "cyan";
      case "Bi-weekly":
        return "violet";
      case "Monthly":
        return "amber";
      case "Yearly":
        return "gold";
      default:
        return "blue";
    }
  }
  static formatRecurringSlotLabel(frequency, start) {
    const time = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
    switch (ActivityEventDetailDTO.normalizeFrequency(frequency)) {
      case "Daily":
        return `Every day at ${time}`;
      case "Weekly":
        return `Every ${start.toLocaleDateString("en-US", { weekday: "long" })} at ${time}`;
      case "Bi-weekly":
        return `Every second ${start.toLocaleDateString("en-US", { weekday: "long" })} at ${time}`;
      case "Monthly":
        return `Every month on day ${start.getDate()} at ${time}`;
      case "Yearly":
        return `Every year on ${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      default:
        return AppUtils.dateTimeRangeLabel(start.toISOString(), "", "");
    }
  }
  static dateMs(value) {
    return AppUtils.parseDate(value)?.getTime() ?? Number.POSITIVE_INFINITY;
  }
};
var eventSubeventsSlotConverter = new EventSubeventsSlotConverter();

// src/app/shared/ui/converters/event-subevents-list-context-menu.converter.ts
var EventSubeventsListContextMenuConverter = class _EventSubeventsListContextMenuConverter {
  static convert(input) {
    const pendingMembers = this.nonNegativeInteger(input.pendingMembers);
    const canEditStructure = input.editorAction === "edit";
    return [
      {
        id: "participant-filter",
        label: "event.subevents.my.participation",
        icon: input.participantOnly ? "person_pin_circle" : "person_pin",
        kind: "toggle",
        layout: "pill",
        active: input.participantOnly,
        checked: input.participantOnly,
        closeOnSelect: false,
        palette: "green",
        context: { menu: "context", action: "participantFilter" }
      },
      {
        id: input.editorAction,
        label: canEditStructure ? "edit" : "view",
        icon: canEditStructure ? "edit" : "visibility",
        palette: canEditStructure ? "amber" : "teal",
        surface: "tinted",
        layout: "action",
        context: { menu: "context", action: input.editorAction }
      },
      {
        id: "members",
        label: "members",
        icon: "groups",
        palette: "violet",
        surface: "tinted",
        layout: "action",
        disabled: input.membersDisabled,
        counter: pendingMembers > 0 ? { value: pendingMembers, max: 99 } : null,
        counterTone: "alert",
        context: { menu: "context", action: "members" }
      }
    ];
  }
  convert(input) {
    return _EventSubeventsListContextMenuConverter.convert(input);
  }
  static nonNegativeInteger(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
};

// src/app/shared/ui/converters/event-tournament-groups-popup.converter.ts
var EventTournamentGroupsPopupConverter = class _EventTournamentGroupsPopupConverter {
  static convert(input) {
    const state = input.state;
    const stages = state?.stages ?? [];
    const selectedStage = this.selectedStage(stages, input.selectedStageId);
    const openIds = new Set(input.openGroupIds.map((id) => id.trim()).filter(Boolean));
    return {
      title: state?.title?.trim() || "Groups",
      subtitle: selectedStage ? this.stageSubtitle(selectedStage) : state?.subtitle?.trim() || "Tournament groups",
      selectedStage,
      canManage: state?.canManage === true,
      stageTrigger: this.stageTrigger(selectedStage),
      stageItems: stages.map((stage) => this.stageItem(stage, selectedStage?.subEventId ?? null)),
      accordion: {
        items: selectedStage ? selectedStage.groups.map((group, index) => this.groupAccordionItem(selectedStage, group, index, openIds, state?.canManage === true)) : [],
        multi: false,
        emptyTitle: selectedStage ? "No groups yet" : "No tournament stage",
        emptyDescription: selectedStage ? "Add a group from the header action." : "Select a tournament stage to manage groups."
      }
    };
  }
  convert(input) {
    return _EventTournamentGroupsPopupConverter.convert(input);
  }
  static stagePalette(stageNumber) {
    const palettes = ["blue", "green", "amber", "violet", "teal", "gold"];
    const index = Math.max(0, Math.trunc(Number(stageNumber) || 1) - 1);
    return palettes[index % palettes.length] ?? "blue";
  }
  static groupPalette(groupIndex) {
    const palettes = ["amber", "green", "mint", "teal"];
    const index = Math.max(0, Math.trunc(Number(groupIndex) || 0));
    return palettes[index % palettes.length] ?? "amber";
  }
  static selectedStage(stages, selectedStageId) {
    const id = `${selectedStageId ?? ""}`.trim();
    if (id) {
      const selected = stages.find((stage) => stage.subEventId === id);
      if (selected) {
        return selected;
      }
    }
    return stages[0] ?? null;
  }
  static stageTrigger(stage) {
    const pending = this.stagePendingTotal(stage);
    return {
      label: stage?.title ?? "Stage",
      icon: "emoji_events",
      palette: stage ? this.stagePalette(stage.stageNumber) : "blue",
      layout: "pill",
      counter: pending > 0 ? { value: pending, max: 99, ariaLabel: `${pending} pending changes` } : null,
      ariaLabel: "Select stage"
    };
  }
  static stageItem(stage, selectedStageId) {
    const pending = this.stagePendingTotal(stage);
    return {
      id: stage.subEventId,
      label: stage.title,
      description: this.stageSubtitle(stage),
      icon: "emoji_events",
      palette: this.stagePalette(stage.stageNumber),
      surface: "tinted",
      kind: "radio",
      active: stage.subEventId === selectedStageId,
      counter: pending > 0 ? { value: pending, max: 99, ariaLabel: `${pending} pending changes` } : null,
      counterTone: "alert",
      context: { stageId: stage.subEventId }
    };
  }
  static groupAccordionItem(stage, group, index, openIds, canManage) {
    const capacity = this.groupCapacityLabel(group);
    const accepted = Math.max(0, Math.trunc(Number(group.membersAccepted) || 0));
    const pendingTotal = this.groupPendingTotal(group);
    const memberLabel = accepted === 1 ? "1 member" : `${accepted} members`;
    const pendingLabel = pendingTotal === 1 ? "1 pending" : `${pendingTotal} pending`;
    return {
      id: group.id,
      title: group.name || `Group ${String.fromCharCode(65 + index % 26)}`,
      subtitle: [
        group.source === "manual" ? "Manual" : "",
        memberLabel,
        pendingTotal > 0 ? pendingLabel : ""
      ].filter(Boolean).join(" \xB7 "),
      icon: "groups",
      badges: [
        {
          id: "members-capacity",
          label: `${accepted} / ${group.capacityMin} - ${group.capacityMax}`,
          palette: this.groupPalette(index),
          ariaLabel: `Members ${accepted} of ${group.capacityMin} to ${group.capacityMax}`,
          title: capacity
        }
      ],
      palette: this.groupPalette(index),
      open: openIds.has(group.id),
      actionMenu: this.groupActionMenu(stage, group, canManage, pendingTotal),
      context: {
        groupId: group.id,
        stageId: stage.subEventId
      }
    };
  }
  static groupActionMenu(stage, group, canManage, pendingTotal) {
    const contextBase = { stageId: stage.subEventId, groupId: group.id };
    const actions = [];
    if (canManage) {
      if (`${stage.stageStatus ?? ""}`.trim().toUpperCase() === "SR") {
        actions.push({
          id: "add-entry",
          label: stage.leaderboardType === "Fifa" ? "Add Match" : "Add Score",
          icon: stage.leaderboardType === "Fifa" ? "add_circle" : "add",
          palette: "blue",
          context: __spreadProps(__spreadValues({}, contextBase), { action: "add-entry" })
        });
      }
      actions.push({
        id: "edit-group",
        label: "edit",
        icon: "edit",
        context: __spreadProps(__spreadValues({}, contextBase), { action: "edit-group" })
      }, {
        id: "delete-group",
        label: "delete",
        icon: "delete",
        palette: "danger",
        context: __spreadProps(__spreadValues({}, contextBase), { action: "delete-group" })
      });
    }
    return {
      kind: "select",
      trigger: {
        icon: "more_vert",
        closeIcon: "close",
        hideLabel: true,
        layout: "icon",
        counter: pendingTotal > 0 ? { value: pendingTotal, max: 99, ariaLabel: `${pendingTotal} pending changes` } : null,
        ariaLabel: `Open actions for ${group.name}`
      },
      model: {
        nodes: [
          ...actions.length > 0 ? [{ id: "actions", items: actions }] : [],
          {
            id: "members",
            items: [
              this.pendingMenuItem("members", "Tagok", canManage ? "group_add" : "groups", "blue", contextBase, `${group.membersAccepted} / ${group.capacityMin} - ${group.capacityMax}`, group.membersPending)
            ]
          },
          {
            id: "assets",
            label: "Assets",
            items: ASSET_TYPES.map((type) => this.resourceMenuItem(type, group, contextBase))
          }
        ]
      },
      panelAlign: "auto",
      mobileBreakpointPx: 900
    };
  }
  static resourceMenuItem(type, group, contextBase) {
    const action = type === ASSET_TYPE_TRANSPORT ? "transport" : type === ASSET_TYPE_ACCOMMODATION ? "accommodation" : "supplies";
    const palette = type === ASSET_TYPE_TRANSPORT ? "sky" : type === ASSET_TYPE_ACCOMMODATION ? "green" : "brown";
    const metric = group.resourceMetricsByType?.[type];
    const accepted = this.count(metric?.accepted);
    const capacityMin = this.count(metric?.capacityMin);
    const capacityMax = Math.max(capacityMin, this.count(metric?.capacityMax));
    return this.pendingMenuItem(action, AssetDefaultsBuilder.assetTypeLabel(type), AssetDefaultsBuilder.assetTypeIcon(type), palette, contextBase, `${accepted} / ${capacityMin} - ${capacityMax}`, metric?.pending);
  }
  static pendingMenuItem(id, label, icon, palette, contextBase, description, pendingValue) {
    const pending = this.count(pendingValue);
    return {
      id,
      label,
      description,
      icon,
      palette,
      surface: "tinted",
      layout: "pill",
      counter: pending > 0 ? { value: pending, max: 99, ariaLabel: `${pending} pending` } : null,
      counterTone: "alert",
      context: __spreadProps(__spreadValues({}, contextBase), {
        action: id
      })
    };
  }
  static groupPendingTotal(group) {
    if (!group) {
      return 0;
    }
    const resourcePending = ASSET_TYPES.reduce((total, type) => total + this.count(group.resourceMetricsByType?.[type]?.pending), 0);
    return this.count(group.membersPending) + resourcePending;
  }
  static stagePendingTotal(stage) {
    return (stage?.groups ?? []).reduce((total, group) => total + this.groupPendingTotal(group), 0);
  }
  static stageSubtitle(stage) {
    const range = AppUtils.dateTimeRangeLabel(stage.startAt, stage.endAt, "");
    const groupLabel = stage.groups.length === 1 ? "1 group" : `${stage.groups.length} groups`;
    return [range, groupLabel].filter(Boolean).join(" \xB7 ");
  }
  static groupCapacityLabel(group) {
    const min = Math.max(0, Math.trunc(Number(group.capacityMin) || 0));
    const max = Math.max(min, Math.trunc(Number(group.capacityMax) || min));
    return `Capacity ${min} - ${max}`;
  }
  static count(value) {
    const parsed = Math.trunc(Number(value));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }
};

// src/app/shared/ui/components/core/form/flow/form-flow.utils.ts
function formFlowCompletionPercent(model, value) {
  return formFlowCompletionStats(model, value).percent;
}
function formFlowCompletionStats(model, value) {
  const items = formFlowCompletionItems(model);
  const stats = items.reduce((total, item) => {
    const itemStats = formFlowCompletionItemStats(item, value);
    return {
      completed: total.completed + itemStats.completed,
      total: total.total + itemStats.total
    };
  }, { completed: 0, total: 0 });
  return __spreadProps(__spreadValues({}, stats), {
    percent: stats.total === 0 ? 0 : Math.round(stats.completed / stats.total * 100)
  });
}
function formFlowMissingRequiredControls(model, value) {
  return (model?.steps ?? []).flatMap((step) => step.controls).filter((control) => formFlowIsControlMissingRequired(control, value));
}
function formFlowIsControlMissingRequired(control, value) {
  const path = formFlowNormalizePath(control.bind);
  return control.required === true && path.length > 0 && !formFlowHasRequiredValue(formFlowControlValue(value, control), control);
}
function formFlowControlValue(value, control) {
  const rawValue = formFlowReadPath(value, control.bind);
  return control.valueFormat === "csv" ? formFlowCsvStringArrayValue(rawValue) : rawValue;
}
function formFlowCompletionItems(model) {
  const configuredItems = [...model?.completion?.items ?? []];
  const controlsMode = model?.completion?.controls ?? (configuredItems.length > 0 ? "none" : "all");
  if (controlsMode === "none") {
    return configuredItems;
  }
  const controlItems = (model?.steps ?? []).flatMap((step) => step.controls).filter((control) => {
    if (control.kind === "section" || control.kind === "static" || control.kind === "review") {
      return false;
    }
    if (formFlowNormalizePath(control.bind).length === 0) {
      return false;
    }
    return controlsMode === "all" || control.required === true;
  }).map((control) => formFlowCompletionItemFromControl(control));
  return [...configuredItems, ...controlItems];
}
function formFlowCompletionItemFromControl(control) {
  if (control.kind === "image-carousel") {
    const slotCount = formFlowImageSlotCount(control);
    return {
      id: control.id,
      bind: control.bind,
      metric: "count",
      thresholds: Array.from({ length: slotCount }, (_value, index) => index + 1)
    };
  }
  return {
    id: control.id,
    bind: control.bind,
    valueFormat: control.valueFormat,
    metric: "filled"
  };
}
function formFlowCompletionItemStats(item, value) {
  const itemValue = item.valueFormat === "csv" ? formFlowCsvStringArrayValue(formFlowReadPath(value, item.bind)) : formFlowReadPath(value, item.bind);
  const metricValue = formFlowCompletionMetricValue(item, itemValue);
  const thresholds = (item.thresholds ?? []).map((threshold) => Number(threshold)).filter((threshold) => Number.isFinite(threshold) && threshold > 0).sort((left, right) => left - right);
  if (thresholds.length > 0) {
    return {
      completed: thresholds.filter((threshold) => metricValue >= threshold).length,
      total: thresholds.length
    };
  }
  const weight = Math.max(1, Math.trunc(Number(item.weight) || 1));
  return {
    completed: metricValue > 0 ? weight : 0,
    total: weight
  };
}
function formFlowCompletionMetricValue(item, value) {
  switch (item.metric ?? "filled") {
    case "count":
      return formFlowCountValue(value);
    case "length":
      return `${value ?? ""}`.trim().length;
    case "positiveNumber":
      return formFlowPositiveNumber(value) > 0 ? 1 : 0;
    case "isoDate":
      return formFlowIsIsoDate(value) ? 1 : 0;
    default:
      return formFlowHasRequiredValue(value) ? 1 : 0;
  }
}
function formFlowHasRequiredValue(value, control) {
  if (value === null || value === void 0) {
    return false;
  }
  if (typeof value === "string") {
    if (control?.kind === "number") {
      const parsed = Number(value.trim());
      if (!Number.isFinite(parsed)) {
        return false;
      }
      return formFlowNumberInRange(parsed, control);
    }
    const textLength = value.trim().length;
    const minLength = Math.max(0, Math.trunc(Number(control?.minLength) || 0));
    return textLength > 0 && textLength >= minLength;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return false;
    }
    return formFlowNumberInRange(value, control);
  }
  if (typeof value === "boolean") {
    return control?.kind === "checkbox" ? value : true;
  }
  if (Array.isArray(value)) {
    const requiredCount = Math.max(1, Math.trunc(Number(control?.min) || 1));
    return value.filter((item) => formFlowHasRequiredValue(item)).length >= requiredCount;
  }
  if (isRecord(value)) {
    if ("startAt" in value || "endAt" in value) {
      return `${value["startAt"] ?? ""}`.trim().length > 0 && `${value["endAt"] ?? ""}`.trim().length > 0;
    }
    return Object.keys(value).length > 0;
  }
  return true;
}
function formFlowNumberInRange(value, control) {
  const min = typeof control?.min === "number" ? control.min : null;
  const max = typeof control?.max === "number" ? control.max : null;
  return (min === null || value >= min) && (max === null || value <= max);
}
function formFlowReadPath(source, path) {
  const segments = formFlowNormalizePath(path);
  if (segments.length === 0) {
    return source;
  }
  let current = source;
  for (const segment of segments) {
    if (current === null || current === void 0) {
      return void 0;
    }
    if (Array.isArray(current) && typeof segment === "number") {
      current = current[segment];
      continue;
    }
    if (isRecord(current)) {
      current = current[String(segment)];
      continue;
    }
    return void 0;
  }
  return current;
}
function formFlowNormalizePath(path) {
  if (!path) {
    return [];
  }
  if (typeof path !== "string") {
    return path.map((segment) => typeof segment === "number" ? segment : `${segment}`.trim()).filter((segment) => segment !== "");
  }
  return path.replace(/\[(\d+)]/g, ".$1").split(".").map((segment) => segment.trim()).filter(Boolean).map((segment) => /^\d+$/.test(segment) ? Number(segment) : segment);
}
function formFlowCsvStringArrayValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => `${item ?? ""}`.trim()).filter(Boolean);
  }
  return `${value ?? ""}`.split(",").map((item) => item.trim()).filter(Boolean);
}
function formFlowCountValue(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => formFlowHasRequiredValue(item)).length;
  }
  if (typeof value === "string") {
    return value.trim().length > 0 ? 1 : 0;
  }
  if (isRecord(value)) {
    return Object.keys(value).length;
  }
  return formFlowHasRequiredValue(value) ? 1 : 0;
}
function formFlowPositiveNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number.parseFloat(`${value ?? ""}`.trim());
  return Number.isFinite(parsed) ? parsed : 0;
}
function formFlowIsIsoDate(value) {
  const normalized = `${value ?? ""}`.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) && Number.isFinite(Date.parse(`${normalized}T00:00:00Z`));
}
function formFlowImageSlotCount(control) {
  const config = control.config;
  if (isRecord(config)) {
    const slotCount = Math.trunc(Number(config["slotCount"]));
    if (Number.isFinite(slotCount) && slotCount > 0) {
      return slotCount;
    }
  }
  return Math.max(1, Math.trunc(Number(control.max) || Number(control.min) || 1));
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}

// src/app/shared/ui/converters/profile-form-flow.converter.ts
var ProfileFormFlowDataConverter = class {
  static convert(value) {
    return this.isDraft(value) ? this.normalizeDraft(value) : this.createDraft(value);
  }
  static isDraft(value) {
    return "data" in value && "currentStepId" in value;
  }
  static createDraft(user) {
    return this.normalizeDraft({
      version: 1,
      userId: user.id.trim(),
      currentStepId: "basics",
      updatedAtIso: (/* @__PURE__ */ new Date()).toISOString(),
      completedStepIds: [],
      skippedStepIds: [],
      data: this.initialData(user)
    });
  }
  static initialData(user) {
    const profile = this.normalizeProfile(user);
    profile.profileDetails = this.normalizeProfileDetails(profile);
    return {
      profile,
      experienceEntries: []
    };
  }
  static normalizeDraft(draft) {
    const data = this.normalizeData(draft.data);
    return {
      version: 1,
      userId: `${draft.userId ?? data.profile.id ?? ""}`.trim(),
      currentStepId: this.normalizeStepId(draft.currentStepId),
      updatedAtIso: (/* @__PURE__ */ new Date()).toISOString(),
      completedStepIds: this.normalizeStepIds(draft.completedStepIds),
      skippedStepIds: this.normalizeStepIds(draft.skippedStepIds),
      data
    };
  }
  static normalizeData(data) {
    const profile = this.normalizeProfile(data.profile);
    const experienceEntries = this.normalizeExperienceEntries(data.experienceEntries ?? []);
    const normalizedProfile = __spreadProps(__spreadValues({}, profile), {
      profileDetails: this.normalizeProfileDetails(profile),
      profileFormVersion: CURRENT_PROFILE_FORM_VERSION
    });
    normalizedProfile.completion = ProfileFormFlowConverter.completionPercent({
      profile: normalizedProfile,
      experienceEntries
    });
    return {
      profile: normalizedProfile,
      experienceEntries
    };
  }
  static normalizeProfile(user) {
    const birthday = AppUtils.isIsoDate(user.birthday) ? user.birthday.trim() : "";
    const name = `${user.name ?? ""}`.trim();
    return __spreadProps(__spreadValues({}, user), {
      name,
      initials: AppUtils.initialsFromText(name),
      birthday,
      age: AppUtils.ageFromIsoDate(birthday, user.age),
      city: `${user.city ?? ""}`.trim(),
      height: this.normalizeHeightValue(user.height),
      physique: `${user.physique ?? ""}`.trim(),
      languages: this.normalizeStringList(user.languages),
      horoscope: birthday ? AppUtils.horoscopeByDate(AppUtils.fromIsoDate(birthday)) : `${user.horoscope ?? ""}`.trim(),
      headline: `${user.headline ?? ""}`.trim(),
      about: `${user.about ?? ""}`.trim().slice(0, 160),
      images: this.normalizeStringList(user.images).slice(0, 8),
      profileStatus: this.normalizeProfileStatus(user.profileStatus),
      profileDetails: this.normalizeProfileDetails(user),
      activities: {
        game: user.activities?.game ?? 0,
        chats: user.activities?.chats ?? 0,
        invitations: user.activities?.invitations ?? 0,
        events: user.activities?.events ?? 0,
        hosting: user.activities?.hosting ?? 0,
        cars: user.activities?.cars ?? 0,
        accommodation: user.activities?.accommodation ?? 0,
        supplies: user.activities?.supplies ?? 0,
        tickets: user.activities?.tickets ?? 0,
        contacts: user.activities?.contacts ?? 0,
        feedback: user.activities?.feedback ?? 0,
        event: user.activities?.event ? __spreadValues({}, user.activities.event) : void 0,
        asset: user.activities?.asset ? __spreadValues({}, user.activities.asset) : void 0,
        eventFeedback: user.activities?.eventFeedback ? __spreadValues({}, user.activities.eventFeedback) : void 0,
        adminJobs: user.activities?.adminJobs,
        adminMetrics: user.activities?.adminMetrics
      },
      impressions: user.impressions ? {
        host: user.impressions.host ? __spreadValues({}, user.impressions.host) : void 0,
        member: user.impressions.member ? __spreadValues({}, user.impressions.member) : void 0
      } : void 0
    });
  }
  static normalizeProfileDetails(user) {
    return APP_STATIC_DATA.profileDetailGroupTemplates.map((group) => ({
      title: group.title,
      rows: group.rows.map((row) => ({
        labelKey: row.labelKey,
        value: this.profileDetailValue(user, row.labelKey) || this.profileDetailSeedValue(user, row.labelKey),
        privacy: this.profileDetailPrivacy(user, row.labelKey, row.privacy),
        options: this.profileDetailOptions(row.labelKey)
      }))
    }));
  }
  static profileDetailValue(user, labelKey) {
    const normalizedLabel = this.normalizeToken(labelKey);
    for (const group of user?.profileDetails ?? []) {
      for (const row of group.rows ?? []) {
        if (this.normalizeToken(row.labelKey) === normalizedLabel) {
          return `${row.value ?? ""}`.trim();
        }
      }
    }
    return "";
  }
  static profileDetailPrivacy(user, labelKey, fallback) {
    const normalizedLabel = this.normalizeToken(labelKey);
    for (const group of user.profileDetails ?? []) {
      for (const row of group.rows ?? []) {
        if (this.normalizeToken(row.labelKey) === normalizedLabel && this.isDetailPrivacy(row.privacy)) {
          return row.privacy;
        }
      }
    }
    return fallback;
  }
  static profileDetailSeedValue(user, labelKey) {
    switch (labelKey) {
      case "profile.name":
        return `${user.name ?? ""}`.trim();
      case "profile.city":
        return `${user.city ?? ""}`.trim();
      case "profile.birthday":
        return this.formatDateForDetail(user.birthday);
      case "profile.height":
        return this.normalizeHeightValue(user.height);
      case "profile.physique":
        return `${user.physique ?? ""}`.trim();
      case "profile.languages":
        return this.normalizeStringList(user.languages).join(", ");
      case "profile.horoscope":
        return `${user.horoscope ?? ""}`.trim();
      case "profile.gender":
        return user.gender === "woman" ? "Woman" : "Man";
      default:
        return "";
    }
  }
  static profileDetailOptions(labelKey) {
    if (labelKey === "profile.details.values") {
      return APP_STATIC_DATA.beliefsValuesOptionGroups.flatMap((group) => group.options);
    }
    if (labelKey === "profile.details.interest") {
      return APP_STATIC_DATA.interestOptionGroups.flatMap((group) => group.options);
    }
    return APP_STATIC_DATA.profileDetailValueOptions[labelKey] ?? [];
  }
  static isDetailPrivacy(value) {
    return value === "Public" || value === "Friends" || value === "Hosts" || value === "Private";
  }
  static normalizeHeightValue(value) {
    const heightCm = this.parseHeightCm(`${value ?? ""}`);
    return heightCm ? `${heightCm}` : `${value ?? ""}`.trim();
  }
  static formatDateForDetail(value) {
    const parsed = AppUtils.fromIsoDate(value);
    return parsed ? parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  }
  static normalizeExperienceEntries(entries) {
    return (entries ?? []).map((entry) => ({
      id: `${entry?.id ?? ""}`.trim(),
      type: this.normalizeExperienceType(entry?.type),
      title: `${entry?.title ?? ""}`.trim(),
      org: `${entry?.org ?? ""}`.trim(),
      city: `${entry?.city ?? ""}`.trim(),
      dateFrom: `${entry?.dateFrom ?? ""}`.trim(),
      dateTo: `${entry?.dateTo ?? ""}`.trim() || "Present",
      description: `${entry?.description ?? ""}`.trim()
    })).filter((entry) => entry.id && entry.title && entry.org);
  }
  static normalizeExperienceType(value) {
    return value === "School" || value === "Online Session" || value === "Additional Project" ? value : "Workspace";
  }
  static normalizeStepId(value) {
    const candidate = `${value ?? ""}`.trim();
    return candidate || "basics";
  }
  static normalizeStepIds(values) {
    return [...new Set((values ?? []).map((value) => `${value ?? ""}`.trim()).filter(Boolean))];
  }
  static normalizeProfileStatus(value) {
    if (value === "friends only" || value === "host only" || value === "inactive") {
      return value;
    }
    return "public";
  }
  static normalizeStringList(values) {
    return [...new Set((values ?? []).map((value) => `${value ?? ""}`.trim()).filter((value) => value.length > 0))];
  }
  static normalizeHeightCm(value) {
    const parsed = Math.trunc(Number(value));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    return Math.max(40, Math.min(250, parsed));
  }
  static parseHeightCm(value) {
    const parsed = Number.parseInt(`${value ?? ""}`.replace(/[^0-9]/g, ""), 10);
    return this.normalizeHeightCm(parsed);
  }
  static normalizeToken(value) {
    return `${value ?? ""}`.trim().toLowerCase();
  }
};
var ProfileFormFlowConverter = class {
  static completionPercent(data) {
    const profile = data.profile;
    const model = this.convert({
      version: 1,
      userId: profile.id.trim(),
      currentStepId: "basics",
      updatedAtIso: "",
      completedStepIds: [],
      skippedStepIds: [],
      data
    }, {
      showHeader: false,
      showSave: false
    });
    return formFlowCompletionPercent(model, data);
  }
  static convert(draft, options = {}) {
    const data = draft?.data ?? null;
    const profile = data?.profile ?? null;
    const experienceEntries = data?.experienceEntries ?? [];
    const imageEditor = options.imageEditor ?? "flow";
    const profileSize = options.profileSize ?? "big";
    const steps = [{
      id: "basics",
      title: "Alapadatok",
      subtitle: "Alap profiladatok.",
      icon: "badge",
      controls: this.profileBasicsControls(profile, experienceEntries, options, profileSize)
    }];
    if (imageEditor !== "external") {
      steps.push(this.photosStep(options));
    }
    if (profileSize !== "small") {
      steps.push(this.lifestyleStep(profile, options));
    }
    return {
      title: options.title?.trim() || "profile.setup",
      subtitle: options.subtitle?.trim() || "",
      layout: options.layout ?? "carousel",
      header: options.showHeader === false ? false : true,
      allowMenuOverflow: options.allowMenuOverflow === true,
      loadingLabel: "Loading profile setup",
      save: options.showSave === false ? null : {
        label: "save.profile",
        ariaLabel: "save.profile",
        icon: "done",
        disabled: options.saveDisabled === true
      },
      summary: {
        enabled: true,
        title: "review",
        subtitle: "profile.review.before.save",
        icon: "fact_check",
        emptyLabel: "not.set",
        includeEmpty: true
      },
      completion: {
        controls: "none",
        items: this.profileCompletionItems(profile)
      },
      steps
    };
  }
  static photosStep(options) {
    return {
      id: "photos",
      title: "photos",
      subtitle: "profile.photos.minimum.three",
      icon: "photo_library",
      controls: [{
        id: "images",
        kind: "image-carousel",
        label: "profile.images",
        bind: "profile.images",
        required: true,
        min: 3,
        config: {
          slotCount: 8,
          previewMode: true,
          ariaLabel: "profile.images",
          uploadOwnerId: options.userId?.trim() || "",
          uploadEntityId: options.userId?.trim() || "profile-onboarding"
        },
        summary: {
          value: (value) => `${this.imageCount(value)} / 8`
        }
      }]
    };
  }
  static lifestyleStep(profile, options) {
    return {
      id: "lifestyle",
      title: "lifestyle",
      subtitle: "profile.optional.details",
      icon: "interests",
      controls: [
        this.detailMenuControl(profile, "drinking", "profile.details.drinking", "profile.details.drinking", "groups", "blue", options.privacy),
        this.detailMenuControl(profile, "smoking", "profile.details.smoking", "profile.details.smoking", "smoking_rooms", "violet", options.privacy),
        this.detailMenuControl(profile, "workout", "profile.details.workout", "profile.details.workout", "fitness_center", "green", options.privacy),
        this.detailMenuControl(profile, "pets", "profile.details.pets", "profile.details.pets", "pets", "green", options.privacy),
        this.detailMenuControl(profile, "familyPlans", "profile.details.familyPlans", "profile.details.familyPlans", "family_restroom", "blue", options.privacy),
        this.detailMenuControl(profile, "children", "profile.details.children", "profile.details.children", "child_care", "orange", options.privacy),
        this.detailMenuControl(profile, "loveStyle", "profile.details.loveStyle", "profile.details.loveStyle", "explore", "violet", options.privacy),
        this.detailMenuControl(profile, "communicationStyle", "profile.details.communicationStyle", "profile.details.communicationStyle", "forum", "orange", options.privacy),
        this.detailMenuControl(profile, "sexualOrientation", "profile.details.sexualOrientation", "profile.details.sexualOrientation", "all_inclusive", "teal", options.privacy),
        this.detailMenuControl(profile, "religion", "profile.details.religion", "profile.details.religion", "self_improvement", "orange", options.privacy),
        {
          id: "values",
          kind: "menu",
          label: "values",
          bind: this.detailValueBind(profile, "profile.details.values"),
          valueFormat: "csv",
          config: this.groupedCheckboxMenuConfig("values", APP_STATIC_DATA.beliefsValuesOptionGroups, "auto_awesome", "purple", 5, "select.values"),
          accessory: this.privacyAccessory("profile.details.values", options.privacy)
        },
        {
          id: "interests",
          kind: "menu",
          label: "interests",
          bind: this.detailValueBind(profile, "profile.details.interest"),
          valueFormat: "csv",
          config: this.groupedCheckboxMenuConfig("interests", APP_STATIC_DATA.interestOptionGroups, "sell", "teal", 5, "select.interests"),
          accessory: this.privacyAccessory("profile.details.interest", options.privacy)
        }
      ]
    };
  }
  static profileBasicsControls(profile, experienceEntries, options, profileSize) {
    const baseControls = [
      {
        id: "about",
        kind: "textarea",
        label: "about",
        bind: "profile.about",
        rows: 3,
        maxLength: 160
      },
      {
        id: "full-name",
        kind: "text",
        label: "name",
        bind: "profile.name",
        required: true,
        placeholder: "name"
      }
    ];
    if (profileSize === "small") {
      return [
        ...baseControls,
        {
          id: "headline",
          kind: "text",
          label: "Headline",
          bind: "profile.headline",
          placeholder: "Admin workspace"
        }
      ];
    }
    return [
      ...baseControls,
      {
        id: "birthday",
        kind: "date",
        layout: "half",
        label: "birthday",
        bind: "profile.birthday",
        required: true,
        placeholder: "dd/mm/yyyy",
        config: {
          meta: {
            kind: "horoscope",
            label: "profile.horoscope",
            emptyLabel: "not.set"
          }
        }
      },
      {
        id: "city",
        kind: "text",
        label: "city",
        bind: "profile.city",
        required: true,
        placeholder: "city"
      },
      {
        id: "height",
        kind: "number",
        label: "height.cm",
        bind: "profile.height",
        required: true,
        min: 1,
        max: 260,
        placeholder: "180"
      },
      {
        id: "physique",
        kind: "menu",
        label: "profile.physique",
        bind: "profile.physique",
        required: true,
        config: this.physiqueMenuConfig()
      },
      {
        id: "gender",
        kind: "menu",
        label: "profile.gender",
        bind: this.detailValueBind(profile, "profile.gender"),
        required: true,
        config: this.detailSelectMenuConfig("profile.gender", "profile.gender", "person", "violet"),
        accessory: this.privacyAccessory("profile.gender", options.privacy)
      },
      {
        id: "languages",
        kind: "menu",
        label: "profile.languages",
        bind: "profile.languages",
        required: true,
        config: this.checkboxMenuConfig("profile.languages", this.languageOptions(profile?.languages ?? []), "language", "blue", "select.languages", 2)
      },
      {
        id: "workspace",
        kind: "menu",
        layout: "half",
        label: "profile.experience.workplace",
        bind: "experienceEntries",
        config: this.experienceSelectorMenuConfig("Workspace", experienceEntries),
        accessory: this.experiencePrivacyAccessory("workspace", options.privacy),
        summary: {
          value: (value) => this.experienceSummaryValue(value, "Workspace")
        }
      },
      {
        id: "school",
        kind: "menu",
        layout: "half",
        label: "profile.experience.school",
        bind: "experienceEntries",
        config: this.experienceSelectorMenuConfig("School", experienceEntries),
        accessory: this.experiencePrivacyAccessory("school", options.privacy),
        summary: {
          value: (value) => this.experienceSummaryValue(value, "School")
        }
      }
    ];
  }
  static detailMenuControl(profile, field, label, key, icon, palette, privacy) {
    return {
      id: field,
      kind: "menu",
      label,
      bind: this.detailValueBind(profile, key),
      config: this.detailSelectMenuConfig(label, key, icon, palette),
      accessory: this.privacyAccessory(key, privacy)
    };
  }
  static profileCompletionItems(profile) {
    const detailItem = (id, labelKey) => ({
      id,
      bind: this.detailValueBind(profile, labelKey)
    });
    return [
      { id: "name", bind: "profile.name" },
      { id: "birthday", bind: "profile.birthday", metric: "isoDate", weight: 2 },
      { id: "city", bind: "profile.city" },
      { id: "height", bind: "profile.height", metric: "positiveNumber" },
      { id: "physique", bind: "profile.physique" },
      { id: "languages", bind: "profile.languages", metric: "count", thresholds: [1, 2, 3] },
      { id: "about", bind: "profile.about", metric: "length", thresholds: [20, 80, 140] },
      __spreadProps(__spreadValues({}, detailItem("values", "profile.details.values")), { valueFormat: "csv", metric: "count", thresholds: [1, 3] }),
      __spreadProps(__spreadValues({}, detailItem("interests", "profile.details.interest")), { valueFormat: "csv", metric: "count", thresholds: [1, 3] }),
      detailItem("drinking", "profile.details.drinking"),
      detailItem("smoking", "profile.details.smoking"),
      detailItem("workout", "profile.details.workout"),
      detailItem("pets", "profile.details.pets"),
      detailItem("family-plans", "profile.details.familyPlans"),
      detailItem("children", "profile.details.children"),
      detailItem("love-style", "profile.details.loveStyle"),
      detailItem("communication-style", "profile.details.communicationStyle"),
      detailItem("sexual-orientation", "profile.details.sexualOrientation"),
      detailItem("religion", "profile.details.religion"),
      detailItem("gender", "profile.gender"),
      {
        id: "images",
        bind: "profile.images",
        metric: "count",
        thresholds: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    ];
  }
  static detailValueBind(profile, labelKey) {
    const normalizedLabel = AppUtils.normalizeText(labelKey);
    for (const [groupIndex, group] of (profile?.profileDetails ?? []).entries()) {
      for (const [rowIndex, row] of (group.rows ?? []).entries()) {
        if (AppUtils.normalizeText(row.labelKey) === normalizedLabel) {
          return ["profile", "profileDetails", groupIndex, "rows", rowIndex, "value"];
        }
      }
    }
    return ["profile", "profileDetails", 0, "rows", 0, "value"];
  }
  static privacyAccessory(key, privacy) {
    if (!privacy?.values) {
      return null;
    }
    const current = privacy.values[key] ?? this.defaultPrivacy(key);
    return {
      menu: {
        kind: "select",
        layout: "list",
        panelMode: "anchored",
        title: "visibility",
        closeOnSelect: true,
        trigger: {
          icon: this.privacyIcon(current),
          closeIcon: "close",
          hideLabel: true,
          layout: "icon",
          palette: this.privacyPalette(current),
          ariaLabel: "profile.visibility.change.aria"
        },
        items: APP_STATIC_DATA.detailPrivacyOptions.map((option) => ({
          id: `${this.idToken(key)}-privacy-${this.idToken(option)}`,
          label: option,
          icon: this.privacyIcon(option),
          kind: "radio",
          active: option === current,
          palette: this.privacyPalette(option),
          surface: "tinted",
          context: { menu: "privacy", key, value: option }
        }))
      }
    };
  }
  static experiencePrivacyAccessory(type, privacy) {
    if (!privacy?.experience) {
      return null;
    }
    const current = privacy.experience[type] ?? "Public";
    return {
      menu: {
        kind: "select",
        layout: "list",
        panelMode: "anchored",
        title: "visibility",
        closeOnSelect: true,
        trigger: {
          icon: this.privacyIcon(current),
          closeIcon: "close",
          hideLabel: true,
          layout: "icon",
          palette: this.privacyPalette(current),
          ariaLabel: "profile.visibility.change.aria"
        },
        items: APP_STATIC_DATA.detailPrivacyOptions.map((option) => ({
          id: `experience-${type}-privacy-${this.idToken(option)}`,
          label: option,
          icon: this.privacyIcon(option),
          kind: "radio",
          active: option === current,
          palette: this.privacyPalette(option),
          surface: "tinted",
          context: { menu: "experiencePrivacy", type, value: option }
        }))
      }
    };
  }
  static defaultPrivacy(key) {
    for (const group of APP_STATIC_DATA.profileDetailGroupTemplates) {
      const row = group.rows.find((candidate) => candidate.labelKey === key);
      if (row) {
        return row.privacy;
      }
    }
    return "Public";
  }
  static privacyIcon(value) {
    switch (value) {
      case "Public":
        return "public";
      case "Friends":
        return "groups";
      case "Hosts":
        return "stadium";
      default:
        return "visibility_off";
    }
  }
  static privacyPalette(value) {
    switch (value) {
      case "Public":
        return "green";
      case "Friends":
        return "blue";
      case "Hosts":
        return "brown";
      default:
        return "muted";
    }
  }
  static detailSelectMenuConfig(title, key, icon, fallbackPalette) {
    const options = this.detailOptions(key);
    return this.selectMenuConfig(title, options, icon, fallbackPalette, (option) => this.detailOptionIcon(key, option), (option) => this.paletteFromTone(this.detailToneFromOptions(option, options)), "select");
  }
  static physiqueMenuConfig() {
    return this.selectMenuConfig("profile.physique", APP_STATIC_DATA.physiqueOptions, "fitness_center", "green", (option) => this.physiqueIcon(option), (option) => this.paletteFromTone(this.physiqueToneClass(option)), "profile.physique.select");
  }
  static selectMenuConfig(title, options, icon, palette, iconForOption = () => icon, paletteForOption = () => palette, emptyLabel = "select") {
    return {
      kind: "select",
      title,
      trigger: this.trigger(title, icon, palette, emptyLabel),
      items: options.map((option) => this.radioItem(title, option, iconForOption(option), paletteForOption(option)))
    };
  }
  static checkboxMenuConfig(title, options, icon, palette, emptyLabel, maxLabels) {
    return {
      kind: "select",
      layout: "tabs",
      title,
      filterable: true,
      closeOnSelect: false,
      trigger: this.trigger(title, icon, palette),
      model: {
        layout: "tabs",
        summary: {
          emptyLabel,
          maxLabels,
          counter: "overflow"
        },
        groups: [{
          id: `${this.idToken(title)}-options`,
          label: title,
          icon,
          palette,
          items: options.map((option) => this.checkboxItem(title, option, icon, palette))
        }]
      }
    };
  }
  static groupedCheckboxMenuConfig(title, groups, icon, palette, maxSelected, emptyLabel) {
    return {
      kind: "select",
      layout: "tabs",
      title,
      filterable: true,
      closeOnSelect: false,
      trigger: this.trigger(title, icon, palette),
      model: buildTabbedMenuModel({
        idPrefix: this.idToken(title),
        groups,
        maxSelected,
        summary: {
          emptyLabel,
          maxLabels: 2,
          counter: "overflow"
        },
        context: (option) => ({ menu: "field", field: title, value: option })
      })
    };
  }
  static experienceSelectorMenuConfig(type, entries) {
    const filteredEntries = this.experienceEntriesByType(entries, type);
    const palette = type === "Workspace" ? "pink" : "blue";
    const icon = type === "Workspace" ? "apartment" : "school";
    const title = type === "Workspace" ? "profile.experience.workplace" : "profile.experience.school";
    const emptyLabel = type === "Workspace" ? "profile.experience.selectWorkplace" : "profile.experience.selectSchool";
    return {
      kind: "select",
      layout: "tabs",
      title,
      trigger: {
        label: filteredEntries.length > 0 ? filteredEntries.map((entry) => this.experienceEntryLabel(entry, type)).slice(0, 2).join(", ") : emptyLabel,
        icon,
        palette,
        layout: "field",
        action: "custom",
        trailingIcon: "chevron_right",
        ariaLabel: emptyLabel,
        context: { menu: "experienceSelector", value: type }
      },
      model: {
        layout: "tabs",
        valueKey: "id",
        summary: {
          emptyLabel,
          maxLabels: 2,
          counter: "overflow"
        },
        groups: [{
          id: `experience-${this.idToken(type)}`,
          label: title,
          icon,
          palette,
          items: filteredEntries.map((entry) => ({
            id: `experience-${this.idToken(type)}-${entry.id}`,
            label: this.experienceEntryLabel(entry, type),
            icon,
            kind: "checkbox",
            value: entry.id,
            active: true,
            checked: true,
            removable: false,
            closeOnSelect: false,
            palette,
            surface: "tinted",
            context: { menu: "experienceSelector", value: type }
          }))
        }]
      }
    };
  }
  static trigger(title, icon, palette, label) {
    return {
      label: label?.trim() || void 0,
      icon,
      palette,
      layout: "field",
      ariaLabel: "select"
    };
  }
  static radioItem(field, value, icon, palette) {
    return {
      id: `${this.idToken(field)}-${this.idToken(value)}`,
      label: value,
      icon,
      kind: "radio",
      value,
      palette,
      surface: "tinted",
      context: { menu: "field", field, value }
    };
  }
  static checkboxItem(field, value, icon, palette) {
    return {
      id: `${this.idToken(field)}-${this.idToken(value)}`,
      label: value,
      icon,
      kind: "checkbox",
      value,
      palette,
      surface: "tinted",
      closeOnSelect: false,
      context: { menu: "field", field, value }
    };
  }
  static experienceEntries(value) {
    const entries = value?.experienceEntries;
    return Array.isArray(entries) ? entries : [];
  }
  static experienceEntriesByType(entries, type) {
    return (entries ?? []).filter((entry) => entry.type === type).sort((a, b) => AppUtils.toSortableDate(b.dateFrom) - AppUtils.toSortableDate(a.dateFrom));
  }
  static experienceSummaryValue(value, type) {
    return this.experienceEntriesByType(this.experienceEntries(value), type).map((entry) => this.experienceEntryLabel(entry, type)).filter(Boolean).join(", ");
  }
  static experienceEntryLabel(entry, fallback) {
    return entry.title.trim() || entry.org.trim() || entry.city.trim() || fallback;
  }
  static imageCount(value) {
    const images = value?.profile?.images;
    return Array.isArray(images) ? images.filter((image) => `${image ?? ""}`.trim().length > 0).length : 0;
  }
  static languageOptions(selected) {
    return [...new Set([...APP_STATIC_DATA.languageSuggestions, ...selected].map((option) => option.trim()).filter(Boolean))];
  }
  static detailOptions(key) {
    return APP_STATIC_DATA.profileDetailValueOptions[key] ?? [];
  }
  static physiqueIcon(value) {
    const normalized = AppUtils.normalizeText(value);
    if (normalized.includes("slim")) {
      return "directions_run";
    }
    if (normalized.includes("lean")) {
      return "self_improvement";
    }
    if (normalized.includes("athletic")) {
      return "fitness_center";
    }
    if (normalized.includes("fit")) {
      return "sports_gymnastics";
    }
    if (normalized.includes("curvy")) {
      return "accessibility";
    }
    if (normalized.includes("muscular")) {
      return "sports_mma";
    }
    return "accessibility_new";
  }
  static physiqueToneClass(value) {
    const normalized = AppUtils.normalizeText(value);
    if (normalized.includes("slim")) {
      return "physique-slim";
    }
    if (normalized.includes("lean")) {
      return "physique-lean";
    }
    if (normalized.includes("fit")) {
      return "physique-fit";
    }
    if (normalized.includes("athletic")) {
      return "physique-athletic";
    }
    if (normalized.includes("curvy")) {
      return "physique-curvy";
    }
    if (normalized.includes("muscular")) {
      return "physique-muscular";
    }
    return "physique-average";
  }
  static detailToneFromOptions(value, options) {
    const index = options.findIndex((item) => AppUtils.normalizeText(item) === AppUtils.normalizeText(value));
    return `detail-tone-${(index >= 0 ? index : 0) % 8 + 1}`;
  }
  static detailOptionIcon(labelKey, option) {
    const normalizedLabel = AppUtils.normalizeText(labelKey);
    const normalizedOption = AppUtils.normalizeText(option);
    if (normalizedLabel.includes("drinking")) {
      if (normalizedOption.includes("never")) {
        return "no_drinks";
      }
      if (normalizedOption.includes("socially")) {
        return "groups";
      }
      if (normalizedOption.includes("occasionally")) {
        return "event";
      }
      return "nightlife";
    }
    if (normalizedLabel.includes("smoking")) {
      if (normalizedOption.includes("never")) {
        return "smoke_free";
      }
      if (normalizedOption.includes("trying")) {
        return "healing";
      }
      if (normalizedOption.includes("socially")) {
        return "group";
      }
      return "smoking_rooms";
    }
    if (normalizedLabel.includes("workout")) {
      if (normalizedOption.includes("daily")) {
        return "whatshot";
      }
      if (normalizedOption.includes("4x")) {
        return "fitness_center";
      }
      if (normalizedOption.includes("2-3x")) {
        return "directions_run";
      }
      return "self_improvement";
    }
    if (normalizedLabel.includes("pets")) {
      if (normalizedOption.includes("dog")) {
        return "pets";
      }
      if (normalizedOption.includes("cat")) {
        return "pets";
      }
      if (normalizedOption.includes("all")) {
        return "cruelty_free";
      }
      return "block";
    }
    if (normalizedLabel.includes("family")) {
      if (normalizedOption.includes("want")) {
        return "child_care";
      }
      if (normalizedOption.includes("open")) {
        return "family_restroom";
      }
      if (normalizedOption.includes("not sure")) {
        return "help_outline";
      }
      return "do_not_disturb_alt";
    }
    if (normalizedLabel.includes("children")) {
      if (normalizedOption === "yes") {
        return "child_friendly";
      }
      if (normalizedOption === "no") {
        return "do_not_disturb_alt";
      }
      return "privacy_tip";
    }
    if (normalizedLabel.includes("love")) {
      if (normalizedOption.includes("long-term")) {
        return "favorite";
      }
      if (normalizedOption.includes("slow-burn")) {
        return "hourglass_bottom";
      }
      if (normalizedOption.includes("open")) {
        return "hub";
      }
      return "explore";
    }
    if (normalizedLabel.includes("communication")) {
      if (normalizedOption.includes("direct")) {
        return "campaign";
      }
      if (normalizedOption.includes("calm")) {
        return "record_voice_over";
      }
      if (normalizedOption.includes("playful")) {
        return "mood";
      }
      return "forum";
    }
    if (normalizedLabel.includes("orientation")) {
      if (normalizedOption.includes("straight")) {
        return "person";
      }
      if (normalizedOption.includes("bisexual")) {
        return "diversity_3";
      }
      if (normalizedOption.includes("gay") || normalizedOption.includes("lesbian")) {
        return "favorite";
      }
      if (normalizedOption.includes("pansexual")) {
        return "all_inclusive";
      }
      if (normalizedOption.includes("asexual")) {
        return "do_not_disturb_on";
      }
      return "privacy_tip";
    }
    if (normalizedLabel.includes("gender")) {
      if (normalizedOption.includes("woman")) {
        return "female";
      }
      if (normalizedOption.includes("man")) {
        return "male";
      }
      if (normalizedOption.includes("non-binary")) {
        return "transgender";
      }
      return "privacy_tip";
    }
    if (normalizedLabel.includes("religion")) {
      if (normalizedOption.includes("spiritual")) {
        return "self_improvement";
      }
      if (normalizedOption.includes("christian")) {
        return "church";
      }
      if (normalizedOption.includes("muslim")) {
        return "mosque";
      }
      if (normalizedOption.includes("jewish")) {
        return "synagogue";
      }
      if (normalizedOption.includes("buddhist") || normalizedOption.includes("hindu")) {
        return "temple_buddhist";
      }
      if (normalizedOption.includes("atheist")) {
        return "public_off";
      }
      return "privacy_tip";
    }
    return "radio_button_checked";
  }
  static paletteFromTone(toneClass) {
    switch (toneClass) {
      case "physique-lean":
      case "physique-fit":
      case "detail-tone-2":
      case "detail-tone-5":
      case "section-active":
        return "green";
      case "physique-athletic":
      case "detail-tone-1":
      case "section-languages":
      case "section-social":
        return "blue";
      case "detail-tone-8":
        return "brown";
      case "physique-slim":
      case "detail-tone-7":
        return "sky";
      case "physique-curvy":
      case "detail-tone-6":
        return "pink";
      case "physique-muscular":
        return "red";
      case "detail-tone-3":
      case "section-family":
      case "section-food":
        return "orange";
      case "section-ambition":
        return "amber";
      case "section-lifestyle":
      case "section-mind":
        return "teal";
      case "section-beliefs":
        return "purple";
      case "detail-tone-4":
      case "section-arts":
        return "violet";
      case "section-identity":
        return "cyan";
      case "physique-average":
      default:
        return "muted";
    }
  }
  static idToken(value) {
    return AppUtils.normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
  }
};

// src/app/shared/ui/converters/profile-header-card.converter.ts
var ProfileHeaderCardConverter = class {
  static convert(user, options = {}) {
    const admin = options.admin === true;
    const name = `${options.name ?? user.name ?? ""}`.trim();
    const completion = admin ? user.completion : options.completionPercent ?? user.completion;
    return {
      admin,
      statusClass: admin ? "status-friends" : this.profileStatusClass(options.profileStatus ?? user.profileStatus),
      title: admin ? name : `${name}, ${options.age ?? user.age}`,
      meta: admin ? `${options.headline ?? user.headline ?? ""}`.trim() || "Admin workspace" : `${options.city ?? user.city ?? ""}`.trim(),
      metaIcon: admin ? "admin_panel_settings" : "location_on",
      imageUrl: this.firstImageUrl(user.images),
      initials: user.initials,
      gender: user.gender,
      badgeLabel: admin ? "ADMIN" : `${completion}%`,
      badgeStyle: this.completionBadgeStyle(completion),
      showEdit: options.showEdit === true,
      editDisabled: options.editDisabled === true,
      editAriaLabel: options.editAriaLabel ?? "Edit",
      showRing: options.showRing === true,
      ringState: options.ringState ?? "loading",
      ringTitle: options.ringTitle ?? null
    };
  }
  static profileStatusClass(status) {
    switch (status) {
      case "public":
        return "status-public";
      case "friends only":
        return "status-friends";
      case "host only":
        return "status-host";
      case "blocked":
        return "status-blocked";
      default:
        return "status-inactive";
    }
  }
  static firstImageUrl(images) {
    return (images ?? []).map((image) => `${image ?? ""}`.trim()).find(Boolean) ?? null;
  }
  static completionBadgeStyle(value) {
    const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
    const hue = Math.round(clamped / 100 * 120);
    return {
      background: `hsl(${hue}, 82%, 84%)`,
      borderColor: `hsl(${hue}, 70%, 58%)`,
      color: `hsl(${hue}, 74%, 24%)`
    };
  }
};

// src/app/shared/ui/converters/event-feedback-info-card.converter.ts
var EventFeedbackOrganizerInfoCardConverter = class {
  static convert(item, options = {}) {
    const showAction = options.showAction ?? true;
    return {
      id: item.eventId,
      status: "own-event",
      title: item.title,
      imageUrl: item.imageUrl,
      metaRows: [item.subtitle],
      detailRows: [item.timeframe],
      leadingIcon: {
        icon: "stadium"
      },
      mediaEnd: showAction ? {
        variant: "badge",
        tone: "default",
        label: "View Feedbacks",
        pendingCount: item.responseCount,
        interactive: true,
        ariaLabel: `Open feedback details for ${item.title}`
      } : null,
      clickable: false
    };
  }
  static convertList(items, options = {}) {
    return items.map((item) => this.convert(item, options));
  }
};
var EventFeedbackInfoCardConverter = class {
  static convert(item, options = {}) {
    if (item.isOwnEvent) {
      return EventFeedbackOrganizerInfoCardConverter.convert({
        eventId: item.eventId,
        title: item.title,
        subtitle: item.subtitle,
        timeframe: item.timeframe,
        imageUrl: item.imageUrl,
        responseCount: item.pendingCards,
        noteCount: 0
      });
    }
    const startAvailable = this.isEventFeedbackStartAvailable(item);
    const detailRows = item.isFeedbacked ? [item.timeframe] : [item.timeframe, this.eventFeedbackItemStatusLine(item)];
    return {
      id: item.eventId,
      status: item.isRemoved ? "removed" : item.isFeedbacked ? "feedbacked" : "pending",
      title: item.title,
      imageUrl: item.imageUrl,
      metaRows: [item.subtitle],
      detailRows,
      leadingIcon: {
        icon: this.eventFeedbackLeadingIcon(item)
      },
      mediaEnd: {
        variant: "badge",
        tone: "default",
        label: this.eventFeedbackStartBadgeLabel(item),
        interactive: startAvailable,
        ariaLabel: startAvailable ? "Start event feedback" : "Event feedback unavailable"
      },
      menuActions: this.eventFeedbackMenuActions(item, this.hasOrganizerNote(item.eventId, options.state)),
      clickable: false
    };
  }
  static convertList(items, options = {}) {
    return items.map((item) => this.convert(item, options));
  }
  static isEventFeedbackStartAvailable(item) {
    return !item.isRemoved && item.pendingCards > 0;
  }
  static eventFeedbackItemStatusLine(item) {
    if (item.isRemoved) {
      return "Removed without feedback.";
    }
    if (item.isFeedbacked) {
      return "Feedbacked.";
    }
    return `${item.pendingCards}/${item.totalCards} feedback item${item.totalCards === 1 ? "" : "s"} pending.`;
  }
  static eventFeedbackLeadingIcon(item) {
    if (item.isOwnEvent) {
      return "stadium";
    }
    if (item.isFeedbacked) {
      return "task_alt";
    }
    if (item.isRemoved) {
      return "delete_outline";
    }
    return "rate_review";
  }
  static eventFeedbackStartBadgeLabel(item) {
    if (item.isOwnEvent) {
      return "View Feedbacks";
    }
    if (item.isRemoved) {
      return "Removed";
    }
    if (item.isFeedbacked) {
      return "Feedbacked";
    }
    return "Start Feedback";
  }
  static eventFeedbackMenuActions(item, hasOrganizerNote) {
    if (item.isOwnEvent) {
      return [];
    }
    if (item.isFeedbacked) {
      return [
        "viewSubmittedFeedback",
        hasOrganizerNote ? "editOrganizerNote" : "addOrganizerNote"
      ];
    }
    const actions = [];
    if (this.isEventFeedbackStartAvailable(item)) {
      actions.push("startFeedback");
    }
    if (!item.isRemoved && !item.isFeedbacked) {
      actions.push("removeFeedback");
    }
    if (item.isRemoved) {
      actions.push("restoreFeedback");
    }
    actions.push(hasOrganizerNote ? "editOrganizerNote" : "addOrganizerNote");
    return actions;
  }
  static hasOrganizerNote(eventId, state) {
    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return false;
    }
    return Boolean(state?.organizerNotesByEventId?.[normalizedEventId]?.trim());
  }
};

// src/app/shared/ui/converters/event-feedback-page.converter.ts
var EventFeedbackFilterMenuConverter = class {
  static filterOptions = APP_STATIC_DATA.eventFeedbackListFilters;
  static convert(input) {
    const result = input.result ?? null;
    const activeFilter = input.activeFilter;
    const delta = input.delta ?? {};
    return {
      trigger: this.trigger(result, activeFilter, delta),
      items: this.items(result, activeFilter, delta)
    };
  }
  static trigger(result, filter, delta) {
    const count = result?.filterCountWithDelta(filter, delta) ?? 0;
    return {
      label: this.filterLabel(filter),
      icon: this.filterIcon(filter),
      ariaLabel: "Open event feedback filter",
      palette: this.filterPalette(filter),
      counter: count > 0 ? { value: count, max: 99 } : null,
      layout: "pill"
    };
  }
  static items(result, activeFilter, delta) {
    return this.filterOptions.map((option) => {
      const count = result?.filterCountWithDelta(option.key, delta) ?? 0;
      return {
        id: `feedback-filter-${option.key}`,
        label: option.label,
        icon: option.icon,
        kind: "radio",
        active: option.key === activeFilter,
        checked: option.key === activeFilter,
        palette: this.filterPalette(option.key),
        surface: "tinted",
        counter: count > 0 ? { value: count, max: 99 } : null,
        context: { menu: "filter", filter: option.key }
      };
    });
  }
  static filterLabel(filter) {
    return this.filterOptions.find((item) => item.key === filter)?.label ?? "Pending";
  }
  static filterIcon(filter) {
    return this.filterOptions.find((item) => item.key === filter)?.icon ?? "schedule";
  }
  static filterPalette(filter) {
    switch (filter) {
      case "feedbacked":
        return "green";
      case "removed":
        return "slate";
      case "own-events":
        return "violet";
      default:
        return "amber";
    }
  }
};
var EventFeedbackListPresentationConverter = class {
  static convert(input) {
    return {
      emptyDescription: this.emptyDescription(input.filter),
      groupLabel: this.groupLabel(input.result ?? null, input.itemId ?? "", input.filter)
    };
  }
  static emptyDescription(filter) {
    switch (filter) {
      case "own-events":
        return "No feedback-ready own events yet.";
      case "feedbacked":
        return "No feedbacked events yet.";
      case "removed":
        return "No removed events.";
      case "pending":
      default:
        return "No pending events yet. New items appear about 2 hours after event start.";
    }
  }
  static groupLabel(result, itemId, filter) {
    const item = result?.itemById(itemId) ?? null;
    const timestampMs = item ? result?.groupTimestampMs(item, filter) ?? null : null;
    const timestampDate = AppUtils.parseDate(timestampMs);
    if (!timestampDate) {
      return "No date";
    }
    return AppUtils.weekdayMonthDayYearLabel(timestampDate);
  }
};
var EventFeedbackOrganizerItemConverter = class {
  static convert(item, options) {
    const eventId = item.eventId?.trim() ?? "";
    const entries = options.result.receivedEntries(eventId);
    return {
      eventId,
      title: item.title,
      subtitle: item.subtitle,
      timeframe: item.timeframe,
      imageUrl: item.imageUrl,
      startAtMs: this.numberOrNull(item.startAtMs),
      responseCount: entries.length || item.totalCards,
      noteCount: entries.filter((entry) => entry.organizerNote.trim().length > 0).length,
      latestActivityAtMs: options.result.entriesLatestAtMs(entries) ?? item.feedbackedAtMs
    };
  }
  static convertList(items, options) {
    return items.map((item) => this.convert(item, options)).filter((item) => item.eventId.length > 0);
  }
  static numberOrNull(value) {
    return Number.isFinite(value) && (value ?? 0) > 0 ? Number(value) : null;
  }
};
var EventFeedbackOrganizerCarouselSectionConverter = class {
  static convert(input) {
    const stat = input.stat ?? null;
    const sectionByKey = new Map((stat?.sections ?? []).map((section) => [section.key, section]));
    const totalResponses = Math.max(0, Math.trunc(Number(stat?.totalResponses) || 0));
    return [
      this.buildSection(totalResponses, "overall", "Overall", "sentiment_satisfied", "Most selected event impression", "event-feedback-organizer-carousel-card-tone-overall", this.optionStats(APP_STATIC_DATA.eventFeedbackEventOverallOptions, sectionByKey.get("overall"))),
      this.buildSection(totalResponses, "improve", "Improve Next", "campaign", "Most requested improvement next time", "event-feedback-organizer-carousel-card-tone-improve", this.optionStats(APP_STATIC_DATA.eventFeedbackHostImproveOptions, sectionByKey.get("improve"))),
      this.buildSection(totalResponses, "traits", "Host Traits", "groups", "Traits attendees mentioned most", "event-feedback-organizer-carousel-card-tone-traits", this.traitStats(sectionByKey.get("traits")))
    ].filter((section) => section !== null);
  }
  static buildSection(totalEntries, key, label, icon, subtitle, toneClass, items) {
    if (items.length === 0) {
      return null;
    }
    const topItem = items[0];
    const topCount = Math.max(0, topItem?.count ?? 0);
    const progressPercent = totalEntries > 0 ? Math.max(8, Math.min(100, Math.round(topCount / totalEntries * 100))) : 0;
    return {
      key,
      label,
      icon,
      subtitle,
      toneClass,
      topLabel: topItem?.label ?? label,
      topCount,
      optionCount: items.length,
      responseCount: totalEntries,
      progressPercent,
      items: items.map((item) => __spreadValues({}, item))
    };
  }
  static traitStats(section) {
    const countsByTraitId = this.optionCountByKey(section);
    return APP_STATIC_DATA.eventFeedbackPersonalityTraitOptions.map((option) => ({
      key: option.id,
      label: option.label,
      icon: option.icon,
      count: countsByTraitId.get(option.id) ?? 0
    })).filter((item) => item.count > 0).sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
  }
  static optionStats(options, section) {
    const countsByValue = this.optionCountByKey(section);
    return options.map((option) => ({
      key: option.value,
      label: option.label,
      icon: option.icon,
      count: countsByValue.get(option.value) ?? 0
    })).filter((item) => item.count > 0).sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
  }
  static optionCountByKey(section) {
    const countsByKey = /* @__PURE__ */ new Map();
    for (const option of section?.options ?? []) {
      const key = option.key?.trim() ?? "";
      const count = Math.max(0, Math.trunc(Number(option.count) || 0));
      if (!key || count <= 0) {
        continue;
      }
      countsByKey.set(key, count);
    }
    return countsByKey;
  }
};
var EventFeedbackOrganizerMessageGroupConverter = class {
  static convert(input) {
    const groups = /* @__PURE__ */ new Map();
    for (const entry of input.result?.organizerEntries(input.eventId) ?? []) {
      const timestampIso = this.entryTimestampIso(entry);
      const timestampDate = AppUtils.parseDate(timestampIso);
      const answer = this.entryEventAnswer(entry);
      const viewerName = entry.viewerName?.trim() || entry.viewerUserId.trim() || "Member";
      const viewerInitials = entry.viewerInitials?.trim() || AppUtils.initialsFromText(viewerName);
      const viewerGender = entry.viewerGender === "woman" ? "woman" : "man";
      const viewerImageUrl = entry.viewerImageUrl?.trim() || "";
      const dayKey = timestampDate ? AppUtils.toIsoDate(timestampDate) : "undated";
      const dayLabel = timestampDate ? AppUtils.weekdayMonthDayLabel(timestampDate) : "No date";
      const timeLabel = timestampDate ? AppUtils.clockTimeLabel(timestampDate) : "";
      const group = groups.get(dayKey) ?? { dayKey, label: dayLabel, items: [] };
      group.items.push({
        id: `${entry.viewerUserId}:${timestampIso || dayKey}`,
        viewerUserId: entry.viewerUserId,
        viewerName,
        viewerInitials,
        viewerGender,
        viewerImageUrl,
        timestampIso,
        dayKey,
        dayLabel,
        timeLabel,
        organizerNote: entry.organizerNote.trim(),
        eventComment: answer?.eventComment?.trim() ?? "",
        overallLabel: answer ? this.optionLabel(answer.primaryValue ?? "", APP_STATIC_DATA.eventFeedbackEventOverallOptions) : null,
        improveLabel: answer ? this.optionLabel(answer.secondaryValue ?? "", APP_STATIC_DATA.eventFeedbackHostImproveOptions) : null,
        traitLabels: answer ? (answer.personalityTraitIds ?? []).map((traitId) => APP_STATIC_DATA.eventFeedbackPersonalityTraitOptions.find((option) => option.id === traitId)?.label ?? "").filter((label) => label.length > 0) : [],
        responseCount: entry.answers.length
      });
      groups.set(dayKey, group);
    }
    return [...groups.values()].map((group) => __spreadProps(__spreadValues({}, group), {
      items: [...group.items].sort((left, right) => {
        const leftMs = AppUtils.dateTimeMs(left.timestampIso) ?? 0;
        const rightMs = AppUtils.dateTimeMs(right.timestampIso) ?? 0;
        return rightMs - leftMs || left.viewerName.localeCompare(right.viewerName);
      })
    })).sort((left, right) => {
      if (left.dayKey === "undated") {
        return 1;
      }
      if (right.dayKey === "undated") {
        return -1;
      }
      return right.dayKey.localeCompare(left.dayKey);
    });
  }
  static optionLabel(value, options) {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return null;
    }
    return options.find((option) => option.value === normalizedValue)?.label ?? null;
  }
  static entryTimestampIso(entry) {
    const updatedAtIso = entry.updatedAtIso?.trim() ?? "";
    if (updatedAtIso) {
      return updatedAtIso;
    }
    const submittedAtIso = entry.submittedAtIso?.trim() ?? "";
    if (submittedAtIso) {
      return submittedAtIso;
    }
    return "";
  }
  static entryEventAnswer(entry) {
    return (entry.answers ?? []).find((answer) => answer.kind === "event") ?? null;
  }
};

// src/app/shared/ui/converters/event-policy-single-row.converter.ts
var EventPolicySingleRowConverter = class {
  static convert(policy, options) {
    const resolved = this.resolveOptions(options);
    const title = `${policy.title ?? ""}`.trim() || `Policy ${resolved.index + 1}`;
    const required = policy.required !== false;
    return {
      id: `${policy.id ?? ""}`.trim() || `policy-${resolved.index + 1}`,
      title,
      detail: this.preview(policy, resolved),
      icon: "policy",
      avatarShape: "circle",
      surfaceTone: required ? "danger" : "info",
      badges: [{
        label: required ? resolved.requiredApprovalLabel : resolved.optionalPolicyLabel,
        tone: required ? "danger" : "info",
        position: "top-right"
      }],
      clickable: true,
      menuActions: resolved.locked ? [] : ["delete"],
      eagerDetail: __spreadValues({}, policy)
    };
  }
  static convertList(policies, options = {}) {
    return (policies ?? []).map((policy, index) => this.convert(policy, __spreadProps(__spreadValues({}, options), {
      index
    })));
  }
  static preview(policy, options) {
    const description = `${policy.description ?? ""}`.trim();
    if (description) {
      return description;
    }
    return policy.required !== false ? options.requiredPreview : options.optionalPreview;
  }
  static resolveOptions(options) {
    return {
      index: Math.max(0, Math.trunc(Number(options.index) || 0)),
      locked: options.locked === true,
      requiredApprovalLabel: options.requiredApprovalLabel?.trim() || "Required approval",
      optionalPolicyLabel: options.optionalPolicyLabel?.trim() || "Optional policy",
      requiredPreview: options.requiredPreview?.trim() || "Attendees must approve this policy before joining.",
      optionalPreview: options.optionalPreview?.trim() || "Optional policy shown during join or checkout."
    };
  }
};

// src/app/shared/ui/converters/activity-rate-card.converter.ts
function isActivityRatePairCardRow(row) {
  return row.mode === "pair";
}
var ActivityRateSingleCardConverter = class {
  static convert(row, options) {
    return buildSingleRateCardData(__spreadProps(__spreadValues({}, activityRateCardInput(row, options)), {
      badge: options.badge,
      contextBadge: row.contextBadge ?? null
    }));
  }
};
var ActivityRatePairCardConverter = class {
  static convert(row, options) {
    return buildPairRateCardData(__spreadProps(__spreadValues({}, activityRateCardInput(row, options)), {
      badge: options.badge
    }));
  }
};
function activityRateCardInput(row, options) {
  const presentation = options.presentation ?? "list";
  const mode = normalizeRateCardMode(row.mode);
  const direction = normalizeRateCardDirection(options.displayedDirection ?? row.displayedDirection ?? row.direction);
  return {
    rowId: row.id,
    groupLabel: options.groupLabel ?? null,
    title: row.title,
    distanceKm: distanceKmFromMeters(row.distanceMetersExact),
    mode,
    direction,
    eventName: row.eventName ?? "",
    happenedOnLabel: row.happenedOnLabel ?? "Unknown",
    primaryUser: toActivityRateCardPerson(row.primaryUser),
    pairUsers: activityRateCardPairUsers(row),
    availableUsers: activityRateCardAvailableUsers(row),
    singleImageUrls: resolvedActivityRateImageUrls(row.singleImageUrls),
    pairSlots: activityRateCardPairSlots(row),
    fallbackGender: options.activeUserGender,
    stackClasses: row.stackClasses?.length ? [...row.stackClasses] : activityRateCardStackClasses(mode, direction),
    presentation,
    state: options.state ?? "default"
  };
}
function distanceKmFromMeters(distanceMeters) {
  const meters = Number.isFinite(distanceMeters) ? Math.max(0, Math.trunc(Number(distanceMeters))) : 0;
  return Math.round(meters / 1e3 * 10) / 10;
}
function activityRateCardStackClasses(mode, displayedDirection) {
  return [
    mode === "pair" ? "activities-rate-profile-stack-pair" : "activities-rate-profile-stack-single",
    `activities-rate-profile-stack-${displayedDirection}`
  ];
}
function activityRateCardPairSlots(row) {
  if (!row.pairSlots?.length) {
    return void 0;
  }
  const hasUsableImage = row.pairSlots.some((slot) => slot.slides.some((slide) => `${slide.imageUrl ?? ""}`.trim().length > 0));
  if (!hasUsableImage) {
    return void 0;
  }
  return row.pairSlots.map((slot) => ({
    key: slot.key,
    label: slot.label,
    tone: slot.tone,
    slides: slot.slides.map((slide) => __spreadValues({}, slide)),
    profileView: slot.profileView ?? null
  }));
}
function activityRateCardPairUsers(row) {
  return (row.pairUsers ?? []).map((user) => toActivityRateCardPerson(user)).filter((user) => Boolean(user));
}
function activityRateCardAvailableUsers(row) {
  return (row.availableUsers ?? []).map((user) => toActivityRateCardPerson(user)).filter((user) => Boolean(user));
}
function resolvedActivityRateImageUrls(imageUrls) {
  if (!imageUrls?.length) {
    return void 0;
  }
  const normalizedImageUrls = imageUrls.map((imageUrl) => `${imageUrl ?? ""}`.trim()).filter((imageUrl) => imageUrl.length > 0);
  return normalizedImageUrls.length > 0 ? normalizedImageUrls : void 0;
}
function toActivityRateCardPerson(user) {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    city: user.city,
    gender: user.gender,
    profile: "profile" in user ? user.profile : null
  };
}
function normalizeRateCardMode(value) {
  return value === "pair" ? "pair" : "individual";
}
function normalizeRateCardDirection(value) {
  return value === "received" || value === "mutual" || value === "met" ? value : "given";
}

// src/app/shared/ui/converters/activity-rate-menu.converter.ts
var ACTIVITY_RATE_MENU_RATING_ITEM_ID = "rating";
var ActivityRateMenuConverter = class {
  static convert(subject) {
    if (!subject) {
      return [];
    }
    const _a = subject.ratingBarConfig, { value: _configuredValue } = _a, rateConfig = __objRest(_a, ["value"]);
    return [{
      id: ACTIVITY_RATE_MENU_RATING_ITEM_ID,
      kind: "rate",
      closeOnSelect: true,
      value: subject.value,
      rateConfig,
      context: {
        menu: "activity-rate-card",
        subject
      }
    }];
  }
};
var ActivityRateMenuSelectionConverter = class {
  static convert(event) {
    const context = this.contextFromEvent(event);
    if (!context || event.id !== ACTIVITY_RATE_MENU_RATING_ITEM_ID) {
      return null;
    }
    const value = Number(event.value);
    if (!Number.isFinite(value)) {
      return null;
    }
    return {
      rowId: context.subject.id,
      value
    };
  }
  static contextFromEvent(event) {
    const context = event.context;
    return context?.menu === "activity-rate-card" && context.subject?.menu === "activity-rate-card" ? context : null;
  }
};

export {
  HelpCenterRevisionDocumentViewerConfigConverter,
  AssetTicketInfoCardConverter,
  AssetAvailabilitySingleRowConverter,
  ActivityChatSingleRowConverter,
  ChatPopupHeaderContextConverter,
  EventPolicySingleRowConverter,
  ActivityMemberImageCardConverter,
  ActivityEventInfoCardConverter,
  EventExploreInfoCardConverter,
  ActivityEventInfoCardMenuConverter,
  ActivitySubEventResourceInfoCardConverter,
  ActivityRateImageCardConverter,
  isActivityRatePairCardRow,
  ActivityRateSingleCardConverter,
  ActivityRatePairCardConverter,
  ActivityRateMenuConverter,
  ActivityRateMenuSelectionConverter,
  EventFeedbackDetailConverter,
  EventFeedbackFormFlowConverter,
  EventSubeventRuntimeMenuConverter,
  EventSubeventRuntimeInfoCardConverter,
  EventSubeventsSlotConverter,
  EventSubeventsListContextMenuConverter,
  EventTournamentGroupsPopupConverter,
  formFlowCompletionPercent,
  formFlowMissingRequiredControls,
  formFlowIsControlMissingRequired,
  ProfileFormFlowDataConverter,
  ProfileFormFlowConverter,
  ProfileHeaderCardConverter,
  EventFeedbackOrganizerInfoCardConverter,
  EventFeedbackInfoCardConverter,
  EventFeedbackFilterMenuConverter,
  EventFeedbackListPresentationConverter,
  EventFeedbackOrganizerItemConverter,
  EventFeedbackOrganizerCarouselSectionConverter,
  EventFeedbackOrganizerMessageGroupConverter
};
//# sourceMappingURL=chunk-52WP4I47.js.map
