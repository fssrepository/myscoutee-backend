import {
  reportBackendStatus
} from "./chunk-ISKJ5SPV.js";
import {
  environment
} from "./chunk-FMXFYYCS.js";

// src/app/shared/core/common/demo-failover.ts
var FAILOVER_KEY = "myscoutee.demo.failover";
var HTTP_SESSION = "myscoutee.http.session.v1";
var LOCAL_SESSION = "myscoutee.demo.session.v1";
var LOCAL_ACTOR = "myscoutee.demo.demo.active-user.v1";
var LOCAL_SESSION_BEFORE = `${FAILOVER_KEY}.local-session-before`;
var PAIR_KEY = `${FAILOVER_KEY}.pair`;
var API_BASE = environment.apiBaseUrl ?? "/api";
var enabled = false;
var local = false;
var checking = false;
var writes = 0;
var idsPromise = null;
function readSession(key) {
  try {
    const session = JSON.parse(localStorage.getItem(key) || "null");
    return session?.kind === "demo" && !session.supportContext && typeof session.userId === "string" ? session : null;
  } catch {
    return null;
  }
}
function demoSeedUserIds() {
  return idsPromise ??= Promise.all(Array.from({ length: 50 }, async (_, index) => {
    const id = `u${index + 1}`;
    const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(`users:${id}`));
    const httpId = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 24);
    return [httpId, id];
  })).then((entries) => new Map(entries));
}
function eligibleSession() {
  return readSession(HTTP_SESSION);
}
async function backendReachable() {
  try {
    const url = new URL(`${API_BASE.replace(/\/$/, "")}/deployment/configuration`, document.baseURI);
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(2500) });
    const reachable = ![502, 503, 504].includes(response.status);
    reportBackendStatus(response.status);
    return reachable;
  } catch {
    reportBackendStatus(0);
    return false;
  }
}
function safeToSwitch() {
  const path = location.pathname.replace(/\/$/, "");
  return (path === "/game" || path === "/entry" || path === "") && document.visibilityState === "visible" && writes === 0 && !document.querySelector(".ui-popup") && !document.activeElement?.matches('input,textarea,[contenteditable="true"]');
}
function restoreLocalSession() {
  const before = localStorage.getItem(LOCAL_SESSION_BEFORE);
  if (before === null)
    return;
  const saved = JSON.parse(before);
  for (const [key, value] of [[LOCAL_SESSION, saved.session], [LOCAL_ACTOR, saved.actor]]) {
    if (value === null)
      localStorage.removeItem(key);
    else
      localStorage.setItem(key, value);
  }
  localStorage.removeItem(LOCAL_SESSION_BEFORE);
  localStorage.removeItem(PAIR_KEY);
}
async function prepareDemoFailover() {
  if (environment.activitiesDataSource !== "http")
    return;
  enabled = true;
  const session = eligibleSession();
  const localId = session && (await demoSeedUserIds()).get(session.userId);
  if (!session || !localId) {
    restoreLocalSession();
    return;
  }
  if (await backendReachable()) {
    restoreLocalSession();
    return;
  }
  let previousPair = localStorage.getItem(PAIR_KEY);
  if (previousPair && JSON.parse(previousPair).http !== session.userId) {
    restoreLocalSession();
    previousPair = null;
  }
  const pair = { http: session.userId, local: localId };
  if (previousPair && readSession(LOCAL_SESSION)?.userId !== localId) {
    enabled = false;
    localStorage.removeItem(HTTP_SESSION);
    restoreLocalSession();
    return;
  }
  if (!localStorage.getItem(LOCAL_SESSION_BEFORE)) {
    localStorage.setItem(LOCAL_SESSION_BEFORE, JSON.stringify({
      session: localStorage.getItem(LOCAL_SESSION),
      actor: localStorage.getItem(LOCAL_ACTOR)
    }));
  }
  localStorage.setItem(PAIR_KEY, JSON.stringify(pair));
  if (!previousPair) {
    localStorage.setItem(LOCAL_SESSION, JSON.stringify({
      kind: "demo",
      userId: localId,
      sessionId: `session:${crypto.randomUUID()}`
    }));
    localStorage.setItem(LOCAL_ACTOR, localId);
  }
  local = true;
  Object.assign(environment, {
    activitiesDataSource: "local",
    operatorRegistryDataSource: "local",
    firebaseLoginEnabled: false,
    firebaseMessagingEnabled: false,
    paymentIntegrationEnabled: false,
    paymentSimulatorConfigUrl: null
  });
}
function demoFailoverEnabled() {
  return enabled;
}
function demoFailoverLocalUser() {
  return enabled && local ? readSession(LOCAL_SESSION)?.userId ?? null : null;
}
function trackDemoWrite(start) {
  if (enabled)
    writes = Math.max(0, writes + (start ? 1 : -1));
}
async function checkDemoFailover() {
  if (!enabled || checking || document.visibilityState !== "visible")
    return;
  checking = true;
  try {
    const session = eligibleSession();
    if (!session || !(await demoSeedUserIds()).has(session.userId))
      return;
    if (local) {
      const pair = JSON.parse(localStorage.getItem(PAIR_KEY) || "null");
      if (pair?.http !== session.userId || readSession(LOCAL_SESSION)?.userId !== pair.local)
        return;
    }
    const reachable = await backendReachable();
    if (!local && !reachable && safeToSwitch() && eligibleSession()?.userId === session.userId) {
      location.reload();
    }
  } finally {
    checking = false;
  }
}
function startDemoFailover() {
  if (!enabled)
    return;
  window.addEventListener("online", () => void checkDemoFailover());
  window.addEventListener("offline", () => void checkDemoFailover());
  window.addEventListener("focus", () => void checkDemoFailover());
  document.addEventListener("visibilitychange", () => void checkDemoFailover());
  window.setInterval(() => void checkDemoFailover(), 1e4);
}

export {
  prepareDemoFailover,
  demoFailoverEnabled,
  demoFailoverLocalUser,
  trackDemoWrite,
  startDemoFailover
};
//# sourceMappingURL=chunk-HZBHYHDP.js.map
