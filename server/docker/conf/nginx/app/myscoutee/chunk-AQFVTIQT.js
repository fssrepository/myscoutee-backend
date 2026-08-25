import {
  OperatorLeaderboardStore
} from "./chunk-DCIHJJ5Y.js";
import {
  FirebaseMessagingService
} from "./chunk-YVQ3TQLD.js";
import {
  FirebaseAppService
} from "./chunk-UIMHSRXO.js";
import {
  OperatorRegistryService
} from "./chunk-C2QYRRDX.js";
import {
  DeploymentConfigurationService
} from "./chunk-PB4YNHSN.js";
import {
  OperatorConfigurationMapper
} from "./chunk-XQACYBVS.js";
import {
  UserProfileStore
} from "./chunk-INZQPXQM.js";
import {
  SessionService
} from "./chunk-333NTD7D.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/operator-workspace.store.ts
var CONFIGURATION_BUSY_ACTIONS = /* @__PURE__ */ new Set([
  "load-configuration",
  "save-branding",
  "save-admin-emails",
  "save-privacy-contact",
  "save-social-links",
  "register-payment",
  "register-firebase",
  "activate-firebase",
  "test-authentication",
  "test-messaging",
  "save-tls",
  "test-tls-domain",
  "test-tls-certificate"
]);
var OperatorWorkspaceStore = class _OperatorWorkspaceStore {
  service = inject(OperatorRegistryService);
  sessionService = inject(SessionService);
  leaderboard = inject(OperatorLeaderboardStore);
  userProfileStore = inject(UserProfileStore);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  firebaseAppService = inject(FirebaseAppService);
  firebaseMessagingService = inject(FirebaseMessagingService);
  claimStatusRef = signal(null, ...ngDevMode ? [{ debugName: "claimStatusRef" }] : (
    /* istanbul ignore next */
    []
  ));
  claimDraftRef = signal(this.emptyClaimDraft(), ...ngDevMode ? [{ debugName: "claimDraftRef" }] : (
    /* istanbul ignore next */
    []
  ));
  groupingTokenRef = signal(null, ...ngDevMode ? [{ debugName: "groupingTokenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  groupTokenInputRef = signal("", ...ngDevMode ? [{ debugName: "groupTokenInputRef" }] : (
    /* istanbul ignore next */
    []
  ));
  deploymentUpdateRef = signal(null, ...ngDevMode ? [{ debugName: "deploymentUpdateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationRef = signal(null, ...ngDevMode ? [{ debugName: "configurationRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationDraftRef = signal(null, ...ngDevMode ? [{ debugName: "configurationDraftRef" }] : (
    /* istanbul ignore next */
    []
  ));
  tlsConfigurationRef = signal(null, ...ngDevMode ? [{ debugName: "tlsConfigurationRef" }] : (
    /* istanbul ignore next */
    []
  ));
  tlsConfigurationDraftRef = signal(null, ...ngDevMode ? [{ debugName: "tlsConfigurationDraftRef" }] : (
    /* istanbul ignore next */
    []
  ));
  tlsJobRef = signal(null, ...ngDevMode ? [{ debugName: "tlsJobRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAdminEmailsInputRef = signal("", ...ngDevMode ? [{ debugName: "configurationAdminEmailsInputRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAuthenticationTestRef = signal(null, ...ngDevMode ? [{ debugName: "configurationAuthenticationTestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationMessagingTestRef = signal(null, ...ngDevMode ? [{ debugName: "configurationMessagingTestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationMessagingDestinationTokenRef = signal("", ...ngDevMode ? [{ debugName: "configurationMessagingDestinationTokenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAuthenticationFeedbackRef = signal(null, ...ngDevMode ? [{ debugName: "configurationAuthenticationFeedbackRef" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationMessagingFeedbackRef = signal(null, ...ngDevMode ? [{ debugName: "configurationMessagingFeedbackRef" }] : (
    /* istanbul ignore next */
    []
  ));
  tlsDomainFeedbackRef = signal(null, ...ngDevMode ? [{ debugName: "tlsDomainFeedbackRef" }] : (
    /* istanbul ignore next */
    []
  ));
  tlsCertificateFeedbackRef = signal(null, ...ngDevMode ? [{ debugName: "tlsCertificateFeedbackRef" }] : (
    /* istanbul ignore next */
    []
  ));
  tlsSaveFeedbackRef = signal(null, ...ngDevMode ? [{ debugName: "tlsSaveFeedbackRef" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueRef = signal(null, ...ngDevMode ? [{ debugName: "revenueRef" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueSyncRef = signal(null, ...ngDevMode ? [{ debugName: "revenueSyncRef" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueSettlementInitialPageRef = signal(null, ...ngDevMode ? [{ debugName: "revenueSettlementInitialPageRef" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueSettlementAvailableRef = signal(null, ...ngDevMode ? [{ debugName: "revenueSettlementAvailableRef" }] : (
    /* istanbul ignore next */
    []
  ));
  communityRef = signal(null, ...ngDevMode ? [{ debugName: "communityRef" }] : (
    /* istanbul ignore next */
    []
  ));
  busyActionRef = signal(null, ...ngDevMode ? [{ debugName: "busyActionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  errorRef = signal("", ...ngDevMode ? [{ debugName: "errorRef" }] : (
    /* istanbul ignore next */
    []
  ));
  noticeRef = signal("", ...ngDevMode ? [{ debugName: "noticeRef" }] : (
    /* istanbul ignore next */
    []
  ));
  feedbackActionRef = signal(null, ...ngDevMode ? [{ debugName: "feedbackActionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  requestGeneration = 0;
  configurationAuthenticationFeedbackTimer = null;
  configurationMessagingFeedbackTimer = null;
  tlsDomainFeedbackTimer = null;
  tlsCertificateFeedbackTimer = null;
  tlsSaveFeedbackTimer = null;
  configurationLifecycleGeneration = 0;
  contextKey = this.sessionKey(this.sessionService.currentSession());
  claimStatus = this.claimStatusRef.asReadonly();
  claimDraft = this.claimDraftRef.asReadonly();
  groupingToken = this.groupingTokenRef.asReadonly();
  groupTokenInput = this.groupTokenInputRef.asReadonly();
  deploymentUpdate = this.deploymentUpdateRef.asReadonly();
  configuration = this.configurationRef.asReadonly();
  configurationDraft = this.configurationDraftRef.asReadonly();
  tlsConfiguration = this.tlsConfigurationRef.asReadonly();
  tlsConfigurationDraft = this.tlsConfigurationDraftRef.asReadonly();
  tlsJob = this.tlsJobRef.asReadonly();
  configurationAdminEmailsInput = this.configurationAdminEmailsInputRef.asReadonly();
  configurationAuthenticationTest = this.configurationAuthenticationTestRef.asReadonly();
  configurationMessagingTest = this.configurationMessagingTestRef.asReadonly();
  configurationMessagingDestinationToken = this.configurationMessagingDestinationTokenRef.asReadonly();
  configurationAuthenticationFeedback = this.configurationAuthenticationFeedbackRef.asReadonly();
  configurationMessagingFeedback = this.configurationMessagingFeedbackRef.asReadonly();
  tlsDomainFeedback = this.tlsDomainFeedbackRef.asReadonly();
  tlsCertificateFeedback = this.tlsCertificateFeedbackRef.asReadonly();
  tlsSaveFeedback = this.tlsSaveFeedbackRef.asReadonly();
  revenue = this.revenueRef.asReadonly();
  revenueSync = this.revenueSyncRef.asReadonly();
  revenueSettlementAvailable = this.revenueSettlementAvailableRef.asReadonly();
  community = this.communityRef.asReadonly();
  busyAction = this.busyActionRef.asReadonly();
  error = this.errorRef.asReadonly();
  notice = this.noticeRef.asReadonly();
  feedbackAction = this.feedbackActionRef.asReadonly();
  claimCompanyReady = computed(() => {
    const status = this.claimStatusRef();
    const draft = this.claimDraftRef();
    return status?.verificationCapability === "AVAILABLE" && status.verificationStatus !== "PENDING_REVIEW" && !status.claimed && Boolean(draft.legalName.trim()) && Boolean(draft.registrationNumber.trim()) && Boolean(draft.jurisdiction.trim()) && Boolean(draft.registeredAddress.trim()) && Boolean(draft.verificationContactName.trim()) && Boolean(draft.verificationContactRole.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.verificationContactEmail.trim()) && this.validPublicWebsite(draft.website) && draft.authorityAttested;
  }, ...ngDevMode ? [{ debugName: "claimCompanyReady" }] : (
    /* istanbul ignore next */
    []
  ));
  claimClientCodeReady = computed(() => Boolean(this.groupTokenInputRef().trim()), ...ngDevMode ? [{ debugName: "claimClientCodeReady" }] : (
    /* istanbul ignore next */
    []
  ));
  claimVerificationReady = computed(() => this.claimCompanyReady(), ...ngDevMode ? [{ debugName: "claimVerificationReady" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationUploadOwnerId = computed(() => {
    const session = this.sessionService.currentSession();
    return this.userProfileStore.activeUserProfile()?.id?.trim() || (session?.kind === "demo" ? session.userId.trim() : "") || "operator-branding";
  }, ...ngDevMode ? [{ debugName: "configurationUploadOwnerId" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationFirebaseDirty = computed(() => {
    const configuration = this.configurationRef();
    const draft = this.configurationDraftRef();
    if (!configuration || !draft || configuration.capability !== "AVAILABLE") {
      return false;
    }
    return draft.firebase.projectId.trim() !== configuration.firebase.projectId || draft.firebase.apiKey.trim() !== configuration.firebase.publicConfiguration.apiKey || draft.firebase.authDomain.trim() !== configuration.firebase.publicConfiguration.authDomain || draft.firebase.storageBucket.trim() !== configuration.firebase.publicConfiguration.storageBucket || draft.firebase.messagingSenderId.trim() !== configuration.firebase.publicConfiguration.messagingSenderId || draft.firebase.appId.trim() !== configuration.firebase.publicConfiguration.appId || draft.firebase.measurementId.trim() !== (configuration.firebase.publicConfiguration.measurementId ?? "") || draft.firebase.vapidKey.trim() !== (configuration.firebase.publicConfiguration.vapidKey ?? "") || Boolean(draft.firebase.authenticationCredential.trim()) || Boolean(draft.firebase.messagingCredential.trim());
  }, ...ngDevMode ? [{ debugName: "configurationFirebaseDirty" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationDirty = computed(() => {
    const configuration = this.configurationRef();
    const draft = this.configurationDraftRef();
    if (!configuration || !draft || configuration.capability !== "AVAILABLE") {
      return false;
    }
    return draft.branding.productName.trim() !== configuration.branding.productName || draft.branding.logoUrl.trim() !== configuration.branding.logoUrl || draft.branding.logoCharacterIndex !== configuration.branding.logoCharacterIndex || draft.branding.themePreset !== configuration.branding.themePreset || !OperatorConfigurationMapper.adminEmailsEqual(draft.adminEmails, configuration.adminEmails) || draft.privacyContact.dataControllerName.trim() !== configuration.privacyContact.dataControllerName || draft.privacyContact.privacyContactEmail.trim().toLowerCase() !== configuration.privacyContact.privacyContactEmail || !OperatorConfigurationMapper.socialLinksEqual(draft.socialLinks, configuration.socialLinks) || (draft.payment.providerId ?? "") !== (configuration.payment.providerId ?? "") || draft.payment.publicBaseUrl.trim() !== (configuration.payment.publicBaseUrl ?? "") || draft.payment.merchantAccount.trim() !== (configuration.payment.merchantAccount ?? "") || Boolean(draft.payment.credential.trim()) || this.configurationFirebaseDirty();
  }, ...ngDevMode ? [{ debugName: "configurationDirty" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationBrandingReady = computed(() => {
    const draft = this.configurationDraftRef();
    if (!draft?.branding.productName.trim()) {
      return false;
    }
    const index = draft.branding.logoCharacterIndex;
    return index === null || Number.isInteger(index) && index >= -1 && index < Array.from(draft.branding.productName.trim()).length;
  }, ...ngDevMode ? [{ debugName: "configurationBrandingReady" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAdminEmailsValidationKey = computed(() => OperatorConfigurationMapper.adminEmailValidationKey(this.configurationAdminEmailsInputRef()), ...ngDevMode ? [{ debugName: "configurationAdminEmailsValidationKey" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAdminEmailsReady = computed(() => this.configurationAdminEmailsValidationKey() === null, ...ngDevMode ? [{ debugName: "configurationAdminEmailsReady" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPrivacyContactValidationKey = computed(() => OperatorConfigurationMapper.privacyContactValidationKey(this.configurationDraftRef()?.privacyContact), ...ngDevMode ? [{ debugName: "configurationPrivacyContactValidationKey" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPrivacyContactReady = computed(() => this.configurationPrivacyContactValidationKey() === null, ...ngDevMode ? [{ debugName: "configurationPrivacyContactReady" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationSocialLinksValidationKey = computed(() => OperatorConfigurationMapper.socialLinksValidationKey(this.configurationDraftRef()?.socialLinks ?? []), ...ngDevMode ? [{ debugName: "configurationSocialLinksValidationKey" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationSocialLinksReady = computed(() => this.configurationSocialLinksValidationKey() === null, ...ngDevMode ? [{ debugName: "configurationSocialLinksReady" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPaymentValidationKey = computed(() => OperatorConfigurationMapper.paymentValidationKey(this.configurationDraftRef()?.payment), ...ngDevMode ? [{ debugName: "configurationPaymentValidationKey" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPaymentReady = computed(() => Boolean(this.configurationDraftRef()?.payment.providerId && this.configurationPaymentValidationKey() === null), ...ngDevMode ? [{ debugName: "configurationPaymentReady" }] : (
    /* istanbul ignore next */
    []
  ));
  tlsConfigurationReady = computed(() => {
    const draft = this.tlsConfigurationDraftRef();
    if (!draft || !draft.enabled) {
      return Boolean(draft);
    }
    if (!/^(?=.{1,253}$)(?![.-])(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(draft.domain.trim())) {
      return false;
    }
    if (draft.mode === "AUTOMATIC" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contactEmail.trim())) {
      return false;
    }
    const installed = this.tlsConfigurationRef();
    const reusableManualCertificate = installed?.certificateConfigured === true && installed.mode === "MANUAL" && installed.domain.trim().toLowerCase() === draft.domain.trim().toLowerCase();
    return draft.mode !== "MANUAL" || Boolean(draft.certificate.trim() && draft.privateKey.trim() || reusableManualCertificate);
  }, ...ngDevMode ? [{ debugName: "tlsConfigurationReady" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      const nextContextKey = this.sessionKey(this.sessionService.session());
      if (nextContextKey === this.contextKey) {
        return;
      }
      this.contextKey = nextContextKey;
      this.reset();
    });
  }
  async loadInitialWorkspace() {
    const settled = await this.run("load-workspace", () => Promise.allSettled([
      this.service.loadClaimStatus(),
      this.service.loadDeploymentUpdate(),
      this.service.loadCommunityStatus()
    ]));
    if (!settled) {
      return;
    }
    const [claimResult, updateResult, communityResult] = settled;
    if (claimResult.status === "fulfilled") {
      this.applyClaimOverview(claimResult.value);
    }
    if (updateResult.status === "fulfilled") {
      this.deploymentUpdateRef.set(updateResult.value);
    }
    if (communityResult.status === "fulfilled") {
      this.communityRef.set(communityResult.value);
    }
    const failure = settled.find((result) => result.status === "rejected");
    if (failure) {
      this.errorRef.set(this.messageFromError(failure.reason));
    }
  }
  async loadClaimStatus(force = false) {
    const cached = this.claimStatusRef();
    if (cached && !force) {
      return cached;
    }
    const overview = await this.run("load-claim", () => this.service.loadClaimStatus());
    if (overview) {
      this.applyClaimOverview(overview);
    }
    return overview?.status ?? null;
  }
  async issueGroupingToken() {
    const result = await this.run("issue-grouping-token", () => this.service.issueGroupingToken());
    if (result) {
      this.groupingTokenRef.set(result);
      this.noticeRef.set("operator.group.token.issued");
    }
    return result;
  }
  async claimShare() {
    if (!this.claimCompanyReady()) {
      this.feedbackActionRef.set("claim-share");
      this.errorRef.set("operator.claim.verification.error.required");
      return null;
    }
    const draft = structuredClone(this.claimDraftRef());
    const mutation = await this.run("claim-share", () => this.service.claimShare(draft));
    if (mutation) {
      const result = mutation.status;
      this.claimStatusRef.set(result);
      if (mutation.submission) {
        this.claimDraftRef.set(structuredClone(mutation.submission));
      }
      this.noticeRef.set(result.verificationStatus === "PENDING_REVIEW" ? "operator.claim.verification.submitted" : "operator.claim.completed");
      this.leaderboard.applyMutation(mutation);
      return result;
    }
    return null;
  }
  async linkOperatorGroup() {
    const clientToken = this.groupTokenInputRef().trim();
    if (!this.claimClientCodeReady()) {
      this.errorRef.set("operator.claim.client.code.required");
      return null;
    }
    const mutation = await this.run("link-operator-group", () => this.service.linkOperatorGroup(clientToken));
    if (mutation) {
      const result = mutation.status;
      this.claimStatusRef.set(result);
      if (mutation.submission) {
        this.claimDraftRef.set(structuredClone(mutation.submission));
      }
      this.groupTokenInputRef.set("");
      this.noticeRef.set("operator.claim.client.code.submitted");
      this.leaderboard.applyMutation(mutation);
      return result;
    }
    return null;
  }
  async loadDeploymentUpdate(force = false) {
    const cached = this.deploymentUpdateRef();
    if (cached && !force) {
      return cached;
    }
    const result = await this.run("load-update", () => this.service.loadDeploymentUpdate());
    if (result) {
      this.deploymentUpdateRef.set(result);
    }
    return result;
  }
  async refreshDeploymentUpdate() {
    return this.loadDeploymentUpdate(true);
  }
  async applyDeploymentUpdate() {
    const result = await this.run("apply-update", () => this.service.applyDeploymentUpdate((progress) => {
      this.deploymentUpdateRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
        progress
      }) : current);
    }));
    if (result) {
      this.deploymentUpdateRef.set(result);
      if (result.progress.phase === "COMPLETED") {
        this.noticeRef.set("operator.update.completed");
      } else if (result.progress.phase === "FAILED") {
        this.errorRef.set(result.progress.message || "operator.update.error.failed");
      }
    }
    return result;
  }
  async loadConfiguration() {
    const result = await this.run("load-configuration", async () => {
      const [configuration, tlsConfiguration] = await Promise.all([
        this.service.loadConfiguration(),
        Promise.resolve().then(() => this.service.loadTlsConfiguration()).catch(() => null)
      ]);
      return { configuration, tlsConfiguration };
    });
    if (result) {
      this.configurationRef.set(result.configuration);
      this.configurationDraftRef.set(this.configurationDraftFrom(result.configuration));
      this.configurationAdminEmailsInputRef.set(OperatorConfigurationMapper.adminEmailInput(result.configuration.adminEmails));
      this.deploymentConfiguration.applyBranding(result.configuration.branding);
      this.deploymentConfiguration.applySocialLinks(result.configuration.socialLinks);
      this.deploymentConfiguration.applyPrivacyContact(result.configuration.privacyContact);
      if (result.tlsConfiguration) {
        this.tlsConfigurationRef.set(result.tlsConfiguration);
        this.tlsConfigurationDraftRef.set(this.tlsDraftFrom(result.tlsConfiguration));
      }
    }
    return result?.configuration ?? null;
  }
  setTlsConfiguration(patch) {
    this.clearTlsTestFeedback();
    this.tlsConfigurationDraftRef.update((current) => current ? __spreadValues(__spreadValues(__spreadValues({}, current), patch), patch.mode === "MANUAL" ? { autoRenew: false } : {}) : current);
  }
  async testTlsConfiguration(kind) {
    this.clearTlsTestFeedback(kind);
    const draft = this.tlsConfigurationDraftRef();
    if (!draft || !this.tlsConfigurationReady()) {
      this.errorRef.set("operator.configuration.tls.validation.invalid");
      return null;
    }
    const action = kind === "DOMAIN" ? "test-tls-domain" : "test-tls-certificate";
    const result = await this.run(action, () => this.service.testTlsConfiguration({
      kind,
      configuration: structuredClone(draft)
    }));
    if (result) {
      this.tlsJobRef.set(result);
      this.noticeRef.set(result.message);
      this.showTlsTestFeedback(kind, "success");
    } else if (this.errorRef()) {
      this.showTlsTestFeedback(kind, "error");
    }
    return result;
  }
  async saveTlsConfiguration() {
    this.clearTlsSaveFeedback();
    const draft = this.tlsConfigurationDraftRef();
    if (!draft || !this.tlsConfigurationReady()) {
      this.errorRef.set("operator.configuration.tls.validation.invalid");
      this.showTlsSaveFeedback("error");
      return null;
    }
    const result = await this.run("save-tls", () => this.service.saveTlsConfiguration(structuredClone(draft)));
    if (result) {
      this.tlsJobRef.set(result);
      const configuration = result.configuration ?? (result.phase === "COMPLETED" ? await this.service.loadTlsConfiguration().catch(() => null) : null);
      if (configuration) {
        this.tlsConfigurationRef.set(configuration);
        this.tlsConfigurationDraftRef.set(this.tlsDraftFrom(configuration));
        this.noticeRef.set("operator.configuration.tls.saved");
      } else {
        this.tlsConfigurationDraftRef.update((current) => current ? __spreadProps(__spreadValues({}, current), { certificate: "", privateKey: "" }) : current);
        this.noticeRef.set(result.message);
      }
      this.showTlsSaveFeedback("success");
    } else if (this.errorRef()) {
      this.showTlsSaveFeedback("error");
    }
    return result;
  }
  async loadRevenue() {
    const cached = this.revenueRef();
    if (cached && this.revenueSettlementAvailableRef() !== null) {
      return cached;
    }
    const result = await this.run("load-revenue", async () => {
      const [revenue, settlementPage] = await Promise.all([
        this.service.loadRevenue(),
        this.service.settlementPage({
          page: 0,
          pageSize: 6,
          sort: "period",
          direction: "desc",
          filters: {
            includeSuperseded: false
          }
        }).catch(() => null)
      ]);
      return { revenue, settlementPage };
    });
    if (result) {
      this.revenueRef.set(result.revenue);
      this.revenueSettlementInitialPageRef.set(result.settlementPage ? structuredClone(result.settlementPage) : null);
      this.revenueSettlementAvailableRef.set(result.settlementPage !== null);
    }
    return result?.revenue ?? null;
  }
  async synchronizeRevenue() {
    const result = await this.run("synchronize-revenue", () => this.service.synchronizeRevenue());
    if (result) {
      this.revenueSyncRef.set(result);
    }
    return result;
  }
  revenueReportPage(query, signal2) {
    return this.service.revenueReportPage(query, signal2);
  }
  settlementPage(query, signal2) {
    const initialPage = this.revenueSettlementInitialPageRef();
    if (initialPage && Math.max(0, Math.trunc(Number(query.page) || 0)) === 0 && Math.max(1, Math.trunc(Number(query.pageSize) || 0)) === 6 && !query.cursor && !`${query.filters?.currencyCode ?? ""}`.trim() && !`${query.filters?.fromPeriod ?? ""}`.trim() && !`${query.filters?.throughPeriod ?? ""}`.trim() && query.filters?.includeSuperseded !== true) {
      return Promise.resolve(structuredClone(initialPage));
    }
    return this.service.settlementPage(query, signal2);
  }
  async requeueRevenueReport(reportId) {
    const result = await this.run("requeue-revenue-report", () => this.service.requeueRevenueReport(reportId));
    if (!result) {
      return null;
    }
    if (result.status === "PENDING") {
      this.revenueSyncRef.update((current) => {
        if (!current) {
          return current;
        }
        const blocked = Math.max(0, current.blocked - 1);
        return __spreadProps(__spreadValues({}, current), {
          state: blocked > 0 ? "BLOCKED" : "PENDING",
          code: blocked > 0 ? current.code : "REVENUE_DELIVERY_PENDING",
          message: blocked > 0 ? current.message : "operator.revenue.delivery.requeued.pending",
          pending: current.pending + 1,
          blocked,
          synchronizedAtIso: current.synchronizedAtIso
        });
      });
    }
    this.noticeRef.set("operator.revenue.delivery.requeued");
    return result;
  }
  async saveConfiguration(action, noticeKey = "operator.configuration.saved") {
    const configuration = this.configurationRef();
    const draft = this.configurationDraftRef();
    const firebaseChanged = this.configurationFirebaseDirty();
    if (!configuration || configuration.capability !== "AVAILABLE" || !draft) {
      this.errorRef.set(configuration?.unavailableReason || "operator.configuration.backend.unavailable");
      return null;
    }
    const adminEmailValidationKey = this.configurationAdminEmailsValidationKey();
    if (adminEmailValidationKey) {
      this.feedbackActionRef.set(action);
      this.errorRef.set(adminEmailValidationKey);
      return null;
    }
    const socialLinkValidationKey = this.configurationSocialLinksValidationKey();
    if (socialLinkValidationKey) {
      this.feedbackActionRef.set(action);
      this.errorRef.set(socialLinkValidationKey);
      return null;
    }
    const privacyContactValidationKey = this.configurationPrivacyContactValidationKey();
    if (privacyContactValidationKey) {
      this.feedbackActionRef.set(action);
      this.errorRef.set(privacyContactValidationKey);
      return null;
    }
    if (action === "register-payment") {
      const paymentValidationKey = this.configurationPaymentValidationKey();
      if (paymentValidationKey) {
        this.feedbackActionRef.set(action);
        this.errorRef.set(paymentValidationKey);
        return null;
      }
    }
    const result = await this.run(action, async () => {
      try {
        return await this.service.saveConfiguration(__spreadProps(__spreadValues({}, structuredClone(draft)), {
          payment: __spreadProps(__spreadValues({}, structuredClone(draft.payment)), {
            publicBaseUrl: OperatorConfigurationMapper.paymentPublicBaseUrl(draft.payment.publicBaseUrl) || draft.payment.publicBaseUrl.trim(),
            merchantAccount: OperatorConfigurationMapper.paymentMerchantAccount(draft.payment.merchantAccount)
          }),
          socialLinks: OperatorConfigurationMapper.socialLinks(draft.socialLinks)
        }));
      } finally {
        if (firebaseChanged) {
          await this.firebaseAppService.refreshFirebaseApp();
        }
      }
    });
    if (result) {
      this.configurationRef.set(result);
      this.configurationDraftRef.set(this.configurationDraftFrom(result));
      this.configurationAdminEmailsInputRef.set(OperatorConfigurationMapper.adminEmailInput(result.adminEmails));
      this.configurationAuthenticationTestRef.set(null);
      this.configurationMessagingTestRef.set(null);
      this.clearConfigurationTestFeedback();
      this.deploymentConfiguration.applyBranding(result.branding);
      this.deploymentConfiguration.applySocialLinks(result.socialLinks);
      this.deploymentConfiguration.applyPrivacyContact(result.privacyContact);
      this.noticeRef.set(noticeKey);
    }
    return result;
  }
  async testConfiguration(kind) {
    const lifecycleGeneration = this.configurationLifecycleGeneration;
    const requestGeneration = this.requestGeneration;
    this.clearConfigurationTestFeedback(kind);
    if (kind === "FIREBASE_AUTHENTICATION") {
      this.configurationAuthenticationTestRef.set(null);
    } else {
      this.configurationMessagingTestRef.set(null);
    }
    const destinationToken = this.configurationMessagingDestinationTokenRef().trim();
    let readinessLease = null;
    if (kind === "FIREBASE_MESSAGING") {
      const publicConfiguration = this.configurationRef()?.firebase.publicConfiguration;
      if (publicConfiguration?.vapidKey?.trim()) {
        try {
          readinessLease = await this.firebaseMessagingService.createBrowserReadinessLease(__spreadProps(__spreadValues({
            revision: publicConfiguration.revision,
            apiKey: publicConfiguration.apiKey,
            authDomain: publicConfiguration.authDomain,
            projectId: publicConfiguration.projectId,
            storageBucket: publicConfiguration.storageBucket,
            messagingSenderId: publicConfiguration.messagingSenderId,
            appId: publicConfiguration.appId
          }, publicConfiguration.measurementId ? { measurementId: publicConfiguration.measurementId } : {}), {
            vapidKey: publicConfiguration.vapidKey
          }));
        } catch {
        }
      }
    }
    if (lifecycleGeneration !== this.configurationLifecycleGeneration || requestGeneration !== this.requestGeneration) {
      await readinessLease?.release();
      return null;
    }
    const testRequestGeneration = this.requestGeneration + 1;
    const result = await this.run(kind === "FIREBASE_AUTHENTICATION" ? "test-authentication" : "test-messaging", async () => {
      try {
        return await this.service.testConfiguration(__spreadValues(__spreadValues({
          kind
        }, kind === "FIREBASE_MESSAGING" && destinationToken ? { destinationToken } : {}), kind === "FIREBASE_MESSAGING" && readinessLease ? {
          browserReadinessToken: readinessLease.proof.token,
          browserConfigurationRevision: readinessLease.proof.configurationRevision,
          browserAppId: readinessLease.proof.appId
        } : {}));
      } finally {
        try {
          await readinessLease?.release();
        } finally {
          await this.firebaseAppService.refreshFirebaseApp();
        }
      }
    });
    if (lifecycleGeneration !== this.configurationLifecycleGeneration || testRequestGeneration !== this.requestGeneration) {
      return null;
    }
    if (result) {
      const authoritativeFirebase = result.firebase;
      if (authoritativeFirebase) {
        this.configurationRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
          firebase: structuredClone(authoritativeFirebase)
        }) : current);
      }
      if (kind === "FIREBASE_AUTHENTICATION") {
        this.configurationAuthenticationTestRef.set(result);
      } else {
        this.configurationMessagingTestRef.set(result);
      }
      this.showConfigurationTestFeedback(kind, result.success ? "success" : "error");
    } else if (this.errorRef()) {
      const failure = {
        kind,
        success: false,
        message: this.errorRef(),
        testedAt: (/* @__PURE__ */ new Date()).toISOString(),
        firebase: null
      };
      if (kind === "FIREBASE_AUTHENTICATION") {
        this.configurationAuthenticationTestRef.set(failure);
      } else {
        this.configurationMessagingTestRef.set(failure);
      }
      this.showConfigurationTestFeedback(kind, "error");
    }
    return result;
  }
  async activateFirebase() {
    const result = await this.run("activate-firebase", async () => {
      try {
        return await this.service.activateFirebase();
      } finally {
        await this.firebaseAppService.refreshFirebaseApp();
      }
    });
    if (result) {
      this.configurationRef.set(result);
      this.configurationDraftRef.set(this.configurationDraftFrom(result));
      this.noticeRef.set("operator.configuration.firebase.activated");
    }
    return result;
  }
  async loadCommunityStatus(force = false) {
    const cached = this.communityRef();
    if (cached && !force) {
      return cached;
    }
    const result = await this.run("load-community", () => this.service.loadCommunityStatus());
    if (result) {
      this.communityRef.set(result);
    }
    return result;
  }
  async setCommunityAvailability(availability) {
    const result = await this.run("set-community", () => this.service.setCommunityAvailability(availability));
    if (result) {
      this.communityRef.set(result);
      this.noticeRef.set("operator.community.updated");
    }
    return result;
  }
  clearFeedback() {
    this.errorRef.set("");
    this.noticeRef.set("");
    this.feedbackActionRef.set(null);
    this.configurationAuthenticationTestRef.set(null);
    this.configurationMessagingTestRef.set(null);
    this.configurationMessagingDestinationTokenRef.set("");
    this.revenueRef.set(null);
    this.revenueSyncRef.set(null);
    this.revenueSettlementInitialPageRef.set(null);
    this.revenueSettlementAvailableRef.set(null);
    this.clearConfigurationTestFeedback();
    this.clearTlsTestFeedback();
    this.clearTlsSaveFeedback();
  }
  clearConfigurationCredentialDrafts() {
    this.configurationLifecycleGeneration += 1;
    const busyAction = this.busyActionRef();
    if (busyAction && CONFIGURATION_BUSY_ACTIONS.has(busyAction)) {
      this.requestGeneration += 1;
      this.busyActionRef.set(null);
      this.feedbackActionRef.set(null);
    }
    this.configurationDraftRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
      payment: __spreadProps(__spreadValues({}, current.payment), {
        credential: ""
      }),
      firebase: __spreadProps(__spreadValues({}, current.firebase), {
        authenticationCredential: "",
        messagingCredential: ""
      })
    }) : current);
    this.tlsConfigurationDraftRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
      certificate: "",
      privateKey: ""
    }) : current);
    this.configurationAuthenticationTestRef.set(null);
    this.configurationMessagingTestRef.set(null);
    this.configurationMessagingDestinationTokenRef.set("");
    this.clearConfigurationTestFeedback();
    this.clearTlsTestFeedback();
  }
  setGroupTokenInput(value) {
    this.groupTokenInputRef.set(`${value ?? ""}`);
  }
  setClaimDraft(patch) {
    this.claimDraftRef.update((current) => __spreadValues(__spreadValues({}, current), patch));
  }
  applyRegistryDeactivation() {
    this.claimStatusRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
      claimed: false,
      claimedAt: null,
      claimantUserId: null,
      claimantName: null,
      claimantAvatarUrl: null,
      operatorGroupId: null,
      activeLinkId: null,
      sharePercent: 0,
      shareNumerator: "0",
      shareDenominator: "1",
      verificationStatus: current.verificationStatus === "NOT_SUBMITTED" ? "NOT_SUBMITTED" : "WITHDRAWN",
      legalName: null
    }) : current);
    this.claimDraftRef.set(this.emptyClaimDraft());
    this.groupingTokenRef.set(null);
    this.groupTokenInputRef.set("");
  }
  setConfigurationBranding(patch) {
    this.configurationDraftRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
      branding: __spreadValues(__spreadValues({}, current.branding), patch)
    }) : current);
  }
  setConfigurationAdminEmailsInput(value) {
    const input = `${value ?? ""}`.slice(0, 8192);
    this.configurationAdminEmailsInputRef.set(input);
    this.configurationDraftRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
      adminEmails: OperatorConfigurationMapper.adminEmails(input)
    }) : current);
  }
  setConfigurationPrivacyContact(patch) {
    this.configurationDraftRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
      privacyContact: __spreadValues(__spreadValues({}, current.privacyContact), patch)
    }) : current);
  }
  addConfigurationSocialLink() {
    this.configurationDraftRef.update((current) => {
      if (!current || current.socialLinks.length >= OperatorConfigurationMapper.SOCIAL_LINK_MAX_COUNT) {
        return current;
      }
      return __spreadProps(__spreadValues({}, current), {
        socialLinks: [
          ...current.socialLinks,
          {
            provider: "",
            label: "",
            url: "",
            icon: null,
            handle: null
          }
        ]
      });
    });
  }
  setConfigurationSocialLink(index, patch) {
    this.configurationDraftRef.update((current) => {
      if (!current || index < 0 || index >= current.socialLinks.length) {
        return current;
      }
      return __spreadProps(__spreadValues({}, current), {
        socialLinks: current.socialLinks.map((link, linkIndex) => linkIndex === index ? __spreadValues(__spreadValues({}, link), patch) : link)
      });
    });
  }
  removeConfigurationSocialLink(index) {
    this.configurationDraftRef.update((current) => {
      if (!current || index < 0 || index >= current.socialLinks.length) {
        return current;
      }
      return __spreadProps(__spreadValues({}, current), {
        socialLinks: current.socialLinks.filter((_link, linkIndex) => linkIndex !== index)
      });
    });
  }
  setConfigurationPayment(patch) {
    this.configurationDraftRef.update((current) => {
      if (!current) {
        return current;
      }
      const providerRemoved = Object.prototype.hasOwnProperty.call(patch, "providerId") && !`${patch.providerId ?? ""}`.trim();
      return __spreadProps(__spreadValues({}, current), {
        payment: providerRemoved ? {
          providerId: null,
          publicBaseUrl: "",
          merchantAccount: "",
          credential: ""
        } : __spreadValues(__spreadValues({}, current.payment), patch)
      });
    });
  }
  setConfigurationFirebase(patch) {
    this.configurationDraftRef.update((current) => current ? __spreadProps(__spreadValues({}, current), {
      firebase: __spreadValues(__spreadValues({}, current.firebase), patch)
    }) : current);
  }
  setConfigurationMessagingDestinationToken(value) {
    this.configurationMessagingDestinationTokenRef.set(`${value ?? ""}`.slice(0, 4096));
    this.configurationMessagingTestRef.set(null);
    this.clearConfigurationTestFeedback("FIREBASE_MESSAGING");
  }
  async run(action, request) {
    const generation = ++this.requestGeneration;
    this.busyActionRef.set(action);
    this.feedbackActionRef.set(action);
    this.errorRef.set("");
    this.noticeRef.set("");
    try {
      const result = await request();
      return generation === this.requestGeneration ? result : null;
    } catch (error) {
      if (generation === this.requestGeneration) {
        this.errorRef.set(this.messageFromError(error));
      }
      return null;
    } finally {
      if (generation === this.requestGeneration) {
        this.busyActionRef.set(null);
      }
    }
  }
  reset() {
    this.requestGeneration += 1;
    this.claimStatusRef.set(null);
    this.claimDraftRef.set(this.emptyClaimDraft());
    this.groupingTokenRef.set(null);
    this.groupTokenInputRef.set("");
    this.deploymentUpdateRef.set(null);
    this.configurationRef.set(null);
    this.configurationDraftRef.set(null);
    this.tlsConfigurationRef.set(null);
    this.tlsConfigurationDraftRef.set(null);
    this.tlsJobRef.set(null);
    this.configurationAdminEmailsInputRef.set("");
    this.configurationAuthenticationTestRef.set(null);
    this.configurationMessagingTestRef.set(null);
    this.configurationMessagingDestinationTokenRef.set("");
    this.revenueSyncRef.set(null);
    this.communityRef.set(null);
    this.busyActionRef.set(null);
    this.clearFeedback();
  }
  applyClaimOverview(overview) {
    this.claimStatusRef.set(overview.status);
    if (overview.submission) {
      this.claimDraftRef.set(structuredClone(overview.submission));
    } else {
      this.seedClaimContact();
    }
  }
  sessionKey(session) {
    if (session?.kind === "demo") {
      return `demo:${session.userId.trim()}`;
    }
    if (session?.kind === "firebase") {
      return `firebase:${session.profile.id.trim()}`;
    }
    if (session?.kind === "operator-bootstrap") {
      return `operator-bootstrap:${session.email.trim()}`;
    }
    return "none";
  }
  configurationDraftFrom(configuration) {
    return {
      adminEmails: OperatorConfigurationMapper.adminEmails(configuration.adminEmails),
      privacyContact: {
        dataControllerName: configuration.privacyContact.dataControllerName,
        privacyContactEmail: configuration.privacyContact.privacyContactEmail
      },
      socialLinks: OperatorConfigurationMapper.socialLinks(configuration.socialLinks),
      branding: {
        productName: configuration.branding.productName,
        logoUrl: configuration.branding.logoUrl,
        logoCharacterIndex: configuration.branding.logoCharacterIndex,
        themePreset: configuration.branding.themePreset
      },
      payment: {
        providerId: configuration.payment.providerId,
        publicBaseUrl: configuration.payment.publicBaseUrl ?? "",
        merchantAccount: configuration.payment.merchantAccount ?? "",
        credential: ""
      },
      firebase: {
        projectId: configuration.firebase.projectId,
        apiKey: configuration.firebase.publicConfiguration.apiKey,
        authDomain: configuration.firebase.publicConfiguration.authDomain,
        storageBucket: configuration.firebase.publicConfiguration.storageBucket,
        messagingSenderId: configuration.firebase.publicConfiguration.messagingSenderId,
        appId: configuration.firebase.publicConfiguration.appId,
        measurementId: configuration.firebase.publicConfiguration.measurementId ?? "",
        vapidKey: configuration.firebase.publicConfiguration.vapidKey ?? "",
        authenticationCredential: "",
        messagingCredential: ""
      }
    };
  }
  tlsDraftFrom(configuration) {
    return {
      enabled: configuration.enabled,
      mode: configuration.mode,
      domain: configuration.domain,
      contactEmail: configuration.contactEmail,
      autoRenew: configuration.mode === "AUTOMATIC" && configuration.autoRenew,
      certificate: "",
      privateKey: ""
    };
  }
  messageFromError(error) {
    if (error && typeof error === "object") {
      const source = error;
      const serverMessage = typeof source.error?.message === "string" ? source.error.message.trim() : typeof source.error?.detail === "string" ? source.error.detail.trim() : "";
      if (serverMessage) {
        return serverMessage;
      }
      if (source.name === "TimeoutError") {
        return "operator.request.timeout";
      }
      if (typeof source.message === "string" && source.message.trim()) {
        return source.message.trim();
      }
    }
    return "operator.request.failed";
  }
  emptyClaimDraft() {
    return {
      legalName: "",
      registrationNumber: "",
      jurisdiction: "",
      registeredAddress: "",
      website: "",
      verificationContactName: "",
      verificationContactRole: "",
      verificationContactEmail: "",
      authorityAttested: false
    };
  }
  seedClaimContact() {
    const profile = this.userProfileStore.activeUserProfile();
    const session = this.sessionService.currentSession();
    if (!profile && session?.kind !== "firebase" && session?.kind !== "operator-bootstrap") {
      return;
    }
    this.claimDraftRef.update((current) => __spreadProps(__spreadValues({}, current), {
      verificationContactName: current.verificationContactName || profile?.name?.trim() || (session?.kind === "firebase" ? session.profile.name.trim() : ""),
      verificationContactEmail: current.verificationContactEmail || (session?.kind === "firebase" ? session.profile.email.trim() : session?.kind === "operator-bootstrap" ? session.email.trim() : "")
    }));
  }
  validPublicWebsite(value) {
    const source = `${value ?? ""}`.trim();
    if (!source) {
      return false;
    }
    try {
      const url = new URL(source);
      return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
    } catch {
      return false;
    }
  }
  showConfigurationTestFeedback(kind, state) {
    const feedbackRef = kind === "FIREBASE_AUTHENTICATION" ? this.configurationAuthenticationFeedbackRef : this.configurationMessagingFeedbackRef;
    feedbackRef.set(state);
    const timer = setTimeout(() => {
      feedbackRef.set(null);
      if (kind === "FIREBASE_AUTHENTICATION") {
        this.configurationAuthenticationFeedbackTimer = null;
      } else {
        this.configurationMessagingFeedbackTimer = null;
      }
    }, 1e3);
    if (kind === "FIREBASE_AUTHENTICATION") {
      this.configurationAuthenticationFeedbackTimer = timer;
    } else {
      this.configurationMessagingFeedbackTimer = timer;
    }
  }
  clearConfigurationTestFeedback(kind) {
    if (!kind || kind === "FIREBASE_AUTHENTICATION") {
      if (this.configurationAuthenticationFeedbackTimer) {
        clearTimeout(this.configurationAuthenticationFeedbackTimer);
        this.configurationAuthenticationFeedbackTimer = null;
      }
      this.configurationAuthenticationFeedbackRef.set(null);
    }
    if (!kind || kind === "FIREBASE_MESSAGING") {
      if (this.configurationMessagingFeedbackTimer) {
        clearTimeout(this.configurationMessagingFeedbackTimer);
        this.configurationMessagingFeedbackTimer = null;
      }
      this.configurationMessagingFeedbackRef.set(null);
    }
  }
  showTlsTestFeedback(kind, state) {
    const feedbackRef = kind === "DOMAIN" ? this.tlsDomainFeedbackRef : this.tlsCertificateFeedbackRef;
    feedbackRef.set(state);
    const timer = setTimeout(() => {
      feedbackRef.set(null);
      if (kind === "DOMAIN") {
        this.tlsDomainFeedbackTimer = null;
      } else {
        this.tlsCertificateFeedbackTimer = null;
      }
    }, 1e3);
    if (kind === "DOMAIN") {
      this.tlsDomainFeedbackTimer = timer;
    } else {
      this.tlsCertificateFeedbackTimer = timer;
    }
  }
  clearTlsTestFeedback(kind) {
    if (!kind || kind === "DOMAIN") {
      if (this.tlsDomainFeedbackTimer) {
        clearTimeout(this.tlsDomainFeedbackTimer);
        this.tlsDomainFeedbackTimer = null;
      }
      this.tlsDomainFeedbackRef.set(null);
    }
    if (!kind || kind === "CERTIFICATE") {
      if (this.tlsCertificateFeedbackTimer) {
        clearTimeout(this.tlsCertificateFeedbackTimer);
        this.tlsCertificateFeedbackTimer = null;
      }
      this.tlsCertificateFeedbackRef.set(null);
    }
  }
  showTlsSaveFeedback(state) {
    this.tlsSaveFeedbackRef.set(state);
    this.tlsSaveFeedbackTimer = setTimeout(() => {
      this.tlsSaveFeedbackRef.set(null);
      this.tlsSaveFeedbackTimer = null;
    }, 1e3);
  }
  clearTlsSaveFeedback() {
    if (this.tlsSaveFeedbackTimer) {
      clearTimeout(this.tlsSaveFeedbackTimer);
      this.tlsSaveFeedbackTimer = null;
    }
    this.tlsSaveFeedbackRef.set(null);
  }
  static \u0275fac = function OperatorWorkspaceStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorWorkspaceStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OperatorWorkspaceStore, factory: _OperatorWorkspaceStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorWorkspaceStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  OperatorWorkspaceStore
};
//# sourceMappingURL=chunk-AQFVTIQT.js.map
