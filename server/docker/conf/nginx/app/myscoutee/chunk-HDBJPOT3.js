import {
  APP_STORAGE_KEYS,
  offlineCacheTicketsStorageKey,
  offlineCacheUserStorageKey
} from "./chunk-LDZENZ35.js";
import {
  Injectable,
  Injector,
  __spreadProps,
  __spreadValues,
  computed,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/common/public-media.ts
function isPublicMediaUrl(url) {
  if (!["/media/public", "/api/media/public"].includes(url.pathname))
    return false;
  const key = url.searchParams.get("key") ?? "";
  return key.length <= 2048 && !key.includes("\\") && !/[\x00-\x1f\x7f]/.test(key) && key.split("/").every((part) => part !== "" && part !== "." && part !== "..") && [
    "public/demo/",
    "public/branding/",
    "images/demo-profiles/",
    "images/demo-assets/",
    "images/demo-events/",
    "images/system/",
    "payment-cards/"
  ].some((prefix) => key.startsWith(prefix));
}

// src/app/shared/core/base/services/offline-cache.service.ts
var OfflineCacheService = class _OfflineCacheService {
  revokedUsers = /* @__PURE__ */ new Set();
  activateUser(userId) {
    this.revokedUsers.delete(userId.trim());
  }
  async clearUser(userId) {
    const id = userId.trim();
    if (!id)
      return;
    this.revokedUsers.add(id);
    if (typeof localStorage !== "undefined") {
      for (const key of [this.userStorageKey(id), this.ticketStorageKey(id, "upcoming"), this.ticketStorageKey(id, "past")]) {
        localStorage.removeItem(key);
      }
    }
    if (typeof caches === "undefined")
      return;
    for (const name of (await caches.keys()).filter((name2) => name2.startsWith("myscoutee-runtime-api-") || name2.startsWith("myscoutee-runtime-media-"))) {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      await Promise.all(requests.filter((request) => {
        const path = new URL(request.url).pathname;
        return path.startsWith("/api/auth/me") || name.includes("-media-") && !path.startsWith("/assets/") && !isPublicMediaUrl(new URL(request.url));
      }).map((request) => cache.delete(request)));
    }
  }
  readUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const parsed = this.readJson(this.userStorageKey(normalizedUserId));
    return parsed ? this.clone(parsed) : null;
  }
  writeUser(userId, response) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || this.revokedUsers.has(normalizedUserId) || !response.user) {
      return;
    }
    this.writeJson(this.userStorageKey(normalizedUserId), this.clone(response));
  }
  readTicketPage(userId, order) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const parsed = this.readJson(this.ticketStorageKey(normalizedUserId, order));
    return parsed ? this.clone(parsed) : null;
  }
  writeTicketPage(userId, order, payload) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || this.revokedUsers.has(normalizedUserId)) {
      return;
    }
    this.writeJson(this.ticketStorageKey(normalizedUserId, order), {
      items: this.clone(payload.items),
      total: Math.max(0, Math.trunc(Number(payload.total) || 0)),
      updatedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  userStorageKey(userId) {
    return offlineCacheUserStorageKey(userId);
  }
  ticketStorageKey(userId, order) {
    return offlineCacheTicketsStorageKey(userId, order);
  }
  readJson(key) {
    if (typeof localStorage === "undefined") {
      return null;
    }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  writeJson(key, value) {
    if (typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }
  clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  static \u0275fac = function OfflineCacheService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OfflineCacheService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OfflineCacheService, factory: _OfflineCacheService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OfflineCacheService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/common/firebase-login-mode.ts
function isFirebaseLoginEnabled() {
  return environment.firebaseLoginEnabled;
}
function resolveRuntimeAuthMode(loginCapabilityEnabled, firebaseRuntimeAvailable) {
  return loginCapabilityEnabled && firebaseRuntimeAvailable ? "firebase" : "selector";
}

// src/app/shared/core/base/services/session.service.ts
var AVATAR_PREVIEW_MAX_BYTES = 64 * 1024;
function avatarPreviewDataUrl(value) {
  return typeof value === "string" && value.length <= Math.ceil(AVATAR_PREVIEW_MAX_BYTES / 3) * 4 + 32 && /^data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(value) ? value : void 0;
}
var SessionService = class _SessionService {
  static OPERATOR_BOOTSTRAP_EMAIL_PATTERN = /^operator-[0-9a-f]{24}@deployment\.invalid$/;
  static SESSION_STORAGE_KEY = APP_STORAGE_KEYS.session;
  static ADMIN_SUPPORT_SESSION_KEY = APP_STORAGE_KEYS.adminSupportSession;
  static DEMO_ACTIVE_USER_KEY = APP_STORAGE_KEYS.demoActiveUser;
  static OPERATOR_BOOTSTRAP_SESSION_KEY = APP_STORAGE_KEYS.operatorBootstrapSession;
  static OPERATOR_BOOTSTRAP_TOKEN_KEY = APP_STORAGE_KEYS.operatorBootstrapToken;
  injector = inject(Injector);
  offlineCache = inject(OfflineCacheService);
  cacheClear = Promise.resolve();
  sessionRef = signal(this.loadStoredSession(), ...ngDevMode ? [{ debugName: "sessionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  authModeRef = signal("selector", ...ngDevMode ? [{ debugName: "authModeRef" }] : (
    /* istanbul ignore next */
    []
  ));
  firebaseBusyRef = signal(false, ...ngDevMode ? [{ debugName: "firebaseBusyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  firebaseNoticeRef = signal("", ...ngDevMode ? [{ debugName: "firebaseNoticeRef" }] : (
    /* istanbul ignore next */
    []
  ));
  firebaseAuthServicePromise = null;
  firebaseSessionRegistryServicePromise = null;
  operatorBootstrapAuthServicePromise = null;
  session = this.sessionRef.asReadonly();
  firebaseBusy = this.firebaseBusyRef.asReadonly();
  firebaseNotice = this.firebaseNoticeRef.asReadonly();
  firebaseProfile = computed(() => {
    const current = this.sessionRef();
    return current?.kind === "firebase" ? current.profile : null;
  }, ...ngDevMode ? [{ debugName: "firebaseProfile" }] : (
    /* istanbul ignore next */
    []
  ));
  activeUserId = computed(() => {
    const current = this.sessionRef();
    if (current?.kind === "demo") {
      return current.userId.trim();
    }
    if (current?.kind === "firebase") {
      return current.profile.id.trim();
    }
    return "";
  }, ...ngDevMode ? [{ debugName: "activeUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  get authMode() {
    return this.authModeRef();
  }
  setFirebaseRuntimeAvailable(available) {
    this.authModeRef.set(resolveRuntimeAuthMode(isFirebaseLoginEnabled(), available));
  }
  currentSession() {
    return this.sessionRef();
  }
  setFirebaseAvatarPreview(sessionId, imageUrl) {
    const session = this.sessionRef();
    if (session?.kind !== "firebase" || session.sessionId !== sessionId) {
      return;
    }
    const source = imageUrl.trim();
    if (session.avatarImageUrl === source) {
      return;
    }
    this.persistSession(__spreadProps(__spreadValues({}, session), { avatarImageUrl: source, avatarImageDataUrl: void 0 }));
  }
  setFirebaseAvatarPreviewData(sessionId, imageUrl, dataUrl) {
    const session = this.sessionRef();
    const imageData = avatarPreviewDataUrl(dataUrl);
    if (session?.kind !== "firebase" || session.sessionId !== sessionId || session.avatarImageUrl !== imageUrl || !imageData) {
      return;
    }
    this.persistSession(__spreadProps(__spreadValues({}, session), { avatarImageDataUrl: imageData }));
  }
  async ensureSession() {
    const current = this.sessionRef();
    if (!current) {
      return null;
    }
    if (current.kind === "demo") {
      return current;
    }
    if (current.kind === "operator-bootstrap") {
      return this.getOperatorBootstrapToken() ? current : null;
    }
    if (this.isBrowserOffline()) {
      return current;
    }
    const restoredProfile = await (await this.firebaseAuthService()).restoreSessionProfile();
    if (!restoredProfile) {
      this.clearStoredSession();
      return null;
    }
    const nextSession = {
      kind: "firebase",
      profile: restoredProfile,
      avatarImageUrl: restoredProfile.id === current.profile.id ? current.avatarImageUrl : void 0,
      avatarImageDataUrl: restoredProfile.id === current.profile.id ? current.avatarImageDataUrl : void 0,
      sessionId: current.sessionId
    };
    this.persistSession(nextSession);
    void this.initializeFirebaseMessagingForSession(nextSession);
    return nextSession;
  }
  startDemoSession(userId, options = {}) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const supportContext = this.normalizeSupportContext(options.supportContext);
    const session = {
      kind: "demo",
      userId: normalizedUserId,
      sessionId: this.newOpaqueId("session"),
      supportContext
    };
    if (supportContext) {
      return this.persistAdminSupportSession(session) ? session : null;
    }
    localStorage.setItem(_SessionService.DEMO_ACTIVE_USER_KEY, normalizedUserId);
    this.persistSession(session);
    return session;
  }
  async startTrackedDemoSession(userId, options = {}) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const supportContext = this.normalizeSupportContext(options.supportContext);
    const current = this.sessionRef();
    const currentSessionId = current?.kind === "demo" && !current.supportContext && !supportContext && current.userId.trim() === normalizedUserId ? `${current.sessionId ?? ""}`.trim() : "";
    const session = {
      kind: "demo",
      userId: normalizedUserId,
      sessionId: currentSessionId || this.newOpaqueId("session"),
      supportContext
    };
    try {
      const response = await (await this.firebaseSessionRegistryService()).registerDemoLogin(session.sessionId, session.userId, {
        attemptId: this.newOpaqueId("attempt"),
        provider: "demo"
      });
      if (response.accepted) {
        if (supportContext) {
          return this.persistAdminSupportSession(session) ? session : null;
        }
        localStorage.setItem(_SessionService.DEMO_ACTIVE_USER_KEY, normalizedUserId);
        this.persistSession(session);
        return session;
      }
      this.firebaseNoticeRef.set("auth.session.limit.reached");
    } catch (error) {
      this.firebaseNoticeRef.set(this.httpErrorStatus(error) === 409 ? "auth.session.limit.reached" : "auth.session.registration.failed");
    }
    return null;
  }
  async cancelFirebaseAccountLink() {
    if (this.firebaseAuthServicePromise && !this.firebaseBusyRef()) {
      (await this.firebaseAuthServicePromise).cancelAccountLink();
      this.firebaseNoticeRef.set("");
    }
  }
  async startFirebaseSession(request = { provider: "google" }) {
    if (this.firebaseBusyRef()) {
      return null;
    }
    this.firebaseBusyRef.set(true);
    this.firebaseNoticeRef.set("");
    try {
      return await this.startFirebaseSessionInternal(request);
    } finally {
      this.firebaseBusyRef.set(false);
    }
  }
  async startAuthSession(request = { provider: "google" }) {
    if (!this.isOperatorBootstrapCandidate(request)) {
      return this.startFirebaseSession(request);
    }
    if (this.firebaseBusyRef()) {
      return null;
    }
    this.firebaseBusyRef.set(true);
    this.firebaseNoticeRef.set("");
    try {
      const email = `${request.email ?? ""}`.trim();
      const password = `${request.password ?? ""}`;
      if (!email || !password) {
        this.firebaseNoticeRef.set("operator.bootstrap.auth.invalid");
        return null;
      }
      try {
        const result = await (await this.operatorBootstrapAuthService()).signIn({
          email,
          password
        });
        const session = {
          kind: "operator-bootstrap",
          email: result.email,
          expiresAt: result.expiresAt
        };
        if (Date.parse(session.expiresAt) <= Date.now() || !this.persistOperatorBootstrapSession(session, result.accessToken)) {
          this.firebaseNoticeRef.set("operator.bootstrap.auth.response.invalid");
          return null;
        }
        return session;
      } catch (error) {
        const status = this.httpErrorStatus(error);
        if (status === 404) {
          return await this.startFirebaseSessionInternal(request);
        }
        this.firebaseNoticeRef.set(status === 401 ? "operator.bootstrap.auth.invalid" : status === 429 ? "operator.bootstrap.auth.throttled" : "operator.bootstrap.auth.failed");
        return null;
      }
    } finally {
      this.firebaseBusyRef.set(false);
    }
  }
  async restoreFirebaseSession() {
    if (this.firebaseBusyRef()) {
      return this.sessionRef();
    }
    const current = this.sessionRef();
    if (current?.kind === "firebase" && this.isBrowserOffline()) {
      return current;
    }
    this.firebaseBusyRef.set(true);
    this.firebaseNoticeRef.set("");
    try {
      const profile = await (await this.firebaseAuthService()).restoreSessionProfile();
      if (!profile) {
        this.clearStoredSession();
        return null;
      }
      const session = {
        kind: "firebase",
        profile,
        sessionId: this.reusableFirebaseSessionId(profile) || this.newOpaqueId("session")
      };
      if (!await this.registerFirebaseLogin(session, "firebase")) {
        return null;
      }
      this.persistSession(session);
      void this.initializeFirebaseMessagingForSession(session);
      return session;
    } finally {
      this.firebaseBusyRef.set(false);
    }
  }
  async logout() {
    const current = this.sessionRef();
    const adminSupportSession = this.isAdminSupportSession(current);
    const sessionRegistryEnabled = environment.activitiesDataSource === "http";
    let firebaseToken = null;
    if (sessionRegistryEnabled && current?.kind === "firebase") {
      try {
        firebaseToken = await (await this.firebaseAuthService()).getIdToken();
      } catch {
      }
    }
    this.firebaseNoticeRef.set("");
    this.clearStoredSession();
    await this.cacheClear;
    if (!adminSupportSession && typeof localStorage !== "undefined") {
      localStorage.removeItem(_SessionService.DEMO_ACTIVE_USER_KEY);
    }
    if (sessionRegistryEnabled) {
      try {
        const sessionId = current?.kind === "demo" || current?.kind === "firebase" ? `${current.sessionId ?? ""}`.trim() : "";
        if (current?.kind === "demo" && sessionId) {
          await (await this.firebaseSessionRegistryService()).revokeDemoSession(sessionId, current.userId);
        } else if (current?.kind === "firebase" && sessionId && firebaseToken) {
          await (await this.firebaseSessionRegistryService()).revokeFirebaseSession(sessionId, current.profile.id, firebaseToken);
        }
      } catch {
      }
    }
    if (current?.kind === "firebase") {
      await (await this.firebaseAuthService()).signOut();
    }
  }
  getOperatorBootstrapToken() {
    const current = this.sessionRef();
    if (current?.kind !== "operator-bootstrap" || !this.isFutureIso(current.expiresAt) || typeof sessionStorage === "undefined") {
      if (current?.kind === "operator-bootstrap") {
        this.clearOperatorBootstrapSession();
      }
      return null;
    }
    try {
      const token = `${sessionStorage.getItem(_SessionService.OPERATOR_BOOTSTRAP_TOKEN_KEY) ?? ""}`.trim();
      if (token) {
        return token;
      }
    } catch {
    }
    this.clearOperatorBootstrapSession();
    return null;
  }
  clearOperatorBootstrapSession(noticeKey = "") {
    const bootstrapActive = this.sessionRef()?.kind === "operator-bootstrap";
    this.clearOperatorBootstrapStorage();
    if (bootstrapActive) {
      this.sessionRef.set(null);
    }
    if (noticeKey) {
      this.firebaseNoticeRef.set(noticeKey);
    }
  }
  async getFirebaseIdToken() {
    if (!isFirebaseLoginEnabled() || this.sessionRef()?.kind !== "firebase") {
      return null;
    }
    return (await this.firebaseAuthService()).getIdToken();
  }
  currentFirebaseSessionId() {
    const current = this.sessionRef();
    return current?.kind === "firebase" ? current.sessionId.trim() : "";
  }
  async firebaseAuthService() {
    if (!this.firebaseAuthServicePromise) {
      this.firebaseAuthServicePromise = import("./firebase-auth.service-WWTTQYES.js").then((module) => this.injector.get(module.FirebaseAuthService));
    }
    return this.firebaseAuthServicePromise;
  }
  async operatorBootstrapAuthService() {
    if (!this.operatorBootstrapAuthServicePromise) {
      this.operatorBootstrapAuthServicePromise = import("./operator-bootstrap-auth.service-HOF3FW5C.js").then((module) => this.injector.get(module.HttpOperatorBootstrapAuthService));
    }
    return this.operatorBootstrapAuthServicePromise;
  }
  async firebaseSessionRegistryService() {
    if (!this.firebaseSessionRegistryServicePromise) {
      this.firebaseSessionRegistryServicePromise = import("./firebase-session-registry.service-FCZ7XQ4Z.js").then((module) => this.injector.get(module.FirebaseSessionRegistryService));
    }
    return this.firebaseSessionRegistryServicePromise;
  }
  async startFirebaseSessionInternal(request) {
    const result = await (await this.firebaseAuthService()).signIn(request);
    if (result.emailVerificationSent) {
      const email = result.email?.trim();
      this.firebaseNoticeRef.set(email ? `Verification email sent to ${email}. Confirm it, then continue here.` : "Verification email sent. Confirm it, then continue here.");
      return null;
    }
    if (result.errorMessage) {
      this.firebaseNoticeRef.set(result.errorMessage);
      return null;
    }
    if (!result.profile) {
      return null;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(_SessionService.DEMO_ACTIVE_USER_KEY);
    }
    const session = {
      kind: "firebase",
      profile: result.profile,
      sessionId: this.reusableFirebaseSessionId(result.profile) || this.newOpaqueId("session")
    };
    if (!await this.registerFirebaseLogin(session, request.provider)) {
      return null;
    }
    this.persistSession(session);
    void this.initializeFirebaseMessagingForSession(session);
    return session;
  }
  async initializeFirebaseMessagingForSession(session) {
    if (environment.activitiesDataSource === "http" && (session.kind !== "firebase" || !environment.firebaseMessagingEnabled || !environment.serviceWorkerEnabled)) {
      return;
    }
    const { FirebaseMessagingService } = await import("./firebase-messaging.service-MEZERJ7A.js");
    this.injector.get(FirebaseMessagingService).initialize();
  }
  async registerFirebaseLogin(session, provider) {
    const token = await (await this.firebaseAuthService()).getIdToken();
    if (!token) {
      this.firebaseNoticeRef.set("auth.session.registration.failed");
      await (await this.firebaseAuthService()).signOut();
      return false;
    }
    try {
      const response = await (await this.firebaseSessionRegistryService()).registerLogin(session.sessionId, token, {
        attemptId: this.newOpaqueId("attempt"),
        provider
      });
      if (response.accepted) {
        return true;
      }
      this.firebaseNoticeRef.set("auth.session.limit.reached");
    } catch (error) {
      this.firebaseNoticeRef.set(this.httpErrorStatus(error) === 409 ? "auth.session.limit.reached" : "auth.session.registration.failed");
    }
    await (await this.firebaseAuthService()).signOut();
    return false;
  }
  persistSession(session) {
    const nextId = session.kind === "demo" ? session.userId : session.kind === "firebase" ? session.profile.id : "";
    const previousId = this.activeUserId();
    if (previousId && previousId !== nextId)
      this.cacheClear = this.offlineCache.clearUser(previousId);
    if (nextId)
      this.offlineCache.activateUser(nextId);
    this.clearAdminSupportSessionStorage();
    this.clearOperatorBootstrapStorage();
    this.sessionRef.set(session);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(_SessionService.SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }
  reusableFirebaseSessionId(profile) {
    const current = this.sessionRef();
    if (current?.kind !== "firebase") {
      return "";
    }
    const currentUserId = current.profile.id.trim();
    const nextUserId = profile.id.trim();
    return currentUserId && currentUserId === nextUserId ? current.sessionId.trim() : "";
  }
  persistOperatorBootstrapSession(session, accessToken) {
    if (typeof sessionStorage === "undefined") {
      return false;
    }
    try {
      this.clearAdminSupportSessionStorage();
      sessionStorage.setItem(_SessionService.OPERATOR_BOOTSTRAP_SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem(_SessionService.OPERATOR_BOOTSTRAP_TOKEN_KEY, accessToken);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(_SessionService.SESSION_STORAGE_KEY);
        localStorage.removeItem(_SessionService.DEMO_ACTIVE_USER_KEY);
      }
      this.sessionRef.set(session);
      return true;
    } catch {
      this.clearOperatorBootstrapStorage();
      return false;
    }
  }
  clearStoredSession() {
    const adminSupportSession = this.isAdminSupportSession(this.sessionRef());
    this.cacheClear = this.offlineCache.clearUser(this.activeUserId());
    this.sessionRef.set(null);
    this.clearAdminSupportSessionStorage();
    this.clearOperatorBootstrapStorage();
    if (!adminSupportSession && typeof localStorage !== "undefined") {
      localStorage.removeItem(_SessionService.SESSION_STORAGE_KEY);
    }
  }
  isLoopbackBrowserHost() {
    if (typeof window === "undefined") {
      return false;
    }
    const hostname = window.location.hostname.toLowerCase();
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1" || hostname.endsWith(".localhost");
  }
  isBrowserOffline() {
    return typeof navigator !== "undefined" && navigator.onLine === false;
  }
  loadStoredSession() {
    const adminSupportSession = this.loadStoredAdminSupportSession();
    if (adminSupportSession) {
      return adminSupportSession;
    }
    const operatorBootstrapSession = this.loadStoredOperatorBootstrapSession();
    if (operatorBootstrapSession) {
      return operatorBootstrapSession;
    }
    if (typeof localStorage === "undefined") {
      return null;
    }
    const raw = localStorage.getItem(_SessionService.SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.kind === "demo" && typeof parsed.userId === "string" && parsed.userId.trim().length > 0) {
        return {
          kind: "demo",
          userId: parsed.userId.trim(),
          sessionId: typeof parsed.sessionId === "string" ? parsed.sessionId.trim() || void 0 : void 0,
          supportContext: this.normalizeSupportContext(parsed.supportContext)
        };
      }
      if (parsed.kind === "firebase" && parsed.profile && typeof parsed.sessionId === "string" && parsed.sessionId.trim().length > 0 && typeof parsed.profile.id === "string" && typeof parsed.profile.name === "string" && typeof parsed.profile.email === "string" && typeof parsed.profile.initials === "string") {
        return {
          kind: "firebase",
          sessionId: parsed.sessionId.trim(),
          avatarImageUrl: typeof parsed.avatarImageUrl === "string" ? parsed.avatarImageUrl : void 0,
          avatarImageDataUrl: avatarPreviewDataUrl(parsed.avatarImageDataUrl),
          profile: {
            id: parsed.profile.id,
            name: parsed.profile.name,
            email: parsed.profile.email,
            initials: parsed.profile.initials,
            imageUrl: typeof parsed.profile.imageUrl === "string" ? parsed.profile.imageUrl : void 0
          }
        };
      }
      return null;
    } catch {
      return null;
    }
  }
  persistAdminSupportSession(session) {
    if (!this.isAdminSupportSession(session) || typeof sessionStorage === "undefined") {
      return false;
    }
    try {
      this.clearOperatorBootstrapStorage();
      sessionStorage.setItem(_SessionService.ADMIN_SUPPORT_SESSION_KEY, JSON.stringify(session));
      this.sessionRef.set(session);
      return true;
    } catch {
      this.clearAdminSupportSessionStorage();
      return false;
    }
  }
  loadStoredAdminSupportSession() {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    try {
      const rawSession = sessionStorage.getItem(_SessionService.ADMIN_SUPPORT_SESSION_KEY);
      if (!rawSession) {
        return null;
      }
      const parsed = JSON.parse(rawSession);
      const userId = `${parsed.userId ?? ""}`.trim();
      const supportContext = this.normalizeSupportContext(parsed.supportContext);
      if (parsed.kind !== "demo" || !userId || !supportContext) {
        this.clearAdminSupportSessionStorage();
        return null;
      }
      return {
        kind: "demo",
        userId,
        sessionId: typeof parsed.sessionId === "string" ? parsed.sessionId.trim() || void 0 : void 0,
        supportContext
      };
    } catch {
      this.clearAdminSupportSessionStorage();
      return null;
    }
  }
  loadStoredOperatorBootstrapSession() {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    try {
      const rawSession = sessionStorage.getItem(_SessionService.OPERATOR_BOOTSTRAP_SESSION_KEY);
      const token = `${sessionStorage.getItem(_SessionService.OPERATOR_BOOTSTRAP_TOKEN_KEY) ?? ""}`.trim();
      if (!rawSession || !token) {
        this.clearOperatorBootstrapStorage();
        return null;
      }
      const parsed = JSON.parse(rawSession);
      const email = `${parsed.email ?? ""}`.trim();
      const expiresAt = `${parsed.expiresAt ?? ""}`.trim();
      if (parsed.kind !== "operator-bootstrap" || !email || !this.isFutureIso(expiresAt)) {
        this.clearOperatorBootstrapStorage();
        return null;
      }
      return {
        kind: "operator-bootstrap",
        email,
        expiresAt
      };
    } catch {
      this.clearOperatorBootstrapStorage();
      return null;
    }
  }
  clearOperatorBootstrapStorage() {
    if (typeof sessionStorage === "undefined") {
      return;
    }
    try {
      sessionStorage.removeItem(_SessionService.OPERATOR_BOOTSTRAP_SESSION_KEY);
      sessionStorage.removeItem(_SessionService.OPERATOR_BOOTSTRAP_TOKEN_KEY);
    } catch {
    }
  }
  clearAdminSupportSessionStorage() {
    if (typeof sessionStorage === "undefined") {
      return;
    }
    try {
      sessionStorage.removeItem(_SessionService.ADMIN_SUPPORT_SESSION_KEY);
    } catch {
    }
  }
  isAdminSupportSession(session) {
    return session?.kind === "demo" && session.supportContext?.kind === "admin-support";
  }
  isOperatorBootstrapCandidate(request) {
    return request.provider === "email" && request.emailMode === "sign-in" && _SessionService.OPERATOR_BOOTSTRAP_EMAIL_PATTERN.test(`${request.email ?? ""}`.trim());
  }
  isFutureIso(value) {
    const expiresAtMs = Date.parse(value);
    return Number.isFinite(expiresAtMs) && expiresAtMs > Date.now();
  }
  httpErrorStatus(error) {
    if (!error || typeof error !== "object" || !("status" in error)) {
      return null;
    }
    const status = Number(error.status);
    return Number.isFinite(status) ? status : null;
  }
  newOpaqueId(prefix) {
    const randomUuid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    return `${prefix}:${randomUuid}`;
  }
  normalizeSupportContext(context) {
    if (context?.kind !== "admin-support") {
      return void 0;
    }
    const targetUrl = `${context.targetUrl ?? ""}`.trim();
    return {
      kind: "admin-support",
      targetUrl: targetUrl || void 0
    };
  }
  static \u0275fac = function SessionService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SessionService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SessionService, factory: _SessionService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  OfflineCacheService,
  isFirebaseLoginEnabled,
  AVATAR_PREVIEW_MAX_BYTES,
  SessionService
};
//# sourceMappingURL=chunk-HDBJPOT3.js.map
