import {
  OperatorRegistryService
} from "./chunk-QE3AUXWT.js";
import {
  normalizeOperatorRegistryBaseUrl
} from "./chunk-4M7S3PHB.js";
import {
  SessionService
} from "./chunk-2ENBQWLU.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/operator-leaderboard.store.ts
var OperatorLeaderboardStore = class _OperatorLeaderboardStore {
  service = inject(OperatorRegistryService);
  sessionService = inject(SessionService);
  revisionRef = signal(0, ...ngDevMode ? [{ debugName: "revisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  summariesRef = signal([], ...ngDevMode ? [{ debugName: "summariesRef" }] : (
    /* istanbul ignore next */
    []
  ));
  latestCacheMutationRef = signal(null, ...ngDevMode ? [{ debugName: "latestCacheMutationRef" }] : (
    /* istanbul ignore next */
    []
  ));
  cacheUpserts = /* @__PURE__ */ new Map();
  cacheTombstones = /* @__PURE__ */ new Set();
  contextKey = this.sessionKey(this.sessionService.currentSession());
  generation = 0;
  mutationSequence = 0;
  revision = this.revisionRef.asReadonly();
  summaries = this.summariesRef.asReadonly();
  latestCacheMutation = this.latestCacheMutationRef.asReadonly();
  constructor() {
    effect(() => {
      const nextContextKey = this.sessionKey(this.sessionService.session());
      if (nextContextKey === this.contextKey) {
        return;
      }
      this.contextKey = nextContextKey;
      this.generation += 1;
      this.summariesRef.set([]);
      this.resetCacheOverlay();
      this.revisionRef.update((value) => value + 1);
    });
  }
  async queryPage(query, signal2) {
    const generation = this.generation;
    const page = await this.service.leaderboardPage(query, signal2);
    if (generation === this.generation && !signal2?.aborted) {
      this.summariesRef.set(page.context?.groupSummaries ?? []);
    }
    return this.applyCacheOverlay(page, !query.cursor);
  }
  async queryDeploymentPage(query, signal2) {
    const groupId = query.filters?.groupId?.trim() ?? "";
    if (!groupId) {
      throw new Error("operator.leaderboard.deployments.error.group.invalid");
    }
    return this.service.leaderboardDeploymentPage(groupId, query, signal2);
  }
  applyMutation(result) {
    const removedEntryIds = [...new Set(result.removedLeaderboardEntryIds.map((id) => id.trim()).filter(Boolean))];
    for (const id of removedEntryIds) {
      this.cacheUpserts.delete(id);
      this.cacheTombstones.add(id);
    }
    const upsertsById = /* @__PURE__ */ new Map();
    for (const sourceEntry of result.leaderboardUpserts) {
      const id = sourceEntry.id.trim();
      if (!id) {
        continue;
      }
      const entry = __spreadProps(__spreadValues({}, structuredClone(sourceEntry)), {
        id
      });
      upsertsById.set(id, entry);
      this.cacheTombstones.delete(id);
      this.cacheUpserts.set(id, entry);
    }
    const leaderboardUpserts = [...upsertsById.values()];
    const totalDeltaValue = Number(result.leaderboardTotalDelta);
    const leaderboardTotalDelta = Number.isFinite(totalDeltaValue) ? Math.trunc(totalDeltaValue) : 0;
    if (leaderboardUpserts.length === 0 && removedEntryIds.length === 0 && leaderboardTotalDelta === 0) {
      return null;
    }
    const mutation = {
      sequence: ++this.mutationSequence,
      leaderboardUpserts,
      removedEntryIds,
      leaderboardTotalDelta
    };
    this.latestCacheMutationRef.set(mutation);
    return mutation;
  }
  consumeCacheMutation(sequence) {
    if (this.latestCacheMutationRef()?.sequence === sequence) {
      this.latestCacheMutationRef.set(null);
    }
  }
  invalidate() {
    this.generation += 1;
    this.summariesRef.set([]);
    this.resetCacheOverlay();
    this.revisionRef.update((value) => value + 1);
  }
  applyCacheOverlay(page, initialPage) {
    const items = [];
    const seen = /* @__PURE__ */ new Set();
    for (const sourceEntry of page.items) {
      const id = sourceEntry.id.trim();
      if (!id || this.cacheTombstones.has(id) || seen.has(id)) {
        continue;
      }
      const overlay = this.cacheUpserts.get(id);
      if (overlay) {
        if (!initialPage) {
          continue;
        }
        items.push(structuredClone(overlay));
      } else {
        items.push(sourceEntry);
      }
      seen.add(id);
    }
    if (initialPage) {
      for (const [id, entry] of this.cacheUpserts) {
        if (!seen.has(id) && !this.cacheTombstones.has(id)) {
          items.push(structuredClone(entry));
          seen.add(id);
        }
      }
    }
    return __spreadProps(__spreadValues({}, page), {
      items,
      total: Math.max(items.length, page.total)
    });
  }
  resetCacheOverlay() {
    this.cacheUpserts.clear();
    this.cacheTombstones.clear();
    this.latestCacheMutationRef.set(null);
  }
  sessionKey(session) {
    if (session?.kind === "demo") {
      return `demo:${session.userId.trim()}`;
    }
    if (session?.kind === "firebase") {
      return `firebase:${session.profile.id.trim()}`;
    }
    if (session?.kind === "operator-bootstrap") {
      return `operator-bootstrap:${session.email.trim()}`;
    }
    return "none";
  }
  static \u0275fac = function OperatorLeaderboardStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorLeaderboardStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OperatorLeaderboardStore, factory: _OperatorLeaderboardStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorLeaderboardStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/shared/ui/context/stores/operator-registry.store.ts
var OperatorRegistryStore = class _OperatorRegistryStore {
  service = inject(OperatorRegistryService);
  sessionService = inject(SessionService);
  leaderboard = inject(OperatorLeaderboardStore);
  statusRef = signal(null, ...ngDevMode ? [{ debugName: "statusRef" }] : (
    /* istanbul ignore next */
    []
  ));
  inspectionRef = signal(null, ...ngDevMode ? [{ debugName: "inspectionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  measurementSyncRef = signal(null, ...ngDevMode ? [{ debugName: "measurementSyncRef" }] : (
    /* istanbul ignore next */
    []
  ));
  busyActionRef = signal(null, ...ngDevMode ? [{ debugName: "busyActionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  errorRef = signal("", ...ngDevMode ? [{ debugName: "errorRef" }] : (
    /* istanbul ignore next */
    []
  ));
  noticeRef = signal("", ...ngDevMode ? [{ debugName: "noticeRef" }] : (
    /* istanbul ignore next */
    []
  ));
  registryBaseUrlRef = signal("", ...ngDevMode ? [{ debugName: "registryBaseUrlRef" }] : (
    /* istanbul ignore next */
    []
  ));
  expectedRegistryScopeRef = signal("", ...ngDevMode ? [{ debugName: "expectedRegistryScopeRef" }] : (
    /* istanbul ignore next */
    []
  ));
  candidateInitialized = false;
  requestGeneration = 0;
  boundContextKey = this.currentContextKey();
  status = this.statusRef.asReadonly();
  inspection = this.inspectionRef.asReadonly();
  measurementSync = this.measurementSyncRef.asReadonly();
  busyAction = this.busyActionRef.asReadonly();
  error = this.errorRef.asReadonly();
  notice = this.noticeRef.asReadonly();
  registryBaseUrl = this.registryBaseUrlRef.asReadonly();
  expectedRegistryScope = this.expectedRegistryScopeRef.asReadonly();
  registryOptions = computed(() => this.statusRef()?.registryOptions ?? [], ...ngDevMode ? [{ debugName: "registryOptions" }] : (
    /* istanbul ignore next */
    []
  ));
  canInspect = computed(() => {
    const status = this.statusRef();
    return this.busyActionRef() === null && Boolean(this.registryBaseUrlRef().trim()) && !(status?.enabled && status.lifecycle === "REGISTERED");
  }, ...ngDevMode ? [{ debugName: "canInspect" }] : (
    /* istanbul ignore next */
    []
  ));
  canRegister = computed(() => {
    const baseUrl = this.registryBaseUrlRef().trim();
    if (this.busyActionRef() !== null || !baseUrl) {
      return false;
    }
    const status = this.statusRef();
    const currentUrl = status?.selection?.baseUrl?.trim() ?? "";
    const currentScope = (status?.selection?.registryScope ?? status?.selection?.registryIdentity?.registryScope ?? "").trim();
    const targetScope = this.expectedRegistryScopeRef().trim();
    const sameTarget = currentUrl && sameRegistryUrl(currentUrl, baseUrl) && !(currentScope && targetScope && currentScope !== targetScope);
    return !(status?.enabled && status.lifecycle === "REGISTERED" && sameTarget);
  }, ...ngDevMode ? [{ debugName: "canRegister" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      this.bindContext(this.sessionService.session());
    });
  }
  async loadStatus() {
    this.ensureContextBound();
    return await this.run("load", () => this.service.loadStatus());
  }
  async inspect(request) {
    this.ensureContextBound();
    this.inspectionRef.set(null);
    const inspection = await this.run("inspect", () => this.service.inspect(request));
    if (inspection) {
      this.inspectionRef.set(inspection);
      this.registryBaseUrlRef.set(inspection.baseUrl);
      this.expectedRegistryScopeRef.set(inspection.registryIdentity.registryScope);
      this.candidateInitialized = true;
    }
    return inspection;
  }
  async confirm() {
    this.ensureContextBound();
    const inspectionToken = this.inspectionRef()?.inspectionToken.trim() ?? "";
    if (!inspectionToken) {
      this.errorRef.set("operator.registration.error.inspection.required");
      return null;
    }
    const status = await this.run("confirm", () => this.service.confirm(inspectionToken));
    if (status) {
      this.inspectionRef.set(null);
    }
    return status;
  }
  async register() {
    this.ensureContextBound();
    const registryBaseUrl = this.registryBaseUrlRef().trim();
    if (!registryBaseUrl) {
      this.errorRef.set("operator.registration.error.registry.required");
      return null;
    }
    const expectedRegistryScope = this.expectedRegistryScopeRef().trim();
    const request = __spreadValues({
      registryBaseUrl
    }, expectedRegistryScope ? { expectedRegistryScope } : {});
    const replaceExistingBinding = this.requiresRegistrationReplacement(this.statusRef(), registryBaseUrl, expectedRegistryScope);
    const result = await this.run("register", async () => {
      if (!replaceExistingBinding) {
        return this.service.register(request);
      }
      const replacement = await this.service.replaceRegistration(request);
      if (!replacement.registered) {
        this.applyDisconnectMutation(replacement.disconnected);
        throw new Error("operator.registration.error.switch.partial");
      }
      return this.registrationReplacementMutation(replacement.disconnected, replacement.registered);
    });
    if (result) {
      const status = result.status;
      this.inspectionRef.set(null);
      this.measurementSyncRef.set(null);
      this.registryBaseUrlRef.set(status.selection?.baseUrl ?? registryBaseUrl);
      this.expectedRegistryScopeRef.set(status.selection?.registryScope ?? status.selection?.registryIdentity?.registryScope ?? this.expectedRegistryScopeRef());
      this.candidateInitialized = true;
      this.leaderboard.applyMutation(result);
      return status;
    }
    return null;
  }
  applyDisconnectMutation(result) {
    this.statusRef.set(result.status);
    this.inspectionRef.set(null);
    this.measurementSyncRef.set(null);
    this.leaderboard.applyMutation(result);
  }
  registrationReplacementMutation(disconnected, registered) {
    const upserts = new Map([...disconnected.leaderboardUpserts, ...registered.leaderboardUpserts].map((entry) => [entry.id.trim(), entry]).filter(([id]) => Boolean(id)));
    const removedEntryIds = [...new Set([
      ...disconnected.removedLeaderboardEntryIds,
      ...registered.removedLeaderboardEntryIds
    ].map((id) => id.trim()).filter(Boolean))].filter((id) => !upserts.has(id));
    return __spreadProps(__spreadValues({}, registered), {
      leaderboardUpserts: [...upserts.values()],
      removedLeaderboardEntryIds: removedEntryIds,
      leaderboardTotalDelta: Math.trunc(Number(disconnected.leaderboardTotalDelta) || 0) + Math.trunc(Number(registered.leaderboardTotalDelta) || 0)
    });
  }
  requiresRegistrationReplacement(status, registryBaseUrl, expectedRegistryScope) {
    const currentBaseUrl = status?.selection?.baseUrl?.trim() ?? "";
    if (!status || !currentBaseUrl) {
      return false;
    }
    const currentRegistryScope = (status.selection?.registryScope ?? status.selection?.registryIdentity?.registryScope ?? "").trim();
    const targetDiffers = !sameRegistryUrl(currentBaseUrl, registryBaseUrl) || Boolean(expectedRegistryScope && currentRegistryScope && expectedRegistryScope !== currentRegistryScope);
    if (!targetDiffers) {
      return false;
    }
    return status.enrollment !== null || status.lifecycle === "PENDING" || status.lifecycle === "REGISTERING" || status.lifecycle === "REGISTERED" || status.lifecycle === "ERROR";
  }
  async retry() {
    this.ensureContextBound();
    return await this.run("retry", () => this.service.retry());
  }
  async disconnect() {
    this.ensureContextBound();
    const result = await this.run("disconnect", () => this.service.disconnect());
    if (result) {
      this.inspectionRef.set(null);
      this.measurementSyncRef.set(null);
      this.leaderboard.applyMutation(result);
      return result.status;
    }
    return null;
  }
  async synchronizeMeasurements() {
    this.ensureContextBound();
    const result = await this.run("synchronize-measurements", () => this.service.synchronizeMeasurements());
    if (result) {
      this.measurementSyncRef.set(result);
    }
    return result;
  }
  measurementReportPage(query, signal2) {
    this.ensureContextBound();
    return this.service.measurementReportPage(query, signal2);
  }
  async requeueMeasurementReport(reportId) {
    this.ensureContextBound();
    const result = await this.run("requeue-measurement-report", () => this.service.requeueMeasurementReport(reportId));
    if (!result) {
      return null;
    }
    if (result.status === "PENDING") {
      this.measurementSyncRef.update((current) => {
        if (!current) {
          return current;
        }
        const blocked = Math.max(0, current.blocked - 1);
        return __spreadProps(__spreadValues({}, current), {
          state: blocked > 0 ? "BLOCKED" : "READY",
          code: blocked > 0 ? current.code : null,
          message: blocked > 0 ? current.message : "operator.measurements.delivery.requeued.pending",
          pending: current.pending + 1,
          blocked
        });
      });
    }
    this.noticeRef.set("operator.measurements.delivery.requeued");
    return result;
  }
  clearInspection() {
    this.inspectionRef.set(null);
  }
  setError(message) {
    this.errorRef.set(message.trim());
  }
  setNotice(message) {
    this.noticeRef.set(message.trim());
  }
  clearFeedback() {
    this.errorRef.set("");
    this.noticeRef.set("");
  }
  setRegistryBaseUrl(value) {
    const nextValue = `${value ?? ""}`;
    if (this.registryBaseUrlRef() === nextValue) {
      return;
    }
    this.registryBaseUrlRef.set(nextValue);
    this.inspectionRef.set(null);
    this.candidateInitialized = true;
  }
  setExpectedRegistryScope(value) {
    const nextValue = `${value ?? ""}`;
    if (this.expectedRegistryScopeRef() === nextValue) {
      return;
    }
    this.expectedRegistryScopeRef.set(nextValue);
    this.inspectionRef.set(null);
    this.candidateInitialized = true;
  }
  reset() {
    this.requestGeneration += 1;
    this.statusRef.set(null);
    this.inspectionRef.set(null);
    this.measurementSyncRef.set(null);
    this.busyActionRef.set(null);
    this.registryBaseUrlRef.set("");
    this.expectedRegistryScopeRef.set("");
    this.candidateInitialized = false;
    this.clearFeedback();
  }
  async run(action, request) {
    const requestGeneration = ++this.requestGeneration;
    this.busyActionRef.set(action);
    this.clearFeedback();
    try {
      const result = await request();
      if (requestGeneration !== this.requestGeneration) {
        return null;
      }
      const status = isMutationResult(result) ? result.status : isStatus(result) ? result : null;
      if (status) {
        this.statusRef.set(status);
        this.initializeCandidate(status);
      }
      return result;
    } catch (error) {
      if (requestGeneration === this.requestGeneration) {
        this.errorRef.set(messageFromError(error, defaultMessageForAction(action)));
      }
      return null;
    } finally {
      if (requestGeneration === this.requestGeneration) {
        this.busyActionRef.set(null);
      }
    }
  }
  initializeCandidate(status) {
    if (this.candidateInitialized) {
      return;
    }
    this.registryBaseUrlRef.set(status.selection?.baseUrl ?? status.candidateDefaults?.baseUrl ?? status.registryOptions?.[0]?.baseUrl ?? "");
    this.expectedRegistryScopeRef.set(status.selection?.registryScope ?? status.selection?.registryIdentity?.registryScope ?? status.candidateDefaults?.registryScope ?? "");
    this.candidateInitialized = true;
  }
  ensureContextBound() {
    this.bindContext(this.sessionService.currentSession());
  }
  bindContext(session) {
    const nextContextKey = operatorRegistryStoreContextKey(environment.operatorRegistryDataSource, session);
    if (nextContextKey === this.boundContextKey) {
      return;
    }
    this.boundContextKey = nextContextKey;
    this.reset();
  }
  currentContextKey() {
    return operatorRegistryStoreContextKey(environment.operatorRegistryDataSource, this.sessionService.currentSession());
  }
  static \u0275fac = function OperatorRegistryStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorRegistryStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OperatorRegistryStore, factory: _OperatorRegistryStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorRegistryStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function operatorRegistryStoreContextKey(dataSource, session) {
  const sessionIdentity = session?.kind === "demo" ? `demo:${session.userId.trim()}` : session?.kind === "firebase" ? `firebase:${session.profile.id.trim()}` : session?.kind === "operator-bootstrap" ? `operator-bootstrap:${session.email.trim()}` : "none";
  return `${dataSource}:${sessionIdentity}`;
}
function isStatus(value) {
  return Boolean(value && typeof value === "object" && "lifecycle" in value);
}
function isMutationResult(value) {
  return Boolean(value && typeof value === "object" && "status" in value && "removedLeaderboardEntryIds" in value);
}
function defaultMessageForAction(action) {
  switch (action) {
    case "load":
      return "operator.registration.error.load";
    case "inspect":
      return "operator.registration.error.inspect";
    case "confirm":
      return "operator.registration.error.confirm";
    case "register":
      return "operator.registration.error.register";
    case "retry":
      return "operator.registration.error.retry";
    case "disconnect":
      return "operator.registration.error.disconnect";
    case "synchronize-measurements":
      return "operator.measurements.error.synchronize";
    case "requeue-measurement-report":
      return "operator.measurements.error.requeue";
  }
}
function sameRegistryUrl(left, right) {
  try {
    return normalizeOperatorRegistryBaseUrl(left, false) === normalizeOperatorRegistryBaseUrl(right, false);
  } catch {
    return left.trim().replace(/\/+$/, "") === right.trim().replace(/\/+$/, "");
  }
}
function messageFromError(error, fallback) {
  if (error && typeof error === "object") {
    const source = error;
    const serverMessage = typeof source.error?.message === "string" ? source.error.message.trim() : typeof source.error?.detail === "string" ? source.error.detail.trim() : "";
    if (serverMessage) {
      return serverMessage;
    }
    if (source.name === "TimeoutError") {
      return "operator.registration.error.timeout";
    }
    if (typeof source.message === "string" && source.message.trim()) {
      return source.message.trim();
    }
  }
  return fallback;
}

// src/app/shared/ui/context/stores/operator-menu.store.ts
var OperatorMenuStore = class _OperatorMenuStore {
  activePopupRef = signal(null, ...ngDevMode ? [{ debugName: "activePopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedLeaderboardEntryRef = signal(null, ...ngDevMode ? [{ debugName: "selectedLeaderboardEntryRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activePopup = this.activePopupRef.asReadonly();
  selectedLeaderboardEntry = this.selectedLeaderboardEntryRef.asReadonly();
  open(kind) {
    this.activePopupRef.set(kind);
  }
  openLeaderboardDeployments(entry) {
    const groupId = entry.operatorGroupId?.trim() ?? "";
    if (entry.group !== "CLAIMED" || !groupId) {
      return;
    }
    this.selectedLeaderboardEntryRef.set(structuredClone(__spreadProps(__spreadValues({}, entry), {
      operatorGroupId: groupId
    })));
    this.activePopupRef.set("deployments");
  }
  closePopup() {
    this.activePopupRef.set(null);
  }
  static \u0275fac = function OperatorMenuStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorMenuStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OperatorMenuStore, factory: _OperatorMenuStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorMenuStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  OperatorLeaderboardStore,
  OperatorRegistryStore,
  OperatorMenuStore
};
//# sourceMappingURL=chunk-ZIP4R74W.js.map
