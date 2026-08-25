import {
  EventsService
} from "./chunk-2LVO4Z3J.js";
import {
  GameService,
  HttpActivityInviteCandidatesService,
  HttpActivityMembersService,
  HttpActivityResourcesService,
  HttpAdminAffinityGraphService,
  HttpAdminModerationService,
  HttpAdminMonitoringService,
  HttpAdminNotificationsService,
  HttpAdminParamsService,
  HttpAdminStatsService,
  HttpAssetTicketsService,
  HttpAssetsService,
  HttpChatsService,
  HttpContactsService,
  HttpHelpCenterService,
  HttpIdeaPostsService,
  HttpLandingContentService,
  HttpMediaService,
  HttpNotificationsService,
  HttpOperatorRegistryService,
  HttpRatesService,
  HttpUserExperiencesService,
  LocalActivityInviteCandidatesService,
  LocalActivityMembersService,
  LocalActivityResourcesService,
  LocalAdminAffinityGraphService,
  LocalAdminModerationService,
  LocalAdminMonitoringService,
  LocalAdminNotificationsService,
  LocalAdminParamsService,
  LocalAdminStatsService,
  LocalAssetTicketsService,
  LocalAssetsService,
  LocalChatsService,
  LocalContactsService,
  LocalHelpCenterService,
  LocalIdeaPostsService,
  LocalLandingContentService,
  LocalMediaService,
  LocalNotificationsService,
  LocalOperatorRegistryService,
  LocalRatesService,
  LocalUserExperiencesService,
  RateOutboxService
} from "./chunk-4M7S3PHB.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import {
  BaseRouteModeService
} from "./chunk-7MTG4XZU.js";
import {
  ActivityStore,
  RouteDelayService,
  UserProfileStore,
  cloneHelpCenterRevision,
  cloneHelpCenterState
} from "./chunk-KLUOB5SD.js";
import {
  APP_STORAGE_KEYS
} from "./chunk-LERGHE7K.js";
import {
  Injectable,
  Injector,
  __objRest,
  __spreadProps,
  __spreadValues,
  computed,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/help-center.store.ts
var HelpCenterStore = class _HelpCenterStore {
  _privacyState = signal(null, ...ngDevMode ? [{ debugName: "_privacyState" }] : (
    /* istanbul ignore next */
    []
  ));
  privacyState = this._privacyState.asReadonly();
  activePrivacyRevision = computed(() => {
    const revision = this._privacyState()?.activeRevision ?? null;
    return revision ? cloneHelpCenterRevision(revision) : null;
  }, ...ngDevMode ? [{ debugName: "activePrivacyRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  setPrivacyState(state) {
    this._privacyState.set(state ? cloneHelpCenterState(state) : null);
  }
  static \u0275fac = function HelpCenterStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HelpCenterStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HelpCenterStore, factory: _HelpCenterStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HelpCenterStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/help-center.service.ts
var HelpCenterService = class _HelpCenterService extends BaseRouteModeService {
  localHelpCenterService = inject(LocalHelpCenterService);
  httpHelpCenterService = inject(HttpHelpCenterService);
  helpCenterStore = inject(HelpCenterStore);
  helpStateRef = signal(null, ...ngDevMode ? [{ debugName: "helpStateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  privacyStateRef = signal(null, ...ngDevMode ? [{ debugName: "privacyStateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  termsStateRef = signal(null, ...ngDevMode ? [{ debugName: "termsStateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  explanationStateRef = signal(null, ...ngDevMode ? [{ debugName: "explanationStateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  preloadPromises = {};
  state = this.helpStateRef.asReadonly();
  privacyState = this.privacyStateRef.asReadonly();
  termsState = this.termsStateRef.asReadonly();
  explanationState = this.explanationStateRef.asReadonly();
  activeRevision = computed(() => this.helpStateRef()?.activeRevision ?? null, ...ngDevMode ? [{ debugName: "activeRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activePrivacyRevision = computed(() => this.privacyStateRef()?.activeRevision ?? null, ...ngDevMode ? [{ debugName: "activePrivacyRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activeTermsRevision = computed(() => this.termsStateRef()?.activeRevision ?? null, ...ngDevMode ? [{ debugName: "activeTermsRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activeExplanationRevision = computed(() => this.explanationStateRef()?.activeRevision ?? null, ...ngDevMode ? [{ debugName: "activeExplanationRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  hasActiveRevision = computed(() => Boolean(this.activeRevision()), ...ngDevMode ? [{ debugName: "hasActiveRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  hasActivePrivacyRevision = computed(() => Boolean(this.activePrivacyRevision()), ...ngDevMode ? [{ debugName: "hasActivePrivacyRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  hasActiveTermsRevision = computed(() => Boolean(this.activeTermsRevision()), ...ngDevMode ? [{ debugName: "hasActiveTermsRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  hasActiveExplanationRevision = computed(() => Boolean(this.activeExplanationRevision()), ...ngDevMode ? [{ debugName: "hasActiveExplanationRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activeVersionLabel = computed(() => this.versionLabel(this.activeRevision()?.version), ...ngDevMode ? [{ debugName: "activeVersionLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  activePrivacyVersionLabel = computed(() => this.versionLabel(this.activePrivacyRevision()?.version), ...ngDevMode ? [{ debugName: "activePrivacyVersionLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  activeTermsVersionLabel = computed(() => this.versionLabel(this.activeTermsRevision()?.version), ...ngDevMode ? [{ debugName: "activeTermsVersionLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  activeExplanationVersionLabel = computed(() => this.versionLabel(this.activeExplanationRevision()?.version), ...ngDevMode ? [{ debugName: "activeExplanationVersionLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  async preload(kind = "help") {
    const documentKind = this.normalizeKind(kind);
    if (!this.preloadPromises[documentKind]) {
      this.preloadPromises[documentKind] = this.loadState(documentKind).finally(() => {
        delete this.preloadPromises[documentKind];
      });
    }
    return this.preloadPromises[documentKind];
  }
  async preloadAll() {
    await Promise.all([
      this.preload("help"),
      this.preload("privacy"),
      this.preload("terms")
    ]);
  }
  applyState(kind, state) {
    this.setState(this.normalizeKind(kind), state);
  }
  async refresh(kind = "help", contextKey) {
    return this.loadState(this.normalizeKind(kind), void 0, contextKey);
  }
  async loadExplanationState(contextKey, lang) {
    return this.loadState("explanation", lang, contextKey);
  }
  async loadPrivacyConsent(userId, revisionId, revisionVersion) {
    const consent = await this.privacyConsentService().loadPrivacyConsent(userId, revisionId, revisionVersion);
    return consent ? this.clonePrivacyConsent(consent) : null;
  }
  async savePrivacyConsent(request) {
    return this.clonePrivacyConsent(await this.privacyConsentService().savePrivacyConsent(request));
  }
  async loadAdminState(adminUserId, kind = "help", lang = "en", contextKey) {
    const documentKind = this.normalizeKind(kind);
    const service = this.helpService(documentKind);
    const state = await service.loadAdminState(adminUserId, documentKind, lang, contextKey);
    this.setState(documentKind, state);
    return this.cloneState(state);
  }
  async saveRevision(request, kind = "help") {
    const documentKind = this.normalizeKind(kind);
    const state = await this.helpService(documentKind).saveRevision(request, documentKind);
    this.setState(documentKind, state);
    return this.cloneState(state);
  }
  async activateRevision(revisionId, actorUserId, kind = "help") {
    const documentKind = this.normalizeKind(kind);
    const state = await this.helpService(documentKind).activateRevision(revisionId, actorUserId, documentKind);
    this.setState(documentKind, state);
    return this.cloneState(state);
  }
  async deleteRevision(revisionId, actorUserId, kind = "help") {
    const documentKind = this.normalizeKind(kind);
    const state = await this.helpService(documentKind).deleteRevision(revisionId, actorUserId, documentKind);
    this.setState(documentKind, state);
    return this.cloneState(state);
  }
  async loadState(kind, lang, contextKey) {
    const state = await this.helpService(kind).loadState(kind, lang, contextKey);
    this.setState(kind, state);
    return this.cloneState(state);
  }
  helpService(kind) {
    return this.resolveRouteService(`/${kind}/active`, this.localHelpCenterService, this.httpHelpCenterService);
  }
  privacyConsentService() {
    return this.resolveRouteService("/privacy/consents", this.localHelpCenterService, this.httpHelpCenterService);
  }
  setState(kind, state) {
    const cloned = this.cloneState(state);
    if (kind === "privacy") {
      this.privacyStateRef.set(cloned);
      this.helpCenterStore.setPrivacyState(cloned);
      return;
    }
    if (kind === "terms") {
      this.termsStateRef.set(cloned);
      return;
    }
    if (kind === "explanation") {
      this.explanationStateRef.set(cloned);
      return;
    }
    this.helpStateRef.set(cloned);
  }
  normalizeKind(kind) {
    if (kind === "privacy" || kind === "terms" || kind === "explanation") {
      return kind;
    }
    return "help";
  }
  versionLabel(version) {
    return Number.isFinite(Number(version)) && Number(version) > 0 ? `v${Math.trunc(Number(version))}` : "";
  }
  cloneState(state) {
    return {
      activeRevision: state.activeRevision ? __spreadProps(__spreadValues({}, state.activeRevision), {
        sections: state.activeRevision.sections.map((section) => __spreadProps(__spreadValues({}, section), {
          imageUrls: [...section.imageUrls ?? []]
        }))
      }) : null,
      revisions: state.revisions.map((revision) => __spreadProps(__spreadValues({}, revision), {
        sections: revision.sections.map((section) => __spreadProps(__spreadValues({}, section), {
          imageUrls: [...section.imageUrls ?? []]
        }))
      })),
      auditTrail: state.auditTrail.map((entry) => __spreadValues({}, entry)),
      availableLanguages: state.availableLanguages.map((language) => __spreadValues({}, language))
    };
  }
  clonePrivacyConsent(consent) {
    return __spreadProps(__spreadValues({}, consent), {
      approvedOptionalSectionIds: [...consent.approvedOptionalSectionIds]
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275HelpCenterService_BaseFactory;
    return function HelpCenterService_Factory(__ngFactoryType__) {
      return (\u0275HelpCenterService_BaseFactory || (\u0275HelpCenterService_BaseFactory = \u0275\u0275getInheritedFactory(_HelpCenterService)))(__ngFactoryType__ || _HelpCenterService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HelpCenterService, factory: _HelpCenterService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HelpCenterService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/idea-posts.service.ts
var IdeaPostsService = class _IdeaPostsService extends BaseRouteModeService {
  static ARTICLE_FALLBACK_IMAGE_URL = "assets/idea/article-fallback.svg";
  static PUBLIC_IDEAS_ROUTE = "/landing/articles";
  localIdeaPostsService = inject(LocalIdeaPostsService);
  httpIdeaPostsService = inject(HttpIdeaPostsService);
  postsRef = signal([], ...ngDevMode ? [{ debugName: "postsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  adminPostsRef = signal([], ...ngDevMode ? [{ debugName: "adminPostsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  adminPostSyncRef = signal(null, ...ngDevMode ? [{ debugName: "adminPostSyncRef" }] : (
    /* istanbul ignore next */
    []
  ));
  adminPostsLang = "en";
  posts = this.postsRef.asReadonly();
  adminPosts = this.adminPostsRef.asReadonly();
  adminPostSync = this.adminPostSyncRef.asReadonly();
  applyPublishedPosts(posts) {
    this.postsRef.set(this.clonePosts(posts).filter((post) => post.published && !post.trashed).sort((left, right) => this.sortValue(right) - this.sortValue(left)));
  }
  async loadPublishedPosts(lang) {
    const posts = await this.ideaService().loadPublishedPosts(lang);
    this.applyPublishedPosts(posts);
    return this.clonePosts(this.postsRef());
  }
  async loadPublishedPostsPage(lang, query = {}, signal2) {
    const result = await this.publicIdeaService().loadPublishedPostsPage(lang, query, signal2);
    return {
      records: this.clonePosts(result.records),
      total: Math.max(0, Math.trunc(Number(result.total) || 0)),
      nextCursor: `${result.nextCursor ?? ""}`.trim() || null
    };
  }
  async loadPublishedIdeaCardsPage(query = {}, options = {}) {
    const result = await this.loadPublishedPostsPage(options.lang, query, options.signal);
    return {
      items: this.publishedIdeaInfoCards(result.records),
      total: result.total,
      nextCursor: result.nextCursor
    };
  }
  async loadAdminPosts(adminUserId, lang = "en") {
    const posts = await this.ideaService().loadAdminPosts(adminUserId, lang);
    const cloned = this.clonePosts(posts).sort((left, right) => this.compareAdminPosts(left, right));
    this.adminPostsLang = this.normalizeLang(lang);
    this.adminPostsRef.set(cloned);
    this.applyPublishedPosts(cloned.filter((post) => post.published));
    return this.clonePosts(cloned);
  }
  async loadAdminPostsSnapshot(adminUserId, lang = "en") {
    const posts = await this.ideaService().loadAdminPosts(adminUserId, lang);
    return this.clonePosts(posts).sort((left, right) => this.compareAdminPosts(left, right));
  }
  async loadAdminPostsPage(adminUserId, lang = "en", query = {}) {
    const page = await this.ideaService().loadAdminPostsPage(adminUserId, lang, query);
    const records = this.clonePosts(page.records).sort((left, right) => this.compareAdminPosts(left, right));
    this.adminPostsLang = this.normalizeLang(lang);
    this.adminPostsRef.set(this.shouldResetAdminPage(query) ? records : this.mergePostLists(this.adminPostsRef(), records));
    return {
      records,
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null,
      counts: {
        all: Math.max(0, Math.trunc(Number(page.counts?.all) || 0)),
        featured: Math.max(0, Math.trunc(Number(page.counts?.featured) || 0)),
        published: Math.max(0, Math.trunc(Number(page.counts?.published) || 0)),
        drafts: Math.max(0, Math.trunc(Number(page.counts?.drafts) || 0)),
        trashed: Math.max(0, Math.trunc(Number(page.counts?.trashed) || 0))
      }
    };
  }
  async savePost(request) {
    const post = await this.ideaService().savePost(request);
    this.mergeAdminPost(post);
    const sync = __spreadProps(__spreadValues({}, post), { imageUrls: [...post.imageUrls] });
    this.adminPostSyncRef.set(sync);
    return sync;
  }
  async deletePost(postId, actorUserId) {
    const post = await this.ideaService().deletePost(postId, actorUserId);
    this.mergeAdminPost(post);
    const sync = __spreadProps(__spreadValues({}, post), { imageUrls: [...post.imageUrls] });
    this.adminPostSyncRef.set(sync);
    return sync;
  }
  async restorePost(postId, actorUserId) {
    const post = await this.ideaService().restorePost(postId, actorUserId);
    this.mergeAdminPost(post);
    const sync = __spreadProps(__spreadValues({}, post), { imageUrls: [...post.imageUrls] });
    this.adminPostSyncRef.set(sync);
    return sync;
  }
  clearAdminPostSync() {
    this.adminPostSyncRef.set(null);
  }
  publishedIdeaInfoCards(posts = this.postsRef()) {
    return posts.map((post) => this.entryIdeaInfoCard(post));
  }
  adminIdeaInfoCards(posts = this.adminPostsRef()) {
    return posts.map((post) => this.adminIdeaInfoCard(post));
  }
  entryIdeaInfoCard(post) {
    return {
      id: `entry-idea:${post.id}`,
      status: post.published ? "published" : "draft",
      dateIso: post.submittedAtIso,
      title: post.title,
      imageUrl: this.ideaImageUrl(post) || null,
      placeholderLabel: "No image",
      metaRows: [this.ideaDateLabel(post, "Fresh article")],
      metaRowsLimit: 1,
      description: post.excerpt,
      descriptionLines: 3,
      i18nIgnoreContent: true,
      leadingIcon: {
        icon: "calendar_today",
        tone: "public"
      },
      mediaEnd: post.featured ? {
        variant: "badge",
        tone: "selected",
        icon: "star",
        label: "Featured",
        selected: true,
        selectedIcon: "star",
        selectedLabel: "Featured",
        ariaLabel: "Featured article",
        interactive: false
      } : null,
      footerChips: [
        { label: "Read more", actionId: "viewArticle" }
      ],
      clickable: true,
      eagerDetail: this.ideaArticleDetail(post, "Fresh article")
    };
  }
  adminIdeaInfoCard(post) {
    const statusLabel = this.adminPostStatusLabel(post);
    const publicationAction = post.published ? "unpublish" : "publish";
    const featuredAction = post.featured ? "unfeature" : "feature";
    const menuActions = post.trashed ? ["restore"] : [
      "viewArticle",
      "edit",
      publicationAction,
      ...post.published ? [featuredAction] : [],
      "delete"
    ];
    return {
      id: `idea:${post.id}`,
      localSortKey: [-this.sortValue(post), `idea:${post.id}`],
      status: post.trashed ? "trashed" : post.published ? "published" : "draft",
      dateIso: post.submittedAtIso,
      title: post.title,
      imageUrl: this.ideaImageUrl(post) || null,
      placeholderLabel: "No image",
      metaRows: [this.ideaDateLabel(post, "No date")],
      metaRowsLimit: 1,
      description: post.excerpt,
      descriptionLines: 3,
      i18nIgnoreContent: true,
      surfaceTone: post.trashed ? "draft" : !post.published ? "draft" : post.featured ? "series" : "default",
      leadingIcon: {
        icon: post.trashed ? "delete_outline" : post.published ? "article" : "drafts",
        tone: post.published && !post.trashed ? "public" : "pending"
      },
      mediaStart: {
        variant: "badge",
        tone: post.trashed ? "full" : post.published ? "public" : "inactive",
        icon: post.trashed ? "delete_outline" : post.published ? "visibility" : "drafts",
        label: statusLabel,
        ariaLabel: statusLabel
      },
      mediaEnd: post.trashed || !post.published || !post.featured ? null : {
        variant: "badge",
        tone: "selected",
        icon: "star",
        label: "Featured",
        selected: true,
        selectedLabel: "Featured",
        selectedIcon: "star",
        ariaLabel: "Featured article",
        interactive: false
      },
      menuActions,
      menuTitle: null,
      footerChips: [],
      clickable: false,
      eagerDetail: this.ideaArticleDetail(post, "No date")
    };
  }
  mergeAdminPost(post) {
    if (this.normalizeLang(post.lang) !== this.adminPostsLang) {
      return;
    }
    const merged = this.clonePosts([
      ...this.adminPostsRef().filter((current) => current.id !== post.id),
      post
    ]).sort((left, right) => this.compareAdminPosts(left, right));
    this.adminPostsRef.set(merged);
    this.applyPublishedPosts(merged.filter((current) => current.published));
  }
  adminPostMatchesFilter(post, filter) {
    if (filter === "trashed") {
      return post.trashed;
    }
    if (post.trashed) {
      return false;
    }
    if (filter === "featured") {
      return post.featured;
    }
    if (filter === "published") {
      return post.published;
    }
    if (filter === "drafts") {
      return !post.published;
    }
    return true;
  }
  shouldResetAdminPage(query) {
    return !`${query.cursor ?? ""}`.trim();
  }
  mergePostLists(existing, incoming) {
    const byId = /* @__PURE__ */ new Map();
    for (const post of existing) {
      byId.set(post.id, post);
    }
    for (const post of incoming) {
      byId.set(post.id, post);
    }
    return this.clonePosts(Array.from(byId.values())).sort((left, right) => this.compareAdminPosts(left, right));
  }
  compareAdminPosts(left, right) {
    return this.sortValue(right) - this.sortValue(left) || right.id.localeCompare(left.id);
  }
  ideaService() {
    return this.resolveRouteService("/ideas", this.localIdeaPostsService, this.httpIdeaPostsService);
  }
  publicIdeaService() {
    return this.resolveRouteService(_IdeaPostsService.PUBLIC_IDEAS_ROUTE, this.localIdeaPostsService, this.httpIdeaPostsService);
  }
  clonePosts(posts) {
    return posts.map((post) => __spreadProps(__spreadValues({}, post), { imageUrls: [...post.imageUrls] }));
  }
  ideaArticleDetail(post, fallbackDateLabel) {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      contentHtml: this.articleContentHtml(post),
      imageUrl: this.ideaImageUrl(post),
      dateLabel: this.ideaDateLabel(post, fallbackDateLabel),
      sortAtIso: post.submittedAtIso || post.updatedAtIso || post.createdAtIso || "",
      featured: post.featured === true
    };
  }
  sortValue(post) {
    const parsed = Date.parse(post.submittedAtIso || post.updatedAtIso || post.createdAtIso || "");
    return Number.isFinite(parsed) ? parsed : 0;
  }
  normalizeLang(lang) {
    const normalized = `${lang ?? ""}`.trim().toLowerCase().split("-")[0];
    return normalized === "hu" ? "hu" : "en";
  }
  ideaImageUrl(post) {
    const imageUrl = `${post?.imageUrl ?? post?.imageUrls?.[0] ?? ""}`.trim();
    if (!imageUrl || this.isGenericArticleImage(imageUrl)) {
      return _IdeaPostsService.ARTICLE_FALLBACK_IMAGE_URL;
    }
    return imageUrl;
  }
  articleContentHtml(post) {
    return `${post.contentHtml ?? ""}`.replaceAll('src="assets/logo/heart.webp"', `src="${_IdeaPostsService.ARTICLE_FALLBACK_IMAGE_URL}"`).replaceAll('src="/assets/logo/heart.webp"', `src="${_IdeaPostsService.ARTICLE_FALLBACK_IMAGE_URL}"`).replaceAll("src='assets/logo/heart.webp'", `src='${_IdeaPostsService.ARTICLE_FALLBACK_IMAGE_URL}'`).replaceAll("src='/assets/logo/heart.webp'", `src='${_IdeaPostsService.ARTICLE_FALLBACK_IMAGE_URL}'`);
  }
  isGenericArticleImage(imageUrl) {
    const normalized = imageUrl.split(/[?#]/, 1)[0].replace(/^\/+/, "").toLowerCase();
    return normalized === "assets/logo/heart.webp" || normalized === "assets/logo/heart.png";
  }
  ideaDateLabel(post, fallback) {
    const parsed = Date.parse(post?.submittedAtIso || post?.updatedAtIso || post?.createdAtIso || "");
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return new Intl.DateTimeFormat(void 0, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(parsed));
  }
  adminPostStatusLabel(post) {
    if (post.trashed) {
      return "Trashed";
    }
    if (!post.published) {
      return "Draft";
    }
    return "Published";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275IdeaPostsService_BaseFactory;
    return function IdeaPostsService_Factory(__ngFactoryType__) {
      return (\u0275IdeaPostsService_BaseFactory || (\u0275IdeaPostsService_BaseFactory = \u0275\u0275getInheritedFactory(_IdeaPostsService)))(__ngFactoryType__ || _IdeaPostsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _IdeaPostsService, factory: _IdeaPostsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IdeaPostsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/privacy-policy.service.ts
var PrivacyPolicyService = class _PrivacyPolicyService {
  static ENTRY_CONSENT_KEY = APP_STORAGE_KEYS.entryConsent;
  static OPTIONAL_PRIVACY_APPROVAL_KEY = APP_STORAGE_KEYS.optionalPrivacyApprovals;
  helpCenter = inject(HelpCenterService);
  loadingRef = signal(false, ...ngDevMode ? [{ debugName: "loadingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = this.loadingRef.asReadonly();
  state = this.helpCenter.privacyState;
  activeRevision = computed(() => this.helpCenter.activePrivacyRevision(), ...ngDevMode ? [{ debugName: "activeRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  hasActiveRevision = computed(() => Boolean(this.activeRevision()), ...ngDevMode ? [{ debugName: "hasActiveRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activeVersionLabel = this.helpCenter.activePrivacyVersionLabel;
  async prepareOpen(options = {}) {
    const lazy = options.lazy !== false;
    const current = this.activeRevision();
    if (current || !lazy) {
      return current;
    }
    this.loadingRef.set(true);
    try {
      await this.helpCenter.preload("privacy");
      return this.activeRevision();
    } finally {
      this.loadingRef.set(false);
    }
  }
  applyState(state) {
    this.helpCenter.applyState("privacy", state);
  }
  async loadConsent(userId, revisionId, revisionVersion) {
    return this.helpCenter.loadPrivacyConsent(userId, revisionId, revisionVersion);
  }
  async saveConsent(request) {
    return this.helpCenter.savePrivacyConsent(request);
  }
  async syncAnonymousEntryConsent(userId, revision) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || !this.loadAnonymousEntryConsent(revision)) {
      return false;
    }
    await this.saveConsent({
      userId: normalizedUserId,
      revisionId: revision.id,
      revisionVersion: revision.version,
      approvedOptionalSectionIds: Array.from(this.loadEntryOptionalApprovals(revision)).sort(),
      source: "entry"
    });
    return true;
  }
  loadEntryOptionalApprovals(revision) {
    if (typeof localStorage === "undefined") {
      return /* @__PURE__ */ new Set();
    }
    try {
      const raw = localStorage.getItem(_PrivacyPolicyService.OPTIONAL_PRIVACY_APPROVAL_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || parsed.revisionKey !== this.revisionKey(revision) || !Array.isArray(parsed.approvedSectionIds)) {
        return /* @__PURE__ */ new Set();
      }
      const optionalSectionIds = this.optionalSectionIds(revision.sections);
      return new Set(parsed.approvedSectionIds.map((sectionId) => `${sectionId ?? ""}`.trim()).filter((sectionId) => optionalSectionIds.has(sectionId)));
    } catch {
      return /* @__PURE__ */ new Set();
    }
  }
  saveEntryOptionalApprovals(revision, approvedSectionIds) {
    if (typeof localStorage === "undefined") {
      return;
    }
    const optionalSectionIds = this.optionalSectionIds(revision.sections);
    const normalizedIds = Array.from(new Set(approvedSectionIds.map((sectionId) => `${sectionId ?? ""}`.trim()).filter((sectionId) => optionalSectionIds.has(sectionId)))).sort();
    localStorage.setItem(_PrivacyPolicyService.OPTIONAL_PRIVACY_APPROVAL_KEY, JSON.stringify({
      revisionKey: this.revisionKey(revision),
      approvedSectionIds: normalizedIds
    }));
  }
  revisionKey(revision) {
    return `${revision.id}:v${revision.version}`;
  }
  loadAnonymousEntryConsent(revision) {
    if (typeof localStorage === "undefined") {
      return null;
    }
    const raw = localStorage.getItem(_PrivacyPolicyService.ENTRY_CONSENT_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.version !== this.entryConsentVersion(revision) || parsed.accepted !== true || typeof parsed.acceptedAtIso !== "string" || parsed.acceptedAtIso.trim().length === 0) {
        return null;
      }
      return {
        version: parsed.version,
        accepted: true,
        acceptedAtIso: parsed.acceptedAtIso
      };
    } catch {
      return null;
    }
  }
  entryConsentVersion(revision) {
    return `privacy:${this.revisionKey(revision)}`;
  }
  optionalSectionIds(sections) {
    return new Set(sections.filter((section) => section.optional === true).map((section) => section.id));
  }
  static \u0275fac = function PrivacyPolicyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrivacyPolicyService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PrivacyPolicyService, factory: _PrivacyPolicyService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrivacyPolicyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/terms-policy.service.ts
var TermsPolicyService = class _TermsPolicyService {
  helpCenter = inject(HelpCenterService);
  loadingRef = signal(false, ...ngDevMode ? [{ debugName: "loadingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = this.loadingRef.asReadonly();
  state = this.helpCenter.termsState;
  activeRevision = computed(() => this.helpCenter.activeTermsRevision(), ...ngDevMode ? [{ debugName: "activeRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  hasActiveRevision = computed(() => Boolean(this.activeRevision()), ...ngDevMode ? [{ debugName: "hasActiveRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activeVersionLabel = this.helpCenter.activeTermsVersionLabel;
  async prepareOpen(options = {}) {
    const lazy = options.lazy !== false;
    const current = this.activeRevision();
    if (current || !lazy) {
      return current;
    }
    this.loadingRef.set(true);
    try {
      await this.helpCenter.preload("terms");
      return this.activeRevision();
    } finally {
      this.loadingRef.set(false);
    }
  }
  applyState(state) {
    this.helpCenter.applyState("terms", state);
  }
  static \u0275fac = function TermsPolicyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TermsPolicyService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TermsPolicyService, factory: _TermsPolicyService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TermsPolicyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/landing-content.service.ts
var LandingContentService = class _LandingContentService extends BaseRouteModeService {
  static LANDING_CONTENT_ROUTE = "/landing/content";
  localLandingContentService = inject(LocalLandingContentService);
  httpLandingContentService = inject(HttpLandingContentService);
  ideaPosts = inject(IdeaPostsService);
  privacyPolicy = inject(PrivacyPolicyService);
  termsPolicy = inject(TermsPolicyService);
  stateRef = signal(null, ...ngDevMode ? [{ debugName: "stateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  loadPromise = null;
  displayLoadPromise = null;
  state = this.stateRef.asReadonly();
  async loadOnce() {
    const current = this.stateRef();
    if (current) {
      return this.cloneState(current);
    }
    if (!this.loadPromise) {
      this.loadPromise = this.landingService().loadContent().then((state) => {
        const cloned = this.cloneState(state);
        this.stateRef.set(cloned);
        this.privacyPolicy.applyState(cloned.privacy);
        this.termsPolicy.applyState(cloned.terms);
        this.ideaPosts.applyPublishedPosts(cloned.ideas);
        return this.cloneState(cloned);
      }).finally(() => {
        this.loadPromise = null;
      });
    }
    return this.cloneState(await this.loadPromise);
  }
  async loadDisplayState() {
    const current = this.stateRef();
    if (current) {
      return this.cloneDisplayState(current);
    }
    if (!this.displayLoadPromise) {
      this.displayLoadPromise = this.loadOnce().then((state) => this.cloneDisplayState(state)).finally(() => {
        this.displayLoadPromise = null;
      });
    }
    return this.cloneDisplayState((await this.displayLoadPromise).state);
  }
  ideaInfoCards() {
    return this.ideaPosts.publishedIdeaInfoCards().map((card) => __spreadValues({}, card));
  }
  usesLocalContent() {
    return this.isLocalRouteEnabled(_LandingContentService.LANDING_CONTENT_ROUTE);
  }
  landingService() {
    return this.resolveRouteService(_LandingContentService.LANDING_CONTENT_ROUTE, this.localLandingContentService, this.httpLandingContentService);
  }
  cloneDisplayState(state) {
    return {
      state: this.cloneState(state),
      ideaCards: this.ideaInfoCards()
    };
  }
  cloneState(state) {
    return {
      privacy: {
        activeRevision: state.privacy.activeRevision ? __spreadProps(__spreadValues({}, state.privacy.activeRevision), {
          sections: state.privacy.activeRevision.sections.map((section) => __spreadValues({}, section))
        }) : null,
        revisions: state.privacy.revisions.map((revision) => __spreadProps(__spreadValues({}, revision), {
          sections: revision.sections.map((section) => __spreadValues({}, section))
        })),
        auditTrail: state.privacy.auditTrail.map((entry) => __spreadValues({}, entry)),
        availableLanguages: state.privacy.availableLanguages.map((language) => __spreadValues({}, language))
      },
      terms: {
        activeRevision: state.terms.activeRevision ? __spreadProps(__spreadValues({}, state.terms.activeRevision), {
          sections: state.terms.activeRevision.sections.map((section) => __spreadValues({}, section))
        }) : null,
        revisions: state.terms.revisions.map((revision) => __spreadProps(__spreadValues({}, revision), {
          sections: revision.sections.map((section) => __spreadValues({}, section))
        })),
        auditTrail: state.terms.auditTrail.map((entry) => __spreadValues({}, entry)),
        availableLanguages: state.terms.availableLanguages.map((language) => __spreadValues({}, language))
      },
      ideas: state.ideas.map((post) => __spreadProps(__spreadValues({}, post), { imageUrls: [...post.imageUrls] })),
      ideasTotal: Math.max(state.ideas.length, Math.max(0, Math.trunc(Number(state.ideasTotal) || 0))),
      loginAvailability: state.loginAvailability ? {
        eligible: state.loginAvailability.eligible !== false,
        partitionKey: state.loginAvailability.partitionKey ?? null,
        message: state.loginAvailability.message ?? null,
        securityGateEnabled: state.loginAvailability.securityGateEnabled === true,
        locationRequired: false
      } : null
    };
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275LandingContentService_BaseFactory;
    return function LandingContentService_Factory(__ngFactoryType__) {
      return (\u0275LandingContentService_BaseFactory || (\u0275LandingContentService_BaseFactory = \u0275\u0275getInheritedFactory(_LandingContentService)))(__ngFactoryType__ || _LandingContentService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LandingContentService, factory: _LandingContentService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LandingContentService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/activity-members.service.ts
var ActivityMembersService = class _ActivityMembersService extends BaseRouteModeService {
  static MEMBERS_ROUTE = "/activities/events/members";
  static OWNER_TYPES = ["event", "subEvent", "group", "asset"];
  localActivityMembersService = inject(LocalActivityMembersService);
  httpActivityMembersService = inject(HttpActivityMembersService);
  userProfileStore = inject(UserProfileStore);
  activityStore = inject(ActivityStore);
  routeDelay = inject(RouteDelayService);
  get activityMembersService() {
    return this.resolveRouteService(_ActivityMembersService.MEMBERS_ROUTE, this.localActivityMembersService, this.httpActivityMembersService);
  }
  usesLocalDataSource() {
    return this.isLocalRouteEnabled(_ActivityMembersService.MEMBERS_ROUTE);
  }
  async waitForMembersRouteDelay() {
    if (!this.isLocalRouteEnabled(_ActivityMembersService.MEMBERS_ROUTE)) {
      return;
    }
    await this.routeDelay.waitForRouteDelay(_ActivityMembersService.MEMBERS_ROUTE);
  }
  peekMembersByOwner(owner) {
    return this.presentMembers(this.activityMembersService.peekMembersByOwner(owner));
  }
  peekMembersByOwnerId(ownerId) {
    const owner = this.peekOwnerRefById(ownerId);
    if (!owner) {
      return [];
    }
    return this.peekMembersByOwner(owner);
  }
  async queryMembersByOwner(owner, options) {
    return this.presentMembers(await this.activityMembersService.queryMembersByOwner(owner, options));
  }
  async queryMembersByOwnerId(ownerId, options) {
    const normalizedOwnerId = ownerId.trim();
    if (!normalizedOwnerId) {
      return [];
    }
    const owner = this.peekOwnerRefById(normalizedOwnerId) ?? this.ownerRef("event", normalizedOwnerId);
    return this.queryMembersByOwner(owner, options);
  }
  async syncMembersByOwner(owner, knownItems, options, signal2) {
    const result = await this.activityMembersService.syncMembersByOwner(owner, knownItems, options, signal2);
    return {
      upserts: this.presentMembers(result.upserts),
      removedIds: [...result.removedIds],
      total: result.total
    };
  }
  pollIntervalMs() {
    return this.routeDelay.resolveIntervalMs(_ActivityMembersService.MEMBERS_ROUTE, 3e4);
  }
  peekSummaryByOwner(owner) {
    return this.activityMembersService.peekSummaryByOwner(owner);
  }
  peekSummaryByOwnerId(ownerId) {
    const owner = this.peekOwnerRefById(ownerId);
    if (!owner) {
      return null;
    }
    return this.peekSummaryByOwner(owner);
  }
  async querySummariesByOwners(owners) {
    return this.activityMembersService.querySummariesByOwners(owners);
  }
  async querySummaryByOwnerId(ownerId) {
    const normalizedOwnerId = ownerId.trim();
    if (!normalizedOwnerId) {
      return null;
    }
    const cachedSummary = this.peekSummaryByOwnerId(normalizedOwnerId);
    if (cachedSummary) {
      return cachedSummary;
    }
    const owner = this.peekOwnerRefById(normalizedOwnerId) ?? this.ownerRef("event", normalizedOwnerId);
    await this.activityMembersService.queryMembersByOwner(owner);
    return this.activityMembersService.peekSummaryByOwner(owner);
  }
  async replaceMembersByOwner(owner, members, capacityTotal, options) {
    const actorUserId = this.userProfileStore.activeUserId().trim() || this.userProfileStore.getActiveUserId().trim();
    await this.activityMembersService.replaceMembersByOwner(owner, this.prepareMembersForPersistence(members), capacityTotal, actorUserId, options);
    this.emitActivityMembersSyncForOwner(owner);
  }
  async replaceMembersByOwnerId(ownerId, members, capacityTotal, options) {
    const normalizedOwnerId = ownerId.trim();
    if (!normalizedOwnerId) {
      return;
    }
    const owner = this.peekOwnerRefById(normalizedOwnerId) ?? this.ownerRef("event", normalizedOwnerId);
    await this.replaceMembersByOwner(owner, members, capacityTotal, options);
  }
  async inviteEventMembers(owner, userIds) {
    const normalizedOwner = this.ownerRef(owner.ownerType, owner.ownerId.trim());
    if (normalizedOwner.ownerType !== "event" || !normalizedOwner.ownerId) {
      return { members: [], invitedUserIds: [], rejections: [] };
    }
    const actorUserId = this.userProfileStore.activeUserId().trim() || this.userProfileStore.getActiveUserId().trim();
    const result = await this.httpActivityMembersService.inviteEventMembers(normalizedOwner, actorUserId, userIds);
    const members = this.presentMembers(result.members);
    this.emitActivityMembersSyncForOwner(normalizedOwner);
    return {
      members,
      invitedUserIds: [...result.invitedUserIds],
      rejections: result.rejections.map((rejection) => __spreadValues({}, rejection))
    };
  }
  async applyMemberAction(owner, targetUserId, action, reason, options) {
    const normalizedOwner = this.ownerRef(owner.ownerType, owner.ownerId.trim());
    if (!normalizedOwner.ownerId.trim()) {
      return [];
    }
    const actorUserId = this.userProfileStore.activeUserId().trim();
    const counterSyncToken = this.activityStore.captureUserCounterSyncToken(actorUserId);
    const result = await this.activityMembersService.applyMemberAction(normalizedOwner, actorUserId, targetUserId, action, reason, options);
    const members = this.presentMembers(result.members);
    if (result.counterOverrides) {
      this.activityStore.applyCanonicalCounterOverrides(counterSyncToken, result.counterOverrides);
    }
    this.emitActivityMembersSyncForOwner(normalizedOwner);
    return members;
  }
  emitActivityMembersSyncForOwner(owner) {
    const summary = this.activityMembersService.peekSummaryByOwner(owner);
    if (!summary) {
      return;
    }
    this.emitActivityMembersSync(summary.ownerId, summary.acceptedMembers, summary.pendingMembers, summary.capacityTotal);
  }
  emitActivityMembersSync(id, acceptedMembers, pendingMembers, capacityTotal) {
    this.activityStore.emitActivityMembersSync({
      id,
      acceptedMembers,
      pendingMembers,
      capacityTotal
    });
  }
  peekOwnerRefById(ownerId) {
    const normalizedOwnerId = ownerId.trim();
    if (!normalizedOwnerId) {
      return null;
    }
    for (const ownerType of _ActivityMembersService.OWNER_TYPES) {
      const summary = this.activityMembersService.peekSummaryByOwner(this.ownerRef(ownerType, normalizedOwnerId));
      if (summary) {
        return this.ownerRef(summary.ownerType, summary.ownerId);
      }
    }
    return null;
  }
  ownerRef(ownerType, ownerId) {
    return {
      ownerType,
      ownerId
    };
  }
  presentMembers(entries) {
    const activeUserId = this.userProfileStore.activeUserId().trim();
    return entries.map((entry) => {
      const invitedByUserId = `${entry.invitedByUserId ?? ""}`.trim() || null;
      return __spreadProps(__spreadValues({}, entry), {
        invitedByUserId,
        invitedByActiveUser: this.isInviteOwnedByActiveUser(entry, activeUserId, invitedByUserId),
        involvements: Array.isArray(entry.involvements) ? entry.involvements.map((involvement) => __spreadValues({}, involvement)) : []
      });
    });
  }
  prepareMembersForPersistence(entries) {
    const activeUserId = this.userProfileStore.activeUserId().trim();
    return entries.map((entry) => {
      const _a = entry, { involvements: _involvements } = _a, persistedEntry = __objRest(_a, ["involvements"]);
      const retainsInviter = entry.status === "pending" && (entry.requestKind === "invite" || entry.requestKind === "waitlist-invite" || entry.requestKind === "approval");
      const invitedByUserId = retainsInviter ? `${entry.invitedByUserId ?? ""}`.trim() || (entry.invitedByActiveUser && activeUserId ? activeUserId : null) : null;
      return __spreadProps(__spreadValues({}, persistedEntry), {
        invitedByUserId,
        invitedByActiveUser: this.isInviteOwnedByActiveUser(entry, activeUserId, invitedByUserId)
      });
    });
  }
  isInviteOwnedByActiveUser(entry, activeUserId, invitedByUserId) {
    if (entry.status !== "pending" || entry.requestKind !== "invite" && entry.requestKind !== "waitlist-invite") {
      return false;
    }
    return Boolean(invitedByUserId) && invitedByUserId === activeUserId;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ActivityMembersService_BaseFactory;
    return function ActivityMembersService_Factory(__ngFactoryType__) {
      return (\u0275ActivityMembersService_BaseFactory || (\u0275ActivityMembersService_BaseFactory = \u0275\u0275getInheritedFactory(_ActivityMembersService)))(__ngFactoryType__ || _ActivityMembersService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivityMembersService, factory: _ActivityMembersService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityMembersService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/chats.service.ts
var ChatsService = class _ChatsService extends BaseRouteModeService {
  static CHAT_ROUTE = "/activities/chats";
  localChatsService = inject(LocalChatsService);
  httpChatsService = inject(HttpChatsService);
  activityMembersService = inject(ActivityMembersService);
  routeDelay = inject(RouteDelayService);
  get chatsService() {
    return this.resolveRouteService(_ChatsService.CHAT_ROUTE, this.localChatsService, this.httpChatsService);
  }
  async loadChatMessagesResult(chat, query = { page: 0, pageSize: Number.MAX_SAFE_INTEGER }) {
    const page = await this.queryChatMessagesPage(chat, query);
    return {
      items: page.items,
      total: page.total,
      nextCursor: page.nextCursor ?? null,
      context: page.readReceipt ? { readReceipt: page.readReceipt } : void 0
    };
  }
  async queryChatMessagesPage(chat, query) {
    const page = await this.chatsService.queryChatMessagesPage(chat, query);
    return {
      items: page.items,
      total: page.total,
      nextCursor: page.nextCursor ?? null,
      readReceipt: page.readReceipt ?? null
    };
  }
  async queryChatMemberEntries(chatId) {
    const normalizedChatId = `${chatId ?? ""}`.trim();
    if (!normalizedChatId) {
      return [];
    }
    return this.chatsService.queryChatMembers(normalizedChatId);
  }
  async syncChatHeader(chatId, knownRevision, signal2) {
    return this.chatsService.syncChatHeader(chatId, knownRevision, signal2);
  }
  pollIntervalMs() {
    return this.routeDelay.resolveIntervalMs(_ChatsService.CHAT_ROUTE, 3e4);
  }
  async queryChatMemberEntriesPage(chatId, query) {
    const normalizedChatId = `${chatId ?? ""}`.trim();
    if (!normalizedChatId) {
      return { items: [], total: 0, nextCursor: null };
    }
    return this.chatsService.queryChatMembersPage(normalizedChatId, query);
  }
  async sendChatMessage(chat, text, clientId) {
    return this.chatsService.sendChatMessage(chat, text, clientId);
  }
  async sendChatMessageWithAttachments(chat, text, attachments, clientId, replyTo) {
    return this.chatsService.sendChatMessageWithAttachments(chat, text, attachments, clientId, replyTo);
  }
  async updateChatMessage(chat, messageId, mutation) {
    return this.chatsService.updateChatMessage(chat, messageId, mutation);
  }
  async watchChatMessages(chat, onMessage) {
    return this.chatsService.watchChatMessages(chat, onMessage);
  }
  async watchChatEvents(chat, onEvent) {
    return this.chatsService.watchChatEvents(chat, onEvent);
  }
  async sendChatTyping(chat, typing) {
    return this.chatsService.sendChatTyping(chat, typing);
  }
  async markChatRead(chat, messageIds) {
    return this.chatsService.markChatRead(chat, messageIds);
  }
  async updateSupportCase(chat, action) {
    return this.chatsService.updateSupportCase(chat, action);
  }
  async ensureServiceChat(input) {
    return this.chatsService.ensureServiceChat(input);
  }
  async resolveEventServiceChat(input) {
    const activeUserId = input.activeUserId.trim();
    const eventId = input.eventId.trim();
    const ownerId = input.ownerId.trim();
    const title = input.title.trim() || "Event";
    if (!activeUserId || !eventId || !ownerId) {
      return null;
    }
    const existingChat = await this.resolveExistingEventServiceChat({
      activeUserId,
      eventId,
      notification: input.notification
    });
    if (existingChat) {
      return existingChat;
    }
    const memberSummary = input.notification ? await this.activityMembersService.querySummaryByOwnerId(eventId) : null;
    const serviceChat = this.buildActivityServiceChat({
      activeUserId,
      eventId,
      ownerId,
      title,
      actionLabel: input.actionLabel,
      creatorName: input.creatorName,
      hosting: input.hosting === true,
      notification: input.notification,
      acceptedMemberUserIds: input.acceptedMemberUserIds ?? memberSummary?.acceptedMemberUserIds ?? [],
      pendingMemberUserIds: input.pendingMemberUserIds ?? memberSummary?.pendingMemberUserIds ?? []
    });
    if (input.notification) {
      return serviceChat;
    }
    return this.ensureServiceChat({
      serviceContext: "event",
      eventId,
      targetUserId: ownerId,
      title: serviceChat.title,
      lastMessage: serviceChat.lastMessage,
      avatarSource: input.creatorName ?? title
    });
  }
  async resolveExistingEventServiceChat(input) {
    const expectedId = `c-service-event-${input.eventId}-${input.activeUserId}`;
    const expectedServiceContext = input.notification ? "notification" : "event";
    let cursor = null;
    do {
      const page = await this.queryActivitiesChatPage(input.activeUserId, {
        page: 0,
        pageSize: 25,
        cursor,
        sort: "date",
        direction: "desc",
        filters: { primaryFilter: "chats", chatContextFilter: "service" }
      });
      const match = page.items.find((chat) => chat.id === expectedId) ?? page.items.find((chat) => chat.channelType === "serviceEvent" && chat.serviceContext === expectedServiceContext && chat.ownerId === input.eventId);
      if (match) {
        return __spreadProps(__spreadValues({}, match), {
          memberIds: [...match.memberIds ?? []],
          members: (match.members ?? []).map((member) => __spreadValues({}, member))
        });
      }
      cursor = page.nextCursor ?? null;
    } while (cursor);
    return null;
  }
  buildActivityServiceChat(input) {
    const acceptedMemberUserIds = Array.isArray(input.acceptedMemberUserIds) ? input.acceptedMemberUserIds : [];
    const pendingMemberUserIds = Array.isArray(input.pendingMemberUserIds) ? input.pendingMemberUserIds : [];
    const acceptedAdmins = input.hosting ? this.uniqueUserIds([input.ownerId, input.activeUserId]) : this.uniqueUserIds([input.ownerId]);
    const memberIds = this.uniqueUserIds([
      input.activeUserId,
      ...acceptedAdmins,
      ...input.notification ? acceptedMemberUserIds : [],
      ...input.notification ? pendingMemberUserIds : []
    ]);
    const creatorName = `${input.creatorName ?? ""}`.trim();
    return {
      id: `c-service-event-${input.eventId}-${input.activeUserId}`,
      avatar: AppUtils.initialsFromText(creatorName || input.title),
      title: `${input.actionLabel.trim() || "Contact Organizer"} \xB7 ${input.title}`,
      lastMessage: input.notification ? "Notification channel for cancellations, postponements, and urgent event updates." : `Service chat with the organizer for ${input.title}.`,
      lastSenderId: input.ownerId || input.activeUserId,
      memberIds: memberIds.length > 0 ? memberIds : [input.activeUserId],
      unread: 0,
      dateIso: (/* @__PURE__ */ new Date()).toISOString(),
      channelType: "serviceEvent",
      serviceContext: input.notification ? "notification" : "event",
      ownerId: input.eventId,
      ownerUserId: input.activeUserId
    };
  }
  async queryActivitiesChatPage(userId, query) {
    const page = await this.chatsService.queryActivitiesChatPage(userId, query);
    return {
      items: page.items,
      total: page.total,
      nextCursor: page.nextCursor ?? null
    };
  }
  uniqueUserIds(userIds) {
    return [...new Set(userIds.map((userId) => userId.trim()).filter(Boolean))];
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ChatsService_BaseFactory;
    return function ChatsService_Factory(__ngFactoryType__) {
      return (\u0275ChatsService_BaseFactory || (\u0275ChatsService_BaseFactory = \u0275\u0275getInheritedFactory(_ChatsService)))(__ngFactoryType__ || _ChatsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChatsService, factory: _ChatsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/rates.service.ts
var RatesService = class _RatesService extends BaseRouteModeService {
  localRatesService = inject(LocalRatesService);
  httpRatesService = inject(HttpRatesService);
  gameService = inject(GameService);
  rateOutboxService = inject(RateOutboxService);
  get ratesService() {
    return this.resolveRouteService("/activities/rates", this.localRatesService, this.httpRatesService);
  }
  recordActivityRate(ownerUserId, item, rating, direction) {
    this.rateOutboxService.enqueueActivityRateOutbox(ownerUserId, item, rating, direction);
    this.gameService.resetUserGameCardsStack(ownerUserId);
    this.gameService.kickUserRatesOutboxSync();
  }
  peekRateItemsByUser(userId) {
    return this.ratesService.peekRateItemsByUser(userId);
  }
  async queryRateItemsByUser(userId) {
    return this.ratesService.queryRateItemsByUser(userId);
  }
  async queryActivitiesRatePage(userId, query, signal2) {
    return this.ratesService.queryActivitiesRatePage(userId, query, signal2);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275RatesService_BaseFactory;
    return function RatesService_Factory(__ngFactoryType__) {
      return (\u0275RatesService_BaseFactory || (\u0275RatesService_BaseFactory = \u0275\u0275getInheritedFactory(_RatesService)))(__ngFactoryType__ || _RatesService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RatesService, factory: _RatesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RatesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/activities.service.ts
var ActivitiesService = class _ActivitiesService extends BaseRouteModeService {
  eventsService = inject(EventsService);
  chatsService = inject(ChatsService);
  ratesService = inject(RatesService);
  userProfileStore = inject(UserProfileStore);
  async loadExplore(query) {
    const filters = this.resolveExploreFilters(query.filters);
    const result = await this.eventsService.queryEventExplorePage(__spreadProps(__spreadValues({}, filters), {
      limit: this.resolveExplorePageSize(query.pageSize),
      cursor: query.cursor ?? null
    }));
    return {
      items: result.records.map((record) => this.cloneExploreRecord(record)),
      total: result.total,
      nextCursor: result.nextCursor
    };
  }
  async loadActivityChats(query, _options = {}) {
    return this.chatsService.queryActivitiesChatPage(this.resolveActiveUserId(), query);
  }
  async loadActivityRates(query, options = {}) {
    const activeUserId = this.resolveActiveUserId();
    const page = await this.ratesService.queryActivitiesRatePage(activeUserId, query, options.signal);
    return {
      items: page.items.map((item) => __spreadValues({}, item)),
      total: page.total,
      nextCursor: page.nextCursor ?? null,
      context: {
        users: (page.users ?? []).map((user) => __spreadProps(__spreadValues({}, user), { images: [...user.images ?? []] }))
      }
    };
  }
  resolveActiveUserId() {
    const activeUserProfileId = this.userProfileStore.activeUserProfile()?.id?.trim();
    if (activeUserProfileId) {
      return activeUserProfileId;
    }
    const activeUserId = this.userProfileStore.getActiveUserId().trim();
    if (activeUserId) {
      return activeUserId;
    }
    const session = this.sessionService.currentSession();
    if (session?.kind === "demo" && session.userId.trim().length > 0) {
      return session.userId.trim();
    }
    if (session?.kind === "firebase" && session.profile.id.trim().length > 0) {
      return session.profile.id.trim();
    }
    return "";
  }
  resolveExploreFilters(input) {
    return {
      userId: input?.userId?.trim() || this.resolveActiveUserId(),
      order: this.normalizeEventExploreOrder(input?.order),
      view: this.normalizeEventExploreView(input?.view),
      friendsOnly: input?.friendsOnly === true,
      openSpotsOnly: input?.openSpotsOnly === true,
      topic: this.normalizeEventExploreTopic(input?.topic ?? ""),
      excludedSourceIds: this.normalizeEventExploreExcludedSourceIds(input?.excludedSourceIds)
    };
  }
  normalizeEventExploreOrder(value) {
    return value === "past-events" || value === "nearby" || value === "most-relevant" || value === "top-rated" ? value : "upcoming";
  }
  normalizeEventExploreView(value) {
    return value === "distance" ? "distance" : "day";
  }
  normalizeEventExploreTopic(value) {
    return AppUtils.normalizeText(`${value ?? ""}`.replace(/^#+\s*/, "").trim());
  }
  normalizeEventExploreExcludedSourceIds(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return [...new Set(value.map((sourceId) => `${sourceId ?? ""}`.trim()).filter((sourceId) => sourceId.length > 0))];
  }
  resolveExplorePageSize(value) {
    if (!Number.isFinite(value)) {
      return 10;
    }
    return Math.max(1, Math.trunc(Number(value)));
  }
  cloneExploreRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      topics: [...record.topics]
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ActivitiesService_BaseFactory;
    return function ActivitiesService_Factory(__ngFactoryType__) {
      return (\u0275ActivitiesService_BaseFactory || (\u0275ActivitiesService_BaseFactory = \u0275\u0275getInheritedFactory(_ActivitiesService)))(__ngFactoryType__ || _ActivitiesService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivitiesService, factory: _ActivitiesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivitiesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/explanation-guide.service.ts
var ExplanationGuideService = class _ExplanationGuideService {
  static STORAGE_KEY = APP_STORAGE_KEYS.explanationGuideEnabled;
  static DISMISSED_CONTEXTS_STORAGE_KEY = APP_STORAGE_KEYS.explanationGuideDismissedContexts;
  helpCenter = inject(HelpCenterService);
  enabledRef = signal(this.readEnabledState(), ...ngDevMode ? [{ debugName: "enabledRef" }] : (
    /* istanbul ignore next */
    []
  ));
  currentContextRef = signal(null, ...ngDevMode ? [{ debugName: "currentContextRef" }] : (
    /* istanbul ignore next */
    []
  ));
  popupOpenRef = signal(false, ...ngDevMode ? [{ debugName: "popupOpenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  loadingRef = signal(false, ...ngDevMode ? [{ debugName: "loadingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  visibleRevisionRef = signal(null, ...ngDevMode ? [{ debugName: "visibleRevisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  dismissedContexts = new Set(this.readDismissedContexts());
  contextStack = [];
  loadSerial = 0;
  enabled = this.enabledRef.asReadonly();
  currentContextKey = this.currentContextRef.asReadonly();
  popupOpen = this.popupOpenRef.asReadonly();
  loading = this.loadingRef.asReadonly();
  visibleRevision = this.visibleRevisionRef.asReadonly();
  hasVisiblePopup = computed(() => this.popupOpenRef(), ...ngDevMode ? [{ debugName: "hasVisiblePopup" }] : (
    /* istanbul ignore next */
    []
  ));
  hasVisibleRevision = computed(() => Boolean(this.visibleRevisionRef()), ...ngDevMode ? [{ debugName: "hasVisibleRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  registerContext(contextKey) {
    const normalized = this.normalizeContextKey(contextKey);
    if (!normalized) {
      return () => void 0;
    }
    this.contextStack.push(normalized);
    this.currentContextRef.set(normalized);
    this.refreshVisibleForCurrent();
    return () => {
      const index = this.contextStack.lastIndexOf(normalized);
      if (index >= 0) {
        this.contextStack.splice(index, 1);
      }
      this.currentContextRef.set(this.contextStack[this.contextStack.length - 1] ?? null);
      this.refreshVisibleForCurrent();
    };
  }
  setEnabled(enabled) {
    this.enabledRef.set(enabled);
    this.writeEnabledState(enabled);
    if (!enabled) {
      this.closePopup();
      return;
    }
    const contextKey = this.currentContextRef();
    if (contextKey) {
      this.refreshVisibleForCurrent();
    }
  }
  toggleEnabled() {
    this.setEnabled(!this.enabledRef());
  }
  dismiss() {
    const contextKey = this.currentContextRef();
    if (contextKey) {
      this.rememberDismissedContext(contextKey);
    }
    this.closePopup();
  }
  replayCurrent() {
    const contextKey = this.currentContextRef();
    if (!contextKey) {
      return;
    }
    this.dismissedContexts.delete(contextKey);
    this.writeDismissedContexts();
    this.setEnabled(true);
  }
  refreshVisibleForCurrent() {
    const contextKey = this.currentContextRef();
    if (!this.enabledRef() || !contextKey || this.isDismissedContext(contextKey)) {
      this.closePopup();
      return;
    }
    this.popupOpenRef.set(true);
    this.visibleRevisionRef.set(null);
    void this.loadForContext(contextKey);
  }
  async loadForContext(contextKey) {
    const serial = ++this.loadSerial;
    this.loadingRef.set(true);
    try {
      const state = await this.helpCenter.loadExplanationState(contextKey);
      if (serial !== this.loadSerial || !this.enabledRef() || this.currentContextRef() !== contextKey || this.isDismissedContext(contextKey)) {
        return;
      }
      const revision = state.activeRevision ?? null;
      if (!revision) {
        this.closePopup();
        return;
      }
      this.visibleRevisionRef.set(revision);
      this.loadingRef.set(false);
    } catch {
      if (serial === this.loadSerial) {
        this.closePopup();
      }
    }
  }
  closePopup() {
    this.loadingRef.set(false);
    this.visibleRevisionRef.set(null);
    this.popupOpenRef.set(false);
  }
  normalizeContextKey(contextKey) {
    return `${contextKey ?? ""}`.trim();
  }
  isDismissedContext(contextKey) {
    return this.dismissedContexts.has(this.normalizeContextKey(contextKey));
  }
  rememberDismissedContext(contextKey) {
    const normalized = this.normalizeContextKey(contextKey);
    if (!normalized) {
      return;
    }
    this.dismissedContexts.add(normalized);
    this.writeDismissedContexts();
  }
  readEnabledState() {
    if (typeof localStorage === "undefined") {
      return true;
    }
    try {
      const stored = localStorage.getItem(_ExplanationGuideService.STORAGE_KEY);
      return stored === null ? true : stored !== "false";
    } catch {
      return true;
    }
  }
  writeEnabledState(enabled) {
    if (typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(_ExplanationGuideService.STORAGE_KEY, enabled ? "true" : "false");
    } catch {
    }
  }
  readDismissedContexts() {
    if (typeof localStorage === "undefined") {
      return [];
    }
    try {
      const stored = localStorage.getItem(_ExplanationGuideService.DISMISSED_CONTEXTS_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map((value) => this.normalizeContextKey(`${value ?? ""}`)).filter(Boolean);
    } catch {
      return [];
    }
  }
  writeDismissedContexts() {
    if (typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(_ExplanationGuideService.DISMISSED_CONTEXTS_STORAGE_KEY, JSON.stringify([...this.dismissedContexts].sort()));
    } catch {
    }
  }
  static \u0275fac = function ExplanationGuideService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ExplanationGuideService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ExplanationGuideService, factory: _ExplanationGuideService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExplanationGuideService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/media.service.ts
var MEDIA_IMAGE_UPLOAD_ROUTE = "/media/images";
var MEDIA_IMAGE_IMPORT_ROUTE = "/media/images/import";
var MEDIA_AUDIO_UPLOAD_ROUTE = "/media/audio";
var MediaService = class _MediaService extends BaseRouteModeService {
  localMediaService = inject(LocalMediaService);
  httpMediaService = inject(HttpMediaService);
  async uploadImage(ownerId, entityId, file) {
    return this.mediaService(MEDIA_IMAGE_UPLOAD_ROUTE).uploadImage(ownerId, entityId, file);
  }
  async importImage(ownerId, entityId, imageUrl) {
    return this.mediaService(MEDIA_IMAGE_IMPORT_ROUTE).importImage(ownerId, entityId, imageUrl);
  }
  async uploadAudio(ownerId, entityId, file, options = {}) {
    return this.mediaService(MEDIA_AUDIO_UPLOAD_ROUTE).uploadAudio(ownerId, entityId, file, options);
  }
  mediaService(route) {
    return this.resolveRouteService(route, this.localMediaService, this.httpMediaService);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MediaService_BaseFactory;
    return function MediaService_Factory(__ngFactoryType__) {
      return (\u0275MediaService_BaseFactory || (\u0275MediaService_BaseFactory = \u0275\u0275getInheritedFactory(_MediaService)))(__ngFactoryType__ || _MediaService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MediaService, factory: _MediaService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MediaService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/admin-params.service.ts
var ADMIN_PARAMS_ROUTE = "/admin/params";
var AdminParamsService = class _AdminParamsService extends BaseRouteModeService {
  localService = inject(LocalAdminParamsService);
  httpService = inject(HttpAdminParamsService);
  get paramsService() {
    return this.resolveRouteService(ADMIN_PARAMS_ROUTE, this.localService, this.httpService);
  }
  async loadParamsState(adminUserId, options) {
    const state = this.paramsService instanceof LocalAdminParamsService ? await this.paramsService.loadParamsState(options) : await this.paramsService.loadParamsState(adminUserId);
    return this.normalizeParamsState(state);
  }
  async saveParamsSection(sectionKey, fields, summary, adminUserId, options) {
    const normalizedSectionKey = `${sectionKey ?? ""}`.trim();
    const normalizedFields = fields.map((field) => this.normalizeParamField(field));
    const state = this.paramsService instanceof LocalAdminParamsService ? await this.paramsService.saveParamsSection(normalizedSectionKey, normalizedFields, summary, adminUserId, options) : await this.paramsService.saveParamsSection(normalizedSectionKey, normalizedFields, summary, adminUserId);
    return this.normalizeParamsState(state);
  }
  async loadParamsHistory(sectionKey, adminUserId, options) {
    const normalizedSectionKey = `${sectionKey ?? ""}`.trim();
    const history = this.paramsService instanceof LocalAdminParamsService ? await this.paramsService.loadParamsHistory(normalizedSectionKey, options) : await this.paramsService.loadParamsHistory(normalizedSectionKey, adminUserId);
    return this.normalizeParamsHistory(history);
  }
  async revertParamsSection(sectionKey, version, adminUserId) {
    const normalizedSectionKey = `${sectionKey ?? ""}`.trim();
    const normalizedVersion = Math.max(1, Math.trunc(Number(version) || 0));
    const state = await this.paramsService.revertParamsSection(normalizedSectionKey, normalizedVersion, adminUserId);
    return this.normalizeParamsState(state);
  }
  normalizeParamsState(state) {
    return {
      sections: (state.sections ?? []).map((section) => this.normalizeParamsSection(section)),
      updatedDate: `${state.updatedDate ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  normalizeParamsSection(section) {
    return {
      key: `${section.key ?? ""}`.trim(),
      label: `${section.label ?? ""}`.trim() || `${section.key ?? ""}`.trim(),
      labelKey: `${section.labelKey ?? ""}`.trim() || this.paramSectionLabelKey(section.key),
      version: Math.max(1, Math.trunc(Number(section.version) || 1)),
      changedDate: `${section.changedDate ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      changedBy: `${section.changedBy ?? ""}`.trim() || "system",
      summary: `${section.summary ?? ""}`.trim(),
      summaryKey: `${section.summaryKey ?? ""}`.trim() || this.paramSummaryKey(section.summary, section.key),
      fields: (section.fields ?? []).map((field) => this.normalizeParamField(field))
    };
  }
  normalizeParamField(field) {
    const valueType = field.valueType === "text" ? "text" : "number";
    const numberValue = valueType === "number" ? Number.isFinite(Number(field.numberValue)) ? Number(field.numberValue) : 0 : null;
    return {
      key: `${field.key ?? ""}`.trim(),
      label: `${field.label ?? ""}`.trim() || `${field.key ?? ""}`.trim(),
      labelKey: `${field.labelKey ?? ""}`.trim() || this.paramFieldLabelKey(field.key),
      group: `${field.group ?? ""}`.trim() || "General",
      groupKey: `${field.groupKey ?? ""}`.trim() || this.paramGroupLabelKey(field.group),
      valueType,
      numberValue,
      textValue: valueType === "text" ? `${field.textValue ?? ""}`.trim() : null,
      unit: `${field.unit ?? ""}`.trim(),
      options: (field.options ?? []).map((option) => this.normalizeParamOption(option)),
      strategy: `${field.strategy ?? ""}`.trim(),
      strategyKey: `${field.strategyKey ?? ""}`.trim() || this.paramStrategyLabelKey(field.strategy),
      readOnly: field.readOnly === true
    };
  }
  normalizeParamOption(option) {
    const value = `${option.value ?? ""}`.trim();
    return {
      value,
      label: `${option.label ?? ""}`.trim() || value,
      labelKey: `${option.labelKey ?? ""}`.trim() || this.paramStrategyLabelKey(value)
    };
  }
  normalizeParamsHistory(history) {
    return {
      sectionKey: `${history.sectionKey ?? ""}`.trim(),
      label: `${history.label ?? ""}`.trim() || `${history.sectionKey ?? ""}`.trim(),
      labelKey: `${history.labelKey ?? ""}`.trim() || this.paramSectionLabelKey(history.sectionKey),
      versions: (history.versions ?? []).map((item) => this.normalizeParamsHistoryItem(item)).sort((left, right) => right.version - left.version)
    };
  }
  normalizeParamsHistoryItem(item) {
    return {
      configId: `${item.configId ?? ""}`.trim() || null,
      version: Math.max(1, Math.trunc(Number(item.version) || 1)),
      changedDate: `${item.changedDate ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      changedBy: `${item.changedBy ?? ""}`.trim() || "system",
      summary: `${item.summary ?? ""}`.trim(),
      summaryKey: `${item.summaryKey ?? ""}`.trim(),
      active: item.active === true,
      fields: (item.fields ?? []).map((field) => this.normalizeParamField(field))
    };
  }
  paramSectionLabelKey(sectionKey) {
    const normalized = `${sectionKey ?? ""}`.trim();
    return normalized ? `admin.params.section.${normalized}` : "admin.params.platform";
  }
  paramFieldLabelKey(fieldKey) {
    const normalized = `${fieldKey ?? ""}`.trim();
    return normalized ? `admin.params.field.${normalized}` : "";
  }
  paramGroupLabelKey(group) {
    const normalized = this.paramsI18nSegment(group);
    return normalized ? `admin.params.group.${normalized}` : "admin.params.group.general";
  }
  paramStrategyLabelKey(strategy) {
    const normalized = `${strategy ?? ""}`.trim();
    return normalized ? `admin.params.strategy.${normalized}` : "";
  }
  paramSummaryKey(summary, sectionKey) {
    const normalizedSummary = `${summary ?? ""}`.trim();
    const normalizedSection = `${sectionKey ?? ""}`.trim();
    if (!normalizedSummary || !normalizedSection) {
      return "";
    }
    if (/^Updated\s+.+?\s+parameters\.$/i.test(normalizedSummary)) {
      return `admin.params.summary.updated.${normalizedSection}`;
    }
    return "";
  }
  paramsI18nSegment(value) {
    return `${value ?? ""}`.trim().replace(/([a-z0-9])([A-Z])/g, "$1.$2").replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").toLocaleLowerCase("en-US");
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AdminParamsService_BaseFactory;
    return function AdminParamsService_Factory(__ngFactoryType__) {
      return (\u0275AdminParamsService_BaseFactory || (\u0275AdminParamsService_BaseFactory = \u0275\u0275getInheritedFactory(_AdminParamsService)))(__ngFactoryType__ || _AdminParamsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminParamsService, factory: _AdminParamsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminParamsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/admin-monitoring.service.ts
var ADMIN_MONITORING_ROUTE = "/admin/monitoring";
var AdminMonitoringService = class _AdminMonitoringService extends BaseRouteModeService {
  localService = inject(LocalAdminMonitoringService);
  httpService = inject(HttpAdminMonitoringService);
  routeDelay = inject(RouteDelayService);
  get monitoringService() {
    return this.resolveRouteService(ADMIN_MONITORING_ROUTE, this.localService, this.httpService);
  }
  monitoringLoadProgressWindowMs() {
    return this.routeDelay.resolveRequestTimeoutMs(ADMIN_MONITORING_ROUTE);
  }
  async loadMonitoringState(adminUserId, filter) {
    const source = this.monitoringService instanceof LocalAdminMonitoringService ? "demo" : "http";
    const state = this.monitoringService instanceof LocalAdminMonitoringService ? await this.monitoringService.loadMonitoringState(filter) : await this.monitoringService.loadMonitoringState(adminUserId, filter);
    return this.normalizeMonitoringState(state, source);
  }
  normalizeMonitoringState(state, source) {
    const normalizedSource = `${state.source ?? source}`.trim();
    const categories = (state.categories ?? []).map((category) => this.normalizeMonitoringCategory(category));
    return {
      generatedAtIso: `${state.generatedAtIso ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      source: ["demo", "http"].includes(normalizedSource) ? normalizedSource : source,
      health: this.normalizeMonitoringHealth(state.health),
      filterCounts: this.normalizeMonitoringFilterCounts(state.filterCounts, categories),
      categories
    };
  }
  normalizeMonitoringFilterCounts(counts, categories) {
    const fallback = {
      all: categories.length
    };
    const normalized = {};
    for (const [key, value] of Object.entries(counts ?? fallback)) {
      const normalizedKey = `${key ?? ""}`.trim();
      const parsed = Math.trunc(Number(value));
      if (normalizedKey && Number.isFinite(parsed)) {
        normalized[normalizedKey] = Math.max(0, parsed);
      }
    }
    return Object.keys(normalized).length ? normalized : fallback;
  }
  normalizeMonitoringCategory(category) {
    const nodes = (category.nodes ?? []).map((node) => this.normalizeMonitoringNode(node));
    return {
      key: `${category.key ?? ""}`.trim(),
      labelKey: `${category.labelKey ?? ""}`.trim(),
      summaryKey: `${category.summaryKey ?? ""}`.trim(),
      icon: `${category.icon ?? ""}`.trim() || "monitoring",
      tone: this.normalizeMonitoringTone(category.tone),
      health: this.normalizeMonitoringCategoryHealth(category.health, nodes),
      total: Math.max(0, Math.trunc(Number(category.total) || 0)),
      nodes,
      edges: (category.edges ?? []).map((edge) => this.normalizeMonitoringEdge(edge))
    };
  }
  normalizeMonitoringNode(node) {
    const kind = `${node.kind ?? ""}`.trim();
    return {
      id: `${node.id ?? ""}`.trim(),
      labelKey: `${node.labelKey ?? ""}`.trim(),
      icon: `${node.icon ?? ""}`.trim() || "radio_button_checked",
      kind: ["source", "writeModel", "queue", "worker", "outbox", "external", "readModel", "storage"].includes(kind) ? kind : "source",
      tone: this.normalizeMonitoringTone(node.tone),
      metrics: (node.metrics ?? []).map((metric) => this.normalizeMonitoringMetric(metric))
    };
  }
  normalizeMonitoringMetric(metric) {
    const value = Math.max(0, Math.trunc(Number(metric.value) || 0));
    const key = `${metric.key ?? ""}`.trim();
    const labelKey = `${metric.labelKey ?? ""}`.trim();
    return {
      key,
      labelKey,
      value,
      valueLabel: `${metric.valueLabel ?? ""}`.trim() || this.compactNumber(value),
      tone: this.normalizeMonitoringTone(metric.tone),
      status: this.normalizeMonitoringMetricHealth(key, labelKey, value, metric.status),
      detailRows: (metric.detailRows ?? []).map((row) => this.normalizeMonitoringDetailRow(row))
    };
  }
  normalizeMonitoringCategoryHealth(health, nodes) {
    const explicit = this.normalizeMonitoringHealth(health);
    const statuses = nodes.flatMap((node) => node.metrics.map((metric) => metric.status));
    if (explicit === "alert" || statuses.includes("alert")) {
      return "alert";
    }
    if (explicit === "watch" || statuses.includes("watch")) {
      return "watch";
    }
    return "ok";
  }
  normalizeMonitoringMetricHealth(key, labelKey, value, health) {
    const explicit = this.normalizeMonitoringHealth(health);
    const lookupKey = `${key} ${labelKey}`.toLowerCase();
    if (value <= 0) {
      return lookupKey.includes("failed") || lookupKey.includes("error") || lookupKey.includes("pending") ? "ok" : explicit;
    }
    if (lookupKey.includes("failed") || lookupKey.includes("error")) {
      return "alert";
    }
    if (lookupKey.includes("pending") || lookupKey.includes("borrower-updates") || lookupKey.includes("deleted") || lookupKey.includes("suppression") || lookupKey.includes("status-propagation") || lookupKey.includes("purge-signals")) {
      return "watch";
    }
    return explicit;
  }
  normalizeMonitoringDetailRow(row) {
    return {
      key: `${row.key ?? ""}`.trim(),
      labelKey: `${row.labelKey ?? ""}`.trim(),
      valueLabel: `${row.valueLabel ?? ""}`.trim(),
      tone: this.normalizeMonitoringTone(row.tone)
    };
  }
  normalizeMonitoringEdge(edge) {
    return {
      from: `${edge.from ?? ""}`.trim(),
      to: `${edge.to ?? ""}`.trim(),
      labelKey: `${edge.labelKey ?? ""}`.trim(),
      tone: this.normalizeMonitoringTone(edge.tone),
      volume: Math.max(0, Math.trunc(Number(edge.volume) || 0))
    };
  }
  normalizeMonitoringTone(value) {
    const normalized = `${value ?? ""}`.trim();
    return ["blue", "green", "gold", "red", "purple", "slate"].includes(normalized) ? normalized : "slate";
  }
  normalizeMonitoringHealth(value) {
    const normalized = `${value ?? ""}`.trim();
    return ["ok", "watch", "alert"].includes(normalized) ? normalized : "ok";
  }
  compactNumber(value) {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}k`;
    }
    return String(value);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AdminMonitoringService_BaseFactory;
    return function AdminMonitoringService_Factory(__ngFactoryType__) {
      return (\u0275AdminMonitoringService_BaseFactory || (\u0275AdminMonitoringService_BaseFactory = \u0275\u0275getInheritedFactory(_AdminMonitoringService)))(__ngFactoryType__ || _AdminMonitoringService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminMonitoringService, factory: _AdminMonitoringService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminMonitoringService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/admin-stats.service.ts
var ADMIN_STATS_LOAD_ROUTE = "/admin/stats";
var AdminStatsService = class _AdminStatsService extends BaseRouteModeService {
  localService = inject(LocalAdminStatsService);
  httpService = inject(HttpAdminStatsService);
  get statsService() {
    return this.resolveRouteService(ADMIN_STATS_LOAD_ROUTE, this.localService, this.httpService);
  }
  async loadStatsDashboard(adminUserId) {
    const statsService = this.statsService;
    const dashboard = statsService instanceof LocalAdminStatsService ? await statsService.loadStatsDashboard() : await statsService.loadStatsDashboard(adminUserId);
    return this.normalizeStatsDashboard(dashboard, statsService.source);
  }
  normalizeStatsDashboard(dashboard, source) {
    const normalizedSource = `${dashboard.source ?? source}`.trim();
    return {
      generatedAtIso: `${dashboard.generatedAtIso ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      source: ["demo", "http"].includes(normalizedSource) ? normalizedSource : source,
      healthScore: this.clampInteger(dashboard.healthScore, 0, 100, 0),
      healthLabelKey: `${dashboard.healthLabelKey ?? ""}`.trim() || "stats.health.good",
      healthSummaryKey: `${dashboard.healthSummaryKey ?? ""}`.trim() || "stats.health.summary",
      kpis: (dashboard.kpis ?? []).map((metric) => this.normalizeStatsMetric(metric)),
      segments: (dashboard.segments ?? []).map((segment) => this.normalizeStatsSegment(segment)),
      attention: (dashboard.attention ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      topCities: (dashboard.topCities ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      topTopics: (dashboard.topTopics ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      timeline: (dashboard.timeline ?? []).map((point) => this.normalizeStatsTimelinePoint(point)),
      eventTypes: (dashboard.eventTypes ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      activityMix: (dashboard.activityMix ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      graph: this.normalizeStatsGraph(dashboard.graph)
    };
  }
  normalizeStatsMetric(metric) {
    const value = Math.max(0, Math.trunc(Number(metric.value) || 0));
    return {
      key: `${metric.key ?? ""}`.trim(),
      labelKey: `${metric.labelKey ?? ""}`.trim(),
      value,
      valueLabel: `${metric.valueLabel ?? ""}`.trim() || this.compactNumber(value),
      captionKey: `${metric.captionKey ?? ""}`.trim(),
      caption: `${metric.caption ?? ""}`.trim(),
      icon: `${metric.icon ?? ""}`.trim() || "query_stats",
      tone: this.normalizeStatsTone(metric.tone),
      percent: this.clampInteger(metric.percent ?? 0, 0, 100, 0)
    };
  }
  normalizeStatsSegment(segment) {
    return {
      key: `${segment.key ?? ""}`.trim(),
      labelKey: `${segment.labelKey ?? ""}`.trim(),
      icon: `${segment.icon ?? ""}`.trim() || "dashboard",
      total: Math.max(0, Math.trunc(Number(segment.total) || 0)),
      healthPercent: this.clampInteger(segment.healthPercent, 0, 100, 0),
      summaryKey: `${segment.summaryKey ?? ""}`.trim(),
      summary: `${segment.summary ?? ""}`.trim(),
      items: (segment.items ?? []).map((item) => this.normalizeStatsBreakdownItem(item))
    };
  }
  normalizeStatsBreakdownItem(item) {
    return {
      key: `${item.key ?? ""}`.trim(),
      labelKey: `${item.labelKey ?? ""}`.trim(),
      label: `${item.label ?? ""}`.trim(),
      value: Math.max(0, Math.trunc(Number(item.value) || 0)),
      total: Math.max(0, Math.trunc(Number(item.total) || 0)),
      icon: `${item.icon ?? ""}`.trim(),
      tone: item.tone ? this.normalizeStatsTone(item.tone) : void 0
    };
  }
  normalizeStatsTimelinePoint(point) {
    return {
      dateKey: `${point.dateKey ?? ""}`.trim(),
      label: `${point.label ?? ""}`.trim(),
      registrations: Math.max(0, Math.trunc(Number(point.registrations) || 0)),
      activeUsers: Math.max(0, Math.trunc(Number(point.activeUsers) || 0)),
      ratings: Math.max(0, Math.trunc(Number(point.ratings) || 0)),
      events: Math.max(0, Math.trunc(Number(point.events) || 0)),
      assets: Math.max(0, Math.trunc(Number(point.assets) || 0)),
      messages: Math.max(0, Math.trunc(Number(point.messages) || 0)),
      moderation: Math.max(0, Math.trunc(Number(point.moderation) || 0))
    };
  }
  normalizeStatsGraph(graph) {
    return {
      healthScore: this.clampInteger(graph?.healthScore ?? 0, 0, 100, 0),
      healthLabelKey: `${graph?.healthLabelKey ?? ""}`.trim() || "stats.graph.health.cold",
      insightKey: `${graph?.insightKey ?? ""}`.trim() || "stats.graph.insight.cold",
      metrics: (graph?.metrics ?? []).map((metric) => this.normalizeStatsMetric(metric)),
      bridgeUsers: (graph?.bridgeUsers ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      communities: (graph?.communities ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      signals: (graph?.signals ?? []).map((item) => this.normalizeStatsBreakdownItem(item)),
      timeline: (graph?.timeline ?? []).map((point) => this.normalizeStatsGraphTimelinePoint(point))
    };
  }
  normalizeStatsGraphTimelinePoint(point) {
    return {
      dateKey: `${point.dateKey ?? ""}`.trim(),
      label: `${point.label ?? ""}`.trim(),
      activeEdges: Math.max(0, Math.trunc(Number(point.activeEdges) || 0)),
      newEdges: Math.max(0, Math.trunc(Number(point.newEdges) || 0)),
      recurringEdges: Math.max(0, Math.trunc(Number(point.recurringEdges) || 0)),
      weakTies: Math.max(0, Math.trunc(Number(point.weakTies) || 0)),
      bridgeUsers: Math.max(0, Math.trunc(Number(point.bridgeUsers) || 0)),
      communities: Math.max(0, Math.trunc(Number(point.communities) || 0)),
      networkQuality: Math.max(0, Math.trunc(Number(point.networkQuality) || 0)),
      clusterQuality: Math.max(0, Math.trunc(Number(point.clusterQuality) || 0))
    };
  }
  normalizeStatsTone(value) {
    const normalized = `${value ?? ""}`.trim();
    return ["blue", "green", "gold", "red", "purple", "slate"].includes(normalized) ? normalized : "slate";
  }
  compactNumber(value) {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}k`;
    }
    return String(value);
  }
  clampInteger(value, min, max, fallback) {
    const parsed = Math.trunc(Number(value));
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(min, Math.min(max, parsed));
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AdminStatsService_BaseFactory;
    return function AdminStatsService_Factory(__ngFactoryType__) {
      return (\u0275AdminStatsService_BaseFactory || (\u0275AdminStatsService_BaseFactory = \u0275\u0275getInheritedFactory(_AdminStatsService)))(__ngFactoryType__ || _AdminStatsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminStatsService, factory: _AdminStatsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminStatsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/admin-notifications.service.ts
var ADMIN_NOTIFICATION_ROUTE = "/admin/notifications";
var ADMIN_NOTIFICATION_LOAD_ROUTE = "/admin/notifications";
var ADMIN_NOTIFICATION_INTERVAL_UNIT = {
  seconds: "seconds",
  minutes: "minutes",
  hours: "hours",
  days: "days",
  weeks: "weeks",
  months: "months",
  years: "years"
};
var ADMIN_NOTIFICATION_INTERVAL_SECONDS = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2592e3,
  years: 31536e3
};
var AdminNotificationsService = class _AdminNotificationsService extends BaseRouteModeService {
  localService = inject(LocalAdminNotificationsService);
  httpService = inject(HttpAdminNotificationsService);
  routeDelay = inject(RouteDelayService);
  get notificationService() {
    return this.resolveRouteService(ADMIN_NOTIFICATION_ROUTE, this.localService, this.httpService);
  }
  notificationCenterLoadProgressWindowMs() {
    return this.routeDelay.resolveRequestTimeoutMs(ADMIN_NOTIFICATION_LOAD_ROUTE);
  }
  async loadNotificationCenter(adminUserId, options) {
    const state = this.notificationService instanceof LocalAdminNotificationsService ? await this.notificationService.loadNotificationCenter(options) : await this.notificationService.loadNotificationCenter(adminUserId, options?.filter);
    return this.normalizeNotificationCenter(state);
  }
  async saveNotificationCenter(rules, adminUserId, options) {
    const normalizedRules = rules.map((rule) => this.normalizeNotificationRule(rule));
    const state = this.notificationService instanceof LocalAdminNotificationsService ? await this.notificationService.saveNotificationCenter(normalizedRules, adminUserId, options) : await this.notificationService.saveNotificationCenter(normalizedRules, adminUserId, options?.filter);
    return this.normalizeNotificationCenter(state);
  }
  async runNotificationRule(ruleKey, adminUserId) {
    const normalizedRuleKey = `${ruleKey ?? ""}`.trim();
    if (!normalizedRuleKey) {
      return {
        ruleKey: "",
        label: "",
        affectedCount: 0,
        status: "skipped",
        detail: "admin.jobs.error.missing.rule.key",
        ranAtIso: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const result = await this.notificationService.runNotificationRule(normalizedRuleKey, adminUserId);
    return this.normalizeNotificationRunResult(result, normalizedRuleKey);
  }
  async loadNotificationRuleRuntime(ruleKey, adminUserId) {
    const normalizedRuleKey = `${ruleKey ?? ""}`.trim();
    if (!normalizedRuleKey) {
      return null;
    }
    const rule = await this.notificationService.loadNotificationRuleRuntime(normalizedRuleKey, adminUserId);
    return rule ? this.normalizeNotificationRule(rule) : null;
  }
  subscribeNotificationRuleUpdates(adminUserId, onEvent) {
    return this.notificationService.subscribeNotificationRuleUpdates(adminUserId, (event) => onEvent(this.normalizeNotificationRuleLiveEvent(event)));
  }
  normalizeNotificationCenter(state) {
    return {
      rules: (state.rules ?? []).map((rule) => this.normalizeNotificationRule(rule)).sort((left, right) => left.priority - right.priority || left.ruleKey.localeCompare(right.ruleKey)),
      emailTemplates: (state.emailTemplates ?? []).map((template) => ({
        templateKey: `${template.templateKey ?? ""}`.trim(),
        name: `${template.name ?? ""}`.trim(),
        category: `${template.category ?? ""}`.trim(),
        description: `${template.description ?? ""}`.trim()
      })).filter((template) => template.templateKey.length > 0),
      filterCounts: this.normalizeProcessFilterCounts(state.filterCounts, state.rules ?? []),
      updatedDate: `${state.updatedDate ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  normalizeProcessFilterCounts(counts, rules) {
    const fallback = {
      all: rules.filter((rule) => rule.triggerKind === "scheduled_process").length
    };
    const normalized = {};
    for (const [key, value] of Object.entries(counts ?? fallback)) {
      const normalizedKey = `${key ?? ""}`.trim();
      const parsed = Math.trunc(Number(value));
      if (normalizedKey && Number.isFinite(parsed)) {
        normalized[normalizedKey] = Math.max(0, parsed);
      }
    }
    return Object.keys(normalized).length ? normalized : fallback;
  }
  normalizeNotificationRule(rule) {
    const triggerKind = this.normalizeNotificationTriggerKind(rule.triggerKind);
    const timingMode = this.normalizeNotificationTimingMode(rule.timing?.mode, triggerKind);
    const interval = this.normalizeNotificationInterval(rule.timing?.intervalAmount, rule.timing?.intervalUnit, rule.timing?.intervalSeconds, rule.timing?.intervalMinutes);
    const time = this.normalizeNotificationTime(rule.timing?.time);
    return {
      id: `${rule.id ?? ""}`.trim() || null,
      ruleKey: `${rule.ruleKey ?? ""}`.trim(),
      label: `${rule.label ?? ""}`.trim() || `${rule.ruleKey ?? ""}`.trim(),
      category: `${rule.category ?? ""}`.trim() || "Action",
      description: `${rule.description ?? ""}`.trim(),
      actionKey: `${rule.actionKey ?? ""}`.trim(),
      triggerKind,
      enabled: rule.enabled === true,
      manualRunEnabled: rule.manualRunEnabled === true,
      adminManageable: this.normalizeAdminManageable(rule),
      priority: Math.max(0, Math.trunc(Number(rule.priority) || 1e3)),
      channels: {
        pushEnabled: rule.channels?.pushEnabled === true,
        emailEnabled: rule.channels?.emailEnabled === true,
        inAppEnabled: rule.channels?.inAppEnabled === true,
        supportChatEnabled: rule.channels?.supportChatEnabled === true
      },
      timing: {
        mode: timingMode,
        delayMinutes: Math.max(0, Math.trunc(Number(rule.timing?.delayMinutes) || 0)),
        intervalMinutes: interval.minutes,
        intervalSeconds: interval.seconds,
        intervalAmount: interval.amount,
        intervalUnit: interval.unit,
        month: this.clampInteger(rule.timing?.month, 1, 12, 1),
        dayOfMonth: this.clampInteger(rule.timing?.dayOfMonth, 1, 31, 1),
        time,
        timezone: `${rule.timing?.timezone ?? ""}`.trim() || "UTC",
        cronExpression: `${rule.timing?.cronExpression ?? ""}`.trim() || this.intervalExpression(interval.amount, interval.unit, time)
      },
      scheduleSlots: this.normalizeScheduleSlots(rule.scheduleSlots, timingMode),
      parameters: (rule.parameters ?? []).map((field) => this.normalizeNotificationRuleParameter(field)).filter((field) => field.key),
      message: {
        pushTitle: `${rule.message?.pushTitle ?? ""}`.trim(),
        pushBody: `${rule.message?.pushBody ?? ""}`.trim(),
        emailTemplateKey: `${rule.message?.emailTemplateKey ?? ""}`.trim(),
        emailSubject: `${rule.message?.emailSubject ?? ""}`.trim(),
        emailBody: `${rule.message?.emailBody ?? ""}`.trim(),
        ctaPath: `${rule.message?.ctaPath ?? ""}`.trim() || "/game"
      },
      runState: {
        currentStatus: `${rule.runState?.currentStatus ?? ""}`.trim() || (rule.enabled ? "idle" : "suspended"),
        progressPercent: this.clampInteger(rule.runState?.progressPercent, 0, 100, 0),
        progressDetail: `${rule.runState?.progressDetail ?? ""}`.trim(),
        startedAtIso: `${rule.runState?.startedAtIso ?? ""}`.trim(),
        finishedAtIso: `${rule.runState?.finishedAtIso ?? ""}`.trim(),
        durationMillis: Math.max(0, Math.trunc(Number(rule.runState?.durationMillis) || 0)),
        lastRunAtIso: `${rule.runState?.lastRunAtIso ?? ""}`.trim(),
        lastRunStatus: `${rule.runState?.lastRunStatus ?? ""}`.trim(),
        lastRunDetail: `${rule.runState?.lastRunDetail ?? ""}`.trim(),
        lastRunCount: Math.max(0, Math.trunc(Number(rule.runState?.lastRunCount) || 0)),
        lastRunUser: `${rule.runState?.lastRunUser ?? ""}`.trim(),
        pendingCount: Math.max(0, Math.trunc(Number(rule.runState?.pendingCount) || 0)),
        pendingCountUnit: `${rule.runState?.pendingCountUnit ?? ""}`.trim(),
        pendingCountUpdatedAtIso: `${rule.runState?.pendingCountUpdatedAtIso ?? ""}`.trim()
      },
      runHistory: (rule.runHistory ?? []).map((entry, index) => ({
        id: `${entry?.id ?? ""}`.trim() || `run-${index}`,
        trigger: `${entry?.trigger ?? ""}`.trim() || "manual",
        runnerUser: `${entry?.runnerUser ?? ""}`.trim(),
        startedAtIso: `${entry?.startedAtIso ?? ""}`.trim(),
        finishedAtIso: `${entry?.finishedAtIso ?? ""}`.trim(),
        durationMillis: Math.max(0, Math.trunc(Number(entry?.durationMillis) || 0)),
        processedCount: Math.max(0, Math.trunc(Number(entry?.processedCount) || 0)),
        status: `${entry?.status ?? ""}`.trim() || "completed",
        detail: `${entry?.detail ?? ""}`.trim()
      })).sort((left, right) => Date.parse(right.finishedAtIso || right.startedAtIso) - Date.parse(left.finishedAtIso || left.startedAtIso)).slice(0, 12),
      updatedDate: `${rule.updatedDate ?? ""}`.trim() || null,
      updatedUser: `${rule.updatedUser ?? ""}`.trim() || null
    };
  }
  normalizeNotificationRuleParameter(field) {
    const valueType = field.valueType === "text" ? "text" : "number";
    const numberValue = valueType === "number" ? Number.isFinite(Number(field.numberValue)) ? Number(field.numberValue) : 0 : null;
    return {
      key: `${field.key ?? ""}`.trim(),
      label: `${field.label ?? ""}`.trim() || `${field.key ?? ""}`.trim(),
      labelKey: `${field.labelKey ?? ""}`.trim() || this.paramFieldLabelKey(field.key),
      group: `${field.group ?? ""}`.trim() || "General",
      groupKey: `${field.groupKey ?? ""}`.trim() || this.paramGroupLabelKey(field.group),
      valueType,
      numberValue,
      textValue: valueType === "text" ? `${field.textValue ?? ""}`.trim() : null,
      unit: `${field.unit ?? ""}`.trim(),
      options: (field.options ?? []).map((option) => this.normalizeNotificationRuleParameterOption(option)),
      strategy: `${field.strategy ?? ""}`.trim(),
      strategyKey: `${field.strategyKey ?? ""}`.trim() || this.paramStrategyLabelKey(field.strategy),
      readOnly: field.readOnly === true
    };
  }
  normalizeNotificationRuleParameterOption(option) {
    const value = `${option.value ?? ""}`.trim();
    return {
      value,
      label: `${option.label ?? ""}`.trim() || value,
      labelKey: `${option.labelKey ?? ""}`.trim() || this.paramStrategyLabelKey(value)
    };
  }
  normalizeNotificationRunResult(result, fallbackRuleKey) {
    return {
      ruleKey: `${result?.ruleKey ?? fallbackRuleKey}`.trim(),
      label: `${result?.label ?? fallbackRuleKey}`.trim(),
      affectedCount: Math.max(0, Math.trunc(Number(result?.affectedCount) || 0)),
      status: `${result?.status ?? "completed"}`.trim(),
      detail: `${result?.detail ?? ""}`.trim(),
      ranAtIso: `${result?.ranAtIso ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  normalizeNotificationRuleLiveEvent(event) {
    return {
      type: "rule-runtime",
      ruleKey: `${event.ruleKey ?? ""}`.trim(),
      runState: {
        currentStatus: `${event.runState?.currentStatus ?? ""}`.trim(),
        progressPercent: this.clampInteger(event.runState?.progressPercent, 0, 100, 0),
        progressDetail: `${event.runState?.progressDetail ?? ""}`.trim(),
        startedAtIso: `${event.runState?.startedAtIso ?? ""}`.trim(),
        finishedAtIso: `${event.runState?.finishedAtIso ?? ""}`.trim(),
        durationMillis: Math.max(0, Math.trunc(Number(event.runState?.durationMillis) || 0)),
        lastRunAtIso: `${event.runState?.lastRunAtIso ?? ""}`.trim(),
        lastRunStatus: `${event.runState?.lastRunStatus ?? ""}`.trim(),
        lastRunDetail: `${event.runState?.lastRunDetail ?? ""}`.trim(),
        lastRunCount: Math.max(0, Math.trunc(Number(event.runState?.lastRunCount) || 0)),
        lastRunUser: `${event.runState?.lastRunUser ?? ""}`.trim(),
        pendingCount: Math.max(0, Math.trunc(Number(event.runState?.pendingCount) || 0)),
        pendingCountUnit: `${event.runState?.pendingCountUnit ?? ""}`.trim(),
        pendingCountUpdatedAtIso: `${event.runState?.pendingCountUpdatedAtIso ?? ""}`.trim()
      },
      runHistory: (event.runHistory ?? []).map((entry, index) => ({
        id: `${entry?.id ?? ""}`.trim() || `run-${index}`,
        trigger: `${entry?.trigger ?? ""}`.trim() || "scheduled",
        runnerUser: `${entry?.runnerUser ?? ""}`.trim(),
        startedAtIso: `${entry?.startedAtIso ?? ""}`.trim(),
        finishedAtIso: `${entry?.finishedAtIso ?? ""}`.trim(),
        durationMillis: Math.max(0, Math.trunc(Number(entry?.durationMillis) || 0)),
        processedCount: Math.max(0, Math.trunc(Number(entry?.processedCount) || 0)),
        status: `${entry?.status ?? ""}`.trim() || "completed",
        detail: `${entry?.detail ?? ""}`.trim()
      })),
      updatedDate: `${event.updatedDate ?? ""}`.trim(),
      updatedUser: `${event.updatedUser ?? ""}`.trim()
    };
  }
  normalizeNotificationTriggerKind(value) {
    return value === "timed" || value === "scheduled_process" ? value : "action";
  }
  normalizeNotificationTimingMode(value, triggerKind) {
    if (value === "delay" || value === "interval" || value === "yearly" || value === "manual") {
      return value;
    }
    return triggerKind === "scheduled_process" ? "interval" : "immediate";
  }
  normalizeNotificationTime(value) {
    const normalized = `${value ?? ""}`.trim();
    return /^\d{2}:\d{2}$/.test(normalized) ? normalized : "09:00";
  }
  normalizeScheduleSlots(slots, timingMode) {
    const normalized = (slots ?? []).map((slot, index) => {
      const frequency = slot?.frequency === "one-time" || slot?.frequency === "weekly" || slot?.frequency === "bi-weekly" || slot?.frequency === "monthly" || slot?.frequency === "yearly" ? slot.frequency : "daily";
      const time = this.normalizeNotificationTime(slot?.time);
      const dayOfWeek = this.clampInteger(slot?.dayOfWeek, 1, 7, 1);
      const date = `${slot?.date ?? ""}`.trim();
      return {
        id: `${slot?.id ?? ""}`.trim() || `run-window-${index + 1}`,
        frequency,
        date,
        dayOfWeek,
        time,
        timezone: `${slot?.timezone ?? ""}`.trim() || "UTC",
        cronExpression: `${slot?.cronExpression ?? ""}`.trim() || this.scheduleSlotCron({ frequency, date, dayOfWeek, time }),
        actionKey: `${slot?.actionKey ?? ""}`.trim(),
        enabled: slot?.enabled !== false
      };
    });
    return normalized.length > 0 ? normalized : this.defaultScheduleSlots(timingMode);
  }
  defaultScheduleSlots(_timingMode) {
    return [];
  }
  scheduleSlotCron(input) {
    const [hour, minute] = this.normalizeNotificationTime(input.time).split(":").map((value) => Math.max(0, Math.trunc(Number(value) || 0)));
    if (input.frequency === "weekly") {
      const quartzDay = this.clampInteger(input.dayOfWeek, 1, 7, 1) % 7 + 1;
      return `0 ${minute} ${hour} ? * ${quartzDay}`;
    }
    if (input.frequency === "bi-weekly") {
      const quartzDay = this.clampInteger(input.dayOfWeek, 1, 7, 1) % 7 + 1;
      return `0 ${minute} ${hour} ? * ${quartzDay}`;
    }
    if (input.frequency === "monthly") {
      const day = this.scheduleDateParts(input.date).day;
      return `0 ${minute} ${hour} ${day} * ?`;
    }
    if (input.frequency === "yearly") {
      const date = this.scheduleDateParts(input.date);
      return `0 ${minute} ${hour} ${date.day} ${date.month} ?`;
    }
    if (input.frequency === "one-time" && /^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      const [, month, day] = input.date.split("-").map((value) => Math.max(1, Math.trunc(Number(value) || 1)));
      return `0 ${minute} ${hour} ${day} ${month} ?`;
    }
    return `0 ${minute} ${hour} * * ?`;
  }
  scheduleDateParts(value) {
    const match = `${value || ""}`.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return {
      month: match ? this.clampInteger(Number(match[2]), 1, 12, 1) : 1,
      day: match ? this.clampInteger(Number(match[3]), 1, 31, 1) : 1
    };
  }
  normalizeNotificationInterval(amountValue, unitValue, secondsValue, minutesValue) {
    const explicitAmount = Math.trunc(Number(amountValue) || 0);
    const explicitUnit = this.normalizeNotificationIntervalUnit(unitValue);
    if (explicitAmount > 0 && explicitUnit) {
      const seconds2 = explicitAmount * ADMIN_NOTIFICATION_INTERVAL_SECONDS[explicitUnit];
      return {
        amount: explicitAmount,
        unit: explicitUnit,
        seconds: seconds2,
        minutes: Math.max(1, Math.ceil(seconds2 / 60))
      };
    }
    const seconds = Math.max(1, Math.trunc(Number(secondsValue) || Math.max(1, Math.trunc(Number(minutesValue) || 60)) * 60));
    const unit = this.fixedNotificationIntervalUnit(seconds);
    return {
      amount: Math.max(1, Math.trunc(seconds / ADMIN_NOTIFICATION_INTERVAL_SECONDS[unit])),
      unit,
      seconds,
      minutes: Math.max(1, Math.ceil(seconds / 60))
    };
  }
  normalizeNotificationIntervalUnit(value) {
    const normalized = `${value ?? ""}`.trim();
    return Object.values(ADMIN_NOTIFICATION_INTERVAL_UNIT).includes(normalized) ? normalized : null;
  }
  fixedNotificationIntervalUnit(seconds) {
    const value = Math.max(1, Math.trunc(Number(seconds) || 1));
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.years === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.years;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.months === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.months;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.weeks === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.weeks;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.days === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.days;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.hours === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.hours;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.minutes === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.minutes;
    }
    return ADMIN_NOTIFICATION_INTERVAL_UNIT.seconds;
  }
  intervalExpression(amountValue, unit, time) {
    const amount = Math.max(1, Math.trunc(Number(amountValue) || 1));
    const [hour, minute] = this.normalizeNotificationTime(time).split(":").map((value) => Math.max(0, Math.trunc(Number(value) || 0)));
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.seconds) {
      return `0/${amount} * * * * ?`;
    }
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.minutes) {
      return `0 0/${amount} * * * ?`;
    }
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.hours) {
      return `0 ${minute} 0/${amount} * * ?`;
    }
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.days) {
      return `0 ${minute} ${hour} 1/${amount} * ?`;
    }
    return `@every ${amount} ${unit} @ ${this.normalizeNotificationTime(time)}`;
  }
  normalizeAdminManageable(rule) {
    const raw = rule.adminManageable;
    if (raw !== void 0 && raw !== null) {
      return raw === true;
    }
    return false;
  }
  paramFieldLabelKey(fieldKey) {
    const normalized = `${fieldKey ?? ""}`.trim();
    return normalized ? `admin.params.field.${normalized}` : "";
  }
  paramGroupLabelKey(group) {
    const normalized = this.paramsI18nSegment(group);
    return normalized ? `admin.params.group.${normalized}` : "admin.params.group.general";
  }
  paramStrategyLabelKey(strategy) {
    const normalized = `${strategy ?? ""}`.trim();
    return normalized ? `admin.params.strategy.${normalized}` : "";
  }
  paramsI18nSegment(value) {
    return `${value ?? ""}`.trim().replace(/([a-z0-9])([A-Z])/g, "$1.$2").replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").toLocaleLowerCase("en-US");
  }
  clampInteger(value, min, max, fallback) {
    const parsed = Math.trunc(Number(value));
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(min, Math.min(max, parsed));
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AdminNotificationsService_BaseFactory;
    return function AdminNotificationsService_Factory(__ngFactoryType__) {
      return (\u0275AdminNotificationsService_BaseFactory || (\u0275AdminNotificationsService_BaseFactory = \u0275\u0275getInheritedFactory(_AdminNotificationsService)))(__ngFactoryType__ || _AdminNotificationsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminNotificationsService, factory: _AdminNotificationsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminNotificationsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/admin-moderation.service.ts
var AdminModerationService = class _AdminModerationService extends BaseRouteModeService {
  localService = inject(LocalAdminModerationService);
  httpService = inject(HttpAdminModerationService);
  get moderationService() {
    return this.resolveRouteService("/admin/reports", this.localService, this.httpService);
  }
  async warnUser(userId, admin, message, reportId) {
    return await this.moderationService.warnUser(userId, admin, message, reportId);
  }
  async blockUser(userId, admin, message) {
    return await this.moderationService.blockUser(userId, admin, message);
  }
  async unblockUser(userId, admin) {
    return await this.moderationService.unblockUser(userId, admin);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AdminModerationService_BaseFactory;
    return function AdminModerationService_Factory(__ngFactoryType__) {
      return (\u0275AdminModerationService_BaseFactory || (\u0275AdminModerationService_BaseFactory = \u0275\u0275getInheritedFactory(_AdminModerationService)))(__ngFactoryType__ || _AdminModerationService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminModerationService, factory: _AdminModerationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminModerationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/admin-affinity-graph.service.ts
var ADMIN_AFFINITY_GRAPH_ROUTE = "/admin/affinity-graph";
var AFFINITY_GRAPH_FOREST_BASE_BUDGET = 16;
var AFFINITY_GRAPH_LABEL_KEYS = {
  graphView: "admin.affinity.graph.view",
  clusterDetail: "admin.affinity.graph.cluster.detail",
  clusterEyebrow: "admin.affinity.graph.cluster.eyebrow",
  clusterViewLabel: "admin.affinity.graph.cluster.view.label",
  clusterTitle: "admin.affinity.graph.cluster.title",
  clusterIsolatedTitle: "admin.affinity.graph.cluster.isolated.title",
  clusterExpandedKicker: "admin.affinity.graph.cluster.expanded.kicker",
  clusterIsolatedKicker: "admin.affinity.graph.cluster.isolated.kicker",
  clusterSummary: "admin.affinity.graph.cluster.summary"
};
var AdminAffinityGraphService = class _AdminAffinityGraphService extends BaseRouteModeService {
  localService = inject(LocalAdminAffinityGraphService);
  httpService = inject(HttpAdminAffinityGraphService);
  i18n = inject(I18nService);
  async loadInitialGraph(adminUserId, signal2) {
    if (this.isLocalAffinityGraph()) {
      return this.normalizeSnapshot(await this.readLocalGraphSnapshot(true, signal2), "demo");
    }
    return this.normalizeSnapshot(await this.loadHttpInitialGraph(adminUserId, signal2), "http");
  }
  async loadMeta(adminUserId, range, signal2) {
    return this.isLocalAffinityGraph() ? this.metaFromSnapshot(await this.demoSnapshot(range, false, signal2)) : await this.httpService.loadMeta(adminUserId, range, signal2);
  }
  async loadForests(adminUserId, range, signal2) {
    if (!this.isLocalAffinityGraph()) {
      return await this.httpService.loadForests(adminUserId, range, signal2);
    }
    const snapshot = await this.demoSnapshot(range, true, signal2);
    const components = this.components(snapshot.nodes, snapshot.edges);
    const forests = components.map((component, index) => this.forestFromComponent(component, index));
    const page = this.forestPage(forests, range);
    return {
      generatedAtIso: snapshot.generatedAtIso,
      source: snapshot.source,
      layoutVersion: snapshot.layoutVersion,
      forestCount: forests.length,
      forestLevel: page.forestLevel,
      maxForestLevel: page.maxForestLevel,
      limit: page.limit,
      offset: page.offset,
      forests: page.forests
    };
  }
  async loadTile(adminUserId, tile, signal2) {
    if (!this.isLocalAffinityGraph()) {
      return await this.httpService.loadTile(adminUserId, tile, signal2);
    }
    const snapshot = await this.demoSnapshot(tile, true, signal2);
    return {
      generatedAtIso: snapshot.generatedAtIso,
      source: snapshot.source,
      layoutVersion: snapshot.layoutVersion,
      z: Math.max(0, Math.trunc(Number(tile?.z ?? 0))),
      x: Math.max(0, Math.trunc(Number(tile?.x ?? 0))),
      y: Math.max(0, Math.trunc(Number(tile?.y ?? 0))),
      nodeCount: snapshot.nodes.length,
      edgeCount: snapshot.edges.length,
      truncated: false,
      nodes: snapshot.nodes,
      edges: snapshot.edges
    };
  }
  async loadNeighborhood(userId, depth, adminUserId, range, signal2) {
    if (!this.isLocalAffinityGraph()) {
      return await this.httpService.loadNeighborhood(userId, depth, adminUserId, range, signal2);
    }
    const snapshot = await this.demoSnapshot(range, true, signal2);
    const normalizedUserId = `${userId ?? ""}`.trim();
    const selectedIds = this.neighborhoodIds(snapshot.edges, normalizedUserId, Math.max(1, Math.min(3, Math.trunc(Number(depth ?? 1)))));
    if (snapshot.nodes.some((node) => node.id === normalizedUserId)) {
      selectedIds.add(normalizedUserId);
    }
    return {
      generatedAtIso: snapshot.generatedAtIso,
      source: snapshot.source,
      layoutVersion: snapshot.layoutVersion,
      centerUserId: normalizedUserId,
      depth: Math.max(1, Math.min(3, Math.trunc(Number(depth ?? 1)))),
      nodes: snapshot.nodes.filter((node) => selectedIds.has(node.id)),
      edges: snapshot.edges.filter((edge) => selectedIds.has(edge.source) && selectedIds.has(edge.target))
    };
  }
  async rebuildLayout(adminUserId, signal2) {
    return this.isLocalAffinityGraph() ? this.metaFromSnapshot(await this.demoSnapshot(void 0, false, signal2)) : await this.httpService.rebuildLayout(adminUserId, signal2);
  }
  isLocalAffinityGraph() {
    return this.isLocalRouteEnabled(ADMIN_AFFINITY_GRAPH_ROUTE);
  }
  async loadHttpInitialGraph(adminUserId, signal2) {
    const [meta, forests, firstTile] = await Promise.all([
      this.httpService.loadMeta(adminUserId, void 0, signal2),
      this.httpService.loadForests(adminUserId, { forestLevel: 0, limit: AFFINITY_GRAPH_FOREST_BASE_BUDGET + 4, offset: 0 }, signal2),
      this.httpService.loadTile(adminUserId, { z: 0, x: 0, y: 0, minWeight: 0, maxWeight: 1 }, signal2)
    ]);
    const nodesById = /* @__PURE__ */ new Map();
    for (const node of firstTile.nodes ?? []) {
      nodesById.set(node.id, node);
    }
    return this.normalizeSnapshot({
      generatedAtIso: meta.generatedAtIso ?? forests.generatedAtIso ?? firstTile.generatedAtIso,
      source: "http",
      layoutVersion: meta.layoutVersion ?? forests.layoutVersion ?? firstTile.layoutVersion,
      memberCount: meta.memberCount,
      linkCount: meta.linkCount,
      componentCount: meta.componentCount,
      isolatedCount: meta.isolatedCount,
      forestCount: forests.forestCount ?? meta.componentCount,
      maxForestLevel: forests.maxForestLevel,
      maxZoom: meta.maxZoom,
      nodes: [...nodesById.values()],
      edges: firstTile.edges ?? [],
      forests: forests.forests ?? []
    }, "http");
  }
  async demoSnapshot(range, waitForRouteDelay = false, signal2) {
    const snapshot = await this.readLocalGraphSnapshot(waitForRouteDelay, signal2);
    this.throwIfAborted(signal2);
    return __spreadProps(__spreadValues({}, snapshot), {
      edges: this.filterEdges(snapshot.edges, range)
    });
  }
  async readLocalGraphSnapshot(waitForRouteDelay = false, signal2) {
    const snapshot = await this.localService.readGraphSnapshot({ waitForRouteDelay, signal: signal2 });
    this.throwIfAborted(signal2);
    if (!snapshot) {
      throw new Error("Demo affinity graph snapshot is not bootstrapped.");
    }
    return this.normalizeSnapshot(snapshot, "demo");
  }
  throwIfAborted(signal2) {
    if (signal2?.aborted) {
      const error = new Error("Request aborted.");
      error.name = "AbortError";
      throw error;
    }
  }
  metaFromSnapshot(snapshot) {
    const components = this.components(snapshot.nodes, snapshot.edges);
    return {
      generatedAtIso: snapshot.generatedAtIso,
      source: snapshot.source,
      layoutVersion: snapshot.layoutVersion,
      memberCount: snapshot.nodes.length,
      linkCount: snapshot.edges.length,
      componentCount: components.length,
      isolatedCount: components.filter((component) => component.nodes.length === 1 && component.edges.length === 0).length,
      maxZoom: 6,
      tileSize: 256,
      nodeRenderBudget: 1e3,
      edgeRenderBudget: 5e3,
      materialized: false
    };
  }
  components(nodes, edges) {
    const parent = new Map(nodes.map((node) => [node.id, node.id]));
    const find = (id) => {
      const parentId = parent.get(id) ?? id;
      if (parentId === id) {
        return id;
      }
      const root = find(parentId);
      parent.set(id, root);
      return root;
    };
    const union = (left, right) => {
      const leftRoot = find(left);
      const rightRoot = find(right);
      if (leftRoot !== rightRoot) {
        parent.set(rightRoot, leftRoot);
      }
    };
    edges.forEach((edge) => union(edge.source, edge.target));
    const nodesByRoot = /* @__PURE__ */ new Map();
    nodes.forEach((node) => {
      const root = find(node.id);
      nodesByRoot.set(root, [...nodesByRoot.get(root) ?? [], node]);
    });
    return [...nodesByRoot.entries()].map(([root, componentNodes], index) => ({
      id: `c${index}`,
      nodes: componentNodes,
      edges: edges.filter((edge) => find(edge.source) === root && find(edge.target) === root)
    })).sort((left, right) => right.nodes.length - left.nodes.length || left.id.localeCompare(right.id));
  }
  forestFromComponent(component, index) {
    const representative = [...component.nodes].sort((left, right) => {
      const leftWeight = this.nodeWeight(left.id, component.edges);
      const rightWeight = this.nodeWeight(right.id, component.edges);
      return rightWeight - leftWeight || left.name.localeCompare(right.name) || left.id.localeCompare(right.id);
    })[0] ?? component.nodes[0];
    const angle = index * 2.399963229728653;
    const distance = index === 0 ? 0 : 70 + Math.sqrt(index) * 42;
    return {
      componentId: component.id,
      representativeUserId: representative?.id ?? "",
      representativeName: representative?.name ?? "",
      representativeInitials: representative?.initials ?? "",
      gender: representative?.gender ?? null,
      memberCount: component.nodes.length,
      edgeCount: component.edges.length,
      weightedDegree: this.round(component.edges.reduce((total, edge) => total + edge.weight, 0)),
      x: this.round(Math.cos(angle) * distance),
      y: this.round((index % 3 - 1) * 10),
      z: this.round(Math.sin(angle) * distance),
      radius: this.round(Math.max(3, Math.sqrt(component.nodes.length) * 5.5))
    };
  }
  forestPage(forests, params) {
    const total = forests.length;
    const maxForestLevel = this.maxForestLevel(total);
    const forestLevel = Math.max(0, Math.min(maxForestLevel, Math.trunc(Number(params?.forestLevel ?? 0))));
    const levelLimit = Math.min(total, Math.max(1, AFFINITY_GRAPH_FOREST_BASE_BUDGET * 2 ** forestLevel));
    const limit = Math.max(1, Math.min(total || 1, Math.trunc(Number(params?.limit ?? levelLimit))));
    const offset = Math.max(0, Math.min(total, Math.trunc(Number(params?.offset ?? 0))));
    return {
      forests: forests.slice(offset, offset + limit),
      forestLevel,
      maxForestLevel,
      limit,
      offset
    };
  }
  maxForestLevel(totalCount) {
    const total = Math.max(1, Math.trunc(Number(totalCount) || 1));
    return Math.max(0, Math.ceil(Math.log2(total / AFFINITY_GRAPH_FOREST_BASE_BUDGET)));
  }
  neighborhoodIds(edges, userId, depth) {
    const adjacency = /* @__PURE__ */ new Map();
    edges.forEach((edge) => {
      adjacency.set(edge.source, [...adjacency.get(edge.source) ?? [], edge]);
      adjacency.set(edge.target, [...adjacency.get(edge.target) ?? [], edge]);
    });
    const selected = /* @__PURE__ */ new Set();
    const queue = [{ id: userId, depth: 0 }];
    selected.add(userId);
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || current.depth >= depth) {
        continue;
      }
      for (const edge of adjacency.get(current.id) ?? []) {
        const nextId = edge.source === current.id ? edge.target : edge.source;
        if (!selected.has(nextId)) {
          selected.add(nextId);
          queue.push({ id: nextId, depth: current.depth + 1 });
        }
      }
    }
    return selected;
  }
  filterEdges(edges, range) {
    const minWeight = this.clamp(Number(range?.minWeight ?? 0), 0, 1);
    const maxWeight = this.clamp(Number(range?.maxWeight ?? 1), 0, 1);
    const min = Math.min(minWeight, maxWeight);
    const max = Math.max(minWeight, maxWeight);
    return edges.filter((edge) => edge.weight >= min && edge.weight <= max);
  }
  nodeWeight(nodeId, edges) {
    return edges.reduce((total, edge) => total + (edge.source === nodeId || edge.target === nodeId ? edge.weight : 0), 0);
  }
  edgeKey(source, target) {
    return source.localeCompare(target) <= 0 ? `${source}:${target}` : `${target}:${source}`;
  }
  normalizeSnapshot(snapshot, fallbackSource) {
    const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
    const nodeIds = /* @__PURE__ */ new Set();
    const normalizedNodes = nodes.map((node) => this.normalizeNode(node)).filter((node) => {
      if (!node || nodeIds.has(node.id)) {
        return false;
      }
      nodeIds.add(node.id);
      return true;
    });
    const normalizedEdges = (Array.isArray(snapshot?.edges) ? snapshot.edges : []).map((edge) => this.normalizeEdge(edge)).filter((edge) => Boolean(edge && nodeIds.has(edge.source) && nodeIds.has(edge.target) && edge.source !== edge.target));
    const normalizedForests = (Array.isArray(snapshot?.forests) ? snapshot.forests : []).map((forest) => this.normalizeForest(forest)).filter((forest) => Boolean(forest));
    return {
      generatedAtIso: snapshot?.generatedAtIso ?? (/* @__PURE__ */ new Date()).toISOString(),
      source: snapshot?.source ?? fallbackSource,
      layoutVersion: snapshot?.layoutVersion ?? `${fallbackSource}-${snapshot?.generatedAtIso ?? Date.now()}`,
      memberCount: this.positiveInteger(snapshot?.memberCount, normalizedNodes.length),
      linkCount: this.positiveInteger(snapshot?.linkCount, normalizedEdges.length),
      componentCount: this.positiveInteger(snapshot?.componentCount ?? snapshot?.forestCount, normalizedForests.length),
      isolatedCount: this.positiveInteger(snapshot?.isolatedCount, 0),
      forestCount: this.positiveInteger(snapshot?.forestCount ?? snapshot?.componentCount, normalizedForests.length),
      forestLevel: this.positiveInteger(snapshot?.forestLevel, 0),
      maxForestLevel: this.positiveInteger(snapshot?.maxForestLevel, 0),
      maxZoom: this.positiveInteger(snapshot?.maxZoom, 0),
      labels: this.affinityGraphLabels(),
      nodes: normalizedNodes,
      edges: normalizedEdges,
      forests: normalizedForests
    };
  }
  affinityGraphLabels() {
    return Object.fromEntries(Object.entries(AFFINITY_GRAPH_LABEL_KEYS).map(([labelKey, i18nKey]) => [
      labelKey,
      this.i18n.translate(i18nKey)
    ]));
  }
  normalizeNode(node) {
    const id = `${node?.id ?? ""}`.trim();
    if (!id) {
      return null;
    }
    const images = (node?.images ?? []).map((image2) => `${image2 ?? ""}`.trim()).filter(Boolean);
    const image = `${node?.image ?? images[0] ?? ""}`.trim();
    return __spreadProps(__spreadValues({}, node), {
      id,
      name: `${node?.name ?? ""}`.trim() || id,
      initials: `${node?.initials ?? ""}`.trim().slice(0, 3).toUpperCase() || "M",
      gender: node?.gender ?? null,
      city: node?.city ?? null,
      age: Number.isFinite(Number(node?.age)) ? Math.trunc(Number(node?.age)) : null,
      headline: node?.headline ?? null,
      traitLabel: node?.traitLabel ?? null,
      statusText: node?.statusText ?? null,
      profileStatus: node?.profileStatus ?? null,
      image: image || null,
      images,
      componentId: node?.componentId ?? null,
      x: Number.isFinite(Number(node?.x)) ? Number(node?.x) : null,
      y: Number.isFinite(Number(node?.y)) ? Number(node?.y) : null,
      z: Number.isFinite(Number(node?.z)) ? Number(node?.z) : null,
      degree: Number.isFinite(Number(node?.degree)) ? Math.trunc(Number(node?.degree)) : null,
      weightedDegree: Number.isFinite(Number(node?.weightedDegree)) ? Number(node?.weightedDegree) : null,
      centrality: Number.isFinite(Number(node?.centrality)) ? Number(node?.centrality) : null,
      forestMemberCount: Number.isFinite(Number(node?.forestMemberCount)) ? Math.trunc(Number(node?.forestMemberCount)) : null,
      forestEdgeCount: Number.isFinite(Number(node?.forestEdgeCount)) ? Math.trunc(Number(node?.forestEdgeCount)) : null
    });
  }
  normalizeEdge(edge) {
    const source = `${edge?.source ?? ""}`.trim();
    const target = `${edge?.target ?? ""}`.trim();
    if (!source || !target || source === target) {
      return null;
    }
    const weight = this.clamp(Number(edge?.weight ?? edge?.affinityScore ?? 0), 0, 1);
    if (weight <= 0) {
      return null;
    }
    return {
      id: `${edge?.id ?? this.edgeKey(source, target)}`.trim() || this.edgeKey(source, target),
      source,
      target,
      weight,
      affinityScore: Number.isFinite(Number(edge?.affinityScore)) ? Number(edge?.affinityScore) : weight,
      updatedDate: edge?.updatedDate ?? null
    };
  }
  normalizeForest(forest) {
    const componentId = `${forest?.componentId ?? ""}`.trim();
    if (!componentId) {
      return null;
    }
    const representativeUserId = `${forest?.representativeUserId ?? ""}`.trim();
    const representativeName = `${forest?.representativeName ?? ""}`.trim() || representativeUserId || componentId;
    const memberCount = Number.isFinite(Number(forest?.memberCount)) ? Math.max(0, Math.trunc(Number(forest?.memberCount))) : 0;
    const edgeCount = Number.isFinite(Number(forest?.edgeCount)) ? Math.max(0, Math.trunc(Number(forest?.edgeCount))) : 0;
    return {
      componentId,
      representativeUserId,
      representativeName,
      representativeInitials: `${forest?.representativeInitials ?? ""}`.trim().slice(0, 3).toUpperCase() || representativeName.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase() || "F",
      gender: forest?.gender ?? null,
      memberCount,
      edgeCount,
      weightedDegree: Number.isFinite(Number(forest?.weightedDegree)) ? Number(forest?.weightedDegree) : 0,
      x: Number.isFinite(Number(forest?.x)) ? Number(forest?.x) : 0,
      y: Number.isFinite(Number(forest?.y)) ? Number(forest?.y) : 0,
      z: Number.isFinite(Number(forest?.z)) ? Number(forest?.z) : 0,
      radius: Number.isFinite(Number(forest?.radius)) ? Math.max(0, Number(forest?.radius)) : Math.max(3, Math.sqrt(memberCount) * 5.5)
    };
  }
  clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  }
  positiveInteger(value, fallback) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 0) {
      return fallback;
    }
    return Math.trunc(numberValue);
  }
  round(value) {
    return Math.round(value * 1e3) / 1e3;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AdminAffinityGraphService_BaseFactory;
    return function AdminAffinityGraphService_Factory(__ngFactoryType__) {
      return (\u0275AdminAffinityGraphService_BaseFactory || (\u0275AdminAffinityGraphService_BaseFactory = \u0275\u0275getInheritedFactory(_AdminAffinityGraphService)))(__ngFactoryType__ || _AdminAffinityGraphService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminAffinityGraphService, factory: _AdminAffinityGraphService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminAffinityGraphService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/contacts.service.ts
var ContactsService = class _ContactsService extends BaseRouteModeService {
  localContactsService = inject(LocalContactsService);
  httpContactsService = inject(HttpContactsService);
  get contactsService() {
    return this.resolveRouteService("/navigator/contacts", this.localContactsService, this.httpContactsService);
  }
  loadContacts(userId) {
    return this.contactsService.loadContacts(userId);
  }
  loadContactProfile(userId) {
    return this.contactsService.loadContactProfile(userId);
  }
  saveContacts(userId, contacts) {
    return this.contactsService.saveContacts(userId, contacts);
  }
  deleteContact(userId, contactId) {
    return this.contactsService.deleteContact(userId, contactId);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ContactsService_BaseFactory;
    return function ContactsService_Factory(__ngFactoryType__) {
      return (\u0275ContactsService_BaseFactory || (\u0275ContactsService_BaseFactory = \u0275\u0275getInheritedFactory(_ContactsService)))(__ngFactoryType__ || _ContactsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ContactsService, factory: _ContactsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/activity-resources.service.ts
var ACTIVITY_SUB_EVENT_RESOURCES_ROUTE = "/activities/events/subevent-resources";
var ActivityResourcesService = class _ActivityResourcesService extends BaseRouteModeService {
  localActivityResourcesService = inject(LocalActivityResourcesService);
  httpActivityResourcesService = inject(HttpActivityResourcesService);
  userProfileStore = inject(UserProfileStore);
  activityStore = inject(ActivityStore);
  routeDelay = inject(RouteDelayService);
  get activityResourcesService() {
    return this.resolveRouteService(ACTIVITY_SUB_EVENT_RESOURCES_ROUTE, this.localActivityResourcesService, this.httpActivityResourcesService);
  }
  activeAssetOwnerUserId() {
    return this.normalizeId(this.userProfileStore.activeUserId());
  }
  waitForResourceRouteDelay(signal2) {
    return this.routeDelay.waitForRouteDelay(ACTIVITY_SUB_EVENT_RESOURCES_ROUTE, signal2, "Activity resources request aborted.");
  }
  peekSubEventResourceState(ownerId, subEventId, assetOwnerUserId = this.activeAssetOwnerUserId()) {
    const ref = this.normalizeRef(ownerId, subEventId, assetOwnerUserId);
    if (!ref) {
      return null;
    }
    return this.activityResourcesService.peekSubEventResourceState(ref);
  }
  async querySubEventResourceState(ownerId, subEventId, assetOwnerUserId = this.activeAssetOwnerUserId()) {
    const ref = this.normalizeRef(ownerId, subEventId, assetOwnerUserId);
    if (!ref) {
      return null;
    }
    const state = await this.activityResourcesService.querySubEventResourceState(ref);
    if (state) {
      this.activityStore.emitActivityResourceSync(ref);
    }
    return state;
  }
  async querySupplyContributionPage(ownerId, subEventId, assetId, page, pageSize, assetOwnerUserId = this.activeAssetOwnerUserId()) {
    const ref = this.normalizeRef(ownerId, subEventId, assetOwnerUserId);
    const normalizedAssetId = this.normalizeId(assetId);
    if (!ref || !normalizedAssetId) {
      return { items: [], total: 0, page: 0, pageSize: Math.max(1, Math.trunc(pageSize) || 1) };
    }
    return this.activityResourcesService.querySupplyContributionPage(ref, normalizedAssetId, Math.max(0, Math.trunc(page) || 0), Math.max(1, Math.trunc(pageSize) || 1));
  }
  async replaceSubEventResourceState(state, signal2) {
    if (!state) {
      return null;
    }
    const normalizedState = this.normalizeRef(state.ownerId, state.subEventId, state.assetOwnerUserId);
    if (!normalizedState) {
      return null;
    }
    const savedState = await this.activityResourcesService.replaceSubEventResourceState(__spreadProps(__spreadValues({}, state), {
      ownerId: normalizedState.ownerId,
      subEventId: normalizedState.subEventId,
      assetOwnerUserId: normalizedState.assetOwnerUserId
    }), signal2);
    if (savedState) {
      this.activityStore.emitActivityResourceSync({
        ownerId: savedState.ownerId,
        subEventId: savedState.subEventId,
        assetOwnerUserId: savedState.assetOwnerUserId
      });
    }
    return savedState;
  }
  normalizeRef(ownerId, subEventId, assetOwnerUserId) {
    const normalizedOwnerId = this.normalizeId(ownerId);
    const normalizedSubEventId = this.normalizeId(subEventId);
    const normalizedAssetOwnerUserId = this.normalizeId(assetOwnerUserId);
    if (!normalizedOwnerId || !normalizedSubEventId || !normalizedAssetOwnerUserId) {
      return null;
    }
    return {
      ownerId: normalizedOwnerId,
      subEventId: normalizedSubEventId,
      assetOwnerUserId: normalizedAssetOwnerUserId
    };
  }
  normalizeId(value) {
    return typeof value === "string" ? value.trim() : "";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ActivityResourcesService_BaseFactory;
    return function ActivityResourcesService_Factory(__ngFactoryType__) {
      return (\u0275ActivityResourcesService_BaseFactory || (\u0275ActivityResourcesService_BaseFactory = \u0275\u0275getInheritedFactory(_ActivityResourcesService)))(__ngFactoryType__ || _ActivityResourcesService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivityResourcesService, factory: _ActivityResourcesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityResourcesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/assets.service.ts
var AssetsService = class _AssetsService extends BaseRouteModeService {
  static ASSETS_ROUTE = "/assets";
  static ASSET_AVAILABILITY_ROUTE = "/assets/availability";
  localAssetsService = inject(LocalAssetsService);
  httpAssetsService = inject(HttpAssetsService);
  get assetsService() {
    return this.resolveRouteService(_AssetsService.ASSETS_ROUTE, this.localAssetsService, this.httpAssetsService);
  }
  get assetAvailabilityService() {
    return this.resolveRouteService(_AssetsService.ASSET_AVAILABILITY_ROUTE, this.localAssetsService, this.httpAssetsService);
  }
  peekOwnedAssetsByUser(userId) {
    return this.assetsService.peekOwnedAssetsByUser(userId);
  }
  peekOwnedAssetById(userId, assetId) {
    return this.assetsService.peekOwnedAssetById(userId, assetId);
  }
  async queryOwnedAssetsByUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    return this.assetsService.queryOwnedAssetsByUser(normalizedUserId);
  }
  async loadOwnedAssetDetailById(userId, assetId) {
    const normalizedUserId = userId.trim();
    const normalizedAssetId = assetId.trim();
    if (!normalizedUserId || !normalizedAssetId) {
      return null;
    }
    return this.assetsService.loadOwnedAssetDetailById(normalizedUserId, normalizedAssetId);
  }
  async queryVisibleAssets(query) {
    const normalizedUserId = query.userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    return this.assetsService.queryVisibleAssets(__spreadProps(__spreadValues({}, query), {
      userId: normalizedUserId
    }));
  }
  async queryVisibleAssetsPage(query) {
    const normalizedUserId = query.userId.trim();
    if (!normalizedUserId) {
      return {
        items: [],
        total: 0,
        nextCursor: null
      };
    }
    return this.assetsService.queryVisibleAssetsPage(__spreadProps(__spreadValues({}, query), {
      userId: normalizedUserId,
      pageSize: Math.max(1, Math.trunc(Number(query.pageSize) || 1))
    }));
  }
  async loadOccupancyByAssetId(query, options = {}) {
    const normalizedUserId = query.userId.trim();
    const normalizedAssetId = query.assetId.trim();
    if (!normalizedUserId || !normalizedAssetId) {
      return {
        items: [],
        total: 0,
        nextCursor: null
      };
    }
    return this.assetAvailabilityService.loadOccupancyByAssetId(__spreadProps(__spreadValues({}, query), {
      userId: normalizedUserId,
      assetId: normalizedAssetId,
      page: Math.max(0, Math.trunc(Number(query.page) || 0)),
      pageSize: Math.max(1, Math.trunc(Number(query.pageSize) || 1))
    }), options);
  }
  async loadStatByAssetId(query, options = {}) {
    const normalizedUserId = query.userId.trim();
    const normalizedAssetId = query.assetId.trim();
    if (!normalizedUserId || !normalizedAssetId) {
      return {
        items: [],
        total: 0,
        nextCursor: null
      };
    }
    return this.assetAvailabilityService.loadStatByAssetId(__spreadProps(__spreadValues({}, query), {
      userId: normalizedUserId,
      assetId: normalizedAssetId,
      page: Math.max(0, Math.trunc(Number(query.page) || 0)),
      pageSize: Math.max(1, Math.trunc(Number(query.pageSize) || 1))
    }), options);
  }
  async saveOwnedAsset(userId, asset) {
    return this.assetsService.saveOwnedAsset(userId, asset);
  }
  async applyMemberStatusChange(request) {
    return this.assetsService.applyMemberStatusChange(request);
  }
  async replaceOwnedAssets(userId, assets) {
    return this.assetsService.replaceOwnedAssets(userId, assets);
  }
  async deleteOwnedAsset(userId, assetId) {
    await this.assetsService.deleteOwnedAsset(userId, assetId);
  }
  async takeOverOwnedAsset(userId, assetId) {
    return this.assetsService.takeOverOwnedAsset(userId, assetId);
  }
  async makeAssetManager(userId, assetId, targetUserId) {
    return this.assetsService.makeAssetManager(userId, assetId, targetUserId);
  }
  async revokeAssetManager(userId, assetId, targetUserId) {
    return this.assetsService.revokeAssetManager(userId, assetId, targetUserId);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AssetsService_BaseFactory;
    return function AssetsService_Factory(__ngFactoryType__) {
      return (\u0275AssetsService_BaseFactory || (\u0275AssetsService_BaseFactory = \u0275\u0275getInheritedFactory(_AssetsService)))(__ngFactoryType__ || _AssetsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AssetsService, factory: _AssetsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/asset-tickets.service.ts
var AssetTicketsService = class _AssetTicketsService extends BaseRouteModeService {
  localAssetTicketsService = inject(LocalAssetTicketsService);
  httpAssetTicketsService = inject(HttpAssetTicketsService);
  get assetTicketsService() {
    return this.resolveRouteService("/assets/tickets", this.localAssetTicketsService, this.httpAssetTicketsService);
  }
  peekTicketCountByUser(userId) {
    return this.assetTicketsService.peekTicketCountByUser(userId);
  }
  async queryTicketPage(query) {
    return this.assetTicketsService.queryTicketPage(query);
  }
  async syncTickets(request, signal2) {
    return this.assetTicketsService.syncTickets(request, signal2);
  }
  async validateTicket(request) {
    return this.assetTicketsService.validateTicket(request);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AssetTicketsService_BaseFactory;
    return function AssetTicketsService_Factory(__ngFactoryType__) {
      return (\u0275AssetTicketsService_BaseFactory || (\u0275AssetTicketsService_BaseFactory = \u0275\u0275getInheritedFactory(_AssetTicketsService)))(__ngFactoryType__ || _AssetTicketsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AssetTicketsService, factory: _AssetTicketsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetTicketsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/activity-invite-capacity.policy.ts
function partitionEventInvitesByCapacity(currentMembers, additions, capacityTotal) {
  if (!Number.isFinite(capacityTotal) || capacityTotal <= 0) {
    return {
      acceptedAdditions: additions.map((candidate) => __spreadValues({}, candidate)),
      rejections: []
    };
  }
  const occupiedPlaces = currentMembers.filter(occupiesEventCapacity).length;
  const availablePlaces = Math.max(0, Math.trunc(capacityTotal) - occupiedPlaces);
  return {
    acceptedAdditions: additions.slice(0, availablePlaces).map((candidate) => __spreadValues({}, candidate)),
    rejections: additions.slice(availablePlaces).map((candidate) => ({
      userId: candidate.userId,
      reason: "capacity-full"
    }))
  };
}
function occupiesEventCapacity(member) {
  return member.status === "accepted" || member.status === "pending" && (member.requestKind === "invite" || member.pendingSource === "admin");
}

// src/app/shared/core/base/services/activity-invite-candidates.service.ts
var ACTIVITY_INVITE_CANDIDATES_ROUTE = "/activities/events/invite-candidates";
var ActivityInviteCandidatesService = class _ActivityInviteCandidatesService extends BaseRouteModeService {
  localActivityInviteCandidatesService = inject(LocalActivityInviteCandidatesService);
  httpActivityInviteCandidatesService = inject(HttpActivityInviteCandidatesService);
  activityMembersService = inject(ActivityMembersService);
  eventsService = inject(EventsService);
  userProfileStore = inject(UserProfileStore);
  get inviteCandidatesService() {
    return this.resolveRouteService(ACTIVITY_INVITE_CANDIDATES_ROUTE, this.localActivityInviteCandidatesService, this.httpActivityInviteCandidatesService);
  }
  async queryCandidates(query) {
    return this.inviteCandidatesService.queryCandidates(query);
  }
  async queryCandidatesByOwner(ownerId, sort, fallbackTitle = "Event", ownerType = "event", existingMemberUserIds = [], pendingInviteUserIds = [], parentOwner = null, page = 0, pageSize = 16) {
    const activeUserId = this.activeUserId();
    const normalizedOwnerId = ownerId.trim();
    if (!activeUserId || !normalizedOwnerId) {
      return { items: [], total: 0, page: 0, pageSize: Math.max(1, pageSize) };
    }
    const ownerRef = {
      ownerType,
      ownerId: normalizedOwnerId
    };
    const owner = this.resolveOwnerContext(activeUserId, ownerRef, fallbackTitle);
    const resolvedExistingMemberUserIds = existingMemberUserIds.length > 0 ? [...new Set(existingMemberUserIds.map((userId) => userId.trim()).filter(Boolean))] : [...new Set(this.activityMembersService.peekMembersByOwner(ownerRef).map((member) => member.userId.trim()).filter(Boolean))];
    return this.inviteCandidatesService.queryCandidates({
      activeUserId,
      owner,
      parentOwner,
      existingMemberUserIds: resolvedExistingMemberUserIds,
      pendingInviteUserIds: [...new Set(pendingInviteUserIds.map((userId) => userId.trim()).filter(Boolean))],
      sort,
      page,
      pageSize
    });
  }
  async applyInvites(ownerId, selectedCandidates, ownerType = "event") {
    const normalizedOwnerId = ownerId.trim();
    const activeUserId = this.activeUserId();
    if (!normalizedOwnerId || !activeUserId || selectedCandidates.length === 0) {
      return { members: [], invitedUserIds: [], rejections: [] };
    }
    const ownerRef = {
      ownerType,
      ownerId: normalizedOwnerId
    };
    const currentMembers = this.activityMembersService.peekMembersByOwner(ownerRef);
    const existingUserIds = new Set(currentMembers.map((member) => member.userId));
    const nowIso = AppUtils.toIsoDateTime(/* @__PURE__ */ new Date());
    const additions = selectedCandidates.filter((candidate) => !existingUserIds.has(candidate.userId)).map((candidate) => __spreadProps(__spreadValues({}, candidate), {
      status: "pending",
      pendingSource: "admin",
      requestKind: "invite",
      invitedByActiveUser: true,
      actionAtIso: nowIso
    }));
    if (additions.length === 0) {
      return { members: currentMembers, invitedUserIds: [], rejections: [] };
    }
    if (ownerType === "event" && !this.activityMembersService.usesLocalDataSource()) {
      return this.activityMembersService.inviteEventMembers(ownerRef, additions.map((candidate) => candidate.userId));
    }
    const summary = this.activityMembersService.peekSummaryByOwner(ownerRef);
    const ownerRecord = ownerType === "event" ? this.eventsService.peekKnownRecordById(activeUserId, normalizedOwnerId) ?? await this.eventsService.queryKnownRecordById(activeUserId, normalizedOwnerId) : null;
    const capacityTotal = summary?.capacityTotal ?? ownerRecord?.capacityTotal ?? 0;
    const capacityPartition = ownerType === "event" ? partitionEventInvitesByCapacity(currentMembers, additions, capacityTotal) : { acceptedAdditions: additions, rejections: [] };
    const { acceptedAdditions, rejections } = capacityPartition;
    if (acceptedAdditions.length === 0) {
      return {
        members: currentMembers,
        invitedUserIds: [],
        rejections
      };
    }
    const nextMembers = [...currentMembers, ...acceptedAdditions];
    await this.activityMembersService.replaceMembersByOwner(ownerRef, nextMembers, capacityTotal > 0 ? capacityTotal : Math.max(nextMembers.filter((member) => member.status === "accepted").length, 0));
    return {
      members: this.activityMembersService.peekMembersByOwner(ownerRef),
      invitedUserIds: acceptedAdditions.map((candidate) => candidate.userId),
      rejections
    };
  }
  resolveOwnerContext(activeUserId, owner, fallbackTitle) {
    if (owner.ownerType !== "event") {
      return {
        ownerId: owner.ownerId,
        ownerType: owner.ownerType,
        title: fallbackTitle,
        subtitle: this.ownerTypeLabel(owner.ownerType),
        detail: "Members",
        dateIso: (/* @__PURE__ */ new Date()).toISOString(),
        distanceKm: 0,
        sourceType: "events",
        isAdmin: true
      };
    }
    const record = this.eventsService.peekKnownRecordById(activeUserId, owner.ownerId);
    if (!record) {
      return {
        ownerId: owner.ownerId,
        ownerType: owner.ownerType,
        title: fallbackTitle,
        subtitle: "Event",
        detail: "Members",
        dateIso: (/* @__PURE__ */ new Date()).toISOString(),
        distanceKm: 0,
        sourceType: "events",
        isAdmin: true
      };
    }
    return {
      ownerId: record.id,
      ownerType: "event",
      title: record.title,
      subtitle: record.subtitle,
      detail: record.timeframe,
      dateIso: record.startAtIso,
      distanceKm: record.distanceKm,
      sourceType: record.type === "hosting" ? "hosting" : "events",
      isAdmin: this.isEventAdminRecord(record)
    };
  }
  isEventAdminRecord(record) {
    const userId = `${record.userId ?? ""}`.trim();
    return !!userId && (record.creatorUserId === userId || (record.adminIds ?? []).some((adminId) => `${adminId ?? ""}`.trim() === userId));
  }
  ownerTypeLabel(ownerType) {
    if (ownerType === "asset") {
      return "Asset";
    }
    if (ownerType === "subEvent") {
      return "Sub Event";
    }
    if (ownerType === "group") {
      return "Group";
    }
    return "Event";
  }
  activeUserId() {
    const activeUserId = this.userProfileStore.getActiveUserId().trim();
    if (activeUserId) {
      return activeUserId;
    }
    const session = this.sessionService.currentSession();
    if (session?.kind === "demo") {
      return session.userId.trim();
    }
    return "";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ActivityInviteCandidatesService_BaseFactory;
    return function ActivityInviteCandidatesService_Factory(__ngFactoryType__) {
      return (\u0275ActivityInviteCandidatesService_BaseFactory || (\u0275ActivityInviteCandidatesService_BaseFactory = \u0275\u0275getInheritedFactory(_ActivityInviteCandidatesService)))(__ngFactoryType__ || _ActivityInviteCandidatesService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivityInviteCandidatesService, factory: _ActivityInviteCandidatesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityInviteCandidatesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/notifications.service.ts
var NotificationsService = class _NotificationsService extends BaseRouteModeService {
  static ROUTE = "/notifications";
  localNotificationsService = inject(LocalNotificationsService);
  httpNotificationsService = inject(HttpNotificationsService);
  routeDelay = inject(RouteDelayService);
  async queryPage(userId, query, signal2) {
    const page = await this.notificationService.queryPage(userId, query, signal2);
    return {
      items: page.items.map((item) => __spreadProps(__spreadValues({}, item), {
        payload: item.payload ? __spreadValues({}, item.payload) : null
      })),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null,
      context: {
        unreadCount: Math.max(0, Math.trunc(Number(page.context?.unreadCount) || 0)),
        muted: page.context?.muted === true
      }
    };
  }
  async markRead(userId, notificationId, signal2) {
    const result = await this.notificationService.markRead(userId, notificationId, signal2);
    return {
      notification: __spreadProps(__spreadValues({}, result.notification), {
        payload: result.notification.payload ? __spreadValues({}, result.notification.payload) : null
      }),
      unreadCount: Math.max(0, Math.trunc(Number(result.unreadCount) || 0))
    };
  }
  async sync(userId, request, signal2) {
    const result = await this.notificationService.sync(userId, request, signal2);
    return {
      upserts: result.upserts.map((item) => __spreadProps(__spreadValues({}, item), {
        payload: item.payload ? __spreadValues({}, item.payload) : null
      })),
      removedIds: result.removedIds.map((id) => `${id}`.trim()).filter(Boolean),
      total: Math.max(0, Math.trunc(Number(result.total) || 0)),
      unreadCount: Math.max(0, Math.trunc(Number(result.unreadCount) || 0)),
      muted: result.muted === true
    };
  }
  async setMuted(userId, muted, signal2) {
    return this.notificationService.updatePreferences(userId, { muted }, signal2);
  }
  pollIntervalMs() {
    return this.routeDelay.resolveIntervalMs(_NotificationsService.ROUTE, 3e4);
  }
  get notificationService() {
    return this.resolveRouteService(_NotificationsService.ROUTE, this.localNotificationsService, this.httpNotificationsService);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275NotificationsService_BaseFactory;
    return function NotificationsService_Factory(__ngFactoryType__) {
      return (\u0275NotificationsService_BaseFactory || (\u0275NotificationsService_BaseFactory = \u0275\u0275getInheritedFactory(_NotificationsService)))(__ngFactoryType__ || _NotificationsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationsService, factory: _NotificationsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/operator-registry.service.ts
var OPERATOR_REGISTRY_ROUTE = "/operator/registry";
var OperatorRegistryService = class _OperatorRegistryService extends BaseRouteModeService {
  httpService = inject(HttpOperatorRegistryService);
  localService = inject(LocalOperatorRegistryService);
  loadStatus() {
    return this.registryService.loadStatus();
  }
  inspect(request) {
    return this.registryService.inspect(request);
  }
  confirm(inspectionToken) {
    return this.registryService.confirm(inspectionToken);
  }
  register(request) {
    return this.registryService.register(request);
  }
  async replaceRegistration(request) {
    const service = this.registryService;
    const disconnected = await service.disconnect();
    try {
      return {
        disconnected,
        registered: await service.register(request),
        registrationError: null
      };
    } catch (registrationError) {
      return {
        disconnected,
        registered: null,
        registrationError
      };
    }
  }
  retry() {
    return this.registryService.retry();
  }
  disconnect() {
    return this.registryService.disconnect();
  }
  synchronizeMeasurements() {
    return this.registryService.synchronizeMeasurements();
  }
  measurementReportPage(query, signal2) {
    return this.registryService.measurementReportPage(query, signal2);
  }
  requeueMeasurementReport(reportId) {
    return this.registryService.requeueMeasurementReport(reportId);
  }
  leaderboardPage(query, signal2) {
    return this.registryService.leaderboardPage(query, signal2);
  }
  leaderboardDeploymentPage(groupId, query, signal2) {
    return this.registryService.leaderboardDeploymentPage(groupId, query, signal2);
  }
  loadClaimStatus() {
    return this.registryService.loadClaimStatus();
  }
  claimShare(request) {
    return this.registryService.claimShare(request);
  }
  issueGroupingToken() {
    return this.registryService.issueGroupingToken();
  }
  linkOperatorGroup(clientToken) {
    return this.registryService.linkOperatorGroup({ clientToken });
  }
  loadDeploymentUpdate() {
    return this.registryService.loadDeploymentUpdate();
  }
  applyDeploymentUpdate(onProgress) {
    return this.registryService.applyDeploymentUpdate(onProgress);
  }
  loadConfiguration() {
    return this.registryService.loadConfiguration();
  }
  saveConfiguration(request) {
    return this.registryService.saveConfiguration(request);
  }
  testConfiguration(request) {
    return this.registryService.testConfiguration(request);
  }
  activateFirebase() {
    return this.registryService.activateFirebase();
  }
  loadTlsConfiguration() {
    return this.registryService.loadTlsConfiguration();
  }
  saveTlsConfiguration(request) {
    return this.registryService.saveTlsConfiguration(request);
  }
  testTlsConfiguration(request) {
    return this.registryService.testTlsConfiguration(request);
  }
  loadRevenue() {
    return this.registryService.loadRevenue();
  }
  synchronizeRevenue() {
    return this.registryService.synchronizeRevenue();
  }
  revenueReportPage(query, signal2) {
    return this.registryService.revenueReportPage(query, signal2);
  }
  requeueRevenueReport(reportId) {
    return this.registryService.requeueRevenueReport(reportId);
  }
  settlementPage(query, signal2) {
    return this.registryService.settlementPage(query, signal2);
  }
  loadCommunityStatus() {
    return this.registryService.loadCommunityStatus();
  }
  setCommunityAvailability(availability) {
    return this.registryService.setCommunityAvailability(availability);
  }
  get registryService() {
    const mode = resolveOperatorRegistryRouteMode(environment.operatorRegistryDataSource);
    if (mode === "local") {
      return this.resolveRouteService(OPERATOR_REGISTRY_ROUTE, this.localService, this.httpService, { mode: "local" });
    }
    return this.resolveRouteService(OPERATOR_REGISTRY_ROUTE, this.localService, this.httpService, { mode: "http" });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275OperatorRegistryService_BaseFactory;
    return function OperatorRegistryService_Factory(__ngFactoryType__) {
      return (\u0275OperatorRegistryService_BaseFactory || (\u0275OperatorRegistryService_BaseFactory = \u0275\u0275getInheritedFactory(_OperatorRegistryService)))(__ngFactoryType__ || _OperatorRegistryService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OperatorRegistryService, factory: _OperatorRegistryService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorRegistryService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function resolveOperatorRegistryRouteMode(dataSource) {
  if (dataSource === "local" || dataSource === "http") {
    return dataSource;
  }
  return "http";
}

// src/app/shared/core/base/services/route-interval-scheduler.service.ts
var RouteIntervalSchedulerService = class _RouteIntervalSchedulerService {
  routeDelay = inject(RouteDelayService);
  startInterval(route, task, options = {}) {
    const intervalMs = this.routeDelay.resolveIntervalMs(route, options.fallbackIntervalMs);
    if (intervalMs <= 0) {
      return () => void 0;
    }
    let active = true;
    const run = () => {
      if (!active) {
        return;
      }
      void task();
    };
    const timer = setInterval(run, intervalMs);
    const stop = () => {
      if (!active) {
        return;
      }
      active = false;
      clearInterval(timer);
      options.signal?.removeEventListener("abort", stop);
    };
    if (options.signal?.aborted) {
      stop();
      return stop;
    }
    options.signal?.addEventListener("abort", stop, { once: true });
    return stop;
  }
  static \u0275fac = function RouteIntervalSchedulerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouteIntervalSchedulerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RouteIntervalSchedulerService, factory: _RouteIntervalSchedulerService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouteIntervalSchedulerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/experience-document-import.service.ts
var ExperienceDocumentImportService = class _ExperienceDocumentImportService {
  static SUPPORTED_EXTENSIONS = /* @__PURE__ */ new Set(["pdf", "doc", "docx", "odt", "rtf", "txt"]);
  static MONTH_INDEX_BY_TOKEN = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    sept: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12
  };
  async parseFile(file, onProgress) {
    const extension = this.resolveExtension(file.name);
    if (!_ExperienceDocumentImportService.SUPPORTED_EXTENSIONS.has(extension)) {
      throw new Error("Upload supports PDF, DOC, DOCX, ODT, RTF, and TXT files.");
    }
    const warnings = [];
    onProgress?.({
      stage: "reading",
      percent: 8,
      label: "Reading document"
    });
    const buffer = await file.arrayBuffer();
    let text = "";
    onProgress?.({
      stage: "extracting",
      percent: 34,
      label: "Extracting document text"
    });
    switch (extension) {
      case "docx":
        text = await this.extractDocxText(buffer);
        break;
      case "odt":
        text = await this.extractOdtText(buffer);
        break;
      case "pdf":
        text = await this.extractPdfText(buffer);
        if (!text.trim()) {
          warnings.push("PDF extraction was low-confidence. Review the imported cards before saving further edits.");
        }
        break;
      case "rtf":
        text = this.extractRtfText(buffer);
        break;
      case "doc":
        text = this.extractLegacyDocText(buffer);
        warnings.push("Legacy DOC parsing is best-effort. Review the imported cards carefully.");
        break;
      default:
        text = this.decodeTextBuffer(buffer);
        break;
    }
    onProgress?.({
      stage: "analyzing",
      percent: 72,
      label: "Categorizing experience items"
    });
    const extracted = this.extractExperienceEntries(text, warnings);
    onProgress?.({
      stage: "ready",
      percent: 100,
      label: extracted.entries.length > 0 ? "Import preview ready" : "No experience items recognized"
    });
    return {
      entries: extracted.entries,
      warnings: [...new Set(extracted.warnings)]
    };
  }
  resolveExtension(fileName) {
    const normalized = `${fileName ?? ""}`.trim().toLowerCase();
    const index = normalized.lastIndexOf(".");
    return index >= 0 ? normalized.slice(index + 1) : "";
  }
  async extractDocxText(buffer) {
    const xml = await this.extractZipEntryText(buffer, "word/document.xml");
    return this.extractOfficeXmlText(xml, ["</w:p>", "</w:tr>", "<w:tab/>", "<w:br/>", "<w:cr/>"]);
  }
  async extractOdtText(buffer) {
    const xml = await this.extractZipEntryText(buffer, "content.xml");
    return this.extractOfficeXmlText(xml, ["</text:p>", "</text:h>", "<text:line-break/>", "<text:tab/>"]);
  }
  async extractZipEntryText(buffer, entryName) {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    const eocdOffset = this.findZipEndOfCentralDirectory(bytes);
    if (eocdOffset < 0) {
      throw new Error(`Unable to read ${entryName} from the uploaded archive.`);
    }
    const totalEntries = view.getUint16(eocdOffset + 10, true);
    const centralDirectoryOffset = view.getUint32(eocdOffset + 16, true);
    let offset = centralDirectoryOffset;
    for (let index = 0; index < totalEntries; index += 1) {
      if (view.getUint32(offset, true) !== 33639248) {
        break;
      }
      const compressionMethod = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const fileNameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localHeaderOffset = view.getUint32(offset + 42, true);
      const fileNameBytes = bytes.slice(offset + 46, offset + 46 + fileNameLength);
      const fileName = this.decodeUtf8(fileNameBytes);
      if (fileName === entryName) {
        return this.readZipEntryText(bytes, view, localHeaderOffset, compressedSize, compressionMethod);
      }
      offset += 46 + fileNameLength + extraLength + commentLength;
    }
    throw new Error(`The uploaded file does not contain ${entryName}.`);
  }
  async readZipEntryText(bytes, view, localHeaderOffset, compressedSize, compressionMethod) {
    if (view.getUint32(localHeaderOffset, true) !== 67324752) {
      throw new Error("Unable to read the uploaded archive entry.");
    }
    const fileNameLength = view.getUint16(localHeaderOffset + 26, true);
    const extraLength = view.getUint16(localHeaderOffset + 28, true);
    const dataOffset = localHeaderOffset + 30 + fileNameLength + extraLength;
    const compressedBytes = bytes.slice(dataOffset, dataOffset + compressedSize);
    if (compressionMethod === 0) {
      return this.decodeTextBuffer(compressedBytes.buffer.slice(compressedBytes.byteOffset, compressedBytes.byteOffset + compressedBytes.byteLength));
    }
    if (compressionMethod === 8) {
      const inflated = await this.inflateBuffer(compressedBytes, "deflate-raw");
      return this.decodeTextBuffer(inflated);
    }
    throw new Error("Unsupported compressed experience document entry.");
  }
  findZipEndOfCentralDirectory(bytes) {
    for (let index = Math.max(0, bytes.length - 22); index >= Math.max(0, bytes.length - 65557); index -= 1) {
      if (bytes[index] === 80 && bytes[index + 1] === 75 && bytes[index + 2] === 5 && bytes[index + 3] === 6) {
        return index;
      }
    }
    return -1;
  }
  extractOfficeXmlText(xml, paragraphTokens) {
    let normalized = xml;
    for (const token of paragraphTokens) {
      normalized = normalized.split(token).join(`${token}
`);
    }
    return this.decodeXmlEntities(normalized.replace(/<[^>]+>/g, " ").replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n"));
  }
  async extractPdfText(buffer) {
    const bytes = new Uint8Array(buffer);
    const raw = this.decodeBinaryBuffer(buffer);
    const streams = await this.extractPdfObjectStreams(raw, bytes);
    const fontMaps = this.extractPdfFontMaps(raw, streams);
    const textParts = streams.flatMap((stream) => this.extractPdfTextFragments(stream.content, fontMaps));
    return [...new Set(textParts)].map((item) => item.trim()).filter((item) => item.length > 0).join("\n");
  }
  async inflatePdfStream(streamBytes) {
    const trimmedStreamBytes = this.trimPdfStreamPadding(streamBytes);
    for (const candidate of [streamBytes, trimmedStreamBytes]) {
      try {
        return await this.inflateBuffer(candidate, "deflate");
      } catch {
        try {
          return await this.inflateBuffer(candidate, "deflate-raw");
        } catch {
          continue;
        }
      }
    }
    return null;
  }
  async extractPdfObjectStreams(raw, bytes) {
    const objects = this.extractPdfObjects(raw);
    if (objects.length > 0) {
      const streams2 = [];
      for (const object of objects) {
        if (!object.dictionary || !object.source.includes("stream")) {
          continue;
        }
        const streamStart = this.resolvePdfStreamStart(object);
        if (streamStart < 0) {
          continue;
        }
        const declaredLength = this.resolvePdfStreamLength(object.dictionary, raw);
        const localEndStreamIndex = object.source.indexOf("endstream", streamStart - object.offset);
        const fallbackEnd = localEndStreamIndex >= 0 ? object.offset + localEndStreamIndex : -1;
        const end = declaredLength > 0 && streamStart + declaredLength <= object.nextOffset ? streamStart + declaredLength : fallbackEnd;
        if (end < 0 || end > bytes.length) {
          continue;
        }
        const streamBytes = bytes.slice(streamStart, end);
        let content = "";
        if (object.dictionary.includes("/FlateDecode")) {
          const inflated = await this.inflatePdfStream(streamBytes);
          if (!inflated) {
            continue;
          }
          content = this.decodeBinaryBuffer(inflated);
        } else {
          content = this.decodeBinaryBuffer(streamBytes.buffer.slice(streamBytes.byteOffset, streamBytes.byteOffset + streamBytes.byteLength));
        }
        streams2.push({
          objectId: object.objectId,
          dictionary: object.dictionary,
          content
        });
      }
      return streams2;
    }
    const streams = [];
    const streamPattern = /(?:^|[\r\n])(\d+)\s+0\s+obj\b\s*<<([\s\S]*?)>>\s*stream\r?\n/g;
    let match;
    while ((match = streamPattern.exec(raw)) !== null) {
      const objectId = Number.parseInt(match[1], 10);
      const dictionary = match[2];
      const start = streamPattern.lastIndex;
      const declaredLength = this.resolvePdfStreamLength(dictionary, raw);
      const fallbackEnd = raw.indexOf("endstream", start);
      const end = declaredLength > 0 && start + declaredLength <= bytes.length ? start + declaredLength : fallbackEnd;
      if (end < 0 || end > bytes.length) {
        streamPattern.lastIndex = fallbackEnd >= 0 ? fallbackEnd + "endstream".length : start + 1;
        continue;
      }
      const streamBytes = bytes.slice(start, end);
      const endStreamIndex = raw.indexOf("endstream", end);
      let content = "";
      if (dictionary.includes("/FlateDecode")) {
        const inflated = await this.inflatePdfStream(streamBytes);
        if (!inflated) {
          streamPattern.lastIndex = endStreamIndex >= 0 ? endStreamIndex + "endstream".length : end;
          continue;
        }
        content = this.decodeBinaryBuffer(inflated);
      } else {
        content = this.decodeBinaryBuffer(streamBytes.buffer.slice(streamBytes.byteOffset, streamBytes.byteOffset + streamBytes.byteLength));
      }
      streams.push({
        objectId,
        dictionary,
        content
      });
      streamPattern.lastIndex = endStreamIndex >= 0 ? endStreamIndex + "endstream".length : end;
    }
    return streams;
  }
  extractPdfTextFragments(stream, fontMaps) {
    const fragments = [];
    const textSections = stream.match(/BT[\s\S]*?ET/g) ?? [];
    const operatorPattern = /\/(F\d+)\s+[\d.]+\s+Tf|(\[(?:.|\n)*?\]|<[\dA-Fa-f\s]+>|\((?:\\.|[^\\()])*\))\s*(TJ|Tj|['"])/g;
    for (const section of textSections) {
      let currentFont = "";
      let match;
      while ((match = operatorPattern.exec(section)) !== null) {
        if (match[1]) {
          currentFont = match[1];
          continue;
        }
        const operand = match[2];
        if (!operand) {
          continue;
        }
        const decoded = this.decodePdfTextOperand(operand, currentFont, fontMaps);
        if (decoded.trim()) {
          fragments.push(decoded);
        }
      }
      operatorPattern.lastIndex = 0;
    }
    return fragments;
  }
  extractPdfFontMaps(raw, streams) {
    const streamByObjectId = new Map(streams.map((stream) => [stream.objectId, stream.content]));
    const dictionaryByObjectId = this.extractPdfObjectDictionaries(raw);
    const fontObjectByName = /* @__PURE__ */ new Map();
    for (const match of raw.matchAll(/\/(F\d+)\s+(\d+)\s+0\s+R/g)) {
      const fontName = match[1];
      if (!fontObjectByName.has(fontName)) {
        fontObjectByName.set(fontName, Number.parseInt(match[2], 10));
      }
    }
    const fontMaps = /* @__PURE__ */ new Map();
    for (const [fontName, fontObjectId] of fontObjectByName.entries()) {
      const dictionary = dictionaryByObjectId.get(fontObjectId) ?? "";
      const toUnicodeMatch = dictionary.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
      if (!toUnicodeMatch) {
        continue;
      }
      const cmap = streamByObjectId.get(Number.parseInt(toUnicodeMatch[1], 10));
      if (!cmap) {
        continue;
      }
      const parsedMap = this.parsePdfToUnicodeMap(cmap);
      if (parsedMap.codeLengths.length > 0) {
        fontMaps.set(fontName, parsedMap);
      }
    }
    return fontMaps;
  }
  extractPdfObjectDictionaries(raw) {
    const objects = this.extractPdfObjects(raw);
    if (objects.length > 0) {
      return new Map(objects.map((object) => [object.objectId, object.dictionary]));
    }
    const dictionaries = /* @__PURE__ */ new Map();
    for (const match of raw.matchAll(/(?:^|[\r\n])(\d+)\s+0\s+obj\b\s*<<([\s\S]*?)>>/g)) {
      const objectId = Number.parseInt(match[1], 10);
      if (!dictionaries.has(objectId)) {
        dictionaries.set(objectId, match[2]);
      }
    }
    return dictionaries;
  }
  extractPdfObjects(raw) {
    const offsets = this.extractPdfObjectOffsets(raw);
    if (offsets.size === 0) {
      return [];
    }
    const orderedOffsets = [...offsets.entries()].sort((left, right) => left[1] - right[1]);
    const objects = [];
    for (let index = 0; index < orderedOffsets.length; index += 1) {
      const [objectId, offset] = orderedOffsets[index];
      const nextOffset = orderedOffsets[index + 1]?.[1] ?? raw.length;
      if (offset < 0 || nextOffset <= offset || nextOffset > raw.length) {
        continue;
      }
      const source = raw.slice(offset, nextOffset);
      if (!/^\d+\s+\d+\s+obj\b/.test(source)) {
        continue;
      }
      const dictionaryMatch = source.match(/^\d+\s+\d+\s+obj\b\s*<<([\s\S]*?)>>/);
      objects.push({
        objectId,
        offset,
        nextOffset,
        source,
        dictionary: dictionaryMatch?.[1] ?? ""
      });
    }
    return objects;
  }
  extractPdfObjectOffsets(raw) {
    const startXrefMatches = [...raw.matchAll(/startxref\s+(\d+)\s+%%EOF/g)];
    const lastStartXrefMatch = startXrefMatches[startXrefMatches.length - 1];
    if (!lastStartXrefMatch) {
      return /* @__PURE__ */ new Map();
    }
    let cursor = Number.parseInt(lastStartXrefMatch[1], 10);
    if (Number.isNaN(cursor) || raw.slice(cursor, cursor + 4) !== "xref") {
      return /* @__PURE__ */ new Map();
    }
    cursor += 4;
    const offsets = /* @__PURE__ */ new Map();
    while (cursor < raw.length) {
      const lineResult = this.readPdfLine(raw, cursor);
      if (!lineResult) {
        break;
      }
      cursor = lineResult.nextIndex;
      const line = lineResult.line.trim();
      if (!line) {
        continue;
      }
      if (line === "trailer") {
        break;
      }
      const subsectionMatch = line.match(/^(\d+)\s+(\d+)$/);
      if (!subsectionMatch) {
        return /* @__PURE__ */ new Map();
      }
      const objectStart = Number.parseInt(subsectionMatch[1], 10);
      const objectCount = Number.parseInt(subsectionMatch[2], 10);
      if (Number.isNaN(objectStart) || Number.isNaN(objectCount)) {
        return /* @__PURE__ */ new Map();
      }
      for (let index = 0; index < objectCount; index += 1) {
        const entryLineResult = this.readPdfLine(raw, cursor);
        if (!entryLineResult) {
          return /* @__PURE__ */ new Map();
        }
        cursor = entryLineResult.nextIndex;
        const entryMatch = entryLineResult.line.match(/^(\d{10})\s+(\d{5})\s+([nf])\s*$/);
        if (!entryMatch) {
          return /* @__PURE__ */ new Map();
        }
        if (entryMatch[3] !== "n") {
          continue;
        }
        offsets.set(objectStart + index, Number.parseInt(entryMatch[1], 10));
      }
    }
    return offsets;
  }
  readPdfLine(raw, startIndex) {
    if (startIndex >= raw.length) {
      return null;
    }
    let endIndex = startIndex;
    while (endIndex < raw.length && raw[endIndex] !== "\n" && raw[endIndex] !== "\r") {
      endIndex += 1;
    }
    let nextIndex = endIndex;
    if (raw[nextIndex] === "\r" && raw[nextIndex + 1] === "\n") {
      nextIndex += 2;
    } else if (nextIndex < raw.length) {
      nextIndex += 1;
    }
    return {
      line: raw.slice(startIndex, endIndex),
      nextIndex
    };
  }
  resolvePdfStreamStart(object) {
    const streamKeywordIndex = object.source.indexOf("stream");
    if (streamKeywordIndex < 0) {
      return -1;
    }
    let startIndex = streamKeywordIndex + "stream".length;
    if (object.source[startIndex] === "\r" && object.source[startIndex + 1] === "\n") {
      startIndex += 2;
    } else if (object.source[startIndex] === "\n" || object.source[startIndex] === "\r") {
      startIndex += 1;
    }
    return object.offset + startIndex;
  }
  parsePdfToUnicodeMap(cmap) {
    const glyphByCode = /* @__PURE__ */ new Map();
    for (const block of cmap.matchAll(/\d+\s+beginbfchar([\s\S]*?)endbfchar/g)) {
      for (const pair of block[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
        glyphByCode.set(pair[1].toUpperCase(), this.decodePdfUnicodeHex(pair[2]));
      }
    }
    for (const block of cmap.matchAll(/\d+\s+beginbfrange([\s\S]*?)endbfrange/g)) {
      for (const range of block[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(<([0-9A-Fa-f]+)>|\[((?:\s*<[\dA-Fa-f]+>\s*)+)\])/g)) {
        const startCode = Number.parseInt(range[1], 16);
        const endCode = Number.parseInt(range[2], 16);
        const codeLength = range[1].length;
        if (Number.isNaN(startCode) || Number.isNaN(endCode) || endCode < startCode) {
          continue;
        }
        if (range[4]) {
          const unicodeStart = Number.parseInt(range[4], 16);
          if (Number.isNaN(unicodeStart)) {
            continue;
          }
          for (let offset = 0; offset <= endCode - startCode; offset += 1) {
            glyphByCode.set((startCode + offset).toString(16).toUpperCase().padStart(codeLength, "0"), this.decodePdfUnicodeHex((unicodeStart + offset).toString(16).toUpperCase().padStart(range[4].length, "0")));
          }
          continue;
        }
        const destinations = [...(range[5] ?? "").matchAll(/<([\dA-Fa-f]+)>/g)].map((match) => match[1]);
        for (let offset = 0; offset < destinations.length && startCode + offset <= endCode; offset += 1) {
          glyphByCode.set((startCode + offset).toString(16).toUpperCase().padStart(codeLength, "0"), this.decodePdfUnicodeHex(destinations[offset]));
        }
      }
    }
    return {
      glyphByCode,
      codeLengths: [...new Set([...glyphByCode.keys()].map((code) => code.length))].sort((left, right) => right - left)
    };
  }
  decodePdfTextOperand(operand, fontName, fontMaps) {
    if (operand.startsWith("[")) {
      return this.decodePdfTextArray(operand, fontName, fontMaps);
    }
    return this.decodePdfTextToken(operand, fontName, fontMaps).trim();
  }
  decodePdfTextArray(operand, fontName, fontMaps) {
    const tokens = operand.match(/\((?:\\.|[^\\()])*\)|<[\dA-Fa-f\s]+>|-?\d+(?:\.\d+)?/g) ?? [];
    let decoded = "";
    for (const token of tokens) {
      if (token.startsWith("(") || token.startsWith("<")) {
        decoded += this.decodePdfTextToken(token, fontName, fontMaps);
      }
    }
    return decoded.replace(/\s{2,}/g, " ").trim();
  }
  decodePdfTextToken(token, fontName, fontMaps) {
    if (token.startsWith("(") && token.endsWith(")")) {
      return this.decodePdfLiteral(token.slice(1, -1));
    }
    if (token.startsWith("<") && token.endsWith(">")) {
      return this.decodePdfHexString(token.slice(1, -1), fontName, fontMaps);
    }
    return "";
  }
  decodePdfHexString(value, fontName, fontMaps) {
    const normalized = value.replace(/\s+/g, "").toUpperCase();
    if (!normalized) {
      return "";
    }
    const fontMap = fontMaps.get(fontName);
    if (!fontMap || fontMap.codeLengths.length === 0) {
      return this.decodePdfUnicodeHex(normalized);
    }
    let cursor = 0;
    let decoded = "";
    const fallbackLength = fontMap.codeLengths[fontMap.codeLengths.length - 1] ?? 2;
    while (cursor < normalized.length) {
      let matched = false;
      for (const codeLength of fontMap.codeLengths) {
        const code = normalized.slice(cursor, cursor + codeLength);
        if (code.length < codeLength) {
          continue;
        }
        const mapped = fontMap.glyphByCode.get(code);
        if (mapped === void 0) {
          continue;
        }
        decoded += mapped;
        cursor += codeLength;
        matched = true;
        break;
      }
      if (matched) {
        continue;
      }
      const nextCursor = Math.min(cursor + fallbackLength, normalized.length);
      decoded += this.decodePdfUnicodeHex(normalized.slice(cursor, nextCursor));
      cursor = nextCursor;
    }
    return decoded;
  }
  decodePdfUnicodeHex(value) {
    const normalized = value.replace(/\s+/g, "").toUpperCase();
    if (!normalized) {
      return "";
    }
    if (normalized.length % 4 === 0) {
      let decoded2 = "";
      for (let index = 0; index < normalized.length; index += 4) {
        const codePoint = Number.parseInt(normalized.slice(index, index + 4), 16);
        if (Number.isNaN(codePoint)) {
          return "";
        }
        decoded2 += codePoint === 61623 ? "\u2022" : String.fromCodePoint(codePoint);
      }
      if (decoded2.trim()) {
        return decoded2;
      }
    }
    let decoded = "";
    for (let index = 0; index + 1 < normalized.length; index += 2) {
      const code = Number.parseInt(normalized.slice(index, index + 2), 16);
      if (!Number.isNaN(code)) {
        decoded += String.fromCharCode(code);
      }
    }
    return decoded;
  }
  decodePdfLiteral(value) {
    let normalized = value.replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\n").replace(/\\t/g, "	");
    normalized = normalized.replace(/\\([0-7]{3})/g, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
    return normalized;
  }
  extractRtfText(buffer) {
    return this.decodeTextBuffer(buffer).replace(/\\par[d]?/g, "\n").replace(/\\tab/g, "	").replace(/\\'[0-9a-fA-F]{2}/g, "").replace(/\\[a-z]+-?\d* ?/g, "").replace(/[{}]/g, "").replace(/\n{3,}/g, "\n\n");
  }
  extractLegacyDocText(buffer) {
    return this.decodeTextBuffer(buffer, "windows-1252").replace(/\u0000/g, "").replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u017F]/g, " ").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n");
  }
  decodeTextBuffer(buffer, encoding = "utf-8") {
    try {
      return new TextDecoder(encoding).decode(buffer);
    } catch {
      return new TextDecoder("utf-8").decode(buffer);
    }
  }
  decodeBinaryBuffer(buffer) {
    return new TextDecoder("latin1").decode(buffer);
  }
  trimPdfStreamPadding(streamBytes) {
    let end = streamBytes.length;
    while (end > 0) {
      const byte = streamBytes[end - 1];
      if (byte !== 10 && byte !== 13) {
        break;
      }
      end -= 1;
    }
    return end === streamBytes.length ? streamBytes : streamBytes.slice(0, end);
  }
  resolvePdfStreamLength(dictionary, raw) {
    const directLengthMatch = dictionary.match(/\/Length\s+(\d+)\b(?!\s+0\s+R)/);
    if (directLengthMatch) {
      return Number.parseInt(directLengthMatch[1], 10);
    }
    const indirectLengthMatch = dictionary.match(/\/Length\s+(\d+)\s+0\s+R/);
    if (!indirectLengthMatch) {
      return -1;
    }
    const objectMatch = raw.match(new RegExp(`(?:^|[\\r\\n])${indirectLengthMatch[1]}\\s+0\\s+obj\\b\\s+(\\d+)\\s+endobj`, "m"));
    if (!objectMatch) {
      return -1;
    }
    return Number.parseInt(objectMatch[1], 10);
  }
  decodeUtf8(bytes) {
    return new TextDecoder("utf-8").decode(bytes);
  }
  async inflateBuffer(bytes, format) {
    if (typeof DecompressionStream === "undefined") {
      throw new Error("Compressed document import is unavailable in this browser.");
    }
    const payload = Uint8Array.from(bytes);
    const source = new ReadableStream({
      start(controller) {
        controller.enqueue(payload);
        controller.close();
      }
    });
    const decompressor = new DecompressionStream(format);
    const stream = source.pipeThrough(decompressor);
    return new Response(stream).arrayBuffer();
  }
  decodeXmlEntities(value) {
    return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  }
  extractExperienceEntries(text, seedWarnings) {
    const warnings = [...seedWarnings];
    const normalizedText = this.normalizeExtractedText(text);
    if (!normalizedText) {
      return {
        entries: [],
        warnings: ["The selected file did not contain readable resume text."]
      };
    }
    const paragraphs = normalizedText.split(/\n{2,}/).map((block) => block.trim()).filter((block) => block.length > 0);
    const entries = [];
    const seenSignatures = /* @__PURE__ */ new Set();
    let currentSection = "Workspace";
    let usedFallbackDate = false;
    for (const paragraph of paragraphs) {
      const lines = paragraph.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
      if (lines.length === 0) {
        continue;
      }
      if (this.isSkippableParagraph(lines)) {
        continue;
      }
      let currentLines = lines;
      const leadingHeaderType = this.resolveSectionHeaderType(lines[0] ?? "");
      if (leadingHeaderType) {
        currentSection = leadingHeaderType;
        currentLines = lines.slice(1).filter((line) => line.length > 0);
        if (currentLines.length === 0 || currentSection === "Ignore") {
          continue;
        }
      }
      const headerType = this.resolveSectionHeaderType(currentLines.join(" "));
      if (headerType && this.isSectionHeaderParagraph(lines)) {
        currentSection = headerType;
        continue;
      }
      if (currentSection === "Ignore") {
        continue;
      }
      if (currentSection !== "Workspace" && this.isStandaloneDateRangeLine(currentLines[0] ?? "")) {
        currentSection = "Workspace";
        continue;
      }
      if (currentSection === "Workspace") {
        continue;
      }
      if (currentLines.length === 1) {
        continue;
      }
      const parsedBlock = this.parseSectionBlock(currentLines, currentSection);
      if (!parsedBlock) {
        continue;
      }
      const signature = this.entrySignature(parsedBlock);
      if (seenSignatures.has(signature)) {
        continue;
      }
      seenSignatures.add(signature);
      entries.push(parsedBlock);
    }
    if (usedFallbackDate) {
      warnings.push("Some imported cards did not have a clear date range, so a fallback date was assigned. Review the orange cards.");
    }
    const fallbackEntries = this.extractTimelineFallbackEntries(normalizedText, seenSignatures);
    entries.push(...fallbackEntries);
    if (entries.length === 0) {
      warnings.push("No structured experience items were recognized from the uploaded file.");
    }
    return {
      entries,
      warnings
    };
  }
  normalizeExtractedText(value) {
    return value.replace(/\r/g, "\n").replace(/\u0000+/g, " ").replace(/\u00A0/g, " ").replace(/[•▪◦●■]/g, "\n").replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  }
  isSkippableParagraph(lines) {
    const joined = lines.join(" ").toLowerCase();
    if (lines.length === 1 && joined.length <= 2) {
      return true;
    }
    return joined.includes("@") || joined.includes("linkedin") || joined.includes("github.com") || joined.includes("phone") || joined.includes("email") || joined.includes("references") || joined.includes("skills") || joined.includes("languages");
  }
  resolveSectionHeaderType(value) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    if (/^(work experience|professional experience|employment|career history|work history|experience)$/.test(normalized)) {
      return "Workspace";
    }
    if (/^(education|academic background|studies)$/.test(normalized)) {
      return "School";
    }
    if (/^(thesis|dissertation)$/.test(normalized)) {
      return "Additional Project";
    }
    if (/^(projects?|portfolio|open source|freelance projects?)$/.test(normalized)) {
      return "Additional Project";
    }
    if (/^(certifications?|courses?|training|bootcamps?|online courses?|certificates?|interests)$/.test(normalized)) {
      return "Online Session";
    }
    if (/^(summary|profile|skills|technology|technical skills|tech stack|languages|contact|personal data|personal details)$/.test(normalized)) {
      return "Ignore";
    }
    return null;
  }
  isSectionHeaderParagraph(lines) {
    return lines.length <= 2 && lines.join(" ").length <= 64 && !this.containsDateRange(lines.join(" "));
  }
  resolveEntryType(lines, sectionType) {
    const normalized = lines.join(" ").toLowerCase();
    if (sectionType === "School" || sectionType === "Online Session" || sectionType === "Additional Project") {
      return sectionType;
    }
    if (/(university|college|academy|school|bsc|msc|phd|degree|diploma)/.test(normalized)) {
      return "School";
    }
    if (/(course|certification|certificate|bootcamp|online|remote program|udemy|coursera|edx)/.test(normalized)) {
      return "Online Session";
    }
    if (/(portfolio|open source|independent project|side project|personal project|pet project)/.test(normalized)) {
      return "Additional Project";
    }
    return "Workspace";
  }
  extractTimelineFallbackEntries(normalizedText, seenSignatures) {
    const lines = normalizedText.split("\n").map((line) => this.cleanTimelineLine(line)).filter((line) => line.length > 0);
    const entries = [];
    let currentSection = "Workspace";
    for (let index = 0; index < lines.length; ) {
      const line = lines[index];
      const headerType = this.resolveSectionHeaderType(line);
      if (headerType && this.isSectionHeaderParagraph([line])) {
        currentSection = headerType;
        index += 1;
        continue;
      }
      if (currentSection !== "Workspace" && this.isStandaloneDateRangeLine(line)) {
        currentSection = "Workspace";
      }
      if (currentSection === "School" || currentSection === "Additional Project" || currentSection === "Online Session") {
        const collected = this.collectTimelineBlock(lines, index, currentSection);
        const parsed = this.parseSectionBlock(collected.blockLines, currentSection);
        if (parsed) {
          const signature = this.entrySignature(parsed);
          if (!seenSignatures.has(signature)) {
            seenSignatures.add(signature);
            entries.push(parsed);
          }
        }
        index = collected.nextIndex;
        continue;
      }
      if (this.containsDateRange(line)) {
        const collected = this.collectTimelineBlock(lines, index, "Workspace");
        const parsed = this.parseTimelineBlock(collected.blockLines, currentSection);
        if (parsed) {
          const signature = this.entrySignature(parsed);
          if (!seenSignatures.has(signature)) {
            seenSignatures.add(signature);
            entries.push(parsed);
          }
        }
        index = collected.nextIndex;
        continue;
      }
      index += 1;
    }
    return entries;
  }
  collectTimelineBlock(lines, startIndex, currentSection) {
    const blockLines = [];
    let index = startIndex;
    while (index < lines.length) {
      const line = lines[index];
      if (blockLines.length > 0 && ((currentSection === "Workspace" ? this.containsDateRange(line) : this.isStandaloneDateRangeLine(line)) || Boolean(this.resolveSectionHeaderType(line) && this.isSectionHeaderParagraph([line])))) {
        break;
      }
      if (this.isStandaloneNoiseLine(line)) {
        index += 1;
        continue;
      }
      blockLines.push(line);
      index += 1;
    }
    return {
      blockLines,
      nextIndex: index
    };
  }
  parseTimelineBlock(lines, currentSection) {
    if (lines.length < 2) {
      return null;
    }
    const dateRange = this.extractDateRange(lines[0]);
    if (!dateRange) {
      return null;
    }
    const remainder = lines.slice(1).filter((line) => line.length > 0);
    if (remainder.length === 0) {
      return null;
    }
    const org = remainder[0];
    let cursor = 1;
    let city = "";
    if (cursor < remainder.length && this.looksLikeLocationLine(remainder[cursor])) {
      city = remainder[cursor];
      cursor += 1;
      if (cursor < remainder.length && this.looksLikeLocationContinuationLine(remainder[cursor])) {
        city = `${city} ${remainder[cursor]}`.trim();
        cursor += 1;
      }
    }
    const titleLines = [];
    while (cursor < remainder.length && titleLines.length < 2 && this.looksLikeRoleLine(remainder[cursor])) {
      titleLines.push(remainder[cursor]);
      cursor += 1;
    }
    if (titleLines.length === 0 && cursor < remainder.length && !this.looksLikeTechnologyLine(remainder[cursor])) {
      titleLines.push(remainder[cursor]);
      cursor += 1;
    }
    const technologyLines = [];
    while (cursor < remainder.length && this.looksLikeTechnologyLine(remainder[cursor])) {
      technologyLines.push(remainder[cursor]);
      cursor += 1;
    }
    if (!city && cursor < remainder.length && this.looksLikeLocationLine(remainder[cursor])) {
      city = remainder[cursor];
      cursor += 1;
      if (cursor < remainder.length && this.looksLikeLocationContinuationLine(remainder[cursor])) {
        city = `${city} ${remainder[cursor]}`.trim();
        cursor += 1;
      }
    }
    const descriptionLines = remainder.slice(cursor).filter((line) => !this.looksLikeLocationLine(line));
    const description = [...technologyLines, ...descriptionLines].join(" ").slice(0, 280);
    const title = titleLines.join(" / ").trim() || org;
    const type = this.resolveEntryType([title, org, ...technologyLines, ...descriptionLines], currentSection === "School" || currentSection === "Online Session" || currentSection === "Additional Project" ? currentSection : "Workspace");
    return {
      type,
      title,
      org,
      city,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      description
    };
  }
  parseSectionBlock(lines, type) {
    const cleaned = lines.filter((line) => line.length > 0 && !this.isStandaloneNoiseLine(line));
    if (cleaned.length === 0) {
      return null;
    }
    let title = cleaned[0];
    let cursor = 1;
    if (/^(thesis|dissertation)$/i.test(title) && cleaned.length > 1) {
      title = cleaned[1];
      cursor = 2;
    }
    if (cursor < cleaned.length && this.shouldMergeWrappedHeading(title, cleaned[cursor])) {
      title = `${title} ${cleaned[cursor]}`.replace(/\s+/g, " ").trim();
      cursor += 1;
    }
    if (!title || this.resolveSectionHeaderType(title) === "Ignore") {
      return null;
    }
    const combined = cleaned.join(" ");
    const dateRange = this.extractDateRange(combined);
    const resolvedDate = dateRange ? {
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo
    } : (() => {
      const standaloneDate = this.extractStandaloneDateToken(combined);
      return standaloneDate ? {
        dateFrom: standaloneDate,
        dateTo: standaloneDate
      } : null;
    })();
    const orgLines = cleaned.slice(cursor).filter((line) => !this.looksLikeTechnologyLine(line) && !this.looksLikeLocationLine(line));
    const city = cleaned.slice(cursor).find((line) => this.looksLikeLocationLine(line)) ?? "";
    const description = cleaned.slice(cursor).join(" ").slice(0, 280);
    return {
      type,
      title,
      org: orgLines.slice(0, 2).join(" / ") || this.fallbackOrganization(type),
      city,
      dateFrom: resolvedDate?.dateFrom ?? this.currentYearMonth(),
      dateTo: resolvedDate?.dateTo ?? "Present",
      description
    };
  }
  cleanTimelineLine(line) {
    return line.replace(/^[•▪◦●■]+/g, "").replace(/\s+/g, " ").trim();
  }
  isStandaloneNoiseLine(line) {
    return !line || /^[(]?[•▪◦●■\s]+[)]?$/.test(line) || /^(page \d+|\f)$/i.test(line);
  }
  looksLikeTechnologyLine(line) {
    const normalized = line.toLowerCase();
    return /(java|kotlin|spring|hibernate|javascript|typescript|angular|react|vue|docker|kubernetes|openshift|maven|gradle|rabbitmq|kafka|mongo|mysql|oracle|redis|firebase|google cloud|aws|php|smarty|pl\/sql|sql|jsp|jsf|jboss|tomcat|weblogic|soap|soa|selenium|netty|jquery|gitlab|jenkins|micro-?services|mqtt|protobuf|webrtc|ionic|capacitor|blender|linux|devops)/.test(normalized) || (line.match(/,/g) ?? []).length >= 2 && normalized.length <= 160;
  }
  looksLikeRoleLine(line) {
    const normalized = line.toLowerCase();
    return /(developer|engineer|architect|manager|founder|consultant|programmer|lead|director|owner|specialist|analyst|designer|freelancer)/.test(normalized);
  }
  looksLikeLocationLine(line) {
    const normalized = line.toLowerCase();
    if (!line || line.length > 48 || /[0-9@]/.test(line) || line.includes(".")) {
      return false;
    }
    if (/(university|college|school|academy|faculty|institute|department|campus)/.test(normalized)) {
      return false;
    }
    if (this.looksLikeTechnologyLine(line) || this.looksLikeRoleLine(line)) {
      return false;
    }
    return /^[A-Za-zÀ-ž()\/,&\s-]+$/.test(line) && (normalized.includes(" from ") || normalized.includes("/") || line.split(/\s+/).length <= 4);
  }
  looksLikeLocationContinuationLine(line) {
    return /^\([^)]{1,48}\)$/.test(line.trim());
  }
  shouldMergeWrappedHeading(current, next) {
    if (!next) {
      return false;
    }
    const normalizedCurrent = current.trim().toLowerCase();
    const continuesCurrent = /(in|of|for|and|to|with|on)$/.test(normalizedCurrent);
    if (this.resolveSectionHeaderType(next) !== null || this.looksLikeTechnologyLine(next) || this.looksLikeLocationLine(next) || this.looksLikeRoleLine(next) || this.containsDateRange(next) && !continuesCurrent) {
      return false;
    }
    return continuesCurrent || current.trim().length <= 36 && /^[A-ZÀ-Ž(]/.test(next.trim());
  }
  fallbackOrganization(type) {
    if (type === "School") {
      return "Academic Program";
    }
    if (type === "Online Session") {
      return "Online Program";
    }
    if (type === "Additional Project") {
      return "Independent Project";
    }
    return "Professional Experience";
  }
  extractDateRange(value) {
    const patterns = [
      /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+\d{4}|\d{4}[/-]\d{1,2}|\d{4})\s*(?:-|–|to)\s*(present|current|now|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+\d{4}|\d{4}[/-]\d{1,2}|\d{4})/i,
      /((?:\d{1,2}[/-]\d{4}))\s*(?:-|–|to)\s*(present|current|now|(?:\d{1,2}[/-]\d{4}))/i
    ];
    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (!match) {
        continue;
      }
      const dateFrom = this.normalizeDateToken(match[1]);
      const dateTo = this.normalizeDateToken(match[2]);
      if (!dateFrom) {
        continue;
      }
      return {
        dateFrom,
        dateTo: dateTo || "Present",
        matchedText: match[0]
      };
    }
    return null;
  }
  containsDateRange(value) {
    return this.extractDateRange(value) !== null;
  }
  isStandaloneDateRangeLine(value) {
    const dateRange = this.extractDateRange(value);
    if (!dateRange) {
      return false;
    }
    return value.replace(dateRange.matchedText, " ").trim().length === 0;
  }
  extractStandaloneDateToken(value) {
    const match = value.match(/\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+\d{4}|\d{4}[/-]\d{1,2}|\d{4})\b/i);
    return match ? this.normalizeDateToken(match[1]) : "";
  }
  normalizeDateToken(value) {
    const normalized = value.trim().toLowerCase();
    if (!normalized || normalized === "present" || normalized === "current" || normalized === "now") {
      return "Present";
    }
    const slashMatch = normalized.match(/^(\d{1,2})[/-](\d{4})$/);
    if (slashMatch) {
      const month = Number.parseInt(slashMatch[1], 10);
      const year = Number.parseInt(slashMatch[2], 10);
      return month >= 1 && month <= 12 ? `${year}-${`${month}`.padStart(2, "0")}` : `${year}-01`;
    }
    const yearMonthMatch = normalized.match(/^(\d{4})[/-](\d{1,2})$/);
    if (yearMonthMatch) {
      const year = Number.parseInt(yearMonthMatch[1], 10);
      const month = Number.parseInt(yearMonthMatch[2], 10);
      return month >= 1 && month <= 12 ? `${year}-${`${month}`.padStart(2, "0")}` : `${year}-01`;
    }
    const monthWordMatch = normalized.match(/^([a-z]+)\s+(\d{4})$/);
    if (monthWordMatch) {
      const monthIndex = _ExperienceDocumentImportService.MONTH_INDEX_BY_TOKEN[monthWordMatch[1]];
      const year = Number.parseInt(monthWordMatch[2], 10);
      if (monthIndex) {
        return `${year}-${`${monthIndex}`.padStart(2, "0")}`;
      }
    }
    const yearMatch = normalized.match(/^(\d{4})$/);
    if (yearMatch) {
      return `${yearMatch[1]}-01`;
    }
    return "";
  }
  currentYearMonth() {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}`;
  }
  entrySignature(entry) {
    return [
      entry.type,
      entry.title.trim().toLowerCase(),
      entry.org.trim().toLowerCase(),
      entry.dateFrom.trim(),
      entry.dateTo.trim()
    ].join("|");
  }
  static \u0275fac = function ExperienceDocumentImportService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ExperienceDocumentImportService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ExperienceDocumentImportService, factory: _ExperienceDocumentImportService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExperienceDocumentImportService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/services/user-experiences.service.ts
var UserExperiencesService = class _UserExperiencesService extends BaseRouteModeService {
  injector = inject(Injector);
  parser = inject(ExperienceDocumentImportService);
  localServiceRef = null;
  httpServiceRef = null;
  get localService() {
    if (!this.localServiceRef) {
      this.localServiceRef = this.injector.get(LocalUserExperiencesService);
    }
    return this.localServiceRef;
  }
  get httpService() {
    if (!this.httpServiceRef) {
      this.httpServiceRef = this.injector.get(HttpUserExperiencesService);
    }
    return this.httpServiceRef;
  }
  persistenceService(config = null) {
    return this.resolveRouteService("/auth/me/experiences", this.localService, this.httpService, config);
  }
  async loadUserExperiences(userId, config = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    return this.cloneEntries(await this.persistenceService(config).queryUserExperiences(normalizedUserId));
  }
  async saveUserExperiences(userId, entries, config = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    const normalizedEntries = this.normalizeEntries(entries);
    return this.cloneEntries(await this.persistenceService(config).saveUserExperiences(normalizedUserId, normalizedEntries));
  }
  prepareUserExperienceImport(file, existingEntries, onProgress) {
    return this.buildImportDraft(file, existingEntries, onProgress);
  }
  async importUserExperiences(userId, file, existingEntries, onProgress, config = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      throw new Error("Missing user id for experience import.");
    }
    const draft = await this.buildImportDraft(file, existingEntries, onProgress);
    onProgress?.({
      stage: "saving",
      percent: 100,
      label: "Saving imported experience batch"
    });
    if (draft.importedIds.length === 0) {
      return {
        entries: this.cloneEntries(draft.nextEntries),
        importedIds: [],
        warnings: draft.warnings
      };
    }
    const savedEntries = await this.saveUserExperiences(normalizedUserId, draft.nextEntries, config);
    return {
      entries: this.cloneEntries(savedEntries.length > 0 ? savedEntries : draft.nextEntries),
      importedIds: [...draft.importedIds],
      warnings: [...draft.warnings]
    };
  }
  async buildImportDraft(file, existingEntries, onProgress) {
    const parsed = await this.parser.parseFile(file, onProgress);
    const nextEntries = this.cloneEntries(existingEntries);
    const existingSignatures = new Set(nextEntries.map((entry) => this.entrySignature(entry)));
    const importedIds = [];
    const importedEntries = [];
    let duplicateCount = 0;
    const countsByType = {
      Workspace: 0,
      School: 0,
      "Online Session": 0,
      "Additional Project": 0
    };
    for (const entry of parsed.entries) {
      countsByType[entry.type] += 1;
    }
    for (const entry of parsed.entries) {
      const normalized = this.normalizeImportedEntry(entry);
      const signature = this.entrySignature(normalized);
      if (existingSignatures.has(signature)) {
        duplicateCount += 1;
        continue;
      }
      existingSignatures.add(signature);
      nextEntries.push(normalized);
      importedEntries.push(normalized);
      importedIds.push(normalized.id);
    }
    return {
      nextEntries: this.cloneEntries(nextEntries),
      importedEntries: this.cloneEntries(importedEntries),
      importedIds: [...importedIds],
      warnings: importedIds.length === 0 ? [...parsed.warnings, "The upload did not add any new experience cards."] : [...parsed.warnings],
      statistics: {
        detectedCount: parsed.entries.length,
        importedCount: importedIds.length,
        duplicateCount,
        countsByType
      }
    };
  }
  normalizeEntries(entries) {
    return entries.map((entry) => this.normalizeEntry(entry)).filter((entry) => Boolean(entry));
  }
  normalizeImportedEntry(entry) {
    return {
      id: this.createExperienceId(),
      type: entry.type,
      title: `${entry.title ?? ""}`.trim(),
      org: `${entry.org ?? ""}`.trim(),
      city: `${entry.city ?? ""}`.trim(),
      dateFrom: `${entry.dateFrom ?? ""}`.trim(),
      dateTo: `${entry.dateTo ?? ""}`.trim() || "Present",
      description: `${entry.description ?? ""}`.trim()
    };
  }
  normalizeEntry(entry) {
    const id = `${entry?.id ?? ""}`.trim();
    if (!id) {
      return null;
    }
    return {
      id,
      type: entry?.type === "School" || entry?.type === "Online Session" || entry?.type === "Additional Project" ? entry.type : "Workspace",
      title: `${entry?.title ?? ""}`.trim(),
      org: `${entry?.org ?? ""}`.trim(),
      city: `${entry?.city ?? ""}`.trim(),
      dateFrom: `${entry?.dateFrom ?? ""}`.trim(),
      dateTo: `${entry?.dateTo ?? ""}`.trim() || "Present",
      description: `${entry?.description ?? ""}`.trim()
    };
  }
  entrySignature(entry) {
    return [
      `${entry.type}`,
      `${entry.title}`.trim().toLowerCase(),
      `${entry.org}`.trim().toLowerCase(),
      `${entry.dateFrom}`.trim(),
      `${entry.dateTo}`.trim()
    ].join("|");
  }
  createExperienceId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `exp-${crypto.randomUUID()}`;
    }
    return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  cloneEntries(entries) {
    return entries.map((entry) => __spreadValues({}, entry));
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275UserExperiencesService_BaseFactory;
    return function UserExperiencesService_Factory(__ngFactoryType__) {
      return (\u0275UserExperiencesService_BaseFactory || (\u0275UserExperiencesService_BaseFactory = \u0275\u0275getInheritedFactory(_UserExperiencesService)))(__ngFactoryType__ || _UserExperiencesService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserExperiencesService, factory: _UserExperiencesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserExperiencesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  HelpCenterService,
  IdeaPostsService,
  PrivacyPolicyService,
  TermsPolicyService,
  LandingContentService,
  ActivityMembersService,
  ChatsService,
  RatesService,
  ActivitiesService,
  ExplanationGuideService,
  MediaService,
  NotificationsService,
  OperatorRegistryService,
  AdminParamsService,
  AdminMonitoringService,
  AdminStatsService,
  AdminNotificationsService,
  AdminModerationService,
  AdminAffinityGraphService,
  ContactsService,
  ActivityResourcesService,
  AssetsService,
  AssetTicketsService,
  ActivityInviteCandidatesService,
  UserExperiencesService
};
//# sourceMappingURL=chunk-QE3AUXWT.js.map
