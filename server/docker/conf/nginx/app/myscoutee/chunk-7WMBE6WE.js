import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/base/services/bootstrap.service.ts
var BOOTSTRAP_PROCESS_STEPS = [
  { stage: "selector", percent: 0, label: "Preparing demo selector" },
  { stage: "chats", percent: 11, label: "Loading chats" },
  { stage: "events", percent: 22, label: "Loading events" },
  { stage: "users", percent: 34, label: "Preparing demo users" },
  { stage: "contacts", percent: 40, label: "Preparing contacts" },
  { stage: "profileExperiences", percent: 43, label: "Preparing profile experiences" },
  { stage: "feedback", percent: 46, label: "Preparing event feedback" },
  { stage: "ratings", percent: 52, label: "Loading ratings" },
  { stage: "assets", percent: 64, label: "Preparing owned assets" },
  { stage: "activityMembers", percent: 82, label: "Preparing activity members" },
  { stage: "activityResources", percent: 94, label: "Preparing activity resources" },
  { stage: "helpCenter", percent: 95, label: "Preparing help content" },
  { stage: "ideaPosts", percent: 96, label: "Preparing article content" },
  { stage: "adminUsers", percent: 97, label: "Preparing admin users" },
  { stage: "operatorUsers", percent: 97, label: "Preparing demo users" },
  { stage: "adminWorkspaceData", percent: 97, label: "Preparing admin workspace data" },
  { stage: "adminHelpLinks", percent: 97, label: "Preparing admin help links" },
  { stage: "affinityGraph", percent: 97, label: "Preparing admin graph" },
  { stage: "indexedDb", percent: 98, label: "Syncing demo IndexedDB" },
  { stage: "ready", percent: 100, label: "Demo data ready" }
];
var SESSION_PROCESS_STEPS = [
  { stage: "session", percent: 0, label: "Preparing demo session" },
  { stage: "sessionChats", percent: 38, label: "Preparing chat threads" },
  { stage: "sessionFeedback", percent: 62, label: "Preparing event feedback" },
  { stage: "sessionIndexedDb", percent: 84, label: "Syncing demo IndexedDB" },
  { stage: "sessionReady", percent: 100, label: "Demo session ready" }
];
var PROCESS_STEP_BY_STAGE = new Map([...BOOTSTRAP_PROCESS_STEPS, ...SESSION_PROCESS_STEPS].map((step) => [step.stage, step]));
function bootstrapProcessStep(stage) {
  return PROCESS_STEP_BY_STAGE.get(stage) ?? BOOTSTRAP_PROCESS_STEPS[0];
}
var BootstrapProcessService = class _BootstrapProcessService {
  normalize(state, fallbackLabel = "Preparing data") {
    return {
      percent: Math.max(0, Math.min(100, Math.round(state.percent))),
      label: state.label.trim() || fallbackLabel,
      stage: state.stage
    };
  }
  async runStep(step, onProgress, work) {
    onProgress?.(this.normalize(step));
    await this.waitForUiYield();
    const result = work ? await work() : void 0;
    await this.waitForUiYield();
    return result;
  }
  waitForUiYield() {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => resolve());
        return;
      }
      setTimeout(resolve, 0);
    });
  }
  static \u0275fac = function BootstrapProcessService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BootstrapProcessService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BootstrapProcessService, factory: _BootstrapProcessService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BootstrapProcessService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  bootstrapProcessStep,
  BootstrapProcessService
};
//# sourceMappingURL=chunk-7WMBE6WE.js.map
