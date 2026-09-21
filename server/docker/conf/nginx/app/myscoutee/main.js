import {
  demoFailoverLocalUser,
  demoFailoverSeedWarmupNeeded,
  prepareDemoFailover,
  startDemoFailover
} from "./chunk-DYS6H2DW.js";
import "./chunk-4PHST73L.js";
import {
  bootstrapApplication
} from "./chunk-JFEZ3BSQ.js";
import "./chunk-DVMAPFVK.js";
import "./chunk-Y6O6FOP6.js";
import "./chunk-NVTXJNEV.js";
import {
  Injector,
  inject,
  provideAppInitializer
} from "./chunk-FDDWEAC7.js";

// src/main.ts
var BOOTSTRAPPED_CLASS = "app-bootstrapped";
var BOOTSTRAP_RESUME_RELOAD_KEY = "myscoutee.bootstrap.resume-reload.v1";
var DEPLOYMENT_RECOVERY_KEY = "myscoutee.deployment-recovery.v1";
var BOOTSTRAP_RESUME_GRACE_MS = 12e3;
var bootstrapStartedAt = Date.now();
var bootstrapSettled = false;
function silenceBrowserConsoleLogs() {
  const browserConsole = globalThis.console;
  const logMethod = ["lo", "g"].join("");
  if (!browserConsole || typeof browserConsole[logMethod] !== "function") {
    return;
  }
  browserConsole[logMethod] = () => void 0;
}
function bindBootstrapResumeRecovery() {
  window.addEventListener("pageshow", recoverBootstrapOnResume);
  window.addEventListener("focus", recoverBootstrapOnResume);
  document.addEventListener("visibilitychange", recoverBootstrapOnResume);
}
function unbindBootstrapResumeRecovery() {
  window.removeEventListener("pageshow", recoverBootstrapOnResume);
  window.removeEventListener("focus", recoverBootstrapOnResume);
  document.removeEventListener("visibilitychange", recoverBootstrapOnResume);
}
function recoverBootstrapOnResume() {
  if (bootstrapSettled || document.visibilityState === "hidden") {
    return;
  }
  if (Date.now() - bootstrapStartedAt < BOOTSTRAP_RESUME_GRACE_MS) {
    return;
  }
  const attemptKey = `${location.origin}${location.pathname}${location.search}`;
  try {
    if (sessionStorage.getItem(BOOTSTRAP_RESUME_RELOAD_KEY) === attemptKey) {
      return;
    }
    sessionStorage.setItem(BOOTSTRAP_RESUME_RELOAD_KEY, attemptKey);
  } catch {
    return;
  }
  window.location.reload();
}
function clearBootstrapResumeReloadGuard() {
  try {
    sessionStorage.removeItem(BOOTSTRAP_RESUME_RELOAD_KEY);
    sessionStorage.removeItem(DEPLOYMENT_RECOVERY_KEY);
  } catch {
  }
}
function markBootstrapped() {
  bootstrapSettled = true;
  unbindBootstrapResumeRecovery();
  clearBootstrapResumeReloadGuard();
  document.documentElement.classList.add(BOOTSTRAPPED_CLASS);
}
function markBootstrapFailed(err) {
  bootstrapSettled = true;
  unbindBootstrapResumeRecovery();
  console.error(err);
  window.__myscouteeWarmup?.showFailure?.("Unable to start", "The app could not finish starting. Please check the network and retry.");
}
silenceBrowserConsoleLogs();
bindBootstrapResumeRecovery();
prepareDemoFailover().then(async () => {
  const [{ App }, { appConfig }] = await Promise.all([import("./app-QWQGGFDY.js"), import("./app.config-V4YMD7RC.js")]);
  const localUserId = demoFailoverLocalUser();
  if (localUserId) {
    appConfig.providers.push(provideAppInitializer(() => {
      const injector = inject(Injector);
      return import("./demo-bootstrap.service-EA7A5IK5.js").then(async (module) => {
        const seed = injector.get(module.SeedDemoBootstrapService);
        await seed.ensureDemoSelectorReady("member");
        await seed.ensureUserReady(localUserId, "member");
      });
    }));
  }
  const app = await bootstrapApplication(App, appConfig);
  if (demoFailoverSeedWarmupNeeded()) {
    void import("./demo-bootstrap.service-EA7A5IK5.js").catch(() => void 0);
  }
  return app;
}).then(() => {
  markBootstrapped();
  startDemoFailover();
}).catch((err) => markBootstrapFailed(err));
//# sourceMappingURL=main.js.map
