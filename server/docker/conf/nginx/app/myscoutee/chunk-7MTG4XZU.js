import {
  LocalOperatorRegistryRepository
} from "./chunk-J7IJFFQ2.js";
import {
  DEFAULT_DEPLOYMENT_CONFIGURATION,
  LocalOperatorRegistryMapper,
  SeedOperatorRegistryBuilder
} from "./chunk-XQACYBVS.js";
import {
  RouteDelayService,
  resolveRouteConfig
} from "./chunk-KLUOB5SD.js";
import {
  SessionService
} from "./chunk-2ENBQWLU.js";
import {
  HttpClient
} from "./chunk-D6ZHKNYF.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  environment,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/base/services/base-route-mode.service.ts
function resolveDataSourceRouteMode(dataSource) {
  return dataSource === "http" ? "http" : "local";
}
var BaseRouteModeService = class {
  sessionService = inject(SessionService);
  isLocalRouteEnabled(route) {
    return this.resolveRouteMode(route) === "local";
  }
  resolveRouteService(route, localService, httpService, config = null) {
    const mode = this.resolveRouteMode(route, config?.mode ?? null);
    return mode === "local" ? localService : httpService;
  }
  resolveRouteMode(route, requestedMode = null) {
    if (requestedMode) {
      return requestedMode;
    }
    const routeConfig = resolveRouteConfig(route);
    if (routeConfig.mode) {
      return routeConfig.mode;
    }
    if (routeConfig.http) {
      return "http";
    }
    return resolveDataSourceRouteMode(environment.activitiesDataSource);
  }
};

// src/app/shared/core/http/services/deployment-configuration.service.ts
var DEPLOYMENT_CONFIGURATION_ROUTE = "/deployment/configuration";
var HttpDeploymentConfigurationService = class _HttpDeploymentConfigurationService {
  http = inject(HttpClient);
  routeDelay = inject(RouteDelayService);
  apiBaseUrl = (environment.apiBaseUrl ?? "/api").replace(/\/+$/, "");
  async loadBranding() {
    const response = await this.routeDelay.withRequestTimeout(DEPLOYMENT_CONFIGURATION_ROUTE, this.http.get(`${this.apiBaseUrl}${DEPLOYMENT_CONFIGURATION_ROUTE}`).toPromise(), "deployment.configuration.request.timeout");
    if (!response) {
      throw new Error("deployment.configuration.response.unavailable");
    }
    return response;
  }
  static \u0275fac = function HttpDeploymentConfigurationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HttpDeploymentConfigurationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpDeploymentConfigurationService, factory: _HttpDeploymentConfigurationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HttpDeploymentConfigurationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/source/services/deployment-configuration.service.ts
var DEPLOYMENT_CONFIGURATION_ROUTE2 = "/deployment/configuration";
var LocalDeploymentConfigurationService = class _LocalDeploymentConfigurationService {
  repository = inject(LocalOperatorRegistryRepository);
  routeDelay = inject(RouteDelayService);
  async loadBranding() {
    await this.routeDelay.waitForRouteDelay(DEPLOYMENT_CONFIGURATION_ROUTE2);
    const record = await this.repository.read();
    const normalizedRecord = record ? LocalOperatorRegistryMapper.toSeedRecord({ registryRecord: record }, SeedOperatorRegistryBuilder.buildInitialRecord()) : null;
    if (record && normalizedRecord && LocalOperatorRegistryMapper.seedRecordChanged(record, normalizedRecord)) {
      await this.repository.write(normalizedRecord);
    }
    return structuredClone(normalizedRecord?.configuration ? __spreadProps(__spreadValues({}, normalizedRecord.configuration.branding), {
      socialLinks: normalizedRecord.configuration.socialLinks,
      privacyContact: normalizedRecord.configuration.privacyContact
    }) : DEFAULT_DEPLOYMENT_CONFIGURATION);
  }
  static \u0275fac = function LocalDeploymentConfigurationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocalDeploymentConfigurationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LocalDeploymentConfigurationService, factory: _LocalDeploymentConfigurationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalDeploymentConfigurationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  HttpDeploymentConfigurationService,
  LocalDeploymentConfigurationService,
  BaseRouteModeService
};
//# sourceMappingURL=chunk-7MTG4XZU.js.map
