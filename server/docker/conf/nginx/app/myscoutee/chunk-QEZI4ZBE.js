import {
  IndicatorComponent
} from "./chunk-FOAFZS65.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  ViewContainerRef,
  effect,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdirectiveInject
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/directives/lazy-bg-image.directive.ts
var LazyBgImageDirective = class _LazyBgImageDirective {
  elementRef;
  renderer;
  appLazyBgImage = null;
  appLazyHtmlImages = false;
  appLazyImageFallback = null;
  static PRELOAD_ROOT_MARGIN_PX = 0;
  static PRELOAD_ROOT_MARGIN = "0px 0px";
  static IMAGE_LOAD_TIMEOUT_MS = 3e3;
  static SEEDED_IMAGE_REF_PREFIX = "help-seeded-image:";
  static SEEDED_IMAGE_ASSET_ROOT = "assets/help-center/explanations";
  static HTML_IMAGE_PLACEHOLDER_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  static HTML_IMAGE_PLACEHOLDER_LAZY_SRC_MARKER = "#lazy-src=";
  static DEFAULT_IMAGE_FALLBACK_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <rect width="960" height="540" rx="36" fill="#edf4fd"/>
  <rect x="36" y="36" width="888" height="468" rx="28" fill="#f7fbff" stroke="#c8d8ee" stroke-width="4" stroke-dasharray="18 14"/>
  <path d="M352 334l78-92 64 68 46-48 96 112H312z" fill="#c7d8ee"/>
  <circle cx="594" cy="198" r="38" fill="#d8e5f5"/>
  <rect x="300" y="146" width="360" height="250" rx="28" fill="none" stroke="#91abc9" stroke-width="20"/>
  <text x="480" y="444" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#5c7595">No image</text>
</svg>
`)}`;
  static loadedUrls = /* @__PURE__ */ new Set();
  static loadingPromises = /* @__PURE__ */ new Map();
  static localizedSvgUrls = /* @__PURE__ */ new Map();
  static localizedSvgPromises = /* @__PURE__ */ new Map();
  static nonSvgUrls = /* @__PURE__ */ new Set();
  i18n = inject(I18nService);
  viewContainerRef = inject(ViewContainerRef);
  loadingClass = "lazy-bg-loading";
  loadedClass = "lazy-bg-loaded";
  errorClass = "lazy-bg-error";
  observer = null;
  htmlImageObserver = null;
  backgroundVisibilityCheckId = null;
  htmlImageFrameSpinners = /* @__PURE__ */ new Map();
  htmlImageTimeouts = /* @__PURE__ */ new Map();
  hasLoaded = false;
  isViewReady = false;
  currentUrl = null;
  appliedUrl = null;
  i18nRevisionEffect = effect(() => {
    this.i18n.revision();
    if (!this.isViewReady) {
      return;
    }
    this.refreshHtmlImages();
    if (this.shouldManageBackground() && this.currentUrl) {
      this.hasLoaded = false;
      this.setupObserver();
    }
  }, ...ngDevMode ? [{ debugName: "i18nRevisionEffect" }] : (
    /* istanbul ignore next */
    []
  ));
  htmlImageLoadHandler = (event) => {
    const image = event.target instanceof HTMLImageElement ? event.target : null;
    if (!image) {
      return;
    }
    this.setHtmlImageLoadingState(image, false);
  };
  htmlImageErrorHandler = (event) => {
    const image = event.target instanceof HTMLImageElement ? event.target : null;
    if (!image) {
      return;
    }
    this.applyHtmlImageFallback(image);
  };
  constructor(elementRef, renderer) {
    this.elementRef = elementRef;
    this.renderer = renderer;
  }
  static preloadImageUrl(url, options = {}) {
    const normalizedUrl = `${url ?? ""}`.trim();
    if (!normalizedUrl) {
      return Promise.resolve(false);
    }
    const cacheKey = options.crossOrigin === void 0 ? normalizedUrl : `${options.crossOrigin ?? ""}:${normalizedUrl}`;
    if (_LazyBgImageDirective.loadedUrls.has(cacheKey)) {
      return Promise.resolve(true);
    }
    const existingPromise = _LazyBgImageDirective.loadingPromises.get(cacheKey);
    if (existingPromise) {
      return _LazyBgImageDirective.withImageLoadTimeout(existingPromise, false, () => _LazyBgImageDirective.loadingPromises.delete(cacheKey));
    }
    const loadingPromise = new Promise((resolve) => {
      const img = new Image();
      let isSettled = false;
      let timeoutId = null;
      const finish = (loaded) => {
        if (isSettled) {
          return;
        }
        isSettled = true;
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        img.onload = null;
        img.onerror = null;
        if (loaded) {
          _LazyBgImageDirective.loadedUrls.add(cacheKey);
        }
        _LazyBgImageDirective.loadingPromises.delete(cacheKey);
        resolve(loaded);
      };
      timeoutId = window.setTimeout(() => finish(false), _LazyBgImageDirective.IMAGE_LOAD_TIMEOUT_MS);
      if (options.crossOrigin !== void 0) {
        img.crossOrigin = options.crossOrigin ?? "";
      }
      img.onload = () => {
        const decodePromise = typeof img.decode === "function" ? img.decode().catch(() => void 0) : Promise.resolve();
        decodePromise.then(() => finish(true));
      };
      img.onerror = () => finish(false);
      img.decoding = "async";
      img.loading = "eager";
      img.src = normalizedUrl;
    });
    _LazyBgImageDirective.loadingPromises.set(cacheKey, loadingPromise);
    return loadingPromise;
  }
  static withImageLoadTimeout(promise, fallbackValue, onTimeout) {
    return new Promise((resolve) => {
      let isSettled = false;
      let timeoutId = null;
      const finish = (value) => {
        if (isSettled) {
          return;
        }
        isSettled = true;
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        resolve(value);
      };
      timeoutId = window.setTimeout(() => {
        onTimeout?.();
        finish(fallbackValue);
      }, _LazyBgImageDirective.IMAGE_LOAD_TIMEOUT_MS);
      promise.then(finish, () => finish(fallbackValue));
    });
  }
  ngAfterViewInit() {
    this.isViewReady = true;
    this.currentUrl = this.normalizeUrl(this.appLazyBgImage);
    this.syncHtmlImageMode();
    this.syncBackgroundMode();
  }
  ngOnChanges(changes) {
    const change = changes["appLazyBgImage"];
    if (change) {
      const nextUrl = this.normalizeUrl(change.currentValue);
      if (nextUrl !== this.currentUrl) {
        this.currentUrl = nextUrl;
        this.hasLoaded = false;
      }
    }
    if (!this.isViewReady) {
      return;
    }
    this.syncHtmlImageMode();
    this.syncBackgroundMode();
  }
  ngOnDestroy() {
    this.i18nRevisionEffect.destroy();
    this.disconnectObserver();
    this.cancelBackgroundVisibilityCheck();
    this.disconnectHtmlImageObserver();
    this.detachHtmlImageHandlers();
    this.clearHtmlImageLoadTimeouts();
    this.destroyHtmlImageFrameSpinners();
  }
  syncBackgroundMode() {
    if (this.shouldManageBackground()) {
      this.setupObserver();
      return;
    }
    this.disconnectObserver();
    this.clearBackgroundState();
  }
  setupObserver() {
    this.disconnectObserver();
    this.cancelBackgroundVisibilityCheck();
    this.renderer.addClass(this.elementRef.nativeElement, this.loadingClass);
    this.renderer.removeClass(this.elementRef.nativeElement, this.loadedClass);
    this.renderer.removeClass(this.elementRef.nativeElement, this.errorClass);
    const url = this.currentUrl;
    if (!url) {
      this.applyLoadError();
      return;
    }
    const renderedUrl = this.renderedImageUrl(url);
    if (_LazyBgImageDirective.loadedUrls.has(renderedUrl)) {
      this.applyBackground(renderedUrl);
      return;
    }
    if (this.hasLoaded && this.appliedUrl === renderedUrl) {
      this.renderer.removeClass(this.elementRef.nativeElement, this.loadingClass);
      this.renderer.addClass(this.elementRef.nativeElement, this.loadedClass);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      this.loadBackgroundUrl(url);
      return;
    }
    this.observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }
      this.loadBackgroundUrl(url);
      this.disconnectObserver();
    }, { rootMargin: _LazyBgImageDirective.PRELOAD_ROOT_MARGIN });
    this.observer.observe(this.elementRef.nativeElement);
    this.scheduleVisibleBackgroundLoad(url);
  }
  loadBackgroundUrl(url) {
    _LazyBgImageDirective.withImageLoadTimeout(this.loadRenderableUrl(url), null).then((loadedUrl) => {
      if (this.currentUrl !== url) {
        return;
      }
      if (loadedUrl) {
        this.applyBackground(loadedUrl);
        return;
      }
      this.applyBackgroundFallback();
    });
  }
  scheduleVisibleBackgroundLoad(url) {
    this.cancelBackgroundVisibilityCheck();
    this.backgroundVisibilityCheckId = window.setTimeout(() => {
      this.backgroundVisibilityCheckId = null;
      if (this.currentUrl !== url || this.hasLoaded || !this.isElementWithinPreloadRange()) {
        return;
      }
      this.loadBackgroundUrl(url);
      this.disconnectObserver();
    });
  }
  cancelBackgroundVisibilityCheck() {
    if (this.backgroundVisibilityCheckId === null) {
      return;
    }
    window.clearTimeout(this.backgroundVisibilityCheckId);
    this.backgroundVisibilityCheckId = null;
  }
  isElementWithinPreloadRange() {
    let visibleRect = this.elementRef.nativeElement.getBoundingClientRect();
    if (visibleRect.width <= 0 || visibleRect.height <= 0) {
      return false;
    }
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const margin = _LazyBgImageDirective.PRELOAD_ROOT_MARGIN_PX;
    visibleRect = this.intersectRects(visibleRect, {
      top: -margin,
      right: viewportWidth + margin,
      bottom: viewportHeight + margin,
      left: -margin
    });
    if (visibleRect.width <= 0 || visibleRect.height <= 0) {
      return false;
    }
    let parent = this.elementRef.nativeElement.parentElement;
    while (parent && parent !== document.documentElement) {
      if (this.clipsOverflow(parent)) {
        visibleRect = this.intersectRects(visibleRect, parent.getBoundingClientRect());
        if (visibleRect.width <= 0 || visibleRect.height <= 0) {
          return false;
        }
      }
      parent = parent.parentElement;
    }
    return true;
  }
  intersectRects(first, second) {
    const left = Math.max(first.left, second.left);
    const right = Math.min(first.right, second.right);
    const top = Math.max(first.top, second.top);
    const bottom = Math.min(first.bottom, second.bottom);
    return {
      top,
      right,
      bottom,
      left,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
      x: left,
      y: top,
      toJSON: () => ({ top, right, bottom, left })
    };
  }
  clipsOverflow(element) {
    const style = window.getComputedStyle(element);
    return this.clipsOverflowValue(style.overflowX) || this.clipsOverflowValue(style.overflowY);
  }
  clipsOverflowValue(value) {
    return value === "auto" || value === "scroll" || value === "hidden" || value === "clip";
  }
  applyBackground(url) {
    if (this.hasLoaded && this.appliedUrl === url) {
      return;
    }
    this.cancelBackgroundVisibilityCheck();
    this.renderer.setStyle(this.elementRef.nativeElement, "background-image", `url("${url}")`);
    this.renderer.removeClass(this.elementRef.nativeElement, this.errorClass);
    this.renderer.removeClass(this.elementRef.nativeElement, this.loadingClass);
    this.renderer.addClass(this.elementRef.nativeElement, this.loadedClass);
    _LazyBgImageDirective.loadedUrls.add(url);
    this.appliedUrl = url;
    this.hasLoaded = true;
  }
  applyLoadError() {
    this.cancelBackgroundVisibilityCheck();
    this.renderer.removeStyle(this.elementRef.nativeElement, "background-image");
    this.renderer.removeClass(this.elementRef.nativeElement, this.loadingClass);
    this.renderer.removeClass(this.elementRef.nativeElement, this.loadedClass);
    this.renderer.addClass(this.elementRef.nativeElement, this.errorClass);
    this.appliedUrl = null;
    this.hasLoaded = false;
  }
  applyBackgroundFallback() {
    this.cancelBackgroundVisibilityCheck();
    const fallbackUrl = this.imageFallbackUrl();
    this.renderer.setStyle(this.elementRef.nativeElement, "background-image", `url("${fallbackUrl}")`);
    this.renderer.removeClass(this.elementRef.nativeElement, this.loadingClass);
    this.renderer.addClass(this.elementRef.nativeElement, this.loadedClass);
    this.renderer.addClass(this.elementRef.nativeElement, this.errorClass);
    this.appliedUrl = fallbackUrl;
    this.hasLoaded = true;
  }
  clearBackgroundState() {
    this.cancelBackgroundVisibilityCheck();
    this.renderer.removeStyle(this.elementRef.nativeElement, "background-image");
    this.renderer.removeClass(this.elementRef.nativeElement, this.loadingClass);
    this.renderer.removeClass(this.elementRef.nativeElement, this.loadedClass);
    this.renderer.removeClass(this.elementRef.nativeElement, this.errorClass);
    this.appliedUrl = null;
    this.hasLoaded = false;
  }
  disconnectObserver() {
    this.observer?.disconnect();
    this.observer = null;
  }
  syncHtmlImageMode() {
    if (!this.htmlImagesEnabled()) {
      this.disconnectHtmlImageObserver();
      this.detachHtmlImageHandlers();
      return;
    }
    this.refreshHtmlImages();
    this.observeHtmlImages();
  }
  observeHtmlImages() {
    if (typeof MutationObserver === "undefined") {
      return;
    }
    this.htmlImageObserver?.disconnect();
    this.htmlImageObserver = new MutationObserver(() => this.refreshHtmlImages());
    this.htmlImageObserver.observe(this.elementRef.nativeElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "data-lazy-src"]
    });
  }
  disconnectHtmlImageObserver() {
    this.htmlImageObserver?.disconnect();
    this.htmlImageObserver = null;
  }
  refreshHtmlImages() {
    this.cleanupDetachedHtmlImageFrameSpinners();
    for (const image of this.htmlImages()) {
      if (image.dataset["lazyImageWired"] !== "true") {
        image.dataset["lazyImageWired"] = "true";
        image.addEventListener("load", this.htmlImageLoadHandler);
        image.addEventListener("error", this.htmlImageErrorHandler);
      }
      if (!image.hasAttribute("loading")) {
        image.loading = "lazy";
      }
      if (!image.hasAttribute("decoding")) {
        image.decoding = "async";
      }
      const sourceUrl = this.htmlImageSourceUrl(image);
      const currentSrc = image.getAttribute("src")?.trim() ?? "";
      if (!sourceUrl) {
        this.applyHtmlImageFallback(image);
        continue;
      }
      image.dataset["lazyImageSourceUrl"] = sourceUrl;
      if (this.localizeHtmlSvgImage(image, sourceUrl)) {
        this.setHtmlImageLoadingState(image, true);
        continue;
      }
      const renderedSourceUrl = this.renderedImageUrl(sourceUrl);
      if (renderedSourceUrl && renderedSourceUrl !== currentSrc) {
        image.src = renderedSourceUrl;
      }
      if (image.dataset["lazyImageManagedSrc"] !== renderedSourceUrl) {
        image.dataset["lazyImageManagedSrc"] = renderedSourceUrl;
        if (renderedSourceUrl !== this.imageFallbackUrl()) {
          delete image.dataset["lazyImageFallbackActive"];
          this.setHtmlImageFallbackState(image, false);
        }
      }
      if (image.complete) {
        if (image.naturalWidth > 0 || image.dataset["lazyImageFallbackActive"] === "true") {
          this.setHtmlImageLoadingState(image, false);
        } else {
          this.applyHtmlImageFallback(image);
        }
      } else {
        this.setHtmlImageLoadingState(image, true);
      }
    }
  }
  applyHtmlImageFallback(image) {
    if (image.dataset["lazyImageFallbackActive"] === "true") {
      this.setHtmlImageLoadingState(image, false);
      this.setHtmlImageFallbackState(image, true);
      return;
    }
    const fallbackUrl = this.imageFallbackUrl();
    image.dataset["lazyImageFallbackActive"] = "true";
    image.dataset["lazyImageOriginalSrc"] = this.htmlImageSourceUrl(image);
    image.dataset["lazyImageManagedSrc"] = fallbackUrl;
    this.setHtmlImageLoadingState(image, false);
    this.setHtmlImageFallbackState(image, true);
    image.alt = image.alt?.trim() || "No image";
    image.src = fallbackUrl;
  }
  setHtmlImageLoadingState(image, loading) {
    image.classList.toggle("lazy-image-loading", loading);
    image.classList.toggle("lazy-image-loaded", !loading);
    const frame = this.htmlImageFrame(image);
    frame?.classList.toggle("lazy-image-frame-loading", loading);
    frame?.classList.toggle("lazy-image-frame-loaded", !loading);
    if (loading) {
      this.startHtmlImageLoadTimeout(image);
      this.ensureHtmlImageFrameSpinner(frame);
    } else {
      this.clearHtmlImageLoadTimeout(image);
      this.destroyHtmlImageFrameSpinner(frame);
    }
  }
  startHtmlImageLoadTimeout(image) {
    this.clearHtmlImageLoadTimeout(image);
    const expectedSrc = image.dataset["lazyImageManagedSrc"] || image.currentSrc || image.src;
    const timeoutId = window.setTimeout(() => {
      this.htmlImageTimeouts.delete(image);
      if (!image.isConnected) {
        return;
      }
      if (image.complete && image.naturalWidth > 0) {
        this.setHtmlImageLoadingState(image, false);
        return;
      }
      const activeSrc = image.dataset["lazyImageManagedSrc"] || image.currentSrc || image.src;
      if (expectedSrc && activeSrc && activeSrc !== expectedSrc) {
        this.startHtmlImageLoadTimeout(image);
        return;
      }
      if (!expectedSrc || activeSrc === expectedSrc) {
        this.applyHtmlImageFallback(image);
      }
    }, _LazyBgImageDirective.IMAGE_LOAD_TIMEOUT_MS);
    this.htmlImageTimeouts.set(image, timeoutId);
  }
  clearHtmlImageLoadTimeout(image) {
    const timeoutId = this.htmlImageTimeouts.get(image);
    if (timeoutId === void 0) {
      return;
    }
    window.clearTimeout(timeoutId);
    this.htmlImageTimeouts.delete(image);
  }
  clearHtmlImageLoadTimeouts() {
    for (const timeoutId of this.htmlImageTimeouts.values()) {
      window.clearTimeout(timeoutId);
    }
    this.htmlImageTimeouts.clear();
  }
  setHtmlImageFallbackState(image, active) {
    image.classList.toggle("lazy-image-fallback-active", active);
    this.htmlImageFrame(image)?.classList.toggle("lazy-image-frame-fallback-active", active);
  }
  clearHtmlImageState(image) {
    const frame = this.htmlImageFrame(image);
    image.classList.remove("lazy-image-loading", "lazy-image-loaded", "lazy-image-fallback-active");
    frame?.classList.remove("lazy-image-frame-loading", "lazy-image-frame-loaded", "lazy-image-frame-fallback-active");
    this.clearHtmlImageLoadTimeout(image);
    this.destroyHtmlImageFrameSpinner(frame);
  }
  htmlImageFrame(image) {
    const figure = image.closest("figure");
    if (figure instanceof HTMLElement && this.elementRef.nativeElement.contains(figure)) {
      return figure;
    }
    return image.parentElement;
  }
  ensureHtmlImageFrameSpinner(frame) {
    if (!frame || this.htmlImageFrameSpinners.has(frame)) {
      return;
    }
    const spinnerRef = this.viewContainerRef.createComponent(IndicatorComponent);
    spinnerRef.setInput("kind", "spinner-ring");
    spinnerRef.setInput("size", "sm");
    spinnerRef.setInput("state", "loading");
    this.renderer.addClass(spinnerRef.location.nativeElement, "lazy-image-frame-spinner");
    this.renderer.appendChild(frame, spinnerRef.location.nativeElement);
    spinnerRef.changeDetectorRef.detectChanges();
    this.htmlImageFrameSpinners.set(frame, spinnerRef);
  }
  destroyHtmlImageFrameSpinner(frame) {
    if (!frame) {
      return;
    }
    const spinnerRef = this.htmlImageFrameSpinners.get(frame);
    if (!spinnerRef) {
      return;
    }
    spinnerRef.destroy();
    this.htmlImageFrameSpinners.delete(frame);
  }
  cleanupDetachedHtmlImageFrameSpinners() {
    for (const frame of Array.from(this.htmlImageFrameSpinners.keys())) {
      if (!this.elementRef.nativeElement.contains(frame)) {
        this.destroyHtmlImageFrameSpinner(frame);
      }
    }
  }
  destroyHtmlImageFrameSpinners() {
    for (const spinnerRef of this.htmlImageFrameSpinners.values()) {
      spinnerRef.destroy();
    }
    this.htmlImageFrameSpinners.clear();
  }
  htmlImageSourceUrl(image) {
    const lazySrc = image.getAttribute("data-lazy-src")?.trim() ?? "";
    if (lazySrc) {
      return lazySrc;
    }
    const src = image.getAttribute("src")?.trim() ?? "";
    const placeholderLazySrc = this.placeholderLazyImageSourceUrl(src);
    if (placeholderLazySrc) {
      return placeholderLazySrc;
    }
    if (src === _LazyBgImageDirective.HTML_IMAGE_PLACEHOLDER_URL) {
      return "";
    }
    const managedSourceUrl = image.dataset["lazyImageSourceUrl"]?.trim() ?? "";
    if (managedSourceUrl && (!src || src === image.dataset["lazyImageManagedSrc"] || this.isGeneratedSvgObjectUrl(src))) {
      return managedSourceUrl;
    }
    return src;
  }
  placeholderLazyImageSourceUrl(src) {
    if (!src.startsWith(_LazyBgImageDirective.HTML_IMAGE_PLACEHOLDER_URL)) {
      return "";
    }
    const markerIndex = src.indexOf(_LazyBgImageDirective.HTML_IMAGE_PLACEHOLDER_LAZY_SRC_MARKER);
    if (markerIndex < 0) {
      return "";
    }
    const encodedValue = src.slice(markerIndex + _LazyBgImageDirective.HTML_IMAGE_PLACEHOLDER_LAZY_SRC_MARKER.length);
    try {
      return decodeURIComponent(encodedValue).trim();
    } catch {
      return "";
    }
  }
  localizeHtmlSvgImage(image, src) {
    const currentSrc = image.getAttribute("src")?.trim() ?? "";
    const originalSrc = this.isGeneratedSvgObjectUrl(src) ? image.dataset["lazyImageSvgOriginalSrc"] || src : src;
    if (this.isGeneratedSvgObjectUrl(src)) {
      const revision2 = `${this.i18n.revision()}`;
      if (image.dataset["lazyImageSvgRevision"] === revision2) {
        return false;
      }
    }
    if (!this.shouldTrySvgLocalization(image, originalSrc)) {
      return false;
    }
    const revision = `${this.i18n.revision()}`;
    if (image.dataset["lazyImageSvgOriginalSrc"] === originalSrc && image.dataset["lazyImageSvgRevision"] === revision && this.isGeneratedSvgObjectUrl(currentSrc)) {
      return false;
    }
    image.dataset["lazyImageSvgOriginalSrc"] = originalSrc;
    image.dataset["lazyImageSvgRevision"] = revision;
    this.prepareRenderableImageUrl(originalSrc, this.forceSvgLocalization(image)).then((localizedUrl) => {
      if (!localizedUrl || image.dataset["lazyImageSvgOriginalSrc"] !== originalSrc || image.dataset["lazyImageFallbackActive"] === "true") {
        return;
      }
      if (localizedUrl === image.getAttribute("src")) {
        return;
      }
      image.dataset["lazyImageManagedSrc"] = localizedUrl;
      image.src = localizedUrl;
      this.setHtmlImageLoadingState(image, true);
    });
    return true;
  }
  detachHtmlImageHandlers() {
    for (const image of this.htmlImages()) {
      image.removeEventListener("load", this.htmlImageLoadHandler);
      image.removeEventListener("error", this.htmlImageErrorHandler);
      delete image.dataset["lazyImageWired"];
      this.clearHtmlImageState(image);
    }
  }
  htmlImages() {
    return Array.from(this.elementRef.nativeElement.querySelectorAll("img"));
  }
  shouldManageBackground() {
    return Boolean(this.currentUrl) || !this.htmlImagesEnabled();
  }
  normalizeUrl(url) {
    const trimmed = url?.trim();
    return trimmed ? trimmed : null;
  }
  async loadRenderableUrl(url) {
    const renderedUrl = await this.prepareRenderableImageUrl(url);
    const finalUrl = renderedUrl ?? this.resolveImageSourceUrl(url);
    return await this.preloadUrl(finalUrl) ? finalUrl : null;
  }
  renderedImageUrl(sourceUrl) {
    const resolvedUrl = this.resolveImageSourceUrl(sourceUrl);
    return _LazyBgImageDirective.localizedSvgUrls.get(this.localizedSvgCacheKey(resolvedUrl)) ?? resolvedUrl;
  }
  async prepareRenderableImageUrl(url, forceSvg = false) {
    const normalizedUrl = this.normalizeUrl(this.resolveImageSourceUrl(url));
    if (!normalizedUrl || !forceSvg && !this.maybeSvgUrl(normalizedUrl)) {
      return normalizedUrl;
    }
    if (!forceSvg && _LazyBgImageDirective.nonSvgUrls.has(normalizedUrl)) {
      return normalizedUrl;
    }
    const cacheKey = this.localizedSvgCacheKey(normalizedUrl);
    const cached = _LazyBgImageDirective.localizedSvgUrls.get(cacheKey);
    if (cached) {
      return cached;
    }
    const existingPromise = _LazyBgImageDirective.localizedSvgPromises.get(cacheKey);
    if (existingPromise) {
      return await existingPromise;
    }
    const promise = this.buildLocalizedSvgObjectUrl(normalizedUrl, forceSvg);
    _LazyBgImageDirective.localizedSvgPromises.set(cacheKey, promise);
    const localizedUrl = await promise;
    _LazyBgImageDirective.localizedSvgPromises.delete(cacheKey);
    if (localizedUrl) {
      _LazyBgImageDirective.localizedSvgUrls.set(cacheKey, localizedUrl);
      return localizedUrl;
    }
    if (!forceSvg) {
      _LazyBgImageDirective.nonSvgUrls.add(normalizedUrl);
    }
    return normalizedUrl;
  }
  async buildLocalizedSvgObjectUrl(url, forceSvg) {
    if (typeof fetch === "undefined" || typeof Blob === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) {
      return null;
    }
    try {
      const response = await fetch(url);
      if (!response.ok && response.status !== 0) {
        return null;
      }
      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
      const svgText = await response.text();
      if (!forceSvg && !contentType.includes("image/svg+xml") && !this.looksLikeSvg(svgText)) {
        return null;
      }
      const localizedSvg = this.localizeSvg(svgText);
      if (!localizedSvg) {
        return null;
      }
      return URL.createObjectURL(new Blob([localizedSvg], { type: "image/svg+xml" }));
    } catch {
      return null;
    }
  }
  localizeSvg(svgText) {
    if (!this.looksLikeSvg(svgText) || typeof DOMParser === "undefined" || typeof XMLSerializer === "undefined") {
      return null;
    }
    try {
      const document2 = new DOMParser().parseFromString(svgText, "image/svg+xml");
      const svg = document2.documentElement;
      if (!svg || svg.tagName.toLowerCase() !== "svg") {
        return null;
      }
      this.sanitizeSvg(svg);
      let changed = false;
      svg.querySelectorAll("[data-i18n-key]").forEach((element) => {
        const key = element.getAttribute("data-i18n-key")?.trim() ?? "";
        if (!key) {
          return;
        }
        const fallback = element.textContent?.trim() ?? "";
        const translated = this.i18n.translate(key, fallback);
        if (translated && translated !== element.textContent) {
          element.textContent = translated;
          changed = true;
        }
      });
      svg.querySelectorAll("[data-i18n-title-key]").forEach((element) => {
        const key = element.getAttribute("data-i18n-title-key")?.trim() ?? "";
        if (!key) {
          return;
        }
        const translated = this.i18n.translate(key, element.getAttribute("title") ?? "");
        if (translated) {
          element.setAttribute("title", translated);
          changed = true;
        }
      });
      return changed ? new XMLSerializer().serializeToString(document2) : svgText;
    } catch {
      return null;
    }
  }
  sanitizeSvg(svg) {
    svg.querySelectorAll("script, foreignObject").forEach((element) => element.remove());
    svg.querySelectorAll("*").forEach((element) => {
      for (const attribute of Array.from(element.attributes)) {
        const name = attribute.name.toLowerCase();
        const value = attribute.value.trim().toLowerCase();
        if (name.startsWith("on") || (name === "href" || name.endsWith(":href")) && value.startsWith("javascript:")) {
          element.removeAttribute(attribute.name);
        }
      }
    });
  }
  shouldTrySvgLocalization(image, url) {
    return this.forceSvgLocalization(image) || this.maybeSvgUrl(url) || this.isGeneratedSvgObjectUrl(url);
  }
  forceSvgLocalization(image) {
    return image.dataset["i18nSvg"] === "true" || image.getAttribute("data-i18n-svg") === "true";
  }
  maybeSvgUrl(url) {
    const normalized = this.resolveImageSourceUrl(url).trim().toLowerCase();
    return normalized.startsWith("data:image/svg+xml") || normalized.includes("image/svg+xml") || /\.svg(?:[?#]|$)/i.test(normalized) || normalized.startsWith("blob:");
  }
  isGeneratedSvgObjectUrl(url) {
    return url.startsWith("blob:") && Array.from(_LazyBgImageDirective.localizedSvgUrls.values()).includes(url);
  }
  looksLikeSvg(text) {
    return /^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(text);
  }
  localizedSvgCacheKey(url) {
    return `${this.i18n.revision()}::${url}`;
  }
  resolveImageSourceUrl(url) {
    const rawUrl = this.normalizeUrl(url) ?? "";
    const normalized = rawUrl.startsWith("unsafe:") ? rawUrl.slice("unsafe:".length) : rawUrl;
    if (!normalized.startsWith(_LazyBgImageDirective.SEEDED_IMAGE_REF_PREFIX)) {
      return normalized;
    }
    const ref = normalized.slice(_LazyBgImageDirective.SEEDED_IMAGE_REF_PREFIX.length);
    const parts = ref.split("/").map((part) => this.seededImagePathSegment(part)).filter(Boolean);
    if (parts.length < 3) {
      return normalized;
    }
    const [lang, context, section] = parts;
    return `${_LazyBgImageDirective.SEEDED_IMAGE_ASSET_ROOT}/${lang}/${context}/${section}.svg`;
  }
  seededImagePathSegment(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    return /^[a-z0-9-]+$/.test(normalized) ? normalized : "";
  }
  htmlImagesEnabled() {
    return this.coerceBoolean(this.appLazyHtmlImages);
  }
  coerceBoolean(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (value == null) {
      return false;
    }
    const normalized = `${value}`.trim().toLowerCase();
    return normalized !== "" && normalized !== "false" && normalized !== "0";
  }
  imageFallbackUrl() {
    return this.normalizeUrl(this.appLazyImageFallback) ?? _LazyBgImageDirective.DEFAULT_IMAGE_FALLBACK_URL;
  }
  preloadUrl(url) {
    return _LazyBgImageDirective.preloadImageUrl(url);
  }
  static \u0275fac = function LazyBgImageDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LazyBgImageDirective)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _LazyBgImageDirective, selectors: [["", "appLazyBgImage", ""]], inputs: { appLazyBgImage: "appLazyBgImage", appLazyHtmlImages: "appLazyHtmlImages", appLazyImageFallback: "appLazyImageFallback" }, features: [\u0275\u0275NgOnChangesFeature] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LazyBgImageDirective, [{
    type: Directive,
    args: [{
      selector: "[appLazyBgImage]",
      standalone: true
    }]
  }], () => [{ type: ElementRef }, { type: Renderer2 }], { appLazyBgImage: [{
    type: Input
  }], appLazyHtmlImages: [{
    type: Input
  }], appLazyImageFallback: [{
    type: Input
  }] });
})();

export {
  LazyBgImageDirective
};
//# sourceMappingURL=chunk-QEZI4ZBE.js.map
