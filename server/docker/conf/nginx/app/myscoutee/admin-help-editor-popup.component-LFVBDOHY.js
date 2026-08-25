import {
  ImageCarouselComponent
} from "./chunk-U7SHZOGZ.js";
import "./chunk-4VYYFWRA.js";
import {
  LazyBgImageDirective
} from "./chunk-RB7FL7JP.js";
import {
  PopupComponent
} from "./chunk-GBRBIJ5J.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuComponent,
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  IndicatorComponent,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-QD6QQNQX.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import {
  AdminMenuStore
} from "./chunk-ZJ74HL3J.js";
import {
  HelpCenterService
} from "./chunk-C2QYRRDX.js";
import "./chunk-Y3NEBFNQ.js";
import "./chunk-PB4YNHSN.js";
import "./chunk-VUN7WUNQ.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA
} from "./chunk-Y2Y4ZDHH.js";
import {
  I18nService
} from "./chunk-B7YPVC5F.js";
import {
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-MS7VTGLY.js";
import {
  CommonModule,
  NgClass
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-2IE5VYAT.js";
import "./chunk-B2DKYQGD.js";
import {
  UserProfileStore
} from "./chunk-INZQPXQM.js";
import "./chunk-IECLTXM5.js";
import "./chunk-333NTD7D.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstoreLet,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-XJL7SWH7.js";

// src/app/admin/components/help-editor-popup/admin-help-editor-popup.component.ts
var _c0 = () => ({ standalone: true });
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.localId;
var _forTrack2 = ($index, $item) => $item.value;
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "app-indicator", 3);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.loadingRevisionsLabel());
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 19);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 31)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "app-menu", 38);
    \u0275\u0275listener("itemSelect", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Conditional_9_Template_app_menu_itemSelect_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r0.onContextMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const editDraft_r3 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.uiText("Canonical screen"));
    \u0275\u0275advance();
    \u0275\u0275property("trigger", ctx_r0.contextMenuTrigger(editDraft_r3))("items", ctx_r0.contextMenuItems(editDraft_r3))("closeOnSelect", true);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 50);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_4_For_2_Template_button_click_0_listener($event) {
      const option_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const section_r7 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r0.setDraftSectionPanelSpan(section_r7, option_r9.value, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r9 = ctx.$implicit;
    const section_r7 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275classProp("is-active", section_r7.panelSpan === option_r9.value);
    \u0275\u0275property("title", option_r9.title);
    \u0275\u0275attribute("aria-pressed", section_r7.panelSpan === option_r9.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r9.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r9.label);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275repeaterCreate(1, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_4_For_2_Template, 5, 6, "button", 49, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(9);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.panelSpanOptions);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 51);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_5_Template_label_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(1, "input", 52);
    \u0275\u0275twoWayListener("ngModelChange", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_5_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const section_r7 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(section_r7.optional, $event) || (section_r7.optional = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span")(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r10 = \u0275\u0275nextContext();
    const section_r7 = ctx_r10.$implicit;
    const \u0275$index_112_r12 = ctx_r10.$index;
    \u0275\u0275classProp("is-optional", section_r7.optional)("is-mandatory", !section_r7.optional);
    \u0275\u0275advance();
    \u0275\u0275property("name", "sectionOptional" + \u0275$index_112_r12);
    \u0275\u0275twoWayProperty("ngModel", section_r7.optional);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(10, _c0));
    \u0275\u0275attribute("aria-label", section_r7.optional ? "Mark section mandatory" : "Mark section optional");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(section_r7.optional ? "check_circle" : "priority_high");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r7.optional ? "Optional" : "Mandatory");
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-image-carousel", 56);
    \u0275\u0275twoWayListener("ngModelChange", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_1_Template_app_image_carousel_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r13);
      const section_r7 = \u0275\u0275nextContext(2).$implicit;
      \u0275\u0275twoWayBindingSet(section_r7.imageUrls, $event) || (section_r7.imageUrls = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r10 = \u0275\u0275nextContext(2);
    const section_r7 = ctx_r10.$implicit;
    const \u0275$index_112_r12 = ctx_r10.$index;
    const ctx_r0 = \u0275\u0275nextContext(8);
    \u0275\u0275property("name", "sectionImages" + \u0275$index_112_r12);
    \u0275\u0275twoWayProperty("ngModel", section_r7.imageUrls);
    \u0275\u0275property("disabled", ctx_r0.saving)("compact", true)("uploadOwnerId", ctx_r0.actorUserId());
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "textarea", 57);
    \u0275\u0275twoWayListener("ngModelChange", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_2_Template_textarea_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const section_r7 = \u0275\u0275nextContext(2).$implicit;
      \u0275\u0275twoWayBindingSet(section_r7.contentHtml, $event) || (section_r7.contentHtml = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("paste", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_2_Template_textarea_paste_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const section_r7 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r0.formatPastedSectionHtml(section_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r10 = \u0275\u0275nextContext(2);
    const section_r7 = ctx_r10.$implicit;
    const \u0275$index_112_r12 = ctx_r10.$index;
    \u0275\u0275property("name", "sectionHtml" + \u0275$index_112_r12);
    \u0275\u0275twoWayProperty("ngModel", section_r7.contentHtml);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(3, _c0));
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r7 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(section_r7.blurb);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "h3", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_3_Conditional_3_Template, 2, 1, "p", 59);
    \u0275\u0275element(4, "div", 60);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(8);
    \u0275\u0275property("ngClass", ctx_r0.previewPanelSpanClass(section_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r7.title || ctx_r0.defaultUntitledContentSectionTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(section_r7.blurb ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.previewSectionLayoutClass(section_r7))("appLazyHtmlImages", true)("innerHTML", ctx_r0.previewSectionContentHtml(section_r7), \u0275\u0275sanitizeHtml);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275conditionalCreate(1, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_1_Template, 1, 5, "app-image-carousel", 53);
    \u0275\u0275conditionalCreate(2, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_2_Template, 1, 4, "textarea", 54)(3, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Conditional_3_Template, 5, 6, "div", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(8);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.documentKind === "explanation" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(section_r7.mode === "html" ? 2 : 3);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 39)(1, "div", 40)(2, "app-menu", 41);
    \u0275\u0275listener("itemSelect", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Template_app_menu_itemSelect_2_listener($event) {
      const section_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r0.onSectionIconMenuSelect(section_r7, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 42);
    \u0275\u0275twoWayListener("ngModelChange", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Template_input_ngModelChange_3_listener($event) {
      const section_r7 = \u0275\u0275restoreView(_r6).$implicit;
      \u0275\u0275twoWayBindingSet(section_r7.title, $event) || (section_r7.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_4_Template, 3, 0, "div", 43);
    \u0275\u0275conditionalCreate(5, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_5_Template, 7, 11, "label", 44);
    \u0275\u0275elementStart(6, "button", 45);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Template_button_click_6_listener($event) {
      const section_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r0.toggleDraftSectionMode(section_r7, $event));
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 46);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Template_button_click_11_listener($event) {
      const section_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r0.removeDraftSection(section_r7, $event));
    });
    \u0275\u0275elementStart(12, "mat-icon");
    \u0275\u0275text(13, "delete");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "button", 47);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Template_button_click_14_listener($event) {
      const section_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r0.toggleDraftSection(section_r7, $event));
    });
    \u0275\u0275elementStart(15, "mat-icon", 23);
    \u0275\u0275text(16, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(17, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Conditional_17_Template, 4, 2, "div", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r7 = ctx.$implicit;
    const \u0275$index_112_r12 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(8);
    \u0275\u0275classProp("is-open", ctx_r0.openDraftSectionId === section_r7.localId)("is-privacy-mandatory", ctx_r0.documentKind === "privacy" && !section_r7.optional)("is-privacy-optional", ctx_r0.documentKind === "privacy" && section_r7.optional);
    \u0275\u0275advance(2);
    \u0275\u0275property("trigger", ctx_r0.sectionIconMenuTrigger(section_r7))("model", ctx_r0.sectionIconMenuModel(section_r7))("filterable", true)("closeOnSelect", true);
    \u0275\u0275advance();
    \u0275\u0275property("name", "sectionTitle" + \u0275$index_112_r12);
    \u0275\u0275twoWayProperty("ngModel", section_r7.title);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(24, _c0));
    \u0275\u0275attribute("aria-label", ctx_r0.sectionTitleAriaLabel());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.documentKind === "explanation" ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.documentKind === "privacy" ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("title", section_r7.mode === "html" ? "Switch to preview" : "Switch to HTML");
    \u0275\u0275attribute("aria-label", section_r7.mode === "html" ? "Switch to preview" : "Switch to HTML");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r7.mode === "html" ? "code" : "visibility");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r7.mode === "html" ? "HTML" : "Preview");
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.removeSectionLabel());
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-expanded", ctx_r0.openDraftSectionId === section_r7.localId)("aria-label", ctx_r0.toggleSectionLabel());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.openDraftSectionId === section_r7.localId ? 17 : -1);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 25)(2, "div", 26)(3, "div", 27)(4, "label", 28)(5, "span");
    \u0275\u0275text(6, "Header");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 29);
    \u0275\u0275twoWayListener("ngModelChange", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r4);
      const editDraft_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(editDraft_r3.summary, $event) || (editDraft_r3.summary = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "app-menu", 30);
    \u0275\u0275listener("itemSelect", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Template_app_menu_itemSelect_8_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r0.onHeaderColorMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Conditional_9_Template, 4, 4, "label", 31);
    \u0275\u0275elementStart(10, "div", 32)(11, "label", 33)(12, "span");
    \u0275\u0275text(13, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "textarea", 34);
    \u0275\u0275twoWayListener("ngModelChange", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Template_textarea_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r4);
      const editDraft_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(editDraft_r3.description, $event) || (editDraft_r3.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 35);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Template_button_click_15_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r0.addDraftSection($event));
    });
    \u0275\u0275elementStart(16, "mat-icon");
    \u0275\u0275text(17, "add");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(18, "div", 36);
    \u0275\u0275repeaterCreate(19, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_For_20_Template, 18, 25, "article", 37, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const editDraft_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.headerColorClass(editDraft_r3.headerColor));
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", editDraft_r3.summary);
    \u0275\u0275property("placeholder", ctx_r0.popupHeaderPlaceholder());
    \u0275\u0275advance();
    \u0275\u0275property("trigger", ctx_r0.headerColorMenuTrigger(editDraft_r3.headerColor))("items", ctx_r0.headerColorMenuItems(editDraft_r3.headerColor));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.documentKind === "explanation" ? 9 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", editDraft_r3.description);
    \u0275\u0275property("placeholder", ctx_r0.descriptionPlaceholder());
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", ctx_r0.addSectionLabel());
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", ctx_r0.editableSectionsAriaLabel());
    \u0275\u0275advance();
    \u0275\u0275repeater(editDraft_r3.sections);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Template_form_ngSubmit_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r0.saveDraft($event));
    });
    \u0275\u0275elementStart(1, "article", 11)(2, "div", 12)(3, "div", 13)(4, "span", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 15)(7, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Template_input_ngModelChange_7_listener($event) {
      const editDraft_r3 = \u0275\u0275restoreView(_r2);
      \u0275\u0275twoWayBindingSet(editDraft_r3.title, $event) || (editDraft_r3.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 17)(9, "span", 18);
    \u0275\u0275conditionalCreate(10, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_10_Template, 1, 0, "app-indicator", 19);
    \u0275\u0275elementStart(11, "button", 20)(12, "mat-icon");
    \u0275\u0275text(13, "check");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "button", 21);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Template_button_click_14_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r0.cancelEditing($event));
    });
    \u0275\u0275elementStart(15, "mat-icon");
    \u0275\u0275text(16, "close");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "button", 22);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Template_button_click_17_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r0.toggleDraftRevision($event));
    });
    \u0275\u0275elementStart(18, "mat-icon", 23);
    \u0275\u0275text(19, "expand_more");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(20, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Conditional_20_Template, 21, 10, "div", 24);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-open", ctx_r0.draftAccordionOpen);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.draftVersionLabel());
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx.title);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("is-loading", ctx_r0.saving);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.saving ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.saving)("title", ctx_r0.saving ? "Saving revision" : "Save v" + ctx_r0.nextRevisionVersion());
    \u0275\u0275attribute("aria-label", ctx_r0.saving ? "Saving revision" : "Save v" + ctx_r0.nextRevisionVersion());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.saving);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-expanded", ctx_r0.draftAccordionOpen);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.draftAccordionOpen ? 20 : -1);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Conditional_0_Template, 21, 13, "form", 9);
  }
  if (rf & 2) {
    let tmp_15_0;
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275conditional((tmp_15_0 = ctx_r0.draft) ? 0 : -1, tmp_15_0);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 67);
    \u0275\u0275text(1, "Active");
    \u0275\u0275elementEnd();
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 19);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_For_3_Conditional_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r18 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(section_r18.blurb);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_For_3_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 77)(1, "div", 55)(2, "h3", 58);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_For_3_Conditional_9_Conditional_4_Template, 2, 1, "p", 59);
    \u0275\u0275element(5, "div", 60);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const section_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(7);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.previewPanelSpanClass(section_r18));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r18.title || ctx_r0.defaultUntitledContentSectionTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(section_r18.blurb ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.previewSectionLayoutClass(section_r18))("appLazyHtmlImages", true)("innerHTML", ctx_r0.previewSectionContentHtml(section_r18), \u0275\u0275sanitizeHtml);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 75)(1, "button", 76);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_For_3_Template_button_click_1_listener($event) {
      const section_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r0.togglePreviewSection(section_r18.id, $event));
    });
    \u0275\u0275elementStart(2, "span")(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong", 66);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-icon", 23);
    \u0275\u0275text(8, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_For_3_Conditional_9_Template, 6, 6, "div", 77);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r18 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(7);
    \u0275\u0275classProp("is-open", ctx_r0.openPreviewSectionId === section_r18.id)("is-privacy-mandatory", ctx_r0.documentKind === "privacy" && !section_r18.optional)("is-privacy-optional", ctx_r0.documentKind === "privacy" && section_r18.optional);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-expanded", ctx_r0.openPreviewSectionId === section_r18.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(section_r18.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r18.title);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.openPreviewSectionId === section_r18.id ? 9 : -1);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73)(1, "div", 36);
    \u0275\u0275repeaterCreate(2, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_For_3_Template, 10, 10, "article", 74, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const revision_r16 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(revision_r16.sections);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 61)(1, "div", 62);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template_div_click_1_listener($event) {
      const revision_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.toggleRevision(revision_r16, $event));
    });
    \u0275\u0275elementStart(2, "button", 63);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template_button_click_2_listener($event) {
      const revision_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.toggleRevision(revision_r16, $event));
    });
    \u0275\u0275elementStart(3, "span", 64);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 65)(6, "strong", 66);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(10, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_10_Template, 2, 0, "span", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 68)(12, "button", 69);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template_button_click_12_listener($event) {
      const revision_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.startEditingRevision(revision_r16, $event));
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "span", 18);
    \u0275\u0275conditionalCreate(16, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_16_Template, 1, 0, "app-indicator", 19);
    \u0275\u0275elementStart(17, "button", 70);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template_button_click_17_listener($event) {
      const revision_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.activateRevision(revision_r16, $event));
    });
    \u0275\u0275elementStart(18, "mat-icon");
    \u0275\u0275text(19, "published_with_changes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "button", 71);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template_button_click_20_listener($event) {
      const revision_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.deleteRevision(revision_r16, $event));
    });
    \u0275\u0275elementStart(21, "mat-icon");
    \u0275\u0275text(22, "delete");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "button", 72);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template_button_click_23_listener($event) {
      const revision_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.toggleRevision(revision_r16, $event));
    });
    \u0275\u0275elementStart(24, "mat-icon", 23);
    \u0275\u0275text(25, "expand_more");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(26, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_26_Template, 4, 0, "div", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const revision_r16 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275classProp("is-open", ctx_r0.isRevisionOpen(revision_r16))("is-active", revision_r16.active);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("aria-expanded", ctx_r0.isRevisionOpen(revision_r16));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("v", revision_r16.version);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(revision_r16.summary || revision_r16.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.revisionSubtitle(revision_r16));
    \u0275\u0275advance();
    \u0275\u0275conditional(revision_r16.active ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.saving || !!ctx_r0.activatingRevisionId);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("is-loading", ctx_r0.activatingRevisionId === revision_r16.id);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.activatingRevisionId === revision_r16.id ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", revision_r16.active || ctx_r0.saving || !!ctx_r0.activatingRevisionId);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.saving || !!ctx_r0.activatingRevisionId);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-expanded", ctx_r0.isRevisionOpen(revision_r16));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.isRevisionOpen(revision_r16) ? 26 : -1);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_0_Template, 1, 1)(1, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Conditional_1_Template, 27, 17, "article", 8);
  }
  if (rf & 2) {
    let tmp_14_0;
    const row_r19 = ctx.$implicit;
    \u0275\u0275conditional(row_r19.kind === "draft" ? 0 : (tmp_14_0 = row_r19.revision) ? 1 : -1, tmp_14_0);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275repeaterCreate(1, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_For_2_Template, 2, 1, null, null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const rows_r20 = \u0275\u0275readContextLet(2);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r0.revisionsAriaLabel());
    \u0275\u0275advance();
    \u0275\u0275repeater(rows_r20);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 78);
    \u0275\u0275listener("click", function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_4_Template_button_click_7_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.startNewRevision($event));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "Create revision");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.defaultSectionIcon());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.noRevisionsLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.createRevisionToEnablePopupLabel());
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_0_Template, 5, 1, "div", 4);
    \u0275\u0275elementStart(1, "section", 5);
    \u0275\u0275declareLet(2);
    \u0275\u0275conditionalCreate(3, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_3_Template, 3, 1, "div", 6)(4, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Conditional_4_Template, 12, 3, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.error ? 0 : -1);
    \u0275\u0275advance(2);
    const rows_r22 = \u0275\u0275storeLet(ctx_r0.revisionRows());
    \u0275\u0275advance();
    \u0275\u0275conditional(rows_r22.length > 0 ? 3 : 4);
  }
}
function AdminHelpEditorPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1);
    \u0275\u0275conditionalCreate(2, AdminHelpEditorPopupComponent_Conditional_0_Conditional_2_Template, 4, 1, "div", 2)(3, AdminHelpEditorPopupComponent_Conditional_0_Conditional_3_Template, 5, 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r0.helpEditorPopupModel());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.loading() ? 2 : 3);
  }
}
var AdminHelpEditorPopupComponent = class _AdminHelpEditorPopupComponent {
  static IMAGE_LIMIT = 8;
  static LAZY_IMAGE_PLACEHOLDER_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  static FALLBACK_SPAN_2_SECTION_IDS = /* @__PURE__ */ new Set([
    "affinity-network",
    "activity-chat-message-window",
    "assets-editor",
    "assets-requests",
    "event-editor-main",
    "event-editor-subevents"
  ]);
  static VOID_HTML_TAGS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  admin = inject(AdminMenuStore);
  userProfileStore = inject(UserProfileStore);
  helpCenter = inject(HelpCenterService);
  dialogStore = inject(DialogStore);
  i18n = inject(I18nService);
  changeDetectorRef = inject(ChangeDetectorRef);
  documentKind = "help";
  selectedContentLang = "en";
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  saving = false;
  activatingRevisionId = "";
  error = "";
  selectedRevisionId = "";
  openRevisionId = "";
  openPreviewSectionId = "";
  editing = false;
  draft = null;
  draftAccordionOpen = true;
  openDraftSectionId = "";
  selectedExplanationContextKey = "home.game";
  helpEditorPopupModel() {
    return {
      title: this.editorTitle(),
      subtitle: this.activeRevisionSubtitle(),
      ariaLabel: this.editorTitle(),
      closeAriaLabel: this.uiText("Close content editor"),
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: [
        {
          kind: "menu",
          id: "help-document",
          menuKind: "inline",
          model: this.documentMenuModel(),
          panelAlign: "end"
        }
      ],
      headerActions: [
        {
          id: "help-new-revision",
          icon: "add",
          ariaLabel: this.createRevisionLabel(),
          palette: "green",
          disabled: this.loading() || this.isAnyActionPending(),
          compactOnMobile: true
        }
      ],
      toolbarControls: [
        {
          kind: "menu",
          id: "help-language",
          align: "end",
          menuKind: "inline",
          model: this.languageMenuModel(),
          panelAlign: "end"
        }
      ],
      onClose: () => this.close(),
      onAction: (event) => this.onHelpEditorPopupAction(event),
      onMenuSelect: (event) => void this.onHelpEditorPopupMenuSelect(event)
    };
  }
  documentMenuModel() {
    const disabled = this.loading() || this.isAnyActionPending();
    return {
      nodes: [
        {
          id: "document-menu-root",
          items: [
            {
              id: "document-menu",
              kind: "select-trigger",
              label: this.uiDocumentLabel(),
              icon: this.documentIcon(this.documentKind),
              palette: this.documentPalette(this.documentKind),
              disabled,
              ariaLabel: this.uiText("Select content type"),
              items: [
                this.documentMenuKindItem("help", disabled),
                this.documentMenuKindItem("privacy", disabled),
                this.documentMenuKindItem("terms", disabled),
                {
                  id: "explanations",
                  kind: "branch",
                  label: this.uiText("Explanations"),
                  icon: "tips_and_updates",
                  palette: "violet",
                  active: this.documentKind === "explanation",
                  disabled,
                  items: this.explainableSurfaces().map((surface) => this.explanationMenuSurfaceItem(surface, disabled)),
                  headerActions: [
                    {
                      id: "create-explanation",
                      icon: "add",
                      palette: "success",
                      ariaLabel: this.uiText("Create explanation popup"),
                      context: { action: "create-explanation" }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }
  languageMenuModel() {
    const disabled = this.loading() || this.isAnyActionPending();
    return {
      nodes: [
        {
          id: "language-menu-root",
          items: [
            {
              id: "language-menu",
              kind: "select-trigger",
              label: this.languageMenuItemLabel(this.selectedContentLang),
              palette: this.languagePalette(this.selectedContentLang),
              disabled,
              ariaLabel: "Content language",
              items: this.contentLanguages().map((language) => ({
                id: `language:${this.normalizeContentLang(language.lang)}`,
                kind: "radio",
                label: this.languageMenuItemLabel(language.lang),
                palette: this.languagePalette(language.lang),
                surface: "tinted",
                checked: this.normalizeContentLang(language.lang) === this.selectedContentLang,
                disabled,
                context: {
                  action: "select-language",
                  lang: language.lang
                }
              }))
            }
          ]
        }
      ]
    };
  }
  stateLoadedForPopup = false;
  panelSpanOptions = [
    { value: "span-1", icon: "looks_one", label: "span-1", title: "One grid column" },
    { value: "span-2", icon: "looks_two", label: "span-2", title: "Two grid columns" },
    { value: "span-3", icon: "view_stream", label: "span-3", title: "Full row" }
  ];
  defaultHelpDescription = APP_STATIC_DATA.defaultHelpCenterDescription;
  defaultPrivacyDescription = APP_STATIC_DATA.defaultPrivacyCenterDescription;
  defaultTermsDescription = APP_STATIC_DATA.defaultTermsCenterDescription;
  headerColorOptions = APP_STATIC_DATA.helpCenterHeaderColorOptions;
  iconPickerGroups = ["Common", "Planning", "People", "Logistics", "Safety"];
  helpIconOptions = [
    { icon: "help_outline", label: "Help", group: "Common", keywords: ["support", "question", "guide"] },
    { icon: "info", label: "Info", group: "Common", keywords: ["about", "details", "notice"] },
    { icon: "tips_and_updates", label: "Tips", group: "Common", keywords: ["hint", "idea", "learn"] },
    { icon: "menu_book", label: "Guide", group: "Common", keywords: ["manual", "docs", "read"] },
    { icon: "article", label: "Article", group: "Common", keywords: ["page", "content", "document"] },
    { icon: "edit_note", label: "Notes", group: "Common", keywords: ["write", "edit", "draft"] },
    { icon: "question_answer", label: "Questions", group: "Common", keywords: ["faq", "answer", "support"] },
    { icon: "contact_support", label: "Contact support", group: "Common", keywords: ["helpdesk", "service", "agent"] },
    { icon: "lightbulb", label: "Idea", group: "Common", keywords: ["tip", "hint", "suggestion"] },
    { icon: "school", label: "Learn", group: "Common", keywords: ["training", "education", "lesson"] },
    { icon: "auto_stories", label: "Stories", group: "Common", keywords: ["book", "guide", "reading"] },
    { icon: "fact_check", label: "Fact check", group: "Common", keywords: ["verify", "check", "review"] },
    { icon: "event_note", label: "Events", group: "Planning", keywords: ["calendar", "schedule", "sub event"] },
    { icon: "local_activity", label: "Activities", group: "Planning", keywords: ["ticket", "program", "session"] },
    { icon: "checklist", label: "Checklist", group: "Planning", keywords: ["todo", "task", "steps"] },
    { icon: "task_alt", label: "Tasks", group: "Planning", keywords: ["complete", "done", "status"] },
    { icon: "route", label: "Route", group: "Planning", keywords: ["path", "flow", "journey"] },
    { icon: "map", label: "Map", group: "Planning", keywords: ["location", "place", "area"] },
    { icon: "calendar_month", label: "Calendar", group: "Planning", keywords: ["date", "month", "schedule"] },
    { icon: "event_available", label: "Event ready", group: "Planning", keywords: ["confirmed", "available", "date"] },
    { icon: "date_range", label: "Date range", group: "Planning", keywords: ["start", "end", "period"] },
    { icon: "timeline", label: "Timeline", group: "Planning", keywords: ["sequence", "flow", "history"] },
    { icon: "account_tree", label: "Structure", group: "Planning", keywords: ["hierarchy", "tree", "sub event"] },
    { icon: "flag", label: "Milestone", group: "Planning", keywords: ["goal", "marker", "stage"] },
    { icon: "category", label: "Category", group: "Planning", keywords: ["type", "group", "segment"] },
    { icon: "playlist_add_check", label: "Plan check", group: "Planning", keywords: ["list", "ready", "steps"] },
    { icon: "groups", label: "Groups", group: "People", keywords: ["team", "members", "participants"] },
    { icon: "person", label: "Profile", group: "People", keywords: ["user", "identity", "account"] },
    { icon: "admin_panel_settings", label: "Admin", group: "People", keywords: ["manager", "owner", "permission"] },
    { icon: "diversity_3", label: "Community", group: "People", keywords: ["social", "friends", "network"] },
    { icon: "forum", label: "Chat", group: "People", keywords: ["conversation", "message", "talk"] },
    { icon: "support_agent", label: "Support", group: "People", keywords: ["helpdesk", "contact", "service"] },
    { icon: "person_add", label: "Invite", group: "People", keywords: ["add", "member", "guest"] },
    { icon: "manage_accounts", label: "Manage accounts", group: "People", keywords: ["profile", "settings", "users"] },
    { icon: "badge", label: "Badge", group: "People", keywords: ["identity", "credential", "role"] },
    { icon: "how_to_reg", label: "Registration", group: "People", keywords: ["signup", "join", "approved"] },
    { icon: "supervisor_account", label: "Hosts", group: "People", keywords: ["admin", "leaders", "owners"] },
    { icon: "group_add", label: "Add group", group: "People", keywords: ["invite", "team", "members"] },
    { icon: "record_voice_over", label: "Announcements", group: "People", keywords: ["speak", "message", "broadcast"] },
    { icon: "volunteer_activism", label: "Care", group: "People", keywords: ["support", "community", "help"] },
    { icon: "inventory_2", label: "Resources", group: "Logistics", keywords: ["asset", "capacity", "supplies"] },
    { icon: "directions_car", label: ASSET_TYPE_TRANSPORT, group: "Logistics", keywords: ["transport", "travel", "vehicle"] },
    { icon: "apartment", label: ASSET_TYPE_ACCOMMODATION, group: "Logistics", keywords: ["accommodation", "room", "hotel"] },
    { icon: "restaurant", label: "Food", group: "Logistics", keywords: ["meal", "catering", "dining"] },
    { icon: "payments", label: "Payments", group: "Logistics", keywords: ["price", "money", "cost"] },
    { icon: "qr_code_2", label: "Tickets", group: "Logistics", keywords: ["qr", "pass", "entry"] },
    { icon: "warehouse", label: "Warehouse", group: "Logistics", keywords: ["storage", "stock", "inventory"] },
    { icon: "luggage", label: "Luggage", group: "Logistics", keywords: ["bag", "travel", "equipment"] },
    { icon: "hotel", label: "Hotel", group: "Logistics", keywords: ["room", "bed", "sleep"] },
    { icon: "flight", label: "Flight", group: "Logistics", keywords: ["air", "travel", "transport"] },
    { icon: "train", label: "Train", group: "Logistics", keywords: ["rail", "travel", "transport"] },
    { icon: "local_shipping", label: "Shipping", group: "Logistics", keywords: ["delivery", "truck", "move"] },
    { icon: "build", label: "Tools", group: "Logistics", keywords: ["fix", "setup", "equipment"] },
    { icon: "construction", label: "Construction", group: "Logistics", keywords: ["work", "setup", "build"] },
    { icon: "room_service", label: "Service", group: "Logistics", keywords: ["hospitality", "food", "support"] },
    { icon: "shopping_bag", label: ASSET_TYPE_SUPPLIES, group: "Logistics", keywords: ["items", "goods", "purchase"] },
    { icon: "verified_user", label: "Verified", group: "Safety", keywords: ["trust", "profile", "approved"] },
    { icon: "shield", label: "Shield", group: "Safety", keywords: ["safe", "protect", "security"] },
    { icon: "policy", label: "Policy", group: "Safety", keywords: ["rules", "moderation", "terms"] },
    { icon: "health_and_safety", label: "Health", group: "Safety", keywords: ["care", "emergency", "medical"] },
    { icon: "lock", label: "Privacy", group: "Safety", keywords: ["private", "secure", "access"] },
    { icon: "report", label: "Report", group: "Safety", keywords: ["flag", "issue", "warning"] },
    { icon: "security", label: "Security", group: "Safety", keywords: ["protect", "guard", "safe"] },
    { icon: "privacy_tip", label: "Privacy tip", group: "Safety", keywords: ["data", "safe", "notice"] },
    { icon: "lock_open", label: "Unlock", group: "Safety", keywords: ["access", "permission", "open"] },
    { icon: "visibility", label: "Visible", group: "Safety", keywords: ["show", "view", "public"] },
    { icon: "visibility_off", label: "Hidden", group: "Safety", keywords: ["private", "hide", "restricted"] },
    { icon: "emergency", label: "Emergency", group: "Safety", keywords: ["urgent", "alert", "medical"] },
    { icon: "warning", label: "Warning", group: "Safety", keywords: ["alert", "risk", "attention"] },
    { icon: "block", label: "Blocked", group: "Safety", keywords: ["deny", "stop", "ban"] },
    { icon: "rule", label: "Rules", group: "Safety", keywords: ["policy", "terms", "check"] },
    { icon: "gavel", label: "Decision", group: "Safety", keywords: ["moderation", "rules", "legal"] }
  ];
  constructor() {
    effect(() => {
      if (this.admin.activePopup() !== "help-editor") {
        this.stateLoadedForPopup = false;
        this.editing = false;
        this.draft = null;
        this.loading.set(false);
        return;
      }
      if (!this.stateLoadedForPopup) {
        this.stateLoadedForPopup = true;
        void this.load();
      }
    });
  }
  async load() {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);
    this.error = "";
    try {
      const adminUserId = this.actorUserId();
      const stateLoads = [
        this.helpCenter.loadAdminState(adminUserId, this.documentKind, this.selectedContentLang, this.documentKind === "explanation" ? null : this.selectedExplanationContextKey)
      ];
      if (this.documentKind !== "explanation") {
        stateLoads.push(this.helpCenter.loadAdminState(adminUserId, "explanation", this.selectedContentLang, null));
      }
      await Promise.all(stateLoads);
      this.selectInitialRevision(this.revisions(), this.activeRevision());
    } catch {
      this.error = this.loadErrorLabel();
    } finally {
      this.loading.set(false);
    }
  }
  onHelpEditorPopupAction(event) {
    if (event.action.id === "help-new-revision") {
      this.startNewRevision(event.sourceEvent);
    }
  }
  async onHelpEditorPopupMenuSelect(event) {
    const context = event.itemSelect.context;
    if (!context) {
      return;
    }
    if (context.action === "select-language") {
      await this.selectContentLanguage(context.lang, event.itemSelect.sourceEvent);
      return;
    }
    if (context.action === "select-document" && context.documentKind) {
      await this.selectDocumentKind(context.documentKind, event.itemSelect.sourceEvent);
      return;
    }
    if (context.action === "select-explanation" && context.surface) {
      await this.selectExplanationSurface(context.surface, event.itemSelect.sourceEvent);
      return;
    }
    if (context.action === "create-explanation") {
      await this.createExplanationItem(event.itemSelect.sourceEvent);
    }
  }
  documentMenuKindItem(kind, disabled) {
    return {
      id: kind,
      kind: "radio",
      label: this.uiText(this.documentMenuKindLabel(kind)),
      icon: this.documentIcon(kind),
      palette: this.documentPalette(kind),
      surface: "tinted",
      checked: this.documentKind === kind,
      disabled,
      context: {
        action: "select-document",
        documentKind: kind
      }
    };
  }
  explanationMenuSurfaceItem(surface, disabled) {
    return {
      id: `explanation:${surface.key}`,
      kind: "radio",
      label: this.explanationMenuItemLabel(surface),
      description: `${surface.label} \xB7 ${this.explanationMenuItemMeta(surface)}`,
      icon: surface.icon,
      palette: this.explanationSurfacePalette(surface),
      surface: "tinted",
      checked: this.documentKind === "explanation" && this.selectedExplanationContextKey === surface.key,
      disabled,
      context: {
        action: "select-explanation",
        surface
      }
    };
  }
  async selectDocumentKind(kind, event) {
    event?.stopPropagation();
    if (this.documentKind === kind || this.loading() || this.isAnyActionPending()) {
      return;
    }
    this.documentKind = kind;
    this.editing = false;
    this.draft = null;
    this.draftAccordionOpen = true;
    this.selectedRevisionId = "";
    this.openRevisionId = "";
    this.openPreviewSectionId = "";
    this.openDraftSectionId = "";
    this.error = "";
    await this.load();
  }
  contentLanguages() {
    return this.currentState()?.availableLanguages?.length ? this.currentState().availableLanguages : APP_STATIC_DATA.contentLanguages;
  }
  explainableSurfaces() {
    return [...APP_STATIC_DATA.explainableSurfaces].filter((surface) => surface.enabled).sort((left, right) => left.order - right.order);
  }
  selectedExplanationSurface() {
    return this.explainableSurfaces().find((surface) => surface.key === this.selectedExplanationContextKey) ?? null;
  }
  explanationSurfaceLabel(contextKey) {
    return this.explanationSurface(contextKey)?.label ?? "Home cards";
  }
  explanationSurface(contextKey) {
    const normalized = `${contextKey ?? ""}`.trim();
    if (!normalized) {
      return null;
    }
    return this.explainableSurfaces().find((surface) => surface.key === normalized) ?? null;
  }
  explanationMenuItemLabel(surface) {
    const draft = this.documentKind === "explanation" && this.editing && this.draft?.contextKey === surface.key ? this.draft : null;
    if (draft?.title?.trim()) {
      return draft.title.trim();
    }
    const revision = this.explanationRevisionForSurface(surface);
    return revision?.title?.trim() || surface.label;
  }
  explanationMenuItemMeta(surface) {
    const revision = this.explanationRevisionForSurface(surface);
    return revision ? `v${revision.version}` : "No popup";
  }
  selectDraftContext(contextKey) {
    const normalized = this.normalizeExplanationContextKey(contextKey);
    this.selectedExplanationContextKey = normalized;
    if (this.draft) {
      this.draft.contextKey = normalized;
    }
  }
  contextMenuTrigger(draft) {
    const surface = this.explanationSurface(draft.contextKey);
    return {
      id: "canonical-screen-menu",
      label: surface?.label ?? this.uiText("Choose screen"),
      icon: surface?.icon ?? "add",
      ariaLabel: this.uiText("Canonical screen"),
      layout: "field",
      palette: surface ? this.explanationSurfacePalette(surface) : "amber",
      disabled: this.loading() || this.saving || this.isAnyActionPending()
    };
  }
  contextMenuItems(draft) {
    const disabled = this.loading() || this.saving || this.isAnyActionPending();
    return this.explainableSurfaces().map((surface) => ({
      id: `context:${surface.key}`,
      kind: "radio",
      label: surface.label,
      description: this.explanationMenuItemMeta(surface),
      icon: surface.icon,
      palette: this.explanationSurfacePalette(surface),
      surface: "tinted",
      checked: draft.contextKey === surface.key,
      disabled: disabled || !surface.enabled,
      closeOnSelect: true,
      context: {
        action: "select-draft-context",
        surface
      }
    }));
  }
  onContextMenuSelect(event) {
    const surface = event.context?.surface;
    if (!surface || this.saving || !surface.enabled) {
      return;
    }
    this.selectDraftContext(surface.key);
  }
  selectedContentLanguageLabel() {
    return this.contentLanguages().find((language) => language.lang === this.selectedContentLang)?.label ?? "English";
  }
  contentLanguageFlag(lang) {
    const flags = { en: "\u{1F1EC}\u{1F1E7}", hu: "\u{1F1ED}\u{1F1FA}" };
    return flags[this.normalizeContentLang(lang)] ?? "\u{1F310}";
  }
  languageMenuItemLabel(lang) {
    const normalized = this.normalizeContentLang(lang);
    const label = this.contentLanguages().find((language) => this.normalizeContentLang(language.lang) === normalized)?.label ?? normalized.toUpperCase();
    return `${this.contentLanguageFlag(normalized)} ${label}`;
  }
  async selectContentLanguage(lang, event) {
    event?.stopPropagation();
    const normalized = this.normalizeContentLang(lang);
    if (normalized === this.selectedContentLang || this.loading() || this.isAnyActionPending()) {
      return;
    }
    const reopenEditor = this.editing;
    this.selectedContentLang = normalized;
    this.editing = false;
    this.draft = null;
    this.draftAccordionOpen = true;
    this.selectedRevisionId = "";
    this.openRevisionId = "";
    this.openPreviewSectionId = "";
    this.openDraftSectionId = "";
    this.error = "";
    await this.load();
    if (reopenEditor && !this.error) {
      const revision = this.selectedRevision();
      this.beginEditingDraft(revision ? this.draftFromRevision(revision) : this.emptyDraft());
    }
  }
  close() {
    this.editing = false;
    this.draft = null;
    this.draftAccordionOpen = true;
    this.admin.closePopup();
  }
  async selectExplanationSurface(surface, event) {
    event?.stopPropagation();
    if (this.loading() || this.isAnyActionPending() || !surface.enabled) {
      return;
    }
    const wasExplanation = this.documentKind === "explanation";
    this.selectedExplanationContextKey = surface.key;
    await this.selectDocumentKind("explanation", event);
    if (wasExplanation && this.documentKind === "explanation") {
      await this.load();
    }
  }
  async createExplanationItem(event) {
    event?.stopPropagation();
    if (this.loading() || this.isAnyActionPending()) {
      return;
    }
    this.selectedExplanationContextKey = "";
    this.selectedRevisionId = "";
    this.openRevisionId = "";
    this.openPreviewSectionId = "";
    if (this.documentKind !== "explanation") {
      await this.selectDocumentKind("explanation", event);
    } else {
      await this.load();
    }
    this.beginEditingDraft(this.emptyDraft(null));
  }
  currentState() {
    if (this.documentKind === "privacy") {
      return this.helpCenter.privacyState();
    }
    if (this.documentKind === "terms") {
      return this.helpCenter.termsState();
    }
    if (this.documentKind === "explanation") {
      return this.helpCenter.explanationState();
    }
    return this.helpCenter.state();
  }
  revisions() {
    const revisions = this.currentState()?.revisions ?? [];
    if (this.documentKind !== "explanation") {
      return revisions;
    }
    return revisions.filter((revision) => this.normalizeExplanationContextKey(revision.contextKey) === this.selectedExplanationContextKey);
  }
  revisionRows() {
    const revisions = this.revisions();
    const active = this.activeRevision();
    const activeId = active?.id ?? "";
    const draft = this.editing ? this.draft : null;
    const rows = [];
    const inactiveRevisions = revisions.filter((revision) => revision.id !== activeId).sort((left, right) => right.version - left.version);
    if (active) {
      rows.push(this.revisionRow(active));
    }
    if (draft) {
      rows.push(this.draftRow());
    }
    for (const revision of inactiveRevisions) {
      rows.push(this.revisionRow(revision));
    }
    return rows;
  }
  activeRevision() {
    const active = this.currentState()?.activeRevision ?? null;
    if (this.documentKind !== "explanation") {
      return active;
    }
    if (active && this.normalizeExplanationContextKey(active.contextKey) === this.selectedExplanationContextKey) {
      return active;
    }
    return this.revisions().find((revision) => revision.active) ?? null;
  }
  selectedRevision() {
    const revisions = this.revisions();
    return revisions.find((revision) => revision.id === this.selectedRevisionId) ?? this.activeRevision() ?? revisions[0] ?? null;
  }
  isRevisionOpen(revision) {
    return this.openRevisionId === revision.id;
  }
  toggleRevision(revision, event) {
    event?.stopPropagation();
    this.selectedRevisionId = revision.id;
    this.openRevisionId = this.openRevisionId === revision.id ? "" : revision.id;
    this.openPreviewSectionId = revision.sections[0]?.id ?? "";
  }
  togglePreviewSection(sectionId, event) {
    event?.stopPropagation();
    this.openPreviewSectionId = this.openPreviewSectionId === sectionId ? "" : sectionId;
  }
  startEditing(event) {
    event?.stopPropagation();
    const revision = this.selectedRevision();
    this.beginEditingDraft(revision ? this.draftFromRevision(revision) : this.emptyDraft());
  }
  startEditingRevision(revision, event) {
    event?.stopPropagation();
    this.selectedRevisionId = revision.id;
    this.beginEditingDraft(this.draftFromRevision(revision));
  }
  startNewRevision(event) {
    event?.stopPropagation();
    this.beginEditingDraft(this.emptyDraft());
  }
  cancelEditing(event) {
    event?.stopPropagation();
    this.editing = false;
    this.draft = null;
    this.draftAccordionOpen = true;
    this.error = "";
  }
  toggleDraftRevision(event) {
    event?.stopPropagation();
    this.draftAccordionOpen = !this.draftAccordionOpen;
  }
  addDraftSection(event) {
    event?.stopPropagation();
    if (!this.draft) {
      return;
    }
    const next = {
      localId: this.newLocalId(),
      id: "",
      icon: this.defaultSectionIcon(),
      title: this.defaultContentSectionTitle(),
      blurb: "",
      contentHtml: this.defaultContentSectionHtml(),
      imageUrls: [],
      panelSpan: "span-1",
      optional: false,
      mode: "html"
    };
    this.draft.sections = [...this.draft.sections, next];
    this.openDraftSectionId = next.localId;
  }
  removeDraftSection(section, event) {
    event?.stopPropagation();
    if (!this.draft) {
      return;
    }
    this.draft.sections = this.draft.sections.filter((item) => item.localId !== section.localId);
    if (this.openDraftSectionId === section.localId) {
      this.openDraftSectionId = this.draft.sections[0]?.localId ?? "";
    }
  }
  toggleDraftSection(section, event) {
    event?.stopPropagation();
    const nextOpenSectionId = this.openDraftSectionId === section.localId ? "" : section.localId;
    this.openDraftSectionId = nextOpenSectionId;
  }
  toggleDraftSectionMode(section, event) {
    event?.stopPropagation();
    if (this.openDraftSectionId !== section.localId) {
      this.openDraftSectionId = section.localId;
    }
    section.mode = section.mode === "html" ? "preview" : "html";
  }
  previewSectionLayoutClass(section) {
    const span = this.sectionPanelSpan(section) ?? "span-1";
    return `help-editor-html-preview--${span}`;
  }
  previewPanelSpanClass(section) {
    const span = this.sectionPanelSpan(section) ?? "span-1";
    return `help-editor-preview-section--${span}`;
  }
  previewSectionContentHtml(section) {
    const contentHtml = `${section.contentHtml ?? ""}`.trim();
    if (/<img[\s>]/i.test(contentHtml)) {
      return contentHtml;
    }
    const imageUrl = `${section.imageUrls?.[0] ?? ""}`.trim();
    if (!imageUrl) {
      return contentHtml;
    }
    const seededFigure = `<figure class="explanation-seeded-visual lazy-image-frame-loading"><img class="lazy-image-loading" src="${this.escapeHtmlAttribute(this.lazyImagePlaceholderSrc(imageUrl))}" alt="${this.escapeHtmlAttribute(section.title ?? "")}"></figure>`;
    return `${contentHtml}${contentHtml ? "" : ""}${seededFigure}`;
  }
  setDraftSectionPanelSpan(section, panelSpan, event) {
    event?.stopPropagation();
    section.panelSpan = panelSpan;
  }
  formatPastedSectionHtml(section, event) {
    event.stopPropagation();
    const pasted = this.htmlFromClipboardPayload(event.clipboardData?.getData("text/html") ?? "", event.clipboardData?.getData("text/plain") ?? "");
    if (!pasted.trim()) {
      return;
    }
    event.preventDefault();
    const textarea = event.target instanceof HTMLTextAreaElement ? event.target : null;
    const current = section.contentHtml ?? "";
    const start = textarea?.selectionStart ?? current.length;
    const end = textarea?.selectionEnd ?? start;
    const merged = `${current.slice(0, start)}${pasted}${current.slice(end)}`;
    section.contentHtml = this.formatHtmlFragment(merged);
    queueMicrotask(() => {
      if (textarea) {
        textarea.selectionStart = textarea.selectionEnd = section.contentHtml.length;
      }
    });
  }
  iconPickerGroupIcon(group) {
    switch (group) {
      case "Planning":
        return "event_note";
      case "People":
        return "groups";
      case "Logistics":
        return "inventory_2";
      case "Safety":
        return "verified_user";
      default:
        return "apps";
    }
  }
  iconPickerGroupPalette(group) {
    switch (group) {
      case "Planning":
        return "blue";
      case "People":
        return "green";
      case "Logistics":
        return "amber";
      case "Safety":
        return "slate";
      default:
        return "violet";
    }
  }
  sectionIconMenuPalette(section) {
    if (this.documentKind === "privacy" && !section.optional) {
      return "amber";
    }
    return "blue";
  }
  selectIcon(section, icon, event) {
    event?.stopPropagation();
    section.icon = icon;
  }
  sectionIconMenuTrigger(section) {
    return {
      id: `section-icon-menu:${section.localId}`,
      icon: section.icon || this.defaultSectionIcon(),
      closeIcon: "close",
      ariaLabel: this.uiText("Change section icon"),
      layout: "icon",
      hideLabel: true,
      palette: this.sectionIconMenuPalette(section)
    };
  }
  sectionIconMenuModel(section) {
    return {
      layout: "tabs",
      density: "compact",
      groups: this.iconPickerGroups.map((group) => ({
        id: group,
        label: group,
        icon: this.iconPickerGroupIcon(group),
        palette: this.iconPickerGroupPalette(group),
        items: this.helpIconOptions.filter((option) => option.group === group).map((option) => ({
          id: `section-icon:${option.icon}`,
          label: option.label,
          detail: [option.icon, ...option.keywords].join(" "),
          icon: option.icon,
          iconKind: "material",
          layout: "icon",
          active: section.icon === option.icon,
          checked: section.icon === option.icon,
          closeOnSelect: true,
          ariaLabel: `${this.uiText("Use")} ${this.uiText(option.label)} ${this.uiText("icon")}`,
          context: {
            action: "select-section-icon",
            icon: option.icon
          }
        }))
      }))
    };
  }
  onSectionIconMenuSelect(section, event) {
    const icon = `${event.context?.icon ?? ""}`.trim();
    if (!icon) {
      return;
    }
    this.selectIcon(section, icon, event.sourceEvent);
  }
  async saveDraft(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.draft || this.saving) {
      return;
    }
    if (this.documentKind === "explanation" && !this.draft.contextKey) {
      this.error = this.uiText("admin.help.select.screen.before.saving");
      return;
    }
    const request = {
      actorUserId: this.actorUserId(),
      baseRevisionId: this.draft.baseRevisionId,
      contextKey: this.documentKind === "explanation" ? this.draft.contextKey : null,
      lang: this.selectedContentLang,
      title: this.draft.title,
      summary: this.draft.summary,
      description: this.draft.description,
      headerColor: this.draft.headerColor,
      sections: this.toSections(this.draft.sections)
    };
    this.saving = true;
    this.error = "";
    try {
      await this.helpCenter.saveRevision(request, this.documentKind);
      this.editing = false;
      this.draft = null;
      this.draftAccordionOpen = true;
      this.selectNewestRevision(this.revisions(), this.activeRevision());
    } catch {
      this.error = this.saveErrorLabel();
    } finally {
      this.saving = false;
      this.changeDetectorRef.detectChanges();
    }
  }
  async activateRevision(revision, event) {
    event?.stopPropagation();
    if (revision.active || this.saving || this.activatingRevisionId) {
      return;
    }
    this.activatingRevisionId = revision.id;
    this.error = "";
    try {
      await this.helpCenter.activateRevision(revision.id, this.actorUserId(), this.documentKind);
      this.selectInitialRevision(this.revisions(), this.activeRevision());
    } catch {
      this.error = this.activateErrorLabel();
    } finally {
      this.activatingRevisionId = "";
      this.changeDetectorRef.detectChanges();
    }
  }
  deleteRevision(revision, event) {
    event?.stopPropagation();
    if (this.saving || this.activatingRevisionId) {
      return;
    }
    this.dialogStore.open({
      title: `Delete v${revision.version}?`,
      message: revision.title,
      confirmLabel: "Delete",
      busyConfirmLabel: "Deleting...",
      confirmTone: "danger",
      onConfirm: async () => {
        this.saving = true;
        this.error = "";
        try {
          await this.helpCenter.deleteRevision(revision.id, this.actorUserId(), this.documentKind);
          this.selectInitialRevision(this.revisions(), this.activeRevision());
        } catch {
          this.error = this.deleteErrorLabel();
        } finally {
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        }
      }
    });
  }
  revisionSubtitle(revision) {
    const count = revision.sections.length;
    return `${this.uiText(`${count} section${count === 1 ? "" : "s"}`)} \xB7 ${this.fullDate(revision.updatedAtIso || revision.createdAtIso)}`;
  }
  revisionDescription(revision) {
    return revision.description?.trim() || this.defaultDescription();
  }
  nextRevisionVersion() {
    return this.revisions().map((revision) => Math.trunc(Number(revision.version) || 0)).reduce((max, version) => Math.max(max, version), 0) + 1;
  }
  draftVersionLabel() {
    const nextVersion = this.nextRevisionVersion();
    const baseRevision = this.draft?.baseRevisionId ? this.revisions().find((revision) => revision.id === this.draft?.baseRevisionId) : null;
    return baseRevision ? `v${baseRevision.version} -> v${nextVersion}` : `v${nextVersion}`;
  }
  isAnyActionPending() {
    return this.saving || Boolean(this.activatingRevisionId);
  }
  fullDate(value) {
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) {
      return "Just now";
    }
    return new Intl.DateTimeFormat(void 0, {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    }).format(new Date(parsed));
  }
  actorUserId() {
    return this.userProfileStore.activeUserId().trim();
  }
  documentLabel() {
    switch (this.documentKind) {
      case "privacy":
        return "Privacy";
      case "terms":
        return "Terms";
      case "explanation":
        return "Explanation";
      default:
        return "Help";
    }
  }
  documentMenuKindLabel(kind) {
    switch (kind) {
      case "privacy":
        return "Privacy";
      case "terms":
        return "Terms";
      default:
        return "Help";
    }
  }
  documentIcon(kind) {
    switch (kind) {
      case "privacy":
        return "policy";
      case "terms":
        return "rule";
      case "explanation":
        return "tips_and_updates";
      default:
        return "help_outline";
    }
  }
  documentLabelLower() {
    return this.documentLabel().toLowerCase();
  }
  editorTitle() {
    return this.uiText("content.editor");
  }
  activeRevisionSubtitle() {
    const active = this.activeRevision();
    return active ? this.activeRevisionLabel(active.version) : this.noActiveRevisionLabel();
  }
  uiDocumentLabel() {
    return this.uiText(this.documentLabel());
  }
  activeRevisionLabel(version) {
    const normalizedVersion = Math.max(0, Math.trunc(Number(version) || 0));
    return this.uiText(`Active ${this.documentLabelLower()} v${normalizedVersion}`);
  }
  noActiveRevisionLabel() {
    return this.uiText(`No active ${this.documentLabelLower()} revision`);
  }
  loadingRevisionsLabel() {
    return this.uiText(`Loading ${this.documentLabelLower()} revisions`);
  }
  revisionsAriaLabel() {
    return this.uiText(`${this.documentLabel()} revisions`);
  }
  createRevisionLabel() {
    return this.uiText(`Create ${this.documentLabelLower()} revision`);
  }
  popupHeaderPlaceholder() {
    return this.uiText(`${this.documentLabel()} popup header`);
  }
  descriptionPlaceholder() {
    return this.uiText(`${this.documentLabel()} description`);
  }
  addSectionLabel() {
    return this.uiText(`Add ${this.documentLabelLower()} section`);
  }
  editableSectionsAriaLabel() {
    return this.uiText(`Editable ${this.documentLabelLower()} sections`);
  }
  sectionTitleAriaLabel() {
    return this.uiText(`${this.documentLabel()} section title`);
  }
  removeSectionLabel() {
    return this.uiText(`Remove ${this.documentLabelLower()} section`);
  }
  toggleSectionLabel() {
    return this.uiText(`Toggle ${this.documentLabelLower()} section`);
  }
  noRevisionsLabel() {
    return this.uiText(`No ${this.documentLabelLower()} revisions`);
  }
  createRevisionToEnablePopupLabel() {
    return this.uiText(`Create a revision to enable the ${this.documentLabelLower()} popup.`);
  }
  loadErrorLabel() {
    return this.uiText(`Unable to load ${this.documentLabelLower()} revisions.`);
  }
  saveErrorLabel() {
    return this.uiText(`Unable to save ${this.documentLabelLower()} revision.`);
  }
  activateErrorLabel() {
    return this.uiText(`Unable to activate ${this.documentLabelLower()} revision.`);
  }
  deleteErrorLabel() {
    return this.uiText(`Unable to delete ${this.documentLabelLower()} revision.`);
  }
  uiText(source) {
    return this.i18n.translate(source);
  }
  documentPalette(kind) {
    switch (kind) {
      case "privacy":
        return "teal";
      case "terms":
        return "slate";
      case "explanation":
        return "violet";
      default:
        return "blue";
    }
  }
  languagePalette(lang) {
    return this.normalizeContentLang(lang) === "hu" ? "green" : "blue";
  }
  explanationSurfacePalette(surface) {
    if (surface.key.startsWith("assets")) {
      return "brown";
    }
    if (surface.key.startsWith("event")) {
      return "orange";
    }
    if (surface.key.startsWith("activities")) {
      return "gold";
    }
    if (surface.key.startsWith("profile")) {
      return "violet";
    }
    switch (surface.key) {
      case "home.game":
        return "green";
      case "chats":
        return "sky";
      case "contacts":
        return "teal";
      default:
        return surface.owner === "route" ? "green" : surface.owner === "navigator" ? "purple" : "blue";
    }
  }
  defaultDescription() {
    switch (this.documentKind) {
      case "privacy":
        return this.defaultPrivacyDescription;
      case "terms":
        return this.defaultTermsDescription;
      case "explanation":
        return APP_STATIC_DATA.defaultExplanationHomeRevision.description;
      default:
        return this.defaultHelpDescription;
    }
  }
  defaultSectionIcon() {
    switch (this.documentKind) {
      case "privacy":
        return "policy";
      case "terms":
        return "rule";
      case "explanation":
        return "tips_and_updates";
      default:
        return "help_outline";
    }
  }
  headerColorClass(color) {
    return `help-editor-header-color-${this.normalizeHeaderColor(color)}`;
  }
  headerColorMenuTrigger(color) {
    const option = this.headerColorOption(color);
    const label = this.uiText(option.label);
    return {
      id: "header-color-menu",
      label,
      icon: "palette",
      ariaLabel: `${this.uiText("Header color")}: ${label}`,
      palette: option.id,
      layout: "icon",
      hideLabel: true,
      disabled: this.saving
    };
  }
  headerColorMenuItems(color) {
    const selected = this.normalizeHeaderColor(color);
    return this.headerColorOptions.map((option) => ({
      id: `header-color:${option.id}`,
      kind: "radio",
      label: this.uiText(option.label),
      icon: "circle",
      palette: option.id,
      surface: "tinted",
      active: selected === option.id,
      checked: selected === option.id,
      showCheck: selected === option.id,
      ariaLabel: `${this.uiText("Use")} ${this.uiText(option.label)} ${this.uiText("header")}`,
      context: {
        action: "select-header-color",
        color: option.id
      }
    }));
  }
  onHeaderColorMenuSelect(event) {
    event.sourceEvent.stopPropagation();
    const color = event.context?.color;
    if (!color) {
      return;
    }
    this.selectHeaderColor(color, event.sourceEvent);
  }
  selectHeaderColor(color, event) {
    event?.stopPropagation();
    if (this.draft) {
      this.draft.headerColor = color;
    }
  }
  selectInitialRevision(revisions, activeRevision) {
    const selected = activeRevision ?? revisions[0] ?? null;
    this.selectedRevisionId = selected?.id ?? "";
    this.openRevisionId = selected?.id ?? "";
    this.openPreviewSectionId = selected?.sections[0]?.id ?? "";
  }
  selectNewestRevision(revisions, activeRevision) {
    const newest = [...revisions].sort((left, right) => right.version - left.version)[0] ?? activeRevision ?? null;
    this.selectedRevisionId = newest?.id ?? "";
    this.openRevisionId = newest?.id ?? "";
    this.openPreviewSectionId = newest?.sections[0]?.id ?? "";
  }
  revisionRow(revision) {
    return {
      id: `revision-${revision.id}`,
      kind: "revision",
      revision
    };
  }
  draftRow() {
    return {
      id: "draft",
      kind: "draft",
      revision: null
    };
  }
  beginEditingDraft(draft) {
    this.draft = draft;
    this.draftAccordionOpen = true;
    this.openRevisionId = "";
    this.openPreviewSectionId = "";
    this.openDraftSectionId = draft.sections[0]?.localId ?? "";
    this.editing = true;
  }
  draftFromRevision(revision) {
    const contextKey = this.normalizeExplanationContextKey(revision.contextKey);
    if (this.documentKind === "explanation") {
      this.selectedExplanationContextKey = contextKey;
    }
    return {
      baseRevisionId: revision.id,
      contextKey: this.documentKind === "explanation" ? contextKey : null,
      title: revision.title,
      summary: revision.summary,
      description: revision.description?.trim() || this.defaultDescription(),
      headerColor: this.normalizeHeaderColor(revision.headerColor),
      sections: revision.sections.map((section) => ({
        localId: this.newLocalId(),
        id: section.id?.trim() ?? "",
        icon: section.icon || this.defaultSectionIcon(),
        title: section.title?.trim() || this.defaultUntitledContentSectionTitle(),
        blurb: section.blurb,
        contentHtml: this.formatHtmlFragment(this.withoutSectionLayoutMarkers(this.sectionContentHtml(section))),
        imageUrls: this.normalizeSectionImageUrls(section.imageUrls),
        panelSpan: this.sectionPanelSpan(section) ?? "span-1",
        optional: section.optional === true,
        mode: "html"
      }))
    };
  }
  emptyDraft(contextKeyOverride) {
    const contextKey = this.documentKind === "explanation" ? contextKeyOverride === void 0 ? this.selectedExplanationContextKey : contextKeyOverride : null;
    return {
      baseRevisionId: null,
      contextKey,
      title: this.defaultContentRevisionTitle(),
      summary: "",
      description: "",
      headerColor: this.documentKind === "explanation" ? "violet" : "amber",
      sections: [
        {
          localId: this.newLocalId(),
          id: "",
          icon: this.defaultSectionIcon(),
          title: "",
          blurb: "",
          contentHtml: "",
          imageUrls: [],
          panelSpan: "span-1",
          optional: false,
          mode: "html"
        }
      ]
    };
  }
  toSections(drafts) {
    const seenIds = /* @__PURE__ */ new Set();
    return drafts.map((draft, index) => {
      const title = draft.title.trim() || this.defaultNumberedContentSectionTitle(index + 1);
      const baseId = this.slugify(draft.id) || this.slugify(title) || `section-${index + 1}`;
      let id = baseId;
      let duplicateIndex = 2;
      while (seenIds.has(id)) {
        id = `${baseId}-${duplicateIndex++}`;
      }
      seenIds.add(id);
      return {
        id,
        icon: draft.icon.trim() || this.defaultSectionIcon(),
        title,
        blurb: draft.blurb.trim(),
        contentHtml: this.withoutSectionLayoutMarkers(draft.contentHtml).trim(),
        imageUrls: this.normalizeSectionImageUrls(draft.imageUrls),
        panelSpan: this.normalizeSectionPanelSpan(draft.panelSpan) ?? "span-1",
        optional: this.documentKind === "privacy" && draft.optional === true
      };
    }).filter((section) => section.contentHtml.length > 0);
  }
  slugify(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  newLocalId() {
    return `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
  defaultContentRevisionTitle() {
    if (this.documentKind === "explanation") {
      return this.nextGeneratedExplanationTitle();
    }
    if (this.selectedContentLanguageIsHungarian()) {
      return this.documentKind === "privacy" ? "\xDAj adatv\xE9delmi verzi\xF3" : this.documentKind === "terms" ? "\xDAj felt\xE9telek verzi\xF3" : "\xDAj s\xFAg\xF3verzi\xF3";
    }
    return `New ${this.documentLabelLower()} revision`;
  }
  defaultContentSectionTitle() {
    if (this.documentKind === "explanation") {
      return this.selectedContentLanguageIsHungarian() ? "\xDAj magyar\xE1zat szakasz" : "New explanation section";
    }
    if (this.selectedContentLanguageIsHungarian()) {
      return this.documentKind === "privacy" ? "\xDAj adatv\xE9delmi szakasz" : this.documentKind === "terms" ? "\xDAj felt\xE9telek szakasz" : "\xDAj s\xFAg\xF3 szakasz";
    }
    return `New ${this.documentLabelLower()} section`;
  }
  defaultUntitledContentSectionTitle() {
    if (this.documentKind === "explanation") {
      return this.selectedContentLanguageIsHungarian() ? "N\xE9vtelen magyar\xE1zat szakasz" : "Untitled explanation section";
    }
    if (this.selectedContentLanguageIsHungarian()) {
      return this.documentKind === "privacy" ? "N\xE9vtelen adatv\xE9delmi szakasz" : this.documentKind === "terms" ? "N\xE9vtelen felt\xE9telek szakasz" : "N\xE9vtelen s\xFAg\xF3 szakasz";
    }
    return `Untitled ${this.documentLabelLower()} section`;
  }
  defaultNumberedContentSectionTitle(index) {
    if (this.documentKind === "explanation") {
      return this.selectedContentLanguageIsHungarian() ? `Magyar\xE1zat szakasz ${index}` : `Explanation section ${index}`;
    }
    if (this.selectedContentLanguageIsHungarian()) {
      return this.documentKind === "privacy" ? `Adatv\xE9delmi szakasz ${index}` : this.documentKind === "terms" ? `Felt\xE9telek szakasz ${index}` : `S\xFAg\xF3 szakasz ${index}`;
    }
    return `${this.documentLabel()} section ${index}`;
  }
  defaultContentSectionHtml() {
    if (this.documentKind === "explanation") {
      return this.selectedContentLanguageIsHungarian() ? "<p>\xCDrd le, mit \xE9rdemes tudni err\u0151l a k\xE9perny\u0151r\u0151l.</p>" : "<p>Describe what the user should know on this screen.</p>";
    }
    if (this.selectedContentLanguageIsHungarian()) {
      return this.documentKind === "privacy" ? "<p>\xCDrd le ezt az adatv\xE9delmi szakaszt.</p>" : this.documentKind === "terms" ? "<p>\xCDrd le ezt a felt\xE9telek szakaszt.</p>" : "<p>\xCDrd le ezt a s\xFAg\xF3 szakaszt.</p>";
    }
    return `<p>Describe this ${this.documentLabelLower()} section.</p>`;
  }
  selectedContentLanguageIsHungarian() {
    return this.normalizeContentLang(this.selectedContentLang) === "hu";
  }
  nextGeneratedExplanationTitle() {
    const existingNumbers = this.currentState()?.revisions?.map((revision) => revision.title?.trim() ?? "")?.map((title) => /^New item (\d+)$/i.exec(title)?.[1] ?? null)?.filter((value) => Boolean(value))?.map((value) => Number(value))?.filter((value) => Number.isFinite(value) && value > 0) ?? [];
    const nextIndex = existingNumbers.reduce((max, value) => Math.max(max, value), 0) + 1;
    return `New item ${nextIndex}`;
  }
  explanationRevisionForSurface(surface) {
    return this.helpCenter.explanationState()?.revisions?.filter((revision) => this.normalizeExplanationContextKey(revision.contextKey) === surface.key)?.sort((left, right) => {
      if (left.active !== right.active) {
        return left.active ? -1 : 1;
      }
      return right.version - left.version;
    })[0] ?? null;
  }
  normalizeExplanationContextKey(contextKey) {
    const normalized = `${contextKey ?? ""}`.trim();
    return this.explainableSurfaces().find((surface) => surface.key === normalized)?.key ?? this.explainableSurfaces()[0]?.key ?? "home.game";
  }
  sectionPanelSpan(section) {
    return this.normalizeSectionPanelSpan(section.panelSpan) ?? this.normalizeSectionPanelSpan(section.panelLayout) ?? this.sectionLayoutMarker(section.contentHtml ?? "") ?? (_AdminHelpEditorPopupComponent.FALLBACK_SPAN_2_SECTION_IDS.has(`${section.id ?? ""}`) ? "span-2" : null);
  }
  sectionLayoutMarker(contentHtml) {
    const marker = /<!--\s*(?:panel|layout|section|width)\s*:\s*([a-z0-9_-]+)\s*-->/i.exec(contentHtml)?.[1] ?? /\b(?:data-panel|data-layout|data-section|data-width|data-panel-width)\s*=\s*["']\s*([a-z0-9_-]+)\s*["']/i.exec(contentHtml)?.[1] ?? /\b(?:help|explanation|section|panel)-(?:panel|section|layout)--([a-z0-9_-]+)\b/i.exec(contentHtml)?.[1];
    return this.normalizeSectionPanelSpan(marker);
  }
  normalizeSectionPanelSpan(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (normalized === "span-1" || normalized === "compact" || normalized === "single" || normalized === "one" || normalized === "1") {
      return "span-1";
    }
    if (normalized === "span-2" || normalized === "wide" || normalized === "double" || normalized === "two" || normalized === "2") {
      return "span-2";
    }
    if (normalized === "span-3" || normalized === "full" || normalized === "row" || normalized === "all" || normalized === "3") {
      return "span-3";
    }
    return null;
  }
  withoutSectionLayoutMarkers(contentHtml) {
    return `${contentHtml ?? ""}`.replace(/<!--\s*(?:panel|layout|section|width)\s*:\s*[a-z0-9_-]+\s*-->\s*/gi, "").trim();
  }
  sectionContentHtml(section) {
    const contentHtml = `${section.contentHtml ?? ""}`.trim();
    if (contentHtml) {
      return contentHtml;
    }
    const details = Array.isArray(section.details) ? section.details : [];
    const points = Array.isArray(section.points) ? section.points : [];
    return [
      section.blurb ? `<p><strong>${this.escapeHtml(section.blurb)}</strong></p>` : "",
      ...details.map((detail) => `<p>${this.escapeHtml(detail)}</p>`),
      points.length ? `<ul>${points.map((point) => `<li>${this.escapeHtml(point)}</li>`).join("")}</ul>` : ""
    ].join("\n");
  }
  normalizeSectionImageUrls(imageUrls) {
    const result = [];
    const seen = /* @__PURE__ */ new Set();
    for (const imageUrl of imageUrls ?? []) {
      const normalized = `${imageUrl ?? ""}`.trim();
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      result.push(normalized);
      if (result.length >= _AdminHelpEditorPopupComponent.IMAGE_LIMIT) {
        break;
      }
    }
    return result;
  }
  htmlFromClipboardPayload(html, text) {
    const normalizedHtml = `${html ?? ""}`.trim();
    if (normalizedHtml) {
      return normalizedHtml;
    }
    const normalizedText = `${text ?? ""}`.trim();
    if (this.isEmbeddableImageUrl(normalizedText)) {
      return `<img src="${this.escapeHtmlAttribute(normalizedText)}" alt="">`;
    }
    return text;
  }
  isEmbeddableImageUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    return /^data:image\//i.test(normalized) || /^blob:https?:\/\//i.test(normalized) || /^blob:/i.test(normalized) || /^indexeddb:/i.test(normalized) || /^\/(?:api\/)?media\/public\?[^\s<>"']+$/i.test(normalized) || /^https?:\/\/[^\s<>"']+\/(?:api\/)?media\/public\?[^\s<>"']+$/i.test(normalized) || /^https?:\/\/[^\s<>"']+\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?[^\s<>"']*)?$/i.test(normalized);
  }
  normalizeHeaderColor(value) {
    return AppUtils.enumValue(value, APP_STATIC_DATA.helpCenterHeaderColors, "amber");
  }
  headerColorOption(value) {
    const color = this.normalizeHeaderColor(value);
    return this.headerColorOptions.find((option) => option.id === color) ?? this.headerColorOptions[0];
  }
  normalizeContentLang(lang) {
    const normalized = `${lang ?? ""}`.trim().toLowerCase().split("-")[0];
    return normalized === "hu" ? "hu" : "en";
  }
  escapeHtml(value) {
    return `${value ?? ""}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  formatHtmlFragment(value) {
    const html = `${value ?? ""}`.trim();
    if (!html || typeof document === "undefined") {
      return html;
    }
    const template = document.createElement("template");
    template.innerHTML = html;
    return this.formatHtmlNodes(Array.from(template.content.childNodes), 0).join("\n").trim();
  }
  formatHtmlNodes(nodes, depth) {
    return nodes.flatMap((node) => this.formatHtmlNode(node, depth)).filter((line) => line.trim().length > 0);
  }
  formatHtmlNode(node, depth) {
    const indent = "  ".repeat(depth);
    if (node.nodeType === 3) {
      const text = this.normalizedHtmlText(node.textContent ?? "");
      return text ? [`${indent}${this.escapeHtml(text)}`] : [];
    }
    if (node.nodeType === 8) {
      const text = `${node.textContent ?? ""}`.trim();
      return text ? [`${indent}<!-- ${text} -->`] : [];
    }
    if (!(node instanceof HTMLElement)) {
      return [];
    }
    const tagName = node.tagName.toLowerCase();
    const attributes = this.htmlAttributes(node);
    if (_AdminHelpEditorPopupComponent.VOID_HTML_TAGS.has(tagName)) {
      return [`${indent}<${tagName}${attributes}>`];
    }
    const children = this.meaningfulHtmlChildren(node);
    if (children.length === 0) {
      return [`${indent}<${tagName}${attributes}></${tagName}>`];
    }
    if (children.length === 1 && children[0].nodeType === 3) {
      const text = this.normalizedHtmlText(children[0].textContent ?? "");
      return [`${indent}<${tagName}${attributes}>${this.escapeHtml(text)}</${tagName}>`];
    }
    return [
      `${indent}<${tagName}${attributes}>`,
      ...this.formatHtmlNodes(children, depth + 1),
      `${indent}</${tagName}>`
    ];
  }
  meaningfulHtmlChildren(element) {
    return Array.from(element.childNodes).filter((node) => node.nodeType !== 3 || `${node.textContent ?? ""}`.trim().length > 0);
  }
  htmlAttributes(element) {
    return Array.from(element.attributes).map((attribute) => ` ${attribute.name}="${this.escapeHtmlAttribute(attribute.value)}"`).join("");
  }
  lazyImagePlaceholderSrc(imageUrl) {
    return `${_AdminHelpEditorPopupComponent.LAZY_IMAGE_PLACEHOLDER_URL}#lazy-src=${encodeURIComponent(imageUrl)}`;
  }
  escapeHtmlAttribute(value) {
    return `${value ?? ""}`.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  normalizedHtmlText(value) {
    return `${value ?? ""}`.replace(/\s+/g, " ").trim();
  }
  static \u0275fac = function AdminHelpEditorPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminHelpEditorPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminHelpEditorPopupComponent, selectors: [["app-admin-help-editor-popup"]], decls: 1, vars: 1, consts: [[3, "model"], [1, "help-editor-body"], ["aria-busy", "true", 1, "help-editor-state-card", "help-editor-loading-state"], ["kind", "load-ring", "state", "loading"], [1, "help-editor-error"], [1, "help-editor-revisions-pane"], [1, "help-editor-revision-list"], [1, "help-editor-empty-state"], [1, "help-editor-revision-card", 3, "is-open", "is-active"], [1, "help-editor-form", "help-editor-draft-row"], [1, "help-editor-form", "help-editor-draft-row", 3, "ngSubmit"], [1, "help-editor-revision-card", "help-editor-draft-card"], [1, "help-editor-revision-head", "help-editor-draft-head"], [1, "help-editor-revision-toggle", "help-editor-draft-toggle"], [1, "help-editor-version-pill", "help-editor-draft-version-pill"], [1, "help-editor-revision-copy", "help-editor-draft-title-wrap"], ["type", "text", "name", "helpTitle", "placeholder", "Revision title", "required", "", 1, "help-editor-draft-title-input", 3, "ngModelChange", "ngModel"], [1, "help-editor-revision-actions", "help-editor-draft-header-actions"], [1, "help-editor-action-ring-shell", "help-editor-circle-ring-shell"], ["kind", "action-ring", "shape", "circle", "state", "loading"], ["type", "submit", 1, "help-editor-icon-btn", "help-editor-confirm-btn", 3, "disabled", "title"], ["type", "button", "aria-label", "Cancel editing", "title", "Cancel editing", 1, "help-editor-icon-btn", 3, "click", "disabled"], ["type", "button", "aria-label", "Toggle draft revision", 1, "help-editor-inline-icon-btn", "help-editor-caret-btn", 3, "click"], [1, "help-editor-section-caret"], [1, "help-editor-revision-preview", "help-editor-draft-body"], [1, "help-editor-description-edit", "help-editor-summary-edit-panel", 3, "ngClass"], [1, "help-editor-description-row"], [1, "help-editor-summary-line"], [1, "help-editor-inline-field"], ["type", "text", "name", "helpSummary", "required", "", 1, "help-editor-draft-summary-input", 3, "ngModelChange", "ngModel", "placeholder"], ["kind", "select", "panelAlign", "end", "panelMode", "anchored", 1, "help-editor-summary-color-menu", 3, "itemSelect", "trigger", "items"], [1, "help-editor-inline-field", "help-editor-context-field"], [1, "help-editor-description-line"], [1, "help-editor-inline-field", "help-editor-inline-field-compact"], ["name", "helpDescription", "rows", "3", "required", "", 3, "ngModelChange", "ngModel", "placeholder"], ["type", "button", "title", "Add section", 1, "help-editor-hero-add-section-btn", 3, "click"], [1, "help-editor-preview-accordion"], [1, "help-editor-preview-section", "help-editor-edit-section", 3, "is-open", "is-privacy-mandatory", "is-privacy-optional"], ["kind", "select", "panelAlign", "start", 3, "itemSelect", "trigger", "items", "closeOnSelect"], [1, "help-editor-preview-section", "help-editor-edit-section"], [1, "help-editor-edit-section-head"], ["kind", "select", "title", "Search Material icons", "panelAlign", "start", 1, "help-editor-section-icon-menu", 3, "itemSelect", "trigger", "model", "filterable", "closeOnSelect"], ["type", "text", "placeholder", "Section label", "required", "", 1, "help-editor-section-title-input", 3, "ngModelChange", "name", "ngModel", "ngModelOptions"], ["role", "group", "aria-label", "Panel grid span", 1, "help-editor-panel-span-toggle"], ["title", "Optional sections do not block privacy approval", 1, "help-editor-privacy-optional-toggle", 3, "is-optional", "is-mandatory"], ["type", "button", 1, "help-editor-mode-toggle", 3, "click", "title"], ["type", "button", "title", "Remove section", 1, "help-editor-inline-icon-btn", "help-editor-danger-btn", 3, "click"], ["type", "button", 1, "help-editor-inline-icon-btn", "help-editor-caret-btn", 3, "click"], [1, "help-editor-preview-section-body", "help-editor-section-edit"], ["type", "button", 1, "help-editor-panel-span-btn", 3, "is-active", "title"], ["type", "button", 1, "help-editor-panel-span-btn", 3, "click", "title"], ["title", "Optional sections do not block privacy approval", 1, "help-editor-privacy-optional-toggle", 3, "click"], ["type", "checkbox", 3, "ngModelChange", "name", "ngModel", "ngModelOptions"], ["ariaLabel", "Explanation image slots", 3, "name", "ngModel", "disabled", "compact", "uploadOwnerId"], ["placeholder", "Paste or edit the section HTML", "spellcheck", "false", 1, "help-editor-html-textarea", 3, "name", "ngModel", "ngModelOptions"], [1, "help-editor-preview-card", 3, "ngClass"], ["ariaLabel", "Explanation image slots", 3, "ngModelChange", "name", "ngModel", "disabled", "compact", "uploadOwnerId"], ["placeholder", "Paste or edit the section HTML", "spellcheck", "false", 1, "help-editor-html-textarea", 3, "ngModelChange", "paste", "name", "ngModel", "ngModelOptions"], ["data-i18n-ignore", "", 1, "help-editor-popup-preview-title"], ["data-i18n-ignore", "", 1, "help-editor-popup-preview-blurb"], ["appLazyBgImage", "", "data-i18n-ignore", "", 1, "help-editor-html-preview", 3, "ngClass", "appLazyHtmlImages", "innerHTML"], [1, "help-editor-revision-card"], [1, "help-editor-revision-head", 3, "click"], ["type", "button", 1, "help-editor-revision-toggle", 3, "click"], [1, "help-editor-version-pill"], [1, "help-editor-revision-copy"], ["data-i18n-ignore", ""], [1, "help-editor-active-badge"], [1, "help-editor-revision-actions"], ["type", "button", "aria-label", "Edit revision", "title", "Edit this revision", 1, "help-editor-icon-btn", 3, "click", "disabled"], ["type", "button", "aria-label", "Activate revision", "title", "Switch to this revision", 1, "help-editor-icon-btn", 3, "click", "disabled"], ["type", "button", "aria-label", "Delete revision", "title", "Delete revision", 1, "help-editor-icon-btn", "help-editor-danger-btn", 3, "click", "disabled"], ["type", "button", "aria-label", "Toggle revision", 1, "help-editor-inline-icon-btn", "help-editor-caret-btn", 3, "click"], [1, "help-editor-revision-preview"], [1, "help-editor-preview-section", 3, "is-open", "is-privacy-mandatory", "is-privacy-optional"], [1, "help-editor-preview-section"], ["type", "button", 1, "help-editor-preview-section-toggle", 3, "click"], [1, "help-editor-preview-section-body"], ["type", "button", 1, "help-editor-primary-btn", 3, "click"]], template: function AdminHelpEditorPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminHelpEditorPopupComponent_Conditional_0_Template, 4, 2, "app-popup", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.admin.activePopup() === "help-editor" ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    CheckboxControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    MatIconModule,
    MatIcon,
    ImageCarouselComponent,
    IndicatorComponent,
    LazyBgImageDirective,
    PopupComponent,
    AppMenuComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.help-editor-form-actions[_ngcontent-%COMP%], \n.help-editor-revision-actions[_ngcontent-%COMP%], \n.help-editor-draft-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.help-editor-icon-btn[_ngcontent-%COMP%], \n.help-editor-inline-icon-btn[_ngcontent-%COMP%] {\n  border: 1px solid rgba(47, 86, 139, 0.22);\n  border-radius: 50%;\n  background: #f7faff;\n  color: #2f5f98;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.help-editor-icon-btn[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n}\n.help-editor-inline-icon-btn[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 30px;\n  height: 30px;\n}\n.help-editor-icon-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.help-editor-inline-icon-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.help-editor-icon-btn[_ngcontent-%COMP%]:disabled, \n.help-editor-inline-icon-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.48;\n  cursor: default;\n}\n.help-editor-edit-btn.is-active[_ngcontent-%COMP%] {\n  border-color: rgba(42, 112, 185, 0.52);\n  background: #e7f2ff;\n}\n.help-editor-danger-btn[_ngcontent-%COMP%] {\n  border-color: rgba(180, 64, 82, 0.26);\n  color: #b34254;\n  background: #fff6f7;\n}\n.help-editor-confirm-btn[_ngcontent-%COMP%] {\n  border-color: rgba(34, 123, 74, 0.28);\n  color: #1f7649;\n  background: #f2fff7;\n}\n.help-editor-body[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.help-editor-revisions-pane[_ngcontent-%COMP%] {\n  min-height: 0;\n  flex: 1 1 auto;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  overflow-y: auto;\n  padding: 0.54rem;\n}\n.help-editor-form[_ngcontent-%COMP%], \n.help-editor-revision-list[_ngcontent-%COMP%], \n.help-editor-preview-accordion[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n}\n.help-editor-draft-actions[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(220px, 1fr) auto;\n  align-items: end;\n  gap: 0.5rem;\n}\n.help-editor-primary-btn[_ngcontent-%COMP%], \n.help-editor-secondary-btn[_ngcontent-%COMP%], \n.help-editor-add-section-btn[_ngcontent-%COMP%], \n.help-editor-hero-add-section-btn[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border-radius: 999px;\n  padding: 0 0.78rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.help-editor-primary-btn[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 96, 160, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #e5f2ff 0%,\n      #c9dff8 100%);\n  color: #174d86;\n}\n.help-editor-secondary-btn[_ngcontent-%COMP%] {\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  background: #fff;\n  color: #304b70;\n}\n.help-editor-add-section-btn[_ngcontent-%COMP%] {\n  border: 1px solid rgba(65, 130, 98, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f2fff7 0%,\n      #def5e7 100%);\n  color: #286140;\n}\n.help-editor-hero-add-section-btn[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  position: absolute;\n  right: 0.58rem;\n  bottom: 0.72rem;\n  width: 38px;\n  height: 38px;\n  min-width: 38px;\n  padding: 0;\n  align-self: end;\n  border: 1px solid rgba(65, 130, 98, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f2fff7 0%,\n      #def5e7 100%);\n  color: #286140;\n}\n.help-editor-primary-btn[_ngcontent-%COMP%]:disabled, \n.help-editor-secondary-btn[_ngcontent-%COMP%]:disabled, \n.help-editor-add-section-btn[_ngcontent-%COMP%]:disabled, \n.help-editor-hero-add-section-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.56;\n  cursor: default;\n}\n.help-editor-primary-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.help-editor-add-section-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.help-editor-hero-add-section-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.help-editor-action-ring-shell[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n}\n.help-editor-circle-ring-shell[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n}\n.help-editor-circle-ring-shell[_ngcontent-%COMP%]   .help-editor-icon-btn[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.help-editor-circle-ring-shell.is-loading[_ngcontent-%COMP%]   .help-editor-icon-btn[_ngcontent-%COMP%], \n.help-editor-circle-ring-shell.is-loading[_ngcontent-%COMP%]   .help-editor-icon-btn[_ngcontent-%COMP%]:hover, \n.help-editor-circle-ring-shell.is-loading[_ngcontent-%COMP%]   .help-editor-icon-btn[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(181, 117, 23, 0.76);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  opacity: 1;\n  cursor: wait;\n  box-shadow: none;\n}\n.help-editor-draft-title-input[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.help-editor-draft-summary-input[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.help-editor-draft-row[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.help-editor-revision-card[_ngcontent-%COMP%], \n.help-editor-draft-card[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f1f6ff 100%);\n  --help-editor-header-border: rgba(31, 61, 99, 0.14);\n  --help-editor-header-pill-bg: #d7e8ff;\n  --help-editor-header-pill-color: #174d86;\n}\n.help-editor-header-color-amber[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  --help-editor-header-border: rgba(157, 118, 41, 0.3);\n  --help-editor-header-pill-bg: #b66a15;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-blue[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #f8fbff 100%);\n  --help-editor-header-border: rgba(53, 96, 162, 0.3);\n  --help-editor-header-pill-bg: #2f6fae;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-green[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #f0fbf3 0%,\n      #e4f7ea 100%);\n  --help-editor-header-border: rgba(58, 143, 91, 0.34);\n  --help-editor-header-pill-bg: #1f7a49;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-rose[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #fff8fa 100%);\n  --help-editor-header-border: rgba(178, 69, 98, 0.3);\n  --help-editor-header-pill-bg: #b94462;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-violet[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #f5f0ff 0%,\n      #fbf8ff 100%);\n  --help-editor-header-border: rgba(107, 80, 175, 0.3);\n  --help-editor-header-pill-bg: #6b50af;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-slate[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --help-editor-header-border: rgba(72, 92, 118, 0.28);\n  --help-editor-header-pill-bg: #40566f;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-draft-card[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #fff3dc 0%,\n      #ffe8c1 100%);\n  --help-editor-header-border: rgba(181, 117, 23, 0.34);\n  --help-editor-header-pill-bg: #b66a15;\n  --help-editor-header-pill-color: #fff;\n  border-color: var(--help-editor-header-border);\n  background: #fff;\n}\n.help-editor-draft-card.is-open[_ngcontent-%COMP%] {\n  border-color: var(--help-editor-header-border);\n  box-shadow: 0 10px 24px rgba(23, 42, 72, 0.08);\n}\n.help-editor-draft-toggle[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.help-editor-draft-card[_ngcontent-%COMP%]   .help-editor-version-pill[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.44);\n  background: var(--help-editor-header-pill-bg);\n  color: var(--help-editor-header-pill-color);\n}\n.help-editor-draft-title-wrap[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n.help-editor-draft-title-wrap[_ngcontent-%COMP%]   .help-editor-draft-title-input[_ngcontent-%COMP%], \n.help-editor-draft-title-wrap[_ngcontent-%COMP%]   .help-editor-draft-summary-input[_ngcontent-%COMP%] {\n  max-width: min(56vw, 760px);\n}\n.help-editor-draft-header-actions[_ngcontent-%COMP%] {\n  align-items: center;\n  gap: 0.44rem;\n}\n.help-editor-draft-body[_ngcontent-%COMP%] {\n  background: #fff;\n}\n.help-editor-description-edit[_ngcontent-%COMP%] {\n  position: relative;\n}\n.help-editor-summary-edit-panel[_ngcontent-%COMP%] {\n  border: 1px solid var(--help-editor-header-border);\n  border-radius: 8px;\n  background: var(--help-editor-header-bg);\n  padding: 0.72rem 0.76rem 0.78rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);\n}\n.help-editor-summary-edit-panel[_ngcontent-%COMP%]   .help-editor-inline-field[_ngcontent-%COMP%] {\n  gap: 0.32rem;\n}\n.help-editor-summary-edit-panel[_ngcontent-%COMP%]   .help-editor-inline-field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: rgba(30, 48, 74, 0.86);\n  font-size: 0.78rem;\n  font-weight: 950;\n}\n.help-editor-summary-edit-panel[_ngcontent-%COMP%]   .help-editor-inline-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.help-editor-summary-edit-panel[_ngcontent-%COMP%]   .help-editor-inline-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.9);\n}\n.help-editor-description-row[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.76rem;\n}\n.help-editor-summary-line[_ngcontent-%COMP%], \n.help-editor-description-line[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 38px;\n  gap: 0.58rem;\n  align-items: end;\n}\n.help-editor-summary-line[_ngcontent-%COMP%]   .help-editor-icon-btn[_ngcontent-%COMP%], \n.help-editor-description-line[_ngcontent-%COMP%]   .help-editor-hero-add-section-btn[_ngcontent-%COMP%] {\n  position: static;\n  width: 38px;\n  height: 38px;\n  min-width: 38px;\n  padding: 0;\n}\n.help-editor-description-line[_ngcontent-%COMP%]   .help-editor-hero-add-section-btn[_ngcontent-%COMP%] {\n  margin-bottom: 15px;\n}\n.help-editor-summary-color-menu[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n[_nghost-%COMP%]     .help-editor-summary-color-menu .app-menu__trigger {\n  width: 38px;\n  height: 38px;\n  min-width: 38px;\n  min-height: 38px;\n  border-radius: 50%;\n}\n[_nghost-%COMP%]     .help-editor-summary-color-menu .app-menu__trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.help-editor-help-hero[_ngcontent-%COMP%] {\n  position: relative;\n  padding: 0.7rem 0.76rem 0.72rem;\n  border: 1px solid rgba(157, 118, 41, 0.24);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.help-editor-help-hero[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.help-editor-help-hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.help-editor-help-hero[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #7c5618;\n  font-size: 0.92rem;\n  font-weight: 900;\n}\n.help-editor-help-hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 0.32rem;\n  color: rgba(108, 74, 19, 0.84);\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.help-editor-help-hero-edit[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.46rem;\n  padding-right: 4.65rem;\n}\n.help-editor-inline-field[_ngcontent-%COMP%], \n.help-editor-field[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.24rem;\n  color: rgba(30, 48, 74, 0.78);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.help-editor-inline-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.help-editor-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  line-height: 1;\n}\n.help-editor-inline-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.help-editor-inline-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.help-editor-inline-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.help-editor-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.help-editor-draft-title-input[_ngcontent-%COMP%], \n.help-editor-draft-summary-input[_ngcontent-%COMP%], \n.help-editor-section-title-input[_ngcontent-%COMP%], \n.help-editor-html-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(35, 61, 94, 0.18);\n  border-radius: 8px;\n  background: #fff;\n  color: #1f3658;\n  box-sizing: border-box;\n  font: inherit;\n}\n.help-editor-inline-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 38px;\n  padding: 0 0.58rem;\n  color: #7c5618;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.help-editor-inline-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  min-height: 38px;\n  padding: 0 2.25rem 0 0.58rem;\n  appearance: none;\n  background-image:\n    linear-gradient(\n      45deg,\n      transparent 50%,\n      #25476e 50%),\n    linear-gradient(\n      135deg,\n      #25476e 50%,\n      transparent 50%);\n  background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%;\n  background-repeat: no-repeat;\n  background-size: 6px 6px;\n  color: #25476e;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.help-editor-inline-field-compact[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  color: rgba(108, 74, 19, 0.9);\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.help-editor-inline-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 68px;\n  max-height: 96px;\n  padding: 0.5rem 0.58rem;\n  color: rgba(108, 74, 19, 0.9);\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.35;\n  resize: vertical;\n}\n.help-editor-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 36px;\n  padding: 0 0.58rem;\n  font-size: 0.8rem;\n}\n.help-editor-draft-title-input[_ngcontent-%COMP%], \n.help-editor-draft-summary-input[_ngcontent-%COMP%] {\n  min-height: 34px;\n  padding: 0 0.56rem;\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.help-editor-draft-summary-input[_ngcontent-%COMP%] {\n  color: #7c5618;\n  font-weight: 900;\n}\n.help-editor-html-textarea[_ngcontent-%COMP%] {\n  min-height: 250px;\n  padding: 0.7rem;\n  resize: vertical;\n  font-family:\n    "Roboto Mono",\n    "Consolas",\n    monospace;\n  font-size: 0.8rem;\n  line-height: 1.42;\n  tab-size: 2;\n}\n.help-editor-preview-section[_ngcontent-%COMP%], \n.help-editor-revision-card[_ngcontent-%COMP%] {\n  border: 1px solid rgba(31, 61, 99, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  overflow: hidden;\n}\n.help-editor-preview-section.help-editor-edit-section[_ngcontent-%COMP%] {\n  overflow: visible;\n}\n.help-editor-preview-section.is-open[_ngcontent-%COMP%], \n.help-editor-revision-card.is-open[_ngcontent-%COMP%] {\n  border-color: rgba(47, 101, 170, 0.32);\n  box-shadow: 0 10px 24px rgba(23, 42, 72, 0.08);\n}\n.help-editor-revision-card.is-active[_ngcontent-%COMP%] {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #e7f8ed 0%,\n      #d4f0df 100%);\n  --help-editor-header-border: rgba(58, 143, 91, 0.36);\n  --help-editor-header-pill-bg: #1f7a49;\n  --help-editor-header-pill-color: #fff;\n  border-color: rgba(58, 143, 91, 0.36);\n  background: #f3fbf6;\n}\n.help-editor-revision-card.is-active.is-open[_ngcontent-%COMP%] {\n  border-color: rgba(42, 128, 77, 0.46);\n  box-shadow: 0 10px 24px rgba(32, 104, 63, 0.1);\n}\n.help-editor-preview-section-toggle[_ngcontent-%COMP%], \n.help-editor-edit-section-head[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 44px;\n  border: 0;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f1f6ff 100%);\n  color: #1f3d63;\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  padding: 0.58rem 0.76rem;\n  text-align: left;\n}\n.help-editor-preview-section.is-open[_ngcontent-%COMP%]    > .help-editor-preview-section-toggle[_ngcontent-%COMP%], \n.help-editor-edit-section.is-open[_ngcontent-%COMP%]    > .help-editor-edit-section-head[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f3ff 0%,\n      #dbeaff 100%);\n}\n.help-editor-edit-section.is-privacy-mandatory[_ngcontent-%COMP%]    > .help-editor-edit-section-head[_ngcontent-%COMP%], \n.help-editor-edit-section.is-privacy-mandatory.is-open[_ngcontent-%COMP%]    > .help-editor-edit-section-head[_ngcontent-%COMP%], \n.help-editor-preview-section.is-privacy-mandatory[_ngcontent-%COMP%]    > .help-editor-preview-section-toggle[_ngcontent-%COMP%], \n.help-editor-preview-section.is-privacy-mandatory.is-open[_ngcontent-%COMP%]    > .help-editor-preview-section-toggle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e3 0%,\n      #ffe8c5 100%);\n}\n.help-editor-preview-section.is-privacy-mandatory[_ngcontent-%COMP%]   .help-editor-preview-section-toggle[_ngcontent-%COMP%] {\n  color: #8a4f0e;\n}\n.help-editor-preview-section-toggle[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  cursor: pointer;\n}\n.help-editor-preview-section-toggle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.help-editor-preview-section-toggle[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.83rem;\n  font-weight: 800;\n}\n.help-editor-preview-section-toggle[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #2c629e;\n}\n.help-editor-edit-section-head[_ngcontent-%COMP%] {\n  display: flex;\n  box-sizing: border-box;\n  gap: 0.48rem;\n}\n.help-editor-section-icon-menu[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n[_nghost-%COMP%]     .help-editor-section-icon-menu .app-menu__trigger--layout-icon > .mat-icon:not(.app-menu__trigger-caret) {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n  line-height: 24px;\n}\n.help-editor-privacy-optional-toggle[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  height: 30px;\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n}\n.help-editor-privacy-optional-toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.help-editor-privacy-optional-toggle[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 104px;\n  height: 30px;\n  border: 1px solid rgba(177, 111, 24, 0.34);\n  border-radius: 999px;\n  background: #fff7ea;\n  color: #8a4f0e;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  padding: 0 0.56rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.help-editor-privacy-optional-toggle.is-optional[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  border-color: rgba(47, 101, 170, 0.28);\n  background: #fff;\n  color: #245c9c;\n}\n.help-editor-privacy-optional-toggle[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.help-editor-section-title-input[_ngcontent-%COMP%] {\n  flex: 0 1 330px;\n  min-width: 0;\n  max-width: min(34vw, 360px);\n  width: auto;\n  min-height: 34px;\n  padding: 0 0.5rem;\n  border-color: rgba(44, 98, 158, 0.16);\n  color: #1f3d63;\n  font-size: 0.83rem;\n  font-weight: 900;\n}\n.help-editor-panel-span-toggle[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 0;\n  height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.72);\n  padding: 0.16rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.14rem;\n}\n.help-editor-panel-span-btn[_ngcontent-%COMP%] {\n  min-width: 42px;\n  height: 24px;\n  border: 0;\n  border-radius: 999px;\n  background: transparent;\n  color: #2c629e;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.18rem;\n  padding: 0 0.34rem;\n  font: inherit;\n  font-size: 0.66rem;\n  font-weight: 950;\n  cursor: pointer;\n}\n.help-editor-panel-span-btn.is-active[_ngcontent-%COMP%] {\n  background: #e8f3ff;\n  color: #174f8d;\n  box-shadow: inset 0 0 0 1px rgba(44, 98, 158, 0.2);\n}\n.help-editor-panel-span-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.help-editor-section-title-input[_ngcontent-%COMP%]:focus, \n.help-editor-inline-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.help-editor-inline-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.help-editor-inline-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.help-editor-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.help-editor-draft-title-input[_ngcontent-%COMP%]:focus, \n.help-editor-html-textarea[_ngcontent-%COMP%]:focus {\n  outline: 2px solid rgba(47, 101, 170, 0.18);\n  border-color: rgba(47, 101, 170, 0.42);\n}\n.help-editor-mode-toggle[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  margin-left: auto;\n  min-width: 82px;\n  height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.78);\n  color: #245c9c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.26rem;\n  padding: 0 0.52rem;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.help-editor-mode-toggle[_ngcontent-%COMP%]:hover {\n  border-color: rgba(47, 101, 170, 0.34);\n  background: #fff;\n}\n.help-editor-mode-toggle[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.help-editor-section-caret[_ngcontent-%COMP%] {\n  color: #2c629e;\n  transition: transform 0.16s ease;\n}\n.is-open[_ngcontent-%COMP%]    > .help-editor-edit-section-head[_ngcontent-%COMP%]   .help-editor-section-caret[_ngcontent-%COMP%], \n.is-open[_ngcontent-%COMP%]    > .help-editor-revision-head[_ngcontent-%COMP%]   .help-editor-section-caret[_ngcontent-%COMP%], \n.is-open[_ngcontent-%COMP%]    > .help-editor-preview-section-toggle[_ngcontent-%COMP%]   .help-editor-section-caret[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.help-editor-section-edit[_ngcontent-%COMP%], \n.help-editor-revision-preview[_ngcontent-%COMP%], \n.help-editor-preview-section-body[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(47, 86, 139, 0.12);\n  padding: 0.72rem 0.76rem 0.82rem;\n  display: grid;\n  gap: 0.58rem;\n  background: #fff;\n}\n.help-editor-preview-section-body[_ngcontent-%COMP%] {\n  justify-items: start;\n}\n.help-editor-preview-card[_ngcontent-%COMP%] {\n  min-height: 0;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.74rem;\n  box-shadow: 0 7px 18px rgba(23, 42, 72, 0.06);\n}\n.help-editor-preview-card.help-editor-preview-section--span-1[_ngcontent-%COMP%], \n.help-editor-preview-card.help-editor-preview-section--span-2[_ngcontent-%COMP%], \n.help-editor-preview-card.help-editor-preview-section--span-3[_ngcontent-%COMP%] {\n  min-height: 0;\n  border-color: rgba(40, 80, 128, 0.14);\n  box-shadow: 0 7px 18px rgba(23, 42, 72, 0.06);\n}\n.help-editor-preview-card.help-editor-preview-section--span-1[_ngcontent-%COMP%] {\n  width: min(100%, 330px);\n}\n.help-editor-preview-card.help-editor-preview-section--span-2[_ngcontent-%COMP%] {\n  width: min(100%, 690px);\n}\n.help-editor-preview-card.help-editor-preview-section--span-3[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.help-editor-popup-preview-title[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #1d3354;\n  font-size: 0.92rem;\n  font-weight: 950;\n  line-height: 1.16;\n}\n.help-editor-popup-preview-blurb[_ngcontent-%COMP%] {\n  margin: 0.26rem 0 0;\n  color: rgba(42, 61, 88, 0.78);\n  font-size: 0.78rem;\n  font-weight: 780;\n  line-height: 1.36;\n}\n.help-editor-preview-lead[_ngcontent-%COMP%] {\n  margin: 0 0 0.45rem;\n  color: rgba(29, 59, 97, 0.86);\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.help-editor-html-preview[_ngcontent-%COMP%] {\n  color: rgba(25, 48, 77, 0.92);\n  font-size: 0.8rem;\n  line-height: 1.48;\n}\n[_nghost-%COMP%]     .help-editor-html-preview :is(p, ul, ol) {\n  margin: 0.42rem 0 0;\n}\n[_nghost-%COMP%]     .help-editor-html-preview :is(p, ul, ol):first-child {\n  margin-top: 0;\n}\n[_nghost-%COMP%]     .help-editor-html-preview :is(h3, h4) {\n  margin: 0.5rem 0 0;\n  color: #1f3658;\n}\n[_nghost-%COMP%]     .help-editor-html-preview ul, \n[_nghost-%COMP%]     .help-editor-html-preview ol {\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.2rem;\n}\n[_nghost-%COMP%]     .help-editor-html-preview a {\n  color: #245c9c;\n  font-weight: 800;\n}\n[_nghost-%COMP%]     .help-editor-html-preview figure {\n  margin: 0.58rem 0 0;\n  display: flex;\n  justify-content: center;\n}\n[_nghost-%COMP%]     .help-editor-html-preview img {\n  display: block;\n  width: 100%;\n  height: auto;\n  max-width: 100%;\n  max-height: 280px;\n  object-fit: contain;\n  margin: 0.58rem auto 0;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 10px;\n  background: #f5f8fc;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);\n}\n[_nghost-%COMP%]     .help-editor-html-preview--span-2 img, \n[_nghost-%COMP%]     .help-editor-html-preview--span-3 img {\n  width: 100%;\n}\n[_nghost-%COMP%]     .help-editor-html-preview--span-2 img {\n  max-height: 300px;\n}\n[_nghost-%COMP%]     .help-editor-html-preview--span-3 img {\n  max-height: 340px;\n}\n.help-editor-revision-head[_ngcontent-%COMP%] {\n  min-height: 58px;\n  display: flex;\n  align-items: stretch;\n  background: var(--help-editor-header-bg);\n  cursor: pointer;\n}\n.help-editor-revision-card.is-open[_ngcontent-%COMP%]    > .help-editor-revision-head[_ngcontent-%COMP%] {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-draft-card[_ngcontent-%COMP%]    > .help-editor-draft-head[_ngcontent-%COMP%], \n.help-editor-draft-card.is-open[_ngcontent-%COMP%]    > .help-editor-draft-head[_ngcontent-%COMP%] {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-revision-card.is-active[_ngcontent-%COMP%]    > .help-editor-revision-head[_ngcontent-%COMP%] {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-revision-card.is-active.is-open[_ngcontent-%COMP%]    > .help-editor-revision-head[_ngcontent-%COMP%] {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-revision-toggle[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1 1 auto;\n  border: 0;\n  background: transparent;\n  color: #223b60;\n  display: flex;\n  align-items: center;\n  gap: 0.52rem;\n  padding: 0.48rem 0.64rem;\n  text-align: left;\n  cursor: pointer;\n}\n.help-editor-revision-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.1rem;\n}\n.help-editor-revision-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.help-editor-revision-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.help-editor-revision-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f3658;\n  font-size: 0.86rem;\n  white-space: nowrap;\n}\n.help-editor-revision-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(31, 51, 78, 0.62);\n  font-size: 0.72rem;\n  font-weight: 800;\n  line-height: 1.22;\n  overflow: visible;\n  text-overflow: clip;\n}\n.help-editor-version-pill[_ngcontent-%COMP%], \n.help-editor-active-badge[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 900;\n}\n.help-editor-version-pill[_ngcontent-%COMP%] {\n  min-width: 42px;\n  height: 28px;\n  border: 1px solid rgba(36, 91, 156, 0.2);\n  background: var(--help-editor-header-pill-bg);\n  color: var(--help-editor-header-pill-color);\n  font-size: 0.74rem;\n  padding: 0 0.54rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);\n}\n.help-editor-draft-version-pill[_ngcontent-%COMP%] {\n  min-width: 96px;\n  padding: 0 0.72rem;\n  white-space: nowrap;\n}\n.help-editor-active-badge[_ngcontent-%COMP%] {\n  min-width: 52px;\n  height: 24px;\n  background: #246b42;\n  color: #fff;\n  font-size: 0.68rem;\n  box-shadow: 0 0 0 1px rgba(24, 86, 51, 0.16);\n}\n.help-editor-revision-card.is-active[_ngcontent-%COMP%]   .help-editor-version-pill[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.44);\n  background: var(--help-editor-header-pill-bg);\n  color: var(--help-editor-header-pill-color);\n}\n.help-editor-revision-actions[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  padding: 0.5rem 0.56rem 0.5rem 0;\n}\n.help-editor-state-card[_ngcontent-%COMP%], \n.help-editor-empty-state[_ngcontent-%COMP%], \n.help-editor-error[_ngcontent-%COMP%] {\n  border: 1px solid rgba(31, 61, 99, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  color: #263f62;\n}\n.help-editor-state-card[_ngcontent-%COMP%], \n.help-editor-empty-state[_ngcontent-%COMP%] {\n  min-height: 220px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.42rem;\n  text-align: center;\n}\n.help-editor-loading-state[_ngcontent-%COMP%] {\n  min-height: 230px;\n  gap: 0.54rem;\n  color: rgba(31, 58, 90, 0.82);\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.help-editor-empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #1f3658;\n  font-size: 0.92rem;\n}\n.help-editor-empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(31, 51, 78, 0.7);\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.help-editor-state-card[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.help-editor-empty-state[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  font-size: 34px;\n  color: rgba(66, 106, 158, 0.52);\n}\n.help-editor-error[_ngcontent-%COMP%] {\n  min-height: 38px;\n  padding: 0 0.64rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  background: #fff6f7;\n  color: #a43548;\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.help-editor-error[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n@media (max-width: 760px) {\n  .help-editor-draft-actions[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    align-items: stretch;\n  }\n  .help-editor-form-actions[_ngcontent-%COMP%], \n   .help-editor-add-section-btn[_ngcontent-%COMP%], \n   .help-editor-hero-add-section-btn[_ngcontent-%COMP%], \n   .help-editor-draft-title-input[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .help-editor-description-row[_ngcontent-%COMP%] {\n    display: grid;\n  }\n  .help-editor-summary-line[_ngcontent-%COMP%], \n   .help-editor-description-line[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) 38px;\n    gap: 0.46rem;\n  }\n  .help-editor-summary-edit-panel[_ngcontent-%COMP%] {\n    padding: 0.7rem 0.58rem 0.72rem;\n  }\n  .help-editor-summary-line[_ngcontent-%COMP%]   .help-editor-icon-btn[_ngcontent-%COMP%], \n   .help-editor-description-line[_ngcontent-%COMP%]   .help-editor-hero-add-section-btn[_ngcontent-%COMP%] {\n    width: 36px;\n    height: 36px;\n    min-width: 36px;\n  }\n  .help-editor-hero-add-section-btn[_ngcontent-%COMP%] {\n    position: static;\n    justify-self: center;\n  }\n  .help-editor-description-line[_ngcontent-%COMP%]   .help-editor-hero-add-section-btn[_ngcontent-%COMP%] {\n    margin-bottom: 15px;\n  }\n  .help-editor-form-actions[_ngcontent-%COMP%] {\n    justify-content: space-between;\n  }\n  .help-editor-revision-head[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n  .help-editor-draft-head[_ngcontent-%COMP%] {\n    align-items: center;\n  }\n  .help-editor-revision-toggle[_ngcontent-%COMP%] {\n    flex-basis: 100%;\n  }\n  .help-editor-draft-toggle[_ngcontent-%COMP%] {\n    display: contents;\n  }\n  .help-editor-draft-toggle[_ngcontent-%COMP%]   .help-editor-draft-version-pill[_ngcontent-%COMP%] {\n    order: 1;\n    margin: 0.58rem 0 0 0.58rem;\n  }\n  .help-editor-draft-head[_ngcontent-%COMP%]   .help-editor-draft-header-actions[_ngcontent-%COMP%] {\n    order: 2;\n    margin-left: auto;\n    padding: 0.5rem 0.56rem 0 0;\n  }\n  .help-editor-draft-title-wrap[_ngcontent-%COMP%] {\n    order: 3;\n    flex: 1 1 100%;\n    width: 100%;\n    padding: 0.48rem 0.58rem 0.62rem;\n  }\n  .help-editor-draft-title-wrap[_ngcontent-%COMP%]   .help-editor-draft-title-input[_ngcontent-%COMP%] {\n    max-width: none;\n  }\n  .help-editor-revision-actions[_ngcontent-%COMP%] {\n    margin-left: auto;\n    padding: 0 0.56rem 0.5rem;\n  }\n  .help-editor-edit-section-head[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n    align-items: center;\n    gap: 0.48rem;\n  }\n  .help-editor-edit-section-head[_ngcontent-%COMP%]   .help-editor-section-icon-menu[_ngcontent-%COMP%] {\n    order: 1;\n  }\n  .help-editor-edit-section-head[_ngcontent-%COMP%]   .help-editor-section-title-input[_ngcontent-%COMP%] {\n    order: 2;\n    flex: 1 1 calc(100% - 78px);\n    max-width: none;\n    width: auto;\n  }\n  .help-editor-edit-section-head[_ngcontent-%COMP%]   .help-editor-caret-btn[_ngcontent-%COMP%] {\n    order: 3;\n    margin-left: auto;\n  }\n  .help-editor-edit-section-head[_ngcontent-%COMP%]   .help-editor-privacy-optional-toggle[_ngcontent-%COMP%] {\n    order: 4;\n    margin-left: auto;\n  }\n  .help-editor-edit-section-head[_ngcontent-%COMP%]   .help-editor-mode-toggle[_ngcontent-%COMP%] {\n    order: 5;\n    margin-left: 0;\n  }\n  .help-editor-edit-section-head[_ngcontent-%COMP%]   .help-editor-danger-btn[_ngcontent-%COMP%] {\n    order: 6;\n  }\n  .help-editor-mode-toggle[_ngcontent-%COMP%] {\n    min-width: 34px;\n    padding: 0;\n  }\n  .help-editor-mode-toggle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=admin-help-editor-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminHelpEditorPopupComponent, [{
    type: Component,
    args: [{ selector: "app-admin-help-editor-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      ImageCarouselComponent,
      IndicatorComponent,
      LazyBgImageDirective,
      PopupComponent,
      AppMenuComponent
    ], template: `@if (admin.activePopup() === 'help-editor') {
  <app-popup [model]="helpEditorPopupModel()">
      <div class="help-editor-body">
        @if (loading()) {
          <div class="help-editor-state-card help-editor-loading-state" aria-busy="true">
            <app-indicator
              kind="load-ring"
              state="loading"
            ></app-indicator>
            <span>{{ loadingRevisionsLabel() }}</span>
          </div>
        } @else {
          @if (error) {
            <div class="help-editor-error">
              <mat-icon>warning</mat-icon>
              <span>{{ error }}</span>
            </div>
          }

          <section class="help-editor-revisions-pane">
            @let rows = revisionRows();
            @if (rows.length > 0) {
              <div class="help-editor-revision-list" [attr.aria-label]="revisionsAriaLabel()">
                @for (row of rows; track row.id) {
                  @if (row.kind === 'draft') {
                    @if (draft; as editDraft) {
                      <form class="help-editor-form help-editor-draft-row" (ngSubmit)="saveDraft($event)">
                        <article class="help-editor-revision-card help-editor-draft-card" [class.is-open]="draftAccordionOpen">
                          <div class="help-editor-revision-head help-editor-draft-head">
                            <div class="help-editor-revision-toggle help-editor-draft-toggle">
                              <span class="help-editor-version-pill help-editor-draft-version-pill">{{ draftVersionLabel() }}</span>
                              <span class="help-editor-revision-copy help-editor-draft-title-wrap">
                                <input
                                  class="help-editor-draft-title-input"
                                  type="text"
                                  name="helpTitle"
                                  [(ngModel)]="editDraft.title"
                                  placeholder="Revision title"
                                  required
                                />
                              </span>
                            </div>
                            <div class="help-editor-revision-actions help-editor-draft-header-actions">
                              <span class="help-editor-action-ring-shell help-editor-circle-ring-shell" [class.is-loading]="saving">
                                @if (saving) {
                                  <app-indicator kind="action-ring" shape="circle" state="loading"></app-indicator>
                                }
                                <button
                                  type="submit"
                                  class="help-editor-icon-btn help-editor-confirm-btn"
                                  [disabled]="saving"
                                  [attr.aria-label]="saving ? 'Saving revision' : 'Save v' + nextRevisionVersion()"
                                  [title]="saving ? 'Saving revision' : 'Save v' + nextRevisionVersion()"
                                  >
                                  <mat-icon>check</mat-icon>
                                </button>
                              </span>
                              <button
                                type="button"
                                class="help-editor-icon-btn"
                                [disabled]="saving"
                                (click)="cancelEditing($event)"
                                aria-label="Cancel editing"
                                title="Cancel editing"
                                >
                                <mat-icon>close</mat-icon>
                              </button>
                              <button
                                type="button"
                                class="help-editor-inline-icon-btn help-editor-caret-btn"
                                [attr.aria-expanded]="draftAccordionOpen"
                                (click)="toggleDraftRevision($event)"
                                aria-label="Toggle draft revision"
                                >
                                <mat-icon class="help-editor-section-caret">expand_more</mat-icon>
                              </button>
                            </div>
                          </div>

                          @if (draftAccordionOpen) {
                          <div class="help-editor-revision-preview help-editor-draft-body">
                            <div class="help-editor-description-edit help-editor-summary-edit-panel" [ngClass]="headerColorClass(editDraft.headerColor)">
                              <div class="help-editor-description-row">
                                <div class="help-editor-summary-line">
                                  <label class="help-editor-inline-field">
                                    <span>Header</span>
                                    <input
                                      class="help-editor-draft-summary-input"
                                      type="text"
                                      name="helpSummary"
                                      [(ngModel)]="editDraft.summary"
                                      [placeholder]="popupHeaderPlaceholder()"
                                      required
                                    />
                                  </label>
                                  <app-menu
                                    class="help-editor-summary-color-menu"
                                    kind="select"
                                    [trigger]="headerColorMenuTrigger(editDraft.headerColor)"
                                    [items]="headerColorMenuItems(editDraft.headerColor)"
                                    panelAlign="end"
                                    panelMode="anchored"
                                    (itemSelect)="onHeaderColorMenuSelect($event)"
                                  ></app-menu>
                                </div>
                                @if (documentKind === 'explanation') {
                                  <label class="help-editor-inline-field help-editor-context-field">
                                    <span>{{ uiText('Canonical screen') }}</span>
                                    <app-menu
                                      kind="select"
                                      [trigger]="contextMenuTrigger(editDraft)"
                                      [items]="contextMenuItems(editDraft)"
                                      panelAlign="start"
                                      [closeOnSelect]="true"
                                      (itemSelect)="onContextMenuSelect($event)"
                                    ></app-menu>
                                  </label>
                                }
                                <div class="help-editor-description-line">
                                  <label class="help-editor-inline-field help-editor-inline-field-compact">
                                    <span>Description</span>
                                    <textarea
                                      name="helpDescription"
                                      [(ngModel)]="editDraft.description"
                                      [placeholder]="descriptionPlaceholder()"
                                      rows="3"
                                      required
                                    ></textarea>
                                  </label>
                                  <button
                                    type="button"
                                    class="help-editor-hero-add-section-btn"
                                    (click)="addDraftSection($event)"
                                    [attr.aria-label]="addSectionLabel()"
                                    title="Add section"
                                    >
                                    <mat-icon>add</mat-icon>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div class="help-editor-preview-accordion" [attr.aria-label]="editableSectionsAriaLabel()">
                              @for (section of editDraft.sections; track section.localId; let sectionIndex = $index) {
                                <article
                                  class="help-editor-preview-section help-editor-edit-section"
                                  [class.is-open]="openDraftSectionId === section.localId"
                                  [class.is-privacy-mandatory]="documentKind === 'privacy' && !section.optional"
                                  [class.is-privacy-optional]="documentKind === 'privacy' && section.optional"
                                  >
                                  <div class="help-editor-edit-section-head">
                                    <app-menu
                                      class="help-editor-section-icon-menu"
                                      kind="select"
                                      title="Search Material icons"
                                      [trigger]="sectionIconMenuTrigger(section)"
                                      [model]="sectionIconMenuModel(section)"
                                      [filterable]="true"
                                      panelAlign="start"
                                      [closeOnSelect]="true"
                                      (itemSelect)="onSectionIconMenuSelect(section, $event)"
                                    ></app-menu>
                                    <input
                                      class="help-editor-section-title-input"
                                      type="text"
                                      [name]="'sectionTitle' + sectionIndex"
                                      [(ngModel)]="section.title"
                                      [ngModelOptions]="{ standalone: true }"
                                      placeholder="Section label"
                                      required
                                      [attr.aria-label]="sectionTitleAriaLabel()"
                                    />
                                    @if (documentKind === 'explanation') {
                                      <div class="help-editor-panel-span-toggle" role="group" aria-label="Panel grid span">
                                        @for (option of panelSpanOptions; track option.value) {
                                          <button
                                            type="button"
                                            class="help-editor-panel-span-btn"
                                            [class.is-active]="section.panelSpan === option.value"
                                            [attr.aria-pressed]="section.panelSpan === option.value"
                                            [title]="option.title"
                                            (click)="setDraftSectionPanelSpan(section, option.value, $event)"
                                            >
                                            <mat-icon>{{ option.icon }}</mat-icon>
                                            <span>{{ option.label }}</span>
                                          </button>
                                        }
                                      </div>
                                    }
                                    @if (documentKind === 'privacy') {
                                      <label
                                        class="help-editor-privacy-optional-toggle"
                                        [class.is-optional]="section.optional"
                                        [class.is-mandatory]="!section.optional"
                                        (click)="$event.stopPropagation()"
                                        title="Optional sections do not block privacy approval"
                                        >
                                        <input
                                          type="checkbox"
                                          [name]="'sectionOptional' + sectionIndex"
                                          [(ngModel)]="section.optional"
                                          [ngModelOptions]="{ standalone: true }"
                                          [attr.aria-label]="section.optional ? 'Mark section mandatory' : 'Mark section optional'"
                                        />
                                        <span>
                                          <mat-icon>{{ section.optional ? 'check_circle' : 'priority_high' }}</mat-icon>
                                          <span>{{ section.optional ? 'Optional' : 'Mandatory' }}</span>
                                        </span>
                                      </label>
                                    }
                                    <button
                                      type="button"
                                      class="help-editor-mode-toggle"
                                      (click)="toggleDraftSectionMode(section, $event)"
                                      [attr.aria-label]="section.mode === 'html' ? 'Switch to preview' : 'Switch to HTML'"
                                      [title]="section.mode === 'html' ? 'Switch to preview' : 'Switch to HTML'"
                                      >
                                      <mat-icon>{{ section.mode === 'html' ? 'code' : 'visibility' }}</mat-icon>
                                      <span>{{ section.mode === 'html' ? 'HTML' : 'Preview' }}</span>
                                    </button>
                                    <button
                                      type="button"
                                      class="help-editor-inline-icon-btn help-editor-danger-btn"
                                      (click)="removeDraftSection(section, $event)"
                                      [attr.aria-label]="removeSectionLabel()"
                                      title="Remove section"
                                      >
                                      <mat-icon>delete</mat-icon>
                                    </button>
                                    <button
                                      type="button"
                                      class="help-editor-inline-icon-btn help-editor-caret-btn"
                                      [attr.aria-expanded]="openDraftSectionId === section.localId"
                                      (click)="toggleDraftSection(section, $event)"
                                      [attr.aria-label]="toggleSectionLabel()"
                                      >
                                      <mat-icon class="help-editor-section-caret">expand_more</mat-icon>
                                    </button>
                                  </div>
                                  @if (openDraftSectionId === section.localId) {
                                    <div class="help-editor-preview-section-body help-editor-section-edit">
                                      @if (documentKind === 'explanation') {
                                        <app-image-carousel
                                          [name]="'sectionImages' + sectionIndex"
                                          [(ngModel)]="section.imageUrls"
                                          [disabled]="saving"
                                          [compact]="true"
                                          [uploadOwnerId]="actorUserId()"
                                          ariaLabel="Explanation image slots"
                                        ></app-image-carousel>
                                      }
                                      @if (section.mode === 'html') {
                                        <textarea
                                          class="help-editor-html-textarea"
                                          [name]="'sectionHtml' + sectionIndex"
                                          [(ngModel)]="section.contentHtml"
                                          [ngModelOptions]="{ standalone: true }"
                                          placeholder="Paste or edit the section HTML"
                                          spellcheck="false"
                                          (paste)="formatPastedSectionHtml(section, $event)"
                                        ></textarea>
                                      } @else {
                                        <div
                                          class="help-editor-preview-card"
                                          [ngClass]="previewPanelSpanClass(section)"
                                          >
                                          <h3 class="help-editor-popup-preview-title" data-i18n-ignore>{{ section.title || defaultUntitledContentSectionTitle() }}</h3>
                                          @if (section.blurb) {
                                            <p class="help-editor-popup-preview-blurb" data-i18n-ignore>{{ section.blurb }}</p>
                                          }
                                          <div
                                            class="help-editor-html-preview"
                                            [ngClass]="previewSectionLayoutClass(section)"
                                            appLazyBgImage
                                            [appLazyHtmlImages]="true"
                                            data-i18n-ignore
                                            [innerHTML]="previewSectionContentHtml(section)"
                                          ></div>
                                        </div>
                                      }
                                    </div>
                                  }
                                </article>
                              }
                            </div>
                          </div>
                          }
                        </article>
                      </form>
                    }
                  } @else if (row.revision; as revision) {
                    <article class="help-editor-revision-card" [class.is-open]="isRevisionOpen(revision)" [class.is-active]="revision.active">
                      <div class="help-editor-revision-head" (click)="toggleRevision(revision, $event)">
                        <button
                          type="button"
                          class="help-editor-revision-toggle"
                          [attr.aria-expanded]="isRevisionOpen(revision)"
                          (click)="toggleRevision(revision, $event)"
                          >
                          <span class="help-editor-version-pill">v{{ revision.version }}</span>
                          <span class="help-editor-revision-copy">
                            <strong data-i18n-ignore>{{ revision.summary || revision.title }}</strong>
                            <small>{{ revisionSubtitle(revision) }}</small>
                          </span>
                          @if (revision.active) {
                            <span class="help-editor-active-badge">Active</span>
                          }
                        </button>
                        <div class="help-editor-revision-actions">
                          <button
                            type="button"
                            class="help-editor-icon-btn"
                            [disabled]="saving || !!activatingRevisionId"
                            (click)="startEditingRevision(revision, $event)"
                            aria-label="Edit revision"
                            title="Edit this revision"
                            >
                            <mat-icon>edit</mat-icon>
                          </button>
                          <span class="help-editor-action-ring-shell help-editor-circle-ring-shell" [class.is-loading]="activatingRevisionId === revision.id">
                            @if (activatingRevisionId === revision.id) {
                              <app-indicator kind="action-ring" shape="circle" state="loading"></app-indicator>
                            }
                            <button
                              type="button"
                              class="help-editor-icon-btn"
                              [disabled]="revision.active || saving || !!activatingRevisionId"
                              (click)="activateRevision(revision, $event)"
                              aria-label="Activate revision"
                              title="Switch to this revision"
                              >
                              <mat-icon>published_with_changes</mat-icon>
                            </button>
                          </span>
                          <button
                            type="button"
                            class="help-editor-icon-btn help-editor-danger-btn"
                            [disabled]="saving || !!activatingRevisionId"
                            (click)="deleteRevision(revision, $event)"
                            aria-label="Delete revision"
                            title="Delete revision"
                            >
                            <mat-icon>delete</mat-icon>
                          </button>
                          <button
                            type="button"
                            class="help-editor-inline-icon-btn help-editor-caret-btn"
                            [attr.aria-expanded]="isRevisionOpen(revision)"
                            (click)="toggleRevision(revision, $event)"
                            aria-label="Toggle revision"
                            >
                            <mat-icon class="help-editor-section-caret">expand_more</mat-icon>
                          </button>
                        </div>
                      </div>

                      @if (isRevisionOpen(revision)) {
                        <div class="help-editor-revision-preview">
                          <div class="help-editor-preview-accordion">
                            @for (section of revision.sections; track section.id) {
                              <article
                                class="help-editor-preview-section"
                                [class.is-open]="openPreviewSectionId === section.id"
                                [class.is-privacy-mandatory]="documentKind === 'privacy' && !section.optional"
                                [class.is-privacy-optional]="documentKind === 'privacy' && section.optional"
                                >
                                <button
                                  type="button"
                                  class="help-editor-preview-section-toggle"
                                  [attr.aria-expanded]="openPreviewSectionId === section.id"
                                  (click)="togglePreviewSection(section.id, $event)"
                                  >
                                  <span>
                                    <mat-icon>{{ section.icon }}</mat-icon>
                                    <strong data-i18n-ignore>{{ section.title }}</strong>
                                  </span>
                                  <mat-icon class="help-editor-section-caret">expand_more</mat-icon>
                                </button>
                                @if (openPreviewSectionId === section.id) {
                                  <div class="help-editor-preview-section-body">
                                    <div
                                      class="help-editor-preview-card"
                                      [ngClass]="previewPanelSpanClass(section)"
                                      >
                                      <h3 class="help-editor-popup-preview-title" data-i18n-ignore>{{ section.title || defaultUntitledContentSectionTitle() }}</h3>
                                      @if (section.blurb) {
                                        <p class="help-editor-popup-preview-blurb" data-i18n-ignore>{{ section.blurb }}</p>
                                      }
                                      <div
                                        class="help-editor-html-preview"
                                        [ngClass]="previewSectionLayoutClass(section)"
                                        appLazyBgImage
                                        [appLazyHtmlImages]="true"
                                        data-i18n-ignore
                                        [innerHTML]="previewSectionContentHtml(section)"
                                      ></div>
                                    </div>
                                  </div>
                                }
                              </article>
                            }
                          </div>
                        </div>
                      }
                    </article>
                  }
                }
                </div>
              } @else {
                <div class="help-editor-empty-state">
                  <mat-icon>{{ defaultSectionIcon() }}</mat-icon>
                  <h3>{{ noRevisionsLabel() }}</h3>
                  <p>{{ createRevisionToEnablePopupLabel() }}</p>
                  <button type="button" class="help-editor-primary-btn" (click)="startNewRevision($event)">
                    <mat-icon>add</mat-icon>
                    <span>Create revision</span>
                  </button>
                </div>
              }
          </section>
        }
      </div>
  </app-popup>
}
`, styles: ['/* src/app/admin/components/help-editor-popup/admin-help-editor-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.help-editor-form-actions,\n.help-editor-revision-actions,\n.help-editor-draft-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.help-editor-icon-btn,\n.help-editor-inline-icon-btn {\n  border: 1px solid rgba(47, 86, 139, 0.22);\n  border-radius: 50%;\n  background: #f7faff;\n  color: #2f5f98;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.help-editor-icon-btn {\n  width: 34px;\n  height: 34px;\n}\n.help-editor-inline-icon-btn {\n  flex: 0 0 auto;\n  width: 30px;\n  height: 30px;\n}\n.help-editor-icon-btn .mat-icon,\n.help-editor-inline-icon-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.help-editor-icon-btn:disabled,\n.help-editor-inline-icon-btn:disabled {\n  opacity: 0.48;\n  cursor: default;\n}\n.help-editor-edit-btn.is-active {\n  border-color: rgba(42, 112, 185, 0.52);\n  background: #e7f2ff;\n}\n.help-editor-danger-btn {\n  border-color: rgba(180, 64, 82, 0.26);\n  color: #b34254;\n  background: #fff6f7;\n}\n.help-editor-confirm-btn {\n  border-color: rgba(34, 123, 74, 0.28);\n  color: #1f7649;\n  background: #f2fff7;\n}\n.help-editor-body {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.help-editor-revisions-pane {\n  min-height: 0;\n  flex: 1 1 auto;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  overflow-y: auto;\n  padding: 0.54rem;\n}\n.help-editor-form,\n.help-editor-revision-list,\n.help-editor-preview-accordion {\n  display: grid;\n  gap: 0.5rem;\n}\n.help-editor-draft-actions {\n  display: grid;\n  grid-template-columns: minmax(220px, 1fr) auto;\n  align-items: end;\n  gap: 0.5rem;\n}\n.help-editor-primary-btn,\n.help-editor-secondary-btn,\n.help-editor-add-section-btn,\n.help-editor-hero-add-section-btn {\n  min-height: 34px;\n  border-radius: 999px;\n  padding: 0 0.78rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.help-editor-primary-btn {\n  border: 1px solid rgba(35, 96, 160, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #e5f2ff 0%,\n      #c9dff8 100%);\n  color: #174d86;\n}\n.help-editor-secondary-btn {\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  background: #fff;\n  color: #304b70;\n}\n.help-editor-add-section-btn {\n  border: 1px solid rgba(65, 130, 98, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f2fff7 0%,\n      #def5e7 100%);\n  color: #286140;\n}\n.help-editor-hero-add-section-btn {\n  flex: 0 0 auto;\n  position: absolute;\n  right: 0.58rem;\n  bottom: 0.72rem;\n  width: 38px;\n  height: 38px;\n  min-width: 38px;\n  padding: 0;\n  align-self: end;\n  border: 1px solid rgba(65, 130, 98, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f2fff7 0%,\n      #def5e7 100%);\n  color: #286140;\n}\n.help-editor-primary-btn:disabled,\n.help-editor-secondary-btn:disabled,\n.help-editor-add-section-btn:disabled,\n.help-editor-hero-add-section-btn:disabled {\n  opacity: 0.56;\n  cursor: default;\n}\n.help-editor-primary-btn .mat-icon,\n.help-editor-add-section-btn .mat-icon,\n.help-editor-hero-add-section-btn .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.help-editor-action-ring-shell {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n}\n.help-editor-circle-ring-shell {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n}\n.help-editor-circle-ring-shell .help-editor-icon-btn {\n  position: relative;\n  z-index: 1;\n}\n.help-editor-circle-ring-shell.is-loading .help-editor-icon-btn,\n.help-editor-circle-ring-shell.is-loading .help-editor-icon-btn:hover,\n.help-editor-circle-ring-shell.is-loading .help-editor-icon-btn:disabled {\n  border-color: rgba(181, 117, 23, 0.76);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  opacity: 1;\n  cursor: wait;\n  box-shadow: none;\n}\n.help-editor-draft-title-input {\n  min-width: 0;\n}\n.help-editor-draft-summary-input {\n  min-width: 0;\n}\n.help-editor-draft-row {\n  margin: 0;\n}\n.help-editor-revision-card,\n.help-editor-draft-card {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f1f6ff 100%);\n  --help-editor-header-border: rgba(31, 61, 99, 0.14);\n  --help-editor-header-pill-bg: #d7e8ff;\n  --help-editor-header-pill-color: #174d86;\n}\n.help-editor-header-color-amber {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  --help-editor-header-border: rgba(157, 118, 41, 0.3);\n  --help-editor-header-pill-bg: #b66a15;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-blue {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #f8fbff 100%);\n  --help-editor-header-border: rgba(53, 96, 162, 0.3);\n  --help-editor-header-pill-bg: #2f6fae;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-green {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #f0fbf3 0%,\n      #e4f7ea 100%);\n  --help-editor-header-border: rgba(58, 143, 91, 0.34);\n  --help-editor-header-pill-bg: #1f7a49;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-rose {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #fff8fa 100%);\n  --help-editor-header-border: rgba(178, 69, 98, 0.3);\n  --help-editor-header-pill-bg: #b94462;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-violet {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #f5f0ff 0%,\n      #fbf8ff 100%);\n  --help-editor-header-border: rgba(107, 80, 175, 0.3);\n  --help-editor-header-pill-bg: #6b50af;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-header-color-slate {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --help-editor-header-border: rgba(72, 92, 118, 0.28);\n  --help-editor-header-pill-bg: #40566f;\n  --help-editor-header-pill-color: #fff;\n}\n.help-editor-draft-card {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #fff3dc 0%,\n      #ffe8c1 100%);\n  --help-editor-header-border: rgba(181, 117, 23, 0.34);\n  --help-editor-header-pill-bg: #b66a15;\n  --help-editor-header-pill-color: #fff;\n  border-color: var(--help-editor-header-border);\n  background: #fff;\n}\n.help-editor-draft-card.is-open {\n  border-color: var(--help-editor-header-border);\n  box-shadow: 0 10px 24px rgba(23, 42, 72, 0.08);\n}\n.help-editor-draft-toggle {\n  cursor: default;\n}\n.help-editor-draft-card .help-editor-version-pill {\n  border-color: rgba(255, 255, 255, 0.44);\n  background: var(--help-editor-header-pill-bg);\n  color: var(--help-editor-header-pill-color);\n}\n.help-editor-draft-title-wrap {\n  flex: 1 1 auto;\n}\n.help-editor-draft-title-wrap .help-editor-draft-title-input,\n.help-editor-draft-title-wrap .help-editor-draft-summary-input {\n  max-width: min(56vw, 760px);\n}\n.help-editor-draft-header-actions {\n  align-items: center;\n  gap: 0.44rem;\n}\n.help-editor-draft-body {\n  background: #fff;\n}\n.help-editor-description-edit {\n  position: relative;\n}\n.help-editor-summary-edit-panel {\n  border: 1px solid var(--help-editor-header-border);\n  border-radius: 8px;\n  background: var(--help-editor-header-bg);\n  padding: 0.72rem 0.76rem 0.78rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);\n}\n.help-editor-summary-edit-panel .help-editor-inline-field {\n  gap: 0.32rem;\n}\n.help-editor-summary-edit-panel .help-editor-inline-field > span {\n  color: rgba(30, 48, 74, 0.86);\n  font-size: 0.78rem;\n  font-weight: 950;\n}\n.help-editor-summary-edit-panel .help-editor-inline-field input,\n.help-editor-summary-edit-panel .help-editor-inline-field textarea {\n  background: rgba(255, 255, 255, 0.9);\n}\n.help-editor-description-row {\n  display: grid;\n  gap: 0.76rem;\n}\n.help-editor-summary-line,\n.help-editor-description-line {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 38px;\n  gap: 0.58rem;\n  align-items: end;\n}\n.help-editor-summary-line .help-editor-icon-btn,\n.help-editor-description-line .help-editor-hero-add-section-btn {\n  position: static;\n  width: 38px;\n  height: 38px;\n  min-width: 38px;\n  padding: 0;\n}\n.help-editor-description-line .help-editor-hero-add-section-btn {\n  margin-bottom: 15px;\n}\n.help-editor-summary-color-menu {\n  flex: 0 0 auto;\n}\n:host ::ng-deep .help-editor-summary-color-menu .app-menu__trigger {\n  width: 38px;\n  height: 38px;\n  min-width: 38px;\n  min-height: 38px;\n  border-radius: 50%;\n}\n:host ::ng-deep .help-editor-summary-color-menu .app-menu__trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.help-editor-help-hero {\n  position: relative;\n  padding: 0.7rem 0.76rem 0.72rem;\n  border: 1px solid rgba(157, 118, 41, 0.24);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.help-editor-help-hero h3,\n.help-editor-help-hero p {\n  margin: 0;\n}\n.help-editor-help-hero h3 {\n  color: #7c5618;\n  font-size: 0.92rem;\n  font-weight: 900;\n}\n.help-editor-help-hero p {\n  margin-top: 0.32rem;\n  color: rgba(108, 74, 19, 0.84);\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.help-editor-help-hero-edit {\n  display: grid;\n  gap: 0.46rem;\n  padding-right: 4.65rem;\n}\n.help-editor-inline-field,\n.help-editor-field {\n  min-width: 0;\n  display: grid;\n  gap: 0.24rem;\n  color: rgba(30, 48, 74, 0.78);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.help-editor-inline-field span,\n.help-editor-field span {\n  line-height: 1;\n}\n.help-editor-inline-field input,\n.help-editor-inline-field textarea,\n.help-editor-inline-field select,\n.help-editor-field input,\n.help-editor-draft-title-input,\n.help-editor-draft-summary-input,\n.help-editor-section-title-input,\n.help-editor-html-textarea {\n  width: 100%;\n  border: 1px solid rgba(35, 61, 94, 0.18);\n  border-radius: 8px;\n  background: #fff;\n  color: #1f3658;\n  box-sizing: border-box;\n  font: inherit;\n}\n.help-editor-inline-field input {\n  min-height: 38px;\n  padding: 0 0.58rem;\n  color: #7c5618;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.help-editor-inline-field select {\n  min-height: 38px;\n  padding: 0 2.25rem 0 0.58rem;\n  appearance: none;\n  background-image:\n    linear-gradient(\n      45deg,\n      transparent 50%,\n      #25476e 50%),\n    linear-gradient(\n      135deg,\n      #25476e 50%,\n      transparent 50%);\n  background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%;\n  background-repeat: no-repeat;\n  background-size: 6px 6px;\n  color: #25476e;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.help-editor-inline-field-compact input {\n  color: rgba(108, 74, 19, 0.9);\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.help-editor-inline-field textarea {\n  min-height: 68px;\n  max-height: 96px;\n  padding: 0.5rem 0.58rem;\n  color: rgba(108, 74, 19, 0.9);\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.35;\n  resize: vertical;\n}\n.help-editor-field input {\n  min-height: 36px;\n  padding: 0 0.58rem;\n  font-size: 0.8rem;\n}\n.help-editor-draft-title-input,\n.help-editor-draft-summary-input {\n  min-height: 34px;\n  padding: 0 0.56rem;\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.help-editor-draft-summary-input {\n  color: #7c5618;\n  font-weight: 900;\n}\n.help-editor-html-textarea {\n  min-height: 250px;\n  padding: 0.7rem;\n  resize: vertical;\n  font-family:\n    "Roboto Mono",\n    "Consolas",\n    monospace;\n  font-size: 0.8rem;\n  line-height: 1.42;\n  tab-size: 2;\n}\n.help-editor-preview-section,\n.help-editor-revision-card {\n  border: 1px solid rgba(31, 61, 99, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  overflow: hidden;\n}\n.help-editor-preview-section.help-editor-edit-section {\n  overflow: visible;\n}\n.help-editor-preview-section.is-open,\n.help-editor-revision-card.is-open {\n  border-color: rgba(47, 101, 170, 0.32);\n  box-shadow: 0 10px 24px rgba(23, 42, 72, 0.08);\n}\n.help-editor-revision-card.is-active {\n  --help-editor-header-bg:\n    linear-gradient(\n      180deg,\n      #e7f8ed 0%,\n      #d4f0df 100%);\n  --help-editor-header-border: rgba(58, 143, 91, 0.36);\n  --help-editor-header-pill-bg: #1f7a49;\n  --help-editor-header-pill-color: #fff;\n  border-color: rgba(58, 143, 91, 0.36);\n  background: #f3fbf6;\n}\n.help-editor-revision-card.is-active.is-open {\n  border-color: rgba(42, 128, 77, 0.46);\n  box-shadow: 0 10px 24px rgba(32, 104, 63, 0.1);\n}\n.help-editor-preview-section-toggle,\n.help-editor-edit-section-head {\n  width: 100%;\n  min-height: 44px;\n  border: 0;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #f1f6ff 100%);\n  color: #1f3d63;\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  padding: 0.58rem 0.76rem;\n  text-align: left;\n}\n.help-editor-preview-section.is-open > .help-editor-preview-section-toggle,\n.help-editor-edit-section.is-open > .help-editor-edit-section-head {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f3ff 0%,\n      #dbeaff 100%);\n}\n.help-editor-edit-section.is-privacy-mandatory > .help-editor-edit-section-head,\n.help-editor-edit-section.is-privacy-mandatory.is-open > .help-editor-edit-section-head,\n.help-editor-preview-section.is-privacy-mandatory > .help-editor-preview-section-toggle,\n.help-editor-preview-section.is-privacy-mandatory.is-open > .help-editor-preview-section-toggle {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e3 0%,\n      #ffe8c5 100%);\n}\n.help-editor-preview-section.is-privacy-mandatory .help-editor-preview-section-toggle {\n  color: #8a4f0e;\n}\n.help-editor-preview-section-toggle {\n  justify-content: space-between;\n  cursor: pointer;\n}\n.help-editor-preview-section-toggle span {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.help-editor-preview-section-toggle strong {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.83rem;\n  font-weight: 800;\n}\n.help-editor-preview-section-toggle .mat-icon {\n  flex: 0 0 auto;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #2c629e;\n}\n.help-editor-edit-section-head {\n  display: flex;\n  box-sizing: border-box;\n  gap: 0.48rem;\n}\n.help-editor-section-icon-menu {\n  flex: 0 0 auto;\n}\n:host ::ng-deep .help-editor-section-icon-menu .app-menu__trigger--layout-icon > .mat-icon:not(.app-menu__trigger-caret) {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n  line-height: 24px;\n}\n.help-editor-privacy-optional-toggle {\n  flex: 0 0 auto;\n  height: 30px;\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n}\n.help-editor-privacy-optional-toggle input {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.help-editor-privacy-optional-toggle > span {\n  min-width: 104px;\n  height: 30px;\n  border: 1px solid rgba(177, 111, 24, 0.34);\n  border-radius: 999px;\n  background: #fff7ea;\n  color: #8a4f0e;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  padding: 0 0.56rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.help-editor-privacy-optional-toggle.is-optional > span {\n  border-color: rgba(47, 101, 170, 0.28);\n  background: #fff;\n  color: #245c9c;\n}\n.help-editor-privacy-optional-toggle .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.help-editor-section-title-input {\n  flex: 0 1 330px;\n  min-width: 0;\n  max-width: min(34vw, 360px);\n  width: auto;\n  min-height: 34px;\n  padding: 0 0.5rem;\n  border-color: rgba(44, 98, 158, 0.16);\n  color: #1f3d63;\n  font-size: 0.83rem;\n  font-weight: 900;\n}\n.help-editor-panel-span-toggle {\n  flex: 0 0 auto;\n  min-width: 0;\n  height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.72);\n  padding: 0.16rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.14rem;\n}\n.help-editor-panel-span-btn {\n  min-width: 42px;\n  height: 24px;\n  border: 0;\n  border-radius: 999px;\n  background: transparent;\n  color: #2c629e;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.18rem;\n  padding: 0 0.34rem;\n  font: inherit;\n  font-size: 0.66rem;\n  font-weight: 950;\n  cursor: pointer;\n}\n.help-editor-panel-span-btn.is-active {\n  background: #e8f3ff;\n  color: #174f8d;\n  box-shadow: inset 0 0 0 1px rgba(44, 98, 158, 0.2);\n}\n.help-editor-panel-span-btn .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.help-editor-section-title-input:focus,\n.help-editor-inline-field input:focus,\n.help-editor-inline-field textarea:focus,\n.help-editor-inline-field select:focus,\n.help-editor-field input:focus,\n.help-editor-draft-title-input:focus,\n.help-editor-html-textarea:focus {\n  outline: 2px solid rgba(47, 101, 170, 0.18);\n  border-color: rgba(47, 101, 170, 0.42);\n}\n.help-editor-mode-toggle {\n  flex: 0 0 auto;\n  margin-left: auto;\n  min-width: 82px;\n  height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.78);\n  color: #245c9c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.26rem;\n  padding: 0 0.52rem;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.help-editor-mode-toggle:hover {\n  border-color: rgba(47, 101, 170, 0.34);\n  background: #fff;\n}\n.help-editor-mode-toggle .mat-icon {\n  flex: 0 0 auto;\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.help-editor-section-caret {\n  color: #2c629e;\n  transition: transform 0.16s ease;\n}\n.is-open > .help-editor-edit-section-head .help-editor-section-caret,\n.is-open > .help-editor-revision-head .help-editor-section-caret,\n.is-open > .help-editor-preview-section-toggle .help-editor-section-caret {\n  transform: rotate(180deg);\n}\n.help-editor-section-edit,\n.help-editor-revision-preview,\n.help-editor-preview-section-body {\n  border-top: 1px solid rgba(47, 86, 139, 0.12);\n  padding: 0.72rem 0.76rem 0.82rem;\n  display: grid;\n  gap: 0.58rem;\n  background: #fff;\n}\n.help-editor-preview-section-body {\n  justify-items: start;\n}\n.help-editor-preview-card {\n  min-height: 0;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.74rem;\n  box-shadow: 0 7px 18px rgba(23, 42, 72, 0.06);\n}\n.help-editor-preview-card.help-editor-preview-section--span-1,\n.help-editor-preview-card.help-editor-preview-section--span-2,\n.help-editor-preview-card.help-editor-preview-section--span-3 {\n  min-height: 0;\n  border-color: rgba(40, 80, 128, 0.14);\n  box-shadow: 0 7px 18px rgba(23, 42, 72, 0.06);\n}\n.help-editor-preview-card.help-editor-preview-section--span-1 {\n  width: min(100%, 330px);\n}\n.help-editor-preview-card.help-editor-preview-section--span-2 {\n  width: min(100%, 690px);\n}\n.help-editor-preview-card.help-editor-preview-section--span-3 {\n  width: 100%;\n}\n.help-editor-popup-preview-title {\n  margin: 0;\n  color: #1d3354;\n  font-size: 0.92rem;\n  font-weight: 950;\n  line-height: 1.16;\n}\n.help-editor-popup-preview-blurb {\n  margin: 0.26rem 0 0;\n  color: rgba(42, 61, 88, 0.78);\n  font-size: 0.78rem;\n  font-weight: 780;\n  line-height: 1.36;\n}\n.help-editor-preview-lead {\n  margin: 0 0 0.45rem;\n  color: rgba(29, 59, 97, 0.86);\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.help-editor-html-preview {\n  color: rgba(25, 48, 77, 0.92);\n  font-size: 0.8rem;\n  line-height: 1.48;\n}\n:host ::ng-deep .help-editor-html-preview :is(p, ul, ol) {\n  margin: 0.42rem 0 0;\n}\n:host ::ng-deep .help-editor-html-preview :is(p, ul, ol):first-child {\n  margin-top: 0;\n}\n:host ::ng-deep .help-editor-html-preview :is(h3, h4) {\n  margin: 0.5rem 0 0;\n  color: #1f3658;\n}\n:host ::ng-deep .help-editor-html-preview ul,\n:host ::ng-deep .help-editor-html-preview ol {\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.2rem;\n}\n:host ::ng-deep .help-editor-html-preview a {\n  color: #245c9c;\n  font-weight: 800;\n}\n:host ::ng-deep .help-editor-html-preview figure {\n  margin: 0.58rem 0 0;\n  display: flex;\n  justify-content: center;\n}\n:host ::ng-deep .help-editor-html-preview img {\n  display: block;\n  width: 100%;\n  height: auto;\n  max-width: 100%;\n  max-height: 280px;\n  object-fit: contain;\n  margin: 0.58rem auto 0;\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 10px;\n  background: #f5f8fc;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);\n}\n:host ::ng-deep .help-editor-html-preview--span-2 img,\n:host ::ng-deep .help-editor-html-preview--span-3 img {\n  width: 100%;\n}\n:host ::ng-deep .help-editor-html-preview--span-2 img {\n  max-height: 300px;\n}\n:host ::ng-deep .help-editor-html-preview--span-3 img {\n  max-height: 340px;\n}\n.help-editor-revision-head {\n  min-height: 58px;\n  display: flex;\n  align-items: stretch;\n  background: var(--help-editor-header-bg);\n  cursor: pointer;\n}\n.help-editor-revision-card.is-open > .help-editor-revision-head {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-draft-card > .help-editor-draft-head,\n.help-editor-draft-card.is-open > .help-editor-draft-head {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-revision-card.is-active > .help-editor-revision-head {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-revision-card.is-active.is-open > .help-editor-revision-head {\n  background: var(--help-editor-header-bg);\n}\n.help-editor-revision-toggle {\n  min-width: 0;\n  flex: 1 1 auto;\n  border: 0;\n  background: transparent;\n  color: #223b60;\n  display: flex;\n  align-items: center;\n  gap: 0.52rem;\n  padding: 0.48rem 0.64rem;\n  text-align: left;\n  cursor: pointer;\n}\n.help-editor-revision-copy {\n  min-width: 0;\n  display: grid;\n  gap: 0.1rem;\n}\n.help-editor-revision-copy strong,\n.help-editor-revision-copy small {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.help-editor-revision-copy strong {\n  color: #1f3658;\n  font-size: 0.86rem;\n  white-space: nowrap;\n}\n.help-editor-revision-copy small {\n  color: rgba(31, 51, 78, 0.62);\n  font-size: 0.72rem;\n  font-weight: 800;\n  line-height: 1.22;\n  overflow: visible;\n  text-overflow: clip;\n}\n.help-editor-version-pill,\n.help-editor-active-badge {\n  flex: 0 0 auto;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 900;\n}\n.help-editor-version-pill {\n  min-width: 42px;\n  height: 28px;\n  border: 1px solid rgba(36, 91, 156, 0.2);\n  background: var(--help-editor-header-pill-bg);\n  color: var(--help-editor-header-pill-color);\n  font-size: 0.74rem;\n  padding: 0 0.54rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);\n}\n.help-editor-draft-version-pill {\n  min-width: 96px;\n  padding: 0 0.72rem;\n  white-space: nowrap;\n}\n.help-editor-active-badge {\n  min-width: 52px;\n  height: 24px;\n  background: #246b42;\n  color: #fff;\n  font-size: 0.68rem;\n  box-shadow: 0 0 0 1px rgba(24, 86, 51, 0.16);\n}\n.help-editor-revision-card.is-active .help-editor-version-pill {\n  border-color: rgba(255, 255, 255, 0.44);\n  background: var(--help-editor-header-pill-bg);\n  color: var(--help-editor-header-pill-color);\n}\n.help-editor-revision-actions {\n  flex: 0 0 auto;\n  padding: 0.5rem 0.56rem 0.5rem 0;\n}\n.help-editor-state-card,\n.help-editor-empty-state,\n.help-editor-error {\n  border: 1px solid rgba(31, 61, 99, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  color: #263f62;\n}\n.help-editor-state-card,\n.help-editor-empty-state {\n  min-height: 220px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.42rem;\n  text-align: center;\n}\n.help-editor-loading-state {\n  min-height: 230px;\n  gap: 0.54rem;\n  color: rgba(31, 58, 90, 0.82);\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.help-editor-empty-state h3 {\n  margin: 0;\n  color: #1f3658;\n  font-size: 0.92rem;\n}\n.help-editor-empty-state p {\n  margin: 0;\n  color: rgba(31, 51, 78, 0.7);\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.help-editor-state-card .mat-icon,\n.help-editor-empty-state > .mat-icon {\n  width: 34px;\n  height: 34px;\n  font-size: 34px;\n  color: rgba(66, 106, 158, 0.52);\n}\n.help-editor-error {\n  min-height: 38px;\n  padding: 0 0.64rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  background: #fff6f7;\n  color: #a43548;\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.help-editor-error .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n@media (max-width: 760px) {\n  .help-editor-draft-actions {\n    grid-template-columns: 1fr;\n    align-items: stretch;\n  }\n  .help-editor-form-actions,\n  .help-editor-add-section-btn,\n  .help-editor-hero-add-section-btn,\n  .help-editor-draft-title-input {\n    width: 100%;\n  }\n  .help-editor-description-row {\n    display: grid;\n  }\n  .help-editor-summary-line,\n  .help-editor-description-line {\n    grid-template-columns: minmax(0, 1fr) 38px;\n    gap: 0.46rem;\n  }\n  .help-editor-summary-edit-panel {\n    padding: 0.7rem 0.58rem 0.72rem;\n  }\n  .help-editor-summary-line .help-editor-icon-btn,\n  .help-editor-description-line .help-editor-hero-add-section-btn {\n    width: 36px;\n    height: 36px;\n    min-width: 36px;\n  }\n  .help-editor-hero-add-section-btn {\n    position: static;\n    justify-self: center;\n  }\n  .help-editor-description-line .help-editor-hero-add-section-btn {\n    margin-bottom: 15px;\n  }\n  .help-editor-form-actions {\n    justify-content: space-between;\n  }\n  .help-editor-revision-head {\n    flex-wrap: wrap;\n  }\n  .help-editor-draft-head {\n    align-items: center;\n  }\n  .help-editor-revision-toggle {\n    flex-basis: 100%;\n  }\n  .help-editor-draft-toggle {\n    display: contents;\n  }\n  .help-editor-draft-toggle .help-editor-draft-version-pill {\n    order: 1;\n    margin: 0.58rem 0 0 0.58rem;\n  }\n  .help-editor-draft-head .help-editor-draft-header-actions {\n    order: 2;\n    margin-left: auto;\n    padding: 0.5rem 0.56rem 0 0;\n  }\n  .help-editor-draft-title-wrap {\n    order: 3;\n    flex: 1 1 100%;\n    width: 100%;\n    padding: 0.48rem 0.58rem 0.62rem;\n  }\n  .help-editor-draft-title-wrap .help-editor-draft-title-input {\n    max-width: none;\n  }\n  .help-editor-revision-actions {\n    margin-left: auto;\n    padding: 0 0.56rem 0.5rem;\n  }\n  .help-editor-edit-section-head {\n    flex-wrap: wrap;\n    align-items: center;\n    gap: 0.48rem;\n  }\n  .help-editor-edit-section-head .help-editor-section-icon-menu {\n    order: 1;\n  }\n  .help-editor-edit-section-head .help-editor-section-title-input {\n    order: 2;\n    flex: 1 1 calc(100% - 78px);\n    max-width: none;\n    width: auto;\n  }\n  .help-editor-edit-section-head .help-editor-caret-btn {\n    order: 3;\n    margin-left: auto;\n  }\n  .help-editor-edit-section-head .help-editor-privacy-optional-toggle {\n    order: 4;\n    margin-left: auto;\n  }\n  .help-editor-edit-section-head .help-editor-mode-toggle {\n    order: 5;\n    margin-left: 0;\n  }\n  .help-editor-edit-section-head .help-editor-danger-btn {\n    order: 6;\n  }\n  .help-editor-mode-toggle {\n    min-width: 34px;\n    padding: 0;\n  }\n  .help-editor-mode-toggle span {\n    display: none;\n  }\n}\n/*# sourceMappingURL=admin-help-editor-popup.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminHelpEditorPopupComponent, { className: "AdminHelpEditorPopupComponent", filePath: "app/admin/components/help-editor-popup/admin-help-editor-popup.component.ts", lineNumber: 175 });
})();
export {
  AdminHelpEditorPopupComponent
};
//# sourceMappingURL=admin-help-editor-popup.component-LFVBDOHY.js.map
