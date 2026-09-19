import {
  Router,
  provideRouter
} from "./chunk-666FMAP4.js";
import {
  trackDemoWrite
} from "./chunk-CIPZKINY.js";
import {
  reportBackendStatus
} from "./chunk-67ETDNJE.js";
import {
  FirebaseSessionRegistryService
} from "./chunk-D647PAQN.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import "./chunk-LFBAVSTX.js";
import "./chunk-7B4ZHEVS.js";
import "./chunk-6SKBB3AJ.js";
import "./chunk-YXATI2WQ.js";
import "./chunk-QXOIA7DH.js";
import {
  UserProfileStore,
  hasOperatorRole
} from "./chunk-IEWB22H3.js";
import "./chunk-UKS3QROH.js";
import "./chunk-C6JV7CA3.js";
import {
  CURRENT_PROFILE_FORM_VERSION
} from "./chunk-N7OBXPJA.js";
import "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  SessionService,
  isFirebaseLoginEnabled
} from "./chunk-HDBJPOT3.js";
import {
  APP_STORAGE_KEYS
} from "./chunk-LDZENZ35.js";
import {
  HttpErrorResponse,
  HttpResponse,
  provideHttpClient,
  withInterceptors
} from "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  Injector,
  __spreadValues,
  catchError,
  defer,
  environment,
  finalize,
  from,
  inject,
  provideBrowserGlobalErrorListeners,
  switchMap,
  tap,
  throwError
} from "./chunk-EV3I3YNV.js";

// src/app/app.routes.ts
var loadEntryPage = () => import("./entry-page.component-LUGHC4MD.js").then((m) => m.EntryPageComponent);
var entryAreaGuard = async () => {
  const injector = inject(Injector);
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const session = sessionService.currentSession();
  if (!session) {
    return true;
  }
  if (session.kind === "operator-bootstrap") {
    return router.createUrlTree(["/operator"]);
  }
  const { UsersService } = await import("./users.service-QT2B6EC5.js");
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
    const { UsersService } = await import("./users.service-QT2B6EC5.js");
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
  const { UsersService } = await import("./users.service-QT2B6EC5.js");
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
  const { UsersService } = await import("./users.service-QT2B6EC5.js");
  const usersService = injector.get(UsersService);
  if (session.kind === "demo" && usersService.localModeEnabled) {
    const { AdminWorkspaceStore } = await import("./admin-workspace.store-LRZSK5GM.js");
    const adminWorkspace = injector.get(AdminWorkspaceStore);
    const userId = session.userId.trim();
    const storedAdminId = adminWorkspace.readStoredAdminId();
    if (userId && (userId === storedAdminId || userId.startsWith("admin-demo-"))) {
      return true;
    }
  }
  const user = await usersService.loadUserById(session.kind === "demo" ? session.userId : void 0).catch(() => null);
  if (isAdminUser(user)) {
    return true;
  }
  if (isOperatorUser(user)) {
    return router.createUrlTree(["/operator"]);
  }
  if (user) {
    return router.createUrlTree(["/game"]);
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
    loadComponent: () => import("./document-viewer.component-DNDQE3R5.js").then((m) => m.DocumentViewerComponent),
    data: { documentKind: "privacy" }
  },
  {
    path: "terms",
    loadComponent: () => import("./document-viewer.component-DNDQE3R5.js").then((m) => m.DocumentViewerComponent),
    data: { documentKind: "terms" }
  },
  {
    path: "admin/help/:token",
    loadComponent: () => import("./admin-help-session-page.component-LS4H3Y4K.js").then((m) => m.AdminHelpSessionPageComponent)
  },
  {
    path: "admin",
    canActivate: [adminAreaGuard],
    loadChildren: () => import("./admin.module-2PKORMZ4.js").then((m) => m.AdminModule)
  },
  {
    path: "operator",
    canActivate: [operatorAreaGuard],
    loadComponent: () => import("./operator-page.component-M46O7I2V.js").then((m) => m.OperatorPageComponent)
  },
  {
    path: "",
    canActivate: [restrictedAreaGuard],
    children: [
      { path: "home", redirectTo: "game", pathMatch: "full" },
      {
        path: "game",
        loadComponent: () => import("./home.component-SDQS6P6F.js").then((m) => m.HomeComponent),
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
function isDemoRegistrationRequest(req) {
  if (req.method !== "POST") {
    return false;
  }
  const route = req.url.split(/[?#]/, 1)[0];
  let ownerId;
  if (route.endsWith("/media/images") && req.body instanceof FormData) {
    ownerId = req.body.get("ownerId");
  } else if (route.endsWith("/auth/me/profile-ext")) {
    ownerId = req.body?.profile?.id;
  }
  return typeof ownerId === "string" && ownerId.startsWith("demo-profile-");
}
var sessionModeInterceptor = (req, next) => {
  if (!isApiRequest2(req.url) || req.headers.has(DEMO_SESSION_HEADER) || isOperatorBootstrapLoginRequest(req.url)) {
    return next(req);
  }
  const sessionService = inject(SessionService);
  const session = sessionService.currentSession();
  const isDemoRequest = session?.kind === "demo" || isDemoSelectorRequest(req.url) || !session && isDemoRegistrationRequest(req);
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

// src/app/shared/core/http/payment-provider-sync.interceptor.ts
var PAYMENT_PROVIDER_RESPONSE_HEADER = "X-MyScoutee-Payment-Provider";
var paymentProviderSyncInterceptor = (req, next) => {
  const deploymentConfiguration = inject(DeploymentConfigurationService);
  return next(req).pipe(tap((event) => {
    if (!(event instanceof HttpResponse)) {
      return;
    }
    const provider = event.headers.get(PAYMENT_PROVIDER_RESPONSE_HEADER);
    if (provider === null) {
      return;
    }
    deploymentConfiguration.applyPaymentProviderId(provider.trim().toLowerCase() === "none" ? null : provider);
  }));
};

// src/app/shared/core/http/connectivity.interceptor.ts
var connectivityInterceptor = (request, next) => {
  const api = new URL(environment.apiBaseUrl ?? "/api", document.baseURI);
  const url = new URL(request.url, document.baseURI);
  if (url.origin !== api.origin || !(url.pathname === api.pathname || url.pathname.startsWith(api.pathname.replace(/\/$/, "") + "/")))
    return next(request);
  const write = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  return defer(() => {
    if (write)
      trackDemoWrite(true);
    return next(request).pipe(tap({
      next: (event) => {
        if (event instanceof HttpResponse)
          reportBackendStatus(event.status);
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse)
          reportBackendStatus(error.status);
      }
    }), finalize(() => {
      if (write)
        trackDemoWrite(false);
    }));
  });
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      connectivityInterceptor,
      sessionModeInterceptor,
      operatorBootstrapAuthInterceptor,
      firebaseAuthInterceptor,
      adminAccessInterceptor,
      paymentProviderSyncInterceptor
    ]))
  ]
};
export {
  appConfig
};
//# sourceMappingURL=app.config-JTGRZGOO.js.map
