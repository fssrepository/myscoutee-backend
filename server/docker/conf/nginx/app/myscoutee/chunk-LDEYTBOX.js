import {
  NotificationsService
} from "./chunk-FJQMGJUW.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import {
  Injectable,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/notification-center.store.ts
var NotificationCenterStore = class _NotificationCenterStore {
  notificationsService = inject(NotificationsService);
  activityStore = inject(ActivityStore);
  userProfileStore = inject(UserProfileStore);
  activeUserIdRef = signal("", ...ngDevMode ? [{ debugName: "activeUserIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  openRef = signal(false, ...ngDevMode ? [{ debugName: "openRef" }] : (
    /* istanbul ignore next */
    []
  ));
  openingRef = signal(false, ...ngDevMode ? [{ debugName: "openingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  unreadCountRef = signal(0, ...ngDevMode ? [{ debugName: "unreadCountRef" }] : (
    /* istanbul ignore next */
    []
  ));
  mutedRef = signal(false, ...ngDevMode ? [{ debugName: "mutedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  markReadPendingIdsRef = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "markReadPendingIdsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  attentionRequestedRef = signal(false, ...ngDevMode ? [{ debugName: "attentionRequestedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  dragPositionRef = signal({ x: 0, y: 0 }, ...ngDevMode ? [{ debugName: "dragPositionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  popupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "popupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  bucketRef = signal("new", ...ngDevMode ? [{ debugName: "bucketRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activeUserId = this.activeUserIdRef.asReadonly();
  isOpen = this.openRef.asReadonly();
  visible = this.isOpen;
  opening = this.openingRef.asReadonly();
  unreadCount = this.unreadCountRef.asReadonly();
  muted = this.mutedRef.asReadonly();
  dragPosition = this.dragPositionRef.asReadonly();
  popupComponent = this.popupComponentRef.asReadonly();
  bucket = this.bucketRef.asReadonly();
  attentionVisible = computed(() => this.attentionRequestedRef() && this.unreadCountRef() > 0 && !this.mutedRef() && !this.openRef(), ...ngDevMode ? [{ debugName: "attentionVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  popupLoadPromise = null;
  generation = 0;
  pageContextRevision = 0;
  pageContextRequestSequence = 0;
  initialize(userId, initialUnreadCount = 0, initialMuted = false) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      this.reset();
      return;
    }
    if (this.activeUserIdRef() === normalizedUserId) {
      this.syncUnreadCount(initialUnreadCount);
      this.syncMuted(initialMuted);
      return;
    }
    this.resetState();
    this.activeUserIdRef.set(normalizedUserId);
    this.syncUnreadCount(initialUnreadCount);
    this.syncMuted(initialMuted);
    this.requestAttention();
  }
  reset() {
    this.resetState();
  }
  async open() {
    if (!this.activeUserIdRef() || this.openRef() || this.openingRef()) {
      return;
    }
    const generation = this.generation;
    this.openingRef.set(true);
    try {
      await this.ensurePopupLoaded();
      if (generation !== this.generation || !this.activeUserIdRef()) {
        return;
      }
      this.attentionRequestedRef.set(false);
      this.openRef.set(true);
    } finally {
      if (generation === this.generation) {
        this.openingRef.set(false);
      }
    }
  }
  close() {
    this.openRef.set(false);
  }
  dismissAttention() {
    this.attentionRequestedRef.set(false);
  }
  requestAttention() {
    if (this.unreadCountRef() > 0 && !this.mutedRef() && !this.openRef()) {
      this.attentionRequestedRef.set(true);
    }
  }
  setDragPosition(position) {
    this.dragPositionRef.set({
      x: this.finiteCoordinate(position?.x),
      y: this.finiteCoordinate(position?.y)
    });
  }
  setBucket(bucket) {
    this.bucketRef.set(bucket === "new" ? "new" : "all");
  }
  isMarkReadPending(notificationId) {
    const normalizedNotificationId = notificationId.trim();
    return Boolean(normalizedNotificationId) && this.markReadPendingIdsRef().has(normalizedNotificationId);
  }
  syncUnreadCount(count, options = {}) {
    const nextCount = this.nonNegativeInteger(count);
    const previousCount = this.unreadCountRef();
    if (nextCount !== previousCount) {
      this.pageContextRevision += 1;
      this.unreadCountRef.set(nextCount);
      this.syncUserModelCounter(nextCount);
    }
    if (nextCount === 0) {
      this.attentionRequestedRef.set(false);
      return;
    }
    if (options.announce === true && nextCount > previousCount && !this.mutedRef() && !this.openRef()) {
      this.attentionRequestedRef.set(true);
    }
  }
  captureUnreadSyncToken() {
    return {
      userId: this.activeUserIdRef(),
      generation: this.generation,
      revision: this.pageContextRevision,
      unreadCount: this.unreadCountRef()
    };
  }
  applyRealtimeUnreadCount(token, count) {
    const nextCount = this.nonNegativeInteger(count);
    if (!token.userId || token.userId !== this.activeUserIdRef() || token.generation !== this.generation || token.revision !== this.pageContextRevision) {
      return false;
    }
    this.syncUnreadCount(nextCount, {
      announce: nextCount > token.unreadCount
    });
    return true;
  }
  async ensurePopupLoaded() {
    if (this.popupComponentRef()) {
      return;
    }
    if (!this.popupLoadPromise) {
      this.popupLoadPromise = import("./notification-center-popup.component-2PRMMUGR.js").then((module) => {
        this.popupComponentRef.set(module.NotificationCenterPopupComponent);
      }).finally(() => {
        this.popupLoadPromise = null;
      });
    }
    await this.popupLoadPromise;
  }
  async queryPage(query, signal2) {
    const userId = this.activeUserIdRef();
    if (!userId) {
      return {
        items: [],
        total: 0,
        nextCursor: null,
        context: { unreadCount: 0, muted: false }
      };
    }
    const generation = this.generation;
    const contextRevision = this.pageContextRevision;
    const contextRequestSequence = ++this.pageContextRequestSequence;
    const page = await this.notificationsService.queryPage(userId, query, signal2);
    if (generation === this.generation && userId === this.activeUserIdRef() && contextRevision === this.pageContextRevision && contextRequestSequence === this.pageContextRequestSequence) {
      this.applyPageContext(page);
    }
    return page;
  }
  async markRead(notificationId, signal2) {
    const userId = this.activeUserIdRef();
    const normalizedNotificationId = notificationId.trim();
    if (!userId || !normalizedNotificationId) {
      throw new Error("Notification could not be marked as read.");
    }
    if (this.isMarkReadPending(normalizedNotificationId)) {
      throw new Error("Notification is already being marked as read.");
    }
    this.setMarkReadPending(normalizedNotificationId, true);
    try {
      this.pageContextRevision += 1;
      const generation = this.generation;
      const result = await this.notificationsService.markRead(userId, normalizedNotificationId, signal2);
      if (generation === this.generation && userId === this.activeUserIdRef()) {
        this.syncUnreadCount(result.unreadCount);
      }
      return result.notification;
    } finally {
      this.setMarkReadPending(normalizedNotificationId, false);
    }
  }
  async sync(request, signal2) {
    const userId = this.activeUserIdRef();
    if (!userId) {
      return {
        upserts: [],
        removedIds: [],
        total: 0,
        unreadCount: 0,
        muted: false
      };
    }
    const generation = this.generation;
    const contextRevision = this.pageContextRevision;
    const contextRequestSequence = ++this.pageContextRequestSequence;
    const result = await this.notificationsService.sync(userId, request, signal2);
    if (generation === this.generation && userId === this.activeUserIdRef() && contextRevision === this.pageContextRevision && contextRequestSequence === this.pageContextRequestSequence) {
      this.applySyncContext(result);
    }
    return result;
  }
  async setMuted(muted, signal2) {
    const userId = this.activeUserIdRef();
    if (!userId) {
      throw new Error("Notification preferences could not be updated.");
    }
    this.pageContextRevision += 1;
    const generation = this.generation;
    const result = await this.notificationsService.setMuted(userId, muted === true, signal2);
    if (generation === this.generation && userId === this.activeUserIdRef()) {
      this.syncMuted(result.muted === true);
      this.attentionRequestedRef.set(false);
    }
    return result.muted === true;
  }
  pollIntervalMs() {
    return this.notificationsService.pollIntervalMs();
  }
  applyPageContext(page) {
    this.syncUnreadCount(page.context?.unreadCount ?? this.unreadCountRef());
    this.syncMuted(page.context?.muted === true);
  }
  applySyncContext(result) {
    this.syncUnreadCount(result.unreadCount);
    this.syncMuted(result.muted === true);
  }
  syncMuted(muted) {
    const nextMuted = muted === true;
    if (nextMuted !== this.mutedRef()) {
      this.pageContextRevision += 1;
      this.mutedRef.set(nextMuted);
      const userId = this.activeUserIdRef();
      if (userId) {
        this.userProfileStore.patchUserNotificationPreferences(userId, nextMuted);
      }
    }
    if (nextMuted) {
      this.attentionRequestedRef.set(false);
    }
  }
  syncUserModelCounter(count) {
    const userId = this.activeUserIdRef();
    if (!userId) {
      return;
    }
    this.activityStore.setUserCounterOverride(userId, "notifications", count);
    this.userProfileStore.patchUserActivityCounters(userId, { notifications: count });
  }
  setMarkReadPending(notificationId, pending) {
    const current = this.markReadPendingIdsRef();
    if (current.has(notificationId) === pending) {
      return;
    }
    const next = new Set(current);
    if (pending) {
      next.add(notificationId);
    } else {
      next.delete(notificationId);
    }
    this.markReadPendingIdsRef.set(next);
  }
  resetState() {
    this.generation += 1;
    this.pageContextRevision = 0;
    this.pageContextRequestSequence = 0;
    this.activeUserIdRef.set("");
    this.openRef.set(false);
    this.openingRef.set(false);
    this.unreadCountRef.set(0);
    this.mutedRef.set(false);
    this.markReadPendingIdsRef.set(/* @__PURE__ */ new Set());
    this.attentionRequestedRef.set(false);
    this.dragPositionRef.set({ x: 0, y: 0 });
    this.bucketRef.set("new");
  }
  nonNegativeInteger(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  finiteCoordinate(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }
  static \u0275fac = function NotificationCenterStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationCenterStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationCenterStore, factory: _NotificationCenterStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationCenterStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  NotificationCenterStore
};
//# sourceMappingURL=chunk-LDEYTBOX.js.map
