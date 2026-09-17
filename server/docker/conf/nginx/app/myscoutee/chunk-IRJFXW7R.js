import {
  APP_STORAGE_KEYS
} from "./chunk-YO3STUCM.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/context/stores/asset-borrow-draft.store.ts
function assetBorrowSelectionSignature(selection) {
  return JSON.stringify([
    Math.max(1, Math.trunc(Number(selection.quantity) || 1)),
    `${selection.startAtIso ?? ""}`.trim(),
    `${selection.endAtIso ?? ""}`.trim(),
    [...new Set(selection.acceptedPolicyIds ?? [])].map((item) => `${item ?? ""}`.trim()).filter(Boolean).sort()
  ]);
}
var AssetBorrowDraftStore = class _AssetBorrowDraftStore {
  static STORAGE_KEY = APP_STORAGE_KEYS.assetBorrowDrafts;
  draftsRef = signal(this.readInitialDrafts(), ...ngDevMode ? [{ debugName: "draftsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  drafts = this.draftsRef.asReadonly();
  list(userId, subEventId) {
    const normalizedUserId = userId.trim();
    const normalizedSubEventId = subEventId.trim();
    if (!normalizedUserId || !normalizedSubEventId) {
      return [];
    }
    return Object.values(this.draftsRef()).filter((draft) => draft.userId === normalizedUserId && draft.subEventId === normalizedSubEventId).sort((left, right) => right.updatedAtMs - left.updatedAtMs);
  }
  read(userId, subEventId, cardId) {
    return this.draftsRef()[this.buildKey(userId, subEventId, cardId)] ?? null;
  }
  save(draft) {
    const normalized = this.normalizeDraft(draft);
    if (!normalized) {
      return;
    }
    const next = __spreadProps(__spreadValues({}, this.draftsRef()), {
      [this.buildKey(normalized.userId, normalized.subEventId, normalized.cardId)]: normalized
    });
    this.draftsRef.set(next);
    this.persist(next);
  }
  clear(userId, subEventId, cardId) {
    const key = this.buildKey(userId, subEventId, cardId);
    const current = this.draftsRef();
    if (!current[key]) {
      return;
    }
    const next = __spreadValues({}, current);
    delete next[key];
    this.draftsRef.set(next);
    this.persist(next);
  }
  reconcileServerCheckoutStates(userId, subEventId, cardIds, checkoutResultStates, nowMs = Date.now()) {
    const normalizedUserId = userId.trim();
    const normalizedSubEventId = subEventId.trim();
    const visibleCardIds = new Set(cardIds.map((cardId) => cardId.trim()).filter(Boolean));
    if (!normalizedUserId || !normalizedSubEventId || visibleCardIds.size === 0) {
      return;
    }
    for (const draft of this.list(normalizedUserId, normalizedSubEventId)) {
      if (!visibleCardIds.has(draft.cardId)) {
        continue;
      }
      const resultState = checkoutResultStates[draft.cardId] ?? null;
      const expiresAtMs = Date.parse(draft.expiresAtIso ?? "");
      if (resultState === null || resultState === "succeeded" || resultState === "deleted" && Number.isFinite(expiresAtMs) && expiresAtMs <= nowMs) {
        this.clear(normalizedUserId, normalizedSubEventId, draft.cardId);
      }
    }
  }
  buildKey(userId, subEventId, cardId) {
    return `${userId.trim()}::${subEventId.trim()}::${cardId.trim()}`;
  }
  normalizeDraft(draft) {
    const userId = draft?.userId?.trim() ?? "";
    const subEventId = draft?.subEventId?.trim() ?? "";
    const cardId = draft?.cardId?.trim() ?? "";
    const ownerUserId = draft?.ownerUserId?.trim() ?? "";
    if (!userId || !subEventId || !cardId || !ownerUserId) {
      return null;
    }
    const paymentMethodId = draft?.paymentMethod?.id?.trim() ?? "";
    const normalized = {
      userId,
      subEventId,
      cardId,
      ownerUserId,
      title: draft?.title?.trim() || "Borrow draft",
      quantity: Math.max(1, Math.trunc(Number(draft?.quantity) || 1)),
      startAtIso: draft?.startAtIso?.trim() || "",
      endAtIso: draft?.endAtIso?.trim() || "",
      acceptedPolicyIds: [...new Set(draft?.acceptedPolicyIds ?? [])].map((item) => item.trim()).filter(Boolean),
      checkoutSessionId: draft?.checkoutSessionId?.trim() || null,
      paymentMethod: paymentMethodId && draft?.paymentMethod ? __spreadProps(__spreadValues({}, draft.paymentMethod), { id: paymentMethodId }) : null,
      paymentStep: draft?.paymentStep === true,
      confirmedSelectionSignature: draft?.confirmedSelectionSignature?.trim() || null,
      expiresAtIso: draft?.expiresAtIso?.trim() || null,
      updatedAtMs: Math.max(0, Math.trunc(Number(draft?.updatedAtMs) || Date.now()))
    };
    if (!normalized.confirmedSelectionSignature && (normalized.paymentStep || normalized.checkoutSessionId)) {
      normalized.confirmedSelectionSignature = assetBorrowSelectionSignature(normalized);
    }
    return normalized;
  }
  readInitialDrafts() {
    if (typeof window === "undefined" || !window.localStorage) {
      return {};
    }
    try {
      const raw = window.localStorage.getItem(_AssetBorrowDraftStore.STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw);
      const next = {};
      for (const value of Object.values(parsed ?? {})) {
        const normalized = this.normalizeDraft(value);
        if (normalized) {
          next[this.buildKey(normalized.userId, normalized.subEventId, normalized.cardId)] = normalized;
        }
      }
      return next;
    } catch {
      return {};
    }
  }
  persist(drafts) {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(_AssetBorrowDraftStore.STORAGE_KEY, JSON.stringify(drafts));
    } catch {
    }
  }
  static \u0275fac = function AssetBorrowDraftStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssetBorrowDraftStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AssetBorrowDraftStore, factory: _AssetBorrowDraftStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetBorrowDraftStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  assetBorrowSelectionSignature,
  AssetBorrowDraftStore
};
//# sourceMappingURL=chunk-IRJFXW7R.js.map
