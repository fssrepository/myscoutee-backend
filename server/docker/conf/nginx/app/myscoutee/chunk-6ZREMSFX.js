import {
  PwaService
} from "./chunk-BGAUSF4L.js";
import {
  Router
} from "./chunk-666FMAP4.js";
import {
  DialogStore
} from "./chunk-4DNL6LXE.js";
import {
  FirebaseMessagingService
} from "./chunk-ETJ7G4VT.js";
import {
  UserProfileStore
} from "./chunk-IEWB22H3.js";
import {
  APP_SETUP_CONFIG,
  resolveRouteConfig
} from "./chunk-UKS3QROH.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  SessionService
} from "./chunk-HDBJPOT3.js";
import {
  appLocationStorageKey
} from "./chunk-LDZENZ35.js";
import {
  HttpErrorResponse
} from "./chunk-DZ6OOOZN.js";
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
} from "./chunk-EV3I3YNV.js";

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
    this.ensureCoordinateWatch(userId);
  }
  async syncGrantedLocationForActiveUser() {
    const userId = this.userProfileStore.activeUserId().trim();
    const user = this.resolveTrackedUser(userId);
    if (!userId || !user || user.admin === true || user.profileStatus === "onboarding" || !this.normalizeCoordinates(user.locationCoordinates) || !this.isActiveFirebaseMemberSession(userId) || typeof navigator === "undefined" || !navigator.permissions) {
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
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          resolve(null);
          return;
        }
        resolve({ latitude, longitude });
      }, () => resolve(null), {
        enableHighAccuracy: false,
        timeout: APP_SETUP_CONFIG.locationRequestTimeoutMs,
        maximumAge: 0
      });
    });
  }
  async saveCurrentCoordinates(coordinates) {
    const userId = this.userProfileStore.activeUserId().trim();
    const user = this.resolveTrackedUser(userId);
    const normalized = this.normalizeCoordinates(coordinates);
    if (!user || !normalized || !this.isActiveFirebaseMemberSession(userId))
      return false;
    this.primePersistedCoordinates(userId, user.locationCoordinates);
    await this.persistCoordinates(userId, user, normalized);
    if (this.userProfileStore.activeUserId().trim() !== userId)
      return false;
    this.storeCoordinates(userId, normalized);
    this.ensureCoordinateWatch(userId);
    return true;
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
    if (this.userProfileStore.activeUserId().trim() !== userId)
      return;
    const activeUser = this.resolveTrackedUser(userId);
    if (!activeUser?.id?.trim()) {
      return;
    }
    this.primePersistedCoordinates(userId, activeUser.locationCoordinates);
    this.storeCoordinates(userId, coordinates);
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
    return Boolean(normalizedUserId && session?.kind === "firebase" && this.userProfileStore.activeUserId().trim() === normalizedUserId);
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
      await this.persistCoordinates(userId, currentUser, normalizedCoordinates);
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
  async persistCoordinates(userId, user, coordinates) {
    const savedUser = await (await this.httpUsersService()).saveUserProfile(__spreadProps(__spreadValues({}, user), {
      locationCoordinates: coordinates
    }));
    if (savedUser?.id?.trim()) {
      this.lastPersistedCoordinatesByUserId.set(userId, this.normalizeCoordinates(savedUser.locationCoordinates) ?? coordinates);
      this.userProfileStore.setUserProfile(savedUser);
    } else {
      this.lastPersistedCoordinatesByUserId.set(userId, coordinates);
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
      this.httpUsersServicePromise = import("./users.service-3AVKNSMC.js").then((module) => this.injector.get(module.HttpUsersService));
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
  locationMissing = this.profile.activeUserLocationMissing;
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
  allowDisabled = computed(() => this.busy() || this.notificationConfigurationPending(), ...ngDevMode ? [{ debugName: "allowDisabled" }] : (
    /* istanbul ignore next */
    []
  ));
  locationRequestPending = false;
  opening = false;
  generation = 0;
  permission = null;
  completeLogin = null;
  checkLocation = null;
  constructor() {
    effect(() => {
      const enabled = this.messaging.deviceNotificationsEnabled();
      if (this.isOpen() && !this.actionPending() && !this.notificationsEdited()) {
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
    if (this.isOpen() || this.opening)
      return;
    this.opening = true;
    this.generation++;
    this.clearSaveFeedback();
    this.error.set("");
    this.locationGranted.set(false);
    this.locationPermission.set(null);
    this.locationSelected.set(false);
    this.messaging.refreshNotificationPermission();
    this.notificationsEdited.set(false);
    this.notificationsSelected.set(this.messaging.deviceNotificationsEnabled());
    const generation = this.generation;
    this.notificationConfigurationPending.set(true);
    void Promise.all([
      this.messaging.prepareNotificationConfiguration().catch(() => void 0),
      this.refreshPermissions()
    ]).then(() => {
      if (generation !== this.generation)
        return;
      this.notificationConfigurationPending.set(false);
      this.notificationsSelected.set(this.messaging.deviceNotificationsEnabled());
      this.opening = false;
      this.isOpen.set(true);
    });
  }
  requestForLogin(checkLocation = null) {
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
      if (!this.isOpen() && !this.opening || generation !== this.generation)
        return;
      if (this.permission)
        this.permission.onchange = null;
      this.permission = permission;
      const update = () => {
        this.locationPermission.set(permission.state);
        this.locationGranted.set(permission.state === "granted");
        if (this.locationRequestPending && permission.state === "granted")
          this.busy.set(true);
        if (permission.state === "granted")
          this.locationSelected.set(true);
      };
      permission.onchange = update;
      update();
    } catch {
      this.locationGranted.set(false);
    }
  }
  close() {
    this.locationRequestPending = false;
    this.nativePending.set(false);
    this.busy.set(false);
    this.finish(false);
  }
  install() {
    void this.pwa.promptInstall();
  }
  async allow() {
    if (!this.isOpen() || this.nativePending() || this.allowDisabled())
      return;
    this.clearSaveFeedback();
    if (!this.loggedIn() && !this.locationSelected()) {
      this.error.set(this.i18n.translate("entry.permissions.location.required"));
      return;
    }
    this.nativePending.set(true);
    this.error.set("");
    const generation = this.generation;
    try {
      if (this.notificationsSelected()) {
        const decision = await this.messaging.requestEntryPermission();
        if (generation !== this.generation)
          return;
        if (decision !== "granted") {
          this.error.set(this.i18n.translate("entry.permissions.notifications.blocked"));
          return;
        }
      }
      if (generation !== this.generation)
        return;
      const needsLocation = !!this.checkLocation || (this.loggedIn() ? this.locationSelected() && (!this.locationGranted() || this.locationMissing()) : !this.locationGranted());
      if (!needsLocation) {
        this.nativePending.set(false);
        this.busy.set(true);
        if (this.notificationsSelected() !== this.messaging.deviceNotificationsEnabled()) {
          await this.messaging.setDeviceNotificationsEnabled(this.notificationsSelected());
        }
        if (generation === this.generation) {
          if (this.completeLogin)
            this.finish(true);
          else {
            this.showSaveFeedback();
          }
        }
        return;
      }
      this.locationRequestPending = true;
      this.busy.set(this.locationPermission() === "granted");
      const coordinates = await this.location.requestCurrentCoordinates();
      if (generation !== this.generation)
        return;
      if (!coordinates) {
        await this.refreshPermissions();
        if (generation !== this.generation)
          return;
        throw new Error(this.i18n.translate(this.locationPermission() === "denied" ? "entry.permissions.location.blocked" : "entry.permissions.location.unavailable"));
      }
      this.locationGranted.set(true);
      this.locationPermission.set("granted");
      this.locationSelected.set(true);
      this.nativePending.set(false);
      if (this.checkLocation || this.notificationsSelected())
        this.busy.set(true);
      if (this.checkLocation && !await this.checkLocation(coordinates))
        return;
      if (this.loggedIn()) {
        this.busy.set(true);
        if (!await this.location.saveCurrentCoordinates(coordinates)) {
          throw new Error(this.i18n.translate("entry.permissions.location.unavailable"));
        }
      }
      if (generation !== this.generation)
        return;
      if (this.notificationsSelected() !== this.messaging.deviceNotificationsEnabled()) {
        await this.messaging.setDeviceNotificationsEnabled(this.notificationsSelected());
      }
      if (generation === this.generation) {
        if (this.completeLogin)
          this.finish(true);
        else {
          this.showSaveFeedback();
        }
      }
    } catch (error) {
      if (generation === this.generation) {
        this.error.set(error instanceof Error ? error.message : this.i18n.translate("entry.permissions.checking"));
      }
    } finally {
      if (generation === this.generation || !this.isOpen()) {
        this.locationRequestPending = false;
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
    this.opening = false;
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
//# sourceMappingURL=chunk-6ZREMSFX.js.map
