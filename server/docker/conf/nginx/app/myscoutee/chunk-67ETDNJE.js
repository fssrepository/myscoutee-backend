import {
  signal
} from "./chunk-EV3I3YNV.js";

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
//# sourceMappingURL=chunk-67ETDNJE.js.map
