import {
  PromptComponent
} from "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  provideRouter
} from "./chunk-U46O4F4Y.js";
import "./chunk-EDHGCWPF.js";
import {
  bootstrapApplication
} from "./chunk-CUDLB52K.js";
import {
  FirebaseSessionRegistryService
} from "./chunk-WZ5SST2P.js";
import {
  DeploymentConfigurationService
} from "./chunk-PB4YNHSN.js";
import {
  I18nService
} from "./chunk-B7YPVC5F.js";
import {
  AppUtils,
  CURRENT_PROFILE_FORM_VERSION
} from "./chunk-XQ4NDAVX.js";
import "./chunk-MS7VTGLY.js";
import {
  NgComponentOutlet
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import {
  UserProfileStore,
  hasOperatorRole,
  resolveRouteConfig
} from "./chunk-INZQPXQM.js";
import "./chunk-IECLTXM5.js";
import {
  SessionService,
  isFirebaseLoginEnabled
} from "./chunk-333NTD7D.js";
import {
  APP_CACHE_KEYS,
  APP_STORAGE_KEYS,
  appLocationStorageKey
} from "./chunk-LERGHE7K.js";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Injectable,
  Injector,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  environment,
  from,
  inject,
  provideBrowserGlobalErrorListeners,
  setClassMetadata,
  signal,
  switchMap,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresolveDocument,
  ɵɵresolveWindow,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XJL7SWH7.js";

// src/app/app.routes.ts
var loadEntryPage = () => import("./entry-page.component-ZUSPUMIZ.js").then((m) => m.EntryPageComponent);
var entryAreaGuard = async () => {
  const injector = inject(Injector);
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const session = await sessionService.ensureSession();
  if (!session) {
    return true;
  }
  if (session.kind === "operator-bootstrap") {
    return router.createUrlTree(["/operator"]);
  }
  const { UsersService } = await import("./users.service-XXQ5ON4Q.js");
  const usersService = injector.get(UsersService);
  const user = usersService.peekCachedUserById(session.kind === "demo" ? session.userId : session.profile.id);
  if (isAdminUser(user)) {
    return router.createUrlTree(["/admin"]);
  }
  if (isOperatorUser(user)) {
    return router.createUrlTree(["/operator"]);
  }
  return router.createUrlTree(["/game"]);
};
var restrictedAreaGuard = async (_route, state) => {
  const injector = inject(Injector);
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const session = await sessionService.ensureSession();
  if (session) {
    const { UsersService } = await import("./users.service-XXQ5ON4Q.js");
    const usersService = injector.get(UsersService);
    if (!usersService.localModeEnabled) {
      if (isBrowserOffline()) {
        if (session.kind === "operator-bootstrap") {
          return entryRedirect(router, state.url);
        }
        const cachedUser = usersService.peekCachedUserById(session.kind === "demo" ? session.userId : session.profile.id);
        if (isAdminUser(cachedUser)) {
          return router.createUrlTree(["/admin"]);
        }
        if (isOperatorUser(cachedUser)) {
          return router.createUrlTree(["/operator"]);
        }
        if (requiresProfileOnboarding(cachedUser)) {
          return entryRedirect(router, state.url);
        }
        return true;
      }
      const user = await usersService.loadUserById(session.kind === "demo" ? session.userId : void 0, 8e3).catch(() => null);
      if (!user) {
        return entryRedirect(router, state.url);
      }
      if (isAdminUser(user)) {
        return router.createUrlTree(["/admin"]);
      }
      if (isOperatorUser(user)) {
        return router.createUrlTree(["/operator"]);
      }
      if (requiresProfileOnboarding(user)) {
        return router.createUrlTree(["/entry"], {
          queryParams: {
            redirect: state.url && state.url !== "/" ? state.url : "/game",
            onboarding: "1"
          }
        });
      }
    }
    return true;
  }
  return router.createUrlTree(["/entry"], {
    queryParams: state.url && state.url !== "/" ? { redirect: state.url } : void 0
  });
};
var operatorAreaGuard = async (_route, state) => {
  const injector = inject(Injector);
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const session = await sessionService.ensureSession();
  if (!session) {
    return entryRedirect(router, state.url);
  }
  const { UsersService } = await import("./users.service-XXQ5ON4Q.js");
  const usersService = injector.get(UsersService);
  const user = await usersService.loadUserById(session.kind === "demo" ? session.userId : void 0).catch(() => null);
  if (isOperatorUser(user)) {
    return true;
  }
  if (isAdminUser(user)) {
    return router.createUrlTree(["/admin"]);
  }
  if (user) {
    return router.createUrlTree(["/game"]);
  }
  return entryRedirect(router, state.url);
};
var adminAreaGuard = async (_route, state) => {
  const injector = inject(Injector);
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const session = await sessionService.ensureSession();
  if (!session) {
    return entryRedirect(router, state.url);
  }
  const { UsersService } = await import("./users.service-XXQ5ON4Q.js");
  const usersService = injector.get(UsersService);
  if (session.kind === "demo" && usersService.localModeEnabled) {
    const { AdminWorkspaceStore } = await import("./admin-workspace.store-XIW7IY5K.js");
    const adminWorkspace = injector.get(AdminWorkspaceStore);
    const userId = session.userId.trim();
    const storedAdminId = adminWorkspace.readStoredAdminId();
    if (userId && (userId === storedAdminId || userId.startsWith("admin-demo-"))) {
      return true;
    }
    return entryRedirect(router, state.url);
  }
  const user = await usersService.loadUserById(session.kind === "demo" ? session.userId : void 0).catch(() => null);
  if (isAdminUser(user)) {
    return true;
  }
  return entryRedirect(router, state.url);
};
function entryRedirect(router, redirectUrl) {
  return router.createUrlTree(["/entry"], {
    queryParams: redirectUrl && redirectUrl !== "/" ? { redirect: redirectUrl } : void 0
  });
}
function requiresProfileOnboarding(user) {
  if (!user || isAdminUser(user) || isOperatorUser(user) || user.profileStatus === "blocked" || user.profileStatus === "deleted") {
    return false;
  }
  return user.profileStatus === "onboarding" || AppUtils.positiveInteger(user.profileFormVersion) < CURRENT_PROFILE_FORM_VERSION;
}
function isAdminUser(user) {
  return user?.admin === true || `${user?.hostTier ?? ""}`.trim().toLowerCase() === "admin";
}
function isOperatorUser(user) {
  return hasOperatorRole(user);
}
function isBrowserOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}
var routes = [
  {
    path: "",
    pathMatch: "full",
    canActivate: [entryAreaGuard],
    loadComponent: loadEntryPage
  },
  {
    path: "entry",
    loadComponent: loadEntryPage
  },
  {
    path: "privacy-policy",
    loadComponent: () => import("./document-viewer.component-7Z3JHSS5.js").then((m) => m.DocumentViewerComponent),
    data: { documentKind: "privacy" }
  },
  {
    path: "terms",
    loadComponent: () => import("./document-viewer.component-7Z3JHSS5.js").then((m) => m.DocumentViewerComponent),
    data: { documentKind: "terms" }
  },
  {
    path: "admin/help/:token",
    loadComponent: () => import("./admin-help-session-page.component-2IMUTTPQ.js").then((m) => m.AdminHelpSessionPageComponent)
  },
  {
    path: "admin",
    canActivate: [adminAreaGuard],
    loadChildren: () => import("./admin.module-2JYVE3H3.js").then((m) => m.AdminModule)
  },
  {
    path: "operator",
    canActivate: [operatorAreaGuard],
    loadComponent: () => import("./operator-page.component-4RRMLSM4.js").then((m) => m.OperatorPageComponent)
  },
  {
    path: "",
    canActivate: [restrictedAreaGuard],
    children: [
      { path: "home", redirectTo: "game", pathMatch: "full" },
      {
        path: "game",
        loadComponent: () => import("./home.component-PQQQHI5I.js").then((m) => m.HomeComponent),
        data: { section: "game" }
      }
    ]
  },
  { path: "**", redirectTo: "" }
];

// src/app/shared/core/http/admin-access.interceptor.ts
var ADMIN_SESSION_STORAGE_KEY = APP_STORAGE_KEYS.adminSession;
var apiBaseUrl = (environment.apiBaseUrl ?? "/api").trim() || "/api";
function isApiRequest(url) {
  if (url.startsWith(apiBaseUrl)) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(apiBaseUrl, document.baseURI).toString();
  return url.startsWith(absoluteApiBaseUrl);
}
function isAdminRequest(url) {
  if (!isApiRequest(url)) {
    return false;
  }
  const normalizedApiBase = apiBaseUrl.replace(/\/+$/, "");
  if (url.startsWith(`${normalizedApiBase}/admin/`)) {
    return true;
  }
  if (url === `${normalizedApiBase}/admin`) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(normalizedApiBase, document.baseURI).toString().replace(/\/+$/, "");
  return url === `${absoluteApiBaseUrl}/admin` || url.startsWith(`${absoluteApiBaseUrl}/admin/`);
}
var adminAccessInterceptor = (req, next) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const userProfileStore = inject(UserProfileStore);
  return next(req).pipe(catchError((error) => {
    if (isAdminRequest(req.url) && error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
      const session = sessionService.currentSession();
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      }
      userProfileStore.setActiveUserId(session?.kind === "firebase" ? session.profile.id.trim() : "");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("adminAccessDenied"));
      }
      if (router.url.split("?")[0].startsWith("/admin")) {
        void router.navigateByUrl("/admin", { replaceUrl: true });
      }
    }
    return throwError(() => error);
  }));
};

// src/app/shared/core/http/session-mode.interceptor.ts
var DEMO_SESSION_HEADER = "X-App-Session-Kind";
var DEMO_SESSION_VALUE = "demo";
var DEMO_USER_HEADER = "X-Demo-User-Id";
var APP_SESSION_ID_HEADER = "X-App-Session-Id";
var apiBaseUrl2 = (environment.apiBaseUrl ?? "/api").trim() || "/api";
function isApiRequest2(url) {
  if (url.startsWith(apiBaseUrl2)) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(apiBaseUrl2, document.baseURI).toString();
  return url.startsWith(absoluteApiBaseUrl);
}
function isDemoSelectorRequest(url) {
  if (!isApiRequest2(url)) {
    return false;
  }
  return url.includes("/auth/demo-users");
}
function isOperatorBootstrapLoginRequest(url) {
  if (!isApiRequest2(url)) {
    return false;
  }
  const normalizedApiBase = apiBaseUrl2.replace(/\/+$/, "");
  if (url === `${normalizedApiBase}/auth/operator-bootstrap`) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(normalizedApiBase, document.baseURI).toString().replace(/\/+$/, "");
  return url === `${absoluteApiBaseUrl}/auth/operator-bootstrap`;
}
var sessionModeInterceptor = (req, next) => {
  if (!isApiRequest2(req.url) || req.headers.has(DEMO_SESSION_HEADER) || isOperatorBootstrapLoginRequest(req.url)) {
    return next(req);
  }
  const sessionService = inject(SessionService);
  const session = sessionService.currentSession();
  const isDemoRequest = session?.kind === "demo" || isDemoSelectorRequest(req.url);
  if (!isDemoRequest) {
    return next(req);
  }
  const demoUserId = session?.kind === "demo" ? session.userId.trim() : "";
  return next(req.clone({
    setHeaders: __spreadValues(__spreadValues({
      [DEMO_SESSION_HEADER]: DEMO_SESSION_VALUE
    }, demoUserId ? { [DEMO_USER_HEADER]: demoUserId } : {}), session?.kind === "demo" && session.sessionId ? { [APP_SESSION_ID_HEADER]: session.sessionId } : {})
  }));
};

// src/app/shared/core/http/firebase-auth.interceptor.ts
var apiBaseUrl3 = (environment.apiBaseUrl ?? "/api").trim() || "/api";
function isApiRequest3(url) {
  if (url.startsWith(apiBaseUrl3)) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(apiBaseUrl3, document.baseURI).toString();
  return url.startsWith(absoluteApiBaseUrl);
}
function isOperatorBootstrapLoginRequest2(url) {
  if (!isApiRequest3(url)) {
    return false;
  }
  const normalizedApiBase = apiBaseUrl3.replace(/\/+$/, "");
  if (url === `${normalizedApiBase}/auth/operator-bootstrap`) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(normalizedApiBase, document.baseURI).toString().replace(/\/+$/, "");
  return url === `${absoluteApiBaseUrl}/auth/operator-bootstrap`;
}
var firebaseAuthInterceptor = (req, next) => {
  if (!isFirebaseLoginEnabled() || req.headers.has("Authorization") || !isApiRequest3(req.url) || isOperatorBootstrapLoginRequest2(req.url)) {
    return next(req);
  }
  const sessionService = inject(SessionService);
  const session = sessionService.currentSession();
  if (session?.kind !== "firebase" || req.headers.get(DEMO_SESSION_HEADER)?.toLowerCase() === DEMO_SESSION_VALUE) {
    return next(req);
  }
  return from(sessionService.getFirebaseIdToken()).pipe(switchMap((token) => {
    if (!token) {
      return next(req);
    }
    return next(req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        [FirebaseSessionRegistryService.SESSION_ID_HEADER]: session.sessionId
      }
    }));
  }));
};

// src/app/shared/core/http/operator-bootstrap-auth.interceptor.ts
var apiBaseUrl4 = (environment.apiBaseUrl ?? "/api").trim() || "/api";
var operatorBootstrapLoginPath = "/auth/operator-bootstrap";
function isApiRequest4(url) {
  if (url.startsWith(apiBaseUrl4)) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(apiBaseUrl4, document.baseURI).toString();
  return url.startsWith(absoluteApiBaseUrl);
}
function isOperatorBootstrapLoginRequest3(url) {
  const normalizedApiBase = apiBaseUrl4.replace(/\/+$/, "");
  if (url === `${normalizedApiBase}${operatorBootstrapLoginPath}`) {
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const absoluteApiBaseUrl = new URL(normalizedApiBase, document.baseURI).toString().replace(/\/+$/, "");
  return url === `${absoluteApiBaseUrl}${operatorBootstrapLoginPath}`;
}
var operatorBootstrapAuthInterceptor = (req, next) => {
  if (req.headers.has("Authorization") || !isApiRequest4(req.url) || isOperatorBootstrapLoginRequest3(req.url)) {
    return next(req);
  }
  const sessionService = inject(SessionService);
  if (sessionService.currentSession()?.kind !== "operator-bootstrap") {
    return next(req);
  }
  const token = sessionService.getOperatorBootstrapToken();
  if (!token) {
    return next(req);
  }
  return next(req.clone({
    setHeaders: {
      Authorization: `OperatorBootstrap ${token}`
    }
  })).pipe(catchError((error) => {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      sessionService.clearOperatorBootstrapSession();
    }
    return throwError(() => error);
  }));
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      sessionModeInterceptor,
      operatorBootstrapAuthInterceptor,
      firebaseAuthInterceptor,
      adminAccessInterceptor
    ]))
  ]
};

// src/app/shared/core/base/services/pwa.service.ts
function resolvePwaDevServiceWorkerOverride(search, production) {
  if (production) {
    return null;
  }
  const override = new URLSearchParams(search).get("pwa");
  if (override === "on") {
    return "enabled";
  }
  if (override === "off") {
    return "disabled";
  }
  return null;
}
var PwaService = class _PwaService {
  static DEV_OVERRIDE_STORAGE_KEY = APP_STORAGE_KEYS.pwaDevServiceWorker;
  static INSTALL_DISMISSED_STORAGE_KEY = APP_STORAGE_KEYS.pwaInstallPromptDismissed;
  static UPDATE_RELOAD_ATTEMPT_STORAGE_KEY = APP_STORAGE_KEYS.pwaUpdateReloadAttempt;
  static BUILD_ID_META_NAME = "myscoutee-build-id";
  static APP_VERSION_URL = "app-version.json";
  static CACHE_PREFIX = APP_CACHE_KEYS.runtimePrefix;
  static WORKER_INSTALL_TIMEOUT_MS = 1e4;
  static WORKER_ACTIVATION_TIMEOUT_MS = 4e3;
  injector = inject(Injector);
  installPromptRef = signal(null, ...ngDevMode ? [{ debugName: "installPromptRef" }] : (
    /* istanbul ignore next */
    []
  ));
  installBusyRef = signal(false, ...ngDevMode ? [{ debugName: "installBusyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  installDismissedRef = signal(this.loadInstallDismissed(), ...ngDevMode ? [{ debugName: "installDismissedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  registrationRef = signal(null, ...ngDevMode ? [{ debugName: "registrationRef" }] : (
    /* istanbul ignore next */
    []
  ));
  initialized = false;
  onBeforeInstallPrompt = (event) => {
    const promptEvent = event;
    promptEvent.preventDefault();
    this.installPromptRef.set(promptEvent);
  };
  onAppInstalled = () => {
    this.installPromptRef.set(null);
    this.installBusyRef.set(false);
    this.setInstallDismissed(true);
  };
  installBusy = this.installBusyRef.asReadonly();
  installAvailable = computed(() => this.installPromptRef() !== null && !this.isStandalone(), ...ngDevMode ? [{ debugName: "installAvailable" }] : (
    /* istanbul ignore next */
    []
  ));
  installPromptVisible = computed(() => this.installAvailable() && !this.installDismissedRef() && !this.isStandalone(), ...ngDevMode ? [{ debugName: "installPromptVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  serviceWorkerRegistration = this.registrationRef.asReadonly();
  async initialize() {
    if (this.initialized || typeof window === "undefined") {
      return;
    }
    this.initialized = true;
    this.applyDevOverrideFromQuery();
    window.addEventListener("beforeinstallprompt", this.onBeforeInstallPrompt);
    window.addEventListener("appinstalled", this.onAppInstalled);
    if (this.shouldEnableServiceWorker()) {
      await this.registerServiceWorker();
    } else {
      await this.unregisterServiceWorkers();
    }
  }
  isStandalone() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }
  async promptInstall() {
    const promptEvent = this.installPromptRef();
    if (!promptEvent || this.installBusyRef()) {
      return false;
    }
    this.installBusyRef.set(true);
    try {
      await promptEvent.prompt();
      const outcome = await promptEvent.userChoice;
      const accepted = outcome?.outcome === "accepted";
      this.installPromptRef.set(null);
      this.setInstallDismissed(!accepted);
      return accepted;
    } catch {
      return false;
    } finally {
      this.installBusyRef.set(false);
    }
  }
  async requestNotificationRegistrationForActiveUser() {
    if (!this.shouldEnableNotificationRegistration()) {
      return;
    }
    const { FirebaseMessagingService } = await import("./firebase-messaging.service-3XA6ZYEX.js");
    await this.injector.get(FirebaseMessagingService).requestAndRegisterForActiveUser();
  }
  dismissInstallPrompt() {
    this.installPromptRef.set(null);
    this.setInstallDismissed(true);
  }
  async waitForServiceWorkerReady() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return null;
    }
    const existing = this.registrationRef();
    if (existing) {
      return existing;
    }
    if (!this.shouldEnableServiceWorker()) {
      return null;
    }
    try {
      return await navigator.serviceWorker.ready;
    } catch {
      return null;
    }
  }
  shouldEnableServiceWorker() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return false;
    }
    if (environment.serviceWorkerEnabled) {
      return true;
    }
    return localStorage.getItem(_PwaService.DEV_OVERRIDE_STORAGE_KEY) === "enabled";
  }
  shouldEnableNotificationRegistration() {
    return environment.activitiesDataSource === "http" && environment.firebaseMessagingEnabled && !this.isLoopbackBrowserHost();
  }
  isLoopbackBrowserHost() {
    if (typeof window === "undefined") {
      return false;
    }
    const hostname = window.location.hostname.toLowerCase();
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1" || hostname.endsWith(".localhost");
  }
  async registerServiceWorker() {
    const serviceWorkerUrl = new URL("app-sw.js", document.baseURI).toString();
    const registration = await navigator.serviceWorker.register(serviceWorkerUrl, {
      updateViaCache: "none"
    });
    this.registrationRef.set(registration);
    await this.checkForPageLoadBundleUpdate(registration);
  }
  async checkForPageLoadBundleUpdate(registration) {
    if (!environment.production || typeof document === "undefined") {
      return;
    }
    const currentBuildId = this.readDocumentBuildId();
    if (!currentBuildId) {
      await registration.update().catch(() => void 0);
      return;
    }
    const latestBuildId = await this.fetchLatestBuildId();
    if (!latestBuildId || latestBuildId === currentBuildId) {
      this.clearReloadAttempt();
      await registration.update().catch(() => void 0);
      return;
    }
    const attemptKey = `${currentBuildId}->${latestBuildId}`;
    if (this.reloadWasAlreadyAttempted(attemptKey)) {
      return;
    }
    await registration.update().catch(() => void 0);
    const waitingWorker = await this.waitForWaitingWorker(registration);
    if (!waitingWorker) {
      return;
    }
    this.markReloadAttempted(attemptKey);
    await this.activateWaitingWorker(waitingWorker);
    window.location.reload();
  }
  async waitForWaitingWorker(registration) {
    if (registration.waiting) {
      return registration.waiting;
    }
    const installingWorker = registration.installing;
    if (!installingWorker) {
      return null;
    }
    return await new Promise((resolve) => {
      let settled = false;
      const finish = (worker) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeoutId);
        installingWorker.removeEventListener("statechange", onStateChange);
        resolve(worker);
      };
      const onStateChange = () => {
        if (registration.waiting) {
          finish(registration.waiting);
          return;
        }
        if (installingWorker.state === "redundant" || installingWorker.state === "activated") {
          finish(null);
        }
      };
      const timeoutId = window.setTimeout(() => finish(registration.waiting), _PwaService.WORKER_INSTALL_TIMEOUT_MS);
      installingWorker.addEventListener("statechange", onStateChange);
      onStateChange();
    });
  }
  async activateWaitingWorker(worker) {
    const controllerChanged = new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeoutId);
        navigator.serviceWorker.removeEventListener("controllerchange", finish);
        resolve();
      };
      const timeoutId = window.setTimeout(finish, _PwaService.WORKER_ACTIVATION_TIMEOUT_MS);
      navigator.serviceWorker.addEventListener("controllerchange", finish);
    });
    worker.postMessage({ type: "SKIP_WAITING" });
    await controllerChanged;
  }
  readDocumentBuildId() {
    const selector = `meta[name="${_PwaService.BUILD_ID_META_NAME}"]`;
    const meta = document.querySelector(selector);
    return this.normalizeBuildId(meta?.content);
  }
  async fetchLatestBuildId() {
    try {
      const versionUrl = new URL(_PwaService.APP_VERSION_URL, document.baseURI).toString();
      const response = await fetch(versionUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      });
      if (!response.ok) {
        return "";
      }
      const payload = await response.json();
      return this.normalizeBuildId(payload.buildId);
    } catch {
      return "";
    }
  }
  normalizeBuildId(value) {
    return typeof value === "string" ? value.trim() : "";
  }
  reloadWasAlreadyAttempted(attemptKey) {
    if (typeof sessionStorage === "undefined") {
      return this.isReloadNavigation();
    }
    try {
      return sessionStorage.getItem(_PwaService.UPDATE_RELOAD_ATTEMPT_STORAGE_KEY) === attemptKey;
    } catch {
      return this.isReloadNavigation();
    }
  }
  isReloadNavigation() {
    if (typeof performance === "undefined") {
      return false;
    }
    const navigation = performance.getEntriesByType("navigation")[0];
    return navigation?.type === "reload";
  }
  markReloadAttempted(attemptKey) {
    if (typeof sessionStorage === "undefined") {
      return;
    }
    try {
      sessionStorage.setItem(_PwaService.UPDATE_RELOAD_ATTEMPT_STORAGE_KEY, attemptKey);
    } catch {
    }
  }
  clearReloadAttempt() {
    if (typeof sessionStorage === "undefined") {
      return;
    }
    try {
      sessionStorage.removeItem(_PwaService.UPDATE_RELOAD_ATTEMPT_STORAGE_KEY);
    } catch {
    }
  }
  async unregisterServiceWorkers() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.filter((name) => name.startsWith(_PwaService.CACHE_PREFIX)).map((name) => caches.delete(name)));
    }
    this.registrationRef.set(null);
  }
  applyDevOverrideFromQuery() {
    const override = resolvePwaDevServiceWorkerOverride(window.location.search, environment.production);
    if (override === "enabled") {
      localStorage.setItem(_PwaService.DEV_OVERRIDE_STORAGE_KEY, "enabled");
      return;
    }
    if (override === "disabled") {
      localStorage.removeItem(_PwaService.DEV_OVERRIDE_STORAGE_KEY);
    }
  }
  loadInstallDismissed() {
    if (typeof localStorage === "undefined") {
      return false;
    }
    return localStorage.getItem(_PwaService.INSTALL_DISMISSED_STORAGE_KEY) === "1";
  }
  setInstallDismissed(dismissed) {
    this.installDismissedRef.set(dismissed);
    if (typeof localStorage === "undefined") {
      return;
    }
    if (dismissed) {
      localStorage.setItem(_PwaService.INSTALL_DISMISSED_STORAGE_KEY, "1");
      return;
    }
    localStorage.removeItem(_PwaService.INSTALL_DISMISSED_STORAGE_KEY);
  }
  static \u0275fac = function PwaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PwaService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PwaService, factory: _PwaService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PwaService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/app-location.service.ts
var AppLocationService = class _AppLocationService {
  static ACCESS_RESTRICTED_TITLE = "Please register";
  static ACCESS_RESTRICTED_MESSAGE = "Login is currently unavailable from your country or region for security reasons. Please come back later.";
  static LOCATION_SYNC_DISTANCE_METERS = 5e3;
  userProfileStore = inject(UserProfileStore);
  injector = inject(Injector);
  router = inject(Router);
  sessionService = inject(SessionService);
  dialogStore = inject(DialogStore);
  httpUsersServicePromise = null;
  syncingUserIds = /* @__PURE__ */ new Set();
  blockedUserIds = /* @__PURE__ */ new Set();
  pendingCoordinatesByUserId = /* @__PURE__ */ new Map();
  lastPersistedCoordinatesByUserId = /* @__PURE__ */ new Map();
  geolocationWatchId = null;
  geolocationWatchUserId = "";
  initialized = false;
  initialize() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    effect(() => {
      const activeUserId = this.userProfileStore.activeUserId().trim();
      if (!activeUserId) {
        this.stopCoordinateWatch();
        return;
      }
      const activeUser = this.resolveTrackedUser(activeUserId);
      if (!activeUser) {
        return;
      }
      if (activeUser.admin === true) {
        this.stopCoordinateWatch();
        return;
      }
      this.runLocationSyncFlow(activeUserId, activeUser);
    });
  }
  resolveTrackedUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const activeUser = this.userProfileStore.activeUserProfile();
    if (activeUser?.id?.trim() === normalizedUserId) {
      return activeUser;
    }
    const cachedUser = this.userProfileStore.getUserProfile(normalizedUserId);
    if (cachedUser) {
      return cachedUser;
    }
    const session = this.sessionService.currentSession();
    if (session?.kind !== "firebase" || session.profile.id.trim() !== normalizedUserId) {
      return null;
    }
    const bootstrapUser = this.buildFirebaseBootstrapUser(session.profile.id, session.profile.name, session.profile.initials, session.profile.imageUrl);
    this.userProfileStore.setUserProfile(bootstrapUser);
    return bootstrapUser;
  }
  buildFirebaseBootstrapUser(userId, name, initials, imageUrl) {
    return {
      id: userId.trim(),
      name: name.trim() || "Firebase User",
      age: 0,
      birthday: "",
      city: "",
      height: "",
      physique: "",
      languages: [],
      horoscope: "",
      initials: initials.trim() || "U",
      gender: "woman",
      statusText: "",
      hostTier: "",
      traitLabel: "",
      completion: 0,
      headline: "",
      about: "",
      images: imageUrl?.trim() ? [imageUrl.trim()] : [],
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
        feedback: 0
      }
    };
  }
  runLocationSyncFlow(userId, activeUser) {
    if (!activeUser?.id?.trim() || activeUser.admin === true) {
      return;
    }
    if (activeUser.profileStatus === "onboarding") {
      this.stopCoordinateWatch();
      return;
    }
    this.primePersistedCoordinates(userId, activeUser.locationCoordinates);
    const stored = this.readStoredCoordinates(userId);
    if (stored && !this.sameCoordinates(activeUser.locationCoordinates, stored)) {
      this.userProfileStore.setUserProfile(__spreadProps(__spreadValues({}, activeUser), {
        locationCoordinates: stored
      }));
    }
    const effectiveCoordinates = stored ?? activeUser.locationCoordinates;
    if (effectiveCoordinates) {
      this.queueLocationSyncForActiveUser(userId, activeUser, effectiveCoordinates);
    }
    this.ensureCoordinateWatch(userId);
  }
  ensureCoordinateWatch(userId) {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    if (this.geolocationWatchId !== null && this.geolocationWatchUserId === userId) {
      return;
    }
    this.stopCoordinateWatch();
    this.geolocationWatchUserId = userId;
    this.geolocationWatchId = navigator.geolocation.watchPosition((position) => {
      const coordinates = this.normalizeCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      if (!coordinates) {
        return;
      }
      this.handleStreamedCoordinates(userId, coordinates);
    }, () => void 0, {
      enableHighAccuracy: true,
      timeout: 15e3,
      maximumAge: 60 * 1e3
    });
  }
  stopCoordinateWatch() {
    if (typeof navigator !== "undefined" && navigator.geolocation && this.geolocationWatchId !== null) {
      navigator.geolocation.clearWatch(this.geolocationWatchId);
    }
    this.geolocationWatchId = null;
    this.geolocationWatchUserId = "";
  }
  handleStreamedCoordinates(userId, coordinates) {
    this.storeCoordinates(userId, coordinates);
    const activeUser = this.resolveTrackedUser(userId);
    if (!activeUser?.id?.trim()) {
      return;
    }
    this.userProfileStore.setUserProfile(__spreadProps(__spreadValues({}, activeUser), {
      locationCoordinates: coordinates
    }));
    this.queueLocationSyncForActiveUser(userId, activeUser, coordinates);
  }
  readStoredCoordinates(userId) {
    if (typeof localStorage === "undefined") {
      return null;
    }
    try {
      const raw = localStorage.getItem(this.storageKey(userId));
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!Number.isFinite(parsed.latitude) || !Number.isFinite(parsed.longitude)) {
        return null;
      }
      return {
        latitude: Number(parsed.latitude),
        longitude: Number(parsed.longitude)
      };
    } catch {
      return null;
    }
  }
  storeCoordinates(userId, coordinates) {
    if (typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(this.storageKey(userId), JSON.stringify(coordinates));
    } catch {
    }
  }
  sameCoordinates(current, next) {
    if (!current || !next) {
      return false;
    }
    return current.latitude === next.latitude && current.longitude === next.longitude;
  }
  normalizeCoordinates(coordinates) {
    const latitude = Number(coordinates?.latitude);
    const longitude = Number(coordinates?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    return {
      latitude,
      longitude
    };
  }
  primePersistedCoordinates(userId, coordinates) {
    if (this.lastPersistedCoordinatesByUserId.has(userId)) {
      return;
    }
    const normalized = this.normalizeCoordinates(coordinates);
    if (!normalized) {
      return;
    }
    this.lastPersistedCoordinatesByUserId.set(userId, normalized);
  }
  shouldPersistCoordinates(userId, coordinates) {
    const lastPersisted = this.lastPersistedCoordinatesByUserId.get(userId);
    if (!lastPersisted) {
      return true;
    }
    return this.distanceMeters(lastPersisted, coordinates) >= _AppLocationService.LOCATION_SYNC_DISTANCE_METERS;
  }
  distanceMeters(left, right) {
    const earthRadiusMeters = 6371e3;
    const latitudeDelta = this.toRadians(right.latitude - left.latitude);
    const longitudeDelta = this.toRadians(right.longitude - left.longitude);
    const leftLatitude = this.toRadians(left.latitude);
    const rightLatitude = this.toRadians(right.latitude);
    const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(leftLatitude) * Math.cos(rightLatitude) * Math.sin(longitudeDelta / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMeters * c;
  }
  toRadians(value) {
    return value * (Math.PI / 180);
  }
  queueLocationSyncForActiveUser(userId, activeUser, coordinates) {
    const normalizedCoordinates = this.normalizeCoordinates(coordinates);
    if (this.isLocalUserRouteEnabled() || !this.isActiveFirebaseMemberSession(userId) || !activeUser?.id?.trim() || activeUser.admin === true || !normalizedCoordinates) {
      return;
    }
    this.pendingCoordinatesByUserId.set(userId, normalizedCoordinates);
    if (this.syncingUserIds.has(userId)) {
      return;
    }
    void this.flushPendingLocationSync(userId, activeUser);
  }
  isActiveFirebaseMemberSession(userId) {
    const normalizedUserId = userId.trim();
    const session = this.sessionService.currentSession();
    return Boolean(normalizedUserId && session?.kind === "firebase" && session.profile.id.trim() === normalizedUserId);
  }
  async flushPendingLocationSync(userId, fallbackUser) {
    if (this.isLocalUserRouteEnabled() || !fallbackUser?.id?.trim() || fallbackUser.admin === true || this.syncingUserIds.has(userId)) {
      return;
    }
    const normalizedCoordinates = this.pendingCoordinatesByUserId.get(userId);
    if (!normalizedCoordinates) {
      return;
    }
    if (!this.shouldPersistCoordinates(userId, normalizedCoordinates)) {
      this.pendingCoordinatesByUserId.delete(userId);
      return;
    }
    this.pendingCoordinatesByUserId.delete(userId);
    this.syncingUserIds.add(userId);
    try {
      const currentUser = this.resolveTrackedUser(userId) ?? fallbackUser;
      if (currentUser.admin === true) {
        return;
      }
      const savedUser = await (await this.httpUsersService()).saveUserProfile(__spreadProps(__spreadValues({}, currentUser), {
        locationCoordinates: normalizedCoordinates
      }));
      if (savedUser?.id?.trim()) {
        this.userProfileStore.setUserProfile(savedUser);
        this.lastPersistedCoordinatesByUserId.set(userId, this.normalizeCoordinates(savedUser.locationCoordinates) ?? normalizedCoordinates);
      } else {
        this.lastPersistedCoordinatesByUserId.set(userId, normalizedCoordinates);
      }
    } catch (error) {
      if (this.isIneligibleRegionError(error)) {
        if (!this.blockedUserIds.has(userId)) {
          this.blockedUserIds.add(userId);
          this.dialogStore.openInfo(this.resolveIneligibleRegionMessage(error), {
            title: _AppLocationService.ACCESS_RESTRICTED_TITLE,
            confirmLabel: "OK",
            allowBackdropClose: false,
            allowEscapeClose: false,
            onConfirm: async () => {
              await this.sessionService.logout();
              await this.router.navigateByUrl(this.router.url.split("?")[0].startsWith("/admin") ? "/admin" : "/entry");
            }
          });
        }
      }
    } finally {
      this.syncingUserIds.delete(userId);
      if (this.pendingCoordinatesByUserId.has(userId)) {
        void this.flushPendingLocationSync(userId, this.resolveTrackedUser(userId) ?? fallbackUser);
      }
    }
  }
  isIneligibleRegionError(error) {
    return error instanceof HttpErrorResponse && (error.status === 403 || error.status === 422);
  }
  isLocalUserRouteEnabled() {
    const routeConfig = resolveRouteConfig("/auth/me");
    if (routeConfig.mode) {
      return routeConfig.mode === "local";
    }
    if (routeConfig.http) {
      return false;
    }
    return environment.activitiesDataSource !== "http";
  }
  async httpUsersService() {
    if (!this.httpUsersServicePromise) {
      this.httpUsersServicePromise = import("./users.service-ICK4V5I4.js").then((module) => this.injector.get(module.HttpUsersService));
    }
    return this.httpUsersServicePromise;
  }
  resolveIneligibleRegionMessage(error) {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = typeof error.error?.message === "string" ? error.error.message.trim() : "";
      if (backendMessage) {
        return backendMessage;
      }
      const topLevelMessage = typeof error.message === "string" ? error.message.trim() : "";
      if (topLevelMessage) {
        return topLevelMessage;
      }
    }
    return _AppLocationService.ACCESS_RESTRICTED_MESSAGE;
  }
  storageKey(userId) {
    return appLocationStorageKey(userId);
  }
  static \u0275fac = function AppLocationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppLocationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppLocationService, factory: _AppLocationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppLocationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/app.ts
function App_Conditional_4_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function App_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, App_Conditional_4_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 6);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function App_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, App_Conditional_4_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.sideMenuComponent()) ? 0 : -1, tmp_1_0);
  }
}
function App_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl);
  }
}
function App_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 5)(1, "span", 7);
    \u0275\u0275element(2, "span", 8);
    \u0275\u0275conditionalCreate(3, App_Conditional_6_Conditional_3_Template, 1, 1, "img", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 10);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", "Loading " + ctx_r0.deploymentBranding().productName);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_2_0 = ctx_r0.deploymentBranding().logoUrl) ? 3 : -1, tmp_2_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.deploymentBranding().productName);
  }
}
var App = class _App {
  static ROUTE_WARMUP_MAX_VISIBLE_MS = 6e3;
  static MOBILE_RESUME_RECOVERY_DELAY_MS = 280;
  static ACTION_WAVE_TARGET_SELECTOR = [
    'button[class*="close" i]',
    'button[class*="back" i]',
    'button[aria-label*="close" i]',
    'button[aria-label*="back" i]',
    'button[aria-label*="cancel" i]',
    'button[aria-label*="dismiss" i]',
    'button[aria-label*="bez\xE1r" i]',
    'button[aria-label*="vissza" i]',
    'button[aria-label*="m\xE9gsem" i]',
    'button[title*="close" i]',
    'button[title*="cancel" i]',
    'button[data-close-action="true"]',
    'button[data-action-wave="true"]'
  ].join(",");
  static ACTION_WAVE_DURATION_MS = 520;
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  pwaService = inject(PwaService);
  i18nService = inject(I18nService);
  appLocationService = inject(AppLocationService);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  routerEventsSubscription;
  sideMenuComponentRef = signal(null, ...ngDevMode ? [{ debugName: "sideMenuComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  sideMenuComponentLoadPromise = null;
  routeWarmupHideTimer = null;
  routeWarmupWatchdogTimer = null;
  mobileResumeRecoveryTimer = null;
  initialLandingWarmupPending = false;
  showSideMenu = false;
  sideMenuComponent = this.sideMenuComponentRef.asReadonly();
  routeWarmupVisible = false;
  installPromptVisible = this.pwaService.installPromptVisible;
  deploymentBranding = this.deploymentConfiguration.branding;
  installPromptBusy = this.pwaService.installBusy;
  installPromptModel = computed(() => {
    const visible = this.installPromptVisible();
    const busy = this.installPromptBusy();
    const branding = this.deploymentBranding();
    this.i18nService.revision();
    const title = this.i18nService.translateParams("add.myscoutee.to.your.home.screen", { productName: branding.productName });
    return {
      visible,
      busy,
      tone: "info",
      icon: branding.logoUrl ? {
        kind: "image",
        src: branding.logoUrl,
        alt: ""
      } : null,
      title,
      description: this.i18nService.translateParams("install.prompt.description", { productName: branding.productName }),
      ariaLabel: title,
      closeAriaLabel: this.i18nService.translate("dismiss", "Dismiss"),
      action: {
        icon: "add_to_home_screen",
        label: this.i18nService.translate("add.to.home.screen"),
        busyLabel: this.i18nService.translate("opening"),
        ariaLabel: this.i18nService.translate("add.to.home.screen")
      }
    };
  }, ...ngDevMode ? [{ debugName: "installPromptModel" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    const initialRouteUrl = this.resolveInitialRouteUrl();
    this.i18nService.initialize();
    this.appLocationService.initialize();
    void this.deploymentConfiguration.initialize();
    void this.pwaService.initialize();
    this.syncSideMenuVisibility(initialRouteUrl);
    this.initialLandingWarmupPending = this.shouldShowLandingWarmup(initialRouteUrl);
    this.routeWarmupVisible = this.initialLandingWarmupPending;
    if (this.routeWarmupVisible) {
      this.scheduleRouteWarmupWatchdog();
    }
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.syncSideMenuVisibility(event.url);
        if (this.initialLandingWarmupPending && this.shouldShowLandingWarmup(event.url)) {
          this.showRouteWarmup();
        } else {
          this.hideRouteWarmup(0);
        }
        return;
      }
      if (event instanceof NavigationEnd) {
        this.syncSideMenuVisibility(event.urlAfterRedirects);
        this.completeInitialLandingWarmup();
        return;
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.completeInitialLandingWarmup(0);
      }
    });
  }
  ngOnDestroy() {
    this.clearRouteWarmupHideTimer();
    this.clearRouteWarmupWatchdogTimer();
    this.clearMobileResumeRecoveryTimer();
    this.routerEventsSubscription.unsubscribe();
  }
  onPageShow() {
    this.scheduleMobileResumeRecovery();
  }
  onWindowFocus() {
    this.scheduleMobileResumeRecovery();
  }
  onDocumentVisibilityChange() {
    this.scheduleMobileResumeRecovery();
  }
  onDocumentPointerDown(event) {
    this.showActionWave(event);
  }
  syncSideMenuVisibility(url) {
    this.showSideMenu = this.shouldShowSideMenu(url);
    if (this.showSideMenu) {
      void this.ensureSideMenuComponentLoaded();
    }
  }
  async ensureSideMenuComponentLoaded() {
    if (this.sideMenuComponentRef()) {
      return;
    }
    if (this.sideMenuComponentLoadPromise) {
      return this.sideMenuComponentLoadPromise;
    }
    this.sideMenuComponentLoadPromise = import("./side-menu.component-RZCMX7DP.js").then((module) => {
      this.sideMenuComponentRef.set(module.SideMenuComponent);
    }).finally(() => {
      this.sideMenuComponentLoadPromise = null;
    });
    return this.sideMenuComponentLoadPromise;
  }
  showActionWave(event) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest(_App.ACTION_WAVE_TARGET_SELECTOR);
    if (!button || button.disabled || button.getAttribute("aria-disabled") === "true") {
      return;
    }
    if (button.querySelector(".navigator-action-ripple, .mat-ripple, .mat-mdc-button-persistent-ripple")) {
      return;
    }
    const surface = button.querySelector('[data-action-wave-surface="true"]') ?? button;
    const rect = surface.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const size = Math.max(rect.width, rect.height) * 2.4;
    const ripple = document.createElement("span");
    ripple.className = "app-global-action-wave";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    surface.appendChild(ripple);
    setTimeout(() => ripple.remove(), _App.ACTION_WAVE_DURATION_MS);
  }
  shouldShowSideMenu(url) {
    const normalizedPath = (url || "/").split("?")[0].trim() || "/";
    return normalizedPath !== "/" && !normalizedPath.startsWith("/entry") && !normalizedPath.startsWith("/admin/help");
  }
  onRouteActivated() {
    setTimeout(() => this.completeInitialLandingWarmup(), 0);
  }
  shouldShowLandingWarmup(url) {
    const normalizedPath = (url || "/").split("?")[0].split("#")[0].trim() || "/";
    return normalizedPath === "/" || normalizedPath.startsWith("/entry");
  }
  showRouteWarmup() {
    this.clearRouteWarmupHideTimer();
    this.routeWarmupVisible = true;
    this.scheduleRouteWarmupWatchdog();
  }
  completeInitialLandingWarmup(delayMs = 120) {
    this.initialLandingWarmupPending = false;
    this.hideRouteWarmup(delayMs);
  }
  hideRouteWarmup(delayMs = 120) {
    this.clearRouteWarmupHideTimer();
    this.clearRouteWarmupWatchdogTimer();
    if (delayMs <= 0) {
      this.routeWarmupVisible = false;
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.routeWarmupHideTimer = setTimeout(() => {
      this.routeWarmupVisible = false;
      this.routeWarmupHideTimer = null;
      this.changeDetectorRef.detectChanges();
    }, delayMs);
  }
  clearRouteWarmupHideTimer() {
    if (!this.routeWarmupHideTimer) {
      return;
    }
    clearTimeout(this.routeWarmupHideTimer);
    this.routeWarmupHideTimer = null;
  }
  scheduleRouteWarmupWatchdog() {
    this.clearRouteWarmupWatchdogTimer();
    this.routeWarmupWatchdogTimer = setTimeout(() => {
      this.routeWarmupWatchdogTimer = null;
      if (!this.routeWarmupVisible) {
        return;
      }
      this.completeInitialLandingWarmup(0);
    }, _App.ROUTE_WARMUP_MAX_VISIBLE_MS);
  }
  clearRouteWarmupWatchdogTimer() {
    if (!this.routeWarmupWatchdogTimer) {
      return;
    }
    clearTimeout(this.routeWarmupWatchdogTimer);
    this.routeWarmupWatchdogTimer = null;
  }
  scheduleMobileResumeRecovery() {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    this.clearMobileResumeRecoveryTimer();
    this.mobileResumeRecoveryTimer = setTimeout(() => {
      this.mobileResumeRecoveryTimer = null;
      this.recoverAfterMobileResume();
    }, _App.MOBILE_RESUME_RECOVERY_DELAY_MS);
  }
  recoverAfterMobileResume() {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    this.syncSideMenuVisibility(this.resolveInitialRouteUrl());
    if (this.routeWarmupVisible) {
      this.completeInitialLandingWarmup(0);
    }
  }
  clearMobileResumeRecoveryTimer() {
    if (!this.mobileResumeRecoveryTimer) {
      return;
    }
    clearTimeout(this.mobileResumeRecoveryTimer);
    this.mobileResumeRecoveryTimer = null;
  }
  resolveInitialRouteUrl() {
    if (typeof window === "undefined") {
      return this.router.url || "/";
    }
    const routePath = this.stripBasePath(window.location.pathname || "/");
    return `${routePath}${window.location.search}${window.location.hash}` || "/";
  }
  stripBasePath(pathname) {
    const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const baseHref = document.querySelector("base")?.getAttribute("href") ?? "/";
    try {
      const basePath = new URL(baseHref, window.location.origin).pathname;
      if (basePath !== "/" && normalizedPathname.startsWith(basePath)) {
        return `/${normalizedPathname.slice(basePath.length)}`.replace("//", "/") || "/";
      }
    } catch {
      return normalizedPathname;
    }
    return normalizedPathname;
  }
  async onInstallRequested() {
    const accepted = await this.pwaService.promptInstall();
    if (accepted) {
      await this.pwaService.requestNotificationRegistrationForActiveUser();
    }
  }
  onInstallDismissed() {
    this.pwaService.dismissInstallPrompt();
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], hostBindings: function App_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("pageshow", function App_pageshow_HostBindingHandler() {
        return ctx.onPageShow();
      }, \u0275\u0275resolveWindow)("focus", function App_focus_HostBindingHandler() {
        return ctx.onWindowFocus();
      }, \u0275\u0275resolveWindow)("visibilitychange", function App_visibilitychange_HostBindingHandler() {
        return ctx.onDocumentVisibilityChange();
      }, \u0275\u0275resolveDocument)("pointerdown", function App_pointerdown_HostBindingHandler($event) {
        return ctx.onDocumentPointerDown($event);
      }, \u0275\u0275resolveDocument);
    }
  }, decls: 7, vars: 13, consts: [[1, "main"], [1, "content"], [1, "content-area"], [3, "activate"], [3, "action", "dismiss", "model"], ["role", "status", "aria-live", "polite", 1, "app-route-warmup"], [4, "ngComponentOutlet"], [1, "app-route-warmup__mark"], ["aria-hidden", "true", 1, "app-route-warmup__ring"], ["alt", "", 3, "src"], [1, "app-route-warmup__label"]], template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "main", 0)(1, "div", 1)(2, "section", 2)(3, "router-outlet", 3);
      \u0275\u0275listener("activate", function App_Template_router_outlet_activate_3_listener() {
        return ctx.onRouteActivated();
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(4, App_Conditional_4_Template, 1, 1);
      \u0275\u0275elementStart(5, "app-prompt", 4);
      \u0275\u0275listener("action", function App_Template_app_prompt_action_5_listener() {
        return ctx.onInstallRequested();
      })("dismiss", function App_Template_app_prompt_dismiss_5_listener() {
        return ctx.onInstallDismissed();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, App_Conditional_6_Template, 6, 3, "section", 5);
    }
    if (rf & 2) {
      \u0275\u0275classProp("main-public", !ctx.showSideMenu);
      \u0275\u0275advance();
      \u0275\u0275classProp("content-single", ctx.showSideMenu)("content-public", !ctx.showSideMenu);
      \u0275\u0275advance();
      \u0275\u0275classProp("content-area-full", ctx.showSideMenu)("content-area-public", !ctx.showSideMenu);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showSideMenu ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.installPromptModel());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.routeWarmupVisible ? 6 : -1);
    }
  }, dependencies: [
    RouterOutlet,
    NgComponentOutlet,
    PromptComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  --bg-soft: #f3f6ff;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-route-warmup[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 3000;\n  min-height: 100vh;\n  min-height: 100dvh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  box-sizing: border-box;\n  padding: 1.25rem;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 247, 253, 0.96) 46%,\n      rgba(239, 244, 255, 0.98) 100%);\n  color: #1f3a63;\n  text-align: center;\n}\n.app-route-warmup__mark[_ngcontent-%COMP%] {\n  position: relative;\n  width: 76px;\n  height: 76px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background: #ffffff;\n  box-shadow: 0 18px 34px rgba(36, 65, 110, 0.16);\n}\n.app-route-warmup__mark[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 46px;\n  height: 46px;\n  display: block;\n  object-fit: contain;\n}\n.app-route-warmup__ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -5px;\n  border-radius: inherit;\n  background:\n    conic-gradient(\n      from 40deg,\n      #4f7cff 0deg,\n      #7b5cff 120deg,\n      #ff4d8d 230deg,\n      rgba(79, 124, 255, 0.08) 310deg,\n      #4f7cff 360deg);\n  animation: _ngcontent-%COMP%_app-route-warmup-spin 0.95s linear infinite;\n}\n.app-route-warmup__ring[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 6px;\n  border-radius: inherit;\n  background: #ffffff;\n}\n.app-route-warmup__label[_ngcontent-%COMP%] {\n  color: var(--deployment-brand-text);\n  font-size: 1rem;\n  font-weight: 900;\n  letter-spacing: 0;\n}\n@keyframes _ngcontent-%COMP%_app-route-warmup-spin {\n  to {\n    transform: rotate(1turn);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-route-warmup__ring[_ngcontent-%COMP%] {\n    animation-duration: 1.8s;\n  }\n}\n.main[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 100vh;\n  height: 100vh;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n  box-sizing: inherit;\n  position: relative;\n  background:\n    radial-gradient(\n      circle at 15% 10%,\n      rgba(73, 111, 182, 0.16),\n      transparent 35%),\n    radial-gradient(\n      circle at 85% 0%,\n      rgba(80, 174, 199, 0.12),\n      transparent 32%),\n    var(--bg-soft);\n}\n.main.main-public[_ngcontent-%COMP%] {\n  height: auto;\n  min-height: 100vh;\n  background: transparent;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  width: 100%;\n  overflow: hidden;\n  height: 100dvh;\n}\n.content.content-single[_ngcontent-%COMP%] {\n  max-width: 1260px;\n  margin: 0 auto;\n  padding: 0 0.8rem;\n}\n.content.content-public[_ngcontent-%COMP%] {\n  max-width: 1320px;\n  margin: 0 auto;\n  padding: 0;\n  min-height: 100vh;\n  height: auto;\n}\n.content-area[_ngcontent-%COMP%] {\n  top: 0;\n  flex: 1;\n  background: transparent;\n  min-height: 420px;\n  padding-top: 0.75rem;\n}\n.content-area.content-area-full[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1180px;\n  margin: 0 auto;\n  padding: 0.9rem 0.35rem 1rem;\n}\n.content-area.content-area-public[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  margin: 0;\n  padding: 0;\n  min-height: 100vh;\n}\n@media (max-width: 760px) {\n  .content[_ngcontent-%COMP%] {\n    overflow-x: hidden;\n  }\n  .content-area[_ngcontent-%COMP%] {\n    box-sizing: border-box;\n  }\n  .content.content-single[_ngcontent-%COMP%] {\n    padding: 0 0.45rem;\n  }\n  .content.content-public[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .content-area.content-area-full[_ngcontent-%COMP%] {\n    padding: 0.7rem 0 0.85rem;\n  }\n}\n/*# sourceMappingURL=app.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", imports: [
      RouterOutlet,
      NgComponentOutlet,
      PromptComponent
    ], template: `<main class="main" [class.main-public]="!showSideMenu">
  <div class="content" [class.content-single]="showSideMenu" [class.content-public]="!showSideMenu">
    <section class="content-area" [class.content-area-full]="showSideMenu" [class.content-area-public]="!showSideMenu">
      <router-outlet (activate)="onRouteActivated()"></router-outlet>
    </section>
  </div>
</main>

@if (showSideMenu) {
  @if (sideMenuComponent(); as component) {
    <ng-container *ngComponentOutlet="component"></ng-container>
  }
}

<app-prompt
  [model]="installPromptModel()"
  (action)="onInstallRequested()"
  (dismiss)="onInstallDismissed()"
></app-prompt>

@if (routeWarmupVisible) {
  <section
    class="app-route-warmup"
    role="status"
    aria-live="polite"
    [attr.aria-label]="'Loading ' + deploymentBranding().productName"
  >
    <span class="app-route-warmup__mark">
      <span class="app-route-warmup__ring" aria-hidden="true"></span>
      @if (deploymentBranding().logoUrl; as logoUrl) {
        <img [src]="logoUrl" alt="" />
      }
    </span>
    <span class="app-route-warmup__label">{{ deploymentBranding().productName }}</span>
  </section>
}
`, styles: ['/* src/app/app.scss */\n:host {\n  display: block;\n  --bg-soft: #f3f6ff;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-route-warmup {\n  position: fixed;\n  inset: 0;\n  z-index: 3000;\n  min-height: 100vh;\n  min-height: 100dvh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  box-sizing: border-box;\n  padding: 1.25rem;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 247, 253, 0.96) 46%,\n      rgba(239, 244, 255, 0.98) 100%);\n  color: #1f3a63;\n  text-align: center;\n}\n.app-route-warmup__mark {\n  position: relative;\n  width: 76px;\n  height: 76px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background: #ffffff;\n  box-shadow: 0 18px 34px rgba(36, 65, 110, 0.16);\n}\n.app-route-warmup__mark img {\n  position: relative;\n  z-index: 1;\n  width: 46px;\n  height: 46px;\n  display: block;\n  object-fit: contain;\n}\n.app-route-warmup__ring {\n  position: absolute;\n  inset: -5px;\n  border-radius: inherit;\n  background:\n    conic-gradient(\n      from 40deg,\n      #4f7cff 0deg,\n      #7b5cff 120deg,\n      #ff4d8d 230deg,\n      rgba(79, 124, 255, 0.08) 310deg,\n      #4f7cff 360deg);\n  animation: app-route-warmup-spin 0.95s linear infinite;\n}\n.app-route-warmup__ring::after {\n  content: "";\n  position: absolute;\n  inset: 6px;\n  border-radius: inherit;\n  background: #ffffff;\n}\n.app-route-warmup__label {\n  color: var(--deployment-brand-text);\n  font-size: 1rem;\n  font-weight: 900;\n  letter-spacing: 0;\n}\n@keyframes app-route-warmup-spin {\n  to {\n    transform: rotate(1turn);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-route-warmup__ring {\n    animation-duration: 1.8s;\n  }\n}\n.main {\n  width: 100%;\n  min-height: 100vh;\n  height: 100vh;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n  box-sizing: inherit;\n  position: relative;\n  background:\n    radial-gradient(\n      circle at 15% 10%,\n      rgba(73, 111, 182, 0.16),\n      transparent 35%),\n    radial-gradient(\n      circle at 85% 0%,\n      rgba(80, 174, 199, 0.12),\n      transparent 32%),\n    var(--bg-soft);\n}\n.main.main-public {\n  height: auto;\n  min-height: 100vh;\n  background: transparent;\n}\n.content {\n  display: flex;\n  gap: 1rem;\n  width: 100%;\n  overflow: hidden;\n  height: 100dvh;\n}\n.content.content-single {\n  max-width: 1260px;\n  margin: 0 auto;\n  padding: 0 0.8rem;\n}\n.content.content-public {\n  max-width: 1320px;\n  margin: 0 auto;\n  padding: 0;\n  min-height: 100vh;\n  height: auto;\n}\n.content-area {\n  top: 0;\n  flex: 1;\n  background: transparent;\n  min-height: 420px;\n  padding-top: 0.75rem;\n}\n.content-area.content-area-full {\n  width: 100%;\n  max-width: 1180px;\n  margin: 0 auto;\n  padding: 0.9rem 0.35rem 1rem;\n}\n.content-area.content-area-public {\n  width: 100%;\n  max-width: 100%;\n  margin: 0;\n  padding: 0;\n  min-height: 100vh;\n}\n@media (max-width: 760px) {\n  .content {\n    overflow-x: hidden;\n  }\n  .content-area {\n    box-sizing: border-box;\n  }\n  .content.content-single {\n    padding: 0 0.45rem;\n  }\n  .content.content-public {\n    padding: 0;\n  }\n  .content-area.content-area-full {\n    padding: 0.7rem 0 0.85rem;\n  }\n}\n/*# sourceMappingURL=app.css.map */\n'] }]
  }], () => [], { onPageShow: [{
    type: HostListener,
    args: ["window:pageshow"]
  }], onWindowFocus: [{
    type: HostListener,
    args: ["window:focus"]
  }], onDocumentVisibilityChange: [{
    type: HostListener,
    args: ["document:visibilitychange"]
  }], onDocumentPointerDown: [{
    type: HostListener,
    args: ["document:pointerdown", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "app/app.ts", lineNumber: 28 });
})();

// src/main.ts
var BOOTSTRAPPED_CLASS = "app-bootstrapped";
var BOOTSTRAP_RESUME_RELOAD_KEY = "myscoutee.bootstrap.resume-reload.v1";
var DEPLOYMENT_RECOVERY_KEY = "myscoutee.deployment-recovery.v1";
var BOOTSTRAP_RESUME_GRACE_MS = 12e3;
var bootstrapStartedAt = Date.now();
var bootstrapSettled = false;
function silenceBrowserConsoleLogs() {
  const browserConsole = globalThis.console;
  const logMethod = ["lo", "g"].join("");
  if (!browserConsole || typeof browserConsole[logMethod] !== "function") {
    return;
  }
  browserConsole[logMethod] = () => void 0;
}
function bindBootstrapResumeRecovery() {
  window.addEventListener("pageshow", recoverBootstrapOnResume);
  window.addEventListener("focus", recoverBootstrapOnResume);
  document.addEventListener("visibilitychange", recoverBootstrapOnResume);
}
function unbindBootstrapResumeRecovery() {
  window.removeEventListener("pageshow", recoverBootstrapOnResume);
  window.removeEventListener("focus", recoverBootstrapOnResume);
  document.removeEventListener("visibilitychange", recoverBootstrapOnResume);
}
function recoverBootstrapOnResume() {
  if (bootstrapSettled || document.visibilityState === "hidden") {
    return;
  }
  if (Date.now() - bootstrapStartedAt < BOOTSTRAP_RESUME_GRACE_MS) {
    return;
  }
  const attemptKey = `${location.origin}${location.pathname}${location.search}`;
  try {
    if (sessionStorage.getItem(BOOTSTRAP_RESUME_RELOAD_KEY) === attemptKey) {
      return;
    }
    sessionStorage.setItem(BOOTSTRAP_RESUME_RELOAD_KEY, attemptKey);
  } catch {
    return;
  }
  window.location.reload();
}
function clearBootstrapResumeReloadGuard() {
  try {
    sessionStorage.removeItem(BOOTSTRAP_RESUME_RELOAD_KEY);
    sessionStorage.removeItem(DEPLOYMENT_RECOVERY_KEY);
  } catch {
  }
}
function markBootstrapped() {
  bootstrapSettled = true;
  unbindBootstrapResumeRecovery();
  clearBootstrapResumeReloadGuard();
  document.documentElement.classList.add(BOOTSTRAPPED_CLASS);
}
function markBootstrapFailed(err) {
  bootstrapSettled = true;
  unbindBootstrapResumeRecovery();
  console.error(err);
  window.__myscouteeWarmup?.showFailure?.("Unable to start", "The app could not finish starting. Please check the network and retry.");
}
silenceBrowserConsoleLogs();
bindBootstrapResumeRecovery();
bootstrapApplication(App, appConfig).then(() => markBootstrapped()).catch((err) => markBootstrapFailed(err));
//# sourceMappingURL=main.js.map
