import {
  RouteDelayService
} from "./chunk-UKS3QROH.js";
import {
  inject
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/local/source/services/route-delay.service.ts
var LocalRouteDelayService = class {
  routeDelayService = inject(RouteDelayService);
  async waitForRouteDelay(route, signal, abortMessage = "Request aborted.") {
    await this.routeDelayService.waitForRouteDelay(route, signal, abortMessage);
  }
  waitForDelay(delayMs, signal, abortMessage = "Request aborted.") {
    return this.routeDelayService.waitForDelay(delayMs, signal, abortMessage);
  }
  createAbortError(message = "Request aborted.") {
    return this.routeDelayService.createAbortError(message);
  }
};

export {
  LocalRouteDelayService
};
//# sourceMappingURL=chunk-UR2UG3BQ.js.map
