import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/converters/chat-popup-header-context.converter.ts
var ChatPopupHeaderContextConverter = class {
  static memberSummaries(sources) {
    const seenUserIds = /* @__PURE__ */ new Set();
    return sources.flatMap((source) => {
      const id = `${source.id ?? ""}`.trim();
      if (!id || seenUserIds.has(id)) {
        return [];
      }
      seenUserIds.add(id);
      const user = source.user?.id?.trim() === id ? source.user : null;
      const name = `${user?.name ?? source.fallbackName ?? ""}`.trim() || "User";
      return [{
        id,
        name,
        initials: `${user?.initials ?? ""}`.trim() || AppUtils.initialsFromText(name),
        gender: user?.profileStatus === "deleted" ? "deleted" : user?.gender === "woman" ? "woman" : "man",
        imageUrl: AppUtils.firstImageUrl(user?.images) || `${source.imageUrl ?? ""}`.trim() || null
      }];
    });
  }
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

export {
  ChatPopupHeaderContextConverter
};
//# sourceMappingURL=chunk-RFTK2A34.js.map
