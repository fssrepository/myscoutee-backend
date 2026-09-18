import {
  LocalMemoryDb
} from "./chunk-U4O3FETT.js";
import {
  APP_INDEXED_DB_KEYS
} from "./chunk-YO3STUCM.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/core/local/source/repositories/operator-registry.repository.ts
var LocalOperatorRegistryRepository = class _LocalOperatorRegistryRepository {
  memoryDb = inject(LocalMemoryDb);
  hydrationPromise = null;
  hydrated = false;
  cachedRecord = null;
  async whenReady() {
    if (this.hydrated) {
      return;
    }
    if (!this.hydrationPromise) {
      this.hydrationPromise = this.hydrate();
    }
    await this.hydrationPromise;
  }
  async read() {
    await this.whenReady();
    return this.cloneRecord(this.cachedRecord);
  }
  async write(record) {
    await this.whenReady();
    const saved = this.cloneRecord(record);
    if (!saved) {
      return;
    }
    this.cachedRecord = saved;
    await this.memoryDb.writeIndexedDbTableEntry(APP_INDEXED_DB_KEYS.operatorRegistry, this.cloneRecord(saved));
  }
  async clear() {
    await this.whenReady();
    this.cachedRecord = null;
    await this.memoryDb.deleteIndexedDbTableEntry(APP_INDEXED_DB_KEYS.operatorRegistry);
  }
  async hydrate() {
    await this.memoryDb.whenReady();
    this.cachedRecord = this.cloneRecord(await this.memoryDb.readIndexedDbTableEntry(APP_INDEXED_DB_KEYS.operatorRegistry));
    this.hydrated = true;
  }
  cloneRecord(record) {
    return record ? structuredClone(record) : null;
  }
  static \u0275fac = function LocalOperatorRegistryRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocalOperatorRegistryRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LocalOperatorRegistryRepository, factory: _LocalOperatorRegistryRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalOperatorRegistryRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  LocalOperatorRegistryRepository
};
//# sourceMappingURL=chunk-NB6L6NLP.js.map
