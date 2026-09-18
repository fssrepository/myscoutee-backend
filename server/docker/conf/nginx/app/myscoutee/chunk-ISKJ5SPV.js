import {
  signal
} from "./chunk-FMXFYYCS.js";

// src/app/shared/core/common/backend-connectivity.ts
var unavailable = signal(false, ...ngDevMode ? [{ debugName: "unavailable" }] : (
  /* istanbul ignore next */
  []
));
var backendUnavailable = unavailable.asReadonly();
function reportBackendStatus(status) {
  unavailable.set([0, 502, 503, 504].includes(status));
}

export {
  backendUnavailable,
  reportBackendStatus
};
//# sourceMappingURL=chunk-ISKJ5SPV.js.map
