import {
  HttpAdminWorkspaceService,
  HttpEventsService,
  LocalAdminModerationRepository,
  LocalAdminModerationService,
  LocalAdminSupportSessionService,
  LocalEventsService,
  LocalRouteDelayService,
  LocalShareTokensRepository,
  UsersService
} from "./chunk-GEAUBJJD.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import {
  BaseRouteModeService
} from "./chunk-7MTG4XZU.js";
import {
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import {
  isFirebaseLoginEnabled
} from "./chunk-2ENBQWLU.js";
import {
  HttpClient,
  HttpParams
} from "./chunk-D6ZHKNYF.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  environment,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/local/source/services/share-tokens.service.ts
var LocalShareTokensService = class _LocalShareTokensService {
  repository = inject(LocalShareTokensRepository);
  async createToken(request) {
    const token = this.repository.createToken(request);
    if (token) {
      await this.repository.flushToIndexedDb();
    }
    return token;
  }
  resolveToken(token, userId) {
    return Promise.resolve(this.repository.resolveToken(token, userId));
  }
  static \u0275fac = function LocalShareTokensService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocalShareTokensService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LocalShareTokensService, factory: _LocalShareTokensService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalShareTokensService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/http/services/share-tokens.service.ts
var HttpShareTokensService = class _HttpShareTokensService {
  http = inject(HttpClient);
  apiBaseUrl = environment.apiBaseUrl ?? "/api";
  async createToken(request) {
    const response = await this.http.post(`${this.apiBaseUrl}/share-tokens`, request).toPromise();
    return `${response?.token ?? ""}`.trim();
  }
  async resolveToken(token, userId) {
    const normalizedToken = `${token ?? ""}`.trim();
    if (!normalizedToken) {
      return null;
    }
    return await this.http.get(`${this.apiBaseUrl}/share-tokens/resolve`, {
      params: new HttpParams().set("token", normalizedToken).set("userId", `${userId ?? ""}`.trim())
    }).toPromise() ?? null;
  }
  static \u0275fac = function HttpShareTokensService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HttpShareTokensService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpShareTokensService, factory: _HttpShareTokensService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HttpShareTokensService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/share-tokens.service.ts
var ShareTokensService = class _ShareTokensService extends BaseRouteModeService {
  localShareTokensService = inject(LocalShareTokensService);
  httpShareTokensService = inject(HttpShareTokensService);
  get shareTokensService() {
    return this.resolveRouteService("/share-tokens", this.localShareTokensService, this.httpShareTokensService);
  }
  createToken(request) {
    return this.shareTokensService.createToken(request);
  }
  resolveToken(token, userId) {
    return this.shareTokensService.resolveToken(token, userId);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ShareTokensService_BaseFactory;
    return function ShareTokensService_Factory(__ngFactoryType__) {
      return (\u0275ShareTokensService_BaseFactory || (\u0275ShareTokensService_BaseFactory = \u0275\u0275getInheritedFactory(_ShareTokensService)))(__ngFactoryType__ || _ShareTokensService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ShareTokensService, factory: _ShareTokensService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShareTokensService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/source/services/admin-workspace.service.ts
var ADMIN_WORKSPACE_LOAD_ROUTE = "/admin";
var ADMIN_REPORTS_LOAD_ROUTE = "/admin/reports";
var ADMIN_BLOCKED_USERS_LOAD_ROUTE = "/admin/reports/blocked-users";
var ADMIN_FEEDBACK_LOAD_ROUTE = "/admin/feedback";
var ADMIN_REPORTS_RESOLVE_ROUTE = "/admin/reports/resolve";
var ADMIN_FEEDBACK_RESOLVE_ROUTE = "/admin/feedback/resolve";
var LocalAdminWorkspaceService = class _LocalAdminWorkspaceService extends LocalRouteDelayService {
  moderationRepository = inject(LocalAdminModerationRepository);
  moderationService = inject(LocalAdminModerationService);
  supportSession = inject(LocalAdminSupportSessionService);
  async loadDashboard(adminUserId, filters = {}) {
    return await this.loadDashboardSlice(adminUserId, ADMIN_WORKSPACE_LOAD_ROUTE, (dashboard) => __spreadProps(__spreadValues({}, dashboard), {
      reportedUsers: this.filterReportedUsers(dashboard.reportedUsers, filters.reportsStatus),
      feedback: this.filterFeedback(dashboard.feedback, filters.feedbackStatus)
    }));
  }
  async loadReportedUsers(adminUserId, status) {
    return await this.loadDashboardSlice(adminUserId, ADMIN_REPORTS_LOAD_ROUTE, (dashboard) => this.filterReportedUsers(dashboard.reportedUsers, status));
  }
  async loadBlockedUsers(adminUserId) {
    return await this.loadDashboardSlice(adminUserId, ADMIN_BLOCKED_USERS_LOAD_ROUTE, (dashboard) => dashboard.blockedUsers);
  }
  async loadFeedback(adminUserId, status) {
    return await this.loadDashboardSlice(adminUserId, ADMIN_FEEDBACK_LOAD_ROUTE, (dashboard) => this.filterFeedback(dashboard.feedback, status));
  }
  async setReportResolved(reportId, resolved, adminUserId) {
    await this.waitForRouteDelay(ADMIN_REPORTS_RESOLVE_ROUTE);
    await this.moderationRepository.whenReady();
    const admin = this.mergeStoredAdminProfile(this.resolveDemoAdmin(adminUserId));
    const normalizedReportId = `${reportId ?? ""}`.trim();
    const storeBefore = await this.moderationRepository.readStore();
    const reportBefore = storeBefore?.reports?.find((report2) => report2.id === normalizedReportId) ?? null;
    const wasResolved = this.isReviewResolved(reportBefore);
    const store = await this.moderationRepository.setReportResolved(normalizedReportId, admin.id, resolved ? (/* @__PURE__ */ new Date()).toISOString() : null);
    const report = store?.reports?.find((item) => item.id === normalizedReportId) ?? null;
    if (resolved && !wasResolved && report?.reporterUserId) {
      await this.moderationService.sendSupportMessage(report.reporterUserId, admin, this.reportResolvedMessage(report), "solved");
    }
    return store ? this.buildDemoDashboard(admin, store) : await this.readDashboard(admin.id);
  }
  async setFeedbackResolved(feedbackId, resolved, adminUserId) {
    await this.waitForRouteDelay(ADMIN_FEEDBACK_RESOLVE_ROUTE);
    await this.moderationRepository.whenReady();
    const admin = this.mergeStoredAdminProfile(this.resolveDemoAdmin(adminUserId));
    const normalizedFeedbackId = `${feedbackId ?? ""}`.trim();
    const storeBefore = await this.moderationRepository.readStore();
    const feedbackBefore = storeBefore?.feedback?.find((item) => item.id === normalizedFeedbackId) ?? null;
    const wasResolved = this.isReviewResolved(feedbackBefore);
    const store = await this.moderationRepository.setFeedbackResolved(normalizedFeedbackId, admin.id, resolved ? (/* @__PURE__ */ new Date()).toISOString() : null);
    const feedback = store?.feedback?.find((item) => item.id === normalizedFeedbackId) ?? null;
    if (resolved && !wasResolved && feedback?.userId) {
      await this.moderationService.sendSupportMessage(feedback.userId, admin, this.feedbackResolvedMessage(feedback), "solved");
    }
    return store ? this.buildDemoDashboard(admin, store) : await this.readDashboard(admin.id);
  }
  async loadDashboardSlice(adminUserId, route, select) {
    const read = this.readDashboard(adminUserId).then(select);
    const delay = this.waitForRouteDelay(route);
    try {
      const [value] = await Promise.all([read, delay]);
      return value;
    } catch (error) {
      await delay.catch(() => void 0);
      throw error;
    }
  }
  resolveDemoAdmin(adminUserId) {
    const id = `${adminUserId ?? ""}`.trim();
    if (id === "admin-demo-noel") {
      return {
        id: "admin-demo-noel",
        name: "Noel Safety",
        initials: "NS",
        email: "admin2@myscoutee.local",
        images: this.demoAdminImages("admin-demo-noel")
      };
    }
    return {
      id: "admin-demo-ava",
      name: "Ava",
      initials: "AM",
      email: "admin1@myscoutee.local",
      images: this.demoAdminImages("admin-demo-ava")
    };
  }
  async readDashboard(adminUserId) {
    await this.moderationRepository.whenReady();
    const store = await this.moderationRepository.readStore();
    if (!store?.reports?.length && !store?.feedback?.length) {
      throw new Error("Demo admin workspace is not bootstrapped.");
    }
    return this.buildDemoDashboard(this.resolveDemoAdmin(adminUserId), store);
  }
  buildDemoDashboard(admin, store) {
    const activeAdmin = this.mergeStoredAdminProfile(admin);
    const reportsByUser = /* @__PURE__ */ new Map();
    for (const report of store.reports) {
      const key = report.targetUserId.trim();
      if (!key) {
        continue;
      }
      reportsByUser.set(key, [...reportsByUser.get(key) ?? [], this.enrichDemoReport(report)]);
    }
    const reportedUsers = [...reportsByUser.entries()].map(([userId, reports]) => {
      const user = this.supportSession.findUser(userId);
      const sortedReports = [...reports].sort((first, second) => Date.parse(second.createdDate) - Date.parse(first.createdDate));
      return {
        userId,
        name: user?.name ?? "Reported user",
        initials: user?.initials ?? "??",
        gender: user?.gender ?? "woman",
        city: user?.city ?? "",
        imageUrl: this.firstUserImage(user),
        profileStatus: user?.profileStatus ?? "public",
        reportCount: sortedReports.length,
        lastReportedAtIso: sortedReports[0]?.createdDate ?? null,
        blockedAtIso: user?.profileStatus === "blocked" ? sortedReports[0]?.createdDate ?? store.seededAtIso : null,
        hasSupportChat: this.demoSupportChatExists(activeAdmin.id, userId),
        supportChatUnread: this.demoSupportChatUnread(activeAdmin.id, userId),
        reports: sortedReports
      };
    }).sort((first, second) => Date.parse(`${second.lastReportedAtIso ?? ""}`) - Date.parse(`${first.lastReportedAtIso ?? ""}`));
    return {
      activeAdmin,
      activeAdminProfile: this.supportSession.findUser(activeAdmin.id),
      reportedUsers,
      blockedUsers: this.demoBlockedUsers(store, reportsByUser, activeAdmin.id),
      feedback: [...store.feedback].sort((first, second) => Date.parse(second.createdDate) - Date.parse(first.createdDate)).map((item) => this.enrichDemoFeedback(item)),
      reviewCounts: this.demoReviewCounts(store)
    };
  }
  demoBlockedUsers(store, reportsByUser, adminId) {
    const reportedBlocked = [...reportsByUser.keys()].map((userId) => this.supportSession.findUser(userId)).filter((user) => user?.profileStatus === "blocked");
    return reportedBlocked.map((user) => {
      const reports = [...reportsByUser.get(user.id) ?? []].sort((first, second) => Date.parse(second.createdDate) - Date.parse(first.createdDate));
      return {
        userId: user.id,
        name: user.name,
        initials: user.initials,
        gender: user.gender,
        city: user.city,
        imageUrl: this.firstUserImage(user),
        profileStatus: user.profileStatus,
        reportCount: reports.length,
        lastReportedAtIso: reports[0]?.createdDate ?? store.seededAtIso,
        blockedAtIso: reports[0]?.createdDate ?? store.seededAtIso,
        hasSupportChat: this.demoSupportChatExists(adminId, user.id),
        supportChatUnread: this.demoSupportChatUnread(adminId, user.id),
        reports
      };
    }).sort((first, second) => Date.parse(`${second.lastReportedAtIso ?? ""}`) - Date.parse(`${first.lastReportedAtIso ?? ""}`));
  }
  enrichDemoFeedback(feedback) {
    const user = this.supportSession.findUser(feedback.userId);
    return __spreadProps(__spreadValues({}, feedback), {
      userName: user?.name ?? feedback.userName,
      userImageUrl: this.firstUserImage(user) ?? feedback.userImageUrl ?? null
    });
  }
  enrichDemoReport(report) {
    const reporter = this.supportSession.findUser(report.reporterUserId);
    if (report.chatId && (!report.chatMessages || report.chatMessages.length === 0)) {
      return __spreadProps(__spreadValues({}, report), {
        reporterImageUrl: this.firstUserImage(reporter) ?? report.reporterImageUrl ?? null,
        chatMessages: this.demoChatMessages(report.reporterUserId, report.chatId)
      });
    }
    return __spreadProps(__spreadValues({}, report), {
      reporterImageUrl: this.firstUserImage(reporter) ?? report.reporterImageUrl ?? null,
      chatMessages: [...report.chatMessages ?? []]
    });
  }
  demoChatMessages(ownerUserId, chatId) {
    const chat = this.supportSession.findChatById(ownerUserId, chatId);
    if (!chat) {
      return [];
    }
    return this.supportSession.readChatMessagesPage(chat).map((message) => ({
      id: message.id,
      sender: message.sender,
      senderUserId: message.senderAvatar.id,
      senderInitials: message.senderAvatar.initials,
      senderGender: message.senderAvatar.gender,
      text: message.text,
      time: message.time,
      sentAtIso: message.sentAtIso
    }));
  }
  demoSupportChatExists(adminId, userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    const normalizedAdminId = `${adminId ?? ""}`.trim();
    if (!normalizedUserId || !normalizedAdminId) {
      return false;
    }
    return Boolean(this.supportSession.findChatById(normalizedAdminId, `c-support-admin-${normalizedUserId}`));
  }
  demoSupportChatUnread(adminId, userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    const normalizedAdminId = `${adminId ?? ""}`.trim();
    if (!normalizedUserId || !normalizedAdminId) {
      return 0;
    }
    const chat = this.supportSession.findChatById(normalizedAdminId, `c-support-admin-${normalizedUserId}`);
    return Math.max(0, Math.trunc(Number(chat?.unread) || 0));
  }
  demoReviewCounts(store) {
    return {
      reportsUnresolved: (store.reports ?? []).filter((report) => !this.isReviewResolved(report)).length,
      reportsResolved: (store.reports ?? []).filter((report) => this.isReviewResolved(report)).length,
      feedbackUnresolved: (store.feedback ?? []).filter((item) => !this.isReviewResolved(item)).length,
      feedbackResolved: (store.feedback ?? []).filter((item) => this.isReviewResolved(item)).length
    };
  }
  filterReportedUsers(users, status) {
    if (!status) {
      return [...users];
    }
    return users.map((user) => {
      const reports = user.reports.filter((report) => this.matchesReviewStatus(report, status));
      return __spreadProps(__spreadValues({}, user), {
        reportCount: reports.length,
        lastReportedAtIso: reports[0]?.createdDate ?? null,
        reports
      });
    }).filter((user) => user.reports.length > 0);
  }
  filterFeedback(feedback, status) {
    return status ? feedback.filter((item) => this.matchesReviewStatus(item, status)) : [...feedback];
  }
  matchesReviewStatus(item, status) {
    const resolved = this.isReviewResolved(item);
    return status === "resolved" ? resolved : !resolved;
  }
  isReviewResolved(item) {
    return `${item?.resolvedAtIso ?? ""}`.trim().length > 0;
  }
  reportResolvedMessage(report) {
    const subject = `${report.handle ?? ""}`.trim();
    return subject ? `Your report about ${subject} has been reviewed by MyScoutee moderation. Thank you for helping keep MyScoutee safe.` : "Your report has been reviewed by MyScoutee moderation. Thank you for helping keep MyScoutee safe.";
  }
  feedbackResolvedMessage(feedback) {
    const subject = `${feedback.subject ?? ""}`.trim();
    return subject ? `Your feedback "${subject}" has been reviewed by MyScoutee. Thank you for helping improve the app.` : "Your feedback has been reviewed by MyScoutee. Thank you for helping improve the app.";
  }
  firstUserImage(user) {
    return user?.images?.find((image) => image.trim().length > 0) ?? null;
  }
  mergeStoredAdminProfile(admin) {
    const stored = this.supportSession.findUser(admin.id);
    if (!stored) {
      return admin;
    }
    const name = this.adminDisplayName(`${stored.name ?? ""}`.trim() || admin.name);
    return __spreadProps(__spreadValues({}, admin), {
      name,
      initials: `${stored.initials ?? ""}`.trim() || this.initialsFromName(name, admin.initials),
      headline: `${stored.headline ?? ""}`.trim() || admin.headline || null,
      about: `${stored.about ?? ""}`.trim() || admin.about || null,
      images: [...stored.images ?? admin.images ?? []]
    });
  }
  demoAdminImages(adminUserId) {
    return adminUserId.includes("noel") ? ["https://randomuser.me/api/portraits/men/75.jpg"] : ["https://randomuser.me/api/portraits/women/65.jpg"];
  }
  adminDisplayName(name) {
    return `${name ?? ""}`.trim().replace(/\s+Moderation$/i, "") || "Admin";
  }
  initialsFromName(name, fallback) {
    const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
    return initials || fallback;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275LocalAdminWorkspaceService_BaseFactory;
    return function LocalAdminWorkspaceService_Factory(__ngFactoryType__) {
      return (\u0275LocalAdminWorkspaceService_BaseFactory || (\u0275LocalAdminWorkspaceService_BaseFactory = \u0275\u0275getInheritedFactory(_LocalAdminWorkspaceService)))(__ngFactoryType__ || _LocalAdminWorkspaceService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LocalAdminWorkspaceService, factory: _LocalAdminWorkspaceService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalAdminWorkspaceService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/admin-workspace-data.service.ts
var ADMIN_WORKSPACE_ROUTE = "/admin";
var ADMIN_REPORTS_ROUTE = "/admin/reports";
var ADMIN_BLOCKED_USERS_ROUTE = "/admin/reports/blocked-users";
var ADMIN_FEEDBACK_ROUTE = "/admin/feedback";
var AdminWorkspaceDataService = class _AdminWorkspaceDataService extends BaseRouteModeService {
  httpService = inject(HttpAdminWorkspaceService);
  localService = inject(LocalAdminWorkspaceService);
  shareTokens = inject(ShareTokensService);
  usersService = inject(UsersService);
  get isFirebaseAdminMode() {
    return isFirebaseLoginEnabled();
  }
  get shouldUseLocalAdminHelpSession() {
    return this.isLocalAdminWorkspace();
  }
  prepareSelectedAdminSession(adminUserId) {
    if (!this.isLocalAdminWorkspace() && this.sessionService.currentSession()?.kind !== "firebase") {
      this.sessionService.startDemoSession(adminUserId);
    }
  }
  async resolveAdminHelpToken(token) {
    try {
      return await this.shareTokens.resolveToken(token, "");
    } catch {
      return null;
    }
  }
  async loadDashboard(adminUserId, _onProgress) {
    return this.isLocalAdminWorkspace() ? await this.localService.loadDashboard(adminUserId) : await this.httpService.loadDashboard(adminUserId);
  }
  async loadReportedUsers(adminUserId, status) {
    const service = this.resolveRouteService(ADMIN_REPORTS_ROUTE, this.localService, this.httpService);
    return await service.loadReportedUsers(adminUserId, status);
  }
  async loadReportedUsersDashboard(adminUserId, status) {
    const service = this.resolveRouteService(ADMIN_REPORTS_ROUTE, this.localService, this.httpService);
    return await service.loadDashboard(adminUserId, { reportsStatus: status });
  }
  async loadBlockedUsers(adminUserId) {
    const service = this.resolveRouteService(ADMIN_BLOCKED_USERS_ROUTE, this.localService, this.httpService);
    return await service.loadBlockedUsers(adminUserId);
  }
  async loadFeedback(adminUserId, status) {
    const service = this.resolveRouteService(ADMIN_FEEDBACK_ROUTE, this.localService, this.httpService);
    return await service.loadFeedback(adminUserId, status);
  }
  async loadFeedbackDashboard(adminUserId, status) {
    const service = this.resolveRouteService(ADMIN_FEEDBACK_ROUTE, this.localService, this.httpService);
    return await service.loadDashboard(adminUserId, { feedbackStatus: status });
  }
  async setReportResolved(reportId, resolved, adminUserId) {
    const service = this.resolveRouteService(ADMIN_REPORTS_ROUTE, this.localService, this.httpService);
    return await service.setReportResolved(reportId, resolved, adminUserId);
  }
  async setFeedbackResolved(feedbackId, resolved, adminUserId) {
    const service = this.resolveRouteService(ADMIN_FEEDBACK_ROUTE, this.localService, this.httpService);
    return await service.setFeedbackResolved(feedbackId, resolved, adminUserId);
  }
  async loadDashboardMenuCounters(adminUserId) {
    if (this.isLocalAdminWorkspace()) {
      return null;
    }
    const normalizedAdminUserId = `${adminUserId ?? ""}`.trim();
    if (!normalizedAdminUserId) {
      return null;
    }
    const snapshot = await this.usersService.pollUserRealtimeSnapshot(normalizedAdminUserId, null);
    return {
      adminJobs: Math.max(0, Math.trunc(Number(snapshot?.counters?.adminJobs) || 0)),
      adminMetrics: Math.max(0, Math.trunc(Number(snapshot?.counters?.adminMetrics) || 0))
    };
  }
  isLocalAdminWorkspace() {
    return this.isLocalRouteEnabled(ADMIN_WORKSPACE_ROUTE);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AdminWorkspaceDataService_BaseFactory;
    return function AdminWorkspaceDataService_Factory(__ngFactoryType__) {
      return (\u0275AdminWorkspaceDataService_BaseFactory || (\u0275AdminWorkspaceDataService_BaseFactory = \u0275\u0275getInheritedFactory(_AdminWorkspaceDataService)))(__ngFactoryType__ || _AdminWorkspaceDataService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminWorkspaceDataService, factory: _AdminWorkspaceDataService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminWorkspaceDataService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/events.service.ts
var EventsService = class _EventsService extends BaseRouteModeService {
  localEventsService = inject(LocalEventsService);
  httpEventsService = inject(HttpEventsService);
  userProfileStore = inject(UserProfileStore);
  usersService = inject(UsersService);
  get localModeEnabled() {
    return this.isLocalRouteEnabled("/activities/events");
  }
  get eventsService() {
    return this.resolveRouteService("/activities/events", this.localEventsService, this.httpEventsService);
  }
  queryItemsByUser(userId) {
    return this.eventsService.queryItemsByUser(userId);
  }
  peekItemsByUser(userId) {
    return this.eventsService.peekItemsByUser(userId);
  }
  queryInvitationItemsByUser(userId) {
    return this.eventsService.queryInvitationItemsByUser(userId);
  }
  queryEventItemsByUser(userId) {
    return this.eventsService.queryEventItemsByUser(userId);
  }
  queryTrashedItemsByUser(userId) {
    return this.eventsService.queryTrashedItemsByUser(userId);
  }
  async queryActivitiesEventDTOPage(userId, query, signal) {
    if (this.isLocalRouteEnabled("/activities/events")) {
      return this.localEventsService.queryActivitiesEventDTOPage(userId, query, signal);
    }
    return this.httpEventsService.queryActivitiesEventDTOPage(userId, query, signal);
  }
  async loadActivityEvents(query, options = {}) {
    const activeUserId = this.resolveActiveUserId();
    const page = await this.queryActivitiesEventDTOPage(activeUserId, query, options.signal);
    if (this.isCalendarActivitiesView(query.view) && query.filters?.eventScopeFilter !== "trash") {
      const items = AppUtils.filterItemsByDateOnlyRange(page.items, query.rangeStart, query.rangeEnd, (item) => item.startAtIso, (item) => item.endAtIso);
      return {
        items,
        total: items.length,
        context: { eventCounters: page.eventCounters }
      };
    }
    return {
      items: page.items,
      total: page.total,
      nextCursor: page.nextCursor,
      context: { eventCounters: page.eventCounters }
    };
  }
  async saveActivityEvent(payload) {
    return this.eventsService.saveActivityEvent(payload);
  }
  queryExploreItems(userId) {
    return this.eventsService.queryExploreItems(userId);
  }
  peekExploreItems(userId) {
    return this.eventsService.peekExploreItems(userId);
  }
  async queryEventExplorePage(query) {
    if (this.isLocalRouteEnabled("/activities/events")) {
      return this.localEventsService.queryEventExplorePage(query);
    }
    return this.httpEventsService.queryEventExplorePage(query);
  }
  peekEventExplorePage(query) {
    if (this.isLocalRouteEnabled("/activities/events")) {
      return this.localEventsService.peekEventExplorePage(query);
    }
    return this.httpEventsService.peekEventExplorePage(query);
  }
  peekKnownItemById(userId, itemId) {
    const normalizedItemId = itemId.trim();
    if (!normalizedItemId) {
      return null;
    }
    return this.eventsService.peekKnownItemById(userId, normalizedItemId);
  }
  peekKnownRecordById(userId, itemId) {
    const normalizedItemId = itemId.trim();
    if (!normalizedItemId) {
      return null;
    }
    const known = [
      ...this.eventsService.peekItemsByUser(userId),
      ...this.eventsService.peekExploreItems(userId)
    ];
    return known.find((record) => record.id === normalizedItemId) ?? null;
  }
  async queryKnownRecordById(userId, itemId) {
    const normalizedItemId = itemId.trim();
    if (!normalizedItemId) {
      return null;
    }
    const cached = this.peekKnownRecordById(userId, normalizedItemId);
    if (cached) {
      return cached;
    }
    const [owned, explore] = await Promise.all([
      this.eventsService.queryItemsByUser(userId),
      this.eventsService.queryExploreItems(userId)
    ]);
    return [...owned, ...explore].find((record) => record.id === normalizedItemId) ?? null;
  }
  async loadEventDetailById(userId, eventId) {
    const normalizedUserId = userId.trim();
    const normalizedEventId = eventId.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadEventDetailById(normalizedUserId, normalizedEventId);
  }
  async loadInvitationContext(userId, eventId) {
    const normalizedUserId = userId.trim();
    const normalizedEventId = eventId.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadInvitationContext(normalizedUserId, normalizedEventId);
  }
  async loadSubEventsById(userId, eventId, query) {
    const normalizedUserId = userId.trim();
    const normalizedEventId = eventId.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadSubEventsById(normalizedUserId, normalizedEventId, query);
  }
  async loadCheckoutSlots(query) {
    const normalizedUserId = query.userId?.trim();
    const normalizedEventId = query.eventId?.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadCheckoutSlots(__spreadProps(__spreadValues({}, query), {
      userId: normalizedUserId,
      eventId: normalizedEventId
    }));
  }
  async loadCheckoutBasketByEvent(userId, sourceId) {
    const normalizedUserId = userId.trim();
    const normalizedSourceId = sourceId.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.loadCheckoutBasketByEvent(normalizedUserId, normalizedSourceId);
  }
  async loadCheckoutPaymentAudit(userId, sourceId, paymentSessionId) {
    const normalizedUserId = userId.trim();
    const normalizedSourceId = sourceId.trim();
    const normalizedPaymentSessionId = paymentSessionId.trim();
    if (!normalizedUserId || !normalizedSourceId || !normalizedPaymentSessionId) {
      return null;
    }
    return this.eventsService.loadCheckoutPaymentAudit(normalizedUserId, normalizedSourceId, normalizedPaymentSessionId);
  }
  async validateCheckoutPromoCode(request) {
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedSourceId) {
      return null;
    }
    return this.eventsService.validateCheckoutPromoCode({
      sourceId: normalizedSourceId,
      code: `${request.code ?? ""}`.trim().toUpperCase()
    });
  }
  async saveCheckoutBasket(request) {
    const normalizedUserId = request.userId?.trim();
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.saveCheckoutBasket(__spreadProps(__spreadValues({}, request), {
      userId: normalizedUserId,
      sourceId: normalizedSourceId
    }));
  }
  async updateCheckoutBasketState(request) {
    const normalizedUserId = request.userId?.trim();
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.updateCheckoutBasketState(__spreadProps(__spreadValues({}, request), {
      userId: normalizedUserId,
      sourceId: normalizedSourceId
    }));
  }
  async payEventCheckout(request) {
    const normalizedUserId = request.userId?.trim();
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.payEventCheckout(__spreadProps(__spreadValues({}, request), {
      userId: normalizedUserId,
      sourceId: normalizedSourceId
    }));
  }
  trashItem(userId, sourceId) {
    return this.eventsService.trashItem(userId, sourceId);
  }
  publishItem(userId, sourceId) {
    return this.eventsService.publishItem(userId, sourceId);
  }
  unpublishItem(userId, sourceId) {
    return this.eventsService.unpublishItem(userId, sourceId);
  }
  restoreItem(userId, sourceId) {
    return this.eventsService.restoreItem(userId, sourceId);
  }
  takeOverItem(userId, sourceId) {
    return this.eventsService.takeOverItem(userId, sourceId);
  }
  waitForEventMutationDelay() {
    return this.eventsService.waitForEventMutationDelay();
  }
  applyStageAction(request) {
    return this.eventsService.applyStageAction(request);
  }
  querySubEventLeaderboard(eventId, subEventId) {
    return this.eventsService.querySubEventLeaderboard(eventId, subEventId);
  }
  queryTournamentGroups(query) {
    return this.eventsService.queryTournamentGroups(query);
  }
  queryTournamentStageGroups(query) {
    return this.eventsService.queryTournamentStageGroups(query);
  }
  saveTournamentGroup(request) {
    return this.eventsService.saveTournamentGroup(request);
  }
  deleteTournamentGroup(request) {
    return this.eventsService.deleteTournamentGroup(request);
  }
  upsertSubEventLeaderboardEntry(request) {
    return this.eventsService.upsertSubEventLeaderboardEntry(request);
  }
  requestJoin(userId, sourceId, options = {}) {
    return this.eventsService.requestJoin(userId, sourceId, options);
  }
  leaveEvent(userId, sourceId, options = {}) {
    return this.eventsService.leaveEvent(userId, sourceId, options);
  }
  createCheckoutSession(request) {
    return this.eventsService.createCheckoutSession(request);
  }
  payCheckoutSession(request, paymentSessionId) {
    return this.eventsService.payCheckoutSession(request, paymentSessionId);
  }
  queryEventFeedbackStates(userId) {
    return this.eventsService.queryEventFeedbackStates(userId);
  }
  queryReceivedEventFeedback(userId) {
    return this.eventsService.queryReceivedEventFeedback(userId);
  }
  loadEventFeedbackPage(query) {
    return this.eventsService.loadEventFeedbackPage(query);
  }
  loadEventFeedbackStatById(query) {
    return this.eventsService.loadEventFeedbackStatById(query);
  }
  loadEventFeedback(query) {
    return this.eventsService.loadEventFeedback(query);
  }
  submitEventFeedback(userId, request) {
    return this.eventsService.submitEventFeedback(userId, request);
  }
  saveEventFeedbackNote(request) {
    return this.eventsService.saveEventFeedbackNote(request);
  }
  removeEventFeedbackEvent(userId, eventId) {
    return this.eventsService.removeEventFeedbackEvent(userId, eventId);
  }
  restoreEventFeedbackEvent(userId, eventId) {
    return this.eventsService.restoreEventFeedbackEvent(userId, eventId);
  }
  async syncEventSnapshot(payload) {
    return this.eventsService.syncEventSnapshot(payload);
  }
  resolveActiveUserId() {
    const activeUserProfileId = this.userProfileStore.activeUserProfile()?.id?.trim();
    if (activeUserProfileId) {
      return activeUserProfileId;
    }
    const activeUserId = this.userProfileStore.getActiveUserId().trim();
    if (activeUserId) {
      return activeUserId;
    }
    const session = this.sessionService.currentSession();
    if (session?.kind === "demo" && session.userId.trim().length > 0) {
      return session.userId.trim();
    }
    if (session?.kind === "firebase" && session.profile.id.trim().length > 0) {
      return session.profile.id.trim();
    }
    return this.usersService.peekCachedUsers()[0]?.id ?? "";
  }
  isCalendarActivitiesView(view) {
    return view === "week" || view === "month";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275EventsService_BaseFactory;
    return function EventsService_Factory(__ngFactoryType__) {
      return (\u0275EventsService_BaseFactory || (\u0275EventsService_BaseFactory = \u0275\u0275getInheritedFactory(_EventsService)))(__ngFactoryType__ || _EventsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventsService, factory: _EventsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ShareTokensService,
  AdminWorkspaceDataService,
  EventsService
};
//# sourceMappingURL=chunk-HUL5TV72.js.map
