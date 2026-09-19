import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/context/stores/event-subevents-popup.store.ts
var EventSubeventsPopupStore = class _EventSubeventsPopupStore {
  eventSubeventsListPopupRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsListPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventTournamentGroupsPopupRef = signal(null, ...ngDevMode ? [{ debugName: "eventTournamentGroupsPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventTournamentGroupsUpdateRef = signal(null, ...ngDevMode ? [{ debugName: "eventTournamentGroupsUpdateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsDefinitionDraftUpdateRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsDefinitionDraftUpdateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsReloadRequestRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsReloadRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsListPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsListPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventTournamentGroupsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventTournamentGroupsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsListPopup = this.eventSubeventsListPopupRef.asReadonly();
  eventTournamentGroupsPopup = this.eventTournamentGroupsPopupRef.asReadonly();
  eventTournamentGroupsUpdate = this.eventTournamentGroupsUpdateRef.asReadonly();
  eventSubeventsDefinitionDraftUpdate = this.eventSubeventsDefinitionDraftUpdateRef.asReadonly();
  eventSubeventsReloadRequest = this.eventSubeventsReloadRequestRef.asReadonly();
  eventSubeventsListPopupComponent = this.eventSubeventsListPopupComponentRef.asReadonly();
  eventTournamentGroupsPopupComponent = this.eventTournamentGroupsPopupComponentRef.asReadonly();
  openEventSubeventsListPopup(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    if (!eventId) {
      return;
    }
    const editorAction = payload.editorAction === "manage" || payload.editorAction === "edit" || payload.editorAction === "view" ? payload.editorAction : payload.canEdit === true ? "edit" : "view";
    this.eventSubeventsListPopupRef.set({
      updatedMs: Date.now(),
      host: payload.host ?? "activities",
      eventId,
      target: payload.target ?? "events",
      title: `${payload.title ?? ""}`.trim() || null,
      timeframe: `${payload.timeframe ?? ""}`.trim() || null,
      startAtIso: `${payload.startAtIso ?? ""}`.trim() || null,
      endAtIso: `${payload.endAtIso ?? ""}`.trim() || null,
      mode: payload.mode === "Tournament" ? "Tournament" : payload.mode === "Casual" ? "Casual" : null,
      acceptedMembers: this.nonNegativeInteger(payload.acceptedMembers),
      pendingMembers: this.nonNegativeInteger(payload.pendingMembers),
      capacityTotal: this.nonNegativeInteger(payload.capacityTotal),
      resourceOwnerUserId: `${payload.resourceOwnerUserId ?? ""}`.trim() || null,
      editorAction,
      canEdit: editorAction !== "view"
    });
  }
  closeEventSubeventsListPopup() {
    this.eventSubeventsListPopupRef.set(null);
  }
  updateEventSubeventsEditorAction(eventId, editorAction) {
    const normalizedEventId = eventId.trim();
    this.eventSubeventsListPopupRef.update((request) => {
      if (!request || request.eventId !== normalizedEventId || request.editorAction === editorAction) {
        return request;
      }
      return __spreadProps(__spreadValues({}, request), {
        updatedMs: Date.now(),
        editorAction,
        canEdit: editorAction !== "view"
      });
    });
  }
  openEventTournamentGroupsPopup(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    if (!eventId) {
      return;
    }
    this.eventTournamentGroupsPopupRef.set({
      updatedMs: Date.now(),
      eventId,
      slotId: `${payload.slotId ?? ""}`.trim() || null,
      title: `${payload.title ?? ""}`.trim() || null,
      canManage: payload.canManage === true,
      stages: (payload.stages ?? []).map((stage) => __spreadProps(__spreadValues({}, stage), {
        groups: []
      })),
      selectedStageId: `${payload.selectedStageId ?? ""}`.trim() || null,
      selectedGroupId: `${payload.selectedGroupId ?? ""}`.trim() || null
    });
  }
  closeEventTournamentGroupsPopup() {
    this.eventTournamentGroupsPopupRef.set(null);
  }
  emitEventTournamentGroupsUpdate(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    const stageId = `${payload.stageId ?? ""}`.trim();
    if (!eventId || !stageId) {
      return;
    }
    const updatedMs = Math.max(Date.now(), (this.eventTournamentGroupsUpdateRef()?.updatedMs ?? 0) + 1);
    this.eventTournamentGroupsUpdateRef.set({
      updatedMs,
      eventId,
      slotId: `${payload.slotId ?? ""}`.trim() || null,
      stageId,
      groupsCount: Math.max(0, Math.trunc(Number(payload.groupsCount) || 0)),
      groupsPending: Math.max(0, Math.trunc(Number(payload.groupsPending) || 0)),
      groupsPendingDelta: Number.isFinite(Number(payload.groupsPendingDelta)) ? Math.trunc(Number(payload.groupsPendingDelta)) : 0
    });
  }
  emitEventSubeventsDefinitionDraftPreview(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    if (!eventId) {
      return;
    }
    this.eventSubeventsDefinitionDraftUpdateRef.set({
      updatedMs: this.nextDefinitionDraftUpdatedMs(),
      action: "preview",
      eventId,
      mode: payload.mode === "Tournament" ? "Tournament" : "Casual",
      startAtIso: `${payload.startAtIso ?? ""}`.trim() || null,
      endAtIso: `${payload.endAtIso ?? ""}`.trim() || null,
      slotsEnabled: payload.slotsEnabled === true,
      definitions: (payload.definitions ?? []).map((definition) => __spreadValues({}, definition))
    });
  }
  discardEventSubeventsDefinitionDraft(eventId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    if (!normalizedEventId) {
      return;
    }
    this.eventSubeventsDefinitionDraftUpdateRef.set({
      updatedMs: this.nextDefinitionDraftUpdatedMs(),
      action: "discard",
      eventId: normalizedEventId,
      mode: null,
      startAtIso: null,
      endAtIso: null,
      slotsEnabled: false,
      definitions: []
    });
  }
  clearEventSubeventsDefinitionDraft(eventId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    if (this.eventSubeventsDefinitionDraftUpdateRef()?.eventId === normalizedEventId) {
      this.eventSubeventsDefinitionDraftUpdateRef.set(null);
    }
  }
  requestEventSubeventsReload(eventId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    if (!normalizedEventId) {
      return;
    }
    this.eventSubeventsReloadRequestRef.set({
      revision: (this.eventSubeventsReloadRequestRef()?.revision ?? 0) + 1,
      eventId: normalizedEventId,
      source: "event-save"
    });
  }
  nextDefinitionDraftUpdatedMs() {
    return Math.max(Date.now(), (this.eventSubeventsDefinitionDraftUpdateRef()?.updatedMs ?? 0) + 1);
  }
  nonNegativeInteger(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
  async ensureEventSubeventsListPopupLoaded() {
    if (this.eventSubeventsListPopupComponentRef()) {
      return;
    }
    const module = await import("./event-subevents-list-popup.component-UQRN2KU3.js");
    this.eventSubeventsListPopupComponentRef.set(module.EventSubeventsListPopupComponent);
  }
  async ensureEventTournamentGroupsPopupLoaded() {
    if (this.eventTournamentGroupsPopupComponentRef()) {
      return;
    }
    const module = await import("./event-tournament-groups-popup.component-B4LR4SLK.js");
    this.eventTournamentGroupsPopupComponentRef.set(module.EventTournamentGroupsPopupComponent);
  }
  static \u0275fac = function EventSubeventsPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventSubeventsPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventSubeventsPopupStore, factory: _EventSubeventsPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventSubeventsPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  EventSubeventsPopupStore
};
//# sourceMappingURL=chunk-SEU5J4ES.js.map
