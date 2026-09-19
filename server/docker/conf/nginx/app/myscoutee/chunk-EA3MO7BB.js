import {
  PopupPresenceStore
} from "./chunk-ADBOYRJ7.js";
import {
  Injectable,
  effect,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/scheduler/ui-poll-coordinator.ts
var UiPollCoordinator = class _UiPollCoordinator {
  popupPresenceStore = inject(PopupPresenceStore);
  queue = [];
  activeTasks = /* @__PURE__ */ new Map();
  nextTaskId = 0;
  constructor() {
    effect(() => {
      if (!this.popupPresenceStore.visible()) {
        return;
      }
      this.cancelQueuedBackgroundTasks();
      const activeUiTask = this.activeTasks.get("ui");
      if (activeUiTask?.priority === "background") {
        activeUiTask.controller?.abort();
      }
    });
  }
  run(priority, task, externalSignal) {
    if (externalSignal?.aborted || priority === "background" && this.popupPresenceStore.visible()) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const controller = typeof AbortController === "undefined" ? null : new AbortController();
      const queuedTask = {
        id: ++this.nextTaskId,
        priority,
        controller,
        task,
        resolve,
        unbindExternalAbort: () => void 0
      };
      queuedTask.unbindExternalAbort = this.bindExternalAbort(queuedTask, externalSignal);
      this.queue.push(queuedTask);
      this.sortQueue();
      this.drain();
    });
  }
  drain() {
    this.drainLane("notification");
    this.drainLane("ui");
  }
  drainLane(lane) {
    if (this.activeTasks.has(lane)) {
      return;
    }
    const nextTask = this.nextRunnableTask(lane);
    if (!nextTask) {
      return;
    }
    this.activeTasks.set(lane, nextTask);
    void this.execute(nextTask);
  }
  async execute(task) {
    try {
      if (!task.controller?.signal.aborted) {
        await task.task({ signal: task.controller?.signal });
      }
    } catch {
    } finally {
      task.unbindExternalAbort();
      const lane = this.lane(task.priority);
      if (this.activeTasks.get(lane)?.id === task.id) {
        this.activeTasks.delete(lane);
      }
      task.resolve();
      this.drain();
    }
  }
  nextRunnableTask(lane) {
    while (true) {
      const candidateIndex = this.queue.findIndex((candidate2) => this.lane(candidate2.priority) === lane);
      if (candidateIndex < 0) {
        return null;
      }
      const [candidate] = this.queue.splice(candidateIndex, 1);
      if (candidate.controller?.signal.aborted) {
        candidate.unbindExternalAbort();
        candidate.resolve();
        continue;
      }
      if (candidate.priority === "background" && this.popupPresenceStore.visible()) {
        candidate.controller?.abort();
        candidate.unbindExternalAbort();
        candidate.resolve();
        continue;
      }
      return candidate;
    }
    return null;
  }
  cancelQueuedBackgroundTasks() {
    for (let index = this.queue.length - 1; index >= 0; index -= 1) {
      const task = this.queue[index];
      if (task.priority !== "background") {
        continue;
      }
      this.queue.splice(index, 1);
      task.controller?.abort();
      task.unbindExternalAbort();
      task.resolve();
    }
  }
  bindExternalAbort(task, externalSignal) {
    if (!externalSignal) {
      return () => void 0;
    }
    const abort = () => {
      task.controller?.abort();
      if (this.activeTasks.get(this.lane(task.priority))?.id === task.id) {
        return;
      }
      const index = this.queue.findIndex((candidate) => candidate.id === task.id);
      if (index >= 0) {
        this.queue.splice(index, 1);
      }
      task.unbindExternalAbort();
      task.resolve();
    };
    externalSignal.addEventListener("abort", abort, { once: true });
    return () => externalSignal.removeEventListener("abort", abort);
  }
  sortQueue() {
    this.queue.sort((left, right) => {
      if (left.priority === right.priority) {
        return left.id - right.id;
      }
      if (left.priority === "notification") {
        return -1;
      }
      if (right.priority === "notification") {
        return 1;
      }
      return left.priority === "foreground" ? -1 : 1;
    });
  }
  lane(priority) {
    return priority === "notification" ? "notification" : "ui";
  }
  static \u0275fac = function UiPollCoordinator_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UiPollCoordinator)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UiPollCoordinator, factory: _UiPollCoordinator.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UiPollCoordinator, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/shared/ui/scheduler/ui-task-scheduler.ts
var UiTaskScheduler = class {
  config;
  timer = null;
  abortController = null;
  inFlight = false;
  destroyed = false;
  lastPositiveIntervalMs = 0;
  constructor(config) {
    this.config = config;
  }
  restart() {
    if (this.destroyed) {
      return;
    }
    this.clearTimer();
    this.scheduleNext();
  }
  stop(options = {}) {
    this.clearTimer();
    if (options.abort === true) {
      this.abortController?.abort();
      this.abortController = null;
    }
  }
  destroy() {
    this.destroyed = true;
    this.stop({ abort: true });
  }
  async run() {
    this.timer = null;
    if (this.destroyed) {
      return;
    }
    const intervalMs = this.normalizedIntervalMs();
    if (intervalMs > 0 && !this.inFlight) {
      const abortController = typeof AbortController === "undefined" ? null : new AbortController();
      this.abortController = abortController;
      this.inFlight = true;
      try {
        const state = this.config.state();
        if (this.config.pollCoordinator) {
          await this.config.pollCoordinator.run(this.config.pollPriority ?? "background", ({ signal }) => this.config.task({ state, signal }), abortController?.signal);
        } else {
          await this.config.task({
            state,
            signal: abortController?.signal
          });
        }
      } catch {
      } finally {
        if (this.abortController === abortController) {
          this.abortController = null;
        }
        this.inFlight = false;
      }
    }
    this.scheduleNext();
  }
  scheduleNext() {
    if (this.destroyed || this.timer) {
      return;
    }
    const intervalMs = this.normalizedIntervalMs();
    if (intervalMs > 0) {
      this.lastPositiveIntervalMs = intervalMs;
    }
    const delayMs = intervalMs > 0 ? intervalMs : this.lastPositiveIntervalMs;
    if (delayMs <= 0) {
      return;
    }
    this.timer = setTimeout(() => {
      void this.run();
    }, delayMs);
  }
  clearTimer() {
    if (!this.timer) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;
  }
  normalizedIntervalMs() {
    return Math.max(0, Math.trunc(Number(this.config.intervalMs()) || 0));
  }
};

export {
  UiPollCoordinator,
  UiTaskScheduler
};
//# sourceMappingURL=chunk-EA3MO7BB.js.map
