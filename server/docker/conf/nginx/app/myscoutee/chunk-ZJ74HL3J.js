import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/admin-menu.store.ts
var AdminMenuStore = class _AdminMenuStore {
  activePopupRef = signal(null, ...ngDevMode ? [{ debugName: "activePopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedReportedUserRef = signal(null, ...ngDevMode ? [{ debugName: "selectedReportedUserRef" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedReportRef = signal(null, ...ngDevMode ? [{ debugName: "selectedReportRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activePopup = this.activePopupRef.asReadonly();
  selectedReportedUser = this.selectedReportedUserRef.asReadonly();
  selectedReport = this.selectedReportRef.asReadonly();
  openReports(user) {
    const resolvedUser = user ?? null;
    this.selectedReportedUserRef.set(resolvedUser);
    this.selectedReportRef.set(resolvedUser?.reports[0] ?? null);
    this.activePopupRef.set("reports");
  }
  openFeedback() {
    this.activePopupRef.set("feedback");
  }
  openHelpEditor() {
    this.activePopupRef.set("help-editor");
  }
  openIdeaEditor() {
    this.activePopupRef.set("idea-editor");
  }
  openNotifications() {
    this.activePopupRef.set("notifications");
  }
  openParams() {
    this.activePopupRef.set("params");
  }
  openStats() {
    this.activePopupRef.set("stats");
  }
  openAffinityGraph() {
    this.activePopupRef.set("affinity-graph");
  }
  openMonitoring() {
    this.activePopupRef.set("monitoring");
  }
  openReportDetail(user, report) {
    this.selectedReportedUserRef.set(user);
    this.selectedReportRef.set(report);
  }
  openChatReview(report) {
    this.selectedReportRef.set(report);
    this.activePopupRef.set("chat-review");
  }
  openWarnChat(user, report) {
    this.selectedReportedUserRef.set(user);
    if (report) {
      this.selectedReportRef.set(report);
    }
    this.activePopupRef.set("warn-chat");
  }
  openItemPreview(report) {
    this.selectedReportRef.set(report);
    this.activePopupRef.set("item-preview");
  }
  setSelectedReportedUser(user) {
    this.selectedReportedUserRef.set(user);
  }
  closePopup() {
    this.activePopupRef.set(null);
  }
  clear() {
    this.activePopupRef.set(null);
    this.selectedReportedUserRef.set(null);
    this.selectedReportRef.set(null);
  }
  static \u0275fac = function AdminMenuStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminMenuStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminMenuStore, factory: _AdminMenuStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminMenuStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AdminMenuStore
};
//# sourceMappingURL=chunk-ZJ74HL3J.js.map
