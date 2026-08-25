import {
  LazyBgImageDirective
} from "./chunk-QEZI4ZBE.js";
import {
  IndicatorComponent,
  NG_VALUE_ACCESSOR
} from "./chunk-FOAFZS65.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  MediaService
} from "./chunk-QE3AUXWT.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import {
  CommonModule
} from "./chunk-J7IJFFQ2.js";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
  forwardRef,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreadContextLet,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/core/image-carousel/image-carousel.component.ts
var _c0 = ["carouselViewport"];
function ImageCarouselComponent_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Select a slot to upload an image");
    \u0275\u0275elementEnd();
  }
}
function ImageCarouselComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275element(1, "app-indicator", 13);
    \u0275\u0275elementEnd();
  }
}
function ImageCarouselComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275conditionalCreate(1, ImageCarouselComponent_Conditional_3_Conditional_1_Template, 2, 0, "span");
    \u0275\u0275conditionalCreate(2, ImageCarouselComponent_Conditional_3_Conditional_2_Template, 2, 0, "span", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    const slots_r2 = \u0275\u0275readContextLet(0);
    const previewUrl_r3 = ctx_r0.selectedPreviewUrl(slots_r2);
    \u0275\u0275classProp("is-empty", !previewUrl_r3);
    \u0275\u0275property("appLazyBgImage", previewUrl_r3 || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(!previewUrl_r3 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isSelectedPreviewUploading(slots_r2) ? 2 : -1);
  }
}
function ImageCarouselComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function ImageCarouselComponent_Conditional_5_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.showPreviousPage($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "chevron_left");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.isDisabled() || ctx_r0.uploadingSlotIndex !== null);
  }
}
function ImageCarouselComponent_For_10_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275element(1, "app-indicator", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("size", ctx_r0.compact ? "sm" : "md");
  }
}
function ImageCarouselComponent_For_10_For_2_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function ImageCarouselComponent_For_10_For_2_Conditional_5_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const slotIndex_r7 = \u0275\u0275nextContext(2).$implicit;
      const imageUrl_r8 = \u0275\u0275readContextLet(0);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.copySlot(imageUrl_r8, slotIndex_r7, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "content_copy");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "button", 24);
    \u0275\u0275listener("click", function ImageCarouselComponent_For_10_For_2_Conditional_5_Conditional_0_Template_button_click_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const slotIndex_r7 = \u0275\u0275nextContext(2).$implicit;
      const imageUrl_r8 = \u0275\u0275readContextLet(0);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.removeSlot(imageUrl_r8, slotIndex_r7, $event));
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "close");
    \u0275\u0275elementEnd()();
  }
}
function ImageCarouselComponent_For_10_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ImageCarouselComponent_For_10_For_2_Conditional_5_Conditional_0_Template, 6, 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(!ctx_r0.isDisabled() ? 0 : -1);
  }
}
function ImageCarouselComponent_For_10_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1, "+");
    \u0275\u0275elementEnd();
  }
}
function ImageCarouselComponent_For_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "article", 16)(2, "span", 17);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ImageCarouselComponent_For_10_For_2_Conditional_4_Template, 2, 1, "span", 18)(5, ImageCarouselComponent_For_10_For_2_Conditional_5_Template, 1, 1)(6, ImageCarouselComponent_For_10_For_2_Conditional_6_Template, 2, 0, "span", 19);
    \u0275\u0275elementStart(7, "input", 20, 1);
    \u0275\u0275listener("change", function ImageCarouselComponent_For_10_For_2_Template_input_change_7_listener($event) {
      const slotIndex_r7 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.uploadFromInput($event, slotIndex_r7));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 21);
    \u0275\u0275listener("click", function ImageCarouselComponent_For_10_For_2_Template_button_click_9_listener($event) {
      const slotIndex_r7 = \u0275\u0275restoreView(_r5).$implicit;
      const imageSlotInput_r9 = \u0275\u0275reference(8);
      const imageUrl_r8 = \u0275\u0275readContextLet(0);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openSlot(imageSlotInput_r9, slotIndex_r7, imageUrl_r8, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const slotIndex_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    const slots_r2 = \u0275\u0275readContextLet(0);
    const imageUrl_r10 = \u0275\u0275storeLet(slots_r2[slotIndex_r7]);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-selected", ctx_r0.isSelected(slotIndex_r7))("is-filled", imageUrl_r10)("is-uploading", ctx_r0.isUploading(slotIndex_r7));
    \u0275\u0275property("appLazyBgImage", ctx_r0.slotImageUrl(imageUrl_r10));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(slotIndex_r7 + 1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isUploading(slotIndex_r7) ? 4 : imageUrl_r10 ? 5 : !ctx_r0.isDisabled() ? 6 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.isDisabled() || ctx_r0.uploadingSlotIndex !== null);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.isDisabled() || ctx_r0.uploadingSlotIndex !== null || ctx_r0.isUploading(slotIndex_r7))("title", imageUrl_r10 ? "Replace image" : "Upload image");
    \u0275\u0275attribute("aria-label", imageUrl_r10 ? "Replace image slot " + (slotIndex_r7 + 1) : "Upload image slot " + (slotIndex_r7 + 1));
  }
}
function ImageCarouselComponent_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275repeaterCreate(1, ImageCarouselComponent_For_10_For_2_Template, 10, 14, "article", 15, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r11 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(page_r11);
  }
}
function ImageCarouselComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function ImageCarouselComponent_Conditional_11_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.showNextPage($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.isDisabled() || ctx_r0.uploadingSlotIndex !== null);
  }
}
function ImageCarouselComponent_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function ImageCarouselComponent_Conditional_12_For_2_Template_button_click_0_listener($event) {
      const \u0275$index_74_r14 = \u0275\u0275restoreView(_r13).$index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.showPage(\u0275$index_74_r14, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_74_r14 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-active", ctx_r0.carouselIndex === \u0275$index_74_r14);
    \u0275\u0275attribute("aria-current", ctx_r0.carouselIndex === \u0275$index_74_r14 ? "true" : null)("aria-label", "Show image slot page " + (\u0275$index_74_r14 + 1));
  }
}
function ImageCarouselComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275repeaterCreate(1, ImageCarouselComponent_Conditional_12_For_2_Template, 1, 4, "button", 26, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const slotPages_r15 = \u0275\u0275readContextLet(1);
    \u0275\u0275advance();
    \u0275\u0275repeater(slotPages_r15);
  }
}
var ImageCarouselComponent = class _ImageCarouselComponent {
  carouselViewportRef;
  media = inject(MediaService);
  changeDetectorRef = inject(ChangeDetectorRef);
  slotCount = 8;
  disabled = false;
  compact = false;
  autoSize = false;
  previewMode = false;
  slotImageVariant = "small";
  mediaFit = "default";
  imagePosition = "default";
  ariaLabel = "Image slots";
  uploadOwnerId = "";
  uploadEntityId = "image";
  imageRemoved = new EventEmitter();
  carouselIndex = 0;
  uploadingSlotIndex = null;
  localImageUrls = [];
  controlDisabled = false;
  onValueChange = () => {
  };
  onTouched = () => {
  };
  internalSelectedSlotIndex = 0;
  carouselScrollLockTargetIndex = null;
  carouselScrollLockTimer = null;
  hostClass = true;
  get compactClass() {
    return this.compact;
  }
  get autoSizeClass() {
    return this.autoSize;
  }
  get previewClass() {
    return this.previewMode;
  }
  get singleSlotClass() {
    return this.normalizedSlotCount() === 1;
  }
  get mediaFitCoverClass() {
    return this.mediaFit === "cover";
  }
  get mediaFitContainClass() {
    return this.mediaFit === "contain";
  }
  get imagePositionCenterTopClass() {
    return this.imagePosition === "center-top";
  }
  get imagePositionCenterClass() {
    return this.imagePosition === "center";
  }
  ngOnChanges(changes) {
    if (changes["slotCount"]) {
      this.carouselIndex = this.clampPageIndex(this.carouselIndex);
      this.scheduleViewportSync("auto");
    }
    this.internalSelectedSlotIndex = this.clampSlotIndex(this.internalSelectedSlotIndex);
    this.emitVisibleSlotSelection();
  }
  writeValue(imageUrls) {
    this.localImageUrls = this.normalizedImageUrls(imageUrls);
    this.internalSelectedSlotIndex = this.clampSlotIndex(this.internalSelectedSlotIndex);
    this.emitVisibleSlotSelection();
    this.refreshView();
  }
  registerOnChange(fn) {
    this.onValueChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlDisabled = isDisabled;
    this.refreshView();
  }
  onResize() {
    this.carouselIndex = this.clampPageIndex(this.carouselIndex);
    this.scheduleViewportSync("auto");
    this.emitVisibleSlotSelection();
  }
  imageSlots() {
    const urls = this.localImageUrls.slice(0, this.normalizedSlotCount());
    return Array.from({ length: this.normalizedSlotCount() }, (_value, index) => urls[index] ?? null);
  }
  pages() {
    const indexes = Array.from({ length: this.normalizedSlotCount() }, (_value, index) => index);
    const slotsPerPage = this.slotsPerPage();
    const pages = [];
    for (let index = 0; index < indexes.length; index += slotsPerPage) {
      pages.push(indexes.slice(index, index + slotsPerPage));
    }
    return pages;
  }
  carouselTransform() {
    return this.usesNativeSnap() ? null : `translateX(-${this.carouselIndex * 100}%)`;
  }
  showPreviousPage(event) {
    event?.stopPropagation();
    this.showPage(this.carouselIndex - 1, event);
  }
  showNextPage(event) {
    event?.stopPropagation();
    this.showPage(this.carouselIndex + 1, event);
  }
  showPage(index, event) {
    event?.stopPropagation();
    this.carouselIndex = this.clampPageIndex(index);
    this.scheduleViewportSync("smooth");
    this.emitVisibleSlotSelection();
  }
  onCarouselScroll() {
    if (!this.usesNativeSnap()) {
      return;
    }
    const viewport = this.carouselViewportRef?.nativeElement;
    if (!viewport) {
      return;
    }
    if (this.carouselScrollLockTargetIndex !== null) {
      this.scheduleScrollLockRelease();
      return;
    }
    const nextPageIndex = this.currentPageIndex(viewport);
    if (nextPageIndex === this.carouselIndex) {
      return;
    }
    this.carouselIndex = nextPageIndex;
    this.emitVisibleSlotSelection();
  }
  isUploading(slotIndex) {
    return this.uploadingSlotIndex === this.clampSlotIndex(slotIndex);
  }
  isSelected(slotIndex) {
    return this.normalizedSelectedSlotIndex() === this.clampSlotIndex(slotIndex);
  }
  selectedPreviewUrl(slots) {
    const imageUrl = slots[this.previewSlotIndex(slots)] ?? null;
    return AppUtils.mediaImageVariantUrl(imageUrl, "medium") || null;
  }
  slotImageUrl(imageUrl) {
    return AppUtils.mediaImageVariantUrl(imageUrl, this.slotImageVariant) || null;
  }
  isSelectedPreviewUploading(slots) {
    return this.uploadingSlotIndex !== null && this.uploadingSlotIndex === this.previewSlotIndex(slots);
  }
  openSlot(input, slotIndex, imageUrl, event) {
    event?.stopPropagation();
    this.onTouched();
    if (this.isDisabled() || this.uploadingSlotIndex !== null) {
      return;
    }
    const normalizedSlotIndex = this.clampSlotIndex(slotIndex);
    if (this.previewMode) {
      const shouldOnlySelect = Boolean(imageUrl) && !this.isSelected(normalizedSlotIndex);
      this.emitSlotSelection(normalizedSlotIndex);
      if (shouldOnlySelect) {
        return;
      }
    }
    input.click();
  }
  async uploadFromInput(event, slotIndex) {
    event.stopPropagation();
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    const file = input?.files?.[0] ?? null;
    const normalizedSlotIndex = this.clampSlotIndex(slotIndex);
    this.onTouched();
    if (!file || this.isDisabled() || this.uploadingSlotIndex !== null) {
      return;
    }
    this.carouselIndex = this.pageForSlot(normalizedSlotIndex);
    this.scheduleViewportSync("auto");
    this.uploadingSlotIndex = normalizedSlotIndex;
    this.refreshView();
    try {
      const result = await this.media.uploadImage(this.uploadOwnerIdForRequest(), `${this.uploadEntityId ?? ""}`.trim(), file);
      if (!result.uploaded || !result.imageUrl) {
        return;
      }
      const slots = this.imageSlots();
      const replacedImageUrl = slots[normalizedSlotIndex];
      slots[normalizedSlotIndex] = result.imageUrl;
      this.updateUrls(slots);
      if (replacedImageUrl && replacedImageUrl !== result.imageUrl) {
        this.imageRemoved.emit(replacedImageUrl);
      }
      this.focusImageUrl(result.imageUrl, normalizedSlotIndex);
    } finally {
      this.uploadingSlotIndex = null;
      if (input) {
        input.value = "";
      }
      this.refreshView();
    }
  }
  async copySlot(imageUrl, _slotIndex, event) {
    event?.stopPropagation();
    await this.copyToClipboard(imageUrl);
  }
  removeSlot(imageUrl, slotIndex, event) {
    event?.stopPropagation();
    if (this.isDisabled()) {
      return;
    }
    this.onTouched();
    const slots = this.imageSlots();
    slots[this.clampSlotIndex(slotIndex)] = null;
    this.updateUrls(slots);
    this.imageRemoved.emit(imageUrl);
  }
  isDisabled() {
    return this.disabled || this.controlDisabled;
  }
  normalizedImageUrls(imageUrls) {
    return Array.from(new Set((imageUrls ?? []).map((url) => `${url ?? ""}`.trim()).filter(Boolean)));
  }
  uploadOwnerIdForRequest() {
    const ownerId = `${this.uploadOwnerId ?? ""}`.trim();
    return ownerId;
  }
  updateUrls(slots) {
    this.localImageUrls = this.urlsFromSlots(slots);
    this.onValueChange([...this.localImageUrls]);
    this.refreshView();
  }
  focusImageUrl(imageUrl, fallbackSlotIndex) {
    const normalizedImageUrl = imageUrl.trim();
    const storedSlotIndex = this.localImageUrls.indexOf(normalizedImageUrl);
    const targetSlotIndex = storedSlotIndex >= 0 ? storedSlotIndex : this.clampSlotIndex(fallbackSlotIndex);
    this.internalSelectedSlotIndex = targetSlotIndex;
    this.carouselIndex = this.pageForSlot(targetSlotIndex);
    this.scheduleViewportSync("auto");
  }
  urlsFromSlots(slots) {
    return Array.from(new Set(slots.map((slot) => `${slot ?? ""}`.trim()).filter(Boolean)));
  }
  async copyToClipboard(imageUrl) {
    const link = await this.copyableImageLink(imageUrl);
    if (!link) {
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        return;
      }
    } catch {
    }
    this.copyWithFallback(link);
  }
  async copyableImageLink(imageUrl) {
    const normalized = `${imageUrl ?? ""}`.trim();
    if (!normalized) {
      return normalized;
    }
    if (normalized.startsWith("data:image/")) {
      return this.objectUrlFromDataImage(normalized) ?? normalized;
    }
    if (normalized.startsWith("blob:") || normalized.startsWith("indexeddb:")) {
      return normalized;
    }
    if (/^https?:\/\//i.test(normalized)) {
      return normalized;
    }
    if (typeof window === "undefined") {
      return normalized;
    }
    return new URL(normalized, window.location.origin).toString();
  }
  objectUrlFromDataImage(imageUrl) {
    if (typeof URL === "undefined" || !URL.createObjectURL) {
      return null;
    }
    try {
      const parts = imageUrl.split(",", 2);
      if (parts.length !== 2) {
        return null;
      }
      const metadata = parts[0] ?? "";
      const payload = parts[1] ?? "";
      const contentType = /^data:([^;,]+)/i.exec(metadata)?.[1] ?? "image/png";
      const binary = metadata.includes(";base64") ? atob(payload) : decodeURIComponent(payload);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return URL.createObjectURL(new Blob([bytes], { type: contentType }));
    } catch {
      return null;
    }
  }
  copyWithFallback(value) {
    if (typeof document === "undefined") {
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  normalizedSlotCount() {
    const parsed = Math.trunc(Number(this.slotCount));
    if (!Number.isFinite(parsed)) {
      return 1;
    }
    return Math.max(1, Math.min(24, parsed));
  }
  normalizedSelectedSlotIndex() {
    if (!this.previewMode) {
      return null;
    }
    const parsed = Math.trunc(Number(this.internalSelectedSlotIndex));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed >= this.normalizedSlotCount()) {
      return null;
    }
    return parsed;
  }
  emitSlotSelection(slotIndex) {
    this.internalSelectedSlotIndex = this.clampSlotIndex(slotIndex);
  }
  previewSlotIndex(slots) {
    const selectedSlotIndex = this.normalizedSelectedSlotIndex();
    if (selectedSlotIndex !== null) {
      return selectedSlotIndex;
    }
    const firstFilledSlotIndex = slots.findIndex((slot) => Boolean(slot?.trim()));
    return firstFilledSlotIndex >= 0 ? firstFilledSlotIndex : 0;
  }
  emitVisibleSlotSelection() {
    if (!this.previewMode || this.slotsPerPage() !== 1) {
      return;
    }
    const visibleSlotIndex = this.pages()[this.carouselIndex]?.[0];
    if (visibleSlotIndex === void 0) {
      return;
    }
    if (this.normalizedSelectedSlotIndex() === this.clampSlotIndex(visibleSlotIndex)) {
      return;
    }
    this.emitSlotSelection(visibleSlotIndex);
  }
  refreshView() {
    this.changeDetectorRef.markForCheck();
    queueMicrotask(() => {
      try {
        this.changeDetectorRef.detectChanges();
      } catch {
      }
    });
  }
  clampSlotIndex(slotIndex) {
    const parsed = Math.trunc(Number(slotIndex));
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.max(0, Math.min(this.normalizedSlotCount() - 1, parsed));
  }
  slotsPerPage() {
    const viewportWidth = this.readViewportWidth();
    if (viewportWidth <= 720) {
      return 1;
    }
    if (viewportWidth <= 980) {
      return 3;
    }
    return 4;
  }
  pageForSlot(slotIndex) {
    return this.clampPageIndex(Math.floor(this.clampSlotIndex(slotIndex) / this.slotsPerPage()));
  }
  clampPageIndex(pageIndex) {
    const parsed = Math.trunc(Number(pageIndex));
    const maxPageIndex = Math.max(0, Math.ceil(this.normalizedSlotCount() / this.slotsPerPage()) - 1);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.max(0, Math.min(maxPageIndex, parsed));
  }
  usesNativeSnap() {
    return this.readViewportWidth() <= 720;
  }
  readViewportWidth() {
    return typeof window === "undefined" ? 1180 : window.innerWidth;
  }
  scheduleViewportSync(behavior) {
    if (!this.usesNativeSnap()) {
      this.clearScrollLock();
      this.resetViewportScroll();
      return;
    }
    const targetPageIndex = this.carouselIndex;
    if (behavior === "smooth") {
      this.carouselScrollLockTargetIndex = targetPageIndex;
      this.scheduleScrollLockRelease();
    } else {
      this.clearScrollLock();
    }
    const sync = () => {
      const viewport = this.carouselViewportRef?.nativeElement;
      if (!viewport) {
        return;
      }
      const targetLeft = this.pageOffsetLeft(viewport, targetPageIndex);
      if (targetLeft < 0) {
        return;
      }
      const previousScrollBehavior = viewport.style.scrollBehavior;
      viewport.style.scrollBehavior = behavior;
      viewport.scrollLeft = targetLeft;
      const restore = () => {
        viewport.style.scrollBehavior = previousScrollBehavior;
      };
      if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(() => restore());
      } else {
        setTimeout(restore, 0);
      }
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(sync));
      return;
    }
    setTimeout(sync, 0);
  }
  scheduleScrollLockRelease() {
    if (this.carouselScrollLockTimer) {
      clearTimeout(this.carouselScrollLockTimer);
    }
    this.carouselScrollLockTimer = setTimeout(() => {
      this.carouselScrollLockTimer = null;
      const viewport = this.carouselViewportRef?.nativeElement;
      const finalPageIndex = viewport ? this.currentPageIndex(viewport) : this.carouselScrollLockTargetIndex;
      this.carouselScrollLockTargetIndex = null;
      if (finalPageIndex === null) {
        return;
      }
      this.carouselIndex = finalPageIndex;
    }, 96);
  }
  clearScrollLock() {
    if (this.carouselScrollLockTimer) {
      clearTimeout(this.carouselScrollLockTimer);
      this.carouselScrollLockTimer = null;
    }
    this.carouselScrollLockTargetIndex = null;
  }
  currentPageIndex(viewport) {
    const pages = Array.from(viewport.querySelectorAll(".image-carousel__page"));
    if (pages.length === 0) {
      return 0;
    }
    const currentLeft = viewport.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    pages.forEach((page, index) => {
      const distance = Math.abs(page.offsetLeft - currentLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return Math.max(0, Math.min(pages.length - 1, closestIndex));
  }
  pageOffsetLeft(viewport, pageIndex) {
    const pages = Array.from(viewport.querySelectorAll(".image-carousel__page"));
    if (pages.length === 0) {
      return -1;
    }
    const targetIndex = Math.max(0, Math.min(pages.length - 1, pageIndex));
    return Math.max(0, pages[targetIndex]?.offsetLeft ?? 0);
  }
  resetViewportScroll() {
    const viewport = this.carouselViewportRef?.nativeElement;
    if (viewport && viewport.scrollLeft !== 0) {
      viewport.scrollLeft = 0;
    }
  }
  static \u0275fac = function ImageCarouselComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImageCarouselComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImageCarouselComponent, selectors: [["app-image-carousel"]], viewQuery: function ImageCarouselComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.carouselViewportRef = _t.first);
    }
  }, hostVars: 18, hostBindings: function ImageCarouselComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function ImageCarouselComponent_resize_HostBindingHandler() {
        return ctx.onResize();
      }, \u0275\u0275resolveWindow);
    }
    if (rf & 2) {
      \u0275\u0275classProp("image-carousel-host", ctx.hostClass)("image-carousel-host--compact", ctx.compactClass)("image-carousel-host--auto-size", ctx.autoSizeClass)("image-carousel-host--preview", ctx.previewClass)("image-carousel-host--single-slot", ctx.singleSlotClass)("image-carousel-host--media-fit-cover", ctx.mediaFitCoverClass)("image-carousel-host--media-fit-contain", ctx.mediaFitContainClass)("image-carousel-host--image-position-center-top", ctx.imagePositionCenterTopClass)("image-carousel-host--image-position-center", ctx.imagePositionCenterClass);
    }
  }, inputs: { slotCount: "slotCount", disabled: "disabled", compact: "compact", autoSize: "autoSize", previewMode: "previewMode", slotImageVariant: "slotImageVariant", mediaFit: "mediaFit", imagePosition: "imagePosition", ariaLabel: "ariaLabel", uploadOwnerId: "uploadOwnerId", uploadEntityId: "uploadEntityId" }, outputs: { imageRemoved: "imageRemoved" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _ImageCarouselComponent),
      multi: true
    }
  ]), \u0275\u0275NgOnChangesFeature], decls: 13, vars: 9, consts: [["carouselViewport", ""], ["imageSlotInput", ""], ["role", "region", "aria-roledescription", "carousel", 1, "image-carousel"], [1, "image-carousel__preview", 3, "is-empty", "appLazyBgImage"], [1, "image-carousel__carousel"], ["type", "button", "data-motion", "none", "aria-label", "Previous image slot", "title", "Previous", 1, "image-carousel__arrow", "image-carousel__arrow--prev", 3, "disabled"], [1, "image-carousel__window", 3, "scroll"], [1, "image-carousel__strip"], [1, "image-carousel__page"], ["type", "button", "data-motion", "none", "aria-label", "Next image slot", "title", "Next", 1, "image-carousel__arrow", "image-carousel__arrow--next", 3, "disabled"], ["aria-label", "Image slot pages", 1, "image-carousel__dots"], [1, "image-carousel__preview", 3, "appLazyBgImage"], ["aria-label", "Uploading image", 1, "image-carousel__preview-ring"], ["kind", "spinner-ring"], ["type", "button", "data-motion", "none", "aria-label", "Previous image slot", "title", "Previous", 1, "image-carousel__arrow", "image-carousel__arrow--prev", 3, "click", "disabled"], [1, "image-carousel__slot", 3, "is-selected", "is-filled", "is-uploading", "appLazyBgImage"], [1, "image-carousel__slot", 3, "appLazyBgImage"], [1, "image-carousel__slot-index"], ["aria-label", "Uploading image", 1, "image-carousel__upload-ring"], [1, "image-carousel__slot-add"], ["type", "file", "accept", "image/*", 1, "image-carousel__slot-input", 3, "change", "disabled"], ["type", "button", 1, "image-carousel__slot-hit", 3, "click", "disabled", "title"], ["kind", "spinner-ring", 3, "size"], ["type", "button", "aria-label", "Copy image link", "title", "Copy link", 1, "image-carousel__slot-action", "image-carousel__slot-action--copy", 3, "click"], ["type", "button", "aria-label", "Remove image", "title", "Remove", 1, "image-carousel__slot-action", "image-carousel__slot-action--remove", 3, "click"], ["type", "button", "data-motion", "none", "aria-label", "Next image slot", "title", "Next", 1, "image-carousel__arrow", "image-carousel__arrow--next", 3, "click", "disabled"], ["type", "button", 1, "image-carousel__dot", 3, "is-active"], ["type", "button", 1, "image-carousel__dot", 3, "click"]], template: function ImageCarouselComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275declareLet(0)(1);
      \u0275\u0275elementStart(2, "div", 2);
      \u0275\u0275conditionalCreate(3, ImageCarouselComponent_Conditional_3_Template, 3, 5, "div", 3);
      \u0275\u0275elementStart(4, "div", 4);
      \u0275\u0275conditionalCreate(5, ImageCarouselComponent_Conditional_5_Template, 3, 1, "button", 5);
      \u0275\u0275elementStart(6, "div", 6, 0);
      \u0275\u0275listener("scroll", function ImageCarouselComponent_Template_div_scroll_6_listener() {
        return ctx.onCarouselScroll();
      });
      \u0275\u0275elementStart(8, "div", 7);
      \u0275\u0275repeaterCreate(9, ImageCarouselComponent_For_10_Template, 3, 0, "div", 8, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(11, ImageCarouselComponent_Conditional_11_Template, 3, 1, "button", 9);
      \u0275\u0275conditionalCreate(12, ImageCarouselComponent_Conditional_12_Template, 3, 0, "div", 10);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275storeLet(ctx.imageSlots());
      \u0275\u0275advance();
      const slotPages_r16 = \u0275\u0275storeLet(ctx.pages());
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-label", ctx.ariaLabel);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.previewMode ? 3 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(slotPages_r16.length > 1 && ctx.carouselIndex > 0 ? 5 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275styleProp("transform", ctx.carouselTransform());
      \u0275\u0275advance();
      \u0275\u0275repeater(slotPages_r16);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(slotPages_r16.length > 1 && ctx.carouselIndex < slotPages_r16.length - 1 ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(slotPages_r16.length > 1 ? 12 : -1);
    }
  }, dependencies: [CommonModule, MatIconModule, MatIcon, LazyBgImageDirective, IndicatorComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  justify-self: stretch;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.6rem;\n}\n.image-carousel-host--compact[_nghost-%COMP%] {\n  height: 148px;\n  min-height: 148px;\n  background: rgba(255, 255, 255, 0.72);\n  padding: 0.48rem;\n}\n.image-carousel-host--preview[_nghost-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  padding: 0;\n}\n.image-carousel[_ngcontent-%COMP%] {\n  --image-slot-gap: 0.5rem;\n  --image-slots-per-page: 4;\n  --image-carousel-footer-size: 1.34rem;\n  --image-carousel-footer-half: 0.67rem;\n  --image-carousel-arrow-half: 17px;\n  --image-carousel-edge-padding: 0.16rem;\n  position: relative;\n  min-width: 0;\n  padding: 0 0.74rem 0;\n  box-sizing: border-box;\n}\n.image-carousel-host--preview[_nghost-%COMP%]   .image-carousel[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  gap: 0.58rem;\n}\n.image-carousel__preview[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 420px;\n  border: 1px dashed rgba(18, 31, 51, 0.28);\n  border-radius: 12px;\n  background-color: #fbfdff;\n  background-position: center;\n  background-size: contain;\n  background-repeat: no-repeat;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: rgba(18, 31, 51, 0.7);\n  overflow: hidden;\n}\n.image-carousel__preview.is-empty[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    repeating-linear-gradient(\n      45deg,\n      rgba(47, 86, 139, 0.08) 0 12px,\n      transparent 12px 24px);\n}\n.image-carousel__preview-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.46);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.image-carousel__window[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  border-radius: 12px;\n  isolation: isolate;\n  padding: 0.16rem 0;\n  margin: -0.16rem 0;\n  clip-path: inset(-0.16rem 0 round 12px);\n}\n.image-carousel__carousel[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  flex: 0 0 auto;\n  padding-bottom: var(--image-carousel-footer-size);\n  box-sizing: border-box;\n}\n.image-carousel__strip[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  min-width: 0;\n  transform: translate3d(0, 0, 0);\n  transition: transform 0.32s cubic-bezier(0.22, 0.61, 0.36, 1);\n  will-change: transform;\n}\n.image-carousel__page[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  max-width: 100%;\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(var(--image-slots-per-page), minmax(0, 1fr));\n  gap: var(--image-slot-gap);\n  padding: 0 var(--image-carousel-edge-padding);\n  box-sizing: border-box;\n}\n.image-carousel__arrow[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(50% - var(--image-carousel-footer-half) - var(--image-carousel-arrow-half));\n  z-index: 5;\n  width: 34px;\n  height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.84);\n  color: #2f5f98;\n  -webkit-backdrop-filter: blur(12px) saturate(1.12);\n  backdrop-filter: blur(12px) saturate(1.12);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 10px 24px rgba(20, 40, 68, 0.16);\n}\n.image-carousel__arrow[_ngcontent-%COMP%]:disabled {\n  opacity: 0.58;\n  cursor: default;\n}\n.image-carousel__arrow[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: scale(0.96);\n  filter: brightness(0.97);\n}\n.image-carousel__arrow--prev[_ngcontent-%COMP%] {\n  left: calc(var(--image-carousel-edge-padding) - var(--image-carousel-arrow-half));\n}\n.image-carousel__arrow--next[_ngcontent-%COMP%] {\n  right: calc(var(--image-carousel-edge-padding) - var(--image-carousel-arrow-half));\n}\n.image-carousel__arrow[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n}\n.image-carousel__dots[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  bottom: calc(var(--image-carousel-footer-half) - 0.28rem);\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  transform: translateX(-50%);\n}\n.image-carousel__dot[_ngcontent-%COMP%] {\n  width: 9px;\n  height: 9px;\n  border: 1px solid rgba(56, 89, 140, 0.22);\n  border-radius: 999px;\n  padding: 0;\n  background: #d8e2f2;\n  cursor: pointer;\n  transition:\n    width 0.18s ease,\n    background-color 0.18s ease,\n    border-color 0.18s ease,\n    box-shadow 0.18s ease;\n}\n.image-carousel__dot.is-active[_ngcontent-%COMP%] {\n  width: 26px;\n  border-color: transparent;\n  background:\n    linear-gradient(\n      90deg,\n      #4f74e8 0%,\n      #8a58ec 50%,\n      #f1569a 100%);\n  box-shadow: 0 6px 12px rgba(80, 70, 210, 0.22);\n}\n.image-carousel__slot[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow: hidden;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 10px;\n  background: #fbfdff;\n  background-position: center;\n  background-size: cover;\n  background-repeat: no-repeat;\n  aspect-ratio: 16/9;\n  min-height: 128px;\n  box-shadow: 0 8px 18px rgba(24, 45, 73, 0.06);\n}\n.image-carousel__slot.is-primary[_ngcontent-%COMP%] {\n  border-color: rgba(204, 130, 27, 0.9);\n  box-shadow: inset 0 0 0 1px rgba(226, 158, 41, 0.46), 0 8px 18px rgba(154, 104, 27, 0.12);\n}\n.image-carousel__slot.is-selected[_ngcontent-%COMP%] {\n  border-color: #4d86c2;\n  box-shadow: inset 0 0 0 1px rgba(77, 134, 194, 0.36), 0 0 0 2px rgba(77, 134, 194, 0.18);\n}\n.image-carousel__slot.is-filled[_ngcontent-%COMP%] {\n  background-color: #f8fbff;\n  background-position: center top;\n  background-size: contain;\n}\n.image-carousel__slot.is-uploading[_ngcontent-%COMP%] {\n  cursor: progress;\n}\n.image-carousel__slot[_ngcontent-%COMP%]:not(.is-filled) {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    repeating-linear-gradient(\n      45deg,\n      rgba(47, 86, 139, 0.08) 0 9px,\n      transparent 9px 18px);\n}\n.image-carousel__slot-hit[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n}\n.image-carousel__slot-hit[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n}\n.image-carousel__slot.is-uploading[_ngcontent-%COMP%]   .image-carousel__slot-hit[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.image-carousel__slot-index[_ngcontent-%COMP%], \n.image-carousel__slot-add[_ngcontent-%COMP%], \n.image-carousel__slot-action[_ngcontent-%COMP%], \n.image-carousel__upload-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 2;\n}\n.image-carousel__slot-index[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  bottom: 0.28rem;\n  left: 0.32rem;\n  width: 1.08rem;\n  height: 1.08rem;\n  box-sizing: border-box;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background: rgba(10, 29, 55, 0.82);\n  color: #fff;\n  padding: 0;\n  font-size: 0.62rem;\n  font-weight: 900;\n  line-height: 1;\n  text-shadow: 0 1px 2px rgba(4, 15, 31, 0.7);\n  box-shadow: 0 4px 12px rgba(7, 20, 38, 0.2);\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n}\n.image-carousel__slot-add[_ngcontent-%COMP%] {\n  top: 50%;\n  left: 50%;\n  width: 34px;\n  height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.22);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.86);\n  color: rgba(37, 62, 96, 0.7);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 1.28rem;\n  font-weight: 800;\n  line-height: 1;\n  transform: translate(-50%, -50%);\n  pointer-events: none;\n  box-shadow: 0 8px 16px rgba(24, 45, 73, 0.08);\n}\n.image-carousel__slot-action[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.24rem;\n  width: 22px;\n  height: 22px;\n  border: 1px solid rgba(42, 67, 101, 0.22);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.94);\n  color: #2c5d9e;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 8px 18px rgba(14, 30, 52, 0.16);\n}\n.image-carousel__slot-action--copy[_ngcontent-%COMP%] {\n  left: 0.24rem;\n}\n.image-carousel__slot-action--remove[_ngcontent-%COMP%] {\n  right: 0.24rem;\n  color: #9e3d4d;\n}\n.image-carousel__slot-action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.image-carousel__upload-ring[_ngcontent-%COMP%] {\n  z-index: 4;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(244, 248, 253, 0.62);\n  -webkit-backdrop-filter: blur(1px);\n  backdrop-filter: blur(1px);\n}\n.image-carousel__slot-input[_ngcontent-%COMP%] {\n  display: none;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel[_ngcontent-%COMP%] {\n  --image-slot-gap: 0.48rem;\n  --image-carousel-footer-size: 1.2rem;\n  --image-carousel-footer-half: 0.6rem;\n  --image-carousel-arrow-half: 16px;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__window[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  padding: 0;\n  margin: 0;\n  clip-path: none;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__strip[_ngcontent-%COMP%] {\n  transition-duration: 0.22s;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__page[_ngcontent-%COMP%] {\n  padding: 0 0.14rem;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__slot[_ngcontent-%COMP%] {\n  height: 112px;\n  min-height: 0;\n  aspect-ratio: auto;\n  background-size: cover;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__slot[_ngcontent-%COMP%]:not(.is-filled) {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    radial-gradient(\n      circle at 50% 44%,\n      rgba(97, 131, 171, 0.12),\n      transparent 34%);\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__slot-index[_ngcontent-%COMP%] {\n  left: 0.24rem;\n  bottom: 0.24rem;\n  min-width: 18px;\n  width: auto;\n  height: 18px;\n  padding: 0 0.24rem;\n  font-size: 0.6rem;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__slot-action[_ngcontent-%COMP%] {\n  top: 0.22rem;\n  width: 26px;\n  height: 26px;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__slot-action--copy[_ngcontent-%COMP%] {\n  left: 0.22rem;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__slot-action--remove[_ngcontent-%COMP%] {\n  right: 0.22rem;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__upload-ring[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.6);\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__arrow[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  background: #fff;\n  top: calc(50% - var(--image-carousel-footer-half) - var(--image-carousel-arrow-half));\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__dots[_ngcontent-%COMP%] {\n  bottom: -0.18rem;\n  gap: 0.18rem;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n}\n.image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__dot.is-active[_ngcontent-%COMP%] {\n  width: 24px;\n}\n@media (max-width: 760px) {\n  .image-carousel[_ngcontent-%COMP%] {\n    --image-slots-per-page: 1;\n    --image-carousel-footer-size: 1.82rem;\n    --image-carousel-edge-padding: 1px;\n    height: 240px;\n    min-height: 240px;\n    padding: 0 0.22rem 0;\n    overflow: visible;\n  }\n  .image-carousel__window[_ngcontent-%COMP%] {\n    height: 208px;\n    min-height: 208px;\n    padding: 0;\n    margin: 0;\n    overflow-x: auto;\n    overflow-y: hidden;\n    touch-action: pan-x pan-y;\n    scroll-snap-type: x mandatory;\n    scroll-behavior: smooth;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n    -webkit-overflow-scrolling: touch;\n    overscroll-behavior-x: contain;\n    clip-path: inset(0 round 12px);\n  }\n  .image-carousel__window[_ngcontent-%COMP%]::-webkit-scrollbar {\n    display: none;\n  }\n  .image-carousel__strip[_ngcontent-%COMP%], \n   .image-carousel__page[_ngcontent-%COMP%] {\n    height: 100%;\n  }\n  .image-carousel__strip[_ngcontent-%COMP%] {\n    transition: none;\n    transform: none;\n  }\n  .image-carousel__page[_ngcontent-%COMP%] {\n    align-items: center;\n    scroll-snap-align: start;\n    scroll-snap-stop: always;\n    contain: layout paint style;\n  }\n  .image-carousel__slot-hit[_ngcontent-%COMP%] {\n    touch-action: pan-x pan-y;\n  }\n  .image-carousel__arrow[_ngcontent-%COMP%] {\n    top: 104px;\n    background: rgba(255, 255, 255, 0.86);\n    transform: translateY(-50%);\n  }\n  .image-carousel__arrow[_ngcontent-%COMP%]:not(:disabled):active {\n    animation: none;\n    transform: translateY(-50%) scale(0.96);\n    filter: brightness(0.97);\n  }\n  .image-carousel__slot[_ngcontent-%COMP%] {\n    height: 200px;\n    min-height: 0;\n    aspect-ratio: auto;\n  }\n  .image-carousel-host--compact[_nghost-%COMP%]   .image-carousel[_ngcontent-%COMP%] {\n    height: 100%;\n    min-height: 0;\n    padding: 0;\n  }\n  .image-carousel-host--compact[_nghost-%COMP%] {\n    height: 200px;\n    min-height: 200px;\n    padding: 0.42rem;\n  }\n  .image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__window[_ngcontent-%COMP%] {\n    height: 168px;\n    min-height: 168px;\n  }\n  .image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__slot[_ngcontent-%COMP%] {\n    height: 160px;\n  }\n  .image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__arrow[_ngcontent-%COMP%] {\n    top: 78px;\n  }\n  .image-carousel-host--compact[_nghost-%COMP%]   .image-carousel__arrow[_ngcontent-%COMP%]:not(:disabled):active {\n    transform: translateY(-50%) scale(0.96);\n  }\n  .image-carousel-host--preview[_nghost-%COMP%]   .image-carousel[_ngcontent-%COMP%] {\n    height: 100%;\n    min-height: 0;\n  }\n  .image-carousel-host--preview[_nghost-%COMP%]   .image-carousel__preview[_ngcontent-%COMP%] {\n    min-height: 96px;\n  }\n}\n.image-carousel-host--media-fit-cover[_nghost-%COMP%]   .image-carousel__preview[_ngcontent-%COMP%], \n.image-carousel-host--media-fit-cover[_nghost-%COMP%]   .image-carousel__slot.is-filled[_ngcontent-%COMP%] {\n  background-size: cover;\n}\n.image-carousel-host--media-fit-contain[_nghost-%COMP%]   .image-carousel__preview[_ngcontent-%COMP%], \n.image-carousel-host--media-fit-contain[_nghost-%COMP%]   .image-carousel__slot.is-filled[_ngcontent-%COMP%] {\n  background-size: contain;\n}\n.image-carousel-host--image-position-center-top[_nghost-%COMP%]   .image-carousel__preview[_ngcontent-%COMP%], \n.image-carousel-host--image-position-center-top[_nghost-%COMP%]   .image-carousel__slot.is-filled[_ngcontent-%COMP%] {\n  background-position: center top;\n}\n.image-carousel-host--image-position-center[_nghost-%COMP%]   .image-carousel__preview[_ngcontent-%COMP%], \n.image-carousel-host--image-position-center[_nghost-%COMP%]   .image-carousel__slot.is-filled[_ngcontent-%COMP%] {\n  background-position: center;\n}\n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%] {\n  --image-single-slot-width: 280px;\n  --image-single-slot-height: 160px;\n  --image-single-slot-aspect-ratio: 7 / 4;\n  width: min(100%, var(--image-single-slot-width));\n  height: auto;\n  min-height: 0;\n  border: 0;\n  background: transparent;\n  padding: 0;\n}\n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%]   .image-carousel[_ngcontent-%COMP%] {\n  --image-slots-per-page: 1;\n  --image-carousel-footer-size: 0px;\n  --image-carousel-footer-half: 0px;\n}\n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%]   .image-carousel__carousel[_ngcontent-%COMP%] {\n  padding-bottom: 0;\n}\n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%]   .image-carousel__window[_ngcontent-%COMP%], \n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%]   .image-carousel__strip[_ngcontent-%COMP%], \n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%]   .image-carousel__page[_ngcontent-%COMP%] {\n  height: var(--image-single-slot-height);\n  min-height: var(--image-single-slot-height);\n}\n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%]   .image-carousel__page[_ngcontent-%COMP%] {\n  padding: 0;\n}\n.image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%]   .image-carousel__slot[_ngcontent-%COMP%] {\n  height: var(--image-single-slot-height);\n}\n.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  justify-content: flex-start;\n  width: 100%;\n  aspect-ratio: auto;\n}\n.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%]   .image-carousel[_ngcontent-%COMP%], \n.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%]   .image-carousel__carousel[_ngcontent-%COMP%] {\n  flex: var(--image-single-slot-content-flex, 0 1 auto);\n  width: var(--image-single-slot-content-width, auto);\n  max-width: 100%;\n  height: 100%;\n  aspect-ratio: var(--image-single-slot-aspect-ratio);\n}\n.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%]   .image-carousel__window[_ngcontent-%COMP%], \n.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%]   .image-carousel__strip[_ngcontent-%COMP%], \n.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%]   .image-carousel__page[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n}\n.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%]   .image-carousel__slot[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  aspect-ratio: auto;\n}\n@media (max-width: 760px) {\n  .image-carousel-host--compact.image-carousel-host--single-slot[_nghost-%COMP%] {\n    width: 100%;\n    max-width: 100%;\n  }\n  .image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size[_nghost-%COMP%] {\n    height: auto;\n    min-height: 0;\n  }\n}\n/*# sourceMappingURL=image-carousel.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageCarouselComponent, [{
    type: Component,
    args: [{ selector: "app-image-carousel", standalone: true, imports: [CommonModule, MatIconModule, LazyBgImageDirective, IndicatorComponent], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ImageCarouselComponent),
        multi: true
      }
    ], template: `@let slots = imageSlots();
@let slotPages = pages();

<div class="image-carousel" role="region" [attr.aria-label]="ariaLabel" aria-roledescription="carousel">
  @if (previewMode) {
    @let previewUrl = selectedPreviewUrl(slots);
    <div
      class="image-carousel__preview"
      [class.is-empty]="!previewUrl"
      [appLazyBgImage]="previewUrl || null"
    >
      @if (!previewUrl) {
        <span>Select a slot to upload an image</span>
      }
      @if (isSelectedPreviewUploading(slots)) {
        <span class="image-carousel__preview-ring" aria-label="Uploading image">
          <app-indicator kind="spinner-ring"></app-indicator>
        </span>
      }
    </div>
  }

  <div class="image-carousel__carousel">
    @if (slotPages.length > 1 && carouselIndex > 0) {
      <button
        type="button"
        class="image-carousel__arrow image-carousel__arrow--prev"
        data-motion="none"
        [disabled]="isDisabled() || uploadingSlotIndex !== null"
        (click)="showPreviousPage($event)"
        aria-label="Previous image slot"
        title="Previous"
      >
        <mat-icon>chevron_left</mat-icon>
      </button>
    }

    <div
      #carouselViewport
      class="image-carousel__window"
      (scroll)="onCarouselScroll()"
    >
      <div class="image-carousel__strip" [style.transform]="carouselTransform()">
        @for (page of slotPages; track $index) {
          <div class="image-carousel__page">
            @for (slotIndex of page; track slotIndex) {
              @let imageUrl = slots[slotIndex];
              <article
                class="image-carousel__slot"
                [class.is-selected]="isSelected(slotIndex)"
                [class.is-filled]="imageUrl"
                [class.is-uploading]="isUploading(slotIndex)"
                [appLazyBgImage]="slotImageUrl(imageUrl)"
              >
                <span class="image-carousel__slot-index">{{ slotIndex + 1 }}</span>

                @if (isUploading(slotIndex)) {
                  <span class="image-carousel__upload-ring" aria-label="Uploading image">
                    <app-indicator kind="spinner-ring" [size]="compact ? 'sm' : 'md'"></app-indicator>
                  </span>
                } @else if (imageUrl) {
                  @if (!isDisabled()) {
                    <button
                      type="button"
                      class="image-carousel__slot-action image-carousel__slot-action--copy"
                      (click)="copySlot(imageUrl, slotIndex, $event)"
                      aria-label="Copy image link"
                      title="Copy link"
                    >
                      <mat-icon>content_copy</mat-icon>
                    </button>
                    <button
                      type="button"
                      class="image-carousel__slot-action image-carousel__slot-action--remove"
                      (click)="removeSlot(imageUrl, slotIndex, $event)"
                      aria-label="Remove image"
                      title="Remove"
                    >
                      <mat-icon>close</mat-icon>
                    </button>
                  }
                } @else if (!isDisabled()) {
                  <span class="image-carousel__slot-add">+</span>
                }

                <input
                  #imageSlotInput
                  class="image-carousel__slot-input"
                  type="file"
                  accept="image/*"
                  [disabled]="isDisabled() || uploadingSlotIndex !== null"
                  (change)="uploadFromInput($event, slotIndex)"
                />
                <button
                  type="button"
                  class="image-carousel__slot-hit"
                  [disabled]="isDisabled() || uploadingSlotIndex !== null || isUploading(slotIndex)"
                  (click)="openSlot(imageSlotInput, slotIndex, imageUrl, $event)"
                  [attr.aria-label]="imageUrl ? 'Replace image slot ' + (slotIndex + 1) : 'Upload image slot ' + (slotIndex + 1)"
                  [title]="imageUrl ? 'Replace image' : 'Upload image'"
                ></button>
              </article>
            }
          </div>
        }
      </div>
    </div>

    @if (slotPages.length > 1 && carouselIndex < slotPages.length - 1) {
      <button
        type="button"
        class="image-carousel__arrow image-carousel__arrow--next"
        data-motion="none"
        [disabled]="isDisabled() || uploadingSlotIndex !== null"
        (click)="showNextPage($event)"
        aria-label="Next image slot"
        title="Next"
      >
        <mat-icon>chevron_right</mat-icon>
      </button>
    }

    @if (slotPages.length > 1) {
      <div class="image-carousel__dots" aria-label="Image slot pages">
        @for (page of slotPages; track $index; let pageIndex = $index) {
          <button
            type="button"
            class="image-carousel__dot"
            [class.is-active]="carouselIndex === pageIndex"
            [attr.aria-current]="carouselIndex === pageIndex ? 'true' : null"
            [attr.aria-label]="'Show image slot page ' + (pageIndex + 1)"
            (click)="showPage(pageIndex, $event)"
          ></button>
        }
      </div>
    }
  </div>
</div>
`, styles: ["/* src/app/shared/ui/components/core/image-carousel/image-carousel.component.scss */\n:host {\n  display: block;\n  justify-self: stretch;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.6rem;\n}\n:host(.image-carousel-host--compact) {\n  height: 148px;\n  min-height: 148px;\n  background: rgba(255, 255, 255, 0.72);\n  padding: 0.48rem;\n}\n:host(.image-carousel-host--preview) {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  padding: 0;\n}\n.image-carousel {\n  --image-slot-gap: 0.5rem;\n  --image-slots-per-page: 4;\n  --image-carousel-footer-size: 1.34rem;\n  --image-carousel-footer-half: 0.67rem;\n  --image-carousel-arrow-half: 17px;\n  --image-carousel-edge-padding: 0.16rem;\n  position: relative;\n  min-width: 0;\n  padding: 0 0.74rem 0;\n  box-sizing: border-box;\n}\n:host(.image-carousel-host--preview) .image-carousel {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  gap: 0.58rem;\n}\n.image-carousel__preview {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 420px;\n  border: 1px dashed rgba(18, 31, 51, 0.28);\n  border-radius: 12px;\n  background-color: #fbfdff;\n  background-position: center;\n  background-size: contain;\n  background-repeat: no-repeat;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: rgba(18, 31, 51, 0.7);\n  overflow: hidden;\n}\n.image-carousel__preview.is-empty {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    repeating-linear-gradient(\n      45deg,\n      rgba(47, 86, 139, 0.08) 0 12px,\n      transparent 12px 24px);\n}\n.image-carousel__preview-ring {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.46);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.image-carousel__window {\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  border-radius: 12px;\n  isolation: isolate;\n  padding: 0.16rem 0;\n  margin: -0.16rem 0;\n  clip-path: inset(-0.16rem 0 round 12px);\n}\n.image-carousel__carousel {\n  position: relative;\n  min-width: 0;\n  flex: 0 0 auto;\n  padding-bottom: var(--image-carousel-footer-size);\n  box-sizing: border-box;\n}\n.image-carousel__strip {\n  display: flex;\n  width: 100%;\n  min-width: 0;\n  transform: translate3d(0, 0, 0);\n  transition: transform 0.32s cubic-bezier(0.22, 0.61, 0.36, 1);\n  will-change: transform;\n}\n.image-carousel__page {\n  flex: 0 0 100%;\n  max-width: 100%;\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(var(--image-slots-per-page), minmax(0, 1fr));\n  gap: var(--image-slot-gap);\n  padding: 0 var(--image-carousel-edge-padding);\n  box-sizing: border-box;\n}\n.image-carousel__arrow {\n  position: absolute;\n  top: calc(50% - var(--image-carousel-footer-half) - var(--image-carousel-arrow-half));\n  z-index: 5;\n  width: 34px;\n  height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.84);\n  color: #2f5f98;\n  -webkit-backdrop-filter: blur(12px) saturate(1.12);\n  backdrop-filter: blur(12px) saturate(1.12);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 10px 24px rgba(20, 40, 68, 0.16);\n}\n.image-carousel__arrow:disabled {\n  opacity: 0.58;\n  cursor: default;\n}\n.image-carousel__arrow:not(:disabled):active {\n  transform: scale(0.96);\n  filter: brightness(0.97);\n}\n.image-carousel__arrow--prev {\n  left: calc(var(--image-carousel-edge-padding) - var(--image-carousel-arrow-half));\n}\n.image-carousel__arrow--next {\n  right: calc(var(--image-carousel-edge-padding) - var(--image-carousel-arrow-half));\n}\n.image-carousel__arrow .mat-icon {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n}\n.image-carousel__dots {\n  position: absolute;\n  left: 50%;\n  bottom: calc(var(--image-carousel-footer-half) - 0.28rem);\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  transform: translateX(-50%);\n}\n.image-carousel__dot {\n  width: 9px;\n  height: 9px;\n  border: 1px solid rgba(56, 89, 140, 0.22);\n  border-radius: 999px;\n  padding: 0;\n  background: #d8e2f2;\n  cursor: pointer;\n  transition:\n    width 0.18s ease,\n    background-color 0.18s ease,\n    border-color 0.18s ease,\n    box-shadow 0.18s ease;\n}\n.image-carousel__dot.is-active {\n  width: 26px;\n  border-color: transparent;\n  background:\n    linear-gradient(\n      90deg,\n      #4f74e8 0%,\n      #8a58ec 50%,\n      #f1569a 100%);\n  box-shadow: 0 6px 12px rgba(80, 70, 210, 0.22);\n}\n.image-carousel__slot {\n  position: relative;\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow: hidden;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 10px;\n  background: #fbfdff;\n  background-position: center;\n  background-size: cover;\n  background-repeat: no-repeat;\n  aspect-ratio: 16/9;\n  min-height: 128px;\n  box-shadow: 0 8px 18px rgba(24, 45, 73, 0.06);\n}\n.image-carousel__slot.is-primary {\n  border-color: rgba(204, 130, 27, 0.9);\n  box-shadow: inset 0 0 0 1px rgba(226, 158, 41, 0.46), 0 8px 18px rgba(154, 104, 27, 0.12);\n}\n.image-carousel__slot.is-selected {\n  border-color: #4d86c2;\n  box-shadow: inset 0 0 0 1px rgba(77, 134, 194, 0.36), 0 0 0 2px rgba(77, 134, 194, 0.18);\n}\n.image-carousel__slot.is-filled {\n  background-color: #f8fbff;\n  background-position: center top;\n  background-size: contain;\n}\n.image-carousel__slot.is-uploading {\n  cursor: progress;\n}\n.image-carousel__slot:not(.is-filled) {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    repeating-linear-gradient(\n      45deg,\n      rgba(47, 86, 139, 0.08) 0 9px,\n      transparent 9px 18px);\n}\n.image-carousel__slot-hit {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n}\n.image-carousel__slot-hit:disabled {\n  cursor: default;\n}\n.image-carousel__slot.is-uploading .image-carousel__slot-hit {\n  pointer-events: none;\n}\n.image-carousel__slot-index,\n.image-carousel__slot-add,\n.image-carousel__slot-action,\n.image-carousel__upload-ring {\n  position: absolute;\n  z-index: 2;\n}\n.image-carousel__slot-index {\n  display: grid;\n  place-items: center;\n  bottom: 0.28rem;\n  left: 0.32rem;\n  width: 1.08rem;\n  height: 1.08rem;\n  box-sizing: border-box;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background: rgba(10, 29, 55, 0.82);\n  color: #fff;\n  padding: 0;\n  font-size: 0.62rem;\n  font-weight: 900;\n  line-height: 1;\n  text-shadow: 0 1px 2px rgba(4, 15, 31, 0.7);\n  box-shadow: 0 4px 12px rgba(7, 20, 38, 0.2);\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n}\n.image-carousel__slot-add {\n  top: 50%;\n  left: 50%;\n  width: 34px;\n  height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.22);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.86);\n  color: rgba(37, 62, 96, 0.7);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 1.28rem;\n  font-weight: 800;\n  line-height: 1;\n  transform: translate(-50%, -50%);\n  pointer-events: none;\n  box-shadow: 0 8px 16px rgba(24, 45, 73, 0.08);\n}\n.image-carousel__slot-action {\n  position: absolute;\n  top: 0.24rem;\n  width: 22px;\n  height: 22px;\n  border: 1px solid rgba(42, 67, 101, 0.22);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.94);\n  color: #2c5d9e;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 8px 18px rgba(14, 30, 52, 0.16);\n}\n.image-carousel__slot-action--copy {\n  left: 0.24rem;\n}\n.image-carousel__slot-action--remove {\n  right: 0.24rem;\n  color: #9e3d4d;\n}\n.image-carousel__slot-action .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.image-carousel__upload-ring {\n  z-index: 4;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(244, 248, 253, 0.62);\n  -webkit-backdrop-filter: blur(1px);\n  backdrop-filter: blur(1px);\n}\n.image-carousel__slot-input {\n  display: none;\n}\n:host(.image-carousel-host--compact) .image-carousel {\n  --image-slot-gap: 0.48rem;\n  --image-carousel-footer-size: 1.2rem;\n  --image-carousel-footer-half: 0.6rem;\n  --image-carousel-arrow-half: 16px;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n}\n:host(.image-carousel-host--compact) .image-carousel__window {\n  border-radius: 10px;\n  padding: 0;\n  margin: 0;\n  clip-path: none;\n}\n:host(.image-carousel-host--compact) .image-carousel__strip {\n  transition-duration: 0.22s;\n}\n:host(.image-carousel-host--compact) .image-carousel__page {\n  padding: 0 0.14rem;\n}\n:host(.image-carousel-host--compact) .image-carousel__slot {\n  height: 112px;\n  min-height: 0;\n  aspect-ratio: auto;\n  background-size: cover;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);\n}\n:host(.image-carousel-host--compact) .image-carousel__slot:not(.is-filled) {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    radial-gradient(\n      circle at 50% 44%,\n      rgba(97, 131, 171, 0.12),\n      transparent 34%);\n}\n:host(.image-carousel-host--compact) .image-carousel__slot-index {\n  left: 0.24rem;\n  bottom: 0.24rem;\n  min-width: 18px;\n  width: auto;\n  height: 18px;\n  padding: 0 0.24rem;\n  font-size: 0.6rem;\n}\n:host(.image-carousel-host--compact) .image-carousel__slot-action {\n  top: 0.22rem;\n  width: 26px;\n  height: 26px;\n}\n:host(.image-carousel-host--compact) .image-carousel__slot-action--copy {\n  left: 0.22rem;\n}\n:host(.image-carousel-host--compact) .image-carousel__slot-action--remove {\n  right: 0.22rem;\n}\n:host(.image-carousel-host--compact) .image-carousel__upload-ring {\n  background: rgba(255, 255, 255, 0.6);\n}\n:host(.image-carousel-host--compact) .image-carousel__arrow {\n  width: 32px;\n  height: 32px;\n  background: #fff;\n  top: calc(50% - var(--image-carousel-footer-half) - var(--image-carousel-arrow-half));\n}\n:host(.image-carousel-host--compact) .image-carousel__dots {\n  bottom: -0.18rem;\n  gap: 0.18rem;\n}\n:host(.image-carousel-host--compact) .image-carousel__dot {\n  width: 8px;\n  height: 8px;\n}\n:host(.image-carousel-host--compact) .image-carousel__dot.is-active {\n  width: 24px;\n}\n@media (max-width: 760px) {\n  .image-carousel {\n    --image-slots-per-page: 1;\n    --image-carousel-footer-size: 1.82rem;\n    --image-carousel-edge-padding: 1px;\n    height: 240px;\n    min-height: 240px;\n    padding: 0 0.22rem 0;\n    overflow: visible;\n  }\n  .image-carousel__window {\n    height: 208px;\n    min-height: 208px;\n    padding: 0;\n    margin: 0;\n    overflow-x: auto;\n    overflow-y: hidden;\n    touch-action: pan-x pan-y;\n    scroll-snap-type: x mandatory;\n    scroll-behavior: smooth;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n    -webkit-overflow-scrolling: touch;\n    overscroll-behavior-x: contain;\n    clip-path: inset(0 round 12px);\n  }\n  .image-carousel__window::-webkit-scrollbar {\n    display: none;\n  }\n  .image-carousel__strip,\n  .image-carousel__page {\n    height: 100%;\n  }\n  .image-carousel__strip {\n    transition: none;\n    transform: none;\n  }\n  .image-carousel__page {\n    align-items: center;\n    scroll-snap-align: start;\n    scroll-snap-stop: always;\n    contain: layout paint style;\n  }\n  .image-carousel__slot-hit {\n    touch-action: pan-x pan-y;\n  }\n  .image-carousel__arrow {\n    top: 104px;\n    background: rgba(255, 255, 255, 0.86);\n    transform: translateY(-50%);\n  }\n  .image-carousel__arrow:not(:disabled):active {\n    animation: none;\n    transform: translateY(-50%) scale(0.96);\n    filter: brightness(0.97);\n  }\n  .image-carousel__slot {\n    height: 200px;\n    min-height: 0;\n    aspect-ratio: auto;\n  }\n  :host(.image-carousel-host--compact) .image-carousel {\n    height: 100%;\n    min-height: 0;\n    padding: 0;\n  }\n  :host(.image-carousel-host--compact) {\n    height: 200px;\n    min-height: 200px;\n    padding: 0.42rem;\n  }\n  :host(.image-carousel-host--compact) .image-carousel__window {\n    height: 168px;\n    min-height: 168px;\n  }\n  :host(.image-carousel-host--compact) .image-carousel__slot {\n    height: 160px;\n  }\n  :host(.image-carousel-host--compact) .image-carousel__arrow {\n    top: 78px;\n  }\n  :host(.image-carousel-host--compact) .image-carousel__arrow:not(:disabled):active {\n    transform: translateY(-50%) scale(0.96);\n  }\n  :host(.image-carousel-host--preview) .image-carousel {\n    height: 100%;\n    min-height: 0;\n  }\n  :host(.image-carousel-host--preview) .image-carousel__preview {\n    min-height: 96px;\n  }\n}\n:host(.image-carousel-host--media-fit-cover) .image-carousel__preview,\n:host(.image-carousel-host--media-fit-cover) .image-carousel__slot.is-filled {\n  background-size: cover;\n}\n:host(.image-carousel-host--media-fit-contain) .image-carousel__preview,\n:host(.image-carousel-host--media-fit-contain) .image-carousel__slot.is-filled {\n  background-size: contain;\n}\n:host(.image-carousel-host--image-position-center-top) .image-carousel__preview,\n:host(.image-carousel-host--image-position-center-top) .image-carousel__slot.is-filled {\n  background-position: center top;\n}\n:host(.image-carousel-host--image-position-center) .image-carousel__preview,\n:host(.image-carousel-host--image-position-center) .image-carousel__slot.is-filled {\n  background-position: center;\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) {\n  --image-single-slot-width: 280px;\n  --image-single-slot-height: 160px;\n  --image-single-slot-aspect-ratio: 7 / 4;\n  width: min(100%, var(--image-single-slot-width));\n  height: auto;\n  min-height: 0;\n  border: 0;\n  background: transparent;\n  padding: 0;\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) .image-carousel {\n  --image-slots-per-page: 1;\n  --image-carousel-footer-size: 0px;\n  --image-carousel-footer-half: 0px;\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) .image-carousel__carousel {\n  padding-bottom: 0;\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) .image-carousel__window,\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) .image-carousel__strip,\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) .image-carousel__page {\n  height: var(--image-single-slot-height);\n  min-height: var(--image-single-slot-height);\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) .image-carousel__page {\n  padding: 0;\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot) .image-carousel__slot {\n  height: var(--image-single-slot-height);\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) {\n  display: flex;\n  align-items: stretch;\n  justify-content: flex-start;\n  width: 100%;\n  aspect-ratio: auto;\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) .image-carousel,\n:host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) .image-carousel__carousel {\n  flex: var(--image-single-slot-content-flex, 0 1 auto);\n  width: var(--image-single-slot-content-width, auto);\n  max-width: 100%;\n  height: 100%;\n  aspect-ratio: var(--image-single-slot-aspect-ratio);\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) .image-carousel__window,\n:host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) .image-carousel__strip,\n:host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) .image-carousel__page {\n  height: 100%;\n  min-height: 0;\n}\n:host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) .image-carousel__slot {\n  height: 100%;\n  min-height: 0;\n  aspect-ratio: auto;\n}\n@media (max-width: 760px) {\n  :host(.image-carousel-host--compact.image-carousel-host--single-slot) {\n    width: 100%;\n    max-width: 100%;\n  }\n  :host(.image-carousel-host--compact.image-carousel-host--single-slot.image-carousel-host--auto-size) {\n    height: auto;\n    min-height: 0;\n  }\n}\n/*# sourceMappingURL=image-carousel.component.css.map */\n"] }]
  }], null, { carouselViewportRef: [{
    type: ViewChild,
    args: ["carouselViewport"]
  }], slotCount: [{
    type: Input
  }], disabled: [{
    type: Input
  }], compact: [{
    type: Input
  }], autoSize: [{
    type: Input
  }], previewMode: [{
    type: Input
  }], slotImageVariant: [{
    type: Input
  }], mediaFit: [{
    type: Input
  }], imagePosition: [{
    type: Input
  }], ariaLabel: [{
    type: Input
  }], uploadOwnerId: [{
    type: Input
  }], uploadEntityId: [{
    type: Input
  }], imageRemoved: [{
    type: Output
  }], hostClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host"]
  }], compactClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--compact"]
  }], autoSizeClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--auto-size"]
  }], previewClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--preview"]
  }], singleSlotClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--single-slot"]
  }], mediaFitCoverClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--media-fit-cover"]
  }], mediaFitContainClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--media-fit-contain"]
  }], imagePositionCenterTopClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--image-position-center-top"]
  }], imagePositionCenterClass: [{
    type: HostBinding,
    args: ["class.image-carousel-host--image-position-center"]
  }], onResize: [{
    type: HostListener,
    args: ["window:resize"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImageCarouselComponent, { className: "ImageCarouselComponent", filePath: "app/shared/ui/components/core/image-carousel/image-carousel.component.ts", lineNumber: 43 });
})();

export {
  ImageCarouselComponent
};
//# sourceMappingURL=chunk-RRRWUAB3.js.map
