import {
  ActivityResourceBuilder
} from "./chunk-FAW3YKWN.js";
import {
  ASSET_TYPE_TRANSPORT
} from "./chunk-27OFLLFL.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/context/stores/sub-event-resource-popup.store.ts
var SubEventResourcePopupStore = class _SubEventResourcePopupStore {
  assignedAssetIdsByKey = {};
  assignedAssetSettingsByKey = {};
  supplyContributionEntriesByAssignmentKey = {};
  popupContextRef = signal(null, ...ngDevMode ? [{ debugName: "popupContextRef" }] : (
    /* istanbul ignore next */
    []
  ));
  resourceFilterRef = signal(ASSET_TYPE_TRANSPORT, ...ngDevMode ? [{ debugName: "resourceFilterRef" }] : (
    /* istanbul ignore next */
    []
  ));
  resourceAssetViewIdRef = signal(null, ...ngDevMode ? [{ debugName: "resourceAssetViewIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  resourceAssetViewModeRef = signal("view", ...ngDevMode ? [{ debugName: "resourceAssetViewModeRef" }] : (
    /* istanbul ignore next */
    []
  ));
  resourceAssetViewReturnToChatRef = signal(false, ...ngDevMode ? [{ debugName: "resourceAssetViewReturnToChatRef" }] : (
    /* istanbul ignore next */
    []
  ));
  supplyPopupRef = signal(null, ...ngDevMode ? [{ debugName: "supplyPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  bringDialogRef = signal(null, ...ngDevMode ? [{ debugName: "bringDialogRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingAssignSaveRef = signal(null, ...ngDevMode ? [{ debugName: "pendingAssignSaveRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetExplorePopupRef = signal(null, ...ngDevMode ? [{ debugName: "assetExplorePopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetExploreAssetViewIdRef = signal(null, ...ngDevMode ? [{ debugName: "assetExploreAssetViewIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetExploreOnlyRef = signal(false, ...ngDevMode ? [{ debugName: "assetExploreOnlyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetExploreBorrowDialogRef = signal(null, ...ngDevMode ? [{ debugName: "assetExploreBorrowDialogRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assignedAssetJoinDialogRef = signal(null, ...ngDevMode ? [{ debugName: "assignedAssetJoinDialogRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assignContextRef = signal(null, ...ngDevMode ? [{ debugName: "assignContextRef" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedAssignAssetIdsRef = signal([], ...ngDevMode ? [{ debugName: "selectedAssignAssetIdsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  visibleResourceStatesRef = signal([], ...ngDevMode ? [{ debugName: "visibleResourceStatesRef" }] : (
    /* istanbul ignore next */
    []
  ));
  subEventResourcePopupRequestRef = signal(null, ...ngDevMode ? [{ debugName: "subEventResourcePopupRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventResourcePopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventResourcePopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventResourceAssetExploreComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventResourceAssetExploreComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSupplyContributionsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventSupplyContributionsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventResourceAssetViewComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventResourceAssetViewComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventResourceAssignedAssetJoinDialogComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventResourceAssignedAssetJoinDialogComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventResourceAssetExploreBorrowDialogComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventResourceAssetExploreBorrowDialogComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventResourcePopupOutletActionRequestRef = signal(null, ...ngDevMode ? [{ debugName: "eventResourcePopupOutletActionRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventResourceAssetExploreOutletActionRequestRef = signal(null, ...ngDevMode ? [{ debugName: "eventResourceAssetExploreOutletActionRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  resourceMetricsRevisionRef = signal(0, ...ngDevMode ? [{ debugName: "resourceMetricsRevisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  subEventResourceMetricsUpdateRef = signal(null, ...ngDevMode ? [{ debugName: "subEventResourceMetricsUpdateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  consumedResourceActivityDeltaRevision = 0;
  outletActionRequestSequence = 0;
  eventResourcePopupComponent = this.eventResourcePopupComponentRef.asReadonly();
  eventResourceAssetExploreComponent = this.eventResourceAssetExploreComponentRef.asReadonly();
  eventSupplyContributionsPopupComponent = this.eventSupplyContributionsPopupComponentRef.asReadonly();
  eventResourceAssetViewComponent = this.eventResourceAssetViewComponentRef.asReadonly();
  eventResourceAssignedAssetJoinDialogComponent = this.eventResourceAssignedAssetJoinDialogComponentRef.asReadonly();
  eventResourceAssetExploreBorrowDialogComponent = this.eventResourceAssetExploreBorrowDialogComponentRef.asReadonly();
  eventResourcePopupOutletActionRequest = this.eventResourcePopupOutletActionRequestRef.asReadonly();
  eventResourceAssetExploreOutletActionRequest = this.eventResourceAssetExploreOutletActionRequestRef.asReadonly();
  subEventResourcePopupRequest = this.subEventResourcePopupRequestRef.asReadonly();
  assetViewOutletContext = computed(() => this.resolveAssetViewOutletContext(), ...ngDevMode ? [{ debugName: "assetViewOutletContext" }] : (
    /* istanbul ignore next */
    []
  ));
  resourceMetricsRevision = this.resourceMetricsRevisionRef.asReadonly();
  subEventResourceMetricsUpdate = this.subEventResourceMetricsUpdateRef.asReadonly();
  visibleResourceStates = this.visibleResourceStatesRef.asReadonly();
  setVisibleResourceStates(states) {
    this.visibleResourceStatesRef.set(states.map((state) => ActivityResourceBuilder.cloneState(state)).filter((state) => Boolean(state)));
  }
  upsertVisibleResourceState(state) {
    const normalized = ActivityResourceBuilder.normalizeState(state);
    if (!normalized) {
      return;
    }
    const recordId = ActivityResourceBuilder.recordId(normalized);
    const next = this.visibleResourceStatesRef().filter((current) => ActivityResourceBuilder.recordId(current) !== recordId);
    if (ActivityResourceBuilder.hasResourceData(normalized)) {
      next.push(normalized);
    }
    this.setVisibleResourceStates(next);
  }
  requestSubEventResourcePopup(request) {
    this.subEventResourcePopupRequestRef.set(request);
  }
  clearSubEventResourcePopupRequest() {
    this.subEventResourcePopupRequestRef.set(null);
  }
  openResourcePopup(context, type, visibleStates = []) {
    this.resetResourcePopupState();
    this.resourceFilterRef.set(type);
    this.setVisibleResourceStates(visibleStates);
    this.popupContextRef.set(context);
  }
  closeResourcePopup() {
    this.popupContextRef.set(null);
    this.resetResourcePopupState();
  }
  resetResourcePopupState() {
    this.resourceAssetViewIdRef.set(null);
    this.resourceAssetViewModeRef.set("view");
    this.resourceAssetViewReturnToChatRef.set(false);
    this.supplyPopupRef.set(null);
    this.bringDialogRef.set(null);
    this.assignedAssetJoinDialogRef.set(null);
    this.assetExploreBorrowDialogRef.set(null);
    this.assetExplorePopupRef.set(null);
    this.assetExploreAssetViewIdRef.set(null);
    this.assetExploreOnlyRef.set(false);
    this.visibleResourceStatesRef.set([]);
  }
  assetAssignmentKey(subEventId, type) {
    return `${subEventId}:${type}`;
  }
  supplyAssignmentKey(subEventId, cardId) {
    return `${subEventId}:${cardId}`;
  }
  supplyContributionEntries(subEventId, cardId) {
    return this.supplyContributionEntriesByAssignmentKey[this.supplyAssignmentKey(subEventId, cardId)] ?? [];
  }
  publishSubEventResourceMetrics(context, options = {}) {
    const revision = this.resourceMetricsRevisionRef() + 1;
    this.resourceMetricsRevisionRef.set(revision);
    this.subEventResourceMetricsUpdateRef.set(__spreadProps(__spreadValues({
      revision,
      ownerId: context.ownerId,
      subEventId: context.subEvent.id,
      subEvent: __spreadValues({}, context.subEvent)
    }, options.activityDelta === void 0 ? {} : { activityDelta: Math.trunc(Number(options.activityDelta) || 0) }), {
      assignmentQuantityUpdates: [...options.assignmentQuantityUpdates ?? []]
    }));
  }
  consumeSubEventResourceActivityDelta(revision) {
    const normalizedRevision = Math.max(0, Math.trunc(Number(revision) || 0));
    const update = this.subEventResourceMetricsUpdateRef();
    if (normalizedRevision === 0 || normalizedRevision <= this.consumedResourceActivityDeltaRevision || update?.revision !== normalizedRevision || update.activityDelta === void 0) {
      return false;
    }
    this.consumedResourceActivityDeltaRevision = normalizedRevision;
    return true;
  }
  requestResourceAssetViewClose(event) {
    const resolvedContext = this.resolveAssetViewOutletContext();
    if (!resolvedContext) {
      return;
    }
    if (resolvedContext === "assetExplore") {
      this.eventResourceAssetExploreOutletActionRequestRef.set({
        requestId: this.nextOutletActionRequestId(),
        kind: "assetViewClose",
        event
      });
      return;
    }
    this.eventResourcePopupOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "assetViewClose",
      event
    });
  }
  requestResourceAssetViewMembers(view, event) {
    if (this.resolveAssetViewOutletContext() !== "resourcePopup") {
      return;
    }
    this.eventResourcePopupOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "assetViewMembers",
      view,
      event
    });
  }
  requestAssignedAssetJoinClose(event) {
    this.eventResourcePopupOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "assignedAssetJoinClose",
      event
    });
  }
  requestAssignedAssetJoinPolicyToggle(policyId) {
    this.eventResourcePopupOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "assignedAssetJoinPolicyToggle",
      policyId
    });
  }
  requestAssignedAssetJoinConfirm(event) {
    this.eventResourcePopupOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "assignedAssetJoinConfirm",
      event
    });
  }
  requestBorrowDialogClose(event) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowDialogClose",
      event
    });
  }
  requestBorrowDialogBack(event) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowDialogBack",
      event
    });
  }
  requestBorrowDateRangeChange(start, end) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowDateRangeChange",
      start,
      end
    });
  }
  requestBorrowTimeChange(edge, value) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowTimeChange",
      edge,
      value
    });
  }
  requestBorrowQuantityChange(value) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowQuantityChange",
      value
    });
  }
  requestBorrowQuantityBlur(value) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowQuantityBlur",
      value
    });
  }
  requestBorrowPolicyToggle(policyId) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowPolicyToggle",
      policyId
    });
  }
  requestBorrowConfirm(event) {
    this.eventResourceAssetExploreOutletActionRequestRef.set({
      requestId: this.nextOutletActionRequestId(),
      kind: "borrowConfirm",
      event
    });
  }
  async ensureEventResourcePopupLoaded() {
    if (this.eventResourcePopupComponentRef()) {
      return;
    }
    const module = await import("./event-resource-popup.component-BJLQCHAL.js");
    this.eventResourcePopupComponentRef.set(module.EventResourcePopupComponent);
  }
  async ensureEventResourceAssetExploreLoaded() {
    if (this.eventResourceAssetExploreComponentRef()) {
      return;
    }
    const module = await import("./event-resource-asset-explore.component-D34Q2QSS.js");
    this.eventResourceAssetExploreComponentRef.set(module.EventResourceAssetExploreComponent);
  }
  async ensureEventSupplyContributionsPopupLoaded() {
    if (this.eventSupplyContributionsPopupComponentRef()) {
      return;
    }
    const module = await import("./event-supply-contributions-popup.component-5BFFSHN2.js");
    this.eventSupplyContributionsPopupComponentRef.set(module.EventSupplyContributionsPopupComponent);
  }
  async ensureEventResourceAssetViewLoaded() {
    if (this.eventResourceAssetViewComponentRef()) {
      return;
    }
    const module = await import("./event-resource-asset-view.component-VVVAHYI5.js");
    this.eventResourceAssetViewComponentRef.set(module.EventResourceAssetViewComponent);
  }
  async ensureEventResourceAssignedAssetJoinDialogLoaded() {
    if (this.eventResourceAssignedAssetJoinDialogComponentRef()) {
      return;
    }
    const module = await import("./event-resource-assigned-asset-join-dialog.component-66CXBIY4.js");
    this.eventResourceAssignedAssetJoinDialogComponentRef.set(module.EventResourceAssignedAssetJoinDialogComponent);
  }
  async ensureEventResourceAssetExploreBorrowDialogLoaded() {
    if (this.eventResourceAssetExploreBorrowDialogComponentRef()) {
      return;
    }
    const module = await import("./event-resource-asset-explore-borrow-dialog.component-MF2SBYM5.js");
    this.eventResourceAssetExploreBorrowDialogComponentRef.set(module.EventResourceAssetExploreBorrowDialogComponent);
  }
  nextOutletActionRequestId() {
    this.outletActionRequestSequence += 1;
    return this.outletActionRequestSequence;
  }
  resolveAssetViewOutletContext() {
    if (this.assetExploreAssetViewIdRef()) {
      return "assetExplore";
    }
    if (this.resourceAssetViewIdRef()) {
      return "resourcePopup";
    }
    return null;
  }
  static \u0275fac = function SubEventResourcePopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SubEventResourcePopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SubEventResourcePopupStore, factory: _SubEventResourcePopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SubEventResourcePopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  SubEventResourcePopupStore
};
//# sourceMappingURL=chunk-T6NM4FOV.js.map
