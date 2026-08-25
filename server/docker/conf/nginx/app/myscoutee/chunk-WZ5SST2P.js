import {
  HttpBackend,
  HttpClient,
  HttpHeaders
} from "./chunk-D6ZHKNYF.js";
import {
  Injectable,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/http/services/firebase-session-registry.service.ts
var FirebaseSessionRegistryService = class _FirebaseSessionRegistryService {
  static SESSION_ID_HEADER = "X-App-Session-Id";
  http = new HttpClient(inject(HttpBackend));
  apiBaseUrl = environment.apiBaseUrl ?? "/api";
  registerLogin(sessionId, token, request) {
    return firstValueFrom(this.http.post(`${this.apiBaseUrl}/auth/session/login`, request, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        [_FirebaseSessionRegistryService.SESSION_ID_HEADER]: sessionId
      })
    }));
  }
  registerDemoLogin(sessionId, userId, request) {
    return firstValueFrom(this.http.post(`${this.apiBaseUrl}/auth/session/login`, request, {
      headers: new HttpHeaders({
        [_FirebaseSessionRegistryService.SESSION_ID_HEADER]: sessionId,
        "X-App-Session-Kind": "demo",
        "X-Demo-User-Id": userId
      })
    }));
  }
  revokeDemoSession(sessionId, userId) {
    return firstValueFrom(this.http.post(`${this.apiBaseUrl}/auth/me/logout`, { userId }, {
      headers: new HttpHeaders({
        [_FirebaseSessionRegistryService.SESSION_ID_HEADER]: sessionId,
        "X-App-Session-Kind": "demo",
        "X-Demo-User-Id": userId
      })
    }));
  }
  revokeFirebaseSession(sessionId, userId, token) {
    return firstValueFrom(this.http.post(`${this.apiBaseUrl}/auth/me/logout`, { userId }, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        [_FirebaseSessionRegistryService.SESSION_ID_HEADER]: sessionId
      })
    }));
  }
  static \u0275fac = function FirebaseSessionRegistryService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FirebaseSessionRegistryService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FirebaseSessionRegistryService, factory: _FirebaseSessionRegistryService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FirebaseSessionRegistryService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  FirebaseSessionRegistryService
};
//# sourceMappingURL=chunk-WZ5SST2P.js.map
