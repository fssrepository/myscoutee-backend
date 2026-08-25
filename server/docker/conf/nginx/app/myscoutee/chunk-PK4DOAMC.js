import {
  BaseRouteModeService,
  HttpDeploymentConfigurationService,
  LocalDeploymentConfigurationService
} from "./chunk-7MTG4XZU.js";
import {
  DEFAULT_DEPLOYMENT_BRANDING,
  DEFAULT_DEPLOYMENT_CONFIGURATION,
  DEFAULT_DEPLOYMENT_PRIVACY_CONTACT,
  DEFAULT_DEPLOYMENT_SOCIAL_LINKS,
  DEPLOYMENT_THEME_PRESETS,
  OperatorConfigurationMapper
} from "./chunk-XQACYBVS.js";
import {
  DOCUMENT,
  Injectable,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/base/services/deployment-configuration.service.ts
var DEPLOYMENT_CONFIGURATION_ROUTE = "/deployment/configuration";
var DeploymentConfigurationService = class _DeploymentConfigurationService extends BaseRouteModeService {
  documentRef = inject(DOCUMENT);
  localService = inject(LocalDeploymentConfigurationService);
  httpService = inject(HttpDeploymentConfigurationService);
  brandingRef = signal(structuredClone(DEFAULT_DEPLOYMENT_BRANDING), ...ngDevMode ? [{ debugName: "brandingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  socialLinksRef = signal(structuredClone(DEFAULT_DEPLOYMENT_SOCIAL_LINKS), ...ngDevMode ? [{ debugName: "socialLinksRef" }] : (
    /* istanbul ignore next */
    []
  ));
  privacyContactRef = signal(structuredClone(DEFAULT_DEPLOYMENT_PRIVACY_CONTACT), ...ngDevMode ? [{ debugName: "privacyContactRef" }] : (
    /* istanbul ignore next */
    []
  ));
  loadingRef = signal(false, ...ngDevMode ? [{ debugName: "loadingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  loadPromise = null;
  manifestObjectUrl = null;
  branding = this.brandingRef.asReadonly();
  socialLinks = this.socialLinksRef.asReadonly();
  privacyContact = this.privacyContactRef.asReadonly();
  loading = this.loadingRef.asReadonly();
  ngOnDestroy() {
    this.revokeManifestObjectUrl();
  }
  initialize() {
    return this.load();
  }
  async reload() {
    this.loadPromise = null;
    return this.load();
  }
  applyBranding(value) {
    const branding = this.normalize(value);
    this.brandingRef.set(branding);
    this.applyDocumentBranding(branding);
    return structuredClone(branding);
  }
  applySocialLinks(value) {
    const socialLinks = OperatorConfigurationMapper.socialLinks(value);
    this.socialLinksRef.set(socialLinks);
    return structuredClone(socialLinks);
  }
  applyPrivacyContact(value) {
    const privacyContact = OperatorConfigurationMapper.privacyContact(value);
    this.privacyContactRef.set(privacyContact);
    return structuredClone(privacyContact);
  }
  async load() {
    if (!this.loadPromise) {
      this.loadingRef.set(true);
      this.loadPromise = this.configurationService().loadBranding().catch(() => structuredClone(DEFAULT_DEPLOYMENT_CONFIGURATION)).then((value) => this.applyConfiguration(value)).finally(() => {
        this.loadingRef.set(false);
      });
    }
    return structuredClone(await this.loadPromise);
  }
  applyConfiguration(value) {
    this.applySocialLinks(value.socialLinks);
    this.applyPrivacyContact(value.privacyContact);
    return this.applyBranding(value);
  }
  configurationService() {
    return this.resolveRouteService(DEPLOYMENT_CONFIGURATION_ROUTE, this.localService, this.httpService);
  }
  normalize(value) {
    const productName = `${value?.productName ?? ""}`.trim().slice(0, 80) || DEFAULT_DEPLOYMENT_BRANDING.productName;
    const homeLabel = `${value?.homeLabel ?? ""}`.trim().slice(0, 120) || productName;
    const themePreset = DEPLOYMENT_THEME_PRESETS.includes(value?.themePreset) ? value.themePreset : DEFAULT_DEPLOYMENT_BRANDING.themePreset;
    const logoCharacterIndex = this.logoCharacterIndex(value?.logoCharacterIndex, productName);
    return {
      productName,
      homeLabel,
      logoUrl: this.safeLogoUrl(value?.logoUrl),
      logoCharacterIndex,
      themePreset,
      revision: Math.max(0, Math.trunc(Number(value?.revision) || 0))
    };
  }
  logoCharacterIndex(value, productName) {
    if (value === null || value === void 0) {
      return DEFAULT_DEPLOYMENT_BRANDING.logoCharacterIndex;
    }
    const characterCount = Array.from(productName).length;
    if (!Number.isInteger(value) || value < -1 || value >= characterCount) {
      throw new Error("deployment.configuration.branding.logo.character.index.invalid");
    }
    return value;
  }
  safeLogoUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized) {
      return "";
    }
    if (normalized.startsWith("assets/") || normalized.startsWith("/") || /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(normalized)) {
      return normalized;
    }
    try {
      const url = new URL(normalized);
      return url.protocol === "https:" && !url.username && !url.password ? url.toString() : DEFAULT_DEPLOYMENT_BRANDING.logoUrl;
    } catch {
      return DEFAULT_DEPLOYMENT_BRANDING.logoUrl;
    }
  }
  applyDocumentBranding(branding) {
    const documentElement = this.documentRef.documentElement;
    documentElement.dataset["deploymentTheme"] = branding.themePreset.toLowerCase();
    this.documentRef.title = branding.productName;
    this.setMetaContent('meta[name="description"]', branding.homeLabel);
    this.setMetaContent('meta[property="og:title"]', branding.productName);
    this.setMetaContent('meta[property="og:site_name"]', branding.productName);
    this.setMetaContent('meta[property="og:description"]', branding.homeLabel);
    const canonicalUrl = this.deploymentRootUrl();
    this.setMetaContent('meta[property="og:url"]', canonicalUrl);
    this.setLinkHref('link[rel="canonical"]', canonicalUrl);
    const metadataLogoUrl = this.absoluteLogoUrl(branding.logoUrl);
    const logoMediaType = this.logoMediaType(branding.logoUrl);
    this.setMetaContent('meta[property="og:image"]', metadataLogoUrl);
    this.setMetaContent('meta[property="og:image:secure_url"]', metadataLogoUrl.startsWith("https://") ? metadataLogoUrl : "");
    this.setMetaContent('meta[property="og:image:type"]', logoMediaType);
    this.setMetaContent('meta[property="og:image:alt"]', metadataLogoUrl ? `${branding.productName} logo` : "");
    this.setLinkHref('link[rel~="icon"]', branding.logoUrl);
    this.setLinkType('link[rel~="icon"]', logoMediaType);
    this.setLinkHref('link[rel="apple-touch-icon"]', branding.logoUrl);
    const deploymentThemeColor = this.documentRef.defaultView?.getComputedStyle(documentElement).getPropertyValue("--deployment-brand-primary").trim() || "#7446f2";
    const themeColor = this.documentRef.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = deploymentThemeColor;
    }
    this.applyWebManifestBranding(branding, deploymentThemeColor);
    this.publishServiceWorkerBranding(branding);
  }
  applyWebManifestBranding(branding, themeColor) {
    const manifestLink = this.documentRef.querySelector('link[rel="manifest"]');
    const windowRef = this.documentRef.defaultView;
    if (!manifestLink || !windowRef || typeof windowRef.URL?.createObjectURL !== "function" || typeof windowRef.Blob !== "function") {
      return;
    }
    const logoUrl = this.absoluteLogoUrl(branding.logoUrl);
    const logoMediaType = logoUrl ? this.logoMediaType(branding.logoUrl) || "image/png" : "";
    const manifest = {
      name: branding.productName,
      short_name: Array.from(branding.productName).slice(0, 24).join(""),
      description: branding.homeLabel,
      display: "standalone",
      orientation: "portrait",
      scope: "./",
      start_url: "./",
      background_color: "#f5f6fb",
      theme_color: themeColor,
      icons: logoUrl ? [
        {
          src: logoUrl,
          sizes: "192x192",
          type: logoMediaType,
          purpose: "any maskable"
        },
        {
          src: logoUrl,
          sizes: "512x512",
          type: logoMediaType,
          purpose: "any maskable"
        }
      ] : []
    };
    const nextObjectUrl = windowRef.URL.createObjectURL(new windowRef.Blob([JSON.stringify(manifest)], { type: "application/manifest+json" }));
    this.revokeManifestObjectUrl();
    this.manifestObjectUrl = nextObjectUrl;
    manifestLink.href = nextObjectUrl;
  }
  revokeManifestObjectUrl() {
    if (!this.manifestObjectUrl) {
      return;
    }
    const urlApi = this.documentRef.defaultView?.URL;
    if (typeof urlApi?.revokeObjectURL === "function") {
      urlApi.revokeObjectURL(this.manifestObjectUrl);
    }
    this.manifestObjectUrl = null;
  }
  publishServiceWorkerBranding(branding) {
    const serviceWorker = this.documentRef.defaultView?.navigator.serviceWorker;
    if (!serviceWorker) {
      return;
    }
    const message = {
      type: "DEPLOYMENT_BRANDING",
      branding: {
        productName: branding.productName,
        homeLabel: branding.homeLabel,
        logoUrl: this.absoluteLogoUrl(branding.logoUrl)
      }
    };
    const controller = serviceWorker.controller;
    controller?.postMessage(message);
    void serviceWorker.ready.then((registration) => {
      const worker = registration.active ?? registration.waiting ?? registration.installing;
      if (worker && worker !== controller) {
        worker.postMessage(message);
      }
    }).catch(() => void 0);
  }
  setMetaContent(selector, content) {
    const meta = this.documentRef.querySelector(selector);
    if (meta) {
      meta.content = content;
    }
  }
  setLinkHref(selector, href) {
    const link = this.documentRef.querySelector(selector);
    if (link) {
      if (href) {
        link.setAttribute("href", href);
      } else {
        link.removeAttribute("href");
      }
    }
  }
  setLinkType(selector, type) {
    const link = this.documentRef.querySelector(selector);
    if (!link) {
      return;
    }
    if (type) {
      link.type = type;
    } else {
      link.removeAttribute("type");
    }
  }
  absoluteLogoUrl(logoUrl) {
    if (!logoUrl) {
      return "";
    }
    if (/^data:image\//i.test(logoUrl)) {
      return logoUrl;
    }
    try {
      return new URL(logoUrl, this.documentRef.baseURI).toString();
    } catch {
      return logoUrl;
    }
  }
  deploymentRootUrl() {
    try {
      return new URL("/", this.documentRef.baseURI).toString();
    } catch {
      return this.documentRef.baseURI;
    }
  }
  logoMediaType(logoUrl) {
    const dataMediaType = /^data:(image\/(?:png|jpeg|webp|gif));base64,/i.exec(logoUrl)?.[1];
    if (dataMediaType) {
      return dataMediaType.toLowerCase();
    }
    const path = logoUrl.split(/[?#]/, 1)[0]?.toLowerCase() ?? "";
    if (path.endsWith(".png")) {
      return "image/png";
    }
    if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
      return "image/jpeg";
    }
    if (path.endsWith(".webp")) {
      return "image/webp";
    }
    if (path.endsWith(".gif")) {
      return "image/gif";
    }
    if (path.endsWith(".ico")) {
      return "image/x-icon";
    }
    return "";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275DeploymentConfigurationService_BaseFactory;
    return function DeploymentConfigurationService_Factory(__ngFactoryType__) {
      return (\u0275DeploymentConfigurationService_BaseFactory || (\u0275DeploymentConfigurationService_BaseFactory = \u0275\u0275getInheritedFactory(_DeploymentConfigurationService)))(__ngFactoryType__ || _DeploymentConfigurationService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DeploymentConfigurationService, factory: _DeploymentConfigurationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeploymentConfigurationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  DeploymentConfigurationService
};
//# sourceMappingURL=chunk-PK4DOAMC.js.map
