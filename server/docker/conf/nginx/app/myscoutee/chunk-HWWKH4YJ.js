import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  Injectable,
  Injector,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/base/services/payment-authorization.service.ts
var PaymentAuthorizationService = class _PaymentAuthorizationService {
  static POLL_INTERVAL_MS = 1500;
  // The provider owns the three-minute authorization deadline. This small
  // grace period lets its terminal callback and result animation arrive
  // before the MyScoutee safety poll gives up.
  static POLL_TIMEOUT_MS = 3 * 60 * 1e3 + 5e3;
  injector = inject(Injector);
  i18n = inject(I18nService);
  waitingSurfaceRef = signal(null, ...ngDevMode ? [{ debugName: "waitingSurfaceRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activeAttempt = null;
  waitingSurface = this.waitingSurfaceRef.asReadonly();
  openProviderWindow() {
    if (!environment.paymentIntegrationEnabled || environment.paymentSimulatorConfigUrl || typeof window === "undefined") {
      return null;
    }
    const popup = window.open("about:blank", "myscoutee-payment-provider", "popup=yes,width=520,height=760,resizable=yes,scrollbars=yes");
    if (popup) {
      popup.opener = null;
    }
    return popup;
  }
  async completeCustomerAction(continuation, userId, sourceId, providerWindow = null) {
    const status = this.normalizedStatus(continuation?.status);
    if (this.isSuccessfulStatus(status)) {
      return null;
    }
    const paymentUrl = this.normalizedPaymentUrl(continuation?.paymentUrl);
    if (!continuation?.id?.trim() || !paymentUrl) {
      this.closeProviderWindow(providerWindow);
      throw new Error(this.i18n.translate("payment.authorization.error.start"));
    }
    const simulatorSurface = Boolean(environment.paymentSimulatorConfigUrl);
    if (!simulatorSurface && (!providerWindow || providerWindow.closed)) {
      throw new Error(this.i18n.translate("payment.authorization.error.popup"));
    }
    const attempt = {
      id: continuation.id.trim(),
      cancelled: false
    };
    if (this.activeAttempt) {
      this.activeAttempt.cancelled = true;
    }
    this.activeAttempt = attempt;
    if (simulatorSurface) {
      this.waitingSurfaceRef.set({ id: attempt.id, url: paymentUrl });
    } else {
      providerWindow.location.replace(paymentUrl);
      providerWindow.focus();
    }
    try {
      return await this.waitForAuthorization(userId.trim(), sourceId.trim(), attempt);
    } finally {
      if (this.activeAttempt === attempt) {
        this.activeAttempt = null;
        this.waitingSurfaceRef.set(null);
      }
      this.closeProviderWindow(providerWindow);
    }
  }
  closeProviderWindow(providerWindow) {
    if (providerWindow && !providerWindow.closed) {
      providerWindow.close();
    }
  }
  closeWaitingSurface() {
    if (this.activeAttempt) {
      this.activeAttempt.cancelled = true;
    }
    this.waitingSurfaceRef.set(null);
  }
  receiveProviderStatus(id, status) {
    const waiting = this.waitingSurfaceRef();
    if (!waiting || waiting.id !== id.trim()) {
      return;
    }
    const normalizedStatus = this.normalizedStatus(status);
    if (this.isSuccessfulStatus(normalizedStatus) || this.isTerminalFailureStatus(normalizedStatus)) {
      this.waitingSurfaceRef.set(null);
    }
  }
  async waitForAuthorization(userId, sourceId, attempt) {
    const { EventsService } = await import("./events.service-POMWWDC6.js");
    const events = this.injector.get(EventsService);
    const deadline = Date.now() + _PaymentAuthorizationService.POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (attempt.cancelled) {
        throw new Error(this.i18n.translate("payment.authorization.error.cancelled"));
      }
      const audit = await events.loadCheckoutPaymentAudit(userId, sourceId, attempt.id);
      const status = this.normalizedStatus(audit?.status);
      if (audit && this.isSuccessfulStatus(status)) {
        await this.waitForSimulatorResult(attempt);
        return audit;
      }
      if (audit && this.isTerminalFailureStatus(status)) {
        await this.waitForSimulatorResult(attempt);
        throw new Error(this.i18n.translateParams("payment.authorization.error.failed", { status }));
      }
      await this.delay(_PaymentAuthorizationService.POLL_INTERVAL_MS);
    }
    throw new Error(this.i18n.translate("payment.authorization.error.timeout"));
  }
  async waitForSimulatorResult(attempt) {
    if (this.waitingSurfaceRef()?.id !== attempt.id) {
      return;
    }
    const deadline = Date.now() + 3e3;
    while (Date.now() < deadline && this.waitingSurfaceRef()?.id === attempt.id) {
      if (attempt.cancelled) {
        throw new Error(this.i18n.translate("payment.authorization.error.cancelled"));
      }
      await this.delay(50);
    }
  }
  isSuccessfulStatus(status) {
    return status === "approved" || status === "authorized" || status === "captured";
  }
  isTerminalFailureStatus(status) {
    return status === "cancelled" || status === "declined" || status === "expired" || status === "failed" || status === "released";
  }
  normalizedStatus(value) {
    return `${value ?? ""}`.trim().toLowerCase();
  }
  normalizedPaymentUrl(value) {
    const candidate = `${value ?? ""}`.trim();
    if (!candidate) {
      return null;
    }
    try {
      const baseUrl = typeof window === "undefined" ? "http://localhost/" : window.location.href;
      const url = new URL(candidate, baseUrl);
      return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
    } catch {
      return null;
    }
  }
  delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
  static \u0275fac = function PaymentAuthorizationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentAuthorizationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PaymentAuthorizationService, factory: _PaymentAuthorizationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentAuthorizationService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  PaymentAuthorizationService
};
//# sourceMappingURL=chunk-HWWKH4YJ.js.map
