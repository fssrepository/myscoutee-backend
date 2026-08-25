import {
  HttpClient
} from "./chunk-D6ZHKNYF.js";
import {
  Injectable,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/http/services/operator-bootstrap-auth.service.ts
var OPERATOR_BOOTSTRAP_AUTH_ROUTE = "/auth/operator-bootstrap";
var HttpOperatorBootstrapAuthService = class _HttpOperatorBootstrapAuthService {
  http = inject(HttpClient);
  apiBaseUrl = (environment.apiBaseUrl ?? "/api").replace(/\/+$/, "");
  async signIn(request) {
    const response = await firstValueFrom(this.http.post(`${this.apiBaseUrl}${OPERATOR_BOOTSTRAP_AUTH_ROUTE}`, request));
    const accessToken = `${response?.accessToken ?? ""}`.trim();
    const email = `${response?.email ?? ""}`.trim();
    const expiresAt = `${response?.expiresAt ?? ""}`.trim();
    if (response?.tokenType !== "OperatorBootstrap" || !accessToken || !email || !Number.isFinite(Date.parse(expiresAt))) {
      throw new Error("operator.bootstrap.auth.response.invalid");
    }
    return {
      tokenType: "OperatorBootstrap",
      accessToken,
      email,
      expiresAt
    };
  }
  static \u0275fac = function HttpOperatorBootstrapAuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HttpOperatorBootstrapAuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpOperatorBootstrapAuthService, factory: _HttpOperatorBootstrapAuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HttpOperatorBootstrapAuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  HttpOperatorBootstrapAuthService
};
//# sourceMappingURL=chunk-4FWVIYNI.js.map
