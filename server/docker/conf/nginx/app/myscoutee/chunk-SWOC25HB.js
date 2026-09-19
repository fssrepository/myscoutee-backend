import {
  AdminMenuStore
} from "./chunk-EEP5RO7H.js";
import {
  AppRuntimeStore,
  USER_BY_ID_LOAD_CONTEXT_KEY
} from "./chunk-RP5GBSNO.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-IEWB22H3.js";
import {
  APP_STORAGE_KEYS
} from "./chunk-LDZENZ35.js";
import {
  HttpErrorResponse
} from "./chunk-DZ6OOOZN.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/context/stores/admin-workspace.store.ts
var ADMIN_SESSION_STORAGE_KEY = APP_STORAGE_KEYS.adminSession;
var AdminWorkspaceStore = class _AdminWorkspaceStore {
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityStore = inject(ActivityStore);
  adminMenuStore = inject(AdminMenuStore);
  dashboardRef = signal(null, ...ngDevMode ? [{ debugName: "dashboardRef" }] : (
    /* istanbul ignore next */
    []
  ));
  busyRef = signal(false, ...ngDevMode ? [{ debugName: "busyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  errorRef = signal("", ...ngDevMode ? [{ debugName: "errorRef" }] : (
    /* istanbul ignore next */
    []
  ));
  accessDeniedRef = signal(false, ...ngDevMode ? [{ debugName: "accessDeniedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  dashboard = this.dashboardRef.asReadonly();
  reviewCounts = computed(() => this.dashboardRef()?.reviewCounts ?? null, ...ngDevMode ? [{ debugName: "reviewCounts" }] : (
    /* istanbul ignore next */
    []
  ));
  menuReviewCounts = computed(() => {
    const counts = this.reviewCounts();
    return {
      reports: this.nonNegativeInteger(counts?.reportsUnresolved),
      feedback: this.nonNegativeInteger(counts?.feedbackUnresolved)
    };
  }, ...ngDevMode ? [{ debugName: "menuReviewCounts" }] : (
    /* istanbul ignore next */
    []
  ));
  busy = this.busyRef.asReadonly();
  error = this.errorRef.asReadonly();
  accessDenied = this.accessDeniedRef.asReadonly();
  setBusy(busy) {
    this.busyRef.set(busy);
  }
  setError(error) {
    this.errorRef.set(error);
  }
  clearError() {
    this.errorRef.set("");
  }
  setAccessDenied(accessDenied) {
    this.accessDeniedRef.set(accessDenied);
  }
  prepareSelectedAdminSession(adminUserId) {
    const normalizedAdminUserId = adminUserId.trim();
    if (normalizedAdminUserId) {
      this.persistAdminSession(normalizedAdminUserId);
    }
    return normalizedAdminUserId;
  }
  applyDashboard(dashboard) {
    const normalized = this.normalizeDashboard(dashboard);
    this.dashboardRef.set(normalized);
    this.activateAdminProfile(normalized);
    return normalized;
  }
  applyReportedUsers(users) {
    const normalized = users.map((user) => this.normalizeReportedUser(user));
    this.patchDashboard({ reportedUsers: normalized });
    return normalized;
  }
  applyBlockedUsers(users) {
    const normalized = users.map((user) => this.normalizeReportedUser(user, true));
    this.patchDashboard({ blockedUsers: normalized });
    return normalized;
  }
  applyFeedback(feedback) {
    const normalized = feedback.map((item) => this.normalizeFeedback(item));
    this.patchDashboard({ feedback: normalized });
    return normalized;
  }
  applyAdminMenuCounters(adminUserId, counters) {
    const normalizedAdminUserId = `${adminUserId ?? ""}`.trim();
    if (!normalizedAdminUserId) {
      return;
    }
    this.activityStore.patchUserCounterOverrides(normalizedAdminUserId, counters);
    const currentUser = this.userProfileStore.getUserProfile(normalizedAdminUserId);
    if (!currentUser) {
      return;
    }
    this.userProfileStore.setUserProfile(__spreadProps(__spreadValues({}, currentUser), {
      activities: __spreadProps(__spreadValues({}, currentUser.activities), {
        adminJobs: counters.adminJobs,
        adminMetrics: counters.adminMetrics
      })
    }));
  }
  patchModerationUser(patch) {
    const dashboard = this.dashboardRef();
    const normalizedUserId = `${patch?.userId ?? ""}`.trim();
    if (!dashboard || !normalizedUserId) {
      return null;
    }
    const currentUser = dashboard.reportedUsers.find((user) => user.userId === normalizedUserId) ?? dashboard.blockedUsers.find((user) => user.userId === normalizedUserId) ?? null;
    if (!currentUser) {
      return null;
    }
    const patchedUser = this.normalizeReportedUser(__spreadProps(__spreadValues({}, currentUser), {
      profileStatus: patch?.profileStatus ?? currentUser.profileStatus,
      blockedAtIso: patch?.blockedAtIso !== void 0 ? patch.blockedAtIso : currentUser.blockedAtIso,
      hasSupportChat: patch?.hasSupportChat !== void 0 ? patch.hasSupportChat : currentUser.hasSupportChat,
      supportChatUnread: patch?.supportChatUnread !== void 0 ? patch.supportChatUnread : currentUser.supportChatUnread,
      supportChatId: patch?.supportChatId !== void 0 ? patch.supportChatId : currentUser.supportChatId
    }));
    const reportedUsers = dashboard.reportedUsers.map((user) => user.userId === normalizedUserId ? patchedUser : user);
    let blockedUsers = dashboard.blockedUsers.map((user) => user.userId === normalizedUserId ? patchedUser : user);
    if (patchedUser.profileStatus === "blocked") {
      if (!blockedUsers.some((user) => user.userId === normalizedUserId)) {
        blockedUsers = this.sortReportedUsersByDate([...blockedUsers, patchedUser]);
      }
    } else {
      blockedUsers = blockedUsers.filter((user) => user.userId !== normalizedUserId);
    }
    const nextDashboard = __spreadProps(__spreadValues({}, dashboard), {
      reportedUsers,
      blockedUsers
    });
    this.dashboardRef.set(nextDashboard);
    this.activateAdminProfile(nextDashboard);
    return patchedUser;
  }
  clearAdminSessionState() {
    this.dashboardRef.set(null);
    this.adminMenuStore.clear();
    this.accessDeniedRef.set(false);
    this.userProfileStore.setActiveUserId("");
    this.clearStoredAdminSession();
  }
  handleAdminAccessDeniedState(sessionUserId = "") {
    this.dashboardRef.set(null);
    this.adminMenuStore.clear();
    this.accessDeniedRef.set(true);
    this.errorRef.set("This account does not have admin access.");
    this.clearStoredAdminSession();
    this.userProfileStore.setActiveUserId(sessionUserId.trim());
  }
  currentAdminUserId() {
    return this.dashboardRef()?.activeAdmin.id ?? this.readStoredAdminId() ?? void 0;
  }
  persistAdminSession(adminUserId) {
    if (typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify({ adminUserId }));
  }
  readStoredAdminId() {
    if (typeof localStorage === "undefined") {
      return "";
    }
    const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) {
      return "";
    }
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed.adminUserId === "string" ? parsed.adminUserId.trim() : "";
    } catch {
      return "";
    }
  }
  clearStoredAdminSession() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
  }
  adminErrorMessage(error) {
    if (this.isAdminAccessDenied(error)) {
      return "This account does not have admin access.";
    }
    if (error instanceof HttpErrorResponse && typeof error.error?.message === "string" && error.error.message.trim()) {
      return error.error.message.trim();
    }
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return "Admin workspace is unavailable.";
  }
  isAdminAccessDenied(error) {
    return error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403);
  }
  normalizeDashboard(dashboard) {
    return {
      activeAdmin: __spreadProps(__spreadValues({}, dashboard.activeAdmin), {
        headline: `${dashboard.activeAdmin.headline ?? ""}`.trim() || null,
        about: `${dashboard.activeAdmin.about ?? ""}`.trim() || null,
        images: [...dashboard.activeAdmin.images ?? []]
      }),
      activeAdminProfile: dashboard.activeAdminProfile ? __spreadProps(__spreadValues({}, dashboard.activeAdminProfile), {
        headline: `${dashboard.activeAdminProfile.headline ?? ""}`.trim(),
        about: `${dashboard.activeAdminProfile.about ?? ""}`.trim(),
        images: [...dashboard.activeAdminProfile.images ?? []]
      }) : null,
      reportedUsers: (dashboard.reportedUsers ?? []).map((user) => this.normalizeReportedUser(user)),
      blockedUsers: (dashboard.blockedUsers ?? []).map((user) => this.normalizeReportedUser(user, true)),
      feedback: (dashboard.feedback ?? []).map((item) => this.normalizeFeedback(item)),
      reviewCounts: dashboard.reviewCounts ? {
        reportsUnresolved: this.nonNegativeInteger(dashboard.reviewCounts.reportsUnresolved),
        reportsResolved: this.nonNegativeInteger(dashboard.reviewCounts.reportsResolved),
        feedbackUnresolved: this.nonNegativeInteger(dashboard.reviewCounts.feedbackUnresolved),
        feedbackResolved: this.nonNegativeInteger(dashboard.reviewCounts.feedbackResolved)
      } : null
    };
  }
  patchDashboard(patch) {
    const dashboard = this.dashboardRef();
    if (!dashboard) {
      return;
    }
    const nextDashboard = __spreadValues(__spreadValues({}, dashboard), patch);
    this.dashboardRef.set(nextDashboard);
    this.activateAdminProfile(nextDashboard);
  }
  normalizeFeedback(item) {
    return __spreadProps(__spreadValues({}, item), {
      userImageUrl: `${item.userImageUrl ?? ""}`.trim() || null
    });
  }
  nonNegativeInteger(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  normalizeReportedUser(user, blockedFallback = false) {
    return __spreadProps(__spreadValues({}, user), {
      imageUrl: `${user.imageUrl ?? ""}`.trim() || null,
      blockedAtIso: `${user.blockedAtIso ?? (blockedFallback ? user.lastReportedAtIso : "") ?? ""}`.trim() || null,
      hasSupportChat: user.hasSupportChat === true,
      supportChatUnread: Math.max(0, Math.trunc(Number(user.supportChatUnread) || 0)),
      supportChatId: `${user.supportChatId ?? ""}`.trim() || null,
      reports: (user.reports ?? []).map((report) => __spreadProps(__spreadValues({}, report), {
        reporterImageUrl: `${report.reporterImageUrl ?? ""}`.trim() || null,
        chatMessages: [...report.chatMessages ?? []]
      }))
    });
  }
  sortReportedUsersByDate(users) {
    return [...users].sort((first, second) => Date.parse(`${second.lastReportedAtIso ?? second.blockedAtIso ?? ""}`) - Date.parse(`${first.lastReportedAtIso ?? first.blockedAtIso ?? ""}`));
  }
  activateAdminProfile(dashboard) {
    const admin = dashboard.activeAdmin;
    const user = this.buildAdminProfile(admin, dashboard);
    this.userProfileStore.setProfileExt(this.buildAdminProfileExt(user));
    this.userProfileStore.setActiveUserId(user.id);
    this.runtimeStore.setStatus(USER_BY_ID_LOAD_CONTEXT_KEY, "success");
    this.activityStore.patchUserCounterOverrides(user.id, {
      game: dashboard.reportedUsers.reduce((total, item) => total + item.reportCount, 0),
      chats: user.activities.chats,
      chat: {
        all: this.nonNegativeInteger(user.activities.chat?.all ?? user.activities.chats),
        event: this.nonNegativeInteger(user.activities.chat?.event),
        subEvent: this.nonNegativeInteger(user.activities.chat?.subEvent),
        group: this.nonNegativeInteger(user.activities.chat?.group),
        service: this.nonNegativeInteger(user.activities.chat?.service),
        appSupport: this.nonNegativeInteger(user.activities.chat?.appSupport),
        supportCases: {
          pending: this.nonNegativeInteger(user.activities.chat?.supportCases?.pending),
          warned: this.nonNegativeInteger(user.activities.chat?.supportCases?.warned),
          picked: this.nonNegativeInteger(user.activities.chat?.supportCases?.picked),
          solved: this.nonNegativeInteger(user.activities.chat?.supportCases?.solved),
          blocked: this.nonNegativeInteger(user.activities.chat?.supportCases?.blocked),
          all: this.nonNegativeInteger(user.activities.chat?.supportCases?.all)
        }
      },
      events: dashboard.reportedUsers.length,
      hosting: 0,
      invitations: 0,
      tickets: 0,
      feedback: dashboard.feedback.length,
      adminJobs: user.activities.adminJobs ?? 0,
      adminMetrics: user.activities.adminMetrics ?? 0
    });
  }
  buildAdminProfile(admin, dashboard) {
    const existingAdminProfile = this.userProfileStore.getUserProfile(admin.id) ?? dashboard.activeAdminProfile ?? null;
    const name = `${existingAdminProfile?.name ?? admin.name}`.trim() || admin.name;
    const initials = `${existingAdminProfile?.initials ?? admin.initials}`.trim() || this.initialsFromName(name, admin.initials);
    const headline = `${existingAdminProfile?.headline ?? admin.headline ?? ""}`.trim() || "Moderation workspace";
    const about = `${existingAdminProfile?.about ?? admin.about ?? ""}`.trim() || "Reviews reports, feedback, and support chats.";
    const images = (existingAdminProfile?.images?.length ? existingAdminProfile.images : admin.images ?? []).map((image) => `${image ?? ""}`.trim()).filter((image) => image.length > 0);
    return {
      id: admin.id,
      name,
      age: 0,
      birthday: "",
      city: "Admin",
      height: "",
      physique: "",
      languages: ["English"],
      horoscope: "",
      initials,
      gender: admin.id.includes("noel") ? "man" : "woman",
      statusText: "Admin workspace",
      hostTier: "Admin",
      traitLabel: "Safety",
      completion: 100,
      headline,
      about,
      images,
      profileStatus: "public",
      admin: true,
      activities: {
        game: dashboard.reportedUsers.reduce((total, item) => total + item.reportCount, 0),
        chats: Math.max(0, Math.trunc(Number(existingAdminProfile?.activities?.chats) || 0)),
        chat: existingAdminProfile?.activities?.chat ? __spreadValues({}, existingAdminProfile.activities.chat) : {
          all: 0,
          event: 0,
          subEvent: 0,
          group: 0,
          service: 0,
          appSupport: 0
        },
        invitations: 0,
        events: dashboard.reportedUsers.length,
        hosting: 0,
        cars: 0,
        accommodation: 0,
        supplies: 0,
        tickets: 0,
        contacts: 0,
        feedback: dashboard.feedback.length,
        adminJobs: Math.max(0, Math.trunc(Number(existingAdminProfile?.activities?.adminJobs) || 0)),
        adminMetrics: Math.max(0, Math.trunc(Number(existingAdminProfile?.activities?.adminMetrics) || 0))
      }
    };
  }
  buildAdminProfileExt(user) {
    return {
      profile: user,
      experienceEntries: this.userProfileStore.getProfileExt(user.id)?.experienceEntries ?? []
    };
  }
  initialsFromName(name, fallback) {
    const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
    return initials || fallback;
  }
  static \u0275fac = function AdminWorkspaceStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminWorkspaceStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminWorkspaceStore, factory: _AdminWorkspaceStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminWorkspaceStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AdminWorkspaceStore
};
//# sourceMappingURL=chunk-SWOC25HB.js.map
