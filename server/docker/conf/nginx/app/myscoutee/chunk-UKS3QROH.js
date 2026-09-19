import {
  Injectable,
  environment,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/base/config.ts
var APP_SETUP_CONFIG = {
  locationRequestTimeoutMs: 1e4
};
var ROUTE_CONFIG = {
  defaultDemoDelayMs: 1500,
  defaultRequestTimeoutMs: 3e3,
  defaultIntervalMs: 0,
  entries: [
    {
      routePrefix: "/payment-methods",
      demoDelayMs: 1500,
      requestTimeoutMs: 3e3
    },
    {
      routePrefix: "/auth/demo-users",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/onboarding-draft-autosave",
      intervalMs: 3e4
    },
    {
      routePrefix: "/auth/me/feedback",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/experiences",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/preferences",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/report-user",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/realtime/long-poll",
      demoDelayMs: 0,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/local/users/realtime/long-poll",
      demoDelayMs: 0,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/auth/me/logout",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/delete",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/help",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/help/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/privacy",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/privacy/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/privacy/consents",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/terms",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/terms/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/explanation",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/explanation/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/landing/content",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/landing/articles",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/help",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/help/revisions",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/privacy",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/privacy/revisions",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/explanation",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/explanation/revisions",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/ideas",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/blocked-users",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/warn",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/block",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/unblock",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/feedback",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/notifications",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/notifications/save",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/notifications/run",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params/save",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params/history",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params/revert",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/stats",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/affinity-graph",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/monitoring",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/operator/registry",
      demoDelayMs: 1500,
      requestTimeoutMs: 3e4
    },
    {
      routePrefix: "/operator",
      demoDelayMs: 1500,
      requestTimeoutMs: 3e4
    },
    {
      routePrefix: "/game-cards/query",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/chats",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/explore",
      demoDelayMs: 1500,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/activities/events/checkout/authorize",
      demoDelayMs: 1500,
      requestTimeoutMs: 12e4
    },
    {
      routePrefix: "/activities/events/checkout/pay",
      demoDelayMs: 1500,
      requestTimeoutMs: 12e4
    },
    {
      routePrefix: "/activities/events/checkout",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/feedback",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/subevent-resources",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/members",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/invite-candidates",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/rates",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/notifications",
      demoDelayMs: 1500,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/assets",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/assets/availability",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/assets/tickets",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/media/images/import",
      demoDelayMs: 1500,
      requestTimeoutMs: 15e3
    },
    {
      routePrefix: "/media/images",
      demoDelayMs: 1500,
      requestTimeoutMs: 15e3
    },
    {
      routePrefix: "/media/audio",
      demoDelayMs: 1500,
      requestTimeoutMs: 2e4
    },
    {
      routePrefix: "/navigator/contacts",
      demoDelayMs: 1500
    }
  ]
};
function resolveRouteConfigEntry(url) {
  const normalizedUrl = normalizeRouteUrl(url);
  let bestMatchLength = -1;
  let selectedEntry = null;
  for (const entry of ROUTE_CONFIG.entries) {
    const normalizedPrefix = normalizeRouteUrl(entry.routePrefix);
    if (!isRoutePrefixMatch(normalizedUrl, normalizedPrefix)) {
      continue;
    }
    if (normalizedPrefix.length <= bestMatchLength) {
      continue;
    }
    bestMatchLength = normalizedPrefix.length;
    selectedEntry = entry;
  }
  return selectedEntry;
}
function resolveRouteConfig(url) {
  const normalizedUrl = normalizeRouteUrl(url);
  const entry = resolveRouteConfigEntry(normalizedUrl);
  const configuredMode = normalizeRouteMode(entry?.mode ?? null);
  return {
    routePrefix: entry?.routePrefix ?? normalizedUrl,
    demoDelayMs: normalizeDelayMs(entry?.demoDelayMs ?? ROUTE_CONFIG.defaultDemoDelayMs),
    requestTimeoutMs: normalizeDelayMs(entry?.requestTimeoutMs ?? ROUTE_CONFIG.defaultRequestTimeoutMs),
    intervalMs: normalizeDelayMs(entry?.intervalMs ?? ROUTE_CONFIG.defaultIntervalMs),
    demoIntervalMs: normalizeDelayMs(entry?.demoIntervalMs ?? ROUTE_CONFIG.defaultIntervalMs),
    mode: configuredMode,
    http: entry?.http === true || configuredMode === "http"
  };
}
function normalizeRouteUrl(url) {
  const [pathOnly] = url.split("?");
  const [withoutHash] = (pathOnly || "").split("#");
  const trimmed = withoutHash.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") : `/${trimmed}`.replace(/\/+$/, "");
}
function isRoutePrefixMatch(url, prefix) {
  if (prefix === "/") {
    return true;
  }
  return url === prefix || url.startsWith(`${prefix}/`);
}
function normalizeDelayMs(value) {
  return Math.max(0, Math.trunc(value));
}
function normalizeRouteMode(value) {
  return value === "local" || value === "http" ? value : null;
}

// src/app/shared/core/base/services/route-delay.service.ts
function resolveCurrentRouteRequestTimeoutMs(route, fallbackTimeoutMs = 3e3) {
  const routeConfig = resolveRouteConfig(route);
  if (routeConfig.requestTimeoutMs > 0) {
    return routeConfig.requestTimeoutMs;
  }
  return normalizeDelayMs2(fallbackTimeoutMs);
}
var RouteDelayService = class _RouteDelayService {
  resolveDelayMs(route, fallbackDelayMs = 0) {
    const routeConfig = resolveRouteConfig(route);
    if (routeConfig.http || environment.activitiesDataSource === "http") {
      return 0;
    }
    return routeConfig.demoDelayMs > 0 ? routeConfig.demoDelayMs : normalizeDelayMs2(fallbackDelayMs);
  }
  resolveRequestTimeoutMs(route, fallbackTimeoutMs = 3e3) {
    return resolveCurrentRouteRequestTimeoutMs(route, fallbackTimeoutMs);
  }
  resolveIntervalMs(route, fallbackIntervalMs = 0) {
    const routeConfig = resolveRouteConfig(route);
    const demoRouteMode = environment.activitiesDataSource !== "http" && !routeConfig.http;
    const configuredIntervalMs = demoRouteMode && routeConfig.demoIntervalMs > 0 ? routeConfig.demoIntervalMs : routeConfig.intervalMs;
    if (configuredIntervalMs > 0) {
      return configuredIntervalMs;
    }
    return normalizeDelayMs2(fallbackIntervalMs);
  }
  withRequestTimeout(route, task, timeoutMessage = "Request timed out.", fallbackTimeoutMs = 3e3) {
    return new Promise((resolve, reject) => {
      let finished = false;
      let timeoutId = null;
      const finish = (callback) => {
        if (finished) {
          return;
        }
        finished = true;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        callback();
      };
      timeoutId = setTimeout(() => finish(() => reject(new Error(timeoutMessage))), this.resolveRequestTimeoutMs(route, fallbackTimeoutMs));
      task.then((value) => finish(() => resolve(value))).catch((error) => finish(() => reject(error)));
    });
  }
  async waitForRouteDelay(route, signal, abortMessage = "Request aborted.", fallbackDelayMs = 0) {
    const delayMs = this.resolveDelayMs(route, fallbackDelayMs);
    if (delayMs <= 0) {
      return;
    }
    await this.waitForDelay(delayMs, signal, abortMessage);
  }
  waitForDelay(delayMs, signal, abortMessage = "Request aborted.") {
    const normalizedDelayMs = this.normalizeDelayMs(delayMs);
    if (normalizedDelayMs <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(this.createAbortError(abortMessage));
        return;
      }
      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, normalizedDelayMs);
      const onAbort = () => {
        cleanup();
        reject(this.createAbortError(abortMessage));
      };
      const cleanup = () => {
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
      };
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }
  createAbortError(message = "Request aborted.") {
    const error = new Error(message);
    error.name = "AbortError";
    return error;
  }
  normalizeDelayMs(value) {
    return normalizeDelayMs2(value);
  }
  static \u0275fac = function RouteDelayService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouteDelayService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RouteDelayService, factory: _RouteDelayService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouteDelayService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function normalizeDelayMs2(value) {
  return Math.max(0, Math.trunc(Number(value) || 0));
}

export {
  APP_SETUP_CONFIG,
  ROUTE_CONFIG,
  resolveRouteConfig,
  RouteDelayService
};
//# sourceMappingURL=chunk-UKS3QROH.js.map
