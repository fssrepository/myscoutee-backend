import {
  APP_I18N_BUNDLES_STORE,
  APP_INDEXED_DB_KEYS,
  APP_SCOPED_INDEXED_DB_VERSION,
  APP_STORAGE_SCOPE,
  APP_TABLES_STORE,
  appMemoryDbStorageKey,
  appScopedIndexedDbName,
  createAppScopedObjectStores,
  removeScopedStorageEntries
} from "./chunk-LERGHE7K.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/contracts/deployment-configuration.interface.ts
var DEPLOYMENT_THEME_PRESETS = [
  "AURORA",
  "OCEAN",
  "FOREST",
  "SUNSET",
  "VIOLET",
  "ROSE",
  "AMBER",
  "SLATE",
  "AQUARIUS",
  "MONOCHROME"
];
var DEFAULT_DEPLOYMENT_BRANDING = {
  productName: "MyScoutee",
  homeLabel: "Your preferences come first",
  logoUrl: "assets/logo/heart.webp",
  logoCharacterIndex: 0,
  themePreset: "VIOLET",
  revision: 0
};
var DEFAULT_DEPLOYMENT_SOCIAL_LINKS = [];
var DEFAULT_DEPLOYMENT_PRIVACY_CONTACT = {
  configured: false,
  dataControllerName: "",
  privacyContactEmail: ""
};
var DEFAULT_DEPLOYMENT_CONFIGURATION = __spreadProps(__spreadValues({}, DEFAULT_DEPLOYMENT_BRANDING), {
  socialLinks: DEFAULT_DEPLOYMENT_SOCIAL_LINKS,
  privacyContact: DEFAULT_DEPLOYMENT_PRIVACY_CONTACT
});

// src/app/shared/core/local/source/entity/user.entity.ts
var USERS_TABLE_NAME = APP_INDEXED_DB_KEYS.users;

// src/app/shared/core/local/source/entity/chat.entity.ts
var CHATS_TABLE_NAME = APP_INDEXED_DB_KEYS.chats;
var CHAT_MESSAGES_TABLE_NAME = APP_INDEXED_DB_KEYS.chatMessages;

// src/app/shared/core/local/source/entity/event.entity.ts
var EVENT_FEEDBACK_TABLE_NAME = APP_INDEXED_DB_KEYS.eventFeedback;
var EVENTS_TABLE_NAME = APP_INDEXED_DB_KEYS.events;

// src/app/shared/core/local/source/entity/event-ticket.entity.ts
var EVENT_TICKETS_TABLE_NAME = APP_INDEXED_DB_KEYS.eventTickets;

// src/app/shared/core/local/source/entity/content.entity.ts
var HELP_CENTER_TABLE_NAME = APP_INDEXED_DB_KEYS.helpCenter;
var IDEA_POSTS_TABLE_NAME = APP_INDEXED_DB_KEYS.ideaPosts;

// src/app/shared/core/local/source/entity/notification.entity.ts
var NOTIFICATIONS_TABLE_NAME = APP_INDEXED_DB_KEYS.notifications;

// src/app/shared/core/local/source/entity/profile.entity.ts
var CONTACTS_TABLE_NAME = APP_INDEXED_DB_KEYS.contacts;
var PROFILE_EXPERIENCES_TABLE_NAME = APP_INDEXED_DB_KEYS.profileExperiences;

// src/app/shared/core/local/source/entity/sharing.entity.ts
var SHARE_TOKENS_TABLE_NAME = APP_INDEXED_DB_KEYS.shareTokens;

// src/app/shared/core/local/source/entity/rate.entity.ts
var USER_RATES_TABLE_NAME = APP_INDEXED_DB_KEYS.userRates;
var USER_RATES_OUTBOX_TABLE_NAME = APP_INDEXED_DB_KEYS.userRatesOutbox;
var USER_FILTER_PREFERENCES_TABLE_NAME = APP_INDEXED_DB_KEYS.userFilterPreferences;

// src/app/shared/core/local/source/entity/asset.entity.ts
var ASSETS_TABLE_NAME = APP_INDEXED_DB_KEYS.assets;
var ASSET_REQUESTS_TABLE_NAME = APP_INDEXED_DB_KEYS.assetRequests;

// src/app/shared/core/local/source/entity/activity.entity.ts
var ACTIVITY_MEMBERS_TABLE_NAME = APP_INDEXED_DB_KEYS.activityMembers;
var ACTIVITY_RESOURCES_TABLE_NAME = APP_INDEXED_DB_KEYS.activityResources;
var ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME = APP_INDEXED_DB_KEYS.activitySubEventGroups;
var ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME = APP_INDEXED_DB_KEYS.activitySubEventStageRuntime;

// src/app/shared/core/common/app.db.ts
var AppMemoryDb = class _AppMemoryDb {
  static SCHEMA_TABLE_KEYS = [
    USERS_TABLE_NAME,
    ASSETS_TABLE_NAME,
    ACTIVITY_MEMBERS_TABLE_NAME,
    ACTIVITY_RESOURCES_TABLE_NAME,
    ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME,
    ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME,
    ASSET_REQUESTS_TABLE_NAME,
    USER_RATES_TABLE_NAME,
    USER_RATES_OUTBOX_TABLE_NAME,
    USER_FILTER_PREFERENCES_TABLE_NAME,
    CHATS_TABLE_NAME,
    CHAT_MESSAGES_TABLE_NAME,
    EVENT_TICKETS_TABLE_NAME,
    EVENT_FEEDBACK_TABLE_NAME,
    HELP_CENTER_TABLE_NAME,
    IDEA_POSTS_TABLE_NAME,
    NOTIFICATIONS_TABLE_NAME,
    CONTACTS_TABLE_NAME,
    PROFILE_EXPERIENCES_TABLE_NAME,
    SHARE_TOKENS_TABLE_NAME,
    EVENTS_TABLE_NAME
  ];
  _tables = signal(this.loadInitialState(), ...ngDevMode ? [{ debugName: "_tables" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingPersistState = null;
  persistTimerId = null;
  resetStoragePromise = null;
  storageResetComplete = false;
  hydrationComplete = false;
  hydrationReady;
  get storageScope() {
    return APP_STORAGE_SCOPE;
  }
  get storageEnabled() {
    return this.storageScope === APP_STORAGE_SCOPE;
  }
  tables = this._tables.asReadonly();
  constructor() {
    this.hydrationReady = this.storageEnabled ? this.hydrateFromIndexedDb() : this.completeInactiveHydration();
  }
  read() {
    return this._tables();
  }
  async whenReady() {
    try {
      await this.hydrationReady;
    } catch {
    }
  }
  write(updater) {
    const next = this.normalizeState(updater(this._tables()));
    this._tables.set(next);
    if (!this.hydrationComplete || !this.storageEnabled) {
      return;
    }
    this.schedulePersist(next);
  }
  async flushToIndexedDb() {
    await this.whenReady();
    if (this.persistTimerId !== null) {
      clearTimeout(this.persistTimerId);
      this.persistTimerId = null;
    }
    const pendingState = this.pendingPersistState ?? this._tables();
    this.pendingPersistState = null;
    if (this.storageEnabled) {
      this.persist(pendingState);
    }
    await this.persistToIndexedDb(pendingState, true);
  }
  async resetStorage() {
    await this.resetStoragePreservingTables([]);
  }
  async resetStoragePreservingTables(preservedTableNames) {
    await this.whenReady();
    const preservedTableNameSet = new Set(preservedTableNames.map((tableName) => tableName.trim()).filter(Boolean));
    const fullReset = preservedTableNameSet.size === 0;
    const currentState = this._tables();
    const nextState = this.createEmptyState();
    for (const tableName of _AppMemoryDb.SCHEMA_TABLE_KEYS) {
      if (preservedTableNameSet.has(tableName)) {
        nextState[tableName] = currentState[tableName];
      }
    }
    if (this.persistTimerId !== null) {
      clearTimeout(this.persistTimerId);
      this.persistTimerId = null;
    }
    this.pendingPersistState = null;
    this._tables.set(nextState);
    if (typeof localStorage !== "undefined") {
      try {
        if (fullReset) {
          removeScopedStorageEntries(localStorage, this.storageScope);
        } else {
          localStorage.removeItem(this.storageKey);
        }
      } catch {
      }
    }
    if (fullReset && typeof sessionStorage !== "undefined") {
      try {
        removeScopedStorageEntries(sessionStorage, this.storageScope);
      } catch {
      }
    }
    const db = await this.openIndexedDb(true);
    if (!db) {
      return;
    }
    await new Promise((resolve) => {
      const tx = db.transaction(APP_TABLES_STORE, "readwrite");
      tx.objectStore(APP_TABLES_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
    if (fullReset && db.objectStoreNames.contains(APP_I18N_BUNDLES_STORE)) {
      await new Promise((resolve) => {
        const tx = db.transaction(APP_I18N_BUNDLES_STORE, "readwrite");
        tx.objectStore(APP_I18N_BUNDLES_STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
        tx.onabort = () => resolve();
      });
    }
  }
  async resetStorageOnce() {
    if (this.storageResetComplete) {
      return;
    }
    if (!this.resetStoragePromise) {
      this.resetStoragePromise = this.resetStorage().finally(() => {
        this.storageResetComplete = true;
        this.resetStoragePromise = null;
      });
    }
    await this.resetStoragePromise;
  }
  async readIndexedDbTableEntry(key) {
    const normalizedKey = key.trim();
    if (!normalizedKey) {
      return null;
    }
    const db = await this.openIndexedDb(true);
    if (!db) {
      return null;
    }
    return await this.readIndexedDbEntry(db, normalizedKey);
  }
  async writeIndexedDbTableEntry(key, value) {
    const normalizedKey = key.trim();
    if (!normalizedKey) {
      return;
    }
    const db = await this.openIndexedDb(true);
    if (!db) {
      return;
    }
    await this.putIndexedDbEntry(db, normalizedKey, this.indexedDbEntryForPersistence(normalizedKey, value));
  }
  async deleteIndexedDbTableEntry(key) {
    const normalizedKey = key.trim();
    if (!normalizedKey) {
      return;
    }
    const db = await this.openIndexedDb(true);
    if (!db) {
      return;
    }
    await new Promise((resolve) => {
      const tx = db.transaction(APP_TABLES_STORE, "readwrite");
      tx.objectStore(APP_TABLES_STORE).delete(normalizedKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  }
  async queryActivityRateRecords(query) {
    const normalizedQuery = this.normalizeActivityRateRecordQuery(query);
    if (!normalizedQuery) {
      return {
        records: [],
        total: 0
      };
    }
    return this.queryActivityRateRecordsFromMemory(normalizedQuery);
  }
  createEmptyState() {
    return {
      [ASSETS_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByOwnerUserId: {}
      },
      [ASSET_REQUESTS_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByOwnerKey: {}
      },
      [ACTIVITY_MEMBERS_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByOwnerKey: {}
      },
      [ACTIVITY_RESOURCES_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByOwnerKey: {}
      },
      [ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByOwnerKey: {}
      },
      [ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByOwnerKey: {}
      },
      [USERS_TABLE_NAME]: {
        byId: {},
        ids: []
      },
      [USER_RATES_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByRelevantUserId: {}
      },
      [USER_RATES_OUTBOX_TABLE_NAME]: {
        byId: {},
        ids: []
      },
      [USER_FILTER_PREFERENCES_TABLE_NAME]: {
        byId: {},
        ids: []
      },
      [CHATS_TABLE_NAME]: {
        byId: {},
        ids: []
      },
      [CHAT_MESSAGES_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByChatKey: {}
      },
      [EVENT_FEEDBACK_TABLE_NAME]: {
        byId: {},
        ids: []
      },
      [EVENT_TICKETS_TABLE_NAME]: {
        byId: {},
        ids: []
      },
      [HELP_CENTER_TABLE_NAME]: {
        seeded: false,
        activeRevisionId: null,
        seededKinds: {},
        activeRevisionIdsByKind: {},
        revisionsById: {},
        revisionIds: [],
        auditById: {},
        auditIds: [],
        privacyConsentsById: {},
        privacyConsentIds: []
      },
      [IDEA_POSTS_TABLE_NAME]: {
        seeded: false,
        byId: {},
        ids: []
      },
      [NOTIFICATIONS_TABLE_NAME]: {
        byId: {},
        ids: [],
        idsByRecipientUserId: {},
        mutedByUserId: {},
        seededUserIds: []
      },
      [CONTACTS_TABLE_NAME]: {
        byOwnerUserId: {},
        ownerUserIds: []
      },
      [PROFILE_EXPERIENCES_TABLE_NAME]: {
        byUserId: {},
        userIds: []
      },
      [SHARE_TOKENS_TABLE_NAME]: {
        byToken: {},
        tokens: []
      },
      [EVENTS_TABLE_NAME]: {
        byId: {},
        ids: []
      }
    };
  }
  loadInitialState() {
    const fallback = this.createEmptyState();
    if (!this.canUseStorage()) {
      return fallback;
    }
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return fallback;
      }
      const parsed = JSON.parse(raw);
      return this.normalizeState(parsed, fallback);
    } catch {
      return fallback;
    }
  }
  persist(state) {
    if (!this.canUseStorage()) {
      return;
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stateForLocalStoragePersistence(state)));
    } catch {
    }
  }
  schedulePersist(state) {
    this.pendingPersistState = state;
    if (this.persistTimerId !== null) {
      clearTimeout(this.persistTimerId);
    }
    this.persistTimerId = setTimeout(() => {
      this.persistTimerId = null;
      const pendingState = this.pendingPersistState;
      this.pendingPersistState = null;
      if (!pendingState) {
        return;
      }
      this.persist(pendingState);
      void this.persistToIndexedDb(pendingState);
    }, 32);
  }
  async completeInactiveHydration() {
    this.hydrationComplete = true;
  }
  async hydrateFromIndexedDb() {
    try {
      const snapshot = await this.readFromIndexedDb();
      if (!snapshot) {
        return;
      }
      const normalized = this.mergeHydratedStateWithCurrent(this.normalizeState(snapshot), this._tables());
      const current = this._tables();
      const currentHasUsers = current[USERS_TABLE_NAME].ids.length > 0;
      const incomingHasUsers = normalized[USERS_TABLE_NAME].ids.length > 0;
      if (currentHasUsers && !incomingHasUsers) {
        return;
      }
      this._tables.set(normalized);
    } finally {
      if (this.persistTimerId !== null) {
        clearTimeout(this.persistTimerId);
        this.persistTimerId = null;
      }
      this.pendingPersistState = null;
      this.hydrationComplete = true;
    }
  }
  mergeHydratedStateWithCurrent(incoming, current) {
    const currentHelpCenter = current[HELP_CENTER_TABLE_NAME];
    const incomingHelpCenter = incoming[HELP_CENTER_TABLE_NAME];
    const currentPrivacyConsentsById = currentHelpCenter.privacyConsentsById ?? {};
    const incomingPrivacyConsentsById = incomingHelpCenter.privacyConsentsById ?? {};
    const mergedPrivacyConsentsById = __spreadValues(__spreadValues({}, currentPrivacyConsentsById), incomingPrivacyConsentsById);
    const mergedPrivacyConsentIds = [
      ...currentHelpCenter.privacyConsentIds ?? [],
      ...incomingHelpCenter.privacyConsentIds ?? []
    ];
    return __spreadProps(__spreadValues({}, incoming), {
      [HELP_CENTER_TABLE_NAME]: __spreadProps(__spreadValues({}, incomingHelpCenter), {
        privacyConsentsById: mergedPrivacyConsentsById,
        privacyConsentIds: [.../* @__PURE__ */ new Set([
          ...mergedPrivacyConsentIds,
          ...Object.keys(mergedPrivacyConsentsById)
        ])]
      })
    });
  }
  async readFromIndexedDb() {
    const primaryDb = await this.openIndexedDb();
    if (primaryDb) {
      const primarySnapshot = await this.readStateFromIndexedDb(primaryDb);
      if (primarySnapshot) {
        return primarySnapshot;
      }
    }
    return null;
  }
  async readStateFromIndexedDb(db) {
    const partialState = {};
    let hasStoredTable = false;
    await Promise.all(_AppMemoryDb.SCHEMA_TABLE_KEYS.map(async (key) => {
      const entry = await this.readIndexedDbEntry(db, key);
      if (entry === null) {
        return;
      }
      partialState[key] = entry;
      hasStoredTable = true;
    }));
    if (!hasStoredTable) {
      return null;
    }
    return this.normalizeState(partialState, this.createEmptyState());
  }
  async persistToIndexedDb(state, force = false) {
    const db = await this.openIndexedDb(force);
    if (!db) {
      return;
    }
    const persistedState = this.stateForIndexedDbPersistence(state);
    await Promise.all(_AppMemoryDb.SCHEMA_TABLE_KEYS.map((key) => {
      const value = this.indexedDbEntryForPersistence(key, persistedState[key]);
      return this.shouldPersistIndexedDbTable(key, value) ? this.putIndexedDbEntry(db, key, value) : this.deleteIndexedDbEntry(db, key);
    }));
  }
  indexedDbEntryForPersistence(key, value) {
    const entry = key === EVENTS_TABLE_NAME ? this.eventsTableForPersistence(value) : value;
    return this.indexedDbPlainValue(entry);
  }
  indexedDbPlainValue(value) {
    return this.toIndexedDbPlainValue(value, /* @__PURE__ */ new WeakSet());
  }
  shouldPersistIndexedDbTable(key, value) {
    if (!value || typeof value !== "object") {
      return false;
    }
    const table = value;
    if (key === HELP_CENTER_TABLE_NAME) {
      return Boolean(`${table["activeRevisionId"] ?? ""}`.trim() || this.hasEntries(table["revisionIds"]) || this.hasEntries(table["auditIds"]) || this.hasEntries(table["privacyConsentIds"]));
    }
    if (key === CONTACTS_TABLE_NAME) {
      return this.hasEntries(table["ownerUserIds"]);
    }
    if (key === PROFILE_EXPERIENCES_TABLE_NAME) {
      return this.hasEntries(table["userIds"]);
    }
    if (key === SHARE_TOKENS_TABLE_NAME) {
      return this.hasEntries(table["tokens"]);
    }
    if ("ids" in table) {
      return this.hasEntries(table["ids"]);
    }
    return Object.keys(table).length > 0;
  }
  hasEntries(value) {
    return Array.isArray(value) && value.length > 0;
  }
  toIndexedDbPlainValue(value, seen) {
    if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return value;
    }
    if (value === void 0 || typeof value === "function" || typeof value === "symbol") {
      return null;
    }
    if (typeof value === "bigint") {
      return value.toString();
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.toIndexedDbPlainValue(item, seen));
    }
    if (typeof value !== "object") {
      return null;
    }
    if (seen.has(value)) {
      return null;
    }
    seen.add(value);
    const next = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry === void 0 || typeof entry === "function" || typeof entry === "symbol") {
        continue;
      }
      next[key] = this.toIndexedDbPlainValue(entry, seen);
    }
    seen.delete(value);
    return next;
  }
  stateForIndexedDbPersistence(state) {
    return state;
  }
  stateForLocalStoragePersistence(state) {
    return {
      [USER_RATES_OUTBOX_TABLE_NAME]: state[USER_RATES_OUTBOX_TABLE_NAME]
    };
  }
  eventsTableForPersistence(table) {
    const byId = {};
    for (const [id, record] of Object.entries(table?.byId ?? {})) {
      const next = __spreadValues({}, record);
      delete next["acceptedMemberUserIds"];
      delete next["pendingMemberUserIds"];
      byId[id] = next;
    }
    return {
      byId,
      ids: Array.isArray(table?.ids) ? [...table.ids] : []
    };
  }
  readIndexedDbEntry(db, key) {
    return new Promise((resolve) => {
      const tx = db.transaction(APP_TABLES_STORE, "readonly");
      const store = tx.objectStore(APP_TABLES_STORE);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => resolve(null);
    });
  }
  putIndexedDbEntry(db, key, value) {
    return new Promise((resolve) => {
      const tx = db.transaction(APP_TABLES_STORE, "readwrite");
      tx.objectStore(APP_TABLES_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  }
  deleteIndexedDbEntry(db, key) {
    return new Promise((resolve) => {
      const tx = db.transaction(APP_TABLES_STORE, "readwrite");
      tx.objectStore(APP_TABLES_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  }
  openIndexedDb(force = false) {
    if (!force && !this.storageEnabled || typeof indexedDB === "undefined") {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      const request = indexedDB.open(this.indexedDbName, APP_SCOPED_INDEXED_DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        createAppScopedObjectStores(db);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    });
  }
  queryActivityRateRecordsFromMemory(query) {
    const ratesTable = this._tables()[USER_RATES_TABLE_NAME];
    const filtered = ratesTable.ids.map((id) => ratesTable.byId[id]).filter((record) => Boolean(record)).filter((record) => (record.ownerUserId?.trim() ?? "") === query.ownerUserId).filter((record) => record.mode === query.mode).filter((record) => (record.displayDirection ?? "") === query.displayDirection).filter((record) => this.matchesActivityRateRange(record, query.rangeStartMs, query.rangeEndMs)).sort((left, right) => this.compareActivityRates(left, right, query));
    const startIndex = query.cursor ? Math.max(0, filtered.findIndex((record) => record.id === query.cursor?.id) + 1) : 0;
    const pageRecords = filtered.slice(startIndex, startIndex + query.limit).map((record) => __spreadValues({}, record));
    return {
      records: pageRecords,
      total: filtered.length,
      nextCursor: filtered.length > startIndex + pageRecords.length && pageRecords.length > 0 ? this.serializeActivityRateCursor(pageRecords[pageRecords.length - 1]) : null
    };
  }
  normalizeActivityRateRecordQuery(query) {
    const ownerUserId = query.ownerUserId.trim();
    if (!ownerUserId) {
      return null;
    }
    const limit = Math.max(1, Math.trunc(Number(query.limit) || 50));
    const sort = query.sort;
    const sortDirection = query.sortDirection === "asc" || query.sortDirection === "desc" ? query.sortDirection : sort === "distance" ? "asc" : "desc";
    const rangeStartMs = this.parseSortableTimestamp(query.rangeStartIso);
    const rangeEndMs = this.parseSortableTimestamp(query.rangeEndIso);
    const cursor = this.parseActivityRateCursor(query.cursor);
    if (rangeStartMs !== null && rangeEndMs !== null && rangeStartMs > rangeEndMs) {
      return null;
    }
    return {
      ownerUserId,
      mode: query.mode,
      displayDirection: query.displayDirection,
      sort,
      sortDirection,
      cursor,
      limit,
      rangeStartMs,
      rangeEndMs
    };
  }
  matchesActivityRateRange(record, rangeStartMs, rangeEndMs) {
    if (rangeStartMs === null && rangeEndMs === null) {
      return true;
    }
    const happenedAtMs = this.userRateSortValue(record);
    if (rangeStartMs !== null && happenedAtMs < rangeStartMs) {
      return false;
    }
    if (rangeEndMs !== null && happenedAtMs > rangeEndMs) {
      return false;
    }
    return true;
  }
  compareActivityRates(left, right, query) {
    if (query.sort === "distance") {
      const distanceDelta = this.userRateDistanceValue(left) - this.userRateDistanceValue(right);
      if (distanceDelta !== 0) {
        return distanceDelta;
      }
      return left.id.localeCompare(right.id);
    }
    if (query.sort === "relevance") {
      const relevanceDelta = this.userRateRelevanceScore(right) - this.userRateRelevanceScore(left);
      if (relevanceDelta !== 0) {
        return relevanceDelta;
      }
      return right.id.localeCompare(left.id);
    }
    const happenedAtDelta = query.sortDirection === "asc" ? this.userRateSortValue(left) - this.userRateSortValue(right) : this.userRateSortValue(right) - this.userRateSortValue(left);
    if (happenedAtDelta !== 0) {
      return happenedAtDelta;
    }
    return query.sortDirection === "asc" ? left.id.localeCompare(right.id) : right.id.localeCompare(left.id);
  }
  parseSortableTimestamp(value) {
    if (!value) {
      return null;
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  parseActivityRateCursor(value) {
    if (!value) {
      return null;
    }
    try {
      const parsed = JSON.parse(value);
      const id = typeof parsed.id === "string" ? parsed.id.trim() : "";
      if (!id) {
        return null;
      }
      return {
        id,
        happenedAtMs: Number.isFinite(parsed.happenedAtMs) ? Math.max(0, Math.trunc(Number(parsed.happenedAtMs))) : 0,
        distanceMeters: Number.isFinite(parsed.distanceMeters) ? Math.max(0, Math.trunc(Number(parsed.distanceMeters))) : 0,
        relevanceScore: Number.isFinite(parsed.relevanceScore) ? Math.max(0, Math.trunc(Number(parsed.relevanceScore))) : 0
      };
    } catch {
      return null;
    }
  }
  serializeActivityRateCursor(record) {
    return JSON.stringify({
      id: record.id,
      happenedAtMs: this.userRateSortValue(record),
      distanceMeters: this.userRateDistanceValue(record),
      relevanceScore: this.userRateRelevanceScore(record)
    });
  }
  normalizeState(value, fallback = this.createEmptyState()) {
    const source = value && typeof value === "object" ? value : {};
    const usersSource = source[USERS_TABLE_NAME];
    const assetsSource = source[ASSETS_TABLE_NAME];
    const assetRequestsSource = source[ASSET_REQUESTS_TABLE_NAME];
    const activityMembersSource = source[ACTIVITY_MEMBERS_TABLE_NAME];
    const activityResourcesSource = source[ACTIVITY_RESOURCES_TABLE_NAME];
    const activitySubEventGroupsSource = source[ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME];
    const activitySubEventStageRuntimeSource = source[ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME];
    const ratesSource = source[USER_RATES_TABLE_NAME];
    const outboxSource = source[USER_RATES_OUTBOX_TABLE_NAME];
    const filterPreferencesSource = source[USER_FILTER_PREFERENCES_TABLE_NAME];
    const chatsSource = source[CHATS_TABLE_NAME];
    const chatMessagesSource = source[CHAT_MESSAGES_TABLE_NAME];
    const eventFeedbackSource = source[EVENT_FEEDBACK_TABLE_NAME];
    const eventTicketsSource = source[EVENT_TICKETS_TABLE_NAME];
    const helpCenterSource = source[HELP_CENTER_TABLE_NAME];
    const ideaPostsSource = source[IDEA_POSTS_TABLE_NAME];
    const notificationsSource = source[NOTIFICATIONS_TABLE_NAME];
    const contactsSource = source[CONTACTS_TABLE_NAME];
    const profileExperiencesSource = source[PROFILE_EXPERIENCES_TABLE_NAME];
    const shareTokensSource = source[SHARE_TOKENS_TABLE_NAME];
    const eventsSource = source[EVENTS_TABLE_NAME];
    const userRatesOutboxById = this.normalizeUserRatesOutboxById(outboxSource?.byId, fallback[USER_RATES_OUTBOX_TABLE_NAME].byId);
    const contactsByOwnerUserId = this.normalizeContactsByOwnerUserId(contactsSource?.byOwnerUserId, fallback[CONTACTS_TABLE_NAME].byOwnerUserId);
    const chatsById = chatsSource?.byId && typeof chatsSource.byId === "object" ? __spreadValues({}, chatsSource.byId) : __spreadValues({}, fallback[CHATS_TABLE_NAME].byId);
    const chatMessagesById = chatMessagesSource?.byId && typeof chatMessagesSource.byId === "object" ? __spreadValues({}, chatMessagesSource.byId) : __spreadValues({}, fallback[CHAT_MESSAGES_TABLE_NAME].byId);
    const chatMessageIds = Array.isArray(chatMessagesSource?.ids) ? chatMessagesSource.ids.map((id) => String(id)) : [...fallback[CHAT_MESSAGES_TABLE_NAME].ids];
    const chatMessageIdsByChatKey = chatMessagesSource?.idsByChatKey && typeof chatMessagesSource.idsByChatKey === "object" ? Object.fromEntries(Object.entries(chatMessagesSource.idsByChatKey).filter((entry) => Array.isArray(entry[1])).map(([chatKey, ids]) => [chatKey, ids.map((id) => String(id))])) : __spreadValues({}, fallback[CHAT_MESSAGES_TABLE_NAME].idsByChatKey);
    return {
      [ASSETS_TABLE_NAME]: {
        byId: this.normalizeAssetsById(assetsSource?.byId, fallback[ASSETS_TABLE_NAME].byId),
        ids: this.normalizeIdList(assetsSource?.ids, fallback[ASSETS_TABLE_NAME].ids),
        idsByOwnerUserId: this.normalizeAssetsIdsByOwnerUserId(assetsSource)
      },
      [ASSET_REQUESTS_TABLE_NAME]: {
        byId: this.normalizeAssetRequestsById(assetRequestsSource?.byId, fallback[ASSET_REQUESTS_TABLE_NAME].byId),
        ids: this.normalizeIdList(assetRequestsSource?.ids, fallback[ASSET_REQUESTS_TABLE_NAME].ids),
        idsByOwnerKey: this.normalizeAssetRequestsIdsByOwnerKey(assetRequestsSource)
      },
      [ACTIVITY_MEMBERS_TABLE_NAME]: {
        byId: this.normalizeActivityMembersById(activityMembersSource?.byId, fallback[ACTIVITY_MEMBERS_TABLE_NAME].byId),
        ids: this.normalizeIdList(activityMembersSource?.ids, fallback[ACTIVITY_MEMBERS_TABLE_NAME].ids),
        idsByOwnerKey: this.normalizeActivityMembersIdsByOwnerKey(activityMembersSource)
      },
      [ACTIVITY_RESOURCES_TABLE_NAME]: {
        byId: this.normalizeActivityResourcesById(activityResourcesSource?.byId, fallback[ACTIVITY_RESOURCES_TABLE_NAME].byId),
        ids: this.normalizeIdList(activityResourcesSource?.ids, fallback[ACTIVITY_RESOURCES_TABLE_NAME].ids),
        idsByOwnerKey: this.normalizeActivityResourcesIdsByOwnerKey(activityResourcesSource)
      },
      [ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME]: {
        byId: this.normalizeActivitySubEventGroupsById(activitySubEventGroupsSource?.byId, fallback[ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME].byId),
        ids: this.normalizeIdList(activitySubEventGroupsSource?.ids, fallback[ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME].ids),
        idsByOwnerKey: this.normalizeActivitySubEventGroupsIdsByOwnerKey(activitySubEventGroupsSource)
      },
      [ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME]: {
        byId: this.normalizeActivitySubEventStageRuntimeById(activitySubEventStageRuntimeSource?.byId, fallback[ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME].byId),
        ids: this.normalizeIdList(activitySubEventStageRuntimeSource?.ids, fallback[ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME].ids),
        idsByOwnerKey: this.normalizeActivitySubEventStageRuntimeIdsByOwnerKey(activitySubEventStageRuntimeSource)
      },
      [USERS_TABLE_NAME]: {
        byId: usersSource?.byId && typeof usersSource.byId === "object" ? __spreadValues({}, usersSource.byId) : __spreadValues({}, fallback[USERS_TABLE_NAME].byId),
        ids: Array.isArray(usersSource?.ids) ? usersSource.ids.map((id) => String(id)) : [...fallback[USERS_TABLE_NAME].ids]
      },
      [USER_RATES_TABLE_NAME]: {
        byId: this.normalizeUserRatesById(ratesSource?.byId, fallback[USER_RATES_TABLE_NAME].byId),
        ids: Array.isArray(ratesSource?.ids) ? ratesSource.ids.map((id) => String(id)) : [...fallback[USER_RATES_TABLE_NAME].ids],
        idsByRelevantUserId: this.normalizeUserRatesIdsByRelevantUserId(ratesSource)
      },
      [USER_RATES_OUTBOX_TABLE_NAME]: {
        byId: userRatesOutboxById,
        ids: Array.isArray(outboxSource?.ids) ? outboxSource.ids.map((id) => String(id)).filter((id) => Boolean(userRatesOutboxById[id])) : fallback[USER_RATES_OUTBOX_TABLE_NAME].ids.filter((id) => Boolean(userRatesOutboxById[id]))
      },
      [USER_FILTER_PREFERENCES_TABLE_NAME]: {
        byId: filterPreferencesSource?.byId && typeof filterPreferencesSource.byId === "object" ? __spreadValues({}, filterPreferencesSource.byId) : __spreadValues({}, fallback[USER_FILTER_PREFERENCES_TABLE_NAME].byId),
        ids: Array.isArray(filterPreferencesSource?.ids) ? filterPreferencesSource.ids.map((id) => String(id)) : [...fallback[USER_FILTER_PREFERENCES_TABLE_NAME].ids]
      },
      [CHATS_TABLE_NAME]: {
        byId: chatsById,
        ids: Array.isArray(chatsSource?.ids) ? chatsSource.ids.map((id) => String(id)) : [...fallback[CHATS_TABLE_NAME].ids]
      },
      [CHAT_MESSAGES_TABLE_NAME]: {
        byId: chatMessagesById,
        ids: chatMessageIds,
        idsByChatKey: chatMessageIdsByChatKey
      },
      [EVENT_FEEDBACK_TABLE_NAME]: {
        byId: eventFeedbackSource?.byId && typeof eventFeedbackSource.byId === "object" ? __spreadValues({}, eventFeedbackSource.byId) : __spreadValues({}, fallback[EVENT_FEEDBACK_TABLE_NAME].byId),
        ids: Array.isArray(eventFeedbackSource?.ids) ? eventFeedbackSource.ids.map((id) => String(id)) : [...fallback[EVENT_FEEDBACK_TABLE_NAME].ids]
      },
      [EVENT_TICKETS_TABLE_NAME]: {
        byId: eventTicketsSource?.byId && typeof eventTicketsSource.byId === "object" ? __spreadValues({}, eventTicketsSource.byId) : __spreadValues({}, fallback[EVENT_TICKETS_TABLE_NAME].byId),
        ids: Array.isArray(eventTicketsSource?.ids) ? eventTicketsSource.ids.map((id) => String(id)) : [...fallback[EVENT_TICKETS_TABLE_NAME].ids]
      },
      [HELP_CENTER_TABLE_NAME]: {
        seeded: helpCenterSource?.seeded === true || fallback[HELP_CENTER_TABLE_NAME].seeded === true,
        activeRevisionId: typeof helpCenterSource?.activeRevisionId === "string" ? helpCenterSource.activeRevisionId : fallback[HELP_CENTER_TABLE_NAME].activeRevisionId,
        seededKinds: helpCenterSource?.seededKinds && typeof helpCenterSource.seededKinds === "object" ? __spreadValues({}, helpCenterSource.seededKinds) : __spreadValues({}, fallback[HELP_CENTER_TABLE_NAME].seededKinds ?? {}),
        activeRevisionIdsByKind: helpCenterSource?.activeRevisionIdsByKind && typeof helpCenterSource.activeRevisionIdsByKind === "object" ? __spreadValues({}, helpCenterSource.activeRevisionIdsByKind) : __spreadValues({}, fallback[HELP_CENTER_TABLE_NAME].activeRevisionIdsByKind ?? {}),
        revisionsById: helpCenterSource?.revisionsById && typeof helpCenterSource.revisionsById === "object" ? __spreadValues({}, helpCenterSource.revisionsById) : __spreadValues({}, fallback[HELP_CENTER_TABLE_NAME].revisionsById),
        revisionIds: Array.isArray(helpCenterSource?.revisionIds) ? helpCenterSource.revisionIds.map((id) => String(id)) : [...fallback[HELP_CENTER_TABLE_NAME].revisionIds],
        auditById: helpCenterSource?.auditById && typeof helpCenterSource.auditById === "object" ? __spreadValues({}, helpCenterSource.auditById) : __spreadValues({}, fallback[HELP_CENTER_TABLE_NAME].auditById),
        auditIds: Array.isArray(helpCenterSource?.auditIds) ? helpCenterSource.auditIds.map((id) => String(id)) : [...fallback[HELP_CENTER_TABLE_NAME].auditIds],
        privacyConsentsById: helpCenterSource?.privacyConsentsById && typeof helpCenterSource.privacyConsentsById === "object" ? __spreadValues({}, helpCenterSource.privacyConsentsById) : __spreadValues({}, fallback[HELP_CENTER_TABLE_NAME].privacyConsentsById ?? {}),
        privacyConsentIds: Array.isArray(helpCenterSource?.privacyConsentIds) ? helpCenterSource.privacyConsentIds.map((id) => String(id)) : [...fallback[HELP_CENTER_TABLE_NAME].privacyConsentIds ?? []]
      },
      [IDEA_POSTS_TABLE_NAME]: {
        seeded: ideaPostsSource?.seeded === true || fallback[IDEA_POSTS_TABLE_NAME].seeded === true,
        byId: ideaPostsSource?.byId && typeof ideaPostsSource.byId === "object" ? __spreadValues({}, ideaPostsSource.byId) : __spreadValues({}, fallback[IDEA_POSTS_TABLE_NAME].byId),
        ids: Array.isArray(ideaPostsSource?.ids) ? ideaPostsSource.ids.map((id) => String(id)) : [...fallback[IDEA_POSTS_TABLE_NAME].ids]
      },
      [NOTIFICATIONS_TABLE_NAME]: {
        byId: notificationsSource?.byId && typeof notificationsSource.byId === "object" ? __spreadValues({}, notificationsSource.byId) : __spreadValues({}, fallback[NOTIFICATIONS_TABLE_NAME].byId),
        ids: Array.isArray(notificationsSource?.ids) ? notificationsSource.ids.map((id) => String(id)) : [...fallback[NOTIFICATIONS_TABLE_NAME].ids],
        idsByRecipientUserId: notificationsSource?.idsByRecipientUserId && typeof notificationsSource.idsByRecipientUserId === "object" ? Object.fromEntries(Object.entries(notificationsSource.idsByRecipientUserId).filter((entry) => Array.isArray(entry[1])).map(([userId, ids]) => [userId, ids.map((id) => String(id))])) : __spreadValues({}, fallback[NOTIFICATIONS_TABLE_NAME].idsByRecipientUserId),
        mutedByUserId: notificationsSource?.mutedByUserId && typeof notificationsSource.mutedByUserId === "object" ? Object.fromEntries(Object.entries(notificationsSource.mutedByUserId).map(([userId, muted]) => [userId, muted === true])) : __spreadValues({}, fallback[NOTIFICATIONS_TABLE_NAME].mutedByUserId),
        seededUserIds: Array.isArray(notificationsSource?.seededUserIds) ? notificationsSource.seededUserIds.map((userId) => String(userId)) : [...fallback[NOTIFICATIONS_TABLE_NAME].seededUserIds]
      },
      [CONTACTS_TABLE_NAME]: {
        byOwnerUserId: contactsByOwnerUserId,
        ownerUserIds: Object.keys(contactsByOwnerUserId)
      },
      [PROFILE_EXPERIENCES_TABLE_NAME]: {
        byUserId: this.normalizeProfileExperiencesByUserId(profileExperiencesSource?.byUserId, fallback[PROFILE_EXPERIENCES_TABLE_NAME].byUserId),
        userIds: Array.isArray(profileExperiencesSource?.userIds) ? profileExperiencesSource.userIds.map((id) => String(id)) : [...fallback[PROFILE_EXPERIENCES_TABLE_NAME].userIds]
      },
      [SHARE_TOKENS_TABLE_NAME]: {
        byToken: shareTokensSource?.byToken && typeof shareTokensSource.byToken === "object" ? __spreadValues({}, shareTokensSource.byToken) : __spreadValues({}, fallback[SHARE_TOKENS_TABLE_NAME].byToken),
        tokens: Array.isArray(shareTokensSource?.tokens) ? shareTokensSource.tokens.map((token) => String(token)) : [...fallback[SHARE_TOKENS_TABLE_NAME].tokens]
      },
      [EVENTS_TABLE_NAME]: {
        byId: eventsSource?.byId && typeof eventsSource.byId === "object" ? __spreadValues({}, eventsSource.byId) : __spreadValues({}, fallback[EVENTS_TABLE_NAME].byId),
        ids: Array.isArray(eventsSource?.ids) ? eventsSource.ids.map((id) => String(id)) : [...fallback[EVENTS_TABLE_NAME].ids]
      }
    };
  }
  canUseStorage() {
    return this.storageEnabled && typeof localStorage !== "undefined";
  }
  get storageKey() {
    return appMemoryDbStorageKey(this.storageScope);
  }
  get indexedDbName() {
    return appScopedIndexedDbName(this.storageScope);
  }
  normalizeActivityMembersById(value, fallback) {
    return value && typeof value === "object" ? __spreadValues({}, value) : __spreadValues({}, fallback);
  }
  normalizeActivityResourcesById(value, fallback) {
    return value && typeof value === "object" ? __spreadValues({}, value) : __spreadValues({}, fallback);
  }
  normalizeActivitySubEventGroupsById(value, fallback) {
    return value && typeof value === "object" ? __spreadValues({}, value) : __spreadValues({}, fallback);
  }
  normalizeActivitySubEventStageRuntimeById(value, fallback) {
    return value && typeof value === "object" ? __spreadValues({}, value) : __spreadValues({}, fallback);
  }
  normalizeAssetsById(value, fallback) {
    return value && typeof value === "object" ? __spreadValues({}, value) : __spreadValues({}, fallback);
  }
  normalizeAssetRequestsById(value, fallback) {
    return value && typeof value === "object" ? __spreadValues({}, value) : __spreadValues({}, fallback);
  }
  normalizeUserRatesById(value, fallback) {
    const source = value && typeof value === "object" ? value : fallback;
    const next = {};
    for (const [id, record] of Object.entries(source)) {
      const normalized = this.normalizeUserRateRecord(record);
      if (normalized) {
        next[id] = normalized;
      }
    }
    return next;
  }
  normalizeUserRatesOutboxById(value, fallback) {
    const source = value && typeof value === "object" ? value : fallback;
    const next = {};
    for (const [id, record] of Object.entries(source)) {
      if (!record || typeof record !== "object") {
        continue;
      }
      const outboxRecord = record;
      const payload = this.normalizeUserRateRecord(outboxRecord.payload);
      if (!payload) {
        continue;
      }
      next[id] = __spreadProps(__spreadValues({}, outboxRecord), {
        payload
      });
    }
    return next;
  }
  normalizeUserRateRecord(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const source = value;
    const normalized = {
      id: this.normalizeRateText(source.id),
      fromUserId: this.normalizeRateText(source.fromUserId),
      toUserId: this.normalizeRateText(source.toUserId),
      rate: this.normalizeRateNumber(source.rate),
      mode: source.mode === "pair" ? "pair" : "single",
      createdAtIso: this.normalizeRateText(source.createdAtIso),
      updatedAtIso: this.normalizeRateText(source.updatedAtIso)
    };
    const ownerUserId = this.normalizeRateText(source.ownerUserId);
    if (ownerUserId) {
      normalized.ownerUserId = ownerUserId;
    }
    const displayId = this.normalizeRateText(source.displayId);
    if (displayId) {
      normalized.displayId = displayId;
    }
    if (source.displayDirection === "given" || source.displayDirection === "received" || source.displayDirection === "mutual" || source.displayDirection === "met") {
      normalized.displayDirection = source.displayDirection;
    }
    if (source.socialContext === "separated-friends" || source.socialContext === "friends-in-common") {
      normalized.socialContext = source.socialContext;
    }
    const bridgeUserId = this.normalizeRateText(source.bridgeUserId);
    if (bridgeUserId) {
      normalized.bridgeUserId = bridgeUserId;
    }
    if (Number.isFinite(Number(source.bridgeCount))) {
      normalized.bridgeCount = Math.max(0, Math.trunc(Number(source.bridgeCount)));
    }
    if (Number.isFinite(Number(source.scoreGiven))) {
      normalized.scoreGiven = this.normalizeRateNumber(source.scoreGiven);
    }
    if (Number.isFinite(Number(source.scoreReceived))) {
      normalized.scoreReceived = this.normalizeRateNumber(source.scoreReceived);
    }
    const eventName = this.normalizeRateText(source.eventName);
    if (eventName) {
      normalized.eventName = eventName;
    }
    const happenedAtIso = this.normalizeRateText(source.happenedAtIso);
    if (happenedAtIso) {
      normalized.happenedAtIso = happenedAtIso;
    }
    if (Number.isFinite(Number(source.distanceMetersExact))) {
      normalized.distanceMetersExact = Math.max(0, Math.trunc(Number(source.distanceMetersExact)));
    } else {
      normalized.distanceMetersExact = 0;
    }
    return normalized;
  }
  normalizeRateText(value) {
    return `${value ?? ""}`.trim();
  }
  normalizeRateNumber(value) {
    if (!Number.isFinite(Number(value))) {
      return 0;
    }
    return Math.trunc(Number(value));
  }
  normalizeProfileExperiencesByUserId(value, fallback) {
    if (!value || typeof value !== "object") {
      return __spreadValues({}, fallback);
    }
    const next = {};
    for (const [userId, entries] of Object.entries(value)) {
      if (!userId.trim() || !Array.isArray(entries)) {
        continue;
      }
      next[userId] = entries.filter((entry) => !!entry && typeof entry === "object").map((entry) => ({
        id: `${entry["id"] ?? ""}`.trim(),
        type: `${entry["type"] ?? "Workspace"}`.trim(),
        title: `${entry["title"] ?? ""}`.trim(),
        org: `${entry["org"] ?? ""}`.trim(),
        city: `${entry["city"] ?? ""}`.trim(),
        dateFrom: `${entry["dateFrom"] ?? ""}`.trim(),
        dateTo: `${entry["dateTo"] ?? ""}`.trim(),
        description: `${entry["description"] ?? ""}`.trim()
      })).filter((entry) => entry.id.length > 0);
    }
    return next;
  }
  normalizeContactsByOwnerUserId(value, fallback) {
    if (!value || typeof value !== "object") {
      return __spreadValues({}, fallback);
    }
    const next = {};
    for (const [ownerUserId, contacts] of Object.entries(value)) {
      const normalizedOwnerUserId = ownerUserId.trim();
      if (!normalizedOwnerUserId || !Array.isArray(contacts)) {
        continue;
      }
      const normalizedContacts = contacts.filter((contact) => !!contact && typeof contact === "object").map((contact) => this.normalizeContact(contact)).filter((contact) => Boolean(contact));
      if (normalizedContacts.length > 0) {
        next[normalizedOwnerUserId] = normalizedContacts;
      }
    }
    return next;
  }
  normalizeContact(value) {
    const id = `${value["id"] ?? ""}`.trim();
    const userId = `${value["userId"] ?? ""}`.trim();
    if (!id && !userId) {
      return null;
    }
    return {
      id: id || userId,
      userId,
      name: `${value["name"] ?? ""}`.trim() || "Contact",
      initials: `${value["initials"] ?? ""}`.trim(),
      gender: value["gender"] === "woman" ? "woman" : "man",
      city: `${value["city"] ?? ""}`.trim(),
      avatarUrl: `${value["avatarUrl"] ?? ""}`.trim(),
      headline: `${value["headline"] ?? ""}`.trim(),
      createdAtIso: `${value["createdAtIso"] ?? ""}`.trim(),
      updatedAtIso: `${value["updatedAtIso"] ?? ""}`.trim(),
      methods: (Array.isArray(value["methods"]) ? value["methods"] : []).filter((method) => !!method && typeof method === "object").map((method) => this.normalizeContactMethod(method)).filter((method) => Boolean(method))
    };
  }
  normalizeContactMethod(value) {
    const type = `${value["type"] ?? ""}`.trim();
    const methodType = [
      "phone",
      "sms",
      "whatsapp",
      "email",
      "facebook",
      "instagram",
      "telegram",
      "linkedin",
      "website"
    ].includes(type) ? type : "phone";
    const methodValue = `${value["value"] ?? ""}`.trim();
    if (!methodValue) {
      return null;
    }
    return {
      id: `${value["id"] ?? ""}`.trim(),
      type: methodType,
      value: methodValue
    };
  }
  normalizeIdList(value, fallback) {
    return Array.isArray(value) ? value.map((id) => String(id)) : [...fallback];
  }
  normalizeActivityMembersIdsByOwnerKey(source) {
    const normalizedById = this.normalizeActivityMembersById(source?.byId, {});
    const normalizedIds = this.normalizeIdList(source?.ids, []);
    const next = {};
    const rawIndex = source?.idsByOwnerKey;
    if (rawIndex && typeof rawIndex === "object") {
      for (const [ownerKey, ids] of Object.entries(rawIndex)) {
        if (!Array.isArray(ids) || !ownerKey.trim()) {
          continue;
        }
        next[ownerKey] = ids.map((id) => String(id)).filter((id) => Boolean(normalizedById[id]));
      }
    }
    for (const id of normalizedIds) {
      const record = normalizedById[id];
      const ownerKey = typeof record?.ownerKey === "string" ? record.ownerKey.trim() : "";
      if (!ownerKey) {
        continue;
      }
      const bucket = next[ownerKey] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      next[ownerKey] = bucket;
    }
    return next;
  }
  normalizeAssetRequestsIdsByOwnerKey(source) {
    const normalizedById = this.normalizeAssetRequestsById(source?.byId, {});
    const normalizedIds = this.normalizeIdList(source?.ids, []);
    const next = {};
    const rawIndex = source?.idsByOwnerKey;
    if (rawIndex && typeof rawIndex === "object") {
      for (const [ownerKey, ids] of Object.entries(rawIndex)) {
        if (!Array.isArray(ids) || !ownerKey.trim()) {
          continue;
        }
        next[ownerKey] = ids.map((id) => String(id)).filter((id) => Boolean(normalizedById[id]));
      }
    }
    for (const id of normalizedIds) {
      const record = normalizedById[id];
      const ownerKey = typeof record?.ownerKey === "string" ? record.ownerKey.trim() : "";
      if (!ownerKey) {
        continue;
      }
      const bucket = next[ownerKey] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      next[ownerKey] = bucket;
    }
    return next;
  }
  normalizeActivityResourcesIdsByOwnerKey(source) {
    const normalizedById = this.normalizeActivityResourcesById(source?.byId, {});
    const normalizedIds = this.normalizeIdList(source?.ids, []);
    const next = {};
    const rawIndex = source?.idsByOwnerKey;
    if (rawIndex && typeof rawIndex === "object") {
      for (const [ownerKey, ids] of Object.entries(rawIndex)) {
        if (!Array.isArray(ids) || !ownerKey.trim()) {
          continue;
        }
        next[ownerKey] = ids.map((id) => String(id)).filter((id) => Boolean(normalizedById[id]));
      }
    }
    for (const id of normalizedIds) {
      const record = normalizedById[id];
      const ownerKey = typeof record?.ownerKey === "string" ? record.ownerKey.trim() : "";
      if (!ownerKey) {
        continue;
      }
      const bucket = next[ownerKey] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      next[ownerKey] = bucket;
    }
    return next;
  }
  normalizeActivitySubEventStageRuntimeIdsByOwnerKey(source) {
    const normalizedById = this.normalizeActivitySubEventStageRuntimeById(source?.byId, {});
    const normalizedIds = this.normalizeIdList(source?.ids, []);
    const next = {};
    const rawIndex = source?.idsByOwnerKey;
    if (rawIndex && typeof rawIndex === "object") {
      for (const [ownerKey, ids] of Object.entries(rawIndex)) {
        if (!Array.isArray(ids) || !ownerKey.trim()) {
          continue;
        }
        next[ownerKey] = ids.map((id) => String(id)).filter((id) => Boolean(normalizedById[id]));
      }
    }
    for (const id of normalizedIds) {
      const record = normalizedById[id];
      const ownerKey = typeof record?.ownerKey === "string" ? record.ownerKey.trim() : "";
      if (!ownerKey) {
        continue;
      }
      const bucket = next[ownerKey] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      next[ownerKey] = bucket;
    }
    return next;
  }
  normalizeActivitySubEventGroupsIdsByOwnerKey(source) {
    const normalizedById = this.normalizeActivitySubEventGroupsById(source?.byId, {});
    const normalizedIds = this.normalizeIdList(source?.ids, []);
    const next = {};
    const rawIndex = source?.idsByOwnerKey;
    if (rawIndex && typeof rawIndex === "object") {
      for (const [ownerKey, ids] of Object.entries(rawIndex)) {
        if (!Array.isArray(ids) || !ownerKey.trim()) {
          continue;
        }
        next[ownerKey] = ids.map((id) => String(id)).filter((id) => Boolean(normalizedById[id]));
      }
    }
    for (const id of normalizedIds) {
      const record = normalizedById[id];
      const ownerKey = typeof record?.ownerKey === "string" ? record.ownerKey.trim() : "";
      if (!ownerKey) {
        continue;
      }
      const bucket = next[ownerKey] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      next[ownerKey] = bucket;
    }
    return next;
  }
  normalizeAssetsIdsByOwnerUserId(source) {
    const normalizedById = this.normalizeAssetsById(source?.byId, {});
    const normalizedIds = this.normalizeIdList(source?.ids, []);
    const next = {};
    const rawIndex = source?.idsByOwnerUserId;
    if (rawIndex && typeof rawIndex === "object") {
      for (const [ownerUserId, ids] of Object.entries(rawIndex)) {
        if (!Array.isArray(ids) || !ownerUserId.trim()) {
          continue;
        }
        next[ownerUserId] = ids.map((id) => String(id)).filter((id) => Boolean(normalizedById[id]));
      }
    }
    for (const id of normalizedIds) {
      const record = normalizedById[id];
      const ownerUserId = typeof record?.ownerUserId === "string" ? record.ownerUserId.trim() : "";
      if (!ownerUserId) {
        continue;
      }
      const bucket = next[ownerUserId] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      next[ownerUserId] = bucket;
    }
    return next;
  }
  normalizeUserRatesIdsByRelevantUserId(source) {
    const normalizedById = this.normalizeUserRatesById(source?.byId, {});
    const normalizedIds = this.normalizeIdList(source?.ids, []);
    const next = {};
    const rawIndex = source?.idsByRelevantUserId;
    if (rawIndex && typeof rawIndex === "object") {
      for (const [userId, ids] of Object.entries(rawIndex)) {
        if (!Array.isArray(ids) || !userId.trim()) {
          continue;
        }
        next[userId] = ids.map((id) => String(id)).filter((id) => Boolean(normalizedById[id]));
      }
    }
    for (const id of normalizedIds) {
      const record = normalizedById[id];
      if (!record) {
        continue;
      }
      const relevantUserIds = new Set([record.ownerUserId, record.fromUserId, record.toUserId].map((value) => typeof value === "string" ? value.trim() : "").filter(Boolean));
      for (const userId of relevantUserIds) {
        const bucket = next[userId] ?? [];
        if (!bucket.includes(id)) {
          bucket.push(id);
        }
        next[userId] = bucket;
      }
    }
    for (const ids of Object.values(next)) {
      ids.sort((leftId, rightId) => {
        const left = normalizedById[leftId];
        const right = normalizedById[rightId];
        return this.userRateSortValue(right) - this.userRateSortValue(left);
      });
    }
    return next;
  }
  userRateSortValue(record) {
    const value = record?.happenedAtIso ?? record?.updatedAtIso ?? record?.createdAtIso ?? "";
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  userRateDistanceValue(record) {
    if (Number.isFinite(record?.distanceMetersExact)) {
      return Math.max(0, Math.trunc(Number(record?.distanceMetersExact)));
    }
    return 0;
  }
  userRateRelevanceScore(record) {
    const scoreGiven = Number.isFinite(record?.scoreGiven) ? Math.max(0, Math.round(Number(record?.scoreGiven))) : Number.isFinite(record?.rate) ? Math.max(0, Math.round(Number(record?.rate))) : 0;
    const scoreReceived = Number.isFinite(record?.scoreReceived) ? Math.max(0, Math.round(Number(record?.scoreReceived))) : 0;
    if (record?.displayDirection === "mutual") {
      return scoreGiven + scoreReceived;
    }
    return scoreGiven > 0 ? scoreGiven : 5;
  }
  static \u0275fac = function AppMemoryDb_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppMemoryDb)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppMemoryDb, factory: _AppMemoryDb.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppMemoryDb, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var LocalMemoryDb = class _LocalMemoryDb extends AppMemoryDb {
  get storageScope() {
    return "demo";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275LocalMemoryDb_BaseFactory;
    return function LocalMemoryDb_Factory(__ngFactoryType__) {
      return (\u0275LocalMemoryDb_BaseFactory || (\u0275LocalMemoryDb_BaseFactory = \u0275\u0275getInheritedFactory(_LocalMemoryDb)))(__ngFactoryType__ || _LocalMemoryDb);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LocalMemoryDb, factory: _LocalMemoryDb.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalMemoryDb, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var HttpMemoryDb = class _HttpMemoryDb extends AppMemoryDb {
  get storageScope() {
    return "http";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275HttpMemoryDb_BaseFactory;
    return function HttpMemoryDb_Factory(__ngFactoryType__) {
      return (\u0275HttpMemoryDb_BaseFactory || (\u0275HttpMemoryDb_BaseFactory = \u0275\u0275getInheritedFactory(_HttpMemoryDb)))(__ngFactoryType__ || _HttpMemoryDb);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpMemoryDb, factory: _HttpMemoryDb.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HttpMemoryDb, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/mappers/operator-configuration.mapper.ts
var OperatorConfigurationMapper = class {
  static ADMIN_EMAIL_MAX_COUNT = 32;
  static ADMIN_EMAIL_MAX_LENGTH = 254;
  static SOCIAL_LINK_MAX_COUNT = 12;
  static DATA_CONTROLLER_NAME_MAX_LENGTH = 160;
  static PRIVACY_CONTACT_EMAIL_MAX_LENGTH = 254;
  static PAYMENT_PUBLIC_BASE_URL_MAX_LENGTH = 2048;
  static PAYMENT_MERCHANT_ACCOUNT_MAX_LENGTH = 254;
  static privacyContact(value) {
    const source = value && typeof value === "object" ? value : {};
    const dataControllerName = `${source.dataControllerName ?? ""}`.trim();
    const privacyContactEmail = `${source.privacyContactEmail ?? ""}`.trim().toLowerCase();
    return {
      configured: Boolean(dataControllerName && privacyContactEmail),
      dataControllerName,
      privacyContactEmail
    };
  }
  static privacyContactValidationKey(value) {
    const source = value && typeof value === "object" ? value : {};
    const dataControllerName = `${source.dataControllerName ?? ""}`.trim();
    const privacyContactEmail = `${source.privacyContactEmail ?? ""}`.trim().toLowerCase();
    if (Boolean(dataControllerName) !== Boolean(privacyContactEmail)) {
      return "operator.configuration.privacy.contact.incomplete";
    }
    if (!dataControllerName && !privacyContactEmail) {
      return null;
    }
    if (dataControllerName.length > this.DATA_CONTROLLER_NAME_MAX_LENGTH || /[\u0000-\u001f\u007f-\u009f]/.test(dataControllerName)) {
      return "operator.configuration.privacy.controller.invalid";
    }
    if (privacyContactEmail.length > this.PRIVACY_CONTACT_EMAIL_MAX_LENGTH || /[\u0000-\u001f\u007f-\u009f]/.test(privacyContactEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyContactEmail)) {
      return "operator.configuration.privacy.email.invalid";
    }
    return null;
  }
  static adminEmails(value) {
    const source = Array.isArray(value) ? value.map((item) => `${item ?? ""}`) : `${value ?? ""}`.split(/[,;\r\n]+/);
    const unique = /* @__PURE__ */ new Set();
    const normalized = [];
    for (const item of source) {
      const email = item.trim().toLowerCase();
      if (!email || unique.has(email)) {
        continue;
      }
      unique.add(email);
      normalized.push(email);
    }
    return normalized;
  }
  static adminEmailInput(value) {
    return this.adminEmails(value).join(", ");
  }
  static adminEmailValidationKey(value) {
    const emails = this.adminEmails(value);
    if (emails.length > this.ADMIN_EMAIL_MAX_COUNT) {
      return "operator.configuration.admin.email.too.many";
    }
    return emails.some((email) => email.length > this.ADMIN_EMAIL_MAX_LENGTH || !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email)) ? "operator.configuration.admin.email.invalid" : null;
  }
  static adminEmailsEqual(left, right) {
    const normalizedLeft = this.adminEmails(left);
    const normalizedRight = this.adminEmails(right);
    return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((email, index) => email === normalizedRight[index]);
  }
  static socialLinks(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    const links = [];
    const signatures = /* @__PURE__ */ new Set();
    for (const item of value) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const source = item;
      const provider = `${source.provider ?? ""}`.trim().toLowerCase().slice(0, 32);
      const label = `${source.label ?? ""}`.trim().slice(0, 80);
      const url = this.socialUrl(source.url);
      const icon = `${source.icon ?? ""}`.trim().slice(0, 64) || null;
      const handle = `${source.handle ?? ""}`.trim().slice(0, 80) || null;
      const signature = `${provider}\0${url.toLowerCase()}`;
      if (!provider || !label || !url || signatures.has(signature)) {
        continue;
      }
      signatures.add(signature);
      links.push({ provider, label, url, icon, handle });
      if (links.length >= this.SOCIAL_LINK_MAX_COUNT) {
        break;
      }
    }
    return links;
  }
  static socialLinksValidationKey(value) {
    if (!Array.isArray(value)) {
      return "operator.configuration.social.link.invalid";
    }
    if (value.length > this.SOCIAL_LINK_MAX_COUNT) {
      return "operator.configuration.social.link.too.many";
    }
    const providers = /* @__PURE__ */ new Map();
    const urls = /* @__PURE__ */ new Map();
    const exactItems = /* @__PURE__ */ new Set();
    for (const item of value) {
      if (!item || typeof item !== "object") {
        return "operator.configuration.social.link.invalid";
      }
      const source = item;
      const provider = `${source.provider ?? ""}`.trim().toLowerCase();
      const label = `${source.label ?? ""}`.trim();
      const rawUrl = `${source.url ?? ""}`.trim();
      const icon = `${source.icon ?? ""}`.trim();
      const handle = `${source.handle ?? ""}`.trim();
      const url = this.socialUrl(rawUrl);
      if (!provider || provider.length > 32 || !/^[a-z0-9][a-z0-9._-]*$/i.test(provider) || !label || label.length > 80 || !url || rawUrl.length > 2048 || icon.length > 64 || handle.length > 80) {
        return "operator.configuration.social.link.invalid";
      }
      const canonicalUrl = url.toLowerCase();
      const exactItem = JSON.stringify({
        provider,
        label,
        url: canonicalUrl,
        icon,
        handle
      });
      if (exactItems.has(exactItem)) {
        continue;
      }
      exactItems.add(exactItem);
      const existingUrl = providers.get(provider);
      const existingProvider = urls.get(canonicalUrl);
      if (existingUrl && existingUrl !== exactItem || existingProvider && existingProvider !== exactItem) {
        return "operator.configuration.social.provider.duplicate";
      }
      providers.set(provider, exactItem);
      urls.set(canonicalUrl, exactItem);
    }
    return null;
  }
  static socialLinksEqual(left, right) {
    return JSON.stringify(this.socialLinks(left)) === JSON.stringify(this.socialLinks(right));
  }
  static paymentPublicBaseUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized || normalized.length > this.PAYMENT_PUBLIC_BASE_URL_MAX_LENGTH) {
      return "";
    }
    try {
      const url = new URL(normalized);
      const loopbackHost = [
        "localhost",
        "127.0.0.1",
        "::1",
        "[::1]"
      ].includes(url.hostname.toLowerCase());
      if (url.protocol !== "https:" && !(url.protocol === "http:" && loopbackHost) || !url.hostname || url.username || url.password || url.search || url.hash || /(?:^|\/)\.\.(?:\/|$)/.test(url.pathname)) {
        return "";
      }
      return url.toString().replace(/\/+$/, "");
    } catch {
      return "";
    }
  }
  static paymentMerchantAccount(value) {
    return `${value ?? ""}`.trim();
  }
  static paymentValidationKey(value) {
    const source = value && typeof value === "object" ? value : {};
    const providerId = `${source.providerId ?? ""}`.trim().toLowerCase();
    if (!providerId) {
      return null;
    }
    const publicBaseUrl = `${source.publicBaseUrl ?? ""}`.trim();
    if (!publicBaseUrl) {
      return "operator.configuration.payment.public.url.required";
    }
    if (!this.paymentPublicBaseUrl(publicBaseUrl)) {
      return "operator.configuration.payment.public.url.invalid";
    }
    if (providerId !== "barion") {
      return null;
    }
    const merchantAccount = this.paymentMerchantAccount(source.merchantAccount);
    if (!merchantAccount) {
      return "operator.configuration.payment.merchant.account.required";
    }
    return merchantAccount.length > this.PAYMENT_MERCHANT_ACCOUNT_MAX_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchantAccount) ? "operator.configuration.payment.merchant.account.invalid" : null;
  }
  static socialUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    try {
      const url = new URL(normalized);
      return url.protocol === "https:" && !url.username && !url.password && Boolean(url.hostname) ? url.toString() : "";
    } catch {
      return "";
    }
  }
};

// src/app/shared/core/local/source/mappers/operator-registry.mapper.ts
var LocalOperatorRegistryMapper = class {
  static GROUP_ORDER = {
    FOUNDER: 0,
    CLAIMED: 1,
    UNCLAIMED: 2
  };
  static toStatusDto(record) {
    return structuredClone(record.status);
  }
  static toRecord(status, extras, inspectionToken = null) {
    return {
      seedVersion: extras.seedVersion.trim(),
      status: structuredClone(status),
      inspectionToken: inspectionToken?.trim() || null,
      ledger: [...structuredClone(extras.ledger)],
      groupLinks: [...structuredClone(extras.groupLinks)],
      claimIdentity: structuredClone(extras.claimIdentity),
      auditHistory: [...structuredClone(extras.auditHistory)],
      leaderboard: this.deriveLeaderboard(extras.ledger, extras.groupLinks),
      claimStatus: structuredClone(extras.claimStatus),
      claimVerificationRequest: structuredClone(extras.claimVerificationRequest ?? null),
      groupingTokens: [...structuredClone(extras.groupingTokens ?? [])],
      deploymentUpdate: structuredClone(extras.deploymentUpdate),
      configuration: structuredClone(extras.configuration),
      tlsConfiguration: structuredClone(extras.tlsConfiguration ?? this.defaultTlsConfiguration()),
      revenue: structuredClone(extras.revenue),
      settlements: [...structuredClone(extras.settlements)],
      community: structuredClone(extras.community)
    };
  }
  static withStatus(record, status, inspectionToken = record.inspectionToken) {
    return __spreadProps(__spreadValues({}, structuredClone(record)), {
      status: structuredClone(status),
      inspectionToken: inspectionToken?.trim() || null
    });
  }
  static toSeedRecord(memory, initialRecord) {
    const existing = memory.registryRecord;
    if (!existing) {
      return structuredClone(initialRecord);
    }
    const refreshSeedOwnedData = `${existing.seedVersion ?? ""}`.trim() !== initialRecord.seedVersion;
    const migrateDefaultTheme = initialRecord.seedVersion === "operator-workspace-v8" && (`${existing.seedVersion ?? ""}`.trim() === "operator-workspace-v6" && existing.configuration?.branding?.themePreset === "AURORA" || `${existing.seedVersion ?? ""}`.trim() === "operator-workspace-v7" && existing.configuration?.branding?.themePreset === "OCEAN");
    const storedLedger = existing.ledger?.length ? structuredClone(existing.ledger) : existing.leaderboard?.length ? this.legacyLedger(existing.leaderboard, initialRecord.ledger) : structuredClone(initialRecord.ledger);
    const ledger = this.normalizeLedgerEligibility(storedLedger, refreshSeedOwnedData ? initialRecord.ledger : []);
    const groupLinks = existing.groupLinks?.length ? structuredClone(existing.groupLinks) : structuredClone(initialRecord.groupLinks);
    return {
      seedVersion: initialRecord.seedVersion,
      status: __spreadProps(__spreadValues(__spreadValues({}, structuredClone(initialRecord.status)), structuredClone(existing.status)), {
        registryOptions: existing.status.registryOptions?.length ? structuredClone(existing.status.registryOptions) : structuredClone(initialRecord.status.registryOptions)
      }),
      inspectionToken: existing.inspectionToken?.trim() || null,
      ledger,
      groupLinks,
      claimIdentity: structuredClone(existing.claimIdentity ?? initialRecord.claimIdentity),
      auditHistory: structuredClone(existing.auditHistory?.length ? existing.auditHistory : initialRecord.auditHistory),
      leaderboard: this.deriveLeaderboard(ledger, groupLinks),
      claimStatus: this.normalizeClaimStatus(existing.claimStatus, initialRecord.claimStatus),
      claimVerificationRequest: structuredClone(existing.claimVerificationRequest ?? initialRecord.claimVerificationRequest),
      groupingTokens: structuredClone(existing.groupingTokens ?? []),
      deploymentUpdate: structuredClone(existing.deploymentUpdate ? __spreadProps(__spreadValues(__spreadValues({}, structuredClone(initialRecord.deploymentUpdate)), structuredClone(existing.deploymentUpdate)), {
        progress: structuredClone(existing.deploymentUpdate.progress ?? initialRecord.deploymentUpdate.progress)
      }) : initialRecord.deploymentUpdate),
      configuration: this.normalizeConfiguration(existing.configuration, initialRecord.configuration, refreshSeedOwnedData, migrateDefaultTheme),
      tlsConfiguration: this.normalizeTlsConfiguration(existing.tlsConfiguration, initialRecord.tlsConfiguration),
      revenue: structuredClone(!refreshSeedOwnedData && existing.revenue ? existing.revenue : initialRecord.revenue),
      settlements: structuredClone(!refreshSeedOwnedData && existing.settlements ? existing.settlements : initialRecord.settlements),
      community: existing.community ? __spreadProps(__spreadValues(__spreadValues({}, structuredClone(initialRecord.community)), structuredClone(existing.community)), {
        providers: structuredClone(existing.community.providers ?? initialRecord.community.providers),
        announcements: structuredClone(existing.community.announcements ?? initialRecord.community.announcements)
      }) : structuredClone(initialRecord.community)
    };
  }
  static seedRecordChanged(current, next) {
    return !current || JSON.stringify(current) !== JSON.stringify(next);
  }
  static normalizeConfiguration(existing, initial, refreshSeedOwnedData, migrateDefaultTheme = false) {
    if (!existing) {
      return structuredClone(initial);
    }
    const legacy = existing;
    const branding = legacy.branding ?? {};
    const payment = legacy.payment ?? {};
    const availableProviders = structuredClone(refreshSeedOwnedData ? initial.payment.availableProviders : payment.availableProviders ?? initial.payment.availableProviders);
    const requestedProviderId = `${payment.providerId ?? (payment.provider && payment.provider !== "NONE" ? payment.provider : initial.payment.providerId) ?? ""}`.trim().toLowerCase();
    const providerId = availableProviders.find((provider) => provider.id.trim().toLowerCase() === requestedProviderId)?.id ?? null;
    return {
      capability: legacy.capability ?? initial.capability,
      unavailableReason: legacy.unavailableReason ?? initial.unavailableReason,
      adminEmails: OperatorConfigurationMapper.adminEmails(legacy.adminEmails ?? initial.adminEmails),
      privacyContact: OperatorConfigurationMapper.privacyContact(legacy.privacyContact ?? initial.privacyContact),
      socialLinks: OperatorConfigurationMapper.socialLinks(legacy.socialLinks ?? initial.socialLinks),
      branding: {
        productName: branding.productName ?? initial.branding.productName,
        homeLabel: branding.homeLabel ?? branding.landingLabel ?? initial.branding.homeLabel,
        logoUrl: branding.logoUrl ?? (branding.icon === "HEART_PNG" ? "assets/logo/heart.png" : initial.branding.logoUrl),
        logoCharacterIndex: branding.logoCharacterIndex ?? initial.branding.logoCharacterIndex,
        themePreset: (migrateDefaultTheme ? initial.branding.themePreset : branding.themePreset) ?? initial.branding.themePreset,
        revision: branding.revision ?? initial.branding.revision
      },
      payment: {
        availableProviders,
        providerId,
        publicBaseUrl: providerId ? OperatorConfigurationMapper.paymentPublicBaseUrl(payment.publicBaseUrl) || null : null,
        merchantAccount: providerId ? OperatorConfigurationMapper.paymentMerchantAccount(payment.merchantAccount) || null : null,
        credentialConfigured: providerId ? payment.credentialConfigured ?? initial.payment.credentialConfigured : false,
        credentialMask: providerId ? payment.credentialMask ?? initial.payment.credentialMask : null
      },
      firebase: __spreadProps(__spreadValues(__spreadValues({}, structuredClone(initial.firebase)), structuredClone(legacy.firebase ?? {})), {
        publicConfiguration: __spreadProps(__spreadValues(__spreadValues({}, structuredClone(initial.firebase.publicConfiguration)), structuredClone(legacy.firebase?.publicConfiguration ?? {})), {
          projectId: legacy.firebase?.projectId ?? initial.firebase.projectId
        }),
        authenticationCredentialConfigured: legacy.firebase?.authenticationCredentialConfigured ?? legacy.firebaseAuthenticationConfigured ?? initial.firebase.authenticationCredentialConfigured,
        messagingCredentialConfigured: legacy.firebase?.messagingCredentialConfigured ?? legacy.firebaseMessagingConfigured ?? initial.firebase.messagingCredentialConfigured
      }),
      updatedAt: legacy.updatedAt ?? initial.updatedAt
    };
  }
  static normalizeTlsConfiguration(existing, initial) {
    const fallback = initial ?? this.defaultTlsConfiguration();
    if (!existing) {
      return structuredClone(fallback);
    }
    return {
      capability: "AVAILABLE",
      unavailableReason: null,
      enabled: existing.enabled === true,
      mode: existing.mode === "MANUAL" ? "MANUAL" : "AUTOMATIC",
      domain: `${existing.domain ?? ""}`.trim().toLowerCase(),
      contactEmail: `${existing.contactEmail ?? ""}`.trim().toLowerCase(),
      autoRenew: existing.mode !== "MANUAL" && existing.autoRenew !== false,
      certificateConfigured: existing.certificateConfigured === true,
      certificateIssuer: `${existing.certificateIssuer ?? ""}`.trim() || null,
      certificateExpiresAt: `${existing.certificateExpiresAt ?? ""}`.trim() || null,
      updatedAt: `${existing.updatedAt ?? ""}`.trim() || null
    };
  }
  static defaultTlsConfiguration() {
    return {
      capability: "AVAILABLE",
      unavailableReason: null,
      enabled: false,
      mode: "AUTOMATIC",
      domain: "",
      contactEmail: "",
      autoRenew: true,
      certificateConfigured: false,
      certificateIssuer: null,
      certificateExpiresAt: null,
      updatedAt: null
    };
  }
  static normalizeClaimStatus(existing, initial) {
    if (!existing) {
      return structuredClone(initial);
    }
    return __spreadProps(__spreadValues(__spreadValues({}, structuredClone(initial)), structuredClone(existing)), {
      verificationCapability: existing.verificationCapability ?? "AVAILABLE",
      verificationUnavailableReason: existing.verificationUnavailableReason ?? null,
      verificationStatus: existing.verificationStatus ?? (existing.claimed ? "VERIFIED" : "NOT_SUBMITTED"),
      verificationSubmittedAt: existing.verificationSubmittedAt ?? existing.claimedAt ?? null,
      legalName: existing.legalName ?? existing.claimantName ?? null,
      eligibilityStatus: this.claimEligibilityStatus(existing)
    });
  }
  static toInspectionDto(record) {
    const draft = record.status.draftInspection;
    const inspectionToken = record.inspectionToken?.trim() ?? "";
    if (!draft || !inspectionToken) {
      return null;
    }
    return {
      inspectionToken,
      expiresAt: draft.expiresAt,
      baseUrl: draft.baseUrl,
      simulation: true,
      registryIdentity: {
        identityEndpoint: `${draft.baseUrl.replace(/\/+$/, "")}/v1/registry/identity`,
        protocolVersion: "1",
        registryScope: draft.registryScope
      }
    };
  }
  static toLeaderboardPage(record, query) {
    const pageSize = Math.max(1, Math.min(100, Math.trunc(Number(query.pageSize) || 20)));
    const cursorOffset = this.cursorOffset(query.cursor);
    const ordered = this.recalculateLeaderboard(this.withCurrentClaimVerification(record.leaderboard, record.claimStatus));
    const items = ordered.slice(cursorOffset, cursorOffset + pageSize);
    const nextOffset = cursorOffset + items.length;
    return {
      items: structuredClone(items),
      total: ordered.length,
      nextCursor: nextOffset < ordered.length ? `operator:${nextOffset}` : null,
      context: {
        snapshotBoundary: null,
        groupSummaries: ["FOUNDER", "CLAIMED", "UNCLAIMED"].map((group) => {
          const groupItems = ordered.filter((item) => item.group === group);
          return {
            group,
            itemCount: groupItems.length,
            verifiedWeight: groupItems.reduce((total, item) => total + Math.max(0, item.verifiedWeight), 0),
            sharePercent: groupItems.reduce((total, item) => total + Math.max(0, item.sharePercent), 0)
          };
        })
      }
    };
  }
  static toLeaderboardDeploymentPage(record, groupId, query) {
    const normalizedGroupId = groupId.trim();
    const pageSize = Math.max(1, Math.min(100, Math.trunc(Number(query.pageSize) || 20)));
    const groupIdByNodeId = new Map(record.groupLinks.map((link) => [link.nodeId, link.operatorGroupId]));
    const deployments = record.ledger.filter((entry) => {
      const nodeId = entry.nodeId?.trim() ?? "";
      return entry.active !== false && entry.claimed && !entry.founder && Boolean(nodeId) && (groupIdByNodeId.get(nodeId) ?? `isolated:${nodeId}`) === normalizedGroupId;
    }).sort((left, right) => Math.max(0, Number(right.verifiedWeight) || 0) - Math.max(0, Number(left.verifiedWeight) || 0) || `${left.nodeId ?? left.id}`.localeCompare(`${right.nodeId ?? right.id}`));
    const groupEntry = this.recalculateLeaderboard(this.withCurrentClaimVerification(record.leaderboard, record.claimStatus)).find((entry) => entry.group === "CLAIMED" && entry.operatorGroupId === normalizedGroupId);
    const eligibleGroupWeight = deployments.reduce((total, entry) => total + (this.ledgerEligibilityStatus(entry) === "ACTIVE" ? Math.max(0, Number(entry.verifiedWeight) || 0) : 0), 0);
    const groupSharePercent = Math.max(0, Number(groupEntry?.sharePercent) || 0);
    const explicitOwnerNodeId = record.claimIdentity.operatorGroupId === normalizedGroupId ? record.claimIdentity.nodeId.trim() : "";
    const ownerNodeId = deployments.some((entry) => entry.nodeId === explicitOwnerNodeId) ? explicitOwnerNodeId : deployments[0]?.nodeId?.trim() ?? "";
    const claimState = this.leaderboardDeploymentClaimState(record, normalizedGroupId);
    const rows = deployments.map((entry) => {
      const deploymentId = entry.nodeId?.trim() || entry.id.trim();
      const verifiedWeight = Math.max(0, Number(entry.verifiedWeight) || 0);
      const eligibilityStatus = this.ledgerEligibilityStatus(entry);
      return {
        deploymentId,
        groupId: normalizedGroupId,
        claimState,
        eligibilityStatus,
        membershipState: deploymentId === ownerNodeId ? "owner" : "linked",
        verifiedWeight,
        sharePercent: eligibilityStatus === "ACTIVE" && eligibleGroupWeight > 0 ? groupSharePercent * verifiedWeight / eligibleGroupWeight : 0
      };
    });
    const cursorOffset = this.deploymentCursorOffset(normalizedGroupId, query.cursor);
    const items = rows.slice(cursorOffset, cursorOffset + pageSize);
    const nextOffset = cursorOffset + items.length;
    return {
      items: structuredClone(items),
      total: rows.length,
      nextCursor: nextOffset < rows.length ? `operator-deployments:${encodeURIComponent(normalizedGroupId)}:${nextOffset}` : null
    };
  }
  static recalculateLeaderboard(entries) {
    const cloned = structuredClone(entries);
    const founderUnits = cloned.filter((item) => item.group === "FOUNDER").reduce((total, item) => total + Math.max(0, Number(item.verifiedWeight) || 0), 0);
    const deploymentWeight = cloned.filter((item) => item.group !== "FOUNDER").reduce((total, item) => total + Math.max(0, Number(item.verifiedWeight) || 0), 0);
    const claimedWeight = cloned.filter((item) => item.group === "CLAIMED" && (item.claimVerificationStatus === "PENDING_REVIEW" || item.eligibilityStatus === "ACTIVE" || item.eligibilityStatus === "PARTIALLY_SUSPENDED") && item.claimVerificationStatus !== "REJECTED").reduce((total, item) => total + this.displayLocalWeight(item), 0);
    const totalUnits = founderUnits + deploymentWeight;
    const founderShare = totalUnits > 0 ? Math.max(10, founderUnits / totalUnits * 100) : 100;
    const operatorPool = Math.max(0, 100 - founderShare);
    return cloned.map((item) => {
      const weight = Math.max(0, Number(item.verifiedWeight) || 0);
      const claimedShareEligible = item.group === "CLAIMED" && (item.claimVerificationStatus === "PENDING_REVIEW" || item.eligibilityStatus === "ACTIVE" || item.eligibilityStatus === "PARTIALLY_SUSPENDED") && item.claimVerificationStatus !== "REJECTED";
      const sharePercent = item.group === "FOUNDER" ? founderUnits > 0 ? founderShare * weight / founderUnits : 0 : claimedShareEligible && claimedWeight > 0 ? operatorPool * this.displayLocalWeight(item) / claimedWeight : 0;
      return __spreadProps(__spreadValues({}, item), {
        verifiedWeight: weight,
        sharePercent
      });
    }).sort((left, right) => this.GROUP_ORDER[left.group] - this.GROUP_ORDER[right.group] || right.sharePercent - left.sharePercent || right.verifiedWeight - left.verifiedWeight || left.label.localeCompare(right.label));
  }
  static withCurrentClaimVerification(entries, claimStatus) {
    const operatorGroupId = claimStatus.operatorGroupId?.trim() ?? "";
    if (!operatorGroupId || claimStatus.verificationStatus !== "PENDING_REVIEW") {
      return Array.from(entries, (entry) => structuredClone(entry));
    }
    return entries.map((entry) => entry.group === "CLAIMED" && entry.operatorGroupId === operatorGroupId ? __spreadProps(__spreadValues({}, structuredClone(entry)), {
      claimVerificationStatus: "PENDING_REVIEW"
    }) : structuredClone(entry));
  }
  static deriveLeaderboard(ledger, groupLinks) {
    const groupIdByNodeId = new Map(groupLinks.map((link) => [link.nodeId, link.operatorGroupId]));
    const rows = [];
    const claimedGroups = /* @__PURE__ */ new Map();
    for (const entry of ledger) {
      if (entry.active === false) {
        continue;
      }
      if (entry.founder || !entry.claimed || !entry.nodeId) {
        rows.push({
          id: entry.id,
          nodeId: entry.nodeId,
          label: entry.label,
          group: entry.founder ? "FOUNDER" : "UNCLAIMED",
          verifiedWeight: entry.verifiedWeight,
          sharePercent: 0,
          claimed: entry.claimed,
          claimantUserId: entry.claimantUserId,
          claimantName: entry.claimantName,
          claimantAvatarUrl: entry.claimantAvatarUrl,
          operatorGroupId: null,
          deploymentCount: 1,
          eligibilityStatus: entry.founder ? "ACTIVE" : "INACTIVE"
        });
        continue;
      }
      const operatorGroupId = groupIdByNodeId.get(entry.nodeId) ?? `isolated:${entry.nodeId}`;
      const groupEntries = claimedGroups.get(operatorGroupId) ?? [];
      groupEntries.push(entry);
      claimedGroups.set(operatorGroupId, groupEntries);
    }
    for (const [operatorGroupId, entries] of claimedGroups) {
      const primary = entries[0];
      rows.push({
        id: `claimed-group:${operatorGroupId}`,
        nodeId: entries.length === 1 ? primary.nodeId : null,
        label: primary.claimantName || primary.label,
        group: "CLAIMED",
        verifiedWeight: entries.reduce((total, entry) => total + Math.max(0, entry.verifiedWeight), 0),
        eligibleWeight: entries.reduce((total, entry) => total + (this.ledgerEligibilityStatus(entry) === "ACTIVE" ? Math.max(0, entry.verifiedWeight) : 0), 0),
        sharePercent: 0,
        claimed: true,
        claimantUserId: primary.claimantUserId,
        claimantName: primary.claimantName,
        claimantAvatarUrl: primary.claimantAvatarUrl,
        operatorGroupId,
        deploymentCount: entries.length,
        eligibilityStatus: this.groupEligibilityStatus(entries)
      });
    }
    return this.recalculateLeaderboard(rows);
  }
  static cursorOffset(cursor) {
    const match = /^operator:(\d+)$/.exec(`${cursor ?? ""}`.trim());
    return match ? Math.max(0, Number(match[1]) || 0) : 0;
  }
  static deploymentCursorOffset(groupId, cursor) {
    const prefix = `operator-deployments:${encodeURIComponent(groupId)}:`;
    const value = `${cursor ?? ""}`.trim();
    if (!value.startsWith(prefix)) {
      return 0;
    }
    const offset = value.slice(prefix.length);
    return /^\d+$/.test(offset) ? Math.max(0, Number(offset) || 0) : 0;
  }
  static leaderboardDeploymentClaimState(record, groupId) {
    if (record.claimStatus.operatorGroupId?.trim() !== groupId) {
      return "claimed";
    }
    switch (record.claimStatus.verificationStatus) {
      case "PENDING_REVIEW":
        return "pending-review";
      case "APPROVED":
      case "VERIFIED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "WITHDRAWN":
        return "withdrawn";
      default:
        return "claimed";
    }
  }
  static legacyLedger(leaderboard, fallback) {
    const measuredAt = fallback[0]?.measuredAt ?? (/* @__PURE__ */ new Date(0)).toISOString();
    const fallbackEligibilityById = new Map(fallback.map((entry) => [entry.id, entry.eligibilityStatus]));
    return leaderboard.map((entry) => ({
      id: entry.id,
      nodeId: entry.nodeId,
      label: entry.label,
      active: true,
      founder: entry.group === "FOUNDER",
      verifiedWeight: entry.verifiedWeight,
      claimed: entry.claimed,
      eligibilityStatus: entry.group === "FOUNDER" ? "ACTIVE" : entry.group === "UNCLAIMED" || !entry.claimed ? "INACTIVE" : this.deploymentEligibilityStatus(entry.eligibilityStatus, fallbackEligibilityById.get(entry.id)),
      claimantUserId: entry.claimantUserId ?? null,
      claimantName: entry.claimantName ?? null,
      claimantAvatarUrl: entry.claimantAvatarUrl ?? null,
      measuredAt,
      claimedAt: entry.claimed ? measuredAt : null
    }));
  }
  static normalizeLedgerEligibility(ledger, seedFallback = []) {
    const fallbackById = new Map(seedFallback.map((entry) => [entry.id, entry.eligibilityStatus]));
    return ledger.map((entry) => __spreadProps(__spreadValues({}, entry), {
      eligibilityStatus: this.ledgerEligibilityStatus(__spreadProps(__spreadValues({}, entry), {
        eligibilityStatus: entry.eligibilityStatus ?? fallbackById.get(entry.id) ?? "INACTIVE"
      }))
    }));
  }
  static ledgerEligibilityStatus(entry) {
    if (entry.founder) {
      return "ACTIVE";
    }
    if (entry.active === false || !entry.claimed) {
      return "INACTIVE";
    }
    switch (entry.eligibilityStatus) {
      case "ACTIVE":
      case "SUSPENDED":
      case "INACTIVE":
        return entry.eligibilityStatus;
      default:
        return "INACTIVE";
    }
  }
  static deploymentEligibilityStatus(value, fallback) {
    switch (value) {
      case "ACTIVE":
      case "SUSPENDED":
      case "INACTIVE":
        return value;
      case "PARTIALLY_SUSPENDED":
        return fallback ?? "SUSPENDED";
      default:
        return fallback ?? "INACTIVE";
    }
  }
  static groupEligibilityStatus(entries) {
    const active = entries.filter((entry) => this.ledgerEligibilityStatus(entry) === "ACTIVE").length;
    const suspended = entries.filter((entry) => this.ledgerEligibilityStatus(entry) === "SUSPENDED").length;
    if (active > 0 && suspended > 0) {
      return "PARTIALLY_SUSPENDED";
    }
    if (active > 0) {
      return "ACTIVE";
    }
    if (suspended > 0) {
      return "SUSPENDED";
    }
    return "INACTIVE";
  }
  static eligibleLocalWeight(entry) {
    if (entry.eligibilityStatus === "ACTIVE") {
      return Math.max(0, Number(entry.verifiedWeight) || 0);
    }
    if (entry.eligibilityStatus !== "PARTIALLY_SUSPENDED") {
      return 0;
    }
    return Math.max(0, Math.min(Number(entry.verifiedWeight) || 0, Number(entry.eligibleWeight) || 0));
  }
  static displayLocalWeight(entry) {
    if (entry.claimVerificationStatus === "PENDING_REVIEW") {
      return Math.max(0, Number(entry.verifiedWeight) || 0);
    }
    return this.eligibleLocalWeight(entry);
  }
  static claimEligibilityStatus(status) {
    switch (status.eligibilityStatus) {
      case "ACTIVE":
      case "SUSPENDED":
      case "INACTIVE":
        return status.eligibilityStatus;
      default:
        return "INACTIVE";
    }
  }
};

// src/app/shared/core/local/seed/builders/operator-registry-seed.builder.ts
var SeedOperatorRegistryBuilder = class {
  static SEED_VERSION = "operator-workspace-v8";
  static PRIMARY_BASE_URL = "https://registry.myscoutee.invalid";
  static PRIMARY_SCOPE = "demo:primary";
  static buildInitialRecord(now = /* @__PURE__ */ new Date()) {
    const nowIso = now.toISOString();
    return LocalOperatorRegistryMapper.toRecord(this.buildInitialStatus(now), {
      seedVersion: this.SEED_VERSION,
      ledger: this.buildInitialLedger(now),
      groupLinks: [
        {
          nodeId: "node-campus",
          operatorGroupId: "operator-group-campus",
          linkedAt: nowIso
        },
        {
          nodeId: "node-campus-east",
          operatorGroupId: "operator-group-campus",
          linkedAt: nowIso
        },
        {
          nodeId: "node-city",
          operatorGroupId: "operator-group-city",
          linkedAt: nowIso
        },
        {
          nodeId: "node-club",
          operatorGroupId: "operator-group-club",
          linkedAt: nowIso
        }
      ],
      claimIdentity: {
        nodeId: "node-operator-demo",
        claimantUserId: "operator-demo-dev",
        claimantName: "Demo Operator",
        claimantAvatarUrl: null,
        operatorGroupId: "operator-group-demo"
      },
      auditHistory: [
        {
          id: "audit-seed-founder",
          kind: "SEED",
          at: nowIso,
          nodeId: null,
          detail: "Founder contribution model initialized."
        },
        {
          id: "audit-seed-demo-ledger",
          kind: "SEED",
          at: nowIso,
          nodeId: "node-operator-demo",
          detail: "Explore demo measurement ledger initialized."
        }
      ],
      claimStatus: {
        claimed: false,
        claimedAt: null,
        claimantUserId: null,
        claimantName: null,
        claimantAvatarUrl: null,
        operatorGroupId: null,
        sharePercent: 0,
        verificationCapability: "AVAILABLE",
        verificationUnavailableReason: null,
        verificationStatus: "NOT_SUBMITTED",
        verificationSubmittedAt: null,
        legalName: null,
        eligibilityStatus: "INACTIVE"
      },
      claimVerificationRequest: null,
      deploymentUpdate: {
        currentVersion: "1.0.0",
        availableVersion: "1.1.0",
        updateAvailable: true,
        lastCheckedAt: nowIso,
        lastUpdatedAt: null,
        progress: {
          phase: "IDLE",
          bytesDownloaded: 0,
          bytesTotal: 18874368,
          percent: 0,
          message: null,
          updatedAt: nowIso
        }
      },
      configuration: {
        capability: "AVAILABLE",
        unavailableReason: null,
        adminEmails: [],
        privacyContact: {
          configured: true,
          dataControllerName: "MyScoutee Explore Operator",
          privacyContactEmail: "privacy@explore.myscoutee.test"
        },
        socialLinks: [
          {
            provider: "instagram",
            label: "Instagram",
            url: "https://www.instagram.com/myscoutee",
            icon: "photo_camera",
            handle: "@myscoutee"
          },
          {
            provider: "youtube",
            label: "YouTube",
            url: "https://www.youtube.com/@myscoutee",
            icon: "smart_display",
            handle: "@myscoutee"
          },
          {
            provider: "facebook",
            label: "Facebook",
            url: "https://www.facebook.com/myscoutee",
            icon: "public",
            handle: "MyScoutee"
          }
        ],
        branding: {
          productName: "MyScoutee",
          homeLabel: "Your preferences come first",
          logoUrl: "assets/logo/heart.webp",
          logoCharacterIndex: 0,
          themePreset: "VIOLET",
          revision: 0
        },
        payment: {
          availableProviders: [
            {
              id: "stripe",
              label: "Stripe",
              logoUrl: "assets/payment-providers/stripe.svg",
              logoAlt: "Stripe",
              palette: "violet"
            },
            {
              id: "barion",
              label: "Barion",
              logoUrl: "assets/payment-providers/barion.svg",
              logoAlt: "Barion",
              palette: "blue"
            }
          ],
          providerId: null,
          publicBaseUrl: null,
          merchantAccount: null,
          credentialConfigured: false,
          credentialMask: null
        },
        firebase: {
          projectId: "myscoutee-explore",
          authenticationCredentialConfigured: false,
          messagingCredentialConfigured: false,
          publicConfiguration: {
            revision: 0,
            apiKey: "",
            authDomain: "",
            projectId: "myscoutee-explore",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: null,
            vapidKey: null
          },
          active: false,
          readyToActivate: false,
          authenticationTestedAt: null,
          messagingTestedAt: null,
          activatedAt: null
        },
        updatedAt: nowIso
      },
      revenue: this.buildInitialRevenue(now),
      settlements: this.buildInitialSettlements(),
      community: {
        availability: "AVAILABLE",
        updatedAt: nowIso,
        providers: [
          {
            id: "discord",
            name: "Discord",
            purpose: "operator.community.provider.discord.purpose",
            url: "https://discord.com/",
            configured: false,
            available: true
          },
          {
            id: "discourse",
            name: "Discourse",
            purpose: "operator.community.provider.discourse.purpose",
            url: "https://www.discourse.org/",
            configured: false,
            available: true
          }
        ],
        announcements: [
          {
            id: "deployment-release-1.1.0",
            kind: "UPDATE",
            severity: "SUCCESS",
            status: "PUBLISHED",
            unread: true,
            title: "operator.community.announcement.update.1_1_0.title",
            body: "operator.community.announcement.update.1_1_0.body",
            publishedAt: nowIso,
            expiresAt: null,
            links: [
              {
                id: "release-notes",
                label: "operator.community.announcement.link.release.notes",
                url: "https://github.com/fssrepository/myscoutee/releases/tag/v1.1.0",
                verified: true
              }
            ],
            update: {
              version: "1.1.0",
              purpose: "operator.community.announcement.update.1_1_0.purpose",
              releaseNotes: [
                "operator.community.announcement.update.1_1_0.note.registry",
                "operator.community.announcement.update.1_1_0.note.workspace"
              ],
              artifact: {
                downloadUrl: "https://github.com/fssrepository/myscoutee/releases/download/v1.1.0/myscoutee_1.1.0_amd64.deb",
                downloadUrlVerified: true,
                sha256Digest: "sha256:7e3d57c2c68793c0d4a25e94db5f4ba1d9a50e2b3f62c789417eaa35b610cd28",
                packageSigningKeyId: "pkey_86dfce4288ce436029e7236ac60b0604",
                signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
                signatureVerified: true,
                sizeBytes: 18874368,
                compatibility: "operator.community.announcement.update.1_1_0.compatibility"
              }
            }
          },
          {
            id: "maintenance-registry-window",
            kind: "MAINTENANCE",
            severity: "INFO",
            status: "PUBLISHED",
            unread: true,
            title: "operator.community.announcement.maintenance.registry.title",
            body: "operator.community.announcement.maintenance.registry.body",
            publishedAt: nowIso,
            expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
            links: [
              {
                id: "project-status",
                label: "operator.community.announcement.link.project",
                url: "https://github.com/fssrepository/myscoutee",
                verified: true
              }
            ],
            update: null
          }
        ]
      }
    });
  }
  static buildInitialStatus(now = /* @__PURE__ */ new Date()) {
    const nowIso = now.toISOString();
    return {
      mode: "DEMO",
      lifecycle: "UNCONFIGURED",
      enabled: false,
      simulation: true,
      candidateDefaults: {
        baseUrl: this.PRIMARY_BASE_URL,
        registryScope: this.PRIMARY_SCOPE
      },
      registryOptions: [
        {
          id: "registry-primary",
          label: "operator.registration.seed.registry.primary",
          baseUrl: this.PRIMARY_BASE_URL,
          description: "operator.registration.seed.registry.primary.description",
          registryScope: this.PRIMARY_SCOPE,
          selected: false
        },
        {
          id: "registry-europe",
          label: "operator.registration.seed.registry.europe",
          baseUrl: "https://eu-registry.myscoutee.invalid",
          description: "operator.registration.seed.registry.europe.description",
          registryScope: "demo:europe",
          selected: false
        },
        {
          id: "registry-community",
          label: "operator.registration.seed.registry.community",
          baseUrl: "https://community-registry.myscoutee.invalid",
          description: "operator.registration.seed.registry.community.description",
          registryScope: "demo:community",
          selected: false
        }
      ],
      draftInspection: null,
      selection: null,
      nodeIdentity: {
        state: "MISSING",
        initializedAt: null
      },
      enrollment: null,
      audit: {
        createdAt: nowIso,
        updatedAt: nowIso,
        lastAttemptAt: null,
        lastSuccessAt: null,
        disabledAt: null,
        updatedBy: "operator-demo-dev"
      },
      lastError: null
    };
  }
  static buildInitialRevenue(now = /* @__PURE__ */ new Date()) {
    const timelineSource = [
      ["2026-04-28", "Apr 28", 1, 1, 18e3, 11e3, 0, 0, 0],
      ["2026-04-29", "Apr 29", 1, 2, 12500, 22e3, 4200, 0, 2],
      ["2026-04-30", "Apr 30", 0, 1, 0, 9500, 3800, 0, 1],
      ["2026-05-01", "May 1", 2, 1, 26e3, 18e3, 6200, 0, 3],
      ["2026-05-02", "May 2", 1, 2, 14500, 24e3, 5300, 500, 2],
      ["2026-05-03", "May 3", 0, 1, 0, 8500, 0, 0, 0],
      ["2026-05-04", "May 4", 2, 1, 31e3, 13e3, 7800, 900, 4],
      ["2026-05-05", "May 5", 1, 1, 16500, 16e3, 2900, 0, 1],
      ["2026-05-06", "May 6", 0, 2, 0, 28e3, 6100, 0, 3],
      ["2026-05-07", "May 7", 2, 1, 27500, 14e3, 4500, 0, 2],
      ["2026-05-08", "May 8", 1, 0, 15500, 0, 0, 0, 0],
      ["2026-05-09", "May 9", 1, 2, 21e3, 34e3, 8200, 1e3, 3],
      ["2026-05-10", "May 10", 0, 1, 0, 15e3, 3200, 0, 1],
      ["2026-05-11", "May 11", 0, 0, 2e4, 0, 0, 0, 0]
    ];
    const commissionRateBasisPoints = 500;
    const timeline = timelineSource.map(([dateKey, label, payableEvents, payableAssets, projectedEventMinor, projectedAssetMinor, capturedPaymentMinor, refundedPaymentMinor, paymentCount]) => {
      const netPaymentMinor = capturedPaymentMinor - refundedPaymentMinor;
      const estimatedCommissionMinor = Math.floor(netPaymentMinor * commissionRateBasisPoints / 1e4);
      return {
        dateKey,
        label,
        payableEvents,
        payableAssets,
        projectedEventMinor,
        projectedAssetMinor,
        capturedPaymentMinor,
        refundedPaymentMinor,
        netPaymentMinor,
        commissionBasisMinor: netPaymentMinor,
        estimatedCommissionMinor,
        paymentCount,
        payingUsers: paymentCount
      };
    });
    return {
      generatedAtIso: now.toISOString(),
      rulesetVersion: "net-captured-revenue-v1",
      commissionRateBasisPoints,
      currencies: [
        {
          currencyCode: "USD",
          fractionDigits: 2,
          payableEvents: 12,
          payableAssets: 16,
          projectedEventMinor: 202500,
          projectedAssetMinor: 213e3,
          capturedPaymentMinor: 52200,
          refundedPaymentMinor: 2400,
          netPaymentMinor: 49800,
          commissionBasisMinor: 49800,
          estimatedCommissionMinor: 2490,
          paymentCount: 22,
          payingUsers: 22,
          eventBuyers: 14,
          assetBorrowers: 18,
          assetCategories: [
            {
              key: "accommodation",
              labelKey: "operator.revenue.category.accommodation",
              icon: "hotel",
              tone: "gold",
              payableAssets: 6,
              projectedMinor: 84e3
            },
            {
              key: "transport",
              labelKey: "operator.revenue.category.transport",
              icon: "directions_car",
              tone: "blue",
              payableAssets: 5,
              projectedMinor: 77e3
            },
            {
              key: "supplies",
              labelKey: "operator.revenue.category.supplies",
              icon: "inventory_2",
              tone: "green",
              payableAssets: 5,
              projectedMinor: 52e3
            }
          ],
          timeline
        }
      ]
    };
  }
  static buildInitialSettlements() {
    const beneficiaryId = `opg_${"1".repeat(32)}`;
    const baseValuationMultiplierBasisPoints = 3e4;
    const rows = [
      {
        sequence: 1,
        period: "2026-06",
        currencyCode: "EUR",
        fractionDigits: 2,
        revision: 1,
        supersedesSettlementId: null,
        networkPoolMinor: 5e4,
        ttmCommissionBasisMinor: 1e6,
        recentThreeMonthAverageMinor: 92e3,
        priorThreeMonthAverageMinor: 8e4,
        earlierThreeMonthAverageMinor: 75e3,
        acceptedAtIso: "2026-07-01T08:00:00.000Z"
      },
      {
        sequence: 2,
        period: "2026-06",
        currencyCode: "EUR",
        fractionDigits: 2,
        revision: 2,
        supersedesSettlementId: `stl_${"0".repeat(31)}1`,
        networkPoolMinor: 52500,
        ttmCommissionBasisMinor: 105e4,
        recentThreeMonthAverageMinor: 96e3,
        priorThreeMonthAverageMinor: 81e3,
        earlierThreeMonthAverageMinor: 75e3,
        acceptedAtIso: "2026-07-02T08:00:00.000Z"
      },
      {
        sequence: 3,
        period: "2026-05",
        currencyCode: "EUR",
        fractionDigits: 2,
        revision: 1,
        supersedesSettlementId: null,
        networkPoolMinor: 47500,
        ttmCommissionBasisMinor: 95e4,
        recentThreeMonthAverageMinor: 81e3,
        priorThreeMonthAverageMinor: 75e3,
        earlierThreeMonthAverageMinor: 72e3,
        acceptedAtIso: "2026-06-01T08:00:00.000Z"
      },
      {
        sequence: 4,
        period: "2026-06",
        currencyCode: "USD",
        fractionDigits: 2,
        revision: 1,
        supersedesSettlementId: null,
        networkPoolMinor: 38e3,
        ttmCommissionBasisMinor: 76e4,
        recentThreeMonthAverageMinor: 68e3,
        priorThreeMonthAverageMinor: 62e3,
        earlierThreeMonthAverageMinor: 6e4,
        acceptedAtIso: "2026-07-01T08:05:00.000Z"
      },
      {
        sequence: 5,
        period: "2026-05",
        currencyCode: "USD",
        fractionDigits: 2,
        revision: 1,
        supersedesSettlementId: null,
        networkPoolMinor: 35e3,
        ttmCommissionBasisMinor: 7e5,
        recentThreeMonthAverageMinor: 62e3,
        priorThreeMonthAverageMinor: 6e4,
        earlierThreeMonthAverageMinor: 58e3,
        acceptedAtIso: "2026-06-01T08:05:00.000Z"
      },
      {
        sequence: 6,
        period: "2026-06",
        currencyCode: "HUF",
        fractionDigits: 0,
        revision: 1,
        supersedesSettlementId: null,
        networkPoolMinor: 185e4,
        ttmCommissionBasisMinor: 37e6,
        recentThreeMonthAverageMinor: 33e5,
        priorThreeMonthAverageMinor: 305e4,
        earlierThreeMonthAverageMinor: 29e5,
        acceptedAtIso: "2026-07-01T08:10:00.000Z"
      },
      {
        sequence: 7,
        period: "2026-05",
        currencyCode: "HUF",
        fractionDigits: 0,
        revision: 1,
        supersedesSettlementId: null,
        networkPoolMinor: 17e5,
        ttmCommissionBasisMinor: 34e6,
        recentThreeMonthAverageMinor: 305e4,
        priorThreeMonthAverageMinor: 29e5,
        earlierThreeMonthAverageMinor: 278e4,
        acceptedAtIso: "2026-06-01T08:10:00.000Z"
      }
    ];
    return rows.map((row) => {
      const settlementId = `stl_${row.sequence.toString(16).padStart(32, "0")}`;
      const priorGrowthBasisPoints = this.growthBasisPoints(row.earlierThreeMonthAverageMinor, row.priorThreeMonthAverageMinor);
      const recentGrowthBasisPoints = this.growthBasisPoints(row.priorThreeMonthAverageMinor, row.recentThreeMonthAverageMinor);
      const accelerationBasisPoints = Math.max(-1e4, Math.min(1e4, recentGrowthBasisPoints - priorGrowthBasisPoints));
      const valuationAdjustmentBasisPoints = Math.max(-2500, Math.min(2500, Math.trunc(recentGrowthBasisPoints / 4) + Math.trunc(accelerationBasisPoints / 4)));
      const effectiveValuationMultiplierBasisPoints = Math.floor(baseValuationMultiplierBasisPoints * (1e4 + valuationAdjustmentBasisPoints) / 1e4);
      const shareNumerator = "277";
      const shareDenominator = "5000";
      const ttmNetworkCommissionPoolMinor = Math.floor(row.ttmCommissionBasisMinor * 500 / 1e4);
      const indicativeNetworkValueMinor = Math.floor(row.ttmCommissionBasisMinor * effectiveValuationMultiplierBasisPoints / 1e4);
      return {
        settlementId,
        period: row.period,
        currencyCode: row.currencyCode,
        fractionDigits: row.fractionDigits,
        revision: row.revision,
        supersedesSettlementId: row.supersedesSettlementId,
        beneficiaryType: "OPERATOR_GROUP",
        beneficiaryId,
        shareNumerator,
        shareDenominator,
        networkPoolMinor: row.networkPoolMinor,
        networkPoolAllocationMinor: Math.floor(row.networkPoolMinor * 277 / 5e3),
        ttmCommissionBasisMinor: row.ttmCommissionBasisMinor,
        ttmNetworkCommissionPoolMinor,
        indicativeNetworkValueMinor,
        indicativeValueAllocationMinor: Math.floor(indicativeNetworkValueMinor * 277 / 5e3),
        valuationRulesetVersion: "three-month-acceleration-valuation-v1",
        baseValuationMultiplierBasisPoints,
        recentThreeMonthAverageMinor: row.recentThreeMonthAverageMinor,
        priorThreeMonthAverageMinor: row.priorThreeMonthAverageMinor,
        earlierThreeMonthAverageMinor: row.earlierThreeMonthAverageMinor,
        recentGrowthBasisPoints,
        priorGrowthBasisPoints,
        accelerationBasisPoints,
        valuationAdjustmentBasisPoints,
        effectiveValuationMultiplierBasisPoints,
        valuationIsNonBinding: true,
        throughLedgerIndex: 40 + row.sequence,
        throughAuditIndex: 20 + row.sequence,
        throughReviewIndex: 8,
        throughEligibilityIndex: 6,
        sourceFingerprint: `sha256:${row.sequence.toString(16).repeat(64)}`,
        settlementHash: `sha256:${(row.sequence + 8).toString(16).repeat(64)}`,
        acceptedAtIso: row.acceptedAtIso
      };
    });
  }
  static growthBasisPoints(previous, current) {
    if (previous === 0) {
      return current === 0 ? 0 : 2e4;
    }
    return Math.max(-1e4, Math.min(2e4, Math.trunc((current - previous) * 1e4 / previous)));
  }
  static buildBootstrapMemory(memory, now = /* @__PURE__ */ new Date()) {
    const usersTable = memory.appState[USERS_TABLE_NAME];
    const seededOperator = this.buildDemoOperatorUser();
    const existingOperator = usersTable.byId[seededOperator.id] ?? null;
    const usersChanged = this.operatorNeedsUpdate(existingOperator);
    const operator = usersChanged ? this.mergeOperator(existingOperator, seededOperator) : existingOperator;
    const appState = usersChanged ? __spreadProps(__spreadValues({}, memory.appState), {
      [USERS_TABLE_NAME]: {
        byId: __spreadProps(__spreadValues({}, usersTable.byId), {
          [operator.id]: operator
        }),
        ids: usersTable.ids.includes(operator.id) ? [...usersTable.ids] : [...usersTable.ids, operator.id]
      }
    }) : memory.appState;
    const registryRecord = LocalOperatorRegistryMapper.toSeedRecord({
      registryRecord: this.normalizeSeedDeployment(memory.registryRecord)
    }, this.buildInitialRecord(now));
    return {
      appState,
      registryRecord,
      registryChanged: LocalOperatorRegistryMapper.seedRecordChanged(memory.registryRecord, registryRecord),
      usersChanged
    };
  }
  static buildInitialLedger(now = /* @__PURE__ */ new Date()) {
    const measuredAt = now.toISOString();
    return [
      {
        id: "founder",
        nodeId: null,
        label: "operator.leaderboard.seed.founder",
        active: true,
        founder: true,
        verifiedWeight: 1e5,
        claimed: true,
        eligibilityStatus: "ACTIVE",
        claimantUserId: null,
        claimantName: "MyScoutee",
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: measuredAt
      },
      {
        id: "node-campus",
        nodeId: "node-campus",
        label: "operator.leaderboard.seed.campus",
        active: true,
        founder: false,
        verifiedWeight: 5e4,
        claimed: true,
        eligibilityStatus: "ACTIVE",
        claimantUserId: "operator-campus",
        claimantName: "Campus Operator",
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: measuredAt
      },
      {
        id: "node-campus-east",
        nodeId: "node-campus-east",
        label: "operator.leaderboard.seed.campus.east",
        active: true,
        founder: false,
        verifiedWeight: 15e3,
        claimed: true,
        eligibilityStatus: "ACTIVE",
        claimantUserId: "operator-campus",
        claimantName: "Campus Operator",
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: measuredAt
      },
      {
        id: "node-city",
        nodeId: "node-city",
        label: "operator.leaderboard.seed.city",
        active: true,
        founder: false,
        verifiedWeight: 3e4,
        claimed: true,
        eligibilityStatus: "ACTIVE",
        claimantUserId: "operator-city",
        claimantName: "City Operator",
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: measuredAt
      },
      {
        id: "node-club",
        nodeId: "node-club",
        label: "operator.leaderboard.seed.club",
        active: true,
        founder: false,
        verifiedWeight: 2e4,
        claimed: true,
        eligibilityStatus: "ACTIVE",
        claimantUserId: "operator-club",
        claimantName: "Club Operator",
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: measuredAt
      },
      {
        id: "node-operator-demo",
        nodeId: "node-operator-demo",
        label: "node-operator-demo",
        active: false,
        founder: false,
        verifiedWeight: 12e3,
        claimed: false,
        eligibilityStatus: "INACTIVE",
        claimantUserId: null,
        claimantName: null,
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: null
      },
      {
        id: "node-north",
        nodeId: "node-north",
        label: "node-north",
        active: true,
        founder: false,
        verifiedWeight: 9e3,
        claimed: false,
        eligibilityStatus: "INACTIVE",
        claimantUserId: null,
        claimantName: null,
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: null
      },
      {
        id: "node-east",
        nodeId: "node-east",
        label: "node-east",
        active: true,
        founder: false,
        verifiedWeight: 6e3,
        claimed: false,
        eligibilityStatus: "INACTIVE",
        claimantUserId: null,
        claimantName: null,
        claimantAvatarUrl: null,
        measuredAt,
        claimedAt: null
      }
    ];
  }
  static normalizeSeedDeployment(record) {
    if (!record) {
      return null;
    }
    const next = structuredClone(record);
    const previousNodeId = next.claimIdentity.nodeId.trim();
    const deploymentCode = next.status.enrollment?.deploymentCode?.trim() ?? "";
    const nodeId = deploymentCode || previousNodeId;
    const active = next.status.enabled && next.status.lifecycle === "REGISTERED";
    const deployment = next.ledger.find((item) => item.nodeId === previousNodeId || item.nodeId === deploymentCode);
    next.ledger = next.ledger.filter((item) => item === deployment || item.nodeId !== previousNodeId && item.nodeId !== deploymentCode).map((item) => {
      if (item === deployment && nodeId) {
        return __spreadProps(__spreadValues({}, item), {
          id: nodeId,
          nodeId,
          label: nodeId,
          active
        });
      }
      if (!item.founder && !item.claimed && item.nodeId) {
        return __spreadProps(__spreadValues({}, item), {
          label: item.nodeId,
          active: item.active !== false
        });
      }
      return item;
    });
    if (nodeId) {
      next.claimIdentity = __spreadProps(__spreadValues({}, next.claimIdentity), {
        nodeId
      });
      next.groupLinks = next.groupLinks.map((link) => link.nodeId === previousNodeId ? __spreadProps(__spreadValues({}, link), { nodeId }) : link);
    }
    next.leaderboard = LocalOperatorRegistryMapper.deriveLeaderboard(next.ledger, next.groupLinks);
    return next;
  }
  static buildDemoOperatorUser() {
    return {
      id: "operator-demo-dev",
      name: "Demo Operator",
      age: 0,
      birthday: "",
      city: "Demo deployment",
      height: "",
      physique: "",
      languages: ["English"],
      horoscope: "",
      initials: "DO",
      gender: "woman",
      statusText: "Operator workspace",
      hostTier: "Operator",
      traitLabel: "Independent",
      completion: 100,
      profileFormVersion: 2,
      headline: "Independent deployment operator",
      about: "Configures this deployment and its signed registry connection.",
      images: [],
      profileStatus: "public",
      operator: true,
      activities: {
        game: 0,
        chats: 0,
        invitations: 0,
        events: 0,
        hosting: 0,
        cars: 0,
        accommodation: 0,
        supplies: 0,
        tickets: 0,
        contacts: 0,
        feedback: 0,
        notifications: 0,
        adminJobs: 0,
        adminMetrics: 0
      }
    };
  }
  static operatorNeedsUpdate(existing) {
    return !existing || existing.operator !== true || existing.admin === true || `${existing.hostTier ?? ""}`.trim().toLowerCase() !== "operator" || `${existing.statusText ?? ""}`.trim().length === 0 || Math.trunc(Number(existing.profileFormVersion) || 0) < 2;
  }
  static mergeOperator(existing, seeded) {
    if (!existing) {
      return seeded;
    }
    return __spreadProps(__spreadValues({}, existing), {
      operator: true,
      admin: false,
      hostTier: "Operator",
      statusText: `${existing.statusText ?? ""}`.trim() || seeded.statusText,
      profileFormVersion: Math.max(2, Math.trunc(Number(existing.profileFormVersion) || 0))
    });
  }
};

export {
  DEPLOYMENT_THEME_PRESETS,
  DEFAULT_DEPLOYMENT_BRANDING,
  DEFAULT_DEPLOYMENT_SOCIAL_LINKS,
  DEFAULT_DEPLOYMENT_PRIVACY_CONTACT,
  DEFAULT_DEPLOYMENT_CONFIGURATION,
  OperatorConfigurationMapper,
  USERS_TABLE_NAME,
  LocalOperatorRegistryMapper,
  SeedOperatorRegistryBuilder,
  CHATS_TABLE_NAME,
  CHAT_MESSAGES_TABLE_NAME,
  EVENT_FEEDBACK_TABLE_NAME,
  EVENTS_TABLE_NAME,
  EVENT_TICKETS_TABLE_NAME,
  HELP_CENTER_TABLE_NAME,
  IDEA_POSTS_TABLE_NAME,
  NOTIFICATIONS_TABLE_NAME,
  CONTACTS_TABLE_NAME,
  PROFILE_EXPERIENCES_TABLE_NAME,
  SHARE_TOKENS_TABLE_NAME,
  USER_RATES_TABLE_NAME,
  USER_RATES_OUTBOX_TABLE_NAME,
  USER_FILTER_PREFERENCES_TABLE_NAME,
  ASSETS_TABLE_NAME,
  ASSET_REQUESTS_TABLE_NAME,
  ACTIVITY_MEMBERS_TABLE_NAME,
  ACTIVITY_RESOURCES_TABLE_NAME,
  ACTIVITY_SUB_EVENT_GROUPS_TABLE_NAME,
  ACTIVITY_SUB_EVENT_STAGE_RUNTIME_TABLE_NAME,
  AppMemoryDb,
  LocalMemoryDb,
  HttpMemoryDb
};
//# sourceMappingURL=chunk-XQACYBVS.js.map
