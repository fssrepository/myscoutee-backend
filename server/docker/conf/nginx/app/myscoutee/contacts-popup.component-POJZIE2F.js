import {
  ActivityInvitePopupStore
} from "./chunk-F5B73CZX.js";
import "./chunk-BRGZDNX3.js";
import "./chunk-XA4QEJLP.js";
import "./chunk-7UZYVY3Z.js";
import "./chunk-VBRGMXSL.js";
import "./chunk-2VFJ327H.js";
import "./chunk-4TXXTGDV.js";
import "./chunk-FS6LNZZ4.js";
import "./chunk-NX6X6SL6.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-IMU76WCC.js";
import "./chunk-IRJFXW7R.js";
import {
  ProfileStore
} from "./chunk-EFQHKYZD.js";
import "./chunk-HDRPEKFL.js";
import {
  SmartListComponent
} from "./chunk-JWRKXGRX.js";
import {
  DialogStore
} from "./chunk-LWXWCSPP.js";
import "./chunk-T6NM4FOV.js";
import "./chunk-2FA72P6F.js";
import "./chunk-A6AM4Z6L.js";
import "./chunk-DR3RAUWL.js";
import "./chunk-DDIPOAA4.js";
import "./chunk-MDKC4NXB.js";
import "./chunk-JJACTKXS.js";
import "./chunk-AQO6U4VN.js";
import "./chunk-V477GJDH.js";
import "./chunk-3KSYFEWX.js";
import "./chunk-QM6YAR3P.js";
import "./chunk-4DIW3NKM.js";
import "./chunk-GQZWVH6M.js";
import "./chunk-TGJIGH66.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-FNZUUWCJ.js";
import {
  PopupComponent
} from "./chunk-LN2XQVUC.js";
import "./chunk-E63MLHVM.js";
import "./chunk-T5TB7V7K.js";
import {
  AppMenuComponent,
  AppMenuTriggerComponent,
  DefaultValueAccessor,
  FormsModule,
  MatIcon,
  MatIconModule,
  NgControlStatus,
  NgModel
} from "./chunk-J4QS2YUJ.js";
import {
  ContactsService,
  ExplanationGuideService
} from "./chunk-XCPZRRU5.js";
import "./chunk-LGGVU5AE.js";
import "./chunk-6RAUJLMB.js";
import "./chunk-JQCFZPHN.js";
import {
  AppRuntimeStore,
  UsersService
} from "./chunk-J5KOSTYM.js";
import "./chunk-MC3W6CB7.js";
import "./chunk-FAW3YKWN.js";
import {
  AppUtils
} from "./chunk-QZPIQIRC.js";
import "./chunk-LCSKRGZO.js";
import "./chunk-I52TUHFM.js";
import "./chunk-WWXJW2FL.js";
import "./chunk-NB6L6NLP.js";
import "./chunk-U4O3FETT.js";
import {
  CommonModule,
  NgClass
} from "./chunk-JMCIB2VE.js";
import "./chunk-DP7O5TZ4.js";
import "./chunk-OJADXSXP.js";
import {
  UserProfileStore
} from "./chunk-52XNNRXY.js";
import "./chunk-27OFLLFL.js";
import "./chunk-SXVGSFEZ.js";
import "./chunk-YO3STUCM.js";
import "./chunk-ZBAABSP3.js";
import "./chunk-ON23DQAQ.js";
import {
  Component,
  HostListener,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  from,
  inject,
  setClassMetadata,
  signal,
  tap,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-FMXFYYCS.js";

// src/app/profile/components/contacts-popup/contacts-popup.component.ts
var _c0 = ["contactsSmartList"];
var _c1 = (a0, a1) => [a0, a1];
var _forTrack0 = ($index, $item) => $item.id;
function ContactsPopupComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function ContactsPopupComponent_Conditional_0_Conditional_7_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearSearch($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const contact_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", contact_r5.initials, " ");
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contact_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(contact_r5.headline);
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1, "Quick reach card");
    \u0275\u0275elementEnd();
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_21_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_21_For_2_Template_button_click_0_listener($event) {
      const method_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.runMethod(method_r7, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const method_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r1.methodToneClass(method_r7.type));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(method_r7.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(method_r7.displayValue || method_r7.label);
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_21_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contact_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" +", ctx_r1.hiddenMethodCount(contact_r5), " ");
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275repeaterCreate(1, ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_21_For_2_Template, 5, 3, "button", 24, _forTrack0);
    \u0275\u0275conditionalCreate(3, ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_21_Conditional_3_Template, 2, 1, "span", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contact_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.visibleMethodChips(contact_r5));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hiddenMethodCount(contact_r5) > 0 ? 3 : -1);
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1, "No availability methods yet. Use Edit to add phone, Facebook, email, and more.");
    \u0275\u0275elementEnd();
  }
}
function ContactsPopupComponent_Conditional_0_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 10)(1, "div", 11)(2, "span", 12);
    \u0275\u0275conditionalCreate(3, ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 13)(5, "div", 14)(6, "div", 15)(7, "h3");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_9_Template, 2, 1, "p", 16)(10, ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_10_Template, 2, 0, "p", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 18)(12, "button", 19);
    \u0275\u0275listener("click", function ContactsPopupComponent_Conditional_0_ng_template_10_Template_button_click_12_listener($event) {
      const contact_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.viewContactProfile(contact_r5, $event));
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "visibility");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(15, "app-menu-trigger", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "p", 21)(17, "mat-icon");
    \u0275\u0275text(18, "location_on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(21, ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_21_Template, 4, 1, "div", 22)(22, ContactsPopupComponent_Conditional_0_ng_template_10_Conditional_22_Template, 2, 0, "p", 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const contact_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-menu-open", ctx_r1.isActionMenuOpen(contact_r5));
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-image", contact_r5.avatarUrl ? "url(" + contact_r5.avatarUrl + ")" : null);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(16, _c1, "user-color-" + contact_r5.gender, contact_r5.avatarUrl ? "has-photo" : ""));
    \u0275\u0275advance();
    \u0275\u0275conditional(!contact_r5.avatarUrl ? 3 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(contact_r5.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(contact_r5.headline ? 9 : 10);
    \u0275\u0275advance(6);
    \u0275\u0275property("menuId", ctx_r1.contactActionMenuId(contact_r5))("title", contact_r5.name)("trigger", ctx_r1.contactActionMenuTrigger(contact_r5))("items", ctx_r1.contactActionMenuItems(contact_r5))("panelAlign", "auto")("mobileBreakpointPx", 900);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(contact_r5.city || "City not set yet");
    \u0275\u0275advance();
    \u0275\u0275conditional(contact_r5.methods.length > 0 ? 21 : 22);
  }
}
function ContactsPopupComponent_Conditional_0_Conditional_12_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formErrorMessage());
  }
}
function ContactsPopupComponent_Conditional_0_Conditional_12_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "mat-icon");
    \u0275\u0275text(2, "contact_phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No methods added yet.");
    \u0275\u0275elementEnd()();
  }
}
function ContactsPopupComponent_Conditional_0_Conditional_12_For_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 36)(1, "div", 37)(2, "app-menu", 38);
    \u0275\u0275listener("itemSelect", function ContactsPopupComponent_Conditional_0_Conditional_12_For_28_Template_app_menu_itemSelect_2_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onContactsMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 39);
    \u0275\u0275listener("click", function ContactsPopupComponent_Conditional_0_Conditional_12_For_28_Template_button_click_3_listener($event) {
      const method_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeMethodRow(method_r10.id, $event));
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "delete");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "label", 40)(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 41);
    \u0275\u0275twoWayListener("ngModelChange", function ContactsPopupComponent_Conditional_0_Conditional_12_For_28_Template_input_ngModelChange_9_listener($event) {
      const method_r10 = \u0275\u0275restoreView(_r9).$implicit;
      \u0275\u0275twoWayBindingSet(method_r10.value, $event) || (method_r10.value = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 42);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const method_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("trigger", ctx_r1.methodTypeMenuTrigger(method_r10))("items", ctx_r1.methodTypeMenuItems(method_r10))("mobileBreakpointPx", 900);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.methodOption(method_r10.type).label);
    \u0275\u0275advance();
    \u0275\u0275property("type", ctx_r1.methodOption(method_r10.type).inputType)("inputMode", ctx_r1.methodOption(method_r10.type).inputMode)("autocomplete", ctx_r1.methodOption(method_r10.type).autocomplete)("placeholder", ctx_r1.methodOption(method_r10.type).placeholder);
    \u0275\u0275twoWayProperty("ngModel", method_r10.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.methodOption(method_r10.type).helpText);
  }
}
function ContactsPopupComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 27)(2, "div", 28)(3, "section", 29)(4, "div")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 30)(10, "mat-icon");
    \u0275\u0275text(11, "hub");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "section", 31)(15, "div", 32)(16, "h4");
    \u0275\u0275text(17, "Availability Methods");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p");
    \u0275\u0275text(19, "Add one or more routes like phone, Facebook, email, Telegram, or a custom link.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 33);
    \u0275\u0275listener("click", function ContactsPopupComponent_Conditional_0_Conditional_12_Template_button_click_20_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addMethodRow($event));
    });
    \u0275\u0275elementStart(21, "mat-icon");
    \u0275\u0275text(22, "add_link");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "Add method");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(25, ContactsPopupComponent_Conditional_0_Conditional_12_Conditional_25_Template, 2, 1, "p", 34);
    \u0275\u0275conditionalCreate(26, ContactsPopupComponent_Conditional_0_Conditional_12_Conditional_26_Template, 5, 0, "div", 35);
    \u0275\u0275repeaterCreate(27, ContactsPopupComponent_Conditional_0_Conditional_12_For_28_Template, 12, 10, "article", 36, \u0275\u0275componentInstance().trackMethod, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const contactForm_r11 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.contactFormPopupModel(contactForm_r11))("zIndex", ctx_r1.contactFormPopupZIndex());
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(contactForm_r11.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(contactForm_r11.headline || "Create one-tap ways to reach this member from the contact list.");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(contactForm_r11.methods.length === 1 ? "1 method" : contactForm_r11.methods.length + " methods");
    \u0275\u0275advance(12);
    \u0275\u0275conditional(ctx_r1.formErrorMessage() ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(contactForm_r11.methods.length === 0 ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(contactForm_r11.methods);
  }
}
function ContactsPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 3)(2, "section", 4)(3, "label", 5)(4, "mat-icon");
    \u0275\u0275text(5, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 6);
    \u0275\u0275listener("ngModelChange", function ContactsPopupComponent_Conditional_0_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.searchText.set(($event ?? "").toString()));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, ContactsPopupComponent_Conditional_0_Conditional_7_Template, 3, 0, "button", 7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "app-smart-list", 8, 0);
    \u0275\u0275listener("menuItemSelect", function ContactsPopupComponent_Conditional_0_Template_app_smart_list_menuItemSelect_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onContactsMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, ContactsPopupComponent_Conditional_0_ng_template_10_Template, 23, 19, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, ContactsPopupComponent_Conditional_0_Conditional_12_Template, 29, 7, "app-popup", 2);
  }
  if (rf & 2) {
    let tmp_11_0;
    const contactItemTemplate_r12 = \u0275\u0275reference(11);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.contactsPopupModel())("zIndex", ctx_r1.contactsPopupZIndex());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.searchText());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.searchText() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.contactSmartListConfig())("loadPage", ctx_r1.contactSmartListLoadPage)("itemTemplate", contactItemTemplate_r12)("query", ctx_r1.contactSmartListQuery());
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_11_0 = ctx_r1.editingContact()) ? 12 : -1, tmp_11_0);
  }
}
var CONTACT_METHOD_OPTIONS = [
  {
    value: "phone",
    label: "Phone",
    icon: "call",
    placeholder: "+421 900 123 456",
    helpText: "Opens the phone app on mobile or the default calling handler.",
    inputType: "tel",
    inputMode: "tel",
    autocomplete: "tel",
    actionLabel: "Call",
    openBehavior: "same-tab"
  },
  {
    value: "sms",
    label: "SMS",
    icon: "sms",
    placeholder: "+421 900 123 456",
    helpText: "Starts a text message with the number filled in.",
    inputType: "tel",
    inputMode: "tel",
    autocomplete: "tel",
    actionLabel: "Text",
    openBehavior: "same-tab"
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: "chat",
    placeholder: "+421900123456",
    helpText: "Uses the WhatsApp deep link when available.",
    inputType: "tel",
    inputMode: "tel",
    autocomplete: "tel",
    actionLabel: "Open WhatsApp",
    openBehavior: "new-tab"
  },
  {
    value: "email",
    label: "Email",
    icon: "mail",
    placeholder: "hello@example.com",
    helpText: "Opens the default mail app with the address ready.",
    inputType: "email",
    inputMode: "email",
    autocomplete: "email",
    actionLabel: "Email",
    openBehavior: "same-tab"
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: "thumb_up",
    placeholder: "@username or https://facebook.com/username",
    helpText: "Opens the Facebook profile in the app or a browser tab.",
    inputType: "url",
    inputMode: "url",
    autocomplete: "url",
    actionLabel: "Open Facebook",
    openBehavior: "new-tab"
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: "photo_camera",
    placeholder: "@username or https://instagram.com/username",
    helpText: "Opens the Instagram profile.",
    inputType: "url",
    inputMode: "url",
    autocomplete: "url",
    actionLabel: "Open Instagram",
    openBehavior: "new-tab"
  },
  {
    value: "telegram",
    label: "Telegram",
    icon: "send",
    placeholder: "@username or https://t.me/username",
    helpText: "Opens the Telegram contact.",
    inputType: "url",
    inputMode: "url",
    autocomplete: "url",
    actionLabel: "Open Telegram",
    openBehavior: "new-tab"
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: "work",
    placeholder: "username or https://linkedin.com/in/username",
    helpText: "Opens the LinkedIn profile.",
    inputType: "url",
    inputMode: "url",
    autocomplete: "url",
    actionLabel: "Open LinkedIn",
    openBehavior: "new-tab"
  },
  {
    value: "website",
    label: "Website",
    icon: "language",
    placeholder: "https://example.com",
    helpText: "Opens any profile, portfolio, or custom contact URL.",
    inputType: "url",
    inputMode: "url",
    autocomplete: "url",
    actionLabel: "Open Link",
    openBehavior: "new-tab"
  }
];
var CONTACT_METHOD_OPTION_BY_TYPE = new Map(CONTACT_METHOD_OPTIONS.map((option) => [option.value, option]));
var ContactsPopupComponent = class _ContactsPopupComponent {
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityInviteStore = inject(ActivityInvitePopupStore);
  dialogStore = inject(DialogStore);
  profileStore = inject(ProfileStore);
  usersService = inject(UsersService);
  explanationGuide = inject(ExplanationGuideService);
  contactsDataService = inject(ContactsService);
  contactsPopupOpen = this.profileStore.contactsPopupOpen;
  contactMethodOptions = CONTACT_METHOD_OPTIONS;
  searchText = signal("", ...ngDevMode ? [{ debugName: "searchText" }] : (
    /* istanbul ignore next */
    []
  ));
  editingContact = signal(null, ...ngDevMode ? [{ debugName: "editingContact" }] : (
    /* istanbul ignore next */
    []
  ));
  isFormSavePending = signal(false, ...ngDevMode ? [{ debugName: "isFormSavePending" }] : (
    /* istanbul ignore next */
    []
  ));
  formErrorMessage = signal("", ...ngDevMode ? [{ debugName: "formErrorMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  contactSmartListQuery = computed(() => ({
    filters: {
      search: this.searchText(),
      refreshToken: this.manualRefreshRevision()
    }
  }), ...ngDevMode ? [{ debugName: "contactSmartListQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  manualRefreshRevision = signal(0, ...ngDevMode ? [{ debugName: "manualRefreshRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  contactsRef = signal([], ...ngDevMode ? [{ debugName: "contactsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  revisionRef = signal(0, ...ngDevMode ? [{ debugName: "revisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  lastOptimisticRevisionRef = signal(0, ...ngDevMode ? [{ debugName: "lastOptimisticRevisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  contactCountRef = signal(0, ...ngDevMode ? [{ debugName: "contactCountRef" }] : (
    /* istanbul ignore next */
    []
  ));
  lastKnownTotal = 0;
  hasInitialLoadCompleted = signal(false, ...ngDevMode ? [{ debugName: "hasInitialLoadCompleted" }] : (
    /* istanbul ignore next */
    []
  ));
  contactsExplanationContextKey = null;
  unregisterContactsExplanationContext = null;
  loadedUserId = "";
  contactsLoadedForUserId = "";
  contactsLoadPromise = null;
  contactLoadToken = 0;
  constructor() {
    effect(() => {
      const activeUserId = this.activeUserId();
      if (activeUserId === this.loadedUserId) {
        return;
      }
      this.loadedUserId = activeUserId;
      this.contactsLoadedForUserId = "";
      this.contactsLoadPromise = null;
      this.contactLoadToken += 1;
      this.applyContacts([], false);
    });
    effect(() => {
      this.setContactsExplanationContext(this.profileStore.contactsPopupOpen() ? "contacts" : null);
    });
    effect(() => {
      const revision = this.revisionRef();
      const lastOptimistic = this.lastOptimisticRevisionRef();
      untracked(() => {
        const currentTotal = this.contactCountRef();
        if (revision && revision === lastOptimistic) {
          if (this.contactsSmartList) {
            const additions = Math.max(0, currentTotal - this.lastKnownTotal);
            const loadedCount = this.contactsSmartList.itemsSnapshot().length;
            this.contactsSmartList.replaceVisibleItems(this.contactListItems().slice(0, loadedCount + additions), {
              total: currentTotal
            });
          }
          this.lastKnownTotal = currentTotal;
          return;
        }
        this.lastKnownTotal = currentTotal;
        this.manualRefreshRevision.set(revision);
      });
    });
  }
  ngOnDestroy() {
    this.clearContactsExplanationContext();
  }
  contactsSmartList;
  contactSmartListLoadPage = (query) => from(this.loadContactPage(query)).pipe(tap(() => {
    if (!this.hasInitialLoadCompleted()) {
      this.hasInitialLoadCompleted.set(true);
    }
  }));
  contactSmartListConfig = computed(() => ({
    pageSize: 10,
    defaultView: "list",
    emptyLabel: "No contacts saved yet",
    emptyDescription: "Use Create contact to add members into your personal quick-reach list.",
    emptyStickyLabel: "No contacts",
    headerProgress: {
      enabled: true,
      state: () => this.runtimeStore.isDataSourceAvailable() ? "active" : "inactive"
    },
    showStickyHeader: true,
    stickyHeaderClass: "activities-sticky-header",
    listLayout: "stack",
    snapMode: "mandatory",
    initialScrollAnchor: "first-item",
    scrollPaddingTop: "2.8rem",
    containerClass: {
      "contacts-scroll-list": true
    },
    trackBy: (_index, contact) => contact.id,
    showGroupMarker: ({ groupIndex, scrollable }) => groupIndex > 0 || scrollable,
    groupBy: (contact) => contact.groupLabel,
    onDelete: (contact, event) => this.confirmDelete(contact, event)
  }), ...ngDevMode ? [{ debugName: "contactSmartListConfig" }] : (
    /* istanbul ignore next */
    []
  ));
  contactsPopupModel() {
    return {
      title: "Contacts",
      subtitle: this.summaryLabel(),
      ariaLabel: "Contacts",
      closeAriaLabel: "Close contacts",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerActions: [{
        id: "create-contact",
        icon: "person_add",
        label: "Create contact",
        ariaLabel: "Create contact",
        palette: "sky",
        compactOnMobile: true
      }],
      onClose: (event) => this.closePopup(event),
      onAction: (event) => this.onContactsPopupAction(event)
    };
  }
  contactsPopupZIndex() {
    return 12340;
  }
  contactFormPopupModel(contact) {
    return {
      title: "Edit Contact",
      subtitle: `${contact.name}${contact.city ? " - " + contact.city : ""}`,
      ariaLabel: "Edit Contact",
      closeAriaLabel: "Close contact form",
      headerTone: "accent",
      bodyLayout: "overflow",
      backdropTone: "dim",
      headerActions: [{
        id: "save-contact",
        icon: "done",
        ariaLabel: "Save contact",
        palette: "green",
        disabled: this.isFormSavePending()
      }],
      onClose: (event) => this.closeFormPopup(event),
      onAction: (event) => this.onContactsPopupAction(event)
    };
  }
  contactFormPopupZIndex() {
    return 12420;
  }
  onContactsPopupAction(event) {
    switch (event.action.id) {
      case "create-contact":
        void this.openCreateContactPicker(event.sourceEvent);
        return;
      case "save-contact":
        void this.saveForm(event.sourceEvent);
        return;
      default:
        return;
    }
  }
  onEscape(event) {
    const keyboardEvent = event;
    if (!this.profileStore.contactsPopupOpen() || keyboardEvent.defaultPrevented) {
      return;
    }
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    if (this.contactsSmartList?.menuOpen()) {
      this.contactsSmartList.closeMenu();
      return;
    }
    if (this.editingContact()) {
      this.closeFormPopup();
      return;
    }
    this.closePopup();
  }
  closePopup(event) {
    event?.stopPropagation();
    if (this.isFormSavePending()) {
      return;
    }
    this.closeActionMenu();
    this.searchText.set("");
    this.editingContact.set(null);
    this.formErrorMessage.set("");
    this.profileStore.closeContactsPopup();
  }
  setContactsExplanationContext(contextKey) {
    if (this.contactsExplanationContextKey === contextKey) {
      return;
    }
    this.clearContactsExplanationContext();
    if (!contextKey) {
      return;
    }
    this.contactsExplanationContextKey = contextKey;
    this.unregisterContactsExplanationContext = this.explanationGuide.registerContext(contextKey);
  }
  clearContactsExplanationContext() {
    this.unregisterContactsExplanationContext?.();
    this.unregisterContactsExplanationContext = null;
    this.contactsExplanationContextKey = null;
  }
  async openCreateContactPicker(event) {
    event?.stopPropagation();
    this.closeActionMenu();
    await this.openCreateContactPickerFromMembers();
  }
  isActionMenuOpen(contact) {
    return this.contactsSmartList?.isMenuOpen(this.contactActionMenuId(contact)) ?? false;
  }
  clearSearch(event) {
    event?.stopPropagation();
    this.searchText.set("");
  }
  openEditForm(contact, event) {
    event?.stopPropagation();
    this.closeActionMenu();
    this.formErrorMessage.set("");
    this.editingContact.set(this.createFormValue(contact));
  }
  viewContactProfile(contact, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.closeActionMenu();
    const userId = `${contact.userId ?? ""}`.trim();
    if (!userId) {
      return;
    }
    this.profileStore.openProfileView({
      userId,
      label: contact.name
    });
  }
  closeFormPopup(event) {
    event?.stopPropagation();
    if (this.isFormSavePending()) {
      return;
    }
    this.formErrorMessage.set("");
    this.editingContact.set(null);
  }
  addMethodRow(event) {
    event?.stopPropagation();
    const contact = this.editingContact();
    if (!contact) {
      return;
    }
    this.editingContact.set(__spreadProps(__spreadValues({}, contact), {
      methods: [...contact.methods, this.createEmptyMethodDraft()]
    }));
  }
  removeMethodRow(methodId, event) {
    event?.stopPropagation();
    const contact = this.editingContact();
    if (!contact) {
      return;
    }
    this.editingContact.set(__spreadProps(__spreadValues({}, contact), {
      methods: contact.methods.filter((method) => method.id !== methodId)
    }));
  }
  updateMethodType(methodId, type) {
    const contact = this.editingContact();
    if (!contact) {
      return;
    }
    this.editingContact.set(__spreadProps(__spreadValues({}, contact), {
      methods: contact.methods.map((method) => method.id === methodId ? __spreadProps(__spreadValues({}, method), { type, value: "" }) : method)
    }));
  }
  async saveForm(event) {
    event?.stopPropagation();
    const contact = this.editingContact();
    if (!contact || this.isFormSavePending()) {
      return;
    }
    this.isFormSavePending.set(true);
    this.formErrorMessage.set("");
    try {
      await this.saveContact(contact);
      this.isFormSavePending.set(false);
      this.editingContact.set(null);
    } catch (error) {
      this.isFormSavePending.set(false);
      this.formErrorMessage.set(error instanceof Error && error.message.trim() ? error.message.trim() : "Unable to save this contact right now.");
    }
  }
  confirmDelete(contact, event) {
    event?.stopPropagation();
    this.closeActionMenu();
    this.dialogStore.open({
      title: `Delete ${contact.name}?`,
      message: "This removes the contact and all saved availability methods from your local list.",
      confirmLabel: "Delete",
      busyConfirmLabel: "Deleting...",
      confirmTone: "danger",
      failureMessage: "Unable to delete this contact right now.",
      onConfirm: async () => {
        if (this.contactsSmartList) {
          const current = this.contactsSmartList.itemsSnapshot();
          this.contactsSmartList.replaceVisibleItems(current.filter((i) => i.id !== contact.id), {
            total: Math.max(0, (this.contactsSmartList.totalItemCount() ?? current.length) - 1)
          });
        }
        this.lastKnownTotal = Math.max(0, this.lastKnownTotal - 1);
        await this.deleteContact(contact.id);
      }
    });
  }
  runMethod(method, event) {
    event?.stopPropagation();
    this.closeActionMenu();
    this.triggerMethod(method);
  }
  methodOption(type) {
    return this.lookupMethodOption(type);
  }
  methodToneClass(type) {
    return `contact-method-tone-${type}`;
  }
  trackMethod(_index, method) {
    return `${method.id}:${method.type}`;
  }
  contactActionMenuId(contact) {
    return `contact-action-${contact.id}`;
  }
  contactActionMenuTrigger(contact) {
    return {
      icon: "more_vert",
      closeIcon: "close",
      hideLabel: true,
      layout: "icon",
      palette: "neutral",
      ariaLabel: this.isActionMenuOpen(contact) ? "Close contact actions" : "Open contact actions"
    };
  }
  contactActionMenuItems(contact) {
    const methodItems = contact.methods.map((method) => ({
      id: `contact-${contact.id}-method-${method.id}`,
      label: method.menuLabel,
      icon: method.icon,
      palette: this.methodMenuPalette(method.type),
      surface: "tinted",
      context: {
        menu: "contact-action",
        action: "run-method",
        contactId: contact.id,
        methodId: method.id
      }
    }));
    return [
      ...methodItems,
      ...methodItems.length > 0 ? [{ id: `contact-${contact.id}-methods-divider`, kind: "divider" }] : [],
      {
        id: `contact-${contact.id}-edit`,
        label: "Edit",
        icon: "edit",
        context: { menu: "contact-action", action: "edit", contactId: contact.id }
      },
      {
        id: `contact-${contact.id}-delete`,
        label: "Delete",
        icon: "delete",
        palette: "danger",
        context: { menu: "contact-action", action: "delete", contactId: contact.id }
      }
    ];
  }
  methodTypeMenuTrigger(method) {
    const option = this.methodOption(method.type);
    return {
      label: option.label,
      icon: option.icon,
      palette: this.methodMenuPalette(method.type),
      layout: "field",
      disabled: () => this.isFormSavePending(),
      ariaLabel: "Open contact method type"
    };
  }
  methodTypeMenuItems(method) {
    return this.contactMethodOptions.map((option) => ({
      id: `method-${method.id}-type-${option.value}`,
      label: option.label,
      icon: option.icon,
      kind: "radio",
      active: method.type === option.value,
      palette: this.methodMenuPalette(option.value),
      surface: "tinted",
      context: { menu: "method-type", methodId: method.id, type: option.value }
    }));
  }
  onContactsMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    if (context.menu === "method-type") {
      this.updateMethodType(context.methodId, context.type);
      return;
    }
    const contact = this.contactListItems().find((item) => item.id === context.contactId);
    if (!contact) {
      return;
    }
    if (context.action === "run-method") {
      const method = contact.methods.find((item) => item.id === context.methodId);
      if (method) {
        this.runMethod(method, event.sourceEvent);
      }
      return;
    }
    if (context.action === "edit") {
      this.openEditForm(contact, event.sourceEvent);
      return;
    }
    this.confirmDelete(contact, event.sourceEvent);
  }
  visibleMethodChips(contact) {
    return contact.methods.slice(0, 4);
  }
  hiddenMethodCount(contact) {
    return Math.max(0, contact.methods.length - 4);
  }
  summaryLabel() {
    const count = this.contactCountRef();
    return count === 1 ? "1 saved contact" : `${count} saved contacts`;
  }
  async openCreateContactPickerFromMembers() {
    const activeUserId = this.activeUserId();
    if (!activeUserId) {
      return;
    }
    this.activityInviteStore.openActivityInvitePopup({
      ownerId: activeUserId,
      ownerType: "asset",
      title: "Create contact",
      onApply: async (selectedCandidates) => {
        await this.addContacts(selectedCandidates);
      }
    });
  }
  async loadContactPage(query) {
    await this.ensureContactsLoadedForActiveUser();
    const search = AppUtils.normalizeText(query.filters?.search ?? "");
    const contacts = this.contactListItems().filter((contact) => !search || contact.searchText.includes(search)).sort((left, right) => this.compareContacts(left, right));
    const pageSize = Math.max(1, Number(query.pageSize) || 24);
    const startIndex = Math.max(0, Number(query.page) || 0) * pageSize;
    return {
      items: contacts.slice(startIndex, startIndex + pageSize),
      total: contacts.length
    };
  }
  contactListItems() {
    return this.contactsRef().map((contact) => this.toListItem(contact));
  }
  createFormValue(contact) {
    return {
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      initials: contact.initials,
      gender: contact.gender,
      city: contact.city,
      avatarUrl: contact.avatarUrl,
      headline: contact.headline,
      methods: contact.methods.map((method) => ({
        id: method.id,
        type: method.type,
        value: method.value
      }))
    };
  }
  createEmptyMethodDraft(type = "phone") {
    return {
      id: this.randomId("method"),
      type,
      value: ""
    };
  }
  async saveContact(form) {
    const activeUserId = this.activeUserId();
    if (!activeUserId) {
      return;
    }
    await this.ensureContactsLoadedForActiveUser();
    const normalizedContactId = form.id.trim();
    const existing = this.contactsRef().find((contact) => contact.id === normalizedContactId);
    const user = this.usersService.peekCachedUserById(form.userId) ?? null;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const nextContact = this.normalizeStoredContact({
      id: normalizedContactId || form.userId.trim() || this.randomId("contact"),
      userId: form.userId.trim(),
      name: user?.name ?? form.name,
      initials: user?.initials ?? form.initials,
      gender: user?.gender ?? form.gender,
      city: user?.city ?? form.city,
      avatarUrl: this.resolveUserAvatarUrl(user) || form.avatarUrl,
      headline: user?.headline ?? form.headline,
      createdAtIso: existing?.createdAtIso ?? nowIso,
      updatedAtIso: nowIso,
      methods: form.methods
    });
    const nextContacts = this.contactsRef().filter((contact) => contact.id !== nextContact.id).concat(nextContact);
    const savedContacts = await this.contactsDataService.saveContacts(activeUserId, this.normalizeContacts(nextContacts));
    this.contactsLoadedForUserId = activeUserId;
    this.applyContacts(savedContacts, true);
  }
  async deleteContact(contactId) {
    const activeUserId = this.activeUserId();
    const normalizedContactId = contactId.trim();
    if (!activeUserId || !normalizedContactId) {
      return;
    }
    await this.ensureContactsLoadedForActiveUser();
    const savedContacts = await this.contactsDataService.deleteContact(activeUserId, normalizedContactId);
    this.contactsLoadedForUserId = activeUserId;
    this.applyContacts(savedContacts, true);
  }
  triggerMethod(method) {
    const href = method.href.trim();
    if (!href || typeof window === "undefined") {
      return;
    }
    if (method.openBehavior === "new-tab") {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = href;
  }
  lookupMethodOption(type) {
    return CONTACT_METHOD_OPTION_BY_TYPE.get(type) ?? CONTACT_METHOD_OPTIONS[0];
  }
  methodMenuPalette(type) {
    switch (type) {
      case "sms":
        return "violet";
      case "whatsapp":
        return "green";
      case "email":
        return "orange";
      case "facebook":
        return "blue";
      case "instagram":
        return "pink";
      case "telegram":
        return "sky";
      case "linkedin":
        return "cyan";
      case "website":
        return "slate";
      case "phone":
      default:
        return "blue";
    }
  }
  async addContacts(selectedCandidates) {
    const activeUserId = this.activeUserId();
    if (!activeUserId || selectedCandidates.length === 0) {
      return;
    }
    await this.ensureContactsLoadedForActiveUser();
    const nextById = new Map(this.contactsRef().map((contact) => [contact.id, contact]));
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    for (const candidate of selectedCandidates) {
      const normalizedUserId = candidate.userId.trim();
      if (!normalizedUserId) {
        continue;
      }
      const existing = nextById.get(normalizedUserId);
      const user = this.usersService.peekCachedUserById(normalizedUserId);
      nextById.set(normalizedUserId, this.normalizeStoredContact({
        id: normalizedUserId,
        userId: normalizedUserId,
        name: user?.name ?? candidate.name,
        initials: user?.initials ?? candidate.initials,
        gender: user?.gender ?? candidate.gender,
        city: user?.city ?? candidate.city,
        avatarUrl: this.resolveUserAvatarUrl(user) || candidate.avatarUrl,
        headline: user?.headline ?? user?.statusText ?? existing?.headline ?? "",
        createdAtIso: existing?.createdAtIso ?? nowIso,
        updatedAtIso: nowIso,
        methods: existing?.methods ?? []
      }));
    }
    const savedContacts = await this.contactsDataService.saveContacts(activeUserId, this.normalizeContacts([...nextById.values()]));
    this.contactsLoadedForUserId = activeUserId;
    this.applyContacts(savedContacts, true);
  }
  toListItem(contact) {
    const user = this.usersService.peekCachedUserById(contact.userId);
    const name = `${user?.name ?? contact.name}`.trim() || "Contact";
    const initials = `${user?.initials ?? contact.initials}`.trim() || AppUtils.initialsFromText(name);
    const city = `${user?.city ?? contact.city}`.trim();
    const headline = `${user?.headline ?? contact.headline ?? user?.statusText ?? ""}`.trim();
    const avatarUrl = this.resolveUserAvatarUrl(user) || contact.avatarUrl;
    const methods = contact.methods.map((method) => this.toMethodItem(method)).filter((method) => Boolean(method.href));
    const methodCount = methods.length;
    const searchText = AppUtils.normalizeText([
      name,
      city,
      headline,
      ...methods.map((method) => method.displayValue),
      ...methods.map((method) => method.label)
    ].filter(Boolean).join(" "));
    return {
      id: contact.id,
      userId: contact.userId,
      name,
      initials,
      gender: user?.gender ?? contact.gender,
      city,
      avatarUrl,
      headline,
      groupLabel: this.groupLabel(name),
      methodCount,
      methodCountLabel: methodCount === 1 ? "1 route" : `${methodCount} routes`,
      methods,
      updatedAtIso: contact.updatedAtIso,
      searchText
    };
  }
  toMethodItem(method) {
    const option = this.lookupMethodOption(method.type);
    const value = method.value.trim();
    const href = this.resolveMethodHref(method.type, value);
    const displayValue = this.resolveMethodDisplayValue(method.type, value);
    return __spreadProps(__spreadValues({}, method), {
      label: option.label,
      icon: option.icon,
      displayValue,
      menuLabel: displayValue || option.label,
      href,
      openBehavior: option.openBehavior
    });
  }
  resolveMethodHref(type, value) {
    if (!value) {
      return "";
    }
    if (type === "phone") {
      const phone = this.normalizePhoneUriValue(value);
      return phone ? `tel:${phone}` : "";
    }
    if (type === "sms") {
      const phone = this.normalizePhoneUriValue(value);
      return phone ? `sms:${phone}` : "";
    }
    if (type === "whatsapp") {
      if (this.isAbsoluteUrl(value)) {
        return value;
      }
      const digits = this.normalizePhoneDigits(value);
      return digits ? `https://wa.me/${digits}` : "";
    }
    if (type === "email") {
      const email = value.replace(/^mailto:/i, "").trim();
      return email ? `mailto:${email}` : "";
    }
    if (type === "facebook") {
      return this.socialHref(value, "facebook.com/");
    }
    if (type === "instagram") {
      return this.socialHref(value, "instagram.com/");
    }
    if (type === "telegram") {
      return this.socialHref(value, "t.me/");
    }
    if (type === "linkedin") {
      return this.socialHref(value, "linkedin.com/in/");
    }
    return this.websiteHref(value);
  }
  resolveMethodDisplayValue(type, value) {
    if (!value) {
      return "";
    }
    if (type === "phone" || type === "sms" || type === "whatsapp") {
      return value;
    }
    if (type === "email") {
      return value.replace(/^mailto:/i, "").trim();
    }
    if (type === "website") {
      return value.replace(/^https?:\/\//i, "").trim();
    }
    const cleaned = value.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/^[^/]+\//, "").replace(/^@/, "").trim();
    return cleaned ? `@${cleaned}` : value;
  }
  socialHref(value, domainPath) {
    if (this.isAbsoluteUrl(value)) {
      return value;
    }
    const cleaned = value.replace(/^@/, "").replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/^[^/]+\//, "").trim();
    return cleaned ? `https://${domainPath}${cleaned}` : "";
  }
  websiteHref(value) {
    if (!value) {
      return "";
    }
    if (this.isAbsoluteUrl(value)) {
      return value;
    }
    return `https://${value.trim()}`;
  }
  isAbsoluteUrl(value) {
    return /^https?:\/\//i.test(value.trim());
  }
  normalizePhoneUriValue(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    const hasPlusPrefix = trimmed.startsWith("+");
    const digits = trimmed.replace(/[^\d]/g, "");
    if (!digits) {
      return "";
    }
    return `${hasPlusPrefix ? "+" : ""}${digits}`;
  }
  normalizePhoneDigits(value) {
    return value.replace(/[^\d]/g, "").trim();
  }
  normalizeStoredContact(contact) {
    const name = `${contact.name ?? ""}`.trim() || "Contact";
    const userId = `${contact.userId ?? ""}`.trim();
    const id = `${contact.id ?? ""}`.trim() || userId || this.randomId("contact");
    const gender = contact.gender === "woman" ? "woman" : "man";
    const methods = (contact.methods ?? []).map((method) => this.normalizeMethodDraft(method)).filter((method) => Boolean(method && method.value));
    return {
      id,
      userId,
      name,
      initials: `${contact.initials ?? ""}`.trim() || AppUtils.initialsFromText(name),
      gender,
      city: `${contact.city ?? ""}`.trim(),
      avatarUrl: `${contact.avatarUrl ?? ""}`.trim(),
      headline: `${contact.headline ?? ""}`.trim(),
      createdAtIso: `${contact.createdAtIso ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAtIso: `${contact.updatedAtIso ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      methods
    };
  }
  normalizeMethodDraft(method) {
    if (!method) {
      return null;
    }
    const type = CONTACT_METHOD_OPTION_BY_TYPE.has(method.type) ? method.type : "phone";
    const value = `${method.value ?? ""}`.trim();
    if (!value) {
      return null;
    }
    return {
      id: `${method.id ?? ""}`.trim() || this.randomId("method"),
      type,
      value
    };
  }
  normalizeContacts(contacts) {
    return contacts.map((contact) => this.normalizeStoredContact(contact)).filter((contact) => contact.userId || contact.id).sort((left, right) => this.compareContacts(this.toListItem(left), this.toListItem(right)));
  }
  applyContacts(contacts, optimistic) {
    const normalizedContacts = contacts.map((contact) => this.normalizeStoredContact(contact)).filter((contact) => contact.userId || contact.id).sort((left, right) => this.compareContacts(this.toListItem(left), this.toListItem(right)));
    this.contactsRef.set(normalizedContacts);
    this.contactCountRef.set(normalizedContacts.length);
    this.bumpRevision(optimistic);
  }
  async ensureContactsLoadedForActiveUser() {
    const activeUserId = this.activeUserId();
    if (!activeUserId) {
      return;
    }
    if (this.contactsLoadedForUserId === activeUserId) {
      return;
    }
    if (this.contactsLoadPromise) {
      await this.contactsLoadPromise;
      return;
    }
    const loadPromise = this.loadContactsForActiveUser(activeUserId);
    this.contactsLoadPromise = loadPromise;
    try {
      await loadPromise;
    } finally {
      if (this.contactsLoadPromise === loadPromise) {
        this.contactsLoadPromise = null;
      }
    }
  }
  async loadContactsForActiveUser(activeUserId) {
    const token = ++this.contactLoadToken;
    const contacts = await this.contactsDataService.loadContacts(activeUserId);
    if (token !== this.contactLoadToken || activeUserId !== this.loadedUserId) {
      return;
    }
    this.contactsLoadedForUserId = activeUserId;
    this.applyContacts(contacts, false);
  }
  compareContacts(left, right) {
    const nameCompare = left.name.localeCompare(right.name, void 0, { sensitivity: "base" });
    if (nameCompare !== 0) {
      return nameCompare;
    }
    const cityCompare = left.city.localeCompare(right.city, void 0, { sensitivity: "base" });
    if (cityCompare !== 0) {
      return cityCompare;
    }
    return right.updatedAtIso.localeCompare(left.updatedAtIso);
  }
  groupLabel(name) {
    const firstLetter = AppUtils.normalizeText(name).charAt(0).toUpperCase();
    return /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";
  }
  resolveUserAvatarUrl(user) {
    return AppUtils.firstImageUrl(user?.images);
  }
  activeUserId() {
    return this.userProfileStore.activeUserId().trim();
  }
  randomId(prefix) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
  bumpRevision(optimistic = false) {
    this.revisionRef.update((value) => value + 1);
    if (optimistic) {
      this.lastOptimisticRevisionRef.set(this.revisionRef());
    }
  }
  closeActionMenu() {
    this.contactsSmartList?.closeMenu();
  }
  static \u0275fac = function ContactsPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactsPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactsPopupComponent, selectors: [["app-contacts-popup"]], viewQuery: function ContactsPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contactsSmartList = _t.first);
    }
  }, hostBindings: function ContactsPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function ContactsPopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscape($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [["contactsSmartList", ""], ["contactItemTemplate", ""], [3, "model", "zIndex"], [1, "contacts-popup-content"], [1, "contacts-toolbar"], [1, "contacts-search-field"], ["type", "text", "placeholder", "Filter contacts A-Z", "aria-label", "Filter contacts", 3, "ngModelChange", "ngModel"], ["type", "button", "aria-label", "Clear contact filter", 1, "contacts-search-clear"], [1, "contacts-smart-list", 3, "menuItemSelect", "config", "loadPage", "itemTemplate", "query"], ["type", "button", "aria-label", "Clear contact filter", 1, "contacts-search-clear", 3, "click"], [1, "contact-card"], [1, "contact-avatar-shell"], [1, "contact-avatar", 3, "ngClass"], [1, "contact-copy"], [1, "contact-title-row"], [1, "contact-title-wrap"], [1, "contact-headline"], [1, "contact-headline", "contact-headline-muted"], [1, "contact-menu-anchor"], ["type", "button", "aria-label", "View profile", 1, "experience-action-btn", "contact-profile-trigger", 3, "click"], ["kind", "select", 1, "contact-action-menu-trigger", 3, "menuId", "title", "trigger", "items", "panelAlign", "mobileBreakpointPx"], [1, "contact-city"], [1, "contact-method-chips"], [1, "contact-empty-methods"], ["type", "button", 1, "contact-method-chip", 3, "ngClass"], [1, "contact-method-chip", "contact-method-chip-more"], ["type", "button", 1, "contact-method-chip", 3, "click", "ngClass"], [1, "contact-form-popup", "contacts-form-content"], [1, "experience-form-panel", "contact-form-panel"], [1, "contact-form-summary"], [1, "contact-form-summary-pill"], [1, "contact-form-actions"], [1, "contact-form-section-title"], ["type", "button", "aria-label", "Add availability method", 1, "popup-view-fab", 3, "click"], [1, "contact-form-error"], [1, "contact-form-empty"], [1, "contact-method-row"], [1, "contact-method-row-head"], ["kind", "select", 1, "contact-method-type-menu", 3, "itemSelect", "trigger", "items", "mobileBreakpointPx"], ["type", "button", "aria-label", "Remove method", 1, "experience-action-btn", "contact-method-remove-btn", 3, "click"], [1, "contact-method-field"], [3, "ngModelChange", "type", "inputMode", "autocomplete", "placeholder", "ngModel"], [1, "contact-method-help"]], template: function ContactsPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ContactsPopupComponent_Conditional_0_Template, 13, 9);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.contactsPopupOpen() ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    AppMenuTriggerComponent,
    PopupComponent,
    SmartListComponent
  ], styles: ['\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.contacts-popup-content[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 0;\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.8rem;\n  overflow: hidden;\n}\n.contacts-smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.contacts-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  flex-wrap: wrap;\n  gap: 0.7rem;\n  align-items: center;\n}\n.contacts-search-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  flex: 1 1 auto;\n  min-height: 44px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  border: 1px solid rgba(39, 67, 104, 0.14);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.94);\n  padding: 0.16rem 0.18rem 0.16rem 0.7rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 6px 18px rgba(21, 39, 66, 0.06);\n  box-sizing: border-box;\n}\n.contacts-search-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.contact-city[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.contact-method-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.contact-form-summary-pill[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.contact-form-empty[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.contacts-search-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  border: 0;\n  outline: 0;\n  background: transparent;\n  color: #233a5c;\n  font-size: 0.87rem;\n  font-weight: 600;\n}\n.contacts-search-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: rgba(35, 58, 92, 0.48);\n}\n.contacts-search-clear[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: rgba(220, 231, 245, 0.86);\n  color: #2a4a74;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.contacts-scroll-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.7rem;\n  padding-bottom: 1rem;\n}\n.contact-card[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  gap: 0.82rem;\n  align-items: start;\n  padding: 0.92rem 0.98rem;\n  border: 1px solid rgba(43, 69, 105, 0.16);\n  border-radius: 22px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.98),\n      rgba(245, 249, 255, 0.98)),\n    radial-gradient(\n      circle at top right,\n      rgba(112, 180, 255, 0.12),\n      transparent 42%);\n  box-shadow: 0 14px 28px rgba(16, 33, 58, 0.08);\n}\n.contact-card.is-menu-open[_ngcontent-%COMP%] {\n  z-index: 100;\n}\n.contact-avatar-shell[_ngcontent-%COMP%] {\n  padding-top: 0.1rem;\n}\n.contact-avatar[_ngcontent-%COMP%], \n.contact-form-avatar[_ngcontent-%COMP%] {\n  width: 54px;\n  height: 54px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 0.98rem;\n  font-weight: 800;\n  letter-spacing: 0.03em;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  box-shadow: 0 10px 24px rgba(14, 31, 54, 0.18);\n}\n.contact-avatar.has-photo[_ngcontent-%COMP%], \n.contact-form-avatar.has-photo[_ngcontent-%COMP%] {\n  color: transparent;\n  font-size: 0;\n}\n.contact-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.42rem;\n}\n.contact-title-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.contact-title-wrap[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.contact-title-wrap[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.contact-form-section-title[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #203a5e;\n}\n.contact-title-wrap[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  line-height: 1.2;\n}\n.contact-headline[_ngcontent-%COMP%], \n.contact-empty-methods[_ngcontent-%COMP%], \n.contact-form-section-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.contact-form-summary[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.contact-method-help[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(28, 51, 82, 0.72);\n  line-height: 1.42;\n}\n.contact-headline[_ngcontent-%COMP%] {\n  margin-top: 0.16rem;\n  font-size: 0.82rem;\n}\n.contact-headline-muted[_ngcontent-%COMP%] {\n  color: rgba(40, 62, 92, 0.54);\n}\n.contact-city[_ngcontent-%COMP%] {\n  margin: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  color: rgba(31, 56, 88, 0.78);\n  font-size: 0.79rem;\n  font-weight: 700;\n}\n.contact-method-chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.42rem;\n}\n.contact-method-chip[_ngcontent-%COMP%] {\n  appearance: none;\n  border: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  min-height: 28px;\n  padding: 0.16rem 0.58rem;\n  border-radius: 999px;\n  background: rgba(227, 236, 248, 0.74);\n  color: #264a74;\n  font-size: 0.74rem;\n  font-weight: 800;\n  cursor: pointer;\n}\n.contact-method-chip-more[_ngcontent-%COMP%] {\n  background: rgba(35, 66, 102, 0.1);\n  color: rgba(32, 58, 92, 0.76);\n  cursor: default;\n}\n.contact-empty-methods[_ngcontent-%COMP%] {\n  font-size: 0.79rem;\n}\n.contact-menu-anchor[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.experience-action-btn.contact-profile-trigger[_ngcontent-%COMP%] {\n  appearance: none;\n  box-sizing: border-box;\n  flex: 0 0 36px;\n  width: 36px;\n  min-width: 36px;\n  height: 36px;\n  min-height: 36px;\n  padding: 0;\n  border-radius: 50%;\n  overflow: hidden;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.experience-action-btn.contact-profile-trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  pointer-events: none;\n}\n.experience-action-btn.contact-profile-trigger[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 99, 143, 0.24);\n  background: rgba(232, 246, 251, 0.92);\n  color: #226d83;\n}\n.contact-action-menu-trigger[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n.contact-method-chip.contact-method-tone-phone[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(233, 243, 255, 0.98),\n      rgba(219, 234, 252, 0.95));\n  color: #22507f;\n}\n.contact-method-chip.contact-method-tone-sms[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 237, 255, 0.98),\n      rgba(228, 224, 252, 0.95));\n  color: #53409c;\n}\n.contact-method-chip.contact-method-tone-whatsapp[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(233, 250, 239, 0.98),\n      rgba(214, 245, 225, 0.95));\n  color: #1d7a46;\n}\n.contact-method-chip.contact-method-tone-email[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 244, 232, 0.98),\n      rgba(252, 234, 214, 0.95));\n  color: #9a5a1f;\n}\n.contact-method-chip.contact-method-tone-facebook[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(232, 240, 255, 0.98),\n      rgba(216, 229, 252, 0.95));\n  color: #2457a4;\n}\n.contact-method-chip.contact-method-tone-instagram[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 238, 246, 0.98),\n      rgba(252, 222, 236, 0.95));\n  color: #a33d6f;\n}\n.contact-method-chip.contact-method-tone-telegram[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(232, 249, 255, 0.98),\n      rgba(214, 241, 252, 0.95));\n  color: #1f6f90;\n}\n.contact-method-chip.contact-method-tone-linkedin[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(234, 243, 255, 0.98),\n      rgba(219, 232, 252, 0.95));\n  color: #1f5b88;\n}\n.contact-method-chip.contact-method-tone-website[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 244, 250, 0.98),\n      rgba(227, 235, 245, 0.95));\n  color: #46617c;\n}\n.contact-form-popup[_ngcontent-%COMP%], \n.contacts-form-content[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.contact-form-panel[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  align-items: start;\n  gap: 0.82rem;\n  padding: 0.74rem;\n  box-sizing: border-box;\n  overflow: visible;\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background: #f8fbff;\n}\n.contact-form-summary[_ngcontent-%COMP%], \n.contact-form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.8rem;\n  align-items: start;\n}\n.contact-form-summary[_ngcontent-%COMP%] {\n  padding: 0.82rem 0.9rem;\n  border-radius: 18px;\n  border: 1px solid rgba(48, 84, 129, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.95),\n      rgba(241, 247, 255, 0.96));\n}\n.contact-form-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #203a5e;\n  font-size: 0.96rem;\n}\n.contact-form-summary-pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  min-height: 30px;\n  padding: 0 0.72rem;\n  border-radius: 999px;\n  background: rgba(220, 236, 255, 0.88);\n  color: #295784;\n  font-size: 0.76rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.contact-form-section-title[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.contact-form-error[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.72rem 0.82rem;\n  border-radius: 14px;\n  border: 1px solid rgba(181, 43, 43, 0.18);\n  background: rgba(255, 238, 238, 0.92);\n  color: #9f2f2f;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.contact-form-empty[_ngcontent-%COMP%] {\n  min-height: 144px;\n  display: grid;\n  place-items: center;\n  gap: 0.32rem;\n  text-align: center;\n  border: 1px dashed rgba(85, 112, 150, 0.28);\n  border-radius: 18px;\n  background: rgba(249, 252, 255, 0.9);\n  color: rgba(34, 58, 90, 0.68);\n}\n.contact-method-row[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.62rem;\n  padding: 0.84rem 0.88rem;\n  border-radius: 18px;\n  border: 1px solid rgba(52, 83, 123, 0.16);\n  background: rgba(255, 255, 255, 0.92);\n}\n.contact-method-row-head[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.7rem;\n  align-items: center;\n}\n.contact-method-type-menu[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.contact-method-remove-btn[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: rgba(255, 236, 236, 0.96);\n  color: #a03a3a;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.contact-method-field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.38rem;\n}\n.contact-method-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #29486f;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.contact-method-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(43, 73, 110, 0.16);\n  border-radius: 14px;\n  background: #fbfdff;\n  color: #203a5e;\n  padding: 0.76rem 0.86rem;\n  font-size: 0.86rem;\n  font-weight: 600;\n  box-sizing: border-box;\n}\n.contact-method-help[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n}\n@media (hover: hover) and (pointer: fine) {\n  .contacts-search-clear[_ngcontent-%COMP%]:hover, \n   .contact-profile-trigger[_ngcontent-%COMP%]:hover, \n   .contact-method-remove-btn[_ngcontent-%COMP%]:hover, \n   .contact-method-chip[_ngcontent-%COMP%]:hover {\n    filter: brightness(0.98);\n    transform: translateY(-1px);\n  }\n}\n@media (max-width: 760px) {\n  .contact-card[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .contacts-toolbar[_ngcontent-%COMP%], \n   .contact-form-summary[_ngcontent-%COMP%], \n   .contact-form-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .contacts-search-field[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    flex: 0 0 auto;\n  }\n  .contact-form-panel[_ngcontent-%COMP%] {\n    padding-bottom: calc(0.9rem + env(safe-area-inset-bottom));\n  }\n  .contact-form-summary-pill[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=contacts-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactsPopupComponent, [{
    type: Component,
    args: [{ selector: "app-contacts-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      AppMenuComponent,
      AppMenuTriggerComponent,
      PopupComponent,
      SmartListComponent
    ], template: `@if (contactsPopupOpen()) {
  <app-popup [model]="contactsPopupModel()" [zIndex]="contactsPopupZIndex()">
    <div class="contacts-popup-content">
      <section class="contacts-toolbar">
        <label class="contacts-search-field">
          <mat-icon>search</mat-icon>
          <input
            type="text"
            [ngModel]="searchText()"
            (ngModelChange)="searchText.set(($event ?? '').toString())"
            placeholder="Filter contacts A-Z"
            aria-label="Filter contacts"
            />
          @if (searchText()) {
            <button type="button" class="contacts-search-clear" (click)="clearSearch($event)" aria-label="Clear contact filter">
              <mat-icon>close</mat-icon>
            </button>
          }
        </label>
      </section>

      <app-smart-list
        #contactsSmartList
        class="contacts-smart-list"
        [config]="contactSmartListConfig()"
        [loadPage]="contactSmartListLoadPage"
        [itemTemplate]="contactItemTemplate"
        [query]="contactSmartListQuery()"
        (menuItemSelect)="onContactsMenuSelect($event)"
      ></app-smart-list>

      <ng-template #contactItemTemplate let-contact>
        <article class="contact-card" [class.is-menu-open]="isActionMenuOpen(contact)">
          <div class="contact-avatar-shell">
            <span
              class="contact-avatar"
              [ngClass]="['user-color-' + contact.gender, contact.avatarUrl ? 'has-photo' : '']"
              [style.backgroundImage]="contact.avatarUrl ? 'url(' + contact.avatarUrl + ')' : null"
              >
              @if (!contact.avatarUrl) {
                {{ contact.initials }}
              }
            </span>
          </div>

          <div class="contact-copy">
            <div class="contact-title-row">
              <div class="contact-title-wrap">
                <h3>{{ contact.name }}</h3>
                @if (contact.headline) {
                  <p class="contact-headline">{{ contact.headline }}</p>
                } @else {
                  <p class="contact-headline contact-headline-muted">Quick reach card</p>
                }
              </div>
              <div class="contact-menu-anchor">
                <button
                  type="button"
                  class="experience-action-btn contact-profile-trigger"
                  aria-label="View profile"
                  (click)="viewContactProfile(contact, $event)"
                  >
                  <mat-icon>visibility</mat-icon>
                </button>
                <app-menu-trigger
                  class="contact-action-menu-trigger"
                  [menuId]="contactActionMenuId(contact)"
                  kind="select"
                  [title]="contact.name"
                  [trigger]="contactActionMenuTrigger(contact)"
                  [items]="contactActionMenuItems(contact)"
                  [panelAlign]="'auto'"
                  [mobileBreakpointPx]="900"
                ></app-menu-trigger>
              </div>
            </div>

            <p class="contact-city">
              <mat-icon>location_on</mat-icon>
              <span>{{ contact.city || 'City not set yet' }}</span>
            </p>

            @if (contact.methods.length > 0) {
              <div class="contact-method-chips">
                @for (method of visibleMethodChips(contact); track method.id) {
                  <button type="button" class="contact-method-chip" [ngClass]="methodToneClass(method.type)" (click)="runMethod(method, $event)">
                    <mat-icon>{{ method.icon }}</mat-icon>
                    <span>{{ method.displayValue || method.label }}</span>
                  </button>
                }
                @if (hiddenMethodCount(contact) > 0) {
                  <span class="contact-method-chip contact-method-chip-more">
                    +{{ hiddenMethodCount(contact) }}
                  </span>
                }
              </div>
            } @else {
              <p class="contact-empty-methods">No availability methods yet. Use Edit to add phone, Facebook, email, and more.</p>
            }
          </div>
        </article>
      </ng-template>
    </div>
  </app-popup>

  @if (editingContact(); as contactForm) {
    <app-popup [model]="contactFormPopupModel(contactForm)" [zIndex]="contactFormPopupZIndex()">
      <div class="contact-form-popup contacts-form-content">
        <div class="experience-form-panel contact-form-panel">
          <section class="contact-form-summary">
            <div>
              <strong>{{ contactForm.name }}</strong>
              <p>{{ contactForm.headline || 'Create one-tap ways to reach this member from the contact list.' }}</p>
            </div>
            <span class="contact-form-summary-pill">
              <mat-icon>hub</mat-icon>
              <span>{{ contactForm.methods.length === 1 ? '1 method' : contactForm.methods.length + ' methods' }}</span>
            </span>
          </section>

          <section class="contact-form-actions">
            <div class="contact-form-section-title">
              <h4>Availability Methods</h4>
              <p>Add one or more routes like phone, Facebook, email, Telegram, or a custom link.</p>
            </div>
            <button type="button" class="popup-view-fab" (click)="addMethodRow($event)" aria-label="Add availability method">
              <mat-icon>add_link</mat-icon>
              <span>Add method</span>
            </button>
          </section>

          @if (formErrorMessage()) {
            <p class="contact-form-error">{{ formErrorMessage() }}</p>
          }

          @if (contactForm.methods.length === 0) {
            <div class="contact-form-empty">
              <mat-icon>contact_phone</mat-icon>
              <p>No methods added yet.</p>
            </div>
          }

          @for (method of contactForm.methods; track trackMethod($index, method)) {
            <article class="contact-method-row">
              <div class="contact-method-row-head">
                <app-menu
                  class="contact-method-type-menu"
                  kind="select"
                  [trigger]="methodTypeMenuTrigger(method)"
                  [items]="methodTypeMenuItems(method)"
                  [mobileBreakpointPx]="900"
                  (itemSelect)="onContactsMenuSelect($event)"
                ></app-menu>

                <button
                  type="button"
                  class="experience-action-btn contact-method-remove-btn"
                  (click)="removeMethodRow(method.id, $event)"
                  aria-label="Remove method"
                  >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>

              <label class="contact-method-field">
                <span>{{ methodOption(method.type).label }}</span>
                <input
                  [type]="methodOption(method.type).inputType"
                  [inputMode]="methodOption(method.type).inputMode"
                  [autocomplete]="methodOption(method.type).autocomplete"
                  [placeholder]="methodOption(method.type).placeholder"
                  [(ngModel)]="method.value"
                  />
              </label>

              <p class="contact-method-help">{{ methodOption(method.type).helpText }}</p>
            </article>
          }
      </div>
    </div>
  </app-popup>
  }
}
`, styles: ['/* src/app/profile/components/contacts-popup/contacts-popup.component.scss */\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.contacts-popup-content {\n  width: 100%;\n  min-height: 0;\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.8rem;\n  overflow: hidden;\n}\n.contacts-smart-list {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.contacts-toolbar {\n  display: flex;\n  width: 100%;\n  flex-wrap: wrap;\n  gap: 0.7rem;\n  align-items: center;\n}\n.contacts-search-field {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  flex: 1 1 auto;\n  min-height: 44px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  border: 1px solid rgba(39, 67, 104, 0.14);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.94);\n  padding: 0.16rem 0.18rem 0.16rem 0.7rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 6px 18px rgba(21, 39, 66, 0.06);\n  box-sizing: border-box;\n}\n.contacts-search-field .mat-icon,\n.contact-city .mat-icon,\n.contact-method-chip .mat-icon,\n.contact-form-summary-pill .mat-icon,\n.contact-form-empty .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.contacts-search-field input {\n  flex: 1 1 auto;\n  min-width: 0;\n  border: 0;\n  outline: 0;\n  background: transparent;\n  color: #233a5c;\n  font-size: 0.87rem;\n  font-weight: 600;\n}\n.contacts-search-field input::placeholder {\n  color: rgba(35, 58, 92, 0.48);\n}\n.contacts-search-clear {\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: rgba(220, 231, 245, 0.86);\n  color: #2a4a74;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.contacts-scroll-list {\n  display: grid;\n  gap: 0.7rem;\n  padding-bottom: 1rem;\n}\n.contact-card {\n  position: relative;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  gap: 0.82rem;\n  align-items: start;\n  padding: 0.92rem 0.98rem;\n  border: 1px solid rgba(43, 69, 105, 0.16);\n  border-radius: 22px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.98),\n      rgba(245, 249, 255, 0.98)),\n    radial-gradient(\n      circle at top right,\n      rgba(112, 180, 255, 0.12),\n      transparent 42%);\n  box-shadow: 0 14px 28px rgba(16, 33, 58, 0.08);\n}\n.contact-card.is-menu-open {\n  z-index: 100;\n}\n.contact-avatar-shell {\n  padding-top: 0.1rem;\n}\n.contact-avatar,\n.contact-form-avatar {\n  width: 54px;\n  height: 54px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 0.98rem;\n  font-weight: 800;\n  letter-spacing: 0.03em;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  box-shadow: 0 10px 24px rgba(14, 31, 54, 0.18);\n}\n.contact-avatar.has-photo,\n.contact-form-avatar.has-photo {\n  color: transparent;\n  font-size: 0;\n}\n.contact-copy {\n  min-width: 0;\n  display: grid;\n  gap: 0.42rem;\n}\n.contact-title-row {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.contact-title-wrap {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.contact-title-wrap h3,\n.contact-form-section-title h4 {\n  margin: 0;\n  color: #203a5e;\n}\n.contact-title-wrap h3 {\n  font-size: 1rem;\n  line-height: 1.2;\n}\n.contact-headline,\n.contact-empty-methods,\n.contact-form-section-title p,\n.contact-form-summary p,\n.contact-method-help {\n  margin: 0;\n  color: rgba(28, 51, 82, 0.72);\n  line-height: 1.42;\n}\n.contact-headline {\n  margin-top: 0.16rem;\n  font-size: 0.82rem;\n}\n.contact-headline-muted {\n  color: rgba(40, 62, 92, 0.54);\n}\n.contact-city {\n  margin: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  color: rgba(31, 56, 88, 0.78);\n  font-size: 0.79rem;\n  font-weight: 700;\n}\n.contact-method-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.42rem;\n}\n.contact-method-chip {\n  appearance: none;\n  border: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  min-height: 28px;\n  padding: 0.16rem 0.58rem;\n  border-radius: 999px;\n  background: rgba(227, 236, 248, 0.74);\n  color: #264a74;\n  font-size: 0.74rem;\n  font-weight: 800;\n  cursor: pointer;\n}\n.contact-method-chip-more {\n  background: rgba(35, 66, 102, 0.1);\n  color: rgba(32, 58, 92, 0.76);\n  cursor: default;\n}\n.contact-empty-methods {\n  font-size: 0.79rem;\n}\n.contact-menu-anchor {\n  position: relative;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.experience-action-btn.contact-profile-trigger {\n  appearance: none;\n  box-sizing: border-box;\n  flex: 0 0 36px;\n  width: 36px;\n  min-width: 36px;\n  height: 36px;\n  min-height: 36px;\n  padding: 0;\n  border-radius: 50%;\n  overflow: hidden;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.experience-action-btn.contact-profile-trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  pointer-events: none;\n}\n.experience-action-btn.contact-profile-trigger {\n  border: 1px solid rgba(41, 99, 143, 0.24);\n  background: rgba(232, 246, 251, 0.92);\n  color: #226d83;\n}\n.contact-action-menu-trigger {\n  flex: 0 0 auto;\n}\n.contact-method-chip.contact-method-tone-phone {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(233, 243, 255, 0.98),\n      rgba(219, 234, 252, 0.95));\n  color: #22507f;\n}\n.contact-method-chip.contact-method-tone-sms {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 237, 255, 0.98),\n      rgba(228, 224, 252, 0.95));\n  color: #53409c;\n}\n.contact-method-chip.contact-method-tone-whatsapp {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(233, 250, 239, 0.98),\n      rgba(214, 245, 225, 0.95));\n  color: #1d7a46;\n}\n.contact-method-chip.contact-method-tone-email {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 244, 232, 0.98),\n      rgba(252, 234, 214, 0.95));\n  color: #9a5a1f;\n}\n.contact-method-chip.contact-method-tone-facebook {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(232, 240, 255, 0.98),\n      rgba(216, 229, 252, 0.95));\n  color: #2457a4;\n}\n.contact-method-chip.contact-method-tone-instagram {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 238, 246, 0.98),\n      rgba(252, 222, 236, 0.95));\n  color: #a33d6f;\n}\n.contact-method-chip.contact-method-tone-telegram {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(232, 249, 255, 0.98),\n      rgba(214, 241, 252, 0.95));\n  color: #1f6f90;\n}\n.contact-method-chip.contact-method-tone-linkedin {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(234, 243, 255, 0.98),\n      rgba(219, 232, 252, 0.95));\n  color: #1f5b88;\n}\n.contact-method-chip.contact-method-tone-website {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 244, 250, 0.98),\n      rgba(227, 235, 245, 0.95));\n  color: #46617c;\n}\n.contact-form-popup,\n.contacts-form-content {\n  width: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.contact-form-panel {\n  width: 100%;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  align-items: start;\n  gap: 0.82rem;\n  padding: 0.74rem;\n  box-sizing: border-box;\n  overflow: visible;\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background: #f8fbff;\n}\n.contact-form-summary,\n.contact-form-actions {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.8rem;\n  align-items: start;\n}\n.contact-form-summary {\n  padding: 0.82rem 0.9rem;\n  border-radius: 18px;\n  border: 1px solid rgba(48, 84, 129, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.95),\n      rgba(241, 247, 255, 0.96));\n}\n.contact-form-summary strong {\n  color: #203a5e;\n  font-size: 0.96rem;\n}\n.contact-form-summary-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  min-height: 30px;\n  padding: 0 0.72rem;\n  border-radius: 999px;\n  background: rgba(220, 236, 255, 0.88);\n  color: #295784;\n  font-size: 0.76rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.contact-form-section-title {\n  min-width: 0;\n}\n.contact-form-error {\n  margin: 0;\n  padding: 0.72rem 0.82rem;\n  border-radius: 14px;\n  border: 1px solid rgba(181, 43, 43, 0.18);\n  background: rgba(255, 238, 238, 0.92);\n  color: #9f2f2f;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.contact-form-empty {\n  min-height: 144px;\n  display: grid;\n  place-items: center;\n  gap: 0.32rem;\n  text-align: center;\n  border: 1px dashed rgba(85, 112, 150, 0.28);\n  border-radius: 18px;\n  background: rgba(249, 252, 255, 0.9);\n  color: rgba(34, 58, 90, 0.68);\n}\n.contact-method-row {\n  display: grid;\n  gap: 0.62rem;\n  padding: 0.84rem 0.88rem;\n  border-radius: 18px;\n  border: 1px solid rgba(52, 83, 123, 0.16);\n  background: rgba(255, 255, 255, 0.92);\n}\n.contact-method-row-head {\n  display: flex;\n  gap: 0.7rem;\n  align-items: center;\n}\n.contact-method-type-menu {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.contact-method-remove-btn {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: rgba(255, 236, 236, 0.96);\n  color: #a03a3a;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.contact-method-field {\n  display: grid;\n  gap: 0.38rem;\n}\n.contact-method-field span {\n  color: #29486f;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.contact-method-field input {\n  width: 100%;\n  border: 1px solid rgba(43, 73, 110, 0.16);\n  border-radius: 14px;\n  background: #fbfdff;\n  color: #203a5e;\n  padding: 0.76rem 0.86rem;\n  font-size: 0.86rem;\n  font-weight: 600;\n  box-sizing: border-box;\n}\n.contact-method-help {\n  font-size: 0.76rem;\n}\n@media (hover: hover) and (pointer: fine) {\n  .contacts-search-clear:hover,\n  .contact-profile-trigger:hover,\n  .contact-method-remove-btn:hover,\n  .contact-method-chip:hover {\n    filter: brightness(0.98);\n    transform: translateY(-1px);\n  }\n}\n@media (max-width: 760px) {\n  .contact-card {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .contacts-toolbar,\n  .contact-form-summary,\n  .contact-form-actions {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .contacts-search-field {\n    width: 100%;\n    min-width: 0;\n    flex: 0 0 auto;\n  }\n  .contact-form-panel {\n    padding-bottom: calc(0.9rem + env(safe-area-inset-bottom));\n  }\n  .contact-form-summary-pill {\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=contacts-popup.component.css.map */\n'] }]
  }], () => [], { contactsSmartList: [{
    type: ViewChild,
    args: ["contactsSmartList"]
  }], onEscape: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactsPopupComponent, { className: "ContactsPopupComponent", filePath: "app/profile/components/contacts-popup/contacts-popup.component.ts", lineNumber: 207 });
})();
export {
  ContactsPopupComponent
};
//# sourceMappingURL=contacts-popup.component-POJZIE2F.js.map
