import {
  APP_STORAGE_KEYS
} from "./chunk-LERGHE7K.js";
import {
  Injectable,
  Injector,
  computed,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/common/firebase-login-mode.ts
function resolveFirebaseLoginEnabled(configured, production, qaOverrideAllowed, search) {
  if (configured) {
    return true;
  }
  if (production || !qaOverrideAllowed) {
    return false;
  }
  return new URLSearchParams(search).get("qaAuth") === "firebase";
}
var firebaseLoginEnabled = resolveFirebaseLoginEnabled(environment.firebaseLoginEnabled, environment.production, environment.firebaseLoginQaOverrideEnabled, typeof window === "undefined" ? "" : window.location.search);
function isFirebaseLoginEnabled() {
  return firebaseLoginEnabled;
}
function resolveRuntimeAuthMode(loginCapabilityEnabled, firebaseRuntimeAvailable) {
  return loginCapabilityEnabled && firebaseRuntimeAvailable ? "firebase" : "selector";
}

// src/app/shared/core/base/services/session.service.ts
var SessionService = class _SessionService {
  static OPERATOR_BOOTSTRAP_EMAIL_PATTERN = /^operator-[0-9a-f]{24}@deployment\.invalid$/;
  static SESSION_STORAGE_KEY = APP_STORAGE_KEYS.session;
  static DEMO_ACTIVE_USER_KEY = APP_STORAGE_KEYS.demoActiveUser;
  static OPERATOR_BOOTSTRAP_SESSION_KEY = APP_STORAGE_KEYS.operatorBootstrapSession;
  static OPERATOR_BOOTSTRAP_TOKEN_KEY = APP_STORAGE_KEYS.operatorBootstrapToken;
  injector = inject(Injector);
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
    const session = {
      kind: "demo",
      userId: normalizedUserId,
      sessionId: this.newOpaqueId("session"),
      supportContext: this.normalizeSupportContext(options.supportContext)
    };
    localStorage.setItem(_SessionService.DEMO_ACTIVE_USER_KEY, normalizedUserId);
    this.persistSession(session);
    return session;
  }
  async startTrackedDemoSession(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const session = {
      kind: "demo",
      userId: normalizedUserId,
      sessionId: this.newOpaqueId("session")
    };
    try {
      const response = await (await this.firebaseSessionRegistryService()).registerDemoLogin(session.sessionId, session.userId, {
        attemptId: this.newOpaqueId("attempt"),
        provider: "demo"
      });
      if (response.accepted) {
        localStorage.setItem(_SessionService.DEMO_ACTIVE_USER_KEY, normalizedUserId);
        this.persistSession(session);
        return session;
      }
      this.firebaseNoticeRef.set("auth.session.limit.reached");
    } catch (error) {
      this.firebaseNoticeRef.set(this.httpErrorStatus(error) === 409 ? "auth.session.limit.reached" : "auth.session.registration.failed");
    }
    this.clearStoredSession();
    return null;
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
        sessionId: this.newOpaqueId("session")
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
    localStorage.removeItem(_SessionService.DEMO_ACTIVE_USER_KEY);
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
      this.firebaseAuthServicePromise = import("./firebase-auth.service-FH3NVZM4.js").then((module) => this.injector.get(module.FirebaseAuthService));
    }
    return this.firebaseAuthServicePromise;
  }
  async operatorBootstrapAuthService() {
    if (!this.operatorBootstrapAuthServicePromise) {
      this.operatorBootstrapAuthServicePromise = import("./operator-bootstrap-auth.service-BJ2I3FAO.js").then((module) => this.injector.get(module.HttpOperatorBootstrapAuthService));
    }
    return this.operatorBootstrapAuthServicePromise;
  }
  async firebaseSessionRegistryService() {
    if (!this.firebaseSessionRegistryServicePromise) {
      this.firebaseSessionRegistryServicePromise = import("./firebase-session-registry.service-E2VOCA76.js").then((module) => this.injector.get(module.FirebaseSessionRegistryService));
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
      sessionId: this.newOpaqueId("session")
    };
    if (!await this.registerFirebaseLogin(session, request.provider)) {
      return null;
    }
    this.persistSession(session);
    void this.initializeFirebaseMessagingForSession(session);
    return session;
  }
  async initializeFirebaseMessagingForSession(session) {
    if (session.kind !== "firebase" || environment.activitiesDataSource !== "http" || !environment.firebaseMessagingEnabled || this.isLoopbackBrowserHost()) {
      return;
    }
    const { FirebaseMessagingService } = await import("./firebase-messaging.service-FBCNPBGF.js");
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
    this.clearOperatorBootstrapStorage();
    this.sessionRef.set(session);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(_SessionService.SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }
  persistOperatorBootstrapSession(session, accessToken) {
    if (typeof sessionStorage === "undefined") {
      return false;
    }
    try {
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
    this.sessionRef.set(null);
    this.clearOperatorBootstrapStorage();
    if (typeof localStorage !== "undefined") {
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
  isFirebaseLoginEnabled,
  SessionService
};
//# sourceMappingURL=chunk-2ENBQWLU.js.map
