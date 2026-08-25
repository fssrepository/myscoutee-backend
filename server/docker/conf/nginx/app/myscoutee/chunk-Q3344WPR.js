import {
  SessionService
} from "./chunk-2ENBQWLU.js";
import {
  APP_I18N_BUNDLES_STORE,
  APP_SCOPED_INDEXED_DB_NAME,
  APP_SCOPED_INDEXED_DB_VERSION,
  createAppScopedObjectStores,
  scopedStorageKey
} from "./chunk-LERGHE7K.js";
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from "./chunk-D6ZHKNYF.js";
import {
  DOCUMENT,
  Injectable,
  NgZone,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/base/repositories/i18n-bundle.repository.ts
var I18nBundleRepository = class _I18nBundleRepository {
  static DEFAULT_LANGUAGE = "en";
  indexedDbOpenPromise = null;
  async firstStoredBundle(scope, candidates) {
    for (const lang of candidates) {
      const stored = await this.readStoredBundle(scope, lang);
      if (stored && Object.keys(stored.data).length > 0) {
        return stored;
      }
    }
    return null;
  }
  async readStoredBundle(scope, lang) {
    const stored = await this.readIndexedDbBundle(scope, lang);
    if (stored) {
      this.writeLocalStorageBundle(scope, stored);
      return stored;
    }
    return this.readLocalStorageBundle(scope, lang);
  }
  async writeStoredBundle(scope, bundle) {
    await this.writeIndexedDbBundle(scope, bundle);
    this.writeLocalStorageBundle(scope, bundle);
  }
  readLocalStorageBundle(scope, lang) {
    if (!this.canUseLocalStorage()) {
      return null;
    }
    try {
      const raw = localStorage.getItem(this.storageKey(scope, lang));
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      return this.normalizeStoredBundle(parsed, lang);
    } catch {
      return null;
    }
  }
  writeLocalStorageBundle(scope, bundle) {
    if (!this.canUseLocalStorage()) {
      return;
    }
    try {
      localStorage.setItem(this.storageKey(scope, bundle.lang), JSON.stringify(bundle));
    } catch {
    }
  }
  async readIndexedDbBundle(scope, lang) {
    const db = await this.openIndexedDb();
    if (!db || !db.objectStoreNames.contains(APP_I18N_BUNDLES_STORE)) {
      return null;
    }
    return await new Promise((resolve) => {
      const tx = db.transaction(APP_I18N_BUNDLES_STORE, "readonly");
      const request = tx.objectStore(APP_I18N_BUNDLES_STORE).get(this.bundleKey(scope, lang));
      request.onsuccess = () => {
        resolve(this.normalizeStoredBundle(request.result, lang));
      };
      request.onerror = () => resolve(null);
      tx.onerror = () => resolve(null);
      tx.onabort = () => resolve(null);
    });
  }
  async writeIndexedDbBundle(scope, bundle) {
    const db = await this.openIndexedDb();
    if (!db || !db.objectStoreNames.contains(APP_I18N_BUNDLES_STORE)) {
      return;
    }
    await new Promise((resolve) => {
      const tx = db.transaction(APP_I18N_BUNDLES_STORE, "readwrite");
      tx.objectStore(APP_I18N_BUNDLES_STORE).put(bundle, this.bundleKey(scope, bundle.lang));
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  }
  async openIndexedDb() {
    if (typeof indexedDB === "undefined") {
      return null;
    }
    if (!this.indexedDbOpenPromise) {
      this.indexedDbOpenPromise = new Promise((resolve) => {
        const request = indexedDB.open(APP_SCOPED_INDEXED_DB_NAME, APP_SCOPED_INDEXED_DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          createAppScopedObjectStores(db);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
        request.onblocked = () => resolve(null);
      });
    }
    return await this.indexedDbOpenPromise;
  }
  normalizeStoredBundle(value, fallbackLang) {
    const parsed = value;
    const normalizedLang = this.normalizeLanguage(parsed?.lang ?? fallbackLang);
    const data = this.normalizeMessages(parsed?.data ?? null);
    const version = `${parsed?.version ?? ""}`.trim();
    if (!normalizedLang || !version || !data) {
      return null;
    }
    return {
      lang: normalizedLang,
      version,
      data,
      storedAt: Number.isFinite(parsed?.storedAt) ? Number(parsed?.storedAt) : 0
    };
  }
  storageKey(scope, lang) {
    const normalizedLang = this.normalizeLanguage(lang) || _I18nBundleRepository.DEFAULT_LANGUAGE;
    return scopedStorageKey(`i18n.bundle.v2.${scope}.${normalizedLang}`);
  }
  bundleKey(scope, lang) {
    const normalizedLang = this.normalizeLanguage(lang) || _I18nBundleRepository.DEFAULT_LANGUAGE;
    return `${scope}:${normalizedLang}`;
  }
  canUseLocalStorage() {
    try {
      return typeof localStorage !== "undefined";
    } catch {
      return false;
    }
  }
  normalizeLanguage(value) {
    return `${value ?? ""}`.trim().toLowerCase().split(",")[0].split(";")[0].split("-")[0].replace(/[^a-z]/g, "");
  }
  normalizeMessages(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const normalized = {};
    Object.entries(value).forEach(([key, translation]) => {
      const normalizedKey = this.normalizeSourceKey(key);
      const normalizedTranslation = `${translation ?? ""}`.trim();
      if (normalizedKey && normalizedTranslation) {
        normalized[normalizedKey] = normalizedTranslation;
      }
    });
    return normalized;
  }
  normalizeSourceKey(value) {
    return `${value ?? ""}`.trim().replace(/\s+/g, " ");
  }
  static \u0275fac = function I18nBundleRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _I18nBundleRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _I18nBundleRepository, factory: _I18nBundleRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(I18nBundleRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/i18n.service.ts
var I18nService = class _I18nService {
  static DEFAULT_LANGUAGE = "en";
  static REVALIDATE_HEADERS = new HttpHeaders({
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  });
  static LOCAL_SEED_ASSETS = {
    en: "assets/i18n/en.json",
    hu: "assets/i18n/hu.json"
  };
  static TRANSLATABLE_ATTRIBUTES = ["aria-label", "title", "placeholder", "alt"];
  static SKIP_ATTRIBUTE_SELECTOR = [
    "[data-i18n-ignore]",
    "mat-icon",
    ".mat-icon",
    ".material-icons",
    "script",
    "style",
    "code",
    "pre"
  ].join(",");
  static SKIP_TEXT_SELECTOR = [
    "[data-i18n-ignore]",
    "mat-icon",
    ".mat-icon",
    ".material-icons",
    "script",
    "style",
    "code",
    "pre",
    "textarea",
    '[contenteditable="true"]',
    ".admin-message",
    ".activities-card-title",
    ".activities-card-subtitle",
    ".activities-card-detail",
    ".admin-feedback-detail-field p",
    ".profile-view-experience-description",
    ".user-name",
    ".contact-title-wrap h3",
    ".profile-name-line"
  ].join(",");
  http = inject(HttpClient);
  document = inject(DOCUMENT);
  zone = inject(NgZone);
  bundleRepository = inject(I18nBundleRepository);
  sessionService = inject(SessionService);
  currentLanguageSignal = signal(_I18nService.DEFAULT_LANGUAGE, ...ngDevMode ? [{ debugName: "currentLanguageSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  messagesSignal = signal({}, ...ngDevMode ? [{ debugName: "messagesSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  sourceMessagesSignal = signal({}, ...ngDevMode ? [{ debugName: "sourceMessagesSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  sourceKeyByTextSignal = signal({}, ...ngDevMode ? [{ debugName: "sourceKeyByTextSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  revisionSignal = signal(0, ...ngDevMode ? [{ debugName: "revisionSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  textNodeSources = /* @__PURE__ */ new WeakMap();
  attributeSources = /* @__PURE__ */ new WeakMap();
  domObserver = null;
  initialized = false;
  activeBundleScope = this.resolveBundleScope();
  bundleLoadGeneration = 0;
  scanQueued = false;
  translatingDom = false;
  currentLanguage = this.currentLanguageSignal.asReadonly();
  isDefaultLanguage = computed(() => this.currentLanguageSignal() === _I18nService.DEFAULT_LANGUAGE, ...ngDevMode ? [{ debugName: "isDefaultLanguage" }] : (
    /* istanbul ignore next */
    []
  ));
  revision = this.revisionSignal.asReadonly();
  constructor() {
    effect(() => {
      this.sessionService.session();
      const nextScope = this.resolveBundleScope();
      if (!this.initialized || nextScope === this.activeBundleScope) {
        return;
      }
      this.startLanguageLoad(nextScope);
    });
  }
  initialize() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.installDomObserver();
    this.startLanguageLoad(this.resolveBundleScope());
  }
  translate(value, fallback) {
    const source = `${value ?? ""}`;
    if (!source) {
      return `${fallback ?? ""}`;
    }
    const translated = this.translateRaw(source);
    const fallbackText = `${fallback ?? ""}`.trim();
    if (fallbackText && translated === source && fallbackText !== source.trim()) {
      return this.translateRaw(fallbackText);
    }
    return translated;
  }
  translateParams(value, values, fallback) {
    const translated = this.translate(value, fallback);
    return this.interpolate(translated, Object.fromEntries(Object.entries(values).map(([key, item]) => [key, `${item ?? ""}`])));
  }
  startLanguageLoad(scope) {
    this.activeBundleScope = scope;
    const generation = ++this.bundleLoadGeneration;
    this.currentLanguageSignal.set(_I18nService.DEFAULT_LANGUAGE);
    this.messagesSignal.set({});
    this.sourceMessagesSignal.set({});
    this.sourceKeyByTextSignal.set({});
    this.updateDocumentLanguage(_I18nService.DEFAULT_LANGUAGE);
    this.bumpRevision();
    this.scheduleDomScan();
    void this.loadPreferredLanguage(scope, generation);
  }
  async loadPreferredLanguage(scope, generation) {
    await this.loadDefaultSourceBundle(scope, generation);
    if (!this.isCurrentBundleLoad(scope, generation)) {
      return;
    }
    const candidates = this.localizedBrowserCandidates();
    const stored = await this.bundleRepository.firstStoredBundle(scope, candidates);
    if (!this.isCurrentBundleLoad(scope, generation)) {
      return;
    }
    if (stored) {
      this.applyBundle(stored.lang, stored.version, stored.data);
    }
    const seed = this.usesHttpBundles() ? null : await this.firstLocalSeedBundle(candidates, stored?.lang ?? null, stored?.version ?? null);
    if (!this.isCurrentBundleLoad(scope, generation)) {
      return;
    }
    if (seed) {
      if (!this.usesHttpBundles()) {
        await this.bundleRepository.writeStoredBundle(scope, seed);
        if (!this.isCurrentBundleLoad(scope, generation)) {
          return;
        }
      }
      this.applyBundle(seed.lang, seed.version, seed.data);
    }
    await this.refreshFromServer(scope, generation, candidates);
  }
  async loadDefaultSourceBundle(scope, generation) {
    const lang = _I18nService.DEFAULT_LANGUAGE;
    const assetUrl = _I18nService.LOCAL_SEED_ASSETS[lang];
    const seed = !this.usesHttpBundles() && assetUrl ? await this.loadLocalSeedBundle(assetUrl, true) : null;
    if (!this.isCurrentBundleLoad(scope, generation)) {
      return;
    }
    if (seed && seed.lang === lang && Object.keys(seed.data).length > 0) {
      this.applySourceBundle(seed.data);
    }
    const stored = await this.bundleRepository.readStoredBundle(scope, lang);
    if (!this.isCurrentBundleLoad(scope, generation)) {
      return;
    }
    const storedCanOverrideSeed = stored && Object.keys(stored.data).length > 0 && (!seed || this.compareVersions(stored.version, seed.version) >= 0);
    if (storedCanOverrideSeed) {
      this.applySourceBundle(stored.data, true);
      return;
    }
    if (!this.usesHttpBundles() && seed) {
      await this.bundleRepository.writeStoredBundle(scope, seed);
    }
  }
  async refreshFromServer(scope, generation, candidates) {
    if (!this.usesHttpBundles()) {
      return;
    }
    const activeLang = this.currentLanguageSignal();
    const preferredLang = activeLang === _I18nService.DEFAULT_LANGUAGE ? candidates[0] ?? null : activeLang;
    const requests = [
      this.refreshLanguageFromServer(scope, generation, _I18nService.DEFAULT_LANGUAGE, false)
    ];
    if (preferredLang && preferredLang !== _I18nService.DEFAULT_LANGUAGE) {
      requests.push(this.refreshLanguageFromServer(scope, generation, preferredLang, true));
    }
    await Promise.all(requests);
  }
  async refreshLanguageFromServer(scope, generation, requestedLang, activateTranslation) {
    const stored = await this.bundleRepository.readStoredBundle(scope, requestedLang);
    if (!this.isCurrentBundleLoad(scope, generation)) {
      return;
    }
    let params = new HttpParams().set("lang", requestedLang);
    if (stored?.version) {
      params = params.set("version", stored.version);
    }
    try {
      const response = await firstValueFrom(this.http.get(`${environment.apiBaseUrl ?? "/api"}/i18n/bundle`, {
        headers: _I18nService.REVALIDATE_HEADERS.set("Accept-Language", this.acceptLanguageHeader()),
        params
      }));
      if (!this.isCurrentBundleLoad(scope, generation)) {
        return;
      }
      const lang = this.normalizeLanguage(response?.lang ?? requestedLang);
      if (!lang) {
        return;
      }
      const version = `${response?.version ?? stored?.version ?? ""}`.trim();
      const data = this.normalizeMessages(response?.data ?? null);
      if (stored?.lang === lang && stored.version && version && this.compareVersions(version, stored.version) < 0) {
        return;
      }
      if (data && Object.keys(data).length > 0) {
        const bundle = { lang, version: version || "0", data, storedAt: Date.now() };
        await this.bundleRepository.writeStoredBundle(scope, bundle);
        if (!this.isCurrentBundleLoad(scope, generation)) {
          return;
        }
        this.applyServerBundle(bundle, activateTranslation);
        return;
      }
      if (stored && stored.lang === lang && version && version === stored.version) {
        this.applyServerBundle(stored, activateTranslation);
      }
    } catch {
    }
  }
  applyServerBundle(bundle, activateTranslation) {
    if (bundle.lang === _I18nService.DEFAULT_LANGUAGE) {
      if (activateTranslation) {
        this.currentLanguageSignal.set(_I18nService.DEFAULT_LANGUAGE);
        this.messagesSignal.set({});
        this.updateDocumentLanguage(_I18nService.DEFAULT_LANGUAGE);
      }
      this.applySourceBundle(bundle.data, true);
      return;
    }
    if (activateTranslation) {
      this.applyBundle(bundle.lang, bundle.version, bundle.data);
    }
  }
  usesHttpBundles() {
    return environment.activitiesDataSource === "http";
  }
  resolveBundleScope() {
    if (!this.usesHttpBundles()) {
      return "demo";
    }
    return this.sessionService.currentSession()?.kind === "demo" ? "demo" : "real";
  }
  isCurrentBundleLoad(scope, generation) {
    return scope === this.activeBundleScope && generation === this.bundleLoadGeneration;
  }
  async firstLocalSeedBundle(candidates, storedLang, storedVersion) {
    for (const lang of candidates) {
      const assetUrl = _I18nService.LOCAL_SEED_ASSETS[lang];
      if (!assetUrl) {
        continue;
      }
      const seed = await this.loadLocalSeedBundle(assetUrl);
      if (!seed || seed.lang !== lang || Object.keys(seed.data).length === 0) {
        continue;
      }
      if (storedLang === seed.lang && storedVersion && this.compareVersions(seed.version, storedVersion) <= 0) {
        return null;
      }
      return seed;
    }
    return null;
  }
  async loadLocalSeedBundle(assetUrl, allowDefaultLanguage = false) {
    if (!assetUrl) {
      return null;
    }
    try {
      const response = await firstValueFrom(this.http.get(assetUrl, {
        headers: _I18nService.REVALIDATE_HEADERS
      }));
      const lang = this.normalizeLanguage(response?.lang ?? "");
      const data = this.normalizeMessages(response?.messages ?? null);
      const version = `${response?.version ?? ""}`.trim();
      if (!lang || !allowDefaultLanguage && lang === _I18nService.DEFAULT_LANGUAGE || !version || !data) {
        return null;
      }
      return {
        lang,
        version,
        data,
        storedAt: Date.now()
      };
    } catch {
      return null;
    }
  }
  applyBundle(lang, version, data) {
    const normalizedLang = this.normalizeLanguage(lang);
    if (!normalizedLang || normalizedLang === _I18nService.DEFAULT_LANGUAGE) {
      if (normalizedLang === _I18nService.DEFAULT_LANGUAGE && Object.keys(data).length > 0) {
        this.applySourceBundle(data, true);
      }
      this.currentLanguageSignal.set(_I18nService.DEFAULT_LANGUAGE);
      this.messagesSignal.set({});
      this.updateDocumentLanguage(_I18nService.DEFAULT_LANGUAGE);
      this.bumpRevision();
      this.scheduleDomScan();
      return;
    }
    this.currentLanguageSignal.set(normalizedLang);
    this.messagesSignal.set(data);
    this.updateDocumentLanguage(normalizedLang);
    this.bumpRevision();
    this.scheduleDomScan();
    void version;
  }
  applySourceBundle(data, preserveTextAliases = false) {
    this.sourceMessagesSignal.set(data);
    const nextIndex = this.buildSourceKeyIndex(data);
    this.sourceKeyByTextSignal.set(preserveTextAliases ? __spreadValues(__spreadValues({}, this.sourceKeyByTextSignal()), nextIndex) : nextIndex);
    this.bumpRevision();
    this.scheduleDomScan();
  }
  buildSourceKeyIndex(data) {
    const index = {};
    Object.entries(data).forEach(([key, source]) => {
      const normalizedKey = this.normalizeSourceKey(key);
      const normalizedSource = this.normalizeSourceKey(source);
      if (!normalizedKey || !normalizedSource) {
        return;
      }
      for (const candidate of this.sourceLookupCandidates(normalizedSource)) {
        if (candidate && !index[candidate]) {
          index[candidate] = normalizedKey;
        }
      }
    });
    return index;
  }
  updateDocumentLanguage(lang) {
    const documentElement = this.document?.documentElement;
    if (documentElement) {
      documentElement.lang = lang;
    }
  }
  bumpRevision() {
    this.revisionSignal.update((value) => value + 1);
  }
  localizedBrowserCandidates() {
    const rawLanguages = this.browserLanguages();
    const candidates = [];
    for (const raw of rawLanguages) {
      const lang = this.normalizeLanguage(raw);
      if (!lang || lang === _I18nService.DEFAULT_LANGUAGE || candidates.includes(lang)) {
        continue;
      }
      candidates.push(lang);
    }
    return candidates;
  }
  browserLanguages() {
    if (typeof navigator === "undefined") {
      return [];
    }
    const languages = Array.isArray(navigator.languages) && navigator.languages.length > 0 ? navigator.languages : [navigator.language];
    return languages.map((value) => `${value ?? ""}`.trim()).filter((value) => value.length > 0);
  }
  acceptLanguageHeader() {
    const browserLanguages = this.browserLanguages();
    return browserLanguages.length > 0 ? browserLanguages.join(",") : _I18nService.DEFAULT_LANGUAGE;
  }
  normalizeLanguage(value) {
    return `${value ?? ""}`.trim().toLowerCase().split(",")[0].split(";")[0].split("-")[0].replace(/[^a-z]/g, "");
  }
  normalizeMessages(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const normalized = {};
    Object.entries(value).forEach(([key, translation]) => {
      const normalizedKey = this.normalizeSourceKey(key);
      const normalizedTranslation = `${translation ?? ""}`.trim();
      if (normalizedKey && normalizedTranslation) {
        normalized[normalizedKey] = normalizedTranslation;
      }
    });
    return normalized;
  }
  compareVersions(left, right) {
    return left.localeCompare(right, void 0, { numeric: true, sensitivity: "base" });
  }
  installDomObserver() {
    const body = this.document?.body;
    const view = this.document?.defaultView;
    if (!body || !view?.MutationObserver) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.domObserver = new view.MutationObserver(() => {
        if (!this.translatingDom) {
          this.scheduleDomScan();
        }
      });
      this.domObserver.observe(body, {
        attributes: true,
        attributeFilter: [..._I18nService.TRANSLATABLE_ATTRIBUTES],
        characterData: true,
        childList: true,
        subtree: true
      });
      this.scheduleDomScan();
    });
  }
  scheduleDomScan() {
    const view = this.document?.defaultView;
    if (this.scanQueued || !view) {
      return;
    }
    this.scanQueued = true;
    view.requestAnimationFrame(() => {
      this.scanQueued = false;
      this.scanDom();
    });
  }
  scanDom() {
    const body = this.document?.body;
    const view = this.document?.defaultView;
    if (!body || !view) {
      return;
    }
    this.translatingDom = true;
    try {
      this.translateElementAttributes(body);
      body.querySelectorAll("*").forEach((element) => this.translateElementAttributes(element));
      const showText = typeof NodeFilter !== "undefined" ? NodeFilter.SHOW_TEXT : 4;
      const walker = this.document.createTreeWalker(body, showText);
      let current = walker.nextNode();
      while (current) {
        if (current.nodeType === 3) {
          this.translateTextNode(current);
        }
        current = walker.nextNode();
      }
    } finally {
      this.translatingDom = false;
    }
  }
  translateElementAttributes(element) {
    if (this.shouldSkipAttributeElement(element)) {
      return;
    }
    for (const attributeName of _I18nService.TRANSLATABLE_ATTRIBUTES) {
      const current = element.getAttribute(attributeName);
      if (!current || !this.hasLetters(current)) {
        continue;
      }
      const source = this.resolveAttributeSource(element, attributeName, current);
      const translated = this.translateRaw(source);
      if (translated !== current) {
        element.setAttribute(attributeName, translated);
      }
    }
  }
  translateTextNode(node) {
    const parent = node.parentElement;
    if (!parent || this.shouldSkipTextElement(parent)) {
      return;
    }
    const current = node.data;
    if (!this.hasLetters(current)) {
      return;
    }
    const source = this.resolveTextSource(node, current);
    const translated = this.translateRaw(source);
    if (translated !== current) {
      node.data = translated;
    }
  }
  resolveTextSource(node, current) {
    const previousSource = this.textNodeSources.get(node);
    if (!previousSource) {
      this.textNodeSources.set(node, current);
      return current;
    }
    const previousTranslation = this.translateRaw(previousSource);
    if (current !== previousSource && current !== previousTranslation) {
      this.textNodeSources.set(node, current);
      return current;
    }
    return previousSource;
  }
  resolveAttributeSource(element, attributeName, current) {
    let sources = this.attributeSources.get(element);
    if (!sources) {
      sources = /* @__PURE__ */ new Map();
      this.attributeSources.set(element, sources);
    }
    const previousSource = sources.get(attributeName);
    if (!previousSource) {
      sources.set(attributeName, current);
      return current;
    }
    const previousTranslation = this.translateRaw(previousSource);
    if (current !== previousSource && current !== previousTranslation) {
      sources.set(attributeName, current);
      return current;
    }
    return previousSource;
  }
  translateRaw(source) {
    const normalizedKey = this.normalizeSourceKey(source);
    if (!normalizedKey) {
      return source;
    }
    const messages = this.messagesSignal();
    const sourceMessages = this.sourceMessagesSignal();
    const sourceKeyByText = this.sourceKeyByTextSignal();
    const dynamicTranslated = this.translateDynamicSource(normalizedKey, messages, sourceKeyByText) ?? this.translateDynamicSource(normalizedKey, sourceMessages, sourceKeyByText);
    if (dynamicTranslated) {
      return this.replaceCoreText(source, dynamicTranslated);
    }
    const translated = this.resolveCoreTranslation(normalizedKey, messages, sourceKeyByText) ?? this.resolveCoreTranslation(normalizedKey, sourceMessages, sourceKeyByText);
    if (!translated) {
      return source;
    }
    return this.replaceCoreText(source, translated);
  }
  translateDynamicSource(normalizedSource, messages, sourceKeyByText) {
    const adminJobDetailTranslation = this.translateAdminJobDetailSource(normalizedSource, messages);
    if (adminJobDetailTranslation) {
      return adminJobDetailTranslation;
    }
    const helpEditorTranslation = this.translateHelpEditorSource(normalizedSource, messages);
    if (helpEditorTranslation) {
      return helpEditorTranslation;
    }
    const composite = this.translateCompositeSource(normalizedSource, messages, sourceKeyByText);
    if (composite) {
      return composite;
    }
    const paramsUpdatedMatch = normalizedSource.match(/^Updated\s+(.+?)\s+parameters\.$/i);
    if (paramsUpdatedMatch) {
      const translated = messages["admin.params.summary.updated"];
      if (translated) {
        return this.interpolate(translated, {
          section: this.resolveCoreTranslation(paramsUpdatedMatch[1] ?? "", messages, sourceKeyByText) ?? paramsUpdatedMatch[1] ?? ""
        });
      }
    }
    const paramsRevertedMatch = normalizedSource.match(/^Reverted\s+(.+?)\s+parameters\s+to\s+version\s+(\d+)\.$/i);
    if (paramsRevertedMatch) {
      const translated = messages["admin.params.summary.reverted"];
      if (translated) {
        return this.interpolate(translated, {
          section: this.resolveCoreTranslation(paramsRevertedMatch[1] ?? "", messages, sourceKeyByText) ?? paramsRevertedMatch[1] ?? "",
          version: paramsRevertedMatch[2] ?? ""
        });
      }
    }
    const dateTranslation = this.translateEnglishDateSource(normalizedSource);
    if (dateTranslation) {
      return dateTranslation;
    }
    const feedbackItemsMatch = normalizedSource.match(/^(\d+)\/(\d+) feedback items? pending\.$/i);
    if (feedbackItemsMatch) {
      const translated = messages["feedback.items.pending.count"];
      return translated ? this.interpolate(translated, {
        pending: feedbackItemsMatch[1] ?? "0",
        total: feedbackItemsMatch[2] ?? "0"
      }) : null;
    }
    const minimumCharactersMatch = normalizedSource.match(/^Minimum (\d+) characters \((\d+) left\)\.$/i);
    if (minimumCharactersMatch) {
      const translated = messages["minimum.characters.left.count"];
      return translated ? this.interpolate(translated, {
        min: minimumCharactersMatch[1] ?? "0",
        left: minimumCharactersMatch[2] ?? "0"
      }) : null;
    }
    const savedContactsMatch = normalizedSource.match(/^(\d+) saved contacts?$/i);
    if (savedContactsMatch) {
      const translated = messages["saved.contacts.count"];
      return translated ? this.interpolate(translated, { count: savedContactsMatch[1] ?? "0" }) : null;
    }
    const methodsMatch = normalizedSource.match(/^(\d+) methods?$/i);
    if (methodsMatch) {
      const translated = messages["methods.count"];
      return translated ? this.interpolate(translated, { count: methodsMatch[1] ?? "0" }) : null;
    }
    const membersMatch = normalizedSource.match(/^(\d+) members?$/i);
    if (membersMatch) {
      const translated = messages["members.count"];
      return translated ? this.interpolate(translated, { count: membersMatch[1] ?? "0" }) : null;
    }
    const noItemsMatch = normalizedSource.match(/^No (.+) items in this filter\.$/i);
    if (noItemsMatch) {
      const translated = messages["no.filtered.items"];
      const item = noItemsMatch[1] ?? "";
      const itemLabel = this.resolveCoreTranslation(item, messages, sourceKeyByText) ?? item;
      return translated ? this.interpolate(translated, { item: itemLabel }) : null;
    }
    const singleRateMatch = normalizedSource.match(/^Single (given|received) · (.+)$/i);
    if (singleRateMatch) {
      const direction = this.resolveCoreTranslation(`Single ${singleRateMatch[1]}`, messages, sourceKeyByText) ?? `Single ${singleRateMatch[1]}`;
      return `${direction} \xB7 ${singleRateMatch[2] ?? ""}`.trim();
    }
    const reportedTargetMatch = normalizedSource.match(/^(.+?) reported (.+)$/i);
    if (reportedTargetMatch) {
      const translated = messages["reporter.reported.target"];
      return translated ? this.interpolate(translated, {
        reporter: reportedTargetMatch[1] ?? "",
        target: reportedTargetMatch[2] ?? ""
      }) : null;
    }
    const signalsMatch = normalizedSource.match(/^(\d+) signals?$/i);
    if (signalsMatch) {
      const translated = messages["signals.count"];
      return translated ? this.interpolate(translated, { count: signalsMatch[1] ?? "0" }) : null;
    }
    const percentLabelMatch = normalizedSource.match(/^(.+?)\s+(\d+)%$/);
    if (percentLabelMatch) {
      const label = percentLabelMatch[1] ?? "";
      const translatedLabel = this.resolveCoreTranslation(label, messages, sourceKeyByText);
      return translatedLabel ? `${translatedLabel} ${percentLabelMatch[2] ?? "0"}%` : null;
    }
    return null;
  }
  translateAdminJobDetailSource(normalizedSource, messages) {
    const translate = (key, values = {}) => {
      const template = messages[key];
      return template ? this.interpolate(template, values) : null;
    };
    const exactKeys = {
      "Rule was not found.": "admin.jobs.run.detail.rule.not.found",
      "Manual start requested.": "admin.jobs.run.detail.manual.requested",
      "Manual matched room assignment started.": "admin.jobs.run.detail.matched.started",
      "This rule is action driven and has no manual worker.": "admin.jobs.run.detail.action.no.manual.worker",
      "Loading published events for matched rooms.": "admin.jobs.run.detail.loading.published",
      "Scheduled process is running.": "admin.jobs.run.detail.scheduled.running",
      "Starting scheduled process.": "admin.jobs.run.detail.scheduled.starting",
      "Scheduled random grouping started.": "admin.jobs.run.detail.scheduled.random.started",
      "Loaded eligible random events.": "admin.jobs.run.detail.loaded.eligible",
      "Generated random event group plans.": "admin.jobs.run.detail.generated.scheduled",
      "Scanning expired event counters.": "admin.jobs.run.detail.counter.scanning",
      "No expired event counters or ticket records were due.": "admin.jobs.run.detail.counter.none.due",
      "Scanning expired checkout basket drafts.": "admin.jobs.run.detail.checkout.scanning",
      "No expired checkout basket items were due.": "admin.jobs.run.detail.checkout.none.due"
    };
    const exactKey = exactKeys[normalizedSource];
    if (exactKey) {
      return translate(exactKey);
    }
    const runningForMatch = normalizedSource.match(/^(.+)\s+Running for\s+(\d+)s\.$/i);
    if (runningForMatch) {
      const detail = runningForMatch[1] ?? "";
      return translate("admin.jobs.run.detail.running.for", {
        detail: this.translateAdminJobDetailSource(detail, messages) ?? detail,
        seconds: runningForMatch[2] ?? "0"
      });
    }
    const loadedRecordsMatch = normalizedSource.match(/^Loaded\s+(\d+)\s+event record\(s\)\.$/i);
    if (loadedRecordsMatch) {
      return translate("admin.jobs.run.detail.loaded.records", { events: loadedRecordsMatch[1] ?? "0" });
    }
    const queriedEmptyMatch = normalizedSource.match(/^Queried\s+(\d+)\s+backend lookup\(s\); event has no eligible accepted members\.$/i);
    if (queriedEmptyMatch) {
      return translate("admin.jobs.run.detail.queried.no.eligible", { queries: queriedEmptyMatch[1] ?? "0" });
    }
    const queriedCandidatesMatch = normalizedSource.match(/^Queried\s+(\d+)\s+backend lookup\(s\); found\s+(\d+)\s+candidate user\(s\)\.$/i);
    if (queriedCandidatesMatch) {
      return translate("admin.jobs.run.detail.queried.candidates", {
        queries: queriedCandidatesMatch[1] ?? "0",
        users: queriedCandidatesMatch[2] ?? "0"
      });
    }
    const noGraphMatch = normalizedSource.match(/^No candidate user graph was available after\s+(\d+)\s+backend lookup\(s\)\.$/i);
    if (noGraphMatch) {
      return translate("admin.jobs.run.detail.no.candidate.graph", { queries: noGraphMatch[1] ?? "0" });
    }
    const builtGraphMatch = normalizedSource.match(/^Built candidate user graph after\s+(\d+)\s+backend lookup\(s\)\.$/i);
    if (builtGraphMatch) {
      return translate("admin.jobs.run.detail.built.candidate.graph", { queries: builtGraphMatch[1] ?? "0" });
    }
    const startingAssignmentMatch = normalizedSource.match(/^Starting random assignment for\s+(\d+)\s+sub-event\(s\)\.$/i);
    if (startingAssignmentMatch) {
      return translate("admin.jobs.run.detail.starting.assignment", {
        subEvents: startingAssignmentMatch[1] ?? "0"
      });
    }
    const processingSubEventMatch = normalizedSource.match(/^Processing sub-event\s+(\d+)\/(\d+)\.$/i);
    if (processingSubEventMatch) {
      return translate("admin.jobs.run.detail.processing.sub.event", {
        current: processingSubEventMatch[1] ?? "0",
        total: processingSubEventMatch[2] ?? "0"
      });
    }
    const skippedSubEventMatch = normalizedSource.match(/^Skipped sub-event\s+(\d+)\/(\d+); no target groups\.$/i);
    if (skippedSubEventMatch) {
      return translate("admin.jobs.run.detail.skipped.sub.event", {
        current: skippedSubEventMatch[1] ?? "0",
        total: skippedSubEventMatch[2] ?? "0"
      });
    }
    const processedSubEventMatch = normalizedSource.match(/^Processed sub-event\s+(\d+)\/(\d+),\s+(\d+)\s+candidate user\(s\),\s+(\d+)\s+backend lookup\(s\)\.$/i);
    if (processedSubEventMatch) {
      return translate("admin.jobs.run.detail.processed.sub.event", {
        current: processedSubEventMatch[1] ?? "0",
        total: processedSubEventMatch[2] ?? "0",
        users: processedSubEventMatch[3] ?? "0",
        queries: processedSubEventMatch[4] ?? "0"
      });
    }
    const processedEventsMatch = normalizedSource.match(/^Processed\s+(\d+)\/(\d+)\s+random event\(s\),\s+(\d+)\s+candidate user\(s\),\s+(\d+)\s+backend lookup\(s\)\.$/i);
    if (processedEventsMatch) {
      return translate("admin.jobs.run.detail.processed.events", {
        current: processedEventsMatch[1] ?? "0",
        total: processedEventsMatch[2] ?? "0",
        users: processedEventsMatch[3] ?? "0",
        queries: processedEventsMatch[4] ?? "0"
      });
    }
    const finalizingMatch = normalizedSource.match(/^Finalizing random event groups after\s+(\d+)\s+backend lookup\(s\)\.$/i);
    if (finalizingMatch) {
      return translate("admin.jobs.run.detail.finalizing", { queries: finalizingMatch[1] ?? "0" });
    }
    const generatedMatch = normalizedSource.match(/^Generated\s+(\d+)\s+random group plan\(s\) for\s+(\d+)\s+user\(s\)\.$/i);
    if (generatedMatch) {
      return translate("admin.jobs.run.detail.generated", {
        plans: generatedMatch[1] ?? "0",
        users: generatedMatch[2] ?? "0"
      });
    }
    const expiredCountersMatch = normalizedSource.match(/^Expired\s+(\d+)\s+event source\(s\), refreshed\s+(\d+)\/(\d+)\s+affected user counter document\(s\), marked\s+(\d+)\s+event record\(s\), and marked\s+(\d+)\s+ticket record\(s\)\.$/i);
    if (expiredCountersMatch) {
      return translate("admin.jobs.run.detail.counter.expired", {
        sources: expiredCountersMatch[1] ?? "0",
        updatedUsers: expiredCountersMatch[2] ?? "0",
        affectedUsers: expiredCountersMatch[3] ?? "0",
        eventRecords: expiredCountersMatch[4] ?? "0",
        ticketRecords: expiredCountersMatch[5] ?? "0"
      });
    }
    const checkoutMarkedMatch = normalizedSource.match(/^Marked\s+(\d+)\s+expired checkout basket item\(s\) as deleted\.$/i);
    if (checkoutMarkedMatch) {
      return translate("admin.jobs.run.detail.checkout.marked", { count: checkoutMarkedMatch[1] ?? "0" });
    }
    return null;
  }
  translateHelpEditorSource(normalizedSource, messages) {
    const sectionsWithDateMatch = normalizedSource.match(/^(\d+) sections? · (.+)$/i);
    if (sectionsWithDateMatch) {
      const countText = this.translateCount(messages, "sections.count", sectionsWithDateMatch[1] ?? "0");
      return countText ? `${countText} \xB7 ${sectionsWithDateMatch[2] ?? ""}` : null;
    }
    const sectionsMatch = normalizedSource.match(/^(\d+) sections?$/i);
    if (sectionsMatch) {
      return this.translateCount(messages, "sections.count", sectionsMatch[1] ?? "0");
    }
    const activeMatch = normalizedSource.match(/^Active (help|privacy|terms|explanation) v(\d+)$/i);
    if (activeMatch) {
      return this.interpolateDocumentMessage(messages, `active.${this.documentKey(activeMatch[1])}.version`, {
        version: activeMatch[2] ?? "0"
      });
    }
    const noActiveMatch = normalizedSource.match(/^No active (help|privacy|terms|explanation) revision$/i);
    if (noActiveMatch) {
      return this.documentMessage(messages, `no.active.${this.documentKey(noActiveMatch[1])}.revision`);
    }
    const loadingMatch = normalizedSource.match(/^Loading (help|privacy|terms|explanation) revisions$/i);
    if (loadingMatch) {
      return this.documentMessage(messages, `loading.${this.documentKey(loadingMatch[1])}.revisions`);
    }
    const noRevisionsMatch = normalizedSource.match(/^No (help|privacy|terms|explanation) revisions$/i);
    if (noRevisionsMatch) {
      return this.documentMessage(messages, `no.${this.documentKey(noRevisionsMatch[1])}.revisions`);
    }
    const enablePopupMatch = normalizedSource.match(/^Create a revision to enable the (help|privacy|terms|explanation) popup\.$/i);
    if (enablePopupMatch) {
      return this.documentMessage(messages, `create.revision.to.enable.${this.documentKey(enablePopupMatch[1])}.popup`);
    }
    const revisionsLabelMatch = normalizedSource.match(/^(Help|Privacy|Terms|Explanation) revisions$/i);
    if (revisionsLabelMatch) {
      return this.documentMessage(messages, `${this.documentKey(revisionsLabelMatch[1])}.revisions`);
    }
    const popupHeaderMatch = normalizedSource.match(/^(Help|Privacy|Terms|Explanation) popup header$/i);
    if (popupHeaderMatch) {
      return this.documentMessage(messages, `${this.documentKey(popupHeaderMatch[1])}.popup.header`);
    }
    const descriptionMatch = normalizedSource.match(/^(Help|Privacy|Terms|Explanation) description$/i);
    if (descriptionMatch) {
      return this.documentMessage(messages, `${this.documentKey(descriptionMatch[1])}.description`);
    }
    const sectionTitleMatch = normalizedSource.match(/^(Help|Privacy|Terms|Explanation) section title$/i);
    if (sectionTitleMatch) {
      return this.documentMessage(messages, `${this.documentKey(sectionTitleMatch[1])}.section.title`);
    }
    const sectionActionMatch = normalizedSource.match(/^(Add|Remove|Toggle) (help|privacy|terms|explanation) section$/i);
    if (sectionActionMatch) {
      return this.documentMessage(messages, `${sectionActionMatch[1]?.toLocaleLowerCase("en-US")}.${this.documentKey(sectionActionMatch[2])}.section`);
    }
    const unableMatch = normalizedSource.match(/^Unable to (load|save|activate|delete) (help|privacy|terms|explanation) revision(s)?\.$/i);
    if (unableMatch) {
      return this.documentMessage(messages, `unable.to.${unableMatch[1]?.toLocaleLowerCase("en-US")}.${this.documentKey(unableMatch[2])}.revisions`);
    }
    return null;
  }
  documentKey(value) {
    const normalized = `${value ?? ""}`.trim().toLocaleLowerCase("en-US");
    if (normalized === "privacy" || normalized === "terms" || normalized === "explanation") {
      return normalized;
    }
    return "help";
  }
  documentMessage(messages, key) {
    return messages[key] ?? null;
  }
  interpolateDocumentMessage(messages, key, values) {
    const template = this.documentMessage(messages, key);
    return template ? this.interpolate(template, values) : null;
  }
  translateCount(messages, key, count) {
    const template = messages[key];
    return template ? this.interpolate(template, { count }) : null;
  }
  translateEnglishDateSource(normalizedSource) {
    if (this.currentLanguageSignal() === _I18nService.DEFAULT_LANGUAGE) {
      return null;
    }
    const weekdayDateMatch = normalizedSource.match(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat), (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})$/i);
    if (weekdayDateMatch) {
      const date = this.englishDate(weekdayDateMatch[4], weekdayDateMatch[2], weekdayDateMatch[3]);
      return date ? this.formatDate(date, { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : null;
    }
    const monthDateMatch = normalizedSource.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})$/i);
    if (monthDateMatch) {
      const date = this.englishDate(monthDateMatch[3], monthDateMatch[1], monthDateMatch[2]);
      return date ? this.formatDate(date, { year: "numeric", month: "short", day: "numeric" }) : null;
    }
    const dayMonthDateMatch = normalizedSource.match(/^(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/i);
    if (dayMonthDateMatch) {
      const date = this.englishDate(dayMonthDateMatch[3], dayMonthDateMatch[2], dayMonthDateMatch[1]);
      return date ? this.formatDate(date, { year: "numeric", month: "short", day: "numeric" }) : null;
    }
    return null;
  }
  englishDate(yearValue, monthValue, dayValue) {
    const year = Number(yearValue);
    const monthIndex = this.englishMonthIndex(monthValue ?? "");
    const day = Number(dayValue);
    if (!Number.isInteger(year) || !Number.isInteger(day) || monthIndex < 0 || day < 1 || day > 31) {
      return null;
    }
    return new Date(Date.UTC(year, monthIndex, day, 12));
  }
  englishMonthIndex(value) {
    return ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(value.trim().slice(0, 3).toLocaleLowerCase("en-US"));
  }
  formatDate(date, options) {
    try {
      return new Intl.DateTimeFormat(this.currentIntlLocale(), __spreadProps(__spreadValues({}, options), {
        timeZone: "UTC"
      })).format(date);
    } catch {
      return "";
    }
  }
  currentIntlLocale() {
    return this.currentLanguageSignal() === "hu" ? "hu-HU" : _I18nService.DEFAULT_LANGUAGE;
  }
  translateCompositeSource(normalizedSource, messages, sourceKeyByText) {
    if (normalizedSource.includes(" \xB7 ")) {
      const parts = normalizedSource.split(" \xB7 ");
      const translatedParts = parts.map((part) => this.resolveCoreTranslation(part, messages, sourceKeyByText) ?? part);
      return translatedParts.some((part, index) => part !== parts[index]) ? translatedParts.join(" \xB7 ") : null;
    }
    if (normalizedSource.includes(", ")) {
      const parts = normalizedSource.split(", ");
      const translatedParts = parts.map((part) => this.resolveCoreTranslation(part, messages, sourceKeyByText) ?? part);
      return translatedParts.some((part, index) => part !== parts[index]) ? translatedParts.join(", ") : null;
    }
    return null;
  }
  resolveCoreTranslation(normalizedSource, messages, sourceKeyByText) {
    for (const candidate of this.sourceLookupCandidates(normalizedSource)) {
      const sourceBundleKey = sourceKeyByText[candidate];
      const translated = messages[candidate] ?? (sourceBundleKey ? messages[sourceBundleKey] : null);
      if (translated) {
        return translated;
      }
    }
    return null;
  }
  sourceLookupCandidates(value) {
    const normalized = this.normalizeSourceKey(value);
    const lower = normalized.toLocaleLowerCase("en-US");
    const upper = normalized.toLocaleUpperCase("en-US");
    return [normalized, lower, upper].filter((candidate, index, values) => candidate && values.indexOf(candidate) === index);
  }
  interpolate(template, values) {
    return template.replace(/\{\{([a-zA-Z0-9_.-]+)\}\}|\{([a-zA-Z0-9_.-]+)\}/g, (match, doubleBraceKey, singleBraceKey) => {
      const key = doubleBraceKey ?? singleBraceKey ?? "";
      return values[key] ?? match;
    });
  }
  normalizeSourceKey(value) {
    return `${value ?? ""}`.trim().replace(/\s+/g, " ");
  }
  replaceCoreText(source, translatedCore) {
    const leading = source.match(/^\s*/)?.[0] ?? "";
    const trailing = source.match(/\s*$/)?.[0] ?? "";
    return `${leading}${translatedCore}${trailing}`;
  }
  hasLetters(value) {
    return Array.from(value).some((char) => char.toLocaleLowerCase("en-US") !== char.toLocaleUpperCase("en-US"));
  }
  shouldSkipAttributeElement(element) {
    return Boolean(element.closest(_I18nService.SKIP_ATTRIBUTE_SELECTOR));
  }
  shouldSkipTextElement(element) {
    return Boolean(element.closest(_I18nService.SKIP_TEXT_SELECTOR));
  }
  static \u0275fac = function I18nService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _I18nService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _I18nService, factory: _I18nService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(I18nService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  I18nService
};
//# sourceMappingURL=chunk-Q3344WPR.js.map
