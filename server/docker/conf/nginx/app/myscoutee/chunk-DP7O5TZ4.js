import {
  bootstrapProcessStep
} from "./chunk-OJADXSXP.js";
import {
  RouteDelayService,
  UserProfileStore
} from "./chunk-52XNNRXY.js";
import {
  OfflineCacheService,
  SessionService
} from "./chunk-SXVGSFEZ.js";
import {
  HttpClient,
  HttpErrorResponse
} from "./chunk-ZBAABSP3.js";
import {
  Injectable,
  __spreadValues,
  environment,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/core/http/services/users.service.ts
var HttpUsersService = class _HttpUsersService {
  static DEMO_USERS_ROUTE = "/auth/demo-users";
  static USER_BY_ID_ROUTE = "/auth/me";
  static USER_PROFILE_EXT_ROUTE = "/auth/me/profile-ext";
  static USER_FEEDBACK_ROUTE = "/auth/me/feedback";
  static USER_FILTER_PREFERENCES_ROUTE = "/auth/me/preferences";
  static USER_REPORT_USER_ROUTE = "/auth/me/report-user";
  static USER_LOGOUT_ROUTE = "/auth/me/logout";
  static USER_DELETE_ROUTE = "/auth/me/delete";
  static USER_REALTIME_LONG_POLL_ROUTE = "/auth/me/realtime/long-poll";
  http = inject(HttpClient);
  userProfileStore = inject(UserProfileStore);
  offlineCache = inject(OfflineCacheService);
  routeDelay = inject(RouteDelayService);
  sessionService = inject(SessionService);
  apiBaseUrl = environment.apiBaseUrl ?? "/api";
  async queryAvailableDemoUsers(selectorRole = "member") {
    const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.DEMO_USERS_ROUTE, this.http.get(`${this.apiBaseUrl}/auth/demo-users`, {
      params: {
        role: selectorRole
      }
    }).toPromise(), "Users request timeout.");
    if (!Array.isArray(response)) {
      return [];
    }
    return response.map((user) => this.toDemoUserListItem(user)).filter((user) => user !== null);
  }
  prepareUserSession(_userId, onProgress) {
    onProgress?.(bootstrapProcessStep("sessionReady"));
    return Promise.resolve();
  }
  peekCachedUsers() {
    return [];
  }
  peekCachedUserById(userId) {
    if (this.requiresServerProfileAuthority()) {
      return null;
    }
    const cached = this.offlineCache.readUser(userId.trim());
    return cached?.user ?? null;
  }
  async checkLocationEligibility(coordinates) {
    const hasCoordinates = !!coordinates && Number.isFinite(Number(coordinates.latitude)) && Number.isFinite(Number(coordinates.longitude));
    const response = await this.http.get(`${this.apiBaseUrl}/auth/eligibility`, {
      params: hasCoordinates ? {
        latitude: `${Number(coordinates?.latitude)}`,
        longitude: `${Number(coordinates?.longitude)}`
      } : {}
    }).toPromise();
    return {
      eligible: response?.eligible === true,
      partitionKey: typeof response?.partitionKey === "string" ? response.partitionKey : null,
      message: typeof response?.message === "string" ? response.message : null,
      securityGateEnabled: response?.securityGateEnabled === true,
      locationRequired: response?.locationRequired === true
    };
  }
  async queryUserById(userId, requestTimeoutMs) {
    const normalizedUserId = typeof userId === "string" ? userId.trim() : "";
    try {
      const me = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_BY_ID_ROUTE, this.http.get(`${this.apiBaseUrl}/auth/me`, {
        params: normalizedUserId ? { userId: normalizedUserId } : {}
      }).toPromise(), "User details request timeout.", requestTimeoutMs);
      if (!me) {
        if (this.requiresServerProfileAuthority()) {
          return { user: null };
        }
        return this.readUserByIdFallback(normalizedUserId) ?? { user: null };
      }
      return this.cacheUserResponse({
        user: me,
        filterCount: Number.isFinite(me.filterCount) ? Math.max(0, Math.trunc(Number(me.filterCount))) : void 0,
        filterPreferences: me.filterPreferences ?? null,
        counterOverrides: this.buildInitialMenuCounterOverrides(me, me.counterOverrides)
      });
    } catch (error) {
      const status = error?.status;
      if ([0, 502, 503, 504].includes(status ?? -1) || this.isTimeoutError(error, "User details request timeout.")) {
        const cached2 = this.offlineCache.readUser(normalizedUserId || this.sessionService.activeUserId());
        if (cached2)
          return cached2;
      }
      if (this.isTimeoutError(error, "User details request timeout.")) {
        throw error;
      }
      if (this.requiresServerProfileAuthority()) {
        throw error;
      }
      const cached = this.offlineCache.readUser(normalizedUserId);
      return cached ?? this.readUserByIdFallback(normalizedUserId) ?? { user: null };
    }
  }
  async loadProfileExtById(userId, requestTimeoutMs) {
    const normalizedUserId = typeof userId === "string" ? userId.trim() : "";
    try {
      const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_PROFILE_EXT_ROUTE, this.http.get(`${this.apiBaseUrl}${_HttpUsersService.USER_PROFILE_EXT_ROUTE}`, {
        params: normalizedUserId ? { userId: normalizedUserId } : {}
      }).toPromise(), "User profile request timeout.", requestTimeoutMs);
      const profileExt = response?.profileExt ?? null;
      if (!profileExt) {
        if (this.requiresServerProfileAuthority()) {
          return { profileExt: null };
        }
        const cached = this.readProfileExtByIdFallback(normalizedUserId);
        return cached ?? { profileExt: null };
      }
      return {
        profileExt,
        filterCount: Number.isFinite(response?.filterCount) ? Math.max(0, Math.trunc(Number(response?.filterCount))) : void 0,
        filterPreferences: response?.filterPreferences ?? null,
        counterOverrides: this.buildInitialMenuCounterOverrides(profileExt.profile, response?.counterOverrides ?? null)
      };
    } catch (error) {
      const status = error?.status;
      const cacheUserId = normalizedUserId || this.sessionService.activeUserId();
      if (([0, 502, 503, 504].includes(status ?? -1) || this.isTimeoutError(error, "User profile request timeout.")) && this.offlineCache.readUser(cacheUserId)?.user) {
        return this.readProfileExtByIdFallback(cacheUserId);
      }
      if (this.isTimeoutError(error, "User profile request timeout.")) {
        throw error;
      }
      if (this.requiresServerProfileAuthority()) {
        throw error;
      }
      return this.readProfileExtByIdFallback(normalizedUserId) ?? { profileExt: null };
    }
  }
  async queryUserRealtimeLongPoll(userId, cursor = null, requestTimeoutMs) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    try {
      const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_REALTIME_LONG_POLL_ROUTE, this.http.post(`${this.apiBaseUrl}${_HttpUsersService.USER_REALTIME_LONG_POLL_ROUTE}`, { userId: normalizedUserId, cursor }).toPromise(), "User realtime request timeout.", requestTimeoutMs);
      if (!response || !response.counters || !response.impressions) {
        return null;
      }
      return {
        userId: response.userId ?? normalizedUserId,
        profileStatus: response.profileStatus ?? null,
        notificationDevices: response.notificationDevices?.map((device) => ({
          deviceId: device.deviceId,
          notificationsEnabled: device.notificationsEnabled === true
        })),
        counters: response.counters,
        impressions: response.impressions,
        offlineTicketSnapshot: response.offlineTicketSnapshot ? {
          items: response.offlineTicketSnapshot.items.map((row) => __spreadValues({}, row)),
          total: Math.max(0, Math.trunc(Number(response.offlineTicketSnapshot.total) || 0))
        } : response.offlineTicketSnapshot,
        paymentTotals: response.paymentTotals ? {
          outgoing: __spreadValues({}, response.paymentTotals.outgoing ?? {}),
          incoming: __spreadValues({}, response.paymentTotals.incoming ?? {}),
          all: __spreadValues({}, response.paymentTotals.all ?? {})
        } : null,
        cursor: response.cursor,
        serverTsIso: response.serverTsIso
      };
    } catch (error) {
      if (this.isTimeoutError(error, "User realtime request timeout.")) {
        throw error;
      }
      return null;
    }
  }
  async saveUserFilterPreferences(userId, preferences) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    try {
      await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_FILTER_PREFERENCES_ROUTE, this.http.post(`${this.apiBaseUrl}/auth/me/filter-preferences`, {
        userId: normalizedUserId,
        filterPreferences: preferences
      }).toPromise());
    } catch {
    }
  }
  async saveUserProfile(user, requestTimeoutMs) {
    if (!user?.id?.trim()) {
      return null;
    }
    const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_BY_ID_ROUTE, this.http.post(`${this.apiBaseUrl}/auth/me/profile`, user).toPromise(), "Profile save request timeout.", requestTimeoutMs);
    if (!response) {
      return user;
    }
    return response;
  }
  async saveUserProfileExt(request, requestTimeoutMs) {
    if (!request?.profile?.id?.trim()) {
      return null;
    }
    const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_PROFILE_EXT_ROUTE, this.http.post(`${this.apiBaseUrl}${_HttpUsersService.USER_PROFILE_EXT_ROUTE}`, request).toPromise(), "Profile save request timeout.", requestTimeoutMs);
    if (!response) {
      return request.profile;
    }
    return response;
  }
  async submitUserFeedback(request, signal, requestTimeoutMs) {
    try {
      const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_FEEDBACK_ROUTE, this.postAbortable(`${this.apiBaseUrl}${_HttpUsersService.USER_FEEDBACK_ROUTE}`, request, signal), "Feedback request timeout.", requestTimeoutMs);
      if (!response) {
        return { submitted: true, message: null };
      }
      return {
        submitted: response.submitted !== false,
        message: typeof response.message === "string" ? response.message : null
      };
    } catch (error) {
      if (this.isAbortError(error)) {
        throw error;
      }
      if (this.isTimeoutError(error, "Feedback request timeout.")) {
        throw error;
      }
      return {
        submitted: false,
        message: "Unable to send feedback."
      };
    }
  }
  async submitReportUser(request, signal, requestTimeoutMs) {
    try {
      const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_REPORT_USER_ROUTE, this.postAbortable(`${this.apiBaseUrl}${_HttpUsersService.USER_REPORT_USER_ROUTE}`, request, signal), "Report request timeout.", requestTimeoutMs);
      if (!response) {
        return { submitted: true, message: null };
      }
      return {
        submitted: response.submitted !== false,
        message: typeof response.message === "string" ? response.message : null
      };
    } catch (error) {
      if (this.isAbortError(error)) {
        throw error;
      }
      if (this.isTimeoutError(error, "Report request timeout.")) {
        throw error;
      }
      return {
        submitted: false,
        message: "Unable to submit report."
      };
    }
  }
  async logoutUser(request, signal, requestTimeoutMs) {
    try {
      const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_LOGOUT_ROUTE, this.postAbortable(`${this.apiBaseUrl}${_HttpUsersService.USER_LOGOUT_ROUTE}`, request, signal), "Logout request timeout.", requestTimeoutMs);
      if (!response) {
        return { submitted: true, message: null };
      }
      return {
        submitted: response.submitted !== false,
        message: typeof response.message === "string" ? response.message : null
      };
    } catch (error) {
      if (this.isAbortError(error)) {
        throw error;
      }
      if (this.isTimeoutError(error, "Logout request timeout.")) {
        throw error;
      }
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return { submitted: true, message: null };
      }
      return {
        submitted: false,
        message: "Unable to log out."
      };
    }
  }
  async deleteUser(request, signal, requestTimeoutMs) {
    try {
      const response = await this.routeDelay.withRequestTimeout(_HttpUsersService.USER_DELETE_ROUTE, this.postAbortable(`${this.apiBaseUrl}${_HttpUsersService.USER_DELETE_ROUTE}`, request, signal), "Delete account request timeout.", requestTimeoutMs);
      if (!response) {
        return { submitted: true, message: null };
      }
      return {
        submitted: response.submitted !== false,
        message: typeof response.message === "string" ? response.message : null
      };
    } catch (error) {
      if (this.isAbortError(error)) {
        throw error;
      }
      if (this.isTimeoutError(error, "Delete account request timeout.")) {
        throw error;
      }
      return {
        submitted: false,
        message: "Unable to delete account."
      };
    }
  }
  cacheUserResponse(response) {
    if (!response.user?.id?.trim()) {
      return response;
    }
    this.offlineCache.writeUser(response.user.id.trim(), response);
    return response;
  }
  readProfileExtByIdFallback(userId) {
    const cached = this.offlineCache.readUser(userId.trim());
    if (cached?.user) {
      return {
        profileExt: {
          profile: cached.user,
          experienceEntries: []
        },
        filterCount: cached.filterCount,
        filterPreferences: cached.filterPreferences,
        counterOverrides: cached.counterOverrides
      };
    }
    const fallback = this.readUserByIdFallback(userId);
    return fallback?.user ? {
      profileExt: {
        profile: fallback.user,
        experienceEntries: []
      },
      filterCount: fallback.filterCount,
      filterPreferences: fallback.filterPreferences,
      counterOverrides: fallback.counterOverrides
    } : null;
  }
  requiresServerProfileAuthority() {
    const kind = this.sessionService.currentSession()?.kind;
    return kind === "operator-bootstrap" || kind === "demo" && !this.isBrowserOffline();
  }
  isBrowserOffline() {
    return typeof navigator !== "undefined" && navigator.onLine === false;
  }
  readUserByIdFallback(userId) {
    const normalizedUserId = userId.trim();
    if (normalizedUserId) {
      return null;
    }
    const activeProfile = this.userProfileStore.activeUserProfile();
    if (activeProfile) {
      return {
        user: activeProfile
      };
    }
    const sessionUser = this.buildFirebaseSessionUser();
    return sessionUser ? {
      user: sessionUser
    } : null;
  }
  buildFirebaseSessionUser() {
    const session = this.sessionService.currentSession();
    if (session?.kind !== "firebase") {
      return null;
    }
    return {
      id: session.profile.id.trim(),
      name: session.profile.name.trim(),
      age: 0,
      birthday: "",
      city: "",
      height: "",
      physique: "",
      languages: [],
      horoscope: "",
      initials: session.profile.initials.trim(),
      gender: "man",
      statusText: "",
      hostTier: "",
      traitLabel: "",
      completion: 0,
      headline: "",
      about: "",
      images: session.profile.imageUrl?.trim() ? [session.profile.imageUrl.trim()] : [],
      profileStatus: "onboarding",
      activities: {
        game: 0,
        chats: 0,
        invitations: 0,
        events: 0,
        hosting: 0,
        cars: 0,
        accommodation: 0,
        supplies: 0,
        tickets: 0,
        contacts: 0,
        feedback: 0,
        notifications: 0,
        paymentRefundsPending: 0,
        chat: {
          all: 0,
          event: 0,
          subEvent: 0,
          group: 0,
          service: 0,
          appSupport: 0,
          supportCases: { pending: 0, warned: 0, picked: 0, solved: 0, blocked: 0, all: 0 }
        },
        event: {
          all: 0,
          active: 0,
          pending: 0,
          invitations: 0,
          hosting: 0,
          drafts: 0,
          watchlist: 0,
          trash: 0
        },
        asset: {
          cars: 0,
          accommodation: 0,
          supplies: 0,
          tickets: 0,
          carsPending: 0,
          accommodationPending: 0,
          suppliesPending: 0
        },
        eventFeedback: {
          ownEvents: 0,
          pending: 0,
          feedbacked: 0,
          removed: 0
        },
        adminJobs: 0,
        adminMetrics: 0
      }
    };
  }
  buildInitialMenuCounterOverrides(user, overrides) {
    return {
      game: this.normalizeInitialCounterValue(overrides?.game, user.activities?.game),
      chats: this.normalizeInitialCounterValue(overrides?.chats, user.activities?.chats),
      invitations: this.normalizeInitialCounterValue(overrides?.invitations, user.activities?.invitations),
      events: this.normalizeInitialCounterValue(overrides?.events, user.activities?.events),
      hosting: this.normalizeInitialCounterValue(overrides?.hosting, user.activities?.hosting),
      cars: this.normalizeInitialCounterValue(overrides?.cars, user.activities?.cars),
      accommodation: this.normalizeInitialCounterValue(overrides?.accommodation, user.activities?.accommodation),
      supplies: this.normalizeInitialCounterValue(overrides?.supplies, user.activities?.supplies),
      tickets: this.normalizeInitialCounterValue(overrides?.tickets, user.activities?.tickets),
      contacts: this.normalizeInitialCounterValue(overrides?.contacts, user.activities?.contacts),
      feedback: this.normalizeInitialCounterValue(overrides?.feedback, user.activities?.feedback),
      notifications: this.normalizeInitialCounterValue(overrides?.notifications, user.activities?.notifications),
      paymentRefundsPending: this.normalizeInitialCounterValue(overrides?.paymentRefundsPending, user.activities?.paymentRefundsPending),
      chat: {
        all: this.normalizeInitialCounterValue(overrides?.chat?.all, user.activities?.chat?.all),
        event: this.normalizeInitialCounterValue(overrides?.chat?.event, user.activities?.chat?.event),
        subEvent: this.normalizeInitialCounterValue(overrides?.chat?.subEvent, user.activities?.chat?.subEvent),
        group: this.normalizeInitialCounterValue(overrides?.chat?.group, user.activities?.chat?.group),
        service: this.normalizeInitialCounterValue(overrides?.chat?.service, user.activities?.chat?.service),
        appSupport: this.normalizeInitialCounterValue(overrides?.chat?.appSupport, user.activities?.chat?.appSupport),
        supportCases: {
          pending: this.normalizeInitialCounterValue(overrides?.chat?.supportCases?.pending, user.activities?.chat?.supportCases?.pending),
          warned: this.normalizeInitialCounterValue(overrides?.chat?.supportCases?.warned, user.activities?.chat?.supportCases?.warned),
          picked: this.normalizeInitialCounterValue(overrides?.chat?.supportCases?.picked, user.activities?.chat?.supportCases?.picked),
          solved: this.normalizeInitialCounterValue(overrides?.chat?.supportCases?.solved, user.activities?.chat?.supportCases?.solved),
          blocked: this.normalizeInitialCounterValue(overrides?.chat?.supportCases?.blocked, user.activities?.chat?.supportCases?.blocked),
          all: this.normalizeInitialCounterValue(overrides?.chat?.supportCases?.all, user.activities?.chat?.supportCases?.all)
        }
      },
      event: {
        all: this.normalizeInitialCounterValue(overrides?.event?.all, user.activities?.event?.all),
        active: this.normalizeInitialCounterValue(overrides?.event?.active, user.activities?.event?.active),
        pending: this.normalizeInitialCounterValue(overrides?.event?.pending, user.activities?.event?.pending),
        invitations: this.normalizeInitialCounterValue(overrides?.event?.invitations, user.activities?.event?.invitations),
        hosting: this.normalizeInitialCounterValue(overrides?.event?.hosting, user.activities?.event?.hosting),
        drafts: this.normalizeInitialCounterValue(overrides?.event?.drafts, user.activities?.event?.drafts),
        watchlist: this.normalizeInitialCounterValue(overrides?.event?.watchlist, user.activities?.event?.watchlist),
        trash: this.normalizeInitialCounterValue(overrides?.event?.trash, user.activities?.event?.trash)
      },
      asset: {
        cars: this.normalizeInitialCounterValue(overrides?.asset?.cars, user.activities?.asset?.cars),
        accommodation: this.normalizeInitialCounterValue(overrides?.asset?.accommodation, user.activities?.asset?.accommodation),
        supplies: this.normalizeInitialCounterValue(overrides?.asset?.supplies, user.activities?.asset?.supplies),
        tickets: this.normalizeInitialCounterValue(overrides?.asset?.tickets, user.activities?.asset?.tickets),
        carsPending: this.normalizeInitialCounterValue(overrides?.asset?.carsPending, user.activities?.asset?.carsPending),
        accommodationPending: this.normalizeInitialCounterValue(overrides?.asset?.accommodationPending, user.activities?.asset?.accommodationPending),
        suppliesPending: this.normalizeInitialCounterValue(overrides?.asset?.suppliesPending, user.activities?.asset?.suppliesPending)
      },
      eventFeedback: {
        ownEvents: this.normalizeInitialCounterValue(overrides?.eventFeedback?.ownEvents, user.activities?.eventFeedback?.ownEvents),
        pending: this.normalizeInitialCounterValue(overrides?.eventFeedback?.pending, user.activities?.eventFeedback?.pending),
        feedbacked: this.normalizeInitialCounterValue(overrides?.eventFeedback?.feedbacked, user.activities?.eventFeedback?.feedbacked),
        removed: this.normalizeInitialCounterValue(overrides?.eventFeedback?.removed, user.activities?.eventFeedback?.removed)
      },
      adminJobs: this.normalizeInitialCounterValue(overrides?.adminJobs, user.activities?.adminJobs),
      adminMetrics: this.normalizeInitialCounterValue(overrides?.adminMetrics, user.activities?.adminMetrics)
    };
  }
  normalizeInitialCounterValue(primaryValue, fallbackValue) {
    if (Number.isFinite(primaryValue)) {
      return Math.max(0, Math.trunc(Number(primaryValue)));
    }
    if (Number.isFinite(fallbackValue)) {
      return Math.max(0, Math.trunc(Number(fallbackValue)));
    }
    return 0;
  }
  postAbortable(url, body, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(this.createAbortError());
        return;
      }
      let emitted = false;
      const subscription = this.http.post(url, body).subscribe({
        next: (response) => {
          emitted = true;
          cleanup();
          resolve(response ?? null);
        },
        error: (error) => {
          cleanup();
          reject(error);
        },
        complete: () => {
          if (emitted) {
            return;
          }
          cleanup();
          resolve(null);
        }
      });
      const onAbort = () => {
        cleanup();
        subscription.unsubscribe();
        reject(this.createAbortError());
      };
      const cleanup = () => {
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
  isTimeoutError(error, message) {
    return error instanceof Error && error.message === message;
  }
  toDemoUserListItem(user) {
    const id = `${user.id ?? ""}`.trim();
    if (!id) {
      return null;
    }
    const normalizedGender = `${user.gender ?? ""}`.trim().toLowerCase() === "man" ? "man" : "woman";
    return {
      id,
      name: `${user.name ?? ""}`.trim(),
      city: `${user.city ?? ""}`.trim(),
      initials: `${user.initials ?? ""}`.trim(),
      avatarUrl: `${user.avatarUrl ?? ""}`.trim(),
      gender: normalizedGender,
      statusText: `${user.statusText ?? ""}`.trim(),
      completion: user.completion === void 0 || user.completion === null ? void 0 : Math.max(0, Math.trunc(Number(user.completion) || 0)),
      profileFormVersion: user.profileFormVersion === void 0 || user.profileFormVersion === null ? void 0 : Math.max(0, Math.trunc(Number(user.profileFormVersion) || 0)),
      status: `${user.status ?? ""}`.trim(),
      deletedAtIso: typeof user.deletedAtIso === "string" ? user.deletedAtIso : null
    };
  }
  static \u0275fac = function HttpUsersService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HttpUsersService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpUsersService, factory: _HttpUsersService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HttpUsersService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  HttpUsersService
};
//# sourceMappingURL=chunk-DP7O5TZ4.js.map
