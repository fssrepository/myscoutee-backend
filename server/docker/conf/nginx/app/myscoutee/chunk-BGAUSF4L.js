import {
  pwaNotificationRegistrationEnabled
} from "./chunk-ETJ7G4VT.js";
import {
  APP_CACHE_KEYS,
  APP_STORAGE_KEYS
} from "./chunk-LDZENZ35.js";
import {
  Injectable,
  Injector,
  computed,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/base/services/pwa.service.ts
var PwaService = class _PwaService {
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
  installPromptPendingRef = signal(false, ...ngDevMode ? [{ debugName: "installPromptPendingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  installBusyRef = signal(false, ...ngDevMode ? [{ debugName: "installBusyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  installCompleted = false;
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
    this.installCompleted = true;
    this.installPromptRef.set(null);
    this.installPromptPendingRef.set(false);
    this.installBusyRef.set(false);
    this.setInstallDismissed(true);
  };
  installBusy = this.installBusyRef.asReadonly();
  installActionPending = computed(() => this.installPromptPendingRef() || this.installBusyRef(), ...ngDevMode ? [{ debugName: "installActionPending" }] : (
    /* istanbul ignore next */
    []
  ));
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
    window.addEventListener("beforeinstallprompt", this.onBeforeInstallPrompt);
    window.addEventListener("appinstalled", this.onAppInstalled);
    if (this.shouldEnableServiceWorker()) {
      await this.registerServiceWorker();
    } else {
      await this.unregisterServiceWorkers();
    }
    if (this.isStandalone()) {
      await this.requestNotificationRegistrationForActiveUser();
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
    if (!promptEvent || this.installActionPending()) {
      return false;
    }
    this.installCompleted = false;
    this.installPromptPendingRef.set(true);
    this.installPromptRef.set(null);
    try {
      await promptEvent.prompt();
      const outcome = await promptEvent.userChoice;
      const accepted = outcome?.outcome === "accepted";
      this.installPromptPendingRef.set(false);
      this.installBusyRef.set(accepted && !this.installCompleted);
      this.installPromptRef.set(null);
      if (!this.installCompleted)
        this.setInstallDismissed(!accepted);
      return accepted;
    } catch {
      this.installBusyRef.set(false);
      return false;
    } finally {
      this.installPromptPendingRef.set(false);
    }
  }
  async requestNotificationRegistrationForActiveUser() {
    if (!this.shouldEnableNotificationRegistration() || typeof Notification === "undefined" || Notification.permission !== "granted") {
      return;
    }
    const { FirebaseMessagingService } = await import("./firebase-messaging.service-MEZERJ7A.js");
    const messagingService = this.injector.get(FirebaseMessagingService);
    messagingService.initialize();
    await messagingService.requestAndRegisterForActiveUser();
  }
  dismissInstallPrompt() {
    this.setInstallDismissed(true);
  }
  showInstallPrompt() {
    if (this.installAvailable()) {
      this.setInstallDismissed(false);
    }
  }
  offerInstallAfterLogin() {
    if (!this.installAvailable()) {
      return;
    }
    const key = APP_STORAGE_KEYS.pwaLoginInstallPromptOffered;
    try {
      if (localStorage.getItem(key) === "1") {
        return;
      }
      localStorage.setItem(key, "1");
    } catch {
      return;
    }
    this.showInstallPrompt();
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
    return environment.serviceWorkerEnabled;
  }
  shouldEnableNotificationRegistration() {
    return pwaNotificationRegistrationEnabled({
      activitiesDataSource: environment.activitiesDataSource,
      firebaseMessagingEnabled: environment.firebaseMessagingEnabled,
      serviceWorkerEnabled: environment.serviceWorkerEnabled
    });
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
    this.reloadPage();
  }
  /** Called only after an update or rollback has completed, never when loading job history. */
  async reloadAfterDeploymentChange() {
    try {
      if ("serviceWorker" in navigator) {
        const registration = this.registrationRef() ?? await navigator.serviceWorker.getRegistration(document.baseURI);
        if (registration) {
          await registration.update();
          const worker = await this.waitForWaitingWorker(registration);
          if (worker) {
            await this.activateWaitingWorker(worker);
          }
        }
      }
    } catch {
    }
    this.reloadPage();
  }
  reloadPage() {
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

export {
  PwaService
};
//# sourceMappingURL=chunk-BGAUSF4L.js.map
