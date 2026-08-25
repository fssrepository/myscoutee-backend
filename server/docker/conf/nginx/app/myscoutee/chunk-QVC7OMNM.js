import {
  Injectable,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/asset-popup.store.ts
var AssetPopupStore = class _AssetPopupStore {
  primaryVisibleRef = signal(false, ...ngDevMode ? [{ debugName: "primaryVisibleRef" }] : (
    /* istanbul ignore next */
    []
  ));
  stackedVisibleRef = signal(false, ...ngDevMode ? [{ debugName: "stackedVisibleRef" }] : (
    /* istanbul ignore next */
    []
  ));
  basketVisibleRef = signal(false, ...ngDevMode ? [{ debugName: "basketVisibleRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketScanModeRef = signal(null, ...ngDevMode ? [{ debugName: "ticketScanModeRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketRowsRef = signal([], ...ngDevMode ? [{ debugName: "ticketRowsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketTotalCountRef = signal(0, ...ngDevMode ? [{ debugName: "ticketTotalCountRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketDateOrderRef = signal("upcoming", ...ngDevMode ? [{ debugName: "ticketDateOrderRef" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedTicketRowRef = signal(null, ...ngDevMode ? [{ debugName: "selectedTicketRowRef" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedTicketCodeValueRef = signal("", ...ngDevMode ? [{ debugName: "selectedTicketCodeValueRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketScannerStateRef = signal("idle", ...ngDevMode ? [{ debugName: "ticketScannerStateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketScannerResultRef = signal(null, ...ngDevMode ? [{ debugName: "ticketScannerResultRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketScannerReasonRef = signal(null, ...ngDevMode ? [{ debugName: "ticketScannerReasonRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "assetPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetMemberPickerPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "assetMemberPickerPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  visible = computed(() => this.primaryVisibleRef() || this.stackedVisibleRef() || this.basketVisibleRef() || this.ticketScanModeRef() !== null, ...ngDevMode ? [{ debugName: "visible" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketScanMode = this.ticketScanModeRef.asReadonly();
  selectedTicketRow = this.selectedTicketRowRef.asReadonly();
  ticketScannerState = this.ticketScannerStateRef.asReadonly();
  ticketScannerResult = this.ticketScannerResultRef.asReadonly();
  ticketScannerReason = this.ticketScannerReasonRef.asReadonly();
  ticketDateOrder = this.ticketDateOrderRef.asReadonly();
  assetPopupComponent = this.assetPopupComponentRef.asReadonly();
  assetMemberPickerPopupComponent = this.assetMemberPickerPopupComponentRef.asReadonly();
  ticketHeaderSummary = computed(() => {
    const count = this.ticketTotalCountRef();
    return count === 1 ? "1 ticketed event" : `${count} ticketed events`;
  }, ...ngDevMode ? [{ debugName: "ticketHeaderSummary" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketDateOrderLabel = computed(() => this.ticketDateOrderRef() === "upcoming" ? "Upcoming" : "Past", ...ngDevMode ? [{ debugName: "ticketDateOrderLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketDateOrderIcon = computed(() => this.ticketDateOrderRef() === "upcoming" ? "schedule" : "history", ...ngDevMode ? [{ debugName: "ticketDateOrderIcon" }] : (
    /* istanbul ignore next */
    []
  ));
  prepareTicketPopupOpen(totalCount) {
    this.ticketRowsRef.set([]);
    this.ticketTotalCountRef.set(this.normalizedCount(totalCount));
    this.clearTicketSelection();
  }
  resetTicketState() {
    this.ticketRowsRef.set([]);
    this.ticketTotalCountRef.set(0);
    this.clearTicketSelection();
  }
  selectTicketDateOrder(order, totalCount) {
    if (this.ticketDateOrderRef() === order) {
      return false;
    }
    this.ticketDateOrderRef.set(order);
    this.ticketRowsRef.set([]);
    this.ticketTotalCountRef.set(this.normalizedCount(totalCount));
    return true;
  }
  updateTicketList(items, total) {
    const nextItems = [...items];
    this.ticketRowsRef.set(nextItems);
    this.ticketTotalCountRef.set(this.normalizedCount(total));
    const selectedTicket = this.selectedTicketRowRef();
    if (!selectedTicket) {
      return;
    }
    const selectedTicketKey = this.ticketIdentity(selectedTicket);
    const nextSelectedTicket = nextItems.find((item) => this.ticketIdentity(item) === selectedTicketKey);
    if (nextSelectedTicket) {
      this.selectedTicketRowRef.set(nextSelectedTicket);
      this.selectedTicketCodeValueRef.set(nextSelectedTicket.scanCode.trim());
    }
  }
  openTicketCode(row, scanCode) {
    this.selectedTicketRowRef.set(row);
    this.selectedTicketCodeValueRef.set(scanCode.trim());
    this.ticketScannerResultRef.set(null);
    this.ticketScannerReasonRef.set(null);
    this.ticketScannerStateRef.set("idle");
    this.ticketScanModeRef.set("ticketCode");
  }
  openTicketScanner() {
    this.ticketScannerStateRef.set("reading");
    this.ticketScannerResultRef.set(null);
    this.ticketScannerReasonRef.set(null);
    this.ticketScanModeRef.set("ticketScanner");
  }
  closeTicketScan() {
    this.clearTicketSelection();
  }
  retryTicketScanner() {
    this.ticketScannerStateRef.set("reading");
    this.ticketScannerResultRef.set(null);
    this.ticketScannerReasonRef.set(null);
  }
  pauseTicketScanner() {
    if (this.ticketScannerStateRef() === "reading") {
      this.ticketScannerStateRef.set("idle");
    }
  }
  applyTicketScannerValidating() {
    this.ticketScannerResultRef.set(null);
    this.ticketScannerReasonRef.set(null);
    this.ticketScannerStateRef.set("validating");
  }
  applyTicketScannerValid(ticket) {
    this.ticketScannerResultRef.set(ticket);
    this.ticketScannerReasonRef.set("valid");
    this.ticketScannerStateRef.set("valid");
  }
  applyTicketScannerInvalid(reason) {
    this.ticketScannerResultRef.set(null);
    this.ticketScannerReasonRef.set(reason);
    this.ticketScannerStateRef.set("invalid");
  }
  applyTicketScannerError() {
    this.ticketScannerResultRef.set(null);
    this.ticketScannerReasonRef.set(null);
    this.ticketScannerStateRef.set("error");
  }
  async ensureAssetPopupLoaded() {
    if (this.assetPopupComponentRef()) {
      return;
    }
    const module = await import("./asset-popup.component-N3RGIFZM.js");
    this.assetPopupComponentRef.set(module.AssetPopupComponent);
  }
  async ensureAssetMemberPickerPopupLoaded() {
    if (this.assetMemberPickerPopupComponentRef()) {
      return;
    }
    const module = await import("./asset-member-picker-popup.component-AHDTLR6E.js");
    this.assetMemberPickerPopupComponentRef.set(module.AssetMemberPickerPopupComponent);
  }
  clearTicketSelection() {
    this.selectedTicketRowRef.set(null);
    this.selectedTicketCodeValueRef.set("");
    this.ticketScannerStateRef.set("idle");
    this.ticketScannerResultRef.set(null);
    this.ticketScannerReasonRef.set(null);
    this.ticketScanModeRef.set(null);
  }
  normalizedCount(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  ticketIdentity(ticket) {
    return `${ticket.type}:${ticket.id}:${ticket.holderUserId}`;
  }
  static \u0275fac = function AssetPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssetPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AssetPopupStore, factory: _AssetPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AssetPopupStore
};
//# sourceMappingURL=chunk-QVC7OMNM.js.map
