import {
  AssetDto,
  PricingBuilder
} from "./chunk-F4WY6ECV.js";
import {
  ASSET_FILTER_TICKET,
  ASSET_TYPE_TRANSPORT
} from "./chunk-XQ4NDAVX.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

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
  impressionsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "impressionsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  profileEditorComponentRef = signal(null, ...ngDevMode ? [{ debugName: "profileEditorComponentRef" }] : (
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
  openImpressionsPopup(userId) {
    this.impressionsPopupUserIdRef.set(userId.trim());
    this.impressionsPopupOpenRef.set(true);
  }
  closeImpressionsPopup() {
    this.impressionsPopupOpenRef.set(false);
    this.impressionsPopupUserIdRef.set("");
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
    const module = await import("./impressions-popup.component-UTSXNWVA.js");
    this.impressionsPopupComponentRef.set(module.ProfileImpressionsPopupComponent);
  }
  async ensureProfileEditorLoaded() {
    if (this.profileEditorComponentRef()) {
      return;
    }
    const module = await import("./profile-editor.component-3YKOYVQT.js");
    this.profileEditorComponentRef.set(module.ProfileEditorComponent);
  }
  async ensureProfileViewPopupLoaded() {
    if (this.profileViewPopupComponentRef()) {
      return;
    }
    const module = await import("./profile-view-popup.component-OFVU7L6O.js");
    this.profileViewPopupComponentRef.set(module.ProfileViewPopupComponent);
  }
  async ensureContactsPopupLoaded() {
    if (this.contactsPopupComponentRef()) {
      return;
    }
    const module = await import("./contacts-popup.component-IUFE46NP.js");
    this.contactsPopupComponentRef.set(module.ContactsPopupComponent);
  }
  async ensureExplanationPopupLoaded() {
    if (this.explanationPopupComponentRef()) {
      return;
    }
    const module = await import("./explanation-popup.component-3UOVVIEH.js");
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

// src/app/shared/ui/context/stores/activities-popup.store.ts
function eventChatPopupRequestFromChat(chat) {
  return {
    chatId: chat.id,
    ownerId: chat.ownerId ?? null,
    channelType: chat.channelType ?? null
  };
}
function eventChatHeaderStateFromChat(chat) {
  return __spreadProps(__spreadValues({}, eventChatPopupRequestFromChat(chat)), {
    avatar: chat.avatar,
    title: chat.title,
    memberIds: [...chat.memberIds ?? []],
    members: (chat.members ?? []).map((member) => __spreadValues({}, member)),
    unread: chat.unread,
    dateIso: chat.dateIso ?? null,
    lastMessage: chat.lastMessage,
    lastSenderId: chat.lastSenderId,
    ownerUserId: chat.ownerUserId ?? null,
    eventId: chat.eventId ?? null,
    subEventId: chat.subEventId ?? null,
    groupId: chat.groupId ?? null,
    ownerStatus: chat.ownerStatus ?? null,
    revision: Math.max(1, Math.trunc(Number(chat.revision) || 1)),
    supportCase: chat.supportCase ? __spreadProps(__spreadValues({}, chat.supportCase), {
      assignee: chat.supportCase.assignee ? __spreadValues({}, chat.supportCase.assignee) : chat.supportCase.assignee
    }) : chat.supportCase,
    metrics: chat.metrics ? {
      members: chat.metrics.members ? __spreadValues({}, chat.metrics.members) : null,
      transport: chat.metrics.transport ? __spreadValues({}, chat.metrics.transport) : null,
      accommodation: chat.metrics.accommodation ? __spreadValues({}, chat.metrics.accommodation) : null,
      supplies: chat.metrics.supplies ? __spreadValues({}, chat.metrics.supplies) : null,
      groupsCount: chat.metrics.groupsCount ?? null,
      pendingTotal: Math.max(0, Math.trunc(Number(chat.metrics.pendingTotal) || 0))
    } : chat.metrics,
    navigationContext: chat.navigationContext ? __spreadProps(__spreadValues({}, chat.navigationContext), {
      subEvent: __spreadValues({}, chat.navigationContext.subEvent),
      group: chat.navigationContext.group ? __spreadValues({}, chat.navigationContext.group) : chat.navigationContext.group
    }) : chat.navigationContext
  });
}
var DEFAULT_ACTIVITIES_UI_STATE = {
  open: false,
  openRevision: 0,
  primaryFilter: "chats",
  eventScope: "active-events",
  secondaryFilter: "recent",
  chatContextFilter: "all",
  supportCaseFilter: "all",
  hostingPublicationFilter: "all",
  rateFilter: "individual-given",
  rateSocialBadgeEnabled: false,
  rateIndividualSocialBadgeEnabled: false,
  ratePairSocialBadgeEnabled: false,
  view: "day",
  showViewPicker: false,
  showSecondaryPicker: false,
  stickyValue: "",
  ratesFullscreenMode: false,
  selectedRateId: null,
  adminServiceOnly: false
};
var ActivitiesPopupStore = class _ActivitiesPopupStore {
  activityStore = inject(ActivityStore);
  userProfileStore = inject(UserProfileStore);
  _uiState = signal(DEFAULT_ACTIVITIES_UI_STATE, ...ngDevMode ? [{ debugName: "_uiState" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityEventSync = signal(null, ...ngDevMode ? [{ debugName: "_activityEventSync" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventChatSession = signal(null, ...ngDevMode ? [{ debugName: "_eventChatSession" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventChatHeader = signal(null, ...ngDevMode ? [{ debugName: "_eventChatHeader" }] : (
    /* istanbul ignore next */
    []
  ));
  _stackedEventChatSession = signal(null, ...ngDevMode ? [{ debugName: "_stackedEventChatSession" }] : (
    /* istanbul ignore next */
    []
  ));
  _stackedEventChatHeader = signal(null, ...ngDevMode ? [{ debugName: "_stackedEventChatHeader" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventChatRowPatch = signal(null, ...ngDevMode ? [{ debugName: "_eventChatRowPatch" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventFeedbackRatedDetailSession = signal(null, ...ngDevMode ? [{ debugName: "_eventFeedbackRatedDetailSession" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "activitiesPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventChatPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventExplorePopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventExplorePopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventMembersPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventMembersPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventFeedbackPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackRatedDetailPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventFeedbackRatedDetailPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesUiState = this._uiState.asReadonly();
  activitiesOpen = computed(() => this._uiState().open, ...ngDevMode ? [{ debugName: "activitiesOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesOpenRevision = computed(() => this._uiState().openRevision, ...ngDevMode ? [{ debugName: "activitiesOpenRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesPrimaryFilter = computed(() => this._uiState().primaryFilter, ...ngDevMode ? [{ debugName: "activitiesPrimaryFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesEventScope = computed(() => this._uiState().eventScope, ...ngDevMode ? [{ debugName: "activitiesEventScope" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesSecondaryFilter = computed(() => this._uiState().secondaryFilter, ...ngDevMode ? [{ debugName: "activitiesSecondaryFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesChatContextFilter = computed(() => this._uiState().chatContextFilter, ...ngDevMode ? [{ debugName: "activitiesChatContextFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesSupportCaseFilter = computed(() => this._uiState().supportCaseFilter, ...ngDevMode ? [{ debugName: "activitiesSupportCaseFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesHostingPublicationFilter = computed(() => this._uiState().hostingPublicationFilter, ...ngDevMode ? [{ debugName: "activitiesHostingPublicationFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesRateFilter = computed(() => this._uiState().rateFilter, ...ngDevMode ? [{ debugName: "activitiesRateFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesRateSocialBadgeEnabled = computed(() => this.resolveRateSocialBadgeEnabled(this._uiState()), ...ngDevMode ? [{ debugName: "activitiesRateSocialBadgeEnabled" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesIndividualRateSocialBadgeEnabled = computed(() => this._uiState().rateIndividualSocialBadgeEnabled, ...ngDevMode ? [{ debugName: "activitiesIndividualRateSocialBadgeEnabled" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesPairRateSocialBadgeEnabled = computed(() => this._uiState().ratePairSocialBadgeEnabled, ...ngDevMode ? [{ debugName: "activitiesPairRateSocialBadgeEnabled" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesView = computed(() => this._uiState().view, ...ngDevMode ? [{ debugName: "activitiesView" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesShowViewPicker = computed(() => this._uiState().showViewPicker, ...ngDevMode ? [{ debugName: "activitiesShowViewPicker" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesShowSecondaryPicker = computed(() => this._uiState().showSecondaryPicker, ...ngDevMode ? [{ debugName: "activitiesShowSecondaryPicker" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesStickyValue = computed(() => this._uiState().stickyValue, ...ngDevMode ? [{ debugName: "activitiesStickyValue" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesRatesFullscreenMode = computed(() => this._uiState().ratesFullscreenMode, ...ngDevMode ? [{ debugName: "activitiesRatesFullscreenMode" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesSelectedRateId = computed(() => this._uiState().selectedRateId, ...ngDevMode ? [{ debugName: "activitiesSelectedRateId" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesAdminServiceOnly = computed(() => this._uiState().adminServiceOnly, ...ngDevMode ? [{ debugName: "activitiesAdminServiceOnly" }] : (
    /* istanbul ignore next */
    []
  ));
  activityEventSync = this._activityEventSync.asReadonly();
  activityEventSave = computed(() => {
    const message = this._activityEventSync();
    return message?.kind === "upsert" ? message.event : null;
  }, ...ngDevMode ? [{ debugName: "activityEventSave" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatSession = this._eventChatSession.asReadonly();
  eventChatHeader = this._eventChatHeader.asReadonly();
  stackedEventChatSession = this._stackedEventChatSession.asReadonly();
  stackedEventChatHeader = this._stackedEventChatHeader.asReadonly();
  eventChatRowPatch = this._eventChatRowPatch.asReadonly();
  eventFeedbackRatedDetailSession = this._eventFeedbackRatedDetailSession.asReadonly();
  activitiesPopupComponent = this.activitiesPopupComponentRef.asReadonly();
  eventChatPopupComponent = this.eventChatPopupComponentRef.asReadonly();
  eventExplorePopupComponent = this.eventExplorePopupComponentRef.asReadonly();
  eventMembersPopupComponent = this.eventMembersPopupComponentRef.asReadonly();
  eventFeedbackPopupComponent = this.eventFeedbackPopupComponentRef.asReadonly();
  eventFeedbackRatedDetailPopupComponent = this.eventFeedbackRatedDetailPopupComponentRef.asReadonly();
  activitiesOpenBoolean = computed(() => this._uiState().open, ...ngDevMode ? [{ debugName: "activitiesOpenBoolean" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatOpen = computed(() => this._eventChatSession() !== null, ...ngDevMode ? [{ debugName: "eventChatOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  stackedEventChatOpen = computed(() => this._stackedEventChatSession() !== null, ...ngDevMode ? [{ debugName: "stackedEventChatOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatRowPatchRevision = 0;
  openActivities(primaryFilter = "chats", eventScope, initialRateFilter, initialRateSocialBadgeEnabled = false, options = {}) {
    const adminServiceOnly = options.adminServiceOnly === true;
    const normalizedPrimaryFilter = adminServiceOnly ? "chats" : this.normalizeActivitiesPrimaryFilter(primaryFilter);
    const resolvedScope = this.resolveActivitiesEventScope(primaryFilter, eventScope);
    const resolvedRateFilter = initialRateFilter ?? "individual-given";
    this._uiState.update((state) => __spreadValues(__spreadProps(__spreadValues({}, state), {
      open: true,
      openRevision: state.openRevision + 1,
      primaryFilter: normalizedPrimaryFilter,
      eventScope: resolvedScope,
      secondaryFilter: "recent",
      hostingPublicationFilter: resolvedScope === "drafts" ? "drafts" : "all",
      chatContextFilter: adminServiceOnly ? "service" : "all",
      supportCaseFilter: "all",
      showViewPicker: false,
      showSecondaryPicker: false,
      view: normalizedPrimaryFilter === "rates" ? "distance" : "day",
      stickyValue: "",
      ratesFullscreenMode: false,
      selectedRateId: null,
      adminServiceOnly
    }), normalizedPrimaryFilter === "rates" ? {
      rateFilter: resolvedRateFilter,
      rateSocialBadgeEnabled: initialRateSocialBadgeEnabled,
      rateIndividualSocialBadgeEnabled: resolvedRateFilter.startsWith("individual") ? initialRateSocialBadgeEnabled : false,
      ratePairSocialBadgeEnabled: resolvedRateFilter.startsWith("pair") ? initialRateSocialBadgeEnabled : false
    } : {
      rateSocialBadgeEnabled: false,
      rateIndividualSocialBadgeEnabled: false,
      ratePairSocialBadgeEnabled: false
    }));
  }
  closeActivities() {
    this.patchUiState({ open: false, adminServiceOnly: false, supportCaseFilter: "all" });
    this._eventChatSession.set(null);
    this._eventChatHeader.set(null);
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  get isActivitiesOpen() {
    return this._uiState().open;
  }
  setActivitiesPrimaryFilter(filter) {
    if (this._uiState().adminServiceOnly) {
      this.patchUiState({
        primaryFilter: "chats",
        chatContextFilter: "service",
        supportCaseFilter: "all",
        showViewPicker: false,
        showSecondaryPicker: false
      });
      return;
    }
    const normalizedFilter = this.normalizeActivitiesPrimaryFilter(filter);
    this._uiState.update((state) => __spreadProps(__spreadValues({}, state), {
      primaryFilter: normalizedFilter,
      eventScope: normalizedFilter === "events" ? "active-events" : state.eventScope,
      hostingPublicationFilter: "all",
      showViewPicker: false,
      showSecondaryPicker: false,
      chatContextFilter: "all",
      supportCaseFilter: "all",
      ratesFullscreenMode: normalizedFilter !== "rates" ? false : state.ratesFullscreenMode,
      rateFilter: normalizedFilter === "rates" ? "individual-given" : state.rateFilter,
      rateSocialBadgeEnabled: normalizedFilter === "rates" ? this.resolveRateSocialBadgeEnabled(state) : false,
      rateIndividualSocialBadgeEnabled: normalizedFilter === "rates" ? state.rateIndividualSocialBadgeEnabled : false,
      ratePairSocialBadgeEnabled: normalizedFilter === "rates" ? state.ratePairSocialBadgeEnabled : false,
      view: normalizedFilter === "rates" ? "distance" : normalizedFilter === "chats" ? "day" : state.view,
      selectedRateId: null
    }));
  }
  setActivitiesEventScope(scope) {
    this.patchUiState({
      eventScope: scope,
      hostingPublicationFilter: scope === "drafts" ? "drafts" : "all"
    });
  }
  setActivitiesSecondaryFilter(filter) {
    this.patchUiState({
      secondaryFilter: filter,
      showSecondaryPicker: false
    });
  }
  setActivitiesChatContextFilter(filter) {
    this.patchUiState({ chatContextFilter: this._uiState().adminServiceOnly ? "service" : filter });
  }
  setActivitiesSupportCaseFilter(filter) {
    const normalized = filter === "pending" || filter === "warned" || filter === "picked" || filter === "solved" || filter === "blocked" ? filter : "all";
    this.patchUiState({
      supportCaseFilter: normalized,
      chatContextFilter: this._uiState().adminServiceOnly ? "service" : this._uiState().chatContextFilter
    });
  }
  setActivitiesHostingPublicationFilter(filter) {
    this.patchUiState({ hostingPublicationFilter: filter });
  }
  setActivitiesRateFilter(filter) {
    this._uiState.update((state) => {
      const nextState = __spreadProps(__spreadValues({}, state), {
        rateFilter: filter
      });
      return __spreadProps(__spreadValues({}, nextState), {
        rateSocialBadgeEnabled: this.resolveRateSocialBadgeEnabled(nextState)
      });
    });
  }
  setActivitiesRateSocialBadgeEnabled(enabled) {
    this._uiState.update((state) => __spreadValues(__spreadProps(__spreadValues({}, state), {
      rateSocialBadgeEnabled: enabled
    }), state.rateFilter.startsWith("pair") ? { ratePairSocialBadgeEnabled: enabled } : { rateIndividualSocialBadgeEnabled: enabled }));
  }
  setActivitiesRateSocialBadgeEnabledForGroup(group, enabled) {
    this._uiState.update((state) => {
      const nextState = __spreadValues(__spreadValues({}, state), group === "pair" ? { ratePairSocialBadgeEnabled: enabled } : { rateIndividualSocialBadgeEnabled: enabled });
      return __spreadProps(__spreadValues({}, nextState), {
        rateSocialBadgeEnabled: this.resolveRateSocialBadgeEnabled(nextState)
      });
    });
  }
  setActivitiesView(view) {
    this.patchUiState(__spreadValues({
      view,
      showViewPicker: false
    }, view !== "distance" ? { stickyValue: "" } : {}));
  }
  toggleActivitiesViewPicker() {
    this._uiState.update((state) => __spreadProps(__spreadValues({}, state), {
      showViewPicker: !state.showViewPicker,
      showSecondaryPicker: false
    }));
  }
  toggleActivitiesSecondaryPicker() {
    this._uiState.update((state) => __spreadProps(__spreadValues({}, state), {
      showSecondaryPicker: !state.showSecondaryPicker,
      showViewPicker: false
    }));
  }
  setActivitiesStickyValue(value) {
    this.patchUiState({ stickyValue: value });
  }
  setActivitiesRatesFullscreenMode(enabled) {
    this.patchUiState(__spreadValues({
      ratesFullscreenMode: enabled
    }, enabled ? {} : { selectedRateId: null }));
  }
  setActivitiesSelectedRateId(rateId) {
    this.patchUiState({ selectedRateId: rateId });
  }
  emitActivityEventSync(sync) {
    this._activityEventSync.set({
      kind: "upsert",
      event: sync
    });
  }
  emitActivityEventRemoval(sourceId) {
    const normalizedSourceId = sourceId.trim();
    if (!normalizedSourceId) {
      return;
    }
    this._activityEventSync.set({
      kind: "remove",
      sourceId: normalizedSourceId
    });
  }
  emitActivityEventSaveResult(sync) {
    this.emitActivityEventSync(sync);
  }
  clearActivityEventSync() {
    this._activityEventSync.set(null);
  }
  clearActivityEventSave() {
    this.clearActivityEventSync();
  }
  openEventChat(request, header) {
    const normalizedRequest = this.normalizeEventChatRequest(request);
    if (!normalizedRequest) {
      return;
    }
    this._eventChatSession.set({
      request: normalizedRequest,
      openedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
    this._eventChatHeader.set(this.cloneEventChatHeader(__spreadValues(__spreadValues({}, header), normalizedRequest)));
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  closeEventChat() {
    this._eventChatSession.set(null);
    this._eventChatHeader.set(null);
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  patchEventChatHeader(headerUpdater) {
    const header = this._eventChatHeader();
    if (!header) {
      return;
    }
    this._eventChatHeader.set(this.cloneEventChatHeader(headerUpdater(this.cloneEventChatHeader(header))));
  }
  openStackedEventChat(request, header) {
    const normalizedRequest = this.normalizeEventChatRequest(request);
    if (!normalizedRequest) {
      return;
    }
    this._stackedEventChatSession.set({
      request: normalizedRequest,
      openedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
    this._stackedEventChatHeader.set(this.cloneEventChatHeader(__spreadValues(__spreadValues({}, header), normalizedRequest)));
  }
  closeStackedEventChat() {
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  openEventFeedbackRatedDetail(request) {
    const userId = request.userId.trim();
    const eventId = request.eventId.trim();
    if (!userId || !eventId) {
      return;
    }
    this._eventFeedbackRatedDetailSession.set({
      userId,
      eventId,
      eventTitle: request.eventTitle.trim() || "Event",
      openedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  closeEventFeedbackRatedDetail() {
    this._eventFeedbackRatedDetailSession.set(null);
  }
  patchStackedEventChatHeader(headerUpdater) {
    const header = this._stackedEventChatHeader();
    if (!header) {
      return;
    }
    this._stackedEventChatHeader.set(this.cloneEventChatHeader(headerUpdater(this.cloneEventChatHeader(header))));
  }
  emitEventChatRowPatch(patch) {
    const chatId = `${patch.chatId ?? ""}`.trim();
    const ownerId = `${patch.ownerId ?? ""}`.trim();
    const channelType = patch.channelType ?? null;
    if (!chatId && !ownerId) {
      return;
    }
    this.patchActiveChatCounterFromRowPatch(patch);
    this._eventChatRowPatch.set(__spreadProps(__spreadValues({}, patch), {
      chatId,
      ownerId: ownerId || null,
      channelType,
      revision: ++this.eventChatRowPatchRevision
    }));
  }
  patchActiveChatCounterFromRowPatch(patch) {
    if (patch.unreadDelta === void 0 || patch.unreadDelta === null) {
      return;
    }
    const unreadDelta = Number(patch.unreadDelta);
    if (!Number.isFinite(unreadDelta) || unreadDelta === 0) {
      return;
    }
    const activeUser = this.userProfileStore.activeUserProfile();
    const activeUserId = `${activeUser?.id ?? ""}`.trim();
    if (!activeUserId) {
      return;
    }
    const overrides = this.activityStore.getUserCounterOverrides(activeUserId);
    const currentChatCounter = this.normalizeEventChatCounter(overrides.chats ?? activeUser?.activities?.chats);
    const nextChatCounter = this.normalizeEventChatCounter(currentChatCounter + unreadDelta);
    const currentContexts = overrides.chat ?? activeUser?.activities?.chat ?? {};
    const contextKey = this.chatContextCounterKey(patch.channelType);
    const nextContexts = {
      all: this.normalizeEventChatCounter((currentContexts.all ?? currentChatCounter) + unreadDelta),
      event: this.normalizeEventChatCounter((currentContexts.event ?? 0) + (contextKey === "event" ? unreadDelta : 0)),
      subEvent: this.normalizeEventChatCounter((currentContexts.subEvent ?? 0) + (contextKey === "subEvent" ? unreadDelta : 0)),
      group: this.normalizeEventChatCounter((currentContexts.group ?? 0) + (contextKey === "group" ? unreadDelta : 0)),
      service: this.normalizeEventChatCounter((currentContexts.service ?? 0) + (contextKey === "service" ? unreadDelta : 0)),
      appSupport: this.normalizeEventChatCounter((currentContexts.appSupport ?? 0) + (contextKey === "appSupport" ? unreadDelta : 0))
    };
    const counterPatch = { chats: nextChatCounter, chat: nextContexts };
    this.activityStore.patchUserCounterOverrides(activeUserId, counterPatch);
    this.userProfileStore.patchUserActivityCounters(activeUserId, counterPatch);
  }
  chatContextCounterKey(channelType) {
    switch (channelType) {
      case "mainEvent":
        return "event";
      case "optionalSubEvent":
        return "subEvent";
      case "groupSubEvent":
        return "group";
      case "serviceEvent":
        return "service";
      case "appSupport":
      case "supportCase":
        return "appSupport";
      default:
        return null;
    }
  }
  normalizeEventChatCounter(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
  async ensureActivitiesPopupLoaded() {
    if (this.activitiesPopupComponentRef()) {
      return;
    }
    const module = await import("./activities-popup.component-6CZOZ4TG.js");
    this.activitiesPopupComponentRef.set(module.ActivitiesPopupComponent);
  }
  async ensureEventChatPopupLoaded() {
    if (this.eventChatPopupComponentRef()) {
      return;
    }
    const module = await import("./event-chat-popup.component-KAEZPTNG.js");
    this.eventChatPopupComponentRef.set(module.EventChatPopupComponent);
  }
  async ensureEventExplorePopupLoaded() {
    if (this.eventExplorePopupComponentRef()) {
      return;
    }
    const module = await import("./event-explore-popup.component-MVM7PNND.js");
    this.eventExplorePopupComponentRef.set(module.EventExplorePopupComponent);
  }
  async ensureEventMembersPopupLoaded() {
    if (this.eventMembersPopupComponentRef()) {
      return;
    }
    const module = await import("./event-members-popup.component-WY5KFZ4B.js");
    this.eventMembersPopupComponentRef.set(module.EventMembersPopupComponent);
  }
  async ensureEventFeedbackPopupLoaded() {
    if (this.eventFeedbackPopupComponentRef()) {
      return;
    }
    const module = await import("./event-feedback-popup.component-7NPFY5HH.js");
    this.eventFeedbackPopupComponentRef.set(module.EventFeedbackPopupComponent);
  }
  async ensureEventFeedbackRatedDetailPopupLoaded() {
    if (this.eventFeedbackRatedDetailPopupComponentRef()) {
      return;
    }
    const module = await import("./event-feedback-rated-detail-popup.component-JJ765M6R.js");
    this.eventFeedbackRatedDetailPopupComponentRef.set(module.EventFeedbackRatedDetailPopupComponent);
  }
  patchUiState(patch) {
    this._uiState.update((state) => __spreadValues(__spreadValues({}, state), patch));
  }
  resolveRateSocialBadgeEnabled(state) {
    return state.rateFilter.startsWith("pair") ? state.ratePairSocialBadgeEnabled : state.rateIndividualSocialBadgeEnabled;
  }
  normalizeActivitiesPrimaryFilter(filter) {
    if (filter === "hosting" || filter === "invitations") {
      return "events";
    }
    return filter;
  }
  resolveActivitiesEventScope(primaryFilter, explicitScope) {
    if (explicitScope) {
      return explicitScope;
    }
    if (primaryFilter === "invitations") {
      return "invitations";
    }
    if (primaryFilter === "hosting") {
      return "my-events";
    }
    return "active-events";
  }
  normalizeEventChatRequest(request) {
    const chatId = `${request.chatId ?? ""}`.trim();
    const ownerId = `${request.ownerId ?? ""}`.trim();
    const channelType = request.channelType ?? null;
    const parentZIndex = Number(request.parentZIndex);
    if (!chatId && !ownerId) {
      return null;
    }
    return {
      chatId,
      ownerId: ownerId || null,
      channelType,
      parentZIndex: Number.isFinite(parentZIndex) ? Math.max(0, Math.trunc(parentZIndex)) : null
    };
  }
  cloneEventChatHeader(header) {
    return __spreadProps(__spreadValues({}, header), {
      chatId: `${header.chatId ?? ""}`.trim(),
      ownerId: `${header.ownerId ?? ""}`.trim() || null,
      parentZIndex: Number.isFinite(Number(header.parentZIndex)) ? Math.max(0, Math.trunc(Number(header.parentZIndex))) : null,
      memberIds: [...header.memberIds ?? []],
      members: (header.members ?? []).map((member) => __spreadValues({}, member)),
      supportCase: header.supportCase ? __spreadProps(__spreadValues({}, header.supportCase), {
        assignee: header.supportCase.assignee ? __spreadValues({}, header.supportCase.assignee) : header.supportCase.assignee
      }) : header.supportCase,
      metrics: header.metrics ? {
        members: header.metrics.members ? __spreadValues({}, header.metrics.members) : null,
        transport: header.metrics.transport ? __spreadValues({}, header.metrics.transport) : null,
        accommodation: header.metrics.accommodation ? __spreadValues({}, header.metrics.accommodation) : null,
        supplies: header.metrics.supplies ? __spreadValues({}, header.metrics.supplies) : null,
        groupsCount: header.metrics.groupsCount ?? null,
        pendingTotal: Math.max(0, Math.trunc(Number(header.metrics.pendingTotal) || 0))
      } : header.metrics,
      navigationContext: header.navigationContext ? __spreadProps(__spreadValues({}, header.navigationContext), {
        subEvent: __spreadValues({}, header.navigationContext.subEvent),
        group: header.navigationContext.group ? __spreadValues({}, header.navigationContext.group) : header.navigationContext.group
      }) : header.navigationContext
    });
  }
  static \u0275fac = function ActivitiesPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivitiesPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivitiesPopupStore, factory: _ActivitiesPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivitiesPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AssetStore,
  ProfileStore,
  eventChatPopupRequestFromChat,
  eventChatHeaderStateFromChat,
  ActivitiesPopupStore
};
//# sourceMappingURL=chunk-YOGAOTLT.js.map
