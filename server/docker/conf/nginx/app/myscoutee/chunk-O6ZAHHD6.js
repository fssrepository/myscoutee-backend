import {
  scheduleAfterPaint
} from "./chunk-2XAMZBDM.js";
import {
  Injectable,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/context/stores/profile.store.ts
var ProfileStore = class _ProfileStore {
  bindingsRef = signal(null, ...ngDevMode ? [{ debugName: "bindingsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  settingsPopupRef = signal(null, ...ngDevMode ? [{ debugName: "settingsPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  reportUserContextRef = signal(null, ...ngDevMode ? [{ debugName: "reportUserContextRef" }] : (
    /* istanbul ignore next */
    []
  ));
  deletedAccountReactivationPendingRef = signal(false, ...ngDevMode ? [{ debugName: "deletedAccountReactivationPendingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  privacyConsentRequiredKeyRef = signal("", ...ngDevMode ? [{ debugName: "privacyConsentRequiredKeyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  profileEditorOpenRef = signal(false, ...ngDevMode ? [{ debugName: "profileEditorOpenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  profileViewTargetRef = signal(null, ...ngDevMode ? [{ debugName: "profileViewTargetRef" }] : (
    /* istanbul ignore next */
    []
  ));
  impressionsPopupOpenRef = signal(false, ...ngDevMode ? [{ debugName: "impressionsPopupOpenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  contactsPopupOpenRef = signal(false, ...ngDevMode ? [{ debugName: "contactsPopupOpenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  impressionsPopupUserIdRef = signal("", ...ngDevMode ? [{ debugName: "impressionsPopupUserIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  impressionsPopupContextRef = signal(null, ...ngDevMode ? [{ debugName: "impressionsPopupContextRef" }] : (
    /* istanbul ignore next */
    []
  ));
  impressionsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "impressionsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  profileEditorComponentRef = signal(null, ...ngDevMode ? [{ debugName: "profileEditorComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  profileEditorLoad = null;
  profileEditorLoadFailed = signal(false, ...ngDevMode ? [{ debugName: "profileEditorLoadFailed" }] : (
    /* istanbul ignore next */
    []
  ));
  profileViewPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "profileViewPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  contactsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "contactsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  explanationPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "explanationPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  bindings = this.bindingsRef.asReadonly();
  profileEditorOpen = this.profileEditorOpenRef.asReadonly();
  profileViewTarget = this.profileViewTargetRef.asReadonly();
  profileViewOpen = computed(() => this.profileViewTargetRef() !== null, ...ngDevMode ? [{ debugName: "profileViewOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  settingsPopup = this.settingsPopupRef.asReadonly();
  privacyConsentRequired = computed(() => this.privacyConsentRequiredKeyRef().length > 0, ...ngDevMode ? [{ debugName: "privacyConsentRequired" }] : (
    /* istanbul ignore next */
    []
  ));
  privacyConsentRequiredKey = this.privacyConsentRequiredKeyRef.asReadonly();
  reportUserContext = this.reportUserContextRef.asReadonly();
  deletedAccountReactivationPending = this.deletedAccountReactivationPendingRef.asReadonly();
  impressionsPopupOpen = this.impressionsPopupOpenRef.asReadonly();
  contactsPopupOpen = this.contactsPopupOpenRef.asReadonly();
  impressionsPopupUserId = this.impressionsPopupUserIdRef.asReadonly();
  impressionsPopupContext = this.impressionsPopupContextRef.asReadonly();
  impressionsPopupComponent = this.impressionsPopupComponentRef.asReadonly();
  profileEditorComponent = this.profileEditorComponentRef.asReadonly();
  profileViewPopupComponent = this.profileViewPopupComponentRef.asReadonly();
  contactsPopupComponent = this.contactsPopupComponentRef.asReadonly();
  explanationPopupComponent = this.explanationPopupComponentRef.asReadonly();
  registerBindings(bindings) {
    this.bindingsRef.set(bindings);
  }
  clearBindings(bindings) {
    if (bindings && this.bindingsRef() !== bindings) {
      return;
    }
    this.bindingsRef.set(null);
    this.closeSettingsPopup({ force: true });
    this.closeImpressionsPopup();
    this.closeContactsPopup();
    this.closeProfileEditor();
    this.closeProfileView();
  }
  openProfileEditor() {
    this.profileEditorOpenRef.set(true);
  }
  closeProfileEditor() {
    this.profileEditorOpenRef.set(false);
  }
  openProfileView(request) {
    const userId = `${request?.userId ?? ""}`.trim();
    if (!userId) {
      return;
    }
    const targetLabel = `${request.label ?? ""}`.trim() || null;
    const currentTarget = this.profileViewTargetRef();
    if (currentTarget?.userId === userId && currentTarget.label === targetLabel) {
      return;
    }
    this.profileViewTargetRef.set({
      userId,
      label: targetLabel
    });
  }
  closeProfileView() {
    this.profileViewTargetRef.set(null);
  }
  openSettingsPopup(popup) {
    if (popup !== "report-user") {
      this.reportUserContextRef.set(null);
    }
    this.settingsPopupRef.set(popup);
  }
  closeSettingsPopup(options = {}) {
    if (options.force !== true && options.keepPrivacyOpen === true && this.settingsPopupRef() === "privacy") {
      return;
    }
    if (this.settingsPopupRef() === "report-user") {
      this.reportUserContextRef.set(null);
    }
    this.settingsPopupRef.set(null);
  }
  setPrivacyConsentRequiredKey(key) {
    this.privacyConsentRequiredKeyRef.set(key.trim());
  }
  clearPrivacyConsentRequirement() {
    this.privacyConsentRequiredKeyRef.set("");
  }
  setDeletedAccountReactivationPending(pending) {
    this.deletedAccountReactivationPendingRef.set(pending);
  }
  openReportUserPopup(context) {
    const targetUserId = `${context.targetUserId ?? ""}`.trim();
    const eventId = `${context.eventId ?? ""}`.trim();
    const targetName = `${context.targetName ?? ""}`.trim();
    if (!targetUserId || !eventId || !targetName) {
      return;
    }
    this.reportUserContextRef.set({
      targetUserId,
      targetName,
      memberEntryId: `${context.memberEntryId ?? ""}`.trim() || null,
      eventId,
      eventTitle: `${context.eventTitle ?? ""}`.trim() || null,
      eventStartAtIso: `${context.eventStartAtIso ?? ""}`.trim() || null,
      eventTimeframe: `${context.eventTimeframe ?? ""}`.trim() || null,
      ownerType: context.ownerType,
      sourceType: `${context.sourceType ?? ""}`.trim() || null,
      sourceId: `${context.sourceId ?? ""}`.trim() || null,
      sourceText: `${context.sourceText ?? ""}`.trim() || null,
      chatId: `${context.chatId ?? ""}`.trim() || null,
      messageId: `${context.messageId ?? ""}`.trim() || null,
      assetId: `${context.assetId ?? ""}`.trim() || null,
      assetType: `${context.assetType ?? ""}`.trim() || null
    });
    this.settingsPopupRef.set("report-user");
  }
  openImpressionsPopup(userId, context = {}) {
    this.impressionsPopupUserIdRef.set(userId.trim());
    this.impressionsPopupContextRef.set({
      contextLabel: `${context.contextLabel ?? ""}`.trim() || null,
      sourceLabel: `${context.sourceLabel ?? ""}`.trim() || null
    });
    this.impressionsPopupOpenRef.set(true);
  }
  closeImpressionsPopup() {
    this.impressionsPopupOpenRef.set(false);
    this.impressionsPopupUserIdRef.set("");
    this.impressionsPopupContextRef.set(null);
  }
  openContactsPopup() {
    this.contactsPopupOpenRef.set(true);
  }
  closeContactsPopup() {
    this.contactsPopupOpenRef.set(false);
  }
  async ensureImpressionsPopupLoaded() {
    if (this.impressionsPopupComponentRef()) {
      return;
    }
    const module = await import("./impressions-popup.component-6Q2GKS2G.js");
    this.impressionsPopupComponentRef.set(module.ProfileImpressionsPopupComponent);
  }
  async ensureProfileEditorLoaded() {
    if (this.profileEditorComponentRef()) {
      return;
    }
    if (this.profileEditorLoad)
      return this.profileEditorLoad;
    this.profileEditorLoadFailed.set(false);
    this.profileEditorLoad = new Promise((resolve) => scheduleAfterPaint(resolve)).then(() => import("./profile-editor.component-FJE564BB.js")).then((module) => {
      this.profileEditorComponentRef.set(module.ProfileEditorComponent);
    }).catch(() => {
      this.profileEditorLoadFailed.set(true);
    }).finally(() => {
      this.profileEditorLoad = null;
    });
    return this.profileEditorLoad;
  }
  async ensureProfileViewPopupLoaded() {
    if (this.profileViewPopupComponentRef()) {
      return;
    }
    const module = await import("./profile-view-popup.component-CYULXTWA.js");
    this.profileViewPopupComponentRef.set(module.ProfileViewPopupComponent);
  }
  async ensureContactsPopupLoaded() {
    if (this.contactsPopupComponentRef()) {
      return;
    }
    const module = await import("./contacts-popup.component-XALVKMUM.js");
    this.contactsPopupComponentRef.set(module.ContactsPopupComponent);
  }
  async ensureExplanationPopupLoaded() {
    if (this.explanationPopupComponentRef()) {
      return;
    }
    const module = await import("./explanation-popup.component-CEHZRFI2.js");
    this.explanationPopupComponentRef.set(module.ExplanationPopupComponent);
  }
  static \u0275fac = function ProfileStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProfileStore, factory: _ProfileStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ProfileStore
};
//# sourceMappingURL=chunk-O6ZAHHD6.js.map
