import {
  DemoBootstrapSelectorStore
} from "./chunk-FITZYZRX.js";
import {
  MatButton,
  MatButtonModule,
  PopupComponent
} from "./chunk-GBRBIJ5J.js";
import {
  MatRipple,
  MatRippleModule
} from "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  I18nPipe,
  IndicatorComponent
} from "./chunk-QD6QQNQX.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-SKZXGZPD.js";
import "./chunk-PGZ2PSOM.js";
import "./chunk-PB4YNHSN.js";
import {
  UsersService
} from "./chunk-GABFSQ7T.js";
import {
  UserProfileState
} from "./chunk-5PHTFUHA.js";
import "./chunk-Y2Y4ZDHH.js";
import "./chunk-B7YPVC5F.js";
import {
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
import "./chunk-INZQPXQM.js";
import "./chunk-IECLTXM5.js";
import "./chunk-333NTD7D.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  NgZone,
  Output,
  __spreadValues,
  effect,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/demo-bootstrap-selector/demo-bootstrap-selector.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 17);
  }
  if (rf & 2) {
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const user_r1 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.userAvatarLabel(user_r1), " ");
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275element(1, "span", 15);
    \u0275\u0275elementStart(2, "span", 16);
    \u0275\u0275conditionalCreate(3, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Conditional_1_Conditional_3_Template, 1, 1, "img", 17)(4, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Conditional_1_Conditional_4_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_7_0;
    const user_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("has-photo", !!ctx_r1.userAvatarUrl(user_r1));
    \u0275\u0275property("ngClass", ctx_r1.userAvatarClass(user_r1));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.userAvatarUrl(user_r1)) ? 3 : 4, tmp_7_0);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275conditionalCreate(1, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Conditional_1_Template, 5, 4, "span", 13);
    \u0275\u0275elementStart(2, "span", 14)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const user_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.userAvatarUrl(user_r1) || ctx_r1.userAvatarLabel(user_r1) ? 1 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(user_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 3, "Auto selected"));
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 10);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("durationMs", ctx_r1.userListLoadDurationMs());
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 11);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("position", ctx_r1.loadingPosition());
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.loadingProgress, "%");
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 4)(2, "div", 5)(3, "p", 6);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_6_Template, 8, 5, "div", 7);
    \u0275\u0275elementStart(7, "p", 8);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 9);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275conditionalCreate(12, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_12_Template, 1, 1, "app-indicator", 10)(13, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_13_Template, 1, 1, "app-indicator", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Conditional_14_Template, 2, 1, "p", 12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 9, ctx_r1.submitting ? "Opening demo session" : "Preparing demo selector"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.submitting && ctx_r1.selectedUser()) ? 6 : -1, tmp_3_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 11, ctx_r1.loadingLabel));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(11, 13, "Demo data loading progress"))("aria-valuemin", 0)("aria-valuemax", 100)("aria-valuenow", ctx_r1.loadingUserList ? null : ctx_r1.loadingProgress);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.loadingUserList ? 12 : 13);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.loadingUserList ? 14 : -1);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 4)(2, "div", 5)(3, "p", 6);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 8);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 19);
    \u0275\u0275listener("click", function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_0_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.requestRetry());
    });
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 4, "Selector unavailable"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 6, ctx_r1.errorMessage));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.submitting);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 8, "Try again"), " ");
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 17);
  }
  if (rf & 2) {
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.userAvatarLabel(user_r5), " ");
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275conditionalCreate(1, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_1_Conditional_1_Template, 1, 1, "img", 17)(2, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_1_Conditional_2_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_16_0;
    const user_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("has-photo", !!ctx_r1.userAvatarUrl(user_r5));
    \u0275\u0275property("ngClass", ctx_r1.userAvatarClass(user_r5));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_16_0 = ctx_r1.userAvatarUrl(user_r5)) ? 1 : 2, tmp_16_0);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(user_r5.name.trim());
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "new.demo.profile"));
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "needs.setup"));
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(user_r5.city.trim());
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "needs.setup"));
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 28);
    \u0275\u0275text(4, " \xB7 ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_6_Conditional_5_Template, 2, 1, "span", 29)(6, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_6_Conditional_6_Template, 3, 3, "span", 30);
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.userGenderLabel(user_r5)));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(user_r5.city.trim() ? 5 : 6);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.userStatusLabel(user_r5)));
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Template_button_click_0_listener() {
      const user_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.requestUserSelect(user_r5.id));
    });
    \u0275\u0275conditionalCreate(1, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_1_Template, 3, 4, "span", 23);
    \u0275\u0275conditionalCreate(2, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_2_Template, 2, 1, "span", 24)(3, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_3_Template, 3, 3, "span", 25);
    \u0275\u0275elementStart(4, "span", 26);
    \u0275\u0275conditionalCreate(5, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_5_Template, 3, 3, "span")(6, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_6_Template, 7, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Conditional_7_Template, 3, 3, "span", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("demo-user-item-selected", ctx_r1.selectedUserId.trim() === user_r5.id.trim());
    \u0275\u0275property("ngClass", ctx_r1.userStatusClass(user_r5))("disabled", ctx_r1.submitting)("matRippleColor", "rgba(72, 111, 196, 0.16)");
    \u0275\u0275attribute("data-user-id", user_r5.id);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.userAvatarUrl(user_r5) || ctx_r1.userAvatarLabel(user_r5) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(user_r5.name.trim() ? 2 : 3);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.isNewProfile(user_r5) ? 5 : 6);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.userStatusLabel(user_r5) ? 7 : -1);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275repeaterCreate(1, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_For_2_Template, 8, 10, "button", 21, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("demo-user-grid-submitting", ctx_r1.submitting);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.visibleUsers());
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "p", 8);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 1, "No demo users available."));
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_0_Template, 12, 10, "div", 2)(1, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_1_Template, 3, 2, "div", 18)(2, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Conditional_2_Template, 4, 3, "div", 2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.errorMessage ? 0 : ctx_r1.visibleUsers().length > 0 ? 1 : 2);
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "p", 8);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 1, "Opening demo session..."));
  }
}
function DemoBootstrapSelectorComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1);
    \u0275\u0275conditionalCreate(2, DemoBootstrapSelectorComponent_Conditional_0_Conditional_2_Template, 15, 15, "div", 2)(3, DemoBootstrapSelectorComponent_Conditional_0_Conditional_3_Template, 3, 1);
    \u0275\u0275conditionalCreate(4, DemoBootstrapSelectorComponent_Conditional_0_Conditional_4_Template, 4, 3, "div", 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel())("zIndex", 2800);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.loading ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.submitting && !ctx_r1.loading ? 4 : -1);
  }
}
var DemoBootstrapSelectorComponent = class _DemoBootstrapSelectorComponent {
  demoBootstrapSelectorStore = inject(DemoBootstrapSelectorStore);
  usersService = inject(UsersService);
  injector = inject(Injector);
  changeDetectorRef = inject(ChangeDetectorRef);
  ngZone = inject(NgZone);
  contextRequest = null;
  contextRequestToken = 0;
  contextControlled = false;
  contextSelectorSeedReady = false;
  selectedMode = "member";
  open = false;
  loading = false;
  loadingProgress = 0;
  loadingLabel = "Preparing demo data";
  loadingStage = "selector";
  loadingUserList = false;
  errorMessage = "";
  submitting = false;
  users = [];
  title = "select.demo.user";
  subtitle = "demo.selector.subtitle";
  selectedUserId = "";
  closeRequested = new EventEmitter();
  retryRequested = new EventEmitter();
  userSelected = new EventEmitter();
  newProfileRequested = new EventEmitter();
  constructor() {
    effect(() => {
      const request = this.demoBootstrapSelectorStore.demoBootstrapSelector();
      if (!request) {
        this.resetContextState();
        return;
      }
      this.openContextRequest(request);
    });
  }
  onGlobalEscape(event) {
    if (!this.open || !this.contextRequest) {
      return;
    }
    const keyboardEvent = event;
    if (keyboardEvent.defaultPrevented) {
      return;
    }
    keyboardEvent.stopPropagation();
    this.requestClose();
  }
  requestClose() {
    if (this.submitting) {
      return;
    }
    if (this.contextRequest) {
      this.contextRequest.onClose?.();
      return;
    }
    this.closeRequested.emit();
  }
  popupModel() {
    const headerControls = [];
    const newProfileItems = this.newProfileMenuItems();
    if (newProfileItems.length > 0) {
      headerControls.push({
        id: "new-profile",
        kind: "menu",
        menuKind: "inline",
        items: newProfileItems
      });
    }
    const roleItems = this.selectorRoleMenuItems();
    if (roleItems.length > 0) {
      headerControls.push({
        id: "selector-role",
        kind: "menu",
        menuKind: "select",
        trigger: this.selectorRoleMenuTrigger(),
        items: roleItems,
        panelAlign: "end"
      });
    }
    return {
      title: this.title,
      subtitle: this.subtitle,
      ariaLabel: "Demo user selector",
      closeAriaLabel: "Close demo user popup",
      size: "wide",
      height: "auto",
      headerLayout: "document",
      headerTone: "accent",
      headerPalette: "green",
      headerTitleTone: "neutral",
      bodyLayout: "flush",
      headerControls,
      onClose: () => this.requestClose(),
      onMenuSelect: (event) => this.onPopupMenuSelect(event)
    };
  }
  requestUserSelect(userId) {
    if (this.loading || this.submitting) {
      return;
    }
    if (this.contextRequest) {
      this.selectContextUser(userId);
      return;
    }
    this.userSelected.emit(userId);
  }
  requestRetry() {
    if (this.loading || this.submitting) {
      return;
    }
    if (this.contextRequest) {
      this.openContextRequest(this.contextRequest);
      return;
    }
    this.retryRequested.emit();
  }
  userStatusClass(user) {
    switch (`${user.status ?? ""}`.trim().toUpperCase()) {
      case "B":
        return "demo-user-item-blocked";
      case "D":
        return "demo-user-item-deleted";
      default:
        return this.isNewProfile(user) ? "demo-user-item-new" : "";
    }
  }
  userStatusLabel(user) {
    switch (`${user.status ?? ""}`.trim().toUpperCase()) {
      case "B":
        return "demo.selector.status.blocked";
      case "D":
        return "demo.selector.status.deleted";
      default:
        return this.isNewProfile(user) ? "demo.selector.status.new" : "";
    }
  }
  userGenderLabel(user) {
    return user.gender === "woman" ? "woman" : "man";
  }
  userAvatarClass(user) {
    return this.isNewProfile(user) ? "user-color-setup" : `user-color-${user.gender}`;
  }
  userAvatarLabel(user) {
    return this.isNewProfile(user) ? "" : `${user.initials ?? ""}`.trim();
  }
  userAvatarUrl(user) {
    return this.isNewProfile(user) ? "" : AppUtils.mediaImageVariantUrl(user.avatarUrl, "small");
  }
  isNewProfile(user) {
    return UserProfileState.isEmptyOnboardingProfile(user);
  }
  newProfileMenuItems() {
    if (!this.newProfileAvailable()) {
      return [];
    }
    return [{
      id: "new-profile",
      label: "new.demo.profile",
      icon: "person_add",
      kind: "action",
      palette: "orange",
      disabled: () => this.loading || this.submitting,
      ariaLabel: "Open new demo profile",
      context: { action: "new-profile" }
    }];
  }
  selectorRoleMenuTrigger() {
    return {
      label: this.selectorRoleLabel(this.selectedMode),
      icon: this.selectorRoleIcon(this.selectedMode),
      trailingIcon: "expand_more",
      ariaLabel: "Filter demo users",
      palette: this.selectorRolePalette(this.selectedMode),
      layout: "pill",
      disabled: () => this.submitting
    };
  }
  selectorRoleMenuItems() {
    const modes = this.contextRequest?.selectableModes ?? [this.selectedMode];
    if (modes.length <= 1) {
      return [];
    }
    return modes.map((mode) => ({
      id: mode,
      label: this.selectorRoleLabel(mode),
      icon: this.selectorRoleIcon(mode),
      kind: "radio",
      palette: this.selectorRolePalette(mode),
      surface: "tinted",
      active: () => this.selectedMode === mode,
      disabled: () => this.submitting,
      ariaLabel: `Show ${this.selectorRoleLabel(mode)} demo users`,
      context: { mode }
    }));
  }
  onPopupMenuSelect(event) {
    if (event.control.id === "new-profile") {
      if (event.itemSelect.context && "action" in event.itemSelect.context) {
        this.requestNewProfile();
      }
      return;
    }
    const context = event.itemSelect.context;
    const mode = context && "mode" in context ? context.mode : event.itemSelect.id;
    this.selectContextMode(mode);
  }
  visibleUsers() {
    return this.users.filter((user) => !this.isNewProfile(user));
  }
  selectedUser() {
    const normalizedUserId = this.selectedUserId.trim();
    if (!normalizedUserId) {
      return null;
    }
    return this.users.find((user) => user.id.trim() === normalizedUserId) ?? null;
  }
  loadingPosition() {
    const progress = Number(this.loadingProgress);
    if (!Number.isFinite(progress)) {
      return 0;
    }
    return Math.max(0, Math.min(1, progress / 100));
  }
  userListLoadDurationMs() {
    return 3e3;
  }
  openContextRequest(request) {
    const requestToken = ++this.contextRequestToken;
    this.contextRequest = request;
    this.contextControlled = true;
    this.contextSelectorSeedReady = false;
    this.commit(() => {
      this.open = true;
      this.title = request.title ?? "select.demo.user";
      this.subtitle = request.subtitle ?? "demo.selector.subtitle";
      this.selectedMode = request.mode;
      this.users = request.users?.map((user) => __spreadValues({}, user)) ?? [];
      this.loading = true;
      this.loadingUserList = false;
      this.loadingProgress = 0;
      this.loadingLabel = "Preparing demo data";
      this.loadingStage = "selector";
      this.errorMessage = "";
      this.submitting = false;
      this.selectedUserId = "";
    });
    void this.loadContextUsers(request, requestToken, request.mode, true);
  }
  async loadContextUsers(request, requestToken, mode, showSelectorProgress) {
    await this.waitForPopupPaint();
    if (!this.isCurrentContextRequest(requestToken)) {
      return;
    }
    try {
      if (this.usersService.localModeEnabled && !this.contextSelectorSeedReady) {
        const seedBootstrap = await this.localSeedBootstrap();
        if (showSelectorProgress) {
          await seedBootstrap.ensureDemoSelectorReady(this.selectorSeedMode(request), (state) => {
            if (!this.isCurrentContextRequest(requestToken)) {
              return;
            }
            this.commit(() => {
              this.loadingUserList = false;
              this.loadingProgress = state.percent;
              this.loadingLabel = state.label;
              this.loadingStage = state.stage;
            });
          });
        } else {
          this.commit(() => {
            this.loadingUserList = true;
            this.loadingProgress = 0;
            this.loadingLabel = `Loading ${this.selectorRoleLabel(mode).toLowerCase()} demo users`;
            this.loadingStage = "users";
          });
          await seedBootstrap.ensureDemoSelectorReady(this.selectorSeedMode(request));
        }
        this.contextSelectorSeedReady = true;
        if (showSelectorProgress) {
          await this.waitForPhaseReadyBlink();
        }
      }
      if (!this.isCurrentContextRequest(requestToken)) {
        return;
      }
      let users = mode === request.mode ? request.users?.map((user) => __spreadValues({}, user)) ?? null : null;
      if (!users) {
        this.commit(() => {
          this.loadingUserList = true;
          this.loadingProgress = 0;
          this.loadingLabel = `Loading ${this.selectorRoleLabel(mode).toLowerCase()} demo users`;
          this.loadingStage = "users";
        });
        users = await this.usersService.loadAvailableDemoUsers(mode);
      }
      if (!this.isCurrentContextRequest(requestToken)) {
        return;
      }
      this.commit(() => {
        this.users = users;
        this.errorMessage = "";
        this.loadingUserList = false;
        this.selectedMode = mode;
      });
      const autoSelectUserId = `${request.autoSelectUserId ?? ""}`.trim();
      if (autoSelectUserId && mode === request.mode) {
        const autoSelectedUser = users.find((user) => user.id.trim() === autoSelectUserId) ?? null;
        if (!autoSelectedUser) {
          this.commit(() => {
            this.loading = false;
            this.loadingUserList = false;
            this.loadingProgress = 0;
            this.loadingLabel = "Retry demo selector";
            this.loadingStage = "selector";
            this.errorMessage = "Unable to open selected demo user.";
          });
          return;
        }
        this.selectContextUser(autoSelectUserId);
        return;
      }
      this.commit(() => {
        this.loading = false;
      });
    } catch {
      if (!this.isCurrentContextRequest(requestToken)) {
        return;
      }
      this.commit(() => {
        this.loading = false;
        this.loadingUserList = false;
        this.loadingProgress = 0;
        this.loadingLabel = "Retry demo selector";
        this.loadingStage = "selector";
        this.errorMessage = "Unable to load demo users right now.";
      });
    }
  }
  selectContextUser(userId) {
    if (!this.contextRequest) {
      return;
    }
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const requestToken = this.contextRequestToken;
    if (!this.usersService.localModeEnabled) {
      this.commit(() => {
        this.submitting = true;
        this.selectedUserId = normalizedUserId;
        this.errorMessage = "";
      });
      void this.completeContextSelection(normalizedUserId, this.selectedMode, requestToken);
      return;
    }
    this.commit(() => {
      this.submitting = true;
      this.selectedUserId = normalizedUserId;
      this.loading = true;
      this.loadingUserList = false;
      this.loadingProgress = 0;
      this.loadingLabel = "Preparing demo session";
      this.loadingStage = "session";
      this.errorMessage = "";
    });
    void this.prepareContextUser(normalizedUserId, this.selectedMode, requestToken);
  }
  selectContextMode(mode) {
    if (!this.contextRequest) {
      return;
    }
    const normalizedMode = mode === "admin" || mode === "operator" ? mode : "member";
    if (normalizedMode === this.selectedMode || this.submitting) {
      return;
    }
    if (!this.contextRequest.selectableModes.includes(normalizedMode)) {
      return;
    }
    const request = this.contextRequest;
    const requestToken = ++this.contextRequestToken;
    this.commit(() => {
      this.selectedMode = normalizedMode;
      this.users = [];
      this.selectedUserId = "";
      this.loading = true;
      this.loadingUserList = true;
      this.loadingProgress = 0;
      this.loadingLabel = `Loading ${this.selectorRoleLabel(normalizedMode).toLowerCase()} demo users`;
      this.loadingStage = "users";
      this.errorMessage = "";
    });
    void this.loadContextUsers(request, requestToken, normalizedMode, false);
  }
  requestNewProfile() {
    if (this.loading || this.submitting) {
      return;
    }
    if (this.contextRequest) {
      this.selectContextNewProfile();
      return;
    }
    this.newProfileRequested.emit();
  }
  selectContextNewProfile() {
    if (!this.contextRequest?.onNewProfile) {
      return;
    }
    const requestToken = this.contextRequestToken;
    this.commit(() => {
      this.submitting = true;
      this.selectedUserId = "";
      this.loading = true;
      this.loadingUserList = false;
      this.loadingProgress = 0;
      this.loadingLabel = "Opening profile setup";
      this.loadingStage = "session";
      this.errorMessage = "";
    });
    void this.completeContextNewProfileSelection(requestToken);
  }
  async prepareContextUser(userId, mode, requestToken) {
    await this.waitForPopupPaint();
    if (!this.isCurrentContextRequest(requestToken) || !this.contextRequest) {
      return;
    }
    try {
      const onProgress = (state) => {
        if (!this.isCurrentContextRequest(requestToken)) {
          return;
        }
        this.commit(() => {
          this.loadingProgress = state.percent;
          this.loadingLabel = state.label;
          this.loadingStage = state.stage;
        });
      };
      if (this.usersService.localModeEnabled) {
        const seedBootstrap = await this.localSeedBootstrap();
        await seedBootstrap.ensureUserReady(userId, mode, onProgress);
      } else {
        await this.usersService.prepareDemoUserSession(userId, onProgress);
      }
      if (!this.isCurrentContextRequest(requestToken)) {
        return;
      }
      this.commit(() => {
        this.loadingProgress = 100;
        this.loadingLabel = "Demo session ready";
        this.loadingStage = "sessionReady";
      });
      await this.waitForLoaderCompletionBeat();
      if (!this.isCurrentContextRequest(requestToken)) {
        return;
      }
      await this.completeContextSelection(userId, mode, requestToken);
    } catch {
      if (this.isCurrentContextRequest(requestToken)) {
        this.resetContextSelectionFailure("Unable to open demo session.");
      }
    }
  }
  async localSeedBootstrap() {
    const { SeedDemoBootstrapService } = await import("./demo-bootstrap.service-GHG6E63G.js");
    return this.injector.get(SeedDemoBootstrapService);
  }
  async completeContextSelection(userId, mode, requestToken) {
    const request = this.contextRequest;
    if (!request || !this.isCurrentContextRequest(requestToken)) {
      return;
    }
    try {
      const result = await request.onSelect(userId, mode);
      if (!this.isCurrentContextRequest(requestToken)) {
        return;
      }
      if (result !== false && typeof result !== "string") {
        return;
      }
      this.resetContextSelectionFailure(typeof result === "string" && result.trim() ? result.trim() : "Unable to open selected demo user.");
    } catch {
      if (this.isCurrentContextRequest(requestToken)) {
        this.resetContextSelectionFailure("Unable to open selected demo user.");
      }
    }
  }
  async completeContextNewProfileSelection(requestToken) {
    const request = this.contextRequest;
    if (!request?.onNewProfile || !this.isCurrentContextRequest(requestToken)) {
      return;
    }
    try {
      const accepted = await request.onNewProfile();
      if (!this.isCurrentContextRequest(requestToken)) {
        return;
      }
      if (accepted !== false) {
        return;
      }
      this.resetContextSelectionFailure("Unable to open profile setup.");
    } catch {
      if (this.isCurrentContextRequest(requestToken)) {
        this.resetContextSelectionFailure("Unable to open profile setup.");
      }
    }
  }
  newProfileAvailable() {
    if (this.contextRequest) {
      return this.selectedMode === "member" && Boolean(this.contextRequest.onNewProfile);
    }
    return true;
  }
  selectorSeedMode(request) {
    return request.selectableModes.length > 1 ? "union" : request.mode;
  }
  selectorRoleLabel(mode) {
    return mode === "admin" ? "Admin" : mode === "operator" ? "Operator" : "Member";
  }
  selectorRoleIcon(mode) {
    return mode === "admin" ? "admin_panel_settings" : mode === "operator" ? "dns" : "person";
  }
  selectorRolePalette(mode) {
    return mode === "admin" ? "blue" : mode === "operator" ? "violet" : "green";
  }
  resetContextSelectionFailure(message) {
    this.commit(() => {
      this.loading = false;
      this.loadingUserList = false;
      this.submitting = false;
      this.selectedUserId = "";
      this.loadingProgress = 0;
      this.loadingLabel = "Preparing demo data";
      this.loadingStage = "selector";
      this.errorMessage = message;
    });
  }
  isCurrentContextRequest(requestToken) {
    return this.open && this.contextRequestToken === requestToken && this.contextRequest !== null;
  }
  resetContextState() {
    if (!this.contextControlled) {
      return;
    }
    this.contextRequestToken += 1;
    this.contextRequest = null;
    this.contextControlled = false;
    this.contextSelectorSeedReady = false;
    this.open = false;
    this.loading = false;
    this.loadingUserList = false;
    this.loadingProgress = 0;
    this.loadingLabel = "Preparing demo data";
    this.loadingStage = "selector";
    this.errorMessage = "";
    this.submitting = false;
    this.selectedUserId = "";
    this.users = [];
    this.selectedMode = "member";
    this.changeDetectorRef.markForCheck();
  }
  commit(update) {
    this.ngZone.run(() => {
      update();
      this.changeDetectorRef.detectChanges();
    });
  }
  waitForPopupPaint() {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setTimeout(resolve, 80);
          });
        });
        return;
      }
      setTimeout(resolve, 80);
    });
  }
  waitForLoaderCompletionBeat() {
    return new Promise((resolve) => setTimeout(resolve, 240));
  }
  waitForPhaseReadyBlink() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
  static \u0275fac = function DemoBootstrapSelectorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DemoBootstrapSelectorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DemoBootstrapSelectorComponent, selectors: [["app-demo-bootstrap-selector"]], hostBindings: function DemoBootstrapSelectorComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function DemoBootstrapSelectorComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onGlobalEscape($event);
      }, \u0275\u0275resolveWindow);
    }
  }, inputs: { open: "open", loading: "loading", loadingProgress: "loadingProgress", loadingLabel: "loadingLabel", loadingStage: "loadingStage", errorMessage: "errorMessage", submitting: "submitting", users: "users", title: "title", subtitle: "subtitle", selectedUserId: "selectedUserId" }, outputs: { closeRequested: "closeRequested", retryRequested: "retryRequested", userSelected: "userSelected", newProfileRequested: "newProfileRequested" }, decls: 1, vars: 1, consts: [[3, "model", "zIndex"], [1, "demo-user-stage"], [1, "demo-user-grid", "demo-user-grid-loading"], [1, "demo-user-submit-overlay"], [1, "demo-user-loading-shell"], [1, "demo-user-loading-copy-group"], [1, "demo-user-loading-eyebrow"], [1, "demo-user-selected-session"], [1, "demo-user-loading-copy"], ["role", "progressbar", 1, "demo-user-progress-shell"], ["kind", "load-ring", "state", "loading", 3, "durationMs"], ["kind", "pill-bar", 3, "position"], [1, "demo-user-progress-value"], [1, "demo-user-selected-avatar-wrap"], [1, "demo-user-selected-copy"], ["aria-hidden", "true", 1, "demo-user-selected-ring"], ["data-i18n-ignore", "", 1, "user-avatar", 3, "ngClass"], ["alt", "", 3, "src"], [1, "demo-user-grid", 3, "demo-user-grid-submitting"], ["mat-flat-button", "", "type", "button", 1, "demo-user-retry-btn", 3, "click", "disabled"], [1, "demo-user-grid"], ["type", "button", "matRipple", "", 1, "demo-user-item", 3, "ngClass", "demo-user-item-selected", "disabled", "matRippleColor"], ["type", "button", "matRipple", "", 1, "demo-user-item", 3, "click", "ngClass", "disabled", "matRippleColor"], ["data-i18n-ignore", "", 1, "user-avatar", 3, "has-photo", "ngClass"], ["data-i18n-ignore", "", 1, "demo-user-name"], [1, "demo-user-name"], [1, "demo-user-meta"], [1, "demo-user-status-pill"], ["aria-hidden", "true", 1, "demo-user-meta-separator"], ["data-i18n-ignore", "", 1, "demo-user-city"], [1, "demo-user-city"]], template: function DemoBootstrapSelectorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, DemoBootstrapSelectorComponent_Conditional_0_Template, 5, 4, "app-popup", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.open ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    MatButtonModule,
    MatButton,
    MatRippleModule,
    MatRipple,
    PopupComponent,
    IndicatorComponent,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: contents;\n  font-family: var(--entry-font-family, "Nunito Sans", "Segoe UI", sans-serif);\n}\n.demo-user-stage[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 0;\n  height: clamp(22rem, 62vh, 31rem);\n}\n.demo-user-grid[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  height: 100%;\n  padding: 0.92rem 1rem 1rem;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.45rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  min-height: 0;\n}\n.demo-user-grid-submitting[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.demo-user-grid-loading[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n  place-items: center;\n  min-height: 0;\n  overflow: hidden;\n}\n.demo-user-loading-copy[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--entry-text-muted, rgba(34, 50, 74, 0.72));\n  font-size: 0.88rem;\n  font-weight: 600;\n  text-align: center;\n}\n.demo-user-loading-shell[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: grid;\n  place-items: center;\n  padding: 1.2rem;\n  box-sizing: border-box;\n}\n.demo-user-loading-copy-group[_ngcontent-%COMP%] {\n  width: min(100%, 32rem);\n  display: grid;\n  gap: 0.75rem;\n  justify-items: center;\n  text-align: center;\n}\n.demo-user-loading-eyebrow[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(44, 87, 150, 0.78);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n.demo-user-progress-shell[_ngcontent-%COMP%] {\n  width: min(100%, 23rem);\n}\n.demo-user-progress-value[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(27, 50, 84, 0.82);\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.demo-user-selected-session[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.62rem;\n  min-width: min(100%, 17rem);\n  padding: 0.44rem 0.68rem 0.44rem 0.48rem;\n  border: 1px solid rgba(66, 107, 174, 0.22);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n  box-shadow: 0 10px 22px rgba(20, 40, 72, 0.1);\n}\n.demo-user-selected-avatar-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  width: 44px;\n  height: 44px;\n  display: inline-grid;\n  place-items: center;\n  flex: 0 0 auto;\n}\n.demo-user-selected-avatar-wrap[_ngcontent-%COMP%]   .user-avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  font-size: 0.84rem;\n  position: relative;\n  z-index: 1;\n}\n.demo-user-selected-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  border: 2px solid rgba(66, 116, 202, 0.16);\n  border-top-color: rgba(66, 116, 202, 0.82);\n  animation: _ngcontent-%COMP%_demo-user-selected-ring-spin 0.9s linear infinite;\n}\n.demo-user-selected-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.06rem;\n  text-align: left;\n}\n.demo-user-selected-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--entry-text-main, #22324a);\n  font-size: 0.88rem;\n  line-height: 1.1;\n}\n.demo-user-selected-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(44, 87, 150, 0.78);\n  font-size: 0.72rem;\n  font-weight: 800;\n  line-height: 1.1;\n}\n.demo-user-retry-btn[_ngcontent-%COMP%] {\n  min-width: 8.5rem;\n  border-radius: 999px;\n}\n.demo-user-item[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  height: 5rem;\n  border: 1px solid var(--entry-line, rgba(23, 33, 54, 0.12));\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.55rem;\n  cursor: pointer;\n  display: grid;\n  grid-template-columns: 38px minmax(0, 1fr);\n  grid-template-rows: auto auto;\n  column-gap: 0.58rem;\n  row-gap: 0.08rem;\n  align-content: center;\n  align-items: center;\n  text-align: left;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    border-color 0.16s ease;\n}\n.demo-user-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 10px 18px rgba(13, 27, 57, 0.08);\n}\n.demo-user-item[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n}\n.demo-user-item-selected[_ngcontent-%COMP%] {\n  border-color: rgba(63, 112, 203, 0.48);\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #edf4ff 100%);\n  box-shadow: inset 3px 0 0 rgba(63, 112, 203, 0.85);\n}\n.demo-user-item.demo-user-item-blocked[_ngcontent-%COMP%] {\n  border-color: rgba(181, 59, 72, 0.35);\n  background:\n    linear-gradient(\n      180deg,\n      #fff6f6 0%,\n      #fde9e9 100%);\n}\n.demo-user-item.demo-user-item-deleted[_ngcontent-%COMP%] {\n  border-color: rgba(97, 105, 118, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f8fa 0%,\n      #e9edf2 100%);\n}\n.demo-user-item.demo-user-item-new[_ngcontent-%COMP%] {\n  border-color: rgba(38, 130, 97, 0.38);\n  background:\n    linear-gradient(\n      180deg,\n      #f7fffb 0%,\n      #e8f8ef 100%);\n}\n.demo-user-item[_ngcontent-%COMP%]   .user-avatar[_ngcontent-%COMP%], \n.demo-user-item[_ngcontent-%COMP%]   .demo-user-name[_ngcontent-%COMP%], \n.demo-user-item[_ngcontent-%COMP%]   .demo-user-meta[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.demo-user-item[_ngcontent-%COMP%]   .user-avatar[_ngcontent-%COMP%] {\n  grid-column: 1;\n  grid-row: 1/span 2;\n  align-self: center;\n}\n.demo-user-item[_ngcontent-%COMP%]   .demo-user-name[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 1;\n  align-self: end;\n  min-width: 0;\n}\n.demo-user-item[_ngcontent-%COMP%]   .demo-user-meta[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 2;\n  align-self: start;\n  min-width: 0;\n}\n.demo-user-submit-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 1rem;\n  background: rgba(255, 255, 255, 0.76);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.user-avatar[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 50%;\n  overflow: hidden;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.user-avatar.has-photo[_ngcontent-%COMP%] {\n  background: #eef3f9;\n}\n.user-avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center;\n}\n.user-avatar.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ff87b7 0%,\n      #ec4b93 100%);\n}\n.user-avatar.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #74a2ff 0%,\n      #3968d8 100%);\n}\n.user-avatar.user-color-setup[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #78d4b8 0%,\n      #2a8f73 100%);\n}\n.demo-user-name[_ngcontent-%COMP%] {\n  font-size: 0.86rem;\n  font-weight: 700;\n  color: var(--entry-text-main, #22324a);\n}\n.demo-user-meta[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  color: var(--entry-text-muted, rgba(34, 50, 74, 0.72));\n}\n.demo-user-status-pill[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.48rem;\n  right: 0.5rem;\n  z-index: 1;\n  padding: 0.16rem 0.44rem;\n  border-radius: 999px;\n  font-size: 0.66rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0;\n}\n.demo-user-item-blocked[_ngcontent-%COMP%]   .demo-user-status-pill[_ngcontent-%COMP%] {\n  background: #b53b48;\n  color: #fff;\n}\n.demo-user-item-deleted[_ngcontent-%COMP%]   .demo-user-status-pill[_ngcontent-%COMP%] {\n  background: #657080;\n  color: #fff;\n}\n.demo-user-item-new[_ngcontent-%COMP%]   .demo-user-status-pill[_ngcontent-%COMP%] {\n  background: #268261;\n  color: #fff;\n}\n@media (max-width: 760px) {\n  .demo-user-stage[_ngcontent-%COMP%] {\n    height: 100%;\n  }\n  .demo-user-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    padding-bottom: calc(1rem + env(safe-area-inset-bottom));\n  }\n  .demo-user-grid-loading[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n    justify-items: center;\n    align-items: center;\n  }\n  .demo-user-loading-shell[_ngcontent-%COMP%] {\n    padding: max(1.2rem, env(safe-area-inset-top)) 1.4rem max(1.2rem + env(safe-area-inset-bottom), 1.2rem);\n  }\n  .demo-user-loading-copy-group[_ngcontent-%COMP%] {\n    width: min(100%, 24rem);\n  }\n  .demo-user-progress-shell[_ngcontent-%COMP%] {\n    width: min(100%, 18.5rem);\n    margin-inline: auto;\n  }\n}\n@keyframes _ngcontent-%COMP%_demo-user-selected-ring-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=demo-bootstrap-selector.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DemoBootstrapSelectorComponent, [{
    type: Component,
    args: [{ selector: "app-demo-bootstrap-selector", standalone: true, imports: [
      CommonModule,
      MatButtonModule,
      MatRippleModule,
      PopupComponent,
      IndicatorComponent,
      I18nPipe
    ], template: `@if (open) {
  <app-popup [model]="popupModel()" [zIndex]="2800">
    <div class="demo-user-stage">
        @if (loading) {
          <div class="demo-user-grid demo-user-grid-loading">
            <div class="demo-user-loading-shell">
              <div class="demo-user-loading-copy-group">
                <p class="demo-user-loading-eyebrow">
                  {{ (submitting ? 'Opening demo session' : 'Preparing demo selector') | i18n }}
                </p>
                @if (submitting && selectedUser(); as user) {
                  <div class="demo-user-selected-session">
                    @if (userAvatarUrl(user) || userAvatarLabel(user)) {
                      <span class="demo-user-selected-avatar-wrap">
                        <span class="demo-user-selected-ring" aria-hidden="true"></span>
                        <span
                          class="user-avatar"
                          [class.has-photo]="!!userAvatarUrl(user)"
                          [ngClass]="userAvatarClass(user)"
                          data-i18n-ignore
                          >
                          @if (userAvatarUrl(user); as avatarUrl) {
                            <img [src]="avatarUrl" alt="" />
                          } @else {
                            {{ userAvatarLabel(user) }}
                          }
                        </span>
                      </span>
                    }
                    <span class="demo-user-selected-copy">
                      <strong>{{ user.name }}</strong>
                      <small>{{ 'Auto selected' | i18n }}</small>
                    </span>
                  </div>
                }
                <p class="demo-user-loading-copy">{{ loadingLabel | i18n }}</p>
                <div
                  class="demo-user-progress-shell"
                  role="progressbar"
                  [attr.aria-label]="'Demo data loading progress' | i18n"
                  [attr.aria-valuemin]="0"
                  [attr.aria-valuemax]="100"
                  [attr.aria-valuenow]="loadingUserList ? null : loadingProgress"
                  >
                  @if (loadingUserList) {
                    <app-indicator
                      kind="load-ring"
                      state="loading"
                      [durationMs]="userListLoadDurationMs()"
                    ></app-indicator>
                  } @else {
                    <app-indicator
                      kind="pill-bar"
                      [position]="loadingPosition()"
                    ></app-indicator>
                  }
                </div>
                @if (!loadingUserList) {
                  <p class="demo-user-progress-value">{{ loadingProgress }}%</p>
                }
              </div>
            </div>
          </div>
        } @else {
          @if (errorMessage) {
            <div class="demo-user-grid demo-user-grid-loading">
              <div class="demo-user-loading-shell">
                <div class="demo-user-loading-copy-group">
                  <p class="demo-user-loading-eyebrow">{{ 'Selector unavailable' | i18n }}</p>
                  <p class="demo-user-loading-copy">{{ errorMessage | i18n }}</p>
                  <button
                    mat-flat-button
                    type="button"
                    class="demo-user-retry-btn"
                    [disabled]="submitting"
                    (click)="requestRetry()"
                  >
                    {{ 'Try again' | i18n }}
                  </button>
                </div>
              </div>
            </div>
          } @else if (visibleUsers().length > 0) {
            <div class="demo-user-grid" [class.demo-user-grid-submitting]="submitting">
              @for (user of visibleUsers(); track user.id) {
                <button
                  type="button"
                  class="demo-user-item"
                  [attr.data-user-id]="user.id"
                  [ngClass]="userStatusClass(user)"
                  [class.demo-user-item-selected]="selectedUserId.trim() === user.id.trim()"
                  [disabled]="submitting"
                  matRipple
                  [matRippleColor]="'rgba(72, 111, 196, 0.16)'"
                  (click)="requestUserSelect(user.id)"
                  >
                  @if (userAvatarUrl(user) || userAvatarLabel(user)) {
                    <span
                      class="user-avatar"
                      [class.has-photo]="!!userAvatarUrl(user)"
                      [ngClass]="userAvatarClass(user)"
                      data-i18n-ignore
                      >
                      @if (userAvatarUrl(user); as avatarUrl) {
                        <img [src]="avatarUrl" alt="" />
                      } @else {
                        {{ userAvatarLabel(user) }}
                      }
                    </span>
                  }
                  @if (user.name.trim()) {
                    <span class="demo-user-name" data-i18n-ignore>{{ user.name.trim() }}</span>
                  } @else {
                    <span class="demo-user-name">{{ 'new.demo.profile' | i18n }}</span>
                  }
                  <span class="demo-user-meta">
                    @if (isNewProfile(user)) {
                      <span>{{ 'needs.setup' | i18n }}</span>
                    } @else {
                      <span>{{ userGenderLabel(user) | i18n }}</span>
                      <span class="demo-user-meta-separator" aria-hidden="true"> \xB7 </span>
                      @if (user.city.trim()) {
                        <span class="demo-user-city" data-i18n-ignore>{{ user.city.trim() }}</span>
                      } @else {
                        <span class="demo-user-city">{{ 'needs.setup' | i18n }}</span>
                      }
                    }
                  </span>
                  @if (userStatusLabel(user)) {
                    <span class="demo-user-status-pill">{{ userStatusLabel(user) | i18n }}</span>
                  }
                </button>
              }
            </div>
          } @else {
            <div class="demo-user-grid demo-user-grid-loading">
              <p class="demo-user-loading-copy">{{ 'No demo users available.' | i18n }}</p>
            </div>
          }
        }
        @if (submitting && !loading) {
          <div class="demo-user-submit-overlay">
            <p class="demo-user-loading-copy">{{ 'Opening demo session...' | i18n }}</p>
          </div>
        }
    </div>
  </app-popup>
}
`, styles: ['/* src/app/shared/ui/components/demo-bootstrap-selector/demo-bootstrap-selector.component.scss */\n:host {\n  display: contents;\n  font-family: var(--entry-font-family, "Nunito Sans", "Segoe UI", sans-serif);\n}\n.demo-user-stage {\n  position: relative;\n  min-height: 0;\n  height: clamp(22rem, 62vh, 31rem);\n}\n.demo-user-grid {\n  box-sizing: border-box;\n  height: 100%;\n  padding: 0.92rem 1rem 1rem;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.45rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  min-height: 0;\n}\n.demo-user-grid-submitting {\n  pointer-events: none;\n}\n.demo-user-grid-loading {\n  grid-template-columns: minmax(0, 1fr);\n  place-items: center;\n  min-height: 0;\n  overflow: hidden;\n}\n.demo-user-loading-copy {\n  margin: 0;\n  color: var(--entry-text-muted, rgba(34, 50, 74, 0.72));\n  font-size: 0.88rem;\n  font-weight: 600;\n  text-align: center;\n}\n.demo-user-loading-shell {\n  width: 100%;\n  height: 100%;\n  display: grid;\n  place-items: center;\n  padding: 1.2rem;\n  box-sizing: border-box;\n}\n.demo-user-loading-copy-group {\n  width: min(100%, 32rem);\n  display: grid;\n  gap: 0.75rem;\n  justify-items: center;\n  text-align: center;\n}\n.demo-user-loading-eyebrow {\n  margin: 0;\n  color: rgba(44, 87, 150, 0.78);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n.demo-user-progress-shell {\n  width: min(100%, 23rem);\n}\n.demo-user-progress-value {\n  margin: 0;\n  color: rgba(27, 50, 84, 0.82);\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.demo-user-selected-session {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.62rem;\n  min-width: min(100%, 17rem);\n  padding: 0.44rem 0.68rem 0.44rem 0.48rem;\n  border: 1px solid rgba(66, 107, 174, 0.22);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n  box-shadow: 0 10px 22px rgba(20, 40, 72, 0.1);\n}\n.demo-user-selected-avatar-wrap {\n  position: relative;\n  width: 44px;\n  height: 44px;\n  display: inline-grid;\n  place-items: center;\n  flex: 0 0 auto;\n}\n.demo-user-selected-avatar-wrap .user-avatar {\n  width: 36px;\n  height: 36px;\n  font-size: 0.84rem;\n  position: relative;\n  z-index: 1;\n}\n.demo-user-selected-ring {\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  border: 2px solid rgba(66, 116, 202, 0.16);\n  border-top-color: rgba(66, 116, 202, 0.82);\n  animation: demo-user-selected-ring-spin 0.9s linear infinite;\n}\n.demo-user-selected-copy {\n  display: grid;\n  gap: 0.06rem;\n  text-align: left;\n}\n.demo-user-selected-copy strong {\n  color: var(--entry-text-main, #22324a);\n  font-size: 0.88rem;\n  line-height: 1.1;\n}\n.demo-user-selected-copy small {\n  color: rgba(44, 87, 150, 0.78);\n  font-size: 0.72rem;\n  font-weight: 800;\n  line-height: 1.1;\n}\n.demo-user-retry-btn {\n  min-width: 8.5rem;\n  border-radius: 999px;\n}\n.demo-user-item {\n  position: relative;\n  overflow: hidden;\n  height: 5rem;\n  border: 1px solid var(--entry-line, rgba(23, 33, 54, 0.12));\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.55rem;\n  cursor: pointer;\n  display: grid;\n  grid-template-columns: 38px minmax(0, 1fr);\n  grid-template-rows: auto auto;\n  column-gap: 0.58rem;\n  row-gap: 0.08rem;\n  align-content: center;\n  align-items: center;\n  text-align: left;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    border-color 0.16s ease;\n}\n.demo-user-item:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 10px 18px rgba(13, 27, 57, 0.08);\n}\n.demo-user-item:disabled {\n  cursor: default;\n}\n.demo-user-item-selected {\n  border-color: rgba(63, 112, 203, 0.48);\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #edf4ff 100%);\n  box-shadow: inset 3px 0 0 rgba(63, 112, 203, 0.85);\n}\n.demo-user-item.demo-user-item-blocked {\n  border-color: rgba(181, 59, 72, 0.35);\n  background:\n    linear-gradient(\n      180deg,\n      #fff6f6 0%,\n      #fde9e9 100%);\n}\n.demo-user-item.demo-user-item-deleted {\n  border-color: rgba(97, 105, 118, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f8fa 0%,\n      #e9edf2 100%);\n}\n.demo-user-item.demo-user-item-new {\n  border-color: rgba(38, 130, 97, 0.38);\n  background:\n    linear-gradient(\n      180deg,\n      #f7fffb 0%,\n      #e8f8ef 100%);\n}\n.demo-user-item .user-avatar,\n.demo-user-item .demo-user-name,\n.demo-user-item .demo-user-meta {\n  position: relative;\n  z-index: 1;\n}\n.demo-user-item .user-avatar {\n  grid-column: 1;\n  grid-row: 1/span 2;\n  align-self: center;\n}\n.demo-user-item .demo-user-name {\n  grid-column: 2;\n  grid-row: 1;\n  align-self: end;\n  min-width: 0;\n}\n.demo-user-item .demo-user-meta {\n  grid-column: 2;\n  grid-row: 2;\n  align-self: start;\n  min-width: 0;\n}\n.demo-user-submit-overlay {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 1rem;\n  background: rgba(255, 255, 255, 0.76);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.user-avatar {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 50%;\n  overflow: hidden;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.user-avatar.has-photo {\n  background: #eef3f9;\n}\n.user-avatar img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center;\n}\n.user-avatar.user-color-woman {\n  background:\n    linear-gradient(\n      180deg,\n      #ff87b7 0%,\n      #ec4b93 100%);\n}\n.user-avatar.user-color-man {\n  background:\n    linear-gradient(\n      180deg,\n      #74a2ff 0%,\n      #3968d8 100%);\n}\n.user-avatar.user-color-setup {\n  background:\n    linear-gradient(\n      180deg,\n      #78d4b8 0%,\n      #2a8f73 100%);\n}\n.demo-user-name {\n  font-size: 0.86rem;\n  font-weight: 700;\n  color: var(--entry-text-main, #22324a);\n}\n.demo-user-meta {\n  font-size: 0.74rem;\n  color: var(--entry-text-muted, rgba(34, 50, 74, 0.72));\n}\n.demo-user-status-pill {\n  position: absolute;\n  top: 0.48rem;\n  right: 0.5rem;\n  z-index: 1;\n  padding: 0.16rem 0.44rem;\n  border-radius: 999px;\n  font-size: 0.66rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0;\n}\n.demo-user-item-blocked .demo-user-status-pill {\n  background: #b53b48;\n  color: #fff;\n}\n.demo-user-item-deleted .demo-user-status-pill {\n  background: #657080;\n  color: #fff;\n}\n.demo-user-item-new .demo-user-status-pill {\n  background: #268261;\n  color: #fff;\n}\n@media (max-width: 760px) {\n  .demo-user-stage {\n    height: 100%;\n  }\n  .demo-user-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    padding-bottom: calc(1rem + env(safe-area-inset-bottom));\n  }\n  .demo-user-grid-loading {\n    grid-template-columns: minmax(0, 1fr);\n    justify-items: center;\n    align-items: center;\n  }\n  .demo-user-loading-shell {\n    padding: max(1.2rem, env(safe-area-inset-top)) 1.4rem max(1.2rem + env(safe-area-inset-bottom), 1.2rem);\n  }\n  .demo-user-loading-copy-group {\n    width: min(100%, 24rem);\n  }\n  .demo-user-progress-shell {\n    width: min(100%, 18.5rem);\n    margin-inline: auto;\n  }\n}\n@keyframes demo-user-selected-ring-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=demo-bootstrap-selector.component.css.map */\n'] }]
  }], () => [], { open: [{
    type: Input
  }], loading: [{
    type: Input
  }], loadingProgress: [{
    type: Input
  }], loadingLabel: [{
    type: Input
  }], loadingStage: [{
    type: Input
  }], errorMessage: [{
    type: Input
  }], submitting: [{
    type: Input
  }], users: [{
    type: Input
  }], title: [{
    type: Input
  }], subtitle: [{
    type: Input
  }], selectedUserId: [{
    type: Input
  }], closeRequested: [{
    type: Output
  }], retryRequested: [{
    type: Output
  }], userSelected: [{
    type: Output
  }], newProfileRequested: [{
    type: Output
  }], onGlobalEscape: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DemoBootstrapSelectorComponent, { className: "DemoBootstrapSelectorComponent", filePath: "app/shared/ui/components/demo-bootstrap-selector/demo-bootstrap-selector.component.ts", lineNumber: 82 });
})();
export {
  DemoBootstrapSelectorComponent
};
//# sourceMappingURL=demo-bootstrap-selector.component-BYMX54E7.js.map
