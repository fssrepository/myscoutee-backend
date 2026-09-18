import {
  PwaService
} from "./chunk-A7Y6JLVE.js";
import {
  DialogStore
} from "./chunk-LWXWCSPP.js";
import {
  FirebaseMessagingService
} from "./chunk-DEBX2AEH.js";
import {
  Router
} from "./chunk-TGJIGH66.js";
import {
  I18nService
} from "./chunk-I52TUHFM.js";
import {
  UserProfileStore,
  resolveRouteConfig
} from "./chunk-52XNNRXY.js";
import {
  SessionService
} from "./chunk-SXVGSFEZ.js";
import {
  appLocationStorageKey
} from "./chunk-YO3STUCM.js";
import {
  HttpErrorResponse
} from "./chunk-ZBAABSP3.js";
import {
  Injectable,
  Injector,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

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
  primedLocationUserIds = /* @__PURE__ */ new Set();
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
  async syncGrantedLocationForActiveUser() {
    const userId = this.userProfileStore.activeUserId().trim();
    const user = this.resolveTrackedUser(userId);
    if (!userId || !user || user.admin === true || user.profileStatus === "onboarding" || !this.isActiveFirebaseMemberSession(userId) || typeof navigator === "undefined" || !navigator.permissions) {
      return;
    }
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state !== "granted")
        return;
      const coordinates = await this.requestCurrentCoordinates();
      if (coordinates && this.userProfileStore.activeUserId().trim() === userId && this.isActiveFirebaseMemberSession(userId)) {
        this.primePersistedCoordinates(userId, user.locationCoordinates);
        this.handleStreamedCoordinates(userId, coordinates);
        this.ensureCoordinateWatch(userId);
      }
    } catch {
    }
  }
  async requestCurrentCoordinates() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return null;
    }
    return new Promise((resolve) => {
      let settled = false;
      let timeoutId = null;
      const finish = (coordinates) => {
        if (settled) {
          return;
        }
        settled = true;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        resolve(coordinates);
      };
      timeoutId = setTimeout(() => finish(null), 4500 + 500);
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          finish(null);
          return;
        }
        finish({ latitude, longitude });
      }, () => finish(null), {
        enableHighAccuracy: false,
        timeout: 4500,
        maximumAge: 0
      });
    });
  }
  ensureCoordinateWatch(userId) {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    if (this.geolocationWatchId !== null && this.geolocationWatchUserId === userId) {
      return;
    }
    if (!navigator.permissions) {
      return;
    }
    void navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      if (permission.state === "granted" && this.userProfileStore.activeUserId().trim() === userId) {
        this.startCoordinateWatch(userId);
      }
    }).catch(() => void 0);
  }
  startCoordinateWatch(userId) {
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
    if (this.primedLocationUserIds.has(userId)) {
      return;
    }
    this.primedLocationUserIds.add(userId);
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
      this.httpUsersServicePromise = import("./users.service-IHEQU4GW.js").then((module) => this.injector.get(module.HttpUsersService));
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

// src/app/shared/ui/context/stores/app-setup.store.ts
var AppSetupStore = class _AppSetupStore {
  pwa = inject(PwaService);
  messaging = inject(FirebaseMessagingService);
  location = inject(AppLocationService);
  i18n = inject(I18nService);
  profile = inject(UserProfileStore);
  loggedIn = computed(() => !!this.profile.activeUserId(), ...ngDevMode ? [{ debugName: "loggedIn" }] : (
    /* istanbul ignore next */
    []
  ));
  isOpen = signal(false, ...ngDevMode ? [{ debugName: "isOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  locationSelected = signal(false, ...ngDevMode ? [{ debugName: "locationSelected" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationsSelected = signal(false, ...ngDevMode ? [{ debugName: "notificationsSelected" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationsEdited = signal(false, ...ngDevMode ? [{ debugName: "notificationsEdited" }] : (
    /* istanbul ignore next */
    []
  ));
  locationGranted = signal(false, ...ngDevMode ? [{ debugName: "locationGranted" }] : (
    /* istanbul ignore next */
    []
  ));
  locationPermission = signal(null, ...ngDevMode ? [{ debugName: "locationPermission" }] : (
    /* istanbul ignore next */
    []
  ));
  nativePending = signal(false, ...ngDevMode ? [{ debugName: "nativePending" }] : (
    /* istanbul ignore next */
    []
  ));
  busy = signal(false, ...ngDevMode ? [{ debugName: "busy" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationConfigurationPending = signal(false, ...ngDevMode ? [{ debugName: "notificationConfigurationPending" }] : (
    /* istanbul ignore next */
    []
  ));
  actionPending = computed(() => this.nativePending() || this.busy(), ...ngDevMode ? [{ debugName: "actionPending" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  saveSucceeded = signal(false, ...ngDevMode ? [{ debugName: "saveSucceeded" }] : (
    /* istanbul ignore next */
    []
  ));
  saveFeedbackTimer = null;
  allowDisabled = computed(() => !this.loggedIn() && !this.locationSelected() || this.actionPending() || this.notificationConfigurationPending(), ...ngDevMode ? [{ debugName: "allowDisabled" }] : (
    /* istanbul ignore next */
    []
  ));
  generation = 0;
  permission = null;
  completeLogin = null;
  checkLocation = null;
  constructor() {
    effect(() => {
      const enabled = this.messaging.deviceNotificationsEnabled();
      if (this.isOpen() && !this.actionPending() && (!this.notificationsEdited() || !this.messaging.notificationsConfigured)) {
        this.notificationsSelected.set(enabled);
      }
    });
  }
  toggleNotifications() {
    if (this.notificationConfigurationPending() || !this.messaging.notificationsConfigured)
      return;
    this.clearSaveFeedback();
    this.notificationsEdited.set(true);
    this.notificationsSelected.update((value) => !value);
  }
  open() {
    if (this.isOpen())
      return;
    this.generation++;
    this.clearSaveFeedback();
    this.error.set("");
    this.locationGranted.set(false);
    this.locationPermission.set(null);
    this.locationSelected.set(this.loggedIn());
    this.messaging.refreshNotificationPermission();
    this.notificationsEdited.set(false);
    this.notificationsSelected.set(this.messaging.deviceNotificationsEnabled());
    this.isOpen.set(true);
    const generation = this.generation;
    this.notificationConfigurationPending.set(true);
    void this.messaging.prepareNotificationConfiguration().catch(() => void 0).finally(() => {
      if (generation === this.generation) {
        this.notificationConfigurationPending.set(false);
        if (!this.messaging.notificationsConfigured) {
          this.notificationsSelected.set(false);
          this.notificationsEdited.set(false);
        }
      }
    });
    void this.refreshPermissions();
  }
  requestForLogin(checkLocation) {
    if (this.completeLogin)
      return Promise.resolve(false);
    this.open();
    this.checkLocation = checkLocation;
    return new Promise((resolve) => {
      this.completeLogin = resolve;
    });
  }
  async refreshPermissions() {
    this.messaging.refreshNotificationPermission();
    const generation = this.generation;
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (!this.isOpen() || generation !== this.generation)
        return;
      if (this.permission)
        this.permission.onchange = null;
      this.permission = permission;
      const update = () => {
        this.locationPermission.set(permission.state);
        this.locationGranted.set(permission.state === "granted");
        if (permission.state === "granted" || this.loggedIn())
          this.locationSelected.set(true);
      };
      permission.onchange = update;
      update();
    } catch {
      this.locationGranted.set(false);
    }
  }
  close() {
    this.nativePending.set(false);
    this.busy.set(false);
    this.finish(false);
  }
  install() {
    void this.pwa.promptInstall();
  }
  async allow() {
    if (!this.isOpen() || this.allowDisabled())
      return;
    this.clearSaveFeedback();
    this.nativePending.set(true);
    this.error.set("");
    const generation = this.generation;
    try {
      if (this.notificationsSelected()) {
        const decision = await this.messaging.requestEntryPermission();
        if (generation !== this.generation)
          return;
        if (decision)
          this.notificationsSelected.set(decision === "granted");
        if (decision === "denied" && this.loggedIn() && !this.checkLocation) {
          this.error.set(this.i18n.translate("entry.permissions.notifications.blocked"));
          return;
        }
      }
      if (generation !== this.generation)
        return;
      if (this.loggedIn() && !this.checkLocation) {
        void this.location.syncGrantedLocationForActiveUser();
        this.nativePending.set(false);
        this.busy.set(true);
        await this.messaging.setDeviceNotificationsEnabled(this.notificationsSelected());
        if (generation === this.generation) {
          this.notificationsEdited.set(false);
          this.showSaveFeedback();
        }
        return;
      }
      const coordinates = await this.location.requestCurrentCoordinates();
      if (generation !== this.generation)
        return;
      if (!coordinates) {
        await this.refreshPermissions();
        throw new Error(this.i18n.translate("Location permission was not granted. Use the browser prompt or site settings, then try again."));
      }
      this.locationGranted.set(true);
      this.locationPermission.set("granted");
      this.locationSelected.set(true);
      this.nativePending.set(false);
      if (this.checkLocation || this.notificationsSelected())
        this.busy.set(true);
      if (this.checkLocation && !await this.checkLocation(coordinates))
        return;
      if (generation !== this.generation)
        return;
      await this.messaging.setDeviceNotificationsEnabled(this.notificationsSelected());
      if (generation === this.generation) {
        if (this.completeLogin)
          this.finish(true);
        else {
          this.notificationsEdited.set(false);
          this.showSaveFeedback();
        }
      }
    } catch (error) {
      if (generation === this.generation) {
        this.notificationsSelected.set(this.messaging.deviceNotificationsEnabled());
        this.notificationsEdited.set(false);
        this.error.set(error instanceof Error ? error.message : this.i18n.translate("entry.permissions.checking"));
      }
    } finally {
      if (generation === this.generation || !this.isOpen()) {
        this.nativePending.set(false);
        this.busy.set(false);
      }
    }
  }
  ngOnDestroy() {
    this.clearSaveFeedback();
  }
  showSaveFeedback() {
    this.clearSaveFeedback();
    this.saveSucceeded.set(true);
    this.saveFeedbackTimer = setTimeout(() => {
      this.saveFeedbackTimer = null;
      this.saveSucceeded.set(false);
    }, 1e3);
  }
  clearSaveFeedback() {
    if (this.saveFeedbackTimer !== null)
      clearTimeout(this.saveFeedbackTimer);
    this.saveFeedbackTimer = null;
    this.saveSucceeded.set(false);
  }
  finish(allowed) {
    this.clearSaveFeedback();
    this.generation++;
    if (this.permission)
      this.permission.onchange = null;
    this.permission = null;
    this.isOpen.set(false);
    this.pwa.dismissInstallPrompt();
    const complete = this.completeLogin;
    this.completeLogin = null;
    this.checkLocation = null;
    complete?.(allowed);
  }
  static \u0275fac = function AppSetupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppSetupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppSetupStore, factory: _AppSetupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppSetupStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  AppLocationService,
  AppSetupStore
};
//# sourceMappingURL=chunk-FQITQVTG.js.map
