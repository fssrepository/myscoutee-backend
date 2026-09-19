import {
  AssetDto
} from "./chunk-EWHSEKAB.js";
import {
  PricingBuilder
} from "./chunk-LM6UNLJK.js";
import {
  ASSET_FILTER_TICKET,
  ASSET_TYPE_TRANSPORT
} from "./chunk-N7OBXPJA.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/context/stores/asset.store.ts
var AssetStore = class _AssetStore {
  assetCardsRef = signal([], ...ngDevMode ? [{ debugName: "assetCardsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetMutationVersion = 0;
  visibleListContextKey = "";
  visibleListSignature = "";
  visibleListCardCount = 0;
  visibleListReady = false;
  visibleListRenderedCount = 0;
  assetFilterRef = signal(ASSET_TYPE_TRANSPORT, ...ngDevMode ? [{ debugName: "assetFilterRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activePopupFilterRef = signal(null, ...ngDevMode ? [{ debugName: "activePopupFilterRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activeOwnerUserIdRef = signal("", ...ngDevMode ? [{ debugName: "activeOwnerUserIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  showAssetFormRef = signal(false, ...ngDevMode ? [{ debugName: "showAssetFormRef" }] : (
    /* istanbul ignore next */
    []
  ));
  editingAssetIdRef = signal(null, ...ngDevMode ? [{ debugName: "editingAssetIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormReadOnlyRef = signal(false, ...ngDevMode ? [{ debugName: "assetFormReadOnlyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormParentZIndexRef = signal(null, ...ngDevMode ? [{ debugName: "assetFormParentZIndexRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormRuntimeRouteRef = signal(null, ...ngDevMode ? [{ debugName: "assetFormRuntimeRouteRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormSavedRuntimeRouteRef = signal(null, ...ngDevMode ? [{ debugName: "assetFormSavedRuntimeRouteRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormRuntimeAssignmentRef = signal(null, ...ngDevMode ? [{ debugName: "assetFormRuntimeAssignmentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormSavedRuntimeAssignmentRef = signal(null, ...ngDevMode ? [{ debugName: "assetFormSavedRuntimeAssignmentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormCheckoutRef = signal(null, ...ngDevMode ? [{ debugName: "assetFormCheckoutRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormCheckoutPendingRef = signal(false, ...ngDevMode ? [{ debugName: "assetFormCheckoutPendingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormLoadingRef = signal(false, ...ngDevMode ? [{ debugName: "assetFormLoadingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormSavePendingRef = signal(false, ...ngDevMode ? [{ debugName: "assetFormSavePendingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingAssetDeleteCardIdRef = signal(null, ...ngDevMode ? [{ debugName: "pendingAssetDeleteCardIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetDeletePendingRef = signal(false, ...ngDevMode ? [{ debugName: "assetDeletePendingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingAssetDeleteLabelRef = signal("", ...ngDevMode ? [{ debugName: "pendingAssetDeleteLabelRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingAssetDeleteErrorRef = signal("", ...ngDevMode ? [{ debugName: "pendingAssetDeleteErrorRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormRef = signal({
    type: ASSET_TYPE_TRANSPORT,
    title: "",
    subtitle: "",
    city: "",
    capacityTotal: 4,
    quantity: 1,
    details: "",
    imageUrl: "",
    sourceLink: "",
    policiesEnabled: false
  }, ...ngDevMode ? [{ debugName: "assetFormRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormVisibilityRef = signal("Public", ...ngDevMode ? [{ debugName: "assetFormVisibilityRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormDraftIdRef = signal("", ...ngDevMode ? [{ debugName: "assetFormDraftIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFormLoadGenerationRef = signal(0, ...ngDevMode ? [{ debugName: "assetFormLoadGenerationRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetListRevisionRef = signal(0, ...ngDevMode ? [{ debugName: "assetListRevisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetListReloadRevisionRef = signal(0, ...ngDevMode ? [{ debugName: "assetListReloadRevisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetListLoadingRef = signal(false, ...ngDevMode ? [{ debugName: "assetListLoadingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  uiRevisionRef = signal(0, ...ngDevMode ? [{ debugName: "uiRevisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  deletedAssetEventRef = signal(null, ...ngDevMode ? [{ debugName: "deletedAssetEventRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetCards = this.assetCardsRef.asReadonly();
  assetCount = computed(() => this.assetCardsRef().length, ...ngDevMode ? [{ debugName: "assetCount" }] : (
    /* istanbul ignore next */
    []
  ));
  assetFilter = this.assetFilterRef.asReadonly();
  activePopupFilter = this.activePopupFilterRef.asReadonly();
  activeOwnerUserId = this.activeOwnerUserIdRef.asReadonly();
  showAssetForm = this.showAssetFormRef.asReadonly();
  editingAssetId = this.editingAssetIdRef.asReadonly();
  assetFormReadOnly = this.assetFormReadOnlyRef.asReadonly();
  assetFormParentZIndex = this.assetFormParentZIndexRef.asReadonly();
  assetFormRuntimeRoute = this.assetFormRuntimeRouteRef.asReadonly();
  assetFormSavedRuntimeRoute = this.assetFormSavedRuntimeRouteRef.asReadonly();
  assetFormRuntimeAssignment = this.assetFormRuntimeAssignmentRef.asReadonly();
  assetFormSavedRuntimeAssignment = this.assetFormSavedRuntimeAssignmentRef.asReadonly();
  assetFormCheckout = this.assetFormCheckoutRef.asReadonly();
  assetFormCheckoutPending = this.assetFormCheckoutPendingRef.asReadonly();
  assetFormLoading = this.assetFormLoadingRef.asReadonly();
  assetFormSavePending = this.assetFormSavePendingRef.asReadonly();
  pendingAssetDeleteCardId = this.pendingAssetDeleteCardIdRef.asReadonly();
  assetDeletePending = this.assetDeletePendingRef.asReadonly();
  pendingAssetDeleteLabel = this.pendingAssetDeleteLabelRef.asReadonly();
  pendingAssetDeleteError = this.pendingAssetDeleteErrorRef.asReadonly();
  assetForm = this.assetFormRef.asReadonly();
  assetFormVisibility = this.assetFormVisibilityRef.asReadonly();
  assetFormDraftId = this.assetFormDraftIdRef.asReadonly();
  assetFormLoadGeneration = this.assetFormLoadGenerationRef.asReadonly();
  assetListRevision = this.assetListRevisionRef.asReadonly();
  assetListReloadRevision = this.assetListReloadRevisionRef.asReadonly();
  assetListLoading = this.assetListLoadingRef.asReadonly();
  uiRevision = this.uiRevisionRef.asReadonly();
  deletedAssetEvent = this.deletedAssetEventRef.asReadonly();
  popupOpen = computed(() => this.activePopupFilterRef() !== null, ...ngDevMode ? [{ debugName: "popupOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  ticketPopup = computed(() => this.popupOpen() && this.assetFilterRef() === ASSET_FILTER_TICKET, ...ngDevMode ? [{ debugName: "ticketPopup" }] : (
    /* istanbul ignore next */
    []
  ));
  setAssetCards(cards) {
    this.assetCardsRef.set(AssetDto.cloneList(cards));
  }
  applyAssetCards(cards, options = {}) {
    const nextCards = AssetDto.cloneList(cards);
    if (AssetDto.listEquals(this.assetCardsRef(), nextCards)) {
      return false;
    }
    if (options.mutation === true) {
      this.markAssetMutation();
    }
    this.assetCardsRef.set(nextCards);
    this.bumpAssetListRevision(options.reloadList !== false);
    return true;
  }
  replaceAssetCard(card, options = {}) {
    const normalizedCard = AssetDto.clone(card);
    const nextCards = this.assetCardsRef().some((item) => item.id === normalizedCard.id) ? this.assetCardsRef().map((item) => item.id === normalizedCard.id ? normalizedCard : item) : [normalizedCard, ...this.assetCardsRef()];
    return this.applyAssetCards(nextCards, options);
  }
  removeAssetCard(cardId, options = {}) {
    const normalizedCardId = cardId.trim();
    if (!normalizedCardId) {
      return false;
    }
    return this.applyAssetCards(this.assetCardsRef().filter((card) => card.id !== normalizedCardId), options);
  }
  markAssetMutation() {
    this.assetMutationVersion += 1;
    return this.assetMutationVersion;
  }
  currentAssetMutationVersion() {
    return this.assetMutationVersion;
  }
  setActiveOwnerUserId(userId) {
    const normalizedUserId = userId.trim();
    if (normalizedUserId === this.activeOwnerUserIdRef()) {
      return false;
    }
    this.activeOwnerUserIdRef.set(normalizedUserId);
    return true;
  }
  isActiveOwnerUser(userId) {
    return this.activeOwnerUserIdRef() === userId.trim();
  }
  openAssetPopup(filter) {
    this.assetFilterRef.set(filter);
    this.activePopupFilterRef.set(filter);
    this.closeAssetEditor();
  }
  closeAssetPopup() {
    this.activePopupFilterRef.set(null);
    this.closeAssetEditor();
    this.resetAssetDeleteDialog();
  }
  selectAssetFilter(filter) {
    this.assetFilterRef.set(filter);
    this.activePopupFilterRef.set(filter);
    this.touchUiState();
  }
  setAssetListLoading(loading) {
    this.assetListLoadingRef.set(loading);
    this.touchUiState();
  }
  touchUiState() {
    this.uiRevisionRef.update((value) => value + 1);
  }
  bumpAssetListRevision(reloadList = true) {
    this.assetListRevisionRef.update((value) => value + 1);
    if (reloadList) {
      this.assetListReloadRevisionRef.update((value) => value + 1);
    }
  }
  recordAssetDeleted(cardId) {
    const normalizedCardId = cardId.trim();
    if (!normalizedCardId) {
      return;
    }
    this.deletedAssetEventRef.update((event) => ({
      cardId: normalizedCardId,
      revision: (event?.revision ?? 0) + 1
    }));
  }
  resetAssetDeleteDialog() {
    this.pendingAssetDeleteCardIdRef.set(null);
    this.assetDeletePendingRef.set(false);
    this.pendingAssetDeleteLabelRef.set("");
    this.pendingAssetDeleteErrorRef.set("");
    this.touchUiState();
  }
  requestAssetDelete(card) {
    this.pendingAssetDeleteCardIdRef.set(card.id);
    this.pendingAssetDeleteLabelRef.set(`Delete ${card.title}?`);
    this.pendingAssetDeleteErrorRef.set("");
    this.assetDeletePendingRef.set(false);
    this.touchUiState();
  }
  cancelAssetDelete() {
    if (this.assetDeletePendingRef()) {
      return;
    }
    this.pendingAssetDeleteCardIdRef.set(null);
    this.pendingAssetDeleteLabelRef.set("");
    this.pendingAssetDeleteErrorRef.set("");
    this.touchUiState();
  }
  beginAssetDelete() {
    const pendingCardId = this.pendingAssetDeleteCardIdRef();
    if (!pendingCardId || this.assetDeletePendingRef()) {
      return null;
    }
    this.pendingAssetDeleteErrorRef.set("");
    this.assetDeletePendingRef.set(true);
    this.touchUiState();
    return pendingCardId;
  }
  completeAssetDelete() {
    this.assetDeletePendingRef.set(false);
    this.pendingAssetDeleteCardIdRef.set(null);
    this.pendingAssetDeleteLabelRef.set("");
    this.touchUiState();
  }
  failAssetDelete(message) {
    this.assetDeletePendingRef.set(false);
    this.pendingAssetDeleteErrorRef.set(message);
    this.touchUiState();
  }
  openAssetEditorCreate(form, draftId) {
    const generation = this.bumpAssetEditorGeneration();
    this.showAssetFormRef.set(true);
    this.assetFormLoadingRef.set(false);
    this.assetFormSavePendingRef.set(false);
    this.assetFormReadOnlyRef.set(false);
    this.assetFormParentZIndexRef.set(null);
    this.assetFormRuntimeRouteRef.set(null);
    this.assetFormSavedRuntimeRouteRef.set(null);
    this.assetFormRuntimeAssignmentRef.set(null);
    this.assetFormSavedRuntimeAssignmentRef.set(null);
    this.assetFormCheckoutRef.set(null);
    this.assetFormCheckoutPendingRef.set(false);
    this.editingAssetIdRef.set(null);
    this.assetFormDraftIdRef.set(draftId.trim() || `asset-${Date.now()}`);
    this.assetFormVisibilityRef.set("Public");
    this.assetFormRef.set(form);
    this.touchUiState();
    return generation;
  }
  openAssetEditorEdit(options) {
    const generation = this.bumpAssetEditorGeneration();
    this.showAssetFormRef.set(true);
    this.assetFormLoadingRef.set(options.loading);
    this.assetFormSavePendingRef.set(false);
    this.assetFormReadOnlyRef.set(options.readOnly === true);
    this.assetFormParentZIndexRef.set(this.normalizeParentZIndex(options.parentZIndex));
    const runtimeRoute = this.cloneRuntimeRoute(options.runtimeRoute);
    const runtimeAssignment = this.cloneRuntimeAssignment(options.runtimeAssignment);
    this.assetFormRuntimeRouteRef.set(runtimeRoute);
    this.assetFormSavedRuntimeRouteRef.set(this.cloneRuntimeRoute(runtimeRoute));
    this.assetFormRuntimeAssignmentRef.set(runtimeAssignment);
    this.assetFormSavedRuntimeAssignmentRef.set(this.cloneRuntimeAssignment(runtimeAssignment));
    this.assetFormCheckoutRef.set(this.cloneCheckout(options.checkout));
    this.assetFormCheckoutPendingRef.set(false);
    this.assetFormDraftIdRef.set("");
    this.editingAssetIdRef.set(options.cardId);
    this.assetFormVisibilityRef.set(options.visibility);
    this.assetFormRef.set(runtimeAssignment ? __spreadProps(__spreadValues({}, options.form), {
      quantity: runtimeAssignment.quantity
    }) : options.form);
    this.touchUiState();
    return generation;
  }
  applyAssetEditorForm(cardId, visibility, form) {
    const runtimeAssignment = this.assetFormRuntimeAssignmentRef();
    this.editingAssetIdRef.set(cardId);
    this.assetFormVisibilityRef.set(visibility);
    this.assetFormRef.set(runtimeAssignment ? __spreadProps(__spreadValues({}, form), {
      quantity: runtimeAssignment.quantity
    }) : form);
    this.touchUiState();
  }
  closeAssetEditor() {
    const generation = this.bumpAssetEditorGeneration();
    this.showAssetFormRef.set(false);
    this.editingAssetIdRef.set(null);
    this.assetFormReadOnlyRef.set(false);
    this.assetFormParentZIndexRef.set(null);
    this.assetFormRuntimeRouteRef.set(null);
    this.assetFormSavedRuntimeRouteRef.set(null);
    this.assetFormRuntimeAssignmentRef.set(null);
    this.assetFormSavedRuntimeAssignmentRef.set(null);
    this.assetFormCheckoutRef.set(null);
    this.assetFormCheckoutPendingRef.set(false);
    this.assetFormLoadingRef.set(false);
    this.assetFormSavePendingRef.set(false);
    this.assetFormDraftIdRef.set("");
    this.touchUiState();
    return generation;
  }
  isCurrentAssetEditorLoad(generation, assetId) {
    return this.showAssetFormRef() && this.assetFormLoadGenerationRef() === generation && this.editingAssetIdRef() === assetId;
  }
  setAssetEditorVisibility(option) {
    if (this.assetFormReadOnlyRef() || this.assetFormLoadingRef() || this.assetFormSavePendingRef()) {
      return;
    }
    this.assetFormVisibilityRef.set(option);
    this.touchUiState();
  }
  setAssetEditorForm(form) {
    if (this.assetFormReadOnlyRef() || this.assetFormLoadingRef() || this.assetFormSavePendingRef()) {
      return;
    }
    this.assetFormRef.set(this.cloneAssetForm(form));
    this.touchUiState();
  }
  setAssetEditorRuntimeRouteState(state) {
    const current = this.assetFormRuntimeRouteRef();
    if (!current) {
      return;
    }
    this.assetFormRuntimeRouteRef.set(__spreadProps(__spreadValues({}, current), {
      routeEnabled: typeof state.routeEnabled === "boolean" ? state.routeEnabled : current.routeEnabled,
      routes: state.routes === void 0 ? current.routes : this.cloneStringList(state.routes)
    }));
    this.touchUiState();
  }
  setAssetEditorRuntimeAssignmentState(state) {
    const current = this.assetFormRuntimeAssignmentRef();
    if (!current) {
      return;
    }
    const quantityMax = state.quantityMax === void 0 ? current.quantityMax : this.normalizeRuntimeQuantityMax(state.quantityMax);
    const quantity = state.quantity === void 0 ? this.normalizeRuntimeQuantity(current.quantity, quantityMax, current.quantity) : this.normalizeRuntimeQuantity(state.quantity, quantityMax, current.quantity);
    this.assetFormRuntimeAssignmentRef.set(__spreadProps(__spreadValues({}, current), {
      quantity,
      quantityMax,
      quantityLabel: state.quantityLabel === void 0 ? current.quantityLabel : `${state.quantityLabel ?? ""}`.trim() || void 0,
      quantityDescription: state.quantityDescription === void 0 ? current.quantityDescription : `${state.quantityDescription ?? ""}`.trim() || void 0,
      editable: typeof state.editable === "boolean" ? state.editable : current.editable
    }));
    this.assetFormRef.set(__spreadProps(__spreadValues({}, this.assetFormRef()), {
      quantity
    }));
    this.touchUiState();
  }
  setAssetEditorCheckoutState(state) {
    this.assetFormCheckoutRef.set(this.cloneCheckout(state));
    this.touchUiState();
  }
  setAssetEditorCheckoutPending(pending) {
    this.assetFormCheckoutPendingRef.set(pending);
  }
  setAssetEditorImageUrl(imageUrl) {
    if (this.assetFormReadOnlyRef() || this.assetFormLoadingRef() || this.assetFormSavePendingRef()) {
      return;
    }
    this.assetFormRef().imageUrl = imageUrl.trim();
    this.touchUiState();
  }
  setAssetEditorLoading(loading) {
    this.assetFormLoadingRef.set(loading);
    this.touchUiState();
  }
  beginAssetEditorSave() {
    if (this.assetFormReadOnlyRef() || this.assetFormLoadingRef() || this.assetFormSavePendingRef()) {
      return false;
    }
    this.assetFormSavePendingRef.set(true);
    this.touchUiState();
    return true;
  }
  beginAssetEditorRuntimeAssignmentSave() {
    const current = this.assetFormRuntimeAssignmentRef();
    if (!current?.editable || this.assetFormLoadingRef() || this.assetFormSavePendingRef()) {
      return false;
    }
    this.assetFormSavePendingRef.set(true);
    this.touchUiState();
    return true;
  }
  completeAssetEditorSave() {
    this.assetFormSavePendingRef.set(false);
    this.closeAssetEditor();
  }
  failAssetEditorSave() {
    this.assetFormSavePendingRef.set(false);
    this.touchUiState();
  }
  completeAssetEditorRuntimeAssignmentSave(state) {
    const currentAssignment = this.assetFormRuntimeAssignmentRef();
    if (currentAssignment) {
      const nextAssignment = this.cloneRuntimeAssignment(__spreadProps(__spreadValues({}, currentAssignment), {
        quantity: state.quantity
      }));
      this.assetFormRuntimeAssignmentRef.set(nextAssignment);
      this.assetFormSavedRuntimeAssignmentRef.set(this.cloneRuntimeAssignment(nextAssignment));
    }
    const currentRoute = this.assetFormRuntimeRouteRef();
    if (currentRoute) {
      const next = this.cloneRuntimeRoute(__spreadProps(__spreadValues({}, currentRoute), {
        routeEnabled: state.routeEnabled === true,
        routes: this.cloneStringList(state.routes)
      }));
      this.assetFormRuntimeRouteRef.set(next);
      this.assetFormSavedRuntimeRouteRef.set(this.cloneRuntimeRoute(next));
    }
    this.assetFormSavePendingRef.set(false);
    this.closeAssetEditor();
  }
  bumpAssetEditorGeneration() {
    const nextGeneration = this.assetFormLoadGenerationRef() + 1;
    this.assetFormLoadGenerationRef.set(nextGeneration);
    return nextGeneration;
  }
  normalizeParentZIndex(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
  }
  cloneRuntimeRoute(state) {
    if (!state) {
      return null;
    }
    return __spreadProps(__spreadValues({}, state), {
      routeEnabled: state.routeEnabled === true,
      routes: this.cloneStringList(state.routes),
      editable: state.editable === true,
      parentZIndex: this.normalizeParentZIndex(state.parentZIndex)
    });
  }
  cloneRuntimeAssignment(state) {
    if (!state) {
      return null;
    }
    const quantityMax = this.normalizeRuntimeQuantityMax(state.quantityMax);
    return __spreadProps(__spreadValues({}, state), {
      quantityMax,
      quantity: this.normalizeRuntimeQuantity(state.quantity, quantityMax),
      editable: state.editable === true
    });
  }
  cloneCheckout(state) {
    if (!state) {
      return null;
    }
    return __spreadProps(__spreadValues({}, state), {
      sourceId: state.sourceId.trim(),
      title: state.title.trim(),
      subtitle: `${state.subtitle ?? ""}`.trim() || null,
      dateRange: __spreadValues({}, state.dateRange),
      cancellationPolicy: state.cancellationPolicy ? structuredClone(state.cancellationPolicy) : null,
      refundPreview: state.refundPreview ? __spreadValues({}, state.refundPreview) : null,
      dateRangeModel: __spreadProps(__spreadValues({}, state.dateRangeModel), {
        field: state.dateRangeModel.field ? __spreadValues({}, state.dateRangeModel.field) : void 0,
        range: state.dateRangeModel.range ? __spreadProps(__spreadValues({}, state.dateRangeModel.range), {
          bounds: state.dateRangeModel.range.bounds ? __spreadValues({}, state.dateRangeModel.range.bounds) : state.dateRangeModel.range.bounds,
          start: state.dateRangeModel.range.start ? __spreadValues({}, state.dateRangeModel.range.start) : state.dateRangeModel.range.start,
          end: state.dateRangeModel.range.end ? __spreadValues({}, state.dateRangeModel.range.end) : state.dateRangeModel.range.end
        }) : void 0,
        meta: state.dateRangeModel.meta ? __spreadValues({}, state.dateRangeModel.meta) : state.dateRangeModel.meta
      }),
      availableQuantity: Math.max(0, Math.trunc(Number(state.availableQuantity) || 0)),
      pricingPreview: __spreadProps(__spreadValues({}, state.pricingPreview), {
        rows: (state.pricingPreview.rows ?? []).map((row) => __spreadValues({}, row))
      }),
      acceptedPolicyIds: [...new Set(state.acceptedPolicyIds)].map((policyId) => policyId.trim()).filter(Boolean),
      footerItems: (state.footerItems ?? []).map((item) => __spreadValues({}, item)),
      pendingFooterItemId: `${state.pendingFooterItemId ?? ""}`.trim() || null,
      pendingFooterLabel: `${state.pendingFooterLabel ?? ""}`.trim() || null,
      paymentMethod: state.paymentMethod ? __spreadValues({}, state.paymentMethod) : null,
      busy: state.busy === true,
      error: `${state.error ?? ""}`.trim() || null
    });
  }
  normalizeRuntimeQuantityMax(value) {
    const parsed = Math.trunc(Number(value));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }
  normalizeRuntimeQuantity(value, max, fallback = 1) {
    const limit = this.normalizeRuntimeQuantityMax(max);
    const parsed = Math.trunc(Number(value));
    const fallbackValue = Math.trunc(Number(fallback));
    const resolved = Number.isFinite(parsed) && parsed > 0 ? parsed : Number.isFinite(fallbackValue) && fallbackValue > 0 ? fallbackValue : 1;
    return Math.min(limit, Math.max(1, resolved));
  }
  cloneAssetForm(form) {
    return __spreadProps(__spreadValues({}, form), {
      routes: [...form.routes ?? []],
      topics: [...form.topics ?? []],
      policies: (form.policies ?? []).map((policy) => __spreadValues({}, policy)),
      pricing: PricingBuilder.clonePricingConfig(form.pricing ?? null)
    });
  }
  cloneStringList(items) {
    return (items ?? []).map((item) => `${item ?? ""}`.trim()).filter((item) => item.length > 0);
  }
  cardsByType(type) {
    return this.assetCardsRef().filter((card) => card.type === type);
  }
  orderedCardsByType(type, selectedAssetIds = null) {
    return this.cardsByType(type).sort((left, right) => {
      if (selectedAssetIds) {
        const selectedDelta = Number(selectedAssetIds.has(right.id)) - Number(selectedAssetIds.has(left.id));
        if (selectedDelta !== 0) {
          return selectedDelta;
        }
      }
      return left.title.localeCompare(right.title) || left.id.localeCompare(right.id);
    });
  }
  findAsset(assetId, type) {
    const normalizedAssetId = assetId.trim();
    if (!normalizedAssetId) {
      return null;
    }
    return this.assetCardsRef().find((card) => card.id === normalizedAssetId && (type === void 0 || card.type === type)) ?? null;
  }
  hasAsset(assetId, type) {
    return this.findAsset(assetId, type) !== null;
  }
  resetVisibleAssetListSync() {
    this.visibleListContextKey = "";
    this.visibleListSignature = "";
    this.visibleListCardCount = 0;
    this.visibleListReady = false;
    this.visibleListRenderedCount = 0;
  }
  trackVisibleAssetListState(state, cards) {
    this.visibleListRenderedCount = state.items.length;
    this.visibleListReady = !state.initialLoading;
    if (!this.visibleListReady || state.total === cards.length) {
      return null;
    }
    return this.createVisibleAssetListPatch(cards, state.total, state.items.length);
  }
  syncVisibleAssetList(options) {
    if (!options.active) {
      this.resetVisibleAssetListSync();
      return null;
    }
    const signature = this.visibleAssetListSignature(options.contextKey, options.cards);
    if (options.contextKey !== this.visibleListContextKey) {
      this.visibleListContextKey = options.contextKey;
      this.visibleListSignature = signature;
      this.visibleListCardCount = options.cards.length;
      this.visibleListReady = false;
      this.visibleListRenderedCount = 0;
      return null;
    }
    if (signature === this.visibleListSignature) {
      return null;
    }
    const previousCardCount = this.visibleListCardCount;
    this.visibleListSignature = signature;
    this.visibleListCardCount = options.cards.length;
    return this.createVisibleAssetListPatch(options.cards, previousCardCount, options.renderedCount);
  }
  createVisibleAssetListPatch(cards, previousCardCount, renderedCount) {
    if (!this.visibleListReady) {
      return null;
    }
    const visibleCount = Math.max(this.visibleListRenderedCount, renderedCount);
    const allCardsWereVisible = visibleCount >= previousCardCount;
    let nextVisibleCount = Math.min(cards.length, visibleCount);
    if (cards.length > previousCardCount && allCardsWereVisible) {
      nextVisibleCount = Math.min(cards.length, visibleCount + 1);
    }
    return {
      items: cards.slice(0, nextVisibleCount),
      total: cards.length
    };
  }
  visibleAssetListSignature(contextKey, cards) {
    return `${contextKey}:${cards.map((card) => [
      card.id,
      card.type,
      card.title,
      card.subtitle,
      card.city,
      card.capacityTotal,
      card.quantity,
      card.description,
      card.imageUrl,
      card.locationLabel ?? "",
      card.priceLabel ?? "",
      card.policyCount ?? 0,
      card.visibility ?? "",
      card.status ?? "",
      card.ownerUserId ?? "",
      card.ownerName ?? "",
      (card.menuActions ?? []).join(","),
      card.requests.map((request) => [
        request.id,
        request.status,
        request.note,
        request.requestKind ?? "",
        request.booking?.quantity ?? "",
        request.booking?.inventoryApplied ?? "",
        (request.menuActions ?? []).join(",")
      ].join("/")).join(",")
    ].join(":")).join("|")}`;
  }
  static \u0275fac = function AssetStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssetStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AssetStore, factory: _AssetStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AssetStore
};
//# sourceMappingURL=chunk-OYOBMUF7.js.map
